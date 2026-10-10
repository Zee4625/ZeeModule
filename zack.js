/* ===== Zack Engine OS · core (settings, themes, music, register, secret lock; shared by every page) ===== */
const $=id=>document.getElementById(id),clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),esc=x=>String(x).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const mm=q=>window.matchMedia?matchMedia(q).matches:false,setH=(el,h)=>{if(el&&el.__h!==h){el.innerHTML=h;el.__h=h}};
const Zack={ready:false,cpuFast:false,onNet:null,onReg:null,locked:false};
const EMBED=window.top!==window||/[?&]embed=1/.test(location.search),PAGE=document.body.dataset.page||'os',SECRET=document.body.dataset.secret==='1';
if(EMBED)document.documentElement.classList.add('embed');
const cores=navigator.hardwareConcurrency||4,conn=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
const isApp=()=>mm('(display-mode: fullscreen)')||mm('(display-mode: standalone)')||navigator.standalone===true;
const hs=n=>{const u=['B','KB','MB','GB','TB'];let i=0;while(n>=1024&&i<4){n/=1024;i++}return(i?n.toFixed(n<10?2:1):n)+' '+u[i]};
const tzName=()=>{try{return Intl.DateTimeFormat().resolvedOptions().timeZone}catch(e){return'UTC'}};

