//import { expect } from "chai";
import { TestRuntime } from "@tenderly/actions-test";
import { readBalance } from "../actions/readBalance";
import { BigNumber, ethers } from "ethers";

import { abi as jbV3EthTerminalAbi } from "../actions/artifacts/JBETHPaymentTerminal.json";
import payPayload from "./payloads/pay.json";
import distributePayoutPayload from "./payloads/distributePayouts.json";

const _jbV3EthTerminal: string = "0x594Cb208b5BB48db1bcbC9354d1694998864ec63";

import { expect } from "chai";

describe("readBalance()", () => {
  let provider: ethers.providers.JsonRpcProvider;
  let testRuntime: TestRuntime;
  let terminalContract: ethers.Contract;

  before(async () => {
    provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/eth");
    terminalContract = new ethers.Contract(
      _jbV3EthTerminal,
      jbV3EthTerminalAbi,
      provider.getSigner(0)
    );
  });

  beforeEach(() => {
    testRuntime = new TestRuntime();
  });

  it("Should not log anything if terminal balance does not change", async () => {
    const currentBalanceInWei: BigNumber = await provider.getBalance(
      _jbV3EthTerminal
    );

    // Previous balance is the same as current balance
    await testRuntime.context.storage.putJson(
      "balance",
      currentBalanceInWei.toString()
    );

    // Execute the action based on a single transaction with a Pay event of 0xc6f3b40b6c0000
    await testRuntime.execute(readBalance, payPayload);

    const balanceAfterTransaction: BigNumber = ethers.BigNumber.from(
      await testRuntime.context.storage.getJson("balance")
    );

    expect(balanceAfterTransaction).to.eql(currentBalanceInWei);
    expect(
      await testRuntime.context.storage.getJson(
        "difference-" + payPayload.blockNumber
      )
    ).to.be.empty;
  }).timeout(50000);

  it.only(
    "Should log a change in the terminal balance, if the event cum sum is not consistent with it",
    async () => {
      const currentBalanceInWei: BigNumber = await provider.getBalance(
        _jbV3EthTerminal
      );

      // We set an arbitrary previous balance, 100 wei less than current
      testRuntime.context.storage.putJson(
        "balance",
        currentBalanceInWei.sub(100).toString()
      );

      // The transaction payload value
      console.log(terminalContract.address);
      console.log(payPayload);
      console.log(await provider.getBlockNumber());

      // Execute the action based on a single transaction with a Pay event of 0xc6f3b40b6c0000
      await testRuntime.execute(readBalance, distributePayoutPayload);

      console.log(
        await testRuntime.context.storage.getJson(
          "difference-" + (await provider.getBlockNumber())
        )
      );
      console.log(await provider.getBlockNumber());
      expect(
        await testRuntime.context.storage.getJson(
          "difference-" + payPayload.blockNumber
        )
      ).to.eql("100");
    }
  ).timeout(50000);
});