/* ===== Zack Engine SYS v11 · Maps (2D map, 3D globe, countries and states) ===== */
const stars=[];for(let s=0;s<120;s++)stars.push({x:Math.random()*2000,y:Math.random()*1000,z:Math.random()*1.8+.4,v:Math.random()*.04+.01,o:Math.random()});
/* ---------- Planet · Maps (real Natural Earth 1:50m data, embedded) ---------- */
const TW=1024,TH=512,PAL=['#0e3b2a','#124a34','#0b3a3c','#1b4a2c','#14423f','#0f4030'];
const pm={mode:'3D',spin:true,yaw:.2,pitch:.5,z3:1,drag:false,moved:0,mx:null,my:null,pin:null,dirty:true,view:{cx:.5,cy:.45,k:1},fly:null,ty:null,tp:null,td:null};
const ZN=[['US-DC',38.9,-77,'#00ff66'],['EU-RO',47.7,26.6,'#00eeff'],['AS-TK',35.6,139.6,'#fbbf24']];
const CITIES=[['Bucharest',44.43,26.1],['Botoșani',47.75,26.67],['Washington DC',38.9,-77.04],['New York',40.71,-74],['London',51.51,-.13],['Paris',48.86,2.35],['Berlin',52.52,13.4],['Moscow',55.75,37.62],['Cairo',30.04,31.24],['Dubai',25.2,55.27],['Delhi',28.61,77.21],['Beijing',39.9,116.4],['Tokyo',35.68,139.65],['Sydney',-33.87,151.21],['São Paulo',-23.55,-46.63],['Mexico City',19.43,-99.13],['Los Angeles',34.05,-118.24],['Lagos',6.52,3.38],['Istanbul',41.01,28.98],['Singapore',1.35,103.82],['Johannesburg',-26.2,28.05],['Buenos Aires',-34.6,-58.38],['Seoul',37.57,126.98],['Kyiv',50.45,30.52],['Iași',47.16,27.59],['Cluj-Napoca',46.77,23.59],['Madrid',40.42,-3.7],['Rome',41.9,12.5],['Nairobi',-1.29,36.82],['Mumbai',19.08,72.88],['Bangkok',13.76,100.5],['Shanghai',31.23,121.47],['Auckland',-36.85,174.76],['Vancouver',49.28,-123.12],['Reykjavik',64.15,-21.94],['Lima',-12.05,-77.04],['Bogotá',4.71,-74.07],['Tehran',35.69,51.39],['Jakarta',-6.2,106.85],['Manila',14.6,120.98],['Honolulu',21.31,-157.86],['Anchorage',61.22,-149.9]];
const mapC=document.createElement('canvas'),nightC=document.createElement('canvas');nightC.width=nightC.height=128;let nightT=0;
const sph=document.createElement('canvas');sph.width=sph.height=240;const sx=sph.getContext('2d'),R3={k:''};let img=sx.createImageData(240,240);
const mX=lo=>(lo+180)/360,mY=la=>{la=clamp(la,-85,85)*Math.PI/180;return(1-Math.log(Math.tan(Math.PI/4+la/2))/Math.PI)/2},iLat=y=>Math.atan(Math.sinh(Math.PI*(1-2*y)))*180/Math.PI;
const nz=x=>x.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function countryAt(lo,la){for(let i=0;i<GEO.length;i++){const c=GEO[i];if(lo<c[3]||lo>c[5]||la<c[4]||la>c[6])continue;let ins=false;
  for(const r of c[7])for(let j=0,n=r.length-2;j<r.length;n=j,j+=2){const xi=r[j],yi=r[j+1],xj=r[n],yj=r[n+1];if((yi>la)!==(yj>la)&&lo<(xj-xi)*(la-yi)/(yj-yi)+xi)ins=!ins}
  if(ins)return i}return -1}
function cpath(g,c,X,Y){g.beginPath();for(const r of c[7]){let lx=1e9,ly=1e9;for(let j=0;j<r.length;j+=2){const px=X(r[j]),py=Y(r[j+1]);if(j===0){g.moveTo(px,py);lx=px;ly=py}else if(Math.abs(px-lx)+Math.abs(py-ly)>.6){g.lineTo(px,py);lx=px;ly=py}}g.closePath()}}
function label(g,t,x,y,c){g.font='13px "Share Tech Mono",monospace';g.lineWidth=3;g.strokeStyle='rgba(0,0,0,.85)';g.strokeText(t,x,y);g.fillStyle=c||'#e6fff0';g.fillText(t,x,y)}
function buildTex(){const c=document.createElement('canvas');c.width=TW;c.height=TH;const g=c.getContext('2d'),o=g.createLinearGradient(0,0,0,TH);
  o.addColorStop(0,'#0b2a52');o.addColorStop(.5,'#0a4080');o.addColorStop(1,'#0b2a52');g.fillStyle=o;g.fillRect(0,0,TW,TH);
  const L=g.createLinearGradient(0,0,0,TH);[[0,'#f2f6f8'],[.08,'#dfe8ea'],[.16,'#7f9a73'],[.25,'#3f7a3c'],[.31,'#9aa35a'],[.35,'#c9ae6a'],[.42,'#7c9a45'],[.5,'#2c7a35'],[.58,'#7c9a45'],[.65,'#c9ae6a'],[.72,'#6f9a4a'],[.82,'#9fb59a'],[.88,'#dfe8ea'],[1,'#f2f6f8']].forEach(s=>L.addColorStop(s[0],s[1]));
  g.fillStyle=L;g.strokeStyle='rgba(0,0,0,.3)';g.lineWidth=.6;
  GEO.forEach(cn=>{g.beginPath();for(const r of cn[7]){for(let j=0;j<r.length;j+=2){const x=(r[j]+180)/360*TW,y=(90-r[j+1])/180*TH;j?g.lineTo(x,y):g.moveTo(x,y)}g.closePath()}g.fill('evenodd');g.stroke()});
  pm.td=g.getImageData(0,0,TW,TH).data}
