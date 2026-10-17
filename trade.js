/* ===== Trade View: candlestick charts and live trades from real markets (Binance public market data) ===== */
const HOSTS=[['https://api.binance.com','wss://stream.binance.com:9443'],['https://data-api.binance.vision','wss://data-stream.binance.vision']];let HI=0;
async function bj(path){let err;for(let k=0;k<HOSTS.length;k++){const i=(HI+k)%HOSTS.length;try{const r=await fetch(HOSTS[i][0]+path);if(r.ok){HI=i;return await r.json()}err=new Error('HTTP '+r.status)}catch(e){err=e}}throw err||new Error('unreachable')}
const MK=[['BTCUSDT','Bitcoin'],['ETHUSDT','Ethereum'],['PAXGUSDT','Gold (PAXG, 1 token = 1 oz)'],['BNBUSDT','BNB'],['SOLUSDT','Solana'],['XRPUSDT','XRP'],['ADAUSDT','Cardano'],['DOGEUSDT','Dogecoin'],['AVAXUSDT','Avalanche'],['DOTUSDT','Polkadot'],['LINKUSDT','Chainlink'],['LTCUSDT','Litecoin'],['TRXUSDT','TRON'],['ATOMUSDT','Cosmos'],['UNIUSDT','Uniswap'],['ETCUSDT','Ethereum Classic'],['XLMUSDT','Stellar'],['FILUSDT','Filecoin'],['NEARUSDT','NEAR'],['APTUSDT','Aptos'],['ARBUSDT','Arbitrum'],['OPUSDT','Optimism'],['INJUSDT','Injective'],['SUIUSDT','Sui'],['SHIBUSDT','Shiba Inu'],['PEPEUSDT','Pepe'],['TONUSDT','Toncoin'],['AAVEUSDT','Aave'],['BCHUSDT','Bitcoin Cash'],['ICPUSDT','Internet Computer'],['HBARUSDT','Hedera'],['ALGOUSDT','Algorand'],['VETUSDT','VeChain'],['RUNEUSDT','THORChain'],['EURUSDT','Euro / USDT'],['GBPUSDT','British pound / USDT'],['AUDUSDT','Australian dollar / USDT'],['TRYUSDT','Turkish lira / USDT'],['BRLUSDT','Brazilian real / USDT']];
const TDM=[['AAPL','Apple'],['MSFT','Microsoft'],['NVDA','NVIDIA'],['TSLA','Tesla'],['AMZN','Amazon'],['GOOGL','Alphabet'],['META','Meta'],['SPY','S&P 500 ETF'],['QQQ','Nasdaq 100 ETF'],['XAU/USD','Gold spot'],['XAG/USD','Silver spot'],['WTI/USD','Crude oil WTI'],['EUR/USD','EUR/USD'],['GBP/USD','GBP/USD'],['USD/JPY','USD/JPY']];
const TFS=[['1m','1m'],['5m','5m'],['15m','15m'],['1h','1H'],['4h','4H'],['1d','1D'],['1w','1W']],TDI={'1m':'1min','5m':'5min','15m':'15min','1h':'1h','4h':'4h','1d':'1day','1w':'1week'};
const S={sym:'BTCUSDT',tf:'1h',candles:[],view:{n:110,off:0},ticker:{},fav:new Set(),ws:null,tape:[],book:null,mx:null,my:null,dirty:true,td:'',drag:null,q:''};
try{S.fav=new Set(JSON.parse(localStorage.getItem('zack.trade.fav')||'[]'));S.td=localStorage.getItem('zack.trade.tdkey')||''}catch(e){}
const isTD=s=>TDM.some(m=>m[0]===s);
const nameOf=s=>(MK.find(m=>m[0]===s)||TDM.find(m=>m[0]===s)||[s,s])[1];
function fmt(p){p=+p;if(!isFinite(p))return'--';const a=Math.abs(p);return a>=1000?p.toLocaleString(undefined,{maximumFractionDigits:2}):a>=1?p.toFixed(2):a>=.01?p.toFixed(4):p.toFixed(8)}
const sma=(a,n)=>{const o=[];let s=0;for(let i=0;i<a.length;i++){s+=a[i];if(i>=n)s-=a[i-n];o.push(i>=n-1?s/n:null)}return o};
const ema=(a,n)=>{const k=2/(n+1),o=[];let e=null;for(let i=0;i<a.length;i++){e=e==null?a[i]:a[i]*k+e*(1-k);o.push(i>=n-1?e:null)}return o};
/* ---- data ---- */
async function loadTicker(){try{const j=await bj('/api/v3/ticker/24hr?type=MINI'),m={};j.forEach(x=>{m[x.symbol]=x});S.ticker=m;renderRows();paintHead()}catch(e){$('tvCount').textContent='offline'}}
async function loadCandles(){const sym=S.sym,tf=S.tf;S.candles=[];S.dirty=true;
  try{if(isTD(sym)){if(!S.td)throw new Error('Add a Twelve Data key');const r=await fetch('https://api.twelvedata.com/time_series?symbol='+encodeURIComponent(sym)+'&interval='+TDI[tf]+'&outputsize=300&apikey='+encodeURIComponent(S.td)),j=await r.json();if(j.status==='error')throw new Error(j.message||'provider error');
      if(S.sym!==sym||S.tf!==tf)return;S.candles=(j.values||[]).map(v=>({t:new Date(String(v.datetime).replace(' ','T')+'Z').getTime(),o:+v.open,h:+v.high,l:+v.low,c:+v.close,v:+(v.volume||0)})).reverse()}
    else{const j=await bj('/api/v3/klines?symbol='+sym+'&interval='+tf+'&limit=500');if(S.sym!==sym||S.tf!==tf)return;S.candles=j.map(k=>({t:k[0],o:+k[1],h:+k[2],l:+k[3],c:+k[4],v:+k[5]}))}}
  catch(e){$('tvTip').textContent='Could not load candles: '+e.message}S.view.off=0;S.dirty=true;paintHead()}
