"use client";

import { useEffect, useState } from "react";

export const PushSubscribeButton = () => {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkSubscription = async () => {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      setSubscribed(!!sub);
    };
    checkSubscription();
  }, []);

  const subscribe = async () => {
    setLoading(true);
    try {
      const reg = await navigator.serviceWorker.ready;
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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (subscribed) {
    return (
      <p className="text-sm text-green-600 font-medium">
        Notifications activées
      </p>
    );
  }

  return (
    <button
      onClick={subscribe}
      disabled={loading}
      className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
    >
      {loading ? "Activation..." : "Activer les notifications"}
    </button>
  );
};