function buildNight(){nightT=Date.now();const g=nightC.getContext('2d'),d=g.createImageData(128,128),n=new Date(),uh=n.getUTCHours()+n.getUTCMinutes()/60,doy=(n-Date.UTC(n.getUTCFullYear(),0,0))/864e5,dec=23.44*Math.sin(2*Math.PI*(doy-81)/365)*Math.PI/180,ssl=-(uh-12)*15*Math.PI/180;
  for(let r=0;r<128;r++){const la=iLat((r+.5)/128)*Math.PI/180;for(let c=0;c<128;c++){const lo=((c+.5)/128-.5)*2*Math.PI,cz=Math.sin(la)*Math.sin(dec)+Math.cos(la)*Math.cos(dec)*Math.cos(lo-ssl),k=(r*128+c)*4;d.data[k+2]=25;d.data[k+3]=clamp((.1-cz)*3,0,.6)*255}}g.putImageData(d,0,0)}
function clampView(w,h){if(!w||!h)return;const v=pm.view;v.k=clamp(v.k,1,80);const hx=.5/v.k,hy=(h/2)/(w*v.k);v.cx=clamp(v.cx,hx,1-hx);v.cy=hy>=.5?.5:clamp(v.cy,hy,1-hy)}
function zoomBy(f){if(pm.mode==='3D')pm.z3=clamp(pm.z3*f,.5,2.2);else{const c=$('pmC');pm.fly=null;pm.view.k*=f;clampView(c.clientWidth,c.clientHeight);pm.dirty=true}}
const SPAL=['#1f6f4a','#2a7f8f','#7a8f2a','#8f5a2a','#6a3f9f','#2a5a9f'];Object.assign(pm,{sel:-1,selS:-1,showS:true,focus:true});
const SBC={};ADM.forEach((a,j)=>{(SBC[a[8]]=SBC[a[8]]||[]).push(j)});
function pip(rs,lo,la){let ins=false;for(const r of rs)for(let j=0,n=r.length-2;j<r.length;n=j,j+=2){const xi=r[j],yi=r[j+1],xj=r[n],yj=r[n+1];if((yi>la)!==(yj>la)&&lo<(xj-xi)*(la-yi)/(yj-yi)+xi)ins=!ins}return ins}
function stateAt(ci,lo,la){for(const j of SBC[ci]||[]){const c=ADM[j];if(lo<c[3]||lo>c[5]||la<c[4]||la>c[6])continue;if(pip(c[7],lo,la))return j}return -1}
function bboxOf(c,th){const rs=c[7].map(r=>{let a=999,b=999,x=-999,y=-999;for(let j=0;j<r.length;j+=2){a=Math.min(a,r[j]);x=Math.max(x,r[j]);b=Math.min(b,r[j+1]);y=Math.max(y,r[j+1])}return[a,b,x,y,(x-a)*(y-b)]}),mx=Math.max(...rs.map(r=>r[4])),u=[999,999,-999,-999];
  rs.forEach(r=>{if(r[4]>=mx*th){u[0]=Math.min(u[0],r[0]);u[1]=Math.min(u[1],r[1]);u[2]=Math.max(u[2],r[2]);u[3]=Math.max(u[3],r[3])}});return u}
function fitBox(a,b,c,d){const cv=$('pmC'),w=cv.clientWidth||800,h=cv.clientHeight||500,dx=Math.max(mX(c)-mX(a),1e-4),dy=Math.max(mY(b)-mY(d),1e-4);
  pm.fly={cx:(mX(a)+mX(c))/2,cy:(mY(b)+mY(d))/2,k:clamp(Math.min(1/(dx*1.25),h/(w*dy*1.25)),1,80)}}
