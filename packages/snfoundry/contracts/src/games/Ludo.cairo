// SPDX-License-Identifier: MIT
// @author: Carlos Ramos
// @notice: Ludo game contract

#[starknet::contract]
pub mod Ludo {
    use contracts::components::MarquisGame::MarquisGame;
    use contracts::interfaces::{
        ILudo::{ILudo, LudoMove, LudoSessionStatus, SessionFinished, SessionUserStatus, TokenMove},
        IMarquisGame::{InitParams, Session, SessionData, VerifiableRandomNumber},
    };
    use openzeppelin_access::ownable::OwnableComponent;
    use openzeppelin_access::ownable::interface::{IOwnableDispatcher, IOwnableDispatcherTrait};
    use openzeppelin_upgrades::interface::IUpgradeable;
    use openzeppelin_upgrades::upgradeable::UpgradeableComponent;
    use starknet::storage::Map;
    use starknet::{ClassHash, ContractAddress, EthAddress};

    component!(path: MarquisGame, storage: marquis_game, event: MarquisGameEvent);
    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);
    component!(path: UpgradeableComponent, storage: upgradeable, event: UpgradeableEvent);

    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;
    impl UpgradeableInternalImpl = UpgradeableComponent::InternalImpl<ContractState>;

    #[abi(embed_v0)]
    impl MarquisGameImpl = MarquisGame::MarquisGameImpl<ContractState>;

    impl MarquisGameInternalImpl = MarquisGame::InternalImpl<ContractState>;

    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        #[flat]
        MarquisGameEvent: MarquisGame::Event,
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        #[flat]
        UpgradeableEvent: UpgradeableComponent::Event,
        TokenMove: TokenMove,
        SessionFinished: SessionFinished,
    }

    const MAX_PINS: u256 = 4;
    const INVALID_PIN_ID: felt252 = 'INVALID PIN ID';
    const INVALID_MOVE: felt252 = 'INVALID MOVE';
    const INVALID_NUMBER_ARRAY: felt252 = 'INVALID NUMBER ARRAY';

    #[storage]
    struct Storage {
        // ToDo: Improve naming, `token`` is confusing, maybe use `pieces`
        player_tokens: Map<(u256, u32, u256), u256>, // Track positions of each player's tokens
        winning_tokens: Map<(u256, u32, u256), bool>, // Track winning tokens
        winning_token_count: Map<(u256, u32), u32>, // Track winning token count of each player
        token_circled: Map<(u256, u32, u256), bool>, // Track if token has circled once
        #[substorage(v0)]
        marquis_game: MarquisGame::Storage,
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        #[substorage(v0)]
        upgradeable: UpgradeableComponent::Storage,
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        marquis_oracle_address: EthAddress,
        marquis_core_address: ContractAddress,
    ) {
        let owner = IOwnableDispatcher { contract_address: marquis_core_address }.owner();
        self
            .marquis_game
            .initializer(
                InitParams {
                    name: "Ludo",
                    required_players: 4, // Should be dynamic
                    max_random_number: 6,
                    marquis_oracle_address,
                    marquis_core_address,
                    owner,
                },
            );
    }

    #[abi(embed_v0)]
    impl UpgradeableImpl of IUpgradeable<ContractState> {
        fn upgrade(ref self: ContractState, new_class_hash: ClassHash) {
            self.ownable.assert_only_owner();
            self.upgradeable.upgrade(new_class_hash);
        }
    }

    #[abi(embed_v0)]
    impl LudoImpl of ILudo<ContractState> {
        /// @notice Play a move in the Ludo game
        /// @param session_id The ID of the session
        /// @param ludo_move The move to be played
        /// @param verifiableRandomNumberArray Array of verifiable random numbers
        fn play(
            ref self: ContractState,
            session_id: u256,
            ludo_move: LudoMove,
            mut verifiableRandomNumberArray: Array<VerifiableRandomNumber>,
        ) {
            let (session, mut random_number_array) = self
                .marquis_game
                ._before_play(session_id, verifiableRandomNumberArray, false);
            self._process_play(session, session_id, ludo_move, random_number_array);
        }

        fn owner_play(
            ref self: ContractState,
            session_id: u256,
            ludo_move: LudoMove,
            mut verifiableRandomNumberArray: Array<VerifiableRandomNumber>,
        ) {
            self.ownable.assert_only_owner();
            let (_session, mut random_number_array) = self
                .marquis_game
                ._before_play(session_id, verifiableRandomNumberArray, true);
            self._process_play(_session, session_id, ludo_move, random_number_array);
        }


        fn get_session_status(
            self: @ContractState, session_id: u256,
        ) -> (SessionData, LudoSessionStatus) {
            // get current session
            let session = self.marquis_game._get_session(session_id);

            let mut session_status = LudoSessionStatus {
                users: ( //Todo: refactor this data structure
                    SessionUserStatus {
                        player_id: 0,
                        player_tokens_position: (
                            self.player_tokens.read((session_id, 0, 0)),
                            self.player_tokens.read((session_id, 0, 1)),
                            self.player_tokens.read((session_id, 0, 2)),
                            self.player_tokens.read((session_id, 0, 3)),
                        ),
                        player_winning_tokens: (
                            self.winning_tokens.read((session_id, 0, 0)),
                            self.winning_tokens.read((session_id, 0, 1)),
                            self.winning_tokens.read((session_id, 0, 2)),
                            self.winning_tokens.read((session_id, 0, 3)),
                        ),
                        player_tokens_circled: (
                            self.token_circled.read((session_id, 0, 0)),
                            self.token_circled.read((session_id, 0, 1)),
                            self.token_circled.read((session_id, 0, 2)),
                            self.token_circled.read((session_id, 0, 3)),
                        ),
                    },
                    SessionUserStatus {
                        player_id: 1,
                        player_tokens_position: (
                            self.player_tokens.read((session_id, 1, 0)),
                            self.player_tokens.read((session_id, 1, 1)),
                            self.player_tokens.read((session_id, 1, 2)),
                            self.player_tokens.read((session_id, 1, 3)),
                        ),
                        player_winning_tokens: (
                            self.winning_tokens.read((session_id, 1, 0)),
                            self.winning_tokens.read((session_id, 1, 1)),
                            self.winning_tokens.read((session_id, 1, 2)),
                            self.winning_tokens.read((session_id, 1, 3)),
                        ),
                        player_tokens_circled: (
                            self.token_circled.read((session_id, 1, 0)),
                            self.token_circled.read((session_id, 1, 1)),
                            self.token_circled.read((session_id, 1, 2)),
                            self.token_circled.read((session_id, 1, 3)),
                        ),
                    },
                    SessionUserStatus {
                        player_id: 2,
                        player_tokens_position: (
                            self.player_tokens.read((session_id, 2, 0)),
                            self.player_tokens.read((session_id, 2, 1)),
                            self.player_tokens.read((session_id, 2, 2)),
                            self.player_tokens.read((session_id, 2, 3)),
                        ),
                        player_winning_tokens: (
                            self.winning_tokens.read((session_id, 2, 0)),
                            self.winning_tokens.read((session_id, 2, 1)),
                            self.winning_tokens.read((session_id, 2, 2)),
                            self.winning_tokens.read((session_id, 2, 3)),
                        ),
                        player_tokens_circled: (
                            self.token_circled.read((session_id, 2, 0)),
                            self.token_circled.read((session_id, 2, 1)),
                            self.token_circled.read((session_id, 2, 2)),
                            self.token_circled.read((session_id, 2, 3)),
                        ),
                    },
                    SessionUserStatus {
                        player_id: 3,
                        player_tokens_position: (
                            self.player_tokens.read((session_id, 3, 0)),
                            self.player_tokens.read((session_id, 3, 1)),
                            self.player_tokens.read((session_id, 3, 2)),
                            self.player_tokens.read((session_id, 3, 3)),
                        ),
                        player_winning_tokens: (
                            self.winning_tokens.read((session_id, 3, 0)),
                            self.winning_tokens.read((session_id, 3, 1)),
                            self.winning_tokens.read((session_id, 3, 2)),
                            self.winning_tokens.read((session_id, 3, 3)),
                        ),
                        player_tokens_circled: (
                            self.token_circled.read((session_id, 3, 0)),
                            self.token_circled.read((session_id, 3, 1)),
                            self.token_circled.read((session_id, 3, 2)),
                            self.token_circled.read((session_id, 3, 3)),
                        ),
                    },
                ),
            };
            (session, session_status)
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn _process_play(
            ref self: ContractState,
            session: Session,
            session_id: u256,
            ludo_move: LudoMove,
            mut random_number_array: Array<u256>,
        ) {
            let player_id = session.next_player_id;
            let mut random_number_agg = 0;

            loop {
                if random_number_array.len() == 0 {
                    break;
                }
                let random_number = random_number_array.pop_front().unwrap();
                // check the random number array is valid, for example if len > 1 then
                // array[0..len-1] should be 6
                if (random_number_array.len() > 0) {
                    assert(random_number == 6, INVALID_NUMBER_ARRAY);
                }
                random_number_agg += random_number;
            };
            let token_id = ludo_move.token_id;
            let is_session_finished = self
                ._play(session_id, player_id, ludo_move, random_number_agg);
            if !is_session_finished {
                self.marquis_game._after_play(session_id);
                // this is after play
                // read session
                let next_player_id = self.marquis_game._session_next_player_id(session_id);
                let next_session_nonce = self.marquis_game._get_session(session_id).nonce + 1;
                self
                    .emit(
                        TokenMove {
                            session_id,
                            player_id: player_id,
                            token_id,
                            steps: random_number_agg,
                            next_player_id: next_player_id,
                            next_session_nonce: next_session_nonce,
                        },
                    );
            }
        }

        /// @notice Internal function to execute a move in the Ludo game
        /// @param session_id The ID of the session
        /// @param player_id The ID of the player making the move
        /// @param ludo_move The move to be executed
        /// @param random_number_agg The aggregated random number for the move
        // Todo: refactor this function, improve readability
        fn _play(
            ref self: ContractState,
            session_id: u256,
            player_id: u32,
            ludo_move: LudoMove,
            random_number_agg: u256,
        ) -> bool {
            let start_positions: Array<u256> = array![1, 14, 27, 40];
            let exit_positions: Array<u256> = array![50, 11, 24, 37];

            // Move the token
            let board_size = 52; // Todo: refactor this as constant

            let token_id = ludo_move.token_id;

            assert(token_id < MAX_PINS, INVALID_PIN_ID); // only 4 tokens per player

            // Check if the token is already a winning token
            let is_winning_token = self.winning_tokens.read((session_id, player_id, token_id));
            assert(!is_winning_token, INVALID_MOVE);

            // Get the current position of the token
            let mut current_position = self.player_tokens.read((session_id, player_id, token_id));

            if current_position == 0 {
                // Check if the token is in the starting position
                let start_position = *start_positions.get(player_id).unwrap().unbox();
                // assert(random_number_agg > 6, INVALID_MOVE);
                if random_number_agg <= 6 {
                    return false;
                }
                current_position = start_position;
                current_position += (random_number_agg - 6);
            } else {
                current_position += random_number_agg;
            }

            // Check if the token exceeds the board size and only mark as circled if player is 2, 3,
            // or 4
            if current_position > board_size {
                if player_id != 0 {
                    self.token_circled.write((session_id, player_id, token_id), true);
                    current_position = current_position - board_size;
                }
            }

            // Check if the token exceeds the exit value and if it has circled once for players 2,
            // 3, 4
            let exit_position = *exit_positions.get(player_id).unwrap().unbox();
            let has_circled = self.token_circled.read((session_id, player_id, token_id));

            if current_position > exit_position && (player_id == 0 || has_circled) {
                // current_position = 12, exit_position = 11
                // remaining_steps = 1
                let remaining_steps = current_position - exit_position;
                if remaining_steps <= 7 {
                    if current_position == exit_position + 7 {
                        let winning_token_count = self
                            .winning_token_count
                            .read((session_id, player_id));
                        // Mark the token as a winning token
                        self.winning_tokens.write((session_id, player_id, token_id), true);
                        self
                            .player_tokens
                            .write((session_id, player_id, token_id), current_position);

                        self
                            .winning_token_count
                            .write((session_id, player_id), winning_token_count + 1);

                        let winning_token_count = self
                            .winning_token_count
                            .read((session_id, player_id));
                        // Check if the player has all tokens as winning tokens
                        if winning_token_count == 4 {
                            let winner_amount =
                                match self
                                    .marquis_game
                                    ._finish_session(
                                        session_id, Option::Some(player_id), Option::None,
                                    ) {
                                Option::Some(amount) => amount,
                                Option::None => 0,
                            };
                            self
                                .emit(
                                    SessionFinished {
                                        session_id, winning_player_id: player_id, winner_amount,
                                    },
                                );
                            return true;
                        };
                    } else {
                        // Update the token position
                        self
                            .player_tokens
                            .write((session_id, player_id, token_id), current_position);
                    }
                } else {
                    // Move exceeds allowable steps, revert to previous position
                    // assert(false, INVALID_MOVE);
                    return false;
                }
            } else {
                // Update the token position
                self.player_tokens.write((session_id, player_id, token_id), current_position);
                self._check_kill(session_id, player_id, current_position);
            }
            false
        }

        /// @notice Internal function to check and handle killing of tokens
        /// @param session_id The ID of the session
        /// @param player_id The ID of the player making the move
        /// @param current_position The current position of the token
        fn _check_kill(
            ref self: ContractState, session_id: u256, player_id: u32, current_position: u256,
        ) {
            let mut i = 0; // index of players
            let mut j = 0; // index of tokens

            loop {
                if i == 4 {
                    break;
                }
                if i == player_id {
                    i += 1;
                    continue;
                }
                j = 0;
                loop {
                    if j == 4 {
                        break;
                    }
                    // check this is not a winning token
                    // check if this token has circled
                    let is_winning_token = self.winning_tokens.read((session_id, i, j));
                    let token_position = self.player_tokens.read((session_id, i, j));
                    let has_circled = self.token_circled.read((session_id, i, j));
                    let _exit_positions: Array<u256> = array![50, 11, 24, 37];

                    if token_position == 0 || token_position != current_position {
                        j += 1;
                        continue;
                    }
                    if is_winning_token {
                        j += 1;
                        continue;
                    }
                    if has_circled && current_position > *_exit_positions.get(i).unwrap().unbox() {
                        j += 1;
                        continue;
                    }

                    // Token is killed
                    self.player_tokens.write((session_id, i, j), 0);
                    self.token_circled.write((session_id, i, j), false);
                    j += 1;
                };
                i += 1;
            }
        }
    }
}
