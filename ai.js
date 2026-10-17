/* ===== Z.AI (small assistant, 10 messages a day) and Z.Engine AI (secret, no limit) ===== */
const PRO=PAGE==='engineai',LIMIT=10;
const dayKey=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const cntKey=()=>'zack.ai.count:'+userEmail()+':'+dayKey();
const used=()=>+(localStorage.getItem(cntKey())||0),left=()=>Math.max(0,LIMIT-used());
function bumpCount(){try{localStorage.setItem(cntKey(),String(used()+1))}catch(e){}}
try{const pre='zack.ai.count:'+userEmail()+':';Object.keys(localStorage).forEach(k=>{if(k.startsWith(pre)&&k!==cntKey())localStorage.removeItem(k)})}catch(e){}
const CK='zack.ai.chat.'+(PRO?'pro':'lite')+':';let CH=[],busy=false,CFG={provider:'free',model:'',key:'',base:'',system:''};
try{CH=JSON.parse(localStorage.getItem(CK+userEmail())||'[]')}catch(e){}
try{Object.assign(CFG,JSON.parse(localStorage.getItem('zack.ai.cfg')||'{}'))}catch(e){}
const saveChat=()=>{try{localStorage.setItem(CK+userEmail(),JSON.stringify(CH.slice(-60)))}catch(e){}};
function md(s){return String(s).split('```').map((p,i)=>{if(i%2)return'<pre class="code">'+esc(p.replace(/^\w*\n/,'').replace(/\n$/,''))+'</pre>';let t=esc(p);t=t.replace(/`([^`\n]+)`/g,'<code>$1</code>').replace(/\*\*([^*\n]+)\*\*/g,'<b>$1</b>').replace(/^#{1,3}\s+(.+)$/gm,'<b>$1</b>').replace(/^\s*[-*]\s+/gm,'• ');return t.replace(/\n/g,'<br>')}).join('')}
function addMsg(r,t,typing){const d=document.createElement('div');d.className='msg '+r;d.innerHTML='<div class="who">'+(r==='u'?esc(userEmail()):(PRO?'Z.Engine AI':'Z.AI'))+'</div><div class="txt">'+(typing&&!t?'<span class="cur">...</span>':md(t))+'</div>';$('chat').appendChild(d);$('chat').scrollTop=$('chat').scrollHeight;return d.querySelector('.txt')}
function setTxt(el,t){el.innerHTML=md(t);$('chat').scrollTop=$('chat').scrollHeight}
function updStat(){$('aiStat').textContent=PRO?'unlimited · '+(CFG.provider==='free'?'free large model':CFG.provider+' '+(CFG.model||'')):left()+' of '+LIMIT+' messages left today';$('aiSend').disabled=busy||(!PRO&&left()<=0)}
const history=()=>{const h=CH.slice(-20).map(m=>({role:m.r==='u'?'user':'assistant',content:m.t}));while(h.length&&h[0].role!=='user')h.shift();const o=[];h.forEach(m=>{if(o.length&&o[o.length-1].role===m.role)o[o.length-1].content+='\n'+m.content;else o.push(m)});return o};
/* ---- streaming + providers ---- */
async function readSSE(r,on,kind){const rd=r.body.getReader(),dec=new TextDecoder();let buf='',acc='';for(;;){const x=await rd.read();if(x.done)break;buf+=dec.decode(x.value,{stream:true});let i;
  while((i=buf.indexOf('\n'))>=0){const line=buf.slice(0,i).trim();buf=buf.slice(i+1);if(!line.startsWith('data:'))continue;const p=line.slice(5).trim();if(p==='[DONE]')continue;
    try{const j=JSON.parse(p);let tk='';if(kind==='anthropic'){if(j.type==='content_block_delta'&&j.delta&&j.delta.text)tk=j.delta.text}else tk=(j.choices&&j.choices[0]&&j.choices[0].delta&&j.choices[0].delta.content)||'';if(tk){acc+=tk;if(on)on(acc)}}catch(e){}}}return acc}
async function askPoll(msgs,model,stream,on){const r=await fetch('https://text.pollinations.ai/openai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model,messages:msgs,stream:!!stream,private:true})});if(!r.ok)throw new Error('HTTP '+r.status);
  if(stream&&r.body){const t=await readSSE(r,on,'openai');if(t)return t;throw new Error('empty')}const j=await r.json(),t=j.choices&&j.choices[0]&&j.choices[0].message&&j.choices[0].message.content;if(!t)throw new Error('empty');return t}
async function askPollGet(msgs,model){const sys=msgs.filter(m=>m.role==='system').map(m=>m.content).join(' '),conv=(msgs.filter(m=>m.role!=='system').map(m=>(m.role==='user'?'User: ':'Assistant: ')+m.content).join('\n')+'\nAssistant:').slice(-2500);
  const r=await fetch('https://text.pollinations.ai/'+encodeURIComponent(conv)+'?model='+encodeURIComponent(model)+'&system='+encodeURIComponent(sys)+'&private=true');if(!r.ok)throw new Error('HTTP '+r.status);const t=(await r.text()).trim();if(!t)throw new Error('empty');return t}
async function askAnthropic(hist,sys,on){if(!CFG.key)throw new Error('Add your API key in SETTINGS.');
  const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'content-type':'application/json','x-api-key':CFG.key,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},body:JSON.stringify({model:CFG.model||'claude-sonnet-5-5',max_tokens:4096,system:sys,messages:hist,stream:true})});
  if(!r.ok){let m='';try{m=(await r.json()).error.message}catch(e){}throw new Error('Anthropic '+r.status+(m?': '+m:''))}return readSSE(r,on,'anthropic')}
async function askOpenAI(hist,sys,on){if(!CFG.key)throw new Error('Add your API key in SETTINGS.');const base=(CFG.base||'https://api.openai.com/v1').replace(/\/+$/,'');
  const r=await fetch(base+'/chat/completions',{method:'POST',headers:{'content-type':'application/json',Authorization:'Bearer '+CFG.key},body:JSON.stringify({model:CFG.model||'gpt-4o',messages:[{role:'system',content:sys},...hist],stream:true})});
  if(!r.ok){let m='';try{m=(await r.json()).error.message}catch(e){}throw new Error('API '+r.status+(m?': '+m:''))}return readSSE(r,on,'openai')}
async function askPro(hist,on){const sys=CFG.system||'You are Z.Engine AI, an expert assistant inside Zack Engine OS. Give precise, complete, well-structured answers. Reply in the language of the user. Use short code blocks when code helps.';
  if(CFG.provider==='anthropic')return askAnthropic(hist,sys,on);if(CFG.provider==='openai')return askOpenAI(hist,sys,on);
  const msgs=[{role:'system',content:sys},...hist],model=CFG.model||'openai-large';
  try{return await askPoll(msgs,model,true,on)}catch(e){}try{return await askPoll(msgs,model,false)}catch(e){}return askPollGet(msgs,model)}
/* ---- Z.AI: small helper with local skills + a small free model ---- */
const WCODE={0:'clear',1:'mostly clear',2:'partly cloudy',3:'overcast',45:'fog',51:'drizzle',61:'rain',63:'rain',65:'heavy rain',71:'snow',73:'snow',75:'heavy snow',80:'showers',95:'thunderstorm'};
async function localAI(q){const s=q.trim(),l=s.toLowerCase();
  if(/^(hi|hello|hey|salut|buna|bună|hei)\b/.test(l))return{sure:1,text:'Hello! I am Z.AI, a small assistant. Ask me a question, a calculation, the time, the weather in a city, or tell me to open an app.'};
  if(l.length<40&&/\b(what time|time is it|ce ora|ora)\b/.test(l))return{sure:1,text:'It is '+new Date().toLocaleTimeString()+' ('+tzName()+').'};
  if(l.length<40&&/\b(what date|today|data de azi|ce zi)\b/.test(l))return{sure:1,text:'Today is '+new Date().toLocaleDateString(undefined,{weekday:'long',year:'numeric',month:'long',day:'numeric'})+'.'};
  let m=l.match(/^(?:open|deschide|start)\s+(.+)$/);if(m){const apps={calculator:'calc',calc:'calc',notes:'notes',note:'notes',clock:'clock',weather:'weather',search:'search','z.engine':'search',zengine:'search'},id=apps[m[1].trim()];if(id){try{parent.postMessage({zack:'openApp',id},'*')}catch(e){}return{sure:1,text:'Opening '+m[1].trim()+' ...'}}}
  try{if(/\d/.test(s)&&/[+\-*/^%×÷]|sqrt|sin|cos|tan|log|ln|pi/.test(s)&&/^[\d\s+\-*/().,^%a-z×÷]+$/i.test(s)){const v=calcEval(s);return{sure:1,text:s+' = '+(+v.toPrecision(12))}}}catch(e){}
  m=l.match(/(?:weather|vremea|meteo)(?:\s+(?:in|în|la|for))?\s+([a-zăâîșțéü .-]+)$/i);if(m){try{const g=(await(await fetch('https://geocoding-api.open-meteo.com/v1/search?count=1&name='+encodeURIComponent(m[1].trim()))).json()).results;if(g&&g[0]){const f=(await(await fetch('https://api.open-meteo.com/v1/forecast?current=temperature_2m,wind_speed_10m,weather_code&timezone=auto&latitude='+g[0].latitude+'&longitude='+g[0].longitude)).json()).current;return{sure:1,text:g[0].name+', '+(g[0].country||'')+': '+Math.round(f.temperature_2m)+' °C, '+(WCODE[f.weather_code]||'mixed conditions')+', wind '+Math.round(f.wind_speed_10m)+' km/h.'}}}catch(e){}}
  m=s.match(/^(?:what is|what's|who is|who was|ce este|cine este|cine a fost)\s+(.+?)\??$/i);if(m){try{const j=await(await fetch('https://en.wikipedia.org/api/rest_v1/page/summary/'+encodeURIComponent(m[1].trim()))).json();if(j.extract)return{sure:1,text:j.extract.slice(0,600)}}catch(e){}}
  return{sure:0,text:'I am a small assistant and I could not answer that. Try a calculation, the weather in a city, a definition ("what is ..."), or "open notes".'}}
async function askLite(text,hist){const loc=await localAI(text);if(loc.sure)return loc.text;
  const msgs=[{role:'system',content:'You are Z.AI, a small assistant built into Zack Engine OS. Answer briefly (at most 6 sentences) in the language of the user. If you are not sure, say so.'},...hist];
  try{return await askPoll(msgs,'openai-fast',false)}catch(e){}try{return await askPollGet(msgs,'openai-fast')}catch(e){}return loc.text}
/* ---- send ---- */
async function send(text){text=String(text||'').trim();if(!text||busy)return;
  if(!PRO&&left()<=0){addMsg('a','Daily limit reached: '+LIMIT+' of '+LIMIT+' messages used today. It resets at midnight.');updStat();return}
  busy=true;CH.push({r:'u',t:text});addMsg('u',text);if(!PRO)bumpCount();reg('AI',(PRO?'Z.Engine AI':'Z.AI')+' message'+(PRO?'':' '+used()+'/'+LIMIT));updStat();
  const el=addMsg('a','',true);let out='';
  try{const h=history();out=PRO?await askPro(h,t=>setTxt(el,t)):await askLite(text,h)}catch(e){out='Sorry, the request failed: '+(e&&e.message||e)+(PRO&&CFG.provider==='free'?'\n\nTip: open SETTINGS and add your own API key for the strongest models.':'')}
  setTxt(el,out);CH.push({r:'a',t:out});saveChat();busy=false;updStat()}
$('aiSend').onclick=()=>{const v=$('aiIn').value;$('aiIn').value='';send(v)};
$('aiIn').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();$('aiSend').click()}});
$('aiNew').onclick=()=>{CH=[];saveChat();$('chat').innerHTML='';welcome()};
$('aiExp').onclick=()=>{const t=CH.map(m=>(m.r==='u'?'You: ':'AI: ')+m.t).join('\n\n'),b=new Blob([t],{type:'text/plain'}),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download='zack-ai-chat.txt';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),2000)};
function welcome(){addMsg('a',PRO?'Z.Engine AI is ready. No message limit. Ask me anything: code, analysis, writing, math, plans. Open SETTINGS to use your own API key for the strongest models.':'Hi! I am Z.AI, a small assistant. You have '+LIMIT+' messages a day. I can answer short questions, do math, give the weather and open apps.')}
if(PRO){$('aiCfg').onclick=()=>{const b=$('cfgBox');b.style.display=b.style.display==='none'?'':'none';$('cProv').value=CFG.provider;$('cModel').value=CFG.model;$('cKey').value=CFG.key;$('cBase').value=CFG.base;$('cSys').value=CFG.system};
  $('cSave').onclick=()=>{CFG={provider:$('cProv').value,model:$('cModel').value.trim(),key:$('cKey').value.trim(),base:$('cBase').value.trim(),system:$('cSys').value.trim()};try{localStorage.setItem('zack.ai.cfg',JSON.stringify(CFG))}catch(e){}$('cfgBox').style.display='none';updStat();log('Settings saved.','s')}}
$('aiSub').textContent=PRO?'secret · unlimited':'free · '+LIMIT+' messages a day';
if(CH.length)CH.forEach(m=>addMsg(m.r,m.t));else welcome();updStat();if(!COARSE)autoFocus($('aiIn'));ready();