function flyGlobe(la,lo,a,b,c,d){pm.ty=-lo*Math.PI/180;pm.tp=clamp(la*Math.PI/180,-1.2,1.2);pm.spin=false;pm.z3=clamp(.35/Math.max(mX(c)-mX(a),mY(b)-mY(d),.001),1,2.2)}
function fillStates(i){$('mpS').innerHTML='<option value="">State / province…</option>'+(SBC[i]||[]).slice().sort((a,b)=>ADM[a][0].localeCompare(ADM[b][0])).map(j=>`<option value="${j}">${esc(ADM[j][0])}</option>`).join('')}
function selCountry(i,fit){pm.sel=i;pm.selS=-1;pm.dirty=true;$('mpC').value=i;fillStates(i);if(fit){const b=bboxOf(GEO[i],.3);fitBox(...b);flyGlobe(GEO[i][2],GEO[i][1],...b)}}
function selState(j,fit){const a=ADM[j];selCountry(a[8],false);pm.selS=j;$('mpS').value=j;pm.dirty=true;if(fit){const b=bboxOf(a,0);fitBox(...b);flyGlobe(a[2],a[1],...b)}}
function mpPickC(v){if(v==='')return resetMap();selCountry(+v,true)}
function mpPickS(v){if(v!=='')selState(+v,true)}
function resetMap(){pm.sel=-1;pm.selS=-1;pm.pin=null;pm.dirty=true;pm.fly={cx:.5,cy:.45,k:1};pm.z3=1;$('mpC').value='';$('mpS').innerHTML='<option value="">State / province…</option>'}
function outline3(g,c,col,R,cx,cy){g.strokeStyle=col;g.lineWidth=2;g.beginPath();for(const r of c[7]){let pen=false;const st=r.length>1200?4:2;for(let j=0;j<r.length;j+=st){const p=proj(r[j+1],r[j]);if(p[2]>0){const X=cx+p[0]*R,Y=cy-p[1]*R;pen?g.lineTo(X,Y):g.moveTo(X,Y);pen=true}else pen=false}}g.stroke()}
$('mpC').innerHTML='<option value="">Country…</option>'+GEO.map((c,i)=>[c[0],i]).sort((a,b)=>a[0].localeCompare(b[0])).map(x=>`<option value="${x[1]}">${esc(x[0])}</option>`).join('');
function pmSearch(){const q=nz($('pmQ').value.trim());if(!q)return;const m=q.match(/^(-?\d+(?:\.\d+)?)\s*[, ]\s*(-?\d+(?:\.\d+)?)$/);
  const go=(la,lo,nm,k)=>{pm.pin={la,lo,nm};pm.fly={cx:mX(lo),cy:mY(la),k};pm.ty=-lo*Math.PI/180;pm.tp=clamp(la*Math.PI/180,-1.2,1.2);pm.spin=false;log('MAPS: '+nm+' ('+la.toFixed(3)+', '+lo.toFixed(3)+')','s')};
  if(m)return go(+m[1],+m[2],m[1]+', '+m[2],8);
  const c=CITIES.find(c=>nz(c[0]).includes(q));if(c)return go(c[1],c[2],c[0],8);
  let i=GEO.findIndex(c=>nz(c[0])===q);if(i<0)i=GEO.findIndex(c=>nz(c[0]).includes(q));
  if(i>=0){selCountry(i,true);pm.pin={la:GEO[i][2],lo:GEO[i][1],nm:GEO[i][0]};return log('MAPS: '+GEO[i][0],'s')}
  let j=ADM.findIndex(a=>nz(a[0])===q);if(j<0)j=ADM.findIndex(a=>nz(a[0]).includes(q));
  if(j>=0){selState(j,true);pm.pin={la:ADM[j][2],lo:ADM[j][1],nm:ADM[j][0]+', '+GEO[ADM[j][8]][0]};return log('MAPS: '+pm.pin.nm,'s')}
  log('MAPS: not found "'+q+'"','d')}
function mapLayer(w,h){if(mapC.width!==w||mapC.height!==h){mapC.width=w;mapC.height=h}const g=mapC.getContext('2d'),v=pm.view,S=w*v.k,X=lo=>(mX(lo)-v.cx)*S+w/2,Y=la=>(mY(la)-v.cy)*S+h/2,fo=pm.focus&&pm.sel>=0,vis=c=>!(X(c[5])<0||X(c[3])>w||Y(c[4])<0||Y(c[6])>h);
  g.fillStyle='#030b16';g.fillRect(0,0,w,h);g.strokeStyle='rgba(0,255,102,.12)';g.lineWidth=1;g.beginPath();for(let lo=-180;lo<=180;lo+=30){g.moveTo(X(lo),0);g.lineTo(X(lo),h)}for(let la=-60;la<=60;la+=30){g.moveTo(0,Y(la));g.lineTo(w,Y(la))}g.stroke();
  GEO.forEach((c,i)=>{if(!vis(c))return;const sl=i===pm.sel;cpath(g,c,X,Y);g.globalAlpha=fo&&!sl?.22:1;g.fillStyle=sl?'#0f4a33':PAL[i%6];g.fill('evenodd');g.strokeStyle='rgba(0,255,102,.5)';g.lineWidth=sl?1.6:.7;g.stroke();g.globalAlpha=1});
  if(pm.showS)ADM.forEach((a,j)=>{const sl=a[8]===pm.sel;if(!sl&&v.k<2.2)return;if(fo&&!sl)return;if(!vis(a))return;cpath(g,a,X,Y);if(sl){g.globalAlpha=.7;g.fillStyle=SPAL[j%6];g.fill('evenodd');g.globalAlpha=1}g.strokeStyle=sl?'rgba(255,255,255,.6)':'rgba(255,255,255,.22)';g.lineWidth=sl?1:.6;g.stroke()});
  pm.dirty=false}
