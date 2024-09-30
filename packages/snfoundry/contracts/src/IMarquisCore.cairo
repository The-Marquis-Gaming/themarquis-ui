use starknet::ContractAddress;
#[derive(Debug, Drop, Clone, Serde, starknet::Store, starknet::Event)]
pub struct SupportedToken {
    pub token_address: ContractAddress,
    pub fee: u16,
}
#[starknet::interface]
pub trait IMarquisCore<TContractState> {
    fn withdraw(
        ref self: TContractState,
        token: ContractAddress,
        beneficiary: ContractAddress,
        amount: Option<u256>
    );
    fn update_supported_tokens(ref self: TContractState, token: SupportedToken);
    fn get_all_supported_tokens(self: @TContractState) -> Array<SupportedToken>;
    fn fee_basis(self: @TContractState) -> u16;
}

pub mod Constants {
    pub const INVALID_FEE: felt252 = 'Invalid fee';
    pub const FEE_BASIS: u16 = 10000;
}