/* ---------- settings (saved in this browser, shared by every window) ---------- */
const CFGK='zack.settings',DEF={theme:'green',lite:null,fs:true,amb:true,wl:true,fz:17,boot:'session',track:0,regloc:'ask',regip:'ask'};
let cfg=Object.assign({},DEF);try{Object.assign(cfg,JSON.parse(localStorage.getItem(CFGK)||'{}'))}catch(e){}
{const m=location.hash.match(/#zc=([^&]+)/);if(m){try{Object.assign(cfg,JSON.parse(atob(m[1])));if(!EMBED)saveCfg()}catch(e){}history.replaceState(null,'',location.pathname+location.search)}}
function bcast(){document.querySelectorAll('iframe').forEach(f=>{try{f.contentWindow.postMessage({zack:'cfg',cfg},'*')}catch(e){}})}
function saveCfg(){try{localStorage.setItem(CFGK,JSON.stringify(cfg))}catch(e){}if(!EMBED)bcast()}
let toastT=0;function log(m,t){const e=$('toast');if(!e)return;e.textContent=m;e.style.color=t==='d'?'var(--r)':t==='s'?'var(--c)':'var(--g)';e.style.opacity=1;clearTimeout(toastT);toastT=setTimeout(()=>{e.style.opacity=0},3500)}
function setStatus(t){const b=$('statusBadge');if(b)b.textContent=t}

/* ---------- theme palette + canvas colour shim (no CSS filters: cheap and sharp) ---------- */
const THEMES={green:{n:'GREEN',tp:{g:[0,255,102],c:[0,238,255],r:[255,0,60],y:[251,191,36]},bg:'#010409'},mono:{n:'B&W',tp:{g:[237,237,237],c:[255,255,255],r:[255,255,255],y:[207,207,207]},bg:'#000000'},purple:{n:'PURPLE',tp:{g:[181,123,255],c:[255,122,230],r:[255,0,60],y:[251,191,36]},bg:'#07010f'},red:{n:'RED',tp:{g:[255,59,59],c:[255,154,61],r:[255,255,255],y:[255,210,58]},bg:'#0f0102'}};
const THK=Object.keys(THEMES);let TP=THEMES.green.tp,CCv=0;
const PAL0={'0,255,102':'g','0,238,255':'c','255,0,60':'r','251,191,36':'y','159,255,196':'gl','170,255,200':'gl','230,255,240':'gw','190,255,215':'gw','255,208,216':'rl','255,210,58':'y'},CC=new Map(),WH=[255,255,255];
const mixc=(a,b,t)=>a.map((v,i)=>Math.round(v+(b[i]-v)*t));
function tcolor(c){if(typeof c!=='string')return c;const k=CCv+'|'+c;let h=CC.get(k);if(h)return h;let r,g,b,a=1,m;
  if(m=c.match(/^#([0-9a-f]{6})$/i)){const v=parseInt(m[1],16);r=v>>16;g=v>>8&255;b=v&255}
  else if(m=c.match(/^#([0-9a-f]{3})$/i)){const v=m[1];r=parseInt(v[0]+v[0],16);g=parseInt(v[1]+v[1],16);b=parseInt(v[2]+v[2],16)}
  else if(m=c.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/)){r=+m[1];g=+m[2];b=+m[3];if(m[4]!==undefined)a=+m[4]}
  else{CC.set(k,c);return c}
  const role=PAL0[r+','+g+','+b];let o=[r,g,b];if(role)o=role==='g'?TP.g:role==='c'?TP.c:role==='r'?TP.r:role==='y'?TP.y:role==='gl'?mixc(TP.g,WH,.55):role==='gw'?mixc(TP.g,WH,.88):mixc(TP.r,WH,.8);
  h='rgba('+o[0]+','+o[1]+','+o[2]+','+a+')';CC.set(k,h);return h}
if(window.CanvasRenderingContext2D){for(const p of['fillStyle','strokeStyle','shadowColor']){const d=Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype,p);Object.defineProperty(CanvasRenderingContext2D.prototype,p,{get:d.get,set(v){d.set.call(this,tcolor(v))},configurable:true})}
  const acs=CanvasGradient.prototype.addColorStop;CanvasGradient.prototype.addColorStop=function(o,c){acs.call(this,o,tcolor(c))}}



function setTheme(t,quiet){if(!THEMES[t])t='green';const th=THEMES[t];TP=th.tp;CCv++;document.documentElement.dataset.theme=t;if(!quiet){cfg.theme=t;saveCfg()}const b=$('thBtn');if(b)b.textContent='THEME: '+th.n;const m=document.querySelector('meta[name=theme-color]');if(m)m.content=th.bg;try{pm.dirty=true}catch(e){}if($('setBody'))renderSettings()}
function toggleTheme(){setTheme(THK[(THK.indexOf(cfg.theme)+1)%THK.length])}
TP=THEMES[THEMES[cfg.theme]?cfg.theme:'green'].tp;document.documentElement.dataset.theme=THEMES[cfg.theme]?cfg.theme:'green';
/* ---------- canvas sizing via ResizeObserver (no layout reads per frame) ---------- */
const RO=typeof ResizeObserver!=='undefined'?new ResizeObserver(es=>{for(const e of es){const c=e.target,w=Math.round(e.contentRect.width),h=Math.round(e.contentRect.height);if(w&&h){if(c.width!==w)c.width=w;if(c.height!==h)c.height=h}}}):null;
const fitC=c=>{if(RO){if(!c.__ro){c.__ro=1;RO.observe(c);const w=c.clientWidth,h=c.clientHeight;if(w&&h){c.width=w;c.height=h}}return}const w=c.clientWidth,h=c.clientHeight;if(w&&h&&(c.width!==w||c.height!==h)){c.width=w;c.height=h}};




function fz(d){const v=clamp((cfg.fz||17)+d*1.5,12,26);cfg.fz=v;saveCfg();document.documentElement.style.fontSize=v+'px';if($('setBody'))renderSettings()}
document.documentElement.style.fontSize=(cfg.fz||17)+'px';

/* ---------- performance: lite mode + one frame scheduler (starts only when a page draws) ---------- */
const PERF={lite:false,auto:true,frames:0,fT:0,last:0,slow:0},draws=[];let fps=0,loopOn=false;
const defaultLite=()=>mm('(pointer:coarse)')||cores<=4;
function setLite(on,auto){PERF.lite=on;document.documentElement.classList.toggle('lite',on);if(auto)log('Lite mode switched on automatically (low frame rate).','s');try{R3.k=''}catch(e){}if($('setBody'))renderSettings()}
setLite(cfg.lite===null?defaultLite():cfg.lite,false);PERF.auto=cfg.lite===null;
function onFrame(f){draws.push(f);if(!loopOn){loopOn=true;requestAnimationFrame(loop)}}
function loop(ts){requestAnimationFrame(loop);if(document.hidden)return;if(ts-PERF.last<(PERF.lite?30:14))return;PERF.last=ts;PERF.frames++;
  if(ts-PERF.fT>=1000){fps=PERF.frames;PERF.frames=0;PERF.fT=ts;if(Zack.ready&&PERF.auto&&!PERF.lite){if(fps<28)PERF.slow++;else PERF.slow=0;if(PERF.slow>=4)setLite(true,true)}}
  for(const f of draws)f(ts)}
function applyCfg(){setTheme(cfg.theme,true);document.documentElement.style.fontSize=(cfg.fz||17)+'px';setLite(cfg.lite===null?defaultLite():cfg.lite,false)}
addEventListener('message',e=>{const d=e.data;if(EMBED&&d&&d.zack==='cfg'&&e.source===window.parent){Object.assign(cfg,d.cfg);applyCfg()}});
addEventListener('storage',e=>{if(e.key===CFGK&&e.newValue){try{Object.assign(cfg,JSON.parse(e.newValue));applyCfg()}catch(x){}}});

/* ---------- calculator engine (safe, no eval) ---------- */
function calcEval(src){const s=String(src).toLowerCase().replace(/×/g,'*').replace(/÷/g,'/').replace(/,/g,'.').replace(/\^/g,'**'),t=s.match(/\d+\.?\d*|\.\d+|[a-z]+|\*\*|[()+\-*/%]/g)||[];let i=0;
  const F={sqrt:Math.sqrt,sin:Math.sin,cos:Math.cos,tan:Math.tan,log:Math.log10,ln:Math.log,abs:Math.abs,round:Math.round,floor:Math.floor,ceil:Math.ceil},K={pi:Math.PI,e:Math.E},peek=()=>t[i],next=()=>t[i++];
  function prim(){const x=next();if(x==='('){const v=add();if(next()!==')')throw 0;return v}if(x==='-')return-pow();if(x==='+')return pow();if(/^[\d.]/.test(x))return parseFloat(x);if(F[x]){if(next()!=='(')throw 0;const v=add();if(next()!==')')throw 0;return F[x](v)}if(K[x]!==undefined)return K[x];throw 0}
  function pow(){const b=prim();if(peek()==='**'){next();return Math.pow(b,pow())}return b}
  function mul(){let v=pow();while(['*','/','%'].includes(peek())){const o=next(),r=pow();v=o==='*'?v*r:o==='/'?v/r:v%r}return v}
  function add(){let v=mul();while(['+','-'].includes(peek())){const o=next(),r=mul();v=o==='+'?v+r:v-r}return v}
  const v=add();if(i!==t.length||!isFinite(v))throw 0;return v}

/* ---------- secret area (code 4625; a convenience lock, not real security) ---------- */
const unlocked=()=>{try{if(window.top.__zu===1)return true}catch(e){}try{return sessionStorage.getItem('zackUnlocked')==='1'}catch(e){return false}};
function setUnlocked(on){try{window.top.__zu=on?1:0}catch(e){}try{on?sessionStorage.setItem('zackUnlocked','1'):sessionStorage.removeItem('zackUnlocked')}catch(e){}}
const CODE_FAILS=[];
function tryCode(v){const now=Date.now();while(CODE_FAILS.length&&now-CODE_FAILS[0]>60000)CODE_FAILS.shift();if(CODE_FAILS.length>=5)return'LOCK';if(String(v).trim()==='4625'){setUnlocked(true);reg('UNLOCK','secret area opened');return'OK'}CODE_FAILS.push(now);reg('DENIED','wrong code entered');return'NO'}
if(SECRET&&!unlocked()){Zack.locked=true;
  $('app').innerHTML='<section class="win"><div class="box" style="max-width:26rem;margin:2rem auto"><div class="ttl"><span>Locked</span><span style="color:var(--r)">SECRET</span></div><div class="sm">This app belongs to the secret Zack Engine area. Enter the code.</div><div class="flex flex-wrap items-center gap-2 mt-2"><input id="gCode" type="password" inputmode="numeric" maxlength="4" placeholder="code" autocomplete="off" style="width:6rem"><button class="b" id="gGo">UNLOCK</button><span id="gMsg" class="sm"></span></div></div></section>';
  const go=()=>{const r=tryCode($('gCode').value);$('gCode').value='';if(r==='OK')location.reload();else{$('gMsg').style.color='var(--r)';$('gMsg').textContent=r==='LOCK'?'Too many attempts. Wait a minute.':'ACCESS DENIED'}};
  setTimeout(()=>{const g=$('gGo');if(g){g.onclick=go;$('gCode').addEventListener('keydown',e=>{if(e.key==='Enter')go()})}},0)}
Zack.load=list=>Zack.locked?Promise.resolve():list.reduce((p,s)=>p.then(()=>new Promise((ok,no)=>{const e=document.createElement('script');e.src=s;e.onload=ok;e.onerror=no;document.head.appendChild(e)})),Promise.resolve());

/* ---------- probes (only where a page needs them) ---------- */
/* ---------- CPU probe (estimated from event-loop lag + micro-benchmark) ---------- */
let cpuSm=0,lagAvg=0,maxOps=1,lastT=performance.now(),cpuWait=250;
function bench(){const t=performance.now();let n=0;while(performance.now()-t<2){for(let i=0;i<500;i++)Math.sqrt(i*n);n++}return n}
function cpuTick(){const now=performance.now(),lag=Math.max(0,now-lastT-cpuWait);lastT=now;lagAvg+=(lag-lagAvg)*.3;
  if(!document.hidden){const ops=bench();maxOps=Math.max(maxOps*.999,ops);cpuSm+=(clamp((1-ops/maxOps)*100+lagAvg*1.5,0,100)-cpuSm)*.25}
  cpuWait=document.hidden?2000:Zack.cpuFast?(PERF.lite?500:250):1200;setTimeout(cpuTick,cpuWait)}

/* ---------- network probe (real pings to this page's server) ---------- */
let ping=null;const NQ={rtt:[],down:null};
async function pingOnce(){if(document.hidden)return;const t=performance.now();try{await fetch(location.href.split('#')[0],{method:'HEAD',cache:'no-store'});const d=performance.now()-t;NQ.rtt.push(d);ping=Math.round(d)}catch(e){NQ.rtt.push(null);ping=null}if(NQ.rtt.length>60)NQ.rtt.shift();netInfo()}
function nqStats(){const v=NQ.rtt.filter(x=>x!=null),n=NQ.rtt.length;if(!v.length)return null;const avg=v.reduce((a,b)=>a+b,0)/v.length;let j=0;for(let i=1;i<v.length;i++)j+=Math.abs(v[i]-v[i-1]);j/=Math.max(1,v.length-1);
  const loss=(n-v.length)/n*100;return{avg,max:Math.max(...v),j,loss,sc:clamp(100-clamp((avg-20)/3,0,50)-clamp(j*1.5,0,25)-loss*3,0,100)}}
function netInfo(){const off=!navigator.onLine,c=$('netChip');if(c)c.innerHTML=off?'<span style="color:var(--r)">NET: OFFLINE</span>':'NET: '+(conn&&conn.effectiveType?conn.effectiveType.toUpperCase():'ONLINE');if(Zack.onNet)Zack.onNet()}
addEventListener('online',()=>{log('Connection restored.','s');netInfo()});addEventListener('offline',()=>{log('Connection lost.','d');netInfo()});
conn&&conn.addEventListener&&conn.addEventListener('change',netInfo);

if(['dash','net'].includes(PAGE)&&!Zack.locked)setTimeout(cpuTick,250);
if(['os','dash','net'].includes(PAGE)&&!Zack.locked){setInterval(pingOnce,2000);setTimeout(pingOnce,300)}
function drawLinkRadar(c){fitC(c);const g=c.getContext('2d'),w=c.width,h=c.height,cx=w/2,cy=h/2,R=Math.min(w,h)/2-14,off=!navigator.onLine,col=off?'255,0,60':'0,238,255',v=NQ.rtt,mx=Math.max(100,...v.filter(x=>x!=null));
  g.clearRect(0,0,w,h);g.strokeStyle=`rgba(${col},.3)`;g.lineWidth=1;for(let i=1;i<=4;i++){g.beginPath();g.arc(cx,cy,R*i/4,0,7);g.stroke()}g.beginPath();g.moveTo(cx-R,cy);g.lineTo(cx+R,cy);g.moveTo(cx,cy-R);g.lineTo(cx,cy+R);g.stroke();
  LR.a+=off?.01:.04;for(let i=0;i<22;i++){g.beginPath();g.moveTo(cx,cy);g.arc(cx,cy,R,LR.a-i*.03-.03,LR.a-i*.03);g.fillStyle=`rgba(${col},${.2-i*.009})`;g.fill()}
  g.font='12px "Share Tech Mono",monospace';g.fillStyle='rgba(159,255,196,.9)';g.textAlign='left';for(let i=1;i<=4;i++)g.fillText(Math.round(mx*i/4)+' ms',cx+4,cy-R*i/4+12);
  g.beginPath();let on=false;v.forEach((p,i)=>{if(p==null){on=false;return}const a=i/60*6.2832-1.5708,r=p/mx*R,x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r;on?g.lineTo(x,y):g.moveTo(x,y);on=true});g.strokeStyle=off?'#ff003c':'#00ff66';g.lineWidth=2;g.stroke();
  v.forEach((p,i)=>{const a=i/60*6.2832-1.5708;if(p==null){g.fillStyle='#ff003c';g.fillRect(cx+Math.cos(a)*R-2,cy+Math.sin(a)*R-2,5,5)}else if(i===v.length-1){g.fillStyle='#fff';g.beginPath();g.arc(cx+Math.cos(a)*p/mx*R,cy+Math.sin(a)*p/mx*R,4,0,7);g.fill()}});
  const st=nqStats();g.textAlign='center';g.fillStyle='#fff';g.font='bold 18px "Share Tech Mono",monospace';g.fillText(off?'OFFLINE':(st?st.avg.toFixed(0)+' ms':'--'),cx,cy+6);g.textAlign='left'}
const LR={a:0};


/* ---------- fullscreen (the OS page stays open, so windows keep it) ---------- */
function fsUi(){const on=!!(document.fullscreenElement||document.webkitFullscreenElement)||isApp(),h=$('fsHint');if(h)h.style.display=(cfg.fs&&!on&&Zack.ready)?'block':'none';if($('setBody'))renderSettings()}
function enterFs(){if(EMBED||!cfg.fs||document.fullscreenElement||document.webkitFullscreenElement||isApp())return;const d=document.documentElement,f=d.requestFullscreen||d.webkitRequestFullscreen;if(!f)return;
  try{const r=f.call(d,{navigationUI:'hide'});if(r&&r.then)r.then(()=>{try{navigator.keyboard&&navigator.keyboard.lock&&navigator.keyboard.lock(['Escape'])}catch(e){}}).catch(()=>{})}catch(e){}}
function toggleFs(){cfg.fs=!cfg.fs;saveCfg();if(cfg.fs)enterFs();else if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});log('Fullscreen: '+(cfg.fs?'ON':'OFF'),'s');fsUi()}
if(!EMBED){document.addEventListener('fullscreenchange',fsUi);document.addEventListener('webkitfullscreenchange',fsUi);
  addEventListener('pointerdown',enterFs,true);addEventListener('touchend',enterFs,true);addEventListener('click',enterFs,true);addEventListener('keydown',e=>{if(e.key!=='Escape')enterFs()},true);document.addEventListener('visibilitychange',fsUi);addEventListener('focus',fsUi)}

/* ---------- keep the screen awake (Screen Wake Lock, video fallback) ---------- */
const WL={lock:null,on:false,mode:null,v:null};
async function wlAcquire(){try{if('wakeLock' in navigator){WL.lock=await navigator.wakeLock.request('screen');WL.mode='api';WL.lock.addEventListener('release',()=>{WL.lock=null;if(WL.mode==='api')WL.mode=null});return true}}catch(e){}
  try{if(!WL.v){const c=document.createElement('canvas');c.width=c.height=16;const x=c.getContext('2d'),v=document.createElement('video');v.muted=true;v.setAttribute('playsinline','');v.style.cssText='position:fixed;left:0;top:0;width:1px;height:1px;opacity:.01;pointer-events:none';v.srcObject=c.captureStream(2);document.body.appendChild(v);setInterval(()=>{x.fillStyle=Math.random()<.5?'#000':'#010101';x.fillRect(0,0,16,16)},500);WL.v=v}await WL.v.play();WL.mode='video';return true}catch(e){}return false}
async function wlSet(on){WL.on=on;if(on){const ok=await wlAcquire();log(ok?'Keep awake ON ('+WL.mode+').':'Keep awake is not supported or is blocked here.',ok?'s':'d')}else{try{WL.lock&&await WL.lock.release()}catch(e){}WL.lock=null;WL.mode=null;if(WL.v)WL.v.pause()}if($('setBody'))renderSettings()}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&WL.on&&!WL.lock&&WL.mode!=='video')wlAcquire()});