function draw2(g,w,h){const v=pm.view;clampView(w,h);const S=w*v.k;if(pm.dirty||mapC.width!==w||mapC.height!==h)mapLayer(w,h);g.drawImage(mapC,0,0);
  const X=lo=>(mX(lo)-v.cx)*S+w/2,Y=la=>(mY(la)-v.cy)*S+h/2,fo=pm.focus&&pm.sel>=0;if(Date.now()-nightT>30000)buildNight();g.imageSmoothingEnabled=true;g.drawImage(nightC,(0-v.cx)*S+w/2,(0-v.cy)*S+h/2,S,S);
  let info='';if(pm.mx!=null){const lo=((pm.mx-w/2)/S+v.cx)*360-180,la=iLat((pm.my-h/2)/S+v.cy),hv=countryAt(lo,la);info=`LAT ${la.toFixed(3)}° LON ${lo.toFixed(3)}° · `;
    if(hv>=0){const sj=pm.showS?stateAt(hv,lo,la):-1;info+=GEO[hv][0]+(sj>=0?' › '+ADM[sj][0]:'')+' · ';cpath(g,sj>=0?ADM[sj]:GEO[hv],X,Y);g.fillStyle='rgba(0,255,102,.28)';g.fill('evenodd');g.strokeStyle='#00ff66';g.lineWidth=1.5;g.stroke()}else info+='Ocean · '}
  if(pm.selS>=0){cpath(g,ADM[pm.selS],X,Y);g.fillStyle='rgba(255,210,60,.35)';g.fill('evenodd');g.strokeStyle='#ffd23a';g.lineWidth=2;g.stroke()}
  if(pm.sel>=0){cpath(g,GEO[pm.sel],X,Y);g.strokeStyle='#00eeff';g.lineWidth=2;g.stroke()}
  GEO.forEach((c,i)=>{if(fo&&i!==pm.sel)return;if(v.k<1.8&&i!==pm.sel)return;const px=X(c[1]),py=Y(c[2]);if((X(c[5])-X(c[3])>70||i===pm.sel)&&px>0&&px<w&&py>0&&py<h)label(g,c[0].toUpperCase(),px-c[0].length*3.2,py,'rgba(190,255,215,.95)')});
  if(pm.sel>=0&&pm.showS&&v.k>=2)(SBC[pm.sel]||[]).forEach(j=>{const a=ADM[j],px=X(a[1]),py=Y(a[2]);if(X(a[5])-X(a[3])>46&&px>0&&px<w&&py>0&&py<h)label(g,a[0],px-a[0].length*3,py,'#fff')});
  CITIES.forEach((c,i)=>{const px=X(c[2]),py=Y(c[1]);if(px<-30||px>w+30||py<-10||py>h+10)return;const mj=i<24;if(!mj&&v.k<2.5)return;g.fillStyle='#fff';g.beginPath();g.arc(px,py,mj?3:2,0,7);g.fill();if(v.k>=1.3||(mj&&w>700))label(g,c[0],px+6,py+3)});
  ZN.forEach(([n,la,lo,col])=>{const px=X(lo),py=Y(la);g.strokeStyle=g.fillStyle=col;g.beginPath();g.arc(px,py,3.5,0,7);g.fill();g.beginPath();g.arc(px,py,8+Math.sin(Date.now()/200)*2,0,7);g.stroke();label(g,'['+n+']',px+11,py-7,col)});
  drawCams2(g,X,Y,w,h,v);if(pm.pin){const px=X(pm.pin.lo),py=Y(pm.pin.la);g.fillStyle='#ff003c';g.beginPath();g.arc(px,py,6,0,7);g.fill();g.strokeStyle='#fff';g.lineWidth=2;g.stroke();label(g,pm.pin.nm,px+10,py+4,'#ffd0d8')}
  $('pmInfo').textContent=info+`zoom ${v.k.toFixed(1)}× · scroll = zoom · drag = pan · click = select country/state · double-click = zoom to it`+(pm.pin?` · PIN ${pm.pin.nm} ${pm.pin.la.toFixed(4)}, ${pm.pin.lo.toFixed(4)}`:'')}
function render3D(){if(!pm.td)return;const N=PERF.lite?170:240;if(sph.width!==N){sph.width=sph.height=N;img=sx.createImageData(N,N)}const key=pm.yaw.toFixed(3)+'|'+pm.pitch.toFixed(3)+'|'+N;if(key===R3.k)return;R3.k=key;const d=img.data,cyw=Math.cos(pm.yaw),syw=Math.sin(pm.yaw),cp=Math.cos(pm.pitch),sp=Math.sin(pm.pitch),T=pm.td;
  for(let j=0;j<N;j++){const y=1-2*(j+.5)/N;for(let i=0;i<N;i++){const x=2*(i+.5)/N-1,r2=x*x+y*y,k=(j*N+i)*4;if(r2>1){d[k+3]=0;continue}
    const z=Math.sqrt(1-r2),y1=y*cp+z*sp,z1=-y*sp+z*cp,x2=x*cyw-z1*syw,z2=x*syw+z1*cyw,lon=Math.atan2(x2,z2),lat=Math.asin(Math.max(-1,Math.min(1,y1))),
      ti=(((lon/6.2832+.5)*TW)|0)%TW,tj=Math.min(TH-1,((.5-lat/Math.PI)*TH)|0),q=(tj*TW+ti)*4,sh=Math.max(.12,-x*.5+y*.5+z*.7),rim=Math.pow(1-z,3)*120;
    d[k]=T[q]*sh+rim*.3;d[k+1]=T[q+1]*sh+rim*.6;d[k+2]=T[q+2]*sh+rim;d[k+3]=255}}sx.putImageData(img,0,0)}
