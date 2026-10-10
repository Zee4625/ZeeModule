/* ===== Z.Engine · meta-search: Wikipedia, Wikimedia Commons, dictionary, calculator, Google (own API key) + full web results on Google, DuckDuckGo, Bing, Brave ===== */
const SK='zack.search';let SS={hist:[]};try{Object.assign(SS,JSON.parse(localStorage.getItem(SK)||'{}'))}catch(e){}
const saveSS=()=>{try{localStorage.setItem(SK,JSON.stringify(SS))}catch(e){}};
const LANG=((navigator.language||'en').slice(0,2)||'en').toLowerCase(),LANGS=LANG==='en'?['en']:[LANG,'en'];
const ENG=[['Google','https://www.google.com/search?q='],['DuckDuckGo','https://duckduckgo.com/?q='],['Bing','https://www.bing.com/search?q='],['Brave','https://search.brave.com/search?q='],['Startpage','https://www.startpage.com/do/search?q=']];
let tab='all',Q='',R={};
const isUrl=q=>/^https?:\/\/\S+$/i.test(q)||(/^(www\.)?[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}(\/\S*)?$/i.test(q)&&!/\s/.test(q));
const clean=s=>esc(String(s||'').replace(/<span class="searchmatch">/g,'\u0001').replace(/<\/span>/g,'\u0002').replace(/<[^>]*>/g,'')).replace(/\u0001/g,'<b>').replace(/\u0002/g,'</b>');
const jget=async u=>{const r=await fetch(u);if(!r.ok)throw new Error('HTTP '+r.status);return r.json()};
const wapi=l=>`https://${l}.wikipedia.org/w/api.php?origin=*&format=json&`;
/* providers */
async function answer(q){try{if(/\d/.test(q)&&/^[\d\s+\-*/().,^%a-z×÷]+$/i.test(q)){const v=calcEval(q);return{type:'calc',expr:q,v}}}catch(e){}
  if(/^[a-z]{2,24}$/i.test(q)){const j=await jget('https://api.dictionaryapi.dev/api/v2/entries/en/'+encodeURIComponent(q.toLowerCase()));const e=j[0];return{type:'dict',word:e.word,ph:e.phonetic||'',m:(e.meanings||[]).slice(0,3).map(m=>({p:m.partOfSpeech,d:(m.definitions||[]).slice(0,2).map(x=>x.definition)}))}}return null}
async function wiki(q){const out=[];await Promise.all(LANGS.map(async(l,i)=>{try{const j=await jget(wapi(l)+'action=query&list=search&srlimit=8&srsearch='+encodeURIComponent(q));out[i]=(j.query?j.query.search:[]).map(x=>({lang:l,title:x.title,snip:x.snippet,url:`https://${l}.wikipedia.org/?curid=${x.pageid}`}))}catch(e){out[i]=[]}}));return out.flat()}
async function know(items){if(!items||!items.length)return null;const t=items[0];const j=await jget(`https://${t.lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(t.title)}`);return{title:j.title,desc:j.description||'',text:j.extract||'',img:j.thumbnail&&j.thumbnail.source,url:j.content_urls&&j.content_urls.desktop&&j.content_urls.desktop.page||t.url,lang:t.lang}}
async function images(q){const j=await jget('https://commons.wikimedia.org/w/api.php?origin=*&format=json&action=query&generator=search&gsrnamespace=6&gsrlimit=24&prop=imageinfo&iiprop=url%7Cmime&iiurlwidth=260&gsrsearch='+encodeURIComponent('filetype:bitmap '+q));
  return Object.values(j.query?j.query.pages:{}).filter(p=>p.imageinfo&&p.imageinfo[0].thumburl).map(p=>({t:p.title.replace(/^File:/,''),img:p.imageinfo[0].thumburl,url:p.imageinfo[0].descriptionurl}))}
async function web(q){if(!SS.cseKey||!SS.cseCx)return{nokey:true};const j=await jget(`https://www.googleapis.com/customsearch/v1?key=${encodeURIComponent(SS.cseKey)}&cx=${encodeURIComponent(SS.cseCx)}&num=10&q=${encodeURIComponent(q)}`);
  return{items:(j.items||[]).map(x=>({t:x.title,u:x.link,d:x.displayLink,s:x.snippet}))}}
