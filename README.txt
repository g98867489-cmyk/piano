POCKET PIANO — PWA READY
========================

Is folder ki files:

  index.html            aapki piano app + PWA tags
  manifest.webmanifest  app ka naam, icon, rang (ID card)
  sw.js                 service worker (offline chalane ke liye)
  icons/                192px, 512px aur maskable icon

Bas itna hi. Ye 4 cheezein = PWA.


-----------------------------------------
STEP 1 — LOCAL TEST (publish se pehle)
-----------------------------------------
Is folder ke andar terminal kholo:

    python3 -m http.server 8000

Browser me kholo:  http://localhost:8000

(Nahi to: npx serve .  ya  VS Code ka Live Server)


-----------------------------------------
STEP 2 — CHECK KI SAB SAHI HAI
-----------------------------------------
Chrome me  F12  ->  "Application" tab:

  Manifest           -> naam "Pocket Piano", 3 icons, koi error nahi
  Service Workers    -> "activated and is running"
  Cache Storage      -> "pocket-piano-v1" ke andar files dikhni chahiye

Agar Manifest me "Installability" green hai, sab theek hai.


-----------------------------------------
STEP 3 — INSTALL KARO
-----------------------------------------
Desktop Chrome: address bar ke right me install icon (monitor + arrow),
ya menu -> "Cast, save and share" -> "Install page as app".

App ke header me "Install" button bhi aayega.

Dhyan: button turant nahi dikhega. Browser chahata hai ki tum page par
kam se kam ek baar click karo aur 30 second ruko, tabhi install ka
offer aata hai. Ye normal hai.

Android Chrome: menu -> "Add to Home screen" / "Install app".

iPhone / Safari: Share button -> "Add to Home Screen".
(iOS par automatic install prompt nahi aata, ye manual hi karna padta hai.)


-----------------------------------------
STEP 4 — OFFLINE TEST
-----------------------------------------
Install ke baad: internet off karo, home screen ke icon se app kholo.
Piano chalega, songs bajenge. Sab kuch offline.

Ya browser me: DevTools -> Network -> "Offline" tick -> reload.


-----------------------------------------
STEP 5 — PUBLISH KARO (HTTPS zaroori hai)
-----------------------------------------
Sabse aasan (drag & drop, free, auto HTTPS):

  https://app.netlify.com/drop   <- folder ko drag karo, bas
  https://vercel.com/new
  https://pages.cloudflare.com

GitHub Pages:
  1. Naya repo banao
  2. Ye saari files root me push karo (icons/ folder ke saath)
  3. Settings -> Pages -> Branch: main, folder: / (root) -> Save
  4. 1-2 minute baad https://<username>.github.io/<repo>/ live hoga

Zaroori: files ROOT me honi chahiye. sw.js root me nahi hoga to
offline kaam nahi karega.


-----------------------------------------
APP UPDATE KARNE PAR
-----------------------------------------
Jab bhi index.html ya baaki files badlo, sw.js me ye line badal do:

    const CACHE_VERSION = "pocket-piano-v1";   ->  "pocket-piano-v2";

Warna purane users ko purana version dikhta rahega.


-----------------------------------------
APNI PASAND KE HISAAF SE BADLO
-----------------------------------------
  Naam badalna   -> manifest.webmanifest me "name" aur "short_name"
  Rang badalna   -> manifest me "theme_color" / "background_color"
  Icon badalna   -> icons/ folder me apni PNGs daal do (same naam rakho)
