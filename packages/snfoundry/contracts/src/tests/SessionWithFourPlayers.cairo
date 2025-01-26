use contracts::interfaces::ILudo::{ILudoDispatcherTrait, LudoMove};
use contracts::interfaces::IMarquisGame::{IMarquisGameDispatcher, IMarquisGameDispatcherTrait};
use openzeppelin_token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
use snforge_std::{CheatSpan, EventSpyTrait, EventsFilterTrait, cheat_caller_address, spy_events};
use starknet::ContractAddress;

use super::SetUp::{
    ETH_TOKEN_ADDRESS, OWNER, PLAYER_0, PLAYER_1, PLAYER_2, PLAYER_3, USDC_TOKEN_ADDRESS,
    ZERO_TOKEN,
};
use super::SetUp::{
    assert_position_0_eq, deploy_ludo_contract, feign_win_four, generate_verifiable_random_numbers,
    player_move, setup_game_4_players, setup_game_new,
};


#[test]
fn should_create_new_game_session() {
    let ludo_contract = deploy_ludo_contract();
    let marquis_game_dispatcher = IMarquisGameDispatcher { contract_address: ludo_contract };
    let token = ZERO_TOKEN();
    let amount = 0;
    let required_players = 4;
    let session_id = marquis_game_dispatcher.create_session(Option::Some(token), Option::Some(amount), required_players);
    let expected_session_id = 1;
    assert_eq!(session_id, expected_session_id);
}

#[test]
fn should_create_new_game_session_with_eth_token_deposit() {
    // given a new game
    let eth_contract_address = ETH_TOKEN_ADDRESS();
    let amount = 100;
    let required_players = 4;
    let (context, player_0_init_balance) = setup_game_new(
        eth_contract_address, amount, required_players,
    );

    let expected_session_id = 1;
    let erc20_dispatcher = IERC20Dispatcher { contract_address: eth_contract_address };

    // then check deposit
    let player_0 = PLAYER_0();
    let player_balance_after = erc20_dispatcher.balance_of(player_0);
    assert_eq!(player_0_init_balance - player_balance_after, amount);
    assert_eq!(context.session_id, expected_session_id);
}

#[test]
fn should_allow_player_to_join_session() {
    // given a new game
    let (context, _) = setup_game_new(ZERO_TOKEN(), 0, 4);

    // when a player join session
    let player_1 = PLAYER_1();
    cheat_caller_address(context.ludo_contract, player_1, CheatSpan::TargetCalls(1));
    context.marquis_game_dispatcher.join_session(context.session_id);

    // then check session status
    let (session_data, _) = context.ludo_dispatcher.get_session_status(context.session_id);
    let player_count = session_data.player_count;
    let status = session_data.status;
    let expected_player_count = 2;
    let expected_status = 1; // waiting for players
    assert_eq!(player_count, expected_player_count);
    assert_eq!(status, expected_status);
}

#[test]
fn should_allow_player_to_join_with_eth_token_stake() {
    // given a new game
    let eth_contract_address = ETH_TOKEN_ADDRESS();
    let amount = 100;
    let required_players = 4;
    let (context, player_0_init_balance) = setup_game_new(
        eth_contract_address, amount, required_players,
    );

    let player_0 = PLAYER_0();
    let player_1 = PLAYER_1();
    let erc20_dispatcher = IERC20Dispatcher { contract_address: eth_contract_address };
    let player_1_init_balance = erc20_dispatcher.balance_of(player_1);

    // when a player join session
    cheat_caller_address(eth_contract_address, player_1, CheatSpan::TargetCalls(1));
    erc20_dispatcher.approve(context.ludo_contract, amount);
    cheat_caller_address(context.ludo_contract, player_1, CheatSpan::TargetCalls(1));
    context.marquis_game_dispatcher.join_session(context.session_id);

    // then check session status
    let (session_data, _) = context.ludo_dispatcher.get_session_status(context.session_id);
    let player_count = session_data.player_count;
    let status = session_data.status;
    let expected_player_count = 2;
    let expected_status = 1; // waiting for players
    assert_eq!(player_count, expected_player_count);
    assert_eq!(status, expected_status);

    // then check players stacke
    let player_0_balance_after_join = erc20_dispatcher.balance_of(player_0);
    println!("-- Player 0 balance after joining: {:?}", player_0_balance_after_join);
    assert_eq!(player_0_balance_after_join, player_0_init_balance - amount);
    let player_1_balance_after_join = erc20_dispatcher.balance_of(player_1);
    println!("-- Player 1 balance after joining: {:?}", player_1_balance_after_join);
    assert_eq!(player_1_balance_after_join, player_1_init_balance - amount);
}