/* run */
async function run(q){q=String(q||'').trim();if(!q)return;if(isUrl(q)){window.open(/^https?:/i.test(q)?q:'https://'+q,'_blank','noopener');return}
  Q=q;tab='all';$('q').value=q;SS.hist=[q,...SS.hist.filter(x=>x!==q)].slice(0,12);saveSS();$('home').style.display='none';$('res').style.display='';$('sug').style.display='none';R={};paint();
  const t=q,set=(k,v)=>{if(Q===t){R[k]=v;paint()}};
  answer(t).then(v=>set('ans',v),e=>set('ans',null));
  wiki(t).then(v=>{set('wiki',v);return know(v)}).then(v=>set('know',v),e=>set('know',null));
  images(t).then(v=>set('img',v),e=>set('img',{err:e.message}));
  web(t).then(v=>set('web',v),e=>set('web',{err:e.message}))}
const pend=x=>x===undefined;
function secAns(){const a=R.ans;if(!a)return'';if(a.type==='calc')return`<div class="card"><div class="sm" style="opacity:.8">Calculator</div><div class="big">${esc(a.expr)} = ${esc(+a.v.toPrecision(12))}</div></div>`;
  return`<div class="card"><div class="sm" style="opacity:.8">Definition</div><div class="big">${esc(a.word)} <span class="sm">${esc(a.ph)}</span></div>${a.m.map(m=>`<div><i>${esc(m.p)}</i>${m.d.map(d=>'<div>• '+esc(d)+'</div>').join('')}</div>`).join('')}</div>`}
function secKnow(){const k=R.know;if(!k)return'';return`<div class="card"><div class="flex gap-3">${k.img?`<img src="${esc(k.img)}" alt="" style="width:6rem;max-height:7rem;object-fit:cover;border-radius:4px">`:''}<div><div class="big" style="font-size:1.25rem">${esc(k.title)}</div><div class="sm" style="opacity:.8">${esc(k.desc)}</div><div style="margin-top:.3rem">${esc(k.text.slice(0,420))}${k.text.length>420?' ...':''}</div><a href="${esc(k.url)}" target="_blank" rel="noopener" class="sm" style="margin-top:.3rem;display:inline-block">Read on Wikipedia (${esc(k.lang)})</a></div></div></div>`}
function secWeb(){const x=R.web;if(pend(x))return'<div class="sm" style="opacity:.8">Searching the web ...</div>';if(x.err)return`<div class="card sm">Google results failed: ${esc(x.err)}. Check your key and engine id.</div>`;
  if(x.nokey)return`<div class="card sm"><b>Full web results</b><div>Z.Engine shows live Google results here once you add a free Google Programmable Search key. Until then, open the full results on any engine:</div><div style="margin-top:.4rem">${engLinks()}</div><button class="chip" data-act="key" style="margin-top:.4rem">ADD GOOGLE KEY</button></div>`;
  return x.items.length?x.items.map(h=>`<div class="hit"><a href="${esc(h.u)}" target="_blank" rel="noopener">${esc(h.t)}</a><div class="u">${esc(h.d)}</div><div>${esc(h.s||'')}</div></div>`).join(''):'<div class="sm">No web results.</div>'}
function secWiki(n){const w=R.wiki;if(pend(w))return'<div class="sm" style="opacity:.8">Searching Wikipedia ...</div>';if(!w.length)return'<div class="sm">No Wikipedia results.</div>';
  return w.slice(0,n||20).map(h=>`<div class="hit"><a href="${esc(h.url)}" target="_blank" rel="noopener">${esc(h.title)}</a> <span class="u">wikipedia · ${esc(h.lang)}</span><div>${clean(h.snip)}</div></div>`).join('')}
