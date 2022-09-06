!function(t,e,r,n,s,o,i,c,a,u,d){"use strict";function l(t){return t&&"object"==typeof t&&"default"in t?t:{default:t}}function h(t){if(t&&t.__esModule)return t;var e=Object.create(null);return t&&Object.keys(t).forEach((function(r){if("default"!==r){var n=Object.getOwnPropertyDescriptor(t,r);Object.defineProperty(e,r,n.get?n:{enumerable:!0,get:function(){return t[r]}})}})),e.default=t,Object.freeze(e)}var p=l(e);var f=l(r);var g=l(s);var v=l(o);var m=h(i);var b=l(a);function w(t,e){var r={};for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&e.indexOf(n)<0&&(r[n]=t[n]);if(null!=t&&"function"==typeof Object.getOwnPropertySymbols){var s=0;for(n=Object.getOwnPropertySymbols(t);s<n.length;s++)e.indexOf(n[s])<0&&Object.prototype.propertyIsEnumerable.call(t,n[s])&&(r[n[s]]=t[n[s]])}return r}function y(t,e,r,n){return new(r||(r=Promise))((function(s,o){function i(t){try{a(n.next(t))}catch(t){o(t)}}function c(t){try{a(n.throw(t))}catch(t){o(t)}}function a(t){var e;t.done?s(t.value):(e=t.value,e instanceof r?e:new r((function(t){t(e)}))).then(i,c)}a((n=n.apply(t,e||[])).next())}))}const{CHAIN:_,NETWORK:x,BCN_URL:O,RPC_USER:j,RPC_PASSWORD:S,TEST_MNEMONICS:C}=process.env;const $=_||"LTC";const E=x||"testnet";const T=O||"https://node.bitcoincomputer.io";const I=parseInt(process.env.BC_DUST_LIMIT||"",10)||("LTC"===$?15460:1546);const{crypto:k}=p.default.bitcore;const A=(t,e)=>{const r=Date.now();const n=k.Hash.sha256(Buffer.from(e+r));const s=[k.ECDSA.sign(n,t,"big").toString("hex"),t.publicKey.toString(),r];return`Bearer ${Buffer.from(s.join(":")).toString("base64")}`};class K{constructor(t=T,e=new p.default.bitcore.PrivateKey,r={}){this.baseUrl=t,this.headers=r,this.privateKey=e}get(t){return y(this,void 0,void 0,(function*(){const e=this.privateKey?{Authentication:A(this.privateKey,this.baseUrl)}:{};return(yield f.default.get(`${this.baseUrl}${t}`,{headers:Object.assign(Object.assign({},this.headers),e)})).data}))}post(t,e){return y(this,void 0,void 0,(function*(){const r=this.privateKey?{Authentication:A(this.privateKey,this.baseUrl)}:{};return(yield f.default.post(`${this.baseUrl}${t}`,e,{headers:Object.assign(Object.assign({},this.headers),r)})).data}))}delete(t){return y(this,void 0,void 0,(function*(){const e=this.privateKey?{Authentication:A(this.privateKey,this.baseUrl)}:{};return(yield f.default.delete(`${this.baseUrl}${t}`,{headers:Object.assign(Object.assign({},this.headers),e)})).data}))}}parseInt(process.env.BC_DEFAULT_FEE||"",10),parseInt(process.env.BC_SCRIPT_CHUNK_SIZE||"",10);const R=2e4;parseInt(process.env.MWEB_HEIGHT||"",10);const{PublicKey:P,crypto:U}=p.default.bitcore;const{Point:B}=U;function H(t){return Buffer.from(t,"hex").toString().replace(/\0/g,"")}function D(t,e){return t.slice(e)+t.slice(0,e)}function N(t,e,r){if(t.length*Math.log2(e)>53)throw new Error(`Input too large ${t.length} ${Math.log2(e)}`);if(![2,10,16].includes(e)||![2,10,16].includes(r))throw new Error("ToBase or FromBase invalid in covertNumber.");if(2===e&&t.length%8!=0)throw new Error("Binary strings must be byte aligned.");if(16===e&&t.length%2!=0)throw new Error("Hex strings must be of even length.");const n=parseInt(t,e).toString(r);return 2===r?n.padStart(8*Math.ceil(n.length/8),"0"):16===r?n.padStart(2*Math.ceil(n.length/2),"0"):n}function M(t,e){const r=new RegExp(`.{1,${e}}`,"g");return t.match(r)||[]}function F(t){return M(t,2).map((t=>N(t,16,2))).join("")}function L(t){return M(t,8).map((t=>N(t,2,16))).join("")}function z(t){return t.toString(16).padStart(3,"0")}function J(t){return parseInt(t,16)}function W(t){if(62!==t.length)throw new Error("Input to hexToPublicKey must be of length 62");let e=!1;let r=0;let n;for(;!e;){if(r>=256)throw new Error("Something went wrong storing data");const s=r.toString(16).padStart(2,"0")+L(D(F(t).padStart(64,"0"),r));try{n=B.fromX(!1,s),e=!0}catch(t){r+=1}}if(!n)throw new Error("Something went wrong storing data");return new P(n)}function q(t){const e=t.point.getX().toString("hex").padStart(64,"0");const r=N(e.slice(0,2),16,10);return L((s=parseInt(r,10),(n=F(e.slice(2))).slice(-s)+n.slice(0,-s)));var n,s}function G(t=$,e=E){if("testnet"===e||"regtest"===e)return 1;if("BTC"===t)return 0;if("LTC"===t)return 2;if("DOGE"===t)return 3;if("BCH"===t)return 145;if("BSV"===t)return 236;throw new Error(`Unsupported chain ${t}`)}function Y({chain:t=$,network:e=E}={}){return function({purpose:t=44,coinType:e=2,account:r=0}={}){return`m/${t.toString()}'/${e.toString()}'/${r.toString()}'`}({coinType:G(t,e)})}function V(t,e){const r=function(t,e){return((t,e,r={})=>{const{path:n="m/44'/0'/0'/0",passphrase:s=""}=r;let o=t.toHDPrivateKey(s,e);return n&&(o=o.deriveChild(n)),o.privateKey})(new p.default("replace this seed"),e,{path:Y({chain:t,network:e}),passphrase:""})}(t,e);return P.fromPrivateKey(r)}function X({mnemonic:t=new p.default,path:e=Y(),passphrase:r="",network:n=E}){return t.toHDPrivateKey(r,n).deriveChild(e)}function Z(t){return{smartArgs:t.filter((t=>t._rev)),dumbArgs:t.map((t=>t._rev?"__":t))}}function Q(t){return/^[0-9A-Fa-f]{64}\/\d+$/.test(t)}function tt(t){if(!/^[0-9A-Fa-f]{64}$/.test(t))throw new Error(`Invalid txId: ${t}`)}function et(t){if(!/^[0-9A-Fa-f]{64}\/\d+$/.test(t))throw new Error(`Invalid outId: ${t}`)}function rt(t){et(t);const[e,r]=t.split("/");return{txId:e,outputIndex:parseInt(r,10)}}const nt=t=>t.startsWith("./")||t.startsWith("../")||"."===t||".."===t;const{Transaction:st}=p.default.bitcore;const{UnspentOutput:ot}=st;class it{constructor({chain:t,network:e,mnemonic:r,path:n,passphrase:s,url:o}={}){if(this.chain=t?t.toUpperCase():$,this.network=e?e.toLowerCase():E,this.mnemonic=new p.default(r?r.toString():void 0),this.path=n||Y({chain:this.chain,network:this.network}),this.passphrase=s||"",this.bcn=new K(o,this.privateKey),!["LTC","BTC"].includes(this.chain))throw new Error("We currently only support LTC, support for other currencies will be added soon.");if(!["mainnet","testnet","regtest"].includes(this.network))throw new Error("Please set 'network' to 'regtest', 'testnet', or 'mainnet'")}get privateKey(){return X(this).privateKey}getBalance(t){return y(this,void 0,void 0,(function*(){const{chain:e,network:r}=this;return yield this.bcn.get(`/v1/${e}/${r}/address/${t}/balance`)}))}getTransactions(t){return y(this,void 0,void 0,(function*(){return(yield this.getRawTxs(t)).map((t=>new st(t)))}))}getRawTxs(t){return y(this,void 0,void 0,(function*(){t.map(tt);const{chain:e,network:r}=this;return this.bcn.post(`/v1/${e}/${r}/tx/bulk/`,{txIds:t})}))}sendTransaction(t){return y(this,void 0,void 0,(function*(){return this.bcn.post(`/v1/${this.chain}/${this.network}/tx/send`,{rawTx:t})}))}getUtxosByAddress(t){return y(this,void 0,void 0,(function*(){const{chain:e,network:r}=this;return(yield this.bcn.get(`/v1/${e}/${r}/wallet/${t.toString()}/utxos`)).map((({rev:t,scriptPubKey:e,satoshis:r})=>{const[n,s]=t.split("/");return new ot({txId:n,outputIndex:parseInt(s,10),satoshis:r,script:e})}))}))}query({publicKey:t,classHash:e}){return y(this,void 0,void 0,(function*(){if(void 0===t&&void 0===e)throw new Error("Query parameters cannot be empty.");let r="";t&&(r+=`?publicKey=${t}`),e&&(r+=0===r.length?"?":"&",r+=`classHash=${e}`);const{chain:n,network:s}=this;return this.bcn.get(`/v1/${n}/${s}/non-standard-utxos${r}`)}))}idsToRevs(t){return y(this,void 0,void 0,(function*(){t.map(et);const{chain:e,network:r}=this;return this.bcn.post(`/v1/${e}/${r}/revs`,{ids:t})}))}rpc(t,e){return y(this,void 0,void 0,(function*(){return this.bcn.post(`/v1/${this.chain}/${this.network}/rpc`,{method:t,params:e})}))}static getSecretOutput({_url:t,privateKey:e}){return y(this,void 0,void 0,(function*(){const r=t.split("/");const n=r[r.length-1];const s=r.slice(0,-2).join("/");const o=new K(s,e);return{host:s,data:yield o.get(`/v1/store/${n}`)}}))}static setSecretOutput({secretOutput:t,host:e,privateKey:r}){return y(this,void 0,void 0,(function*(){return new K(e,r).post("/v1/store/",t)}))}static deleteSecretOutput({_url:t,privateKey:e}){return y(this,void 0,void 0,(function*(){const r=t.split("/");const n=r[r.length-1];const s=r.slice(0,-2).join("/");const o=new K(s,e);yield o.delete(`/v1/store/${n}`)}))}get url(){return this.bcn.baseUrl}}const{PublicKey:ct,Script:at}=p.default.bitcore;function ut(t,e,r,n){if(t.length>3)throw new Error("Too many owners");return function(t,e,r,n){const s=n?[...t,V(e,r).toBuffer()]:t;const o=new at;return o.add("OP_1"),s.forEach((t=>{o.add(t)})),o.add(`OP_${s.length}`),o.add("OP_CHECKMULTISIG"),o}(t.map((t=>t.toBuffer())),e,r,n)}function dt(t,e){return function(t,e){const r=t.chunks.filter((t=>t.buf));return(e?r.slice(0,-1):r).map((t=>t.buf))}(t,e).map((t=>ct.fromBuffer(t)))}function lt(t){return Buffer.from(v.default.SHA256(t).toString(),"hex").toString("hex").substr(0,4)}function ht(t){return`${lt(t)};${t}`}function pt(t){const e=t.substr(0,4);const r=t.substr(5);if(!function(t,e){return lt(t)===e}(r,e))throw new Error("Decryption failure");return r}function ft(t){if(void 0!==t._readers){const{_readers:e,_url:r,_owners:n,_amount:s}=t,o=w(t,["_readers","_url","_owners","_amount"]);const i=function(t,e){const r=g.default.randomBytes(32).toString("hex");const n=function(t,e){if(!/^[0-9a-f]{64}$/.test(e))throw new Error("Invalid secret");const r=Buffer.from(e,"hex").toString("binary");const n=ht(t);return v.default.AES.encrypt(n,r).toString()}(t,r);const s=e.map((t=>function(t,e){if(!/^0[2-3][0-9a-f]{64}|04[0-9a-f]{128}$/.test(e))throw new Error("Invalid publicKey");const r=ht(t);return m.encrypt(e,Buffer.from(r,"utf8")).toString("base64")}(r,t)));return{__cypher:n,__secrets:s}}(JSON.stringify(o),e);return void 0!==r&&(i._url=r),void 0!==n&&(i._owners=n),void 0!==s&&(i._amount=s),i}return t}const{Transaction:gt}=p.default.bitcore;const{Output:vt,UnspentOutput:mt}=gt;class bt{constructor({restClient:t=new it}={}){this.tx=new gt,this.tx.feePerKb(R),this.outData=[],this.restClient=t}get txId(){return this.tx.id}get chain(){return this.restClient.chain}get network(){return this.restClient.network}get inputs(){return this.tx.inputs.map((t=>`${t.prevTxId.toString("hex")}/${t.outputIndex}`))}get inRevs(){const{enc:t}=this;let[e]=t;return e=Number.isFinite(e)?e:0,this.tx.inputs.slice(0,e).map((({prevTxId:t,outputIndex:e})=>`${t.toString("hex")}/${e}`))}get outRevs(){const{enc:t}=this;let[,e]=t;return e=Number.isFinite(e)?e:0,Array.from(Array(e).keys()).map((t=>`${this.tx.id}/${t}`))}get opReturns(){try{const{outputs:t}=this.tx;return t.filter((({script:t})=>t.isDataOut())).map((({script:t})=>t.getData())).map((t=>t.toString())).join()}catch(t){return""}}get enc(){return M(this.opReturns.slice(0,9),3).map(J)}get dataPrefix(){return this.opReturns.slice(9)}isFullyFunded(){return this.tx._getInputAmount()-this.tx._getOutputAmount()>=this.tx.getFee()}getOwnerOutputs(){const{enc:t}=this;const[,e=0]=t;return this.tx.outputs.slice(0,e)}getDataOutputs(){const{enc:t}=this;const[,e,r]=t;return this.tx.outputs.slice(e,r)}getOutData(){return y(this,void 0,void 0,(function*(){try{const t=this.getDataOutputs().map((t=>t.script)).map((t=>dt(t,!0))).flat().map(q).map(H).join("");const{dataPrefix:e}=this;const r=JSON.parse(e+t);const n=this.restClient.privateKey.toBuffer().toString("hex");const s=this.getOwnerOutputs();if(s.length!==r.length)throw new Error("Inconsistent state");const o=s.map(((t,e)=>Object.assign(Object.assign({},r[e]),{_owners:dt(t.script,!1).map((t=>t.toString())),_amount:t.satoshis})));return Promise.all(o.map((t=>y(this,void 0,void 0,(function*(){try{const e=yield function(t){return e=>y(this,void 0,void 0,(function*(){if(function(t){return void 0!==t._url}(e)){const{_url:r}=e,n=w(e,["_url"]);const{host:s,data:o}=yield it.getSecretOutput({_url:r,privateKey:t});return Object.assign(Object.assign(Object.assign({},n),JSON.parse(o)),{_url:s})}return e}))}(this.restClient.privateKey)(t);return function(t,e){if(function(t){return void 0!==t.__cypher&&void 0!==t.__secrets}(t)){const{__cypher:r,__secrets:n}=t,s=w(t,["__cypher","__secrets"]);return Object.assign(Object.assign(Object.assign({},s),JSON.parse(function({__cypher:t,__secrets:e},r){let n="";if(r.forEach((r=>{e.forEach((e=>{try{const s=function(t,e){if(!/^[0-9a-f]{64}$/.test(e))throw new Error("Invalid privateKey");return pt(m.decrypt(e,Buffer.from(t,"base64")).toString("utf8"))}(e,r);n=function(t,e){if(!/^[0-9a-f]{64}$/.test(e))throw new Error("Invalid secret");const r=Buffer.from(e,"hex").toString("binary");return pt(v.default.AES.decrypt(t,r).toString(v.default.enc.Utf8))}(t,s)}catch(t){const e=["Decryption failure","Unsupported state or unable to authenticate data"];if(t instanceof Error&&!e.includes(t.message))throw t}}))})),n)return n;throw new Error("Decryption failure")}({__cypher:r,__secrets:n},e))),{_readers:[]})}return t}(e,[n])}catch(t){return null}})))))}catch(t){return[]}}))}getOwners(){return this.getOwnerOutputs().map((t=>dt(t.script,!1).map((t=>t.toString()))))}getAmounts(){return this.getOwnerOutputs().map((t=>t.satoshis))}spendFromData(t){return y(this,void 0,void 0,(function*(){if(!t.length)return;const e=t.map(rt);const r=e.map((t=>t.txId));const n=yield this.restClient.getTransactions(r);for(let t=0;t<e.length;t+=1){const{txId:r,outputIndex:s}=e[t];const{outputs:o}=n[t];const i=o[s];const c=Math.round(i.satoshis);const a=new p.default.bitcore.Script(i.script);const u=new mt({txId:r,outputIndex:s,satoshis:c,script:a});const d=dt(a,!1).map((t=>t.toString()));this.tx.from([u],d,1,{noSorting:!0})}}))}createDataOuts(t){t.forEach((({_amount:t,_owners:e=[]})=>{if(Array.isArray(e)&&e.length>3)throw new Error("Too many owners.");const r=e.map((t=>p.default.bitcore.PublicKey.fromString(t)));const n=t||I;const s=ut(r,this.chain,this.network,!1);this.tx.addOutput(new vt({script:s,satoshis:n}))}));const e=t.map((t=>w(t,["_amount","_owners"])));const r=I;const n=JSON.stringify(e);const s=n.slice(0,71);const o=function(t,e,r,n){var s;return function(t,e){const r=[];for(let e=0;e<t.length;e+=2)r.push(t.slice(e,e+2));return r}(M((s=t,Buffer.from(s).toString("hex")),62).map((t=>t.padStart(62,"0"))).map(W)).map((t=>ut(t,e,r,!0)))}(n.slice(71),this.chain,this.network);const i=z(this.tx.inputs.length)+z(this.tx.outputs.length)+z(this.tx.outputs.length+o.length);o.forEach((t=>{this.tx.addOutput(new vt({script:t,satoshis:r}))})),this.tx.addData(i+s)}static fromTxHex({hex:t="",restClient:e=new it}){return y(this,void 0,void 0,(function*(){let r=[];let n=[];let s=[];const o=new this({restClient:e});o.tx.fromString(t);try{r=yield o.getOutData()}catch(t){}try{n=o.getOwners()}catch(t){}try{s=o.getAmounts()}catch(t){}return o.outData=r.map(((t,e)=>Object.assign(Object.assign({},t),{_owners:n[e],_amount:s[e]}))),o}))}static fromTxId({txId:t="",restClient:e=new it}){return y(this,void 0,void 0,(function*(){const[r]=yield e.getRawTxs([t]);return this.fromTxHex({hex:r,restClient:e})}))}}class wt{constructor(t={}){this.restClient=new it(t)}derive(t="0"){const e=`${this.path}${this.path.length>0?"/":""}${t}`;const{chain:r,network:n,url:s,mnemonic:o,passphrase:i}=this.restClient;return new wt({chain:r,network:n,url:s,mnemonic:o.toString(),path:e,passphrase:i})}getBalance(){return y(this,void 0,void 0,(function*(){return this.restClient.getBalance(this.address)}))}getUtxosByAmount(t){return y(this,void 0,void 0,(function*(){const e=yield this.restClient.getUtxosByAddress(this.address);let r=0;const n=[];!function(t){const e=t;for(let t=e.length-1;t>0;t-=1){const r=Math.floor(Math.random()*(t+1));[e[t],e[r]]=[e[r],e[t]]}}(e);for(const s of e)if(r+=s.satoshis,n.push(s),r>=t)return n;const{network:s,chain:o}=this.restClient;const i=this.address.toString();throw new Error(`Insufficient balance in address ${i} on ${s} ${o}. Found ${r}, required ${t}.`)}))}fundAndSendTx(t){return y(this,void 0,void 0,(function*(){t.tx.feePerKb(4e4);const e=t.tx.outputs.length;const{chain:r,network:n}=this.restClient;t.tx.to(function(t,e){const r={"any-testnet":"uTKUDCkpo12vstJBsMWmrTPz9wFE6DuzGH","BTC-mainnet":"igpnnoLziUyxtQuWYCP13gHYVhUru6iLaY","LTC-mainnet":"t77o829ngHnuUorwDkf129fL6ERLFNqKG8","DOGE-mainnet":"XfNRUdvrv6uCDbCF5xJ18UYwVkkefkXvEd","BCH-mainnet":"CSAkkS8Mro9mYRqhksS1FyYrsnSE5MVQ5m"};return D("testnet"===e||"regtest"===e?r["any-testnet"]:r[`${t}-${e}`],19)}(r,n),0);const s=yield this.restClient.getUtxosByAddress(this.address);if(t.tx.change(this.address),0===s.length)throw new Error(`Insufficient balance in address ${this.address}.`);let o=0;let i=0;let c=0;do{const[e]=s.splice(0,1);t.tx.from([new p.default.bitcore.Transaction.UnspentOutput(e)]),t.tx.sign(this.privateKey,1),i=t.tx.toString().length,t.tx.fee(i*R*2),t.tx._updateChangeOutput(),c=t.tx._getInputAmount()-t.tx._getOutputAmount(),o=c/i*1e3}while(0!==s.length&&o<4e4);if(o<4e4&&0===s.length)throw new Error(`Insufficient balance in address ${this.address}. Current fee_per_kb ${o}. Fee ${c}. Utxo set size ${s.length}. CTransaction size ${i} Inputs ${JSON.stringify(t.tx.inputs,null,2)} Outpus ${JSON.stringify(t.tx.outputs,null,2)}`);if(i=t.tx.toString().length,c=Math.max(Math.ceil(i/1e3*R),I),t.tx.fee(c),t.tx.outputs[e].satoshis=c,t.tx._outputAmount=void 0,t.tx.feePerKb(R),t.tx._outputAmount=void 0,t.tx._updateChangeOutput(),!1===t.isFullyFunded()||!1===t.tx.verify())throw new Error(`Something went wrong. Address ${this.address}. Transaction: ${JSON.stringify(t.tx,null,2)}`);return t.tx.sign(this.privateKey,1),this.restClient.sendTransaction(t.tx.toString())}))}send(t,e){return y(this,void 0,void 0,(function*(){const{restClient:r}=this;const n=new bt({restClient:r});return n.tx.to(e,t),this.fundAndSendTx(n)}))}get hdPrivateKey(){return X(this.restClient)}get privateKey(){return this.hdPrivateKey.privateKey}get publicKey(){return this.hdPrivateKey.publicKey}get passphrase(){return this.restClient.passphrase}get path(){return this.restClient.path}get chain(){return this.restClient.chain}get network(){return this.restClient.network}get url(){return this.restClient.url}get mnemonic(){return this.restClient.mnemonic}get address(){return this.publicKey.toAddress(this.restClient.network)}}class yt{constructor(t={}){this.wallet=new wt(t)}fromTxHex(t){return y(this,void 0,void 0,(function*(){const{restClient:e}=this.wallet;return bt.fromTxHex({hex:t,restClient:e})}))}fromTxId(t){return y(this,void 0,void 0,(function*(){const[e]=yield this.wallet.restClient.getRawTxs([t]);return this.fromTxHex(e)}))}get(t){return y(this,void 0,void 0,(function*(){const e=t.map(rt);return Promise.all(e.map((({txId:t,outputIndex:e})=>y(this,void 0,void 0,(function*(){const{outData:r}=yield this.fromTxId(t);if(e>r.length)throw new Error("Index out of bounds");return r[e]})))))}))}put(t){return this.update([],t)}createTx(t,e){return y(this,void 0,void 0,(function*(){const{wallet:r}=this;const{restClient:n}=r;const s=new bt({restClient:n});const{privateKey:o,publicKey:i}=r;const c=e.map((t=>{var{_owners:e}=t,r=w(t,["_owners"]);return Object.assign({_owners:e||[i.toString()]},r)})).map(ft);const a=yield Promise.all(c.map(function(t){return e=>y(this,void 0,void 0,(function*(){if(void 0!==e._url){const{_url:r,_owners:n,_amount:s}=e,o=w(e,["_url","_owners","_amount"]);const i=yield it.setSecretOutput({host:r,secretOutput:{data:JSON.stringify(o)},privateKey:t});return void 0!==n&&(i._owners=n),void 0!==s&&(i._amount=s),i}return e}))}(o)));return yield s.spendFromData(t),yield s.createDataOuts(a),s}))}update(t,e){return y(this,void 0,void 0,(function*(){const r=yield this.createTx(t,e);return yield this.wallet.fundAndSendTx(r),r.outRevs}))}}const _t=["_id","_rev","_owners","_amount","_readers","_url","__vouts","__func","__index","__args"];const xt=t=>(Object.prototype.toString.call(t).match(/\s([a-zA-Z]+)/)||[])[1];const Ot=t=>"object"==typeof t?xt(t):xt(t).toLowerCase();const jt=t=>["number","string","boolean","undefined","Null"].includes(Ot(t));const St=t=>"Array"===Ot(t);const Ct=t=>"Object"===Ot(t);const $t=t=>jt(t)||["Array","Object"].includes(Ot(t));const Et=(t,e)=>{if(!$t(t)||!$t(e))throw new Error(`Unsupported data types for deep equals: ${Ot(t)} & ${Ot(e)}`);if(Ot(t)!==Ot(e))return!1;if(jt(t)&&jt(e))return t===e;const r=(t,e)=>Object.entries(t).every((([t,r])=>Et(e[t],r)));return t&&e&&r(t,e)&&r(e,t)};const Tt=t=>{if(jt(t))return t;if(St(t))return t.map(Tt);if(Ct(t)){const e=Object.keys(t).reduce(((e,r)=>(e[r]=Tt(t[r]),e)),{});const r=Object.create(Object.getPrototypeOf(t));return Object.assign(r,e)}throw new Error(`Unsupported data type for clone: ${Ot(t)}`)};const It=(t,e)=>Object.fromEntries(Object.entries(t).map((t=>e(t))));const kt=(t,e)=>It(t,(([t,r])=>[t,e(r)]));const At=(t,e)=>Object.fromEntries(Object.entries(t).filter((t=>e(t))));const Kt=(t,e,r,n)=>{if(jt(t))return t;if(St(t))return t.map((t=>Kt(t,e,r,n)));if(Ct(t)){t._rev=`${n}/${r}`;const s=e[r];return Object.entries(t).forEach((([r,o])=>{"object"==typeof s&&Object.keys(s).includes(r)&&(t[r]=Kt(o,e,s[r],n))})),t}throw new Error(`Unsupported type ${Ot(t)} in deep.updateRev`)};const Rt=(t,e)=>{if(jt(t))return t;if(St(t))return t.map((t=>Rt(t,e)));if(Ct(t))return t._id=!t._id||t._id.startsWith("__temp__")?t._rev:t._id,t._root=t._root||e,Object.entries(t).forEach((([r,n])=>{t[r]=Rt(n,e)})),t;throw new Error(`Unsupported type ${Ot(t)} in deep.addId`)};const Pt=t=>{if(jt(t))return t;if(St(t))return t.map((t=>Pt(t)));if(Ct(t)){const e=`__temp__/${Math.random()}`;return t._id=t._id||e,t._rev=t._rev||e,Object.values(t).map((t=>Pt(t))),t}throw new Error(`Unsupported type ${Ot(t)} in addRandomId`)};const Ut=t=>{if(jt(t))return t;if(St(t))return t.map((t=>Ut(t)));if(Ct(t))return It(t,(([t,e])=>["_owners","_readers"].includes(t)?[t,JSON.stringify(e)]:jt(e)?[t,e]:[t,Ut(e)]));throw new Error(`Unexpected type ${Ot(t)} in stringifyOwners`)};const Bt=t=>(t._owners&&(t._owners=JSON.parse(t._owners)),t._readers&&(t._readers=JSON.parse(t._readers)),t);const Ht=t=>{if(jt(t))return t;if(St(t)||Ct(t))return Object.entries(t).reduce(((t,[e,r])=>{const n=Ht(r);return(t=>"Object"===Ot(t)&&Object.keys(t).every((t=>!Number.isNaN(parseInt(t,10)))))(n)?Object.entries(n).forEach((([r,n])=>{t[`${e}_${r}`]=n})):t[e]=n,t}),{});throw new Error(`Unsupported type ${Ot(t)} in encodeArraysAsObjects`)};const Dt=t=>{const e={[t._id]:Object.entries(t).reduce(((t,[e,r])=>_t.includes(e)?Object.assign(Object.assign({},t),{[e]:r}):jt(r)?Object.assign(Object.assign({},t),{[`__basic__${e}`]:r}):Object.assign(Object.assign({},t),{[e]:r._id})),{})};return Object.values(t).filter((t=>!jt(t))).reduce(((t,e)=>Object.assign(Object.assign({},t),Dt(e))),e)};const Nt=t=>At(t,(([t])=>!t.startsWith("__basic__")));const Mt=(t,e)=>{const r=t[e];return r.__contains=Object.entries(r).reduce(((e,[r,n])=>["__contains",..._t].includes(r)?e:"__change"===r?"new"===n||"diff"===n||e:Mt(t,n)[n].__contains||e),!1),t};const Ft=(t,e)=>t.map((t=>Object.entries(t).reduce(((t,[r,n])=>{const s="string"==typeof n&&"undefined"!==Ot(e[n])?e[n]:n;return Object.assign(Object.assign({},t),{[r]:s})}),{})));var Lt={exports:{}};var zt="win32"===process.platform;var Jt=b.default;function Wt(t,e){var r=[];for(var n=0;n<t.length;n++){var s=t[n];s&&"."!==s&&(".."===s?r.length&&".."!==r[r.length-1]?r.pop():e&&r.push(".."):r.push(s))}return r}function qt(t){var e=t.length-1;var r=0;for(;r<=e&&!t[r];r++);var n=e;for(;n>=0&&!t[n];n--);return 0===r&&n===e?t:r>n?[]:t.slice(r,n+1)}var Gt=/^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;var Yt=/^([\s\S]*?)((?:\.{1,2}|[^\\\/]+?|)(\.[^.\/\\]*|))(?:[\\\/]*)$/;var Vt={};function Xt(t){var e=Gt.exec(t),r=(e[1]||"")+(e[2]||""),n=e[3]||"";var s=Yt.exec(n);return[r,s[1],s[2],s[3]]}function Zt(t){var e=Gt.exec(t),r=e[1]||"",n=!!r&&":"!==r[1];return{device:r,isUnc:n,isAbsolute:n||!!e[2],tail:e[3]}}function Qt(t){return"\\\\"+t.replace(/^[\\\/]+/,"").replace(/[\\\/]+/g,"\\")}Vt.resolve=function(){var t="",e="",r=!1;for(var n=arguments.length-1;n>=-1;n--){var s;if(n>=0?s=arguments[n]:t?(s=process.env["="+t])&&s.substr(0,3).toLowerCase()===t.toLowerCase()+"\\"||(s=t+"\\"):s=process.cwd(),!Jt.isString(s))throw new TypeError("Arguments to path.resolve must be strings");if(s){var o=Zt(s),i=o.device,c=o.isUnc,a=o.isAbsolute,u=o.tail;if((!i||!t||i.toLowerCase()===t.toLowerCase())&&(t||(t=i),r||(e=u+"\\"+e,r=a),t&&r))break}}return c&&(t=Qt(t)),t+(r?"\\":"")+(e=Wt(e.split(/[\\\/]+/),!r).join("\\"))||"."},Vt.normalize=function(t){var e=Zt(t),r=e.device,n=e.isUnc,s=e.isAbsolute,o=e.tail,i=/[\\\/]$/.test(o);return(o=Wt(o.split(/[\\\/]+/),!s).join("\\"))||s||(o="."),o&&i&&(o+="\\"),n&&(r=Qt(r)),r+(s?"\\":"")+o},Vt.isAbsolute=function(t){return Zt(t).isAbsolute},Vt.join=function(){var t=[];for(var e=0;e<arguments.length;e++){var r=arguments[e];if(!Jt.isString(r))throw new TypeError("Arguments to path.join must be strings");r&&t.push(r)}var n=t.join("\\");return/^[\\\/]{2}[^\\\/]/.test(t[0])||(n=n.replace(/^[\\\/]{2,}/,"\\")),Vt.normalize(n)},Vt.relative=function(t,e){t=Vt.resolve(t),e=Vt.resolve(e);var r=t.toLowerCase();var n=e.toLowerCase();var s=qt(e.split("\\"));var o=qt(r.split("\\"));var i=qt(n.split("\\"));var c=Math.min(o.length,i.length);var a=c;for(var u=0;u<c;u++)if(o[u]!==i[u]){a=u;break}if(0==a)return e;var d=[];for(u=a;u<o.length;u++)d.push("..");return(d=d.concat(s.slice(a))).join("\\")},Vt._makeLong=function(t){if(!Jt.isString(t))return t;if(!t)return"";var e=Vt.resolve(t);return/^[a-zA-Z]\:\\/.test(e)?"\\\\?\\"+e:/^\\\\[^?.]/.test(e)?"\\\\?\\UNC\\"+e.substring(2):t},Vt.dirname=function(t){var e=Xt(t),r=e[0],n=e[1];return r||n?(n&&(n=n.substr(0,n.length-1)),r+n):"."},Vt.basename=function(t,e){var r=Xt(t)[2];return e&&r.substr(-1*e.length)===e&&(r=r.substr(0,r.length-e.length)),r},Vt.extname=function(t){return Xt(t)[3]},Vt.format=function(t){if(!Jt.isObject(t))throw new TypeError("Parameter 'pathObject' must be an object, not "+typeof t);var e=t.root||"";if(!Jt.isString(e))throw new TypeError("'pathObject.root' must be a string or undefined, not "+typeof t.root);var r=t.dir;var n=t.base||"";return r?r[r.length-1]===Vt.sep?r+n:r+Vt.sep+n:n},Vt.parse=function(t){if(!Jt.isString(t))throw new TypeError("Parameter 'pathString' must be a string, not "+typeof t);var e=Xt(t);if(!e||4!==e.length)throw new TypeError("Invalid path '"+t+"'");return{root:e[0],dir:e[0]+e[1].slice(0,-1),base:e[2],ext:e[3],name:e[2].slice(0,e[2].length-e[3].length)}},Vt.sep="\\",Vt.delimiter=";";var te=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;var ee={};function re(t){return te.exec(t).slice(1)}ee.resolve=function(){var t="",e=!1;for(var r=arguments.length-1;r>=-1&&!e;r--){var n=r>=0?arguments[r]:process.cwd();if(!Jt.isString(n))throw new TypeError("Arguments to path.resolve must be strings");n&&(t=n+"/"+t,e="/"===n[0])}return(e?"/":"")+(t=Wt(t.split("/"),!e).join("/"))||"."},ee.normalize=function(t){var e=ee.isAbsolute(t),r=t&&"/"===t[t.length-1];return(t=Wt(t.split("/"),!e).join("/"))||e||(t="."),t&&r&&(t+="/"),(e?"/":"")+t},ee.isAbsolute=function(t){return"/"===t.charAt(0)},ee.join=function(){var t="";for(var e=0;e<arguments.length;e++){var r=arguments[e];if(!Jt.isString(r))throw new TypeError("Arguments to path.join must be strings");r&&(t+=t?"/"+r:r)}return ee.normalize(t)},ee.relative=function(t,e){t=ee.resolve(t).substr(1),e=ee.resolve(e).substr(1);var r=qt(t.split("/"));var n=qt(e.split("/"));var s=Math.min(r.length,n.length);var o=s;for(var i=0;i<s;i++)if(r[i]!==n[i]){o=i;break}var c=[];for(i=o;i<r.length;i++)c.push("..");return(c=c.concat(n.slice(o))).join("/")},ee._makeLong=function(t){return t},ee.dirname=function(t){var e=re(t),r=e[0],n=e[1];return r||n?(n&&(n=n.substr(0,n.length-1)),r+n):"."},ee.basename=function(t,e){var r=re(t)[2];return e&&r.substr(-1*e.length)===e&&(r=r.substr(0,r.length-e.length)),r},ee.extname=function(t){return re(t)[3]},ee.format=function(t){if(!Jt.isObject(t))throw new TypeError("Parameter 'pathObject' must be an object, not "+typeof t);var e=t.root||"";if(!Jt.isString(e))throw new TypeError("'pathObject.root' must be a string or undefined, not "+typeof t.root);return(t.dir?t.dir+ee.sep:"")+(t.base||"")},ee.parse=function(t){if(!Jt.isString(t))throw new TypeError("Parameter 'pathString' must be a string, not "+typeof t);var e=re(t);if(!e||4!==e.length)throw new TypeError("Invalid path '"+t+"'");return e[1]=e[1]||"",e[2]=e[2]||"",e[3]=e[3]||"",{root:e[0],dir:e[0]+e[1].slice(0,-1),base:e[2],ext:e[3],name:e[2].slice(0,e[2].length-e[3].length)}},ee.sep="/",ee.delimiter=":",Lt.exports=zt?Vt:ee,Lt.exports.posix=ee,Lt.exports.win32=Vt;class ne{constructor({db:t=new yt}={}){this.db=t}deploy(t){return y(this,void 0,void 0,(function*(){const[e]=yield this.db.put([{__mdl:t}]);return e}))}static bitcoinResolveHook(t){return t}static bitcoinImportHook(t){return y(this,void 0,void 0,(function*(){const[e]=yield(new yt).get([t]);return new c.StaticModuleRecord(e.__mdl,t)}))}static nodeResolveHook(t="",e=""){if(t.startsWith("/"))throw TypeError(`Module specifier ${t} must not begin with "/"`);if(!e.startsWith("./"))throw TypeError(`Module referrer ${e} must begin with "./"`);const r=[];const n=[];nt(t)&&(n.push(...e.split("/")),n.pop(),r.push(".")),n.push(...t.split("/"));for(const s of n)if("."===s||""===s);else if(".."===s){if(0===n.length)throw TypeError(`Module specifier ${t} via referrer ${e} must not traverse behind an empty path`);r.pop()}else r.push(s);return r.join("/")}static nodeImportHook(t,e){return y(this,void 0,void 0,(function*(){if(!nt(t))throw TypeError(`Cannot locate module ${t}.`);const r=Lt.exports.join(e,t);const n=yield d.readFile(r,{encoding:"utf8"});if(void 0===n)throw new ReferenceError(`Cannot retrieve module at location ${r}.`);return new c.StaticModuleRecord(n,r)}))}static resolveHook(t,e){if(Q(e)&&!Q(t))throw new Error("Requiring a local file from a module on the blockchain is not supported.");return Q(t)?ne.bitcoinResolveHook(t):ne.nodeResolveHook(t,e)}static makeImportHook(t){return e=>Q(e)?ne.bitcoinImportHook(e):ne.nodeImportHook(e,t)}static getBitcoinCompartment(t){const{resolveHook:e,makeImportHook:r}=ne;return new Compartment({},{},{resolveHook:e,importHook:r(t)})}static import(t,e=Lt.exports.dirname(u.fileURLToPath(document.currentScript&&document.currentScript.src||new URL("bitcoin-computer-lib.iife.js",document.baseURI).href))){return y(this,void 0,void 0,(function*(){const r=ne.getBitcoinCompartment(e);const{namespace:n}=yield r.import(t);return n}))}}class se{constructor({db:t=new yt}={}){this.db=t}get(t){return y(this,void 0,void 0,(function*(){const{txId:e,outputIndex:r}=rt(t);const{inRevs:n,outData:s}=yield this.db.fromTxId(e);if(!Array.isArray(n)||!Array.isArray(s)||0===s.length)return;const o=s[0].__index||{};const i=yield Promise.all(Object.values(o).map((t=>{const e=n[t];return e?this.get(e):Promise.resolve({})})));const c=Object.keys(o).map(((t,e)=>[t,i[e]]));const a=Object.fromEntries(c);let u=a.obj;delete a.obj;const d=Object.entries(a).reduce(((t,[e,r])=>{const n=parseInt(e,10);return Number.isNaN(n)||(t[n]=r),t}),[]);const{__cls:l,__func:h,__expt:p,__mdl:f,__args:g}=s[o.obj]||{};const v=function(t,e){let r=0;return e.map((e=>"__"===e?t[r++]:e))}(d,g||[]);let m;if(void 0!==p&&void 0!==f){const t=ne.getBitcoinCompartment("");const{namespace:e}=yield t.import(f);u=new Compartment(Object.assign(Object.assign({},e),{args:v})).evaluate(`Reflect.construct(${p}, args)`)}else if(void 0!==l){const t=(new Compartment).evaluate(`(${l})`);u=new Compartment({ClsFunc:t,args:v}).evaluate("Reflect.construct(ClsFunc, args)")}else{if(void 0===u||void 0===h)throw new Error("Unrecognized transaction.");{const t=u[h];m=new Compartment({func:t,target:u,args:v}).evaluate("Reflect.apply(func, target, args)")}}Object.entries(o).forEach((([t,r])=>{const n=parseInt(t,10);let o=d[n];"obj"===t?o=u:"res"===t&&(o=m),Kt(o,s,r,e)}));const b=(null==u?void 0:u._root)||`${e}/${o.obj}`;return Rt([m,u,...d],b),[...d,u,m][r]}))}}class oe{constructor({db:t=new yt}={}){this.db=t,this.modules=new ne({db:t}),oe.proxyDepth=oe.proxyDepth||0}write(t){return y(this,void 0,void 0,(function*(){let e;let r;let n;let s;const{moduleSpecifier:o,target:i,property:c,constructorFunction:a,exportName:u,args:d=[]}=t;const l=Tt(i);const h=Tt(d);if(void 0!==u&&void 0!==d&&void 0!==o){const t=ne.getBitcoinCompartment("");const{namespace:i}=yield t.import(o);e=new Compartment(Object.assign(Object.assign({},i),{args:d})).evaluate(`Reflect.construct(${u}, args)`),r=d,s={__expt:u,__mdl:o},n=void 0}else if(void 0!==a&&void 0!==d)e=new Compartment({constructorFunction:a,args:d}).evaluate("Reflect.construct(constructorFunction, args)"),r=d,s={__cls:a.toString()},n=void 0;else{if(void 0===i||void 0===c)throw new Error("Unrecognized constructor or function call parameters.");e=i,r=d,s={__func:String(c)},oe.proxyDepth+=1,n=new Compartment({func:i[c],target:i,args:d}).evaluate("Reflect.apply(func, target, args)"),oe.proxyDepth-=1}const{smartArgs:p,dumbArgs:f}=Z(h);const{smartArgs:g}=Z(r);const v=Object.assign(Object.assign(Object.assign({},p),{obj:l}),{_id:"index"});const m=Object.assign(Object.assign(Object.assign({},g),{obj:e}),{_id:"index"});["Object","Array"].includes(Ot(n))&&(m.res=n);const[b,y,_]=((t,e)=>{const r=Pt(e);const n=r._id;const s=Tt(t);const o=Tt(r);const i=Ut(s);const c=Ut(o);const a=Ht(i);const u=Ht(c);const d=((t,e)=>It(e,(([e,r])=>{const n=t[e];var s;return r.__change=(s=n)?Et(s,r)?"same":"diff":"new",[e,r]})))(Dt(a),Dt(u));const l=kt(d,Nt);const h=Mt(l,n);const p=h[n];delete h[n];const f=kt(h,(t=>t._rev));const g=(v=t=>t.__contains||Object.values(p).includes(t._id),At(h,(([,t])=>v(t))));var v;const m=Object.values(g);const[b,y]=(_=t=>"new"===t.__change,m.reduce((([t,e],r,n)=>_(r)?[[...t,r],e]:[t,[...e,r]]),[[],[]]));var _;const x=[...y,...b];const O=(t=>t.reduce(((t,e,r)=>Object.assign(Object.assign({},t),{[e._id]:r})),{}))(x);const j=Ft(x,O);const[S]=Ft([p],O);const C=y.map((t=>t._rev));const[$,...E]=((t,e)=>[e,...t].map((t=>{const e=w(t,["_id","_rev","__change","__contains"]);return At(e,(([t,e])=>_t.includes(t)||"number"==typeof e))})))(j,S);return[C,E.map(Bt).map((t=>Object.entries(t).reduce(((t,[e,r])=>Object.assign(Object.assign({},t),{[e]:f[r]||r})),{}))),$]})(v,m);void 0!==y[0]&&(y[0].__index=_);const x=_.obj;void 0!==y[x]&&(s.__args=f,y[x]=Object.assign(Object.assign({},y[x]),s));const O=_.res;void 0!==y[O]&&"function Object() { [native code] }"!==n.constructor.toString()&&(y[O].__cls=n.constructor.toString());const[j]=yield this.db.update(b,y);const{txId:S}=rt(j);Object.entries(_).forEach((([t,r])=>{let s;s="obj"===t?e:t.startsWith("res")?n:g[parseInt(t,10)],Kt(s,y,r,S)}));const C=(null==i?void 0:i._root)||`${S}/${_.obj}`;return Rt([n,e,...g],C),void 0!==n?n:e}))}get(t,e){return oe.proxyDepth>0||"function"!=typeof t[e]?Reflect.get(t,e):(...r)=>this.write({target:t,property:e,args:r})}}const{bitcore:ie}=p.default;const{crypto:ce}=ie;t.Computer=class{constructor(t={}){if(void 0!==t.seed)throw new Error('The constructor parameter "seed" has been renamed to "mnemonic".');this.db=new yt(t)}new(t,e,r){return y(this,void 0,void 0,(function*(){const n="function"==typeof t?t:void 0;const s="string"==typeof t?t:void 0;const o=new oe({db:this.db});const i=yield o.write({args:e,moduleSpecifier:r,constructorFunction:n,exportName:s});return new Proxy(i,o)}))}sync(t){return y(this,void 0,void 0,(function*(){et(t);const{db:e}=this;const r=new se({db:e});const n=new oe({db:e});const s=yield r.get(t);return new Proxy(s,n)}))}query({publicKey:t,contract:e}){return y(this,void 0,void 0,(function*(){let r={};if(t&&(r=Object.assign(Object.assign({},r),{publicKey:new ie.PublicKey(t).toString()})),e){const t="string"==typeof e?e:e.toString();r=Object.assign(Object.assign({},r),{classHash:ce.Hash.sha256(Buffer.from(t)).toString("hex")})}return this.db.wallet.restClient.query(r)}))}idsToRevs(t){return y(this,void 0,void 0,(function*(){return this.db.wallet.restClient.idsToRevs(t)}))}deploy(t){return y(this,void 0,void 0,(function*(){return new ne(this).deploy(t)}))}import(t,e){return y(this,void 0,void 0,(function*(){return(yield ne.import(e))[t]}))}getChain(){return this.db.wallet.restClient.chain}getNetwork(){return this.db.wallet.restClient.network}getMnemonic(){return this.db.wallet.restClient.mnemonic.toString()}getPrivateKey(){return this.db.wallet.privateKey.toString()}getPublicKey(){return this.db.wallet.publicKey.toString()}getAddress(){return this.db.wallet.address.toString()}getBalance(){return y(this,void 0,void 0,(function*(){return this.db.wallet.getBalance()}))}getUtxos(){return y(this,void 0,void 0,(function*(){const t=new ie.Address(this.getAddress());return this.db.wallet.restClient.getUtxosByAddress(t)}))}broadcast(t){return y(this,void 0,void 0,(function*(){return this.db.wallet.restClient.sendTransaction(t)}))}queryRevs(t){return y(this,void 0,void 0,(function*(){return this.query(t)}))}getOwnedRevs(t=this.db.wallet.publicKey){return this.query({publicKey:t.toString()})}getRevs(t=this.db.wallet.publicKey){return y(this,void 0,void 0,(function*(){return this.query({publicKey:t.toString()})}))}getLatestRevs(t){return y(this,void 0,void 0,(function*(){return this.idsToRevs(t)}))}getLatestRev(t){return y(this,void 0,void 0,(function*(){const[e]=yield this.idsToRevs([t]);return e}))}rpcCall(t,e){return y(this,void 0,void 0,(function*(){const r=yield this.db.wallet.restClient.rpc(t,e);return r.result?r.result:{}}))}},Object.defineProperty(t,"__esModule",{value:!0})}({},Mnemonic,axios,0,crypto,CryptoJS,eciesjs,endoStaticModuleRecord,util,url,fsPromises);
