export const nft = `class NFT extends Contract {
  constructor(data) {
    super({
      data,
    })
  }
  send(to) {
    this._owners = [to]
  }
}`

export const nftExpresion = `class NFT extends Contract {
  constructor(data) {
    super({
      data,
    })
  }
  send(to) {
    this._owners = [to]
  }
}
new NFT("some data")`

export const nftExport = `export class NFT extends Contract {
  constructor(data) {
    super({
      data,
    })
  }
  send(to) {
    this._owners = [to]
  }
}`

export const nftVars = [
  {
    name: "data",
    type: "string",
    placeholder: "some data",
  },
]

export const fungibleToken = `class Token extends Contract {
  constructor(supply, to) {
    super({
      tokens: supply,
      _owners: [to],
    })
  }
  send(amount, to) {
    if (this.tokens < amount) throw new Error()
    this._amount -= amount
    return new Token(amount, to)
  }
}`

export const fungibleTokenExpresion = `class Token extends Contract {
  constructor(supply, to) {
    super({
      tokens: supply,
      _owners: [to],
    })
  }
  send(amount, to) {
    if (this.tokens < amount) throw new Error()
    this._amount -= amount
    return new Token(amount, to)
  }
}
new Token(100, "Put a public key here")`

export const fungibleTokenExport = `export class Token extends Contract {
  constructor(supply, to) {
    super({
      tokens: supply,
      _owners: [to],
    })
  }
  send(amount, to) {
    if (this.tokens < amount) throw new Error()
    this._amount -= amount
    return new Token(amount, to)
  }
}`

export const tokenVars = [
  {
    name: "supply",
    type: "number",
    placeholder: 100,
  },
  {
    name: "to",
    type: "string",
    placeholder: "Put a public key here",
  },
]

export const chat = `class Chat extends Contract {
  constructor() {
    super({ messages: [] })
  }
  invite(pubKey) {
    this._owners.push(pubKey)
  }
  post(message) {
    this.messages.push(message)
  }
}`

export const chatExpresion = `class Chat extends Contract {
  constructor() {
    super({ messages: [] })
  }
  invite(pubKey) {
    this._owners.push(pubKey)
  }
  post(message) {
    this.messages.push(message)
  }
}
new Chat()`

export const chatExport = `export class Chat extends Contract {
  constructor() {
    super({ messages: [] })
  }
  invite(pubKey) {
    this._owners.push(pubKey)
  }
  post(message) {
    this.messages.push(message)
  }
}`

export const chatVars = []

export const counter = `class Counter extends Contract {
  constructor() {
    super({ n: 0 })
  }
  inc() {
    this.n += 1
  }
  dec() {
    this.n -= 1
  }
  getVal() {
    return this.n
  }
}`

export const counterExpresion = `class Counter extends Contract {
  constructor() {
    super({ n: 0 })
  }
  inc() {
    this.n += 1
  }
  dec() {
    this.n -= 1
  }
  getVal() {
    return this.n
  }
}
new Counter()`

export const counterExport = `export class Counter extends Contract {
  constructor() {
    super({ n: 0 })
  }
  inc() {
    this.n += 1
  }
  dec() {
    this.n -= 1
  }
  getVal() {
    return this.n
  }
}`

export const counterVars = []