function secImg(n){const g=R.img;if(pend(g))return'<div class="sm" style="opacity:.8">Searching images ...</div>';if(g.err)return`<div class="sm">Image search failed: ${esc(g.err)}</div>`;if(!g.length)return'<div class="sm">No images.</div>';
  return'<div class="imgs">'+g.slice(0,n||24).map(i=>`<a href="${esc(i.url)}" target="_blank" rel="noopener" title="${esc(i.t)}"><img loading="lazy" src="${esc(i.img)}" alt="${esc(i.t)}"></a>`).join('')+'</div>'}
const engLinks=()=>ENG.map(e=>`<a class="b" href="${e[1]+encodeURIComponent(Q)}" target="_blank" rel="noopener" style="margin:0 .3rem .3rem 0;display:inline-block">${e[0]}</a>`).join('');
function paint(){const T=[['all','ALL'],['web','WEB'],['wiki','WIKIPEDIA'],['img','IMAGES']];
  setH($('tabs'),T.map(t=>`<button class="b${tab===t[0]?' on':''}" data-tab="${t[0]}">${t[1]}</button>`).join('')+'<button class="b" data-act="key">GOOGLE KEY</button>');
  setH($('engs'),'<span style="opacity:.8">Open full results on:</span> '+engLinks());
  let h='';if(tab==='all')h=secAns()+secKnow()+(pend(R.web)||R.web.nokey||R.web.err?'':secWeb())+(R.web&&R.web.nokey?secWeb():'')+'<div class="ttl"><span>Wikipedia</span></div>'+secWiki(5)+'<div class="ttl" style="margin-top:.6rem"><span>Images</span></div>'+secImg(8);
  else if(tab==='web')h=secWeb();else if(tab==='wiki')h=secWiki();else h=secImg();
  setH($('out'),h)}
/* home + suggestions */
function home(){const h=SS.hist||[];setH($('hist'),h.length?'<div class="sm" style="opacity:.8;margin:.3rem 0">Recent</div>'+h.map(x=>`<button class="chip" data-q="${esc(x)}">${esc(x)}</button> `).join('')+' <button class="chip" data-act="clr">clear</button>':'')}
let sugT=0;async function suggest(v){clearTimeout(sugT);if(v.trim().length<2){$('sug').style.display='none';return}sugT=setTimeout(async()=>{try{const j=await jget(`https://${LANG}.wikipedia.org/w/api.php?origin=*&action=opensearch&limit=6&namespace=0&format=json&search=`+encodeURIComponent(v));
  setH($('sug'),(j[1]||[]).map(s=>`<div data-q="${esc(s)}">${esc(s)}</div>`).join(''));$('sug').style.display=(j[1]||[]).length?'':'none'}catch(e){$('sug').style.display='none'}},220)}
function keyBox(){const b=$('keyBox');b.style.display=b.style.display==='none'?'':'none';$('kKey').value=SS.cseKey||'';$('kCx').value=SS.cseCx||''}
$('sf').addEventListener('submit',e=>{e.preventDefault();run($('q').value)});$('q').addEventListener('input',e=>suggest(e.target.value));
document.addEventListener('click',e=>{const t=e.target,q=t.closest&&t.closest('[data-q]'),tb=t.closest&&t.closest('[data-tab]'),ac=t.closest&&t.closest('[data-act]');
  if(q){run(q.dataset.q)}else if(tb){tab=tb.dataset.tab;paint()}else if(ac){if(ac.dataset.act==='key')keyBox();else if(ac.dataset.act==='clr'){SS.hist=[];saveSS();home()}}
  if(!t.closest||!t.closest('#sug,#q'))$('sug').style.display='none'});
$('kSave').onclick=()=>{SS.cseKey=$('kKey').value.trim();SS.cseCx=$('kCx').value.trim();saveSS();$('keyBox').style.display='none';log('Google key saved.','s');if(Q)run(Q)};
$('kClear').onclick=()=>{delete SS.cseKey;delete SS.cseCx;saveSS();$('kKey').value='';$('kCx').value='';log('Google key removed.')};
addEventListener('message',e=>{const d=e.data;if(d&&d.zack==='q'&&d.q)run(d.q)});
home();{const q=new URLSearchParams(location.search).get('q');if(q)run(q);else $('q').focus()}
ready();
