// SPDX-License-Identifier: MIT
// @author : Carlos Ramos
// @notice : Base interface for all The-Marquis-Game contracts

use starknet::{ContractAddress, EthAddress};

/// @notice Contains constants representing the status of the game
pub mod GameStatus {
    pub const WAITING: felt252 = 1;
    pub const PLAYING: felt252 = 2;
    pub const FINISHED: felt252 = 3;
}

/// @notice Contains constants representing various game error messages
pub mod GameErrors {
    pub const PLAYER_HAS_SESSION: felt252 = 'PLAYER HAS SESSION';
    pub const PLAY_FUNCTION_NOT_IMPLEMENTED: felt252 = 'PLAY FUNCTION NOT IMPLEMENTED';
    pub const NOT_INITIALIZED: felt252 = 'NOT INITIALIZED';
    pub const NOT_PLAYER_TURN: felt252 = 'NOT PLAYER TURN';
    pub const ALREADY_INITIALIZED: felt252 = 'ALREADY INITIALIZED';
    pub const WRONG_INIT_PARAMS: felt252 = 'WRONG INIT PARAMS';
    pub const UNSUPPORTED_TOKEN: felt252 = 'UNSUPPORTED TOKEN';
    pub const INVALID_FEE: felt252 = 'INVALID FEES';
    pub const INVALID_RANDOM_NUMBER: felt252 = 'INVALID RANDOM NUMBER';
}

// split session errors
pub mod SessionErrors {
    pub const SESSION_NOT_FOUND: felt252 = 'SESSION NOT FOUND';
    pub const SESSION_FULL: felt252 = 'SESSION FULL';
    pub const SESSION_NOT_WAITING: felt252 = 'SESSION NOT WAITING';
    pub const SESSION_NOT_PLAYING: felt252 = 'SESSION NOT PLAYING';
}

/// @notice Events emitted by the Marquis Game contract

#[derive(Drop, starknet::Event)]
pub struct SessionCreated {
    #[key]
    pub session_id: u256,
    pub token: ContractAddress,
    pub amount: u256,
    pub creator: ContractAddress,
}

#[derive(Drop, starknet::Event)]
pub struct SessionJoined {
    #[key]
    pub session_id: u256,
    pub player: ContractAddress,
    pub player_count: u32
}

#[derive(Debug, Drop, starknet::Event)]
pub struct ForcedSessionFinished {
    #[key]
    pub session_id: u256,
}

/// @notice Contains constants representing various game settings
pub mod GameConstants {
    pub const MIN_JOIN_WAITING_TIME: u64 = 10; // 10 seconds
    pub const MAX_JOIN_WAITING_TIME: u64 = 3600; // 1 hour 
    pub const MIN_PLAY_WAITING_TIME: u64 = 5; // 10 seconds
    pub const MAX_PLAY_WAITING_TIME: u64 = 600; // 10 minutes
}

/// @notice Struct representing a game session
#[derive(Debug, Drop, Serde, starknet::Store)]
pub struct Session {
    pub id: u256,
    pub player_count: u32,
    pub next_player_id: u32,
    pub nonce: u256,
    pub play_amount: u256,
    pub play_token: ContractAddress,
}

/// @notice Struct representing a game session
#[derive(Drop, Serde, starknet::Store)]
pub struct InitParams {
    pub name: ByteArray,
    pub required_players: u32,
    pub max_random_number: u256,
    pub marquis_oracle_address: EthAddress,
    pub marquis_core_address: ContractAddress,
    pub owner: ContractAddress,
}

/// @notice Struct representing a verifiable random number
#[derive(Clone, Drop, Serde, starknet::Store)]
pub struct VerifiableRandomNumber {
    pub random_number: u256,
    pub v: u32,
    pub r: u256,
    pub s: u256,
}

/// @notice Struct representing data about a game session
#[derive(Debug, Drop, Serde, starknet::Store)]
pub struct SessionData {
    pub player_count: u32,
    pub status: felt252,
    pub next_player: ContractAddress, // TODO : use store array for a list of players
    pub nonce: u256,
    pub play_amount: u256,
    pub play_token: ContractAddress,
}

/// @notice Interface for the Marquis Game contract
#[starknet::interface]
pub trait IMarquisGame<ContractState> {
    /// @notice Creates a new game session
    /// @param token The address of the token to be used for the session
    /// @param amount The amount of tokens to be used for the session
    /// @return The ID of the newly created session
    fn create_session(ref self: ContractState, token: ContractAddress, amount: u256) -> u256;

    /// @notice Joins an existing game session
    /// @param session_id The ID of the session to join
    fn join_session(ref self: ContractState, session_id: u256);

    fn owner_finish_session(
        ref self: ContractState, session_id: u256, option_winner_id: Option<u32>
    );

    fn player_finish_session(ref self: ContractState, session_id: u256, player_id: u32);

    /// @notice Gets the name of the game
    /// @return The name of the game as a ByteArray
    fn name(self: @ContractState) -> ByteArray;

    /// @notice Gets the address of the Marquis Oracle
    /// @return EthAddress The address of the Marquis Oracle
    fn marquis_oracle_address(self: @ContractState) -> EthAddress;

    fn marquis_core_address(self: @ContractState) -> ContractAddress;

    fn is_supported_token(self: @ContractState, token_address: ContractAddress) -> bool;

    fn token_fee(self: @ContractState, token_address: ContractAddress) -> u16;

    fn player_session(self: @ContractState, player: ContractAddress) -> u256;
}
