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
    let nonce = session_data.nonce;
    println!("-- Session data, nonce: {:?}", nonce);

    let ludo_move = LudoMove { token_id: 0 };
    let ver_rand_num0 = VerifiableRandomNumber { random_number: 6, v: 1, r: 1, s: 1, };
    let ver_rand_num1 = VerifiableRandomNumber { random_number: 2, v: 1, r: 1, s: 1, };
    let ver_rand_num_array = array![ver_rand_num0, ver_rand_num1];
    cheat_caller_address(ludo_contract, player_0, CheatSpan::TargetCalls(1));
    println!("-- Playing move for player 0");
    ludo_dispatcher.play(session_id, ludo_move, ver_rand_num_array);
    let (session_data, ludo_session_status) = ludo_dispatcher.get_session_status(session_id);
    println!("{:?}", session_data);
    let (user0, _, _, _) = ludo_session_status.users;
    let (pin_0_pos, _, _, _) = user0.player_tokens_position;
    let expected_pin_0_pos = 3;
    assert_eq!(pin_0_pos, expected_pin_0_pos);
}

#[test]
// Player 0 kills player 1 pin0
fn test_kill() {
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
    let (session_data, ludo_session_status) = ludo_dispatcher.get_session_status(session_id);
    let status = session_data.status;
    let expected_status = 2; // can play
    assert_eq!(status, expected_status);
    let nonce = session_data.nonce;
    println!("-- Session data, nonce: {:?}", nonce);
    println!("{:?}", ludo_session_status);

    let ludo_move = LudoMove { token_id: 0 };
    let ludo_move1 = ludo_move.clone();
    let ludo_move2 = ludo_move.clone();
    let ludo_move3 = ludo_move.clone();
    let ver_rand_num0 = VerifiableRandomNumber { random_number: 6, v: 1, r: 1, s: 1, };
    // can actually move from here
    let ver_rand_num1 = VerifiableRandomNumber { random_number: 2, v: 1, r: 1, s: 1, };
    let ver_rand_num_array = array![ver_rand_num0, ver_rand_num1];
    let ver_rand_num_array1 = ver_rand_num_array.clone();
    let ver_rand_num_array2 = ver_rand_num_array.clone();
    let ver_rand_num_array3 = ver_rand_num_array.clone();

    println!("-- Playing move for player 0");
    cheat_caller_address(ludo_contract, player_0, CheatSpan::TargetCalls(1));
    ludo_dispatcher.play(session_id, ludo_move, ver_rand_num_array);
    let (_, ludo_session_status) = ludo_dispatcher.get_session_status(session_id);
    //println!("{:?}", session_data);
    let (user0, user1, _, _) = ludo_session_status.users;
    let (user0_pin_0_pos, _, _, _) = user0.player_tokens_position;
    let (user1_pin_0_pos, _, _, _) = user1.player_tokens_position;
    let expected_user0_pin_0_pos = 1 + 2;
    println!("-- User 0 pin 0 pos: {:?}", user0_pin_0_pos);
    println!("-- User 1 pin 0 pos: {:?}", user1_pin_0_pos);
    assert_eq!(user0_pin_0_pos, expected_user0_pin_0_pos);

    println!("-- Playing move for player 1");
    cheat_caller_address(ludo_contract, player_1, CheatSpan::TargetCalls(1));
    ludo_dispatcher.play(session_id, ludo_move1, ver_rand_num_array1);
    let (_, ludo_session_status) = ludo_dispatcher.get_session_status(session_id);
    //println!("{:?}", session_data);
    let (user0, user1, _, _) = ludo_session_status.users;
    let (user0_pin_0_pos, _, _, _) = user0.player_tokens_position;
    let (user1_pin_0_pos, _, _, _) = user1.player_tokens_position;
    let expected_use1_pin_0_pos = 14 + 2;
    println!("-- User 0 pin 0 pos: {:?}", user0_pin_0_pos);
    println!("-- User 1 pin 0 pos: {:?}", user1_pin_0_pos);
    assert_eq!(user1_pin_0_pos, expected_use1_pin_0_pos);

    println!("-- Playing move for player 2");
    cheat_caller_address(ludo_contract, player_2, CheatSpan::TargetCalls(1));
    ludo_dispatcher.play(session_id, ludo_move2, ver_rand_num_array2);
    let (_, ludo_session_status) = ludo_dispatcher.get_session_status(session_id);
    //println!("{:?}", session_data);
    let (_, _, user2, _) = ludo_session_status.users;
    let (pin_0_pos, _, _, _) = user2.player_tokens_position;
    let expected_pin_0_pos = 27 + 2;
    assert_eq!(pin_0_pos, expected_pin_0_pos);

    println!("-- Playing move for player 3");
    cheat_caller_address(ludo_contract, player_3, CheatSpan::TargetCalls(1));
    ludo_dispatcher.play(session_id, ludo_move3, ver_rand_num_array3);
    let (_, ludo_session_status) = ludo_dispatcher.get_session_status(session_id);
    //println!("{:?}", session_data);
    let (_, _, _, user3) = ludo_session_status.users;
    let (pin_0_pos, _, _, _) = user3.player_tokens_position;
    let expected_pin_0_pos = 40 + 2;
    assert_eq!(pin_0_pos, expected_pin_0_pos);

    println!("-- Playing move for player 0 again");
    cheat_caller_address(ludo_contract, player_0, CheatSpan::TargetCalls(1));
    let ludo_move = LudoMove { token_id: 0 };
    let ver_rand_num0 = VerifiableRandomNumber { random_number: 6, v: 1, r: 1, s: 1, };
    let ver_rand_num1 = VerifiableRandomNumber { random_number: 6, v: 1, r: 1, s: 1, };
    let ver_rand_num2 = VerifiableRandomNumber { random_number: 1, v: 1, r: 1, s: 1, };
    let ver_rand_num_array = array![ver_rand_num0, ver_rand_num1, ver_rand_num2];
    ludo_dispatcher.play(session_id, ludo_move, ver_rand_num_array);
    let (session_data, ludo_session_status) = ludo_dispatcher.get_session_status(session_id);
    println!("{:?}", session_data);
    let (user0, user1, _, _) = ludo_session_status.users;
    let (user0_pin_0_pos, _, _, _) = user0.player_tokens_position;
    let (user1_pin_0_pos, _, _, _) = user1.player_tokens_position;
    let new_expected_user0_pin_0_pos = expected_user0_pin_0_pos + 13;
    println!("-- User 0 pin 0 pos: {:?}", user0_pin_0_pos);
    println!("-- User 1 pin 0 pos: {:?}", user1_pin_0_pos);
    assert_eq!(user0_pin_0_pos, new_expected_user0_pin_0_pos);
    assert_eq!(user1_pin_0_pos, 0);
}

