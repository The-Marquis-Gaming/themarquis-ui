use contracts::IMarquisCore::{IMarquisCoreDispatcher, IMarquisCoreDispatcherTrait, SupportedToken};
use contracts::interfaces::ILudo::{ILudoDispatcher, ILudoDispatcherTrait, LudoMove, SessionUserStatus};
use contracts::interfaces::IMarquisGame::{
    IMarquisGameDispatcher, IMarquisGameDispatcherTrait, VerifiableRandomNumber,
};
use core::num::traits::Zero;
use openzeppelin_token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
use openzeppelin_utils::serde::SerializedAppend;
use snforge_std::{
    CheatSpan, ContractClassTrait, DeclareResultTrait, EventSpyTrait, EventsFilterTrait,
    cheat_caller_address, declare, spy_events,
};
use starknet::{ContractAddress, EthAddress, contract_address_const};

// Real contract addresses deployed on Sepolia
fn OWNER() -> ContractAddress {
    contract_address_const::<0x02dA5254690b46B9C4059C25366D1778839BE63C142d899F0306fd5c312A5918>()
}

fn PLAYER_0() -> ContractAddress {
    contract_address_const::<0x01528adf08bf1f8895aea018155fd8ad1cfc2b4935c680b948bc87f425eafd39>()
}
fn PLAYER_1() -> ContractAddress {
    contract_address_const::<0x06bd7295fbf481d7c2109d0aca4a0485bb902583d5d6cc7f0307678685209249>()
}
fn PLAYER_2() -> ContractAddress {
    contract_address_const::<0x05f06de98f137297927a239fa9c5b0c8299c7a9700789d5e9e178958f881aae0>()
}
fn PLAYER_3() -> ContractAddress {
    contract_address_const::<0x027d2ad5a55f9be697dd91e479c7b5b279fd2133ac5e6bc11680166a3b86c111>()
}
fn ZERO_TOKEN() -> ContractAddress {
    Zero::zero()
}

// Real contract address deployed on Sepolia
fn ETH_TOKEN_ADDRESS() -> ContractAddress {
    contract_address_const::<0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7>()
}
fn USDC_TOKEN_ADDRESS() -> ContractAddress {
    contract_address_const::<0x053b40a647cedfca6ca84f542a0fe36736031905a9639a7f19a3c1e66bfd5080>()
}

fn STRK_TOKEN_ADDRESS() -> ContractAddress {
    contract_address_const::<0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d>()
}

fn deploy_marquis_contract() -> ContractAddress {
    let contract_class = declare("MarquisCore").unwrap().contract_class();
    let mut calldata = array![];
    calldata.append_serde(OWNER());
    let (contract_address, _) = contract_class.deploy(@calldata).unwrap();
    contract_address
}
fn deploy_ludo_contract() -> ContractAddress {
    let marquis_contract_address = deploy_marquis_contract();

    let contract_class = declare("Ludo").unwrap().contract_class();
    // Todo: Refactor to not use eth
    let oracle_address: felt252 = '0x0';
    let marquis_oracle_address: EthAddress = oracle_address.try_into().unwrap();
    let mut calldata = array![];
    calldata.append_serde(marquis_oracle_address);
    calldata.append_serde(marquis_contract_address);
    let (contract_address, _) = contract_class.deploy(@calldata).unwrap();
    //println!("-- Ludo contract deployed on: {:?}", contract_address);
    contract_address
}

fn deploy_erc20_contract(symbol: ByteArray, address: ContractAddress) -> ContractAddress {
    let contract_class = declare("ERC20").unwrap().contract_class();
    let mut calldata = array![];
    calldata.append_serde(0);
    calldata.append_serde(symbol);
    calldata.append_serde(1000000000000000000000000000);
    calldata.append_serde(OWNER());
    let (contract_address, _) = contract_class.deploy_at(@calldata, address).unwrap();

    let erc20_dispatcher = IERC20Dispatcher { contract_address: contract_address };

    cheat_caller_address(contract_address, OWNER(), CheatSpan::TargetCalls(4));
    erc20_dispatcher.transfer(PLAYER_0(), 1000000);
    erc20_dispatcher.transfer(PLAYER_1(), 1000000);
    erc20_dispatcher.transfer(PLAYER_2(), 1000000);
    erc20_dispatcher.transfer(PLAYER_3(), 1000000);

    contract_address
}

// SETUP GAME FUNCTIONS

#[derive(Drop, Copy)]
struct GameContext {
    ludo_contract: ContractAddress,
    ludo_dispatcher: ILudoDispatcher,
    marquis_game_dispatcher: IMarquisGameDispatcher,
    session_id: u256,
}

fn setup_game_new(
    token: ContractAddress, amount: u256,
) -> (GameContext, u256) {
    let ludo_contract = deploy_ludo_contract();
    let ludo_dispatcher = ILudoDispatcher { contract_address: ludo_contract };
    let marquis_game_dispatcher = IMarquisGameDispatcher { contract_address: ludo_contract };

    let player_0 = PLAYER_0();
    let mut player_0_init_balance = 0;

    if token == ETH_TOKEN_ADDRESS() {
        deploy_erc20_contract("ETH", token);
        let erc20_dispatcher = IERC20Dispatcher { contract_address: token };
        player_0_init_balance = erc20_dispatcher.balance_of(player_0);
        cheat_caller_address(token, player_0, CheatSpan::TargetCalls(1));
        erc20_dispatcher.approve(ludo_contract, amount);

        println!("-- Player 0 balance before joining: {:?}", player_0_init_balance);
    }

    cheat_caller_address(ludo_contract, player_0, CheatSpan::TargetCalls(1));
    let session_id = marquis_game_dispatcher.create_session(token, amount);

    let context = GameContext {ludo_contract, ludo_dispatcher, marquis_game_dispatcher, session_id}; 

    (context, player_0_init_balance)
}