#[test]
fn should_require_four_players_to_start_game() {
    // given a new game
    let (context, _) = setup_game_new(ZERO_TOKEN(), 0, 4);

    // when 2 players join
    let player_1 = PLAYER_1();
    cheat_caller_address(context.ludo_contract, player_1, CheatSpan::TargetCalls(1));
    context.marquis_game_dispatcher.join_session(context.session_id);

    let player_2 = PLAYER_2();
    cheat_caller_address(context.ludo_contract, player_2, CheatSpan::TargetCalls(1));
    context.marquis_game_dispatcher.join_session(context.session_id);

    // then game is WAITING
    let (session_data, _) = context.ludo_dispatcher.get_session_status(context.session_id);
    let player_count = session_data.player_count;
    let status = session_data.status;
    let expected_player_count = 3;
    let expected_status = 1; // waiting for players
    assert_eq!(player_count, expected_player_count);
    assert_eq!(status, expected_status);

    // when a 3rd player join
    let player_3 = PLAYER_3();
    cheat_caller_address(context.ludo_contract, player_3, CheatSpan::TargetCalls(1));
    context.marquis_game_dispatcher.join_session(context.session_id);

    // then game is ready
    let (session_data, _) = context.ludo_dispatcher.get_session_status(context.session_id);
    let player_count = session_data.player_count;
    let status = session_data.status;
    let expected_player_count = 4;
    let expected_status = 2; // can play
    assert_eq!(player_count, expected_player_count);
    assert_eq!(status, expected_status);

    println!("-- Session data: {:?}", session_data);
}

#[test]
fn should_allow_player_0_to_finish_before_game_starts_with_zero_token_stake() {
    // given a new game
    let (context, _) = setup_game_new(ZERO_TOKEN(), 0, 4);
    let player_0 = PLAYER_0();

    // then check status
    let (session_data, _) = context.ludo_dispatcher.get_session_status(context.session_id);
    let status = session_data.status;
    let expected_status = 1; // waiting for players
    assert_eq!(status, expected_status);
    let nonce = session_data.nonce;
    println!("-- Session data, nonce: {:?}", nonce);

    // when player 0 finish session
    let mut spy = spy_events();
    cheat_caller_address(context.ludo_contract, player_0, CheatSpan::TargetCalls(1));
    let option_loser_id = Option::None;
    context.marquis_game_dispatcher.player_finish_session(context.session_id, option_loser_id);

    // then verify ForcedSessionFinished event was emitted
    let events = spy.get_events().emitted_by(context.ludo_contract);
    let (from, event) = events.events.at(0);
    let felt_session_id: felt252 = context.session_id.try_into().unwrap();
    assert_eq!(from, @context.ludo_contract);
    assert_eq!(event.keys.at(0), @selector!("ForcedSessionFinished"));
    assert_eq!(event.keys.at(1), @felt_session_id);

    // then session is finished
    let (session_data, ludo_session_status) = context
        .ludo_dispatcher
        .get_session_status(context.session_id);
    println!("{:?}", session_data);
    println!("{:?}", ludo_session_status);
    let status = session_data.status;
    let expected_status = 3; // finished
    assert_eq!(status, expected_status);

    // then no player session
    let player_0_session = context.marquis_game_dispatcher.player_session(player_0);
    let expected_player_0_session = 0; // no session
    assert_eq!(player_0_session, expected_player_0_session);

    // player 0 can create a new session
    let token = ZERO_TOKEN();
    let amount = 0;
    cheat_caller_address(context.ludo_contract, player_0, CheatSpan::TargetCalls(1));
    let required_players = 4;
    let new_session_id = context
        .marquis_game_dispatcher
        .create_session(Option::Some(token), Option::Some(amount), required_players);
    let expected_session_id = 2;
    assert_eq!(new_session_id, expected_session_id);
}

#[test]
fn should_allow_player_0_to_finish_before_game_starts_with_eth_token_stake() {
    // given a new game with ETH stakes
    let eth_contract_address = ETH_TOKEN_ADDRESS();
    let amount = 100;
    let required_players = 4;
    let (context, player_0_init_balance) = setup_game_new(
        eth_contract_address, amount, required_players,
    );
    let player_0 = PLAYER_0();

    // when player 0 finishes session
    cheat_caller_address(context.ludo_contract, player_0, CheatSpan::TargetCalls(1));
    let option_loser_id = Option::None;
    context.marquis_game_dispatcher.player_finish_session(context.session_id, option_loser_id);
    println!("-- Player 0 finished session");

    // then session is finished
    let (session_data, _) = context.ludo_dispatcher.get_session_status(context.session_id);
    let status = session_data.status;
    let expected_status = 3; // finished
    assert_eq!(status, expected_status);

    // then verify players got their stakes back
    let erc20_dispatcher = IERC20Dispatcher { contract_address: eth_contract_address };
    let player_0_balance_after = erc20_dispatcher.balance_of(player_0);

    println!("-- Player 0 balance after finish: {:?}", player_0_balance_after);

    assert_eq!(player_0_balance_after, player_0_init_balance);

    // then verify players are unlocked
    let player_0_session = context.marquis_game_dispatcher.player_session(player_0);
    let expected_no_session = 0;
    assert_eq!(player_0_session, expected_no_session);
}

