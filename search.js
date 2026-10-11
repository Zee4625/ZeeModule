/* ===== Z.Engine · results stay inside Z.Engine: Wikipedia articles, Wikimedia images, dictionary, calculator, optional web API ===== */
const SK='zack.search';let SS={hist:[]};try{Object.assign(SS,JSON.parse(localStorage.getItem(SK)||'{}'))}catch(e){}
const saveSS=()=>{try{localStorage.setItem(SK,JSON.stringify(SS))}catch(e){}};
const LANG=((navigator.language||'en').slice(0,2)||'en').toLowerCase(),LANGS=LANG==='en'?['en']:[LANG,'en'];
let tab='all',Q='',R={};
const clean=s=>esc(String(s||'').replace(/<span class="searchmatch">/g,'\u0001').replace(/<\/span>/g,'\u0002').replace(/<[^>]*>/g,'')).replace(/\u0001/g,'<b>').replace(/\u0002/g,'</b>');
const jget=async u=>{const r=await fetch(u);if(!r.ok)throw new Error('HTTP '+r.status);return r.json()};
const wapi=l=>`https://${l}.wikipedia.org/w/api.php?origin=*&format=json&`;
async function answer(q){try{if(/\d/.test(q)&&/^[\d\s+\-*/().,^%a-z×÷]+$/i.test(q)){const v=calcEval(q);return{type:'calc',expr:q,v}}}catch(e){}
  if(/^[a-z]{2,24}$/i.test(q)){const j=await jget('https://api.dictionaryapi.dev/api/v2/entries/en/'+encodeURIComponent(q.toLowerCase()));const e=j[0];return{type:'dict',word:e.word,ph:e.phonetic||'',m:(e.meanings||[]).slice(0,3).map(m=>({p:m.partOfSpeech,d:(m.definitions||[]).slice(0,2).map(x=>x.definition)}))}}return null}
async function wiki(q){const out=[];await Promise.all(LANGS.map(async(l,i)=>{try{const j=await jget(wapi(l)+'action=query&list=search&srlimit=8&srsearch='+encodeURIComponent(q));out[i]=(j.query?j.query.search:[]).map(x=>({lang:l,title:x.title,snip:x.snippet}))}catch(e){out[i]=[]}}));return out.flat()}
async function know(items){if(!items||!items.length)return null;const t=items[0],j=await jget(`https://${t.lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(t.title)}`);return{title:j.title,desc:j.description||'',text:j.extract||'',img:j.thumbnail&&j.thumbnail.source,lang:t.lang}}
async function images(q){const j=await jget('https://commons.wikimedia.org/w/api.php?origin=*&format=json&action=query&generator=search&gsrnamespace=6&gsrlimit=24&prop=imageinfo&iiprop=url%7Cmime&iiurlwidth=260&gsrsearch='+encodeURIComponent('filetype:bitmap '+q));
  return Object.values(j.query?j.query.pages:{}).filter(p=>p.imageinfo&&p.imageinfo[0].thumburl).map(p=>({t:p.title.replace(/^File:/,''),img:p.imageinfo[0].thumburl}))}
async function web(q){if(!SS.cseKey||!SS.cseCx)return{nokey:true};const j=await jget(`https://www.googleapis.com/customsearch/v1?key=${encodeURIComponent(SS.cseKey)}&cx=${encodeURIComponent(SS.cseCx)}&num=10&q=${encodeURIComponent(q)}`);
  return{items:(j.items||[]).map(x=>({t:x.title,u:x.link,d:x.displayLink,s:x.snippet}))}}
async function run(q){q=String(q||'').trim();if(!q)return;Q=q;tab='all';$('q').value=q;SS.hist=[q,...SS.hist.filter(x=>x!==q)].slice(0,12);saveSS();$('home').style.display='none';$('res').style.display='';$('sug').style.display='none';R={};paint();
  const t=q,set=(k,v)=>{if(Q===t){R[k]=v;paint()}};
  answer(t).then(v=>set('ans',v),e=>set('ans',null));
  wiki(t).then(v=>{set('wiki',v);return know(v)}).then(v=>set('know',v),e=>set('know',null));
  images(t).then(v=>set('img',v),e=>set('img',{err:e.message}));web(t).then(v=>set('web',v),e=>set('web',{err:e.message}))}
