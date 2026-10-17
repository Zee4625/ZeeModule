/* ===== Zack Engine OS · desktop, windows, taskbar, start menu, secret apps ===== */
const APPS=[
 {id:'search',n:'Z.Engine',u:'search.html',i:'Z',w:940,h:660},
 {id:'calc',n:'Calculator',u:'calc.html',i:'=',w:360,h:560},
 {id:'notes',n:'Notes',u:'notes.html',i:'N',w:780,h:540},
 {id:'clock',n:'Clock',u:'clock.html',i:'C',w:620,h:560},
 {id:'weather',n:'Weather',u:'weather.html',i:'W',w:680,h:600},
 {id:'ai',n:'Z.AI',u:'ai.html',i:'AI',w:560,h:660},
 {id:'engineai',n:'Z.Engine AI',u:'engineai.html',i:'EA',w:880,h:700,s:1},
 {id:'trade',n:'Trade View',u:'trade.html',i:'TV',w:1200,h:720,s:1},
 {id:'eye',n:'Z.Eye',u:'eye.html',i:'EY',w:1200,h:740,s:1},
 {id:'dash',n:'Dashboard',u:'dash.html',i:'D',w:1040,h:660,s:1},
 {id:'maps',n:'Maps',u:'maps.html',i:'M',w:1040,h:680,s:1},
 {id:'net',n:'Network',u:'net.html',i:'#',w:940,h:620,s:1},
 {id:'reg',n:'Register',u:'register.html',i:'R',w:940,h:620,s:1}];
const WM={wins:{},z:20},small=()=>innerWidth<760;
const appBtn=a=>`<button class="app" data-open="${a.id}"><i>${a.i}</i>${esc(a.n)}</button>`;
function renderApps(){const un=unlocked();setH($('hApps'),APPS.filter(a=>!a.s).map(appBtn).join(''));setH($('hSecApps'),APPS.filter(a=>a.s).map(appBtn).join(''));$('hSecret').style.display=un?'':'none';$('hCount').textContent=APPS.filter(a=>!a.s||un).length+' apps';renderStart()}
function renderStart(){const un=unlocked(),it=a=>`<button class="b" data-open="${a.id}">${esc(a.n)}</button>`;
  setH($('startMenu'),'<div class="sm">Zack Engine OS · German Technology</div>'+APPS.filter(a=>!a.s).map(it).join('')+(un?'<div class="sp"></div><div class="sm" style="color:var(--c)">Secret apps</div>'+APPS.filter(a=>a.s).map(it).join(''):'')+'<div class="sp"></div><button class="b" data-sm="settings">Settings</button><button class="b" data-sm="theme">Next theme</button><button class="b" data-sm="fs">Toggle fullscreen</button>'+(un?'<button class="b" data-sm="lock">Lock secret apps</button>':'<button class="b" data-sm="unlock">Unlock secret apps (code)</button>')+(USER?'<button class="b" data-sm="signout">Sign out ('+esc(userEmail())+')</button>':'<button class="b" data-sm="signin">Sign in</button>')+'<button class="b" data-sm="reboot">Reboot</button>')}
const closeMenu=()=>{$('startMenu').style.display='none'};
/* windows */
const appUrl=(a,q)=>a.u+'?embed=1'+(q?'&q='+encodeURIComponent(q):'')+'#zc='+btoa(JSON.stringify(cfg));
function openApp(id,q,custom){const a=custom||APPS.find(x=>x.id===id);if(!a)return;if(a.s&&!unlocked()){unlockDlg();return}
  let W=WM.wins[id];if(W){if(W.min)setMin(id,false);focusWin(id);if(q){try{W.el.querySelector('iframe').contentWindow.postMessage({zack:'q',q},'*')}catch(e){}}closeMenu();return}
  const el=document.createElement('div'),dk=$('desk'),dw=dk.clientWidth,dh=dk.clientHeight,n=Object.keys(WM.wins).length,Wd=Math.min(a.w,dw-16),Ht=Math.min(a.h,dh-16);el.className='w';el.dataset.id=id;
  el.style.cssText=`left:${Math.max(6,Math.min(dw-Wd-6,40+n*28))}px;top:${Math.max(6,Math.min(dh-Ht-6,24+n*26))}px;width:${Wd}px;height:${Ht}px`;
  el.innerHTML=`<div class="wb"><b class="grow trunc">${esc(a.n)}</b><button data-a="min" title="Minimize">_</button><button data-a="max" title="Maximize">[]</button><button data-a="x" title="Close">X</button></div><div class="wbody"><iframe src="${esc(a.src||appUrl(a,q))}" title="${esc(a.n)}" allow="geolocation; fullscreen"></iframe><div class="shield"></div></div>`;
  $('wins').appendChild(el);WM.wins[id]={el,min:false,a};if(small())el.classList.add('max');wire(el,id);focusWin(id);reg('APP','opened '+a.n);renderTb();closeMenu()}
