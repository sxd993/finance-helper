self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  clients.claim();
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('push', (event) => {
  if (!event.data) {
    return;
  }

  const payload = event.data.json();
  const title = payload.title ?? 'Finance Helper';
  const options = {
    body: payload.body,
    icon: payload.icon ?? '/src/assets/finance_helper_logo.png',
    data: payload.data,
    actions: payload.actions,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
