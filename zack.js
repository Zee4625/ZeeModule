/* ===== Zack Engine SYS v11 · core (shared by every page) ===== */
const $=id=>document.getElementById(id),clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),esc=x=>String(x).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const mm=q=>window.matchMedia?matchMedia(q).matches:false,setH=(el,h)=>{if(el&&el.__h!==h){el.innerHTML=h;el.__h=h}};
const Zack={ready:false,cpuFast:false,onNet:null,onLite:null};
const cores=navigator.hardwareConcurrency||4,conn=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
const hs=n=>{const u=['B','KB','MB','GB','TB'];let i=0;while(n>=1024&&i<4){n/=1024;i++}return(i?n.toFixed(n<10?2:1):n)+' '+u[i]};

/* ---------- settings (saved in this browser, shared by every page) ---------- */
const CFGK='zack.settings',DEF={theme:'green',lite:null,fs:true,amb:true,wl:true,fz:17,boot:'session'};
let cfg=Object.assign({},DEF);try{Object.assign(cfg,JSON.parse(localStorage.getItem(CFGK)||'{}'))}catch(e){}
{const m=location.hash.match(/^#zc=(.+)$/);if(m){try{Object.assign(cfg,JSON.parse(atob(m[1])));saveCfg()}catch(e){}history.replaceState(null,'',location.pathname+location.search)}}
function saveCfg(){try{localStorage.setItem(CFGK,JSON.stringify(cfg))}catch(e){}}
function go(p){let c='';try{c=btoa(JSON.stringify(cfg))}catch(e){}location.href=p+(c?'#zc='+c:'')}
function navClick(e,p){if(e.ctrlKey||e.metaKey||e.shiftKey||e.button===1)return true;e.preventDefault();go(p);return false}
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


function setTheme(t){if(!THEMES[t])t='green';const th=THEMES[t];TP=th.tp;CCv++;cfg.theme=t;saveCfg();document.documentElement.dataset.theme=t;const b=$('thBtn');if(b)b.textContent='THEME: '+th.n;const m=document.querySelector('meta[name=theme-color]');if(m)m.content=th.bg;try{pm.dirty=true}catch(e){}if($('setBody'))renderSettings()}
function toggleTheme(){setTheme(THK[(THK.indexOf(cfg.theme)+1)%THK.length])}
TP=THEMES[THEMES[cfg.theme]?cfg.theme:'green'].tp;document.documentElement.dataset.theme=THEMES[cfg.theme]?cfg.theme:'green';
/* ---------- canvas sizing via ResizeObserver (no layout reads per frame) ---------- */
const RO=typeof ResizeObserver!=='undefined'?new ResizeObserver(es=>{for(const e of es){const c=e.target,w=Math.round(e.contentRect.width),h=Math.round(e.contentRect.height);if(w&&h){if(c.width!==w)c.width=w;if(c.height!==h)c.height=h}}}):null;
const fitC=c=>{if(RO){if(!c.__ro){c.__ro=1;RO.observe(c);const w=c.clientWidth,h=c.clientHeight;if(w&&h){c.width=w;c.height=h}}return}const w=c.clientWidth,h=c.clientHeight;if(w&&h&&(c.width!==w||c.height!==h)){c.width=w;c.height=h}};



function fz(d){const v=clamp((cfg.fz||17)+d*1.5,12,26);cfg.fz=v;saveCfg();document.documentElement.style.fontSize=v+'px';if($('setBody'))renderSettings()}
document.documentElement.style.fontSize=(cfg.fz||17)+'px';

/* ---------- performance: lite mode + one frame scheduler ---------- */
const PERF={lite:false,auto:true,frames:0,fT:0,last:0,slow:0},draws=[];let fps=0;
const defaultLite=()=>mm('(pointer:coarse)')||cores<=4;
function setLite(on,auto){PERF.lite=on;document.documentElement.classList.toggle('lite',on);if(auto)log('Lite mode switched on automatically (low frame rate).','s');try{R3.k=''}catch(e){}if($('setBody'))renderSettings()}
setLite(cfg.lite===null?defaultLite():cfg.lite,false);PERF.auto=cfg.lite===null;
function onFrame(f){draws.push(f)}
function loop(ts){requestAnimationFrame(loop);if(document.hidden)return;if(ts-PERF.last<(PERF.lite?30:14))return;PERF.last=ts;PERF.frames++;
  if(ts-PERF.fT>=1000){fps=PERF.frames;PERF.frames=0;PERF.fT=ts;if(Zack.ready&&PERF.auto&&!PERF.lite){if(fps<28)PERF.slow++;else PERF.slow=0;if(PERF.slow>=4)setLite(true,true)}}
  for(const f of draws)f(ts)}
requestAnimationFrame(loop);

/* ---------- CPU probe (estimated from event-loop lag + micro-benchmark) ---------- */
let cpuSm=0,lagAvg=0,maxOps=1,lastT=performance.now(),cpuWait=250;
function bench(){const t=performance.now();let n=0;while(performance.now()-t<2){for(let i=0;i<500;i++)Math.sqrt(i*n);n++}return n}
function cpuTick(){const now=performance.now(),lag=Math.max(0,now-lastT-cpuWait);lastT=now;lagAvg+=(lag-lagAvg)*.3;
  if(!document.hidden){const ops=bench();maxOps=Math.max(maxOps*.999,ops);cpuSm+=(clamp((1-ops/maxOps)*100+lagAvg*1.5,0,100)-cpuSm)*.25}
  cpuWait=document.hidden?2000:Zack.cpuFast?(PERF.lite?500:250):1200;setTimeout(cpuTick,cpuWait)}
setTimeout(cpuTick,250);

/* ---------- network probe (real pings to this page's server) ---------- */
let ping=null;const NQ={rtt:[],down:null};
async function pingOnce(){if(document.hidden)return;const t=performance.now();try{await fetch(location.href.split('#')[0],{method:'HEAD',cache:'no-store'});const d=performance.now()-t;NQ.rtt.push(d);ping=Math.round(d)}catch(e){NQ.rtt.push(null);ping=null}if(NQ.rtt.length>60)NQ.rtt.shift();netInfo()}
function nqStats(){const v=NQ.rtt.filter(x=>x!=null),n=NQ.rtt.length;if(!v.length)return null;const avg=v.reduce((a,b)=>a+b,0)/v.length;let j=0;for(let i=1;i<v.length;i++)j+=Math.abs(v[i]-v[i-1]);j/=Math.max(1,v.length-1);
  const loss=(n-v.length)/n*100;return{avg,max:Math.max(...v),j,loss,sc:clamp(100-clamp((avg-20)/3,0,50)-clamp(j*1.5,0,25)-loss*3,0,100)}}
function netInfo(){const off=!navigator.onLine,c=$('netChip');if(c)c.innerHTML=off?'<span style="color:var(--r)">NET: OFFLINE</span>':'NET: '+(conn&&conn.effectiveType?conn.effectiveType.toUpperCase():'ONLINE');if(Zack.onNet)Zack.onNet()}
addEventListener('online',()=>{log('Connection restored.','s');netInfo()});addEventListener('offline',()=>{log('Connection lost.','d');netInfo()});
conn&&conn.addEventListener&&conn.addEventListener('change',netInfo);
setInterval(pingOnce,2000);setTimeout(pingOnce,300);
function drawLinkRadar(c){fitC(c);const g=c.getContext('2d'),w=c.width,h=c.height,cx=w/2,cy=h/2,R=Math.min(w,h)/2-14,off=!navigator.onLine,col=off?'255,0,60':'0,238,255',v=NQ.rtt,mx=Math.max(100,...v.filter(x=>x!=null));
  g.clearRect(0,0,w,h);g.strokeStyle=`rgba(${col},.3)`;g.lineWidth=1;for(let i=1;i<=4;i++){g.beginPath();g.arc(cx,cy,R*i/4,0,7);g.stroke()}g.beginPath();g.moveTo(cx-R,cy);g.lineTo(cx+R,cy);g.moveTo(cx,cy-R);g.lineTo(cx,cy+R);g.stroke();
  LR.a+=off?.01:.04;for(let i=0;i<22;i++){g.beginPath();g.moveTo(cx,cy);g.arc(cx,cy,R,LR.a-i*.03-.03,LR.a-i*.03);g.fillStyle=`rgba(${col},${.2-i*.009})`;g.fill()}
  g.font='12px "Share Tech Mono",monospace';g.fillStyle='rgba(159,255,196,.9)';g.textAlign='left';for(let i=1;i<=4;i++)g.fillText(Math.round(mx*i/4)+' ms',cx+4,cy-R*i/4+12);
  g.beginPath();let on=false;v.forEach((p,i)=>{if(p==null){on=false;return}const a=i/60*6.2832-1.5708,r=p/mx*R,x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r;on?g.lineTo(x,y):g.moveTo(x,y);on=true});g.strokeStyle=off?'#ff003c':'#00ff66';g.lineWidth=2;g.stroke();
  v.forEach((p,i)=>{const a=i/60*6.2832-1.5708;if(p==null){g.fillStyle='#ff003c';g.fillRect(cx+Math.cos(a)*R-2,cy+Math.sin(a)*R-2,5,5)}else if(i===v.length-1){g.fillStyle='#fff';g.beginPath();g.arc(cx+Math.cos(a)*p/mx*R,cy+Math.sin(a)*p/mx*R,4,0,7);g.fill()}});
  const st=nqStats();g.textAlign='center';g.fillStyle='#fff';g.font='bold 18px "Share Tech Mono",monospace';g.fillText(off?'OFFLINE':(st?st.avg.toFixed(0)+' ms':'--'),cx,cy+6);g.textAlign='left'}
const LR={a:0};

/* ---------- fullscreen (re-enters on the first tap of every page) ---------- */
function fsUi(){const on=!!(document.fullscreenElement||document.webkitFullscreenElement),h=$('fsHint');if(h)h.style.display=(cfg.fs&&!on&&Zack.ready)?'block':'none';if($('setBody'))renderSettings()}
function enterFs(){if(!cfg.fs||document.fullscreenElement||document.webkitFullscreenElement)return;const d=document.documentElement,f=d.requestFullscreen||d.webkitRequestFullscreen;if(!f)return;
  try{const r=f.call(d,{navigationUI:'hide'});if(r&&r.then)r.then(()=>{try{navigator.keyboard&&navigator.keyboard.lock&&navigator.keyboard.lock(['Escape'])}catch(e){}}).catch(()=>{})}catch(e){}}
function toggleFs(){cfg.fs=!cfg.fs;saveCfg();if(cfg.fs)enterFs();else if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});log('Fullscreen: '+(cfg.fs?'ON':'OFF'),'s');fsUi()}
document.addEventListener('fullscreenchange',fsUi);document.addEventListener('webkitfullscreenchange',fsUi);
addEventListener('pointerdown',enterFs,true);addEventListener('keydown',e=>{if(e.key!=='Escape')enterFs()},true);