#[test]
fn should_allow_player_1_to_finish_before_game_starts_with_zero_token_stake() {
    // given a new game
    let (context, _) = setup_game_new(ZERO_TOKEN(), 0, 4);
    let player_0 = PLAYER_0();

    // when a player join the session
    let player_1 = PLAYER_1();
    cheat_caller_address(context.ludo_contract, player_1, CheatSpan::TargetCalls(1));
    context.marquis_game_dispatcher.join_session(context.session_id);

    // then check session status
    let (session_data, _) = context.ludo_dispatcher.get_session_status(context.session_id);
    let status = session_data.status;
    let expected_status = 1; // waiting for players
    assert_eq!(status, expected_status);
    let nonce = session_data.nonce;
    println!("-- Session data, nonce: {:?}", nonce);

    // when a player finish the session
    let mut spy = spy_events();
    cheat_caller_address(context.ludo_contract, player_1, CheatSpan::TargetCalls(1));
    let option_loser_id = Option::None;
    context.marquis_game_dispatcher.player_finish_session(context.session_id, option_loser_id);

    // then verify ForcedSessionFinished event was emitted
    let events = spy.get_events().emitted_by(context.ludo_contract);
    let (from, event) = events.events.at(0);
    let felt_session_id: felt252 = context.session_id.try_into().unwrap();
    assert_eq!(from, @context.ludo_contract);
    assert_eq!(event.keys.at(0), @selector!("ForcedSessionFinished"));
    assert_eq!(event.keys.at(1), @felt_session_id);

    // then session must be finished
    let (session_data, ludo_session_status) = context
        .ludo_dispatcher
        .get_session_status(context.session_id);
    println!("{:?}", session_data);
    println!("{:?}", ludo_session_status);
    let status = session_data.status;
    let expected_status = 3; // finished
    assert_eq!(status, expected_status);

    // then check player session
    let player_0_session = context.marquis_game_dispatcher.player_session(player_0);
    let expected_player_1_session = 0; // no session
    assert_eq!(player_0_session, expected_player_1_session);
    let player_1_session = context.marquis_game_dispatcher.player_session(player_1);
    println!("player_1_session: {:?}", player_1_session);
    assert_eq!(player_1_session, expected_player_1_session);

    // player 1 can create a new session
    let token = ZERO_TOKEN();
    let amount = 0;
    let required_players = 4;
    cheat_caller_address(context.ludo_contract, player_1, CheatSpan::TargetCalls(1));
    let new_session_id = context
        .marquis_game_dispatcher
        .create_session(Option::Some(token), Option::Some(amount), required_players);
    println!("let new_session_id: {:?}", new_session_id);
}

#[test]
fn should_allow_player_1_to_finish_before_game_starts_with_eth_token_stake() {
    // given a new game with ETH stakes
    let eth_contract_address = ETH_TOKEN_ADDRESS();
    let amount = 100;
    let required_players = 4;
    let (context, _) = setup_game_new(eth_contract_address, amount, required_players);

    // when player 1 joins the session
    let player_1 = PLAYER_1();
    let erc20_dispatcher = IERC20Dispatcher { contract_address: eth_contract_address };
    let player_1_init_balance = erc20_dispatcher.balance_of(player_1);

    cheat_caller_address(eth_contract_address, player_1, CheatSpan::TargetCalls(1));
    erc20_dispatcher.approve(context.ludo_contract, amount);
    cheat_caller_address(context.ludo_contract, player_1, CheatSpan::TargetCalls(1));
    context.marquis_game_dispatcher.join_session(context.session_id);

    // when player 1 finishes session
    cheat_caller_address(context.ludo_contract, player_1, CheatSpan::TargetCalls(1));
    let option_loser_id = Option::None;
    context.marquis_game_dispatcher.player_finish_session(context.session_id, option_loser_id);
    println!("-- Player 1 finished session");

    // then session is finished
    let (session_data, _) = context.ludo_dispatcher.get_session_status(context.session_id);
    let status = session_data.status;
    let expected_status = 3; // finished
    assert_eq!(status, expected_status);

    // then verify players got their stakes back
    let player_1_balance_after = erc20_dispatcher.balance_of(player_1);
    println!("-- Player 1 balance after finish: {:?}", player_1_balance_after);
    assert_eq!(player_1_balance_after, player_1_init_balance);

    // then verify players are unlocked
    let player_1_session = context.marquis_game_dispatcher.player_session(player_1);
    let expected_no_session = 0;
    assert_eq!(player_1_session, expected_no_session);
}

#[test]
fn should_allow_player_to_finish_ongoing_game_with_zero_token_stake() {
    // given a new game
    let (context, _) = setup_game_4_players(ZERO_TOKEN(), 0);
    let player_0 = PLAYER_0();
    let player_1 = PLAYER_1();

    // when player 1 finish session
    let mut spy = spy_events();
    cheat_caller_address(context.ludo_contract, player_1, CheatSpan::TargetCalls(1));
    let option_loser_id = Option::None;
    context.marquis_game_dispatcher.player_finish_session(context.session_id, option_loser_id);

    // then verify ForcedSessionFinished event was emitted
    let events = spy.get_events().emitted_by(context.ludo_contract);
    let (from, event) = events.events.at(0);
    let felt_session_id: felt252 = context.session_id.try_into().unwrap();
    assert_eq!(from, @context.ludo_contract);
    assert_eq!(event.keys.at(0), @selector!("ForcedSessionFinished"));
    assert_eq!(event.keys.at(1), @felt_session_id);

    // then session is finished
    let (session_data, _) = context.ludo_dispatcher.get_session_status(context.session_id);
    println!("{:?}", session_data);
    let status = session_data.status;
    let expected_status = 3; // finished
    assert_eq!(status, expected_status);

    // player 0 can create a new session
    let token = ZERO_TOKEN();
    let amount = 0;
    let required_players = 4;
    cheat_caller_address(context.ludo_contract, player_0, CheatSpan::TargetCalls(1));
    let new_session_id = context
        .marquis_game_dispatcher
        .create_session(Option::Some(token), Option::Some(amount), required_players);
    println!("let new_session_id: {:?}", new_session_id);

    // player 1 can join the new session
    cheat_caller_address(context.ludo_contract, player_1, CheatSpan::TargetCalls(1));
    context.marquis_game_dispatcher.join_session(new_session_id);
}

