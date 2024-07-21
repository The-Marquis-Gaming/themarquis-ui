// SPDX-License-Identifier: MIT
// @author : Carlos Ramos
// @notice : base interface for all the-marquis-game contracts

use starknet::ContractAddress;

pub mod GameStatus {
    pub const WAITING: felt252 = 0;
}

pub mod GameErrors {
    pub const SESSION_NOT_FOUND: felt252 = 'SESSION NOT FOUND';
    pub const SESSION_FULL: felt252 = 'SESSION FULL';
    pub const SESSION_NOT_WAITING: felt252 = 'SESSION NOT WAITING';
    pub const PLAYER_HAS_SESSION: felt252 = 'PLAYER HAS SESSION';
    pub const PLAY_FUNCTION_NOT_IMPLEMENTED: felt252 = 'PLAY FUNCTION NOT IMPLEMENTED';
    pub const NOT_INITIALIZED: felt252 = 'NOT INITIALIZED';
}

#[derive(Drop, Serde, starknet::Store)]
pub struct Session {
    pub id: u256,
    pub player_count: u256,
    pub status: felt252,
    pub current_player_id: u256,
}

#[starknet::interface]
pub trait IMarquisGame<ContractState> {
    fn initialize(ref self: ContractState, name: ByteArray, max_players: u256);
    fn create_session(ref self: ContractState) -> u256;
    fn join_session(ref self: ContractState, session_id: u256);
}