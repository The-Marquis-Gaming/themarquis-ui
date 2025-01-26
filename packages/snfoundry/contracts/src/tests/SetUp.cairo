use contracts::interfaces::ILudo::{
    ILudoDispatcher, ILudoDispatcherTrait, LudoMove, SessionUserStatus,
};
use contracts::interfaces::IMarquisGame::{
    IMarquisGameDispatcher, IMarquisGameDispatcherTrait, VerifiableRandomNumber,
};
use core::num::traits::Zero;
use openzeppelin_token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
use openzeppelin_upgrades::interface::{IUpgradeableDispatcher, IUpgradeableDispatcherTrait};
use openzeppelin_upgrades::upgradeable::UpgradeableComponent;
use openzeppelin_utils::serde::SerializedAppend;
use snforge_std::{
    CheatSpan, ContractClassTrait, DeclareResultTrait, EventSpyAssertionsTrait, EventSpyTrait,
    EventsFilterTrait, cheat_caller_address, cheatcodes::events::Event, declare, spy_events,
};
use starknet::{ContractAddress, EthAddress, contract_address_const};

// Real contract addresses deployed on Sepolia
pub fn OWNER() -> ContractAddress {
    contract_address_const::<0x02dA5254690b46B9C4059C25366D1778839BE63C142d899F0306fd5c312A5918>()
}

pub fn PLAYER_0() -> ContractAddress {
    contract_address_const::<0x01528adf08bf1f8895aea018155fd8ad1cfc2b4935c680b948bc87f425eafd39>()
}
pub fn PLAYER_1() -> ContractAddress {
    contract_address_const::<0x06bd7295fbf481d7c2109d0aca4a0485bb902583d5d6cc7f0307678685209249>()
}
pub fn PLAYER_2() -> ContractAddress {
    contract_address_const::<0x05f06de98f137297927a239fa9c5b0c8299c7a9700789d5e9e178958f881aae0>()
}
pub fn PLAYER_3() -> ContractAddress {
    contract_address_const::<0x027d2ad5a55f9be697dd91e479c7b5b279fd2133ac5e6bc11680166a3b86c111>()
}
pub fn ZERO_TOKEN() -> ContractAddress {
    Zero::zero()
}

// Real contract address deployed on Sepolia
pub fn ETH_TOKEN_ADDRESS() -> ContractAddress {
    contract_address_const::<0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7>()
}
pub fn USDC_TOKEN_ADDRESS() -> ContractAddress {
    contract_address_const::<0x053b40a647cedfca6ca84f542a0fe36736031905a9639a7f19a3c1e66bfd5080>()
}

pub fn STRK_TOKEN_ADDRESS() -> ContractAddress {
    contract_address_const::<0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d>()
}

pub fn deploy_marquis_contract() -> ContractAddress {
    let contract_class = declare("MarquisCore").unwrap().contract_class();
    let mut calldata = array![];
    calldata.append_serde(OWNER());
    let (contract_address, _) = contract_class.deploy(@calldata).unwrap();
    contract_address
}