/* ---------- keep the screen awake (Screen Wake Lock, video fallback) ---------- */
const WL={lock:null,on:false,mode:null,v:null};
async function wlAcquire(){try{if('wakeLock' in navigator){WL.lock=await navigator.wakeLock.request('screen');WL.mode='api';WL.lock.addEventListener('release',()=>{WL.lock=null;if(WL.mode==='api')WL.mode=null});return true}}catch(e){}
  try{if(!WL.v){const c=document.createElement('canvas');c.width=c.height=16;const x=c.getContext('2d'),v=document.createElement('video');v.muted=true;v.setAttribute('playsinline','');v.style.cssText='position:fixed;left:0;top:0;width:1px;height:1px;opacity:.01;pointer-events:none';v.srcObject=c.captureStream(2);document.body.appendChild(v);setInterval(()=>{x.fillStyle=Math.random()<.5?'#000':'#010101';x.fillRect(0,0,16,16)},500);WL.v=v}await WL.v.play();WL.mode='video';return true}catch(e){}return false}
async function wlSet(on){WL.on=on;if(on){const ok=await wlAcquire();log(ok?'Keep awake ON ('+WL.mode+').':'Keep awake is not supported or is blocked here.',ok?'s':'d')}else{try{WL.lock&&await WL.lock.release()}catch(e){}WL.lock=null;WL.mode=null;if(WL.v)WL.v.pause()}if($('setBody'))renderSettings()}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&WL.on&&!WL.lock&&WL.mode!=='video')wlAcquire()});

