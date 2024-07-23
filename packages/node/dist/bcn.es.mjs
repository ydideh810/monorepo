import t from"body-parser";import e from"cors";import s from"express";import r from"http";import*as a from"zeromq";import n from"express-rate-limit";import*as o from"@bitcoin-computer/secp256k1";import{crypto as i,networks as c,bufferUtils as u,address as p,payments as l,Psbt as d,Transaction as m,initEccLib as h}from"@bitcoin-computer/nakamotojs";import y from"dotenv";import g from"winston";import w from"winston-daily-rotate-file";import f from"pg-promise";import v from"pg-monitor";import{backOff as E}from"exponential-backoff";import T from"fs";import{ECPairFactory as O}from"ecpair";import S from"bitcoind-rpc";import $ from"util";import{Computer as R}from"@bitcoin-computer/lib";import b from"elliptic";import I from"hash.js";import x,{dirname as M}from"path";import{fileURLToPath as N}from"url";y.config();const P=process.env.CHAIN;const A=process.env.NETWORK;const{PORT:L}=process.env;const{POSTGRES_USER:C}=process.env;const{POSTGRES_PASSWORD:B}=process.env;const{POSTGRES_DB:j}=process.env;const{POSTGRES_HOST:H}=process.env;const{POSTGRES_PORT:U}=process.env;const{RPC_USER:F}=process.env;const{RPC_PASSWORD:D}=process.env;process.env;const{RPC_HOST:k}=process.env;const{RPC_PORT:_}=process.env;const{RPC_PROTOCOL:K}=process.env;const{ZMQ_URL:W}=process.env;const{DEFAULT_WALLET:Y}=process.env;const{ALLOWED_RPC_METHODS:G}=process.env;const{DEBUG_MODE:q}=process.env;const{LOG_MAX_FILES:J}=process.env;const{LOG_MAX_SIZE:V}=process.env;const{LOG_ZIP:z}=process.env;const{SHOW_CONSOLE_LOGS:Z}=process.env;const{SHOW_DB_LOGS:X}=process.env;const{RATE_LIMIT_ENABLED:Q}=process.env;const{RATE_LIMIT_WINDOW:tt}=process.env;const{RATE_LIMIT_MAX:et}=process.env;const{RATE_LIMIT_STANDARD_HEADERS:st}=process.env;const{RATE_LIMIT_LEGACY_HEADERS:rt}=process.env;process.env,process.env;const{OFFCHAIN_PROTOCOL:at}=process.env;const nt=process.env.QUERY_LIMIT||"1000";const ot=process.env.BCN_URL||`http://127.0.0.1:${L}`;const it=process.env.BCN_ENV||"dev";g.addColors({error:"red",warn:"yellow",info:"green",http:"magenta",debug:"white"});const ct=g.format.combine(g.format.colorize(),g.format.timestamp({format:"YYYY-MM-DD HH:mm:ss:ms"}),g.format.json(),g.format.printf((t=>`${t.timestamp} [${t.level.slice(5).slice(0,-5)}] ${t.message}`)));const ut={zippedArchive:"true"===z,maxSize:V,maxFiles:J,dirname:"logs"};const pt=[];"true"===Z&&pt.push(new g.transports.Console({format:g.format.combine(g.format.colorize(),g.format.timestamp({format:"MM-DD-YYYY HH:mm:ss"}),g.format.printf((t=>`${t.timestamp} ${t.level} ${t.message}`)))}));const lt=parseInt(q,10);lt>=0&&pt.push(new w({filename:"error-%DATE%.log",datePattern:"YYYY-MM-DD",level:"error",...ut})),lt>=1&&pt.push(new w({filename:"warn-%DATE%.log",datePattern:"YYYY-MM-DD",level:"warn",...ut})),lt>=2&&pt.push(new w({filename:"info-%DATE%.log",datePattern:"YYYY-MM-DD",level:"info",...ut})),lt>=3&&pt.push(new w({filename:"http-%DATE%.log",datePattern:"YYYY-MM-DD",level:"http",...ut})),lt>=4&&pt.push(new w({filename:"debug-%DATE%.log",datePattern:"YYYY-MM-DD",level:"debug",...ut}));const dt=g.createLogger({levels:{error:0,warn:1,info:2,http:3,debug:4},format:ct,transports:pt,exceptionHandlers:[new g.transports.File({filename:"logs/exceptions.log"})],rejectionHandlers:[new g.transports.File({filename:"logs/rejections.log"})]});y.config();const{version:mt}=JSON.parse(T.readFileSync("package.json","utf8"));const ht=mt||process.env.SERVER_VERSION;const yt=parseInt(process.env.MWEB_HEIGHT||"",10)||432;const gt={error:(t,e)=>{if(e.cn){const{host:s,port:r,database:a,user:n,password:o}=e.cn;dt.debug(`Waiting for db to start { message:${t.message} host:${s}, port:${r}, database:${a}, user:${n}, password: ${o}`)}},noWarnings:!0};"true"===X&&(v.isAttached()?v.detach():(v.attach(gt),v.setTheme("matrix")));const wt=f(gt)({host:H,port:parseInt(U,10),database:j,user:C,password:B,allowExitOnIdle:!0,idleTimeoutMillis:100});const{PreparedStatement:ft}=f;class vt{static async select(t){const e=new ft({name:`OffChain.select.${Math.random()}`,text:'SELECT "data" FROM "OffChain" WHERE "id" = $1',values:[t]});return wt.oneOrNone(e)}static async insert({id:t,data:e}){const s=new ft({name:`OffChain.insert.${Math.random()}`,text:'INSERT INTO "OffChain" ("id", "data") VALUES ($1, $2) ON CONFLICT DO NOTHING',values:[t,e]});return wt.none(s)}static async delete(t){const e=new ft({name:`OffChain.delete.${Math.random()}`,text:'WITH deleted AS (DELETE FROM "OffChain" WHERE "id" = $1 RETURNING *) SELECT count(*) FROM deleted;',values:[t]});return(await wt.any(e))[0].count>0}}class Et{static async select(t){const e=await vt.select(t);return e?.data||null}static async insert(t){return vt.insert(t)}static async delete(t){return vt.delete(t)}}const Tt=s.Router();Tt.get("/:id",(async({params:{id:t},url:e},s)=>{try{const e=await Et.select(t);e?s.status(200).json(e):s.status(403).json({error:"No entry found."})}catch(t){dt.error(`GET ${e} failed with error '${t.message}'`),s.status(500).json({error:t.message})}})),Tt.post("/",(async(t,e)=>{const{body:{data:s},url:r}=t;try{const r=i.sha256(Buffer.from(s)).toString("hex");await Et.insert({id:r,data:s});const a=`${at||t.protocol}://${t.get("host")}/store/${r}`;e.status(201).json({_url:a})}catch(t){dt.error(`POST ${r} failed with error '${t.message}'`),e.status(500).json({error:t.message})}})),Tt.delete("/:id",(async(t,e)=>{e.status(500).json({error:"Deletions are not supported yet."})}));const{PreparedStatement:Ot}=f;class St{static async getBalance(t){const e=new Ot({name:`Utxos.getBalance.${Math.random()}`,text:'SELECT sum("satoshis") as "satoshis" FROM "Utxos" WHERE "address" = $1',values:[t]});const s=await wt.oneOrNone(e);return parseInt(s?.satoshis,10)||0}static async select(t){const e=new Ot({name:`Utxos.select.${Math.random()}`,text:'SELECT "address", "satoshis", "scriptPubKey", "rev", split_part(rev, \':\', 1) AS "txId", cast(split_part(rev, \':\', 2) as INTEGER) AS "vout" FROM "Utxos" WHERE "address" = $1',values:[t]});return(await wt.any(e)).map((t=>({...t,satoshis:parseInt(t.satoshis,10)||0})))}static async selectByScriptHex(t){const e=new Ot({name:`Utxos.select.${Math.random()}`,text:'SELECT "address", "satoshis", "scriptPubKey", "rev", split_part(rev, \':\', 1) AS "txId", cast(split_part(rev, \':\', 2) as INTEGER) AS "vout" FROM "Utxos" WHERE "scriptPubKey" = $1',values:[t]});return(await wt.any(e)).map((t=>({...t,satoshis:parseInt(t.satoshis,10)||0})))}static async selectByPk(t){const e=new Ot({name:`Utxos.selectByPk.${Math.random()}`,text:'SELECT "address", "satoshis", "scriptPubKey", "rev", split_part(rev, \':\', 1) AS "txId", cast(split_part(rev, \':\', 2) as INTEGER) AS "vout", "publicKeys" FROM "Utxos" WHERE $1 = ANY ("publicKeys")',values:[t]});return(await wt.any(e)).map((t=>({...t,satoshis:parseInt(t.satoshis,10)})))}}class $t{static async getBalance(t){return St.getBalance(t)}static async select(t){return St.select(t)}static async selectByScriptHex(t){return St.selectByScriptHex(t)}static async selectByPk(t){return St.selectByPk(t)}}class Rt{static getBalance=async t=>$t.getBalance(t);static select=async t=>$t.select(t);static selectByScriptHex=async t=>$t.selectByScriptHex(t);static selectByPk=async t=>$t.selectByPk(t)}const bt={protocol:K,user:F,pass:D,host:k,port:parseInt(_,10)};const It=new S(bt);const xt=$.promisify(S.prototype.createwallet.bind(It));const Mt=$.promisify(S.prototype.generateToAddress.bind(It));const Nt=$.promisify(S.prototype.getaddressinfo.bind(It));const Pt=$.promisify(S.prototype.getBlock.bind(It));const At=$.promisify(S.prototype.getBlockchainInfo.bind(It));const Lt=$.promisify(S.prototype.getBlockHash.bind(It));const Ct=$.promisify(S.prototype.getRawTransaction.bind(It));const Bt=$.promisify(S.prototype.getRawTransaction.bind(It));const jt=$.promisify(S.prototype.getTransaction.bind(It));const Ht=$.promisify(S.prototype.getNewAddress.bind(It));const Ut={createwallet:xt,generateToAddress:Mt,getaddressinfo:Nt,getBlock:Pt,getBlockchainInfo:At,getBlockHash:Lt,getRawTransaction:Ct,getTransaction:jt,importaddress:$.promisify(S.prototype.importaddress.bind(It)),listunspent:$.promisify(S.prototype.listunspent.bind(It)),sendRawTransaction:$.promisify(S.prototype.sendRawTransaction.bind(It)),getNewAddress:Ht,sendToAddress:$.promisify(S.prototype.sendToAddress.bind(It)),getRawTransactionJSON:Bt};const Ft=(t,e)=>{const s=[];for(let r=0;r<t.length;r+=e){const a=Math.min(r+e,t.length);const n=t.slice(r,a);s.push(n)}return s};const Dt=t=>{const e=[];for(let s=1;s<=t;s+=2){const t=`($${s},$${s+1})`;e.push(t)}return e.join(",")};const kt=t=>{const e=[];for(let s=1;s<=t;s+=9){const t=`($${s},$${s+1},$${s+2},$${s+3},$${s+4},$${s+5},$${s+6},$${s+7},$${s+8})`;e.push(t)}return e.join(",")};const _t=t=>{try{return t()}catch{return null}};class Kt{static async getTransaction(t){const{result:e}=await Ut.getTransaction(t);return e}static async getBulkTransactions(t){return(await Promise.all(t.map((t=>Ut.getRawTransaction(t))))).map((t=>t.result))}static async getRawTransactionsJSON(t){return{txId:(e=(await Ut.getRawTransactionJSON(t,1)).result).txid,txHex:e.hex,vsize:e.vsize,version:e.version,locktime:e.locktime,ins:e.vin.map((t=>t.coinbase?{coinbase:t.coinbase,sequence:t.sequence}:{txId:t.txid,vout:t.vout,script:t.scriptSig.hex,sequence:t.sequence})),outs:e.vout.map((t=>{let e;return t.scriptPubKey.addresses?[e]=t.scriptPubKey.addresses:e=t.scriptPubKey.address?t.scriptPubKey.address:void 0,{address:e,script:t.scriptPubKey.hex,value:Math.round(1e8*t.value)}}))};var e}static async sendRawTransaction(t){const{result:e,error:s}=await Ut.sendRawTransaction(t);if(s)throw dt.error(s),new Error("Error sending transaction");return e}static getUtxos=async t=>(void 0===(await Ut.getaddressinfo(t)).result.timestamp&&(dt.info(`Importing address: ${t}`),await Ut.importaddress(t,!1)),(await Ut.listunspent(0,999999,[t])).result)}class Wt{static get=async t=>Kt.getTransaction(t);static getRaw=async t=>Kt.getBulkTransactions(t);static getRawJSON=async t=>Kt.getRawTransactionsJSON(t);static sendRaw=async t=>Kt.sendRawTransaction(t);static getUtxos=async t=>Kt.getUtxos(t)}const Yt={protocol:K,user:F,pass:D,host:k,port:parseInt(_,10)};const Gt=new S(Yt);const qt={};const Jt=JSON.parse(JSON.stringify(S.callspec));Object.keys(Jt).forEach((t=>{Jt[t.toLowerCase()]=Jt[t]}));const Vt={str:t=>t.toString(),string:t=>t.toString(),int:t=>parseFloat(t),float:t=>parseFloat(t),bool:t=>!0===t||"1"===t||1===t||"true"===t||"true"===t.toString().toLowerCase(),obj:t=>"string"==typeof t?JSON.parse(t):t};try{Object.keys(S.prototype).forEach((t=>{if(t&&"function"==typeof S.prototype[t]){const e=t.toLowerCase();qt[t]=$.promisify(S.prototype[t].bind(Gt)),qt[e]=$.promisify(S.prototype[e].bind(Gt))}}))}catch(t){dt.error(`Error occurred while binding RPC methods: ${t.message}`)}function zt(t){return/^[0-9A-Fa-f]{64}:\d+$/.test(t)}function Zt(t){if(!zt(t))throw new Error("Invalid rev")}const{PreparedStatement:Xt}=f;class Qt{static async listSentOutputs(t){const e=new Xt({name:`Output.listSentTxs.${Math.random()}`,text:'SELECT "Input"."spendingInput" AS "output", "Output"."satoshis" AS "amount"\n        FROM "Output" INNER JOIN "Input" ON "Output".rev = "Input"."outputSpent" \n        WHERE "Output"."address" = $1',values:[t]});return(await wt.any(e)).map((t=>({...t,amount:parseInt(t.amount,10)||0})))}static async listReceivedOutputs(t){const e=new Xt({name:`Output.listReceivedTxs.${Math.random()}`,text:'SELECT "Output"."rev" as "output", "Output"."satoshis" as "amount" FROM "Output" WHERE "address" = $1',values:[t]});return(await wt.any(e)).map((t=>({...t,amount:parseInt(t.amount,10)||0})))}static async listTxs(t){const e=new Xt({name:`Output.listTxs.${Math.random()}`,text:'WITH\n              -- List all txs sent from a given address\n              SENT AS (\n                SELECT split_part("Input"."spendingInput",\':\',1) as "txId", SUM("Output".satoshis) as "satoshis"\n                FROM "Output" INNER JOIN "Input" ON "Output".rev = "Input"."outputSpent"  \n                WHERE "Output".address = $1\n                GROUP BY split_part("Input"."spendingInput",\':\',1)\n              ),\n              -- List all tx received from a given address\n              RECEIVED AS (\n                SELECT SPLIT_PART("Output"."rev",\':\',1) as "txId", SUM("Output"."satoshis") as "satoshis" \n                FROM "Output" \n                WHERE "address" = $1\n                GROUP BY "txId"\n              )\n\n            SELECT\n              RECEIVED."txId", \n              coalesce(SENT."satoshis", 0) as "inputsSatoshis", \n              coalesce(RECEIVED."satoshis", 0) as "outputsSatoshis", \n              coalesce(RECEIVED."satoshis",0) - coalesce(SENT."satoshis",0) as "satoshis"\n            FROM\n              SENT RIGHT JOIN RECEIVED ON SENT."txId" = RECEIVED."txId";',values:[t]});const s=(await wt.any(e)).map((t=>({...t,inputsSatoshis:parseInt(t.inputsSatoshis,10)||0,outputsSatoshis:parseInt(t.outputsSatoshis,10)||0,satoshis:parseInt(t.satoshis,10)||0})));return{sentTxs:s.filter((t=>t.satoshis<0)).map((t=>({...t,satoshis:Math.abs(t.satoshis)}))),receivedTxs:s.filter((t=>t.satoshis>=0))}}static async select(t){const e=new Xt({name:`Output.select.${Math.random()}`,text:'SELECT "address", "satoshis", "scriptPubKey", "rev", "publicKeys", "hash", "mod", "isTbcOutput", "previous" FROM "Output" WHERE "address" = $1',values:[t]});return wt.any(e)}static async insert(t){await Promise.all(Ft(t,1111).map((t=>{const e=t.flatMap((({rev:t,address:e,satoshis:s,scriptPubKey:r,isTbcOutput:a,publicKeys:n,mod:o,previous:i,hash:c})=>[t,e,s,r,a,n,o,i,c]));return wt.none(new Xt({name:`Output.insert.${Math.random()}`,text:`INSERT INTO "Output"("rev", "address", "satoshis", "scriptPubKey", "isTbcOutput", "publicKeys", "mod", "previous", "hash") VALUES ${kt(e.length)} ON CONFLICT DO NOTHING`,values:e}))})))}static async getIdByRev(t){const e=new Xt({name:`NonStandard.recursiveUpdates.${Math.random()}`,text:'WITH RECURSIVE revUpdates AS (\n        SELECT "rev", "previous" FROM "Output" WHERE "isTbcOutput" = true and "rev" = $1\n        UNION ALL\n        SELECT o."rev", o."previous" FROM "Output" o\n        INNER JOIN revUpdates r ON r."previous" = o."rev"\n      )\n      SELECT * FROM revUpdates',values:[t]});const s=(await wt.any(e)).filter((t=>null===t.previous));return s[0]?.rev}static async getIdsByRevs(t){return Promise.all(t.map((t=>this.getIdByRev(t))))}static async getLatestRev(t){const e=new Xt({name:`NonStandard.recursiveUpdates.${Math.random()}`,text:'WITH RECURSIVE revUpdates AS (\n        SELECT "rev", "previous" FROM "Output" WHERE "isTbcOutput" = true and "rev" = $1\n        UNION ALL\n        SELECT o."rev", o."previous" FROM "Output" o\n        INNER JOIN revUpdates r ON o."previous" = r."rev"\n      )\n      SELECT * FROM revUpdates',values:[t]});const s=await wt.any(e);const r=Object.fromEntries(s.map((t=>[t.previous,t.rev])));let a=t;for(;r[a];)a=r[a];return a}static async getLatestRevs(t){return Promise.all(t.map(this.getLatestRev))}static async getIdsByMod(t){const e=new Xt({name:`Output.getIdsByMod.${Math.random()}`,text:'SELECT "rev" FROM "Output" WHERE "mod" = $1',values:[t]});return(await wt.any(e)).map((t=>t.rev))}static sqlSuffix(t,e,s){let r="";return s&&(r+=` order by "timestamp" ${s}`),r+=` limit ${t||nt}`,e&&(r+=` offset ${e}`),r}static async getRevsByPublicKey(t){const e=new Xt({name:`Output.getRevsByPublicKey.${Math.random()}`,text:'SELECT "rev" FROM "Output" WHERE $1 = ANY("publicKeys")',values:[t]});return(await wt.any(e)).map((t=>t.rev))}static async getUnspentRevsByMod(t,e,s,r){const a=await this.getIdsByMod(t);const n=await this.getLatestRevs(a);const o=new Xt({name:`Output.getUnspentRevsByMod.${Math.random()}`,text:`SELECT "rev" FROM "Output" WHERE "rev" = ANY($1) ${this.sqlSuffix(e,s,r)}`,values:[n]});return(await wt.any(o)).map((t=>t.rev))}static async getUnspentRevsByPublicKey(t,e,s,r){const a=new Xt({name:`Output.getUnspentRevsByPublicKey.${Math.random()}`,text:`SELECT "rev" FROM "Output" WHERE $1 = ANY("publicKeys") AND "isTbcOutput" = true \n      AND NOT EXISTS (SELECT 1 FROM "Input" ip WHERE "ip"."outputSpent" = "Output"."rev") \n      ${this.sqlSuffix(e,s,r)}`,values:[t]});return(await wt.any(a)).map((t=>t.rev))}static async getUnspentRevsByModAndPublicKey(t,e,s,r,a){const n=await this.getUnspentRevsByPublicKey(e,s,r,a);const o=await this.getIdsByRevs(n);const i=new Xt({name:`Output.getLatestRevsByModAndPublicKey.${Math.random()}`,text:'SELECT "rev" FROM "Output" WHERE "mod" = $1 AND "rev" = ANY($2)',values:[t,o]});const c=(await wt.any(i)).map((t=>t.rev));const u=await this.getLatestRevs(c);const p=new Xt({name:`Output.getLatestRevsByModAndPublicKey.${Math.random()}`,text:`SELECT "rev" FROM "Output" WHERE "rev" = ANY($1) ${this.sqlSuffix(s,r,a)}`,values:[u]});return(await wt.any(p)).map((t=>t.rev))}static async getUnspentTbcOutputs(t,e,s){const r=new Xt({name:`Output.getUnspentTbcOutputs.${Math.random()}`,text:`SELECT "rev", "address", "satoshis", "scriptPubKey", "publicKeys", "timestamp"\n        FROM "Output" WHERE "isTbcOutput" = true AND NOT EXISTS\n        (SELECT 1 FROM "Input" ip WHERE "ip"."outputSpent" = "Output"."rev") ${this.sqlSuffix(t,e,s)}`});return(await wt.any(r)).map((t=>t.rev))}static async query(t){const{publicKey:e,limit:s,offset:r,ids:a,mod:n,order:o}=t;const i=parseInt(nt||"",10);if(s&&parseInt(s||"",10)>i||a&&a.length>i)throw new Error(`Can't fetch more than ${nt} revs.`);if(o&&"ASC"!==o&&"DESC"!==o)throw new Error("Invalid order. Should be ASC or DESC.");return a?(a.map(Zt),this.getLatestRevs(a)):n&&!e?this.getUnspentRevsByMod(n,s,r,o):!n&&e?this.getUnspentRevsByPublicKey(e,s,r,o):n&&e?this.getUnspentRevsByModAndPublicKey(n,e,s,r,o):this.getUnspentTbcOutputs(s,r,o)}}class te{static async select(t){return Qt.select(t)}static async insert(t){return Qt.insert(t)}static async listSentOutputs(t){return Qt.listSentOutputs(t)}static async listReceivedOutputs(t){return Qt.listReceivedOutputs(t)}static async listTxs(t){return Qt.listTxs(t)}static async getLatestRev(t){return Qt.getLatestRev(t)}static async query(t){return Qt.query(t)}}class ee{static insert=async t=>{const e=function(t=P,e=A){switch(t){case"BTC":switch(e){case"mainnet":return c.bitcoin;case"testnet":return c.testnet;case"regtest":return c.regtest;default:throw new Error(`Invalid network ${e}`)}case"LTC":switch(e){case"mainnet":return c.litecoin;case"testnet":return c.litecointestnet;case"regtest":return c.litecoinregtest;default:throw new Error(`Invalid network ${e}`)}case"PEPE":switch(e){case"mainnet":return c.pepecoin;case"testnet":return c.pepecointestnet;case"regtest":return c.pepecoinregtest;default:throw new Error(`Invalid network ${e}`)}default:throw new Error(`Invalid chain ${t}`)}}(P,A);const s=t.flatMap((t=>{const{zip:s,ownerData:r,onChainMetaData:a}=t;const{exp:n="",mod:o=""}=a;return t.tx.outs.map((({script:a,value:c},u)=>{const l=u<s.length;return{rev:`${t.txId}:${u}`,address:_t((()=>p.fromOutputScript(a,e))),satoshis:Math.round(c),scriptPubKey:a.toString("hex"),isTbcOutput:l,publicKeys:l?r[u]._owners:[],mod:l?o:"",previous:l?s[u][0]:null,hash:l?i.sha256(Buffer.from(n||"")).toString("hex"):null}}))}));return te.insert(s)};static listSentOutputs=async t=>te.listSentOutputs(t);static listReceivedOutputs=async t=>te.listReceivedOutputs(t);static listTxs=async t=>te.listTxs(t);static getLatestRev=async t=>te.getLatestRev(t);static query=async t=>te.query(t)}const se=t=>new Promise((e=>setTimeout(e,t)));const re=O(o);const ae=c.regtest;const{PreparedStatement:ne}=f;class oe{static async select(t){const e=new ne({name:`Input.select.${Math.random()}`,text:'SELECT "outputSpent" FROM "Input" WHERE "outputSpent" = $1',values:[t]});return wt.any(e)}static async insert(t){await Promise.all(Ft(t,5e3).map((t=>{const e=t.flatMap((({outputSpent:t,spendingInput:e})=>[t,e]));return wt.none(new ne({name:`Input.insert.${Math.random()}`,text:`INSERT INTO "Input"("outputSpent", "spendingInput") VALUES ${Dt(e.length)} ON CONFLICT DO NOTHING`,values:e}))})))}static async count(t){const e=t.map((t=>t.outputSpent));const s=new ne({name:`Input.belong.${Math.random()}`,text:'SELECT count(*) FROM "Input" WHERE "outputSpent" LIKE ANY ($1)',values:[[e]]});const r=await wt.oneOrNone(s);return parseInt(r?.count,10)||0}}class ie{static async select(t){return oe.select(t)}static async insert(t){return oe.insert(t)}}class ce{static insert=async t=>{const e=t.flatMap((t=>t.tx.ins.map((e=>({input:e,txId:t.txId}))))).filter((({input:t})=>!m.isCoinbaseHash(t.hash))).map((({input:t,txId:e},s)=>{return{outputSpent:`${r=t.hash,u.reverseBuffer(Buffer.from(r)).toString("hex")}:${t.index}`,spendingInput:`${e}:${s}`};var r}));ie.insert(e)}}class ue{static rawTxSubscriber=async t=>{const e=t.toString("hex");if(dt.info(`ZMQ message { rawTx:${e} }`),"08"!==e.slice(10,12))try{const t=R.txFromHex({hex:e});await ee.insert([t]),await ce.insert([t])}catch(t){dt.error(`Error parsing transaction ${t.message} ${t.stack}`)}};static checkSyncStatus=async()=>{const t=await E((async()=>{const t=await Ut.getBlockchainInfo();const e=(100*parseFloat(t.result.verificationprogress)).toFixed(4);const{blocks:s}=t.result;if(dt.info(`Zmq. Bitcoind { percentage:${e}%, blocks:${s} }`),parseFloat(t.result.verificationprogress)<=.7)throw new Error("Node not ready yet");return t}),{startingDelay:6e4,timeMultiple:1,numOfAttempts:8760});const e=(100*parseFloat(t.result.verificationprogress)).toFixed(4);const s=t.result.blocks;dt.info(`BCN reaches sync end...at { bitcoind.progress:${e}%, bitcoindSyncedHeight:${s} }`)};static createWallet=async()=>{try{await Ut.createwallet(Y,!1,!1,"",!1,!1)}catch(t){dt.error(`Wallet creation failed with error '${t.message}'`)}};static sub=async t=>{try{await this.createWallet(),"regtest"!==A&&await this.checkSyncStatus(),await(async()=>{if("regtest"===A){if(dt.info(`Node is starting for chain ${P} and network ${A}, \n\n. Starting Wallet setup.`),"LTC"===P){const{result:t}=await Ut.getBlockchainInfo();const e=t.blocks;if(e<yt){const{result:t}=await Ut.getNewAddress("","legacy");const s=yt-e-1;s&&await Ut.generateToAddress(s,t);const{result:r}=await Ut.getNewAddress("mweb","mweb");await Ut.sendToAddress(r,1),await Ut.generateToAddress(1,t),dt.info("MWEB setup is complete")}}if("BTC"===P){const{result:t}=await Ut.getNewAddress("","legacy");await Ut.generateToAddress(200,t),dt.info("Wallet setup is complete")}if("PEPE"===P){const{result:t}=await Ut.getNewAddress("");await Ut.generateToAddress(200,t),dt.info("Wallet setup is complete")}}})(),dt.info(`Bitcoin Computer Node ${ht} is ready. MAX_BLOCKCHAIN_HEIGHT: 2538171`);for await(const[,e]of t)await this.rawTxSubscriber(e)}catch(t){dt.error(`ZMQ subscription failed with error '${t.message}'`)}}}const{PreparedStatement:pe}=f;class le{static async select(t){const e=new pe({name:`User.select.${Math.random()}`,text:'SELECT "publicKey", "clientTimestamp" FROM "User" WHERE "publicKey" = $1',values:[t]});const s=await wt.oneOrNone(e);return s?{publicKey:s.publicKey,clientTimestamp:parseInt(s.clientTimestamp,10)||0}:null}static async insert({publicKey:t,clientTimestamp:e}){const s=new pe({name:`User.insert.${Math.random()}`,text:'INSERT INTO "User"("publicKey", "clientTimestamp") VALUES ($1, $2)',values:[t,e]});await wt.none(s)}static async update({publicKey:t,clientTimestamp:e}){const s=new pe({name:`User.update.${Math.random()}`,text:'UPDATE "User" SET "clientTimestamp"=$1 WHERE "publicKey"=$2',values:[e,t]});await wt.none(s)}}class de{static async select(t){return le.select(t)}static async insert(t){return le.insert(t)}static async update(t){return le.update(t)}}const{ec:me}=b;const he=new me("secp256k1");const ye=s();const ge=new class{configFile;loaded=!1;load=()=>{try{const t="dev"===it?"bcn.test.config.json":"bcn.config.json";const e=M(N(import.meta.url));this.configFile=T.readFileSync(x.join(e,"..","..",t)),this.loaded=!0}catch(t){if(t.message.includes("ENOENT: no such file or directory"))return void(this.loaded=!0);throw dt.error(`Access-list failed with error '${t.message}'`),t}};middleware=({url:t},e,s)=>{if(void 0!==e.locals.authToken)if(this.loaded||(dt.warn("Access-list failed with error 'AccessList not loaded.'. Loading now."),this.load()),void 0!==this.configFile)try{const{blacklist:t,whitelist:r}=JSON.parse(this.configFile.toString());if(t&&r)return void e.status(403).json({error:"Cannot enforce blacklist and whitelist at the same time."});const{publicKey:a}=e.locals.authToken;if(r&&!r.includes(a)||t&&t.includes(a))return void e.status(403).json({error:`Public key ${a} is not allowed.`});s()}catch(s){dt.error(`Authorization failed at ${t} with error: '${s.message}'`),e.status(403).json({error:s.message})}else s();else s()}};let we;h(o);try{we=r.createServer(ye)}catch(t){throw dt.error(`Starting server failed with error '${t.message}'`),t}if(dt.info(`Server listening on port ${L}`),ye.use(e()),"true"===Q){const t=n({windowMs:parseInt(tt,10),max:parseInt(et,10),standardHeaders:"true"===st,legacyHeaders:"true"===rt});ye.use(t)}ye.use(t.json({limit:"100mb"})),ye.use(t.urlencoded({limit:"100mb",extended:!0})),ye.get("/",((t,e)=>e.status(200).send(`\n        <h2>Bitcoin Computer Node</h2>\n        <b>Status</b>: Healthy <br />\n        <b>Version</b>: ${ht} <br />\n        <b>Chain</b>: ${P} <br />\n        <b>Network</b>: ${A}\n    `))),ge.loaded&&(ye.use((async(t,e,s)=>{try{const r=t.get("Authentication");if(!r){const{method:s,url:r}=t;const a=`Auth failed with error 'no Authentication key provided' ${s} ${t.get("Host")} ${r}`;return dt.error(a),void e.status(401).json({error:a})}const a=(t=>{const e=t.split(" ");if(2!==e.length||"Bearer"!==e[0])throw new Error("Authentication header is invalid.");const s=Buffer.from(e[1],"base64").toString().split(":");if(3!==s.length)throw new Error;return{signature:s[0],publicKey:s[1],timestamp:parseInt(s[2],10)}})(r);const{signature:n,publicKey:o,timestamp:i}=a;if(Date.now()-i>18e4)return void e.status(401).json({error:"Signature is too old."});const c=I.sha256().update(ot+i).digest("hex");if(!he.keyFromPublic(o,"hex").verify(c,n)){const t="The origin and public key pair doesn't match the signature.";return void e.status(401).json({error:t})}const u=await de.select(o);if(u){if(u.clientTimestamp>=i)return void e.status(401).json({error:"Please use a fresh authentication token."});await de.update({publicKey:o,clientTimestamp:i})}else await de.insert({publicKey:o,clientTimestamp:i});e.locals.authToken=a,s()}catch(t){dt.error(`Auth failed with error '${t.message}'`),e.status(401).json({error:t.message})}})),ye.use(ge.middleware));const fe=(()=>{const t=s.Router();return t.get("/wallet/:address/utxos",(async({params:t,url:e},s)=>{try{const{address:e}=t;s.status(200).json(await Rt.select(e))}catch(t){dt.error(`GET ${e} failed with error '${t.message}'`),s.status(500).json({error:t.message})}})),t.get("/wallet/:address/sent-outputs",(async({params:t,url:e},s)=>{try{const{address:e}=t;s.status(200).json(await ee.listSentOutputs(e))}catch(t){dt.error(`GET ${e} failed with error '${t.message}'`),s.status(500).json({error:t.message})}})),t.get("/wallet/:address/received-outputs",(async({params:t,url:e},s)=>{try{const{address:e}=t;s.status(200).json(await ee.listReceivedOutputs(e))}catch(t){dt.error(`GET ${e} failed with error '${t.message}'`),s.status(500).json({error:t.message})}})),t.get("/wallet/:address/list-txs",(async({params:t,url:e},s)=>{try{const{address:e}=t;s.status(200).json(await ee.listTxs(e))}catch(t){dt.error(`GET ${e} failed with error '${t.message}'`),s.status(500).json({error:t.message})}})),t.get("/non-standard-utxos",(async(t,e)=>{try{const s=new URLSearchParams(t.url.split("?")[1]);const r={mod:s.get("mod"),publicKey:s.get("publicKey"),limit:s.get("limit"),order:s.get("order"),offset:s.get("offset"),ids:JSON.parse(s.get("ids"))};const a=await ee.query(r);e.status(200).json(a)}catch(s){dt.error(`GET ${t.url} failed with error '${s.messages}'`),e.status(500).json({error:s.message})}})),t.get("/address/:address/balance",(async({params:t,url:e},s)=>{try{const{address:e}=t;s.status(200).json(await Rt.getBalance(e))}catch(t){dt.error(`GET ${e} failed with error '${t.message||t}'`),s.status(500).json({error:t.message})}})),t.post("/tx/bulk",(async({body:{txIds:t},url:e},s)=>{try{if(void 0===t||0===t.length)return void s.status(400).json({error:"Missing input txIds."});const e=await Wt.getRaw(t);e?s.status(200).json(e):s.status(404).json({error:"Not found"})}catch(t){dt.error(`POST ${e} failed with error '${t.message}'`),s.status(500).json({error:t.message})}})),t.post("/tx/post",(async({body:{hex:t},url:e},s)=>{try{if(!t)return void s.status(400).json({error:"Missing input hex."});const e=await Wt.sendRaw(t);e?s.status(200).json(e):s.status(404).json({error:"Error Occured"})}catch(r){dt.error(`POST ${e} failed with error '${r.message}\ntxHex: ${t}`),s.status(500).json({error:r.message})}})),t.get("/mine",(async({query:{count:t},url:e},s)=>{try{const{result:e}=await qt.getnewaddress();if("string"!=typeof t)throw new Error("Please provide appropriate count");return await qt.generatetoaddress(parseInt(t,10)||1,e),s.status(200).json({success:!0})}catch(t){return dt.error(`POST ${e} failed with error '${t.message}'`),s.status(500).json({error:t.message})}})),t.get("/:id/height",(async({params:{id:t},url:e},s)=>{try{let e=t;if("best"===t){const{result:t}=await qt.getbestblockhash();e=t}const{result:r}=await qt.getblockheader(e,!0);return s.status(200).json({height:r.height})}catch(t){return dt.error(`POST ${e} failed with error '${t.message}'`),s.status(500).json({error:t.message})}})),t.post("/faucet",(async({body:{address:t,value:e},url:s},r)=>{try{const s=parseInt(e,10)/1e8;const{result:a}=await qt.sendtoaddress(t,s);await qt.generateToAddress(1,"mvFeNF9DAR7WMuCpBPbKuTtheihLyxzj8i");const{result:n}=await qt.getrawtransaction(a,1);const o=n.vout.findIndex((t=>1e8*t.value===parseInt(e,10)));return r.status(200).json({txId:a,vout:o,height:-1,satoshis:e})}catch(t){return dt.error(`POST ${s} failed with error '${t.message}'`),r.status(500).json({error:t.message})}})),t.post("/faucetScript",(async({body:{script:t,value:e},url:s},r)=>{try{const s=re.makeRandom({network:ae});const a=l.p2pkh({pubkey:s.publicKey,network:ae});const{address:n}=a;const o=(await qt.sendtoaddress(n,2*parseInt(e,10)/1e8,"","")).result;let i;let c=10;for(;!i;)if(i=(await Rt.select(n)).filter((t=>t.txId===o))[0],!i){if(c-=1,c<=0)throw new Error("No outputs");await se(10)}const u=(await qt.getrawtransaction(i.txId,1)).result;const p=new d({network:ae});p.addInput({hash:i.txId,index:i.vout,nonWitnessUtxo:Buffer.from(u.hex,"hex")}),p.addOutput({script:Buffer.from(t,"hex"),value:parseInt(e,10)}),p.signInput(0,s),p.finalizeAllInputs();const m=p.extractTransaction();let h;for(await qt.sendrawtransaction(m.toHex()),c=5;!h;)if(h=(await Rt.selectByScriptHex(t)).filter((t=>t.txId===m.getId()))[0],!h){if(c-=1,c<=0)throw new Error("No outputs");await se(10)}return r.status(200).json({txId:m.getId(),vout:h.vout,height:-1,satoshis:h.satoshis})}catch(t){return dt.error(`POST ${s} failed with error '${t.message}'`),r.status(500).json({error:t.message})}})),t.get("/tx/:txId/json",(async({params:{txId:t},url:e},s)=>{try{if(!t)return void s.status(400).json({error:"Missing input txId."});const e=await Wt.getRawJSON(t);e?s.status(200).json(e):s.status(404).json({error:"Not found"})}catch(t){dt.error(`GET ${e} failed with error '${t.message}'`),s.status(500).json({error:t.message})}})),t.post("/revs",(async({body:{ids:t},url:e},s)=>{try{if(void 0===t||0===t.length)return void s.status(400).json({error:"Missing input object ids."});const e=await Qt.getLatestRevs(t);s.status(200).json(e)}catch(t){dt.error(`POST ${e} failed with error '${t.message}'`),s.status(500).json({error:t.message})}})),t.post("/revToId",(async({body:{rev:t},url:e},s)=>{try{if(!zt(t))return void s.status(400).json({error:"Invalid rev id"});const e=await Qt.getIdByRev(t);e&&s.status(200).json(e),s.status(404).json()}catch(t){dt.error(`POST ${e} failed with error '${t.message}'`),s.status(500).json({error:t.message})}})),t.post("/rpc",(async({body:t,url:e},s)=>{try{if(!t||!t.method)throw new Error("Please provide appropriate RPC method name");if(!new RegExp(G).test(t.method))throw new Error("Method is not allowed");const e=function(t,e){if(void 0===Jt[t]||null===Jt[t])throw new Error("This RPC method does not exist, or not supported");const s=e.trim().split(" ");const r=Jt[t].trim().split(" ");if(0===e.trim().length&&0!==Jt[t].trim().length)throw new Error(`Too few params provided. Expected ${r.length} Provided 0`);if(0!==e.trim().length&&0===Jt[t].trim().length)throw new Error(`Too many params provided. Expected 0 Provided ${s.length}`);if(s.length<r.length)throw new Error(`Too few params provided. Expected ${r.length} Provided ${s.length}`);if(s.length>r.length)throw new Error(`Too many params provided. Expected ${r.length} Provided ${s.length}`);return 0===e.length?[]:s.map(((t,e)=>Vt[r[e]](t)))}(t.method,t.params);const r=e.length?await qt[t.method](...e):await qt[t.method]();s.status(200).json({result:r})}catch(t){dt.error(`POST ${e} failed with error '${t.message}'`),s.status(500).json({error:t.message})}})),t.post("/non-standard-utxo",(async(t,e)=>{e.status(500).json({error:"Please upgrade to @bitcoin-computer/lib to the latest version."})})),t})();ye.use(`/v1/${P}/${A}`,fe),ye.use("/v1/store",Tt),we.listen(L,(()=>{dt.info(`\nStarted Bitcoin Computer Node Version ${ht}\nPORT ${L} \n`)})).on("error",(t=>{dt.error(t.message),process.exit(1)}));const ve=new a.Subscriber;ve.connect(W),ve.subscribe("rawtx"),dt.info(`ZMQ Subscriber connected to ${W}`),(async()=>{await(async()=>{await E((()=>wt.connect()),{startingDelay:500})})(),await ue.sub(ve)})();
