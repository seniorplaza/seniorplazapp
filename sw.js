self.addEventListener('notificationclick', e => e.notification.close());

const CACHE_IMG = 'seniorplaz-img-v1';
const CLOUDINARY_ORIGIN = 'https://res.cloudinary.com';

self.addEventListener('fetch', function(event) {
    const url = event.request.url;
    if (!url.startsWith(CLOUDINARY_ORIGIN)) return;
    event.respondWith(
        caches.open(CACHE_IMG).then(function(cache) {
            return cache.match(event.request).then(function(cached) {
                if (cached) return cached;
                return fetch(event.request).then(function(response) {
                    if (response && response.status === 200) {
                        cache.put(event.request, response.clone());
                    }
                    return response;
                }).catch(function() {
                    return cached || new Response('', { status: 503 });
                });
            });
        })
    );
});