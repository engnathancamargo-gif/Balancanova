// Saúde & Corpo v23: atualiza o shell e evita servir versões antigas do app.
const V='saude-v23',SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(SHELL.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n.startsWith('saude-v')&&n!==V).map(n=>caches.delete(n)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);
 if(r.method!=='GET'||u.origin!==location.origin||u.pathname.startsWith('/api/')||u.pathname.startsWith('/nd/')||u.pathname.startsWith('/.netlify/'))return;
 if(r.mode==='navigate'){e.respondWith(fetch(r,{cache:'no-store'}).then(x=>{const c=x.clone();caches.open(V).then(h=>h.put('index.html',c));return x}).catch(()=>caches.match('index.html').then(x=>x||caches.match('./'))));return}
 e.respondWith(caches.match(r).then(h=>{const n=fetch(r,{cache:'no-store'}).then(x=>{if(x.ok){const c=x.clone();caches.open(V).then(k=>k.put(r,c))}return x}).catch(()=>h);return h||n}))});
