"use client";

import { useEffect, useState } from "react";

export const PushSubscribeButton = () => {
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

      const reg = await navigator.serviceWorker.ready;
      const existing = await reg.pushManager.getSubscription();

      if (existing) {
        setSubscribed(true);
        return;
      }

      try {
        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
        });

        const json = sub.toJSON();
        await fetch("/api/push/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            endpoint: json.endpoint,
            keys: json.keys,
          }),
        });

        setSubscribed(true);
      } catch (err) {
        // L'utilisateur a refusé la permission ou une erreur s'est produite
        console.error(err);
      }
    };

    init();
  }, []);

  if (subscribed) {
    return (
      <p className="text-sm text-green-600 font-medium">
        Notifications activées
      </p>
    );
  }

  return null;
};