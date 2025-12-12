import require$$0$2, { Transform } from 'stream';
import net from 'net';
import require$$0$3 from 'events';
import require$$1$1 from 'https';
import require$$2 from 'http';
import require$$4 from 'tls';
import require$$1 from 'crypto';
import require$$7 from 'url';
import require$$0 from 'zlib';
import require$$0$1 from 'buffer';
import { networkInterfaces } from 'os';
import fs, { readFileSync } from 'fs';
import { memoryUsage } from 'process';
import path from 'path';

var version$1 = "5.0.1";
var pkg = {
	version: version$1};

var t$1,e$1={},r$1={};var n$1,i$1,o$1={};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */function f$1(){return n$1||(n$1=1,o$1.read=function(t,e,r,n,i){var o,f,u=8*i-n-1,s=(1<<u)-1,h=s>>1,a=-7,c=r?i-1:0,l=r?-1:1,p=t[e+c];for(c+=l,o=p&(1<<-a)-1,p>>=-a,a+=u;a>0;o=256*o+t[e+c],c+=l,a-=8);for(f=o&(1<<-a)-1,o>>=-a,a+=n;a>0;f=256*f+t[e+c],c+=l,a-=8);if(0===o)o=1-h;else {if(o===s)return f?NaN:1/0*(p?-1:1);f+=Math.pow(2,n),o-=h;}return (p?-1:1)*f*Math.pow(2,o-n)},o$1.write=function(t,e,r,n,i,o){var f,u,s,h=8*o-i-1,a=(1<<h)-1,c=a>>1,l=23===i?Math.pow(2,-24)-Math.pow(2,-77):0,p=n?0:o-1,y=n?1:-1,g=e<0||0===e&&1/e<0?1:0;for(e=Math.abs(e),isNaN(e)||e===1/0?(u=isNaN(e)?1:0,f=a):(f=Math.floor(Math.log(e)/Math.LN2),e*(s=Math.pow(2,-f))<1&&(f--,s*=2),(e+=f+c>=1?l/s:l*Math.pow(2,1-c))*s>=2&&(f++,s/=2),f+c>=a?(u=0,f=a):f+c>=1?(u=(e*s-1)*Math.pow(2,i),f+=c):(u=e*Math.pow(2,c-1)*Math.pow(2,i),f=0));i>=8;t[r+p]=255&u,p+=y,u/=256,i-=8);for(f=f<<i|u,h+=i;h>0;t[r+p]=255&f,p+=y,f/=256,h-=8);t[r+p-y]|=128*g;}),o$1}
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */var u$1=(i$1||(i$1=1,function(e){const n=function(){if(t$1)return r$1;t$1=1,r$1.byteLength=function(t){var e=u(t),r=e[0],n=e[1];return 3*(r+n)/4-n},r$1.toByteArray=function(t){var e,r,o=u(t),f=o[0],s=o[1],h=new i(function(t,e,r){return 3*(e+r)/4-r}(0,f,s)),a=0,c=s>0?f-4:f;for(r=0;r<c;r+=4)e=n[t.charCodeAt(r)]<<18|n[t.charCodeAt(r+1)]<<12|n[t.charCodeAt(r+2)]<<6|n[t.charCodeAt(r+3)],h[a++]=e>>16&255,h[a++]=e>>8&255,h[a++]=255&e;return 2===s&&(e=n[t.charCodeAt(r)]<<2|n[t.charCodeAt(r+1)]>>4,h[a++]=255&e),1===s&&(e=n[t.charCodeAt(r)]<<10|n[t.charCodeAt(r+1)]<<4|n[t.charCodeAt(r+2)]>>2,h[a++]=e>>8&255,h[a++]=255&e),h},r$1.fromByteArray=function(t){for(var r,n=t.length,i=n%3,o=[],f=16383,u=0,s=n-i;u<s;u+=f)o.push(h(t,u,u+f>s?s:u+f));return 1===i?(r=t[n-1],o.push(e[r>>2]+e[r<<4&63]+"==")):2===i&&(r=(t[n-2]<<8)+t[n-1],o.push(e[r>>10]+e[r>>4&63]+e[r<<2&63]+"=")),o.join("")};for(var e=[],n=[],i="undefined"!=typeof Uint8Array?Uint8Array:Array,o="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",f=0;f<64;++f)e[f]=o[f],n[o.charCodeAt(f)]=f;function u(t){var e=t.length;if(e%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var r=t.indexOf("=");return  -1===r&&(r=e),[r,r===e?0:4-r%4]}function s(t){return e[t>>18&63]+e[t>>12&63]+e[t>>6&63]+e[63&t]}function h(t,e,r){for(var n,i=[],o=e;o<r;o+=3)n=(t[o]<<16&16711680)+(t[o+1]<<8&65280)+(255&t[o+2]),i.push(s(n));return i.join("")}return n["-".charCodeAt(0)]=62,n["_".charCodeAt(0)]=63,r$1}(),i=f$1(),o="function"==typeof Symbol&&"function"==typeof Symbol.for?Symbol.for("nodejs.util.inspect.custom"):null;e.Buffer=h,e.SlowBuffer=function(t){return +t!=t&&(t=0),h.alloc(+t)},e.INSPECT_MAX_BYTES=50;const u=2147483647;function s(t){if(t>u)throw new RangeError('The value "'+t+'" is invalid for option "size"');const e=new Uint8Array(t);return Object.setPrototypeOf(e,h.prototype),e}function h(t,e,r){if("number"==typeof t){if("string"==typeof e)throw new TypeError('The "string" argument must be of type string. Received type number');return l(t)}return a(t,e,r)}function a(t,e,r){if("string"==typeof t)return function(t,e){if("string"==typeof e&&""!==e||(e="utf8"),!h.isEncoding(e))throw new TypeError("Unknown encoding: "+e);const r=0|d(t,e);let n=s(r);const i=n.write(t,e);return i!==r&&(n=n.slice(0,i)),n}(t,e);if(ArrayBuffer.isView(t))return function(t){if(H(t,Uint8Array)){const e=new Uint8Array(t);return y(e.buffer,e.byteOffset,e.byteLength)}return p(t)}(t);if(null==t)throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof t);if(H(t,ArrayBuffer)||t&&H(t.buffer,ArrayBuffer))return y(t,e,r);if("undefined"!=typeof SharedArrayBuffer&&(H(t,SharedArrayBuffer)||t&&H(t.buffer,SharedArrayBuffer)))return y(t,e,r);if("number"==typeof t)throw new TypeError('The "value" argument must not be of type number. Received type number');const n=t.valueOf&&t.valueOf();if(null!=n&&n!==t)return h.from(n,e,r);const i=function(t){if(h.isBuffer(t)){const e=0|g(t.length),r=s(e);return 0===r.length||t.copy(r,0,0,e),r}return void 0!==t.length?"number"!=typeof t.length||Z(t.length)?s(0):p(t):"Buffer"===t.type&&Array.isArray(t.data)?p(t.data):void 0}(t);if(i)return i;if("undefined"!=typeof Symbol&&null!=Symbol.toPrimitive&&"function"==typeof t[Symbol.toPrimitive])return h.from(t[Symbol.toPrimitive]("string"),e,r);throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof t)}function c(t){if("number"!=typeof t)throw new TypeError('"size" argument must be of type number');if(t<0)throw new RangeError('The value "'+t+'" is invalid for option "size"')}function l(t){return c(t),s(t<0?0:0|g(t))}function p(t){const e=t.length<0?0:0|g(t.length),r=s(e);for(let n=0;n<e;n+=1)r[n]=255&t[n];return r}function y(t,e,r){if(e<0||t.byteLength<e)throw new RangeError('"offset" is outside of buffer bounds');if(t.byteLength<e+(r||0))throw new RangeError('"length" is outside of buffer bounds');let n;return n=void 0===e&&void 0===r?new Uint8Array(t):void 0===r?new Uint8Array(t,e):new Uint8Array(t,e,r),Object.setPrototypeOf(n,h.prototype),n}function g(t){if(t>=u)throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+u.toString(16)+" bytes");return 0|t}function d(t,e){if(h.isBuffer(t))return t.length;if(ArrayBuffer.isView(t)||H(t,ArrayBuffer))return t.byteLength;if("string"!=typeof t)throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type '+typeof t);const r=t.length,n=arguments.length>2&&true===arguments[2];if(!n&&0===r)return 0;let i=false;for(;;)switch(e){case "ascii":case "latin1":case "binary":return r;case "utf8":case "utf-8":return q(t).length;case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":return 2*r;case "hex":return r>>>1;case "base64":return W(t).length;default:if(i)return n?-1:q(t).length;e=(""+e).toLowerCase(),i=true;}}function b(t,e,r){let n=false;if((void 0===e||e<0)&&(e=0),e>this.length)return "";if((void 0===r||r>this.length)&&(r=this.length),r<=0)return "";if((r>>>=0)<=(e>>>=0))return "";for(t||(t="utf8");;)switch(t){case "hex":return S(this,e,r);case "utf8":case "utf-8":return O(this,e,r);case "ascii":return _(this,e,r);case "latin1":case "binary":return R(this,e,r);case "base64":return v(this,e,r);case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":return N(this,e,r);default:if(n)throw new TypeError("Unknown encoding: "+t);t=(t+"").toLowerCase(),n=true;}}function w(t,e,r){const n=t[e];t[e]=t[r],t[r]=n;}function B(t,e,r,n,i){if(0===t.length)return  -1;if("string"==typeof r?(n=r,r=0):r>2147483647?r=2147483647:r<-2147483648&&(r=-2147483648),Z(r=+r)&&(r=i?0:t.length-1),r<0&&(r=t.length+r),r>=t.length){if(i)return  -1;r=t.length-1;}else if(r<0){if(!i)return  -1;r=0;}if("string"==typeof e&&(e=h.from(e,n)),h.isBuffer(e))return 0===e.length?-1:m(t,e,r,n,i);if("number"==typeof e)return e&=255,"function"==typeof Uint8Array.prototype.indexOf?i?Uint8Array.prototype.indexOf.call(t,e,r):Uint8Array.prototype.lastIndexOf.call(t,e,r):m(t,[e],r,n,i);throw new TypeError("val must be string, number or Buffer")}function m(t,e,r,n,i){let o,f=1,u=t.length,s=e.length;if(void 0!==n&&("ucs2"===(n=String(n).toLowerCase())||"ucs-2"===n||"utf16le"===n||"utf-16le"===n)){if(t.length<2||e.length<2)return  -1;f=2,u/=2,s/=2,r/=2;}function h(t,e){return 1===f?t[e]:t.readUInt16BE(e*f)}if(i){let n=-1;for(o=r;o<u;o++)if(h(t,o)===h(e,-1===n?0:o-n)){if(-1===n&&(n=o),o-n+1===s)return n*f}else  -1!==n&&(o-=o-n),n=-1;}else for(r+s>u&&(r=u-s),o=r;o>=0;o--){let r=true;for(let n=0;n<s;n++)if(h(t,o+n)!==h(e,n)){r=false;break}if(r)return o}return  -1}function E(t,e,r,n){r=Number(r)||0;const i=t.length-r;n?(n=Number(n))>i&&(n=i):n=i;const o=e.length;let f;for(n>o/2&&(n=o/2),f=0;f<n;++f){const n=parseInt(e.substr(2*f,2),16);if(Z(n))return f;t[r+f]=n;}return f}function A(t,e,r,n){return X(q(e,t.length-r),t,r,n)}function U(t,e,r,n){return X(function(t){const e=[];for(let r=0;r<t.length;++r)e.push(255&t.charCodeAt(r));return e}(e),t,r,n)}function I(t,e,r,n){return X(W(e),t,r,n)}function L(t,e,r,n){return X(function(t,e){let r,n,i;const o=[];for(let f=0;f<t.length&&!((e-=2)<0);++f)r=t.charCodeAt(f),n=r>>8,i=r%256,o.push(i),o.push(n);return o}(e,t.length-r),t,r,n)}function v(t,e,r){return 0===e&&r===t.length?n.fromByteArray(t):n.fromByteArray(t.slice(e,r))}function O(t,e,r){r=Math.min(t.length,r);const n=[];let i=e;for(;i<r;){const e=t[i];let o=null,f=e>239?4:e>223?3:e>191?2:1;if(i+f<=r){let r,n,u,s;switch(f){case 1:e<128&&(o=e);break;case 2:r=t[i+1],128==(192&r)&&(s=(31&e)<<6|63&r,s>127&&(o=s));break;case 3:r=t[i+1],n=t[i+2],128==(192&r)&&128==(192&n)&&(s=(15&e)<<12|(63&r)<<6|63&n,s>2047&&(s<55296||s>57343)&&(o=s));break;case 4:r=t[i+1],n=t[i+2],u=t[i+3],128==(192&r)&&128==(192&n)&&128==(192&u)&&(s=(15&e)<<18|(63&r)<<12|(63&n)<<6|63&u,s>65535&&s<1114112&&(o=s));}}null===o?(o=65533,f=1):o>65535&&(o-=65536,n.push(o>>>10&1023|55296),o=56320|1023&o),n.push(o),i+=f;}return function(t){const e=t.length;if(e<=T)return String.fromCharCode.apply(String,t);let r="",n=0;for(;n<e;)r+=String.fromCharCode.apply(String,t.slice(n,n+=T));return r}(n)}e.kMaxLength=u,h.TYPED_ARRAY_SUPPORT=function(){try{const t=new Uint8Array(1),e={foo:function(){return 42}};return Object.setPrototypeOf(e,Uint8Array.prototype),Object.setPrototypeOf(t,e),42===t.foo()}catch(t){return  false}}(),h.TYPED_ARRAY_SUPPORT||"undefined"==typeof console||"function"!=typeof console.error||console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."),Object.defineProperty(h.prototype,"parent",{enumerable:true,get:function(){if(h.isBuffer(this))return this.buffer}}),Object.defineProperty(h.prototype,"offset",{enumerable:true,get:function(){if(h.isBuffer(this))return this.byteOffset}}),h.poolSize=8192,h.from=function(t,e,r){return a(t,e,r)},Object.setPrototypeOf(h.prototype,Uint8Array.prototype),Object.setPrototypeOf(h,Uint8Array),h.alloc=function(t,e,r){return function(t,e,r){return c(t),t<=0?s(t):void 0!==e?"string"==typeof r?s(t).fill(e,r):s(t).fill(e):s(t)}(t,e,r)},h.allocUnsafe=function(t){return l(t)},h.allocUnsafeSlow=function(t){return l(t)},h.isBuffer=function(t){return null!=t&&true===t._isBuffer&&t!==h.prototype},h.compare=function(t,e){if(H(t,Uint8Array)&&(t=h.from(t,t.offset,t.byteLength)),H(e,Uint8Array)&&(e=h.from(e,e.offset,e.byteLength)),!h.isBuffer(t)||!h.isBuffer(e))throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');if(t===e)return 0;let r=t.length,n=e.length;for(let i=0,o=Math.min(r,n);i<o;++i)if(t[i]!==e[i]){r=t[i],n=e[i];break}return r<n?-1:n<r?1:0},h.isEncoding=function(t){switch(String(t).toLowerCase()){case "hex":case "utf8":case "utf-8":case "ascii":case "latin1":case "binary":case "base64":case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":return  true;default:return  false}},h.concat=function(t,e){if(!Array.isArray(t))throw new TypeError('"list" argument must be an Array of Buffers');if(0===t.length)return h.alloc(0);let r;if(void 0===e)for(e=0,r=0;r<t.length;++r)e+=t[r].length;const n=h.allocUnsafe(e);let i=0;for(r=0;r<t.length;++r){let e=t[r];if(H(e,Uint8Array))i+e.length>n.length?(h.isBuffer(e)||(e=h.from(e)),e.copy(n,i)):Uint8Array.prototype.set.call(n,e,i);else {if(!h.isBuffer(e))throw new TypeError('"list" argument must be an Array of Buffers');e.copy(n,i);}i+=e.length;}return n},h.byteLength=d,h.prototype._isBuffer=true,h.prototype.swap16=function(){const t=this.length;if(t%2!=0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(let e=0;e<t;e+=2)w(this,e,e+1);return this},h.prototype.swap32=function(){const t=this.length;if(t%4!=0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(let e=0;e<t;e+=4)w(this,e,e+3),w(this,e+1,e+2);return this},h.prototype.swap64=function(){const t=this.length;if(t%8!=0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(let e=0;e<t;e+=8)w(this,e,e+7),w(this,e+1,e+6),w(this,e+2,e+5),w(this,e+3,e+4);return this},h.prototype.toString=function(){const t=this.length;return 0===t?"":0===arguments.length?O(this,0,t):b.apply(this,arguments)},h.prototype.toLocaleString=h.prototype.toString,h.prototype.equals=function(t){if(!h.isBuffer(t))throw new TypeError("Argument must be a Buffer");return this===t||0===h.compare(this,t)},h.prototype.inspect=function(){let t="";const r=e.INSPECT_MAX_BYTES;return t=this.toString("hex",0,r).replace(/(.{2})/g,"$1 ").trim(),this.length>r&&(t+=" ... "),"<Buffer "+t+">"},o&&(h.prototype[o]=h.prototype.inspect),h.prototype.compare=function(t,e,r,n,i){if(H(t,Uint8Array)&&(t=h.from(t,t.offset,t.byteLength)),!h.isBuffer(t))throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type '+typeof t);if(void 0===e&&(e=0),void 0===r&&(r=t?t.length:0),void 0===n&&(n=0),void 0===i&&(i=this.length),e<0||r>t.length||n<0||i>this.length)throw new RangeError("out of range index");if(n>=i&&e>=r)return 0;if(n>=i)return  -1;if(e>=r)return 1;if(this===t)return 0;let o=(i>>>=0)-(n>>>=0),f=(r>>>=0)-(e>>>=0);const u=Math.min(o,f),s=this.slice(n,i),a=t.slice(e,r);for(let t=0;t<u;++t)if(s[t]!==a[t]){o=s[t],f=a[t];break}return o<f?-1:f<o?1:0},h.prototype.includes=function(t,e,r){return  -1!==this.indexOf(t,e,r)},h.prototype.indexOf=function(t,e,r){return B(this,t,e,r,true)},h.prototype.lastIndexOf=function(t,e,r){return B(this,t,e,r,false)},h.prototype.write=function(t,e,r,n){if(void 0===e)n="utf8",r=this.length,e=0;else if(void 0===r&&"string"==typeof e)n=e,r=this.length,e=0;else {if(!isFinite(e))throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");e>>>=0,isFinite(r)?(r>>>=0,void 0===n&&(n="utf8")):(n=r,r=void 0);}const i=this.length-e;if((void 0===r||r>i)&&(r=i),t.length>0&&(r<0||e<0)||e>this.length)throw new RangeError("Attempt to write outside buffer bounds");n||(n="utf8");let o=false;for(;;)switch(n){case "hex":return E(this,t,e,r);case "utf8":case "utf-8":return A(this,t,e,r);case "ascii":case "latin1":case "binary":return U(this,t,e,r);case "base64":return I(this,t,e,r);case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":return L(this,t,e,r);default:if(o)throw new TypeError("Unknown encoding: "+n);n=(""+n).toLowerCase(),o=true;}},h.prototype.toJSON=function(){return {type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};const T=4096;function _(t,e,r){let n="";r=Math.min(t.length,r);for(let i=e;i<r;++i)n+=String.fromCharCode(127&t[i]);return n}function R(t,e,r){let n="";r=Math.min(t.length,r);for(let i=e;i<r;++i)n+=String.fromCharCode(t[i]);return n}function S(t,e,r){const n=t.length;(!e||e<0)&&(e=0),(!r||r<0||r>n)&&(r=n);let i="";for(let n=e;n<r;++n)i+=K[t[n]];return i}function N(t,e,r){const n=t.slice(e,r);let i="";for(let t=0;t<n.length-1;t+=2)i+=String.fromCharCode(n[t]+256*n[t+1]);return i}function C(t,e,r){if(t%1!=0||t<0)throw new RangeError("offset is not uint");if(t+e>r)throw new RangeError("Trying to access beyond buffer length")}function M(t,e,r,n,i,o){if(!h.isBuffer(t))throw new TypeError('"buffer" argument must be a Buffer instance');if(e>i||e<o)throw new RangeError('"value" argument is out of bounds');if(r+n>t.length)throw new RangeError("Index out of range")}function x(t,e,r,n,i){Y(e,n,i,t,r,7);let o=Number(e&BigInt(4294967295));t[r++]=o,o>>=8,t[r++]=o,o>>=8,t[r++]=o,o>>=8,t[r++]=o;let f=Number(e>>BigInt(32)&BigInt(4294967295));return t[r++]=f,f>>=8,t[r++]=f,f>>=8,t[r++]=f,f>>=8,t[r++]=f,r}function $(t,e,r,n,i){Y(e,n,i,t,r,7);let o=Number(e&BigInt(4294967295));t[r+7]=o,o>>=8,t[r+6]=o,o>>=8,t[r+5]=o,o>>=8,t[r+4]=o;let f=Number(e>>BigInt(32)&BigInt(4294967295));return t[r+3]=f,f>>=8,t[r+2]=f,f>>=8,t[r+1]=f,f>>=8,t[r]=f,r+8}function P(t,e,r,n,i,o){if(r+n>t.length)throw new RangeError("Index out of range");if(r<0)throw new RangeError("Index out of range")}function k(t,e,r,n,o){return e=+e,r>>>=0,o||P(t,0,r,4),i.write(t,e,r,n,23,4),r+4}function F(t,e,r,n,o){return e=+e,r>>>=0,o||P(t,0,r,8),i.write(t,e,r,n,52,8),r+8}h.prototype.slice=function(t,e){const r=this.length;(t=~~t)<0?(t+=r)<0&&(t=0):t>r&&(t=r),(e=void 0===e?r:~~e)<0?(e+=r)<0&&(e=0):e>r&&(e=r),e<t&&(e=t);const n=this.subarray(t,e);return Object.setPrototypeOf(n,h.prototype),n},h.prototype.readUintLE=h.prototype.readUIntLE=function(t,e,r){t>>>=0,e>>>=0,r||C(t,e,this.length);let n=this[t],i=1,o=0;for(;++o<e&&(i*=256);)n+=this[t+o]*i;return n},h.prototype.readUintBE=h.prototype.readUIntBE=function(t,e,r){t>>>=0,e>>>=0,r||C(t,e,this.length);let n=this[t+--e],i=1;for(;e>0&&(i*=256);)n+=this[t+--e]*i;return n},h.prototype.readUint8=h.prototype.readUInt8=function(t,e){return t>>>=0,e||C(t,1,this.length),this[t]},h.prototype.readUint16LE=h.prototype.readUInt16LE=function(t,e){return t>>>=0,e||C(t,2,this.length),this[t]|this[t+1]<<8},h.prototype.readUint16BE=h.prototype.readUInt16BE=function(t,e){return t>>>=0,e||C(t,2,this.length),this[t]<<8|this[t+1]},h.prototype.readUint32LE=h.prototype.readUInt32LE=function(t,e){return t>>>=0,e||C(t,4,this.length),(this[t]|this[t+1]<<8|this[t+2]<<16)+16777216*this[t+3]},h.prototype.readUint32BE=h.prototype.readUInt32BE=function(t,e){return t>>>=0,e||C(t,4,this.length),16777216*this[t]+(this[t+1]<<16|this[t+2]<<8|this[t+3])},h.prototype.readBigUInt64LE=Q(function(t){V(t>>>=0,"offset");const e=this[t],r=this[t+7];void 0!==e&&void 0!==r||G(t,this.length-8);const n=e+256*this[++t]+65536*this[++t]+this[++t]*2**24,i=this[++t]+256*this[++t]+65536*this[++t]+r*2**24;return BigInt(n)+(BigInt(i)<<BigInt(32))}),h.prototype.readBigUInt64BE=Q(function(t){V(t>>>=0,"offset");const e=this[t],r=this[t+7];void 0!==e&&void 0!==r||G(t,this.length-8);const n=e*2**24+65536*this[++t]+256*this[++t]+this[++t],i=this[++t]*2**24+65536*this[++t]+256*this[++t]+r;return (BigInt(n)<<BigInt(32))+BigInt(i)}),h.prototype.readIntLE=function(t,e,r){t>>>=0,e>>>=0,r||C(t,e,this.length);let n=this[t],i=1,o=0;for(;++o<e&&(i*=256);)n+=this[t+o]*i;return i*=128,n>=i&&(n-=Math.pow(2,8*e)),n},h.prototype.readIntBE=function(t,e,r){t>>>=0,e>>>=0,r||C(t,e,this.length);let n=e,i=1,o=this[t+--n];for(;n>0&&(i*=256);)o+=this[t+--n]*i;return i*=128,o>=i&&(o-=Math.pow(2,8*e)),o},h.prototype.readInt8=function(t,e){return t>>>=0,e||C(t,1,this.length),128&this[t]?-1*(255-this[t]+1):this[t]},h.prototype.readInt16LE=function(t,e){t>>>=0,e||C(t,2,this.length);const r=this[t]|this[t+1]<<8;return 32768&r?4294901760|r:r},h.prototype.readInt16BE=function(t,e){t>>>=0,e||C(t,2,this.length);const r=this[t+1]|this[t]<<8;return 32768&r?4294901760|r:r},h.prototype.readInt32LE=function(t,e){return t>>>=0,e||C(t,4,this.length),this[t]|this[t+1]<<8|this[t+2]<<16|this[t+3]<<24},h.prototype.readInt32BE=function(t,e){return t>>>=0,e||C(t,4,this.length),this[t]<<24|this[t+1]<<16|this[t+2]<<8|this[t+3]},h.prototype.readBigInt64LE=Q(function(t){V(t>>>=0,"offset");const e=this[t],r=this[t+7];void 0!==e&&void 0!==r||G(t,this.length-8);const n=this[t+4]+256*this[t+5]+65536*this[t+6]+(r<<24);return (BigInt(n)<<BigInt(32))+BigInt(e+256*this[++t]+65536*this[++t]+this[++t]*2**24)}),h.prototype.readBigInt64BE=Q(function(t){V(t>>>=0,"offset");const e=this[t],r=this[t+7];void 0!==e&&void 0!==r||G(t,this.length-8);const n=(e<<24)+65536*this[++t]+256*this[++t]+this[++t];return (BigInt(n)<<BigInt(32))+BigInt(this[++t]*2**24+65536*this[++t]+256*this[++t]+r)}),h.prototype.readFloatLE=function(t,e){return t>>>=0,e||C(t,4,this.length),i.read(this,t,true,23,4)},h.prototype.readFloatBE=function(t,e){return t>>>=0,e||C(t,4,this.length),i.read(this,t,false,23,4)},h.prototype.readDoubleLE=function(t,e){return t>>>=0,e||C(t,8,this.length),i.read(this,t,true,52,8)},h.prototype.readDoubleBE=function(t,e){return t>>>=0,e||C(t,8,this.length),i.read(this,t,false,52,8)},h.prototype.writeUintLE=h.prototype.writeUIntLE=function(t,e,r,n){t=+t,e>>>=0,r>>>=0,n||M(this,t,e,r,Math.pow(2,8*r)-1,0);let i=1,o=0;for(this[e]=255&t;++o<r&&(i*=256);)this[e+o]=t/i&255;return e+r},h.prototype.writeUintBE=h.prototype.writeUIntBE=function(t,e,r,n){t=+t,e>>>=0,r>>>=0,n||M(this,t,e,r,Math.pow(2,8*r)-1,0);let i=r-1,o=1;for(this[e+i]=255&t;--i>=0&&(o*=256);)this[e+i]=t/o&255;return e+r},h.prototype.writeUint8=h.prototype.writeUInt8=function(t,e,r){return t=+t,e>>>=0,r||M(this,t,e,1,255,0),this[e]=255&t,e+1},h.prototype.writeUint16LE=h.prototype.writeUInt16LE=function(t,e,r){return t=+t,e>>>=0,r||M(this,t,e,2,65535,0),this[e]=255&t,this[e+1]=t>>>8,e+2},h.prototype.writeUint16BE=h.prototype.writeUInt16BE=function(t,e,r){return t=+t,e>>>=0,r||M(this,t,e,2,65535,0),this[e]=t>>>8,this[e+1]=255&t,e+2},h.prototype.writeUint32LE=h.prototype.writeUInt32LE=function(t,e,r){return t=+t,e>>>=0,r||M(this,t,e,4,4294967295,0),this[e+3]=t>>>24,this[e+2]=t>>>16,this[e+1]=t>>>8,this[e]=255&t,e+4},h.prototype.writeUint32BE=h.prototype.writeUInt32BE=function(t,e,r){return t=+t,e>>>=0,r||M(this,t,e,4,4294967295,0),this[e]=t>>>24,this[e+1]=t>>>16,this[e+2]=t>>>8,this[e+3]=255&t,e+4},h.prototype.writeBigUInt64LE=Q(function(t,e=0){return x(this,t,e,BigInt(0),BigInt("0xffffffffffffffff"))}),h.prototype.writeBigUInt64BE=Q(function(t,e=0){return $(this,t,e,BigInt(0),BigInt("0xffffffffffffffff"))}),h.prototype.writeIntLE=function(t,e,r,n){if(t=+t,e>>>=0,!n){const n=Math.pow(2,8*r-1);M(this,t,e,r,n-1,-n);}let i=0,o=1,f=0;for(this[e]=255&t;++i<r&&(o*=256);)t<0&&0===f&&0!==this[e+i-1]&&(f=1),this[e+i]=(t/o|0)-f&255;return e+r},h.prototype.writeIntBE=function(t,e,r,n){if(t=+t,e>>>=0,!n){const n=Math.pow(2,8*r-1);M(this,t,e,r,n-1,-n);}let i=r-1,o=1,f=0;for(this[e+i]=255&t;--i>=0&&(o*=256);)t<0&&0===f&&0!==this[e+i+1]&&(f=1),this[e+i]=(t/o|0)-f&255;return e+r},h.prototype.writeInt8=function(t,e,r){return t=+t,e>>>=0,r||M(this,t,e,1,127,-128),t<0&&(t=255+t+1),this[e]=255&t,e+1},h.prototype.writeInt16LE=function(t,e,r){return t=+t,e>>>=0,r||M(this,t,e,2,32767,-32768),this[e]=255&t,this[e+1]=t>>>8,e+2},h.prototype.writeInt16BE=function(t,e,r){return t=+t,e>>>=0,r||M(this,t,e,2,32767,-32768),this[e]=t>>>8,this[e+1]=255&t,e+2},h.prototype.writeInt32LE=function(t,e,r){return t=+t,e>>>=0,r||M(this,t,e,4,2147483647,-2147483648),this[e]=255&t,this[e+1]=t>>>8,this[e+2]=t>>>16,this[e+3]=t>>>24,e+4},h.prototype.writeInt32BE=function(t,e,r){return t=+t,e>>>=0,r||M(this,t,e,4,2147483647,-2147483648),t<0&&(t=4294967295+t+1),this[e]=t>>>24,this[e+1]=t>>>16,this[e+2]=t>>>8,this[e+3]=255&t,e+4},h.prototype.writeBigInt64LE=Q(function(t,e=0){return x(this,t,e,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))}),h.prototype.writeBigInt64BE=Q(function(t,e=0){return $(this,t,e,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))}),h.prototype.writeFloatLE=function(t,e,r){return k(this,t,e,true,r)},h.prototype.writeFloatBE=function(t,e,r){return k(this,t,e,false,r)},h.prototype.writeDoubleLE=function(t,e,r){return F(this,t,e,true,r)},h.prototype.writeDoubleBE=function(t,e,r){return F(this,t,e,false,r)},h.prototype.copy=function(t,e,r,n){if(!h.isBuffer(t))throw new TypeError("argument should be a Buffer");if(r||(r=0),n||0===n||(n=this.length),e>=t.length&&(e=t.length),e||(e=0),n>0&&n<r&&(n=r),n===r)return 0;if(0===t.length||0===this.length)return 0;if(e<0)throw new RangeError("targetStart out of bounds");if(r<0||r>=this.length)throw new RangeError("Index out of range");if(n<0)throw new RangeError("sourceEnd out of bounds");n>this.length&&(n=this.length),t.length-e<n-r&&(n=t.length-e+r);const i=n-r;return this===t&&"function"==typeof Uint8Array.prototype.copyWithin?this.copyWithin(e,r,n):Uint8Array.prototype.set.call(t,this.subarray(r,n),e),i},h.prototype.fill=function(t,e,r,n){if("string"==typeof t){if("string"==typeof e?(n=e,e=0,r=this.length):"string"==typeof r&&(n=r,r=this.length),void 0!==n&&"string"!=typeof n)throw new TypeError("encoding must be a string");if("string"==typeof n&&!h.isEncoding(n))throw new TypeError("Unknown encoding: "+n);if(1===t.length){const e=t.charCodeAt(0);("utf8"===n&&e<128||"latin1"===n)&&(t=e);}}else "number"==typeof t?t&=255:"boolean"==typeof t&&(t=Number(t));if(e<0||this.length<e||this.length<r)throw new RangeError("Out of range index");if(r<=e)return this;let i;if(e>>>=0,r=void 0===r?this.length:r>>>0,t||(t=0),"number"==typeof t)for(i=e;i<r;++i)this[i]=t;else {const o=h.isBuffer(t)?t:h.from(t,n),f=o.length;if(0===f)throw new TypeError('The value "'+t+'" is invalid for argument "value"');for(i=0;i<r-e;++i)this[i+e]=o[i%f];}return this};const j={};function D(t,e,r){j[t]=class extends r{constructor(){super(),Object.defineProperty(this,"message",{value:e.apply(this,arguments),writable:true,configurable:true}),this.name=`${this.name} [${t}]`,this.stack,delete this.name;}get code(){return t}set code(t){Object.defineProperty(this,"code",{configurable:true,enumerable:true,value:t,writable:true});}toString(){return `${this.name} [${t}]: ${this.message}`}};}function z(t){let e="",r=t.length;const n="-"===t[0]?1:0;for(;r>=n+4;r-=3)e=`_${t.slice(r-3,r)}${e}`;return `${t.slice(0,r)}${e}`}function Y(t,e,r,n,i,o){if(t>r||t<e){const r="bigint"==typeof e?"n":"";let n;throw n=0===e||e===BigInt(0)?`>= 0${r} and < 2${r} ** ${8*(o+1)}${r}`:`>= -(2${r} ** ${8*(o+1)-1}${r}) and < 2 ** ${8*(o+1)-1}${r}`,new j.ERR_OUT_OF_RANGE("value",n,t)}!function(t,e,r){V(e,"offset"),void 0!==t[e]&&void 0!==t[e+r]||G(e,t.length-(r+1));}(n,i,o);}function V(t,e){if("number"!=typeof t)throw new j.ERR_INVALID_ARG_TYPE(e,"number",t)}function G(t,e,r){if(Math.floor(t)!==t)throw V(t,r),new j.ERR_OUT_OF_RANGE("offset","an integer",t);if(e<0)throw new j.ERR_BUFFER_OUT_OF_BOUNDS;throw new j.ERR_OUT_OF_RANGE("offset",`>= 0 and <= ${e}`,t)}D("ERR_BUFFER_OUT_OF_BOUNDS",function(t){return t?`${t} is outside of buffer bounds`:"Attempt to access memory outside buffer bounds"},RangeError),D("ERR_INVALID_ARG_TYPE",function(t,e){return `The "${t}" argument must be of type number. Received type ${typeof e}`},TypeError),D("ERR_OUT_OF_RANGE",function(t,e,r){let n=`The value of "${t}" is out of range.`,i=r;return Number.isInteger(r)&&Math.abs(r)>2**32?i=z(String(r)):"bigint"==typeof r&&(i=String(r),(r>BigInt(2)**BigInt(32)||r<-(BigInt(2)**BigInt(32)))&&(i=z(i)),i+="n"),n+=` It must be ${e}. Received ${i}`,n},RangeError);const J=/[^+/0-9A-Za-z-_]/g;function q(t,e){let r;e=e||1/0;const n=t.length;let i=null;const o=[];for(let f=0;f<n;++f){if(r=t.charCodeAt(f),r>55295&&r<57344){if(!i){if(r>56319){(e-=3)>-1&&o.push(239,191,189);continue}if(f+1===n){(e-=3)>-1&&o.push(239,191,189);continue}i=r;continue}if(r<56320){(e-=3)>-1&&o.push(239,191,189),i=r;continue}r=65536+(i-55296<<10|r-56320);}else i&&(e-=3)>-1&&o.push(239,191,189);if(i=null,r<128){if((e-=1)<0)break;o.push(r);}else if(r<2048){if((e-=2)<0)break;o.push(r>>6|192,63&r|128);}else if(r<65536){if((e-=3)<0)break;o.push(r>>12|224,r>>6&63|128,63&r|128);}else {if(!(r<1114112))throw new Error("Invalid code point");if((e-=4)<0)break;o.push(r>>18|240,r>>12&63|128,r>>6&63|128,63&r|128);}}return o}function W(t){return n.toByteArray(function(t){if((t=(t=t.split("=")[0]).trim().replace(J,"")).length<2)return "";for(;t.length%4!=0;)t+="=";return t}(t))}function X(t,e,r,n){let i;for(i=0;i<n&&!(i+r>=e.length||i>=t.length);++i)e[i+r]=t[i];return i}function H(t,e){return t instanceof e||null!=t&&null!=t.constructor&&null!=t.constructor.name&&t.constructor.name===e.name}function Z(t){return t!=t}const K=function(){const t="0123456789abcdef",e=new Array(256);for(let r=0;r<16;++r){const n=16*r;for(let i=0;i<16;++i)e[n+i]=t[r]+t[i];}return e}();function Q(t){return "undefined"==typeof BigInt?tt:t}function tt(){throw new Error("BigInt not supported")}}(e$1)),e$1);const s$1=new TextEncoder,h$1=new TextDecoder,a$1=c$1;function c$1(t,e=0){let r;if(void 0===t||"string"!=typeof t||"number"!=typeof e)throw TypeError("invlaid init variablie type name. ");return (t=t.toUpperCase()).includes("8")?(r=u$1.Buffer.alloc(1),t.includes("I")?r.writeInt8(e):r.writeUint8(e)):t.includes("16")?(r=u$1.Buffer.alloc(2),t.includes("I")?t.includes("L")?r.writeInt16LE(e):r.writeInt16BE(e):t.includes("L")?r.writeUint16LE(e):r.writeUint16BE(e)):t.includes("32")?(r=u$1.Buffer.alloc(4),t.includes("I")?t.includes("L")?r.writeInt32LE(e):r.writeInt32BE(e):t.includes("L")?r.writeUint32LE(e):r.writeUint32BE(e)):t.includes("F")?(r=u$1.Buffer.alloc(4),t.includes("L")?r.writeFloatLE(e):r.writeFloatBE(e)):t.includes("N")?r=u$1.Buffer.from(String(e)):console.log(`invalid type: ${t} or initvalue: ${e}`),r}const l$1=p$1;function p$1(t,e,r){let n,i="B";if("number"==typeof e)"number"==typeof r?(n=u$1.Buffer.alloc(e),0!==r&&n.fill(r),i="B"):(n=u$1.Buffer.from(String(e)),i="N");else if("string"==typeof e&&"number"==typeof r)i=e.toUpperCase(),n=c$1(e,r);else if("string"==typeof e&&void 0===r)n=u$1.Buffer.from(e),i="S";else if(e instanceof Uint8Array&&void 0===r)n=e instanceof u$1.Buffer?e:u$1.Buffer.from(e);else if(e instanceof ArrayBuffer&&void 0===r)n=u$1.Buffer.from(e);else if(ArrayBuffer.isView(e))n=u$1.Buffer.from(e.buffer,e.byteOffset,e.byteLength);else if("object"==typeof e&&void 0===r)n=u$1.Buffer.from(JSON.stringify(e)),i="O";else {if("boolean"!=typeof e||void 0!==r)throw TypeError("invalid meta buffer type");{const t=e?1:0;n=u$1.Buffer.from([t]),i="!";}}return "string"==typeof t&&t.includes("#")&&(t=""),[t,i,n]}const y$1=g$1;function g$1(...t){let e=0;return t.map(t=>{const r=e++;return "number"==typeof t?l$1(r,"N",t):l$1(r,t)})}function d$1(t){if((t=t.toUpperCase()).includes("8"))return t.includes("I")?"int8":"uint8";if(t.includes("16"))return t.includes("I")?t.includes("L")?"int16_le":"int16_be":t.includes("L")?"uint16_le":"uint16_be";if(t.includes("32"))return t.includes("I")?t.includes("L")?"int32_le":"int32_be":t.includes("L")?"uint32_le":"uint32_be";if(t.includes("F"))return t.includes("L")?"float_le":"float_be";if("B"===t)return "buffer";if("S"===t)return "string";if("N"===t)return "number";if("O"===t)return "object";if("!"===t)return "boolean";throw TypeError("invalid data type")}function b$1(t,e,r,n){try{const i=d$1(t);if("int8"==i)return e.readInt8(r);if("uint8"===i)return e.readUint8(r);if("int16_le"===i)return e.readInt16LE(r);if("int16_be"===i)return e.readInt16BE(r);if("uint16_le"===i)return e.readUint16LE(r);if("uint16_be"===i)return e.readUint16BE(r);if("int32_le"===i)return e.readInt32LE(r);if("int32_be"===i)return e.readInt32BE(r);if("uint32_le"===i)return e.readUint32LE(r);if("uint32_be"===i)return e.readUint32BE(r);if("float_le"===i)return e.readFloatLE(r);if("float_be"===i)return e.readFloatBE(r);if("buffer"===i)return e.subarray(r,r+n);if("string"===i){const t=e.subarray(r,r+n);return h$1.decode(t)}if("number"===i){const t=e.subarray(r,r+n);return Number(h$1.decode(t))}if("object"===i){const t=e.subarray(r,r+n);return JSON.parse(h$1.decode(t))}if("boolean"===i){return 1===e.readInt8(r)}return}catch(t){}}function w$1(...t){const e=function(t){let e=[];return t.filter(t=>{if(!Array.isArray(t[0]))return t;e=e.concat(t);}).concat(e)}(t);let r=0;const n=[];let i,o,f=0;if(e.forEach(t=>{const[e,i,o]=t;r+=o.byteLength,("number"==typeof e||e.length>0)&&n.push([e,i,f,o.byteLength]),f=r;}),n.length>0){let t=JSON.stringify(n);i=s$1.encode(t),o=i.byteLength,r=r+o+2;}const h=u$1.Buffer.alloc(r);if(f=0,e.forEach(t=>{const e=t[2];h.set(e,f),f+=e.byteLength;}),n.length>0){h.set(i,f);const t=a$1("16",o);return h.set(t,f+o),h}return h}const B$1=m$1;function m$1(t,e=false){if(void 0===t)throw TypeError("Invalid data type: Undefined");if("string"==typeof t)return s$1.encode(t);if("number"==typeof t)return Uint8Array.from([t]);if(t instanceof ArrayBuffer){if(e)return new Uint8Array(t);{const e=new Uint8Array(t),r=new Uint8Array(t.byteLength);return r.set(e),r}}if(ArrayBuffer.isView(t)){if(e)return new Uint8Array(t.buffer,t.byteOffset,t.byteLength);{const e=new Uint8Array(t.buffer,t.byteOffset,t.byteLength),r=new Uint8Array(t.byteLength);return r.set(e),r}}return s$1.encode(JSON.stringify(t))}const E$1=A$1;function A$1(t,e=false){const r=m$1(t,e);return e?u$1.Buffer.from(r.buffer,r.byteOffset,r.byteLength):u$1.Buffer.from(r)}const U$1=I$1;function I$1(...t){const e=t.map(t=>A$1(t));return u$1.Buffer.concat(e)}const L$1=v$1;function v$1(...t){try{let e=0,r=0;const n=t.map(t=>m$1(t));n.forEach(t=>{e+=t.byteLength;});const i=new Uint8Array(e);return n.forEach(t=>{i.set(t,r),r+=t.byteLength;}),i}catch(t){console.log(t);}}function O$1(t){return 0===S$1(t)?t.byteLength:t.byteLength-S$1(t)-_$1}function T$1(t,e){try{const r=new Uint8Array(t.buffer,t.byteOffset,t.byteLength),n=r.byteLength-e-2,i=r.subarray(n,r.byteLength-2),o=h$1.decode(i),f=JSON.parse(o);if(!Array.isArray(f)||!Array.isArray(f[0]))return;let u=f[0];if(!u)return;if(u.length<3)return;const[s,a,c]=u;if("string"!=typeof a||"number"!=typeof c)return;return f}catch(t){}}const _$1=2;function R$1(t){if(t instanceof ArrayBuffer&&(t=u$1.Buffer.from(t)),t instanceof Uint8Array){if(t.byteLength<=_$1)return 0;return new DataView(t.buffer,t.byteOffset,t.byteLength).getUint16(t.byteLength-_$1)}return 0}function S$1(t){if(t instanceof ArrayBuffer&&(t=u$1.Buffer.from(t)),t instanceof Uint8Array){const e=t.byteLength;if(e<=_$1)return 0;const r=R$1(t);if(0===r||r>e)return 0;return T$1(t,r)?r:0}return 0}function N$1(t){const e=O$1(t);return t.subarray(0,e)}function C$1(t,e=false){t instanceof ArrayBuffer&&(t=u$1.Buffer.from(t));const r=R$1(t);if(0===r)return;let n=T$1(t,r);return n?e?(n.forEach(t=>{null==t[3]&&(t[1].includes("8")?t[3]=1:t[1].includes("16")?t[3]=2:t[1].includes("32")||t[1].includes("F")?t[3]=4:t[1].includes("!")&&(t[3]=1)),t[4]=d$1(t[1]);}),n):n:void 0}var M$1=Object.freeze({__proto__:null,B8:E$1,B8pack:U$1,Buffer:u$1.Buffer,MB:l$1,MBA:y$1,NB:a$1,TAIL_LEN:_$1,U8:B$1,U8pack:L$1,equal:function(t,e){if(t.byteLength!==e.byteLength)return  false;for(let r=0;r<t.byteLength;r++)if(t[r]!==e[r])return  false;return  true},getBuffer:N$1,getBufferSize:O$1,getMeta:C$1,getMetaDetail:function(t){return C$1(t,true)},getMetaSize:S$1,hex:function(t){return Array.prototype.map.call(new Uint8Array(t),t=>("00"+t.toString(16)).slice(-2)).join("")},meta:function(...t){return C$1(w$1(...t))},metaBuffer:p$1,metaBufferArguments:g$1,metaDetail:function(...t){return C$1(w$1(...t),true)},numberBuffer:c$1,pack:w$1,parseBuffer:A$1,parseBufferThenConcat:I$1,parseMetaInfo:T$1,parseTypeName:d$1,parseUint8Array:m$1,parseUint8ThenConcat:v$1,rawPack:function(...t){return N$1(w$1(...t))},readTail:R$1,readTypedBuffer:b$1,unpack:function(t,e){const r=e||C$1(t);if(!r)return;const n=u$1.Buffer.from(t),i={};let o=0;if(r.forEach(t=>{const[e,r,f,u]=t;let s=b$1(r,n,f,u);null!=s&&(i[e]=s,u&&(o+=u));}),e&&n.byteLength!==o){let t=n.byteLength-o,e=b$1("b",n,o,t);if(null==e)return;i.$OTHERS=e;}let f=0,s=[];for(;i[f];)s.push(i[f++]);return s.length>0&&(i.args=s,i.$=i.args),i}});

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var eventemitter3 = {exports: {}};

var hasRequiredEventemitter3;

function requireEventemitter3 () {
	if (hasRequiredEventemitter3) return eventemitter3.exports;
	hasRequiredEventemitter3 = 1;
	(function (module) {

		var has = Object.prototype.hasOwnProperty
		  , prefix = '~';

		/**
		 * Constructor to create a storage for our `EE` objects.
		 * An `Events` instance is a plain object whose properties are event names.
		 *
		 * @constructor
		 * @private
		 */
		function Events() {}

		//
		// We try to not inherit from `Object.prototype`. In some engines creating an
		// instance in this way is faster than calling `Object.create(null)` directly.
		// If `Object.create(null)` is not supported we prefix the event names with a
		// character to make sure that the built-in object properties are not
		// overridden or used as an attack vector.
		//
		if (Object.create) {
		  Events.prototype = Object.create(null);

		  //
		  // This hack is needed because the `__proto__` property is still inherited in
		  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
		  //
		  if (!new Events().__proto__) prefix = false;
		}

		/**
		 * Representation of a single event listener.
		 *
		 * @param {Function} fn The listener function.
		 * @param {*} context The context to invoke the listener with.
		 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
		 * @constructor
		 * @private
		 */
		function EE(fn, context, once) {
		  this.fn = fn;
		  this.context = context;
		  this.once = once || false;
		}

		/**
		 * Add a listener for a given event.
		 *
		 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
		 * @param {(String|Symbol)} event The event name.
		 * @param {Function} fn The listener function.
		 * @param {*} context The context to invoke the listener with.
		 * @param {Boolean} once Specify if the listener is a one-time listener.
		 * @returns {EventEmitter}
		 * @private
		 */
		function addListener(emitter, event, fn, context, once) {
		  if (typeof fn !== 'function') {
		    throw new TypeError('The listener must be a function');
		  }

		  var listener = new EE(fn, context || emitter, once)
		    , evt = prefix ? prefix + event : event;

		  if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
		  else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
		  else emitter._events[evt] = [emitter._events[evt], listener];

		  return emitter;
		}

		/**
		 * Clear event by name.
		 *
		 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
		 * @param {(String|Symbol)} evt The Event name.
		 * @private
		 */
		function clearEvent(emitter, evt) {
		  if (--emitter._eventsCount === 0) emitter._events = new Events();
		  else delete emitter._events[evt];
		}

		/**
		 * Minimal `EventEmitter` interface that is molded against the Node.js
		 * `EventEmitter` interface.
		 *
		 * @constructor
		 * @public
		 */
		function EventEmitter() {
		  this._events = new Events();
		  this._eventsCount = 0;
		}

		/**
		 * Return an array listing the events for which the emitter has registered
		 * listeners.
		 *
		 * @returns {Array}
		 * @public
		 */
		EventEmitter.prototype.eventNames = function eventNames() {
		  var names = []
		    , events
		    , name;

		  if (this._eventsCount === 0) return names;

		  for (name in (events = this._events)) {
		    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
		  }

		  if (Object.getOwnPropertySymbols) {
		    return names.concat(Object.getOwnPropertySymbols(events));
		  }

		  return names;
		};

		/**
		 * Return the listeners registered for a given event.
		 *
		 * @param {(String|Symbol)} event The event name.
		 * @returns {Array} The registered listeners.
		 * @public
		 */
		EventEmitter.prototype.listeners = function listeners(event) {
		  var evt = prefix ? prefix + event : event
		    , handlers = this._events[evt];

		  if (!handlers) return [];
		  if (handlers.fn) return [handlers.fn];

		  for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
		    ee[i] = handlers[i].fn;
		  }

		  return ee;
		};

		/**
		 * Return the number of listeners listening to a given event.
		 *
		 * @param {(String|Symbol)} event The event name.
		 * @returns {Number} The number of listeners.
		 * @public
		 */
		EventEmitter.prototype.listenerCount = function listenerCount(event) {
		  var evt = prefix ? prefix + event : event
		    , listeners = this._events[evt];

		  if (!listeners) return 0;
		  if (listeners.fn) return 1;
		  return listeners.length;
		};

		/**
		 * Calls each of the listeners registered for a given event.
		 *
		 * @param {(String|Symbol)} event The event name.
		 * @returns {Boolean} `true` if the event had listeners, else `false`.
		 * @public
		 */
		EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
		  var evt = prefix ? prefix + event : event;

		  if (!this._events[evt]) return false;

		  var listeners = this._events[evt]
		    , len = arguments.length
		    , args
		    , i;

		  if (listeners.fn) {
		    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

		    switch (len) {
		      case 1: return listeners.fn.call(listeners.context), true;
		      case 2: return listeners.fn.call(listeners.context, a1), true;
		      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
		      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
		      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
		      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
		    }

		    for (i = 1, args = new Array(len -1); i < len; i++) {
		      args[i - 1] = arguments[i];
		    }

		    listeners.fn.apply(listeners.context, args);
		  } else {
		    var length = listeners.length
		      , j;

		    for (i = 0; i < length; i++) {
		      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

		      switch (len) {
		        case 1: listeners[i].fn.call(listeners[i].context); break;
		        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
		        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
		        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
		        default:
		          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
		            args[j - 1] = arguments[j];
		          }

		          listeners[i].fn.apply(listeners[i].context, args);
		      }
		    }
		  }

		  return true;
		};

		/**
		 * Add a listener for a given event.
		 *
		 * @param {(String|Symbol)} event The event name.
		 * @param {Function} fn The listener function.
		 * @param {*} [context=this] The context to invoke the listener with.
		 * @returns {EventEmitter} `this`.
		 * @public
		 */
		EventEmitter.prototype.on = function on(event, fn, context) {
		  return addListener(this, event, fn, context, false);
		};

		/**
		 * Add a one-time listener for a given event.
		 *
		 * @param {(String|Symbol)} event The event name.
		 * @param {Function} fn The listener function.
		 * @param {*} [context=this] The context to invoke the listener with.
		 * @returns {EventEmitter} `this`.
		 * @public
		 */
		EventEmitter.prototype.once = function once(event, fn, context) {
		  return addListener(this, event, fn, context, true);
		};

		/**
		 * Remove the listeners of a given event.
		 *
		 * @param {(String|Symbol)} event The event name.
		 * @param {Function} fn Only remove the listeners that match this function.
		 * @param {*} context Only remove the listeners that have this context.
		 * @param {Boolean} once Only remove one-time listeners.
		 * @returns {EventEmitter} `this`.
		 * @public
		 */
		EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
		  var evt = prefix ? prefix + event : event;

		  if (!this._events[evt]) return this;
		  if (!fn) {
		    clearEvent(this, evt);
		    return this;
		  }

		  var listeners = this._events[evt];

		  if (listeners.fn) {
		    if (
		      listeners.fn === fn &&
		      (!once || listeners.once) &&
		      (!context || listeners.context === context)
		    ) {
		      clearEvent(this, evt);
		    }
		  } else {
		    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
		      if (
		        listeners[i].fn !== fn ||
		        (once && !listeners[i].once) ||
		        (context && listeners[i].context !== context)
		      ) {
		        events.push(listeners[i]);
		      }
		    }

		    //
		    // Reset the array, or remove it completely if we have no more listeners.
		    //
		    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
		    else clearEvent(this, evt);
		  }

		  return this;
		};

		/**
		 * Remove all listeners, or those of the specified event.
		 *
		 * @param {(String|Symbol)} [event] The event name.
		 * @returns {EventEmitter} `this`.
		 * @public
		 */
		EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
		  var evt;

		  if (event) {
		    evt = prefix ? prefix + event : event;
		    if (this._events[evt]) clearEvent(this, evt);
		  } else {
		    this._events = new Events();
		    this._eventsCount = 0;
		  }

		  return this;
		};

		//
		// Alias methods names because people roll like that.
		//
		EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
		EventEmitter.prototype.addListener = EventEmitter.prototype.on;

		//
		// Expose the prefix.
		//
		EventEmitter.prefixed = prefix;

		//
		// Allow `EventEmitter` to be imported as module namespace.
		//
		EventEmitter.EventEmitter = EventEmitter;

		//
		// Expose the module.
		//
		{
		  module.exports = EventEmitter;
		} 
	} (eventemitter3));
	return eventemitter3.exports;
}

var eventemitter3Exports = requireEventemitter3();
var EventEmitter = /*@__PURE__*/getDefaultExportFromCjs(eventemitter3Exports);

/**
 * @typedef {object} STATE
 * @property {number} CONNECTING
 * @property {number} OPEN
 * @property {number} SERVER_READY
 * @property {number} AUTH_REQ
 * @property {number} AUTH_RES
 * @property {number} AUTH_FAIL
 * @property {number} AUTH_CLEAR
 * @property {number} CID_REQ
 * @property {number} CID_RES
 * @property {number} READY
 * @property {number} CLOSING
 * @property {number} CLOSED
 * @property {number} STOP
 * @property {number} REDIRECTING
 */
// Client STATE: name and number
const STATE = {
  CONNECTING:    0,
  OPEN:          1,
  SERVER_READY: 10,
  AUTH_REQ:     11,
  AUTH_RES:     12,
  AUTH_FAIL:    13,
  AUTH_CLEAR:   14,

  CID_REQ:      17,
  CID_RES:      18,
  READY:        19,
  CLOSING:       2,
  CLOSED:        3,
  STOP:          4,
  REDIRECTING:   5
};
for (let c in STATE) { STATE[STATE[c]] = c; }


/**
 * @typedef {object} ENC_MODE
 * @property {number} NO
 * @property {number} YES
 * @property {number} AUTO
 */
let ENC_MODE = {
  NO: 0,
  YES: 1,
  AUTO: 2
};

for (let c in ENC_MODE) { ENC_MODE[ENC_MODE[c]] = c; }


/**
 * @typedef {object} SIZE_LIMIT
 * @property {number} TAG_LEN1
 * @property {number} TAG_LEN2
 * @property {number} CONNECTION_CHECKER_PERIOD
 * @property {number} CLIENT_PING_PERIOD
 * @property {number} PROMISE_TIMEOUT
 * @property {number} DID
 * @property {number} CID
 */
const SIZE_LIMIT = {
  TAG_LEN1: 255,
  TAG_LEN2: 65535,
  CONNECTION_CHECKER_PERIOD: 3000,
  CLIENT_PING_PERIOD: 40000,
  PROMISE_TIMEOUT: 5000,
  DID: 8,
  CID: 12
};

/**
 * @typedef {object} PAYLOAD_TYPE
 * @property {number} EMPTY
 * @property {number} TEXT
 * @property {number} BINARY
 * @property {number} OBJECT
 * @property {number} MJSON
 * @property {number} MBA
 */
let PAYLOAD_TYPE = {
  EMPTY: 0,
  TEXT: 1,
  BINARY: 2,
  OBJECT: 3, // one stringifiable object. it's string.
  MJSON: 4, // multiple stringifiable obejct. it's top-level array JSON string.
  MBA: 5  // "meta_buffer_arguments" arbitary types.  it's meta-buffer-pack.
};
for (let c in PAYLOAD_TYPE) { PAYLOAD_TYPE[PAYLOAD_TYPE[c]] = c; }


/**
 * @typedef {object} IOMsg
 * @property {number} SERVER_READY
 * @property {number} CID_REQ
 * @property {number} CID_RES
 * @property {number} QUOTA_LEVEL
 * @property {number} AUTH_CLEAR
 * @property {number} SERVER_REDIRECT
 * @property {number} LOOP
 * @property {number} ECHO
 * @property {number} PING
 * @property {number} PONG
 * @property {number} CLOSE
 * @property {number} SIGNAL
 * @property {number} SIGNAL_REQ
 * @property {number} SIGNAL_E2E
 * @property {number} SUBSCRIBE
 * @property {number} SUBSCRIBE_REQ
 * @property {number} UNSUBSCRIBE
 * @property {number} SERVER_SIGNAL
 * @property {number} IAM
 * @property {number} IAM_RES
 * @property {number} SET
 * @property {number} RESPONSE_CODE
 * @property {number} RESPONSE_MBP
 * @property {number} CALL
 * @property {number} RESPONSE
 * @property {number} FLOW_MODE
 * @property {number} WAIT
 * @property {number} RESUME
 * @property {number} TIME_OUT
 * @property {number} OVER_SIZE
 * @property {number} OVER_FLOW
 */
// IO message's one-byte headers.
let IOMsg = {

  /* 
  * 0~127dec.  reserved. for text stream.
  * 0~31: control code
  * 32~126: ascii charactor
  * 127: DEL
  */

  // ADMIN_REQ: 0xA0,

  // DO NOT USE: 0xB0~ 0xBF
  // Boho module using this numbers.

  // reserved ~0xBF

  // C. IO status contorl.
  SERVER_READY: 0xC0,
  CID_REQ: 0xC1,
  CID_RES: 0xC2,
  QUOTA_LEVEL: 0xC3,
  AUTH_CLEAR: 0xC4,
  SERVER_REDIRECT: 0xC5,
  // ..
  LOOP: 0xCB,
  ECHO: 0xCC,
  PING: 0xCD,
  PONG: 0xCE,
  CLOSE: 0xCF,
  // ~CF


  // D. IO data signaling
  SIGNAL: 0xD0,
  SIGNAL_REQ: 0xD1,
  SIGNAL_E2E: 0xD2,
  SUBSCRIBE: 0xD3,
  SUBSCRIBE_REQ: 0xD4,
  UNSUBSCRIBE: 0xD5,
  SERVER_SIGNAL: 0xD6,

  // ..
  IAM: 0xD9,
  IAM_RES: 0xDA,

  //.. 
  SET: 0xDB,   //
  // RESPONSE_CODE: 0xDC,
  RESPONSE_MBP: 0xDD,
  CALL: 0xDE, // rpc call
  // RESPONSE: 0xDF,
  // ~DF


  // F. Framing Flow control related framing protocol.(CongPacket)
  FLOW_MODE: 0xF0,
  WAIT: 0xF1,
  RESUME: 0xF2,
  //..
  TIME_OUT: 0xFD,
  OVER_SIZE: 0xFE,
  OVER_FLOW: 0xFF

};

for (let c in IOMsg) { IOMsg[IOMsg[c]] = c; }
// console.log( IOMsg );


/**
 * @typedef {object} STATUS
 * @property {number} OK
 * @property {number} ERROR
 */
// service response status code
const STATUS$1 = {
  OK: 0,
  //0~127: success
  //128~255: fail
  ERROR: 255
};

// table index related with:
// - AUTH database level
// - serverOption.defaultQuotaIndex

// quota example
// index range: 0~255.
let quotaTable = {
  // CongSocket
  0: { // default. anonymouse:
    signalSize: 1500,
    publishCounter: 10,
    trafficRate: 10000
  },
  1: { // auth_ultralight:  eg. Arduino Uno.
    signalSize: 255,
    publishCounter: 10,
    trafficRate: 100000
  },
  2: { // auth_light:  eg. authorized ESP.
    signalSize: 65535,
    publishCounter: 10,
    trafficRate: 1048576
  },

  // WebSocket (browser and node app)
  3: { // authorized basic.
    signalSize: 1048576,
    publishCounter: 10,
    trafficRate: 1048576 * 20
  },

  // WebSocket (browser and node app)
  10: { //  anonymouse
    signalSize: 1500,
    publishCounter: 5,
    trafficRate: 1048576 * 20
  },

  11: { // authorized basic.
    signalSize: 65535,
    publishCounter: 10,
    trafficRate: 1048576 * 20
  },

  12: { // authorized power.
    signalSize: 1048576,
    publishCounter: 100,
    trafficRate: 1048576 * 20
  },

  // you can add your custom quota levels.

  // Remote service node
  // High Quota, No root permission.
  200: {
    signalSize: 1048576 * 20,
    publishCounter: 10000,
    trafficRate: 1048576 * 100
  },
  // super admin or root user.
  // to monitor, metric, sudo command, db access.
  255: {
    signalSize: 1048576 * 20,
    publishCounter: 10000,
    trafficRate: 1048576 * 100
  }
};

const encoder$2 = new TextEncoder();


function getSignalPack(tag, ...args) {
  if (typeof tag !== 'string') throw TypeError('tag should be string.')
  let tagEncoded = encoder$2.encode(tag);
  let payload = parsePayload(args);

  let sigPack;
  if (payload.type == PAYLOAD_TYPE.EMPTY) {
    sigPack = M$1.pack(
      M$1.MB('#MsgType', '8', IOMsg.SIGNAL),
      M$1.MB('#tagLen', '8', tagEncoded.byteLength),
      M$1.MB('#tag', tagEncoded),
      M$1.MB('#payloadType', '8', payload.type)
    );
  } else if (payload.type == PAYLOAD_TYPE.MBA) {
    let mbaBuffer = M$1.pack(M$1.MBA(...args));
    sigPack = M$1.pack(
      M$1.MB('#MsgType', '8', IOMsg.SIGNAL),
      M$1.MB('#tagLen', '8', tagEncoded.byteLength),
      M$1.MB('#tag', tagEncoded),
      M$1.MB('#payloadType', '8', payload.type),
      M$1.MB('#mbaBuffer', mbaBuffer)
    );
  } else {
    sigPack = M$1.pack(
      M$1.MB('#MsgType', '8', IOMsg.SIGNAL),
      M$1.MB('#tagLen', '8', tagEncoded.byteLength),
      M$1.MB('#tag', tagEncoded),
      M$1.MB('#payloadType', '8', payload.type),
      M$1.MB('#payload', payload.buffer)
    );
  }
  return sigPack
}


function parsePayload(args) {
  let type, pack;
  if (args.length == 0) {
    type = PAYLOAD_TYPE.EMPTY;
    pack = null;
  } else if (args.length == 1) {
    if (typeof args[0] === 'string' || typeof args[0] === 'number') {
      type = PAYLOAD_TYPE.TEXT;
      pack = encoder$2.encode(args[0] + "."); // add null byte area.
      pack[pack.byteLength - 1] = 0; // set byte-zero : '\0'  in C/C++

    } else if (ArrayBuffer.isView(args[0]) || args[0] instanceof ArrayBuffer) {
      type = PAYLOAD_TYPE.BINARY;
      pack = M$1.B8(args[0]);
    } else if (typeof args[0] === 'object') {
      type = PAYLOAD_TYPE.OBJECT;
      pack = encoder$2.encode(JSON.stringify(args[0]));
    } else {
      throw new Error('unknown payload arguments')
    }
  } else { // two or more arguments.
    let containsBuffer = false;
    args.forEach(item => {
      if (ArrayBuffer.isView(item) || item instanceof ArrayBuffer) containsBuffer = true;
    });

    if (containsBuffer) {
      type = PAYLOAD_TYPE.MBA;
    } else {
      type = PAYLOAD_TYPE.MJSON;
      pack = encoder$2.encode(JSON.stringify(args));
    }

  }

  return { type: type, buffer: pack }
}

function getPayloadFromSignalPack(signalPack) {
  let tagLen = signalPack.readUint8(1);
  return signalPack.subarray(3 + tagLen)
}

const t=new Uint32Array([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]);function e(e,r,n,i,o){let f,s,u,h,a,c,l,p,y,g,d,b,w;for(;o>=64;){for(f=r[0],s=r[1],u=r[2],h=r[3],a=r[4],c=r[5],l=r[6],p=r[7],g=0;g<16;g++)d=i+4*g,e[g]=(255&n[d])<<24|(255&n[d+1])<<16|(255&n[d+2])<<8|255&n[d+3];for(g=16;g<64;g++)y=e[g-2],b=(y>>>17|y<<15)^(y>>>19|y<<13)^y>>>10,y=e[g-15],w=(y>>>7|y<<25)^(y>>>18|y<<14)^y>>>3,e[g]=(b+e[g-7]|0)+(w+e[g-16]|0);for(g=0;g<64;g++)b=(((a>>>6|a<<26)^(a>>>11|a<<21)^(a>>>25|a<<7))+(a&c^~a&l)|0)+(p+(t[g]+e[g]|0)|0)|0,w=((f>>>2|f<<30)^(f>>>13|f<<19)^(f>>>22|f<<10))+(f&s^f&u^s&u)|0,p=l,l=c,c=a,a=h+b|0,h=u,u=s,s=f,f=b+w|0;r[0]+=f,r[1]+=s,r[2]+=u,r[3]+=h,r[4]+=a,r[5]+=c,r[6]+=l,r[7]+=p,i+=64,o-=64;}return i}const r=function(){function t(){this.digestLength=32,this.blockSize=64,this.state=new Int32Array(8),this.temp=new Int32Array(64),this.buffer=new Uint8Array(128),this.bufferLength=0,this.bytesHashed=0,this.finished=false,this.reset();}return t.prototype.reset=function(){return this.state[0]=1779033703,this.state[1]=3144134277,this.state[2]=1013904242,this.state[3]=2773480762,this.state[4]=1359893119,this.state[5]=2600822924,this.state[6]=528734635,this.state[7]=1541459225,this.bufferLength=0,this.bytesHashed=0,this.finished=false,this},t.prototype.clean=function(){for(var t=0;t<this.buffer.length;t++)this.buffer[t]=0;for(t=0;t<this.temp.length;t++)this.temp[t]=0;this.reset();},t.prototype.update=function(t,r){if(void 0===r&&(r=t.length),this.finished)throw new Error("SHA256: can't update because hash was finished.");let n=0;if(this.bytesHashed+=r,this.bufferLength>0){for(;this.bufferLength<64&&r>0;)this.buffer[this.bufferLength++]=t[n++],r--;64===this.bufferLength&&(e(this.temp,this.state,this.buffer,0,64),this.bufferLength=0);}for(r>=64&&(n=e(this.temp,this.state,t,n,r),r%=64);r>0;)this.buffer[this.bufferLength++]=t[n++],r--;return this},t.prototype.finish=function(t){if(!this.finished){const t=this.bytesHashed,n=this.bufferLength,i=t/536870912|0,o=t<<3,f=t%64<56?64:128;this.buffer[n]=128;for(var r=n+1;r<f-8;r++)this.buffer[r]=0;this.buffer[f-8]=i>>>24&255,this.buffer[f-7]=i>>>16&255,this.buffer[f-6]=i>>>8&255,this.buffer[f-5]=i>>>0&255,this.buffer[f-4]=o>>>24&255,this.buffer[f-3]=o>>>16&255,this.buffer[f-2]=o>>>8&255,this.buffer[f-1]=o>>>0&255,e(this.temp,this.state,this.buffer,0,f),this.finished=true;}for(r=0;r<8;r++)t[4*r+0]=this.state[r]>>>24&255,t[4*r+1]=this.state[r]>>>16&255,t[4*r+2]=this.state[r]>>>8&255,t[4*r+3]=this.state[r]>>>0&255;return this},t.prototype.digest=function(){const t=new Uint8Array(this.digestLength);return this.finish(t),t},t.prototype._saveState=function(t){for(let e=0;e<this.state.length;e++)t[e]=this.state[e];},t.prototype._restoreState=function(t,e){for(let e=0;e<this.state.length;e++)this.state[e]=t[e];this.bytesHashed=e,this.finished=false,this.bufferLength=0;},t}(),n=function(){function t(t){this.inner=new r,this.outer=new r,this.blockSize=this.inner.blockSize,this.digestLength=this.inner.digestLength;const e=new Uint8Array(this.blockSize);if(t.length>this.blockSize)(new r).update(t).finish(e).clean();else for(var n=0;n<t.length;n++)e[n]=t[n];for(n=0;n<e.length;n++)e[n]^=54;this.inner.update(e);for(n=0;n<e.length;n++)e[n]^=106;this.outer.update(e),this.istate=new Uint32Array(8),this.ostate=new Uint32Array(8),this.inner._saveState(this.istate),this.outer._saveState(this.ostate);for(n=0;n<e.length;n++)e[n]=0;}return t.prototype.reset=function(){return this.inner._restoreState(this.istate,this.inner.blockSize),this.outer._restoreState(this.ostate,this.outer.blockSize),this},t.prototype.clean=function(){for(let t=0;t<this.istate.length;t++)this.ostate[t]=this.istate[t]=0;this.inner.clean(),this.outer.clean();},t.prototype.update=function(t){return this.inner.update(t),this},t.prototype.finish=function(t){return this.outer.finished?this.outer.finish(t):(this.inner.finish(t),this.outer.update(t,this.digestLength).finish(t)),this},t.prototype.digest=function(){const t=new Uint8Array(this.digestLength);return this.finish(t),t},t}();function i(t){const e=(new r).update(t),n=e.digest();return e.clean(),n}var o,f,s,u={},h={},a={};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */function c(){return f||(f=1,a.read=function(t,e,r,n,i){var o,f,s=8*i-n-1,u=(1<<s)-1,h=u>>1,a=-7,c=r?i-1:0,l=r?-1:1,p=t[e+c];for(c+=l,o=p&(1<<-a)-1,p>>=-a,a+=s;a>0;o=256*o+t[e+c],c+=l,a-=8);for(f=o&(1<<-a)-1,o>>=-a,a+=n;a>0;f=256*f+t[e+c],c+=l,a-=8);if(0===o)o=1-h;else {if(o===u)return f?NaN:1/0*(p?-1:1);f+=Math.pow(2,n),o-=h;}return (p?-1:1)*f*Math.pow(2,o-n)},a.write=function(t,e,r,n,i,o){var f,s,u,h=8*o-i-1,a=(1<<h)-1,c=a>>1,l=23===i?Math.pow(2,-24)-Math.pow(2,-77):0,p=n?0:o-1,y=n?1:-1,g=e<0||0===e&&1/e<0?1:0;for(e=Math.abs(e),isNaN(e)||e===1/0?(s=isNaN(e)?1:0,f=a):(f=Math.floor(Math.log(e)/Math.LN2),e*(u=Math.pow(2,-f))<1&&(f--,u*=2),(e+=f+c>=1?l/u:l*Math.pow(2,1-c))*u>=2&&(f++,u/=2),f+c>=a?(s=0,f=a):f+c>=1?(s=(e*u-1)*Math.pow(2,i),f+=c):(s=e*Math.pow(2,c-1)*Math.pow(2,i),f=0));i>=8;t[r+p]=255&s,p+=y,s/=256,i-=8);for(f=f<<i|s,h+=i;h>0;t[r+p]=255&f,p+=y,f/=256,h-=8);t[r+p-y]|=128*g;}),a}
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */var l=(s||(s=1,function(t){const e=function(){if(o)return h;o=1,h.byteLength=function(t){var e=f(t),r=e[0],n=e[1];return 3*(r+n)/4-n},h.toByteArray=function(t){var n,i,o=f(t),s=o[0],u=o[1],h=new r(function(t,e,r){return 3*(e+r)/4-r}(0,s,u)),a=0,c=u>0?s-4:s;for(i=0;i<c;i+=4)n=e[t.charCodeAt(i)]<<18|e[t.charCodeAt(i+1)]<<12|e[t.charCodeAt(i+2)]<<6|e[t.charCodeAt(i+3)],h[a++]=n>>16&255,h[a++]=n>>8&255,h[a++]=255&n;return 2===u&&(n=e[t.charCodeAt(i)]<<2|e[t.charCodeAt(i+1)]>>4,h[a++]=255&n),1===u&&(n=e[t.charCodeAt(i)]<<10|e[t.charCodeAt(i+1)]<<4|e[t.charCodeAt(i+2)]>>2,h[a++]=n>>8&255,h[a++]=255&n),h},h.fromByteArray=function(e){for(var r,n=e.length,i=n%3,o=[],f=16383,s=0,h=n-i;s<h;s+=f)o.push(u(e,s,s+f>h?h:s+f));return 1===i?(r=e[n-1],o.push(t[r>>2]+t[r<<4&63]+"==")):2===i&&(r=(e[n-2]<<8)+e[n-1],o.push(t[r>>10]+t[r>>4&63]+t[r<<2&63]+"=")),o.join("")};for(var t=[],e=[],r="undefined"!=typeof Uint8Array?Uint8Array:Array,n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",i=0;i<64;++i)t[i]=n[i],e[n.charCodeAt(i)]=i;function f(t){var e=t.length;if(e%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var r=t.indexOf("=");return  -1===r&&(r=e),[r,r===e?0:4-r%4]}function s(e){return t[e>>18&63]+t[e>>12&63]+t[e>>6&63]+t[63&e]}function u(t,e,r){for(var n,i=[],o=e;o<r;o+=3)n=(t[o]<<16&16711680)+(t[o+1]<<8&65280)+(255&t[o+2]),i.push(s(n));return i.join("")}return e["-".charCodeAt(0)]=62,e["_".charCodeAt(0)]=63,h}(),r=c(),n="function"==typeof Symbol&&"function"==typeof Symbol.for?Symbol.for("nodejs.util.inspect.custom"):null;t.Buffer=s,t.SlowBuffer=function(t){return +t!=t&&(t=0),s.alloc(+t)},t.INSPECT_MAX_BYTES=50;const i=2147483647;function f(t){if(t>i)throw new RangeError('The value "'+t+'" is invalid for option "size"');const e=new Uint8Array(t);return Object.setPrototypeOf(e,s.prototype),e}function s(t,e,r){if("number"==typeof t){if("string"==typeof e)throw new TypeError('The "string" argument must be of type string. Received type number');return l(t)}return u(t,e,r)}function u(t,e,r){if("string"==typeof t)return function(t,e){if("string"==typeof e&&""!==e||(e="utf8"),!s.isEncoding(e))throw new TypeError("Unknown encoding: "+e);const r=0|d(t,e);let n=f(r);const i=n.write(t,e);return i!==r&&(n=n.slice(0,i)),n}(t,e);if(ArrayBuffer.isView(t))return function(t){if(Q(t,Uint8Array)){const e=new Uint8Array(t);return y(e.buffer,e.byteOffset,e.byteLength)}return p(t)}(t);if(null==t)throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof t);if(Q(t,ArrayBuffer)||t&&Q(t.buffer,ArrayBuffer))return y(t,e,r);if("undefined"!=typeof SharedArrayBuffer&&(Q(t,SharedArrayBuffer)||t&&Q(t.buffer,SharedArrayBuffer)))return y(t,e,r);if("number"==typeof t)throw new TypeError('The "value" argument must not be of type number. Received type number');const n=t.valueOf&&t.valueOf();if(null!=n&&n!==t)return s.from(n,e,r);const i=function(t){if(s.isBuffer(t)){const e=0|g(t.length),r=f(e);return 0===r.length||t.copy(r,0,0,e),r}return void 0!==t.length?"number"!=typeof t.length||W(t.length)?f(0):p(t):"Buffer"===t.type&&Array.isArray(t.data)?p(t.data):void 0}(t);if(i)return i;if("undefined"!=typeof Symbol&&null!=Symbol.toPrimitive&&"function"==typeof t[Symbol.toPrimitive])return s.from(t[Symbol.toPrimitive]("string"),e,r);throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof t)}function a(t){if("number"!=typeof t)throw new TypeError('"size" argument must be of type number');if(t<0)throw new RangeError('The value "'+t+'" is invalid for option "size"')}function l(t){return a(t),f(t<0?0:0|g(t))}function p(t){const e=t.length<0?0:0|g(t.length),r=f(e);for(let n=0;n<e;n+=1)r[n]=255&t[n];return r}function y(t,e,r){if(e<0||t.byteLength<e)throw new RangeError('"offset" is outside of buffer bounds');if(t.byteLength<e+(r||0))throw new RangeError('"length" is outside of buffer bounds');let n;return n=void 0===e&&void 0===r?new Uint8Array(t):void 0===r?new Uint8Array(t,e):new Uint8Array(t,e,r),Object.setPrototypeOf(n,s.prototype),n}function g(t){if(t>=i)throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+i.toString(16)+" bytes");return 0|t}function d(t,e){if(s.isBuffer(t))return t.length;if(ArrayBuffer.isView(t)||Q(t,ArrayBuffer))return t.byteLength;if("string"!=typeof t)throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type '+typeof t);const r=t.length,n=arguments.length>2&&true===arguments[2];if(!n&&0===r)return 0;let i=false;for(;;)switch(e){case "ascii":case "latin1":case "binary":return r;case "utf8":case "utf-8":return G(t).length;case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":return 2*r;case "hex":return r>>>1;case "base64":return K(t).length;default:if(i)return n?-1:G(t).length;e=(""+e).toLowerCase(),i=true;}}function b(t,e,r){let n=false;if((void 0===e||e<0)&&(e=0),e>this.length)return "";if((void 0===r||r>this.length)&&(r=this.length),r<=0)return "";if((r>>>=0)<=(e>>>=0))return "";for(t||(t="utf8");;)switch(t){case "hex":return O(this,e,r);case "utf8":case "utf-8":return v(this,e,r);case "ascii":return T(this,e,r);case "latin1":case "binary":return S(this,e,r);case "base64":return L(this,e,r);case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":return N(this,e,r);default:if(n)throw new TypeError("Unknown encoding: "+t);t=(t+"").toLowerCase(),n=true;}}function w(t,e,r){const n=t[e];t[e]=t[r],t[r]=n;}function B(t,e,r,n,i){if(0===t.length)return  -1;if("string"==typeof r?(n=r,r=0):r>2147483647?r=2147483647:r<-2147483648&&(r=-2147483648),W(r=+r)&&(r=i?0:t.length-1),r<0&&(r=t.length+r),r>=t.length){if(i)return  -1;r=t.length-1;}else if(r<0){if(!i)return  -1;r=0;}if("string"==typeof e&&(e=s.from(e,n)),s.isBuffer(e))return 0===e.length?-1:E(t,e,r,n,i);if("number"==typeof e)return e&=255,"function"==typeof Uint8Array.prototype.indexOf?i?Uint8Array.prototype.indexOf.call(t,e,r):Uint8Array.prototype.lastIndexOf.call(t,e,r):E(t,[e],r,n,i);throw new TypeError("val must be string, number or Buffer")}function E(t,e,r,n,i){let o,f=1,s=t.length,u=e.length;if(void 0!==n&&("ucs2"===(n=String(n).toLowerCase())||"ucs-2"===n||"utf16le"===n||"utf-16le"===n)){if(t.length<2||e.length<2)return  -1;f=2,s/=2,u/=2,r/=2;}function h(t,e){return 1===f?t[e]:t.readUInt16BE(e*f)}if(i){let n=-1;for(o=r;o<s;o++)if(h(t,o)===h(e,-1===n?0:o-n)){if(-1===n&&(n=o),o-n+1===u)return n*f}else  -1!==n&&(o-=o-n),n=-1;}else for(r+u>s&&(r=s-u),o=r;o>=0;o--){let r=true;for(let n=0;n<u;n++)if(h(t,o+n)!==h(e,n)){r=false;break}if(r)return o}return  -1}function m(t,e,r,n){r=Number(r)||0;const i=t.length-r;n?(n=Number(n))>i&&(n=i):n=i;const o=e.length;let f;for(n>o/2&&(n=o/2),f=0;f<n;++f){const n=parseInt(e.substr(2*f,2),16);if(W(n))return f;t[r+f]=n;}return f}function A(t,e,r,n){return J(G(e,t.length-r),t,r,n)}function _(t,e,r,n){return J(function(t){const e=[];for(let r=0;r<t.length;++r)e.push(255&t.charCodeAt(r));return e}(e),t,r,n)}function U(t,e,r,n){return J(K(e),t,r,n)}function I(t,e,r,n){return J(function(t,e){let r,n,i;const o=[];for(let f=0;f<t.length&&!((e-=2)<0);++f)r=t.charCodeAt(f),n=r>>8,i=r%256,o.push(i),o.push(n);return o}(e,t.length-r),t,r,n)}function L(t,r,n){return 0===r&&n===t.length?e.fromByteArray(t):e.fromByteArray(t.slice(r,n))}function v(t,e,r){r=Math.min(t.length,r);const n=[];let i=e;for(;i<r;){const e=t[i];let o=null,f=e>239?4:e>223?3:e>191?2:1;if(i+f<=r){let r,n,s,u;switch(f){case 1:e<128&&(o=e);break;case 2:r=t[i+1],128==(192&r)&&(u=(31&e)<<6|63&r,u>127&&(o=u));break;case 3:r=t[i+1],n=t[i+2],128==(192&r)&&128==(192&n)&&(u=(15&e)<<12|(63&r)<<6|63&n,u>2047&&(u<55296||u>57343)&&(o=u));break;case 4:r=t[i+1],n=t[i+2],s=t[i+3],128==(192&r)&&128==(192&n)&&128==(192&s)&&(u=(15&e)<<18|(63&r)<<12|(63&n)<<6|63&s,u>65535&&u<1114112&&(o=u));}}null===o?(o=65533,f=1):o>65535&&(o-=65536,n.push(o>>>10&1023|55296),o=56320|1023&o),n.push(o),i+=f;}return function(t){const e=t.length;if(e<=R)return String.fromCharCode.apply(String,t);let r="",n=0;for(;n<e;)r+=String.fromCharCode.apply(String,t.slice(n,n+=R));return r}(n)}t.kMaxLength=i,s.TYPED_ARRAY_SUPPORT=function(){try{const t=new Uint8Array(1),e={foo:function(){return 42}};return Object.setPrototypeOf(e,Uint8Array.prototype),Object.setPrototypeOf(t,e),42===t.foo()}catch(t){return  false}}(),s.TYPED_ARRAY_SUPPORT||"undefined"==typeof console||"function"!=typeof console.error||console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."),Object.defineProperty(s.prototype,"parent",{enumerable:true,get:function(){if(s.isBuffer(this))return this.buffer}}),Object.defineProperty(s.prototype,"offset",{enumerable:true,get:function(){if(s.isBuffer(this))return this.byteOffset}}),s.poolSize=8192,s.from=function(t,e,r){return u(t,e,r)},Object.setPrototypeOf(s.prototype,Uint8Array.prototype),Object.setPrototypeOf(s,Uint8Array),s.alloc=function(t,e,r){return function(t,e,r){return a(t),t<=0?f(t):void 0!==e?"string"==typeof r?f(t).fill(e,r):f(t).fill(e):f(t)}(t,e,r)},s.allocUnsafe=function(t){return l(t)},s.allocUnsafeSlow=function(t){return l(t)},s.isBuffer=function(t){return null!=t&&true===t._isBuffer&&t!==s.prototype},s.compare=function(t,e){if(Q(t,Uint8Array)&&(t=s.from(t,t.offset,t.byteLength)),Q(e,Uint8Array)&&(e=s.from(e,e.offset,e.byteLength)),!s.isBuffer(t)||!s.isBuffer(e))throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');if(t===e)return 0;let r=t.length,n=e.length;for(let i=0,o=Math.min(r,n);i<o;++i)if(t[i]!==e[i]){r=t[i],n=e[i];break}return r<n?-1:n<r?1:0},s.isEncoding=function(t){switch(String(t).toLowerCase()){case "hex":case "utf8":case "utf-8":case "ascii":case "latin1":case "binary":case "base64":case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":return  true;default:return  false}},s.concat=function(t,e){if(!Array.isArray(t))throw new TypeError('"list" argument must be an Array of Buffers');if(0===t.length)return s.alloc(0);let r;if(void 0===e)for(e=0,r=0;r<t.length;++r)e+=t[r].length;const n=s.allocUnsafe(e);let i=0;for(r=0;r<t.length;++r){let e=t[r];if(Q(e,Uint8Array))i+e.length>n.length?(s.isBuffer(e)||(e=s.from(e)),e.copy(n,i)):Uint8Array.prototype.set.call(n,e,i);else {if(!s.isBuffer(e))throw new TypeError('"list" argument must be an Array of Buffers');e.copy(n,i);}i+=e.length;}return n},s.byteLength=d,s.prototype._isBuffer=true,s.prototype.swap16=function(){const t=this.length;if(t%2!=0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(let e=0;e<t;e+=2)w(this,e,e+1);return this},s.prototype.swap32=function(){const t=this.length;if(t%4!=0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(let e=0;e<t;e+=4)w(this,e,e+3),w(this,e+1,e+2);return this},s.prototype.swap64=function(){const t=this.length;if(t%8!=0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(let e=0;e<t;e+=8)w(this,e,e+7),w(this,e+1,e+6),w(this,e+2,e+5),w(this,e+3,e+4);return this},s.prototype.toString=function(){const t=this.length;return 0===t?"":0===arguments.length?v(this,0,t):b.apply(this,arguments)},s.prototype.toLocaleString=s.prototype.toString,s.prototype.equals=function(t){if(!s.isBuffer(t))throw new TypeError("Argument must be a Buffer");return this===t||0===s.compare(this,t)},s.prototype.inspect=function(){let e="";const r=t.INSPECT_MAX_BYTES;return e=this.toString("hex",0,r).replace(/(.{2})/g,"$1 ").trim(),this.length>r&&(e+=" ... "),"<Buffer "+e+">"},n&&(s.prototype[n]=s.prototype.inspect),s.prototype.compare=function(t,e,r,n,i){if(Q(t,Uint8Array)&&(t=s.from(t,t.offset,t.byteLength)),!s.isBuffer(t))throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type '+typeof t);if(void 0===e&&(e=0),void 0===r&&(r=t?t.length:0),void 0===n&&(n=0),void 0===i&&(i=this.length),e<0||r>t.length||n<0||i>this.length)throw new RangeError("out of range index");if(n>=i&&e>=r)return 0;if(n>=i)return  -1;if(e>=r)return 1;if(this===t)return 0;let o=(i>>>=0)-(n>>>=0),f=(r>>>=0)-(e>>>=0);const u=Math.min(o,f),h=this.slice(n,i),a=t.slice(e,r);for(let t=0;t<u;++t)if(h[t]!==a[t]){o=h[t],f=a[t];break}return o<f?-1:f<o?1:0},s.prototype.includes=function(t,e,r){return  -1!==this.indexOf(t,e,r)},s.prototype.indexOf=function(t,e,r){return B(this,t,e,r,true)},s.prototype.lastIndexOf=function(t,e,r){return B(this,t,e,r,false)},s.prototype.write=function(t,e,r,n){if(void 0===e)n="utf8",r=this.length,e=0;else if(void 0===r&&"string"==typeof e)n=e,r=this.length,e=0;else {if(!isFinite(e))throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");e>>>=0,isFinite(r)?(r>>>=0,void 0===n&&(n="utf8")):(n=r,r=void 0);}const i=this.length-e;if((void 0===r||r>i)&&(r=i),t.length>0&&(r<0||e<0)||e>this.length)throw new RangeError("Attempt to write outside buffer bounds");n||(n="utf8");let o=false;for(;;)switch(n){case "hex":return m(this,t,e,r);case "utf8":case "utf-8":return A(this,t,e,r);case "ascii":case "latin1":case "binary":return _(this,t,e,r);case "base64":return U(this,t,e,r);case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":return I(this,t,e,r);default:if(o)throw new TypeError("Unknown encoding: "+n);n=(""+n).toLowerCase(),o=true;}},s.prototype.toJSON=function(){return {type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};const R=4096;function T(t,e,r){let n="";r=Math.min(t.length,r);for(let i=e;i<r;++i)n+=String.fromCharCode(127&t[i]);return n}function S(t,e,r){let n="";r=Math.min(t.length,r);for(let i=e;i<r;++i)n+=String.fromCharCode(t[i]);return n}function O(t,e,r){const n=t.length;(!e||e<0)&&(e=0),(!r||r<0||r>n)&&(r=n);let i="";for(let n=e;n<r;++n)i+=X[t[n]];return i}function N(t,e,r){const n=t.slice(e,r);let i="";for(let t=0;t<n.length-1;t+=2)i+=String.fromCharCode(n[t]+256*n[t+1]);return i}function M(t,e,r){if(t%1!=0||t<0)throw new RangeError("offset is not uint");if(t+e>r)throw new RangeError("Trying to access beyond buffer length")}function C(t,e,r,n,i,o){if(!s.isBuffer(t))throw new TypeError('"buffer" argument must be a Buffer instance');if(e>i||e<o)throw new RangeError('"value" argument is out of bounds');if(r+n>t.length)throw new RangeError("Index out of range")}function x(t,e,r,n,i){D(e,n,i,t,r,7);let o=Number(e&BigInt(4294967295));t[r++]=o,o>>=8,t[r++]=o,o>>=8,t[r++]=o,o>>=8,t[r++]=o;let f=Number(e>>BigInt(32)&BigInt(4294967295));return t[r++]=f,f>>=8,t[r++]=f,f>>=8,t[r++]=f,f>>=8,t[r++]=f,r}function k(t,e,r,n,i){D(e,n,i,t,r,7);let o=Number(e&BigInt(4294967295));t[r+7]=o,o>>=8,t[r+6]=o,o>>=8,t[r+5]=o,o>>=8,t[r+4]=o;let f=Number(e>>BigInt(32)&BigInt(4294967295));return t[r+3]=f,f>>=8,t[r+2]=f,f>>=8,t[r+1]=f,f>>=8,t[r]=f,r+8}function P(t,e,r,n,i,o){if(r+n>t.length)throw new RangeError("Index out of range");if(r<0)throw new RangeError("Index out of range")}function $(t,e,n,i,o){return e=+e,n>>>=0,o||P(t,0,n,4),r.write(t,e,n,i,23,4),n+4}function F(t,e,n,i,o){return e=+e,n>>>=0,o||P(t,0,n,8),r.write(t,e,n,i,52,8),n+8}s.prototype.slice=function(t,e){const r=this.length;(t=~~t)<0?(t+=r)<0&&(t=0):t>r&&(t=r),(e=void 0===e?r:~~e)<0?(e+=r)<0&&(e=0):e>r&&(e=r),e<t&&(e=t);const n=this.subarray(t,e);return Object.setPrototypeOf(n,s.prototype),n},s.prototype.readUintLE=s.prototype.readUIntLE=function(t,e,r){t>>>=0,e>>>=0,r||M(t,e,this.length);let n=this[t],i=1,o=0;for(;++o<e&&(i*=256);)n+=this[t+o]*i;return n},s.prototype.readUintBE=s.prototype.readUIntBE=function(t,e,r){t>>>=0,e>>>=0,r||M(t,e,this.length);let n=this[t+--e],i=1;for(;e>0&&(i*=256);)n+=this[t+--e]*i;return n},s.prototype.readUint8=s.prototype.readUInt8=function(t,e){return t>>>=0,e||M(t,1,this.length),this[t]},s.prototype.readUint16LE=s.prototype.readUInt16LE=function(t,e){return t>>>=0,e||M(t,2,this.length),this[t]|this[t+1]<<8},s.prototype.readUint16BE=s.prototype.readUInt16BE=function(t,e){return t>>>=0,e||M(t,2,this.length),this[t]<<8|this[t+1]},s.prototype.readUint32LE=s.prototype.readUInt32LE=function(t,e){return t>>>=0,e||M(t,4,this.length),(this[t]|this[t+1]<<8|this[t+2]<<16)+16777216*this[t+3]},s.prototype.readUint32BE=s.prototype.readUInt32BE=function(t,e){return t>>>=0,e||M(t,4,this.length),16777216*this[t]+(this[t+1]<<16|this[t+2]<<8|this[t+3])},s.prototype.readBigUInt64LE=Z(function(t){V(t>>>=0,"offset");const e=this[t],r=this[t+7];void 0!==e&&void 0!==r||q(t,this.length-8);const n=e+256*this[++t]+65536*this[++t]+this[++t]*2**24,i=this[++t]+256*this[++t]+65536*this[++t]+r*2**24;return BigInt(n)+(BigInt(i)<<BigInt(32))}),s.prototype.readBigUInt64BE=Z(function(t){V(t>>>=0,"offset");const e=this[t],r=this[t+7];void 0!==e&&void 0!==r||q(t,this.length-8);const n=e*2**24+65536*this[++t]+256*this[++t]+this[++t],i=this[++t]*2**24+65536*this[++t]+256*this[++t]+r;return (BigInt(n)<<BigInt(32))+BigInt(i)}),s.prototype.readIntLE=function(t,e,r){t>>>=0,e>>>=0,r||M(t,e,this.length);let n=this[t],i=1,o=0;for(;++o<e&&(i*=256);)n+=this[t+o]*i;return i*=128,n>=i&&(n-=Math.pow(2,8*e)),n},s.prototype.readIntBE=function(t,e,r){t>>>=0,e>>>=0,r||M(t,e,this.length);let n=e,i=1,o=this[t+--n];for(;n>0&&(i*=256);)o+=this[t+--n]*i;return i*=128,o>=i&&(o-=Math.pow(2,8*e)),o},s.prototype.readInt8=function(t,e){return t>>>=0,e||M(t,1,this.length),128&this[t]?-1*(255-this[t]+1):this[t]},s.prototype.readInt16LE=function(t,e){t>>>=0,e||M(t,2,this.length);const r=this[t]|this[t+1]<<8;return 32768&r?4294901760|r:r},s.prototype.readInt16BE=function(t,e){t>>>=0,e||M(t,2,this.length);const r=this[t+1]|this[t]<<8;return 32768&r?4294901760|r:r},s.prototype.readInt32LE=function(t,e){return t>>>=0,e||M(t,4,this.length),this[t]|this[t+1]<<8|this[t+2]<<16|this[t+3]<<24},s.prototype.readInt32BE=function(t,e){return t>>>=0,e||M(t,4,this.length),this[t]<<24|this[t+1]<<16|this[t+2]<<8|this[t+3]},s.prototype.readBigInt64LE=Z(function(t){V(t>>>=0,"offset");const e=this[t],r=this[t+7];void 0!==e&&void 0!==r||q(t,this.length-8);const n=this[t+4]+256*this[t+5]+65536*this[t+6]+(r<<24);return (BigInt(n)<<BigInt(32))+BigInt(e+256*this[++t]+65536*this[++t]+this[++t]*2**24)}),s.prototype.readBigInt64BE=Z(function(t){V(t>>>=0,"offset");const e=this[t],r=this[t+7];void 0!==e&&void 0!==r||q(t,this.length-8);const n=(e<<24)+65536*this[++t]+256*this[++t]+this[++t];return (BigInt(n)<<BigInt(32))+BigInt(this[++t]*2**24+65536*this[++t]+256*this[++t]+r)}),s.prototype.readFloatLE=function(t,e){return t>>>=0,e||M(t,4,this.length),r.read(this,t,true,23,4)},s.prototype.readFloatBE=function(t,e){return t>>>=0,e||M(t,4,this.length),r.read(this,t,false,23,4)},s.prototype.readDoubleLE=function(t,e){return t>>>=0,e||M(t,8,this.length),r.read(this,t,true,52,8)},s.prototype.readDoubleBE=function(t,e){return t>>>=0,e||M(t,8,this.length),r.read(this,t,false,52,8)},s.prototype.writeUintLE=s.prototype.writeUIntLE=function(t,e,r,n){t=+t,e>>>=0,r>>>=0,n||C(this,t,e,r,Math.pow(2,8*r)-1,0);let i=1,o=0;for(this[e]=255&t;++o<r&&(i*=256);)this[e+o]=t/i&255;return e+r},s.prototype.writeUintBE=s.prototype.writeUIntBE=function(t,e,r,n){t=+t,e>>>=0,r>>>=0,n||C(this,t,e,r,Math.pow(2,8*r)-1,0);let i=r-1,o=1;for(this[e+i]=255&t;--i>=0&&(o*=256);)this[e+i]=t/o&255;return e+r},s.prototype.writeUint8=s.prototype.writeUInt8=function(t,e,r){return t=+t,e>>>=0,r||C(this,t,e,1,255,0),this[e]=255&t,e+1},s.prototype.writeUint16LE=s.prototype.writeUInt16LE=function(t,e,r){return t=+t,e>>>=0,r||C(this,t,e,2,65535,0),this[e]=255&t,this[e+1]=t>>>8,e+2},s.prototype.writeUint16BE=s.prototype.writeUInt16BE=function(t,e,r){return t=+t,e>>>=0,r||C(this,t,e,2,65535,0),this[e]=t>>>8,this[e+1]=255&t,e+2},s.prototype.writeUint32LE=s.prototype.writeUInt32LE=function(t,e,r){return t=+t,e>>>=0,r||C(this,t,e,4,4294967295,0),this[e+3]=t>>>24,this[e+2]=t>>>16,this[e+1]=t>>>8,this[e]=255&t,e+4},s.prototype.writeUint32BE=s.prototype.writeUInt32BE=function(t,e,r){return t=+t,e>>>=0,r||C(this,t,e,4,4294967295,0),this[e]=t>>>24,this[e+1]=t>>>16,this[e+2]=t>>>8,this[e+3]=255&t,e+4},s.prototype.writeBigUInt64LE=Z(function(t,e=0){return x(this,t,e,BigInt(0),BigInt("0xffffffffffffffff"))}),s.prototype.writeBigUInt64BE=Z(function(t,e=0){return k(this,t,e,BigInt(0),BigInt("0xffffffffffffffff"))}),s.prototype.writeIntLE=function(t,e,r,n){if(t=+t,e>>>=0,!n){const n=Math.pow(2,8*r-1);C(this,t,e,r,n-1,-n);}let i=0,o=1,f=0;for(this[e]=255&t;++i<r&&(o*=256);)t<0&&0===f&&0!==this[e+i-1]&&(f=1),this[e+i]=(t/o|0)-f&255;return e+r},s.prototype.writeIntBE=function(t,e,r,n){if(t=+t,e>>>=0,!n){const n=Math.pow(2,8*r-1);C(this,t,e,r,n-1,-n);}let i=r-1,o=1,f=0;for(this[e+i]=255&t;--i>=0&&(o*=256);)t<0&&0===f&&0!==this[e+i+1]&&(f=1),this[e+i]=(t/o|0)-f&255;return e+r},s.prototype.writeInt8=function(t,e,r){return t=+t,e>>>=0,r||C(this,t,e,1,127,-128),t<0&&(t=255+t+1),this[e]=255&t,e+1},s.prototype.writeInt16LE=function(t,e,r){return t=+t,e>>>=0,r||C(this,t,e,2,32767,-32768),this[e]=255&t,this[e+1]=t>>>8,e+2},s.prototype.writeInt16BE=function(t,e,r){return t=+t,e>>>=0,r||C(this,t,e,2,32767,-32768),this[e]=t>>>8,this[e+1]=255&t,e+2},s.prototype.writeInt32LE=function(t,e,r){return t=+t,e>>>=0,r||C(this,t,e,4,2147483647,-2147483648),this[e]=255&t,this[e+1]=t>>>8,this[e+2]=t>>>16,this[e+3]=t>>>24,e+4},s.prototype.writeInt32BE=function(t,e,r){return t=+t,e>>>=0,r||C(this,t,e,4,2147483647,-2147483648),t<0&&(t=4294967295+t+1),this[e]=t>>>24,this[e+1]=t>>>16,this[e+2]=t>>>8,this[e+3]=255&t,e+4},s.prototype.writeBigInt64LE=Z(function(t,e=0){return x(this,t,e,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))}),s.prototype.writeBigInt64BE=Z(function(t,e=0){return k(this,t,e,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))}),s.prototype.writeFloatLE=function(t,e,r){return $(this,t,e,true,r)},s.prototype.writeFloatBE=function(t,e,r){return $(this,t,e,false,r)},s.prototype.writeDoubleLE=function(t,e,r){return F(this,t,e,true,r)},s.prototype.writeDoubleBE=function(t,e,r){return F(this,t,e,false,r)},s.prototype.copy=function(t,e,r,n){if(!s.isBuffer(t))throw new TypeError("argument should be a Buffer");if(r||(r=0),n||0===n||(n=this.length),e>=t.length&&(e=t.length),e||(e=0),n>0&&n<r&&(n=r),n===r)return 0;if(0===t.length||0===this.length)return 0;if(e<0)throw new RangeError("targetStart out of bounds");if(r<0||r>=this.length)throw new RangeError("Index out of range");if(n<0)throw new RangeError("sourceEnd out of bounds");n>this.length&&(n=this.length),t.length-e<n-r&&(n=t.length-e+r);const i=n-r;return this===t&&"function"==typeof Uint8Array.prototype.copyWithin?this.copyWithin(e,r,n):Uint8Array.prototype.set.call(t,this.subarray(r,n),e),i},s.prototype.fill=function(t,e,r,n){if("string"==typeof t){if("string"==typeof e?(n=e,e=0,r=this.length):"string"==typeof r&&(n=r,r=this.length),void 0!==n&&"string"!=typeof n)throw new TypeError("encoding must be a string");if("string"==typeof n&&!s.isEncoding(n))throw new TypeError("Unknown encoding: "+n);if(1===t.length){const e=t.charCodeAt(0);("utf8"===n&&e<128||"latin1"===n)&&(t=e);}}else "number"==typeof t?t&=255:"boolean"==typeof t&&(t=Number(t));if(e<0||this.length<e||this.length<r)throw new RangeError("Out of range index");if(r<=e)return this;let i;if(e>>>=0,r=void 0===r?this.length:r>>>0,t||(t=0),"number"==typeof t)for(i=e;i<r;++i)this[i]=t;else {const o=s.isBuffer(t)?t:s.from(t,n),f=o.length;if(0===f)throw new TypeError('The value "'+t+'" is invalid for argument "value"');for(i=0;i<r-e;++i)this[i+e]=o[i%f];}return this};const j={};function z(t,e,r){j[t]=class extends r{constructor(){super(),Object.defineProperty(this,"message",{value:e.apply(this,arguments),writable:true,configurable:true}),this.name=`${this.name} [${t}]`,this.stack,delete this.name;}get code(){return t}set code(t){Object.defineProperty(this,"code",{configurable:true,enumerable:true,value:t,writable:true});}toString(){return `${this.name} [${t}]: ${this.message}`}};}function H(t){let e="",r=t.length;const n="-"===t[0]?1:0;for(;r>=n+4;r-=3)e=`_${t.slice(r-3,r)}${e}`;return `${t.slice(0,r)}${e}`}function D(t,e,r,n,i,o){if(t>r||t<e){const r="bigint"==typeof e?"n":"";let n;throw n=0===e||e===BigInt(0)?`>= 0${r} and < 2${r} ** ${8*(o+1)}${r}`:`>= -(2${r} ** ${8*(o+1)-1}${r}) and < 2 ** ${8*(o+1)-1}${r}`,new j.ERR_OUT_OF_RANGE("value",n,t)}!function(t,e,r){V(e,"offset"),void 0!==t[e]&&void 0!==t[e+r]||q(e,t.length-(r+1));}(n,i,o);}function V(t,e){if("number"!=typeof t)throw new j.ERR_INVALID_ARG_TYPE(e,"number",t)}function q(t,e,r){if(Math.floor(t)!==t)throw V(t,r),new j.ERR_OUT_OF_RANGE("offset","an integer",t);if(e<0)throw new j.ERR_BUFFER_OUT_OF_BOUNDS;throw new j.ERR_OUT_OF_RANGE("offset",`>= 0 and <= ${e}`,t)}z("ERR_BUFFER_OUT_OF_BOUNDS",function(t){return t?`${t} is outside of buffer bounds`:"Attempt to access memory outside buffer bounds"},RangeError),z("ERR_INVALID_ARG_TYPE",function(t,e){return `The "${t}" argument must be of type number. Received type ${typeof e}`},TypeError),z("ERR_OUT_OF_RANGE",function(t,e,r){let n=`The value of "${t}" is out of range.`,i=r;return Number.isInteger(r)&&Math.abs(r)>2**32?i=H(String(r)):"bigint"==typeof r&&(i=String(r),(r>BigInt(2)**BigInt(32)||r<-(BigInt(2)**BigInt(32)))&&(i=H(i)),i+="n"),n+=` It must be ${e}. Received ${i}`,n},RangeError);const Y=/[^+/0-9A-Za-z-_]/g;function G(t,e){let r;e=e||1/0;const n=t.length;let i=null;const o=[];for(let f=0;f<n;++f){if(r=t.charCodeAt(f),r>55295&&r<57344){if(!i){if(r>56319){(e-=3)>-1&&o.push(239,191,189);continue}if(f+1===n){(e-=3)>-1&&o.push(239,191,189);continue}i=r;continue}if(r<56320){(e-=3)>-1&&o.push(239,191,189),i=r;continue}r=65536+(i-55296<<10|r-56320);}else i&&(e-=3)>-1&&o.push(239,191,189);if(i=null,r<128){if((e-=1)<0)break;o.push(r);}else if(r<2048){if((e-=2)<0)break;o.push(r>>6|192,63&r|128);}else if(r<65536){if((e-=3)<0)break;o.push(r>>12|224,r>>6&63|128,63&r|128);}else {if(!(r<1114112))throw new Error("Invalid code point");if((e-=4)<0)break;o.push(r>>18|240,r>>12&63|128,r>>6&63|128,63&r|128);}}return o}function K(t){return e.toByteArray(function(t){if((t=(t=t.split("=")[0]).trim().replace(Y,"")).length<2)return "";for(;t.length%4!=0;)t+="=";return t}(t))}function J(t,e,r,n){let i;for(i=0;i<n&&!(i+r>=e.length||i>=t.length);++i)e[i+r]=t[i];return i}function Q(t,e){return t instanceof e||null!=t&&null!=t.constructor&&null!=t.constructor.name&&t.constructor.name===e.name}function W(t){return t!=t}const X=function(){const t="0123456789abcdef",e=new Array(256);for(let r=0;r<16;++r){const n=16*r;for(let i=0;i<16;++i)e[n+i]=t[r]+t[i];}return e}();function Z(t){return "undefined"==typeof BigInt?tt:t}function tt(){throw new Error("BigInt not supported")}}(u)),u);const p=new TextEncoder,y=new TextDecoder,g=d;function d(t,e=0){let r;if(void 0===t||"string"!=typeof t||"number"!=typeof e)throw TypeError("invlaid init variablie type name. ");return (t=t.toUpperCase()).includes("8")?(r=l.Buffer.alloc(1),t.includes("I")?r.writeInt8(e):r.writeUint8(e)):t.includes("16")?(r=l.Buffer.alloc(2),t.includes("I")?t.includes("L")?r.writeInt16LE(e):r.writeInt16BE(e):t.includes("L")?r.writeUint16LE(e):r.writeUint16BE(e)):t.includes("32")?(r=l.Buffer.alloc(4),t.includes("I")?t.includes("L")?r.writeInt32LE(e):r.writeInt32BE(e):t.includes("L")?r.writeUint32LE(e):r.writeUint32BE(e)):t.includes("F")?(r=l.Buffer.alloc(4),t.includes("L")?r.writeFloatLE(e):r.writeFloatBE(e)):t.includes("N")?r=l.Buffer.from(String(e)):console.log(`invalid type: ${t} or initvalue: ${e}`),r}const b=w;function w(t,e,r){let n,i="B";if("number"==typeof e)"number"==typeof r?(n=l.Buffer.alloc(e),0!==r&&n.fill(r),i="B"):(n=l.Buffer.from(String(e)),i="N");else if("string"==typeof e&&"number"==typeof r)i=e.toUpperCase(),n=d(e,r);else if("string"==typeof e&&void 0===r)n=l.Buffer.from(e),i="S";else if(e instanceof Uint8Array&&void 0===r)n=e instanceof l.Buffer?e:l.Buffer.from(e);else if(e instanceof ArrayBuffer&&void 0===r)n=l.Buffer.from(e);else if(ArrayBuffer.isView(e))n=l.Buffer.from(e.buffer,e.byteOffset,e.byteLength);else if("object"==typeof e&&void 0===r)n=l.Buffer.from(JSON.stringify(e)),i="O";else {if("boolean"!=typeof e||void 0!==r)throw TypeError("invalid meta buffer type");{const t=e?1:0;n=l.Buffer.from([t]),i="!";}}return "string"==typeof t&&t.includes("#")&&(t=""),[t,i,n]}const B=E;function E(...t){let e=0;return t.map(t=>{const r=e++;return "number"==typeof t?b(r,"N",t):b(r,t)})}function m(t){if((t=t.toUpperCase()).includes("8"))return t.includes("I")?"int8":"uint8";if(t.includes("16"))return t.includes("I")?t.includes("L")?"int16_le":"int16_be":t.includes("L")?"uint16_le":"uint16_be";if(t.includes("32"))return t.includes("I")?t.includes("L")?"int32_le":"int32_be":t.includes("L")?"uint32_le":"uint32_be";if(t.includes("F"))return t.includes("L")?"float_le":"float_be";if("B"===t)return "buffer";if("S"===t)return "string";if("N"===t)return "number";if("O"===t)return "object";if("!"===t)return "boolean";throw TypeError("invalid data type")}function A(t,e,r,n){try{const i=m(t);if("int8"==i)return e.readInt8(r);if("uint8"===i)return e.readUint8(r);if("int16_le"===i)return e.readInt16LE(r);if("int16_be"===i)return e.readInt16BE(r);if("uint16_le"===i)return e.readUint16LE(r);if("uint16_be"===i)return e.readUint16BE(r);if("int32_le"===i)return e.readInt32LE(r);if("int32_be"===i)return e.readInt32BE(r);if("uint32_le"===i)return e.readUint32LE(r);if("uint32_be"===i)return e.readUint32BE(r);if("float_le"===i)return e.readFloatLE(r);if("float_be"===i)return e.readFloatBE(r);if("buffer"===i)return e.subarray(r,r+n);if("string"===i){const t=e.subarray(r,r+n);return y.decode(t)}if("number"===i){const t=e.subarray(r,r+n);return Number(y.decode(t))}if("object"===i){const t=e.subarray(r,r+n);return JSON.parse(y.decode(t))}return "boolean"===i?1===e.readInt8(r):void 0}catch(t){}}function _(...t){const e=function(t){let e=[];return t.filter(t=>{if(!Array.isArray(t[0]))return t;e=e.concat(t);}).concat(e)}(t);let r=0;const n=[];let i,o,f=0;if(e.forEach(t=>{const[e,i,o]=t;r+=o.byteLength,("number"==typeof e||e.length>0)&&n.push([e,i,f,o.byteLength]),f=r;}),n.length>0){let t=JSON.stringify(n);i=p.encode(t),o=i.byteLength,r=r+o+2;}const s=l.Buffer.alloc(r);if(f=0,e.forEach(t=>{const e=t[2];s.set(e,f),f+=e.byteLength;}),n.length>0){s.set(i,f);const t=g("16",o);return s.set(t,f+o),s}return s}const U=I;function I(t,e=false){if(void 0===t)throw TypeError("Invalid data type: Undefined");if("string"==typeof t)return p.encode(t);if("number"==typeof t)return Uint8Array.from([t]);if(t instanceof ArrayBuffer){if(e)return new Uint8Array(t);{const e=new Uint8Array(t),r=new Uint8Array(t.byteLength);return r.set(e),r}}if(ArrayBuffer.isView(t)){if(e)return new Uint8Array(t.buffer,t.byteOffset,t.byteLength);{const e=new Uint8Array(t.buffer,t.byteOffset,t.byteLength),r=new Uint8Array(t.byteLength);return r.set(e),r}}return p.encode(JSON.stringify(t))}const L=v;function v(t,e=false){const r=I(t,e);return e?l.Buffer.from(r.buffer,r.byteOffset,r.byteLength):l.Buffer.from(r)}const R=T;function T(...t){const e=t.map(t=>v(t));return l.Buffer.concat(e)}const S=O;function O(...t){try{let e=0,r=0;const n=t.map(t=>I(t));n.forEach(t=>{e+=t.byteLength;});const i=new Uint8Array(e);return n.forEach(t=>{i.set(t,r),r+=t.byteLength;}),i}catch(t){console.log(t);}}function N(t){return 0===k(t)?t.byteLength:t.byteLength-k(t)-C}function M(t,e){try{const r=new Uint8Array(t.buffer,t.byteOffset,t.byteLength),n=r.byteLength-e-2,i=r.subarray(n,r.byteLength-2),o=y.decode(i),f=JSON.parse(o);if(!Array.isArray(f)||!Array.isArray(f[0]))return;let s=f[0];if(!s)return;if(s.length<3)return;const[u,h,a]=s;if("string"!=typeof h||"number"!=typeof a)return;return f}catch(t){}}const C=2;function x(t){return t instanceof ArrayBuffer&&(t=l.Buffer.from(t)),t instanceof Uint8Array?t.byteLength<=C?0:new DataView(t.buffer,t.byteOffset,t.byteLength).getUint16(t.byteLength-C):0}function k(t){if(t instanceof ArrayBuffer&&(t=l.Buffer.from(t)),t instanceof Uint8Array){const e=t.byteLength;if(e<=C)return 0;const r=x(t);return 0===r||r>e?0:M(t,r)?r:0}return 0}function P(t){const e=N(t);return t.subarray(0,e)}function $(t,e=false){t instanceof ArrayBuffer&&(t=l.Buffer.from(t));const r=x(t);if(0===r)return;let n=M(t,r);return n?e?(n.forEach(t=>{null==t[3]&&(t[1].includes("8")?t[3]=1:t[1].includes("16")?t[3]=2:t[1].includes("32")||t[1].includes("F")?t[3]=4:t[1].includes("!")&&(t[3]=1)),t[4]=m(t[1]);}),n):n:void 0}var F=Object.freeze({__proto__:null,B8:L,B8pack:R,Buffer:l.Buffer,MB:b,MBA:B,NB:g,TAIL_LEN:C,U8:U,U8pack:S,equal:function(t,e){if(t.byteLength!==e.byteLength)return  false;for(let r=0;r<t.byteLength;r++)if(t[r]!==e[r])return  false;return  true},getBuffer:P,getBufferSize:N,getMeta:$,getMetaDetail:function(t){return $(t,true)},getMetaSize:k,hex:function(t){return Array.prototype.map.call(new Uint8Array(t),t=>("00"+t.toString(16)).slice(-2)).join("")},meta:function(...t){return $(_(...t))},metaBuffer:w,metaBufferArguments:E,metaDetail:function(...t){return $(_(...t),true)},numberBuffer:d,pack:_,parseBuffer:v,parseBufferThenConcat:T,parseMetaInfo:M,parseTypeName:m,parseUint8Array:I,parseUint8ThenConcat:O,rawPack:function(...t){return P(_(...t))},readTail:x,readTypedBuffer:A,unpack:function(t,e){const r=e||$(t);if(!r)return;const n=l.Buffer.from(t),i={};let o=0;if(r.forEach(t=>{const[e,r,f,s]=t;let u=A(r,n,f,s);null!=u&&(i[e]=u,s&&(o+=s));}),e&&n.byteLength!==o){let t=n.byteLength-o,e=A("b",n,o,t);if(null==e)return;i.$OTHERS=e;}let f=0,s=[];for(;i[f];)s.push(i[f++]);return s.length>0&&(i.args=s,i.$=i.args),i}});const j={hash:function(t){return i(F.U8(t))},hex:function(t){return F.B8(i(F.U8(t))).toString("hex")},base64:function(t){return F.B8(i(F.U8(t))).toString("base64")}};j.hmac=function(t,e){return function(t,e){const r=new n(t).update(e),i=r.digest();return r.clean(),i}(F.U8(t),F.U8(e))};var z,H={},D={};var V,q,Y={};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */function G(){return V||(V=1,Y.read=function(t,e,r,n,i){var o,f,s=8*i-n-1,u=(1<<s)-1,h=u>>1,a=-7,c=r?i-1:0,l=r?-1:1,p=t[e+c];for(c+=l,o=p&(1<<-a)-1,p>>=-a,a+=s;a>0;o=256*o+t[e+c],c+=l,a-=8);for(f=o&(1<<-a)-1,o>>=-a,a+=n;a>0;f=256*f+t[e+c],c+=l,a-=8);if(0===o)o=1-h;else {if(o===u)return f?NaN:1/0*(p?-1:1);f+=Math.pow(2,n),o-=h;}return (p?-1:1)*f*Math.pow(2,o-n)},Y.write=function(t,e,r,n,i,o){var f,s,u,h=8*o-i-1,a=(1<<h)-1,c=a>>1,l=23===i?Math.pow(2,-24)-Math.pow(2,-77):0,p=n?0:o-1,y=n?1:-1,g=e<0||0===e&&1/e<0?1:0;for(e=Math.abs(e),isNaN(e)||e===1/0?(s=isNaN(e)?1:0,f=a):(f=Math.floor(Math.log(e)/Math.LN2),e*(u=Math.pow(2,-f))<1&&(f--,u*=2),(e+=f+c>=1?l/u:l*Math.pow(2,1-c))*u>=2&&(f++,u/=2),f+c>=a?(s=0,f=a):f+c>=1?(s=(e*u-1)*Math.pow(2,i),f+=c):(s=e*Math.pow(2,c-1)*Math.pow(2,i),f=0));i>=8;t[r+p]=255&s,p+=y,s/=256,i-=8);for(f=f<<i|s,h+=i;h>0;t[r+p]=255&f,p+=y,f/=256,h-=8);t[r+p-y]|=128*g;}),Y}
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */var K=(q||(q=1,function(t){const e=function(){if(z)return D;z=1,D.byteLength=function(t){var e=o(t),r=e[0],n=e[1];return 3*(r+n)/4-n},D.toByteArray=function(t){var n,i,f=o(t),s=f[0],u=f[1],h=new r(function(t,e,r){return 3*(e+r)/4-r}(0,s,u)),a=0,c=u>0?s-4:s;for(i=0;i<c;i+=4)n=e[t.charCodeAt(i)]<<18|e[t.charCodeAt(i+1)]<<12|e[t.charCodeAt(i+2)]<<6|e[t.charCodeAt(i+3)],h[a++]=n>>16&255,h[a++]=n>>8&255,h[a++]=255&n;return 2===u&&(n=e[t.charCodeAt(i)]<<2|e[t.charCodeAt(i+1)]>>4,h[a++]=255&n),1===u&&(n=e[t.charCodeAt(i)]<<10|e[t.charCodeAt(i+1)]<<4|e[t.charCodeAt(i+2)]>>2,h[a++]=n>>8&255,h[a++]=255&n),h},D.fromByteArray=function(e){for(var r,n=e.length,i=n%3,o=[],f=16383,u=0,h=n-i;u<h;u+=f)o.push(s(e,u,u+f>h?h:u+f));return 1===i?(r=e[n-1],o.push(t[r>>2]+t[r<<4&63]+"==")):2===i&&(r=(e[n-2]<<8)+e[n-1],o.push(t[r>>10]+t[r>>4&63]+t[r<<2&63]+"=")),o.join("")};for(var t=[],e=[],r="undefined"!=typeof Uint8Array?Uint8Array:Array,n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",i=0;i<64;++i)t[i]=n[i],e[n.charCodeAt(i)]=i;function o(t){var e=t.length;if(e%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var r=t.indexOf("=");return  -1===r&&(r=e),[r,r===e?0:4-r%4]}function f(e){return t[e>>18&63]+t[e>>12&63]+t[e>>6&63]+t[63&e]}function s(t,e,r){for(var n,i=[],o=e;o<r;o+=3)n=(t[o]<<16&16711680)+(t[o+1]<<8&65280)+(255&t[o+2]),i.push(f(n));return i.join("")}return e["-".charCodeAt(0)]=62,e["_".charCodeAt(0)]=63,D}(),r=G(),n="function"==typeof Symbol&&"function"==typeof Symbol.for?Symbol.for("nodejs.util.inspect.custom"):null;t.Buffer=f,t.SlowBuffer=function(t){return +t!=t&&(t=0),f.alloc(+t)},t.INSPECT_MAX_BYTES=50;const i=2147483647;function o(t){if(t>i)throw new RangeError('The value "'+t+'" is invalid for option "size"');const e=new Uint8Array(t);return Object.setPrototypeOf(e,f.prototype),e}function f(t,e,r){if("number"==typeof t){if("string"==typeof e)throw new TypeError('The "string" argument must be of type string. Received type number');return h(t)}return s(t,e,r)}function s(t,e,r){if("string"==typeof t)return function(t,e){if("string"==typeof e&&""!==e||(e="utf8"),!f.isEncoding(e))throw new TypeError("Unknown encoding: "+e);const r=0|p(t,e);let n=o(r);const i=n.write(t,e);return i!==r&&(n=n.slice(0,i)),n}(t,e);if(ArrayBuffer.isView(t))return function(t){if(Q(t,Uint8Array)){const e=new Uint8Array(t);return c(e.buffer,e.byteOffset,e.byteLength)}return a(t)}(t);if(null==t)throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof t);if(Q(t,ArrayBuffer)||t&&Q(t.buffer,ArrayBuffer))return c(t,e,r);if("undefined"!=typeof SharedArrayBuffer&&(Q(t,SharedArrayBuffer)||t&&Q(t.buffer,SharedArrayBuffer)))return c(t,e,r);if("number"==typeof t)throw new TypeError('The "value" argument must not be of type number. Received type number');const n=t.valueOf&&t.valueOf();if(null!=n&&n!==t)return f.from(n,e,r);const i=function(t){if(f.isBuffer(t)){const e=0|l(t.length),r=o(e);return 0===r.length||t.copy(r,0,0,e),r}return void 0!==t.length?"number"!=typeof t.length||W(t.length)?o(0):a(t):"Buffer"===t.type&&Array.isArray(t.data)?a(t.data):void 0}(t);if(i)return i;if("undefined"!=typeof Symbol&&null!=Symbol.toPrimitive&&"function"==typeof t[Symbol.toPrimitive])return f.from(t[Symbol.toPrimitive]("string"),e,r);throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof t)}function u(t){if("number"!=typeof t)throw new TypeError('"size" argument must be of type number');if(t<0)throw new RangeError('The value "'+t+'" is invalid for option "size"')}function h(t){return u(t),o(t<0?0:0|l(t))}function a(t){const e=t.length<0?0:0|l(t.length),r=o(e);for(let n=0;n<e;n+=1)r[n]=255&t[n];return r}function c(t,e,r){if(e<0||t.byteLength<e)throw new RangeError('"offset" is outside of buffer bounds');if(t.byteLength<e+(r||0))throw new RangeError('"length" is outside of buffer bounds');let n;return n=void 0===e&&void 0===r?new Uint8Array(t):void 0===r?new Uint8Array(t,e):new Uint8Array(t,e,r),Object.setPrototypeOf(n,f.prototype),n}function l(t){if(t>=i)throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+i.toString(16)+" bytes");return 0|t}function p(t,e){if(f.isBuffer(t))return t.length;if(ArrayBuffer.isView(t)||Q(t,ArrayBuffer))return t.byteLength;if("string"!=typeof t)throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type '+typeof t);const r=t.length,n=arguments.length>2&&true===arguments[2];if(!n&&0===r)return 0;let i=false;for(;;)switch(e){case "ascii":case "latin1":case "binary":return r;case "utf8":case "utf-8":return Y(t).length;case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":return 2*r;case "hex":return r>>>1;case "base64":return K(t).length;default:if(i)return n?-1:Y(t).length;e=(""+e).toLowerCase(),i=true;}}function y(t,e,r){let n=false;if((void 0===e||e<0)&&(e=0),e>this.length)return "";if((void 0===r||r>this.length)&&(r=this.length),r<=0)return "";if((r>>>=0)<=(e>>>=0))return "";for(t||(t="utf8");;)switch(t){case "hex":return R(this,e,r);case "utf8":case "utf-8":return U(this,e,r);case "ascii":return L(this,e,r);case "latin1":case "binary":return v(this,e,r);case "base64":return _(this,e,r);case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":return T(this,e,r);default:if(n)throw new TypeError("Unknown encoding: "+t);t=(t+"").toLowerCase(),n=true;}}function g(t,e,r){const n=t[e];t[e]=t[r],t[r]=n;}function d(t,e,r,n,i){if(0===t.length)return  -1;if("string"==typeof r?(n=r,r=0):r>2147483647?r=2147483647:r<-2147483648&&(r=-2147483648),W(r=+r)&&(r=i?0:t.length-1),r<0&&(r=t.length+r),r>=t.length){if(i)return  -1;r=t.length-1;}else if(r<0){if(!i)return  -1;r=0;}if("string"==typeof e&&(e=f.from(e,n)),f.isBuffer(e))return 0===e.length?-1:b(t,e,r,n,i);if("number"==typeof e)return e&=255,"function"==typeof Uint8Array.prototype.indexOf?i?Uint8Array.prototype.indexOf.call(t,e,r):Uint8Array.prototype.lastIndexOf.call(t,e,r):b(t,[e],r,n,i);throw new TypeError("val must be string, number or Buffer")}function b(t,e,r,n,i){let o,f=1,s=t.length,u=e.length;if(void 0!==n&&("ucs2"===(n=String(n).toLowerCase())||"ucs-2"===n||"utf16le"===n||"utf-16le"===n)){if(t.length<2||e.length<2)return  -1;f=2,s/=2,u/=2,r/=2;}function h(t,e){return 1===f?t[e]:t.readUInt16BE(e*f)}if(i){let n=-1;for(o=r;o<s;o++)if(h(t,o)===h(e,-1===n?0:o-n)){if(-1===n&&(n=o),o-n+1===u)return n*f}else  -1!==n&&(o-=o-n),n=-1;}else for(r+u>s&&(r=s-u),o=r;o>=0;o--){let r=true;for(let n=0;n<u;n++)if(h(t,o+n)!==h(e,n)){r=false;break}if(r)return o}return  -1}function w(t,e,r,n){r=Number(r)||0;const i=t.length-r;n?(n=Number(n))>i&&(n=i):n=i;const o=e.length;let f;for(n>o/2&&(n=o/2),f=0;f<n;++f){const n=parseInt(e.substr(2*f,2),16);if(W(n))return f;t[r+f]=n;}return f}function B(t,e,r,n){return J(Y(e,t.length-r),t,r,n)}function E(t,e,r,n){return J(function(t){const e=[];for(let r=0;r<t.length;++r)e.push(255&t.charCodeAt(r));return e}(e),t,r,n)}function m(t,e,r,n){return J(K(e),t,r,n)}function A(t,e,r,n){return J(function(t,e){let r,n,i;const o=[];for(let f=0;f<t.length&&!((e-=2)<0);++f)r=t.charCodeAt(f),n=r>>8,i=r%256,o.push(i),o.push(n);return o}(e,t.length-r),t,r,n)}function _(t,r,n){return 0===r&&n===t.length?e.fromByteArray(t):e.fromByteArray(t.slice(r,n))}function U(t,e,r){r=Math.min(t.length,r);const n=[];let i=e;for(;i<r;){const e=t[i];let o=null,f=e>239?4:e>223?3:e>191?2:1;if(i+f<=r){let r,n,s,u;switch(f){case 1:e<128&&(o=e);break;case 2:r=t[i+1],128==(192&r)&&(u=(31&e)<<6|63&r,u>127&&(o=u));break;case 3:r=t[i+1],n=t[i+2],128==(192&r)&&128==(192&n)&&(u=(15&e)<<12|(63&r)<<6|63&n,u>2047&&(u<55296||u>57343)&&(o=u));break;case 4:r=t[i+1],n=t[i+2],s=t[i+3],128==(192&r)&&128==(192&n)&&128==(192&s)&&(u=(15&e)<<18|(63&r)<<12|(63&n)<<6|63&s,u>65535&&u<1114112&&(o=u));}}null===o?(o=65533,f=1):o>65535&&(o-=65536,n.push(o>>>10&1023|55296),o=56320|1023&o),n.push(o),i+=f;}return function(t){const e=t.length;if(e<=I)return String.fromCharCode.apply(String,t);let r="",n=0;for(;n<e;)r+=String.fromCharCode.apply(String,t.slice(n,n+=I));return r}(n)}t.kMaxLength=i,f.TYPED_ARRAY_SUPPORT=function(){try{const t=new Uint8Array(1),e={foo:function(){return 42}};return Object.setPrototypeOf(e,Uint8Array.prototype),Object.setPrototypeOf(t,e),42===t.foo()}catch(t){return  false}}(),f.TYPED_ARRAY_SUPPORT||"undefined"==typeof console||"function"!=typeof console.error||console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."),Object.defineProperty(f.prototype,"parent",{enumerable:true,get:function(){if(f.isBuffer(this))return this.buffer}}),Object.defineProperty(f.prototype,"offset",{enumerable:true,get:function(){if(f.isBuffer(this))return this.byteOffset}}),f.poolSize=8192,f.from=function(t,e,r){return s(t,e,r)},Object.setPrototypeOf(f.prototype,Uint8Array.prototype),Object.setPrototypeOf(f,Uint8Array),f.alloc=function(t,e,r){return function(t,e,r){return u(t),t<=0?o(t):void 0!==e?"string"==typeof r?o(t).fill(e,r):o(t).fill(e):o(t)}(t,e,r)},f.allocUnsafe=function(t){return h(t)},f.allocUnsafeSlow=function(t){return h(t)},f.isBuffer=function(t){return null!=t&&true===t._isBuffer&&t!==f.prototype},f.compare=function(t,e){if(Q(t,Uint8Array)&&(t=f.from(t,t.offset,t.byteLength)),Q(e,Uint8Array)&&(e=f.from(e,e.offset,e.byteLength)),!f.isBuffer(t)||!f.isBuffer(e))throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');if(t===e)return 0;let r=t.length,n=e.length;for(let i=0,o=Math.min(r,n);i<o;++i)if(t[i]!==e[i]){r=t[i],n=e[i];break}return r<n?-1:n<r?1:0},f.isEncoding=function(t){switch(String(t).toLowerCase()){case "hex":case "utf8":case "utf-8":case "ascii":case "latin1":case "binary":case "base64":case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":return  true;default:return  false}},f.concat=function(t,e){if(!Array.isArray(t))throw new TypeError('"list" argument must be an Array of Buffers');if(0===t.length)return f.alloc(0);let r;if(void 0===e)for(e=0,r=0;r<t.length;++r)e+=t[r].length;const n=f.allocUnsafe(e);let i=0;for(r=0;r<t.length;++r){let e=t[r];if(Q(e,Uint8Array))i+e.length>n.length?(f.isBuffer(e)||(e=f.from(e)),e.copy(n,i)):Uint8Array.prototype.set.call(n,e,i);else {if(!f.isBuffer(e))throw new TypeError('"list" argument must be an Array of Buffers');e.copy(n,i);}i+=e.length;}return n},f.byteLength=p,f.prototype._isBuffer=true,f.prototype.swap16=function(){const t=this.length;if(t%2!=0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(let e=0;e<t;e+=2)g(this,e,e+1);return this},f.prototype.swap32=function(){const t=this.length;if(t%4!=0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(let e=0;e<t;e+=4)g(this,e,e+3),g(this,e+1,e+2);return this},f.prototype.swap64=function(){const t=this.length;if(t%8!=0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(let e=0;e<t;e+=8)g(this,e,e+7),g(this,e+1,e+6),g(this,e+2,e+5),g(this,e+3,e+4);return this},f.prototype.toString=function(){const t=this.length;return 0===t?"":0===arguments.length?U(this,0,t):y.apply(this,arguments)},f.prototype.toLocaleString=f.prototype.toString,f.prototype.equals=function(t){if(!f.isBuffer(t))throw new TypeError("Argument must be a Buffer");return this===t||0===f.compare(this,t)},f.prototype.inspect=function(){let e="";const r=t.INSPECT_MAX_BYTES;return e=this.toString("hex",0,r).replace(/(.{2})/g,"$1 ").trim(),this.length>r&&(e+=" ... "),"<Buffer "+e+">"},n&&(f.prototype[n]=f.prototype.inspect),f.prototype.compare=function(t,e,r,n,i){if(Q(t,Uint8Array)&&(t=f.from(t,t.offset,t.byteLength)),!f.isBuffer(t))throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type '+typeof t);if(void 0===e&&(e=0),void 0===r&&(r=t?t.length:0),void 0===n&&(n=0),void 0===i&&(i=this.length),e<0||r>t.length||n<0||i>this.length)throw new RangeError("out of range index");if(n>=i&&e>=r)return 0;if(n>=i)return  -1;if(e>=r)return 1;if(this===t)return 0;let o=(i>>>=0)-(n>>>=0),s=(r>>>=0)-(e>>>=0);const u=Math.min(o,s),h=this.slice(n,i),a=t.slice(e,r);for(let t=0;t<u;++t)if(h[t]!==a[t]){o=h[t],s=a[t];break}return o<s?-1:s<o?1:0},f.prototype.includes=function(t,e,r){return  -1!==this.indexOf(t,e,r)},f.prototype.indexOf=function(t,e,r){return d(this,t,e,r,true)},f.prototype.lastIndexOf=function(t,e,r){return d(this,t,e,r,false)},f.prototype.write=function(t,e,r,n){if(void 0===e)n="utf8",r=this.length,e=0;else if(void 0===r&&"string"==typeof e)n=e,r=this.length,e=0;else {if(!isFinite(e))throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");e>>>=0,isFinite(r)?(r>>>=0,void 0===n&&(n="utf8")):(n=r,r=void 0);}const i=this.length-e;if((void 0===r||r>i)&&(r=i),t.length>0&&(r<0||e<0)||e>this.length)throw new RangeError("Attempt to write outside buffer bounds");n||(n="utf8");let o=false;for(;;)switch(n){case "hex":return w(this,t,e,r);case "utf8":case "utf-8":return B(this,t,e,r);case "ascii":case "latin1":case "binary":return E(this,t,e,r);case "base64":return m(this,t,e,r);case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":return A(this,t,e,r);default:if(o)throw new TypeError("Unknown encoding: "+n);n=(""+n).toLowerCase(),o=true;}},f.prototype.toJSON=function(){return {type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};const I=4096;function L(t,e,r){let n="";r=Math.min(t.length,r);for(let i=e;i<r;++i)n+=String.fromCharCode(127&t[i]);return n}function v(t,e,r){let n="";r=Math.min(t.length,r);for(let i=e;i<r;++i)n+=String.fromCharCode(t[i]);return n}function R(t,e,r){const n=t.length;(!e||e<0)&&(e=0),(!r||r<0||r>n)&&(r=n);let i="";for(let n=e;n<r;++n)i+=X[t[n]];return i}function T(t,e,r){const n=t.slice(e,r);let i="";for(let t=0;t<n.length-1;t+=2)i+=String.fromCharCode(n[t]+256*n[t+1]);return i}function S(t,e,r){if(t%1!=0||t<0)throw new RangeError("offset is not uint");if(t+e>r)throw new RangeError("Trying to access beyond buffer length")}function O(t,e,r,n,i,o){if(!f.isBuffer(t))throw new TypeError('"buffer" argument must be a Buffer instance');if(e>i||e<o)throw new RangeError('"value" argument is out of bounds');if(r+n>t.length)throw new RangeError("Index out of range")}function N(t,e,r,n,i){j(e,n,i,t,r,7);let o=Number(e&BigInt(4294967295));t[r++]=o,o>>=8,t[r++]=o,o>>=8,t[r++]=o,o>>=8,t[r++]=o;let f=Number(e>>BigInt(32)&BigInt(4294967295));return t[r++]=f,f>>=8,t[r++]=f,f>>=8,t[r++]=f,f>>=8,t[r++]=f,r}function M(t,e,r,n,i){j(e,n,i,t,r,7);let o=Number(e&BigInt(4294967295));t[r+7]=o,o>>=8,t[r+6]=o,o>>=8,t[r+5]=o,o>>=8,t[r+4]=o;let f=Number(e>>BigInt(32)&BigInt(4294967295));return t[r+3]=f,f>>=8,t[r+2]=f,f>>=8,t[r+1]=f,f>>=8,t[r]=f,r+8}function C(t,e,r,n,i,o){if(r+n>t.length)throw new RangeError("Index out of range");if(r<0)throw new RangeError("Index out of range")}function x(t,e,n,i,o){return e=+e,n>>>=0,o||C(t,0,n,4),r.write(t,e,n,i,23,4),n+4}function k(t,e,n,i,o){return e=+e,n>>>=0,o||C(t,0,n,8),r.write(t,e,n,i,52,8),n+8}f.prototype.slice=function(t,e){const r=this.length;(t=~~t)<0?(t+=r)<0&&(t=0):t>r&&(t=r),(e=void 0===e?r:~~e)<0?(e+=r)<0&&(e=0):e>r&&(e=r),e<t&&(e=t);const n=this.subarray(t,e);return Object.setPrototypeOf(n,f.prototype),n},f.prototype.readUintLE=f.prototype.readUIntLE=function(t,e,r){t>>>=0,e>>>=0,r||S(t,e,this.length);let n=this[t],i=1,o=0;for(;++o<e&&(i*=256);)n+=this[t+o]*i;return n},f.prototype.readUintBE=f.prototype.readUIntBE=function(t,e,r){t>>>=0,e>>>=0,r||S(t,e,this.length);let n=this[t+--e],i=1;for(;e>0&&(i*=256);)n+=this[t+--e]*i;return n},f.prototype.readUint8=f.prototype.readUInt8=function(t,e){return t>>>=0,e||S(t,1,this.length),this[t]},f.prototype.readUint16LE=f.prototype.readUInt16LE=function(t,e){return t>>>=0,e||S(t,2,this.length),this[t]|this[t+1]<<8},f.prototype.readUint16BE=f.prototype.readUInt16BE=function(t,e){return t>>>=0,e||S(t,2,this.length),this[t]<<8|this[t+1]},f.prototype.readUint32LE=f.prototype.readUInt32LE=function(t,e){return t>>>=0,e||S(t,4,this.length),(this[t]|this[t+1]<<8|this[t+2]<<16)+16777216*this[t+3]},f.prototype.readUint32BE=f.prototype.readUInt32BE=function(t,e){return t>>>=0,e||S(t,4,this.length),16777216*this[t]+(this[t+1]<<16|this[t+2]<<8|this[t+3])},f.prototype.readBigUInt64LE=Z(function(t){H(t>>>=0,"offset");const e=this[t],r=this[t+7];void 0!==e&&void 0!==r||V(t,this.length-8);const n=e+256*this[++t]+65536*this[++t]+this[++t]*2**24,i=this[++t]+256*this[++t]+65536*this[++t]+r*2**24;return BigInt(n)+(BigInt(i)<<BigInt(32))}),f.prototype.readBigUInt64BE=Z(function(t){H(t>>>=0,"offset");const e=this[t],r=this[t+7];void 0!==e&&void 0!==r||V(t,this.length-8);const n=e*2**24+65536*this[++t]+256*this[++t]+this[++t],i=this[++t]*2**24+65536*this[++t]+256*this[++t]+r;return (BigInt(n)<<BigInt(32))+BigInt(i)}),f.prototype.readIntLE=function(t,e,r){t>>>=0,e>>>=0,r||S(t,e,this.length);let n=this[t],i=1,o=0;for(;++o<e&&(i*=256);)n+=this[t+o]*i;return i*=128,n>=i&&(n-=Math.pow(2,8*e)),n},f.prototype.readIntBE=function(t,e,r){t>>>=0,e>>>=0,r||S(t,e,this.length);let n=e,i=1,o=this[t+--n];for(;n>0&&(i*=256);)o+=this[t+--n]*i;return i*=128,o>=i&&(o-=Math.pow(2,8*e)),o},f.prototype.readInt8=function(t,e){return t>>>=0,e||S(t,1,this.length),128&this[t]?-1*(255-this[t]+1):this[t]},f.prototype.readInt16LE=function(t,e){t>>>=0,e||S(t,2,this.length);const r=this[t]|this[t+1]<<8;return 32768&r?4294901760|r:r},f.prototype.readInt16BE=function(t,e){t>>>=0,e||S(t,2,this.length);const r=this[t+1]|this[t]<<8;return 32768&r?4294901760|r:r},f.prototype.readInt32LE=function(t,e){return t>>>=0,e||S(t,4,this.length),this[t]|this[t+1]<<8|this[t+2]<<16|this[t+3]<<24},f.prototype.readInt32BE=function(t,e){return t>>>=0,e||S(t,4,this.length),this[t]<<24|this[t+1]<<16|this[t+2]<<8|this[t+3]},f.prototype.readBigInt64LE=Z(function(t){H(t>>>=0,"offset");const e=this[t],r=this[t+7];void 0!==e&&void 0!==r||V(t,this.length-8);const n=this[t+4]+256*this[t+5]+65536*this[t+6]+(r<<24);return (BigInt(n)<<BigInt(32))+BigInt(e+256*this[++t]+65536*this[++t]+this[++t]*2**24)}),f.prototype.readBigInt64BE=Z(function(t){H(t>>>=0,"offset");const e=this[t],r=this[t+7];void 0!==e&&void 0!==r||V(t,this.length-8);const n=(e<<24)+65536*this[++t]+256*this[++t]+this[++t];return (BigInt(n)<<BigInt(32))+BigInt(this[++t]*2**24+65536*this[++t]+256*this[++t]+r)}),f.prototype.readFloatLE=function(t,e){return t>>>=0,e||S(t,4,this.length),r.read(this,t,true,23,4)},f.prototype.readFloatBE=function(t,e){return t>>>=0,e||S(t,4,this.length),r.read(this,t,false,23,4)},f.prototype.readDoubleLE=function(t,e){return t>>>=0,e||S(t,8,this.length),r.read(this,t,true,52,8)},f.prototype.readDoubleBE=function(t,e){return t>>>=0,e||S(t,8,this.length),r.read(this,t,false,52,8)},f.prototype.writeUintLE=f.prototype.writeUIntLE=function(t,e,r,n){t=+t,e>>>=0,r>>>=0,n||O(this,t,e,r,Math.pow(2,8*r)-1,0);let i=1,o=0;for(this[e]=255&t;++o<r&&(i*=256);)this[e+o]=t/i&255;return e+r},f.prototype.writeUintBE=f.prototype.writeUIntBE=function(t,e,r,n){t=+t,e>>>=0,r>>>=0,n||O(this,t,e,r,Math.pow(2,8*r)-1,0);let i=r-1,o=1;for(this[e+i]=255&t;--i>=0&&(o*=256);)this[e+i]=t/o&255;return e+r},f.prototype.writeUint8=f.prototype.writeUInt8=function(t,e,r){return t=+t,e>>>=0,r||O(this,t,e,1,255,0),this[e]=255&t,e+1},f.prototype.writeUint16LE=f.prototype.writeUInt16LE=function(t,e,r){return t=+t,e>>>=0,r||O(this,t,e,2,65535,0),this[e]=255&t,this[e+1]=t>>>8,e+2},f.prototype.writeUint16BE=f.prototype.writeUInt16BE=function(t,e,r){return t=+t,e>>>=0,r||O(this,t,e,2,65535,0),this[e]=t>>>8,this[e+1]=255&t,e+2},f.prototype.writeUint32LE=f.prototype.writeUInt32LE=function(t,e,r){return t=+t,e>>>=0,r||O(this,t,e,4,4294967295,0),this[e+3]=t>>>24,this[e+2]=t>>>16,this[e+1]=t>>>8,this[e]=255&t,e+4},f.prototype.writeUint32BE=f.prototype.writeUInt32BE=function(t,e,r){return t=+t,e>>>=0,r||O(this,t,e,4,4294967295,0),this[e]=t>>>24,this[e+1]=t>>>16,this[e+2]=t>>>8,this[e+3]=255&t,e+4},f.prototype.writeBigUInt64LE=Z(function(t,e=0){return N(this,t,e,BigInt(0),BigInt("0xffffffffffffffff"))}),f.prototype.writeBigUInt64BE=Z(function(t,e=0){return M(this,t,e,BigInt(0),BigInt("0xffffffffffffffff"))}),f.prototype.writeIntLE=function(t,e,r,n){if(t=+t,e>>>=0,!n){const n=Math.pow(2,8*r-1);O(this,t,e,r,n-1,-n);}let i=0,o=1,f=0;for(this[e]=255&t;++i<r&&(o*=256);)t<0&&0===f&&0!==this[e+i-1]&&(f=1),this[e+i]=(t/o|0)-f&255;return e+r},f.prototype.writeIntBE=function(t,e,r,n){if(t=+t,e>>>=0,!n){const n=Math.pow(2,8*r-1);O(this,t,e,r,n-1,-n);}let i=r-1,o=1,f=0;for(this[e+i]=255&t;--i>=0&&(o*=256);)t<0&&0===f&&0!==this[e+i+1]&&(f=1),this[e+i]=(t/o|0)-f&255;return e+r},f.prototype.writeInt8=function(t,e,r){return t=+t,e>>>=0,r||O(this,t,e,1,127,-128),t<0&&(t=255+t+1),this[e]=255&t,e+1},f.prototype.writeInt16LE=function(t,e,r){return t=+t,e>>>=0,r||O(this,t,e,2,32767,-32768),this[e]=255&t,this[e+1]=t>>>8,e+2},f.prototype.writeInt16BE=function(t,e,r){return t=+t,e>>>=0,r||O(this,t,e,2,32767,-32768),this[e]=t>>>8,this[e+1]=255&t,e+2},f.prototype.writeInt32LE=function(t,e,r){return t=+t,e>>>=0,r||O(this,t,e,4,2147483647,-2147483648),this[e]=255&t,this[e+1]=t>>>8,this[e+2]=t>>>16,this[e+3]=t>>>24,e+4},f.prototype.writeInt32BE=function(t,e,r){return t=+t,e>>>=0,r||O(this,t,e,4,2147483647,-2147483648),t<0&&(t=4294967295+t+1),this[e]=t>>>24,this[e+1]=t>>>16,this[e+2]=t>>>8,this[e+3]=255&t,e+4},f.prototype.writeBigInt64LE=Z(function(t,e=0){return N(this,t,e,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))}),f.prototype.writeBigInt64BE=Z(function(t,e=0){return M(this,t,e,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))}),f.prototype.writeFloatLE=function(t,e,r){return x(this,t,e,true,r)},f.prototype.writeFloatBE=function(t,e,r){return x(this,t,e,false,r)},f.prototype.writeDoubleLE=function(t,e,r){return k(this,t,e,true,r)},f.prototype.writeDoubleBE=function(t,e,r){return k(this,t,e,false,r)},f.prototype.copy=function(t,e,r,n){if(!f.isBuffer(t))throw new TypeError("argument should be a Buffer");if(r||(r=0),n||0===n||(n=this.length),e>=t.length&&(e=t.length),e||(e=0),n>0&&n<r&&(n=r),n===r)return 0;if(0===t.length||0===this.length)return 0;if(e<0)throw new RangeError("targetStart out of bounds");if(r<0||r>=this.length)throw new RangeError("Index out of range");if(n<0)throw new RangeError("sourceEnd out of bounds");n>this.length&&(n=this.length),t.length-e<n-r&&(n=t.length-e+r);const i=n-r;return this===t&&"function"==typeof Uint8Array.prototype.copyWithin?this.copyWithin(e,r,n):Uint8Array.prototype.set.call(t,this.subarray(r,n),e),i},f.prototype.fill=function(t,e,r,n){if("string"==typeof t){if("string"==typeof e?(n=e,e=0,r=this.length):"string"==typeof r&&(n=r,r=this.length),void 0!==n&&"string"!=typeof n)throw new TypeError("encoding must be a string");if("string"==typeof n&&!f.isEncoding(n))throw new TypeError("Unknown encoding: "+n);if(1===t.length){const e=t.charCodeAt(0);("utf8"===n&&e<128||"latin1"===n)&&(t=e);}}else "number"==typeof t?t&=255:"boolean"==typeof t&&(t=Number(t));if(e<0||this.length<e||this.length<r)throw new RangeError("Out of range index");if(r<=e)return this;let i;if(e>>>=0,r=void 0===r?this.length:r>>>0,t||(t=0),"number"==typeof t)for(i=e;i<r;++i)this[i]=t;else {const o=f.isBuffer(t)?t:f.from(t,n),s=o.length;if(0===s)throw new TypeError('The value "'+t+'" is invalid for argument "value"');for(i=0;i<r-e;++i)this[i+e]=o[i%s];}return this};const P={};function $(t,e,r){P[t]=class extends r{constructor(){super(),Object.defineProperty(this,"message",{value:e.apply(this,arguments),writable:true,configurable:true}),this.name=`${this.name} [${t}]`,this.stack,delete this.name;}get code(){return t}set code(t){Object.defineProperty(this,"code",{configurable:true,enumerable:true,value:t,writable:true});}toString(){return `${this.name} [${t}]: ${this.message}`}};}function F(t){let e="",r=t.length;const n="-"===t[0]?1:0;for(;r>=n+4;r-=3)e=`_${t.slice(r-3,r)}${e}`;return `${t.slice(0,r)}${e}`}function j(t,e,r,n,i,o){if(t>r||t<e){const r="bigint"==typeof e?"n":"";let n;throw n=0===e||e===BigInt(0)?`>= 0${r} and < 2${r} ** ${8*(o+1)}${r}`:`>= -(2${r} ** ${8*(o+1)-1}${r}) and < 2 ** ${8*(o+1)-1}${r}`,new P.ERR_OUT_OF_RANGE("value",n,t)}!function(t,e,r){H(e,"offset"),void 0!==t[e]&&void 0!==t[e+r]||V(e,t.length-(r+1));}(n,i,o);}function H(t,e){if("number"!=typeof t)throw new P.ERR_INVALID_ARG_TYPE(e,"number",t)}function V(t,e,r){if(Math.floor(t)!==t)throw H(t,r),new P.ERR_OUT_OF_RANGE("offset","an integer",t);if(e<0)throw new P.ERR_BUFFER_OUT_OF_BOUNDS;throw new P.ERR_OUT_OF_RANGE("offset",`>= 0 and <= ${e}`,t)}$("ERR_BUFFER_OUT_OF_BOUNDS",function(t){return t?`${t} is outside of buffer bounds`:"Attempt to access memory outside buffer bounds"},RangeError),$("ERR_INVALID_ARG_TYPE",function(t,e){return `The "${t}" argument must be of type number. Received type ${typeof e}`},TypeError),$("ERR_OUT_OF_RANGE",function(t,e,r){let n=`The value of "${t}" is out of range.`,i=r;return Number.isInteger(r)&&Math.abs(r)>2**32?i=F(String(r)):"bigint"==typeof r&&(i=String(r),(r>BigInt(2)**BigInt(32)||r<-(BigInt(2)**BigInt(32)))&&(i=F(i)),i+="n"),n+=` It must be ${e}. Received ${i}`,n},RangeError);const q=/[^+/0-9A-Za-z-_]/g;function Y(t,e){let r;e=e||1/0;const n=t.length;let i=null;const o=[];for(let f=0;f<n;++f){if(r=t.charCodeAt(f),r>55295&&r<57344){if(!i){if(r>56319){(e-=3)>-1&&o.push(239,191,189);continue}if(f+1===n){(e-=3)>-1&&o.push(239,191,189);continue}i=r;continue}if(r<56320){(e-=3)>-1&&o.push(239,191,189),i=r;continue}r=65536+(i-55296<<10|r-56320);}else i&&(e-=3)>-1&&o.push(239,191,189);if(i=null,r<128){if((e-=1)<0)break;o.push(r);}else if(r<2048){if((e-=2)<0)break;o.push(r>>6|192,63&r|128);}else if(r<65536){if((e-=3)<0)break;o.push(r>>12|224,r>>6&63|128,63&r|128);}else {if(!(r<1114112))throw new Error("Invalid code point");if((e-=4)<0)break;o.push(r>>18|240,r>>12&63|128,r>>6&63|128,63&r|128);}}return o}function K(t){return e.toByteArray(function(t){if((t=(t=t.split("=")[0]).trim().replace(q,"")).length<2)return "";for(;t.length%4!=0;)t+="=";return t}(t))}function J(t,e,r,n){let i;for(i=0;i<n&&!(i+r>=e.length||i>=t.length);++i)e[i+r]=t[i];return i}function Q(t,e){return t instanceof e||null!=t&&null!=t.constructor&&null!=t.constructor.name&&t.constructor.name===e.name}function W(t){return t!=t}const X=function(){const t="0123456789abcdef",e=new Array(256);for(let r=0;r<16;++r){const n=16*r;for(let i=0;i<16;++i)e[n+i]=t[r]+t[i];}return e}();function Z(t){return "undefined"==typeof BigInt?tt:t}function tt(){throw new Error("BigInt not supported")}}(H)),H);let J={SERVER_TIME_NONCE:176,AUTH_REQ:177,AUTH_RES:178,AUTH_FAIL:179,ENC_PACK:182,ENC_E2E:183,ENC_488:184};for(let t in J)J[J[t]]=t;const Q={SERVER_TIME_NONCE:F.meta(F.MB("header","8",0),F.MB("unixTime","32L",0),F.MB("milTime","16L",0),F.MB("counter","16L",0),F.MB("nonce",K.Buffer.alloc(4))),AUTH_REQ:F.meta(F.MB("header","8",0),F.MB("id8",K.Buffer.alloc(8)),F.MB("nonce",K.Buffer.alloc(4)),F.MB("hmac32",K.Buffer.alloc(32))),AUTH_RES:F.meta(F.MB("header","8",0),F.MB("hmac32",K.Buffer.alloc(32))),ENC_PACK:F.meta(F.MB("type","8",0),F.MB("len","32L",0),F.MB("salt12",K.Buffer.alloc(12)),F.MB("hmac",8,0)),ENC_488:F.meta(F.MB("type","8",0),F.MB("len","32L",0),F.MB("otpSrc8",K.Buffer.alloc(8)),F.MB("hmac8",K.Buffer.alloc(8)))};function W(t){let e=t[t.length-1];return e[2]+e[3]}const X={SERVER_TIME_NONCE:W(Q.SERVER_TIME_NONCE),AUTH_REQ:W(Q.AUTH_REQ),AUTH_RES:W(Q.AUTH_RES),ENC_PACK:W(Q.ENC_PACK),ENC_488:W(Q.ENC_488)};function Z(t){return globalThis.crypto.getRandomValues(K.Buffer.alloc(t))}class tt{constructor(){this._id8=K.Buffer.alloc(8),this._otpSrc44=K.Buffer.alloc(44),this._otp36=K.Buffer.alloc(36),this._hmac=K.Buffer.alloc(32),this.auth_salt12=K.Buffer.alloc(12),this.localNonce=K.Buffer.alloc(4),this.remoteNonce=K.Buffer.alloc(4),this.isAuthorized=false,this.counter=0;}clearAuth(){this._id8.fill(0),this._otpSrc44.fill(0),this._otp36.fill(0),this._hmac.fill(0),this.auth_salt12.fill(0),this.localNonce.fill(0),this.remoteNonce.fill(0),this.isAuthorized=false,this.counter=0;}set_hash_id8(t){F.B8(j.hash(t)).copy(this._id8,0,0,8);}set_id8(t){let e=F.B8(t);this._id8.fill(0),e.copy(this._id8,0,0,8);}set_key(t){F.B8(j.hash(t)).copy(this._otpSrc44,0,0,32);}set_id_key(t){let e=t.indexOf(".");if(-1==e)return;let r=t.substring(0,e),n=t.substring(e+1);this.set_id8(r),this.set_key(n);}copy_id8(t){t.copy(this._id8,0,0,8);}copy_key(t){t.copy(this._otpSrc44,0,0,32);}sha256_n(t,e){let r=j.hash(t);for(let t=0;t<e;t++)r=j.hash(r);return r}set_clock_rand(){const t=Date.now(),e=parseInt(t/1e3),r=t%1e3;++this.counter>65535&&(this.counter=0);K.Buffer.concat([F.NB("32L",e),F.NB("16L",r),F.NB("16L",this.counter),Z(4)]).copy(this._otpSrc44,32);}set_clock_nonce(t){const e=Date.now(),r=parseInt(e/1e3),n=e%1e3;++this.counter>65535&&(this.counter=0);K.Buffer.concat([F.NB("32L",r),F.NB("16L",n),F.NB("16L",this.counter),t]).copy(this._otpSrc44,32);}set_salt12(t,e){if(12!=t.byteLength)throw TypeError("set_salt12: Invalid salt12 byteLength.");t.copy(this._otpSrc44,32);}resetOTP(){F.B8(j.hash(this._otpSrc44)).copy(this._otp36,0,0,32);}getIndexOTP(t){return this._otp36.writeUInt32LE(t,32),j.hash(this._otp36)}generateHMAC(t){let e=K.Buffer.concat([this._otpSrc44,t]);this._hmac=F.B8(j.hash(e));}getHMAC8(t){let e=K.Buffer.concat([this._otpSrc44,t]);return this._hmac=F.B8(j.hash(e)),this._hmac.subarray(0,8)}xotp(t,e=0,r=false){let n=(t=F.B8(t,r)).byteLength,i=e,o=0,f=0;for(;n>0;){f=n<32?n:32;let e=this.getIndexOTP(++i);for(let r=0;r<f;r++)t[o++]^=e[r];n-=32;}return t}server_time_nonce(){const t=Date.now(),e=Math.floor(t/1e3),r=t%1e3;return this.localNonce=Z(4),this.auth_salt12=K.Buffer.concat([F.NB("32L",e),F.NB("16L",r),Z(2),this.localNonce]),K.Buffer.concat([F.NB("8",J.SERVER_TIME_NONCE),this.auth_salt12])}auth_req(t){let e=F.unpack(t,Q.SERVER_TIME_NONCE);if(e){let t=K.Buffer.concat([F.NB("32L",e.unixTime),F.NB("16L",e.milTime),F.NB("16L",e.counter),e.nonce]);return this.set_salt12(t,"auth_req"),this.localNonce=Z(4),this.generateHMAC(this.localNonce),this.remoteNonce=e.nonce,F.pack(F.MB("#header","8",J.AUTH_REQ),F.MB("#id8",this._id8),F.MB("#nonce",this.localNonce),F.MB("#hmac32",this._hmac))}return  false}verify_auth_req(t){let e;if(t instanceof Uint8Array){if(e=F.unpack(t,Q.AUTH_REQ),!e)return}else e=t;this.set_salt12(this.auth_salt12,"verify_auth_req 1/2"),this.generateHMAC(e.nonce);let r=this._hmac;if(F.equal(e.hmac32,r)){this.remoteNonce=e.nonce;let t=K.Buffer.concat([this.localNonce,this.remoteNonce,this.localNonce]);this.set_salt12(t,"verify_auth_req 2/2"),this.generateHMAC(e.nonce);let r=this._hmac,n=F.rawPack(F.MB("header","8",J.AUTH_RES),F.MB("hmac32",r));return this.isAuthorized=true,n}return  false}verify_auth_res(t){let e=F.unpack(t,Q.AUTH_RES);if(e){let t=K.Buffer.concat([this.remoteNonce,this.localNonce,this.remoteNonce]);this.set_salt12(t,"verify_auth_res"),this.generateHMAC(this.localNonce);let r=this._hmac;if(F.equal(r,e.hmac32))return this.isAuthorized=true,true}}encrypt_488(t){if(!this.isAuthorized)return;t=F.B8(t),this.set_clock_nonce(this.remoteNonce),this.resetOTP();let e=this.getHMAC8(t),r=this.xotp(t);return F.pack(F.MB("#type","8",J.ENC_488),F.MB("#len","32L",t.byteLength),F.MB("#otpSrc8",this._otpSrc44.subarray(32,40)),F.MB("#hmac8",e),F.MB("#xdata",r))}decrypt_488(t){t=F.B8(t);let e=F.unpack(t,Q.ENC_488);if(e){let t=K.Buffer.concat([e.otpSrc8,this.localNonce]);this.set_salt12(t,"decrypt_488"),this.resetOTP();let r=e.$OTHERS.subarray(0,e.len),n=this.xotp(r),i=this.getHMAC8(n);if(F.equal(i,e.hmac8))return n}}encryptPack(t){t=F.B8(t),this.set_clock_rand(),this.resetOTP();let e=this.getHMAC8(t),r=this.xotp(t);return F.pack(F.MB("#type","8",J.ENC_PACK),F.MB("#len","32L",t.byteLength),F.MB("#salt12",this._otpSrc44.subarray(32)),F.MB("#hmac8",e),F.MB("#xdata",r))}decryptPack(t){if(t[0]!==J.ENC_PACK)return;if(t.readUint32LE(1)==t.byteLength-X.ENC_PACK)try{let e=F.unpack(t,Q.ENC_PACK);if(!e)return;this.set_salt12(e.salt12,"decryptPack"),this.resetOTP();let r=e.$OTHERS,n=this.xotp(r),i=this.getHMAC8(n);if(F.equal(e.hmac,i))return e.data=n,e}catch(t){}}encrypt_e2e(t,e){let r=K.Buffer.alloc(32);r.set(this._otpSrc44.subarray(0,32)),this.set_key(e);let n=this.encryptPack(t);return this._otpSrc44.set(r),n}decrypt_e2e(t,e){let r=K.Buffer.alloc(32);r.set(this._otpSrc44.subarray(0,32)),this.set_key(e);let n=this.decryptPack(t);return this._otpSrc44.set(r),n}}tt.RAND=Z,tt.BohoMsg=J,tt.Meta=Q,tt.MetaSize=X,tt.sha256=j,tt.MBP=F,tt.Buffer=K.Buffer;

/**
 * @typedef {import('meta-buffer-pack').MBP} MBP
 * @typedef {import('../common/constants.js').IOMsg} IOMsg
 * @typedef {import('../common/constants.js').PAYLOAD_TYPE} PAYLOAD_TYPE
 * @typedef {import('../common/constants.js').SIZE_LIMIT} SIZE_LIMIT
 * @typedef {import('../common/constants.js').ENC_MODE} ENC_MODE
 * @typedef {import('../common/constants.js').STATE} STATE
 * @typedef {import('../common/quotaTable.js').quotaTable} quotaTable
 
 * @typedef {import('boho').Boho} Boho
 * @typedef {import('boho').Buffer} Buffer
 */

const Buffer$1 = M$1.Buffer;
const encoder$1 = new TextEncoder();
const decoder$4 = new TextDecoder();

function byteToUrl(buffer) {
  //ipv4(4bytes) , port(2bytes)
  if (buffer.byteLength != 6) return
  let address = buffer[0].toString() + "." + buffer[1].toString()
    + "." + buffer[2].toString() + "." + buffer[3].toString();
  let port = (buffer[4] << 8) + buffer[5];
  return address + ':' + port.toString()
}

/**
 * Core class for handling WebSocket communication.
 * @augments {EventEmitter}
 */
class IOCore extends EventEmitter {
  /**
   * @param {string} url - The WebSocket URL to connect to.
   */
  constructor(url) {
    super();
    /**
     * Client ID received from the server.
     * @type {string}
     */
    this.cid = "";   // get from the server  CID_RES
    /**
     * IP address received from the server.
     * @type {string}
     */
    this.ip = "";    // get from the server  IAM_RES message.
    /**
     * The WebSocket instance.
     * @type {WebSocket | null}
     */
    this.socket = null;
    /**
     * The default server URL.
     * @type {string}
     */
    this.url = url; // init default server url
    /**
     * Current connection state (number).
     * @type {number}
     */
    this.state = STATE.CLOSED;  // Number type
    /**
     * Current connection state (string).
     * @type {string}
     */
    this.stateName = this.getStateName(); // String type

    /**
     * Transmitted message counter.
     * @type {number}
     */
    this.txCounter = 0;
    /**
     * Received message counter.
     * @type {number}
     */
    this.rxCounter = 0;
    /**
     * Transmitted bytes counter.
     * @type {number}
     */
    this.txBytes = 0;
    /**
     * Received bytes counter.
     * @type {number}
     */
    this.rxBytes = 0;

    /**
     * Last transmit/receive time.
     * @type {number}
     */
    this.lastTxRxTime = Date.now();
    /**
     * Period for connection checker.
     * @type {number}
     */
    this.connectionCheckerPeriod = SIZE_LIMIT.CONNECTION_CHECKER_PERIOD;
    /**
     * Interval ID for connection checker.
     * @type {NodeJS.Timeout | null}
     */
    this.connectionCheckerIntervalID = null;

    /**
     * Boho instance for encryption/decryption.
     * @type {Boho}
     */
    this.boho = new tt();

    this.serverTimeNonce = Buffer$1.alloc( tt.MetaSize.SERVER_TIME_NONCE  );
    /**
     * Indicates if the connection is TLS (wss).
     * @type {boolean}
     */
    this.TLS = false; // true if protocol is wss(TLS)
    /**
     * Encryption mode.
     * @type {number}
     */
    this.encMode = ENC_MODE.AUTO;
    /**
     * Indicates if authentication is used.
     * @type {boolean}
     */
    this.useAuth = false;

    /**
     * Nickname.
     * @type {string}
     */
    this.nick = "";
    /**
     * Set of subscribed channels.
     * @type {Set<string>}
     */
    this.channels = new Set();
    /**
     * Map of promises for message responses.
     * @type {Map<number, Array<Function>>}
     */
    this.promiseMap = new Map();
    /**
     * Timeout for message promises.
     * @type {number}
     */
    this.promiseTimeOut = SIZE_LIMIT.PROMISE_TIMEOUT;
    /**
     * Message ID for promises.
     * @type {number}
     */
    this.mid = 0;  // promise message id 

    /**
     * Quota level.
     * @type {number}
     */
    this.level = 3; // also defaultQuotaLevel
    /**
     * Quota table for current level.
     * @type {object}
     */
    this.quota = quotaTable[this.level];
    /**
     * Server settings.
     * @type {object}
     */
    this.serverSet = {};
    /**
     * Map of linked channels.
     * @type {Map<string, Set<string>>}
     */
    this.linkMap = new Map();

    /**
     * Indicates if auto-reconnect is enabled.
     * @type {boolean} 
     * @default true
     * */
    this.autoReconnect = true; // default true  

    /**
   * A flag to prevent duplicate close operations.
   * @type {boolean}
   * @private
   */
    this._closed = false; // 중복 close 방지

    this.on('open', this.onOpen.bind(this));
    this.on('close', this.onClose.bind(this));
    this.on('socket_data', this.onData.bind(this));
  }



  /**
   * Performs common cleanup for the connection. It clears pending promises,
   * resets the socket reference, and sets the state to closed.
   * This method is guarded to only run once.
   * If autoReconnect is false, it also clears the keep-alive timer.
   */
  close() {
    if (this._closed) return;
    this._closed = true;
    // console.log('####### IOCOre.js close() called')
    // If auto-reconnect is disabled, we must stop the keep-alive timer.
    if (this.autoReconnect === false) {
      clearInterval(this.connectionCheckerIntervalID);
      this.connectionCheckerIntervalID = null;
    }

    // socket clean
    if (this.socket) {
      // For WebSockets, readyState are: 0-CONNECTING, 1-OPEN, 2-CLOSING, 3-CLOSED
      // Calling close() on a CONNECTING socket will cause a browser error.
      if (this.socket.readyState === 0) { // 0 is WebSocket.CONNECTING
        // To avoid the error, we wait for the connection to open, then immediately close it.
        // We also clear other handlers to prevent any other logic from running.
        const socket = this.socket;
        socket.onopen = () => { if (socket) socket.close(); };
        socket.onmessage = null;
        socket.onerror = null;
        socket.onclose = null;
      } else {
        try {
          // For other sockets (like TCP) or other WebSocket states, close directly.
          this.socket.close?.();
        } catch { }
      }
      this.socket = null;
    }
    this.promiseMap.clear();
    this.emit('closed');
    this.stateChange('closed');
  }
  
  /**
   * Disables auto-reconnect and closes the current connection.
   * The instance can be re-opened manually later. For complete cleanup, use destroy().
  */
 stop() {
   this.autoReconnect = false;
   this.close();
   this.cid = '';
   this.stateChange('stop','stop');
  }

  /**
   * Permanently destroys the instance, cleaning up all resources.
   * The instance will not be usable after this.
   */
  destroy() {
    this.stop();
    this.removeAllListeners();

    this.channels.clear();
    this.linkMap.clear();

    // Help GC
    this.boho = null;
  }

  /**
   * The core keep-alive logic. 
   * The specific logic for checking the socket's state and reconnecting
   * is implemented keepConnection() in the child classes (IOWS, IOCongSocket, etc.).
   */
  keepAlive() {
    this.keepConnection();
    if( Date.now() - this.lastTxRxTime > SIZE_LIMIT.CLIENT_PING_PERIOD ){
      this.ping();
    }
  }

  /**
   * Redirects the connection to a new URL.
   * @param {string} url2 - The new URL to redirect to.
   */
  redirect(url2) {
    this.stateChange('redirecting','redirecting');
    this.close();
    this.createConnection(url2);
  }

  /**
   * Opens the WebSocket connection.
   * @param {string} [url] - Optional URL to connect to. If not provided, uses the instance's URL.
   */
  open(url) {
    // If a connection is already active or in progress, calling open() implies a reconnect.
    // Close the existing socket first to ensure a clean state.
    if (this.socket) {
      this.close();
    }

    if (url) {
      this.url = url;
    }

    if (!this.url) {
      this.emit('error', new Error('URL is not set.'));
      return;
    }

    // The actual connection is created here.
    this.createConnection(this.url);

    // Ensure the keep-alive timer is running.
    if (!this.connectionCheckerIntervalID) {
      this.connectionCheckerIntervalID = setInterval(this.keepAlive.bind(this), this.connectionCheckerPeriod);
    }
  }

  /**
   * Handles the 'open' event of the WebSocket. Resets the closed flag and sets the state to open.
   */
  onOpen() {
    this._closed = false;
    if (this.url.includes("wss://")) {
      this.TLS = true;
    } else {
      this.TLS = false;
    }
    this.stateChange('open');
  }

  /**
   * Handles the 'close' event of the WebSocket.
   */
  onClose() {
    this.boho.isAuthorized = false;
    this.cid = "";
    this.stateChange('closed');
  }

  /**
   * Manually logs in with provided ID and key.
   * @param {string} id - The user ID. or 'id.key'
   * @param {string} key - The user key.
   * @returns {this} 
   */
  login(id, key) {
    if( this.serverTimeNonce ){
      console.log('iosignal.login serverTimeNonce', this.serverTimeNonce);
      this.auth(id, key);
      this.useAuth = true;
      let auth_pack = this.boho.auth_req(this.serverTimeNonce );
      this.send(auth_pack);
    }
    return this
  }

  /**
   * Sets up authentication for auto-login.
   * @param {string} id - The user ID. or 'id.Key'
   * @param {string} key - The user key.
   * @returns {this} 
   */
  auth(id, key) {
    if (!id && !key) {
      this.emit('error', new Error('auth failed. no id and key.'));
    }

    if (!key && id.includes('.')) {
      this.boho.set_id_key(id);
    } else if (id && key) {
      this.boho.set_id8(id);
      this.boho.set_key(key);
    } else {
      this.emit('error', new Error('auth failed. no id or key.'));
    }
    this.useAuth = true;
    return this
  }

  /**
   * Handles incoming data from the WebSocket.
   * @param {Buffer} buffer - The incoming data buffer.
   */
  onData(buffer) {
    let msgType = buffer[0];
    let decoded;

    if (msgType === tt.BohoMsg.ENC_488) {
      decoded = this.boho.decrypt_488(buffer);
      if (decoded) {
        msgType = decoded[0];
        buffer = decoded;
      }
    } else if (msgType === tt.BohoMsg.ENC_E2E) {

      try {
        decoded = this.boho.decrypt_488(buffer);
        if (decoded) {
          // console.log( 'ENC_E2E decoded ', decoded )
          msgType = decoded[0];
          // decoded has msg_header only. 
          buffer.set(decoded, tt.MetaSize.ENC_488); // set decoded signal_e2e headaer. 
          buffer = buffer.subarray(tt.MetaSize.ENC_488); // reset offset. 
          // console.log('DECODED MsgType:', IOMsg[ msgType ] )
        } else {
          // console.log('488 DEC_FAIL', buffer)
          return
        }

      } catch (err) {
        // console.log('E2E DEC_FAIL decryption error', err)
        return
      }

    }

    let type = IOMsg[msgType];
    if (!type) type = tt.BohoMsg[msgType];

    // console.log( "MsgType: ", type , " LEN ", buffer.byteLength)

    switch (msgType) {
      case IOMsg.OVER_SIZE:
        console.log('## server sent: over_size event.');
        this.emit('over_size', 'over_size');
        break;
      case IOMsg.PING:
        this.pong();
        break;

      case IOMsg.PONG:
        break;

      case IOMsg.ECHO:
        try {
          let str = decoder$4.decode(buffer.subarray(1));

          this.emit('echo', str);
        } catch (error) {
          this.emit('error', new Error('ECHO data error'));
        }
        break;

      case IOMsg.IAM_RES:
        try {
          let str = decoder$4.decode(buffer.subarray(1));
          let jsonInfo = JSON.parse(str);
          if (jsonInfo.ip) { this.ip = jsonInfo.ip; }
          if (jsonInfo.nick) { this.nick = jsonInfo.nick; }
          if (jsonInfo.did) { this.did = jsonInfo.did; }
          if (jsonInfo.uid) { this.uid = jsonInfo.uid; }
          this.emit('iam_res', str);
        } catch (error) {
          this.emit('error', new Error('IAM_RES data error'));
        }
        break;

      case IOMsg.CID_RES:
        let cidStr = decoder$4.decode(buffer.subarray(1));
        this.cid = cidStr;

        // **IMPORTANT** change state before subscribe.
        this.stateChange('ready', 'cid_ready');
        this.subscribe_channels(); 
        break;

      case IOMsg.QUOTA_LEVEL:
        let quotaLevel = buffer[1];
        this.level = quotaLevel;
        this.quota = quotaTable[quotaLevel];
        // console.log('[QUOTA_LEVEL]', JSON.stringify(this.quota))
        break;

      case IOMsg.AUTH_CLEAR:
        this.useAuth = false;
        this.boho.clearAuth();
        this.stateChange('auth_clear', 'server request auth_clear.');
        this.stop();
        break;

      case IOMsg.SERVER_REDIRECT:
        let host_port;
        let url;
        let protocol;
        if (buffer.byteLength == 7) { // ipv4 ,port
          host_port = byteToUrl(buffer.subarray(1));
          protocol = 'cong://';
        } else { // domain url
          host_port = decoder$4.decode(buffer.subarray(1));
          protocol = '';
        }

        url = protocol + host_port;
        this.redirect(url);
        break;

      case tt.BohoMsg.SERVER_TIME_NONCE: // SERVER_READY
        this.stateChange('server_ready', 'server_ready');
        if (this.useAuth) {
          this.send(this.boho.auth_req(buffer));
          this.stateChange('auth_req','auth_req');
          // CID_REQ will be called, after auth_res.
        } else {
          // keep server_time_nonce for manual login()
          buffer.copy( this.serverTimeNonce);
          // CID_REQ here, if not using auth.
          this.send(Buffer$1.from([IOMsg.CID_REQ]));
        }
        break;

      case IOMsg.SERVER_SIGNAL:
        try {
          let str = decoder$4.decode(buffer.subarray(1));
          let ss = JSON.parse(str);

          if (ss.event && ss.data) {
            this.serverSet = ss.data;
            this.emit(ss.event, ss.data);
          }

        } catch (error) {
          this.emit('error', new Error('SERVER_SIGNAL parsing error'));
        }
        break;

      case IOMsg.SET:
        try {
          let setPack = M$1.unpack(buffer);
          if (setPack) {
            this.emit(setPack.topic, ...setPack.args);
          }
        } catch (error) {
          this.emit('error', new Error('SET parsing error'));
        }
        break;

      case IOMsg.SIGNAL_E2E:
      case IOMsg.SIGNAL:
        try {
          let tagLen = buffer.readUint8(1);
          let tagBuf = buffer.subarray(2, 2 + tagLen);
          let tag = decoder$4.decode(tagBuf);

          let payloadType = buffer.readUint8(2 + tagLen);
          let payloadBuffer = buffer.subarray(3 + tagLen);

          /* three types of signal message.
            > unicast message to me:  tag includes @, no cid: '@*'
            > cid_sub message:  tag includes cid and @ both : 'cid@*'
            > ch_sub message:  else.
          */
        //  console.log('payloadType', payloadType )
          switch (payloadType) {

            case PAYLOAD_TYPE.EMPTY:
              if (tag.indexOf('@') === 0) this.emit('@', tag, null);
              else {
                this.emit(tag, tag, null);
                this.emit('message', tag, null);
              }
              break;

            case PAYLOAD_TYPE.TEXT:
              // !! Must remove null char before decode in JS.
              // string payload contains null char for the c/cpp devices.
              let payloadStringWithoutNull = payloadBuffer;
              if (payloadBuffer[payloadBuffer.byteLength - 1] === 0) {
                payloadStringWithoutNull = payloadBuffer.subarray(0, payloadBuffer.byteLength - 1);
              }
              let oneString = decoder$4.decode(payloadStringWithoutNull);
              if (tag.indexOf('@') === 0) this.emit('@', tag, oneString);
              else {
                this.emit(tag, tag, oneString);
                this.emit('message', tag, oneString);
              }
              break;

            case PAYLOAD_TYPE.BINARY:
              if (tag.indexOf('@') === 0) this.emit('@', tag, payloadBuffer);
              else {
                this.emit(tag, tag, payloadBuffer);
                this.emit('message', tag, payloadBuffer);
              }
              break;

            case PAYLOAD_TYPE.OBJECT:
              let oneObjectBuffer = decoder$4.decode(payloadBuffer);
              let oneJSONObject = JSON.parse(oneObjectBuffer);
              if (tag.indexOf('@') === 0) this.emit('@', tag, oneJSONObject);
              else {
                this.emit(tag, tag, oneJSONObject);
                this.emit('message', tag, oneJSONObject);
              }
              break;

            case PAYLOAD_TYPE.MJSON:
              let mjsonBuffer = decoder$4.decode(payloadBuffer);
              let mjson = JSON.parse(mjsonBuffer);
              if (tag.indexOf('@') === 0) this.emit('@', tag, ...mjson);
              else {
                this.emit(tag, tag, ...mjson);
                this.emit('message', tag, ...mjson);
              }
              break;

            case PAYLOAD_TYPE.MBA:
              let mbaObject = M$1.unpack(payloadBuffer);
              if (tag.indexOf('@') === 0) this.emit('@', tag, ...mbaObject.args);
              else {
                this.emit(tag, tag, ...mbaObject.args);
                this.emit('message', tag, ...mbaObject.args);
              }
              break;

            default:
            // console.log('## Unkown payloadtype', payloadType)
          }

        } catch (err) {
          // this.emit('error', new Error('IOCore IOMsg.SIGNAL parser err', err))
          console.log('IOCore IOMsg.SIGNAL parser err', err);
        }
        break;

      case IOMsg.RESPONSE_MBP:
        this.testPromise(buffer);
        break;

      case tt.BohoMsg.AUTH_FAIL:
        this.stateChange('auth_fail', 'auth_fail from server.');
        break;

      case tt.BohoMsg.AUTH_RES:
        if (this.boho.verify_auth_res(buffer)) {
          this.stateChange('auth_res', 'server sent auth_res');
          this.send(Buffer$1.from([IOMsg.CID_REQ]));
        } else {
          this.stateChange('auth_fail', 'verify_auth_res() invalid server_hmac');
        }
        break;

      default:
        try {
          decoded = decoder$4.decode(buffer);
          // console.log('text message:', decoded)
          this.emit('text_message', decoded);
        } catch (error) {

        }

        break;

    }
  }

  /**
   * Sends an IAM (I Am) message to the server.
   * @param {string} [title] - Optional title for the IAM message.
   */
  iam(title) {
    // console.log('iam', title)
    if (title) {
      this.send_enc_mode(M$1.pack(
        M$1.MB('#MsgType', '8', IOMsg.IAM),
        M$1.MB('#', title)
      ));
    } else {
      this.send_enc_mode(M$1.pack(
        M$1.MB('#MsgType', '8', IOMsg.IAM)
      ));
    }
  }


  /**
   * Sends a PING message to the server.
   */
  ping() {
    this.send(Buffer$1.from([IOMsg.PING]));
  }

  /**
   * Sends a PONG message to the server.
   */
  pong() {
    this.send(Buffer$1.from([IOMsg.PONG]));
  }


  /**
   * Sends an ECHO message to the server.
   * @param {*} [args] - Optional arguments to echo.
   */
  echo(args) {
    if (args) {
      // console.log('send echo args:', args)
      this.send_enc_mode(M$1.pack(
        M$1.MB('#MsgType', '8', IOMsg.ECHO),
        M$1.MB('#msg', args)
      ));
    } else {
      // # do not encrypt blank echo #
      this.send(Buffer$1.from([IOMsg.ECHO]));
    }
  }


  /**
   * Sends binary data.
   * @param {...any} data - Data to send.
   */
  bin(...data) {
    this.send(M$1.U8pack(...data));
  }

  /**
   * Sends data over the WebSocket.
   * @param {Buffer} data - The data buffer to send.
   */
  send(data) {
    if (data.byteLength > this.quota.signalSize) {
      this.emit('over_size');
      console.log('## QUOTA LIMIT OVER!! \nsignal message.byteLength: ', data.byteLength);
      console.log('## your maximum signalSize(bytes) is:', this.quota.signalSize);
      return
    }
    // console.log(`C->[${IOMsg[ data[0]]}]`)
    this.socket_send(data);
  }

  /**
   * Determines if encryption should be used based on current mode and TLS status.
   * @returns {boolean}
   */
  getEncryptionMode() {
    if (this.encMode === ENC_MODE.YES ||
      this.encMode === ENC_MODE.AUTO &&
      !this.TLS && this.boho.isAuthorized
    ) {
      return true;
    } else {
      return false
    }
  }

  /**
   * Sends data with encryption based on the encryption mode.
   * @param {Buffer} data - The data buffer to send.
   * @param {boolean} [useEncryption] - Optional. Force encryption or not. If undefined, uses default policy.
   */
  send_enc_mode(data, useEncryption) {

    // use default policy.
    if (useEncryption === undefined) {
      useEncryption = this.getEncryptionMode();
    }

    if (data[0] == IOMsg.SIGNAL_E2E && useEncryption) {
      // input data:  signal_header + e2ePayload
      // encrypt signal_header area only. payload is encrypted with e2e key already.
      let tagLen = data[1];
      let encHeader = this.boho.encrypt_488(data.subarray(0, 3 + tagLen));
      encHeader[0] = tt.BohoMsg.ENC_E2E;
      this.send(Buffer$1.concat([encHeader, data.subarray(3 + tagLen)]));
      // console.log('<< send_enc_mode [ ENC_E2E ]')

    } else if (useEncryption) {
      // console.log('<< send_enc_mode [ ENC_488 ]')
      let encPack = this.boho.encrypt_488(data);
      this.send(encPack);
    } else {
      // console.log('<< send_enc_mode  [ PLAIN ]' )
      this.send(data);
    }

  }


  /**
   * Sets a message promise for a given message ID.
   * @param {number} mid - The message ID.
   * @returns {Promise<any>}
   */
  setMsgPromise(mid) {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(e => {
        if (this.promiseMap.has(mid)) {
          reject('timeout');
          this.promiseMap.delete(mid);
        }
      }, this.promiseTimeOut);
      this.promiseMap.set(mid, [resolve, reject, timeoutId]);
    })
  }

  /**
   * Tests and resolves/rejects a promise based on the incoming buffer.
   * @param {Buffer} buffer - The incoming data buffer.
   */
  testPromise(buffer) {

    let res = M$1.unpack(buffer);
    if (!res) return

    if (this.promiseMap.has(res.mid)) {
      let [resolve, reject, timeoutId] = this.promiseMap.get(res.mid);
      clearTimeout(timeoutId);
      this.promiseMap.delete(res.mid);

      if (res.status < 128) {
        res.ok = true;
        resolve(res);
      } else {
        res.ok = false;
        reject(res);
      }


    } else {
      console.log('no promise id');
    }
  }


  /**
   * alias of signal()
   * Sends a signal with a tag and arguments.
   * @param {string} tag - The signal tag.
   * @param {...any} args - Arguments for the signal.
   */
  publish(tag, ...args) {
    this.signal(tag, ...args);
  }

  /**
   * Sends a signal with a tag and arguments.
   * @param {string} tag - The signal tag.
   * @param {...any} args - Arguments for the signal.
   * @throws {TypeError} If tag is not a string.
   */
  signal(tag, ...args) {
    if (typeof tag !== 'string') throw TypeError('tag should be string.')
    let signalPack = getSignalPack(tag, ...args);
    this.send_enc_mode(signalPack);
  }

  /**
   * Decrypts E2E data.
   * @param {Buffer} data - The encrypted data.
   * @param {string} key - The decryption key.
   * @returns {Buffer}
   */
  decrypt_e2e(data, key) {
    return this.boho.decrypt_e2e(data, key)
  }

  /**
   * Sends an E2E (End-to-End) encrypted signal.
   * @param {string} tag - The signal tag.
   * @param {Buffer} data - The data to encrypt and send.
   * @param {string} key - The encryption key.
   * @throws {TypeError} If tag is not a string.
   */
  signal_e2e(tag, data, key) {

    if( !this.boho.isAuthorized ) return;
    if (typeof tag !== 'string') throw TypeError('tag should be string.')
    let tagEncoded = encoder$1.encode(tag);
    let dataPack = M$1.B8(data);

    //encrypt payload area with key
    let sercretPack = this.boho.encrypt_e2e(dataPack, key);

    //change signal MsgType header into SIGNAL_E2E
    let signalPack = M$1.pack(
      M$1.MB('#MsgType', '8', IOMsg.SIGNAL_E2E),
      M$1.MB('#tagLen', '8', tagEncoded.byteLength),
      M$1.MB('#tag', tagEncoded),
      M$1.MB('#payloadType', '8', PAYLOAD_TYPE.BINARY),
      M$1.MB('#payload', sercretPack)
    );

    this.send_enc_mode(signalPack);
  }


  /**
   * Sets a value in the store.
   * @param {string} storeName - The name of the store.
   * @param {...any} args - Arguments to set.
   * @returns {Promise<any>}
   */
  set(storeName, ...args) {
    if (!storeName || args.length == 0) {
      return Promise.reject(new Error('set need storeName and value)'))
    }
    return this.call('store', 'set', storeName, ...args)
  }

  /**
   * Gets a value from the store.
   * @param {string} storeName - The name of the store.
   * @returns {Promise<any>}
   */
  async get(storeName) {
    if (!storeName) {
      return Promise.reject(new Error('store get need storeName)'))
    }
    let pack = await this.call('store', 'get', storeName);
    let { $ } = M$1.unpack(pack.body);
    return $
  }


  /**
   * Sends a request to a target and topic.(remote service call)
   * @param {string} target - The target(service name) of the request.
   * @param {string} topic - The topic(service function name) of the request.
   * @param {...any} args - Optional arguments for the request.
   * @returns {Promise<any>}
   */
  call(target, topic, ...args) {
    if (!target || !topic)
      return Promise.reject(new Error('request need target and topic)'))
    let sigPack;
    if (args.length > 0) {
      sigPack = M$1.pack(
        M$1.MB('#MsgType', '8', IOMsg.CALL),
        M$1.MB('mid', '16', ++this.mid),
        M$1.MB('target', target),
        M$1.MB('topic', topic),
        M$1.MBA(...args)
      );
    } else {
      sigPack = M$1.pack(
        M$1.MB('#MsgType', '8', IOMsg.CALL),
        M$1.MB('mid', '16', ++this.mid),
        M$1.MB('target', target),
        M$1.MB('topic', topic)
      );
    }
    this.send_enc_mode(sigPack);
    return this.setMsgPromise(this.mid)
  }


  /**
   * Subscribes to a channel or channels.
   * @param {string} tag - The tag(s) of the channel(s) to subscribe to (comma-separated).
   * @throws {TypeError} If tag is not a string or exceeds length limit.
   */
  subscribe(tag) {
    if (typeof tag !== 'string') throw TypeError('tag should be string.')
    if (tag.length > SIZE_LIMIT.TAG_LEN1) throw TypeError('please check tag string length limit:' + SIZE_LIMIT.TAG_LEN1)

    try {
      let tagEncoded = encoder$1.encode(tag);
      this.send_enc_mode(
        Buffer$1.concat([
          M$1.NB('8', IOMsg.SUBSCRIBE),
          M$1.NB('8', tagEncoded.byteLength),
          tagEncoded]));
    } catch (error) { }

  }


  /**
   * Subscribes stored channels.
   * called client state become 'ready'
   */
  subscribe_channels() {
    if (this.state !== STATE.READY) return
    if (this.channels.size == 0) return
    let tag = Array.from(this.channels).join(',');

    try {
      let tagEncoded = encoder$1.encode(tag);
      this.send_enc_mode(
        Buffer$1.concat([
          M$1.NB('8', IOMsg.SUBSCRIBE),
          M$1.NB('8', tagEncoded.byteLength),
          tagEncoded]));
    } catch (error) { }

  }

  /**
   * Unsubscribes from a channel or channels.
   * @param {string} [tag=""] - The tag(s) of the channel(s) to unsubscribe from (comma-separated). If empty, unsubscribes from all.
   * @throws {TypeError} If tag is not a string or exceeds length limit.
   */
  unsubscribe(tag = "") {
    if (typeof tag !== 'string') throw TypeError('tag should be string.')

    if (tag == "") { // blank tag means unsubscribe all
      this.channels.clear();
    } else {
      let tagList = tag.split(',');
      tagList.forEach(tag => {
        this.channels.delete(tag);
      });
    }

    let tagEncoded = encoder$1.encode(tag);
    if (tagEncoded.byteLength > SIZE_LIMIT.TAG_LEN1) throw TypeError('please use tag string bytelength below:' + SIZE_LIMIT.TAG_LEN1)

    this.send_enc_mode(Buffer$1.concat([
      M$1.NB('8', IOMsg.UNSUBSCRIBE),
      M$1.NB('8', tagEncoded.byteLength),
      tagEncoded]));
  }


  /**
   * Listens for signals on a specific tag.
   * @param {string} tag - The tag to listen on.
   * @param {Function} handler - The callback function to handle the signal.
   * @throws {TypeError} If tag is not a string, handler is not a function, or tag length is invalid.
   */
  listen(tag, handler) {
    if (typeof tag !== 'string') throw TypeError('tag should be string.')
    if (tag.length > 255 || tag.length == 0) throw TypeError('tag string length range: 1~255')
    if (typeof handler !== 'function') throw TypeError('handler is not a function.')

    if (tag.indexOf('@') !== 0) {
      this.channels.add(tag);
    }
    this.on(tag, handler);
    // do not subscribe now.
    // will subscribe when io state is 'ready'. (receive CID_RES from server)

  }



  /**
   * Links a local target to a remote tag and sets up a handler.
   * @param {string} to - The local link target.
   * @param {string} tag - The remote tag.
   * @param {Function} handler - The callback function to handle the signal.
   * @throws {TypeError} If 'to' or 'tag' are not strings, handler is not a function, or tag length is invalid.
   */
  link(to, tag, handler) {
    if (typeof to !== 'string') throw TypeError('to(local link target) is not a string.')
    if (typeof tag !== 'string') throw TypeError('tag is not a string.')
    if (tag.length > 255 || tag.length == 0) throw TypeError('tag string length range: 1~255')
    if (typeof handler !== 'function') throw TypeError('handler is not a function.')

    if (tag.indexOf('@') !== 0) {
      this.channels.add(tag);
    }

    let linkSet;
    if (this.linkMap.has(to)) {
      linkSet = this.linkMap.get(to);
    } else {
      linkSet = new Set();
    }

    linkSet.add(tag);
    this.linkMap.set(to, linkSet);
    this.on(tag, handler);
    this.subscribe(tag);

  }


  /**
   * Unlinks a specific tag from a local target.
   * @param {string} to - The local link target.
   * @param {string} tag - The tag to unlink.
   * @throws {TypeError} If 'to' or 'tag' are not strings or tag length is invalid.
   */
  unlink(to, tag) {
    if (typeof to !== 'string') throw TypeError('to(local link target) is not a string.')
    if (typeof tag !== 'string') throw TypeError('tag is not a string.')
    if (tag.length > 255 || tag.length == 0) throw TypeError('tag string length range: 1~255')

    const linkSet = this.linkMap.get(to);
    if (!linkSet || !linkSet.has(tag)) return;

    this.unsubscribe(tag);
    this.removeAllListeners(tag);
    linkSet.delete(tag);

    if (linkSet.size === 0) {
      this.linkMap.delete(to);
    }
  }

  /**
   * Unlinks all tags from a local target.
   * @param {string} to - The local link target.
   * @throws {TypeError} If 'to' is not a string.
   */
  unlinkAll(to) {
    if (typeof to !== 'string') throw TypeError('to(local link target) is not a string.')

    const linkSet = this.linkMap.get(to);
    if (!linkSet) return;

    for (const tag of linkSet) {
      this.unsubscribe(tag);
      this.removeAllListeners(tag);
    }

    this.linkMap.delete(to);
  }



  /**
   * Gets connection metrics.
   * @returns {{tx: number, rx: number, txb: number, rxb: number, last: number}}
   */
  getMetric() {
    return {
      tx: this.txCounter,
      rx: this.rxCounter,
      txb: this.txBytes,
      rxb: this.rxBytes,
      last: (Date.now() - this.lastTxRxTime) / 1000
    }

  }

  /**
   * Gets the current connection state.
   * @returns {number}
   */
  getState() {
    return this.state
  }

  /**
   * Gets the current connection state name.
   * @returns {string}
   */
  getStateName() {
    //state <number>
    //value of constant STATE.NAME < number >
    //type of constant STATE.NAME name < string uppercase >
    //stateName,eventName <string lowercase>
    return (STATE[this.state]).toLowerCase()
  }

  /**
   * Gets security-related information.
   * @returns {{useAuth: boolean, isTLS: boolean, isAuthorized: boolean, encMode: number, usingEncryption: boolean}}
   */
  getSecurity() {
    return {
      useAuth: this.useAuth,
      isTLS: this.TLS,
      isAuthorized: this.boho.isAuthorized,
      encMode: this.encMode,
      usingEncryption: this.getEncryptionMode()
    }
  }

  /**
   * Changes the connection state and emits events.
   * @param {string} state - The new state name (e.g., 'ready', 'closed').
   * @param {string} [emitEventAndMessage] - Optional message to emit with the state change event.
   * 
   * 주의. 
   * 1. 상태가 변경 될 때만 'change' 이벤트 호출된다.
   * 2. emitEventAndMessage 옵션 값이 지정되야 해당 이벤트 이름이 호출된다.
   *   보통 이벤트 이름과 동일하게 적거나 이벤트 상황 안내문을 넣는다.
   */
  stateChange(state, emitEventAndMessage) {
    // STATE constant name <string> upperCase
    // eventName and .stateName <string> lowerCase
    // .state <number>
    // console.log('### stateChange reason:', emitEventAndMessage )
    let eventName = state.toLowerCase();
    this.state = STATE[state.toUpperCase()]; // state: number

    if (emitEventAndMessage) {
      this.emit(eventName, emitEventAndMessage);
    }

    if (this.stateName !== eventName) {
      this.stateName = eventName;
      this.emit('change', eventName);
    }
  }

}

const CongType = {
  TYPE_LEN1: 1,
  TYPE_LEN2: 2,
  TYPE_LEN3: 3,
  TYPE_LEN4: 4
};

// support LittleEndian system.
function pack(payload) {

  if( payload.byteLength == undefined ) payload = Buffer.from(payload);
  
  if (payload.byteLength < 256) { //one byte len
    return M$1.pack(
      M$1.MB('#type', '8', CongType.TYPE_LEN1),
      M$1.MB('#payloadLen1', '8', payload.byteLength),
      M$1.MB('#payload', payload)
    )

  } else if (payload.byteLength < 65536) {  // 2bytes len
    return M$1.pack(
      M$1.MB('#type', '8', CongType.TYPE_LEN2),
      M$1.MB('#payloadLen2', '16L', payload.byteLength),
      M$1.MB('#payload', payload)
    )

  } else if (payload.byteLength < 2 ** 24) {  // 3bytes len
    let len4Buffer = Buffer.alloc(4);
    len4Buffer.writeUint32LE(payload.byteLength);
    let cropLen3 = len4Buffer.subarray(0, 3);
    return M$1.pack(
      M$1.MB('#type', '8', CongType.TYPE_LEN3),
      M$1.MB('#payloadLen3', cropLen3),
      M$1.MB('#payload', payload)
    )

  } else { //use 4 bytes.
    return M$1.pack(
      M$1.MB('#type', '8', CongType.TYPE_LEN4),
      M$1.MB('#payloadLen4', '32L', payload.byteLength),
      M$1.MB('#payload', payload)
    )
  }

}

class CongRx extends Transform {
  constructor(options) {
    super(options);
    this.buffer = Buffer.alloc(0);
    this.frames = [];
    this.rxi = 0;
    this.rxi_zero = 0;
  }



  _transform(chunk, encoding, callback) {
    this.addData(chunk);
    if (this.frames.length > 0) {
      this.frames.forEach(frame => {
        this.push(frame);
      });
      this.frames = [];
    }
    callback();
  }


  addData(chunk) {
    let c = chunk.byteLength;
    let i = 0;
    while (c--) {
      this.rxi++;
      if (chunk[i++] == 0) {
        this.rxi_zero++;
      }
    }

    if (this.buffer.byteLength > 0) {
      this.buffer = Buffer.concat([this.buffer, chunk]);
    } else {
      this.buffer = chunk;
    }
    this.parse();
  }


  parse() {
    let head = this.buffer[0];
    let headerLen;
    let payloadSize;

    if (head == CongType.TYPE_LEN1) {
      headerLen = 2;
      if (this.buffer.byteLength < headerLen) return;
      payloadSize = this.buffer.readUint8(1);

    } else if (head == CongType.TYPE_LEN2) {
      headerLen = 3;
      if (this.buffer.byteLength < headerLen) return;
      payloadSize = this.buffer.readUint16LE(1);

    } else if (head == CongType.TYPE_LEN3) {
      headerLen = 4;
      if (this.buffer.byteLength < headerLen) return;
      payloadSize = this.buffer.readUint16LE(1) + this.buffer.readUint8(3) * 65536;

    } else if (head == CongType.TYPE_LEN4) {
      headerLen = 5;
      if (this.buffer.byteLength < headerLen) return;
      payloadSize = this.buffer.readUint32LE(1);

    } else {
      this.emit('wrong', this.buffer);
      this.buffer = Buffer.alloc(0);
    }


    if (payloadSize == this.buffer.byteLength - headerLen) {
      this.frames.push(this.buffer.subarray(headerLen));
      this.buffer = Buffer.alloc(0);
      return
    } else if (payloadSize < this.buffer.byteLength - headerLen) {
      this.frames.push(this.buffer.subarray(headerLen, headerLen + payloadSize));
      this.buffer = this.buffer.subarray(headerLen + payloadSize);
      this.parse();
    } else {
      // not ready
      // console.log('+')
      return
    }


  }


}

class IOCongSocket extends IOCore {
  constructor(url) {
    super(url);
    if (url) this.open();
  }

  /**
   * Closes TCP socket and cleans resources.
   */
  close() {
    if (this.socket) {
      if (this.congRx) {
        this.socket.unpipe(this.congRx);
        this.congRx.destroy(); // Use destroy() for complete stream cleanup
        this.congRx = null;
      }
      this.socket.removeAllListeners();
      if (!this.socket.destroyed) {
        this.socket.destroy(); // destroy() is sufficient for forceful closing
      }
    }
    super.close();
  }



  keepConnection() {
    if (!this.autoReconnect) return;
    // Reconnect only if the socket is fully destroyed and the state is closed.
    if ((!this.socket || this.socket.destroyed)) {
      this.open();
    }
  }


  createConnection(url) {
    // TCP Socket
    let urlObj = new URL(url);
    if (urlObj.protocol != "cong:") {
      urlObj = new URL('cong://' + url);
    }
    this.socket = net.createConnection(urlObj.port, urlObj.hostname);
    this.stateChange('connecting','connecting');

    this.socket.on('connect', () => {
      this.congRx = new CongRx();
      this.socket.pipe(this.congRx);
      this.congRx.on("data", this.onTCPSocketMessage.bind(this));
      this.emit('open');
    });

    this.socket.on('error', e => {
      this.emit('error', e);
    });

    this.socket.on('close', () => {
      this.emit('close');
    });

  }

  onTCPSocketMessage(data) {
    this.rxCounter++;
    this.rxBytes += data.byteLength;
    this.lastTxRxTime = Date.now();
    this.emit('socket_data', data);

  }

  socket_send(data) {
    if (this.socket?.readyState === 'open') {
      let packData = pack(data);
      this.socket.write(packData);
      this.txCounter++;
      this.txBytes += packData.byteLength;
      this.lastTxRxTime = Date.now();
    } else {
      console.log('.');
    }
  }

}

var bufferUtil = {exports: {}};

var constants;
var hasRequiredConstants;

function requireConstants () {
	if (hasRequiredConstants) return constants;
	hasRequiredConstants = 1;

	const BINARY_TYPES = ['nodebuffer', 'arraybuffer', 'fragments'];
	const hasBlob = typeof Blob !== 'undefined';

	if (hasBlob) BINARY_TYPES.push('blob');

	constants = {
	  BINARY_TYPES,
	  EMPTY_BUFFER: Buffer.alloc(0),
	  GUID: '258EAFA5-E914-47DA-95CA-C5AB0DC85B11',
	  hasBlob,
	  kForOnEventAttribute: Symbol('kIsForOnEventAttribute'),
	  kListener: Symbol('kListener'),
	  kStatusCode: Symbol('status-code'),
	  kWebSocket: Symbol('websocket'),
	  NOOP: () => {}
	};
	return constants;
}

var hasRequiredBufferUtil;

function requireBufferUtil () {
	if (hasRequiredBufferUtil) return bufferUtil.exports;
	hasRequiredBufferUtil = 1;

	const { EMPTY_BUFFER } = requireConstants();

	const FastBuffer = Buffer[Symbol.species];

	/**
	 * Merges an array of buffers into a new buffer.
	 *
	 * @param {Buffer[]} list The array of buffers to concat
	 * @param {Number} totalLength The total length of buffers in the list
	 * @return {Buffer} The resulting buffer
	 * @public
	 */
	function concat(list, totalLength) {
	  if (list.length === 0) return EMPTY_BUFFER;
	  if (list.length === 1) return list[0];

	  const target = Buffer.allocUnsafe(totalLength);
	  let offset = 0;

	  for (let i = 0; i < list.length; i++) {
	    const buf = list[i];
	    target.set(buf, offset);
	    offset += buf.length;
	  }

	  if (offset < totalLength) {
	    return new FastBuffer(target.buffer, target.byteOffset, offset);
	  }

	  return target;
	}

	/**
	 * Masks a buffer using the given mask.
	 *
	 * @param {Buffer} source The buffer to mask
	 * @param {Buffer} mask The mask to use
	 * @param {Buffer} output The buffer where to store the result
	 * @param {Number} offset The offset at which to start writing
	 * @param {Number} length The number of bytes to mask.
	 * @public
	 */
	function _mask(source, mask, output, offset, length) {
	  for (let i = 0; i < length; i++) {
	    output[offset + i] = source[i] ^ mask[i & 3];
	  }
	}

	/**
	 * Unmasks a buffer using the given mask.
	 *
	 * @param {Buffer} buffer The buffer to unmask
	 * @param {Buffer} mask The mask to use
	 * @public
	 */
	function _unmask(buffer, mask) {
	  for (let i = 0; i < buffer.length; i++) {
	    buffer[i] ^= mask[i & 3];
	  }
	}

	/**
	 * Converts a buffer to an `ArrayBuffer`.
	 *
	 * @param {Buffer} buf The buffer to convert
	 * @return {ArrayBuffer} Converted buffer
	 * @public
	 */
	function toArrayBuffer(buf) {
	  if (buf.length === buf.buffer.byteLength) {
	    return buf.buffer;
	  }

	  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length);
	}

	/**
	 * Converts `data` to a `Buffer`.
	 *
	 * @param {*} data The data to convert
	 * @return {Buffer} The buffer
	 * @throws {TypeError}
	 * @public
	 */
	function toBuffer(data) {
	  toBuffer.readOnly = true;

	  if (Buffer.isBuffer(data)) return data;

	  let buf;

	  if (data instanceof ArrayBuffer) {
	    buf = new FastBuffer(data);
	  } else if (ArrayBuffer.isView(data)) {
	    buf = new FastBuffer(data.buffer, data.byteOffset, data.byteLength);
	  } else {
	    buf = Buffer.from(data);
	    toBuffer.readOnly = false;
	  }

	  return buf;
	}

	bufferUtil.exports = {
	  concat,
	  mask: _mask,
	  toArrayBuffer,
	  toBuffer,
	  unmask: _unmask
	};

	/* istanbul ignore else  */
	if (!process.env.WS_NO_BUFFER_UTIL) {
	  try {
	    const bufferUtil$1 = require('bufferutil');

	    bufferUtil.exports.mask = function (source, mask, output, offset, length) {
	      if (length < 48) _mask(source, mask, output, offset, length);
	      else bufferUtil$1.mask(source, mask, output, offset, length);
	    };

	    bufferUtil.exports.unmask = function (buffer, mask) {
	      if (buffer.length < 32) _unmask(buffer, mask);
	      else bufferUtil$1.unmask(buffer, mask);
	    };
	  } catch (e) {
	    // Continue regardless of the error.
	  }
	}
	return bufferUtil.exports;
}

var limiter;
var hasRequiredLimiter;

function requireLimiter () {
	if (hasRequiredLimiter) return limiter;
	hasRequiredLimiter = 1;

	const kDone = Symbol('kDone');
	const kRun = Symbol('kRun');

	/**
	 * A very simple job queue with adjustable concurrency. Adapted from
	 * https://github.com/STRML/async-limiter
	 */
	class Limiter {
	  /**
	   * Creates a new `Limiter`.
	   *
	   * @param {Number} [concurrency=Infinity] The maximum number of jobs allowed
	   *     to run concurrently
	   */
	  constructor(concurrency) {
	    this[kDone] = () => {
	      this.pending--;
	      this[kRun]();
	    };
	    this.concurrency = concurrency || Infinity;
	    this.jobs = [];
	    this.pending = 0;
	  }

	  /**
	   * Adds a job to the queue.
	   *
	   * @param {Function} job The job to run
	   * @public
	   */
	  add(job) {
	    this.jobs.push(job);
	    this[kRun]();
	  }

	  /**
	   * Removes a job from the queue and runs it if possible.
	   *
	   * @private
	   */
	  [kRun]() {
	    if (this.pending === this.concurrency) return;

	    if (this.jobs.length) {
	      const job = this.jobs.shift();

	      this.pending++;
	      job(this[kDone]);
	    }
	  }
	}

	limiter = Limiter;
	return limiter;
}

var permessageDeflate;
var hasRequiredPermessageDeflate;

function requirePermessageDeflate () {
	if (hasRequiredPermessageDeflate) return permessageDeflate;
	hasRequiredPermessageDeflate = 1;

	const zlib = require$$0;

	const bufferUtil = requireBufferUtil();
	const Limiter = requireLimiter();
	const { kStatusCode } = requireConstants();

	const FastBuffer = Buffer[Symbol.species];
	const TRAILER = Buffer.from([0x00, 0x00, 0xff, 0xff]);
	const kPerMessageDeflate = Symbol('permessage-deflate');
	const kTotalLength = Symbol('total-length');
	const kCallback = Symbol('callback');
	const kBuffers = Symbol('buffers');
	const kError = Symbol('error');

	//
	// We limit zlib concurrency, which prevents severe memory fragmentation
	// as documented in https://github.com/nodejs/node/issues/8871#issuecomment-250915913
	// and https://github.com/websockets/ws/issues/1202
	//
	// Intentionally global; it's the global thread pool that's an issue.
	//
	let zlibLimiter;

	/**
	 * permessage-deflate implementation.
	 */
	class PerMessageDeflate {
	  /**
	   * Creates a PerMessageDeflate instance.
	   *
	   * @param {Object} [options] Configuration options
	   * @param {(Boolean|Number)} [options.clientMaxWindowBits] Advertise support
	   *     for, or request, a custom client window size
	   * @param {Boolean} [options.clientNoContextTakeover=false] Advertise/
	   *     acknowledge disabling of client context takeover
	   * @param {Number} [options.concurrencyLimit=10] The number of concurrent
	   *     calls to zlib
	   * @param {(Boolean|Number)} [options.serverMaxWindowBits] Request/confirm the
	   *     use of a custom server window size
	   * @param {Boolean} [options.serverNoContextTakeover=false] Request/accept
	   *     disabling of server context takeover
	   * @param {Number} [options.threshold=1024] Size (in bytes) below which
	   *     messages should not be compressed if context takeover is disabled
	   * @param {Object} [options.zlibDeflateOptions] Options to pass to zlib on
	   *     deflate
	   * @param {Object} [options.zlibInflateOptions] Options to pass to zlib on
	   *     inflate
	   * @param {Boolean} [isServer=false] Create the instance in either server or
	   *     client mode
	   * @param {Number} [maxPayload=0] The maximum allowed message length
	   */
	  constructor(options, isServer, maxPayload) {
	    this._maxPayload = maxPayload | 0;
	    this._options = options || {};
	    this._threshold =
	      this._options.threshold !== undefined ? this._options.threshold : 1024;
	    this._isServer = !!isServer;
	    this._deflate = null;
	    this._inflate = null;

	    this.params = null;

	    if (!zlibLimiter) {
	      const concurrency =
	        this._options.concurrencyLimit !== undefined
	          ? this._options.concurrencyLimit
	          : 10;
	      zlibLimiter = new Limiter(concurrency);
	    }
	  }

	  /**
	   * @type {String}
	   */
	  static get extensionName() {
	    return 'permessage-deflate';
	  }

	  /**
	   * Create an extension negotiation offer.
	   *
	   * @return {Object} Extension parameters
	   * @public
	   */
	  offer() {
	    const params = {};

	    if (this._options.serverNoContextTakeover) {
	      params.server_no_context_takeover = true;
	    }
	    if (this._options.clientNoContextTakeover) {
	      params.client_no_context_takeover = true;
	    }
	    if (this._options.serverMaxWindowBits) {
	      params.server_max_window_bits = this._options.serverMaxWindowBits;
	    }
	    if (this._options.clientMaxWindowBits) {
	      params.client_max_window_bits = this._options.clientMaxWindowBits;
	    } else if (this._options.clientMaxWindowBits == null) {
	      params.client_max_window_bits = true;
	    }

	    return params;
	  }

	  /**
	   * Accept an extension negotiation offer/response.
	   *
	   * @param {Array} configurations The extension negotiation offers/reponse
	   * @return {Object} Accepted configuration
	   * @public
	   */
	  accept(configurations) {
	    configurations = this.normalizeParams(configurations);

	    this.params = this._isServer
	      ? this.acceptAsServer(configurations)
	      : this.acceptAsClient(configurations);

	    return this.params;
	  }

	  /**
	   * Releases all resources used by the extension.
	   *
	   * @public
	   */
	  cleanup() {
	    if (this._inflate) {
	      this._inflate.close();
	      this._inflate = null;
	    }

	    if (this._deflate) {
	      const callback = this._deflate[kCallback];

	      this._deflate.close();
	      this._deflate = null;

	      if (callback) {
	        callback(
	          new Error(
	            'The deflate stream was closed while data was being processed'
	          )
	        );
	      }
	    }
	  }

	  /**
	   *  Accept an extension negotiation offer.
	   *
	   * @param {Array} offers The extension negotiation offers
	   * @return {Object} Accepted configuration
	   * @private
	   */
	  acceptAsServer(offers) {
	    const opts = this._options;
	    const accepted = offers.find((params) => {
	      if (
	        (opts.serverNoContextTakeover === false &&
	          params.server_no_context_takeover) ||
	        (params.server_max_window_bits &&
	          (opts.serverMaxWindowBits === false ||
	            (typeof opts.serverMaxWindowBits === 'number' &&
	              opts.serverMaxWindowBits > params.server_max_window_bits))) ||
	        (typeof opts.clientMaxWindowBits === 'number' &&
	          !params.client_max_window_bits)
	      ) {
	        return false;
	      }

	      return true;
	    });

	    if (!accepted) {
	      throw new Error('None of the extension offers can be accepted');
	    }

	    if (opts.serverNoContextTakeover) {
	      accepted.server_no_context_takeover = true;
	    }
	    if (opts.clientNoContextTakeover) {
	      accepted.client_no_context_takeover = true;
	    }
	    if (typeof opts.serverMaxWindowBits === 'number') {
	      accepted.server_max_window_bits = opts.serverMaxWindowBits;
	    }
	    if (typeof opts.clientMaxWindowBits === 'number') {
	      accepted.client_max_window_bits = opts.clientMaxWindowBits;
	    } else if (
	      accepted.client_max_window_bits === true ||
	      opts.clientMaxWindowBits === false
	    ) {
	      delete accepted.client_max_window_bits;
	    }

	    return accepted;
	  }

	  /**
	   * Accept the extension negotiation response.
	   *
	   * @param {Array} response The extension negotiation response
	   * @return {Object} Accepted configuration
	   * @private
	   */
	  acceptAsClient(response) {
	    const params = response[0];

	    if (
	      this._options.clientNoContextTakeover === false &&
	      params.client_no_context_takeover
	    ) {
	      throw new Error('Unexpected parameter "client_no_context_takeover"');
	    }

	    if (!params.client_max_window_bits) {
	      if (typeof this._options.clientMaxWindowBits === 'number') {
	        params.client_max_window_bits = this._options.clientMaxWindowBits;
	      }
	    } else if (
	      this._options.clientMaxWindowBits === false ||
	      (typeof this._options.clientMaxWindowBits === 'number' &&
	        params.client_max_window_bits > this._options.clientMaxWindowBits)
	    ) {
	      throw new Error(
	        'Unexpected or invalid parameter "client_max_window_bits"'
	      );
	    }

	    return params;
	  }

	  /**
	   * Normalize parameters.
	   *
	   * @param {Array} configurations The extension negotiation offers/reponse
	   * @return {Array} The offers/response with normalized parameters
	   * @private
	   */
	  normalizeParams(configurations) {
	    configurations.forEach((params) => {
	      Object.keys(params).forEach((key) => {
	        let value = params[key];

	        if (value.length > 1) {
	          throw new Error(`Parameter "${key}" must have only a single value`);
	        }

	        value = value[0];

	        if (key === 'client_max_window_bits') {
	          if (value !== true) {
	            const num = +value;
	            if (!Number.isInteger(num) || num < 8 || num > 15) {
	              throw new TypeError(
	                `Invalid value for parameter "${key}": ${value}`
	              );
	            }
	            value = num;
	          } else if (!this._isServer) {
	            throw new TypeError(
	              `Invalid value for parameter "${key}": ${value}`
	            );
	          }
	        } else if (key === 'server_max_window_bits') {
	          const num = +value;
	          if (!Number.isInteger(num) || num < 8 || num > 15) {
	            throw new TypeError(
	              `Invalid value for parameter "${key}": ${value}`
	            );
	          }
	          value = num;
	        } else if (
	          key === 'client_no_context_takeover' ||
	          key === 'server_no_context_takeover'
	        ) {
	          if (value !== true) {
	            throw new TypeError(
	              `Invalid value for parameter "${key}": ${value}`
	            );
	          }
	        } else {
	          throw new Error(`Unknown parameter "${key}"`);
	        }

	        params[key] = value;
	      });
	    });

	    return configurations;
	  }

	  /**
	   * Decompress data. Concurrency limited.
	   *
	   * @param {Buffer} data Compressed data
	   * @param {Boolean} fin Specifies whether or not this is the last fragment
	   * @param {Function} callback Callback
	   * @public
	   */
	  decompress(data, fin, callback) {
	    zlibLimiter.add((done) => {
	      this._decompress(data, fin, (err, result) => {
	        done();
	        callback(err, result);
	      });
	    });
	  }

	  /**
	   * Compress data. Concurrency limited.
	   *
	   * @param {(Buffer|String)} data Data to compress
	   * @param {Boolean} fin Specifies whether or not this is the last fragment
	   * @param {Function} callback Callback
	   * @public
	   */
	  compress(data, fin, callback) {
	    zlibLimiter.add((done) => {
	      this._compress(data, fin, (err, result) => {
	        done();
	        callback(err, result);
	      });
	    });
	  }

	  /**
	   * Decompress data.
	   *
	   * @param {Buffer} data Compressed data
	   * @param {Boolean} fin Specifies whether or not this is the last fragment
	   * @param {Function} callback Callback
	   * @private
	   */
	  _decompress(data, fin, callback) {
	    const endpoint = this._isServer ? 'client' : 'server';

	    if (!this._inflate) {
	      const key = `${endpoint}_max_window_bits`;
	      const windowBits =
	        typeof this.params[key] !== 'number'
	          ? zlib.Z_DEFAULT_WINDOWBITS
	          : this.params[key];

	      this._inflate = zlib.createInflateRaw({
	        ...this._options.zlibInflateOptions,
	        windowBits
	      });
	      this._inflate[kPerMessageDeflate] = this;
	      this._inflate[kTotalLength] = 0;
	      this._inflate[kBuffers] = [];
	      this._inflate.on('error', inflateOnError);
	      this._inflate.on('data', inflateOnData);
	    }

	    this._inflate[kCallback] = callback;

	    this._inflate.write(data);
	    if (fin) this._inflate.write(TRAILER);

	    this._inflate.flush(() => {
	      const err = this._inflate[kError];

	      if (err) {
	        this._inflate.close();
	        this._inflate = null;
	        callback(err);
	        return;
	      }

	      const data = bufferUtil.concat(
	        this._inflate[kBuffers],
	        this._inflate[kTotalLength]
	      );

	      if (this._inflate._readableState.endEmitted) {
	        this._inflate.close();
	        this._inflate = null;
	      } else {
	        this._inflate[kTotalLength] = 0;
	        this._inflate[kBuffers] = [];

	        if (fin && this.params[`${endpoint}_no_context_takeover`]) {
	          this._inflate.reset();
	        }
	      }

	      callback(null, data);
	    });
	  }

	  /**
	   * Compress data.
	   *
	   * @param {(Buffer|String)} data Data to compress
	   * @param {Boolean} fin Specifies whether or not this is the last fragment
	   * @param {Function} callback Callback
	   * @private
	   */
	  _compress(data, fin, callback) {
	    const endpoint = this._isServer ? 'server' : 'client';

	    if (!this._deflate) {
	      const key = `${endpoint}_max_window_bits`;
	      const windowBits =
	        typeof this.params[key] !== 'number'
	          ? zlib.Z_DEFAULT_WINDOWBITS
	          : this.params[key];

	      this._deflate = zlib.createDeflateRaw({
	        ...this._options.zlibDeflateOptions,
	        windowBits
	      });

	      this._deflate[kTotalLength] = 0;
	      this._deflate[kBuffers] = [];

	      this._deflate.on('data', deflateOnData);
	    }

	    this._deflate[kCallback] = callback;

	    this._deflate.write(data);
	    this._deflate.flush(zlib.Z_SYNC_FLUSH, () => {
	      if (!this._deflate) {
	        //
	        // The deflate stream was closed while data was being processed.
	        //
	        return;
	      }

	      let data = bufferUtil.concat(
	        this._deflate[kBuffers],
	        this._deflate[kTotalLength]
	      );

	      if (fin) {
	        data = new FastBuffer(data.buffer, data.byteOffset, data.length - 4);
	      }

	      //
	      // Ensure that the callback will not be called again in
	      // `PerMessageDeflate#cleanup()`.
	      //
	      this._deflate[kCallback] = null;

	      this._deflate[kTotalLength] = 0;
	      this._deflate[kBuffers] = [];

	      if (fin && this.params[`${endpoint}_no_context_takeover`]) {
	        this._deflate.reset();
	      }

	      callback(null, data);
	    });
	  }
	}

	permessageDeflate = PerMessageDeflate;

	/**
	 * The listener of the `zlib.DeflateRaw` stream `'data'` event.
	 *
	 * @param {Buffer} chunk A chunk of data
	 * @private
	 */
	function deflateOnData(chunk) {
	  this[kBuffers].push(chunk);
	  this[kTotalLength] += chunk.length;
	}

	/**
	 * The listener of the `zlib.InflateRaw` stream `'data'` event.
	 *
	 * @param {Buffer} chunk A chunk of data
	 * @private
	 */
	function inflateOnData(chunk) {
	  this[kTotalLength] += chunk.length;

	  if (
	    this[kPerMessageDeflate]._maxPayload < 1 ||
	    this[kTotalLength] <= this[kPerMessageDeflate]._maxPayload
	  ) {
	    this[kBuffers].push(chunk);
	    return;
	  }

	  this[kError] = new RangeError('Max payload size exceeded');
	  this[kError].code = 'WS_ERR_UNSUPPORTED_MESSAGE_LENGTH';
	  this[kError][kStatusCode] = 1009;
	  this.removeListener('data', inflateOnData);

	  //
	  // The choice to employ `zlib.reset()` over `zlib.close()` is dictated by the
	  // fact that in Node.js versions prior to 13.10.0, the callback for
	  // `zlib.flush()` is not called if `zlib.close()` is used. Utilizing
	  // `zlib.reset()` ensures that either the callback is invoked or an error is
	  // emitted.
	  //
	  this.reset();
	}

	/**
	 * The listener of the `zlib.InflateRaw` stream `'error'` event.
	 *
	 * @param {Error} err The emitted error
	 * @private
	 */
	function inflateOnError(err) {
	  //
	  // There is no need to call `Zlib#close()` as the handle is automatically
	  // closed when an error is emitted.
	  //
	  this[kPerMessageDeflate]._inflate = null;

	  if (this[kError]) {
	    this[kCallback](this[kError]);
	    return;
	  }

	  err[kStatusCode] = 1007;
	  this[kCallback](err);
	}
	return permessageDeflate;
}

var validation = {exports: {}};

var hasRequiredValidation;

function requireValidation () {
	if (hasRequiredValidation) return validation.exports;
	hasRequiredValidation = 1;

	const { isUtf8 } = require$$0$1;

	const { hasBlob } = requireConstants();

	//
	// Allowed token characters:
	//
	// '!', '#', '$', '%', '&', ''', '*', '+', '-',
	// '.', 0-9, A-Z, '^', '_', '`', a-z, '|', '~'
	//
	// tokenChars[32] === 0 // ' '
	// tokenChars[33] === 1 // '!'
	// tokenChars[34] === 0 // '"'
	// ...
	//
	// prettier-ignore
	const tokenChars = [
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 0 - 15
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 16 - 31
	  0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, // 32 - 47
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, // 48 - 63
	  0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 64 - 79
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, // 80 - 95
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 96 - 111
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0 // 112 - 127
	];

	/**
	 * Checks if a status code is allowed in a close frame.
	 *
	 * @param {Number} code The status code
	 * @return {Boolean} `true` if the status code is valid, else `false`
	 * @public
	 */
	function isValidStatusCode(code) {
	  return (
	    (code >= 1000 &&
	      code <= 1014 &&
	      code !== 1004 &&
	      code !== 1005 &&
	      code !== 1006) ||
	    (code >= 3000 && code <= 4999)
	  );
	}

	/**
	 * Checks if a given buffer contains only correct UTF-8.
	 * Ported from https://www.cl.cam.ac.uk/%7Emgk25/ucs/utf8_check.c by
	 * Markus Kuhn.
	 *
	 * @param {Buffer} buf The buffer to check
	 * @return {Boolean} `true` if `buf` contains only correct UTF-8, else `false`
	 * @public
	 */
	function _isValidUTF8(buf) {
	  const len = buf.length;
	  let i = 0;

	  while (i < len) {
	    if ((buf[i] & 0x80) === 0) {
	      // 0xxxxxxx
	      i++;
	    } else if ((buf[i] & 0xe0) === 0xc0) {
	      // 110xxxxx 10xxxxxx
	      if (
	        i + 1 === len ||
	        (buf[i + 1] & 0xc0) !== 0x80 ||
	        (buf[i] & 0xfe) === 0xc0 // Overlong
	      ) {
	        return false;
	      }

	      i += 2;
	    } else if ((buf[i] & 0xf0) === 0xe0) {
	      // 1110xxxx 10xxxxxx 10xxxxxx
	      if (
	        i + 2 >= len ||
	        (buf[i + 1] & 0xc0) !== 0x80 ||
	        (buf[i + 2] & 0xc0) !== 0x80 ||
	        (buf[i] === 0xe0 && (buf[i + 1] & 0xe0) === 0x80) || // Overlong
	        (buf[i] === 0xed && (buf[i + 1] & 0xe0) === 0xa0) // Surrogate (U+D800 - U+DFFF)
	      ) {
	        return false;
	      }

	      i += 3;
	    } else if ((buf[i] & 0xf8) === 0xf0) {
	      // 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
	      if (
	        i + 3 >= len ||
	        (buf[i + 1] & 0xc0) !== 0x80 ||
	        (buf[i + 2] & 0xc0) !== 0x80 ||
	        (buf[i + 3] & 0xc0) !== 0x80 ||
	        (buf[i] === 0xf0 && (buf[i + 1] & 0xf0) === 0x80) || // Overlong
	        (buf[i] === 0xf4 && buf[i + 1] > 0x8f) ||
	        buf[i] > 0xf4 // > U+10FFFF
	      ) {
	        return false;
	      }

	      i += 4;
	    } else {
	      return false;
	    }
	  }

	  return true;
	}

	/**
	 * Determines whether a value is a `Blob`.
	 *
	 * @param {*} value The value to be tested
	 * @return {Boolean} `true` if `value` is a `Blob`, else `false`
	 * @private
	 */
	function isBlob(value) {
	  return (
	    hasBlob &&
	    typeof value === 'object' &&
	    typeof value.arrayBuffer === 'function' &&
	    typeof value.type === 'string' &&
	    typeof value.stream === 'function' &&
	    (value[Symbol.toStringTag] === 'Blob' ||
	      value[Symbol.toStringTag] === 'File')
	  );
	}

	validation.exports = {
	  isBlob,
	  isValidStatusCode,
	  isValidUTF8: _isValidUTF8,
	  tokenChars
	};

	if (isUtf8) {
	  validation.exports.isValidUTF8 = function (buf) {
	    return buf.length < 24 ? _isValidUTF8(buf) : isUtf8(buf);
	  };
	} /* istanbul ignore else  */ else if (!process.env.WS_NO_UTF_8_VALIDATE) {
	  try {
	    const isValidUTF8 = require('utf-8-validate');

	    validation.exports.isValidUTF8 = function (buf) {
	      return buf.length < 32 ? _isValidUTF8(buf) : isValidUTF8(buf);
	    };
	  } catch (e) {
	    // Continue regardless of the error.
	  }
	}
	return validation.exports;
}

var receiver;
var hasRequiredReceiver;

function requireReceiver () {
	if (hasRequiredReceiver) return receiver;
	hasRequiredReceiver = 1;

	const { Writable } = require$$0$2;

	const PerMessageDeflate = requirePermessageDeflate();
	const {
	  BINARY_TYPES,
	  EMPTY_BUFFER,
	  kStatusCode,
	  kWebSocket
	} = requireConstants();
	const { concat, toArrayBuffer, unmask } = requireBufferUtil();
	const { isValidStatusCode, isValidUTF8 } = requireValidation();

	const FastBuffer = Buffer[Symbol.species];

	const GET_INFO = 0;
	const GET_PAYLOAD_LENGTH_16 = 1;
	const GET_PAYLOAD_LENGTH_64 = 2;
	const GET_MASK = 3;
	const GET_DATA = 4;
	const INFLATING = 5;
	const DEFER_EVENT = 6;

	/**
	 * HyBi Receiver implementation.
	 *
	 * @extends Writable
	 */
	class Receiver extends Writable {
	  /**
	   * Creates a Receiver instance.
	   *
	   * @param {Object} [options] Options object
	   * @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether
	   *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
	   *     multiple times in the same tick
	   * @param {String} [options.binaryType=nodebuffer] The type for binary data
	   * @param {Object} [options.extensions] An object containing the negotiated
	   *     extensions
	   * @param {Boolean} [options.isServer=false] Specifies whether to operate in
	   *     client or server mode
	   * @param {Number} [options.maxPayload=0] The maximum allowed message length
	   * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
	   *     not to skip UTF-8 validation for text and close messages
	   */
	  constructor(options = {}) {
	    super();

	    this._allowSynchronousEvents =
	      options.allowSynchronousEvents !== undefined
	        ? options.allowSynchronousEvents
	        : true;
	    this._binaryType = options.binaryType || BINARY_TYPES[0];
	    this._extensions = options.extensions || {};
	    this._isServer = !!options.isServer;
	    this._maxPayload = options.maxPayload | 0;
	    this._skipUTF8Validation = !!options.skipUTF8Validation;
	    this[kWebSocket] = undefined;

	    this._bufferedBytes = 0;
	    this._buffers = [];

	    this._compressed = false;
	    this._payloadLength = 0;
	    this._mask = undefined;
	    this._fragmented = 0;
	    this._masked = false;
	    this._fin = false;
	    this._opcode = 0;

	    this._totalPayloadLength = 0;
	    this._messageLength = 0;
	    this._fragments = [];

	    this._errored = false;
	    this._loop = false;
	    this._state = GET_INFO;
	  }

	  /**
	   * Implements `Writable.prototype._write()`.
	   *
	   * @param {Buffer} chunk The chunk of data to write
	   * @param {String} encoding The character encoding of `chunk`
	   * @param {Function} cb Callback
	   * @private
	   */
	  _write(chunk, encoding, cb) {
	    if (this._opcode === 0x08 && this._state == GET_INFO) return cb();

	    this._bufferedBytes += chunk.length;
	    this._buffers.push(chunk);
	    this.startLoop(cb);
	  }

	  /**
	   * Consumes `n` bytes from the buffered data.
	   *
	   * @param {Number} n The number of bytes to consume
	   * @return {Buffer} The consumed bytes
	   * @private
	   */
	  consume(n) {
	    this._bufferedBytes -= n;

	    if (n === this._buffers[0].length) return this._buffers.shift();

	    if (n < this._buffers[0].length) {
	      const buf = this._buffers[0];
	      this._buffers[0] = new FastBuffer(
	        buf.buffer,
	        buf.byteOffset + n,
	        buf.length - n
	      );

	      return new FastBuffer(buf.buffer, buf.byteOffset, n);
	    }

	    const dst = Buffer.allocUnsafe(n);

	    do {
	      const buf = this._buffers[0];
	      const offset = dst.length - n;

	      if (n >= buf.length) {
	        dst.set(this._buffers.shift(), offset);
	      } else {
	        dst.set(new Uint8Array(buf.buffer, buf.byteOffset, n), offset);
	        this._buffers[0] = new FastBuffer(
	          buf.buffer,
	          buf.byteOffset + n,
	          buf.length - n
	        );
	      }

	      n -= buf.length;
	    } while (n > 0);

	    return dst;
	  }

	  /**
	   * Starts the parsing loop.
	   *
	   * @param {Function} cb Callback
	   * @private
	   */
	  startLoop(cb) {
	    this._loop = true;

	    do {
	      switch (this._state) {
	        case GET_INFO:
	          this.getInfo(cb);
	          break;
	        case GET_PAYLOAD_LENGTH_16:
	          this.getPayloadLength16(cb);
	          break;
	        case GET_PAYLOAD_LENGTH_64:
	          this.getPayloadLength64(cb);
	          break;
	        case GET_MASK:
	          this.getMask();
	          break;
	        case GET_DATA:
	          this.getData(cb);
	          break;
	        case INFLATING:
	        case DEFER_EVENT:
	          this._loop = false;
	          return;
	      }
	    } while (this._loop);

	    if (!this._errored) cb();
	  }

	  /**
	   * Reads the first two bytes of a frame.
	   *
	   * @param {Function} cb Callback
	   * @private
	   */
	  getInfo(cb) {
	    if (this._bufferedBytes < 2) {
	      this._loop = false;
	      return;
	    }

	    const buf = this.consume(2);

	    if ((buf[0] & 0x30) !== 0x00) {
	      const error = this.createError(
	        RangeError,
	        'RSV2 and RSV3 must be clear',
	        true,
	        1002,
	        'WS_ERR_UNEXPECTED_RSV_2_3'
	      );

	      cb(error);
	      return;
	    }

	    const compressed = (buf[0] & 0x40) === 0x40;

	    if (compressed && !this._extensions[PerMessageDeflate.extensionName]) {
	      const error = this.createError(
	        RangeError,
	        'RSV1 must be clear',
	        true,
	        1002,
	        'WS_ERR_UNEXPECTED_RSV_1'
	      );

	      cb(error);
	      return;
	    }

	    this._fin = (buf[0] & 0x80) === 0x80;
	    this._opcode = buf[0] & 0x0f;
	    this._payloadLength = buf[1] & 0x7f;

	    if (this._opcode === 0x00) {
	      if (compressed) {
	        const error = this.createError(
	          RangeError,
	          'RSV1 must be clear',
	          true,
	          1002,
	          'WS_ERR_UNEXPECTED_RSV_1'
	        );

	        cb(error);
	        return;
	      }

	      if (!this._fragmented) {
	        const error = this.createError(
	          RangeError,
	          'invalid opcode 0',
	          true,
	          1002,
	          'WS_ERR_INVALID_OPCODE'
	        );

	        cb(error);
	        return;
	      }

	      this._opcode = this._fragmented;
	    } else if (this._opcode === 0x01 || this._opcode === 0x02) {
	      if (this._fragmented) {
	        const error = this.createError(
	          RangeError,
	          `invalid opcode ${this._opcode}`,
	          true,
	          1002,
	          'WS_ERR_INVALID_OPCODE'
	        );

	        cb(error);
	        return;
	      }

	      this._compressed = compressed;
	    } else if (this._opcode > 0x07 && this._opcode < 0x0b) {
	      if (!this._fin) {
	        const error = this.createError(
	          RangeError,
	          'FIN must be set',
	          true,
	          1002,
	          'WS_ERR_EXPECTED_FIN'
	        );

	        cb(error);
	        return;
	      }

	      if (compressed) {
	        const error = this.createError(
	          RangeError,
	          'RSV1 must be clear',
	          true,
	          1002,
	          'WS_ERR_UNEXPECTED_RSV_1'
	        );

	        cb(error);
	        return;
	      }

	      if (
	        this._payloadLength > 0x7d ||
	        (this._opcode === 0x08 && this._payloadLength === 1)
	      ) {
	        const error = this.createError(
	          RangeError,
	          `invalid payload length ${this._payloadLength}`,
	          true,
	          1002,
	          'WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH'
	        );

	        cb(error);
	        return;
	      }
	    } else {
	      const error = this.createError(
	        RangeError,
	        `invalid opcode ${this._opcode}`,
	        true,
	        1002,
	        'WS_ERR_INVALID_OPCODE'
	      );

	      cb(error);
	      return;
	    }

	    if (!this._fin && !this._fragmented) this._fragmented = this._opcode;
	    this._masked = (buf[1] & 0x80) === 0x80;

	    if (this._isServer) {
	      if (!this._masked) {
	        const error = this.createError(
	          RangeError,
	          'MASK must be set',
	          true,
	          1002,
	          'WS_ERR_EXPECTED_MASK'
	        );

	        cb(error);
	        return;
	      }
	    } else if (this._masked) {
	      const error = this.createError(
	        RangeError,
	        'MASK must be clear',
	        true,
	        1002,
	        'WS_ERR_UNEXPECTED_MASK'
	      );

	      cb(error);
	      return;
	    }

	    if (this._payloadLength === 126) this._state = GET_PAYLOAD_LENGTH_16;
	    else if (this._payloadLength === 127) this._state = GET_PAYLOAD_LENGTH_64;
	    else this.haveLength(cb);
	  }

	  /**
	   * Gets extended payload length (7+16).
	   *
	   * @param {Function} cb Callback
	   * @private
	   */
	  getPayloadLength16(cb) {
	    if (this._bufferedBytes < 2) {
	      this._loop = false;
	      return;
	    }

	    this._payloadLength = this.consume(2).readUInt16BE(0);
	    this.haveLength(cb);
	  }

	  /**
	   * Gets extended payload length (7+64).
	   *
	   * @param {Function} cb Callback
	   * @private
	   */
	  getPayloadLength64(cb) {
	    if (this._bufferedBytes < 8) {
	      this._loop = false;
	      return;
	    }

	    const buf = this.consume(8);
	    const num = buf.readUInt32BE(0);

	    //
	    // The maximum safe integer in JavaScript is 2^53 - 1. An error is returned
	    // if payload length is greater than this number.
	    //
	    if (num > Math.pow(2, 53 - 32) - 1) {
	      const error = this.createError(
	        RangeError,
	        'Unsupported WebSocket frame: payload length > 2^53 - 1',
	        false,
	        1009,
	        'WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH'
	      );

	      cb(error);
	      return;
	    }

	    this._payloadLength = num * Math.pow(2, 32) + buf.readUInt32BE(4);
	    this.haveLength(cb);
	  }

	  /**
	   * Payload length has been read.
	   *
	   * @param {Function} cb Callback
	   * @private
	   */
	  haveLength(cb) {
	    if (this._payloadLength && this._opcode < 0x08) {
	      this._totalPayloadLength += this._payloadLength;
	      if (this._totalPayloadLength > this._maxPayload && this._maxPayload > 0) {
	        const error = this.createError(
	          RangeError,
	          'Max payload size exceeded',
	          false,
	          1009,
	          'WS_ERR_UNSUPPORTED_MESSAGE_LENGTH'
	        );

	        cb(error);
	        return;
	      }
	    }

	    if (this._masked) this._state = GET_MASK;
	    else this._state = GET_DATA;
	  }

	  /**
	   * Reads mask bytes.
	   *
	   * @private
	   */
	  getMask() {
	    if (this._bufferedBytes < 4) {
	      this._loop = false;
	      return;
	    }

	    this._mask = this.consume(4);
	    this._state = GET_DATA;
	  }

	  /**
	   * Reads data bytes.
	   *
	   * @param {Function} cb Callback
	   * @private
	   */
	  getData(cb) {
	    let data = EMPTY_BUFFER;

	    if (this._payloadLength) {
	      if (this._bufferedBytes < this._payloadLength) {
	        this._loop = false;
	        return;
	      }

	      data = this.consume(this._payloadLength);

	      if (
	        this._masked &&
	        (this._mask[0] | this._mask[1] | this._mask[2] | this._mask[3]) !== 0
	      ) {
	        unmask(data, this._mask);
	      }
	    }

	    if (this._opcode > 0x07) {
	      this.controlMessage(data, cb);
	      return;
	    }

	    if (this._compressed) {
	      this._state = INFLATING;
	      this.decompress(data, cb);
	      return;
	    }

	    if (data.length) {
	      //
	      // This message is not compressed so its length is the sum of the payload
	      // length of all fragments.
	      //
	      this._messageLength = this._totalPayloadLength;
	      this._fragments.push(data);
	    }

	    this.dataMessage(cb);
	  }

	  /**
	   * Decompresses data.
	   *
	   * @param {Buffer} data Compressed data
	   * @param {Function} cb Callback
	   * @private
	   */
	  decompress(data, cb) {
	    const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];

	    perMessageDeflate.decompress(data, this._fin, (err, buf) => {
	      if (err) return cb(err);

	      if (buf.length) {
	        this._messageLength += buf.length;
	        if (this._messageLength > this._maxPayload && this._maxPayload > 0) {
	          const error = this.createError(
	            RangeError,
	            'Max payload size exceeded',
	            false,
	            1009,
	            'WS_ERR_UNSUPPORTED_MESSAGE_LENGTH'
	          );

	          cb(error);
	          return;
	        }

	        this._fragments.push(buf);
	      }

	      this.dataMessage(cb);
	      if (this._state === GET_INFO) this.startLoop(cb);
	    });
	  }

	  /**
	   * Handles a data message.
	   *
	   * @param {Function} cb Callback
	   * @private
	   */
	  dataMessage(cb) {
	    if (!this._fin) {
	      this._state = GET_INFO;
	      return;
	    }

	    const messageLength = this._messageLength;
	    const fragments = this._fragments;

	    this._totalPayloadLength = 0;
	    this._messageLength = 0;
	    this._fragmented = 0;
	    this._fragments = [];

	    if (this._opcode === 2) {
	      let data;

	      if (this._binaryType === 'nodebuffer') {
	        data = concat(fragments, messageLength);
	      } else if (this._binaryType === 'arraybuffer') {
	        data = toArrayBuffer(concat(fragments, messageLength));
	      } else if (this._binaryType === 'blob') {
	        data = new Blob(fragments);
	      } else {
	        data = fragments;
	      }

	      if (this._allowSynchronousEvents) {
	        this.emit('message', data, true);
	        this._state = GET_INFO;
	      } else {
	        this._state = DEFER_EVENT;
	        setImmediate(() => {
	          this.emit('message', data, true);
	          this._state = GET_INFO;
	          this.startLoop(cb);
	        });
	      }
	    } else {
	      const buf = concat(fragments, messageLength);

	      if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
	        const error = this.createError(
	          Error,
	          'invalid UTF-8 sequence',
	          true,
	          1007,
	          'WS_ERR_INVALID_UTF8'
	        );

	        cb(error);
	        return;
	      }

	      if (this._state === INFLATING || this._allowSynchronousEvents) {
	        this.emit('message', buf, false);
	        this._state = GET_INFO;
	      } else {
	        this._state = DEFER_EVENT;
	        setImmediate(() => {
	          this.emit('message', buf, false);
	          this._state = GET_INFO;
	          this.startLoop(cb);
	        });
	      }
	    }
	  }

	  /**
	   * Handles a control message.
	   *
	   * @param {Buffer} data Data to handle
	   * @return {(Error|RangeError|undefined)} A possible error
	   * @private
	   */
	  controlMessage(data, cb) {
	    if (this._opcode === 0x08) {
	      if (data.length === 0) {
	        this._loop = false;
	        this.emit('conclude', 1005, EMPTY_BUFFER);
	        this.end();
	      } else {
	        const code = data.readUInt16BE(0);

	        if (!isValidStatusCode(code)) {
	          const error = this.createError(
	            RangeError,
	            `invalid status code ${code}`,
	            true,
	            1002,
	            'WS_ERR_INVALID_CLOSE_CODE'
	          );

	          cb(error);
	          return;
	        }

	        const buf = new FastBuffer(
	          data.buffer,
	          data.byteOffset + 2,
	          data.length - 2
	        );

	        if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
	          const error = this.createError(
	            Error,
	            'invalid UTF-8 sequence',
	            true,
	            1007,
	            'WS_ERR_INVALID_UTF8'
	          );

	          cb(error);
	          return;
	        }

	        this._loop = false;
	        this.emit('conclude', code, buf);
	        this.end();
	      }

	      this._state = GET_INFO;
	      return;
	    }

	    if (this._allowSynchronousEvents) {
	      this.emit(this._opcode === 0x09 ? 'ping' : 'pong', data);
	      this._state = GET_INFO;
	    } else {
	      this._state = DEFER_EVENT;
	      setImmediate(() => {
	        this.emit(this._opcode === 0x09 ? 'ping' : 'pong', data);
	        this._state = GET_INFO;
	        this.startLoop(cb);
	      });
	    }
	  }

	  /**
	   * Builds an error object.
	   *
	   * @param {function(new:Error|RangeError)} ErrorCtor The error constructor
	   * @param {String} message The error message
	   * @param {Boolean} prefix Specifies whether or not to add a default prefix to
	   *     `message`
	   * @param {Number} statusCode The status code
	   * @param {String} errorCode The exposed error code
	   * @return {(Error|RangeError)} The error
	   * @private
	   */
	  createError(ErrorCtor, message, prefix, statusCode, errorCode) {
	    this._loop = false;
	    this._errored = true;

	    const err = new ErrorCtor(
	      prefix ? `Invalid WebSocket frame: ${message}` : message
	    );

	    Error.captureStackTrace(err, this.createError);
	    err.code = errorCode;
	    err[kStatusCode] = statusCode;
	    return err;
	  }
	}

	receiver = Receiver;
	return receiver;
}

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^Duplex" }] */

var sender;
var hasRequiredSender;

function requireSender () {
	if (hasRequiredSender) return sender;
	hasRequiredSender = 1;

	const { Duplex } = require$$0$2;
	const { randomFillSync } = require$$1;

	const PerMessageDeflate = requirePermessageDeflate();
	const { EMPTY_BUFFER, kWebSocket, NOOP } = requireConstants();
	const { isBlob, isValidStatusCode } = requireValidation();
	const { mask: applyMask, toBuffer } = requireBufferUtil();

	const kByteLength = Symbol('kByteLength');
	const maskBuffer = Buffer.alloc(4);
	const RANDOM_POOL_SIZE = 8 * 1024;
	let randomPool;
	let randomPoolPointer = RANDOM_POOL_SIZE;

	const DEFAULT = 0;
	const DEFLATING = 1;
	const GET_BLOB_DATA = 2;

	/**
	 * HyBi Sender implementation.
	 */
	class Sender {
	  /**
	   * Creates a Sender instance.
	   *
	   * @param {Duplex} socket The connection socket
	   * @param {Object} [extensions] An object containing the negotiated extensions
	   * @param {Function} [generateMask] The function used to generate the masking
	   *     key
	   */
	  constructor(socket, extensions, generateMask) {
	    this._extensions = extensions || {};

	    if (generateMask) {
	      this._generateMask = generateMask;
	      this._maskBuffer = Buffer.alloc(4);
	    }

	    this._socket = socket;

	    this._firstFragment = true;
	    this._compress = false;

	    this._bufferedBytes = 0;
	    this._queue = [];
	    this._state = DEFAULT;
	    this.onerror = NOOP;
	    this[kWebSocket] = undefined;
	  }

	  /**
	   * Frames a piece of data according to the HyBi WebSocket protocol.
	   *
	   * @param {(Buffer|String)} data The data to frame
	   * @param {Object} options Options object
	   * @param {Boolean} [options.fin=false] Specifies whether or not to set the
	   *     FIN bit
	   * @param {Function} [options.generateMask] The function used to generate the
	   *     masking key
	   * @param {Boolean} [options.mask=false] Specifies whether or not to mask
	   *     `data`
	   * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
	   *     key
	   * @param {Number} options.opcode The opcode
	   * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
	   *     modified
	   * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
	   *     RSV1 bit
	   * @return {(Buffer|String)[]} The framed data
	   * @public
	   */
	  static frame(data, options) {
	    let mask;
	    let merge = false;
	    let offset = 2;
	    let skipMasking = false;

	    if (options.mask) {
	      mask = options.maskBuffer || maskBuffer;

	      if (options.generateMask) {
	        options.generateMask(mask);
	      } else {
	        if (randomPoolPointer === RANDOM_POOL_SIZE) {
	          /* istanbul ignore else  */
	          if (randomPool === undefined) {
	            //
	            // This is lazily initialized because server-sent frames must not
	            // be masked so it may never be used.
	            //
	            randomPool = Buffer.alloc(RANDOM_POOL_SIZE);
	          }

	          randomFillSync(randomPool, 0, RANDOM_POOL_SIZE);
	          randomPoolPointer = 0;
	        }

	        mask[0] = randomPool[randomPoolPointer++];
	        mask[1] = randomPool[randomPoolPointer++];
	        mask[2] = randomPool[randomPoolPointer++];
	        mask[3] = randomPool[randomPoolPointer++];
	      }

	      skipMasking = (mask[0] | mask[1] | mask[2] | mask[3]) === 0;
	      offset = 6;
	    }

	    let dataLength;

	    if (typeof data === 'string') {
	      if (
	        (!options.mask || skipMasking) &&
	        options[kByteLength] !== undefined
	      ) {
	        dataLength = options[kByteLength];
	      } else {
	        data = Buffer.from(data);
	        dataLength = data.length;
	      }
	    } else {
	      dataLength = data.length;
	      merge = options.mask && options.readOnly && !skipMasking;
	    }

	    let payloadLength = dataLength;

	    if (dataLength >= 65536) {
	      offset += 8;
	      payloadLength = 127;
	    } else if (dataLength > 125) {
	      offset += 2;
	      payloadLength = 126;
	    }

	    const target = Buffer.allocUnsafe(merge ? dataLength + offset : offset);

	    target[0] = options.fin ? options.opcode | 0x80 : options.opcode;
	    if (options.rsv1) target[0] |= 0x40;

	    target[1] = payloadLength;

	    if (payloadLength === 126) {
	      target.writeUInt16BE(dataLength, 2);
	    } else if (payloadLength === 127) {
	      target[2] = target[3] = 0;
	      target.writeUIntBE(dataLength, 4, 6);
	    }

	    if (!options.mask) return [target, data];

	    target[1] |= 0x80;
	    target[offset - 4] = mask[0];
	    target[offset - 3] = mask[1];
	    target[offset - 2] = mask[2];
	    target[offset - 1] = mask[3];

	    if (skipMasking) return [target, data];

	    if (merge) {
	      applyMask(data, mask, target, offset, dataLength);
	      return [target];
	    }

	    applyMask(data, mask, data, 0, dataLength);
	    return [target, data];
	  }

	  /**
	   * Sends a close message to the other peer.
	   *
	   * @param {Number} [code] The status code component of the body
	   * @param {(String|Buffer)} [data] The message component of the body
	   * @param {Boolean} [mask=false] Specifies whether or not to mask the message
	   * @param {Function} [cb] Callback
	   * @public
	   */
	  close(code, data, mask, cb) {
	    let buf;

	    if (code === undefined) {
	      buf = EMPTY_BUFFER;
	    } else if (typeof code !== 'number' || !isValidStatusCode(code)) {
	      throw new TypeError('First argument must be a valid error code number');
	    } else if (data === undefined || !data.length) {
	      buf = Buffer.allocUnsafe(2);
	      buf.writeUInt16BE(code, 0);
	    } else {
	      const length = Buffer.byteLength(data);

	      if (length > 123) {
	        throw new RangeError('The message must not be greater than 123 bytes');
	      }

	      buf = Buffer.allocUnsafe(2 + length);
	      buf.writeUInt16BE(code, 0);

	      if (typeof data === 'string') {
	        buf.write(data, 2);
	      } else {
	        buf.set(data, 2);
	      }
	    }

	    const options = {
	      [kByteLength]: buf.length,
	      fin: true,
	      generateMask: this._generateMask,
	      mask,
	      maskBuffer: this._maskBuffer,
	      opcode: 0x08,
	      readOnly: false,
	      rsv1: false
	    };

	    if (this._state !== DEFAULT) {
	      this.enqueue([this.dispatch, buf, false, options, cb]);
	    } else {
	      this.sendFrame(Sender.frame(buf, options), cb);
	    }
	  }

	  /**
	   * Sends a ping message to the other peer.
	   *
	   * @param {*} data The message to send
	   * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
	   * @param {Function} [cb] Callback
	   * @public
	   */
	  ping(data, mask, cb) {
	    let byteLength;
	    let readOnly;

	    if (typeof data === 'string') {
	      byteLength = Buffer.byteLength(data);
	      readOnly = false;
	    } else if (isBlob(data)) {
	      byteLength = data.size;
	      readOnly = false;
	    } else {
	      data = toBuffer(data);
	      byteLength = data.length;
	      readOnly = toBuffer.readOnly;
	    }

	    if (byteLength > 125) {
	      throw new RangeError('The data size must not be greater than 125 bytes');
	    }

	    const options = {
	      [kByteLength]: byteLength,
	      fin: true,
	      generateMask: this._generateMask,
	      mask,
	      maskBuffer: this._maskBuffer,
	      opcode: 0x09,
	      readOnly,
	      rsv1: false
	    };

	    if (isBlob(data)) {
	      if (this._state !== DEFAULT) {
	        this.enqueue([this.getBlobData, data, false, options, cb]);
	      } else {
	        this.getBlobData(data, false, options, cb);
	      }
	    } else if (this._state !== DEFAULT) {
	      this.enqueue([this.dispatch, data, false, options, cb]);
	    } else {
	      this.sendFrame(Sender.frame(data, options), cb);
	    }
	  }

	  /**
	   * Sends a pong message to the other peer.
	   *
	   * @param {*} data The message to send
	   * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
	   * @param {Function} [cb] Callback
	   * @public
	   */
	  pong(data, mask, cb) {
	    let byteLength;
	    let readOnly;

	    if (typeof data === 'string') {
	      byteLength = Buffer.byteLength(data);
	      readOnly = false;
	    } else if (isBlob(data)) {
	      byteLength = data.size;
	      readOnly = false;
	    } else {
	      data = toBuffer(data);
	      byteLength = data.length;
	      readOnly = toBuffer.readOnly;
	    }

	    if (byteLength > 125) {
	      throw new RangeError('The data size must not be greater than 125 bytes');
	    }

	    const options = {
	      [kByteLength]: byteLength,
	      fin: true,
	      generateMask: this._generateMask,
	      mask,
	      maskBuffer: this._maskBuffer,
	      opcode: 0x0a,
	      readOnly,
	      rsv1: false
	    };

	    if (isBlob(data)) {
	      if (this._state !== DEFAULT) {
	        this.enqueue([this.getBlobData, data, false, options, cb]);
	      } else {
	        this.getBlobData(data, false, options, cb);
	      }
	    } else if (this._state !== DEFAULT) {
	      this.enqueue([this.dispatch, data, false, options, cb]);
	    } else {
	      this.sendFrame(Sender.frame(data, options), cb);
	    }
	  }

	  /**
	   * Sends a data message to the other peer.
	   *
	   * @param {*} data The message to send
	   * @param {Object} options Options object
	   * @param {Boolean} [options.binary=false] Specifies whether `data` is binary
	   *     or text
	   * @param {Boolean} [options.compress=false] Specifies whether or not to
	   *     compress `data`
	   * @param {Boolean} [options.fin=false] Specifies whether the fragment is the
	   *     last one
	   * @param {Boolean} [options.mask=false] Specifies whether or not to mask
	   *     `data`
	   * @param {Function} [cb] Callback
	   * @public
	   */
	  send(data, options, cb) {
	    const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];
	    let opcode = options.binary ? 2 : 1;
	    let rsv1 = options.compress;

	    let byteLength;
	    let readOnly;

	    if (typeof data === 'string') {
	      byteLength = Buffer.byteLength(data);
	      readOnly = false;
	    } else if (isBlob(data)) {
	      byteLength = data.size;
	      readOnly = false;
	    } else {
	      data = toBuffer(data);
	      byteLength = data.length;
	      readOnly = toBuffer.readOnly;
	    }

	    if (this._firstFragment) {
	      this._firstFragment = false;
	      if (
	        rsv1 &&
	        perMessageDeflate &&
	        perMessageDeflate.params[
	          perMessageDeflate._isServer
	            ? 'server_no_context_takeover'
	            : 'client_no_context_takeover'
	        ]
	      ) {
	        rsv1 = byteLength >= perMessageDeflate._threshold;
	      }
	      this._compress = rsv1;
	    } else {
	      rsv1 = false;
	      opcode = 0;
	    }

	    if (options.fin) this._firstFragment = true;

	    const opts = {
	      [kByteLength]: byteLength,
	      fin: options.fin,
	      generateMask: this._generateMask,
	      mask: options.mask,
	      maskBuffer: this._maskBuffer,
	      opcode,
	      readOnly,
	      rsv1
	    };

	    if (isBlob(data)) {
	      if (this._state !== DEFAULT) {
	        this.enqueue([this.getBlobData, data, this._compress, opts, cb]);
	      } else {
	        this.getBlobData(data, this._compress, opts, cb);
	      }
	    } else if (this._state !== DEFAULT) {
	      this.enqueue([this.dispatch, data, this._compress, opts, cb]);
	    } else {
	      this.dispatch(data, this._compress, opts, cb);
	    }
	  }

	  /**
	   * Gets the contents of a blob as binary data.
	   *
	   * @param {Blob} blob The blob
	   * @param {Boolean} [compress=false] Specifies whether or not to compress
	   *     the data
	   * @param {Object} options Options object
	   * @param {Boolean} [options.fin=false] Specifies whether or not to set the
	   *     FIN bit
	   * @param {Function} [options.generateMask] The function used to generate the
	   *     masking key
	   * @param {Boolean} [options.mask=false] Specifies whether or not to mask
	   *     `data`
	   * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
	   *     key
	   * @param {Number} options.opcode The opcode
	   * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
	   *     modified
	   * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
	   *     RSV1 bit
	   * @param {Function} [cb] Callback
	   * @private
	   */
	  getBlobData(blob, compress, options, cb) {
	    this._bufferedBytes += options[kByteLength];
	    this._state = GET_BLOB_DATA;

	    blob
	      .arrayBuffer()
	      .then((arrayBuffer) => {
	        if (this._socket.destroyed) {
	          const err = new Error(
	            'The socket was closed while the blob was being read'
	          );

	          //
	          // `callCallbacks` is called in the next tick to ensure that errors
	          // that might be thrown in the callbacks behave like errors thrown
	          // outside the promise chain.
	          //
	          process.nextTick(callCallbacks, this, err, cb);
	          return;
	        }

	        this._bufferedBytes -= options[kByteLength];
	        const data = toBuffer(arrayBuffer);

	        if (!compress) {
	          this._state = DEFAULT;
	          this.sendFrame(Sender.frame(data, options), cb);
	          this.dequeue();
	        } else {
	          this.dispatch(data, compress, options, cb);
	        }
	      })
	      .catch((err) => {
	        //
	        // `onError` is called in the next tick for the same reason that
	        // `callCallbacks` above is.
	        //
	        process.nextTick(onError, this, err, cb);
	      });
	  }

	  /**
	   * Dispatches a message.
	   *
	   * @param {(Buffer|String)} data The message to send
	   * @param {Boolean} [compress=false] Specifies whether or not to compress
	   *     `data`
	   * @param {Object} options Options object
	   * @param {Boolean} [options.fin=false] Specifies whether or not to set the
	   *     FIN bit
	   * @param {Function} [options.generateMask] The function used to generate the
	   *     masking key
	   * @param {Boolean} [options.mask=false] Specifies whether or not to mask
	   *     `data`
	   * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
	   *     key
	   * @param {Number} options.opcode The opcode
	   * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
	   *     modified
	   * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
	   *     RSV1 bit
	   * @param {Function} [cb] Callback
	   * @private
	   */
	  dispatch(data, compress, options, cb) {
	    if (!compress) {
	      this.sendFrame(Sender.frame(data, options), cb);
	      return;
	    }

	    const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];

	    this._bufferedBytes += options[kByteLength];
	    this._state = DEFLATING;
	    perMessageDeflate.compress(data, options.fin, (_, buf) => {
	      if (this._socket.destroyed) {
	        const err = new Error(
	          'The socket was closed while data was being compressed'
	        );

	        callCallbacks(this, err, cb);
	        return;
	      }

	      this._bufferedBytes -= options[kByteLength];
	      this._state = DEFAULT;
	      options.readOnly = false;
	      this.sendFrame(Sender.frame(buf, options), cb);
	      this.dequeue();
	    });
	  }

	  /**
	   * Executes queued send operations.
	   *
	   * @private
	   */
	  dequeue() {
	    while (this._state === DEFAULT && this._queue.length) {
	      const params = this._queue.shift();

	      this._bufferedBytes -= params[3][kByteLength];
	      Reflect.apply(params[0], this, params.slice(1));
	    }
	  }

	  /**
	   * Enqueues a send operation.
	   *
	   * @param {Array} params Send operation parameters.
	   * @private
	   */
	  enqueue(params) {
	    this._bufferedBytes += params[3][kByteLength];
	    this._queue.push(params);
	  }

	  /**
	   * Sends a frame.
	   *
	   * @param {(Buffer | String)[]} list The frame to send
	   * @param {Function} [cb] Callback
	   * @private
	   */
	  sendFrame(list, cb) {
	    if (list.length === 2) {
	      this._socket.cork();
	      this._socket.write(list[0]);
	      this._socket.write(list[1], cb);
	      this._socket.uncork();
	    } else {
	      this._socket.write(list[0], cb);
	    }
	  }
	}

	sender = Sender;

	/**
	 * Calls queued callbacks with an error.
	 *
	 * @param {Sender} sender The `Sender` instance
	 * @param {Error} err The error to call the callbacks with
	 * @param {Function} [cb] The first callback
	 * @private
	 */
	function callCallbacks(sender, err, cb) {
	  if (typeof cb === 'function') cb(err);

	  for (let i = 0; i < sender._queue.length; i++) {
	    const params = sender._queue[i];
	    const callback = params[params.length - 1];

	    if (typeof callback === 'function') callback(err);
	  }
	}

	/**
	 * Handles a `Sender` error.
	 *
	 * @param {Sender} sender The `Sender` instance
	 * @param {Error} err The error
	 * @param {Function} [cb] The first pending callback
	 * @private
	 */
	function onError(sender, err, cb) {
	  callCallbacks(sender, err, cb);
	  sender.onerror(err);
	}
	return sender;
}

var eventTarget;
var hasRequiredEventTarget;

function requireEventTarget () {
	if (hasRequiredEventTarget) return eventTarget;
	hasRequiredEventTarget = 1;

	const { kForOnEventAttribute, kListener } = requireConstants();

	const kCode = Symbol('kCode');
	const kData = Symbol('kData');
	const kError = Symbol('kError');
	const kMessage = Symbol('kMessage');
	const kReason = Symbol('kReason');
	const kTarget = Symbol('kTarget');
	const kType = Symbol('kType');
	const kWasClean = Symbol('kWasClean');

	/**
	 * Class representing an event.
	 */
	class Event {
	  /**
	   * Create a new `Event`.
	   *
	   * @param {String} type The name of the event
	   * @throws {TypeError} If the `type` argument is not specified
	   */
	  constructor(type) {
	    this[kTarget] = null;
	    this[kType] = type;
	  }

	  /**
	   * @type {*}
	   */
	  get target() {
	    return this[kTarget];
	  }

	  /**
	   * @type {String}
	   */
	  get type() {
	    return this[kType];
	  }
	}

	Object.defineProperty(Event.prototype, 'target', { enumerable: true });
	Object.defineProperty(Event.prototype, 'type', { enumerable: true });

	/**
	 * Class representing a close event.
	 *
	 * @extends Event
	 */
	class CloseEvent extends Event {
	  /**
	   * Create a new `CloseEvent`.
	   *
	   * @param {String} type The name of the event
	   * @param {Object} [options] A dictionary object that allows for setting
	   *     attributes via object members of the same name
	   * @param {Number} [options.code=0] The status code explaining why the
	   *     connection was closed
	   * @param {String} [options.reason=''] A human-readable string explaining why
	   *     the connection was closed
	   * @param {Boolean} [options.wasClean=false] Indicates whether or not the
	   *     connection was cleanly closed
	   */
	  constructor(type, options = {}) {
	    super(type);

	    this[kCode] = options.code === undefined ? 0 : options.code;
	    this[kReason] = options.reason === undefined ? '' : options.reason;
	    this[kWasClean] = options.wasClean === undefined ? false : options.wasClean;
	  }

	  /**
	   * @type {Number}
	   */
	  get code() {
	    return this[kCode];
	  }

	  /**
	   * @type {String}
	   */
	  get reason() {
	    return this[kReason];
	  }

	  /**
	   * @type {Boolean}
	   */
	  get wasClean() {
	    return this[kWasClean];
	  }
	}

	Object.defineProperty(CloseEvent.prototype, 'code', { enumerable: true });
	Object.defineProperty(CloseEvent.prototype, 'reason', { enumerable: true });
	Object.defineProperty(CloseEvent.prototype, 'wasClean', { enumerable: true });

	/**
	 * Class representing an error event.
	 *
	 * @extends Event
	 */
	class ErrorEvent extends Event {
	  /**
	   * Create a new `ErrorEvent`.
	   *
	   * @param {String} type The name of the event
	   * @param {Object} [options] A dictionary object that allows for setting
	   *     attributes via object members of the same name
	   * @param {*} [options.error=null] The error that generated this event
	   * @param {String} [options.message=''] The error message
	   */
	  constructor(type, options = {}) {
	    super(type);

	    this[kError] = options.error === undefined ? null : options.error;
	    this[kMessage] = options.message === undefined ? '' : options.message;
	  }

	  /**
	   * @type {*}
	   */
	  get error() {
	    return this[kError];
	  }

	  /**
	   * @type {String}
	   */
	  get message() {
	    return this[kMessage];
	  }
	}

	Object.defineProperty(ErrorEvent.prototype, 'error', { enumerable: true });
	Object.defineProperty(ErrorEvent.prototype, 'message', { enumerable: true });

	/**
	 * Class representing a message event.
	 *
	 * @extends Event
	 */
	class MessageEvent extends Event {
	  /**
	   * Create a new `MessageEvent`.
	   *
	   * @param {String} type The name of the event
	   * @param {Object} [options] A dictionary object that allows for setting
	   *     attributes via object members of the same name
	   * @param {*} [options.data=null] The message content
	   */
	  constructor(type, options = {}) {
	    super(type);

	    this[kData] = options.data === undefined ? null : options.data;
	  }

	  /**
	   * @type {*}
	   */
	  get data() {
	    return this[kData];
	  }
	}

	Object.defineProperty(MessageEvent.prototype, 'data', { enumerable: true });

	/**
	 * This provides methods for emulating the `EventTarget` interface. It's not
	 * meant to be used directly.
	 *
	 * @mixin
	 */
	const EventTarget = {
	  /**
	   * Register an event listener.
	   *
	   * @param {String} type A string representing the event type to listen for
	   * @param {(Function|Object)} handler The listener to add
	   * @param {Object} [options] An options object specifies characteristics about
	   *     the event listener
	   * @param {Boolean} [options.once=false] A `Boolean` indicating that the
	   *     listener should be invoked at most once after being added. If `true`,
	   *     the listener would be automatically removed when invoked.
	   * @public
	   */
	  addEventListener(type, handler, options = {}) {
	    for (const listener of this.listeners(type)) {
	      if (
	        !options[kForOnEventAttribute] &&
	        listener[kListener] === handler &&
	        !listener[kForOnEventAttribute]
	      ) {
	        return;
	      }
	    }

	    let wrapper;

	    if (type === 'message') {
	      wrapper = function onMessage(data, isBinary) {
	        const event = new MessageEvent('message', {
	          data: isBinary ? data : data.toString()
	        });

	        event[kTarget] = this;
	        callListener(handler, this, event);
	      };
	    } else if (type === 'close') {
	      wrapper = function onClose(code, message) {
	        const event = new CloseEvent('close', {
	          code,
	          reason: message.toString(),
	          wasClean: this._closeFrameReceived && this._closeFrameSent
	        });

	        event[kTarget] = this;
	        callListener(handler, this, event);
	      };
	    } else if (type === 'error') {
	      wrapper = function onError(error) {
	        const event = new ErrorEvent('error', {
	          error,
	          message: error.message
	        });

	        event[kTarget] = this;
	        callListener(handler, this, event);
	      };
	    } else if (type === 'open') {
	      wrapper = function onOpen() {
	        const event = new Event('open');

	        event[kTarget] = this;
	        callListener(handler, this, event);
	      };
	    } else {
	      return;
	    }

	    wrapper[kForOnEventAttribute] = !!options[kForOnEventAttribute];
	    wrapper[kListener] = handler;

	    if (options.once) {
	      this.once(type, wrapper);
	    } else {
	      this.on(type, wrapper);
	    }
	  },

	  /**
	   * Remove an event listener.
	   *
	   * @param {String} type A string representing the event type to remove
	   * @param {(Function|Object)} handler The listener to remove
	   * @public
	   */
	  removeEventListener(type, handler) {
	    for (const listener of this.listeners(type)) {
	      if (listener[kListener] === handler && !listener[kForOnEventAttribute]) {
	        this.removeListener(type, listener);
	        break;
	      }
	    }
	  }
	};

	eventTarget = {
	  CloseEvent,
	  ErrorEvent,
	  Event,
	  EventTarget,
	  MessageEvent
	};

	/**
	 * Call an event listener
	 *
	 * @param {(Function|Object)} listener The listener to call
	 * @param {*} thisArg The value to use as `this`` when calling the listener
	 * @param {Event} event The event to pass to the listener
	 * @private
	 */
	function callListener(listener, thisArg, event) {
	  if (typeof listener === 'object' && listener.handleEvent) {
	    listener.handleEvent.call(listener, event);
	  } else {
	    listener.call(thisArg, event);
	  }
	}
	return eventTarget;
}

var extension;
var hasRequiredExtension;

function requireExtension () {
	if (hasRequiredExtension) return extension;
	hasRequiredExtension = 1;

	const { tokenChars } = requireValidation();

	/**
	 * Adds an offer to the map of extension offers or a parameter to the map of
	 * parameters.
	 *
	 * @param {Object} dest The map of extension offers or parameters
	 * @param {String} name The extension or parameter name
	 * @param {(Object|Boolean|String)} elem The extension parameters or the
	 *     parameter value
	 * @private
	 */
	function push(dest, name, elem) {
	  if (dest[name] === undefined) dest[name] = [elem];
	  else dest[name].push(elem);
	}

	/**
	 * Parses the `Sec-WebSocket-Extensions` header into an object.
	 *
	 * @param {String} header The field value of the header
	 * @return {Object} The parsed object
	 * @public
	 */
	function parse(header) {
	  const offers = Object.create(null);
	  let params = Object.create(null);
	  let mustUnescape = false;
	  let isEscaping = false;
	  let inQuotes = false;
	  let extensionName;
	  let paramName;
	  let start = -1;
	  let code = -1;
	  let end = -1;
	  let i = 0;

	  for (; i < header.length; i++) {
	    code = header.charCodeAt(i);

	    if (extensionName === undefined) {
	      if (end === -1 && tokenChars[code] === 1) {
	        if (start === -1) start = i;
	      } else if (
	        i !== 0 &&
	        (code === 0x20 /* ' ' */ || code === 0x09) /* '\t' */
	      ) {
	        if (end === -1 && start !== -1) end = i;
	      } else if (code === 0x3b /* ';' */ || code === 0x2c /* ',' */) {
	        if (start === -1) {
	          throw new SyntaxError(`Unexpected character at index ${i}`);
	        }

	        if (end === -1) end = i;
	        const name = header.slice(start, end);
	        if (code === 0x2c) {
	          push(offers, name, params);
	          params = Object.create(null);
	        } else {
	          extensionName = name;
	        }

	        start = end = -1;
	      } else {
	        throw new SyntaxError(`Unexpected character at index ${i}`);
	      }
	    } else if (paramName === undefined) {
	      if (end === -1 && tokenChars[code] === 1) {
	        if (start === -1) start = i;
	      } else if (code === 0x20 || code === 0x09) {
	        if (end === -1 && start !== -1) end = i;
	      } else if (code === 0x3b || code === 0x2c) {
	        if (start === -1) {
	          throw new SyntaxError(`Unexpected character at index ${i}`);
	        }

	        if (end === -1) end = i;
	        push(params, header.slice(start, end), true);
	        if (code === 0x2c) {
	          push(offers, extensionName, params);
	          params = Object.create(null);
	          extensionName = undefined;
	        }

	        start = end = -1;
	      } else if (code === 0x3d /* '=' */ && start !== -1 && end === -1) {
	        paramName = header.slice(start, i);
	        start = end = -1;
	      } else {
	        throw new SyntaxError(`Unexpected character at index ${i}`);
	      }
	    } else {
	      //
	      // The value of a quoted-string after unescaping must conform to the
	      // token ABNF, so only token characters are valid.
	      // Ref: https://tools.ietf.org/html/rfc6455#section-9.1
	      //
	      if (isEscaping) {
	        if (tokenChars[code] !== 1) {
	          throw new SyntaxError(`Unexpected character at index ${i}`);
	        }
	        if (start === -1) start = i;
	        else if (!mustUnescape) mustUnescape = true;
	        isEscaping = false;
	      } else if (inQuotes) {
	        if (tokenChars[code] === 1) {
	          if (start === -1) start = i;
	        } else if (code === 0x22 /* '"' */ && start !== -1) {
	          inQuotes = false;
	          end = i;
	        } else if (code === 0x5c /* '\' */) {
	          isEscaping = true;
	        } else {
	          throw new SyntaxError(`Unexpected character at index ${i}`);
	        }
	      } else if (code === 0x22 && header.charCodeAt(i - 1) === 0x3d) {
	        inQuotes = true;
	      } else if (end === -1 && tokenChars[code] === 1) {
	        if (start === -1) start = i;
	      } else if (start !== -1 && (code === 0x20 || code === 0x09)) {
	        if (end === -1) end = i;
	      } else if (code === 0x3b || code === 0x2c) {
	        if (start === -1) {
	          throw new SyntaxError(`Unexpected character at index ${i}`);
	        }

	        if (end === -1) end = i;
	        let value = header.slice(start, end);
	        if (mustUnescape) {
	          value = value.replace(/\\/g, '');
	          mustUnescape = false;
	        }
	        push(params, paramName, value);
	        if (code === 0x2c) {
	          push(offers, extensionName, params);
	          params = Object.create(null);
	          extensionName = undefined;
	        }

	        paramName = undefined;
	        start = end = -1;
	      } else {
	        throw new SyntaxError(`Unexpected character at index ${i}`);
	      }
	    }
	  }

	  if (start === -1 || inQuotes || code === 0x20 || code === 0x09) {
	    throw new SyntaxError('Unexpected end of input');
	  }

	  if (end === -1) end = i;
	  const token = header.slice(start, end);
	  if (extensionName === undefined) {
	    push(offers, token, params);
	  } else {
	    if (paramName === undefined) {
	      push(params, token, true);
	    } else if (mustUnescape) {
	      push(params, paramName, token.replace(/\\/g, ''));
	    } else {
	      push(params, paramName, token);
	    }
	    push(offers, extensionName, params);
	  }

	  return offers;
	}

	/**
	 * Builds the `Sec-WebSocket-Extensions` header field value.
	 *
	 * @param {Object} extensions The map of extensions and parameters to format
	 * @return {String} A string representing the given object
	 * @public
	 */
	function format(extensions) {
	  return Object.keys(extensions)
	    .map((extension) => {
	      let configurations = extensions[extension];
	      if (!Array.isArray(configurations)) configurations = [configurations];
	      return configurations
	        .map((params) => {
	          return [extension]
	            .concat(
	              Object.keys(params).map((k) => {
	                let values = params[k];
	                if (!Array.isArray(values)) values = [values];
	                return values
	                  .map((v) => (v === true ? k : `${k}=${v}`))
	                  .join('; ');
	              })
	            )
	            .join('; ');
	        })
	        .join(', ');
	    })
	    .join(', ');
	}

	extension = { format, parse };
	return extension;
}

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^Duplex|Readable$", "caughtErrors": "none" }] */

var websocket;
var hasRequiredWebsocket;

function requireWebsocket () {
	if (hasRequiredWebsocket) return websocket;
	hasRequiredWebsocket = 1;

	const EventEmitter = require$$0$3;
	const https = require$$1$1;
	const http = require$$2;
	const net$1 = net;
	const tls = require$$4;
	const { randomBytes, createHash } = require$$1;
	const { Duplex, Readable } = require$$0$2;
	const { URL } = require$$7;

	const PerMessageDeflate = requirePermessageDeflate();
	const Receiver = requireReceiver();
	const Sender = requireSender();
	const { isBlob } = requireValidation();

	const {
	  BINARY_TYPES,
	  EMPTY_BUFFER,
	  GUID,
	  kForOnEventAttribute,
	  kListener,
	  kStatusCode,
	  kWebSocket,
	  NOOP
	} = requireConstants();
	const {
	  EventTarget: { addEventListener, removeEventListener }
	} = requireEventTarget();
	const { format, parse } = requireExtension();
	const { toBuffer } = requireBufferUtil();

	const closeTimeout = 30 * 1000;
	const kAborted = Symbol('kAborted');
	const protocolVersions = [8, 13];
	const readyStates = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'];
	const subprotocolRegex = /^[!#$%&'*+\-.0-9A-Z^_`|a-z~]+$/;

	/**
	 * Class representing a WebSocket.
	 *
	 * @extends EventEmitter
	 */
	class WebSocket extends EventEmitter {
	  /**
	   * Create a new `WebSocket`.
	   *
	   * @param {(String|URL)} address The URL to which to connect
	   * @param {(String|String[])} [protocols] The subprotocols
	   * @param {Object} [options] Connection options
	   */
	  constructor(address, protocols, options) {
	    super();

	    this._binaryType = BINARY_TYPES[0];
	    this._closeCode = 1006;
	    this._closeFrameReceived = false;
	    this._closeFrameSent = false;
	    this._closeMessage = EMPTY_BUFFER;
	    this._closeTimer = null;
	    this._errorEmitted = false;
	    this._extensions = {};
	    this._paused = false;
	    this._protocol = '';
	    this._readyState = WebSocket.CONNECTING;
	    this._receiver = null;
	    this._sender = null;
	    this._socket = null;

	    if (address !== null) {
	      this._bufferedAmount = 0;
	      this._isServer = false;
	      this._redirects = 0;

	      if (protocols === undefined) {
	        protocols = [];
	      } else if (!Array.isArray(protocols)) {
	        if (typeof protocols === 'object' && protocols !== null) {
	          options = protocols;
	          protocols = [];
	        } else {
	          protocols = [protocols];
	        }
	      }

	      initAsClient(this, address, protocols, options);
	    } else {
	      this._autoPong = options.autoPong;
	      this._isServer = true;
	    }
	  }

	  /**
	   * For historical reasons, the custom "nodebuffer" type is used by the default
	   * instead of "blob".
	   *
	   * @type {String}
	   */
	  get binaryType() {
	    return this._binaryType;
	  }

	  set binaryType(type) {
	    if (!BINARY_TYPES.includes(type)) return;

	    this._binaryType = type;

	    //
	    // Allow to change `binaryType` on the fly.
	    //
	    if (this._receiver) this._receiver._binaryType = type;
	  }

	  /**
	   * @type {Number}
	   */
	  get bufferedAmount() {
	    if (!this._socket) return this._bufferedAmount;

	    return this._socket._writableState.length + this._sender._bufferedBytes;
	  }

	  /**
	   * @type {String}
	   */
	  get extensions() {
	    return Object.keys(this._extensions).join();
	  }

	  /**
	   * @type {Boolean}
	   */
	  get isPaused() {
	    return this._paused;
	  }

	  /**
	   * @type {Function}
	   */
	  /* istanbul ignore next */
	  get onclose() {
	    return null;
	  }

	  /**
	   * @type {Function}
	   */
	  /* istanbul ignore next */
	  get onerror() {
	    return null;
	  }

	  /**
	   * @type {Function}
	   */
	  /* istanbul ignore next */
	  get onopen() {
	    return null;
	  }

	  /**
	   * @type {Function}
	   */
	  /* istanbul ignore next */
	  get onmessage() {
	    return null;
	  }

	  /**
	   * @type {String}
	   */
	  get protocol() {
	    return this._protocol;
	  }

	  /**
	   * @type {Number}
	   */
	  get readyState() {
	    return this._readyState;
	  }

	  /**
	   * @type {String}
	   */
	  get url() {
	    return this._url;
	  }

	  /**
	   * Set up the socket and the internal resources.
	   *
	   * @param {Duplex} socket The network socket between the server and client
	   * @param {Buffer} head The first packet of the upgraded stream
	   * @param {Object} options Options object
	   * @param {Boolean} [options.allowSynchronousEvents=false] Specifies whether
	   *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
	   *     multiple times in the same tick
	   * @param {Function} [options.generateMask] The function used to generate the
	   *     masking key
	   * @param {Number} [options.maxPayload=0] The maximum allowed message size
	   * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
	   *     not to skip UTF-8 validation for text and close messages
	   * @private
	   */
	  setSocket(socket, head, options) {
	    const receiver = new Receiver({
	      allowSynchronousEvents: options.allowSynchronousEvents,
	      binaryType: this.binaryType,
	      extensions: this._extensions,
	      isServer: this._isServer,
	      maxPayload: options.maxPayload,
	      skipUTF8Validation: options.skipUTF8Validation
	    });

	    const sender = new Sender(socket, this._extensions, options.generateMask);

	    this._receiver = receiver;
	    this._sender = sender;
	    this._socket = socket;

	    receiver[kWebSocket] = this;
	    sender[kWebSocket] = this;
	    socket[kWebSocket] = this;

	    receiver.on('conclude', receiverOnConclude);
	    receiver.on('drain', receiverOnDrain);
	    receiver.on('error', receiverOnError);
	    receiver.on('message', receiverOnMessage);
	    receiver.on('ping', receiverOnPing);
	    receiver.on('pong', receiverOnPong);

	    sender.onerror = senderOnError;

	    //
	    // These methods may not be available if `socket` is just a `Duplex`.
	    //
	    if (socket.setTimeout) socket.setTimeout(0);
	    if (socket.setNoDelay) socket.setNoDelay();

	    if (head.length > 0) socket.unshift(head);

	    socket.on('close', socketOnClose);
	    socket.on('data', socketOnData);
	    socket.on('end', socketOnEnd);
	    socket.on('error', socketOnError);

	    this._readyState = WebSocket.OPEN;
	    this.emit('open');
	  }

	  /**
	   * Emit the `'close'` event.
	   *
	   * @private
	   */
	  emitClose() {
	    if (!this._socket) {
	      this._readyState = WebSocket.CLOSED;
	      this.emit('close', this._closeCode, this._closeMessage);
	      return;
	    }

	    if (this._extensions[PerMessageDeflate.extensionName]) {
	      this._extensions[PerMessageDeflate.extensionName].cleanup();
	    }

	    this._receiver.removeAllListeners();
	    this._readyState = WebSocket.CLOSED;
	    this.emit('close', this._closeCode, this._closeMessage);
	  }

	  /**
	   * Start a closing handshake.
	   *
	   *          +----------+   +-----------+   +----------+
	   *     - - -|ws.close()|-->|close frame|-->|ws.close()|- - -
	   *    |     +----------+   +-----------+   +----------+     |
	   *          +----------+   +-----------+         |
	   * CLOSING  |ws.close()|<--|close frame|<--+-----+       CLOSING
	   *          +----------+   +-----------+   |
	   *    |           |                        |   +---+        |
	   *                +------------------------+-->|fin| - - - -
	   *    |         +---+                      |   +---+
	   *     - - - - -|fin|<---------------------+
	   *              +---+
	   *
	   * @param {Number} [code] Status code explaining why the connection is closing
	   * @param {(String|Buffer)} [data] The reason why the connection is
	   *     closing
	   * @public
	   */
	  close(code, data) {
	    if (this.readyState === WebSocket.CLOSED) return;
	    if (this.readyState === WebSocket.CONNECTING) {
	      const msg = 'WebSocket was closed before the connection was established';
	      abortHandshake(this, this._req, msg);
	      return;
	    }

	    if (this.readyState === WebSocket.CLOSING) {
	      if (
	        this._closeFrameSent &&
	        (this._closeFrameReceived || this._receiver._writableState.errorEmitted)
	      ) {
	        this._socket.end();
	      }

	      return;
	    }

	    this._readyState = WebSocket.CLOSING;
	    this._sender.close(code, data, !this._isServer, (err) => {
	      //
	      // This error is handled by the `'error'` listener on the socket. We only
	      // want to know if the close frame has been sent here.
	      //
	      if (err) return;

	      this._closeFrameSent = true;

	      if (
	        this._closeFrameReceived ||
	        this._receiver._writableState.errorEmitted
	      ) {
	        this._socket.end();
	      }
	    });

	    setCloseTimer(this);
	  }

	  /**
	   * Pause the socket.
	   *
	   * @public
	   */
	  pause() {
	    if (
	      this.readyState === WebSocket.CONNECTING ||
	      this.readyState === WebSocket.CLOSED
	    ) {
	      return;
	    }

	    this._paused = true;
	    this._socket.pause();
	  }

	  /**
	   * Send a ping.
	   *
	   * @param {*} [data] The data to send
	   * @param {Boolean} [mask] Indicates whether or not to mask `data`
	   * @param {Function} [cb] Callback which is executed when the ping is sent
	   * @public
	   */
	  ping(data, mask, cb) {
	    if (this.readyState === WebSocket.CONNECTING) {
	      throw new Error('WebSocket is not open: readyState 0 (CONNECTING)');
	    }

	    if (typeof data === 'function') {
	      cb = data;
	      data = mask = undefined;
	    } else if (typeof mask === 'function') {
	      cb = mask;
	      mask = undefined;
	    }

	    if (typeof data === 'number') data = data.toString();

	    if (this.readyState !== WebSocket.OPEN) {
	      sendAfterClose(this, data, cb);
	      return;
	    }

	    if (mask === undefined) mask = !this._isServer;
	    this._sender.ping(data || EMPTY_BUFFER, mask, cb);
	  }

	  /**
	   * Send a pong.
	   *
	   * @param {*} [data] The data to send
	   * @param {Boolean} [mask] Indicates whether or not to mask `data`
	   * @param {Function} [cb] Callback which is executed when the pong is sent
	   * @public
	   */
	  pong(data, mask, cb) {
	    if (this.readyState === WebSocket.CONNECTING) {
	      throw new Error('WebSocket is not open: readyState 0 (CONNECTING)');
	    }

	    if (typeof data === 'function') {
	      cb = data;
	      data = mask = undefined;
	    } else if (typeof mask === 'function') {
	      cb = mask;
	      mask = undefined;
	    }

	    if (typeof data === 'number') data = data.toString();

	    if (this.readyState !== WebSocket.OPEN) {
	      sendAfterClose(this, data, cb);
	      return;
	    }

	    if (mask === undefined) mask = !this._isServer;
	    this._sender.pong(data || EMPTY_BUFFER, mask, cb);
	  }

	  /**
	   * Resume the socket.
	   *
	   * @public
	   */
	  resume() {
	    if (
	      this.readyState === WebSocket.CONNECTING ||
	      this.readyState === WebSocket.CLOSED
	    ) {
	      return;
	    }

	    this._paused = false;
	    if (!this._receiver._writableState.needDrain) this._socket.resume();
	  }

	  /**
	   * Send a data message.
	   *
	   * @param {*} data The message to send
	   * @param {Object} [options] Options object
	   * @param {Boolean} [options.binary] Specifies whether `data` is binary or
	   *     text
	   * @param {Boolean} [options.compress] Specifies whether or not to compress
	   *     `data`
	   * @param {Boolean} [options.fin=true] Specifies whether the fragment is the
	   *     last one
	   * @param {Boolean} [options.mask] Specifies whether or not to mask `data`
	   * @param {Function} [cb] Callback which is executed when data is written out
	   * @public
	   */
	  send(data, options, cb) {
	    if (this.readyState === WebSocket.CONNECTING) {
	      throw new Error('WebSocket is not open: readyState 0 (CONNECTING)');
	    }

	    if (typeof options === 'function') {
	      cb = options;
	      options = {};
	    }

	    if (typeof data === 'number') data = data.toString();

	    if (this.readyState !== WebSocket.OPEN) {
	      sendAfterClose(this, data, cb);
	      return;
	    }

	    const opts = {
	      binary: typeof data !== 'string',
	      mask: !this._isServer,
	      compress: true,
	      fin: true,
	      ...options
	    };

	    if (!this._extensions[PerMessageDeflate.extensionName]) {
	      opts.compress = false;
	    }

	    this._sender.send(data || EMPTY_BUFFER, opts, cb);
	  }

	  /**
	   * Forcibly close the connection.
	   *
	   * @public
	   */
	  terminate() {
	    if (this.readyState === WebSocket.CLOSED) return;
	    if (this.readyState === WebSocket.CONNECTING) {
	      const msg = 'WebSocket was closed before the connection was established';
	      abortHandshake(this, this._req, msg);
	      return;
	    }

	    if (this._socket) {
	      this._readyState = WebSocket.CLOSING;
	      this._socket.destroy();
	    }
	  }
	}

	/**
	 * @constant {Number} CONNECTING
	 * @memberof WebSocket
	 */
	Object.defineProperty(WebSocket, 'CONNECTING', {
	  enumerable: true,
	  value: readyStates.indexOf('CONNECTING')
	});

	/**
	 * @constant {Number} CONNECTING
	 * @memberof WebSocket.prototype
	 */
	Object.defineProperty(WebSocket.prototype, 'CONNECTING', {
	  enumerable: true,
	  value: readyStates.indexOf('CONNECTING')
	});

	/**
	 * @constant {Number} OPEN
	 * @memberof WebSocket
	 */
	Object.defineProperty(WebSocket, 'OPEN', {
	  enumerable: true,
	  value: readyStates.indexOf('OPEN')
	});

	/**
	 * @constant {Number} OPEN
	 * @memberof WebSocket.prototype
	 */
	Object.defineProperty(WebSocket.prototype, 'OPEN', {
	  enumerable: true,
	  value: readyStates.indexOf('OPEN')
	});

	/**
	 * @constant {Number} CLOSING
	 * @memberof WebSocket
	 */
	Object.defineProperty(WebSocket, 'CLOSING', {
	  enumerable: true,
	  value: readyStates.indexOf('CLOSING')
	});

	/**
	 * @constant {Number} CLOSING
	 * @memberof WebSocket.prototype
	 */
	Object.defineProperty(WebSocket.prototype, 'CLOSING', {
	  enumerable: true,
	  value: readyStates.indexOf('CLOSING')
	});

	/**
	 * @constant {Number} CLOSED
	 * @memberof WebSocket
	 */
	Object.defineProperty(WebSocket, 'CLOSED', {
	  enumerable: true,
	  value: readyStates.indexOf('CLOSED')
	});

	/**
	 * @constant {Number} CLOSED
	 * @memberof WebSocket.prototype
	 */
	Object.defineProperty(WebSocket.prototype, 'CLOSED', {
	  enumerable: true,
	  value: readyStates.indexOf('CLOSED')
	});

	[
	  'binaryType',
	  'bufferedAmount',
	  'extensions',
	  'isPaused',
	  'protocol',
	  'readyState',
	  'url'
	].forEach((property) => {
	  Object.defineProperty(WebSocket.prototype, property, { enumerable: true });
	});

	//
	// Add the `onopen`, `onerror`, `onclose`, and `onmessage` attributes.
	// See https://html.spec.whatwg.org/multipage/comms.html#the-websocket-interface
	//
	['open', 'error', 'close', 'message'].forEach((method) => {
	  Object.defineProperty(WebSocket.prototype, `on${method}`, {
	    enumerable: true,
	    get() {
	      for (const listener of this.listeners(method)) {
	        if (listener[kForOnEventAttribute]) return listener[kListener];
	      }

	      return null;
	    },
	    set(handler) {
	      for (const listener of this.listeners(method)) {
	        if (listener[kForOnEventAttribute]) {
	          this.removeListener(method, listener);
	          break;
	        }
	      }

	      if (typeof handler !== 'function') return;

	      this.addEventListener(method, handler, {
	        [kForOnEventAttribute]: true
	      });
	    }
	  });
	});

	WebSocket.prototype.addEventListener = addEventListener;
	WebSocket.prototype.removeEventListener = removeEventListener;

	websocket = WebSocket;

	/**
	 * Initialize a WebSocket client.
	 *
	 * @param {WebSocket} websocket The client to initialize
	 * @param {(String|URL)} address The URL to which to connect
	 * @param {Array} protocols The subprotocols
	 * @param {Object} [options] Connection options
	 * @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether any
	 *     of the `'message'`, `'ping'`, and `'pong'` events can be emitted multiple
	 *     times in the same tick
	 * @param {Boolean} [options.autoPong=true] Specifies whether or not to
	 *     automatically send a pong in response to a ping
	 * @param {Function} [options.finishRequest] A function which can be used to
	 *     customize the headers of each http request before it is sent
	 * @param {Boolean} [options.followRedirects=false] Whether or not to follow
	 *     redirects
	 * @param {Function} [options.generateMask] The function used to generate the
	 *     masking key
	 * @param {Number} [options.handshakeTimeout] Timeout in milliseconds for the
	 *     handshake request
	 * @param {Number} [options.maxPayload=104857600] The maximum allowed message
	 *     size
	 * @param {Number} [options.maxRedirects=10] The maximum number of redirects
	 *     allowed
	 * @param {String} [options.origin] Value of the `Origin` or
	 *     `Sec-WebSocket-Origin` header
	 * @param {(Boolean|Object)} [options.perMessageDeflate=true] Enable/disable
	 *     permessage-deflate
	 * @param {Number} [options.protocolVersion=13] Value of the
	 *     `Sec-WebSocket-Version` header
	 * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
	 *     not to skip UTF-8 validation for text and close messages
	 * @private
	 */
	function initAsClient(websocket, address, protocols, options) {
	  const opts = {
	    allowSynchronousEvents: true,
	    autoPong: true,
	    protocolVersion: protocolVersions[1],
	    maxPayload: 100 * 1024 * 1024,
	    skipUTF8Validation: false,
	    perMessageDeflate: true,
	    followRedirects: false,
	    maxRedirects: 10,
	    ...options,
	    socketPath: undefined,
	    hostname: undefined,
	    protocol: undefined,
	    timeout: undefined,
	    method: 'GET',
	    host: undefined,
	    path: undefined,
	    port: undefined
	  };

	  websocket._autoPong = opts.autoPong;

	  if (!protocolVersions.includes(opts.protocolVersion)) {
	    throw new RangeError(
	      `Unsupported protocol version: ${opts.protocolVersion} ` +
	        `(supported versions: ${protocolVersions.join(', ')})`
	    );
	  }

	  let parsedUrl;

	  if (address instanceof URL) {
	    parsedUrl = address;
	  } else {
	    try {
	      parsedUrl = new URL(address);
	    } catch (e) {
	      throw new SyntaxError(`Invalid URL: ${address}`);
	    }
	  }

	  if (parsedUrl.protocol === 'http:') {
	    parsedUrl.protocol = 'ws:';
	  } else if (parsedUrl.protocol === 'https:') {
	    parsedUrl.protocol = 'wss:';
	  }

	  websocket._url = parsedUrl.href;

	  const isSecure = parsedUrl.protocol === 'wss:';
	  const isIpcUrl = parsedUrl.protocol === 'ws+unix:';
	  let invalidUrlMessage;

	  if (parsedUrl.protocol !== 'ws:' && !isSecure && !isIpcUrl) {
	    invalidUrlMessage =
	      'The URL\'s protocol must be one of "ws:", "wss:", ' +
	      '"http:", "https:", or "ws+unix:"';
	  } else if (isIpcUrl && !parsedUrl.pathname) {
	    invalidUrlMessage = "The URL's pathname is empty";
	  } else if (parsedUrl.hash) {
	    invalidUrlMessage = 'The URL contains a fragment identifier';
	  }

	  if (invalidUrlMessage) {
	    const err = new SyntaxError(invalidUrlMessage);

	    if (websocket._redirects === 0) {
	      throw err;
	    } else {
	      emitErrorAndClose(websocket, err);
	      return;
	    }
	  }

	  const defaultPort = isSecure ? 443 : 80;
	  const key = randomBytes(16).toString('base64');
	  const request = isSecure ? https.request : http.request;
	  const protocolSet = new Set();
	  let perMessageDeflate;

	  opts.createConnection =
	    opts.createConnection || (isSecure ? tlsConnect : netConnect);
	  opts.defaultPort = opts.defaultPort || defaultPort;
	  opts.port = parsedUrl.port || defaultPort;
	  opts.host = parsedUrl.hostname.startsWith('[')
	    ? parsedUrl.hostname.slice(1, -1)
	    : parsedUrl.hostname;
	  opts.headers = {
	    ...opts.headers,
	    'Sec-WebSocket-Version': opts.protocolVersion,
	    'Sec-WebSocket-Key': key,
	    Connection: 'Upgrade',
	    Upgrade: 'websocket'
	  };
	  opts.path = parsedUrl.pathname + parsedUrl.search;
	  opts.timeout = opts.handshakeTimeout;

	  if (opts.perMessageDeflate) {
	    perMessageDeflate = new PerMessageDeflate(
	      opts.perMessageDeflate !== true ? opts.perMessageDeflate : {},
	      false,
	      opts.maxPayload
	    );
	    opts.headers['Sec-WebSocket-Extensions'] = format({
	      [PerMessageDeflate.extensionName]: perMessageDeflate.offer()
	    });
	  }
	  if (protocols.length) {
	    for (const protocol of protocols) {
	      if (
	        typeof protocol !== 'string' ||
	        !subprotocolRegex.test(protocol) ||
	        protocolSet.has(protocol)
	      ) {
	        throw new SyntaxError(
	          'An invalid or duplicated subprotocol was specified'
	        );
	      }

	      protocolSet.add(protocol);
	    }

	    opts.headers['Sec-WebSocket-Protocol'] = protocols.join(',');
	  }
	  if (opts.origin) {
	    if (opts.protocolVersion < 13) {
	      opts.headers['Sec-WebSocket-Origin'] = opts.origin;
	    } else {
	      opts.headers.Origin = opts.origin;
	    }
	  }
	  if (parsedUrl.username || parsedUrl.password) {
	    opts.auth = `${parsedUrl.username}:${parsedUrl.password}`;
	  }

	  if (isIpcUrl) {
	    const parts = opts.path.split(':');

	    opts.socketPath = parts[0];
	    opts.path = parts[1];
	  }

	  let req;

	  if (opts.followRedirects) {
	    if (websocket._redirects === 0) {
	      websocket._originalIpc = isIpcUrl;
	      websocket._originalSecure = isSecure;
	      websocket._originalHostOrSocketPath = isIpcUrl
	        ? opts.socketPath
	        : parsedUrl.host;

	      const headers = options && options.headers;

	      //
	      // Shallow copy the user provided options so that headers can be changed
	      // without mutating the original object.
	      //
	      options = { ...options, headers: {} };

	      if (headers) {
	        for (const [key, value] of Object.entries(headers)) {
	          options.headers[key.toLowerCase()] = value;
	        }
	      }
	    } else if (websocket.listenerCount('redirect') === 0) {
	      const isSameHost = isIpcUrl
	        ? websocket._originalIpc
	          ? opts.socketPath === websocket._originalHostOrSocketPath
	          : false
	        : websocket._originalIpc
	          ? false
	          : parsedUrl.host === websocket._originalHostOrSocketPath;

	      if (!isSameHost || (websocket._originalSecure && !isSecure)) {
	        //
	        // Match curl 7.77.0 behavior and drop the following headers. These
	        // headers are also dropped when following a redirect to a subdomain.
	        //
	        delete opts.headers.authorization;
	        delete opts.headers.cookie;

	        if (!isSameHost) delete opts.headers.host;

	        opts.auth = undefined;
	      }
	    }

	    //
	    // Match curl 7.77.0 behavior and make the first `Authorization` header win.
	    // If the `Authorization` header is set, then there is nothing to do as it
	    // will take precedence.
	    //
	    if (opts.auth && !options.headers.authorization) {
	      options.headers.authorization =
	        'Basic ' + Buffer.from(opts.auth).toString('base64');
	    }

	    req = websocket._req = request(opts);

	    if (websocket._redirects) {
	      //
	      // Unlike what is done for the `'upgrade'` event, no early exit is
	      // triggered here if the user calls `websocket.close()` or
	      // `websocket.terminate()` from a listener of the `'redirect'` event. This
	      // is because the user can also call `request.destroy()` with an error
	      // before calling `websocket.close()` or `websocket.terminate()` and this
	      // would result in an error being emitted on the `request` object with no
	      // `'error'` event listeners attached.
	      //
	      websocket.emit('redirect', websocket.url, req);
	    }
	  } else {
	    req = websocket._req = request(opts);
	  }

	  if (opts.timeout) {
	    req.on('timeout', () => {
	      abortHandshake(websocket, req, 'Opening handshake has timed out');
	    });
	  }

	  req.on('error', (err) => {
	    if (req === null || req[kAborted]) return;

	    req = websocket._req = null;
	    emitErrorAndClose(websocket, err);
	  });

	  req.on('response', (res) => {
	    const location = res.headers.location;
	    const statusCode = res.statusCode;

	    if (
	      location &&
	      opts.followRedirects &&
	      statusCode >= 300 &&
	      statusCode < 400
	    ) {
	      if (++websocket._redirects > opts.maxRedirects) {
	        abortHandshake(websocket, req, 'Maximum redirects exceeded');
	        return;
	      }

	      req.abort();

	      let addr;

	      try {
	        addr = new URL(location, address);
	      } catch (e) {
	        const err = new SyntaxError(`Invalid URL: ${location}`);
	        emitErrorAndClose(websocket, err);
	        return;
	      }

	      initAsClient(websocket, addr, protocols, options);
	    } else if (!websocket.emit('unexpected-response', req, res)) {
	      abortHandshake(
	        websocket,
	        req,
	        `Unexpected server response: ${res.statusCode}`
	      );
	    }
	  });

	  req.on('upgrade', (res, socket, head) => {
	    websocket.emit('upgrade', res);

	    //
	    // The user may have closed the connection from a listener of the
	    // `'upgrade'` event.
	    //
	    if (websocket.readyState !== WebSocket.CONNECTING) return;

	    req = websocket._req = null;

	    const upgrade = res.headers.upgrade;

	    if (upgrade === undefined || upgrade.toLowerCase() !== 'websocket') {
	      abortHandshake(websocket, socket, 'Invalid Upgrade header');
	      return;
	    }

	    const digest = createHash('sha1')
	      .update(key + GUID)
	      .digest('base64');

	    if (res.headers['sec-websocket-accept'] !== digest) {
	      abortHandshake(websocket, socket, 'Invalid Sec-WebSocket-Accept header');
	      return;
	    }

	    const serverProt = res.headers['sec-websocket-protocol'];
	    let protError;

	    if (serverProt !== undefined) {
	      if (!protocolSet.size) {
	        protError = 'Server sent a subprotocol but none was requested';
	      } else if (!protocolSet.has(serverProt)) {
	        protError = 'Server sent an invalid subprotocol';
	      }
	    } else if (protocolSet.size) {
	      protError = 'Server sent no subprotocol';
	    }

	    if (protError) {
	      abortHandshake(websocket, socket, protError);
	      return;
	    }

	    if (serverProt) websocket._protocol = serverProt;

	    const secWebSocketExtensions = res.headers['sec-websocket-extensions'];

	    if (secWebSocketExtensions !== undefined) {
	      if (!perMessageDeflate) {
	        const message =
	          'Server sent a Sec-WebSocket-Extensions header but no extension ' +
	          'was requested';
	        abortHandshake(websocket, socket, message);
	        return;
	      }

	      let extensions;

	      try {
	        extensions = parse(secWebSocketExtensions);
	      } catch (err) {
	        const message = 'Invalid Sec-WebSocket-Extensions header';
	        abortHandshake(websocket, socket, message);
	        return;
	      }

	      const extensionNames = Object.keys(extensions);

	      if (
	        extensionNames.length !== 1 ||
	        extensionNames[0] !== PerMessageDeflate.extensionName
	      ) {
	        const message = 'Server indicated an extension that was not requested';
	        abortHandshake(websocket, socket, message);
	        return;
	      }

	      try {
	        perMessageDeflate.accept(extensions[PerMessageDeflate.extensionName]);
	      } catch (err) {
	        const message = 'Invalid Sec-WebSocket-Extensions header';
	        abortHandshake(websocket, socket, message);
	        return;
	      }

	      websocket._extensions[PerMessageDeflate.extensionName] =
	        perMessageDeflate;
	    }

	    websocket.setSocket(socket, head, {
	      allowSynchronousEvents: opts.allowSynchronousEvents,
	      generateMask: opts.generateMask,
	      maxPayload: opts.maxPayload,
	      skipUTF8Validation: opts.skipUTF8Validation
	    });
	  });

	  if (opts.finishRequest) {
	    opts.finishRequest(req, websocket);
	  } else {
	    req.end();
	  }
	}

	/**
	 * Emit the `'error'` and `'close'` events.
	 *
	 * @param {WebSocket} websocket The WebSocket instance
	 * @param {Error} The error to emit
	 * @private
	 */
	function emitErrorAndClose(websocket, err) {
	  websocket._readyState = WebSocket.CLOSING;
	  //
	  // The following assignment is practically useless and is done only for
	  // consistency.
	  //
	  websocket._errorEmitted = true;
	  websocket.emit('error', err);
	  websocket.emitClose();
	}

	/**
	 * Create a `net.Socket` and initiate a connection.
	 *
	 * @param {Object} options Connection options
	 * @return {net.Socket} The newly created socket used to start the connection
	 * @private
	 */
	function netConnect(options) {
	  options.path = options.socketPath;
	  return net$1.connect(options);
	}

	/**
	 * Create a `tls.TLSSocket` and initiate a connection.
	 *
	 * @param {Object} options Connection options
	 * @return {tls.TLSSocket} The newly created socket used to start the connection
	 * @private
	 */
	function tlsConnect(options) {
	  options.path = undefined;

	  if (!options.servername && options.servername !== '') {
	    options.servername = net$1.isIP(options.host) ? '' : options.host;
	  }

	  return tls.connect(options);
	}

	/**
	 * Abort the handshake and emit an error.
	 *
	 * @param {WebSocket} websocket The WebSocket instance
	 * @param {(http.ClientRequest|net.Socket|tls.Socket)} stream The request to
	 *     abort or the socket to destroy
	 * @param {String} message The error message
	 * @private
	 */
	function abortHandshake(websocket, stream, message) {
	  websocket._readyState = WebSocket.CLOSING;

	  const err = new Error(message);
	  Error.captureStackTrace(err, abortHandshake);

	  if (stream.setHeader) {
	    stream[kAborted] = true;
	    stream.abort();

	    if (stream.socket && !stream.socket.destroyed) {
	      //
	      // On Node.js >= 14.3.0 `request.abort()` does not destroy the socket if
	      // called after the request completed. See
	      // https://github.com/websockets/ws/issues/1869.
	      //
	      stream.socket.destroy();
	    }

	    process.nextTick(emitErrorAndClose, websocket, err);
	  } else {
	    stream.destroy(err);
	    stream.once('error', websocket.emit.bind(websocket, 'error'));
	    stream.once('close', websocket.emitClose.bind(websocket));
	  }
	}

	/**
	 * Handle cases where the `ping()`, `pong()`, or `send()` methods are called
	 * when the `readyState` attribute is `CLOSING` or `CLOSED`.
	 *
	 * @param {WebSocket} websocket The WebSocket instance
	 * @param {*} [data] The data to send
	 * @param {Function} [cb] Callback
	 * @private
	 */
	function sendAfterClose(websocket, data, cb) {
	  if (data) {
	    const length = isBlob(data) ? data.size : toBuffer(data).length;

	    //
	    // The `_bufferedAmount` property is used only when the peer is a client and
	    // the opening handshake fails. Under these circumstances, in fact, the
	    // `setSocket()` method is not called, so the `_socket` and `_sender`
	    // properties are set to `null`.
	    //
	    if (websocket._socket) websocket._sender._bufferedBytes += length;
	    else websocket._bufferedAmount += length;
	  }

	  if (cb) {
	    const err = new Error(
	      `WebSocket is not open: readyState ${websocket.readyState} ` +
	        `(${readyStates[websocket.readyState]})`
	    );
	    process.nextTick(cb, err);
	  }
	}

	/**
	 * The listener of the `Receiver` `'conclude'` event.
	 *
	 * @param {Number} code The status code
	 * @param {Buffer} reason The reason for closing
	 * @private
	 */
	function receiverOnConclude(code, reason) {
	  const websocket = this[kWebSocket];

	  websocket._closeFrameReceived = true;
	  websocket._closeMessage = reason;
	  websocket._closeCode = code;

	  if (websocket._socket[kWebSocket] === undefined) return;

	  websocket._socket.removeListener('data', socketOnData);
	  process.nextTick(resume, websocket._socket);

	  if (code === 1005) websocket.close();
	  else websocket.close(code, reason);
	}

	/**
	 * The listener of the `Receiver` `'drain'` event.
	 *
	 * @private
	 */
	function receiverOnDrain() {
	  const websocket = this[kWebSocket];

	  if (!websocket.isPaused) websocket._socket.resume();
	}

	/**
	 * The listener of the `Receiver` `'error'` event.
	 *
	 * @param {(RangeError|Error)} err The emitted error
	 * @private
	 */
	function receiverOnError(err) {
	  const websocket = this[kWebSocket];

	  if (websocket._socket[kWebSocket] !== undefined) {
	    websocket._socket.removeListener('data', socketOnData);

	    //
	    // On Node.js < 14.0.0 the `'error'` event is emitted synchronously. See
	    // https://github.com/websockets/ws/issues/1940.
	    //
	    process.nextTick(resume, websocket._socket);

	    websocket.close(err[kStatusCode]);
	  }

	  if (!websocket._errorEmitted) {
	    websocket._errorEmitted = true;
	    websocket.emit('error', err);
	  }
	}

	/**
	 * The listener of the `Receiver` `'finish'` event.
	 *
	 * @private
	 */
	function receiverOnFinish() {
	  this[kWebSocket].emitClose();
	}

	/**
	 * The listener of the `Receiver` `'message'` event.
	 *
	 * @param {Buffer|ArrayBuffer|Buffer[])} data The message
	 * @param {Boolean} isBinary Specifies whether the message is binary or not
	 * @private
	 */
	function receiverOnMessage(data, isBinary) {
	  this[kWebSocket].emit('message', data, isBinary);
	}

	/**
	 * The listener of the `Receiver` `'ping'` event.
	 *
	 * @param {Buffer} data The data included in the ping frame
	 * @private
	 */
	function receiverOnPing(data) {
	  const websocket = this[kWebSocket];

	  if (websocket._autoPong) websocket.pong(data, !this._isServer, NOOP);
	  websocket.emit('ping', data);
	}

	/**
	 * The listener of the `Receiver` `'pong'` event.
	 *
	 * @param {Buffer} data The data included in the pong frame
	 * @private
	 */
	function receiverOnPong(data) {
	  this[kWebSocket].emit('pong', data);
	}

	/**
	 * Resume a readable stream
	 *
	 * @param {Readable} stream The readable stream
	 * @private
	 */
	function resume(stream) {
	  stream.resume();
	}

	/**
	 * The `Sender` error event handler.
	 *
	 * @param {Error} The error
	 * @private
	 */
	function senderOnError(err) {
	  const websocket = this[kWebSocket];

	  if (websocket.readyState === WebSocket.CLOSED) return;
	  if (websocket.readyState === WebSocket.OPEN) {
	    websocket._readyState = WebSocket.CLOSING;
	    setCloseTimer(websocket);
	  }

	  //
	  // `socket.end()` is used instead of `socket.destroy()` to allow the other
	  // peer to finish sending queued data. There is no need to set a timer here
	  // because `CLOSING` means that it is already set or not needed.
	  //
	  this._socket.end();

	  if (!websocket._errorEmitted) {
	    websocket._errorEmitted = true;
	    websocket.emit('error', err);
	  }
	}

	/**
	 * Set a timer to destroy the underlying raw socket of a WebSocket.
	 *
	 * @param {WebSocket} websocket The WebSocket instance
	 * @private
	 */
	function setCloseTimer(websocket) {
	  websocket._closeTimer = setTimeout(
	    websocket._socket.destroy.bind(websocket._socket),
	    closeTimeout
	  );
	}

	/**
	 * The listener of the socket `'close'` event.
	 *
	 * @private
	 */
	function socketOnClose() {
	  const websocket = this[kWebSocket];

	  this.removeListener('close', socketOnClose);
	  this.removeListener('data', socketOnData);
	  this.removeListener('end', socketOnEnd);

	  websocket._readyState = WebSocket.CLOSING;

	  let chunk;

	  //
	  // The close frame might not have been received or the `'end'` event emitted,
	  // for example, if the socket was destroyed due to an error. Ensure that the
	  // `receiver` stream is closed after writing any remaining buffered data to
	  // it. If the readable side of the socket is in flowing mode then there is no
	  // buffered data as everything has been already written and `readable.read()`
	  // will return `null`. If instead, the socket is paused, any possible buffered
	  // data will be read as a single chunk.
	  //
	  if (
	    !this._readableState.endEmitted &&
	    !websocket._closeFrameReceived &&
	    !websocket._receiver._writableState.errorEmitted &&
	    (chunk = websocket._socket.read()) !== null
	  ) {
	    websocket._receiver.write(chunk);
	  }

	  websocket._receiver.end();

	  this[kWebSocket] = undefined;

	  clearTimeout(websocket._closeTimer);

	  if (
	    websocket._receiver._writableState.finished ||
	    websocket._receiver._writableState.errorEmitted
	  ) {
	    websocket.emitClose();
	  } else {
	    websocket._receiver.on('error', receiverOnFinish);
	    websocket._receiver.on('finish', receiverOnFinish);
	  }
	}

	/**
	 * The listener of the socket `'data'` event.
	 *
	 * @param {Buffer} chunk A chunk of data
	 * @private
	 */
	function socketOnData(chunk) {
	  if (!this[kWebSocket]._receiver.write(chunk)) {
	    this.pause();
	  }
	}

	/**
	 * The listener of the socket `'end'` event.
	 *
	 * @private
	 */
	function socketOnEnd() {
	  const websocket = this[kWebSocket];

	  websocket._readyState = WebSocket.CLOSING;
	  websocket._receiver.end();
	  this.end();
	}

	/**
	 * The listener of the socket `'error'` event.
	 *
	 * @private
	 */
	function socketOnError() {
	  const websocket = this[kWebSocket];

	  this.removeListener('error', socketOnError);
	  this.on('error', NOOP);

	  if (websocket) {
	    websocket._readyState = WebSocket.CLOSING;
	    this.destroy();
	  }
	}
	return websocket;
}

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^WebSocket$" }] */

var stream;
var hasRequiredStream;

function requireStream () {
	if (hasRequiredStream) return stream;
	hasRequiredStream = 1;

	requireWebsocket();
	const { Duplex } = require$$0$2;

	/**
	 * Emits the `'close'` event on a stream.
	 *
	 * @param {Duplex} stream The stream.
	 * @private
	 */
	function emitClose(stream) {
	  stream.emit('close');
	}

	/**
	 * The listener of the `'end'` event.
	 *
	 * @private
	 */
	function duplexOnEnd() {
	  if (!this.destroyed && this._writableState.finished) {
	    this.destroy();
	  }
	}

	/**
	 * The listener of the `'error'` event.
	 *
	 * @param {Error} err The error
	 * @private
	 */
	function duplexOnError(err) {
	  this.removeListener('error', duplexOnError);
	  this.destroy();
	  if (this.listenerCount('error') === 0) {
	    // Do not suppress the throwing behavior.
	    this.emit('error', err);
	  }
	}

	/**
	 * Wraps a `WebSocket` in a duplex stream.
	 *
	 * @param {WebSocket} ws The `WebSocket` to wrap
	 * @param {Object} [options] The options for the `Duplex` constructor
	 * @return {Duplex} The duplex stream
	 * @public
	 */
	function createWebSocketStream(ws, options) {
	  let terminateOnDestroy = true;

	  const duplex = new Duplex({
	    ...options,
	    autoDestroy: false,
	    emitClose: false,
	    objectMode: false,
	    writableObjectMode: false
	  });

	  ws.on('message', function message(msg, isBinary) {
	    const data =
	      !isBinary && duplex._readableState.objectMode ? msg.toString() : msg;

	    if (!duplex.push(data)) ws.pause();
	  });

	  ws.once('error', function error(err) {
	    if (duplex.destroyed) return;

	    // Prevent `ws.terminate()` from being called by `duplex._destroy()`.
	    //
	    // - If the `'error'` event is emitted before the `'open'` event, then
	    //   `ws.terminate()` is a noop as no socket is assigned.
	    // - Otherwise, the error is re-emitted by the listener of the `'error'`
	    //   event of the `Receiver` object. The listener already closes the
	    //   connection by calling `ws.close()`. This allows a close frame to be
	    //   sent to the other peer. If `ws.terminate()` is called right after this,
	    //   then the close frame might not be sent.
	    terminateOnDestroy = false;
	    duplex.destroy(err);
	  });

	  ws.once('close', function close() {
	    if (duplex.destroyed) return;

	    duplex.push(null);
	  });

	  duplex._destroy = function (err, callback) {
	    if (ws.readyState === ws.CLOSED) {
	      callback(err);
	      process.nextTick(emitClose, duplex);
	      return;
	    }

	    let called = false;

	    ws.once('error', function error(err) {
	      called = true;
	      callback(err);
	    });

	    ws.once('close', function close() {
	      if (!called) callback(err);
	      process.nextTick(emitClose, duplex);
	    });

	    if (terminateOnDestroy) ws.terminate();
	  };

	  duplex._final = function (callback) {
	    if (ws.readyState === ws.CONNECTING) {
	      ws.once('open', function open() {
	        duplex._final(callback);
	      });
	      return;
	    }

	    // If the value of the `_socket` property is `null` it means that `ws` is a
	    // client websocket and the handshake failed. In fact, when this happens, a
	    // socket is never assigned to the websocket. Wait for the `'error'` event
	    // that will be emitted by the websocket.
	    if (ws._socket === null) return;

	    if (ws._socket._writableState.finished) {
	      callback();
	      if (duplex._readableState.endEmitted) duplex.destroy();
	    } else {
	      ws._socket.once('finish', function finish() {
	        // `duplex` is not destroyed here because the `'end'` event will be
	        // emitted on `duplex` after this `'finish'` event. The EOF signaling
	        // `null` chunk is, in fact, pushed when the websocket emits `'close'`.
	        callback();
	      });
	      ws.close();
	    }
	  };

	  duplex._read = function () {
	    if (ws.isPaused) ws.resume();
	  };

	  duplex._write = function (chunk, encoding, callback) {
	    if (ws.readyState === ws.CONNECTING) {
	      ws.once('open', function open() {
	        duplex._write(chunk, encoding, callback);
	      });
	      return;
	    }

	    ws.send(chunk, callback);
	  };

	  duplex.on('end', duplexOnEnd);
	  duplex.on('error', duplexOnError);
	  return duplex;
	}

	stream = createWebSocketStream;
	return stream;
}

requireStream();

requireReceiver();

requireSender();

var websocketExports = requireWebsocket();
var WebSocket = /*@__PURE__*/getDefaultExportFromCjs(websocketExports);

var subprotocol;
var hasRequiredSubprotocol;

function requireSubprotocol () {
	if (hasRequiredSubprotocol) return subprotocol;
	hasRequiredSubprotocol = 1;

	const { tokenChars } = requireValidation();

	/**
	 * Parses the `Sec-WebSocket-Protocol` header into a set of subprotocol names.
	 *
	 * @param {String} header The field value of the header
	 * @return {Set} The subprotocol names
	 * @public
	 */
	function parse(header) {
	  const protocols = new Set();
	  let start = -1;
	  let end = -1;
	  let i = 0;

	  for (i; i < header.length; i++) {
	    const code = header.charCodeAt(i);

	    if (end === -1 && tokenChars[code] === 1) {
	      if (start === -1) start = i;
	    } else if (
	      i !== 0 &&
	      (code === 0x20 /* ' ' */ || code === 0x09) /* '\t' */
	    ) {
	      if (end === -1 && start !== -1) end = i;
	    } else if (code === 0x2c /* ',' */) {
	      if (start === -1) {
	        throw new SyntaxError(`Unexpected character at index ${i}`);
	      }

	      if (end === -1) end = i;

	      const protocol = header.slice(start, end);

	      if (protocols.has(protocol)) {
	        throw new SyntaxError(`The "${protocol}" subprotocol is duplicated`);
	      }

	      protocols.add(protocol);
	      start = end = -1;
	    } else {
	      throw new SyntaxError(`Unexpected character at index ${i}`);
	    }
	  }

	  if (start === -1 || end !== -1) {
	    throw new SyntaxError('Unexpected end of input');
	  }

	  const protocol = header.slice(start, i);

	  if (protocols.has(protocol)) {
	    throw new SyntaxError(`The "${protocol}" subprotocol is duplicated`);
	  }

	  protocols.add(protocol);
	  return protocols;
	}

	subprotocol = { parse };
	return subprotocol;
}

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^Duplex$", "caughtErrors": "none" }] */

var websocketServer;
var hasRequiredWebsocketServer;

function requireWebsocketServer () {
	if (hasRequiredWebsocketServer) return websocketServer;
	hasRequiredWebsocketServer = 1;

	const EventEmitter = require$$0$3;
	const http = require$$2;
	const { Duplex } = require$$0$2;
	const { createHash } = require$$1;

	const extension = requireExtension();
	const PerMessageDeflate = requirePermessageDeflate();
	const subprotocol = requireSubprotocol();
	const WebSocket = requireWebsocket();
	const { GUID, kWebSocket } = requireConstants();

	const keyRegex = /^[+/0-9A-Za-z]{22}==$/;

	const RUNNING = 0;
	const CLOSING = 1;
	const CLOSED = 2;

	/**
	 * Class representing a WebSocket server.
	 *
	 * @extends EventEmitter
	 */
	class WebSocketServer extends EventEmitter {
	  /**
	   * Create a `WebSocketServer` instance.
	   *
	   * @param {Object} options Configuration options
	   * @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether
	   *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
	   *     multiple times in the same tick
	   * @param {Boolean} [options.autoPong=true] Specifies whether or not to
	   *     automatically send a pong in response to a ping
	   * @param {Number} [options.backlog=511] The maximum length of the queue of
	   *     pending connections
	   * @param {Boolean} [options.clientTracking=true] Specifies whether or not to
	   *     track clients
	   * @param {Function} [options.handleProtocols] A hook to handle protocols
	   * @param {String} [options.host] The hostname where to bind the server
	   * @param {Number} [options.maxPayload=104857600] The maximum allowed message
	   *     size
	   * @param {Boolean} [options.noServer=false] Enable no server mode
	   * @param {String} [options.path] Accept only connections matching this path
	   * @param {(Boolean|Object)} [options.perMessageDeflate=false] Enable/disable
	   *     permessage-deflate
	   * @param {Number} [options.port] The port where to bind the server
	   * @param {(http.Server|https.Server)} [options.server] A pre-created HTTP/S
	   *     server to use
	   * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
	   *     not to skip UTF-8 validation for text and close messages
	   * @param {Function} [options.verifyClient] A hook to reject connections
	   * @param {Function} [options.WebSocket=WebSocket] Specifies the `WebSocket`
	   *     class to use. It must be the `WebSocket` class or class that extends it
	   * @param {Function} [callback] A listener for the `listening` event
	   */
	  constructor(options, callback) {
	    super();

	    options = {
	      allowSynchronousEvents: true,
	      autoPong: true,
	      maxPayload: 100 * 1024 * 1024,
	      skipUTF8Validation: false,
	      perMessageDeflate: false,
	      handleProtocols: null,
	      clientTracking: true,
	      verifyClient: null,
	      noServer: false,
	      backlog: null, // use default (511 as implemented in net.js)
	      server: null,
	      host: null,
	      path: null,
	      port: null,
	      WebSocket,
	      ...options
	    };

	    if (
	      (options.port == null && !options.server && !options.noServer) ||
	      (options.port != null && (options.server || options.noServer)) ||
	      (options.server && options.noServer)
	    ) {
	      throw new TypeError(
	        'One and only one of the "port", "server", or "noServer" options ' +
	          'must be specified'
	      );
	    }

	    if (options.port != null) {
	      this._server = http.createServer((req, res) => {
	        const body = http.STATUS_CODES[426];

	        res.writeHead(426, {
	          'Content-Length': body.length,
	          'Content-Type': 'text/plain'
	        });
	        res.end(body);
	      });
	      this._server.listen(
	        options.port,
	        options.host,
	        options.backlog,
	        callback
	      );
	    } else if (options.server) {
	      this._server = options.server;
	    }

	    if (this._server) {
	      const emitConnection = this.emit.bind(this, 'connection');

	      this._removeListeners = addListeners(this._server, {
	        listening: this.emit.bind(this, 'listening'),
	        error: this.emit.bind(this, 'error'),
	        upgrade: (req, socket, head) => {
	          this.handleUpgrade(req, socket, head, emitConnection);
	        }
	      });
	    }

	    if (options.perMessageDeflate === true) options.perMessageDeflate = {};
	    if (options.clientTracking) {
	      this.clients = new Set();
	      this._shouldEmitClose = false;
	    }

	    this.options = options;
	    this._state = RUNNING;
	  }

	  /**
	   * Returns the bound address, the address family name, and port of the server
	   * as reported by the operating system if listening on an IP socket.
	   * If the server is listening on a pipe or UNIX domain socket, the name is
	   * returned as a string.
	   *
	   * @return {(Object|String|null)} The address of the server
	   * @public
	   */
	  address() {
	    if (this.options.noServer) {
	      throw new Error('The server is operating in "noServer" mode');
	    }

	    if (!this._server) return null;
	    return this._server.address();
	  }

	  /**
	   * Stop the server from accepting new connections and emit the `'close'` event
	   * when all existing connections are closed.
	   *
	   * @param {Function} [cb] A one-time listener for the `'close'` event
	   * @public
	   */
	  close(cb) {
	    if (this._state === CLOSED) {
	      if (cb) {
	        this.once('close', () => {
	          cb(new Error('The server is not running'));
	        });
	      }

	      process.nextTick(emitClose, this);
	      return;
	    }

	    if (cb) this.once('close', cb);

	    if (this._state === CLOSING) return;
	    this._state = CLOSING;

	    if (this.options.noServer || this.options.server) {
	      if (this._server) {
	        this._removeListeners();
	        this._removeListeners = this._server = null;
	      }

	      if (this.clients) {
	        if (!this.clients.size) {
	          process.nextTick(emitClose, this);
	        } else {
	          this._shouldEmitClose = true;
	        }
	      } else {
	        process.nextTick(emitClose, this);
	      }
	    } else {
	      const server = this._server;

	      this._removeListeners();
	      this._removeListeners = this._server = null;

	      //
	      // The HTTP/S server was created internally. Close it, and rely on its
	      // `'close'` event.
	      //
	      server.close(() => {
	        emitClose(this);
	      });
	    }
	  }

	  /**
	   * See if a given request should be handled by this server instance.
	   *
	   * @param {http.IncomingMessage} req Request object to inspect
	   * @return {Boolean} `true` if the request is valid, else `false`
	   * @public
	   */
	  shouldHandle(req) {
	    if (this.options.path) {
	      const index = req.url.indexOf('?');
	      const pathname = index !== -1 ? req.url.slice(0, index) : req.url;

	      if (pathname !== this.options.path) return false;
	    }

	    return true;
	  }

	  /**
	   * Handle a HTTP Upgrade request.
	   *
	   * @param {http.IncomingMessage} req The request object
	   * @param {Duplex} socket The network socket between the server and client
	   * @param {Buffer} head The first packet of the upgraded stream
	   * @param {Function} cb Callback
	   * @public
	   */
	  handleUpgrade(req, socket, head, cb) {
	    socket.on('error', socketOnError);

	    const key = req.headers['sec-websocket-key'];
	    const upgrade = req.headers.upgrade;
	    const version = +req.headers['sec-websocket-version'];

	    if (req.method !== 'GET') {
	      const message = 'Invalid HTTP method';
	      abortHandshakeOrEmitwsClientError(this, req, socket, 405, message);
	      return;
	    }

	    if (upgrade === undefined || upgrade.toLowerCase() !== 'websocket') {
	      const message = 'Invalid Upgrade header';
	      abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
	      return;
	    }

	    if (key === undefined || !keyRegex.test(key)) {
	      const message = 'Missing or invalid Sec-WebSocket-Key header';
	      abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
	      return;
	    }

	    if (version !== 13 && version !== 8) {
	      const message = 'Missing or invalid Sec-WebSocket-Version header';
	      abortHandshakeOrEmitwsClientError(this, req, socket, 400, message, {
	        'Sec-WebSocket-Version': '13, 8'
	      });
	      return;
	    }

	    if (!this.shouldHandle(req)) {
	      abortHandshake(socket, 400);
	      return;
	    }

	    const secWebSocketProtocol = req.headers['sec-websocket-protocol'];
	    let protocols = new Set();

	    if (secWebSocketProtocol !== undefined) {
	      try {
	        protocols = subprotocol.parse(secWebSocketProtocol);
	      } catch (err) {
	        const message = 'Invalid Sec-WebSocket-Protocol header';
	        abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
	        return;
	      }
	    }

	    const secWebSocketExtensions = req.headers['sec-websocket-extensions'];
	    const extensions = {};

	    if (
	      this.options.perMessageDeflate &&
	      secWebSocketExtensions !== undefined
	    ) {
	      const perMessageDeflate = new PerMessageDeflate(
	        this.options.perMessageDeflate,
	        true,
	        this.options.maxPayload
	      );

	      try {
	        const offers = extension.parse(secWebSocketExtensions);

	        if (offers[PerMessageDeflate.extensionName]) {
	          perMessageDeflate.accept(offers[PerMessageDeflate.extensionName]);
	          extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
	        }
	      } catch (err) {
	        const message =
	          'Invalid or unacceptable Sec-WebSocket-Extensions header';
	        abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
	        return;
	      }
	    }

	    //
	    // Optionally call external client verification handler.
	    //
	    if (this.options.verifyClient) {
	      const info = {
	        origin:
	          req.headers[`${version === 8 ? 'sec-websocket-origin' : 'origin'}`],
	        secure: !!(req.socket.authorized || req.socket.encrypted),
	        req
	      };

	      if (this.options.verifyClient.length === 2) {
	        this.options.verifyClient(info, (verified, code, message, headers) => {
	          if (!verified) {
	            return abortHandshake(socket, code || 401, message, headers);
	          }

	          this.completeUpgrade(
	            extensions,
	            key,
	            protocols,
	            req,
	            socket,
	            head,
	            cb
	          );
	        });
	        return;
	      }

	      if (!this.options.verifyClient(info)) return abortHandshake(socket, 401);
	    }

	    this.completeUpgrade(extensions, key, protocols, req, socket, head, cb);
	  }

	  /**
	   * Upgrade the connection to WebSocket.
	   *
	   * @param {Object} extensions The accepted extensions
	   * @param {String} key The value of the `Sec-WebSocket-Key` header
	   * @param {Set} protocols The subprotocols
	   * @param {http.IncomingMessage} req The request object
	   * @param {Duplex} socket The network socket between the server and client
	   * @param {Buffer} head The first packet of the upgraded stream
	   * @param {Function} cb Callback
	   * @throws {Error} If called more than once with the same socket
	   * @private
	   */
	  completeUpgrade(extensions, key, protocols, req, socket, head, cb) {
	    //
	    // Destroy the socket if the client has already sent a FIN packet.
	    //
	    if (!socket.readable || !socket.writable) return socket.destroy();

	    if (socket[kWebSocket]) {
	      throw new Error(
	        'server.handleUpgrade() was called more than once with the same ' +
	          'socket, possibly due to a misconfiguration'
	      );
	    }

	    if (this._state > RUNNING) return abortHandshake(socket, 503);

	    const digest = createHash('sha1')
	      .update(key + GUID)
	      .digest('base64');

	    const headers = [
	      'HTTP/1.1 101 Switching Protocols',
	      'Upgrade: websocket',
	      'Connection: Upgrade',
	      `Sec-WebSocket-Accept: ${digest}`
	    ];

	    const ws = new this.options.WebSocket(null, undefined, this.options);

	    if (protocols.size) {
	      //
	      // Optionally call external protocol selection handler.
	      //
	      const protocol = this.options.handleProtocols
	        ? this.options.handleProtocols(protocols, req)
	        : protocols.values().next().value;

	      if (protocol) {
	        headers.push(`Sec-WebSocket-Protocol: ${protocol}`);
	        ws._protocol = protocol;
	      }
	    }

	    if (extensions[PerMessageDeflate.extensionName]) {
	      const params = extensions[PerMessageDeflate.extensionName].params;
	      const value = extension.format({
	        [PerMessageDeflate.extensionName]: [params]
	      });
	      headers.push(`Sec-WebSocket-Extensions: ${value}`);
	      ws._extensions = extensions;
	    }

	    //
	    // Allow external modification/inspection of handshake headers.
	    //
	    this.emit('headers', headers, req);

	    socket.write(headers.concat('\r\n').join('\r\n'));
	    socket.removeListener('error', socketOnError);

	    ws.setSocket(socket, head, {
	      allowSynchronousEvents: this.options.allowSynchronousEvents,
	      maxPayload: this.options.maxPayload,
	      skipUTF8Validation: this.options.skipUTF8Validation
	    });

	    if (this.clients) {
	      this.clients.add(ws);
	      ws.on('close', () => {
	        this.clients.delete(ws);

	        if (this._shouldEmitClose && !this.clients.size) {
	          process.nextTick(emitClose, this);
	        }
	      });
	    }

	    cb(ws, req);
	  }
	}

	websocketServer = WebSocketServer;

	/**
	 * Add event listeners on an `EventEmitter` using a map of <event, listener>
	 * pairs.
	 *
	 * @param {EventEmitter} server The event emitter
	 * @param {Object.<String, Function>} map The listeners to add
	 * @return {Function} A function that will remove the added listeners when
	 *     called
	 * @private
	 */
	function addListeners(server, map) {
	  for (const event of Object.keys(map)) server.on(event, map[event]);

	  return function removeListeners() {
	    for (const event of Object.keys(map)) {
	      server.removeListener(event, map[event]);
	    }
	  };
	}

	/**
	 * Emit a `'close'` event on an `EventEmitter`.
	 *
	 * @param {EventEmitter} server The event emitter
	 * @private
	 */
	function emitClose(server) {
	  server._state = CLOSED;
	  server.emit('close');
	}

	/**
	 * Handle socket errors.
	 *
	 * @private
	 */
	function socketOnError() {
	  this.destroy();
	}

	/**
	 * Close the connection when preconditions are not fulfilled.
	 *
	 * @param {Duplex} socket The socket of the upgrade request
	 * @param {Number} code The HTTP response status code
	 * @param {String} [message] The HTTP response body
	 * @param {Object} [headers] Additional HTTP response headers
	 * @private
	 */
	function abortHandshake(socket, code, message, headers) {
	  //
	  // The socket is writable unless the user destroyed or ended it before calling
	  // `server.handleUpgrade()` or in the `verifyClient` function, which is a user
	  // error. Handling this does not make much sense as the worst that can happen
	  // is that some of the data written by the user might be discarded due to the
	  // call to `socket.end()` below, which triggers an `'error'` event that in
	  // turn causes the socket to be destroyed.
	  //
	  message = message || http.STATUS_CODES[code];
	  headers = {
	    Connection: 'close',
	    'Content-Type': 'text/html',
	    'Content-Length': Buffer.byteLength(message),
	    ...headers
	  };

	  socket.once('finish', socket.destroy);

	  socket.end(
	    `HTTP/1.1 ${code} ${http.STATUS_CODES[code]}\r\n` +
	      Object.keys(headers)
	        .map((h) => `${h}: ${headers[h]}`)
	        .join('\r\n') +
	      '\r\n\r\n' +
	      message
	  );
	}

	/**
	 * Emit a `'wsClientError'` event on a `WebSocketServer` if there is at least
	 * one listener for it, otherwise call `abortHandshake()`.
	 *
	 * @param {WebSocketServer} server The WebSocket server
	 * @param {http.IncomingMessage} req The request object
	 * @param {Duplex} socket The socket of the upgrade request
	 * @param {Number} code The HTTP response status code
	 * @param {String} message The HTTP response body
	 * @param {Object} [headers] The HTTP response headers
	 * @private
	 */
	function abortHandshakeOrEmitwsClientError(
	  server,
	  req,
	  socket,
	  code,
	  message,
	  headers
	) {
	  if (server.listenerCount('wsClientError')) {
	    const err = new Error(message);
	    Error.captureStackTrace(err, abortHandshakeOrEmitwsClientError);

	    server.emit('wsClientError', err, socket, req);
	  } else {
	    abortHandshake(socket, code, message, headers);
	  }
	}
	return websocketServer;
}

var websocketServerExports = requireWebsocketServer();
var WebSocketServer = /*@__PURE__*/getDefaultExportFromCjs(websocketServerExports);

//  Node.js 'ws' websocket
class IOWS extends IOCore {
  constructor(url) {
    super(url);
    if (url) this.open();
  }



  /**
   * Closes ws WebSocket and cleans resources.
   */
  close() {
    if (this.socket) {
      this.socket.removeAllListeners();
      if (this.socket.readyState !== WebSocket.CLOSED) {
        this.socket.close();
      }
    }
    super.close();
  }

  keepConnection() {
    if (!this.autoReconnect) return;
    // Reconnect only if the socket is closed and the state reflects that.
    if ((!this.socket || this.socket.readyState === WebSocket.CLOSED) ) {
      this.open();
    }
  }



  createConnection(url) {
    // node WebSocket
    this.socket = new WebSocket(url);
    this.stateChange('connecting','connecting');

    this.socket.onopen = () => {
      this.socket.on('message', this.onWebSocketMessage.bind(this));
      this.emit('open');
    };

    this.socket.onerror = (e) => {
      this.emit('error', e);
    };

    this.socket.onclose = () => {
      this.emit('close');
    };
  }

  onWebSocketMessage(data) {
    this.rxCounter++;
    this.lastTxRxTime = Date.now();
    this.rxBytes += data.byteLength;
    this.emit('socket_data', data);
  }

  socket_send(data) {
    if (this.socket?.readyState === 1) {
      this.socket.send(data);
      this.txCounter++;
      this.txBytes += data.byteLength;
      this.lastTxRxTime = Date.now();
    } else {
      console.log('.');
    }
  }

}

let serverOption = {
  clientTracking: false,
  port: null, // WebSocket
  congPort: null, // CongSocket
  httpServer: null,
  wsPath: null,
  timeout: 50000,
  showMessage: 'none',
  showMetric: 0,
  showChannel: 0,
  monitorPeriod: 5000,
  fileLogger: {
    connection: {
      use: false,
      path: 'connection.log'
    },
    auth: {
      use: false,
      path: 'auth.log'
    },
    attack: {
      use: false,
      path: 'attack.log'
    }
  },
  useQuota: {
    signalSize: false,
    publishCounter: false,
    trafficRate: false,
    disconnect: false
  },
  defaultQuotaIndex: 3,
  adminLevel: 255,

  debug: {
    slow: false,
    delay: 500,
    showAuthInfo: false
  },

  retain: {
    isAvailable: true,
    limitSize: 100000,
    limitCounter: 1000
  },

  auth: {
    delay_auth_fail: 600
  },
  membersOnly: false

};

const decoder$3 = new TextDecoder();

M$1.NB;
const MB = M$1.MB;


class RemoteCore {
  constructor(socket, manager) {

    this.socket = socket;
    socket.isAlive = true;
    socket.txCounter = 0;
    socket.rxCounter = 0;
    socket.openTime = Date.now();

    this.boho = new tt();
    this.encMode = ENC_MODE.AUTO;
    this.channels = new Set();  //  subscribed tags
    this.retain_signal = new Map();

    this.ssid = RemoteCore.ssid++;  // ordered index number
    this.manager = manager;

    this.cid = ''; // Client Id
    this.did = ''; // Device Id
    this.uid = ''; // User Id
    this.nick = '';

    this.privateNode = false;
    this.HOME_CHANNEL = '';
    this.level = serverOption.defaultQuotaIndex;
    this.quota = quotaTable[this.level];
    this.isAdmin = false;

    this.state;
    this.stateLog = [];
    this.setState(STATE.OPEN);

  }

  static ssid = 1;

  setState(state) {
    this.state = state;
    if (serverOption.debug.showAuthInfo) {
      this.stateLog.push(  state + ":" + STATE[ state]   );
      if( state == STATE.AUTH_RES){
        console.log('[auth success]', this.cid, this.stateLog.join('>'));
      }else if( state == STATE.AUTH_FAIL){
        console.log('[auth_fail]',this.stateLog.join('>'));
      }
    }
  }

  getState() { // <Number>
    return this.state
  }

  getStateName() { // <String>
    return (STATE[this.state]).toLowerCase()
  }


  showMessageLog(message, isBinary) {
    let h = '->S ';
    let from = this.boho.isAuthorized ? ` did: ${this.did} cid: ${this.cid}` : ` cid: ${this.cid}`;
    let prnLimit = 20;
    if (isBinary) {
      let msgTypeName = IOMsg[message[0]];
      if (!msgTypeName) msgTypeName = tt.BohoMsg[message[0]];

      msgTypeName = '[' + msgTypeName + ']';
      let size = message.byteLength;
      if (size < prnLimit) {
        console.log( h + msgTypeName + from +` [${size}]`, message);
      } else {
        let elseLen = size - prnLimit;
        let some = message.subarray(0,prnLimit);
        console.log( h + msgTypeName + from +` [${size}]` , some , ' ... else: ', elseLen);
      }

    } else {
      console.log( h + ' [TEXT] %s' + from, message);
    }
  }

  rxQuotaChecker(message) {
    let rxBytes = message.byteLength;
    this.manager.rxBytes += rxBytes;

    if (serverOption.useQuota.signalSize && (rxBytes > this.quota.signalSize)) {
      console.log('## quota: size over');
      this.send(Buffer.from([IOMsg.OVER_SIZE]));
      if (serverOption.useQuota.disconnect) this.close();
      return false;
    }

    // todo:
    // traffic rate :  
    return true;
  }

  onTimeDelayMessage(message, isBinary = true) {
    setTimeout(() => {
      this.onSocketMessage(message, isBinary);
    }
      , serverOption.debug.delay);
  }

  // CongSocket or WebSocket
  onSocketMessage(message, isBinary = true) {

    this.receiveMonitor(); // rx-data, ping/pong and timeout check
    if (!this.rxQuotaChecker(message)) return

    if (serverOption.showMessage === 'message') this.showMessageLog(message, isBinary);

    let msgType, decoded;

    if (isBinary) {
      msgType = message[0];

      if (msgType === tt.BohoMsg.ENC_488) {

        try {
          decoded = this.boho.decrypt_488(message);
        } catch (err) {
          console.log('-- E488 DEC_FAIL', err);
          return
        }

        if (decoded) {
          msgType = decoded[0];
          message = decoded;
        } else {
          return
        }

      } else if (msgType === tt.BohoMsg.ENC_E2E) { // symetric E2EE Signal
        try {
          decoded = this.boho.decrypt_488(message);
        } catch (err) {
          // console.log('-- E2E DEC_FAIL', err)
          return
        }
        // console.log('e2e unpack:', decoded )
        if (decoded) {
          msgType = decoded[0];
          message.set(decoded, tt.MetaSize.ENC_488); // set decoded signal_e2e headaer.
          message = message.subarray(tt.MetaSize.ENC_488); // reset offset.
        } else {
          return
        }

      } else ;

      switch (msgType) {
        case IOMsg.PING:
          this.pong();
          break;

        case IOMsg.PONG:
          break;

        case IOMsg.CID_REQ:
          if (this.state < STATE.SERVER_READY) {
            // Protocol violation: CID_REQ was sent before receiving the SERVER_READY signal.
            console.log('CID_REQ before SERVER_READY');
            this.close();
          }

          if (!this.cid) {
            this.cid = '?' + globalThis.crypto.getRandomValues(Buffer.alloc(3)).toString('base64url');
            this.manager.cid2remote.set(this.cid, this);
          }

          // console.log('<< SENDING CID_RES:', this.cid)
          this.send_enc_mode(M$1.pack(
            MB('#cid_ack', '8', IOMsg.CID_RES),
            MB('#cid', this.cid)
          ));

          this.setState(STATE.CID_RES);
          break;

        case IOMsg.ECHO:
          if( message.byteLength < 30) {      
            this.send(message, isBinary);
          }
          break;

        case IOMsg.IAM:
          if (message.byteLength > 1 && message.byteLength < 30) {            
              // if iam request has a text message then reset the nick property.
              this.nick = decoder$3.decode(message.subarray(1));
          }
          this.iamResponse();
          break;

        case IOMsg.SIGNAL_E2E:
        case IOMsg.SIGNAL:
          if (message.byteLength >= 3) {
            let tagLen = message.readUInt8(1);
            if (message.byteLength >= tagLen + 2) {
              let tag = message.subarray(2, 2 + tagLen);
              tag = decoder$3.decode(tag);
              this.manager.sender(tag, this, message);
            }
          }
          break;



        case IOMsg.UNSUBSCRIBE:
          if (message.byteLength == 2) {
            this.manager.unsubscribe([''], this);
          } else if (message.byteLength >= 3) {
            let tagLen = message.readUInt8(1);

            if (message.byteLength == tagLen + 2) {
              let tag = message.subarray(2, 2 + tagLen);
              tag = decoder$3.decode(tag);
              let tagList = tag.split(',');
              this.manager.unsubscribe(tagList, this);
            }
          }
          break;


        case IOMsg.SUBSCRIBE: // 1byte tagLen
          if (message.byteLength >= 3) {
            let tagLen = message.readUInt8(1);
            if (message.byteLength == tagLen + 2) {
              let tag = message.subarray(2, 2 + tagLen);
              tag = decoder$3.decode(tag);
              let tagList = tag.split(',');
              this.manager.subscribe(tagList, this);
            }
          }
          break;

        case IOMsg.SUBSCRIBE_REQ:  // 2bytes tagLen
          if (message.byteLength >= 6) {
            let msgID = message.readUInt16BE(1);
            let tagLen = message.readUInt16BE(3);
            if (message.byteLength == tagLen + 5) {
              let tag = message.subarray(5, 5 + tagLen);
              tag = decoder$3.decode(tag);
              let tagList = tag.split(',');
              // console.log('>> SUBSCRIBE_REQ from:', this.cid, tagList)
              this.manager.subscribe(tagList, this);
              this.response(msgID, 0);
            } else {
              this.response(msgID, 255);
            }
          }
          break;


        case IOMsg.CALL: //service request
          try {
            let req = M$1.unpack(message);
            if (req) {
              if (!req.target || !req.topic) return
              if (this.manager.server.serviceNames.has(req.target)) {
                this.manager.server.emit(req.target, this, req);
              } else {
                // console.log('UnKnown Service call: ', req.target)
              }
            }
          } catch (e) {
            console.log('request catch error', e);
          }
          break;


        case IOMsg.CLOSE:
          if (message.byteLength > 1) {
            let reason = decoder$3.decode(message.subarray(1));
            console.log('>> CLOSE reason:', reason);
            this.close();
          }
          break;


        // client's auth requst
        case tt.BohoMsg.AUTH_REQ:
          if (!this.manager.authManager) return
          if (this.state < STATE.SERVER_READY) {
            console.log('protocol error. must called auth_req after server_ready');
            this.close();
          }
          this.setState(STATE.AUTH_REQ);
          //async
          this.manager.authManager.verify_auth_req(message, this)
            .then(authInfo => {
              if (authInfo?.name) {
                this.manager.deligateSignal(this, '@$name', authInfo.name);
                // console.log('device login success authInfo', authInfo)
                // this.manager.sender('@$name', authInfo.name )
              }

              // console.log('[VERIFY AUTH_REQ] SubClass of BohoAuth return authInfo:', authInfo )
            })
            .catch(e => {
              console.log('authInfo return fail.', e );
            });

          return;
        // console.log('unknown MsgType:',msgType,' from:', this.ip, this.ssid, this.cid )

      }

    } else {
      // TEXT FRAME
      try {
        let textMessage = decoder$3.decode(message);
        // console.log('text buffer:',textMessage )
        // console.log('text buffer:',message.toString('hex') )
        this.manager.server.emit('text_message', textMessage, this);
      } catch (error) {

      }
    }

  }


  response(msgId, statusCode, body) {
    // console.log('response body', body)
    if (body) {
      this.send_enc_mode(M$1.pack(
        MB('#type', '8', IOMsg.RESPONSE_MBP),
        MB('status', '8', statusCode),
        MB('mid', '16', msgId),
        MB('body', body)
      ));
    } else {
      this.send_enc_mode(M$1.pack(
        MB('#type', '8', IOMsg.RESPONSE_MBP),
        MB('status', '8', statusCode),
        MB('mid', '16', msgId)
      ));
    }
  }


  send_enc_mode(data, useEncryption = false) {

    if (this.encMode === ENC_MODE.YES ||
      this.encMode === ENC_MODE.AUTO &&
      !this.TLS && this.boho.isAuthorized
    ) useEncryption = true;

    // console.log('svr useEnc',  useEncryption, data )

    if (useEncryption && data[0] == IOMsg.SIGNAL_E2E) {
      // When the server delivers end-to-end encrypted messages, 
      // it should only encrypt the header part and pass the data part as is.
      let tagLen = data[1];

      // let tagInfo = decoder.decode( data.subarray( 2, 2 + tagLen) )
      // console.log('server bypass E2E signal taginfo:', tagInfo )

      let encHeader = this.boho.encrypt_488(data.subarray(0, 3 + tagLen));
      encHeader[0] = tt.BohoMsg.ENC_E2E;
      let newEncBuffer = Buffer.concat([encHeader, data.subarray(3 + tagLen)]);
      this.send(newEncBuffer);

    } else if (useEncryption) {
      let encPack = this.boho.encrypt_488(data);
      if (encPack) {
        this.send(encPack);
      }
    } else {
      // console.log('send -N-')
      this.send(data);

    }

  }



  iamResponse(info = '') {

    if (info == '') {
      let channels = [];
      for (let tag of this.channels.keys()) {
        channels.push(tag);
      }

      info = {
        "ssid": this.ssid,
        "cid": this.cid,
        "did": this.did,
        "uid": this.uid,
        "level": this.level,
        "nick": this.nick,
        "ip": this.ip
        , 'tag': channels
      };
    }

    // console.log( 'iam res info', info )
    let pack = M$1.pack(
      MB('#MsgType', '8', IOMsg.IAM_RES),
      MB('#info', info)
    );
    this.send_enc_mode(pack);
  }


}

function isPrivateIP(ip) {
  if (ip.indexOf("0.0.0.0") === 0) return true
  if (ip.indexOf("127.0.0.1") === 0) return true
  if (ip.indexOf("192.168.") === 0) return true
  if (ip.indexOf("10.") === 0) return true
  if (ip.indexOf("172.") === 0) {
    if (ip.indexOf("172.16.") === 0) return true
    if (ip.indexOf("172.17.") === 0) return true
    if (ip.indexOf("172.18.") === 0) return true
    if (ip.indexOf("172.19.") === 0) return true
    if (ip.indexOf("172.20.") === 0) return true
    if (ip.indexOf("172.21.") === 0) return true
    if (ip.indexOf("172.22.") === 0) return true
    if (ip.indexOf("172.23.") === 0) return true
    if (ip.indexOf("172.24.") === 0) return true
    if (ip.indexOf("172.25.") === 0) return true
    if (ip.indexOf("172.26.") === 0) return true
    if (ip.indexOf("172.27.") === 0) return true
    if (ip.indexOf("172.28.") === 0) return true
    if (ip.indexOf("172.29.") === 0) return true
    if (ip.indexOf("172.30.") === 0) return true
    if (ip.indexOf("172.31.") === 0) return true
  }

  return false
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function getIPv4HexString(ipStr) {
  let ipv4 = ipStr.split('.');
  return Buffer.from(ipv4).toString('hex')
}

function getLocalAddress() {
  const nets = networkInterfaces();
  // console.log(nets)
  const results = Object.create(null); // Or just '{}', an empty object
  let localAddress = '';
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
      const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4;
      if (net.family === familyV4Value && !net.internal) {
        if (!results[name]) {
          results[name] = [];
        }
        results[name].push(net.address);
        localAddress = net.address;
      }
    }
  }

  // console.log('localAddress:', localAddress)
  return localAddress
}


const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const decoder$2 = new TextDecoder();

class Remote extends RemoteCore {
  constructor(socket, req, manager) {
    super(socket, manager);
    this.socketType = socket.socketType;

    if (this.socketType === 'websocket') {
      this.TLS = req.headers["x-forwarded-proto"] === 'https' ? true : false;
      this.ip = this.getRemoteIP(req);
    } else {
      this.TLS = false;
      this.ip = this.getRemoteIP(socket.remoteAddress);
    }


    if (isPrivateIP(this.ip)) {
      // connection from local or private network has default private channel.
      this.HOME_CHANNEL = 'PRIVATE:';
      this.privateNode = true;
    } else {
      // The HOME_CHANNEL is defined by the global IP address value.
      this.HOME_CHANNEL = 'IP:' + getIPv4HexString(this.ip);
    }


    if (this.socketType === 'websocket') {
      if (serverOption.debug.slow) {
        socket.on("message", this.onTimeDelayMessage.bind(this));
      } else {
        socket.on("message", this.onSocketMessage.bind(this));
      }
      socket.on("pong", this.receiveMonitor.bind(this));
      socket.on("ping", this.receiveMonitor.bind(this));
      socket.on("error", (e) => { console.log('Websocket error', e, e.code); });
      socket.onclose = (e) => {
        // Clean up all listeners on the socket to prevent leaks
        socket.removeAllListeners();
        this.manager.removeRemote(this);
      };
    } else { // TCP else
      this.congRx = new CongRx();
      socket.on('data', data => { this.congRx.write(data); });

      this.congRx.on('wrong', this.onWrongCongPacketMessage.bind(this));
      // readable.pipe( destination )
      // tcpSocket -> congRx(parser) -> onMessage
      // socket.pipe( this.congRx )

      if (serverOption.debug.slow) {
        this.congRx.on('data', this.onTimeDelayMessage.bind(this));
      } else {
        this.congRx.on('data', this.onSocketMessage.bind(this));
      }

      socket.on('error', e => { console.log('TCP Socket error', e); });
      socket.on('close', e => {
        // Clean up listeners on both the socket and the parser
        socket.removeAllListeners();
        this.congRx.removeAllListeners();
        this.manager.removeRemote(this);
      });

    }
  }

  onWrongCongPacketMessage(message) {
    /*
      * three category CongSocket connection.
      1. anonymouse, tcp connection.
        > no cid_req, no auth_req
        > It's attacker. close it.
      2. not authorized but cid ready connnection.
        > anonymouse remote client.
        > allowed some wrong(broken) message. small quota.
      3. authorized remote connection.
        > allowed some wrong(broken) message. large quota.
    */
    if (this.cid) ; else {
      // attacker
      let msg = "";
      try {
        msg = decoder$2.decode(message);
      } catch (error) {
        msg += 'Len: ' + message.byteLength;
      }

      // console.log('attacker message:', attackMsg)
      if (this.manager.attackLogger) {
        let attackMsg = `> ${this.ssid} ${this.ip} ${msg}`;
        this.manager.attackLogger.log(attackMsg);
      }

      this.close(true);
    }
  }


  permissionChecker() {

    this.socket.bytesWritten || this.socket._socket?.bytesWritten;
    this.socket.bytesRead || this.socket._socket?.bytesRead;

  }


  // any type of received messages:  message, ping, pong
  receiveMonitor() {
    this.socket.rxCounter++;
    this.socket.isAlive = true;
  }

  isConnectionHTTPS(req) {
    //In case of reverse proxy environment.  i.e. using nginx proxy_pass.
    return req.headers["x-forwarded-proto"];   //https or undefined
  }

  getRemoteIP(req) { //req or ip string
    let ip;
    if (req && req.headers) {
      ip = req.headers["x-forwarded-for"];
      if (ip == undefined) ip = req.socket.remoteAddress;
    } else {
      ip = req;
    }

    if (ip) {
      if (ip.indexOf("::ffff:") == 0) ip = ip.substring(7);
      if (ip == "::1") ip = "127.0.0.1";
    } else {
      ip = "0.0.0.0";
    }
    return ip;
  }

  ping() {
    if (this.socketType === 'websocket') {
      this.socket.ping();
      this.socket.txCounter++;
    } else {
      this.send(Buffer.from([IOMsg.PING]));
    }
  }

  pong() {
    if (this.socketType === 'websocket') {
      this.socket.pong();
      this.socket.txCounter++;
    } else {
      this.send(Buffer.from([IOMsg.PONG]));
    }
  }

  getTraffic() {
    this.socket.bytesWritten || this.socket._socket?.bytesWritten;
    this.socket.bytesRead || this.socket._socket?.bytesRead;
    this.socket.txCounter;
    this.socket.rxCounter;
  }

  close(terminateNow = false) {
    this.getTraffic();
    if (this.socketType === 'websocket') {
      if (terminateNow) this.socket.terminate();
      else this.socket.close();
    } else {
      if (terminateNow) this.socket.destroy();
      else this.socket.end();
    }
  }

  // node.js server side remote.
  send(message, isBinary) {
    // console.log(`<-S [${IOMsg[ message[0]]}]`)
    this.manager.txBytes += message.byteLength;
    this.socket.txCounter++;
    if (this.socketType === 'websocket') {
      if (this.socket.readyState === 1) {
        if (isBinary != undefined) {
          this.socket.send(message, { binary: isBinary });
        } else {
          this.socket.send(message);
        }
      } else {
        console.log('server(ws)Remote.send() called. not open state. current readyState:', this.socket.readyState );
        this.close(true);
      }
      
    } else { //CongSocket
      if (this.socket.readyState == 'open') {
        this.socket.write(pack(message));
      } else {
        console.log('server(cong)Remote.send() called. not open state. current readyState:', this.socket.readyState );
        this.close(true);
      }
    }

  }

}

const formatter = new Intl.DateTimeFormat('ko-KR', {
  // hour12: true,
  // hour: 'numeric',
  // minute: '2-digit',
  // second: '2-digit'
  year: 'numeric', month: 'numeric', day: 'numeric',
  hour: 'numeric', minute: 'numeric',
  hour12: false,
  timeZone: 'Asia/Seoul'
});


class FileLogger {
  constructor(path) {
    this.file = fs.openSync(path, 'a+');
    console.log('new FileLogger logFile: ', path, this.file);
  }

  log(msg) {
    let format = formatter.format(new Date()) + " " + msg + '\n';
    fs.write(this.file, format, (err) => {
      if (err) throw err;
    });

  }


}

const MAX = 10;
let period = 10000;

class Metrics {
  constructor(manager) {
    this.manager = manager;

    this.metricsPack = {
      remotes: [0],
      channels: [0],
      txBytes: [0],
      rxBytes: [0],
      unixTime: [Math.floor(Date.now() / 1000)],
      period: 0
    };

    this.tickId = setInterval(e => {

      this.metricsPack.remotes.push(this.manager.remotes.size);
      if (this.metricsPack.remotes.length > MAX) this.metricsPack.remotes.shift();

      this.metricsPack.channels.push(this.manager.channel_map.size);
      if (this.metricsPack.channels.length > MAX) this.metricsPack.channels.shift();


      this.metricsPack.txBytes.push(this.manager.txBytes);
      if (this.metricsPack.txBytes.length > MAX) this.metricsPack.txBytes.shift();

      this.metricsPack.rxBytes.push(this.manager.rxBytes);
      if (this.metricsPack.rxBytes.length > MAX) this.metricsPack.rxBytes.shift();

      this.metricsPack.unixTime = Math.floor(Date.now() / 1000);
      this.metricsPack.period = period;
      this.manager.txBytes = 0;
      this.manager.rxBytes = 0;


    }, 10000);
  }



  oneline(prn) {
    let memoryUse = memoryUsage();
    let memoryInfo = [{
      ...memoryUse
    }];

    if (prn) console.table(memoryInfo, ['rss', 'heapTotal', 'heapUsed', 'external', 'arrayBuffers']);

    let metric = [{
      lastSSID: this.manager.lastSSID,
      remotes: this.manager.remotes.size,
      channels: this.manager.channel_map.size,
      txBytes: this.manager.txBytes,
      rxBytes: this.manager.rxBytes,
    }];

    if (prn) console.table(metric, ['lastSSID', 'remotes', 'channels', 'txBytes', 'rxBytes']);

    return metric[0]
  }

  getRemotes(prn) {
    let remoteList = Array.from(this.manager.remotes.values());
    let remoteStates = remoteList.map(v => {
      return "#" + v.ssid + ":" + v.cid + "(" + v.state + ")"
    });
    if (prn) console.table(remoteStates);
    return remoteStates
  }

  getCIdList(prn) {
    let CIdList = Array.from(this.manager.cid2remote.keys());
    if (prn) console.table(CIdList);
    return CIdList
  }

  getChannelList(prn) {
    let chList = Array.from(this.manager.channel_map.keys());
    if (prn) console.table(chList);
    return chList
  }

  getSubscribers(ch) {
    let list = [];
    if (this.manager.channel_map.has(ch)) {
      let subscribers = this.manager.channel_map.get(ch); //set
      subscribers.forEach(c => {
        list.push(c.cid);
      });
    }
    // console.log(list)
    return list
  }

  getRemoteByCId(cid, mode = 1) {

    if (this.manager.cid2remote.has(cid)) {
      let remote = this.manager.cid2remote.get(cid);
      if (mode == 1) {
        return {
          ip: remote.ip,
          id: remote.cid,
          ssid: remote.ssid,
          cid: remote.cid,
          uid: remote.uid,
          uptime: Math.trunc((Date.now() - remote.socket.openTime) / 1000),
          tx: remote.socket.txCounter,
          rx: remote.socket.rxCounter,
          txBytes: remote.socket.bytesWritten || remote.socket._socket?.bytesWritten,
          rxBytes: remote.socket.bytesRead || remote.socket._socket?.bytesRead
        }
      } else if (mode == 2) {
        return {
          ip: remote.ip,
          uptime: Math.trunc((Date.now() - remote.socket.openTime) / 1000),
          nick: remote.nick,
          ssid: remote.ssid
        }
      } else if (mode == 3) {
        return {
          ip: remote.ip,
          uptime: Math.trunc((Date.now() - remote.socket.openTime) / 1000),
          nick: remote.nick,
          ssid: remote.ssid,
          isSecure: remote.TLS,
          isAuth: remote.boho.isAuthorized,
          encMode: ENC_MODE[remote.encMode]
        }
      } else if (mode == 4) {
        let channels = Array.from(remote.channels.keys());
        let set_memory = Array.from(remote.memory.keys());
        let retain_signal = Array.from(remote.retain_signal.keys());
        return {
          ip: remote.ip,
          uptime: Math.trunc((Date.now() - remote.socket.openTime) / 1000),
          channels: channels,
          set: set_memory,
          retain: retain_signal
        }
      }

    } else {
      return { result: "nop" }
    }

  }


}

const encoder = new TextEncoder();
const decoder$1 = new TextDecoder();

class Manager {

  constructor(server, authManager) {
    this.server = server;
    this.txBytes = 0;
    this.rxBytes = 0;

    this.authManager = authManager;

    this.connectionLogger;
    if (serverOption.fileLogger.connection.use) {
      this.connectionLogger = new FileLogger(serverOption.fileLogger.connection.path);
      // console.log('Manager: begin file logger [connection]')
    }

    this.attackLogger;
    if (serverOption.fileLogger.attack.use) {
      this.attackLogger = new FileLogger(serverOption.fileLogger.attack.path);
      // console.log('Manager: begin file logger.[attack]')
    }

    this.remotes = new Set();         // total remotes
    this.cid2remote = new Map();      // key: cid -> value: remote
    this.retain_messages = new Map();  // key: tag, data: signalMessage
    this.channel_map = new Map();      // key: channelName -> value: < remote : Set >
    this.CHANNEL_PREFIX = 'CH:';
    this.CID_PREFIX = 'CID:';
    this.metrics = new Metrics(this);
    this.lastSSID = 0;

    this.pingIntervalID = setInterval(e => {
      this.remotes.forEach(function each(remo) {
        let socket = remo.socket;
        if (socket.isAlive === false) {
          console.log('## timeout. cid:', remo.cid);
          remo.close();
        }

        socket.txCounter++;
        socket.isAlive = false;
        if (remo.socketType === 'websocket') {
          socket.ping();
        } else {
          remo.ping();
        }

      });
    }, serverOption.timeout);

    if (serverOption.showMetric) {
      this.monitIntervalID = setInterval((e) => {
        this.monitor();
      }, serverOption.monitorPeriod);
    }


  }


  addRemote(socket, req) {
    socket.isAlive = true;
    let remote = new Remote(socket, req, this);
    this.remotes.add(remote);
    remote.send( remote.boho.server_time_nonce() );
    remote.send( Buffer.from([ IOMsg.SERVER_READY]) );
    remote.setState(STATE.SERVER_READY);
    this.lastSSID = remote.ssid;
    let connectionInfo = `+ IP:${remote.ip} #${remote.ssid} ${socket.socketType === 'websocket' ? "WS" : "CS"} `;
    // console.log( connectionInfo)
    if (this.connectionLogger) this.connectionLogger.log(connectionInfo);
  };


  removeRemote(remote) {

    let remoteInfo = `- IP:${remote.ip} #${remote.ssid} cid:${remote.cid} ${remote?.socket.socketType === 'websocket' ? "WS" : "CS"} `;
    if (this.connectionLogger) this.connectionLogger.log(remoteInfo);
    this.deligateSignal(remote, '@state', 'close');
    this.deligateSignal(remote, '@$state', 'close');

    // remove subscriber 
    for (let ch of remote.channels.keys()) {
      if (this.channel_map.has(ch)) {
        const remotes = this.channel_map.get(ch);
        // console.log(`-- channel [ ${ch} ] removes subscriber id: ${remote.cid} `)
        remotes.delete(remote);
        if (remotes.size == 0) this.channel_map.delete(ch);
      }
    }

    // retain message policy
    // type 1. ( isAuthorizedUser) ? keep : delete.
    if (remote.boho.isAuthorized) ; else {
      // anonymouse: remove the cid publish channel
      for (let ch of remote.retain_signal.keys()) {
        // console.log('cid retain_signal.keys:', ch )
        ch = this.CID_PREFIX + remote.cid + '@' + ch;
        if (this.channel_map.has(ch)) {
          this.channel_map.delete(ch);
          // console.log(`-- deleted cid pub ch [ ${ch} ]. cid publisher id: ${remote.cid} `)
        }
      }
    }


    if (remote.uid && this.server.serviceNames.has('account')) {
      let req = { topic: 'detachUserRemote' };
      req.args = ['caller:manager.removeRemote'];
      this.server.emit('account', remote, req);
    }

    this.remotes.delete(remote);
    this.cid2remote.delete(remote.cid);
    remote = null;

  }


  // it's like unix wall command.
  serverSignal(obj) {
    let sigPack = M$1.pack(
      M$1.MB('#MsgType', '8', IOMsg.SERVER_SIGNAL),
      M$1.MB('#signalObject', obj)
    );

    this.remotes.forEach(remote => {
      remote.send_enc_mode(sigPack);
    });
  }

  getSignalTag(buffer) {
    let tagLen = buffer.readUint8(1);
    let tagBuf = buffer.subarray(2, 2 + tagLen);
    let tag = decoder$1.decode(tagBuf);
    return tag
  }

  getNewSignalTagMessage(buffer, newTag) {
    let msgType = buffer[0];
    let tagLen = buffer.readUint8(1);
    let newTagBuf = encoder.encode(newTag);
    let newTagLen = newTagBuf.byteLength;
    let payloadCunk = buffer.subarray(2 + tagLen);
    let newBuffer = Buffer.concat([Buffer.from([msgType, newTagLen]), newTagBuf, payloadCunk]);
    return newBuffer
  }


  // signaling to the cid subscribers.
  // example.  sending cid close signal.
  deligateSignal(remote, tag, ...args) {
    let sigPack = getSignalPack(tag, ...args);
    this.sender(tag, remote, sigPack);
  }

  adminSignal(cid, message) {
    if (this.cid2remote.has(cid)) {
      this.cid2remote.get(cid).send_enc_mode(message);
      return
    } else {
      return "no cid"
    }
  }

  serverSignalTo(tag, ...args) {
    let cid = tag.split('@')[0];
    let topic = tag.split('@')[1];
    if (cid && this.cid2remote.has(cid)) {
      let sigPack = getSignalPack('@' + topic, ...args);
      let targetRemote = this.cid2remote.get(cid);
      console.log('target', targetRemote.state, targetRemote.cid);
      targetRemote.send_enc_mode(sigPack);
      return
    } else {
      return "no cid"
    }
  }

  sender(tag, remote, message) {
    if (serverOption.membersOnly && !remote.boho.isAuthorized) {
      // console.log("### server reject client signal reason: [membersOnly]" ,tag, remote.cid  )
      remote.send(Buffer.from([IOMsg.AUTH_CLEAR]));
      remote.close();
      return ['err', 'unAuthorized']
    }

    if (tag.indexOf('$') == 0) return ['err', 'prefix $ is reserved for userSet tag.']

    let cidIndex = tag.indexOf('@');
    if (cidIndex === 0) {
      // ** CID_PUB multi-cast
      // [cid_pub]  @topic ,  @$retainTopic
      // modify signalpack with cid_appneded tag.
      tag = remote.cid + tag;
      message = this.getNewSignalTagMessage(message, tag);

    } else if (cidIndex > 0) {
      // uni-cast.  
      let targetCId = tag.split('@')[0];
      if (this.cid2remote.has(targetCId)) {
        //rm cid from tag.
        let ommitCIdTag = '@' + tag.split('@')[1];
        // console.log('uni-cast tag change from', tag, 'to' , ommitCIdTag )
        message = this.getNewSignalTagMessage(message, ommitCIdTag);
        // console.log(`origin tag: ${tag} omitTag: ${this.getSignalTag(message)}`)
        this.cid2remote.get(targetCId).send_enc_mode(message);
        return ['ok', 1]
      }
      return ['err', 'Invalid cid']
    } else ;


    /**
     * multi-cast: 
     * channel_publish 
     * or cid_publish
     */

    // HOME_CHANNEL substitution.
    // (blank)#topic  ->  home_channel#topic. 
    if (tag.indexOf('#') === 0) {
      tag = remote.HOME_CHANNEL + tag;
    } else if (tag.includes('@')) {
      tag = this.CID_PREFIX + tag;
    } else {
      tag = this.CHANNEL_PREFIX + tag;
    }

    // retain signal message
    if (tag.includes('$')
      // && remote.boho.isAuthorized
      && serverOption.retain.isAvailable
      && serverOption.retain.limitCounter > this.retain_messages.size
      && serverOption.retain.limitSize > message.byteLength
    ) {
      // cid retain signal
      if (tag.includes('@')) {
        // cid retain signal stored inside remote.
        let retainTag = tag.split('@')[1];
        remote.retain_signal.set(retainTag, message);
      } else {
        // channel retain signal stored inside manager.
        this.retain_messages.set(tag, message);
      }

    }

    let sentCounter = 0;
    if (this.channel_map.has(tag)) {
      // console.log('raw channel_map matched tag:', tag)
      let remotes = this.channel_map.get(tag);
      if (remotes.size >= 1) {
        let limit;
        if (serverOption.useQuota.publishCounter) {
          limit = Math.min(remote.quota.publishCounter, remotes.size);
        } else {
          limit = remotes.size;
        }
        let peers = remotes.values();
        while (sentCounter < limit) {
          let c = peers.next().value;
          if (!c) {
            // console.log('## null remote' )
            break;
          }
          // change: from v4.x allow receiveSelfMessages.
          // if (c !== remote) { 
            c.send_enc_mode(message);
            sentCounter++;
          // }
        }

        // if (serverOption.useQuota.publishCounter) {
        //   // console.log(`pub >> [${tag}] sent: ${sentCounter} [use quota limit: ${remote.quota.publishCounter }] total: ${remotes.size} subscribers. ` )
        // } else {
        //   // console.log(`pub >> [${tag}] sent: ${sentCounter} [no quota limit] total: ${remotes.size} subscribers. ` )
        // }
        return ['ok', sentCounter]
      }
    }
    // console.log('-- No subscriber. ch: ' , tag )
    return ['err', 'No subscriber.']
  }



  subscribe(chArr, remote) {
    chArr.forEach(tag => {
      if (tag.indexOf('#') === 0) {
        tag = remote.HOME_CHANNEL + tag;
      } else if (tag.includes('@')) {
        tag = this.CID_PREFIX + tag;
      } else {
        tag = this.CHANNEL_PREFIX + tag;
      }

      // 1. set channel map
      if (this.channel_map.has(tag)) {
        this.channel_map.get(tag).add(remote);
      } else {
        this.channel_map.set(tag, new Set([remote]));
      }

      // 2.add to remote channels.
      remote.channels.add(tag);

      // 3. send retain message if available.
      if (tag.includes('$')
        && serverOption.retain.isAvailable
      ) {
        let retainMessage;
        if (tag.includes('@')) {
          let cid = tag.split('@')[0];
          cid = cid.split(this.CID_PREFIX)[1];
          let retainTag = tag.split('@')[1];
          if (this.cid2remote.has(cid)) {
            retainMessage = this.cid2remote.get(cid).retain_signal.get(retainTag);
          } else {
            // console.log('cid subscribe is rejected. not online:', cid)
            return;
          }

        } else if (this.retain_messages.has(tag)) {
          retainMessage = this.retain_messages.get(tag);
        }
        if (retainMessage) remote.send_enc_mode(retainMessage);

      }

    });
    return remote.channels.size;
  }

  unsubscribe(chArr, remote) {
    //unsubscribe all channels of the remote.
    if (chArr.length == 1 && chArr[0] == "") {

      remote.channels.forEach(ch => {
        if (this.channel_map.has(ch)) {
          let remotes = this.channel_map.get(ch);
          remotes.delete(remote);
          if (remotes.size == 0) this.channel_map.delete(ch);
        }
      });
      remote.channels.clear();

    } else {
      // unsubscribe each channels.
      chArr.forEach(ch => {
        // substitution home_channel
        if (ch.indexOf('#') === 0) {
          ch = remote.HOME_CHANNEL + ch;
        } else if (ch.includes('@')) {
          ch = this.CID_PREFIX + ch;
        } else {
          ch = this.CHANNEL_PREFIX + ch;
        }
        // console.log('-- Manager::unsubscribe:', ch )

        // delete manager map.
        if (this.channel_map.has(ch)) {
          let remotes = this.channel_map.get(ch);
          remotes.delete(remote);
          if (remotes.size == 0) this.channel_map.delete(ch);
        }
        remote.channels.delete(ch);
      });
    }

    // console.log( '-- result unsub:', remote.channels )

  }


  monitor() {
    if (process.stdout.isTTY) {
      process.stdout.cursorTo(0, 0);
      process.stdout.clearScreenDown();
    }

    if (serverOption.showChannel > 0) {
      this.metrics.channels(serverOption.showChannel);
    }
    let mode = parseInt(serverOption.showMetric);
    switch (mode) {
      case 1:
        this.metrics.oneline(true);
        break;
      case 2:
        this.metrics.getRemotes(true);
        break;
      case 3:
        this.metrics.getChannelList(true);
        break;
    }

  }


  closeRemoteByCId(cid) {
    if (this.cid2remote.has(cid)) {
      this.cid2remote.get(cid).close();
      return 1
    } else {
      return 0
    }
  }

  close() {
    clearInterval(this.pingIntervalID);
    if (this.monitIntervalID) {
      clearInterval(this.monitIntervalID);
    }

    this.remotes.forEach(remote => {
      remote.close();
    });

    this.remotes.clear();
    this.cid2remote.clear();
    this.retain_messages.clear();
    this.channel_map.clear();

  }
}

const STATUS = {
  OK: 0,
  //0~127: success
  //128~255: fail
  ERROR: 255
};

class Server extends require$$0$3 {

  constructor(options, authManager) {
    super();
    this.serviceNames = new Set();
    this.wss = {};
    this.port = null;
    this.congPort = null;

    if (options.timeout) {
      let pingT = parseInt(options.timeout);
      if (pingT && pingT >= 1000) serverOption.timeout = pingT;
    }
    if (options.monitorPeriod) {
      let monitorT = parseInt(options.monitorPeriod);
      if (monitorT && monitorT >= 1000) serverOption.monitorPeriod = monitorT;
    }
    if (options.showMessage) {
      serverOption.showMessage = options.showMessage;
    }
    if (options.showMetric) {
      serverOption.showMetric = options.showMetric;
    }
    if (options.membersOnly) {
      serverOption.membersOnly = options.membersOnly;
    }


    if (options.port || options.port == 0) {
      this.port = parseInt(options.port);
    }

    if (options.httpServer) {
      this.httpServer = options.httpServer;
    }

    if (options.wsPath) {
      this.wsPath = options.wsPath;
    }

    if (options.congPort || options.congPort == 0) {
      this.congPort = parseInt(options.congPort);
    }

    this.manager = new Manager(this, authManager);

    this.serverCountToListen = 0;
    this.listeningServerCount = 0;
    if (this.port || this.port == 0 || this.httpServer) this.serverCountToListen++;
    if (this.congPort || this.congPort == 0) this.serverCountToListen++;

    if (this.serverCountToListen === 0) {
      throw new Error('Cannot create Server: At least one of "port", "httpServer", or "congPort" must be specified.');
    } else {
      if (this.port || this.port == 0 || this.httpServer) this.startWSServer();
      if (this.congPort || this.congPort == 0) this.startCongServer();
    }

  }


  startWSServer() {
    // console.log('optoins', options )
    if (this.port || this.port == 0) {
      this.wss = new WebSocketServer({ port: this.port , path: this.wsPath });
    } else if (this.httpServer ) {
      this.wss = new WebSocketServer({ server: this.httpServer, path: this.wsPath });
    } else {
      throw new TypeError(
        'One and only one of the "port", "httpServer"' +
        'must be specified'
      );
    }

    this.wss.once('listening', () => {
      this.port = this.wss.address().port;
      // console.log('wss server bound port:',  this.port );
      this.listeningServerCount++;
      if (this.listeningServerCount === this.serverCountToListen) {
        this.emit('ready');
      }
    });

    // this.wss.setMaxListeners(0)
    this.wss.on('error', (err) => {
      console.error('### ws server error:', err.message);
      if (err.code == 'EADDRINUSE') {
        process.exit();
      }
    });

    this.wss.on('close', () => {
      // console.log('### WS server is closed.')
    });

    this.wss.on('connection', (ws, req) => {
      ws.socketType = 'websocket';
      this.manager.addRemote(ws, req);
    });


  }

  startCongServer() {
    this.congServer = net.createServer((socket) => {
      this.manager.addRemote(socket);
    })
      .on('error', (err) => {
        console.log('### cong server error:', err.message);
        if (err.code == 'EADDRINUSE') {
          process.exit();
        }
      }).on('close', () => {
        // console.log('### congsocket server is closed.')
      }).listen(this.congPort, () => {
        this.congPort = this.congServer.address().port;
        // console.log('congsocket server bound port:', this.congPort );
        this.listeningServerCount++;
        if (this.listeningServerCount === this.serverCountToListen) {
          this.emit('ready');
        }
      });
  }

/**
 * RPC service register.
 * service: service_name <string>
 * service_module <function module|class instance>
 * return this
 */
  attach(service, service_module) {

    if( typeof service !== 'string'){
      throw new Error(`attach service name is not a string.`)
    }
    if (!service_module.checkPermission || typeof service_module.checkPermission != 'function') {
      throw new Error(`Service ${service} : no checkPermission or not a function.`)
    }
    if(!service_module.commands || !Array.isArray(service_module.commands) ){
      throw new Error(`Service ${service} : no commands or !Array.`)
    }
    
    // Service TYPE 1. single call() function.
    if ( service_module.call && typeof service_module.call == 'function' ) {
      this.on(service, (remote, req) => {
        try {
          if (!service_module.checkPermission(remote, req)) {
            remote.response(req.mid, STATUS.ERROR, "NO_PERMISSION.");
            return
          }
          if( service_module.commands.includes( req.topic )){
            // console.log('server service_module req', req )
            service_module.call(remote, req);
          }else {
            remote.response(req.mid, STATUS.ERROR, "UNKNOWN_COMMAND");
          }
        } catch (error) {
          console.error(`Unhandled Service Error in service [${service}]:`, error);
          remote.response(req.mid, STATUS.ERROR, "INTERNAL_SERVER_ERROR");
        }
      });
    } else {
      // Service TYPE 2. multiple functions.
      this.on(service, (remote, req) => {
        try {
          if (!service_module.checkPermission(remote, req)) {
            remote.response(req.mid, STATUS.ERROR, "NO_PERMISSION.");
            return
          }
          if( service_module.commands.includes( req.topic )){
            service_module[req.topic](remote, req);
          }else {
            remote.response(req.mid, STATUS.ERROR, "UNKNOWN_COMMAND");
          }
        } catch (error) {
          console.error(`Unhandled Service Error in service [${service}]:`, error);
          remote.response(req.mid, STATUS.ERROR, "INTERNAL_SERVER_ERROR");
        }
      });
    }
    this.serviceNames.add(service);
    // console.log(`[Service attached: ${service} ] accept commands: ${service_module.commands}`)
    return this
  }

  close(callback) {
    console.log('closing iosignal server...');
    if (this.manager) {
      this.manager.close();
    }

    this.serviceNames.forEach(v => this.removeAllListeners(v));
    this.serviceNames.clear();

    let serverCount = 0;
    if (this.wss) serverCount++;
    if (this.congServer) serverCount++;

    if (serverCount === 0) {
      if (callback) process.nextTick(callback);
      return;
    }

    let closedCount = 0;
    const onClosed = () => {
      closedCount++;
      if (closedCount === serverCount) {
        console.log('IOSignal server is closed.');
        if (callback) callback();
      }
    };

    if (this.wss) {
      this.wss.close(() => {
        // console.log('wss server closed.')
        onClosed();
      });
    }

    if (this.congServer) {
      this.congServer.close((err) => {
        // if (err) console.error('congServer close error', err)
        // console.log('cong server closed.')
        onClosed();
      });
    }
  }

}

const decoder = new TextDecoder();
class BohoAuth {
  constructor(keyProvider) {
    if (!keyProvider) {
      throw new Error('BohoAuth must be initialized with a keyProvider.');
    }
    this.keyProvider = keyProvider;
    this.keepOldConnection = true;
    this.authLogger;
    if (serverOption.fileLogger.auth.use) {
      this.authLogger = new FileLogger(serverOption.fileLogger.auth.path);
      console.log('Auth: begin file logger.[auth]');
    }
  }

  send_auth_fail(peer, reason) {
    if (this.authLogger) {
      let peerInfo = `FAIL #${peer.ssid} reason:${reason} `;
      this.authLogger.log(peerInfo);
    }
    // console.log('##### AUTH_FAIL reason: ', reason)
    peer.setState(STATE.AUTH_FAIL);
    // add some delay time.
    setTimeout(e => {
      peer.send(Buffer.from([tt.BohoMsg.AUTH_FAIL]));
    }, serverOption.auth.delay_auth_fail);
  }


  async verify_auth_req(auth_req, peer) {
    try {
      //1. unpack 
      let infoPack = M$1.unpack(auth_req, tt.Meta.AUTH_REQ);
      if (!infoPack) {
        this.send_auth_fail(peer, 'unpack auth_pack fail');
        return
      }

      let id = "";
      if (infoPack.id8.includes(0)) {
        id = decoder.decode(infoPack.id8.subarray(0, infoPack.id8.indexOf(0)));
      } else {
        id = decoder.decode(infoPack.id8);
      }

      //2. get key of id from DB
      let authInfo = await this.keyProvider.getAuth(id);
      if (!authInfo) {
        this.send_auth_fail(peer, 'NO ID:' + id);
        return
      }

      if (serverOption.debug.showAuthInfo) {
        console.log('[debug]showAuthInfo', authInfo);
      }

      peer.boho.copy_id8(infoPack.id8);
      // type of key
      let authKey;
      const SHA256_HASH_BASE64_LEN = 44;
      if (authInfo.key.length == SHA256_HASH_BASE64_LEN) {
        // hashed key
        authKey = Buffer.from(authInfo.key, 'base64');
        peer.boho.copy_key(authKey);
      } else {
        // plain key
        peer.boho.set_key(authInfo.key);
      }

      //3. check hmac
      let auth_res = peer.boho.verify_auth_req(infoPack);
      if (!auth_res) {
        this.send_auth_fail(peer, 'hmac dismatched');
        return
      }

      //4. get info

      //5. check duplicate login.
      if (peer.manager.cid2remote.has(authInfo.cid)) {
        let old = peer.manager.cid2remote.get(authInfo.cid);
        console.log('[WARN]DUPLICATE_LOGIN detected.', old.cid);
        old.ping(); // check the connection.
        if (old == peer) {
          console.log('## trying to RELOGIN after login.');
          return
        }

        let authClearSignal = M$1.pack(
          M$1.MB('#MsgType', '8', IOMsg.AUTH_CLEAR),
          M$1.MB('#reason', 'duplicate login.')
        );
        if (this.keepOldConnection) { // default true
          // keep old connection. reject new connection by sending auth_fail signal.
          // peer.send(authClearSignal)
          if( peer.socketType == 'websocket'){
            this.send_auth_fail(peer, 'duplicate login');
          }else {
            peer.close(); //arduino 
          }
        } else {
          // accept new connection. stop the old connection by sending auth_clear signal.
          old.send(authClearSignal);
          peer.close();
        }
        return
      }

      //6. delete current (or anonymouse)cid if exist.
      if (peer.cid) {
        // console.log('if peer has cid', peer.cid)
        peer.manager.cid2remote.delete(peer.cid);
      }

      //7. setting info.
      peer.did = id;
      peer.cid = authInfo.cid;
      peer.nick = authInfo.cid; // temporary: nick as cid
      if (authInfo.uid) peer.uid = authInfo.uid;

      //8. setting quota level. 
      let quotaLevel = serverOption.defaultQuotaIndex;
      if (authInfo.level) quotaLevel = authInfo.level;
      quotaLevel = parseInt(quotaLevel);
      let newQuota = quotaTable[quotaLevel];
      if (!newQuota) {
        let err = 'no index quotaTable for auth.level: ' + quotaLevel;
        this.send_auth_fail(peer, err);
        return
      } else {
        peer.level = quotaLevel;
        peer.quota = newQuota;
      }

      if (peer.level === serverOption.adminLevel) {
        console.log('## LOGIN ADMIN CID:', peer.cid);
        peer.isAdmin = true;
      }
      // send quota.level
      peer.send(Buffer.from([IOMsg.QUOTA_LEVEL, quotaLevel]));

      //9. set cid2remote
      peer.manager.cid2remote.set(peer.cid, peer);
      //10. send ack.
      peer.send(auth_res);
      peer.setState(STATE.AUTH_RES);
      if (this.authLogger) {
        let peerInfo = `OK #${peer.ssid} cid: ${peer.cid} did:${peer.did}`;
        if (peer.isAdmin) peerInfo = "#ADMIN# " + peerInfo;
        this.authLogger.log(peerInfo);
      }
      return authInfo
    } catch (error) {
      console.log('verify_auth_req error', error);
      this.send_auth_fail(peer, '[BohoAuth]caught: unknown error:' + error);
    }
  }

  async getAuth(id) {
    return this.keyProvider.getAuth(id);
  }

  async getAuthIdList() {
    if (typeof this.keyProvider.getAuthIdList === 'function') {
      return this.keyProvider.getAuthIdList();
    }
  }

  async addAuth(id, keyStr, cid, level = 0) {
    if (typeof this.keyProvider.addAuth === 'function') {
      return this.keyProvider.addAuth(id, keyStr, cid, level);
    }
  }

  async delAuth(id) {
    if (typeof this.keyProvider.delAuth === 'function') {
      return this.keyProvider.delAuth(id);
    }
  }

  async save() {
    if (typeof this.keyProvider.save === 'function') {
      return this.keyProvider.save();
    }
  }


}

class FileKeyProvider {
  constructor(_path) {
    this.AUTH = new Map();
    let pathObj = path.parse(_path);
    this.path = path.resolve(_path);
    console.log('auth from file path:', this.path);
    let ext = pathObj.ext;
    if (ext.toLowerCase() == '.js') {
      // Read auth data from file
      console.log("#JS path:", this.path);
      this.loadAuthInfoFile_JS(this.path);
    } else if (ext.toLowerCase() == '.json') {
      console.log("#JSON path:", this.path);
      this.loadAuthInfoFile_JSON(this.path);
    } else {
      console.log('no authinfofile path.');
    }
  }

  //loaded when server start.
  loadAuthInfoFile_JS(path) {
    import(path).then((file) => {
      console.log(file.authInfo);
      file.authInfo.forEach(item => {
        this.addAuth(...item);
      });
      console.log('total AUTH INFO size: ', this.AUTH.size);
    }).catch(e => {
      console.log(e);
    });
  }

  loadAuthInfoFile_JSON(path) {
    let file = readFileSync(path);
    file = new TextDecoder().decode(file);
    let list = JSON.parse(file);
    list.forEach(item => {
      this.addAuth(...item);
    });
    console.log('total AUTH INFO size: ', this.AUTH.size);
  }

  async getAuth(id) {
    return this.AUTH.get(id)
  }

  async getAuthIdList() {
    return Array.from(this.AUTH.keys())
  }

  addAuth(id, keyStr, cid, level = 0) {
    let Base64hashKey = Buffer.from(tt.sha256.hash(keyStr)).toString('base64');
    this.AUTH.set(id, { key: Base64hashKey, cid: cid, level: level });
  }
}

const DEVICE_PREFIX = "device:";

class RedisKeyProvider {
  constructor(redisClient) {
    if (!redisClient) {
      throw new Error("RedisKeyProvider constructor: no redisClient")
    }
    this.redis = redisClient;
  }

  // get device key from DB. (for Boho auth.)
  async getAuth(id) {
    try {
      let result = await this.redis.hGetAll(DEVICE_PREFIX + id);
      if (result && result.key) return result
      else return null;
    } catch (error) {
      console.log('getAuth', error);
    }
  }

  //sudoService call
  async getAuthIdList() {
    let result = await this.redis.keys(DEVICE_PREFIX + '*');
    result = result.map(v => {
      return v.split(':')[1]
    });
    if (result) return result
  }

  // add device auth info
  async addAuth(id, keyStr, cid = '', level = 0) {
    let Base64hashKey = Buffer.from(tt.sha256.hash(keyStr)).toString('base64');
    return this.redis.hSet(DEVICE_PREFIX + id, { 'key': Base64hashKey, 'cid': cid, 'level': level })
  }

  //sudoService call
  async delAuth(id) {
    return this.redis.del(DEVICE_PREFIX + id)
  }

  async save(id) {
    return this.redis.save()
  }
}

/**
 * StringKeyProvider.js
 * 
 * authInfo <String>
 *  id: max 8chars
 *  key: ~44 base64 chars recomended
 *  cid: 
 *  level: range: 0~255
 *  separator: ',' for multiple devices.
 * 
 * example => authInfo = 'id1.key1.cid1.255,id2.key2.cid2.200'
 */


class StringKeyProvider {
  constructor(authInfo) {

    if (!authInfo) {
      throw TypeError("StringKeyProvider constructor() missing authInfo.")
    }

    let id_keys = authInfo.split(',');

    this.AUTH = new Map();

    if (id_keys.length >= 1) {
      id_keys.forEach(v => {
        let [ did, key, cid, level ]  = v.split('.');
        level = parseInt(level);
        if (did && key && cid && typeof level == 'number') {
          this.addAuth(did, key, cid, level);
        } else {
          throw TypeError("StringKeyProvider invalid authInfo.")
        }
      });
    } else {
      throw TypeError("StringKeyProvider invalid authInfo.")
    }

  }

  async getAuth(id) {
    return this.AUTH.get(id)
  }
  async getAuthIdList() {
    return Array.from(this.AUTH.keys())
  }

  addAuth(id, keyStr, cid, level = 0) {
    let Base64hashKey = Buffer.from(tt.sha256.hash(keyStr)).toString('base64');
    this.AUTH.set(id, { key: Base64hashKey, cid: cid, level: level });
  }
}

const commands$1 = ['echo', 'date', 'unixtime'];

const MIN_LEVEL$2 = 0;
function checkPermission$1(remote) {
  return (remote.level >= MIN_LEVEL$2) ? true : false;
}

/**
 * client api call example:  await io.call('reply','echo','hello')
 */
async function echo(remote, req) {
  if (!req.args)
    remote.response(req.mid, STATUS.ERROR, 'no message to echo');
  else
    remote.response(req.mid, STATUS.OK, req.args);
}

/**
 * client api call example:  await io.call('reply','date')
 */
async function date(remote, req) {
  let r = new Date().toUTCString();
  remote.response(req.mid, STATUS.OK, r);
}

/**
 * client api call example:  await io.call('reply','unixtime')
 */
async function unixtime(remote, req) {
  let r = Math.floor(Date.now() / 1000);
  remote.response(req.mid, STATUS.OK, r);
}

var replyService = /*#__PURE__*/Object.freeze({
  __proto__: null,
  checkPermission: checkPermission$1,
  commands: commands$1,
  date: date,
  echo: echo,
  unixtime: unixtime
});

const commands = [
  'cid', 'remotes', 'clients',
  'channels', 'subscribers',
  'remote', 'client', 'close',
  'addauth', 'getauth', 'delauth',
  'getauthidlist', 'getdevicelist',
  'adddevice', 'getdevice', 'deldevice'
];

const MIN_LEVEL$1 = 255;
function checkPermission(remote) {
  return (remote.level >= MIN_LEVEL$1) ? true : false;
}

async function call(remote, req) {
  let result;
  let status = 0;
  try {
    let cmd = req.topic;
    cmd = cmd.toLowerCase();
    if (cmd == 'cid') {
      result = remote.manager.metrics.getCIdList();
    } else if (cmd == 'remotes' || cmd == 'clients') {
      result = remote.manager.metrics.getRemotes();
    } else if (cmd == 'channels') {
      result = remote.manager.metrics.getChannelList();
    } else if (cmd == 'subscribers') {
      let ch = req.$[0];
      if (ch) result = remote.manager.metrics.getSubscribers(ch);
    } else if (cmd == 'remote' || cmd == 'client') {
      let cid = req.$[0];
      let mode = req.$[1];
      if (cid) result = remote.manager.metrics.getRemoteByCId(cid, mode);

    } else if (cmd == 'close') {
      if (req.$[0]) result = remote.manager.closeRemoteByCId(req.$[0]);

    } else if (cmd == 'addauth' || cmd == 'adddevice') {
      if (remote.manager.authManager && req.$.length == 4) {
        if (remote.manager.authManager.addAuth) {
          let did = req.$[0];
          let dkey = req.$[1];
          let cid = req.$[2];
          let level = req.$[3];
          result = await remote.manager.authManager.addAuth(did, dkey, cid, level);
        }

      }
    } else if (cmd == 'delauth' || cmd == 'deldevice') {
      if (remote.manager.authManager && req.$.length == 1) {
        if (remote.manager.authManager.delAuth) {
          let did = req.$[0];
          result = await remote.manager.authManager.delAuth(did);
        }
      }
    } else if (cmd == 'getauth' || cmd == 'getdevice') {
      if (remote.manager.authManager && req.$.length == 1) {
        if (remote.manager.authManager.getAuth) {
          let did = req.$[0];
          result = await remote.manager.authManager.getAuth(did);
        }
      }
    } else if (cmd == 'getauthidlist' || cmd == 'getdevicelist') {
      if (remote.manager.authManager) {
        if (remote.manager.authManager.getAuthIdList) {
          result = await remote.manager.authManager.getAuthIdList();
        }
      }
    } else {
      status = STATUS.ERROR;
      result = "service sudo: no such a cmd: " + cmd;
    }

    remote.response(req.mid, status, result);

  } catch (e) {
    remote.response(req.mid, STATUS.ERROR, e.message);
  }

}

var sudoService = /*#__PURE__*/Object.freeze({
  __proto__: null,
  call: call,
  checkPermission: checkPermission,
  commands: commands
});

/**
 * RedisService <IOSignal RPC Service>
 * 
 * iosignal 클라이언트의 redis 질의 요청을 받으면, 
 * redisClient 로 연결된 redis-server 에게 질의 후 결과를 되돌려 준다. 
 * 
 * client ex:  
 * await io.call('redis','hget','user:id' )
 * 
 */

const MIN_LEVEL = 200;
const COMMANDS = [
  'GET', 'SET', 'HGETALL', 'HGET', 'HSET', 'SADD', 'SISMEMBER',
  'SMEMBERS', 'EXISTS', 'SREM', 'DEL', 'KEYS', 'SAVE',
  'get', 'set', 'hGetAll', 'hGet', 'hSet', 'sAdd', 'sIsMember',
  'sMembers', 'exists', 'sRem', 'del', 'keys', 'save'
];

class RedisService {
  constructor(redisClient, _minLevel) {
    if (!redisClient) {
      throw new Error("RedisService constructor: no redisClient")
    }
    this.redisClient = redisClient;
    this.minLevel = _minLevel ? _minLevel : MIN_LEVEL;
    this.commands = COMMANDS;
  }

  checkPermission(remote, req) {
    return (remote.level >= this.minLevel) ? true : false;
  }

  async call(remote, req) {
    let result;
    try {
      let cmd = req.topic;
      if (req.args?.length > 0) {
        result = await this.redisClient[cmd](...req.args);
      } else {
        result = await this.redisClient[cmd]();
      }
      remote.response(req.mid, STATUS.OK, result);
    } catch (e) {
      remote.response(req.mid, STATUS.ERROR, e.message);
    }
  }

}

const version = pkg.version;

export { tt as Boho, BohoAuth, CongRx, ENC_MODE, FileKeyProvider, FileLogger, IOWS as IO, IOCongSocket, IOMsg, M$1 as MBP, PAYLOAD_TYPE, RedisKeyProvider, RedisService, SIZE_LIMIT, STATE, STATUS$1 as STATUS, Server, StringKeyProvider, delay, getIPv4HexString, getLocalAddress, getPayloadFromSignalPack, getSignalPack, isPrivateIP, numberWithCommas, pack, parsePayload, replyService, serverOption, sudoService, version };
