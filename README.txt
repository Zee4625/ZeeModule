ZACK ENGINE OS - un sistem de operare in browser (ferestre, desktop, aplicatii)

CUM ARATA
  index.html  = desktopul principal (public): ceas, bara de cautare Z.Engine, aplicatiile, bara de task,
                meniul Start. Aplicatiile se deschid in ferestre (se muta, se redimensioneaza, minimizeaza,
                maximizeaza, inchid). Pornirea (~30 s, doar text) ruleaza o data pe sesiune.
  Aplicatii publice:  Z.Engine (cautare), Calculator, Notes, Clock, Weather.
  Aplicatii secrete (apar doar dupa codul 4625):  Dashboard, Maps, Network, Register.
  Codul se scrie in bara de cautare de pe desktop (Enter) sau din Start > "Unlock secret apps".
  Se blocheaza singure dupa 15 minute sau cu butonul LOCK.

FISIERE (toate in acelasi folder)
  index.html, os.js, boot.js            desktopul si pornirea
  zack.js, zack.css                     nucleul comun: setari, teme, muzica, registru, blocarea secreta
  search.html/js   calc.html/js   notes.html/js   clock.html/js   weather.html/js     aplicatiile publice
  dash.html/js   maps.html/js (+geo.js)   net.html/js   register.html/js              aplicatiile secrete
  manifest.webmanifest, sw.js, icon-192.png, icon-512.png                             instalare ca aplicatie + offline

Z.ENGINE (cautarea)
  Rezultate reale in pagina: Wikipedia (limba ta + engleza), Wikimedia Commons (imagini), dictionar, calculator.
  Rezultate Google reale in pagina: adaugi o cheie gratuita Google Programmable Search (butonul GOOGLE KEY).
  Rezultate complete de pe web: butoane catre Google, DuckDuckGo, Bing, Brave, Startpage.
  Scrii o adresa (ex. example.com) si se deschide site-ul. Un site static nu are indexul lui de web; de aceea
  Z.Engine combina surse reale si motoarele mari.

REGISTRUL DE ACCES (aplicatie secreta Register)
  Cine (operator), cand, pagina/aplicatia, dispozitivul, adresa IP, orasul/regiunea/tara si furnizorul (din IP),
  locatia exacta (daca permiti), browserul, sistemul, ecranul, limba, fusul orar, conexiunea, evenimentele
  START / BOOT / APP / IP / LOCATION / UNLOCK / LOCK / DENIED. Export CSV si JSON.
  Adresa IP se cere de la un serviciu public (ipwho.is) doar daca permiti (SETTINGS). Totul ramane in acest browser.
  Un site static nu poate vedea alti vizitatori; pentru asta e nevoie de un server. Codul 4625 nu e securitate reala.

CUM O PORNESTI
  Dintr-un server local sau de pe hosting (HTTPS):  python -m http.server 8000  -> http://localhost:8000/index.html
  Ferestrele sunt iframe-uri, deci merg cel mai bine de pe http(s). Instalarea ca aplicatie, Bluetooth si
  senzorii cer localhost sau HTTPS.

FULLSCREEN
  Desktopul ramane o singura pagina, deci ferestrele nu iti scot fullscreen-ul. Daca schimbi tab-ul in browser,
  browserul iese din fullscreen. Solutii: INSTALL din SETTINGS (fereastra proprie, fullscreen real) sau F11.

SETARI (SETTINGS)
  tema (verde, alb-negru, mov, rosu), lite mode, fullscreen, instalare, muzica si melodia (Calm / Night Drive /
  Dream / Shuffle), ecran treaz, locatia si IP-ul in registru, marimea textului, animatia de pornire.
  Se salveaza si se aplica in toate ferestrele.

LIMITE
  - Un browser nu poate lista programele instalate pe PC; aplicatiile din desktop sunt cele din Zack Engine OS.
  - Radarul Wi-Fi din Dashboard arata conexiunea reala (ping), nu retele apropiate (browserele nu permit asta).
