use contracts::interfaces::IMarquisGame::{VerifiableRandomNumber, SessionData};
// SPDX-License-Identifier: MIT
// @author : Carlos Ramos
// @notice : Base interface for all Ludo contracts

#[derive(Drop, starknet::Event)]
pub struct TokenMove {
    #[key]
    pub session_id: u256,
    #[key]
    pub player_id: u32,
    #[key]
    pub token_id: u256,
    pub steps: u256,
    pub next_player_id: u32,
    pub next_session_nonce: u256
}

#[derive(Debug, Drop, starknet::Event)]
pub struct SessionFinished {
    #[key]
    pub session_id: u256,
    #[key]
    pub winning_player_id: u32,
    pub winner_amount: u256
}

#[derive(Clone, Drop, Serde, starknet::Store)]
pub struct LudoMove {
    pub token_id: u256,
}

#[derive(Debug, Drop, Serde, starknet::Store)]
pub struct SessionUserStatus {
    pub player_id: u32,
    pub player_tokens_position: (u256, u256, u256, u256),
    pub player_winning_tokens: (bool, bool, bool, bool),
    pub player_tokens_circled: (bool, bool, bool, bool),
}

#[derive(Debug, Drop, Serde, starknet::Store)]
pub struct LudoSessionStatus {
    // 4 users
    pub users: (SessionUserStatus, SessionUserStatus, SessionUserStatus, SessionUserStatus),
}

/// @notice Interface for the Ludo Game contract
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

    fn owner_play(
        ref self: ContractState,
        session_id: u256,
        ludo_move: LudoMove,
        verifiableRandomNumberArray: Array<VerifiableRandomNumber>
    );

    fn get_session_status(
        self: @ContractState, session_id: u256
    ) -> (SessionData, LudoSessionStatus);
}
