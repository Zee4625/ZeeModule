/* ===== Global cameras data. Source: See.Cam listings (country counts + the Romania page). City positions are approximate. ===== */
const CAM_C=`us|United States|29051|39.8|-98.6
ad|Andorra|2|42.5|1.5
no|Norway|1316|61.5|8.5
rs|Serbia|49|44.0|20.9
ro|Romania|213|45.9|24.9
re|Réunion|16|-21.1|55.5
pt|Portugal|156|39.6|-8.0
pr|Puerto Rico|11|18.2|-66.5
pl|Poland|553|52.0|19.4
pk|Pakistan|1|30.4|69.3
pf|French Polynesia|3|-17.7|-149.4
pe|Peru|2|-9.2|-75.0
pa|Panama|3|8.5|-80.1
nz|New Zealand|413|-41.0|172.5
nl|Netherlands|201|52.2|5.3
se|Sweden|998|62.0|15.0
ni|Nicaragua|3|12.9|-85.2
na|Namibia|3|-22.0|17.1
my|Malaysia|175|4.2|102.0
mx|Mexico|40|23.6|-102.5
mv|Maldives|2|3.2|73.2
mu|Mauritius|1|-20.3|57.6
mt|Malta|1|35.9|14.4
mo|Macao|2|22.2|113.5
mk|North Macedonia|31|41.6|21.7
me|Montenegro|4|42.7|19.4
md|Moldova|5|47.2|28.5
ma|Morocco|6|31.8|-7.1
ru|Russia|671|57.0|40.0
si|Slovenia|190|46.1|14.8
sg|Singapore|7|1.35|103.8
hn|Honduras|1|14.8|-86.6
pg|Papua New Guinea|2|-6.3|143.9
np|Nepal|1|28.4|84.1
mz|Mozambique|1|-18.7|35.5
py|Paraguay|1|-23.4|-58.4
uz|Uzbekistan|2|41.4|64.6
sv|El Salvador|6|13.8|-88.9
zw|Zimbabwe|7|-19.0|29.2
ec|Ecuador|2|-1.8|-78.2
gh|Ghana|1|7.9|-1.0
vc|Saint Vincent and the Grenadines|1|13.25|-61.2
ck|Cook Islands|1|-21.2|-159.8
kh|Cambodia|1|12.6|104.9
tt|Trinidad and Tobago|1|10.7|-61.2
lu|Luxembourg|47|49.8|6.1
za|South Africa|53|-29.0|24.7
vn|Vietnam|478|14.1|108.3
vi|U.S. Virgin Islands|7|18.34|-64.9
ve|Venezuela|1|6.4|-66.6
uy|Uruguay|4|-32.5|-55.8
tz|Tanzania|1|-6.4|34.9
tw|Taiwan|51|23.7|121.0
tr|Turkey|138|39.0|35.2
th|Thailand|296|15.9|100.9
sn|Senegal|1|14.5|-14.5
sk|Slovakia|241|48.7|19.7
sj|Svalbard and Jan Mayen|9|78.2|15.6
lv|Latvia|20|56.9|24.6
lt|Lithuania|8|55.2|23.9
ae|United Arab Emirates|1|24.0|54.0
by|Belarus|4|53.7|27.9
dk|Denmark|492|56.0|10.0
de|Germany|2795|51.2|10.4
cz|Czechia|1354|49.8|15.5
cy|Cyprus|2|35.1|33.4
cv|Cape Verde|2|16.0|-24.0
cr|Costa Rica|5|9.9|-84.2
co|Colombia|5|4.6|-74.3
cn|China|28|35.9|104.2
cl|Chile|52|-35.7|-71.5
ch|Switzerland|1454|46.8|8.2
ca|Canada|3377|50.0|-100.0
bz|Belize|1|17.2|-88.5
br|Brazil|279|-10.8|-52.9
ee|Estonia|11|58.6|25.0
bq|Bonaire, Sint Eustatius, and Saba|1|12.15|-68.27
bm|Bermuda|3|32.3|-64.75
bg|Bulgaria|109|42.7|25.5
be|Belgium|105|50.6|4.7
bb|Barbados|2|13.2|-59.5
ba|Bosnia and Herzegovina|79|44.0|17.8
ax|Aland Islands|1|60.2|20.0
au|Australia|772|-25.7|134.5
at|Austria|1369|47.6|14.1
ar|Argentina|55|-34.6|-64.9
am|Armenia|2|40.2|44.9
al|Albania|1|41.1|20.0
do|Dominican Republic|1|18.9|-70.2
eg|Egypt|2|26.5|30.1
kz|Kazakhstan|2|48.0|67.0
hu|Hungary|12|47.2|19.4
kr|South Korea|36|36.5|127.9
kg|Kyrgyzstan|2|41.5|74.5
ke|Kenya|6|0.2|37.9
jp|Japan|1094|36.2|138.3
it|Italy|4059|42.8|12.6
is|Iceland|61|64.9|-18.6
ir|Iran|1|32.4|53.7
in|India|2|22.9|79.0
im|Isle of Man|9|54.2|-4.5
il|Israel|4|31.4|34.9
ie|Ireland|23|53.2|-8.1
id|Indonesia|51|-2.2|117.2
hr|Croatia|131|45.2|15.5
es|Spain|1776|40.2|-3.7
hk|Hong Kong|114|22.35|114.15
gt|Guatemala|2|15.6|-90.4
gr|Greece|395|39.1|22.9
gp|Guadeloupe|9|16.25|-61.55
gl|Greenland|3|72.0|-40.0
gg|Guernsey|1|49.45|-2.58
ge|Georgia|5|42.2|43.5
gd|Grenada|1|12.1|-61.7
gb|United Kingdom|1304|54.0|-2.5
fr|France|1322|46.6|2.4
fo|Faroe Islands|36|62.0|-6.9
fi|Finland|1130|62.5|26.0
la|Laos|2|19.9|102.5`.split('\n').map(l=>{const a=l.split('|');return{cc:a[0],n:a[1],c:+a[2],la:+a[3],lo:+a[4]}});
const RO_CITY={};`baile-felix|Baile Felix|46.99|21.99
fagaras|Fagaras|45.84|24.97
zarnesti|Zarnesti|45.56|25.33
iasi|Iasi|47.16|27.59
sub-balea-lac|Balea Lac|45.60|24.62
vatra-dornei|Vatra Dornei|47.34|25.36
campulung-moldovenesc|Campulung Moldovenesc|47.53|25.55
borsec|Borsec|46.96|25.56
baile-homorod|Baile Homorod|46.18|25.37
domeniul-schiabiltransalpina|Transalpina|45.33|23.66
sinaia|Sinaia|45.35|25.55
carlibaba|Carlibaba|47.60|25.28
gura-humorului|Gura Humorului|47.55|25.89
bran|Bran|45.51|25.37
toplita|Toplita|46.93|25.35
ranca|Ranca|45.22|23.63
straja|Straja|45.33|23.20
ciumani|Ciumani|46.65|25.78
cavnic|Cavnic|47.66|23.86
baisoara|Baisoara|46.51|23.30
arieseni|Arieseni|46.48|22.76
poiana-brasov|Poiana Brasov|45.60|25.55
Fundata|Fundata|45.43|25.28
moieciu|Moieciu|45.47|25.43
piatra-neamt|Piatra Neamt|46.93|26.37
baia-mare|Baia Mare|47.66|23.57
targu-secuiesc|Targu Secuiesc|46.00|26.14
baia-sprie|Baia Sprie|47.66|23.69
colibita|Colibita|47.14|24.79
hunedoara|Hunedoara|45.75|22.90
rupea|Rupea|46.03|25.22
jimbolia|Jimbolia|45.79|20.72
ceahlau|Ceahlau|46.98|25.95
brasov|Brasov|45.65|25.60
sacele|Sacele|45.62|25.69
marisel|Marisel|46.51|23.23
borsa|Borsa|47.65|24.66
durau|Durau|46.98|25.93
paltinis|Paltinis|45.65|23.93
sector-4|Bucharest, Sector 4|44.40|26.10
madaras|Madaras|46.30|25.78
zavoi|Zavoi|45.17|22.30
sibiu|Sibiu|45.80|24.15
azuga|Azuga|45.45|25.55
capusu-mare|Capusu Mare|46.75|23.15
dranceni|Dranceni|46.80|28.18
slobozia|Slobozia|44.57|27.36
buzau|Buzau|45.15|26.82
tulcea|Tulcea|45.18|28.80
victoria|Victoria|45.73|24.69
moeciu-de-jos|Moeciu de Jos|45.48|25.39`.split('\n').forEach(l=>{const a=l.split('|');RO_CITY[a[0]]=[a[1],+a[2],+a[3]]});
const RO_CAMS=`05/baile-felix/strand-apollo|Strand Apollo|1
09/fagaras/piata-republicii-fagaras|Piata Republicii - Fagaras|1
09/zarnesti/bear-sanctuary-zarnesti|Bear Sanctuary - Zarnesti|1
23/iasi/usv|USV|1
33/sub-balea-lac/cabana-balea-lac|Cabana Balea Lac|1
34/vatra-dornei/partia-veverita|Partia Veverita|1
34/campulung-moldovenesc/rarau-resort|Rarau Resort|1
34/campulung-moldovenesc/rarau-ski-resort|Rarau Ski Resort|1
20/borsec/partia-speranta|Partia Speranta|1
20/baile-homorod/pensiunea-lobogo|Pensiunea Lobogo|1
20/baile-homorod/pensiunea-lobogoski-spa|Pensiunea Lobogo Ski & Spa|1
39/domeniul-schiabiltransalpina/transalpina-ski-resort|Transalpina Ski Resort|1
30/sinaia/valea-soarelui|Valea Soarelui|1
34/carlibaba/partia-soimul-1|Partia Soimul 1|1
34/gura-humorului/partia-soimul-2|Partia Soimul 2|1
34/carlibaba/partia-carlibaba|Partia Carlibaba|1
09/bran/partia-zanoaga|Partia Zanoaga|1
20/toplita/partia-magherus|Partia Magherus|1
19/ranca/ranca|Ranca|1
21/straja/partia-sf-gheorghe|Partia Sf. Gheorghe|1
20/ciumani/partia-veresvirag|Partia Veresvirag|1
21/straja/partia-mutu|Partia Mutu|1
25/cavnic/partia-icoana|Partia Icoana|1
34/vatra-dornei/partia-dealu-negru|Partia Dealu Negru|1
13/baisoara/partia-baisoara|Partia Baisoara|1
01/arieseni/partia-vartop-1|Partia Vartop 1|1
01/arieseni/partia-vartop-2|Partia Vartop 2|1
09/poiana-brasov/gondola-postavarul|Gondola Postavarul|1
09/poiana-brasov/partia-subteleferic|Partia Subteleferic|1
34/vatra-dornei/partia-parc|Partia Parc|1
09/poiana-brasov/telecabina-kanzel|Telecabina Kanzel|1
09/poiana-brasov/teleferic-poiana-brasov|Teleferic Poiana Brasov|1
09/Fundata/partia-fundata|Partia Fundata|1
09/moieciu/partia-moieciu|Partia Moieciu|1
28/piatra-neamt/partia-cozla|Partia Cozla|1
25/baia-mare/lacul-firiza-simared|Lacul Firiza - Simared|1
15/targu-secuiesc/piata-gabor-aron|Piata Gabor Aron|1
25/baia-sprie/mogosa-lacul-bodi|Lacul Bodi|1
25/baia-sprie/mogosa-parcare|Mogosa - Parcare|1
06/colibita/hotel-roser-house|Hotel Roser House|1
21/hunedoara/castelul-corvinilor|Castelul Corvinilor|1
21/hunedoara/hunedoara-centru|Hunedoara - Centru|1
09/rupea/cetatea-rupea|Cetatea Rupea|1
09/rupea/rupea|Rupea|1
20/toplita/toplita-centrul-de-echitatie|Centrul de Echitatie|1
30/sinaia/crucea-caraiman|Crucea Caraiman|1
36/jimbolia/jimbolia|Jimbolia|1
28/ceahlau/cabana-dochia-ceahlau|Cabana Dochia Ceahlau|1
34/campulung-moldovenesc/masivul-rarau-pietrele-doamnei|Masivul Rarau - Pietrele Doamnei|1
09/brasov/brasov-city-live-webcam-ceasu-rau|Brasov City - Ceasu Rau - See Transylvania - Live Webcam|1
09/brasov/bran-casle-dracula-webcam|Castelul Bran - Dracula's Castle - Casa din Bran Webcam|1
09/brasov/town-square-brasov-romania|Town Square Brasov - Pizza Roma - Piata Sfatului Webcam|1
09/brasov/sacele-panoramic-webcam|Sacele Panoramic Webcam - Metromat Brasov|1
09/brasov/town-square-brasov-pizza-roma-piata-sfatului-live-webcam|Town Square Brasov - Pizza Roma - Piata Sfatului Live Webcam|1
09/brasov/brasov-city-ceasu-rau-see-transylvania|Brasov City - Ceasu Rau - See Transylvania|1
09/sacele/sacele-panoramic-metromat-brasov|Sacele Panoramic - Metromat Brasov|1
13/marisel/partia-marisel-salvamont|Partia Marisel - Salvamont|1
13/marisel/partia-marisel-partia-rosie-2|Partia Marisel - Partia Rosie 2|1
13/marisel/partia-marisel-partia-rosie-8|Partia Marisel - Partia Rosie 8|1
13/marisel/partia-marisel-partia-rosie|Partia Marisel - Partia Rosie|1
13/marisel/partia-marisel-partia-alnastra|Partia Marisel - Partia Albastra|1
25/borsa/partia-olimpica-borsa-1|Partia Olimpica Borsa - 1|1
25/borsa/partia-olimpica-borsa-2|Partia Olimpica Borsa - 2|1
20/toplita/partia-toplita-pensiunea-baciu|Partia Toplita - Pensiunea Baciu|1
25/borsa/partia-borsa|Partia Borsa|1
25/borsa/partia-borsa-telescaun-cascada-cailor|Partia Borsa - Telescaun Cascada Cailor|1
25/borsa/partia-izvoare|Partia Izvoare|1
28/durau/partia-durau|Partia Durau|1
33/paltinis/telescaun-paltinis|Telescaun Paltinis|1
21/straja/platoul-soarelui|Platoul Soarelui|1
10/sector-4/sector-4-piata-unirii|Sector 4: Piata Unirii|0
25/baia-sprie/baia-sprie-complex-turist-suior-cota-1000-1640698115|Baia Sprie: Complex Turist Suior - Cota 1000|0
30/sinaia/sinaia|Sinaia|0
25/cavnic/cavnic-superski-cavnic|Cavnic: Superski Cavnic|0
25/cavnic/cavnic-1668944062|Cavnic|0
20/madaras/madaras|Madaras|0
12/zavoi/zavoi-1670185578|Zavoi|0
12/zavoi/zavoi-1670198633|Zavoi (2)|0
09/zarnesti/zarnesti-west-cabana-plaiul-foii|Zarnesti West: Cabana Plaiul Foii|0
33/sibiu/sibiu-arena-platos|Sibiu: Arena Platos|0
09/brasov/brasov-cabana-yager-chalet-poiana-brasov-partie-de|Brasov: Cabana Yager Chalet - Poiana Brasov - Partie de schi|0
33/sibiu/sibiu-arena-platos-1640785928|Sibiu: Arena Platos (2)|0
30/sinaia/sinaia-1651158340|Sinaia (2)|0
09/brasov/panoramic-brasov|Panoramic Brasov|0
30/azuga/azuga|Azuga|0
33/sibiu/sibiu-arena-platos-1640786225|Sibiu: Arena Platos (3)|0
13/capusu-mare/capusu-mare|Capusu Mare|0
15/targu-secuiesc/targu-secuiesc-hostel-sport|Targu Secuiesc: Hostel Sport|0
30/sinaia/sinaia-1654547709|Sinaia (3)|0
09/sacele/sacele|Sacele|0
38/dranceni/dranceni-vama-leuseni|Dranceni: Vama Leuseni|0
22/slobozia/slobozia-north|Slobozia North|0
11/buzau/buzau-north-west-calea-eroilor|Buzau North-West: Calea Eroilor|0
23/iasi/iasi-1672167322|Iasi|0
09/sacele/sacele-north-brasov|Sacele North: Brasov|0
21/hunedoara/hunedoara|Hunedoara|0
37/tulcea/tulcea-north-east-strada-babadag|Tulcea North-East: Strada Babadag|0
25/baia-mare/sovata-1656233839|Baia Mare: Lacul de Acumulare Firiza|0
09/victoria/victoria-north-cabana-balea-lac|Victoria North: Cabana Balea Lac|0
09/moeciu-de-jos/sinaia-1673528251|Moeciu de Jos|0`.split('\n').map(l=>{const a=l.split('|'),p=a[0].split('/');return{p:a[0],n:a[1],live:a[2]==='1',reg:p[0],city:p[1]}});
const RO_MORE=[("Botosani", "07", "botosani", 47.75, 26.67, 1), ("Bucharest", "10", "bucharest", 44.43, 26.1, 1), ("Cluj", "13", "cluj", 46.77, 23.59, 1), ("Constanta", "14", "constanta", 44.18, 28.65, 4), ("Galati", "18", "galati", 45.44, 28.05, 1), ("Braila", "08", "braila", 45.27, 27.97, 1), ("Pitesti", "03", "pitesti", 44.86, 24.87, 3), ("Resita", "12", "resita", 45.3, 21.89, 2), ("Targu Jiu", "19", "targu-jiu", 45.04, 23.27, 2), ("Alba Iulia", "01", "alba-iulia", 46.07, 23.57, 1), ("Arad", "02", "arad", 46.18, 21.31, 1), ("Mangalia", "14", "mangalia", 43.82, 28.58, 1), ("Novaci", "19", "novaci", 45.17, 23.67, 7), ("Busteni", "30", "busteni", 45.41, 25.54, 7), ("Vaslui", "38", "vaslui", 46.64, 27.73, 2), ("Alexandria", "31", "alexandria", 43.97, 25.33, 1), ("Mioveni", "03", "mioveni", 44.96, 24.94, 1), ("Baile Tusnad", "20", "baile-tusnad", 46.14, 25.84, 1), ("Baile Olanesti", "39", "baile-olanesti", 45.2, 24.24, 1), ("Petrila", "21", "petrila", 45.45, 23.41, 1)];
const CAM_TOTAL=CAM_C.reduce((s,c)=>s+c.c,0);
