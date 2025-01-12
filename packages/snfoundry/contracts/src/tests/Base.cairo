use contracts::IMarquisCore::{
    Constants, IMarquisCoreDispatcher, IMarquisCoreDispatcherTrait, SupportedToken,
};
use contracts::interfaces::IMarquisGame::{IMarquisGameDispatcher, IMarquisGameDispatcherTrait};
use openzeppelin_token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
use snforge_std::{CheatSpan, cheat_caller_address};
use super::SetUp::{OWNER, PLAYER_0, PLAYER_1, STRK_TOKEN_ADDRESS, USDC_TOKEN_ADDRESS};
use super::SetUp::{
    deploy_erc20_contract, deploy_ludo_contract, deploy_marquis_contract, upgrade_contract,
};


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
    let fee = Constants::FEE_MIN;
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
#[should_panic]
fn should_panic_the_contract_upgrade_when_caller_is_not_owner() {
    let NOT_OWNER = PLAYER_0();
    upgrade_contract(NOT_OWNER);
}

#[test]
fn should_allow_contract_upgrade_when_caller_is_owner() {
    upgrade_contract(OWNER());
}

#[test]
#[should_panic(expected: 'UNSUPPORTED TOKEN')]
fn should_panic_when_game_is_initialized_with_unsupported_token() {
    let ludo_contract = deploy_ludo_contract();
    let marquis_game_dispatcher = IMarquisGameDispatcher { contract_address: ludo_contract };
    let token_address = USDC_TOKEN_ADDRESS();
    let player_0 = PLAYER_0();
    let amount: u256 = 100;
    let required_players = 2;

    cheat_caller_address(ludo_contract, player_0, CheatSpan::TargetCalls(1));
    let _ = marquis_game_dispatcher.create_session(token_address, amount, required_players);
}

#[test]
#[should_panic(expected: 'Token already supported')]
fn should_panic_when_supported_token_is_added_more_than_once() {
    let marquis_contract = deploy_marquis_contract();
    let marquis_dispatcher = IMarquisCoreDispatcher { contract_address: marquis_contract };
    let token_address = USDC_TOKEN_ADDRESS();
    let fee = 1;
    let supported_token = SupportedToken { token_address, fee };
    cheat_caller_address(marquis_contract, OWNER(), CheatSpan::TargetCalls(2));
    marquis_dispatcher.add_supported_token(supported_token);
    let supported_token = SupportedToken { token_address, fee };
    marquis_dispatcher.add_supported_token(supported_token)
}