#[test]
fn should_allow_player_1_to_finish_ongoing_game_with_eth_token_stake() {
    // given a new game with ETH stakes
    let eth_contract_address = ETH_TOKEN_ADDRESS();
    let amount = 100000;
    let required_players = 4;
    let (context, players_balance_init) = setup_game_4_players(eth_contract_address, amount);

    let player_0 = PLAYER_0();
    let player_1 = PLAYER_1();
    let erc20_dispatcher = IERC20Dispatcher { contract_address: eth_contract_address };

    // when player 1 finishes session
    let mut spy = spy_events();
    cheat_caller_address(context.ludo_contract, player_1, CheatSpan::TargetCalls(1));
    let player_1_id = 1;
    let option_loser_id = Option::Some(player_1_id);
    context.marquis_game_dispatcher.player_finish_session(context.session_id, option_loser_id);

    // then verify ForcedSessionFinished event was emitted
    let events = spy.get_events().emitted_by(context.ludo_contract);
    let (from, event) = events.events.at(0);
    let felt_session_id: felt252 = context.session_id.try_into().unwrap();
    assert_eq!(from, @context.ludo_contract);
    assert_eq!(event.keys.at(0), @selector!("ForcedSessionFinished"));
    assert_eq!(event.keys.at(1), @felt_session_id);

    // then session is finished
    let (session_data, _) = context.ludo_dispatcher.get_session_status(context.session_id);
    let status = session_data.status;
    let expected_status = 3; // finished
    assert_eq!(status, expected_status);

    // then verify player 0 got 1/3 of the total stake and player 1 lost all his stake
    let player_0_balance_after = erc20_dispatcher.balance_of(player_0);
    let player_1_balance_after = erc20_dispatcher.balance_of(player_1);

    println!("-- Player 0 balance after finish: {:?}", player_0_balance_after);
    println!("-- Player 1 balance after finish: {:?}", player_1_balance_after);

    assert_eq!(player_0_balance_after, *players_balance_init[0] + amount / 3);
    assert_eq!(player_1_balance_after, *players_balance_init[1] - amount);

    // then verify players are unlocked
    let player_0_session = context.marquis_game_dispatcher.player_session(player_0);
    let player_1_session = context.marquis_game_dispatcher.player_session(player_1);
    let expected_no_session = 0;
    assert_eq!(player_0_session, expected_no_session);
    assert_eq!(player_1_session, expected_no_session);

    // player 0 can create a new session
    cheat_caller_address(eth_contract_address, player_0, CheatSpan::TargetCalls(1));
    erc20_dispatcher.approve(context.ludo_contract, amount);

    cheat_caller_address(context.ludo_contract, player_0, CheatSpan::TargetCalls(1));
    let new_session_id = context
        .marquis_game_dispatcher
        .create_session(Option::Some(eth_contract_address), Option::Some(amount), required_players);
    let expected_new_session_id = 2;
    assert_eq!(new_session_id, expected_new_session_id);
}

#[test]
fn should_allow_player_3_to_finish_ongoing_game_with_eth_token_stake() {
    // given a new game
    let eth_contract_address = ETH_TOKEN_ADDRESS();
    let amount = 30000;
    let (context, players_balance_init) = setup_game_4_players(eth_contract_address, amount);

    let player_3 = PLAYER_3();
    let erc20_dispatcher = IERC20Dispatcher { contract_address: eth_contract_address };

    // when player 1 finish session
    let mut spy = spy_events();
    let player_3_id = 3;
    cheat_caller_address(context.ludo_contract, player_3, CheatSpan::TargetCalls(1));
    let option_loser_id = Option::Some(player_3_id);
    context.marquis_game_dispatcher.player_finish_session(context.session_id, option_loser_id);

    // then verify ForcedSessionFinished event was emitted
    let events = spy.get_events().emitted_by(context.ludo_contract);
    let (from, event) = events.events.at(0);
    let felt_session_id: felt252 = context.session_id.try_into().unwrap();
    assert_eq!(from, @context.ludo_contract);
    assert_eq!(event.keys.at(0), @selector!("ForcedSessionFinished"));
    assert_eq!(event.keys.at(1), @felt_session_id);

    // then check status
    let (session_data, _) = context.ludo_dispatcher.get_session_status(context.session_id);
    println!("{:?}", session_data);
    let status = session_data.status;
    let expected_status = 3; // finished
    assert_eq!(status, expected_status);

    // then split player 1 stake into other player
    let player_0_balance_after = erc20_dispatcher.balance_of(PLAYER_0());
    let player_1_balance_after = erc20_dispatcher.balance_of(PLAYER_1());
    let player_2_balance_after = erc20_dispatcher.balance_of(PLAYER_2());
    let player_3_balance_after = erc20_dispatcher.balance_of(PLAYER_3());
    let player_0_expected_balance = *players_balance_init[0] + amount / 3;
    let player_1_expected_balance = *players_balance_init[1] + amount / 3;
    let player_2_expected_balance = *players_balance_init[2] + amount / 3;
    let player_3_expected_balance = *players_balance_init[3] - amount;
    assert_eq!(player_0_balance_after, player_0_expected_balance);
    assert_eq!(player_1_balance_after, player_1_expected_balance);
    assert_eq!(player_2_balance_after, player_2_expected_balance);
    assert_eq!(player_3_balance_after, player_3_expected_balance);
}

