// Adding cache error handling and beforeinstallprompt listener

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('my-cache').then((cache) => {
      return cache.addAll(['/index.html', '/styles.css', '/script.js']).catch(error => {
        console.error('Cache open failed:', error);
      });
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(error => {
        console.error('Fetch failed:', error);
      });
    })
  );
});

self.addEventListener('beforeinstallprompt', (event) => {
  // Prevent the mini-info bar from appearing on mobile
  event.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = event;
  // Update UI to notify the user they can add to home screen
  console.log('App is ready to be installed');
});

self.addEventListener('appinstalled', (event) => {
  // Clear the saved prompt
  deferredPrompt = null;
  console.log('App installed successfully');
});
