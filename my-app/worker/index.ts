self.addEventListener("push", (event: any) => {
  const data = event.data?.json() ?? {};
  const title = data.title || "Learnly";
  const message = data.message || "Tu as un nouveau message";

  event.waitUntil(
    (self as any).registration.showNotification(title, {
      body: message,
      icon: "/icons/icon-192x192.png",
      badge: "/icons/icon-192x192.png",
    })
  );
});

self.addEventListener("notificationclick", (event: any) => {
  event.notification.close();
  event.waitUntil(
    (self as any).clients.openWindow("/learn")
  );
});