/* ---------- ambient music: three generative tracks (no audio files) ---------- */
const AMB={ac:null,m:null,bus:null,pg:null,sb:null,on:false,built:false,g:false,v:[],gen:0,idx:0,cur:0};
const TRACKS=[
 {n:'Calm',pg:1,ch:[[146.83,185,220,277.18],[123.47,146.83,185,220],[196,246.94,293.66,369.99],[220,277.18,329.63,392]],sc:[293.66,329.63,369.99,440,493.88,587.33,659.25,739.99]},
 {n:'Night Drive',pg:.45,ch:[[110,130.81,164.81,220],[87.31,130.81,174.61,220],[130.81,164.81,196,261.63],[98,123.47,146.83,196]]},
 {n:'Dream',pg:.7,ch:[[146.83,185,220,293.66],[110,138.59,164.81,220],[123.47,146.83,185,246.94],[98,123.47,146.83,196]],sc:[293.66,329.63,369.99,440,493.88,587.33,659.25,739.99,880]}];
function getAC(){if(!AMB.ac)AMB.ac=new(window.AudioContext||window.webkitAudioContext)();if(AMB.ac.state==='suspended')AMB.ac.resume();return AMB.ac}
function ambBuild(){const ac=getAC(),m=ac.createGain();m.gain.value=0;m.connect(ac.destination);
  const len=ac.sampleRate*4,ib=ac.createBuffer(2,len,ac.sampleRate);for(let c=0;c<2;c++){const d=ib.getChannelData(c);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.8)}
  const rv=ac.createConvolver();rv.buffer=ib;const wet=ac.createGain();wet.gain.value=.8;rv.connect(wet);wet.connect(m);
  const dry=ac.createGain();dry.gain.value=.45;dry.connect(m);const bus=ac.createGain();bus.connect(dry);bus.connect(rv);
  const f=ac.createBiquadFilter();f.type='lowpass';f.frequency.value=1100;f.Q.value=.4;f.connect(bus);const pg=ac.createGain();pg.gain.value=1;pg.connect(f);
  const lfo=ac.createOscillator(),lg=ac.createGain();lfo.frequency.value=.04;lg.gain.value=450;lfo.connect(lg);lg.connect(f.frequency);lfo.start();
  AMB.v=[];for(let i=0;i<4;i++)for(const dt of[-6,6]){const o=ac.createOscillator(),g=ac.createGain();o.type='triangle';o.frequency.value=TRACKS[0].ch[0][i];o.detune.value=dt;g.gain.value=.04;o.connect(g);g.connect(pg);o.start();AMB.v.push([o,i])}
  const sb=ac.createOscillator(),sg=ac.createGain();sb.type='sine';sb.frequency.value=73;sg.gain.value=.06;sb.connect(sg);sg.connect(bus);sb.start();
  Object.assign(AMB,{m,bus,pg,sb,built:true});setInterval(()=>{if(AMB.on){AMB.idx=(AMB.idx+1)%4;ambChord()}},9000)}
