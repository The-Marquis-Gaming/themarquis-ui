// SPDX-License-Identifier: MIT
// @author: Carlos Ramos
// @notice: Ludo game contract

use contracts::interfaces::IMarquisGame::VerifiableRandomNumber;

#[derive(Drop, Serde, starknet::Store)]
pub struct LudoMove {
    pub token_id: u256,
}

#[derive(Drop, Serde, starknet::Store)]
pub struct SessionUserStatus {
    pub player_id: u32,
    pub player_tokens_position: (u256, u256, u256, u256),
    pub player_winning_tokens: (bool, bool, bool, bool),
}

#[derive(Drop, Serde, starknet::Store)]
pub struct LudoSessionStatus {
    // 4 users
    pub users: (SessionUserStatus, SessionUserStatus, SessionUserStatus, SessionUserStatus),
}

#[starknet::interface]
pub trait ILudo<ContractState> {
    /// @notice Play a move in the Ludo game
    /// @param session_id The ID of the session
    /// @param ludo_move The move to be played
    /// @param verifiableRandomNumberArray Array of verifiable random numbers
    fn play(
        ref self: ContractState,
        session_id: u256,
        ludo_move: LudoMove,
        verifiableRandomNumberArray: Array<VerifiableRandomNumber>
    );
    fn get_session_status(self: @ContractState, session_id: u256) -> LudoSessionStatus;
}

#[starknet::contract]
mod Ludo {
    use contracts::components::MarquisGame::MarquisGame;
    use contracts::interfaces::IMarquisGame::{InitParams};
    use core::option::OptionTrait;
    use openzeppelin::access::ownable::OwnableComponent;
    use openzeppelin::access::ownable::interface::{IOwnableDispatcher, IOwnableDispatcherTrait};
    use starknet::{EthAddress, ContractAddress, get_caller_address};
    use super::{ILudo, LudoMove, VerifiableRandomNumber, LudoSessionStatus, SessionUserStatus};

    component!(path: MarquisGame, storage: marquis_game, event: MarquisGameEvent);
    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;

    #[abi(embed_v0)]
    impl MarquisGameImpl = MarquisGame::MarquisGameImpl<ContractState>;