fn setup_game_4_players(
    token: ContractAddress, amount: u256,
) -> (GameContext, Array<u256>) {
    let (
        context, player_0_init_balance,
    ) =
        setup_game_new(
        token, amount,
    );

    let player_1 = PLAYER_1();
    let player_2 = PLAYER_2();
    let player_3 = PLAYER_3();
    let mut player_1_init_balance = 0;
    let mut player_2_init_balance = 0;
    let mut player_3_init_balance = 0;

    if token == ETH_TOKEN_ADDRESS() {
        let erc20_dispatcher = IERC20Dispatcher { contract_address: token };
        player_1_init_balance = erc20_dispatcher.balance_of(player_1);
        player_2_init_balance = erc20_dispatcher.balance_of(player_2);
        player_3_init_balance = erc20_dispatcher.balance_of(player_3);
        cheat_caller_address(token, player_1, CheatSpan::TargetCalls(1));
        erc20_dispatcher.approve(context.ludo_contract, amount);
        cheat_caller_address(token, player_2, CheatSpan::TargetCalls(1));
        erc20_dispatcher.approve(context.ludo_contract, amount);
        cheat_caller_address(token, player_3, CheatSpan::TargetCalls(1));
        erc20_dispatcher.approve(context.ludo_contract, amount);

        println!("-- Player 1 balance before joining: {:?}", player_1_init_balance);
        println!("-- Player 2 balance before joining: {:?}", player_2_init_balance);
        println!("-- Player 3 balance before joining: {:?}", player_3_init_balance);
    }

    cheat_caller_address(context.ludo_contract, player_1, CheatSpan::TargetCalls(1));
    context.marquis_game_dispatcher.join_session(context.session_id);
    cheat_caller_address(context.ludo_contract, player_2, CheatSpan::TargetCalls(1));
    context.marquis_game_dispatcher.join_session(context.session_id);
    cheat_caller_address(context.ludo_contract, player_3, CheatSpan::TargetCalls(1));
    context.marquis_game_dispatcher.join_session(context.session_id);

    let players_balance_init = array![
        player_0_init_balance, player_1_init_balance, player_2_init_balance, player_3_init_balance,
    ];
    (context, players_balance_init)
}

fn player_move(context: GameContext, ludo_move: @LudoMove, player: ContractAddress, ver_rand_num_array: Array<VerifiableRandomNumber>) -> (SessionUserStatus, SessionUserStatus, SessionUserStatus, SessionUserStatus) {

    cheat_caller_address(context.ludo_contract, player, CheatSpan::TargetCalls(1));
    println!("-- Playing move for player {:?}", player);
    context.ludo_dispatcher.play(context.session_id, ludo_move.clone(), ver_rand_num_array);
    let (session_data, ludo_session_status) = context.ludo_dispatcher.get_session_status(context.session_id);

    //println!("{:?}", session_data);
    //println!("{:?}", ludo_session_status);
    ludo_session_status.users
}

fn assert_position_0_eq(user:@SessionUserStatus, expected_pos: u256) {
    let (pos_0, _, _, _) = *user.player_tokens_position;
    println!("-- User {:?} pin 0 pos: {:?}", user.player_id, pos_0);
    assert_eq!(pos_0, expected_pos);
}

fn assert_position_1_eq(user:@SessionUserStatus, expected_pos: u256) {
    let (_, pos_1, _, _) = *user.player_tokens_position;
    println!("-- User {:?} pin 1 pos: {:?}", user.player_id, pos_1);
    assert_eq!(pos_1, expected_pos);
}

fn assert_position_2_eq(user:@SessionUserStatus, expected_pos: u256) {
    let (_, _, pos_2, _) = *user.player_tokens_position;
    println!("-- User {:?} pin 2 pos: {:?}", user.player_id, pos_2);
    assert_eq!(pos_2, expected_pos);
}

fn assert_position_3_eq(user:@SessionUserStatus, expected_pos: u256) {
    let (_, _, _, pos_3) = *user.player_tokens_position;
    println!("-- User {:?} pin 3 pos: {:?}", user.player_id, pos_3);
    assert_eq!(pos_3, expected_pos);
}

// MARQUIS CONTRACT TESTS

#[test]
fn should_deploy_marquis_contract() {
    deploy_marquis_contract();
}
#[test]
fn should_add_supported_token_successfully() {
    let marquis_contract = deploy_marquis_contract();
    let marquis_dispatcher = IMarquisCoreDispatcher { contract_address: marquis_contract };
    let token_address = USDC_TOKEN_ADDRESS();
    let fee = 1;
    let supported_token = SupportedToken { token_address, fee };
    cheat_caller_address(marquis_contract, OWNER(), CheatSpan::TargetCalls(1));
    marquis_dispatcher.add_supported_token(supported_token);
}

#[test]
fn should_update_token_fee_when_owner() {
    let marquis_contract = deploy_marquis_contract();
    let marquis_dispatcher = IMarquisCoreDispatcher { contract_address: marquis_contract };
    let new_fee = 10;
    let token_index = 0;
    cheat_caller_address(marquis_contract, OWNER(), CheatSpan::TargetCalls(1));
    marquis_dispatcher.update_token_fee(token_index, new_fee);
    let mut vec_supported_token = marquis_dispatcher.get_all_supported_tokens();
    let supported_token = vec_supported_token.pop_front().unwrap();
    assert_eq!(*supported_token.fee, new_fee);
}

#[test]
fn should_withdraw_specified_amount_from_contract() {
    let marquis_contract = deploy_marquis_contract();
    let strk_token_address = deploy_erc20_contract("STRK", STRK_TOKEN_ADDRESS());
    let owner = OWNER();
    let marquis_dispatcher = IMarquisCoreDispatcher { contract_address: marquis_contract };
    let erc20_dispatcher = IERC20Dispatcher { contract_address: strk_token_address };
    let marquis_init_balance = erc20_dispatcher.balance_of(marquis_contract);
    cheat_caller_address(strk_token_address, owner, CheatSpan::TargetCalls(1));
    erc20_dispatcher.approve(marquis_contract, 1000);
    cheat_caller_address(strk_token_address, owner, CheatSpan::TargetCalls(1));
    erc20_dispatcher.transfer(marquis_contract, 1000);
    let marquis_balance_before_withdraw = erc20_dispatcher.balance_of(marquis_contract);
    assert_eq!(marquis_balance_before_withdraw, marquis_init_balance + 1000);

    let beneficiary = PLAYER_1();
    let amount = 100;
    let beneficiary_init_balance = erc20_dispatcher.balance_of(beneficiary);
    cheat_caller_address(marquis_contract, OWNER(), CheatSpan::TargetCalls(1));
    marquis_dispatcher.withdraw(strk_token_address, beneficiary, Option::Some(amount));
    let beneficiary_balance = erc20_dispatcher.balance_of(beneficiary);
    assert_eq!(beneficiary_balance, beneficiary_init_balance + amount);
    let marquis_balance_after_withdraw = erc20_dispatcher.balance_of(marquis_contract);
    assert_eq!(marquis_balance_after_withdraw, marquis_balance_before_withdraw - amount);
}

