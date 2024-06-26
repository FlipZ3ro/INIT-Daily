import { SWAP_CONSTANT } from '../constants/msg';
import {
  ethToInitArgs,
  initToEthArgs,
  initToTiaArgs,
  initToTucArgs,
  initToUsdcArgs,
  tiaToInitArgs,
  tucToInitArgs,
  usdcToInitArgs,
} from '../constants/swapArgs';
import { executeOrder } from '../lib/executeOrder';
import { getBalances } from '../lib/getBalances';
import { delay } from '../utils/utils';

export async function swap(
  executeState: { isSwapping: boolean; isStaking: boolean },
  UINIT_SWAP_AMOUNT: number,
  MAX_SWAP_ITERATION: number,
  swapOrder: number,
  swapIteration: number
) {
  if (executeState.isSwapping) {
    while (true) {
      console.log('Swapping Started. Initiating');
      console.log('Current swap iteration:', swapIteration);

      try {
        const { uusdc, utia, ueth, utuc } = await getBalances();
        console.log("Balances fetched:", { uusdc, utia, ueth, utuc });

        const initTo = [
          initToUsdcArgs(UINIT_SWAP_AMOUNT),
          initToTiaArgs(UINIT_SWAP_AMOUNT),
          initToEthArgs(UINIT_SWAP_AMOUNT),
          initToTucArgs(UINIT_SWAP_AMOUNT),
        ];

        const toInit = [
          usdcToInitArgs(uusdc),
          tiaToInitArgs(utia),
          ethToInitArgs(ueth),
          tucToInitArgs(utuc),
        ];

        if (swapOrder === 1) {
          console.log('INIT <> TOKEN');
          try {
            await executeOrder(initTo, initTo.length, SWAP_CONSTANT);
          } catch (error) {
            console.error("Error executing INIT <> TOKEN order:", error);
            throw new Error(error as string);
          }
          swapOrder++;
        } else {
          console.log('TOKEN <> INIT');
          try {
            await executeOrder(toInit, toInit.length, SWAP_CONSTANT);
          } catch (error) {
            console.error("Error executing TOKEN <> INIT order:", error);
            throw new Error(error as string);
          }
          swapOrder = 1;
        }

        swapIteration++;

        if (swapIteration > MAX_SWAP_ITERATION) {
          console.log('MAX_SWAP_ITERATION REACHED!');
          break;
        }

        console.log('Waiting 10 seconds for executing different order');
        await delay(10000);
      } catch (error) {
        console.error("Error during swap process:", error);
        break;
      }
    }

    executeState.isSwapping = false;
    executeState.isStaking = true;

    console.log('SWAPPING IS COMPLETE!');
  }
}