#[test]
fn should_allow_owner_to_force_finish_ongoing_game_with_zero_token_stake() {
    // given a new game
    let (context, _) = setup_game_4_players(ZERO_TOKEN(), 0);
    let owner = OWNER();

    // when owner finish session
    cheat_caller_address(context.ludo_contract, owner, CheatSpan::TargetCalls(1));
    context.marquis_game_dispatcher.owner_finish_session(context.session_id, Option::None);
    let (session_data, _) = context.ludo_dispatcher.get_session_status(context.session_id);

    // then session is finished
    println!("{:?}", session_data);
    let status = session_data.status;
    let expected_status = 3; // finished
    assert_eq!(status, expected_status);
}

#[test]
fn should_refund_eth_when_owner_finishes_game() {
    // given a new game
    let eth_contract_address = ETH_TOKEN_ADDRESS();
    let amount = 10000;
    let (context, players_balance_init) = setup_game_4_players(eth_contract_address, amount);

    // when owner finish session
    let owner = OWNER();
    cheat_caller_address(context.ludo_contract, owner, CheatSpan::TargetCalls(1));
    context.marquis_game_dispatcher.owner_finish_session(context.session_id, Option::None);

    // then check status
    let (session_data, _) = context.ludo_dispatcher.get_session_status(context.session_id);
    println!("{:?}", session_data);
    let status = session_data.status;
    let expected_status = 3; // finished
    assert_eq!(status, expected_status);

    // then refund all players
    let erc20_dispatcher = IERC20Dispatcher { contract_address: eth_contract_address };
    let player_0_balance_after = erc20_dispatcher.balance_of(PLAYER_0());
    let player_1_balance_after = erc20_dispatcher.balance_of(PLAYER_1());
    let player_2_balance_after = erc20_dispatcher.balance_of(PLAYER_2());
    let player_3_balance_after = erc20_dispatcher.balance_of(PLAYER_3());
    assert_eq!(player_0_balance_after, *players_balance_init[0]);
    assert_eq!(player_1_balance_after, *players_balance_init[1]);
    assert_eq!(player_2_balance_after, *players_balance_init[2]);
    assert_eq!(player_3_balance_after, *players_balance_init[3]);
}
#[test]
fn should_allow_move_when_rolling_six() {
    // given a new game
    let (context, _) = setup_game_4_players(ZERO_TOKEN(), 0);
    let player_0 = PLAYER_0();

    // when rolling six
    let ludo_move = LudoMove { token_id: 0 };
    // Two rolls here. Roll a six and a two.
    let mut ver_rand_num_array_ref = generate_verifiable_random_numbers(2, 1, 6, 2);
    let (user0, _, _, _) = player_move(
        context, @ludo_move, player_0, ver_rand_num_array_ref.pop_front().unwrap(),
    );

    // then position changed
    let expected_pin_0_pos = 3;
    assert_position_0_eq(@user0, expected_pin_0_pos);
}

#[test]
fn should_skip_turn_when_not_rolling_six() {
    let player_0 = PLAYER_0();
    let player_1 = PLAYER_1();

    // given a new game
    let (context, _) = setup_game_4_players(ZERO_TOKEN(), 0);

    // when player 0 rolling other than six
    let ludo_move = LudoMove { token_id: 0 };
    // Roll a two
    let mut ver_rand_num_array_ref = generate_verifiable_random_numbers(1, 1, 2, 2);

    // then position not change
    let (user0, _, _, _) = player_move(
        context, @ludo_move, player_0, ver_rand_num_array_ref.pop_front().unwrap(),
    );
    let expected_pin_0_pos = 0;
    assert_position_0_eq(@user0, expected_pin_0_pos);

    // when player 1 rolling six
    // A 6 and a 2 is rolled here.
    let mut ver_rand_num_array_ref = generate_verifiable_random_numbers(2, 1, 6, 2);

    // then position changed
    let (_, user1, _, _) = player_move(
        context, @ludo_move, player_1, ver_rand_num_array_ref.pop_front().unwrap(),
    );
    let expected_pin_0_pos = 14 + 2;
    assert_position_0_eq(@user1, expected_pin_0_pos);
}