function wire(el,id){const wb=el.querySelector('.wb');
  wb.addEventListener('click',e=>{const a=e.target.dataset&&e.target.dataset.a;if(a==='x')closeWin(id);else if(a==='min')setMin(id,true);else if(a==='max')toggleMax(id)});
  wb.addEventListener('dblclick',e=>{if(!(e.target.dataset&&e.target.dataset.a))toggleMax(id)});
  wb.addEventListener('pointerdown',e=>{focusWin(id);if((e.target.dataset&&e.target.dataset.a)||el.classList.contains('max'))return;const r=el.getBoundingClientRect(),dr=$('desk').getBoundingClientRect(),ox=e.clientX-r.left,oy=e.clientY-r.top;try{wb.setPointerCapture(e.pointerId)}catch(x){}el.classList.add('dragging');
    const mv=ev=>{el.style.left=clamp(ev.clientX-dr.left-ox,-el.offsetWidth+90,dr.width-60)+'px';el.style.top=clamp(ev.clientY-dr.top-oy,0,dr.height-30)+'px'},up=()=>{wb.removeEventListener('pointermove',mv);wb.removeEventListener('pointerup',up);el.classList.remove('dragging')};wb.addEventListener('pointermove',mv);wb.addEventListener('pointerup',up)});
  el.querySelector('.shield').addEventListener('pointerdown',()=>focusWin(id))}
function focusWin(id){const W=WM.wins[id];if(!W)return;W.el.style.zIndex=++WM.z;Object.values(WM.wins).forEach(x=>x.el.classList.toggle('active',x===W));WM.act=id;renderTb()}
function closeWin(id){const W=WM.wins[id];if(!W)return;W.el.remove();delete WM.wins[id];if(WM.act===id){WM.act=null;const top=Object.entries(WM.wins).filter(([k,v])=>!v.min).sort((a,b)=>b[1].el.style.zIndex-a[1].el.style.zIndex)[0];if(top)focusWin(top[0])}renderTb()}
function setMin(id,on){const W=WM.wins[id];if(!W)return;W.min=on;W.el.style.display=on?'none':'';if(on){if(WM.act===id){WM.act=null;const top=Object.entries(WM.wins).filter(([k,v])=>!v.min).sort((a,b)=>b[1].el.style.zIndex-a[1].el.style.zIndex)[0];if(top)focusWin(top[0])}}else focusWin(id);renderTb()}
function toggleMax(id){const W=WM.wins[id];if(W)W.el.classList.toggle('max')}
function renderTb(){setH($('tbWins'),Object.entries(WM.wins).map(([id,W])=>`<button class="b${WM.act===id&&!W.min?' on':''}" data-win="${id}">${esc(W.a.n)}${W.min?' (min)':''}</button>`).join(''))}
/* secret apps */
function unlockDlg(){$('unlockDlg').style.display='flex';$('uMsg').textContent='';$('uCode').value='';setTimeout(()=>autoFocus($('uCode')),30);closeMenu()}
function afterUnlock(){renderApps();bump();log('Secret apps unlocked.','s')}
function lockAll(){Object.keys(WM.wins).filter(id=>WM.wins[id].a.s).forEach(closeWin);setUnlocked(false);reg('LOCK','secret apps locked');renderApps();log('Secret apps locked.')}
function submitCode(v,fromDlg){const r=tryCode(v);if(r==='OK'){$('unlockDlg').style.display='none';afterUnlock();return true}if(fromDlg){$('uMsg').style.color='var(--r)';$('uMsg').textContent=r==='LOCK'?'Too many attempts. Wait a minute.':'ACCESS DENIED'}return false}
$('uGo').onclick=()=>submitCode($('uCode').value,true);$('uCode').addEventListener('keydown',e=>{if(e.key==='Enter')submitCode($('uCode').value,true);if(e.key==='Escape')$('unlockDlg').style.display='none'});$('uClose').onclick=()=>{$('unlockDlg').style.display='none'};$('hLock').onclick=lockAll;
/* camera windows: only the video, opened inside Z.Engine */
addEventListener('message',e=>{const d=e.data;if(e.origin!==location.origin||!d||d.zack!=='openCam'||!unlocked())return;const slug=String(d.slug||'').replace(/[^A-Za-z0-9_-]/g,''),title=String(d.title||'Camera');if(!slug)return;
  openApp('cam-'+slug,null,{id:'cam-'+slug,n:title,u:'cam.html',w:720,h:470,s:1,src:'cam.html?embed=1&s='+encodeURIComponent(slug)+'&t='+encodeURIComponent(title)+'#zc='+btoa(JSON.stringify(cfg))})});