async function loadTape(){if(isTD(S.sym)){S.tape=[];renderTape();return}const sym=S.sym;try{const j=await bj('/api/v3/trades?symbol='+sym+'&limit=30');if(sym!==S.sym)return;S.tape=j.map(t=>({id:t.id,price:+t.price,qty:+t.qty,time:t.time,sell:t.isBuyerMaker})).reverse();renderTape()}catch(e){}}
async function loadBook(){if(isTD(S.sym)){setH($('tvBook'),'<div style="opacity:.8">Not available for this market.</div>');return}const sym=S.sym;try{const j=await bj('/api/v3/depth?symbol='+sym+'&limit=10');if(sym===S.sym){S.book=j;renderBook()}}catch(e){}}
function setLast(p){const L=S.candles[S.candles.length-1];if(L){L.c=p;L.h=Math.max(L.h,p);L.l=Math.min(L.l,p)}if(S.ticker[S.sym])S.ticker[S.sym].lastPrice=String(p);S.dirty=true}
function closeWS(){if(S.ws){const w=S.ws;S.ws=null;try{w.close()}catch(e){}}}
function connect(){closeWS();if(isTD(S.sym)){$('tvLive').textContent='polling';return}const s=S.sym.toLowerCase(),url=HOSTS[HI][1]+'/stream?streams='+s+'@kline_'+S.tf+'/'+s+'@trade';let w;try{w=new WebSocket(url)}catch(e){$('tvLive').textContent='no websocket';return}S.ws=w;
  w.onopen=()=>{if(S.ws===w)$('tvLive').textContent='LIVE'};
  w.onmessage=ev=>{let d;try{d=JSON.parse(ev.data)}catch(e){return}const p=d.data||d;
    if(p.e==='kline'){const k=p.k,c={t:k.t,o:+k.o,h:+k.h,l:+k.l,c:+k.c,v:+k.v},L=S.candles[S.candles.length-1];if(L&&L.t===c.t)S.candles[S.candles.length-1]=c;else if(!L||c.t>L.t)S.candles.push(c);S.dirty=true}
    else if(p.e==='trade'){S.tape.unshift({id:p.t,price:+p.p,qty:+p.q,time:p.T,sell:p.m});if(S.tape.length>40)S.tape.length=40;if(S.ticker[S.sym])S.ticker[S.sym].lastPrice=p.p;S.tapeDirty=true;S.hdr=true}};
  w.onclose=()=>{if(S.ws===w){$('tvLive').textContent='reconnecting';HI=(HI+1)%HOSTS.length;setTimeout(()=>{if(S.ws===w)connect()},3000)}}}
