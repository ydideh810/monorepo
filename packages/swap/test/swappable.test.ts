/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-extraneous-dependencies */
import chai, { expect } from 'chai'
import chaiMatchPattern from 'chai-match-pattern'
import { Computer } from '@bitcoin-computer/lib'
import { Swappable } from '../src/swappable'

chai.use(chaiMatchPattern)
const _ = chaiMatchPattern.getLodashModule()

const RLTC: {
  network: 'regtest',
  chain: 'LTC',
  url: string
} = {
  network: 'regtest',
  chain: 'LTC',
  url: 'http://localhost:1031',
}

const meta = {
  _id: _.isString,
  _rev: _.isString,
  _root: _.isString,
  _owners: _.isArray,
  _amount: _.isNumber,
}

describe('Swapppable', () => {
  let a: Swappable
  let b: Swappable
  const alice = new Computer(RLTC)
  const bob = new Computer(RLTC)

  before('Before', async () => {
    // @ts-ignore
    await alice.faucet(0.01e8)
    // @ts-ignore
    await bob.faucet(0.001e8)
  })
  
  describe('Creating two NFTs to be swapped', () => {
    it("Alice creates a", async () => {
      a = await alice.new(Swappable, ['A', 'AAA'])
      // @ts-ignore
      expect(a).to.matchPattern({ ...meta, name: 'A', symbol: 'AAA', _owners: [alice.getPublicKey()] })

    })

    it("Bob creates b", async () => {
      b = await bob.new(Swappable, ['B', 'BBB'])
      // @ts-ignore
      expect(b).to.matchPattern({ ...meta, name: 'B', symbol: 'BBB', _owners: [bob.getPublicKey()] })
    })
  })

  describe('Executing a swap', async () => {
    let tx: any
    let txId: string

    it('Alice builds, funds, and signs a swap transaction', async () => {
      // @ts-ignore
      ;({ tx } = await alice.encode({
        exp: `a.swap(b)`,
        env: { a: a._rev, b: b._rev },
      }))
    })

    it('Bob signs the swap transaction', async () => {
      // @ts-ignore
      await bob.sign(tx)
    })

    it('Bob broadcasts the swap transaction', async () => {
      txId = await bob.broadcast(tx)
      expect(txId).not.undefined
    })

    it('a is now owned by Bob', async () => {
      const { env } = await bob.sync(txId) as { env: { a: Swappable, b: Swappable } }
      const aSwapped = env.a
      // @ts-ignore
      expect(aSwapped).to.matchPattern({ ...meta, name: 'A', symbol: 'AAA', _owners: [bob.getPublicKey()] })
    })

    it('b is now owned by Alice', async () => {
      const { env } = await alice.sync(txId) as { env: { a: Swappable, b: Swappable } }
      const bSwapped = env.b
      // @ts-ignore
      expect(bSwapped).to.matchPattern({ ...meta, name: 'B', symbol: 'BBB', _owners: [alice.getPublicKey()] })
    })
  })
})
