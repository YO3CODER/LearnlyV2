"use client";

import { useEffect } from "react";

export const PushSubscribeButton = () => {
  useEffect(() => {
    const init = async () => {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

      let reg = await navigator.serviceWorker.getRegistration();
      if (!reg) {
        reg = await navigator.serviceWorker.register("/sw.js");
      }

      await navigator.serviceWorker.ready;

      const existing = await reg.pushManager.getSubscription();
      if (existing) return;

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
      } catch (err) {
        console.error("Subscribe error:", err);
      }
    };

    init();
  }, []);

  return null;
};