function ambChord(){const T=AMB.ac.currentTime,c=TRACKS[AMB.cur].ch[AMB.idx];AMB.v.forEach(([o,i])=>o.frequency.setTargetAtTime(c[i],T,2.5));AMB.sb.frequency.setTargetAtTime(c[0]/2,T,2.5)}
function ambNote(f,type,vol,dur,att){const ac=AMB.ac,T=ac.currentTime,o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(0,T);g.gain.linearRampToValueAtTime(vol,T+(att||.03));g.gain.exponentialRampToValueAtTime(.0005,T+dur);o.connect(g);g.connect(AMB.bus);o.start(T);o.stop(T+dur+.2)}
function ambLoop(g,fn,a,b){const t=()=>{if(!AMB.on||g!==AMB.gen)return;fn();setTimeout(t,a+Math.random()*(b-a))};setTimeout(t,a)}
function ambStart(){AMB.gen++;const g=AMB.gen;AMB.cur=cfg.track==='x'?Math.floor(Math.random()*TRACKS.length):(+cfg.track||0);AMB.idx=0;const T=TRACKS[AMB.cur];AMB.pg.gain.setTargetAtTime(T.pg,AMB.ac.currentTime,1.5);ambChord();
  if(AMB.cur===0)ambLoop(g,()=>ambNote(T.sc[Math.random()*T.sc.length|0],'sine',.07,4,.03),2500,6500);
  else if(AMB.cur===1){let st=0;const pat=[0,2,1,3,2,1,3,2],step=()=>{if(!AMB.on||g!==AMB.gen)return;const ch=TRACKS[1].ch[AMB.idx];ambNote(ch[pat[st%8]]*2,'triangle',.05,.45,.01);if(st%8===0)ambNote(ch[0],'sine',.09,1.8,.02);st++;setTimeout(step,312)};step()}
  else ambLoop(g,()=>{const f=T.sc[Math.random()*T.sc.length|0];ambNote(f,'triangle',.05,3.2,.02);ambNote(f*2,'sine',.015,2,.02)},900,1800);
  if(cfg.track==='x')setTimeout(()=>{if(AMB.on&&g===AMB.gen)ambStart()},80000)}