function proj(la,lo){la*=Math.PI/180;lo*=Math.PI/180;const cl=Math.cos(la),mx=cl*Math.sin(lo),my=Math.sin(la),mz=cl*Math.cos(lo),cy=Math.cos(pm.yaw),sy=Math.sin(pm.yaw),cp=Math.cos(pm.pitch),sp=Math.sin(pm.pitch),x1=mx*cy+mz*sy,z1=-mx*sy+mz*cy;return[x1,my*cp-z1*sp,my*sp+z1*cp]}
function pick3(mx,my,w,h){const R=Math.min(w,h)*.42*pm.z3,x=(mx-w/2)/R,y=(h/2-my)/R,r2=x*x+y*y;if(r2>1)return null;const z=Math.sqrt(1-r2),cp=Math.cos(pm.pitch),sp=Math.sin(pm.pitch),cy=Math.cos(pm.yaw),sy=Math.sin(pm.yaw),y1=y*cp+z*sp,z1=-y*sp+z*cp,x2=x*cy-z1*sy,z2=x*sy+z1*cy;return[Math.asin(clamp(y1,-1,1))*180/Math.PI,Math.atan2(x2,z2)*180/Math.PI]}
function draw3(g,w,h){stars.forEach(s=>{g.fillStyle=`rgba(255,255,255,${Math.abs(s.o)})`;g.fillRect(s.x%w,s.y%h,s.z,s.z)});
  if(pm.spin&&!pm.drag&&pm.ty==null)pm.yaw+=.004;render3D();const R=Math.min(w,h)*.42*pm.z3,cx=w/2,cy=h/2,gr=g.createRadialGradient(cx,cy,R*.95,cx,cy,R*1.18);
  gr.addColorStop(0,'rgba(60,140,255,.45)');gr.addColorStop(1,'rgba(60,140,255,0)');g.fillStyle=gr;g.beginPath();g.arc(cx,cy,R*1.18,0,7);g.fill();g.imageSmoothingEnabled=true;g.drawImage(sph,cx-R,cy-R,2*R,2*R);
  CITIES.forEach((c,i)=>{if(i>=24&&pm.z3<1.3)return;const p=proj(c[1],c[2]);if(p[2]>.05){const X=cx+p[0]*R,Y=cy-p[1]*R;g.fillStyle='#fff';g.beginPath();g.arc(X,Y,2,0,7);g.fill();if(pm.z3>=1.2)label(g,c[0],X+5,Y+3)}});
  ZN.forEach(([n,la,lo,col])=>{const p=proj(la,lo);if(p[2]>0){const X=cx+p[0]*R,Y=cy-p[1]*R;g.fillStyle=g.strokeStyle=col;g.beginPath();g.arc(X,Y,3,0,7);g.fill();g.beginPath();g.arc(X,Y,6+Math.sin(Date.now()/200)*2,0,7);g.stroke();label(g,'['+n+']',X+9,Y-5,col)}});
  drawCams3(g,R,cx,cy);if(pm.sel>=0)outline3(g,GEO[pm.sel],'#00eeff',R,cx,cy);if(pm.selS>=0)outline3(g,ADM[pm.selS],'#ffd23a',R,cx,cy);if(pm.pin){const p=proj(pm.pin.la,pm.pin.lo);if(p[2]>0){const X=cx+p[0]*R,Y=cy-p[1]*R;g.fillStyle='#ff003c';g.beginPath();g.arc(X,Y,5,0,7);g.fill();g.strokeStyle='#fff';g.lineWidth=2;g.stroke();label(g,pm.pin.nm,X+9,Y+4,'#ffd0d8')}}
  let info='';if(pm.mx!=null){const ll=pick3(pm.mx,pm.my,w,h);if(ll){const i=countryAt(ll[1],ll[0]);info=`LAT ${ll[0].toFixed(2)}° LON ${ll[1].toFixed(2)}° · ${i>=0?GEO[i][0]:'Ocean'} · `}}
  $('pmInfo').textContent=info+`3D GLOBE · drag = rotate · scroll = zoom · click = pin · yaw ${((pm.yaw*57.3)%360).toFixed(0)}°`+(pm.pin?` · PIN ${pm.pin.nm} ${pm.pin.la.toFixed(4)}, ${pm.pin.lo.toFixed(4)}`:'')}
function drawPm(){if($('tPlanet').style.display==='none')return;const c=$('pmC'),w=c.clientWidth,h=c.clientHeight;if(c.width!==w)c.width=w;if(c.height!==h)c.height=h;const g=c.getContext('2d');
  if(pm.fly){const v=pm.view,f=pm.fly;v.cx+=(f.cx-v.cx)*.14;v.cy+=(f.cy-v.cy)*.14;v.k+=(f.k-v.k)*.14;clampView(w,h);pm.dirty=true;if(Math.abs(f.k-v.k)<.02&&Math.abs(f.cx-v.cx)<1e-4)pm.fly=null}
  if(pm.ty!=null){let d=pm.ty-pm.yaw;d=Math.atan2(Math.sin(d),Math.cos(d));pm.yaw+=d*.08;pm.pitch+=(pm.tp-pm.pitch)*.08;if(Math.abs(d)<.003&&Math.abs(pm.tp-pm.pitch)<.003)pm.ty=null}
  g.fillStyle='#000';g.fillRect(0,0,w,h);$('pmMode').textContent=pm.mode;pm.mode==='3D'?draw3(g,w,h):draw2(g,w,h);
  }
