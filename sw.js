var CACHE="mtb-v1";
var FICHIERS=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png"];
self.addEventListener("install",function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(FICHIERS)}));
  self.skipWaiting();
});
self.addEventListener("activate",function(e){
  e.waitUntil(caches.keys().then(function(k){
    return Promise.all(k.filter(function(n){return n!==CACHE}).map(function(n){return caches.delete(n)}));
  }));
  self.clients.claim();
});
// Réseau d'abord (le site se met à jour), cache si hors connexion
self.addEventListener("fetch",function(e){
  if(e.request.method!=="GET")return;
  e.respondWith(
    fetch(e.request).then(function(r){
      var copie=r.clone();
      caches.open(CACHE).then(function(c){c.put(e.request,copie)});
      return r;
    }).catch(function(){return caches.match(e.request)})
  );
});
