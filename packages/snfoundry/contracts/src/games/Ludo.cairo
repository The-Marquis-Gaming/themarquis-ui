#[derive(Drop, Serde, starknet::Store)]
pub struct LudoMove {
    pub move: felt252,
}

#[starknet::interface]
pub trait ILudo<ContractState> {
    fn play(ref self: ContractState, session_id: u256, move: LudoMove , random_number: u256, v: u32, r: u256, s: u256);
}

#[starknet::contract]
mod Ludo {
    use contracts::components::MarquisGame::MarquisGame::InternalTrait;
use contracts::components::MarquisGame::MarquisGame;
    use starknet::{EthAddress};
    use super::{ILudo, LudoMove};

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
        #[substorage(v0)]
        marquis_game: MarquisGame::Storage,
    }

    #[constructor]
    fn constructor(ref self: ContractState, max_players: u256, marquis_oracle_address: EthAddress) {
        self.marquis_game._initialize("Ludo", max_players, marquis_oracle_address);
    }

    #[abi(embed_v0)]
    impl LudoImpl of ILudo<ContractState> {
        fn play(ref self: ContractState, session_id: u256, move: LudoMove, random_number: u256, v: u32, r: u256, s: u256) {
            self.marquis_game._before_play(session_id, random_number, v, r, s);
            // TODO: implement the game logic
        }
    }
}