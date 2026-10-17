ZACK ENGINE OS - un sistem de operare in browser (ferestre, desktop, aplicatii)

DESKTOPUL (index.html)
  Ceas, bara Z.Engine, aplicatiile, bara de task cu VOLUM pentru muzica, meniul Start. Aplicatiile se deschid
  in ferestre (se muta, se redimensioneaza, minimizeaza, maximizeaza, inchid). Pornirea (~30 s, doar text,
  fara loading screen) are ecran CRT, tabel hardware, banner animat si login tastat.
  Aplicatii publice:  Z.Engine, Calculator, Notes, Clock, Weather.
  Aplicatii secrete (dupa codul 4625, scris in bara de cautare sau din Start):  Dashboard, Maps, Network, Register.

Z.ENGINE
  Totul ramane in Z.Engine: articole Wikipedia citite in aplicatie, imagini cu vizualizator, dictionar, calculator,
  sugestii. Rezultate web in pagina cu o cheie API optionala (butonul KEY). Nicio redirectionare spre alte motoare.

MAPS > GLOBAL CAMERAS (aplicatie secreta Maps)
  Harta si lista de camere sunt una langa alta (pe telefon una sub alta). Camerele din acelasi oras sunt desfacute
  in evantai in jurul orasului, deci fiecare se poate apasa separat. Butoane: TOUR (plimbare automata prin lume),
  PREV/NEXT, WORLD, COPY LINK, live only.
  Butonul GLOBAL CAMERAS deschide meniul: 119 tari cu numarul de camere (59.469 in total), marcaje pe harta 2D si
  pe globul 3D, si cele 100 de camere din Romania (live si still) grupate pe orase, cu cautare si filtru "live only".
  Click pe un marcaj sau pe un rand: zboara acolo si camera porneste DIRECT in panou, doar playerul video
  (fara restul site-ului si fara redirectionari). FULL VIEW o deschide intr-o fereastra Zack Engine (poti avea mai multe
  camere deschise deodata). Pozitiile sunt aproximative (orasul).
  Sursa datelor: listele See.Cam.

MUZICA
  3 melodii generate in browser: CALM, NIGHT DRIVE, DREAM (+ SHUFFLE). Volum: slider in bara de task si in Settings.

REGISTRUL DE ACCES (Register)
  Cine, cand, aplicatia, dispozitivul, IP, oras/regiune/tara/furnizor (din IP), locatia exacta (daca permiti).
  Se salveaza doar in acest browser. Codul 4625 este o incuietoare de confort, nu securitate reala.

CUM O PORNESTI
  python -m http.server 8000  ->  http://localhost:8000/index.html
  Instalarea ca aplicatie (fullscreen real), Bluetooth si senzorii cer localhost sau HTTPS.

TELEFON
  Tastatura nu se mai deschide singura nicaieri (desktop, Z.Engine, calculator, notite, dialogul de cod).
  Calculatorul foloseste tastatura lui, nu pe cea a telefonului. Campurile au 16 px (fara zoom pe iPhone).


==================== NOU (v17) ====================

1) CONT CU EMAIL + LOGURI PE EMAIL
   La prima deschidere apare fereastra "Sign in": scrii emailul si logurile (Register) se salveaza separat pentru fiecare email.
   - Emailul NU este verificat (nu exista server care sa trimita cod de confirmare). E doar o eticheta pentru loguri.
   - Logurile stau in browserul acesta (localStorage). Alt calculator = alte loguri. Export CSV/JSON din Register.
   - In Register (secret) alegi emailul ale carui loguri vrei sa le vezi. Se logheaza: SIGNIN, SIGNOUT, START, APP, AI, TRADE, EYE etc.
   - Sign out: Start menu sau Settings > Account.

2) Z.AI (aplicatie normala): asistent mic, 10 mesaje pe zi pentru fiecare email.
   Face calcule, ora, vremea, definitii (Wikipedia), deschide aplicatii ("open notes") si, pentru restul, foloseste un model mic gratuit (Pollinations).
   Limita de 10/zi e numarata in browser (cine sterge datele site-ului o poate reseta).

3) Z.ENGINE AI (secret): fara limita de mesaje.
   Implicit foloseste un model mare gratuit. Pentru cel mai bun raspuns: SETTINGS > Provider > Anthropic sau OpenAI-compatible,
   pui cheia ta API (ramane doar in browser). Platesti tu consumul la furnizor.

4) TRADE VIEW (secret): lumanari (candles) japoneze, trade-uri live, order book. 39 de piete reale de la Binance (date publice, fara cheie):
   BTC, ETH, AUR (PAXG = 1 uncie de aur), BNB, SOL, XRP, ADA, DOGE ... plus EUR/GBP/AUD/TRY/BRL fata de USDT.
   Timeframe 1m...1W, SMA20, EMA50, volum, zoom cu rotita, tras cu mouse-ul, favorite.
   Optional: cheie gratuita Twelve Data => actiuni (AAPL, NVDA...), aur spot, argint, petrol, forex.
   Nu este sfat financiar.

