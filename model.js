'use strict';
(function(root){
const values=[0,1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,500,1000,-1];
function calculate(voltage,r1,r2,r3){
 const s={voltage,r1,r2,r3,current:0,branch1:0,branch3:0,dropParallel:0,drop2:0,equivalent:0,closed:false,dropsKnown:true,shortCircuit:false,branchCurrentsKnown:true};
 const bypass=r1===0||r3===0,connected=r1>=0||r3>=0,g=(r1>0?1/r1:0)+(r3>0?1/r3:0);
 if(connected&&r2>=0){s.closed=true;const rp=bypass?0:1/g;s.equivalent=rp+r2;
 if(s.equivalent===0){s.shortCircuit=voltage>0;s.dropsKnown=!s.shortCircuit;s.branchCurrentsKnown=!s.shortCircuit;return s;}
 s.current=voltage/s.equivalent;s.dropParallel=s.current*rp;s.drop2=s.current*r2;
 if(r1===0&&r3===0)s.branchCurrentsKnown=s.current===0;
 else if(r1===0)s.branch1=s.current;else if(r3===0)s.branch3=s.current;
 else{s.branch1=r1>0?s.dropParallel/r1:0;s.branch3=r3>0?s.dropParallel/r3:0;}
 }else if(!connected&&r2>=0)s.dropParallel=voltage;else if(connected&&r2<0)s.drop2=voltage;else s.dropsKnown=voltage===0;
 return s;
}
const fields=['voltage','r1','r2','r3','current','branch1','branch3','dropParallel','drop2','equivalent'];
const flags=['closed','dropsKnown','shortCircuit','branchCurrentsKnown'];
function decode(line){
 let s;try{s=JSON.parse(line);}catch{return null;}
 if(!s||s.type!=='circuit'||s.version!==1||!fields.every(k=>typeof s[k]==='number'&&Number.isFinite(s[k]))||!flags.every(k=>typeof s[k]==='boolean'))return null;
 if(!Number.isInteger(s.voltage)||s.voltage<0||s.voltage>10||!['r1','r2','r3'].every(k=>values.includes(s[k]) || s[k] === 300 || s[k] === 400))return null;
 const expected=calculate(s.voltage,s.r1,s.r2,s.r3);
 if(flags.some(k=>s[k]!==expected[k])||fields.some(k=>Math.abs(s[k]-expected[k])>0.002))return null;
 return s;
}
root.CircuitModel={values,calculate,decode};
if(typeof module!=='undefined')module.exports=root.CircuitModel;
})(typeof globalThis!=='undefined'?globalThis:this);
