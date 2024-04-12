/* eslint-disable max-classes-per-file */
import { NFT } from '@bitcoin-computer/TBC721'
import { Transaction } from '@bitcoin-computer/nakamotojs'
import { Buffer } from 'buffer'
import { Payment, PaymentMock } from './payment.js'

const { Contract } = await import('@bitcoin-computer/lib')

export class Sale extends Contract {
  static exec(a: NFT, b: NFT) {
    const [ownerA] = a._owners
    const [ownerB] = b._owners
    a.transfer(ownerB)
    b.transfer(ownerA)
    return [b, a]
  }
}

export class SaleHelper {
  computer: any
  mod?: string

  constructor(computer: any, mod?: string) {
    this.computer = computer
    this.mod = mod
  }

  async deploy() {
    this.mod = await this.computer.deploy(`export ${Sale}`)
    return this.mod
  }

  createSaleTx(nft: NFT, payment: Payment) {
    const { SIGHASH_SINGLE, SIGHASH_ANYONECANPAY } = Transaction
    return this.computer.encode({
      exp: `Sale.exec(nft, payment)`,
      env: { nft: nft._rev, payment: payment._rev },
      mocks: { payment },
      // eslint-disable-next-line no-bitwise
      sighashType: SIGHASH_SINGLE | SIGHASH_ANYONECANPAY,
      inputIndex: 0,
      fund: false,
      mod: this.mod,
    })
  }

  async checkSaleTx(tx: Transaction): Promise<number> {
    const { exp, env, mod } = await this.computer.decode(tx)
    if (exp !== 'Sale.exec(nft, payment)') throw new Error('Unexpected expression')
    if (mod !== this.mod) throw new Error('Unexpected module specifier')

    // As this is a mock for checking saleTx, it can be with any public key
    const payment = new PaymentMock(this.computer.getPublicKey(), tx.outs[0].value)
    env.payment = payment._rev

    const { SIGHASH_SINGLE, SIGHASH_ANYONECANPAY } = Transaction
    const {
      effect: { res: r, env: e },
    } = await this.computer.encode({
      exp,
      env,
      mod,
      mocks: { payment },
      fund: false,
      sign: false,
      // eslint-disable-next-line no-bitwise
      sighashType: SIGHASH_SINGLE | SIGHASH_ANYONECANPAY,
    })

    if (r === undefined) throw new Error('Unexpected result')
    if (Object.keys(e).toString() !== 'nft,payment') throw new Error('Unexpected environment')

    return tx.outs[0].value
  }

  static finalizeSaleTx(tx: Transaction, payment: Payment, scriptPubKey: Buffer) {
    const [paymentTxId, paymentIndex] = payment._rev.split(':')
    const index = parseInt(paymentIndex, 10)
    tx.updateInput(1, { txId: paymentTxId, index })
    tx.updateOutput(1, { scriptPubKey })
    return tx
  }
}
