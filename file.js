/* ===== Zack Engine SYS v11 · Files (real file scan) ===== */
/* ---------- File scan (real files, read locally) ---------- */
const FS2={items:[],n:0,bytes:0,dirs:new Set(),cat:{},catN:{},largest:[],oldest:null,newest:null,empty:0,deep:0,dups:null,capped:false,running:false,cancel:false,limit:100000};
const EXTC={Images:'jpg jpeg png gif webp bmp svg heic avif tif tiff ico',Video:'mp4 mkv mov avi webm wmv m4v flv',Audio:'mp3 wav flac aac ogg m4a opus wma',Documents:'pdf doc docx xls xlsx ppt pptx txt md odt ods rtf csv epub',Code:'js ts jsx tsx py java c cpp h cs go rs php html htm css json xml sh bat ps1 sql yml yaml ini',Archives:'zip rar 7z tar gz bz2 xz tgz',Programs:'exe msi dmg apk bin dll iso app deb rpm'},EXTM={};
for(const [k,v] of Object.entries(EXTC))v.split(' ').forEach(e=>EXTM[e]=k);
const scCatOf=p=>{const i=p.lastIndexOf('.');return i<0?'Other':(EXTM[p.slice(i+1).toLowerCase()]||'Other')};
const yieldUI=()=>new Promise(r=>setTimeout(r,0));
function scReset(){Object.assign(FS2,{items:[],n:0,bytes:0,dirs:new Set(),cat:{},catN:{},largest:[],oldest:null,newest:null,empty:0,deep:0,dups:null,capped:false})}
function scAdd(p,s,m,h,f){FS2.n++;FS2.bytes+=s;const c=scCatOf(p);FS2.cat[c]=(FS2.cat[c]||0)+s;FS2.catN[c]=(FS2.catN[c]||0)+1;if(!s)FS2.empty++;
  const sl=p.split('/');FS2.deep=Math.max(FS2.deep,sl.length-1);if(sl.length>1)FS2.dirs.add(sl.slice(0,-1).join('/'));
  if(m){if(!FS2.oldest||m<FS2.oldest.m)FS2.oldest={p,m};if(!FS2.newest||m>FS2.newest.m)FS2.newest={p,m}}
  const L=FS2.largest;if(L.length<20||s>L[L.length-1].s){L.push({p,s});L.sort((a,b)=>b.s-a.s);if(L.length>20)L.pop()}
  if(FS2.items.length<FS2.limit)FS2.items.push({p,s,m,h,f,c});else FS2.capped=true}
async function scWalk(root){const stack=[[root,root.name]];let k=0;while(stack.length&&!FS2.cancel){const [dir,path]=stack.pop();
  try{for await(const [name,h] of dir.entries()){if(FS2.cancel)break;const p=path+'/'+name;if(h.kind==='directory')stack.push([h,p]);else{const f=await h.getFile();scAdd(p.slice(root.name.length+1),f.size,f.lastModified,h,null);if(++k%200===0){scUi();await yieldUI()}}}}catch(e){}}}
async function scFromList(list){let k=0;for(const f of list){if(FS2.cancel)break;scAdd(f.webkitRelativePath||f.name,f.size,f.lastModified,null,f);if(++k%500===0){scUi(k/list.length);await yieldUI()}}}
async function scRun(fn){if(FS2.running)return;scReset();FS2.running=true;FS2.cancel=false;$('scCancel').style.display='';$('scProg').style.display='';scUi();const t=performance.now();
  try{await fn()}catch(e){if(e&&e.name!=='AbortError')log('Scan: '+e.message,'d')}
  FS2.running=false;$('scCancel').style.display='none';$('scProg').style.display='none';scUi();saveScan();log('Scan finished: '+FS2.n.toLocaleString()+' files in '+((performance.now()-t)/1000).toFixed(1)+' s','s');fdRender()}