#[test]
fn should_withdraw_all_funds_from_contract() {
    let marquis_contract = deploy_marquis_contract();
    let strk_token_address = deploy_erc20_contract("STRK", STRK_TOKEN_ADDRESS());
    let owner = OWNER();
    let marquis_dispatcher = IMarquisCoreDispatcher { contract_address: marquis_contract };
    let erc20_dispatcher = IERC20Dispatcher { contract_address: strk_token_address };
    let marquis_init_balance = erc20_dispatcher.balance_of(marquis_contract);
    cheat_caller_address(strk_token_address, owner, CheatSpan::TargetCalls(1));
    erc20_dispatcher.approve(marquis_contract, 1000);
    cheat_caller_address(strk_token_address, owner, CheatSpan::TargetCalls(1));
    erc20_dispatcher.transfer(marquis_contract, 1000);
    let marquis_balance_before_withdraw = erc20_dispatcher.balance_of(marquis_contract);
    assert_eq!(marquis_balance_before_withdraw, marquis_init_balance + 1000);

    let beneficiary = PLAYER_1();
    let beneficiary_init_balance = erc20_dispatcher.balance_of(beneficiary);
    cheat_caller_address(marquis_contract, OWNER(), CheatSpan::TargetCalls(1));
    marquis_dispatcher.withdraw(strk_token_address, beneficiary, Option::None);
    let beneficiary_balance = erc20_dispatcher.balance_of(beneficiary);
    assert_eq!(beneficiary_balance, beneficiary_init_balance + marquis_balance_before_withdraw);
    let marquis_balance_after_withdraw = erc20_dispatcher.balance_of(marquis_contract);
    assert_eq!(marquis_balance_after_withdraw, 0);
}

#[test]
fn should_return_all_supported_tokens() {
    let marquis_contract = deploy_marquis_contract();
    let marquis_dispatcher = IMarquisCoreDispatcher { contract_address: marquis_contract };
    let token_address = STRK_TOKEN_ADDRESS();
    let fee = 10000;
    let mut vec_tokens = marquis_dispatcher.get_all_supported_tokens();
    let token = vec_tokens.pop_front().unwrap();
    println!("{:?}", token);
    assert_eq!(*token.token_address, token_address);
    assert_eq!(*token.fee, fee);
}

// LUDO CONTRACT TESTS

#[test]
fn should_deploy_ludo_contract() {
    deploy_ludo_contract();
}
#[test]
fn should_return_correct_game_name() {
    let ludo_contract = deploy_ludo_contract();
    let marquis_game_dispatcher = IMarquisGameDispatcher { contract_address: ludo_contract };
    let expected_name = "Ludo";
    let name = marquis_game_dispatcher.name();
    assert_eq!(name, expected_name);
}

#[test]
fn should_create_new_game_session() {
    let ludo_contract = deploy_ludo_contract();
    let marquis_game_dispatcher = IMarquisGameDispatcher { contract_address: ludo_contract };
    let token = ZERO_TOKEN();
    let amount = 0;
    let session_id = marquis_game_dispatcher.create_session(token, amount);
    let expected_session_id = 1;
    assert_eq!(session_id, expected_session_id);
}

#[test]
fn should_create_new_game_session_with_eth_token_deposit() {

    // given
    let eth_contract_address = ETH_TOKEN_ADDRESS();
    let amount = 100;
    let (
        context, player_0_init_balance,
    ) =
        setup_game_new(
        eth_contract_address, amount,
    );

    let expected_session_id = 1;
    let erc20_dispatcher = IERC20Dispatcher { contract_address: eth_contract_address };

    let player_0 = PLAYER_0();
    let player_balance_after = erc20_dispatcher.balance_of(player_0);
    assert_eq!(player_0_init_balance - player_balance_after, amount);
    assert_eq!(context.session_id, expected_session_id);
}

#[test]
fn should_allow_player_to_join_session() {
    // given
    let (context, _) = setup_game_new(
        ZERO_TOKEN(), 0,
    );

    // when
    let player_1 = PLAYER_1();
    cheat_caller_address(context.ludo_contract, player_1, CheatSpan::TargetCalls(1));
    context.marquis_game_dispatcher.join_session(context.session_id);

    // then
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
    // given
    let eth_contract_address = ETH_TOKEN_ADDRESS();
    let amount = 100;
    let (
        context, player_0_init_balance,
    ) =
        setup_game_new(
        eth_contract_address, amount,
    );

    // when
    let player_0 = PLAYER_1();
    let player_1 = PLAYER_1();
    let erc20_dispatcher = IERC20Dispatcher { contract_address: eth_contract_address };
    let player_1_init_balance = erc20_dispatcher.balance_of(player_1);
    cheat_caller_address(eth_contract_address, player_1, CheatSpan::TargetCalls(1));
    erc20_dispatcher.approve(context.ludo_contract, amount);
    cheat_caller_address(context.ludo_contract, player_1, CheatSpan::TargetCalls(1));
    context.marquis_game_dispatcher.join_session(context.session_id);

    // then
    let (session_data, _) = context.ludo_dispatcher.get_session_status(context.session_id);
    let player_count = session_data.player_count;
    let status = session_data.status;
    let expected_player_count = 2;
    let expected_status = 1; // waiting for players
    assert_eq!(player_count, expected_player_count);
    assert_eq!(status, expected_status);

    let player_0_balance_after_join = erc20_dispatcher.balance_of(player_0);
    println!("-- Player 0 balance after joining: {:?}", player_0_balance_after_join);
    assert_eq!(player_0_balance_after_join, player_0_init_balance - amount);
    let player_1_balance_after_join = erc20_dispatcher.balance_of(player_1);
    println!("-- Player 1 balance after joining: {:?}", player_1_balance_after_join);
    assert_eq!(player_1_balance_after_join, player_1_init_balance - amount);
}

