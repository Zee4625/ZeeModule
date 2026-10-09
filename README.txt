ZACK ENGINE SYS v11 - site multi-pagina (un fel de sistem de operare in browser)

FISIERE (toate trebuie sa stea in acelasi folder)
  index.html  Dashboard + pornirea (start-up de ~30 s, doar text)   -> index.js, boot.js
  file.html   File Scan (fisierele tale reale)                      -> file.js
  maps.html   Harta 2D si globul 3D, tari si state                  -> maps.js, geo.js (date reale)
  net.html    PC info si calitatea retelei                          -> net.js
  radar.html  Radare: telefoane, Wi-Fi, aparate, camere, audio...   -> radar.js
  zack.js     nucleul comun: setari, teme, bara de sus, dock, performanta
  zack.css    stilurile si temele (verde, alb-negru, mov, rosu)

CUM O PORNESTI
  Cel mai bine dintr-un server local sau de pe un hosting (HTTPS):
    python -m http.server 8000     apoi deschide http://localhost:8000/index.html
  Merge si prin dublu-click pe index.html, dar unele API-uri (Bluetooth, locatie,
  senzori) merg numai pe localhost sau HTTPS.

SETARI SI TEMA
  Se salveaza in browser (localStorage) si sunt folosite de toate paginile.
  Daca browserul tau izoleaza fisierele locale, setarile merg totusi mai departe prin
  adresa (#zc=...) cand schimbi pagina din dock.
  SETTINGS (sus, dreapta): tema, lite mode, fullscreen, muzica ambientala, ecran treaz,
  marimea textului, animatia de pornire (o data pe sesiune / la fiecare start / oprita).

LIMITE (reguli ale browserelor)
  - Fullscreen iese cand schimbi pagina; prima atingere pe pagina noua il reintra.
  - Un site web nu poate lista retele Wi-Fi apropiate; radarul Wi-Fi arata conexiunea ta reala.
  - Radarele Bluetooth cer Chrome sau Edge si alegi tu fiecare dispozitiv in fereastra browserului.