async function scanDir(){if(window.showDirectoryPicker&&window.self===window.top){try{const h=await showDirectoryPicker({mode:'read'});return scRun(()=>scWalk(h))}catch(e){if(e.name==='AbortError')return}}$('scIn').click()}
const scPick=e=>{const l=[...e.target.files];e.target.value='';if(l.length)scRun(()=>scFromList(l))};$('scIn').onchange=scPick;$('scIn2').onchange=scPick;
function scanCancel(){FS2.cancel=true}
function scanClear(){scReset();try{localStorage.removeItem('zack.scan')}catch(e){}scUi();fdRender()}
function scUi(p){$('scSt').textContent=FS2.running?'SCANNING · '+FS2.n.toLocaleString()+' files':FS2.n?FS2.n.toLocaleString()+' FILES':'NOT SCANNED';
  const pi=$('scProgI');if(p!==undefined){pi.style.animation='none';pi.style.width=(p*100)+'%'}else{pi.style.width='30%';pi.style.animation='ind 1.2s linear infinite'}
  if(!FS2.n){setH($('scSum'),'No scan yet. Press SCAN FOLDER to analyse a folder on this device.');setH($('scBars'),'');setH($('scTop'),'');return}
  const nd=x=>x?new Date(x.m).toLocaleDateString()+' · '+x.p.split('/').pop():'n/a',rows=[['Files',FS2.n.toLocaleString()+(FS2.capped?' (list capped)':'')],['Folders',FS2.dirs.size.toLocaleString()],['Total size',hs(FS2.bytes)],['Empty files',FS2.empty],['Deepest level',FS2.deep],['Newest',nd(FS2.newest)],['Oldest',nd(FS2.oldest)]];if(FS2.dups)rows.push(['Duplicate groups',FS2.dups.length]);
  setH($('scSum'),rows.map(r=>`<div class="flex justify-between gap-2"><span style="opacity:.85">${r[0]}</span><b style="color:var(--c)" class="trunc">${esc(r[1])}</b></div>`).join(''));
  const cats=Object.keys(FS2.cat).sort((a,b)=>FS2.cat[b]-FS2.cat[a]),mx=Math.max(1,...cats.map(c=>FS2.cat[c]));
  setH($('scBars'),cats.map(c=>`<div><div class="flex justify-between"><span>${c} · ${FS2.catN[c].toLocaleString()}</span><b>${hs(FS2.cat[c])}</b></div><div class="bar"><i style="width:${FS2.cat[c]/mx*100}%"></i></div></div>`).join(''));
  setH($('scTop'),'<div style="opacity:.85">LARGEST FILES</div>'+FS2.largest.slice(0,6).map(x=>`<div class="flex justify-between gap-2"><span class="trunc">${esc(x.p.split('/').pop())}</span><b style="color:var(--c)">${hs(x.s)}</b></div>`).join(''))}
async function fdDup(){if(!FS2.items.length)return log('Scan a folder first.','d');$('fdSt').textContent='HASHING…';const by={};FS2.items.forEach((it,i)=>{if(it.s>=1024)(by[it.s]=by[it.s]||[]).push(i)});const groups=[];
  for(const g of Object.values(by).filter(g=>g.length>1).slice(0,400)){const hm={};for(const i of g){const it=FS2.items[i];try{const f=it.f||await it.h.getFile(),d=new Uint8Array(await crypto.subtle.digest('SHA-256',await f.slice(0,524288).arrayBuffer())),hx=Array.from(d.slice(0,8)).map(x=>x.toString(16).padStart(2,'0')).join('');(hm[hx]=hm[hx]||[]).push(i)}catch(e){}}Object.values(hm).forEach(a=>{if(a.length>1)groups.push(a)});await yieldUI()}
  FS2.dups=groups;saveScan();scUi();fdRender();log('Duplicate check: '+groups.length+' group(s) of identical files.','s')}
function fdRender(){if(!$('fdList'))return;const q=$('fdQ').value.trim().toLowerCase(),cat=$('fdCat').value,sort=$('fdSort').value;$('fdSt').textContent=FS2.n?FS2.n.toLocaleString()+' files · '+hs(FS2.bytes):'--';const I=FS2.items;
  if(sort==='dups'){if(FS2.dups===null&&I.length){fdDup();return}const g=FS2.dups||[];setH($('fdList'),g.length?g.slice(0,150).map(a=>`<div style="border-bottom:1px solid rgba(var(--gr),.25);padding:.25rem 0"><b style="color:var(--c)">${a.length} identical copies · ${hs(I[a[0]].s)} each</b>${a.map(i=>`<div class="fdRow" onclick="fdInspect(${i})"><span>${esc(I[i].p)}</span></div>`).join('')}</div>`).join(''):'<div>No duplicates found (same size and same first 512 KB).</div>');return}
  const L=[];for(let i=0;i<I.length&&L.length<5000;i++){const it=I[i];if(cat&&it.c!==cat)continue;if(q&&!it.p.toLowerCase().includes(q))continue;L.push(i)}
  L.sort(sort==='new'?(a,b)=>(I[b].m||0)-(I[a].m||0):sort==='old'?(a,b)=>(I[a].m||0)-(I[b].m||0):sort==='name'?(a,b)=>I[a].p.localeCompare(I[b].p):(a,b)=>I[b].s-I[a].s);
  setH($('fdList'),L.length?L.slice(0,300).map(i=>`<div class="fdRow" onclick="fdInspect(${i})"><span>${esc(I[i].p)}</span><b style="color:var(--c)">${hs(I[i].s)}</b></div>`).join('')+(L.length>300?'<div style="opacity:.8">Showing 300 of '+L.length+' matches. Refine the filter.</div>':''):'<div style="opacity:.85">'+(FS2.n?'No matches.':'Scan a folder first: SCAN FOLDER or SCAN FILES on the dashboard.')+'</div>')}
