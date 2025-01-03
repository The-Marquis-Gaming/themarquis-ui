use starknet::ContractAddress;

#[derive(Debug, Drop, Clone, Serde, starknet::Store, starknet::Event)]
pub struct SupportedToken {
    pub token_address: ContractAddress,
    pub fee: u16,
}

#[derive(Drop, starknet::Event)]
pub struct Withdraw {
    #[key]
    pub token: ContractAddress,
    #[key]
    pub beneficiary: ContractAddress,
    pub amount: u256,
}

#[starknet::interface]
pub trait IMarquisCore<TContractState> {
    fn withdraw(
        ref self: TContractState,
        token: ContractAddress,
        beneficiary: ContractAddress,
        option_amount: Option<u256>,
    );
    fn add_supported_token(ref self: TContractState, token: SupportedToken);
    fn get_all_supported_tokens(self: @TContractState) -> Span<SupportedToken>;
    fn update_token_fee(ref self: TContractState, token_index: u64, fee: u16);
}

pub mod Constants {
    pub const INVALID_FEE: felt252 = 'Invalid fee';
    pub const FEE_MAX: u16 = 10000;
    pub const FEE_MIN: u16 = 10;
}