/* ---- UI ---- */
function paintHead(){const t=S.ticker[S.sym],L=S.candles[S.candles.length-1];$('tvSym').textContent=S.sym;$('tvName').textContent=nameOf(S.sym);
  const last=t?+t.lastPrice:L?L.c:NaN;$('tvPrice').textContent=fmt(last);
  if(t){const ch=(+t.lastPrice-+t.openPrice)/+t.openPrice*100;$('tvChg').textContent=(ch>=0?'+':'')+ch.toFixed(2)+'% 24h';$('tvChg').style.color=ch>=0?'var(--g)':'var(--r)';$('tvStats').textContent='24h high '+fmt(t.highPrice)+' · low '+fmt(t.lowPrice)+' · volume '+(+t.quoteVolume).toLocaleString(undefined,{maximumFractionDigits:0})+' USDT'}
  else{$('tvChg').textContent='';$('tvStats').textContent=isTD(S.sym)?'Quotes from Twelve Data':''}}
function renderRows(){const list=MK.filter(m=>S.ticker[m[0]]||!Object.keys(S.ticker).length).map(m=>m[0]).concat(S.td?TDM.map(m=>m[0]):[]),q=S.q.toLowerCase();
  const rows=list.filter(s=>!q||s.toLowerCase().includes(q)||nameOf(s).toLowerCase().includes(q)).sort((a,b)=>(S.fav.has(b)-S.fav.has(a)));
  $('tvCount').textContent=list.length+' markets';
  setH($('tvRows'),rows.map(s=>{const t=S.ticker[s],ch=t?(+t.lastPrice-+t.openPrice)/+t.openPrice*100:null;return`<div class="tvRow${s===S.sym?' on':''}" data-s="${s}"><span><span class="star" data-f="${s}">${S.fav.has(s)?'*':'+'}</span> <b>${esc(s.replace('USDT',''))}</b> <span style="opacity:.7">${esc(nameOf(s).slice(0,18))}</span></span><span>${t?fmt(t.lastPrice):'--'} <span style="color:${ch==null?'inherit':ch>=0?'var(--g)':'var(--r)'}">${ch==null?'':(ch>=0?'+':'')+ch.toFixed(1)+'%'}</span></span></div>`}).join(''))}
function renderTape(){setH($('tvTape'),S.tape.slice(0,30).map(t=>`<div class="tpRow"><span style="opacity:.75">${new Date(t.time).toLocaleTimeString()}</span><b style="color:${t.sell?'var(--r)':'var(--g)'}">${fmt(t.price)}</b><span>${t.qty<1?t.qty.toFixed(5):t.qty.toFixed(2)}</span></div>`).join('')||'<div style="opacity:.8">No trades yet.</div>');S.tapeDirty=false}
function renderBook(){const b=S.book;if(!b)return;const mx=Math.max(...b.bids.concat(b.asks).map(x=>+x[1]),1e-9),row=(x,c)=>`<div class="bkRow"><i style="width:${+x[1]/mx*100}%;background:${c}"></i><span>${fmt(x[0])}</span><span>${(+x[1]).toFixed(4)}</span></div>`;
  setH($('tvBook'),b.asks.slice().reverse().map(x=>row(x,'rgba(255,0,60,.25)')).join('')+'<div style="text-align:center;opacity:.7;margin:.2rem 0">spread '+fmt(+b.asks[0][0]-+b.bids[0][0])+'</div>'+b.bids.map(x=>row(x,'rgba(var(--gr),.25)')).join(''))}