#[test]
fn should_kill_opponent_token_on_same_position() {
    let player_0 = PLAYER_0();
    let player_1 = PLAYER_1();
    let player_2 = PLAYER_2();
    let player_3 = PLAYER_3();

    // given a new game
    let (context, _) = setup_game_4_players(ZERO_TOKEN(), 0);

    // when all players move same
    let mut ver_rand_num_array_ref = generate_verifiable_random_numbers(2, 4, 6, 2);

    let ludo_move = LudoMove { token_id: 0 };

    let (user0, _, _, _) = player_move(
        context, @ludo_move, player_0, ver_rand_num_array_ref.pop_front().unwrap(),
    );
    let expected_user0_pin_0_pos = 1 + 2;
    assert_position_0_eq(@user0, expected_user0_pin_0_pos);

    println!("-- Playing move for player 1");
    let (_, user1, _, _) = player_move(
        context, @ludo_move, player_1, ver_rand_num_array_ref.pop_front().unwrap(),
    );
    let expected_use1_pin_0_pos = 14 + 2;
    assert_position_0_eq(@user1, expected_use1_pin_0_pos);

    println!("-- Playing move for player 2");
    let (_, _, user2, _) = player_move(
        context, @ludo_move, player_2, ver_rand_num_array_ref.pop_front().unwrap(),
    );
    let expected_pin_0_pos = 27 + 2;
    assert_position_0_eq(@user2, expected_pin_0_pos);

    println!("-- Playing move for player 3");
    let (_, _, _, user3) = player_move(
        context, @ludo_move, player_3, ver_rand_num_array_ref.pop_front().unwrap(),
    );
    let expected_pin_0_pos = 40 + 2;
    assert_position_0_eq(@user3, expected_pin_0_pos);

    println!("-- Playing move for player 0 again");
    let mut ver_rand_num_array_ref = generate_verifiable_random_numbers(3, 1, 6, 1);
    let (user0, user1, _, _) = player_move(
        context, @ludo_move, player_0, ver_rand_num_array_ref.pop_front().unwrap(),
    );
    let new_expected_user0_pin_0_pos = expected_user0_pin_0_pos + 13;
    assert_position_0_eq(@user0, new_expected_user0_pin_0_pos);
    assert_position_0_eq(@user1, 0);
}

#[test]
fn should_win_when_player_reaches_home() {
    let player_0 = PLAYER_0();
    let player_1 = PLAYER_1();
    let player_2 = PLAYER_2();
    let player_3 = PLAYER_3();

    // given a new game
    let (context, _) = setup_game_4_players(ZERO_TOKEN(), 0);

    let mut ver_rand_num_array_ref = generate_verifiable_random_numbers(10, 4, 6, 2);

    let ludo_move = LudoMove { token_id: 0 };

    println!("-- Playing move for player 0");
    let (user0, _, _, _) = player_move(
        context, @ludo_move, player_0, ver_rand_num_array_ref.pop_front().unwrap(),
    );
    let expected_user0_pin_0_pos = 1 + 50;
    assert_position_0_eq(@user0, expected_user0_pin_0_pos);

    println!("-- Playing move for player 1");
    let (_, user1, _, _) = player_move(
        context, @ludo_move, player_1, ver_rand_num_array_ref.pop_front().unwrap(),
    );
    let expected_use1_pin_0_pos = (14 + 50) % 52;
    assert_position_0_eq(@user1, expected_use1_pin_0_pos);

    println!("-- Playing move for player 2");
    let (_, _, user2, _) = player_move(
        context, @ludo_move, player_2, ver_rand_num_array_ref.pop_front().unwrap(),
    );
    let expected_pin_0_pos = (27 + 50) % 52;
    assert_position_0_eq(@user2, expected_pin_0_pos);

    println!("-- Playing move for player 3");
    let (_, _, _, user3) = player_move(
        context, @ludo_move, player_3, ver_rand_num_array_ref.pop_front().unwrap(),
    );
    let expected_pin_0_pos = (40 + 50) % 52;
    assert_position_0_eq(@user3, expected_pin_0_pos);

    println!("-- Playing move for player 0 again");
    // this move makes player 0 win. Roll a six.
    let mut ver_rand_num_array = generate_verifiable_random_numbers(1, 1, 0, 6);
    let (user0, _, _, _) = player_move(
        context, @ludo_move, player_0, ver_rand_num_array.pop_front().unwrap(),
    );
    let new_expected_user0_pin_0_pos = expected_user0_pin_0_pos + 6;
    assert_position_0_eq(@user0, new_expected_user0_pin_0_pos);

    let (user0_pin_0_winning, _, _, _) = user0.player_winning_tokens;
    assert!(user0_pin_0_winning);
}

