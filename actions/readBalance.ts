import { ActionFn, Context } from "@tenderly/actions";
import { BigNumber, Contract, ethers } from "ethers";

import { abi as jbV3EthTerminalAbi } from "./artifacts/JBETHPaymentTerminal.json";

const provider = new ethers.providers.JsonRpcProvider(
  "https://rpc.ankr.com/eth"
);

/**
 * @notice Reads the balance of the terminal contract, parse the following event
 *         if the balance changed: Pay, RedeemTokens, AddToBalance, DistributePayouts, UseAllowance, Migrate
 *         trigger an alarm if the change in terminal balance is not reflected through the events
 * @param context context passed by Tenderly
 */
export const readBalance: ActionFn = async (context: Context) => {
  const _jbV3EthTerminal: string = "0x594Cb208b5BB48db1bcbC9354d1694998864ec63";

  const balanceInWei: BigNumber = await provider.getBalance(_jbV3EthTerminal);
  const previousBalance: BigNumber = ethers.BigNumber.from(
    await context.storage.getJson("balance")
  );

  // Store the current balance to compare during next run
  await context.storage.putJson("balance", balanceInWei);

  if (balanceInWei != previousBalance) {
    console.log("balance changed!");
    console.log("current balance: " + balanceInWei);
    console.log("previous balance: " + previousBalance);
    console.log("Analyzing relevant events...");

    // We could use typechain but meh
    const terminalContract: Contract = new ethers.Contract(
      _jbV3EthTerminal,
      jbV3EthTerminalAbi,
      provider.getSigner(0)
    );

    let eventFilter = terminalContract.filters.Pay();
    let events = await terminalContract.queryFilter(
      eventFilter,
      "latest",
      "latest"
    );
    console.log(events);
  }
};
