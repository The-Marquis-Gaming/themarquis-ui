// SPDX-License-Identifier: MIT
// @author : Carlos Ramos
// @notice : base component for all the-marquis-game contracts
use starknet::ContractAddress;

#[starknet::component]
pub mod MarquisGame {

    use contracts::interfaces::IMarquisGame::{Session, IMarquisGame, GameStatus, GameErrors};
    use super::{ContractAddress};
    use starknet::{get_caller_address, get_contract_address, EthAddress};
    use keccak::keccak_u256s_le_inputs;
    use starknet::eth_signature::{verify_eth_signature, public_key_point_to_eth_address};
    use starknet::secp256_trait::{Signature, signature_from_vrs, recover_public_key};
    use starknet::secp256k1::Secp256k1Point;
    // use starknet::syscalls::keccak_syscall
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
        initialized: bool,
        marquis_oracle_address: EthAddress,
    }

    #[embeddable_as(MarquisGameImpl)]
    impl MarquisGame <TContractState, +HasComponent<TContractState>> of IMarquisGame<ComponentState<TContractState>> {
        fn create_session(ref self: ComponentState<TContractState>) -> u256 {
            let mut session_id = self.session_counter.read() + 1;
            self.session_counter.write(session_id);
            let mut new_session = Session {
                id: session_id,
                player_count: 1,
                status: GameStatus::WAITING,
                next_player_id: 0,
                nonce: 0,
            };
            self.sessions.write(session_id, new_session);
            self.session_players.write((session_id, 0), get_caller_address());
            session_id
        }
        fn join_session(ref self: ComponentState<TContractState>, session_id: u256) {
            let mut session = self.sessions.read(session_id);
            self._require_session_waiting(session.status);
            let player = get_caller_address();
            self._require_player_has_no_session(player);
            self._lock_user_to_session(session.id, player);

            // udpdate session
            session.player_count += 1;
            self.session_players.write((session.id, session.player_count), player);
            self.sessions.write(session_id, session);
        }

        // getters
        fn name(self: @ComponentState<TContractState>) -> ByteArray {
            self.name.read()
        }

        fn session(self: @ComponentState<TContractState>, session_id: u256) -> Session {
            self.sessions.read(session_id)
        }

        fn marquis_oracle_address(self: @ComponentState<TContractState>) -> EthAddress {
            self.marquis_oracle_address.read()
        }
    }
    #[generate_trait]
    pub impl InternalImpl<TContractState, +HasComponent<TContractState>> of InternalTrait<TContractState> {
        fn _require_player_has_no_session(ref self: ComponentState<TContractState>, player: ContractAddress) {
            let session_id = self.player_session.read(player);
            assert(session_id == 0, GameErrors::PLAYER_HAS_SESSION);
        }
        fn _require_next_player_in_session(ref self: ComponentState<TContractState>, session_id: u256, next_player_id: u256, player: ContractAddress) {
            let session_player = self.session_players.read((session_id, next_player_id));
            assert(session_player == player, GameErrors::NOT_PLAYER_TURN);
        }
        fn _require_session_waiting(ref self: ComponentState<TContractState>, status: felt252) {
            assert(status == GameStatus::WAITING, GameErrors::SESSION_NOT_WAITING);
        }
        fn _require_session_playing(ref self: ComponentState<TContractState>, status: felt252) {
            assert(status == GameStatus::PLAYING, GameErrors::SESSION_NOT_PLAYING);
        }

        fn _require_session_exists(ref self: ComponentState<TContractState>, status: felt252) {
            assert(status != 0, GameErrors::SESSION_NOT_FOUND);
        }

        fn _lock_user_to_session(ref self: ComponentState<TContractState>, session_id: u256, player: ContractAddress) {
            self.player_session.write(player, session_id);
        }
        fn _unlock_user_from_session(ref self: ComponentState<TContractState>, session_id: u256, player: ContractAddress) {
            self.player_session.write(player, 0);
        }
        fn _require_initialized(ref self: ComponentState<TContractState>) {
            assert(self.initialized.read(), GameErrors::NOT_INITIALIZED);
        }

        fn _before_play(ref self: ComponentState<TContractState>, session_id: u256, random_number: u256, v: u32, r: u256, s: u256) {
            // read the session
            let mut session : Session = self.sessions.read(session_id);
            let player = get_caller_address();
            // pre checks
            self._require_initialized();
            // self._require_session_playing(session.status);
            self._require_next_player_in_session(session.id, session.next_player_id, player);
            // update session play_count
            session.nonce += 1;
            let player_as_felt252: felt252 = get_caller_address().into();
            let player_as_u256:u256 = player_as_felt252.into();
            let this_contract_as_felt252: felt252 = get_contract_address().into();
            let this_contract_as_u256:u256 = this_contract_as_felt252.into();
            let u256_inputs = array![session.id, session.nonce, random_number, player_as_u256, this_contract_as_u256];
            let message_hash = keccak_u256s_le_inputs(u256_inputs.span());
            // verify_eth_signature(message_hash, signature_from_vrs(v, r, s), self.marquis_oracle_address.read());
            self.sessions.write(session.id, session);
        }

        fn _after_play(ref self: ComponentState<TContractState>, session_id: u256) {
            let mut session: Session = self.sessions.read(session_id);
            session.next_player_id += 1;
            // do a final check to see if the game is finished
            self._check_and_update_session_status(session);
        }

        fn _check_and_update_session_status(ref self: ComponentState<TContractState>, mut session: Session) {
            if session.next_player_id == session.player_count {
                session.status = GameStatus::FINISHED;
            }
            self.sessions.write(session.id, session);
        }

        fn _initialize(ref self: ComponentState<TContractState>, name: ByteArray, max_players: u256, marquis_core_addr: EthAddress) {
            self.name.write(name);
            self.max_players.write(max_players);
            self.marquis_oracle_address.write(marquis_core_addr);
            self.initialized.write(true);
        }
    }
}