pub fn deploy_ludo_contract() -> ContractAddress {
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

pub fn deploy_erc20_contract(symbol: ByteArray, address: ContractAddress) -> ContractAddress {
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

pub fn upgrade_contract(caller: ContractAddress) {
    let ludo_contract = deploy_ludo_contract();
    let upgradeable_dispatcher = IUpgradeableDispatcher { contract_address: ludo_contract };

    let contract_class = declare("Ludo").unwrap().contract_class();
    // We are going to use another contract (ERC20) to feign as it was a Ludo Upgrade.
    // This should produce a new class hash
    let new_contract_class = declare("ERC20").unwrap().contract_class();
    let class_hash = *contract_class.class_hash;
    let new_class_hash = *new_contract_class.class_hash;
    assert_ne!(class_hash, new_class_hash);

    let mut spy = spy_events();

    // when the caller calls upgrade
    cheat_caller_address(ludo_contract, caller, CheatSpan::TargetCalls(1));
    upgradeable_dispatcher.upgrade(new_class_hash);

    let events_from_ludo_contract = spy.get_events();
    assert_eq!(events_from_ludo_contract.events.len(), 1);

    // Check if the emitted event was as expected with the new class hash.
    spy
        .assert_emitted(
            @array![
                (
                    ludo_contract,
                    UpgradeableComponent::Event::Upgraded(
                        UpgradeableComponent::Upgraded { class_hash: new_class_hash },
                    ),
                ),
            ],
        );
}

// SETUP GAME FUNCTIONS

#[derive(Drop, Copy)]
/// Represents the context of a game session to be shared with utilities functions
pub struct GameContext {
    pub ludo_contract: ContractAddress,
    pub ludo_dispatcher: ILudoDispatcher,
    pub marquis_game_dispatcher: IMarquisGameDispatcher,
    pub session_id: u256,
}


/// Utility function to start a new game by player 0
/// - Deploy the Ludo contract
/// - Create and return a new game session context
/// - If the token address is an ETH token, use an ERC20 mock and give allowance to the Ludo
/// contract - Return the initial balance as well; some tests need it
pub fn setup_game_new(
    token: ContractAddress, amount: u256, required_players: u32,
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

    // create session
    cheat_caller_address(ludo_contract, player_0, CheatSpan::TargetCalls(1));
    let session_id = marquis_game_dispatcher.create_session(
        Option::Some(token),
        Option::Some(amount), required_players);

    let context = GameContext {
        ludo_contract, ludo_dispatcher, marquis_game_dispatcher, session_id,
    };

    (context, player_0_init_balance)
}

/// Utility function to start a new game by player 0
/// - Call setup_game_new() first
/// - Allow 1 players to join the session
/// - Return all initial balances
pub fn setup_game_2_players(token: ContractAddress, amount: u256) -> (GameContext, Array<u256>) {
    let (context, player_0_init_balance) = setup_game_new(token, amount, 2);

    let player_1 = PLAYER_1();
    let mut player_1_init_balance = 0;

    if token == ETH_TOKEN_ADDRESS() {
        let erc20_dispatcher = IERC20Dispatcher { contract_address: token };
        player_1_init_balance = erc20_dispatcher.balance_of(player_1);
        cheat_caller_address(token, player_1, CheatSpan::TargetCalls(1));
        erc20_dispatcher.approve(context.ludo_contract, amount);
        println!("-- Player 1 balance before joining: {:?}", player_1_init_balance);
    }

    cheat_caller_address(context.ludo_contract, player_1, CheatSpan::TargetCalls(1));
    context.marquis_game_dispatcher.join_session(context.session_id);

    let players_balance_init = array![player_0_init_balance, player_1_init_balance];
    (context, players_balance_init)
}

/// Utility function to start a new game by player 0
/// - Call setup_game_new() first
/// - Allow 3 more players to join the session
/// - Return all initial balances
pub fn setup_game_4_players(token: ContractAddress, amount: u256) -> (GameContext, Array<u256>) {
    let (context, player_0_init_balance) = setup_game_new(token, amount, 4);

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

/// Let a player move
pub fn player_move(
    context: GameContext,
    ludo_move: @LudoMove,
    player: ContractAddress,
    ver_rand_num_array: Array<VerifiableRandomNumber>,
) -> (SessionUserStatus, SessionUserStatus, SessionUserStatus, SessionUserStatus) {
    cheat_caller_address(context.ludo_contract, player, CheatSpan::TargetCalls(1));
    println!("-- Playing move for player 0x0{:x}", player);
    context.ludo_dispatcher.play(context.session_id, ludo_move.clone(), ver_rand_num_array);
    let (_, ludo_session_status) = context.ludo_dispatcher.get_session_status(context.session_id);

    //println!("{:?}", session_data);
    //println!("{:?}", ludo_session_status);
    ludo_session_status.users
}

/// Utility function to feign rolls -- generate random numbers using the VerifiableRandomNumber
/// struct
/// @param no_of_rolls: the number of rolls targeted on one die to be made.
/// @param no_of_rolls_batch_size: The batch size to iterate the previous number of rolls.
/// @param r1 The first random number, usually a 6 to move out of the starting position.
/// this parameter is not counted for a single roll, Therefore the number dedicated to a single roll
/// should be put as the last parameter to this function, as the first would be ignored.
/// @param r2 The second random number, the last roll, usually a 2 to win the game.
/// @return an array of rolls batches, with the size of the no_of_rolls_batch_size.
pub fn generate_verifiable_random_numbers(
    no_of_rolls: usize, no_of_rolls_batch_size: usize, r1: u256, r2: u256,
) -> Array<Array<VerifiableRandomNumber>> {
    let mut ver_rand_num_array = array![];
    for _ in 0..no_of_rolls - 1 {
        ver_rand_num_array.append(VerifiableRandomNumber { random_number: r1, v: 1, r: 1, s: 1 });
    };
    ver_rand_num_array.append(VerifiableRandomNumber { random_number: r2, v: 1, r: 1, s: 1 });

    let mut batch = array![];
    for _ in 0..no_of_rolls_batch_size {
        batch.append(ver_rand_num_array.clone());
    };

    batch
}

/// Utility function to feign a win scenario.
/// - Player 0 always wins
/// @param player_0 - player_1: ContractAddresses of all four players taken in as a ref
/// @param context: The GameContext
/// @return the snapshot of the event generated from the contract.
pub fn feign_win_two(
    player_0: @ContractAddress, player_1: @ContractAddress, context: @GameContext,
) -> @Event {
    let mut ver_rand_num_array_ref = generate_verifiable_random_numbers(11, 13, 6, 2);
    let player_0 = *player_0;
    let player_1 = *player_1;
    let context = *context;

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
    let expected_user1_pin_0_pos = (14 + 56) % 52;
    assert_position_0_eq(@user1, expected_user1_pin_0_pos);

    let ludo_move_1 = LudoMove { token_id: 1 };
    println!("-- Playing move for player 0 pin 1");
    let (user0, _, _, _) = player_move(
        context, @ludo_move_1, player_0, ver_rand_num_array_ref.pop_front().unwrap(),
    );
    let expected_user0_pin_1_pos = 1 + 56;
    assert_position_1_eq(@user0, expected_user0_pin_1_pos);

    println!("-- Playing move for player 1 pin 1");
    let (_, user1, _, _) = player_move(
        context, @ludo_move_1, player_1, ver_rand_num_array_ref.pop_front().unwrap(),
    );
    let expected_user1_pin_1_pos = (14 + 56) % 52;
    assert_position_1_eq(@user1, expected_user1_pin_1_pos);

    let ludo_move_2 = LudoMove { token_id: 2 };

    println!("-- Playing move for player 0 pin 2");
    let (user0, _, _, _) = player_move(
        context, @ludo_move_2, player_0, ver_rand_num_array_ref.pop_front().unwrap(),
    );
    let expected_user0_pin_2_pos = 1 + 56;
    assert_position_2_eq(@user0, expected_user0_pin_2_pos);

    println!("-- Playing move for player 1 pin 2");
    let (_, user1, _, _) = player_move(
        context, @ludo_move_2, player_1, ver_rand_num_array_ref.pop_front().unwrap(),
    );
    let expected_user1_pin_2_pos = (14 + 56) % 52;
    assert_position_2_eq(@user1, expected_user1_pin_2_pos);

    let player_session = context.marquis_game_dispatcher.player_session(player_0);
    println!("-- Player 0 session: {:?}", player_session);
    let expected_session_id = 1;
    assert_eq!(player_session, expected_session_id);

    println!("-- Playing move for player 0 pin 3 to win");
    let ludo_move_3 = LudoMove { token_id: 3 };
    let mut spy = spy_events();

    let (user0, _, _, _) = player_move(
        context, @ludo_move_3, player_0, ver_rand_num_array_ref.pop_front().unwrap(),
    );
    let expected_user0_pin_3_pos = 1 + 56;
    assert_position_3_eq(@user0, expected_user0_pin_3_pos);

    let events_from_ludo_contract = spy.get_events().emitted_by(context.ludo_contract);
    let (from, event_from_ludo) = events_from_ludo_contract.events.at(0);

    let felt_session_id: felt252 = context.session_id.try_into().unwrap();
    assert_eq!(from, @context.ludo_contract);
    assert_eq!(event_from_ludo.keys.at(0), @selector!("SessionFinished"));
    assert_eq!(event_from_ludo.keys.at(1), @felt_session_id);

    let expected_status = 3; // finished
    let expected_player_count = 0;
    let (session_data, ludo_session_status) = context
        .ludo_dispatcher
        .get_session_status(context.session_id);
    println!("{:?}", session_data);
    println!("{:?}", ludo_session_status);
    assert_eq!(session_data.status, expected_status);
    assert_eq!(session_data.player_count, expected_player_count);

    let (_, _, _, user0_pin_3_winning) = user0.player_winning_tokens;
    assert!(user0_pin_3_winning);

    // Check unlock players
    let player_0_session = context.marquis_game_dispatcher.player_session(player_0);
    let expected_session_id = 0;
    assert_eq!(player_0_session, expected_session_id);

    let player_1_session = context.marquis_game_dispatcher.player_session(player_1);
    let expected_player_1_session = 0;
    assert_eq!(player_1_session, expected_player_1_session);

    event_from_ludo
}

/// Utility function to feign a win scenario.
/// - Player 3 always wins
/// @param player_0 - player_3: ContractAddresses of all four players taken in as a ref
/// @param context: The GameContext
/// @return the snapshot of the event generated from the contract.
pub fn feign_win_four(
    player_0: @ContractAddress,
    player_1: @ContractAddress,
    player_2: @ContractAddress,
    player_3: @ContractAddress,
    context: @GameContext,
) -> @Event {
    let mut ver_rand_num_array_ref = generate_verifiable_random_numbers(11, 13, 6, 2);
    let player_0 = *player_0;
    let player_1 = *player_1;
    let player_2 = *player_2;
    let player_3 = *player_3;
    let context = *context;

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
    let expected_user1_pin_0_pos = (14 + 56) % 52;
    assert_position_0_eq(@user1, expected_user1_pin_0_pos);

    println!("-- Playing move for player 2");
    let (_, _, user2, _) = player_move(
        context, @ludo_move, player_2, ver_rand_num_array_ref.pop_front().unwrap(),
    );
    let expected_pin_0_pos = (27 + 56) % 52;
    assert_position_0_eq(@user2, expected_pin_0_pos);

    println!("-- Playing move for player 3");
    let (_, _, _, user3) = player_move(
        context, @ludo_move, player_3, ver_rand_num_array_ref.pop_front().unwrap(),
    );
    let expected_pin_0_pos = (40 + 56) % 52;
    assert_position_0_eq(@user3, expected_pin_0_pos);

    let ludo_move_1 = LudoMove { token_id: 1 };

    println!("-- Playing move for player 0 pin 1");
    let (user0, _, _, _) = player_move(
        context, @ludo_move_1, player_0, ver_rand_num_array_ref.pop_front().unwrap(),
    );
    let expected_user0_pin_1_pos = 1 + 56;
    assert_position_1_eq(@user0, expected_user0_pin_1_pos);

    println!("-- Playing move for player 1 pin 1");
    let (_, user1, _, _) = player_move(
        context, @ludo_move_1, player_1, ver_rand_num_array_ref.pop_front().unwrap(),
    );
    let expected_user1_pin_1_pos = (14 + 56) % 52;
    assert_position_1_eq(@user1, expected_user1_pin_1_pos);

    println!("-- Playing move for player 2 pin 1");
    let (_, _, user2, _) = player_move(
        context, @ludo_move_1, player_2, ver_rand_num_array_ref.pop_front().unwrap(),
    );
    let expected_user2_pin_1_pos = (27 + 56) % 52;
    assert_position_1_eq(@user2, expected_user2_pin_1_pos);

    println!("-- Playing move for player 3 pin 1");
    let (_, _, _, user3) = player_move(
        context, @ludo_move_1, player_3, ver_rand_num_array_ref.pop_front().unwrap(),
    );
    let expected_user3_pin_1_pos = (40 + 56) % 52;
    assert_position_1_eq(@user3, expected_user3_pin_1_pos);

    let ludo_move_2 = LudoMove { token_id: 2 };

    println!("-- Playing move for player 0 pin 2");
    let (user0, _, _, _) = player_move(
        context, @ludo_move_2, player_0, ver_rand_num_array_ref.pop_front().unwrap(),
    );
    let expected_user0_pin_2_pos = 1 + 56;
    assert_position_2_eq(@user0, expected_user0_pin_2_pos);

    println!("-- Playing move for player 1 pin 2");
    let (_, user1, _, _) = player_move(
        context, @ludo_move_2, player_1, ver_rand_num_array_ref.pop_front().unwrap(),
    );
    let expected_user1_pin_2_pos = (14 + 56) % 52;
    assert_position_2_eq(@user1, expected_user1_pin_2_pos);

    println!("-- Playing move for player 2 pin 2");
    let (_, _, user2, _) = player_move(
        context, @ludo_move_2, player_2, ver_rand_num_array_ref.pop_front().unwrap(),
    );
    let expected_user2_pin_2_pos = (27 + 56) % 52;
    assert_position_2_eq(@user2, expected_user2_pin_2_pos);

    println!("-- Playing move for player 3 pin 2");
    let (_, _, _, user3) = player_move(
        context, @ludo_move_2, player_3, ver_rand_num_array_ref.pop_front().unwrap(),
    );
    let expected_user3_pin_2_pos = (40 + 56) % 52;
    assert_position_2_eq(@user3, expected_user3_pin_2_pos);

    let player_session = context.marquis_game_dispatcher.player_session(player_0);
    println!("-- Player 0 session: {:?}", player_session);
    let expected_session_id = 1;
    assert_eq!(player_session, expected_session_id);

    println!("-- Playing move for player 0 pin 3 to win");
    let ludo_move_3 = LudoMove { token_id: 3 };
    let mut spy = spy_events();

    let (user0, _, _, _) = player_move(
        context, @ludo_move_3, player_0, ver_rand_num_array_ref.pop_front().unwrap(),
    );
    let expected_user0_pin_3_pos = 1 + 56;
    assert_position_3_eq(@user0, expected_user0_pin_3_pos);

    let events_from_ludo_contract = spy.get_events().emitted_by(context.ludo_contract);
    let (from, event_from_ludo) = events_from_ludo_contract.events.at(0);

    let felt_session_id: felt252 = context.session_id.try_into().unwrap();
    assert_eq!(from, @context.ludo_contract);
    assert_eq!(event_from_ludo.keys.at(0), @selector!("SessionFinished"));
    assert_eq!(event_from_ludo.keys.at(1), @felt_session_id);

    let expected_status = 3; // finished
    let expected_player_count = 0;
    let (session_data, ludo_session_status) = context
        .ludo_dispatcher
        .get_session_status(context.session_id);
    println!("{:?}", session_data);
    println!("{:?}", ludo_session_status);
    assert_eq!(session_data.status, expected_status);
    assert_eq!(session_data.player_count, expected_player_count);

    let (_, _, _, user0_pin_3_winning) = user0.player_winning_tokens;
    assert!(user0_pin_3_winning);

    // Check unlock players
    let player_0_session = context.marquis_game_dispatcher.player_session(player_0);
    let expected_session_id = 0;
    assert_eq!(player_0_session, expected_session_id);

    let player_1_session = context.marquis_game_dispatcher.player_session(player_1);
    let expected_player_1_session = 0;
    assert_eq!(player_1_session, expected_player_1_session);

    let player_2_session = context.marquis_game_dispatcher.player_session(player_2);
    let expected_player_2_session = 0;
    assert_eq!(player_2_session, expected_player_2_session);

    let player_3_session = context.marquis_game_dispatcher.player_session(player_3);
    let expected_player_3_session = 0;
    assert_eq!(player_3_session, expected_player_3_session);

    event_from_ludo
}

pub fn assert_position_0_eq(user: @SessionUserStatus, expected_pos: u256) {
    let (pos_0, _, _, _) = *user.player_tokens_position;
    println!("-- User {:?} pin 0 pos: {:?}", user.player_id, pos_0);
    assert_eq!(pos_0, expected_pos);
}

pub fn assert_position_1_eq(user: @SessionUserStatus, expected_pos: u256) {
    let (_, pos_1, _, _) = *user.player_tokens_position;
    println!("-- User {:?} pin 1 pos: {:?}", user.player_id, pos_1);
    assert_eq!(pos_1, expected_pos);
}

pub fn assert_position_2_eq(user: @SessionUserStatus, expected_pos: u256) {
    let (_, _, pos_2, _) = *user.player_tokens_position;
    println!("-- User {:?} pin 2 pos: {:?}", user.player_id, pos_2);
    assert_eq!(pos_2, expected_pos);
}

pub fn assert_position_3_eq(user: @SessionUserStatus, expected_pos: u256) {
    let (_, _, _, pos_3) = *user.player_tokens_position;
    println!("-- User {:?} pin 3 pos: {:?}", user.player_id, pos_3);
    assert_eq!(pos_3, expected_pos);
}