async function fdInspect(i){const it=FS2.items[i];if(!it)return;let f=it.f;try{if(!f&&it.h)f=await it.h.getFile()}catch(e){}
  const ext=it.p.includes('.')?it.p.split('.').pop().toLowerCase():'',rows=[['Path',it.p],['Size',hs(it.s)+' ('+it.s.toLocaleString()+' bytes)'],['Category',it.c],['Extension',ext||'none'],['Type',(f&&f.type)||'unknown'],['Modified',it.m?new Date(it.m).toLocaleString():'n/a'],['Folder',it.p.includes('/')?it.p.slice(0,it.p.lastIndexOf('/')):'(root)']];
  $('fdDet').innerHTML=rows.map(x=>`<div class="flex justify-between gap-2" style="border-bottom:1px solid rgba(var(--gr),.2)"><span style="opacity:.85">${x[0]}</span><b style="color:var(--c);text-align:right;word-break:break-all">${esc(x[1])}</b></div>`).join('');
  const cv=$('fdPrev'),tx=$('fdTxt');cv.style.display='none';tx.style.display='none';
  try{if(f&&f.type.startsWith('image/')&&f.size<3e7){const bm=await createImageBitmap(f),k=Math.min(1,360/bm.width);cv.width=Math.round(bm.width*k);cv.height=Math.round(bm.height*k);cv.getContext('2d').drawImage(bm,0,0,cv.width,cv.height);cv.style.display='block'}
    else if(f&&f.size<4e6&&(f.type.startsWith('text/')||/^(txt|md|csv|json|js|ts|py|html|css|xml|log|ini|yml|yaml|sh|bat|c|cpp|h|java|go|rs|php|sql)$/.test(ext))){tx.textContent=await f.slice(0,2000).text();tx.style.display='block'}}catch(e){}}


function saveScan(){if(!FS2.n)return;try{localStorage.setItem('zack.scan',JSON.stringify({t:Date.now(),n:FS2.n,bytes:FS2.bytes,dirs:FS2.dirs.size,empty:FS2.empty,deep:FS2.deep,cat:FS2.cat,catN:FS2.catN,largest:FS2.largest.slice(0,6),oldest:FS2.oldest,newest:FS2.newest,dups:FS2.dups?FS2.dups.length:null}))}catch(e){}}
/* show the summary of the last scan until a new one is made */
{let o=null;try{o=JSON.parse(localStorage.getItem('zack.scan')||'null')}catch(e){}
 if(o&&o.n){$('scSt').textContent='LAST SCAN · '+o.n.toLocaleString()+' FILES · '+new Date(o.t).toLocaleString();const nd=x=>x?new Date(x.m).toLocaleDateString()+' · '+x.p.split('/').pop():'n/a';
  setH($('scSum'),[['Files',o.n.toLocaleString()],['Folders',o.dirs.toLocaleString()],['Total size',hs(o.bytes)],['Empty files',o.empty],['Deepest level',o.deep],['Newest',nd(o.newest)],['Oldest',nd(o.oldest)]].map(r=>`<div class="flex justify-between gap-2"><span style="opacity:.85">${r[0]}</span><b style="color:var(--c)" class="trunc">${esc(r[1])}</b></div>`).join(''));
  const cats=Object.keys(o.cat).sort((a,b)=>o.cat[b]-o.cat[a]),mx=Math.max(1,...cats.map(c=>o.cat[c]));
  setH($('scBars'),cats.map(c=>`<div><div class="flex justify-between"><span>${c} · ${o.catN[c].toLocaleString()}</span><b>${hs(o.cat[c])}</b></div><div class="bar"><i style="width:${o.cat[c]/mx*100}%"></i></div></div>`).join(''));
  setH($('scTop'),'<div style="opacity:.85">LARGEST FILES</div>'+(o.largest||[]).map(x=>`<div class="flex justify-between gap-2"><span class="trunc">${esc(x.p.split('/').pop())}</span><b style="color:var(--c)">${hs(x.s)}</b></div>`).join(''));$('scProg').style.display='none'}
 else scUi()}
fdRender();ready();