function ambSet(on){if(on){if(!AMB.built)ambBuild();getAC();AMB.on=true;ambStart();AMB.m.gain.setTargetAtTime(.4,AMB.ac.currentTime,2.5)}else{AMB.on=false;AMB.gen++;if(AMB.m)AMB.m.gain.setTargetAtTime(0,AMB.ac.currentTime,.6)}if($('setBody'))renderSettings()}
function ambToggle(){try{cfg.amb=!AMB.on;saveCfg();ambSet(cfg.amb)}catch(e){log('Audio is not available in this browser.','d')}}


/* ---------- first gesture: fullscreen, music, wake lock ---------- */
function gest(){AMB.g=true;enterFs();if(Zack.ready)afterReady()}
function afterReady(){if(cfg.wl&&!WL.on)wlSet(true);if(cfg.amb&&AMB.g&&!AMB.on)try{ambSet(true)}catch(e){}}
if(!EMBED){addEventListener('pointerdown',gest,{once:true});addEventListener('keydown',gest,{once:true})}
function ready(){Zack.ready=true;if(EMBED)return;fsUi();afterReady();regStart()}

/* ---------- access register (kept in this browser) ---------- */
const REGK='zack.register';
function regLoad(){try{return JSON.parse(localStorage.getItem(REGK)||'[]')}catch(e){return[]}}
function regSave(a){try{localStorage.setItem(REGK,JSON.stringify(a.slice(-300)))}catch(e){}}
function devInfo(){const u=navigator.userAgent,b=/Edg\//.test(u)?'Edge':/OPR\//.test(u)?'Opera':/Firefox\//.test(u)?'Firefox':/Chrome\//.test(u)?'Chrome':/Safari\//.test(u)?'Safari':'Browser',os=/Windows/.test(u)?'Windows':/Android/.test(u)?'Android':/iPhone|iPad/.test(u)?'iOS':/Mac OS X/.test(u)?'macOS':/CrOS/.test(u)?'ChromeOS':/X11/.test(u)?'Unix-like':'Other';let gpu='';
  try{const c=document.createElement('canvas'),gl=c.getContext('webgl'),x=gl&&gl.getExtension('WEBGL_debug_renderer_info');gpu=x?String(gl.getParameter(x.UNMASKED_RENDERER_WEBGL)).replace(/ANGLE \(|\)/g,'').slice(0,60):''}catch(e){}
  return{browser:b,os,screen:screen.width+'x'+screen.height+' @'+(window.devicePixelRatio||1)+'x',window:innerWidth+'x'+innerHeight,lang:(navigator.languages||[navigator.language||'']).slice(0,3).join(','),threads:cores,mem:navigator.deviceMemory||null,gpu,net:conn?((conn.effectiveType||'')+(conn.downlink?' '+conn.downlink+' Mb/s':'')):'',tz:tzName(),utc:'UTC'+(-new Date().getTimezoneOffset()/60>=0?'+':'')+(-new Date().getTimezoneOffset()/60),ref:document.referrer||'',dnt:navigator.doNotTrack||'',touch:navigator.maxTouchPoints||0,dark:mm('(prefers-color-scheme:dark)'),app:isApp(),cookies:navigator.cookieEnabled}}
