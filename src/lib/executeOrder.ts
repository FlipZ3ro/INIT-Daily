import { MsgExecute } from '@initia/initia.js';
import { key } from '../config/initia';
import { MSG_EXECUTE_TYPE } from '../constants/msg';
import { attemptTx } from './attemptTx';

export async function executeOrder(
  orders: any[], // assuming each element is an array of arguments for MsgExecute
  orderLength: number,
  msgExecuteArgs: MSG_EXECUTE_TYPE
) {
  const { MODULE_ADDRESS, MODULE_NAME, FUNCTION_NAME, TYPE_ARGS } = msgExecuteArgs;

  try {
    for (let i = 0; i < orderLength; i++) {
      const args = orders[i];

      const msg = new MsgExecute(
        key.accAddress,
        MODULE_ADDRESS,
        MODULE_NAME,
        FUNCTION_NAME,
        TYPE_ARGS,
        args
      );

      await attemptTx(msg, i); // Assuming attemptTx takes MsgExecute and the order index
    }
  } catch (error) {
    console.error('Error executing order:', error);
    throw error;
  }
}
