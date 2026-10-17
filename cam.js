/* ===== Camera window: only the video player is shown ===== */
const sp=new URLSearchParams(location.search),slug=(sp.get('s')||'').replace(/[^A-Za-z0-9_-]/g,''),title=sp.get('t')||'Camera';
const src=slug?'https://streams.see.cam/'+encodeURIComponent(slug)+'?token=www.see.cam&isRadio=0':'';
function load(){$('camHost').innerHTML=slug?'<iframe src="'+esc(src)+'" title="'+esc(title)+'" referrerpolicy="no-referrer" allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;border:0;background:#000"></iframe><button class="b" id="rl" style="position:absolute;top:.4rem;right:.4rem;opacity:.85">RELOAD</button>':'<div class="sm" style="padding:1rem">No camera selected.</div>';const r=$('rl');if(r)r.onclick=load}
document.title='Zack Engine · '+title;load();ready();