const pcv=$('pmC');
pcv.addEventListener('pointerdown',e=>{pm.drag=true;pm.moved=0;pm.lx=e.clientX;pm.ly=e.clientY;pm.fly=null;pm.ty=null;pcv.setPointerCapture(e.pointerId)});
pcv.addEventListener('pointerup',e=>{pm.drag=false;if(pm.moved<5){const r=pcv.getBoundingClientRect(),mx=e.clientX-r.left,my=e.clientY-r.top;if(camClick(mx,my,r.width,r.height))return;let ll;
  if(pm.mode==='3D')ll=pick3(mx,my,r.width,r.height);else{const v=pm.view,S=r.width*v.k;ll=[iLat((my-r.height/2)/S+v.cy),((mx-r.width/2)/S+v.cx)*360-180]}
  if(ll){const i=countryAt(ll[1],ll[0]);let nm='Ocean';if(i>=0){nm=GEO[i][0];const j=stateAt(i,ll[1],ll[0]);selCountry(i,false);if(j>=0){pm.selS=j;$('mpS').value=j;nm+=' › '+ADM[j][0]}}pm.pin={la:ll[0],lo:ll[1],nm}}}});
pcv.addEventListener('dblclick',()=>{if(pm.selS>=0)selState(pm.selS,true);else if(pm.sel>=0)selCountry(pm.sel,true)});
pcv.addEventListener('pointerleave',()=>pm.mx=null);
pcv.addEventListener('pointermove',e=>{const r=pcv.getBoundingClientRect();pm.mx=e.clientX-r.left;pm.my=e.clientY-r.top;
  if(pm.drag){const dx=e.clientX-pm.lx,dy=e.clientY-pm.ly;pm.moved+=Math.abs(dx)+Math.abs(dy);pm.lx=e.clientX;pm.ly=e.clientY;
    if(pm.mode==='3D'){pm.yaw+=dx*.008;pm.pitch=clamp(pm.pitch+dy*.008,-1.3,1.3)}else{const v=pm.view,S=r.width*v.k;v.cx-=dx/S;v.cy-=dy/S;clampView(r.width,r.height);pm.dirty=true}}});
pcv.addEventListener('wheel',e=>{e.preventDefault();const f=Math.exp(-e.deltaY*.0015);if(pm.mode==='3D'){pm.z3=clamp(pm.z3*f,.5,2.2);return}
  const r=pcv.getBoundingClientRect(),v=pm.view,S=r.width*v.k,ox=e.clientX-r.left-r.width/2,oy=e.clientY-r.top-r.height/2,wx=ox/S+v.cx,wy=oy/S+v.cy;v.k*=f;clampView(r.width,r.height);const S2=r.width*v.k;v.cx=wx-ox/S2;v.cy=wy-oy/S2;clampView(r.width,r.height);pm.dirty=true;pm.fly=null},{passive:false});
$('pmQ').addEventListener('keydown',e=>{if(e.key==='Enter')pmSearch()});



/* pinch zoom (touch) */
function zoomAt(x,y,f){if(pm.mode==='3D'){pm.z3=clamp(pm.z3*f,.5,2.2);return}const r=pcv.getBoundingClientRect(),v=pm.view,S=r.width*v.k,ox=x-r.left-r.width/2,oy=y-r.top-r.height/2,wx=ox/S+v.cx,wy=oy/S+v.cy;v.k*=f;clampView(r.width,r.height);const S2=r.width*v.k;v.cx=wx-ox/S2;v.cy=wy-oy/S2;clampView(r.width,r.height);pm.dirty=true;pm.fly=null}
{const ptr=new Map();let pd=0;
 pcv.addEventListener('pointerdown',e=>{ptr.set(e.pointerId,[e.clientX,e.clientY]);if(ptr.size===2){pm.drag=false;pd=0}},{capture:true});
 pcv.addEventListener('pointermove',e=>{if(!ptr.has(e.pointerId))return;ptr.set(e.pointerId,[e.clientX,e.clientY]);if(ptr.size===2){const [a,b]=[...ptr.values()],d=Math.hypot(a[0]-b[0],a[1]-b[1]);if(pd)zoomAt((a[0]+b[0])/2,(a[1]+b[1])/2,d/pd);pd=d;pm.moved=99;e.stopImmediatePropagation()}},{capture:true});
 const up=e=>{ptr.delete(e.pointerId);if(ptr.size<2)pd=0};pcv.addEventListener('pointerup',up,{capture:true});pcv.addEventListener('pointercancel',up)}



/* ---- saved map state ---- */
{let sv={};try{sv=JSON.parse(localStorage.getItem('zack.maps')||'{}')}catch(e){}
 if(sv.mode)pm.mode=sv.mode;if(sv.spin===false)pm.spin=false;if(sv.view&&[sv.view.cx,sv.view.cy,sv.view.k].every(Number.isFinite))Object.assign(pm.view,sv.view);if(sv.sel>=0&&GEO[sv.sel]){selCountry(sv.sel,false);if(sv.selS>=0&&ADM[sv.selS]){pm.selS=sv.selS;$('mpS').value=sv.selS}}if(sv.pin)pm.pin=sv.pin}
