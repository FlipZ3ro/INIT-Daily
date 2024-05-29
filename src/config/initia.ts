import { LCDClient, Wallet, RawKey } from '@initia/initia.js'
import dotenv from 'dotenv'

dotenv.config()

const PRIVATE_KEY = process.env.PRIVATE_KEY

if (!PRIVATE_KEY) {
  throw new Error("Private key is not defined in the environment variables.")
}

const privateKeyBuffer = Buffer.from(PRIVATE_KEY, 'hex') // Convert the private key string to buffer

const lcd = new LCDClient('https://lcd.initiation-1.initia.xyz', {
  chainId: 'initiation-1',
  gasPrices: '0.15uinit',
  gasAdjustment: '2.0',
})

const key = new RawKey(privateKeyBuffer) // Use the buffer to initialize the RawKey

const wallet = new Wallet(lcd, key)

export { lcd, key, wallet }
