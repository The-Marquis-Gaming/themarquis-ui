![Logo Marquis](/packages/nextjs/public/wordmark.svg)

# 🎮 The Marquis

Welcome to **The Marquis**, an innovative online platform built with cutting-edge technology to deliver an exceptional gaming experience on both iOS and Android. Whether you're at home or on the go, enjoy seamless and engaging gameplay anytime, anywhere.

## 🚀 Project Overview

**The Marquis** leverages the power of the **Scaffold Stark** framework to provide a decentralized and secure gaming environment. Built on the Starknet blockchain, our platform ensures that all transactions are transparent, secure, and verifiable.

## 🛠️ Technologies Used

- **Flutter**: For building a high-performance, cross-platform mobile application that works flawlessly on both iOS and Android.
- **Rust**: For implementing efficient, low-level system logic that powers the backend of the platform.
- **Scaffold Stark**: The backbone of our decentralized architecture, Scaffold Stark provides us with the tools to build and deploy smart contracts on Starknet and to create user interfaces that interact seamlessly with these contracts.

## 🌟 Features

- **Seamless Gameplay**: Enjoy a fluid and engaging gaming experience across all your devices.
- **Decentralized Infrastructure**: Powered by Scaffold Stark, ensuring transparency and security in every transaction.
- **Cross-Platform Support**: Built with Flutter to provide a native experience on both iOS and Android.
- **Rust-Powered Backend**: Efficient, reliable, and secure backend services.
- **Smart Contract Integration**: Built on Starknet, ensuring your gameplay and transactions are secure and tamper-proof.

## 📦 Getting Started

To get started with The Marquis, follow these steps:

1. **Clone this repository:**

   ```bash
   git clone https://github.com/Quantum3-Labs/themarquis-ui.git
   ```

   ```
   Open command line and run
    cp packages/nextjs/.env.example packages/nextjs/.env
   ```

   ```
   Some important `environment variables` to change in .env file are
    a. Replace NEXT_PUBLIC_API_PRODUCTION_URL 
    b. Replace NEXT_PUBLIC_SEPOLIA_STARKNET_SCAN_URL (ask admin to get it) 
    ```

    Follow the README [here](https://github.com/Quantum3-Labs/themarquis-server/tree/develop) to run server
    and replace the server endpoint into NEXT_PUBLIC_API_PRODUCTION_URL

### Scarb version

To ensure the proper functioning of scaffold-stark, your local `Scarb` version must be `2.6.5`. To accomplish this, first check your local Scarb version:

```sh
scarb --version
```

If your local Scarb version is not `2.6.5`, you need to install it.

- Install Scarb `2.6.5` via `asdf` ([instructions](https://docs.swmansion.com/scarb/download.html#install-via-asdf)).

### Starknet Foundry version

To ensure the proper functioning of the tests on scaffold-stark, your Starknet Foundry version must be 0.25.0. To accomplish this, first check your Starknet Foundry version:

```sh
snforge --version
```

If your Starknet Foundry version is not `0.27.0`, you need to install it.

- Install Starknet Foundry `0.27.0` via `asdf` ([instructions](https://foundry-rs.github.io/starknet-foundry/getting-started/installation.html#installation-via-asdf)).

### RPC specific version

To ensure the proper functioning of the scaffold-stark with Testnet or Mainnet, your RPC version must be `0.7.1`. This repository contains a `.env.example` file, where we provided the default RPC URL for the Starknet Testnet: `RPC_URL_SEPOLIA=https://starknet-sepolia.public.blastapi.io/rpc/v0_7`. Let's verify this RPC version is `0.7.1` by calling a `POST` request in an API platform like `Postman` or `Insommia` . Your API endpoint should be `https://starknet-sepolia.public.blastapi.io/rpc/v0_7` and the body should be:

```json
{
 "jsonrpc":"2.0",
 "method":"starknet_specVersion",
 "id":1
}
```

## Compatible versions

- Scarb - v2.6.5
- Snforge - v0.27.0
- Cairo - v2.6.4
- Rpc - v0.7.1

2. Prepare your environment variables.

By default Scaffold-Stark 2 takes the first prefunded account from `starknet-devnet` as a deployer address, thus **you can skip this step!**. But if you want use the .env file anyway, you can fill the env variables related to devnet with any other predeployed contract address and private key from starknet-devnet.

> In case you want to deploy on Sepolia, you need to fill the envs related to sepolia testnet with your own contract address and private key.

```bash
cp packages/snfoundry/.env.example packages/snfoundry/.env
```

3. Run a local network in the first terminal.

> 💬 Hint: You can skip this step if you plan to use Sepolia Testnet.

```bash
yarn chain
```

This command starts a local Starknet network using Devnet. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `scaffold.config.ts` for your nextjs app.

> If you are on sepolia or mainnet, for a better user experience on your app, you can get a dedicated RPC from [Infura dashboard](https://www.infura.io/). A default is provided [here](https://github.com/Quantum3-Labs/scaffold-stark-2/tree/main/packages/nextjs/.env.example), in order to use this, you have to run `cp packages/nextjs/.env.example packages/nextjs/.env.local`

4. On a second terminal, deploy the sample contract:

```bash
yarn deploy
```

> To use `Sepolia` testnet, you input `yarn deploy --network sepolia`.

This command deploys a sample smart contract to the local network. The contract is located in `packages/snfoundry/contracts/src` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/snfoundry/scripts-ts/deploy.ts` to deploy the contract to the network. You can also customize the deploy script.

5. On a third terminal, start your NextJS app:

```bash
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your smart contract using the `Debug Contracts` page. You can tweak the app config in `packages/nextjs/scaffold.config.ts`.

## Documentation

Visit our [docs](https://www.docs.scaffoldstark.com/) to learn how to start building with Scaffold-Stark 2.

To know more about its features, check out our [website](https://scaffoldstark.com)

## Contributing to Scaffold-Stark 2

We welcome contributions to Scaffold-Stark 2!

Please see [CONTRIBUTING.MD](https://github.com/Quantum3-Labs/scaffold-stark-2/blob/main/CONTRIBUTING.md) for more information and guidelines for contributing to Scaffold-Stark 2.
