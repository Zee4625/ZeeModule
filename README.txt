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
  Click pe un marcaj sau pe un rand: zboara acolo si afiseaza camera. VIEW HERE incearca sa o arate in fereastra;
  daca site-ul camerei nu permite incorporarea, foloseste OPEN CAMERA PAGE. Pozitiile sunt aproximative (orasul).
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
