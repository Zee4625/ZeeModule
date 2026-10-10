/* ===== Zack Engine SYS v11 · Dashboard ===== */
let online=false;
/* ---------- xOy ---------- */
const xy=$('xyC'),xc=xy.getContext('2d');let trace=[];
function rsXy(){fitC(xy)}
addEventListener('resize',rsXy);rsXy();
addEventListener('mousemove',e=>{
  $('xV').textContent=e.clientX+' px';$('yV').textContent=e.clientY+' px';
  const dx=e.clientX-innerWidth/2,dy=e.clientY-innerHeight/2,m=Math.hypot(dx,dy);
  $('magV').textContent=m.toFixed(1);$('angV').textContent=((Math.atan2(dy,dx)*180/Math.PI+360)%360).toFixed(1)+'°';
  
  trace.push({x:e.clientX/innerWidth*xy.width,y:e.clientY/innerHeight*xy.height});if(trace.length>25)trace.shift()});
function drawXy(){rsXy();xc.clearRect(0,0,xy.width,xy.height);xc.strokeStyle='rgba(0,238,255,.2)';xc.beginPath();
  xc.moveTo(0,xy.height/2);xc.lineTo(xy.width,xy.height/2);xc.moveTo(xy.width/2,0);xc.lineTo(xy.width/2,xy.height);xc.stroke();
  if(trace.length>1){xc.beginPath();trace.forEach((p,i)=>i?xc.lineTo(p.x,p.y):xc.moveTo(p.x,p.y));xc.strokeStyle='rgba(0,238,255,.9)';xc.lineWidth=1.5;xc.stroke()}}


/* ---------- planet / starfield ---------- */
const pc=$('plC'),px=pc.getContext('2d');
function rsPl(){fitC(pc)}pc.addEventListener('animationend',()=>pc.classList.remove('opening'));
addEventListener('resize',rsPl);rsPl();
let rot=0,rad=0;const dots=[],stars=[],R=115;
for(let i=0;i<=18;i++)for(let j=0;j<36;j++)dots.push({lat:i/18*Math.PI-Math.PI/2,lon:j/36*Math.PI*2});
for(let s=0;s<120;s++)stars.push({x:Math.random()*2000,y:Math.random()*1000,z:Math.random()*1.8+.4,v:Math.random()*.04+.01,o:Math.random()});
const blips=[{n:"US-DC",lat:.68,lon:-1.34,c:"#00ff66"},{n:"EU-RO",lat:.83,lon:.46,c:"#00eeff"},{n:"AS-TK",lat:.62,lon:2.44,c:"#fbbf24"}];
function drawPlanet(){rsPl();px.clearRect(0,0,pc.width,pc.height);const cx=pc.width/2,cy=pc.height/2;
  stars.forEach(s=>{s.o+=s.v;if(s.o>1||s.o<.2)s.v*=-1;px.fillStyle=`rgba(255,255,255,${Math.abs(s.o)})`;px.fillRect(s.x%pc.width,s.y%pc.height,s.z,s.z)});
  if(!online)return;rot+=.012;rad+=.025;
  px.beginPath();px.arc(cx,cy,R+22,0,7);px.strokeStyle='rgba(0,255,102,.3)';px.setLineDash([5,5]);px.stroke();px.setLineDash([]);
  dots.forEach(d=>{const L=d.lon+rot,x=R*Math.cos(d.lat)*Math.sin(L),y=R*Math.sin(d.lat),z=R*Math.cos(d.lat)*Math.cos(L);
    if(z>-40){const k=320/(320+z);px.fillStyle=`rgba(0,255,102,${Math.max(.15,(z+R)/(2*R))})`;px.fillRect(cx+x*k-1,cy+y*k-1,2.5*k,2.5*k)}});
  blips.forEach(b=>{const L=b.lon+rot,x=R*Math.cos(b.lat)*Math.sin(L),y=R*Math.sin(b.lat),z=R*Math.cos(b.lat)*Math.cos(L);
    if(z>0){const k=320/(320+z),X=cx+x*k,Y=cy+y*k;px.strokeStyle=px.fillStyle=b.c;px.beginPath();px.arc(X,Y,6+Math.sin(rad*3)*3,0,7);px.stroke();
      px.beginPath();px.arc(X,Y,3,0,7);px.fill();px.font='13px "Share Tech Mono",monospace';px.fillText(`[${b.n}]`,X+8,Y-4)}});
  px.beginPath();px.moveTo(cx,cy);px.lineTo(cx+Math.cos(rad)*(R+25),cy+Math.sin(rad)*(R+25));px.strokeStyle='rgba(0,238,255,.85)';px.lineWidth=2;px.stroke();px.lineWidth=1;
  px.beginPath();px.arc(cx,cy,R+8,0,7);px.strokeStyle='rgba(0,238,255,.45)';px.stroke()}