/* ---------- Ambient music (generative, calm) ---------- */
const AMB={ac:null,m:null,on:false,no:false,ch:0,built:false,v:[]};
function getAC(){if(!AMB.ac)AMB.ac=new(window.AudioContext||window.webkitAudioContext)();if(AMB.ac.state==='suspended')AMB.ac.resume();return AMB.ac}
const CH=[[146.83,185,220,277.18],[123.47,146.83,185,220],[196,246.94,293.66,369.99],[220,277.18,329.63,392]],PN=[293.66,329.63,369.99,440,493.88,587.33,659.25,739.99];
function ambBuild(){const ac=getAC(),m=ac.createGain();m.gain.value=0;m.connect(ac.destination);
  const len=ac.sampleRate*4,ib=ac.createBuffer(2,len,ac.sampleRate);for(let c=0;c<2;c++){const d=ib.getChannelData(c);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.8)}
  const rv=ac.createConvolver();rv.buffer=ib;const wet=ac.createGain();wet.gain.value=.8;rv.connect(wet);wet.connect(m);
  const dry=ac.createGain();dry.gain.value=.45;dry.connect(m);const bus=ac.createGain();bus.connect(dry);bus.connect(rv);
  const f=ac.createBiquadFilter();f.type='lowpass';f.frequency.value=1100;f.Q.value=.4;f.connect(bus);
  const lfo=ac.createOscillator(),lg=ac.createGain();lfo.frequency.value=.04;lg.gain.value=450;lfo.connect(lg);lg.connect(f.frequency);lfo.start();
  AMB.v=[];for(let i=0;i<4;i++)for(const dt of[-6,6]){const o=ac.createOscillator(),g=ac.createGain();o.type='triangle';o.frequency.value=CH[0][i];o.detune.value=dt;g.gain.value=.04;o.connect(g);g.connect(f);o.start();AMB.v.push([o,i])}
  const sb=ac.createOscillator(),sg=ac.createGain();sb.type='sine';sb.frequency.value=CH[0][0]/2;sg.gain.value=.06;sb.connect(sg);sg.connect(bus);sb.start();AMB.sb=sb;AMB.m=m;AMB.bus=bus;AMB.built=true;
  setInterval(()=>{if(!AMB.on)return;AMB.ch=(AMB.ch+1)%CH.length;const T=ac.currentTime;AMB.v.forEach(([o,i])=>o.frequency.setTargetAtTime(CH[AMB.ch][i],T,2.5));AMB.sb.frequency.setTargetAtTime(CH[AMB.ch][0]/2,T,2.5)},9000);
  (function note(){if(AMB.on){const T=ac.currentTime,o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.value=PN[Math.random()*PN.length|0];g.gain.setValueAtTime(0,T);g.gain.linearRampToValueAtTime(.07,T+.03);g.gain.exponentialRampToValueAtTime(.0005,T+4);o.connect(g);g.connect(AMB.bus);o.start(T);o.stop(T+4.2)}setTimeout(note,2500+Math.random()*4000)})()}
