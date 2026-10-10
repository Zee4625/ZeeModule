/* ===== Notes (saved in this browser) ===== */
const NK='zack.notes';let N=[],cur=null,st=0;try{N=JSON.parse(localStorage.getItem(NK)||'[]')}catch(e){}
const save=()=>{try{localStorage.setItem(NK,JSON.stringify(N))}catch(e){}};
function render(){const q=$('nq').value.toLowerCase();setH($('nlist'),N.filter(n=>!q||(n.title+' '+n.body).toLowerCase().includes(q)).sort((a,b)=>b.t-a.t).map(n=>`<div class="fdRow" data-id="${n.id}" style="${n.id===cur?'background:rgba(var(--cr),.2)':''}"><span class="trunc">${esc(n.title||'Untitled')}</span><span style="opacity:.7">${new Date(n.t).toLocaleDateString()}</span></div>`).join('')||'<div style="opacity:.8">No notes yet. Press NEW.</div>')}
function openN(id){cur=id;const n=N.find(x=>x.id===id);$('ntitle').value=n?n.title:'';$('nbody').value=n?n.body:'';$('ncount').textContent=n?n.body.length+' chars':'';render()}
function newN(){const n={id:'n'+Date.now(),title:'',body:'',t:Date.now()};N.push(n);save();openN(n.id);$('ntitle').focus()}
function edit(){let n=N.find(x=>x.id===cur);if(!n){newN();return}n.title=$('ntitle').value;n.body=$('nbody').value;n.t=Date.now();$('ncount').textContent=n.body.length+' chars · saving ...';clearTimeout(st);st=setTimeout(()=>{save();$('ncount').textContent=n.body.length+' chars · saved '+new Date().toLocaleTimeString();render()},300)}
function delN(){if(!cur)return;N=N.filter(x=>x.id!==cur);save();cur=null;$('ntitle').value='';$('nbody').value='';$('ncount').textContent='';render()}
$('nnew').onclick=newN;$('ndel').onclick=delN;$('ntitle').oninput=edit;$('nbody').oninput=edit;$('nq').oninput=render;$('nlist').onclick=e=>{const r=e.target.closest('[data-id]');if(r)openN(r.dataset.id)};
render();if(N.length)openN(N.slice().sort((a,b)=>b.t-a.t)[0].id);ready();