#[test]
fn test_user0_pin0_wins() {
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
    let (session_data, ludo_session_status) = ludo_dispatcher.get_session_status(session_id);
    let status = session_data.status;
    let expected_status = 2; // can play
    assert_eq!(status, expected_status);
    println!("{:?}", session_data);
    println!("{:?}", ludo_session_status);

    let ludo_move = LudoMove { token_id: 0 };
    let ludo_move1 = ludo_move.clone();
    let ludo_move2 = ludo_move.clone();
    let ludo_move3 = ludo_move.clone();
    let ver_rand_num0 = VerifiableRandomNumber { random_number: 6, v: 1, r: 1, s: 1, };
    // can actually move from here
    let ver_rand_num1 = ver_rand_num0.clone();
    let ver_rand_num2 = ver_rand_num0.clone();
    let ver_rand_num3 = ver_rand_num0.clone();
    let ver_rand_num4 = ver_rand_num0.clone();
    let ver_rand_num5 = ver_rand_num0.clone();
    let ver_rand_num6 = ver_rand_num0.clone();
    let ver_rand_num7 = ver_rand_num0.clone();
    let ver_rand_num8 = ver_rand_num0.clone();
    let ver_rand_num9 = VerifiableRandomNumber { random_number: 2, v: 1, r: 1, s: 1, };

    let ver_rand_num_array = array![
        ver_rand_num0,
        ver_rand_num1,
        ver_rand_num2,
        ver_rand_num3,
        ver_rand_num4,
        ver_rand_num5,
        ver_rand_num6,
        ver_rand_num7,
        ver_rand_num8,
        ver_rand_num9
    ];
    let ver_rand_num_array1 = ver_rand_num_array.clone();
    let ver_rand_num_array2 = ver_rand_num_array.clone();
    let ver_rand_num_array3 = ver_rand_num_array.clone();

    println!("-- Playing move for player 0");
    cheat_caller_address(ludo_contract, player_0, CheatSpan::TargetCalls(1));
    ludo_dispatcher.play(session_id, ludo_move, ver_rand_num_array);
    let (_, ludo_session_status) = ludo_dispatcher.get_session_status(session_id);
    //println!("{:?}", session_data);
    let (user0, user1, _, _) = ludo_session_status.users;
    let (user0_pin_0_pos, _, _, _) = user0.player_tokens_position;
    let (user1_pin_0_pos, _, _, _) = user1.player_tokens_position;
    let expected_user0_pin_0_pos = 1 + 50;
    println!("-- User 0 pin 0 pos: {:?}", user0_pin_0_pos);
    println!("-- User 1 pin 0 pos: {:?}", user1_pin_0_pos);
    assert_eq!(user0_pin_0_pos, expected_user0_pin_0_pos);

    println!("-- Playing move for player 1");
    cheat_caller_address(ludo_contract, player_1, CheatSpan::TargetCalls(1));
    ludo_dispatcher.play(session_id, ludo_move1, ver_rand_num_array1);
    let (_, ludo_session_status) = ludo_dispatcher.get_session_status(session_id);
    //println!("{:?}", session_data);
    let (user0, user1, _, _) = ludo_session_status.users;
    let (user0_pin_0_pos, _, _, _) = user0.player_tokens_position;
    let (user1_pin_0_pos, _, _, _) = user1.player_tokens_position;
    let expected_use1_pin_0_pos = (14 + 50) % 52;
    println!("-- User 0 pin 0 pos: {:?}", user0_pin_0_pos);
    println!("-- User 1 pin 0 pos: {:?}", user1_pin_0_pos);
    assert_eq!(user1_pin_0_pos, expected_use1_pin_0_pos);

    println!("-- Playing move for player 2");
    cheat_caller_address(ludo_contract, player_2, CheatSpan::TargetCalls(1));
    ludo_dispatcher.play(session_id, ludo_move2, ver_rand_num_array2);
    let (_, ludo_session_status) = ludo_dispatcher.get_session_status(session_id);
    //println!("{:?}", session_data);
    let (_, _, user2, _) = ludo_session_status.users;
    let (pin_0_pos, _, _, _) = user2.player_tokens_position;
    let expected_pin_0_pos = (27 + 50) % 52;
    assert_eq!(pin_0_pos, expected_pin_0_pos);

    println!("-- Playing move for player 3");
    cheat_caller_address(ludo_contract, player_3, CheatSpan::TargetCalls(1));
    ludo_dispatcher.play(session_id, ludo_move3, ver_rand_num_array3);
    let (_, ludo_session_status) = ludo_dispatcher.get_session_status(session_id);
    let (_, _, _, user3) = ludo_session_status.users;
    let (pin_0_pos, _, _, _) = user3.player_tokens_position;
    let expected_pin_0_pos = (40 + 50) % 52;
    assert_eq!(pin_0_pos, expected_pin_0_pos);

    println!("-- Playing move for player 0 again");
    cheat_caller_address(ludo_contract, player_0, CheatSpan::TargetCalls(1));
    let ludo_move = LudoMove { token_id: 0 };
    let ver_rand_num0 = VerifiableRandomNumber { random_number: 6, v: 1, r: 1, s: 1, };
    let ver_rand_num_array = array![ver_rand_num0];
    ludo_dispatcher.play(session_id, ludo_move, ver_rand_num_array);
    let (session_data, ludo_session_status) = ludo_dispatcher.get_session_status(session_id);
    println!("{:?}", session_data);
    println!("{:?}", ludo_session_status);
    let (user0, user1, _, _) = ludo_session_status.users;
    let (user0_pin_0_pos, _, _, _) = user0.player_tokens_position;
    let (user1_pin_0_pos, _, _, _) = user1.player_tokens_position;
    let new_expected_user0_pin_0_pos = expected_user0_pin_0_pos + 6;
    println!("-- User 0 pin 0 pos: {:?}", user0_pin_0_pos);
    println!("-- User 1 pin 0 pos: {:?}", user1_pin_0_pos);
    assert_eq!(user0_pin_0_pos, new_expected_user0_pin_0_pos);
    let (user0_pin_0_winning, _, _, _) = user0.player_winning_tokens;
    assert!(user0_pin_0_winning);
}