function ambSet(on){if(!AMB.built)ambBuild();AMB.on=on;AMB.m.gain.setTargetAtTime(on?.4:0,getAC().currentTime,on?2.5:.6);if($('setBody'))renderSettings()}
function ambToggle(){try{cfg.amb=!AMB.on;saveCfg();ambSet(cfg.amb)}catch(e){log('Audio is not available in this browser.','d')}}



/* ---------- first gesture: fullscreen, music, wake lock ---------- */
function gest(){AMB.g=true;enterFs();if(Zack.ready)afterReady()}
function afterReady(){if(cfg.wl&&!WL.on)wlSet(true);if(cfg.amb&&AMB.g&&!AMB.on)try{ambSet(true)}catch(e){}}
addEventListener('pointerdown',gest,{once:true});addEventListener('keydown',gest,{once:true});
function ready(){Zack.ready=true;fsUi();afterReady()}

/* ---------- OS shell: top bar, dock, system menu, settings ---------- */
const PAGES=[['index','index.html','Dashboard','D'],['file','file.html','Files','F'],['maps','maps.html','Maps','M'],['net','net.html','Network','N'],['radar','radar.html','Radars','R']];
const seg=(id,opts,cur)=>`<div class="seg" data-id="${id}">`+opts.map(([v,l])=>`<button class="b${String(v)===String(cur)?' on':''}" data-v="${v}">${l}</button>`).join('')+'</div>';
const srow=(l,h)=>`<div class="srow"><span>${l}</span>${h}</div>`;
function renderSettings(){const lite=cfg.lite===null?'auto':cfg.lite?'on':'off',on=!!(document.fullscreenElement||document.webkitFullscreenElement);
  setH($('setBody'),srow('Theme',seg('theme',THK.map(k=>[k,THEMES[k].n]),cfg.theme))+srow('Lite mode (less CPU)',seg('lite',[['auto','AUTO'],['on','ON'],['off','OFF']],lite))+srow('Fullscreen'+(cfg.fs&&!on?' (tap once to enter)':''),seg('fs',[[1,'ON'],[0,'OFF']],cfg.fs?1:0))
   +srow('Ambient music',seg('amb',[[1,'ON'],[0,'OFF']],cfg.amb?1:0))+srow('Keep screen awake',seg('wl',[[1,'ON'],[0,'OFF']],cfg.wl?1:0))
   +srow('Text size','<div class="seg"><button class="b" data-a="fzm">A-</button><b>'+Math.round(cfg.fz)+' px</b><button class="b" data-a="fzp">A+</button></div>')
   +srow('Start-up animation',seg('boot',[['session','ONCE PER SESSION'],['always','EVERY START'],['off','OFF']],cfg.boot))
   +'<div class="flex flex-wrap gap-2 mt-2"><button class="b" data-a="reboot">REBOOT NOW</button><button class="b k" data-a="reset">RESET SETTINGS</button></div>')}
