import require$$0$2, { Transform } from 'stream';
import net, { isIPv4 } from 'net';
import require$$0$3 from 'events';
import require$$1$1 from 'https';
import http from 'http';
import require$$4 from 'tls';
import require$$1 from 'crypto';
import require$$7 from 'url';
import require$$0 from 'zlib';
import require$$0$1 from 'buffer';
import require$$2 from 'util';
import { performance as performance$1, monitorEventLoopDelay } from 'node:perf_hooks';
import { isIPv4 as isIPv4$1, isIP } from 'node:net';
import { networkInterfaces } from 'os';
import fs, { readFileSync as readFileSync$1 } from 'fs';
import { memoryUsage } from 'process';
import { readFile } from 'node:fs/promises';
import { timingSafeEqual, createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { totalmem } from 'node:os';
import path from 'path';

var version$1 = "10.1.2";
var pkg = {
	version: version$1};

var t$1,e$1={},r$1={};var n$1,i$1,o$1={};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */function f$1(){return n$1||(n$1=1,o$1.read=function(t,e,r,n,i){var o,f,u=8*i-n-1,s=(1<<u)-1,a=s>>1,h=-7,c=r?i-1:0,l=r?-1:1,p=t[e+c];for(c+=l,o=p&(1<<-h)-1,p>>=-h,h+=u;h>0;o=256*o+t[e+c],c+=l,h-=8);for(f=o&(1<<-h)-1,o>>=-h,h+=n;h>0;f=256*f+t[e+c],c+=l,h-=8);if(0===o)o=1-a;else {if(o===s)return f?NaN:1/0*(p?-1:1);f+=Math.pow(2,n),o-=a;}return (p?-1:1)*f*Math.pow(2,o-n)},o$1.write=function(t,e,r,n,i,o){var f,u,s,a=8*o-i-1,h=(1<<a)-1,c=h>>1,l=23===i?Math.pow(2,-24)-Math.pow(2,-77):0,p=n?0:o-1,y=n?1:-1,g=e<0||0===e&&1/e<0?1:0;for(e=Math.abs(e),isNaN(e)||e===1/0?(u=isNaN(e)?1:0,f=h):(f=Math.floor(Math.log(e)/Math.LN2),e*(s=Math.pow(2,-f))<1&&(f--,s*=2),(e+=f+c>=1?l/s:l*Math.pow(2,1-c))*s>=2&&(f++,s/=2),f+c>=h?(u=0,f=h):f+c>=1?(u=(e*s-1)*Math.pow(2,i),f+=c):(u=e*Math.pow(2,c-1)*Math.pow(2,i),f=0));i>=8;t[r+p]=255&u,p+=y,u/=256,i-=8);for(f=f<<i|u,a+=i;a>0;t[r+p]=255&f,p+=y,f/=256,a-=8);t[r+p-y]|=128*g;}),o$1}
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */var u$1=(i$1||(i$1=1,function(e){const n=function(){if(t$1)return r$1;t$1=1,r$1.byteLength=function(t){var e=u(t),r=e[0],n=e[1];return 3*(r+n)/4-n},r$1.toByteArray=function(t){var e,r,o=u(t),f=o[0],s=o[1],a=new i(function(t,e,r){return 3*(e+r)/4-r}(0,f,s)),h=0,c=s>0?f-4:f;for(r=0;r<c;r+=4)e=n[t.charCodeAt(r)]<<18|n[t.charCodeAt(r+1)]<<12|n[t.charCodeAt(r+2)]<<6|n[t.charCodeAt(r+3)],a[h++]=e>>16&255,a[h++]=e>>8&255,a[h++]=255&e;return 2===s&&(e=n[t.charCodeAt(r)]<<2|n[t.charCodeAt(r+1)]>>4,a[h++]=255&e),1===s&&(e=n[t.charCodeAt(r)]<<10|n[t.charCodeAt(r+1)]<<4|n[t.charCodeAt(r+2)]>>2,a[h++]=e>>8&255,a[h++]=255&e),a},r$1.fromByteArray=function(t){for(var r,n=t.length,i=n%3,o=[],f=16383,u=0,s=n-i;u<s;u+=f)o.push(a(t,u,u+f>s?s:u+f));return 1===i?(r=t[n-1],o.push(e[r>>2]+e[r<<4&63]+"==")):2===i&&(r=(t[n-2]<<8)+t[n-1],o.push(e[r>>10]+e[r>>4&63]+e[r<<2&63]+"=")),o.join("")};for(var e=[],n=[],i="undefined"!=typeof Uint8Array?Uint8Array:Array,o="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",f=0;f<64;++f)e[f]=o[f],n[o.charCodeAt(f)]=f;function u(t){var e=t.length;if(e%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var r=t.indexOf("=");return  -1===r&&(r=e),[r,r===e?0:4-r%4]}function s(t){return e[t>>18&63]+e[t>>12&63]+e[t>>6&63]+e[63&t]}function a(t,e,r){for(var n,i=[],o=e;o<r;o+=3)n=(t[o]<<16&16711680)+(t[o+1]<<8&65280)+(255&t[o+2]),i.push(s(n));return i.join("")}return n["-".charCodeAt(0)]=62,n["_".charCodeAt(0)]=63,r$1}(),i=f$1(),o="function"==typeof Symbol&&"function"==typeof Symbol.for?Symbol.for("nodejs.util.inspect.custom"):null;e.Buffer=a,e.SlowBuffer=function(t){return +t!=t&&(t=0),a.alloc(+t)},e.INSPECT_MAX_BYTES=50;const u=2147483647;function s(t){if(t>u)throw new RangeError('The value "'+t+'" is invalid for option "size"');const e=new Uint8Array(t);return Object.setPrototypeOf(e,a.prototype),e}function a(t,e,r){if("number"==typeof t){if("string"==typeof e)throw new TypeError('The "string" argument must be of type string. Received type number');return l(t)}return h(t,e,r)}function h(t,e,r){if("string"==typeof t)return function(t,e){if("string"==typeof e&&""!==e||(e="utf8"),!a.isEncoding(e))throw new TypeError("Unknown encoding: "+e);const r=0|d(t,e);let n=s(r);const i=n.write(t,e);return i!==r&&(n=n.slice(0,i)),n}(t,e);if(ArrayBuffer.isView(t))return function(t){if(H(t,Uint8Array)){const e=new Uint8Array(t);return y(e.buffer,e.byteOffset,e.byteLength)}return p(t)}(t);if(null==t)throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof t);if(H(t,ArrayBuffer)||t&&H(t.buffer,ArrayBuffer))return y(t,e,r);if("undefined"!=typeof SharedArrayBuffer&&(H(t,SharedArrayBuffer)||t&&H(t.buffer,SharedArrayBuffer)))return y(t,e,r);if("number"==typeof t)throw new TypeError('The "value" argument must not be of type number. Received type number');const n=t.valueOf&&t.valueOf();if(null!=n&&n!==t)return a.from(n,e,r);const i=function(t){if(a.isBuffer(t)){const e=0|g(t.length),r=s(e);return 0===r.length||t.copy(r,0,0,e),r}return void 0!==t.length?"number"!=typeof t.length||Z(t.length)?s(0):p(t):"Buffer"===t.type&&Array.isArray(t.data)?p(t.data):void 0}(t);if(i)return i;if("undefined"!=typeof Symbol&&null!=Symbol.toPrimitive&&"function"==typeof t[Symbol.toPrimitive])return a.from(t[Symbol.toPrimitive]("string"),e,r);throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof t)}function c(t){if("number"!=typeof t)throw new TypeError('"size" argument must be of type number');if(t<0)throw new RangeError('The value "'+t+'" is invalid for option "size"')}function l(t){return c(t),s(t<0?0:0|g(t))}function p(t){const e=t.length<0?0:0|g(t.length),r=s(e);for(let n=0;n<e;n+=1)r[n]=255&t[n];return r}function y(t,e,r){if(e<0||t.byteLength<e)throw new RangeError('"offset" is outside of buffer bounds');if(t.byteLength<e+(r||0))throw new RangeError('"length" is outside of buffer bounds');let n;return n=void 0===e&&void 0===r?new Uint8Array(t):void 0===r?new Uint8Array(t,e):new Uint8Array(t,e,r),Object.setPrototypeOf(n,a.prototype),n}function g(t){if(t>=u)throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+u.toString(16)+" bytes");return 0|t}function d(t,e){if(a.isBuffer(t))return t.length;if(ArrayBuffer.isView(t)||H(t,ArrayBuffer))return t.byteLength;if("string"!=typeof t)throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type '+typeof t);const r=t.length,n=arguments.length>2&&true===arguments[2];if(!n&&0===r)return 0;let i=false;for(;;)switch(e){case "ascii":case "latin1":case "binary":return r;case "utf8":case "utf-8":return q(t).length;case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":return 2*r;case "hex":return r>>>1;case "base64":return W(t).length;default:if(i)return n?-1:q(t).length;e=(""+e).toLowerCase(),i=true;}}function b(t,e,r){let n=false;if((void 0===e||e<0)&&(e=0),e>this.length)return "";if((void 0===r||r>this.length)&&(r=this.length),r<=0)return "";if((r>>>=0)<=(e>>>=0))return "";for(t||(t="utf8");;)switch(t){case "hex":return S(this,e,r);case "utf8":case "utf-8":return O(this,e,r);case "ascii":return T(this,e,r);case "latin1":case "binary":return R(this,e,r);case "base64":return v(this,e,r);case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":return N(this,e,r);default:if(n)throw new TypeError("Unknown encoding: "+t);t=(t+"").toLowerCase(),n=true;}}function w(t,e,r){const n=t[e];t[e]=t[r],t[r]=n;}function B(t,e,r,n,i){if(0===t.length)return  -1;if("string"==typeof r?(n=r,r=0):r>2147483647?r=2147483647:r<-2147483648&&(r=-2147483648),Z(r=+r)&&(r=i?0:t.length-1),r<0&&(r=t.length+r),r>=t.length){if(i)return  -1;r=t.length-1;}else if(r<0){if(!i)return  -1;r=0;}if("string"==typeof e&&(e=a.from(e,n)),a.isBuffer(e))return 0===e.length?-1:m(t,e,r,n,i);if("number"==typeof e)return e&=255,"function"==typeof Uint8Array.prototype.indexOf?i?Uint8Array.prototype.indexOf.call(t,e,r):Uint8Array.prototype.lastIndexOf.call(t,e,r):m(t,[e],r,n,i);throw new TypeError("val must be string, number or Buffer")}function m(t,e,r,n,i){let o,f=1,u=t.length,s=e.length;if(void 0!==n&&("ucs2"===(n=String(n).toLowerCase())||"ucs-2"===n||"utf16le"===n||"utf-16le"===n)){if(t.length<2||e.length<2)return  -1;f=2,u/=2,s/=2,r/=2;}function a(t,e){return 1===f?t[e]:t.readUInt16BE(e*f)}if(i){let n=-1;for(o=r;o<u;o++)if(a(t,o)===a(e,-1===n?0:o-n)){if(-1===n&&(n=o),o-n+1===s)return n*f}else  -1!==n&&(o-=o-n),n=-1;}else for(r+s>u&&(r=u-s),o=r;o>=0;o--){let r=true;for(let n=0;n<s;n++)if(a(t,o+n)!==a(e,n)){r=false;break}if(r)return o}return  -1}function E(t,e,r,n){r=Number(r)||0;const i=t.length-r;n?(n=Number(n))>i&&(n=i):n=i;const o=e.length;let f;for(n>o/2&&(n=o/2),f=0;f<n;++f){const n=parseInt(e.substr(2*f,2),16);if(Z(n))return f;t[r+f]=n;}return f}function A(t,e,r,n){return X(q(e,t.length-r),t,r,n)}function I(t,e,r,n){return X(function(t){const e=[];for(let r=0;r<t.length;++r)e.push(255&t.charCodeAt(r));return e}(e),t,r,n)}function U(t,e,r,n){return X(W(e),t,r,n)}function L(t,e,r,n){return X(function(t,e){let r,n,i;const o=[];for(let f=0;f<t.length&&!((e-=2)<0);++f)r=t.charCodeAt(f),n=r>>8,i=r%256,o.push(i),o.push(n);return o}(e,t.length-r),t,r,n)}function v(t,e,r){return 0===e&&r===t.length?n.fromByteArray(t):n.fromByteArray(t.slice(e,r))}function O(t,e,r){r=Math.min(t.length,r);const n=[];let i=e;for(;i<r;){const e=t[i];let o=null,f=e>239?4:e>223?3:e>191?2:1;if(i+f<=r){let r,n,u,s;switch(f){case 1:e<128&&(o=e);break;case 2:r=t[i+1],128==(192&r)&&(s=(31&e)<<6|63&r,s>127&&(o=s));break;case 3:r=t[i+1],n=t[i+2],128==(192&r)&&128==(192&n)&&(s=(15&e)<<12|(63&r)<<6|63&n,s>2047&&(s<55296||s>57343)&&(o=s));break;case 4:r=t[i+1],n=t[i+2],u=t[i+3],128==(192&r)&&128==(192&n)&&128==(192&u)&&(s=(15&e)<<18|(63&r)<<12|(63&n)<<6|63&u,s>65535&&s<1114112&&(o=s));}}null===o?(o=65533,f=1):o>65535&&(o-=65536,n.push(o>>>10&1023|55296),o=56320|1023&o),n.push(o),i+=f;}return function(t){const e=t.length;if(e<=_)return String.fromCharCode.apply(String,t);let r="",n=0;for(;n<e;)r+=String.fromCharCode.apply(String,t.slice(n,n+=_));return r}(n)}e.kMaxLength=u,a.TYPED_ARRAY_SUPPORT=function(){try{const t=new Uint8Array(1),e={foo:function(){return 42}};return Object.setPrototypeOf(e,Uint8Array.prototype),Object.setPrototypeOf(t,e),42===t.foo()}catch(t){return  false}}(),a.TYPED_ARRAY_SUPPORT||"undefined"==typeof console||"function"!=typeof console.error||console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."),Object.defineProperty(a.prototype,"parent",{enumerable:true,get:function(){if(a.isBuffer(this))return this.buffer}}),Object.defineProperty(a.prototype,"offset",{enumerable:true,get:function(){if(a.isBuffer(this))return this.byteOffset}}),a.poolSize=8192,a.from=function(t,e,r){return h(t,e,r)},Object.setPrototypeOf(a.prototype,Uint8Array.prototype),Object.setPrototypeOf(a,Uint8Array),a.alloc=function(t,e,r){return function(t,e,r){return c(t),t<=0?s(t):void 0!==e?"string"==typeof r?s(t).fill(e,r):s(t).fill(e):s(t)}(t,e,r)},a.allocUnsafe=function(t){return l(t)},a.allocUnsafeSlow=function(t){return l(t)},a.isBuffer=function(t){return null!=t&&true===t._isBuffer&&t!==a.prototype},a.compare=function(t,e){if(H(t,Uint8Array)&&(t=a.from(t,t.offset,t.byteLength)),H(e,Uint8Array)&&(e=a.from(e,e.offset,e.byteLength)),!a.isBuffer(t)||!a.isBuffer(e))throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');if(t===e)return 0;let r=t.length,n=e.length;for(let i=0,o=Math.min(r,n);i<o;++i)if(t[i]!==e[i]){r=t[i],n=e[i];break}return r<n?-1:n<r?1:0},a.isEncoding=function(t){switch(String(t).toLowerCase()){case "hex":case "utf8":case "utf-8":case "ascii":case "latin1":case "binary":case "base64":case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":return  true;default:return  false}},a.concat=function(t,e){if(!Array.isArray(t))throw new TypeError('"list" argument must be an Array of Buffers');if(0===t.length)return a.alloc(0);let r;if(void 0===e)for(e=0,r=0;r<t.length;++r)e+=t[r].length;const n=a.allocUnsafe(e);let i=0;for(r=0;r<t.length;++r){let e=t[r];if(H(e,Uint8Array))i+e.length>n.length?(a.isBuffer(e)||(e=a.from(e)),e.copy(n,i)):Uint8Array.prototype.set.call(n,e,i);else {if(!a.isBuffer(e))throw new TypeError('"list" argument must be an Array of Buffers');e.copy(n,i);}i+=e.length;}return n},a.byteLength=d,a.prototype._isBuffer=true,a.prototype.swap16=function(){const t=this.length;if(t%2!=0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(let e=0;e<t;e+=2)w(this,e,e+1);return this},a.prototype.swap32=function(){const t=this.length;if(t%4!=0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(let e=0;e<t;e+=4)w(this,e,e+3),w(this,e+1,e+2);return this},a.prototype.swap64=function(){const t=this.length;if(t%8!=0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(let e=0;e<t;e+=8)w(this,e,e+7),w(this,e+1,e+6),w(this,e+2,e+5),w(this,e+3,e+4);return this},a.prototype.toString=function(){const t=this.length;return 0===t?"":0===arguments.length?O(this,0,t):b.apply(this,arguments)},a.prototype.toLocaleString=a.prototype.toString,a.prototype.equals=function(t){if(!a.isBuffer(t))throw new TypeError("Argument must be a Buffer");return this===t||0===a.compare(this,t)},a.prototype.inspect=function(){let t="";const r=e.INSPECT_MAX_BYTES;return t=this.toString("hex",0,r).replace(/(.{2})/g,"$1 ").trim(),this.length>r&&(t+=" ... "),"<Buffer "+t+">"},o&&(a.prototype[o]=a.prototype.inspect),a.prototype.compare=function(t,e,r,n,i){if(H(t,Uint8Array)&&(t=a.from(t,t.offset,t.byteLength)),!a.isBuffer(t))throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type '+typeof t);if(void 0===e&&(e=0),void 0===r&&(r=t?t.length:0),void 0===n&&(n=0),void 0===i&&(i=this.length),e<0||r>t.length||n<0||i>this.length)throw new RangeError("out of range index");if(n>=i&&e>=r)return 0;if(n>=i)return  -1;if(e>=r)return 1;if(this===t)return 0;let o=(i>>>=0)-(n>>>=0),f=(r>>>=0)-(e>>>=0);const u=Math.min(o,f),s=this.slice(n,i),h=t.slice(e,r);for(let t=0;t<u;++t)if(s[t]!==h[t]){o=s[t],f=h[t];break}return o<f?-1:f<o?1:0},a.prototype.includes=function(t,e,r){return  -1!==this.indexOf(t,e,r)},a.prototype.indexOf=function(t,e,r){return B(this,t,e,r,true)},a.prototype.lastIndexOf=function(t,e,r){return B(this,t,e,r,false)},a.prototype.write=function(t,e,r,n){if(void 0===e)n="utf8",r=this.length,e=0;else if(void 0===r&&"string"==typeof e)n=e,r=this.length,e=0;else {if(!isFinite(e))throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");e>>>=0,isFinite(r)?(r>>>=0,void 0===n&&(n="utf8")):(n=r,r=void 0);}const i=this.length-e;if((void 0===r||r>i)&&(r=i),t.length>0&&(r<0||e<0)||e>this.length)throw new RangeError("Attempt to write outside buffer bounds");n||(n="utf8");let o=false;for(;;)switch(n){case "hex":return E(this,t,e,r);case "utf8":case "utf-8":return A(this,t,e,r);case "ascii":case "latin1":case "binary":return I(this,t,e,r);case "base64":return U(this,t,e,r);case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":return L(this,t,e,r);default:if(o)throw new TypeError("Unknown encoding: "+n);n=(""+n).toLowerCase(),o=true;}},a.prototype.toJSON=function(){return {type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};const _=4096;function T(t,e,r){let n="";r=Math.min(t.length,r);for(let i=e;i<r;++i)n+=String.fromCharCode(127&t[i]);return n}function R(t,e,r){let n="";r=Math.min(t.length,r);for(let i=e;i<r;++i)n+=String.fromCharCode(t[i]);return n}function S(t,e,r){const n=t.length;(!e||e<0)&&(e=0),(!r||r<0||r>n)&&(r=n);let i="";for(let n=e;n<r;++n)i+=K[t[n]];return i}function N(t,e,r){const n=t.slice(e,r);let i="";for(let t=0;t<n.length-1;t+=2)i+=String.fromCharCode(n[t]+256*n[t+1]);return i}function C(t,e,r){if(t%1!=0||t<0)throw new RangeError("offset is not uint");if(t+e>r)throw new RangeError("Trying to access beyond buffer length")}function M(t,e,r,n,i,o){if(!a.isBuffer(t))throw new TypeError('"buffer" argument must be a Buffer instance');if(e>i||e<o)throw new RangeError('"value" argument is out of bounds');if(r+n>t.length)throw new RangeError("Index out of range")}function x(t,e,r,n,i){Y(e,n,i,t,r,7);let o=Number(e&BigInt(4294967295));t[r++]=o,o>>=8,t[r++]=o,o>>=8,t[r++]=o,o>>=8,t[r++]=o;let f=Number(e>>BigInt(32)&BigInt(4294967295));return t[r++]=f,f>>=8,t[r++]=f,f>>=8,t[r++]=f,f>>=8,t[r++]=f,r}function $(t,e,r,n,i){Y(e,n,i,t,r,7);let o=Number(e&BigInt(4294967295));t[r+7]=o,o>>=8,t[r+6]=o,o>>=8,t[r+5]=o,o>>=8,t[r+4]=o;let f=Number(e>>BigInt(32)&BigInt(4294967295));return t[r+3]=f,f>>=8,t[r+2]=f,f>>=8,t[r+1]=f,f>>=8,t[r]=f,r+8}function P(t,e,r,n,i,o){if(r+n>t.length)throw new RangeError("Index out of range");if(r<0)throw new RangeError("Index out of range")}function k(t,e,r,n,o){return e=+e,r>>>=0,o||P(t,0,r,4),i.write(t,e,r,n,23,4),r+4}function j(t,e,r,n,o){return e=+e,r>>>=0,o||P(t,0,r,8),i.write(t,e,r,n,52,8),r+8}a.prototype.slice=function(t,e){const r=this.length;(t=~~t)<0?(t+=r)<0&&(t=0):t>r&&(t=r),(e=void 0===e?r:~~e)<0?(e+=r)<0&&(e=0):e>r&&(e=r),e<t&&(e=t);const n=this.subarray(t,e);return Object.setPrototypeOf(n,a.prototype),n},a.prototype.readUintLE=a.prototype.readUIntLE=function(t,e,r){t>>>=0,e>>>=0,r||C(t,e,this.length);let n=this[t],i=1,o=0;for(;++o<e&&(i*=256);)n+=this[t+o]*i;return n},a.prototype.readUintBE=a.prototype.readUIntBE=function(t,e,r){t>>>=0,e>>>=0,r||C(t,e,this.length);let n=this[t+--e],i=1;for(;e>0&&(i*=256);)n+=this[t+--e]*i;return n},a.prototype.readUint8=a.prototype.readUInt8=function(t,e){return t>>>=0,e||C(t,1,this.length),this[t]},a.prototype.readUint16LE=a.prototype.readUInt16LE=function(t,e){return t>>>=0,e||C(t,2,this.length),this[t]|this[t+1]<<8},a.prototype.readUint16BE=a.prototype.readUInt16BE=function(t,e){return t>>>=0,e||C(t,2,this.length),this[t]<<8|this[t+1]},a.prototype.readUint32LE=a.prototype.readUInt32LE=function(t,e){return t>>>=0,e||C(t,4,this.length),(this[t]|this[t+1]<<8|this[t+2]<<16)+16777216*this[t+3]},a.prototype.readUint32BE=a.prototype.readUInt32BE=function(t,e){return t>>>=0,e||C(t,4,this.length),16777216*this[t]+(this[t+1]<<16|this[t+2]<<8|this[t+3])},a.prototype.readBigUInt64LE=Q(function(t){V(t>>>=0,"offset");const e=this[t],r=this[t+7];void 0!==e&&void 0!==r||G(t,this.length-8);const n=e+256*this[++t]+65536*this[++t]+this[++t]*2**24,i=this[++t]+256*this[++t]+65536*this[++t]+r*2**24;return BigInt(n)+(BigInt(i)<<BigInt(32))}),a.prototype.readBigUInt64BE=Q(function(t){V(t>>>=0,"offset");const e=this[t],r=this[t+7];void 0!==e&&void 0!==r||G(t,this.length-8);const n=e*2**24+65536*this[++t]+256*this[++t]+this[++t],i=this[++t]*2**24+65536*this[++t]+256*this[++t]+r;return (BigInt(n)<<BigInt(32))+BigInt(i)}),a.prototype.readIntLE=function(t,e,r){t>>>=0,e>>>=0,r||C(t,e,this.length);let n=this[t],i=1,o=0;for(;++o<e&&(i*=256);)n+=this[t+o]*i;return i*=128,n>=i&&(n-=Math.pow(2,8*e)),n},a.prototype.readIntBE=function(t,e,r){t>>>=0,e>>>=0,r||C(t,e,this.length);let n=e,i=1,o=this[t+--n];for(;n>0&&(i*=256);)o+=this[t+--n]*i;return i*=128,o>=i&&(o-=Math.pow(2,8*e)),o},a.prototype.readInt8=function(t,e){return t>>>=0,e||C(t,1,this.length),128&this[t]?-1*(255-this[t]+1):this[t]},a.prototype.readInt16LE=function(t,e){t>>>=0,e||C(t,2,this.length);const r=this[t]|this[t+1]<<8;return 32768&r?4294901760|r:r},a.prototype.readInt16BE=function(t,e){t>>>=0,e||C(t,2,this.length);const r=this[t+1]|this[t]<<8;return 32768&r?4294901760|r:r},a.prototype.readInt32LE=function(t,e){return t>>>=0,e||C(t,4,this.length),this[t]|this[t+1]<<8|this[t+2]<<16|this[t+3]<<24},a.prototype.readInt32BE=function(t,e){return t>>>=0,e||C(t,4,this.length),this[t]<<24|this[t+1]<<16|this[t+2]<<8|this[t+3]},a.prototype.readBigInt64LE=Q(function(t){V(t>>>=0,"offset");const e=this[t],r=this[t+7];void 0!==e&&void 0!==r||G(t,this.length-8);const n=this[t+4]+256*this[t+5]+65536*this[t+6]+(r<<24);return (BigInt(n)<<BigInt(32))+BigInt(e+256*this[++t]+65536*this[++t]+this[++t]*2**24)}),a.prototype.readBigInt64BE=Q(function(t){V(t>>>=0,"offset");const e=this[t],r=this[t+7];void 0!==e&&void 0!==r||G(t,this.length-8);const n=(e<<24)+65536*this[++t]+256*this[++t]+this[++t];return (BigInt(n)<<BigInt(32))+BigInt(this[++t]*2**24+65536*this[++t]+256*this[++t]+r)}),a.prototype.readFloatLE=function(t,e){return t>>>=0,e||C(t,4,this.length),i.read(this,t,true,23,4)},a.prototype.readFloatBE=function(t,e){return t>>>=0,e||C(t,4,this.length),i.read(this,t,false,23,4)},a.prototype.readDoubleLE=function(t,e){return t>>>=0,e||C(t,8,this.length),i.read(this,t,true,52,8)},a.prototype.readDoubleBE=function(t,e){return t>>>=0,e||C(t,8,this.length),i.read(this,t,false,52,8)},a.prototype.writeUintLE=a.prototype.writeUIntLE=function(t,e,r,n){t=+t,e>>>=0,r>>>=0,n||M(this,t,e,r,Math.pow(2,8*r)-1,0);let i=1,o=0;for(this[e]=255&t;++o<r&&(i*=256);)this[e+o]=t/i&255;return e+r},a.prototype.writeUintBE=a.prototype.writeUIntBE=function(t,e,r,n){t=+t,e>>>=0,r>>>=0,n||M(this,t,e,r,Math.pow(2,8*r)-1,0);let i=r-1,o=1;for(this[e+i]=255&t;--i>=0&&(o*=256);)this[e+i]=t/o&255;return e+r},a.prototype.writeUint8=a.prototype.writeUInt8=function(t,e,r){return t=+t,e>>>=0,r||M(this,t,e,1,255,0),this[e]=255&t,e+1},a.prototype.writeUint16LE=a.prototype.writeUInt16LE=function(t,e,r){return t=+t,e>>>=0,r||M(this,t,e,2,65535,0),this[e]=255&t,this[e+1]=t>>>8,e+2},a.prototype.writeUint16BE=a.prototype.writeUInt16BE=function(t,e,r){return t=+t,e>>>=0,r||M(this,t,e,2,65535,0),this[e]=t>>>8,this[e+1]=255&t,e+2},a.prototype.writeUint32LE=a.prototype.writeUInt32LE=function(t,e,r){return t=+t,e>>>=0,r||M(this,t,e,4,4294967295,0),this[e+3]=t>>>24,this[e+2]=t>>>16,this[e+1]=t>>>8,this[e]=255&t,e+4},a.prototype.writeUint32BE=a.prototype.writeUInt32BE=function(t,e,r){return t=+t,e>>>=0,r||M(this,t,e,4,4294967295,0),this[e]=t>>>24,this[e+1]=t>>>16,this[e+2]=t>>>8,this[e+3]=255&t,e+4},a.prototype.writeBigUInt64LE=Q(function(t,e=0){return x(this,t,e,BigInt(0),BigInt("0xffffffffffffffff"))}),a.prototype.writeBigUInt64BE=Q(function(t,e=0){return $(this,t,e,BigInt(0),BigInt("0xffffffffffffffff"))}),a.prototype.writeIntLE=function(t,e,r,n){if(t=+t,e>>>=0,!n){const n=Math.pow(2,8*r-1);M(this,t,e,r,n-1,-n);}let i=0,o=1,f=0;for(this[e]=255&t;++i<r&&(o*=256);)t<0&&0===f&&0!==this[e+i-1]&&(f=1),this[e+i]=(t/o|0)-f&255;return e+r},a.prototype.writeIntBE=function(t,e,r,n){if(t=+t,e>>>=0,!n){const n=Math.pow(2,8*r-1);M(this,t,e,r,n-1,-n);}let i=r-1,o=1,f=0;for(this[e+i]=255&t;--i>=0&&(o*=256);)t<0&&0===f&&0!==this[e+i+1]&&(f=1),this[e+i]=(t/o|0)-f&255;return e+r},a.prototype.writeInt8=function(t,e,r){return t=+t,e>>>=0,r||M(this,t,e,1,127,-128),t<0&&(t=255+t+1),this[e]=255&t,e+1},a.prototype.writeInt16LE=function(t,e,r){return t=+t,e>>>=0,r||M(this,t,e,2,32767,-32768),this[e]=255&t,this[e+1]=t>>>8,e+2},a.prototype.writeInt16BE=function(t,e,r){return t=+t,e>>>=0,r||M(this,t,e,2,32767,-32768),this[e]=t>>>8,this[e+1]=255&t,e+2},a.prototype.writeInt32LE=function(t,e,r){return t=+t,e>>>=0,r||M(this,t,e,4,2147483647,-2147483648),this[e]=255&t,this[e+1]=t>>>8,this[e+2]=t>>>16,this[e+3]=t>>>24,e+4},a.prototype.writeInt32BE=function(t,e,r){return t=+t,e>>>=0,r||M(this,t,e,4,2147483647,-2147483648),t<0&&(t=4294967295+t+1),this[e]=t>>>24,this[e+1]=t>>>16,this[e+2]=t>>>8,this[e+3]=255&t,e+4},a.prototype.writeBigInt64LE=Q(function(t,e=0){return x(this,t,e,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))}),a.prototype.writeBigInt64BE=Q(function(t,e=0){return $(this,t,e,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))}),a.prototype.writeFloatLE=function(t,e,r){return k(this,t,e,true,r)},a.prototype.writeFloatBE=function(t,e,r){return k(this,t,e,false,r)},a.prototype.writeDoubleLE=function(t,e,r){return j(this,t,e,true,r)},a.prototype.writeDoubleBE=function(t,e,r){return j(this,t,e,false,r)},a.prototype.copy=function(t,e,r,n){if(!a.isBuffer(t))throw new TypeError("argument should be a Buffer");if(r||(r=0),n||0===n||(n=this.length),e>=t.length&&(e=t.length),e||(e=0),n>0&&n<r&&(n=r),n===r)return 0;if(0===t.length||0===this.length)return 0;if(e<0)throw new RangeError("targetStart out of bounds");if(r<0||r>=this.length)throw new RangeError("Index out of range");if(n<0)throw new RangeError("sourceEnd out of bounds");n>this.length&&(n=this.length),t.length-e<n-r&&(n=t.length-e+r);const i=n-r;return this===t&&"function"==typeof Uint8Array.prototype.copyWithin?this.copyWithin(e,r,n):Uint8Array.prototype.set.call(t,this.subarray(r,n),e),i},a.prototype.fill=function(t,e,r,n){if("string"==typeof t){if("string"==typeof e?(n=e,e=0,r=this.length):"string"==typeof r&&(n=r,r=this.length),void 0!==n&&"string"!=typeof n)throw new TypeError("encoding must be a string");if("string"==typeof n&&!a.isEncoding(n))throw new TypeError("Unknown encoding: "+n);if(1===t.length){const e=t.charCodeAt(0);("utf8"===n&&e<128||"latin1"===n)&&(t=e);}}else "number"==typeof t?t&=255:"boolean"==typeof t&&(t=Number(t));if(e<0||this.length<e||this.length<r)throw new RangeError("Out of range index");if(r<=e)return this;let i;if(e>>>=0,r=void 0===r?this.length:r>>>0,t||(t=0),"number"==typeof t)for(i=e;i<r;++i)this[i]=t;else {const o=a.isBuffer(t)?t:a.from(t,n),f=o.length;if(0===f)throw new TypeError('The value "'+t+'" is invalid for argument "value"');for(i=0;i<r-e;++i)this[i+e]=o[i%f];}return this};const F={};function D(t,e,r){F[t]=class extends r{constructor(){super(),Object.defineProperty(this,"message",{value:e.apply(this,arguments),writable:true,configurable:true}),this.name=`${this.name} [${t}]`,this.stack,delete this.name;}get code(){return t}set code(t){Object.defineProperty(this,"code",{configurable:true,enumerable:true,value:t,writable:true});}toString(){return `${this.name} [${t}]: ${this.message}`}};}function z(t){let e="",r=t.length;const n="-"===t[0]?1:0;for(;r>=n+4;r-=3)e=`_${t.slice(r-3,r)}${e}`;return `${t.slice(0,r)}${e}`}function Y(t,e,r,n,i,o){if(t>r||t<e){const r="bigint"==typeof e?"n":"";let n;throw n=0===e||e===BigInt(0)?`>= 0${r} and < 2${r} ** ${8*(o+1)}${r}`:`>= -(2${r} ** ${8*(o+1)-1}${r}) and < 2 ** ${8*(o+1)-1}${r}`,new F.ERR_OUT_OF_RANGE("value",n,t)}!function(t,e,r){V(e,"offset"),void 0!==t[e]&&void 0!==t[e+r]||G(e,t.length-(r+1));}(n,i,o);}function V(t,e){if("number"!=typeof t)throw new F.ERR_INVALID_ARG_TYPE(e,"number",t)}function G(t,e,r){if(Math.floor(t)!==t)throw V(t,r),new F.ERR_OUT_OF_RANGE("offset","an integer",t);if(e<0)throw new F.ERR_BUFFER_OUT_OF_BOUNDS;throw new F.ERR_OUT_OF_RANGE("offset",`>= 0 and <= ${e}`,t)}D("ERR_BUFFER_OUT_OF_BOUNDS",function(t){return t?`${t} is outside of buffer bounds`:"Attempt to access memory outside buffer bounds"},RangeError),D("ERR_INVALID_ARG_TYPE",function(t,e){return `The "${t}" argument must be of type number. Received type ${typeof e}`},TypeError),D("ERR_OUT_OF_RANGE",function(t,e,r){let n=`The value of "${t}" is out of range.`,i=r;return Number.isInteger(r)&&Math.abs(r)>2**32?i=z(String(r)):"bigint"==typeof r&&(i=String(r),(r>BigInt(2)**BigInt(32)||r<-(BigInt(2)**BigInt(32)))&&(i=z(i)),i+="n"),n+=` It must be ${e}. Received ${i}`,n},RangeError);const J=/[^+/0-9A-Za-z-_]/g;function q(t,e){let r;e=e||1/0;const n=t.length;let i=null;const o=[];for(let f=0;f<n;++f){if(r=t.charCodeAt(f),r>55295&&r<57344){if(!i){if(r>56319){(e-=3)>-1&&o.push(239,191,189);continue}if(f+1===n){(e-=3)>-1&&o.push(239,191,189);continue}i=r;continue}if(r<56320){(e-=3)>-1&&o.push(239,191,189),i=r;continue}r=65536+(i-55296<<10|r-56320);}else i&&(e-=3)>-1&&o.push(239,191,189);if(i=null,r<128){if((e-=1)<0)break;o.push(r);}else if(r<2048){if((e-=2)<0)break;o.push(r>>6|192,63&r|128);}else if(r<65536){if((e-=3)<0)break;o.push(r>>12|224,r>>6&63|128,63&r|128);}else {if(!(r<1114112))throw new Error("Invalid code point");if((e-=4)<0)break;o.push(r>>18|240,r>>12&63|128,r>>6&63|128,63&r|128);}}return o}function W(t){return n.toByteArray(function(t){if((t=(t=t.split("=")[0]).trim().replace(J,"")).length<2)return "";for(;t.length%4!=0;)t+="=";return t}(t))}function X(t,e,r,n){let i;for(i=0;i<n&&!(i+r>=e.length||i>=t.length);++i)e[i+r]=t[i];return i}function H(t,e){return t instanceof e||null!=t&&null!=t.constructor&&null!=t.constructor.name&&t.constructor.name===e.name}function Z(t){return t!=t}const K=function(){const t="0123456789abcdef",e=new Array(256);for(let r=0;r<16;++r){const n=16*r;for(let i=0;i<16;++i)e[n+i]=t[r]+t[i];}return e}();function Q(t){return "undefined"==typeof BigInt?tt:t}function tt(){throw new Error("BigInt not supported")}}(e$1)),e$1);const s$1=new TextEncoder,a$1=new TextDecoder,h$1=c$1;function c$1(t,e=0){let r;if(void 0===t||"string"!=typeof t||"number"!=typeof e)throw TypeError("invlaid init variablie type name. ");if((t=t.toUpperCase()).includes("8"))r=u$1.Buffer.alloc(1),t.includes("I")?r.writeInt8(e):r.writeUint8(e);else if(t.includes("16"))r=u$1.Buffer.alloc(2),t.includes("I")?t.includes("L")?r.writeInt16LE(e):r.writeInt16BE(e):t.includes("L")?r.writeUint16LE(e):r.writeUint16BE(e);else if(t.includes("32"))r=u$1.Buffer.alloc(4),t.includes("I")?t.includes("L")?r.writeInt32LE(e):r.writeInt32BE(e):t.includes("L")?r.writeUint32LE(e):r.writeUint32BE(e);else if(t.includes("F"))r=u$1.Buffer.alloc(4),t.includes("L")?r.writeFloatLE(e):r.writeFloatBE(e);else {if(!t.includes("N"))throw TypeError(`invalid number type: ${t}`);r=u$1.Buffer.from(String(e));}return r}const l$1=p$1;function p$1(t,e,r){let n,i="B";if("number"==typeof e)"number"==typeof r?(n=u$1.Buffer.alloc(e),0!==r&&n.fill(r),i="B"):(n=u$1.Buffer.from(String(e)),i="N");else if("string"==typeof e&&"number"==typeof r)i=e.toUpperCase(),n=c$1(e,r);else if("string"==typeof e&&void 0===r)n=u$1.Buffer.from(e),i="S";else if(e instanceof Uint8Array&&void 0===r)n=e instanceof u$1.Buffer?e:u$1.Buffer.from(e);else if(e instanceof ArrayBuffer&&void 0===r)n=u$1.Buffer.from(e);else if(ArrayBuffer.isView(e))n=u$1.Buffer.from(e.buffer,e.byteOffset,e.byteLength);else if("object"==typeof e&&void 0===r)n=u$1.Buffer.from(JSON.stringify(e)),i="O";else {if("boolean"!=typeof e||void 0!==r)throw TypeError("invalid meta buffer type");{const t=e?1:0;n=u$1.Buffer.from([t]),i="!";}}return "string"==typeof t&&t.includes("#")&&(t=""),[t,i,n]}const y$1=g$1;function g$1(...t){let e=0;return t.map(t=>{const r=e++;return "number"==typeof t?l$1(r,"N",t):l$1(r,t)})}function d$1(t){if((t=t.toUpperCase()).includes("8"))return t.includes("I")?"int8":"uint8";if(t.includes("16"))return t.includes("I")?t.includes("L")?"int16_le":"int16_be":t.includes("L")?"uint16_le":"uint16_be";if(t.includes("32"))return t.includes("I")?t.includes("L")?"int32_le":"int32_be":t.includes("L")?"uint32_le":"uint32_be";if(t.includes("F"))return t.includes("L")?"float_le":"float_be";if("B"===t)return "buffer";if("S"===t)return "string";if("N"===t)return "number";if("O"===t)return "object";if("!"===t)return "boolean";throw TypeError("invalid data type")}function b$1(t,e){const r=d$1(t),n=/^(u?int)8$/.test(r)||"boolean"===r?1:/^(u?int)16_/.test(r)?2:/^(u?int)32_|^float_/.test(r)?4:void 0;if(void 0===e&&(e=n),!Number.isSafeInteger(e)||e<0||void 0!==n&&e!==n)throw TypeError("invalid field length");return e}function w$1(t,e){if(!Array.isArray(t))return  false;try{for(const r of t){if(!Array.isArray(r)||r.length<3||r.length>5)return !1;const[t,n,i,o]=r;if("string"!=typeof t&&!(Number.isSafeInteger(t)&&t>=0))return !1;const f=b$1(n,o);if(!Number.isSafeInteger(i)||i<0||i>e||f>e-i)return !1}return !0}catch{return  false}}function B$1(t,e,r,n){try{if(n=b$1(t,n),!Number.isSafeInteger(r)||r<0||r>e.byteLength||n>e.byteLength-r)return;const i=d$1(t);if("int8"==i)return e.readInt8(r);if("uint8"===i)return e.readUint8(r);if("int16_le"===i)return e.readInt16LE(r);if("int16_be"===i)return e.readInt16BE(r);if("uint16_le"===i)return e.readUint16LE(r);if("uint16_be"===i)return e.readUint16BE(r);if("int32_le"===i)return e.readInt32LE(r);if("int32_be"===i)return e.readInt32BE(r);if("uint32_le"===i)return e.readUint32LE(r);if("uint32_be"===i)return e.readUint32BE(r);if("float_le"===i)return e.readFloatLE(r);if("float_be"===i)return e.readFloatBE(r);if("buffer"===i)return e.subarray(r,r+n);if("string"===i){const t=e.subarray(r,r+n);return a$1.decode(t)}if("number"===i){const t=e.subarray(r,r+n);return Number(a$1.decode(t))}if("object"===i){const t=e.subarray(r,r+n);return JSON.parse(a$1.decode(t))}if("boolean"===i){return 1===e.readInt8(r)}return}catch(t){}}function m$1(...t){const e=function(t){let e=[];return t.filter(t=>{if(!Array.isArray(t[0]))return t;e=e.concat(t);}).concat(e)}(t);let r=0;const n=[];let i,o,f=0;if(e.forEach(t=>{const[e,i,o]=t;r+=o.byteLength,("number"==typeof e||e.length>0)&&n.push([e,i,f,o.byteLength]),f=r;}),n.length>0){let t=JSON.stringify(n);i=s$1.encode(t),o=i.byteLength,r=r+o+2;}const a=u$1.Buffer.alloc(r);if(f=0,e.forEach(t=>{const e=t[2];a.set(e,f),f+=e.byteLength;}),n.length>0){a.set(i,f);const t=h$1("16",o);return a.set(t,f+o),a}return a}const E$1=A$1;function A$1(t,e=false){if(void 0===t)throw TypeError("Invalid data type: Undefined");if("string"==typeof t)return s$1.encode(t);if("number"==typeof t)return Uint8Array.from([t]);if(t instanceof ArrayBuffer){if(e)return new Uint8Array(t);{const e=new Uint8Array(t),r=new Uint8Array(t.byteLength);return r.set(e),r}}if(ArrayBuffer.isView(t)){if(e)return new Uint8Array(t.buffer,t.byteOffset,t.byteLength);{const e=new Uint8Array(t.buffer,t.byteOffset,t.byteLength),r=new Uint8Array(t.byteLength);return r.set(e),r}}return s$1.encode(JSON.stringify(t))}const I$1=U$1;function U$1(t,e=false){const r=A$1(t,e);return e?u$1.Buffer.from(r.buffer,r.byteOffset,r.byteLength):u$1.Buffer.from(r)}const L$1=v$1;function v$1(...t){const e=t.map(t=>U$1(t));return u$1.Buffer.concat(e)}const O$1=_$1;function _$1(...t){try{let e=0,r=0;const n=t.map(t=>A$1(t));n.forEach(t=>{e+=t.byteLength;});const i=new Uint8Array(e);return n.forEach(t=>{i.set(t,r),r+=t.byteLength;}),i}catch(t){console.log(t);}}function T$1(t){return 0===C$1(t)?t.byteLength:t.byteLength-C$1(t)-S$1}function R$1(t,e=N$1(t)){try{if(t instanceof ArrayBuffer&&(t=u$1.Buffer.from(t)),!(t instanceof Uint8Array))return;if(!Number.isSafeInteger(e)||e<=0||e>t.byteLength-S$1)return;const r=new Uint8Array(t.buffer,t.byteOffset,t.byteLength),n=r.byteLength-e-S$1,i=JSON.parse(a$1.decode(r.subarray(n,r.byteLength-S$1)));if(!w$1(i,n)||0===i.length)return;return i}catch{return}}const S$1=2;function N$1(t){if(t instanceof ArrayBuffer&&(t=u$1.Buffer.from(t)),t instanceof Uint8Array){if(t.byteLength<=S$1)return 0;return new DataView(t.buffer,t.byteOffset,t.byteLength).getUint16(t.byteLength-S$1)}return 0}function C$1(t){if(t instanceof ArrayBuffer&&(t=u$1.Buffer.from(t)),t instanceof Uint8Array){const e=t.byteLength;if(e<=S$1)return 0;const r=N$1(t);if(0===r||r>e)return 0;return R$1(t,r)?r:0}return 0}function M$1(t){const e=T$1(t);return t.subarray(0,e)}function x$1(t,e=false){t instanceof ArrayBuffer&&(t=u$1.Buffer.from(t));const r=N$1(t);if(0===r)return;let n=R$1(t,r);return n?e?(n.forEach(t=>{null==t[3]&&(t[1].includes("8")?t[3]=1:t[1].includes("16")?t[3]=2:t[1].includes("32")||t[1].includes("F")?t[3]=4:t[1].includes("!")&&(t[3]=1)),t[4]=d$1(t[1]);}),n):n:void 0}var $$1=Object.freeze({__proto__:null,B8:I$1,B8pack:L$1,Buffer:u$1.Buffer,MB:l$1,MBA:y$1,NB:h$1,TAIL_LEN:S$1,U8:E$1,U8pack:O$1,equal:function(t,e){if(t.byteLength!==e.byteLength)return  false;for(let r=0;r<t.byteLength;r++)if(t[r]!==e[r])return  false;return  true},getBuffer:M$1,getBufferSize:T$1,getMeta:x$1,getMetaDetail:function(t){return x$1(t,true)},getMetaSize:C$1,hex:function(t){return Array.prototype.map.call(new Uint8Array(t),t=>("00"+t.toString(16)).slice(-2)).join("")},meta:function(...t){return x$1(m$1(...t))},metaBuffer:p$1,metaBufferArguments:g$1,metaDetail:function(...t){return x$1(m$1(...t),true)},numberBuffer:c$1,pack:m$1,parseBuffer:U$1,parseBufferThenConcat:v$1,parseMetaInfo:R$1,parseTypeName:d$1,parseUint8Array:A$1,parseUint8ThenConcat:_$1,rawPack:function(...t){return M$1(m$1(...t))},readTail:N$1,readTypedBuffer:B$1,unpack:function(t,e){if(!(t instanceof Uint8Array||t instanceof ArrayBuffer))return;const r=void 0!==e,n=r?e:x$1(t);if(!w$1(n,r?t.byteLength:t.byteLength-N$1(t)-S$1))return;const i=u$1.Buffer.from(t),o={};let f=0;for(const[t,e,r,u]of n){const n=b$1(e,u),s=B$1(e,i,r,n);if(void 0===s)return;Object.defineProperty(o,t,{value:s,enumerable:true,writable:true,configurable:true}),f=Math.max(f,r+n);}r&&f<i.byteLength&&(o.$OTHERS=i.subarray(f));let s=0,a=[];for(;Object.prototype.hasOwnProperty.call(o,s);)a.push(o[s++]);return a.length>0&&(o.args=a,o.$=o.args),o}});

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
 * @property {number} PONG_TIMEOUT
 * @property {number} RECONNECT_JITTER
 * @property {number} RECONNECT_BASE
 * @property {number} RECONNECT_MAX
 * @property {number} SERVER_HELLO_TIMEOUT
 * @property {number} PROMISE_TIMEOUT
 * @property {number} DID
 * @property {number} CID
 */
const SIZE_LIMIT = {
  TAG_LEN1: 255,
  TAG_LEN2: 65535,
  CONNECTION_CHECKER_PERIOD: 3000,
  CLIENT_PING_PERIOD: 40000,
  // After a client PING (sent when nothing was received for CLIENT_PING_PERIOD): with no message
  // from the server in this time the connection is taken as dead and closed, so the client
  // reconnects. A lost Wi-Fi or mobile link may leave a socket open for many minutes otherwise.
  PONG_TIMEOUT: 15000,
  // Reconnecting (autoReconnect): the first attempt after a connection closes waits a random time
  // up to RECONNECT_JITTER, so the clients of a restarted server do not all return at once; each
  // further attempt without reaching ready waits RECONNECT_BASE, doubled each time up to
  // RECONNECT_MAX (each +-20%). Reaching ready starts over.
  RECONNECT_JITTER: 1000,
  RECONNECT_BASE: 3000,
  RECONNECT_MAX: 30000,
  // From starting a connection to the server's hello (SERVER_TIME_NONCE). A connection that hangs
  // longer is closed, so the client reconnects to its own URL (after a redirect: the original one).
  SERVER_HELLO_TIMEOUT: 15000,
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
 * @property {number} QUOTA
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
  // 0xC3: QUOTA_LEVEL before 9.0. Not reused: older clients would read QUOTA as a quota level.
  AUTH_CLEAR: 0xC4,
  SERVER_REDIRECT: 0xC5,
  QUOTA: 0xC6, // u32 LE maxMessageBytes of the connection (0: unlimited)
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
  SET: 0xDB,   // reserved: the store service used it (removed 2026-11-23); clients ignore it
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

const encoder$3 = new TextEncoder();


function getSignalPack(tag, ...args) {
  if (typeof tag !== 'string') throw TypeError('tag should be string.')
  let tagEncoded = encoder$3.encode(tag);
  if (tagEncoded.byteLength > SIZE_LIMIT.TAG_LEN1) throw TypeError('tag UTF-8 byte length exceeds 255')
  let payload = parsePayload(args);

  let sigPack;
  if (payload.type == PAYLOAD_TYPE.EMPTY) {
    sigPack = $$1.pack(
      $$1.MB('#MsgType', '8', IOMsg.SIGNAL),
      $$1.MB('#tagLen', '8', tagEncoded.byteLength),
      $$1.MB('#tag', tagEncoded),
      $$1.MB('#payloadType', '8', payload.type)
    );
  } else if (payload.type == PAYLOAD_TYPE.MBA) {
    let mbaBuffer = $$1.pack($$1.MBA(...args));
    sigPack = $$1.pack(
      $$1.MB('#MsgType', '8', IOMsg.SIGNAL),
      $$1.MB('#tagLen', '8', tagEncoded.byteLength),
      $$1.MB('#tag', tagEncoded),
      $$1.MB('#payloadType', '8', payload.type),
      $$1.MB('#mbaBuffer', mbaBuffer)
    );
  } else {
    sigPack = $$1.pack(
      $$1.MB('#MsgType', '8', IOMsg.SIGNAL),
      $$1.MB('#tagLen', '8', tagEncoded.byteLength),
      $$1.MB('#tag', tagEncoded),
      $$1.MB('#payloadType', '8', payload.type),
      $$1.MB('#payload', payload.buffer)
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
      pack = encoder$3.encode(args[0] + "."); // add null byte area.
      pack[pack.byteLength - 1] = 0; // set byte-zero : '\0'  in C/C++

    } else if (ArrayBuffer.isView(args[0]) || args[0] instanceof ArrayBuffer) {
      type = PAYLOAD_TYPE.BINARY;
      pack = $$1.B8(args[0]);
    } else if (typeof args[0] === 'object') {
      type = PAYLOAD_TYPE.OBJECT;
      pack = encoder$3.encode(JSON.stringify(args[0]));
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
      pack = encoder$3.encode(JSON.stringify(args));
    }

  }

  return { type: type, buffer: pack }
}

function getPayloadFromSignalPack(signalPack) {
  let tagLen = signalPack.readUint8(1);
  return signalPack.subarray(3 + tagLen)
}
const decoder$5 = new TextDecoder();

/**
 * Arguments of a SIGNAL payload, as IO emits them after the tag: EMPTY [], TEXT [string] (the
 * trailing NUL that C/C++ senders add is removed), BINARY [the buffer itself], OBJECT [value],
 * MJSON [...values], MBA [...args]. null for an unknown payload type. Throws on malformed JSON/MBA.
 * @param {number} payloadType
 * @param {Uint8Array} payloadBuffer
 * @returns {any[] | null}
 */
function decodeSignalArgs(payloadType, payloadBuffer) {
  switch (payloadType) {
    case PAYLOAD_TYPE.EMPTY:
      return []
    case PAYLOAD_TYPE.TEXT: {
      const end = payloadBuffer[payloadBuffer.byteLength - 1] === 0 ? payloadBuffer.byteLength - 1 : payloadBuffer.byteLength;
      return [decoder$5.decode(payloadBuffer.subarray(0, end))]
    }
    case PAYLOAD_TYPE.BINARY:
      return [payloadBuffer]
    case PAYLOAD_TYPE.OBJECT:
      return [JSON.parse(decoder$5.decode(payloadBuffer))]
    case PAYLOAD_TYPE.MJSON: {
      const values = JSON.parse(decoder$5.decode(payloadBuffer));
      if (!Array.isArray(values)) throw new TypeError('MJSON payload is not an array')
      return values
    }
    case PAYLOAD_TYPE.MBA: {
      const mba = $$1.unpack(payloadBuffer);
      if (!mba) throw new TypeError('malformed MBA payload')
      return mba.args
    }
    default:
      return null
  }
}

var t,e,r,n={},i={},o={};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */function f(){return e||(e=1,o.read=function(t,e,r,n,i){var o,f,s=8*i-n-1,u=(1<<s)-1,h=u>>1,a=-7,c=r?i-1:0,l=r?-1:1,p=t[e+c];for(c+=l,o=p&(1<<-a)-1,p>>=-a,a+=s;a>0;o=256*o+t[e+c],c+=l,a-=8);for(f=o&(1<<-a)-1,o>>=-a,a+=n;a>0;f=256*f+t[e+c],c+=l,a-=8);if(0===o)o=1-h;else {if(o===u)return f?NaN:1/0*(p?-1:1);f+=Math.pow(2,n),o-=h;}return (p?-1:1)*f*Math.pow(2,o-n)},o.write=function(t,e,r,n,i,o){var f,s,u,h=8*o-i-1,a=(1<<h)-1,c=a>>1,l=23===i?Math.pow(2,-24)-Math.pow(2,-77):0,p=n?0:o-1,y=n?1:-1,g=e<0||0===e&&1/e<0?1:0;for(e=Math.abs(e),isNaN(e)||e===1/0?(s=isNaN(e)?1:0,f=a):(f=Math.floor(Math.log(e)/Math.LN2),e*(u=Math.pow(2,-f))<1&&(f--,u*=2),(e+=f+c>=1?l/u:l*Math.pow(2,1-c))*u>=2&&(f++,u/=2),f+c>=a?(s=0,f=a):f+c>=1?(s=(e*u-1)*Math.pow(2,i),f+=c):(s=e*Math.pow(2,c-1)*Math.pow(2,i),f=0));i>=8;t[r+p]=255&s,p+=y,s/=256,i-=8);for(f=f<<i|s,h+=i;h>0;t[r+p]=255&f,p+=y,f/=256,h-=8);t[r+p-y]|=128*g;}),o}
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */var s=(r||(r=1,function(e){const r=function(){if(t)return i;t=1,i.byteLength=function(t){var e=s(t),r=e[0],n=e[1];return 3*(r+n)/4-n},i.toByteArray=function(t){var e,i,o=s(t),f=o[0],u=o[1],h=new n(function(t,e,r){return 3*(e+r)/4-r}(0,f,u)),a=0,c=u>0?f-4:f;for(i=0;i<c;i+=4)e=r[t.charCodeAt(i)]<<18|r[t.charCodeAt(i+1)]<<12|r[t.charCodeAt(i+2)]<<6|r[t.charCodeAt(i+3)],h[a++]=e>>16&255,h[a++]=e>>8&255,h[a++]=255&e;return 2===u&&(e=r[t.charCodeAt(i)]<<2|r[t.charCodeAt(i+1)]>>4,h[a++]=255&e),1===u&&(e=r[t.charCodeAt(i)]<<10|r[t.charCodeAt(i+1)]<<4|r[t.charCodeAt(i+2)]>>2,h[a++]=e>>8&255,h[a++]=255&e),h},i.fromByteArray=function(t){for(var r,n=t.length,i=n%3,o=[],f=16383,s=0,u=n-i;s<u;s+=f)o.push(h(t,s,s+f>u?u:s+f));return 1===i?(r=t[n-1],o.push(e[r>>2]+e[r<<4&63]+"==")):2===i&&(r=(t[n-2]<<8)+t[n-1],o.push(e[r>>10]+e[r>>4&63]+e[r<<2&63]+"=")),o.join("")};for(var e=[],r=[],n="undefined"!=typeof Uint8Array?Uint8Array:Array,o="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",f=0;f<64;++f)e[f]=o[f],r[o.charCodeAt(f)]=f;function s(t){var e=t.length;if(e%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var r=t.indexOf("=");return  -1===r&&(r=e),[r,r===e?0:4-r%4]}function u(t){return e[t>>18&63]+e[t>>12&63]+e[t>>6&63]+e[63&t]}function h(t,e,r){for(var n,i=[],o=e;o<r;o+=3)n=(t[o]<<16&16711680)+(t[o+1]<<8&65280)+(255&t[o+2]),i.push(u(n));return i.join("")}return r["-".charCodeAt(0)]=62,r["_".charCodeAt(0)]=63,i}(),n=f(),o="function"==typeof Symbol&&"function"==typeof Symbol.for?Symbol.for("nodejs.util.inspect.custom"):null;e.Buffer=h,e.SlowBuffer=function(t){return +t!=t&&(t=0),h.alloc(+t)},e.INSPECT_MAX_BYTES=50;const s=2147483647;function u(t){if(t>s)throw new RangeError('The value "'+t+'" is invalid for option "size"');const e=new Uint8Array(t);return Object.setPrototypeOf(e,h.prototype),e}function h(t,e,r){if("number"==typeof t){if("string"==typeof e)throw new TypeError('The "string" argument must be of type string. Received type number');return l(t)}return a(t,e,r)}function a(t,e,r){if("string"==typeof t)return function(t,e){if("string"==typeof e&&""!==e||(e="utf8"),!h.isEncoding(e))throw new TypeError("Unknown encoding: "+e);const r=0|d(t,e);let n=u(r);const i=n.write(t,e);return i!==r&&(n=n.slice(0,i)),n}(t,e);if(ArrayBuffer.isView(t))return function(t){if(X(t,Uint8Array)){const e=new Uint8Array(t);return y(e.buffer,e.byteOffset,e.byteLength)}return p(t)}(t);if(null==t)throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof t);if(X(t,ArrayBuffer)||t&&X(t.buffer,ArrayBuffer))return y(t,e,r);if("undefined"!=typeof SharedArrayBuffer&&(X(t,SharedArrayBuffer)||t&&X(t.buffer,SharedArrayBuffer)))return y(t,e,r);if("number"==typeof t)throw new TypeError('The "value" argument must not be of type number. Received type number');const n=t.valueOf&&t.valueOf();if(null!=n&&n!==t)return h.from(n,e,r);const i=function(t){if(h.isBuffer(t)){const e=0|g(t.length),r=u(e);return 0===r.length||t.copy(r,0,0,e),r}return void 0!==t.length?"number"!=typeof t.length||J(t.length)?u(0):p(t):"Buffer"===t.type&&Array.isArray(t.data)?p(t.data):void 0}(t);if(i)return i;if("undefined"!=typeof Symbol&&null!=Symbol.toPrimitive&&"function"==typeof t[Symbol.toPrimitive])return h.from(t[Symbol.toPrimitive]("string"),e,r);throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof t)}function c(t){if("number"!=typeof t)throw new TypeError('"size" argument must be of type number');if(t<0)throw new RangeError('The value "'+t+'" is invalid for option "size"')}function l(t){return c(t),u(t<0?0:0|g(t))}function p(t){const e=t.length<0?0:0|g(t.length),r=u(e);for(let n=0;n<e;n+=1)r[n]=255&t[n];return r}function y(t,e,r){if(e<0||t.byteLength<e)throw new RangeError('"offset" is outside of buffer bounds');if(t.byteLength<e+(r||0))throw new RangeError('"length" is outside of buffer bounds');let n;return n=void 0===e&&void 0===r?new Uint8Array(t):void 0===r?new Uint8Array(t,e):new Uint8Array(t,e,r),Object.setPrototypeOf(n,h.prototype),n}function g(t){if(t>=s)throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+s.toString(16)+" bytes");return 0|t}function d(t,e){if(h.isBuffer(t))return t.length;if(ArrayBuffer.isView(t)||X(t,ArrayBuffer))return t.byteLength;if("string"!=typeof t)throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type '+typeof t);const r=t.length,n=arguments.length>2&&true===arguments[2];if(!n&&0===r)return 0;let i=false;for(;;)switch(e){case "ascii":case "latin1":case "binary":return r;case "utf8":case "utf-8":return G(t).length;case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":return 2*r;case "hex":return r>>>1;case "base64":return Z(t).length;default:if(i)return n?-1:G(t).length;e=(""+e).toLowerCase(),i=true;}}function b(t,e,r){let n=false;if((void 0===e||e<0)&&(e=0),e>this.length)return "";if((void 0===r||r>this.length)&&(r=this.length),r<=0)return "";if((r>>>=0)<=(e>>>=0))return "";for(t||(t="utf8");;)switch(t){case "hex":return O(this,e,r);case "utf8":case "utf-8":return L(this,e,r);case "ascii":return T(this,e,r);case "latin1":case "binary":return S(this,e,r);case "base64":return v(this,e,r);case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":return C(this,e,r);default:if(n)throw new TypeError("Unknown encoding: "+t);t=(t+"").toLowerCase(),n=true;}}function w(t,e,r){const n=t[e];t[e]=t[r],t[r]=n;}function E(t,e,r,n,i){if(0===t.length)return  -1;if("string"==typeof r?(n=r,r=0):r>2147483647?r=2147483647:r<-2147483648&&(r=-2147483648),J(r=+r)&&(r=i?0:t.length-1),r<0&&(r=t.length+r),r>=t.length){if(i)return  -1;r=t.length-1;}else if(r<0){if(!i)return  -1;r=0;}if("string"==typeof e&&(e=h.from(e,n)),h.isBuffer(e))return 0===e.length?-1:m(t,e,r,n,i);if("number"==typeof e)return e&=255,"function"==typeof Uint8Array.prototype.indexOf?i?Uint8Array.prototype.indexOf.call(t,e,r):Uint8Array.prototype.lastIndexOf.call(t,e,r):m(t,[e],r,n,i);throw new TypeError("val must be string, number or Buffer")}function m(t,e,r,n,i){let o,f=1,s=t.length,u=e.length;if(void 0!==n&&("ucs2"===(n=String(n).toLowerCase())||"ucs-2"===n||"utf16le"===n||"utf-16le"===n)){if(t.length<2||e.length<2)return  -1;f=2,s/=2,u/=2,r/=2;}function h(t,e){return 1===f?t[e]:t.readUInt16BE(e*f)}if(i){let n=-1;for(o=r;o<s;o++)if(h(t,o)===h(e,-1===n?0:o-n)){if(-1===n&&(n=o),o-n+1===u)return n*f}else  -1!==n&&(o-=o-n),n=-1;}else for(r+u>s&&(r=s-u),o=r;o>=0;o--){let r=true;for(let n=0;n<u;n++)if(h(t,o+n)!==h(e,n)){r=false;break}if(r)return o}return  -1}function B(t,e,r,n){r=Number(r)||0;const i=t.length-r;n?(n=Number(n))>i&&(n=i):n=i;const o=e.length;let f;for(n>o/2&&(n=o/2),f=0;f<n;++f){const n=parseInt(e.substr(2*f,2),16);if(J(n))return f;t[r+f]=n;}return f}function A(t,e,r,n){return q(G(e,t.length-r),t,r,n)}function U(t,e,r,n){return q(function(t){const e=[];for(let r=0;r<t.length;++r)e.push(255&t.charCodeAt(r));return e}(e),t,r,n)}function _(t,e,r,n){return q(Z(e),t,r,n)}function I(t,e,r,n){return q(function(t,e){let r,n,i;const o=[];for(let f=0;f<t.length&&!((e-=2)<0);++f)r=t.charCodeAt(f),n=r>>8,i=r%256,o.push(i),o.push(n);return o}(e,t.length-r),t,r,n)}function v(t,e,n){return 0===e&&n===t.length?r.fromByteArray(t):r.fromByteArray(t.slice(e,n))}function L(t,e,r){r=Math.min(t.length,r);const n=[];let i=e;for(;i<r;){const e=t[i];let o=null,f=e>239?4:e>223?3:e>191?2:1;if(i+f<=r){let r,n,s,u;switch(f){case 1:e<128&&(o=e);break;case 2:r=t[i+1],128==(192&r)&&(u=(31&e)<<6|63&r,u>127&&(o=u));break;case 3:r=t[i+1],n=t[i+2],128==(192&r)&&128==(192&n)&&(u=(15&e)<<12|(63&r)<<6|63&n,u>2047&&(u<55296||u>57343)&&(o=u));break;case 4:r=t[i+1],n=t[i+2],s=t[i+3],128==(192&r)&&128==(192&n)&&128==(192&s)&&(u=(15&e)<<18|(63&r)<<12|(63&n)<<6|63&s,u>65535&&u<1114112&&(o=u));}}null===o?(o=65533,f=1):o>65535&&(o-=65536,n.push(o>>>10&1023|55296),o=56320|1023&o),n.push(o),i+=f;}return function(t){const e=t.length;if(e<=R)return String.fromCharCode.apply(String,t);let r="",n=0;for(;n<e;)r+=String.fromCharCode.apply(String,t.slice(n,n+=R));return r}(n)}e.kMaxLength=s,h.TYPED_ARRAY_SUPPORT=function(){try{const t=new Uint8Array(1),e={foo:function(){return 42}};return Object.setPrototypeOf(e,Uint8Array.prototype),Object.setPrototypeOf(t,e),42===t.foo()}catch(t){return  false}}(),h.TYPED_ARRAY_SUPPORT||"undefined"==typeof console||"function"!=typeof console.error||console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."),Object.defineProperty(h.prototype,"parent",{enumerable:true,get:function(){if(h.isBuffer(this))return this.buffer}}),Object.defineProperty(h.prototype,"offset",{enumerable:true,get:function(){if(h.isBuffer(this))return this.byteOffset}}),h.poolSize=8192,h.from=function(t,e,r){return a(t,e,r)},Object.setPrototypeOf(h.prototype,Uint8Array.prototype),Object.setPrototypeOf(h,Uint8Array),h.alloc=function(t,e,r){return function(t,e,r){return c(t),t<=0?u(t):void 0!==e?"string"==typeof r?u(t).fill(e,r):u(t).fill(e):u(t)}(t,e,r)},h.allocUnsafe=function(t){return l(t)},h.allocUnsafeSlow=function(t){return l(t)},h.isBuffer=function(t){return null!=t&&true===t._isBuffer&&t!==h.prototype},h.compare=function(t,e){if(X(t,Uint8Array)&&(t=h.from(t,t.offset,t.byteLength)),X(e,Uint8Array)&&(e=h.from(e,e.offset,e.byteLength)),!h.isBuffer(t)||!h.isBuffer(e))throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');if(t===e)return 0;let r=t.length,n=e.length;for(let i=0,o=Math.min(r,n);i<o;++i)if(t[i]!==e[i]){r=t[i],n=e[i];break}return r<n?-1:n<r?1:0},h.isEncoding=function(t){switch(String(t).toLowerCase()){case "hex":case "utf8":case "utf-8":case "ascii":case "latin1":case "binary":case "base64":case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":return  true;default:return  false}},h.concat=function(t,e){if(!Array.isArray(t))throw new TypeError('"list" argument must be an Array of Buffers');if(0===t.length)return h.alloc(0);let r;if(void 0===e)for(e=0,r=0;r<t.length;++r)e+=t[r].length;const n=h.allocUnsafe(e);let i=0;for(r=0;r<t.length;++r){let e=t[r];if(X(e,Uint8Array))i+e.length>n.length?(h.isBuffer(e)||(e=h.from(e)),e.copy(n,i)):Uint8Array.prototype.set.call(n,e,i);else {if(!h.isBuffer(e))throw new TypeError('"list" argument must be an Array of Buffers');e.copy(n,i);}i+=e.length;}return n},h.byteLength=d,h.prototype._isBuffer=true,h.prototype.swap16=function(){const t=this.length;if(t%2!=0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(let e=0;e<t;e+=2)w(this,e,e+1);return this},h.prototype.swap32=function(){const t=this.length;if(t%4!=0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(let e=0;e<t;e+=4)w(this,e,e+3),w(this,e+1,e+2);return this},h.prototype.swap64=function(){const t=this.length;if(t%8!=0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(let e=0;e<t;e+=8)w(this,e,e+7),w(this,e+1,e+6),w(this,e+2,e+5),w(this,e+3,e+4);return this},h.prototype.toString=function(){const t=this.length;return 0===t?"":0===arguments.length?L(this,0,t):b.apply(this,arguments)},h.prototype.toLocaleString=h.prototype.toString,h.prototype.equals=function(t){if(!h.isBuffer(t))throw new TypeError("Argument must be a Buffer");return this===t||0===h.compare(this,t)},h.prototype.inspect=function(){let t="";const r=e.INSPECT_MAX_BYTES;return t=this.toString("hex",0,r).replace(/(.{2})/g,"$1 ").trim(),this.length>r&&(t+=" ... "),"<Buffer "+t+">"},o&&(h.prototype[o]=h.prototype.inspect),h.prototype.compare=function(t,e,r,n,i){if(X(t,Uint8Array)&&(t=h.from(t,t.offset,t.byteLength)),!h.isBuffer(t))throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type '+typeof t);if(void 0===e&&(e=0),void 0===r&&(r=t?t.length:0),void 0===n&&(n=0),void 0===i&&(i=this.length),e<0||r>t.length||n<0||i>this.length)throw new RangeError("out of range index");if(n>=i&&e>=r)return 0;if(n>=i)return  -1;if(e>=r)return 1;if(this===t)return 0;let o=(i>>>=0)-(n>>>=0),f=(r>>>=0)-(e>>>=0);const s=Math.min(o,f),u=this.slice(n,i),a=t.slice(e,r);for(let t=0;t<s;++t)if(u[t]!==a[t]){o=u[t],f=a[t];break}return o<f?-1:f<o?1:0},h.prototype.includes=function(t,e,r){return  -1!==this.indexOf(t,e,r)},h.prototype.indexOf=function(t,e,r){return E(this,t,e,r,true)},h.prototype.lastIndexOf=function(t,e,r){return E(this,t,e,r,false)},h.prototype.write=function(t,e,r,n){if(void 0===e)n="utf8",r=this.length,e=0;else if(void 0===r&&"string"==typeof e)n=e,r=this.length,e=0;else {if(!isFinite(e))throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");e>>>=0,isFinite(r)?(r>>>=0,void 0===n&&(n="utf8")):(n=r,r=void 0);}const i=this.length-e;if((void 0===r||r>i)&&(r=i),t.length>0&&(r<0||e<0)||e>this.length)throw new RangeError("Attempt to write outside buffer bounds");n||(n="utf8");let o=false;for(;;)switch(n){case "hex":return B(this,t,e,r);case "utf8":case "utf-8":return A(this,t,e,r);case "ascii":case "latin1":case "binary":return U(this,t,e,r);case "base64":return _(this,t,e,r);case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":return I(this,t,e,r);default:if(o)throw new TypeError("Unknown encoding: "+n);n=(""+n).toLowerCase(),o=true;}},h.prototype.toJSON=function(){return {type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};const R=4096;function T(t,e,r){let n="";r=Math.min(t.length,r);for(let i=e;i<r;++i)n+=String.fromCharCode(127&t[i]);return n}function S(t,e,r){let n="";r=Math.min(t.length,r);for(let i=e;i<r;++i)n+=String.fromCharCode(t[i]);return n}function O(t,e,r){const n=t.length;(!e||e<0)&&(e=0),(!r||r<0||r>n)&&(r=n);let i="";for(let n=e;n<r;++n)i+=W[t[n]];return i}function C(t,e,r){const n=t.slice(e,r);let i="";for(let t=0;t<n.length-1;t+=2)i+=String.fromCharCode(n[t]+256*n[t+1]);return i}function N(t,e,r){if(t%1!=0||t<0)throw new RangeError("offset is not uint");if(t+e>r)throw new RangeError("Trying to access beyond buffer length")}function x(t,e,r,n,i,o){if(!h.isBuffer(t))throw new TypeError('"buffer" argument must be a Buffer instance');if(e>i||e<o)throw new RangeError('"value" argument is out of bounds');if(r+n>t.length)throw new RangeError("Index out of range")}function M(t,e,r,n,i){K(e,n,i,t,r,7);let o=Number(e&BigInt(4294967295));t[r++]=o,o>>=8,t[r++]=o,o>>=8,t[r++]=o,o>>=8,t[r++]=o;let f=Number(e>>BigInt(32)&BigInt(4294967295));return t[r++]=f,f>>=8,t[r++]=f,f>>=8,t[r++]=f,f>>=8,t[r++]=f,r}function k(t,e,r,n,i){K(e,n,i,t,r,7);let o=Number(e&BigInt(4294967295));t[r+7]=o,o>>=8,t[r+6]=o,o>>=8,t[r+5]=o,o>>=8,t[r+4]=o;let f=Number(e>>BigInt(32)&BigInt(4294967295));return t[r+3]=f,f>>=8,t[r+2]=f,f>>=8,t[r+1]=f,f>>=8,t[r]=f,r+8}function P(t,e,r,n,i,o){if(r+n>t.length)throw new RangeError("Index out of range");if(r<0)throw new RangeError("Index out of range")}function $(t,e,r,i,o){return e=+e,r>>>=0,o||P(t,0,r,4),n.write(t,e,r,i,23,4),r+4}function j(t,e,r,i,o){return e=+e,r>>>=0,o||P(t,0,r,8),n.write(t,e,r,i,52,8),r+8}h.prototype.slice=function(t,e){const r=this.length;(t=~~t)<0?(t+=r)<0&&(t=0):t>r&&(t=r),(e=void 0===e?r:~~e)<0?(e+=r)<0&&(e=0):e>r&&(e=r),e<t&&(e=t);const n=this.subarray(t,e);return Object.setPrototypeOf(n,h.prototype),n},h.prototype.readUintLE=h.prototype.readUIntLE=function(t,e,r){t>>>=0,e>>>=0,r||N(t,e,this.length);let n=this[t],i=1,o=0;for(;++o<e&&(i*=256);)n+=this[t+o]*i;return n},h.prototype.readUintBE=h.prototype.readUIntBE=function(t,e,r){t>>>=0,e>>>=0,r||N(t,e,this.length);let n=this[t+--e],i=1;for(;e>0&&(i*=256);)n+=this[t+--e]*i;return n},h.prototype.readUint8=h.prototype.readUInt8=function(t,e){return t>>>=0,e||N(t,1,this.length),this[t]},h.prototype.readUint16LE=h.prototype.readUInt16LE=function(t,e){return t>>>=0,e||N(t,2,this.length),this[t]|this[t+1]<<8},h.prototype.readUint16BE=h.prototype.readUInt16BE=function(t,e){return t>>>=0,e||N(t,2,this.length),this[t]<<8|this[t+1]},h.prototype.readUint32LE=h.prototype.readUInt32LE=function(t,e){return t>>>=0,e||N(t,4,this.length),(this[t]|this[t+1]<<8|this[t+2]<<16)+16777216*this[t+3]},h.prototype.readUint32BE=h.prototype.readUInt32BE=function(t,e){return t>>>=0,e||N(t,4,this.length),16777216*this[t]+(this[t+1]<<16|this[t+2]<<8|this[t+3])},h.prototype.readBigUInt64LE=Q(function(t){H(t>>>=0,"offset");const e=this[t],r=this[t+7];void 0!==e&&void 0!==r||V(t,this.length-8);const n=e+256*this[++t]+65536*this[++t]+this[++t]*2**24,i=this[++t]+256*this[++t]+65536*this[++t]+r*2**24;return BigInt(n)+(BigInt(i)<<BigInt(32))}),h.prototype.readBigUInt64BE=Q(function(t){H(t>>>=0,"offset");const e=this[t],r=this[t+7];void 0!==e&&void 0!==r||V(t,this.length-8);const n=e*2**24+65536*this[++t]+256*this[++t]+this[++t],i=this[++t]*2**24+65536*this[++t]+256*this[++t]+r;return (BigInt(n)<<BigInt(32))+BigInt(i)}),h.prototype.readIntLE=function(t,e,r){t>>>=0,e>>>=0,r||N(t,e,this.length);let n=this[t],i=1,o=0;for(;++o<e&&(i*=256);)n+=this[t+o]*i;return i*=128,n>=i&&(n-=Math.pow(2,8*e)),n},h.prototype.readIntBE=function(t,e,r){t>>>=0,e>>>=0,r||N(t,e,this.length);let n=e,i=1,o=this[t+--n];for(;n>0&&(i*=256);)o+=this[t+--n]*i;return i*=128,o>=i&&(o-=Math.pow(2,8*e)),o},h.prototype.readInt8=function(t,e){return t>>>=0,e||N(t,1,this.length),128&this[t]?-1*(255-this[t]+1):this[t]},h.prototype.readInt16LE=function(t,e){t>>>=0,e||N(t,2,this.length);const r=this[t]|this[t+1]<<8;return 32768&r?4294901760|r:r},h.prototype.readInt16BE=function(t,e){t>>>=0,e||N(t,2,this.length);const r=this[t+1]|this[t]<<8;return 32768&r?4294901760|r:r},h.prototype.readInt32LE=function(t,e){return t>>>=0,e||N(t,4,this.length),this[t]|this[t+1]<<8|this[t+2]<<16|this[t+3]<<24},h.prototype.readInt32BE=function(t,e){return t>>>=0,e||N(t,4,this.length),this[t]<<24|this[t+1]<<16|this[t+2]<<8|this[t+3]},h.prototype.readBigInt64LE=Q(function(t){H(t>>>=0,"offset");const e=this[t],r=this[t+7];void 0!==e&&void 0!==r||V(t,this.length-8);const n=this[t+4]+256*this[t+5]+65536*this[t+6]+(r<<24);return (BigInt(n)<<BigInt(32))+BigInt(e+256*this[++t]+65536*this[++t]+this[++t]*2**24)}),h.prototype.readBigInt64BE=Q(function(t){H(t>>>=0,"offset");const e=this[t],r=this[t+7];void 0!==e&&void 0!==r||V(t,this.length-8);const n=(e<<24)+65536*this[++t]+256*this[++t]+this[++t];return (BigInt(n)<<BigInt(32))+BigInt(this[++t]*2**24+65536*this[++t]+256*this[++t]+r)}),h.prototype.readFloatLE=function(t,e){return t>>>=0,e||N(t,4,this.length),n.read(this,t,true,23,4)},h.prototype.readFloatBE=function(t,e){return t>>>=0,e||N(t,4,this.length),n.read(this,t,false,23,4)},h.prototype.readDoubleLE=function(t,e){return t>>>=0,e||N(t,8,this.length),n.read(this,t,true,52,8)},h.prototype.readDoubleBE=function(t,e){return t>>>=0,e||N(t,8,this.length),n.read(this,t,false,52,8)},h.prototype.writeUintLE=h.prototype.writeUIntLE=function(t,e,r,n){t=+t,e>>>=0,r>>>=0,n||x(this,t,e,r,Math.pow(2,8*r)-1,0);let i=1,o=0;for(this[e]=255&t;++o<r&&(i*=256);)this[e+o]=t/i&255;return e+r},h.prototype.writeUintBE=h.prototype.writeUIntBE=function(t,e,r,n){t=+t,e>>>=0,r>>>=0,n||x(this,t,e,r,Math.pow(2,8*r)-1,0);let i=r-1,o=1;for(this[e+i]=255&t;--i>=0&&(o*=256);)this[e+i]=t/o&255;return e+r},h.prototype.writeUint8=h.prototype.writeUInt8=function(t,e,r){return t=+t,e>>>=0,r||x(this,t,e,1,255,0),this[e]=255&t,e+1},h.prototype.writeUint16LE=h.prototype.writeUInt16LE=function(t,e,r){return t=+t,e>>>=0,r||x(this,t,e,2,65535,0),this[e]=255&t,this[e+1]=t>>>8,e+2},h.prototype.writeUint16BE=h.prototype.writeUInt16BE=function(t,e,r){return t=+t,e>>>=0,r||x(this,t,e,2,65535,0),this[e]=t>>>8,this[e+1]=255&t,e+2},h.prototype.writeUint32LE=h.prototype.writeUInt32LE=function(t,e,r){return t=+t,e>>>=0,r||x(this,t,e,4,4294967295,0),this[e+3]=t>>>24,this[e+2]=t>>>16,this[e+1]=t>>>8,this[e]=255&t,e+4},h.prototype.writeUint32BE=h.prototype.writeUInt32BE=function(t,e,r){return t=+t,e>>>=0,r||x(this,t,e,4,4294967295,0),this[e]=t>>>24,this[e+1]=t>>>16,this[e+2]=t>>>8,this[e+3]=255&t,e+4},h.prototype.writeBigUInt64LE=Q(function(t,e=0){return M(this,t,e,BigInt(0),BigInt("0xffffffffffffffff"))}),h.prototype.writeBigUInt64BE=Q(function(t,e=0){return k(this,t,e,BigInt(0),BigInt("0xffffffffffffffff"))}),h.prototype.writeIntLE=function(t,e,r,n){if(t=+t,e>>>=0,!n){const n=Math.pow(2,8*r-1);x(this,t,e,r,n-1,-n);}let i=0,o=1,f=0;for(this[e]=255&t;++i<r&&(o*=256);)t<0&&0===f&&0!==this[e+i-1]&&(f=1),this[e+i]=(t/o|0)-f&255;return e+r},h.prototype.writeIntBE=function(t,e,r,n){if(t=+t,e>>>=0,!n){const n=Math.pow(2,8*r-1);x(this,t,e,r,n-1,-n);}let i=r-1,o=1,f=0;for(this[e+i]=255&t;--i>=0&&(o*=256);)t<0&&0===f&&0!==this[e+i+1]&&(f=1),this[e+i]=(t/o|0)-f&255;return e+r},h.prototype.writeInt8=function(t,e,r){return t=+t,e>>>=0,r||x(this,t,e,1,127,-128),t<0&&(t=255+t+1),this[e]=255&t,e+1},h.prototype.writeInt16LE=function(t,e,r){return t=+t,e>>>=0,r||x(this,t,e,2,32767,-32768),this[e]=255&t,this[e+1]=t>>>8,e+2},h.prototype.writeInt16BE=function(t,e,r){return t=+t,e>>>=0,r||x(this,t,e,2,32767,-32768),this[e]=t>>>8,this[e+1]=255&t,e+2},h.prototype.writeInt32LE=function(t,e,r){return t=+t,e>>>=0,r||x(this,t,e,4,2147483647,-2147483648),this[e]=255&t,this[e+1]=t>>>8,this[e+2]=t>>>16,this[e+3]=t>>>24,e+4},h.prototype.writeInt32BE=function(t,e,r){return t=+t,e>>>=0,r||x(this,t,e,4,2147483647,-2147483648),t<0&&(t=4294967295+t+1),this[e]=t>>>24,this[e+1]=t>>>16,this[e+2]=t>>>8,this[e+3]=255&t,e+4},h.prototype.writeBigInt64LE=Q(function(t,e=0){return M(this,t,e,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))}),h.prototype.writeBigInt64BE=Q(function(t,e=0){return k(this,t,e,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))}),h.prototype.writeFloatLE=function(t,e,r){return $(this,t,e,true,r)},h.prototype.writeFloatBE=function(t,e,r){return $(this,t,e,false,r)},h.prototype.writeDoubleLE=function(t,e,r){return j(this,t,e,true,r)},h.prototype.writeDoubleBE=function(t,e,r){return j(this,t,e,false,r)},h.prototype.copy=function(t,e,r,n){if(!h.isBuffer(t))throw new TypeError("argument should be a Buffer");if(r||(r=0),n||0===n||(n=this.length),e>=t.length&&(e=t.length),e||(e=0),n>0&&n<r&&(n=r),n===r)return 0;if(0===t.length||0===this.length)return 0;if(e<0)throw new RangeError("targetStart out of bounds");if(r<0||r>=this.length)throw new RangeError("Index out of range");if(n<0)throw new RangeError("sourceEnd out of bounds");n>this.length&&(n=this.length),t.length-e<n-r&&(n=t.length-e+r);const i=n-r;return this===t&&"function"==typeof Uint8Array.prototype.copyWithin?this.copyWithin(e,r,n):Uint8Array.prototype.set.call(t,this.subarray(r,n),e),i},h.prototype.fill=function(t,e,r,n){if("string"==typeof t){if("string"==typeof e?(n=e,e=0,r=this.length):"string"==typeof r&&(n=r,r=this.length),void 0!==n&&"string"!=typeof n)throw new TypeError("encoding must be a string");if("string"==typeof n&&!h.isEncoding(n))throw new TypeError("Unknown encoding: "+n);if(1===t.length){const e=t.charCodeAt(0);("utf8"===n&&e<128||"latin1"===n)&&(t=e);}}else "number"==typeof t?t&=255:"boolean"==typeof t&&(t=Number(t));if(e<0||this.length<e||this.length<r)throw new RangeError("Out of range index");if(r<=e)return this;let i;if(e>>>=0,r=void 0===r?this.length:r>>>0,t||(t=0),"number"==typeof t)for(i=e;i<r;++i)this[i]=t;else {const o=h.isBuffer(t)?t:h.from(t,n),f=o.length;if(0===f)throw new TypeError('The value "'+t+'" is invalid for argument "value"');for(i=0;i<r-e;++i)this[i+e]=o[i%f];}return this};const F={};function z(t,e,r){F[t]=class extends r{constructor(){super(),Object.defineProperty(this,"message",{value:e.apply(this,arguments),writable:true,configurable:true}),this.name=`${this.name} [${t}]`,this.stack,delete this.name;}get code(){return t}set code(t){Object.defineProperty(this,"code",{configurable:true,enumerable:true,value:t,writable:true});}toString(){return `${this.name} [${t}]: ${this.message}`}};}function D(t){let e="",r=t.length;const n="-"===t[0]?1:0;for(;r>=n+4;r-=3)e=`_${t.slice(r-3,r)}${e}`;return `${t.slice(0,r)}${e}`}function K(t,e,r,n,i,o){if(t>r||t<e){const r="bigint"==typeof e?"n":"";let n;throw n=0===e||e===BigInt(0)?`>= 0${r} and < 2${r} ** ${8*(o+1)}${r}`:`>= -(2${r} ** ${8*(o+1)-1}${r}) and < 2 ** ${8*(o+1)-1}${r}`,new F.ERR_OUT_OF_RANGE("value",n,t)}!function(t,e,r){H(e,"offset"),void 0!==t[e]&&void 0!==t[e+r]||V(e,t.length-(r+1));}(n,i,o);}function H(t,e){if("number"!=typeof t)throw new F.ERR_INVALID_ARG_TYPE(e,"number",t)}function V(t,e,r){if(Math.floor(t)!==t)throw H(t,r),new F.ERR_OUT_OF_RANGE("offset","an integer",t);if(e<0)throw new F.ERR_BUFFER_OUT_OF_BOUNDS;throw new F.ERR_OUT_OF_RANGE("offset",`>= 0 and <= ${e}`,t)}z("ERR_BUFFER_OUT_OF_BOUNDS",function(t){return t?`${t} is outside of buffer bounds`:"Attempt to access memory outside buffer bounds"},RangeError),z("ERR_INVALID_ARG_TYPE",function(t,e){return `The "${t}" argument must be of type number. Received type ${typeof e}`},TypeError),z("ERR_OUT_OF_RANGE",function(t,e,r){let n=`The value of "${t}" is out of range.`,i=r;return Number.isInteger(r)&&Math.abs(r)>2**32?i=D(String(r)):"bigint"==typeof r&&(i=String(r),(r>BigInt(2)**BigInt(32)||r<-(BigInt(2)**BigInt(32)))&&(i=D(i)),i+="n"),n+=` It must be ${e}. Received ${i}`,n},RangeError);const Y=/[^+/0-9A-Za-z-_]/g;function G(t,e){let r;e=e||1/0;const n=t.length;let i=null;const o=[];for(let f=0;f<n;++f){if(r=t.charCodeAt(f),r>55295&&r<57344){if(!i){if(r>56319){(e-=3)>-1&&o.push(239,191,189);continue}if(f+1===n){(e-=3)>-1&&o.push(239,191,189);continue}i=r;continue}if(r<56320){(e-=3)>-1&&o.push(239,191,189),i=r;continue}r=65536+(i-55296<<10|r-56320);}else i&&(e-=3)>-1&&o.push(239,191,189);if(i=null,r<128){if((e-=1)<0)break;o.push(r);}else if(r<2048){if((e-=2)<0)break;o.push(r>>6|192,63&r|128);}else if(r<65536){if((e-=3)<0)break;o.push(r>>12|224,r>>6&63|128,63&r|128);}else {if(!(r<1114112))throw new Error("Invalid code point");if((e-=4)<0)break;o.push(r>>18|240,r>>12&63|128,r>>6&63|128,63&r|128);}}return o}function Z(t){return r.toByteArray(function(t){if((t=(t=t.split("=")[0]).trim().replace(Y,"")).length<2)return "";for(;t.length%4!=0;)t+="=";return t}(t))}function q(t,e,r,n){let i;for(i=0;i<n&&!(i+r>=e.length||i>=t.length);++i)e[i+r]=t[i];return i}function X(t,e){return t instanceof e||null!=t&&null!=t.constructor&&null!=t.constructor.name&&t.constructor.name===e.name}function J(t){return t!=t}const W=function(){const t="0123456789abcdef",e=new Array(256);for(let r=0;r<16;++r){const n=16*r;for(let i=0;i<16;++i)e[n+i]=t[r]+t[i];}return e}();function Q(t){return "undefined"==typeof BigInt?tt:t}function tt(){throw new Error("BigInt not supported")}}(n)),n);const u=new TextEncoder,h=new TextDecoder,a=c;function c(t,e=0){let r;if(void 0===t||"string"!=typeof t||"number"!=typeof e)throw TypeError("invlaid init variablie type name. ");if((t=t.toUpperCase()).includes("8"))r=s.Buffer.alloc(1),t.includes("I")?r.writeInt8(e):r.writeUint8(e);else if(t.includes("16"))r=s.Buffer.alloc(2),t.includes("I")?t.includes("L")?r.writeInt16LE(e):r.writeInt16BE(e):t.includes("L")?r.writeUint16LE(e):r.writeUint16BE(e);else if(t.includes("32"))r=s.Buffer.alloc(4),t.includes("I")?t.includes("L")?r.writeInt32LE(e):r.writeInt32BE(e):t.includes("L")?r.writeUint32LE(e):r.writeUint32BE(e);else if(t.includes("F"))r=s.Buffer.alloc(4),t.includes("L")?r.writeFloatLE(e):r.writeFloatBE(e);else {if(!t.includes("N"))throw TypeError(`invalid number type: ${t}`);r=s.Buffer.from(String(e));}return r}const l=p;function p(t,e,r){let n,i="B";if("number"==typeof e)"number"==typeof r?(n=s.Buffer.alloc(e),0!==r&&n.fill(r),i="B"):(n=s.Buffer.from(String(e)),i="N");else if("string"==typeof e&&"number"==typeof r)i=e.toUpperCase(),n=c(e,r);else if("string"==typeof e&&void 0===r)n=s.Buffer.from(e),i="S";else if(e instanceof Uint8Array&&void 0===r)n=e instanceof s.Buffer?e:s.Buffer.from(e);else if(e instanceof ArrayBuffer&&void 0===r)n=s.Buffer.from(e);else if(ArrayBuffer.isView(e))n=s.Buffer.from(e.buffer,e.byteOffset,e.byteLength);else if("object"==typeof e&&void 0===r)n=s.Buffer.from(JSON.stringify(e)),i="O";else {if("boolean"!=typeof e||void 0!==r)throw TypeError("invalid meta buffer type");{const t=e?1:0;n=s.Buffer.from([t]),i="!";}}return "string"==typeof t&&t.includes("#")&&(t=""),[t,i,n]}const y=g;function g(...t){let e=0;return t.map(t=>{const r=e++;return "number"==typeof t?l(r,"N",t):l(r,t)})}function d(t){if((t=t.toUpperCase()).includes("8"))return t.includes("I")?"int8":"uint8";if(t.includes("16"))return t.includes("I")?t.includes("L")?"int16_le":"int16_be":t.includes("L")?"uint16_le":"uint16_be";if(t.includes("32"))return t.includes("I")?t.includes("L")?"int32_le":"int32_be":t.includes("L")?"uint32_le":"uint32_be";if(t.includes("F"))return t.includes("L")?"float_le":"float_be";if("B"===t)return "buffer";if("S"===t)return "string";if("N"===t)return "number";if("O"===t)return "object";if("!"===t)return "boolean";throw TypeError("invalid data type")}function b(t,e){const r=d(t),n=/^(u?int)8$/.test(r)||"boolean"===r?1:/^(u?int)16_/.test(r)?2:/^(u?int)32_|^float_/.test(r)?4:void 0;if(void 0===e&&(e=n),!Number.isSafeInteger(e)||e<0||void 0!==n&&e!==n)throw TypeError("invalid field length");return e}function w(t,e){if(!Array.isArray(t))return  false;try{for(const r of t){if(!Array.isArray(r)||r.length<3||r.length>5)return !1;const[t,n,i,o]=r;if("string"!=typeof t&&!(Number.isSafeInteger(t)&&t>=0))return !1;const f=b(n,o);if(!Number.isSafeInteger(i)||i<0||i>e||f>e-i)return !1}return !0}catch{return  false}}function E(t,e,r,n){try{if(n=b(t,n),!Number.isSafeInteger(r)||r<0||r>e.byteLength||n>e.byteLength-r)return;const i=d(t);if("int8"==i)return e.readInt8(r);if("uint8"===i)return e.readUint8(r);if("int16_le"===i)return e.readInt16LE(r);if("int16_be"===i)return e.readInt16BE(r);if("uint16_le"===i)return e.readUint16LE(r);if("uint16_be"===i)return e.readUint16BE(r);if("int32_le"===i)return e.readInt32LE(r);if("int32_be"===i)return e.readInt32BE(r);if("uint32_le"===i)return e.readUint32LE(r);if("uint32_be"===i)return e.readUint32BE(r);if("float_le"===i)return e.readFloatLE(r);if("float_be"===i)return e.readFloatBE(r);if("buffer"===i)return e.subarray(r,r+n);if("string"===i){const t=e.subarray(r,r+n);return h.decode(t)}if("number"===i){const t=e.subarray(r,r+n);return Number(h.decode(t))}if("object"===i){const t=e.subarray(r,r+n);return JSON.parse(h.decode(t))}return "boolean"===i?1===e.readInt8(r):void 0}catch(t){}}function m(...t){const e=function(t){let e=[];return t.filter(t=>{if(!Array.isArray(t[0]))return t;e=e.concat(t);}).concat(e)}(t);let r=0;const n=[];let i,o,f=0;if(e.forEach(t=>{const[e,i,o]=t;r+=o.byteLength,("number"==typeof e||e.length>0)&&n.push([e,i,f,o.byteLength]),f=r;}),n.length>0){let t=JSON.stringify(n);i=u.encode(t),o=i.byteLength,r=r+o+2;}const h=s.Buffer.alloc(r);if(f=0,e.forEach(t=>{const e=t[2];h.set(e,f),f+=e.byteLength;}),n.length>0){h.set(i,f);const t=a("16",o);return h.set(t,f+o),h}return h}const B=A;function A(t,e=false){if(void 0===t)throw TypeError("Invalid data type: Undefined");if("string"==typeof t)return u.encode(t);if("number"==typeof t)return Uint8Array.from([t]);if(t instanceof ArrayBuffer){if(e)return new Uint8Array(t);{const e=new Uint8Array(t),r=new Uint8Array(t.byteLength);return r.set(e),r}}if(ArrayBuffer.isView(t)){if(e)return new Uint8Array(t.buffer,t.byteOffset,t.byteLength);{const e=new Uint8Array(t.buffer,t.byteOffset,t.byteLength),r=new Uint8Array(t.byteLength);return r.set(e),r}}return u.encode(JSON.stringify(t))}const U=_;function _(t,e=false){const r=A(t,e);return e?s.Buffer.from(r.buffer,r.byteOffset,r.byteLength):s.Buffer.from(r)}const I=v;function v(...t){const e=t.map(t=>_(t));return s.Buffer.concat(e)}const L=R;function R(...t){try{let e=0,r=0;const n=t.map(t=>A(t));n.forEach(t=>{e+=t.byteLength;});const i=new Uint8Array(e);return n.forEach(t=>{i.set(t,r),r+=t.byteLength;}),i}catch(t){console.log(t);}}function T(t){return 0===N(t)?t.byteLength:t.byteLength-N(t)-O}function S(t,e=C(t)){try{if(t instanceof ArrayBuffer&&(t=s.Buffer.from(t)),!(t instanceof Uint8Array))return;if(!Number.isSafeInteger(e)||e<=0||e>t.byteLength-O)return;const r=new Uint8Array(t.buffer,t.byteOffset,t.byteLength),n=r.byteLength-e-O,i=JSON.parse(h.decode(r.subarray(n,r.byteLength-O)));if(!w(i,n)||0===i.length)return;return i}catch{return}}const O=2;function C(t){return t instanceof ArrayBuffer&&(t=s.Buffer.from(t)),t instanceof Uint8Array?t.byteLength<=O?0:new DataView(t.buffer,t.byteOffset,t.byteLength).getUint16(t.byteLength-O):0}function N(t){if(t instanceof ArrayBuffer&&(t=s.Buffer.from(t)),t instanceof Uint8Array){const e=t.byteLength;if(e<=O)return 0;const r=C(t);return 0===r||r>e?0:S(t,r)?r:0}return 0}function x(t){const e=T(t);return t.subarray(0,e)}function M(t,e=false){t instanceof ArrayBuffer&&(t=s.Buffer.from(t));const r=C(t);if(0===r)return;let n=S(t,r);return n?e?(n.forEach(t=>{null==t[3]&&(t[1].includes("8")?t[3]=1:t[1].includes("16")?t[3]=2:t[1].includes("32")||t[1].includes("F")?t[3]=4:t[1].includes("!")&&(t[3]=1)),t[4]=d(t[1]);}),n):n:void 0}var k,P=Object.freeze({__proto__:null,B8:U,B8pack:I,Buffer:s.Buffer,MB:l,MBA:y,NB:a,TAIL_LEN:O,U8:B,U8pack:L,equal:function(t,e){if(t.byteLength!==e.byteLength)return  false;for(let r=0;r<t.byteLength;r++)if(t[r]!==e[r])return  false;return  true},getBuffer:x,getBufferSize:T,getMeta:M,getMetaDetail:function(t){return M(t,true)},getMetaSize:N,hex:function(t){return Array.prototype.map.call(new Uint8Array(t),t=>("00"+t.toString(16)).slice(-2)).join("")},meta:function(...t){return M(m(...t))},metaBuffer:p,metaBufferArguments:g,metaDetail:function(...t){return M(m(...t),true)},numberBuffer:c,pack:m,parseBuffer:_,parseBufferThenConcat:v,parseMetaInfo:S,parseTypeName:d,parseUint8Array:A,parseUint8ThenConcat:R,rawPack:function(...t){return x(m(...t))},readTail:C,readTypedBuffer:E,unpack:function(t,e){if(!(t instanceof Uint8Array||t instanceof ArrayBuffer))return;const r=void 0!==e,n=r?e:M(t);if(!w(n,r?t.byteLength:t.byteLength-C(t)-O))return;const i=s.Buffer.from(t),o={};let f=0;for(const[t,e,r,s]of n){const n=b(e,s),u=E(e,i,r,n);if(void 0===u)return;Object.defineProperty(o,t,{value:u,enumerable:true,writable:true,configurable:true}),f=Math.max(f,r+n);}r&&f<i.byteLength&&(o.$OTHERS=i.subarray(f));let u=0,h=[];for(;Object.prototype.hasOwnProperty.call(o,u);)h.push(o[u++]);return h.length>0&&(o.args=h,o.$=o.args),o}}),$={},j={};var F,z,D={};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */function K(){return F||(F=1,D.read=function(t,e,r,n,i){var o,f,s=8*i-n-1,u=(1<<s)-1,h=u>>1,a=-7,c=r?i-1:0,l=r?-1:1,p=t[e+c];for(c+=l,o=p&(1<<-a)-1,p>>=-a,a+=s;a>0;o=256*o+t[e+c],c+=l,a-=8);for(f=o&(1<<-a)-1,o>>=-a,a+=n;a>0;f=256*f+t[e+c],c+=l,a-=8);if(0===o)o=1-h;else {if(o===u)return f?NaN:1/0*(p?-1:1);f+=Math.pow(2,n),o-=h;}return (p?-1:1)*f*Math.pow(2,o-n)},D.write=function(t,e,r,n,i,o){var f,s,u,h=8*o-i-1,a=(1<<h)-1,c=a>>1,l=23===i?Math.pow(2,-24)-Math.pow(2,-77):0,p=n?0:o-1,y=n?1:-1,g=e<0||0===e&&1/e<0?1:0;for(e=Math.abs(e),isNaN(e)||e===1/0?(s=isNaN(e)?1:0,f=a):(f=Math.floor(Math.log(e)/Math.LN2),e*(u=Math.pow(2,-f))<1&&(f--,u*=2),(e+=f+c>=1?l/u:l*Math.pow(2,1-c))*u>=2&&(f++,u/=2),f+c>=a?(s=0,f=a):f+c>=1?(s=(e*u-1)*Math.pow(2,i),f+=c):(s=e*Math.pow(2,c-1)*Math.pow(2,i),f=0));i>=8;t[r+p]=255&s,p+=y,s/=256,i-=8);for(f=f<<i|s,h+=i;h>0;t[r+p]=255&f,p+=y,f/=256,h-=8);t[r+p-y]|=128*g;}),D}
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */var H=(z||(z=1,function(t){const e=function(){if(k)return j;k=1,j.byteLength=function(t){var e=o(t),r=e[0],n=e[1];return 3*(r+n)/4-n},j.toByteArray=function(t){var n,i,f=o(t),s=f[0],u=f[1],h=new r(function(t,e,r){return 3*(e+r)/4-r}(0,s,u)),a=0,c=u>0?s-4:s;for(i=0;i<c;i+=4)n=e[t.charCodeAt(i)]<<18|e[t.charCodeAt(i+1)]<<12|e[t.charCodeAt(i+2)]<<6|e[t.charCodeAt(i+3)],h[a++]=n>>16&255,h[a++]=n>>8&255,h[a++]=255&n;return 2===u&&(n=e[t.charCodeAt(i)]<<2|e[t.charCodeAt(i+1)]>>4,h[a++]=255&n),1===u&&(n=e[t.charCodeAt(i)]<<10|e[t.charCodeAt(i+1)]<<4|e[t.charCodeAt(i+2)]>>2,h[a++]=n>>8&255,h[a++]=255&n),h},j.fromByteArray=function(e){for(var r,n=e.length,i=n%3,o=[],f=16383,u=0,h=n-i;u<h;u+=f)o.push(s(e,u,u+f>h?h:u+f));return 1===i?(r=e[n-1],o.push(t[r>>2]+t[r<<4&63]+"==")):2===i&&(r=(e[n-2]<<8)+e[n-1],o.push(t[r>>10]+t[r>>4&63]+t[r<<2&63]+"=")),o.join("")};for(var t=[],e=[],r="undefined"!=typeof Uint8Array?Uint8Array:Array,n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",i=0;i<64;++i)t[i]=n[i],e[n.charCodeAt(i)]=i;function o(t){var e=t.length;if(e%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var r=t.indexOf("=");return  -1===r&&(r=e),[r,r===e?0:4-r%4]}function f(e){return t[e>>18&63]+t[e>>12&63]+t[e>>6&63]+t[63&e]}function s(t,e,r){for(var n,i=[],o=e;o<r;o+=3)n=(t[o]<<16&16711680)+(t[o+1]<<8&65280)+(255&t[o+2]),i.push(f(n));return i.join("")}return e["-".charCodeAt(0)]=62,e["_".charCodeAt(0)]=63,j}(),r=K(),n="function"==typeof Symbol&&"function"==typeof Symbol.for?Symbol.for("nodejs.util.inspect.custom"):null;t.Buffer=f,t.SlowBuffer=function(t){return +t!=t&&(t=0),f.alloc(+t)},t.INSPECT_MAX_BYTES=50;const i=2147483647;function o(t){if(t>i)throw new RangeError('The value "'+t+'" is invalid for option "size"');const e=new Uint8Array(t);return Object.setPrototypeOf(e,f.prototype),e}function f(t,e,r){if("number"==typeof t){if("string"==typeof e)throw new TypeError('The "string" argument must be of type string. Received type number');return h(t)}return s(t,e,r)}function s(t,e,r){if("string"==typeof t)return function(t,e){if("string"==typeof e&&""!==e||(e="utf8"),!f.isEncoding(e))throw new TypeError("Unknown encoding: "+e);const r=0|p(t,e);let n=o(r);const i=n.write(t,e);return i!==r&&(n=n.slice(0,i)),n}(t,e);if(ArrayBuffer.isView(t))return function(t){if(X(t,Uint8Array)){const e=new Uint8Array(t);return c(e.buffer,e.byteOffset,e.byteLength)}return a(t)}(t);if(null==t)throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof t);if(X(t,ArrayBuffer)||t&&X(t.buffer,ArrayBuffer))return c(t,e,r);if("undefined"!=typeof SharedArrayBuffer&&(X(t,SharedArrayBuffer)||t&&X(t.buffer,SharedArrayBuffer)))return c(t,e,r);if("number"==typeof t)throw new TypeError('The "value" argument must not be of type number. Received type number');const n=t.valueOf&&t.valueOf();if(null!=n&&n!==t)return f.from(n,e,r);const i=function(t){if(f.isBuffer(t)){const e=0|l(t.length),r=o(e);return 0===r.length||t.copy(r,0,0,e),r}return void 0!==t.length?"number"!=typeof t.length||J(t.length)?o(0):a(t):"Buffer"===t.type&&Array.isArray(t.data)?a(t.data):void 0}(t);if(i)return i;if("undefined"!=typeof Symbol&&null!=Symbol.toPrimitive&&"function"==typeof t[Symbol.toPrimitive])return f.from(t[Symbol.toPrimitive]("string"),e,r);throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof t)}function u(t){if("number"!=typeof t)throw new TypeError('"size" argument must be of type number');if(t<0)throw new RangeError('The value "'+t+'" is invalid for option "size"')}function h(t){return u(t),o(t<0?0:0|l(t))}function a(t){const e=t.length<0?0:0|l(t.length),r=o(e);for(let n=0;n<e;n+=1)r[n]=255&t[n];return r}function c(t,e,r){if(e<0||t.byteLength<e)throw new RangeError('"offset" is outside of buffer bounds');if(t.byteLength<e+(r||0))throw new RangeError('"length" is outside of buffer bounds');let n;return n=void 0===e&&void 0===r?new Uint8Array(t):void 0===r?new Uint8Array(t,e):new Uint8Array(t,e,r),Object.setPrototypeOf(n,f.prototype),n}function l(t){if(t>=i)throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+i.toString(16)+" bytes");return 0|t}function p(t,e){if(f.isBuffer(t))return t.length;if(ArrayBuffer.isView(t)||X(t,ArrayBuffer))return t.byteLength;if("string"!=typeof t)throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type '+typeof t);const r=t.length,n=arguments.length>2&&true===arguments[2];if(!n&&0===r)return 0;let i=false;for(;;)switch(e){case "ascii":case "latin1":case "binary":return r;case "utf8":case "utf-8":return G(t).length;case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":return 2*r;case "hex":return r>>>1;case "base64":return Z(t).length;default:if(i)return n?-1:G(t).length;e=(""+e).toLowerCase(),i=true;}}function y(t,e,r){let n=false;if((void 0===e||e<0)&&(e=0),e>this.length)return "";if((void 0===r||r>this.length)&&(r=this.length),r<=0)return "";if((r>>>=0)<=(e>>>=0))return "";for(t||(t="utf8");;)switch(t){case "hex":return R(this,e,r);case "utf8":case "utf-8":return _(this,e,r);case "ascii":return v(this,e,r);case "latin1":case "binary":return L(this,e,r);case "base64":return U(this,e,r);case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":return T(this,e,r);default:if(n)throw new TypeError("Unknown encoding: "+t);t=(t+"").toLowerCase(),n=true;}}function g(t,e,r){const n=t[e];t[e]=t[r],t[r]=n;}function d(t,e,r,n,i){if(0===t.length)return  -1;if("string"==typeof r?(n=r,r=0):r>2147483647?r=2147483647:r<-2147483648&&(r=-2147483648),J(r=+r)&&(r=i?0:t.length-1),r<0&&(r=t.length+r),r>=t.length){if(i)return  -1;r=t.length-1;}else if(r<0){if(!i)return  -1;r=0;}if("string"==typeof e&&(e=f.from(e,n)),f.isBuffer(e))return 0===e.length?-1:b(t,e,r,n,i);if("number"==typeof e)return e&=255,"function"==typeof Uint8Array.prototype.indexOf?i?Uint8Array.prototype.indexOf.call(t,e,r):Uint8Array.prototype.lastIndexOf.call(t,e,r):b(t,[e],r,n,i);throw new TypeError("val must be string, number or Buffer")}function b(t,e,r,n,i){let o,f=1,s=t.length,u=e.length;if(void 0!==n&&("ucs2"===(n=String(n).toLowerCase())||"ucs-2"===n||"utf16le"===n||"utf-16le"===n)){if(t.length<2||e.length<2)return  -1;f=2,s/=2,u/=2,r/=2;}function h(t,e){return 1===f?t[e]:t.readUInt16BE(e*f)}if(i){let n=-1;for(o=r;o<s;o++)if(h(t,o)===h(e,-1===n?0:o-n)){if(-1===n&&(n=o),o-n+1===u)return n*f}else  -1!==n&&(o-=o-n),n=-1;}else for(r+u>s&&(r=s-u),o=r;o>=0;o--){let r=true;for(let n=0;n<u;n++)if(h(t,o+n)!==h(e,n)){r=false;break}if(r)return o}return  -1}function w(t,e,r,n){r=Number(r)||0;const i=t.length-r;n?(n=Number(n))>i&&(n=i):n=i;const o=e.length;let f;for(n>o/2&&(n=o/2),f=0;f<n;++f){const n=parseInt(e.substr(2*f,2),16);if(J(n))return f;t[r+f]=n;}return f}function E(t,e,r,n){return q(G(e,t.length-r),t,r,n)}function m(t,e,r,n){return q(function(t){const e=[];for(let r=0;r<t.length;++r)e.push(255&t.charCodeAt(r));return e}(e),t,r,n)}function B(t,e,r,n){return q(Z(e),t,r,n)}function A(t,e,r,n){return q(function(t,e){let r,n,i;const o=[];for(let f=0;f<t.length&&!((e-=2)<0);++f)r=t.charCodeAt(f),n=r>>8,i=r%256,o.push(i),o.push(n);return o}(e,t.length-r),t,r,n)}function U(t,r,n){return 0===r&&n===t.length?e.fromByteArray(t):e.fromByteArray(t.slice(r,n))}function _(t,e,r){r=Math.min(t.length,r);const n=[];let i=e;for(;i<r;){const e=t[i];let o=null,f=e>239?4:e>223?3:e>191?2:1;if(i+f<=r){let r,n,s,u;switch(f){case 1:e<128&&(o=e);break;case 2:r=t[i+1],128==(192&r)&&(u=(31&e)<<6|63&r,u>127&&(o=u));break;case 3:r=t[i+1],n=t[i+2],128==(192&r)&&128==(192&n)&&(u=(15&e)<<12|(63&r)<<6|63&n,u>2047&&(u<55296||u>57343)&&(o=u));break;case 4:r=t[i+1],n=t[i+2],s=t[i+3],128==(192&r)&&128==(192&n)&&128==(192&s)&&(u=(15&e)<<18|(63&r)<<12|(63&n)<<6|63&s,u>65535&&u<1114112&&(o=u));}}null===o?(o=65533,f=1):o>65535&&(o-=65536,n.push(o>>>10&1023|55296),o=56320|1023&o),n.push(o),i+=f;}return function(t){const e=t.length;if(e<=I)return String.fromCharCode.apply(String,t);let r="",n=0;for(;n<e;)r+=String.fromCharCode.apply(String,t.slice(n,n+=I));return r}(n)}t.kMaxLength=i,f.TYPED_ARRAY_SUPPORT=function(){try{const t=new Uint8Array(1),e={foo:function(){return 42}};return Object.setPrototypeOf(e,Uint8Array.prototype),Object.setPrototypeOf(t,e),42===t.foo()}catch(t){return  false}}(),f.TYPED_ARRAY_SUPPORT||"undefined"==typeof console||"function"!=typeof console.error||console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."),Object.defineProperty(f.prototype,"parent",{enumerable:true,get:function(){if(f.isBuffer(this))return this.buffer}}),Object.defineProperty(f.prototype,"offset",{enumerable:true,get:function(){if(f.isBuffer(this))return this.byteOffset}}),f.poolSize=8192,f.from=function(t,e,r){return s(t,e,r)},Object.setPrototypeOf(f.prototype,Uint8Array.prototype),Object.setPrototypeOf(f,Uint8Array),f.alloc=function(t,e,r){return function(t,e,r){return u(t),t<=0?o(t):void 0!==e?"string"==typeof r?o(t).fill(e,r):o(t).fill(e):o(t)}(t,e,r)},f.allocUnsafe=function(t){return h(t)},f.allocUnsafeSlow=function(t){return h(t)},f.isBuffer=function(t){return null!=t&&true===t._isBuffer&&t!==f.prototype},f.compare=function(t,e){if(X(t,Uint8Array)&&(t=f.from(t,t.offset,t.byteLength)),X(e,Uint8Array)&&(e=f.from(e,e.offset,e.byteLength)),!f.isBuffer(t)||!f.isBuffer(e))throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');if(t===e)return 0;let r=t.length,n=e.length;for(let i=0,o=Math.min(r,n);i<o;++i)if(t[i]!==e[i]){r=t[i],n=e[i];break}return r<n?-1:n<r?1:0},f.isEncoding=function(t){switch(String(t).toLowerCase()){case "hex":case "utf8":case "utf-8":case "ascii":case "latin1":case "binary":case "base64":case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":return  true;default:return  false}},f.concat=function(t,e){if(!Array.isArray(t))throw new TypeError('"list" argument must be an Array of Buffers');if(0===t.length)return f.alloc(0);let r;if(void 0===e)for(e=0,r=0;r<t.length;++r)e+=t[r].length;const n=f.allocUnsafe(e);let i=0;for(r=0;r<t.length;++r){let e=t[r];if(X(e,Uint8Array))i+e.length>n.length?(f.isBuffer(e)||(e=f.from(e)),e.copy(n,i)):Uint8Array.prototype.set.call(n,e,i);else {if(!f.isBuffer(e))throw new TypeError('"list" argument must be an Array of Buffers');e.copy(n,i);}i+=e.length;}return n},f.byteLength=p,f.prototype._isBuffer=true,f.prototype.swap16=function(){const t=this.length;if(t%2!=0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(let e=0;e<t;e+=2)g(this,e,e+1);return this},f.prototype.swap32=function(){const t=this.length;if(t%4!=0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(let e=0;e<t;e+=4)g(this,e,e+3),g(this,e+1,e+2);return this},f.prototype.swap64=function(){const t=this.length;if(t%8!=0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(let e=0;e<t;e+=8)g(this,e,e+7),g(this,e+1,e+6),g(this,e+2,e+5),g(this,e+3,e+4);return this},f.prototype.toString=function(){const t=this.length;return 0===t?"":0===arguments.length?_(this,0,t):y.apply(this,arguments)},f.prototype.toLocaleString=f.prototype.toString,f.prototype.equals=function(t){if(!f.isBuffer(t))throw new TypeError("Argument must be a Buffer");return this===t||0===f.compare(this,t)},f.prototype.inspect=function(){let e="";const r=t.INSPECT_MAX_BYTES;return e=this.toString("hex",0,r).replace(/(.{2})/g,"$1 ").trim(),this.length>r&&(e+=" ... "),"<Buffer "+e+">"},n&&(f.prototype[n]=f.prototype.inspect),f.prototype.compare=function(t,e,r,n,i){if(X(t,Uint8Array)&&(t=f.from(t,t.offset,t.byteLength)),!f.isBuffer(t))throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type '+typeof t);if(void 0===e&&(e=0),void 0===r&&(r=t?t.length:0),void 0===n&&(n=0),void 0===i&&(i=this.length),e<0||r>t.length||n<0||i>this.length)throw new RangeError("out of range index");if(n>=i&&e>=r)return 0;if(n>=i)return  -1;if(e>=r)return 1;if(this===t)return 0;let o=(i>>>=0)-(n>>>=0),s=(r>>>=0)-(e>>>=0);const u=Math.min(o,s),h=this.slice(n,i),a=t.slice(e,r);for(let t=0;t<u;++t)if(h[t]!==a[t]){o=h[t],s=a[t];break}return o<s?-1:s<o?1:0},f.prototype.includes=function(t,e,r){return  -1!==this.indexOf(t,e,r)},f.prototype.indexOf=function(t,e,r){return d(this,t,e,r,true)},f.prototype.lastIndexOf=function(t,e,r){return d(this,t,e,r,false)},f.prototype.write=function(t,e,r,n){if(void 0===e)n="utf8",r=this.length,e=0;else if(void 0===r&&"string"==typeof e)n=e,r=this.length,e=0;else {if(!isFinite(e))throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");e>>>=0,isFinite(r)?(r>>>=0,void 0===n&&(n="utf8")):(n=r,r=void 0);}const i=this.length-e;if((void 0===r||r>i)&&(r=i),t.length>0&&(r<0||e<0)||e>this.length)throw new RangeError("Attempt to write outside buffer bounds");n||(n="utf8");let o=false;for(;;)switch(n){case "hex":return w(this,t,e,r);case "utf8":case "utf-8":return E(this,t,e,r);case "ascii":case "latin1":case "binary":return m(this,t,e,r);case "base64":return B(this,t,e,r);case "ucs2":case "ucs-2":case "utf16le":case "utf-16le":return A(this,t,e,r);default:if(o)throw new TypeError("Unknown encoding: "+n);n=(""+n).toLowerCase(),o=true;}},f.prototype.toJSON=function(){return {type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};const I=4096;function v(t,e,r){let n="";r=Math.min(t.length,r);for(let i=e;i<r;++i)n+=String.fromCharCode(127&t[i]);return n}function L(t,e,r){let n="";r=Math.min(t.length,r);for(let i=e;i<r;++i)n+=String.fromCharCode(t[i]);return n}function R(t,e,r){const n=t.length;(!e||e<0)&&(e=0),(!r||r<0||r>n)&&(r=n);let i="";for(let n=e;n<r;++n)i+=W[t[n]];return i}function T(t,e,r){const n=t.slice(e,r);let i="";for(let t=0;t<n.length-1;t+=2)i+=String.fromCharCode(n[t]+256*n[t+1]);return i}function S(t,e,r){if(t%1!=0||t<0)throw new RangeError("offset is not uint");if(t+e>r)throw new RangeError("Trying to access beyond buffer length")}function O(t,e,r,n,i,o){if(!f.isBuffer(t))throw new TypeError('"buffer" argument must be a Buffer instance');if(e>i||e<o)throw new RangeError('"value" argument is out of bounds');if(r+n>t.length)throw new RangeError("Index out of range")}function C(t,e,r,n,i){D(e,n,i,t,r,7);let o=Number(e&BigInt(4294967295));t[r++]=o,o>>=8,t[r++]=o,o>>=8,t[r++]=o,o>>=8,t[r++]=o;let f=Number(e>>BigInt(32)&BigInt(4294967295));return t[r++]=f,f>>=8,t[r++]=f,f>>=8,t[r++]=f,f>>=8,t[r++]=f,r}function N(t,e,r,n,i){D(e,n,i,t,r,7);let o=Number(e&BigInt(4294967295));t[r+7]=o,o>>=8,t[r+6]=o,o>>=8,t[r+5]=o,o>>=8,t[r+4]=o;let f=Number(e>>BigInt(32)&BigInt(4294967295));return t[r+3]=f,f>>=8,t[r+2]=f,f>>=8,t[r+1]=f,f>>=8,t[r]=f,r+8}function x(t,e,r,n,i,o){if(r+n>t.length)throw new RangeError("Index out of range");if(r<0)throw new RangeError("Index out of range")}function M(t,e,n,i,o){return e=+e,n>>>=0,o||x(t,0,n,4),r.write(t,e,n,i,23,4),n+4}function P(t,e,n,i,o){return e=+e,n>>>=0,o||x(t,0,n,8),r.write(t,e,n,i,52,8),n+8}f.prototype.slice=function(t,e){const r=this.length;(t=~~t)<0?(t+=r)<0&&(t=0):t>r&&(t=r),(e=void 0===e?r:~~e)<0?(e+=r)<0&&(e=0):e>r&&(e=r),e<t&&(e=t);const n=this.subarray(t,e);return Object.setPrototypeOf(n,f.prototype),n},f.prototype.readUintLE=f.prototype.readUIntLE=function(t,e,r){t>>>=0,e>>>=0,r||S(t,e,this.length);let n=this[t],i=1,o=0;for(;++o<e&&(i*=256);)n+=this[t+o]*i;return n},f.prototype.readUintBE=f.prototype.readUIntBE=function(t,e,r){t>>>=0,e>>>=0,r||S(t,e,this.length);let n=this[t+--e],i=1;for(;e>0&&(i*=256);)n+=this[t+--e]*i;return n},f.prototype.readUint8=f.prototype.readUInt8=function(t,e){return t>>>=0,e||S(t,1,this.length),this[t]},f.prototype.readUint16LE=f.prototype.readUInt16LE=function(t,e){return t>>>=0,e||S(t,2,this.length),this[t]|this[t+1]<<8},f.prototype.readUint16BE=f.prototype.readUInt16BE=function(t,e){return t>>>=0,e||S(t,2,this.length),this[t]<<8|this[t+1]},f.prototype.readUint32LE=f.prototype.readUInt32LE=function(t,e){return t>>>=0,e||S(t,4,this.length),(this[t]|this[t+1]<<8|this[t+2]<<16)+16777216*this[t+3]},f.prototype.readUint32BE=f.prototype.readUInt32BE=function(t,e){return t>>>=0,e||S(t,4,this.length),16777216*this[t]+(this[t+1]<<16|this[t+2]<<8|this[t+3])},f.prototype.readBigUInt64LE=Q(function(t){H(t>>>=0,"offset");const e=this[t],r=this[t+7];void 0!==e&&void 0!==r||V(t,this.length-8);const n=e+256*this[++t]+65536*this[++t]+this[++t]*2**24,i=this[++t]+256*this[++t]+65536*this[++t]+r*2**24;return BigInt(n)+(BigInt(i)<<BigInt(32))}),f.prototype.readBigUInt64BE=Q(function(t){H(t>>>=0,"offset");const e=this[t],r=this[t+7];void 0!==e&&void 0!==r||V(t,this.length-8);const n=e*2**24+65536*this[++t]+256*this[++t]+this[++t],i=this[++t]*2**24+65536*this[++t]+256*this[++t]+r;return (BigInt(n)<<BigInt(32))+BigInt(i)}),f.prototype.readIntLE=function(t,e,r){t>>>=0,e>>>=0,r||S(t,e,this.length);let n=this[t],i=1,o=0;for(;++o<e&&(i*=256);)n+=this[t+o]*i;return i*=128,n>=i&&(n-=Math.pow(2,8*e)),n},f.prototype.readIntBE=function(t,e,r){t>>>=0,e>>>=0,r||S(t,e,this.length);let n=e,i=1,o=this[t+--n];for(;n>0&&(i*=256);)o+=this[t+--n]*i;return i*=128,o>=i&&(o-=Math.pow(2,8*e)),o},f.prototype.readInt8=function(t,e){return t>>>=0,e||S(t,1,this.length),128&this[t]?-1*(255-this[t]+1):this[t]},f.prototype.readInt16LE=function(t,e){t>>>=0,e||S(t,2,this.length);const r=this[t]|this[t+1]<<8;return 32768&r?4294901760|r:r},f.prototype.readInt16BE=function(t,e){t>>>=0,e||S(t,2,this.length);const r=this[t+1]|this[t]<<8;return 32768&r?4294901760|r:r},f.prototype.readInt32LE=function(t,e){return t>>>=0,e||S(t,4,this.length),this[t]|this[t+1]<<8|this[t+2]<<16|this[t+3]<<24},f.prototype.readInt32BE=function(t,e){return t>>>=0,e||S(t,4,this.length),this[t]<<24|this[t+1]<<16|this[t+2]<<8|this[t+3]},f.prototype.readBigInt64LE=Q(function(t){H(t>>>=0,"offset");const e=this[t],r=this[t+7];void 0!==e&&void 0!==r||V(t,this.length-8);const n=this[t+4]+256*this[t+5]+65536*this[t+6]+(r<<24);return (BigInt(n)<<BigInt(32))+BigInt(e+256*this[++t]+65536*this[++t]+this[++t]*2**24)}),f.prototype.readBigInt64BE=Q(function(t){H(t>>>=0,"offset");const e=this[t],r=this[t+7];void 0!==e&&void 0!==r||V(t,this.length-8);const n=(e<<24)+65536*this[++t]+256*this[++t]+this[++t];return (BigInt(n)<<BigInt(32))+BigInt(this[++t]*2**24+65536*this[++t]+256*this[++t]+r)}),f.prototype.readFloatLE=function(t,e){return t>>>=0,e||S(t,4,this.length),r.read(this,t,true,23,4)},f.prototype.readFloatBE=function(t,e){return t>>>=0,e||S(t,4,this.length),r.read(this,t,false,23,4)},f.prototype.readDoubleLE=function(t,e){return t>>>=0,e||S(t,8,this.length),r.read(this,t,true,52,8)},f.prototype.readDoubleBE=function(t,e){return t>>>=0,e||S(t,8,this.length),r.read(this,t,false,52,8)},f.prototype.writeUintLE=f.prototype.writeUIntLE=function(t,e,r,n){t=+t,e>>>=0,r>>>=0,n||O(this,t,e,r,Math.pow(2,8*r)-1,0);let i=1,o=0;for(this[e]=255&t;++o<r&&(i*=256);)this[e+o]=t/i&255;return e+r},f.prototype.writeUintBE=f.prototype.writeUIntBE=function(t,e,r,n){t=+t,e>>>=0,r>>>=0,n||O(this,t,e,r,Math.pow(2,8*r)-1,0);let i=r-1,o=1;for(this[e+i]=255&t;--i>=0&&(o*=256);)this[e+i]=t/o&255;return e+r},f.prototype.writeUint8=f.prototype.writeUInt8=function(t,e,r){return t=+t,e>>>=0,r||O(this,t,e,1,255,0),this[e]=255&t,e+1},f.prototype.writeUint16LE=f.prototype.writeUInt16LE=function(t,e,r){return t=+t,e>>>=0,r||O(this,t,e,2,65535,0),this[e]=255&t,this[e+1]=t>>>8,e+2},f.prototype.writeUint16BE=f.prototype.writeUInt16BE=function(t,e,r){return t=+t,e>>>=0,r||O(this,t,e,2,65535,0),this[e]=t>>>8,this[e+1]=255&t,e+2},f.prototype.writeUint32LE=f.prototype.writeUInt32LE=function(t,e,r){return t=+t,e>>>=0,r||O(this,t,e,4,4294967295,0),this[e+3]=t>>>24,this[e+2]=t>>>16,this[e+1]=t>>>8,this[e]=255&t,e+4},f.prototype.writeUint32BE=f.prototype.writeUInt32BE=function(t,e,r){return t=+t,e>>>=0,r||O(this,t,e,4,4294967295,0),this[e]=t>>>24,this[e+1]=t>>>16,this[e+2]=t>>>8,this[e+3]=255&t,e+4},f.prototype.writeBigUInt64LE=Q(function(t,e=0){return C(this,t,e,BigInt(0),BigInt("0xffffffffffffffff"))}),f.prototype.writeBigUInt64BE=Q(function(t,e=0){return N(this,t,e,BigInt(0),BigInt("0xffffffffffffffff"))}),f.prototype.writeIntLE=function(t,e,r,n){if(t=+t,e>>>=0,!n){const n=Math.pow(2,8*r-1);O(this,t,e,r,n-1,-n);}let i=0,o=1,f=0;for(this[e]=255&t;++i<r&&(o*=256);)t<0&&0===f&&0!==this[e+i-1]&&(f=1),this[e+i]=(t/o|0)-f&255;return e+r},f.prototype.writeIntBE=function(t,e,r,n){if(t=+t,e>>>=0,!n){const n=Math.pow(2,8*r-1);O(this,t,e,r,n-1,-n);}let i=r-1,o=1,f=0;for(this[e+i]=255&t;--i>=0&&(o*=256);)t<0&&0===f&&0!==this[e+i+1]&&(f=1),this[e+i]=(t/o|0)-f&255;return e+r},f.prototype.writeInt8=function(t,e,r){return t=+t,e>>>=0,r||O(this,t,e,1,127,-128),t<0&&(t=255+t+1),this[e]=255&t,e+1},f.prototype.writeInt16LE=function(t,e,r){return t=+t,e>>>=0,r||O(this,t,e,2,32767,-32768),this[e]=255&t,this[e+1]=t>>>8,e+2},f.prototype.writeInt16BE=function(t,e,r){return t=+t,e>>>=0,r||O(this,t,e,2,32767,-32768),this[e]=t>>>8,this[e+1]=255&t,e+2},f.prototype.writeInt32LE=function(t,e,r){return t=+t,e>>>=0,r||O(this,t,e,4,2147483647,-2147483648),this[e]=255&t,this[e+1]=t>>>8,this[e+2]=t>>>16,this[e+3]=t>>>24,e+4},f.prototype.writeInt32BE=function(t,e,r){return t=+t,e>>>=0,r||O(this,t,e,4,2147483647,-2147483648),t<0&&(t=4294967295+t+1),this[e]=t>>>24,this[e+1]=t>>>16,this[e+2]=t>>>8,this[e+3]=255&t,e+4},f.prototype.writeBigInt64LE=Q(function(t,e=0){return C(this,t,e,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))}),f.prototype.writeBigInt64BE=Q(function(t,e=0){return N(this,t,e,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))}),f.prototype.writeFloatLE=function(t,e,r){return M(this,t,e,true,r)},f.prototype.writeFloatBE=function(t,e,r){return M(this,t,e,false,r)},f.prototype.writeDoubleLE=function(t,e,r){return P(this,t,e,true,r)},f.prototype.writeDoubleBE=function(t,e,r){return P(this,t,e,false,r)},f.prototype.copy=function(t,e,r,n){if(!f.isBuffer(t))throw new TypeError("argument should be a Buffer");if(r||(r=0),n||0===n||(n=this.length),e>=t.length&&(e=t.length),e||(e=0),n>0&&n<r&&(n=r),n===r)return 0;if(0===t.length||0===this.length)return 0;if(e<0)throw new RangeError("targetStart out of bounds");if(r<0||r>=this.length)throw new RangeError("Index out of range");if(n<0)throw new RangeError("sourceEnd out of bounds");n>this.length&&(n=this.length),t.length-e<n-r&&(n=t.length-e+r);const i=n-r;return this===t&&"function"==typeof Uint8Array.prototype.copyWithin?this.copyWithin(e,r,n):Uint8Array.prototype.set.call(t,this.subarray(r,n),e),i},f.prototype.fill=function(t,e,r,n){if("string"==typeof t){if("string"==typeof e?(n=e,e=0,r=this.length):"string"==typeof r&&(n=r,r=this.length),void 0!==n&&"string"!=typeof n)throw new TypeError("encoding must be a string");if("string"==typeof n&&!f.isEncoding(n))throw new TypeError("Unknown encoding: "+n);if(1===t.length){const e=t.charCodeAt(0);("utf8"===n&&e<128||"latin1"===n)&&(t=e);}}else "number"==typeof t?t&=255:"boolean"==typeof t&&(t=Number(t));if(e<0||this.length<e||this.length<r)throw new RangeError("Out of range index");if(r<=e)return this;let i;if(e>>>=0,r=void 0===r?this.length:r>>>0,t||(t=0),"number"==typeof t)for(i=e;i<r;++i)this[i]=t;else {const o=f.isBuffer(t)?t:f.from(t,n),s=o.length;if(0===s)throw new TypeError('The value "'+t+'" is invalid for argument "value"');for(i=0;i<r-e;++i)this[i+e]=o[i%s];}return this};const $={};function F(t,e,r){$[t]=class extends r{constructor(){super(),Object.defineProperty(this,"message",{value:e.apply(this,arguments),writable:true,configurable:true}),this.name=`${this.name} [${t}]`,this.stack,delete this.name;}get code(){return t}set code(t){Object.defineProperty(this,"code",{configurable:true,enumerable:true,value:t,writable:true});}toString(){return `${this.name} [${t}]: ${this.message}`}};}function z(t){let e="",r=t.length;const n="-"===t[0]?1:0;for(;r>=n+4;r-=3)e=`_${t.slice(r-3,r)}${e}`;return `${t.slice(0,r)}${e}`}function D(t,e,r,n,i,o){if(t>r||t<e){const r="bigint"==typeof e?"n":"";let n;throw n=0===e||e===BigInt(0)?`>= 0${r} and < 2${r} ** ${8*(o+1)}${r}`:`>= -(2${r} ** ${8*(o+1)-1}${r}) and < 2 ** ${8*(o+1)-1}${r}`,new $.ERR_OUT_OF_RANGE("value",n,t)}!function(t,e,r){H(e,"offset"),void 0!==t[e]&&void 0!==t[e+r]||V(e,t.length-(r+1));}(n,i,o);}function H(t,e){if("number"!=typeof t)throw new $.ERR_INVALID_ARG_TYPE(e,"number",t)}function V(t,e,r){if(Math.floor(t)!==t)throw H(t,r),new $.ERR_OUT_OF_RANGE("offset","an integer",t);if(e<0)throw new $.ERR_BUFFER_OUT_OF_BOUNDS;throw new $.ERR_OUT_OF_RANGE("offset",`>= 0 and <= ${e}`,t)}F("ERR_BUFFER_OUT_OF_BOUNDS",function(t){return t?`${t} is outside of buffer bounds`:"Attempt to access memory outside buffer bounds"},RangeError),F("ERR_INVALID_ARG_TYPE",function(t,e){return `The "${t}" argument must be of type number. Received type ${typeof e}`},TypeError),F("ERR_OUT_OF_RANGE",function(t,e,r){let n=`The value of "${t}" is out of range.`,i=r;return Number.isInteger(r)&&Math.abs(r)>2**32?i=z(String(r)):"bigint"==typeof r&&(i=String(r),(r>BigInt(2)**BigInt(32)||r<-(BigInt(2)**BigInt(32)))&&(i=z(i)),i+="n"),n+=` It must be ${e}. Received ${i}`,n},RangeError);const Y=/[^+/0-9A-Za-z-_]/g;function G(t,e){let r;e=e||1/0;const n=t.length;let i=null;const o=[];for(let f=0;f<n;++f){if(r=t.charCodeAt(f),r>55295&&r<57344){if(!i){if(r>56319){(e-=3)>-1&&o.push(239,191,189);continue}if(f+1===n){(e-=3)>-1&&o.push(239,191,189);continue}i=r;continue}if(r<56320){(e-=3)>-1&&o.push(239,191,189),i=r;continue}r=65536+(i-55296<<10|r-56320);}else i&&(e-=3)>-1&&o.push(239,191,189);if(i=null,r<128){if((e-=1)<0)break;o.push(r);}else if(r<2048){if((e-=2)<0)break;o.push(r>>6|192,63&r|128);}else if(r<65536){if((e-=3)<0)break;o.push(r>>12|224,r>>6&63|128,63&r|128);}else {if(!(r<1114112))throw new Error("Invalid code point");if((e-=4)<0)break;o.push(r>>18|240,r>>12&63|128,r>>6&63|128,63&r|128);}}return o}function Z(t){return e.toByteArray(function(t){if((t=(t=t.split("=")[0]).trim().replace(Y,"")).length<2)return "";for(;t.length%4!=0;)t+="=";return t}(t))}function q(t,e,r,n){let i;for(i=0;i<n&&!(i+r>=e.length||i>=t.length);++i)e[i+r]=t[i];return i}function X(t,e){return t instanceof e||null!=t&&null!=t.constructor&&null!=t.constructor.name&&t.constructor.name===e.name}function J(t){return t!=t}const W=function(){const t="0123456789abcdef",e=new Array(256);for(let r=0;r<16;++r){const n=16*r;for(let i=0;i<16;++i)e[n+i]=t[r]+t[i];}return e}();function Q(t){return "undefined"==typeof BigInt?tt:t}function tt(){throw new Error("BigInt not supported")}}($)),$);if(1!==new Uint8Array(new Uint32Array([1]).buffer)[0])throw new Error("ascon.js needs a little-endian platform");const V=new TextEncoder;function Y(t,e){if(null==t)return new Uint8Array(0);if("string"==typeof t)return V.encode(t);if(t instanceof Uint8Array)return t;if(ArrayBuffer.isView(t))return new Uint8Array(t.buffer,t.byteOffset,t.byteLength);if(t instanceof ArrayBuffer)return new Uint8Array(t);throw new TypeError(`${e} must be a string, Uint8Array, ArrayBuffer or typed array`)}function G(t,e,r){const n=Y(t,r);if(n.length!==e)throw new RangeError(`${r} must be ${e} bytes`);return n}function Z(t){if(!Number.isInteger(t)||t<4||t>16)throw new RangeError("tagLength must be 4..16");return t}class q{constructor(){this.w=new Uint32Array(10),this.b=new Uint8Array(this.w.buffer);}setWord(t,e,r){this.w[2*t]=r,this.w[2*t+1]=e;}xor(t,e,r,n){const i=this.b;for(let o=0;o<n;o++)i[t+o]^=e[r+o];}permute(t){const e=this.w;let r,n,i,o,f,s,u,h,a,c,l,p,y=e[0],g=e[1],d=e[2],b=e[3],w=e[4],E=e[5],m=e[6],B=e[7],A=e[8],U=e[9];for(let e=12-t;e<12;e++)w^=15-e<<4|e,y^=A,g^=U,A^=m,U^=B,w^=d,E^=b,i=~y&d,o=~g&b,f=~d&w,s=~b&E,u=~w&m,h=~E&B,a=~m&A,c=~B&U,l=~A&y,p=~U&g,y^=f,g^=s,d^=u,b^=h,w^=a,E^=c,m^=l,B^=p,A^=i,U^=o,d^=y,b^=g,y^=A,g^=U,m^=w,B^=E,w=~w,E=~E,r=y,n=g,y=r^(r>>>19|n<<13)^(r>>>28|n<<4),g=n^(n>>>19|r<<13)^(n>>>28|r<<4),r=d,n=b,d=r^(n>>>29|r<<3)^(n>>>7|r<<25),b=n^(r>>>29|n<<3)^(r>>>7|n<<25),r=w,n=E,w=r^(r>>>1|n<<31)^(r>>>6|n<<26),E=n^(n>>>1|r<<31)^(n>>>6|r<<26),r=m,n=B,m=r^(r>>>10|n<<22)^(r>>>17|n<<15),B=n^(n>>>10|r<<22)^(n>>>17|r<<15),r=A,n=U,A=r^(r>>>7|n<<25)^(n>>>9|r<<23),U=n^(n>>>7|r<<25)^(r>>>9|n<<23);e[0]=y,e[1]=g,e[2]=d,e[3]=b,e[4]=w,e[5]=E,e[6]=m,e[7]=B,e[8]=A,e[9]=U;}wipe(){this.w.fill(0);}}function X(t,e,r){const n=new q;if(n.setWord(0,4096,2156658689),n.b.set(t,8),n.b.set(e,24),n.permute(12),n.xor(24,t,0,16),r.length){let t=0;for(;r.length-t>=16;t+=16)n.xor(0,r,t,16),n.permute(8);n.xor(0,r,t,r.length-t),n.b[r.length-t]^=1,n.permute(8);}return n.b[39]^=128,n}function J(t,e){t.xor(16,e,0,16),t.permute(12),t.xor(24,e,0,16);}function W(t,e,r,n,i=16){t=G(t,16,"key"),e=G(e,16,"nonce");const o=Y(r,"plaintext"),f=Z(i),s=X(t,e,Y(n,"ad")),u=new Uint8Array(o.length+f);let h=0;for(;o.length-h>=16;h+=16)s.xor(0,o,h,16),u.set(s.b.subarray(0,16),h),s.permute(8);const a=o.length-h;return s.xor(0,o,h,a),u.set(s.b.subarray(0,a),h),s.b[a]^=1,J(s,t),u.set(s.b.subarray(24,24+f),o.length),s.wipe(),u}function Q(t,e,r,n,i=16){t=G(t,16,"key"),e=G(e,16,"nonce");const o=Y(r,"ciphertext"),f=Z(i);if(o.length<f)return null;const s=o.length-f,u=X(t,e,Y(n,"ad")),h=new Uint8Array(s),a=u.b;let c=0;for(;;){const t=Math.min(16,s-c);for(let e=0;e<t;e++){const t=o[c+e];h[c+e]=a[e]^t,a[e]=t;}if(c+=t,t<16){a[t]^=1;break}u.permute(8);}J(u,t);let l=0;for(let t=0;t<f;t++)l|=a[24+t]^o[s+t];return u.wipe(),l?(h.fill(0),null):h}function tt(t,e){let r=0;for(;e.length-r>=8;r+=8)t.xor(0,e,r,8),t.permute(12);t.xor(0,e,r,e.length-r),t.b[e.length-r]^=1,t.permute(12);}function et(t,e,r,n,i){const o=new q;if(o.setWord(0,t,e),o.permute(12),i){const t=8*i.length;o.w[0]^=t,o.permute(12),tt(o,i);}tt(o,r);const f=new Uint8Array(n);for(let t=0;t<n;t+=8)t&&o.permute(12),f.set(o.b.subarray(0,Math.min(8,n-t)),t);return o.wipe(),f}function rt(t){return et(2049,13369346,Y(t,"data"),32)}function nt(t,e){if(!Number.isInteger(e)||e<0)throw new RangeError("outLength must be a non-negative integer");return et(2048,13369347,Y(t,"data"),e)}const it=256;function ot(t,e,r){if(!Number.isInteger(e)||e<0)throw new RangeError("outLength must be a non-negative integer");const n=Y(r,"custom");if(n.length>it)throw new RangeError("custom must be at most 256 bytes");return et(2048,13369348,Y(t,"data"),e,n)}var ft={encrypt:W,decrypt:Q,hash256:rt,xof128:nt,cxof128:ot,CXOF_MAX_CUSTOM:it,KEY_SIZE:16,NONCE_SIZE:16,TAG_SIZE:16,HASH_SIZE:32},st=Object.freeze({__proto__:null,CXOF_MAX_CUSTOM:it,HASH_SIZE:32,KEY_SIZE:16,NONCE_SIZE:16,TAG_SIZE:16,cxof128:ot,decrypt:Q,default:ft,encrypt:W,hash256:rt,xof128:nt});const ut={SERVER_TIME_NONCE:176,AUTH_FAIL:179,AUTH_REQ:180,AUTH_RES:181,ENC_PACK:185,ENC_E2E:186,ENC:187};for(const t of Object.keys(ut))ut[ut[t]]=t;const ht={SERVER_TIME_NONCE:13,AUTH_REQ:33,AUTH_RES:17,ENC:21,ENC_PACK:29},at={client:1,server:2},ct=new TextEncoder;function lt(t){const e=H.Buffer.alloc(t);return globalThis.crypto.getRandomValues(e),e}function pt(t){return "string"==typeof t?ct.encode(t):P.B8(t)}function yt(t,e){if(!(t instanceof Uint8Array&&e instanceof Uint8Array&&t.length===e.length))return  false;let r=0;for(let n=0;n<t.length;n++)r|=t[n]^e[n];return 0===r}function gt(t){t&&t.fill(0);}function dt(t){const e=pt(t);if(!e.length)throw new RangeError("key must not be empty");return H.Buffer.from(ot(e,16,"boho/v2/key"))}function bt(t){const e=new DataView(t.buffer,t.byteOffset,t.byteLength);return {length:e.getUint32(1,true),sec:e.getUint32(5,true),ms:e.getUint16(9,true),counter:e.getUint16(11,true)}}function wt(t,e){const r=new Uint8Array(16);return r.set(t.subarray(5,13)),r[8]=e,r}function Et(t){return t instanceof Uint8Array&&t.length===ht.SERVER_TIME_NONCE&&t[0]===ut.SERVER_TIME_NONCE&&(t[5]|t[6]<<8)<1e3}class mt{constructor(){this.isAuthorized=false,this._id8=new Uint8Array(8),this._key=null,this._sessionKey=null,this._serverProof=null,this._challenge=null,this._role=null,this._lastMs=-1,this._lastCounter=0,this._sender=null;}clearAuth(){gt(this._id8),gt(this._key),gt(this._sessionKey),gt(this._serverProof),this._key=this._sessionKey=this._serverProof=this._role=null,this.isAuthorized=false;}set_id8(t){this._id8=new Uint8Array(8),this._id8.set(pt(t).subarray(0,8));}copy_id8(t){this._id8=Uint8Array.from(t.subarray(0,8));}set_key(t){this.isAuthorized=false,gt(this._sessionKey),this._sessionKey=null,this._key=t?dt(t):null;}copy_key(t){if(!(t instanceof Uint8Array)||16!==t.length)throw new RangeError("key must be 16 bytes");this.isAuthorized=false,gt(this._sessionKey),this._sessionKey=null,this._key=Uint8Array.from(t);}set_id_key(t){const e="string"==typeof t?t.indexOf("."):-1;e<1||e===t.length-1?this.clearAuth():(this.set_id8(t.slice(0,e)),this.set_key(t.slice(e+1)));}_session(t,e,r){const n=new Uint8Array(45);n.set(this._key,0),n.set(t,16),n.set(e,29),n.set(r,37);const i=ot(n,48,"boho/v2/session");return gt(n),i}server_time_nonce(){const t=Date.now(),e=H.Buffer.alloc(ht.SERVER_TIME_NONCE);return e[0]=ut.SERVER_TIME_NONCE,e.writeUInt32LE(Math.floor(t/1e3),1),e.writeUInt16LE(t%1e3,5),globalThis.crypto.getRandomValues(e.subarray(7,13)),this._challenge=H.Buffer.from(e),e}verify_auth_req(t,e=this._challenge){if(!(this._key&&Et(e)&&t instanceof Uint8Array&&t.length===ht.AUTH_REQ&&t[0]===ut.AUTH_REQ))return  false;const r=t.subarray(1,9),n=this._session(e,r,t.subarray(9,17));if(!yt(t.subarray(17,33),n.subarray(16,32)))return gt(n),false;this._id8=Uint8Array.from(r),this._sessionKey=n.slice(0,16),this._role="server",this.isAuthorized=true;const i=H.Buffer.alloc(ht.AUTH_RES);return i[0]=ut.AUTH_RES,i.set(n.subarray(32,48),1),gt(n),i}auth_req(t,e=lt(8)){if(!this._key||!Et(t))return  false;const r=this._session(t,this._id8,e);this._sessionKey=r.slice(0,16),this._serverProof=r.slice(32,48),this._role="client",this.isAuthorized=false;const n=H.Buffer.alloc(ht.AUTH_REQ);return n[0]=ut.AUTH_REQ,n.set(this._id8,1),n.set(e,9),n.set(r.subarray(16,32),17),gt(r),n}verify_auth_res(t){if(this._serverProof&&t instanceof Uint8Array&&t.length===ht.AUTH_RES&&t[0]===ut.AUTH_RES&&yt(t.subarray(1),this._serverProof))return gt(this._serverProof),this._serverProof=null,this.isAuthorized=true,true}_nextClock(){let t,e=Date.now();return e>this._lastMs?t=this._lastCounter+1&65535:(e=this._lastMs,t=this._lastCounter+1,t>65535&&(e++,t=0)),this._lastMs=e,this._lastCounter=t,{sec:Math.floor(e/1e3),ms:e%1e3,counter:t}}_header(t,e){const r=this._nextClock(),n=new Uint8Array(13),i=new DataView(n.buffer);return n[0]=t,i.setUint32(1,e,true),i.setUint32(5,r.sec,true),i.setUint16(9,r.ms,true),i.setUint16(11,r.counter,true),n}encrypt_session(t,e=ut.ENC){if(!this.isAuthorized||!this._sessionKey)return;if(e!==ut.ENC&&e!==ut.ENC_E2E)return;const r=pt(t),n=this._header(e,r.length),i=W(this._sessionKey,wt(n,at[this._role]),r,n,8),o=H.Buffer.alloc(ht.ENC+r.length);return o.set(n,0),o.set(i.subarray(r.length),13),o.set(i.subarray(0,r.length),21),o}decrypt_session(t){if(!this.isAuthorized||!this._sessionKey||!(t instanceof Uint8Array)||t.length<ht.ENC)return;const e=t[0];if(e!==ut.ENC&&e!==ut.ENC_E2E)return;const r=bt(t),n=t.length-ht.ENC;if(r.length>n||e===ut.ENC&&r.length!==n||r.ms>=1e3)return;const i=t.subarray(0,13),o=new Uint8Array(r.length+8);o.set(t.subarray(21,21+r.length)),o.set(t.subarray(13,21),r.length);const f="client"===this._role?at.server:at.client,s=Q(this._sessionKey,wt(i,f),o,i,8);return s?H.Buffer.from(s.buffer,s.byteOffset,s.byteLength):void 0}_seal(t,e){const r=pt(e);this._sender??=lt(8);const n=this._nextClock(),i=new Uint8Array(21),o=new DataView(i.buffer);i[0]=ut.ENC_PACK,o.setUint32(1,r.length,true),o.setUint32(5,n.sec,true),o.setUint16(9,n.ms,true),o.setUint16(11,n.counter,true),i.set(this._sender,13);const f=W(t,i.subarray(5,21),r,i.subarray(0,5),8),s=H.Buffer.alloc(ht.ENC_PACK+r.length);return s.set(i,0),s.set(f.subarray(r.length),21),s.set(f.subarray(0,r.length),29),s}_open(t,e){if(!(e instanceof Uint8Array)||e.length<ht.ENC_PACK||e[0]!==ut.ENC_PACK)return;const r=bt(e);if(r.length!==e.length-ht.ENC_PACK||r.ms>=1e3)return;const n=new Uint8Array(r.length+8);n.set(e.subarray(29)),n.set(e.subarray(21,29),r.length);const i=Q(t,e.subarray(5,21),n,e.subarray(0,5),8);return i?{type:ut.ENC_PACK,len:r.length,sec:r.sec,ms:r.ms,counter:r.counter,sender:H.Buffer.from(e.subarray(13,21)),data:H.Buffer.from(i.buffer,i.byteOffset,i.byteLength)}:void 0}encryptPack(t){if(this._key)return this._seal(this._key,t)}decryptPack(t){if(this._key)return this._open(this._key,t)}encrypt_e2e(t,e){if(!e)return;const r=dt(e);try{return this._seal(r,t)}finally{gt(r);}}decrypt_e2e(t,e){if(!e)return;const r=dt(e);try{return this._open(r,t)}finally{gt(r);}}}mt.deriveKey=dt;const Bt=new Uint32Array([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]);function At(t,e,r,n,i){let o,f,s,u,h,a,c,l,p,y,g,d,b;for(;i>=64;){for(o=e[0],f=e[1],s=e[2],u=e[3],h=e[4],a=e[5],c=e[6],l=e[7],y=0;y<16;y++)g=n+4*y,t[y]=(255&r[g])<<24|(255&r[g+1])<<16|(255&r[g+2])<<8|255&r[g+3];for(y=16;y<64;y++)p=t[y-2],d=(p>>>17|p<<15)^(p>>>19|p<<13)^p>>>10,p=t[y-15],b=(p>>>7|p<<25)^(p>>>18|p<<14)^p>>>3,t[y]=(d+t[y-7]|0)+(b+t[y-16]|0);for(y=0;y<64;y++)d=(((h>>>6|h<<26)^(h>>>11|h<<21)^(h>>>25|h<<7))+(h&a^~h&c)|0)+(l+(Bt[y]+t[y]|0)|0)|0,b=((o>>>2|o<<30)^(o>>>13|o<<19)^(o>>>22|o<<10))+(o&f^o&s^f&s)|0,l=c,c=a,a=h,h=u+d|0,u=s,s=f,f=o,o=d+b|0;e[0]+=o,e[1]+=f,e[2]+=s,e[3]+=u,e[4]+=h,e[5]+=a,e[6]+=c,e[7]+=l,n+=64,i-=64;}return n}const Ut=function(){function t(){this.digestLength=32,this.blockSize=64,this.state=new Int32Array(8),this.temp=new Int32Array(64),this.buffer=new Uint8Array(128),this.bufferLength=0,this.bytesHashed=0,this.finished=false,this.reset();}return t.prototype.reset=function(){return this.state[0]=1779033703,this.state[1]=3144134277,this.state[2]=1013904242,this.state[3]=2773480762,this.state[4]=1359893119,this.state[5]=2600822924,this.state[6]=528734635,this.state[7]=1541459225,this.bufferLength=0,this.bytesHashed=0,this.finished=false,this},t.prototype.clean=function(){for(var t=0;t<this.buffer.length;t++)this.buffer[t]=0;for(t=0;t<this.temp.length;t++)this.temp[t]=0;this.reset();},t.prototype.update=function(t,e){if(void 0===e&&(e=t.length),this.finished)throw new Error("SHA256: can't update because hash was finished.");let r=0;if(this.bytesHashed+=e,this.bufferLength>0){for(;this.bufferLength<64&&e>0;)this.buffer[this.bufferLength++]=t[r++],e--;64===this.bufferLength&&(At(this.temp,this.state,this.buffer,0,64),this.bufferLength=0);}for(e>=64&&(r=At(this.temp,this.state,t,r,e),e%=64);e>0;)this.buffer[this.bufferLength++]=t[r++],e--;return this},t.prototype.finish=function(t){if(!this.finished){const t=this.bytesHashed,r=this.bufferLength,n=t/536870912|0,i=t<<3,o=t%64<56?64:128;this.buffer[r]=128;for(var e=r+1;e<o-8;e++)this.buffer[e]=0;this.buffer[o-8]=n>>>24&255,this.buffer[o-7]=n>>>16&255,this.buffer[o-6]=n>>>8&255,this.buffer[o-5]=n>>>0&255,this.buffer[o-4]=i>>>24&255,this.buffer[o-3]=i>>>16&255,this.buffer[o-2]=i>>>8&255,this.buffer[o-1]=i>>>0&255,At(this.temp,this.state,this.buffer,0,o),this.finished=true;}for(e=0;e<8;e++)t[4*e+0]=this.state[e]>>>24&255,t[4*e+1]=this.state[e]>>>16&255,t[4*e+2]=this.state[e]>>>8&255,t[4*e+3]=this.state[e]>>>0&255;return this},t.prototype.digest=function(){const t=new Uint8Array(this.digestLength);return this.finish(t),t},t.prototype._saveState=function(t){for(let e=0;e<this.state.length;e++)t[e]=this.state[e];},t.prototype._restoreState=function(t,e){for(let e=0;e<this.state.length;e++)this.state[e]=t[e];this.bytesHashed=e,this.finished=false,this.bufferLength=0;},t}(),_t=function(){function t(t){this.inner=new Ut,this.outer=new Ut,this.blockSize=this.inner.blockSize,this.digestLength=this.inner.digestLength;const e=new Uint8Array(this.blockSize);if(t.length>this.blockSize)(new Ut).update(t).finish(e).clean();else for(var r=0;r<t.length;r++)e[r]=t[r];for(r=0;r<e.length;r++)e[r]^=54;this.inner.update(e);for(r=0;r<e.length;r++)e[r]^=106;this.outer.update(e),this.istate=new Uint32Array(8),this.ostate=new Uint32Array(8),this.inner._saveState(this.istate),this.outer._saveState(this.ostate);for(r=0;r<e.length;r++)e[r]=0;}return t.prototype.reset=function(){return this.inner._restoreState(this.istate,this.inner.blockSize),this.outer._restoreState(this.ostate,this.outer.blockSize),this},t.prototype.clean=function(){for(let t=0;t<this.istate.length;t++)this.ostate[t]=this.istate[t]=0;this.inner.clean(),this.outer.clean();},t.prototype.update=function(t){return this.inner.update(t),this},t.prototype.finish=function(t){return this.outer.finished?this.outer.finish(t):(this.inner.finish(t),this.outer.update(t,this.digestLength).finish(t)),this},t.prototype.digest=function(){const t=new Uint8Array(this.digestLength);return this.finish(t),t},t}();function It(t){const e=(new Ut).update(t),r=e.digest();return e.clean(),r}const vt={hash:function(t){return It(P.U8(t))},hex:function(t){return P.B8(It(P.U8(t))).toString("hex")},base64:function(t){return P.B8(It(P.U8(t))).toString("base64")}};vt.hmac=function(t,e){return function(t,e){const r=new _t(t).update(e),n=r.digest();return r.clean(),n}(P.U8(t),P.U8(e))},mt.RAND=lt,mt.BohoMsg=ut,mt.MetaSize=ht,mt.deriveKey=dt,mt.ascon=st,mt.sha256=vt,mt.MBP=P,mt.Buffer=H.Buffer;

/**
 * @typedef {import('../common/constants.js').IOMsg} IOMsg
 * @typedef {import('../common/constants.js').PAYLOAD_TYPE} PAYLOAD_TYPE
 * @typedef {import('../common/constants.js').SIZE_LIMIT} SIZE_LIMIT
 * @typedef {import('../common/constants.js').ENC_MODE} ENC_MODE
 * @typedef {import('../common/constants.js').STATE} STATE
 
 * @typedef {import('boho').Buffer} Buffer
 */

const Buffer$1 = $$1.Buffer;
const encoder$2 = new TextEncoder();
const decoder$4 = new TextDecoder();

// Wire tag lengths use one byte, regardless of JavaScript string length.
function encodeTag(tag, allowEmpty = true) {
  if (typeof tag !== 'string') throw TypeError('tag should be string.')
  const encoded = encoder$2.encode(tag);
  if ((!allowEmpty && encoded.byteLength === 0) || encoded.byteLength > SIZE_LIMIT.TAG_LEN1) {
    throw TypeError('tag UTF-8 byte length must be ' + (allowEmpty ? '0' : '1') + '~255')
  }
  return encoded
}

// Direct-receive tags are local event names, never server subscriptions.
function encodeSubscriptionTags(tag) {
  const encoded = encodeTag(tag);
  if (tag.split(',').some(part => part.startsWith('@'))) {
    throw TypeError("direct signal tags need no subscription; use on/listen/link and off/unlink")
  }
  return encoded
}

// Subscriptions are queued and sent together (queueSubscription): a page that links many tags at once
// (a device list) would otherwise send one message per tag, and a broker drops what is over the
// connection's msgPerSec quota (anonymous: 100), such as the #search sent right after them.
function sendSubscription(io, tag) {
  encodeSubscriptionTags(tag); // throws for an invalid tag here, not later in the flush
  queueSubscription(io, IOMsg.SUBSCRIBE, tag);
}

// Queues SUBSCRIBE / UNSUBSCRIBE of tags. Consecutive ones of the same kind become one comma-joined
// message (split at the one-byte tag length), in order. The queue is sent at the end of this turn,
// or first thing before any other encrypted message, so a signal sent after a link() still reaches
// the broker after the subscription. A queue left from an earlier connection is dropped (the new
// connection's subscriptions go out with subscribe_channels()).
function queueSubscription(io, type, tag) {
  const queue = io._subscriptionQueue;
  if (queue.revision !== io._stateRevision) {
    queue.groups.length = 0;
    queue.revision = io._stateRevision;
  }
  const last = queue.groups.at(-1);
  if (last && last.type === type) last.tags.push(...tag.split(','));
  else queue.groups.push({ type, tags: tag.split(',') });
  if (!queue.scheduled) {
    queue.scheduled = true;
    queueMicrotask(() => flushSubscriptions(io));
  }
}

function flushSubscriptions(io) {
  const queue = io._subscriptionQueue;
  queue.scheduled = false;
  if (queue.flushing || queue.groups.length === 0) return
  const groups = queue.revision === io._stateRevision ? queue.groups.splice(0) : (queue.groups.length = 0, []);
  queue.flushing = true;
  try {
    for (const { type, tags } of groups) {
      let batch = [];
      let bytes = 0;
      const send = () => {
        const encoded = encodeTag(batch.join(','));
        io.send_enc_mode(Buffer$1.concat([$$1.NB('8', type), $$1.NB('8', encoded.byteLength), encoded]));
        batch = [];
        bytes = 0;
      };
      for (const tag of tags) {
        const size = encodeTag(tag).byteLength;
        if (batch.length && bytes + 1 + size > SIZE_LIMIT.TAG_LEN1) send();
        bytes += (batch.length ? 1 : 0) + size;
        batch.push(tag);
      }
      if (batch.length) send();
    }
  } finally {
    queue.flushing = false;
  }
}

// Names the client emits itself. A signal or SERVER_SIGNAL with one of these as its tag is not
// emitted under that name, so nothing from the network can pose as a connection event (a signal
// on a channel called 'close' would otherwise run the client's own close handling).
const INTERNAL_EVENTS = new Set(['open', 'close', 'closed', 'socket_data', 'change', 'error', 'message',
  'connecting', 'closing', 'server_ready', 'auth_req', 'auth_res', 'auth_fail', 'auth_clear',
  'cid_req', 'cid_res', 'ready', 'stop', 'redirecting', 'pong', 'echo', 'iam_res', 'over_size',
  'text_message']);

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
    this._stateRevision = 0;
    this._subscriptionQueue = { groups: [], revision: 0, scheduled: false, flushing: false };

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
     * Last time anything was received from the server (see keepAlive()).
     * @type {number}
     */
    this.lastRxTime = Date.now();
    /** @private Time of a PING that has had no answer yet; 0 when none is pending. */
    this._pingSentAt = 0;
    /** @private Connections closed since the last ready, and the earliest time of the next automatic attempt. */
    this._reconnectAttempts = 0;
    this._nextConnectAt = 0;
    /**
     * Period for connection checker.
     * @type {number}
     */
    this.connectionCheckerPeriod = SIZE_LIMIT.CONNECTION_CHECKER_PERIOD;
    /**
     * Interval ID for connection checker.
     * @type {ReturnType<typeof setInterval> | null}
     */
    this.connectionCheckerIntervalID = null;

    /**
     * Boho instance for encryption/decryption.
     * @type {Boho}
     */
    this.boho = new mt();

    /** @type {import('buffer').Buffer} */
    this.serverTimeNonce = Buffer$1.alloc( mt.MetaSize.SERVER_TIME_NONCE  );
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
     * This connection's quota as told by the server (QUOTA). maxMessageBytes: largest message
     * send() passes on; null: no limit (also until the server tells).
     * @type {{ maxMessageBytes: number | null }}
     */
    this.quota = { maxMessageBytes: null };
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
    /** @private @type {Map<string, Map<string, Set<Function>>>} */
    this._linkHandlers = new Map();
    /** @private @type {Set<string>} */
    this._listenTags = new Set();
    this._readyDispatch = false; // true while 'ready' handlers run; see listen()
    // The _stateRevision whose READY has had its stored subscriptions sent (see _subscribeNow()).
    this._channelsSentRevision = -1;
    /** @private @type {Set<string>} */
    this._manualSubscriptions = new Set();

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
   * Performs common cleanup for the connection. It rejects pending RPCs,
   * resets the socket reference, and sets the state to closed.
   * This method is guarded to only run once.
   * If autoReconnect is false, it also clears the keep-alive timer.
   */
  close() {
    // console.log('####### IOCOre.js close() called')
    this.clearHelloTimer();
    this._pingSentAt = 0;
    // If auto-reconnect is disabled, we must stop the keep-alive timer.
    if (this.autoReconnect === false) {
      clearInterval(this.connectionCheckerIntervalID);
      this.connectionCheckerIntervalID = null;
    }
    if (this._closed) return;
    this._closed = true;
    this.scheduleReconnect();

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
    const error = new Error('Connection closed');
    error.code = 'CONNECTION_CLOSED';
    for (const [, reject, timeoutId] of this.promiseMap.values()) {
      clearTimeout(timeoutId);
      reject(error);
    }
    this.promiseMap.clear();
    this._manualSubscriptions.clear();
    this.cid = '';
    if (this.boho) this.boho.isAuthorized = false;
    if (this.state !== STATE.STOP && this.stateChange('closed')) {
      this.emit('closed');
    }
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
   * The instance will not be usable after this. Later signal()/publish()/subscribe()
   * calls are silently dropped, the same as sends while disconnected, and call()
   * rejects with code 'CONNECTION_CLOSED'.
   */
  destroy() {
    this.stop();
    this.removeAllListeners();

    this.channels.clear();
    this.linkMap.clear();
    this._linkHandlers.clear();
    this._listenTags.clear();
    this._manualSubscriptions.clear();

    // Help GC
    this.boho = null;
  }

  /**
   * The core keep-alive logic. 
   * The specific logic for checking the socket's state and reconnecting
   * is implemented keepConnection() in the child classes (IOWS, IOCongSocket, etc.).
   */
  keepAlive() {
    if (Date.now() >= this._nextConnectAt) this.keepConnection();
    if (!this.isLinkUp()) return;
    const now = Date.now();
    // A PING the server did not answer with anything: the connection is dead although the socket
    // still looks open (lost Wi-Fi, a sleeping phone, a NAT that dropped it). Close it; with
    // autoReconnect the next keepAlive() connects again.
    if (this._pingSentAt && now - this._pingSentAt > SIZE_LIMIT.PONG_TIMEOUT) {
      this.emit('error', new Error('no reply from the server in ' + SIZE_LIMIT.PONG_TIMEOUT / 1000 + ' s; reconnecting'));
      this.close();
      return;
    }
    // Sending does not show the server is there, so this follows what was received.
    if (!this._pingSentAt && now - this.lastRxTime > SIZE_LIMIT.CLIENT_PING_PERIOD) {
      this.ping();
    }
  }

  /** @private When keepAlive() may connect again after this close: see SIZE_LIMIT.RECONNECT_*. */
  scheduleReconnect() {
    const attempt = this._reconnectAttempts++;
    const delay = attempt === 0
      ? Math.random() * SIZE_LIMIT.RECONNECT_JITTER
      : Math.min(SIZE_LIMIT.RECONNECT_MAX, SIZE_LIMIT.RECONNECT_BASE * 2 ** (attempt - 1)) * (0.8 + Math.random() * 0.4);
    this._nextConnectAt = Date.now() + delay;
  }

  /** @private True from the socket opening until it closes (any state a server message can arrive in). */
  isLinkUp() {
    return !!this.socket && !this._closed && (this.state === STATE.OPEN || this.state >= STATE.SERVER_READY);
  }

  /**
   * Redirects the connection to a new URL.
   * @param {string} url2 - The new URL to redirect to.
   */
  redirect(url2) {
    this.stateChange('redirecting','redirecting');
    this.close();
    this.createConnection(url2);
    this.armHelloTimer();
  }

  /**
   * Closes a connection that has not got the server's hello in SIZE_LIMIT.SERVER_HELLO_TIMEOUT
   * (a server that cannot be reached, or a connection that opens but never answers). With
   * autoReconnect the client then reconnects to this.url, so a failed redirect falls back to the
   * original server, as the Arduino library does.
   */
  armHelloTimer() {
    this.clearHelloTimer();
    if (this._closed || !this.socket) return;
    const socket = this.socket;
    this.helloTimerID = setTimeout(() => {
      this.helloTimerID = null;
      if (this.socket !== socket) return;
      this.emit('error', new Error('no reply from the server in ' + SIZE_LIMIT.SERVER_HELLO_TIMEOUT / 1000 + ' s'));
      this.close();
    }, SIZE_LIMIT.SERVER_HELLO_TIMEOUT);
  }

  clearHelloTimer() {
    if (this.helloTimerID) clearTimeout(this.helloTimerID);
    this.helloTimerID = null;
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
    if (this._closed) return; // A connecting listener may have stopped the client.
    this.armHelloTimer();

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
    this.lastRxTime = Date.now();
    this._pingSentAt = 0;
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
    this.close();
  }

  /**
   * Manually logs in with provided ID and key.
   * @param {string} id - The user ID. or 'id.key'
   * @param {string} key - The user key.
   * @returns {this} 
   */
  login(id, key) {
    if( this.serverTimeNonce ){
      this.auth(id, key);
      this.useAuth = true;
      let auth_pack = this.boho.auth_req(this.serverTimeNonce );
      // false: no key was set (bad arguments), or the server has not said hello on this connection yet.
      if (!auth_pack) return this
      this.send(auth_pack);
      this.stateChange('auth_req', 'auth_req');
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
    if (key === null || key === '') key = undefined; // auth('id.key', '') from a form with one field
    if (typeof id !== 'string' || !id || (key === undefined ? !/^[^.]+\..+$/.test(id) : typeof key !== 'string')) {
      this.emit('error', new Error("auth failed. use auth('id', 'key') or auth('id.key')."));
      return this
    }
    // The ID travels as 8 bytes; a longer one is cut (as before), which the server may not know.
    const loginId = key === undefined ? id.slice(0, id.indexOf('.')) : id;
    if (encoder$2.encode(loginId).byteLength > SIZE_LIMIT.DID) {
      this.emit('error', new Error(`auth: login ID '${loginId}' is longer than ${SIZE_LIMIT.DID} bytes and is cut to them.`));
    }
    if (key === undefined) {
      this.boho.set_id_key(id);
    } else {
      this.boho.set_id8(id);
      this.boho.set_key(key);
    }
    this.useAuth = true;
    return this
  }

  /**
   * Handles incoming data from the WebSocket.
   * @param {Buffer} buffer - The incoming data buffer.
   */
  onData(buffer) {
    this.lastRxTime = Date.now();
    this._pingSentAt = 0;
    let msgType = buffer[0];
    let decoded;

    if (msgType === mt.BohoMsg.ENC) {
      decoded = this.boho.decrypt_session(buffer);
      if (decoded) {
        msgType = decoded[0];
        buffer = decoded;
      } else {
        // Not from this session (or damaged): dropped, never passed on as a text message.
        return
      }
    } else if (msgType === mt.BohoMsg.ENC_E2E) {

      try {
        decoded = this.boho.decrypt_session(buffer);
        if (decoded) {
          // console.log( 'ENC_E2E decoded ', decoded )
          msgType = decoded[0];
          // decoded has msg_header only. 
          buffer.set(decoded, mt.MetaSize.ENC); // set decoded signal_e2e headaer. 
          buffer = buffer.subarray(mt.MetaSize.ENC); // reset offset. 
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
    if (!type) type = mt.BohoMsg[msgType];

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
        this.emit('pong');
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

        // State first (subscribe_channels needs READY), then the stored subscriptions, and only then
        // 'ready': a signal sent from a ready handler reaches the server after our own subscriptions.
        // stateChange() without a message emits 'change' only; false means a handler moved the state on.
        this._reconnectAttempts = 0;
        if (!this.stateChange('ready')) break;
        this.subscribe_channels();
        // From here listen() and link() subscribe a new tag at once; before (in a 'change' handler
        // for 'ready') the tag is in channels and goes out with the list just sent, only once.
        this._channelsSentRevision = this._stateRevision;
        this._readyDispatch = true;
        try {
          this.emit('ready', 'cid_ready');
        } finally {
          this._readyDispatch = false;
        }
        break;

      case IOMsg.QUOTA: {
        if (buffer.byteLength < 5) break;
        const maxMessageBytes = (buffer[1] | buffer[2] << 8 | buffer[3] << 16) + buffer[4] * 0x1000000;
        this.quota = { maxMessageBytes: maxMessageBytes || null };
        break;
      }

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

      case mt.BohoMsg.SERVER_TIME_NONCE: // SERVER_READY
        this.clearHelloTimer();
        buffer.copy(this.serverTimeNonce);
        if (!this.stateChange('server_ready', 'server_ready')) break;
        if (this.useAuth) {
          this.send(this.boho.auth_req(buffer));
          this.stateChange('auth_req','auth_req');
          // CID_REQ will be called, after auth_res.
        } else {
          // CID_REQ here, if not using auth.
          this.send(Buffer$1.from([IOMsg.CID_REQ]));
        }
        break;

      case IOMsg.SERVER_SIGNAL:
        try {
          let str = decoder$4.decode(buffer.subarray(1));
          let ss = JSON.parse(str);

          if (typeof ss.event === 'string' && ss.event && ss.data && !INTERNAL_EVENTS.has(ss.event)) {
            this.serverSet = ss.data;
            this.emit(ss.event, ss.data);
          }

        } catch (error) {
          this.emit('error', new Error('SERVER_SIGNAL parsing error'));
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
          const args = decodeSignalArgs(payloadType, payloadBuffer);
          if (args) {
            if (tag.indexOf('@') === 0) {
              this.emit('@', tag, ...args);
              if (tag !== '@') this.emit(tag, tag, ...args);
            } else {
              // A channel whose name is one of the client's own events reaches 'message' only.
              if (!INTERNAL_EVENTS.has(tag)) this.emit(tag, tag, ...args);
              this.emit('message', tag, ...args);
            }
          }

        } catch (err) {
          // this.emit('error', new Error('IOCore IOMsg.SIGNAL parser err', err))
          console.log('IOCore IOMsg.SIGNAL parser err', err);
        }
        break;

      case IOMsg.RESPONSE_MBP:
        this.testPromise(buffer);
        break;

      case mt.BohoMsg.AUTH_FAIL:
        this.boho.isAuthorized = false;
        this.stateChange('auth_fail', 'auth_fail from server.');
        break;

      case mt.BohoMsg.AUTH_RES:
        if (this.boho.verify_auth_res(buffer)) {
          if (!this.stateChange('auth_res', 'server sent auth_res')) break;
          this.send(Buffer$1.from([IOMsg.CID_REQ]));
        } else {
          this.boho.isAuthorized = false;
          this.stateChange('auth_fail', 'verify_auth_res() invalid server_hmac');
        }
        break;

      default:
        // 0xB0-0xBF belong to Boho: an unknown one (a Boho 2.x code, or one that did not decrypt) is dropped.
        if (msgType >= 0xB0 && msgType <= 0xBF) break;
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
      this.send_enc_mode($$1.pack(
        $$1.MB('#MsgType', '8', IOMsg.IAM),
        $$1.MB('#', title)
      ));
    } else {
      this.send_enc_mode($$1.pack(
        $$1.MB('#MsgType', '8', IOMsg.IAM)
      ));
    }
  }


  /**
   * Measures the round trip to the server: sends a PING and resolves with the milliseconds until a PONG
   * arrives. One measurement at a time. A PONG that answers the client's own keep-alive PING counts too,
   * so a measurement may come out a little short right after a quiet spell.
   * Rejects with an Error whose code is 'NOT_READY' (not connected), 'BUSY' (a measurement is waiting),
   * 'TIMEOUT' (no PONG within timeoutMs) or 'CONNECTION_CLOSED' (the connection closed first).
   * @param {{ timeoutMs?: number }} [options] timeoutMs: 1 to 60000 (default 3000)
   * @returns {Promise<number>}
   */
  pingServer({ timeoutMs = 3000 } = {}) {
    const fail = (code, message) => Promise.reject(Object.assign(new Error(message), { code }));
    if (!Number.isInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 60000) return fail('INVALID_ARGUMENT', 'timeoutMs must be an integer from 1 to 60000');
    if (this.stateName !== 'ready') return fail('NOT_READY', 'the server connection is not ready');
    if (this._pingServerWaiting) return fail('BUSY', 'already waiting for a pong');
    this._pingServerWaiting = true;
    return new Promise((resolve, reject) => {
      const startedAt = performance.now();
      const done = (error, ms) => {
        clearTimeout(timer);
        this.removeListener('pong', onPong);
        this.removeListener('closed', onClosed);
        this.removeListener('stop', onClosed);
        this._pingServerWaiting = false;
        if (error) reject(error); else resolve(ms);
      };
      const onPong = () => done(null, performance.now() - startedAt);
      const onClosed = () => done(Object.assign(new Error('the connection closed before the pong'), { code: 'CONNECTION_CLOSED' }));
      const timer = setTimeout(() => done(Object.assign(new Error(`no pong in ${timeoutMs} ms`), { code: 'TIMEOUT' })), timeoutMs);
      this.on('pong', onPong);
      this.on('closed', onClosed);
      this.on('stop', onClosed);
      try { this.ping(); } catch (error) { done(error); }
    });
  }

  /**
   * Sends a PING message to the server.
   */
  ping() {
    // Any message from the server answers it (see keepAlive()).
    if (!this._pingSentAt && this.isLinkUp()) this._pingSentAt = Date.now();
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
      this.send_enc_mode($$1.pack(
        $$1.MB('#MsgType', '8', IOMsg.ECHO),
        $$1.MB('#msg', args)
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
    this.send($$1.U8pack(...data));
  }

  /**
   * Sends data over the WebSocket.
   * @param {Buffer} data - The data buffer to send.
   */
  send(data) {
    const maxMessageBytes = this.quota.maxMessageBytes;
    if (maxMessageBytes !== null && data.byteLength > maxMessageBytes) {
      this.emit('over_size');
      console.log(`## quota: ${data.byteLength} bytes is over this connection's maxMessageBytes ${maxMessageBytes}`);
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
      !this.TLS && this.boho?.isAuthorized
    ) {
      return true;
    } else {
      return false
    }
  }

  /**
   * Sends data with encryption based on the encryption mode.
   * Like an unconnected socket, a destroyed instance silently drops the data.
   * @param {Buffer} data - The data buffer to send.
   * @param {boolean} [useEncryption] - Optional. Force encryption or not. If undefined, uses default policy.
   */
  send_enc_mode(data, useEncryption) {
    if (!this.boho) return; // destroyed
    // Queued (un)subscriptions go first, so messages keep the order they were made in.
    if (this._subscriptionQueue.groups.length && !this._subscriptionQueue.flushing) flushSubscriptions(this);

    // use default policy.
    if (useEncryption === undefined) {
      useEncryption = this.getEncryptionMode();
    }

    if (data[0] == IOMsg.SIGNAL_E2E && useEncryption) {
      // input data:  signal_header + e2ePayload
      // encrypt signal_header area only. payload is encrypted with e2e key already.
      let tagLen = data[1];
      let encHeader = this.boho.encrypt_session(data.subarray(0, 3 + tagLen), mt.BohoMsg.ENC_E2E);
      this.send(Buffer$1.concat([encHeader, data.subarray(3 + tagLen)]));
      // console.log('<< send_enc_mode [ ENC_E2E ]')

    } else if (useEncryption) {
      // console.log('<< send_enc_mode [ ENC ]')
      let encPack = this.boho.encrypt_session(data);
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

    let res = $$1.unpack(buffer);
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
    if (tag.startsWith('@') && this.cid) encodeTag(this.cid + tag);
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

    const tagEncoded = encodeTag(tag);
    if (tag.startsWith('@') && this.cid) encodeTag(this.cid + tag);
    if( !this.boho?.isAuthorized ) return;
    let dataPack = $$1.B8(data);

    //encrypt payload area with key
    let sercretPack = this.boho.encrypt_e2e(dataPack, key);

    //change signal MsgType header into SIGNAL_E2E
    let signalPack = $$1.pack(
      $$1.MB('#MsgType', '8', IOMsg.SIGNAL_E2E),
      $$1.MB('#tagLen', '8', tagEncoded.byteLength),
      $$1.MB('#tag', tagEncoded),
      $$1.MB('#payloadType', '8', PAYLOAD_TYPE.BINARY),
      $$1.MB('#payload', sercretPack)
    );

    this.send_enc_mode(signalPack);
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
    if (!this.boho) {
      // destroyed: reject like close() does for pending calls instead of waiting for a timeout.
      const error = new Error('Connection closed');
      error.code = 'CONNECTION_CLOSED';
      return Promise.reject(error);
    }
    this.mid = (this.mid + 1) & 0xffff;
    let sigPack;
    if (args.length > 0) {
      sigPack = $$1.pack(
        $$1.MB('#MsgType', '8', IOMsg.CALL),
        $$1.MB('mid', '16', this.mid),
        $$1.MB('target', target),
        $$1.MB('topic', topic),
        $$1.MBA(...args)
      );
    } else {
      sigPack = $$1.pack(
        $$1.MB('#MsgType', '8', IOMsg.CALL),
        $$1.MB('mid', '16', this.mid),
        $$1.MB('target', target),
        $$1.MB('topic', topic)
      );
    }
    this.send_enc_mode(sigPack);
    return this.setMsgPromise(this.mid)
  }


  /**
   * Subscribes to a channel or channels on the current, ready connection, at once.
   * Call it from a ready handler (it runs on every connect) or later while ready; it is not
   * repeated after a reconnect. To subscribe before connecting, or for every connection
   * without a ready handler, use listen() or link().
   * @param {string} tag - The tag(s) of the channel(s) to subscribe to (comma-separated).
   * @throws {TypeError} If tag is invalid, exceeds the length limit, or contains a direct-receive subscription.
   * @throws {Error} If the connection is not ready (after destroy() it is a no-op instead).
   */
  subscribe(tag) {
    encodeSubscriptionTags(tag);
    if (!this.boho) return // destroyed: a no-op, like every send after destroy()
    if (this.state !== STATE.READY) {
      // Before the CID the request would go out unauthenticated and unencrypted; while
      // disconnected it would be lost. Neither should pass silently.
      throw new Error(`subscribe('${tag}') needs a ready connection (state: ${this.stateName}); call it from a ready handler, or use listen() or link()`)
    }
    sendSubscription(this, tag);
    for (const part of tag.split(',')) this._manualSubscriptions.add(part);
  }


  /**
   * Sends subscriptions stored by listen()/link() on each CID-ready transition,
   * including reconnection. This automates subscription setup for simple clients.
   */
  subscribe_channels() {
    if (this.state !== STATE.READY || this.channels.size === 0) return
    // Validate the entire list first, then split only at tag boundaries.
    // Preserve comma-separated entries accepted by existing registration APIs.
    const tags = Array.from(this.channels).join(',').split(',');
    const sizes = tags.map(tag => encodeSubscriptionTags(tag).byteLength);
    const batches = [];
    let batch = [], bytes = 0;
    tags.forEach((tag, i) => {
      if (batch.length && bytes + 1 + sizes[i] > SIZE_LIMIT.TAG_LEN1) {
        batches.push(batch.join(','));
        batch = [];
        bytes = 0;
      }
      bytes += (batch.length ? 1 : 0) + sizes[i];
      batch.push(tag);
    });
    if (batch.length) batches.push(batch.join(','));
    batches.forEach(tag => sendSubscription(this, tag));
  }

  /**
   * True when a tag that listen() or link() adds now must be subscribed now: the connection is
   * READY and its stored subscriptions have been sent. Before that (not ready yet, or a 'change'
   * handler for 'ready') the tag only joins channels and goes out with them, so its retained
   * value comes once.
   * @private
   */
  _subscribeNow() {
    return this.state === STATE.READY && this._channelsSentRevision === this._stateRevision
  }

  /**
   * Unsubscribes from a channel or channels.
   * @param {string} [tag=""] - The tag(s) of the channel(s) to unsubscribe from (comma-separated). If empty, unsubscribes from all.
   * @throws {TypeError} If tag is invalid, exceeds the length limit, or contains a direct-receive subscription.
   */
  unsubscribe(tag = "") {
    const tagEncoded = encodeSubscriptionTags(tag);

    if (tag == "") { // blank tag means unsubscribe all
      this.channels.clear();
      this._listenTags.clear();
      this._manualSubscriptions.clear();
    } else {
      let tagList = tag.split(',');
      tagList.forEach(tag => {
        this.channels.delete(tag);
        this._listenTags.delete(tag);
        this._manualSubscriptions.delete(tag);
      });
    }


    if (tag == "") {
      this.send_enc_mode(Buffer$1.concat([
        $$1.NB('8', IOMsg.UNSUBSCRIBE),
        $$1.NB('8', tagEncoded.byteLength),
        tagEncoded]));
    } else {
      queueSubscription(this, IOMsg.UNSUBSCRIBE, tag);
    }
  }


  /**
   * Register a tag handler and remember its subscription in channels: the CID-ready flow
   * subscribes it on the initial connection and again after each reconnect, before 'ready' is
   * emitted, so a ready handler may signal at once. Called on a ready connection (from a timer,
   * an event or another tag's handler), it also subscribes at once.
   * Do not call listen() inside a ready handler; it throws there, for any tag: a handler
   * registered on every connect runs once more after each reconnect. In a ready handler use
   * on() and subscribe(). Likewise, code that runs again and again (a handler, a timer) adds one
   * more handler on each listen(); use link() and unlink() for subscriptions that come and go.
   * Direct signals need no subscription: use listen('@') during setup, or on('@'), for all
   * direct signals, or '@topic' for an exact topic.
   * Dispatch is synchronous: '@' first, then '@topic' when tag is not '@'.
   * Returning false does not cancel dispatch; a thrown error interrupts it.
   * @param {string} tag - The tag to listen on.
   * @param {Function} handler - The callback function to handle the signal.
   * @throws {TypeError} If tag is not a string, handler is not a function, or tag length is invalid.
   * @throws {Error} If called inside a ready handler.
   */
  listen(tag, handler) {
    if (typeof tag !== 'string') throw TypeError('tag should be string.')
    encodeTag(tag, false);
    if (typeof handler !== 'function') throw TypeError('handler is not a function.')
    if (this._readyDispatch) {
      throw new Error(`listen('${tag}') inside a ready handler: call listen() in the setup code that runs before the connection is ready, or use on() and subscribe() in the ready handler`)
    }

    if (tag.indexOf('@') !== 0) {
      encodeSubscriptionTags(tag);
      this.channels.add(tag);
      this._listenTags.add(tag);
    }
    this.on(tag, handler);
    // Stored in channels: the CID-ready flow subscribes it, initially and after reconnect.
    // On a ready connection whose stored subscriptions went out, subscribe it now as well.
    if (tag.indexOf('@') !== 0 && this._subscribeNow()) sendSubscription(this, tag);
  }



  /**
   * Associates handlers with a local component for scoped teardown.
   * Direct tags (@ or @topic) only register local handlers. Other tags are remembered for
   * reconnection and subscribed at once on a ready connection; before that, when it becomes ready.
   * @param {string} to - The local component identifier, not a server target.
   * @param {string} tag - The exact event tag.
   * @param {Function} handler - The callback receiving (tag, ...args).
   * @throws {TypeError} If the arguments or subscription tags are invalid.
   */
  link(to, tag, handler) {
    if (typeof to !== 'string') throw TypeError('to(local link target) is not a string.')
    encodeTag(tag, false);
    if (typeof handler !== 'function') throw TypeError('handler is not a function.')
    const direct = tag.startsWith('@');
    if (!direct) encodeSubscriptionTags(tag);

    let tags = this._linkHandlers.get(to);
    if (!tags) this._linkHandlers.set(to, tags = new Map());
    let handlers = tags.get(tag);
    if (!handlers) tags.set(tag, handlers = new Set());
    // Each registration owns its wrapper, even if components share a callback.
    const linkedHandler = (...args) => handler.apply(this, args);
    handlers.add(linkedHandler);
    let linkSet = this.linkMap.get(to);
    if (!linkSet) this.linkMap.set(to, linkSet = new Set());
    linkSet.add(tag);
    this.on(tag, linkedHandler);
    if (!direct) {
      this.channels.add(tag);
      // Not before the connection is ready: the request would go out before authentication
      // (unencrypted) and again from subscribe_channels(), repeating retained values.
      if (this._subscribeNow()) sendSubscription(this, tag);
    }
  }

  /**
   * Removes only one local component's handlers for a tag. Direct tags never
   * send an unsubscribe. Shared subscriptions and explicit subscriptions remain.
   * @param {string} to - The local component identifier.
   * @param {string} tag - The exact linked tag.
   * @throws {TypeError} If the arguments are invalid.
   */
  unlink(to, tag) {
    if (typeof to !== 'string') throw TypeError('to(local link target) is not a string.')
    encodeTag(tag, false);
    const tags = this._linkHandlers.get(to);
    const handlers = tags?.get(tag);
    if (!handlers) return
    for (const handler of handlers) this.removeListener(tag, handler);
    tags.delete(tag);
    const linkSet = this.linkMap.get(to);
    linkSet.delete(tag);
    if (tags.size === 0) {
      this._linkHandlers.delete(to);
      this.linkMap.delete(to);
    }
    if (tag.startsWith('@')) return

    const linkedElsewhere = [...this._linkHandlers.values()].some(other => other.has(tag));
    if (!linkedElsewhere && !this._listenTags.has(tag)) this.channels.delete(tag);
    const remembered = new Set([...this.channels].flatMap(entry => entry.split(',')));
    const unused = tag.split(',').filter(part =>
      !remembered.has(part) && !this._manualSubscriptions.has(part));
    if (unused.length) this.unsubscribe(unused.join(','));
  }

  /**
   * Removes this local component's links without removing other listeners.
   * @param {string} to - The local component identifier.
   * @throws {TypeError} If the component identifier is not a string.
   */
  unlinkAll(to) {
    if (typeof to !== 'string') throw TypeError('to(local link target) is not a string.')
    const tags = this._linkHandlers.get(to);
    if (!tags) return
    for (const tag of [...tags.keys()]) this.unlink(to, tag);
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
      isAuthorized: this.boho?.isAuthorized ?? false,
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
   * 3. 두 상태값 갱신 후 change, 개별 이벤트 순서로 호출한다.
   *    콜백에서 다른 상태로 전이하면 이전 상태의 개별 이벤트는 생략한다.
   * @returns {boolean} Whether this transition is still current after callbacks.
   */
  stateChange(state, emitEventAndMessage) {
    // STATE constant name <string> upperCase
    // eventName and .stateName <string> lowerCase
    // .state <number>
    // console.log('### stateChange reason:', emitEventAndMessage )
    let eventName = state.toLowerCase();
    const nextState = STATE[state.toUpperCase()];
    if (typeof nextState !== 'number') throw new TypeError('Unknown state: ' + state);
    const changed = this.state !== nextState;
    this.state = nextState;
    this.stateName = eventName;
    if (changed) this._stateRevision++;
    const revision = this._stateRevision;
    if (changed) {
      this.emit('change', eventName);
    }
    if (revision !== this._stateRevision) return false;
    if (emitEventAndMessage) this.emit(eventName, emitEventAndMessage);
    return revision === this._stateRevision;
  }

}

// CongSocket framing without Node.js streams: pack() and the frame parser. The server's Remote
// uses CongParser directly; CongRx (CongPacket.js) wraps the same parser in a stream Transform.

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
    return $$1.pack(
      $$1.MB('#type', '8', CongType.TYPE_LEN1),
      $$1.MB('#payloadLen1', '8', payload.byteLength),
      $$1.MB('#payload', payload)
    )

  } else if (payload.byteLength < 65536) {  // 2bytes len
    return $$1.pack(
      $$1.MB('#type', '8', CongType.TYPE_LEN2),
      $$1.MB('#payloadLen2', '16L', payload.byteLength),
      $$1.MB('#payload', payload)
    )

  } else if (payload.byteLength < 2 ** 24) {  // 3bytes len
    let len4Buffer = Buffer.alloc(4);
    len4Buffer.writeUint32LE(payload.byteLength);
    let cropLen3 = len4Buffer.subarray(0, 3);
    return $$1.pack(
      $$1.MB('#type', '8', CongType.TYPE_LEN3),
      $$1.MB('#payloadLen3', cropLen3),
      $$1.MB('#payload', payload)
    )

  } else { //use 4 bytes.
    return $$1.pack(
      $$1.MB('#type', '8', CongType.TYPE_LEN4),
      $$1.MB('#payloadLen4', '32L', payload.byteLength),
      $$1.MB('#payload', payload)
    )
  }

}

/**
 * Adds a received chunk to a parser state and parses the complete frames into state.frames.
 * state: { buffer, frames, rxi, rxi_zero, maxFrameSize, skipBytes } (a CongParser or CongRx).
 * emit(event, value): 'wrong' (the unparsable buffer) or 'oversize' (payload size; the frame is
 * skipped without buffering). Shared by CongParser and CongRx so both parse alike.
 */
function addCongData(state, chunk, emit) {
  let c = chunk.byteLength;
  let i = 0;
  while (c--) {
    state.rxi++;
    if (chunk[i++] == 0) {
      state.rxi_zero++;
    }
  }

  if (state.skipBytes > 0) {
    if (chunk.byteLength <= state.skipBytes) {
      state.skipBytes -= chunk.byteLength;
      return;
    }
    chunk = chunk.subarray(state.skipBytes);
    state.skipBytes = 0;
  }

  if (state.buffer.byteLength > 0) {
    state.buffer = Buffer.concat([state.buffer, chunk]);
  } else {
    state.buffer = chunk;
  }
  parseCongFrames(state, emit);
}

function parseCongFrames(state, emit) {
  while (state.buffer.byteLength > 0) {
    const head = state.buffer[0];
    let headerLen;
    let payloadSize;

    if (head === CongType.TYPE_LEN1) {
      headerLen = 2;
      if (state.buffer.byteLength < headerLen) return;
      payloadSize = state.buffer.readUint8(1);
    } else if (head === CongType.TYPE_LEN2) {
      headerLen = 3;
      if (state.buffer.byteLength < headerLen) return;
      payloadSize = state.buffer.readUint16LE(1);
    } else if (head === CongType.TYPE_LEN3) {
      headerLen = 4;
      if (state.buffer.byteLength < headerLen) return;
      payloadSize = state.buffer.readUint16LE(1) + state.buffer.readUint8(3) * 65536;
    } else if (head === CongType.TYPE_LEN4) {
      headerLen = 5;
      if (state.buffer.byteLength < headerLen) return;
      payloadSize = state.buffer.readUint32LE(1);
    } else {
      emit('wrong', state.buffer);
      state.buffer = Buffer.alloc(0);
      return;
    }

    // Decide as soon as the length is known: the header can advertise up to 4 GiB.
    // Skipping keeps frame boundaries, so later frames still parse.
    if (payloadSize > state.maxFrameSize) {
      emit('oversize', payloadSize);
      const available = state.buffer.byteLength - headerLen;
      if (available < payloadSize) {
        state.skipBytes = payloadSize - available;
        state.buffer = Buffer.alloc(0);
        return;
      }
      state.buffer = state.buffer.subarray(headerLen + payloadSize);
      continue;
    }

    const frameSize = headerLen + payloadSize;
    if (state.buffer.byteLength < frameSize) return;

    state.frames.push(state.buffer.subarray(headerLen, frameSize));
    if (state.buffer.byteLength === frameSize) {
      state.buffer = Buffer.alloc(0);
      return;
    }
    // Consume each complete frame without growing the call stack.
    state.buffer = state.buffer.subarray(frameSize);
  }
}

/**
 * CongSocket frame parser without streams: write(chunk) calls onFrame(payload) for each complete
 * frame, onWrong(buffer) for an unparsable stream and onOversize(payloadSize) for a frame larger
 * than maxFrameSize (skipped without buffering).
 */
class CongParser {
  constructor({ maxFrameSize = Infinity, onFrame = null, onWrong = null, onOversize = null } = {}) {
    this.buffer = Buffer.alloc(0);
    this.frames = [];
    this.rxi = 0;
    this.rxi_zero = 0;
    this.maxFrameSize = maxFrameSize;
    this.skipBytes = 0; // remaining payload bytes of an oversized frame to discard
    this.onFrame = onFrame;
    this.onWrong = onWrong;
    this.onOversize = onOversize;
  }

  write(chunk) {
    addCongData(this, chunk, (event, value) => {
      if (event === 'wrong') this.onWrong?.(value);
      else this.onOversize?.(value);
    });
    const frames = this.frames;
    this.frames = [];
    for (const frame of frames) this.onFrame?.(frame);
  }

  /** Stops calling the handlers (the connection closed). */
  clear() {
    this.onFrame = this.onWrong = this.onOversize = null;
    this.buffer = Buffer.alloc(0);
    this.frames = [];
  }
}

class CongRx extends Transform {
  /**
   * @param {import('stream').TransformOptions & { maxFrameSize?: number }} [options] Stream options.
   *   maxFrameSize: largest payload to buffer (default unlimited). A larger frame is
   *   skipped without buffering and reported by an 'oversize' event (payloadSize).
   */
  constructor(options = {}) {
    const { maxFrameSize = Infinity, ...streamOptions } = options;
    super(streamOptions);
    this.buffer = Buffer.alloc(0);
    this.frames = [];
    this.rxi = 0;
    this.rxi_zero = 0;
    this.maxFrameSize = maxFrameSize;
    this.skipBytes = 0; // remaining payload bytes of an oversized frame to discard
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
    addCongData(this, chunk, (event, value) => this.emit(event, value));
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
      this.socket.on('error', () => {});
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
    // 'host:port', 'ip:port' or 'cong://host:port'. 'ip:port' alone is not a URL (a scheme cannot
    // start with a digit), and 'host:port' parses with 'host:' as its scheme.
    let urlObj;
    try {
      urlObj = new URL(url);
    } catch {
      urlObj = null;
    }
    if (urlObj?.protocol != "cong:") {
      urlObj = new URL('cong://' + url);
    }
    // URL keeps the brackets of an IPv6 literal ('[::1]'); net expects the bare address.
    const host = urlObj.hostname.replace(/^\[(.*)\]$/, '$1');
    const socket = this.socket = net.createConnection(urlObj.port, host);
    // Signals are small frames; send each immediately instead of waiting on Nagle.
    socket.setNoDelay(true);
    this._closed = false;

    this.socket.on('connect', () => {
      if (this.socket !== socket) return;
      this.congRx = new CongRx();
      this.socket.pipe(this.congRx);
      this.congRx.on('data', data => {
        if (this.socket === socket) this.onTCPSocketMessage(data);
      });
      this.emit('open');
    });

    this.socket.on('error', e => {
      if (this.socket !== socket) return;
      this.emit('error', e);
    });

    this.socket.on('close', () => {
      if (this.socket !== socket) return;
      this.emit('close');
    });
    this.stateChange('connecting','connecting');

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
	  CLOSE_TIMEOUT: 30000,
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
	   * @param {Boolean} [options.isServer=false] Create the instance in either
	   *     server or client mode
	   * @param {Number} [options.maxPayload=0] The maximum allowed message length
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
	   */
	  constructor(options) {
	    this._options = options || {};
	    this._threshold =
	      this._options.threshold !== undefined ? this._options.threshold : 1024;
	    this._maxPayload = this._options.maxPayload | 0;
	    this._isServer = !!this._options.isServer;
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
	          (typeof params.client_max_window_bits === 'number'
	            ? opts.clientMaxWindowBits > params.client_max_window_bits
	            : !params.client_max_window_bits))
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
	   * @param {Number} [options.maxBufferedChunks=0] The maximum number of
	   *     buffered data chunks
	   * @param {Number} [options.maxFragments=0] The maximum number of message
	   *     fragments
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
	    this._maxBufferedChunks = options.maxBufferedChunks | 0;
	    this._maxFragments = options.maxFragments | 0;
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
	    this._numFragments = 0;
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

	    if (
	      this._maxBufferedChunks > 0 &&
	      this._buffers.length >= this._maxBufferedChunks
	    ) {
	      cb(
	        this.createError(
	          RangeError,
	          'Too many buffered chunks',
	          false,
	          1008,
	          'WS_ERR_TOO_MANY_BUFFERED_PARTS'
	        )
	      );
	      return;
	    }

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

	    if (this._maxFragments > 0 && ++this._numFragments > this._maxFragments) {
	      const error = this.createError(
	        RangeError,
	        'Too many message fragments',
	        false,
	        1008,
	        'WS_ERR_TOO_MANY_BUFFERED_PARTS'
	      );

	      cb(error);
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
	    this._numFragments = 0;
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
	const {
	  types: { isUint8Array }
	} = require$$2;

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
	      } else if (isUint8Array(data)) {
	        buf.set(data, 2);
	      } else {
	        throw new TypeError('Second argument must be a string or a Uint8Array');
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
	const http$1 = http;
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
	  CLOSE_TIMEOUT,
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
	      this._closeTimeout = options.closeTimeout;
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
	   * @param {Number} [options.maxBufferedChunks=0] The maximum number of
	   *     buffered data chunks
	   * @param {Number} [options.maxFragments=0] The maximum number of message
	   *     fragments
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
	      maxBufferedChunks: options.maxBufferedChunks,
	      maxFragments: options.maxFragments,
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
	 * @param {Number} [options.closeTimeout=30000] Duration in milliseconds to wait
	 *     for the closing handshake to finish after `websocket.close()` is called
	 * @param {Function} [options.finishRequest] A function which can be used to
	 *     customize the headers of each http request before it is sent
	 * @param {Boolean} [options.followRedirects=false] Whether or not to follow
	 *     redirects
	 * @param {Function} [options.generateMask] The function used to generate the
	 *     masking key
	 * @param {Number} [options.handshakeTimeout] Timeout in milliseconds for the
	 *     handshake request
	 * @param {Number} [options.maxBufferedChunks=262144] The maximum number of
	 *     buffered data chunks
	 * @param {Number} [options.maxFragments=16384] The maximum number of message
	 *     fragments
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
	    closeTimeout: CLOSE_TIMEOUT,
	    protocolVersion: protocolVersions[1],
	    maxBufferedChunks: 256 * 1024,
	    maxFragments: 16 * 1024,
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
	  websocket._closeTimeout = opts.closeTimeout;

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
	    } catch {
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
	  const request = isSecure ? https.request : http$1.request;
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
	    perMessageDeflate = new PerMessageDeflate({
	      ...opts.perMessageDeflate,
	      isServer: false,
	      maxPayload: opts.maxPayload
	    });
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
	      maxBufferedChunks: opts.maxBufferedChunks,
	      maxFragments: opts.maxFragments,
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
	    websocket._closeTimeout
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

	  //
	  // The close frame might not have been received or the `'end'` event emitted,
	  // for example, if the socket was destroyed due to an error. Ensure that the
	  // `receiver` stream is closed after writing any remaining buffered data to
	  // it. If the readable side of the socket is in flowing mode then there is no
	  // buffered data as everything has been already written. If instead, the
	  // socket is paused, any possible buffered data will be read as a single
	  // chunk.
	  //
	  if (
	    !this._readableState.endEmitted &&
	    !websocket._closeFrameReceived &&
	    !websocket._receiver._writableState.errorEmitted &&
	    this._readableState.length !== 0
	  ) {
	    const chunk = this.read(this._readableState.length);

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

requireExtension();

requirePermessageDeflate();

requireReceiver();

requireSender();

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

requireSubprotocol();

var websocketExports = requireWebsocket();
var WebSocket = /*@__PURE__*/getDefaultExportFromCjs(websocketExports);

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^Duplex$", "caughtErrors": "none" }] */

var websocketServer;
var hasRequiredWebsocketServer;

function requireWebsocketServer () {
	if (hasRequiredWebsocketServer) return websocketServer;
	hasRequiredWebsocketServer = 1;

	const EventEmitter = require$$0$3;
	const http$1 = http;
	const { Duplex } = require$$0$2;
	const { createHash } = require$$1;

	const extension = requireExtension();
	const PerMessageDeflate = requirePermessageDeflate();
	const subprotocol = requireSubprotocol();
	const WebSocket = requireWebsocket();
	const { CLOSE_TIMEOUT, GUID, kWebSocket } = requireConstants();

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
	   * @param {Number} [options.closeTimeout=30000] Duration in milliseconds to
	   *     wait for the closing handshake to finish after `websocket.close()` is
	   *     called
	   * @param {Function} [options.handleProtocols] A hook to handle protocols
	   * @param {String} [options.host] The hostname where to bind the server
	   * @param {Number} [options.maxBufferedChunks=262144] The maximum number of
	   *     buffered data chunks
	   * @param {Number} [options.maxFragments=16384] The maximum number of message
	   *     fragments
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
	      maxBufferedChunks: 256 * 1024,
	      maxFragments: 16 * 1024,
	      maxPayload: 100 * 1024 * 1024,
	      skipUTF8Validation: false,
	      perMessageDeflate: false,
	      handleProtocols: null,
	      clientTracking: true,
	      closeTimeout: CLOSE_TIMEOUT,
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
	      this._server = http$1.createServer((req, res) => {
	        const body = http$1.STATUS_CODES[426];

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
	      const perMessageDeflate = new PerMessageDeflate({
	        ...this.options.perMessageDeflate,
	        isServer: true,
	        maxPayload: this.options.maxPayload
	      });

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
	      maxBufferedChunks: this.options.maxBufferedChunks,
	      maxFragments: this.options.maxFragments,
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
	  message = message || http$1.STATUS_CODES[code];
	  headers = {
	    Connection: 'close',
	    'Content-Type': 'text/html',
	    'Content-Length': Buffer.byteLength(message),
	    ...headers
	  };

	  socket.once('finish', socket.destroy);

	  socket.end(
	    `HTTP/1.1 ${code} ${http$1.STATUS_CODES[code]}\r\n` +
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
      // Closing a connecting ws can emit an asynchronous error after detachment.
      this.socket.on('error', () => {});
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
    const socket = this.socket = new WebSocket(url);
    this._closed = false;

    this.socket.onopen = () => {
      if (this.socket !== socket) return;
      socket.on('message', data => {
        if (this.socket === socket) this.onWebSocketMessage(data);
      });
      this.emit('open');
    };

    this.socket.onerror = (e) => {
      if (this.socket !== socket) return;
      this.emit('error', e);
    };

    this.socket.onclose = () => {
      if (this.socket !== socket) return;
      this.emit('close');
    };
    this.stateChange('connecting','connecting');
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
    }
  }

}

// Defaults, read when a Server is created; a Server never modifies them. Change one before
// creating servers to change the default for all of them, or pass the setting to new Server().

const serverOption = {

  // --- Per Server: each of these can be given to new Server({ ... }) ---

  heartbeatInterval: 50000, // ms between liveness checks
  heartbeatGrace: 5000,     // extra ms a peer has to answer before it is closed
  // Max bytes for a single WebSocket message and CongSocket frame. Bounds pre-auth memory use per
  // connection (ws defaults to 100 MiB); see Remote.rxFrameLimit().
  maxPayload: 32 * 1024 * 1024,
  // When to use X-Forwarded-For / X-Forwarded-Proto of a WebSocket request:
  // 'private' only if the connecting peer is a loopback/private address, e.g. a reverse proxy on
  // the same host or network; true always; false never; a number N trusts N proxy hops. The entry
  // appended by the last trusted proxy is used; earlier entries can be forged by the client.
  trustProxy: 'private',
  // A peer whose unsent data exceeds this many bytes (it stopped reading) is closed instead of
  // letting its send queue grow without limit.
  maxBufferedBytes: 64 * 1024 * 1024,
  // Only authenticated connections may send signals or subscribe; an anonymous one that tries
  // gets AUTH_CLEAR and is closed.
  membersOnly: false,
  // Connections per public address, checked when a socket is accepted (see AddressLimiter):
  // newPerAddressPerMin new connections, failedPerAddressPerMin connections that ended without a
  // CID (refused logins, Boho 2.x and broken clients) in windowMs, and maxPerAddress open at once.
  // Over a rate limit the address's new connections are closed at once until the window ends; open
  // ones are never touched. 0 turns a limit off. Loopback, private and exempt addresses are not
  // counted. A Server's connectionLimits option is merged over this (false: all off).
  // msgPerAddressPerSec, bytesPerAddressPerSec: what all the anonymous-quota connections of one address may
  // send together (token bucket, 1 s burst); over: dropped and told once (quota_exceeded). Without it the
  // per-connection quota multiplies by maxPerAddress (2026-11-28).
  connectionLimits: {
    newPerAddressPerMin: 300,
    failedPerAddressPerMin: 30,
    maxPerAddress: 1000,
    msgPerAddressPerSec: 1000,
    bytesPerAddressPerSec: 8 * 1024 * 1024,
    windowMs: 60000,
    exempt: []
  },
  // Observability. logMessages: log each received message (type and tag, never the payload).
  // logStats: print a one-line summary every N ms (0 = off).
  logMessages: false,
  logStats: 0,

  // Nested groups: a Server merges its own options over these.
  // Packet layouts remain unchanged.
  security: {
    maxClockSkewMs: 60000,
    authChallengeMaxAgeMs: 60000,
    maxReplayEntries: 65536,
    // true: a logged-in connection without TLS must send its signals, subscriptions and calls
    // encrypted (as clients do in ENC_MODE.AUTO); a plain one closes it (PLAINTEXT_AFTER_LOGIN).
    // Off by default: a client with encMode NO would be closed.
    requireEncryption: false
  },
  // Named quota profiles. A connection uses one: an anonymous connection the Server's
  // anonymousQuota, an authenticated one the profile its account resolves to (see BohoAuth
  // resolveQuota). null is unlimited. A Server merges its quotas option over these per profile
  // and may add profiles; a running server's profiles can be adjusted (server.quotas.basic.fanout = 50).
  //   maxMessageBytes: largest message the connection may send (larger: OVER_SIZE, dropped)
  //   fanout:          most subscribers one channel publish is delivered to
  //   msgPerSec, bytesPerSec: sustained receive rate (token bucket, 1 s burst); over: dropped
  //   maxConnections:  connections of one account (uid) at a time; over: the login fails
  //   maxSubscriptions: tags one connection may be subscribed to at a time; over: the tag is left out
  //   deliveriesPerSec: subscribers the connection's publishes reach per second in all (token bucket,
  //                    1 s burst; msgPerSec × fanout without it); over: a publish reaches fewer, like fanout
  quotas: {
    anonymous: { maxMessageBytes: 256 * 1024, fanout: 1000, msgPerSec: 100, bytesPerSec: 2 * 1024 * 1024, maxConnections: null, maxSubscriptions: 1000, deliveriesPerSec: 2000 },
    basic: { maxMessageBytes: 1024 * 1024, fanout: 1000, msgPerSec: 200, bytesPerSec: 4 * 1024 * 1024, maxConnections: 20, maxSubscriptions: 2000, deliveriesPerSec: 10000 },
    pro: { maxMessageBytes: 4 * 1024 * 1024, fanout: 10000, msgPerSec: 1000, bytesPerSec: 16 * 1024 * 1024, maxConnections: 200, maxSubscriptions: 10000, deliveriesPerSec: 50000 },
    unlimited: { maxMessageBytes: null, fanout: null, msgPerSec: null, bytesPerSec: null, maxConnections: null, maxSubscriptions: null, deliveriesPerSec: null }
  },
  anonymousQuota: 'anonymous', // profile of a connection that has not authenticated

  retain: {
    enabled: true,
    limitSize: 100000,      // a retained message must be smaller than this many bytes
    limitCounter: 1000,     // channel retain tags per server, and CID retain tags per connection
    // A channel retain belongs to its last writer: an authenticated account (CID, shared by its
    // connections) or a live anonymous connection. Each owner holds at most tagsPerOwner tags and
    // bytesPerOwner bytes. An account's values stay until restart; a closed anonymous connection's
    // move to its network's grace pool (same budget) and are removed after anonymousGraceMs.
    tagsPerOwner: 32,
    bytesPerOwner: 1024 * 1024,
    anonymousGraceMs: 60 * 60 * 1000,
    // CID retains of one connection (removed with it), and all retained messages of the server.
    // A value over budget is not stored, and removes the value it would have replaced.
    bytesPerConnection: 1024 * 1024,
    bytesTotal: 256 * 1024 * 1024
  },

  // --- Process-wide: read directly where used, not per Server ---

  // File logs, off by default. Each file is rotated at maxBytes into path.1 … path.<keep>
  // (maxBytes 0: never). A write error is reported once and never stops the server.
  // connection, attack: text lines with an ISO time. auth: JSON Lines (one object per line), see
  // BohoAuth; level 'normal' writes logins, failed logins of known IDs, address blocks and the
  // failure summaries; 'all' also every failed attempt (unknown IDs, blocked addresses, bad packets).
  // A BohoAuth's fileLog option overrides auth for that instance.
  fileLogger: {
    connection: {
      use: false,
      path: 'connection.log',
      maxBytes: 10 * 1024 * 1024,
      keep: 5
    },
    auth: {
      use: false,
      path: 'auth.log',
      level: 'normal',
      maxBytes: 10 * 1024 * 1024,
      keep: 5
    },
    attack: {
      use: false,
      path: 'attack.log',
      maxBytes: 10 * 1024 * 1024,
      keep: 5
    }
  },

  auth: {
    failDelay: 600, // ms before AUTH_FAIL is sent
    // A refused connection has no CID: it is closed this long after AUTH_FAIL unless it logs in or
    // goes on anonymously (CID_REQ) meanwhile, so the client reconnects and tries again on its own
    // schedule instead of staying online unseen. 0 keeps it open.
    failCloseMs: 30000,
    // Wrong logins: a connection is closed after maxFailuresPerConnection; a public address with
    // maxFailuresPerAddress in failureWindowMs gets its next logins closed unchecked until the window
    // has passed (closed, not AUTH_FAIL, so a device with the right key there connects again).
    // Loopback and private addresses are not counted (a proxy, a LAN, tests).
    maxFailuresPerConnection: 5,
    maxFailuresPerAddress: 30,
    failureWindowMs: 60000,
    // Failed logins are counted by kind, address and login ID, and reported as one summary per
    // window (console line, or BohoAuth's onAuthSummary option). Nothing is written while no login
    // fails. 0 turns the summary off.
    summaryMs: 10 * 60 * 1000,
    // Default for BohoAuth, when the same authenticated CID is already online:
    // 'keepNew' replaces the old connection, 'keepOld' rejects the new login.
    // Override per BohoAuth with its duplicateLogin option, and per Server with options.duplicateLogin
    // (which wins, and applies only to that Server's connections).
    duplicateLogin: 'keepNew'
  },

  // Development aids.
  debug: {
    slow: false,    // delay handling of every received message by `delay` ms
    delay: 500,
    showAuthInfo: false // log auth results and state traces (never keys)
  }
};

const decoder$3 = new TextDecoder();

// With security.requireEncryption, what a logged-in connection without TLS may not send in plain.
// PING, PONG, CID_REQ, ECHO and CLOSE carry nothing and stay plain, as clients send them.
// Boho 2.x (SHA-256 based) login request code, before Boho 3 (Ascon). Answered with AUTH_FAIL.
const CLASSIC_AUTH_REQ = 0xB1;

const PLAINTEXT_REFUSED = new Set([IOMsg.SIGNAL, IOMsg.SIGNAL_E2E, IOMsg.SUBSCRIBE, IOMsg.SUBSCRIBE_REQ,
  IOMsg.UNSUBSCRIBE, IOMsg.CALL, IOMsg.IAM]);

$$1.NB;
const MB = $$1.MB;

// A one-byte CLOSE reason is a code, not text (Arduino IOSignal::close(uint8_t)): the message
// that made the client close, or its CongPacket reader error state (ReadingState >= 250).
// Its own table, because IOMsg gives 253 another meaning (TIME_OUT).
const CLOSE_REASON = {
  [IOMsg.AUTH_CLEAR]: 'AUTH_CLEAR',
  [IOMsg.SERVER_REDIRECT]: 'SERVER_REDIRECT',
  253: 'CONG_UNKNOWN_TYPE',
  254: 'CONG_OVER_SIZE',
  255: 'CONG_OVER_FLOW'
};

// Readable reason of a CLOSE message, e.g. 'AUTH_CLEAR(0xc4)'; longer reasons are text.
function closeReason(message) {
  if (message.byteLength < 2) return 'none'
  if (message.byteLength === 2) {
    const code = '0x' + message[1].toString(16).padStart(2, '0');
    return CLOSE_REASON[message[1]] ? `${CLOSE_REASON[message[1]]}(${code})` : code
  }
  return decoder$3.decode(message.subarray(1))
}


// What retain_signal returns for a connection that has no CID retains yet: one shared, read-only
// empty Map instead of an empty Map per connection (about 185 bytes each, most never used).
class EmptyMap extends Map {
  set() { throw new TypeError('read-only empty map: use RemoteCore.writableRetainSignal()') }
}
const NO_RETAINS = new EmptyMap();

class RemoteCore {
  constructor(socket, manager) {

    this.socket = socket;
    socket.isAlive = true;
    socket.txCounter = 0;
    socket.rxCounter = 0;
    socket.openTime = Date.now();

    this.boho = new mt();
    this.security = manager.server.security;
    this._challengeIssuedAt = null;
    this._challengeUsed = false;
    this.authFailures = 0; // failed logins on this connection (BohoAuth)
    this._replayBuckets = null; // Map second → Set of seen (ms, counter); made on the first encrypted packet
    this._replayEntries = 0;
    this._replayExpiredBefore = 0;
    this.securityFailure = null;
    this.closeReason = null; // reason of the client's CLOSE message, see closeReason()
    this.encMode = ENC_MODE.AUTO;
    this.channels = new Set();  //  subscribed tags
    this._retainSignal = null; // CID retains (tag → message), made on the first one; read with retain_signal
    this.retainBytes = 0; // bytes of its CID retains (retain_signal)

    this.ssid = RemoteCore.ssid++;  // ordered index number
    this.manager = manager;

    this.cid = ''; // Client Id
    this.did = ''; // Device Id
    this.uid = ''; // User Id
    this.nick = '';
    this.site = ''; // the Origin host of a browser connection, set by Remote

    this.privateNode = false;
    this.HOME_CHANNEL = '';
    this.role = 'anonymous'; // set on authentication; see ROLES in BohoAuth
    this.accountUid = null;  // counted in manager.accountConnections while authenticated with a uid
    this.ownerUid = null;    // the device's owner (login uid); a web sign-in later changes uid, not this
    this.rxPolicy = null;    // compiled delivery policy of an owned device, see deliveryPolicy.js
    // Quota profile (a server.quotas entry, read live): the anonymous one until authenticated.
    this.quotaName = manager.anonymousQuota;
    this.quota = manager.quotas[this.quotaName];
    this._rateAt = null; // token buckets of quota msgPerSec / bytesPerSec
    this._msgTokens = 0;
    this._byteTokens = 0;
    // Largest message the peer can receive, if it said so in CID_REQ (e.g. an Arduino RX buffer);
    // larger messages are skipped instead of sent. null: no limit beyond maxPayload.
    this.peerRxLimit = null;
    this.peerRxLimitSkipped = 0;

    this.state;
    this.stateLog = null; // state history, kept only with serverOption.debug.showAuthInfo
    this.setState(STATE.OPEN);

  }

  static ssid = 1;

  /** CID retains (tag → message) for reading; an empty read-only Map while there are none. */
  get retain_signal() {
    return this._retainSignal ?? NO_RETAINS;
  }

  /** CID retains for storing one: made on first use. */
  writableRetainSignal() {
    return this._retainSignal ??= new Map();
  }

  /** Authenticated with role 'admin'. */
  get isAdmin() {
    return this.role === 'admin' && this.boho.isAuthorized === true;
  }

  setState(state) {
    const previous = this.state;
    this.state = state;
    if (previous !== state) this.manager.server?.emit('remote:state', this, previous);
    if (serverOption.debug.showAuthInfo) {
      (this.stateLog ??= []).push(  state + ":" + STATE[ state]   );
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


  // logMessages: one line per received message after decryption: type, routing tag or RPC
  // target, and size. Payloads are never printed; heartbeat PING/PONG are skipped.
  logMessage(msgType, message, encrypted = false) {
    if (msgType === IOMsg.PING || msgType === IOMsg.PONG) return
    let detail = '';
    try {
      if ([IOMsg.SIGNAL, IOMsg.SIGNAL_E2E, IOMsg.SUBSCRIBE, IOMsg.UNSUBSCRIBE].includes(msgType)) {
        detail = decoder$3.decode(message.subarray(2, 2 + message[1]));
      } else if (msgType === IOMsg.SUBSCRIBE_REQ && message.byteLength >= 5) {
        detail = decoder$3.decode(message.subarray(5, 5 + message.readUInt16BE(3)));
      } else if (msgType === IOMsg.CALL) {
        const req = $$1.unpack(message);
        if (req) detail = `${req.target}.${req.topic}`;
      }
    } catch { /* a malformed message is logged without detail */ }
    const type = msgType === undefined ? 'TEXT'
      : IOMsg[msgType] ?? mt.BohoMsg[msgType] ?? '0x' + msgType.toString(16);
    const transport = this.socketType === 'websocket' ? 'WS' : 'CS';
    console.log(`[rx] #${this.ssid} ${this.cid || '-'} ${transport} ${type}${encrypted ? '(enc)' : ''}` +
      `${detail ? ' ' + detail : ''} ${message.byteLength}B`);
  }

  // Switches to a server.quotas profile; tell: send it to the client (QUOTA: its maxMessageBytes).
  setQuota(name, tell) {
    this.quotaName = name;
    this.quota = this.manager.quotas[name];
    this._quotaNoticed = null; // a new profile: its limits may be told once again (noticeQuota)
    // The CongSocket frame ceiling follows maxMessageBytes.
    this.refreshRxFrameLimit?.();
    if (tell) {
      const packet = Buffer.alloc(5);
      packet[0] = IOMsg.QUOTA;
      packet.writeUInt32LE(this.quota.maxMessageBytes ?? 0, 1); // 0: unlimited
      this.send(packet);
    }
  }

  // Quota msgPerSec / bytesPerSec: token buckets holding one second. A message larger than the
  // byte bucket passes when the bucket is full and leaves a debt.
  takeRateTokens(bytes) {
    const { msgPerSec, bytesPerSec } = this.quota;
    if (msgPerSec === null && bytesPerSec === null) return true;
    const now = performance$1.now();
    if (this._rateAt === null) {
      this._msgTokens = msgPerSec ?? 0;
      this._byteTokens = bytesPerSec ?? 0;
    } else {
      const seconds = (now - this._rateAt) / 1000;
      if (msgPerSec !== null) this._msgTokens = Math.min(msgPerSec, this._msgTokens + seconds * msgPerSec);
      if (bytesPerSec !== null) this._byteTokens = Math.min(bytesPerSec, this._byteTokens + seconds * bytesPerSec);
    }
    this._rateAt = now;
    if (msgPerSec !== null && this._msgTokens < 1) { this.rateLimitedBy = 'msgPerSec'; return false; }
    if (bytesPerSec !== null && this._byteTokens < Math.min(bytes, bytesPerSec)) { this.rateLimitedBy = 'bytesPerSec'; return false; }
    if (msgPerSec !== null) this._msgTokens -= 1;
    if (bytesPerSec !== null) this._byteTokens -= bytes;
    return true;
  }

  rxQuotaChecker(message) {
    let rxBytes = message.byteLength;
    this.manager.counters.rxBytes += rxBytes;
    this.manager.counters.rxMessages++;

    const maxMessageBytes = this.quota.maxMessageBytes;
    if (maxMessageBytes !== null && rxBytes > maxMessageBytes) {
      this.manager.counters.oversizeRejected++;
      this.send(Buffer.from([IOMsg.OVER_SIZE]));
      return false;
    }
    if (!this.takeRateTokens(rxBytes)) {
      this.manager.counters.rateLimited++;
      this.noticeQuota(this.rateLimitedBy, this.quota[this.rateLimitedBy]);
      return false;
    }
    // All the anonymous connections of one address together (connectionLimits msg/bytesPerAddressPerSec).
    const limitIp = this.socket?._limitIp;
    if (limitIp !== undefined && this.quotaName === this.manager.anonymousQuota) {
      const over = this.manager.addressLimiter?.takeRate(limitIp, rxBytes);
      if (over) {
        this.manager.counters.addressRateLimited++;
        this.noticeQuota(over, this.manager.server?.connectionLimits?.[over] ?? null);
        return false;
      }
    }
    return true;
  }

  /**
   * Subscribers this connection's publish may reach now (quota deliveriesPerSec: a token bucket holding
   * one second), at most wanted; the tokens are taken. Unlimited: wanted.
   */
  takeDeliveries(wanted) {
    const perSec = this.quota?.deliveriesPerSec ?? null;
    if (perSec === null || wanted <= 0) return wanted;
    const now = performance$1.now();
    if (this._deliveryAt === undefined) this._deliveryTokens = perSec;
    else this._deliveryTokens = Math.min(perSec, this._deliveryTokens + (now - this._deliveryAt) / 1000 * perSec);
    this._deliveryAt = now;
    const allowed = Math.max(0, Math.min(wanted, Math.floor(this._deliveryTokens)));
    this._deliveryTokens -= allowed;
    return allowed;
  }

  /**
   * Tells this connection, once per kind, that a quota left something out: a SERVER_SIGNAL
   * { event: 'quota_exceeded', data: { kind, limit, quota } } (the JS client emits 'quota_exceeded').
   * Nothing is held back or retried: what went over is still dropped, as before. Only to WebSocket
   * connections (web apps); TCP devices (Arduino) do not read it and have small receive buffers.
   * kind: 'msgPerSec' | 'bytesPerSec' | 'maxSubscriptions' | 'fanout' | 'deliveriesPerSec' |
   * 'msgPerAddressPerSec' | 'bytesPerAddressPerSec' (all anonymous connections of the address together).
   */
  noticeQuota(kind, limit) {
    if (this.socketType !== 'websocket' || !kind) return;
    this._quotaNoticed ??= new Set();
    if (this._quotaNoticed.has(kind)) return;
    this._quotaNoticed.add(kind);
    this.manager.counters.quotaNotices++;
    this.send_enc_mode($$1.pack(
      $$1.MB('#MsgType', '8', IOMsg.SERVER_SIGNAL),
      $$1.MB('#signalObject', { event: 'quota_exceeded', data: { kind, limit: limit ?? null, quota: this.quotaName ?? null } })
    ));
  }

  issueAuthChallenge() {
    const packet = this.boho.server_time_nonce(); // kept by this.boho for verify_auth_req
    this._challengeIssuedAt = performance$1.now();
    return packet;
  }

  securityMismatch(reason) {
    if (this._closing || this.state === STATE.CLOSED) return false;
    this.securityFailure = reason;
    this.boho.clearAuth();
    this.role = 'anonymous';
    this._replayBuckets = null;
    this._replayEntries = 0;
    this.close(true);
    this.manager.attackLogger?.log(`SECURITY #${this.ssid} reason:${reason}`);
    this.manager.server.emit('security:mismatch', this, reason);
    return false;
  }

  checkAuthChallenge() {
    if (this._closing || this.state === STATE.CLOSED) return false;
    if (this._challengeUsed) return this.securityMismatch('AUTH_CHALLENGE_REUSED');
    if (this._challengeIssuedAt === null ||
        performance$1.now() - this._challengeIssuedAt > this.security.authChallengeMaxAgeMs) {
      return this.securityMismatch('AUTH_CHALLENGE_EXPIRED');
    }
    return true;
  }

  // Called only after Boho has authenticated the packet's clock and payload.
  acceptEncryptedClock(message, receivedAtMs) {
    const seconds = message.readUInt32LE(5);
    const milliseconds = message.readUInt16LE(9);
    const counter = message.readUInt16LE(11);
    const packetTime = seconds * 1000 + milliseconds;
    const earliest = receivedAtMs - this.security.maxClockSkewMs;
    if (milliseconds >= 1000 || Math.abs(receivedAtMs - packetTime) > this.security.maxClockSkewMs ||
        packetTime < this._replayExpiredBefore) {
      return this.securityMismatch('TIME_MISMATCH');
    }
    // Never reopen an expired timestamp range after the server clock moves back.
    this._replayExpiredBefore = Math.max(this._replayExpiredBefore, earliest);
    const buckets = this._replayBuckets ??= new Map();
    for (const [second, values] of buckets) {
      if ((second + 1) * 1000 <= this._replayExpiredBefore) {
        this._replayEntries -= values.size;
        buckets.delete(second);
      }
    }
    let bucket = buckets.get(seconds);
    const value = milliseconds * 65536 + counter;
    if (bucket?.has(value)) return this.securityMismatch('REPLAY_DETECTED');
    // Fail closed instead of evicting still-valid replay evidence under load.
    if (this._replayEntries >= this.security.maxReplayEntries) {
      return this.securityMismatch('REPLAY_CAPACITY_EXCEEDED');
    }
    if (!bucket) buckets.set(seconds, bucket = new Set());
    bucket.add(value);
    this._replayEntries++;
    return true;
  }

  decryptSessionPacket(message, receivedAtMs) {
    let decoded;
    try {
      decoded = this.boho.decrypt_session(message);
    } catch {
      this.securityMismatch('INVALID_ENCRYPTED_PACKET');
      return;
    }
    if (!decoded) {
      this.securityMismatch('INVALID_ENCRYPTED_PACKET');
      return;
    }
    if (this.acceptEncryptedClock(message, receivedAtMs)) return decoded;
  }

  onTimeDelayMessage(message, isBinary = true) {
    const receivedAtMs = Date.now();
    setTimeout(() => {
      this.onSocketMessage(message, isBinary, receivedAtMs);
    }
      , serverOption.debug.delay);
  }

  // CongSocket or WebSocket
  onSocketMessage(message, isBinary = true, receivedAtMs = Date.now()) {

    if (this._closing || this.state === STATE.CLOSED) return;

    this.receiveMonitor(); // rx-data, ping/pong and timeout check
    if (!this.rxQuotaChecker(message)) return

    const logMessages = this.manager.server?.logMessages;
    let msgType, decoded, encrypted = false;

    if (isBinary) {
      msgType = message[0];

      if (msgType === mt.BohoMsg.ENC) {

        decoded = this.decryptSessionPacket(message, receivedAtMs);

        if (decoded) {
          msgType = decoded[0];
          message = decoded;
          encrypted = true;
        } else {
          return
        }

      } else if (msgType === mt.BohoMsg.ENC_E2E) { // symetric E2EE Signal
        decoded = this.decryptSessionPacket(message, receivedAtMs);
        // console.log('e2e unpack:', decoded )
        if (decoded) {
          msgType = decoded[0];
          message.set(decoded, mt.MetaSize.ENC); // set decoded signal_e2e headaer.
          message = message.subarray(mt.MetaSize.ENC); // reset offset.
          encrypted = true;
        } else {
          return
        }

      } else ;
      if (!encrypted && this.security.requireEncryption && this.boho.isAuthorized && !this.TLS &&
          PLAINTEXT_REFUSED.has(msgType)) {
        this.securityMismatch('PLAINTEXT_AFTER_LOGIN');
        return;
      }
      if (logMessages) this.logMessage(msgType, message, encrypted);

      switch (msgType) {
        case IOMsg.PING:
          // Reply in the IOSignal protocol; browser JS cannot observe WS control PONG.
          this.send(Buffer.from([IOMsg.PONG]));
          break;

        case IOMsg.PONG:
          break;

        case IOMsg.CID_REQ:
          if (![STATE.SERVER_READY, STATE.AUTH_RES, STATE.AUTH_FAIL, STATE.CID_RES].includes(this.state)) {
            // Protocol violation: CID_REQ was sent before receiving the SERVER_READY signal.
            console.log('CID_REQ before SERVER_READY');
            this.close();
            return;
          }

          // Optional uint32 little endian after the type: the peer's RX buffer size. Set before
          // anything else is sent, so CID_RES, retained messages and signals respect it.
          if (message.byteLength >= 5) {
            const size = (message[1] | message[2] << 8 | message[3] << 16) + message[4] * 0x1000000;
            if (size > 0) this.peerRxLimit = size;
          }

          if (!this.cid) {
            const cid = this.manager.issueAnonymousCid();
            if (!cid) {
              console.log('anonymous CID space exhausted');
              this.close();
              return;
            }
            this.cid = cid;
            this.manager.cid2remote.set(this.cid, this);
            // The client limits its own sends to its quota (an authenticated one is sent on AUTH).
            this.setQuota(this.quotaName, true);
          }

          // console.log('<< SENDING CID_RES:', this.cid)
          this.send_enc_mode($$1.pack(
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
              const rejected = this.subscriptionsRejected ?? 0;
              if (this.manager.subscribe(tagList, this) === false) return
              // 255: some tags were over the quota's maxSubscriptions and were not subscribed.
              this.response(msgID, (this.subscriptionsRejected ?? 0) > rejected ? 255 : 0);
            } else {
              this.response(msgID, 255);
            }
          }
          break;


        case IOMsg.CALL: //service request
          try {
            let req = $$1.unpack(message);
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
          // The reason is only logged, so a CLOSE without one still closes.
          this.closeReason = closeReason(message);
          console.log(`>> CLOSE #${this.ssid} cid:${this.cid} reason: ${this.closeReason}`);
          this.close();
          break;


        // A Boho 2.x client: told AUTH_FAIL instead of being left waiting.
        case CLASSIC_AUTH_REQ:
          if (typeof this.manager.authManager?.refuseClassic === 'function') this.manager.authManager.refuseClassic(this);
          else this.send(Buffer.from([mt.BohoMsg.AUTH_FAIL]));
          return

        // client's auth requst
        case mt.BohoMsg.AUTH_REQ:
          // No login on this server: say so, or the client would wait in auth_req forever.
          if (!this.manager.authManager) {
            this.send(Buffer.from([mt.BohoMsg.AUTH_FAIL]));
            return
          }
          // A second request while verification is pending must not restart auth.
          if (this.state === STATE.AUTH_REQ) {
            this.securityMismatch('AUTH_IN_PROGRESS');
            return;
          }
          if (![STATE.SERVER_READY, STATE.AUTH_RES, STATE.AUTH_FAIL, STATE.CID_RES].includes(this.state)) {
            console.log('protocol error. must called auth_req after server_ready');
            this.close();
            return;
          }
          if (!this.checkAuthChallenge()) return;
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
      if (logMessages) this.logMessage(undefined, message);
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
      this.send_enc_mode($$1.pack(
        MB('#type', '8', IOMsg.RESPONSE_MBP),
        MB('status', '8', statusCode),
        MB('mid', '16', msgId),
        MB('body', body)
      ));
    } else {
      this.send_enc_mode($$1.pack(
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

      let encHeader = this.boho.encrypt_session(data.subarray(0, 3 + tagLen), mt.BohoMsg.ENC_E2E);
      let newEncBuffer = Buffer.concat([encHeader, data.subarray(3 + tagLen)]);
      this.send(newEncBuffer);

    } else if (useEncryption) {
      let encPack = this.boho.encrypt_session(data);
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
        "role": this.role,
        "quota": this.quotaName,
        "nick": this.nick,
        "ip": this.ip
        , 'tag': channels
      };
    }

    // console.log( 'iam res info', info )
    let pack = $$1.pack(
      MB('#MsgType', '8', IOMsg.IAM_RES),
      MB('#info', info)
    );
    this.send_enc_mode(pack);
  }


}

function isPrivateIPv4(ip) {
  const [a, b] = ip.split('.').map(Number);
  return a === 0 || a === 127 || a === 10 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168)
}

// IPv6 is not supported (connections from IPv6 addresses are refused, see Remote.isSupportedIP):
// only IPv4 addresses are private. '::1' and IPv4-mapped '::ffff:a.b.c.d' are read as IPv4.
// Unspecified, loopback and RFC 1918.
function isPrivateIP(ip) {
  if (typeof ip !== 'string') return false
  if (ip === '::1') return true
  if (ip.startsWith('::ffff:')) ip = ip.slice(7);
  return isIPv4(ip) && isPrivateIPv4(ip)
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


// A login ID travels as 8 bytes (Boho id8): a longer one would be cut and could never match, or
// match another entry. Key providers refuse it when it is added.
function checkLoginId(id) {
  if (typeof id !== 'string' || !id || new TextEncoder().encode(id).byteLength > 8) {
    throw new RangeError(`login ID must be 1-8 bytes: ${typeof id === 'string' ? id : typeof id}`)
  }
  return id
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const decoder$2 = new TextDecoder();

// Each proxy appends to a forwarding header, so the entry `hops` from the right was
// written by the outermost trusted proxy; anything left of it came from the client.
function forwardedValue(header, hops) {
  if (!hops || typeof header !== 'string') return undefined
  const values = header.split(',').map(v => v.trim()).filter(Boolean);
  return values[Math.max(0, values.length - hops)]
}

// IPv4-mapped addresses as IPv4, '::1' as 127.0.0.1; undefined if not an IP address.
function normalizeIP(ip) {
  if (typeof ip !== 'string') return undefined
  if (ip.startsWith('::ffff:') && isIPv4$1(ip.slice(7))) ip = ip.slice(7);
  if (ip === '::1') ip = '127.0.0.1';
  return isIP(ip) ? ip : undefined
}

// IOSignal does not support IPv6. A client address (after normalizeIP) must be IPv4; servers refuse
// any other connection before it gets a CID. Loopback '::1' and IPv4-mapped addresses are IPv4 here.
function isSupportedIP(ip) {
  return isIPv4$1(ip)
}

// Number of reverse proxies whose forwarding headers are trusted (see serverOption.trustProxy).
function trustedProxyHops(peerIP, trust = serverOption.trustProxy) {
  if (trust === 'private') return peerIP && isPrivateIP(peerIP) ? 1 : 0
  if (trust === true) return 1
  return Number.isSafeInteger(trust) && trust > 0 ? trust : 0
}

// Client address and TLS of a WebSocket upgrade request; exported for other servers that
// accept the same proxied connections.
function getClientAddress(req, trust = serverOption.trustProxy) {
  const peerIP = normalizeIP(req.socket?.remoteAddress);
  const hops = trustedProxyHops(peerIP, trust);
  return {
    ip: normalizeIP(forwardedValue(req.headers['x-forwarded-for'], hops)) ?? peerIP ?? '0.0.0.0',
    // X-Forwarded-Proto: https turns off server-side encryption (ENC_MODE.AUTO), so it is
    // only honored from a trusted proxy, like the client address.
    TLS: forwardedValue(req.headers['x-forwarded-proto'], hops) === 'https'
  }
}

// The site a browser connection came from: the host name of its Origin header ('bayo.tv'),
// without scheme or port. '' when there is none (Node.js, apps, TCP) or it is 'null' (a file
// page). A non-browser client can send any Origin, so this is for display only.
function originHost(req) {
  const origin = req?.headers?.origin;
  if (typeof origin !== 'string' || !origin || origin === 'null' || origin.length > 512) return ''
  try {
    return new URL(origin).hostname.toLowerCase().replace(/^\[|\]$/g, '').slice(0, 253)
  } catch {
    return ''
  }
}

class Remote extends RemoteCore {
  constructor(socket, req, manager) {
    super(socket, manager);
    this.txQueuePeakBytes = 0;
    this.txWriteFalseCount = 0;
    this.txBlockedSince = null;
    this.txDrainMaxMs = 0;
    this.socketType = socket.socketType;

    if (this.socketType === 'websocket') {
      const { ip, TLS } = getClientAddress(req, this.manager.server?.trustProxy);
      this.ip = ip;
      this.TLS = TLS;
      this.site = originHost(req);
    } else {
      this.TLS = false;
      this.ip = normalizeIP(socket.remoteAddress) ?? '0.0.0.0';
    }


    // Only IPv4 reaches here: the servers refuse other addresses (isSupportedIP).
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
      socket.on('drain', () => {
        if (this.txBlockedSince === null) return;
        this.txDrainMaxMs = Math.max(this.txDrainMaxMs, performance$1.now() - this.txBlockedSince);
        this.txBlockedSince = null;
      });
      // tcpSocket -> congRx (frame parser, no stream) -> onSocketMessage
      this.congRx = new CongParser({
        maxFrameSize: this.rxFrameLimit(),
        onFrame: (serverOption.debug.slow ? this.onTimeDelayMessage : this.onSocketMessage).bind(this),
        onWrong: this.onWrongCongPacketMessage.bind(this),
        onOversize: this.onOversizeCongPacket.bind(this)
      });
      socket.on('data', data => { this.congRx.write(data); });

      socket.on('error', e => { console.log('TCP Socket error', e); });
      socket.on('close', e => {
        // Clean up listeners on both the socket and the parser
        socket.removeAllListeners();
        this.congRx.clear();
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


  // Largest CongSocket frame the parser buffers: maxPayload (as for WebSocket), or the quota's
  // maxMessageBytes when smaller. A frame payload is the message rxQuotaChecker measures, so a
  // larger frame would be rejected after buffering anyway.
  rxFrameLimit() {
    const maxPayload = this.manager.server?.maxPayload ?? serverOption.maxPayload;
    const maxMessageBytes = this.quota?.maxMessageBytes ?? null;
    return maxMessageBytes === null ? maxPayload : Math.min(maxPayload, maxMessageBytes);
  }

  // Called after the quota changes (e.g. on successful auth).
  refreshRxFrameLimit() {
    if (this.congRx) this.congRx.maxFrameSize = this.rxFrameLimit();
  }

  // The frame was skipped unbuffered; same response as rxQuotaChecker, except that a
  // connection without a CID is treated like a wrong packet (see onWrongCongPacketMessage).
  onOversizeCongPacket(payloadSize) {
    if (this._closing) return;
    if (!this.cid) {
      this.manager.attackLogger?.log(`> ${this.ssid} ${this.ip} OVERSIZE ${payloadSize}`);
      this.close(true);
      return;
    }
    this.manager.counters.oversizeRejected++;
    this.send(Buffer.from([IOMsg.OVER_SIZE]));
  }

  // any type of received messages:  message, ping, pong
  receiveMonitor() {
    this.socket.rxCounter++;
    if (this.socket.isAlive === false) this.manager.heartbeatPending.delete(this);
    this.socket.isAlive = true;
  }

  // Number of reverse proxies whose forwarding headers this server trusts.
  trustedProxyHops(peerIP) {
    return trustedProxyHops(peerIP, this.manager.server?.trustProxy)
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
    let txb = this.socket.bytesWritten || this.socket._socket?.bytesWritten;
    let rxb = this.socket.bytesRead || this.socket._socket?.bytesRead;
    let tx = this.socket.txCounter;
    let rx = this.socket.rxCounter;
    return { tx, txb, rx, rxb }
  }

  close(terminateNow = false) {
    this._closing = true;
    if (this.socketType === 'websocket') {
      if (terminateNow) this.socket.terminate();
      else this.socket.close();
    } else {
      if (terminateNow) this.socket.destroy();
      else this.socket.end();
    }
  }

  // A peer that stops reading would otherwise grow its send queue without limit.
  recordTxQueue() {
    const queued = this.socket.bufferedAmount ?? this.socket.writableLength ?? 0;
    if (queued > this.txQueuePeakBytes) this.txQueuePeakBytes = queued;
    const limit = this.manager.server?.maxBufferedBytes ?? serverOption.maxBufferedBytes;
    if (queued > limit) {
      console.log(`slow peer #${this.ssid} cid:${this.cid} has ${queued} unsent bytes: closing`);
      this.close(true);
    }
  }

  // node.js server side remote.
  send(message, isBinary) {
    // Sending to a closing peer can only fail; skip instead of logging each attempt.
    if (this._closing) return;
    // The peer cannot receive it (see peerRxLimit); a CongSocket Arduino would have to discard it.
    if (this.peerRxLimit !== null && message.byteLength > this.peerRxLimit) {
      this.peerRxLimitSkipped++;
      this.manager.counters.peerRxLimitSkipped++;
      return;
    }
    // console.log(`<-S [${IOMsg[ message[0]]}]`)
    this.manager.counters.txBytes += message.byteLength;
    this.manager.counters.txMessages++;
    this.socket.txCounter++;
    if (this.socketType === 'websocket') {
      if (this.socket.readyState === 1) {
        if (isBinary != undefined) {
          this.socket.send(message, { binary: isBinary });
        } else {
          this.socket.send(message);
        }
        this.recordTxQueue();
      } else {
        console.log('server(ws)Remote.send() called. not open state. current readyState:', this.socket.readyState );
        this.close(true);
      }
      
    } else { //CongSocket
      if (this.socket.readyState == 'open') {
        const writable = this.socket.write(pack(message));
        this.recordTxQueue();
        if (!writable) {
          this.txWriteFalseCount++;
          if (this.txBlockedSince === null) this.txBlockedSince = performance$1.now();
        }
      } else {
        console.log('server(cong)Remote.send() called. not open state. current readyState:', this.socket.readyState );
        this.close(true);
      }
    }

  }

}

const MIB$1 = 1024 * 1024;
const RETRY_MS = 60 * 1000; // after a write error, lines are dropped this long before trying again

/**
 * Appends lines to a file, with size-based rotation. A write error never throws: it is reported
 * once, lines are dropped for a minute, then writing is tried again (a full disk may recover).
 *
 * Rotation: when the file reaches maxBytes it becomes `path.1` (`.1` → `.2` …, at most keep old
 * files) and a new file is started. maxBytes 0 turns rotation off. Another process may rotate the
 * same path (or logrotate may move it): the logger then reopens the path instead of rotating again.
 * With logrotate, `copytruncate` also works (writes append at the current end).
 */
class FileLogger {
  /**
   * @param {string} path
   * @param {{ maxBytes?: number, keep?: number }} [options] defaults: 10 MiB, 5 old files
   */
  constructor(path, { maxBytes = 10 * MIB$1, keep = 5 } = {}) {
    this.path = path;
    this.maxBytes = Number.isFinite(maxBytes) && maxBytes > 0 ? maxBytes : 0;
    this.keep = Number.isInteger(keep) && keep > 0 ? keep : 1;
    this.file = -1;      // file descriptor; -1 while closed
    this.ino = 0;
    this.size = 0;       // bytes in the file, as far as this logger knows
    this.retryAt = 0;    // after a write error: when to try again
    this.dropped = 0;    // lines dropped since the last error
    this.#open();
  }

  #open() {
    try {
      this.file = fs.openSync(this.path, 'a');
      const stat = fs.fstatSync(this.file);
      this.ino = stat.ino;
      this.size = stat.size;
      return true
    } catch (error) {
      this.file = -1;
      this.#failed(error);
      return false
    }
  }

  #failed(error) {
    if (!this.retryAt) console.error(`FileLogger ${this.path}: ${error?.code ?? error?.message ?? error}; lines are dropped for ${RETRY_MS / 1000}s`);
    this.retryAt = Date.now() + RETRY_MS;
  }

  #closeFile() {
    if (this.file < 0) return
    try { fs.closeSync(this.file); } catch { }
    this.file = -1;
  }

  // Before a write that would pass maxBytes: rotate, or follow a rotation done elsewhere.
  #rotateIfNeeded(adding) {
    if (!this.maxBytes || this.size + adding <= this.maxBytes) return
    let stat = null;
    try { stat = fs.statSync(this.path); } catch { }
    if (!stat || stat.ino !== this.ino) { // moved or rotated by another writer: start on the new file
      this.#closeFile();
      this.#open();
      if (this.size + adding <= this.maxBytes) return
    } else if (stat.size + adding <= this.maxBytes) { // truncated elsewhere (copytruncate)
      this.size = stat.size;
      return
    }
    this.#closeFile();
    try {
      for (let i = this.keep - 1; i >= 1; i--) {
        if (fs.existsSync(`${this.path}.${i}`)) fs.renameSync(`${this.path}.${i}`, `${this.path}.${i + 1}`);
      }
      fs.renameSync(this.path, `${this.path}.1`);
    } catch (error) {
      console.error(`FileLogger ${this.path}: rotation failed: ${error?.code ?? error?.message ?? error}`);
    }
    this.#open();
  }

  /** Appends one line (a newline is added). Returns false when the line was dropped. */
  writeLine(line) {
    const text = String(line).replace(/[\r\n]+/g, ' ') + '\n';
    if (this.retryAt) {
      if (Date.now() < this.retryAt) { this.dropped++; return false }
      this.retryAt = 0;
      if (this.file < 0 && !this.#open()) { this.dropped++; return false }
    }
    if (this.file < 0) { this.dropped++; return false }
    const bytes = Buffer.byteLength(text);
    try {
      this.#rotateIfNeeded(bytes);
      if (this.file < 0) { this.dropped++; return false }
      if (this.dropped) {
        const note = `${new Date().toISOString()} [FileLogger] ${this.dropped} lines dropped after a write error\n`;
        this.dropped = 0;
        this.size += fs.writeSync(this.file, note);
      }
      this.size += fs.writeSync(this.file, text);
      return true
    } catch (error) {
      this.dropped++;
      this.#failed(error);
      return false
    }
  }

  /** Appends a text line, prefixed with the time (ISO 8601, UTC). */
  log(msg) {
    return this.writeLine(`${new Date().toISOString()} ${msg}`)
  }

  /** Opens the path again, e.g. after logrotate moved the file without copytruncate. */
  reopen() {
    this.#closeFile();
    this.retryAt = 0;
    this.#open();
  }

  close() {
    this.#closeFile();
  }
}

/**
 * One JSON object per line ({"at": ISO time, ...record}), for jq and fail2ban. log(text) writes
 * {"at", "event": "note", "text"} so text callers keep working.
 */
class JsonLinesLogger extends FileLogger {
  write(record) {
    let line;
    try {
      line = JSON.stringify({ at: new Date().toISOString(), ...record });
    } catch (error) {
      line = JSON.stringify({ at: new Date().toISOString(), event: 'unserializable', error: String(error?.message ?? error) });
    }
    return this.writeLine(line)
  }

  log(msg) {
    return this.write({ event: 'note', text: String(msg) })
  }
}

const KIB = 1024, MIB = 1024 * 1024;

function bytes(n) {
  if (n >= MIB) return (n / MIB).toFixed(1) + 'MB'
  if (n >= KIB) return (n / KIB).toFixed(1) + 'KB'
  return Math.round(n) + 'B'
}

// Read-only views of the manager for logStats, Server.stats() and the sudo service.
// Nothing here runs on a timer or resets the manager's counters.
class Metrics {
  constructor(manager) {
    this.manager = manager;
    this.previous = null; // last summaryLine() sample, for rates
  }

  close() {
    this.previous = null;
  }

  // Current state; counters are cumulative since the server started. Enumerates connections once.
  snapshot() {
    const manager = this.manager;
    let authenticated = 0, websocket = 0;
    for (const remote of manager.remotes) {
      if (remote.boho.isAuthorized) authenticated++;
      if (remote.socketType === 'websocket') websocket++;
    }
    const total = manager.remotes.size;
    const memory = memoryUsage();
    return {
      at: Date.now(),
      connections: { total, authenticated, anonymous: total - authenticated, websocket, tcp: total - websocket },
      channels: manager.channel_map.size,
      retained: { channel: manager.retain_messages.size, bytes: manager.retainBytes },
      counters: { ...manager.counters },
      memory: { rss: memory.rss, heapUsed: memory.heapUsed }
    }
  }

  // One logStats line; rates are per second since the previous line. Quota counters since the previous
  // line are added at the end only when something was limited (quota_exceeded notices included).
  summaryLine(now = performance$1.now()) {
    const s = this.snapshot(), previous = this.previous;
    const rate = key => previous ? (s.counters[key] - previous.counters[key]) * 1000 / Math.max(1, now - previous.time) : 0;
    this.previous = { time: now, counters: s.counters };
    const c = s.connections;
    return `[iosignal] conn ${c.total} (auth ${c.authenticated}, anon ${c.anonymous}, ws ${c.websocket}, tcp ${c.tcp})` +
      ` ch ${s.channels} retained ${s.retained.channel}/${bytes(s.retained.bytes)}` +
      ` | rx ${rate('rxMessages').toFixed(1)}/s ${bytes(rate('rxBytes'))}/s` +
      ` tx ${rate('txMessages').toFixed(1)}/s ${bytes(rate('txBytes'))}/s pub ${rate('publishes').toFixed(1)}/s` +
      ` | rss ${bytes(s.memory.rss)} heap ${bytes(s.memory.heapUsed)}` + limitedText(s.counters, previous?.counters)
  }

  // Compact summary for metrics reports ('@$metrics'); byte counters are cumulative.
  // authFail (a BohoAuth server only): failed logins as counts, never addresses or IDs, since
  // '@$metrics' is readable by anyone: { open: in the window now, last: the last window's total,
  // lastAt: when it ended, blocked: addresses blocked now }. connLimit: connections refused by the
  // per-address limits since start, and addresses limited now (counts only).
  oneline() {
    const line = {
      lastSSID: this.manager.lastSSID,
      remotes: this.manager.remotes.size,
      channels: this.manager.channel_map.size,
      txBytes: this.manager.counters.txBytes,
      rxBytes: this.manager.counters.rxBytes,
    };
    if (this.manager.addressLimiter) {
      line.connLimit = { refused: this.manager.counters.connectionsRefused ?? 0, limited: this.manager.addressLimiter.limited().length };
    }
    const auth = this.manager.authManager;
    const summary = auth?.failureSummary;
    if (summary) {
      line.authFail = {
        open: summary.current()?.total ?? 0,
        last: summary.last?.total ?? 0,
        lastAt: summary.last?.until ?? null,
        blocked: typeof auth.blockedAddresses === 'function' ? auth.blockedAddresses().length : 0
      };
    }
    return line
  }

  getRemotes() {
    return Array.from(this.manager.remotes, v => "#" + v.ssid + ":" + v.cid + "(" + v.getStateName() + ")")
  }

  getCIdList() {
    return Array.from(this.manager.cid2remote.keys())
  }

  getChannelList() {
    return Array.from(this.manager.channel_map.keys())
  }

  getSubscribers(ch) {
    let list = [];
    if (this.manager.channel_map.has(ch)) {
      let subscribers = this.manager.channel_map.get(ch); //set
      subscribers.forEach(c => {
        list.push(c.cid);
      });
    }
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
        return {
          ip: remote.ip,
          uptime: Math.trunc((Date.now() - remote.socket.openTime) / 1000),
          channels: Array.from(remote.channels.keys()),
          retain: Array.from(remote.retain_signal.keys())
        }
      }

    } else {
      return { result: "nop" }
    }

  }


}

// ' | limited rate 3 addr 0 deliv 12 subs 0 fanout 0 oversize 0 notices 2' when any of them grew since the
// previous logStats line, else ''. The first line counts from the start.
const LIMITED = [['rate', 'rateLimited'], ['addr', 'addressRateLimited'], ['deliv', 'deliveriesLimited'],
  ['subs', 'subscriptionsRejected'], ['fanout', 'quotaExcluded'], ['oversize', 'oversizeRejected'], ['notices', 'quotaNotices']];
function limitedText(counters, previous) {
  const grown = LIMITED.map(([label, key]) => [label, (counters[key] ?? 0) - (previous?.[key] ?? 0)]);
  return grown.some(([, n]) => n > 0) ? ' | limited ' + grown.map(([label, n]) => `${label} ${n}`).join(' ') : ''
}

/**
 * Delivery policy: which senders a device accepts CID unicast ('<cid>@topic') from.
 *
 * The policy belongs to an owned device (one whose login has a uid) and comes with its login
 * (authInfo.rxPolicy from the key provider, JSON text or an object) or later from
 * Manager.setDeliveryPolicy(). A device without an owner uid is never filtered.
 * An owned device without a stored policy uses mode 'home' (2026-11-27; before that, no policy was open).
 *
 * {
 *   v: 1,
 *   mode: 'home' | 'open' | 'allowlist' | 'denylist',
 *                                               // home: its own network (same public IP, HOME_CHANNEL) and the
 *                                               //   listed senders (the default for an owned device);
 *                                               // open: everyone, anywhere (only when chosen)
 *   anonymous: 'allow' | 'deny',                // default: allow for denylist, deny otherwise (home: anonymous
 *                                               //   senders on its own network are let in by rule 5 anyway)
 *   publish: 'all' | 'policy',                  // who gets its CID publications ('@topic', '@$topic'):
 *                                               // 'all' subscribers (default), or only those the policy allows
 *   allow: { cids: [], uids: [] },
 *   deny:  { cids: [], uids: [] }
 * }
 *
 * Decision, first match wins:
 *  1. no owner, no policy, mode open           -> allow
 *  2. the device itself, its owner's uid, or a connection with role 'admin' -> allow
 *  3. sender CID in deny.cids / allow.cids     -> deny / allow
 *  4. sender uid in deny.uids / allow.uids     -> deny / allow
 *  5. mode home: sender on the device's own network (same HOME_CHANNEL) -> allow
 *  6. anonymous sender (not authenticated, no uid) -> anonymous setting
 *  7. mode default: allowlist and home deny, denylist allows
 *
 * With publish 'policy', the same decision (subscriber in the sender's place) filters the device's CID
 * publications and the retained ones a new subscriber would get. Its '@state' close notice included.
 *
 * The sender's uid is remote.uid: a device's owner, or the user of a web sign-in on that connection.
 * Only the server's own view of the sender is used, never anything in the message.
 */

const DELIVERY_POLICY_MODES = Object.freeze(['home', 'open', 'allowlist', 'denylist']);
// What an owned device without a stored policy uses.
const DEFAULT_DELIVERY_POLICY = Object.freeze({ v: 1, mode: 'home', anonymous: 'deny', publish: 'all', allow: Object.freeze({ cids: [], uids: [] }), deny: Object.freeze({ cids: [], uids: [] }) });
const DELIVERY_POLICY_MAX_ENTRIES = 200;
const ENTRY_MAX_LENGTH = 64;
const LISTS = ['cids', 'uids'];

function entries(name, value) {
  if (value === undefined || value === null) return []
  if (!Array.isArray(value)) throw new TypeError(`${name} must be an array`)
  if (value.length > DELIVERY_POLICY_MAX_ENTRIES) {
    throw new RangeError(`${name} has more than ${DELIVERY_POLICY_MAX_ENTRIES} entries`)
  }
  for (const entry of value) {
    if (typeof entry !== 'string' || !entry || entry.length > ENTRY_MAX_LENGTH) {
      throw new TypeError(`${name} entries must be non-empty strings of at most ${ENTRY_MAX_LENGTH} characters`)
    }
  }
  return [...new Set(value)]
}

function lists(name, value) {
  if (value === undefined || value === null) return { cids: [], uids: [] }
  if (typeof value !== 'object' || Array.isArray(value)) throw new TypeError(`${name} must be an object`)
  for (const key of Object.keys(value)) {
    if (!LISTS.includes(key)) throw new TypeError(`unknown ${name}.${key}`)
  }
  return { cids: entries(`${name}.cids`, value.cids), uids: entries(`${name}.uids`, value.uids) }
}

/**
 * A checked copy of a policy with every field present, or null for "no policy" (null, undefined, '').
 * Accepts JSON text. Throws TypeError/RangeError on an invalid policy.
 */
function normalizeDeliveryPolicy(raw) {
  if (raw === undefined || raw === null || raw === '') return null
  let policy = raw;
  if (typeof raw === 'string') {
    try { policy = JSON.parse(raw); } catch { throw new TypeError('delivery policy is not valid JSON') }
  }
  if (!policy || typeof policy !== 'object' || Array.isArray(policy)) throw new TypeError('delivery policy must be an object')
  for (const key of Object.keys(policy)) {
    if (!['v', 'mode', 'anonymous', 'publish', 'allow', 'deny', 'updatedAt'].includes(key)) throw new TypeError(`unknown delivery policy field ${key}`)
  }
  if (policy.v !== undefined && policy.v !== 1) throw new TypeError('delivery policy version must be 1')
  const mode = policy.mode ?? 'open';
  if (!DELIVERY_POLICY_MODES.includes(mode)) throw new TypeError(`delivery policy mode must be one of: ${DELIVERY_POLICY_MODES.join(', ')}`)
  const anonymous = policy.anonymous ?? (mode === 'denylist' || mode === 'open' ? 'allow' : 'deny');
  if (anonymous !== 'allow' && anonymous !== 'deny') throw new TypeError("delivery policy anonymous must be 'allow' or 'deny'")
  const publish = policy.publish ?? 'all';
  if (publish !== 'all' && publish !== 'policy') throw new TypeError("delivery policy publish must be 'all' or 'policy'")
  const normalized = { v: 1, mode, anonymous, publish, allow: lists('allow', policy.allow), deny: lists('deny', policy.deny) };
  if (policy.updatedAt !== undefined) {
    if (!Number.isSafeInteger(policy.updatedAt) || policy.updatedAt < 0) throw new TypeError('delivery policy updatedAt must be a time in ms')
    normalized.updatedAt = policy.updatedAt;
  }
  return normalized
}

/**
 * The form Manager checks per message, or null when nothing is filtered (no owner, or mode open).
 * No stored policy is DEFAULT_DELIVERY_POLICY (home).
 * Never throws: a stored policy that cannot be read only lets the owner's own senders through
 * (fail closed), since ignoring it would deliver what the owner asked to block.
 */
function compileDeliveryPolicy(raw, ownerUid) {
  if (typeof ownerUid !== 'string' || !ownerUid) return null
  let policy;
  try {
    policy = normalizeDeliveryPolicy(raw) ?? DEFAULT_DELIVERY_POLICY;
  } catch (error) {
    console.warn(`[iosignal] unreadable delivery policy of uid ${ownerUid}, owner only:`, error.message);
    policy = { mode: 'allowlist', anonymous: 'deny', publish: 'policy', allow: { cids: [], uids: [] }, deny: { cids: [], uids: [] } };
  }
  if (!policy || policy.mode === 'open') return null
  return Object.freeze({
    owner: ownerUid,
    mode: policy.mode,
    defaultAllow: policy.mode === 'denylist',
    home: policy.mode === 'home',
    anonymousAllow: policy.anonymous === 'allow',
    filterPublish: policy.publish === 'policy',
    allowCids: new Set(policy.allow.cids),
    denyCids: new Set(policy.deny.cids),
    allowUids: new Set(policy.allow.uids),
    denyUids: new Set(policy.deny.uids)
  })
}

/** True if `target` (whose compiled policy is target.rxPolicy) accepts a unicast from `sender`. */
function deliveryAllowed(target, sender) {
  const policy = target.rxPolicy;
  if (!policy) return true
  if (sender === target) return true
  const authorized = sender.boho?.isAuthorized === true;
  const uid = typeof sender.uid === 'string' && sender.uid ? sender.uid : null;
  if (uid === policy.owner) return true
  if (authorized && sender.role === 'admin') return true
  // An anonymous connection's CID is random per connection, so CID rules are for authenticated ones.
  if (authorized) {
    if (policy.denyCids.has(sender.cid)) return false
    if (policy.allowCids.has(sender.cid)) return true
  }
  if (uid) {
    if (policy.denyUids.has(uid)) return false
    if (policy.allowUids.has(uid)) return true
  }
  // Its own network: the same public IPv4 (or both private), as the home channel tags use.
  if (policy.home && sender.HOME_CHANNEL && sender.HOME_CHANNEL === target.HOME_CHANNEL) return true
  if (!authorized && !uid) return policy.anonymousAllow
  return policy.defaultAllow
}

const encoder$1 = new TextEncoder();
const NAME = /^[A-Za-z0-9_.-]{1,64}$/;

/**
 * Validates one tag pattern of a host. A trailing '*' makes it a prefix; '*' is allowed nowhere else.
 * Channel patterns (inbound, and own without '@'): global channel tags, so no '@' and no leading
 * '#' (home channels belong to one network) or '$'. Unicast patterns (own, leading '@'): the topic
 * of '<cid>@topic' messages.
 * @returns {{ pattern: string, text: string, prefix: boolean, unicast: boolean }}
 */
function parsePattern(pattern, allowUnicast) {
  if (typeof pattern !== 'string' || pattern.length === 0) throw new TypeError('host tag must be a non-empty string')
  const prefix = pattern.endsWith('*');
  const text = prefix ? pattern.slice(0, -1) : pattern;
  if (text.includes('*')) throw new TypeError(`host tag ${pattern}: '*' is allowed only at the end`)
  if (text.includes(',')) throw new TypeError(`host tag ${pattern}: ',' separates tags`)
  if (encoder$1.encode(text).byteLength > SIZE_LIMIT.TAG_LEN1) throw new TypeError(`host tag ${pattern} exceeds 255 UTF-8 bytes`)
  const unicast = text.startsWith('@');
  if (unicast) {
    if (!allowUnicast) throw new TypeError(`host tag ${pattern}: inbound tags are channel tags (no '@')`)
    if (text.indexOf('@', 1) !== -1) throw new TypeError(`host tag ${pattern}: a unicast topic has one '@'`)
    if (text.length === 1) throw new TypeError(`host tag ${pattern}: empty topic`)
  } else {
    if (text.includes('@')) throw new TypeError(`host tag ${pattern}: channel tags have no '@'`)
    if (text.startsWith('#')) throw new TypeError(`host tag ${pattern}: home channel tags ('#...') cannot be hosted`)
    if (text.startsWith('$')) throw new TypeError(`host tag ${pattern}: '$' prefix is reserved`)
    if (text.length === 0) throw new TypeError(`host tag ${pattern}: empty tag`)
  }
  return { pattern, text, prefix, unicast }
}

function overlaps(a, b) {
  if (a.prefix && b.text.startsWith(a.text)) return true
  if (b.prefix && a.text.startsWith(b.text)) return true
  return a.text === b.text
}

/**
 * The tags all hosts of one server have claimed. Patterns never overlap, so a tag matches at most one.
 */
class HostTable {
  constructor() {
    this.exact = new Map(); // text -> entry
    this.prefixes = [];     // entries
    this.hosts = new Map(); // name -> Host
  }

  get size() {
    return this.hosts.size
  }

  add(host, entries) {
    if (this.hosts.has(host.name)) throw new Error(`host ${host.name} already exists`)
    const all = [...this.exact.values(), ...this.prefixes];
    entries.forEach((entry, i) => {
      for (const other of [...all, ...entries.slice(0, i)]) {
        if (overlaps(entry, other)) {
          throw new Error(`host tag ${entry.pattern} overlaps ${other.pattern}` +
            (other.host === host ? '' : ` of host ${other.host.name}`))
        }
      }
    });
    for (const entry of entries) {
      if (entry.prefix) this.prefixes.push(entry);
      else this.exact.set(entry.text, entry);
    }
    this.hosts.set(host.name, host);
  }

  remove(host) {
    if (this.hosts.get(host.name) !== host) return
    this.hosts.delete(host.name);
    for (const [text, entry] of this.exact) if (entry.host === host) this.exact.delete(text);
    this.prefixes = this.prefixes.filter(entry => entry.host !== host);
  }

  // tag: a client channel tag, or '@topic' of a unicast. Returns the entry or undefined.
  match(tag) {
    const entry = this.exact.get(tag);
    if (entry) return entry
    for (const p of this.prefixes) if (tag.startsWith(p.text)) return p
    return undefined
  }

  // A connection closed. ownsCid: it still owned its CID (no newer connection took it over).
  remoteClosed(remote, ownsCid) {
    if (!ownsCid || !remote.cid) return
    for (const host of this.hosts.values()) host._remoteClosed(remote);
  }
}

/**
 * Game logic (or any server-side logic) inside the server process. Created by server.host().
 *
 * Events:
 *   'message' (from, tag, ...args)  a client signal to one of the inbound tags. from is the
 *                                   server's view of the sender (never anything in the payload).
 *   'leave' (from, reason)          a participant's connection closed (it no longer has its CID)
 *   'error' (error)                 a 'message' or 'leave' handler threw
 *   'close' ()                      the host was closed
 */
class Host extends require$$0$3 {

  constructor(manager, name, options = {}) {
    super();
    if (typeof name !== 'string' || !NAME.test(name)) {
      throw new TypeError('host name: 1-64 characters of A-Z a-z 0-9 _ . -')
    }
    if (options === null || typeof options !== 'object') throw new TypeError('host options must be an object')
    for (const key of Object.keys(options)) {
      if (!['inbound', 'own', 'fanout', 'retain'].includes(key)) throw new TypeError(`unknown host option: ${key}`)
    }
    const list = (key) => {
      const value = options[key] ?? [];
      if (!Array.isArray(value)) throw new TypeError(`host option ${key} must be an array of tags`)
      return value
    };
    /** @type {Host} */
    const host = this;
    const inbound = list('inbound').map(p => ({ ...parsePattern(p, false), kind: 'inbound', host }));
    const own = list('own').map(p => ({ ...parsePattern(p, true), kind: 'own', host }));
    if (inbound.length === 0) throw new TypeError('host needs at least one inbound tag')

    const fanout = options.fanout ?? null;
    if (fanout !== null && !(Number.isSafeInteger(fanout) && fanout > 0)) {
      throw new RangeError('host fanout must be null or a positive integer')
    }
    const retain = options.retain ?? {};
    for (const key of ['tags', 'bytes']) {
      if (retain[key] !== undefined && !(Number.isSafeInteger(retain[key]) && retain[key] > 0)) {
        throw new RangeError(`host retain.${key} must be a positive integer`)
      }
    }

    this.name = name;
    this.manager = manager;
    this.fanout = fanout;
    this.retainTags = retain.tags ?? null;   // null: the server's retain.tagsPerOwner
    this.retainBytes = retain.bytes ?? null; // null: the server's retain.bytesPerOwner
    this.retainOwnerKey = 'host:' + name;
    this.ownChannels = own.filter(e => !e.unicast);
    this.closed = false;
    /** @type {Map<string, Readonly<object>>} cid -> from, connections that sent to this host */
    this._participants = new Map();
    /** cid -> { inputs, firstAt, lastAt }: activity of each participant, for the dashboard */
    this._activity = new Map();
    // Cumulative since the host opened; readers compute rates from deltas (see Dashboard).
    this.counters = {
      inbound: 0,     // inputs handed to 'message'
      rejected: 0,    // inputs to an inbound tag that were not handed over (E2E, unreadable payload)
      denied: 0,      // client messages to a tag this host owns, dropped
      published: 0, delivered: 0, // publish() calls and the connections they reached
      sent: 0,        // to() messages sent
      joins: 0, leaves: 0, errors: 0,
      handlerMs: 0,   // time spent in 'message' and 'leave' handlers
    };
    this.handlerMaxMs = 0;
    this.reported = {};  // last host.report() values
    this._journal = [];  // recent notable events (join, leave, denied, error), oldest first
    this._journalSeq = 0;
    this._loops = new Set();

    manager.hosts.add(this, [...inbound, ...own]);
    // Values a client retained on these tags before the host claimed them are not the host's.
    for (const tag of [...manager.retain_messages.keys()]) {
      if (!tag.startsWith(manager.CHANNEL_PREFIX)) continue
      const entry = manager.hosts.match(tag.slice(manager.CHANNEL_PREFIX.length));
      if (entry?.host === this) manager.dropChannelRetain(tag);
    }
  }

  /** Connections that have sent to this host and are still online: cid -> from. */
  get participants() {
    return this._participants
  }

  /** Stop tracking a participant; no 'leave' is emitted for it (until it sends again). */
  forget(cid) {
    this._activity.delete(cid);
    return this._participants.delete(cid)
  }

  /**
   * Publish to one of the host's own channel tags. A tag with '$' is also retained, owned by the
   * host. Returns the number of connections it was delivered to.
   */
  publish(tag, ...args) {
    this._open();
    if (typeof tag !== 'string') throw new TypeError('tag should be string.')
    const entry = this.manager.hosts.match(tag);
    if (tag.startsWith('@') || entry?.host !== this || entry.kind !== 'own') {
      throw new Error(`host ${this.name} does not own channel tag ${tag}`)
    }
    const message = getSignalPack(tag, ...args);
    const n = this.manager.hostPublish(this, this.manager.CHANNEL_PREFIX + tag, message);
    this.counters.published++;
    this.counters.delivered += n;
    return n
  }

  /**
   * Send to one connection. It receives '@' + topic. Returns false when the CID is not online
   * or its receive buffer is too small for the message.
   */
  to(cid, topic, ...args) {
    this._open();
    if (typeof topic !== 'string' || topic.length === 0 || topic.includes('@')) {
      throw new TypeError('topic must be a non-empty string without @')
    }
    const remote = this.manager.cid2remote.get(cid);
    const message = getSignalPack('@' + topic, ...args);
    if (!remote || remote._closing) return false
    const skipped = remote.peerRxLimitSkipped;
    remote.send_enc_mode(message);
    if (remote.peerRxLimitSkipped !== skipped) return false
    this.counters.sent++;
    return true
  }

  /**
   * Values to show on the server dashboard ("game" panel), e.g. { round: 3, players: 8 }.
   * Merged into the last report; a key set to null is removed. Numbers, short strings and booleans,
   * at most 20 keys.
   */
  report(values) {
    if (values === null || typeof values !== 'object') throw new TypeError('report() takes an object')
    for (const [key, value] of Object.entries(values)) {
      if (value === null || value === undefined) { delete this.reported[key]; continue }
      if (!['number', 'string', 'boolean'].includes(typeof value)) throw new TypeError(`report value ${key} must be a number, string or boolean`)
      if (!(key in this.reported) && Object.keys(this.reported).length >= 20) continue
      this.reported[String(key).slice(0, 32)] = typeof value === 'string' ? value.slice(0, 64) : value;
    }
    return this
  }

  /**
   * Run fn(now) every intervalMs, like setInterval, and measure it for the dashboard: the gap between
   * ticks and how long each tick took. A throwing tick is reported as an 'error' and the loop goes on.
   * Returns a stop function; close() stops every loop.
   */
  loop(intervalMs, fn) {
    this._open();
    if (!(Number.isFinite(intervalMs) && intervalMs >= 1)) throw new RangeError('loop interval must be at least 1 ms')
    if (typeof fn !== 'function') throw new TypeError('loop needs a function')
    const stats = { intervalMs, ticks: 0, gaps: [], steps: [], last: 0 };
    const timer = setInterval(() => {
      const t0 = performance$1.now();
      if (stats.last) { stats.gaps.push(t0 - stats.last); if (stats.gaps.length > 200) stats.gaps.shift(); }
      stats.last = t0;
      try { fn(Date.now()); } catch (error) { this._failed(error); }
      stats.steps.push(performance$1.now() - t0); if (stats.steps.length > 200) stats.steps.shift();
      stats.ticks++;
    }, intervalMs);
    const entry = { timer, stats };
    this._loops.add(entry);
    return () => { clearInterval(timer); this._loops.delete(entry); }
  }

  /** Timing of the loops started with loop(): target, ticks, gap p50/p99 and step average/max (ms). */
  loopStats() {
    const pct = (a, p) => { if (!a.length) return 0; const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(p / 100 * s.length))] };
    return [...this._loops].map(({ stats: s }) => ({
      intervalMs: s.intervalMs, ticks: s.ticks,
      gapP50: pct(s.gaps, 50), gapP99: pct(s.gaps, 99), gapMax: s.gaps.length ? Math.max(...s.gaps) : 0,
      stepAvg: s.steps.length ? s.steps.reduce((a, b) => a + b, 0) / s.steps.length : 0,
      stepMax: s.steps.length ? Math.max(...s.steps) : 0,
    }))
  }

  /** Participants with their activity: [{ from, inputs, firstAt, lastAt }]. */
  activity() {
    return [...this._participants.values()].map((from) => ({ from, ...(this._activity.get(from.cid) ?? { inputs: 0, firstAt: 0, lastAt: 0 }) }))
  }

  /** Notable events after sequence `after`: [{ seq, at, kind: 'join'|'leave'|'denied'|'error', ... }]. */
  journal(after = 0) {
    return this._journal.filter((e) => e.seq > after)
  }

  _note(kind, data) {
    this._journal.push({ seq: ++this._journalSeq, at: Date.now(), kind, ...data });
    if (this._journal.length > 200) this._journal.shift();
  }

  // A client sent to a tag this host owns (Manager.sender dropped it).
  _denied(remote, tag) {
    this.counters.denied++;
    this._note('denied', { cid: remote.cid, tag });
  }

  _failed(error) {
    this.counters.errors++;
    this._note('error', { message: String(error?.message ?? error).slice(0, 200) });
    if (this.listenerCount('error')) this.emit('error', error);
    else console.error(`host ${this.name} error:`, error);
  }

  /** Release the tags (they become ordinary channels again) and the host's retained values. */
  close() {
    if (this.closed) return
    this.closed = true;
    for (const { timer } of this._loops) clearInterval(timer);
    this._loops.clear();
    this.manager.hosts.remove(this);
    const owner = this.manager.retainOwners.get(this.retainOwnerKey);
    if (owner) for (const tag of [...owner.tags]) this.manager.dropChannelRetain(tag);
    this._participants.clear();
    this._activity.clear();
    this.emit('close');
  }

  _open() {
    if (this.closed) throw new Error(`host ${this.name} is closed`)
  }

  // The server's view of a sender; reused while nothing in it changes.
  static from(remote) {
    const authorized = remote.boho?.isAuthorized === true;
    const f = remote._hostFrom;
    if (f && f.cid === remote.cid && f.uid === remote.uid && f.role === remote.role &&
        f.nick === remote.nick && f.authorized === authorized) return f
    return remote._hostFrom = Object.freeze({
      cid: remote.cid, uid: remote.uid || null, role: remote.role, authorized,
      nick: remote.nick || '', ssid: remote.ssid
    })
  }

  // A SIGNAL from a client to one of the inbound tags. Returns false if it was not delivered.
  _receive(remote, tag, message) {
    if (message[0] !== IOMsg.SIGNAL || !remote.cid) return false
    const tagLen = message[1];
    if (message.byteLength < tagLen + 3) return false
    let args;
    try {
      args = decodeSignalArgs(message[2 + tagLen], message.subarray(3 + tagLen));
    } catch {
      return false
    }
    if (!args) return false
    const from = Host.from(remote);
    const now = Date.now();
    let act = this._activity.get(from.cid);
    if (!act) {
      act = { inputs: 0, firstAt: now, lastAt: now };
      this._activity.set(from.cid, act);
      this.counters.joins++;
      this._note('join', { cid: from.cid, nick: from.nick, authorized: from.authorized });
    }
    act.inputs++;
    act.lastAt = now;
    this._participants.set(from.cid, from);
    this.counters.inbound++;
    this._emitSafely('message', from, tag, ...args);
    return true
  }

  _remoteClosed(remote) {
    const from = this._participants.get(remote.cid);
    if (!from) return
    this._participants.delete(remote.cid);
    this._activity.delete(remote.cid);
    this.counters.leaves++;
    this._note('leave', { cid: remote.cid, reason: remote.closeReason ?? 'close' });
    this._emitSafely('leave', Host.from(remote), remote.closeReason ?? 'close');
  }

  _emitSafely(name, ...args) {
    const t0 = performance$1.now();
    try {
      this.emit(name, ...args);
    } catch (error) {
      this._failed(error);
    }
    const ms = performance$1.now() - t0;
    this.counters.handlerMs += ms;
    if (ms > this.handlerMaxMs) this.handlerMaxMs = ms;
  }
}

const MAX_ADDRESSES = 10000; // tracked public addresses; past windows are forgotten first

const LIMIT_KEYS = ['newPerAddressPerMin', 'failedPerAddressPerMin', 'maxPerAddress', 'windowMs', 'msgPerAddressPerSec', 'bytesPerAddressPerSec'];

/**
 * Checks a limits object ({ newPerAddressPerMin, failedPerAddressPerMin, maxPerAddress, windowMs,
 * exempt }) and returns a copy. A count of 0 turns that limit off; windowMs is at least 1000.
 */
function connectionLimits(given, defaults) {
  if (given === false) return { ...defaults, newPerAddressPerMin: 0, failedPerAddressPerMin: 0, maxPerAddress: 0, msgPerAddressPerSec: 0, bytesPerAddressPerSec: 0, exempt: [] }
  if (given !== undefined && (given === null || typeof given !== 'object')) {
    throw new TypeError('connectionLimits must be an object or false')
  }
  const limits = { ...defaults, ...given };
  for (const key of Object.keys(given ?? {})) {
    if (!LIMIT_KEYS.includes(key) && key !== 'exempt') throw new TypeError(`unknown option connectionLimits.${key}`)
  }
  for (const key of LIMIT_KEYS) {
    const value = limits[key];
    if (!Number.isSafeInteger(value) || value < (key === 'windowMs' ? 1000 : 0)) {
      throw new RangeError(`connectionLimits.${key} must be an integer >= ${key === 'windowMs' ? 1000 : 0}`)
    }
  }
  if (!Array.isArray(limits.exempt) || limits.exempt.some(ip => typeof ip !== 'string')) {
    throw new TypeError('connectionLimits.exempt must be an array of addresses')
  }
  limits.exempt = limits.exempt.map(ip => normalizeIP(ip) ?? ip);
  return limits
}

/**
 * Connections per public address, checked when a socket is accepted, before anything is sent:
 *  - new:    more than newPerAddressPerMin new connections in a window → refused until it ends
 *  - failed: failedPerAddressPerMin connections in a window that ended without a CID (a refused
 *            login, a Boho 2.x client, a broken or scanning client) → refused until it ends
 *  - open:   maxPerAddress connections open at once → further ones refused while they stay
 * Connections already open are never touched. Loopback, private and exempt addresses are not
 * counted (a proxy, a LAN, other servers). A refused connection is closed at once and costs no
 * key lookup; well-behaved clients reconnect later on their own.
 *
 * The limits object is read on every call, so a running server can adjust it.
 */
class AddressLimiter {
  /**
   * @param {() => object} getLimits returns the limits in force (see connectionLimits)
   * @param {{ onLimit?: (ip: string, reason: 'new' | 'failed' | 'open', count: number, ms: number) => any }} [options]
   *   onLimit: called once when an address starts being limited (ms: for how long; 0 for 'open').
   */
  constructor(getLimits, { onLimit } = {}) {
    this.getLimits = getLimits;
    this.onLimit = onLimit ?? null;
    this.addresses = new Map(); // ip -> { since, created, failed, open, until, reason }
    this.refused = { new: 0, failed: 0, open: 0 }; // cumulative
    this.rateLimited = 0; // messages dropped by msgPerAddressPerSec / bytesPerAddressPerSec (takeRate)
  }

  #exempt(ip, limits) {
    return typeof ip !== 'string' || !ip || isPrivateIP(ip) || limits.exempt.includes(ip)
  }

  // The entry of an address, its window renewed when it has passed (open connections stay counted).
  #entry(ip, limits, now, create) {
    let entry = this.addresses.get(ip);
    if (entry && now - entry.since >= limits.windowMs) {
      if (!entry.open) { this.addresses.delete(ip); entry = undefined; }
      else Object.assign(entry, { since: now, created: 0, failed: 0, until: 0, reason: null, openNoted: false });
    }
    if (!entry && create) {
      if (this.addresses.size >= MAX_ADDRESSES) this.#prune(limits, now);
      entry = { since: now, created: 0, failed: 0, open: 0, until: 0, reason: null, openNoted: false };
      this.addresses.set(ip, entry);
    }
    return entry
  }

  #prune(limits, now) {
    for (const [ip, e] of this.addresses) if (!e.open && now - e.since >= limits.windowMs) this.addresses.delete(ip);
    if (this.addresses.size >= MAX_ADDRESSES) for (const [ip, e] of this.addresses) if (!e.open) this.addresses.delete(ip);
  }

  #limit(ip, entry, reason, count, limits, now) {
    entry.until = entry.since + limits.windowMs;
    entry.reason = reason;
    this.#notify(ip, reason, count, entry.until - now);
  }

  #notify(ip, reason, count, ms) {
    try { this.onLimit?.(ip, reason, count, Math.max(0, ms)); } catch (error) { console.error('AddressLimiter onLimit error:', error); }
  }

  /**
   * A new connection from ip: true to accept it (it is then counted as open; call closed() when it
   * ends), false to close it at once. Its reason is in lastRefusal.
   */
  admit(ip, now = Date.now()) {
    const limits = this.getLimits();
    if (this.#exempt(ip, limits)) return true
    const entry = this.#entry(ip, limits, now, true);
    if (entry.until > now) return this.#refuse(entry.reason)
    entry.created++;
    if (limits.newPerAddressPerMin && entry.created > limits.newPerAddressPerMin) {
      this.#limit(ip, entry, 'new', entry.created - 1, limits, now);
      return this.#refuse('new')
    }
    if (limits.maxPerAddress && entry.open >= limits.maxPerAddress) {
      if (!entry.openNoted) { entry.openNoted = true; this.#notify(ip, 'open', entry.open, 0); }
      return this.#refuse('open')
    }
    entry.open++;
    return true
  }

  #refuse(reason) {
    this.refused[reason]++;
    this.lastRefusal = reason;
    return false
  }

  /**
   * An accepted connection from ip ended. failed: it never got a CID (a refused login, a Boho 2.x
   * client, a broken client); too many of those in a window limit the address.
   */
  closed(ip, failed = false, now = Date.now()) {
    const limits = this.getLimits();
    if (this.#exempt(ip, limits)) return
    const entry = this.#entry(ip, limits, now, failed);
    if (!entry) return
    if (entry.open > 0) entry.open--;
    if (entry.open < limits.maxPerAddress) entry.openNoted = false;
    if (!failed) return
    entry.failed++;
    if (limits.failedPerAddressPerMin && entry.failed >= limits.failedPerAddressPerMin && !(entry.until > now)) {
      this.#limit(ip, entry, 'failed', entry.failed, limits, now);
    }
  }

  /** Addresses limited now: [{ ip, reason, count, until }] (most first, at most limit), and those at maxPerAddress. */
  limited(limit = 100, now = Date.now()) {
    const limits = this.getLimits();
    const list = [];
    for (const [ip, e] of this.addresses) {
      if (e.until > now) list.push({ ip, reason: e.reason, count: e.reason === 'failed' ? e.failed : e.created, until: e.until });
      else if (limits.maxPerAddress && e.open >= limits.maxPerAddress) list.push({ ip, reason: 'open', count: e.open, until: null });
    }
    return list.sort((a, b) => b.count - a.count).slice(0, limit)
  }

  /**
   * A message of bytes from an address (anonymous-quota connections only; the caller decides): null when
   * it may pass, else the limit it went over ('msgPerAddressPerSec' | 'bytesPerAddressPerSec'). Token
   * buckets holding one second, kept on the address's entry while it has open connections.
   */
  takeRate(ip, bytes, now = performance$1.now()) {
    const limits = this.getLimits();
    const msgLimit = limits.msgPerAddressPerSec || 0;
    const byteLimit = limits.bytesPerAddressPerSec || 0;
    if ((!msgLimit && !byteLimit) || this.#exempt(ip, limits)) return null
    const entry = this.addresses.get(ip);
    if (!entry) return null
    if (entry.rateAt === undefined) {
      entry.msgTokens = msgLimit;
      entry.byteTokens = byteLimit;
    } else {
      const seconds = Math.max(0, now - entry.rateAt) / 1000;
      if (msgLimit) entry.msgTokens = Math.min(msgLimit, entry.msgTokens + seconds * msgLimit);
      if (byteLimit) entry.byteTokens = Math.min(byteLimit, entry.byteTokens + seconds * byteLimit);
    }
    entry.rateAt = now;
    if (msgLimit && entry.msgTokens < 1) { this.rateLimited++; return 'msgPerAddressPerSec' }
    if (byteLimit && entry.byteTokens < Math.min(bytes, byteLimit)) { this.rateLimited++; return 'bytesPerAddressPerSec' }
    if (msgLimit) entry.msgTokens -= 1;
    if (byteLimit) entry.byteTokens -= bytes;
    return null
  }

  /** Open connections counted for an address (0 for an exempt one). */
  openCount(ip) {
    return this.addresses.get(ip)?.open ?? 0
  }
}

// Characters of an anonymous CID after its '?': lowercase Crockford base32, easy to read aloud and type.
const ANONYMOUS_CID_ALPHABET = '0123456789abcdefghjkmnpqrstvwxyz';

const encoder = new TextEncoder();
const decoder$1 = new TextDecoder();

class Manager {

  constructor(server, authManager) {
    this.server = server;
    // This server's settings; a Manager made without a Server (tests, checks) uses the defaults.
    this.pingPeriod = server?.heartbeatInterval ?? serverOption.heartbeatInterval;
    this.pingGrace = server?.heartbeatGrace ?? serverOption.heartbeatGrace;
    if (!Number.isFinite(this.pingPeriod) || this.pingPeriod <= 0 ||
        !Number.isFinite(this.pingGrace) || this.pingGrace < 0) {
      throw new RangeError('Invalid heartbeat period or grace');
    }
    // Cumulative since the server started; never reset (readers compute rates from deltas).
    this.counters = { rxMessages: 0, rxBytes: 0, txMessages: 0, txBytes: 0,
      publishes: 0, deliveryAttempts: 0, quotaExcluded: 0, oversizeRejected: 0, rateLimited: 0,
      peerRxLimitSkipped: 0, // messages not sent: larger than the peer's advertised RX buffer
      subscriptionsRejected: 0, // subscriptions over a connection's quota maxSubscriptions, left out
      quotaNotices: 0, // 'quota_exceeded' notices sent (RemoteCore.noticeQuota: once per kind per connection)
      addressRateLimited: 0, // messages over connectionLimits msg/bytesPerAddressPerSec (anonymous connections), dropped
      deliveriesLimited: 0, // subscribers left out by quota deliveriesPerSec
      policyDenied: 0,       // unicasts and CID publications a device's delivery policy kept back
      hostInbound: 0,        // client signals handed to a host (server.host)
      hostRejected: 0,       // signals to a host tag that were not handed over (E2E, malformed payload)
      hostDenied: 0,         // client signals to a tag a host owns, dropped
      connectionsRefused: 0 }; // connections closed when accepted: over a per-address limit

    // Per-address connection limits: the Server's (adjustable there), else the defaults.
    const defaultLimits = connectionLimits(undefined, serverOption.connectionLimits);
    this.addressLimiter = new AddressLimiter(() => server?.connectionLimits ?? defaultLimits, {
      onLimit: (ip, reason, count, ms) => this.onAddressLimit(ip, reason, count, ms)
    });

    this.authManager = authManager;

    this.connectionLogger;
    if (serverOption.fileLogger.connection.use) {
      this.connectionLogger = new FileLogger(serverOption.fileLogger.connection.path, serverOption.fileLogger.connection);
      // console.log('Manager: begin file logger [connection]')
    }

    this.attackLogger;
    if (serverOption.fileLogger.attack.use) {
      this.attackLogger = new FileLogger(serverOption.fileLogger.attack.path, serverOption.fileLogger.attack);
      // console.log('Manager: begin file logger.[attack]')
    }

    this.remotes = new Set();         // total remotes
    this.cid2remote = new Map();      // key: cid -> value: remote
    this.accountConnectionCounts = new Map(); // uid -> authenticated connections
    this.retain_messages = new Map();  // key: tag, data: signalMessage
    this.retain_owner = new Map();     // key: channel retain tag -> its owner record (see retainOwner)
    this.retainOwners = new Map();     // key: 'cid:<cid>' | 'conn:<ssid>' | 'net:<HOME_CHANNEL>' -> owner
    this.retainExpiry = new Map();     // key: channel retain tag in a grace pool -> expiry time
    this.retainBytes = 0;              // all retained messages, channel and CID
    this.channel_map = new Map();      // key: channelName -> value: < remote : Set >
    this.hosts = new HostTable();      // tags claimed by server.host() hosts
    this.CHANNEL_PREFIX = 'CH:';
    this.CID_PREFIX = 'CID:';
    this.metrics = new Metrics(this);
    this.lastSSID = 0;

    const groups = Math.min(50, Math.max(1, Math.floor(this.pingPeriod / 1000)));
    this.pingGroups = Array.from({ length: groups }, () => new Set());
    this.nextPingGroup = 0;
    this.pingGroupCursor = 0;
    // Same timeout for all entries: insertion order is also deadline order.
    this.heartbeatPending = new Map();
    this.pingTickMs = this.pingPeriod / groups;
    this.heartbeatStopped = false;
    const tick = () => {
      if (this.heartbeatStopped) return;
      this.heartbeatTick();
      if (!this.heartbeatStopped) this.pingIntervalID = setTimeout(tick, this.pingTickMs);
    };
    this.pingIntervalID = setTimeout(tick, this.pingTickMs);

    // logStats: one summary line per interval; it never clears the terminal, so other logs stay.
    if (server.logStats) {
      this.statsIntervalID = setInterval(() => console.log(this.metrics.summaryLine()), server.logStats);
    }


  }


  get retainOptions() {
    return this.server?.retain ?? serverOption.retain
  }

  get quotas() {
    return this.server?.quotas ?? serverOption.quotas
  }

  get anonymousQuota() {
    return this.server?.anonymousQuota ?? serverOption.anonymousQuota
  }

  // Authenticated connections per account (uid), for the quota's maxConnections.
  accountConnections(uid) {
    return this.accountConnectionCounts.get(uid) ?? 0
  }

  addAccountConnection(remote, uid) {
    remote.accountUid = uid;
    this.accountConnectionCounts.set(uid, this.accountConnections(uid) + 1);
  }

  /**
   * Replace the delivery policy of the connected, owned device with this CID (see deliveryPolicy.js);
   * the next unicast to it already uses the new one. A new login reads the stored policy again.
   * Returns false when no such connection is here or it has no owner (never filtered).
   * Throws on an invalid policy, so a caller cannot install one by mistake.
   */
  setDeliveryPolicy(cid, policy) {
    const remote = this.cid2remote.get(cid);
    if (!remote?.boho.isAuthorized || !remote.ownerUid) return false
    normalizeDeliveryPolicy(policy);
    remote.rxPolicy = compileDeliveryPolicy(policy, remote.ownerUid);
    return true
  }

  /**
   * Count a message a delivery policy kept from `other` (unicast from it, or a publication to it) and,
   * when someone listens, emit 'delivery:denied' on the server with what the server knows of both:
   * { kind: 'unicast' | 'publish', cid, did, owner, other: { cid, uid, ip, authenticated }, at }.
   * An anonymous connection's CID is not reported (random per connection).
   */
  deliveryDenied(device, other, kind) {
    this.counters.policyDenied++;
    if (!this.server?.listenerCount?.('delivery:denied')) return
    const authenticated = other.boho?.isAuthorized === true;
    this.server.emit('delivery:denied', {
      kind, cid: device.cid, did: device.did, owner: device.ownerUid,
      other: { cid: authenticated ? other.cid : null, uid: other.uid || null, ip: other.ip ?? null, authenticated },
      at: Date.now()
    });
  }

  removeAccountConnection(remote) {
    const uid = remote.accountUid;
    if (!uid) return
    remote.accountUid = null;
    const count = this.accountConnections(uid) - 1;
    if (count > 0) this.accountConnectionCounts.set(uid, count);
    else this.accountConnectionCounts.delete(uid);
  }

  heartbeatTick() {
    const now = performance$1.now();
    if (this.retainExpiry.size) this.expireChannelRetains(now);
    // Process only expired requests, not every connected peer.
    for (const [remote, deadline] of this.heartbeatPending) {
      if (deadline > now) break;
      this.heartbeatPending.delete(remote);
      if (!remote._closing && remote.socket.isAlive === false) remote.close(true);
    }
    // The single timer schedules its next tick after this work; missed groups are not replayed.
    const group = this.pingGroups[this.pingGroupCursor];
    this.pingGroupCursor = (this.pingGroupCursor + 1) % this.pingGroups.length;
    for (const remote of group) {
      if (remote._closing || this.heartbeatPending.has(remote)) continue;
      remote.socket.isAlive = false;
      this.heartbeatPending.set(remote, performance$1.now() + this.pingPeriod + this.pingGrace);
      try {
        remote.ping();
      } catch {
        this.heartbeatPending.delete(remote);
        remote.close(true);
      }
    }
  }

  /** A socket from ip is being accepted: false when a per-address limit refuses it (close it then). */
  admitConnection(ip) {
    if (this.addressLimiter.admit(ip)) return true;
    this.counters.connectionsRefused++;
    return false;
  }

  // Logged once when an address starts being limited, never per refused connection.
  onAddressLimit(ip, reason, count, ms) {
    const limits = this.server?.connectionLimits ?? serverOption.connectionLimits;
    const what = { new: 'new connections', failed: 'connections that ended without a CID', open: 'open connections' }[reason];
    const text = reason === 'open'
      ? `[conn] ${ip} has ${count} ${what}: new ones refused`
      : `[conn] ${ip} limited for ${Math.round(ms / 1000)}s: ${count} ${what} in ${Math.round(limits.windowMs / 1000)}s`;
    console.log(text);
    this.authManager?.authLogger?.write?.({ event: 'conn_limit', ip, reason, count, seconds: Math.round(ms / 1000) });
  }

  addRemote(socket, req) {
    socket.isAlive = true;
    let remote = new Remote(socket, req, this);
    this.remotes.add(remote);
    remote.pingGroup = this.nextPingGroup;
    this.pingGroups[remote.pingGroup].add(remote);
    this.nextPingGroup = (this.nextPingGroup + 1) % this.pingGroups.length;
    remote.send(remote.issueAuthChallenge());
    remote.send( Buffer.from([ IOMsg.SERVER_READY]) );
    remote.setState(STATE.SERVER_READY);
    this.lastSSID = remote.ssid;
    let connectionInfo = `+ IP:${remote.ip} #${remote.ssid} ${socket.socketType === 'websocket' ? "WS" : "CS"} `;
    // console.log( connectionInfo)
    if (this.connectionLogger) this.connectionLogger.log(connectionInfo);
  };


  removeRemote(remote) {

    remote._closing = true;
    // A connection accepted through admitConnection: counted out; one that never got a CID (a
    // refused login, a Boho 2.x or broken client) counts as failed for its address.
    const limitIp = remote.socket?._limitIp;
    if (limitIp !== undefined) {
      remote.socket._limitIp = undefined;
      this.addressLimiter.closed(limitIp, !remote.cid);
    }
    this.removeAccountConnection(remote);
    this.pingGroups[remote.pingGroup]?.delete(remote);
    this.heartbeatPending.delete(remote);
    remote.setState(STATE.CLOSED);

    let remoteInfo = `- IP:${remote.ip} #${remote.ssid} cid:${remote.cid} ${remote?.socket.socketType === 'websocket' ? "WS" : "CS"} `;
    if (this.connectionLogger) this.connectionLogger.log(remoteInfo);
    // A replaced duplicate login no longer owns its CID; the new connection is still online.
    const cidOwner = this.cid2remote.get(remote.cid);
    const ownsCid = !remote.cid || !cidOwner || cidOwner === remote;
    if (ownsCid) {
      this.deligateSignal(remote, '@state', 'close');
      this.deligateSignal(remote, '@$state', 'close');
    }
    if (this.hosts.size) this.hosts.remoteClosed(remote, ownsCid);

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
    // Channel retains: an authenticated writer's belong to its account and stay; an anonymous
    // connection's move to its network's grace pool and expire there.
    this.orphanChannelRetains(remote);

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
    // CID retains live in the remote and go with it (after the '@$state' close above).
    for (const message of remote.retain_signal.values()) this.retainBytes -= message.byteLength;
    remote.retain_signal.clear();
    remote.retainBytes = 0;


    // Service lifecycle hook. Called directly: RPC permission/command checks do not apply to cleanup.
    for (const service of new Set(this.server.services?.values() ?? [])) {
      if (typeof service.onRemoteClose !== 'function') continue
      try {
        service.onRemoteClose(remote);
      } catch (error) {
        console.error('service onRemoteClose error:', error);
      }
    }

    this.remotes.delete(remote);
    if (this.cid2remote.get(remote.cid) === remote) this.cid2remote.delete(remote.cid);
    remote = null;

  }


  // it's like unix wall command.
  serverSignal(obj) {
    let sigPack = $$1.pack(
      $$1.MB('#MsgType', '8', IOMsg.SERVER_SIGNAL),
      $$1.MB('#signalObject', obj)
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
    if (newTagLen > SIZE_LIMIT.TAG_LEN1) return null;
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
      this.cid2remote.get(cid).send_enc_mode(sigPack);
      return
    } else {
      return "no cid"
    }
  }

  sender(tag, remote, message) {
    if (encoder.encode(tag).byteLength > SIZE_LIMIT.TAG_LEN1) return ['err', 'Tag exceeds 255 UTF-8 bytes']
    if ((this.server?.membersOnly ?? serverOption.membersOnly) && !remote.boho.isAuthorized) {
      // console.log("### server reject client signal reason: [membersOnly]" ,tag, remote.cid  )
      remote.send(Buffer.from([IOMsg.AUTH_CLEAR]));
      remote.close();
      return ['err', 'unAuthorized']
    }

    if (tag.indexOf('$') == 0) return ['err', 'prefix $ is reserved for userSet tag.']

    let cidIndex = tag.indexOf('@');

    // Hosts (server.host): a signal to an inbound tag goes to the host only, with its sender; a
    // client may not send to a tag a host owns. CID publications ('@topic') name their sender and
    // are never hosted.
    if (this.hosts.size && cidIndex !== 0) {
      const entry = this.hosts.match(cidIndex > 0 ? tag.slice(cidIndex) : tag);
      if (entry?.kind === 'inbound') {
        if (entry.host._receive(remote, tag, message)) {
          this.counters.hostInbound++;
          return ['ok', 1]
        }
        this.counters.hostRejected++;
        entry.host.counters.rejected++;
        return ['err', 'Not accepted by the host']
      }
      if (entry) {
        this.counters.hostDenied++;
        entry.host._denied(remote, tag);
        if (this.server?.listenerCount?.('host:denied')) this.server.emit('host:denied', remote, tag, entry.host.name);
        return ['err', 'Tag is reserved by a host']
      }
    }
    // A device whose policy also covers its publications: each subscriber is checked (see deliveryPolicy.js).
    const publisher = cidIndex === 0 && remote.rxPolicy?.filterPublish ? remote : null;
    if (cidIndex === 0) {
      // ** CID_PUB multi-cast
      // [cid_pub]  @topic ,  @$retainTopic
      // modify signalpack with cid_appneded tag.
      tag = remote.cid + tag;
      message = this.getNewSignalTagMessage(message, tag);
      if (!message) return ['err', 'CID-prefixed tag exceeds 255 UTF-8 bytes']

    } else if (cidIndex > 0) {
      // uni-cast.  
      let targetCId = tag.split('@')[0];
      const target = this.cid2remote.get(targetCId);
      if (target && !deliveryAllowed(target, remote)) {
        // Same answer as an offline CID: a sender cannot tell it is blocked, or probe the policy.
        this.deliveryDenied(target, remote, 'unicast');
        return ['err', 'Invalid cid']
      }
      if (target) {
        //rm cid from tag.
        let ommitCIdTag = '@' + tag.split('@')[1];
        // console.log('uni-cast tag change from', tag, 'to' , ommitCIdTag )
        message = this.getNewSignalTagMessage(message, ommitCIdTag);
        if (!message) return ['err', 'Tag exceeds 255 UTF-8 bytes']
        // console.log(`origin tag: ${tag} omitTag: ${this.getSignalTag(message)}`)
        target.send_enc_mode(message);
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
      && this.retainOptions.enabled
    ) {
      if (tag.includes('@')) {
        // cid retain signal stored inside remote, counted per remote.
        this.storeCidRetain(tag.split('@')[1], message, remote);
      } else {
        // channel retain signal stored inside manager.
        this.storeChannelRetain(tag, message, remote);
      }
    }

    this.counters.publishes++;
    const fanout = remote.quota.fanout;
    const subscribers = this.channel_map.get(tag)?.size ?? 0;
    // deliveriesPerSec: the subscribers this publish may still reach this second (at most fanout).
    const wanted = fanout === null ? subscribers : Math.min(fanout, subscribers);
    const allowed = remote.takeDeliveries ? remote.takeDeliveries(wanted) : wanted;
    if (allowed < wanted) {
      this.counters.deliveriesLimited += wanted - allowed;
      remote.noticeQuota?.('deliveriesPerSec', remote.quota.deliveriesPerSec);
    }
    const sent = subscribers === 0 ? null : allowed === 0 ? 0 : this.deliver(tag, message, allowed, publisher);
    if (sent === null) return ['err', 'No subscriber.']
    // The publisher's fanout left subscribers out: tell it once.
    if (fanout !== null && subscribers > fanout) remote.noticeQuota?.('fanout', fanout);
    return ['ok', sent]
  }

  // Sends a SIGNAL to the subscribers of a full channel key ('CH:…', 'CID:…', home channel), at
  // most fanout (null: all). publisher: a device whose delivery policy filters its publications.
  // Returns the number sent, or null when the channel has no subscribers.
  deliver(tag, message, fanout, publisher = null) {
    const remotes = this.channel_map.get(tag);
    if (!remotes || remotes.size === 0) return null
    const limit = fanout === null ? remotes.size : Math.min(fanout, remotes.size);
    this.counters.quotaExcluded += remotes.size - limit;
    let sentCounter = 0;
    for (const c of remotes) {
      if (sentCounter >= limit) break;
      if (publisher && !deliveryAllowed(publisher, c)) {
        this.deliveryDenied(publisher, c, 'publish');
        continue
      }
      // change: from v4.x allow receiveSelfMessages.
      c.send_enc_mode(message);
      sentCounter++;
    }
    this.counters.deliveryAttempts += sentCounter;
    return sentCounter
  }

  // A host's publication (Host.publish): full channel key, already packed.
  hostPublish(host, tag, message) {
    if (tag.includes('$') && this.retainOptions.enabled) this.storeChannelRetain(tag, message, null, host);
    this.counters.publishes++;
    return this.deliver(tag, message, host.fanout) ?? 0
  }



  // Retained messages are stored as exact-size copies (a subarray would keep a whole socket chunk
  // or 8 KiB Buffer pool slab alive), within an owner's budget and bytesTotal server-wide. A value
  // that cannot be stored (size, count or budget) also removes the value it would replace, so a
  // later subscriber never gets a stale one.
  retainFits(message, freed, ownerBytes, budget) {
    return this.retainOptions.limitSize > message.byteLength &&
      ownerBytes + message.byteLength <= budget &&
      this.retainBytes + message.byteLength - freed <= this.retainOptions.bytesTotal
  }

  retainCopy(message) {
    const copy = Buffer.allocUnsafeSlow(message.byteLength);
    copy.set(message);
    this.retainBytes += copy.byteLength;
    return copy
  }

  // A connection's CID retains go with it: within bytesPerConnection; limitCounter caps new tags.
  storeCidRetain(key, message, remote) {
    const map = remote.writableRetainSignal();
    const old = map.get(key);
    const freed = old?.byteLength ?? 0;
    if ((old || map.size < this.retainOptions.limitCounter) &&
        this.retainFits(message, freed, remote.retainBytes - freed, this.retainOptions.bytesPerConnection)) {
      map.set(key, this.retainCopy(message));
      this.retainBytes -= freed;
      remote.retainBytes += message.byteLength - freed;
    } else if (old) {
      map.delete(key);
      this.retainBytes -= freed;
      remote.retainBytes -= freed;
    }
  }

  // Channel retain owner: the last writer's account (an authenticated CID, shared by its
  // connections, so reconnecting does not reset its budget) or an anonymous writer's connection.
  // Each owner holds at most tagsPerOwner tags and bytesPerOwner bytes.
  retainOwner(key) {
    let owner = this.retainOwners.get(key);
    if (!owner) this.retainOwners.set(key, owner = { key, bytes: 0, tags: new Set() });
    return owner
  }

  // host: a Host (server.host) writing its own tag, with its own budget; remote is then null.
  storeChannelRetain(tag, message, remote, host = null) {
    const owner = this.retainOwner(host ? host.retainOwnerKey
      : remote.boho.isAuthorized ? 'cid:' + remote.cid : 'conn:' + remote.ssid);
    const tagsPerOwner = host?.retainTags ?? this.retainOptions.tagsPerOwner;
    const bytesPerOwner = host?.retainBytes ?? this.retainOptions.bytesPerOwner;
    const old = this.retain_messages.get(tag);
    const freed = old?.byteLength ?? 0;
    const room = old || (this.retain_messages.size < this.retainOptions.limitCounter &&
      owner.tags.size < tagsPerOwner);
    const ownerBytes = owner.bytes - (this.retain_owner.get(tag) === owner ? freed : 0);
    if (room && this.retainFits(message, freed, ownerBytes, bytesPerOwner)) {
      if (old) this.releaseChannelRetain(tag, freed);
      this.retain_messages.set(tag, this.retainCopy(message));
      owner.bytes += message.byteLength;
      owner.tags.add(tag);
      this.retain_owner.set(tag, owner);
      this.retainOwners.set(owner.key, owner); // releasing may have removed it when it emptied
    } else if (old) {
      this.dropChannelRetain(tag);
    }
    if (owner.tags.size === 0) this.retainOwners.delete(owner.key);
  }

  // A closed anonymous connection's channel retains stay anonymousGraceMs in its network's pool
  // (by HOME_CHANNEL), which has the same owner budget: reconnecting cannot pile values up, and
  // when the pool is over budget the values closest to expiry go first, least recently written
  // first among equals (an update moves its tag to the end of the owner's set).
  orphanChannelRetains(remote) {
    const conn = this.retainOwners.get('conn:' + remote.ssid);
    if (!conn) return
    const grace = this.retainOptions.anonymousGraceMs;
    if (!(grace > 0)) {
      for (const tag of [...conn.tags]) this.dropChannelRetain(tag);
      return
    }
    this.retainOwners.delete(conn.key);
    const pool = this.retainOwner('net:' + remote.HOME_CHANNEL);
    const expires = performance$1.now() + grace;
    for (const tag of conn.tags) {
      pool.tags.add(tag);
      pool.bytes += this.retain_messages.get(tag).byteLength;
      this.retain_owner.set(tag, pool);
      this.retainExpiry.set(tag, expires);
    }
    while (pool.bytes > this.retainOptions.bytesPerOwner || pool.tags.size > this.retainOptions.tagsPerOwner) {
      let first;
      for (const tag of pool.tags) {
        if (first === undefined || this.retainExpiry.get(tag) < this.retainExpiry.get(first)) first = tag;
      }
      this.dropChannelRetain(first);
    }
  }

  expireChannelRetains(now = performance$1.now()) {
    for (const [tag, expires] of this.retainExpiry) {
      if (expires <= now) this.dropChannelRetain(tag);
    }
  }

  dropChannelRetain(tag) {
    const old = this.retain_messages.get(tag);
    if (!old) return
    this.releaseChannelRetain(tag, old.byteLength);
    this.retain_messages.delete(tag);
  }

  releaseChannelRetain(tag, size) {
    const owner = this.retain_owner.get(tag);
    this.retain_owner.delete(tag);
    this.retainExpiry.delete(tag);
    this.retainBytes -= size;
    if (!owner) return
    owner.tags.delete(tag);
    owner.bytes -= size;
    if (owner.tags.size === 0) this.retainOwners.delete(owner.key);
  }

  // Returns false when nothing was subscribed (membersOnly), else the connection's subscription count.
  // Tags over the quota's maxSubscriptions are left out and counted in subscriptionsRejected.
  subscribe(chArr, remote) {
    // Reading is closed to anonymous connections like sending (sender): same answer.
    if ((this.server?.membersOnly ?? serverOption.membersOnly) && !remote.boho.isAuthorized) {
      remote.send(Buffer.from([IOMsg.AUTH_CLEAR]));
      remote.close();
      return false
    }
    const maxSubscriptions = remote.quota?.maxSubscriptions ?? null;
    chArr.forEach(tag => {
      if (tag.indexOf('#') === 0) {
        tag = remote.HOME_CHANNEL + tag;
      } else if (tag.includes('@')) {
        tag = this.CID_PREFIX + tag;
      } else {
        tag = this.CHANNEL_PREFIX + tag;
      }

      if (maxSubscriptions !== null && remote.channels.size >= maxSubscriptions && !remote.channels.has(tag)) {
        this.counters.subscriptionsRejected++;
        remote.subscriptionsRejected = (remote.subscriptionsRejected ?? 0) + 1;
        remote.noticeQuota?.('maxSubscriptions', maxSubscriptions);
        return
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
        && this.retainOptions.enabled
      ) {
        let retainMessage;
        if (tag.includes('@')) {
          let cid = tag.split('@')[0];
          cid = cid.split(this.CID_PREFIX)[1];
          let retainTag = tag.split('@')[1];
          const owner = this.cid2remote.get(cid);
          if (owner) {
            if (owner.rxPolicy?.filterPublish && !deliveryAllowed(owner, remote)) {
              this.deliveryDenied(owner, remote, 'publish');
              return;
            }
            retainMessage = owner.retain_signal.get(retainTag);
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


  // One random byte per CID character.
  anonymousCidRandom(size) {
    return globalThis.crypto.getRandomValues(Buffer.alloc(size))
  }

  // '?' + lowercase Crockford base32 (ANONYMOUS_CID_ALPHABET: no i, l, o, u), never one that is
  // online. Check and set run in the same synchronous turn (CID_REQ handler), so concurrent
  // requests cannot take the same CID. 4 characters normally; 8 if the short space keeps colliding.
  issueAnonymousCid() {
    for (const [size, tries] of [[4, 8], [8, 8]]) {
      for (let i = 0; i < tries; i++) {
        let cid = '?';
        // 32 divides 256, so the low 5 bits of a random byte are uniform.
        for (const byte of this.anonymousCidRandom(size)) cid += ANONYMOUS_CID_ALPHABET[byte & 31];
        if (!this.cid2remote.has(cid)) return cid
      }
    }
    return null
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
    this.metrics.close();
    this.heartbeatStopped = true;
    clearTimeout(this.pingIntervalID);
    this.heartbeatPending.clear();
    for (const group of this.pingGroups) group.clear();
    if (this.statsIntervalID) {
      clearInterval(this.statsIntervalID);
    }

    this.remotes.forEach(remote => {
      remote.close();
    });

    this.remotes.clear();
    this.cid2remote.clear();
    this.retain_messages.clear();
    this.retain_owner.clear();
    this.retainOwners.clear();
    this.retainExpiry.clear();
    this.retainBytes = 0;
    this.channel_map.clear();

  }
}

// Live server telemetry, sampled once a second and shared by every reader (the dashboard, the
// monitor service): CPU, event-loop delay and utilisation, memory, connections by transport and
// state, send queues of slow peers, and per-second rates of the manager's counters.
// `value` holds the latest sample. dispose() stops the timer.
class ServerStats {
  // onSample(value): called after each sample (the dashboard keeps its history from it).
  constructor(server, { onSample = null } = {}) {
    this.server = server;
    this.onSample = onSample;
    // Traffic counters come from the manager's cumulative counters, counted since this service started.
    this.base = { ...server.manager.counters };
    this.counters = { opened: 0, closed: 0, authFailed: 0,
      ...Object.fromEntries(Object.keys(this.base).map(key => [key, 0])) };
    this.onState = (_peer, _previous) => {
      if (_peer.state === STATE.OPEN) this.counters.opened++;
      if (_peer.state === STATE.CLOSED) this.counters.closed++;
      if (_peer.state === STATE.AUTH_FAIL) this.counters.authFailed++;
    };
    server.on('remote:state', this.onState);
    this.delay = monitorEventLoopDelay({ resolution: 20 }); this.delay.enable();
    this.cpu = process.cpuUsage(); this.elu = performance$1.eventLoopUtilization();
    this.previousAt = performance$1.now(); this.previous = { ...this.counters };
    this.sample();
    this.timer = setInterval(() => this.sample(), 1000); this.timer.unref();
  }
  sample() {
    const now = performance$1.now(), elapsed = Math.max(1, now - this.previousAt);
    for (const key in this.base) this.counters[key] = this.server.manager.counters[key] - this.base[key];
    let authenticated = 0, websocket = 0, queuedBytes = 0, maxQueuedBytes = 0;
    let txQueuePeakBytes = 0, txWriteFalseCount = 0, txDrainMaxMs = 0;
    let txBlockedConnections = 0, txBlockedMaxMs = 0;
    const states = {};
    const transports = { websocket: { total: 0, authenticated: 0 }, tcp: { total: 0, authenticated: 0 } };
    for (const peer of this.server.manager.remotes) {
      const transport = transports[peer.socketType === 'websocket' ? 'websocket' : 'tcp']; transport.total++;
      if (peer.boho.isAuthorized) { authenticated++; transport.authenticated++; }
      if (peer.socketType === 'websocket') websocket++;
      const queued = peer.socket.bufferedAmount ?? peer.socket.writableLength ?? 0;
      queuedBytes += queued; maxQueuedBytes = Math.max(maxQueuedBytes, queued);
      txQueuePeakBytes = Math.max(txQueuePeakBytes, peer.txQueuePeakBytes ?? 0);
      txWriteFalseCount += peer.txWriteFalseCount ?? 0;
      txDrainMaxMs = Math.max(txDrainMaxMs, peer.txDrainMaxMs ?? 0);
      if (peer.txBlockedSince != null) {
        txBlockedConnections++;
        txBlockedMaxMs = Math.max(txBlockedMaxMs, now - peer.txBlockedSince);
      }
      const name = peer.getStateName(); states[name] = (states[name] || 0) + 1;
    }
    const rates = Object.fromEntries(Object.entries(this.counters).map(([key, value]) => [key, (value - this.previous[key]) * 1000 / elapsed]));
    const cpu = process.cpuUsage(), elu = performance$1.eventLoopUtilization();
    const delta = performance$1.eventLoopUtilization(elu, this.elu);
    const mem = process.memoryUsage(), total = this.server.manager.remotes.size;
    let hostAvailableBytes = null;
    if (process.platform === 'linux') {
      try { const match = readFileSync('/proc/meminfo', 'utf8').match(/^MemAvailable:\s+(\d+) kB/m); if (match) hostAvailableBytes = Number(match[1]) * 1024; }
      catch { /* Optional host telemetry must not interrupt service. */ }
    }
    this.value = { at: Date.now(), total, authenticated, anonymous: total - authenticated, websocket,
      transports, hostAvailableBytes, hostTotalBytes: totalmem(), channels: this.server.manager.channel_map.size, states, queuedBytes, maxQueuedBytes,
      txQueuePeakBytes, txWriteFalseCount, txDrainMaxMs, txBlockedConnections, txBlockedMaxMs,
      counters: { ...this.counters }, rates, rss: mem.rss, heapUsed: mem.heapUsed,
      cpuPercent: ((cpu.user - this.cpu.user) + (cpu.system - this.cpu.system)) / (elapsed * 10),
      eventLoopUtilization: delta.utilization,
      eventLoopP99Ms: this.delay.percentile(99) / 1e6,
      // anonymous: profile name of unauthenticated connections; profiles: the server's quotas now.
      quota: { anonymous: this.server.anonymousQuota, profiles: structuredClone(this.server.quotas) } };
    this.previousAt = now; this.previous = { ...this.counters }; this.cpu = cpu; this.elu = elu; this.delay.reset();
    if (this.onSample) {
      try { this.onSample(this.value); } catch (error) { console.error('server stats reader error:', error); }
    }
  }
  dispose() {
    clearInterval(this.timer); this.delay.disable(); this.server.off('remote:state', this.onState);
  }
}

// The stored key: base64 of Boho.deriveKey(key string), 16 bytes. 44 characters: a Boho 2.x hash.
const STORED_KEY = /^[A-Za-z0-9+/]{22}==$/;
const CLASSIC_HASH_LENGTH = 44;
const decoder = new TextDecoder();
const DUPLICATE_LOGIN_POLICIES = ['keepOld', 'keepNew'];
// Only WebSocket remotes carry socketType; CongSocket remotes leave it unset.
const transportOf = remote => remote.socketType === 'websocket' ? 'websocket' : 'congsocket';

// Kind of a failed login, from its reason (which may carry the login ID): the summary and event key.
// Summary-only kinds: 'bad_packet' (an AUTH_REQ of the wrong size), 'boho2_client' (a Boho 2.x
// login request: an IOSignal 9.x client), 'blocked' (an address with too many wrong logins, closed
// unchecked), 'unavailable' (key store).
const FAIL_KINDS = [
  ['NO ID', 'no_id'], ['NO KEY', 'no_key'], ['BOHO 2.x KEY', 'boho2_key'], ['hmac', 'wrong_key'],
  ['unknown auth.role', 'unknown_role'], ['unknown quota', 'unknown_quota'],
  ['too many connections', 'too_many_connections'], ['duplicate login', 'duplicate'], ['unpack', 'bad_packet']
];
function authFailKind(reason) {
  const text = String(reason ?? '');
  for (const [prefix, kind] of FAIL_KINDS) if (text.startsWith(prefix)) return kind
  return 'error'
}
// A login ID as received (any 8 bytes): printable ASCII only, for logs.
const cleanId = id => String(id ?? '').slice(0, 8).replace(/[^\x21-\x7e]/g, '?');
const MAX_SUMMARY_KEYS = 1000; // distinct addresses or IDs kept per window; the rest count as 'other'
const TOP = 5;
const RECENT = 12; // reported summaries kept for monitors (two hours at the default window)

/**
 * Failed logins in a time window: counts by kind, address and login ID, reported once when the
 * window ends. Nothing runs while no login fails (the window starts with its first failure).
 */
class AuthFailureSummary {
  /** @param {{ windowMs: () => number, onSummary: (summary: object) => any }} options */
  constructor({ windowMs, onSummary }) {
    this.windowMs = windowMs;
    this.onSummary = onSummary;
    this.last = null; // the last reported summary
    this.recent = []; // reported summaries, newest first (at most RECENT)
    this.seq = 0; // number of the last reported summary (1, 2, ...): tells windows apart
    this.#reset();
  }

  // The window's figures so far (a summary without until), or null before its first failure.
  #figures() {
    if (!this.since) return null
    const top = map => [...map].sort((a, b) => b[1] - a[1]).slice(0, TOP);
    return {
      since: this.since, total: this.total,
      kinds: Object.fromEntries([...this.kinds].sort((a, b) => b[1] - a[1])),
      ips: this.ips.size + (this.otherIps ? 1 : 0), topIps: top(this.ips),
      ids: this.ids.size + (this.otherIds ? 1 : 0), topIds: top(this.ids)
    }
  }

  /** The window in progress, as a summary without until; null while no login has failed in it. */
  current() {
    return this.#figures()
  }

  #reset() {
    this.since = 0;
    this.total = 0;
    this.kinds = new Map();
    this.ips = new Map();
    this.ids = new Map();
    this.otherIps = 0;
    this.otherIds = 0;
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
  }

  #count(map, key, overflow) {
    if (map.has(key)) map.set(key, map.get(key) + 1);
    else if (map.size < MAX_SUMMARY_KEYS) map.set(key, 1);
    else this[overflow]++;
  }

  add(kind, ip, id) {
    const windowMs = this.windowMs();
    if (!(windowMs > 0)) return
    if (!this.since) {
      this.since = Date.now();
      this.timer = setTimeout(() => this.flush(), windowMs);
      this.timer.unref?.();
    }
    this.total++;
    this.kinds.set(kind, (this.kinds.get(kind) ?? 0) + 1);
    if (ip) this.#count(this.ips, ip, 'otherIps');
    if (id !== undefined && id !== null) this.#count(this.ids, cleanId(id), 'otherIds');
  }

  /** Ends the window now: returns its summary (null when nothing failed) and reports it. */
  flush() {
    const figures = this.#figures();
    if (!figures) return null
    const { since, ...rest } = figures;
    const summary = { seq: ++this.seq, since, until: Date.now(), ...rest };
    this.#reset();
    this.last = summary;
    this.recent = [summary, ...this.recent].slice(0, RECENT);
    try {
      Promise.resolve(this.onSummary?.(summary)).catch(error => console.error('onAuthSummary error:', error));
    } catch (error) {
      console.error('onAuthSummary error:', error);
    }
    return summary
  }

  close() {
    this.#reset();
  }
}

/** One log line for a summary: `[auth] fail 2026-11-25T10:00:00Z +10m 45: no_id 42, ... | ip ... | id ...` */
function formatAuthSummary(s) {
  const pairs = list => list.map(([k, n]) => `${k}×${n}`).join(' ');
  const minutes = Math.max(1, Math.round((s.until - s.since) / 60000));
  return `[auth] fail ${new Date(s.since).toISOString().slice(0, 19)}Z +${minutes}m ${s.total}: ` +
    Object.entries(s.kinds).map(([k, n]) => `${k} ${n}`).join(', ') +
    ` | ip(${s.ips}) ${pairs(s.topIps)} | id(${s.ids}) ${pairs(s.topIds)}`
}

function validateDuplicateLogin(policy) {
  if (!DUPLICATE_LOGIN_POLICIES.includes(policy)) {
    throw new RangeError(`duplicateLogin must be one of: ${DUPLICATE_LOGIN_POLICIES.join(', ')}`)
  }
  return policy
}

// Connection roles, lowest to highest: what a connection may do. Its quota is separate.
// 'anonymous' is the role of every connection until it authenticates.
const ROLES = ['anonymous', 'device', 'service', 'admin'];

/** Role of a login: the account's role, 'device' when it has none; undefined if unknown. */
function resolveRole(role) {
  if (role === undefined || role === null || role === '') return 'device'
  return ROLES.includes(role) && role !== 'anonymous' ? role : undefined
}

/** True if the remote is authenticated with this role or a higher one ('anonymous': always). */
function hasRole(remote, role) {
  const wanted = ROLES.indexOf(role);
  if (wanted < 0) throw new RangeError(`role must be one of: ${ROLES.join(', ')}`)
  if (wanted === 0) return true
  return remote?.boho?.isAuthorized === true && ROLES.indexOf(remote.role) >= wanted
}

/** Default quota profile of a login: the account's quota, else 'basic' for a device, 'unlimited' otherwise. */
function defaultQuota(authInfo, role) {
  return authInfo.quota || (role === 'device' ? 'basic' : 'unlimited')
}

class BohoAuth {
  /**
   * @param {object} keyProvider
   * @param {{ duplicateLogin?: 'keepOld' | 'keepNew', onAuthEvent?: (event: object) => any,
   *   onAuthSummary?: (summary: object) => any, summaryMs?: number,
   *   fileLog?: false | { path?: string, level?: 'normal' | 'all', maxBytes?: number, keep?: number },
   *   resolveQuota?: (authInfo: object, role: string) => string | Promise<string> }} [options]
   *   duplicateLogin: unset follows serverOption.auth.duplicateLogin (default 'keepNew').
   *   A Server's duplicateLogin option takes precedence for that Server's connections.
   *   onAuthEvent: called with { type, did, cid, uid, ip, oldIp, socketType, oldSocketType, reason, at }
   *   for 'replaced' (keepNew evicted the old connection) and 'duplicate_rejected' (keepOld), and
   *   { type: 'auth_fail', did, cid, uid, ip, socketType, reason: kind, at } for a failed login of an
   *   ID that has an owner (authInfo.uid; kind from authFailKind, e.g. 'wrong_key'). An unknown ID
   *   has no event: it is only counted in the summary.
   *   socketType/oldSocketType are 'websocket' or 'congsocket'.
   *   Errors and rejected promises are logged and never affect authentication.
   *   resolveQuota: name of the Server quota profile for a login (default: defaultQuota), e.g. from
   *   the account owner's plan. An unknown name fails the login.
   *   onAuthSummary: called with each failed-login summary { seq, since, until, total, kinds, ips, topIps,
   *   ids, topIds } (default: one console line, formatAuthSummary). summaryMs: its window, default
   *   serverOption.auth.summaryMs; 0 turns it off.
   *   fileLog: the auth file log of this instance, JSON Lines with { at, event, ... }: 'ok' (login,
   *   with id, cid, role, uid), 'fail' (kind, id, cid when known), 'block' (an address blocked),
   *   'summary', 'unavailable'; at level 'all' also 'fail' for unknown IDs and bad packets and
   *   'blocked' (an attempt from a blocked address). Never a key. Without it,
   *   serverOption.fileLogger.auth applies when its use is true; false turns it off here.
   */
  constructor(keyProvider, options = {}) {
    if (!keyProvider) {
      throw new Error('BohoAuth must be initialized with a keyProvider.');
    }
    this.keyProvider = keyProvider;
    this._duplicateLogin = null;
    if (options.duplicateLogin !== undefined) this.duplicateLogin = options.duplicateLogin;
    this.onAuthEvent = options.onAuthEvent ?? null;
    this.resolveQuota = options.resolveQuota ?? defaultQuota;
    this.addressFailures = new Map(); // public address -> { count, since } of wrong logins
    // Failed logins per window (serverOption.auth.summaryMs, or options.summaryMs). Reported to
    // options.onAuthSummary(summary), else as one console line; the last one is failureSummary.last.
    this.onAuthSummary = options.onAuthSummary ?? (summary => console.log(formatAuthSummary(summary)));
    this.failureSummary = new AuthFailureSummary({
      windowMs: () => options.summaryMs ?? serverOption.auth.summaryMs,
      onSummary: summary => {
        this.#fileLog({ event: 'summary', ...summary });
        this.onAuthSummary?.(summary);
      }
    });
    // Auth file log (JSON Lines): options.fileLog { path, level, maxBytes, keep }, false for none;
    // without it serverOption.fileLogger.auth when its use is true.
    const fileLog = options.fileLog !== undefined ? options.fileLog
      : serverOption.fileLogger.auth.use ? serverOption.fileLogger.auth : null;
    this.authLogLevel = fileLog?.level === 'all' ? 'all' : 'normal';
    this.authLogger;
    if (fileLog) {
      this.authLogger = new JsonLinesLogger(fileLog.path ?? 'auth.log', fileLog);
      console.log(`Auth: file log ${this.authLogger.path} (${this.authLogLevel})`);
    }
  }

  // One auth log record (never a key). 'all' records are written only at level 'all'.
  #fileLog(record, all = false) {
    if (!this.authLogger || (all && this.authLogLevel !== 'all')) return
    this.authLogger.write(record);
  }

  // Who a record is about: connection number, address, transport.
  #peerOf(peer) {
    return { ssid: peer.ssid, ip: peer.ip, transport: transportOf(peer) }
  }

  /** Effective duplicate login policy: this instance's setting, else serverOption.auth.duplicateLogin. */
  get duplicateLogin() {
    return this._duplicateLogin ?? serverOption.auth.duplicateLogin;
  }

  /** @param {'keepOld' | 'keepNew' | null} policy  null returns to the serverOption default. */
  set duplicateLogin(policy) {
    this._duplicateLogin = policy === null ? null : validateDuplicateLogin(policy);
  }

  /** Policy for a connection: its Server's duplicateLogin option, else this instance's policy. */
  duplicateLoginFor(peer) {
    return peer.manager?.server?.duplicateLogin ?? this.duplicateLogin;
  }

  // Backward-compatible boolean form of duplicateLogin.
  get keepOldConnection() {
    return this.duplicateLogin === 'keepOld';
  }

  set keepOldConnection(keepOld) {
    this.duplicateLogin = keepOld ? 'keepOld' : 'keepNew';
  }

  emitAuthEvent(event) {
    if (typeof this.onAuthEvent !== 'function') return;
    try {
      Promise.resolve(this.onAuthEvent(event)).catch(error => console.error('onAuthEvent error:', error));
    } catch (error) {
      console.error('onAuthEvent error:', error);
    }
  }

  // Wrong logins of a public address in the current window (see serverOption.auth).
  #addressEntry(ip, now = Date.now()) {
    if (typeof ip !== 'string' || !ip || isPrivateIP(ip)) return null
    let entry = this.addressFailures.get(ip);
    if (entry && now - entry.since >= serverOption.auth.failureWindowMs) {
      this.addressFailures.delete(ip);
      entry = undefined;
    }
    return entry ?? { count: 0, since: now, fresh: true }
  }

  /** Addresses blocked now: [{ ip, count, until }], most wrong logins first (at most limit). */
  blockedAddresses(limit = 100, now = Date.now()) {
    const list = [];
    for (const [ip, entry] of this.addressFailures) {
      const until = entry.since + serverOption.auth.failureWindowMs;
      if (until > now && entry.count >= serverOption.auth.maxFailuresPerAddress) list.push({ ip, count: entry.count, until });
    }
    return list.sort((a, b) => b.count - a.count).slice(0, limit)
  }

  /** True while this address has too many wrong logins: its logins are closed without a check. */
  addressBlocked(ip) {
    const entry = this.#addressEntry(ip);
    return !!entry && entry.count >= serverOption.auth.maxFailuresPerAddress
  }

  #countFailure(peer) {
    peer.authFailures = (peer.authFailures ?? 0) + 1;
    const entry = this.#addressEntry(peer.ip);
    if (!entry) return
    if (entry.fresh) {
      delete entry.fresh;
      // Bounded: forget windows that have passed before adding another address.
      if (this.addressFailures.size >= 10000) {
        const now = Date.now();
        for (const [ip, e] of this.addressFailures) if (now - e.since >= serverOption.auth.failureWindowMs) this.addressFailures.delete(ip);
        if (this.addressFailures.size >= 10000) this.addressFailures.clear();
      }
      this.addressFailures.set(peer.ip, entry);
    }
    entry.count++;
    if (entry.count === serverOption.auth.maxFailuresPerAddress) {
      const seconds = Math.round((entry.since + serverOption.auth.failureWindowMs - Date.now()) / 1000);
      console.log(`[auth] ${peer.ip} blocked for ${Math.max(0, seconds)}s: ${entry.count} wrong logins`);
      this.#fileLog({ event: 'block', ip: peer.ip, count: entry.count, seconds: Math.max(0, seconds) });
    }
  }

  // countFailure: a wrong ID or key (not a refusal of a valid key, such as a duplicate login).
  // login: { id, authInfo } when known. The failure is counted in the summary, and for an ID with
  // an owner (authInfo.uid) reported as an 'auth_fail' event (a duplicate login has its own event).
  send_auth_fail(peer, reason, countFailure = false, login = null) {
    if (peer._closing || peer.state === STATE.CLOSED) return;
    peer.boho.isAuthorized = false;
    if (countFailure) this.#countFailure(peer);
    const kind = authFailKind(reason);
    this.failureSummary.add(kind, peer.ip, login?.id);
    const authInfo = login?.authInfo;
    if (authInfo?.uid && kind !== 'duplicate') {
      this.emitAuthEvent({
        type: 'auth_fail', did: login.id, cid: authInfo.cid, uid: authInfo.uid,
        ip: peer.ip, socketType: transportOf(peer), reason: kind, at: Date.now()
      });
    }
    const lastTry = countFailure && peer.authFailures >= serverOption.auth.maxFailuresPerConnection;
    // A known ID always (someone has or guesses a real ID); an unknown one only at level 'all'.
    const failRecord = { event: 'fail', kind, ...this.#peerOf(peer) };
    if (login?.id !== undefined) failRecord.id = cleanId(login.id);
    if (authInfo?.cid) failRecord.cid = authInfo.cid;
    this.#fileLog(failRecord, !authInfo);
    // console.log('##### AUTH_FAIL reason: ', reason)
    peer.setState(STATE.AUTH_FAIL);
    if (!lastTry) this.#closeLater(peer);
    // add some delay time.
    setTimeout(e => {
      if (!peer._closing && peer.state === STATE.AUTH_FAIL) {
        peer.send(Buffer.from([mt.BohoMsg.AUTH_FAIL]));
        // Too many wrong logins on this connection: it has to connect again to go on.
        if (lastTry) peer.close();
      }
    }, serverOption.auth.failDelay);
  }


  // A refused connection left without a CID is closed after serverOption.auth.failCloseMs, unless
  // it logs in or goes on anonymously meanwhile (its state is then no longer AUTH_FAIL).
  #closeLater(peer) {
    const ms = serverOption.auth.failCloseMs;
    if (!(ms > 0)) return
    clearTimeout(peer._authFailCloseTimer);
    peer._authFailCloseTimer = setTimeout(() => {
      peer._authFailCloseTimer = null;
      if (!peer._closing && peer.state === STATE.AUTH_FAIL) peer.close();
    }, ms);
    peer._authFailCloseTimer.unref?.();
  }

  /**
   * A Boho 2.x login request (an IOSignal 9.x client): answered with AUTH_FAIL, counted in the
   * summary as 'boho2_client' and closed after failCloseMs like any refused login.
   */
  refuseClassic(peer) {
    if (peer._closing || peer.state === STATE.CLOSED) return;
    peer.boho.isAuthorized = false;
    this.failureSummary.add('boho2_client', peer.ip);
    this.#fileLog({ event: 'fail', kind: 'boho2_client', ...this.#peerOf(peer) }, true);
    peer.setState(STATE.AUTH_FAIL);
    peer.send(Buffer.from([mt.BohoMsg.AUTH_FAIL]));
    this.#closeLater(peer);
  }

  // The login could not be checked (key store unreachable): not an answer about the key. The
  // connection is closed, so the client connects and logs in again, instead of AUTH_FAIL, which
  // clients take as "wrong key" and do not retry.
  close_unavailable(peer, reason) {
    if (peer._closing || peer.state === STATE.CLOSED) return;
    console.error('BohoAuth: login not checked, closing the connection:', reason);
    this.failureSummary.add('unavailable', peer.ip);
    this.#fileLog({ event: 'unavailable', ...this.#peerOf(peer), reason: String(reason).slice(0, 200) });
    peer.boho.isAuthorized = false;
    peer.close();
  }

  /**
   * Hook for a subclass: decide where a verified login belongs before it is accepted.
   * Called after the key and role checks, before quotas and the duplicate login check.
   * Return null to accept the login here, or a message (e.g. SERVER_REDIRECT) that is sent to the
   * client instead of AUTH_RES before the connection is closed. The default accepts every login.
   * @param {object} peer the connection
   * @param {object} authInfo the key provider's entry for the login ID (cid, uid, role, quota, ...)
   * @param {string} role resolved role
   * @param {string} id login ID
   * @returns {Promise<Uint8Array | null> | Uint8Array | null}
   */
  beforeAccept(peer, authInfo, role, id) {
    return null
  }

  // An error in the hook accepts the login: placement must never lock clients out.
  async #beforeAcceptSafe(peer, authInfo, role, id) {
    try {
      const result = await this.beforeAccept(peer, authInfo, role, id);
      return result instanceof Uint8Array && result.byteLength > 0 ? result : null
    } catch (error) {
      console.error('BohoAuth.beforeAccept error:', error);
      return null
    }
  }

  async verify_auth_req(auth_req, peer) {
    try {
      if (!peer.checkAuthChallenge()) return;
      if (!(auth_req instanceof Uint8Array) || auth_req.length !== mt.MetaSize.AUTH_REQ ||
          auth_req[0] !== mt.BohoMsg.AUTH_REQ) {
        this.failureSummary.add('bad_packet', peer.ip);
        this.#fileLog({ event: 'fail', kind: 'bad_packet', ...this.#peerOf(peer) }, true);
        peer.securityMismatch('INVALID_AUTH_PACKET');
        return;
      }
      //1. the login ID: bytes 1..8
      let infoPack = { id8: auth_req.subarray(1, 9) };
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

      // Too many wrong logins from this address: not checked until its window has passed.
      // Counted in the summary only: no line per attempt (its start is logged once, #countFailure).
      if (this.addressBlocked(peer.ip)) {
        this.failureSummary.add('blocked', peer.ip, id);
        this.#fileLog({ event: 'blocked', ...this.#peerOf(peer), id: cleanId(id) }, true);
        peer.boho.isAuthorized = false;
        peer.close();
        return
      }

      //2. get key of id from DB
      let authInfo;
      try {
        authInfo = await this.keyProvider.getAuth(id);
      } catch (error) {
        this.close_unavailable(peer, 'key provider: ' + (error?.message ?? error));
        return
      }
      if (!peer.checkAuthChallenge()) return;
      if (!authInfo) {
        this.send_auth_fail(peer, 'NO ID:' + id, true, { id, authInfo });
        return
      }

      // Never the key: debug output ends up in shared logs.
      if (serverOption.debug.showAuthInfo) {
        console.log('[debug]showAuthInfo', { id, cid: authInfo.cid, uid: authInfo.uid, role: authInfo.role, quota: authInfo.quota });
      }

      //3. check the proof with the stored key (Boho 3, Ascon)
      const key = authInfo.key;
      if (typeof key !== 'string' || !key) {
        this.send_auth_fail(peer, 'NO KEY:' + id, true, { id, authInfo });
        return
      }
      if (key.length === CLASSIC_HASH_LENGTH) {
        // A Boho 2.x (SHA-256) key hash: the ID was registered before Boho 3 and its key must be set again.
        this.send_auth_fail(peer, 'BOHO 2.x KEY, SET IT AGAIN:' + id, true, { id, authInfo });
        return
      }
      if (STORED_KEY.test(key)) peer.boho.copy_key(Buffer.from(key, 'base64'));
      else peer.boho.set_key(key); // a provider that keeps the plain key
      let auth_res = peer.boho.verify_auth_req(auth_req);
      if (!auth_res) {
        this.send_auth_fail(peer, 'hmac dismatched', true, { id, authInfo });
        return
      }

      // A valid proof consumes this challenge even if account policy rejects it.
      // Reauthentication requires a new connection, never a replay-state reset.
      peer._challengeUsed = true;

      //4. role and quota. Checked before a duplicate login replaces the old connection.
      const role = resolveRole(authInfo.role);
      if (role === undefined) {
        this.send_auth_fail(peer, 'unknown auth.role: ' + authInfo.role, false, { id, authInfo });
        return
      }
      // A login another server should take (beforeAccept) goes there before it is counted here or
      // replaces a connection here.
      const redirect = await this.#beforeAcceptSafe(peer, authInfo, role, id);
      if (peer._closing) return; // closed while deciding
      if (redirect) {
        peer.boho.isAuthorized = false;
        peer.send(redirect);
        peer.close();
        return
      }
      let quotaName;
      try {
        quotaName = await this.resolveQuota(authInfo, role);
      } catch (error) {
        this.close_unavailable(peer, 'quota: ' + (error?.message ?? error));
        return
      }
      const quota = Object.hasOwn(peer.manager.quotas, quotaName) ? peer.manager.quotas[quotaName] : undefined;
      if (!quota) {
        this.send_auth_fail(peer, 'unknown quota: ' + quotaName, false, { id, authInfo });
        return
      }
      if (peer._closing) return; // closed while resolving
      const uid = authInfo.uid || null;
      if (uid && quota.maxConnections !== null) {
        // A connection this login replaces (keepNew) frees its place.
        const old = peer.manager.cid2remote.get(authInfo.cid);
        const replaced = old && old !== peer && old.accountUid === uid && this.duplicateLoginFor(peer) === 'keepNew' ? 1 : 0;
        if (peer.manager.accountConnections(uid) - replaced >= quota.maxConnections) {
          this.send_auth_fail(peer, 'too many connections', false, { id, authInfo });
          return
        }
      }

      //5. check duplicate login.
      if (peer.manager.cid2remote.has(authInfo.cid) && peer.manager.cid2remote.get(authInfo.cid) !== peer) {
        let old = peer.manager.cid2remote.get(authInfo.cid);
        console.log('[WARN]DUPLICATE_LOGIN detected.', old.cid);
        old.ping(); // check the connection.

        let authClearSignal = $$1.pack(
          $$1.MB('#MsgType', '8', IOMsg.AUTH_CLEAR),
          $$1.MB('#reason', 'duplicate login.')
        );
        const keepOld = this.duplicateLoginFor(peer) === 'keepOld';
        if (keepOld) {
          peer.boho.isAuthorized = false;
          // keep old connection. reject new connection by sending auth_fail signal.
          // peer.send(authClearSignal)
          if( peer.socketType == 'websocket'){
            this.send_auth_fail(peer, 'duplicate login', false, { id });
          }else {
            peer.setState(STATE.AUTH_FAIL);
            peer.close(); //arduino 
          }
        } else {
          // accept new connection. stop the old connection by sending auth_clear signal.
          old.send(authClearSignal);
          old.close();
        }
        this.emitAuthEvent({
          type: keepOld ? 'duplicate_rejected' : 'replaced',
          did: id, cid: authInfo.cid, uid: authInfo.uid || null,
          ip: peer.ip, oldIp: old.ip,
          socketType: transportOf(peer), oldSocketType: transportOf(old),
          reason: 'duplicate login', at: Date.now()
        });
        if (keepOld) return
      }

      //6. delete current (or anonymouse)cid if exist.
      if (peer.cid && peer.cid !== authInfo.cid) {
        // Subscribers of the CID it had (an anonymous one, before login()) are told it is gone, as when
        // a connection closes. Sent to them only: nothing is retained under the new CID.
        const manager = peer.manager;
        for (const topic of ['@state', '@$state']) {
          const tag = peer.cid + topic;
          manager.deliver(manager.CID_PREFIX + tag, getSignalPack(tag, 'close'), null);
        }
        // What it retained carries the old CID in its tag: dropped, the device publishes again when ready.
        for (const message of peer.retain_signal.values()) manager.retainBytes -= message.byteLength;
        peer.retain_signal.clear();
        peer.retainBytes = 0;
        manager.cid2remote.delete(peer.cid);
      }

      //7. setting info.
      peer.did = id;
      peer.cid = authInfo.cid;
      if (authInfo.uid) peer.uid = authInfo.uid;
      // Delivery policy of an owned device, in place before the CID is reachable (step 9).
      peer.ownerUid = uid;
      peer.rxPolicy = compileDeliveryPolicy(authInfo.rxPolicy, uid);

      //8. role and quota; the client is told its quota.
      peer.role = role;
      if (role === 'admin') console.log('## LOGIN ADMIN CID:', peer.cid);
      if (uid) peer.manager.addAccountConnection(peer, uid);
      peer.setQuota(quotaName, true);

      //9. set cid2remote
      peer.manager.cid2remote.set(peer.cid, peer);
      //10. send ack.
      peer.send(auth_res);
      peer.setState(STATE.AUTH_RES);
      this.#fileLog({ event: 'ok', ...this.#peerOf(peer), id: cleanId(id), cid: peer.cid, role, ...(uid && { uid }) });
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

  async addAuth(id, keyStr, cid, role, quota) {
    if (typeof this.keyProvider.addAuth === 'function') {
      return this.keyProvider.addAuth(id, keyStr, cid, role, quota);
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

// The dashboard web page, kept as a string so it ships inside the package (no CDN, works offline).
// No backticks or template placeholders inside: the page is plain HTML, CSS and ES5-ish JavaScript.
const PAGE = String.raw`<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>IOSignal Dashboard</title>
<style>
:root {
  --bg: #f3f5fa; --panel: #ffffff; --ink: #172036; --muted: #5f6a85; --line: #dde3ef; --grid: #e9edf5;
  --a: #0ea5a0; --b: #4f6bed; --c: #f59e0b; --d: #e5484d; --e: #8b5cf6; --ok: #22b573;
  --mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  --sans: system-ui, -apple-system, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif;
  color-scheme: light;
}
@media (prefers-color-scheme: dark) {
  :root { --bg: #0d1220; --panel: #151c30; --ink: #e6ebf7; --muted: #8e99b8; --line: #263050; --grid: #1d2640;
    --a: #2dd4bf; --b: #7c93ff; --c: #fbbf24; --d: #ff6b6b; --e: #a78bfa; --ok: #34d399; color-scheme: dark; }
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--ink); font: 14px/1.5 var(--sans); }
header { position: sticky; top: 0; z-index: 5; display: flex; flex-wrap: wrap; gap: 10px 16px; align-items: center;
  padding: 10px max(16px, env(safe-area-inset-left)); background: color-mix(in srgb, var(--bg) 88%, transparent);
  backdrop-filter: blur(8px); border-bottom: 1px solid var(--line); }
h1 { font-size: 16px; margin: 0; letter-spacing: .01em; }
h1 b { color: var(--a); }
.pill { font: 600 12px var(--mono); padding: 3px 10px; border-radius: 99px; background: var(--grid); color: var(--muted); }
.pill.live { background: color-mix(in srgb, var(--ok) 18%, transparent); color: var(--ok); }
.pill.live::before { content: ""; display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: var(--ok); margin-right: 6px; animation: blink 1.2s infinite; }
.pill.bad { background: color-mix(in srgb, var(--d) 18%, transparent); color: var(--d); }
@keyframes blink { 50% { opacity: .25; } }
.meta { font: 12px var(--mono); color: var(--muted); }
.chips { display: flex; flex-wrap: wrap; gap: 6px; margin-left: auto; }
.chip { font: 600 12px var(--sans); border: 1px solid var(--line); background: var(--panel); color: var(--muted); border-radius: 99px; padding: 4px 11px; cursor: pointer; }
.chip[aria-pressed="true"] { background: var(--ink); color: var(--panel); border-color: var(--ink); }
.chip:focus-visible, button:focus-visible, input:focus-visible { outline: 2px solid var(--a); outline-offset: 2px; }
main { padding: 16px max(16px, env(safe-area-inset-left)) 40px; display: grid; gap: 14px; grid-template-columns: repeat(12, minmax(0, 1fr)); }
section.panel { background: var(--panel); border: 1px solid var(--line); border-radius: 14px; padding: 14px 16px; min-width: 0; display: grid; gap: 10px; align-content: start; }
section.panel h2 { font-size: 13px; margin: 0; color: var(--muted); font-weight: 700; letter-spacing: .06em; text-transform: uppercase; display: flex; gap: 8px; align-items: baseline; }
section.panel h2 small { text-transform: none; letter-spacing: 0; font-weight: 500; font-family: var(--mono); }
.w12 { grid-column: span 12; } .w8 { grid-column: span 8; } .w6 { grid-column: span 6; } .w4 { grid-column: span 4; }
@media (max-width: 1100px) { .w8, .w4 { grid-column: span 12; } .w6 { grid-column: span 12; } }
.gauges { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
@media (max-width: 640px) { .gauges { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
.gauge { display: grid; justify-items: center; gap: 2px; }
.gauge canvas { width: 100%; max-width: 150px; aspect-ratio: 1.45; }
.gauge span { font-size: 12px; color: var(--muted); }
canvas.chart { width: 100%; height: 150px; display: block; }
canvas.chart.tall { height: 190px; }
.legend { display: flex; flex-wrap: wrap; gap: 12px; font: 12px var(--mono); color: var(--muted); }
.legend i { display: inline-block; width: 10px; height: 3px; border-radius: 2px; margin-right: 5px; vertical-align: middle; }
.stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(118px, 1fr)); gap: 8px; }
.stat { border: 1px solid var(--line); border-radius: 10px; padding: 8px 10px; display: grid; gap: 2px; }
.stat b { font: 700 20px var(--mono); font-variant-numeric: tabular-nums; }
.stat span { font-size: 12px; color: var(--muted); }
.stat.flash { animation: flash .8s ease-out; }
@keyframes flash { from { background: color-mix(in srgb, var(--d) 30%, transparent); } }
.hosts { display: grid; grid-template-columns: repeat(auto-fit, minmax(270px, 1fr)); gap: 12px; }
.host { border: 1px solid var(--line); border-radius: 12px; padding: 12px; display: grid; gap: 8px; position: relative; overflow: hidden; }
.host header { all: unset; display: flex; align-items: center; gap: 8px; }
.host h3 { margin: 0; font: 700 15px var(--mono); }
.pulse { width: 12px; height: 12px; border-radius: 50%; background: var(--a); box-shadow: 0 0 0 0 color-mix(in srgb, var(--a) 60%, transparent); }
.host .big { font: 800 30px var(--mono); line-height: 1; font-variant-numeric: tabular-nums; }
.host .row { display: flex; flex-wrap: wrap; gap: 4px 14px; font: 12px var(--mono); color: var(--muted); }
.host .row b { color: var(--ink); font-weight: 600; }
.host canvas { width: 100%; height: 56px; display: block; }
.shield { position: absolute; right: 10px; top: 10px; font: 700 11px var(--mono); color: var(--d); opacity: 0; transition: opacity .3s; }
.shield.on { opacity: 1; }
.loop { display: grid; gap: 6px; }
.bar { height: 10px; border-radius: 6px; background: var(--grid); position: relative; overflow: hidden; }
.bar > i { position: absolute; inset: 0 auto 0 0; border-radius: 6px; background: var(--a); transition: width .4s; }
.bar > em { position: absolute; top: -2px; bottom: -2px; width: 2px; background: var(--ink); opacity: .6; }
.kv { display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 6px; }
.kv div { background: var(--grid); border-radius: 8px; padding: 6px 9px; display: grid; }
.kv span { font-size: 11px; color: var(--muted); } .kv b { font: 700 16px var(--mono); overflow-wrap: anywhere; }
.table { overflow-x: auto; }
table { border-collapse: collapse; width: 100%; font: 12.5px var(--mono); }
th, td { padding: 6px 8px; border-bottom: 1px solid var(--line); text-align: left; white-space: nowrap; }
th { color: var(--muted); font-weight: 600; font-family: var(--sans); }
.act { display: inline-block; height: 8px; border-radius: 4px; background: var(--b); vertical-align: middle; min-width: 2px; }
.badge { font-size: 11px; padding: 1px 6px; border-radius: 6px; background: var(--grid); color: var(--muted); }
.badge.auth { background: color-mix(in srgb, var(--ok) 20%, transparent); color: var(--ok); }
.events { list-style: none; margin: 0; padding: 0; display: grid; gap: 4px; max-height: 340px; overflow: auto; font: 12.5px var(--mono); }
.events li { display: flex; gap: 8px; align-items: baseline; padding: 4px 6px; border-radius: 6px; animation: slide .5s ease-out; }
@keyframes slide { from { background: color-mix(in srgb, var(--a) 22%, transparent); transform: translateX(-6px); } }
.events time { color: var(--muted); }
.k { font: 700 11px var(--sans); padding: 1px 7px; border-radius: 6px; }
.k.join { background: color-mix(in srgb, var(--ok) 22%, transparent); color: var(--ok); }
.k.leave { background: var(--grid); color: var(--muted); }
.k.denied { background: color-mix(in srgb, var(--d) 22%, transparent); color: var(--d); }
.k.error { background: color-mix(in srgb, var(--c) 25%, transparent); color: var(--c); }
.empty { color: var(--muted); font-size: 13px; padding: 6px 0; }
.overlay { position: fixed; inset: 0; z-index: 10; display: grid; place-items: center; background: color-mix(in srgb, var(--bg) 80%, transparent); backdrop-filter: blur(6px); padding: 16px; }
.overlay form { background: var(--panel); border: 1px solid var(--line); border-radius: 16px; padding: 20px; width: min(360px, 100%); display: grid; gap: 10px; box-shadow: 0 20px 50px rgba(0,0,0,.2); }
.overlay h2 { margin: 0; font-size: 18px; }
.overlay input { padding: 9px 11px; border-radius: 9px; border: 1px solid var(--line); background: var(--bg); color: var(--ink); font: 14px var(--mono); }
.overlay button { padding: 10px; border: 0; border-radius: 10px; background: var(--a); color: #fff; font-weight: 700; cursor: pointer; }
.overlay p { margin: 0; color: var(--muted); font-size: 13px; }
.overlay .err { color: var(--d); }
.links { display: flex; gap: 6px; }
.links a { font-size: 13px; color: var(--b); text-decoration: none; padding: 3px 8px; border-radius: 6px; }
.links a:hover { background: var(--grid); }
td a { color: var(--b); }
.exposed { flex-basis: 100%; margin: 0; padding: 6px 10px; border-radius: 8px; font-size: 13px;
  background: color-mix(in srgb, var(--c) 18%, transparent); color: var(--ink); }
[hidden] { display: none !important; }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
</style>
</head>
<body>
<header>
  <h1><b>IOSignal</b> Dashboard</h1>
  <nav class="links" id="links" aria-label="페이지"></nav>
  <span id="status" class="pill">연결 중</span>
  <span id="meta" class="meta"></span>
  <nav class="chips" id="chips" aria-label="패널"></nav>
  <p id="exposed" class="exposed" role="alert" hidden>누구나 볼 수 있는 대시보드가 공인 주소에서 열렸습니다. 인터넷에 연 서버에서는 토큰이나 로그인 접근을 쓰세요.</p>
</header>
<main id="main">
  <section class="panel w12" data-panel="server">
    <h2>서버 <small id="uptime"></small></h2>
    <div class="gauges">
      <div class="gauge"><canvas id="gCpu"></canvas><span>CPU</span></div>
      <div class="gauge"><canvas id="gEld"></canvas><span>이벤트 루프 지연 p99</span></div>
      <div class="gauge"><canvas id="gElu"></canvas><span>이벤트 루프 사용률</span></div>
      <div class="gauge"><canvas id="gMem"></canvas><span>메모리 (RSS)</span></div>
    </div>
    <canvas class="chart" id="cLoad"></canvas>
    <div class="legend"><span><i style="background:var(--a)"></i>CPU %</span><span><i style="background:var(--c)"></i>지연 p99 ms</span><span><i style="background:var(--e)"></i>연결 수</span></div>
    <div class="stats" id="sConn"></div>
  </section>
  <section class="panel w8" data-panel="traffic">
    <h2>트래픽 <small>초당</small></h2>
    <canvas class="chart tall" id="cMsg"></canvas>
    <div class="legend"><span><i style="background:var(--b)"></i>받은 메시지</span><span><i style="background:var(--a)"></i>보낸 메시지</span><span><i style="background:var(--d)"></i>버린 메시지(쿼터)</span></div>
    <canvas class="chart" id="cBytes"></canvas>
    <div class="legend"><span><i style="background:var(--b)"></i>받은 바이트</span><span><i style="background:var(--a)"></i>보낸 바이트</span></div>
  </section>
  <section class="panel w4" data-panel="traffic">
    <h2>전송 상태</h2>
    <div class="stats" id="sTraffic"></div>
  </section>
  <section class="panel w12" data-panel="hosts">
    <h2>호스트 <small id="hostCount"></small></h2>
    <div class="hosts" id="hosts"></div>
  </section>
  <section class="panel w6" data-panel="game">
    <h2>게임 루프</h2>
    <div id="game" class="loop"></div>
  </section>
  <section class="panel w6" data-panel="events">
    <h2>이벤트 <small>입장 · 퇴장 · 위조 차단 · 오류</small></h2>
    <ul class="events" id="events"></ul>
  </section>
  <section class="panel w12" data-panel="participants">
    <h2>참가자</h2>
    <div class="table" id="players"></div>
  </section>
  <div id="customPanels" style="display:contents"></div>
</main>

<div class="overlay" id="gate" hidden>
  <form id="gateForm">
    <h2 id="gateTitle">대시보드 로그인</h2>
    <p id="gateHelp"></p>
    <input id="gateId" placeholder="ID" autocomplete="username">
    <input id="gateKey" type="password" placeholder="키" autocomplete="current-password">
    <p id="gateErr" class="err" hidden></p>
    <button type="submit">보기</button>
  </form>
</div>

<script>var CONFIG = __CONFIG__;</script>
<script src="__IO__"></script>
<script>
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var css = function (name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); };
  var store = { get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
    sget: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    sset: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} } };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var fmtB = function (n) { n = n || 0; return n >= 1048576 ? (n / 1048576).toFixed(1) + " MB" : n >= 1024 ? (n / 1024).toFixed(1) + " KB" : Math.round(n) + " B"; };
  var fmtN = function (n) { n = n || 0; return n >= 10000 ? (n / 1000).toFixed(1) + "k" : n >= 100 ? Math.round(n) + "" : (Math.round(n * 10) / 10) + ""; };
  var fmtT = function (ms) { var s = Math.floor(ms / 1000), h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60); return (h ? h + "시간 " : "") + m + "분 " + (s % 60) + "초"; };

  // ------------------------------------------------ panels the viewer turns on and off
  var NAMES = { server: "서버", traffic: "트래픽", hosts: "호스트", game: "게임 루프", participants: "참가자", events: "이벤트" };
  var saved = store.get("iosignal.dashboard.panels");
  var shown = saved ? saved.split(",") : CONFIG.panels.slice();
  function applyPanels() {
    var nodes = document.querySelectorAll("[data-panel]");
    for (var i = 0; i < nodes.length; i++) nodes[i].hidden = shown.indexOf(nodes[i].getAttribute("data-panel")) < 0;
    var chips = $("chips").children;
    for (var j = 0; j < chips.length; j++) chips[j].setAttribute("aria-pressed", String(shown.indexOf(chips[j].getAttribute("data-p")) >= 0));
    store.set("iosignal.dashboard.panels", shown.join(","));
    draw();
  }
  Object.keys(NAMES).forEach(function (p) {
    var b = document.createElement("button");
    b.className = "chip"; b.type = "button"; b.textContent = NAMES[p]; b.setAttribute("data-p", p);
    b.onclick = function () { var i = shown.indexOf(p); if (i >= 0) shown.splice(i, 1); else shown.push(p); applyPanels(); };
    $("chips").appendChild(b);
  });

  // ------------------------------------------------ state
  var series = [], latest = null, hosts = [], events = [], info = null, startedAt = 0, hostHist = {};
  var pulses = {};

  // ------------------------------------------------ canvas helpers
  function fit(cv) {
    var r = cv.getBoundingClientRect(), d = Math.min(2, window.devicePixelRatio || 1);
    var w = Math.max(10, Math.round(r.width * d)), h = Math.max(10, Math.round(r.height * d));
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
    var c = cv.getContext("2d"); c.setTransform(d, 0, 0, d, 0, 0);
    return { c: c, w: r.width, h: r.height };
  }
  // Lines over time with a soft area under the first one. lines: [{ values, color, scale? }]
  function chart(cv, lines, opts) {
    if (!cv.offsetParent) return;
    var f = fit(cv), c = f.c, w = f.w, h = f.h, pad = { l: 58, r: 12, t: 8, b: 18 };
    c.clearRect(0, 0, w, h);
    var max = (opts && opts.max) || 1;
    lines.forEach(function (l) { if (!l.own) l.values.forEach(function (v) { if (v > max) max = v; }); });
    max = niceMax(max);
    var n = Math.max(2, CONFIG.history), x0 = pad.l, x1 = w - pad.r, y0 = h - pad.b, y1 = pad.t;
    c.strokeStyle = css("--grid"); c.lineWidth = 1; c.fillStyle = css("--muted"); c.font = "11px " + css("--mono"); c.textAlign = "right";
    for (var g = 0; g <= 3; g++) {
      var y = y0 - (y0 - y1) * g / 3;
      c.beginPath(); c.moveTo(x0, y); c.lineTo(x1, y); c.stroke();
      c.fillText((opts && opts.fmt ? opts.fmt(max * g / 3) : fmtN(max * g / 3)), x0 - 6, y + 4);
    }
    c.textAlign = "left"; c.fillText("-" + Math.round(n / 60) + "분", x0, h - 3); c.textAlign = "right"; c.fillText("지금", x1, h - 3);
    lines.forEach(function (l, li) {
      var v = l.values, m = l.own ? niceMax(Math.max.apply(null, v.concat([1]))) : max;
      if (!v.length) return;
      var X = function (i) { return x1 - (v.length - 1 - i) * (x1 - x0) / (n - 1); };
      var Y = function (val) { return y0 - (y0 - y1) * Math.min(1, (val || 0) / m); };
      c.beginPath();
      for (var i = 0; i < v.length; i++) { var px = X(i), py = Y(v[i]); if (i) c.lineTo(px, py); else c.moveTo(px, py); }
      c.strokeStyle = css(l.color); c.lineWidth = 2; c.lineJoin = "round"; c.stroke();
      if (li === 0) {
        c.lineTo(X(v.length - 1), y0); c.lineTo(X(0), y0); c.closePath();
        var grad = c.createLinearGradient(0, y1, 0, y0);
        grad.addColorStop(0, hexA(css(l.color), 0.28)); grad.addColorStop(1, hexA(css(l.color), 0));
        c.fillStyle = grad; c.fill();
      }
      var lx = X(v.length - 1), ly = Y(v[v.length - 1]);
      c.fillStyle = css(l.color); c.beginPath(); c.arc(lx, ly, 3.5, 0, 6.3); c.fill();
    });
  }
  function niceMax(v) { var p = Math.pow(10, Math.floor(Math.log10(Math.max(v, 1e-9)))); var m = v / p; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * p; }
  function hexA(col, a) {
    if (col.charAt(0) === "#") { var n = parseInt(col.slice(1), 16); return "rgba(" + (n >> 16) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")"; }
    return col;
  }
  // Half-ring gauge with an animated needle value.
  var gaugeNow = {};
  function gauge(id, value, max, label, color) {
    var cv = $(id); if (!cv.offsetParent) return;
    var cur = gaugeNow[id] == null ? value : gaugeNow[id] + (value - gaugeNow[id]) * 0.18;
    gaugeNow[id] = cur;
    var f = fit(cv), c = f.c, w = f.w, h = f.h, r = Math.min(w / 2, h) * 0.86, cx = w / 2, cy = h * 0.9;
    c.clearRect(0, 0, w, h);
    c.lineCap = "round"; c.lineWidth = r * 0.17;
    c.strokeStyle = css("--grid"); c.beginPath(); c.arc(cx, cy, r, Math.PI, 2 * Math.PI); c.stroke();
    var frac = Math.max(0, Math.min(1, cur / max));
    var col = frac > 0.85 ? css("--d") : frac > 0.6 ? css("--c") : css(color);
    c.strokeStyle = col; c.beginPath(); c.arc(cx, cy, r, Math.PI, Math.PI + Math.PI * Math.max(0.01, frac)); c.stroke();
    c.fillStyle = css("--ink"); c.textAlign = "center"; c.font = "700 " + Math.round(r * 0.36) + "px " + css("--mono");
    c.fillText(label(cur), cx, cy - r * 0.2);
  }
  function spark(cv, values, color) {
    if (!cv.offsetParent) return;
    var f = fit(cv), c = f.c, w = f.w, h = f.h; c.clearRect(0, 0, w, h);
    if (!values.length) return;
    var m = niceMax(Math.max.apply(null, values.concat([1]))), n = 60;
    c.beginPath();
    for (var i = 0; i < values.length; i++) {
      var x = w - (values.length - 1 - i) * w / (n - 1), y = h - 3 - (h - 6) * values[i] / m;
      if (i) c.lineTo(x, y); else c.moveTo(x, y);
    }
    c.strokeStyle = css(color); c.lineWidth = 1.8; c.stroke();
    c.lineTo(w, h); c.lineTo(w - (values.length - 1) * w / (n - 1), h); c.closePath();
    c.fillStyle = hexA(css(color), 0.18); c.fill();
  }

  // ------------------------------------------------ render
  function stat(label, value, flash) { return '<div class="stat' + (flash ? " flash" : "") + '"><b>' + value + "</b><span>" + label + "</span></div>"; }
  var prevDropped = 0, prevDenied = {};
  // ------------------------------------------------ panels the server application added (dashboard.panel)
  var cidHref = null, customDefs = [];
  function setCustom(defs) {
    customDefs = defs;
    var box = $("customPanels"), chips = $("chips");
    box.innerHTML = defs.map(function (d) {
      return '<section class="panel w12" data-panel="' + esc(d.id) + '"><h2>' + esc(d.title) + '</h2><div class="table" id="custom-' + esc(d.id) + '"></div></section>';
    }).join("");
    Array.prototype.slice.call(chips.querySelectorAll("[data-custom]")).forEach(function (b) { chips.removeChild(b); });
    defs.forEach(function (d) {
      var b = document.createElement("button");
      b.className = "chip"; b.type = "button"; b.textContent = d.title; b.setAttribute("data-p", d.id); b.setAttribute("data-custom", "");
      b.onclick = function () { var i = shown.indexOf(d.id); if (i >= 0) shown.splice(i, 1); else shown.push(d.id); applyPanels(); };
      chips.appendChild(b);
    });
    applyPanels();
  }
  function renderCustom(rows) {
    customDefs.forEach(function (d) {
      var el = $("custom-" + d.id); if (!el) return;
      var list = rows[d.id] || [];
      el.innerHTML = list.length ? "<table><thead><tr>" + d.columns.map(function (c) { return "<th>" + esc(c) + "</th>"; }).join("") +
        "</tr></thead><tbody>" + list.map(function (r) { return "<tr>" + r.map(function (c) { return "<td>" + esc(c) + "</td>"; }).join("") + "</tr>"; }).join("") +
        "</tbody></table>" : '<p class="empty">없음</p>';
    });
  }
  function render() {
    if (!latest) return;
    var p = latest.point, s = latest.server;
    $("uptime").textContent = "가동 " + fmtT(s.uptime);
    $("meta").textContent = "시청 " + s.own.viewers + "명" + (info ? " · Node " + info.node : "");
    $("sConn").innerHTML = stat("연결", p.conns) + stat("WebSocket", p.ws) + stat("TCP (보드)", p.tcp) + stat("로그인", p.auth) + stat("채널", s.channels);
    var dropped = s.counters.rateLimited + s.counters.oversizeRejected;
    $("sTraffic").innerHTML = stat("버린 메시지 (누적)", fmtN(dropped), dropped > prevDropped) +
      stat("느린 연결", s.txBlockedConnections) + stat("밀린 송신", fmtB(s.queuedBytes)) +
      stat("가장 많이 밀린 연결", fmtB(s.maxQueuedBytes)) + stat("수신 버퍼 초과로 안 보냄", fmtN(s.counters.peerRxLimitSkipped));
    prevDropped = dropped;
    renderHosts();
    renderGame();
    renderPlayers();
  }
  function renderHosts() {
    $("hostCount").textContent = hosts.length ? hosts.length + "개" : "";
    if (!hosts.length) { $("hosts").innerHTML = '<p class="empty">등록된 호스트가 없습니다. server.host()로 게임을 올리면 여기에 나옵니다.</p>'; return; }
    var box = $("hosts");
    hosts.forEach(function (h) {
      var el = box.querySelector('[data-host="' + CSS.escape(h.name) + '"]');
      if (!el) {
        el = document.createElement("div"); el.className = "host"; el.setAttribute("data-host", h.name);
        el.innerHTML = '<header><span class="pulse"></span><h3></h3></header><span class="shield">위조 차단!</span>' +
          '<div><span class="big"></span> <span class="meta">참가자</span></div><canvas></canvas><div class="row"></div>';
        el.querySelector("h3").textContent = h.name;
        box.appendChild(el);
      }
      el.querySelector(".big").textContent = h.participants;
      var r = h.rates;
      el.querySelector(".row").innerHTML = "<span>입력 <b>" + fmtN(r.inbound) + "/s</b></span><span>방송 <b>" + fmtN(r.published) + "/s</b></span>" +
        "<span>1:1 <b>" + fmtN(r.sent) + "/s</b></span><span>처리 <b>" + h.handlerAvgMs.toFixed(2) + "ms</b> (최대 " + h.handlerMaxMs.toFixed(1) + ")</span>" +
        "<span>차단 <b>" + h.totals.denied + "</b></span><span>오류 <b>" + h.totals.errors + "</b></span>";
      var shield = el.querySelector(".shield");
      if ((prevDenied[h.name] || 0) < h.totals.denied) { shield.classList.add("on"); setTimeout(function () { shield.classList.remove("on"); }, 1500); }
      prevDenied[h.name] = h.totals.denied;
      pulses[h.name] = r.inbound;
      spark(el.querySelector("canvas"), (hostHist[h.name] || []).map(function (x) { return x.in || 0; }), "--a");
    });
    Array.prototype.slice.call(box.children).forEach(function (el) {
      if (!hosts.some(function (h) { return h.name === el.getAttribute("data-host"); })) el.remove();
    });
  }
  function renderGame() {
    if (!hosts.length) { $("game").innerHTML = '<p class="empty">호스트가 없습니다.</p>'; return; }
    var html = "";
    hosts.forEach(function (h) {
      html += '<div><b style="font-family:var(--mono)">' + esc(h.name) + "</b></div>";
      if (!h.loops.length) html += '<p class="empty">host.loop(ms, fn)를 쓰면 틱 간격과 처리 시간이 여기에 나옵니다.</p>';
      h.loops.forEach(function (l) {
        var scale = l.intervalMs * 2, gap = Math.min(1, l.gapP99 / scale), target = l.intervalMs / scale;
        html += '<div class="row" style="display:flex;gap:12px;font:12px var(--mono);color:var(--muted)"><span>목표 <b style="color:var(--ink)">' + l.intervalMs + 'ms</b></span><span>틱 간격 p50 <b style="color:var(--ink)">' + l.gapP50.toFixed(1) + '</b> · p99 <b style="color:var(--ink)">' + l.gapP99.toFixed(1) + '</b></span><span>처리 평균 <b style="color:var(--ink)">' + l.stepAvg.toFixed(2) + 'ms</b> · 최대 ' + l.stepMax.toFixed(1) + '</span><span>' + l.ticks + '틱</span></div>' +
          '<div class="bar" title="틱 간격 p99 (선: 목표)"><i style="width:' + (gap * 100).toFixed(1) + '%;background:' + (l.gapP99 > l.intervalMs * 1.5 ? "var(--d)" : l.gapP99 > l.intervalMs * 1.15 ? "var(--c)" : "var(--a)") + '"></i><em style="left:' + (target * 100).toFixed(1) + '%"></em></div>' +
          '<div class="bar" title="처리 시간 / 목표"><i style="width:' + Math.min(100, l.stepAvg / l.intervalMs * 100).toFixed(1) + '%;background:var(--b)"></i></div>';
      });
      var keys = Object.keys(h.report || {});
      if (keys.length) {
        html += '<div class="kv">' + keys.map(function (k) { return "<div><span>" + esc(k) + "</span><b>" + esc(h.report[k]) + "</b></div>"; }).join("") + "</div>";
      } else html += '<p class="empty">host.report({ ... })로 보낸 값이 여기에 나옵니다.</p>';
    });
    $("game").innerHTML = html;
  }
  function renderPlayers() {
    var rows = [];
    hosts.forEach(function (h) { (h.players || []).forEach(function (p) { rows.push([h.name, p]); }); });
    if (!rows.length) { $("players").innerHTML = '<p class="empty">아직 입력을 보낸 참가자가 없습니다.</p>'; return; }
    var max = Math.max.apply(null, rows.map(function (r) { return r[1].inputs; }).concat([1]));
    $("players").innerHTML = "<table><thead><tr><th>호스트</th><th>CID</th><th>이름</th><th>로그인</th><th>입력</th><th>참가</th><th>마지막 입력</th></tr></thead><tbody>" +
      rows.map(function (r) {
        var p = r[1];
        var cid = cidHref ? '<a href="' + esc(cidHref.split("{cid}").join(encodeURIComponent(p.cid))) + '">' + esc(p.cid) + "</a>" : esc(p.cid);
        return "<tr><td>" + esc(r[0]) + "</td><td>" + cid + "</td><td>" + esc(p.name || p.nick || "-") + "</td><td>" +
          (p.authorized ? '<span class="badge auth">로그인</span>' : '<span class="badge">익명</span>') + '</td><td><span class="act" style="width:' + Math.round(80 * p.inputs / max) + 'px"></span> ' + p.inputs +
          "</td><td>" + fmtT(p.since) + "</td><td>" + (p.idle < 1000 ? "방금" : Math.round(p.idle / 1000) + "초 전") + "</td></tr>";
      }).join("") + "</tbody></table>";
  }
  var KIND = { join: "입장", leave: "퇴장", denied: "위조 차단", error: "오류" };
  function addEvents(list, initial) {
    if (!list || !list.length) return;
    var ul = $("events");
    list.forEach(function (e) {
      events.push(e);
      var li = document.createElement("li");
      var t = new Date(e.at);
      var detail = e.kind === "denied" ? (e.cid || "") + " → " + (e.tag || "") : e.kind === "error" ? (e.message || "") : (e.cid || "") + (e.reason ? " (" + e.reason + ")" : "");
      li.innerHTML = "<time>" + t.toLocaleTimeString() + '</time><span class="k ' + e.kind + '">' + (KIND[e.kind] || e.kind) + "</span><span>" + esc(e.host) + "</span><span>" + esc(detail) + "</span>";
      if (initial) li.style.animation = "none";
      ul.insertBefore(li, ul.firstChild);
    });
    while (ul.children.length > 120) ul.removeChild(ul.lastChild);
    if (!ul.children.length) ul.innerHTML = '<li class="empty">아직 이벤트가 없습니다.</li>';
  }

  function draw() {
    var pick = function (k) { return series.map(function (p) { return p[k] || 0; }); };
    chart($("cLoad"), [{ values: pick("cpu"), color: "--a" }, { values: pick("eld"), color: "--c" }, { values: pick("conns"), color: "--e", own: true }], { max: 10 });
    chart($("cMsg"), [{ values: pick("rxMsg"), color: "--b" }, { values: pick("txMsg"), color: "--a" }, { values: pick("dropped"), color: "--d" }], { max: 10 });
    chart($("cBytes"), [{ values: pick("rxB"), color: "--b" }, { values: pick("txB"), color: "--a" }], { max: 1024, fmt: fmtB });
  }
  // Gauges and host pulses move every frame; charts redraw on each sample.
  function frame(t) {
    if (latest) {
      var p = latest.point, total = latest.server.hostTotalBytes || 1;
      gauge("gCpu", p.cpu, 100, function (v) { return Math.round(v) + "%"; }, "--a");
      gauge("gEld", p.eld, 100, function (v) { return v.toFixed(1) + "ms"; }, "--c");
      gauge("gElu", p.elu * 100, 100, function (v) { return Math.round(v) + "%"; }, "--b");
      gauge("gMem", p.rss / 1048576, Math.max(256, Math.min(total / 1048576, 2048)), function (v) { return Math.round(v) + "MB"; }, "--e");
    }
    var dots = document.querySelectorAll(".host");
    for (var i = 0; i < dots.length; i++) {
      var rate = pulses[dots[i].getAttribute("data-host")] || 0;
      var speed = Math.min(8, 0.6 + rate / 8);
      var k = (Math.sin(t / 1000 * speed * Math.PI) + 1) / 2;
      var dot = dots[i].querySelector(".pulse");
      dot.style.boxShadow = rate > 0 ? "0 0 0 " + (k * 7).toFixed(1) + "px " + hexA(css("--a"), 0.35 * (1 - k)) : "none";
      dot.style.background = rate > 0 ? css("--a") : css("--muted");
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  addEventListener("resize", draw);

  // ------------------------------------------------ IOSignal connection
  var io = null, helloTimer = 0, cred = {};
  function status(text, cls) { var el = $("status"); el.textContent = text; el.className = "pill" + (cls ? " " + cls : ""); }
  function connect() {
    if (io) { try { io.destroy(); } catch (e) {} }
    io = new IO();
    if (CONFIG.access === "login" && cred.id) io.auth(cred.id, cred.key);
    io.on("change", function () {
      if (io.stateName !== "ready") status(io.stateName === "closed" ? "연결 끊김" : "연결 중", io.stateName === "closed" ? "bad" : "");
    });
    io.on("ready", function () { hello(); });
    io.on(CONFIG.topic, function (tag, msg) { onMessage(msg); });
    io.open((location.protocol === "https:" ? "wss://" : "ws://") + location.host + CONFIG.ws);
    clearInterval(helloTimer);
    helloTimer = setInterval(hello, 5000);
  }
  function hello() { if (io && io.stateName === "ready") io.signal(CONFIG.tag, { op: "hello", token: cred.token }); }
  function onMessage(m) {
    if (!m || !m.type) return;
    if (m.type === "denied") { status("권한 없음", "bad"); askAccess(true); return; }
    if (m.type === "full") { status("시청자가 가득 찼습니다", "bad"); return; }
    if (m.type === "init") {
      $("gate").hidden = true;
      $("exposed").hidden = !m.publicOpen;
      cidHref = m.cidHref || null;
      $("links").innerHTML = (m.links || []).map(function (l) { return '<a href="' + esc(l.href) + '">' + esc(l.label) + "</a>"; }).join("");
      setCustom(m.custom || []);
      status("실시간", "live");
      info = m.server; startedAt = m.startedAt; series = m.series.slice();
      hostHist = {};
      series.forEach(function (p) { Object.keys(p.hosts || {}).forEach(function (n) { (hostHist[n] = hostHist[n] || []).push(p.hosts[n]); }); });
      $("events").innerHTML = "";
      addEvents(m.events, true);
      if (!saved) { shown = m.panels.concat(customDefs.map(function (d) { return d.id; })); applyPanels(); }
      return;
    }
    if (m.type === "tick") {
      latest = m; hosts = m.hosts;
      renderCustom(m.custom || {});
      series.push(m.point); if (series.length > CONFIG.history) series.shift();
      Object.keys(m.point.hosts || {}).forEach(function (n) { var a = (hostHist[n] = hostHist[n] || []); a.push(m.point.hosts[n]); if (a.length > 60) a.shift(); });
      addEvents(m.events, false);
      render(); draw();
    }
  }
  function askAccess(failed) {
    var gate = $("gate");
    $("gateErr").hidden = !failed; $("gateErr").textContent = failed ? "확인하지 못했습니다. 다시 입력해 주세요." : "";
    if (CONFIG.access === "token") {
      $("gateTitle").textContent = "대시보드 토큰"; $("gateHelp").textContent = "서버 설정의 dashboard.access.token 값을 입력하세요.";
      $("gateId").hidden = true; $("gateKey").placeholder = "토큰";
    } else {
      $("gateTitle").textContent = "대시보드 로그인"; $("gateHelp").textContent = "이 서버에 로그인할 수 있는 ID와 키를 입력하세요(허용된 역할 또는 CID).";
    }
    gate.hidden = false;
    (CONFIG.access === "token" ? $("gateKey") : $("gateId")).focus();
  }
  $("gateForm").addEventListener("submit", function (e) {
    e.preventDefault();
    if (CONFIG.access === "token") { cred = { token: $("gateKey").value }; store.sset("iosignal.dashboard.token", cred.token); hello(); }
    else { cred = { id: $("gateId").value.trim(), key: $("gateKey").value }; connect(); }
  });
  addEventListener("pagehide", function () { if (io && io.stateName === "ready") io.signal(CONFIG.tag, { op: "bye" }); });

  applyPanels();
  addEvents([], true);
  if (CONFIG.access === "token") { var t = store.sget("iosignal.dashboard.token") || new URLSearchParams(location.search).get("key"); if (t) cred = { token: t }; }
  connect();
  if (CONFIG.access === "login" || (CONFIG.access === "token" && !cred.token)) askAccess(false);
})();
</script>
</body>
</html>`;

/** The page with its settings: { io, ws, access, panels, history, tag, topic }. */
function dashboardPage(config) {
  const json = JSON.stringify(config).replace(/</g, '\\u003c');
  return PAGE.replace('__CONFIG__', json).replace('__IO__', config.io.replace(/"/g, ''))
}

/** Tags of the dashboard's own host. Viewers send to IN; the host sends to one viewer as '@' + TOPIC. */
const DASHBOARD = { HOST: 'iosignal.dashboard', IN: 'iosignal.dashboard#in', TOPIC: 'iosignal.dashboard' };
const DASHBOARD_PANELS = ['server', 'traffic', 'hosts', 'game', 'participants', 'events'];

const IO_BUNDLE = new URL('../../dist/browser/iife/io.js', import.meta.url);
const VIEWER_TTL_MS = 15000;
const PARTICIPANT_LIMIT = 60;
const PANEL_ROWS = 100;      // rows of an added panel sent each second
const PANEL_CELL = 200;      // characters of one cell
const SAFE_PATH = /^\/[A-Za-z0-9._~\-/#?=&%]*$/;
const sha = (s) => createHash('sha256').update(String(s)).digest();

/**
 * The server dashboard: a web page (options.path) that shows the server and its hosts live.
 * It talks to the page through IOSignal itself: viewers send 'hello' to DASHBOARD.IN, a host checks
 * access, and every second it sends the latest sample to each viewer with host.to().
 *
 * options (all optional):
 *   path:           '/dashboard'
 *   access:         'open' | { token: '...' } | { login: { roles: ['admin'], cids: [] } }
 *   panels:         panels shown first (DASHBOARD_PANELS); viewers can switch them
 *   history:        seconds kept for the charts (default 300, 10-3600)
 *   maxViewers:     default 20
 *   showIdentities: show participant CIDs and names (default: true unless access is 'open')
 *   links:          [{ label, href }] links in the page header to other pages of the server, e.g.
 *                   [{ label: 'Devices', href: '/' }]; href is a path on this server
 *   cidHref:        a path with {cid} that a shown CID links to, e.g. '/#{cid}' (needs showIdentities)
 *
 * dashboard.panel(id, { title, columns, rows }) adds a table of the application's own data, such as
 * the processes it runs; rows() is called once a second while someone watches.
 */
class Dashboard {
  constructor(server, options = {}) {
    if (options === true) options = {};
    if (options === null || typeof options !== 'object') throw new TypeError('dashboard options must be an object or true')
    for (const key of Object.keys(options)) {
      if (!['path', 'access', 'panels', 'history', 'maxViewers', 'showIdentities', 'links', 'cidHref'].includes(key)) {
        throw new TypeError(`unknown dashboard option: ${key}`)
      }
    }
    const path = options.path ?? '/dashboard';
    if (typeof path !== 'string' || !/^\/[A-Za-z0-9._~\-/]*$/.test(path) || path.length > 64) {
      throw new TypeError("dashboard path must start with '/' and use URL-safe characters")
    }
    this.path = path.length > 1 ? path.replace(/\/+$/, '') : path;
    this.access = this.#access(options.access ?? 'open');
    const panels = options.panels ?? DASHBOARD_PANELS;
    if (!Array.isArray(panels) || panels.some((p) => !DASHBOARD_PANELS.includes(p))) {
      throw new TypeError(`dashboard panels must be some of: ${DASHBOARD_PANELS.join(', ')}`)
    }
    this.panels = [...new Set(panels)];
    this.history = Number.isInteger(options.history) && options.history >= 10 && options.history <= 3600 ? options.history : 300;
    if (options.history !== undefined && this.history !== options.history) throw new RangeError('dashboard history: 10-3600 seconds')
    this.maxViewers = options.maxViewers ?? 20;
    if (!Number.isInteger(this.maxViewers) || this.maxViewers < 1 || this.maxViewers > 200) throw new RangeError('dashboard maxViewers: 1-200')
    this.showIdentities = options.showIdentities ?? this.access.mode !== 'open';
    const links = options.links ?? [];
    if (!Array.isArray(links) || links.length > 8 || links.some((l) => !l || typeof l.label !== 'string' || !l.label ||
        l.label.length > 32 || typeof l.href !== 'string' || l.href.length > 128 || !SAFE_PATH.test(l.href))) {
      throw new TypeError("dashboard links: at most 8 of { label (1-32 characters), href (a path on this server, starting with '/') }")
    }
    this.links = links.map(({ label, href }) => ({ label, href }));
    this.cidHref = options.cidHref ?? null;
    if (this.cidHref !== null && (typeof this.cidHref !== 'string' || !this.cidHref.includes('{cid}') ||
        this.cidHref.length > 128 || !SAFE_PATH.test(this.cidHref.replace('{cid}', 'x')))) {
      throw new TypeError("dashboard cidHref: a path on this server with {cid}, such as '/#{cid}'")
    }
    this.custom = new Map();        // id -> { title, columns, rows }

    this.server = server;
    this.startedAt = Date.now();
    this.viewers = new Map();       // cid -> { lastAt }
    this.publicSeen = false;        // an open dashboard has been viewed from a public address
    this.series = [];               // [{ at, ... }] one point a second, at most `history`
    this.lastHostCounters = new Map();
    this.lastJournal = new Map();   // host name -> last journal seq sent
    this.events = [];               // recent events for a viewer that just arrived

    this.host = server.host(DASHBOARD.HOST, { inbound: [DASHBOARD.IN], own: ['@' + DASHBOARD.TOPIC] });
    this.host.on('message', (from, tag, msg) => this.#onViewer(from, msg));
    this.host.on('leave', (from) => this.viewers.delete(from.cid));
    this.host.on('error', (error) => console.error('dashboard error:', error));
    this.stats = new ServerStats(server, { onSample: (value) => this.#onSample(value) });
  }

  #access(access) {
    if (access === 'open') return { mode: 'open' }
    if (access && typeof access === 'object' && typeof access.token === 'string') {
      if (access.token.length < 8) throw new RangeError('dashboard token: at least 8 characters')
      return { mode: 'token', hash: sha(access.token) }
    }
    if (access && typeof access === 'object' && access.login && typeof access.login === 'object') {
      const roles = access.login.roles ?? ['admin'];
      const cids = access.login.cids ?? [];
      if (!Array.isArray(roles) || !Array.isArray(cids)) throw new TypeError('dashboard login: roles and cids are arrays')
      for (const role of roles) if (!ROLES.includes(role)) throw new RangeError(`dashboard login role must be one of: ${ROLES.join(', ')}`)
      return { mode: 'login', roles, cids: new Set(cids) }
    }
    throw new TypeError("dashboard access must be 'open', { token } or { login: { roles, cids } }")
  }

  /** Whether this viewer (the server's view of it) may watch. */
  allowed(from, msg) {
    const a = this.access;
    if (a.mode === 'open') return true
    if (a.mode === 'token') return typeof msg?.token === 'string' && timingSafeEqual(sha(msg.token), a.hash)
    if (!from.authorized) return false
    return a.cids.has(from.cid) || a.roles.some((role) => hasRole({ role: from.role, boho: { isAuthorized: true } }, role))
  }

  #onViewer(from, msg) {
    if (msg?.op === 'bye') { this.viewers.delete(from.cid); return }
    if (msg?.op !== 'hello') return
    const known = this.viewers.get(from.cid);
    if (!this.allowed(from, msg)) { this.host.to(from.cid, DASHBOARD.TOPIC, { type: 'denied', mode: this.access.mode }); return }
    if (!known && this.viewers.size >= this.maxViewers) { this.host.to(from.cid, DASHBOARD.TOPIC, { type: 'full' }); return }
    this.viewers.set(from.cid, { lastAt: Date.now() });
    if (!known && this.access.mode === 'open' && !this.publicSeen && this.#fromPublic(from.cid)) {
      // Open access is meant for a LAN: say so once when someone views it from a public address.
      this.publicSeen = true;
      console.warn(`dashboard: open access is being viewed from a public address; use a token or login access (dashboard.access) on an Internet-facing server`);
    }
    if (!known) this.host.to(from.cid, DASHBOARD.TOPIC, this.#init());
  }

  #init() {
    return {
      type: 'init', at: Date.now(), startedAt: this.startedAt, panels: this.panels, history: this.history,
      showIdentities: this.showIdentities, server: this.#serverInfo(), series: this.series, events: this.events.slice(-60),
      publicOpen: this.access.mode === 'open' && this.publicSeen, links: this.links,
      cidHref: this.showIdentities ? this.cidHref : null,
      custom: [...this.custom].map(([id, p]) => ({ id, title: p.title, columns: p.columns })),
    }
  }

  /**
   * Adds a table panel of the application's own data; viewers who are watching get it at once.
   * Cells are shown as text.
   * @param {string} id panel id: a-z, 0-9, '-' (not one of DASHBOARD_PANELS)
   * @param {{ title: string, columns: string[], rows: () => any[][] }} panel
   */
  panel(id, { title, columns, rows }) {
    if (typeof id !== 'string' || !/^[a-z][a-z0-9-]{0,31}$/.test(id) || DASHBOARD_PANELS.includes(id)) {
      throw new TypeError(`dashboard panel id: a-z, 0-9 and '-', not one of ${DASHBOARD_PANELS.join(', ')}`)
    }
    if (typeof title !== 'string' || !title || title.length > 64) throw new TypeError('dashboard panel title: 1-64 characters')
    if (!Array.isArray(columns) || !columns.length || columns.length > 12 || columns.some((c) => typeof c !== 'string' || c.length > 32)) {
      throw new TypeError('dashboard panel columns: 1-12 names of at most 32 characters')
    }
    if (typeof rows !== 'function') throw new TypeError('dashboard panel rows must be a function')
    this.custom.set(id, { title, columns: [...columns], rows });
    for (const cid of this.viewers.keys()) this.host.to(cid, DASHBOARD.TOPIC, this.#init());
    return this
  }

  /** Removes a panel added with panel(). */
  removePanel(id) {
    return this.custom.delete(id)
  }

  #customRows() {
    const out = {};
    for (const [id, p] of this.custom) {
      let rows;
      try { rows = p.rows(); } catch (error) { console.error(`dashboard panel ${id}:`, error); rows = []; }
      out[id] = (Array.isArray(rows) ? rows : []).slice(0, PANEL_ROWS).map((row) => (Array.isArray(row) ? row : [])
        .slice(0, p.columns.length).map((cell) => cell === null || cell === undefined ? '' : String(cell).slice(0, PANEL_CELL)));
    }
    return out
  }

  // The name a connection gives itself on <cid>@$name (rule: the part before the first ':'), or ''.
  #deviceName(cid) {
    const message = this.server.manager.cid2remote?.get(cid)?.retain_signal?.get('$name');
    if (!message) return ''
    try {
      const tagLen = message[1];
      const [text] = decodeSignalArgs(message[2 + tagLen], message.subarray(3 + tagLen)) ?? [];
      return typeof text === 'string' ? text.split(':')[0].trim().slice(0, 64) : ''
    } catch { return '' }
  }

  // Whether the connection of this CID came from a public (not loopback or private) address.
  #fromPublic(cid) {
    for (const remote of this.server.manager.remotes) if (remote.cid === cid) return !remote.privateNode
    return false
  }

  #serverInfo() {
    const s = this.server;
    return {
      ws: s.port ?? null, tcp: s.congPort ?? null, membersOnly: s.membersOnly, anonymousQuota: s.anonymousQuota,
      quota: s.quotas?.[s.anonymousQuota] ?? null, node: process.version,
    }
  }

  #mask(cid) {
    if (this.showIdentities) return cid
    const s = String(cid ?? '');
    return s.length <= 2 ? '••' : s.slice(0, 2) + '•'.repeat(Math.min(4, s.length - 2))
  }

  #hosts(now) {
    const out = [];
    for (const host of this.server.hosts) {
      if (host === this.host || host.closed) continue
      const c = host.counters;
      const prev = this.lastHostCounters.get(host) ?? { ...c, at: now - 1000 };
      const sec = Math.max(0.001, (now - prev.at) / 1000);
      const rate = (k) => (c[k] - prev[k]) / sec;
      const handled = (c.inbound - prev.inbound) + (c.leaves - prev.leaves);
      this.lastHostCounters.set(host, { ...c, at: now });
      const item = {
        name: host.name, participants: host.participants.size,
        rates: { inbound: rate('inbound'), denied: rate('denied'), rejected: rate('rejected'), published: rate('published'), delivered: rate('delivered'), sent: rate('sent'), errors: rate('errors') },
        totals: { inbound: c.inbound, denied: c.denied, rejected: c.rejected, joins: c.joins, leaves: c.leaves, errors: c.errors },
        handlerAvgMs: handled > 0 ? (c.handlerMs - prev.handlerMs) / handled : 0,
        handlerMaxMs: host.handlerMaxMs,
        loops: host.loopStats(), report: host.reported,
      };
      {
        item.players = host.activity()
          .sort((a, b) => b.lastAt - a.lastAt).slice(0, PARTICIPANT_LIMIT)
          .map(({ from, inputs, firstAt, lastAt }) => ({
            cid: this.#mask(from.cid), nick: this.showIdentities ? from.nick : '', authorized: from.authorized,
            name: this.showIdentities ? this.#deviceName(from.cid) : '',
            inputs, since: now - firstAt, idle: now - lastAt,
          }));
      }
      const after = this.lastJournal.get(host.name) ?? 0;
      const fresh = host.journal(after);
      if (fresh.length) this.lastJournal.set(host.name, fresh.at(-1).seq);
      for (const e of fresh) {
        this.events.push({ host: host.name, at: e.at, kind: e.kind, cid: e.cid ? this.#mask(e.cid) : undefined, tag: e.tag, reason: e.reason, message: e.message });
      }
      out.push(item);
    }
    if (this.events.length > 200) this.events.splice(0, this.events.length - 200);
    return out
  }

  #onSample(v) {
    const now = v.at;
    for (const [cid, viewer] of this.viewers) if (now - viewer.lastAt > VIEWER_TTL_MS) this.viewers.delete(cid);
    const eventsBefore = this.events.length;
    const hosts = this.#hosts(now);
    // The dashboard's own traffic, so it can be told apart from the game's.
    const own = { viewers: this.viewers.size };
    const point = {
      at: now, cpu: v.cpuPercent, elu: v.eventLoopUtilization, eld: v.eventLoopP99Ms, rss: v.rss, heap: v.heapUsed,
      conns: v.total, ws: v.websocket, tcp: v.total - v.websocket, auth: v.authenticated,
      rxMsg: v.rates.rxMessages ?? 0, txMsg: v.rates.txMessages ?? 0, rxB: v.rates.rxBytes ?? 0, txB: v.rates.txBytes ?? 0,
      dropped: (v.rates.rateLimited ?? 0) + (v.rates.oversizeRejected ?? 0),
      hosts: Object.fromEntries(hosts.map((h) => [h.name, { in: h.rates.inbound, denied: h.rates.denied, players: h.participants, step: h.loops[0]?.stepAvg ?? null, gap: h.loops[0]?.gapP99 ?? null }])),
    };
    this.series.push(point);
    if (this.series.length > this.history) this.series.shift();
    if (!this.viewers.size) return
    const frame = {
      type: 'tick', point,
      server: {
        uptime: now - this.startedAt, states: v.states, queuedBytes: v.queuedBytes, maxQueuedBytes: v.maxQueuedBytes,
        txBlockedConnections: v.txBlockedConnections, channels: v.channels, hostTotalBytes: v.hostTotalBytes,
        counters: { rateLimited: v.counters.rateLimited, oversizeRejected: v.counters.oversizeRejected, peerRxLimitSkipped: v.counters.peerRxLimitSkipped },
        own,
      },
      hosts, events: this.events.slice(eventsBefore), custom: this.#customRows(),
    };
    for (const cid of this.viewers.keys()) this.host.to(cid, DASHBOARD.TOPIC, frame);
  }

  /**
   * Serves the page (GET path) and the browser client (path + '/io.js'). Returns true when it
   * answered. A Server with `port` calls it itself; with your own httpServer call it first in
   * your request handler: if (server.dashboard.handle(req, res)) return
   */
  handle(req, res) {
    let pathname;
    try { pathname = new URL(req.url || '/', 'http://localhost').pathname; } catch { return false }
    const root = this.path === '/' ? '' : this.path;
    if (pathname !== this.path && pathname !== root + '/' && pathname !== root + '/io.js') return false
    if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405, { Allow: 'GET, HEAD' }); res.end(); return true }
    const headers = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer' };
    if (pathname === root + '/io.js') {
      readFile(IO_BUNDLE).then((js) => {
        res.writeHead(200, { ...headers, 'Content-Type': 'text/javascript; charset=utf-8' });
        res.end(req.method === 'HEAD' ? undefined : js);
      }, () => { res.writeHead(500); res.end('IOSignal browser bundle not found (build dist first)'); });
      return true
    }
    const config = {
      io: root + '/io.js', ws: this.server.wsPath || '/', access: this.access.mode, panels: this.panels,
      history: this.history, tag: DASHBOARD.IN, topic: '@' + DASHBOARD.TOPIC,
    };
    res.writeHead(200, {
      ...headers, 'Content-Type': 'text/html; charset=utf-8',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' ws: wss:; img-src 'self' data:",
    });
    res.end(req.method === 'HEAD' ? undefined : dashboardPage(config));
    return true
  }

  close() {
    this.stats.dispose();
    this.host.close();
    this.viewers.clear();
  }
}

const STATUS = {
  OK: 0,
  //0~127: success
  //128~255: fail
  ERROR: 255
};

/**
 * LocalKeyProvider.js
 *
 * Key provider for local testing: no key list, every non-empty ID logs in with its own ID as CID.
 *
 *  mode 'idKey':     the key equals the ID, e.g. io.auth('dev1', 'dev1').
 *  mode 'sharedKey': any ID with the one shared key, e.g. io.auth('dev1', 'lab2026').
 *  role:  role of every login, default 'device' ('service' or 'admin' must be asked for).
 *  quota: Server quotas profile of every login, default from BohoAuth resolveQuota.
 *
 * example => new BohoAuth(new LocalKeyProvider({ mode: 'sharedKey', key: 'lab2026' }))
 *
 * Anyone who knows the rule logs in under any ID, so use it only on a trusted local network.
 */


const MODES = ['idKey', 'sharedKey'];
// The stored key: Boho.deriveKey of the key string (Ascon, 16 bytes), base64. Never the key string.
const storedKey$3 = keyStr => Buffer.from(mt.deriveKey(keyStr)).toString('base64');

class LocalKeyProvider {
  /**
   * @param {'idKey' | { mode: 'idKey' | 'sharedKey', key?: string,
   *   role?: 'device' | 'service' | 'admin', quota?: string }} options
   *   A string is the mode alone.
   */
  constructor(options) {
    const { mode, key, role = 'device', quota } = typeof options === 'string' ? { mode: options } : (options ?? {});
    if (!MODES.includes(mode)) {
      throw new TypeError(`LocalKeyProvider mode must be one of: ${MODES.join(', ')}`)
    }
    if (mode === 'sharedKey' && (typeof key !== 'string' || key.length === 0)) {
      throw new TypeError("LocalKeyProvider mode 'sharedKey' needs a non-empty key")
    }
    if (quota !== undefined && (typeof quota !== 'string' || !quota)) {
      throw new TypeError('LocalKeyProvider quota must be a quotas profile name')
    }
    if (!ROLES.includes(role) || role === 'anonymous') {
      throw new RangeError(`LocalKeyProvider role must be one of: ${ROLES.slice(1).join(', ')}`)
    }
    this.mode = mode;
    this.role = role;
    this.quota = quota;
    // Stored like StringKeyProvider (deriveKey, base64), so a shared key is never taken for a stored key.
    this.sharedKey = mode === 'sharedKey' ? storedKey$3(key) : null;
  }

  async getAuth(id) {
    if (!id) return undefined
    return {
      key: this.sharedKey ?? storedKey$3(id),
      cid: id,
      role: this.role,
      ...(this.quota && { quota: this.quota })
    }
  }
}

// Removed or renamed in 9.0, as Server options and as serverOption keys ('global': only as a
// serverOption key). An error names the replacement instead of the setting silently doing nothing.
const REMOVED = [
  ['showMessage', 'logMessages: true'],
  ['showMetric', "logStats: <interval ms> (for lists, the sudo service's remotes/channels commands)"],
  ['monitorPeriod', 'logStats: <interval ms>'],
  ['timeout', 'heartbeatInterval'],
  ['pingTimeoutGrace', 'heartbeatGrace'],
  ['retain.isAvailable', 'retain.enabled'],
  ['useQuota', 'quotas: named quota profiles, always enforced (null: unlimited)'],
  ['defaultQuotaIndex', "anonymousQuota: a quotas profile name; logins use their account's quota"],
  ['auth.delay_auth_fail', 'auth.failDelay', 'global'],
  ['adminLevel', "role: 'admin' in the account (key entry)", 'global'],
  ['clientTracking', 'nothing: it was never used', 'global'],
  ...['port', 'congPort', 'httpServer', 'wsPath'].map(name => [name, `new Server({ ${name} })`, 'global'])
];
const lookup = (object, path) => path.split('.').reduce((value, key) => value?.[key], object);

function checkRemoved(options) {
  for (const [path, replacement, scope] of REMOVED) {
    const sources = scope === 'global' ? [['serverOption.', serverOption]] : [['', options], ['serverOption.', serverOption]];
    for (const [prefix, source] of sources) {
      if (lookup(source, path) !== undefined) {
        throw new TypeError(`${prefix}${path} was removed in iosignal 9.0; use ${replacement}`)
      }
    }
  }
}

const MAX_TIMER_MS = 2147483647; // setTimeout limit

function integer(name, value, min, max = Number.MAX_SAFE_INTEGER) {
  if (!Number.isSafeInteger(value) || value < min || value > max) {
    throw new RangeError(`${name} must be an integer from ${min} to ${max}`)
  }
  return value
}
const positive = (name, value) => integer(name, value, 1);
const nonNegative = (name, value) => integer(name, value, 0);
const QUOTA_LIMITS = ['maxMessageBytes', 'fanout', 'msgPerSec', 'bytesPerSec', 'maxConnections', 'maxSubscriptions', 'deliveriesPerSec'];

// This Server's quota profiles: the defaults with each given profile merged over its default
// (a new name starts from no limits). Every limit is a positive integer or null (unlimited).
function quotaProfiles(given) {
  if (given !== undefined && (given === null || typeof given !== 'object')) {
    throw new TypeError('quotas must be an object')
  }
  const profiles = {};
  for (const name of new Set([...Object.keys(serverOption.quotas), ...Object.keys(given ?? {})])) {
    const profile = given?.[name];
    if (profile !== undefined && (profile === null || typeof profile !== 'object')) {
      throw new TypeError(`quotas.${name} must be an object`)
    }
    for (const key of Object.keys(profile ?? {})) {
      if (!QUOTA_LIMITS.includes(key)) throw new TypeError(`unknown option quotas.${name}.${key}`)
    }
    const base = serverOption.quotas[name] ?? Object.fromEntries(QUOTA_LIMITS.map(key => [key, null]));
    profiles[name] = { ...base, ...profile };
    for (const key of QUOTA_LIMITS) {
      if (profiles[name][key] !== null) positive(`quotas.${name}.${key}`, profiles[name][key]);
    }
  }
  return profiles
}
function boolean(name, value) {
  if (typeof value !== 'boolean') throw new TypeError(`${name} must be a boolean`)
  return value
}

// A nested option group: this Server's own copy of the serverOption defaults with its options
// applied. Unknown keys are errors, so a typo does not silently do nothing.
function group(name, given, checks) {
  if (given !== undefined && (given === null || typeof given !== 'object')) {
    throw new TypeError(`${name} must be an object`)
  }
  for (const key of Object.keys(given ?? {})) {
    if (!(key in checks)) throw new TypeError(`unknown option ${name}.${key}`)
  }
  const merged = { ...serverOption[name], ...given };
  for (const [key, check] of Object.entries(checks)) check(`${name}.${key}`, merged[key]);
  return merged
}

function resolveLogStats(value) {
  if (value === 0 || value === false) return 0
  return integer('logStats', value, 1000, MAX_TIMER_MS)
}

class Server extends require$$0$3 {

  /**
   * @param {object} options Server configuration.
   *   options.localAuth: login without a key list, for local testing. 'idKey' (key = ID) or
   *   { mode: 'idKey' | 'sharedKey', key, role, quota } (see LocalKeyProvider); the CID is the ID.
   *   Cannot be combined with authManager.
   *   Every other setting is this Server's own: given here, else the serverOption default, which is
   *   never modified. Nested groups (security, retain, quotas) are merged over their defaults;
   *   unknown or removed names are errors.
   *   options.heartbeatInterval: ms between liveness checks (default 50000).
   *   options.heartbeatGrace: extra ms a peer has to answer before it is closed (default 5000).
   *   options.trustProxy: when X-Forwarded-For/-Proto are used. 'private' (default) only from a
   *   loopback/private peer, true always, false never, or N trusted proxy hops.
   *   options.maxPayload: largest WebSocket message and CongSocket frame in bytes (default 32 MiB).
   *   options.maxBufferedBytes: close a peer whose unsent data exceeds this (default 64 MiB).
   *   options.membersOnly: only authenticated connections may send signals or subscribe.
   *   options.connectionLimits: { newPerAddressPerMin, failedPerAddressPerMin, maxPerAddress, windowMs,
   *   exempt } per public address, merged over serverOption.connectionLimits; false turns them off.
   *   A connection over a limit is closed when accepted (WebSocket code 1013); see AddressLimiter.
   *   options.logMessages: log each received message after decryption: type and tag, never the payload.
   *   options.logStats: print a one-line summary every N ms (>= 1000; 0 = off); see stats().
   *   options.security: { maxClockSkewMs, authChallengeMaxAgeMs, maxReplayEntries, requireEncryption }.
   *   options.retain: retained message limits, see serverOption.retain; adjustable later on server.retain.
   *   options.quotas: named quota profiles { name: { maxMessageBytes, fanout, msgPerSec, bytesPerSec,
   *   maxConnections, maxSubscriptions } }, merged over serverOption.quotas; always enforced, null is unlimited.
   *   Adjustable later on server.quotas. The client is told its maxMessageBytes.
   *   options.anonymousQuota: profile of a connection that has not authenticated (default 'anonymous').
   *   options.duplicateLogin: 'keepOld' | 'keepNew' for this Server's connections; overrides the auth
   *   manager's own policy without changing it, so an auth manager can be shared between servers.
   *   options.dashboard: true or { path, access, panels, history, maxViewers, showIdentities } shows a live
   *   status page of the server and its hosts (see Dashboard.js); off by default. With `port` the Server
   *   serves it itself; with your own httpServer call server.handle(req, res) in its handler.
   *   options.healthPath: path of the health check, answered with 200 {"status":"ok"} while the server
   *   runs and 503 while it closes (default '/healthz'; false turns it off). With `port` the Server
   *   answers it itself; with your own httpServer call server.handle(req, res).
   *   A failed listen (e.g. EADDRINUSE) is emitted as 'error'.
   * @param {any} [authManager] Optional authentication manager.
   */
  constructor(options, authManager) {
    super();
    if (options.localAuth !== undefined && options.localAuth !== null) {
      if (authManager) throw new TypeError('localAuth cannot be combined with an authManager')
      authManager = new BohoAuth(new LocalKeyProvider(options.localAuth));
    }
    // Each Server resolves its settings once, here: serverOption only supplies the defaults and is
    // never written, so servers in one process do not affect each other.
    checkRemoved(options);
    this.security = Object.freeze(group('security', options.security,
      { maxClockSkewMs: positive, authChallengeMaxAgeMs: positive, maxReplayEntries: positive, requireEncryption: boolean }));
    // retain and quotas may be adjusted on a running server, e.g. server.quotas.basic.fanout = 50.
    this.retain = group('retain', options.retain, {
      enabled: boolean, limitSize: positive, limitCounter: positive, tagsPerOwner: positive,
      bytesPerOwner: positive, anonymousGraceMs: nonNegative, bytesPerConnection: positive, bytesTotal: positive });
    this.quotas = quotaProfiles(options.quotas);
    this.anonymousQuota = options.anonymousQuota ?? serverOption.anonymousQuota;
    if (!Object.hasOwn(this.quotas, this.anonymousQuota)) {
      throw new RangeError(`anonymousQuota must be one of the quotas: ${Object.keys(this.quotas).join(', ')}`)
    }
    this.heartbeatInterval = integer('heartbeatInterval',
      options.heartbeatInterval ?? serverOption.heartbeatInterval, 1, MAX_TIMER_MS);
    this.heartbeatGrace = integer('heartbeatGrace', options.heartbeatGrace ?? serverOption.heartbeatGrace, 0, MAX_TIMER_MS);
    this.maxPayload = positive('maxPayload', options.maxPayload ?? serverOption.maxPayload);
    this.maxBufferedBytes = positive('maxBufferedBytes', options.maxBufferedBytes ?? serverOption.maxBufferedBytes);
    this.logMessages = boolean('logMessages', options.logMessages ?? serverOption.logMessages);
    this.logStats = resolveLogStats(options.logStats ?? serverOption.logStats);
    this.trustProxy = options.trustProxy ?? serverOption.trustProxy;
    if (![true, false, 'private'].includes(this.trustProxy) &&
        !(Number.isSafeInteger(this.trustProxy) && this.trustProxy > 0)) {
      throw new RangeError("trustProxy must be true, false, 'private' or a positive integer");
    }
    this.membersOnly = boolean('membersOnly', options.membersOnly ?? serverOption.membersOnly);
    // Per-address connection limits (AddressLimiter); adjustable later on server.connectionLimits.
    this.connectionLimits = connectionLimits(options.connectionLimits, serverOption.connectionLimits);
    this.serviceNames = new Set();
    this.services = new Map();   // name -> service module (for lifecycle hooks)
    this.hosts = new Set();      // open hosts (server.host)
    // Stays null for a CongSocket-only server, so close() does not wait on a WebSocket server.
    this.wss = null;
    this.port = null;
    this.congPort = null;

    // Read by the auth manager for this server's connections; the auth manager itself is not
    // changed, since it may be shared. null: the auth manager's own policy.
    this.duplicateLogin = null;
    if (options.duplicateLogin !== undefined) {
      this.duplicateLogin = validateDuplicateLogin(options.duplicateLogin);
      if (authManager && !('duplicateLogin' in authManager)) {
        throw new TypeError('duplicateLogin: the auth manager does not support this option')
      }
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

    const healthPath = options.healthPath ?? '/healthz';
    if (healthPath !== false && (typeof healthPath !== 'string' || !/^\/[A-Za-z0-9._~\-/]*$/.test(healthPath) || healthPath.length > 64)) {
      throw new TypeError("healthPath must be false or a path that starts with '/' and uses URL-safe characters")
    }
    this.healthPath = healthPath;
    this.closing = false;

    this.manager = new Manager(this, authManager);
    // The status page; null when off.
    this.dashboard = null;
    if (options.dashboard) {
      try {
        this.dashboard = new Dashboard(this, options.dashboard);
      } catch (error) {
        this.manager.close(); // a bad dashboard option must not leave the heartbeat timer running
        throw error
      }
    }

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
    if ((this.port || this.port == 0) && (this.dashboard || this.healthPath)) {
      // The Server's own HTTP server carries the WebSocket upgrades, the health check and the dashboard.
      // Any other plain HTTP request gets what the WebSocket server alone answered: 426 (404 with a dashboard).
      this.ownHttp = http.createServer((req, res) => {
        if (this.handle(req, res)) return
        const [code, body] = this.dashboard ? [404, 'Not found'] : [426, http.STATUS_CODES[426]];
        res.writeHead(code, { 'Content-Type': 'text/plain', 'Content-Length': Buffer.byteLength(body) });
        res.end(body);
      });
      // No 'error' listener of our own: the WebSocket server forwards the HTTP server's errors (listen
      // failures such as EADDRINUSE) to its own 'error', handled below; listening here too reported them twice.
      this.wss = new WebSocketServer({ server: this.ownHttp, path: this.wsPath, maxPayload: this.maxPayload });
      this.ownHttp.listen(this.port);
    } else if (this.port || this.port == 0) {
      // Nothing to answer over plain HTTP (healthPath: false, no dashboard), as in the browser broker.
      this.wss = new WebSocketServer({ port: this.port , path: this.wsPath, maxPayload: this.maxPayload });
    } else if (this.httpServer ) {
      this.wss = new WebSocketServer({ server: this.httpServer, path: this.wsPath, maxPayload: this.maxPayload });
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
    this.wss.on('error', (err) => this.onListenerError('ws', err));

    this.wss.on('close', () => {
      // console.log('### WS server is closed.')
    });

    this.wss.on('connection', (ws, req) => {
      // Too many connections from this address: closed before anything is sent (try again later).
      const ip = getClientAddress(req, this.trustProxy).ip;
      // IPv6 is not supported: closed before anything is sent.
      if (!isSupportedIP(ip)) return ws.close(1008, 'IPv6 not supported')
      if (!this.manager.admitConnection(ip)) return ws.close(1013, 'too many connections')
      ws.socketType = 'websocket';
      ws._limitIp = ip;
      this.manager.addRemote(ws, req);
    });


  }

  startCongServer() {
    this.congServer = net.createServer((socket) => {
      // Signals are small frames; send each immediately instead of waiting on Nagle.
      socket.setNoDelay(true);
      const ip = normalizeIP(socket.remoteAddress) ?? '0.0.0.0';
      if (!isSupportedIP(ip)) return socket.destroy() // IPv6 is not supported
      if (!this.manager.admitConnection(ip)) return socket.destroy()
      socket._limitIp = ip;
      this.manager.addRemote(socket);
    })
      .on('error', (err) => this.onListenerError('cong', err))
      .on('close', () => {
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

  // A failed listen (e.g. EADDRINUSE) is the application's to handle: emitted as 'error',
  // which, like any EventEmitter, throws when nothing listens. Other errors are logged.
  onListenerError(name, err) {
    console.error(`### ${name} server error:`, err.message);
    if (err.syscall === 'listen') this.emit('error', err);
  }

  /**
   * Current server state, for monitoring. counters are cumulative since the server started
   * (rates are the reader's to compute from two snapshots). Enumerates connections once.
   * @returns {{ at: number, connections: { total: number, authenticated: number, anonymous: number,
   *   websocket: number, tcp: number }, channels: number, retained: { channel: number, bytes: number },
   *   counters: { rxMessages: number, rxBytes: number, txMessages: number, txBytes: number,
   *   publishes: number, deliveryAttempts: number, quotaExcluded: number, peerRxLimitSkipped: number },
   *   memory: { rss: number, heapUsed: number } }}
   */
  stats() {
    return this.manager.metrics.snapshot()
  }

  /**
   * Server-side logic (a game, a room) in this process. Signals clients send to the inbound tags go
   * to the host only, with the server's view of the sender; clients cannot send to the tags it owns.
   * @param {string} name 1-64 characters of A-Z a-z 0-9 _ . -
   * @param {{ inbound: string[], own?: string[], fanout?: number|null,
   *   retain?: { tags?: number, bytes?: number } }} options
   *   inbound: channel tags clients send to the host (a trailing '*' is a prefix). Not relayed.
   *   own: channel tags only the host publishes, and '@topic' unicast topics only the host sends.
   *   fanout: most subscribers one publish reaches (default null: all).
   *   retain: budget of the host's retained ('$') values (default: retain.tagsPerOwner/bytesPerOwner).
   * @returns {Host}
   */
  host(name, options) {
    const host = new Host(this.manager, name, options);
    host.once('close', () => this.hosts.delete(host));
    this.hosts.add(host);
    return host
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
    
    const handleError = (remote, req, error) => {
      console.error(`Unhandled Service Error in service [${service}]:`, error);
      if (remote._closing) return;
      // A disconnected transport can also fail while reporting the service error.
      try {
        remote.response(req.mid, STATUS.ERROR, "INTERNAL_SERVER_ERROR");
      } catch (responseError) {
        console.error(`Service error response failed [${service}]:`, responseError);
      }
    };
    const useCall = typeof service_module.call === 'function';
    this.on(service, (remote, req) => {
      try {
        if (!service_module.checkPermission(remote, req)) {
          remote.response(req.mid, STATUS.ERROR, "NO_PERMISSION.");
          return;
        }
        if (!service_module.commands.includes(req.topic)) {
          remote.response(req.mid, STATUS.ERROR, "UNKNOWN_COMMAND");
          return;
        }
        // Keep synchronous invocation and the service receiver; also observe async failures.
        const result = useCall
          ? service_module.call(remote, req)
          : service_module[req.topic](remote, req);
        Promise.resolve(result).catch(error => handleError(remote, req, error));
      } catch (error) {
        handleError(remote, req, error);
      }
    });
    this.serviceNames.add(service);
    this.services.set(service, service_module);
    // console.log(`[Service attached: ${service} ] accept commands: ${service_module.commands}`)
    return this
  }

  /**
   * Answers the Server's own HTTP requests: the health check (healthPath) and the dashboard pages.
   * Returns true when it answered. A Server with `port` calls it itself; with your own httpServer call
   * it first in your request handler: if (server.handle(req, res)) return
   * @param {import('node:http').IncomingMessage} req
   * @param {import('node:http').ServerResponse} res
   * @returns {boolean}
   */
  handle(req, res) {
    if (this.healthPath) {
      let pathname;
      try { pathname = new URL(req.url || '/', 'http://localhost').pathname; } catch { pathname = null; }
      if (pathname === this.healthPath) {
        if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405, { Allow: 'GET, HEAD' }); res.end(); return true }
        const body = JSON.stringify({ status: this.closing ? 'closing' : 'ok' });
        res.writeHead(this.closing ? 503 : 200, {
          'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body),
          'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff',
        });
        res.end(req.method === 'HEAD' ? undefined : body);
        return true
      }
    }
    return this.dashboard ? this.dashboard.handle(req, res) : false
  }

  /**
   * @param {() => void} [callback] Called when the server has closed.
   */
  close(callback) {
    console.log('closing iosignal server...');
    this.closing = true;
    if (this.dashboard) this.dashboard.close();
    for (const host of [...this.hosts]) host.close();
    if (this.manager) {
      this.manager.close();
    }

    this.serviceNames.forEach(v => this.removeAllListeners(v));
    this.serviceNames.clear();
    // this.services is kept so onRemoteClose cleanup still runs for sockets that close later.

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
        if (!this.ownHttp) return onClosed()
        // The HTTP server this Server made closes with it.
        this.ownHttp.close(() => onClosed());
        this.ownHttp.closeAllConnections?.();
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

// The stored key: Boho.deriveKey of the key string (Ascon, 16 bytes), base64. Never the key string.
const storedKey$2 = keyStr => Buffer.from(mt.deriveKey(keyStr)).toString('base64');

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
      file.authInfo.forEach(item => {
        this.addAuth(...item);
      });
      console.log('total AUTH INFO size: ', this.AUTH.size);
    }).catch(e => {
      console.log(e);
    });
  }

  loadAuthInfoFile_JSON(path) {
    let file = readFileSync$1(path);
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

  // Each item: [id, key, cid, role?, quota?]; see StringKeyProvider.
  addAuth(id, keyStr, cid, role, quota) {
    checkLoginId(id);
    this.AUTH.set(id, { key: storedKey$2(keyStr), cid, ...(role && { role }), ...(quota && { quota }) });
  }
}

// The stored key: Boho.deriveKey of the key string (Ascon, 16 bytes), base64. Never the key string.
const storedKey$1 = keyStr => Buffer.from(mt.deriveKey(keyStr)).toString('base64');
const DEVICE_PREFIX = "device:";
// Every device CID in use. The account service picks new CIDs outside it, so a device added here
// is listed too and no member can be given its CID.
const CID_SET = "sets_cid";

class RedisKeyProvider {
  constructor(redisClient) {
    if (!redisClient) {
      throw new Error("RedisKeyProvider constructor: no redisClient")
    }
    this.redis = redisClient;
  }

  // get device key from DB. (for Boho auth.)
  // null: no such device. A Redis failure throws, so BohoAuth closes the connection (the client
  // connects again) instead of answering AUTH_FAIL as if the ID were unknown.
  async getAuth(id) {
    let result = await this.redis.hGetAll(DEVICE_PREFIX + id);
    if (result && result.key) return result
    else return null;
  }

  //sudoService call
  async getAuthIdList() {
    const keys = await this.scanKeys(DEVICE_PREFIX + '*');
    return keys.map(key => key.slice(DEVICE_PREFIX.length))
  }

  // Keys matching pattern, by SCAN: KEYS blocks Redis until it has walked every key.
  // Falls back to KEYS for a client without scan, or a redis-service from before 2026-11-17 that refuses it
  // (RemoteRedisClient throws on a refused command; an undefined reply is treated the same).
  async scanKeys(pattern) {
    if (typeof this.redis.scan === 'function') {
      const keys = new Set(); // SCAN may return a key more than once
      let cursor = '0';
      do {
        let reply;
        try {
          reply = await this.redis.scan(cursor, { MATCH: pattern, COUNT: 1000 });
        } catch {
          break
        }
        if (!reply || !Array.isArray(reply.keys)) break
        for (const key of reply.keys) keys.add(key);
        cursor = String(reply.cursor);
        if (cursor === '0') return [...keys]
      } while (true)
    }
    return (await this.redis.keys(pattern)) ?? []
  }

  // add device auth info
  // role and quota are optional (see StringKeyProvider); an omitted one is not stored.
  async addAuth(id, keyStr, cid = '', role, quota) {
    checkLoginId(id);
    const fields = { 'key': storedKey$1(keyStr), 'cid': cid };
    if (role) fields.role = role;
    if (quota) fields.quota = quota;
    const old = await this.redis.hGet(DEVICE_PREFIX + id, 'cid');
    const result = await this.redis.hSet(DEVICE_PREFIX + id, fields);
    if (old && old !== cid) await this.redis.sRem(CID_SET, old);
    if (cid) await this.redis.sAdd(CID_SET, cid);
    return result
  }

  //sudoService call
  async delAuth(id) {
    const cid = await this.redis.hGet(DEVICE_PREFIX + id, 'cid');
    if (cid) await this.redis.sRem(CID_SET, cid);
    return this.redis.del(DEVICE_PREFIX + id)
  }

  async save(id) {
    return this.redis.save()
  }
}

/**
 * StringKeyProvider.js
 *
 * authInfo <String>: entries 'id.key.cid[.role[.quota]]' separated by ','.
 *  id:    max 8 chars
 *  key:   ~44 base64 chars recommended
 *  cid:   client ID
 *  role:  'device' (default) | 'service' | 'admin'
 *  quota: a Server quotas profile name (default: BohoAuth resolveQuota)
 *
 * example => authInfo = 'id1.key1.cid1.admin,id2.key2.cid2.device.pro'
 */

// The stored key: Boho.deriveKey of the key string (Ascon, 16 bytes), base64. Never the key string.
const storedKey = keyStr => Buffer.from(mt.deriveKey(keyStr)).toString('base64');

const ACCOUNT_ROLES = ROLES.filter(role => role !== 'anonymous');

/** Parses one 'id.key.cid[.role[.quota]]' entry; a malformed one is a TypeError (naming only the id). */
function parseKeyEntry(entry) {
  const [id, key, cid, role, quota, ...rest] = entry.split('.');
  if (!id || !key || !cid || rest.length > 0 || (role && !ACCOUNT_ROLES.includes(role))) {
    throw new TypeError(`invalid key entry 'id.key.cid[.role[.quota]]' for id: ${id ?? ''}`)
  }
  return { id, key, cid, role: role || undefined, quota: quota || undefined }
}

class StringKeyProvider {
  constructor(authInfo) {
    if (!authInfo) {
      throw TypeError("StringKeyProvider constructor() missing authInfo.")
    }
    this.AUTH = new Map();
    for (const entry of authInfo.split(',')) {
      const { id, key, cid, role, quota } = parseKeyEntry(entry);
      this.addAuth(id, key, cid, role, quota);
    }
  }

  async getAuth(id) {
    return this.AUTH.get(id)
  }
  async getAuthIdList() {
    return Array.from(this.AUTH.keys())
  }

  addAuth(id, keyStr, cid, role, quota) {
    checkLoginId(id);
    this.AUTH.set(id, { key: storedKey(keyStr), cid, ...(role && { role }), ...(quota && { quota }) });
  }
}

const commands$1 = ['echo', 'date', 'unixtime'];

// Open to every connection.
function checkPermission$1(remote) {
  return true;
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

// Only a connection authenticated with role 'admin'.
function checkPermission(remote) {
  return hasRole(remote, 'admin');
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
      // did, key, cid[, role[, quota]]
      if (remote.manager.authManager && req.$.length >= 3 && req.$.length <= 5) {
        if (remote.manager.authManager.addAuth) {
          const [did, dkey, cid, role, quota] = req.$;
          result = await remote.manager.authManager.addAuth(did, dkey, cid, role, quota);
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

// KEYS stays for older clients; new ones list keys with SCAN (RedisKeyProvider.scanKeys).
const COMMANDS = [
  'GET', 'SET', 'HGETALL', 'HGET', 'HSET', 'SADD', 'SISMEMBER',
  'SMEMBERS', 'EXISTS', 'SREM', 'DEL', 'KEYS', 'SCAN', 'SAVE',
  'LPUSH', 'LTRIM', 'LRANGE', 'LINDEX', 'LSET', 'EXPIRE',
  'get', 'set', 'hGetAll', 'hGet', 'hSet', 'sAdd', 'sIsMember',
  'sMembers', 'exists', 'sRem', 'del', 'keys', 'scan', 'save',
  'lPush', 'lTrim', 'lRange', 'lIndex', 'lSet', 'expire'
];

class RedisService {
  /**
   * @param {object} redisClient
   * @param {'anonymous' | 'device' | 'service' | 'admin'} [minRole='service'] lowest role allowed;
   *   'anonymous' allows every connection.
   */
  constructor(redisClient, minRole = 'service') {
    if (!redisClient) {
      throw new Error("RedisService constructor: no redisClient")
    }
    if (!ROLES.includes(minRole)) throw new RangeError(`minRole must be one of: ${ROLES.join(', ')}`)
    this.redisClient = redisClient;
    this.minRole = minRole;
    this.commands = COMMANDS;
  }

  checkPermission(remote, req) {
    return hasRole(remote, this.minRole);
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

export { mt as Boho, BohoAuth, CongRx, ENC_MODE, FileKeyProvider, FileLogger, IOWS as IO, IOCongSocket, IOMsg, LocalKeyProvider, $$1 as MBP, PAYLOAD_TYPE, ROLES, RedisKeyProvider, RedisService, SIZE_LIMIT, STATE, STATUS$1 as STATUS, Server, StringKeyProvider, checkLoginId, defaultQuota, delay, getIPv4HexString, getLocalAddress, getPayloadFromSignalPack, getSignalPack, hasRole, isPrivateIP, numberWithCommas, pack, parsePayload, replyService, serverOption, sudoService, version };