/* CPU card */
const cpuC=$('cpuC'),cx2=cpuC.getContext('2d'),coreV=[],cpuHist=[];$('cpuCores').textContent=cores;Zack.cpuFast=true;
for(let i=0;i<Math.min(cores,16);i++){$('coreBars').insertAdjacentHTML('beforeend',`<div class="sm">C${i}<div class="bar"><i id="cb${i}" style="width:0"></i></div></div>`);coreV.push(0)}
function cpuUi(){cpuHist.push(cpuSm);if(cpuHist.length>60)cpuHist.shift();$('cpuPct').textContent=cpuSm.toFixed(0)+'%';$('cpuLag').textContent=lagAvg.toFixed(1)+' ms';$('cpuFps').textContent=fps;$('cpuMode').textContent=cpuSm>70?'HIGH':cpuSm>35?'ACTIVE':'NOMINAL';
  $('cpuPct').style.color=cpuSm>70?'var(--r)':cpuSm>35?'var(--y)':'var(--g)';
  coreV.forEach((v,i)=>{const t=clamp(cpuSm*(i===0?1.15:.6+Math.random()*.6),0,100);coreV[i]+=(t-v)*.4;const e=$('cb'+i);e.style.width=coreV[i]+'%';e.style.background=coreV[i]>70?'var(--r)':coreV[i]>35?'var(--y)':'var(--g)'})}
function drawCpu(){fitC(cpuC);const w=cpuC.width,h=cpuC.height;cx2.clearRect(0,0,w,h);cx2.beginPath();cpuHist.forEach((v,i)=>{const x=i/59*w,y=h-v/100*h;i?cx2.lineTo(x,y):cx2.moveTo(x,y)});cx2.strokeStyle='#00ff66';cx2.lineWidth=1.5;cx2.stroke()}
/* link radar card */
function drawWifi(){drawLinkRadar($('wfC'))}
Zack.onNet=()=>{const off=!navigator.onLine;$('wfLink').textContent=off?'OFFLINE':'ONLINE';$('wfLink').style.color=off?'var(--r)':'var(--c)';$('wfType').textContent=conn?(conn.type||conn.effectiveType||'n/a').toUpperCase():'n/a';
  $('wfDown').textContent=conn&&conn.downlink?conn.downlink+' Mb/s':'n/a';$('wfRtt').textContent=off?'--':(ping!==null?ping+' ms':conn&&conn.rtt!=null?conn.rtt+' ms':'n/a');$('wifiSt').textContent=off?'OFF-RADAR':'LOCKED';$('wifiSt').style.color=off?'var(--r)':'var(--c)'};
/* access register: protected by the code 4625 (a convenience lock, not real security) */
const RG={open:false,fails:[],t:0};
function rgShow(on){RG.open=on;$('rgLock').style.display=on?'none':'';$('rgView').style.display=on?'':'none';$('rgSt').textContent=on?'UNLOCKED':'LOCKED';$('rgSt').style.color=on?'var(--g)':'var(--r)';clearTimeout(RG.t);if(on){renderReg();resolvePlaces();RG.t=setTimeout(()=>rgShow(false),120000)}}
function rgTry(){const now=Date.now();RG.fails=RG.fails.filter(t=>now-t<60000);if(RG.fails.length>=5){$('rgMsg').textContent='Too many attempts. Wait a minute.';return}
  const v=$('rgCode').value.trim();$('rgCode').value='';if(v==='4625'){reg('REGISTER','opened with the access code');$('rgMsg').textContent='';rgShow(true)}else{RG.fails.push(now);reg('DENIED','wrong code entered');$('rgMsg').textContent='ACCESS DENIED';$('rgMsg').style.color='var(--r)'}}