5) Z.EYE (secret): glob 3D cu CesiumJS (se incarca de la cdn.jsdelivr.net, deci are nevoie de internet).
   Straturi reale: avioane (OpenSky), sateliti (CelesTrak, cu orbita), cutremure (USGS), evenimente naturale (NASA EONET),
   trenuri Finlanda live, nave Marea Baltica live, radar de ploaie, camere (Romania + tari), statii radio din toata lumea (Radio Browser).
   Click pe glob = "Inspect zone": localitate, altitudine, vreme, ora locala, cate avioane/nave/etc. in raza aleasa.
   Taxiuri, Bolt, Uber, trafic auto: nu exista date publice, deci nu sunt afisate.


==================== v18: Z.EYE REPARAT + STREET MODE ====================

PORNIRE (recomandat): foloseste server.py in loc de "python -m http.server"
   Windows : dublu-click pe START.bat            Linux/Mac: ./start.sh
   sau     : python server.py        ->  http://localhost:8000/index.html
   (python server.py --lan  = accesibil si de pe telefon, in aceeasi retea Wi-Fi)
   server.py serveste site-ul SI un mic proxy (doar adrese permise) ca sursele de date care blocheaza browserul (CORS)
   sa mearga. Fara server.py Z.Eye tot incearca direct, dar unele straturi pot ramane goale.

Z.EYE - ce s-a schimbat
 - Avioane: acum de la adsb.lol (cu airplanes.live si OpenSky ca rezerva), cu ruta (adsbdb), poza si tip avion. Simbolul se roteste dupa directie.
   Zoom mic = esantion mondial; zoom aproape = toate avioanele din zona.
 - Simbolurile se vad: puncte/iconite desenate peste glob (nu mai sunt ascunse de suprafata), cu bulina de stare langa fiecare strat
   (verde = merge, rosu = eroare, galben = se incarca; pune mouse-ul pe bulina ca sa vezi mesajul).
 - Radio: ~800 de statii de pe tot globul apar direct pe harta (puncte roz). Click = asculti. FIND/RANDOM/TOP pentru cautare.
 - Locuri reale din OpenStreetMap cand dai zoom (< 8 km): STATII DE TAXI, statii de autobuz/tramvai/metrou/tren, benzinarii,
   spitale/farmacii, politie/pompieri, restaurante/cafenele. Pot fi pornite/oprite pe categorii.
   Taxiuri / Bolt / Uber "live" (masinile in miscare) NU exista ca date publice, deci nu pot fi afisate.
 - Zoom pana la strada: sub ~70 m intri automat in STREET MODE (sau apesi STREET VIEW / click pe un loc > STREET VIEW).
   Esti la inaltimea ochilor, cu cladiri 3D din OpenStreetMap, nume de locuri, strada si lista "AROUND YOU" cu distanta si directia.
   Control: tragi cu mouse-ul ca sa privesti; W A S D sau sagetile = mergi; Shift = fugi; Q/E = jos/sus; Esc = iesi.
   Pe telefon: butoanele ◀ ▲ ▼ ▶ de pe ecran.
   Nu sunt fotografii de strada ca in Google Street View (acelea cer cheie si licenta); aici e o lume 3D construita din date OpenStreetMap.
 - MY LOCATION: te duce la locatia ta (cere permisiune browserului).


==================== v19: ECRAN DE PORNIRE NOU, CU SUNET ====================
 - Ecran "POWER ON": apesi orice tasta / atingi ecranul ca sa pornesti (browserul permite sunet doar dupa un click).
   Buton "START WITHOUT SOUND" daca nu vrei sunet.
 - Pornirea (~30 s) are acum: bara de progres cu etapele (BOOT MANAGER > KERNEL > SERVICES > LOGIN > DESKTOP) si procent,
   fundal cu "ploaie de date" in culoarea temei, si un final cu inel care se umple, litera Z luminoasa, acord de clopotei si fulger.
 - Sunete sintetizate in browser (fara fisiere audio): pornire cu zumzet si ventilator, bip POST, zgomot de disc,
   clicuri la taste cand scrie "operator" si "ze-start", sunet la sagetile din meniul GRUB, acord la final.
 - Volumul urmeaza "Music volume". Setari > "Start-up sound" ON/OFF. Cu sunetul oprit sau volum 0 nu mai apare ecranul POWER ON.
 - SKIP (buton jos-dreapta sau tasta Esc) sare peste pornire.
