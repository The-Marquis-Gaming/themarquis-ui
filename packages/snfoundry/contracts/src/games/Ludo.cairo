use contracts::interfaces::IMarquisGame::VerifiableRandomNumber;

#[derive(Drop, Serde, starknet::Store)]
pub struct LudoMove {
    pub token_id: u256,
}

#[starknet::interface]
pub trait ILudo<ContractState> {
    fn play(
        ref self: ContractState,
        session_id: u256,
        ludo_move: LudoMove,
        verifiableRandomNumberArray: Array<VerifiableRandomNumber>
    );
}

#[starknet::contract]
mod Ludo {
    use contracts::components::MarquisGame::MarquisGame;
    // use contracts::components::MarquisGame::MarquisGame::InternalTrait;
    use core::option::OptionTrait;

    use starknet::{EthAddress, ContractAddress, get_caller_address};
    use super::{ILudo, LudoMove, VerifiableRandomNumber};

    component!(path: MarquisGame, storage: marquis_game, event: MarquisGameEvent);

    #[abi(embed_v0)]
    impl MarquisGameImpl = MarquisGame::MarquisGameImpl<ContractState>;

    impl MarquisGameInternalImpl = MarquisGame::InternalImpl<ContractState>;

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        MarquisGameEvent: MarquisGame::Event,
    }
    #[storage]
    struct Storage {
        player_tokens: LegacyMap<
            (u256, ContractAddress, u256), u256
        >, // Track positions of each player's tokens
        winning_tokens: LegacyMap<(u256, ContractAddress, u256), bool>, // Track winning tokens
        #[substorage(v0)]
        marquis_game: MarquisGame::Storage,
    }

    #[constructor]
    fn constructor(ref self: ContractState, marquis_oracle_address: EthAddress) {
        self.marquis_game._initialize("Ludo", 4, 4, 100, 100, marquis_oracle_address);
    }

    #[abi(embed_v0)]
    impl LudoImpl of ILudo<ContractState> {
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
                _random_number_agg += _random_number;
            };
            // TODO: implement the game logic - use player id to determine the player's move
            self._play(session_id, _player_id, get_caller_address(), ludo_move, _random_number_agg);
            self.marquis_game._after_play(session_id);
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn _play(
            ref self: ContractState,
            session_id: u256,
            player_id: u32,
            player: ContractAddress,
            ludo_move: LudoMove,
            random_number_agg: u256
        ) {
            let token_id = ludo_move.token_id;

            // Get the current position of the token
            let mut current_position = self.player_tokens.read((session_id, player, token_id));

            // Move the token
            current_position += random_number_agg;
            let _start_positions: Array<u256> = array![1, 13, 26, 39];
            let _exit_positions: Array<u256> = array![48, 61, 74, 87];

            // Check if the token exceeds the exit value and is less than the board length
            if current_position > *_exit_positions.get(player_id).unwrap().unbox()
                && current_position <= 87 {
                let remaining_steps = current_position
                    - *_exit_positions.get(player_id).unwrap().unbox();
                if remaining_steps <= 6 {
                    if current_position == *_exit_positions.get(player_id).unwrap().unbox() + 6 {
                        // Mark the token as a winning token
                        self.winning_tokens.write((session_id, player, token_id), true);
                    } else {
                        // Update the token position
                        self.player_tokens.write((session_id, player, token_id), current_position);
                    }
                } else {
                    // revert the move
                    current_position -= random_number_agg;
                }

                // write the token position
                self.player_tokens.write((session_id, player, token_id), current_position);
            } else {
                // Update the token position
                self.player_tokens.write((session_id, player, token_id), current_position);
            }
        }
    }
}
