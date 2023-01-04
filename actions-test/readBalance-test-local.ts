import { TestRuntime } from "@tenderly/actions-test";
import { readBalance } from "../actions/readBalance";

const main = async () => {
  const testRuntime = new TestRuntime();

  testRuntime.context.storage.putJson("balance", "1" + "0".repeat(18));

  await testRuntime.execute(readBalance, require("./payloads/pay.json"));
};

(async () => await main())();