const devLabel=d=>d.browser+' · '+d.os+' · '+d.screen+' · '+(d.lang.split(',')[0]||'')+' · '+d.threads+' threads';
function reg(ev,note,loc,extra){const a=regLoad(),d=devInfo(),e={t:new Date().toISOString(),ev,page:PAGE,who:'operator',dev:devLabel(d),note:note||''};if(['START','IP','LOCATION'].includes(ev))e.x=d;if(loc)e.loc=loc;if(extra)Object.assign(e,extra);a.push(e);regSave(a);if(Zack.onReg)Zack.onReg(e);return e}
function regLocate(){if(!navigator.geolocation){reg('LOCATION','geolocation is not supported here');return}
  navigator.geolocation.getCurrentPosition(p=>reg('LOCATION','position fix',{la:p.coords.latitude,lo:p.coords.longitude,acc:Math.round(p.coords.accuracy)}),er=>reg('LOCATION','not available: '+((er&&er.message)||'denied')),{enableHighAccuracy:true,timeout:15000,maximumAge:60000})}
async function ipLookup(){const S=[['https://ipwho.is/',j=>j.success===false?null:{ip:j.ip,city:j.city,region:j.region,country:j.country,cc:j.country_code,isp:j.connection&&j.connection.isp,asn:j.connection&&j.connection.asn,tz:j.timezone&&j.timezone.id,la:j.latitude,lo:j.longitude,kind:j.type}],
  ['https://ipapi.co/json/',j=>j.ip&&!j.error?{ip:j.ip,city:j.city,region:j.region,country:j.country_name,cc:j.country_code,isp:j.org,asn:j.asn,tz:j.timezone,la:j.latitude,lo:j.longitude}:null],['https://api.ipify.org?format=json',j=>j.ip?{ip:j.ip}:null]];
  for(const [u,f] of S){try{const r=await fetch(u,{cache:'no-store'}),o=f(await r.json());if(o){o.src=new URL(u).hostname;return o}}catch(e){}}return null}
