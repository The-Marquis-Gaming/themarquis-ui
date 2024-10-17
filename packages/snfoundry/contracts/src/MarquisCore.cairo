#[starknet::contract]
mod MarquisCore {
    use contracts::IMarquisCore::{IMarquisCore, SupportedToken, Constants, Withdraw};
    use openzeppelin_access::ownable::OwnableComponent;
    use openzeppelin_token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};
    use openzeppelin_upgrades::interface::IUpgradeable;
    use openzeppelin_upgrades::upgradeable::UpgradeableComponent;
    use starknet::storage::{
        StoragePointerReadAccess, StoragePointerWriteAccess, Vec, VecTrait, MutableVecTrait
    };
    use starknet::{ContractAddress, contract_address_const};
    use starknet::{get_contract_address, ClassHash};
    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);
    component!(path: UpgradeableComponent, storage: upgradeable, event: UpgradeableEvent);

    const ETH_CONTRACT_ADDRESS: felt252 =
        0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7;
    const STRK_CONTRACT_ADDRESS: felt252 =
        0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d;

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
        let eth_contract_address = contract_address_const::<ETH_CONTRACT_ADDRESS>();
        let strk_contract_address = contract_address_const::<STRK_CONTRACT_ADDRESS>();
        let fee = Constants::FEE_MAX;
        let strk_token = SupportedToken { token_address: strk_contract_address, fee };
        let eth_token = SupportedToken { token_address: eth_contract_address, fee };
        self.ownable.initializer(owner);
        self.supported_tokens.append().write(strk_token);
        self.supported_tokens.append().write(eth_token);
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
            option_amount: Option<u256>
        ) {
            self.ownable.assert_only_owner();
            let token_dispatcher = IERC20Dispatcher { contract_address: token };
            let amount = match option_amount {
                Option::Some(amount_to_withdraw) => amount_to_withdraw,
                // If no amount is provided, withdraw the full balance
                Option::None => token_dispatcher.balance_of(get_contract_address())
            };
            token_dispatcher.transfer(beneficiary, amount);
            self.emit(Withdraw { token, beneficiary, amount });
        }

        fn add_supported_token(ref self: ContractState, token: SupportedToken) {
            self.ownable.assert_only_owner();
            let supported_tokens = self.get_all_supported_tokens();
            for supported_token in supported_tokens {
                assert(
                    *supported_token.token_address != token.token_address, 'Token already supported'
                );
            };
            self.supported_tokens.append().write(token.clone());
            self.emit(token);
        }

        // For token_index, we use same as from DataBase
        fn update_token_fee(ref self: ContractState, token_index: u64, fee: u16) {
            self.ownable.assert_only_owner();
            self._assert_valid_fee(fee);

            let mut supported_token = self.supported_tokens.at(token_index);
            let token_address = supported_token.read().token_address;
            let updated_token = SupportedToken { token_address, fee };
            supported_token.write(updated_token.clone());
            self.emit(updated_token);
        }

        fn get_all_supported_tokens(self: @ContractState) -> Span<SupportedToken> {
            let mut supported_tokens = array![];
            let len = self.supported_tokens.len();
            for i in 0
                ..len {
                    let token = self.supported_tokens.at(i).read();
                    supported_tokens.append(token);
                };
            supported_tokens.span()
        }

        fn fee_basis(self: @ContractState) -> u16 {
            Constants::FEE_MAX
        }
    }
    #[generate_trait]
    impl InternalImpl of InternalTrait {
        /// @notice Asserts that the provided fee is valid
        /// @param fee The fee to be checked
        fn _assert_valid_fee(ref self: ContractState, fee: u16) {
            assert(fee <= Constants::FEE_MAX, Constants::INVALID_FEE);
        }
        fn get_n_th_registered_token(self: @ContractState, index: u64) -> Option<SupportedToken> {
            if let Option::Some(SupportedToken) = self.supported_tokens.get(index) {
                return Option::Some(SupportedToken.read());
            }
            Option::None
        }
    }
}
