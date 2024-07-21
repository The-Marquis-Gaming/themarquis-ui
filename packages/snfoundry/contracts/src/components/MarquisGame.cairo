// SPDX-License-Identifier: MIT
// @author : Carlos Ramos
// @notice : base component for all the-marquis-game contracts
use starknet::ContractAddress;

#[starknet::component]
pub mod MarquisGame {

    use contracts::interfaces::IMarquisGame::{Session, IMarquisGame, GameStatus, GameErrors};
    use super::{ContractAddress};
    use starknet::{get_caller_address, get_contract_address};
    use keccak::keccak_u256s_le_inputs;

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
    }

    #[embeddable_as(MarquisGameImpl)]
    impl MarquisGame <TContractState, +HasComponent<TContractState>> of IMarquisGame<ComponentState<TContractState>> {
        fn initialize(ref self: ComponentState<TContractState>, name: ByteArray, max_players: u256) {
            self.name.write(name);
            self.max_players.write(max_players);
            self.initialized.write(true);
        }
        fn create_session(ref self: ComponentState<TContractState>) -> u256 {
            let session_id = self.session_counter.read();
            self.session_counter.write(session_id + 1);
            let mut new_session = Session {
                id: session_id,
                player_count: 1,
                status: GameStatus::WAITING,
                current_player_id: 0,
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
    }
    #[generate_trait]
    pub impl InternalImpl<TContractState, +HasComponent<TContractState>> of InternalTrait<TContractState> {
        fn _require_player_has_no_session(ref self: ComponentState<TContractState>, player: ContractAddress) {
            let session_id = self.player_session.read(player);
            assert(session_id == 0, GameErrors::PLAYER_HAS_SESSION);
        }
        fn _require_session_waiting(ref self: ComponentState<TContractState>, status: felt252) {
            assert(status == GameStatus::WAITING, GameErrors::SESSION_NOT_WAITING);
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
    }
}