#[test]
// Player 0 kills player 1 circled pin0
fn should_kill_opponent_token_after_full_circle() {
    let player_0 = PLAYER_0();
    let player_1 = PLAYER_1();
    let player_2 = PLAYER_2();
    let player_3 = PLAYER_3();

    // given a new game
    let (context, _) = setup_game_4_players(ZERO_TOKEN(), 0);
    let mut ver_rand_num_array_ref1 = generate_verifiable_random_numbers(2, 3, 6, 2);

    let ludo_move = LudoMove { token_id: 0 };

    println!("-- Playing move for player 0");
    let (user0, _, _, _) = player_move(
        context, @ludo_move, player_0, ver_rand_num_array_ref1.pop_front().unwrap(),
    );
    let expected_user0_pin_0_pos = 1 + 2;
    assert_position_0_eq(@user0, expected_user0_pin_0_pos);

    println!("-- Playing move for player 1");
    let mut ver_rand_num_array_ref2 = generate_verifiable_random_numbers(8, 1, 6, 6);
    let (_, user1, _, _) = player_move(
        context, @ludo_move, player_1, ver_rand_num_array_ref2.pop_front().unwrap(),
    );
    let (user1_pin_0_circled, _, _, _) = user1.player_tokens_circled;
    let expected_use1_pin_0_pos = (14 + 42) % 52;
    assert_position_0_eq(@user1, expected_use1_pin_0_pos);
    assert!(user1_pin_0_circled);

    println!("-- Playing move for player 2");
    let (_, _, user2, _) = player_move(
        context, @ludo_move, player_2, ver_rand_num_array_ref1.pop_front().unwrap(),
    );
    let expected_pin_0_pos = 27 + 2;
    assert_position_0_eq(@user2, expected_pin_0_pos);

    println!("-- Playing move for player 3");
    let (_, _, _, user3) = player_move(
        context, @ludo_move, player_3, ver_rand_num_array_ref1.pop_front().unwrap(),
    );
    let expected_pin_0_pos = 40 + 2;
    assert_position_0_eq(@user3, expected_pin_0_pos);

    println!("-- Playing move for player 0 again");
    let mut ver_rand_num_array = generate_verifiable_random_numbers(1, 1, 0, 1);
    let (user0, user1, _, _) = player_move(
        context, @ludo_move, player_0, ver_rand_num_array.pop_front().unwrap(),
    );
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
fn should_allow_all_player_to_reach_home() {
    let player_0 = PLAYER_0();
    let player_1 = PLAYER_1();
    let player_2 = PLAYER_2();
    let player_3 = PLAYER_3();

    // given a new game
    let (context, _) = setup_game_4_players(ZERO_TOKEN(), 0);
    let mut ver_rand_num_array_ref = generate_verifiable_random_numbers(11, 4, 6, 2);
    let ludo_move = LudoMove { token_id: 0 };

    println!("-- Playing move for player 0");
    let (user0, _, _, _) = player_move(
        context, @ludo_move, player_0, ver_rand_num_array_ref.pop_front().unwrap(),
    );
    let expected_user0_pin_0_pos = 1 + 56;
    assert_position_0_eq(@user0, expected_user0_pin_0_pos);

    println!("-- Playing move for player 1");
    let (_, user1, _, _) = player_move(
        context, @ludo_move, player_1, ver_rand_num_array_ref.pop_front().unwrap(),
    );
    let expected_use1_pin_0_pos = (14 + 56) % 52;
    assert_position_0_eq(@user1, expected_use1_pin_0_pos);

    println!("-- Playing move for player 2");
    let (_, _, user2, _) = player_move(
        context, @ludo_move, player_2, ver_rand_num_array_ref.pop_front().unwrap(),
    );
    let expected_pin_0_pos = (27 + 56) % 52;
    assert_position_0_eq(@user2, expected_pin_0_pos);

    println!("-- Playing move for player 3");
    let (user0, user1, user2, user3) = player_move(
        context, @ludo_move, player_3, ver_rand_num_array_ref.pop_front().unwrap(),
    );
    let expected_pin_0_pos = (40 + 56) % 52;
    assert_position_0_eq(@user3, expected_pin_0_pos);

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
fn should_end_game_when_player_wins_with_all_tokens() {
    let player_0 = PLAYER_0();
    let player_1 = PLAYER_1();
    let player_2 = PLAYER_2();
    let player_3 = PLAYER_3();

    // given a new game
    let (context, _) = setup_game_4_players(ZERO_TOKEN(), 0);
    let event_from_ludo = feign_win_four(@player_0, @player_1, @player_2, @player_3, @context);

    let winner_amount = event_from_ludo.data.at(0);
    assert_eq!(*winner_amount, 0);
}

#[test]
#[should_panic(expected: 'SESSION NOT PLAYING')]
fn should_panic_when_player_plays_after_game_ends() {
    let player_0 = PLAYER_0();
    let player_1 = PLAYER_1();
    let player_2 = PLAYER_2();
    let player_3 = PLAYER_3();

    // given a new game
    let (context, _) = setup_game_4_players(ZERO_TOKEN(), 0);

    let _ = feign_win_four(@player_0, @player_1, @player_2, @player_3, @context);
    // Here, the game has ended.
    println!("-- Playing move for player 1 pin 3");
    let ludo_move_3 = LudoMove { token_id: 3 };
    // Roll any number. Let's say 2.
    let mut ver_rand_num_array_ref = generate_verifiable_random_numbers(1, 1, 0, 2);
    let (_, _, _, _) = player_move(
        context, @ludo_move_3, player_1, ver_rand_num_array_ref.pop_front().unwrap(),
    );
}

#[test]
fn should_distribute_eth_prize_to_winner() {
    // given a new game
    let eth_contract_address = ETH_TOKEN_ADDRESS();
    let play_amount = 100000;
    let (context, _) = setup_game_4_players(eth_contract_address, play_amount);

    let player_0 = PLAYER_0();
    let player_1 = PLAYER_1();
    let player_2 = PLAYER_2();
    let player_3 = PLAYER_3();

    let erc20_dispatcher = IERC20Dispatcher { contract_address: eth_contract_address };

    let event_from_ludo = feign_win_four(@player_0, @player_1, @player_2, @player_3, @context);

    let total_fee: felt252 = 400; // Improve this hadcoded value
    let num_players: felt252 = 4;
    let expected_winner_amount: felt252 = play_amount.try_into().unwrap() * num_players - total_fee;
    let winner_amount = event_from_ludo.data.at(0);
    println!("-- Winning amount: {:?}", *winner_amount);
    assert_eq!(*winner_amount, expected_winner_amount);
    let player_0_balance = erc20_dispatcher.balance_of(player_0);
    println!("-- Player 0 balance after winning: {:?}", player_0_balance);
}

#[test]
#[should_panic]
fn should_panic_when_player_tries_to_join_session_twice() {
    // given a new game
    let (context, _) = setup_game_new(ZERO_TOKEN(), 0, 4);
    let player_0 = PLAYER_0();

    // when player 0 tries to join the session twice
    cheat_caller_address(context.ludo_contract, player_0, CheatSpan::TargetCalls(1));
    context.marquis_game_dispatcher.join_session(context.session_id);
    cheat_caller_address(context.ludo_contract, player_0, CheatSpan::TargetCalls(1));
    context.marquis_game_dispatcher.join_session(context.session_id);
}

#[test]
#[should_panic(expected: 'NOT PLAYER TURN')]
fn should_panic_when_player_tries_to_play_out_of_turn() {
    // roll a pla
    let (context, _) = setup_game_4_players(ZERO_TOKEN(), 0);
    let player_0 = PLAYER_0();
    let player_1 = PLAYER_1();
    let ludo_move = LudoMove { token_id: 0 };
    let mut ver_rand_num_array_ref = generate_verifiable_random_numbers(2, 2, 6, 2);

    println!("-- Playing move for player 0");
    let (_, _, _, _) = player_move(
        context, @ludo_move, player_0, ver_rand_num_array_ref.pop_front().unwrap(),
    );

    println!("-- Playing move for player 1");
    let (_, _, _, _) = player_move(
        context, @ludo_move, player_1, ver_rand_num_array_ref.pop_front().unwrap(),
    );

    // Player 1 tries to roll again
    let mut ver_rand_num_array_ref = generate_verifiable_random_numbers(1, 1, 0, 1);
    let (_, _, _, _) = player_move(
        context, @ludo_move, player_1, ver_rand_num_array_ref.pop_front().unwrap(),
    );
}

// Should panic when player tries to join another session while in session
#[test]
#[should_panic(expected: 'PLAYER HAS SESSION')]
fn should_panic_when_player_tries_to_join_another_session_while_locked_in_session() {
    // given a new game
    let (context, _) = setup_game_new(ZERO_TOKEN(), 0, 4);
    let player_1 = PLAYER_1();
    let some_player: ContractAddress = 'SOME_PLAYER'.try_into().unwrap();
    println!("First session id: {:?}", context.session_id);

    // when player 1 joins the session
    cheat_caller_address(context.ludo_contract, player_1, CheatSpan::TargetCalls(1));
    context.marquis_game_dispatcher.join_session(context.session_id);
    let (session_data, _) = context.ludo_dispatcher.get_session_status(context.session_id);
    let player_count = session_data.player_count;
    let status = session_data.status;
    let expected_player_count = 2;
    let expected_status = 1; // waiting for players
    assert_eq!(player_count, expected_player_count);
    assert_eq!(status, expected_status);

    // when player 0 tries to join another session that some player created.
    cheat_caller_address(context.ludo_contract, some_player, CheatSpan::TargetCalls(1));
    context.marquis_game_dispatcher.create_session(Option::Some(ZERO_TOKEN()), Option::Some(0), 4);
    println!("Second session id: {:?}", context.session_id);
    cheat_caller_address(context.ludo_contract, player_1, CheatSpan::TargetCalls(1));
    context.marquis_game_dispatcher.join_session(context.session_id);
}

#[test]
#[should_panic(expected: 'SESSION NOT PLAYING')]
fn should_panic_when_player_plays_when_session_is_not_playing_yet() {
    // given a new game
    let (context, _) = setup_game_new(ZERO_TOKEN(), 0, 4);
    let player_0 = PLAYER_0();

    // when player 0 tries to play before session starts
    let ludo_move = LudoMove { token_id: 0 };
    let mut ver_rand_num_array_ref = generate_verifiable_random_numbers(1, 1, 6, 1);
    let _ = player_move(context, @ludo_move, player_0, ver_rand_num_array_ref.pop_front().unwrap());
}

#[test]
#[should_panic(expected: 'SESSION NOT WAITING')]
fn should_panic_when_a_player_joins_a_full_session() {
    // given a new game
    let (context, _) = setup_game_4_players(ZERO_TOKEN(), 0);

    // when player 4 tries to join the session
    let player_4: ContractAddress = 'PLAYER_4'.try_into().unwrap();
    cheat_caller_address(context.ludo_contract, player_4, CheatSpan::TargetCalls(1));
    context.marquis_game_dispatcher.join_session(context.session_id);
}


#[test]
#[should_panic(expected: 'UNSUPPORTED TOKEN')]
fn should_panic_when_game_is_initialized_with_unsupported_token() {
    let ludo_contract = deploy_ludo_contract();
    let marquis_game_dispatcher = IMarquisGameDispatcher { contract_address: ludo_contract };
    let token_address = USDC_TOKEN_ADDRESS();
    let player_0 = PLAYER_0();
    let amount: u256 = 100;
    let required_players = 4;

    cheat_caller_address(ludo_contract, player_0, CheatSpan::TargetCalls(1));
    let _ = marquis_game_dispatcher.create_session(Option::Some(token_address), Option::Some(amount), required_players);
}

