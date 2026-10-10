ZACK ENGINE SYS v11 - site multi-pagina (un fel de sistem de operare in browser)

FISIERE (toate trebuie sa stea in acelasi folder)
  index.html  Dashboard + pornirea (~30 s, doar text) + Registrul de acces   -> index.js, boot.js
  maps.html   Harta 2D si globul 3D, tari si state                           -> maps.js, geo.js (date reale)
  net.html    PC info si calitatea retelei                                   -> net.js
  zack.js     nucleul comun: setari, teme, muzica, registru, bara de sus, dock, performanta
  zack.css    stilurile si temele (verde, alb-negru, mov, rosu)
  manifest.webmanifest, sw.js, icon-192.png, icon-512.png   -> instalare ca aplicatie (fullscreen real)

CUM O PORNESTI
  Cel mai bine dintr-un server local sau de pe un hosting (HTTPS):
    python -m http.server 8000     apoi deschide http://localhost:8000/index.html
  Instalarea ca aplicatie si unele API-uri merg doar pe localhost sau HTTPS.

FULLSCREEN CARE NU IESE CAND SCHIMBI TAB-UL
  Fullscreen-ul facut de o pagina se opreste cand schimbi tab-ul (regula browserului).
  Solutii: 1) INSTALL din SETTINGS (sau icoana de instalare din bara de adrese): se deschide
  intr-o fereastra proprie, fullscreen, fara tab-uri. 2) Apasa F11: fullscreen de browser,
  ramane si cand schimbi tab-ul.

REGISTRUL DE ACCES (Dashboard, jos)
  Se vede doar dupa codul 4625. Arata: cine (operator), pagina, cand, locatia (daca permiti),
  dispozitivul si evenimentele START / PAGE / BOOT / LOCATION / DENIED / REGISTER.
  Se salveaza doar in acest browser. Un site static nu poate vedea alti vizitatori sau adrese IP;
  pentru asta e nevoie de un server. Codul este o incuietoare de confort, nu securitate reala.

MUZICA
  3 melodii generate in browser (fara fisiere audio): CALM, NIGHT DRIVE, DREAM, plus SHUFFLE.
  Se aleg din SETTINGS. Muzica porneste dupa prima atingere / apasare de tasta.

SETARI (SETTINGS, sus dreapta)
  tema, lite mode, fullscreen, instalare, muzica si melodia, ecran treaz, locatia in registru,
  marimea textului, animatia de pornire. Se salveaza si sunt folosite de toate paginile.
