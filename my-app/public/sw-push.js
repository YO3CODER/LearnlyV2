self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {};
  const title = data.title || "Learnly";
  const message = data.message || "Tu as un nouveau message";

  event.waitUntil(
    self.registration.showNotification(title, {
      body: message,
      icon: "/icons/icon-192x192.png",
      badge: "/icons/icon-192x192.png",
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow("/learn")
  );
});