$('rgGo').onclick=rgTry;$('rgCode').addEventListener('keydown',e=>{if(e.key==='Enter')rgTry()});$('rgLockBtn').onclick=()=>rgShow(false);
$('rgLoc').onclick=()=>{regLocate();log('Asking the browser for your location ...','s')};
{let clr=0;$('rgClear').onclick=()=>{if(Date.now()-clr>4000){clr=Date.now();$('rgClear').textContent='CONFIRM CLEAR';setTimeout(()=>{$('rgClear').textContent='CLEAR LOG'},4000);return}regSave([]);reg('REGISTER','log cleared');$('rgClear').textContent='CLEAR LOG'}}
const EVC={START:'var(--g)',BOOT:'var(--g)',PAGE:'inherit',LOCATION:'var(--c)',DENIED:'var(--r)',REGISTER:'var(--y)'};
function renderReg(){const a=regLoad().slice().reverse().slice(0,150);
  setH($('rgList'),a.length?a.map(e=>{const d=new Date(e.t),where=e.loc?(e.place||('lat '+e.loc.la.toFixed(4)+', lon '+e.loc.lo.toFixed(4)))+' (±'+e.loc.acc+' m)':e.tz+' (time zone)';
    return`<div class="rgRow"><div class="flex flex-wrap justify-between gap-2"><b style="color:${EVC[e.ev]||'inherit'}">${esc(e.ev)}</b><span style="opacity:.9">${esc(d.toLocaleString())}</span></div><div>${esc(e.who)} · ${esc(e.page)} · <span style="color:var(--c)">${esc(where)}</span></div><div style="opacity:.8">${esc(e.dev)}${e.note?' · '+esc(e.note):''}</div></div>`}).join(''):'<div style="opacity:.85">The register is empty.</div>')}
let geoP=null;const loadGeo=()=>typeof GEO!=='undefined'?Promise.resolve():geoP||(geoP=new Promise((ok,no)=>{const s=document.createElement('script');s.src='geo.js';s.onload=ok;s.onerror=no;document.head.appendChild(s)}));
function pipg(rs,lo,la){let ins=false;for(const r of rs)for(let j=0,n=r.length-2;j<r.length;n=j,j+=2){const xi=r[j],yi=r[j+1],xj=r[n],yj=r[n+1];if((yi>la)!==(yj>la)&&lo<(xj-xi)*(la-yi)/(yj-yi)+xi)ins=!ins}return ins}
function placeOf(la,lo){for(let i=0;i<GEO.length;i++){const c=GEO[i];if(lo<c[3]||lo>c[5]||la<c[4]||la>c[6]||!pipg(c[7],lo,la))continue;for(const a of ADM){if(a[8]!==i||lo<a[3]||lo>a[5]||la<a[4]||la>a[6])continue;if(pipg(a[7],lo,la))return a[0]+', '+c[0]}return c[0]}return'Ocean / unknown'}
async function resolvePlaces(){const a=regLoad(),need=a.filter(e=>e.loc&&!e.place);if(!need.length)return;try{await loadGeo()}catch(e){return}need.forEach(e=>{e.place=placeOf(e.loc.la,e.loc.lo)});regSave(a);renderReg()}
Zack.onReg=()=>{if(RG.open){renderReg();resolvePlaces()}};
/* online + frame loop + start-up */
function unlock(){online=true;setStatus('ONLINE');$('dormant').classList.add('hidden');pc.classList.remove('hidden');pc.classList.add('opening');rsPl();$('zones').classList.remove('hidden');
  $('zones').innerHTML=[['US-DC','Washington DC','var(--g)'],['EU-RO','Botoșani, RO','var(--c)'],['AS-TK','Tokyo, JP','var(--y)']].map(z=>`<div class="box" style="color:${z[2]};padding:.15rem .4rem">${z[0]} · ${z[1]}</div>`).join('');$('radarTxt').textContent='ACTIVE'}
let lastUi=0;onFrame(ts=>{drawXy();drawPlanet();drawWifi();drawCpu();if(ts-lastUi>250){lastUi=ts;cpuUi()}});
Zack.onNet();
(async()=>{let need=cfg.boot==='always';try{if(cfg.boot==='session'&&!sessionStorage.getItem('zackBooted'))need=true}catch(e){need=cfg.boot!=='off'}
  const t0=Date.now();if(need){await Boot.run();reg('BOOT','start-up finished in '+Math.round((Date.now()-t0)/1000)+' s');try{sessionStorage.setItem('zackBooted','1')}catch(e){}}else{$('engO').style.display='none'}
  unlock();ready()})();
