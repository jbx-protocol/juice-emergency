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

  const previousBalanceString = await context.storage.getJson("balance");
  const previousBalance: BigNumber = ethers.BigNumber.from(
    previousBalanceString != null ? previousBalanceString : "0"
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

    // TODO: double-check the amounts in events (net or with reserved part, if any?)

    const eventNames = [
      "Pay",
      "RedeemTokens",
      "AddToBalance",
      "DistributePayouts",
      "UseAllowance",
      "Migrate",
    ];

    // Query each filter, as ethers doesn't support combining filters
    let [
      payEvents,
      redeemEvents,
      addToBalanceEvents,
      distributePayoutsEvents,
      useAllowanceEvents,
      migrateEvents,
    ] = await Promise.all(
      eventNames.map((eventName) =>
        terminalContract.queryFilter(
          terminalContract.filters[eventName](),
          blockEvent.blockNumber,
          blockEvent.blockNumber
        )
      )
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
    if (cumSum != balanceInWei.sub(previousBalance)) {
      await context.storage.putJson(
        "difference-" + blockEvent.blockNumber,
        balanceInWei.sub(previousBalance).sub(cumSum)
      );

      await context.storage.putJson(
        "sum_events-" + blockEvent.blockNumber,
        cumSum
      );

      await context.storage.putJson(
        "terminal_balance-" + blockEvent.blockNumber,
        balanceInWei
      );

      await context.storage.putJson(
        "previous_balance-" + blockEvent.blockNumber,
        previousBalance
      );

      // Insert Discord hook or smth here
      console.log("cumSum: " + cumSum);
    }
  }
};
