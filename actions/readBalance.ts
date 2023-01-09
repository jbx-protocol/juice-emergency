import { ActionFn, Context, Event, BlockEvent } from "@tenderly/actions";
import { BigNumber, Contract, ethers } from "ethers";

import { abi as jbV3EthTerminalAbi } from "./artifacts/JBETHPaymentTerminal.json";

const provider = new ethers.providers.JsonRpcProvider(
  "https://rpc.ankr.com/eth"
);
const _jbV3EthTerminal: string = "0x594Cb208b5BB48db1bcbC9354d1694998864ec63";

/**
 * @notice Reads the balance of the terminal contract, parse the following event
 *         if the balance changed: Pay, RedeemTokens, AddToBalance, DistributePayouts, UseAllowance, Migrate
 *         trigger an alarm if the change in terminal balance is not reflected through the events
 * @param context context passed by Tenderly
 */
export const readBalance: ActionFn = async (context: Context, event: Event) => {
  const blockEvent = event as BlockEvent;
  const balanceInWei: BigNumber = await provider.getBalance(_jbV3EthTerminal);
  const previousBalance: BigNumber = ethers.BigNumber.from(
    await context.storage.getJson("balance")
  );

  // Store the current balance to compare during next run
  await context.storage.putJson("balance", balanceInWei);

  if (!balanceInWei.eq(previousBalance)) {
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

    // TODO: batch rpc calls

    // Query each filter, as ethers doesn't suppoort combining filters
    let payEvents = await terminalContract.queryFilter(
      terminalContract.filters.Pay(),
      blockEvent.blockNumber,
      blockEvent.blockNumber
    );

    let redeemEvents = await terminalContract.queryFilter(
      terminalContract.filters.RedeemTokens(),
      blockEvent.blockNumber,
      blockEvent.blockNumber
    );

    let addToBalanceEvents = await terminalContract.queryFilter(
      terminalContract.filters.AddToBalance(),
      blockEvent.blockNumber,
      blockEvent.blockNumber
    );

    let distributePayoutsEvents = await terminalContract.queryFilter(
      terminalContract.filters.DistributePayouts(),
      blockEvent.blockNumber,
      blockEvent.blockNumber
    );

    let useAllowanceEvents = await terminalContract.queryFilter(
      terminalContract.filters.UseAllowance(),
      blockEvent.blockNumber,
      blockEvent.blockNumber
    );

    let migrateEvents = await terminalContract.queryFilter(
      terminalContract.filters.Migrate(),
      blockEvent.blockNumber,
      blockEvent.blockNumber
    );

    // Count the amounts which should enter/leave the terminal:
    let cumSum = ethers.BigNumber.from("0");

    // -- Adding to the terminal --
    for (let i = 0; i < payEvents.length; i++) {
      cumSum = cumSum.add(payEvents[i].args?.amount);
    }

    for (let i = 0; i < addToBalanceEvents.length; i++) {
      cumSum = cumSum.add(addToBalanceEvents[i].args?.amount);
    }

    // -- Removing from the terminal --
    for (let i = 0; i < redeemEvents.length; i++) {
      cumSum = cumSum.sub(redeemEvents[i].args?.reclaimedAmount);
    }

    for (let i = 0; i < distributePayoutsEvents.length; i++) {
      // Counting if distributing to allocator or EOA only:
      if (distributePayoutsEvents[i].args?.projectId != 0)
        cumSum = cumSum.sub(distributePayoutsEvents[i].args?.amount);
    }

    for (let i = 0; i < useAllowanceEvents.length; i++) {
      cumSum = cumSum.sub(useAllowanceEvents[i].args?.amount);
    }

    for (let i = 0; i < migrateEvents.length; i++) {
      cumSum = cumSum.sub(migrateEvents[i].args?.amount);
    }

    // If the difference is not zero, trigger an alarm
    if (cumSum != balanceInWei) {
      await context.storage.putJson(
        "difference",
        balanceInWei.sub(previousBalance).sub(cumSum)
      );
    }

    console.log("cumSum: " + cumSum);
  }
};
