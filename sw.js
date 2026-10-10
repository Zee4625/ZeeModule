/* Zack Engine OS - service worker: offline cache, network first */
const V='zack-v13',FILES=['./', 'index.html', 'dash.html', 'maps.html', 'net.html', 'register.html', 'search.html', 'calc.html', 'notes.html', 'clock.html', 'weather.html', 'zack.css', 'zack.js', 'boot.js', 'os.js', 'dash.js', 'maps.js', 'net.js', 'register.js', 'search.js', 'calc.js', 'notes.js', 'clock.js', 'weather.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const u=new URL(e.request.url);if(u.origin!==location.origin)return;
  e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(V).then(ca=>ca.put(e.request,c));return r}).catch(()=>caches.match(e.request,{ignoreSearch:true})))});