    impl MarquisGameInternalImpl = MarquisGame::InternalImpl<ContractState>;

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        MarquisGameEvent: MarquisGame::Event,
        #[flat]
        OwnableEvent: OwnableComponent::Event,
    }

    const INVALID_MOVE: felt252 = 'Invalid move';
    const INVALID_NUMBER_ARRAY: felt252 = 'Invalid number array';

    #[storage]
    struct Storage {
        player_tokens: LegacyMap<
            (u256, u32, u256), u256
        >, // Track positions of each player's tokens
        winning_tokens: LegacyMap<(u256, u32, u256), bool>, // Track winning tokens
        winning_token_count: LegacyMap<
            (u256, u32), u32
        >, // Track winning token count of each player
        token_circled: LegacyMap<(u256, u32, u256), bool>, // Track if token has circled once
        #[substorage(v0)]
        marquis_game: MarquisGame::Storage,
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        marquis_oracle_address: EthAddress,
        marquis_core_address: ContractAddress,
    // owner: ContractAddress
    ) {
        let owner = IOwnableDispatcher { contract_address: marquis_core_address }.owner();
        self
            .marquis_game
            .initializer(
                InitParams {
                    name: "Ludo",
                    required_players: 4,
                    max_random_number: 6,
                    marquis_oracle_address,
                    marquis_core_address,
                    owner,
                }
            );
    // .initializer("Ludo", 4, 4, 60, 60, marquis_oracle_address, marquis_core_address, owner);
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
            mut verifiableRandomNumberArray: Array<VerifiableRandomNumber>
        ) {
            let (_session, mut _random_number_array) = self
                .marquis_game
                ._before_play(session_id, verifiableRandomNumberArray);
            let _player_id = _session.next_player_id;
            let mut _random_number_agg = 0;

            loop {
                if _random_number_array.len() == 0 {
                    break;
                }
                let _random_number = _random_number_array.pop_front().unwrap();
                // check the random number array is valid, for example if len > 1 then array[0..len-1] should be 6
                if (_random_number_array.len() > 0) {
                    assert(_random_number == 6, INVALID_NUMBER_ARRAY);
                }
                _random_number_agg += _random_number;
            };
            self._play(session_id, _player_id, ludo_move, _random_number_agg);
            self.marquis_game._after_play(session_id);
        }

        fn get_session_status(self: @ContractState, session_id: u256) -> LudoSessionStatus {
            let mut _session_status = LudoSessionStatus {
                users: (
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
                            self.winning_tokens.read((session_id, 0, 3))
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
                            self.winning_tokens.read((session_id, 1, 3))
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
                            self.winning_tokens.read((session_id, 2, 3))
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
                            self.winning_tokens.read((session_id, 3, 3))
                        ),
                    }
                )
            };
            _session_status
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        /// @notice Internal function to execute a move in the Ludo game
        /// @param session_id The ID of the session
        /// @param player_id The ID of the player making the move
        /// @param ludo_move The move to be executed
        /// @param random_number_agg The aggregated random number for the move
        fn _play(
            ref self: ContractState,
            session_id: u256,
            player_id: u32,
            ludo_move: LudoMove,
            random_number_agg: u256
        ) {
            let _start_positions: Array<u256> = array![1, 14, 27, 40];
            let _exit_positions: Array<u256> = array![50, 11, 24, 37];

            // Move the token
            let board_size = 52;

            let token_id = ludo_move.token_id;

            assert(token_id < 4, INVALID_MOVE); // only 4 tokens per player

            // Check if the token is already a winning token
            let is_winning_token = self.winning_tokens.read((session_id, player_id, token_id));
            assert(!is_winning_token, INVALID_MOVE);

            // Get the current position of the token
            let mut current_position = self.player_tokens.read((session_id, player_id, token_id));

            if current_position == 0 {
                // Check if the token is in the starting position
                let start_position = *_start_positions.get(player_id).unwrap().unbox();
                assert(random_number_agg > 6, INVALID_MOVE);
                current_position = start_position;
                current_position += (random_number_agg - 6);
            } else {
                current_position += random_number_agg;
            }

            // Check if the token exceeds the board size and only mark as circled if player is 2, 3, or 4
            if current_position >= board_size {
                if player_id != 0 {
                    self.token_circled.write((session_id, player_id, token_id), true);
                    current_position = current_position - board_size + 1;
                }
            }

            // Check if the token exceeds the exit value and if it has circled once for players 2, 3, 4
            let exit_position = *_exit_positions.get(player_id).unwrap().unbox();
            let has_circled = self.token_circled.read((session_id, player_id, token_id));

            if current_position > exit_position && (player_id == 0 || has_circled) {
                let remaining_steps = current_position - exit_position;
                if remaining_steps <= 6 {
                    if current_position == exit_position + 6 {
                        // Mark the token as a winning token
                        self.winning_tokens.write((session_id, player_id, token_id), true);
                        let winning_token_count = self
                            .winning_token_count
                            .read((session_id, player_id));
                        self
                            .winning_token_count
                            .write((session_id, player_id), winning_token_count + 1);

                        // Check if the player has all tokens as winning tokens
                        if winning_token_count == 4 {
                            self.marquis_game._finish_session(session_id, player_id);
                        }
                    } else {
                        // Update the token position
                        self
                            .player_tokens
                            .write((session_id, player_id, token_id), current_position);
                    }
                } else {
                    // Move exceeds allowable steps, revert to previous position
                    assert(false, INVALID_MOVE);
                }
            } else {
                // Update the token position
                self.player_tokens.write((session_id, player_id, token_id), current_position);
                self._check_kill(session_id, player_id, current_position);
            }
        }

        /// @notice Internal function to check and handle killing of tokens
        /// @param session_id The ID of the session
        /// @param player_id The ID of the player making the move
        /// @param current_position The current position of the token
        fn _check_kill(
            ref self: ContractState, session_id: u256, player_id: u32, current_position: u256
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
                    if !has_circled && current_position > *_exit_positions.get(i).unwrap().unbox() {
                        j += 1;
                        continue;
                    }

                    // Token is killed
                    self.player_tokens.write((session_id, i, j), 0);
                    j += 1;
                };
                i += 1;
            }
        }
    }
}
