use contracts::interfaces::ILudo::{ILudoDispatcherTrait};
use contracts::interfaces::IMarquisGame::{IMarquisGameDispatcher, IMarquisGameDispatcherTrait};
use openzeppelin_token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
use snforge_std::{CheatSpan, cheat_caller_address};
use super::SetUp::{ETH_TOKEN_ADDRESS, PLAYER_0, PLAYER_1, PLAYER_2, PLAYER_3, ZERO_TOKEN};
use super::SetUp::{deploy_ludo_contract, setup_game_new};

#[test]
fn should_create_free_game_session() {
    let ludo_contract = deploy_ludo_contract();
    let marquis_game_dispatcher = IMarquisGameDispatcher { contract_address: ludo_contract };
    let token = ZERO_TOKEN();
    let amount = 0;
    let required_players = 1;
    let session_id = marquis_game_dispatcher
        .create_session(Option::Some(token), Option::Some(amount), required_players);
    let expected_session_id = 1;
    assert_eq!(session_id, expected_session_id);
}

#[test]
fn should_allow_one_player_to_join_without_stake() {
    // given a new game
    let eth_contract_address = ETH_TOKEN_ADDRESS();
    let amount = 0;
    let required_players = 2;
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
    let expected_status = 2; // can play
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
fn should_allow_multiple_players_to_join_without_stake() {
    // given a new game
    let eth_contract_address = ETH_TOKEN_ADDRESS();
    let amount = 0;
    let required_players = 4;
    let (context, player_0_init_balance) = setup_game_new(
        eth_contract_address, amount, required_players,
    );

    let player_0 = PLAYER_0();
    let player_1 = PLAYER_1();
    let player_2 = PLAYER_2();
    let player_3 = PLAYER_3();

    let erc20_dispatcher = IERC20Dispatcher { contract_address: eth_contract_address };

    let player_1_init_balance = erc20_dispatcher.balance_of(player_1);
    let player_2_init_balance = erc20_dispatcher.balance_of(player_2);
    let player_3_init_balance = erc20_dispatcher.balance_of(player_3);

    // when players join session
    cheat_caller_address(eth_contract_address, player_1, CheatSpan::TargetCalls(1));
    erc20_dispatcher.approve(context.ludo_contract, amount);
    cheat_caller_address(context.ludo_contract, player_1, CheatSpan::TargetCalls(1));
    context.marquis_game_dispatcher.join_session(context.session_id);

    cheat_caller_address(eth_contract_address, player_2, CheatSpan::TargetCalls(1));
    erc20_dispatcher.approve(context.ludo_contract, amount);
    cheat_caller_address(context.ludo_contract, player_2, CheatSpan::TargetCalls(1));
    context.marquis_game_dispatcher.join_session(context.session_id);

    cheat_caller_address(eth_contract_address, player_3, CheatSpan::TargetCalls(1));
    erc20_dispatcher.approve(context.ludo_contract, amount);
    cheat_caller_address(context.ludo_contract, player_3, CheatSpan::TargetCalls(1));
    context.marquis_game_dispatcher.join_session(context.session_id);

    // then check session status
    let (session_data, _) = context.ludo_dispatcher.get_session_status(context.session_id);
    let player_count = session_data.player_count;
    let status = session_data.status;
    let expected_player_count = 4;
    let expected_status = 2; // can play
    assert_eq!(player_count, expected_player_count);
    assert_eq!(status, expected_status);

    // then check players stake
    let player_0_balance_after_join = erc20_dispatcher.balance_of(player_0);
    println!("-- Player 0 balance after joining: {:?}", player_0_balance_after_join);
    assert_eq!(player_0_balance_after_join, player_0_init_balance - amount);
    let player_1_balance_after_join = erc20_dispatcher.balance_of(player_1);
    println!("-- Player 1 balance after joining: {:?}", player_1_balance_after_join);
    assert_eq!(player_1_balance_after_join, player_1_init_balance - amount);
    let player_2_balance_after_join = erc20_dispatcher.balance_of(player_2);
    println!("-- Player 2 balance after joining: {:?}", player_2_balance_after_join);
    assert_eq!(player_2_balance_after_join, player_2_init_balance - amount);
    let player_3_balance_after_join = erc20_dispatcher.balance_of(player_3);
    println!("-- Player 3 balance after joining: {:?}", player_3_balance_after_join);
    assert_eq!(player_3_balance_after_join, player_3_init_balance - amount);
}
