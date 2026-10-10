/* ===== Calculator ===== */
const KEYS=['C','(',')','DEL','7','8','9','/','4','5','6','*','1','2','3','-','0','.','^','+','sqrt(','sin(','cos(','pi'],H=[];
$('kp').innerHTML=KEYS.map(k=>`<button class="b" data-k="${k}">${k==='/'?'÷':k==='*'?'×':k==='sqrt('?'√':k==='pi'?'π':k}</button>`).join('')+'<button class="b on" data-k="=" style="grid-column:span 4">=</button>';
function evalNow(){const e=$('disp').value.trim();if(!e)return;try{const v=calcEval(e),r=String(+v.toPrecision(12));H.unshift(e+' = '+r);$('disp').value=r;$('hist').innerHTML=H.slice(0,12).map(h=>'<div class="fdRow" data-h="'+esc(h.split(' = ')[1])+'"><span>'+esc(h)+'</span></div>').join('')}catch(x){$('err').textContent='Check the expression';setTimeout(()=>{$('err').textContent=''},1500)}}
$('kp').addEventListener('click',e=>{const k=e.target.dataset.k;if(!k)return;const d=$('disp');if(k==='C')d.value='';else if(k==='DEL')d.value=d.value.slice(0,-1);else if(k==='=')evalNow();else d.value+=k;d.focus()});
$('disp').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();evalNow()}});
$('hist').addEventListener('click',e=>{const r=e.target.closest('[data-h]');if(r)$('disp').value=r.dataset.h});
$('disp').focus();ready();