function applySetting(id,v){
  if(id==='theme')setTheme(v);
  else if(id==='lite'){cfg.lite=v==='auto'?null:v==='on';saveCfg();PERF.auto=cfg.lite===null;setLite(cfg.lite===null?defaultLite():cfg.lite,false)}
  else if(id==='fs'){cfg.fs=v==='1';saveCfg();if(cfg.fs)enterFs();else if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});fsUi()}
  else if(id==='amb'){cfg.amb=v==='1';saveCfg();try{ambSet(cfg.amb)}catch(e){}}
  else if(id==='wl'){cfg.wl=v==='1';saveCfg();wlSet(cfg.wl)}
  else if(id==='boot'){cfg.boot=v;saveCfg()}
  renderSettings()}
function reboot(){try{sessionStorage.removeItem('zackBooted')}catch(e){}go('index.html');if((document.body.dataset.page||'index')==='index')location.reload()}
function openSettings(){$('settings').style.display='flex';$('sysMenu').style.display='none';renderSettings()}
function buildShell(){const page=document.body.dataset.page||'index',cur=PAGES.find(p=>p[0]===page)||PAGES[0];
  document.body.insertAdjacentHTML('afterbegin',`<div id="top" class="topbar"><button class="b logo" id="sysBtn">ZACK ENGINE</button><b id="appName" class="glow">${cur[2]}</b><span class="grow"></span><span id="statusBadge" class="sm hide-sm">ONLINE</span><span id="netChip" class="sm hide-sm">NET: --</span><b id="clk" class="sm hide-sm"></b><button class="b" id="thBtn">THEME</button><button class="b" id="setBtn">SETTINGS</button></div>
<div id="sysMenu" class="menu"><div class="sm" style="opacity:.85;padding:.2rem .4rem">Zack Engine SYS v11<br>German Technology</div><button class="b" data-m="settings">Settings</button><button class="b" data-m="fs">Toggle fullscreen</button><button class="b" data-m="theme">Next theme</button><button class="b" data-m="reboot">Reboot (replay start-up)</button></div>`);
  document.body.insertAdjacentHTML('beforeend',`<nav class="dock">${PAGES.map(p=>`<a class="dk${p[0]===page?' on':''}" href="${p[1]}" onclick="return navClick(event,'${p[1]}')"><i>${p[3]}</i>${p[2]}</a>`).join('')}</nav>
<div class="modal" id="settings"><div class="box mwin"><div class="ttl"><span>Settings</span><button class="b" id="setClose">CLOSE</button></div><div id="setBody"></div><div class="sm" style="opacity:.85;margin-top:.6rem">Zack Engine SYS v11 · German Technology. Settings are saved in this browser and shared by every page.</div></div></div>
<div id="toast" class="box sm" style="position:fixed;left:.6rem;bottom:calc(5.4rem + env(safe-area-inset-bottom,0px));z-index:9400;pointer-events:none;opacity:0;transition:opacity .3s;max-width:min(36rem,92vw)"></div>
<div id="fsHint" class="box sm" style="position:fixed;left:50%;transform:translateX(-50%);top:3rem;z-index:9500;pointer-events:none;display:none">Tap or press any key to enter fullscreen</div>`);
  const b=$('thBtn');b.textContent='THEME: '+THEMES[cfg.theme].n;b.onclick=toggleTheme;$('setBtn').onclick=openSettings;
  $('sysBtn').onclick=()=>{const m=$('sysMenu');m.style.display=m.style.display==='flex'?'none':'flex'};
  $('sysMenu').onclick=e=>{const k=e.target.dataset&&e.target.dataset.m;if(!k)return;$('sysMenu').style.display='none';if(k==='settings')openSettings();else if(k==='fs')toggleFs();else if(k==='theme')toggleTheme();else if(k==='reboot')reboot()};
  $('setClose').onclick=()=>{$('settings').style.display='none'};$('settings').onclick=e=>{if(e.target.id==='settings')$('settings').style.display='none'};
  addEventListener('keydown',e=>{if(e.key==='Escape')$('settings').style.display='none'});
  $('setBody').onclick=e=>{const t=e.target;if(t.dataset.a==='fzm')return fz(-1);if(t.dataset.a==='fzp')return fz(1);if(t.dataset.a==='reboot')return reboot();
    if(t.dataset.a==='reset'){cfg=Object.assign({},DEF);saveCfg();location.reload();return}const s=t.closest&&t.closest('.seg');if(s&&t.dataset.v!==undefined)applySetting(s.dataset.id,t.dataset.v)};
  document.addEventListener('click',e=>{if(!e.target.closest('#sysMenu,#sysBtn'))$('sysMenu').style.display='none'});
  setInterval(()=>{if(!document.hidden)$('clk').textContent=new Date().toISOString().slice(11,19)+' UTC'},1000);$('clk').textContent=new Date().toISOString().slice(11,19)+' UTC'}
buildShell();netInfo();
