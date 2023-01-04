import { ActionFn, Context } from "@tenderly/actions";
import { ethers } from "ethers";

const provider = new ethers.providers.JsonRpcProvider(
  "https://rpc.ankr.com/eth"
);

/**
 * @notice Reads the balance of the terminal contract and logs the change
 * @param context context passed by Tenderly
 */
export const readBalance: ActionFn = async (context: Context) => {
  const _jbV3EthTerminal = "0x594Cb208b5BB48db1bcbC9354d1694998864ec63";

  const balanceInWei = await provider.getBalance(_jbV3EthTerminal);
  const previousBalance = await context.storage.getJson("balance");
  await context.storage.putJson("balance", balanceInWei);

  console.log("current balance: " + balanceInWei);
  console.log(
    "balance change: " +
      ethers.BigNumber.from(previousBalance).sub(
        ethers.BigNumber.from(balanceInWei)
      )
  );
};