#[test]
// Player 0 kills player 1 circled pin0
fn test_attack_circled() {
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
    let (session_data, ludo_session_status) = ludo_dispatcher.get_session_status(session_id);
    let status = session_data.status;
    let expected_status = 2; // can play
    assert_eq!(status, expected_status);
    println!("{:?}", session_data);
    println!("{:?}", ludo_session_status);

    let ludo_move = LudoMove { token_id: 0 };
    let ludo_move1 = ludo_move.clone();
    let ludo_move2 = ludo_move.clone();
    let ludo_move3 = ludo_move.clone();
    let ver_rand_num0 = VerifiableRandomNumber { random_number: 6, v: 1, r: 1, s: 1, };
    // can actually move from here
    let ver_rand_num1 = VerifiableRandomNumber { random_number: 2, v: 1, r: 1, s: 1, };
    let ver_rand_num_array = array![ver_rand_num0, ver_rand_num1];
    //let ver_rand_num_array1 = ver_rand_num_array.clone();
    let ver_rand_num_array2 = ver_rand_num_array.clone();
    let ver_rand_num_array3 = ver_rand_num_array.clone();

    println!("-- Playing move for player 0");
    cheat_caller_address(ludo_contract, player_0, CheatSpan::TargetCalls(1));
    ludo_dispatcher.play(session_id, ludo_move, ver_rand_num_array);
    let (_, ludo_session_status) = ludo_dispatcher.get_session_status(session_id);
    //println!("{:?}", session_data);
    let (user0, user1, _, _) = ludo_session_status.users;
    let (user0_pin_0_pos, _, _, _) = user0.player_tokens_position;
    let (user1_pin_0_pos, _, _, _) = user1.player_tokens_position;
    let expected_user0_pin_0_pos = 3;
    println!("-- User 0 pin 0 pos: {:?}", user0_pin_0_pos);
    println!("-- User 1 pin 0 pos: {:?}", user1_pin_0_pos);
    assert_eq!(user0_pin_0_pos, expected_user0_pin_0_pos);

    println!("-- Playing move for player 1");
    let ver_rand_num0 = VerifiableRandomNumber { random_number: 6, v: 1, r: 1, s: 1, };
    // can actually move from here
    let ver_rand_num1 = ver_rand_num0.clone();
    let ver_rand_num2 = ver_rand_num0.clone();
    let ver_rand_num3 = ver_rand_num0.clone();
    let ver_rand_num4 = ver_rand_num0.clone();
    let ver_rand_num5 = ver_rand_num0.clone();
    let ver_rand_num6 = ver_rand_num0.clone();
    let ver_rand_num7 = VerifiableRandomNumber { random_number: 6, v: 1, r: 1, s: 1, };

    let ver_rand_num_array1 = array![
        ver_rand_num0,
        ver_rand_num1,
        ver_rand_num2,
        ver_rand_num3,
        ver_rand_num4,
        ver_rand_num5,
        ver_rand_num6,
        ver_rand_num7,
    ];

    cheat_caller_address(ludo_contract, player_1, CheatSpan::TargetCalls(1));
    ludo_dispatcher.play(session_id, ludo_move1, ver_rand_num_array1);
    let (_, ludo_session_status) = ludo_dispatcher.get_session_status(session_id);
    //println!("{:?}", session_data);
    let (user0, user1, _, _) = ludo_session_status.users;
    let (user0_pin_0_pos, _, _, _) = user0.player_tokens_position;
    let (user1_pin_0_pos, _, _, _) = user1.player_tokens_position;
    let (user1_pin_0_circled, _, _, _) = user1.player_tokens_circled;
    let expected_use1_pin_0_pos = (14 + 42) % 52;
    println!("-- User 0 pin 0 pos: {:?}", user0_pin_0_pos);
    println!("-- User 1 pin 0 pos: {:?}", user1_pin_0_pos);
    assert_eq!(user1_pin_0_pos, expected_use1_pin_0_pos);
    assert!(user1_pin_0_circled);

    println!("-- Playing move for player 2");
    cheat_caller_address(ludo_contract, player_2, CheatSpan::TargetCalls(1));
    ludo_dispatcher.play(session_id, ludo_move2, ver_rand_num_array2);
    let (_, ludo_session_status) = ludo_dispatcher.get_session_status(session_id);
    //println!("{:?}", session_data);
    let (_, _, user2, _) = ludo_session_status.users;
    let (pin_0_pos, _, _, _) = user2.player_tokens_position;
    let expected_pin_0_pos = 27 + 2;
    assert_eq!(pin_0_pos, expected_pin_0_pos);

    println!("-- Playing move for player 3");
    cheat_caller_address(ludo_contract, player_3, CheatSpan::TargetCalls(1));
    ludo_dispatcher.play(session_id, ludo_move3, ver_rand_num_array3);
    let (_, ludo_session_status) = ludo_dispatcher.get_session_status(session_id);
    //println!("{:?}", session_data);
    let (_, _, _, user3) = ludo_session_status.users;
    let (pin_0_pos, _, _, _) = user3.player_tokens_position;
    let expected_pin_0_pos = 40 + 2;
    assert_eq!(pin_0_pos, expected_pin_0_pos);

    println!("-- Playing move for player 0 again");
    cheat_caller_address(ludo_contract, player_0, CheatSpan::TargetCalls(1));
    let ludo_move = LudoMove { token_id: 0 };
    let ver_rand_num0 = VerifiableRandomNumber { random_number: 1, v: 1, r: 1, s: 1, };
    let ver_rand_num_array = array![ver_rand_num0];
    ludo_dispatcher.play(session_id, ludo_move, ver_rand_num_array);
    let (session_data, ludo_session_status) = ludo_dispatcher.get_session_status(session_id);
    println!("{:?}", session_data);
    println!("{:?}", ludo_session_status);
    let (user0, user1, _, _) = ludo_session_status.users;
    let (user0_pin_0_pos, _, _, _) = user0.player_tokens_position;
    let (user1_pin_0_pos, _, _, _) = user1.player_tokens_position;
    let (user1_pin_0_circled, _, _, _) = user1.player_tokens_circled;
    let new_expected_user0_pin_0_pos = expected_user0_pin_0_pos + 1;
    println!("-- User 0 pin 0 pos: {:?}", user0_pin_0_pos);
    println!("-- User 1 pin 0 pos: {:?}", user1_pin_0_pos);
    assert_eq!(user0_pin_0_pos, new_expected_user0_pin_0_pos);
    assert_eq!(user1_pin_0_pos, 0);
    assert!(!user1_pin_0_circled);
}

