// SPDX-License-Identifier: MIT
// @author : Carlos Ramos
// @notice : base component for all the-marquis-game contracts
use starknet::ContractAddress;

#[starknet::component]
pub mod MarquisGame {
    use contracts::interfaces::IMarquisGame::{
        Session, SessionData, IMarquisGame, GameStatus, GameErrors
    };
    use core::num::traits::Zero;
    use keccak::keccak_u256s_le_inputs;
    use starknet::eth_signature::{verify_eth_signature, public_key_point_to_eth_address};
    use starknet::secp256_trait::{Signature, signature_from_vrs, recover_public_key};
    use starknet::secp256k1::Secp256k1Point;
    use starknet::{get_caller_address, get_contract_address, get_block_timestamp, EthAddress};
    use super::{ContractAddress};


    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        CampaignCreated: CampaignCreated,
    }


    #[derive(Drop, starknet::Event)]
    struct CampaignCreated {
        #[key]
        campaign_id: u256,
        owner: ContractAddress,
        target_amount: u256,
        deadline: u256,
        data_cid: ByteArray,
    }

    #[storage]
    struct Storage {
        name: ByteArray,
        session_players: LegacyMap<(u256, u256), ContractAddress>,
        player_session: LegacyMap<ContractAddress, u256>,
        sessions: LegacyMap<u256, Session>,
        session_counter: u256,
        max_players: u256,
        min_players: u256,
        join_waiting_time: u64,
        play_waiting_time: u64,
        initialized: bool,
        marquis_oracle_address: EthAddress,
    }

    #[embeddable_as(MarquisGameImpl)]
    impl MarquisGame<
        TContractState, +HasComponent<TContractState>
    > of IMarquisGame<ComponentState<TContractState>> {
        fn create_session(ref self: ComponentState<TContractState>) -> u256 {
            let mut session_id = self.session_counter.read() + 1;
            let player = get_caller_address();
            self._require_player_has_no_session(player);
            self._lock_user_to_session(session_id, player);
            self.session_counter.write(session_id);
            let mut new_session = Session {
                id: session_id,
                player_count: 1,
                next_player_id: 0,
                nonce: 0,
                start_time: get_block_timestamp(),
                last_play_time: get_block_timestamp() + self.join_waiting_time.read(),
            };
            self.sessions.write(session_id, new_session);
            self.session_players.write((session_id, 0), player);
            session_id
        }
        fn join_session(ref self: ComponentState<TContractState>, session_id: u256) {
            let mut session = self.sessions.read(session_id);
            self._require_session_waiting(session_id);
            let player = get_caller_address();
            self._require_player_has_no_session(player);
            self._lock_user_to_session(session_id, player);

            // udpdate session
            self.session_players.write((session.id, session.player_count), player);
            session.player_count += 1;
            self.sessions.write(session_id, session);
        }

        // getters
        fn name(self: @ComponentState<TContractState>) -> ByteArray {
            self.name.read()
        }

        fn session(self: @ComponentState<TContractState>, session_id: u256) -> SessionData {
            let session: Session = self.sessions.read(session_id);
            let (_session_next_player_id, _time_left_to_play) = self
                ._session_next_player_id(session_id);
            let time_since_start = (get_block_timestamp() - session.start_time);
            let mut time_left_to_join = 0;
            if time_since_start <= self.join_waiting_time.read() {
                time_left_to_join = self.join_waiting_time.read() - time_since_start;
            }
            SessionData {
                player_count: session.player_count,
                status: self._session_status(session_id),
                next_player: self.session_players.read((session_id, _session_next_player_id)),
                nonce: session.nonce,
                start_time: session.start_time,
                last_play_time: session.last_play_time,
                time_left_to_play: _time_left_to_play,
                time_left_to_join
            }
        }

        fn marquis_oracle_address(self: @ComponentState<TContractState>) -> EthAddress {
            self.marquis_oracle_address.read()
        }
    }
    #[generate_trait]
    pub impl InternalImpl<
        TContractState, +HasComponent<TContractState>
    > of InternalTrait<TContractState> {
        fn _require_player_has_no_session(
            ref self: ComponentState<TContractState>, player: ContractAddress
        ) {
            let session_id = self.player_session.read(player);
            assert(session_id == 0, GameErrors::PLAYER_HAS_SESSION);
        }
        fn _require_next_player_in_session(
            ref self: ComponentState<TContractState>, session_id: u256, player: ContractAddress
        ) {
            let (_session_next_player_id, _time_left_to_play) = self
                ._session_next_player_id(session_id);
            let session_player = self.session_players.read((session_id, _session_next_player_id));
            assert(session_player == player, GameErrors::NOT_PLAYER_TURN);
        }
        fn _require_session_waiting(ref self: ComponentState<TContractState>, session_id: u256) {
            assert(
                self._session_status(session_id) == GameStatus::WAITING,
                GameErrors::SESSION_NOT_WAITING
            );
        }
        fn _require_session_playing(ref self: ComponentState<TContractState>, session_id: u256) {
            assert(
                self._session_status(session_id) == GameStatus::PLAYING,
                GameErrors::SESSION_NOT_PLAYING
            );
        }

        fn _require_session_exists(ref self: ComponentState<TContractState>, session_id: u256) {
            let session: Session = self.sessions.read(session_id);
            assert(session.id != 0, GameErrors::SESSION_NOT_FOUND);
        }

        fn _lock_user_to_session(
            ref self: ComponentState<TContractState>, session_id: u256, player: ContractAddress
        ) {
            self.player_session.write(player, session_id);
        }
        fn _unlock_user_from_session(
            ref self: ComponentState<TContractState>, session_id: u256, player: ContractAddress
        ) {
            self.player_session.write(player, 0);
            // reduce the player count
            let mut session: Session = self.sessions.read(session_id);
            session.player_count -= 1;
            self.sessions.write(session_id, session);
        }
        fn _require_initialized(ref self: ComponentState<TContractState>) {
            assert(self.initialized.read(), GameErrors::NOT_INITIALIZED);
        }

        fn _before_play(
            ref self: ComponentState<TContractState>,
            session_id: u256,
            random_number: u256,
            v: u32,
            r: u256,
            s: u256
        ) {
            // read the session
            let mut session: Session = self.sessions.read(session_id);
            let player = get_caller_address();
            // pre checks
            self._require_initialized();
            // self._require_session_playing(session.status);
            self._require_next_player_in_session(session.id, player);
            // update session play_count
            session.nonce += 1;
            let player_as_felt252: felt252 = get_caller_address().into();
            let player_as_u256: u256 = player_as_felt252.into();
            let this_contract_as_felt252: felt252 = get_contract_address().into();
            let this_contract_as_u256: u256 = this_contract_as_felt252.into();
            let u256_inputs = array![
                session.id, session.nonce, random_number, player_as_u256, this_contract_as_u256
            ];
            let message_hash = keccak_u256s_le_inputs(u256_inputs.span());
            // verify_eth_signature(message_hash, signature_from_vrs(v, r, s), self.marquis_oracle_address.read());
            self.sessions.write(session.id, session);
        }

        fn _after_play(ref self: ComponentState<TContractState>, session_id: u256) {
            let mut session: Session = self.sessions.read(session_id);
            let (_session_next_player_id, _time_left_to_play) = self
                ._session_next_player_id(session_id);
            if _session_next_player_id + 1 == session.player_count {
                session.next_player_id = 0;
            } else {
                session.next_player_id = _session_next_player_id + 1;
            }
            session.last_play_time = get_block_timestamp();
            self.sessions.write(session.id, session);
        }

        fn _finish_session(ref self: ComponentState<TContractState>, mut session: Session) {
            // unlock all players
            let mut it: u256 = 0;
            loop {
                let player = self.session_players.read((session.id, it));
                if player == Zero::zero() {
                    break;
                }
                self._unlock_user_from_session(session.id, player);
                it += 1;
            };
            self.sessions.write(session.id, session);
        }

        fn _session_status(self: @ComponentState<TContractState>, session_id: u256) -> felt252 {
            let session: Session = self.sessions.read(session_id);
            let time_since_start = (get_block_timestamp() - session.start_time);

            if time_since_start <= self.join_waiting_time.read()
                && session.player_count < self.max_players.read() {
                return GameStatus::WAITING;
            }
            if time_since_start > self.join_waiting_time.read()
                && session.player_count >= self.min_players.read() {
                return GameStatus::PLAYING;
            }
            return GameStatus::FINISHED;
        }

        fn _session_next_player_id(
            self: @ComponentState<TContractState>, session_id: u256
        ) -> (u256, u64) {
            let session: Session = self.sessions.read(session_id);

            if self._session_status(session_id) != GameStatus::PLAYING {
                return (session.next_player_id, 0);
            }

            // get the next player based on the play waiting time and the session.last_play_time
            let mut time_since_last_play = (get_block_timestamp() - session.last_play_time);
            let mut next_player_id = session.next_player_id;

            loop {
                if time_since_last_play <= self.play_waiting_time.read() {
                    break;
                }
                if next_player_id == session.player_count - 1 {
                    next_player_id = 0;
                } else {
                    next_player_id += 1;
                }
                time_since_last_play -= self.play_waiting_time.read();
            };

            (next_player_id, self.play_waiting_time.read() - time_since_last_play)
        }

        fn _initialize(
            ref self: ComponentState<TContractState>,
            name: ByteArray,
            max_players: u256,
            min_players: u256,
            join_waiting_time: u64,
            play_waiting_time: u64,
            marquis_core_addr: EthAddress
        ) {
            self.name.write(name);
            self.max_players.write(max_players);
            self.min_players.write(min_players);
            self.join_waiting_time.write(join_waiting_time);
            self.play_waiting_time.write(play_waiting_time);
            self.marquis_oracle_address.write(marquis_core_addr);
            self.initialized.write(true);
        }
    }
}
