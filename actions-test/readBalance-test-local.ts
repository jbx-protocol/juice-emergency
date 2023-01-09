//import { expect } from "chai";
import { TestRuntime } from "@tenderly/actions-test";
import { readBalance } from "../actions/readBalance";
import { BigNumber, ethers } from "ethers";

const _jbV3EthTerminal: string = "0x594Cb208b5BB48db1bcbC9354d1694998864ec63";

const main = async () => {
  const provider = new ethers.providers.JsonRpcProvider(
    "https://rpc.ankr.com/eth"
  );

  const testRuntime = new TestRuntime();
  const balanceInWei: BigNumber = await provider.getBalance(_jbV3EthTerminal);

  // We set an arbitrary previous balance
  testRuntime.context.storage.putJson(
    "balance",
    balanceInWei.add(1).toString()
  );

  // We initialize the difference to 0
  testRuntime.context.storage.putJson("difference", "0");

  // Execute the action based on a single transaction with a Pay event of 0xc6f3b40b6c0000
  await testRuntime.execute(readBalance, require("./payloads/pay.json"));

  console.log(await testRuntime.context.storage.getJson("difference"));
};

(async () => await main())();
