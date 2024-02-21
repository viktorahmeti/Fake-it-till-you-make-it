const VERSION = "v1.1.3";
const CACHE_NAME = `wishful-cache-${VERSION}`;

const APP_STATIC_RESOURCES = [
    "../",
    "../index.html",
    "../style/style.css",
    "../js/index.js",
    "../js/components/app-modal-component.js",
    "../js/components/apps-component.js",
    "../js/components/backgrounds-component.js",
    "../js/components/phone-component.js",
    "../js/data/apps.js",
    "../js/data/backgrounds.js",
    "../js/data/message.js",
    "../js/utils/utils.js",
    "../font/SFNSDisplay-Medium.otf",
    "../font/SFNSDisplay-Regular.otf",
    "../backgrounds/background-1.jpg",
    "../backgrounds/background-2.jpg",
    "../backgrounds/background-3.jpg",
    "../social-icons/facebook.png",
    "../social-icons/instagram.png",
    "../social-icons/messages.png",
    "../social-icons/paypal.jpg",
    "../social-icons/snapchat.jpg",
    "../social-icons/system.png",
    "../social-icons/whatsapp.png",
    "../social-icons/stripe.png",
    "../social-icons/shopify.png",
    "../social-icons/gumroad.png",
    "./android-chrome-192x192.png",
    "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      cache.addAll(APP_STATIC_RESOURCES);
    })(),
  );
});

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