#[test]
fn test_user0_user1_user2_user3_wins() {
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
    let (session_data, ludo_session_status) = ludo_dispatcher.get_session_status(session_id);
    let status = session_data.status;
    let expected_status = 2; // can play
    assert_eq!(status, expected_status);
    println!("{:?}", session_data);
    println!("{:?}", ludo_session_status);

    let ludo_move = LudoMove { token_id: 0 };
    let ludo_move1 = ludo_move.clone();
    let ludo_move2 = ludo_move.clone();
    let ludo_move3 = ludo_move.clone();
    let ver_rand_num0 = VerifiableRandomNumber { random_number: 6, v: 1, r: 1, s: 1, };
    // can actually move from here
    let ver_rand_num1 = ver_rand_num0.clone();
    let ver_rand_num2 = ver_rand_num0.clone();
    let ver_rand_num3 = ver_rand_num0.clone();
    let ver_rand_num4 = ver_rand_num0.clone();
    let ver_rand_num5 = ver_rand_num0.clone();
    let ver_rand_num6 = ver_rand_num0.clone();
    let ver_rand_num7 = ver_rand_num0.clone();
    let ver_rand_num8 = ver_rand_num0.clone();
    let ver_rand_num9 = ver_rand_num0.clone();
    let ver_rand_num10 = VerifiableRandomNumber { random_number: 2, v: 1, r: 1, s: 1, };

    let ver_rand_num_array = array![
        ver_rand_num0,
        ver_rand_num1,
        ver_rand_num2,
        ver_rand_num3,
        ver_rand_num4,
        ver_rand_num5,
        ver_rand_num6,
        ver_rand_num7,
        ver_rand_num8,
        ver_rand_num9,
        ver_rand_num10
    ];
    let ver_rand_num_array1 = ver_rand_num_array.clone();
    let ver_rand_num_array2 = ver_rand_num_array.clone();
    let ver_rand_num_array3 = ver_rand_num_array.clone();

    println!("-- Playing move for player 0");
    cheat_caller_address(ludo_contract, player_0, CheatSpan::TargetCalls(1));
    ludo_dispatcher.play(session_id, ludo_move, ver_rand_num_array);
    let (_, ludo_session_status) = ludo_dispatcher.get_session_status(session_id);
    //println!("{:?}", session_data);
    let (user0, user1, _, _) = ludo_session_status.users;
    let (user0_pin_0_pos, _, _, _) = user0.player_tokens_position;
    let (user1_pin_0_pos, _, _, _) = user1.player_tokens_position;
    let expected_user0_pin_0_pos = 1 + 56;
    println!("-- User 0 pin 0 pos: {:?}", user0_pin_0_pos);
    println!("-- User 1 pin 0 pos: {:?}", user1_pin_0_pos);
    assert_eq!(user0_pin_0_pos, expected_user0_pin_0_pos);

    println!("-- Playing move for player 1");
    cheat_caller_address(ludo_contract, player_1, CheatSpan::TargetCalls(1));
    ludo_dispatcher.play(session_id, ludo_move1, ver_rand_num_array1);
    let (_, ludo_session_status) = ludo_dispatcher.get_session_status(session_id);
    //println!("{:?}", session_data);
    let (user0, user1, _, _) = ludo_session_status.users;
    let (user0_pin_0_pos, _, _, _) = user0.player_tokens_position;
    let (user1_pin_0_pos, _, _, _) = user1.player_tokens_position;
    let expected_use1_pin_0_pos = (14 + 56) % 52;
    println!("-- User 0 pin 0 pos: {:?}", user0_pin_0_pos);
    println!("-- User 1 pin 0 pos: {:?}", user1_pin_0_pos);
    assert_eq!(user1_pin_0_pos, expected_use1_pin_0_pos);

    println!("-- Playing move for player 2");
    cheat_caller_address(ludo_contract, player_2, CheatSpan::TargetCalls(1));
    ludo_dispatcher.play(session_id, ludo_move2, ver_rand_num_array2);
    let (_, ludo_session_status) = ludo_dispatcher.get_session_status(session_id);
    //println!("{:?}", session_data);
    let (_, _, user2, _) = ludo_session_status.users;
    let (pin_0_pos, _, _, _) = user2.player_tokens_position;
    let expected_pin_0_pos = (27 + 56) % 52;
    assert_eq!(pin_0_pos, expected_pin_0_pos);

    println!("-- Playing move for player 3");
    cheat_caller_address(ludo_contract, player_3, CheatSpan::TargetCalls(1));
    ludo_dispatcher.play(session_id, ludo_move3, ver_rand_num_array3);
    let (_, ludo_session_status) = ludo_dispatcher.get_session_status(session_id);
    println!("{:?}", ludo_session_status);
    let (user0, user1, user2, user3) = ludo_session_status.users;
    let (pin_0_pos, _, _, _) = user3.player_tokens_position;
    let expected_pin_0_pos = (40 + 56) % 52;
    assert_eq!(pin_0_pos, expected_pin_0_pos);

    let (user0_pin_0_winning, _, _, _) = user0.player_winning_tokens;
    let (user1_pin_0_winning, _, _, _) = user1.player_winning_tokens;
    let (user2_pin_0_winning, _, _, _) = user2.player_winning_tokens;
    let (user3_pin_0_winning, _, _, _) = user3.player_winning_tokens;
    assert!(user0_pin_0_winning);
    assert!(user1_pin_0_winning);
    assert!(user2_pin_0_winning);
    assert!(user3_pin_0_winning);
}