/* sign-in with email */
let LASTU=null;function updUser(){const u=userEmail();if(LASTU!==null&&LASTU!==u)['ai','engineai'].forEach(id=>{if(WM.wins[id])closeWin(id)});LASTU=u;const c=$('userChip');if(c)c.textContent=USER?USER.email:'guest';renderStart()}
function showSign(){$('signDlg').style.display='flex';$('sMsg').textContent='';closeMenu();setTimeout(()=>autoFocus($('sMail')),30)}
function doSign(){if(setUser($('sMail').value)){$('signDlg').style.display='none';updUser();log('Signed in as '+userEmail(),'s')}else $('sMsg').textContent='Enter a valid email address.'}
$('sGo').onclick=doSign;$('sMail').addEventListener('keydown',e=>{if(e.key==='Enter')doSign()});$('sGuest').onclick=()=>{$('signDlg').style.display='none';try{sessionStorage.setItem('zackGuest','1')}catch(e){}};
Zack.askUser=showSign;Zack.onUser=updUser;
/* messages from app windows: open another app, duck the music while a radio plays */
addEventListener('message',e=>{const d=e.data;if(e.origin!==location.origin||!d)return;
  if(d.zack==='openApp'){const a=APPS.find(x=>x.id===d.id);if(a&&(!a.s||unlocked()))openApp(d.id,d.q)}
  else if(d.zack==='duck'){try{if(AMB.m&&AMB.on)AMB.m.gain.setTargetAtTime(d.on?.02:volGain(),AMB.ac.currentTime,.3)}catch(x){}}});
/* idle auto-lock */
let idleT=0;function bump(){clearTimeout(idleT);if(unlocked())idleT=setTimeout(lockAll,15*60000)}
addEventListener('pointerdown',bump,true);addEventListener('keydown',bump,true);
/* desktop search + clicks */
$('hForm').addEventListener('submit',e=>{e.preventDefault();const q=$('hQ').value.trim();if(!q)return;$('hQ').value='';
  if(q==='4625'){if(unlocked())log('Secret apps are already unlocked.','s');else submitCode(q,false)||log('Not a valid search or code.','d');return}
  openApp('search',q)});
document.addEventListener('click',e=>{const t=e.target,o=t.closest&&t.closest('[data-open]'),sm=t.closest&&t.closest('[data-sm]'),wn=t.closest&&t.closest('[data-win]');
  if(o){openApp(o.dataset.open)}else if(wn){const id=wn.dataset.win,W=WM.wins[id];if(W.min)setMin(id,false);else if(WM.act===id)setMin(id,true);else focusWin(id)}
  else if(sm){closeMenu();const k=sm.dataset.sm;if(k==='settings')openSettings();else if(k==='theme')toggleTheme();else if(k==='fs')toggleFs();else if(k==='lock')lockAll();else if(k==='unlock')unlockDlg();else if(k==='reboot')reboot();else if(k==='signout'){lockAll();signOut();showSign()}else if(k==='signin')showSign()}
  else if(!t.closest('#startMenu,#startBtn'))closeMenu()});
$('startBtn').onclick=()=>{const m=$('startMenu');m.style.display=m.style.display==='flex'?'none':'flex'};
addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();if(e.key==='/'&&!/INPUT|TEXTAREA|SELECT/.test((document.activeElement||{}).tagName||'')){e.preventDefault();$('hQ').focus()}});
/* home clock */
function homeClock(){if(document.hidden)return;const d=new Date();$('hClock').textContent=d.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});$('hDate').textContent=d.toLocaleDateString([], {weekday:'long',day:'numeric',month:'long',year:'numeric'})}
setInterval(homeClock,1000);homeClock();
{const vt=$('volTb');if(vt){vt.value=cfg.vol==null?40:cfg.vol;vt.oninput=()=>setVol(+vt.value)}}
/* start-up, then the desktop */
(async()=>{let need=cfg.boot==='always';try{if(cfg.boot==='session'&&!sessionStorage.getItem('zackBooted'))need=true}catch(e){need=cfg.boot!=='off'}
  renderApps();const t0=Date.now();
  if(need){await Boot.run();reg('BOOT','start-up finished in '+Math.round((Date.now()-t0)/1000)+' s');try{sessionStorage.setItem('zackBooted','1')}catch(e){}}else{$('engO').style.display='none'}
  setStatus('ONLINE');ready();updUser();try{if(!USER&&!sessionStorage.getItem('zackGuest'))setTimeout(showSign,500)}catch(e){}setTimeout(()=>autoFocus($('hQ')),100)})();
