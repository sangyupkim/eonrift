(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=1e3,t=1001,n=1002,r=1003,i=1004,a=1005,o=1006,s=1007,c=1008,l=1009,u=1010,d=1011,f=1012,p=1013,m=1014,h=1015,g=1016,_=1017,v=1018,y=1020,b=35902,x=35899,S=1021,C=1022,w=1023,T=1026,E=1027,D=1028,O=1029,k=1030,A=1031,ee=1033,j=33776,te=33777,M=33778,ne=33779,N=35840,re=35841,ie=35842,ae=35843,oe=36196,se=37492,ce=37496,le=37488,P=37489,ue=37490,de=37491,fe=37808,pe=37809,me=37810,he=37811,ge=37812,_e=37813,ve=37814,ye=37815,be=37816,xe=37817,Se=37818,Ce=37819,we=37820,Te=37821,Ee=36492,De=36494,Oe=36495,ke=36283,Ae=36284,je=36285,Me=36286,Ne=2300,F=2301,Pe=2302,Fe=2303,Ie=2400,I=2401,Le=2402,L=3200,Re=`srgb`,R=`srgb-linear`,ze=`linear`,Be=`srgb`,Ve=7680,He=35044,Ue=35048,We=2e3;function Ge(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function Ke(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function qe(e){return document.createElementNS(`http://www.w3.org/1999/xhtml`,e)}function Je(){let e=qe(`canvas`);return e.style.display=`block`,e}var Ye={};function Xe(...e){let t=`THREE.`+e.shift();console.log(t,...e)}function Ze(e){let t=e[0];if(typeof t==`string`&&t.startsWith(`TSL:`)){let t=e[1];t&&t.isStackTrace?e[0]+=` `+t.getLocation():e[1]=`Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.`}return e}function z(...e){e=Ze(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.warn(n.getError(t)):console.warn(t,...e)}}function B(...e){e=Ze(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.error(n.getError(t)):console.error(t,...e)}}function Qe(...e){let t=e.join(` `);t in Ye||(Ye[t]=!0,z(...e))}function $e(e,t,n){return new Promise(function(r,i){function a(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:i();break;case e.TIMEOUT_EXPIRED:setTimeout(a,n);break;default:r()}}setTimeout(a,n)})}var et={0:1,2:6,4:7,3:5,1:0,6:2,7:4,5:3},tt=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n!==void 0&&n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let r=n[e];if(r!==void 0){let e=r.indexOf(t);e!==-1&&r.splice(e,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let t=n.slice(0);for(let n=0,r=t.length;n<r;n++)t[n].call(this,e);e.target=null}}},nt=`00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff`.split(`.`),rt=Math.PI/180,it=180/Math.PI;function at(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(nt[e&255]+nt[e>>8&255]+nt[e>>16&255]+nt[e>>24&255]+`-`+nt[t&255]+nt[t>>8&255]+`-`+nt[t>>16&15|64]+nt[t>>24&255]+`-`+nt[n&63|128]+nt[n>>8&255]+`-`+nt[n>>16&255]+nt[n>>24&255]+nt[r&255]+nt[r>>8&255]+nt[r>>16&255]+nt[r>>24&255]).toLowerCase()}function V(e,t,n){return Math.max(t,Math.min(n,e))}function ot(e,t){return(e%t+t)%t}function st(e,t,n){return(1-n)*e+n*t}function ct(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:case Uint8ClampedArray:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}function lt(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}var H=class e{static{e.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error(`THREE.Vector2: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error(`THREE.Vector2: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=V(this.x,e.x,t.x),this.y=V(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=V(this.x,e,t),this.y=V(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(V(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(V(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),i=this.x-e.x,a=this.y-e.y;return this.x=i*n-a*r+e.x,this.y=i*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},ut=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,i,a,o){let s=n[r+0],c=n[r+1],l=n[r+2],u=n[r+3],d=i[a+0],f=i[a+1],p=i[a+2],m=i[a+3];if(u!==m||s!==d||c!==f||l!==p){let e=s*d+c*f+l*p+u*m;e<0&&(d=-d,f=-f,p=-p,m=-m,e=-e);let t=1-o;if(e<.9995){let n=Math.acos(e),r=Math.sin(n);t=Math.sin(t*n)/r,o=Math.sin(o*n)/r,s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o}else{s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o;let e=1/Math.sqrt(s*s+c*c+l*l+u*u);s*=e,c*=e,l*=e,u*=e}}e[t]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,i,a){let o=n[r],s=n[r+1],c=n[r+2],l=n[r+3],u=i[a],d=i[a+1],f=i[a+2],p=i[a+3];return e[t]=o*p+l*u+s*f-c*d,e[t+1]=s*p+l*d+c*u-o*f,e[t+2]=c*p+l*f+o*d-s*u,e[t+3]=l*p-o*u-s*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,i=e._z,a=e._order,o=Math.cos,s=Math.sin,c=o(n/2),l=o(r/2),u=o(i/2),d=s(n/2),f=s(r/2),p=s(i/2);switch(a){case`XYZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`YXZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`ZXY`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`ZYX`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`YZX`:this._x=d*l*u+c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u-d*f*p;break;case`XZY`:this._x=d*l*u-c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u+d*f*p;break;default:z(`Quaternion: .setFromEuler() encountered an unknown order: `+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],i=t[8],a=t[1],o=t[5],s=t[9],c=t[2],l=t[6],u=t[10],d=n+o+u;if(d>0){let e=.5/Math.sqrt(d+1);this._w=.25/e,this._x=(l-s)*e,this._y=(i-c)*e,this._z=(a-r)*e}else if(n>o&&n>u){let e=2*Math.sqrt(1+n-o-u);this._w=(l-s)/e,this._x=.25*e,this._y=(r+a)/e,this._z=(i+c)/e}else if(o>u){let e=2*Math.sqrt(1+o-n-u);this._w=(i-c)/e,this._x=(r+a)/e,this._y=.25*e,this._z=(s+l)/e}else{let e=2*Math.sqrt(1+u-n-o);this._w=(a-r)/e,this._x=(i+c)/e,this._y=(s+l)/e,this._z=.25*e}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(V(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x*=e,this._y*=e,this._z*=e,this._w*=e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=t._x,s=t._y,c=t._z,l=t._w;return this._x=n*l+a*o+r*c-i*s,this._y=r*l+a*s+i*o-n*c,this._z=i*l+a*c+n*s-r*o,this._w=a*l-n*o-r*s-i*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,r=-r,i=-i,a=-a,o=-o);let s=1-t;if(o<.9995){let e=Math.acos(o),c=Math.sin(e);s=Math.sin(s*e)/c,t=Math.sin(t*e)/c,this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this._onChangeCallback()}else this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),i=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),i*Math.sin(t),i*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},U=class e{static{e.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error(`THREE.Vector3: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error(`THREE.Vector3: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(ft.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(ft.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6]*r,this.y=i[1]*t+i[4]*n+i[7]*r,this.z=i[2]*t+i[5]*n+i[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=e.elements,a=1/(i[3]*t+i[7]*n+i[11]*r+i[15]);return this.x=(i[0]*t+i[4]*n+i[8]*r+i[12])*a,this.y=(i[1]*t+i[5]*n+i[9]*r+i[13])*a,this.z=(i[2]*t+i[6]*n+i[10]*r+i[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,i=e.x,a=e.y,o=e.z,s=e.w,c=2*(a*r-o*n),l=2*(o*t-i*r),u=2*(i*n-a*t);return this.x=t+s*c+a*u-o*l,this.y=n+s*l+o*c-i*u,this.z=r+s*u+i*l-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[4]*n+i[8]*r,this.y=i[1]*t+i[5]*n+i[9]*r,this.z=i[2]*t+i[6]*n+i[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=V(this.x,e.x,t.x),this.y=V(this.y,e.y,t.y),this.z=V(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=V(this.x,e,t),this.y=V(this.y,e,t),this.z=V(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(V(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,i=e.z,a=t.x,o=t.y,s=t.z;return this.x=r*s-i*o,this.y=i*a-n*s,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return dt.copy(this).projectOnVector(e),this.sub(dt)}reflect(e){return this.sub(dt.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(V(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},dt=new U,ft=new ut,W=class e{static{e.prototype.isMatrix3=!0}constructor(e,t,n,r,i,a,o,s,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c)}set(e,t,n,r,i,a,o,s,c){let l=this.elements;return l[0]=e,l[1]=r,l[2]=o,l[3]=t,l[4]=i,l[5]=s,l[6]=n,l[7]=a,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[3],s=n[6],c=n[1],l=n[4],u=n[7],d=n[2],f=n[5],p=n[8],m=r[0],h=r[3],g=r[6],_=r[1],v=r[4],y=r[7],b=r[2],x=r[5],S=r[8];return i[0]=a*m+o*_+s*b,i[3]=a*h+o*v+s*x,i[6]=a*g+o*y+s*S,i[1]=c*m+l*_+u*b,i[4]=c*h+l*v+u*x,i[7]=c*g+l*y+u*S,i[2]=d*m+f*_+p*b,i[5]=d*h+f*v+p*x,i[8]=d*g+f*y+p*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8];return t*a*l-t*o*c-n*i*l+n*o*s+r*i*c-r*a*s}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=l*a-o*c,d=o*s-l*i,f=c*i-a*s,p=t*u+n*d+r*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=u*m,e[1]=(r*c-l*n)*m,e[2]=(o*n-r*a)*m,e[3]=d*m,e[4]=(l*t-r*s)*m,e[5]=(r*i-o*t)*m,e[6]=f*m,e[7]=(n*s-c*t)*m,e[8]=(a*t-n*i)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,i,a,o){let s=Math.cos(i),c=Math.sin(i);return this.set(n*s,n*c,-n*(s*a+c*o)+a+e,-r*c,r*s,-r*(-c*a+s*o)+o+t,0,0,1),this}scale(e,t){return Qe(`Matrix3: .scale() is deprecated. Use .makeScale() instead.`),this.premultiply(pt.makeScale(e,t)),this}rotate(e){return Qe(`Matrix3: .rotate() is deprecated. Use .makeRotation() instead.`),this.premultiply(pt.makeRotation(-e)),this}translate(e,t){return Qe(`Matrix3: .translate() is deprecated. Use .makeTranslation() instead.`),this.premultiply(pt.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<9;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},pt=new W,mt=new W().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),ht=new W().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function gt(){let e={enabled:!0,workingColorSpace:R,spaces:{},convert:function(e,t,n){return this.enabled===!1||t===n||!t||!n?e:(this.spaces[t].transfer===`srgb`&&(e.r=_t(e.r),e.g=_t(e.g),e.b=_t(e.b)),this.spaces[t].primaries!==this.spaces[n].primaries&&(e.applyMatrix3(this.spaces[t].toXYZ),e.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===`srgb`&&(e.r=vt(e.r),e.g=vt(e.g),e.b=vt(e.b)),e)},workingToColorSpace:function(e,t){return this.convert(e,this.workingColorSpace,t)},colorSpaceToWorking:function(e,t){return this.convert(e,t,this.workingColorSpace)},getPrimaries:function(e){return this.spaces[e].primaries},getTransfer:function(e){return e===``?ze:this.spaces[e].transfer},getToneMappingMode:function(e){return this.spaces[e].outputColorSpaceConfig.toneMappingMode||`standard`},getLuminanceCoefficients:function(e,t=this.workingColorSpace){return e.fromArray(this.spaces[t].luminanceCoefficients)},define:function(e){Object.assign(this.spaces,e)},_getMatrix:function(e,t,n){return e.copy(this.spaces[t].toXYZ).multiply(this.spaces[n].fromXYZ)},_getDrawingBufferColorSpace:function(e){return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(e=this.workingColorSpace){return this.spaces[e].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(t,n){return Qe(`ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace().`),e.workingToColorSpace(t,n)},toWorkingColorSpace:function(t,n){return Qe(`ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking().`),e.colorSpaceToWorking(t,n)}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],r=[.3127,.329];return e.define({[R]:{primaries:t,whitePoint:r,transfer:ze,toXYZ:mt,fromXYZ:ht,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:Re},outputColorSpaceConfig:{drawingBufferColorSpace:Re}},[Re]:{primaries:t,whitePoint:r,transfer:Be,toXYZ:mt,fromXYZ:ht,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:Re}}}),e}var G=gt();function _t(e){return e<.04045?e*.0773993808:(e*.9478672986+.0521327014)**2.4}function vt(e){return e<.0031308?e*12.92:1.055*e**.41666-.055}var yt,bt=class{static getDataURL(e,t=`image/png`){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>`u`)return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{yt===void 0&&(yt=qe(`canvas`)),yt.width=e.width,yt.height=e.height;let t=yt.getContext(`2d`);e instanceof ImageData?t.putImageData(e,0,0):t.drawImage(e,0,0,e.width,e.height),n=yt}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap){let t=qe(`canvas`);t.width=e.width,t.height=e.height;let n=t.getContext(`2d`);n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),i=r.data;for(let e=0;e<i.length;e++)i[e]=_t(i[e]/255)*255;return n.putImageData(r,0,0),t}if(e.data){let t=e.data.slice(0);for(let e=0;e<t.length;e++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[e]=Math.floor(_t(t[e]/255)*255):t[e]=_t(t[e]);return{data:t,width:e.width,height:e.height}}return z(`ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.`),e}},xt=0,St=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:xt++}),this.uuid=at(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<`u`&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<`u`&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t===null?e.set(0,0,0):e.set(t.width,t.height,t.depth||0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:``},r=this.data;if(r!==null){let e;if(Array.isArray(r)){e=[];for(let t=0,n=r.length;t<n;t++)r[t].isDataTexture?e.push(Ct(r[t].image)):e.push(Ct(r[t]))}else e=Ct(r);n.url=e}return t||(e.images[this.uuid]=n),n}};function Ct(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap?bt.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(z(`Texture: Unable to serialize Texture.`),{})}var wt=0,Tt=new U,Et=class r extends tt{constructor(e=r.DEFAULT_IMAGE,n=r.DEFAULT_MAPPING,i=t,a=t,s=o,u=c,d=w,f=l,p=r.DEFAULT_ANISOTROPY,m=``){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:wt++}),this.uuid=at(),this.name=``,this.source=new St(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=a,this.magFilter=s,this.minFilter=u,this.anisotropy=p,this.format=d,this.internalFormat=null,this.type=f,this.offset=new H(0,0),this.repeat=new H(1,1),this.center=new H(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new W,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=m,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Tt).x}get height(){return this.source.getSize(Tt).y}get depth(){return this.source.getSize(Tt).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){z(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){z(`Texture.setValues(): property '${t}' does not exist.`);continue}r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:`Texture`,generator:`Texture.toJSON`},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:`dispose`})}transformUv(r){if(this.mapping!==300)return r;if(r.applyMatrix3(this.matrix),r.x<0||r.x>1)switch(this.wrapS){case e:r.x-=Math.floor(r.x);break;case t:r.x=r.x<0?0:1;break;case n:Math.abs(Math.floor(r.x)%2)===1?r.x=Math.ceil(r.x)-r.x:r.x-=Math.floor(r.x)}if(r.y<0||r.y>1)switch(this.wrapT){case e:r.y-=Math.floor(r.y);break;case t:r.y=r.y<0?0:1;break;case n:Math.abs(Math.floor(r.y)%2)===1?r.y=Math.ceil(r.y)-r.y:r.y-=Math.floor(r.y)}return this.flipY&&(r.y=1-r.y),r}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Et.DEFAULT_IMAGE=null,Et.DEFAULT_MAPPING=300,Et.DEFAULT_ANISOTROPY=1;var Dt=class e{static{e.prototype.isVector4=!0}constructor(e=0,t=0,n=0,r=1){this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error(`THREE.Vector4: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error(`THREE.Vector4: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w===void 0?1:e.w,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*i,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*i,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*i,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*i,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,i,a=.01,o=.1,s=e.elements,c=s[0],l=s[4],u=s[8],d=s[1],f=s[5],p=s[9],m=s[2],h=s[6],g=s[10];if(Math.abs(l-d)<a&&Math.abs(u-m)<a&&Math.abs(p-h)<a){if(Math.abs(l+d)<o&&Math.abs(u+m)<o&&Math.abs(p+h)<o&&Math.abs(c+f+g-3)<o)return this.set(1,0,0,0),this;t=Math.PI;let e=(c+1)/2,s=(f+1)/2,_=(g+1)/2,v=(l+d)/4,y=(u+m)/4,b=(p+h)/4;return e>s&&e>_?e<a?(n=0,r=.707106781,i=.707106781):(n=Math.sqrt(e),r=v/n,i=y/n):s>_?s<a?(n=.707106781,r=0,i=.707106781):(r=Math.sqrt(s),n=v/r,i=b/r):_<a?(n=.707106781,r=.707106781,i=0):(i=Math.sqrt(_),n=y/i,r=b/i),this.set(n,r,i,t),this}let _=Math.sqrt((h-p)*(h-p)+(u-m)*(u-m)+(d-l)*(d-l));return Math.abs(_)<.001&&(_=1),this.x=(h-p)/_,this.y=(u-m)/_,this.z=(d-l)/_,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=V(this.x,e.x,t.x),this.y=V(this.y,e.y,t.y),this.z=V(this.z,e.z,t.z),this.w=V(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=V(this.x,e,t),this.y=V(this.y,e,t),this.z=V(this.z,e,t),this.w=V(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(V(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Ot=class extends tt{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:o,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Dt(0,0,e,t),this.scissorTest=!1,this.viewport=new Dt(0,0,e,t),this.textures=[];let r=new Et({width:e,height:t,depth:n.depth}),i=n.count;for(let e=0;e<i;e++)this.textures[e]=r.clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:o,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let e=0;e<this.textures.length;e++)this.textures[e].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,i=this.textures.length;r<i;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let n=Object.assign({},e.textures[t].image);this.textures[t].source=new St(n)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null){if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture}return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:`dispose`})}},kt=class extends Ot{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},At=class extends Et{constructor(e=null,n=1,i=1,a=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:n,height:i,depth:a},this.magFilter=r,this.minFilter=r,this.wrapR=t,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},jt=class extends Et{constructor(e=null,n=1,i=1,a=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:n,height:i,depth:a},this.magFilter=r,this.minFilter=r,this.wrapR=t,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}},Mt=class e{static{e.prototype.isMatrix4=!0}constructor(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h)}set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=r,g[1]=i,g[5]=a,g[9]=o,g[13]=s,g[2]=c,g[6]=l,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=m,g[15]=h,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,r=1/Nt.setFromMatrixColumn(e,0).length(),i=1/Nt.setFromMatrixColumn(e,1).length(),a=1/Nt.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*i,t[5]=n[5]*i,t[6]=n[6]*i,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,i=e.z,a=Math.cos(n),o=Math.sin(n),s=Math.cos(r),c=Math.sin(r),l=Math.cos(i),u=Math.sin(i);if(e.order===`XYZ`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=-s*u,t[8]=c,t[1]=n+r*c,t[5]=e-i*c,t[9]=-o*s,t[2]=i-e*c,t[6]=r+n*c,t[10]=a*s}else if(e.order===`YXZ`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e+i*o,t[4]=r*o-n,t[8]=a*c,t[1]=a*u,t[5]=a*l,t[9]=-o,t[2]=n*o-r,t[6]=i+e*o,t[10]=a*s}else if(e.order===`ZXY`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e-i*o,t[4]=-a*u,t[8]=r+n*o,t[1]=n+r*o,t[5]=a*l,t[9]=i-e*o,t[2]=-a*c,t[6]=o,t[10]=a*s}else if(e.order===`ZYX`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=r*c-n,t[8]=e*c+i,t[1]=s*u,t[5]=i*c+e,t[9]=n*c-r,t[2]=-c,t[6]=o*s,t[10]=a*s}else if(e.order===`YZX`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=i-e*u,t[8]=r*u+n,t[1]=u,t[5]=a*l,t[9]=-o*l,t[2]=-c*l,t[6]=n*u+r,t[10]=e-i*u}else if(e.order===`XZY`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=-u,t[8]=c*l,t[1]=e*u+i,t[5]=a*l,t[9]=n*u-r,t[2]=r*u-n,t[6]=o*l,t[10]=i*u+e}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Ft,e,It)}lookAt(e,t,n){let r=this.elements;return zt.subVectors(e,t),zt.lengthSq()===0&&(zt.z=1),zt.normalize(),Lt.crossVectors(n,zt),Lt.lengthSq()===0&&(Math.abs(n.z)===1?zt.x+=1e-4:zt.z+=1e-4,zt.normalize(),Lt.crossVectors(n,zt)),Lt.normalize(),Rt.crossVectors(zt,Lt),r[0]=Lt.x,r[4]=Rt.x,r[8]=zt.x,r[1]=Lt.y,r[5]=Rt.y,r[9]=zt.y,r[2]=Lt.z,r[6]=Rt.z,r[10]=zt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[4],s=n[8],c=n[12],l=n[1],u=n[5],d=n[9],f=n[13],p=n[2],m=n[6],h=n[10],g=n[14],_=n[3],v=n[7],y=n[11],b=n[15],x=r[0],S=r[4],C=r[8],w=r[12],T=r[1],E=r[5],D=r[9],O=r[13],k=r[2],A=r[6],ee=r[10],j=r[14],te=r[3],M=r[7],ne=r[11],N=r[15];return i[0]=a*x+o*T+s*k+c*te,i[4]=a*S+o*E+s*A+c*M,i[8]=a*C+o*D+s*ee+c*ne,i[12]=a*w+o*O+s*j+c*N,i[1]=l*x+u*T+d*k+f*te,i[5]=l*S+u*E+d*A+f*M,i[9]=l*C+u*D+d*ee+f*ne,i[13]=l*w+u*O+d*j+f*N,i[2]=p*x+m*T+h*k+g*te,i[6]=p*S+m*E+h*A+g*M,i[10]=p*C+m*D+h*ee+g*ne,i[14]=p*w+m*O+h*j+g*N,i[3]=_*x+v*T+y*k+b*te,i[7]=_*S+v*E+y*A+b*M,i[11]=_*C+v*D+y*ee+b*ne,i[15]=_*w+v*O+y*j+b*N,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[12],a=e[1],o=e[5],s=e[9],c=e[13],l=e[2],u=e[6],d=e[10],f=e[14],p=e[3],m=e[7],h=e[11],g=e[15],_=s*f-c*d,v=o*f-c*u,y=o*d-s*u,b=a*f-c*l,x=a*d-s*l,S=a*u-o*l;return t*(m*_-h*v+g*y)-n*(p*_-h*b+g*x)+r*(p*v-m*b+g*S)-i*(p*y-m*x+h*S)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[1],a=e[5],o=e[9],s=e[2],c=e[6],l=e[10];return t*(a*l-o*c)-n*(i*l-o*s)+r*(i*c-a*s)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=e[9],d=e[10],f=e[11],p=e[12],m=e[13],h=e[14],g=e[15],_=t*o-n*a,v=t*s-r*a,y=t*c-i*a,b=n*s-r*o,x=n*c-i*o,S=r*c-i*s,C=l*m-u*p,w=l*h-d*p,T=l*g-f*p,E=u*h-d*m,D=u*g-f*m,O=d*g-f*h,k=_*O-v*D+y*E+b*T-x*w+S*C;if(k===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/k;return e[0]=(o*O-s*D+c*E)*A,e[1]=(r*D-n*O-i*E)*A,e[2]=(m*S-h*x+g*b)*A,e[3]=(d*x-u*S-f*b)*A,e[4]=(s*T-a*O-c*w)*A,e[5]=(t*O-r*T+i*w)*A,e[6]=(h*y-p*S-g*v)*A,e[7]=(l*S-d*y+f*v)*A,e[8]=(a*D-o*T+c*C)*A,e[9]=(n*T-t*D-i*C)*A,e[10]=(p*x-m*y+g*_)*A,e[11]=(u*y-l*x-f*_)*A,e[12]=(o*w-a*E-s*C)*A,e[13]=(t*E-n*w+r*C)*A,e[14]=(m*v-p*b-h*_)*A,e[15]=(l*b-u*v+d*_)*A,this}scale(e){let t=this.elements,n=e.x,r=e.y,i=e.z;return t[0]*=n,t[4]*=r,t[8]*=i,t[1]*=n,t[5]*=r,t[9]*=i,t[2]*=n,t[6]*=r,t[10]*=i,t[3]*=n,t[7]*=r,t[11]*=i,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),i=1-n,a=e.x,o=e.y,s=e.z,c=i*a,l=i*o;return this.set(c*a+n,c*o-r*s,c*s+r*o,0,c*o+r*s,l*o+n,l*s-r*a,0,c*s-r*o,l*s+r*a,i*s*s+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,i,a){return this.set(1,n,i,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,i=t._x,a=t._y,o=t._z,s=t._w,c=i+i,l=a+a,u=o+o,d=i*c,f=i*l,p=i*u,m=a*l,h=a*u,g=o*u,_=s*c,v=s*l,y=s*u,b=n.x,x=n.y,S=n.z;return r[0]=(1-(m+g))*b,r[1]=(f+y)*b,r[2]=(p-v)*b,r[3]=0,r[4]=(f-y)*x,r[5]=(1-(d+g))*x,r[6]=(h+_)*x,r[7]=0,r[8]=(p+v)*S,r[9]=(h-_)*S,r[10]=(1-(d+m))*S,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let i=this.determinantAffine();if(i===0)return n.set(1,1,1),t.identity(),this;let a=Nt.set(r[0],r[1],r[2]).length(),o=Nt.set(r[4],r[5],r[6]).length(),s=Nt.set(r[8],r[9],r[10]).length();i<0&&(a=-a),Pt.copy(this);let c=1/a,l=1/o,u=1/s;return Pt.elements[0]*=c,Pt.elements[1]*=c,Pt.elements[2]*=c,Pt.elements[4]*=l,Pt.elements[5]*=l,Pt.elements[6]*=l,Pt.elements[8]*=u,Pt.elements[9]*=u,Pt.elements[10]*=u,t.setFromRotationMatrix(Pt),n.x=a,n.y=o,n.z=s,this}makePerspective(e,t,n,r,i,a,o=We,s=!1){let c=this.elements,l=2*i/(t-e),u=2*i/(n-r),d=(t+e)/(t-e),f=(n+r)/(n-r),p,m;if(s)p=i/(a-i),m=a*i/(a-i);else if(o===2e3)p=-(a+i)/(a-i),m=-2*a*i/(a-i);else if(o===2001)p=-a/(a-i),m=-a*i/(a-i);else throw Error(`THREE.Matrix4.makePerspective(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,i,a,o=We,s=!1){let c=this.elements,l=2/(t-e),u=2/(n-r),d=-(t+e)/(t-e),f=-(n+r)/(n-r),p,m;if(s)p=1/(a-i),m=a/(a-i);else if(o===2e3)p=-2/(a-i),m=-(a+i)/(a-i);else if(o===2001)p=-1/(a-i),m=-i/(a-i);else throw Error(`THREE.Matrix4.makeOrthographic(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<16;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Nt=new U,Pt=new Mt,Ft=new U(0,0,0),It=new U(1,1,1),Lt=new U,Rt=new U,zt=new U,Bt=new Mt,Vt=new ut,Ht=class e{constructor(t=0,n=0,r=0,i=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=r,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,i=r[0],a=r[4],o=r[8],s=r[1],c=r[5],l=r[9],u=r[2],d=r[6],f=r[10];switch(t){case`XYZ`:this._y=Math.asin(V(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-a,i)):(this._x=Math.atan2(d,c),this._z=0);break;case`YXZ`:this._x=Math.asin(-V(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(s,c)):(this._y=Math.atan2(-u,i),this._z=0);break;case`ZXY`:this._x=Math.asin(V(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(s,i));break;case`ZYX`:this._y=Math.asin(-V(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(s,i)):(this._x=0,this._z=Math.atan2(-a,c));break;case`YZX`:this._z=Math.asin(V(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-u,i)):(this._x=0,this._y=Math.atan2(o,f));break;case`XZY`:this._z=Math.asin(-V(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,i)):(this._x=Math.atan2(-l,f),this._y=0);break;default:z(`Euler: .setFromRotationMatrix() encountered an unknown order: `+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Bt.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Bt,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Vt.setFromEuler(this),this.setFromQuaternion(Vt,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Ht.DEFAULT_ORDER=`XYZ`;var Ut=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return!!(this.mask&(1<<e|0))}},Wt=0,Gt=new U,Kt=new ut,qt=new Mt,Jt=new U,Yt=new U,Xt=new U,Zt=new ut,Qt=new U(1,0,0),$t=new U(0,1,0),en=new U(0,0,1),tn={type:`added`},nn={type:`removed`},rn={type:`childadded`,child:null},an={type:`childremoved`,child:null},on=class e extends tt{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Wt++}),this.uuid=at(),this.name=``,this.type=`Object3D`,this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new U,n=new Ht,r=new ut,i=new U(1,1,1);function a(){r.setFromEuler(n,!1)}function o(){n.setFromQuaternion(r,void 0,!1)}n._onChange(a),r._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Mt},normalMatrix:{value:new W}}),this.matrix=new Mt,this.matrixWorld=new Mt,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ut,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Kt.setFromAxisAngle(e,t),this.quaternion.multiply(Kt),this}rotateOnWorldAxis(e,t){return Kt.setFromAxisAngle(e,t),this.quaternion.premultiply(Kt),this}rotateX(e){return this.rotateOnAxis(Qt,e)}rotateY(e){return this.rotateOnAxis($t,e)}rotateZ(e){return this.rotateOnAxis(en,e)}translateOnAxis(e,t){return Gt.copy(e).applyQuaternion(this.quaternion),this.position.add(Gt.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Qt,e)}translateY(e){return this.translateOnAxis($t,e)}translateZ(e){return this.translateOnAxis(en,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(qt.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Jt.copy(e):Jt.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),Yt.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?qt.lookAt(Yt,Jt,this.up):qt.lookAt(Jt,Yt,this.up),this.quaternion.setFromRotationMatrix(qt),r&&(qt.extractRotation(r.matrixWorld),Kt.setFromRotationMatrix(qt),this.quaternion.premultiply(Kt.invert()))}add(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return e===this?(B(`Object3D.add: object can't be added as a child of itself.`,e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(tn),rn.child=e,this.dispatchEvent(rn),rn.child=null):B(`Object3D.add: object not an instance of THREE.Object3D.`,e),this)}remove(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.remove(arguments[e]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(nn),an.child=e,this.dispatchEvent(an),an.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),qt.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),qt.multiply(e.parent.matrixWorld)),e.applyMatrix4(qt),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(tn),rn.child=e,this.dispatchEvent(rn),rn.child=null,this}getObjectById(e){return this.getObjectByProperty(`id`,e)}getObjectByName(e){return this.getObjectByProperty(`name`,e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Yt,e,Xt),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Yt,Zt,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,r=e.z,i=this.matrix.elements;i[12]+=t-i[0]*t-i[4]*n-i[8]*r,i[13]+=n-i[1]*t-i[5]*n-i[9]*r,i[14]+=r-i[2]*t-i[6]*n-i[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let e=this.children;for(let t=0,r=e.length;t<r;t++)e[t].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e==`string`,n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:`Object`,generator:`Object3D.toJSON`});let r={};r.uuid=this.uuid,r.type=this.type,r.name=this.name,r.castShadow=this.castShadow,r.receiveShadow=this.receiveShadow,r.visible=this.visible,r.frustumCulled=this.frustumCulled,r.renderOrder=this.renderOrder,r.static=this.static,r.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type=`InstancedMesh`,r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type=`BatchedMesh`,r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox?e.boundingBox.toJSON():void 0,boundingSphere:e.boundingSphere?e.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(e=>({...e})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function i(t,n){return t[n.uuid]===void 0&&(t[n.uuid]=n.toJSON(e)),n.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=i(e.geometries,this.geometry);let t=this.geometry.parameters;if(t!==void 0&&t.shapes!==void 0){let n=t.shapes;if(Array.isArray(n))for(let t=0,r=n.length;t<r;t++){let r=n[t];i(e.shapes,r)}else i(e.shapes,n)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(i(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0){if(Array.isArray(this.material)){let t=[];for(let n=0,r=this.material.length;n<r;n++)t.push(i(e.materials,this.material[n]));r.material=t}else r.material=i(e.materials,this.material)}if(this.children.length>0){r.children=[];for(let t=0;t<this.children.length;t++)r.children.push(this.children[t].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let t=0;t<this.animations.length;t++){let n=this.animations[t];r.animations.push(i(e.animations,n))}}if(t){let t=a(e.geometries),r=a(e.materials),i=a(e.textures),o=a(e.images),s=a(e.shapes),c=a(e.skeletons),l=a(e.animations),u=a(e.nodes);t.length>0&&(n.geometries=t),r.length>0&&(n.materials=r),i.length>0&&(n.textures=i),o.length>0&&(n.images=o),s.length>0&&(n.shapes=s),c.length>0&&(n.skeletons=c),l.length>0&&(n.animations=l),u.length>0&&(n.nodes=u)}return n.object=r,n;function a(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot===null?null:e.pivot.clone(),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let t=0;t<e.children.length;t++){let n=e.children[t];this.add(n.clone())}return this}dispose(){this.dispatchEvent({type:`dispose`})}};on.DEFAULT_UP=new U(0,1,0),on.DEFAULT_MATRIX_AUTO_UPDATE=!0,on.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var sn=class extends on{constructor(){super(),this.isGroup=!0,this.type=`Group`}},cn={type:`move`},ln=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new sn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new sn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new U,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new U),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new sn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new U,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new U,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:`connected`,data:e}),this}disconnect(e){return this.dispatchEvent({type:`disconnected`,data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,i=null,a=null,o=this._targetRay,s=this._grip,c=this._hand;if(e&&t.session.visibilityState!==`visible-blurred`){if(c&&e.hand){a=!0;for(let r of e.hand.values()){let e=t.getJointPose(r,n),i=this._getHandJoint(c,r);e!==null&&(i.matrix.fromArray(e.transform.matrix),i.matrix.decompose(i.position,i.rotation,i.scale),i.matrixWorldNeedsUpdate=!0,i.jointRadius=e.radius),i.visible=e!==null}let r=c.joints[`index-finger-tip`],i=c.joints[`thumb-tip`],o=r.position.distanceTo(i.position);c.inputState.pinching&&o>.025?(c.inputState.pinching=!1,this.dispatchEvent({type:`pinchend`,handedness:e.handedness,target:this})):!c.inputState.pinching&&o<=.015&&(c.inputState.pinching=!0,this.dispatchEvent({type:`pinchstart`,handedness:e.handedness,target:this}))}else s!==null&&e.gripSpace&&(i=t.getPose(e.gripSpace,n),i!==null&&(s.matrix.fromArray(i.transform.matrix),s.matrix.decompose(s.position,s.rotation,s.scale),s.matrixWorldNeedsUpdate=!0,i.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(i.linearVelocity)):s.hasLinearVelocity=!1,i.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(i.angularVelocity)):s.hasAngularVelocity=!1,s.eventsEnabled&&s.dispatchEvent({type:`gripUpdated`,data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&i!==null&&(r=i),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(cn)))}return o!==null&&(o.visible=r!==null),s!==null&&(s.visible=i!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new sn;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},un={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},dn={h:0,s:0,l:0},fn={h:0,s:0,l:0};function pn(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var K=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let t=e;t&&t.isColor?this.copy(t):typeof t==`number`?this.setHex(t):typeof t==`string`&&this.setStyle(t)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Re){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,G.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=G.workingColorSpace){return this.r=e,this.g=t,this.b=n,G.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=G.workingColorSpace){if(e=ot(e,1),t=V(t,0,1),n=V(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,i=2*n-r;this.r=pn(i,r,e+1/3),this.g=pn(i,r,e),this.b=pn(i,r,e-1/3)}return G.colorSpaceToWorking(this,r),this}setStyle(e,t=Re){function n(t){t!==void 0&&parseFloat(t)<1&&z(`Color: Alpha component of `+e+` will be ignored.`)}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let i,a=r[1],o=r[2];switch(a){case`rgb`:case`rgba`:if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(255,parseInt(i[1],10))/255,Math.min(255,parseInt(i[2],10))/255,Math.min(255,parseInt(i[3],10))/255,t);if(i=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(100,parseInt(i[1],10))/100,Math.min(100,parseInt(i[2],10))/100,Math.min(100,parseInt(i[3],10))/100,t);break;case`hsl`:case`hsla`:if(i=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setHSL(parseFloat(i[1])/360,parseFloat(i[2])/100,parseFloat(i[3])/100,t);break;default:z(`Color: Unknown color model `+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let n=r[1],i=n.length;if(i===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(i===6)return this.setHex(parseInt(n,16),t);z(`Color: Invalid hex color `+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Re){let n=un[e.toLowerCase()];return n===void 0?z(`Color: Unknown color `+e):this.setHex(n,t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=_t(e.r),this.g=_t(e.g),this.b=_t(e.b),this}copyLinearToSRGB(e){return this.r=vt(e.r),this.g=vt(e.g),this.b=vt(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Re){return G.workingToColorSpace(mn.copy(this),e),Math.round(V(mn.r*255,0,255))*65536+Math.round(V(mn.g*255,0,255))*256+Math.round(V(mn.b*255,0,255))}getHexString(e=Re){return(`000000`+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=G.workingColorSpace){G.workingToColorSpace(mn.copy(this),t);let n=mn.r,r=mn.g,i=mn.b,a=Math.max(n,r,i),o=Math.min(n,r,i),s,c,l=(o+a)/2;if(o===a)s=0,c=0;else{let e=a-o;switch(c=l<=.5?e/(a+o):e/(2-a-o),a){case n:s=(r-i)/e+(r<i?6:0);break;case r:s=(i-n)/e+2;break;case i:s=(n-r)/e+4}s/=6}return e.h=s,e.s=c,e.l=l,e}getRGB(e,t=G.workingColorSpace){return G.workingToColorSpace(mn.copy(this),t),e.r=mn.r,e.g=mn.g,e.b=mn.b,e}getStyle(e=Re){G.workingToColorSpace(mn.copy(this),e);let t=mn.r,n=mn.g,r=mn.b;return e===`srgb`?`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`:`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`}offsetHSL(e,t,n){return this.getHSL(dn),this.setHSL(dn.h+e,dn.s+t,dn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(dn),e.getHSL(fn);let n=st(dn.h,fn.h,t),r=st(dn.s,fn.s,t),i=st(dn.l,fn.l,t);return this.setHSL(n,r,i),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,i=e.elements;return this.r=i[0]*t+i[3]*n+i[6]*r,this.g=i[1]*t+i[4]*n+i[7]*r,this.b=i[2]*t+i[5]*n+i[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},mn=new K;K.NAMES=un;var hn=class extends on{constructor(){super(),this.isScene=!0,this.type=`Scene`,this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ht,this.environmentIntensity=1,this.environmentRotation=new Ht,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},gn=new U,_n=new U,vn=new U,yn=new U,bn=new U,xn=new U,Sn=new U,Cn=new U,wn=new U,Tn=new U,En=new Dt,Dn=new Dt,On=new Dt,kn=class e{constructor(e=new U,t=new U,n=new U){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),gn.subVectors(e,t),r.cross(gn);let i=r.lengthSq();return i>0?r.multiplyScalar(1/Math.sqrt(i)):r.set(0,0,0)}static getBarycoord(e,t,n,r,i){gn.subVectors(r,t),_n.subVectors(n,t),vn.subVectors(e,t);let a=gn.dot(gn),o=gn.dot(_n),s=gn.dot(vn),c=_n.dot(_n),l=_n.dot(vn),u=a*c-o*o;if(u===0)return i.set(0,0,0),null;let d=1/u,f=(c*s-o*l)*d,p=(a*l-o*s)*d;return i.set(1-f-p,p,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,yn)!==null&&yn.x>=0&&yn.y>=0&&yn.x+yn.y<=1}static getInterpolation(e,t,n,r,i,a,o,s){return this.getBarycoord(e,t,n,r,yn)===null?(s.x=0,s.y=0,`z`in s&&(s.z=0),`w`in s&&(s.w=0),null):(s.setScalar(0),s.addScaledVector(i,yn.x),s.addScaledVector(a,yn.y),s.addScaledVector(o,yn.z),s)}static getInterpolatedAttribute(e,t,n,r,i,a){return En.setScalar(0),Dn.setScalar(0),On.setScalar(0),En.fromBufferAttribute(e,t),Dn.fromBufferAttribute(e,n),On.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(En,i.x),a.addScaledVector(Dn,i.y),a.addScaledVector(On,i.z),a}static isFrontFacing(e,t,n,r){return gn.subVectors(n,t),_n.subVectors(e,t),gn.cross(_n).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return gn.subVectors(this.c,this.b),_n.subVectors(this.a,this.b),gn.cross(_n).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,r,i,a){return e.getInterpolation(t,this.a,this.b,this.c,n,r,i,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,i=this.c,a,o;bn.subVectors(r,n),xn.subVectors(i,n),Cn.subVectors(e,n);let s=bn.dot(Cn),c=xn.dot(Cn);if(s<=0&&c<=0)return t.copy(n);wn.subVectors(e,r);let l=bn.dot(wn),u=xn.dot(wn);if(l>=0&&u<=l)return t.copy(r);let d=s*u-l*c;if(d<=0&&s>=0&&l<=0)return a=s/(s-l),t.copy(n).addScaledVector(bn,a);Tn.subVectors(e,i);let f=bn.dot(Tn),p=xn.dot(Tn);if(p>=0&&f<=p)return t.copy(i);let m=f*c-s*p;if(m<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(xn,o);let h=l*p-f*u;if(h<=0&&u-l>=0&&f-p>=0)return Sn.subVectors(i,r),o=(u-l)/(u-l+(f-p)),t.copy(r).addScaledVector(Sn,o);let g=1/(h+m+d);return a=m*g,o=d*g,t.copy(n).addScaledVector(bn,a).addScaledVector(xn,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},An=class{constructor(e=new U(1/0,1/0,1/0),t=new U(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Mn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Mn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Mn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute(`position`);if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let t=0,n=r.count;t<n;t++)e.isMesh===!0?e.getVertexPosition(t,Mn):Mn.fromBufferAttribute(r,t),Mn.applyMatrix4(e.matrixWorld),this.expandByPoint(Mn);else e.boundingBox===void 0?(n.boundingBox===null&&n.computeBoundingBox(),Nn.copy(n.boundingBox)):(e.boundingBox===null&&e.computeBoundingBox(),Nn.copy(e.boundingBox)),Nn.applyMatrix4(e.matrixWorld),this.union(Nn)}let r=e.children;for(let e=0,n=r.length;e<n;e++)this.expandByObject(r[e],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Mn),Mn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Bn),Vn.subVectors(this.max,Bn),Pn.subVectors(e.a,Bn),Fn.subVectors(e.b,Bn),In.subVectors(e.c,Bn),Ln.subVectors(Fn,Pn),Rn.subVectors(In,Fn),zn.subVectors(Pn,In);let t=[0,-Ln.z,Ln.y,0,-Rn.z,Rn.y,0,-zn.z,zn.y,Ln.z,0,-Ln.x,Rn.z,0,-Rn.x,zn.z,0,-zn.x,-Ln.y,Ln.x,0,-Rn.y,Rn.x,0,-zn.y,zn.x,0];return!Wn(t,Pn,Fn,In,Vn)||(t=[1,0,0,0,1,0,0,0,1],!Wn(t,Pn,Fn,In,Vn))?!1:(Hn.crossVectors(Ln,Rn),t=[Hn.x,Hn.y,Hn.z],Wn(t,Pn,Fn,In,Vn))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Mn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Mn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(jn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),jn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),jn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),jn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),jn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),jn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),jn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),jn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(jn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},jn=[new U,new U,new U,new U,new U,new U,new U,new U],Mn=new U,Nn=new An,Pn=new U,Fn=new U,In=new U,Ln=new U,Rn=new U,zn=new U,Bn=new U,Vn=new U,Hn=new U,Un=new U;function Wn(e,t,n,r,i){for(let a=0,o=e.length-3;a<=o;a+=3){Un.fromArray(e,a);let o=i.x*Math.abs(Un.x)+i.y*Math.abs(Un.y)+i.z*Math.abs(Un.z),s=t.dot(Un),c=n.dot(Un),l=r.dot(Un);if(Math.max(-Math.max(s,c,l),Math.min(s,c,l))>o)return!1}return!0}var Gn=new U,Kn=new H,qn=0,Jn=class extends tt{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw TypeError(`THREE.BufferAttribute: array should be a Typed Array.`);this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:qn++}),this.name=``,this.array=e,this.itemSize=t,this.count=e===void 0?0:e.length/t,this.normalized=n,this.usage=He,this.updateRanges=[],this.gpuType=h,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,i=this.itemSize;r<i;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Kn.fromBufferAttribute(this,t),Kn.applyMatrix3(e),this.setXY(t,Kn.x,Kn.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Gn.fromBufferAttribute(this,t),Gn.applyMatrix3(e),this.setXYZ(t,Gn.x,Gn.y,Gn.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Gn.fromBufferAttribute(this,t),Gn.applyMatrix4(e),this.setXYZ(t,Gn.x,Gn.y,Gn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Gn.fromBufferAttribute(this,t),Gn.applyNormalMatrix(e),this.setXYZ(t,Gn.x,Gn.y,Gn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Gn.fromBufferAttribute(this,t),Gn.transformDirection(e),this.setXYZ(t,Gn.x,Gn.y,Gn.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=ct(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=lt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=ct(t,this.array)),t}setX(e,t){return this.normalized&&(t=lt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=ct(t,this.array)),t}setY(e,t){return this.normalized&&(t=lt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=ct(t,this.array)),t}setZ(e,t){return this.normalized&&(t=lt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=ct(t,this.array)),t}setW(e,t){return this.normalized&&(t=lt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=lt(t,this.array),n=lt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=lt(t,this.array),n=lt(n,this.array),r=lt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e*=this.itemSize,this.normalized&&(t=lt(t,this.array),n=lt(n,this.array),r=lt(r,this.array),i=lt(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=i,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:`dispose`})}},Yn=class extends Jn{constructor(e,t,n){super(new Uint16Array(e),t,n)}},Xn=class extends Jn{constructor(e,t,n){super(new Uint32Array(e),t,n)}},Zn=class extends Jn{constructor(e,t,n){super(new Float32Array(e),t,n)}},Qn=new An,$n=new U,er=new U,tr=class{constructor(e=new U,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t===void 0?Qn.setFromPoints(e).getCenter(n):n.copy(t);let r=0;for(let t=0,i=e.length;t<i;t++)r=Math.max(r,n.distanceToSquared(e[t]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius*=e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;$n.subVectors(e,this.center);let t=$n.lengthSq();if(t>this.radius*this.radius){let e=Math.sqrt(t),n=(e-this.radius)*.5;this.center.addScaledVector($n,n/e),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(er.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint($n.copy(e.center).add(er)),this.expandByPoint($n.copy(e.center).sub(er))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},nr=0,rr=new Mt,ir=new on,ar=new U,or=new An,sr=new An,cr=new U,lr=class e extends tt{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:nr++}),this.uuid=at(),this.name=``,this.type=`BufferGeometry`,this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return this.index=Array.isArray(e)?new(Ge(e)?Xn:Yn)(e,1):e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let t=new W().getNormalMatrix(e);n.applyNormalMatrix(t),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return rr.makeRotationFromQuaternion(e),this.applyMatrix4(rr),this}rotateX(e){return rr.makeRotationX(e),this.applyMatrix4(rr),this}rotateY(e){return rr.makeRotationY(e),this.applyMatrix4(rr),this}rotateZ(e){return rr.makeRotationZ(e),this.applyMatrix4(rr),this}translate(e,t,n){return rr.makeTranslation(e,t,n),this.applyMatrix4(rr),this}scale(e,t,n){return rr.makeScale(e,t,n),this.applyMatrix4(rr),this}lookAt(e){return ir.lookAt(e),ir.updateMatrix(),this.applyMatrix4(ir.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ar).negate(),this.translate(ar.x,ar.y,ar.z),this}setFromPoints(e){let t=this.getAttribute(`position`);if(t===void 0){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}this.setAttribute(`position`,new Zn(t,3))}else{let n=Math.min(e.length,t.count);for(let r=0;r<n;r++){let n=e[r];t.setXYZ(r,n.x,n.y,n.z||0)}e.length>t.count&&z(`BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.`),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new An);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){B(`BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.`,this),this.boundingBox.set(new U(-1/0,-1/0,-1/0),new U(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];or.setFromBufferAttribute(n),this.morphTargetsRelative?(cr.addVectors(this.boundingBox.min,or.min),this.boundingBox.expandByPoint(cr),cr.addVectors(this.boundingBox.max,or.max),this.boundingBox.expandByPoint(cr)):(this.boundingBox.expandByPoint(or.min),this.boundingBox.expandByPoint(or.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&B(`BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.`,this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new tr);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){B(`BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.`,this),this.boundingSphere.set(new U,1/0);return}if(e){let n=this.boundingSphere.center;if(or.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];sr.setFromBufferAttribute(n),this.morphTargetsRelative?(cr.addVectors(or.min,sr.min),or.expandByPoint(cr),cr.addVectors(or.max,sr.max),or.expandByPoint(cr)):(or.expandByPoint(sr.min),or.expandByPoint(sr.max))}or.getCenter(n);let r=0;for(let t=0,i=e.count;t<i;t++)cr.fromBufferAttribute(e,t),r=Math.max(r,n.distanceToSquared(cr));if(t)for(let i=0,a=t.length;i<a;i++){let a=t[i],o=this.morphTargetsRelative;for(let t=0,i=a.count;t<i;t++)cr.fromBufferAttribute(a,t),o&&(ar.fromBufferAttribute(e,t),cr.add(ar)),r=Math.max(r,n.distanceToSquared(cr))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&B(`BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.`,this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){B(`BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)`);return}let n=t.position,r=t.normal,i=t.uv,a=this.getAttribute(`tangent`);(a===void 0||a.count!==n.count)&&(a=new Jn(new Float32Array(4*n.count),4),this.setAttribute(`tangent`,a));let o=[],s=[];for(let e=0;e<n.count;e++)o[e]=new U,s[e]=new U;let c=new U,l=new U,u=new U,d=new H,f=new H,p=new H,m=new U,h=new U;function g(e,t,r){c.fromBufferAttribute(n,e),l.fromBufferAttribute(n,t),u.fromBufferAttribute(n,r),d.fromBufferAttribute(i,e),f.fromBufferAttribute(i,t),p.fromBufferAttribute(i,r),l.sub(c),u.sub(c),f.sub(d),p.sub(d);let a=1/(f.x*p.y-p.x*f.y);isFinite(a)&&(m.copy(l).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(a),h.copy(u).multiplyScalar(f.x).addScaledVector(l,-p.x).multiplyScalar(a),o[e].add(m),o[t].add(m),o[r].add(m),s[e].add(h),s[t].add(h),s[r].add(h))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)g(e.getX(t+0),e.getX(t+1),e.getX(t+2))}let v=new U,y=new U,b=new U,x=new U;function S(e){b.fromBufferAttribute(r,e),x.copy(b);let t=o[e];v.copy(t),v.sub(b.multiplyScalar(b.dot(t))).normalize(),y.crossVectors(x,t);let n=y.dot(s[e])<0?-1:1;a.setXYZW(e,v.x,v.y,v.z,n)}for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)S(e.getX(t+0)),S(e.getX(t+1)),S(e.getX(t+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute(`position`);if(t!==void 0){let n=this.getAttribute(`normal`);if(n===void 0||n.count!==t.count)n=new Jn(new Float32Array(t.count*3),3),this.setAttribute(`normal`,n);else for(let e=0,t=n.count;e<t;e++)n.setXYZ(e,0,0,0);let r=new U,i=new U,a=new U,o=new U,s=new U,c=new U,l=new U,u=new U;if(e)for(let d=0,f=e.count;d<f;d+=3){let f=e.getX(d+0),p=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,f),i.fromBufferAttribute(t,p),a.fromBufferAttribute(t,m),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),o.fromBufferAttribute(n,f),s.fromBufferAttribute(n,p),c.fromBufferAttribute(n,m),o.add(l),s.add(l),c.add(l),n.setXYZ(f,o.x,o.y,o.z),n.setXYZ(p,s.x,s.y,s.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let e=0,o=t.count;e<o;e+=3)r.fromBufferAttribute(t,e+0),i.fromBufferAttribute(t,e+1),a.fromBufferAttribute(t,e+2),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),n.setXYZ(e+0,l.x,l.y,l.z),n.setXYZ(e+1,l.x,l.y,l.z),n.setXYZ(e+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)cr.fromBufferAttribute(e,t),cr.normalize(),e.setXYZ(t,cr.x,cr.y,cr.z)}toNonIndexed(){function t(e,t){let n=e.array,r=e.itemSize,i=e.normalized,a=new n.constructor(t.length*r),o=0,s=0;for(let i=0,c=t.length;i<c;i++){o=e.isInterleavedBufferAttribute?t[i]*e.data.stride+e.offset:t[i]*r;for(let e=0;e<r;e++)a[s++]=n[o++]}return new Jn(a,r,i)}if(this.index===null)return z(`BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.`),this;let n=new e,r=this.index.array,i=this.attributes;for(let e in i){let a=i[e],o=t(a,r);n.setAttribute(e,o)}let a=this.morphAttributes;for(let e in a){let i=[],o=a[e];for(let e=0,n=o.length;e<n;e++){let n=o[e],a=t(n,r);i.push(a)}n.morphAttributes[e]=i}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let e=0,t=o.length;e<t;e++){let t=o[e];n.addGroup(t.start,t.count,t.materialIndex)}return n}toJSON(){let e={metadata:{version:4.7,type:`BufferGeometry`,generator:`BufferGeometry.toJSON`}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?`BufferGeometry`:this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let t=this.parameters;for(let n in t)t[n]!==void 0&&(e[n]=t[n]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let t in n){let r=n[t];e.data.attributes[t]=r.toJSON(e.data)}let r={},i=!1;for(let t in this.morphAttributes){let n=this.morphAttributes[t],a=[];for(let t=0,r=n.length;t<r;t++){let r=n[t];a.push(r.toJSON(e.data))}a.length>0&&(r[t]=a,i=!0)}i&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let r=e.attributes;for(let e in r){let n=r[e];this.setAttribute(e,n.clone(t))}let i=e.morphAttributes;for(let e in i){let n=[],r=i[e];for(let e=0,i=r.length;e<i;e++)n.push(r[e].clone(t));this.morphAttributes[e]=n}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let e=0,t=a.length;e<t;e++){let t=a[e];this.addGroup(t.start,t.count,t.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let s=e.boundingSphere;return s!==null&&(this.boundingSphere=s.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:`dispose`})}},ur=new U,dr=new U,fr=new W,pr=class{constructor(e=new U(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=ur.subVectors(n,t).cross(dr.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let r=e.delta(ur),i=this.normal.dot(r);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/i;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||fr.getNormalMatrix(e),r=this.coplanarPoint(ur).applyMatrix4(e),i=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(i),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},mr=0,hr=class extends tt{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:mr++}),this.uuid=at(),this.name=``,this.type=`Material`,this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new K(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ve,this.stencilZFail=Ve,this.stencilZPass=Ve,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){z(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){z(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector2&&n&&n.isVector2||r&&r.isEuler&&n&&n.isEuler||r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:`Material`,generator:`Material.toJSON`}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(e=>e.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}if(t){let t=r(e.textures),i=r(e.images);t.length>0&&(n.textures=t),i.length>0&&(n.images=i)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new K().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(e=>new pr().fromJSON(e))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(this.vertexColors=typeof e.vertexColors==`number`?e.vertexColors>0:e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let t=e.normalScale;Array.isArray(t)===!1&&(t=[t,t]),this.normalScale=new H().fromArray(t)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new H().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let e=t.length;n=Array(e);for(let r=0;r!==e;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:`dispose`})}set needsUpdate(e){e===!0&&this.version++}},gr=new U,_r=new U,vr=new U,yr=new U,br=class{constructor(e=new U,t=new U(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,gr)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=gr.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(gr.copy(this.origin).addScaledVector(this.direction,t),gr.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){_r.copy(e).add(t).multiplyScalar(.5),vr.copy(t).sub(e).normalize(),yr.copy(this.origin).sub(_r);let i=e.distanceTo(t)*.5,a=-this.direction.dot(vr),o=yr.dot(this.direction),s=-yr.dot(vr),c=yr.lengthSq(),l=Math.abs(1-a*a),u,d,f,p;if(l>0){if(u=a*s-o,d=a*o-s,p=i*l,u>=0){if(d>=-p){if(d<=p){let e=1/l;u*=e,d*=e,f=u*(u+a*d+2*o)+d*(a*u+d+2*s)+c}else d=i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d=-i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d<=-p?(u=Math.max(0,-(-a*i+o)),d=u>0?-i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c):d<=p?(u=0,d=Math.min(Math.max(-i,-s),i),f=d*(d+2*s)+c):(u=Math.max(0,-(a*i+o)),d=u>0?i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c)}else d=a>0?-i:i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(_r).addScaledVector(vr,d),f}intersectSphere(e,t){if(e.radius<0)return null;gr.subVectors(e.center,this.origin);let n=gr.dot(this.direction),r=gr.dot(gr)-n*n,i=e.radius*e.radius;if(r>i)return null;let a=Math.sqrt(i-r),o=n-a,s=n+a;return s<0?null:o<0?this.at(s,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,i,a,o,s,c=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),l>=0?(i=(e.min.y-d.y)*l,a=(e.max.y-d.y)*l):(i=(e.max.y-d.y)*l,a=(e.min.y-d.y)*l),n>a||i>r||((i>n||isNaN(n))&&(n=i),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-d.z)*u,s=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,s=(e.min.z-d.z)*u),n>s||o>r)||((o>n||n!==n)&&(n=o),(s<r||r!==r)&&(r=s),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,gr)!==null}intersectTriangle(e,t,n,r,i){let a=this.origin,o=this.direction,s=o.x,c=o.y,l=o.z,u=e.x-a.x,d=e.y-a.y,f=e.z-a.z,p=t.x-a.x,m=t.y-a.y,h=t.z-a.z,g=n.x-a.x,_=n.y-a.y,v=n.z-a.z,y=Math.abs(s),b=Math.abs(c),x=Math.abs(l),S,C,w,T,E,D,O,k,A,ee,j,te;if(y>=b&&y>=x?(w=s,D=u,A=p,te=g,s>=0?(S=c,C=l,T=d,E=f,O=m,k=h,ee=_,j=v):(S=l,C=c,T=f,E=d,O=h,k=m,ee=v,j=_)):b>=x?(w=c,D=d,A=m,te=_,c>=0?(S=l,C=s,T=f,E=u,O=h,k=p,ee=v,j=g):(S=s,C=l,T=u,E=f,O=p,k=h,ee=g,j=v)):(w=l,D=f,A=h,te=v,l>=0?(S=s,C=c,T=u,E=d,O=p,k=m,ee=g,j=_):(S=c,C=s,T=d,E=u,O=m,k=p,ee=_,j=g)),w===0)return null;let M=S/w,ne=C/w,N=1/w,re=T-M*D,ie=E-ne*D,ae=O-M*A,oe=k-ne*A,se=ee-M*te,ce=j-ne*te,le=se*oe-ce*ae,P=re*ce-ie*se,ue=ae*ie-oe*re;if(r){if(le<0||P<0||ue<0)return null}else if((le<0||P<0||ue<0)&&(le>0||P>0||ue>0))return null;let de=le+P+ue;if(de===0)return null;let fe=N*(le*D+P*A+ue*te);return(de>0?fe<0:fe>0)?null:this.at(fe/de,i)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},xr=class extends hr{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type=`MeshBasicMaterial`,this.color=new K(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ht,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Sr=new Mt,Cr=new br,wr=new tr,Tr=new U,Er=new U,Dr=new U,Or=new U,kr=new U,Ar=new U,jr=new U,Mr=new U,q=class extends on{constructor(e=new lr,t=new xr){super(),this.isMesh=!0,this.type=`Mesh`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,i=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(i&&o){Ar.set(0,0,0);for(let n=0,r=i.length;n<r;n++){let r=o[n],s=i[n];r!==0&&(kr.fromBufferAttribute(s,e),a?Ar.addScaledVector(kr,r):Ar.addScaledVector(kr.sub(t),r))}t.add(Ar)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.material,i=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),wr.copy(n.boundingSphere),wr.applyMatrix4(i),Cr.copy(e.ray).recast(e.near),!(wr.containsPoint(Cr.origin)===!1&&(Cr.intersectSphere(wr,Tr)===null||Cr.origin.distanceToSquared(Tr)>(e.far-e.near)**2))&&(Sr.copy(i).invert(),Cr.copy(e.ray).applyMatrix4(Sr),(n.boundingBox===null||Cr.intersectsBox(n.boundingBox)!==!1)&&this._computeIntersections(e,t,Cr)))}_computeIntersections(e,t,n){let r,i=this.geometry,a=this.material,o=i.index,s=i.attributes.position,c=i.attributes.uv,l=i.attributes.uv1,u=i.attributes.normal,d=i.groups,f=i.drawRange;if(o!==null){if(Array.isArray(a))for(let i=0,s=d.length;i<s;i++){let s=d[i],p=a[s.materialIndex],m=Math.max(s.start,f.start),h=Math.min(o.count,Math.min(s.start+s.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=o.getX(i),d=o.getX(i+1),f=o.getX(i+2);r=Pr(this,p,e,n,c,l,u,a,d,f),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=s.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),s=Math.min(o.count,f.start+f.count);for(let d=i,f=s;d<f;d+=3){let i=o.getX(d),s=o.getX(d+1),f=o.getX(d+2);r=Pr(this,a,e,n,c,l,u,i,s,f),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}}else if(s!==void 0){if(Array.isArray(a))for(let i=0,o=d.length;i<o;i++){let o=d[i],p=a[o.materialIndex],m=Math.max(o.start,f.start),h=Math.min(s.count,Math.min(o.start+o.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=i,s=i+1,d=i+2;r=Pr(this,p,e,n,c,l,u,a,s,d),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=o.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),o=Math.min(s.count,f.start+f.count);for(let s=i,d=o;s<d;s+=3){let i=s,o=s+1,d=s+2;r=Pr(this,a,e,n,c,l,u,i,o,d),r&&(r.faceIndex=Math.floor(s/3),t.push(r))}}}}};function Nr(e,t,n,r,i,a,o,s){let c;if(c=t.side===1?r.intersectTriangle(o,a,i,!0,s):r.intersectTriangle(i,a,o,t.side===0,s),c===null)return null;Mr.copy(s),Mr.applyMatrix4(e.matrixWorld);let l=n.ray.origin.distanceTo(Mr);return l<n.near||l>n.far?null:{distance:l,point:Mr.clone(),object:e}}function Pr(e,t,n,r,i,a,o,s,c,l){e.getVertexPosition(s,Er),e.getVertexPosition(c,Dr),e.getVertexPosition(l,Or);let u=Nr(e,t,n,r,Er,Dr,Or,jr);if(u){let e=new U;kn.getBarycoord(jr,Er,Dr,Or,e),i&&(u.uv=kn.getInterpolatedAttribute(i,s,c,l,e,new H)),a&&(u.uv1=kn.getInterpolatedAttribute(a,s,c,l,e,new H)),o&&(u.normal=kn.getInterpolatedAttribute(o,s,c,l,e,new U),u.normal.dot(r.direction)>0&&u.normal.multiplyScalar(-1));let t={a:s,b:c,c:l,normal:new U,materialIndex:0};kn.getNormal(Er,Dr,Or,t.normal),u.face=t,u.barycoord=e}return u}var Fr=class extends Et{constructor(e=null,t=1,n=1,i,a,o,s,c,l=r,u=r,d,f){super(null,o,s,c,l,u,i,a,d,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Ir=class extends Jn{constructor(e,t,n,r=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Lr=new Mt,Rr=new Mt,zr=[],Br=new An,Vr=new Mt,Hr=new q,Ur=new tr,Wr=class extends q{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Ir(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let e=0;e<n;e++)this.setMatrixAt(e,Vr)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new An),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Lr),Br.copy(e.boundingBox).applyMatrix4(Lr),this.boundingBox.union(Br)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new tr),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Lr),Ur.copy(e.boundingSphere).applyMatrix4(Lr),this.boundingSphere.union(Ur)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,r=this.morphTexture.source.data.data,i=e*(n.length+1)+1;for(let e=0;e<n.length;e++)n[e]=r[i+e]}raycast(e,t){let n=this.matrixWorld,r=this.count;if(Hr.geometry=this.geometry,Hr.material=this.material,Hr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ur.copy(this.boundingSphere),Ur.applyMatrix4(n),e.ray.intersectsSphere(Ur)!==!1))for(let i=0;i<r;i++){this.getMatrixAt(i,Lr),Rr.multiplyMatrices(n,Lr),Hr.matrixWorld=Rr,Hr.raycast(e,zr);for(let e=0,n=zr.length;e<n;e++){let n=zr[e];n.instanceId=i,n.object=this,t.push(n)}zr.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new Ir(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,r=n.length+1;this.morphTexture===null&&(this.morphTexture=new Fr(new Float32Array(r*this.count),r,this.count,D,h));let i=this.morphTexture.source.data.data,a=0;for(let e=0;e<n.length;e++)a+=n[e];let o=this.geometry.morphTargetsRelative?1:1-a,s=r*e;return i[s]=o,i.set(n,s+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Gr=new tr,Kr=new H(.5,.5),qr=new U,Jr=class{constructor(e=new pr,t=new pr,n=new pr,r=new pr,i=new pr,a=new pr){this.planes=[e,t,n,r,i,a]}set(e,t,n,r,i,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(i),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=We,n=!1){let r=this.planes,i=e.elements,a=i[0],o=i[1],s=i[2],c=i[3],l=i[4],u=i[5],d=i[6],f=i[7],p=i[8],m=i[9],h=i[10],g=i[11],_=i[12],v=i[13],y=i[14],b=i[15];if(r[0].setComponents(c-a,f-l,g-p,b-_).normalize(),r[1].setComponents(c+a,f+l,g+p,b+_).normalize(),r[2].setComponents(c+o,f+u,g+m,b+v).normalize(),r[3].setComponents(c-o,f-u,g-m,b-v).normalize(),n)r[4].setComponents(s,d,h,y).normalize(),r[5].setComponents(c-s,f-d,g-h,b-y).normalize();else if(r[4].setComponents(c-s,f-d,g-h,b-y).normalize(),t===2e3)r[5].setComponents(c+s,f+d,g+h,b+y).normalize();else if(t===2001)r[5].setComponents(s,d,h,y).normalize();else throw Error(`THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: `+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Gr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Gr.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Gr)}intersectsSprite(e){return Gr.center.set(0,0,0),Gr.radius=.7071067811865476+Kr.distanceTo(e.center),Gr.applyMatrix4(e.matrixWorld),this.intersectsSphere(Gr)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let e=0;e<6;e++)if(t[e].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(qr.x=r.normal.x>0?e.max.x:e.min.x,qr.y=r.normal.y>0?e.max.y:e.min.y,qr.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(qr)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},Yr=class extends hr{constructor(e){super(),this.isLineBasicMaterial=!0,this.type=`LineBasicMaterial`,this.color=new K(16777215),this.map=null,this.linewidth=1,this.linecap=`round`,this.linejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},Xr=new U,Zr=new U,Qr=new Mt,$r=new br,ei=new tr,ti=new U,ni=new U,ri=class extends on{constructor(e=new lr,t=new Yr){super(),this.isLine=!0,this.type=`Line`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let e=1,r=t.count;e<r;e++)Xr.fromBufferAttribute(t,e-1),Zr.fromBufferAttribute(t,e),n[e]=n[e-1],n[e]+=Xr.distanceTo(Zr);e.setAttribute(`lineDistance`,new Zn(n,1))}else z(`Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.`);return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.matrixWorld,i=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ei.copy(n.boundingSphere),ei.applyMatrix4(r),ei.radius+=i,e.ray.intersectsSphere(ei)===!1)return;Qr.copy(r).invert(),$r.copy(e.ray).applyMatrix4(Qr);let o=i/((this.scale.x+this.scale.y+this.scale.z)/3),s=o*o,c=this.isLineSegments?2:1,l=n.index,u=n.attributes.position;if(l!==null){let n=Math.max(0,a.start),r=Math.min(l.count,a.start+a.count);for(let i=n,a=r-1;i<a;i+=c){let n=l.getX(i),r=l.getX(i+1),a=ii(this,e,$r,s,n,r,i);a&&t.push(a)}if(this.isLineLoop){let i=l.getX(r-1),a=l.getX(n),o=ii(this,e,$r,s,i,a,r-1);o&&t.push(o)}}else{let n=Math.max(0,a.start),r=Math.min(u.count,a.start+a.count);for(let i=n,a=r-1;i<a;i+=c){let n=ii(this,e,$r,s,i,i+1,i);n&&t.push(n)}if(this.isLineLoop){let i=ii(this,e,$r,s,r-1,n,r-1);i&&t.push(i)}}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}};function ii(e,t,n,r,i,a,o){let s=e.geometry.attributes.position;if(Xr.fromBufferAttribute(s,i),Zr.fromBufferAttribute(s,a),n.distanceSqToSegment(Xr,Zr,ti,ni)>r)return;ti.applyMatrix4(e.matrixWorld);let c=t.ray.origin.distanceTo(ti);if(!(c<t.near||c>t.far))return{distance:c,point:ni.clone().applyMatrix4(e.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:e}}var ai=new U,oi=new U,si=class extends ri{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type=`LineSegments`}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let e=0,r=t.count;e<r;e+=2)ai.fromBufferAttribute(t,e),oi.fromBufferAttribute(t,e+1),n[e]=e===0?0:n[e-1],n[e+1]=n[e]+ai.distanceTo(oi);e.setAttribute(`lineDistance`,new Zn(n,1))}else z(`LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.`);return this}},ci=class extends Et{constructor(e=[],t=301,n,r,i,a,o,s,c,l){super(e,t,n,r,i,a,o,s,c,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},li=class extends Et{constructor(e,t,n=m,i,a,o,s=r,c=r,l,u=T,d=1){if(u!==1026&&u!==1027)throw Error(`THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat`);super({width:e,height:t,depth:d},i,a,o,s,c,u,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new St(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},ui=class extends li{constructor(e,t=m,n=301,i,a,o=r,s=r,c,l=T){let u={width:e,height:e,depth:1},d=[u,u,u,u,u,u];super(e,e,t,n,i,a,o,s,c,l),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},di=class extends Et{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},J=class e extends lr{constructor(e=1,t=1,n=1,r=1,i=1,a=1){super(),this.type=`BoxGeometry`,this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:i,depthSegments:a};let o=this;r=Math.floor(r),i=Math.floor(i),a=Math.floor(a);let s=[],c=[],l=[],u=[],d=0,f=0;p(`z`,`y`,`x`,-1,-1,n,t,e,a,i,0),p(`z`,`y`,`x`,1,-1,n,t,-e,a,i,1),p(`x`,`z`,`y`,1,1,e,n,t,r,a,2),p(`x`,`z`,`y`,1,-1,e,n,-t,r,a,3),p(`x`,`y`,`z`,1,-1,e,t,n,r,i,4),p(`x`,`y`,`z`,-1,-1,e,t,-n,r,i,5),this.setIndex(s),this.setAttribute(`position`,new Zn(c,3)),this.setAttribute(`normal`,new Zn(l,3)),this.setAttribute(`uv`,new Zn(u,2));function p(e,t,n,r,i,a,p,m,h,g,_){let v=a/h,y=p/g,b=a/2,x=p/2,S=m/2,C=h+1,w=g+1,T=0,E=0,D=new U;for(let a=0;a<w;a++){let o=a*y-x;for(let s=0;s<C;s++)D[e]=(s*v-b)*r,D[t]=o*i,D[n]=S,c.push(D.x,D.y,D.z),D[e]=0,D[t]=0,D[n]=m>0?1:-1,l.push(D.x,D.y,D.z),u.push(s/h),u.push(1-a/g),T+=1}for(let e=0;e<g;e++)for(let t=0;t<h;t++){let n=d+t+C*e,r=d+t+C*(e+1),i=d+(t+1)+C*(e+1),a=d+(t+1)+C*e;s.push(n,r,a),s.push(r,i,a),E+=6}o.addGroup(f,E,_),f+=E,d+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}},fi=class e extends lr{constructor(e=1,t=32,n=0,r=Math.PI*2){super(),this.type=`CircleGeometry`,this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:r},t=Math.max(3,t);let i=[],a=[],o=[],s=[],c=new U,l=new H;a.push(0,0,0),o.push(0,0,1),s.push(.5,.5);for(let i=0,u=3;i<=t;i++,u+=3){let d=n+i/t*r;c.x=e*Math.cos(d),c.y=e*Math.sin(d),a.push(c.x,c.y,c.z),o.push(0,0,1),l.x=(a[u]/e+1)/2,l.y=(a[u+1]/e+1)/2,s.push(l.x,l.y)}for(let e=1;e<=t;e++)i.push(e,e+1,0);this.setIndex(i),this.setAttribute(`position`,new Zn(a,3)),this.setAttribute(`normal`,new Zn(o,3)),this.setAttribute(`uv`,new Zn(s,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.segments,t.thetaStart,t.thetaLength)}},pi=class e extends lr{constructor(e=1,t=1,n=1,r=32,i=1,a=!1,o=0,s=Math.PI*2){super(),this.type=`CylinderGeometry`,this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:r,heightSegments:i,openEnded:a,thetaStart:o,thetaLength:s};let c=this;r=Math.floor(r),i=Math.floor(i);let l=[],u=[],d=[],f=[],p=0,m=[],h=n/2,g=0;_(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(l),this.setAttribute(`position`,new Zn(u,3)),this.setAttribute(`normal`,new Zn(d,3)),this.setAttribute(`uv`,new Zn(f,2));function _(){let a=new U,_=new U,v=0,y=(t-e)/n;for(let c=0;c<=i;c++){let l=[],g=c/i,v=g*(t-e)+e;for(let e=0;e<=r;e++){let t=e/r,i=t*s+o,c=Math.sin(i),m=Math.cos(i);_.x=v*c,_.y=-g*n+h,_.z=v*m,u.push(_.x,_.y,_.z),a.set(c,y,m).normalize(),d.push(a.x,a.y,a.z),f.push(t,1-g),l.push(p++)}m.push(l)}for(let n=0;n<r;n++)for(let r=0;r<i;r++){let a=m[r][n],o=m[r+1][n],s=m[r+1][n+1],c=m[r][n+1];(e>0||r!==0)&&(l.push(a,o,c),v+=3),(t>0||r!==i-1)&&(l.push(o,s,c),v+=3)}c.addGroup(g,v,0),g+=v}function v(n){let i=p,a=new H,m=new U,_=0,v=n===!0?e:t,y=n===!0?1:-1;for(let e=1;e<=r;e++)u.push(0,h*y,0),d.push(0,y,0),f.push(.5,.5),p++;let b=p;for(let e=0;e<=r;e++){let t=e/r*s+o,n=Math.cos(t),i=Math.sin(t);m.x=v*i,m.y=h*y,m.z=v*n,u.push(m.x,m.y,m.z),d.push(0,y,0),a.x=n*.5+.5,a.y=i*.5*y+.5,f.push(a.x,a.y),p++}for(let e=0;e<r;e++){let t=i+e,r=b+e;n===!0?l.push(r,r+1,t):l.push(r+1,r,t),_+=3}c.addGroup(g,_,n===!0?1:2),g+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},mi=class e extends pi{constructor(e=1,t=1,n=32,r=1,i=!1,a=0,o=Math.PI*2){super(0,e,t,n,r,i,a,o),this.type=`ConeGeometry`,this.parameters={radius:e,height:t,radialSegments:n,heightSegments:r,openEnded:i,thetaStart:a,thetaLength:o}}static fromJSON(t){return new e(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},hi=class e extends lr{constructor(e=[],t=[],n=1,r=0){super(),this.type=`PolyhedronGeometry`,this.parameters={vertices:e,indices:t,radius:n,detail:r};let i=[],a=[];o(r),c(n),l(),this.setAttribute(`position`,new Zn(i,3)),this.setAttribute(`normal`,new Zn(i.slice(),3)),this.setAttribute(`uv`,new Zn(a,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function o(e){let n=new U,r=new U,i=new U;for(let a=0;a<t.length;a+=3)f(t[a+0],n),f(t[a+1],r),f(t[a+2],i),s(n,r,i,e)}function s(e,t,n,r){let i=r+1,a=[];for(let r=0;r<=i;r++){a[r]=[];let o=e.clone().lerp(n,r/i),s=t.clone().lerp(n,r/i),c=i-r;for(let e=0;e<=c;e++)e===0&&r===i?a[r][e]=o:a[r][e]=o.clone().lerp(s,e/c)}for(let e=0;e<i;e++)for(let t=0;t<2*(i-e)-1;t++){let n=Math.floor(t/2);t%2==0?(d(a[e][n+1]),d(a[e+1][n]),d(a[e][n])):(d(a[e][n+1]),d(a[e+1][n+1]),d(a[e+1][n]))}}function c(e){let t=new U;for(let n=0;n<i.length;n+=3)t.x=i[n+0],t.y=i[n+1],t.z=i[n+2],t.normalize().multiplyScalar(e),i[n+0]=t.x,i[n+1]=t.y,i[n+2]=t.z}function l(){let e=new U;for(let t=0;t<i.length;t+=3){e.x=i[t+0],e.y=i[t+1],e.z=i[t+2];let n=h(e)/2/Math.PI+.5,r=g(e)/Math.PI+.5;a.push(n,1-r)}p(),u()}function u(){for(let e=0;e<a.length;e+=6){let t=a[e+0],n=a[e+2],r=a[e+4];Math.max(t,n,r)>.9&&Math.min(t,n,r)<.1&&(t<.2&&(a[e+0]+=1),n<.2&&(a[e+2]+=1),r<.2&&(a[e+4]+=1))}}function d(e){i.push(e.x,e.y,e.z)}function f(t,n){let r=t*3;n.x=e[r+0],n.y=e[r+1],n.z=e[r+2]}function p(){let e=new U,t=new U,n=new U,r=new U,o=new H,s=new H,c=new H;for(let l=0,u=0;l<i.length;l+=9,u+=6){e.set(i[l+0],i[l+1],i[l+2]),t.set(i[l+3],i[l+4],i[l+5]),n.set(i[l+6],i[l+7],i[l+8]),o.set(a[u+0],a[u+1]),s.set(a[u+2],a[u+3]),c.set(a[u+4],a[u+5]),r.copy(e).add(t).add(n).divideScalar(3);let d=h(r);m(o,u+0,e,d),m(s,u+2,t,d),m(c,u+4,n,d)}}function m(e,t,n,r){r<0&&e.x===1&&(a[t]=e.x-1),n.x===0&&n.z===0&&(a[t]=r/2/Math.PI+.5)}function h(e){return Math.atan2(e.z,-e.x)}function g(e){return Math.atan2(-e.y,Math.sqrt(e.x*e.x+e.z*e.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.vertices,t.indices,t.radius,t.detail)}},gi=class e extends hi{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,r=1/n,i=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-r,-n,0,-r,n,0,r,-n,0,r,n,-r,-n,0,-r,n,0,r,-n,0,r,n,0,-n,0,-r,n,0,-r,-n,0,r,n,0,r];super(i,[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9],e,t),this.type=`DodecahedronGeometry`,this.parameters={radius:e,detail:t}}static fromJSON(t){return new e(t.radius,t.detail)}},_i=class e extends hi{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,r=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1];super(r,[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1],e,t),this.type=`IcosahedronGeometry`,this.parameters={radius:e,detail:t}}static fromJSON(t){return new e(t.radius,t.detail)}},vi=class e extends hi{constructor(e=1,t=0){super([1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2],e,t),this.type=`OctahedronGeometry`,this.parameters={radius:e,detail:t}}static fromJSON(t){return new e(t.radius,t.detail)}},yi=class e extends lr{constructor(e=1,t=1,n=1,r=1){super(),this.type=`PlaneGeometry`,this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let i=e/2,a=t/2,o=Math.floor(n),s=Math.floor(r),c=o+1,l=s+1,u=e/o,d=t/s,f=[],p=[],m=[],h=[];for(let e=0;e<l;e++){let t=e*d-a;for(let n=0;n<c;n++){let r=n*u-i;p.push(r,-t,0),m.push(0,0,1),h.push(n/o),h.push(1-e/s)}}for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=t+c*e,r=t+c*(e+1),i=t+1+c*(e+1),a=t+1+c*e;f.push(n,r,a),f.push(r,i,a)}this.setIndex(f),this.setAttribute(`position`,new Zn(p,3)),this.setAttribute(`normal`,new Zn(m,3)),this.setAttribute(`uv`,new Zn(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}},bi=class e extends lr{constructor(e=.5,t=1,n=32,r=1,i=0,a=Math.PI*2){super(),this.type=`RingGeometry`,this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:r,thetaStart:i,thetaLength:a},n=Math.max(3,n),r=Math.max(1,r);let o=[],s=[],c=[],l=[],u=e,d=(t-e)/r,f=new U,p=new H;for(let e=0;e<=r;e++){for(let e=0;e<=n;e++){let r=i+e/n*a;f.x=u*Math.cos(r),f.y=u*Math.sin(r),s.push(f.x,f.y,f.z),c.push(0,0,1),p.x=(f.x/t+1)/2,p.y=(f.y/t+1)/2,l.push(p.x,p.y)}u+=d}for(let e=0;e<r;e++){let t=e*(n+1);for(let e=0;e<n;e++){let r=e+t,i=r,a=r+n+1,s=r+n+2,c=r+1;o.push(i,a,c),o.push(a,s,c)}}this.setIndex(o),this.setAttribute(`position`,new Zn(s,3)),this.setAttribute(`normal`,new Zn(c,3)),this.setAttribute(`uv`,new Zn(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}},xi=class e extends lr{constructor(e=1,t=32,n=16,r=0,i=Math.PI*2,a=0,o=Math.PI){super(),this.type=`SphereGeometry`,this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:r,phiLength:i,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let s=Math.min(a+o,Math.PI),c=0,l=[],u=new U,d=new U,f=[],p=[],m=[],h=[];for(let f=0;f<=n;f++){let g=[],_=f/n,v=a+_*o,y=e*Math.cos(v),b=Math.sqrt(e*e-y*y),x=0;f===0&&a===0?x=.5/t:f===n&&s===Math.PI&&(x=-.5/t);for(let e=0;e<=t;e++){let n=e/t,a=r+n*i;u.x=-b*Math.cos(a),u.y=y,u.z=b*Math.sin(a),p.push(u.x,u.y,u.z),d.copy(u).normalize(),m.push(d.x,d.y,d.z),h.push(n+x,1-_),g.push(c++)}l.push(g)}for(let e=0;e<n;e++)for(let r=0;r<t;r++){let t=l[e][r+1],i=l[e][r],o=l[e+1][r],c=l[e+1][r+1];(e!==0||a>0)&&f.push(t,i,c),(e!==n-1||s<Math.PI)&&f.push(i,o,c)}this.setIndex(f),this.setAttribute(`position`,new Zn(p,3)),this.setAttribute(`normal`,new Zn(m,3)),this.setAttribute(`uv`,new Zn(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}},Si=class e extends lr{constructor(e=1,t=.4,n=12,r=48,i=Math.PI*2,a=0,o=Math.PI*2){super(),this.type=`TorusGeometry`,this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:r,arc:i,thetaStart:a,thetaLength:o},n=Math.floor(n),r=Math.floor(r);let s=[],c=[],l=[],u=[],d=new U,f=new U,p=new U;for(let s=0;s<=n;s++){let m=a+s/n*o;for(let a=0;a<=r;a++){let o=a/r*i;f.x=(e+t*Math.cos(m))*Math.cos(o),f.y=(e+t*Math.cos(m))*Math.sin(o),f.z=t*Math.sin(m),c.push(f.x,f.y,f.z),d.x=e*Math.cos(o),d.y=e*Math.sin(o),p.subVectors(f,d).normalize(),l.push(p.x,p.y,p.z),u.push(a/r),u.push(s/n)}}for(let e=1;e<=n;e++)for(let t=1;t<=r;t++){let n=(r+1)*e+t-1,i=(r+1)*(e-1)+t-1,a=(r+1)*(e-1)+t,o=(r+1)*e+t;s.push(n,i,o),s.push(i,a,o)}this.setIndex(s),this.setAttribute(`position`,new Zn(c,3)),this.setAttribute(`normal`,new Zn(l,3)),this.setAttribute(`uv`,new Zn(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc,t.thetaStart,t.thetaLength)}};function Ci(e){let t={};for(let n in e){t[n]={};for(let r in e[n]){let i=e[n][r];if(Ti(i))i.isRenderTargetTexture?(z(`UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().`),t[n][r]=null):t[n][r]=i.clone();else if(Array.isArray(i)){if(Ti(i[0])){let e=[];for(let t=0,n=i.length;t<n;t++)e[t]=i[t].clone();t[n][r]=e}else t[n][r]=i.slice()}else t[n][r]=i}}return t}function wi(e){let t={};for(let n=0;n<e.length;n++){let r=Ci(e[n]);for(let e in r)t[e]=r[e]}return t}function Ti(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}function Ei(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function Di(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:G.workingColorSpace}var Oi={clone:Ci,merge:wi},ki=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Ai=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,ji=class extends hr{constructor(e){super(),this.isShaderMaterial=!0,this.type=`ShaderMaterial`,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=ki,this.fragmentShader=Ai,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ci(e.uniforms),this.uniformsGroups=Ei(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let r=this.uniforms[n].value;r&&r.isTexture?t.uniforms[n]={type:`t`,value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[n]={type:`c`,value:r.getHex()}:r&&r.isVector2?t.uniforms[n]={type:`v2`,value:r.toArray()}:r&&r.isVector3?t.uniforms[n]={type:`v3`,value:r.toArray()}:r&&r.isVector4?t.uniforms[n]={type:`v4`,value:r.toArray()}:r&&r.isMatrix3?t.uniforms[n]={type:`m3`,value:r.toArray()}:r&&r.isMatrix4?t.uniforms[n]={type:`m4`,value:r.toArray()}:t.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let e in this.extensions)this.extensions[e]===!0&&(n[e]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let r=e.uniforms[n];switch(this.uniforms[n]={},r.type){case`t`:this.uniforms[n].value=t[r.value]||null;break;case`c`:this.uniforms[n].value=new K().setHex(r.value);break;case`v2`:this.uniforms[n].value=new H().fromArray(r.value);break;case`v3`:this.uniforms[n].value=new U().fromArray(r.value);break;case`v4`:this.uniforms[n].value=new Dt().fromArray(r.value);break;case`m3`:this.uniforms[n].value=new W().fromArray(r.value);break;case`m4`:this.uniforms[n].value=new Mt().fromArray(r.value);break;default:this.uniforms[n].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let t in e.extensions)this.extensions[t]=e.extensions[t];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},Mi=class extends ji{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type=`RawShaderMaterial`}},Ni=class extends hr{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type=`MeshLambertMaterial`,this.color=new K(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new K(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new H(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ht,this.combine=0,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Pi=class extends hr{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type=`MeshDepthMaterial`,this.depthPacking=L,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Fi=class extends hr{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type=`MeshDistanceMaterial`,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Ii(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT==`number`?new t(e):Array.prototype.slice.call(e)}function Li(e){return e!==void 0&&e.inTangents!==void 0&&e.outTangents!==void 0}var Ri=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r===void 0?new t.constructor(n):r,this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],i=t[n-1];validate_interval:{seek:{let a;linear_scan:{forward_scan:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<i)break forward_scan;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(i=r,r=t[++n],e<r)break seek}a=t.length;break linear_scan}if(!(e>=i)){let o=t[1];e<o&&(n=2,i=o);for(let a=n-2;;){if(i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===a)break;if(r=i,i=t[--n-1],e>=i)break seek}a=n,n=0;break linear_scan}break validate_interval}for(;n<a;){let r=n+a>>>1;e<t[r]?a=r:n=r+1}if(r=t[n],i=t[n-1],i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,i,r)}return this.interpolate_(n,i,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r;for(let e=0;e!==r;++e)t[e]=n[i+e];return t}interpolate_(){throw Error(`THREE.Interpolant: Call to abstract method.`)}intervalChanged_(){}},zi=class extends Ri{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Ie,endingEnd:Ie}}intervalChanged_(e,t,n){let r=this.parameterPositions,i=e-2,a=e+1,o=r[i],s=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case I:i=e,o=2*t-n;break;case Le:i=r.length-2,o=t+r[i]-r[i+1];break;default:i=e,o=n}if(s===void 0)switch(this.getSettings_().endingEnd){case I:a=e,s=2*n-t;break;case Le:a=1,s=n+r[1]-r[0];break;default:a=e-1,s=t}let c=(n-t)*.5,l=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(s-n),this._offsetPrev=i*l,this._offsetNext=a*l}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(r-t),m=p*p,h=m*p,g=-d*h+2*d*m-d*p,_=(1+d)*h+(-1.5-2*d)*m+(-.5+d)*p+1,v=(-1-f)*h+(1.5+f)*m+.5*p,y=f*h-f*m;for(let e=0;e!==o;++e)i[e]=g*a[l+e]+_*a[c+e]+v*a[s+e]+y*a[u+e];return i}},Bi=class extends Ri{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=(n-t)/(r-t),u=1-l;for(let e=0;e!==o;++e)i[e]=a[c+e]*u+a[s+e]*l;return i}},Vi=class extends Ri{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},Hi=class extends Ri{interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this.inTangents,u=this.outTangents;if(!l||!u){let e=(n-t)/(r-t),l=1-e;for(let t=0;t!==o;++t)i[t]=a[c+t]*l+a[s+t]*e;return i}let d=o*2,f=e-1;for(let p=0;p!==o;++p){let o=a[c+p],m=a[s+p],h=f*d+p*2,g=u[h],_=u[h+1],v=e*d+p*2,y=l[v],b=l[v+1],x=Gi(n,t,g,y,r);i[p]=Ui(x,o,_,b,m)}return i}};function Ui(e,t,n,r,i){let a=1-e;return a*a*a*t+3*a*a*e*n+3*a*e*e*r+e*e*e*i}function Wi(e,t,n,r,i){let a=1-e;return 3*a*a*(n-t)+6*a*e*(r-n)+3*e*e*(i-r)}function Gi(e,t,n,r,i){let a=(e-t)/(i-t);for(let o=0;o<8;o++){let o=Ui(a,t,n,r,i)-e;if(Math.abs(o)<1e-10)break;let s=Wi(a,t,n,r,i);if(Math.abs(s)<1e-10)break;a=Math.max(0,Math.min(1,a-o/s))}return a}var Ki=class{constructor(e,t,n,r){if(e===void 0)throw Error(`THREE.KeyframeTrack: track name is undefined`);if(t===void 0||t.length===0)throw Error(`THREE.KeyframeTrack: no keyframes in track named `+e);this.name=e,this.times=Ii(t,this.TimeBufferType),this.values=Ii(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Ii(e.times,Array),values:Ii(e.values,Array)};let t=e.getInterpolation();t!==e.DefaultInterpolation&&(n.interpolation=t),Li(e.settings)&&(n.settings={inTangents:Ii(e.settings.inTangents,Array),outTangents:Ii(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Vi(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Bi(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new zi(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new Hi(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Ne:t=this.InterpolantFactoryMethodDiscrete;break;case F:t=this.InterpolantFactoryMethodLinear;break;case Pe:t=this.InterpolantFactoryMethodSmooth;break;case Fe:t=this.InterpolantFactoryMethodBezier}if(t===void 0){let t=`unsupported interpolation for `+this.ValueTypeName+` keyframe track named `+this.name;if(this.createInterpolant===void 0){if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(t)}return z(`KeyframeTrack:`,t),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Ne;case this.InterpolantFactoryMethodLinear:return F;case this.InterpolantFactoryMethodSmooth:return Pe;case this.InterpolantFactoryMethodBezier:return Fe}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e;Li(this.settings)&&(qi(this.settings.inTangents,e),qi(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,r=n.length,i=0,a=r-1;for(;i!==r&&n[i]<e;)++i;for(;a!==-1&&n[a]>t;)--a;if(++a,i!==0||a!==r){i>=a&&(a=Math.max(a,1),i=a-1);let e=this.getValueSize();this.times=n.slice(i,a),this.values=this.values.slice(i*e,a*e)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(B(`KeyframeTrack: Invalid value size in track.`,this),e=!1);let n=this.times,r=this.values,i=n.length;i===0&&(B(`KeyframeTrack: Track is empty.`,this),e=!1);let a=null;for(let t=0;t!==i;t++){let r=n[t];if(typeof r==`number`&&isNaN(r)){B(`KeyframeTrack: Time is not a valid number.`,this,t,r),e=!1;break}if(a!==null&&a>r){B(`KeyframeTrack: Out of order keys.`,this,t,r,a),e=!1;break}a=r}if(r!==void 0&&Ke(r))for(let t=0,n=r.length;t!==n;++t){let n=r[t];if(isNaN(n)){B(`KeyframeTrack: Value is not a valid number.`,this,t,n),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===Pe,i=e.length-1,a=1;for(let o=1;o<i;++o){let i=!1,s=e[o];if(s!==e[o+1]&&(o!==1||s!==e[0])){if(r)i=!0;else{let e=o*n,r=e-n,a=e+n;for(let o=0;o!==n;++o){let n=t[e+o];if(n!==t[r+o]||n!==t[a+o]){i=!0;break}}}}if(i){if(o!==a){e[a]=e[o];let r=o*n,i=a*n;for(let e=0;e!==n;++e)t[i+e]=t[r+e]}++a}}if(i>0){e[a]=e[i];for(let e=i*n,r=a*n,o=0;o!==n;++o)t[r+o]=t[e+o];++a}return a===e.length?(this.times=e,this.values=t):(this.times=e.slice(0,a),this.values=t.slice(0,a*n)),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,Li(this.settings)&&(r.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),r}};function qi(e,t){for(let n=0,r=e.length;n!==r;n+=2)e[n]*=t}Ki.prototype.ValueTypeName=``,Ki.prototype.TimeBufferType=Float32Array,Ki.prototype.ValueBufferType=Float32Array,Ki.prototype.DefaultInterpolation=F;var Ji=class extends Ki{constructor(e,t,n){super(e,t,n)}};Ji.prototype.ValueTypeName=`bool`,Ji.prototype.ValueBufferType=Array,Ji.prototype.DefaultInterpolation=Ne,Ji.prototype.InterpolantFactoryMethodLinear=void 0,Ji.prototype.InterpolantFactoryMethodSmooth=void 0;var Yi=class extends Ki{constructor(e,t,n,r){super(e,t,n,r)}};Yi.prototype.ValueTypeName=`color`;var Xi=class extends Ki{constructor(e,t,n,r){super(e,t,n,r)}};Xi.prototype.ValueTypeName=`number`;var Zi=class extends Ri{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=(n-t)/(r-t),c=e*o;for(let e=c+o;c!==e;c+=4)ut.slerpFlat(i,0,a,c-o,a,c,s);return i}},Qi=class extends Ki{constructor(e,t,n,r){super(e,t,n,r)}InterpolantFactoryMethodLinear(e){return new Zi(this.times,this.values,this.getValueSize(),e)}};Qi.prototype.ValueTypeName=`quaternion`,Qi.prototype.InterpolantFactoryMethodSmooth=void 0;var $i=class extends Ki{constructor(e,t,n){super(e,t,n)}};$i.prototype.ValueTypeName=`string`,$i.prototype.ValueBufferType=Array,$i.prototype.DefaultInterpolation=Ne,$i.prototype.InterpolantFactoryMethodLinear=void 0,$i.prototype.InterpolantFactoryMethodSmooth=void 0;var ea=class extends Ki{constructor(e,t,n,r){super(e,t,n,r)}};ea.prototype.ValueTypeName=`vector`;var ta=class extends on{constructor(e,t=1){super(),this.isLight=!0,this.type=`Light`,this.color=new K(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},na=class extends ta{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type=`HemisphereLight`,this.position.copy(on.DEFAULT_UP),this.updateMatrix(),this.groundColor=new K(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},ra=new Mt,ia=new U,aa=new U,oa=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new H(512,512),this.mapType=l,this.map=null,this.mapPass=null,this.matrix=new Mt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Jr,this._frameExtents=new H(1,1),this._viewportCount=1,this._viewports=[new Dt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;ia.setFromMatrixPosition(e.matrixWorld),t.position.copy(ia),aa.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(aa),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,r){ra.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(ra,e.coordinateSystem,e.reversedDepth);let i=this._frameExtents,a=r?r.z/i.x:1,o=r?r.w/i.y:1,s=r?r.x/i.x:0,c=r?r.y/i.y:0;e.coordinateSystem===2001||e.reversedDepth?t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(ra)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},sa=new U,ca=new ut,la=new U,ua=class extends on{constructor(){super(),this.isCamera=!0,this.type=`Camera`,this.matrixWorldInverse=new Mt,this.projectionMatrix=new Mt,this.projectionMatrixInverse=new Mt,this.coordinateSystem=We,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(sa,ca,la),la.x===1&&la.y===1&&la.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(sa,ca,la.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(sa,ca,la),la.x===1&&la.y===1&&la.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(sa,ca,la.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},da=new U,fa=new H,pa=new H,ma=class extends ua{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type=`PerspectiveCamera`,this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=it*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(rt*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return it*2*Math.atan(Math.tan(rt*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){da.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(da.x,da.y).multiplyScalar(-e/da.z),da.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(da.x,da.y).multiplyScalar(-e/da.z)}getViewSize(e,t){return this.getViewBounds(e,fa,pa),t.subVectors(pa,fa)}setViewOffset(e,t,n,r,i,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(rt*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,i=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let e=a.fullWidth,o=a.fullHeight;i+=a.offsetX*r/e,t-=a.offsetY*n/o,r*=a.width/e,n*=a.height/o}let o=this.filmOffset;o!==0&&(i+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(i,i+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},ha=class extends oa{constructor(){super(new ma(90,1,.5,500)),this.isPointLightShadow=!0}},ga=class extends ta{constructor(e,t,n=0,r=2){super(e,t),this.isPointLight=!0,this.type=`PointLight`,this.distance=n,this.decay=r,this.shadow=new ha}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},_a=class extends ua{constructor(e=-1,t=1,n=1,r=-1,i=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type=`OrthographicCamera`,this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=i,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,i,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,i=n-e,a=n+e,o=r+t,s=r-t;if(this.view!==null&&this.view.enabled){let e=(this.right-this.left)/this.view.fullWidth/this.zoom,t=(this.top-this.bottom)/this.view.fullHeight/this.zoom;i+=e*this.view.offsetX,a=i+e*this.view.width,o-=t*this.view.offsetY,s=o-t*this.view.height}this.projectionMatrix.makeOrthographic(i,a,o,s,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},va=class extends oa{constructor(){super(new _a(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},ya=class extends ta{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type=`DirectionalLight`,this.position.copy(on.DEFAULT_UP),this.updateMatrix(),this.target=new on,this.shadow=new va}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},ba=class extends ta{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type=`AmbientLight`}},xa=-90,Sa=1,Ca=class extends on{constructor(e,t,n){super(),this.type=`CubeCamera`,this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new ma(xa,Sa,e,t);r.layers=this.layers,this.add(r);let i=new ma(xa,Sa,e,t);i.layers=this.layers,this.add(i);let a=new ma(xa,Sa,e,t);a.layers=this.layers,this.add(a);let o=new ma(xa,Sa,e,t);o.layers=this.layers,this.add(o);let s=new ma(xa,Sa,e,t);s.layers=this.layers,this.add(s);let c=new ma(xa,Sa,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,i,a,o,s]=t;for(let e of t)this.remove(e);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),i.up.set(0,0,-1),i.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),s.up.set(0,1,0),s.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),i.up.set(0,0,1),i.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),s.up.set(0,-1,0),s.lookAt(0,0,-1);else throw Error(`THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: `+e);for(let e of t)this.add(e),e.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[i,a,o,s,c,l]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let m=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let h=!1;h=e.isWebGLRenderer===!0?e.state.buffers.depth.getReversed():e.reversedDepthBuffer,e.setRenderTarget(n,0,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,i),e.setRenderTarget(n,1,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,4,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=m,e.setRenderTarget(n,5,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},wa=class extends ma{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},Ta=`\\[\\]\\.:\\/`,Ea=RegExp(`[\\[\\]\\.:\\/]`,`g`),Da=`[^\\[\\]\\.:\\/]`,Oa=`[^`+Ta.replace(`\\.`,``)+`]`,ka=`((?:WC+[\\/:])*)`.replace(`WC`,Da),Aa=`(WCOD+)?`.replace(`WCOD`,Oa),ja=`(?:\\.(WC+)(?:\\[(.+)\\])?)?`.replace(`WC`,Da),Ma=`\\.(WC+)(?:\\[(.+)\\])?`.replace(`WC`,Da),Na=RegExp(`^`+ka+Aa+ja+Ma+`$`),Pa=[`material`,`materials`,`bones`,`map`],Fa=class{constructor(e,t,n){let r=n||Ia.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,i=n.length;r!==i;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Ia=class e{constructor(t,n,r){this.path=n,this.parsedPath=r||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,r){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,r):new e(t,n,r)}static sanitizeNodeName(e){return e.replace(/\s/g,`_`).replace(Ea,``)}static parseTrackName(e){let t=Na.exec(e);if(t===null)throw Error(`THREE.PropertyBinding: Cannot parse trackName: `+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(`.`);if(r!==void 0&&r!==-1){let e=n.nodeName.substring(r+1);Pa.indexOf(e)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=e)}if(n.propertyName===null||n.propertyName.length===0)throw Error(`THREE.PropertyBinding: can not parse propertyName from trackName: `+e);return n}static findNode(e,t){if(t===void 0||t===``||t===`.`||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(e){for(let r=0;r<e.length;r++){let i=e[r];if(i.name===t||i.uuid===t)return i;let a=n(i.children);if(a)return a}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let t=this.node,n=this.parsedPath,r=n.objectName,i=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){z(`PropertyBinding: No target node found for track: `+this.path+`.`);return}if(r){let e=n.objectIndex;switch(r){case`materials`:if(!t.material){B(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.materials){B(`PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.`,this);return}t=t.material.materials;break;case`bones`:if(!t.skeleton){B(`PropertyBinding: Can not bind to bones as node does not have a skeleton.`,this);return}t=t.skeleton.bones;for(let n=0;n<t.length;n++)if(t[n].name===e){e=n;break}break;case`map`:if(`map`in t){t=t.map;break}if(!t.material){B(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.map){B(`PropertyBinding: Can not bind to material.map as node.material does not have a map.`,this);return}t=t.material.map;break;default:if(t[r]===void 0){B(`PropertyBinding: Can not bind to objectName of node undefined.`,this);return}t=t[r]}if(e!==void 0){if(t[e]===void 0){B(`PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.`,this,t);return}t=t[e]}}let o=t[i];if(o===void 0){let e=n.nodeName;B(`PropertyBinding: Trying to update property for track: `+e+`.`+i+` but it wasn't found.`,t);return}let s=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?s=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(s=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(a!==void 0){if(i===`morphTargetInfluences`){if(!t.geometry){B(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.`,this);return}if(!t.geometry.morphAttributes){B(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.`,this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=a}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][s]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Ia.Composite=Fa,Ia.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},Ia.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},Ia.prototype.GetterByBindingType=[Ia.prototype._getValue_direct,Ia.prototype._getValue_array,Ia.prototype._getValue_arrayElement,Ia.prototype._getValue_toArray],Ia.prototype.SetterByBindingTypeAndVersioning=[[Ia.prototype._setValue_direct,Ia.prototype._setValue_direct_setNeedsUpdate,Ia.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Ia.prototype._setValue_array,Ia.prototype._setValue_array_setNeedsUpdate,Ia.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Ia.prototype._setValue_arrayElement,Ia.prototype._setValue_arrayElement_setNeedsUpdate,Ia.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Ia.prototype._setValue_fromArray,Ia.prototype._setValue_fromArray_setNeedsUpdate,Ia.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var La=new Mt,Ra=class{constructor(e,t,n=0,r=1/0){this.ray=new br(e,t),this.near=n,this.far=r,this.camera=null,this.layers=new Ut,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):B(`Raycaster: Unsupported camera type: `+t.type)}setFromXRController(e){return La.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(La),this}intersectObject(e,t=!0,n=[]){return Ba(e,this,n,t),n.sort(za),n}intersectObjects(e,t=!0,n=[]){for(let r=0,i=e.length;r<i;r++)Ba(e[r],this,n,t);return n.sort(za),n}};function za(e,t){return e.distance-t.distance}function Ba(e,t,n,r){let i=!0;if(e.layers.test(t.layers)&&e.raycast(t,n)===!1&&(i=!1),i===!0&&r===!0){let r=e.children;for(let e=0,i=r.length;e<i;e++)Ba(r[e],t,n,!0)}}(class e{static{e.prototype.isMatrix2=!0}constructor(e,t,n,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,r){let i=this.elements;return i[0]=e,i[2]=t,i[1]=n,i[3]=r,this}});var Va=class extends si{constructor(e=10,t=10,n=4473924,r=8947848){n=new K(n),r=new K(r);let i=t/2,a=e/t,o=e/2,s=[],c=[];for(let e=0,l=0,u=-o;e<=t;e++,u+=a){s.push(-o,0,u,o,0,u),s.push(u,0,-o,u,0,o);let t=e===i?n:r;t.toArray(c,l),l+=3,t.toArray(c,l),l+=3,t.toArray(c,l),l+=3,t.toArray(c,l),l+=3}let l=new lr;l.setAttribute(`position`,new Zn(s,3)),l.setAttribute(`color`,new Zn(c,3));let u=new Yr({vertexColors:!0,toneMapped:!1});super(l,u),this.type=`GridHelper`}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose()}};function Ha(e,t,n,r){let i=Ua(r);switch(n){case S:return e*t;case D:return e*t/i.components*i.byteLength;case O:return e*t/i.components*i.byteLength;case k:return e*t*2/i.components*i.byteLength;case A:return e*t*2/i.components*i.byteLength;case C:return e*t*3/i.components*i.byteLength;case w:return e*t*4/i.components*i.byteLength;case ee:return e*t*4/i.components*i.byteLength;case j:case te:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case M:case ne:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case re:case ae:return Math.max(e,16)*Math.max(t,8)/4;case N:case ie:return Math.max(e,8)*Math.max(t,8)/2;case oe:case se:case le:case P:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case ce:case ue:case de:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case fe:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case pe:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case me:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case he:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case ge:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case _e:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case ve:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case ye:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case be:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case xe:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case Se:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case Ce:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case we:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case Te:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case Ee:case De:case Oe:return Math.ceil(e/4)*Math.ceil(t/4)*16;case ke:case Ae:return Math.ceil(e/4)*Math.ceil(t/4)*8;case je:case Me:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw Error(`Unable to determine texture byte length for ${n} format.`)}function Ua(e){switch(e){case l:case u:return{byteLength:1,components:1};case f:case d:case g:return{byteLength:2,components:1};case _:case v:return{byteLength:2,components:4};case m:case p:case h:return{byteLength:4,components:1};case b:case x:return{byteLength:4,components:3}}throw Error(`THREE.TextureUtils: Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`register`,{detail:{revision:`186`}})),typeof window<`u`&&(window.__THREE__?z(`WARNING: Multiple instances of Three.js being imported.`):window.__THREE__=`186`);function Wa(){let e=null,t=!1,n=null,r=null;function i(t,a){r=e.requestAnimationFrame(i),n(t,a)}return{start:function(){t!==!0&&n!==null&&e!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function Ga(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var Y={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cube_uv_reflection_fragment:`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lightprobes_pars_fragment:`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distance_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distance_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},X={common:{diffuse:{value:new K(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new W},alphaMap:{value:null},alphaMapTransform:{value:new W},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new W}},envmap:{envMap:{value:null},envMapRotation:{value:new W},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new W}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new W}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new W},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new W},normalScale:{value:new H(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new W},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new W}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new W}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new W}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new K(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new U},probesMax:{value:new U},probesResolution:{value:new U}},points:{diffuse:{value:new K(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new W},alphaTest:{value:0},uvTransform:{value:new W}},sprite:{diffuse:{value:new K(16777215)},opacity:{value:1},center:{value:new H(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new W},alphaMap:{value:null},alphaMapTransform:{value:new W},alphaTest:{value:0}}},Ka={basic:{uniforms:wi([X.common,X.specularmap,X.envmap,X.aomap,X.lightmap,X.fog]),vertexShader:Y.meshbasic_vert,fragmentShader:Y.meshbasic_frag},lambert:{uniforms:wi([X.common,X.specularmap,X.envmap,X.aomap,X.lightmap,X.emissivemap,X.bumpmap,X.normalmap,X.displacementmap,X.fog,X.lights,{emissive:{value:new K(0)},envMapIntensity:{value:1}}]),vertexShader:Y.meshlambert_vert,fragmentShader:Y.meshlambert_frag},phong:{uniforms:wi([X.common,X.specularmap,X.envmap,X.aomap,X.lightmap,X.emissivemap,X.bumpmap,X.normalmap,X.displacementmap,X.fog,X.lights,{emissive:{value:new K(0)},specular:{value:new K(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Y.meshphong_vert,fragmentShader:Y.meshphong_frag},standard:{uniforms:wi([X.common,X.envmap,X.aomap,X.lightmap,X.emissivemap,X.bumpmap,X.normalmap,X.displacementmap,X.roughnessmap,X.metalnessmap,X.fog,X.lights,{emissive:{value:new K(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Y.meshphysical_vert,fragmentShader:Y.meshphysical_frag},toon:{uniforms:wi([X.common,X.aomap,X.lightmap,X.emissivemap,X.bumpmap,X.normalmap,X.displacementmap,X.gradientmap,X.fog,X.lights,{emissive:{value:new K(0)}}]),vertexShader:Y.meshtoon_vert,fragmentShader:Y.meshtoon_frag},matcap:{uniforms:wi([X.common,X.bumpmap,X.normalmap,X.displacementmap,X.fog,{matcap:{value:null}}]),vertexShader:Y.meshmatcap_vert,fragmentShader:Y.meshmatcap_frag},points:{uniforms:wi([X.points,X.fog]),vertexShader:Y.points_vert,fragmentShader:Y.points_frag},dashed:{uniforms:wi([X.common,X.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Y.linedashed_vert,fragmentShader:Y.linedashed_frag},depth:{uniforms:wi([X.common,X.displacementmap]),vertexShader:Y.depth_vert,fragmentShader:Y.depth_frag},normal:{uniforms:wi([X.common,X.bumpmap,X.normalmap,X.displacementmap,{opacity:{value:1}}]),vertexShader:Y.meshnormal_vert,fragmentShader:Y.meshnormal_frag},sprite:{uniforms:wi([X.sprite,X.fog]),vertexShader:Y.sprite_vert,fragmentShader:Y.sprite_frag},background:{uniforms:{uvTransform:{value:new W},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Y.background_vert,fragmentShader:Y.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new W}},vertexShader:Y.backgroundCube_vert,fragmentShader:Y.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Y.cube_vert,fragmentShader:Y.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Y.equirect_vert,fragmentShader:Y.equirect_frag},distance:{uniforms:wi([X.common,X.displacementmap,{referencePosition:{value:new U},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Y.distance_vert,fragmentShader:Y.distance_frag},shadow:{uniforms:wi([X.lights,X.fog,{color:{value:new K(0)},opacity:{value:1}}]),vertexShader:Y.shadow_vert,fragmentShader:Y.shadow_frag}};Ka.physical={uniforms:wi([Ka.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new W},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new W},clearcoatNormalScale:{value:new H(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new W},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new W},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new W},sheen:{value:0},sheenColor:{value:new K(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new W},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new W},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new W},transmissionSamplerSize:{value:new H},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new W},attenuationDistance:{value:0},attenuationColor:{value:new K(0)},specularColor:{value:new K(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new W},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new W},anisotropyVector:{value:new H},anisotropyMap:{value:null},anisotropyMapTransform:{value:new W}}]),vertexShader:Y.meshphysical_vert,fragmentShader:Y.meshphysical_frag};var qa={r:0,b:0,g:0},Ja=new Mt,Ya=new W;Ya.set(-1,0,0,0,1,0,0,0,1);function Xa(e,t,n,r,i,a){let o=new K(0),s=i===!0?0:1,c,l,u=null,d=0,f=null;function p(e){let n=e.isScene===!0?e.background:null;if(n&&n.isTexture){let r=e.backgroundBlurriness>0;n=t.get(n,r)}return n}function m(t){let r=!1,i=p(t);i===null?g(o,s):i&&i.isColor&&(g(i,1),r=!0);let c=e.xr.getEnvironmentBlendMode();c===`additive`?n.buffers.color.setClear(0,0,0,1,a):c===`alpha-blend`&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||r)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function h(t,n){let i=p(n);i&&(i.isCubeTexture||i.mapping===306)?(l===void 0&&(l=new q(new J(1,1,1),new ji({name:`BackgroundCubeMaterial`,uniforms:Ci(Ka.backgroundCube.uniforms),vertexShader:Ka.backgroundCube.vertexShader,fragmentShader:Ka.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),l.geometry.deleteAttribute(`uv`),l.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(l)),l.material.uniforms.envMap.value=i,l.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(Ja.makeRotationFromEuler(n.backgroundRotation)).transpose(),i.isCubeTexture&&i.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(Ya),l.material.toneMapped=G.getTransfer(i.colorSpace)!==Be,(u!==i||d!==i.version||f!==e.toneMapping)&&(l.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null)):i&&i.isTexture&&(c===void 0&&(c=new q(new yi(2,2),new ji({name:`BackgroundMaterial`,uniforms:Ci(Ka.background.uniforms),vertexShader:Ka.background.vertexShader,fragmentShader:Ka.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute(`normal`),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=i,c.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,c.material.toneMapped=G.getTransfer(i.colorSpace)!==Be,i.matrixAutoUpdate===!0&&i.updateMatrix(),c.material.uniforms.uvTransform.value.copy(i.matrix),(u!==i||d!==i.version||f!==e.toneMapping)&&(c.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),c.layers.enableAll(),t.unshift(c,c.geometry,c.material,0,0,null))}function g(t,r){t.getRGB(qa,Di(e)),n.buffers.color.setClear(qa.r,qa.g,qa.b,r,a)}function _(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(e,t=1){o.set(e),s=t,g(o,s)},getClearAlpha:function(){return s},setClearAlpha:function(e){s=e,g(o,s)},render:m,addToRenderList:h,dispose:_}}function Za(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(n,s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n,i){let a=i.wireframe===!0,o=r[t.id];o===void 0&&(o={},r[t.id]=o);let s=e.isInstancedMesh===!0?e.id:0,l=o[s];l===void 0&&(l={},o[s]=l);let u=l[n.id];u===void 0&&(u={},l[n.id]=u);let d=u[a];return d===void 0&&(d=f(c()),u[a]=d),d}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.stride,p=s.offset;if(t.isInstancedInterleavedBuffer){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){T();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e.id]}function C(e){for(let t in r){let n=r[t];for(let t in n){let r=n[t];if(r[e.id]===void 0)continue;let i=r[e.id];for(let e in i)u(i[e].object),delete i[e];delete r[e.id]}}}function w(e){for(let t in r){let n=r[t],i=e.isInstancedMesh===!0?e.id:0,a=n[i];if(a!==void 0){for(let e in a){let t=a[e];for(let e in t)u(t[e].object),delete t[e];delete a[e]}delete n[i],Object.keys(n).length===0&&delete r[t]}}}function T(){E(),o=!0,a!==i&&(a=i,l(a.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:T,resetDefaultState:E,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfObject:w,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function Qa(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s}function $a(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return t===1023||r.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&n!==1015&&!i&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE))}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(z(`WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.logarithmicDepthBuffer===!0,f=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`);n.reversedDepthBuffer===!0&&f===!1&&z(`WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.`);let p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=e.getParameter(e.MAX_SAMPLES),S=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,maxSamples:x,samples:S}}function eo(e){let t=this,n=null,r=0,i=!1,a=!1,o=new pr,s=new W,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}var to=4,no=6,ro=20,io=256,ao=new _a,oo=new K,so=null,co=0,lo=0,uo=!1,fo=new U,po=new U,mo=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=fo}=i;so=this._renderer.getRenderTarget(),co=this._renderer.getActiveCubeFace(),lo=this._renderer.getActiveMipmapLevel(),uo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s,o),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=xo(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=bo(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=2**this._lodMax}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(so,co,lo),this._renderer.xr.enabled=uo,e.scissorTest=!1,_o(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),so=this._renderer.getRenderTarget(),co=this._renderer.getActiveCubeFace(),lo=this._renderer.getActiveMipmapLevel(),uo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:o,minFilter:o,generateMipmaps:!1,type:g,format:w,colorSpace:R,depthBuffer:!1},r=go(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=go(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=ho(r)),this._blurMaterial=yo(r,e,t),this._ggxMaterial=vo(r,e,t)}return r}_compileMaterial(e){let t=new q(new lr,e);this._renderer.compile(t,ao)}_sceneToCubeUV(e,t,n,r,i){let a=new ma(90,1,t,n),o=[1,-1,1,1,1,1],s=[1,1,1,-1,-1,-1],c=this._renderer,l=c.autoClear,u=c.toneMapping;c.getClearColor(oo),c.toneMapping=0,c.autoClear=!1,c.state.buffers.depth.getReversed()&&(c.setRenderTarget(r),c.clearDepth(),c.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new q(new J,new xr({name:`PMREM.Background`,side:1,depthWrite:!1,depthTest:!1})));let d=this._backgroundBox,f=d.material,p=!1,m=e.background;m?m.isColor&&(f.color.copy(m),e.background=null,p=!0):(f.color.copy(oo),p=!0);for(let t=0;t<6;t++){let n=t%3;n===0?(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x+s[t],i.y,i.z)):n===1?(a.up.set(0,0,o[t]),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y+s[t],i.z)):(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y,i.z+s[t]));let l=this._cubeSize;_o(r,n*l,t>2?l:0,l,l),c.setRenderTarget(r),p&&c.render(d,a),c.render(e,a)}c.toneMapping=u,c.autoClear=l,e.background=m}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===301||e.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=xo()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=bo());let i=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=i;let o=i.uniforms;o.envMap.value=e;let s=this._cubeSize;_o(t,0,0,3*s,2*s),n.setRenderTarget(t),n.render(a,ao)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodMeshes.length;for(let t=1;t<r;t++)this._applyGGXFilter(e,t-1,t);t.autoClear=n}_applyGGXFilter(e,t,n){let r=this._renderer,i=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let s=a.uniforms,c=n/(this._lodMeshes.length-1),l=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-l*l)*(c*1.25),{_lodMax:d}=this,f=this._sizeLods[n],p=3*f*(n>d-to?n-d+to:0),m=4*(this._cubeSize-f);s.envMap.value=e.texture,s.roughness.value=u,s.mipInt.value=d-t,_o(i,p,m,3*f,2*f),r.setRenderTarget(i),r.render(o,ao),s.envMap.value=i.texture,s.roughness.value=0,s.mipInt.value=d-n,_o(e,p,m,3*f,2*f),r.setRenderTarget(e),r.render(o,ao)}_blur(e,t,n,r){let i=this._pingPongRenderTarget,a=Math.min(r,Math.PI)/Math.SQRT2;this._blurPass(e,i,t,n,a),this._blurPass(i,e,n,n,a)}_blurPass(e,t,n,r,i){let a=this._renderer,o=this._blurMaterial,s=this._lodMeshes[r];s.material=o;let c=o.uniforms;c.envMap.value=e.texture,c.sigma.value=i,c.mipInt.value=this._lodMax-n;let l=this._sizeLods[r];_o(t,3*l*(r>this._lodMax-to?r-this._lodMax+to:0),4*(this._cubeSize-l),3*l,2*l),a.setRenderTarget(t),a.render(s,ao)}};function ho(e){let t=[],n=[],r=e,i=e-to+1+no;for(let e=0;e<i;e++){let e=2**r;t.push(e);let i=1/(e-2),a=-i,o=1+i,s=[a,a,o,a,o,o,a,a,o,o,a,o],c=new Float32Array(108),l=new Float32Array(108);for(let e=0;e<6;e++){let t=e%3*2/3-1,n=e>2?0:-1,r=[t,n,0,t+2/3,n,0,t+2/3,n+1,0,t,n,0,t+2/3,n+1,0,t,n+1,0];c.set(r,18*e);for(let t=0;t<6;t++){let n=s[t*2]*2-1,r=s[t*2+1]*2-1;e===0?po.set(1,r,n):e===1?po.set(-n,1,-r):e===2?po.set(-n,r,1):e===3?po.set(-1,r,-n):e===4?po.set(-n,-1,r):po.set(n,r,-1),po.toArray(l,(e*6+t)*3)}}let u=new lr;u.setAttribute(`position`,new Jn(c,3)),u.setAttribute(`outputDirection`,new Jn(l,3)),n.push(new q(u,null)),r>to&&r--}return{lodMeshes:n,sizeLods:t}}function go(e,t,n){let r=new kt(e,t,n);return r.texture.mapping=306,r.texture.name=`PMREM.cubeUv`,r.scissorTest=!0,r}function _o(e,t,n,r,i){e.viewport.set(t,n,r,i),e.scissor.set(t,n,r,i)}function vo(e,t,n){return new ji({name:`PMREMGGXConvolution`,defines:{GGX_SAMPLES:io,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:So(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function yo(e,t,n){return new ji({name:`SphericalGaussianBlur`,defines:{SAMPLES:ro,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:So(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function bo(){return new ji({name:`EquirectangularToCubeUV`,uniforms:{envMap:{value:null}},vertexShader:So(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function xo(){return new ji({name:`CubemapToCubeUV`,uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:So(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function So(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var Co=class extends kt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new ci(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new J(5,5,5),i=new ji({name:`CubemapFromEquirect`,uniforms:Ci(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new q(r,i),s=t.minFilter;return t.minFilter===1008&&(t.minFilter=o),new Ca(1,10,this).update(e,a),t.minFilter=s,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}};function wo(e){let t=new WeakMap,n=new WeakMap,r=null;function i(e,t=!1){return e==null?null:t?o(e):a(e)}function a(n){if(n&&n.isTexture){let r=n.mapping;if(r===303||r===304){if(t.has(n)){let e=t.get(n).texture;return s(e,n.mapping)}{let r=n.image;if(r&&r.height>0){let i=new Co(r.height);return i.fromEquirectangularTexture(e,n),t.set(n,i),n.addEventListener(`dispose`,l),s(i.texture,n.mapping)}return null}}}return n}function o(t){if(t&&t.isTexture){let i=t.mapping,a=i===303||i===304,o=i===301||i===302;if(a||o){let i=n.get(t),s=i===void 0?0:i.texture.pmremVersion;if(t.isRenderTargetTexture&&t.pmremVersion!==s)return r===null&&(r=new mo(e)),i=a?r.fromEquirectangular(t,i):r.fromCubemap(t,i),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),i.texture;if(i!==void 0)return i.texture;{let s=t.image;return a&&s&&s.height>0||o&&s&&c(s)?(r===null&&(r=new mo(e)),i=a?r.fromEquirectangular(t):r.fromCubemap(t),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),t.addEventListener(`dispose`,u),i.texture):null}}}return t}function s(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function c(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function l(e){let n=e.target;n.removeEventListener(`dispose`,l);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function u(e){let t=e.target;t.removeEventListener(`dispose`,u);let r=n.get(t);r!==void 0&&(n.delete(t),r.dispose())}function d(){t=new WeakMap,n=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:d}}function To(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r=e.getExtension(n);return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&Qe(`WebGLRenderer: `+e+` extension not supported.`),t}}}function Eo(e,t,n,r){let i={},a=new WeakMap;function o(e){let s=e.target;s.index!==null&&t.remove(s.index);for(let e in s.attributes)t.remove(s.attributes[e]);s.removeEventListener(`dispose`,o),delete i[s.id];let c=a.get(s);c&&(t.remove(c),a.delete(s)),r.releaseStatesOfGeometry(s),s.isInstancedBufferGeometry===!0&&delete s._maxInstanceCount,n.memory.geometries--}function s(e,t){return i[t.id]===!0?t:(t.addEventListener(`dispose`,o),i[t.id]=!0,n.memory.geometries++,t)}function c(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function l(e){let n=[],r=e.index,i=e.attributes.position,o=0;if(i===void 0)return;if(r!==null){let e=r.array;o=r.version;for(let t=0,r=e.length;t<r;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];n.push(r,i,i,a,a,r)}}else{let e=i.array;o=i.version;for(let t=0,r=e.length/3-1;t<r;t+=3){let e=t+0,r=t+1,i=t+2;n.push(e,r,r,i,i,e)}}let s=new(i.count>=65535?Xn:Yn)(n,1);s.version=o;let c=a.get(e);c&&t.remove(c),a.set(e,s)}function u(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&l(e)}else l(e);return a.get(e)}return{get:s,update:c,getWireframeAttribute:u}}function Do(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function Oo(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:B(`WebGLInfo: Unknown draw mode:`,r)}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function ko(e,t,n){let r=new WeakMap,i=new Dt;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let g=new Float32Array(p*m*4*u),_=new At(g,p,m,u);_.type=h,_.needsUpdate=!0;let v=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*m*4*t;for(let t=0;t<r.count;t++){let s=t*v;e===!0&&(i.fromBufferAttribute(r,t),g[d+s+0]=i.x,g[d+s+1]=i.y,g[d+s+2]=i.z,g[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),g[d+s+4]=i.x,g[d+s+5]=i.y,g[d+s+6]=i.z,g[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),g[d+s+8]=i.x,g[d+s+9]=i.y,g[d+s+10]=i.z,g[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:_,size:new H(p,m)},r.set(o,d);function y(){_.dispose(),r.delete(o),o.removeEventListener(`dispose`,y)}o.addEventListener(`dispose`,y)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function Ao(e,t,n,r,i){let a=new WeakMap;function o(r){let o=i.render.frame,s=r.geometry,l=t.get(r,s);if(a.get(l)!==o&&(t.update(l),a.set(l,o)),r.isInstancedMesh&&(r.hasEventListener(`dispose`,c)===!1&&r.addEventListener(`dispose`,c),a.get(r)!==o&&(n.update(r.instanceMatrix,e.ARRAY_BUFFER),r.instanceColor!==null&&n.update(r.instanceColor,e.ARRAY_BUFFER),a.set(r,o))),r.isSkinnedMesh){let e=r.skeleton;a.get(e)!==o&&(e.update(),a.set(e,o))}return l}function s(){a=new WeakMap}function c(e){let t=e.target;t.removeEventListener(`dispose`,c),r.releaseStatesOfObject(t),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:o,dispose:s}}var jo={1:`LINEAR_TONE_MAPPING`,2:`REINHARD_TONE_MAPPING`,3:`CINEON_TONE_MAPPING`,4:`ACES_FILMIC_TONE_MAPPING`,6:`AGX_TONE_MAPPING`,7:`NEUTRAL_TONE_MAPPING`,5:`CUSTOM_TONE_MAPPING`};function Mo(e,t,n,r,i,a){let o=new kt(t,n,{type:e,depthBuffer:i,stencilBuffer:a,samples:r?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),s=null,c=null,l=new lr;l.setAttribute(`position`,new Zn([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute(`uv`,new Zn([0,2,0,0,2,0],2));let u=new Mi({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new q(l,u),f=new _a(-1,1,1,-1,0,1),p=null,m=null,h=!1,_,v=null,y=[],b=!1;this.setSize=function(e,t){o.setSize(e,t),s!==null&&s.setSize(e,t),c!==null&&c.setSize(e,t);for(let n=0;n<y.length;n++){let r=y[n];r.setSize&&r.setSize(e,t)}},this.setEffects=function(e){y=e,b=y.length>0&&y[0].isRenderPass===!0;let t=o.width,n=o.height;y.length>0&&s===null&&(s=new kt(t,n,{type:g,depthBuffer:!1,stencilBuffer:!1}),c=new kt(t,n,{type:g,depthBuffer:!1,stencilBuffer:!1}));for(let e=0;e<y.length;e++){let r=y[e];r.setSize&&r.setSize(t,n)}},this.begin=function(e,t){if(h||e.toneMapping===0&&y.length===0)return!1;if(v=t,t!==null){let e=t.width,n=t.height;(o.width!==e||o.height!==n)&&this.setSize(e,n)}return b===!1&&e.setRenderTarget(o),_=e.toneMapping,e.toneMapping=0,!0},this.hasRenderPass=function(){return b},this.end=function(e,t){e.toneMapping=_,h=!0;let n=o,r=s;for(let i=0;i<y.length;i++){let a=y[i];a.enabled!==!1&&(a.render(e,r,n,t),a.needsSwap!==!1&&(n=r,r=r===s?c:s))}if(p!==e.outputColorSpace||m!==e.toneMapping){p=e.outputColorSpace,m=e.toneMapping,u.defines={},G.getTransfer(p)===`srgb`&&(u.defines.SRGB_TRANSFER=``);let t=jo[m];t&&(u.defines[t]=``),u.needsUpdate=!0}u.uniforms.tDiffuse.value=n.texture,e.setRenderTarget(v),e.render(d,f),v=null,h=!1},this.isCompositing=function(){return h},this.dispose=function(){o.dispose(),s!==null&&s.dispose(),c!==null&&c.dispose(),l.dispose(),u.dispose()}}var No=new Et,Po=new li(1,1),Fo=new At,Io=new jt,Lo=new ci,Ro=[],zo=[],Bo=new Float32Array(16),Vo=new Float32Array(9),Ho=new Float32Array(4);function Uo(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=Ro[i];if(a===void 0&&(a=new Float32Array(i),Ro[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function Wo(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function Go(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function Ko(e,t){let n=zo[t];n===void 0&&(n=new Int32Array(t),zo[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function qo(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function Jo(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Wo(n,t))return;e.uniform2fv(this.addr,t),Go(n,t)}}function Yo(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(Wo(n,t))return;e.uniform3fv(this.addr,t),Go(n,t)}}function Xo(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Wo(n,t))return;e.uniform4fv(this.addr,t),Go(n,t)}}function Zo(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Wo(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),Go(n,t)}else{if(Wo(n,r))return;Ho.set(r),e.uniformMatrix2fv(this.addr,!1,Ho),Go(n,r)}}function Qo(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Wo(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),Go(n,t)}else{if(Wo(n,r))return;Vo.set(r),e.uniformMatrix3fv(this.addr,!1,Vo),Go(n,r)}}function $o(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Wo(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),Go(n,t)}else{if(Wo(n,r))return;Bo.set(r),e.uniformMatrix4fv(this.addr,!1,Bo),Go(n,r)}}function es(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function ts(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Wo(n,t))return;e.uniform2iv(this.addr,t),Go(n,t)}}function ns(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Wo(n,t))return;e.uniform3iv(this.addr,t),Go(n,t)}}function rs(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Wo(n,t))return;e.uniform4iv(this.addr,t),Go(n,t)}}function is(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function as(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Wo(n,t))return;e.uniform2uiv(this.addr,t),Go(n,t)}}function os(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Wo(n,t))return;e.uniform3uiv(this.addr,t),Go(n,t)}}function ss(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Wo(n,t))return;e.uniform4uiv(this.addr,t),Go(n,t)}}function cs(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;this.type===e.SAMPLER_2D_SHADOW?(Po.compareFunction=n.isReversedDepthBuffer()?518:515,a=Po):a=No,n.setTexture2D(t||a,i)}function ls(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||Io,i)}function us(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTextureCube(t||Lo,i)}function ds(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||Fo,i)}function fs(e){switch(e){case 5126:return qo;case 35664:return Jo;case 35665:return Yo;case 35666:return Xo;case 35674:return Zo;case 35675:return Qo;case 35676:return $o;case 5124:case 35670:return es;case 35667:case 35671:return ts;case 35668:case 35672:return ns;case 35669:case 35673:return rs;case 5125:return is;case 36294:return as;case 36295:return os;case 36296:return ss;case 35678:case 36198:case 36298:case 36306:case 35682:return cs;case 35679:case 36299:case 36307:return ls;case 35680:case 36300:case 36308:case 36293:return us;case 36289:case 36303:case 36311:case 36292:return ds}}function ps(e,t){e.uniform1fv(this.addr,t)}function ms(e,t){let n=Uo(t,this.size,2);e.uniform2fv(this.addr,n)}function hs(e,t){let n=Uo(t,this.size,3);e.uniform3fv(this.addr,n)}function gs(e,t){let n=Uo(t,this.size,4);e.uniform4fv(this.addr,n)}function _s(e,t){let n=Uo(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function vs(e,t){let n=Uo(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function ys(e,t){let n=Uo(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function bs(e,t){e.uniform1iv(this.addr,t)}function xs(e,t){e.uniform2iv(this.addr,t)}function Ss(e,t){e.uniform3iv(this.addr,t)}function Cs(e,t){e.uniform4iv(this.addr,t)}function ws(e,t){e.uniform1uiv(this.addr,t)}function Ts(e,t){e.uniform2uiv(this.addr,t)}function Es(e,t){e.uniform3uiv(this.addr,t)}function Ds(e,t){e.uniform4uiv(this.addr,t)}function Os(e,t,n){let r=this.cache,i=t.length,a=Ko(n,i);Wo(r,a)||(e.uniform1iv(this.addr,a),Go(r,a));let o;o=this.type===e.SAMPLER_2D_SHADOW?Po:No;for(let e=0;e!==i;++e)n.setTexture2D(t[e]||o,a[e])}function ks(e,t,n){let r=this.cache,i=t.length,a=Ko(n,i);Wo(r,a)||(e.uniform1iv(this.addr,a),Go(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||Io,a[e])}function As(e,t,n){let r=this.cache,i=t.length,a=Ko(n,i);Wo(r,a)||(e.uniform1iv(this.addr,a),Go(r,a));for(let e=0;e!==i;++e)n.setTextureCube(t[e]||Lo,a[e])}function js(e,t,n){let r=this.cache,i=t.length,a=Ko(n,i);Wo(r,a)||(e.uniform1iv(this.addr,a),Go(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||Fo,a[e])}function Ms(e){switch(e){case 5126:return ps;case 35664:return ms;case 35665:return hs;case 35666:return gs;case 35674:return _s;case 35675:return vs;case 35676:return ys;case 5124:case 35670:return bs;case 35667:case 35671:return xs;case 35668:case 35672:return Ss;case 35669:case 35673:return Cs;case 5125:return ws;case 36294:return Ts;case 36295:return Es;case 36296:return Ds;case 35678:case 36198:case 36298:case 36306:case 35682:return Os;case 35679:case 36299:case 36307:return ks;case 35680:case 36300:case 36308:case 36293:return As;case 36289:case 36303:case 36311:case 36292:return js}}var Ns=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=fs(t.type)}},Ps=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Ms(t.type)}},Fs=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},Is=/(\w+)(\])?(\[|\.)?/g;function Ls(e,t){e.seq.push(t),e.map[t.id]=t}function Rs(e,t,n){let r=e.name,i=r.length;for(Is.lastIndex=0;;){let a=Is.exec(r),o=Is.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){Ls(n,l===void 0?new Ns(s,e,t):new Ps(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new Fs(s),Ls(n,e)),n=e}}}var zs=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);Rs(n,e.getUniformLocation(t,n.name),this)}let r=[],i=[];for(let t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(t):i.push(t);r.length>0&&(this.seq=r.concat(i))}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function Bs(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var Vs=37297,Hs=0;function Us(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var Ws=new W;function Gs(e){G._getMatrix(Ws,G.workingColorSpace,e);let t=`mat3( ${Ws.elements.map(e=>e.toFixed(4))} )`;switch(G.getTransfer(e)){case ze:return[t,`LinearTransferOETF`];case Be:return[t,`sRGBTransferOETF`];default:return z(`WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function Ks(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+Us(e.getShaderSource(t),r)}return i}function qs(e,t){let n=Gs(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,`}`].join(`
`)}var Js={1:`Linear`,2:`Reinhard`,3:`Cineon`,4:`ACESFilmic`,6:`AgX`,7:`Neutral`,5:`Custom`};function Ys(e,t){let n=Js[t];return n===void 0?(z(`WebGLProgram: Unsupported toneMapping:`,t),`vec3 `+e+`( vec3 color ) { return LinearToneMapping( color ); }`):`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var Xs=new U;function Zs(){return G.getLuminanceCoefficients(Xs),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${Xs.x.toFixed(4)}, ${Xs.y.toFixed(4)}, ${Xs.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function Qs(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(tc).join(`
`)}function $s(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function ec(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function tc(e){return e!==``}function nc(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function rc(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var ic=/^[ \t]*#include +<([\w\d./]+)>/gm;function ac(e){return e.replace(ic,sc)}var oc=new Map;function sc(e,t){let n=Y[t];if(n===void 0){let e=oc.get(t);if(e!==void 0)n=Y[e],z(`WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.`,t,e);else throw Error(`THREE.WebGLProgram: Can not resolve #include <`+t+`>`)}return ac(n)}var cc=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function lc(e){return e.replace(cc,uc)}function uc(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function dc(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision===`highp`?t+=`
#define HIGH_PRECISION`:e.precision===`mediump`?t+=`
#define MEDIUM_PRECISION`:e.precision===`lowp`&&(t+=`
#define LOW_PRECISION`),t}var fc={1:`SHADOWMAP_TYPE_PCF`,3:`SHADOWMAP_TYPE_VSM`};function pc(e){return fc[e.shadowMapType]||`SHADOWMAP_TYPE_BASIC`}var mc={301:`ENVMAP_TYPE_CUBE`,302:`ENVMAP_TYPE_CUBE`,306:`ENVMAP_TYPE_CUBE_UV`};function hc(e){return e.envMap===!1?`ENVMAP_TYPE_CUBE`:mc[e.envMapMode]||`ENVMAP_TYPE_CUBE`}var gc={302:`ENVMAP_MODE_REFRACTION`};function _c(e){return e.envMap===!1?`ENVMAP_MODE_REFLECTION`:gc[e.envMapMode]||`ENVMAP_MODE_REFLECTION`}var vc={0:`ENVMAP_BLENDING_MULTIPLY`,1:`ENVMAP_BLENDING_MIX`,2:`ENVMAP_BLENDING_ADD`};function yc(e){return e.envMap===!1?`ENVMAP_BLENDING_NONE`:vc[e.combine]||`ENVMAP_BLENDING_NONE`}function bc(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,r=1/t;return{texelWidth:1/(3*Math.max(2**n,112)),texelHeight:r,maxMip:n}}function xc(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=pc(n),l=hc(n),u=_c(n),d=yc(n),f=bc(n),p=Qs(n),m=$s(a),h=i.createProgram(),g,_,v=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(tc).join(`
`),g.length>0&&(g+=`
`),_=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(tc).join(`
`),_.length>0&&(_+=`
`)):(g=[dc(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexNormals?`#define HAS_NORMAL`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(tc).join(`
`),_=[dc(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,f?`#define CUBEUV_TEXEL_WIDTH `+f.texelWidth:``,f?`#define CUBEUV_TEXEL_HEIGHT `+f.texelHeight:``,f?`#define CUBEUV_MAX_MIP `+f.maxMip+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.packedNormalMap?`#define USE_PACKED_NORMALMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.retroreflection?`#define USE_RETROREFLECTION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas||n.batchingColor?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.numLightProbeGrids>0?`#define USE_LIGHT_PROBES_GRID`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:Y.tonemapping_pars_fragment,n.toneMapping===0?``:Ys(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,Y.colorspace_pars_fragment,qs(`linearToOutputTexel`,n.outputColorSpace),Zs(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(tc).join(`
`)),o=ac(o),o=nc(o,n),o=rc(o,n),s=ac(s),s=nc(s,n),s=rc(s,n),o=lc(o),s=lc(s),n.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[p,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+g,_=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+_);let y=v+g+o,b=v+_+s,x=Bs(i,i.VERTEX_SHADER,y),S=Bs(i,i.FRAGMENT_SHADER,b);i.attachShader(h,x),i.attachShader(h,S),n.index0AttributeName===void 0?n.hasPositionAttribute===!0&&i.bindAttribLocation(h,0,`position`):i.bindAttribLocation(h,0,n.index0AttributeName),i.linkProgram(h);function C(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(h)||``,r=i.getShaderInfoLog(x)||``,a=i.getShaderInfoLog(S)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(h,i.LINK_STATUS)===!1){if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,h,x,S);else{let e=Ks(i,x,`vertex`),n=Ks(i,S,`fragment`);B(`WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(h,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}}else o===``?(s===``||c===``)&&(u=!1):z(`WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:g},fragmentShader:{log:c,prefix:_}})}i.deleteShader(x),i.deleteShader(S),w=new zs(i,h),T=ec(i,h)}let w;this.getUniforms=function(){return w===void 0&&C(this),w};let T;this.getAttributes=function(){return T===void 0&&C(this),T};let E=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=i.getProgramParameter(h,Vs)),E},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(h),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=Hs++,this.cacheKey=t,this.usedTimes=1,this.program=h,this.vertexShader=x,this.fragmentShader=S,this}var Sc=0,Cc=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new wc(e),t.set(e,n)),n}},wc=class{constructor(e){this.id=Sc++,this.code=e,this.usedTimes=0}};function Tc(e){return e===1030||e===37490||e===36285}function Ec(e,t,n,r,i,a){let o=new Ut,s=new Cc,c=new Set,l=[],u=new Map,d=r.logarithmicDepthBuffer,f=r.precision,p={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distance`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function m(e){return c.add(e),e===0?`uv`:`uv${e}`}function h(i,o,l,u,h,g){let _=u.fog,v=h.geometry,y=i.isMeshStandardMaterial||i.isMeshLambertMaterial||i.isMeshPhongMaterial?u.environment:null,b=i.isMeshStandardMaterial||i.isMeshLambertMaterial&&!i.envMap||i.isMeshPhongMaterial&&!i.envMap,x=t.get(i.envMap||y,b),S=x&&x.mapping===306?x.image.height:null,C=p[i.type];i.precision!==null&&(f=r.getMaxPrecision(i.precision),f!==i.precision&&z(`WebGLProgram.getParameters:`,i.precision,`not supported, using`,f,`instead.`));let w=v.morphAttributes.position||v.morphAttributes.normal||v.morphAttributes.color,T=w===void 0?0:w.length,E=0;v.morphAttributes.position!==void 0&&(E=1),v.morphAttributes.normal!==void 0&&(E=2),v.morphAttributes.color!==void 0&&(E=3);let D,O,k,A;if(C){let e=Ka[C];D=e.vertexShader,O=e.fragmentShader}else{D=i.vertexShader,O=i.fragmentShader;let e=s.getVertexShaderStage(i),t=s.getFragmentShaderStage(i);s.update(i,e,t),k=e.id,A=t.id}let ee=e.getRenderTarget(),j=e.state.buffers.depth.getReversed(),te=h.isInstancedMesh===!0,M=h.isBatchedMesh===!0,ne=!!i.map,N=!!i.matcap,re=!!x,ie=!!i.aoMap,ae=!!i.lightMap,oe=!!i.bumpMap&&i.wireframe===!1,se=!!i.normalMap,ce=!!i.displacementMap,le=!!i.emissiveMap,P=!!i.metalnessMap,ue=!!i.roughnessMap,de=i.anisotropy>0,fe=i.clearcoat>0,pe=i.dispersion>0,me=i.retroreflectivity>0,he=i.iridescence>0,ge=i.sheen>0,_e=i.transmission>0,ve=de&&!!i.anisotropyMap,ye=fe&&!!i.clearcoatMap,be=fe&&!!i.clearcoatNormalMap,xe=fe&&!!i.clearcoatRoughnessMap,Se=he&&!!i.iridescenceMap,Ce=he&&!!i.iridescenceThicknessMap,we=ge&&!!i.sheenColorMap,Te=ge&&!!i.sheenRoughnessMap,Ee=!!i.specularMap,De=!!i.specularColorMap,Oe=!!i.specularIntensityMap,ke=_e&&!!i.transmissionMap,Ae=_e&&!!i.thicknessMap,je=!!i.gradientMap,Me=!!i.alphaMap,Ne=i.alphaTest>0,F=!!i.alphaHash,Pe=!!i.extensions,Fe=0;i.toneMapped&&(ee===null||ee.isXRRenderTarget===!0)&&(Fe=e.toneMapping);let Ie={shaderID:C,shaderType:i.type,shaderName:i.name,vertexShader:D,fragmentShader:O,defines:i.defines,customVertexShaderID:k,customFragmentShaderID:A,isRawShaderMaterial:i.isRawShaderMaterial===!0,glslVersion:i.glslVersion,precision:f,batching:M,batchingColor:M&&h._colorsTexture!==null,instancing:te,instancingColor:te&&h.instanceColor!==null,instancingMorph:te&&h.morphTexture!==null,outputColorSpace:ee===null?e.outputColorSpace:ee.isXRRenderTarget===!0?ee.texture.colorSpace:G.workingColorSpace,alphaToCoverage:!!i.alphaToCoverage,map:ne,matcap:N,envMap:re,envMapMode:re&&x.mapping,envMapCubeUVHeight:S,aoMap:ie,lightMap:ae,bumpMap:oe,normalMap:se,displacementMap:ce,emissiveMap:le,normalMapObjectSpace:se&&i.normalMapType===1,normalMapTangentSpace:se&&i.normalMapType===0,packedNormalMap:se&&i.normalMapType===0&&Tc(i.normalMap.format),metalnessMap:P,roughnessMap:ue,anisotropy:de,anisotropyMap:ve,clearcoat:fe,clearcoatMap:ye,clearcoatNormalMap:be,clearcoatRoughnessMap:xe,dispersion:pe,retroreflection:me,iridescence:he,iridescenceMap:Se,iridescenceThicknessMap:Ce,sheen:ge,sheenColorMap:we,sheenRoughnessMap:Te,specularMap:Ee,specularColorMap:De,specularIntensityMap:Oe,transmission:_e,transmissionMap:ke,thicknessMap:Ae,gradientMap:je,opaque:i.transparent===!1&&i.blending===1&&i.alphaToCoverage===!1,alphaMap:Me,alphaTest:Ne,alphaHash:F,combine:i.combine,mapUv:ne&&m(i.map.channel),aoMapUv:ie&&m(i.aoMap.channel),lightMapUv:ae&&m(i.lightMap.channel),bumpMapUv:oe&&m(i.bumpMap.channel),normalMapUv:se&&m(i.normalMap.channel),displacementMapUv:ce&&m(i.displacementMap.channel),emissiveMapUv:le&&m(i.emissiveMap.channel),metalnessMapUv:P&&m(i.metalnessMap.channel),roughnessMapUv:ue&&m(i.roughnessMap.channel),anisotropyMapUv:ve&&m(i.anisotropyMap.channel),clearcoatMapUv:ye&&m(i.clearcoatMap.channel),clearcoatNormalMapUv:be&&m(i.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:xe&&m(i.clearcoatRoughnessMap.channel),iridescenceMapUv:Se&&m(i.iridescenceMap.channel),iridescenceThicknessMapUv:Ce&&m(i.iridescenceThicknessMap.channel),sheenColorMapUv:we&&m(i.sheenColorMap.channel),sheenRoughnessMapUv:Te&&m(i.sheenRoughnessMap.channel),specularMapUv:Ee&&m(i.specularMap.channel),specularColorMapUv:De&&m(i.specularColorMap.channel),specularIntensityMapUv:Oe&&m(i.specularIntensityMap.channel),transmissionMapUv:ke&&m(i.transmissionMap.channel),thicknessMapUv:Ae&&m(i.thicknessMap.channel),alphaMapUv:Me&&m(i.alphaMap.channel),vertexTangents:!!v.attributes.tangent&&(se||de),vertexNormals:!!v.attributes.normal,vertexColors:i.vertexColors,vertexAlphas:i.vertexColors===!0&&!!v.attributes.color&&v.attributes.color.itemSize===4,pointsUvs:h.isPoints===!0&&!!v.attributes.uv&&(ne||Me),fog:!!_,useFog:i.fog===!0,fogExp2:!!_&&_.isFogExp2,flatShading:i.wireframe===!1&&(i.flatShading===!0||v.attributes.normal===void 0&&se===!1&&(i.isMeshLambertMaterial||i.isMeshPhongMaterial||i.isMeshStandardMaterial||i.isMeshPhysicalMaterial)),sizeAttenuation:i.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:j,skinning:h.isSkinnedMesh===!0,hasPositionAttribute:v.attributes.position!==void 0,morphTargets:v.morphAttributes.position!==void 0,morphNormals:v.morphAttributes.normal!==void 0,morphColors:v.morphAttributes.color!==void 0,morphTargetsCount:T,morphTextureStride:E,numSunLights:o.sun.length,numDirLights:o.directional.length,numPointLights:o.point.length,numSpotLights:o.spot.length,numSpotLightMaps:o.spotLightMap.length,numRectAreaLights:o.rectArea.length,numHemiLights:o.hemi.length,numSunLightShadows:o.sunShadowMap.length,numDirLightShadows:o.directionalShadowMap.length,numPointLightShadows:o.pointShadowMap.length,numSpotLightShadows:o.spotShadowMap.length,numSpotLightShadowsWithMaps:o.numSpotLightShadowsWithMaps,numLightProbes:o.numLightProbes,numLightProbeGrids:g.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:i.dithering,shadowMapEnabled:e.shadowMap.enabled&&l.length>0,shadowMapType:e.shadowMap.type,toneMapping:Fe,decodeVideoTexture:ne&&i.map.isVideoTexture===!0&&G.getTransfer(i.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:le&&i.emissiveMap.isVideoTexture===!0&&G.getTransfer(i.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:i.premultipliedAlpha,doubleSided:i.side===2,flipSided:i.side===1,useDepthPacking:i.depthPacking>=0,depthPacking:i.depthPacking||0,index0AttributeName:i.index0AttributeName,extensionClipCullDistance:Pe&&i.extensions.clipCullDistance===!0&&n.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(Pe&&i.extensions.multiDraw===!0||M)&&n.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:n.has(`KHR_parallel_shader_compile`),customProgramCacheKey:i.customProgramCacheKey()};return Ie.vertexUv1s=c.has(1),Ie.vertexUv2s=c.has(2),Ie.vertexUv3s=c.has(3),c.clear(),Ie}function g(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(_(n,t),v(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function _(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapCubeUVHeight),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.morphAttributeCount),e.push(t.numSunLights),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numSunLightShadows),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function v(e,t){o.disableAll(),t.instancing&&o.enable(0),t.instancingColor&&o.enable(1),t.instancingMorph&&o.enable(2),t.matcap&&o.enable(3),t.envMap&&o.enable(4),t.normalMapObjectSpace&&o.enable(5),t.normalMapTangentSpace&&o.enable(6),t.clearcoat&&o.enable(7),t.iridescence&&o.enable(8),t.alphaTest&&o.enable(9),t.vertexColors&&o.enable(10),t.vertexAlphas&&o.enable(11),t.vertexUv1s&&o.enable(12),t.vertexUv2s&&o.enable(13),t.vertexUv3s&&o.enable(14),t.vertexTangents&&o.enable(15),t.anisotropy&&o.enable(16),t.alphaHash&&o.enable(17),t.batching&&o.enable(18),t.dispersion&&o.enable(19),t.retroreflection&&o.enable(24),t.batchingColor&&o.enable(20),t.gradientMap&&o.enable(21),t.packedNormalMap&&o.enable(22),t.vertexNormals&&o.enable(23),e.push(o.mask),o.disableAll(),t.fog&&o.enable(0),t.useFog&&o.enable(1),t.flatShading&&o.enable(2),t.logarithmicDepthBuffer&&o.enable(3),t.reversedDepthBuffer&&o.enable(4),t.skinning&&o.enable(5),t.morphTargets&&o.enable(6),t.morphNormals&&o.enable(7),t.morphColors&&o.enable(8),t.premultipliedAlpha&&o.enable(9),t.shadowMapEnabled&&o.enable(10),t.doubleSided&&o.enable(11),t.flipSided&&o.enable(12),t.useDepthPacking&&o.enable(13),t.dithering&&o.enable(14),t.transmission&&o.enable(15),t.sheen&&o.enable(16),t.opaque&&o.enable(17),t.pointsUvs&&o.enable(18),t.decodeVideoTexture&&o.enable(19),t.decodeVideoTextureEmissive&&o.enable(20),t.alphaToCoverage&&o.enable(21),t.numLightProbeGrids>0&&o.enable(22),t.hasPositionAttribute&&o.enable(23),e.push(o.mask)}function y(e){let t=p[e.type],n;if(t){let e=Ka[t];n=Oi.clone(e.uniforms)}else n=e.uniforms;return n}function b(t,n){let r=u.get(n);return r===void 0?(r=new xc(e,n,t,i),l.push(r),u.set(n,r)):++r.usedTimes,r}function x(e){if(--e.usedTimes===0){let t=l.indexOf(e);l[t]=l[l.length-1],l.pop(),u.delete(e.cacheKey),e.destroy()}}function S(e){s.remove(e)}function C(){s.dispose()}return{getParameters:h,getProgramCacheKey:g,getUniforms:y,acquireProgram:b,releaseProgram:x,releaseShaderCache:S,programs:l,dispose:C}}function Dc(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function Oc(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.materialVariant===t.materialVariant?e.z===t.z?e.id-t.id:e.z-t.z:e.materialVariant-t.materialVariant:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function kc(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function Ac(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function s(n,r,i,a,s,c){let l=e[t];return l===void 0?(l={id:n.id,object:n,geometry:r,material:i,materialVariant:o(n),groupOrder:a,renderOrder:n.renderOrder,z:s,group:c},e[t]=l):(l.id=n.id,l.object=n,l.geometry=r,l.material=i,l.materialVariant=o(n),l.groupOrder=a,l.renderOrder=n.renderOrder,l.z=s,l.group=c),t++,l}function c(e,t,a,o,c,l,u){u.reversedDepth===!0&&(c=-c);let d=s(e,t,a,o,c,l);a.transmission>0?r.push(d):a.transparent===!0?i.push(d):n.push(d)}function l(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function u(e,t){n.length>1&&n.sort(e||Oc),r.length>1&&r.sort(t||kc),i.length>1&&i.sort(t||kc)}function d(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:c,unshift:l,finish:d,sort:u}}function jc(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new Ac,e.set(t,[i])):n>=r.length?(i=new Ac,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function Mc(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={direction:new U,color:new K};break;case`SpotLight`:n={position:new U,direction:new U,color:new K,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new U,color:new K,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new U,skyColor:new K,groundColor:new K};break;case`RectAreaLight`:n={color:new K,position:new U,halfWidth:new U,halfHeight:new U}}return e[t.id]=n,n}}}function Nc(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new H};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new H};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new H,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var Pc=0;function Fc(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function Ic(e){let t=new Mc,n=Nc(),r={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new U);let i=new U,a=new Mt,o=new Mt;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0,y=0,b=0,x=0;i.sort(Fc);for(let e=0,S=i.length;e<S;e++){let S=i[e],C=S.color,w=S.intensity,T=S.distance,E=null;if(S.shadow&&S.shadow.map&&(E=S.shadow.map.texture.format===1030?S.shadow.map.texture:S.shadow.map.depthTexture||S.shadow.map.texture),S.isAmbientLight)a+=C.r*w,o+=C.g*w,s+=C.b*w;else if(S.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(S.sh.coefficients[e],w);x++}else if(S.isSunLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize.copy(e.mapSize).multiply(e.getFrameExtents()),r.sunShadow[l]=t,r.sunShadowMap[l]=E;let i=e.getViewportCount();for(let t=0;t<i;t++)r.sunShadowMatrix[u+t]=e.getMatrix(t),r.sunShadowCascade[u+t]=e._cascadeData[t];u+=i,l++}r.sun[c]=e,c++}else if(S.isDirectionalLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[d]=t,r.directionalShadowMap[d]=E,r.directionalShadowMatrix[d]=S.shadow.matrix,g++}r.directional[d]=e,d++}else if(S.isSpotLight){let e=t.get(S);e.position.setFromMatrixPosition(S.matrixWorld),e.color.copy(C).multiplyScalar(w),e.distance=T,e.coneCos=Math.cos(S.angle),e.penumbraCos=Math.cos(S.angle*(1-S.penumbra)),e.decay=S.decay,r.spot[p]=e;let i=S.shadow;if(S.map&&(r.spotLightMap[y]=S.map,y++,i.updateMatrices(S),S.castShadow&&b++),r.spotLightMatrix[p]=i.matrix,S.castShadow){let e=n.get(S);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[p]=e,r.spotShadowMap[p]=E,v++}p++}else if(S.isRectAreaLight){let e=t.get(S);e.color.copy(C).multiplyScalar(w),e.halfWidth.set(S.width*.5,0,0),e.halfHeight.set(0,S.height*.5,0),r.rectArea[m]=e,m++}else if(S.isPointLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),e.distance=S.distance,e.decay=S.decay,S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[f]=t,r.pointShadowMap[f]=E,r.pointShadowMatrix[f]=S.shadow.matrix,_++}r.point[f]=e,f++}else if(S.isHemisphereLight){let e=t.get(S);e.skyColor.copy(S.color).multiplyScalar(w),e.groundColor.copy(S.groundColor).multiplyScalar(w),r.hemi[h]=e,h++}}m>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=X.LTC_FLOAT_1,r.rectAreaLTC2=X.LTC_FLOAT_2):(r.rectAreaLTC1=X.LTC_HALF_1,r.rectAreaLTC2=X.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let S=r.hash;(S.sunLength!==c||S.directionalLength!==d||S.pointLength!==f||S.spotLength!==p||S.rectAreaLength!==m||S.hemiLength!==h||S.numSunShadows!==l||S.numDirectionalShadows!==g||S.numPointShadows!==_||S.numSpotShadows!==v||S.numSpotMaps!==y||S.numLightProbes!==x)&&(r.sun.length=c,r.directional.length=d,r.spot.length=p,r.rectArea.length=m,r.point.length=f,r.hemi.length=h,r.sunShadow.length=l,r.sunShadowMap.length=l,r.sunShadowMatrix.length=u,r.sunShadowCascade.length=u,r.directionalShadow.length=g,r.directionalShadowMap.length=g,r.directionalShadowMatrix.length=g,r.pointShadow.length=_,r.pointShadowMap.length=_,r.pointShadowMatrix.length=_,r.spotShadow.length=v,r.spotShadowMap.length=v,r.spotLightMatrix.length=v+y-b,r.spotLightMap.length=y,r.numSpotLightShadowsWithMaps=b,r.numLightProbes=x,S.sunLength=c,S.directionalLength=d,S.pointLength=f,S.spotLength=p,S.rectAreaLength=m,S.hemiLength=h,S.numSunShadows=l,S.numDirectionalShadows=g,S.numPointShadows=_,S.numSpotShadows=v,S.numSpotMaps=y,S.numLightProbes=x,r.version=Pc++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=0,f=t.matrixWorldInverse;for(let t=0,p=e.length;t<p;t++){let p=e[t];if(p.isSunLight){let e=r.sun[n];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),n++}else if(p.isDirectionalLight){let e=r.directional[s];e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),s++}else if(p.isSpotLight){let e=r.spot[l];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),l++}else if(p.isRectAreaLight){let e=r.rectArea[u];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),o.identity(),a.copy(p.matrixWorld),a.premultiply(f),o.extractRotation(a),e.halfWidth.set(p.width*.5,0,0),e.halfHeight.set(0,p.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),u++}else if(p.isPointLight){let e=r.point[c];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),c++}else if(p.isHemisphereLight){let e=r.hemi[d];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),d++}}}return{setup:s,setupView:c,state:r}}function Lc(e){let t=new Ic(e),n=[],r=[],i=[];function a(e){d.camera=e,n.length=0,r.length=0,i.length=0}function o(e){n.push(e)}function s(e){r.push(e)}function c(e){i.push(e)}function l(){t.setup(n)}function u(e){t.setupView(n,e)}let d={lightsArray:n,shadowsArray:r,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:d,setupLights:l,setupLightsView:u,pushLight:o,pushShadow:s,pushLightProbeGrid:c}}function Rc(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new Lc(e),t.set(n,[a])):r>=i.length?(a=new Lc(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var zc=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Bc=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Vc=[new U(1,0,0),new U(-1,0,0),new U(0,1,0),new U(0,-1,0),new U(0,0,1),new U(0,0,-1)],Hc=[new U(0,-1,0),new U(0,-1,0),new U(0,0,1),new U(0,0,-1),new U(0,-1,0),new U(0,-1,0)],Uc=new Mt,Wc=new U,Gc=new U;function Kc(e,t,n){let i=new Jr,a=new H,s=new H,c=new Dt,l=new Pi,u=new Fi,d={},f=n.maxTextureSize,p={0:1,1:0,2:2},_=new ji({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new H},radius:{value:4}},vertexShader:zc,fragmentShader:Bc}),v=_.clone();v.defines.HORIZONTAL_PASS=1;let y=new lr;y.setAttribute(`position`,new Jn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let b=new q(y,_),x=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let S=this.type;this.render=function(t,n,l){if(x.enabled===!1||x.autoUpdate===!1&&x.needsUpdate===!1||t.length===0)return;this.type===2&&(z(`WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead.`),this.type=1);let u=e.getRenderTarget(),d=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),_=e.state;_.setBlending(0),_.buffers.depth.getReversed()===!0?_.buffers.color.setClear(0,0,0,0):_.buffers.color.setClear(1,1,1,1),_.buffers.depth.setTest(!0),_.setScissorTest(!1);let v=S!==this.type;v&&n.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let u=0,d=t.length;u<d;u++){let d=t[u],p=d.shadow;if(p===void 0){z(`WebGLShadowMap:`,d,`has no shadow.`);continue}if(p.autoUpdate===!1&&p.needsUpdate===!1)continue;a.copy(p.mapSize);let y=p.getFrameExtents();a.multiply(y),s.copy(p.mapSize),(a.x>f||a.y>f)&&(a.x>f&&(s.x=Math.floor(f/y.x),a.x=s.x*y.x,p.mapSize.x=s.x),a.y>f&&(s.y=Math.floor(f/y.y),a.y=s.y*y.y,p.mapSize.y=s.y));let b=e.state.buffers.depth.getReversed();if(p.camera._reversedDepth=b,p.map===null||v===!0){if(p.map!==null&&(p.map.depthTexture!==null&&(p.map.depthTexture.dispose(),p.map.depthTexture=null),p.map.dispose()),this.type===3){if(d.isPointLight){z(`WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.`);continue}p.map=new kt(a.x,a.y,{format:k,type:g,minFilter:o,magFilter:o,generateMipmaps:!1}),p.map.texture.name=d.name+`.shadowMap`,p.map.depthTexture=new li(a.x,a.y,h),p.map.depthTexture.name=d.name+`.shadowMapDepth`,p.map.depthTexture.format=T,p.map.depthTexture.compareFunction=null,p.map.depthTexture.minFilter=r,p.map.depthTexture.magFilter=r}else d.isPointLight?(p.map=new Co(a.x),p.map.depthTexture=new ui(a.x,m)):(p.map=new kt(a.x,a.y),p.map.depthTexture=new li(a.x,a.y,m)),p.map.depthTexture.name=d.name+`.shadowMap`,p.map.depthTexture.format=T,this.type===1?(p.map.depthTexture.compareFunction=b?518:515,p.map.depthTexture.minFilter=o,p.map.depthTexture.magFilter=o):(p.map.depthTexture.compareFunction=null,p.map.depthTexture.minFilter=r,p.map.depthTexture.magFilter=r);p.camera.updateProjectionMatrix()}p.map.isWebGLCubeRenderTarget!==!0&&(p.map.width!==a.x||p.map.height!==a.y)&&p.map.setSize(a.x,a.y);let x=p.map.isWebGLCubeRenderTarget?6:p.getViewportCount();d.isPointLight!==!0&&p.updateMatrices(d,l);for(let t=0;t<x;t++){let r=p.getCamera(t);if(d.isPointLight){let e=p.camera,n=p.matrix,r=d.distance||e.far;r!==e.far&&(e.far=r,e.updateProjectionMatrix()),Wc.setFromMatrixPosition(d.matrixWorld),e.position.copy(Wc),Gc.copy(e.position),Gc.add(Vc[t]),e.up.copy(Hc[t]),e.lookAt(Gc),e.updateMatrixWorld(),n.makeTranslation(-Wc.x,-Wc.y,-Wc.z),Uc.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),p._frustum.setFromProjectionMatrix(Uc,e.coordinateSystem,e.reversedDepth)}if(p.map.isWebGLCubeRenderTarget)e.setRenderTarget(p.map,t),e.clear();else{t===0&&(e.setRenderTarget(p.map),e.clear());let n=p.getViewport(t);c.set(s.x*n.x,s.y*n.y,s.x*n.z,s.y*n.w),_.viewport(c)}i=p.getFrustum(t),E(n,l,r,d,this.type)}p.isPointLightShadow!==!0&&this.type===3&&C(p,l),p.needsUpdate=!1}S=this.type,x.needsUpdate=!1,e.setRenderTarget(u,d,p)};function C(n,r){let i=t.update(b);_.defines.VSM_SAMPLES!==n.blurSamples&&(_.defines.VSM_SAMPLES=n.blurSamples,v.defines.VSM_SAMPLES=n.blurSamples,_.needsUpdate=!0,v.needsUpdate=!0),n.mapPass===null?n.mapPass=new kt(a.x,a.y,{format:k,type:g}):(n.mapPass.width!==n.map.width||n.mapPass.height!==n.map.height)&&n.mapPass.setSize(n.map.width,n.map.height),_.uniforms.shadow_pass.value=n.map.depthTexture,_.uniforms.resolution.value.set(n.map.width,n.map.height),_.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,i,_,b,null),v.uniforms.shadow_pass.value=n.mapPass.texture,v.uniforms.resolution.value.set(n.map.width,n.map.height),v.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,i,v,b,null)}function w(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?u:l,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=d[e];r===void 0&&(r={},d[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,D)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?p[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function E(n,r,a,o,s){if(n.visible===!1)return;if(n.layers.test(r.layers)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&s===3)&&(!n.frustumCulled||n.intersectsFrustum(i))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let i=t.update(n),c=n.material;if(Array.isArray(c)){let t=i.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=c[u.materialIndex];if(d&&d.visible){let t=w(n,d,o,s);n.onBeforeShadow(e,n,r,a,i,t,u),e.renderBufferDirect(a,null,i,t,n,u),n.onAfterShadow(e,n,r,a,i,t,u)}}}else if(c.visible){let t=w(n,c,o,s);n.onBeforeShadow(e,n,r,a,i,t,null),e.renderBufferDirect(a,null,i,t,n,null),n.onAfterShadow(e,n,r,a,i,t,null)}}let c=n.children;for(let e=0,t=c.length;e<t;e++)E(c[e],r,a,o,s)}function D(e){e.target.removeEventListener(`dispose`,D);for(let t in d){let n=d[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function qc(e,t){function n(){let t=!1,n=new Dt,r=null,i=new Dt(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?P(e.DEPTH_TEST):ue(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=et[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(o=t,r&&(t=1-t),e.clearDepth(t))},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?P(e.STENCIL_TEST):ue(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c=new WeakMap,l=new WeakMap,u={},d={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new K(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,ee=null,j=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),te=!1,M=0,ne=e.getParameter(e.VERSION);ne.indexOf(`WebGL`)===-1?ne.indexOf(`OpenGL ES`)!==-1&&(M=parseFloat(/^OpenGL ES (\d)/.exec(ne)[1]),te=M>=2):(M=parseFloat(/^WebGL (\d)/.exec(ne)[1]),te=M>=1);let N=null,re={},ie=e.getParameter(e.SCISSOR_BOX),ae=e.getParameter(e.VIEWPORT),oe=new Dt().fromArray(ie),se=new Dt().fromArray(ae);function ce(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let le={};le[e.TEXTURE_2D]=ce(e.TEXTURE_2D,e.TEXTURE_2D,1),le[e.TEXTURE_CUBE_MAP]=ce(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),le[e.TEXTURE_2D_ARRAY]=ce(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),le[e.TEXTURE_3D]=ce(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),P(e.DEPTH_TEST),o.setFunc(3),ve(!1),ye(1),P(e.CULL_FACE),ge(0);function P(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function ue(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function de(t,n){return f[t]!==n&&(e.bindFramebuffer(t,n),f[t]=n,t===e.DRAW_FRAMEBUFFER&&(f[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(f[e.DRAW_FRAMEBUFFER]=n),!0)}function fe(t,n){let r=m,i=!1;if(t){r=p.get(n),r===void 0&&(r=[],p.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function pe(t){return h!==t&&(e.useProgram(t),h=t,!0)}let me={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};me[103]=e.MIN,me[104]=e.MAX;let he={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function ge(t,n,r,i,a,o,s,c,l,u){if(t===0){g===!0&&(ue(e.BLEND),g=!1);return}if(g===!1&&(P(e.BLEND),g=!0),t!==5){if(t!==_||u!==E){if((v!==100||x!==100)&&(e.blendEquation(e.FUNC_ADD),v=100,x=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:B(`WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:B(`WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:B(`WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:B(`WebGLState: Invalid blending: `,t)}y=null,b=null,S=null,C=null,w.set(0,0,0),T=0,_=t,E=u}return}a||=n,o||=r,s||=i,(n!==v||a!==x)&&(e.blendEquationSeparate(me[n],me[a]),v=n,x=a),(r!==y||i!==b||o!==S||s!==C)&&(e.blendFuncSeparate(he[r],he[i],he[o],he[s]),y=r,b=i,S=o,C=s),(c.equals(w)===!1||l!==T)&&(e.blendColor(c.r,c.g,c.b,l),w.copy(c),T=l),_=t,E=!1}function _e(t,n){t.side===2?ue(e.CULL_FACE):P(e.CULL_FACE);let r=t.side===1;n&&(r=!r),ve(r),t.blending===1&&t.transparent===!1?ge(0):ge(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),xe(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?P(e.SAMPLE_ALPHA_TO_COVERAGE):ue(e.SAMPLE_ALPHA_TO_COVERAGE)}function ve(t){D!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),D=t)}function ye(t){t===0?ue(e.CULL_FACE):(P(e.CULL_FACE),t!==O&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),O=t}function be(t){t!==k&&(te&&e.lineWidth(t),k=t)}function xe(t,n,r){t?(P(e.POLYGON_OFFSET_FILL),(A!==n||ee!==r)&&(A=n,ee=r,o.getReversed()&&(n=-n),e.polygonOffset(n,r))):ue(e.POLYGON_OFFSET_FILL)}function Se(t){t?P(e.SCISSOR_TEST):ue(e.SCISSOR_TEST)}function Ce(t){t===void 0&&(t=e.TEXTURE0+j-1),N!==t&&(e.activeTexture(t),N=t)}function we(t,n,r){r===void 0&&(r=N===null?e.TEXTURE0+j-1:N);let i=re[r];i===void 0&&(i={type:void 0,texture:void 0},re[r]=i),(i.type!==t||i.texture!==n)&&(N!==r&&(e.activeTexture(r),N=r),e.bindTexture(t,n||le[t]),i.type=t,i.texture=n)}function Te(){let t=re[N];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function Ee(){try{e.compressedTexImage2D(...arguments)}catch(e){B(`WebGLState:`,e)}}function De(){try{e.compressedTexImage3D(...arguments)}catch(e){B(`WebGLState:`,e)}}function Oe(){try{e.texSubImage2D(...arguments)}catch(e){B(`WebGLState:`,e)}}function ke(){try{e.texSubImage3D(...arguments)}catch(e){B(`WebGLState:`,e)}}function Ae(){try{e.compressedTexSubImage2D(...arguments)}catch(e){B(`WebGLState:`,e)}}function je(){try{e.compressedTexSubImage3D(...arguments)}catch(e){B(`WebGLState:`,e)}}function Me(){try{e.texStorage2D(...arguments)}catch(e){B(`WebGLState:`,e)}}function Ne(){try{e.texStorage3D(...arguments)}catch(e){B(`WebGLState:`,e)}}function F(){try{e.texImage2D(...arguments)}catch(e){B(`WebGLState:`,e)}}function Pe(){try{e.texImage3D(...arguments)}catch(e){B(`WebGLState:`,e)}}function Fe(t){return d[t]===void 0?e.getParameter(t):d[t]}function Ie(t,n){d[t]!==n&&(e.pixelStorei(t,n),d[t]=n)}function I(t){oe.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),oe.copy(t))}function Le(t){se.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),se.copy(t))}function L(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),r.set(t,i))}function Re(t,n){let r=l.get(n).get(t);c.get(n)!==r&&(e.uniformBlockBinding(n,r,t.__bindingPointIndex),c.set(n,r))}function R(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},d={},N=null,re={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new K(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,ee=null,oe.set(0,0,e.canvas.width,e.canvas.height),se.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:P,disable:ue,bindFramebuffer:de,drawBuffers:fe,useProgram:pe,setBlending:ge,setMaterial:_e,setFlipSided:ve,setCullFace:ye,setLineWidth:be,setPolygonOffset:xe,setScissorTest:Se,activeTexture:Ce,bindTexture:we,unbindTexture:Te,compressedTexImage2D:Ee,compressedTexImage3D:De,texImage2D:F,texImage3D:Pe,pixelStorei:Ie,getParameter:Fe,updateUBOMapping:L,uniformBlockBinding:Re,texStorage2D:Me,texStorage3D:Ne,texSubImage2D:Oe,texSubImage3D:ke,compressedTexSubImage2D:Ae,compressedTexSubImage3D:je,scissor:I,viewport:Le,reset:R}}function Jc(l,u,d,f,p,m,h){let g=u.has(`WEBGL_multisampled_render_to_texture`)?u.get(`WEBGL_multisampled_render_to_texture`):null,_=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),v=new H,y=new WeakMap,b=new Set,x,S=new WeakMap,C=!1;try{C=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function w(e,t){return C?new OffscreenCanvas(e,t):qe(`canvas`)}function T(e,t,n){let r=1,i=Fe(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);x===void 0&&(x=w(n,a));let o=t?w(n,a):x;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),z(`WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}return`data`in e&&z(`WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e}return e}function D(e){return e.generateMipmaps}function O(e){l.generateMipmap(e)}function k(e){return e.isWebGLCubeRenderTarget?l.TEXTURE_CUBE_MAP:e.isWebGL3DRenderTarget?l.TEXTURE_3D:e.isWebGLArrayRenderTarget||e.isCompressedArrayTexture?l.TEXTURE_2D_ARRAY:l.TEXTURE_2D}function A(e,t,n,r,i,a=!1){if(e!==null){if(l[e]!==void 0)return l[e];z(`WebGLRenderer: Attempt to use non-existing WebGL internal format '`+e+`'`)}let o;r&&(o=u.get(`EXT_texture_norm16`),o||z(`WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension`));let s=t;if(t===l.RED&&(n===l.FLOAT&&(s=l.R32F),n===l.HALF_FLOAT&&(s=l.R16F),n===l.UNSIGNED_BYTE&&(s=l.R8),n===l.UNSIGNED_SHORT&&o&&(s=o.R16_EXT),n===l.SHORT&&o&&(s=o.R16_SNORM_EXT)),t===l.RED_INTEGER&&(n===l.UNSIGNED_BYTE&&(s=l.R8UI),n===l.UNSIGNED_SHORT&&(s=l.R16UI),n===l.UNSIGNED_INT&&(s=l.R32UI),n===l.BYTE&&(s=l.R8I),n===l.SHORT&&(s=l.R16I),n===l.INT&&(s=l.R32I)),t===l.RG&&(n===l.FLOAT&&(s=l.RG32F),n===l.HALF_FLOAT&&(s=l.RG16F),n===l.UNSIGNED_BYTE&&(s=l.RG8),n===l.UNSIGNED_SHORT&&o&&(s=o.RG16_EXT),n===l.SHORT&&o&&(s=o.RG16_SNORM_EXT)),t===l.RG_INTEGER&&(n===l.UNSIGNED_BYTE&&(s=l.RG8UI),n===l.UNSIGNED_SHORT&&(s=l.RG16UI),n===l.UNSIGNED_INT&&(s=l.RG32UI),n===l.BYTE&&(s=l.RG8I),n===l.SHORT&&(s=l.RG16I),n===l.INT&&(s=l.RG32I)),t===l.RGB_INTEGER&&(n===l.UNSIGNED_BYTE&&(s=l.RGB8UI),n===l.UNSIGNED_SHORT&&(s=l.RGB16UI),n===l.UNSIGNED_INT&&(s=l.RGB32UI),n===l.BYTE&&(s=l.RGB8I),n===l.SHORT&&(s=l.RGB16I),n===l.INT&&(s=l.RGB32I)),t===l.RGBA_INTEGER&&(n===l.UNSIGNED_BYTE&&(s=l.RGBA8UI),n===l.UNSIGNED_SHORT&&(s=l.RGBA16UI),n===l.UNSIGNED_INT&&(s=l.RGBA32UI),n===l.BYTE&&(s=l.RGBA8I),n===l.SHORT&&(s=l.RGBA16I),n===l.INT&&(s=l.RGBA32I)),t===l.RGB&&(n===l.UNSIGNED_SHORT&&o&&(s=o.RGB16_EXT),n===l.SHORT&&o&&(s=o.RGB16_SNORM_EXT),n===l.UNSIGNED_INT_5_9_9_9_REV&&(s=l.RGB9_E5),n===l.UNSIGNED_INT_10F_11F_11F_REV&&(s=l.R11F_G11F_B10F)),t===l.RGBA){let e=a?ze:G.getTransfer(i);n===l.FLOAT&&(s=l.RGBA32F),n===l.HALF_FLOAT&&(s=l.RGBA16F),n===l.UNSIGNED_BYTE&&(s=e===`srgb`?l.SRGB8_ALPHA8:l.RGBA8),n===l.UNSIGNED_SHORT&&o&&(s=o.RGBA16_EXT),n===l.SHORT&&o&&(s=o.RGBA16_SNORM_EXT),n===l.UNSIGNED_SHORT_4_4_4_4&&(s=l.RGBA4),n===l.UNSIGNED_SHORT_5_5_5_1&&(s=l.RGB5_A1)}return(s===l.R16F||s===l.R32F||s===l.RG16F||s===l.RG32F||s===l.RGBA16F||s===l.RGBA32F)&&u.get(`EXT_color_buffer_float`),s}function ee(e,t){let n;return e?t===null||t===1014||t===1020?n=l.DEPTH24_STENCIL8:t===1015?n=l.DEPTH32F_STENCIL8:t===1012&&(n=l.DEPTH24_STENCIL8,z(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):t===null||t===1014||t===1020?n=l.DEPTH_COMPONENT24:t===1015?n=l.DEPTH_COMPONENT32F:t===1012&&(n=l.DEPTH_COMPONENT16),n}function j(e,t){return D(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps!==void 0&&e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function te(e){let t=e.target;t.removeEventListener(`dispose`,te),ne(t),t.isVideoTexture&&y.delete(t),t.isHTMLTexture&&b.delete(t)}function M(e){let t=e.target;t.removeEventListener(`dispose`,M),re(t)}function ne(e){let t=f.get(e);if(t.__webglInit===void 0)return;let n=e.source,r=S.get(n);if(r){let i=r[t.__cacheKey];i.usedTimes--,i.usedTimes===0&&N(e),Object.keys(r).length===0&&S.delete(n)}f.remove(e)}function N(e){let t=f.get(e);l.deleteTexture(t.__webglTexture);let n=e.source,r=S.get(n);delete r[t.__cacheKey],h.memory.textures--}function re(e){let t=f.get(e);if(e.depthTexture&&(e.depthTexture.dispose(),f.remove(e.depthTexture)),e.isWebGLCubeRenderTarget)for(let e=0;e<6;e++){if(Array.isArray(t.__webglFramebuffer[e]))for(let n=0;n<t.__webglFramebuffer[e].length;n++)l.deleteFramebuffer(t.__webglFramebuffer[e][n]);else l.deleteFramebuffer(t.__webglFramebuffer[e]);t.__webglDepthbuffer&&l.deleteRenderbuffer(t.__webglDepthbuffer[e])}else{if(Array.isArray(t.__webglFramebuffer))for(let e=0;e<t.__webglFramebuffer.length;e++)l.deleteFramebuffer(t.__webglFramebuffer[e]);else l.deleteFramebuffer(t.__webglFramebuffer);if(t.__webglDepthbuffer&&l.deleteRenderbuffer(t.__webglDepthbuffer),t.__webglMultisampledFramebuffer&&l.deleteFramebuffer(t.__webglMultisampledFramebuffer),t.__webglColorRenderbuffer)for(let e=0;e<t.__webglColorRenderbuffer.length;e++)t.__webglColorRenderbuffer[e]&&l.deleteRenderbuffer(t.__webglColorRenderbuffer[e]);t.__webglDepthRenderbuffer&&l.deleteRenderbuffer(t.__webglDepthRenderbuffer)}let n=e.textures;for(let e=0,t=n.length;e<t;e++){let t=f.get(n[e]);t.__webglTexture&&(l.deleteTexture(t.__webglTexture),h.memory.textures--),f.remove(n[e])}f.remove(e)}let ie=0;function ae(){ie=0}function oe(){return ie}function se(e){ie=e}function ce(){let e=ie;return e>=p.maxTextures&&z(`WebGLTextures: Trying to use `+(e+1)+` texture units while this GPU supports only `+p.maxTextures),ie+=1,e}function le(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function P(e,t){let n=f.get(e);if(e.isVideoTexture&&F(e),e.isRenderTargetTexture===!1&&e.isExternalTexture!==!0&&e.version>0&&n.__version!==e.version){let r=e.image;if(r===null)z(`WebGLRenderer: Texture marked for update but no image data found.`);else if(r.complete===!1)z(`WebGLRenderer: Texture marked for update but image is incomplete`);else{be(n,e,t);return}}else e.isExternalTexture&&(n.__webglTexture=e.sourceTexture?e.sourceTexture:null);d.bindTexture(l.TEXTURE_2D,n.__webglTexture,l.TEXTURE0+t)}function ue(e,t){let n=f.get(e);if(e.isRenderTargetTexture===!1&&e.version>0&&n.__version!==e.version){be(n,e,t);return}e.isExternalTexture&&(n.__webglTexture=e.sourceTexture?e.sourceTexture:null),d.bindTexture(l.TEXTURE_2D_ARRAY,n.__webglTexture,l.TEXTURE0+t)}function de(e,t){let n=f.get(e);if(e.isRenderTargetTexture===!1&&e.version>0&&n.__version!==e.version){be(n,e,t);return}d.bindTexture(l.TEXTURE_3D,n.__webglTexture,l.TEXTURE0+t)}function fe(e,t){let n=f.get(e);if(e.isCubeDepthTexture!==!0&&e.version>0&&n.__version!==e.version){xe(n,e,t);return}d.bindTexture(l.TEXTURE_CUBE_MAP,n.__webglTexture,l.TEXTURE0+t)}let pe={[e]:l.REPEAT,[t]:l.CLAMP_TO_EDGE,[n]:l.MIRRORED_REPEAT},me={[r]:l.NEAREST,[i]:l.NEAREST_MIPMAP_NEAREST,[a]:l.NEAREST_MIPMAP_LINEAR,[o]:l.LINEAR,[s]:l.LINEAR_MIPMAP_NEAREST,[c]:l.LINEAR_MIPMAP_LINEAR},he={512:l.NEVER,519:l.ALWAYS,513:l.LESS,515:l.LEQUAL,514:l.EQUAL,518:l.GEQUAL,516:l.GREATER,517:l.NOTEQUAL};function ge(e,t){if(t.type===1015&&u.has(`OES_texture_float_linear`)===!1&&(t.magFilter===1006||t.magFilter===1007||t.magFilter===1005||t.magFilter===1008||t.minFilter===1006||t.minFilter===1007||t.minFilter===1005||t.minFilter===1008)&&z(`WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),l.texParameteri(e,l.TEXTURE_WRAP_S,pe[t.wrapS]),l.texParameteri(e,l.TEXTURE_WRAP_T,pe[t.wrapT]),(e===l.TEXTURE_3D||e===l.TEXTURE_2D_ARRAY)&&l.texParameteri(e,l.TEXTURE_WRAP_R,pe[t.wrapR]),l.texParameteri(e,l.TEXTURE_MAG_FILTER,me[t.magFilter]),l.texParameteri(e,l.TEXTURE_MIN_FILTER,me[t.minFilter]),t.compareFunction&&(l.texParameteri(e,l.TEXTURE_COMPARE_MODE,l.COMPARE_REF_TO_TEXTURE),l.texParameteri(e,l.TEXTURE_COMPARE_FUNC,he[t.compareFunction])),u.has(`EXT_texture_filter_anisotropic`)===!0){if(t.magFilter===1003||t.minFilter!==1005&&t.minFilter!==1008||t.type===1015&&u.has(`OES_texture_float_linear`)===!1)return;if(t.anisotropy>1||f.get(t).__currentAnisotropy){let n=u.get(`EXT_texture_filter_anisotropic`);l.texParameterf(e,n.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(t.anisotropy,p.getMaxAnisotropy())),f.get(t).__currentAnisotropy=t.anisotropy}}}function _e(e,t){let n=!1;e.__webglInit===void 0&&(e.__webglInit=!0,t.addEventListener(`dispose`,te));let r=t.source,i=S.get(r);i===void 0&&(i={},S.set(r,i));let a=le(t);if(a!==e.__cacheKey){i[a]===void 0&&(i[a]={texture:l.createTexture(),usedTimes:0},h.memory.textures++,n=!0),i[a].usedTimes++;let r=i[e.__cacheKey];r!==void 0&&(i[e.__cacheKey].usedTimes--,r.usedTimes===0&&N(t)),e.__cacheKey=a,e.__webglTexture=i[a].texture}return n}function ve(e,t,n){return Math.floor(Math.floor(e/n)/t)}function ye(e,t,n,r){let i=e.updateRanges;if(i.length===0)d.texSubImage2D(l.TEXTURE_2D,0,0,0,t.width,t.height,n,r,t.data);else{i.sort((e,t)=>e.start-t.start);let a=0;for(let e=1;e<i.length;e++){let n=i[a],r=i[e],o=n.start+n.count,s=ve(r.start,t.width,4),c=ve(n.start,t.width,4);r.start<=o+1&&s===c&&ve(r.start+r.count-1,t.width,4)===s?n.count=Math.max(n.count,r.start+r.count-n.start):(++a,i[a]=r)}i.length=a+1;let o=d.getParameter(l.UNPACK_ROW_LENGTH),s=d.getParameter(l.UNPACK_SKIP_PIXELS),c=d.getParameter(l.UNPACK_SKIP_ROWS);d.pixelStorei(l.UNPACK_ROW_LENGTH,t.width);for(let e=0,a=i.length;e<a;e++){let a=i[e],o=Math.floor(a.start/4),s=Math.ceil(a.count/4),c=o%t.width,u=Math.floor(o/t.width),f=s;d.pixelStorei(l.UNPACK_SKIP_PIXELS,c),d.pixelStorei(l.UNPACK_SKIP_ROWS,u),d.texSubImage2D(l.TEXTURE_2D,0,c,u,f,1,n,r,t.data)}e.clearUpdateRanges(),d.pixelStorei(l.UNPACK_ROW_LENGTH,o),d.pixelStorei(l.UNPACK_SKIP_PIXELS,s),d.pixelStorei(l.UNPACK_SKIP_ROWS,c)}}function be(e,t,n){let r=l.TEXTURE_2D;(t.isDataArrayTexture||t.isCompressedArrayTexture)&&(r=l.TEXTURE_2D_ARRAY),t.isData3DTexture&&(r=l.TEXTURE_3D);let i=_e(e,t),a=t.source;d.bindTexture(r,e.__webglTexture,l.TEXTURE0+n);let o=f.get(a);if(a.version!==o.__version||i===!0){if(d.activeTexture(l.TEXTURE0+n),!(typeof ImageBitmap<`u`&&t.image instanceof ImageBitmap)){let e=G.getPrimaries(G.workingColorSpace),n=t.colorSpace===``?null:G.getPrimaries(t.colorSpace),r=t.colorSpace===``||e===n?l.NONE:l.BROWSER_DEFAULT_WEBGL;d.pixelStorei(l.UNPACK_FLIP_Y_WEBGL,t.flipY),d.pixelStorei(l.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),d.pixelStorei(l.UNPACK_COLORSPACE_CONVERSION_WEBGL,r)}d.pixelStorei(l.UNPACK_ALIGNMENT,t.unpackAlignment);let e=T(t.image,!1,p.maxTextureSize);e=Pe(t,e);let s=m.convert(t.format,t.colorSpace),c=m.convert(t.type),u=A(t.internalFormat,s,c,t.normalized,t.colorSpace,t.isVideoTexture);ge(r,t);let f,h=t.mipmaps,g=t.isVideoTexture!==!0,_=o.__version===void 0||i===!0,v=a.dataReady,y=j(t,e);if(t.isDepthTexture)u=ee(t.format===E,t.type),_&&(g?d.texStorage2D(l.TEXTURE_2D,1,u,e.width,e.height):d.texImage2D(l.TEXTURE_2D,0,u,e.width,e.height,0,s,c,null));else if(t.isDataTexture){if(h.length>0){g&&_&&d.texStorage2D(l.TEXTURE_2D,y,u,h[0].width,h[0].height);for(let e=0,t=h.length;e<t;e++)f=h[e],g?v&&d.texSubImage2D(l.TEXTURE_2D,e,0,0,f.width,f.height,s,c,f.data):d.texImage2D(l.TEXTURE_2D,e,u,f.width,f.height,0,s,c,f.data);t.generateMipmaps=!1}else g?(_&&d.texStorage2D(l.TEXTURE_2D,y,u,e.width,e.height),v&&ye(t,e,s,c)):d.texImage2D(l.TEXTURE_2D,0,u,e.width,e.height,0,s,c,e.data)}else if(t.isCompressedTexture){if(t.isCompressedArrayTexture){g&&_&&d.texStorage3D(l.TEXTURE_2D_ARRAY,y,u,h[0].width,h[0].height,e.depth);for(let n=0,r=h.length;n<r;n++)if(f=h[n],t.format!==1023){if(s!==null){if(g){if(v){if(t.layerUpdates.size>0){let e=Ha(f.width,f.height,t.format,t.type);for(let r of t.layerUpdates){let t=f.data.subarray(r*e/f.data.BYTES_PER_ELEMENT,(r+1)*e/f.data.BYTES_PER_ELEMENT);d.compressedTexSubImage3D(l.TEXTURE_2D_ARRAY,n,0,0,r,f.width,f.height,1,s,t)}}else d.compressedTexSubImage3D(l.TEXTURE_2D_ARRAY,n,0,0,0,f.width,f.height,e.depth,s,f.data)}}else d.compressedTexImage3D(l.TEXTURE_2D_ARRAY,n,u,f.width,f.height,e.depth,0,f.data,0,0)}else z(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`)}else g?v&&d.texSubImage3D(l.TEXTURE_2D_ARRAY,n,0,0,0,f.width,f.height,e.depth,s,c,f.data):d.texImage3D(l.TEXTURE_2D_ARRAY,n,u,f.width,f.height,e.depth,0,s,c,f.data);t.layerUpdates.size>0&&t.clearLayerUpdates()}else{g&&_&&d.texStorage2D(l.TEXTURE_2D,y,u,h[0].width,h[0].height);for(let e=0,n=h.length;e<n;e++)f=h[e],t.format===1023?g?v&&d.texSubImage2D(l.TEXTURE_2D,e,0,0,f.width,f.height,s,c,f.data):d.texImage2D(l.TEXTURE_2D,e,u,f.width,f.height,0,s,c,f.data):s===null?z(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):g?v&&d.compressedTexSubImage2D(l.TEXTURE_2D,e,0,0,f.width,f.height,s,f.data):d.compressedTexImage2D(l.TEXTURE_2D,e,u,f.width,f.height,0,f.data)}}else if(t.isDataArrayTexture){if(g){if(_&&d.texStorage3D(l.TEXTURE_2D_ARRAY,y,u,e.width,e.height,e.depth),v){if(t.layerUpdates.size>0){let n=Ha(e.width,e.height,t.format,t.type);for(let r of t.layerUpdates){let t=e.data.subarray(r*n/e.data.BYTES_PER_ELEMENT,(r+1)*n/e.data.BYTES_PER_ELEMENT);d.texSubImage3D(l.TEXTURE_2D_ARRAY,0,0,0,r,e.width,e.height,1,s,c,t)}t.clearLayerUpdates()}else d.texSubImage3D(l.TEXTURE_2D_ARRAY,0,0,0,0,e.width,e.height,e.depth,s,c,e.data)}}else d.texImage3D(l.TEXTURE_2D_ARRAY,0,u,e.width,e.height,e.depth,0,s,c,e.data)}else if(t.isData3DTexture)g?(_&&d.texStorage3D(l.TEXTURE_3D,y,u,e.width,e.height,e.depth),v&&d.texSubImage3D(l.TEXTURE_3D,0,0,0,0,e.width,e.height,e.depth,s,c,e.data)):d.texImage3D(l.TEXTURE_3D,0,u,e.width,e.height,e.depth,0,s,c,e.data);else if(t.isFramebufferTexture){if(_){if(g)d.texStorage2D(l.TEXTURE_2D,y,u,e.width,e.height);else{let t=e.width,n=e.height;for(let e=0;e<y;e++)d.texImage2D(l.TEXTURE_2D,e,u,t,n,0,s,c,null),t>>=1,n>>=1}}}else if(t.isHTMLTexture){if(`texElementImage2D`in l){let n=l.canvas;if(n.hasAttribute(`layoutsubtree`)||n.setAttribute(`layoutsubtree`,`true`),e.parentNode!==n){n.appendChild(e),b.add(t),n.onpaint=e=>{let t=e.changedElements;for(let e of b)t.includes(e.image)&&(e.needsUpdate=!0)},n.requestPaint();return}if(l.texElementImage2D.length===3)l.texElementImage2D(l.TEXTURE_2D,l.RGBA8,e);else{let t=l.RGBA,n=l.RGBA,r=l.UNSIGNED_BYTE;l.texElementImage2D(l.TEXTURE_2D,0,t,n,r,e)}l.texParameteri(l.TEXTURE_2D,l.TEXTURE_MIN_FILTER,l.LINEAR),l.texParameteri(l.TEXTURE_2D,l.TEXTURE_WRAP_S,l.CLAMP_TO_EDGE),l.texParameteri(l.TEXTURE_2D,l.TEXTURE_WRAP_T,l.CLAMP_TO_EDGE)}}else if(h.length>0){if(g&&_){let e=Fe(h[0]);d.texStorage2D(l.TEXTURE_2D,y,u,e.width,e.height)}for(let e=0,t=h.length;e<t;e++)f=h[e],g?v&&d.texSubImage2D(l.TEXTURE_2D,e,0,0,s,c,f):d.texImage2D(l.TEXTURE_2D,e,u,s,c,f);t.generateMipmaps=!1}else if(g){if(_){let t=Fe(e);d.texStorage2D(l.TEXTURE_2D,y,u,t.width,t.height)}v&&d.texSubImage2D(l.TEXTURE_2D,0,0,0,s,c,e)}else d.texImage2D(l.TEXTURE_2D,0,u,s,c,e);D(t)&&O(r),o.__version=a.version,t.onUpdate&&t.onUpdate(t)}e.__version=t.version}function xe(e,t,n){if(t.image.length!==6)return;let r=_e(e,t),i=t.source;d.bindTexture(l.TEXTURE_CUBE_MAP,e.__webglTexture,l.TEXTURE0+n);let a=f.get(i);if(i.version!==a.__version||r===!0){d.activeTexture(l.TEXTURE0+n);let e=G.getPrimaries(G.workingColorSpace),o=t.colorSpace===``?null:G.getPrimaries(t.colorSpace),s=t.colorSpace===``||e===o?l.NONE:l.BROWSER_DEFAULT_WEBGL;d.pixelStorei(l.UNPACK_FLIP_Y_WEBGL,t.flipY),d.pixelStorei(l.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),d.pixelStorei(l.UNPACK_ALIGNMENT,t.unpackAlignment),d.pixelStorei(l.UNPACK_COLORSPACE_CONVERSION_WEBGL,s);let c=t.isCompressedTexture||t.image[0].isCompressedTexture,u=t.image[0]&&t.image[0].isDataTexture,f=[];for(let e=0;e<6;e++)!c&&!u?f[e]=T(t.image[e],!0,p.maxCubemapSize):f[e]=u?t.image[e].image:t.image[e],f[e]=Pe(t,f[e]);let h=f[0],g=m.convert(t.format,t.colorSpace),_=m.convert(t.type),v=A(t.internalFormat,g,_,t.normalized,t.colorSpace),y=t.isVideoTexture!==!0,b=a.__version===void 0||r===!0,x=i.dataReady,S=j(t,h);ge(l.TEXTURE_CUBE_MAP,t);let C;if(c){y&&b&&d.texStorage2D(l.TEXTURE_CUBE_MAP,S,v,h.width,h.height);for(let e=0;e<6;e++){C=f[e].mipmaps;for(let n=0;n<C.length;n++){let r=C[n];t.format===1023?y?x&&d.texSubImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,n,0,0,r.width,r.height,g,_,r.data):d.texImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,n,v,r.width,r.height,0,g,_,r.data):g===null?z(`WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):y?x&&d.compressedTexSubImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,n,0,0,r.width,r.height,g,r.data):d.compressedTexImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,n,v,r.width,r.height,0,r.data)}}}else{if(C=t.mipmaps,y&&b){C.length>0&&S++;let e=Fe(f[0]);d.texStorage2D(l.TEXTURE_CUBE_MAP,S,v,e.width,e.height)}for(let e=0;e<6;e++)if(u){y?x&&d.texSubImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,0,0,0,f[e].width,f[e].height,g,_,f[e].data):d.texImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,0,v,f[e].width,f[e].height,0,g,_,f[e].data);for(let t=0;t<C.length;t++){let n=C[t].image[e].image;y?x&&d.texSubImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,t+1,0,0,n.width,n.height,g,_,n.data):d.texImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,t+1,v,n.width,n.height,0,g,_,n.data)}}else{y?x&&d.texSubImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,0,0,0,g,_,f[e]):d.texImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,0,v,g,_,f[e]);for(let t=0;t<C.length;t++){let n=C[t];y?x&&d.texSubImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,t+1,0,0,g,_,n.image[e]):d.texImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+e,t+1,v,g,_,n.image[e])}}}D(t)&&O(l.TEXTURE_CUBE_MAP),a.__version=i.version,t.onUpdate&&t.onUpdate(t)}e.__version=t.version}function Se(e,t,n,r,i,a){let o=m.convert(n.format,n.colorSpace),s=m.convert(n.type),c=A(n.internalFormat,o,s,n.normalized,n.colorSpace),u=f.get(t),p=f.get(n);if(p.__renderTarget=t,!u.__hasExternalTextures){let e=Math.max(1,t.width>>a),n=Math.max(1,t.height>>a);i===l.TEXTURE_3D||i===l.TEXTURE_2D_ARRAY?d.texImage3D(i,a,c,e,n,t.depth,0,o,s,null):d.texImage2D(i,a,c,e,n,0,o,s,null)}d.bindFramebuffer(l.FRAMEBUFFER,e),Ne(t)?g.framebufferTexture2DMultisampleEXT(l.FRAMEBUFFER,r,i,p.__webglTexture,0,Me(t)):(i===l.TEXTURE_2D||i>=l.TEXTURE_CUBE_MAP_POSITIVE_X&&i<=l.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&l.framebufferTexture2D(l.FRAMEBUFFER,r,i,p.__webglTexture,a),d.bindFramebuffer(l.FRAMEBUFFER,null)}function Ce(e,t,n){if(l.bindRenderbuffer(l.RENDERBUFFER,e),t.depthBuffer){let r=t.depthTexture,i=r&&r.isDepthTexture?r.type:null,a=ee(t.stencilBuffer,i),o=t.stencilBuffer?l.DEPTH_STENCIL_ATTACHMENT:l.DEPTH_ATTACHMENT;Ne(t)?g.renderbufferStorageMultisampleEXT(l.RENDERBUFFER,Me(t),a,t.width,t.height):n?l.renderbufferStorageMultisample(l.RENDERBUFFER,Me(t),a,t.width,t.height):l.renderbufferStorage(l.RENDERBUFFER,a,t.width,t.height),l.framebufferRenderbuffer(l.FRAMEBUFFER,o,l.RENDERBUFFER,e)}else{let e=t.textures;for(let r=0;r<e.length;r++){let i=e[r],a=m.convert(i.format,i.colorSpace),o=m.convert(i.type),s=A(i.internalFormat,a,o,i.normalized,i.colorSpace);Ne(t)?g.renderbufferStorageMultisampleEXT(l.RENDERBUFFER,Me(t),s,t.width,t.height):n?l.renderbufferStorageMultisample(l.RENDERBUFFER,Me(t),s,t.width,t.height):l.renderbufferStorage(l.RENDERBUFFER,s,t.width,t.height)}}l.bindRenderbuffer(l.RENDERBUFFER,null)}function we(e,t,n){let r=t.isWebGLCubeRenderTarget===!0;if(d.bindFramebuffer(l.FRAMEBUFFER,e),!(t.depthTexture&&t.depthTexture.isDepthTexture))throw Error(`THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.`);let i=f.get(t.depthTexture);if(i.__renderTarget=t,(!i.__webglTexture||t.depthTexture.image.width!==t.width||t.depthTexture.image.height!==t.height)&&(t.depthTexture.image.width=t.width,t.depthTexture.image.height=t.height,t.depthTexture.needsUpdate=!0),r){if(i.__webglInit===void 0&&(i.__webglInit=!0,t.depthTexture.addEventListener(`dispose`,te)),i.__webglTexture===void 0){i.__webglTexture=l.createTexture(),d.bindTexture(l.TEXTURE_CUBE_MAP,i.__webglTexture),ge(l.TEXTURE_CUBE_MAP,t.depthTexture);let e=m.convert(t.depthTexture.format),n=m.convert(t.depthTexture.type),r;t.depthTexture.format===1026?r=l.DEPTH_COMPONENT24:t.depthTexture.format===1027&&(r=l.DEPTH24_STENCIL8);for(let i=0;i<6;i++)l.texImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X+i,0,r,t.width,t.height,0,e,n,null)}}else P(t.depthTexture,0);let a=i.__webglTexture,o=Me(t),s=r?l.TEXTURE_CUBE_MAP_POSITIVE_X+n:l.TEXTURE_2D,c=t.depthTexture.format===1027?l.DEPTH_STENCIL_ATTACHMENT:l.DEPTH_ATTACHMENT;if(t.depthTexture.format===1026)Ne(t)?g.framebufferTexture2DMultisampleEXT(l.FRAMEBUFFER,c,s,a,0,o):l.framebufferTexture2D(l.FRAMEBUFFER,c,s,a,0);else if(t.depthTexture.format===1027)Ne(t)?g.framebufferTexture2DMultisampleEXT(l.FRAMEBUFFER,c,s,a,0,o):l.framebufferTexture2D(l.FRAMEBUFFER,c,s,a,0);else throw Error(`THREE.WebGLTextures: Unknown depthTexture format.`)}function Te(e){let t=f.get(e),n=e.isWebGLCubeRenderTarget===!0;if(t.__boundDepthTexture!==e.depthTexture){let n=e.depthTexture;if(t.__depthDisposeCallback&&t.__depthDisposeCallback(),n){let e=()=>{delete t.__boundDepthTexture,delete t.__depthDisposeCallback,n.removeEventListener(`dispose`,e)};n.addEventListener(`dispose`,e),t.__depthDisposeCallback=e}t.__boundDepthTexture=n}if(e.depthTexture&&!t.__autoAllocateDepthBuffer){if(n)for(let n=0;n<6;n++)we(t.__webglFramebuffer[n],e,n);else{let n=e.texture.mipmaps;n&&n.length>0?we(t.__webglFramebuffer[0],e,0):we(t.__webglFramebuffer,e,0)}}else if(n){t.__webglDepthbuffer=[];for(let n=0;n<6;n++)if(d.bindFramebuffer(l.FRAMEBUFFER,t.__webglFramebuffer[n]),t.__webglDepthbuffer[n]===void 0)t.__webglDepthbuffer[n]=l.createRenderbuffer(),Ce(t.__webglDepthbuffer[n],e,!1);else{let r=e.stencilBuffer?l.DEPTH_STENCIL_ATTACHMENT:l.DEPTH_ATTACHMENT,i=t.__webglDepthbuffer[n];l.bindRenderbuffer(l.RENDERBUFFER,i),l.framebufferRenderbuffer(l.FRAMEBUFFER,r,l.RENDERBUFFER,i)}}else{let n=e.texture.mipmaps;if(n&&n.length>0?d.bindFramebuffer(l.FRAMEBUFFER,t.__webglFramebuffer[0]):d.bindFramebuffer(l.FRAMEBUFFER,t.__webglFramebuffer),t.__webglDepthbuffer===void 0)t.__webglDepthbuffer=l.createRenderbuffer(),Ce(t.__webglDepthbuffer,e,!1);else{let n=e.stencilBuffer?l.DEPTH_STENCIL_ATTACHMENT:l.DEPTH_ATTACHMENT,r=t.__webglDepthbuffer;l.bindRenderbuffer(l.RENDERBUFFER,r),l.framebufferRenderbuffer(l.FRAMEBUFFER,n,l.RENDERBUFFER,r)}}d.bindFramebuffer(l.FRAMEBUFFER,null)}function Ee(e,t,n){let r=f.get(e);t!==void 0&&Se(r.__webglFramebuffer,e,e.texture,l.COLOR_ATTACHMENT0,l.TEXTURE_2D,0),n!==void 0&&Te(e)}function De(e){let t=e.texture,n=f.get(e),r=f.get(t);e.addEventListener(`dispose`,M);let i=e.textures,a=e.isWebGLCubeRenderTarget===!0,o=i.length>1;if(o||(r.__webglTexture===void 0&&(r.__webglTexture=l.createTexture()),r.__version=t.version,h.memory.textures++),a){n.__webglFramebuffer=[];for(let e=0;e<6;e++)if(t.mipmaps&&t.mipmaps.length>0){n.__webglFramebuffer[e]=[];for(let r=0;r<t.mipmaps.length;r++)n.__webglFramebuffer[e][r]=l.createFramebuffer()}else n.__webglFramebuffer[e]=l.createFramebuffer()}else{if(t.mipmaps&&t.mipmaps.length>0){n.__webglFramebuffer=[];for(let e=0;e<t.mipmaps.length;e++)n.__webglFramebuffer[e]=l.createFramebuffer()}else n.__webglFramebuffer=l.createFramebuffer();if(o)for(let e=0,t=i.length;e<t;e++){let t=f.get(i[e]);t.__webglTexture===void 0&&(t.__webglTexture=l.createTexture(),h.memory.textures++)}if(e.samples>0&&Ne(e)===!1){n.__webglMultisampledFramebuffer=l.createFramebuffer(),n.__webglColorRenderbuffer=[],d.bindFramebuffer(l.FRAMEBUFFER,n.__webglMultisampledFramebuffer);for(let t=0;t<i.length;t++){let r=i[t];n.__webglColorRenderbuffer[t]=l.createRenderbuffer(),l.bindRenderbuffer(l.RENDERBUFFER,n.__webglColorRenderbuffer[t]);let a=m.convert(r.format,r.colorSpace),o=m.convert(r.type),s=A(r.internalFormat,a,o,r.normalized,r.colorSpace,e.isXRRenderTarget===!0),c=Me(e);l.renderbufferStorageMultisample(l.RENDERBUFFER,c,s,e.width,e.height),l.framebufferRenderbuffer(l.FRAMEBUFFER,l.COLOR_ATTACHMENT0+t,l.RENDERBUFFER,n.__webglColorRenderbuffer[t])}l.bindRenderbuffer(l.RENDERBUFFER,null),e.depthBuffer&&(n.__webglDepthRenderbuffer=l.createRenderbuffer(),Ce(n.__webglDepthRenderbuffer,e,!0)),d.bindFramebuffer(l.FRAMEBUFFER,null)}}if(a){d.bindTexture(l.TEXTURE_CUBE_MAP,r.__webglTexture),ge(l.TEXTURE_CUBE_MAP,t);for(let r=0;r<6;r++)if(t.mipmaps&&t.mipmaps.length>0)for(let i=0;i<t.mipmaps.length;i++)Se(n.__webglFramebuffer[r][i],e,t,l.COLOR_ATTACHMENT0,l.TEXTURE_CUBE_MAP_POSITIVE_X+r,i);else Se(n.__webglFramebuffer[r],e,t,l.COLOR_ATTACHMENT0,l.TEXTURE_CUBE_MAP_POSITIVE_X+r,0);D(t)&&O(l.TEXTURE_CUBE_MAP),d.unbindTexture()}else if(o){for(let t=0,r=i.length;t<r;t++){let r=i[t],a=f.get(r),o=l.TEXTURE_2D;(e.isWebGL3DRenderTarget||e.isWebGLArrayRenderTarget)&&(o=e.isWebGL3DRenderTarget?l.TEXTURE_3D:l.TEXTURE_2D_ARRAY),d.bindTexture(o,a.__webglTexture),ge(o,r),Se(n.__webglFramebuffer,e,r,l.COLOR_ATTACHMENT0+t,o,0),D(r)&&O(o)}d.unbindTexture()}else{let i=l.TEXTURE_2D;if((e.isWebGL3DRenderTarget||e.isWebGLArrayRenderTarget)&&(i=e.isWebGL3DRenderTarget?l.TEXTURE_3D:l.TEXTURE_2D_ARRAY),d.bindTexture(i,r.__webglTexture),ge(i,t),t.mipmaps&&t.mipmaps.length>0)for(let r=0;r<t.mipmaps.length;r++)Se(n.__webglFramebuffer[r],e,t,l.COLOR_ATTACHMENT0,i,r);else Se(n.__webglFramebuffer,e,t,l.COLOR_ATTACHMENT0,i,0);D(t)&&O(i),d.unbindTexture()}e.depthBuffer&&Te(e)}function Oe(e){let t=e.textures;for(let n=0,r=t.length;n<r;n++){let r=t[n];if(D(r)){let t=k(e),n=f.get(r).__webglTexture;d.bindTexture(t,n),O(t),d.unbindTexture()}}}let ke=[],Ae=[];function je(e){if(e.samples>0){if(Ne(e)===!1){let t=e.textures,n=e.width,r=e.height,i=l.COLOR_BUFFER_BIT,a=e.stencilBuffer?l.DEPTH_STENCIL_ATTACHMENT:l.DEPTH_ATTACHMENT,o=f.get(e),s=t.length>1;if(s)for(let e=0;e<t.length;e++)d.bindFramebuffer(l.FRAMEBUFFER,o.__webglMultisampledFramebuffer),l.framebufferRenderbuffer(l.FRAMEBUFFER,l.COLOR_ATTACHMENT0+e,l.RENDERBUFFER,null),d.bindFramebuffer(l.FRAMEBUFFER,o.__webglFramebuffer),l.framebufferTexture2D(l.DRAW_FRAMEBUFFER,l.COLOR_ATTACHMENT0+e,l.TEXTURE_2D,null,0);d.bindFramebuffer(l.READ_FRAMEBUFFER,o.__webglMultisampledFramebuffer);let c=e.texture.mipmaps;c&&c.length>0?d.bindFramebuffer(l.DRAW_FRAMEBUFFER,o.__webglFramebuffer[0]):d.bindFramebuffer(l.DRAW_FRAMEBUFFER,o.__webglFramebuffer);for(let c=0;c<t.length;c++){if(e.resolveDepthBuffer&&(e.depthBuffer&&(i|=l.DEPTH_BUFFER_BIT),e.stencilBuffer&&e.resolveStencilBuffer&&(i|=l.STENCIL_BUFFER_BIT)),s){l.framebufferRenderbuffer(l.READ_FRAMEBUFFER,l.COLOR_ATTACHMENT0,l.RENDERBUFFER,o.__webglColorRenderbuffer[c]);let e=f.get(t[c]).__webglTexture;l.framebufferTexture2D(l.DRAW_FRAMEBUFFER,l.COLOR_ATTACHMENT0,l.TEXTURE_2D,e,0)}l.blitFramebuffer(0,0,n,r,0,0,n,r,i,l.NEAREST),_===!0&&(ke.length=0,Ae.length=0,ke.push(l.COLOR_ATTACHMENT0+c),e.depthBuffer&&e.storeMultisampledDepthBuffer===!1&&(ke.push(a),Ae.push(a),l.invalidateFramebuffer(l.DRAW_FRAMEBUFFER,Ae)),l.invalidateFramebuffer(l.READ_FRAMEBUFFER,ke))}if(d.bindFramebuffer(l.READ_FRAMEBUFFER,null),d.bindFramebuffer(l.DRAW_FRAMEBUFFER,null),s)for(let e=0;e<t.length;e++){d.bindFramebuffer(l.FRAMEBUFFER,o.__webglMultisampledFramebuffer),l.framebufferRenderbuffer(l.FRAMEBUFFER,l.COLOR_ATTACHMENT0+e,l.RENDERBUFFER,o.__webglColorRenderbuffer[e]);let n=f.get(t[e]).__webglTexture;d.bindFramebuffer(l.FRAMEBUFFER,o.__webglFramebuffer),l.framebufferTexture2D(l.DRAW_FRAMEBUFFER,l.COLOR_ATTACHMENT0+e,l.TEXTURE_2D,n,0)}d.bindFramebuffer(l.DRAW_FRAMEBUFFER,o.__webglMultisampledFramebuffer)}else if(e.depthBuffer&&e.storeMultisampledDepthBuffer===!1&&_){let t=e.stencilBuffer?l.DEPTH_STENCIL_ATTACHMENT:l.DEPTH_ATTACHMENT;l.invalidateFramebuffer(l.DRAW_FRAMEBUFFER,[t])}}}function Me(e){return Math.min(p.maxSamples,e.samples)}function Ne(e){let t=f.get(e);return e.samples>0&&u.has(`WEBGL_multisampled_render_to_texture`)===!0&&t.__useRenderToTexture!==!1}function F(e){let t=h.render.frame;y.get(e)!==t&&(y.set(e,t),e.update())}function Pe(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(G.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&z(`WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):B(`WebGLTextures: Unsupported texture color space:`,n)),t}function Fe(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(v.width=e.naturalWidth||e.width,v.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(v.width=e.displayWidth,v.height=e.displayHeight):(v.width=e.width,v.height=e.height),v}this.allocateTextureUnit=ce,this.resetTextureUnits=ae,this.getTextureUnits=oe,this.setTextureUnits=se,this.setTexture2D=P,this.setTexture2DArray=ue,this.setTexture3D=de,this.setTextureCube=fe,this.rebindTextures=Ee,this.setupRenderTarget=De,this.updateRenderTargetMipmap=Oe,this.updateMultisampleRenderTarget=je,this.setupDepthRenderbuffer=Te,this.setupFrameBufferTexture=Se,this.useMultisampledRTT=Ne,this.isReversedDepthBuffer=function(){return d.buffers.depth.getReversed()}}function Yc(e,t){function n(n,r=``){let i,a=G.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779){if(a===`srgb`){if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null}else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null}if(n===35840||n===35841||n===35842||n===35843){if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null}if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491){if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return i.COMPRESSED_R11_EAC;if(n===37489)return i.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return i.COMPRESSED_RG11_EAC;if(n===37491)return i.COMPRESSED_SIGNED_RG11_EAC}else return null}if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821){if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null}if(n===36492||n===36494||n===36495){if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null}if(n===36283||n===36284||n===36285||n===36286){if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null}return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var Xc=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Zc=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Qc=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new di(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new ji({vertexShader:Xc,fragmentShader:Zc,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new q(new yi(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},$c=class extends tt{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,s=1,c=null,u=null,d=null,f=null,p=null,h=null,g=typeof XRWebGLBinding<`u`,_=new Qc,v={},b=t.getContextAttributes(),x=null,S=null,C=[],D=[],O=new H,k=null,A=null,ee=new ma;ee.viewport=new Dt;let j=new ma;j.viewport=new Dt;let te=[ee,j],M=new wa,ne=null,N=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=C[e];return t===void 0&&(t=new ln,C[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=C[e];return t===void 0&&(t=new ln,C[e]=t),t.getGripSpace()},this.getHand=function(e){let t=C[e];return t===void 0&&(t=new ln,C[e]=t),t.getHandSpace()};function re(e){let t=D.indexOf(e.inputSource);if(t===-1)return;let n=C[t];n!==void 0&&(n.update(e.inputSource,e.frame,c||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function ie(){r.removeEventListener(`select`,re),r.removeEventListener(`selectstart`,re),r.removeEventListener(`selectend`,re),r.removeEventListener(`squeeze`,re),r.removeEventListener(`squeezestart`,re),r.removeEventListener(`squeezeend`,re),r.removeEventListener(`end`,ie),r.removeEventListener(`inputsourceschange`,ae);for(let e=0;e<C.length;e++){let t=D[e];t!==null&&(D[e]=null,C[e].disconnect(t))}ne=null,N=null,_.reset();for(let e in v)delete v[e];if(e.setRenderTarget(x),p=null,f=null,d=null,r=null,S=null,fe.stop(),n.isPresenting=!1,e.setPixelRatio(k),e.setSize(O.width,O.height,!1),A!==null){let e=A.camera;e.fov=A.fov,e.zoom=A.zoom,e.updateProjectionMatrix(),A=null}n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&z(`WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&z(`WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(e){c=e},this.getBaseLayer=function(){return f===null?p:f},this.getBinding=function(){return d===null&&g&&(d=new XRWebGLBinding(r,t)),d},this.getFrame=function(){return h},this.getSession=function(){return r},this.setSession=async function(u){if(r=u,r!==null){if(x=e.getRenderTarget(),r.addEventListener(`select`,re),r.addEventListener(`selectstart`,re),r.addEventListener(`selectend`,re),r.addEventListener(`squeeze`,re),r.addEventListener(`squeezestart`,re),r.addEventListener(`squeezeend`,re),r.addEventListener(`end`,ie),r.addEventListener(`inputsourceschange`,ae),b.xrCompatible!==!0&&await t.makeXRCompatible(),k=e.getPixelRatio(),e.getSize(O),g&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,a=null,o=null;b.depth&&(o=b.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=b.stencil?E:T,a=b.stencil?y:m);let s={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};d=this.getBinding(),f=d.createProjectionLayer(s),r.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),S=new kt(f.textureWidth,f.textureHeight,{format:w,type:l,depthTexture:new li(f.textureWidth,f.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:b.stencil,colorSpace:e.outputColorSpace,samples:b.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}else{let n={antialias:b.antialias,alpha:!0,depth:b.depth,stencil:b.stencil,framebufferScaleFactor:i};p=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),S=new kt(p.framebufferWidth,p.framebufferHeight,{format:w,type:l,colorSpace:e.outputColorSpace,stencilBuffer:b.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1,storeMultisampledDepthBuffer:p.ignoreDepthValues===!1,storeMultisampledStencilBuffer:p.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(s),c=null,a=await r.requestReferenceSpace(o),fe.setContext(r),fe.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function ae(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=D.indexOf(n);r>=0&&(D[r]=null,C[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=D.indexOf(n);if(r===-1){for(let e=0;e<C.length;e++)if(e>=D.length){D.push(n),r=e;break}else if(D[e]===null){D[e]=n,r=e;break}if(r===-1)break}let i=C[r];i&&i.connect(n)}}let oe=new U,se=new U;function ce(e,t,n){oe.setFromMatrixPosition(t.matrixWorld),se.setFromMatrixPosition(n.matrixWorld);let r=oe.distanceTo(se),i=t.projectionMatrix.elements,a=n.projectionMatrix.elements,o=i[14]/(i[10]-1),s=i[14]/(i[10]+1),c=(i[9]+1)/i[5],l=(i[9]-1)/i[5],u=(i[8]-1)/i[0],d=(a[8]+1)/a[0],f=o*u,p=o*d,m=r/(-u+d),h=m*-u;if(t.matrixWorld.decompose(e.position,e.quaternion,e.scale),e.translateX(h),e.translateZ(m),e.matrixWorld.compose(e.position,e.quaternion,e.scale),e.matrixWorldInverse.copy(e.matrixWorld).invert(),i[10]===-1)e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse);else{let t=o+m,n=s+m,i=f-h,a=p+(r-h),u=c*s/n*t,d=l*s/n*t;e.projectionMatrix.makePerspective(i,a,u,d,t,n),e.projectionMatrixInverse.copy(e.projectionMatrix).invert()}}function le(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;let t=e.near,n=e.far;_.texture!==null&&(_.depthNear>0&&(t=_.depthNear),_.depthFar>0&&(n=_.depthFar)),M.near=j.near=ee.near=t,M.far=j.far=ee.far=n,(ne!==M.near||N!==M.far)&&(r.updateRenderState({depthNear:M.near,depthFar:M.far}),ne=M.near,N=M.far),M.layers.mask=e.layers.mask|6,ee.layers.mask=M.layers.mask&-5,j.layers.mask=M.layers.mask&-3;let i=e.parent,a=M.cameras;le(M,i);for(let e=0;e<a.length;e++)le(a[e],i);a.length===2?ce(M,ee,j):M.projectionMatrix.copy(ee.projectionMatrix),A===null&&e.isPerspectiveCamera&&(A={camera:e,fov:e.fov,zoom:e.zoom}),P(e,M,i)};function P(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=it*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(f!==null||p!==null)return s},this.setFoveation=function(e){s=e,f!==null&&(f.fixedFoveation=e),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=e)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(M)},this.getCameraTexture=function(e){return v[e]};let ue=null;function de(t,i){if(u=i.getViewerPose(c||a),h=i,u!==null){let t=u.views;p!==null&&(e.setRenderTargetFramebuffer(S,p.framebuffer),e.setRenderTarget(S));let i=!1;t.length!==M.cameras.length&&(M.cameras.length=0,i=!0);for(let n=0;n<t.length;n++){let r=t[n],a=null;if(p!==null)a=p.getViewport(r);else{let t=d.getViewSubImage(f,r);a=t.viewport,n===0&&(e.setRenderTargetTextures(S,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(S))}let o=te[n];o===void 0&&(o=new ma,o.layers.enable(n),o.viewport=new Dt,te[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),n===0&&(M.matrix.copy(o.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),i===!0&&M.cameras.push(o)}let a=r.enabledFeatures;if(a&&a.includes(`depth-sensing`)&&r.depthUsage==`gpu-optimized`&&g){d=n.getBinding();let e=d.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&_.init(e,r.renderState)}if(a&&a.includes(`camera-access`)&&g){e.state.unbindTexture(),d=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=v[n];e||(e=new di,v[n]=e);let t=d.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<C.length;e++){let t=D[e],n=C[e];t!==null&&n!==void 0&&n.update(t,i,c||a)}ue&&ue(t,i),i.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:i}),h=null}let fe=new Wa;fe.setAnimationLoop(de),this.setAnimationLoop=function(e){ue=e},this.dispose=function(){}}},el=new Mt,tl=new W;tl.set(-1,0,0,0,1,0,0,0,1);function nl(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,Di(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isNodeMaterial?t.uniformsNeedUpdate=!1:t.isMeshBasicMaterial?a(e,t):t.isMeshLambertMaterial?(a(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,e.envMapRotation.value.setFromMatrix4(el.makeRotationFromEuler(o)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&e.envMapRotation.value.premultiply(tl),e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.retroreflectivity>0&&(e.retroreflectivity.value=t.retroreflectivity),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessRange[0],e.iridescenceThicknessMaximum.value=t.iridescenceThicknessRange[1],t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function rl(e,t,n,r){let i={},a={},o=[],s=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function c(e,t){let n=t.program;r.uniformBlockBinding(e,n)}function l(e,n){let o=i[e.id];o===void 0&&(g(e),o=u(e),i[e.id]=o,e.addEventListener(`dispose`,v));let s=n.program;r.updateUBOMapping(e,s);let c=t.render.frame;a[e.id]!==c&&(f(e),a[e.id]=c)}function u(t){let n=d();t.__bindingPointIndex=n;let r=e.createBuffer(),i=t.__size,a=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,r),e.bufferData(e.UNIFORM_BUFFER,i,a),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,n,r),r}function d(){for(let e=0;e<s;e++)if(o.indexOf(e)===-1)return o.push(e),e;return B(`WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached.`),0}function f(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let e=0,t=r.length;e<t;e++){let t=r[e];if(Array.isArray(t))for(let n=0,r=t.length;n<r;n++)p(t[n],e,n,a);else p(t,e,0,a)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function p(t,n,r,i){if(h(t,n,r,i)===!0){let n=t.__offset,r=t.value;if(Array.isArray(r)){let e=0;for(let n=0;n<r.length;n++){let i=r[n],a=_(i);m(i,t.__data,e),typeof i!=`number`&&typeof i!=`boolean`&&!i.isMatrix3&&!ArrayBuffer.isView(i)&&(e+=a.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(r,t.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,n,t.__data)}}function m(e,t,n){typeof e==`number`||typeof e==`boolean`?t[0]=e:e.isMatrix3?(t[0]=e.elements[0],t[1]=e.elements[1],t[2]=e.elements[2],t[3]=0,t[4]=e.elements[3],t[5]=e.elements[4],t[6]=e.elements[5],t[7]=0,t[8]=e.elements[6],t[9]=e.elements[7],t[10]=e.elements[8],t[11]=0):ArrayBuffer.isView(e)?t.set(new e.constructor(e.buffer,e.byteOffset,t.length)):e.toArray(t,n)}function h(e,t,n,r){let i=e.value,a=t+`_`+n;if(r[a]===void 0)return r[a]=typeof i==`number`||typeof i==`boolean`?i:ArrayBuffer.isView(i)?i.slice():i.clone(),!0;{let e=r[a];if(typeof i==`number`||typeof i==`boolean`){if(e!==i)return r[a]=i,!0}else if(ArrayBuffer.isView(i))return!0;else if(e.equals(i)===!1)return e.copy(i),!0}return!1}function g(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let e=0,t=r.length;e<t;e++){let t=r[e],i=Array.isArray(t.value)?t.value:[t.value];for(let e=0,r=i.length;e<r;e++){let r=i[e],a=_(r),o=n%16,s=o%a.boundary,c=o+s;n+=s,c!==0&&16-c<a.storage&&(n+=16-c),t.__data=new Float32Array(a.storage/Float32Array.BYTES_PER_ELEMENT),t.__offset=n,n+=a.storage}}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function _(e){let t={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(t.boundary=4,t.storage=4):e.isVector2?(t.boundary=8,t.storage=8):e.isVector3||e.isColor?(t.boundary=16,t.storage=12):e.isVector4?(t.boundary=16,t.storage=16):e.isMatrix3?(t.boundary=48,t.storage=48):e.isMatrix4?(t.boundary=64,t.storage=64):e.isTexture?z(`WebGLRenderer: Texture samplers can not be part of an uniforms group.`):ArrayBuffer.isView(e)?(t.boundary=16,t.storage=e.byteLength):z(`WebGLRenderer: Unsupported uniform value type.`,e),t}function v(t){let n=t.target;n.removeEventListener(`dispose`,v);let r=o.indexOf(n.__bindingPointIndex);o.splice(r,1),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function y(){for(let t in i)e.deleteBuffer(i[t]);o=[],i={},a={}}return{bind:c,update:l,dispose:y}}var il=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),al=null;function ol(){return al===null&&(al=new Fr(il,16,16,k,g),al.name=`DFG_LUT`,al.minFilter=o,al.magFilter=o,al.wrapS=t,al.wrapT=t,al.generateMipmaps=!1,al.needsUpdate=!0),al}var sl=class{constructor(e={}){let{canvas:t=Je(),context:n=null,depth:r=!0,stencil:i=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:s=!0,preserveDrawingBuffer:u=!1,powerPreference:d=`default`,failIfMajorPerformanceCaveat:p=!1,reversedDepthBuffer:h=!1,outputBufferType:b=l}=e;this.isWebGLRenderer=!0;let x;if(n!==null){if(typeof WebGLRenderingContext<`u`&&n instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);x=n.getContextAttributes().alpha}else x=a;let S=b,C=new Set([ee,A,O]),w=new Set([l,m,f,y,_,v]),T=new Uint32Array(4),E=new Int32Array(4),D=new U,k=null,j=null,te=[],M=[],ne=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let N=this,re=!1,ie=null,ae=null,oe=null,se=null;this._outputColorSpace=Re;let ce=0,le=0,P=null,ue=-1,de=null,fe=new Dt,pe=new Dt,me=null,he=new K(0),ge=0,_e=t.width,ve=t.height,ye=1,be=null,xe=null,Se=new Dt(0,0,_e,ve),Ce=new Dt(0,0,_e,ve),we=!1,Te=new Jr,Ee=!1,De=!1,Oe=new Mt,ke=new U,Ae=new Dt,je={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Me=!1;function Ne(){return P===null?ye:1}let F=n;function Pe(e,n){return t.getContext(e,n)}let Fe,Ie,I,Le,L,R,ze,Be,Ve,He,Ue,Ge,Ke,qe,Ye,Ze,Qe,et,tt,nt,rt,it,at;try{let e={alpha:!0,depth:r,stencil:i,antialias:o,premultipliedAlpha:s,preserveDrawingBuffer:u,powerPreference:d,failIfMajorPerformanceCaveat:p};if(`setAttribute`in t&&t.setAttribute(`data-engine`,`three.js r186`),t.addEventListener(`webglcontextlost`,st,!1),t.addEventListener(`webglcontextrestored`,ct,!1),t.addEventListener(`webglcontextcreationerror`,lt,!1),F===null){let t=`webgl2`;if(F=Pe(t,e),F===null)throw Pe(t)?Error(`THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.`):Error(`THREE.WebGLRenderer: Error creating WebGL context.`)}V()}catch(e){throw t.removeEventListener(`webglcontextlost`,st,!1),t.removeEventListener(`webglcontextrestored`,ct,!1),t.removeEventListener(`webglcontextcreationerror`,lt,!1),B(`WebGLRenderer: `+e.message),e}function V(){Fe=new To(F),Fe.init(),rt=new Yc(F,Fe),Ie=new $a(F,Fe,e,rt),I=new qc(F,Fe),Ie.reversedDepthBuffer&&h&&I.buffers.depth.setReversed(!0),ae=F.createFramebuffer(),oe=F.createFramebuffer(),se=F.createFramebuffer(),Le=new Oo(F),L=new Dc,R=new Jc(F,Fe,I,L,Ie,rt,Le),ze=new wo(N),Be=new Ga(F),it=new Za(F,Be),Ve=new Eo(F,Be,Le,it),He=new Ao(F,Ve,Be,it,Le),et=new ko(F,Ie,R),Ye=new eo(L),Ue=new Ec(N,ze,Fe,Ie,it,Ye),Ge=new nl(N,L),Ke=new jc,qe=new Rc(Fe),Qe=new Xa(N,ze,I,He,x,s),Ze=new Kc(N,He,Ie),at=new rl(F,Le,Ie,I),tt=new Qa(F,Fe,Le),nt=new Do(F,Fe,Le),Le.programs=Ue.programs,N.capabilities=Ie,N.extensions=Fe,N.properties=L,N.renderLists=Ke,N.shadowMap=Ze,N.state=I,N.info=Le}S!==1009&&(ne=new Mo(S,t.width,t.height,o,r,i));let ot=new $c(N,F);this.xr=ot,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){let e=Fe.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=Fe.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return ye},this.setPixelRatio=function(e){e!==void 0&&(ye=e,this.setSize(_e,ve,!1))},this.getSize=function(e){return e.set(_e,ve)},this.setSize=function(e,n,r=!0){if(ot.isPresenting){z(`WebGLRenderer: Can't change size while VR device is presenting.`);return}_e=e,ve=n,t.width=Math.floor(e*ye),t.height=Math.floor(n*ye),r===!0&&(t.style.width=e+`px`,t.style.height=n+`px`),ne!==null&&ne.setSize(t.width,t.height),this.setViewport(0,0,e,n)},this.getDrawingBufferSize=function(e){return e.set(_e*ye,ve*ye).floor()},this.setDrawingBufferSize=function(e,n,r){_e=e,ve=n,ye=r,t.width=Math.floor(e*r),t.height=Math.floor(n*r),this.setViewport(0,0,e,n)},this.setEffects=function(e){if(S===1009){B(`WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.`);return}if(e){for(let t=0;t<e.length;t++)if(e[t].isOutputPass===!0){z(`WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.`);break}}ne.setEffects(e||[])},this.getCurrentViewport=function(e){return e.copy(fe)},this.getViewport=function(e){return e.copy(Se)},this.setViewport=function(e,t,n,r){e.isVector4?Se.set(e.x,e.y,e.z,e.w):Se.set(e,t,n,r),I.viewport(fe.copy(Se).multiplyScalar(ye).round())},this.getScissor=function(e){return e.copy(Ce)},this.setScissor=function(e,t,n,r){e.isVector4?Ce.set(e.x,e.y,e.z,e.w):Ce.set(e,t,n,r),I.scissor(pe.copy(Ce).multiplyScalar(ye).round())},this.getScissorTest=function(){return we},this.setScissorTest=function(e){I.setScissorTest(we=e)},this.setOpaqueSort=function(e){be=e},this.setTransparentSort=function(e){xe=e},this.getClearColor=function(e){return e.copy(Qe.getClearColor())},this.setClearColor=function(){Qe.setClearColor(...arguments)},this.getClearAlpha=function(){return Qe.getClearAlpha()},this.setClearAlpha=function(){Qe.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(P!==null){let t=P.texture.format;e=C.has(t)}if(e){let e=P.texture.type,t=w.has(e),n=Qe.getClearColor(),r=Qe.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(T[0]=i,T[1]=a,T[2]=o,T[3]=r,F.clearBufferuiv(F.COLOR,0,T)):(E[0]=i,E[1]=a,E[2]=o,E[3]=r,F.clearBufferiv(F.COLOR,0,E))}else r|=F.COLOR_BUFFER_BIT}t&&(r|=F.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),n&&(r|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),r!==0&&F.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(e){e.setRenderer(this),ie=e},this.dispose=function(){t.removeEventListener(`webglcontextlost`,st,!1),t.removeEventListener(`webglcontextrestored`,ct,!1),t.removeEventListener(`webglcontextcreationerror`,lt,!1),Qe.dispose(),Ke.dispose(),qe.dispose(),L.dispose(),ze.dispose(),He.dispose(),it.dispose(),at.dispose(),Ue.dispose(),ot.dispose(),ot.removeEventListener(`sessionstart`,mt),ot.removeEventListener(`sessionend`,ht),gt.stop()};function st(e){e.preventDefault(),Xe(`WebGLRenderer: Context Lost.`),re=!0}function ct(){Xe(`WebGLRenderer: Context Restored.`),re=!1;let e=Le.autoReset,t=Ze.enabled,n=Ze.autoUpdate,r=Ze.needsUpdate,i=Ze.type;V(),Le.autoReset=e,Ze.enabled=t,Ze.autoUpdate=n,Ze.needsUpdate=r,Ze.type=i}function lt(e){B(`WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function H(e){let t=e.target;t.removeEventListener(`dispose`,H),ut(t)}function ut(e){dt(e),L.remove(e)}function dt(e){let t=L.get(e).programs;t!==void 0&&(t.forEach(function(e){Ue.releaseProgram(e)}),e.isShaderMaterial&&Ue.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=je);let o=i.isMesh&&i.matrixWorld.determinantAffine()<0,s=Et(e,t,n,r,i);I.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=Ve.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;it.setup(i,r,s,n,c);let h,g=tt;if(c!==null&&(h=Be.get(c),g=nt,g.setIndex(h)),i.isMesh)r.wireframe===!0?(I.setLineWidth(r.wireframeLinewidth*Ne()),g.setMode(F.LINES)):g.setMode(F.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),I.setLineWidth(e*Ne()),i.isLineSegments?g.setMode(F.LINES):i.isLineLoop?g.setMode(F.LINE_LOOP):g.setMode(F.LINE_STRIP)}else i.isPoints?g.setMode(F.POINTS):i.isSprite&&g.setMode(F.TRIANGLES);if(i.isBatchedMesh){if(Fe.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?Be.get(c).bytesPerElement:1,o=L.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(F,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function ft(e,t,n,r){ie!==null&&e.isNodeMaterial&&ie.setObject(r,e),Ee===!0&&Ye.setState(e,n,!1),e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,St(e,t,r),e.side=0,e.needsUpdate=!0,St(e,t,r),e.side=2):St(e,t,r)}this.compile=function(e,t,n=null){n===null&&(n=e),ie!==null&&ie.renderStart(e,t,n),j=qe.get(n),j.init(t),M.push(j),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(j.pushLight(e),e.castShadow&&j.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(j.pushLight(e),e.castShadow&&j.pushShadow(e))}),j.setupLights(),ie!==null&&ie.updateLights(j.state.lightsArray),De=this.localClippingEnabled,Ee=Ye.init(this.clippingPlanes,De),Ee===!0&&Ye.setGlobalState(this.clippingPlanes,t),ie!==null&&Ze.render(j.state.shadowsArray,n,t);let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let i=e.material;if(i){if(Array.isArray(i))for(let a=0;a<i.length;a++){let o=i[a];ft(o,n,t,e),r.add(o)}else ft(i,n,t,e),r.add(i)}}),j=M.pop(),ie!==null&&ie.renderEnd(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){if(r.forEach(function(e){let t=L.get(e).currentProgram;(t===void 0||t.isReady())&&r.delete(e)}),r.size===0){t(e);return}setTimeout(n,10)}Fe.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let W=null;function pt(e){W&&W(e)}function mt(){gt.stop()}function ht(){gt.start()}let gt=new Wa;gt.setAnimationLoop(pt),typeof self<`u`&&gt.setContext(self),this.setAnimationLoop=function(e){W=e,ot.setAnimationLoop(e),e===null?gt.stop():gt.start()},ot.addEventListener(`sessionstart`,mt),ot.addEventListener(`sessionend`,ht),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){B(`WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(re===!0)return;ie!==null&&ie.renderStart(e,t);let n=ot.enabled===!0&&ot.isPresenting===!0,r=ne!==null&&(P===null||n)&&ne.begin(N,P);if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),ot.enabled===!0&&ot.isPresenting===!0&&(ne===null||ne.isCompositing()===!1)&&(ot.cameraAutoUpdate===!0&&ot.updateCamera(t),t=ot.getCamera()),e.isScene===!0&&e.onBeforeRender(N,e,t,P),j=qe.get(e,M.length),j.init(t),j.state.textureUnits=R.getTextureUnits(),M.push(j),Oe.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),Te.setFromProjectionMatrix(Oe,We,t.reversedDepth),De=this.localClippingEnabled,Ee=Ye.init(this.clippingPlanes,De),k=Ke.get(e,te.length),k.init(),te.push(k),ot.enabled===!0&&ot.isPresenting===!0){let e=N.xr.getDepthSensingMesh();e!==null&&_t(e,t,-1/0,N.sortObjects)}_t(e,t,0,N.sortObjects),k.finish(),ie!==null&&ie.updateLights(j.state.lightsArray),N.sortObjects===!0&&k.sort(be,xe),Me=ot.enabled===!1||ot.isPresenting===!1||ot.hasDepthSensing()===!1,Me&&Qe.addToRenderList(k,e),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Ee===!0&&Ye.beginShadows();let i=j.state.shadowsArray;if(Ze.render(i,e,t),Ee===!0&&Ye.endShadows(),(r&&ne.hasRenderPass())===!1){let n=k.opaque,r=k.transmissive;if(j.setupLights(),t.isArrayCamera){let i=t.cameras;if(r.length>0)for(let t=0,a=i.length;t<a;t++){let a=i[t];yt(n,r,e,a)}Me&&Qe.render(e);for(let t=0,n=i.length;t<n;t++){let n=i[t];vt(k,e,n,n.viewport)}}else r.length>0&&yt(n,r,e,t),Me&&Qe.render(e),vt(k,e,t)}P!==null&&le===0&&(R.updateMultisampleRenderTarget(P),R.updateRenderTargetMipmap(P)),r&&ne.end(N),e.isScene===!0&&e.onAfterRender(N,e,t),it.resetDefaultState(),ue=-1,de=null,M.pop(),M.length>0?(j=M[M.length-1],R.setTextureUnits(j.state.textureUnits),Ee===!0&&Ye.setGlobalState(N.clippingPlanes,j.state.camera)):j=null,te.pop(),k=te.length>0?te[te.length-1]:null,ie!==null&&ie.renderEnd()};function _t(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLightProbeGrid)j.pushLightProbeGrid(e);else if(e.isLight)j.pushLight(e),e.castShadow&&j.pushShadow(e);else if(e.isSprite){if(!e.frustumCulled||e.intersectsFrustum(Te)){r&&Ae.setFromMatrixPosition(e.matrixWorld).applyMatrix4(Oe);let i=He.update(e),a=e.material;a.visible&&k.push(e,i,a,n,Ae.z,null,t)}}else if((e.isMesh||e.isLine||e.isPoints)&&(!e.frustumCulled||e.intersectsFrustum(Te))){let i=He.update(e),a=e.material;if(r&&(e.boundingSphere===void 0?(i.boundingSphere===null&&i.computeBoundingSphere(),Ae.copy(i.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),Ae.copy(e.boundingSphere.center)),Ae.applyMatrix4(e.matrixWorld).applyMatrix4(Oe)),Array.isArray(a)){let r=i.groups;for(let o=0,s=r.length;o<s;o++){let s=r[o],c=a[s.materialIndex];c&&c.visible&&k.push(e,i,c,n,Ae.z,s,t)}}else a.visible&&k.push(e,i,a,n,Ae.z,null,t)}}let i=e.children;for(let e=0,a=i.length;e<a;e++)_t(i[e],t,n,r)}function vt(e,t,n,r){let{opaque:i,transmissive:a,transparent:o}=e;j.setupLightsView(n),Ee===!0&&Ye.setGlobalState(N.clippingPlanes,n),r&&I.viewport(fe.copy(r)),i.length>0&&bt(i,t,n),a.length>0&&bt(a,t,n),o.length>0&&bt(o,t,n),I.buffers.depth.setTest(!0),I.buffers.depth.setMask(!0),I.buffers.color.setMask(!0),I.setPolygonOffset(!1)}function yt(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;if(j.state.transmissionRenderTarget[r.id]===void 0){let e=Fe.has(`EXT_color_buffer_half_float`)||Fe.has(`EXT_color_buffer_float`);j.state.transmissionRenderTarget[r.id]=new kt(1,1,{generateMipmaps:!0,type:e?g:l,minFilter:c,samples:Math.max(4,Ie.samples),stencilBuffer:i,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:G.workingColorSpace})}let a=j.state.transmissionRenderTarget[r.id],o=r.viewport||fe;a.setSize(o.z*N.transmissionResolutionScale,o.w*N.transmissionResolutionScale);let s=N.getRenderTarget(),u=N.getActiveCubeFace(),d=N.getActiveMipmapLevel();N.setRenderTarget(a),N.getClearColor(he),ge=N.getClearAlpha(),ge<1&&N.setClearColor(16777215,.5),N.clear(),Me&&Qe.render(n);let f=N.toneMapping;N.toneMapping=0;let p=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),j.setupLightsView(r),Ee===!0&&Ye.setGlobalState(N.clippingPlanes,r),bt(e,n,r),R.updateMultisampleRenderTarget(a),R.updateRenderTargetMipmap(a),Fe.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let{object:a,geometry:o,material:s,group:c}=t[i];if(s.side===2&&a.layers.test(r.layers)){let t=s.side;s.side=1,s.needsUpdate=!0,xt(a,n,r,o,s,c),s.side=t,s.needsUpdate=!0,e=!0}}e===!0&&(R.updateMultisampleRenderTarget(a),R.updateRenderTargetMipmap(a))}N.setRenderTarget(s,u,d),N.setClearColor(he,ge),p!==void 0&&(r.viewport=p),N.toneMapping=f}function bt(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],{object:o,geometry:s,group:c}=a,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&xt(o,t,n,s,l,c)}}function xt(e,t,n,r,i,a){ie!==null&&i.isNodeMaterial&&ie.setObject(e,i),e.onBeforeRender(N,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(N,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,N.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,N.renderBufferDirect(n,t,r,i,e,a),i.side=2):N.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(N,t,n,r,i,a)}function St(e,t,n){t.isScene!==!0&&(t=je);let r=L.get(e),i=j.state.lights,a=j.state.shadowsArray,o=i.state.version,s=Ue.getParameters(e,i.state,a,t,n,j.state.lightProbeGridArray),c=Ue.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,r.fog=t.fog;let u=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;r.envMap=ze.get(e.envMap||r.environment,u),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,H),l=new Map,r.programs=l);let d=l.get(c);if(d!==void 0){if(r.currentProgram===d&&r.lightsStateVersion===o)return wt(e,s),d}else s.uniforms=Ue.getUniforms(e),ie!==null&&e.isNodeMaterial&&ie.build(e,n,s),e.onBeforeCompile(s,N),d=Ue.acquireProgram(s,c),l.set(c,d),r.uniforms=s.uniforms;let f=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(f.clippingPlanes=Ye.uniform),wt(e,s),r.needsLights=At(e),r.lightsStateVersion=o,r.needsLights&&(f.ambientLightColor.value=i.state.ambient,f.lightProbe.value=i.state.probe,f.sunLights.value=i.state.sun,f.sunLightShadows.value=i.state.sunShadow,f.directionalLights.value=i.state.directional,f.directionalLightShadows.value=i.state.directionalShadow,f.spotLights.value=i.state.spot,f.spotLightShadows.value=i.state.spotShadow,f.rectAreaLights.value=i.state.rectArea,f.ltc_1.value=i.state.rectAreaLTC1,f.ltc_2.value=i.state.rectAreaLTC2,f.pointLights.value=i.state.point,f.pointLightShadows.value=i.state.pointShadow,f.hemisphereLights.value=i.state.hemi,f.sunShadowMatrix.value=i.state.sunShadowMatrix,f.sunShadowCascade.value=i.state.sunShadowCascade,f.directionalShadowMatrix.value=i.state.directionalShadowMatrix,f.spotLightMatrix.value=i.state.spotLightMatrix,f.spotLightMap.value=i.state.spotLightMap,f.pointShadowMatrix.value=i.state.pointShadowMatrix),r.lightProbeGrid=j.state.lightProbeGridArray.length>0,r.currentProgram=d,r.uniformsList=null,d}function Ct(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=zs.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function wt(e,t){let n=L.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function Tt(e,t){if(e.length===0)return null;if(e.length===1)return e[0].texture===null?null:e[0];D.setFromMatrixPosition(t.matrixWorld);for(let t=0,n=e.length;t<n;t++){let n=e[t];if(n.texture!==null&&n.boundingBox.containsPoint(D))return n}return null}function Et(e,t,n,r,i){t.isScene!==!0&&(t=je),R.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial?t.environment:null,s=P===null?N.outputColorSpace:P.isXRRenderTarget===!0?P.texture.colorSpace:G.workingColorSpace,c=r.isMeshStandardMaterial||r.isMeshLambertMaterial&&!r.envMap||r.isMeshPhongMaterial&&!r.envMap,l=ze.get(r.envMap||o,c),u=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,d=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),f=!!n.morphAttributes.position,p=!!n.morphAttributes.normal,m=!!n.morphAttributes.color,h=0;r.toneMapped&&(P===null||P.isXRRenderTarget===!0)&&(h=N.toneMapping);let g=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,_=g===void 0?0:g.length,v=L.get(r),y=j.state.lights;if(Ee===!0&&(De===!0||e!==de)){let t=e===de&&r.id===ue;Ye.setState(r,e,t)}let b=!1;r.version===v.__version?v.needsLights&&v.lightsStateVersion!==y.state.version?b=!0:v.outputColorSpace===s?i.isBatchedMesh&&v.batching===!1||!i.isBatchedMesh&&v.batching===!0||i.isBatchedMesh&&v.batchingColor===!0&&i._colorsTexture===null||i.isBatchedMesh&&v.batchingColor===!1&&i._colorsTexture!==null||i.isInstancedMesh&&v.instancing===!1||!i.isInstancedMesh&&v.instancing===!0||i.isSkinnedMesh&&v.skinning===!1||!i.isSkinnedMesh&&v.skinning===!0||i.isInstancedMesh&&v.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&v.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&v.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&v.instancingMorph===!1&&i.morphTexture!==null?b=!0:v.envMap===l?r.fog===!0&&v.fog!==a||v.numClippingPlanes!==void 0&&(v.numClippingPlanes!==Ye.numPlanes||v.numIntersection!==Ye.numIntersection)?b=!0:v.vertexAlphas===u&&v.vertexTangents===d&&v.morphTargets===f&&v.morphNormals===p&&v.morphColors===m&&v.toneMapping===h&&v.morphTargetsCount===_?!!v.lightProbeGrid!=j.state.lightProbeGridArray.length>0&&(b=!0):b=!0:b=!0:b=!0:(b=!0,v.__version=r.version);let x=v.currentProgram;b===!0&&(x=St(r,t,i),ie&&r.isNodeMaterial&&ie.onUpdateProgram(r,x,v));let S=!1,C=!1,w=!1,T=x.getUniforms(),E=v.uniforms;if(I.useProgram(x.program)&&(S=!0,C=!0,w=!0),r.id!==ue&&(ue=r.id,C=!0),v.needsLights){let e=Tt(j.state.lightProbeGridArray,i);v.lightProbeGrid!==e&&(v.lightProbeGrid=e,C=!0)}if(S||de!==e){I.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),T.setValue(F,`projectionMatrix`,e.projectionMatrix),T.setValue(F,`viewMatrix`,e.matrixWorldInverse);let t=T.map.cameraPosition;t!==void 0&&t.setValue(F,ke.setFromMatrixPosition(e.matrixWorld)),Ie.logarithmicDepthBuffer&&T.setValue(F,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&T.setValue(F,`isOrthographic`,e.isOrthographicCamera===!0),de!==e&&(de=e,C=!0,w=!0)}if(v.needsLights&&(y.state.sunShadowMap.length>0&&T.setValue(F,`sunShadowMap`,y.state.sunShadowMap,R),y.state.directionalShadowMap.length>0&&T.setValue(F,`directionalShadowMap`,y.state.directionalShadowMap,R),y.state.spotShadowMap.length>0&&T.setValue(F,`spotShadowMap`,y.state.spotShadowMap,R),y.state.pointShadowMap.length>0&&T.setValue(F,`pointShadowMap`,y.state.pointShadowMap,R)),i.isSkinnedMesh){T.setOptional(F,i,`bindMatrix`),T.setOptional(F,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),T.setValue(F,`boneTexture`,e.boneTexture,R))}i.isBatchedMesh&&(T.setOptional(F,i,`batchingTexture`),T.setValue(F,`batchingTexture`,i._matricesTexture,R),T.setOptional(F,i,`batchingIdTexture`),T.setValue(F,`batchingIdTexture`,i._indirectTexture,R),T.setOptional(F,i,`batchingColorTexture`),i._colorsTexture!==null&&T.setValue(F,`batchingColorTexture`,i._colorsTexture,R));let D=n.morphAttributes;if((D.position!==void 0||D.normal!==void 0||D.color!==void 0)&&et.update(i,n,x),(C||v.receiveShadow!==i.receiveShadow)&&(v.receiveShadow=i.receiveShadow,T.setValue(F,`receiveShadow`,i.receiveShadow)),(r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial)&&r.envMap===null&&t.environment!==null&&(E.envMapIntensity.value=t.environmentIntensity),E.dfgLUT!==void 0&&(E.dfgLUT.value=ol()),C){if(T.setValue(F,`toneMappingExposure`,N.toneMappingExposure),v.needsLights&&Ot(E,w),a&&r.fog===!0&&Ge.refreshFogUniforms(E,a),Ge.refreshMaterialUniforms(E,r,ye,ve,j.state.transmissionRenderTarget[e.id]),v.needsLights&&v.lightProbeGrid){let e=v.lightProbeGrid;E.probesSH.value=e.texture,E.probesMin.value.copy(e.boundingBox.min),E.probesMax.value.copy(e.boundingBox.max),E.probesResolution.value.copy(e.resolution)}zs.upload(F,Ct(v),E,R)}if(r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(zs.upload(F,Ct(v),E,R),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&T.setValue(F,`center`,i.center),T.setValue(F,`modelViewMatrix`,i.modelViewMatrix),T.setValue(F,`normalMatrix`,i.normalMatrix),T.setValue(F,`modelMatrix`,i.matrixWorld),r.uniformsGroups!==void 0){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];at.update(n,x),at.bind(n,x)}}return x}function Ot(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.sunLights.needsUpdate=t,e.sunLightShadows.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function At(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return ce},this.getActiveMipmapLevel=function(){return le},this.getRenderTarget=function(){return P},this.setRenderTargetTextures=function(e,t,n){let r=L.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),L.get(e.texture).__webglTexture=t,L.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=L.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0},this.setRenderTarget=function(e,t=0,n=0){P=e,ce=t,le=n;let r=null,i=!1,a=!1;if(e){let o=L.get(e);if(o.__useDefaultFramebuffer!==void 0){I.bindFramebuffer(F.FRAMEBUFFER,o.__webglFramebuffer),fe.copy(e.viewport),pe.copy(e.scissor),me=e.scissorTest,I.viewport(fe),I.scissor(pe),I.setScissorTest(me),ue=-1;return}if(o.__webglFramebuffer===void 0)R.setupRenderTarget(e);else if(o.__hasExternalTextures)R.rebindTextures(e,L.get(e.texture).__webglTexture,L.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(o.__boundDepthTexture!==t){if(t!==null&&L.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.`);R.setupDepthRenderbuffer(e)}}let s=e.texture;(s.isData3DTexture||s.isDataArrayTexture||s.isCompressedArrayTexture)&&(a=!0);let c=L.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=Array.isArray(c[t])?c[t][n]:c[t],i=!0):r=e.samples>0&&R.useMultisampledRTT(e)===!1?L.get(e).__webglMultisampledFramebuffer:Array.isArray(c)?c[n]:c,fe.copy(e.viewport),pe.copy(e.scissor),me=e.scissorTest}else fe.copy(Se).multiplyScalar(ye).floor(),pe.copy(Ce).multiplyScalar(ye).floor(),me=we;if(n!==0&&(r=ae),I.bindFramebuffer(F.FRAMEBUFFER,r)&&I.drawBuffers(e,r),I.viewport(fe),I.scissor(pe),I.setScissorTest(me),i){let r=L.get(e.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(a){let r=t;for(let t=0;t<e.textures.length;t++){let i=L.get(e.textures[t]);F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=L.get(e.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,t.__webglTexture,n)}ue=-1};function jt(e){let t=L.get(e);return(t.__readFormat!==e.format||t.__readType!==e.type)&&(t.__readFormat=e.format,t.__readType=e.type,t.__formatReadable=Ie.textureFormatReadable(e.format),t.__typeReadable=Ie.textureTypeReadable(e.type)),t}this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){B(`WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=L.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){I.bindFramebuffer(F.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;e.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+s);let u=jt(o);if(u.__formatReadable===!1){B(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(u.__typeReadable===!1){B(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&F.readPixels(t,n,r,i,rt.convert(c),rt.convert(l),a)}finally{let e=P===null?null:L.get(P).__webglFramebuffer;I.bindFramebuffer(F.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=L.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){I.bindFramebuffer(F.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;e.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+s);let d=jt(o);if(d.__formatReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(d.__typeReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let f=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,f),F.bufferData(F.PIXEL_PACK_BUFFER,a.byteLength,F.STREAM_READ),F.readPixels(t,n,r,i,rt.convert(l),rt.convert(u),0),F.bindBuffer(F.PIXEL_PACK_BUFFER,null);let p=P===null?null:L.get(P).__webglFramebuffer;I.bindFramebuffer(F.FRAMEBUFFER,p);let m=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await $e(F,m,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,f),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,a),F.bindBuffer(F.PIXEL_PACK_BUFFER,null),F.deleteBuffer(f),F.deleteSync(m),a}throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)}},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;R.setTexture2D(e,0),F.copyTexSubImage2D(F.TEXTURE_2D,n,0,0,o,s,i,a),I.unbindTexture()},this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=0){let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=rt.convert(t.format),_=rt.convert(t.type),v;t.isData3DTexture?(R.setTexture3D(t,0),v=F.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(R.setTexture2DArray(t,0),v=F.TEXTURE_2D_ARRAY):(R.setTexture2D(t,0),v=F.TEXTURE_2D),I.activeTexture(F.TEXTURE0),I.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,t.flipY),I.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),I.pixelStorei(F.UNPACK_ALIGNMENT,t.unpackAlignment);let y=I.getParameter(F.UNPACK_ROW_LENGTH),b=I.getParameter(F.UNPACK_IMAGE_HEIGHT),x=I.getParameter(F.UNPACK_SKIP_PIXELS),S=I.getParameter(F.UNPACK_SKIP_ROWS),C=I.getParameter(F.UNPACK_SKIP_IMAGES);I.pixelStorei(F.UNPACK_ROW_LENGTH,h.width),I.pixelStorei(F.UNPACK_IMAGE_HEIGHT,h.height),I.pixelStorei(F.UNPACK_SKIP_PIXELS,l),I.pixelStorei(F.UNPACK_SKIP_ROWS,u),I.pixelStorei(F.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=L.get(e),r=L.get(t),h=L.get(n.__renderTarget),g=L.get(r.__renderTarget);I.bindFramebuffer(F.READ_FRAMEBUFFER,h.__webglFramebuffer),I.bindFramebuffer(F.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,L.get(e).__webglTexture,i,d+n),F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,L.get(t).__webglTexture,a,m+n)),F.blitFramebuffer(l,u,o,s,f,p,o,s,F.DEPTH_BUFFER_BIT,F.NEAREST);I.bindFramebuffer(F.READ_FRAMEBUFFER,null),I.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||L.has(e)){let n=L.get(e),r=L.get(t);I.bindFramebuffer(F.READ_FRAMEBUFFER,oe),I.bindFramebuffer(F.DRAW_FRAMEBUFFER,se);for(let e=0;e<c;e++)w?F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):F.framebufferTexture2D(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,n.__webglTexture,i),T?F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):F.framebufferTexture2D(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,r.__webglTexture,a),i===0?T?F.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):F.copyTexSubImage2D(v,a,f,p,l,u,o,s):F.blitFramebuffer(l,u,o,s,f,p,o,s,F.COLOR_BUFFER_BIT,F.NEAREST);I.bindFramebuffer(F.READ_FRAMEBUFFER,null),I.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?F.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?F.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):F.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):F.texSubImage2D(F.TEXTURE_2D,a,f,p,o,s,g,_,h);I.pixelStorei(F.UNPACK_ROW_LENGTH,y),I.pixelStorei(F.UNPACK_IMAGE_HEIGHT,b),I.pixelStorei(F.UNPACK_SKIP_PIXELS,x),I.pixelStorei(F.UNPACK_SKIP_ROWS,S),I.pixelStorei(F.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps&&F.generateMipmap(v),I.unbindTexture()},this.initRenderTarget=function(e){L.get(e).__webglFramebuffer===void 0&&R.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?R.setTextureCube(e,0):e.isData3DTexture?R.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?R.setTexture2DArray(e,0):R.setTexture2D(e,0),I.unbindTexture()},this.resetState=function(){ce=0,le=0,P=null,I.reset(),it.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return We}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=G._getDrawingBufferColorSpace(e),t.unpackColorSpace=G._getUnpackColorSpace()}},cl=new U(20,23.5,20),ll={x:Math.SQRT1_2,z:-Math.SQRT1_2},ul={x:-Math.SQRT1_2,z:-Math.SQRT1_2},dl=1.5,fl={radius:.45,walkSpeed:6,rollSpeed:13,rollTime:.38,rollCooldown:.7,attackTime:.38,attackHitAt:.45,attackRange:2.1,autoAimRange:3.2,interactRange:2.4},pl=class{ctx=null;master=null;music=null;musicKind=``;noiseBuf=null;enabled=!0;unlock(){if(this.ctx){this.ctx.state===`suspended`&&this.ctx.resume();return}try{let e=window.AudioContext??window.webkitAudioContext;this.ctx=new e,this.master=this.ctx.createGain(),this.master.gain.value=this.enabled?.5:0,this.master.connect(this.ctx.destination);let t=this.ctx.sampleRate;this.noiseBuf=this.ctx.createBuffer(1,t,this.ctx.sampleRate);let n=this.noiseBuf.getChannelData(0);for(let e=0;e<t;e++)n[e]=Math.random()*2-1;this.musicKind&&this.playMusic(this.musicKind,!0)}catch{this.ctx=null}}setEnabled(e){this.enabled=e,this.master&&this.ctx&&this.master.gain.setTargetAtTime(e?.5:0,this.ctx.currentTime,.05)}tone(e,t,n,r,i,a=0){if(!this.ctx||!this.master)return;let o=this.ctx.currentTime+a,s=this.ctx.createOscillator(),c=this.ctx.createGain();s.type=n,s.frequency.setValueAtTime(e,o),i&&s.frequency.exponentialRampToValueAtTime(i,o+t),c.gain.setValueAtTime(r,o),c.gain.exponentialRampToValueAtTime(.001,o+t),s.connect(c).connect(this.master),s.start(o),s.stop(o+t+.02)}noise(e,t,n,r=1,i=0){if(!this.ctx||!this.master||!this.noiseBuf)return;let a=this.ctx.currentTime+i,o=this.ctx.createBufferSource();o.buffer=this.noiseBuf;let s=this.ctx.createBiquadFilter();s.type=`bandpass`,s.frequency.value=n,s.Q.value=r;let c=this.ctx.createGain();c.gain.setValueAtTime(t,a),c.gain.exponentialRampToValueAtTime(.001,a+e),o.connect(s).connect(c).connect(this.master),o.start(a,Math.random()*.5),o.stop(a+e+.02)}play(e){if(this.ctx&&this.enabled)switch(e){case`swing`:this.noise(.12,.35,1800,.8);break;case`hit`:this.noise(.08,.5,900,1.2),this.tone(160,.1,`square`,.12,80);break;case`crit`:this.noise(.1,.5,1200,1),this.tone(520,.15,`square`,.12,260);break;case`gather`:this.tone(700+Math.random()*200,.08,`triangle`,.2),this.noise(.06,.25,3e3,2);break;case`pickup`:this.tone(880,.08,`sine`,.15),this.tone(1320,.1,`sine`,.12,void 0,.06);break;case`hurt`:this.tone(220,.2,`sawtooth`,.2,90);break;case`dash`:this.noise(.2,.3,700,.6);break;case`magic`:this.tone(600,.2,`sine`,.18,1200);break;case`bow`:this.tone(300,.08,`triangle`,.2,900),this.noise(.1,.2,2500,1);break;case`boom`:this.noise(.4,.6,250,.7),this.tone(90,.35,`sine`,.3,40);break;case`slam`:this.noise(.3,.5,300,.7),this.tone(70,.3,`sine`,.35,35);break;case`ice`:this.tone(1400,.3,`triangle`,.12,700),this.noise(.3,.2,5e3,2);break;case`zap`:this.noise(.18,.4,3500,.5),this.tone(1e3,.15,`sawtooth`,.1,300);break;case`kill`:this.tone(330,.1,`square`,.1,200),this.noise(.15,.3,600,1);break;case`level`:[523,659,784,1047].forEach((e,t)=>this.tone(e,.25,`triangle`,.18,void 0,t*.09));break;case`portal`:this.tone(200,.6,`sine`,.2,800),this.tone(300,.6,`sine`,.12,1200,.1);break;case`click`:this.tone(1200,.04,`square`,.06);break;case`coin`:this.tone(1320,.07,`square`,.08),this.tone(1760,.12,`square`,.08,void 0,.06);break;case`build`:this.tone(440,.06,`square`,.08),this.noise(.08,.2,1500,1);break;case`stone`:[392,523,659,784,1047,1319].forEach((e,t)=>this.tone(e,.5,`sine`,.14,void 0,t*.1));break;case`fall`:this.tone(400,1,`sawtooth`,.15,60)}}playMusic(e,t=!1){if(this.musicKind===e&&!t||(this.musicKind=e,this.music?.stop(),this.music=null,!this.ctx||!this.master))return;let n=this.ctx,r=n.createGain();r.gain.value=.07,r.connect(this.master);let i={village:[[261.6,329.6,392],[220,261.6,329.6],[174.6,220,261.6],[196,246.9,293.7]],dungeon:[[110,130.8,164.8],[98,116.5,146.8],[103.8,123.5,155.6],[92.5,110,138.6]],home:[[196,246.9,293.7],[220,277.2,329.6],[246.9,293.7,370],[220,277.2,329.6]],boss:[[82.4,98,123.5],[87.3,103.8,130.8]]},a=i[e]??i.village,o=0,s=!1,c=e===`boss`?1.6:3.2,l=()=>{if(s)return;let t=n.currentTime;for(let i of a[o%a.length]){let a=n.createOscillator(),o=n.createGain();a.type=e===`boss`?`sawtooth`:`triangle`,a.frequency.value=i,o.gain.setValueAtTime(.001,t),o.gain.linearRampToValueAtTime(e===`boss`?.25:.5,t+.6),o.gain.linearRampToValueAtTime(.001,t+c),a.connect(o).connect(r),a.start(t),a.stop(t+c+.1)}o++};l();let u=window.setInterval(l,c*1e3-100);this.music={stop:()=>{s=!0,window.clearInterval(u),r.gain.setTargetAtTime(0,n.currentTime,.3),window.setTimeout(()=>r.disconnect(),1500)}}}},ml=class{stickX=0;stickY=0;attackButtonHeld=!1;keys=new Set;mouseHeld=!1;pressed=new Set;constructor(e){window.addEventListener(`keydown`,e=>{if(e.repeat)return;let t=e.key.toLowerCase();this.keys.add(t);let n=hl[t];n&&(this.pressed.add(n),e.preventDefault())}),window.addEventListener(`keyup`,e=>this.keys.delete(e.key.toLowerCase())),window.addEventListener(`blur`,()=>{this.keys.clear(),this.mouseHeld=!1,this.attackButtonHeld=!1}),e.addEventListener(`pointerdown`,e=>{e.pointerType===`mouse`&&e.button===0&&(this.mouseHeld=!0,this.pressed.add(`attack`))}),window.addEventListener(`pointerup`,e=>{e.pointerType===`mouse`&&(this.mouseHeld=!1)})}press(e){this.pressed.add(e)}consume(e){return this.pressed.delete(e)}clearPressed(){this.pressed.clear()}get attackHeld(){return this.attackButtonHeld||this.mouseHeld||this.keys.has(`j`)}getMove(){let e=0,t=0;if((this.keys.has(`a`)||this.keys.has(`arrowleft`))&&--e,(this.keys.has(`d`)||this.keys.has(`arrowright`))&&(e+=1),(this.keys.has(`w`)||this.keys.has(`arrowup`))&&(t+=1),(this.keys.has(`s`)||this.keys.has(`arrowdown`))&&--t,e!==0||t!==0){let n=Math.hypot(e,t);return{x:e/n,y:t/n}}return{x:this.stickX,y:this.stickY}}},hl={j:`attack`," ":`dodge`,e:`interact`,i:`bag`,escape:`pause`,1:`skill1`,2:`skill2`,3:`skill3`,q:`potion`,b:`build`,m:`map`},gl=class{state;constructor(e){this.state=e>>>0}next(){let e=this.state=this.state+1831565813>>>0;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}int(e,t){return e+Math.floor(this.next()*(t-e+1))}range(e,t){return e+this.next()*(t-e)}chance(e){return this.next()<e}pick(e){return e[Math.floor(this.next()*e.length)]}shuffle(e){for(let t=e.length-1;t>0;t--){let n=Math.floor(this.next()*(t+1));[e[t],e[n]]=[e[n],e[t]]}return e}};function _l(){return Math.floor(Math.random()*4294967295)>>>0}var vl={str:{name:`힘`,desc:`물리 공격력 +2 (검사·궁수)`},int:{name:`지능`,desc:`마법 공격력 +2 (마법사)`},dex:{name:`민첩`,desc:`치명타 확률 +0.3%, 공격 속도 +0.5%`},vit:{name:`체력`,desc:`최대 HP +10`},mag:{name:`마력`,desc:`최대 MP +6`}},yl=[`str`,`int`,`dex`,`vit`,`mag`],bl={sword:{id:`sword`,name:`검사`,short:`검`,damage:`physical`,baseStats:{str:10,int:3,dex:5,vit:9,mag:4},baseHp:60,baseMp:26,attackTime:.36,look:{tunic:3108822,tunicDark:2381480,hair:4861988,weapon:`sword`},basic:`3타 베기 콤보`,weaponNoun:`검`,skills:[{name:`돌진 베기`,mp:12,cooldown:4,description:`앞으로 돌진하며 지나가는 적을 벤다.`},{name:`회전 베기`,mp:16,cooldown:6,description:`주변의 모든 적을 벤다.`},{name:`대지 가르기`,mp:22,cooldown:8,description:`앞으로 뻗어 나가는 충격파를 날린다.`}]},mage:{id:`mage`,name:`마법사`,short:`마`,damage:`magic`,baseStats:{str:3,int:11,dex:5,vit:5,mag:10},baseHp:50,baseMp:50,attackTime:.45,look:{tunic:8011716,tunicDark:5909654,hair:14209256,weapon:`staff`},basic:`마력탄`,weaponNoun:`지팡이`,skills:[{name:`화염구`,mp:16,cooldown:3.5,description:`부딪히면 폭발하는 화염구를 던진다.`},{name:`얼음 장판`,mp:20,cooldown:7,description:`적을 느리게 하고 계속 피해를 주는 얼음 장판을 깐다.`},{name:`번개 연쇄`,mp:24,cooldown:6,description:`가까운 적들 사이로 번개가 튄다.`}]},archer:{id:`archer`,name:`궁수`,short:`궁`,damage:`physical`,baseStats:{str:8,int:3,dex:11,vit:6,mag:5},baseHp:55,baseMp:35,attackTime:.3,look:{tunic:4168266,tunicDark:2912822,hair:13203502,weapon:`bow`},basic:`화살 연사`,weaponNoun:`활`,skills:[{name:`관통 화살`,mp:12,cooldown:3,description:`적을 꿰뚫는 강한 화살을 쏜다.`},{name:`부채꼴 연사`,mp:16,cooldown:5,description:`다섯 발의 화살을 부채꼴로 쏜다.`},{name:`후방 도약`,mp:14,cooldown:7,description:`뒤로 뛰며 그 자리에 폭발하는 덫을 남긴다.`}]}},xl=[`sword`,`mage`,`archer`];function Sl(e){return Math.round(30*e**1.8+20)}var Cl=[`weapon`,`helmet`,`armor`,`pants`,`boots`,`ring`,`necklace`],wl={helmet:`투구`,armor:`갑옷`,pants:`각반`,boots:`장화`,ring:`반지`,necklace:`목걸이`},Tl=[{name:`일반`,color:14212326,mult:1},{name:`고급`,color:7331962,mult:1.2},{name:`희귀`,color:5941503,mult:1.45},{name:`영웅`,color:12614399,mult:1.75},{name:`전설`,color:16753978,mult:2.1}],El=[`철`,`구리`,`은`,`수정`,`마공`,`흑요석`,`차원`];function Dl(e,t){return e===`weapon`?bl[t??`sword`].weaponNoun:wl[e]}function Ol(e){return`${El[e.tier-1]} ${Dl(e.slot,e.cls)}${e.plus>0?` +${e.plus}`:``}`}function kl(e){let t=Tl[e.grade].mult*(1+e.plus*.12),n=e.tier,r={atk:0,def:0,hp:0,mp:0,crit:0};switch(e.slot){case`weapon`:r.atk=Math.round(8*n*t+4);break;case`helmet`:r.def=Math.round(1.5*n*t+1),r.hp=Math.round(10*n*t);break;case`armor`:r.def=Math.round(3*n*t+1),r.hp=Math.round(22*n*t);break;case`pants`:r.def=Math.round(2*n*t+1),r.hp=Math.round(14*n*t);break;case`boots`:r.def=Math.round(1.2*n*t+1),r.crit=Math.round(1+e.grade*.5);break;case`ring`:r.atk=Math.round(2.5*n*t),r.crit=Math.round((2+e.grade*1.5)*(1+e.plus*.08));break;case`necklace`:r.hp=Math.round(8*n*t),r.mp=Math.round(10*n*t)}return r}var Al=0;function jl(){return Al++,`${Date.now().toString(36)}${Al.toString(36)}${Math.floor(Math.random()*1e6).toString(36)}`}function Ml(e,t,n,r){let i=e.next()-r,a=i<.03?4:i<.1?3:i<.25?2:+(i<.5),o=e.next()<.3?`weapon`:e.pick(Cl.slice(1));return{uid:jl(),slot:o,cls:o===`weapon`?n:void 0,tier:t,grade:a,plus:0}}function Nl(e){return Math.round(20*e.tier*Tl[e.grade].mult*(1+e.plus*.3))}function Pl(e){if(e.plus>=10)return null;let t=e.plus;return{stone:t<3?`stone_low`:t<6?`stone_mid`:`stone_high`,count:1+Math.floor(t%3/1.5),gold:50*(t+1)*e.tier,rate:[1,.95,.9,.8,.7,.6,.5,.4,.3,.2][t]}}var Fl={generator:{type:`generator`,name:`마력 발전기`,power:30,color:5949695,cost:{iron_ore:4,wood:2},description:`안에 넣은 마력 정수를 태워 전력 30을 만든다. 마력선으로 기계와 이어야 한다.`,blueprint:null},wire:{type:`wire`,name:`마력선`,power:0,color:14715472,cost:{},description:`발전기의 전력을 기계로 보낸다. 기계는 마력선에 닿아 있어야 움직인다.`,blueprint:null},belt:{type:`belt`,name:`레일`,power:0,color:5264735,cost:{},description:`아이템을 화살표 방향으로 옮긴다.`,blueprint:null},box:{type:`box`,name:`보관상자`,power:0,color:10119740,cost:{wood:3},description:`투입: 넣어 둔 재료를 앞의 기계가 비면 보낸다. 출하: 들어온 완성품을 모아 둔다.`,blueprint:null},smelter:{type:`smelter`,name:`제련로`,power:6,color:12605498,cost:{iron_ore:5},description:`광석을 주괴로 만든다.`,blueprint:null},crusher:{type:`crusher`,name:`분쇄기`,power:5,color:9080729,cost:{iron_ore:4,wood:2},description:`결정과 목재를 가루·판자로 만든다.`,blueprint:{gold:300,items:{iron_ingot:3}}},infuser:{type:`infuser`,name:`마력 주입기`,power:12,color:9071359,cost:{iron_ore:4,copper_ore:2},description:`주괴에 마력을 불어넣는다.`,blueprint:{gold:800,items:{copper_ingot:3}}},assembler:{type:`assembler`,name:`조립기`,power:10,color:4889226,cost:{iron_ore:6,wood:4},description:`고른 설계대로 여러 재료를 조립한다.`,blueprint:{gold:1200,items:{iron_ingot:5,plank:5}}},alchemy:{type:`alchemy`,name:`연금 솥`,power:4,color:5937738,cost:{iron_ore:3,wood:3},description:`하급 마력 정수와 목재로 치유 물약을 만든다.`,blueprint:{gold:500,items:{wood:10}}},splitter:{type:`splitter`,name:`분배기`,power:0,color:6975616,cost:{iron_ore:1},description:`들어온 아이템을 앞·왼쪽·오른쪽으로 번갈아 보낸다.`,blueprint:{gold:400,items:{}}}},Il=[`generator`,`wire`,`belt`,`box`,`smelter`,`crusher`,`infuser`,`assembler`,`alchemy`,`splitter`],Ll=[{id:`iron_ingot`,machine:`smelter`,inputs:{iron_ore:1},output:`iron_ingot`,count:1,time:20},{id:`copper_ingot`,machine:`smelter`,inputs:{copper_ore:1},output:`copper_ingot`,count:1,time:25},{id:`silver_ingot`,machine:`smelter`,inputs:{silver_ore:1},output:`silver_ingot`,count:1,time:30},{id:`mithril_ingot`,machine:`smelter`,inputs:{mithril:1},output:`mithril_ingot`,count:1,time:40},{id:`obsidian_plate`,machine:`smelter`,inputs:{obsidian:2},output:`obsidian_plate`,count:1,time:60},{id:`plank`,machine:`crusher`,inputs:{wood:1},output:`plank`,count:2,time:15},{id:`frost_dust`,machine:`crusher`,inputs:{frost_crystal:1},output:`frost_dust`,count:1,time:25},{id:`mana_dust`,machine:`crusher`,inputs:{mana_crystal:1},output:`mana_dust`,count:1,time:25},{id:`fire_dust`,machine:`crusher`,inputs:{fire_core:1},output:`fire_dust`,count:1,time:30},{id:`dim_dust`,machine:`crusher`,inputs:{dimension_crystal:1},output:`dim_dust`,count:1,time:40},{id:`dim_dust_void`,machine:`crusher`,inputs:{void_stone:1},output:`dim_dust`,count:1,time:40},{id:`mana_iron`,machine:`infuser`,inputs:{iron_ingot:1},output:`mana_iron`,count:1,time:30},{id:`mana_silver`,machine:`infuser`,inputs:{silver_ingot:1},output:`mana_silver`,count:1,time:40},{id:`mana_mithril`,machine:`infuser`,inputs:{mithril_ingot:1},output:`mana_mithril`,count:1,time:50},{id:`stone_low`,machine:`assembler`,inputs:{mana_iron:1,plank:1},output:`stone_low`,count:1,time:45},{id:`stone_mid`,machine:`assembler`,inputs:{mana_silver:1,frost_dust:1},output:`stone_mid`,count:1,time:60},{id:`stone_high`,machine:`assembler`,inputs:{mana_mithril:1,magi_alloy:1,fire_dust:1},output:`stone_high`,count:1,time:90},{id:`return_stone`,machine:`assembler`,inputs:{copper_ingot:1,plank:1},output:`return_stone`,count:1,time:45},{id:`bag_kit`,machine:`assembler`,inputs:{magi_alloy:1,mana_dust:1,gear_part:2},output:`bag_kit`,count:1,time:120},{id:`resonator`,machine:`assembler`,inputs:{dim_dust:3,obsidian_plate:1,mana_mithril:2},output:`resonator`,count:1,time:300},{id:`potion`,machine:`alchemy`,inputs:{essence_low:1,wood:1},output:`potion`,count:1,time:30}],Rl={essence_low:120,essence_mid:300,essence_high:600},zl=[{size:8,cost:null},{size:12,cost:{gold:500,items:{iron_ingot:10,plank:10}}},{size:16,cost:{gold:2e3,items:{silver_ingot:10,mana_iron:10}}},{size:24,cost:{gold:6e3,items:{magi_alloy:10,mana_silver:10}}}],Bl=[{id:`iron_ore`,name:`철광석`,color:9080729,kind:`material`,value:4,description:`제련로에 넣으면 철 주괴가 된다.`},{id:`wood`,name:`목재`,color:10119740,kind:`material`,value:3,description:`분쇄기에서 판자가 된다. 물약 재료로도 쓴다.`},{id:`copper_ore`,name:`구리광석`,color:13662789,kind:`material`,value:7,description:`제련로에 넣으면 구리 주괴가 된다.`},{id:`silver_ore`,name:`은광석`,color:13621475,kind:`material`,value:10,description:`제련로에 넣으면 은 주괴가 된다.`},{id:`frost_crystal`,name:`서리 결정`,color:10478591,kind:`material`,value:11,description:`분쇄기에서 서리 가루가 된다.`},{id:`mana_crystal`,name:`마력 수정`,color:11959551,kind:`material`,value:15,description:`분쇄기에서 마력 가루가 된다.`},{id:`mithril`,name:`미스릴`,color:8380624,kind:`material`,value:16,description:`제련로에 넣으면 미스릴 주괴가 된다.`},{id:`gear_part`,name:`톱니 부품`,color:13214794,kind:`material`,value:20,description:`폐공장에서 건진 마공학 부품.`},{id:`magi_alloy`,name:`마공 합금`,color:7315656,kind:`material`,value:22,description:`마력을 전도하는 합금.`},{id:`obsidian`,name:`흑요석`,color:3813448,kind:`material`,value:26,description:`제련로에서 흑요석 판이 된다.`},{id:`fire_core`,name:`화염 핵`,color:16738858,kind:`material`,value:28,description:`분쇄기에서 화염 가루가 된다.`},{id:`dimension_crystal`,name:`차원 결정`,color:6222079,kind:`material`,value:34,description:`분쇄기에서 차원 가루가 된다.`},{id:`void_stone`,name:`공허석`,color:7032319,kind:`material`,value:34,description:`분쇄기에서 차원 가루가 된다.`},{id:`essence_low`,name:`하급 마력 정수`,color:8378111,kind:`essence`,value:5,description:`1~3단계 몬스터에게서 나온다. 발전기에 넣으면 2분 동안 탄다.`},{id:`essence_mid`,name:`중급 마력 정수`,color:7310591,kind:`essence`,value:14,description:`4~5단계 몬스터에게서 나온다. 발전기에서 5분 동안 탄다.`},{id:`essence_high`,name:`상급 마력 정수`,color:14118911,kind:`essence`,value:30,description:`6~7단계 몬스터에게서 나온다. 발전기에서 10분 동안 탄다.`},{id:`iron_ingot`,name:`철 주괴`,color:11910344,kind:`processed`,value:10,description:`마력 주입기에서 마력 철이 된다.`},{id:`copper_ingot`,name:`구리 주괴`,color:15243872,kind:`processed`,value:16,description:`귀환석의 재료.`},{id:`silver_ingot`,name:`은 주괴`,color:15134455,kind:`processed`,value:24,description:`마력 주입기에서 마력 은이 된다.`},{id:`mithril_ingot`,name:`미스릴 주괴`,color:10483174,kind:`processed`,value:38,description:`마력 주입기에서 마력 미스릴이 된다.`},{id:`obsidian_plate`,name:`흑요석 판`,color:5588590,kind:`processed`,value:60,description:`공명 장치의 재료.`},{id:`plank`,name:`판자`,color:13212258,kind:`processed`,value:7,description:`하급 강화석과 귀환석의 재료.`},{id:`frost_dust`,name:`서리 가루`,color:13234943,kind:`processed`,value:26,description:`중급 강화석의 재료.`},{id:`mana_dust`,name:`마력 가루`,color:13936895,kind:`processed`,value:34,description:`차원가방 확장 키트의 재료.`},{id:`fire_dust`,name:`화염 가루`,color:16751194,kind:`processed`,value:62,description:`상급 강화석의 재료.`},{id:`dim_dust`,name:`차원 가루`,color:9434879,kind:`processed`,value:75,description:`공명 장치의 재료.`},{id:`mana_iron`,name:`마력 철`,color:9417983,kind:`processed`,value:22,description:`하급 강화석의 재료.`},{id:`mana_silver`,name:`마력 은`,color:12113151,kind:`processed`,value:50,description:`중급 강화석의 재료.`},{id:`mana_mithril`,name:`마력 미스릴`,color:8384767,kind:`processed`,value:80,description:`상급 강화석과 공명 장치의 재료.`},{id:`stone_low`,name:`하급 강화석`,color:10470655,kind:`consumable`,value:40,description:`장비를 +1~+3으로 강화할 때 쓴다.`},{id:`stone_mid`,name:`중급 강화석`,color:7332095,kind:`consumable`,value:90,description:`장비를 +4~+6으로 강화할 때 쓴다.`},{id:`stone_high`,name:`상급 강화석`,color:16761967,kind:`consumable`,value:180,description:`장비를 +7~+10으로 강화할 때 쓴다.`},{id:`potion`,name:`치유 물약`,color:16734842,kind:`consumable`,value:15,description:`던전에서 HP 50%와 MP 50%를 회복한다.`},{id:`return_stone`,name:`귀환석`,color:8060864,kind:`consumable`,value:30,description:`던전에서 언제든 전리품을 가지고 마을로 돌아간다.`},{id:`bag_kit`,name:`차원가방 확장 키트`,color:11565823,kind:`consumable`,value:120,description:`차원가방을 한 칸 늘린다 (최대 12칸).`},{id:`resonator`,name:`차원석 공명 장치`,color:6222079,kind:`key`,value:0,description:`일곱 차원석의 힘을 하나로 모으는 장치.`}],Z=Object.fromEntries(Bl.map(e=>[e.id,e])),Vl=Bl,Hl={prologue:[{fx:`fadeOut`},{title:`영겁의 틈새`,sub:`프롤로그 · 떨어진 자`},{s:``,t:`…떨어지고 있다. 끝없이, 아래로.`},{s:``,t:`빛도 소리도 없는 틈 사이로, 몸이 천천히 가라앉는다.`},{fx:`flash`},{fx:`fadeIn`},{s:`???`,t:`어이, 정신이 들어? 이번엔 제법 멀쩡하게 떨어졌네.`},{s:`나`,t:`여기는… 어디지?`},{s:`리아`,t:`차원틈새. 세계와 세계 사이의 갈라진 틈이야. 그리고 이곳은 틈새에 떨어진 사람들이 모여 만든 차원마을이고.`},{s:`리아`,t:`난 리아. 너처럼 떨어진 사람을 맞이하는 게 내 일이야. 벌써 몇 년째인지 모르겠지만.`},{s:`리아`,t:`이곳에선 아무도 늙지 않아. 그리고… 죽지도 않지.`},{s:`나`,t:`죽지 않는다고?`},{s:`리아`,t:`던전에서 쓰러져도 마을로 튕겨 나올 뿐이야. 대신 들고 있던 짐은 대부분 틈새에 삼켜지지만.`},{s:`리아`,t:`북쪽에 차원문 광장이 있어. 차원문 너머의 던전에서 자원을 모아 오는 게 여기서 사는 방법이야.`},{s:`리아`,t:`일단 1단계 차원문에 들어가 봐. 왼쪽 아래를 누르면 움직일 수 있고, 오른쪽 버튼으로 싸울 수 있어.`},{set:`intro`}],guide_idle:[{s:`리아`,t:`막히면 언제든 말 걸어. 쓰러져도 괜찮아, 여기선 누구도 죽지 않으니까.`}],guide_after_stone:[{s:`리아`,t:`차원석을 모으고 있다며? …나도 한때는 그랬어.`},{s:`리아`,t:`탈출을 포기한 건 아니야. 그냥, 끝까지 가 본 사람이 아무도 없었을 뿐이지.`}],legend:[{s:`에단`,t:`세라의 공장을 봤다. 이 마을에서 그 문을 연 건 네가 처음이구나.`},{s:`나`,t:`이곳을 나갈 방법은 없나요?`},{s:`에단`,t:`…오래된 전설이 하나 있다. 일곱 차원문의 가장 깊은 곳, 10번째 방을 지키는 수호자들이 각자 차원석을 품고 있다고.`},{s:`에단`,t:`일곱 개의 차원석을 모으면 틈새를 열고 나갈 수 있다고 전해지지.`},{s:`에단`,t:`탈출파는 그 전설을 믿고, 안주파는 영원한 삶을 받아들였다. 어느 쪽이 옳은지는 나도 모르겠구나.`},{s:`에단`,t:`먼저 1-10의 수호자를 쓰러뜨려 보거라. 5번째 방의 파수꾼도 만만치 않을 게다.`}],chief_idle:[{s:`에단`,t:`차원석은 모두 일곱 개. 서두를 필요는 없다. 여기선 시간이 넘쳐나니까.`}],stone1:[{s:`에단`,t:`정말로… 차원석을 가져왔구나. 이 빛, 몇백 년 만에 보는지.`},{s:`에단`,t:`마공학자 세라에게 가 보거라. 그 아이라면 이 돌의 쓰임새를 알 게다.`},{set:`stone1Talk`}],home_unlock:[{s:`세라`,t:`이 정도 정수면… 봐, 마을 동쪽의 보라색 문이 빛나기 시작했어!`},{s:`세라`,t:`들어가는 사람마다 다른 공간이 열리는 차원집이야. 지금까지 아무도 제대로 못 썼거든. 이제 너만의 공간이 생긴 거야.`},{s:`세라`,t:`거기서 공장을 지어 자원을 가공할 수 있어. 네가 던전에 있거나 게임을 꺼 둬도 공장은 계속 돌아가!`},{title:`차원집 해금`,sub:`마을 동쪽 보라색 문`}],engineer_idle:[{s:`세라`,t:`새 기계 도면이 필요하면 말해! 강화석은 조립기로, 마력 철이랑 판자를 넣으면 만들어져.`}],engineer_final:[{s:`세라`,t:`차원석 일곱 개를 다 모았어?! 그럼 남은 건 공명 장치야.`},{s:`세라`,t:`조립기에서 "차원석 공명 장치"를 골라. 차원 가루 3개, 흑요석 판 1개, 마력 미스릴 2개가 필요해.`},{s:`세라`,t:`완성되면 촌장님께 가져가. 그분이 마지막 방법을 알고 있을 거야.`},{set:`resonatorHint`}],ch2:[{s:`에단`,t:`두 번째 차원석이구나. 마을이 술렁이고 있다.`},{s:`에단`,t:`고른은 네가 틈새를 부술까 봐 두려워하고 있어. 여기서 쌓아 온 삶이 전부 사라질까 봐.`},{s:`에단`,t:`…그리고 한 가지 더. 네 안에 잠든 힘이 느껴진다. 오래전 이 마을에 있던 마법사의 기억이지.`},{s:`에단`,t:`직업의 전당에 가 보거라. 이제 마법사의 힘을 쓸 수 있을 게다.`},{run:`unlockMage`},{title:`마법사 해금`,sub:`직업의 전당에서 직업을 바꿀 수 있다`}],smith_idle:[{s:`고른`,t:`강화하러 왔나? 불은 꺼지지 않으니 언제든 와.`}],smith_ch3:[{s:`고른`,t:`세 번째라고? …자네, 정말 끝까지 갈 셈인가.`},{s:`고른`,t:`난 삼백 년을 이 모루 앞에서 보냈네. 밖에 뭐가 기다리는지 아무도 모르지. 여기선 적어도 아무도 죽지 않아.`},{s:`나`,t:`그래도 멈춰 있는 건 사는 게 아니잖아요.`},{s:`고른`,t:`…흥. 망치는 계속 빌려주지. 결정은 자네 몫이니까.`},{set:`smith3`}],secret:[{s:`???`,t:`…드디어 네 번째인가. 기다리고 있었다.`},{s:`나`,t:`당신은 누구죠?`},{s:`???`,t:`차원집이 어떻게 생겼는지 아나? 들어가는 사람마다 다른 공간이 열리는 문. 누가 만들었을까.`},{s:`???`,t:`그 문은 네가 떨어지기 전부터, 너를 위해 준비되어 있었다.`},{s:`???`,t:`네 손에 활을 쥐여 주지. 멀리서 보는 법을 배워라. 끝에 다다르면 모든 걸 알게 될 테니.`},{run:`unlockArcher`},{title:`궁수 해금`,sub:`직업의 전당에서 직업을 바꿀 수 있다`}],stranger_idle:[{s:`???`,t:`일곱 번째 문의 끝에서 다시 보자. …아니, 어쩌면 처음부터 다시 보게 될지도.`}],merchant_idle:[{s:`무트`,t:`영원히 장사할 수 있는 곳이라니, 여긴 천국이야! 뭐 사러 왔어?`}],stone_n:[{s:`에단`,t:`또 하나의 차원석이로구나. 이제 틈새가 너를 알아보기 시작했다.`}],final:[{s:`에단`,t:`일곱 개의 차원석과 공명 장치… 모두 갖췄구나.`},{s:`에단`,t:`장치를 켜면 틈새가 열린다. 그러나 틈새는 한 번에 한 가지만 들어준다고 한다.`},{s:`에단`,t:`틈새를 열고 나가겠느냐, 아니면 차원석을 봉인해 이 마을을 영원히 지키겠느냐.`},{s:`리아`,t:`가자. 끝까지 가 본 사람이 한 명쯤은 있어야지.`},{s:`고른`,t:`남아. 여기 있는 모두가 네 가족이야. 밖에 뭐가 있든, 여기보다 나을 거란 보장은 없네.`},{choice:[{text:`틈새를 연다 (탈출파)`,next:`endingA`},{text:`차원석을 봉인한다 (안주파)`,next:`endingB`}]}],endingA:[{set:`endingA`},{fx:`flash`},{s:``,t:`공명 장치가 일곱 개의 빛을 하나로 모은다. 틈새가 비명처럼 갈라진다.`},{s:`리아`,t:`보여! 저 너머에… 하늘이야!`},{fx:`shake`},{s:``,t:`빛 속으로 한 발을 내딛는다. 몸이 가벼워지고, 모든 것이 하얗게 번진다.`},{fx:`fadeOut`},{s:``,t:`…떨어지고 있다. 끝없이, 아래로.`},{s:``,t:`낯익은 어둠. 낯익은 추락. 그리고 저 아래, 낯익은 마을의 불빛.`},{title:`엔딩 A · 열린 틈새`,sub:`틈새의 출구는 틈새의 입구였다`},{run:`ngplus`}],endingB:[{set:`endingB`},{fx:`flash`},{s:``,t:`차원석을 제단에 올려 봉인한다. 틈새의 떨림이 잦아든다.`},{s:`고른`,t:`잘 선택했네. 이제 아무도 떠나지 않아도 돼.`},{s:``,t:`평온한 날들이 이어진다. 그리고 어느 날, 마을 끝에 누군가 떨어졌다.`},{fx:`fadeOut`},{s:``,t:`쓰러진 사람에게 다가간다. 그 얼굴은… 처음 이곳에 떨어졌던 날의 나였다.`},{s:`???`,t:`어이, 정신이 들어? 이번엔 제법 멀쩡하게 떨어졌네.`},{title:`엔딩 B · 닫힌 틈새`,sub:`영원히 머무는 자는 영원히 돌아온다`},{run:`ngplus`}],ngplus:[{fx:`fadeIn`},{s:`리아`,t:`…어? 너, 어디서 본 것 같은데. 이상하네, 처음 보는 얼굴인데 말이야.`},{s:``,t:`장비와 차원집은 그대로 남아 있다. 틈새는 조금 더 거칠어졌다. (회차 +1)`}]},Ul=(e,t)=>({s:e,t}),Wl=[{id:`m1_hunt`,npc:`guide`,kind:`main`,title:`첫 번째 차원문`,offer:[Ul(`리아`,`북쪽 차원문 광장에서 1-1 차원문에 들어가 봐. 몬스터 다섯 마리만 쓰러뜨리고 오면 돼.`),Ul(`리아`,`공격 버튼으로 싸우고, 구르기로 빨간 공격 범위를 피해. 방을 전부 정리하면 워프 게이트가 열려.`)],pending:[Ul(`리아`,`차원문은 북쪽 광장에 있어. 몬스터 다섯 마리, 잊지 마!`)],complete:[Ul(`리아`,`살아 돌아왔네! …뭐, 여기선 원래 죽지 않지만.`),Ul(`리아`,`던전엔 광석이랑 나무도 많았지? 캐려면 도구가 필요해. 대장장이 고른 아저씨한테 가 봐.`)],objectives:[{type:`kill`,count:5}],rewards:{gold:100,exp:60,items:{potion:2}}},{id:`m2_tools`,npc:`smith`,kind:`main`,title:`곡괭이와 도끼`,after:[`m1_hunt`],offer:[Ul(`고른`,`리아가 보냈나. 채집을 하려면 연장이 있어야지.`),Ul(`고른`,`이 곡괭이랑 도끼를 가져가. 광맥이나 결정 앞에서는 곡괭이, 나무 앞에서는 도끼를 저절로 꺼내 쓰게 될 거다.`),Ul(`고른`,`채집물 앞에서 상호작용(E)을 누르면 캐기 시작한다. 철광석 10개랑 목재 5개를 캐 와 봐.`)],onAccept:{flags:[`tool_pickaxe`,`tool_axe`]},pending:[Ul(`고른`,`철광석 10개, 목재 5개. 채집물 앞에서 E를 누르면 된다.`)],complete:[Ul(`고른`,`좋은 손놀림이군. 강화할 게 생기면 언제든 오게.`)],objectives:[{type:`deliver`,item:`iron_ore`,count:10},{type:`deliver`,item:`wood`,count:5}],rewards:{gold:150,exp:80}},{id:`m3_essence`,npc:`engineer`,kind:`main`,title:`마력 정수`,after:[`m2_tools`],offer:[Ul(`세라`,`안녕! 난 마공학자 세라. 몬스터를 쓰러뜨리면 나오는 마력 정수, 본 적 있어?`),Ul(`세라`,`그게 이 틈새의 에너지원이야. 몬스터 10마리를 쓰러뜨리고 하급 마력 정수 5개를 가져다줄래? 보여 줄 게 있어.`)],pending:[Ul(`세라`,`몬스터 10마리, 하급 마력 정수 5개! 정수는 쓰러질 때 잃지 않게 차원가방에 넣어 둬.`)],complete:[Ul(`세라`,`완벽해. 이 정수로… 그 문을 열 수 있을 거야.`)],objectives:[{type:`kill`,count:10},{type:`deliver`,item:`essence_low`,count:5}],rewards:{gold:150,exp:120,flags:[`home`],script:`home_unlock`}},{id:`m4_factory`,npc:`engineer`,kind:`main`,title:`나만의 공장`,after:[`m3_essence`],offer:[Ul(`세라`,`이제 차원집에 공장을 지어 보자. 오른쪽 위 망치 버튼으로 건설 모드를 열어.`),Ul(`세라`,`보관상자(투입)에 철광석을 넣고 → 레일 → 제련로 → 레일 → 보관상자(출하) 순서로 놓아 봐.`),Ul(`세라`,`발전기에는 마력 정수를 직접 넣어야 하고, 제련로는 마력선으로 발전기와 이어져 있어야 움직여. 철 주괴 1개를 만들면 성공!`)],pending:[Ul(`세라`,`발전기에 정수를 넣었어? 제련로가 마력선에 닿아 있는지도 확인해 봐.`)],complete:[Ul(`세라`,`첫 주괴다! 앞으로 더 좋은 기계 도면은 나한테서 살 수 있어. 기억해 둬.`)],objectives:[{type:`build`,building:`generator`,count:1},{type:`build`,building:`smelter`,count:1},{type:`craft`,item:`iron_ingot`,count:1}],rewards:{gold:300,exp:150,items:{essence_low:5}}},{id:`m5_legend`,npc:`chief`,kind:`main`,title:`틈새의 전설`,after:[`m4_factory`],offer:Hl.legend,pending:[Ul(`에단`,`1-10의 끝에 수호자가 있다. 1-5에는 그보다 약한 파수꾼이 지키고 있지.`)],complete:[Ul(`에단`,`정말로… 차원석을 가져왔구나. 이 빛, 몇백 년 만에 보는지.`),Ul(`에단`,`남은 차원석은 여섯. 각 차원문의 10번째 방에 수호자가 있다.`)],objectives:[{type:`clear`,stage:10,label:`1-10 수호자 처치 (차원석)`}],rewards:{gold:500,exp:300,flags:[`legend`,`stone1Talk`]}}],Gl=[{id:`s_guide_wood`,npc:`guide`,kind:`sub`,title:`마을의 겨울 준비`,after:[`m2_tools`],offer:[Ul(`리아`,`여긴 계절이 없지만… 모닥불은 모두를 모이게 해. 목재 20개만 부탁해도 될까?`)],complete:[Ul(`리아`,`고마워! 오늘 밤엔 다 같이 불 앞에 모이자.`)],objectives:[{type:`deliver`,item:`wood`,count:20}],rewards:{gold:200,exp:100,items:{potion:3}}},{id:`s_merchant_copper`,npc:`merchant`,kind:`sub`,title:`구리 사재기`,after:[`m2_tools`],requireStones:1,offer:[Ul(`무트`,`구리 값이 오를 거야, 내 감이 그래. 구리광석 15개 가져오면 두둑이 쳐 줄게!`)],complete:[Ul(`무트`,`좋았어! 영원히 사는 곳에서도 돈은 돌고 도는 법이지.`)],objectives:[{type:`deliver`,item:`copper_ore`,count:15}],rewards:{gold:600,exp:200}},{id:`s_smith_elite`,npc:`smith`,kind:`sub`,title:`정예의 증표`,after:[`m2_tools`],offer:[Ul(`고른`,`금빛으로 빛나는 정예 몬스터를 본 적 있나? 세 마리를 쓰러뜨리고 오게. 좋은 걸 주지.`)],complete:[Ul(`고른`,`실력이 늘었군. 이 강화석을 가져가게.`)],objectives:[{type:`elite`,count:3}],rewards:{gold:300,exp:250,items:{stone_low:4}}},{id:`s_engineer_ingot`,npc:`engineer`,kind:`sub`,title:`연구용 주괴`,after:[`m4_factory`],offer:[Ul(`세라`,`새 기계를 연구 중인데 철 주괴가 모자라. 공장에서 10개만 만들어 줄래?`)],complete:[Ul(`세라`,`이걸로 연구가 한 발짝 나아갔어! 보답으로 받아.`)],objectives:[{type:`deliver`,item:`iron_ingot`,count:10}],rewards:{gold:800,exp:300,items:{essence_low:10}}},{id:`s_chief_midboss`,npc:`chief`,kind:`sub`,title:`파수꾼 토벌`,after:[`m5_legend`],offer:[Ul(`에단`,`2-5의 파수꾼이 날뛴다는구나. 마을 사람들이 불안해한다. 정리해 주겠느냐?`)],complete:[Ul(`에단`,`고맙구나. 이 물약들을 가져가거라.`)],objectives:[{type:`clear`,stage:15,label:`2-5 파수꾼 처치`}],rewards:{gold:1e3,exp:500,items:{potion:5,return_stone:2}}},{id:`s_guide_escape`,npc:`guide`,kind:`sub`,title:`탈출파의 부탁`,requireStones:3,offer:[Ul(`리아`,`탈출파 사람들이 차원 결정을 연구하고 싶대. 서리 결정 10개를 모아 줄 수 있어?`)],complete:[Ul(`리아`,`다들 기뻐할 거야. 정말… 나갈 수 있을지도 몰라.`)],objectives:[{type:`deliver`,item:`frost_crystal`,count:10}],rewards:{gold:1500,exp:800,items:{stone_mid:2}}}],Kl=[...Wl,...Gl],ql=Object.fromEntries(Kl.map(e=>[e.id,e])),Jl=[{tier:1,name:`이끼 낀 숲 유적`,portalColor:15921906,background:1450010,floorA:6126149,floorB:7113294,wallSide:5921362,wallTop:7311178,ambient:13625544,sun:16773590,nodes:[`iron_vein`,`old_tree`],decor:[{kind:`grass`,color:8827987},{kind:`mushroom`,color:14242879},{kind:`rock`,color:8026736}]},{tier:2,name:`붉은 협곡`,portalColor:7070315,background:2364431,floorA:11559994,floorB:12416070,wallSide:8273702,wallTop:13074770,ambient:16767426,sun:16769200,nodes:[`copper_vein`,`dry_tree`],decor:[{kind:`rock`,color:9325100},{kind:`bone`,color:15260868},{kind:`grass`,color:13213763}]},{tier:3,name:`얼어붙은 동굴`,portalColor:5941503,background:923684,floorA:12178403,floorB:13361388,wallSide:6258072,wallTop:15267067,ambient:13954303,sun:15135999,nodes:[`silver_vein`,`frost_cluster`],decor:[{kind:`shard`,color:10478591},{kind:`rock`,color:9415103}]},{tier:4,name:`수정 광맥`,portalColor:11758591,background:1314338,floorA:5063784,floorB:5721462,wallSide:3813458,wallTop:7166873,ambient:14207231,sun:15786239,nodes:[`mana_cluster`,`mithril_vein`],decor:[{kind:`shard`,color:12750079},{kind:`shard`,color:8380624},{kind:`rock`,color:4866148}]},{tier:5,name:`폐허가 된 마공학 공장`,portalColor:16753978,background:1381914,floorA:6053734,floorB:6777458,wallSide:4866104,wallTop:9075298,ambient:15261904,sun:16770752,nodes:[`gear_pile`,`alloy_pile`],decor:[{kind:`gear`,color:11569722},{kind:`rock`,color:5591630}]},{tier:6,name:`용암 심연`,portalColor:16730666,background:1968134,floorA:4008488,floorB:4665388,wallSide:2759192,wallTop:6957594,ambient:16760992,sun:16756864,nodes:[`obsidian_rock`,`fire_cluster`],decor:[{kind:`shard`,color:16738858},{kind:`rock`,color:3023400},{kind:`bone`,color:13615272}]},{tier:7,name:`부서진 차원`,portalColor:6222079,background:328718,floorA:2894410,floorB:3420762,wallSide:1841716,wallTop:4865930,ambient:12634367,sun:14215423,nodes:[`dimension_cluster`,`void_vein`],decor:[{kind:`shard`,color:6222079},{kind:`shard`,color:8019199},{kind:`rock`,color:2762824}]}];function Yl(e){return Jl[Math.min(Math.max(e,1),Jl.length)-1]}function Xl(e,t,n){return t<0||n<0||t>=e.width||n>=e.height?0:e.cells[n*e.width+t]}function Zl(e,t,n){return Xl(e,t,n)===1}var Ql=e=>({x:Math.floor(e.x+e.w/2),y:Math.floor(e.y+e.h/2)});function $l(e,t,n=1){let r=new gl(e);for(let i=0;i<20;i++){let i=eu(r,e,t,n);if(i)return i}throw Error(`던전 생성 실패 (seed=${e})`)}function eu(e,t,n,r){let i=new Uint8Array(1440),a=Yl(n),o=[],s=e.int(8,10);for(let t=0;t<600&&o.length<s;t++){let t=e.int(6,10),n=e.int(6,9),r=e.int(1,40-t-1),i=e.int(1,36-n-1);o.some(e=>r<e.x+e.w+2&&r+t+2>e.x&&i<e.y+e.h+2&&i+n+2>e.y)||o.push({id:o.length,x:r,y:i,w:t,h:n,type:`combat`})}if(o.length<7)return null;let c=new Int16Array(1440).fill(-1);for(let e of o)for(let t=e.y;t<e.y+e.h;t++)for(let n=e.x;n<e.x+e.w;n++)i[t*40+n]=1,c[t*40+n]=e.id;let l=o.map(Ql),u=(e,t)=>Math.abs(l[e].x-l[t].x)+Math.abs(l[e].y-l[t].y),d=[],f=new Set([0]);for(;f.size<o.length;){let e=null,t=1/0;for(let n of f)for(let r=0;r<o.length;r++){if(f.has(r))continue;let i=u(n,r);i<t&&(t=i,e=[n,r])}d.push(e),f.add(e[1])}let p=[];for(let e=0;e<o.length;e++)for(let t=e+1;t<o.length;t++)d.some(([n,r])=>n===e&&r===t||n===t&&r===e)||p.push([e,t]);p.sort((e,t)=>u(e[0],e[1])-u(t[0],t[1]));let m=e.int(1,2);for(let t=0,n=0;t<p.length&&n<m;t++)e.chance(.5)&&(d.push(p[t]),n++);let h=(e,t)=>{for(let n=0;n<2;n++)for(let r=0;r<2;r++){let a=Math.min(Math.max(e+r,1),38),o=Math.min(Math.max(t+n,1),34);i[o*40+a]=1}};for(let[t,n]of d){let r=l[t],i=l[n],a=e.chance(.5)?{x:i.x,y:r.y}:{x:r.x,y:i.y};for(let[e,t]of[[r,a],[a,i]]){let n=Math.sign(t.x-e.x),r=Math.sign(t.y-e.y),i=e.x,a=e.y;for(h(i,a);i!==t.x||a!==t.y;)i+=n,a+=r,h(i,a)}}let g=e.pick(o);g.type=`start`;let _=Ql(g),v=tu(i,40,36,_.x,_.y),y=g,b=-1;for(let e of o){let t=Ql(e),n=v[t.y*40+t.x];e!==g&&n>b&&(b=n,y=e)}y.type=`exit`;let x=Ql(y),S=e.shuffle(o.filter(e=>e.type===`combat`)),C=[`elite`,`treasure`,`resource`,`resource`];e.chance(.5)&&C.push(`resource`),S.forEach((e,t)=>{t<C.length&&(e.type=C[t])});let w=new Uint8Array(1440),T=[],E=[],D=[],O=(t,n)=>{let r=Ql(t);for(let i=0;i<40;i++){let i=e.int(t.x+1,t.x+t.w-2),a=e.int(t.y+1,t.y+t.h-2);if((t.type===`start`||t.type===`exit`)&&Math.abs(i-r.x)<=1&&Math.abs(a-r.y)<=1)continue;let o=!0;for(let e=-n;e<=n&&o;e++)for(let t=-n;t<=n&&o;t++)w[(a+e)*40+(i+t)]&&(o=!1);if(o)return w[a*40+i]=1,{x:i,y:a}}return null};w[_.y*40+_.x]=1,w[x.y*40+x.x]=1;let k={start:[0,1],combat:[1,2],resource:[4,6],elite:[1,2],treasure:[0,1],exit:[0,0]};for(let t of o){let[n,i]=k[t.type],o=e.int(n,i);for(let n=0;n<o;n++){let n=O(t,1);if(!n)break;T.push({nodeId:e.pick(a.nodes),x:n.x+e.range(-.15,.15),y:n.y+e.range(-.15,.15)})}if(t.type===`treasure`){let e=O(t,1);e&&T.push({nodeId:`chest`,x:e.x,y:e.y})}if(t.type===`combat`||t.type===`resource`){let n=Math.floor(r/4),i=t.type===`combat`?e.int(2,3)+n:e.int(0,1)+ +(r>5);for(let e=0;e<i;e++){let e=O(t,0);e&&E.push({...e,kind:`normal`})}}else if(t.type===`elite`){let e=O(t,0);e&&E.push({...e,kind:`elite`})}else if(t.type===`exit`){if(r===10)E.push({x:x.x,y:x.y-2,kind:`boss`});else if(r===5)E.push({x:x.x,y:x.y-2,kind:`midboss`});else{let e=O(t,0);e&&E.push({...e,kind:`normal`})}}}for(let t=0;t<36;t++)for(let n=0;n<40;n++){let r=t*40+n;if(i[r]!==1||w[r]||!e.chance(.16))continue;let o=e.pick(a.decor);D.push({kind:o.kind,color:o.color,x:n+e.range(.1,.9),y:t+e.range(.1,.9),rotation:e.range(0,Math.PI*2),scale:e.range(.7,1.3)})}return{seed:t,tier:n,stage:r,width:40,height:36,cells:i,rooms:o,roomIndex:c,start:_,exit:x,nodes:T,monsters:E,decor:D}}function tu(e,t,n,r,i){let a=new Int32Array(t*n).fill(-1),o=new Int32Array(t*n),s=0,c=0;for(a[i*t+r]=0,o[c++]=i*t+r;s<c;){let r=o[s++],i=r%t,l=(r-i)/t,u=[[i+1,l],[i-1,l],[i,l+1],[i,l-1]];for(let[i,s]of u){if(i<0||s<0||i>=t||s>=n)continue;let l=s*t+i;e[l]===1&&a[l]===-1&&(a[l]=a[r]+1,o[c++]=l)}}return a}function nu(e,t,n){let r=Math.floor((t.x-n)/2),i=Math.floor((t.x+n)/2),a=Math.floor((t.z-n)/2),o=Math.floor((t.z+n)/2);for(let s=a;s<=o;s++)for(let a=r;a<=i;a++){if(Zl(e,a,s))continue;let r=Math.max(a*2,Math.min(t.x,(a+1)*2)),i=Math.max(s*2,Math.min(t.z,(s+1)*2)),o=t.x-r,c=t.z-i,l=o*o+c*c;if(!(l>=n*n)){if(l>1e-8){let e=Math.sqrt(l);t.x+=o/e*(n-e),t.z+=c/e*(n-e)}else{let e=t.x-a*2,r=(a+1)*2-t.x,i=t.z-s*2,o=(s+1)*2-t.z,c=Math.min(e,r,i,o);c===e?t.x=a*2-n:c===r?t.x=(a+1)*2+n:t.z=c===i?s*2-n:(s+1)*2+n}}}}function ru(e,t,n){for(let r of n){let n=e.x-r.x,i=e.z-r.z,a=t+r.radius,o=n*n+i*i;if(o>=a*a)continue;let s=Math.sqrt(o)||1e-4;e.x=r.x+n/s*a,e.z=r.z+i/s*a}}function iu(e,t,n,r,i,a){let o=Math.max(1,Math.ceil(Math.hypot(n,r)/(i*.5)));for(let s=0;s<o;s++)t.x+=n/o,t.z+=r/o,ru(t,i,a),nu(e,t,i)}var au=[[1,0],[0,1],[-1,0],[0,-1]],ou=1,su=new Set([`smelter`,`crusher`,`infuser`,`assembler`,`alchemy`]),cu=[`essence_low`,`essence_mid`,`essence_high`];function lu(e){return Ll.filter(t=>t.machine===e)}var uu=Object.fromEntries(Ll.map(e=>[e.id,e]));function du(e){return Object.values(e.buffer??{}).reduce((e,t)=>e+t,0)}var fu=class{state;size;index=new Map;netOf=new Map;netRatio=[];netSupply=[];netDemand=[];dirty=!0;onCraft=null;constructor(e,t){this.state=e,this.size=t,this.reindex()}key(e,t){return t*1e3+e}reindex(){this.index.clear();for(let e of this.state.buildings)this.index.set(this.key(e.x,e.y),e);this.dirty=!0}at(e,t){return this.index.get(this.key(e,t))}inBounds(e,t){return e>=0&&t>=0&&e<this.size&&t<this.size}place(e,t,n,r){if(!this.inBounds(t,n)||this.at(t,n))return null;let i={type:e,x:t,y:n,dir:r};return e===`generator`&&(i.fuel=0,i.buffer={}),su.has(e)&&(i.buffer={},i.out=[],i.progress=0,i.crafting=null,e===`alchemy`&&(i.recipe=`potion`)),(e===`belt`||e===`splitter`)&&(i.item=null,i.progress=0),e===`box`&&(i.buffer={},i.mode=`in`),this.state.buildings.push(i),this.index.set(this.key(t,n),i),this.dirty=!0,i}remove(e,t,n){let r=this.at(e,t);if(!r)return null;r.item&&n(r.item,1);for(let[e,t]of Object.entries(r.buffer??{}))t>0&&n(e,t);for(let e of r.out??[])n(e,1);if(r.crafting)for(let[e,t]of Object.entries(uu[r.crafting].inputs))n(e,t);return this.state.buildings=this.state.buildings.filter(e=>e!==r),this.reindex(),r}rotate(e,t){let n=this.at(e,t);n&&(n.dir=(n.dir+1)%4)}buildNetworks(){this.netOf.clear();let e=0,t=e=>e.type===`wire`||e.type===`generator`;for(let n of this.state.buildings){if(!t(n)||this.netOf.has(n))continue;let r=[n];for(this.netOf.set(n,e);r.length;){let n=r.pop();for(let[i,a]of au){let o=this.at(n.x+i,n.y+a);o&&t(o)&&!this.netOf.has(o)&&(this.netOf.set(o,e),r.push(o))}}e++}for(let e of this.state.buildings)if(su.has(e.type))for(let[n,r]of au){let i=this.at(e.x+n,e.y+r);if(i&&t(i)){this.netOf.set(e,this.netOf.get(i));break}}this.netRatio=Array(e).fill(0),this.netSupply=Array(e).fill(0),this.netDemand=Array(e).fill(0),this.dirty=!1}powerOf(e){this.dirty&&this.buildNetworks();let t=this.netOf.get(e);return t===void 0?0:this.netRatio[t]}connected(e){return this.dirty&&this.buildNetworks(),this.netOf.has(e)}networkInfo(e){this.dirty&&this.buildNetworks();let t=this.netOf.get(e);return t===void 0?null:{supply:this.netSupply[t],demand:this.netDemand[t]}}status(e){return su.has(e.type)?e.type===`assembler`&&!e.recipe?`no-recipe`:(e.out?.length??0)>0?`blocked`:e.crafting?this.powerOf(e)>0?`working`:`no-power`:`idle`:`idle`}step(e){this.dirty&&this.buildNetworks();let t=this.state.buildings;this.netSupply.fill(0),this.netDemand.fill(0);for(let e of t)su.has(e.type)&&e.crafting&&this.netOf.has(e)&&(this.netDemand[this.netOf.get(e)]+=Fl[e.type].power);for(let e of t){if(e.type!==`generator`)continue;let t=this.netOf.get(e);if((e.fuel??0)<=0&&this.netDemand[t]>0){for(let t of cu)if((e.buffer[t]??0)>0){e.buffer[t]--,e.fuel=Rl[t];break}}(e.fuel??0)>0&&(this.netSupply[t]+=Fl.generator.power)}for(let e=0;e<this.netRatio.length;e++)this.netRatio[e]=this.netDemand[e]>0?Math.min(1,this.netSupply[e]/this.netDemand[e]):0;for(let n of t){if(n.type!==`generator`||(n.fuel??0)<=0)continue;let t=this.netOf.get(n);this.netDemand[t]>0&&(n.fuel=Math.max(0,n.fuel-e*Math.min(1,this.netDemand[t]/this.netSupply[t])))}for(let e of t){if(e.type!==`box`||e.mode!==`in`)continue;let t=Object.keys(e.buffer).filter(t=>e.buffer[t]>0).sort();for(let n=0;n<t.length;n++){let r=t[((e.rr??0)+n)%t.length];if(this.pushForward(e,r)){e.buffer[r]--,e.buffer[r]===0&&delete e.buffer[r],e.rr=(e.rr??0)+n+1;break}}}for(let n of t)if(su.has(n.type)){for(;n.out.length>0&&this.pushForward(n,n.out[0]);)n.out.shift();if(!(n.out.length>0)){if(!n.crafting){let e=this.readyRecipe(n);if(e){for(let[t,r]of Object.entries(e.inputs))n.buffer[t]-=r;n.crafting=e.id,n.progress=0}}if(n.crafting){let t=uu[n.crafting];if(n.progress+=e*this.powerOf(n)/t.time,n.progress>=1){for(let e=0;e<t.count;e++)n.out.push(t.output);for(this.onCraft?.(t.output,t.count),n.crafting=null,n.progress=0;n.out.length>0&&this.pushForward(n,n.out[0]);)n.out.shift()}}}}for(let n of t)if(!(n.type!==`belt`&&n.type!==`splitter`||!n.item)&&(n.progress=Math.min(1,(n.progress??0)+e*ou),!(n.progress<1))){if(n.type===`belt`)this.pushForward(n,n.item)&&(n.item=null);else{let e=[n.dir,(n.dir+1)%4,(n.dir+3)%4];for(let t=0;t<3;t++){let r=e[((n.rr??0)+t)%3];if(this.pushTo(n,r,n.item)){n.item=null,n.rr=((n.rr??0)+t+1)%3;break}}}}}readyRecipe(e){let t=e.recipe?[uu[e.recipe]]:lu(e.type);for(let n of t)if(Object.entries(n.inputs).every(([t,n])=>(e.buffer[t]??0)>=n))return n;return null}pushForward(e,t){return this.pushTo(e,e.dir,t)}pushTo(e,t,n){let[r,i]=au[t],a=this.at(e.x+r,e.y+i);return a?this.accept(a,n,e):!1}accept(e,t,n){switch(e.type){case`belt`:case`splitter`:{if(e.item)return!1;let[r,i]=au[e.dir];return e.type===`belt`&&n.x===e.x+r&&n.y===e.y+i?!1:(e.item=t,e.progress=0,!0)}case`box`:return e.mode!==`out`||du(e)>=999?!1:(e.buffer[t]=(e.buffer[t]??0)+1,!0);case`smelter`:case`crusher`:case`infuser`:case`assembler`:case`alchemy`:{let n=(e.recipe?[uu[e.recipe]]:lu(e.type)).find(e=>e.inputs[t]!==void 0);if(!n||!e.recipe&&Object.entries(e.buffer).some(([e,t])=>t>0&&n.inputs[e]===void 0))return!1;let r=e.buffer[t]??0;return r>=n.inputs[t]?!1:(e.buffer[t]=r+1,!0)}default:return!1}}simulate(e){let t=e>600?1:.25,n=0;for(;n<e;){let r=Math.min(t,e-n);this.step(r),n+=r}}},pu=Object.fromEntries([{id:`iron_vein`,name:`철광석 광맥`,style:`ore`,itemId:`iron_ore`,hp:4,bonus:2,radius:.75,baseColor:7170662,accentColor:11120828},{id:`old_tree`,name:`고목`,style:`tree`,itemId:`wood`,hp:3,bonus:2,radius:.55,baseColor:7031342,accentColor:5212732},{id:`copper_vein`,name:`구리광석 광맥`,style:`ore`,itemId:`copper_ore`,hp:4,bonus:2,radius:.75,baseColor:8014390,accentColor:14715472},{id:`dry_tree`,name:`마른 고목`,style:`tree`,itemId:`wood`,hp:3,bonus:2,radius:.55,baseColor:5913382,accentColor:13208122},{id:`silver_vein`,name:`은광석 광맥`,style:`ore`,itemId:`silver_ore`,hp:5,bonus:2,radius:.75,baseColor:6122362,accentColor:15002869},{id:`frost_cluster`,name:`서리 결정`,style:`crystal`,itemId:`frost_crystal`,hp:4,bonus:2,radius:.65,baseColor:6256786,accentColor:11070719},{id:`mana_cluster`,name:`마력 수정`,style:`crystal`,itemId:`mana_crystal`,hp:5,bonus:2,radius:.65,baseColor:4864618,accentColor:12750079},{id:`mithril_vein`,name:`미스릴 광맥`,style:`ore`,itemId:`mithril`,hp:6,bonus:2,radius:.75,baseColor:5069414,accentColor:9433308},{id:`gear_pile`,name:`톱니 잔해`,style:`scrap`,itemId:`gear_part`,hp:4,bonus:2,radius:.7,baseColor:6116424,accentColor:13937740},{id:`alloy_pile`,name:`합금 잔해`,style:`scrap`,itemId:`magi_alloy`,hp:5,bonus:2,radius:.7,baseColor:4870232,accentColor:7909088},{id:`obsidian_rock`,name:`흑요석 바위`,style:`ore`,itemId:`obsidian`,hp:6,bonus:2,radius:.75,baseColor:2893104,accentColor:5917304},{id:`fire_cluster`,name:`화염 핵`,style:`crystal`,itemId:`fire_core`,hp:5,bonus:2,radius:.65,baseColor:3810850,accentColor:16742960},{id:`dimension_cluster`,name:`차원 결정`,style:`crystal`,itemId:`dimension_crystal`,hp:6,bonus:2,radius:.65,baseColor:2763336,accentColor:7337215},{id:`void_vein`,name:`공허석 광맥`,style:`ore`,itemId:`void_stone`,hp:7,bonus:2,radius:.75,baseColor:1972782,accentColor:8019199},{id:`chest`,name:`보물 상자`,style:`chest`,itemId:``,hp:1,bonus:5,radius:.6,baseColor:8014372,accentColor:15253834}].map(e=>[e.id,e]));function mu(){return{active:{},done:[],daily:{date:``,list:[]}}}function hu(e=new Date){return`${e.getFullYear()}-${e.getMonth()+1}-${e.getDate()}`}function gu(e,t,n){switch(e.type){case`deliver`:return Math.min(e.count,n.count(e.item));case`clear`:return+(n.cleared>=e.stage);default:return Math.min(e.count,t)}}function _u(e){return e.type===`clear`?1:e.count}function vu(e){switch(e.type){case`kill`:return e.label??`몬스터 처치${e.minTier?` (${e.minTier}단계 이상)`:``}`;case`elite`:return`정예 몬스터 처치`;case`gather`:return`${Z[e.item].name} 채집`;case`deliver`:return`${Z[e.item].name} 가져오기`;case`build`:return`${Fl[e.building].name} 설치`;case`craft`:return`${Z[e.item].name} 생산`;case`clear`:return e.label;case`stages`:return`스테이지 클리어`}}var yu=class{state;ctx;constructor(e,t){this.state=e,this.ctx=t}isDone(e){return this.state.done.includes(e)}isActive(e){return e in this.state.active}available(e){return Kl.filter(t=>t.npc===e&&!this.isDone(t.id)&&!this.isActive(t.id)&&(t.after??[]).every(e=>this.isDone(e))&&(t.requireFlags??[]).every(e=>this.ctx.flag(e)>0)&&this.ctx.stones>=(t.requireStones??0))}activeFor(e){return Object.keys(this.state.active).map(e=>ql[e]).filter(t=>t&&t.npc===e)}activeList(){return Object.keys(this.state.active).map(e=>ql[e]).filter(Boolean)}progress(e){let t=this.state.active[e.id]??[];return e.objectives.map((e,n)=>({text:vu(e),cur:gu(e,t[n]??0,this.ctx),need:_u(e)}))}canComplete(e){return this.isActive(e.id)&&this.progress(e).every(e=>e.cur>=e.need)}accept(e){this.state.active[e.id]=e.objectives.map(()=>0)}finish(e){delete this.state.active[e.id],this.state.done.push(e.id)}event(e){let t=(t,n)=>{switch(t.type){case`kill`:return e.type===`kill`&&e.tier>=(t.minTier??0)?n+1:n;case`elite`:return e.type===`kill`&&e.elite?n+1:n;case`gather`:return e.type===`gather`&&e.item===t.item?n+e.count:n;case`build`:return e.type===`build`&&e.building===t.building?n+1:n;case`craft`:return e.type===`craft`&&e.item===t.item?n+e.count:n;case`stages`:return e.type===`stage`?n+1:n;default:return n}};for(let[e,n]of Object.entries(this.state.active)){let r=ql[e];r&&r.objectives.forEach((e,r)=>n[r]=t(e,n[r]??0))}for(let e of this.state.daily.list)e.claimed||(e.progress=t(e.objective,e.progress))}refreshDaily(e,t){let n=hu();if(this.state.daily.date===n)return!1;let r=new gl(bu(n)^2654435769),i=Math.max(1,e),a=[()=>({id:`kill`,title:`틈새 정화`,objective:{type:`kill`,count:20+i*5},reward:{gold:150*i,exp:80*i*i},progress:0,claimed:!1}),()=>({id:`elite`,title:`정예 사냥`,objective:{type:`elite`,count:2},reward:{gold:250*i,exp:120*i*i,items:{stone_low:1}},progress:0,claimed:!1}),()=>({id:`stages`,title:`차원문 순찰`,objective:{type:`stages`,count:3},reward:{gold:200*i,exp:100*i*i,items:{potion:2}},progress:0,claimed:!1}),()=>{let e=Yl(r.int(1,i));return{id:`gather`,title:`자원 조달`,objective:{type:`gather`,item:pu[r.pick(e.nodes)].itemId,count:12},reward:{gold:180*i,exp:90*i*i},progress:0,claimed:!1}}];return t&&a.push(()=>({id:`craft`,title:`공장 가동`,objective:{type:`craft`,item:`iron_ingot`,count:5},reward:{gold:200*i,exp:100*i*i,items:{essence_low:5}},progress:0,claimed:!1})),r.shuffle(a),this.state.daily={date:n,list:a.slice(0,3).map((e,t)=>({...e(),id:`${n}-${t}`}))},!0}};function bu(e){let t=2166136261;for(let n=0;n<e.length;n++)t=Math.imul(t^e.charCodeAt(n),16777619);return t>>>0}var xu=`yeongeop-teumsae-save-v1`;function Su(){let e=e=>({level:1,exp:0,equipment:{weapon:Eu(e)},alloc:Cu(),points:0});return{version:1,gold:100,currentClass:`sword`,classes:{sword:e(`sword`),mage:e(`mage`),archer:e(`archer`)},unlockedClasses:[`sword`],storage:{potion:3},equips:[],dimBag:Array.from({length:4},()=>null),dimStones:[],cleared:0,quests:mu(),flags:{},ngPlus:0,factory:{sizeLevel:0,buildings:[]},lastSaved:Date.now(),settings:{shadows:!0,sound:!0}}}function Cu(){return{str:0,int:0,dex:0,vit:0,mag:0}}function wu(e){return{tier:Math.floor((e-1)/10)+1,stage:(e-1)%10+1}}function Tu(e,t){return(e-1)*10+t}function Eu(e){return{uid:`starter-${e}`,slot:`weapon`,cls:e,tier:1,grade:0,plus:0}}function Du(){try{let e=localStorage.getItem(xu);if(!e)return null;let t=JSON.parse(e);return t.version===1?Ou({...Su(),...t}):null}catch{return null}}function Ou(e){let t=e=>{e.slot===`accessory`&&(e.slot=`ring`)};for(let n of Object.values(e.classes)){n.alloc??=Cu(),n.points??=(n.level-1)*5;let e=n.equipment;e.accessory&&(t(e.accessory),e.ring=e.accessory,delete e.accessory)}e.equips.forEach(t),(e.cleared===void 0||e.cleared===null)&&(e.cleared=Math.max(0,((e.maxTier??1)-1)*10)),delete e.maxTier,e.quests??=mu(),e.flags.home&&e.quests.done.length===0&&(e.quests.done.push(`m1_hunt`,`m2_tools`,`m3_essence`,`m4_factory`),e.dimStones.length&&e.quests.done.push(`m5_legend`),e.flags.tool_pickaxe=1,e.flags.tool_axe=1);for(let t of e.factory.buildings)(t.type===`input`||t.type===`output`)&&(t.mode=t.type===`input`?`in`:`out`,t.type=`box`,t.buffer={},t.recipe=null),t.type===`generator`&&(t.buffer??={});return e}function ku(){try{return localStorage.getItem(xu)!==null}catch{return!1}}function Au(){try{localStorage.removeItem(xu)}catch{}}var ju=class{data;constructor(e){this.data=e}save(){this.data.lastSaved=Date.now();try{localStorage.setItem(xu,JSON.stringify(this.data))}catch{}}get cls(){return this.data.classes[this.data.currentClass]}baseStats(e=this.data.currentClass){let t=this.data.classes[e],n=bl[e].baseStats,r=Cu();for(let e of yl)r[e]=n[e]+t.alloc[e];return r}stats(e=this.data.currentClass){let t=this.data.classes[e],n=bl[e],r=this.baseStats(e),i=t.level-1,a=n.damage===`physical`?r.str:r.int,o={maxHp:n.baseHp+r.vit*10+i*6,maxMp:n.baseMp+r.mag*6+i*2,atk:a*2+i,def:Math.floor(r.vit*.4),crit:5+r.dex*.3,speed:1+Math.min(.6,r.dex*.006),base:r};for(let e of Object.values(t.equipment)){if(!e)continue;let t=kl(e);o.atk+=t.atk,o.def+=t.def,o.maxHp+=t.hp,o.maxMp+=t.mp,o.crit+=t.crit}return o.crit=Math.round(o.crit*10)/10,o}allocate(e,t=1){let n=this.cls;return n.points<t?!1:(n.points-=t,n.alloc[e]+=t,!0)}get maxTier(){return Math.min(7,Math.floor(this.data.cleared/10)+1)}addExp(e){let t=this.cls;t.exp+=e;let n=0;for(;t.level<99&&t.exp>=Sl(t.level);)t.exp-=Sl(t.level),t.level++,t.points+=5,n++;return t.level>=99&&(t.exp=0),n}count(e){return this.data.storage[e]??0}take(e,t){return this.count(e)<t?!1:(this.data.storage[e]-=t,this.data.storage[e]===0&&delete this.data.storage[e],!0)}add(e,t){this.data.storage[e]=this.count(e)+t}hasAll(e){return Object.entries(e).every(([e,t])=>this.count(e)>=t)}takeAll(e){if(!this.hasAll(e))return!1;for(let[t,n]of Object.entries(e))this.take(t,n);return!0}depositSlots(e){for(let t of e)t&&(t.equip?this.data.equips.push(t.equip):this.add(t.itemId,t.count))}equip(e){let t=this.cls,n=e.slot,r=t.equipment[n];this.data.equips=this.data.equips.filter(t=>t.uid!==e.uid),r&&this.data.equips.push(r),t.equipment[n]=e}unequip(e){let t=this.cls,n=t.equipment[e];n&&(this.data.equips.push(n),delete t.equipment[e])}canEquip(e){return e.slot!==`weapon`||e.cls===this.data.currentClass}get factorySize(){return zl[this.data.factory.sizeLevel].size}get stoneCount(){return this.data.dimStones.length}flag(e){return this.data.flags[e]??0}setFlag(e,t=1){this.data.flags[e]=t}unlockClass(e){this.data.unlockedClasses.includes(e)||(this.data.unlockedClasses.push(e),this.data.unlockedClasses.sort((e,t)=>xl.indexOf(e)-xl.indexOf(t)))}},Mu=e=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${e}</svg>`,Nu={sword:Mu(`<path d="M19 4 L9.5 13.5"/><path d="M19 4 L20 3 M19 4 h1.5 M19 4 v-1.5"/><path d="M6.5 11.5 L12.5 17.5"/><path d="M9.5 14.5 L4.5 19.5"/>`),dodge:Mu(`<path d="M4.5 12a7.5 7.5 0 1 0 2.6-5.7"/><path d="M4 4.5v4h4"/>`),bag:Mu(`<path d="M5 8h14l-1.2 12H6.2z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>`),pause:Mu(`<path d="M9 5v14M15 5v14"/>`),lock:Mu(`<rect x="6" y="11" width="12" height="9" rx="1.5"/><path d="M9 11V8a3 3 0 0 1 6 0v3"/>`),portal:Mu(`<ellipse cx="12" cy="12" rx="6" ry="8.5"/><ellipse cx="12" cy="12" rx="2.5" ry="4.5"/>`),person:Mu(`<circle cx="12" cy="7.5" r="3.5"/><path d="M5 20c0-4 3-6.5 7-6.5s7 2.5 7 6.5"/>`),hammer:Mu(`<path d="M13 7l4-4 4 4-4 4z"/><path d="M15 9L5 19"/>`),potion:Mu(`<path d="M9 3h6M10 3v5l-4.5 8.5A3 3 0 0 0 8.2 21h7.6a3 3 0 0 0 2.7-4.5L14 8V3"/><path d="M7.5 14h9"/>`),hand:Mu(`<path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12"/><path d="M11 11V4.5a1.5 1.5 0 0 1 3 0V11"/><path d="M14 11V6a1.5 1.5 0 0 1 3 0v7a6 6 0 0 1-6 6h-1a5 5 0 0 1-4-2l-2.5-3.5a1.5 1.5 0 0 1 2.3-1.9L8 14"/>`),close:Mu(`<path d="M6 6l12 12M18 6L6 18"/>`)},Pu=e=>`#${e.toString(16).padStart(6,`0`)}`,Fu=e=>e.replace(/[&<>"]/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`})[e]),Iu=e=>`<span class="gem" style="--c:${Pu(Z[e]?.color??16777215)}"></span>`,Lu=e=>`<span class="gem eq" style="--c:${Pu(Tl[e.grade].color)}"></span>`,Ru=e=>`<i class="gem-inline" style="--c:${Pu(Z[e]?.color??16777215)}"></i>`;function zu(e){let t=kl(e),n=[];return t.atk&&n.push(`공격 ${t.atk}`),t.def&&n.push(`방어 ${t.def}`),t.hp&&n.push(`HP ${t.hp}`),t.mp&&n.push(`MP ${t.mp}`),t.crit&&n.push(`치명 ${t.crit}%`),n.join(` · `)}function Bu(e){return`<b style="color:${Pu(Tl[e.grade].color)}">[${Tl[e.grade].name}] ${Fu(Ol(e))}</b>`}var Vu={material:`재료`,essence:`마력 정수`,processed:`가공품`,consumable:`소모품`,key:`중요 물품`};function Hu(e){if(e.equip){let t=e.equip;return`${Bu(t)} <span class="dim">· ${Dl(t.slot,t.cls)}${t.cls?` (${bl[t.cls].name} 전용)`:``}</span><br>${zu(t)} · 판매가 ${Nl(t)} G`}let t=Z[e.itemId];return`<b style="color:${Pu(t.color)}">${t.name}</b> <span class="dim">· ${Vu[t.kind]} · ${e.count}개 · 개당 ${t.value} G</span><br>${t.description}`}var Uu=class{click;layer;current=null;onCloseCb=null;constructor(e,t){this.click=t,this.layer=document.createElement(`div`),this.layer.className=`screens`,e.appendChild(this.layer)}get isOpen(){return this.current!==null}close(){this.current?.remove(),this.current=null;let e=this.onCloseCb;this.onCloseCb=null,e?.()}open(e,t,n){let r=this.current?.querySelector(`.scroll`)?.scrollTop??0,i=this.current?.dataset.kind===e;this.current?.remove(),this.onCloseCb=null;let a=document.createElement(`div`);if(a.className=`screen ${e}`,a.dataset.kind=e,i&&a.classList.add(`no-anim`),a.innerHTML=t,this.layer.appendChild(a),this.current=a,i){let e=a.querySelector(`.scroll`);e&&(e.scrollTop=r)}return n&&(this.onCloseCb=n,a.querySelector(`.close`)?.addEventListener(`click`,()=>this.close()),a.addEventListener(`pointerdown`,e=>{e.target===a&&this.close()})),a.addEventListener(`click`,e=>{e.target.closest(`button`)&&this.click()}),a}on(e,t,n){e.querySelectorAll(t).forEach(e=>e.addEventListener(`click`,()=>n(e)))}title(e,t,n){let r=this.open(`title`,`<div class="title-box">
         <div class="title-sub">차원틈새에 떨어진 자의 이야기</div>
         <h1>영겁의 틈새</h1>
         <div class="title-menu">
           ${e?`<button class="primary" data-a="continue">이어하기</button>`:``}
           <button class="${e?``:`primary`}" data-a="new">새로 시작</button>
         </div>
       </div>
       <div class="version">v1.1 · 모바일 가로 화면 권장</div>`);this.on(r,`[data-a="continue"]`,n),this.on(r,`[data-a="new"]`,()=>{(!e||confirm(`저장된 진행을 지우고 새로 시작할까요?`))&&t()})}stageSelect(e,t,n,r){let i=e.maxTier,a=Jl.map(n=>{let r=n.tier>i;return`<button class="tier-tab ${n.tier===t?`on`:``} ${r?`locked`:``}" data-tier="${n.tier}" style="--c:${Pu(n.portalColor)}" ${r?`disabled`:``}>
          <span class="gate"></span><b>${n.tier}${e.data.dimStones.includes(n.tier)?`<i class="stone">◆</i>`:``}</b></button>`}).join(``),o=Jl[t-1],s=Array.from({length:10},(n,r)=>{let i=r+1,a=Tu(t,i),o=a<=e.data.cleared+1,s=a<=e.data.cleared,c=i===10?`수호자`:i===5?`파수꾼`:``;return`<button class="stage-btn ${s?`done`:``} ${c?`boss`:``}" data-stage="${i}" ${o?``:`disabled`}>
          <b>${t}-${i}</b><small>${o?c||(s?`클리어`:`도전`):`봉인`}</small></button>`}).join(``),c=this.open(`select`,`<div class="panel wide">
         <button class="close">${Nu.close}</button>
         <h2>차원문 광장 <small>${o.name}${e.data.ngPlus?` · ${e.data.ngPlus+1}회차`:``}</small></h2>
         <div class="tier-tabs">${a}</div>
         <p class="hint">방의 몬스터를 모두 쓰러뜨리면 워프 게이트가 열립니다. 5번째 방은 파수꾼(좋은 보상), 10번째 방은 차원석을 지닌 수호자.</p>
         <div class="stage-grid">${s}</div>
       </div>`,r);this.on(c,`.tier-tab:not(.locked)`,t=>this.stageSelect(e,Number(t.dataset.tier),n,r)),this.on(c,`[data-stage]`,e=>n(t,Number(e.dataset.stage)))}warp(e,t,n,r,i){let a=this.open(`warp`,`<div class="panel">
         <button class="close">${Nu.close}</button>
         <h2>워프 게이트</h2>
         <p class="hint">${e} 클리어! 가방의 전리품은 그대로 들고 갑니다.</p>
         <div class="menu">
           ${t?`<button class="primary" data-a="next">다음 방으로 (${t})</button>`:``}
           <button data-a="village" class="${t?``:`primary`}">마을로 귀환</button>
         </div>
       </div>`,i);this.on(a,`[data-a="next"]`,n),this.on(a,`[data-a="village"]`,r)}pause(e){let t=this.open(`pause`,`<div class="panel">
         <button class="close">${Nu.close}</button>
         <h2>메뉴</h2>
         <div class="menu">
           <button data-a="resume" class="primary">계속하기</button>
           ${e.inDungeon?`<button data-a="stone" ${e.returnStones?``:`disabled`}>귀환석 사용 (보유 ${e.returnStones})</button>`:``}
           ${e.inDungeon?`<button data-a="giveup" class="danger">포기하고 쓰러지기</button>`:``}
           <label class="toggle"><input type="checkbox" data-t="shadow" ${e.shadows?`checked`:``}/> 그림자</label>
           <label class="toggle"><input type="checkbox" data-t="sound" ${e.sound?`checked`:``}/> 소리</label>
           <button data-a="title">타이틀로 (자동 저장)</button>
         </div>
         ${e.seed===void 0?``:`<div class="seed">던전 시드 ${e.seed}</div>`}
         <div class="keys">PC 조작: WASD 이동 · J/클릭 공격 · Space 구르기 · 1·2·3 스킬 · Q 물약 · E 상호작용·채집 · M 지도 · I 가방 · B 건설 · Esc 메뉴</div>
       </div>`,e.onClose);this.on(t,`[data-a="resume"]`,()=>this.close()),this.on(t,`[data-a="stone"]`,e.onReturnStone),this.on(t,`[data-a="giveup"]`,()=>{confirm(`포기하면 일반 가방의 아이템을 모두 잃습니다. 계속할까요?`)&&e.onGiveUp()}),this.on(t,`[data-a="title"]`,e.onTitle),t.querySelector(`[data-t="shadow"]`).addEventListener(`change`,t=>e.onToggleShadows(t.target.checked)),t.querySelector(`[data-t="sound"]`).addEventListener(`change`,t=>e.onToggleSound(t.target.checked))}bag(e,t,n,r){let i=`아이템을 누르면 정보가 나오고, 끌어서 다른 가방에 놓으면 옮겨집니다.`,a=()=>{let o=(e,t,n)=>e?`<div class="slot filled" data-from="${t}" data-i="${n}" style="--c:${Pu(e.equip?Tl[e.equip.grade].color:Z[e.itemId].color)}"><span class="gem ${e.equip?`eq`:``}"></span><span class="cnt">${e.equip?`+${e.equip.plus}`:e.count}</span></div>`:`<div class="slot"></div>`,s=this.open(`bag`,`<div class="panel wide">
           <button class="close">${Nu.close}</button>
           <h2>가방 <small>${e.used}/${e.slots.length}</small></h2>
           <div class="bag-grid" data-bag="bag">${e.slots.map((e,t)=>o(e,`bag`,t)).join(``)}</div>
           <div class="item-info">${i}</div>
           <h3>차원가방 <small>쓰러져도 지켜지는 가방 · ${t.used}/${t.slots.length}</small></h3>
           <div class="bag-grid dim-row" data-bag="dim">${t.slots.map((e,t)=>o(e,`dim`,t)).join(``)}</div>
         </div>`,r);s.querySelectorAll(`.slot.filled`).forEach(r=>{r.addEventListener(`pointerdown`,o=>{o.preventDefault(),r.setPointerCapture(o.pointerId);let c=r.dataset.from,l=Number(r.dataset.i),u=(c===`bag`?e:t).slots[l],d=o.clientX,f=o.clientY,p=null,m=e=>{if(!p&&Math.hypot(e.clientX-d,e.clientY-f)>8&&(p=r.cloneNode(!0),p.classList.add(`drag-ghost`),p.style.width=`${r.offsetWidth}px`,p.style.height=`${r.offsetHeight}px`,document.body.appendChild(p),r.classList.add(`dragging`)),p){p.style.transform=`translate(${e.clientX-r.offsetWidth/2}px, ${e.clientY-r.offsetHeight/2}px)`;let t=document.elementFromPoint(e.clientX,e.clientY)?.closest(`.bag-grid`);s.querySelectorAll(`.bag-grid`).forEach(e=>e.classList.toggle(`drop`,e===t&&t.dataset.bag!==c))}},h=e=>{if(r.removeEventListener(`pointermove`,m),r.removeEventListener(`pointerup`,h),r.removeEventListener(`pointercancel`,h),p){p.remove();let t=document.elementFromPoint(e.clientX,e.clientY)?.closest(`.bag-grid`);if(t&&t.dataset.bag!==c){let e=u.equip?Ol(u.equip):Z[u.itemId].name;i=n(c,l)?`${e} → ${c===`bag`?`차원가방`:`일반 가방`}`:`<span class="bad">옮길 칸이 없습니다</span>`}a()}else i=Hu(u),s.querySelector(`.item-info`).innerHTML=i,s.querySelectorAll(`.slot`).forEach(e=>e.classList.toggle(`sel`,e===r))};r.addEventListener(`pointermove`,m),r.addEventListener(`pointerup`,h),r.addEventListener(`pointercancel`,h)})})};a()}result(e,t){let n=[...e.items].map(([e,t])=>`<li>${Iu(e)}${Z[e].name}<b>× ${t}</b></li>`).join(``),r=e.equips.map(e=>`<li>${Lu(e)}<span>${Bu(e)}</span><b>장비</b></li>`).join(``),i=e.lost?[...e.lost].map(([e,t])=>`<li class="lost">${Iu(e)}${Z[e].name}<b>− ${t}</b></li>`).join(``):``,a=Math.floor(e.seconds/60),o=Math.floor(e.seconds%60),s=this.open(`result ${e.lost?`dead`:``}`,`<div class="panel tall">
         <h2>${e.title}</h2>
         ${e.note?`<p class="hint">${e.note}</p>`:``}
         <div class="stats"><span>시간 <b>${a}분 ${o}초</b></span>${e.stages?`<span>클리어 <b>${e.stages}방</b></span>`:``}<span>골드 <b>+${e.gold}</b></span><span>경험치 <b>+${e.exp}</b></span></div>
         <ul class="loot scroll">${n}${r}${i}${!n&&!r&&!i?`<li class="empty">가져온 전리품이 없습니다</li>`:``}</ul>
         ${e.lostEquips?`<p class="hint">잃어버린 장비 ${e.lostEquips}개</p>`:``}
         <div class="menu"><button class="primary" data-ok>마을로</button></div>
       </div>`,t);this.on(s,`[data-ok]`,()=>this.close())}inventory(e,t,n,r,i){let a=bl[e.data.currentClass],o=e.stats(),s=e.cls,c=``;if(n===`equip`)c=`<div class="scroll"><div class="eq-slots">${Cl.map(t=>{let n=s.equipment[t];return`<div class="eq-slot">${n?`${Lu(n)}<div>${Bu(n)}<small>${zu(n)}</small></div><button data-un="${t}">해제</button>`:`<span class="gem empty"></span><div><b class="dim">${Dl(t,e.data.currentClass)} 없음</b></div>`}</div>`}).join(``)}</div><h3>보관 중인 장비</h3><ul class="list">${e.data.equips.slice().sort((e,t)=>t.tier*10+t.grade-(e.tier*10+e.grade)).map(t=>{let n=e.canEquip(t);return`<li>${Lu(t)}<div>${Bu(t)}<small>${Dl(t.slot,t.cls)} · ${zu(t)}${t.cls&&t.cls!==e.data.currentClass?` · ${bl[t.cls].name} 전용`:``}</small></div><button data-eq="${t.uid}" ${n?``:`disabled`}>장착</button></li>`}).join(``)||`<li class="empty">장비가 없습니다</li>`}</ul></div>`;else if(n===`storage`)c=`<ul class="list scroll">${Vl.filter(t=>e.count(t.id)>0).map(t=>`<li>${Iu(t.id)}<div><b>${t.name}</b><small>${t.description}</small></div><b class="num">${e.count(t.id)}</b></li>`).join(``)||`<li class="empty">창고가 비어 있습니다</li>`}</ul>`;else if(n===`stats`){let t=Sl(s.level),n=yl.map(e=>`<div class="stat-row"><b>${vl[e].name}</b><span class="num">${o.base[e]}</span><small>${vl[e].desc}</small>
          <button data-stat="${e}" ${s.points>0?``:`disabled`}>+1</button><button data-stat5="${e}" ${s.points>=5?``:`disabled`}>+5</button></div>`).join(``);c=`<div class="scroll">
        <div class="stat-grid">
          <span>직업</span><b>${a.name} Lv.${s.level}${s.level>=99?` (최고)`:``}</b>
          <span>경험치</span><b>${s.exp} / ${t}</b>
          <span>HP</span><b>${o.maxHp}</b>
          <span>MP</span><b>${o.maxMp}</b>
          <span>${a.damage===`physical`?`물리`:`마법`} 공격력</span><b>${o.atk}</b>
          <span>방어력</span><b>${o.def}</b>
          <span>치명타</span><b>${o.crit}%</b>
          <span>공격 속도</span><b>${Math.round(o.speed*100)}%</b>
          <span>골드</span><b>${e.data.gold}</b>
          <span>차원석</span><b>${e.data.dimStones.length} / 7</b>
        </div>
        <h3>스탯 <small>남은 포인트 <b class="${s.points?`ok`:``}">${s.points}</b> · 레벨업마다 5포인트</small></h3>
        <div class="stat-rows">${n}</div>
        <h3>스킬</h3><ul class="list">${a.skills.map((e,t)=>`<li><span class="key">${t+1}</span><div><b>${e.name}</b><small>${e.description} · MP ${e.mp} · ${e.cooldown}초</small></div></li>`).join(``)}</ul>
      </div>`}else{let n=t.activeList(),r=e=>{let n=t.progress(e),r=n.every(e=>e.cur>=e.need);return`<li class="quest ${e.kind}"><div><b>${e.kind===`main`?`[메인] `:`[서브] `}${e.title}</b>
          <small>${n.map(e=>`${e.text} ${e.cur}/${e.need}`).join(` · `)}</small>
          <small class="${r?`ok`:`dim`}">${r?`✔ ${Gu(e.npc)}에게 보고하기`:`의뢰인: ${Gu(e.npc)}`}</small></div></li>`},i=t.state.daily.list.map(t=>{let n=_u(t.objective),r=gu(t.objective,t.progress,{count:t=>e.count(t),stones:e.stoneCount,cleared:e.data.cleared,flag:t=>e.flag(t)});return`<li class="quest daily ${t.claimed?`claimed`:``}"><div><b>[일일] ${t.title}</b><small>${vu(t.objective)} ${Math.min(r,n)}/${n}</small><small class="${t.claimed?`dim`:r>=n?`ok`:`dim`}">${t.claimed?`보상 받음`:r>=n?`✔ 촌장 에단에게 보고하기`:`촌장 에단의 일일 의뢰`}</small></div></li>`}).join(``);c=`<ul class="list scroll">${n.map(r).join(``)}${i}${!n.length&&!i?`<li class="empty">진행 중인 퀘스트가 없습니다. 머리 위에 !가 뜬 주민에게 말을 걸어 보세요.</li>`:``}</ul>`}let l=this.open(`inventory`,`<div class="panel wide tall">
         <button class="close">${Nu.close}</button>
         <div class="tabs">
           <button data-tab="equip" class="${n===`equip`?`on`:``}">장비</button>
           <button data-tab="storage" class="${n===`storage`?`on`:``}">창고</button>
           <button data-tab="stats" class="${n===`stats`?`on`:``}">능력치${s.points?` <i class="dot">${s.points}</i>`:``}</button>
           <button data-tab="quest" class="${n===`quest`?`on`:``}">퀘스트</button>
         </div>
         ${c}
       </div>`,i),u=(a=n)=>this.inventory(e,t,a,r,i);this.on(l,`[data-tab]`,e=>u(e.dataset.tab)),this.on(l,`[data-eq]`,t=>{let n=e.data.equips.find(e=>e.uid===t.dataset.eq);n&&e.equip(n),r(),u()}),this.on(l,`[data-un]`,t=>{e.unequip(t.dataset.un),r(),u()}),this.on(l,`[data-stat]`,t=>{e.allocate(t.dataset.stat,1),r(),u()}),this.on(l,`[data-stat5]`,t=>{e.allocate(t.dataset.stat5,5),r(),u()})}questOffer(e,t,n){let r=e.objectives.map(e=>`<li><span class="key">▸</span><div><b>${vu(e)}</b><small>${e.type===`clear`?``:`${_u(e)}${e.type===`deliver`||e.type===`gather`||e.type===`craft`?`개`:e.type===`build`?`개 설치`:`마리`}`}</small></div></li>`).join(``),i=e.rewards,a=[i.gold?`${i.gold} G`:``,i.exp?`경험치 ${i.exp}`:``,...Object.entries(i.items??{}).map(([e,t])=>`${Ru(e)}${Z[e].name} ×${t}`)].filter(Boolean).join(` · `),o=this.open(`quest-offer`,`<div class="panel">
         <button class="close">${Nu.close}</button>
         <h2>${e.kind===`main`?`[메인] `:`[서브] `}${e.title}</h2>
         <ul class="list">${r}</ul>
         <p class="hint">보상: ${a||`없음`}</p>
         <div class="menu"><button class="primary" data-a="accept">수락하기</button></div>
       </div>`,n);this.on(o,`[data-a="accept"]`,t)}dailyBoard(e,t,n,r){let i={count:t=>e.count(t),stones:e.stoneCount,cleared:e.data.cleared,flag:t=>e.flag(t)},a=t.state.daily.list.map((e,t)=>{let n=_u(e.objective),r=Math.min(n,gu(e.objective,e.progress,i)),a=e.reward,o=[a.gold?`${a.gold} G`:``,a.exp?`경험치 ${a.exp}`:``,...Object.entries(a.items??{}).map(([e,t])=>`${Z[e].name}×${t}`)].filter(Boolean).join(` · `);return`<li><div><b>${e.title}</b><small>${vu(e.objective)} ${r}/${n}</small><small class="dim">보상: ${o}</small></div>
          <button data-claim="${t}" ${e.claimed||r<n?`disabled`:``}>${e.claimed?`완료`:`보상 받기`}</button></li>`}).join(``),o=this.open(`daily`,`<div class="panel wide">
         <button class="close">${Nu.close}</button>
         <h2>촌장의 일일 의뢰 <small>매일 새로 바뀝니다</small></h2>
         <ul class="list">${a}</ul>
       </div>`,r);this.on(o,`[data-claim]`,e=>n(Number(e.dataset.claim)))}shop(e,t,n,r=`buy`,i){let a=[{id:`potion`,label:`치유 물약`,price:30,make:()=>e.add(`potion`,1)},{id:`return_stone`,label:`귀환석`,price:80,make:()=>e.add(`return_stone`,1)}],o=Math.max(1,Math.min(3,e.maxTier-1));for(let t of Cl){let n={uid:`shop-${t}`,slot:t,cls:t===`weapon`?e.data.currentClass:void 0,tier:o,grade:0,plus:0};a.push({id:`eq-${t}`,label:Ol(n),equip:n,price:Nl(n)*4,make:()=>e.data.equips.push({...n,uid:`${Date.now()}${t}${Math.random()}`})})}let s=``;if(r===`buy`)s=`<ul class="list scroll">${a.map((t,n)=>`<li>${t.equip?Lu(t.equip):Iu(t.id)}<div><b>${Fu(t.label)}</b><small>${t.equip?`기본 장비 · ${zu(t.equip)}`:Z[t.id].description}</small></div><button data-buy="${n}" ${e.data.gold>=t.price?``:`disabled`}>${t.price} G</button></li>`).join(``)}</ul>`;else{let t=Vl.filter(t=>e.count(t.id)>0&&t.value>0).map(t=>`<li>${Iu(t.id)}<div><b>${t.name} <span class="dim">× ${e.count(t.id)}</span></b><small>개당 ${t.value} G</small></div><button data-sell="${t.id}">1개</button><button data-sellall="${t.id}">전부</button></li>`).join(``),n=e.data.equips.map(e=>`<li>${Lu(e)}<div>${Bu(e)}<small>${zu(e)}</small></div><button data-selleq="${e.uid}">${Nl(e)} G</button></li>`).join(``);s=`<ul class="list scroll">${t}${n}${!t&&!n?`<li class="empty">팔 물건이 없습니다</li>`:``}</ul>`}let c=this.open(`shop`,`<div class="panel wide tall">
         <button class="close">${Nu.close}</button>
         <h2>상인 무트의 가게 <small class="gold">${e.data.gold} G</small></h2>
         <div class="tabs"><button data-tab="buy" class="${r===`buy`?`on`:``}">사기</button><button data-tab="sell" class="${r===`sell`?`on`:``}">팔기</button></div>
         ${i?`<div class="notice">${i}</div>`:``}
         ${s}
       </div>`,n),l=(i=r,a)=>{t(),this.shop(e,t,n,i,a)};this.on(c,`[data-tab]`,e=>l(e.dataset.tab)),this.on(c,`[data-buy]`,t=>{let n=a[Number(t.dataset.buy)];e.data.gold<n.price||(e.data.gold-=n.price,n.make(),l(r,`${n.label} 구입`))}),this.on(c,`[data-sell]`,t=>{let n=t.dataset.sell;e.take(n,1)&&(e.data.gold+=Z[n].value),l(r,`${Z[n].name} 판매 +${Z[n].value} G`)}),this.on(c,`[data-sellall]`,t=>{let n=t.dataset.sellall,i=e.count(n);i>0&&e.take(n,i)&&(e.data.gold+=Z[n].value*i),l(r,`${Z[n].name} ${i}개 판매 +${Z[n].value*i} G`)}),this.on(c,`[data-selleq]`,t=>{let n=e.data.equips.find(e=>e.uid===t.dataset.selleq);n&&(e.data.equips=e.data.equips.filter(e=>e!==n),e.data.gold+=Nl(n),l(r,`${Ol(n)} 판매 +${Nl(n)} G`))})}blueprints(e,t,n,r){let i=Il.filter(e=>Fl[e].blueprint).map(t=>{let n=Fl[t],r=n.blueprint,i=e.flag(`bp_${t}`)>0,a=[`${r.gold} G`,...Object.entries(r.items).map(([t,n])=>`${Z[t].name} ${e.count(t)}/${n}`)].join(` · `),o=!i&&e.data.gold>=r.gold&&e.hasAll(r.items);return`<li><span class="gem" style="--c:${Pu(n.color)}"></span><div><b>${n.name} 도면</b><small>${n.description}</small><small class="dim">${i?`보유 중`:a}</small></div><button data-bp="${t}" ${o?``:`disabled`}>${i?`보유`:`구입`}</button></li>`}).join(``),a=this.open(`blueprints`,`<div class="panel wide tall">
         <button class="close">${Nu.close}</button>
         <h2>세라의 도면 <small class="gold">${e.data.gold} G</small></h2>
         ${r?`<div class="notice">${r}</div>`:``}
         <p class="hint">도면을 사면 차원집 건설 모드에서 그 건물을 지을 수 있습니다.</p>
         <ul class="list scroll">${i}</ul>
       </div>`,n);this.on(a,`[data-bp]`,e=>t(e.dataset.bp))}forge(e,t,n,r,i){let a=e.cls,o=[...Object.values(a.equipment).filter(Boolean),...e.data.equips],s=o.find(e=>e.uid===r)??o[0],c=o.map(e=>`<li class="${e===s?`sel`:``}" data-pick="${e.uid}">${Lu(e)}<div>${Bu(e)}<small>${zu(e)}${Object.values(a.equipment).includes(e)?` · 착용 중`:``}</small></div></li>`).join(``),l=`<p class="hint">강화할 장비가 없습니다.</p>`;if(s){let t=Pl(s);if(!t)l=`<p>${Bu(s)}</p><p class="hint">이미 최대 강화(+10)입니다.</p>`;else{let n={...s,plus:s.plus+1},r=e.count(t.stone),i=r>=t.count&&e.data.gold>=t.gold;l=`<p>${Bu(s)} → <b>+${n.plus}</b></p>
          <p class="hint">${zu(s)}<br>→ ${zu(n)}</p>
          <p>${Ru(t.stone)}${Z[t.stone].name} ${t.count}개 <span class="${r>=t.count?`dim`:`bad`}">(보유 ${r})</span></p>
          <p>${t.gold} G · 성공 확률 <b>${Math.round(t.rate*100)}%</b></p>
          <p class="hint">실패해도 단계가 내려가지 않지만 재료는 사라집니다.</p>
          <div class="menu"><button class="primary" data-enh ${i?``:`disabled`}>강화하기</button></div>`}}let u=this.open(`forge`,`<div class="panel wide tall">
         <button class="close">${Nu.close}</button>
         <h2>대장장이 고른의 대장간 <small class="gold">${e.data.gold} G</small></h2>
         ${i?`<div class="notice">${i}</div>`:``}
         <div class="split"><ul class="list pick scroll">${c||`<li class="empty">장비 없음</li>`}</ul><div class="detail">${l}</div></div>
       </div>`,n);this.on(u,`[data-pick]`,r=>this.forge(e,t,n,r.dataset.pick)),this.on(u,`[data-enh]`,()=>{if(!s)return;let r=Pl(s);if(e.count(r.stone)<r.count||e.data.gold<r.gold)return;e.take(r.stone,r.count),e.data.gold-=r.gold;let i=Math.random()<r.rate;i&&s.plus++,t(),this.forge(e,t,n,s.uid,i?`<b class="ok">강화 성공! +${s.plus}</b>`:`<b class="bad">강화 실패…</b>`)})}classHall(e,t,n){let r=xl.map(t=>{let n=bl[t],r=e.data.unlockedClasses.includes(t),i=e.data.classes[t].level;return`<button class="class-card ${r?``:`locked`} ${e.data.currentClass===t?`on`:``}" data-cls="${t}" ${r?``:`disabled`} style="--c:${Pu(n.look.tunic)}">
          <span class="badge-cls">${n.short}</span>
          <b>${n.name}</b>
          <small>${r?`Lv.${i} · ${n.basic}`:`스토리를 진행하면 해금`}</small>
        </button>`}).join(``),i=this.open(`hall`,`<div class="panel wide">
         <button class="close">${Nu.close}</button>
         <h2>직업의 전당</h2>
         <p class="hint">레벨·스탯·장비는 직업마다 따로, 차원집과 창고는 모두 함께 씁니다.</p>
         <div class="class-grid">${r}</div>
       </div>`,n);this.on(i,`[data-cls]`,e=>t(e.dataset.cls))}generator(e,t,n,r,i){let a=e.networkInfo(t),o=cu.map(e=>{let r=t.buffer?.[e]??0,i=n.count(e);return`<li>${Iu(e)}<div><b>${Z[e].name}</b><small>발전기 안 ${r}개 · 창고 ${i}개</small></div>
        <button data-put="${e}" data-n="1" ${i?``:`disabled`}>+1</button><button data-put="${e}" data-n="10" ${i?``:`disabled`}>+10</button><button data-put="${e}" data-n="all" ${i?``:`disabled`}>전부</button>
        <button data-take="${e}" ${r?``:`disabled`}>빼기</button></li>`}).join(``),s=this.open(`factory-config`,`<div class="panel wide tall">
         <button class="close">${Nu.close}</button>
         <h2>마력 발전기</h2>
         <p class="hint">여기에 넣은 마력 정수만 탑니다 (하급 2분 · 중급 5분 · 상급 10분). 전력을 쓰는 기계가 있을 때만 연료가 줄어듭니다.</p>
         <p>지금 타는 연료: <b>${Math.ceil(t.fuel??0)}초</b> · 전력망 공급 ${a?.supply??0} / 수요 ${a?.demand??0}</p>
         <ul class="list scroll">${o}</ul>
       </div>`,i),c=()=>{r(),this.generator(e,t,n,r,i)};this.on(s,`[data-put]`,e=>{let r=e.dataset.put,i=e.dataset.n===`all`?n.count(r):Math.min(n.count(r),Number(e.dataset.n));i>0&&n.take(r,i)&&(t.buffer[r]=(t.buffer[r]??0)+i),c()}),this.on(s,`[data-take]`,e=>{let r=e.dataset.take,i=t.buffer[r]??0;i>0&&(n.add(r,i),delete t.buffer[r]),c()})}box(e,t,n,r){let i=Object.entries(e.buffer??{}).filter(([,e])=>e>0).map(([e,t])=>`<li>${Iu(e)}<div><b>${Z[e].name}</b><small>상자 안 ${t}개</small></div><button data-out="${e}" data-n="1">1개</button><button data-out="${e}" data-n="10">10개</button><button data-out="${e}" data-n="all">전부 꺼내기</button></li>`).join(``),a=Vl.filter(e=>e.kind!==`key`&&t.count(e.id)>0).map(e=>`<li>${Iu(e.id)}<div><b>${e.name}</b><small>창고 ${t.count(e.id)}개</small></div><button data-in="${e.id}" data-n="1">1개</button><button data-in="${e.id}" data-n="10">10개</button><button data-in="${e.id}" data-n="all">전부 넣기</button></li>`).join(``),o=this.open(`factory-config`,`<div class="panel wide tall">
         <button class="close">${Nu.close}</button>
         <h2>보관상자 <small>${du(e)} / 999</small></h2>
         <div class="tabs">
           <button data-mode="in" class="${e.mode===`in`?`on`:``}">투입 (앞 기계로 보내기)</button>
           <button data-mode="out" class="${e.mode===`out`?`on`:``}">출하 (완성품 받기)</button>
         </div>
         <div class="scroll">
           <h3>상자 안</h3>
           <ul class="list">${i||`<li class="empty">비어 있습니다</li>`}</ul>
           <h3>창고에서 넣기</h3>
           <ul class="list">${a||`<li class="empty">창고가 비어 있습니다</li>`}</ul>
         </div>
       </div>`,r),s=()=>{n(),this.box(e,t,n,r)};this.on(o,`[data-mode]`,t=>{e.mode=t.dataset.mode,s()}),this.on(o,`[data-out]`,n=>{let r=n.dataset.out,i=e.buffer[r]??0,a=n.dataset.n===`all`?i:Math.min(i,Number(n.dataset.n));a>0&&(e.buffer[r]-=a,e.buffer[r]<=0&&delete e.buffer[r],t.add(r,a)),s()}),this.on(o,`[data-in]`,n=>{let r=n.dataset.in,i=999-du(e),a=Math.min(i,n.dataset.n===`all`?t.count(r):Math.min(t.count(r),Number(n.dataset.n)));a>0&&t.take(r,a)&&(e.buffer[r]=(e.buffer[r]??0)+a),s()})}machine(e,t,n,r,i){let a=Fl[t.type],o=`<p class="hint">${a.description}</p>`;if(t.crafting){let e=uu[t.crafting];o+=`<div class="notice">생산 중: ${Ru(e.output)}<b>${Z[e.output].name}</b> ×${e.count} · ${Math.floor((t.progress??0)*100)}% (총 ${e.time}초)</div>`}if(t.type===`assembler`){let e=lu(`assembler`).map(e=>{let n=Object.entries(e.inputs).map(([e,t])=>`${Z[e].name}×${t}`).join(` + `);return`<li class="${t.recipe===e.id?`sel`:``}" data-recipe="${e.id}">${Iu(e.output)}<div><b>${Z[e.output].name}</b><small>${n} · ${e.time}초</small></div></li>`}).join(``);o+=`<h3>조립 설계 <small>누르면 바뀝니다</small></h3><ul class="list pick">${e}</ul>`}else if(su.has(t.type)){let e=Ll.filter(e=>e.machine===t.type).map(e=>`<li>${Iu(e.output)}<div><b>${Z[e.output].name}${e.count>1?` ×${e.count}`:``}</b><small>${Object.entries(e.inputs).map(([e,t])=>`${Z[e].name}×${t}`).join(` + `)} · ${e.time}초</small></div></li>`).join(``);o+=`<h3>레시피 <small>들어오는 재료에 따라 자동</small></h3><ul class="list">${e}</ul>`}let s=e.networkInfo(t),c={working:`가동 중`,"no-power":`전력 부족 (발전기 연료 확인)`,idle:`재료 대기`,blocked:`출구 막힘`,"no-recipe":`설계 선택 필요`}[e.status(t)];o+=`<p class="hint">${e.connected(t)?`전력망: 공급 ${s?.supply??0} / 수요 ${s?.demand??0}`:`<span class="bad">마력선에 연결되어 있지 않습니다</span>`} · 상태: <b>${c}</b></p>`;let l=Object.entries(t.buffer??{}).filter(([,e])=>e>0);l.length&&(o+=`<p class="hint">대기 중인 재료: ${l.map(([e,t])=>`${Z[e].name} ${t}`).join(`, `)}</p>`);let u=this.open(`factory-config`,`<div class="panel wide tall">
         <button class="close">${Nu.close}</button>
         <h2>${a.name}</h2>
         <div class="scroll">${o}</div>
       </div>`,i);this.on(u,`[data-recipe]`,a=>{for(let[e,r]of Object.entries(t.buffer??{}))r>0&&n.add(e,r);t.buffer={},t.recipe=a.dataset.recipe,r(),this.machine(e,t,n,r,i)})}factoryExpand(e,t,n){let r=zl[e.data.factory.sizeLevel+1],i=`<p>이미 가장 넓은 차원집입니다.</p>`;if(r?.cost){let t=r.cost,n=e.data.gold>=t.gold&&e.hasAll(t.items);i=`<p>공장 넓이 ${e.factorySize}×${e.factorySize} → <b>${r.size}×${r.size}</b></p>
        <ul class="list">${Object.entries(t.items).map(([t,n])=>`<li>${Iu(t)}<div><b>${Z[t].name}</b></div><b class="num ${e.count(t)>=n?``:`bad`}">${e.count(t)} / ${n}</b></li>`).join(``)}
        <li><span class="gem" style="--c:#e8c14a"></span><div><b>골드</b></div><b class="num ${e.data.gold>=t.gold?``:`bad`}">${e.data.gold} / ${t.gold}</b></li></ul>
        <div class="menu"><button class="primary" data-x ${n?``:`disabled`}>확장하기</button></div>`}let a=this.open(`factory-config`,`<div class="panel"><button class="close">${Nu.close}</button><h2>차원집 확장</h2>${i}</div>`,n);this.on(a,`[data-x]`,t)}notice(e,t,n,r=`확인`){let i=this.open(`notice-screen`,`<div class="panel"><h2>${e}</h2>${t}<div class="menu"><button class="primary" data-ok>${r}</button></div></div>`,n);this.on(i,`[data-ok]`,()=>this.close())}offlineReward(e,t,n){let r=Math.floor(e/3600),i=Math.floor(e%3600/60),a=[...t].filter(([,e])=>e>0).map(([e,t])=>`<li>${Iu(e)}${Z[e].name}<b>+${t}</b></li>`).join(``);this.notice(`오프라인 보상`,`<p class="hint">자리를 비운 ${r?`${r}시간 `:``}${i}분 동안 차원집 공장이 돌아갔습니다. 출하 보관상자를 확인해 보세요.</p><ul class="loot">${a||`<li class="empty">새로 만들어진 것이 없습니다</li>`}</ul>`,n)}},Wu={chief:`촌장 에단`,guide:`안내인 리아`,smith:`대장장이 고른`,engineer:`마공학자 세라`,merchant:`상인 무트`,stranger:`???`},Gu=e=>Wu[e]??e;function Ku(e,t=!1){let n=e[0].index!==null,r=new Set(Object.keys(e[0].attributes)),i=new Set(Object.keys(e[0].morphAttributes)),a={},o={},s=e[0].morphTargetsRelative,c=new lr,l=0;for(let u=0;u<e.length;++u){let d=e[u],f=0;if(n!==(d.index!==null))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.`),null;for(let e in d.attributes){if(!r.has(e))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure "`+e+`" attribute exists among all geometries, or in none of them.`),null;a[e]===void 0&&(a[e]=[]),a[e].push(d.attributes[e]),f++}if(f!==r.size)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. Make sure all geometries have the same number of attributes.`),null;if(s!==d.morphTargetsRelative)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. .morphTargetsRelative must be consistent throughout all geometries.`),null;for(let e in d.morphAttributes){if(!i.has(e))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`.  .morphAttributes must be consistent throughout all geometries.`),null;o[e]===void 0&&(o[e]=[]),o[e].push(d.morphAttributes[e])}if(t){let e;if(n)e=d.index.count;else if(d.attributes.position!==void 0)e=d.attributes.position.count;else return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. The geometry must have either an index or a position attribute`),null;c.addGroup(l,e,u),l+=e}}if(n){let t=0,n=[];for(let r=0;r<e.length;++r){let i=e[r].index;for(let e=0;e<i.count;++e)n.push(i.getX(e)+t);t+=e[r].attributes.position.count}c.setIndex(n)}for(let e in a){let t=qu(a[e]);if(!t)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` attribute.`),null;c.setAttribute(e,t)}for(let e in o){let t=o[e][0].length;if(t!==0){c.morphAttributes=c.morphAttributes||{},c.morphAttributes[e]=[];for(let n=0;n<t;++n){let t=[];for(let r=0;r<o[e].length;++r)t.push(o[e][r][n]);let r=qu(t);if(!r)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` morphAttribute.`),null;c.morphAttributes[e].push(r)}}}return c}function qu(e){let t,n,r,i=-1,a=0;for(let o=0;o<e.length;++o){let s=e[o];if(t===void 0&&(t=s.array.constructor),t!==s.array.constructor)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes.`),null;if(n===void 0&&(n=s.itemSize),n!==s.itemSize)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes.`),null;if(r===void 0&&(r=s.normalized),r!==s.normalized)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes.`),null;if(i===-1&&(i=s.gpuType),i!==s.gpuType)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes.`),null;a+=s.count*n}let o=new t(a),s=new Jn(o,n,r),c=0;for(let t=0;t<e.length;++t){let r=e[t];if(r.isInterleavedBufferAttribute){let e=c/n;for(let t=0,i=r.count;t<i;t++)for(let i=0;i<n;i++){let n=r.getComponent(t,i);s.setComponent(t+e,i,n)}}else o.set(r.array,c);c+=r.count*n}return i!==void 0&&(s.gpuType=i),s}var Ju=new K;function Q(e,t,n={}){let r=e.index?e.toNonIndexed():e,i=new Mt().compose(new U(...n.pos??[0,0,0]),new ut().setFromEuler(new Ht(...n.rot??[0,0,0])),new U(...n.scale??[1,1,1]));return r.applyMatrix4(i),Yu(r,t),r.deleteAttribute(`uv`),r}function Yu(e,t){Ju.setHex(t);let n=e.getAttribute(`position`).count,r=new Float32Array(n*3);for(let e=0;e<n;e++)r[e*3]=Ju.r,r[e*3+1]=Ju.g,r[e*3+2]=Ju.b;return e.setAttribute(`color`,new Jn(r,3)),e}function Xu(e,t){let n=e.getAttribute(`position`),r=e.getAttribute(`normal`),i=e.getAttribute(`color`);Ju.setHex(t);for(let e=0;e<n.count;e++)r.getY(e)>.9&&i.setXYZ(e,Ju.r,Ju.g,Ju.b);return e}function Zu(e){let t=Ku(e,!1);if(!t)throw Error(`모델 합치기 실패`);for(let t of e)t.dispose();return t}function Qu(e,t=[!1,!1,!1,!1]){let n=6975612,r=3817032,i=(e,t=.2)=>Q(new mi(.28,.5,3),e,{pos:[0,t,.45],rot:[Math.PI/2,0,0],scale:[1,1,.3]});switch(e){case`belt`:return Zu([Q(new J(1.8,.16,2),r,{pos:[0,.08,0]}),Q(new J(1.4,.04,2),2763826,{pos:[0,.17,0]}),Q(new J(.12,.24,2),14725184,{pos:[.85,.12,0]}),Q(new J(.12,.24,2),14725184,{pos:[-.85,.12,0]}),Q(new mi(.3,.5,3),9080729,{pos:[0,.2,.2],rot:[Math.PI/2,0,0],scale:[1,1,.15]})]);case`splitter`:return Zu([Q(new J(1.8,.3,1.8),n,{pos:[0,.15,0]}),Q(new pi(.4,.5,.4,6),14725184,{pos:[0,.5,0]}),i(16777215,.35),Q(new mi(.2,.4,3),16777215,{pos:[.5,.35,0],rot:[0,0,-Math.PI/2],scale:[1,1,.3]}),Q(new mi(.2,.4,3),16777215,{pos:[-.5,.35,0],rot:[0,0,Math.PI/2],scale:[1,1,.3]})]);case`wire`:{let e=[Q(new pi(.1,.14,.9,6),6965802,{pos:[0,.45,0]}),Q(new J(.3,.14,.3),14715472,{pos:[0,.9,0]})],n=[[1,0],[0,1],[-1,0],[0,-1]];return t.forEach((t,r)=>{if(!t)return;let[i,a]=n[r];e.push(Q(new J(i?1:.08,.08,a?1:.08),14715472,{pos:[i*.5,.85,a*.5]}))}),Zu(e)}case`generator`:return Zu([Q(new J(1.7,.4,1.7),r,{pos:[0,.2,0]}),Q(new pi(.6,.7,1.1,8),n,{pos:[0,.95,0]}),Q(new Si(.62,.08,4,10),5949695,{pos:[0,.8,0],rot:[Math.PI/2,0,0]}),Q(new Si(.62,.08,4,10),5949695,{pos:[0,1.2,0],rot:[Math.PI/2,0,0]}),Q(new vi(.35),8382719,{pos:[0,1.85,0]})]);case`box`:return Zu([Q(new J(1.6,1,1.6),10119740,{pos:[0,.5,0]}),Q(new J(1.66,.12,1.66),6964264,{pos:[0,1.02,0]}),Q(new J(1.66,.1,.12),9213603,{pos:[0,.3,.78]}),Q(new J(1.66,.1,.12),9213603,{pos:[0,.75,.78]}),Q(new J(.2,.2,.06),15253834,{pos:[0,.55,.82]}),i(15253834,1.15)]);case`smelter`:return Zu([Q(new J(1.7,1.2,1.7),9062970,{pos:[0,.6,0]}),Q(new J(.9,.5,.1),16742954,{pos:[0,.5,.86]}),Q(new pi(.25,.3,1.2,6),5917252,{pos:[.5,1.7,-.4]}),i(16777215,1.25)]);case`crusher`:return Zu([Q(new J(1.7,.9,1.7),n,{pos:[0,.45,0]}),Q(new pi(.35,.35,1.4,8),10133674,{pos:[0,1.15,.1],rot:[0,0,Math.PI/2]}),Q(new J(1.2,.5,.6),r,{pos:[0,1.2,-.5]}),i(16777215,.95)]);case`infuser`:return Zu([Q(new J(1.7,.6,1.7),r,{pos:[0,.3,0]}),Q(new pi(.5,.6,.9,8),9071359,{pos:[0,1.05,0]}),Q(new vi(.28),14201087,{pos:[0,1.8,0]}),Q(new J(.12,1.4,.12),n,{pos:[.7,1,.7]}),Q(new J(.12,1.4,.12),n,{pos:[-.7,1,-.7]}),i(16777215,.65)]);case`assembler`:return Zu([Q(new J(1.8,1.1,1.8),4885114,{pos:[0,.55,0]}),Q(new J(1.2,.3,1.2),r,{pos:[0,1.25,0]}),Q(new J(.15,.8,.15),n,{pos:[.4,1.6,0],rot:[0,0,.4]}),Q(new J(.6,.12,.12),n,{pos:[.1,1.95,0]}),i(16777215,1.15)]);case`alchemy`:return Zu([Q(new pi(.75,.6,.9,8),3816e3,{pos:[0,.45,0]}),Q(new pi(.66,.66,.08,8),8060810,{pos:[0,.9,0]}),Q(new J(.1,.4,.1),n,{pos:[.6,.2,.6]}),Q(new J(.1,.4,.1),n,{pos:[-.6,.2,-.6]}),i(16777215,.3)])}}var $u=new Map,ed=null;function td(e){let t=$u.get(e);if(t)return t;try{ed??=new sl({alpha:!0,antialias:!0,preserveDrawingBuffer:!0}),ed.setSize(96,96,!1),ed.setPixelRatio(1),ed.setClearColor(0,0);let t=new hn;t.add(new ba(16777215,1.4));let n=new ya(16777215,2.2);n.position.set(-3,6,4),t.add(n);let r=Qu(e,e===`wire`?[!0,!1,!0,!1]:void 0),i=new q(r,new Ni({vertexColors:!0,flatShading:!0}));t.add(i);let a=new _a(-1.6,1.6,1.6,-1.6,.1,50);a.position.set(6,6.5,6),a.lookAt(0,.7,0),ed.render(t,a);let o=ed.domElement.toDataURL();return r.dispose(),i.material.dispose(),$u.set(e,o),o}catch{return``}}var nd=[`→`,`↓`,`←`,`↑`],rd=class{handlers;root;info;tool=`belt`;dir=0;constructor(e,t){this.handlers=t,this.root=document.createElement(`div`),this.root.className=`buildbar hidden`,e.appendChild(this.root),this.info=document.createElement(`div`),this.info.className=`build-info`}show(e){let t=Il.filter(e).map(e=>{let t=Fl[e],n=td(e);return`<button class="tool" data-tool="${e}" style="--c:${Pu(t.color)}">${n?`<img src="${n}" alt="">`:`<i></i>`}<span>${t.name}</span></button>`}).join(``);this.root.innerHTML=`
      <div class="build-top">
        <button class="tool-sm" data-act="rotate">회전 <b class="dir">${nd[this.dir]}</b></button>
        <button class="tool-sm danger" data-tool="remove">철거</button>
        <button class="tool-sm" data-act="expand">확장</button>
        <button class="tool-sm primary" data-act="done">완료</button>
      </div>
      <div class="build-tools">${t}</div>`,this.root.prepend(this.info),this.root.classList.remove(`hidden`),this.root.querySelectorAll(`[data-tool]`).forEach(e=>e.addEventListener(`click`,()=>{this.handlers.click(),this.select(e.dataset.tool)})),this.root.querySelector(`[data-act="rotate"]`).addEventListener(`click`,()=>{this.handlers.click(),this.dir=(this.dir+1)%4,this.root.querySelector(`.dir`).textContent=nd[this.dir],this.refreshInfo()}),this.root.querySelector(`[data-act="done"]`).addEventListener(`click`,()=>this.handlers.onDone()),this.root.querySelector(`[data-act="expand"]`).addEventListener(`click`,()=>this.handlers.onExpand()),this.select(this.tool)}hide(){this.root.classList.add(`hidden`)}select(e){this.tool=e,this.root.querySelectorAll(`[data-tool]`).forEach(t=>t.classList.toggle(`on`,t.dataset.tool===e)),this.refreshInfo(),this.handlers.onChange()}refreshInfo(){if(this.tool===`remove`)this.info.innerHTML=`<b>철거</b> · 누른 건물을 없애고 재료를 돌려받습니다`;else{let e=Fl[this.tool],t=Object.entries(e.cost).map(([e,t])=>`${Z[e].name} ${t}`).join(`, `),n=this.tool===`belt`||this.tool===`wire`?` · 끌어서 이어 깔기`:` · 방향 ${nd[this.dir]} · 누른 채 움직여 위치 잡기`;this.info.innerHTML=`<b>${e.name}</b>${e.power?` · 전력 ${e.type===`generator`?`+`:`-`}${e.power}`:``} · ${t||`무료`}${n}<br><small>${e.description}</small>`}}},id=class{handlers;root;box;nameEl;textEl;choicesEl;fade;card;queue=[];typing=0;fullText=``;shown=0;waitingChoice=!1;onDone=null;active=!1;constructor(e,t){this.handlers=t,this.root=document.createElement(`div`),this.root.className=`dialogue hidden`,this.root.innerHTML=`
      <div class="dlg-fade"></div>
      <div class="dlg-card"></div>
      <div class="dlg-box">
        <div class="dlg-name"></div>
        <div class="dlg-text"></div>
        <div class="dlg-choices"></div>
        <div class="dlg-next">▼</div>
      </div>
      <button class="dlg-skip">건너뛰기 ▶▶</button>`,e.appendChild(this.root),this.box=this.root.querySelector(`.dlg-box`),this.nameEl=this.root.querySelector(`.dlg-name`),this.textEl=this.root.querySelector(`.dlg-text`),this.choicesEl=this.root.querySelector(`.dlg-choices`),this.fade=this.root.querySelector(`.dlg-fade`),this.card=this.root.querySelector(`.dlg-card`),this.root.addEventListener(`pointerup`,e=>{e.target.closest(`button`)||this.advance()}),this.root.querySelector(`.dlg-skip`).addEventListener(`click`,()=>this.skip())}play(e,t){this.playSteps(Hl[e]??[],t)}playSteps(e,t){if(!e.length){t?.();return}this.queue=[...e],this.onDone=t??null,this.active=!0,this.root.classList.remove(`hidden`),this.fade.className=`dlg-fade`,this.next()}next(){window.clearInterval(this.typing),this.card.classList.remove(`show`);let e=this.queue.shift();if(!e)return this.finish();`s`in e?(this.box.classList.add(`show`),this.box.classList.toggle(`narration`,e.s===``),this.nameEl.textContent=e.s,this.choicesEl.innerHTML=``,this.fullText=e.t,this.shown=0,this.textEl.textContent=``,this.typing=window.setInterval(()=>{this.shown++,this.textEl.textContent=this.fullText.slice(0,this.shown),this.shown>=this.fullText.length&&window.clearInterval(this.typing)},28)):`choice`in e?(this.waitingChoice=!0,this.box.classList.add(`show`),this.choicesEl.innerHTML=e.choice.map((e,t)=>`<button data-i="${t}">${e.text}</button>`).join(``),this.choicesEl.querySelectorAll(`button`).forEach(t=>t.addEventListener(`click`,()=>{this.handlers.click(),this.waitingChoice=!1;let n=e.choice[Number(t.dataset.i)];this.queue=[...Hl[n.next]??[]],this.choicesEl.innerHTML=``,this.next()}))):`fx`in e?(e.fx===`fadeOut`?this.fade.className=`dlg-fade black`:e.fx===`fadeIn`?this.fade.className=`dlg-fade`:e.fx===`flash`?(this.fade.className=`dlg-fade white`,window.setTimeout(()=>this.fade.className=this.fade.className.replace(` white`,``),350)):e.fx===`shake`&&this.handlers.shake(),window.setTimeout(()=>this.next(),e.fx===`flash`?400:250)):`title`in e?(this.box.classList.remove(`show`),this.card.innerHTML=`<h2>${e.title}</h2>${e.sub?`<p>${e.sub}</p>`:``}`,this.card.classList.add(`show`)):`set`in e?(this.handlers.set(e.set,e.v??1),this.next()):`run`in e&&(this.handlers.run(e.run),this.next())}advance(){if(this.active&&!this.waitingChoice){if(this.shown<this.fullText.length&&this.box.classList.contains(`show`)&&this.textEl.textContent!==this.fullText){window.clearInterval(this.typing),this.shown=this.fullText.length,this.textEl.textContent=this.fullText;return}this.handlers.click(),this.next()}}skip(){for(window.clearInterval(this.typing);this.queue.length;){let e=this.queue[0];if(`choice`in e){this.next();return}this.queue.shift(),`set`in e&&this.handlers.set(e.set,e.v??1),`run`in e&&this.handlers.run(e.run)}this.waitingChoice||this.finish()}finish(){window.clearInterval(this.typing),this.active=!1,this.fullText=``,this.box.classList.remove(`show`),this.card.classList.remove(`show`),this.fade.className=`dlg-fade`,this.root.classList.add(`hidden`);let e=this.onDone;this.onDone=null,e?.()}},ad=56,od=.12,sd=class{zone;input;base;knob;pointerId=null;origin={x:0,y:0};constructor(e,t){this.zone=e,this.input=t,this.base=document.createElement(`div`),this.base.className=`joy-base`,this.knob=document.createElement(`div`),this.knob.className=`joy-knob`,this.base.appendChild(this.knob),e.appendChild(this.base),this.reset(),e.addEventListener(`pointerdown`,e=>this.onDown(e)),e.addEventListener(`pointermove`,e=>this.onMove(e)),e.addEventListener(`pointerup`,e=>this.onUp(e)),e.addEventListener(`pointercancel`,e=>this.onUp(e))}onDown(e){if(this.pointerId!==null||e.pointerType===`mouse`)return;e.preventDefault(),this.pointerId=e.pointerId,this.zone.setPointerCapture(e.pointerId);let t=this.zone.getBoundingClientRect();this.origin={x:Math.max(t.left+ad+8,Math.min(e.clientX,t.right-ad-8)),y:Math.max(t.top+ad+8,Math.min(e.clientY,t.bottom-ad-8))},this.base.classList.add(`active`),this.place(this.origin.x-t.left,this.origin.y-t.top),this.update(e.clientX,e.clientY)}onMove(e){e.pointerId===this.pointerId&&(e.preventDefault(),this.update(e.clientX,e.clientY))}onUp(e){e.pointerId===this.pointerId&&(this.pointerId=null,this.reset())}update(e,t){let n=e-this.origin.x,r=t-this.origin.y,i=Math.hypot(n,r);i>ad&&(n=n/i*ad,r=r/i*ad),this.knob.style.transform=`translate(${n}px, ${r}px)`;let a=Math.min(1,i/ad);if(a<od){this.input.stickX=0,this.input.stickY=0;return}let o=(a-od)/.88;this.input.stickX=n/(i||1)*o,this.input.stickY=-r/(i||1)*o}reset(){this.input.stickX=0,this.input.stickY=0,this.base.classList.remove(`active`),this.knob.style.transform=`translate(0px, 0px)`;let e=this.zone.getBoundingClientRect(),t=parseFloat(getComputedStyle(document.documentElement).getPropertyValue(`--safe-left`))||0;this.place(92+t,e.height-ad-30)}place(e,t){this.base.style.left=`${e-ad}px`,this.base.style.top=`${t-ad}px`}},$=(e,t=``,n=``)=>{let r=document.createElement(e);return t&&(r.className=t),n&&(r.innerHTML=n),r},cd=class{input;onPress;root;joystick;portrait;hpFill;hpText;mpFill;mpText;expFill;lvText;goldEl;locationEl;objectiveEl;bossEl;bossFill;bossName;minimapSlot;attackBtn;interactBtn;interactLabel;bigMapEl;bubbleLayer;bubblePool=[];attackIcon;attackLabel;dodgeShade;skillBtns=[];skillShades=[];skillLabels=[];potionBtn;potionCount;bagBtn;bagCount;invBtn;buildBtn;toastEl;floatLayer;labelLayer;labelPool=[];toastTimer=0;lastInteract=``;lastBars=``;constructor(e,t,n){this.input=t,this.onPress=n,this.root=$(`div`,`hud`),e.appendChild(this.root);let r=$(`div`,`joy-zone`);this.root.appendChild(r),this.joystick=new sd(r,t),this.labelLayer=$(`div`,`label-layer`),this.floatLayer=$(`div`,`float-layer`),this.bubbleLayer=$(`div`,`bubble-layer`),this.root.append(this.labelLayer,this.bubbleLayer,this.floatLayer);let i=$(`div`,`status`);this.portrait=$(`div`,`portrait`,`검`);let a=$(`div`,`bars`),o=e=>{let t=$(`div`,`bar ${e}`),n=$(`div`,`fill`),r=$(`span`);return t.append(n,r),a.appendChild(t),[n,r]};[this.hpFill,this.hpText]=o(`hp`),[this.mpFill,this.mpText]=o(`mp`);let s=$(`div`,`bar exp`);this.expFill=$(`div`,`fill`),this.lvText=$(`span`),s.append(this.expFill,this.lvText),a.appendChild(s),i.append(this.portrait,a),this.locationEl=$(`div`,`tier-label`),this.goldEl=$(`div`,`gold-label`);let c=$(`div`,`info-row`);c.append(this.locationEl,this.goldEl),i.appendChild(c),this.objectiveEl=$(`div`,`objective`),i.appendChild(this.objectiveEl),this.root.appendChild(i),this.bossEl=$(`div`,`boss-bar hidden`),this.bossName=$(`div`,`boss-name`);let l=$(`div`,`boss-track`);this.bossFill=$(`div`,`boss-fill`),l.appendChild(this.bossFill),this.bossEl.append(this.bossName,l),this.root.appendChild(this.bossEl);let u=$(`div`,`top-right`);this.minimapSlot=$(`div`,`minimap-slot`),this.minimapSlot.addEventListener(`pointerdown`,e=>{e.preventDefault(),t.press(`map`)});let d=$(`div`,`menu-col`);this.bagBtn=this.button(`icon-btn`,Nu.bag,`bag`),this.bagCount=$(`span`,`badge`),this.bagBtn.appendChild(this.bagCount),this.invBtn=this.button(`icon-btn`,Nu.person,`bag`),this.buildBtn=this.button(`icon-btn build-btn`,Nu.hammer,`build`),d.append(this.button(`icon-btn`,Nu.pause,`pause`),this.bagBtn,this.invBtn,this.buildBtn),u.append(this.minimapSlot,d),this.root.appendChild(u);let f=$(`div`,`actions`);this.attackBtn=$(`button`,`act attack`),this.attackIcon=$(`span`,`ico`,Nu.sword),this.attackLabel=$(`span`,`lbl`,`공격`),this.attackBtn.append(this.attackIcon,this.attackLabel),this.attackBtn.addEventListener(`pointerdown`,e=>{e.preventDefault(),this.attackBtn.setPointerCapture(e.pointerId),t.attackButtonHeld=!0,t.press(`attack`),this.attackBtn.classList.add(`down`),this.onPress()});let p=()=>{t.attackButtonHeld=!1,this.attackBtn.classList.remove(`down`)};this.attackBtn.addEventListener(`pointerup`,p),this.attackBtn.addEventListener(`pointercancel`,p),this.interactBtn=this.button(`act interact-btn hidden`,Nu.hand,`interact`),this.interactLabel=$(`span`,`lbl`),this.interactBtn.appendChild(this.interactLabel);let m=this.button(`act dodge`,Nu.dodge,`dodge`);this.dodgeShade=$(`div`,`cooldown`),m.appendChild(this.dodgeShade);for(let e=0;e<3;e++){let t=this.button(`act skill s${e+1}`,``,`skill${e+1}`),n=$(`span`,`skill-name`),r=$(`div`,`cooldown`);t.append(n,r),this.skillBtns.push(t),this.skillLabels.push(n),this.skillShades.push(r)}this.potionBtn=this.button(`act potion`,Nu.potion,`potion`),this.potionCount=$(`span`,`badge`),this.potionBtn.appendChild(this.potionCount),f.append(this.attackBtn,this.interactBtn,m,...this.skillBtns,this.potionBtn),this.root.appendChild(f),this.bigMapEl=$(`div`,`bigmap-wrap hidden`),this.bigMapEl.addEventListener(`pointerdown`,e=>{e.preventDefault(),t.press(`map`)}),this.root.appendChild(this.bigMapEl),this.toastEl=$(`div`,`toast`),this.root.appendChild(this.toastEl),this.root.addEventListener(`contextmenu`,e=>e.preventDefault())}button(e,t,n){let r=$(`button`,e,t);r.addEventListener(`pointerdown`,e=>{e.preventDefault(),this.input.press(n),r.classList.add(`down`),this.onPress()});let i=()=>r.classList.remove(`down`);return r.addEventListener(`pointerup`,i),r.addEventListener(`pointerleave`,i),r.addEventListener(`pointercancel`,i),r}setVisible(e){this.root.classList.toggle(`hidden`,!e),e||(this.joystick.reset(),this.input.attackButtonHeld=!1)}setMode(e){this.root.dataset.mode=e}setBuilding(e){this.root.classList.toggle(`building`,e)}setClass(e,t,n){this.portrait.textContent=e,this.portrait.style.background=`linear-gradient(160deg, ${t}, #1c2240)`,n.forEach((e,t)=>this.skillLabels[t].textContent=e)}setBars(e,t,n,r,i,a,o){let s=`${Math.ceil(e)}|${t}|${Math.floor(n)}|${r}|${i}|${a}|${o}`;s!==this.lastBars&&(this.lastBars=s,this.hpFill.style.width=`${e/t*100}%`,this.hpText.textContent=`${Math.ceil(e)} / ${t}`,this.mpFill.style.width=`${n/r*100}%`,this.mpText.textContent=`${Math.floor(n)} / ${r}`,this.expFill.style.width=`${Math.min(100,i/a*100)}%`,this.lvText.textContent=`Lv.${o}`,this.hpFill.parentElement.classList.toggle(`low`,e/t<.3))}setGold(e){this.goldEl.textContent=`${e.toLocaleString()} G`}setLocation(e,t){this.locationEl.innerHTML=`<i style="background:#${t.toString(16).padStart(6,`0`)}"></i>${e}`}setObjective(e){this.objectiveEl.textContent=e?`▶ ${e}`:``,this.objectiveEl.classList.toggle(`hidden`,!e)}setBoss(e,t=1){this.bossEl.classList.toggle(`hidden`,!e),e&&(this.bossName.textContent=e,this.bossFill.style.width=`${Math.max(0,t)*100}%`)}setMinimap(e){this.minimapSlot.replaceChildren(...e?[e]:[])}setInteract(e){e!==this.lastInteract&&(this.lastInteract=e,this.interactBtn.classList.toggle(`hidden`,e===null),e&&(this.interactLabel.textContent=e),this.attackIcon,this.attackLabel)}showBigMap(e){this.bigMapEl.classList.toggle(`hidden`,!e),this.bigMapEl.replaceChildren(...e?[e,Object.assign($(`div`,`bigmap-hint`),{textContent:`M 또는 화면을 눌러 닫기`})]:[])}setBubbles(e){for(;this.bubblePool.length<e.length;){let e=$(`button`,`prod-bubble`);e.innerHTML=`<i></i><span class="bar"><span></span></span>`,e.addEventListener(`pointerdown`,t=>{t.preventDefault(),t.stopPropagation(),e.cb?.()}),this.bubbleLayer.appendChild(e),this.bubblePool.push(e)}this.bubblePool.forEach((t,n)=>{let r=e[n];if(!r){t.style.display=`none`;return}t.style.display=``,t.cb=r.onClick,t.style.transform=`translate(${r.x}px, ${r.y}px) translate(-50%, -100%)`,t.firstElementChild.style.background=r.color,t.querySelector(`.bar span`).style.width=`${Math.round(r.progress*100)}%`})}setDodgeCooldown(e){this.dodgeShade.style.transform=`scaleY(${e})`}setSkills(e,t){e.forEach((e,n)=>{this.skillShades[n].style.transform=`scaleY(${e})`,this.skillBtns[n].classList.toggle(`no-mp`,!t[n])})}setPotions(e){this.potionCount.textContent=String(e),this.potionBtn.classList.toggle(`empty`,e===0)}setBagCount(e,t){this.bagCount.textContent=`${e}/${t}`,this.bagCount.classList.toggle(`full`,e>=t)}setLabels(e){for(;this.labelPool.length<e.length;){let e=$(`div`,`name-label`);this.labelLayer.appendChild(e),this.labelPool.push(e)}this.labelPool.forEach((t,n)=>{let r=e[n];if(!r){t.style.display=`none`;return}t.style.display=``,t.textContent!==r.text&&(t.textContent=r.text),t.classList.toggle(`accent`,!!r.accent),t.style.transform=`translate(${r.x}px, ${r.y}px) translate(-50%, -100%)`})}toast(e,t=1800){this.toastEl.textContent=e,this.toastEl.classList.add(`show`),window.clearTimeout(this.toastTimer),this.toastTimer=window.setTimeout(()=>this.toastEl.classList.remove(`show`),t)}floatText(e,t,n,r,i=`normal`){this.floatLayer.childElementCount>40&&this.floatLayer.firstElementChild?.remove();let a=$(`div`,`float-text ${i}`);a.textContent=n,a.style.left=`${e+(Math.random()-.5)*20}px`,a.style.top=`${t}px`,a.style.color=r,a.addEventListener(`animationend`,()=>a.remove()),this.floatLayer.appendChild(a)}},ld=5,ud=30,dd=class{data;canvas;bigCanvas;explored;constructor(e,t){this.data=e,this.canvas=document.createElement(`canvas`),this.canvas.className=`minimap`,this.bigCanvas=document.createElement(`canvas`),this.bigCanvas.className=`bigmap`,this.explored=new Uint8Array(e.width*e.height).fill(+!t)}fit(e){let t=e.clientWidth||140,n=Math.round(t*Math.min(window.devicePixelRatio||1,2));return e.width!==n&&(e.width=e.height=n),n}reveal(e,t){let{width:n,height:r,roomIndex:i,rooms:a}=this.data,o=Math.floor(e/2),s=Math.floor(t/2);for(let e=s-ld;e<=s+ld;e++)for(let t=o-ld;t<=o+ld;t++)t<0||e<0||t>=n||e>=r||(t-o)**2+(e-s)**2<=ld**2&&(this.explored[e*n+t]=1);let c=o>=0&&s>=0&&o<n&&s<r?i[s*n+o]:-1;if(c>=0){let e=a[c];for(let t=e.y-1;t<=e.y+e.h;t++)for(let r=e.x-1;r<=e.x+e.w;r++)this.explored[t*n+r]=1}}isExplored(e,t){return this.explored[t*this.data.width+e]===1}draw(e,t,n=!1){let r=n?this.bigCanvas:this.canvas,i=this.fit(r),a=r.getContext(`2d`),{width:o,height:s}=this.data;a.setTransform(1,0,0,1,0,0),a.clearRect(0,0,i,i);let c=i/2-2;a.beginPath(),a.moveTo(i/2,2),a.lineTo(i-2,i/2),a.lineTo(i/2,i-2),a.lineTo(2,i/2),a.closePath(),a.fillStyle=n?`rgba(8, 10, 24, 0.85)`:`rgba(8, 10, 24, 0.6)`,a.fill(),a.lineWidth=Math.max(1,i/110),a.strokeStyle=`rgba(200, 210, 255, 0.35)`,a.stroke(),a.save(),a.clip();let l=n?(o+s)*.72:ud,u=n?o/2:e.x/2,d=n?s/2:e.z/2,f=c*Math.SQRT2/l;a.translate(i/2,i/2),a.rotate(Math.PI/4),a.scale(f,f),a.translate(-u,-d),a.fillStyle=`rgba(210, 220, 240, 0.8)`;for(let e=0;e<s;e++)for(let t=0;t<o;t++)this.explored[e*o+t]&&Zl(this.data,t,e)&&a.fillRect(t,e,1.02,1.02);let p=[];for(let e of t){let t=e.x/2,r=e.z/2;this.explored[Math.floor(r)*o+Math.floor(t)]&&(a.fillStyle=e.color,a.beginPath(),a.arc(t,r,e.size*(n?1.2:1),0,Math.PI*2),a.fill(),n&&e.label&&p.push({x:t,y:r,text:e.label}))}let m=e.x/2,h=e.z/2;a.save(),a.translate(m,h),a.rotate(-e.facing);let g=n?1.4:1;a.fillStyle=`#4fd1ff`,a.strokeStyle=`#0b1a2a`,a.lineWidth=.3,a.beginPath(),a.moveTo(0,1.4*g),a.lineTo(.95*g,-.9*g),a.lineTo(0,-.4*g),a.lineTo(-.95*g,-.9*g),a.closePath(),a.fill(),a.stroke(),a.restore();let _=a.getTransform();if(a.restore(),p.length){a.font=`${Math.round(i/40)}px sans-serif`,a.textAlign=`center`,a.fillStyle=`#fff`,a.strokeStyle=`rgba(0,0,0,0.8)`,a.lineWidth=3;for(let e of p){let t=_.a*e.x+_.c*e.y+_.e,n=_.b*e.x+_.d*e.y+_.f;a.strokeText(e.text,t,n-i/50),a.fillText(e.text,t,n-i/50)}}}},fd=class{slots;constructor(e,t){this.slots=t??Array.from({length:e},()=>null)}add(e,t){let n=t;for(let t of this.slots){if(n===0)break;if(t&&!t.equip&&t.itemId===e&&t.count<50){let e=Math.min(n,50-t.count);t.count+=e,n-=e}}for(let t=0;t<this.slots.length&&n>0;t++)if(!this.slots[t]){let r=Math.min(n,50);this.slots[t]={itemId:e,count:r},n-=r}return t-n}addEquip(e){let t=this.slots.indexOf(null);return t<0?!1:(this.slots[t]={itemId:`equip`,count:1,equip:e},!0)}moveTo(e,t){let n=this.slots[e];if(!n)return 0;if(n.equip)return t.addEquip(n.equip)?(this.slots[e]=null,1):0;let r=t.add(n.itemId,n.count);return n.count-=r,n.count===0&&(this.slots[e]=null),r}get used(){return this.slots.filter(Boolean).length}clear(){this.slots.fill(null)}totals(){let e=new Map;for(let t of this.slots)t&&!t.equip&&e.set(t.itemId,(e.get(t.itemId)??0)+t.count);return e}equips(){return this.slots.filter(e=>!!e?.equip).map(e=>e.equip)}},pd={sword:14675967,mage:10479871,archer:13172656},md=class{host;combo=0;comboTimer=0;cooldowns=[0,0,0];constructor(e){this.host=e}update(e){this.comboTimer=Math.max(0,this.comboTimer-e),this.comboTimer===0&&(this.combo=0);for(let t=0;t<3;t++)this.cooldowns[t]=Math.max(0,this.cooldowns[t]-e)}findTarget(e){let t=this.host.player.position,n=this.host.dungeon();if(!n)return null;let r=null,i=e;for(let e of n.monsters){if(!e.alive)continue;let n=Math.hypot(e.x-t.x,e.z-t.z)-e.radius;n<i&&(i=n,r={kind:`monster`,m:e,x:e.x,z:e.z})}return r}angleTo(e){if(!e)return null;let t=this.host.player.position;return Math.atan2(e.x-t.x,e.z-t.z)}arcHit(e,t,n,r){let i=this.host.player.position,a=this.host.player.facing,o=Math.sin(a),s=Math.cos(a),c=0,l=this.host.dungeon();if(!l)return 0;let u=(n,r,a)=>{let c=n-i.x,l=r-i.z,u=Math.hypot(c,l);return u-a>e?!1:u<a+.4||(c*o+l*s)/u>=Math.cos(t/2)};for(let e of l.monsters)e.alive&&u(e.x,e.z,e.radius)&&(this.host.damageMonster(e,n,r,i.x,i.z),c++);return c>0&&(this.host.hitStop(.045),this.host.shake(.15)),c}basicAttack(){let e=this.host.player;if(!e.canAct)return;let t=e.cls.id,n=t!==`sword`,r=this.findTarget(n?11:4.5),i=this.host.level(),a=pd[t],o=this.host.stats().speed;if(t===`sword`||!this.host.dungeon()){let n=t===`sword`?this.combo:0,s=n===2;e.startAction({pose:t===`sword`?`swing`:`thrust`,combo:n,duration:e.cls.attackTime*(s?1.25:1)/o,hitAt:.45,onHit:()=>{let t=s?2.9:2.3;i.effects.slash(e.position.x,e.position.z,e.facing,t,a,s?3:2.2),this.host.sfx(`swing`),this.arcHit(t,s?3:2.3,s?1.7:n===1?1.1:1,s?1.6:.6)}},this.angleTo(r)),t===`sword`&&(this.combo=(this.combo+1)%3,this.comboTimer=.9);return}let s=this.host.dungeon(),c=this.angleTo(r)??e.facing;t===`mage`?e.startAction({pose:`cast`,duration:e.cls.attackTime/o,hitAt:.5,onHit:()=>{this.host.sfx(`magic`),s.spawnPlayerProjectile({x:e.position.x,z:e.position.z,angle:e.facing,speed:17,damage:1,color:a,kind:`orb`,radius:.35,y:1.2})}},c):e.startAction({pose:`shoot`,duration:e.cls.attackTime/o,hitAt:.55,onHit:()=>{this.host.sfx(`bow`),s.spawnPlayerProjectile({x:e.position.x,z:e.position.z,angle:e.facing,speed:26,damage:.95,color:a,kind:`arrow`,radius:.3,y:1.1})}},c)}useSkill(e){let t=this.host.player,n=t.cls.skills[e],r=this.host.dungeon();if(!r)return`스킬은 던전에서만 쓸 수 있습니다`;if(this.cooldowns[e]>0||!t.canAct&&t.state!==`dash`)return null;if(t.mp<n.mp)return`MP가 부족합니다`;t.mp-=n.mp,this.cooldowns[e]=n.cooldown;let i=t.position,a=this.findTarget(12),o=this.angleTo(a)??t.facing,s=pd[t.cls.id],c=()=>Math.sin(t.facing),l=()=>Math.cos(t.facing);switch(`${t.cls.id}:${e}`){case`sword:0`:{t.facing=o;let e=new Set;t.startDash({dirX:Math.sin(o),dirZ:Math.cos(o),speed:20,duration:.28,pose:`lunge`,invuln:!0,onStep:()=>{for(let n of r.monsters)n.alive&&!e.has(n)&&Math.hypot(n.x-i.x,n.z-i.z)<n.radius+1.3&&(e.add(n),this.host.damageMonster(n,2.2,1.2,i.x,i.z),r.effects.slash(n.x,n.z,t.facing+Math.PI/2,1.6,s,1.6))},onEnd:()=>{e.size&&this.host.shake(.2)}}),this.host.sfx(`dash`);break}case`sword:1`:t.startAction({pose:`spin`,duration:.45,hitAt:.5,moveMult:.5,onHit:()=>{r.effects.ring(i.x,i.z,3.4,s,.3,.8),r.effects.slash(i.x,i.z,t.facing,3.2,s,Math.PI*2),this.host.sfx(`swing`),this.arcHit(3.2,Math.PI*2,2.4,1.4)}},null);break;case`sword:2`:t.startAction({pose:`swing`,combo:2,duration:.5,hitAt:.5,onHit:()=>{this.host.shake(.25),this.host.sfx(`slam`),r.spawnPlayerProjectile({x:i.x,z:i.z,angle:t.facing,speed:16,damage:3,color:s,kind:`wave`,radius:.9,pierce:99,life:.6,knock:1.5,y:.2})}},o);break;case`mage:0`:t.startAction({pose:`cast`,duration:.45,hitAt:.5,onHit:()=>{this.host.sfx(`magic`),r.spawnPlayerProjectile({x:i.x,z:i.z,angle:t.facing,speed:13,damage:1.2,color:16742960,kind:`orb`,radius:.45,y:1.2,onEnd:(e,t)=>{r.effects.ring(e,t,3,16747072,.35),r.particles.burst(e,.6,t,16747072,14,1.3),this.host.sfx(`boom`),this.host.shake(.2);for(let n of r.monsters)n.alive&&Math.hypot(n.x-e,n.z-t)<2.8+n.radius&&this.host.damageMonster(n,2.4,1.3,e,t)}})}},o);break;case`mage:1`:{let e=a?a.x:i.x+c()*4,n=a?a.z:i.z+l()*4;t.startAction({pose:`cast`,duration:.45,hitAt:.5,onHit:()=>{this.host.sfx(`ice`),r.effects.zone(e,n,3,10479871,4);let t=0,i=()=>{if(!(t++>=8||this.host.dungeon()!==r)){for(let t of r.monsters)t.alive&&Math.hypot(t.x-e,t.z-n)<3+t.radius&&(t.slow=.8,this.host.damageMonster(t,.55,0,e,n));window.setTimeout(i,500)}};i()}},o);break}case`mage:2`:t.startAction({pose:`cast`,duration:.4,hitAt:.45,onHit:()=>{this.host.sfx(`zap`);let e=i.x,t=i.z,n=new Set;for(let i=0;i<5;i++){let a=null,o=i===0?10:6;for(let i of r.monsters){if(!i.alive||n.has(i))continue;let r=Math.hypot(i.x-e,i.z-t);r<o&&(o=r,a=i)}if(!a)break;n.add(a),r.effects.bolt(e,t,a.x,a.z,14217471),this.host.damageMonster(a,2.1-i*.2,.4,e,t),e=a.x,t=a.z}}},o);break;case`archer:0`:t.startAction({pose:`shoot`,duration:.45,hitAt:.6,onHit:()=>{this.host.sfx(`bow`),r.spawnPlayerProjectile({x:i.x,z:i.z,angle:t.facing,speed:32,damage:2.6,color:16769162,kind:`arrow`,radius:.45,pierce:99,life:1,knock:1,y:1.1}),r.effects.ring(i.x+c()*.8,i.z+l()*.8,1.2,16769162,.2,1.1)}},o);break;case`archer:1`:t.startAction({pose:`shoot`,duration:.4,hitAt:.55,onHit:()=>{this.host.sfx(`bow`);for(let e=-2;e<=2;e++)r.spawnPlayerProjectile({x:i.x,z:i.z,angle:t.facing+e*.2,speed:24,damage:1.1,color:s,kind:`arrow`,radius:.3,y:1.1})}},o);break;case`archer:2`:{t.facing=o;let e=i.x,n=i.z;r.effects.zone(e,n,1.2,16765024,1.2),t.startDash({dirX:-Math.sin(o),dirZ:-Math.cos(o),speed:14,duration:.35,pose:`leap`,invuln:!0}),this.host.sfx(`dash`),window.setTimeout(()=>{if(this.host.dungeon()===r){r.effects.ring(e,n,3.2,16756800,.35),r.particles.burst(e,.4,n,16756800,16,1.3),this.host.sfx(`boom`),this.host.shake(.2);for(let t of r.monsters)t.alive&&Math.hypot(t.x-e,t.z-n)<3+t.radius&&this.host.damageMonster(t,3,1.5,e,n)}},1200);break}}return null}projectileHit(e,t){this.host.damageMonster(e,t.damage,t.knock,t.x-t.vx*.05,t.z-t.vz*.05)}},hd={skin:15911328,pants:3880272,boot:5913124,belt:7029796,gold:15253834,steel:13226716,steelDark:9213603,eye:1841700,wood:8016436},gd=.6;function _d(e,t){let n=[],r=t.skin??hd.skin,i=t=>{let r=new q(Zu(t),e);return r.castShadow=!0,n.push(r),r},a=new sn,o=new sn;o.position.y=gd,a.add(o);let s=e=>{let n=new sn;return n.position.set(e,0,0),n.add(i([Q(new J(.17,.44,.19),t.pants??hd.pants,{pos:[0,-.22,0]}),Q(new J(.19,.16,.27),hd.boot,{pos:[0,-.52,.03]})])),o.add(n),n},c=s(.13),l=s(-.13),u=new sn;o.add(u);let d=[Q(new J(.5,.48,.32),t.tunic,{pos:[0,.27,0]}),Q(new J(.56,.16,.36),t.tunicDark,{pos:[0,-.02,0]}),Q(new J(.53,.07,.35),hd.belt,{pos:[0,.07,0]}),Q(new J(.1,.08,.04),hd.gold,{pos:[0,.07,.18]})];t.weapon===`sword`?d.push(Q(new J(.14,.14,.03),hd.gold,{pos:[0,.33,.165],rot:[0,0,Math.PI/4]}),Q(new J(.22,.12,.26),hd.steel,{pos:[.3,.49,0]}),Q(new J(.22,.12,.26),hd.steel,{pos:[-.3,.49,0]})):t.weapon===`staff`?(d.push(Q(new J(.6,.34,.4),t.tunicDark,{pos:[0,-.2,0]})),d.push(Q(new J(.06,.4,.03),hd.gold,{pos:[0,.25,.165]}))):t.weapon===`bow`&&(d.push(Q(new J(.08,.6,.05),hd.belt,{pos:[0,.27,.17],rot:[0,0,.7]})),d.push(Q(new pi(.09,.08,.5,6),hd.belt,{pos:[.12,.35,-.22],rot:[0,0,-.35]})),d.push(Q(new J(.14,.08,.1),15261904,{pos:[.21,.62,-.22],rot:[0,0,-.35]}))),t.apron&&d.push(Q(new J(.44,.6,.04),t.apron,{pos:[0,.12,.17]})),u.add(i(d));let f=new sn;f.position.y=.5,u.add(f);let p=[Q(new J(.52,.48,.46),r,{pos:[0,.26,0]}),Q(new J(.57,.16,.51),t.hair,{pos:[0,.53,-.01]}),Q(new J(.57,.38,.14),t.hair,{pos:[0,.33,-.2]}),Q(new J(.52,.1,.07),t.hair,{pos:[0,.45,.22]}),Q(new J(.16,.08,.07),t.hair,{pos:[.16,.39,.22]}),Q(new J(.06,.28,.42),t.hair,{pos:[.28,.34,-.02]}),Q(new J(.06,.28,.42),t.hair,{pos:[-.28,.34,-.02]}),Q(new J(.07,.11,.02),hd.eye,{pos:[.11,.24,.235]}),Q(new J(.07,.11,.02),hd.eye,{pos:[-.11,.24,.235]})];t.hat===`wizard`&&(p.push(Q(new pi(.46,.46,.05,8),t.tunicDark,{pos:[0,.6,0]})),p.push(Q(new mi(.3,.6,8),t.tunic,{pos:[0,.9,-.04],rot:[-.2,0,0]}))),t.beard!==void 0&&p.push(Q(new J(.44,.26,.1),t.beard,{pos:[0,.06,.22]})),f.add(i(p));let m=e=>{let n=new sn;return n.position.set(e,.44,0),n.add(i([Q(new J(.15,.26,.17),t.tunic,{pos:[0,-.12,0]}),Q(new J(.13,.22,.14),r,{pos:[0,-.34,0]})])),u.add(n),n},h=m(.33),g=m(-.33);if(t.shield){let e=i([Q(new pi(.24,.24,.05,8),hd.steelDark,{rot:[0,0,Math.PI/2]}),Q(new pi(.18,.18,.06,8),t.tunic,{pos:[.005,0,0],rot:[0,0,Math.PI/2]}),Q(new vi(.06),hd.gold,{pos:[.04,0,0]})]);e.position.set(.1,-.28,.02),h.add(e)}let _=new sn;switch(_.position.set(0,-.42,.02),t.weapon){case`sword`:_.add(i([Q(new J(.06,.18,.06),hd.belt,{pos:[0,.02,0]}),Q(new J(.08,.06,.08),hd.gold,{pos:[0,.12,0]}),Q(new J(.3,.05,.09),hd.gold,{pos:[0,-.09,0]}),Q(new J(.1,.72,.035),hd.steel,{pos:[0,-.47,0]}),Q(new J(.03,.72,.04),hd.steelDark,{pos:[0,-.47,0]}),Q(new vi(.07),hd.steel,{pos:[0,-.84,0],scale:[.72,1.2,.25]})]));break;case`staff`:_.add(i([Q(new pi(.035,.04,1.3,6),hd.wood,{pos:[0,.35,0]}),Q(new vi(.1),t.tunicDark,{pos:[0,.98,0]}),Q(new vi(.13),10479871,{pos:[0,1.12,0]})]));break;case`bow`:_.add(i([Q(new J(.05,.2,.06),hd.belt,{pos:[0,0,.08]}),Q(new J(.04,.42,.05),hd.wood,{pos:[0,.28,.02],rot:[-.45,0,0]}),Q(new J(.04,.42,.05),hd.wood,{pos:[0,-.28,.02],rot:[.45,0,0]}),Q(new J(.012,.9,.012),15790304,{pos:[0,0,-.07]})]));break;case`hammer`:_.add(i([Q(new pi(.035,.035,.7,6),hd.wood,{pos:[0,-.2,0]}),Q(new J(.2,.18,.34),hd.steelDark,{pos:[0,-.55,0]})]))}g.add(_);let v=new sn;v.position.copy(_.position),v.add(i([Q(new pi(.03,.035,.75,6),hd.wood,{pos:[0,-.3,0]}),Q(new J(.07,.08,.62),hd.steelDark,{pos:[0,-.66,0]}),Q(new mi(.05,.16,4),hd.steel,{pos:[0,-.66,.36],rot:[Math.PI/2,0,0]}),Q(new mi(.05,.16,4),hd.steel,{pos:[0,-.66,-.36],rot:[-Math.PI/2,0,0]})]));let y=new sn;return y.position.copy(_.position),y.add(i([Q(new pi(.03,.035,.75,6),hd.wood,{pos:[0,-.3,0]}),Q(new J(.05,.26,.26),hd.steel,{pos:[0,-.6,.14]})])),v.visible=y.visible=!1,g.add(v,y),{root:a,body:o,torso:u,head:f,armL:h,armR:g,legL:c,legR:l,weapon:_,pickaxe:v,axe:y,meshes:n}}var vd=(e,t,n)=>{let r=(t-e+Math.PI)%(Math.PI*2)-Math.PI;return r<-Math.PI&&(r+=Math.PI*2),e+r*n},yd=new K(16724016),bd=class e{cls;rig;position={x:0,z:0};facing=0;state=`idle`;hp=100;mp=50;maxHp=100;maxMp=50;invuln=0;hurtFlash=0;speed=0;walkPhase=0;time=0;action=null;dash=null;rollCooldown=0;material;constructor(e,t){this.cls=t,this.material=e,this.rig=_d(e,{tunic:t.look.tunic,tunicDark:t.look.tunicDark,hair:t.look.hair,weapon:t.look.weapon,shield:t.look.weapon===`sword`,hat:t.look.weapon===`staff`?`wizard`:`none`}),xd(this.rig.meshes)}setPosition(e,t){this.position.x=e,this.position.z=t,this.syncRoot()}get canAct(){return this.state===`idle`||this.state===`move`}get alive(){return this.state!==`dead`}static worldDir(e){let t=ll.x*e.x+ul.x*e.y,n=ll.z*e.x+ul.z*e.y;return{x:t,z:n,len:Math.hypot(t,n)}}startAction(e,t){return this.canAct?(t!==null&&(this.facing=t),this.action={...e,t:0,done:!1},this.state=`action`,!0):!1}startDash(e){this.alive&&(this.action=null,this.dash={...e,t:0},this.state=`dash`,e.pose!==`leap`&&(this.facing=Math.atan2(e.dirX,e.dirZ)))}startRoll(t){if(this.rollCooldown>0||this.state===`dash`||!this.alive)return!1;let n=e.worldDir(t),r=n.len>.1?{x:n.x/n.len,z:n.z/n.len}:{x:Math.sin(this.facing),z:Math.cos(this.facing)};return this.startDash({dirX:r.x,dirZ:r.z,speed:fl.rollSpeed,duration:fl.rollTime,pose:`roll`,invuln:!0}),this.rollCooldown=fl.rollCooldown+fl.rollTime,!0}get isInvulnerable(){return this.invuln>0||(this.dash?.invuln??!1)||!this.alive}hurt(e){this.hp=Math.max(0,this.hp-e),this.hurtFlash=1,this.invuln=.45,this.hp<=0&&(this.state=`dead`,this.action=null,this.dash=null)}update(t,n){this.time+=t,this.rollCooldown=Math.max(0,this.rollCooldown-t),this.invuln=Math.max(0,this.invuln-t),this.mp=Math.min(this.maxMp,this.mp+t*(2+this.maxMp*.02));let r=e.worldDir(n.move),i=Math.min(1,Math.hypot(n.move.x,n.move.y));if(this.state===`dead`){this.rig.body.rotation.x+=(-1.5-this.rig.body.rotation.x)*Math.min(1,t*6),this.rig.body.position.y+=(.25-this.rig.body.position.y)*Math.min(1,t*6),this.syncRoot();return}if(this.state===`dash`&&this.dash){let e=this.dash;e.t+=t;let r=e.t/e.duration,i=e.speed*(e.pose===`roll`?1-r*.55:1);n.applyMove(e.dirX*i*t,e.dirZ*i*t),e.onStep?.(),r>=1&&(this.dash=null,this.state=`idle`,e.onEnd?.())}else if(this.state===`action`&&this.action){let e=this.action;e.t+=t;let a=e.moveMult??.25;i>.1&&a>0&&n.applyMove(r.x/r.len*fl.walkSpeed*a*i*t,r.z/r.len*fl.walkSpeed*a*i*t),!e.done&&e.t>=e.duration*e.hitAt&&(e.done=!0,e.onHit()),e.t>=e.duration&&(this.action=null,this.state=`idle`)}else{let e=i>.12?fl.walkSpeed*i:0;this.speed+=(e-this.speed)*Math.min(1,t*14),i>.12?(this.facing=vd(this.facing,Math.atan2(r.x,r.z),Math.min(1,t*16)),n.applyMove(r.x/r.len*this.speed*t,r.z/r.len*this.speed*t),this.state=`move`):(this.speed>.05&&n.applyMove(Math.sin(this.facing)*this.speed*t,Math.cos(this.facing)*this.speed*t),this.state=`idle`)}this.animate(t),this.syncRoot()}syncRoot(){this.rig.root.position.set(this.position.x,0,this.position.z),this.rig.root.rotation.y=this.facing}animate(e){let t=this.rig,n=Math.min(1,e*18),r=(e,t)=>e.x+=(t-e.x)*n,i=this.cls.look.weapon,a=0,o=0,s=.1,c=-.35,l=i===`sword`?-1:.35,u=0,d=0,f=.6,p=0;if(this.state===`move`||this.state===`idle`&&this.speed>.3){this.walkPhase+=e*(6+this.speed*1.6);let t=Math.sin(this.walkPhase),n=Math.min(1,this.speed/fl.walkSpeed);a=t*.85*n,o=-t*.85*n,s=.1-t*.6*n,c=-.35+t*.35*n,d=.12*n,f=.6+Math.abs(Math.cos(this.walkPhase))*.07*n}else f=.6+Math.sin(this.time*2.4)*.012;if(this.state===`action`&&this.action){let e=this.action,n=Math.min(1,e.t/e.duration),r=e.hitAt,i=n<r?n/r:1-Math.min(1,(n-r)/.3),m=n<r?0:Math.min(1,(n-r)/.25);switch(a=.35,o=-.25,e.pose){case`swing`:{let r=e.combo===1?-1:1,a=e.combo===2?1.25:1;c=-.35-i*2.6*a-(1-i)*m*.3,l=-1+i*.4-m*.2,u=r*(i*.45-m*.55)*a,d=-i*.12+m*.22,s=.5,e.combo===2&&(f=.6+Math.sin(n*Math.PI)*.25),t.armR.rotation.x=c,t.torso.rotation.y=u;break}case`gather`:c=-.35-i*2.4-(1-i)*m*.2,s=-.3-i*1.8,l=-1.2+i*.3,d=-i*.1+m*.3,t.armR.rotation.x=c;break;case`spin`:p=n*Math.PI*2,c=-1.5,s=-1.2,l=-1.4;break;case`thrust`:c=-1.5-i*.2,l=-.1,d=.2;break;case`cast`:c=-.6-i*1.4+m*.6,s=-.4-i*1,l=-c*.7,d=-i*.1+m*.15;break;case`shoot`:c=-1.55,s=-1.35,l=1.55,u=.35}}if(this.state===`dash`&&this.dash){let e=Math.min(1,this.dash.t/this.dash.duration);switch(this.dash.pose){case`roll`:t.body.rotation.x=e*Math.PI*2,f=.45+Math.sin(e*Math.PI)*.15,a=o=-1.2,s=c=-1.4;break;case`lunge`:c=-1.55,l=-.05,d=.35,a=.8,o=-.8;break;case`leap`:f=.6+Math.sin(e*Math.PI)*1.1,a=o=-.6,c=-1.55,s=-1.35,l=1.55}}(this.state!==`dash`||this.dash?.pose!==`roll`)&&(t.body.rotation.x=0),r(t.legL.rotation,a),r(t.legR.rotation,o),r(t.armL.rotation,s),r(t.armR.rotation,c),r(t.weapon.rotation,l),r(t.torso.rotation,d),t.torso.rotation.y+=(u-t.torso.rotation.y)*n,t.body.rotation.y=p;let m=this.state===`action`&&this.action?.pose===`gather`?this.action.tool:void 0;t.weapon.visible=!m,t.pickaxe.visible=m===`pickaxe`,t.axe.visible=m===`axe`,t.pickaxe.rotation.x=t.axe.rotation.x=l,t.body.position.y=f,this.hurtFlash>0?(this.hurtFlash=Math.max(0,this.hurtFlash-e*5),this.material.emissive.copy(yd).multiplyScalar(this.hurtFlash*.7)):this.material.emissive.setHex(0),t.root.visible=this.invuln<=0||Math.floor(this.time*20)%2==0}};function xd(e){let t=new xr({color:8369407,depthFunc:6,depthWrite:!1});for(let n of e){let e=new q(n.geometry,t);e.renderOrder=1,n.renderOrder=2,n.add(e)}}function Sd(e,t){let n=e.stoneCount,r=t=>e.flag(t)>0;if(!r(`intro`))return``;for(let e of Wl)if(!t.isDone(e.id)){if(t.isActive(e.id)){if(t.canComplete(e))return`${Gu(e.npc)}에게 보고하자 (${e.title})`;let n=t.progress(e).filter(e=>e.cur<e.need);return`${e.title}: ${n.map(e=>`${e.text} ${e.cur}/${e.need}`).join(`, `)}`}return`${Gu(e.npc)}에게 말을 걸자 (머리 위 !)`}return n>=2&&!e.data.unlockedClasses.includes(`mage`)?`촌장 에단과 이야기하자`:n>=3&&!r(`smith3`)?`대장장이 고른과 이야기하자`:n>=4&&!e.data.unlockedClasses.includes(`archer`)?`마을 남서쪽의 수상한 인물을 찾아가자`:n<7?`${n+1}-10의 수호자를 쓰러뜨리자 (차원석 ${n}/7)`:r(`resonatorHint`)?e.count(`resonator`)===0?`차원집 조립기로 차원석 공명 장치를 만들자`:`촌장 에단에게 공명 장치를 가져가자`:`마공학자 세라와 이야기하자`}function Cd(e,t){let n=t.stoneCount,r=e=>t.flag(e)>0;switch(e){case`chief`:return n>=2&&!t.data.unlockedClasses.includes(`mage`)?`ch2`:n>=7&&t.count(`resonator`)>0?`final`:n>=3&&!r(`stoneTalk${n}`)?`stone_n`:`chief_idle`;case`engineer`:return n>=7&&!r(`resonatorHint`)?`engineer_final`:`engineer_idle`;case`smith`:return n>=3&&!r(`smith3`)?`smith_ch3`:`smith_idle`;case`stranger`:return t.data.unlockedClasses.includes(`archer`)?`stranger_idle`:`secret`;case`guide`:return n>=1?`guide_after_stone`:`guide_idle`;case`merchant`:return`merchant_idle`}}function wd(e,t){let n=Cd(e,t);return!n.endsWith(`_idle`)&&n!==`guide_after_stone`&&n!==`stone_n`}function Td(e){let t=new Set([`intro`,`returned`,`legend`,`home`,`factoryBuilt`,`endingA`,`endingB`,`tool_pickaxe`,`tool_axe`,`stone1Talk`]);for(let n of Object.keys(e.data.flags))!t.has(n)&&!n.startsWith(`bp_`)&&delete e.data.flags[n]}var Ed=(e,t)=>{let n=Math.min(255,Math.round((e>>16&255)*t)),r=Math.min(255,Math.round((e>>8&255)*t)),i=Math.min(255,Math.round((e&255)*t));return n<<16|r<<8|i};function Dd(e,t){let n=new gl(t),r=[],i=e.baseColor,a=e.accentColor;switch(e.style){case`ore`:{r.push(Q(new gi(.72,0),i,{pos:[0,.42,0],scale:[1,.78,.95],rot:[0,n.range(0,6),0]})),r.push(Q(new gi(.4,0),Ed(i,.85),{pos:[.5,.22,.2],rot:[n.range(0,3),0,0]}));let e=n.int(4,6);for(let t=0;t<e;t++){let e=n.range(0,Math.PI*2),i=n.range(.35,.8),o=.62-(i-.35)*.5;r.push(Q(new vi(n.range(.13,.2)),t%2?a:Ed(a,1.2),{pos:[Math.cos(e)*o,i,Math.sin(e)*o],rot:[n.range(0,3),n.range(0,3),0],scale:[1,1.4,1]}))}break}case`tree`:{let e=n.range(.9,1.2);r.push(Q(new pi(.16,.24,e,6),i,{pos:[0,e/2,0]})),r.push(Q(new J(.5,.12,.14),Ed(i,.8),{pos:[.1,.06,.1],rot:[0,n.range(0,3),0]}));let t=n.int(2,3);for(let i=0;i<t;i++){let o=1-i*.24;r.push(Q(new mi(.85*o,.9*o,7),Ed(a,1-i*.08+(i===t-1?.15:0)),{pos:[0,e+.2+i*.52,0],rot:[0,n.range(0,3),0]}))}break}case`crystal`:{r.push(Q(new gi(.42,0),i,{pos:[0,.14,0],scale:[1.3,.5,1.2]}));let e=n.int(4,6);for(let t=0;t<e;t++){let e=t===0,i=n.range(0,Math.PI*2),o=e?0:n.range(.22,.42),s=e?1.3:n.range(.5,.9);r.push(Q(new vi(.2,0),t%2?a:Ed(a,1.25),{pos:[Math.cos(i)*o,.3+s*.35,Math.sin(i)*o],rot:[Math.sin(i)*(e?0:.45),n.range(0,3),Math.cos(i)*(e?0:.45)],scale:[1,s*2.2,1]}))}break}case`scrap`:for(let e=0;e<3;e++)r.push(Q(new J(n.range(.4,.7),n.range(.25,.45),n.range(.4,.7)),Ed(i,1-e*.1),{pos:[n.range(-.3,.3),.18+e*.22,n.range(-.3,.3)],rot:[n.range(-.3,.3),n.range(0,3),n.range(-.3,.3)]}));for(let e=0;e<2;e++){let t=e?.26:.36,n=e?-.28:.2,i=e?.5:.75,o=e?.9:-.4;r.push(Q(new pi(t,t,.1,10),a,{pos:[n,i,.1],rot:[Math.PI/2+o,0,0]}));for(let e=0;e<8;e++){let s=e/8*Math.PI*2,c=Q(new J(.1,.1,.1),Ed(a,.85),{pos:[Math.cos(s)*(t+.04),0,Math.sin(s)*(t+.04)]});c.rotateX(Math.PI/2+o),c.translate(n,i,.1),r.push(c)}}break;case`chest`:r.push(Q(new J(.9,.5,.6),i,{pos:[0,.25,0]})),r.push(Q(new J(.94,.24,.64),Ed(i,1.15),{pos:[0,.62,0]})),r.push(Q(new J(.96,.08,.66),a,{pos:[0,.5,0]})),r.push(Q(new J(.1,.76,.66),a,{pos:[.3,.38,0]})),r.push(Q(new J(.1,.76,.66),a,{pos:[-.3,.38,0]})),r.push(Q(new J(.14,.16,.06),a,{pos:[0,.46,.32]}))}return Zu(r)}function Od(e,t,n){let r=[];switch(e){case`grass`:for(let e=0;e<3;e++)r.push(Q(new mi(.06,n.range(.25,.4),3),Ed(t,n.range(.85,1.15)),{pos:[n.range(-.15,.15),.15,n.range(-.15,.15)],rot:[n.range(-.3,.3),0,n.range(-.3,.3)]}));break;case`rock`:r.push(Q(new gi(n.range(.12,.22),0),t,{pos:[0,.06,0],scale:[1,.6,1]}));break;case`shard`:r.push(Q(new vi(.1,0),t,{pos:[0,.18,0],rot:[.3,0,.2],scale:[1,2.4,1]})),r.push(Q(new vi(.07,0),Ed(t,1.2),{pos:[.12,.1,.05],rot:[-.4,0,.3],scale:[1,2,1]}));break;case`mushroom`:r.push(Q(new pi(.04,.05,.14,5),15787728,{pos:[0,.07,0]})),r.push(Q(new mi(.13,.1,6),t,{pos:[0,.17,0]}));break;case`gear`:r.push(Q(new pi(.16,.16,.05,8),t,{pos:[0,.03,0]})),r.push(Q(new pi(.05,.05,.07,6),Ed(t,.7),{pos:[0,.04,0]}));break;case`bone`:r.push(Q(new pi(.03,.03,.34,5),t,{pos:[0,.04,0],rot:[0,0,Math.PI/2]})),r.push(Q(new _i(.05,0),t,{pos:[.17,.04,0]})),r.push(Q(new _i(.05,0),t,{pos:[-.17,.04,0]}))}return Zu(r)}function kd(e){let t=6973560;return Zu([Q(new pi(1.25,1.4,.24,8),t,{pos:[0,.12,0]}),Q(new pi(1.05,1.1,.08,8),Ed(t,1.2),{pos:[0,.27,0]}),Q(new Si(.95,.13,6,14),Ed(t,.9),{pos:[0,1.35,0]}),Q(new Si(.95,.06,4,14),e,{pos:[0,1.35,.08]}),Q(new vi(.16),e,{pos:[0,2.4,.05]}),Q(new J(.26,.5,.26),Ed(t,.9),{pos:[.9,.5,0]}),Q(new J(.26,.5,.26),Ed(t,.9),{pos:[-.9,.5,0]})])}var Ad={melee:{hp:80,atk:9,def:2,speed:3.6,radius:.5,range:1.9,windup:.6,recover:.7,exp:6},ranged:{hp:56,atk:8,def:1,speed:2.8,radius:.45,range:9,windup:.8,recover:1.2,exp:7},charger:{hp:92,atk:12,def:2,speed:3.2,radius:.55,range:7,windup:.9,recover:1.1,exp:8},bomber:{hp:36,atk:22,def:0,speed:4.4,radius:.45,range:1.8,windup:.9,recover:0,exp:5},tank:{hp:220,atk:16,def:6,speed:2.1,radius:.8,range:2.6,windup:1.1,recover:1.2,exp:12}},jd={1:{melee:`이끼 늑대`,ranged:`숲 정령술사`,charger:`뿔 멧돼지`,bomber:`포자 버섯`,tank:`이끼 골렘`},2:{melee:`협곡 하이에나`,ranged:`모래 주술사`,charger:`붉은 들소`,bomber:`폭발 선인장`,tank:`사암 골렘`},3:{melee:`서리 늑대`,ranged:`빙결 마녀`,charger:`얼음 뿔소`,bomber:`서리 정령`,tank:`빙하 골렘`},4:{melee:`수정 도마뱀`,ranged:`수정 현자`,charger:`수정 멧돼지`,bomber:`불안정한 수정`,tank:`수정 거인`},5:{melee:`폭주 경비병`,ranged:`마공 포탑`,charger:`돌격 기계`,bomber:`자폭 드론`,tank:`마공 골렘`},6:{melee:`용암 사냥개`,ranged:`화염 주술사`,charger:`불꽃 황소`,bomber:`마그마 방울`,tank:`흑요석 골렘`},7:{melee:`공허 추적자`,ranged:`차원 관찰자`,charger:`균열 돌진자`,bomber:`공허 파편`,tank:`차원 수호자`}},Md=[`고대 숲의 수호수`,`협곡의 폭군`,`빙결 여제`,`수정 심장`,`폭주한 마공 거신`,`용암 군주`,`틈새의 파수꾼`],Nd=[`이끼 파수꾼`,`협곡 우두머리`,`서리 파수꾼`,`수정 파수꾼`,`경비 거신`,`용암 파수꾼`,`틈새의 문지기`];function Pd(e,t,n){let r=1+n*.6,i=1+(t-1)*.07;return{hp:(1+(e-1)*1.05)*i*r,atk:(1+(e-1)*.85)*i*r}}var Fd=(e,t)=>{let n=Math.min(255,Math.round((e>>16&255)*t)),r=Math.min(255,Math.round((e>>8&255)*t)),i=Math.min(255,Math.round((e&255)*t));return n<<16|r<<8|i},Id=[{main:7311178,dark:4873778,accent:16770138},{main:11032634,dark:7222818,accent:16765066},{main:10275048,dark:6260392,accent:5955839},{main:9071304,dark:5915280,accent:8388576},{main:9076848,dark:5919816,accent:16751146},{main:4863028,dark:2759708,accent:16734746},{main:3816048,dark:2237002,accent:6222079}];function Ld(e,t,n,r=!1){let i=[],a=t=>{let n=new q(Zu(t),e);return n.castShadow=!0,i.push(n),n},o=new sn,s=new sn;o.add(s);let c=[],l=[],{main:u,dark:d,accent:f}=n,p=1.2,m=(e,t,n,r,i)=>{for(let[o,l]of[[e,t],[-e,t],[e,-t],[-e,-t]]){let e=new sn;e.position.set(o,n,l),e.add(a([Q(new J(r,n,r),i,{pos:[0,-n/2,0]})])),s.add(e),c.push(e)}};switch(t){case`melee`:s.add(a([Q(new J(.46,.42,.9),u,{pos:[0,.62,0]}),Q(new J(.4,.38,.4),u,{pos:[0,.78,.55]}),Q(new J(.24,.18,.28),d,{pos:[0,.7,.85]}),Q(new mi(.08,.2,4),d,{pos:[.12,1.04,.5]}),Q(new mi(.08,.2,4),d,{pos:[-.12,1.04,.5]}),Q(new J(.07,.06,.02),f,{pos:[.11,.84,.755]}),Q(new J(.07,.06,.02),f,{pos:[-.11,.84,.755]}),Q(new J(.12,.12,.45),d,{pos:[0,.75,-.6],rot:[.5,0,0]}),Q(new J(.5,.12,.6),d,{pos:[0,.86,-.05]})])),m(.15,.3,.44,.13,d),p=1.2;break;case`ranged`:{s.add(a([Q(new mi(.42,1,7),u,{pos:[0,.75,0]}),Q(new xi(.26,7,5),d,{pos:[0,1.32,0]}),Q(new mi(.3,.45,7),u,{pos:[0,1.55,-.04],rot:[-.3,0,0]}),Q(new J(.08,.05,.02),f,{pos:[.09,1.34,.25]}),Q(new J(.08,.05,.02),f,{pos:[-.09,1.34,.25]})]));let e=new sn;e.position.set(0,1,.45),e.add(a([Q(new vi(.16),f)])),s.add(e),l.push(e),p=1.9;break}case`charger`:s.add(a([Q(new J(.66,.6,1.05),u,{pos:[0,.68,0]}),Q(new J(.56,.5,.42),d,{pos:[0,.66,.66]}),Q(new J(.3,.22,.12),Fd(d,1.3),{pos:[0,.56,.92]}),Q(new mi(.06,.34,5),16051416,{pos:[.2,.55,.95],rot:[1.2,0,.3]}),Q(new mi(.06,.34,5),16051416,{pos:[-.2,.55,.95],rot:[1.2,0,-.3]}),Q(new J(.07,.06,.02),f,{pos:[.15,.78,.875]}),Q(new J(.07,.06,.02),f,{pos:[-.15,.78,.875]}),Q(new J(.2,.22,.8),d,{pos:[0,1.04,-.05]})])),m(.22,.34,.4,.17,d),p=1.3;break;case`bomber`:s.add(a([Q(new _i(.42,0),u,{pos:[0,.5,0]}),Q(new mi(.1,.24,4),d,{pos:[0,.98,0]}),Q(new mi(.1,.24,4),d,{pos:[.42,.55,0],rot:[0,0,-1.4]}),Q(new mi(.1,.24,4),d,{pos:[-.42,.55,0],rot:[0,0,1.4]}),Q(new mi(.1,.24,4),d,{pos:[0,.55,-.42],rot:[-1.4,0,0]}),Q(new J(.1,.1,.03),f,{pos:[.13,.6,.39]}),Q(new J(.1,.1,.03),f,{pos:[-.13,.6,.39]})])),p=1.2;break;case`tank`:s.add(a([Q(new J(1,.8,.7),u,{pos:[0,1.15,0]}),Q(new J(.7,.4,.6),d,{pos:[0,.65,0]}),Q(new J(.42,.36,.4),d,{pos:[0,1.72,.08]}),Q(new J(.28,.06,.02),f,{pos:[0,1.75,.285]}),Q(new vi(.16),f,{pos:[0,1.2,.36]}),Q(new gi(.2,0),Fd(u,1.15),{pos:[.52,1.5,0]}),Q(new gi(.2,0),Fd(u,1.15),{pos:[-.52,1.5,0]})]));for(let e of[.62,-.62]){let t=new sn;t.position.set(e,1.45,0),t.add(a([Q(new J(.3,.6,.32),u,{pos:[0,-.3,0]}),Q(new J(.38,.36,.4),d,{pos:[0,-.75,.04]})])),s.add(t),l.push(t)}for(let e of[.25,-.25]){let t=new sn;t.position.set(e,.5,0),t.add(a([Q(new J(.32,.5,.36),d,{pos:[0,-.25,0]})])),s.add(t),c.push(t)}p=2.2}if(r){let e=p-.05,t=[Q(new pi(.34,.38,.12,8),15253834,{pos:[0,e,0]})];for(let n=0;n<5;n++){let r=n/5*Math.PI*2;t.push(Q(new mi(.08,.3,4),n%2?15253834:f,{pos:[Math.cos(r)*.3,e+.2,Math.sin(r)*.3]}))}s.add(a(t)),p+=.3}return{root:o,body:s,legs:c,arms:l,meshes:i,height:p}}function Rd(e,t){switch(t){case`arrow`:return new q(Zu([Q(new J(.04,.04,.7),13213808),Q(new mi(.06,.14,4),14673646,{pos:[0,0,.4],rot:[Math.PI/2,0,0]}),Q(new J(.02,.1,.14),16777215,{pos:[0,0,-.3]})]),e);case`shard`:return new q(Zu([Q(new vi(.18),16777215,{scale:[.6,.6,1.6]})]),e);case`wave`:return new q(Zu([Q(new J(1.4,.35,.3),16777215,{pos:[0,.2,0]})]),e);default:return new q(Zu([Q(new _i(.2,0),16777215)]),e)}}var zd=class{shape;x;z;facing;duration;group=new sn;fill;t=0;constructor(e,t,n,r,i){this.shape=e,this.x=t,this.z=n,this.facing=r,this.duration=i;let a=new xr({color:16724016,transparent:!0,opacity:.28,depthWrite:!1,side:2}),o=new xr({color:16722474,transparent:!0,opacity:.4,depthWrite:!1,side:2}),s=()=>{let t;return e.kind===`circle`?t=new fi(e.r,32):e.kind===`cone`?(t=new fi(e.r,24,-e.angle/2,e.angle),t.rotateZ(Math.PI/2)):(t=new yi(e.width,e.length),t.translate(0,e.length/2,0)),t.rotateX(Math.PI/2),t},c=new q(s(),a);this.fill=new q(s(),o),c.position.y=.04,this.fill.position.y=.05,this.fill.scale.setScalar(.001),this.group.add(c,this.fill),this.sync()}sync(){this.group.position.set(this.x,0,this.z),this.group.rotation.y=this.facing}update(e){this.t+=e;let t=Math.min(1,this.t/this.duration);return this.shape.kind===`line`?this.fill.scale.set(1,1,Math.max(.001,t)):this.fill.scale.setScalar(Math.max(.001,t)),this.t>=this.duration}contains(e,t,n=0){let r=e-this.x,i=t-this.z,a=Math.sin(this.facing),o=Math.cos(this.facing),s=r*a+i*o,c=r*o-i*a,l=Math.hypot(r,i);switch(this.shape.kind){case`circle`:return l<=this.shape.r+n;case`cone`:return l>this.shape.r+n?!1:l<n+.3||Math.abs(Math.atan2(c,s))<=this.shape.angle/2+n/Math.max(l,.5);case`line`:return s>=-n&&s<=this.shape.length+n&&Math.abs(c)<=this.shape.width/2+n}}dispose(){this.group.traverse(e=>{let t=e;t.geometry&&t.geometry.dispose(),t.material&&t.material.dispose()})}},Bd=(e,t=.8)=>new xr({color:e,transparent:!0,opacity:t,depthWrite:!1,side:2,blending:2}),Vd=class{scene;list=[];constructor(e){this.scene=e}add(e,t,n){this.scene.add(e),this.list.push({obj:e,t:0,duration:t,update:n}),n(0,0)}slash(e,t,n,r,i,a=2.2,o=.9){let s=new bi(r*.6,r,20,1,-a/2,a);s.rotateZ(Math.PI/2),s.rotateX(Math.PI/2);let c=new q(s,Bd(i,.5));c.position.set(e,o,t),c.rotation.y=n,this.add(c,.2,e=>{c.material.opacity=.5*(1-e),c.scale.setScalar(.85+e*.3)})}ring(e,t,n,r,i=.35,a=.1){let o=new bi(.8,1,32);o.rotateX(-Math.PI/2);let s=new q(o,Bd(r,.9));s.position.set(e,a,t),this.add(s,i,e=>{s.scale.setScalar(.2+n*e),s.material.opacity=.9*(1-e)})}bolt(e,t,n,r,i){let a=new sn,o=Bd(i,1),s=e,c=t;for(let i=1;i<=6;i++){let l=i/6,u=e+(n-e)*l+(i<6?(Math.random()-.5)*.8:0),d=t+(r-t)*l+(i<6?(Math.random()-.5)*.8:0),f=new q(new J(.09,.09,Math.hypot(u-s,d-c)),o);f.position.set((s+u)/2,1.1,(c+d)/2),f.rotation.y=Math.atan2(u-s,d-c),a.add(f),s=u,c=d}this.add(a,.22,e=>o.opacity=1-e)}zone(e,t,n,r,i){let a=new fi(n,28);a.rotateX(-Math.PI/2);let o=new xr({color:r,transparent:!0,opacity:.35,depthWrite:!1,blending:1}),s=new q(a,o);s.position.set(e,.06,t),this.add(s,i,e=>{o.opacity=.35*Math.min(1,(1-e)*4)*(.85+Math.sin(e*40)*.15),s.scale.setScalar(Math.min(1,e*12))})}pillar(e,t,n,r=4){let i=new q(new J(.9,r,.9),Bd(n,.6));i.position.set(e,r/2,t),this.add(i,.6,e=>{i.material.opacity=.6*(1-e),i.scale.set(1-e*.7,1,1-e*.7)})}update(e){for(let t=this.list.length-1;t>=0;t--){let n=this.list[t];n.t+=e;let r=Math.min(1,n.t/n.duration);n.update(r,e),r>=1&&(this.scene.remove(n.obj),n.obj.traverse(e=>{let t=e;t.geometry&&t.geometry.dispose(),t.material&&t.material.dispose()}),this.list.splice(t,1))}}},Hd=[`tank`,`charger`,`ranged`,`bomber`,`tank`,`melee`,`ranged`],Ud=[[`slam`,`cone`,`summon`],[`charge`,`slam`,`cone`],[`volley`,`rain`,`summon`],[`volley`,`slam`,`rain`],[`slam`,`charge`,`volley`,`summon`],[`cone`,`rain`,`charge`,`slam`],[`volley`,`rain`,`charge`,`summon`,`slam`]],Wd=new K(16777215),Gd=class{arch;kind;tier;homeRoom;rig;def;name;material;maxHp;hp;atk;defense;speed;radius;x;z;facing=0;state=`idle`;aggro=!1;slow=0;t=0;flash=0;knockX=0;knockZ=0;telegraph=null;dashLeft=0;dashHit=!1;walkPhase=Math.random()*10;bossQueue=[];pattern=null;rainSpots=[];hpBar;hpFill;obstacle;exp;deathTime=0;constructor(e,t,n,r,i,a,o,s){this.arch=e,this.kind=t,this.tier=n,this.homeRoom=s;let c=t===`boss`||t===`midboss`,l=t===`boss`?Hd[n-1]:t===`midboss`?Hd[(n+2)%7]:e;this.arch=l,this.def=Ad[l];let u=Pd(n,r,i),d=t===`boss`?{hp:14,atk:1.5,size:2.1}:t===`midboss`?{hp:7,atk:1.3,size:1.65}:t===`elite`?{hp:3,atk:1.4,size:1.35}:{hp:1,atk:1,size:1};this.maxHp=this.hp=Math.round(this.def.hp*u.hp*d.hp),this.atk=this.def.atk*u.atk*d.atk,this.defense=this.def.def*(1+(n-1)*.6),this.speed=this.def.speed*(c?.95:1),this.radius=this.def.radius*d.size,this.x=a,this.z=o,this.name=t===`boss`?Md[n-1]:t===`midboss`?Nd[n-1]:(t===`elite`?`정예 `:``)+jd[n][l],this.exp=Math.round(this.def.exp*n**1.6*(1+(r-1)*.15)*(t===`boss`?30:t===`midboss`?15:t===`elite`?3:1)),this.material=new Ni({vertexColors:!0,flatShading:!0});let f=Id[n-1];this.rig=Ld(this.material,l,t===`elite`?{...f,accent:16765498}:f,c),this.rig.root.scale.setScalar(d.size),t===`elite`&&this.material.emissive.setHex(3811840),this.rig.root.position.set(a,0,o),this.rig.root.rotation.y=Math.random()*Math.PI*2,this.facing=this.rig.root.rotation.y,this.obstacle={x:a,z:o,radius:this.radius},this.hpBar=new sn;let p=new q(new yi(1.1,.13),new xr({color:2230794,side:2,depthTest:!1}));this.hpFill=new q(new yi(1.06,.09),new xr({color:t===`elite`?16761402:16730698,side:2,depthTest:!1})),this.hpFill.geometry.translate(.53,0,0),this.hpFill.position.x=-.53,this.hpFill.position.z=.001,p.renderOrder=10,this.hpFill.renderOrder=11,this.hpBar.add(p,this.hpFill),this.hpBar.position.set(a,this.rig.height*d.size+.35,o),this.hpBar.visible=!1}get alive(){return this.state!==`dead`}get isBoss(){return this.kind===`boss`||this.kind===`midboss`}get isFinal(){return this.kind===`boss`}get phase2(){return this.isBoss&&this.hp<this.maxHp*.5}addTo(e){e.add(this.rig.root,this.hpBar)}removeFrom(e){e.remove(this.rig.root,this.hpBar),this.clearTelegraph(e)}damage(e,t,n,r){if(!this.alive)return!1;this.hp-=e,this.flash=1,this.aggro=!0;let i=Math.hypot(this.x-t,this.z-n)||1,a=this.isBoss?.1:this.state===`windup`||this.state===`dash`?.3:1;return this.knockX+=(this.x-t)/i*r*a,this.knockZ+=(this.z-n)/i*r*a,this.hpBar.visible=!this.isBoss,this.hpFill.scale.x=Math.max(.001,this.hp/this.maxHp),this.hp<=0&&(this.state=`dead`,this.deathTime=0,this.hpBar.visible=!1,!0)}setState(e){this.state=e,this.t=0}clearTelegraph(e){this.telegraph&&=(e.remove(this.telegraph.group),this.telegraph.dispose(),null);for(let t of this.rainSpots)e.remove(t.group),t.dispose();this.rainSpots=[]}startTelegraph(e,t,n,r,i,a){this.clearTelegraph(e.scene),this.telegraph=new zd(t,n,r,i,a),e.scene.add(this.telegraph.group)}update(e,t,n){if(this.t+=e,this.hpBar.quaternion.copy(n),this.state===`dead`){this.deathTime+=e;let n=Math.min(1,this.deathTime/.45);this.rig.body.rotation.z=n*1.4,this.rig.root.scale.setScalar(this.rig.root.scale.x*(1-e*1.5)),this.clearTelegraph(t.scene);return}let r=t.player,i=r.x-this.x,a=r.z-this.z,o=Math.hypot(i,a),s=Math.atan2(i,a),c=this.slow>0?.5:1;this.slow=Math.max(0,this.slow-e);let l=!1,u=(e,n)=>{let r=t.obstacles;iu(t.grid,this,e,n,this.radius,r)};Math.abs(this.knockX)+Math.abs(this.knockZ)>.01&&(u(this.knockX*e*8,this.knockZ*e*8),this.knockX*=Math.exp(-e*10),this.knockZ*=Math.exp(-e*10));let d=(t,n)=>{let r=(t-this.facing+Math.PI)%(Math.PI*2)-Math.PI;r<-Math.PI&&(r+=Math.PI*2),this.facing+=r*Math.min(1,e*n)};switch(this.state){case`idle`:(o<(this.isBoss?11:9)||this.aggro)&&(this.aggro=!0,this.setState(`chase`));break;case`chase`:{d(s,8);let n=this.arch===`ranged`&&!this.isBoss?5.5:0;if(this.isBoss){this.t>(this.phase2?.5:.9)?this.beginBossPattern(t,o,s):o>3&&(u(Math.sin(this.facing)*this.speed*c*e,Math.cos(this.facing)*this.speed*c*e),l=!0);break}o<=this.def.range&&this.t>.25?this.beginAttack(t,o,s):o>n?(u(Math.sin(this.facing)*this.speed*c*e,Math.cos(this.facing)*this.speed*c*e),l=!0):o<n-1.5&&(u(-Math.sin(this.facing)*this.speed*.7*e,-Math.cos(this.facing)*this.speed*.7*e),l=!0);break}case`windup`:{let n=this.telegraph;n&&(this.arch===`ranged`||this.pattern===`volley`)&&n.t<n.duration*.7&&(d(s,6),n.facing=this.facing,n.x=this.x,n.z=this.z,n.sync());let r=this.rainSpots.map(t=>t.update(e));(n&&n.update(e)||!n&&this.rainSpots.length&&r.every(Boolean))&&this.release(t);break}case`dash`:{let n=(this.isBoss?15:13)*e,i=this.x,a=this.z;u(Math.sin(this.facing)*n,Math.cos(this.facing)*n);let o=Math.hypot(this.x-i,this.z-a);this.dashLeft-=n,!this.dashHit&&Math.hypot(r.x-this.x,r.z-this.z)<this.radius+.6&&(this.dashHit=!0,t.hurtPlayer(this.atk*1.2,this.x,this.z)),(this.dashLeft<=0||o<n*.3)&&(o<n*.3&&(t.shake(.2),t.burst(this.x,.5,this.z,13615264,10)),this.setState(`recover`));break}case`recover`:{let e=this.isBoss?this.phase2?.6:.9:this.def.recover;this.t>=e&&this.setState(`chase`);break}}for(let e of t.monsters){if(e===this||!e.alive)continue;let t=this.x-e.x,n=this.z-e.z,r=Math.hypot(t,n),i=this.radius+e.radius;if(r>.001&&r<i){let e=(i-r)*.5;u(t/r*e,n/r*e)}}this.obstacle.x=this.x,this.obstacle.z=this.z,this.animate(e,l)}beginAttack(e,t,n){this.facing=n;let r=this.def.windup;switch(this.arch){case`melee`:this.startTelegraph(e,{kind:`cone`,r:2.4,angle:1.8},this.x,this.z,this.facing,r);break;case`ranged`:this.startTelegraph(e,{kind:`line`,length:Math.min(t+2,11),width:.5},this.x,this.z,this.facing,r);break;case`charger`:t<2.5?(this.startTelegraph(e,{kind:`cone`,r:2.4,angle:1.6},this.x,this.z,this.facing,r*.7),this.pattern=`cone`):(this.startTelegraph(e,{kind:`line`,length:8,width:1.4},this.x,this.z,this.facing,r),this.pattern=`charge`);break;case`bomber`:this.startTelegraph(e,{kind:`circle`,r:2.5},this.x,this.z,0,r);break;case`tank`:this.startTelegraph(e,{kind:`circle`,r:2.9},this.x,this.z,0,r)}this.setState(`windup`)}beginBossPattern(e,t,n){if(this.bossQueue.length===0){let e=Ud[this.tier-1];this.bossQueue=[...this.isFinal?e:e.slice(0,2)].sort(()=>Math.random()-.5)}let r=this.bossQueue.shift();r===`charge`&&t<3&&(r=`slam`),this.pattern=r,this.facing=n;let i=this.phase2?.75:1;switch(r){case`slam`:this.startTelegraph(e,{kind:`circle`,r:5},this.x,this.z,0,1.1*i);break;case`cone`:this.startTelegraph(e,{kind:`cone`,r:7,angle:2.1},this.x,this.z,this.facing,1*i);break;case`charge`:this.startTelegraph(e,{kind:`line`,length:13,width:2.4},this.x,this.z,this.facing,1*i);break;case`volley`:this.startTelegraph(e,{kind:`circle`,r:1.6},this.x,this.z,0,.9*i);break;case`summon`:this.startTelegraph(e,{kind:`circle`,r:2},this.x,this.z,0,.9*i);break;case`rain`:{this.clearTelegraph(e.scene);let t=this.phase2?6:4;for(let n=0;n<t;n++){let t=Math.random()*Math.PI*2,r=n===0?0:1.5+Math.random()*3.5,a=new zd({kind:`circle`,r:2},e.player.x+Math.cos(t)*r,e.player.z+Math.sin(t)*r,0,1.2*i+n*.08);e.scene.add(a.group),this.rainSpots.push(a)}break}}this.setState(`windup`)}release(e){let t=this.telegraph,n=e.player,r=(t,r)=>{t&&t.contains(n.x,n.z,.35)&&e.hurtPlayer(this.atk*r,this.x,this.z)};if(this.isBoss){switch(this.pattern){case`slam`:r(t,1.3),e.effects.ring(this.x,this.z,5,16756848,.4),e.shake(.4);break;case`cone`:r(t,1.2),e.effects.slash(this.x,this.z,this.facing,7,16747098,2.1,.6),e.shake(.25);break;case`charge`:this.clearTelegraph(e.scene),this.dashLeft=13,this.dashHit=!1,this.setState(`dash`);return;case`volley`:{let t=this.phase2?16:10,n=Math.random();for(let r=0;r<t;r++)e.fireEnemyProjectile({x:this.x,z:this.z,angle:(r+n)/t*Math.PI*2,speed:7,damage:this.atk*.7,color:Id[this.tier-1].accent,radius:.35});break}case`summon`:{let t=[`melee`,`bomber`,`ranged`],n=this.phase2?3:2;for(let r=0;r<n;r++){let i=r/n*Math.PI*2;e.summon(t[r%t.length],this.x+Math.cos(i)*2.5,this.z+Math.sin(i)*2.5)}e.effects.ring(this.x,this.z,3,11567359,.5);break}case`rain`:for(let t of this.rainSpots)if(t.contains(n.x,n.z,.35)){e.hurtPlayer(this.atk*.9,t.x,t.z);break}for(let t of this.rainSpots)e.effects.ring(t.x,t.z,2,16740416,.35),e.burst(t.x,.3,t.z,16751184,6);e.shake(.2)}this.clearTelegraph(e.scene),this.setState(`recover`);return}switch(this.arch){case`melee`:r(t,1),e.effects.slash(this.x,this.z,this.facing,2.4,16777215,1.8,.7);break;case`ranged`:e.fireEnemyProjectile({x:this.x,z:this.z,angle:this.facing,speed:10,damage:this.atk,color:Id[this.tier-1].accent});break;case`charger`:if(this.pattern===`charge`){this.clearTelegraph(e.scene),this.dashLeft=8,this.dashHit=!1,this.setState(`dash`);return}r(t,1),e.effects.slash(this.x,this.z,this.facing,2.4,16777215,1.6,.6);break;case`bomber`:r(t,1),e.effects.ring(this.x,this.z,2.6,16752704,.35),e.burst(this.x,.5,this.z,16752704,16,1.4),e.shake(.25),this.clearTelegraph(e.scene),this.hp=0,this.state=`dead`,this.deathTime=.45,this.hpBar.visible=!1,this.rig.root.visible=!1;return;case`tank`:r(t,1),e.effects.ring(this.x,this.z,2.9,14733488,.35),e.shake(.2)}this.clearTelegraph(e.scene),this.setState(`recover`)}animate(e,t){let n=this.rig;n.root.position.set(this.x,0,this.z),n.root.rotation.y=this.facing,this.hpBar.position.x=this.x,this.hpBar.position.z=this.z,t&&(this.walkPhase+=e*this.speed*3.2);let r=t?Math.sin(this.walkPhase)*.6:0;n.legs.forEach((e,t)=>e.rotation.x=t%2==(t<2?0:1)?r:-r);let i=0;if(this.state===`windup`?i=-.25*Math.min(1,this.t*3):this.state===`dash`&&(i=.35),n.body.rotation.x+=(i-n.body.rotation.x)*Math.min(1,e*12),this.arch===`bomber`){let e=Math.abs(Math.sin(this.walkPhase*1.4))*.3;n.body.position.y=e,this.state===`windup`&&n.body.scale.setScalar(1+Math.sin(this.t*30)*.08+this.t*.2)}else if(this.arch===`ranged`)n.body.position.y=.15+Math.sin(this.walkPhase*.5+this.t)*.08,n.arms[0]&&(n.arms[0].rotation.y+=e*4);else if(this.arch===`tank`&&n.arms.length){let i=this.state===`windup`?-2.4*Math.min(1,this.t*2):t?r*.5:0;n.arms[0].rotation.x+=(i-n.arms[0].rotation.x)*Math.min(1,e*10),n.arms[1].rotation.x+=(i-n.arms[1].rotation.x)*Math.min(1,e*10)}if(this.flash>0)this.flash=Math.max(0,this.flash-e*8),this.material.emissive.setHex(this.kind===`elite`?3811840:0).lerp(Wd,this.flash*.8);else if(this.state===`windup`){let e=(Math.sin(this.t*25)+1)*.15;this.material.emissive.setRGB(e,0,0)}else this.material.emissive.setHex(this.kind===`elite`?3811840:0)}dispose(){this.rig.meshes.forEach(e=>e.geometry.dispose()),this.material.dispose(),this.hpBar.traverse(e=>{let t=e;t.geometry&&t.geometry.dispose(),t.material&&t.material.dispose()})}},Kd=class{scene;list=[];constructor(e){this.scene=e}spawn(e){let t=Rd(new xr({color:e.color,transparent:!0,opacity:.95,blending:e.kind===`arrow`?void 0:2,depthWrite:!1}),e.kind??`orb`);e.kind===`arrow`&&(t.material=new xr({vertexColors:!0}));let n={mesh:t,x:e.x+Math.sin(e.angle)*.6,z:e.z+Math.cos(e.angle)*.6,y:e.y??1,vx:Math.sin(e.angle)*e.speed,vz:Math.cos(e.angle)*e.speed,radius:e.radius??.3,damage:e.damage,fromPlayer:e.fromPlayer,pierce:e.pierce??0,hit:new Set,life:e.life??1.6,color:e.color,knock:e.knock??.6,onEnd:e.onEnd};return e.kind===`wave`&&t.scale.set(1,1,1),t.rotation.y=e.angle,t.position.set(n.x,n.y,n.z),this.scene.add(t),this.list.push(n),n}update(e,t){for(let n=this.list.length-1;n>=0;n--){let r=this.list[n];r.life-=e,r.x+=r.vx*e,r.z+=r.vz*e,r.mesh.position.set(r.x,r.y,r.z),r.fromPlayer||(r.mesh.rotation.x+=e*8);let i=r.life<=0;if(!Zl(t.grid,Math.floor(r.x/2),Math.floor(r.z/2)))i=!0,t.burst(r.x-r.vx*.02,r.y,r.z-r.vz*.02,r.color,4,.5);else if(r.fromPlayer){for(let e of t.monsters)if(e.alive&&!r.hit.has(e)&&Math.hypot(e.x-r.x,e.z-r.z)<e.radius+r.radius){if(r.hit.add(e),t.monsterHit(e,r),r.pierce<=0){i=!0;break}r.pierce--}}else Math.hypot(t.player.x-r.x,t.player.z-r.z)<r.radius+.4&&(t.playerHit(r),i=!0);i&&(r.onEnd?.(r.x,r.z),this.remove(n))}}remove(e){let t=this.list[e];this.scene.remove(t.mesh),t.mesh.geometry.dispose(),t.mesh.material.dispose(),this.list.splice(e,1)}clear(){for(let e=this.list.length-1;e>=0;e--)this.remove(e)}},qd=160,Jd=class{mesh;items=[];dummy=new on;color=new K;hidden=new Mt().makeScale(0,0,0);constructor(){let e=new Ni({flatShading:!0});this.mesh=new Wr(new J(1,1,1),e,qd),this.mesh.instanceMatrix.setUsage(Ue),this.mesh.frustumCulled=!1;for(let e=0;e<qd;e++)this.mesh.setMatrixAt(e,this.hidden),this.mesh.setColorAt(e,this.color.setHex(16777215))}burst(e,t,n,r,i,a=1){for(let o=0;o<i&&!(this.items.length>=qd);o++){let i=Math.random()*Math.PI*2,o=(1.5+Math.random()*2.5)*a;this.items.push({x:e,y:t,z:n,vx:Math.cos(i)*o,vy:3+Math.random()*3*a,vz:Math.sin(i)*o,life:0,maxLife:.45+Math.random()*.35,size:.08+Math.random()*.1,spin:Math.random()*10});let s=this.items.length-1;this.mesh.setColorAt(s,this.color.setHex(r).multiplyScalar(.85+Math.random()*.3))}this.mesh.instanceColor&&(this.mesh.instanceColor.needsUpdate=!0)}update(e){let t=0;for(let n=0;n<this.items.length;n++){let r=this.items[n];if(r.life+=e,r.life>=r.maxLife)continue;r.vy-=18*e,r.x+=r.vx*e,r.y=Math.max(.05,r.y+r.vy*e),r.z+=r.vz*e,r.y<=.05&&(r.vx*=.8,r.vz*=.8),t!==n&&(this.items[t]=r,this.mesh.getColorAt(n,this.color),this.mesh.setColorAt(t,this.color));let i=r.size*(1-r.life/r.maxLife);this.dummy.position.set(r.x,r.y,r.z),this.dummy.rotation.set(r.spin*r.life,r.spin*r.life*.7,0),this.dummy.scale.setScalar(i),this.dummy.updateMatrix(),this.mesh.setMatrixAt(t,this.dummy.matrix),t++}for(let e=t;e<this.items.length;e++)this.mesh.setMatrixAt(e,this.hidden);this.items.length=t,this.mesh.instanceMatrix.needsUpdate=!0,this.mesh.instanceColor&&(this.mesh.instanceColor.needsUpdate=!0)}},Yd=class{scene=new hn;heroMaterial=new Ni({vertexColors:!0,flatShading:!0});particles=new Jd;effects;obstacles=[];interactables=[];sun;time=0;constructor(){this.effects=new Vd(this.scene),this.scene.add(this.particles.mesh)}setupLights(e,t,n,r=1.7,i=2.4){this.scene.background=new K(e),this.scene.add(new na(t,e,r)),this.sun=new ya(n,i),this.sun.castShadow=!0,this.sun.shadow.mapSize.set(1024,1024);let a=this.sun.shadow.camera;a.left=a.bottom=-16,a.right=a.top=16,a.near=1,a.far=60,this.sun.shadow.bias=-.0015,this.sun.shadow.normalBias=.03,this.scene.add(this.sun,this.sun.target)}buildTiles(e,t,n,r=dl){let{width:i,height:a}=e,o=[],s=[];for(let t=-1;t<=a;t++)for(let n=-1;n<=i;n++){if(Zl(e,n,t)){o.push([n,t]);continue}let r=!1;for(let i=-1;i<=1&&!r;i++)for(let a=-1;a<=1&&!r;a++)r=Zl(e,n+a,t+i);r&&s.push([n,t])}let c=new Mt,l=new K,u=new K(t.floorA),d=new K(t.floorB),f=new J(2,.3,2);f.translate(0,-.15,0);let p=new Wr(f,new Ni,o.length);if(o.forEach(([e,t],r)=>{c.makeTranslation((e+.5)*2,0,(t+.5)*2),p.setMatrixAt(r,c),l.copy((e+t)%2?u:d).multiplyScalar(n.range(.93,1.05)),p.setColorAt(r,l)}),p.receiveShadow=!0,this.scene.add(p),s.length===0)return;let m=Xu(Yu(new J(2,r,2),t.wallSide),t.wallTop);m.translate(0,r/2-.3,0);let h=new Wr(m,new Ni({vertexColors:!0}),s.length),g=new on;s.forEach(([e,t],r)=>{g.position.set((e+.5)*2,0,(t+.5)*2),g.scale.set(1,n.range(.85,1.3),1),g.updateMatrix(),h.setMatrixAt(r,g.matrix),h.setColorAt(r,l.setScalar(n.range(.85,1.08)))}),h.receiveShadow=!0,this.scene.add(h)}addMesh(e,t,n,r,i=0,a=!0){let o=new q(e,t);return o.position.set(n,0,r),o.rotation.y=i,o.castShadow=a,o.receiveShadow=!0,this.scene.add(o),o}update(e,t){this.time+=e,this.sun.position.set(t.x-10,18,t.z+6),this.sun.target.position.set(t.x,0,t.z),this.particles.update(e),this.effects.update(e)}dispose(){this.scene.traverse(e=>{let t=e;t.geometry&&t.geometry.dispose();let n=t.material;Array.isArray(n)?n.forEach(e=>e.dispose()):n&&n.dispose()})}},Xd=new K(16777215),Zd=[`melee`,`melee`,`melee`,`ranged`,`ranged`,`charger`,`bomber`,`tank`],Qd=class e extends Yd{grid;hooks;kind=`dungeon`;theme;nodes=[];portals=[];monsters=[];projectiles;playerStart;boss=null;rng;world;constructor(t,n,r){super(),this.grid=t,this.hooks=r,this.theme=Yl(t.tier),this.rng=new gl(t.seed^1540483477),this.setupLights(this.theme.background,this.theme.ambient,this.theme.sun),this.buildTiles(t,this.theme,this.rng),this.buildDecor(),this.buildNodes(),this.buildPortals(),this.projectiles=new Kd(this.scene);let i=e.toWorld(t.start.x,t.start.y);this.playerStart={x:i.x+1.4,z:i.z+1.4,facing:Math.PI/4};let a=this;this.world={grid:t,obstacles:this.obstacles,scene:this.scene,effects:this.effects,get player(){return r.player()},monsters:this.monsters,hurtPlayer:(e,t,n)=>r.hurtPlayer(e,t,n),fireEnemyProjectile:e=>a.projectiles.spawn({...e,fromPlayer:!1,kind:e.kind??`orb`,life:2.2}),summon:(e,t,n)=>a.spawnMonster(e,`normal`,t,n,-1,!0),burst:(e,t,n,r,i,o)=>a.particles.burst(e,t,n,r,i,o),shake:e=>r.shake(e)},this.ngPlus=n,t.monsters.forEach(n=>{let r=e.toWorld(n.x,n.y),i=this.rng.pick(Zd),a=t.roomIndex[n.y*t.width+n.x],o=this.spawnMonster(i,n.kind,r.x,r.z,a,!1);(n.kind===`boss`||n.kind===`midboss`)&&(this.boss=o)});let o=this.portals.find(e=>e.kind===`exit`);this.interactables.push({id:`exit`,x:o.x,z:o.z,range:3.4,label:`워프`,title:`워프 게이트`,action:()=>r.exit(),enabled:()=>this.exitOpen});for(let e of this.nodes)this.interactables.push({id:`node`,x:e.x,z:e.z,range:e.def.radius+1.7,label:e.def.style===`chest`?`열기`:`채집`,action:()=>r.gather(e),enabled:()=>e.alive&&e.dying===0})}ngPlus=0;static toWorld(e,t){return{x:(e+.5)*2,z:(t+.5)*2}}spawnMonster(e,t,n,r,i,a){let o=new Gd(e,t,this.grid.tier,this.grid.stage,this.ngPlus,n,r,i);return o.aggro=a,o.addTo(this.scene),this.monsters.push(o),a&&this.effects.ring(n,r,1.5,11567359,.4),o}buildDecor(){if(this.grid.decor.length===0)return;let e=new Mt,t=new U,n=new q(Zu(this.grid.decor.map(n=>{let r=Od(n.kind,n.color,this.rng);return e.makeRotationY(n.rotation).scale(t.setScalar(n.scale)),r.applyMatrix4(e),r.translate(n.x*2,0,n.y*2),r})),new Ni({vertexColors:!0,flatShading:!0}));n.receiveShadow=!0,this.scene.add(n)}buildNodes(){this.grid.nodes.forEach((t,n)=>{let r=pu[t.nodeId],i=new Ni({vertexColors:!0,flatShading:!0});r.style===`crystal`&&i.emissive.setHex(r.accentColor).multiplyScalar(.22);let a=e.toWorld(t.x,t.y),o=this.addMesh(Dd(r,this.grid.seed+n*131),i,a.x,a.z,r.style===`chest`?Math.PI/4:this.rng.range(0,Math.PI*2)),s={x:a.x,z:a.z,radius:r.radius};this.obstacles.push(s),this.nodes.push({def:r,mesh:o,material:i,x:a.x,z:a.z,hp:r.hp,shake:0,flash:0,dying:0,alive:!0,obstacle:s})})}buildPortals(){let t=(t,n,r)=>{let i=r===`exit`?this.theme.portalColor:10131632,a=new sn,o=e.toWorld(t,n);a.position.set(o.x,0,o.z),a.rotation.y=Math.PI/4;let s=new q(kd(i),new Ni({vertexColors:!0,flatShading:!0}));s.castShadow=!0;let c=new xr({color:i,transparent:!0,opacity:.2,side:2,blending:2,depthWrite:!1}),l=new q(new fi(.84,6),c);l.position.y=1.35;let u=c.clone();u.opacity=.1;let d=new q(new bi(1.4,2.1,24),u);d.rotation.x=-Math.PI/2,d.position.y=.03,a.add(s,l,d),this.scene.add(a),this.obstacles.push({x:o.x,z:o.z,radius:1.15}),this.portals.push({group:a,x:o.x,z:o.z,kind:r,swirl:l,glow:d})};t(this.grid.start.x,this.grid.start.y,`entrance`),t(this.grid.exit.x,this.grid.exit.y,`exit`)}get exitOpen(){return this.monsters.every(e=>!e.alive)}get aliveCount(){return this.monsters.filter(e=>e.alive).length}hitNode(e){if(!e.alive||e.dying>0)return[];--e.hp,e.shake=1,e.flash=1;let t=[];if(this.particles.burst(e.x,.7,e.z,e.def.accentColor,7),e.def.style===`chest`){let n=this.theme.nodes.map(e=>pu[e].itemId);for(let r=0;r<e.def.bonus;r++)t.push({itemId:this.rng.pick(n),count:1})}else t.push({itemId:e.def.itemId,count:1});if(e.hp<=0){e.dying=.001,e.def.style!==`chest`&&t.push({itemId:e.def.itemId,count:e.def.bonus}),this.particles.burst(e.x,.6,e.z,e.def.baseColor,12,1.3);let n=this.obstacles.indexOf(e.obstacle);n>=0&&this.obstacles.splice(n,1)}let n=new Map;for(let e of t)n.set(e.itemId,(n.get(e.itemId)??0)+e.count);return[...n].filter(([e])=>Z[e]).map(([e,t])=>({itemId:e,count:t}))}spawnPlayerProjectile(e){return this.projectiles.spawn({...e,fromPlayer:!0})}playerObstacles(){let e=[...this.obstacles];for(let t of this.monsters)t.alive&&e.push({x:t.x,z:t.z,radius:t.radius*.8});return e}update(e,t){super.update(e,t);let n=this.hooks.cameraQuat();for(let r=this.monsters.length-1;r>=0;r--){let i=this.monsters[r];(!(Math.hypot(i.x-t.x,i.z-t.z)>30)||i.aggro)&&i.update(e,this.world,n),!i.alive&&i.deathTime>=.45&&(i.removeFrom(this.scene),i.dispose(),this.monsters.splice(r,1))}this.projectiles.update(e,{grid:this.grid,monsters:this.monsters,player:t,playerHit:e=>this.hooks.hurtPlayer(e.damage,e.x-e.vx,e.z-e.vz),monsterHit:(e,t)=>this.hooks.monsterHitByProjectile(e,t),burst:(e,t,n,r,i,a)=>this.particles.burst(e,t,n,r,i,a)});for(let t of this.nodes)if(t.alive){if(t.shake>0){t.shake=Math.max(0,t.shake-e*6);let n=t.shake*.08;t.mesh.position.x=t.x+Math.sin(this.time*70)*n,t.mesh.position.z=t.z+Math.cos(this.time*63)*n}if(t.flash>0){t.flash=Math.max(0,t.flash-e*9);let n=t.def.style===`crystal`?.22:0;t.material.emissive.setHex(t.def.accentColor).multiplyScalar(n).lerp(Xd,t.flash*.7)}if(t.dying>0){t.dying+=e*4.5;let n=Math.max(0,1-t.dying);t.mesh.scale.set(1+(1-n)*.3,n,1+(1-n)*.3),t.dying>=1&&(t.alive=!1,t.mesh.visible=!1)}}let r=this.exitOpen;for(let t of this.portals){let n=t.kind===`exit`&&r;if(t.swirl.rotation.z+=e*(n?2.2:.5),t.swirl.material.opacity=n?.55:.18,t.glow.material.opacity=n?.32:.08,t.swirl.scale.setScalar(1+Math.sin(this.time*3)*.06),n&&Math.random()<e*8){let e=Math.random()*Math.PI*2;this.particles.burst(t.x+Math.cos(e)*.8,.3,t.z+Math.sin(e)*.8,this.theme.portalColor,1,.3)}}}dispose(){this.projectiles.clear();for(let e of this.monsters)e.removeFrom(this.scene),e.dispose();super.dispose()}},$d=new Set([`generator`,`wire`,`smelter`,`crusher`,`infuser`,`assembler`,`alchemy`]),ef=700,tf=class extends Yd{factory;onBuilding;kind=`home`;grid;playerStart;buildingMesh=null;buildingMat=new Ni({vertexColors:!0,flatShading:!0});items;lights;cursor;gridLines;swirl;geoCache=new Map;dummy=new on;color=new K;layoutKey=``;ghost=null;ghostKey=``;exitInteract;constructor(e,t,n){super(),this.factory=e,this.onBuilding=n;let r=e.size,i=r+3,a=new Uint8Array(r*i).fill(1);this.grid={seed:99,tier:0,stage:0,width:r,height:i,cells:a,rooms:[],roomIndex:new Int16Array(r*i).fill(-1),start:{x:Math.floor(r/2),y:r+1},exit:{x:Math.floor(r/2),y:r+1},nodes:[],monsters:[],decor:[]},this.setupLights(1183266,14735615,16773344,1.9,2.2),this.buildTiles(this.grid,{floorA:4867680,floorB:5394026,wallSide:3025476,wallTop:6970010},new gl(3),1.4);let o=new q(new J(r*2,.05,6),new Ni({color:2762304}));o.position.set(r*2/2,.02,(r+1.5)*2),o.receiveShadow=!0,this.scene.add(o);let s=(Math.floor(r/2)+.5)*2,c=(r+2)*2;this.addMesh(kd(12750079),new Ni({vertexColors:!0,flatShading:!0}),s,c+.6,Math.PI).scale.setScalar(.9),this.swirl=new q(new fi(.84,6),new xr({color:12750079,transparent:!0,opacity:.5,side:2,blending:2,depthWrite:!1})),this.swirl.position.set(s,1.22,c+.6),this.swirl.scale.setScalar(.9),this.scene.add(this.swirl),this.obstacles.push({x:s,z:c+.6,radius:1}),this.exitInteract={id:`exit`,x:s,z:c+.6,range:2.8,label:`마을로`,title:`차원마을로`,action:t},this.interactables.push(this.exitInteract),this.playerStart={x:s,z:c-1.6,facing:Math.PI+Math.PI/4},this.items=new Wr(new J(.42,.42,.42),new Ni,ef),this.items.instanceMatrix.setUsage(Ue),this.items.frustumCulled=!1,this.items.castShadow=!0,this.scene.add(this.items),this.lights=new Wr(new J(.28,.28,.28),new xr,r*r),this.lights.frustumCulled=!1,this.scene.add(this.lights),this.cursor=new q(new J(1.92,.12,1.92),new xr({color:8060864,transparent:!0,opacity:.45,depthWrite:!1})),this.cursor.visible=!1,this.scene.add(this.cursor),this.gridLines=new Va(r*2,r,10128127,6970026),this.gridLines.position.set(r*2/2,.03,r*2/2);let l=this.gridLines.material;l.transparent=!0,l.opacity=.35,this.gridLines.visible=!1,this.scene.add(this.gridLines),this.rebuild()}get center(){return{x:this.factory.size*2/2,z:(this.factory.size+3)*2/2}}setBuildMode(e){this.gridLines.visible=e,e||(this.cursor.visible=!1)}showCursor(e,t,n){this.cursor.visible=!0,this.cursor.position.set((e+.5)*2,.08,(t+.5)*2),this.cursor.material.color.setHex(n?8060864:16734810)}hideCursor(){this.cursor.visible=!1}showGhost(e,t,n,r,i){let a=e;(!this.ghost||this.ghostKey!==a)&&(this.ghost&&(this.scene.remove(this.ghost),this.ghost.geometry.dispose()),this.ghost=new q(Qu(e,e===`wire`?[!0,!1,!0,!1]:void 0),new Ni({vertexColors:!0,transparent:!0,opacity:.5,depthWrite:!1})),this.ghostKey=a,this.scene.add(this.ghost));let[o,s]=au[r];this.ghost.visible=!0,this.ghost.position.set((t+.5)*2,.02,(n+.5)*2),this.ghost.rotation.y=e===`wire`?0:Math.atan2(o,s),this.ghost.material.emissive.setHex(i?1063456:5902352)}hideGhost(){this.ghost&&(this.ghost.visible=!1)}producing(){return this.factory.state.buildings.filter(e=>su.has(e.type)&&e.crafting).map(e=>({b:e,x:(e.x+.5)*2,z:(e.y+.5)*2}))}rebuildInteractables(){this.interactables.length=0,this.interactables.push(this.exitInteract);for(let e of this.factory.state.buildings){if(e.type!==`generator`&&e.type!==`box`&&!su.has(e.type))continue;let t=e.type===`generator`?`연료`:e.type===`box`?`열기`:`보기`;this.interactables.push({id:`building`,x:(e.x+.5)*2,z:(e.y+.5)*2,range:2.1,label:t,action:()=>this.onBuilding(e)})}}rebuild(){let e=this.factory,t=[];for(let n of e.state.buildings){let r,i=n.type;n.type===`wire`&&(r=au.map(([t,r])=>{let i=e.at(n.x+t,n.y+r);return!!i&&$d.has(i.type)}),i+=r.map(e=>+!!e).join(``));let a=this.geoCache.get(i);a||(a=Qu(n.type,r),this.geoCache.set(i,a));let o=a.clone(),[s,c]=au[n.dir];n.type!==`wire`&&o.rotateY(Math.atan2(s,c)),o.translate((n.x+.5)*2,0,(n.y+.5)*2),t.push(o)}this.buildingMesh&&=(this.scene.remove(this.buildingMesh),this.buildingMesh.geometry.dispose(),null),t.length&&(this.buildingMesh=new q(Zu(t),this.buildingMat),this.buildingMesh.castShadow=!0,this.buildingMesh.receiveShadow=!0,this.scene.add(this.buildingMesh)),this.layoutKey=this.currentKey(),this.rebuildInteractables()}currentKey(){return this.factory.state.buildings.map(e=>`${e.type}${e.x},${e.y},${e.dir}`).join(`|`)}update(e,t){super.update(e,t),this.swirl.rotation.z+=e*1.4,this.currentKey()!==this.layoutKey&&this.rebuild();let n=this.factory,r=0,i=new Mt;for(let e of n.state.buildings){if(!e.item||e.type!==`belt`&&e.type!==`splitter`||r>=ef)continue;let[t,n]=au[e.dir],i=(e.progress??0)-.5;this.dummy.position.set((e.x+.5+t*i)*2,.45,(e.y+.5+n*i)*2),this.dummy.rotation.set(0,(e.x+e.y)*.7,0),this.dummy.updateMatrix(),this.items.setMatrixAt(r,this.dummy.matrix),this.items.setColorAt(r,this.color.setHex(Z[e.item]?.color??16777215)),r++}this.items.count=r,this.items.instanceMatrix.needsUpdate=!0,this.items.instanceColor&&(this.items.instanceColor.needsUpdate=!0);let a=0;for(let e of n.state.buildings){if(!su.has(e.type)&&e.type!==`generator`&&e.type!==`box`)continue;let t=9079450;if(e.type===`generator`)t=(e.fuel??0)>0||Object.values(e.buffer??{}).some(e=>e>0)?5963728:16734810;else if(e.type===`box`)t=e.mode===`in`?7000319:16765002;else{let r=n.status(e);t=r===`working`?7012202:r===`no-power`?16730698:r===`blocked`?16765002:r===`no-recipe`?16751162:9079450}let r=Math.sin(this.time*4+e.x)*.06;i.makeTranslation((e.x+.5)*2+.6,2.1+r,(e.y+.5)*2+.6),this.lights.setMatrixAt(a,i),this.lights.setColorAt(a,this.color.setHex(t)),a++}this.lights.count=a,this.lights.instanceMatrix.needsUpdate=!0,this.lights.instanceColor&&(this.lights.instanceColor.needsUpdate=!0)}dispose(){for(let e of this.geoCache.values())e.dispose();super.dispose()}};function nf(e,t,n=3.2,r=2.8){return Zu([Q(new J(n,2,r),e,{pos:[0,1,0]}),Q(new J(n+.2,.25,r+.2),5914672,{pos:[0,.12,0]}),Q(new mi(Math.max(n,r)*.78,1.6,4),t,{pos:[0,2.8,0],rot:[0,Math.PI/4,0],scale:[n/Math.max(n,r),1,r/Math.max(n,r)]}),Q(new J(.7,1.2,.08),6964264,{pos:[0,.6,r/2+.02]}),Q(new J(.55,.5,.06),16767114,{pos:[-n/3.2,1.25,r/2+.02]}),Q(new J(.55,.5,.06),16767114,{pos:[n/3.2,1.25,r/2+.02]}),Q(new J(.35,.9,.35),8024176,{pos:[n/3,3.1,-r/5]})])}function rf(){return Zu([Q(new J(3.4,.3,2.8),5918792,{pos:[0,.15,0]}),Q(new J(.3,2.4,.3),6964264,{pos:[1.5,1.2,1.2]}),Q(new J(.3,2.4,.3),6964264,{pos:[-1.5,1.2,1.2]}),Q(new J(.3,2.4,.3),6964264,{pos:[1.5,1.2,-1.2]}),Q(new J(.3,2.4,.3),6964264,{pos:[-1.5,1.2,-1.2]}),Q(new J(3.8,.2,3.2),9058858,{pos:[0,2.5,0],rot:[.12,0,0]}),Q(new J(1.2,1.1,1),6971488,{pos:[-.8,.85,-.7]}),Q(new J(.7,.4,.1),16742954,{pos:[-.8,.8,-.18]}),Q(new J(.4,1.6,.4),6971488,{pos:[-.8,2.2,-.9]}),Q(new J(.4,.5,.4),3816e3,{pos:[.7,.55,.4]}),Q(new J(.9,.22,.4),4868690,{pos:[.7,.9,.4]}),Q(new mi(.2,.4,4),4868690,{pos:[1.3,.9,.4],rot:[0,0,-Math.PI/2]})])}function af(e){let t=[Q(new J(2.6,.9,1.1),9067060,{pos:[0,.45,.4]}),Q(new J(2.8,.1,1.3),6964264,{pos:[0,.95,.4]}),Q(new J(.15,2.3,.15),6964264,{pos:[1.3,1.15,1]}),Q(new J(.15,2.3,.15),6964264,{pos:[-1.3,1.15,1]}),Q(new J(.15,2.6,.15),6964264,{pos:[1.3,1.3,-.4]}),Q(new J(.15,2.6,.15),6964264,{pos:[-1.3,1.3,-.4]}),Q(new J(3,.12,1.8),e,{pos:[0,2.45,.3],rot:[-.25,0,0]})];return[16734842,8060864,10470655,15253834].forEach((e,n)=>t.push(Q(new vi(.15),e,{pos:[-.9+n*.6,1.15,.4]}))),Zu(t)}function of(){return Zu([Q(new pi(1.8,1.9,.5,10),10130570,{pos:[0,.25,0]}),Q(new pi(1.5,1.5,.1,10),5945576,{pos:[0,.48,0]}),Q(new pi(.3,.4,1.4,8),10130570,{pos:[0,1,0]}),Q(new pi(.8,.6,.25,10),10130570,{pos:[0,1.7,0]}),Q(new vi(.35),6222079,{pos:[0,2.3,0]})])}function sf(){return Zu([Q(new J(1.8,.6,1.8),9079440,{pos:[0,.3,0]}),Q(new J(1.2,.4,1.2),10132128,{pos:[0,.8,0]}),Q(new J(.6,1.1,.4),12105920,{pos:[0,1.55,0]}),Q(new J(.5,.5,.45),12105920,{pos:[0,2.35,0]}),Q(new J(.08,1.4,.08),14211296,{pos:[.45,1.8,.1],rot:[0,0,-.2]}),Q(new vi(.2),15253834,{pos:[0,2.9,0]})])}function cf(){return Zu([Q(new J(1.3,.7,.8),8014372,{pos:[0,.35,0]}),Q(new J(1.34,.3,.84),9067052,{pos:[0,.85,0]}),Q(new J(1.36,.08,.86),15253834,{pos:[0,.7,0]}),Q(new J(.16,.2,.06),15253834,{pos:[0,.62,.42]})])}function lf(){return Zu([Q(new pi(.07,.1,2.2,6),3816e3,{pos:[0,1.1,0]}),Q(new J(.34,.4,.34),16767114,{pos:[0,2.35,0]}),Q(new mi(.3,.25,4),3816e3,{pos:[0,2.68,0],rot:[0,Math.PI/4,0]})])}function uf(e){return Zu([Q(new pi(.18,.26,1.2,6),7031342,{pos:[0,.6,0]}),Q(new gi(.95,0),e,{pos:[0,1.9,0]}),Q(new gi(.6,0),e,{pos:[.5,1.5,.3]})])}function df(){return Zu([Q(new pi(.35,.35,.8,8),9067060,{pos:[0,.4,0]}),Q(new Si(.36,.03,3,8),3816e3,{pos:[0,.2,0],rot:[Math.PI/2,0,0]}),Q(new Si(.36,.03,3,8),3816e3,{pos:[0,.6,0],rot:[Math.PI/2,0,0]})])}function ff(){return Zu([Q(new J(2.2,.3,1.2),5918832,{pos:[0,.15,0]}),Q(new J(.35,2.6,.5),4866144,{pos:[.9,1.3,0]}),Q(new J(.35,2.6,.5),4866144,{pos:[-.9,1.3,0]}),Q(new J(2.2,.4,.55),4866144,{pos:[0,2.7,0]}),Q(new xi(.2,6,4),12750079,{pos:[0,3.05,0]})])}var pf=[{id:`chief`,name:`촌장 에단`,faction:`중립`,tile:[13,11],look:{tunic:6969994,tunicDark:4865638,hair:15263976,beard:15790320,weapon:`staff`}},{id:`guide`,name:`안내인 리아`,faction:`탈출파`,tile:[17,16],look:{tunic:3840650,tunicDark:2781286,hair:14721088,weapon:`none`}},{id:`smith`,name:`대장장이 고른`,faction:`안주파`,tile:[8,6],look:{tunic:9062954,tunicDark:5910554,hair:2760736,beard:3811872,apron:4864560,weapon:`hammer`,skin:14196848}},{id:`engineer`,name:`마공학자 세라`,faction:`탈출파`,tile:[21,13],look:{tunic:4876954,tunicDark:3427440,hair:11553354,apron:6969920,weapon:`none`}},{id:`merchant`,name:`상인 무트`,faction:`안주파`,tile:[7,13],look:{tunic:13213760,tunicDark:10123818,hair:6965802,weapon:`none`}},{id:`stranger`,name:`???`,faction:`???`,tile:[4,18],look:{tunic:2763322,tunicDark:1710630,hair:1710630,hat:`wizard`,weapon:`none`,skin:13156568}}],mf=28,hf=22,gf=(e,t)=>({x:(e+.5)*2,z:(t+.5)*2});function _f(){return{seed:7,tier:0,stage:0,width:mf,height:hf,cells:new Uint8Array(616).fill(1),rooms:[],roomIndex:new Int16Array(616).fill(-1),start:{x:14,y:17},exit:{x:14,y:4},nodes:[],monsters:[],decor:[]}}var vf=class extends Yd{kind=`village`;grid=_f();playerStart;npcs=[];portalSwirl;homeSwirl;npcMaterial=new Ni({vertexColors:!0,flatShading:!0});constructor(e,t,n,r){super();let i=new gl(12345);this.setupLights(1841712,16771280,16769720,1.8,2.3),this.buildTiles(this.grid,{floorA:9407100,floorB:10130566,wallSide:4151860,wallTop:6130244},i,1.6);let a=new Ni({vertexColors:!0,flatShading:!0}),o=(e,t,n,r,i)=>{let o=gf(t,n);return this.addMesh(e,a,o.x,o.z,r),i>0&&this.obstacles.push({x:o.x,z:o.z,radius:i}),o},s=[[3,3,14207144,9058858,0],[24,3,13154456,3824266,0],[3,17,14207144,4876858,Math.PI/2],[24,18,13156528,9058858,-Math.PI/2],[19,19,13680800,6965898,Math.PI],[9,19,13154456,9067050,Math.PI]];for(let[e,t,n,r,i]of s)o(nf(n,r),e,t,i,2.1);o(rf(),8,4,0,1.9),o(af(13126218),7,12,Math.PI/2,1.5),o(of(),13,13,0,1.9),o(sf(),20,5,0,1.3),o(cf(),11,16,0,.8);for(let[e,t]of[[10,9],[17,9],[10,15],[17,13],[5,9],[22,9]])o(lf(),e,t,0,.25);for(let[e,t]of[[1,9],[1,13],[26,12],[26,7],[14,20],[6,1],[21,1]])o(uf(i.pick([5212732,5937732,4160052])),e,t,i.range(0,6),.9);for(let[e,t]of[[6,11],[9,3],[25,15]])o(df(),e,t,0,.45);let c=[];for(let e=0;e<70;e++){let e=i.range(.5,27.5),t=i.range(.5,21.5),n=Od(i.chance(.7)?`grass`:`mushroom`,i.chance(.7)?6987848:14242879,i);n.translate(e*2,0,t*2),c.push(n)}this.addMesh(Zu(c),a,0,0,0,!1);let l=gf(14,4);this.addMesh(kd(6222079),a,l.x,l.z,Math.PI/4).scale.setScalar(1.5),this.obstacles.push({x:l.x,z:l.z,radius:1.8}),this.portalSwirl=new q(new fi(.84,6),new xr({color:6222079,transparent:!0,opacity:.55,side:2,blending:2,depthWrite:!1})),this.portalSwirl.position.set(l.x,2.02,l.z),this.portalSwirl.rotation.y=Math.PI/4,this.portalSwirl.scale.setScalar(1.5),this.scene.add(this.portalSwirl);let u=new ga(6222079,18,12);u.position.set(l.x,2.5,l.z+1),this.scene.add(u);let d=gf(23,11);this.addMesh(ff(),a,d.x,d.z,-Math.PI/2),this.obstacles.push({x:d.x,z:d.z,radius:1}),this.homeSwirl=new q(new fi(.75,6),new xr({color:12750079,transparent:!0,opacity:n?.6:.12,side:2,blending:2,depthWrite:!1})),this.homeSwirl.position.set(d.x,1.3,d.z),this.homeSwirl.rotation.y=-Math.PI/2,this.homeSwirl.scale.set(1.1,1.5,1),this.scene.add(this.homeSwirl);for(let n of pf){if(!t(n.id))continue;let r=_d(this.npcMaterial,n.look),i=gf(...n.tile);r.root.position.set(i.x,0,i.z);let a=Math.PI/4;r.root.rotation.y=a,r.weapon.rotation.x=n.look.weapon===`staff`?.35:-.3,r.armR.rotation.x=-.35,this.scene.add(r.root),this.obstacles.push({x:i.x,z:i.z,radius:.5}),this.npcs.push({def:n,rig:r,x:i.x,z:i.z,baseFacing:a,facing:a}),this.interactables.push({id:n.id,x:i.x,z:i.z,range:2.2,label:`대화`,title:n.name,action:()=>e(n.id)})}let f=(t,n,r,i,a,o)=>{let s=gf(n,r);this.interactables.push({id:t,x:s.x,z:s.z,range:i,label:a,title:o,action:()=>e(t)})};f(`portal`,14,4,4.2,`입장`,`차원문 광장`),f(`home`,23,11,2.6,`들어가기`,`차원집`),f(`forge`,8,4,3.2,`강화`,`대장간`),f(`shop`,7,12,3,`거래`,`상점`),f(`hall`,20,5,2.6,`직업`,`직업의 전당`),f(`storage`,11,16,2.2,`창고`,`창고`);let p=typeof r==`object`?r:r===`portal`?{...gf(14,7),facing:Math.PI/4}:r===`home`?{...gf(21,11),facing:-Math.PI/2}:{...gf(14,17),facing:Math.PI+Math.PI/4};this.playerStart=p}update(e,t){if(super.update(e,t),this.portalSwirl.rotation.z+=e*1.5,this.homeSwirl.rotation.z-=e*1.2,Math.random()<e*6){let e=Math.random()*Math.PI*2;this.particles.burst(this.portalSwirl.position.x+Math.cos(e)*1.2,.3,this.portalSwirl.position.z+Math.sin(e)*1.2,6222079,1,.3)}for(let n of this.npcs){let r=((Math.hypot(t.x-n.x,t.z-n.z)<4.5?Math.atan2(t.x-n.x,t.z-n.z):n.baseFacing)-n.facing+Math.PI)%(Math.PI*2)-Math.PI;r<-Math.PI&&(r+=Math.PI*2),n.facing+=r*Math.min(1,e*5),n.rig.root.rotation.y=n.facing,n.rig.body.position.y=.6+Math.sin(this.time*2+n.x)*.015}}},yf=e=>e<=3?`essence_low`:e<=5?`essence_mid`:`essence_high`,bf=new Set(pf.map(e=>e.id)),xf=70,Sf=class{container;renderer;camera;camTarget=new U;input;hud;screens;dialogue;buildBar;audio=new pl;fadeEl;progress;quests;factory;level;player;playerMaterial=new Ni({vertexColors:!0,flatShading:!0});combat;minimap=null;bigMap=!1;run=null;mode=`title`;building=!1;hitStopT=0;shakeT=0;lastTime=0;saveTimer=0;minimapTimer=0;factoryAcc=0;potionCd=0;deadTimer=0;attackBuffer=0;gathering=null;pendingNgPlus=!1;afterMenu=null;raycaster=new Ra;ground=new pr(new U(0,1,0),0);dragCell=null;ghostCell=null;constructor(e){this.container=e,this.renderer=new sl({antialias:!0,powerPreference:`high-performance`}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=1,e.appendChild(this.renderer.domElement),this.camera=new _a(-1,1,1,-1,.1,200),this.input=new ml(this.renderer.domElement);let t=()=>this.audio.play(`click`);this.hud=new cd(e,this.input,()=>this.audio.unlock()),this.buildBar=new rd(e,{onDone:()=>this.setBuilding(!1),onExpand:()=>this.openExpand(),onChange:()=>{},click:t}),this.screens=new Uu(e,t),this.dialogue=new id(e,{set:(e,t)=>this.progress.setFlag(e,t),run:e=>this.runCommand(e),shake:()=>this.shakeT=.6,click:t}),this.fadeEl=document.createElement(`div`),this.fadeEl.className=`scene-fade`,e.appendChild(this.fadeEl),window.addEventListener(`resize`,()=>this.resize()),window.addEventListener(`orientationchange`,()=>setTimeout(()=>this.resize(),250)),document.addEventListener(`visibilitychange`,()=>{document.hidden&&(this.saveNow(),this.mode===`play`&&this.openPause())}),window.addEventListener(`pagehide`,()=>this.saveNow()),window.addEventListener(`pointerdown`,()=>this.audio.unlock(),{capture:!0}),this.setupBuildPointer(),this.setProgress(new ju(Su())),this.enterDungeon(1,1,!0),this.resize(),this.showTitle(),this.lastTime=performance.now(),this.renderer.setAnimationLoop(e=>this.frame(e))}setProgress(e){this.progress=e,this.quests=new yu(e.data.quests,{count:t=>e.count(t),get stones(){return e.stoneCount},get cleared(){return e.data.cleared},flag:t=>e.flag(t)}),this.factory=new fu(e.data.factory,e.factorySize),this.factory.onCraft=(e,t)=>this.quests.event({type:`craft`,item:e,count:t})}showTitle(){this.mode=`title`,this.hud.setVisible(!1),this.screens.title(ku(),()=>this.startGame(Su(),!0),()=>{let e=Du();this.startGame(e??Su(),!e)})}startGame(e,t){Cf(),this.audio.unlock(),t&&Au(),this.setProgress(new ju(e)),this.audio.setEnabled(e.settings.sound),this.screens.close();let n=t?0:Math.min(28800,(Date.now()-e.lastSaved)/1e3);if(this.mode=`play`,this.enterVillage(`start`),t)this.saveNow(),this.playScript(`prologue`,()=>{let e=ql.m1_hunt;this.quests.accept(e),this.hud.toast(`퀘스트 수락: ${e.title}`,3e3),this.refreshHud()});else if(n>60&&this.progress.flag(`home`)&&e.factory.buildings.length){let e=this.boxSnapshot();this.factory.simulate(n);let t=this.boxSnapshot(),r=new Map;for(let[n,i]of t)i>(e.get(n)??0)&&r.set(n,i-(e.get(n)??0));this.openMenu(()=>this.screens.offlineReward(n,r,()=>this.resume())),this.saveNow()}}boxSnapshot(){let e=new Map;for(let t of this.factory.state.buildings)if(t.type===`box`&&t.mode===`out`)for(let[n,r]of Object.entries(t.buffer??{}))e.set(n,(e.get(n)??0)+r);return e}saveNow(){this.mode!==`title`&&this.progress.save()}resize(){let e=this.container.clientWidth,t=this.container.clientHeight;this.renderer.setSize(e,t);let n=e/t,r=n>=1?12:12*1.6/n;this.camera.top=r/2,this.camera.bottom=-r/2,this.camera.left=-r*n/2,this.camera.right=r*n/2,this.camera.updateProjectionMatrix(),this.hud.joystick.reset(),this.building&&this.fitBuildCamera()}fade(){this.fadeEl.classList.remove(`go`),this.fadeEl.offsetWidth,this.fadeEl.classList.add(`go`)}loadLevel(e,t){this.level&&this.level.dispose(),this.level=e,this.buildMode(!1),this.gathering=null,this.makePlayer(e.playerStart.x,e.playerStart.z,e.playerStart.facing),this.camTarget.set(e.playerStart.x,0,e.playerStart.z),e.sun.castShadow=this.progress.data.settings.shadows,this.hud.setMode(e.kind),this.hud.setBoss(null),this.minimap=new dd(e.grid,t),this.hud.setMinimap(this.minimap.canvas),this.setBigMap(!1),this.fade()}makePlayer(e,t,n,r=!1){let i=this.player;i&&i.rig.root.parent?.remove(i.rig.root);let a=bl[this.progress.data.currentClass];this.player=new bd(this.playerMaterial,a),this.player.facing=n,this.player.setPosition(e,t);let o=this.progress.stats();this.player.maxHp=o.maxHp,this.player.maxMp=o.maxMp,this.player.hp=r&&i?Math.min(o.maxHp,Math.max(1,i.hp)):o.maxHp,this.player.mp=r&&i?Math.min(o.maxMp,i.mp):o.maxMp,this.level.scene.add(this.player.rig.root),this.combat=new md({player:this.player,stats:()=>this.progress.stats(),level:()=>this.level,dungeon:()=>this.level instanceof Qd&&this.run?this.level:null,damageMonster:(e,t,n,r,i)=>this.damageMonster(e,t,n,r,i),shake:e=>this.shakeT=Math.max(this.shakeT,e),hitStop:e=>this.hitStopT=Math.max(this.hitStopT,e),sfx:e=>this.audio.play(e)}),this.hud.setClass(a.short,Pu(a.look.tunic),a.skills.map(e=>e.name))}enterVillage(e){let t=this.progress,n=new vf(e=>this.interactVillage(e),e=>e!==`stranger`||t.stoneCount>=4,t.flag(`home`)>0,e);this.loadLevel(n,!1),this.run=null,this.hud.setLocation(t.data.ngPlus?`차원마을 · ${t.data.ngPlus+1}회차`:`차원마을`,16767114),this.audio.playMusic(`village`);let r=0;for(;t.count(`bag_kit`)>0&&t.data.dimBag.length<12;)t.take(`bag_kit`,1),t.data.dimBag.push(null),r++;r&&this.hud.toast(`차원가방이 ${t.data.dimBag.length}칸으로 늘어났습니다`,3e3),this.quests.refreshDaily(t.maxTier,t.flag(`home`)>0)&&t.flag(`legend`)&&this.hud.toast(`촌장 에단의 일일 의뢰가 새로 올라왔습니다`,3e3),this.mode!==`dialogue`&&(this.mode=`play`),this.hud.setVisible(this.mode===`play`),this.refreshHud()}enterDungeon(e,t,n=!1){let r=new Qd($l(_l(),e,t),this.progress.data.ngPlus,{player:()=>this.player.position,cameraQuat:()=>this.camera.quaternion,hurtPlayer:(e,t,n)=>this.hurtPlayer(e,t,n),monsterKilled:e=>this.monsterKilled(e),monsterHitByProjectile:(e,t)=>this.combat.projectileHit(e,t),exit:()=>this.openWarp(),gather:e=>this.startGather(e),shake:e=>this.shakeT=Math.max(this.shakeT,e)}),i=!n&&this.run!==null,a=this.player;if(this.loadLevel(r,!0),n)return;if(i&&a)this.player.hp=Math.min(this.player.maxHp,a.hp+this.player.maxHp*.25),this.player.mp=Math.min(this.player.maxMp,a.mp+this.player.maxMp*.25),this.run.tier=e,this.run.stage=t,this.run.roomCleared=!1;else{let n=new fd(this.progress.data.dimBag.length,this.progress.data.dimBag);this.run={tier:e,stage:t,bag:new fd(20),dimBag:n,gold:0,exp:0,time:0,stagesCleared:0,roomCleared:!1}}this.hud.setLocation(`${e}-${t} · ${r.theme.name}`,r.theme.portalColor),this.audio.playMusic(`dungeon`),this.audio.play(`portal`),this.mode=`play`,this.hud.setVisible(!0);let o=t===10?` — 차원석을 지닌 수호자가 기다립니다`:t===5?` — 파수꾼이 지키고 있습니다`:``;this.hud.toast(`${e}-${t} · ${r.theme.name}${o}`,3e3),this.refreshHud()}enterHome(){this.factory.size=this.progress.factorySize;let e=new tf(this.factory,()=>{this.saveNow(),this.enterVillage(`home`)},e=>this.openBuilding(e));this.loadLevel(e,!1),this.hud.setLocation(`차원집 · ${this.factory.size}×${this.factory.size}`,12750079),this.audio.playMusic(`home`),this.audio.play(`portal`),this.mode=`play`,this.hud.setVisible(!0),this.refreshHud(),this.progress.flag(`homeTutorial`)||(this.progress.setFlag(`homeTutorial`),this.hud.toast(`오른쪽 위 망치 버튼(B 키)으로 건설 모드를 엽니다`,4e3))}openMenu(e,t){this.mode=`menu`,this.hud.setVisible(!1),this.buildBar.hide(),this.setBigMap(!1),e(),t&&(this.afterMenu=t)}resume(){this.mode=`play`,this.hud.setVisible(!0),this.building&&this.buildBar.show(e=>this.buildingUnlocked(e)),this.input.clearPressed(),this.applyStats(),this.refreshHud(),this.saveNow();let e=this.afterMenu;this.afterMenu=null,e?.()}openPause(){let e=this.progress.data;this.openMenu(()=>this.screens.pause({inDungeon:this.level instanceof Qd&&!!this.run,seed:this.level instanceof Qd?this.level.grid.seed:void 0,returnStones:this.progress.count(`return_stone`),shadows:e.settings.shadows,sound:e.settings.sound,onReturnStone:()=>{this.progress.take(`return_stone`,1)&&this.finishRun(`귀환석으로 귀환`)},onGiveUp:()=>this.fall(),onToggleShadows:t=>{e.settings.shadows=t,this.level.sun.castShadow=t},onToggleSound:t=>{e.settings.sound=t,this.audio.setEnabled(t)},onTitle:()=>{this.saveNow(),this.run=null,this.enterDungeon(1,1,!0),this.showTitle()},onClose:()=>this.resume()}))}openBagOrInventory(){if(this.run){let e=this.run;this.openMenu(()=>this.screens.bag(e.bag,e.dimBag,(t,n)=>(t===`bag`?e.bag.moveTo(n,e.dimBag):e.dimBag.moveTo(n,e.bag))>0,()=>this.resume()))}else this.openInventory(`equip`)}openInventory(e){this.openMenu(()=>this.screens.inventory(this.progress,this.quests,e,()=>this.applyStats(),()=>this.resume()))}applyStats(){if(!this.player)return;let e=this.progress.stats(),t=this.player.hp/this.player.maxHp;this.player.maxHp=e.maxHp,this.player.maxMp=e.maxMp,this.player.hp=Math.max(1,Math.round(e.maxHp*t)),this.player.mp=Math.min(this.player.mp,e.maxMp)}openExpand(){this.openMenu(()=>this.screens.factoryExpand(this.progress,()=>{let e=this.progress,t=zl[e.data.factory.sizeLevel+1];!t?.cost||e.data.gold<t.cost.gold||!e.takeAll(t.cost.items)||(e.data.gold-=t.cost.gold,e.data.factory.sizeLevel++,this.audio.play(`level`),this.afterMenu=()=>{this.building=!1,this.enterHome(),this.hud.toast(`차원집이 ${e.factorySize}×${e.factorySize}로 넓어졌습니다`)},this.screens.close())},()=>this.resume()))}setBigMap(e){this.bigMap=e&&!!this.minimap,this.hud.showBigMap(this.bigMap?this.minimap.bigCanvas:null),this.minimapTimer=0}interactVillage(e){let t=this.progress;switch(e){case`portal`:this.openStageSelect(t.maxTier);break;case`home`:t.flag(`home`)?(this.saveNow(),this.enterHome()):this.hud.toast(`문이 굳게 닫혀 있다. 세라라면 방법을 알지도 모른다.`);break;case`forge`:this.openMenu(()=>this.screens.forge(t,()=>this.applyStats(),()=>this.resume()));break;case`shop`:this.openMenu(()=>this.screens.shop(t,()=>this.audio.play(`coin`),()=>this.resume()));break;case`hall`:this.openMenu(()=>this.screens.classHall(t,e=>{this.afterMenu=()=>this.switchClass(e),this.screens.close()},()=>this.resume()));break;case`storage`:this.openInventory(`storage`);break;default:this.talk(e)}}openStageSelect(e){this.openMenu(()=>this.screens.stageSelect(this.progress,e,(e,t)=>{this.afterMenu=()=>this.enterDungeon(e,t),this.screens.close()},()=>this.resume()))}talk(e){let t=this.progress,n=this.quests,r=e,i=n.activeFor(r).find(e=>n.canComplete(e));if(i)return this.playSteps(i.complete,()=>this.completeQuest(i));if(wd(e,t)){let n=Cd(e,t);return n===`stone_n`&&t.setFlag(`stoneTalk${t.stoneCount}`),this.playScript(n)}let a=n.available(r)[0];if(a)return this.playSteps(a.offer,()=>this.offerQuest(a));let o=n.activeFor(r)[0];if(o?.pending)return this.playSteps(o.pending);let s=Cd(e,t);s===`stone_n`&&t.setFlag(`stoneTalk${t.stoneCount}`),this.playScript(s,()=>{e===`merchant`?this.interactVillage(`shop`):e===`smith`?this.interactVillage(`forge`):e===`engineer`&&n.isDone(`m4_factory`)?this.openBlueprints():e===`chief`&&t.flag(`legend`)&&this.openDaily()})}offerQuest(e){this.openMenu(()=>this.screens.questOffer(e,()=>{this.quests.accept(e);for(let t of e.onAccept?.flags??[])this.progress.setFlag(t);for(let[t,n]of Object.entries(e.onAccept?.items??{}))this.progress.add(t,n);this.audio.play(`pickup`),this.hud.toast(`퀘스트 수락: ${e.title}${e.onAccept?.flags?.includes(`tool_pickaxe`)?` · 곡괭이와 도끼를 받았다!`:``}`,3e3),this.screens.close()},()=>this.resume()))}completeQuest(e){let t=this.progress;if(!this.quests.canComplete(e))return;for(let n of e.objectives)n.type===`deliver`&&t.take(n.item,n.count);this.quests.finish(e);let n=e.rewards;n.gold&&(t.data.gold+=n.gold);for(let[e,r]of Object.entries(n.items??{}))t.add(e,r);for(let e of n.flags??[])t.setFlag(e);n.exp&&this.gainExp(n.exp),this.audio.play(`coin`);let r=[n.gold?`${n.gold} G`:``,n.exp?`경험치 ${n.exp}`:``,...Object.entries(n.items??{}).map(([e,t])=>`${Z[e].name}×${t}`)].filter(Boolean);if(this.hud.toast(`퀘스트 완료: ${e.title}${r.length?` (${r.join(`, `)})`:``}`,3500),this.saveNow(),n.script){let e={...this.player.position,facing:this.player.facing};this.playScript(n.script,()=>{n.flags?.includes(`home`)&&this.level instanceof vf&&this.enterVillage(e)})}this.refreshHud()}openDaily(){this.quests.refreshDaily(this.progress.maxTier,this.progress.flag(`home`)>0),this.openMenu(()=>this.screens.dailyBoard(this.progress,this.quests,e=>{let t=this.quests.state.daily.list[e];if(!t||t.claimed)return;t.claimed=!0;let n=this.progress;t.reward.gold&&(n.data.gold+=t.reward.gold);for(let[e,r]of Object.entries(t.reward.items??{}))n.add(e,r);t.reward.exp&&this.gainExp(t.reward.exp),this.audio.play(`coin`),this.hud.toast(`일일 의뢰 완료: ${t.title}`),this.openDaily()},()=>this.resume()))}openBlueprints(e){this.openMenu(()=>this.screens.blueprints(this.progress,e=>{let t=this.progress,n=Fl[e].blueprint;!n||t.flag(`bp_${e}`)||t.data.gold<n.gold||!t.takeAll(n.items)||(t.data.gold-=n.gold,t.setFlag(`bp_${e}`),this.audio.play(`coin`),this.openBlueprints(`${Fl[e].name} 도면을 샀습니다`))},()=>this.resume(),e))}switchClass(e){if(e===this.progress.data.currentClass)return;this.progress.data.currentClass=e;let t={...this.player.position};this.makePlayer(t.x,t.z,this.player.facing),this.level.effects.pillar(t.x,t.z,bl[e].look.tunic),this.audio.play(`level`),this.hud.toast(`${bl[e].name}(으)로 전환했습니다`),this.refreshHud()}playScript(e,t){this.playSteps(null,t,e)}playSteps(e,t,n){this.mode=`dialogue`,this.hud.setVisible(!1),this.setBigMap(!1);let r=()=>{if(this.pendingNgPlus){this.pendingNgPlus=!1,this.startNewCycle();return}this.mode=`play`,this.hud.setVisible(!0),this.input.clearPressed(),this.refreshHud(),this.saveNow(),t?.()};n?this.dialogue.play(n,r):this.dialogue.playSteps(e??[],r)}runCommand(e){let t=this.progress;switch(e){case`unlockHome`:t.setFlag(`home`),this.audio.play(`stone`);break;case`unlockMage`:t.unlockClass(`mage`),this.audio.play(`level`);break;case`unlockArcher`:t.unlockClass(`archer`),this.audio.play(`level`);break;case`ngplus`:this.pendingNgPlus=!0}}startNewCycle(){let e=this.progress;e.take(`resonator`,1),e.data.ngPlus++,e.data.dimStones=[],e.data.cleared=0,Td(e),this.saveNow(),this.mode=`dialogue`,this.enterVillage(`start`),this.playScript(`ngplus`)}damageMonster(e,t,n,r,i){if(!e.alive)return;let a=this.progress.stats(),o=Math.random()*100<a.crit,s=a.atk*t*(.9+Math.random()*.2)*(o?1.6:1),c=Math.max(1,Math.round(s*(40/(40+e.defense)))),l=e.damage(c,r,i,n),u=this.toScreen(e.x,e.rig.height*e.rig.root.scale.y+.3,e.z);this.hud.floatText(u.x,u.y,String(c),o?`#ffd23a`:`#ffffff`,o?`crit`:`normal`),this.level.particles.burst(e.x,.8,e.z,16777215,o?8:4,.8),this.audio.play(o?`crit`:`hit`),l&&this.monsterKilled(e)}hurtPlayer(e,t,n){let r=this.player;if(r.isInvulnerable||this.mode!==`play`)return;let i=this.progress.stats(),a=Math.max(1,Math.round(e*(.9+Math.random()*.2)*(60/(60+i.def))));r.hurt(a),this.gathering=null;let o=this.toScreen(r.position.x,2,r.position.z);this.hud.floatText(o.x,o.y,`-${a}`,`#ff5a5a`,`hurt`),this.shakeT=Math.max(this.shakeT,.25),this.audio.play(`hurt`);let s=this.level,c=Math.hypot(r.position.x-t,r.position.z-n)||1;iu(s.grid,r.position,(r.position.x-t)/c*.5,(r.position.z-n)/c*.5,fl.radius,s.obstacles),r.alive||(this.mode=`dead`,this.deadTimer=0,this.hud.setVisible(!1),this.audio.play(`fall`))}gainExp(e){let t=this.progress.addExp(e);t>0&&(this.applyStats(),this.player.hp=this.player.maxHp,this.player.mp=this.player.maxMp,this.level.effects.pillar(this.player.position.x,this.player.position.z,16769146),this.audio.play(`level`),this.hud.toast(`레벨 업! Lv.${this.progress.cls.level} · 스탯 포인트 +${t*5} (캐릭터 → 능력치)`,3e3))}monsterKilled(e){let t=this.run;if(!t||!(this.level instanceof Qd))return;let n=t.tier,r=new gl(_l());this.audio.play(`kill`),this.level.particles.burst(e.x,.7,e.z,16777215,12,1.2),this.quests.event({type:`kill`,tier:n,elite:e.kind===`elite`});let i=Math.round(e.exp*(1+this.progress.data.ngPlus*.5));t.exp+=i,this.gainExp(i);let a=e.kind===`boss`?25:e.kind===`midboss`?10:e.kind===`elite`?4:1,o=Math.round(r.int(2,5)*n*(1+(t.stage-1)*.1)*a);t.gold+=o,this.progress.data.gold+=o;let s=this.toScreen(e.x,1.8,e.z),c=0,l=(e,t)=>this.hud.floatText(s.x,s.y-22*c++,e,t,`small`);if(l(`+${o} G`,`#ffd23a`),r.chance(e.kind===`normal`?.6:1)){let r=e.kind===`boss`?8:e.kind===`midboss`?5:e.kind===`elite`?3:1,i=yf(n),a=t.bag.add(i,r);a?l(`+${a} ${Z[i].name}`,Pu(Z[i].color)):this.hud.toast(`가방이 가득 찼습니다`)}let u=e.kind===`boss`||e.kind===`midboss`?2:+!!r.chance(e.kind===`elite`?.4:.03),d=e.kind===`midboss`?.35:e.kind===`boss`?.3:e.kind===`elite`?.12:0;for(let e=0;e<u;e++){let e=Ml(r,n,this.progress.data.currentClass,d);t.bag.addEquip(e)?l(`${Tl[e.grade].name} ${Ol(e)}`,Pu(Tl[e.grade].color)):this.hud.toast(`가방이 가득 차서 장비를 줍지 못했습니다`)}if(e.kind===`midboss`){let e=n<=2?`stone_low`:n<=5?`stone_mid`:`stone_high`;t.bag.add(e,2)&&l(`+2 ${Z[e].name}`,Pu(Z[e].color)),t.bag.add(`potion`,2)}if(e.isBoss&&(this.hud.setBoss(null),this.audio.playMusic(`dungeon`)),e.isFinal){let t=this.progress;t.data.dimStones.includes(n)||(t.data.dimStones.push(n),this.audio.play(`stone`),this.level.effects.pillar(e.x,e.z,6222079,8),this.hud.toast(`차원석을 얻었다! (${t.stoneCount}/7)`,4e3))}this.refreshHud()}roomClear(){let e=this.run;e.roomCleared=!0,e.stagesCleared++;let t=Tu(e.tier,e.stage),n=this.progress;n.data.cleared=Math.max(n.data.cleared,t),this.quests.event({type:`stage`}),this.audio.play(`portal`),this.hud.toast(`${e.tier}-${e.stage} 클리어! 워프 게이트가 열렸습니다`,3e3),this.saveNow(),this.refreshHud()}openWarp(){let e=this.run;if(!e)return;let t=Tu(e.tier,e.stage),n=t<xf?wu(t+1):null;this.openMenu(()=>this.screens.warp(`${e.tier}-${e.stage}`,n?`${n.tier}-${n.stage}`:null,()=>{this.afterMenu=()=>this.enterDungeon(n.tier,n.stage),this.screens.close()},()=>{this.afterMenu=()=>this.finishRun(`귀환 성공`),this.screens.close()},()=>this.resume()))}startGather(e){if(!e.alive)return;let t=this.progress;if(e.def.style!==`chest`){let n=e.def.style===`tree`?`tool_axe`:`tool_pickaxe`;if(!t.flag(n)){this.hud.toast(n===`tool_axe`?`도끼가 있어야 나무를 벨 수 있습니다 (대장장이 고른)`:`곡괭이가 있어야 캘 수 있습니다 (대장장이 고른)`,2500);return}}this.gathering=e}updateGather(e){let t=this.gathering,n=this.player;if(!t)return;if(!t.alive||t.dying>0||Math.hypot(e.x,e.y)>.25||Math.hypot(t.x-n.position.x,t.z-n.position.z)>t.def.radius+2.2){this.gathering=null;return}if(!n.canAct)return;let r=t.def.style===`chest`;n.startAction({pose:r?`thrust`:`gather`,tool:t.def.style===`tree`?`axe`:`pickaxe`,duration:r?.35:.7,hitAt:.6,moveMult:0,onHit:()=>this.gather(t)},Math.atan2(t.x-n.position.x,t.z-n.position.z))}gather(e){if(!(this.level instanceof Qd)||!this.run)return;let t=this.toScreen(e.x,1.6,e.z),n=0;for(let r of this.level.hitNode(e)){let e=this.run.bag.add(r.itemId,r.count),i=Z[r.itemId];e>0&&(this.hud.floatText(t.x,t.y-n++*22,`+${e} ${i.name}`,Pu(i.color),`small`),this.quests.event({type:`gather`,item:r.itemId,count:e})),e<r.count&&(this.hud.toast(`가방이 가득 찼습니다`),this.gathering=null)}this.shakeT=Math.max(this.shakeT,.08),this.audio.play(`gather`),this.refreshHud()}finishRun(e){let t=this.run;if(!t)return;let n=this.progress,r=new Map;for(let e of[t.bag,t.dimBag])for(let[t,n]of e.totals())r.set(t,(r.get(t)??0)+n);let i=[...t.bag.equips(),...t.dimBag.equips()];n.depositSlots(t.bag.slots),n.depositSlots(t.dimBag.slots),t.dimBag.clear(),n.data.dimBag=t.dimBag.slots,n.setFlag(`returned`),this.audio.play(`portal`);let a=this.exploredRatio();this.run=null,this.saveNow(),this.openMenu(()=>this.screens.result({title:e,items:r,equips:i,seconds:t.time,explored:a,gold:t.gold,exp:t.exp,stages:t.stagesCleared},()=>this.resume()),()=>{this.enterVillage(`portal`),this.saveNow()})}fall(){let e=this.run;if(!e)return;let t=this.progress,n=e.bag.totals(),r=e.bag.equips().length,i=e.dimBag.totals(),a=e.dimBag.equips();t.depositSlots(e.dimBag.slots),e.dimBag.clear(),t.data.dimBag=e.dimBag.slots,t.setFlag(`returned`);let o=this.exploredRatio();this.run=null,this.saveNow(),this.openMenu(()=>this.screens.result({title:`쓰러졌다…`,note:`틈새가 몸을 마을로 밀어냈다. 일반 가방의 짐은 틈새에 삼켜졌다.`,items:i,equips:a,lost:n,lostEquips:r,seconds:e.time,explored:o,gold:e.gold,exp:e.exp,stages:e.stagesCleared},()=>this.resume()),()=>{this.enterVillage(`portal`),this.saveNow()})}exploredRatio(){if(!this.minimap||!(this.level instanceof Qd))return 0;let e=this.level.grid,t=0,n=0;for(let r=0;r<e.height;r++)for(let i=0;i<e.width;i++)Zl(e,i,r)&&(t++,this.minimap.isExplored(i,r)&&n++);return t?n/t:0}buildingUnlocked(e){return!Fl[e].blueprint||this.progress.flag(`bp_${e}`)>0}openBuilding(e){let t=this.progress,n=()=>this.saveNow();e.type===`generator`?this.openMenu(()=>this.screens.generator(this.factory,e,t,n,()=>this.resume())):e.type===`box`?this.openMenu(()=>this.screens.box(e,t,n,()=>this.resume())):su.has(e.type)&&this.openMenu(()=>this.screens.machine(this.factory,e,t,n,()=>this.resume()))}buildMode(e){this.building=e,this.hud.setBuilding(e),e?this.buildBar.show(e=>this.buildingUnlocked(e)):this.buildBar.hide(),this.level instanceof tf&&(this.level.setBuildMode(e),e||this.level.hideGhost()),this.camera.zoom=1,this.camera.updateProjectionMatrix(),e&&this.fitBuildCamera()}setBuilding(e){this.buildMode(e),this.saveNow()}fitBuildCamera(){if(!(this.level instanceof tf))return;let e=this.factory.size*2,t=this.camera.top-this.camera.bottom,n=this.camera.right-this.camera.left;this.camera.zoom=Math.min(1,n/(e*1.55),t/(e*1.25)),this.camera.updateProjectionMatrix()}pickCell(e){let t=this.renderer.domElement.getBoundingClientRect(),n=new H((e.clientX-t.left)/t.width*2-1,-((e.clientY-t.top)/t.height)*2+1);this.raycaster.setFromCamera(n,this.camera);let r=new U;if(!this.raycaster.ray.intersectPlane(this.ground,r))return null;let i=Math.floor(r.x/2),a=Math.floor(r.z/2);return this.factory.inBounds(i,a)?{x:i,y:a}:null}setupBuildPointer(){let e=this.renderer.domElement,t=()=>this.buildBar.tool===`belt`||this.buildBar.tool===`wire`||this.buildBar.tool===`remove`;e.addEventListener(`pointerdown`,n=>{if(!this.building||this.mode!==`play`)return;let r=this.pickCell(n);r&&(e.setPointerCapture(n.pointerId),t()?(this.dragCell=r,this.applyTool(r,null)):(this.ghostCell=r,this.updateGhost(r)))}),e.addEventListener(`pointermove`,e=>{if(!this.building||!(this.level instanceof tf))return;let n=this.pickCell(e);if(!t()){n&&(this.ghostCell||e.pointerType===`mouse`)?(this.ghostCell&&=n,this.updateGhost(n)):n||this.level.hideGhost();return}if(this.level.hideGhost(),n?this.level.showCursor(n.x,n.y,this.buildBar.tool===`remove`?!!this.factory.at(n.x,n.y):!this.factory.at(n.x,n.y)):this.level.hideCursor(),!this.dragCell||!n||n.x===this.dragCell.x&&n.y===this.dragCell.y)return;let r=this.dragCell;for(;this.dragCell&&(r.x!==n.x||r.y!==n.y);){let e=Math.sign(n.x-r.x),t=e===0?Math.sign(n.y-r.y):0,i={x:r.x+e,y:r.y+t};this.applyTool(i,r),r=i}this.dragCell&&=n});let n=e=>{if(this.dragCell=null,this.ghostCell&&this.building&&e.type===`pointerup`){let t=this.ghostCell;this.ghostCell=null,this.applyTool(t,null),e.pointerType!==`mouse`&&this.level instanceof tf&&this.level.hideGhost()}this.ghostCell=null};e.addEventListener(`pointerup`,n),e.addEventListener(`pointercancel`,n)}updateGhost(e){if(!(this.level instanceof tf))return;let t=this.buildBar.tool;if(t===`remove`)return;let n=this.factory.at(e.x,e.y),r=(!n||n.type===t)&&this.progress.hasAll(Fl[t].cost);this.level.showGhost(t,e.x,e.y,n&&n.type===t?n.dir:this.buildBar.dir,r),this.level.showCursor(e.x,e.y,r)}applyTool(e,t){let n=this.factory,r=this.progress,i=this.buildBar.tool,a=n.at(e.x,e.y);if(i===`remove`){if(!a)return;n.remove(e.x,e.y,(e,t)=>r.add(e,t));for(let[e,t]of Object.entries(Fl[a.type].cost))r.add(e,t);this.audio.play(`build`);return}let o=this.buildBar.dir;if(t){let r=e.x-t.x,a=e.y-t.y;o=r===1?0:a===1?1:r===-1?2:3;let s=n.at(t.x,t.y);s&&s.type===`belt`&&i===`belt`&&(s.dir=o)}if(a){a.type===i&&!t?(n.rotate(e.x,e.y),this.audio.play(`click`)):a.type===i&&i===`belt`&&(a.dir=o);return}let s=Fl[i].cost;if(!r.hasAll(s)){let e=Object.entries(s).map(([e,t])=>`${Z[e].name} ${r.count(e)}/${t}`).join(`, `);this.hud.toast(`재료가 부족합니다 (${e})`),this.dragCell=null;return}r.takeAll(s),n.place(i,e.x,e.y,o)&&(i===`generator`&&r.setFlag(`factoryBuilt`),this.quests.event({type:`build`,building:i}),this.audio.play(`build`),this.level.particles.burst((e.x+.5)*2,.5,(e.y+.5)*2,Fl[i].color,5,.6))}frame(e){let t=Math.min(.05,(e-this.lastTime)/1e3);if(this.lastTime=e,this.mode!==`title`&&this.progress.flag(`home`))for(this.factoryAcc+=t;this.factoryAcc>=.1;)this.factory.step(.1),this.factoryAcc-=.1;switch(this.mode){case`play`:this.updatePlay(t);break;case`dead`:this.deadTimer+=t,this.player.update(t,{move:{x:0,y:0},applyMove:()=>{}}),this.level.update(t,this.player.position),this.deadTimer>1.6&&this.mode===`dead`&&this.fall();break;case`menu`:(this.input.consume(`pause`)||this.input.consume(`bag`)&&this.screens.isOpen)&&this.screens.close();break;default:this.level.update(t,this.player.position),this.player.update(t,{move:{x:0,y:0},applyMove:()=>{}})}this.mode!==`title`&&(this.saveTimer+=t,this.saveTimer>30&&(this.saveTimer=0,this.saveNow())),this.updateCamera(t),this.updateLabels(),this.renderer.render(this.level.scene,this.camera)}nearestInteractable(){let e=null,t=1/0,n=this.player.position;for(let r of this.level.interactables){if(r.enabled&&!r.enabled())continue;let i=Math.hypot(r.x-n.x,r.z-n.z);i<r.range&&i<t&&(t=i,e=r)}return e}updatePlay(e){let t=this.input;if(t.consume(`pause`))return this.bigMap?this.setBigMap(!1):this.openPause();if(t.consume(`bag`))return this.openBagOrInventory();if(t.consume(`map`)&&this.setBigMap(!this.bigMap),t.consume(`build`)&&this.level instanceof tf&&this.setBuilding(!this.building),t.consume(`attack`)&&(this.attackBuffer=.35),this.attackBuffer=Math.max(0,this.attackBuffer-e),this.hitStopT>0){this.hitStopT-=e;return}let n=this.player;this.combat.update(e),this.potionCd=Math.max(0,this.potionCd-e),this.run&&(this.run.time+=e);let r=this.building?{x:0,y:0}:t.getMove(),i=this.building?null:this.nearestInteractable();if(this.hud.setInteract(i?i.label:null),t.consume(`interact`)&&i&&(i.action(),this.mode!==`play`))return;t.consume(`dodge`)&&!this.building&&n.startRoll(r)&&(this.gathering=null,this.audio.play(`dash`));for(let e=0;e<3;e++)if(t.consume(`skill${e+1}`)){let t=this.combat.useSkill(e);t?this.hud.toast(t):this.gathering=null}t.consume(`potion`)&&this.drinkPotion(),(this.attackBuffer>0||t.attackHeld)&&!this.building&&n.canAct&&(this.attackBuffer=0,this.gathering=null,this.combat.basicAttack()),this.building||this.updateGather(r);let a=this.level,o=a instanceof Qd?a.playerObstacles():a.obstacles;if(n.update(e,{move:r,applyMove:(e,t)=>iu(a.grid,n.position,e,t,fl.radius,o)}),a.update(e,n.position),a instanceof Qd&&this.run){let e=a.boss;e&&e.alive&&e.aggro&&(this.hud.setBoss(`${e.name}${e.phase2?` · 격노`:``}`,e.hp/e.maxHp),this.audio.playMusic(`boss`)),!this.run.roomCleared&&a.exitOpen&&this.roomClear()}this.updateMap(e),this.refreshHud()}updateMap(e){let t=this.minimap;if(!t)return;let n=this.player,r=this.level;if(r instanceof Qd&&t.reveal(n.position.x,n.position.z),this.minimapTimer-=e,this.minimapTimer>0)return;this.minimapTimer=this.bigMap?.2:.1;let i=[];if(r instanceof Qd){for(let e of r.nodes)e.alive&&i.push({x:e.x,z:e.z,color:Pu(e.def.accentColor),size:.45});for(let e of r.monsters)e.alive&&i.push({x:e.x,z:e.z,color:e.isBoss?`#ff3030`:`#ff7a7a`,size:e.isBoss?1:.4,label:e.isBoss?e.name:void 0});let e=r.portals.find(e=>e.kind===`exit`);i.push({x:e.x,z:e.z,color:r.exitOpen?Pu(r.theme.portalColor):`#777`,size:1.1,label:`워프 게이트`})}else for(let e of r.interactables){if(!e.title)continue;let t=bf.has(e.id);i.push({x:e.x,z:e.z,color:t?`#ffe07a`:`#8fd8ff`,size:t?.7:.9,label:e.title})}t.draw({...n.position,facing:n.facing},i,!1),this.bigMap&&t.draw({...n.position,facing:n.facing},i,!0)}drinkPotion(){if(!(this.level instanceof Qd))return this.hud.toast(`물약은 던전에서 마실 수 있습니다`);if(this.potionCd>0)return;if(!this.progress.take(`potion`,1))return this.hud.toast(`물약이 없습니다 (상점·연금 솥에서 구하기)`);let e=this.player;e.hp=Math.min(e.maxHp,e.hp+e.maxHp*.5),e.mp=Math.min(e.maxMp,e.mp+e.maxMp*.5),this.potionCd=1,this.level.effects.ring(e.position.x,e.position.z,2,16743066,.4),this.audio.play(`pickup`)}refreshHud(){let e=this.progress,t=this.player,n=e.cls;if(this.hud.setBars(t.hp,t.maxHp,t.mp,t.maxMp,n.exp,Sl(n.level),n.level),this.hud.setGold(e.data.gold),this.run&&this.level instanceof Qd){let e=this.level,t=e.aliveCount,n=e.boss&&e.boss.alive?` · ${e.boss.name}`:``;this.hud.setObjective(t>0?`남은 몬스터 ${t}${n} (M: 지도)`:`워프 게이트로 가자 (다음 방 / 마을)`)}else this.hud.setObjective(Sd(e,this.quests));this.hud.setPotions(e.count(`potion`)),this.hud.setDodgeCooldown(t.rollCooldown/(fl.rollCooldown+fl.rollTime));let r=t.cls.skills;this.hud.setSkills(this.combat.cooldowns.map((e,t)=>e/r[t].cooldown),r.map(e=>t.mp>=e.mp)),this.run&&this.hud.setBagCount(this.run.bag.used,20)}updateLabels(){if(this.mode!==`play`){this.hud.setLabels([]),this.hud.setBubbles([]);return}let e=[],t=this.player.position;if(!this.building)for(let n of this.level.interactables){if(!n.title||Math.hypot(n.x-t.x,n.z-t.z)>14)continue;let r=bf.has(n.id),i=``;if(r){let e=n.id;this.quests.activeFor(e).some(e=>this.quests.canComplete(e))?i=`? `:(wd(n.id,this.progress)||this.quests.available(e).length)&&(i=`! `)}let a=this.toScreen(n.x,r?2.3:n.id===`portal`?4.6:3.3,n.z);e.push({text:`${i}${n.title}`,x:a.x,y:a.y,accent:!!i})}this.hud.setLabels(e),this.level instanceof tf?this.hud.setBubbles(this.level.producing().map(({b:e,x:t,z:n})=>{let r=this.toScreen(t,2.6,n),i=uu[e.crafting];return{x:r.x,y:r.y,color:Pu(Z[i.output].color),progress:e.progress??0,onClick:()=>this.openBuilding(e)}})):this.hud.setBubbles([])}toScreen(e,t,n){let r=new U(e,t,n).project(this.camera);return{x:(r.x+1)/2*this.container.clientWidth,y:(1-r.y)/2*this.container.clientHeight}}updateCamera(e){let t=this.building&&this.level instanceof tf?this.level.center:this.player.position,n=1-Math.exp(-e*7);this.camTarget.x+=(t.x-this.camTarget.x)*n,this.camTarget.z+=(t.z-this.camTarget.z)*n,this.shakeT=Math.max(0,this.shakeT-e);let r=this.shakeT*.7,i=(Math.random()-.5)*r,a=(Math.random()-.5)*r;this.camera.position.set(this.camTarget.x+cl.x+i,cl.y,this.camTarget.z+cl.z+a),this.camera.lookAt(this.camTarget.x+i,0,this.camTarget.z+a)}debugInfo(){return{mode:this.mode,level:this.level.kind,player:{...this.player.position,hp:this.player.hp},gold:this.progress.data.gold,stones:this.progress.data.dimStones,cleared:this.progress.data.cleared}}};function Cf(){window.matchMedia(`(pointer: coarse)`).matches&&document.documentElement.requestFullscreen?.().then(()=>screen.orientation.lock?.(`landscape`)).catch(()=>{})}var wf=new Sf(document.getElementById(`app`));new URLSearchParams(location.search).has(`debug`)&&(window.game=wf),`serviceWorker`in navigator&&navigator.serviceWorker.register(`./sw.js`).catch(()=>{});