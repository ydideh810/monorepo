import{backOff as t}from"exponential-backoff";import{Computer as e}from"@bitcoin-computer/lib";import s from"dotenv";import n from"fs";import a,{Transaction as r}from"@bitcoin-computer/nakamotojs-lib";import o from"winston";import i from"winston-daily-rotate-file";import c from"bitcoind-rpc";import d from"util";import l from"pg-promise";import p from"pg-monitor";s.config();const m=JSON.parse(n.readFileSync("package.json","utf8"));function y(t,e){switch(t){case"BTC":return"mainnet"===e?a.networks.bitcoin:a.networks.testnet;case"LTC":return"mainnet"===e?a.networks.litecoin:a.networks.litecoinregtest;default:throw new Error("We currently only support BTC and LTC, support for other currencies will be added soon.")}}const{PORT:u,ZMQ_URL:h,CHAIN:f,NETWORK:g,BCN_ENV:w,BCN_URL:S,DEBUG_MODE:$,POSTGRES_USER:E,POSTGRES_PASSWORD:R,POSTGRES_DB:T,POSTGRES_HOST:N,POSTGRES_PORT:I,RPC_PROTOCOL:O,RPC_USER:v,RPC_PASSWORD:b,RPC_HOST:M,RPC_PORT:C,SERVER_VERSION:_,DEFAULT_WALLET:A,SYNC_INTERVAL_CHECK:H,POSTGRES_MAX_PARAM_NUM:D,DB_CONNECTION_RETRY_TIME:k,SIGNATURE_FRESHNESS_MINUTES:x,ALLOWED_RPC_METHODS:P,NODE_MAX_PROGRESS:Y,SYNC_MAX_PROGRESS:B,MAX_BLOCKCHAIN_HEIGHT:L,MWEB_HEIGHT:F,BC_START_HEIGHT:W,WORKER_ID:K,NUM_WORKERS:U,SYNC_NON_STANDARD:G,ZMQ_WAIT_PERCENTAGE:j,QUERY_LIMIT:V,LOG_MAX_FILE_SIZE:z,LOG_MAX_FILE_NUM:q,LOG_ZIP:X,RPC_URL:Z,RPC_BATCHSIZE:J,RPC_CONCURRENT:Q,INDEXDB:tt,KEYDB:et}=process.env;const st=parseInt(u,10)||"1031";const nt=f||"LTC";const at=g||"regtest";const rt=w||"dev";const ot=S||`http://127.0.0.1:${st}`;const it=parseInt($,10)||1;const ct=E||"bcn";const dt=R||"bcn";const lt=T||"bcn";const pt=N||"127.0.0.1";const mt=parseInt(I,10)||"5432";const yt=O||"http";const ut=v||"bcn-admin";const ht=b||"kH4nU5Okm6-uyC0_mA5ztVNacJqZbYd_KGLl6mx722A=";const ft=M||"node";const gt=parseInt(C,10)||19332;m.version;const wt=parseInt(D,10)||1e4;const St=parseInt(k,10)||500;!P||P.split(",").map((t=>new RegExp(t)));const $t=parseInt(W||"",10)||25e5;const Et=parseInt(K,10)||1;const Rt=parseInt(U||"",10)||1;const Tt="true"===G||!1;const Nt=parseInt(V||"",10)||100;const It=z||"20m";const Ot=q||"14d";const vt=!!X;o.addColors({error:"red",warn:"yellow",info:"green",http:"magenta",debug:"white"});const bt=o.format.combine(o.format.colorize(),o.format.timestamp({format:"YYYY-MM-DD HH:mm:ss:ms"}),o.format.json(),o.format.printf((t=>`${t.timestamp} [${t.level.slice(5).slice(0,-5)}] ${t.message}`)));const Mt={zippedArchive:vt,maxSize:It,maxFiles:Ot,dirname:"logs"};const Ct=[];"dev"===rt&&Ct.push(new o.transports.Console({format:o.format.combine(o.format.colorize(),o.format.timestamp({format:"MM-DD-YYYY HH:mm:ss"}),o.format.printf((t=>`${t.timestamp} ${t.level} ${t.message}`)))})),it>=0&&Ct.push(new i({filename:"error-%DATE%.log",datePattern:"YYYY-MM-DD",level:"error",...Mt})),it>=1&&Ct.push(new i({filename:"warn-%DATE%.log",datePattern:"YYYY-MM-DD",level:"warn",...Mt})),it>=2&&Ct.push(new i({filename:"info-%DATE%.log",datePattern:"YYYY-MM-DD",level:"info",...Mt})),it>=3&&Ct.push(new i({filename:"http-%DATE%.log",datePattern:"YYYY-MM-DD",level:"http",...Mt})),it>=4&&Ct.push(new i({filename:"debug-%DATE%.log",datePattern:"YYYY-MM-DD",level:"debug",...Mt})),Ct.push(new i({filename:"logs-%DATE%.log",datePattern:"YYYY-MM-DD"}));const _t=o.createLogger({levels:{error:0,warn:1,info:2,http:3,debug:4},format:bt,transports:Ct,exceptionHandlers:[new o.transports.File({filename:"logs/exceptions.log"})],rejectionHandlers:[new o.transports.File({filename:"logs/rejections.log"})]});const At=new c({protocol:yt,user:ut,pass:ht,host:ft,port:gt});const Ht=d.promisify(c.prototype.createwallet.bind(At));const Dt=d.promisify(c.prototype.generateToAddress.bind(At));const kt=d.promisify(c.prototype.getaddressinfo.bind(At));const xt=d.promisify(c.prototype.getBlock.bind(At));const Pt=d.promisify(c.prototype.getBlockchainInfo.bind(At));const Yt=d.promisify(c.prototype.getBlockHash.bind(At));const Bt=d.promisify(c.prototype.getRawTransaction.bind(At));const Lt=d.promisify(c.prototype.getRawTransaction.bind(At));const Ft=d.promisify(c.prototype.getTransaction.bind(At));const Wt=d.promisify(c.prototype.getNewAddress.bind(At));const Kt={createwallet:Ht,generateToAddress:Dt,getaddressinfo:kt,getBlock:xt,getBlockchainInfo:Pt,getBlockHash:Yt,getRawTransaction:Bt,getTransaction:Ft,importaddress:d.promisify(c.prototype.importaddress.bind(At)),listunspent:d.promisify(c.prototype.listunspent.bind(At)),sendRawTransaction:d.promisify(c.prototype.sendRawTransaction.bind(At)),getNewAddress:Wt,sendToAddress:d.promisify(c.prototype.sendToAddress.bind(At)),getRawTransactionJSON:Lt};const Ut={error:(t,e)=>{if(e.cn){const{host:s,port:n,database:a,user:r,password:o}=e.cn;_t.debug(`Waiting for db to start { message:${t.message} host:${s}, port:${n}, database:${a}, user:${r}, password: ${o}`)}},noWarnings:!0};"dev"===rt&&it>0&&(p.isAttached()?p.detach():(p.attach(Ut),p.setTheme("matrix")));const Gt=l(Ut)({host:pt,port:mt,database:lt,user:ct,password:dt,allowExitOnIdle:!0,idleTimeoutMillis:100});const{PreparedStatement:jt}=l;class Vt{static async select(t){const e=new jt({name:`SyncStatus.select.${Math.random()}`,text:'SELECT "syncedHeight" FROM "SyncStatus" WHERE "workerId" = $1',values:[t]});return Gt.one(e)}static async update({syncedHeight:t,workerId:e}){const s=new jt({name:`SyncStatus.update.${Math.random()}`,text:'UPDATE "SyncStatus" SET "syncedHeight" = $1 WHERE "workerId" = $2',values:[t,e]});await Gt.any(s)}static async insert({syncedHeight:t,workerId:e}){const s=new jt({name:`SyncStatus.insert.${Math.random()}`,text:'INSERT INTO  "SyncStatus"("syncedHeight","workerId") VALUES ($1, $2) ON CONFLICT DO NOTHING',values:[t,e]});await Gt.any(s)}}class zt{static async select(t){return Vt.select(t)}static async update(t){await Vt.update(t)}static async insert(t){await Vt.insert(t)}}class qt{static updateSync=async t=>zt.update(t);static selectSync=async t=>zt.select(t);static insertSync=async t=>zt.insert(t)}function Xt(t){if(!/^[0-9A-Fa-f]{64}:\d+$/.test(t))throw new Error("Invalid rev")}const{PreparedStatement:Zt}=l;class Jt{static async query(t){const{publicKey:e,hash:s,limit:n,offset:a,order:r,ids:o,mod:i}=t;if(n&&parseInt(n||"",10)>Nt||o&&o.length>Nt)throw new Error(`Can't fetch more than ${Nt} revs.`);if(r&&"ASC"!==r&&"DESC"!==r)throw new Error("Invalid order");let c='SELECT "rev"\n      FROM "NonStandard"\n      WHERE true ';const d=[];e&&(d.push(e),c+=` AND $${d.length} = ANY ("publicKeys")`),s&&(d.push(s),c+=` AND "hash" = $${d.length}`),i&&(d.push(i),c+=` AND "mod" = $${d.length}`),o&&o.length&&(o.map(Xt),d.push(o),c+=` AND "id" = ANY ($${d.length})`),r&&(c+=` order by "lastUpdated" ${r}`),d.push(n||Nt),c+=` limit $${d.length}`,a&&(d.push(a),c+=` offset $${d.length}`);const l=new Zt({name:`NonStandard.query.${Math.random()}`,text:c,values:d});return(await Gt.any(l)).map((t=>t.rev))}static async insert({id:t,rev:e,publicKeys:s,hash:n,mod:a}){const r=new Zt({name:`NonStandard.insert.${Math.random()}`,text:'INSERT INTO "NonStandard"("id", "rev", "publicKeys", "hash", "mod") VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING',values:[t,e,s,n,a]});await Gt.none(r)}static async update({id:t,rev:e,publicKeys:s}){const n=new Zt({name:`NonStandard.update.${Math.random()}`,text:'UPDATE "NonStandard" SET "rev"=$2, "publicKeys"=$3 WHERE "id" = $1',values:[t,e,s]});return Gt.none(n)}static async delete({rev:t}){const e=new Zt({name:`NonStandard.delete.${Math.random()}`,text:'DELETE FROM "NonStandard" WHERE "rev" = $1',values:[t]});await Gt.none(e)}static async getRevsByIds(t){if(t&&t.length>Nt)throw new Error(`Can't fetch more than ${Nt} revs.`);const e=new Zt({name:`NonStandard.getRevsByIds.${Math.random()}`,text:'SELECT "rev" FROM "NonStandard" WHERE "id" LIKE ANY($1)',values:[[t]]});return Gt.any(e)}static async select(t){const e=new Zt({name:`NonStandard.select.${Math.random()}`,text:'SELECT "id", "hash", "mod" FROM "NonStandard" WHERE "rev" = $1',values:[t]});return Gt.oneOrNone(e)}}class Qt{static async select(t){return Jt.select(t)}static async query(t){return Jt.query(t)}static async getRevsByIds(t){return Jt.getRevsByIds(t)}static async insert(t){return Jt.insert(t)}static async update(t){return Jt.update(t)}static async delete(t){return Jt.delete({rev:t})}}class te{static add=async t=>{const{zip:e,outData:s}=t;for(let t=0;t<e.length;t+=1){const[n,r]=e[t];const{exp:o="",_owners:i=[],mod:c=""}=s[t]||{};if(!n&&r)Xt(r),await Qt.insert({id:r,rev:r,publicKeys:i,hash:a.crypto.sha256(Buffer.from(o)).toString("hex"),mod:c});else if(n&&r){const{id:t,hash:e,mod:s}=await Qt.select(n)||{};await Qt.update({id:t,rev:r,publicKeys:i,hash:e,mod:s})}else n&&!r&&await Qt.delete(n)}};static query=async t=>Qt.query(t);static getRevsByIds=async t=>(await Qt.getRevsByIds(t)).map((t=>t.rev))}const{PreparedStatement:ee}=l;class se{static async select(t){const e=new ee({name:`Input.select.${Math.random()}`,text:'SELECT "rev" FROM "Input" WHERE "rev" = $1',values:[t]});return Gt.any(e)}static async insert(t){const e=t.flatMap((t=>[t.rev]));for(;e.length;){const t=e.splice(0,wt);const s=[];for(let e=1;e<=t.length;e+=1)s.push(`($${e})`);const n=s.join(",");const a=new ee({name:`Input.insert.${Math.random()}`,text:`INSERT INTO "Input"("rev") VALUES ${n} ON CONFLICT DO NOTHING`,values:t});await Gt.none(a)}}static async count(t){const e=t.map((t=>t.rev));const s=new ee({name:`Input.belong.${Math.random()}`,text:'SELECT count(*) FROM "Input" WHERE "rev" LIKE ANY ($1)',values:[[e]]});const n=await Gt.oneOrNone(s);return parseInt(n?.count,10)||0}}class ne{static async select(t){return se.select(t)}static async insert(t){return se.insert(t)}}class ae{static getNonCoinbaseRevs=t=>t.filter((t=>!r.isCoinbaseHash(t.hash))).map((({hash:t,index:e})=>({rev:`${a.bufferUtils.reverseBuffer(Buffer.from(t)).toString("hex")}:${e}`})));static insert=async t=>ne.insert(this.getNonCoinbaseRevs(t))}const{PreparedStatement:re}=l;class oe{static async select(t){const e=new re({name:`Output.select.${Math.random()}`,text:'SELECT "address", "satoshis", "scriptPubKey", "rev" FROM "Output" WHERE "address" = $1',values:[t]});return Gt.any(e)}static async insert(t){const e=t.flatMap((t=>[t.rev,t.address,t.satoshis,t.scriptPubKey,t.publicKeys]));for(;e.length;){const t=e.splice(0,wt);const s=[];for(let e=1;e<=t.length;e+=5)s.push(`($${e}, $${e+1}, $${e+2}, $${e+3}, $${e+4})`);const n=s.join(",");const a=new re({name:`Output.insert.${Math.random()}`,text:`INSERT INTO "Output"("rev", "address", "satoshis", "scriptPubKey", "publicKeys") VALUES ${n}  ON CONFLICT DO NOTHING`,values:t});await Gt.none(a)}}}class ie{static async select(t){return oe.select(t)}static async insert(t){return oe.insert(t)}}class ce{static insert=async t=>{const e=t.flatMap((t=>t.tx.outs.map(((e,s)=>{const{script:n}=e;let r;let o;try{r=a.address.fromOutputScript(n,y(nt,at))}catch(t){r=null}try{o=a.payments.p2ms({output:n,network:y(nt,at)}).pubkeys.map((t=>t.toString("hex")))}catch(t){o=null}const i=n.toString("hex");const c=Math.round(e.value);return{address:r,rev:`${t.txId}:${s}`,scriptPubKey:i,satoshis:c,publicKeys:o}}))));return ie.insert(e)}}const de=new e({chain:nt,network:at,url:ot});class le{static waitForBlock=async e=>{await t((async()=>{_t.info(`Sync workerId ${Et}: waiting for block ${e} ...`),await Kt.getBlockHash(e)}),{startingDelay:3e4,timeMultiple:1,numOfAttempts:720}),_t.info(`Node is ready. Starting Sync actions for worker ${Et}`)};static syncBlock=async t=>{const{result:e}=await Kt.getBlockHash(t);const{result:s}=await Kt.getBlock(e,2);const{tx:n}=s;_t.info(`Backfilling progress ${t} Backfilling ${n.length} transactions...`);const a=await Promise.allSettled(n.map((t=>de.txFromHex({hex:t.hex}))));const r=a.filter((t=>"fulfilled"===t.status)).map((t=>t.value));const o=a.filter((t=>"rejected"===t.status)).map((t=>t.reason));var i,c;o.length&&_t.error(`Failed to parse ${o.length} transactions of block num ${t}: ${o.map((t=>t)).join(", ")}\n        Failed txs: ${i=n.map((t=>t.id)),c=r.map((t=>t.tx.getId())),i.filter((t=>-1===c.indexOf(t)))}`),await this.syncTxs(r,t)};static sync=async(t,e,s,n)=>{try{let a=e;const r=await qt.selectSync(t);for(r.syncedHeight>e&&(a=r.syncedHeight+s),_t.info(`Starting sync process { initialBlock: ${e} increment: ${s} nonStandard: ${n} syncedHeight:${r.syncedHeight}, currentBlockHeight:${a} }`);n||a<$t;)try{await this.syncBlock(a),await qt.updateSync({syncedHeight:a,workerId:t}),a+=s}catch(t){t.message.includes("out of range")||_t.error(`Syncing block num ${a} failed with error '${t.message}'`)}}catch(t){_t.error(`Sync action failed with error '${t.message}'`)}};static syncTxs=async(t,e)=>{try{await ce.insert(t),await ae.insert(t.flatMap((t=>t.tx.ins))),e>=$t&&t.map((async t=>{try{t.isBcTx(nt,at)&&await te.add(t)}catch(e){_t.error(`Failed to add non-standard tx ${t.tx.getId()} ${e.message}`)}}))}catch(t){_t.error(`Processing block ${e} failed with error '${t.message}'`)}};static register=async t=>{try{await qt.insertSync({syncedHeight:-1,workerId:t}),_t.info(`Register workerId: '${t}'`)}catch(t){_t.error(`Register action failed with error '${t.message}'`)}}}!function(){try{const e=`Synchronizing { nonStandard:${Tt} url: ${ot}, chain:${nt} network:${at} numWorkers: ${Rt} workerId: ${Et} }`;_t.info(e),"regtest"!==at&&(async()=>{if(await(async()=>{await t((()=>Gt.connect()),{startingDelay:St})})(),await le.register(Et),Tt)await le.waitForBlock($t),await le.sync(Et,$t,1,Tt);else{const t=await qt.selectSync(Et);const e=t.syncedHeight>0?t.syncedHeight+1:Et;_t.info(`Worker ${Et} waiting for block ${e}...`),await le.waitForBlock(e),_t.info(`Worker ${Et} starting sync on block ${e}...`),await le.sync(Et,e,Rt,!1)}})()}catch(t){_t.error(`Synchronizing failed with error '${t.message}'`)}}();