async function openWiki(l,t){R.reader={loading:true,l,t};paint();try{const j=await jget(`${wapi(l)}action=query&redirects=1&prop=extracts%7Cpageimages&explaintext=1&exsectionformat=plain&piprop=thumbnail&pithumbsize=420&titles=${encodeURIComponent(t)}`),p=Object.values(j.query.pages)[0];
  R.reader={l,t:p.title,img:p.thumbnail&&p.thumbnail.source,text:(p.extract||'No text available.').slice(0,40000)}}catch(e){R.reader={l,t,err:e.message}}paint()}
const pend=x=>x===undefined;
function secAns(){const a=R.ans;if(!a)return'';if(a.type==='calc')return`<div class="card"><div class="sm" style="opacity:.8">Calculator</div><div class="big">${esc(a.expr)} = ${esc(+a.v.toPrecision(12))}</div></div>`;
  return`<div class="card"><div class="sm" style="opacity:.8">Definition</div><div class="big">${esc(a.word)} <span class="sm">${esc(a.ph)}</span></div>${a.m.map(m=>`<div><i>${esc(m.p)}</i>${m.d.map(d=>'<div>• '+esc(d)+'</div>').join('')}</div>`).join('')}</div>`}
function secKnow(){const k=R.know;if(!k)return'';return`<div class="card"><div class="flex gap-3">${k.img?`<img src="${esc(k.img)}" alt="" style="width:6rem;max-height:7rem;object-fit:cover;border-radius:4px">`:''}<div><div class="big" style="font-size:1.25rem">${esc(k.title)}</div><div class="sm" style="opacity:.8">${esc(k.desc)}</div><div style="margin-top:.3rem">${esc(k.text.slice(0,420))}${k.text.length>420?' ...':''}</div><button class="chip" data-wiki="${esc(k.lang)}|${esc(k.title)}" style="margin-top:.4rem">READ ARTICLE</button></div></div></div>`}
function secWeb(){const x=R.web;if(pend(x))return'<div class="sm" style="opacity:.8">Searching the web ...</div>';if(x.err)return`<div class="card sm">Web results failed: ${esc(x.err)}. Check the API key.</div>`;
  if(x.nokey)return`<div class="card sm">Web results need a search API key. <button class="chip" data-act="key">ADD KEY</button></div>`;
  return x.items.length?x.items.map(h=>`<div class="hit"><a href="${esc(h.u)}" target="_blank" rel="noopener">${esc(h.t)}</a><div class="u">${esc(h.d)}</div><div>${esc(h.s||'')}</div></div>`).join(''):'<div class="sm">No web results.</div>'}
function secWiki(n){const w=R.wiki;if(pend(w))return'<div class="sm" style="opacity:.8">Searching ...</div>';if(!w.length)return'<div class="sm">No articles found.</div>';
  return w.slice(0,n||20).map(h=>`<div class="hit"><a href="#" data-wiki="${esc(h.lang)}|${esc(h.title)}">${esc(h.title)}</a> <span class="u">${esc(h.lang)}</span><div>${clean(h.snip)}</div></div>`).join('')}
function secImg(n){const g=R.img;if(pend(g))return'<div class="sm" style="opacity:.8">Searching images ...</div>';if(g.err)return`<div class="sm">Image search failed: ${esc(g.err)}</div>`;if(!g.length)return'<div class="sm">No images.</div>';
  return'<div class="imgs">'+g.slice(0,n||24).map(i=>`<a href="#" data-lb="${esc(i.img)}" data-cap="${esc(i.t)}" title="${esc(i.t)}"><img loading="lazy" src="${esc(i.img)}" alt="${esc(i.t)}"></a>`).join('')+'</div>'}
function secReader(){const r=R.reader;if(r.loading)return'<div class="sm">Opening article ...</div>';if(r.err)return`<div class="card sm">Could not open the article: ${esc(r.err)} <button class="chip" data-act="back">BACK</button></div>`;
  return`<div class="card"><button class="chip" data-act="back">BACK TO RESULTS</button><div class="big" style="margin-top:.4rem">${esc(r.t)}</div>${r.img?`<img src="${esc(r.img)}" alt="" style="float:right;max-width:40%;margin:0 0 .5rem .7rem;border-radius:4px">`:''}${r.text.split(/\n+/).map(p=>'<p style="margin:.4rem 0">'+esc(p)+'</p>').join('')}</div>`}
