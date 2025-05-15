import CONFIG from "../config";

class NotificationModel {
  constructor() {
    this.isSubscribed = false; 
  }

  async subscribe() {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      try {
        const swRegistration = await navigator.serviceWorker.register(
          "./sw.js"
        );
        console.log("✅ Service Worker terdaftar");

        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          console.log("Izin push notification diberikan");

          const subscription = await swRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: this.urlBase64ToUint8Array(
              CONFIG.VAPID_PUBLIC_KEY
            ),
          });

          const token = this.getAuthToken();

          console.log("Subscription Data:", subscription);

          const subscriptionData = {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: this.arrayBufferToBase64(subscription.getKey("p256dh")),
              auth: this.arrayBufferToBase64(subscription.getKey("auth")),
            },
          };

          const response = await fetch(
            `${CONFIG.BASE_URL}/notifications/subscribe`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(subscriptionData),
            }
          );

          if (!response.ok) {
            const errorDetails = await response.json();
            throw new Error(
              `Gagal subscribe ke server: ${errorDetails.message}`
            );
          }

          this.isSubscribed = true; 
          console.log("📬 Berhasil subscribe push notification");
        } else {
          console.log("Izin push notification ditolak");
        }
      } catch (error) {
        console.error("❌ Gagal registrasi push:", error);
      }
    }
  }

  async unsubscribe() {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      try {
        const swRegistration = await navigator.serviceWorker.getRegistration();
        if (swRegistration && swRegistration.pushManager) {
          const subscription =
            await swRegistration.pushManager.getSubscription();
          if (subscription) {
            const token = this.getAuthToken();

            const response = await fetch(
              `${CONFIG.BASE_URL}/notifications/subscribe`,
              {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  endpoint: subscription.endpoint,
                }),
              }
            );

            if (!response.ok) throw new Error("Gagal unsubscribe dari server");

            await subscription.unsubscribe();
            this.isSubscribed = false; 
            console.log("🛑 Berhasil unsubscribe push notification");
          }
        }
      } catch (error) {
        console.error("❌ Gagal unsubscribe:", error);
      }
    }
  }

  checkSubscriptionStatus() {
    return this.isSubscribed;
  }

  urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
  }

  getAuthToken() {
    const authData = localStorage.getItem("auth");
    if (!authData)
      throw new Error("Token tidak ditemukan. Pengguna tidak terautentikasi.");
    const { token } = JSON.parse(authData);
    if (!token) throw new Error("Token tidak valid.");
    return token;
  }

  arrayBufferToBase64(buffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
}

export default NotificationModel;