#[test]
fn should_require_four_players_to_start_game() {
    // given
    let (context, _) = setup_game_new(
        ZERO_TOKEN(), 0,
    );

    // when
    let player_1 = PLAYER_1();
    cheat_caller_address(context.ludo_contract, player_1, CheatSpan::TargetCalls(1));
    context.marquis_game_dispatcher.join_session(context.session_id);

    let player_2 = PLAYER_2();
    cheat_caller_address(context.ludo_contract, player_2, CheatSpan::TargetCalls(1));
    context.marquis_game_dispatcher.join_session(context.session_id);

    // then
    let (session_data, _) = context.ludo_dispatcher.get_session_status(context.session_id);
    let player_count = session_data.player_count;
    let status = session_data.status;
    let expected_player_count = 3;
    let expected_status = 1; // waiting for players
    assert_eq!(player_count, expected_player_count);
    assert_eq!(status, expected_status);

    // when
    let player_3 = PLAYER_3();
    cheat_caller_address(context.ludo_contract, player_3, CheatSpan::TargetCalls(1));
    context.marquis_game_dispatcher.join_session(context.session_id);

    // then
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
fn should_allow_player_to_finish_before_game_starts() {
    let (context, _) = setup_game_new(
        ZERO_TOKEN(), 0,
    );
    let player_0 = PLAYER_0();
    let (session_data, _) = context.ludo_dispatcher.get_session_status(context.session_id);
    let status = session_data.status;
    let expected_status = 1; // waiting for players
    assert_eq!(status, expected_status);
    let nonce = session_data.nonce;
    println!("-- Session data, nonce: {:?}", nonce);

    cheat_caller_address(context.ludo_contract, player_0, CheatSpan::TargetCalls(1));
    let player_0_id = 0;
    context.marquis_game_dispatcher.player_finish_session(context.session_id, player_0_id);
    let (session_data, ludo_session_status) = context.ludo_dispatcher.get_session_status(context.session_id);
    println!("{:?}", session_data);
    println!("{:?}", ludo_session_status);
    let status = session_data.status;
    let expected_status = 3; // finished
    assert_eq!(status, expected_status);
    // check player session
    let player_0_session = context.marquis_game_dispatcher.player_session(player_0);
    let expected_player_1_session = 0; // no session
    assert_eq!(player_0_session, expected_player_1_session);

    // player 0 can create a new session
    let token = ZERO_TOKEN();
    let amount = 0;
    cheat_caller_address(context.ludo_contract, player_0, CheatSpan::TargetCalls(1));
    let new_session_id = context.marquis_game_dispatcher.create_session(token, amount);
    println!("new_session_id: {:?}", new_session_id);
}

#[test]
fn should_allow_players_to_finish_incomplete_game() {
    let (context, _) = setup_game_new(
        ZERO_TOKEN(), 0,
    );
    let player_0 = PLAYER_0();
    let player_1 = PLAYER_1();
    cheat_caller_address(context.ludo_contract, player_1, CheatSpan::TargetCalls(1));
    context.marquis_game_dispatcher.join_session(context.session_id);
    let (session_data, _) = context.ludo_dispatcher.get_session_status(context.session_id);
    let status = session_data.status;
    let expected_status = 1; // waiting for players
    assert_eq!(status, expected_status);
    let nonce = session_data.nonce;
    println!("-- Session data, nonce: {:?}", nonce);

    cheat_caller_address(context.ludo_contract, player_1, CheatSpan::TargetCalls(1));
    let player_1_id = 1;
    context.marquis_game_dispatcher.player_finish_session(context.session_id, player_1_id);
    let (session_data, ludo_session_status) = context.ludo_dispatcher.get_session_status(context.session_id);
    println!("{:?}", session_data);
    println!("{:?}", ludo_session_status);
    let status = session_data.status;
    let expected_status = 3; // finished
    assert_eq!(status, expected_status);
    // check player session
    let player_0_session = context.marquis_game_dispatcher.player_session(player_0);
    let expected_player_1_session = 0; // no session
    assert_eq!(player_0_session, expected_player_1_session);
    let player_1_session = context.marquis_game_dispatcher.player_session(player_1);
    println!("player_1_session: {:?}", player_1_session);
    assert_eq!(player_1_session, expected_player_1_session);

    // player 1 can create a new session
    let token = ZERO_TOKEN();
    let amount = 0;
    cheat_caller_address(context.ludo_contract, player_1, CheatSpan::TargetCalls(1));
    let new_session_id = context.marquis_game_dispatcher.create_session(token, amount);
    println!("let new_session_id: {:?}", new_session_id);
}

#[test]
fn should_allow_owner_to_force_finish_game() {
    let (context, _) =
        setup_game_4_players(
        ZERO_TOKEN(), 0,
    );

    let owner = OWNER();
    cheat_caller_address(context.ludo_contract, owner, CheatSpan::TargetCalls(1));
    context.marquis_game_dispatcher.owner_finish_session(context.session_id, Option::None);
    let (session_data, _) = context.ludo_dispatcher.get_session_status(context.session_id);
    println!("{:?}", session_data);
    let status = session_data.status;
    let expected_status = 3; // finished
    assert_eq!(status, expected_status);
}
#[test]
fn should_allow_player_to_finish_ongoing_game() {
    let player_0 = PLAYER_0();
    let player_1 = PLAYER_1();

    let (context, _) =
        setup_game_4_players(
        ZERO_TOKEN(), 0,
    );

    cheat_caller_address(context.ludo_contract, player_1, CheatSpan::TargetCalls(1));
    let player_1_id = 1;
    context.marquis_game_dispatcher.player_finish_session(context.session_id, player_1_id);
    let (session_data, _) = context.ludo_dispatcher.get_session_status(context.session_id);
    println!("{:?}", session_data);
    let status = session_data.status;
    let expected_status = 3; // finished
    assert_eq!(status, expected_status);

    // player 0 can create a new session
    let token = ZERO_TOKEN();
    let amount = 0;
    cheat_caller_address(context.ludo_contract, player_0, CheatSpan::TargetCalls(1));
    let new_session_id = context.marquis_game_dispatcher.create_session(token, amount);
    println!("let new_session_id: {:?}", new_session_id);
    // player 1 can join the new session
    cheat_caller_address(context.ludo_contract, player_1, CheatSpan::TargetCalls(1));
    context.marquis_game_dispatcher.join_session(new_session_id);
}

#[test]
fn should_refund_eth_when_owner_finishes_game() {
    // given
    let eth_contract_address = ETH_TOKEN_ADDRESS();
    let amount = 10000;
    let (
        context, players_balance_init,
    ) =
        setup_game_4_players(
        eth_contract_address, amount,
    );

    let owner = OWNER();
    cheat_caller_address(context.ludo_contract, owner, CheatSpan::TargetCalls(1));
    context.marquis_game_dispatcher.owner_finish_session(context.session_id, Option::None);
    let (session_data, _) = context.ludo_dispatcher.get_session_status(context.session_id);
    println!("{:?}", session_data);
    let status = session_data.status;
    let expected_status = 3; // finished
    assert_eq!(status, expected_status);

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
fn should_distribute_eth_when_player_finishes_game() {
    // given
    let eth_contract_address = ETH_TOKEN_ADDRESS();
    let amount = 30000;
    let (
        context, players_balance_init,
    ) =
        setup_game_4_players(
        eth_contract_address, amount,
    );

    let player_1 = PLAYER_1();

    let erc20_dispatcher = IERC20Dispatcher { contract_address: eth_contract_address };
    let player_1_balance_before = erc20_dispatcher.balance_of(player_1);

    let player_1_id = 1;
    cheat_caller_address(context.ludo_contract, player_1, CheatSpan::TargetCalls(1));
    context.marquis_game_dispatcher.player_finish_session(context.session_id, player_1_id);
    let (session_data, _) = context.ludo_dispatcher.get_session_status(context.session_id);
    println!("{:?}", session_data);
    let status = session_data.status;
    let expected_status = 3; // finished
    assert_eq!(status, expected_status);

    let player_0_balance_after = erc20_dispatcher.balance_of(PLAYER_0());
    let player_1_balance_after = erc20_dispatcher.balance_of(player_1);
    let player_2_balance_after = erc20_dispatcher.balance_of(PLAYER_2());
    let player_3_balance_after = erc20_dispatcher.balance_of(PLAYER_3());
    let player_0_expected_balance = *players_balance_init[0] + amount / 3;
    let player_2_expected_balance = *players_balance_init[2] + amount / 3;
    let player_3_expected_balance = *players_balance_init[0] + amount / 3;
    assert_eq!(player_1_balance_after, player_1_balance_before);
    assert_eq!(player_0_balance_after, player_0_expected_balance);
    assert_eq!(player_2_balance_after, player_2_expected_balance);
    assert_eq!(player_3_balance_after, player_3_expected_balance);
}
#[test]
fn should_allow_move_when_rolling_six() {
    let player_0 = PLAYER_0();

    let (context, _) = setup_game_4_players(ZERO_TOKEN(), 0);

    let ludo_move = LudoMove { token_id: 0 };
    let ver_rand_num0 = VerifiableRandomNumber { random_number: 6, v: 1, r: 1, s: 1 };
    let ver_rand_num1 = VerifiableRandomNumber { random_number: 2, v: 1, r: 1, s: 1 };
    let ver_rand_num_array = array![ver_rand_num0, ver_rand_num1];
    let (user0, _, _, _) = player_move(context, @ludo_move, player_0, ver_rand_num_array);
    let expected_pin_0_pos = 3;
    assert_position_0_eq(@user0, expected_pin_0_pos);
}
#[test]
fn should_skip_turn_when_not_rolling_six() {
    let player_0 = PLAYER_0();
    let player_1 = PLAYER_1();

    let (context, _) = setup_game_4_players(ZERO_TOKEN(), 0);

    let ludo_move = LudoMove { token_id: 0 };
    let ver_rand_num1 = VerifiableRandomNumber { random_number: 2, v: 1, r: 1, s: 1 };
    let ver_rand_num_array = array![ver_rand_num1];

    let (user0, _, _, _) = player_move(context, @ludo_move, player_0, ver_rand_num_array);
    let expected_pin_0_pos = 0;
    assert_position_0_eq(@user0, expected_pin_0_pos);

    // player 1 turn
    let ver_rand_num0 = VerifiableRandomNumber { random_number: 6, v: 1, r: 1, s: 1 };
    let ver_rand_num1 = VerifiableRandomNumber { random_number: 2, v: 1, r: 1, s: 1 };
    let ver_rand_num_array = array![ver_rand_num0, ver_rand_num1];
    
    let (_, user1, _, _) = player_move(context, @ludo_move, player_1, ver_rand_num_array);
    let expected_pin_0_pos = 14 + 2;
    assert_position_0_eq(@user1, expected_pin_0_pos);
}
#[test]
// Player 0 kills player 1 pin0
fn should_kill_opponent_token_on_same_position() {
    let player_0 = PLAYER_0();
    let player_1 = PLAYER_1();
    let player_2 = PLAYER_2();
    let player_3 = PLAYER_3();

    let (context, _) = setup_game_4_players(ZERO_TOKEN(), 0);

    let ver_rand_num0 = VerifiableRandomNumber { random_number: 6, v: 1, r: 1, s: 1 };
    // can actually move from here
    let ver_rand_num1 = VerifiableRandomNumber { random_number: 2, v: 1, r: 1, s: 1 };
    let ver_rand_num_array = array![ver_rand_num0, ver_rand_num1];
    let ver_rand_num_array1 = ver_rand_num_array.clone();
    let ver_rand_num_array2 = ver_rand_num_array.clone();
    let ver_rand_num_array3 = ver_rand_num_array.clone();

    let ludo_move = LudoMove { token_id: 0 };

    let (user0, _, _, _) = player_move(context, @ludo_move, player_0, ver_rand_num_array);
    let expected_user0_pin_0_pos = 1 + 2;
    assert_position_0_eq(@user0, expected_user0_pin_0_pos);

    println!("-- Playing move for player 1");
    let (_, user1, _, _) = player_move(context, @ludo_move, player_1, ver_rand_num_array1);
    let expected_use1_pin_0_pos = 14 + 2;
    assert_position_0_eq(@user1, expected_use1_pin_0_pos);

    println!("-- Playing move for player 2");
    let (_, _, user2, _) = player_move(context, @ludo_move, player_2, ver_rand_num_array2);
    let expected_pin_0_pos = 27 + 2;
    assert_position_0_eq(@user2, expected_pin_0_pos);

    println!("-- Playing move for player 3");
    let (_, _, _, user3) = player_move(context, @ludo_move, player_3, ver_rand_num_array3);
    let expected_pin_0_pos = 40 + 2;
    assert_position_0_eq(@user3, expected_pin_0_pos);

    println!("-- Playing move for player 0 again");
    let ver_rand_num0 = VerifiableRandomNumber { random_number: 6, v: 1, r: 1, s: 1 };
    let ver_rand_num1 = VerifiableRandomNumber { random_number: 6, v: 1, r: 1, s: 1 };
    let ver_rand_num2 = VerifiableRandomNumber { random_number: 1, v: 1, r: 1, s: 1 };
    let ver_rand_num_array = array![ver_rand_num0, ver_rand_num1, ver_rand_num2];
    let (user0, user1, _, _) = player_move(context, @ludo_move, player_0, ver_rand_num_array);
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

    let (context, _) = setup_game_4_players(ZERO_TOKEN(), 0);

    let ver_rand_num0 = VerifiableRandomNumber { random_number: 6, v: 1, r: 1, s: 1 };
    // can actually move from here
    let ver_rand_num1 = ver_rand_num0.clone();
    let ver_rand_num2 = ver_rand_num0.clone();
    let ver_rand_num3 = ver_rand_num0.clone();
    let ver_rand_num4 = ver_rand_num0.clone();
    let ver_rand_num5 = ver_rand_num0.clone();
    let ver_rand_num6 = ver_rand_num0.clone();
    let ver_rand_num7 = ver_rand_num0.clone();
    let ver_rand_num8 = ver_rand_num0.clone();
    let ver_rand_num9 = VerifiableRandomNumber { random_number: 2, v: 1, r: 1, s: 1 };

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
    ];
    let ver_rand_num_array1 = ver_rand_num_array.clone();
    let ver_rand_num_array2 = ver_rand_num_array.clone();
    let ver_rand_num_array3 = ver_rand_num_array.clone();

    let ludo_move = LudoMove { token_id: 0 };

    println!("-- Playing move for player 0");
    let (user0, _, _, _) = player_move(context, @ludo_move, player_0, ver_rand_num_array);
    let expected_user0_pin_0_pos = 1 + 50;
    assert_position_0_eq(@user0, expected_user0_pin_0_pos);

    println!("-- Playing move for player 1");
    let (_, user1, _, _) = player_move(context, @ludo_move, player_1, ver_rand_num_array1);
    let expected_use1_pin_0_pos = (14 + 50) % 52;
    assert_position_0_eq(@user1, expected_use1_pin_0_pos);

    println!("-- Playing move for player 2");
    let (_, _, user2, _) = player_move(context, @ludo_move, player_2, ver_rand_num_array2);
    let expected_pin_0_pos = (27 + 50) % 52;
    assert_position_0_eq(@user2, expected_pin_0_pos);

    println!("-- Playing move for player 3");
    let (_, _, _, user3) = player_move(context, @ludo_move, player_3, ver_rand_num_array3);
    let expected_pin_0_pos = (40 + 50) % 52;
    assert_position_0_eq(@user3, expected_pin_0_pos);

    println!("-- Playing move for player 0 again");
    let ver_rand_num0 = VerifiableRandomNumber { random_number: 6, v: 1, r: 1, s: 1 };
    let ver_rand_num_array = array![ver_rand_num0];
    let (user0, _, _, _) = player_move(context, @ludo_move, player_0, ver_rand_num_array);
    let new_expected_user0_pin_0_pos = expected_user0_pin_0_pos + 6;
    assert_position_0_eq(@user0, new_expected_user0_pin_0_pos);

    let (user0_pin_0_winning, _, _, _) = user0.player_winning_tokens;
    assert!(user0_pin_0_winning);
}

#[test]
// Player 0 kills player 1 circled pin0
fn tshould_kill_opponent_token_after_full_circle() {
    let player_0 = PLAYER_0();
    let player_1 = PLAYER_1();
    let player_2 = PLAYER_2();
    let player_3 = PLAYER_3();

    let (context, _) = setup_game_4_players(ZERO_TOKEN(), 0);

    let ver_rand_num0 = VerifiableRandomNumber { random_number: 6, v: 1, r: 1, s: 1 };
    // can actually move from here
    let ver_rand_num1 = VerifiableRandomNumber { random_number: 2, v: 1, r: 1, s: 1 };
    let ver_rand_num_array = array![ver_rand_num0, ver_rand_num1];
    //let ver_rand_num_array1 = ver_rand_num_array.clone();
    let ver_rand_num_array2 = ver_rand_num_array.clone();
    let ver_rand_num_array3 = ver_rand_num_array.clone();

    let ludo_move = LudoMove { token_id: 0 };

    println!("-- Playing move for player 0");
    let (user0, _, _, _) = player_move(context, @ludo_move, player_0, ver_rand_num_array);
    let expected_user0_pin_0_pos = 3;
    assert_position_0_eq(@user0, expected_user0_pin_0_pos);

    println!("-- Playing move for player 1");
    let ver_rand_num0 = VerifiableRandomNumber { random_number: 6, v: 1, r: 1, s: 1 };
    // can actually move from here
    let ver_rand_num1 = ver_rand_num0.clone();
    let ver_rand_num2 = ver_rand_num0.clone();
    let ver_rand_num3 = ver_rand_num0.clone();
    let ver_rand_num4 = ver_rand_num0.clone();
    let ver_rand_num5 = ver_rand_num0.clone();
    let ver_rand_num6 = ver_rand_num0.clone();
    let ver_rand_num7 = VerifiableRandomNumber { random_number: 6, v: 1, r: 1, s: 1 };

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

    let (_, user1, _, _) = player_move(context, @ludo_move, player_1, ver_rand_num_array1);
    let (user1_pin_0_circled, _, _, _) = user1.player_tokens_circled;
    let expected_use1_pin_0_pos = (14 + 42) % 52;
    assert_position_0_eq(@user1, expected_use1_pin_0_pos);
    assert!(user1_pin_0_circled);

    println!("-- Playing move for player 2");
    let (_, _, user2, _) = player_move(context, @ludo_move, player_2, ver_rand_num_array2);
    let expected_pin_0_pos = 27 + 2;
    assert_position_0_eq(@user2, expected_pin_0_pos);

    println!("-- Playing move for player 3");
    let (_, _, _, user3) = player_move(context, @ludo_move, player_3, ver_rand_num_array3);
    let expected_pin_0_pos = 40 + 2;
    assert_position_0_eq(@user3, expected_pin_0_pos);

    println!("-- Playing move for player 0 again");
    let ver_rand_num0 = VerifiableRandomNumber { random_number: 1, v: 1, r: 1, s: 1 };
    let ver_rand_num_array = array![ver_rand_num0];
    let (user0, user1, _, _) = player_move(context, @ludo_move, player_0, ver_rand_num_array);
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

    let (context, _) = setup_game_4_players(ZERO_TOKEN(), 0);

    let ver_rand_num0 = VerifiableRandomNumber { random_number: 6, v: 1, r: 1, s: 1 };
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
    let ver_rand_num10 = VerifiableRandomNumber { random_number: 2, v: 1, r: 1, s: 1 };

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
        ver_rand_num10,
    ];
    let ver_rand_num_array1 = ver_rand_num_array.clone();
    let ver_rand_num_array2 = ver_rand_num_array.clone();
    let ver_rand_num_array3 = ver_rand_num_array.clone();

    let ludo_move = LudoMove { token_id: 0 };

    println!("-- Playing move for player 0");
    let (user0, _, _, _) = player_move(context, @ludo_move, player_0, ver_rand_num_array);
    let expected_user0_pin_0_pos = 1 + 56;
    assert_position_0_eq(@user0, expected_user0_pin_0_pos);

    println!("-- Playing move for player 1");
    let (_, user1, _, _) = player_move(context, @ludo_move, player_1, ver_rand_num_array1);
    let expected_use1_pin_0_pos = (14 + 56) % 52;
    assert_position_0_eq(@user1, expected_use1_pin_0_pos);

    println!("-- Playing move for player 2");
    let (_, _, user2, _) = player_move(context, @ludo_move, player_2, ver_rand_num_array2);
    let expected_pin_0_pos = (27 + 56) % 52;
    assert_position_0_eq(@user2, expected_pin_0_pos);

    println!("-- Playing move for player 3");
    let (user0, user1, user2, user3) = player_move(context, @ludo_move, player_3, ver_rand_num_array3);
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

    let (context, _) =
        setup_game_4_players(
        ZERO_TOKEN(), 0,
    );

    let ver_rand_num0 = VerifiableRandomNumber { random_number: 6, v: 1, r: 1, s: 1 };
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
    let ver_rand_num10 = VerifiableRandomNumber { random_number: 2, v: 1, r: 1, s: 1 };

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
        ver_rand_num10,
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

    let ludo_move = LudoMove { token_id: 0 };

    println!("-- Playing move for player 0");
    let (user0, _, _, _) = player_move(context, @ludo_move, player_0, ver_rand_num_array);
    let expected_user0_pin_0_pos = 1 + 56;
    assert_position_0_eq(@user0, expected_user0_pin_0_pos);

    println!("-- Playing move for player 1");
    let (_, user1, _, _) = player_move(context, @ludo_move, player_1, ver_rand_num_array1);
    let expected_use1_pin_0_pos = (14 + 56) % 52;
    assert_position_0_eq(@user1, expected_use1_pin_0_pos);

    println!("-- Playing move for player 2");
    let (_, _, user2, _) = player_move(context, @ludo_move, player_2, ver_rand_num_array2);
    let expected_pin_0_pos = (27 + 56) % 52;
    assert_position_0_eq(@user2, expected_pin_0_pos);

    println!("-- Playing move for player 3");
    let (_, _, _, user3) = player_move(context, @ludo_move, player_3, ver_rand_num_array3);
    let expected_pin_0_pos = (40 + 56) % 52;
    assert_position_0_eq(@user3, expected_pin_0_pos);

    let ludo_move_1 = LudoMove { token_id: 1 };

    println!("-- Playing move for player 0 pin 1");
    let (user0, _, _, _) = player_move(context, @ludo_move_1, player_0, var_rand_num_array4);
    let expected_user0_pin_1_pos = 1 + 56;
    assert_position_1_eq(@user0, expected_user0_pin_1_pos);

    println!("-- Playing move for player 1 pin 1");
    let (_, user1, _, _) = player_move(context, @ludo_move_1, player_1, var_rand_num_array5);
    let expected_user1_pin_1_pos = (14 + 56) % 52;
    assert_position_1_eq(@user1, expected_user1_pin_1_pos);

    println!("-- Playing move for player 2 pin 1");
    let (_, _, user2, _) = player_move(context, @ludo_move_1, player_2, var_rand_num_array6);
    let expected_user2_pin_1_pos = (27 + 56) % 52;
    assert_position_1_eq(@user2, expected_user2_pin_1_pos);

    println!("-- Playing move for player 3 pin 1");
    let (_, _, _, user3) = player_move(context, @ludo_move_1, player_3, var_rand_num_array7);
    let expected_user3_pin_1_pos = (40 + 56) % 52;
    assert_position_1_eq(@user3, expected_user3_pin_1_pos);

    let ludo_move_2 = LudoMove { token_id: 2 };

    println!("-- Playing move for player 0 pin 2");
    let (user0, _, _, _) = player_move(context, @ludo_move_2, player_0, var_rand_num_array8);
    let expected_user0_pin_2_pos = 1 + 56;
    assert_position_2_eq(@user0, expected_user0_pin_2_pos);

    println!("-- Playing move for player 1 pin 2");
    let (_, user1, _, _) = player_move(context, @ludo_move_2, player_1, var_rand_num_array9);
    let expected_user1_pin_2_pos = (14 + 56) % 52;
    assert_position_2_eq(@user1, expected_user1_pin_2_pos);

    println!("-- Playing move for player 2 pin 2");
    let (_, _, user2, _) = player_move(context, @ludo_move_2, player_2, var_rand_num_array10);
    let expected_user2_pin_2_pos = (27 + 56) % 52;
    assert_position_2_eq(@user2, expected_user2_pin_2_pos);

    println!("-- Playing move for player 3 pin 2");
    let (_, _, _, user3) = player_move(context, @ludo_move_2, player_3, var_rand_num_array11);
    let expected_user3_pin_2_pos = (40 + 56) % 52;
    assert_position_2_eq(@user3, expected_user3_pin_2_pos);

    let player_session = context.marquis_game_dispatcher.player_session(player_0);
    println!("-- Player 0 session: {:?}", player_session);
    let expected_session_id = 1;
    assert_eq!(player_session, expected_session_id);

    let ludo_move_3 = LudoMove { token_id: 3 };

    println!("-- Playing move for player 0 pin 3 to win");
    let (user0, _, _, _) = player_move(context, @ludo_move_3, player_0, var_rand_num_array12);
    let expected_user0_pin_3_pos = 1 + 56;
    assert_position_3_eq(@user0, expected_user0_pin_3_pos);

    let (session_data, _) = context.ludo_dispatcher.get_session_status(context.session_id);
    let expected_status = 3; // finished
    let expected_player_count = 0;
    assert_eq!(session_data.status, expected_status);
    assert_eq!(session_data.player_count, expected_player_count);

    let (_, _, _, user0_pin_3_winning) = user0.player_winning_tokens;
    assert!(user0_pin_3_winning);

    let player_session = context.marquis_game_dispatcher.player_session(player_0);
    let expected_session_id = 0;
    assert_eq!(player_session, expected_session_id);
}