function paint(){if(R.reader){setH($('tabs'),'');setH($('out'),secReader());return}
  const T=[['all','ALL'],['web','WEB'],['wiki','ARTICLES'],['img','IMAGES']];setH($('tabs'),T.map(t=>`<button class="b${tab===t[0]?' on':''}" data-tab="${t[0]}">${t[1]}</button>`).join('')+'<button class="b" data-act="key">KEY</button>');
  let h='';if(tab==='all')h=secAns()+secKnow()+(R.web&&R.web.items?secWeb():'')+'<div class="ttl"><span>Articles</span></div>'+secWiki(5)+'<div class="ttl" style="margin-top:.6rem"><span>Images</span></div>'+secImg(8);
  else if(tab==='web')h=secWeb();else if(tab==='wiki')h=secWiki();else h=secImg();setH($('out'),h)}
function home(){const h=SS.hist||[];setH($('hist'),h.length?'<div class="sm" style="opacity:.8;margin:.3rem 0">Recent</div>'+h.map(x=>`<button class="chip" data-q="${esc(x)}">${esc(x)}</button> `).join('')+' <button class="chip" data-act="clr">clear</button>':'')}
let sugT=0;function suggest(v){clearTimeout(sugT);if(v.trim().length<2){$('sug').style.display='none';return}sugT=setTimeout(async()=>{try{const j=await jget(`https://${LANG}.wikipedia.org/w/api.php?origin=*&action=opensearch&limit=6&namespace=0&format=json&search=`+encodeURIComponent(v));
  setH($('sug'),(j[1]||[]).map(s=>`<div data-q="${esc(s)}">${esc(s)}</div>`).join(''));$('sug').style.display=(j[1]||[]).length?'':'none'}catch(e){$('sug').style.display='none'}},220)}
function keyBox(){const b=$('keyBox');b.style.display=b.style.display==='none'?'':'none';$('kKey').value=SS.cseKey||'';$('kCx').value=SS.cseCx||''}
$('sf').addEventListener('submit',e=>{e.preventDefault();run($('q').value)});$('q').addEventListener('input',e=>suggest(e.target.value));
document.addEventListener('click',e=>{const t=e.target,c=s=>t.closest&&t.closest(s),q=c('[data-q]'),tb=c('[data-tab]'),ac=c('[data-act]'),w=c('[data-wiki]'),lb=c('[data-lb]');
  if(w){e.preventDefault();const[l,...rest]=w.dataset.wiki.split('|');openWiki(l,rest.join('|'))}
  else if(lb){e.preventDefault();$('lbImg').src=lb.dataset.lb.replace(/\/\d+px-/,'/900px-');$('lbCap').textContent=lb.dataset.cap;$('lb').style.display='flex'}
  else if(q){run(q.dataset.q)}else if(tb){tab=tb.dataset.tab;paint()}
  else if(ac){const a=ac.dataset.act;if(a==='key')keyBox();else if(a==='clr'){SS.hist=[];saveSS();home()}else if(a==='back'){delete R.reader;paint()}}
  if(!c('#sug,#q'))$('sug').style.display='none'});
$('lbX').onclick=()=>{$('lb').style.display='none'};$('lb').onclick=e=>{if(e.target.id==='lb')$('lb').style.display='none'};
$('kSave').onclick=()=>{SS.cseKey=$('kKey').value.trim();SS.cseCx=$('kCx').value.trim();saveSS();$('keyBox').style.display='none';log('Key saved.','s');if(Q)run(Q)};
$('kClear').onclick=()=>{delete SS.cseKey;delete SS.cseCx;saveSS();$('kKey').value='';$('kCx').value='';log('Key removed.')};
addEventListener('message',e=>{const d=e.data;if(d&&d.zack==='q'&&d.q)run(d.q)});
home();{const q=new URLSearchParams(location.search).get('q');if(q)run(q);else autoFocus($('q'))}
ready();
