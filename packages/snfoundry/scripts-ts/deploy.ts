import { deployContract, deployer, exportDeployments } from "./deploy-contract";

const deployScript = async (): Promise<void> => {
  await deployContract(
    {
      owner: deployer.address, // the deployer address is the owner of the contract
    },
    "MarquisCore"
  );
  await deployContract(
    {
      marquis_oracle_address: "0xDe3089d40F3491De794fBb1ECA109fAc36F889d0",
    },
    "Ludo"
  );
};

deployScript()
  .then(() => {
    exportDeployments();
    console.log("All Setup Done");
  })
  .catch(console.error);