#[test]
fn should_distribute_eth_prize_to_winner() {
    // given
    let eth_contract_address = ETH_TOKEN_ADDRESS();
    let amount = 100;
    let (context, _) =
        setup_game_4_players(
        eth_contract_address, amount,
    );

    let player_0 = PLAYER_0();
    let player_1 = PLAYER_1();
    let player_2 = PLAYER_2();
    let player_3 = PLAYER_3();
    let erc20_dispatcher = IERC20Dispatcher { contract_address: eth_contract_address };

    let ver_rand_num0 = VerifiableRandomNumber { random_number: 6, v: 1, r: 1, s: 1 };
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
    let ver_rand_num10 = VerifiableRandomNumber { random_number: 2, v: 1, r: 1, s: 1 };

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
        ver_rand_num10,
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

    let ludo_move = LudoMove { token_id: 0 };

    println!("-- Playing move for player 0");
    let (user0, _, _, _) = player_move(context, @ludo_move, player_0, ver_rand_num_array);
    let expected_user0_pin_0_pos = 1 + 56;
    assert_position_0_eq(@user0, expected_user0_pin_0_pos);

    println!("-- Playing move for player 1");
    let (_, user1, _, _) = player_move(context, @ludo_move, player_1, ver_rand_num_array1);
    let expected_user1_pin_0_pos = (14 + 56) % 52;
    assert_position_0_eq(@user1, expected_user1_pin_0_pos);

    println!("-- Playing move for player 2");
    let (_, _, user2, _) = player_move(context, @ludo_move, player_2, ver_rand_num_array2);
    let expected_pin_0_pos = (27 + 56) % 52;
    assert_position_0_eq(@user2, expected_pin_0_pos);

    println!("-- Playing move for player 3");
    let (_, _, _, user3) = player_move(context, @ludo_move, player_3, ver_rand_num_array3);
    let expected_pin_0_pos = (40 + 56) % 52;
    assert_position_0_eq(@user3, expected_pin_0_pos);

    let ludo_move_1 = LudoMove { token_id: 1 };

    println!("-- Playing move for player 0 pin 1");
    let (user0, _, _, _) = player_move(context, @ludo_move_1, player_0, var_rand_num_array4);
    let expected_user0_pin_1_pos = 1 + 56;
    assert_position_1_eq(@user0, expected_user0_pin_1_pos);

    println!("-- Playing move for player 1 pin 1");
    let (_, user1, _, _) = player_move(context, @ludo_move_1, player_1, var_rand_num_array5);
    let expected_user1_pin_1_pos = (14 + 56) % 52;
    assert_position_1_eq(@user1, expected_user1_pin_1_pos);

    println!("-- Playing move for player 2 pin 1");
    let (_, _, user2, _) = player_move(context, @ludo_move_1, player_2, var_rand_num_array6);
    let expected_user2_pin_1_pos = (27 + 56) % 52;
    assert_position_1_eq(@user2, expected_user2_pin_1_pos);

    println!("-- Playing move for player 3 pin 1");
    let (_, _, _, user3) = player_move(context, @ludo_move_1, player_3, var_rand_num_array7);
    let expected_user3_pin_1_pos = (40 + 56) % 52;
    assert_position_1_eq(@user3, expected_user3_pin_1_pos);

    let ludo_move_2 = LudoMove { token_id: 2 };

    println!("-- Playing move for player 0 pin 2");
    let (user0, _, _, _) = player_move(context, @ludo_move_2, player_0, var_rand_num_array8);
    let expected_user0_pin_2_pos = 1 + 56;
    assert_position_2_eq(@user0, expected_user0_pin_2_pos);

    println!("-- Playing move for player 1 pin 2");
    let (_, user1, _, _) = player_move(context, @ludo_move_2, player_1, var_rand_num_array9);
    let expected_user1_pin_2_pos = (14 + 56) % 52;
    assert_position_2_eq(@user1, expected_user1_pin_2_pos);

    println!("-- Playing move for player 2 pin 2");
    let (_, _, user2, _) = player_move(context, @ludo_move_2, player_2, var_rand_num_array10);
    let expected_user2_pin_2_pos = (27 + 56) % 52;
    assert_position_2_eq(@user2, expected_user2_pin_2_pos);

    println!("-- Playing move for player 3 pin 2");
    let (_, _, _, user3) = player_move(context, @ludo_move_2, player_3, var_rand_num_array11);
    let expected_user3_pin_2_pos = (40 + 56) % 52;
    assert_position_2_eq(@user3, expected_user3_pin_2_pos);

    let player_session = context.marquis_game_dispatcher.player_session(player_0);
    println!("-- Player 0 session: {:?}", player_session);
    let expected_session_id = 1;
    assert_eq!(player_session, expected_session_id);

    println!("-- Playing move for player 0 pin 3 to win");
    let ludo_move_3 = LudoMove { token_id: 3 };
    let mut spy = spy_events();

    let (user0, _, _, _) = player_move(context, @ludo_move_3, player_0, var_rand_num_array12);
    let expected_user0_pin_3_pos = 1 + 56;
    assert_position_3_eq(@user0, expected_user0_pin_3_pos);
    
    let events_from_ludo_contract = spy.get_events().emitted_by(context.ludo_contract);
    let (from, event_from_ludo) = events_from_ludo_contract.events.at(0);

    let felt_session_id: felt252 = context.session_id.try_into().unwrap();
    assert_eq!(from, @context.ludo_contract);
    assert_eq!(event_from_ludo.keys.at(0), @selector!("SessionFinished"));
    assert_eq!(event_from_ludo.keys.at(1), @felt_session_id);
    let winner_amount = event_from_ludo.data.at(0);
    println!("-- Winner amount: {:?}", winner_amount);
    let player_0_balance = erc20_dispatcher.balance_of(player_0);
    println!("-- Player 0 balance after winning: {:?}", player_0_balance);

    let (session_data, ludo_session_status) = context.ludo_dispatcher.get_session_status(context.session_id);
    println!("{:?}", session_data);
    println!("{:?}", ludo_session_status);

    let expected_status = 3; // finished
    let expected_player_count = 0;
    assert_eq!(session_data.status, expected_status);
    assert_eq!(session_data.player_count, expected_player_count);

    let (_, _, _, user0_pin_3_winning) = user0.player_winning_tokens;
    assert!(user0_pin_3_winning);

    let player_session = context.marquis_game_dispatcher.player_session(player_0);
    let expected_session_id = 0;
    assert_eq!(player_session, expected_session_id);
}

