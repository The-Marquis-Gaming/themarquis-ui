use contracts::MarquisCore::{IMarquisCoreDispatcher, IMarquisCoreDispatcherTrait};
use contracts::interfaces::ILudo::{ILudoDispatcher, ILudoDispatcherTrait, LudoMove};
use contracts::interfaces::IMarquisGame::{
    IMarquisGameDispatcher, IMarquisGameDispatcherTrait, VerifiableRandomNumber,
};
use openzeppelin::utils::serde::SerializedAppend;
use snforge_std::{declare, ContractClassTrait, cheat_caller_address, CheatSpan};
use starknet::{ContractAddress, EthAddress, contract_address_const};

fn OWNER() -> ContractAddress {
    contract_address_const::<'OWNER'>()
}

fn PLAYER_1() -> ContractAddress {
    contract_address_const::<'PLAYER_1'>()
}
fn PLAYER_2() -> ContractAddress {
    contract_address_const::<'PLAYER_2'>()
}
fn PLAYER_3() -> ContractAddress {
    contract_address_const::<'PLAYER_3'>()
}

fn ZERO_TOKEN() -> ContractAddress {
    contract_address_const::<0x0>()
}

fn deploy_marquis_contract() -> ContractAddress {
    let contract = declare("MarquisCore").unwrap();
    let mut calldata = array![];
    calldata.append_serde(OWNER());
    let (contract_address, _) = contract.deploy(@calldata).unwrap();
    //println!("-- MarquisCore contract deployed on: {:?}", contract_address);
    contract_address
}

fn deploy_ludo_contract() -> ContractAddress {
    let marquis_contract_address = deploy_marquis_contract();
    let contract = declare("Ludo").unwrap();
    // Todo: Refactor to not use eth
    let oracle_address: felt252 = '0x0';
    let marquis_oracle_address: EthAddress = oracle_address.try_into().unwrap();
    let mut calldata = array![];
    calldata.append_serde(marquis_oracle_address);
    calldata.append_serde(marquis_contract_address);
    let (contract_address, _) = contract.deploy(@calldata).unwrap();
    //println!("-- Ludo contract deployed on: {:?}", contract_address);
    contract_address
}

#[test]
fn test_deploy_contracts() {
    deploy_ludo_contract();
}

#[test]
fn test_game_name() {
    let ludo_contract = deploy_ludo_contract();
    let marquis_game_dispatcher = IMarquisGameDispatcher { contract_address: ludo_contract };
    let expected_name = "Ludo";
    let name = marquis_game_dispatcher.name();
    assert_eq!(name, expected_name);
}

#[test]
fn test_create_session() {
    let ludo_contract = deploy_ludo_contract();
    let marquis_game_dispatcher = IMarquisGameDispatcher { contract_address: ludo_contract };
    let expected_session_id = 1;
    let token = ZERO_TOKEN();
    let amount = 0;
    let session_id = marquis_game_dispatcher.create_session(token, amount);
    assert_eq!(session_id, expected_session_id);
}


#[test]
fn test_join_session() {
    let ludo_contract = deploy_ludo_contract();
    let ludo_dispatcher = ILudoDispatcher { contract_address: ludo_contract };
    let marquis_game_dispatcher = IMarquisGameDispatcher { contract_address: ludo_contract };
    let token = ZERO_TOKEN();
    let amount = 0;
    let player_0 = OWNER();
    cheat_caller_address(ludo_contract, player_0, CheatSpan::TargetCalls(1));
    let session_id = marquis_game_dispatcher.create_session(token, amount);
    let player_1 = PLAYER_1();
    cheat_caller_address(ludo_contract, player_1, CheatSpan::TargetCalls(1));
    marquis_game_dispatcher.join_session(session_id);
    let (session_data, _) = ludo_dispatcher.get_session_status(session_id);
    let player_count = session_data.player_count;
    let status = session_data.status;
    let expected_player_count = 2;
    let expected_status = 1; // waiting for players
    assert_eq!(player_count, expected_player_count);
    assert_eq!(status, expected_status);
}

#[test]
fn test_play() {
    let ludo_contract = deploy_ludo_contract();
    let ludo_dispatcher = ILudoDispatcher { contract_address: ludo_contract };
    let marquis_game_dispatcher = IMarquisGameDispatcher { contract_address: ludo_contract };
    let token = ZERO_TOKEN();
    let amount = 0;
    let player_0 = OWNER();
    cheat_caller_address(ludo_contract, player_0, CheatSpan::TargetCalls(1));
    let session_id = marquis_game_dispatcher.create_session(token, amount);
    let player_1 = PLAYER_1();
    cheat_caller_address(ludo_contract, player_1, CheatSpan::TargetCalls(1));
    marquis_game_dispatcher.join_session(session_id);
    let player_2 = PLAYER_2();
    cheat_caller_address(ludo_contract, player_2, CheatSpan::TargetCalls(1));
    marquis_game_dispatcher.join_session(session_id);
    let player_3 = PLAYER_3();
    cheat_caller_address(ludo_contract, player_3, CheatSpan::TargetCalls(1));
    marquis_game_dispatcher.join_session(session_id);
    let (session_data, _) = ludo_dispatcher.get_session_status(session_id);
    let status = session_data.status;
    let expected_status = 2; // can play
    assert_eq!(status, expected_status);
    let ludo_move = LudoMove { token_id: 0 };
    let ver_rand_num = VerifiableRandomNumber { random_number: 1, v: 1, r: 1, s: 1, };
    let ver_rand_num_array = array![ver_rand_num];
    cheat_caller_address(ludo_contract, player_0, CheatSpan::TargetCalls(1));
    println!("-- Playing move for player 0");
    ludo_dispatcher.play(session_id, ludo_move, ver_rand_num_array);
}