const saveMaps=()=>{try{localStorage.setItem('zack.maps',JSON.stringify({mode:pm.mode,spin:pm.spin,view:pm.view,sel:pm.sel,selS:pm.selS,pin:pm.pin}))}catch(e){}};
addEventListener('pagehide',saveMaps);setInterval(()=>{if(!document.hidden)saveMaps()},5000);
setTimeout(()=>{buildTex();buildNight();pm.dirty=true},60);
onFrame(()=>{if(!pm.td){const c=$('pmC'),g=c.getContext('2d');g.fillStyle='#000';g.fillRect(0,0,c.width,c.height);g.fillStyle='#9fffc4';g.font='14px "Share Tech Mono",monospace';g.fillText('Preparing map data ...',14,24);return}drawPm()});
/* ---------- Global cameras (data: cams.js) ---------- */
const CAM={on:false,markers:[],mode:'countries',cc:null,sel:null,q:'',live:false};
function camBuild(){const m=[],cnt={};CAM_C.forEach(c=>m.push({t:'c',c,la:c.la,lo:c.lo,lab:c.n+' '+c.c.toLocaleString()}));
  RO_CAMS.forEach((x,i)=>{const ct=RO_CITY[x.city];if(!ct)return;const n=cnt[x.city]=(cnt[x.city]||0)+1,a=n*2.4,rr=.012*Math.sqrt(n);m.push({t:'k',cam:x,i,la:ct[1]+Math.sin(a)*rr,lo:ct[2]+Math.cos(a)*rr*1.4,lab:x.n})});
  RO_MORE.forEach(x=>m.push({t:'m',x,la:x[3],lo:x[4],lab:x[0]+' ('+x[5]+')'}));CAM.markers=m}
const camVis=(m,k)=>m.t==='c'?k<4.5:k>=2.4;
function drawCamM(g,x,y,m,sel){if(m.t==='c'){const r=3+Math.log10(m.c.c+1)*2.2;g.lineWidth=2;g.strokeStyle='#fbbf24';g.fillStyle='rgba(251,191,36,.25)';g.beginPath();g.arc(x,y,r,0,7);g.fill();g.stroke();if(sel){g.strokeStyle='#fff';g.beginPath();g.arc(x,y,r+4,0,7);g.stroke()}return r}
  const live=m.t==='m'||m.cam.live;g.fillStyle=live?'#00ff66':'#00eeff';g.strokeStyle='#000';g.lineWidth=1;g.fillRect(x-3,y-3,7,7);g.strokeRect(x-3,y-3,7,7);if(sel){g.strokeStyle='#fff';g.lineWidth=2;g.strokeRect(x-6,y-6,13,13)}return 5}
function drawCams2(g,X,Y,w,h,v){if(!CAM.on)return;g.font='12px "Share Tech Mono",monospace';
  CAM.markers.forEach(m=>{if(!camVis(m,v.k))return;const x=X(m.lo),y=Y(m.la);if(x<-30||x>w+30||y<-30||y>h+30)return;const r=drawCamM(g,x,y,m,CAM.sel===m);if((m.t==='c'&&v.k>=1.6)||(m.t!=='c'&&v.k>=5))label(g,m.lab,x+r+4,y+4,m.t==='c'?'#fbbf24':'#fff')})}
function drawCams3(g,R,cx,cy){if(!CAM.on)return;const k=pm.z3*2;g.font='12px "Share Tech Mono",monospace';
  CAM.markers.forEach(m=>{if(!camVis(m,k))return;const p=proj(m.la,m.lo);if(p[2]<=.05)return;const x=cx+p[0]*R,y=cy-p[1]*R,r=drawCamM(g,x,y,m,CAM.sel===m);if((m.t==='c'&&pm.z3>=1.1)||(m.t!=='c'&&pm.z3>=1.8))label(g,m.lab,x+r+4,y+4,m.t==='c'?'#fbbf24':'#fff')})}
function camClick(mx,my,w,h){if(!CAM.on)return false;let best=null,bd=196;
  if(pm.mode==='3D'){const R=Math.min(w,h)*.42*pm.z3,cx=w/2,cy=h/2,k=pm.z3*2;CAM.markers.forEach(m=>{if(!camVis(m,k))return;const p=proj(m.la,m.lo);if(p[2]<=.05)return;const d=(cx+p[0]*R-mx)**2+(cy-p[1]*R-my)**2;if(d<bd){bd=d;best=m}})}
  else{const v=pm.view,S=w*v.k,X=lo=>(mX(lo)-v.cx)*S+w/2,Y=la=>(mY(la)-v.cy)*S+h/2;CAM.markers.forEach(m=>{if(!camVis(m,v.k))return;const d=(X(m.lo)-mx)**2+(Y(m.la)-my)**2;if(d<bd){bd=d;best=m}})}
  if(best){camPick(best);return true}return false}
