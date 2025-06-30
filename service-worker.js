self.addEventListener('install', event => {
    // Service worker install event
    console.log('Service Worker installed');
  });
  
  self.addEventListener('fetch', event => {
    // Just fetch network requests normally for now
    event.respondWith(fetch(event.request));
  });
  