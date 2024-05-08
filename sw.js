// The version of the cache.
const VERSION = "v1.2.1";

// The name of the cache
const CACHE_NAME = `MyApp-${VERSION}`;

const DIR = '/tespwa';

// The static resources that the app needs to function.
const APP_STATIC_RESOURCES = [
  DIR + "/",
  DIR + "/index.html",
  DIR + "/app.js",
  DIR + "/style.css",
];

// On install, cache the static resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      cache.addAll(APP_STATIC_RESOURCES);
    })(),
  );
});

// delete old caches on activate
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        }),
      );
      await clients.claim();
    })(),
  );
});

// On fetch, intercept server requests
// and respond with cached responses instead of going to network
self.addEventListener("fetch", (event) => {
  // As a single page app, direct app to always go to cached home page.
  // if (event.request.mode === "navigate") {
  //   event.respondWith(caches.match("/"));
  //   return;
  // }

  // For all other requests, go to the cache first, and then the network.
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      console.log('cache');
      console.log(cache);
      console.log(event.request.url);
      const cachedResponse = await cache.match(event.request.url);
      
      if (cachedResponse) {
        // Return the cached response if it's available.
        return cachedResponse;
      }
      // If resource isn't in the cache, return a 404.
      return new Response(null, { status: 404 });
    })(),
  );
});

self.addEventListener("periodicsync", (event) => {
  if (event.tag === "send-attempt") {
    event.waitUntil(sendAttempt());
  }
});

// self.addEventListener("sync", (event) => {
//   if (event.tag == "send-attempt") {
//     event.waitUntil(sendAttempt());
//   }
// });

function sendAttempt() {
    console.log('sending attempt background sync');
    // Data to send
    const data = {
        body: 'Hello from Background Sync at ' + (Date.now() / 1000 | 0),
        title: 'Hello from Background Sync at ' + (Date.now() / 1000 | 0),
        userId: 1,
    };

    // Options for the fetch request
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    // Send the HTTP POST request
    return fetch('https://jsonplaceholder.typicode.com/posts', options)
        .then((response) => {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status);
            }
            console.log('Data sent successfully');
            return self.registration.sync.unregister('send-attempt');
        })
        .catch((error) => {
            console.error('Error sending data:', error);
        });
}
