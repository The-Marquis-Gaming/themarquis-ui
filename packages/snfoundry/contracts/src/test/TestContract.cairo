use contracts::MarquisCore::{IMarquisCoreDispatcher, IMarquisCoreDispatcherTrait};
use openzeppelin::utils::serde::SerializedAppend;
use snforge_std::{declare, ContractClassTrait};
use starknet::{ContractAddress, EthAddress, contract_address_const};

fn OWNER() -> ContractAddress {
    contract_address_const::<'OWNER'>()
}

fn deploy_marquis_contract() -> ContractAddress {
    let contract = declare("MarquisCore").unwrap();
    let mut calldata = array![];
    calldata.append_serde(OWNER());
    let (contract_address, _) = contract.deploy(@calldata).unwrap();
    println!("-- MarquisCore contract deployed on: {:?}", contract_address);
    contract_address
}

fn deploy_ludo_contract() -> ContractAddress {
    let marquis_contract_address = deploy_marquis_contract();
    let contract = declare("Ludo").unwrap();
    // Todo: Refactor to not use eth
    let oracle_address: felt252 = '0x0';
    let marquis_oracle_address: EthAddress = oracle_address.try_into().unwrap();
    let mut calldata = array![];
    calldata.append_serde(marquis_oracle_address);
    calldata.append_serde(marquis_contract_address);
    let (contract_address, _) = contract.deploy(@calldata).unwrap();
    println!("-- Ludo contract deployed on: {:?}", contract_address);
    contract_address
}

#[test]
fn test_deploy_contracts() {
    deploy_ludo_contract();
}