function camFly(la,lo,k){pm.pin=null;pm.fly={cx:mX(lo),cy:mY(la),k};pm.ty=-lo*Math.PI/180;pm.tp=clamp(la*Math.PI/180,-1.2,1.2);pm.spin=false;pm.z3=clamp(k/2.2,1,2.2)}
function camCard(title,sub,url,embed,extra){setH($('camView'),`<div class="card"><div class="big" style="font-size:1.2rem">${esc(title)}</div><div class="sm" style="opacity:.9">${esc(sub)}</div><div class="flex flex-wrap gap-2 mt-1">${embed?`<button class="b" data-embed="${esc(url)}">VIEW HERE</button>`:''}<a class="b" href="${esc(url)}" target="_blank" rel="noopener">${embed?'OPEN CAMERA PAGE':'OPEN LIST'}</a></div><div id="camFrame" class="mt-1"></div>${extra||''}</div>`)}
function camPick(m){if(m.t==='c')camCountry(m.c);else if(m.t==='k')camShow(m.cam);else camMore(m.x,m)}
function camCountry(c){CAM.cc=c.cc;CAM.mode=c.cc==='ro'?'ro':'countries';CAM.sel=CAM.markers.find(m=>m.c===c)||null;camFly(c.la,c.lo,c.cc==='ro'?4:2.5);camRender();$('camSt').textContent=c.cc.toUpperCase();
  camCard(c.n,c.c.toLocaleString()+' webcams'+(c.cc==='ro'?' · '+RO_CAMS.length+' listed here, grouped by city':''),'https://www.see.cam/'+c.cc,false,c.cc==='ro'?'':'<div class="sm mt-1" style="opacity:.85">Individual cameras of this country are listed on its See.Cam page.</div>')}
function camShow(cam){const ct=RO_CITY[cam.city]||[cam.city],m=CAM.markers.find(x=>x.cam===cam);CAM.sel=m||null;if(m)camFly(m.la,m.lo,7);$('camSt').textContent=cam.live?'LIVE':'STILL';
  camCard(cam.n,ct[0]+' · Romania · '+(cam.live?'live stream':'still image'),'https://www.see.cam/ro/'+cam.p,true,'<div class="sm mt-1" style="opacity:.85">Position is the approximate location of the town.</div>')}
function camMore(x,m){CAM.sel=m||null;camFly(x[3],x[4],6);$('camSt').textContent='CITY';camCard(x[0]+', Romania',x[5]+' webcam(s) on See.Cam in this town (not listed one by one here)','https://www.see.cam/ro/'+x[1]+'/'+x[2],false,'')}
function camRender(){const q=CAM.q.trim().toLowerCase();let html='';
  const roBlock=(filter)=>{const by={};RO_CAMS.forEach((x,i)=>{if(CAM.live&&!x.live)return;const ct=RO_CITY[x.city]||[x.city];if(filter&&!(x.n+' '+ct[0]).toLowerCase().includes(filter))return;(by[x.city]=by[x.city]||[]).push([x,i])});
    return Object.keys(by).sort((a,b)=>RO_CITY[a][0].localeCompare(RO_CITY[b][0])).map(k=>'<div class="sm" style="color:var(--c);margin-top:.3rem">'+esc(RO_CITY[k][0])+' ('+by[k].length+')</div>'+by[k].map(([x,i])=>`<div class="camRow" data-cam="${i}"><span class="trunc">${esc(x.n)}</span><span class="badge" style="color:${x.live?'var(--g)':'var(--c)'}">${x.live?'LIVE':'STILL'}</span></div>`).join('')).join('')};
  if(CAM.mode==='ro')html='<div class="camRow" data-back="1"><b>&lt; ALL COUNTRIES</b><span>Romania</span></div>'+roBlock(q);
  else{const rows=CAM_C.filter(c=>!q||c.n.toLowerCase().includes(q)||c.cc===q).sort((a,b)=>b.c-a.c);html=rows.map(c=>`<div class="camRow" data-cc="${c.cc}"><span class="trunc">${esc(c.n)}</span><b style="color:var(--c)">${c.c.toLocaleString()}</b></div>`).join('');
    if(q.length>=2){const r=roBlock(q);if(r)html+='<div class="ttl" style="margin-top:.5rem"><span>Romania cameras</span></div>'+r}if(!html)html='<div>No match.</div>'}
  setH($('camList'),html);$('camCount').textContent=CAM_TOTAL.toLocaleString()+' cameras · '+CAM_C.length+' countries'}
function camToggle(){CAM.on=!CAM.on;if(CAM.on&&!CAM.markers.length)camBuild();$('camPanel').style.display=CAM.on?'':'none';$('camBtn').classList.toggle('on',CAM.on);if(CAM.on){camRender();pm.spin=false}}
$('camQ').addEventListener('input',e=>{CAM.q=e.target.value;camRender()});$('camLive').addEventListener('change',e=>{CAM.live=e.target.checked;camRender()});
$('camList').addEventListener('click',e=>{const t=e.target,c=s=>t.closest&&t.closest(s),cc=c('[data-cc]'),cm=c('[data-cam]'),bk=c('[data-back]');
  if(cc)camCountry(CAM_C.find(x=>x.cc===cc.dataset.cc));else if(cm)camShow(RO_CAMS[+cm.dataset.cam]);else if(bk){CAM.mode='countries';CAM.cc=null;CAM.sel=null;camRender();pm.fly={cx:.5,cy:.45,k:1};pm.z3=1}});
$('camView').addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-embed]');if(b)$('camFrame').innerHTML='<iframe src="'+esc(b.dataset.embed)+'" referrerpolicy="no-referrer" loading="lazy" style="width:100%;height:52vh;border:1px solid rgba(var(--gr),.4);background:#000"></iframe><div class="sm" style="opacity:.85;margin-top:.3rem">If the frame stays blank, the camera site does not allow embedding; use OPEN CAMERA PAGE.</div>'});

ready();