#[test]
fn test_player0_wins() {
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
    let ludo_move1 = ludo_move.clone();
    let ludo_move2 = ludo_move.clone();
    let ludo_move3 = ludo_move.clone();
    let ver_rand_num0 = VerifiableRandomNumber { random_number: 6, v: 1, r: 1, s: 1, };
    // can actually move from here
    let ver_rand_num1 = ver_rand_num0.clone();
    let ver_rand_num2 = ver_rand_num0.clone();
    let ver_rand_num3 = ver_rand_num0.clone();
    let ver_rand_num4 = ver_rand_num0.clone();
    let ver_rand_num5 = ver_rand_num0.clone();
    let ver_rand_num6 = ver_rand_num0.clone();
    let ver_rand_num7 = ver_rand_num0.clone();
    let ver_rand_num8 = ver_rand_num0.clone();
    let ver_rand_num9 = ver_rand_num0.clone();
    let ver_rand_num10 = VerifiableRandomNumber { random_number: 2, v: 1, r: 1, s: 1, };

    let ver_rand_num_array = array![
        ver_rand_num0,
        ver_rand_num1,
        ver_rand_num2,
        ver_rand_num3,
        ver_rand_num4,
        ver_rand_num5,
        ver_rand_num6,
        ver_rand_num7,
        ver_rand_num8,
        ver_rand_num9,
        ver_rand_num10
    ];
    let ver_rand_num_array1 = ver_rand_num_array.clone();
    let ver_rand_num_array2 = ver_rand_num_array.clone();
    let ver_rand_num_array3 = ver_rand_num_array.clone();

    // for 2nd round
    let var_rand_num_array4 = ver_rand_num_array.clone();
    let var_rand_num_array5 = ver_rand_num_array.clone();
    let var_rand_num_array6 = ver_rand_num_array.clone();
    let var_rand_num_array7 = ver_rand_num_array.clone();

    // for 3rd round
    let var_rand_num_array8 = ver_rand_num_array.clone();
    let var_rand_num_array9 = ver_rand_num_array.clone();
    let var_rand_num_array10 = ver_rand_num_array.clone();
    let var_rand_num_array11 = ver_rand_num_array.clone();

    // for 4th round
    let var_rand_num_array12 = ver_rand_num_array.clone();

    println!("-- Playing move for player 0");
    cheat_caller_address(ludo_contract, player_0, CheatSpan::TargetCalls(1));
    ludo_dispatcher.play(session_id, ludo_move, ver_rand_num_array);
    let (_, ludo_session_status) = ludo_dispatcher.get_session_status(session_id);
    let (user0, user1, _, _) = ludo_session_status.users;
    let (user0_pin_0_pos, _, _, _) = user0.player_tokens_position;
    let (user1_pin_0_pos, _, _, _) = user1.player_tokens_position;
    let expected_user0_pin_0_pos = 1 + 56;
    println!("-- User 0 pin 0 pos: {:?}", user0_pin_0_pos);
    println!("-- User 1 pin 0 pos: {:?}", user1_pin_0_pos);
    assert_eq!(user0_pin_0_pos, expected_user0_pin_0_pos);

    println!("-- Playing move for player 1");
    cheat_caller_address(ludo_contract, player_1, CheatSpan::TargetCalls(1));
    ludo_dispatcher.play(session_id, ludo_move1, ver_rand_num_array1);
    let (_, ludo_session_status) = ludo_dispatcher.get_session_status(session_id);
    let (user0, user1, _, _) = ludo_session_status.users;
    let (user0_pin_0_pos, _, _, _) = user0.player_tokens_position;
    let (user1_pin_0_pos, _, _, _) = user1.player_tokens_position;
    let expected_use1_pin_0_pos = (14 + 56) % 52;
    println!("-- User 0 pin 0 pos: {:?}", user0_pin_0_pos);
    println!("-- User 1 pin 0 pos: {:?}", user1_pin_0_pos);
    assert_eq!(user1_pin_0_pos, expected_use1_pin_0_pos);

    println!("-- Playing move for player 2");
    cheat_caller_address(ludo_contract, player_2, CheatSpan::TargetCalls(1));
    ludo_dispatcher.play(session_id, ludo_move2, ver_rand_num_array2);
    let (_, ludo_session_status) = ludo_dispatcher.get_session_status(session_id);
    let (_, _, user2, _) = ludo_session_status.users;
    let (pin_0_pos, _, _, _) = user2.player_tokens_position;
    let expected_pin_0_pos = (27 + 56) % 52;
    assert_eq!(pin_0_pos, expected_pin_0_pos);

    println!("-- Playing move for player 3");
    cheat_caller_address(ludo_contract, player_3, CheatSpan::TargetCalls(1));
    ludo_dispatcher.play(session_id, ludo_move3, ver_rand_num_array3);
    let (_, ludo_session_status) = ludo_dispatcher.get_session_status(session_id);
    let (_, _, _, user3) = ludo_session_status.users;
    let (pin_0_pos, _, _, _) = user3.player_tokens_position;
    let expected_pin_0_pos = (40 + 56) % 52;
    assert_eq!(pin_0_pos, expected_pin_0_pos);

    println!("-- Playing move for player 0 pin 1");
    let ludo_move = LudoMove { token_id: 1 };
    cheat_caller_address(ludo_contract, player_0, CheatSpan::TargetCalls(1));
    ludo_dispatcher.play(session_id, ludo_move, var_rand_num_array4);
    let (_, ludo_session_status) = ludo_dispatcher.get_session_status(session_id);
    let (user0, user1, _, _) = ludo_session_status.users;
    let (_, user0_pin_1_pos, _, _) = user0.player_tokens_position;
    let (_, user1_pin_1_pos, _, _) = user1.player_tokens_position;
    println!("-- User 0 pin 1 pos: {:?}", user0_pin_1_pos);
    println!("-- User 1 pin 1 pos: {:?}", user1_pin_1_pos);
    let expected_user0_pin_1_pos = 1 + 56;
    assert_eq!(user0_pin_1_pos, expected_user0_pin_1_pos);
    assert_eq!(user1_pin_1_pos, 0);

    println!("-- Playing move for player 1 pin 1");
    let ludo_move = LudoMove { token_id: 1 };
    cheat_caller_address(ludo_contract, player_1, CheatSpan::TargetCalls(1));
    ludo_dispatcher.play(session_id, ludo_move, var_rand_num_array5);
    let (_, ludo_session_status) = ludo_dispatcher.get_session_status(session_id);
    let (_, user1, _, _) = ludo_session_status.users;
    let (_, user1_pin_1_pos, _, _) = user1.player_tokens_position;
    let expected_user1_pin_1_pos = (14 + 56) % 52;
    assert_eq!(user1_pin_1_pos, expected_user1_pin_1_pos);

    println!("-- Playing move for player 2 pin 1");
    let ludo_move = LudoMove { token_id: 1 };
    cheat_caller_address(ludo_contract, player_2, CheatSpan::TargetCalls(1));
    ludo_dispatcher.play(session_id, ludo_move, var_rand_num_array6);
    let (_, ludo_session_status) = ludo_dispatcher.get_session_status(session_id);
    let (_, _, user2, _) = ludo_session_status.users;
    let (_, user2_pin_1_pos, _, _) = user2.player_tokens_position;
    let expected_user2_pin_1_pos = (27 + 56) % 52;
    assert_eq!(user2_pin_1_pos, expected_user2_pin_1_pos);

    println!("-- Playing move for player 3 pin 1");
    let ludo_move = LudoMove { token_id: 1 };
    cheat_caller_address(ludo_contract, player_3, CheatSpan::TargetCalls(1));
    ludo_dispatcher.play(session_id, ludo_move, var_rand_num_array7);
    let (_, ludo_session_status) = ludo_dispatcher.get_session_status(session_id);
    let (_, _, _, user3) = ludo_session_status.users;
    let (_, user3_pin_1_pos, _, _) = user3.player_tokens_position;
    let expected_user3_pin_1_pos = (40 + 56) % 52;
    assert_eq!(user3_pin_1_pos, expected_user3_pin_1_pos);

    println!("-- Playing move for player 0 pin 2");
    let ludo_move = LudoMove { token_id: 2 };
    cheat_caller_address(ludo_contract, player_0, CheatSpan::TargetCalls(1));
    ludo_dispatcher.play(session_id, ludo_move, var_rand_num_array8);
    let (_, ludo_session_status) = ludo_dispatcher.get_session_status(session_id);
    let (user0, user1, _, _) = ludo_session_status.users;
    let (_, _, user0_pin_2_pos, _) = user0.player_tokens_position;
    let (_, _, user1_pin_2_pos, _) = user1.player_tokens_position;
    println!("-- User 0 pin 2 pos: {:?}", user0_pin_2_pos);
    println!("-- User 1 pin 2 pos: {:?}", user1_pin_2_pos);
    let expected_user0_pin_2_pos = 1 + 56;
    assert_eq!(user0_pin_2_pos, expected_user0_pin_2_pos);
    assert_eq!(user1_pin_2_pos, 0);

    println!("-- Playing move for player 1 pin 2");
    let ludo_move = LudoMove { token_id: 2 };
    cheat_caller_address(ludo_contract, player_1, CheatSpan::TargetCalls(1));
    ludo_dispatcher.play(session_id, ludo_move, var_rand_num_array9);
    let (_, ludo_session_status) = ludo_dispatcher.get_session_status(session_id);
    let (_, user1, _, _) = ludo_session_status.users;
    let (_, _, user1_pin_2_pos, _) = user1.player_tokens_position;
    let expected_user1_pin_2_pos = (14 + 56) % 52;
    assert_eq!(user1_pin_2_pos, expected_user1_pin_2_pos);

    println!("-- Playing move for player 2 pin 2");
    let ludo_move = LudoMove { token_id: 2 };
    cheat_caller_address(ludo_contract, player_2, CheatSpan::TargetCalls(1));
    ludo_dispatcher.play(session_id, ludo_move, var_rand_num_array10);
    let (_, ludo_session_status) = ludo_dispatcher.get_session_status(session_id);
    let (_, _, user2, _) = ludo_session_status.users;
    let (_, _, user2_pin_2_pos, _) = user2.player_tokens_position;
    let expected_user2_pin_2_pos = (27 + 56) % 52;
    assert_eq!(user2_pin_2_pos, expected_user2_pin_2_pos);

    println!("-- Playing move for player 3 pin 2");
    let ludo_move = LudoMove { token_id: 2 };
    cheat_caller_address(ludo_contract, player_3, CheatSpan::TargetCalls(1));
    ludo_dispatcher.play(session_id, ludo_move, var_rand_num_array11);
    let (_, ludo_session_status) = ludo_dispatcher.get_session_status(session_id);
    println!("{:?}", ludo_session_status);
    let (_, _, _, user3) = ludo_session_status.users;
    let (_, _, user3_pin_2_pos, _) = user3.player_tokens_position;
    let expected_user3_pin_2_pos = (40 + 56) % 52;
    assert_eq!(user3_pin_2_pos, expected_user3_pin_2_pos);

    println!("-- Playing move for player 0 pin 3 to win");
    let ludo_move = LudoMove { token_id: 3 };
    cheat_caller_address(ludo_contract, player_0, CheatSpan::TargetCalls(1));
    ludo_dispatcher.play(session_id, ludo_move, var_rand_num_array12);
    let (_, ludo_session_status) = ludo_dispatcher.get_session_status(session_id);
    println!("{:?}", ludo_session_status);
    let (user0, _, _, _) = ludo_session_status.users;
    let (_, _, _, user0_pin_3_pos) = user0.player_tokens_position;
    let expected_user0_pin_3_pos = 1 + 56;
    assert_eq!(user0_pin_3_pos, expected_user0_pin_3_pos);

    let (_, _, _, user0_pin_3_winning) = user0.player_winning_tokens;
    assert!(user0_pin_3_winning);
}