function renderTf(){setH($('tvTf'),TFS.map(t=>`<button class="b${S.tf===t[0]?' on':''}" data-tf="${t[0]}">${t[1]}</button>`).join(''))}
let regT=0;function select(sym){if(sym===S.sym&&S.candles.length)return;S.sym=sym;S.view={n:110,off:0};S.tape=[];S.book=null;renderRows();renderTf();paintHead();loadCandles().then(()=>{connect()});loadTape();loadBook();clearTimeout(regT);regT=setTimeout(()=>reg('TRADE','viewed '+sym),3000)}
/* ---- chart ---- */
function draw(){const cv=$('tvC');fitC(cv);const g=cv.getContext('2d'),W=cv.width,H=cv.height;g.clearRect(0,0,W,H);g.font='12px "Share Tech Mono",monospace';
  if(!S.candles.length){g.fillStyle='#9fffc4';g.fillText('Loading ...',12,22);return}
  const sm=$('iSma').checked,em=$('iEma').checked,vo=$('iVol').checked,padR=70,padB=22,volH=vo?H*.16:0,ch=H-padB-volH,cw=W-padR,n=Math.min(S.view.n,S.candles.length),end=S.candles.length-S.view.off,start=Math.max(0,end-n),vis=S.candles.slice(start,end);if(!vis.length)return;
  let hi=-Infinity,lo=Infinity,vmax=0;vis.forEach(c=>{hi=Math.max(hi,c.h);lo=Math.min(lo,c.l);vmax=Math.max(vmax,c.v)});if(hi===lo){hi+=1;lo-=1}const pad=(hi-lo)*.06;hi+=pad;lo-=pad;
  const y=p=>(hi-p)/(hi-lo)*ch,bw=cw/vis.length,x=i=>i*bw+bw/2;
  g.lineWidth=1;g.strokeStyle='rgba(0,255,102,.12)';g.fillStyle='rgba(159,255,196,.85)';for(let i=0;i<=5;i++){const p=lo+(hi-lo)*i/5,yy=y(p);g.beginPath();g.moveTo(0,yy);g.lineTo(cw,yy);g.stroke();g.fillText(fmt(p),cw+4,yy+4)}
  const stepT=Math.max(1,Math.floor(vis.length/6));for(let i=0;i<vis.length;i+=stepT){const d=new Date(vis[i].t);g.fillText(['1d','1w'].includes(S.tf)?d.toLocaleDateString([],{month:'short',day:'numeric'}):d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}),x(i)-14,H-6)}
  if(vo){vis.forEach((c,i)=>{const hh=c.v/(vmax||1)*volH;g.fillStyle=c.c>=c.o?'rgba(0,255,102,.35)':'rgba(255,0,60,.35)';g.fillRect(x(i)-bw*.35,ch+padB*0+ (volH-hh)+4,bw*.7,hh)})}
  vis.forEach((c,i)=>{const up=c.c>=c.o,col=up?'#00ff66':'#ff003c',xx=x(i);g.strokeStyle=col;g.lineWidth=1;g.beginPath();g.moveTo(xx,y(c.h));g.lineTo(xx,y(c.l));g.stroke();const top=y(Math.max(c.o,c.c)),hh=Math.max(1,Math.abs(y(c.o)-y(c.c))),w=Math.max(1,bw*.7);
    if(up){g.fillStyle=col;g.fillRect(xx-w/2,top,w,hh)}else{g.fillStyle='#000';g.fillRect(xx-w/2,top,w,hh);g.strokeRect(xx-w/2,top,w,hh)}});
  const closes=S.candles.map(c=>c.c),line=(arr,col)=>{g.strokeStyle=col;g.lineWidth=1.5;g.beginPath();let on=false;for(let i=start;i<end;i++){const v=arr[i];if(v==null){on=false;continue}const xx=x(i-start),yy=y(v);on?g.lineTo(xx,yy):g.moveTo(xx,yy);on=true}g.stroke()};
  if(sm)line(sma(closes,20),'#00eeff');if(em)line(ema(closes,50),'#fbbf24');
  const last=S.candles[S.candles.length-1],ly=y(last.c);g.setLineDash([4,4]);g.strokeStyle=last.c>=last.o?'#00ff66':'#ff003c';g.beginPath();g.moveTo(0,ly);g.lineTo(cw,ly);g.stroke();g.setLineDash([]);g.fillStyle=g.strokeStyle;g.fillRect(cw,ly-9,padR,18);g.fillStyle='#000';g.fillText(fmt(last.c),cw+3,ly+4);
  if(S.mx!=null&&S.mx<cw&&S.my<ch){const i=Math.min(vis.length-1,Math.max(0,Math.floor(S.mx/bw))),c=vis[i];g.strokeStyle='rgba(255,255,255,.35)';g.lineWidth=1;g.beginPath();g.moveTo(x(i),0);g.lineTo(x(i),ch);g.moveTo(0,S.my);g.lineTo(cw,S.my);g.stroke();
    $('tvTip').textContent=new Date(c.t).toLocaleString()+'   O '+fmt(c.o)+'  H '+fmt(c.h)+'  L '+fmt(c.l)+'  C '+fmt(c.c)+'  V '+(+c.v).toLocaleString(undefined,{maximumFractionDigits:2})}}