async function regIp(){const o=await ipLookup();if(o)reg('IP',o.ip+(o.city?' · '+[o.city,o.region,o.country].filter(Boolean).join(', '):'')+(o.isp?' · '+o.isp:''),null,{ip:o});else reg('IP','lookup failed (offline or blocked)')}
if(!EMBED){let first=true;try{first=!sessionStorage.getItem('zackSession');sessionStorage.setItem('zackSession',String(Date.now()))}catch(e){}Zack.firstStart=first;if(first)reg('START','site opened');if(PAGE!=='os')reg('PAGE','page opened')}
function regAsk(){if($('regAsk'))return;document.body.insertAdjacentHTML('beforeend','<div id="regAsk" class="box sm" style="position:fixed;right:.6rem;top:.6rem;z-index:9600;max-width:min(26rem,92vw)"><div>Allow Zack Engine to record your location and your IP address in the access register? It stays in this browser. The IP lookup asks a public service (ipwho.is) for your address and area.</div><div class="flex gap-2 mt-1"><button class="b" id="regYes">ALLOW</button><button class="b" id="regNo">NO THANKS</button></div></div>');
  $('regYes').onclick=()=>{cfg.regloc='yes';cfg.regip='yes';saveCfg();$('regAsk').remove();regLocate();regIp()};$('regNo').onclick=()=>{cfg.regloc='no';cfg.regip='no';saveCfg();$('regAsk').remove()}}
function regStart(){if(!Zack.firstStart||Zack.regDone)return;Zack.regDone=true;if(cfg.regloc==='yes')regLocate();if(cfg.regip==='yes')regIp();if(cfg.regloc==='ask'||cfg.regip==='ask')setTimeout(regAsk,1200)}

/* ---------- install as app + offline cache ---------- */
let deferredInstall=null;addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstall=e;if($('setBody'))renderSettings()});
function installApp(){if(deferredInstall){deferredInstall.prompt();deferredInstall.userChoice.finally(()=>{deferredInstall=null;renderSettings()})}else log('Use the browser menu: Install app, or Add to Home Screen.','s')}
if(!EMBED&&'serviceWorker' in navigator&&/^https?:$/.test(location.protocol))navigator.serviceWorker.register('sw.js').catch(()=>{});

/* ---------- settings window ---------- */
const seg=(id,opts,cur)=>`<div class="seg" data-id="${id}">`+opts.map(([v,l])=>`<button class="b${String(v)===String(cur)?' on':''}" data-v="${v}">${l}</button>`).join('')+'</div>';
const srow=(l,h)=>`<div class="srow"><span>${l}</span>${h}</div>`;
function renderSettings(){const lite=cfg.lite===null?'auto':cfg.lite?'on':'off',on=!!(document.fullscreenElement||document.webkitFullscreenElement)||isApp();
  setH($('setBody'),srow('Theme',seg('theme',THK.map(k=>[k,THEMES[k].n]),cfg.theme))+srow('Lite mode (less CPU)',seg('lite',[['auto','AUTO'],['on','ON'],['off','OFF']],lite))
   +srow('Fullscreen'+(cfg.fs&&!on?' (tap once to enter)':''),seg('fs',[[1,'ON'],[0,'OFF']],cfg.fs?1:0))
   +srow('Install as app (true fullscreen, keeps it when you switch tabs)',isApp()?'<b>RUNNING AS APP</b>':'<button class="b" data-a="install">INSTALL</button>')
   +'<div class="sm" style="opacity:.85;padding:.2rem 0">Tip: F11 is browser fullscreen and stays on when you switch tabs. Fullscreen made by a page ends when you change tab; this is a browser rule.</div>'
   +srow('Ambient music',seg('amb',[[1,'ON'],[0,'OFF']],cfg.amb?1:0))+srow('Music track',seg('track',[[0,'CALM'],[1,'NIGHT DRIVE'],[2,'DREAM'],['x','SHUFFLE']],cfg.track))
   +srow('Keep screen awake',seg('wl',[[1,'ON'],[0,'OFF']],cfg.wl?1:0))
   +srow('Record location in the access register',seg('regloc',[['ask','ASK'],['yes','ON'],['no','OFF']],cfg.regloc))
   +srow('Look up my IP in the access register',seg('regip',[['ask','ASK'],['yes','ON'],['no','OFF']],cfg.regip))
   +srow('Text size','<div class="seg"><button class="b" data-a="fzm">A-</button><b>'+Math.round(cfg.fz)+' px</b><button class="b" data-a="fzp">A+</button></div>')
   +srow('Start-up animation',seg('boot',[['session','ONCE PER SESSION'],['always','EVERY START'],['off','OFF']],cfg.boot))
   +'<div class="flex flex-wrap gap-2 mt-2"><button class="b" data-a="reboot">REBOOT NOW</button><button class="b k" data-a="reset">RESET SETTINGS</button></div>')}
