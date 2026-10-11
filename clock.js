/* ===== Clock: world clocks, stopwatch, timer ===== */
const TK='zack.clock';let TZ=['UTC','America/New_York','Europe/London','Europe/Bucharest','Asia/Tokyo','Australia/Sydney'];try{const s=JSON.parse(localStorage.getItem(TK)||'null');if(s&&s.length)TZ=s}catch(e){}
const saveTZ=()=>{try{localStorage.setItem(TK,JSON.stringify(TZ))}catch(e){}};
try{$('tzl').innerHTML=(Intl.supportedValuesOf?Intl.supportedValuesOf('timeZone'):[]).map(z=>`<option value="${z}">`).join('')}catch(e){}
function worlds(){const d=new Date();setH($('wl'),TZ.map(z=>{let t='--:--:--',dt='';try{t=d.toLocaleTimeString('en-GB',{timeZone:z});dt=d.toLocaleDateString('en-GB',{timeZone:z,weekday:'short',day:'2-digit',month:'short'})}catch(e){}return`<div class="card" style="margin:0"><div class="flex justify-between"><span class="sm" style="opacity:.8">${esc(z.replace(/_/g,' '))}</span><button class="chip" data-del="${esc(z)}">x</button></div><div class="big">${t}</div><div class="sm">${dt}</div></div>`}).join(''))}
$('wl').addEventListener('click',e=>{const z=e.target.dataset&&e.target.dataset.del;if(z){TZ=TZ.filter(x=>x!==z);saveTZ();worlds()}});
$('tzAdd').onclick=()=>{const v=$('tzIn').value.trim();if(!v)return;try{new Intl.DateTimeFormat('en',{timeZone:v});if(!TZ.includes(v)){TZ.push(v);saveTZ()}$('tzIn').value='';worlds()}catch(e){log('Unknown time zone name.','d')}};
/* stopwatch */
let sw={on:false,t0:0,acc:0};const fmt=ms=>{const s=ms/1000,m=Math.floor(s/60);return String(m).padStart(2,'0')+':'+(s%60).toFixed(2).padStart(5,'0')};
$('swGo').onclick=()=>{if(sw.on){sw.acc+=performance.now()-sw.t0;sw.on=false;$('swGo').textContent='START'}else{sw.t0=performance.now();sw.on=true;$('swGo').textContent='STOP'}};
$('swReset').onclick=()=>{sw={on:false,t0:0,acc:0};$('swGo').textContent='START';$('swOut').textContent='00:00.00'};
/* timer */
let tm={on:false,end:0,left:0};
function beep(){try{const a=new(window.AudioContext||window.webkitAudioContext)(),o=a.createOscillator(),g=a.createGain();o.frequency.value=880;g.gain.value=.2;o.connect(g);g.connect(a.destination);o.start();setTimeout(()=>{o.stop();a.close()},700)}catch(e){}}
$('tmGo').onclick=()=>{if(tm.on){tm.left=tm.end-Date.now();tm.on=false;$('tmGo').textContent='RESUME'}else{if(!tm.left)tm.left=((+$('tmMin').value||0)*60+(+$('tmSec').value||0))*1000;if(tm.left<=0)return;tm.end=Date.now()+tm.left;tm.on=true;$('tmGo').textContent='PAUSE'}};
$('tmReset').onclick=()=>{tm={on:false,end:0,left:0};$('tmGo').textContent='START';$('tmOut').textContent='00:00'};
setInterval(()=>{if(document.hidden)return;worlds();if(sw.on)$('swOut').textContent=fmt(sw.acc+performance.now()-sw.t0);
  if(tm.on){const l=tm.end-Date.now();if(l<=0){tm={on:false,end:0,left:0};$('tmOut').textContent='00:00';$('tmGo').textContent='START';beep();log('Timer finished','s')}else $('tmOut').textContent=String(Math.floor(l/60000)).padStart(2,'0')+':'+String(Math.ceil(l/1000)%60).padStart(2,'0')}},100);
worlds();ready();
