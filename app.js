 'use strict';
const $=id=>document.getElementById(id),NS='http://www.w3.org/2000/svg';
const {values,calculate,decode}=CircuitModel;
let circuit=calculate(6,20,40,20),port=null,reader=null,session=0,receivedAt=0,connecting=false;
let paused=false,stale=false,lastFrame=0,signature='',routes=[],generators=[];
const phases={current:0,branch1:0,branch3:0};
const controls=['voltage','r1','r3','r2'];
const labelR=r=>r<0?'OPEN':r===1000?'1kΩ':`${r}Ω`;
const num=(n,d=2)=>Number.isFinite(n)?n.toFixed(d):'—';
let statusMessage = $('usbStatus').textContent;
let statusWarning = false;
function status(message,warning=false){statusMessage=message;statusWarning=warning;$('usbStatus').textContent=translate(message);$('usbStatus').classList.toggle('warning',warning);}
function lockControls(){for(const id of controls)$(id).disabled=!!port||connecting;$('connect').disabled=!!port||connecting;$('disconnect').disabled=!port;}
for(const id of ['r1','r2','r3'])for(const r of values){const o=document.createElement('option');o.value=r;o.textContent=labelR(r);$(id).append(o);}
function synchronize(){
 for(const id of controls){
  const control = $(id);
  const value = circuit[id];
  if(id !== 'voltage'){
   control.querySelector('[data-device-value]')?.remove();
   if(!values.includes(value)){
    const option = new Option(labelR(value), value);
    option.dataset.deviceValue = '';
    option.disabled = true;
    option.hidden = true;
    control.append(option);
   }
  }
  control.value = value;
 }
}
function svgNode(tag,attrs,parent){const el=document.createElementNS(NS,tag);for(const [k,v]of Object.entries(attrs))el.setAttribute(k,v);parent.append(el);return el;}
function text(parent,x,y,value,attrs={}){const t=svgNode('text',{x,y,...attrs},parent);t.textContent=translate(value);return t;}
function update(){
 const s=circuit;$('vLabel').textContent=num(s.voltage,1)+' V';$('vValue').textContent=num(s.voltage,1)+' V';
 $('rValue').textContent=s.closed?num(s.equivalent,1)+' Ω':'OPEN';
 $('parallelMeter').hidden = s.r1 < 0 || s.r3 < 0;
 if (s.r1 >= 0 && s.r3 >= 0) {
  const parallelResistance = s.r1 === 0 || s.r3 === 0 ? 0 : s.r1 * s.r3 / (s.r1 + s.r3);
  $('parallelValue').textContent = num(parallelResistance,1)+' Ω';
 }
 $('iValue').textContent=s.shortCircuit?'SHORT':num(s.current)+' A';
 $('notice').textContent=translate(s.shortCircuit?'電源が短絡しています。理想回路の電流は計算できません。':!s.dropsKnown?'両方の回路部分がOPENのため、中間点の電位は決まりません。':!s.branchCurrentsKnown?'並列の両枝が0Ωです。全電流は計算できますが、枝への配分は決まりません。':!s.closed?'OPEN：回路全体の電流は0 Aです。':'');
 const details=$('components');details.replaceChildren();
 for(const [id,title,drop,amps]of [['r1','抵抗1',s.dropParallel,s.branch1],['r2','抵抗2',s.drop2,s.current],['r3','抵抗3',s.dropParallel,s.branch3]]){
  const div=document.createElement('div');div.className='component-detail';const b=document.createElement('b');b.textContent=translate(title)+'　'+labelR(s[id]);div.append(b);
  const known=!s.shortCircuit&&(id==='r2'||s.branchCurrentsKnown);
  const line=document.createElement('div');line.className='reading-line';
  for(const value of [`V: ${s.dropsKnown?num(drop,1):'—'} V`,`I: ${known?num(amps):'—'} A`,`P: ${s.shortCircuit?'—':num(drop*amps)} W`]){
   const item=document.createElement('span');item.textContent=value;line.append(item);
  }
  div.append(line);details.append(div);
 }
 const key=[englishMode,s.voltage,s.r1,s.r2,s.r3,s.dropsKnown,s.shortCircuit,s.branchCurrentsKnown].join(',');
 if(key!==signature){signature=key;buildDiagrams();}
}
const diagramBase = 330;
const heightPerVolt = 29;
function buildDiagrams(){
 routes=[];generators=[];const s=circuit,base=diagramBase,scale=heightPerVolt,y=base-s.voltage*scale,middle=base-s.drop2*scale;
 for(const kind of ['water','electric']){
  const root=$(kind),water=kind==='water';root.replaceChildren();
  // Fixed 0..10 V canvas: voltage changes height, never the drawing's horizontal scale.
  root.setAttribute('viewBox','-72 -16 752 400');
  root.setAttribute('preserveAspectRatio','xMidYMin meet');
  root.style.aspectRatio='752 / 400';
  for(let v=0;v<=s.voltage;v++){
   const yy=base-v*scale;svgNode('line',{x1:65,y1:yy,x2:624,y2:yy,stroke:'#dce8eb','stroke-dasharray':'4 6'},root);
   if(!water)text(root,634,yy+4,`${v} V`,{'font-size':11,fill:'#6b8b98'});
  }
  const background=svgNode('g',{},root),devices=svgNode('g',{},root),particles=svgNode('g',{},root),labels=svgNode('g',{},root);
  function path(d,key){
   svgNode('path',{d,fill:'none',stroke:water?'#4f98a5':'#88a1ab','stroke-width':water?26:4,'stroke-linejoin':'round','stroke-linecap':'round'},background);
   if(water)svgNode('path',{d,fill:'none',stroke:'#e4f5f8','stroke-width':22,'stroke-linejoin':'round'},background);
   const guide=svgNode('path',{d,fill:'none',stroke:'none'},background),length=guide.getTotalLength(),count=Math.max(2,Math.round(length/34));
   const balls=Array.from({length:count},()=>svgNode('circle',{r:water?3:4,fill:'#168ecb'},particles));
   routes.push({guide,length,balls,key,water});
  }
  const seriesOnly = s.r1 === -1 || s.r3 === -1;
  const parallelOnly = !seriesOnly && s.r2 === 0;
  const raisedMerge = parallelOnly && s.dropsKnown && s.dropParallel > 0;
  const mergeY = raisedMerge ? base - Math.min(40,(base-y)/2) : middle;
  const parallelEnd = 450;
  const equalBranchPotential = !seriesOnly && s.dropsKnown && s.dropParallel === 0;
  const branchLane = y + (y > base - 95 ? -65 : 65);
  path(`M ${raisedMerge ? 510 : parallelOnly ? parallelEnd : 600} ${base} H 90 V ${y} H 180`,'current');
  if (seriesOnly) {
   path(`M 180 ${y} H 220 L 600 ${base}`,'current');
  } else if (raisedMerge) {
   path(`M 180 ${y} H 220 L 280 ${mergeY} H 450`,'branch1');
   path(`M 180 ${y} H 340 L 450 ${mergeY}`,'branch3');
   path(`M 450 ${mergeY} L 510 ${base}`,'current');
  } else {
   path(`M 180 ${y} H 220 L 280 ${middle} H ${parallelEnd}`,'branch1');
   if (equalBranchPotential) {
    path(`M 180 ${y} L 210 ${branchLane} H 420 L 450 ${middle}`,'branch3');
   } else {
    path(`M 180 ${y} H 340 L 400 ${middle} H 450`,'branch3');
   }
   if (!parallelOnly) path(`M 450 ${middle} H 500 L 600 ${base}`,'current');
  }
  function resistor(id,x1,yy1,x2,yy2){
   const r=s[id],amps=id==='r1'?s.branch1:id==='r3'?s.branch3:s.current,drop=id==='r2'?s.drop2:s.dropParallel;
   const cx=(x1+x2)/2,cy=(yy1+yy2)/2,angle=Math.atan2(yy2-yy1,x2-x1)*180/Math.PI;
   const g=svgNode('g',{transform:`translate(${cx} ${cy}) rotate(${angle})`},devices);
   if(water){
    const bore=r<0?0:r===0?20:Math.max(2,20*Math.pow(5/r,.4));
    svgNode('rect',{x:-25,y:-16,width:50,height:32,fill:'white'},g);
    if(r>=0)svgNode('path',{d:`M -25 -11 H -18 L -10 ${-bore/2} H 10 L 18 -11 H 25 V 11 H 18 L 10 ${bore/2} H -10 L -18 11 H -25 Z`,fill:'#d1e9e4',stroke:'#4b958e','stroke-width':2},g);
    else {svgNode('path',{d:'M -25 0 H -12 M 12 0 H 25',stroke:'#607e88','stroke-width':3},g);text(g,0,5,'×',{'text-anchor':'middle'});}
   }else{
    const power = drop * amps;
    // Dark gray at 0 W, orange at 1 W, pale orange at 5 W.
    const heat = Math.min(1, power);
    const glow = Math.max(0, Math.min(1, (power - 1) / 4));
    const red = Math.round(94 + 161 * heat);
    const green = Math.round(97 + 35 * heat + 96 * glow);
    const blue = Math.round(103 - 76 * heat + 175 * glow);
    const fill = r < 0 ? '#fff' : `rgb(${red} ${green} ${blue})`;
    svgNode('rect',{x:-23,y:-12,width:46,height:24,rx:4,fill,stroke:power<0.15?'#52565c':'#a75917','stroke-width':2},g);
    if(r<0)text(g,0,5,'×',{'text-anchor':'middle'});
   }
   const power = s.shortCircuit ? null : drop * amps;
   if (water) {
    const unit = svgNode('g',{transform:`translate(${cx+45} ${Math.min(cy+10,346)})`},devices);
    svgNode('path',{d:'M -27 -7 L -14 0',stroke:'#526f7d','stroke-width':2},unit);
    svgNode('circle',{r:14,fill:'#f1fcff',stroke:'#367f99','stroke-width':2},unit);
    const rotor = svgNode('g',{},unit);
    for (const angle of [0,90,180,270]) {
     svgNode('path',{d:'M 0 0 Q -4 -3 -2 -10 Q 4 -11 5 -7 Z',fill:'#168ecb',transform:`rotate(${angle})`},rotor);
    }
    svgNode('circle',{r:2.5,fill:'#173342'},unit);
    generators.push({rotor,angle:0,power});
   }
   const n=id.slice(1);
   const labelOffset = id==='r3' && equalBranchPotential ? (branchLane>y?32:-23) : (id==='r3'&&!parallelOnly&&!seriesOnly?-57:-29);
   const labelY=Math.max(24,cy+labelOffset);
   const displayR=r<0?'OPEN':r===1000?'1k Ω':`${r} Ω`;
   text(labels,cx,water?labelY:labelY-19,`R${n}： ${displayR}`,{'text-anchor':'middle',class:'resistor-label',stroke:'white','stroke-width':5,'paint-order':'stroke fill'});
   if (!water) text(labels,cx,labelY,power===null?'— W':`${num(power)} W`,{'text-anchor':'middle',class:'generator-power',stroke:'white','stroke-width':5,'paint-order':'stroke fill'});
  }
  if (seriesOnly) {
   const firstX = 300;
   const secondX = 460;
   const slopeY = x => y + (base-y)*(x-220)/380;
   const firstResistor = s.r1 === -1 && s.r3 !== -1 ? 'r3' : 'r1';
   if (s[firstResistor] !== 0) resistor(firstResistor,firstX-20,slopeY(firstX-20),firstX+20,slopeY(firstX+20));
   if (s.r2 !== 0) resistor('r2',secondX-20,slopeY(secondX-20),secondX+20,slopeY(secondX+20));
  } else {
   resistor('r1',220,y,280,mergeY);
   if (equalBranchPotential) resistor('r3',290,branchLane,350,branchLane);
   else resistor('r3',340,y,raisedMerge ? 450 : 400,mergeY);
   if (!parallelOnly) resistor('r2',500,middle,600,base);
  }
  if (!seriesOnly) for(const [x,yy]of [[parallelOnly && !equalBranchPotential ? 220 : 180,y],[parallelEnd,mergeY]])svgNode('circle',{cx:x,cy:yy,r:5,fill:'#277c86'},devices);
  const cy=(base+y)/2;svgNode('rect',{x:67,y:cy-28,width:46,height:56,rx:9,fill:water?'#e1f4f8':'#fff1ce',stroke:'#87a5ab','stroke-width':2},devices);
  text(devices,90,cy-6,water?'↑':'＋',{'text-anchor':'middle'});text(devices,90,cy+15,water?'P':'−',{'text-anchor':'middle'});
  text(root,51,cy-7,water?'ポンプ':'電源',{'text-anchor':'end',class:'source-label',stroke:'white','stroke-width':5,'paint-order':'stroke fill'});
  text(root,51,cy+20,water?'高さ（水圧）':`${num(s.voltage,1)} V`,{'text-anchor':'end',class:water?'source-pressure':'source-voltage',stroke:'white','stroke-width':5,'paint-order':'stroke fill'});
  if(water)text(root,51,cy+47,num(s.voltage,1),{'text-anchor':'end',class:'source-voltage',stroke:'white','stroke-width':5,'paint-order':'stroke fill'});
  if (!seriesOnly && !parallelOnly) text(root,water?350:440,middle+30,water?(s.dropsKnown?'合流後の高さ':'高さ不定'):(s.dropsKnown?`${num(s.drop2,1)} V`:'電位不定'),{'font-size':13});
  if (equalBranchPotential) text(root,170,base+47,water?'枝の間隔は模式表示（両端は同じ高さ）':'枝の間隔は模式表示（両端の電位差は0 V）');
  text(root,280,base+27,water?'基準の高さ：エネルギーを渡した後':'0 V：エネルギーを渡した後',{'font-size':13});

 }
}
function animate(now){
 const dt=Math.min(.1,Math.max(0,(now-lastFrame)/1000));lastFrame=now;
 if (!paused && !stale) for (const generator of generators) {
  if (generator.power > 0) {
   generator.angle = (generator.angle + Math.min(480,150*Math.sqrt(generator.power))*dt)%360;
   generator.rotor.setAttribute('transform',`rotate(${generator.angle})`);
  }
 }
 if(!paused&&!stale)for(const key of Object.keys(phases))phases[key]=phases[key]+circuit[key]*40*dt;
 for(const route of routes){
  const amps=circuit[route.key],hidden=amps<=0||stale;
  for(let k=0;k<route.balls.length;k++){
   const ball=route.balls[k];ball.style.display=hidden?'none':'';
   if(hidden)continue;
   const distance=(k*route.length/route.balls.length+phases[route.key])%route.length,p=route.guide.getPointAtLength(distance);
   ball.setAttribute('cx',p.x);ball.setAttribute('cy',p.y);
   if(!route.water){const potential=route.key==='branch3'&&circuit.dropParallel===0?circuit.voltage:Math.max(0,Math.min(10,(diagramBase-p.y)/heightPerVolt)),brightness=.08+.92*potential/10;ball.setAttribute('fill',`rgb(0 ${Math.round(130*brightness)} ${Math.round(255*brightness)})`);}
  }
 }
 requestAnimationFrame(animate);
}
for(const id of controls)$(id).addEventListener(id==='voltage'?'input':'change',()=>{if(port||connecting)return;circuit=calculate(+$('voltage').value,+$('r1').value,+$('r2').value,+$('r3').value);update();});
$('pause').onclick=()=>{paused=!paused;$('pause').textContent=translate(paused?'表示を再生':'表示を一時停止');$('pause').setAttribute('aria-pressed',String(paused));};
function acceptLine(line){const data=decode(line);if(!data)return false;circuit=data;receivedAt=Date.now();stale=false;status('実機連動モード・USB接続中・実機のつまみで操作');$('lastUpdate').textContent=translate('最終受信 ')+new Date(receivedAt).toLocaleTimeString(englishMode?'en-GB':'ja-JP');synchronize();update();return true;}
async function receive(mySession,myPort){
 let buffer='';const decoder=new TextDecoder();
 try{
  while(mySession===session&&myPort.readable){
   reader=myPort.readable.getReader();
   try{while(mySession===session){const {value,done}=await reader.read();if(done)break;buffer+=decoder.decode(value,{stream:true});let pos;while((pos=buffer.indexOf('\n'))>=0){const line=buffer.slice(0,pos).trim();buffer=buffer.slice(pos+1);if(mySession===session)acceptLine(line);}if(buffer.length>8192)buffer='';}}
   finally{reader.releaseLock();reader=null;}
   break;
  }
 }catch(e){if(mySession===session)status('通信が途切れました：'+e.message,true);}
 finally{if(mySession===session)await disconnect('画面操作モード・USB接続が切れました');}
}
async function connect(){
 if(port||connecting)return;connecting=true;lockControls();status('ESP32のUSBポートを選択してください');
 let selected;
 try{selected=await navigator.serial.requestPort();await selected.open({baudRate:115200});port=selected;const token=++session;receivedAt=0;stale=false;status('USB接続済み・実機からのデータを待っています');void receive(token,selected);}
 catch(e){if(selected){try{await selected.close();}catch{}}status(e.name==='NotFoundError'?'画面操作モード・接続をキャンセルしました':'接続できません：'+e.message,e.name!=='NotFoundError');}
 finally{connecting=false;lockControls();}
}
async function disconnect(message='画面操作モード・USBを切断しました'){
 const old=port;if(!old)return;++session;port=null;stale=false;receivedAt=0;
 if(reader){try{await reader.cancel();}catch{}}
 try{await old.close();}catch{}
 lockControls();status(message);$('lastUpdate').textContent='';
}
$('connect').onclick=connect;$('disconnect').onclick=()=>disconnect();
setInterval(()=>{if(!port)return;if(!receivedAt){status('USB接続済み・データ待ち。ESP32の連動版プログラムを確認してください',true);return;}if(Date.now()-receivedAt>2000){stale=true;status('受信が止まっています。数値は最後に受信した値です。',true);}},500);
document.addEventListener('languagechange', () => {
 status(statusMessage, statusWarning);
 $('pause').textContent = translate(paused ? '表示を再生' : '表示を一時停止');
 if (receivedAt) $('lastUpdate').textContent = translate('最終受信 ') + new Date(receivedAt).toLocaleTimeString(englishMode ? 'en-GB' : 'ja-JP');
 update();
});
synchronize();update();requestAnimationFrame(animate);
if(!('serial'in navigator)||!window.isSecureContext){$('connect').disabled=true;status('USB接続にはPC版Chrome / EdgeでHTTPSまたはlocalhostから開いてください。画面だけの操作はできます。',true);}
