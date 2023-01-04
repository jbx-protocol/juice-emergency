import { TestRuntime, TestTransactionEvent } from "@tenderly/actions-test";
import { readBalance } from "../actions/readBalance";

const main = async () => {
  const testRuntime = new TestRuntime();

  testRuntime.context.storage.putJson("balance", "1" + "0".repeat(18));

  const te = new TestTransactionEvent();
  te.to = "0x1a22...";
  te.from = "0xc023...";

  await testRuntime.execute(readBalance, te);
};

(async () => await main())();
