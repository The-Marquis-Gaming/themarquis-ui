use starknet::ContractAddress;

#[starknet::interface]
pub trait IMarquisCore<TContractState> {
    fn withdraw(
        ref self: TContractState,
        token: ContractAddress,
        beneficiary: ContractAddress,
        amount: Option<u256>
    );
    fn update_supported_token_with_fee(
        ref self: TContractState, token_address: ContractAddress, is_supported: bool, fee: u16
    );
    fn supported_token_with_fee(
        self: @TContractState, token_address: ContractAddress
    ) -> (bool, u16);
    fn fee_basis(self: @TContractState) -> u16;
}

#[starknet::contract]
mod MarquisCore {
    use openzeppelin::access::ownable::OwnableComponent;
    use openzeppelin::token::erc20::interface::{IERC20CamelDispatcher, IERC20CamelDispatcherTrait};
    use openzeppelin::upgrades::interface::IUpgradeable;
    use openzeppelin::upgrades::upgradeable::UpgradeableComponent;
    use starknet::{get_contract_address, ClassHash};
    use super::{ContractAddress, IMarquisCore};

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
        UpdateSupportedTokenWithFee: UpdateSupportedTokenWithFee,
        Withdraw: Withdraw
    }

    #[derive(Drop, starknet::Event)]
    struct UpdateSupportedTokenWithFee {
        #[key]
        token: ContractAddress,
        fee: u16,
        is_supported: bool,
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
        supported_tokens: LegacyMap<ContractAddress, (bool, u16)>,
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
            let token_dispatcher = IERC20CamelDispatcher { contract_address: token };
            let amount = match amount {
                Option::Some(amount) => amount,
                Option::None => token_dispatcher.balanceOf(get_contract_address())
            };
            token_dispatcher.transfer(beneficiary, amount);
            self.emit(Withdraw { token, beneficiary, amount });
        }

        fn update_supported_token_with_fee(
            ref self: ContractState, token_address: ContractAddress, is_supported: bool, fee: u16
        ) {
            self.ownable.assert_only_owner();
            if is_supported {
                self._assert_valid_fee(fee);
            };
            // ToDo: In case of `is_supported` is false, we store the fee as whatever the user wants, improve this later
            self.supported_tokens.write(token_address, (is_supported, fee));
            self
                .emit(
                    UpdateSupportedTokenWithFee {
                        token: token_address, fee: fee, is_supported: is_supported
                    }
                );
        }

        fn supported_token_with_fee(
            self: @ContractState, token_address: ContractAddress
        ) -> (bool, u16) {
            let (_is_supported, _fee) = self.supported_tokens.read(token_address);
            (_is_supported, _fee)
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
