/* eslint-disable max-classes-per-file */
import { getMockedRev } from './utils'

const { Contract } = await import('@bitcoin-computer/lib')

export class Payment extends Contract {
  _id: string
  _rev: string
  _root: string
  _amount: number
  _owners: string[]

  constructor(owner: string, _amount: number) {
    super({ _owners: [owner], _amount })
  }

  transfer(to: string) {
    this._owners = [to]
  }
}

export class PaymentMock {
  _id: string
  _rev: string
  _root: string
  _amount: number
  _owners: string[]

  constructor(owner: string, amount: number) {
    this._id = getMockedRev()
    this._rev = getMockedRev()
    this._root = getMockedRev()
    this._owners = [owner]
    this._amount = amount
  }

  transfer(to: string) {
    this._owners = [to]
  }
}
