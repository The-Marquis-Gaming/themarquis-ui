use starknet::secp256_trait::Signature;
// SPDX-License-Identifier: MIT
// @author : Carlos Ramos
// @notice : base interface for all the-marquis-game contracts

use starknet::{ContractAddress, EthAddress};

pub mod GameStatus {
    pub const WAITING: felt252 = 1;
    pub const PLAYING: felt252 = 2;
    pub const FINISHED: felt252 = 3;
}

pub mod GameErrors {
    pub const SESSION_NOT_FOUND: felt252 = 'SESSION NOT FOUND';
    pub const SESSION_FULL: felt252 = 'SESSION FULL';
    pub const SESSION_NOT_WAITING: felt252 = 'SESSION NOT WAITING';
    pub const SESSION_NOT_PLAYING: felt252 = 'SESSION NOT PLAYING';
    pub const PLAYER_HAS_SESSION: felt252 = 'PLAYER HAS SESSION';
    pub const PLAY_FUNCTION_NOT_IMPLEMENTED: felt252 = 'PLAY FUNCTION NOT IMPLEMENTED';
    pub const NOT_INITIALIZED: felt252 = 'NOT INITIALIZED';
    pub const NOT_PLAYER_TURN: felt252 = 'NOT PLAYER TURN';
    pub const ALREADY_INITIALIZED: felt252 = 'ALREADY INITIALIZED';
    pub const WRONG_INIT_PARAMS: felt252 = 'WRONG INIT PARAMS';
}

pub mod GameConstants {
    pub const MIN_JOIN_WAITING_TIME: u64 = 10; // 10 seconds
    pub const MAX_JOIN_WAITING_TIME: u64 = 3600; // 1 hour 
    pub const MIN_PLAY_WAITING_TIME: u64 = 5; // 10 seconds
    pub const MAX_PLAY_WAITING_TIME: u64 = 600; // 10 minutes
}

#[derive(Drop, Serde, starknet::Store)]
pub struct Session {
    pub id: u256,
    pub player_count: u32,
    pub next_player_id: u32,
    pub nonce: u256,
    pub start_time: u64,
    pub last_play_time: u64,
}

#[derive(Drop, Serde, starknet::Store)]
pub struct VerifiableRandomNumber {
    pub random_number: u256,
    pub v: u32,
    pub r: u256,
    pub s: u256,
}


#[derive(Drop, Serde, starknet::Store)]
pub struct SessionData {
    pub player_count: u32,
    pub status: felt252,
    pub next_player: ContractAddress, // TODO : use store array for a list of players
    pub nonce: u256,
    pub start_time: u64,
    pub last_play_time: u64,
    pub time_left_to_play: u64,
    pub time_left_to_join: u64,
}

#[starknet::interface]
pub trait IMarquisGame<ContractState> {
    fn create_session(ref self: ContractState) -> u256;
    fn join_session(ref self: ContractState, session_id: u256);
    fn session(self: @ContractState, session_id: u256) -> SessionData;
    // readers
    fn name(self: @ContractState) -> ByteArray;
    fn marquis_oracle_address(self: @ContractState) -> EthAddress;
}