function applySetting(id,v){
  if(id==='theme')setTheme(v);
  else if(id==='lite'){cfg.lite=v==='auto'?null:v==='on';saveCfg();PERF.auto=cfg.lite===null;setLite(cfg.lite===null?defaultLite():cfg.lite,false)}
  else if(id==='fs'){cfg.fs=v==='1';saveCfg();if(cfg.fs)enterFs();else if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});fsUi()}
  else if(id==='amb'){cfg.amb=v==='1';saveCfg();try{ambSet(cfg.amb)}catch(e){}}
  else if(id==='track'){cfg.track=v==='x'?'x':+v;cfg.amb=true;saveCfg();try{ambSet(true)}catch(e){}}
  else if(id==='wl'){cfg.wl=v==='1';saveCfg();wlSet(cfg.wl)}
  else if(id==='regloc'){cfg.regloc=v;saveCfg();if(v==='yes')regLocate()}
  else if(id==='regip'){cfg.regip=v;saveCfg();if(v==='yes')regIp()}
  else if(id==='boot'){cfg.boot=v;saveCfg()}
  renderSettings()}
function reboot(){try{sessionStorage.removeItem('zackBooted')}catch(e){}if(PAGE==='os')location.reload();else location.href='index.html'}
function openSettings(){const m=$('settings');if(m){m.style.display='flex';renderSettings()}}
function buildShell(){
  document.body.insertAdjacentHTML('beforeend','<div id="toast" class="box sm" style="position:fixed;left:.6rem;bottom:calc(3.8rem + env(safe-area-inset-bottom,0px));z-index:9400;pointer-events:none;opacity:0;transition:opacity .3s;max-width:min(36rem,92vw)"></div>');
  if(EMBED)return;
  if(PAGE!=='os')document.body.insertAdjacentHTML('afterbegin','<div id="top" class="topbar"><a class="b logo" href="index.html">ZACK ENGINE OS</a><b id="appName" class="glow">'+esc(document.title.replace(/^Zack Engine · /,''))+'</b><span class="grow"></span><span id="netChip" class="sm hide-sm">NET: --</span><b id="clk" class="sm hide-sm"></b><button class="b" id="thBtn">THEME</button><button class="b" id="setBtn">SETTINGS</button></div>');
  document.body.insertAdjacentHTML('beforeend','<div class="modal" id="settings"><div class="box mwin"><div class="ttl"><span>Settings</span><button class="b" id="setClose">CLOSE</button></div><div id="setBody"></div><div class="sm" style="opacity:.85;margin-top:.6rem">Zack Engine OS · German Technology. Settings are saved in this browser and shared by every window.</div></div></div><div id="fsHint" class="box sm" style="position:fixed;left:50%;transform:translateX(-50%);top:.6rem;z-index:9500;pointer-events:none;display:none">Tap or press any key to enter fullscreen</div>');
  const b=$('thBtn');if(b){b.textContent='THEME: '+THEMES[cfg.theme].n;b.onclick=toggleTheme}const sb=$('setBtn');if(sb)sb.onclick=openSettings;
  $('setClose').onclick=()=>{$('settings').style.display='none'};$('settings').onclick=e=>{if(e.target.id==='settings')$('settings').style.display='none'};
  addEventListener('keydown',e=>{if(e.key==='Escape')$('settings').style.display='none'});
  $('setBody').onclick=e=>{const t=e.target;if(t.dataset.a==='fzm')return fz(-1);if(t.dataset.a==='fzp')return fz(1);if(t.dataset.a==='reboot')return reboot();if(t.dataset.a==='install')return installApp();
    if(t.dataset.a==='reset'){cfg=Object.assign({},DEF);saveCfg();location.reload();return}const s=t.closest&&t.closest('.seg');if(s&&t.dataset.v!==undefined)applySetting(s.dataset.id,t.dataset.v)};
  const ck=()=>{const c=$('clk');if(c&&!document.hidden)c.textContent=new Date().toISOString().slice(11,19)+' UTC'};setInterval(ck,1000);ck()}
buildShell();if(!EMBED)netInfo();