/* ---- events ---- */
const cv=$('tvC');
function pos(e){const r=cv.getBoundingClientRect();S.mx=(e.clientX-r.left)*cv.width/r.width;S.my=(e.clientY-r.top)*cv.height/r.height;S.dirty=true}
cv.addEventListener('pointermove',e=>{pos(e);if(S.drag){const bw=(cv.width-70)/Math.min(S.view.n,S.candles.length),d=Math.round((e.clientX-S.drag.x)/(bw*cv.getBoundingClientRect().width/cv.width));S.view.off=Math.max(0,Math.min(S.candles.length-20,S.drag.off+d))}});
cv.addEventListener('pointerdown',e=>{S.drag={x:e.clientX,off:S.view.off};try{cv.setPointerCapture(e.pointerId)}catch(x){}});cv.addEventListener('pointerup',()=>{S.drag=null});cv.addEventListener('pointerleave',()=>{S.mx=null;S.dirty=true});
cv.addEventListener('wheel',e=>{e.preventDefault();S.view.n=Math.max(20,Math.min(400,Math.round(S.view.n*(e.deltaY>0?1.12:.89))));S.dirty=true},{passive:false});
['iSma','iEma','iVol'].forEach(id=>$(id).addEventListener('change',()=>{S.dirty=true}));
$('tvRows').addEventListener('click',e=>{const f=e.target.closest('[data-f]');if(f){const s=f.dataset.f;S.fav.has(s)?S.fav.delete(s):S.fav.add(s);try{localStorage.setItem('zack.trade.fav',JSON.stringify([...S.fav]))}catch(x){}renderRows();return}const r=e.target.closest('[data-s]');if(r)select(r.dataset.s)});
$('tvTf').addEventListener('click',e=>{const b=e.target.closest('[data-tf]');if(!b)return;S.tf=b.dataset.tf;S.view={n:110,off:0};renderTf();loadCandles().then(connect)});
$('tvQ').addEventListener('input',e=>{S.q=e.target.value;renderRows()});
$('tdSave').onclick=()=>{S.td=$('tdKey').value.trim();try{localStorage.setItem('zack.trade.tdkey',S.td)}catch(e){}renderRows();log(S.td?'Key saved.':'Key removed.','s')};$('tdKey').value=S.td;
onFrame(()=>{if(S.dirty){S.dirty=false;draw()}if(S.hdr){S.hdr=false;paintHead()}});
setInterval(()=>{if(S.tapeDirty)renderTape()},400);setInterval(()=>{if(!document.hidden){loadTicker();loadBook();if(isTD(S.sym)&&S.td)loadCandles()}},isTD(S.sym)?60000:5000);setInterval(()=>{if(!document.hidden)loadTicker()},20000);
renderTf();renderRows();loadTicker().then(()=>{select('BTCUSDT')});S.sym='';select('BTCUSDT');ready();
