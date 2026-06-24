self.addEventListener("push", (event) => {
  let title = "Learnly";
  let message = "Tu as un nouveau message";

  try {
    if (event.data) {
      const text = event.data.text();
      const data = JSON.parse(text);
      title = data.title || title;
      message = data.message || message;
    }
  } catch (e) {
    console.error("Push parse error:", e);
  }

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