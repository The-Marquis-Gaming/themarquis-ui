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

#[starknet::contract]
mod MarquisCore {
    use openzeppelin::access::ownable::OwnableComponent;
    use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
    use openzeppelin::upgrades::interface::IUpgradeable;
    use openzeppelin::upgrades::upgradeable::UpgradeableComponent;
    use starknet::{get_contract_address, ClassHash};
    use super::{ContractAddress, IMarquisCore, SupportedToken};
    use starknet::storage::{
        StoragePointerReadAccess, StoragePointerWriteAccess, Vec, VecTrait, MutableVecTrait
    };
    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);
    component!(path: UpgradeableComponent, storage: upgradeable, event: UpgradeableEvent);

    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;
    impl UpgradeableInternalImpl = UpgradeableComponent::InternalImpl<ContractState>;

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        #[flat]
        UpgradeableEvent: UpgradeableComponent::Event,
        UpdateSupportedToken: SupportedToken,
        Withdraw: Withdraw
    }

    #[derive(Drop, starknet::Event)]
    struct Withdraw {
        #[key]
        token: ContractAddress,
        #[key]
        beneficiary: ContractAddress,
        amount: u256,
    }

    const INVALID_FEE: felt252 = 'Invalid fee';
    const FEE_BASIS: u16 = 10000;

    #[storage]
    struct Storage {
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        #[substorage(v0)]
        upgradeable: UpgradeableComponent::Storage,
        supported_tokens: Vec<SupportedToken>,
        blacklisted_tokens: Vec<ContractAddress>,
    }

    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress) {
        self.ownable.initializer(owner);
    }


    #[abi(embed_v0)]
    impl UpgradeableImpl of IUpgradeable<ContractState> {
        fn upgrade(ref self: ContractState, new_class_hash: ClassHash) {
            self.ownable.assert_only_owner();
            self.upgradeable.upgrade(new_class_hash);
        }
    }

    #[abi(embed_v0)]
    impl MarquisCoreImpl of IMarquisCore<ContractState> {
        fn withdraw(
            ref self: ContractState,
            token: ContractAddress,
            beneficiary: ContractAddress,
            amount: Option<u256>
        ) {
            self.ownable.assert_only_owner();
            let token_dispatcher = IERC20Dispatcher { contract_address: token };
            let amount = match amount {
                Option::Some(amount) => amount,
                Option::None => token_dispatcher.balance_of(get_contract_address())
            };
            token_dispatcher.transfer(beneficiary, amount);
            self.emit(Withdraw { token, beneficiary, amount });
        }

        fn update_supported_tokens(ref self: ContractState, token: SupportedToken) {
            self.ownable.assert_only_owner();
            self.supported_tokens.append().write(token.clone());
            self.emit(token);
        }
        fn get_all_supported_tokens(self: @ContractState) -> Array<SupportedToken> {
            let mut supported_tokens = array![];
            let len = self.supported_tokens.len();
            for i in 0
                ..len {
                    let token = self.supported_tokens.at(i).read();
                    supported_tokens.append(token);
                };
            supported_tokens
        }

        fn fee_basis(self: @ContractState) -> u16 {
            FEE_BASIS
        }
    }
    #[generate_trait]
    impl InternalImpl of InternalTrait {
        /// @notice Asserts that the provided fee is valid
        /// @param fee The fee to be checked
        fn _assert_valid_fee(ref self: ContractState, fee: u16) {
            assert(fee <= FEE_BASIS, INVALID_FEE);
        }
    }
}
