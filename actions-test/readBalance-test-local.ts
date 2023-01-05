//import { expect } from "chai";
import { TestRuntime } from "@tenderly/actions-test";
import { readBalance } from "../actions/readBalance";

const main = async () => {
  const testRuntime = new TestRuntime();

  // We set an arbitrary previous balance
  testRuntime.context.storage.putJson("balance", "1343556667419709741021");

  // Execute the action based on a single transaction with a
  await testRuntime.execute(readBalance, require("./payloads/pay.json"));

  console.log(await testRuntime.context.storage.getJson("difference"));
};

(async () => await main())();
