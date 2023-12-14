<div align="center">
<img alt="starknet logo" src="https://github.com/Quantum3-Labs/TheMarquis-ui/blob/main/public/images/starknet-logo.png" width="200" >
  <h1 style="font-size: larger;">
    <img src="https://github.com/Quantum3-Labs/TheMarquis-ui/blob/main/public/images-game/100.png" width="30">
    <strong>The Marquis - Roulette</strong> 
    <img src="https://github.com/Quantum3-Labs/TheMarquis-ui/blob/main/public/images-game/100.png" width="30">
  </h1>

<a href="https://github.com/Quantum3-Labs/TheMarquis-ui">
<img src="https://img.shields.io/badge/Overview The Marquis UI-yellow"
/>

</a>
<a href="">
<img src="https://img.shields.io/twitter/follow/TheMarquis?style=social"/>
</a>

</div>

## Launch the Example with BOT

```console
curl -L https://install.dojoengine.org | bash
```

Followed by:

```console
dojoup -v v0.3.10
```

For an in-depth setup guide, consult the [Dojo book](https://book.dojoengine.org/getting-started/quick-start.html).

## STEP 1

then
After cloning the project, initialize the `smart contracts` submodule

```console
git submodule update --init
```

Now we have to run `katana` local host

### **Terminal 1 - Katana**:

```console
katana --disable-fee
```

### **Terminal 2 - Contracts**:

```console
cd TheMarquis-contracts && sozo build && sozo migrate
```

### **Terminal 3 - Torii**:

```console
cd TheMarquis-contracts && torii --world 0x6e31e6291f572cf76e11f1c99af8284f0d160f9f3af74e7e787a0f598bf0480
```

### **Auth**

```bash
cd scripts
```

```bash
 bash ./default_auth.sh
```

### **Front End**

```bash
cd ..
```

```bash
cd app && yarn && yarn run dev
```

### **Terminal 3 - Bot** (You have to go to the `bot` folder inside `TheMarquis-contratcs folder`)

```bash
cd bot && yarn
```

```bash
cp .env.example .env
```

```bash
node index.js
```

### Play Roulette and Mint (To update)

We can decide whether to stop the bot or not to better visualize the control of trx and events in katana.

Once the setup is complete, follow these steps to play Roulette, create a new Burner, and make a mint:

1. **Launch the Roulette Game:**

   - Visit the Roulette section in the application.
   - Choose the numbers you want to bet on.

2. **Create a New Burner:**

   - We click create, which will create the new burner

3. **Make a Mint:**

   - Initiate a mint operation to generate `1000` tokens for your Burner wallet.

4. **Place Your Bets:**

   - Once you've selected your amount and numbers, click on BET.

5. **Enjoy the Game:**

   - Head back to the Roulette game and have fun playing with your newly minted tokens!

---

## OPTION MANUAL (to update)

Repeat steps `1` - `2` - `3` - `4` - `6` and then

**initialize erc 20**

```bash
sozo execute 0x59bbd83d1178b7d10f7ffec372d4593283e9b5aa6075349834162deecfe5108 initialize --calldata 123,123,0x6e31e6291f572cf76e11f1c99af8284f0d160f9f3af74e7e787a0f598bf0480
```

**initialize actions**

```bash
sozo execute 0x6ba9e3effb660a56ae35dc1b8304be20c8bbf262997dc82d4c9052add1da097 initialize --calldata 0x59bbd83d1178b7d10f7ffec372d4593283e9b5aa6075349834162deecfe5108
```

**Front End**

You can create a burner from the front end and do the mint, or it can also be done manually.

**Mint Manual m_usd**

```bash
sozo execute 0x59bbd83d1178b7d10f7ffec372d4593283e9b5aa6075349834162deecfe5108 mint_ --calldata 0x517ececd29116499f4a1b64b094da79ba08dfd54a3edaa316134c41f8160973,10000,0
```

**Spawn Manual**

```bash
sozo execute 0x6ba9e3effb660a56ae35dc1b8304be20c8bbf262997dc82d4c9052add1da097 spawn
```

**Approve Manual**

```bash
sozo execute 0x59bbd83d1178b7d10f7ffec372d4593283e9b5aa6075349834162deecfe5108 approve --calldata 0x6ba9e3effb660a56ae35dc1b8304be20c8bbf262997dc82d4c9052add1da097,10000,0
```

**Bet Manual**

```bash
sozo execute 0x6ba9e3effb660a56ae35dc1b8304be20c8bbf262997dc82d4c9052add1da097 move --calldata 1,2,20,30,2,2,3
```
