/* ===== Zack Engine SYS v11 · start-up (about 30 seconds) · power-on screen, sound, progress bar, data rain, finale ===== */
const Boot=(()=>{
const bt=$('bt'),sleep=ms=>new Promise(r=>setTimeout(r,ms));let SC=1;const zz=ms=>sleep(ms*SC);
let SKIP=false;
/* ---- sound (synthesised in the browser, no audio files) ---- */
const SFX=(()=>{let ac=null,mst=null,echo=null,on=false,seekOn=false,lastT=0,nb=null;
 const vol=()=>cfg.vol==null?40:cfg.vol,can=()=>cfg.bsnd!==false&&vol()>0;
 function init(){if(!can())return on=false;try{ac=getAC();mst=ac.createGain();mst.gain.value=clamp(volGain()*1.25,.02,1);const cmp=ac.createDynamicsCompressor();mst.connect(cmp);cmp.connect(ac.destination);
   echo=ac.createDelay(1);echo.delayTime.value=.24;const fb=ac.createGain();fb.gain.value=.34;echo.connect(fb);fb.connect(echo);const eo=ac.createGain();eo.gain.value=.5;echo.connect(eo);eo.connect(mst);on=true}catch(e){on=false}return on}
 const T=()=>ac.currentTime;
 function tone(f,d,type,v,o){if(!on)return;o=o||{};const t0=T()+(o.at||0),os=ac.createOscillator(),g=ac.createGain();os.type=type||'sine';os.frequency.setValueAtTime(f,t0);if(o.to)os.frequency.exponentialRampToValueAtTime(o.to,t0+d);
   g.gain.setValueAtTime(.0001,t0);g.gain.exponentialRampToValueAtTime(v||.1,t0+(o.a||.005));g.gain.exponentialRampToValueAtTime(.0001,t0+d);os.connect(g);g.connect(mst);if(o.echo)g.connect(echo);os.start(t0);os.stop(t0+d+.05)}
 function noise(d,v,f1,f2,q,o){if(!on)return;o=o||{};if(!nb){nb=ac.createBuffer(1,ac.sampleRate*2,ac.sampleRate);const a=nb.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=Math.random()*2-1}
   const t0=T()+(o.at||0),s=ac.createBufferSource(),g=ac.createGain(),f=ac.createBiquadFilter();s.buffer=nb;f.type=o.type||'bandpass';f.Q.value=q||1;f.frequency.setValueAtTime(f1,t0);if(f2)f.frequency.exponentialRampToValueAtTime(f2,t0+d);
   g.gain.setValueAtTime(.0001,t0);g.gain.exponentialRampToValueAtTime(v,t0+(o.a||.004));g.gain.exponentialRampToValueAtTime(.0001,t0+d);s.connect(f);f.connect(g);g.connect(mst);s.start(t0,Math.random()*1.5);s.stop(t0+d+.05)}
 function loop(){if(!seekOn||!on)return;noise(.018,.1,1500+Math.random()*1200,900,3);setTimeout(loop,90+Math.random()*320)}
 return{init,get on(){return on},can,
  power(){noise(.05,.5,900,300,2,{type:'highpass'});tone(48,2.4,'sawtooth',.05,{to:96,a:.6});tone(96,2.2,'sine',.08,{to:192,a:.5});noise(1.9,.05,200,1400,.8,{at:.1});tone(1400,.06,'square',.03,{at:1.9})},
  post(){tone(1000,.14,'square',.06)},
  tick(){if(!on)return;const n=performance.now();if(n-lastT<45)return;lastT=n;tone(520+Math.random()*340,.04,'square',.022)},
  nav(){tone(640,.05,'square',.05)},confirm(){tone(880,.07,'square',.06);tone(1320,.09,'square',.05,{at:.06})},
  key(){noise(.025,.14,2400,1200,1.5,{type:'highpass'});tone(1900+Math.random()*500,.02,'square',.02)},
  hex(ms){noise(ms/1000,.07,2500,700,.7)},
  seek(v){seekOn=v;if(v)loop()},
  rise(d){tone(180,d,'sine',.05,{to:900,a:d*.3});noise(d,.03,300,5000,.6)},
  chime(){[523.25,659.25,783.99,1046.5].forEach((f,i)=>{tone(f,1.6,'sine',.09,{at:i*.12,echo:1});tone(f*2,1.1,'triangle',.025,{at:i*.12,echo:1})});[261.63,329.63,392].forEach(f=>tone(f,2.6,'sine',.035,{a:.25}))},
  zap(){noise(.35,.25,6000,300,.5);tone(140,.4,'sawtooth',.05,{to:30})}}})();
/* ---- progress bar ---- */
let rafP=0,pv=0,pt=0,pStage='';
const P=(p,label)=>{pt=Math.max(pt,p);if(label)pStage=label};
function hudBuild(ov){const d=document.createElement('div');d.id='bHud';d.innerHTML='<span id="bStage">BOOT</span><div id="bBar"><i id="bFill"></i></div><span id="bPct">0%</span><button class="chip" id="bSkip" title="Skip the start-up (Esc)">SKIP ▸</button>';ov.appendChild(d);
  $('bSkip').onclick=e=>{e.stopPropagation();skip()}}
function hudLoop(){pv+=(pt-pv)*.08;if(Math.abs(pt-pv)<.05)pv=pt;const f=$('bFill');if(f){f.style.width=pv.toFixed(1)+'%';$('bPct').textContent=Math.round(pv)+'%';$('bStage').textContent=pStage}rafP=requestAnimationFrame(hudLoop)}
function skip(){if(SKIP)return;SKIP=true;SC=.02;SFX.seek(false)}
/* ---- falling-data background ---- */
function rain(ov){if(cfg.lite===true)return()=>{};const cv=document.createElement('canvas');cv.id='bFx';ov.insertBefore(cv,ov.firstChild);const g=cv.getContext('2d'),GR=(getComputedStyle(document.documentElement).getPropertyValue('--gr')||'0,255,102').trim(),CH='01ZACKENGINE<>/#$%',fs=16;let cols=0,ys=[],raf=0,last=0,alive=true;
  const fit=()=>{cv.width=ov.clientWidth||innerWidth;cv.height=ov.clientHeight||innerHeight;cols=Math.ceil(cv.width/fs);ys=Array.from({length:cols},()=>Math.random()*-50)};fit();addEventListener('resize',fit);
  const step=t=>{if(!alive)return;raf=requestAnimationFrame(step);if(t-last<50)return;last=t;g.fillStyle='rgba(0,0,0,.14)';g.fillRect(0,0,cv.width,cv.height);g.font=fs+'px monospace';for(let i=0;i<cols;i++){const y=ys[i]*fs;if(y>0){g.fillStyle='rgba('+GR+',.9)';g.fillText(CH[Math.floor(Math.random()*CH.length)],i*fs,y)}ys[i]+=1;if(y>cv.height&&Math.random()>.975)ys[i]=Math.random()*-20}};raf=requestAnimationFrame(step);
  return()=>{alive=false;cancelAnimationFrame(raf);removeEventListener('resize',fit);cv.remove()}}
/* ---- power-on screen (also gives the browser the click it needs to allow sound) ---- */
function gate(ov){return new Promise(res=>{if(!SFX.can())return res(false);const d=document.createElement('div');d.id='bGate';
  d.innerHTML='<div class="pwr"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><path d="M12 3v9"/><path d="M6.3 6.6a8 8 0 1 0 11.4 0"/></svg></div><div class="sn">ZACK ENGINE</div><div class="st">SYS v11 · Z.Engine OS · Made in Germany</div><div class="gt">TAP OR PRESS ANY KEY TO POWER ON</div><button class="chip" id="gSnd">START WITHOUT SOUND</button>';ov.appendChild(d);
  const off=()=>{removeEventListener('keydown',key,true);d.removeEventListener('pointerdown',click)};
  const done=()=>{off();SFX.init();SFX.power();d.classList.add('go');setTimeout(()=>d.remove(),700);res(true)};
  const key=e=>{if(/^(Shift|Control|Alt|Meta)$/.test(e.key))return;e.preventDefault();done()};
  const click=e=>{if(e.target.id==='gSnd'){e.stopPropagation();off();cfg.bsnd=false;saveCfg();d.remove();res(false);return}done()};
  addEventListener('keydown',key,true);d.addEventListener('pointerdown',click)})}
/* ---- finale: ring fills, chime, flash ---- */
async function splash(ov){const d=document.createElement('div');d.id='bSplash';
  d.innerHTML='<div class="sw"><svg viewBox="0 0 200 200"><circle class="r0" cx="100" cy="100" r="86"/><circle class="r2" cx="100" cy="100" r="74"/><circle id="bRing" class="r1" cx="100" cy="100" r="86" transform="rotate(-90 100 100)"/></svg><div class="sz">Z</div></div><div class="sn">ZACK ENGINE</div><div class="st">German Technology · Z.Engine OS</div><div id="sPct" class="sp">0%</div>';ov.appendChild(d);requestAnimationFrame(()=>d.classList.add('in'));
  const D=SKIP?300:2600,C=540.35,ring=d.querySelector('#bRing');ring.style.strokeDasharray=C;ring.style.strokeDashoffset=C;if(!SKIP){SFX.rise(D/1000);SFX.hex(400)}
  const t0=performance.now();await new Promise(r=>{const f=()=>{const k=Math.min(1,(performance.now()-t0)/D),e=1-Math.pow(1-k,2.2);ring.style.strokeDashoffset=C*(1-e);$('sPct').textContent=Math.round(e*100)+'%';k<1?requestAnimationFrame(f):r()};f()});
  SFX.chime();d.classList.add('done');await sleep(SKIP?150:900);SFX.zap();d.classList.add('flash');await sleep(SKIP?60:260);d.remove()}

const bp=h=>{bt.insertAdjacentHTML('beforeend',h+'\n');bt.scrollTop=bt.scrollHeight;if(h.startsWith(OK))SFX.tick()};
const OK='[  <b style="color:var(--g)">OK</b>  ] ',WARN='[<b style="color:var(--y)">WARN</b>] ',DIM=t=>`<span style="color:#8a8a8a">${t}</span>`;
const GL={Z:['#####','   # ','  #  ',' #   ','#####'],A:[' ### ','#   #','#####','#   #','#   #'],C:[' ####','#    ','#    ','#    ',' ####'],K:['#   #','#  # ','###  ','#  # ','#   #'],E:['#####','#    ','#### ','#    ','#####'],N:['#   #','##  #','# # #','#  ##','#   #'],G:[' ####','#    ','#  ##','#   #',' ####'],I:['#####','  #  ','  #  ','  #  ','#####']};
const art=w=>[0,1,2,3,4].map(r=>[...w].map(ch=>GL[ch][r]).join(' '));
async function typeTo(id,txt,ms){for(const ch of txt){$(id).textContent+=ch;SFX.key();await zz(ms+Math.random()*40)}}
function glName(){try{const c=document.createElement('canvas'),gl=c.getContext('webgl'),x=gl.getExtension('WEBGL_debug_renderer_info');return String(x?gl.getParameter(x.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER)).replace(/ANGLE \(|\)/g,'').slice(0,60)}catch(e){return'virtual framebuffer'}}
const tzn=()=>{try{return Intl.DateTimeFormat().resolvedOptions().timeZone}catch(e){return'UTC'}},mem=()=>navigator.deviceMemory||8;
async function manager(){const items=['Zack Engine SYS v11  (Grün · green theme)','Zack Engine SYS v11  (Schwarz-Weiß · black &amp; white theme)','Zack Engine SYS v11  (Violett · purple theme)','Zack Engine SYS v11  (Rot · red theme)','Advanced options for Zack Engine SYS v11'];
  let sel=Math.max(0,THK.indexOf(cfg.theme)),left=3,done=false;const ov=$('engO'),pick=i=>{sel=i;if(i<THK.length)setTheme(THK[i])};
  const draw=()=>{bt.innerHTML=`<div style="text-align:center;color:#fff;margin-top:5vh;letter-spacing:.12em">ZACK ENGINE BOOT MANAGER  ·  version 11.0</div><div style="text-align:center;color:var(--g);margin-bottom:1vh">German Technology · Präzision · Qualität</div><div style="border:1px solid #ddd;margin:2vh 4vw;padding:6px 4px;color:#ddd">${items.map((x,i)=>`<div data-i="${i}" style="padding:4px 8px;cursor:pointer;${i===sel?'background:#ddd;color:#000':''}">${i===sel?'*':'&nbsp;'}${x}</div>`).join('')}</div><div style="margin:0 4vw;color:#ccc">Use the arrow keys (or tap) to choose a theme.\nPress Enter or tap to start in fullscreen.\n${left>=0?'The highlighted entry will be started automatically in '+left+'s.':''}</div>`};
  const key=e=>{if(e.key==='Enter'){SFX.confirm();done=true;enterFs()}else if(e.key==='ArrowDown'){SFX.nav();pick((sel+1)%items.length);left=-1;draw()}else if(e.key==='ArrowUp'){SFX.nav();pick((sel+items.length-1)%items.length);left=-1;draw()}},
    clk=e=>{const t=e.target.closest&&e.target.closest('[data-i]');if(t){SFX.nav();pick(+t.dataset.i)}SFX.confirm();done=true;enterFs()};
  addEventListener('keydown',key);ov.addEventListener('click',clk);draw();
  while(!done&&left!==0&&!SKIP){await sleep(1000);if(left>0)left--;SFX.tick();draw()}
  removeEventListener('keydown',key);ov.removeEventListener('click',clk);bt.innerHTML='';await sleep(200)}
async function kernel(){SFX.post();SFX.seek(true);const res=screen.width+'x'+screen.height,gpu=esc(glName()),c=cores,m=mem();let t=0;const hx=n=>'0x'+n.toString(16).padStart(16,'0');
  const L=['<b>Zack Engine</b> kernel 11.0.4-zack (build@zack-engine) (gcc 13.2.0) #1 SMP PREEMPT  [Made in Germany]','Command line: BOOT_IMAGE=/boot/ze-kernel-11.0.4 root=UUID=4625-SEC ro quiet','KERNEL supported cpus: Intel GenuineIntel, AMD AuthenticAMD, ARM','x86/fpu: Supporting XSAVE feature 0x001: x87 floating point registers','x86/fpu: Supporting XSAVE feature 0x002: SSE registers','BIOS-provided physical RAM map:','BIOS-e820: [mem '+hx(0)+'-'+hx(0x9ffff)+'] usable','BIOS-e820: [mem '+hx(0x100000)+'-'+hx(m*1073741824-1)+'] usable','DMI: '+esc(navigator.platform||'x86_64')+' / '+res+' display','tsc: Detected '+(1800+c*130)+'.000 MHz processor','Calibrating delay loop... '+(3600+c*260)+'.00 BogoMIPS','smpboot: Allowing '+c+' CPUs, 0 hotplug CPUs','Memory: ~'+m+'G available (kernel code 14336K, data 2560K, init 3200K)','Zone ranges: DMA32 [mem 0x1000-0xffffffff], Normal','rcu: Hierarchical RCU implementation.','Console: colour dummy device '+res,'clocksource: tsc: mask: 0xffffffffffffffff','smp: Bringing up secondary CPUs ...','smp: Brought up 1 node, '+c+' CPUs','devtmpfs: initialized','NET: Registered protocol family 2 (PF_INET)','PCI: Using configuration type 1 for base access','ACPI: Interpreter enabled','GPU: '+gpu,'usb 1-1: new high-speed USB device number 2 using xhci_hcd','input: AT Translated Set 2 keyboard as /devices/platform/i8042/serio0/input0','input: ImPS/2 Generic Wheel Mouse as /devices/platform/i8042/serio1/input1','eth0: link is '+(navigator.onLine?'Up 1000 Mbps Full Duplex':'Down'),'rtc: setting system clock to '+new Date().toISOString().slice(0,19).replace('T',' ')+' UTC ('+esc(tzn())+')','EXT4-fs (sda2): mounted filesystem with ordered data mode','EXT4-fs (sda2): re-mounted. Opts: errors=remount-ro','Freeing unused kernel image memory: 3200K','Write protecting the kernel read-only data: 20480k','Run /init as init process'],d=8000/L.length;
  for(let i=0;i<L.length;i++){if(i===12||i===26){SFX.hex(650);await hexBurst(650)}t+=Math.random()*.4;bp(DIM('['+t.toFixed(6).padStart(11,' ')+']')+' '+L[i]+(i%9===8?'  '+OK.trim():''));P(8+27*(i+1)/L.length,'KERNEL');await zz(d*(.5+Math.random()))}}
async function services(){const tz=esc(tzn());
  bp('ze-init 11 running in system mode (+AUDIT +SELINUX +IMA +SMACK +ZSTD)');bp('Detected virtualization web-browser.');bp('Hostname set to &lt;zack-engine&gt;.');await zz(300);
  const U=['Created slice system-modprobe.slice.','Reached target Swap.','Started Journal Service.','Mounted /boot/efi.','Started Rule-based Manager for Device Events (udev).','Reached target Local File Systems.','Started Network Service.','Reached target Network.','Started Time Zone Daemon ('+tz+').','Started D-Bus System Message Bus.','Started Login Service.','Started Audio Service (pipewire).','Started Zack CPU Probe ('+cores+' threads).','Started Zack Radar Daemon.','Started Zack Map Data Service.','Started Zack File Scanner.','Started Zack Power Manager.','Started Zack Display Manager.','Reached target Multi-User System.','Reached target Graphical Interface.'],spin=[[6,'Network Service',1700],[14,'Zack Map Data Cache',1500]],d=(10000-3200-600)/U.length;
  for(let i=0;i<U.length;i++){const sp=spin.find(s=>s[0]===i);if(sp){const id='sp'+i+Date.now(),fr=['*   ','**  ','*** ',' ***','  **','   *'],n=Math.round(sp[2]/130);bt.insertAdjacentHTML('beforeend','<span id="'+id+'"></span>\n');
      for(let k=0;k<n;k++){$(id).innerHTML='[<span style="color:var(--y)">'+fr[k%6]+'</span>] A start job is running for '+sp[1]+' ('+(k*.13).toFixed(0)+'s / 90s)';await zz(130)}$(id).innerHTML=OK+'Finished '+sp[1]+'.'}
    await zz(d*(.5+Math.random()));bp(OK+U[i]);P(36+28*(i+1)/U.length,'SERVICES');if(i===9)bp(WARN+'Audio device is idle; waiting for the first user gesture.')}await zz(300)}
async function hexBurst(ms){const t0=performance.now();while(performance.now()-t0<ms*SC){const a=Math.floor(Math.random()*0xffffff).toString(16).padStart(8,'0'),by=()=>Math.floor(Math.random()*256).toString(16).padStart(2,'0'),c=Array.from({length:8},()=>String.fromCharCode(33+Math.floor(Math.random()*90))).join('');
  bp('<span style="color:#2f6b45">'+a+'  '+Array.from({length:8},by).join(' ')+'  |'+esc(c)+'|</span>');await sleep(26)}}
async function hwTable(){const ok=navigator.onLine,rows=[['CPU',cores+' threads','OK'],['MEMORY','~'+mem()+' GB','OK'],['GPU',glName().slice(0,26),'OK'],['DISPLAY',screen.width+'x'+screen.height,'OK'],['NETWORK',ok?'link up':'offline',ok?'OK':'WARN'],['AUDIO','pipewire','OK'],['STORAGE','vault ready','OK']],W=46;
  bp('<span style="color:var(--c)">┌'+'─'.repeat(W)+'┐</span>');
  for(const r of rows){const st=r[2]==='OK'?'<b style="color:var(--g)">OK</b>  ':'<b style="color:var(--y)">WARN</b>',name=r[0].padEnd(9),val=esc(r[1].padEnd(28).slice(0,28));
    bp('<span style="color:var(--c)">│</span> '+name+val+' ['+st+'] <span style="color:var(--c)">│</span>');await zz(170)}
  bp('<span style="color:var(--c)">└'+'─'.repeat(W)+'┘</span>')}
async function login(){SFX.seek(false);P(66,'HARDWARE CHECK');bp('');await hwTable();bp('');P(74,'LOGIN');
  const rows=art('ZACK').concat([''],art('ENGINE'));bt.insertAdjacentHTML('beforeend','<div id="bn" style="line-height:1.15"></div>');
  const paint=(n,g)=>{$('bn').innerHTML=rows.slice(0,n).map((l,i)=>'<span style="color:'+(i<5?'var(--g)':'var(--c)')+';text-shadow:0 0 9px currentColor">'+' '.repeat(g&&Math.random()<.45?1+Math.floor(Math.random()*5):0)+esc(l)+'</span>').join('\n')+'\n'};
  for(let i=1;i<=rows.length;i++){paint(i,false);await zz(75)}for(let k=0;k<10;k++){paint(rows.length,true);await sleep(60)}paint(rows.length,false);
  bp('');bp('Zack Engine SYS v11  ·  German Technology  ·  Z.Engine ready');bp('');await zz(250);
  bt.insertAdjacentHTML('beforeend','zack-engine login: <span id="lg1"></span><span class="cur">█</span>');await zz(450);await typeTo('lg1','operator',80);await zz(180);bt.querySelector('.cur').remove();bp('');
  bt.insertAdjacentHTML('beforeend','Password: <span class="cur">█</span>');await zz(700);bt.querySelector('.cur').remove();bp('');await zz(180);
  bp('Last login: '+new Date(Date.now()-86400000).toString().slice(0,24)+' on tty1');bp('Willkommen bei Zack Engine SYS v11.');bp('');
  const logo=['  #######  #######','       #   #      ','      #    #####  ','     #     #      ','  #######  #######'],g='color:var(--g)',
    info=['<b style="'+g+'">operator</b>@<b style="'+g+'">zack-engine</b>','-------------------','OS: Zack Engine SYS v11','Kernel: ze-kernel 11.0.4','Host: '+esc(navigator.platform||'web'),'Resolution: '+screen.width+'x'+screen.height,'CPU: '+cores+' threads','GPU: '+esc(glName()),'Memory: ~'+mem()+' GB','Network: '+(navigator.onLine?'connected':'offline'),'Locale: '+esc(navigator.language)+' · '+esc(tzn())];
  for(let i=0;i<info.length;i++){bp((logo[i]?'<span style="color:var(--y)">'+esc(logo[i])+'</span>':'                   ')+'   '+info[i]);await zz(55)}
  bp('');bt.insertAdjacentHTML('beforeend','<span style="color:var(--g)">operator@zack-engine</span>:<span style="color:var(--c)">~</span>$ <span id="lg2"></span><span class="cur">█</span>');await zz(350);await typeTo('lg2','ze-start',90);await zz(250);bt.querySelector('.cur').remove();bp('');
  P(90,'STARTING DESKTOP');for(const m of ['Starting Zack Engine desktop session ...','Loading Z.Engine, apps and telemetry ...','Session ready.']){bp(m);await zz(320)}await hexBurst(450);await zz(150)}
async function run(){const ov=$('engO');SKIP=false;SC=1;pv=pt=0;pStage='BOOT MANAGER';ov.style.display='block';ov.style.opacity=1;ov.classList.remove('off');ov.classList.add('on');bt.innerHTML='';setStatus('BOOTING');
  await gate(ov);const t0=performance.now(),esc=e=>{if(e.key==='Escape')skip()};addEventListener('keydown',esc);
  bt.style.paddingBottom='64px';const stopFx=rain(ov);hudBuild(ov);hudLoop();P(2);
  await manager();P(8,'KERNEL');if(!SKIP)SC=clamp((26800-(performance.now()-t0))/27000,.5,1.5);await kernel();await services();await login();
  P(100,'READY');await splash(ov);SFX.seek(false);removeEventListener('keydown',esc);
  ov.classList.remove('on');ov.classList.add('off');await sleep(900);ov.style.opacity=0;ov.style.display='none';ov.style.pointerEvents='none';cancelAnimationFrame(rafP);stopFx();const h=$('bHud');if(h)h.remove();bt.style.paddingBottom=''}
return{run}})();
