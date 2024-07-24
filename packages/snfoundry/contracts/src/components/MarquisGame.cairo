// SPDX-License-Identifier: MIT
// @author : Carlos Ramos
// @notice : Base component for all The-Marquis-Game contracts

use starknet::ContractAddress;

#[starknet::component]
pub mod MarquisGame {
    use contracts::interfaces::IMarquisGame::{
        Session, SessionData, IMarquisGame, GameStatus, GameErrors, GameConstants,
        VerifiableRandomNumber
    };
    use core::num::traits::Zero;
    use core::traits::Into;
    use keccak::keccak_u256s_le_inputs;
    use openzeppelin::access::ownable::OwnableComponent::InternalTrait as OwnableInternalTrait;
    use openzeppelin::access::ownable::OwnableComponent;
    use openzeppelin::token::erc20::interface::{IERC20CamelDispatcher, IERC20CamelDispatcherTrait};
    use starknet::eth_signature::{verify_eth_signature, public_key_point_to_eth_address};
    use starknet::secp256_trait::{Signature, signature_from_vrs, recover_public_key};
    use starknet::secp256k1::Secp256k1Point;
    use starknet::{get_caller_address, get_contract_address, get_block_timestamp, EthAddress};
    use super::{ContractAddress};


    /// @notice Event emitted when a new campaign is created
    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        CampaignCreated: CampaignCreated,
    }


    /// @notice Structure for storing details about a campaign
    #[derive(Drop, starknet::Event)]
    struct CampaignCreated {
        #[key]
        campaign_id: u256,
        owner: ContractAddress,
        target_amount: u256,
        deadline: u256,
        data_cid: ByteArray,
    }

    const FEE_BASIS: u16 = 10000;

    /// @notice Storage structure for the MarquisGame component
    #[storage]
    struct Storage {
        name: ByteArray,
        session_players: LegacyMap<(u256, u32), ContractAddress>,
        player_session: LegacyMap<ContractAddress, u256>,
        supported_token_with_fee: LegacyMap<ContractAddress, (bool, u16)>,
        sessions: LegacyMap<u256, Session>,
        session_counter: u256,
        max_players: u32,
        min_players: u32,
        join_waiting_time: u64,
        play_waiting_time: u64,
        initialized: bool,
        marquis_oracle_address: EthAddress,
        maqruis_core_address: ContractAddress,
    }

    #[embeddable_as(MarquisGameImpl)]
    impl MarquisGame<
        TContractState,
        +HasComponent<TContractState>,
        +OwnableComponent::HasComponent<TContractState>,
        +Drop<TContractState>
    > of IMarquisGame<ComponentState<TContractState>> {
        /// @notice Creates a new game session
        /// @param token The address of the token to be used in the session
        /// @param amount The amount of tokens to be used in the session
        /// @return session_id The ID of the newly created session
        fn create_session(
            ref self: ComponentState<TContractState>, token: ContractAddress, amount: u256
        ) -> u256 {
            let mut session_id = self.session_counter.read() + 1;
            let player = get_caller_address();
            self._require_player_has_no_session(player);
            self._lock_user_to_session(session_id, player);
            self.session_counter.write(session_id);

            // transfer the funds
            self._require_payment_if_token_non_zero(token, amount);

            let mut new_session = Session {
                id: session_id,
                player_count: 1,
                next_player_id: 0,
                nonce: 0,
                start_time: get_block_timestamp(),
                last_play_time: get_block_timestamp() + self.join_waiting_time.read(),
                play_amount: amount,
                play_token: token,
            };
            self.sessions.write(session_id, new_session);
            self.session_players.write((session_id, 0), player);
            session_id
        }

        /// @notice Allows a player to join an existing game session
        /// @param session_id The ID of the session to join
        fn join_session(ref self: ComponentState<TContractState>, session_id: u256) {
            let mut session = self.sessions.read(session_id);
            self._require_session_waiting(session_id);
            let player = get_caller_address();
            self._require_player_has_no_session(player);
            self._lock_user_to_session(session_id, player);

            // transfer the right amount of tokens
            self._require_payment_if_token_non_zero(session.play_token, session.play_amount);

            // update session
            self.session_players.write((session.id, session.player_count), player);
            session.player_count += 1;
            self.sessions.write(session_id, session);
        }

        /// @notice Gets the name of the game
        /// @return The name of the game as a ByteArray
        fn name(self: @ComponentState<TContractState>) -> ByteArray {
            self.name.read()
        }

        /// @notice Gets data of a specific game session
        /// @param session_id The ID of the session
        /// @return SessionData The data of the session
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

        /// @notice Gets the address of the Marquis Oracle
        /// @return EthAddress The address of the Marquis Oracle
        fn marquis_oracle_address(self: @ComponentState<TContractState>) -> EthAddress {
            self.marquis_oracle_address.read()
        }

        /// @notice Adds a supported token with an associated fee
        /// @param token_address The address of the token to be added
        /// @param fee The fee associated with the token
        fn add_supported_token(
            ref self: ComponentState<TContractState>, token_address: ContractAddress, fee: u16
        ) {
            self._add_supported_token(token_address, fee);
        }

        /// @notice Removes a supported token
        /// @param token_address The address of the token to be removed
        fn remove_supported_token(
            ref self: ComponentState<TContractState>, token_address: ContractAddress
        ) {
            self._remove_supported_token(token_address);
        }
    }

    #[generate_trait]
    pub impl InternalImpl<
        TContractState,
        +HasComponent<TContractState>,
        impl Ownable: OwnableComponent::HasComponent<TContractState>,
        +Drop<TContractState>
    > of InternalTrait<TContractState> {
        /// @notice Checks if a player is not part of any session
        /// @param player The address of the player
        fn _require_player_has_no_session(
            ref self: ComponentState<TContractState>, player: ContractAddress
        ) {
            let session_id = self.player_session.read(player);
            assert(session_id == 0, GameErrors::PLAYER_HAS_SESSION);
        }

        /// @notice Ensures the next player in the session is the caller
        /// @param session_id The ID of the session
        /// @param player The address of the player
        fn _require_next_player_in_session(
            ref self: ComponentState<TContractState>, session_id: u256, player: ContractAddress
        ) {
            let (_session_next_player_id, _time_left_to_play) = self
                ._session_next_player_id(session_id);
            let session_player = self.session_players.read((session_id, _session_next_player_id));
            assert(session_player == player, GameErrors::NOT_PLAYER_TURN);
        }

        /// @notice Ensures the session is in the waiting state
        /// @param session_id The ID of the session
        fn _require_session_waiting(ref self: ComponentState<TContractState>, session_id: u256) {
            assert(
                self._session_status(session_id) == GameStatus::WAITING,
                GameErrors::SESSION_NOT_WAITING
            );
        }

        /// @notice Ensures the session is in the playing state
        /// @param session_id The ID of the session
        fn _require_session_playing(ref self: ComponentState<TContractState>, session_id: u256) {
            assert(
                self._session_status(session_id) == GameStatus::PLAYING,
                GameErrors::SESSION_NOT_PLAYING
            );
        }

        /// @notice Ensures the session exists
        /// @param session_id The ID of the session
        fn _require_session_exists(ref self: ComponentState<TContractState>, session_id: u256) {
            let session: Session = self.sessions.read(session_id);
            assert(session.id != 0, GameErrors::SESSION_NOT_FOUND);
        }

        /// @notice Locks a user to a session
        /// @param session_id The ID of the session
        /// @param player The address of the player
        fn _lock_user_to_session(
            ref self: ComponentState<TContractState>, session_id: u256, player: ContractAddress
        ) {
            self.player_session.write(player, session_id);
        }

        /// @notice Unlocks a user from a session
        /// @param session_id The ID of the session
        /// @param player The address of the player
        fn _unlock_user_from_session(
            ref self: ComponentState<TContractState>, session_id: u256, player: ContractAddress
        ) {
            self.player_session.write(player, 0);
            // reduce the player count
            let mut session: Session = self.sessions.read(session_id);
            session.player_count -= 1;
            self.sessions.write(session_id, session);
        }

        /// @notice Ensures the contract is initialized
        fn _require_initialized(ref self: ComponentState<TContractState>) {
            assert(self.initialized.read(), GameErrors::NOT_INITIALIZED);
        }

        /// @notice Performs necessary checks and updates before a play action
        /// @param session_id The ID of the session
        /// @param verifiableRandomNumberArray Array of verifiable random numbers
        /// @return (Session, Array<u256>) The session and array of random numbers
        fn _before_play(
            ref self: ComponentState<TContractState>,
            session_id: u256,
            mut verifiableRandomNumberArray: Array<VerifiableRandomNumber>
        ) -> (Session, Array<u256>) {
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
            let mut _random_number_array: Array<u256> = array![];
            loop {
                if (verifiableRandomNumberArray.len() == 0) {
                    break;
                }
                let verifiableRandomNumber = verifiableRandomNumberArray.pop_front().unwrap();
                let _random_number = verifiableRandomNumber.random_number;
                let _v = verifiableRandomNumber.v;
                let _r = verifiableRandomNumber.r;
                let _s = verifiableRandomNumber.s;

                let u256_inputs = array![
                    session.id, session.nonce, _random_number, player_as_u256, this_contract_as_u256
                ];
                let message_hash = keccak_u256s_le_inputs(u256_inputs.span());
                verify_eth_signature(
                    message_hash, signature_from_vrs(_v, _r, _s), self.marquis_oracle_address.read()
                );
                _random_number_array.append(_random_number);
            };

            self
                .sessions
                .write(
                    session.id,
                    Session {
                        id: session.id,
                        player_count: session.player_count,
                        next_player_id: session.next_player_id,
                        nonce: session.nonce,
                        start_time: session.start_time,
                        last_play_time: session.last_play_time,
                        play_amount: session.play_amount,
                        play_token: session.play_token,
                    }
                );

            (session, _random_number_array)
        }

        /// @notice Updates session details after a play action
        /// @param session_id The ID of the session
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

        /// @notice Finishes a session and unlocks all players
        /// @param session_id The ID of the session
        /// @param winner_id The ID of the winning player
        fn _finish_session(
            ref self: ComponentState<TContractState>, session_id: u256, winner_id: u32
        ) {
            let mut session: Session = self.sessions.read(session_id);
            // unlock all players
            let mut it: u32 = 0;
            let total_play_amount: u256 = session.player_count.into() * session.play_amount;
            loop {
                let player = self.session_players.read((session.id, it));
                if player == Zero::zero() {
                    break;
                }
                if it == winner_id {
                    self
                        ._execute_payout_if_token_non_zero(
                            session.play_token, total_play_amount, player
                        );
                }
                self._unlock_user_from_session(session.id, player);
                it += 1;
            };
            self.sessions.write(session.id, session);
        }

        /// @notice Gets the status of a session
        /// @param session_id The ID of the session
        /// @return felt252 The status of the session
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

        /// @notice Gets the next player ID and time left to play in a session
        /// @param session_id The ID of the session
        /// @return (u32, u64) The next player ID and time left to play
        fn _session_next_player_id(
            self: @ComponentState<TContractState>, session_id: u256
        ) -> (u32, u64) {
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

        /// @notice Checks if the token is supported
        /// @param token_address The address of the token to check
        /// @return u16 The fee associated with the token
        fn _require_supported_token(
            ref self: ComponentState<TContractState>, token_address: ContractAddress
        ) -> u16 {
            let (is_token_supported, fee): (bool, u16) = self
                .supported_token_with_fee
                .read(token_address);
            assert(is_token_supported, GameErrors::UNSUPPORTED_TOKEN);
            fee
        }

        /// @notice Asserts that the provided fee is valid
        /// @param fee The fee to be checked
        fn _assert_valid_fee(ref self: ComponentState<TContractState>, fee: u16) {
            assert(fee <= FEE_BASIS, GameErrors::INVALID_FEE);
        }

        /// @notice Requires payment if the token is non-zero
        /// @param token The address of the token
        /// @param amount The amount to be transferred
        fn _require_payment_if_token_non_zero(
            ref self: ComponentState<TContractState>, token: ContractAddress, amount: u256
        ) {
            if token != Zero::zero() {
                self._require_supported_token(token);
                IERC20CamelDispatcher { contract_address: token }
                    .transferFrom(get_caller_address(), get_contract_address(), amount);
            }
        }

        /// @notice Executes payout if the token is non-zero
        /// @param token The address of the token
        /// @param amount The amount to be paid out
        /// @param payout_addr The address to receive the payout
        fn _execute_payout_if_token_non_zero(
            ref self: ComponentState<TContractState>,
            token: ContractAddress,
            mut amount: u256,
            payout_addr: ContractAddress
        ) {
            if token != Zero::zero() {
                let fee = self._require_supported_token(token);
                let total_fee: u256 = fee.into() * amount / FEE_BASIS.into();

                IERC20CamelDispatcher { contract_address: token }
                    .transfer(self.maqruis_core_address.read(), total_fee);

                amount -= total_fee;

                IERC20CamelDispatcher { contract_address: token }.transfer(payout_addr, amount);
            }
        }

        fn _add_supported_token(
            ref self: ComponentState<TContractState>, token_address: ContractAddress, fee: u16
        ) {
            let mut ownable_component = get_dep_component_mut!(ref self, Ownable);
            ownable_component.assert_only_owner();
            self._assert_valid_fee(fee);
            self.supported_token_with_fee.write(token_address, (true, fee));
        }

        fn _remove_supported_token(
            ref self: ComponentState<TContractState>, token_address: ContractAddress
        ) {
            let mut ownable_component = get_dep_component_mut!(ref self, Ownable);
            ownable_component.assert_only_owner();
            self.supported_token_with_fee.write(token_address, (false, 0));
        }

        /// @notice Initializes the MarquisGame component with the provided parameters
        /// @param name The name of the game
        /// @param max_players The maximum number of players
        /// @param min_players The minimum number of players
        /// @param join_waiting_time The waiting time to join the game
        /// @param play_waiting_time The waiting time to play the game
        /// @param marquis_core_addr The address of the Marquis core
        fn initializer(
            ref self: ComponentState<TContractState>,
            name: ByteArray,
            max_players: u32,
            min_players: u32,
            join_waiting_time: u64,
            play_waiting_time: u64,
            marquis_oracle_address: EthAddress,
            marquis_core_address: ContractAddress,
            owner: ContractAddress
        ) {
            assert(!self.initialized.read(), GameErrors::ALREADY_INITIALIZED);
            assert(
                max_players >= min_players
                    && play_waiting_time >= GameConstants::MIN_PLAY_WAITING_TIME
                    && play_waiting_time <= GameConstants::MAX_PLAY_WAITING_TIME
                    && join_waiting_time >= GameConstants::MIN_JOIN_WAITING_TIME
                    && join_waiting_time <= GameConstants::MAX_JOIN_WAITING_TIME,
                GameErrors::WRONG_INIT_PARAMS
            );
            self.name.write(name);
            self.max_players.write(max_players);
            self.min_players.write(min_players);
            self.join_waiting_time.write(join_waiting_time);
            self.play_waiting_time.write(play_waiting_time);
            self.marquis_oracle_address.write(marquis_oracle_address);
            self.maqruis_core_address.write(marquis_core_address);

            let mut ownable_component = get_dep_component_mut!(ref self, Ownable);
            ownable_component.initializer(owner);
            self.initialized.write(true);
        }
    }
}
