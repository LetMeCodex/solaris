var yx=Object.defineProperty;var _x=(t,e,n)=>e in t?yx(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var G=(t,e,n)=>_x(t,typeof e!="symbol"?e+"":e,n);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function n(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=n(r);fetch(r.href,s)}})();function Mx(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var g0={exports:{}},oc={},v0={exports:{}},We={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var mo=Symbol.for("react.element"),Sx=Symbol.for("react.portal"),wx=Symbol.for("react.fragment"),Ex=Symbol.for("react.strict_mode"),Tx=Symbol.for("react.profiler"),Ax=Symbol.for("react.provider"),bx=Symbol.for("react.context"),Cx=Symbol.for("react.forward_ref"),Rx=Symbol.for("react.suspense"),Px=Symbol.for("react.memo"),Dx=Symbol.for("react.lazy"),Gf=Symbol.iterator;function Nx(t){return t===null||typeof t!="object"?null:(t=Gf&&t[Gf]||t["@@iterator"],typeof t=="function"?t:null)}var x0={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},y0=Object.assign,_0={};function ea(t,e,n){this.props=t,this.context=e,this.refs=_0,this.updater=n||x0}ea.prototype.isReactComponent={};ea.prototype.setState=function(t,e){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,t,e,"setState")};ea.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function M0(){}M0.prototype=ea.prototype;function yh(t,e,n){this.props=t,this.context=e,this.refs=_0,this.updater=n||x0}var _h=yh.prototype=new M0;_h.constructor=yh;y0(_h,ea.prototype);_h.isPureReactComponent=!0;var Vf=Array.isArray,S0=Object.prototype.hasOwnProperty,Mh={current:null},w0={key:!0,ref:!0,__self:!0,__source:!0};function E0(t,e,n){var i,r={},s=null,a=null;if(e!=null)for(i in e.ref!==void 0&&(a=e.ref),e.key!==void 0&&(s=""+e.key),e)S0.call(e,i)&&!w0.hasOwnProperty(i)&&(r[i]=e[i]);var o=arguments.length-2;if(o===1)r.children=n;else if(1<o){for(var l=Array(o),c=0;c<o;c++)l[c]=arguments[c+2];r.children=l}if(t&&t.defaultProps)for(i in o=t.defaultProps,o)r[i]===void 0&&(r[i]=o[i]);return{$$typeof:mo,type:t,key:s,ref:a,props:r,_owner:Mh.current}}function Ix(t,e){return{$$typeof:mo,type:t.type,key:e,ref:t.ref,props:t.props,_owner:t._owner}}function Sh(t){return typeof t=="object"&&t!==null&&t.$$typeof===mo}function Lx(t){var e={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(n){return e[n]})}var Wf=/\/+/g;function Rc(t,e){return typeof t=="object"&&t!==null&&t.key!=null?Lx(""+t.key):e.toString(36)}function fl(t,e,n,i,r){var s=typeof t;(s==="undefined"||s==="boolean")&&(t=null);var a=!1;if(t===null)a=!0;else switch(s){case"string":case"number":a=!0;break;case"object":switch(t.$$typeof){case mo:case Sx:a=!0}}if(a)return a=t,r=r(a),t=i===""?"."+Rc(a,0):i,Vf(r)?(n="",t!=null&&(n=t.replace(Wf,"$&/")+"/"),fl(r,e,n,"",function(c){return c})):r!=null&&(Sh(r)&&(r=Ix(r,n+(!r.key||a&&a.key===r.key?"":(""+r.key).replace(Wf,"$&/")+"/")+t)),e.push(r)),1;if(a=0,i=i===""?".":i+":",Vf(t))for(var o=0;o<t.length;o++){s=t[o];var l=i+Rc(s,o);a+=fl(s,e,n,l,r)}else if(l=Nx(t),typeof l=="function")for(t=l.call(t),o=0;!(s=t.next()).done;)s=s.value,l=i+Rc(s,o++),a+=fl(s,e,n,l,r);else if(s==="object")throw e=String(t),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.");return a}function Eo(t,e,n){if(t==null)return t;var i=[],r=0;return fl(t,i,"","",function(s){return e.call(n,s,r++)}),i}function Ux(t){if(t._status===-1){var e=t._result;e=e(),e.then(function(n){(t._status===0||t._status===-1)&&(t._status=1,t._result=n)},function(n){(t._status===0||t._status===-1)&&(t._status=2,t._result=n)}),t._status===-1&&(t._status=0,t._result=e)}if(t._status===1)return t._result.default;throw t._result}var dn={current:null},pl={transition:null},Ox={ReactCurrentDispatcher:dn,ReactCurrentBatchConfig:pl,ReactCurrentOwner:Mh};function T0(){throw Error("act(...) is not supported in production builds of React.")}We.Children={map:Eo,forEach:function(t,e,n){Eo(t,function(){e.apply(this,arguments)},n)},count:function(t){var e=0;return Eo(t,function(){e++}),e},toArray:function(t){return Eo(t,function(e){return e})||[]},only:function(t){if(!Sh(t))throw Error("React.Children.only expected to receive a single React element child.");return t}};We.Component=ea;We.Fragment=wx;We.Profiler=Tx;We.PureComponent=yh;We.StrictMode=Ex;We.Suspense=Rx;We.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Ox;We.act=T0;We.cloneElement=function(t,e,n){if(t==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+t+".");var i=y0({},t.props),r=t.key,s=t.ref,a=t._owner;if(e!=null){if(e.ref!==void 0&&(s=e.ref,a=Mh.current),e.key!==void 0&&(r=""+e.key),t.type&&t.type.defaultProps)var o=t.type.defaultProps;for(l in e)S0.call(e,l)&&!w0.hasOwnProperty(l)&&(i[l]=e[l]===void 0&&o!==void 0?o[l]:e[l])}var l=arguments.length-2;if(l===1)i.children=n;else if(1<l){o=Array(l);for(var c=0;c<l;c++)o[c]=arguments[c+2];i.children=o}return{$$typeof:mo,type:t.type,key:r,ref:s,props:i,_owner:a}};We.createContext=function(t){return t={$$typeof:bx,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},t.Provider={$$typeof:Ax,_context:t},t.Consumer=t};We.createElement=E0;We.createFactory=function(t){var e=E0.bind(null,t);return e.type=t,e};We.createRef=function(){return{current:null}};We.forwardRef=function(t){return{$$typeof:Cx,render:t}};We.isValidElement=Sh;We.lazy=function(t){return{$$typeof:Dx,_payload:{_status:-1,_result:t},_init:Ux}};We.memo=function(t,e){return{$$typeof:Px,type:t,compare:e===void 0?null:e}};We.startTransition=function(t){var e=pl.transition;pl.transition={};try{t()}finally{pl.transition=e}};We.unstable_act=T0;We.useCallback=function(t,e){return dn.current.useCallback(t,e)};We.useContext=function(t){return dn.current.useContext(t)};We.useDebugValue=function(){};We.useDeferredValue=function(t){return dn.current.useDeferredValue(t)};We.useEffect=function(t,e){return dn.current.useEffect(t,e)};We.useId=function(){return dn.current.useId()};We.useImperativeHandle=function(t,e,n){return dn.current.useImperativeHandle(t,e,n)};We.useInsertionEffect=function(t,e){return dn.current.useInsertionEffect(t,e)};We.useLayoutEffect=function(t,e){return dn.current.useLayoutEffect(t,e)};We.useMemo=function(t,e){return dn.current.useMemo(t,e)};We.useReducer=function(t,e,n){return dn.current.useReducer(t,e,n)};We.useRef=function(t){return dn.current.useRef(t)};We.useState=function(t){return dn.current.useState(t)};We.useSyncExternalStore=function(t,e,n){return dn.current.useSyncExternalStore(t,e,n)};We.useTransition=function(){return dn.current.useTransition()};We.version="18.3.1";v0.exports=We;var De=v0.exports;const Fx=Mx(De);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var kx=De,Bx=Symbol.for("react.element"),zx=Symbol.for("react.fragment"),Hx=Object.prototype.hasOwnProperty,Gx=kx.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Vx={key:!0,ref:!0,__self:!0,__source:!0};function A0(t,e,n){var i,r={},s=null,a=null;n!==void 0&&(s=""+n),e.key!==void 0&&(s=""+e.key),e.ref!==void 0&&(a=e.ref);for(i in e)Hx.call(e,i)&&!Vx.hasOwnProperty(i)&&(r[i]=e[i]);if(t&&t.defaultProps)for(i in e=t.defaultProps,e)r[i]===void 0&&(r[i]=e[i]);return{$$typeof:Bx,type:t,key:s,ref:a,props:r,_owner:Gx.current}}oc.Fragment=zx;oc.jsx=A0;oc.jsxs=A0;g0.exports=oc;var N=g0.exports,Ou={},b0={exports:{}},Rn={},C0={exports:{}},R0={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(t){function e(I,$){var J=I.length;I.push($);e:for(;0<J;){var ae=J-1>>>1,ye=I[ae];if(0<r(ye,$))I[ae]=$,I[J]=ye,J=ae;else break e}}function n(I){return I.length===0?null:I[0]}function i(I){if(I.length===0)return null;var $=I[0],J=I.pop();if(J!==$){I[0]=J;e:for(var ae=0,ye=I.length,Ve=ye>>>1;ae<Ve;){var K=2*(ae+1)-1,ne=I[K],ce=K+1,oe=I[ce];if(0>r(ne,J))ce<ye&&0>r(oe,ne)?(I[ae]=oe,I[ce]=J,ae=ce):(I[ae]=ne,I[K]=J,ae=K);else if(ce<ye&&0>r(oe,J))I[ae]=oe,I[ce]=J,ae=ce;else break e}}return $}function r(I,$){var J=I.sortIndex-$.sortIndex;return J!==0?J:I.id-$.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;t.unstable_now=function(){return s.now()}}else{var a=Date,o=a.now();t.unstable_now=function(){return a.now()-o}}var l=[],c=[],u=1,h=null,f=3,p=!1,v=!1,y=!1,m=typeof setTimeout=="function"?setTimeout:null,d=typeof clearTimeout=="function"?clearTimeout:null,g=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function x(I){for(var $=n(c);$!==null;){if($.callback===null)i(c);else if($.startTime<=I)i(c),$.sortIndex=$.expirationTime,e(l,$);else break;$=n(c)}}function _(I){if(y=!1,x(I),!v)if(n(l)!==null)v=!0,Y(R);else{var $=n(c);$!==null&&te(_,$.startTime-I)}}function R(I,$){v=!1,y&&(y=!1,d(b),b=-1),p=!0;var J=f;try{for(x($),h=n(l);h!==null&&(!(h.expirationTime>$)||I&&!D());){var ae=h.callback;if(typeof ae=="function"){h.callback=null,f=h.priorityLevel;var ye=ae(h.expirationTime<=$);$=t.unstable_now(),typeof ye=="function"?h.callback=ye:h===n(l)&&i(l),x($)}else i(l);h=n(l)}if(h!==null)var Ve=!0;else{var K=n(c);K!==null&&te(_,K.startTime-$),Ve=!1}return Ve}finally{h=null,f=J,p=!1}}var T=!1,A=null,b=-1,w=5,M=-1;function D(){return!(t.unstable_now()-M<w)}function V(){if(A!==null){var I=t.unstable_now();M=I;var $=!0;try{$=A(!0,I)}finally{$?z():(T=!1,A=null)}}else T=!1}var z;if(typeof g=="function")z=function(){g(V)};else if(typeof MessageChannel<"u"){var X=new MessageChannel,Z=X.port2;X.port1.onmessage=V,z=function(){Z.postMessage(null)}}else z=function(){m(V,0)};function Y(I){A=I,T||(T=!0,z())}function te(I,$){b=m(function(){I(t.unstable_now())},$)}t.unstable_IdlePriority=5,t.unstable_ImmediatePriority=1,t.unstable_LowPriority=4,t.unstable_NormalPriority=3,t.unstable_Profiling=null,t.unstable_UserBlockingPriority=2,t.unstable_cancelCallback=function(I){I.callback=null},t.unstable_continueExecution=function(){v||p||(v=!0,Y(R))},t.unstable_forceFrameRate=function(I){0>I||125<I?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):w=0<I?Math.floor(1e3/I):5},t.unstable_getCurrentPriorityLevel=function(){return f},t.unstable_getFirstCallbackNode=function(){return n(l)},t.unstable_next=function(I){switch(f){case 1:case 2:case 3:var $=3;break;default:$=f}var J=f;f=$;try{return I()}finally{f=J}},t.unstable_pauseExecution=function(){},t.unstable_requestPaint=function(){},t.unstable_runWithPriority=function(I,$){switch(I){case 1:case 2:case 3:case 4:case 5:break;default:I=3}var J=f;f=I;try{return $()}finally{f=J}},t.unstable_scheduleCallback=function(I,$,J){var ae=t.unstable_now();switch(typeof J=="object"&&J!==null?(J=J.delay,J=typeof J=="number"&&0<J?ae+J:ae):J=ae,I){case 1:var ye=-1;break;case 2:ye=250;break;case 5:ye=1073741823;break;case 4:ye=1e4;break;default:ye=5e3}return ye=J+ye,I={id:u++,callback:$,priorityLevel:I,startTime:J,expirationTime:ye,sortIndex:-1},J>ae?(I.sortIndex=J,e(c,I),n(l)===null&&I===n(c)&&(y?(d(b),b=-1):y=!0,te(_,J-ae))):(I.sortIndex=ye,e(l,I),v||p||(v=!0,Y(R))),I},t.unstable_shouldYield=D,t.unstable_wrapCallback=function(I){var $=f;return function(){var J=f;f=$;try{return I.apply(this,arguments)}finally{f=J}}}})(R0);C0.exports=R0;var Wx=C0.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var jx=De,Cn=Wx;function ie(t){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+t,n=1;n<arguments.length;n++)e+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var P0=new Set,Ka={};function qr(t,e){zs(t,e),zs(t+"Capture",e)}function zs(t,e){for(Ka[t]=e,t=0;t<e.length;t++)P0.add(e[t])}var Ci=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Fu=Object.prototype.hasOwnProperty,Xx=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,jf={},Xf={};function Kx(t){return Fu.call(Xf,t)?!0:Fu.call(jf,t)?!1:Xx.test(t)?Xf[t]=!0:(jf[t]=!0,!1)}function Yx(t,e,n,i){if(n!==null&&n.type===0)return!1;switch(typeof e){case"function":case"symbol":return!0;case"boolean":return i?!1:n!==null?!n.acceptsBooleans:(t=t.toLowerCase().slice(0,5),t!=="data-"&&t!=="aria-");default:return!1}}function qx(t,e,n,i){if(e===null||typeof e>"u"||Yx(t,e,n,i))return!0;if(i)return!1;if(n!==null)switch(n.type){case 3:return!e;case 4:return e===!1;case 5:return isNaN(e);case 6:return isNaN(e)||1>e}return!1}function hn(t,e,n,i,r,s,a){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=i,this.attributeNamespace=r,this.mustUseProperty=n,this.propertyName=t,this.type=e,this.sanitizeURL=s,this.removeEmptyString=a}var Kt={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t){Kt[t]=new hn(t,0,!1,t,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(t){var e=t[0];Kt[e]=new hn(e,1,!1,t[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(t){Kt[t]=new hn(t,2,!1,t.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(t){Kt[t]=new hn(t,2,!1,t,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t){Kt[t]=new hn(t,3,!1,t.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(t){Kt[t]=new hn(t,3,!0,t,null,!1,!1)});["capture","download"].forEach(function(t){Kt[t]=new hn(t,4,!1,t,null,!1,!1)});["cols","rows","size","span"].forEach(function(t){Kt[t]=new hn(t,6,!1,t,null,!1,!1)});["rowSpan","start"].forEach(function(t){Kt[t]=new hn(t,5,!1,t.toLowerCase(),null,!1,!1)});var wh=/[\-:]([a-z])/g;function Eh(t){return t[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t){var e=t.replace(wh,Eh);Kt[e]=new hn(e,1,!1,t,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t){var e=t.replace(wh,Eh);Kt[e]=new hn(e,1,!1,t,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(t){var e=t.replace(wh,Eh);Kt[e]=new hn(e,1,!1,t,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(t){Kt[t]=new hn(t,1,!1,t.toLowerCase(),null,!1,!1)});Kt.xlinkHref=new hn("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(t){Kt[t]=new hn(t,1,!1,t.toLowerCase(),null,!0,!0)});function Th(t,e,n,i){var r=Kt.hasOwnProperty(e)?Kt[e]:null;(r!==null?r.type!==0:i||!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N")&&(qx(e,n,r,i)&&(n=null),i||r===null?Kx(e)&&(n===null?t.removeAttribute(e):t.setAttribute(e,""+n)):r.mustUseProperty?t[r.propertyName]=n===null?r.type===3?!1:"":n:(e=r.attributeName,i=r.attributeNamespace,n===null?t.removeAttribute(e):(r=r.type,n=r===3||r===4&&n===!0?"":""+n,i?t.setAttributeNS(i,e,n):t.setAttribute(e,n))))}var Li=jx.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,To=Symbol.for("react.element"),xs=Symbol.for("react.portal"),ys=Symbol.for("react.fragment"),Ah=Symbol.for("react.strict_mode"),ku=Symbol.for("react.profiler"),D0=Symbol.for("react.provider"),N0=Symbol.for("react.context"),bh=Symbol.for("react.forward_ref"),Bu=Symbol.for("react.suspense"),zu=Symbol.for("react.suspense_list"),Ch=Symbol.for("react.memo"),Wi=Symbol.for("react.lazy"),I0=Symbol.for("react.offscreen"),Kf=Symbol.iterator;function ua(t){return t===null||typeof t!="object"?null:(t=Kf&&t[Kf]||t["@@iterator"],typeof t=="function"?t:null)}var Et=Object.assign,Pc;function ba(t){if(Pc===void 0)try{throw Error()}catch(n){var e=n.stack.trim().match(/\n( *(at )?)/);Pc=e&&e[1]||""}return`
`+Pc+t}var Dc=!1;function Nc(t,e){if(!t||Dc)return"";Dc=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(e)if(e=function(){throw Error()},Object.defineProperty(e.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(e,[])}catch(c){var i=c}Reflect.construct(t,[],e)}else{try{e.call()}catch(c){i=c}t.call(e.prototype)}else{try{throw Error()}catch(c){i=c}t()}}catch(c){if(c&&i&&typeof c.stack=="string"){for(var r=c.stack.split(`
`),s=i.stack.split(`
`),a=r.length-1,o=s.length-1;1<=a&&0<=o&&r[a]!==s[o];)o--;for(;1<=a&&0<=o;a--,o--)if(r[a]!==s[o]){if(a!==1||o!==1)do if(a--,o--,0>o||r[a]!==s[o]){var l=`
`+r[a].replace(" at new "," at ");return t.displayName&&l.includes("<anonymous>")&&(l=l.replace("<anonymous>",t.displayName)),l}while(1<=a&&0<=o);break}}}finally{Dc=!1,Error.prepareStackTrace=n}return(t=t?t.displayName||t.name:"")?ba(t):""}function $x(t){switch(t.tag){case 5:return ba(t.type);case 16:return ba("Lazy");case 13:return ba("Suspense");case 19:return ba("SuspenseList");case 0:case 2:case 15:return t=Nc(t.type,!1),t;case 11:return t=Nc(t.type.render,!1),t;case 1:return t=Nc(t.type,!0),t;default:return""}}function Hu(t){if(t==null)return null;if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case ys:return"Fragment";case xs:return"Portal";case ku:return"Profiler";case Ah:return"StrictMode";case Bu:return"Suspense";case zu:return"SuspenseList"}if(typeof t=="object")switch(t.$$typeof){case N0:return(t.displayName||"Context")+".Consumer";case D0:return(t._context.displayName||"Context")+".Provider";case bh:var e=t.render;return t=t.displayName,t||(t=e.displayName||e.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case Ch:return e=t.displayName||null,e!==null?e:Hu(t.type)||"Memo";case Wi:e=t._payload,t=t._init;try{return Hu(t(e))}catch{}}return null}function Zx(t){var e=t.type;switch(t.tag){case 24:return"Cache";case 9:return(e.displayName||"Context")+".Consumer";case 10:return(e._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return t=e.render,t=t.displayName||t.name||"",e.displayName||(t!==""?"ForwardRef("+t+")":"ForwardRef");case 7:return"Fragment";case 5:return e;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Hu(e);case 8:return e===Ah?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e}return null}function ur(t){switch(typeof t){case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function L0(t){var e=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function Jx(t){var e=L0(t)?"checked":"value",n=Object.getOwnPropertyDescriptor(t.constructor.prototype,e),i=""+t[e];if(!t.hasOwnProperty(e)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var r=n.get,s=n.set;return Object.defineProperty(t,e,{configurable:!0,get:function(){return r.call(this)},set:function(a){i=""+a,s.call(this,a)}}),Object.defineProperty(t,e,{enumerable:n.enumerable}),{getValue:function(){return i},setValue:function(a){i=""+a},stopTracking:function(){t._valueTracker=null,delete t[e]}}}}function Ao(t){t._valueTracker||(t._valueTracker=Jx(t))}function U0(t){if(!t)return!1;var e=t._valueTracker;if(!e)return!0;var n=e.getValue(),i="";return t&&(i=L0(t)?t.checked?"true":"false":t.value),t=i,t!==n?(e.setValue(t),!0):!1}function Dl(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}function Gu(t,e){var n=e.checked;return Et({},e,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??t._wrapperState.initialChecked})}function Yf(t,e){var n=e.defaultValue==null?"":e.defaultValue,i=e.checked!=null?e.checked:e.defaultChecked;n=ur(e.value!=null?e.value:n),t._wrapperState={initialChecked:i,initialValue:n,controlled:e.type==="checkbox"||e.type==="radio"?e.checked!=null:e.value!=null}}function O0(t,e){e=e.checked,e!=null&&Th(t,"checked",e,!1)}function Vu(t,e){O0(t,e);var n=ur(e.value),i=e.type;if(n!=null)i==="number"?(n===0&&t.value===""||t.value!=n)&&(t.value=""+n):t.value!==""+n&&(t.value=""+n);else if(i==="submit"||i==="reset"){t.removeAttribute("value");return}e.hasOwnProperty("value")?Wu(t,e.type,n):e.hasOwnProperty("defaultValue")&&Wu(t,e.type,ur(e.defaultValue)),e.checked==null&&e.defaultChecked!=null&&(t.defaultChecked=!!e.defaultChecked)}function qf(t,e,n){if(e.hasOwnProperty("value")||e.hasOwnProperty("defaultValue")){var i=e.type;if(!(i!=="submit"&&i!=="reset"||e.value!==void 0&&e.value!==null))return;e=""+t._wrapperState.initialValue,n||e===t.value||(t.value=e),t.defaultValue=e}n=t.name,n!==""&&(t.name=""),t.defaultChecked=!!t._wrapperState.initialChecked,n!==""&&(t.name=n)}function Wu(t,e,n){(e!=="number"||Dl(t.ownerDocument)!==t)&&(n==null?t.defaultValue=""+t._wrapperState.initialValue:t.defaultValue!==""+n&&(t.defaultValue=""+n))}var Ca=Array.isArray;function Ns(t,e,n,i){if(t=t.options,e){e={};for(var r=0;r<n.length;r++)e["$"+n[r]]=!0;for(n=0;n<t.length;n++)r=e.hasOwnProperty("$"+t[n].value),t[n].selected!==r&&(t[n].selected=r),r&&i&&(t[n].defaultSelected=!0)}else{for(n=""+ur(n),e=null,r=0;r<t.length;r++){if(t[r].value===n){t[r].selected=!0,i&&(t[r].defaultSelected=!0);return}e!==null||t[r].disabled||(e=t[r])}e!==null&&(e.selected=!0)}}function ju(t,e){if(e.dangerouslySetInnerHTML!=null)throw Error(ie(91));return Et({},e,{value:void 0,defaultValue:void 0,children:""+t._wrapperState.initialValue})}function $f(t,e){var n=e.value;if(n==null){if(n=e.children,e=e.defaultValue,n!=null){if(e!=null)throw Error(ie(92));if(Ca(n)){if(1<n.length)throw Error(ie(93));n=n[0]}e=n}e==null&&(e=""),n=e}t._wrapperState={initialValue:ur(n)}}function F0(t,e){var n=ur(e.value),i=ur(e.defaultValue);n!=null&&(n=""+n,n!==t.value&&(t.value=n),e.defaultValue==null&&t.defaultValue!==n&&(t.defaultValue=n)),i!=null&&(t.defaultValue=""+i)}function Zf(t){var e=t.textContent;e===t._wrapperState.initialValue&&e!==""&&e!==null&&(t.value=e)}function k0(t){switch(t){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Xu(t,e){return t==null||t==="http://www.w3.org/1999/xhtml"?k0(e):t==="http://www.w3.org/2000/svg"&&e==="foreignObject"?"http://www.w3.org/1999/xhtml":t}var bo,B0=function(t){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(e,n,i,r){MSApp.execUnsafeLocalFunction(function(){return t(e,n,i,r)})}:t}(function(t,e){if(t.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in t)t.innerHTML=e;else{for(bo=bo||document.createElement("div"),bo.innerHTML="<svg>"+e.valueOf().toString()+"</svg>",e=bo.firstChild;t.firstChild;)t.removeChild(t.firstChild);for(;e.firstChild;)t.appendChild(e.firstChild)}});function Ya(t,e){if(e){var n=t.firstChild;if(n&&n===t.lastChild&&n.nodeType===3){n.nodeValue=e;return}}t.textContent=e}var La={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Qx=["Webkit","ms","Moz","O"];Object.keys(La).forEach(function(t){Qx.forEach(function(e){e=e+t.charAt(0).toUpperCase()+t.substring(1),La[e]=La[t]})});function z0(t,e,n){return e==null||typeof e=="boolean"||e===""?"":n||typeof e!="number"||e===0||La.hasOwnProperty(t)&&La[t]?(""+e).trim():e+"px"}function H0(t,e){t=t.style;for(var n in e)if(e.hasOwnProperty(n)){var i=n.indexOf("--")===0,r=z0(n,e[n],i);n==="float"&&(n="cssFloat"),i?t.setProperty(n,r):t[n]=r}}var ey=Et({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Ku(t,e){if(e){if(ey[t]&&(e.children!=null||e.dangerouslySetInnerHTML!=null))throw Error(ie(137,t));if(e.dangerouslySetInnerHTML!=null){if(e.children!=null)throw Error(ie(60));if(typeof e.dangerouslySetInnerHTML!="object"||!("__html"in e.dangerouslySetInnerHTML))throw Error(ie(61))}if(e.style!=null&&typeof e.style!="object")throw Error(ie(62))}}function Yu(t,e){if(t.indexOf("-")===-1)return typeof e.is=="string";switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var qu=null;function Rh(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var $u=null,Is=null,Ls=null;function Jf(t){if(t=xo(t)){if(typeof $u!="function")throw Error(ie(280));var e=t.stateNode;e&&(e=hc(e),$u(t.stateNode,t.type,e))}}function G0(t){Is?Ls?Ls.push(t):Ls=[t]:Is=t}function V0(){if(Is){var t=Is,e=Ls;if(Ls=Is=null,Jf(t),e)for(t=0;t<e.length;t++)Jf(e[t])}}function W0(t,e){return t(e)}function j0(){}var Ic=!1;function X0(t,e,n){if(Ic)return t(e,n);Ic=!0;try{return W0(t,e,n)}finally{Ic=!1,(Is!==null||Ls!==null)&&(j0(),V0())}}function qa(t,e){var n=t.stateNode;if(n===null)return null;var i=hc(n);if(i===null)return null;n=i[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(i=!i.disabled)||(t=t.type,i=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!i;break e;default:t=!1}if(t)return null;if(n&&typeof n!="function")throw Error(ie(231,e,typeof n));return n}var Zu=!1;if(Ci)try{var da={};Object.defineProperty(da,"passive",{get:function(){Zu=!0}}),window.addEventListener("test",da,da),window.removeEventListener("test",da,da)}catch{Zu=!1}function ty(t,e,n,i,r,s,a,o,l){var c=Array.prototype.slice.call(arguments,3);try{e.apply(n,c)}catch(u){this.onError(u)}}var Ua=!1,Nl=null,Il=!1,Ju=null,ny={onError:function(t){Ua=!0,Nl=t}};function iy(t,e,n,i,r,s,a,o,l){Ua=!1,Nl=null,ty.apply(ny,arguments)}function ry(t,e,n,i,r,s,a,o,l){if(iy.apply(this,arguments),Ua){if(Ua){var c=Nl;Ua=!1,Nl=null}else throw Error(ie(198));Il||(Il=!0,Ju=c)}}function $r(t){var e=t,n=t;if(t.alternate)for(;e.return;)e=e.return;else{t=e;do e=t,e.flags&4098&&(n=e.return),t=e.return;while(t)}return e.tag===3?n:null}function K0(t){if(t.tag===13){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function Qf(t){if($r(t)!==t)throw Error(ie(188))}function sy(t){var e=t.alternate;if(!e){if(e=$r(t),e===null)throw Error(ie(188));return e!==t?null:t}for(var n=t,i=e;;){var r=n.return;if(r===null)break;var s=r.alternate;if(s===null){if(i=r.return,i!==null){n=i;continue}break}if(r.child===s.child){for(s=r.child;s;){if(s===n)return Qf(r),t;if(s===i)return Qf(r),e;s=s.sibling}throw Error(ie(188))}if(n.return!==i.return)n=r,i=s;else{for(var a=!1,o=r.child;o;){if(o===n){a=!0,n=r,i=s;break}if(o===i){a=!0,i=r,n=s;break}o=o.sibling}if(!a){for(o=s.child;o;){if(o===n){a=!0,n=s,i=r;break}if(o===i){a=!0,i=s,n=r;break}o=o.sibling}if(!a)throw Error(ie(189))}}if(n.alternate!==i)throw Error(ie(190))}if(n.tag!==3)throw Error(ie(188));return n.stateNode.current===n?t:e}function Y0(t){return t=sy(t),t!==null?q0(t):null}function q0(t){if(t.tag===5||t.tag===6)return t;for(t=t.child;t!==null;){var e=q0(t);if(e!==null)return e;t=t.sibling}return null}var $0=Cn.unstable_scheduleCallback,ep=Cn.unstable_cancelCallback,ay=Cn.unstable_shouldYield,oy=Cn.unstable_requestPaint,Ct=Cn.unstable_now,ly=Cn.unstable_getCurrentPriorityLevel,Ph=Cn.unstable_ImmediatePriority,Z0=Cn.unstable_UserBlockingPriority,Ll=Cn.unstable_NormalPriority,cy=Cn.unstable_LowPriority,J0=Cn.unstable_IdlePriority,lc=null,ci=null;function uy(t){if(ci&&typeof ci.onCommitFiberRoot=="function")try{ci.onCommitFiberRoot(lc,t,void 0,(t.current.flags&128)===128)}catch{}}var Qn=Math.clz32?Math.clz32:fy,dy=Math.log,hy=Math.LN2;function fy(t){return t>>>=0,t===0?32:31-(dy(t)/hy|0)|0}var Co=64,Ro=4194304;function Ra(t){switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return t&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return t}}function Ul(t,e){var n=t.pendingLanes;if(n===0)return 0;var i=0,r=t.suspendedLanes,s=t.pingedLanes,a=n&268435455;if(a!==0){var o=a&~r;o!==0?i=Ra(o):(s&=a,s!==0&&(i=Ra(s)))}else a=n&~r,a!==0?i=Ra(a):s!==0&&(i=Ra(s));if(i===0)return 0;if(e!==0&&e!==i&&!(e&r)&&(r=i&-i,s=e&-e,r>=s||r===16&&(s&4194240)!==0))return e;if(i&4&&(i|=n&16),e=t.entangledLanes,e!==0)for(t=t.entanglements,e&=i;0<e;)n=31-Qn(e),r=1<<n,i|=t[n],e&=~r;return i}function py(t,e){switch(t){case 1:case 2:case 4:return e+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function my(t,e){for(var n=t.suspendedLanes,i=t.pingedLanes,r=t.expirationTimes,s=t.pendingLanes;0<s;){var a=31-Qn(s),o=1<<a,l=r[a];l===-1?(!(o&n)||o&i)&&(r[a]=py(o,e)):l<=e&&(t.expiredLanes|=o),s&=~o}}function Qu(t){return t=t.pendingLanes&-1073741825,t!==0?t:t&1073741824?1073741824:0}function Q0(){var t=Co;return Co<<=1,!(Co&4194240)&&(Co=64),t}function Lc(t){for(var e=[],n=0;31>n;n++)e.push(t);return e}function go(t,e,n){t.pendingLanes|=e,e!==536870912&&(t.suspendedLanes=0,t.pingedLanes=0),t=t.eventTimes,e=31-Qn(e),t[e]=n}function gy(t,e){var n=t.pendingLanes&~e;t.pendingLanes=e,t.suspendedLanes=0,t.pingedLanes=0,t.expiredLanes&=e,t.mutableReadLanes&=e,t.entangledLanes&=e,e=t.entanglements;var i=t.eventTimes;for(t=t.expirationTimes;0<n;){var r=31-Qn(n),s=1<<r;e[r]=0,i[r]=-1,t[r]=-1,n&=~s}}function Dh(t,e){var n=t.entangledLanes|=e;for(t=t.entanglements;n;){var i=31-Qn(n),r=1<<i;r&e|t[i]&e&&(t[i]|=e),n&=~r}}var rt=0;function eg(t){return t&=-t,1<t?4<t?t&268435455?16:536870912:4:1}var tg,Nh,ng,ig,rg,ed=!1,Po=[],Qi=null,er=null,tr=null,$a=new Map,Za=new Map,Yi=[],vy="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function tp(t,e){switch(t){case"focusin":case"focusout":Qi=null;break;case"dragenter":case"dragleave":er=null;break;case"mouseover":case"mouseout":tr=null;break;case"pointerover":case"pointerout":$a.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":Za.delete(e.pointerId)}}function ha(t,e,n,i,r,s){return t===null||t.nativeEvent!==s?(t={blockedOn:e,domEventName:n,eventSystemFlags:i,nativeEvent:s,targetContainers:[r]},e!==null&&(e=xo(e),e!==null&&Nh(e)),t):(t.eventSystemFlags|=i,e=t.targetContainers,r!==null&&e.indexOf(r)===-1&&e.push(r),t)}function xy(t,e,n,i,r){switch(e){case"focusin":return Qi=ha(Qi,t,e,n,i,r),!0;case"dragenter":return er=ha(er,t,e,n,i,r),!0;case"mouseover":return tr=ha(tr,t,e,n,i,r),!0;case"pointerover":var s=r.pointerId;return $a.set(s,ha($a.get(s)||null,t,e,n,i,r)),!0;case"gotpointercapture":return s=r.pointerId,Za.set(s,ha(Za.get(s)||null,t,e,n,i,r)),!0}return!1}function sg(t){var e=Or(t.target);if(e!==null){var n=$r(e);if(n!==null){if(e=n.tag,e===13){if(e=K0(n),e!==null){t.blockedOn=e,rg(t.priority,function(){ng(n)});return}}else if(e===3&&n.stateNode.current.memoizedState.isDehydrated){t.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}t.blockedOn=null}function ml(t){if(t.blockedOn!==null)return!1;for(var e=t.targetContainers;0<e.length;){var n=td(t.domEventName,t.eventSystemFlags,e[0],t.nativeEvent);if(n===null){n=t.nativeEvent;var i=new n.constructor(n.type,n);qu=i,n.target.dispatchEvent(i),qu=null}else return e=xo(n),e!==null&&Nh(e),t.blockedOn=n,!1;e.shift()}return!0}function np(t,e,n){ml(t)&&n.delete(e)}function yy(){ed=!1,Qi!==null&&ml(Qi)&&(Qi=null),er!==null&&ml(er)&&(er=null),tr!==null&&ml(tr)&&(tr=null),$a.forEach(np),Za.forEach(np)}function fa(t,e){t.blockedOn===e&&(t.blockedOn=null,ed||(ed=!0,Cn.unstable_scheduleCallback(Cn.unstable_NormalPriority,yy)))}function Ja(t){function e(r){return fa(r,t)}if(0<Po.length){fa(Po[0],t);for(var n=1;n<Po.length;n++){var i=Po[n];i.blockedOn===t&&(i.blockedOn=null)}}for(Qi!==null&&fa(Qi,t),er!==null&&fa(er,t),tr!==null&&fa(tr,t),$a.forEach(e),Za.forEach(e),n=0;n<Yi.length;n++)i=Yi[n],i.blockedOn===t&&(i.blockedOn=null);for(;0<Yi.length&&(n=Yi[0],n.blockedOn===null);)sg(n),n.blockedOn===null&&Yi.shift()}var Us=Li.ReactCurrentBatchConfig,Ol=!0;function _y(t,e,n,i){var r=rt,s=Us.transition;Us.transition=null;try{rt=1,Ih(t,e,n,i)}finally{rt=r,Us.transition=s}}function My(t,e,n,i){var r=rt,s=Us.transition;Us.transition=null;try{rt=4,Ih(t,e,n,i)}finally{rt=r,Us.transition=s}}function Ih(t,e,n,i){if(Ol){var r=td(t,e,n,i);if(r===null)Wc(t,e,i,Fl,n),tp(t,i);else if(xy(r,t,e,n,i))i.stopPropagation();else if(tp(t,i),e&4&&-1<vy.indexOf(t)){for(;r!==null;){var s=xo(r);if(s!==null&&tg(s),s=td(t,e,n,i),s===null&&Wc(t,e,i,Fl,n),s===r)break;r=s}r!==null&&i.stopPropagation()}else Wc(t,e,i,null,n)}}var Fl=null;function td(t,e,n,i){if(Fl=null,t=Rh(i),t=Or(t),t!==null)if(e=$r(t),e===null)t=null;else if(n=e.tag,n===13){if(t=K0(e),t!==null)return t;t=null}else if(n===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;t=null}else e!==t&&(t=null);return Fl=t,null}function ag(t){switch(t){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(ly()){case Ph:return 1;case Z0:return 4;case Ll:case cy:return 16;case J0:return 536870912;default:return 16}default:return 16}}var $i=null,Lh=null,gl=null;function og(){if(gl)return gl;var t,e=Lh,n=e.length,i,r="value"in $i?$i.value:$i.textContent,s=r.length;for(t=0;t<n&&e[t]===r[t];t++);var a=n-t;for(i=1;i<=a&&e[n-i]===r[s-i];i++);return gl=r.slice(t,1<i?1-i:void 0)}function vl(t){var e=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&e===13&&(t=13)):t=e,t===10&&(t=13),32<=t||t===13?t:0}function Do(){return!0}function ip(){return!1}function Pn(t){function e(n,i,r,s,a){this._reactName=n,this._targetInst=r,this.type=i,this.nativeEvent=s,this.target=a,this.currentTarget=null;for(var o in t)t.hasOwnProperty(o)&&(n=t[o],this[o]=n?n(s):s[o]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?Do:ip,this.isPropagationStopped=ip,this}return Et(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Do)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Do)},persist:function(){},isPersistent:Do}),e}var ta={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Uh=Pn(ta),vo=Et({},ta,{view:0,detail:0}),Sy=Pn(vo),Uc,Oc,pa,cc=Et({},vo,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Oh,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==pa&&(pa&&t.type==="mousemove"?(Uc=t.screenX-pa.screenX,Oc=t.screenY-pa.screenY):Oc=Uc=0,pa=t),Uc)},movementY:function(t){return"movementY"in t?t.movementY:Oc}}),rp=Pn(cc),wy=Et({},cc,{dataTransfer:0}),Ey=Pn(wy),Ty=Et({},vo,{relatedTarget:0}),Fc=Pn(Ty),Ay=Et({},ta,{animationName:0,elapsedTime:0,pseudoElement:0}),by=Pn(Ay),Cy=Et({},ta,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),Ry=Pn(Cy),Py=Et({},ta,{data:0}),sp=Pn(Py),Dy={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Ny={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Iy={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Ly(t){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(t):(t=Iy[t])?!!e[t]:!1}function Oh(){return Ly}var Uy=Et({},vo,{key:function(t){if(t.key){var e=Dy[t.key]||t.key;if(e!=="Unidentified")return e}return t.type==="keypress"?(t=vl(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?Ny[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Oh,charCode:function(t){return t.type==="keypress"?vl(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?vl(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),Oy=Pn(Uy),Fy=Et({},cc,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),ap=Pn(Fy),ky=Et({},vo,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Oh}),By=Pn(ky),zy=Et({},ta,{propertyName:0,elapsedTime:0,pseudoElement:0}),Hy=Pn(zy),Gy=Et({},cc,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),Vy=Pn(Gy),Wy=[9,13,27,32],Fh=Ci&&"CompositionEvent"in window,Oa=null;Ci&&"documentMode"in document&&(Oa=document.documentMode);var jy=Ci&&"TextEvent"in window&&!Oa,lg=Ci&&(!Fh||Oa&&8<Oa&&11>=Oa),op=" ",lp=!1;function cg(t,e){switch(t){case"keyup":return Wy.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function ug(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var _s=!1;function Xy(t,e){switch(t){case"compositionend":return ug(e);case"keypress":return e.which!==32?null:(lp=!0,op);case"textInput":return t=e.data,t===op&&lp?null:t;default:return null}}function Ky(t,e){if(_s)return t==="compositionend"||!Fh&&cg(t,e)?(t=og(),gl=Lh=$i=null,_s=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return lg&&e.locale!=="ko"?null:e.data;default:return null}}var Yy={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function cp(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e==="input"?!!Yy[t.type]:e==="textarea"}function dg(t,e,n,i){G0(i),e=kl(e,"onChange"),0<e.length&&(n=new Uh("onChange","change",null,n,i),t.push({event:n,listeners:e}))}var Fa=null,Qa=null;function qy(t){Sg(t,0)}function uc(t){var e=ws(t);if(U0(e))return t}function $y(t,e){if(t==="change")return e}var hg=!1;if(Ci){var kc;if(Ci){var Bc="oninput"in document;if(!Bc){var up=document.createElement("div");up.setAttribute("oninput","return;"),Bc=typeof up.oninput=="function"}kc=Bc}else kc=!1;hg=kc&&(!document.documentMode||9<document.documentMode)}function dp(){Fa&&(Fa.detachEvent("onpropertychange",fg),Qa=Fa=null)}function fg(t){if(t.propertyName==="value"&&uc(Qa)){var e=[];dg(e,Qa,t,Rh(t)),X0(qy,e)}}function Zy(t,e,n){t==="focusin"?(dp(),Fa=e,Qa=n,Fa.attachEvent("onpropertychange",fg)):t==="focusout"&&dp()}function Jy(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return uc(Qa)}function Qy(t,e){if(t==="click")return uc(e)}function e_(t,e){if(t==="input"||t==="change")return uc(e)}function t_(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var ti=typeof Object.is=="function"?Object.is:t_;function eo(t,e){if(ti(t,e))return!0;if(typeof t!="object"||t===null||typeof e!="object"||e===null)return!1;var n=Object.keys(t),i=Object.keys(e);if(n.length!==i.length)return!1;for(i=0;i<n.length;i++){var r=n[i];if(!Fu.call(e,r)||!ti(t[r],e[r]))return!1}return!0}function hp(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function fp(t,e){var n=hp(t);t=0;for(var i;n;){if(n.nodeType===3){if(i=t+n.textContent.length,t<=e&&i>=e)return{node:n,offset:e-t};t=i}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=hp(n)}}function pg(t,e){return t&&e?t===e?!0:t&&t.nodeType===3?!1:e&&e.nodeType===3?pg(t,e.parentNode):"contains"in t?t.contains(e):t.compareDocumentPosition?!!(t.compareDocumentPosition(e)&16):!1:!1}function mg(){for(var t=window,e=Dl();e instanceof t.HTMLIFrameElement;){try{var n=typeof e.contentWindow.location.href=="string"}catch{n=!1}if(n)t=e.contentWindow;else break;e=Dl(t.document)}return e}function kh(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e&&(e==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||e==="textarea"||t.contentEditable==="true")}function n_(t){var e=mg(),n=t.focusedElem,i=t.selectionRange;if(e!==n&&n&&n.ownerDocument&&pg(n.ownerDocument.documentElement,n)){if(i!==null&&kh(n)){if(e=i.start,t=i.end,t===void 0&&(t=e),"selectionStart"in n)n.selectionStart=e,n.selectionEnd=Math.min(t,n.value.length);else if(t=(e=n.ownerDocument||document)&&e.defaultView||window,t.getSelection){t=t.getSelection();var r=n.textContent.length,s=Math.min(i.start,r);i=i.end===void 0?s:Math.min(i.end,r),!t.extend&&s>i&&(r=i,i=s,s=r),r=fp(n,s);var a=fp(n,i);r&&a&&(t.rangeCount!==1||t.anchorNode!==r.node||t.anchorOffset!==r.offset||t.focusNode!==a.node||t.focusOffset!==a.offset)&&(e=e.createRange(),e.setStart(r.node,r.offset),t.removeAllRanges(),s>i?(t.addRange(e),t.extend(a.node,a.offset)):(e.setEnd(a.node,a.offset),t.addRange(e)))}}for(e=[],t=n;t=t.parentNode;)t.nodeType===1&&e.push({element:t,left:t.scrollLeft,top:t.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<e.length;n++)t=e[n],t.element.scrollLeft=t.left,t.element.scrollTop=t.top}}var i_=Ci&&"documentMode"in document&&11>=document.documentMode,Ms=null,nd=null,ka=null,id=!1;function pp(t,e,n){var i=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;id||Ms==null||Ms!==Dl(i)||(i=Ms,"selectionStart"in i&&kh(i)?i={start:i.selectionStart,end:i.selectionEnd}:(i=(i.ownerDocument&&i.ownerDocument.defaultView||window).getSelection(),i={anchorNode:i.anchorNode,anchorOffset:i.anchorOffset,focusNode:i.focusNode,focusOffset:i.focusOffset}),ka&&eo(ka,i)||(ka=i,i=kl(nd,"onSelect"),0<i.length&&(e=new Uh("onSelect","select",null,e,n),t.push({event:e,listeners:i}),e.target=Ms)))}function No(t,e){var n={};return n[t.toLowerCase()]=e.toLowerCase(),n["Webkit"+t]="webkit"+e,n["Moz"+t]="moz"+e,n}var Ss={animationend:No("Animation","AnimationEnd"),animationiteration:No("Animation","AnimationIteration"),animationstart:No("Animation","AnimationStart"),transitionend:No("Transition","TransitionEnd")},zc={},gg={};Ci&&(gg=document.createElement("div").style,"AnimationEvent"in window||(delete Ss.animationend.animation,delete Ss.animationiteration.animation,delete Ss.animationstart.animation),"TransitionEvent"in window||delete Ss.transitionend.transition);function dc(t){if(zc[t])return zc[t];if(!Ss[t])return t;var e=Ss[t],n;for(n in e)if(e.hasOwnProperty(n)&&n in gg)return zc[t]=e[n];return t}var vg=dc("animationend"),xg=dc("animationiteration"),yg=dc("animationstart"),_g=dc("transitionend"),Mg=new Map,mp="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function mr(t,e){Mg.set(t,e),qr(e,[t])}for(var Hc=0;Hc<mp.length;Hc++){var Gc=mp[Hc],r_=Gc.toLowerCase(),s_=Gc[0].toUpperCase()+Gc.slice(1);mr(r_,"on"+s_)}mr(vg,"onAnimationEnd");mr(xg,"onAnimationIteration");mr(yg,"onAnimationStart");mr("dblclick","onDoubleClick");mr("focusin","onFocus");mr("focusout","onBlur");mr(_g,"onTransitionEnd");zs("onMouseEnter",["mouseout","mouseover"]);zs("onMouseLeave",["mouseout","mouseover"]);zs("onPointerEnter",["pointerout","pointerover"]);zs("onPointerLeave",["pointerout","pointerover"]);qr("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));qr("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));qr("onBeforeInput",["compositionend","keypress","textInput","paste"]);qr("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));qr("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));qr("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Pa="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),a_=new Set("cancel close invalid load scroll toggle".split(" ").concat(Pa));function gp(t,e,n){var i=t.type||"unknown-event";t.currentTarget=n,ry(i,e,void 0,t),t.currentTarget=null}function Sg(t,e){e=(e&4)!==0;for(var n=0;n<t.length;n++){var i=t[n],r=i.event;i=i.listeners;e:{var s=void 0;if(e)for(var a=i.length-1;0<=a;a--){var o=i[a],l=o.instance,c=o.currentTarget;if(o=o.listener,l!==s&&r.isPropagationStopped())break e;gp(r,o,c),s=l}else for(a=0;a<i.length;a++){if(o=i[a],l=o.instance,c=o.currentTarget,o=o.listener,l!==s&&r.isPropagationStopped())break e;gp(r,o,c),s=l}}}if(Il)throw t=Ju,Il=!1,Ju=null,t}function vt(t,e){var n=e[ld];n===void 0&&(n=e[ld]=new Set);var i=t+"__bubble";n.has(i)||(wg(e,t,2,!1),n.add(i))}function Vc(t,e,n){var i=0;e&&(i|=4),wg(n,t,i,e)}var Io="_reactListening"+Math.random().toString(36).slice(2);function to(t){if(!t[Io]){t[Io]=!0,P0.forEach(function(n){n!=="selectionchange"&&(a_.has(n)||Vc(n,!1,t),Vc(n,!0,t))});var e=t.nodeType===9?t:t.ownerDocument;e===null||e[Io]||(e[Io]=!0,Vc("selectionchange",!1,e))}}function wg(t,e,n,i){switch(ag(e)){case 1:var r=_y;break;case 4:r=My;break;default:r=Ih}n=r.bind(null,e,n,t),r=void 0,!Zu||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(r=!0),i?r!==void 0?t.addEventListener(e,n,{capture:!0,passive:r}):t.addEventListener(e,n,!0):r!==void 0?t.addEventListener(e,n,{passive:r}):t.addEventListener(e,n,!1)}function Wc(t,e,n,i,r){var s=i;if(!(e&1)&&!(e&2)&&i!==null)e:for(;;){if(i===null)return;var a=i.tag;if(a===3||a===4){var o=i.stateNode.containerInfo;if(o===r||o.nodeType===8&&o.parentNode===r)break;if(a===4)for(a=i.return;a!==null;){var l=a.tag;if((l===3||l===4)&&(l=a.stateNode.containerInfo,l===r||l.nodeType===8&&l.parentNode===r))return;a=a.return}for(;o!==null;){if(a=Or(o),a===null)return;if(l=a.tag,l===5||l===6){i=s=a;continue e}o=o.parentNode}}i=i.return}X0(function(){var c=s,u=Rh(n),h=[];e:{var f=Mg.get(t);if(f!==void 0){var p=Uh,v=t;switch(t){case"keypress":if(vl(n)===0)break e;case"keydown":case"keyup":p=Oy;break;case"focusin":v="focus",p=Fc;break;case"focusout":v="blur",p=Fc;break;case"beforeblur":case"afterblur":p=Fc;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":p=rp;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":p=Ey;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":p=By;break;case vg:case xg:case yg:p=by;break;case _g:p=Hy;break;case"scroll":p=Sy;break;case"wheel":p=Vy;break;case"copy":case"cut":case"paste":p=Ry;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":p=ap}var y=(e&4)!==0,m=!y&&t==="scroll",d=y?f!==null?f+"Capture":null:f;y=[];for(var g=c,x;g!==null;){x=g;var _=x.stateNode;if(x.tag===5&&_!==null&&(x=_,d!==null&&(_=qa(g,d),_!=null&&y.push(no(g,_,x)))),m)break;g=g.return}0<y.length&&(f=new p(f,v,null,n,u),h.push({event:f,listeners:y}))}}if(!(e&7)){e:{if(f=t==="mouseover"||t==="pointerover",p=t==="mouseout"||t==="pointerout",f&&n!==qu&&(v=n.relatedTarget||n.fromElement)&&(Or(v)||v[Ri]))break e;if((p||f)&&(f=u.window===u?u:(f=u.ownerDocument)?f.defaultView||f.parentWindow:window,p?(v=n.relatedTarget||n.toElement,p=c,v=v?Or(v):null,v!==null&&(m=$r(v),v!==m||v.tag!==5&&v.tag!==6)&&(v=null)):(p=null,v=c),p!==v)){if(y=rp,_="onMouseLeave",d="onMouseEnter",g="mouse",(t==="pointerout"||t==="pointerover")&&(y=ap,_="onPointerLeave",d="onPointerEnter",g="pointer"),m=p==null?f:ws(p),x=v==null?f:ws(v),f=new y(_,g+"leave",p,n,u),f.target=m,f.relatedTarget=x,_=null,Or(u)===c&&(y=new y(d,g+"enter",v,n,u),y.target=x,y.relatedTarget=m,_=y),m=_,p&&v)t:{for(y=p,d=v,g=0,x=y;x;x=ts(x))g++;for(x=0,_=d;_;_=ts(_))x++;for(;0<g-x;)y=ts(y),g--;for(;0<x-g;)d=ts(d),x--;for(;g--;){if(y===d||d!==null&&y===d.alternate)break t;y=ts(y),d=ts(d)}y=null}else y=null;p!==null&&vp(h,f,p,y,!1),v!==null&&m!==null&&vp(h,m,v,y,!0)}}e:{if(f=c?ws(c):window,p=f.nodeName&&f.nodeName.toLowerCase(),p==="select"||p==="input"&&f.type==="file")var R=$y;else if(cp(f))if(hg)R=e_;else{R=Jy;var T=Zy}else(p=f.nodeName)&&p.toLowerCase()==="input"&&(f.type==="checkbox"||f.type==="radio")&&(R=Qy);if(R&&(R=R(t,c))){dg(h,R,n,u);break e}T&&T(t,f,c),t==="focusout"&&(T=f._wrapperState)&&T.controlled&&f.type==="number"&&Wu(f,"number",f.value)}switch(T=c?ws(c):window,t){case"focusin":(cp(T)||T.contentEditable==="true")&&(Ms=T,nd=c,ka=null);break;case"focusout":ka=nd=Ms=null;break;case"mousedown":id=!0;break;case"contextmenu":case"mouseup":case"dragend":id=!1,pp(h,n,u);break;case"selectionchange":if(i_)break;case"keydown":case"keyup":pp(h,n,u)}var A;if(Fh)e:{switch(t){case"compositionstart":var b="onCompositionStart";break e;case"compositionend":b="onCompositionEnd";break e;case"compositionupdate":b="onCompositionUpdate";break e}b=void 0}else _s?cg(t,n)&&(b="onCompositionEnd"):t==="keydown"&&n.keyCode===229&&(b="onCompositionStart");b&&(lg&&n.locale!=="ko"&&(_s||b!=="onCompositionStart"?b==="onCompositionEnd"&&_s&&(A=og()):($i=u,Lh="value"in $i?$i.value:$i.textContent,_s=!0)),T=kl(c,b),0<T.length&&(b=new sp(b,t,null,n,u),h.push({event:b,listeners:T}),A?b.data=A:(A=ug(n),A!==null&&(b.data=A)))),(A=jy?Xy(t,n):Ky(t,n))&&(c=kl(c,"onBeforeInput"),0<c.length&&(u=new sp("onBeforeInput","beforeinput",null,n,u),h.push({event:u,listeners:c}),u.data=A))}Sg(h,e)})}function no(t,e,n){return{instance:t,listener:e,currentTarget:n}}function kl(t,e){for(var n=e+"Capture",i=[];t!==null;){var r=t,s=r.stateNode;r.tag===5&&s!==null&&(r=s,s=qa(t,n),s!=null&&i.unshift(no(t,s,r)),s=qa(t,e),s!=null&&i.push(no(t,s,r))),t=t.return}return i}function ts(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5);return t||null}function vp(t,e,n,i,r){for(var s=e._reactName,a=[];n!==null&&n!==i;){var o=n,l=o.alternate,c=o.stateNode;if(l!==null&&l===i)break;o.tag===5&&c!==null&&(o=c,r?(l=qa(n,s),l!=null&&a.unshift(no(n,l,o))):r||(l=qa(n,s),l!=null&&a.push(no(n,l,o)))),n=n.return}a.length!==0&&t.push({event:e,listeners:a})}var o_=/\r\n?/g,l_=/\u0000|\uFFFD/g;function xp(t){return(typeof t=="string"?t:""+t).replace(o_,`
`).replace(l_,"")}function Lo(t,e,n){if(e=xp(e),xp(t)!==e&&n)throw Error(ie(425))}function Bl(){}var rd=null,sd=null;function ad(t,e){return t==="textarea"||t==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var od=typeof setTimeout=="function"?setTimeout:void 0,c_=typeof clearTimeout=="function"?clearTimeout:void 0,yp=typeof Promise=="function"?Promise:void 0,u_=typeof queueMicrotask=="function"?queueMicrotask:typeof yp<"u"?function(t){return yp.resolve(null).then(t).catch(d_)}:od;function d_(t){setTimeout(function(){throw t})}function jc(t,e){var n=e,i=0;do{var r=n.nextSibling;if(t.removeChild(n),r&&r.nodeType===8)if(n=r.data,n==="/$"){if(i===0){t.removeChild(r),Ja(e);return}i--}else n!=="$"&&n!=="$?"&&n!=="$!"||i++;n=r}while(n);Ja(e)}function nr(t){for(;t!=null;t=t.nextSibling){var e=t.nodeType;if(e===1||e===3)break;if(e===8){if(e=t.data,e==="$"||e==="$!"||e==="$?")break;if(e==="/$")return null}}return t}function _p(t){t=t.previousSibling;for(var e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="$"||n==="$!"||n==="$?"){if(e===0)return t;e--}else n==="/$"&&e++}t=t.previousSibling}return null}var na=Math.random().toString(36).slice(2),oi="__reactFiber$"+na,io="__reactProps$"+na,Ri="__reactContainer$"+na,ld="__reactEvents$"+na,h_="__reactListeners$"+na,f_="__reactHandles$"+na;function Or(t){var e=t[oi];if(e)return e;for(var n=t.parentNode;n;){if(e=n[Ri]||n[oi]){if(n=e.alternate,e.child!==null||n!==null&&n.child!==null)for(t=_p(t);t!==null;){if(n=t[oi])return n;t=_p(t)}return e}t=n,n=t.parentNode}return null}function xo(t){return t=t[oi]||t[Ri],!t||t.tag!==5&&t.tag!==6&&t.tag!==13&&t.tag!==3?null:t}function ws(t){if(t.tag===5||t.tag===6)return t.stateNode;throw Error(ie(33))}function hc(t){return t[io]||null}var cd=[],Es=-1;function gr(t){return{current:t}}function xt(t){0>Es||(t.current=cd[Es],cd[Es]=null,Es--)}function pt(t,e){Es++,cd[Es]=t.current,t.current=e}var dr={},nn=gr(dr),vn=gr(!1),Gr=dr;function Hs(t,e){var n=t.type.contextTypes;if(!n)return dr;var i=t.stateNode;if(i&&i.__reactInternalMemoizedUnmaskedChildContext===e)return i.__reactInternalMemoizedMaskedChildContext;var r={},s;for(s in n)r[s]=e[s];return i&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=e,t.__reactInternalMemoizedMaskedChildContext=r),r}function xn(t){return t=t.childContextTypes,t!=null}function zl(){xt(vn),xt(nn)}function Mp(t,e,n){if(nn.current!==dr)throw Error(ie(168));pt(nn,e),pt(vn,n)}function Eg(t,e,n){var i=t.stateNode;if(e=e.childContextTypes,typeof i.getChildContext!="function")return n;i=i.getChildContext();for(var r in i)if(!(r in e))throw Error(ie(108,Zx(t)||"Unknown",r));return Et({},n,i)}function Hl(t){return t=(t=t.stateNode)&&t.__reactInternalMemoizedMergedChildContext||dr,Gr=nn.current,pt(nn,t),pt(vn,vn.current),!0}function Sp(t,e,n){var i=t.stateNode;if(!i)throw Error(ie(169));n?(t=Eg(t,e,Gr),i.__reactInternalMemoizedMergedChildContext=t,xt(vn),xt(nn),pt(nn,t)):xt(vn),pt(vn,n)}var Mi=null,fc=!1,Xc=!1;function Tg(t){Mi===null?Mi=[t]:Mi.push(t)}function p_(t){fc=!0,Tg(t)}function vr(){if(!Xc&&Mi!==null){Xc=!0;var t=0,e=rt;try{var n=Mi;for(rt=1;t<n.length;t++){var i=n[t];do i=i(!0);while(i!==null)}Mi=null,fc=!1}catch(r){throw Mi!==null&&(Mi=Mi.slice(t+1)),$0(Ph,vr),r}finally{rt=e,Xc=!1}}return null}var Ts=[],As=0,Gl=null,Vl=0,In=[],Ln=0,Vr=null,Si=1,wi="";function br(t,e){Ts[As++]=Vl,Ts[As++]=Gl,Gl=t,Vl=e}function Ag(t,e,n){In[Ln++]=Si,In[Ln++]=wi,In[Ln++]=Vr,Vr=t;var i=Si;t=wi;var r=32-Qn(i)-1;i&=~(1<<r),n+=1;var s=32-Qn(e)+r;if(30<s){var a=r-r%5;s=(i&(1<<a)-1).toString(32),i>>=a,r-=a,Si=1<<32-Qn(e)+r|n<<r|i,wi=s+t}else Si=1<<s|n<<r|i,wi=t}function Bh(t){t.return!==null&&(br(t,1),Ag(t,1,0))}function zh(t){for(;t===Gl;)Gl=Ts[--As],Ts[As]=null,Vl=Ts[--As],Ts[As]=null;for(;t===Vr;)Vr=In[--Ln],In[Ln]=null,wi=In[--Ln],In[Ln]=null,Si=In[--Ln],In[Ln]=null}var An=null,Tn=null,yt=!1,qn=null;function bg(t,e){var n=Fn(5,null,null,0);n.elementType="DELETED",n.stateNode=e,n.return=t,e=t.deletions,e===null?(t.deletions=[n],t.flags|=16):e.push(n)}function wp(t,e){switch(t.tag){case 5:var n=t.type;return e=e.nodeType!==1||n.toLowerCase()!==e.nodeName.toLowerCase()?null:e,e!==null?(t.stateNode=e,An=t,Tn=nr(e.firstChild),!0):!1;case 6:return e=t.pendingProps===""||e.nodeType!==3?null:e,e!==null?(t.stateNode=e,An=t,Tn=null,!0):!1;case 13:return e=e.nodeType!==8?null:e,e!==null?(n=Vr!==null?{id:Si,overflow:wi}:null,t.memoizedState={dehydrated:e,treeContext:n,retryLane:1073741824},n=Fn(18,null,null,0),n.stateNode=e,n.return=t,t.child=n,An=t,Tn=null,!0):!1;default:return!1}}function ud(t){return(t.mode&1)!==0&&(t.flags&128)===0}function dd(t){if(yt){var e=Tn;if(e){var n=e;if(!wp(t,e)){if(ud(t))throw Error(ie(418));e=nr(n.nextSibling);var i=An;e&&wp(t,e)?bg(i,n):(t.flags=t.flags&-4097|2,yt=!1,An=t)}}else{if(ud(t))throw Error(ie(418));t.flags=t.flags&-4097|2,yt=!1,An=t}}}function Ep(t){for(t=t.return;t!==null&&t.tag!==5&&t.tag!==3&&t.tag!==13;)t=t.return;An=t}function Uo(t){if(t!==An)return!1;if(!yt)return Ep(t),yt=!0,!1;var e;if((e=t.tag!==3)&&!(e=t.tag!==5)&&(e=t.type,e=e!=="head"&&e!=="body"&&!ad(t.type,t.memoizedProps)),e&&(e=Tn)){if(ud(t))throw Cg(),Error(ie(418));for(;e;)bg(t,e),e=nr(e.nextSibling)}if(Ep(t),t.tag===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(ie(317));e:{for(t=t.nextSibling,e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="/$"){if(e===0){Tn=nr(t.nextSibling);break e}e--}else n!=="$"&&n!=="$!"&&n!=="$?"||e++}t=t.nextSibling}Tn=null}}else Tn=An?nr(t.stateNode.nextSibling):null;return!0}function Cg(){for(var t=Tn;t;)t=nr(t.nextSibling)}function Gs(){Tn=An=null,yt=!1}function Hh(t){qn===null?qn=[t]:qn.push(t)}var m_=Li.ReactCurrentBatchConfig;function ma(t,e,n){if(t=n.ref,t!==null&&typeof t!="function"&&typeof t!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(ie(309));var i=n.stateNode}if(!i)throw Error(ie(147,t));var r=i,s=""+t;return e!==null&&e.ref!==null&&typeof e.ref=="function"&&e.ref._stringRef===s?e.ref:(e=function(a){var o=r.refs;a===null?delete o[s]:o[s]=a},e._stringRef=s,e)}if(typeof t!="string")throw Error(ie(284));if(!n._owner)throw Error(ie(290,t))}return t}function Oo(t,e){throw t=Object.prototype.toString.call(e),Error(ie(31,t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t))}function Tp(t){var e=t._init;return e(t._payload)}function Rg(t){function e(d,g){if(t){var x=d.deletions;x===null?(d.deletions=[g],d.flags|=16):x.push(g)}}function n(d,g){if(!t)return null;for(;g!==null;)e(d,g),g=g.sibling;return null}function i(d,g){for(d=new Map;g!==null;)g.key!==null?d.set(g.key,g):d.set(g.index,g),g=g.sibling;return d}function r(d,g){return d=ar(d,g),d.index=0,d.sibling=null,d}function s(d,g,x){return d.index=x,t?(x=d.alternate,x!==null?(x=x.index,x<g?(d.flags|=2,g):x):(d.flags|=2,g)):(d.flags|=1048576,g)}function a(d){return t&&d.alternate===null&&(d.flags|=2),d}function o(d,g,x,_){return g===null||g.tag!==6?(g=Qc(x,d.mode,_),g.return=d,g):(g=r(g,x),g.return=d,g)}function l(d,g,x,_){var R=x.type;return R===ys?u(d,g,x.props.children,_,x.key):g!==null&&(g.elementType===R||typeof R=="object"&&R!==null&&R.$$typeof===Wi&&Tp(R)===g.type)?(_=r(g,x.props),_.ref=ma(d,g,x),_.return=d,_):(_=El(x.type,x.key,x.props,null,d.mode,_),_.ref=ma(d,g,x),_.return=d,_)}function c(d,g,x,_){return g===null||g.tag!==4||g.stateNode.containerInfo!==x.containerInfo||g.stateNode.implementation!==x.implementation?(g=eu(x,d.mode,_),g.return=d,g):(g=r(g,x.children||[]),g.return=d,g)}function u(d,g,x,_,R){return g===null||g.tag!==7?(g=zr(x,d.mode,_,R),g.return=d,g):(g=r(g,x),g.return=d,g)}function h(d,g,x){if(typeof g=="string"&&g!==""||typeof g=="number")return g=Qc(""+g,d.mode,x),g.return=d,g;if(typeof g=="object"&&g!==null){switch(g.$$typeof){case To:return x=El(g.type,g.key,g.props,null,d.mode,x),x.ref=ma(d,null,g),x.return=d,x;case xs:return g=eu(g,d.mode,x),g.return=d,g;case Wi:var _=g._init;return h(d,_(g._payload),x)}if(Ca(g)||ua(g))return g=zr(g,d.mode,x,null),g.return=d,g;Oo(d,g)}return null}function f(d,g,x,_){var R=g!==null?g.key:null;if(typeof x=="string"&&x!==""||typeof x=="number")return R!==null?null:o(d,g,""+x,_);if(typeof x=="object"&&x!==null){switch(x.$$typeof){case To:return x.key===R?l(d,g,x,_):null;case xs:return x.key===R?c(d,g,x,_):null;case Wi:return R=x._init,f(d,g,R(x._payload),_)}if(Ca(x)||ua(x))return R!==null?null:u(d,g,x,_,null);Oo(d,x)}return null}function p(d,g,x,_,R){if(typeof _=="string"&&_!==""||typeof _=="number")return d=d.get(x)||null,o(g,d,""+_,R);if(typeof _=="object"&&_!==null){switch(_.$$typeof){case To:return d=d.get(_.key===null?x:_.key)||null,l(g,d,_,R);case xs:return d=d.get(_.key===null?x:_.key)||null,c(g,d,_,R);case Wi:var T=_._init;return p(d,g,x,T(_._payload),R)}if(Ca(_)||ua(_))return d=d.get(x)||null,u(g,d,_,R,null);Oo(g,_)}return null}function v(d,g,x,_){for(var R=null,T=null,A=g,b=g=0,w=null;A!==null&&b<x.length;b++){A.index>b?(w=A,A=null):w=A.sibling;var M=f(d,A,x[b],_);if(M===null){A===null&&(A=w);break}t&&A&&M.alternate===null&&e(d,A),g=s(M,g,b),T===null?R=M:T.sibling=M,T=M,A=w}if(b===x.length)return n(d,A),yt&&br(d,b),R;if(A===null){for(;b<x.length;b++)A=h(d,x[b],_),A!==null&&(g=s(A,g,b),T===null?R=A:T.sibling=A,T=A);return yt&&br(d,b),R}for(A=i(d,A);b<x.length;b++)w=p(A,d,b,x[b],_),w!==null&&(t&&w.alternate!==null&&A.delete(w.key===null?b:w.key),g=s(w,g,b),T===null?R=w:T.sibling=w,T=w);return t&&A.forEach(function(D){return e(d,D)}),yt&&br(d,b),R}function y(d,g,x,_){var R=ua(x);if(typeof R!="function")throw Error(ie(150));if(x=R.call(x),x==null)throw Error(ie(151));for(var T=R=null,A=g,b=g=0,w=null,M=x.next();A!==null&&!M.done;b++,M=x.next()){A.index>b?(w=A,A=null):w=A.sibling;var D=f(d,A,M.value,_);if(D===null){A===null&&(A=w);break}t&&A&&D.alternate===null&&e(d,A),g=s(D,g,b),T===null?R=D:T.sibling=D,T=D,A=w}if(M.done)return n(d,A),yt&&br(d,b),R;if(A===null){for(;!M.done;b++,M=x.next())M=h(d,M.value,_),M!==null&&(g=s(M,g,b),T===null?R=M:T.sibling=M,T=M);return yt&&br(d,b),R}for(A=i(d,A);!M.done;b++,M=x.next())M=p(A,d,b,M.value,_),M!==null&&(t&&M.alternate!==null&&A.delete(M.key===null?b:M.key),g=s(M,g,b),T===null?R=M:T.sibling=M,T=M);return t&&A.forEach(function(V){return e(d,V)}),yt&&br(d,b),R}function m(d,g,x,_){if(typeof x=="object"&&x!==null&&x.type===ys&&x.key===null&&(x=x.props.children),typeof x=="object"&&x!==null){switch(x.$$typeof){case To:e:{for(var R=x.key,T=g;T!==null;){if(T.key===R){if(R=x.type,R===ys){if(T.tag===7){n(d,T.sibling),g=r(T,x.props.children),g.return=d,d=g;break e}}else if(T.elementType===R||typeof R=="object"&&R!==null&&R.$$typeof===Wi&&Tp(R)===T.type){n(d,T.sibling),g=r(T,x.props),g.ref=ma(d,T,x),g.return=d,d=g;break e}n(d,T);break}else e(d,T);T=T.sibling}x.type===ys?(g=zr(x.props.children,d.mode,_,x.key),g.return=d,d=g):(_=El(x.type,x.key,x.props,null,d.mode,_),_.ref=ma(d,g,x),_.return=d,d=_)}return a(d);case xs:e:{for(T=x.key;g!==null;){if(g.key===T)if(g.tag===4&&g.stateNode.containerInfo===x.containerInfo&&g.stateNode.implementation===x.implementation){n(d,g.sibling),g=r(g,x.children||[]),g.return=d,d=g;break e}else{n(d,g);break}else e(d,g);g=g.sibling}g=eu(x,d.mode,_),g.return=d,d=g}return a(d);case Wi:return T=x._init,m(d,g,T(x._payload),_)}if(Ca(x))return v(d,g,x,_);if(ua(x))return y(d,g,x,_);Oo(d,x)}return typeof x=="string"&&x!==""||typeof x=="number"?(x=""+x,g!==null&&g.tag===6?(n(d,g.sibling),g=r(g,x),g.return=d,d=g):(n(d,g),g=Qc(x,d.mode,_),g.return=d,d=g),a(d)):n(d,g)}return m}var Vs=Rg(!0),Pg=Rg(!1),Wl=gr(null),jl=null,bs=null,Gh=null;function Vh(){Gh=bs=jl=null}function Wh(t){var e=Wl.current;xt(Wl),t._currentValue=e}function hd(t,e,n){for(;t!==null;){var i=t.alternate;if((t.childLanes&e)!==e?(t.childLanes|=e,i!==null&&(i.childLanes|=e)):i!==null&&(i.childLanes&e)!==e&&(i.childLanes|=e),t===n)break;t=t.return}}function Os(t,e){jl=t,Gh=bs=null,t=t.dependencies,t!==null&&t.firstContext!==null&&(t.lanes&e&&(mn=!0),t.firstContext=null)}function Bn(t){var e=t._currentValue;if(Gh!==t)if(t={context:t,memoizedValue:e,next:null},bs===null){if(jl===null)throw Error(ie(308));bs=t,jl.dependencies={lanes:0,firstContext:t}}else bs=bs.next=t;return e}var Fr=null;function jh(t){Fr===null?Fr=[t]:Fr.push(t)}function Dg(t,e,n,i){var r=e.interleaved;return r===null?(n.next=n,jh(e)):(n.next=r.next,r.next=n),e.interleaved=n,Pi(t,i)}function Pi(t,e){t.lanes|=e;var n=t.alternate;for(n!==null&&(n.lanes|=e),n=t,t=t.return;t!==null;)t.childLanes|=e,n=t.alternate,n!==null&&(n.childLanes|=e),n=t,t=t.return;return n.tag===3?n.stateNode:null}var ji=!1;function Xh(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Ng(t,e){t=t.updateQueue,e.updateQueue===t&&(e.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,effects:t.effects})}function Ti(t,e){return{eventTime:t,lane:e,tag:0,payload:null,callback:null,next:null}}function ir(t,e,n){var i=t.updateQueue;if(i===null)return null;if(i=i.shared,Ze&2){var r=i.pending;return r===null?e.next=e:(e.next=r.next,r.next=e),i.pending=e,Pi(t,n)}return r=i.interleaved,r===null?(e.next=e,jh(i)):(e.next=r.next,r.next=e),i.interleaved=e,Pi(t,n)}function xl(t,e,n){if(e=e.updateQueue,e!==null&&(e=e.shared,(n&4194240)!==0)){var i=e.lanes;i&=t.pendingLanes,n|=i,e.lanes=n,Dh(t,n)}}function Ap(t,e){var n=t.updateQueue,i=t.alternate;if(i!==null&&(i=i.updateQueue,n===i)){var r=null,s=null;if(n=n.firstBaseUpdate,n!==null){do{var a={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};s===null?r=s=a:s=s.next=a,n=n.next}while(n!==null);s===null?r=s=e:s=s.next=e}else r=s=e;n={baseState:i.baseState,firstBaseUpdate:r,lastBaseUpdate:s,shared:i.shared,effects:i.effects},t.updateQueue=n;return}t=n.lastBaseUpdate,t===null?n.firstBaseUpdate=e:t.next=e,n.lastBaseUpdate=e}function Xl(t,e,n,i){var r=t.updateQueue;ji=!1;var s=r.firstBaseUpdate,a=r.lastBaseUpdate,o=r.shared.pending;if(o!==null){r.shared.pending=null;var l=o,c=l.next;l.next=null,a===null?s=c:a.next=c,a=l;var u=t.alternate;u!==null&&(u=u.updateQueue,o=u.lastBaseUpdate,o!==a&&(o===null?u.firstBaseUpdate=c:o.next=c,u.lastBaseUpdate=l))}if(s!==null){var h=r.baseState;a=0,u=c=l=null,o=s;do{var f=o.lane,p=o.eventTime;if((i&f)===f){u!==null&&(u=u.next={eventTime:p,lane:0,tag:o.tag,payload:o.payload,callback:o.callback,next:null});e:{var v=t,y=o;switch(f=e,p=n,y.tag){case 1:if(v=y.payload,typeof v=="function"){h=v.call(p,h,f);break e}h=v;break e;case 3:v.flags=v.flags&-65537|128;case 0:if(v=y.payload,f=typeof v=="function"?v.call(p,h,f):v,f==null)break e;h=Et({},h,f);break e;case 2:ji=!0}}o.callback!==null&&o.lane!==0&&(t.flags|=64,f=r.effects,f===null?r.effects=[o]:f.push(o))}else p={eventTime:p,lane:f,tag:o.tag,payload:o.payload,callback:o.callback,next:null},u===null?(c=u=p,l=h):u=u.next=p,a|=f;if(o=o.next,o===null){if(o=r.shared.pending,o===null)break;f=o,o=f.next,f.next=null,r.lastBaseUpdate=f,r.shared.pending=null}}while(!0);if(u===null&&(l=h),r.baseState=l,r.firstBaseUpdate=c,r.lastBaseUpdate=u,e=r.shared.interleaved,e!==null){r=e;do a|=r.lane,r=r.next;while(r!==e)}else s===null&&(r.shared.lanes=0);jr|=a,t.lanes=a,t.memoizedState=h}}function bp(t,e,n){if(t=e.effects,e.effects=null,t!==null)for(e=0;e<t.length;e++){var i=t[e],r=i.callback;if(r!==null){if(i.callback=null,i=n,typeof r!="function")throw Error(ie(191,r));r.call(i)}}}var yo={},ui=gr(yo),ro=gr(yo),so=gr(yo);function kr(t){if(t===yo)throw Error(ie(174));return t}function Kh(t,e){switch(pt(so,e),pt(ro,t),pt(ui,yo),t=e.nodeType,t){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:Xu(null,"");break;default:t=t===8?e.parentNode:e,e=t.namespaceURI||null,t=t.tagName,e=Xu(e,t)}xt(ui),pt(ui,e)}function Ws(){xt(ui),xt(ro),xt(so)}function Ig(t){kr(so.current);var e=kr(ui.current),n=Xu(e,t.type);e!==n&&(pt(ro,t),pt(ui,n))}function Yh(t){ro.current===t&&(xt(ui),xt(ro))}var St=gr(0);function Kl(t){for(var e=t;e!==null;){if(e.tag===13){var n=e.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if(e.flags&128)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var Kc=[];function qh(){for(var t=0;t<Kc.length;t++)Kc[t]._workInProgressVersionPrimary=null;Kc.length=0}var yl=Li.ReactCurrentDispatcher,Yc=Li.ReactCurrentBatchConfig,Wr=0,wt=null,Dt=null,kt=null,Yl=!1,Ba=!1,ao=0,g_=0;function qt(){throw Error(ie(321))}function $h(t,e){if(e===null)return!1;for(var n=0;n<e.length&&n<t.length;n++)if(!ti(t[n],e[n]))return!1;return!0}function Zh(t,e,n,i,r,s){if(Wr=s,wt=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,yl.current=t===null||t.memoizedState===null?__:M_,t=n(i,r),Ba){s=0;do{if(Ba=!1,ao=0,25<=s)throw Error(ie(301));s+=1,kt=Dt=null,e.updateQueue=null,yl.current=S_,t=n(i,r)}while(Ba)}if(yl.current=ql,e=Dt!==null&&Dt.next!==null,Wr=0,kt=Dt=wt=null,Yl=!1,e)throw Error(ie(300));return t}function Jh(){var t=ao!==0;return ao=0,t}function ri(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return kt===null?wt.memoizedState=kt=t:kt=kt.next=t,kt}function zn(){if(Dt===null){var t=wt.alternate;t=t!==null?t.memoizedState:null}else t=Dt.next;var e=kt===null?wt.memoizedState:kt.next;if(e!==null)kt=e,Dt=t;else{if(t===null)throw Error(ie(310));Dt=t,t={memoizedState:Dt.memoizedState,baseState:Dt.baseState,baseQueue:Dt.baseQueue,queue:Dt.queue,next:null},kt===null?wt.memoizedState=kt=t:kt=kt.next=t}return kt}function oo(t,e){return typeof e=="function"?e(t):e}function qc(t){var e=zn(),n=e.queue;if(n===null)throw Error(ie(311));n.lastRenderedReducer=t;var i=Dt,r=i.baseQueue,s=n.pending;if(s!==null){if(r!==null){var a=r.next;r.next=s.next,s.next=a}i.baseQueue=r=s,n.pending=null}if(r!==null){s=r.next,i=i.baseState;var o=a=null,l=null,c=s;do{var u=c.lane;if((Wr&u)===u)l!==null&&(l=l.next={lane:0,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null}),i=c.hasEagerState?c.eagerState:t(i,c.action);else{var h={lane:u,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null};l===null?(o=l=h,a=i):l=l.next=h,wt.lanes|=u,jr|=u}c=c.next}while(c!==null&&c!==s);l===null?a=i:l.next=o,ti(i,e.memoizedState)||(mn=!0),e.memoizedState=i,e.baseState=a,e.baseQueue=l,n.lastRenderedState=i}if(t=n.interleaved,t!==null){r=t;do s=r.lane,wt.lanes|=s,jr|=s,r=r.next;while(r!==t)}else r===null&&(n.lanes=0);return[e.memoizedState,n.dispatch]}function $c(t){var e=zn(),n=e.queue;if(n===null)throw Error(ie(311));n.lastRenderedReducer=t;var i=n.dispatch,r=n.pending,s=e.memoizedState;if(r!==null){n.pending=null;var a=r=r.next;do s=t(s,a.action),a=a.next;while(a!==r);ti(s,e.memoizedState)||(mn=!0),e.memoizedState=s,e.baseQueue===null&&(e.baseState=s),n.lastRenderedState=s}return[s,i]}function Lg(){}function Ug(t,e){var n=wt,i=zn(),r=e(),s=!ti(i.memoizedState,r);if(s&&(i.memoizedState=r,mn=!0),i=i.queue,Qh(kg.bind(null,n,i,t),[t]),i.getSnapshot!==e||s||kt!==null&&kt.memoizedState.tag&1){if(n.flags|=2048,lo(9,Fg.bind(null,n,i,r,e),void 0,null),zt===null)throw Error(ie(349));Wr&30||Og(n,e,r)}return r}function Og(t,e,n){t.flags|=16384,t={getSnapshot:e,value:n},e=wt.updateQueue,e===null?(e={lastEffect:null,stores:null},wt.updateQueue=e,e.stores=[t]):(n=e.stores,n===null?e.stores=[t]:n.push(t))}function Fg(t,e,n,i){e.value=n,e.getSnapshot=i,Bg(e)&&zg(t)}function kg(t,e,n){return n(function(){Bg(e)&&zg(t)})}function Bg(t){var e=t.getSnapshot;t=t.value;try{var n=e();return!ti(t,n)}catch{return!0}}function zg(t){var e=Pi(t,1);e!==null&&ei(e,t,1,-1)}function Cp(t){var e=ri();return typeof t=="function"&&(t=t()),e.memoizedState=e.baseState=t,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:oo,lastRenderedState:t},e.queue=t,t=t.dispatch=y_.bind(null,wt,t),[e.memoizedState,t]}function lo(t,e,n,i){return t={tag:t,create:e,destroy:n,deps:i,next:null},e=wt.updateQueue,e===null?(e={lastEffect:null,stores:null},wt.updateQueue=e,e.lastEffect=t.next=t):(n=e.lastEffect,n===null?e.lastEffect=t.next=t:(i=n.next,n.next=t,t.next=i,e.lastEffect=t)),t}function Hg(){return zn().memoizedState}function _l(t,e,n,i){var r=ri();wt.flags|=t,r.memoizedState=lo(1|e,n,void 0,i===void 0?null:i)}function pc(t,e,n,i){var r=zn();i=i===void 0?null:i;var s=void 0;if(Dt!==null){var a=Dt.memoizedState;if(s=a.destroy,i!==null&&$h(i,a.deps)){r.memoizedState=lo(e,n,s,i);return}}wt.flags|=t,r.memoizedState=lo(1|e,n,s,i)}function Rp(t,e){return _l(8390656,8,t,e)}function Qh(t,e){return pc(2048,8,t,e)}function Gg(t,e){return pc(4,2,t,e)}function Vg(t,e){return pc(4,4,t,e)}function Wg(t,e){if(typeof e=="function")return t=t(),e(t),function(){e(null)};if(e!=null)return t=t(),e.current=t,function(){e.current=null}}function jg(t,e,n){return n=n!=null?n.concat([t]):null,pc(4,4,Wg.bind(null,e,t),n)}function ef(){}function Xg(t,e){var n=zn();e=e===void 0?null:e;var i=n.memoizedState;return i!==null&&e!==null&&$h(e,i[1])?i[0]:(n.memoizedState=[t,e],t)}function Kg(t,e){var n=zn();e=e===void 0?null:e;var i=n.memoizedState;return i!==null&&e!==null&&$h(e,i[1])?i[0]:(t=t(),n.memoizedState=[t,e],t)}function Yg(t,e,n){return Wr&21?(ti(n,e)||(n=Q0(),wt.lanes|=n,jr|=n,t.baseState=!0),e):(t.baseState&&(t.baseState=!1,mn=!0),t.memoizedState=n)}function v_(t,e){var n=rt;rt=n!==0&&4>n?n:4,t(!0);var i=Yc.transition;Yc.transition={};try{t(!1),e()}finally{rt=n,Yc.transition=i}}function qg(){return zn().memoizedState}function x_(t,e,n){var i=sr(t);if(n={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null},$g(t))Zg(e,n);else if(n=Dg(t,e,n,i),n!==null){var r=un();ei(n,t,i,r),Jg(n,e,i)}}function y_(t,e,n){var i=sr(t),r={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null};if($g(t))Zg(e,r);else{var s=t.alternate;if(t.lanes===0&&(s===null||s.lanes===0)&&(s=e.lastRenderedReducer,s!==null))try{var a=e.lastRenderedState,o=s(a,n);if(r.hasEagerState=!0,r.eagerState=o,ti(o,a)){var l=e.interleaved;l===null?(r.next=r,jh(e)):(r.next=l.next,l.next=r),e.interleaved=r;return}}catch{}finally{}n=Dg(t,e,r,i),n!==null&&(r=un(),ei(n,t,i,r),Jg(n,e,i))}}function $g(t){var e=t.alternate;return t===wt||e!==null&&e===wt}function Zg(t,e){Ba=Yl=!0;var n=t.pending;n===null?e.next=e:(e.next=n.next,n.next=e),t.pending=e}function Jg(t,e,n){if(n&4194240){var i=e.lanes;i&=t.pendingLanes,n|=i,e.lanes=n,Dh(t,n)}}var ql={readContext:Bn,useCallback:qt,useContext:qt,useEffect:qt,useImperativeHandle:qt,useInsertionEffect:qt,useLayoutEffect:qt,useMemo:qt,useReducer:qt,useRef:qt,useState:qt,useDebugValue:qt,useDeferredValue:qt,useTransition:qt,useMutableSource:qt,useSyncExternalStore:qt,useId:qt,unstable_isNewReconciler:!1},__={readContext:Bn,useCallback:function(t,e){return ri().memoizedState=[t,e===void 0?null:e],t},useContext:Bn,useEffect:Rp,useImperativeHandle:function(t,e,n){return n=n!=null?n.concat([t]):null,_l(4194308,4,Wg.bind(null,e,t),n)},useLayoutEffect:function(t,e){return _l(4194308,4,t,e)},useInsertionEffect:function(t,e){return _l(4,2,t,e)},useMemo:function(t,e){var n=ri();return e=e===void 0?null:e,t=t(),n.memoizedState=[t,e],t},useReducer:function(t,e,n){var i=ri();return e=n!==void 0?n(e):e,i.memoizedState=i.baseState=e,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:e},i.queue=t,t=t.dispatch=x_.bind(null,wt,t),[i.memoizedState,t]},useRef:function(t){var e=ri();return t={current:t},e.memoizedState=t},useState:Cp,useDebugValue:ef,useDeferredValue:function(t){return ri().memoizedState=t},useTransition:function(){var t=Cp(!1),e=t[0];return t=v_.bind(null,t[1]),ri().memoizedState=t,[e,t]},useMutableSource:function(){},useSyncExternalStore:function(t,e,n){var i=wt,r=ri();if(yt){if(n===void 0)throw Error(ie(407));n=n()}else{if(n=e(),zt===null)throw Error(ie(349));Wr&30||Og(i,e,n)}r.memoizedState=n;var s={value:n,getSnapshot:e};return r.queue=s,Rp(kg.bind(null,i,s,t),[t]),i.flags|=2048,lo(9,Fg.bind(null,i,s,n,e),void 0,null),n},useId:function(){var t=ri(),e=zt.identifierPrefix;if(yt){var n=wi,i=Si;n=(i&~(1<<32-Qn(i)-1)).toString(32)+n,e=":"+e+"R"+n,n=ao++,0<n&&(e+="H"+n.toString(32)),e+=":"}else n=g_++,e=":"+e+"r"+n.toString(32)+":";return t.memoizedState=e},unstable_isNewReconciler:!1},M_={readContext:Bn,useCallback:Xg,useContext:Bn,useEffect:Qh,useImperativeHandle:jg,useInsertionEffect:Gg,useLayoutEffect:Vg,useMemo:Kg,useReducer:qc,useRef:Hg,useState:function(){return qc(oo)},useDebugValue:ef,useDeferredValue:function(t){var e=zn();return Yg(e,Dt.memoizedState,t)},useTransition:function(){var t=qc(oo)[0],e=zn().memoizedState;return[t,e]},useMutableSource:Lg,useSyncExternalStore:Ug,useId:qg,unstable_isNewReconciler:!1},S_={readContext:Bn,useCallback:Xg,useContext:Bn,useEffect:Qh,useImperativeHandle:jg,useInsertionEffect:Gg,useLayoutEffect:Vg,useMemo:Kg,useReducer:$c,useRef:Hg,useState:function(){return $c(oo)},useDebugValue:ef,useDeferredValue:function(t){var e=zn();return Dt===null?e.memoizedState=t:Yg(e,Dt.memoizedState,t)},useTransition:function(){var t=$c(oo)[0],e=zn().memoizedState;return[t,e]},useMutableSource:Lg,useSyncExternalStore:Ug,useId:qg,unstable_isNewReconciler:!1};function Kn(t,e){if(t&&t.defaultProps){e=Et({},e),t=t.defaultProps;for(var n in t)e[n]===void 0&&(e[n]=t[n]);return e}return e}function fd(t,e,n,i){e=t.memoizedState,n=n(i,e),n=n==null?e:Et({},e,n),t.memoizedState=n,t.lanes===0&&(t.updateQueue.baseState=n)}var mc={isMounted:function(t){return(t=t._reactInternals)?$r(t)===t:!1},enqueueSetState:function(t,e,n){t=t._reactInternals;var i=un(),r=sr(t),s=Ti(i,r);s.payload=e,n!=null&&(s.callback=n),e=ir(t,s,r),e!==null&&(ei(e,t,r,i),xl(e,t,r))},enqueueReplaceState:function(t,e,n){t=t._reactInternals;var i=un(),r=sr(t),s=Ti(i,r);s.tag=1,s.payload=e,n!=null&&(s.callback=n),e=ir(t,s,r),e!==null&&(ei(e,t,r,i),xl(e,t,r))},enqueueForceUpdate:function(t,e){t=t._reactInternals;var n=un(),i=sr(t),r=Ti(n,i);r.tag=2,e!=null&&(r.callback=e),e=ir(t,r,i),e!==null&&(ei(e,t,i,n),xl(e,t,i))}};function Pp(t,e,n,i,r,s,a){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(i,s,a):e.prototype&&e.prototype.isPureReactComponent?!eo(n,i)||!eo(r,s):!0}function Qg(t,e,n){var i=!1,r=dr,s=e.contextType;return typeof s=="object"&&s!==null?s=Bn(s):(r=xn(e)?Gr:nn.current,i=e.contextTypes,s=(i=i!=null)?Hs(t,r):dr),e=new e(n,s),t.memoizedState=e.state!==null&&e.state!==void 0?e.state:null,e.updater=mc,t.stateNode=e,e._reactInternals=t,i&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=r,t.__reactInternalMemoizedMaskedChildContext=s),e}function Dp(t,e,n,i){t=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(n,i),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(n,i),e.state!==t&&mc.enqueueReplaceState(e,e.state,null)}function pd(t,e,n,i){var r=t.stateNode;r.props=n,r.state=t.memoizedState,r.refs={},Xh(t);var s=e.contextType;typeof s=="object"&&s!==null?r.context=Bn(s):(s=xn(e)?Gr:nn.current,r.context=Hs(t,s)),r.state=t.memoizedState,s=e.getDerivedStateFromProps,typeof s=="function"&&(fd(t,e,s,n),r.state=t.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof r.getSnapshotBeforeUpdate=="function"||typeof r.UNSAFE_componentWillMount!="function"&&typeof r.componentWillMount!="function"||(e=r.state,typeof r.componentWillMount=="function"&&r.componentWillMount(),typeof r.UNSAFE_componentWillMount=="function"&&r.UNSAFE_componentWillMount(),e!==r.state&&mc.enqueueReplaceState(r,r.state,null),Xl(t,n,r,i),r.state=t.memoizedState),typeof r.componentDidMount=="function"&&(t.flags|=4194308)}function js(t,e){try{var n="",i=e;do n+=$x(i),i=i.return;while(i);var r=n}catch(s){r=`
Error generating stack: `+s.message+`
`+s.stack}return{value:t,source:e,stack:r,digest:null}}function Zc(t,e,n){return{value:t,source:null,stack:n??null,digest:e??null}}function md(t,e){try{console.error(e.value)}catch(n){setTimeout(function(){throw n})}}var w_=typeof WeakMap=="function"?WeakMap:Map;function ev(t,e,n){n=Ti(-1,n),n.tag=3,n.payload={element:null};var i=e.value;return n.callback=function(){Zl||(Zl=!0,Td=i),md(t,e)},n}function tv(t,e,n){n=Ti(-1,n),n.tag=3;var i=t.type.getDerivedStateFromError;if(typeof i=="function"){var r=e.value;n.payload=function(){return i(r)},n.callback=function(){md(t,e)}}var s=t.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(n.callback=function(){md(t,e),typeof i!="function"&&(rr===null?rr=new Set([this]):rr.add(this));var a=e.stack;this.componentDidCatch(e.value,{componentStack:a!==null?a:""})}),n}function Np(t,e,n){var i=t.pingCache;if(i===null){i=t.pingCache=new w_;var r=new Set;i.set(e,r)}else r=i.get(e),r===void 0&&(r=new Set,i.set(e,r));r.has(n)||(r.add(n),t=F_.bind(null,t,e,n),e.then(t,t))}function Ip(t){do{var e;if((e=t.tag===13)&&(e=t.memoizedState,e=e!==null?e.dehydrated!==null:!0),e)return t;t=t.return}while(t!==null);return null}function Lp(t,e,n,i,r){return t.mode&1?(t.flags|=65536,t.lanes=r,t):(t===e?t.flags|=65536:(t.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(e=Ti(-1,1),e.tag=2,ir(n,e,1))),n.lanes|=1),t)}var E_=Li.ReactCurrentOwner,mn=!1;function on(t,e,n,i){e.child=t===null?Pg(e,null,n,i):Vs(e,t.child,n,i)}function Up(t,e,n,i,r){n=n.render;var s=e.ref;return Os(e,r),i=Zh(t,e,n,i,s,r),n=Jh(),t!==null&&!mn?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~r,Di(t,e,r)):(yt&&n&&Bh(e),e.flags|=1,on(t,e,i,r),e.child)}function Op(t,e,n,i,r){if(t===null){var s=n.type;return typeof s=="function"&&!cf(s)&&s.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(e.tag=15,e.type=s,nv(t,e,s,i,r)):(t=El(n.type,null,i,e,e.mode,r),t.ref=e.ref,t.return=e,e.child=t)}if(s=t.child,!(t.lanes&r)){var a=s.memoizedProps;if(n=n.compare,n=n!==null?n:eo,n(a,i)&&t.ref===e.ref)return Di(t,e,r)}return e.flags|=1,t=ar(s,i),t.ref=e.ref,t.return=e,e.child=t}function nv(t,e,n,i,r){if(t!==null){var s=t.memoizedProps;if(eo(s,i)&&t.ref===e.ref)if(mn=!1,e.pendingProps=i=s,(t.lanes&r)!==0)t.flags&131072&&(mn=!0);else return e.lanes=t.lanes,Di(t,e,r)}return gd(t,e,n,i,r)}function iv(t,e,n){var i=e.pendingProps,r=i.children,s=t!==null?t.memoizedState:null;if(i.mode==="hidden")if(!(e.mode&1))e.memoizedState={baseLanes:0,cachePool:null,transitions:null},pt(Rs,wn),wn|=n;else{if(!(n&1073741824))return t=s!==null?s.baseLanes|n:n,e.lanes=e.childLanes=1073741824,e.memoizedState={baseLanes:t,cachePool:null,transitions:null},e.updateQueue=null,pt(Rs,wn),wn|=t,null;e.memoizedState={baseLanes:0,cachePool:null,transitions:null},i=s!==null?s.baseLanes:n,pt(Rs,wn),wn|=i}else s!==null?(i=s.baseLanes|n,e.memoizedState=null):i=n,pt(Rs,wn),wn|=i;return on(t,e,r,n),e.child}function rv(t,e){var n=e.ref;(t===null&&n!==null||t!==null&&t.ref!==n)&&(e.flags|=512,e.flags|=2097152)}function gd(t,e,n,i,r){var s=xn(n)?Gr:nn.current;return s=Hs(e,s),Os(e,r),n=Zh(t,e,n,i,s,r),i=Jh(),t!==null&&!mn?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~r,Di(t,e,r)):(yt&&i&&Bh(e),e.flags|=1,on(t,e,n,r),e.child)}function Fp(t,e,n,i,r){if(xn(n)){var s=!0;Hl(e)}else s=!1;if(Os(e,r),e.stateNode===null)Ml(t,e),Qg(e,n,i),pd(e,n,i,r),i=!0;else if(t===null){var a=e.stateNode,o=e.memoizedProps;a.props=o;var l=a.context,c=n.contextType;typeof c=="object"&&c!==null?c=Bn(c):(c=xn(n)?Gr:nn.current,c=Hs(e,c));var u=n.getDerivedStateFromProps,h=typeof u=="function"||typeof a.getSnapshotBeforeUpdate=="function";h||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(o!==i||l!==c)&&Dp(e,a,i,c),ji=!1;var f=e.memoizedState;a.state=f,Xl(e,i,a,r),l=e.memoizedState,o!==i||f!==l||vn.current||ji?(typeof u=="function"&&(fd(e,n,u,i),l=e.memoizedState),(o=ji||Pp(e,n,o,i,f,l,c))?(h||typeof a.UNSAFE_componentWillMount!="function"&&typeof a.componentWillMount!="function"||(typeof a.componentWillMount=="function"&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount=="function"&&a.UNSAFE_componentWillMount()),typeof a.componentDidMount=="function"&&(e.flags|=4194308)):(typeof a.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=i,e.memoizedState=l),a.props=i,a.state=l,a.context=c,i=o):(typeof a.componentDidMount=="function"&&(e.flags|=4194308),i=!1)}else{a=e.stateNode,Ng(t,e),o=e.memoizedProps,c=e.type===e.elementType?o:Kn(e.type,o),a.props=c,h=e.pendingProps,f=a.context,l=n.contextType,typeof l=="object"&&l!==null?l=Bn(l):(l=xn(n)?Gr:nn.current,l=Hs(e,l));var p=n.getDerivedStateFromProps;(u=typeof p=="function"||typeof a.getSnapshotBeforeUpdate=="function")||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(o!==h||f!==l)&&Dp(e,a,i,l),ji=!1,f=e.memoizedState,a.state=f,Xl(e,i,a,r);var v=e.memoizedState;o!==h||f!==v||vn.current||ji?(typeof p=="function"&&(fd(e,n,p,i),v=e.memoizedState),(c=ji||Pp(e,n,c,i,f,v,l)||!1)?(u||typeof a.UNSAFE_componentWillUpdate!="function"&&typeof a.componentWillUpdate!="function"||(typeof a.componentWillUpdate=="function"&&a.componentWillUpdate(i,v,l),typeof a.UNSAFE_componentWillUpdate=="function"&&a.UNSAFE_componentWillUpdate(i,v,l)),typeof a.componentDidUpdate=="function"&&(e.flags|=4),typeof a.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof a.componentDidUpdate!="function"||o===t.memoizedProps&&f===t.memoizedState||(e.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||o===t.memoizedProps&&f===t.memoizedState||(e.flags|=1024),e.memoizedProps=i,e.memoizedState=v),a.props=i,a.state=v,a.context=l,i=c):(typeof a.componentDidUpdate!="function"||o===t.memoizedProps&&f===t.memoizedState||(e.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||o===t.memoizedProps&&f===t.memoizedState||(e.flags|=1024),i=!1)}return vd(t,e,n,i,s,r)}function vd(t,e,n,i,r,s){rv(t,e);var a=(e.flags&128)!==0;if(!i&&!a)return r&&Sp(e,n,!1),Di(t,e,s);i=e.stateNode,E_.current=e;var o=a&&typeof n.getDerivedStateFromError!="function"?null:i.render();return e.flags|=1,t!==null&&a?(e.child=Vs(e,t.child,null,s),e.child=Vs(e,null,o,s)):on(t,e,o,s),e.memoizedState=i.state,r&&Sp(e,n,!0),e.child}function sv(t){var e=t.stateNode;e.pendingContext?Mp(t,e.pendingContext,e.pendingContext!==e.context):e.context&&Mp(t,e.context,!1),Kh(t,e.containerInfo)}function kp(t,e,n,i,r){return Gs(),Hh(r),e.flags|=256,on(t,e,n,i),e.child}var xd={dehydrated:null,treeContext:null,retryLane:0};function yd(t){return{baseLanes:t,cachePool:null,transitions:null}}function av(t,e,n){var i=e.pendingProps,r=St.current,s=!1,a=(e.flags&128)!==0,o;if((o=a)||(o=t!==null&&t.memoizedState===null?!1:(r&2)!==0),o?(s=!0,e.flags&=-129):(t===null||t.memoizedState!==null)&&(r|=1),pt(St,r&1),t===null)return dd(e),t=e.memoizedState,t!==null&&(t=t.dehydrated,t!==null)?(e.mode&1?t.data==="$!"?e.lanes=8:e.lanes=1073741824:e.lanes=1,null):(a=i.children,t=i.fallback,s?(i=e.mode,s=e.child,a={mode:"hidden",children:a},!(i&1)&&s!==null?(s.childLanes=0,s.pendingProps=a):s=xc(a,i,0,null),t=zr(t,i,n,null),s.return=e,t.return=e,s.sibling=t,e.child=s,e.child.memoizedState=yd(n),e.memoizedState=xd,t):tf(e,a));if(r=t.memoizedState,r!==null&&(o=r.dehydrated,o!==null))return T_(t,e,a,i,o,r,n);if(s){s=i.fallback,a=e.mode,r=t.child,o=r.sibling;var l={mode:"hidden",children:i.children};return!(a&1)&&e.child!==r?(i=e.child,i.childLanes=0,i.pendingProps=l,e.deletions=null):(i=ar(r,l),i.subtreeFlags=r.subtreeFlags&14680064),o!==null?s=ar(o,s):(s=zr(s,a,n,null),s.flags|=2),s.return=e,i.return=e,i.sibling=s,e.child=i,i=s,s=e.child,a=t.child.memoizedState,a=a===null?yd(n):{baseLanes:a.baseLanes|n,cachePool:null,transitions:a.transitions},s.memoizedState=a,s.childLanes=t.childLanes&~n,e.memoizedState=xd,i}return s=t.child,t=s.sibling,i=ar(s,{mode:"visible",children:i.children}),!(e.mode&1)&&(i.lanes=n),i.return=e,i.sibling=null,t!==null&&(n=e.deletions,n===null?(e.deletions=[t],e.flags|=16):n.push(t)),e.child=i,e.memoizedState=null,i}function tf(t,e){return e=xc({mode:"visible",children:e},t.mode,0,null),e.return=t,t.child=e}function Fo(t,e,n,i){return i!==null&&Hh(i),Vs(e,t.child,null,n),t=tf(e,e.pendingProps.children),t.flags|=2,e.memoizedState=null,t}function T_(t,e,n,i,r,s,a){if(n)return e.flags&256?(e.flags&=-257,i=Zc(Error(ie(422))),Fo(t,e,a,i)):e.memoizedState!==null?(e.child=t.child,e.flags|=128,null):(s=i.fallback,r=e.mode,i=xc({mode:"visible",children:i.children},r,0,null),s=zr(s,r,a,null),s.flags|=2,i.return=e,s.return=e,i.sibling=s,e.child=i,e.mode&1&&Vs(e,t.child,null,a),e.child.memoizedState=yd(a),e.memoizedState=xd,s);if(!(e.mode&1))return Fo(t,e,a,null);if(r.data==="$!"){if(i=r.nextSibling&&r.nextSibling.dataset,i)var o=i.dgst;return i=o,s=Error(ie(419)),i=Zc(s,i,void 0),Fo(t,e,a,i)}if(o=(a&t.childLanes)!==0,mn||o){if(i=zt,i!==null){switch(a&-a){case 4:r=2;break;case 16:r=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:r=32;break;case 536870912:r=268435456;break;default:r=0}r=r&(i.suspendedLanes|a)?0:r,r!==0&&r!==s.retryLane&&(s.retryLane=r,Pi(t,r),ei(i,t,r,-1))}return lf(),i=Zc(Error(ie(421))),Fo(t,e,a,i)}return r.data==="$?"?(e.flags|=128,e.child=t.child,e=k_.bind(null,t),r._reactRetry=e,null):(t=s.treeContext,Tn=nr(r.nextSibling),An=e,yt=!0,qn=null,t!==null&&(In[Ln++]=Si,In[Ln++]=wi,In[Ln++]=Vr,Si=t.id,wi=t.overflow,Vr=e),e=tf(e,i.children),e.flags|=4096,e)}function Bp(t,e,n){t.lanes|=e;var i=t.alternate;i!==null&&(i.lanes|=e),hd(t.return,e,n)}function Jc(t,e,n,i,r){var s=t.memoizedState;s===null?t.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:i,tail:n,tailMode:r}:(s.isBackwards=e,s.rendering=null,s.renderingStartTime=0,s.last=i,s.tail=n,s.tailMode=r)}function ov(t,e,n){var i=e.pendingProps,r=i.revealOrder,s=i.tail;if(on(t,e,i.children,n),i=St.current,i&2)i=i&1|2,e.flags|=128;else{if(t!==null&&t.flags&128)e:for(t=e.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&Bp(t,n,e);else if(t.tag===19)Bp(t,n,e);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}i&=1}if(pt(St,i),!(e.mode&1))e.memoizedState=null;else switch(r){case"forwards":for(n=e.child,r=null;n!==null;)t=n.alternate,t!==null&&Kl(t)===null&&(r=n),n=n.sibling;n=r,n===null?(r=e.child,e.child=null):(r=n.sibling,n.sibling=null),Jc(e,!1,r,n,s);break;case"backwards":for(n=null,r=e.child,e.child=null;r!==null;){if(t=r.alternate,t!==null&&Kl(t)===null){e.child=r;break}t=r.sibling,r.sibling=n,n=r,r=t}Jc(e,!0,n,null,s);break;case"together":Jc(e,!1,null,null,void 0);break;default:e.memoizedState=null}return e.child}function Ml(t,e){!(e.mode&1)&&t!==null&&(t.alternate=null,e.alternate=null,e.flags|=2)}function Di(t,e,n){if(t!==null&&(e.dependencies=t.dependencies),jr|=e.lanes,!(n&e.childLanes))return null;if(t!==null&&e.child!==t.child)throw Error(ie(153));if(e.child!==null){for(t=e.child,n=ar(t,t.pendingProps),e.child=n,n.return=e;t.sibling!==null;)t=t.sibling,n=n.sibling=ar(t,t.pendingProps),n.return=e;n.sibling=null}return e.child}function A_(t,e,n){switch(e.tag){case 3:sv(e),Gs();break;case 5:Ig(e);break;case 1:xn(e.type)&&Hl(e);break;case 4:Kh(e,e.stateNode.containerInfo);break;case 10:var i=e.type._context,r=e.memoizedProps.value;pt(Wl,i._currentValue),i._currentValue=r;break;case 13:if(i=e.memoizedState,i!==null)return i.dehydrated!==null?(pt(St,St.current&1),e.flags|=128,null):n&e.child.childLanes?av(t,e,n):(pt(St,St.current&1),t=Di(t,e,n),t!==null?t.sibling:null);pt(St,St.current&1);break;case 19:if(i=(n&e.childLanes)!==0,t.flags&128){if(i)return ov(t,e,n);e.flags|=128}if(r=e.memoizedState,r!==null&&(r.rendering=null,r.tail=null,r.lastEffect=null),pt(St,St.current),i)break;return null;case 22:case 23:return e.lanes=0,iv(t,e,n)}return Di(t,e,n)}var lv,_d,cv,uv;lv=function(t,e){for(var n=e.child;n!==null;){if(n.tag===5||n.tag===6)t.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};_d=function(){};cv=function(t,e,n,i){var r=t.memoizedProps;if(r!==i){t=e.stateNode,kr(ui.current);var s=null;switch(n){case"input":r=Gu(t,r),i=Gu(t,i),s=[];break;case"select":r=Et({},r,{value:void 0}),i=Et({},i,{value:void 0}),s=[];break;case"textarea":r=ju(t,r),i=ju(t,i),s=[];break;default:typeof r.onClick!="function"&&typeof i.onClick=="function"&&(t.onclick=Bl)}Ku(n,i);var a;n=null;for(c in r)if(!i.hasOwnProperty(c)&&r.hasOwnProperty(c)&&r[c]!=null)if(c==="style"){var o=r[c];for(a in o)o.hasOwnProperty(a)&&(n||(n={}),n[a]="")}else c!=="dangerouslySetInnerHTML"&&c!=="children"&&c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&c!=="autoFocus"&&(Ka.hasOwnProperty(c)?s||(s=[]):(s=s||[]).push(c,null));for(c in i){var l=i[c];if(o=r!=null?r[c]:void 0,i.hasOwnProperty(c)&&l!==o&&(l!=null||o!=null))if(c==="style")if(o){for(a in o)!o.hasOwnProperty(a)||l&&l.hasOwnProperty(a)||(n||(n={}),n[a]="");for(a in l)l.hasOwnProperty(a)&&o[a]!==l[a]&&(n||(n={}),n[a]=l[a])}else n||(s||(s=[]),s.push(c,n)),n=l;else c==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,o=o?o.__html:void 0,l!=null&&o!==l&&(s=s||[]).push(c,l)):c==="children"?typeof l!="string"&&typeof l!="number"||(s=s||[]).push(c,""+l):c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&(Ka.hasOwnProperty(c)?(l!=null&&c==="onScroll"&&vt("scroll",t),s||o===l||(s=[])):(s=s||[]).push(c,l))}n&&(s=s||[]).push("style",n);var c=s;(e.updateQueue=c)&&(e.flags|=4)}};uv=function(t,e,n,i){n!==i&&(e.flags|=4)};function ga(t,e){if(!yt)switch(t.tailMode){case"hidden":e=t.tail;for(var n=null;e!==null;)e.alternate!==null&&(n=e),e=e.sibling;n===null?t.tail=null:n.sibling=null;break;case"collapsed":n=t.tail;for(var i=null;n!==null;)n.alternate!==null&&(i=n),n=n.sibling;i===null?e||t.tail===null?t.tail=null:t.tail.sibling=null:i.sibling=null}}function $t(t){var e=t.alternate!==null&&t.alternate.child===t.child,n=0,i=0;if(e)for(var r=t.child;r!==null;)n|=r.lanes|r.childLanes,i|=r.subtreeFlags&14680064,i|=r.flags&14680064,r.return=t,r=r.sibling;else for(r=t.child;r!==null;)n|=r.lanes|r.childLanes,i|=r.subtreeFlags,i|=r.flags,r.return=t,r=r.sibling;return t.subtreeFlags|=i,t.childLanes=n,e}function b_(t,e,n){var i=e.pendingProps;switch(zh(e),e.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return $t(e),null;case 1:return xn(e.type)&&zl(),$t(e),null;case 3:return i=e.stateNode,Ws(),xt(vn),xt(nn),qh(),i.pendingContext&&(i.context=i.pendingContext,i.pendingContext=null),(t===null||t.child===null)&&(Uo(e)?e.flags|=4:t===null||t.memoizedState.isDehydrated&&!(e.flags&256)||(e.flags|=1024,qn!==null&&(Cd(qn),qn=null))),_d(t,e),$t(e),null;case 5:Yh(e);var r=kr(so.current);if(n=e.type,t!==null&&e.stateNode!=null)cv(t,e,n,i,r),t.ref!==e.ref&&(e.flags|=512,e.flags|=2097152);else{if(!i){if(e.stateNode===null)throw Error(ie(166));return $t(e),null}if(t=kr(ui.current),Uo(e)){i=e.stateNode,n=e.type;var s=e.memoizedProps;switch(i[oi]=e,i[io]=s,t=(e.mode&1)!==0,n){case"dialog":vt("cancel",i),vt("close",i);break;case"iframe":case"object":case"embed":vt("load",i);break;case"video":case"audio":for(r=0;r<Pa.length;r++)vt(Pa[r],i);break;case"source":vt("error",i);break;case"img":case"image":case"link":vt("error",i),vt("load",i);break;case"details":vt("toggle",i);break;case"input":Yf(i,s),vt("invalid",i);break;case"select":i._wrapperState={wasMultiple:!!s.multiple},vt("invalid",i);break;case"textarea":$f(i,s),vt("invalid",i)}Ku(n,s),r=null;for(var a in s)if(s.hasOwnProperty(a)){var o=s[a];a==="children"?typeof o=="string"?i.textContent!==o&&(s.suppressHydrationWarning!==!0&&Lo(i.textContent,o,t),r=["children",o]):typeof o=="number"&&i.textContent!==""+o&&(s.suppressHydrationWarning!==!0&&Lo(i.textContent,o,t),r=["children",""+o]):Ka.hasOwnProperty(a)&&o!=null&&a==="onScroll"&&vt("scroll",i)}switch(n){case"input":Ao(i),qf(i,s,!0);break;case"textarea":Ao(i),Zf(i);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(i.onclick=Bl)}i=r,e.updateQueue=i,i!==null&&(e.flags|=4)}else{a=r.nodeType===9?r:r.ownerDocument,t==="http://www.w3.org/1999/xhtml"&&(t=k0(n)),t==="http://www.w3.org/1999/xhtml"?n==="script"?(t=a.createElement("div"),t.innerHTML="<script><\/script>",t=t.removeChild(t.firstChild)):typeof i.is=="string"?t=a.createElement(n,{is:i.is}):(t=a.createElement(n),n==="select"&&(a=t,i.multiple?a.multiple=!0:i.size&&(a.size=i.size))):t=a.createElementNS(t,n),t[oi]=e,t[io]=i,lv(t,e,!1,!1),e.stateNode=t;e:{switch(a=Yu(n,i),n){case"dialog":vt("cancel",t),vt("close",t),r=i;break;case"iframe":case"object":case"embed":vt("load",t),r=i;break;case"video":case"audio":for(r=0;r<Pa.length;r++)vt(Pa[r],t);r=i;break;case"source":vt("error",t),r=i;break;case"img":case"image":case"link":vt("error",t),vt("load",t),r=i;break;case"details":vt("toggle",t),r=i;break;case"input":Yf(t,i),r=Gu(t,i),vt("invalid",t);break;case"option":r=i;break;case"select":t._wrapperState={wasMultiple:!!i.multiple},r=Et({},i,{value:void 0}),vt("invalid",t);break;case"textarea":$f(t,i),r=ju(t,i),vt("invalid",t);break;default:r=i}Ku(n,r),o=r;for(s in o)if(o.hasOwnProperty(s)){var l=o[s];s==="style"?H0(t,l):s==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,l!=null&&B0(t,l)):s==="children"?typeof l=="string"?(n!=="textarea"||l!=="")&&Ya(t,l):typeof l=="number"&&Ya(t,""+l):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(Ka.hasOwnProperty(s)?l!=null&&s==="onScroll"&&vt("scroll",t):l!=null&&Th(t,s,l,a))}switch(n){case"input":Ao(t),qf(t,i,!1);break;case"textarea":Ao(t),Zf(t);break;case"option":i.value!=null&&t.setAttribute("value",""+ur(i.value));break;case"select":t.multiple=!!i.multiple,s=i.value,s!=null?Ns(t,!!i.multiple,s,!1):i.defaultValue!=null&&Ns(t,!!i.multiple,i.defaultValue,!0);break;default:typeof r.onClick=="function"&&(t.onclick=Bl)}switch(n){case"button":case"input":case"select":case"textarea":i=!!i.autoFocus;break e;case"img":i=!0;break e;default:i=!1}}i&&(e.flags|=4)}e.ref!==null&&(e.flags|=512,e.flags|=2097152)}return $t(e),null;case 6:if(t&&e.stateNode!=null)uv(t,e,t.memoizedProps,i);else{if(typeof i!="string"&&e.stateNode===null)throw Error(ie(166));if(n=kr(so.current),kr(ui.current),Uo(e)){if(i=e.stateNode,n=e.memoizedProps,i[oi]=e,(s=i.nodeValue!==n)&&(t=An,t!==null))switch(t.tag){case 3:Lo(i.nodeValue,n,(t.mode&1)!==0);break;case 5:t.memoizedProps.suppressHydrationWarning!==!0&&Lo(i.nodeValue,n,(t.mode&1)!==0)}s&&(e.flags|=4)}else i=(n.nodeType===9?n:n.ownerDocument).createTextNode(i),i[oi]=e,e.stateNode=i}return $t(e),null;case 13:if(xt(St),i=e.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(yt&&Tn!==null&&e.mode&1&&!(e.flags&128))Cg(),Gs(),e.flags|=98560,s=!1;else if(s=Uo(e),i!==null&&i.dehydrated!==null){if(t===null){if(!s)throw Error(ie(318));if(s=e.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(ie(317));s[oi]=e}else Gs(),!(e.flags&128)&&(e.memoizedState=null),e.flags|=4;$t(e),s=!1}else qn!==null&&(Cd(qn),qn=null),s=!0;if(!s)return e.flags&65536?e:null}return e.flags&128?(e.lanes=n,e):(i=i!==null,i!==(t!==null&&t.memoizedState!==null)&&i&&(e.child.flags|=8192,e.mode&1&&(t===null||St.current&1?Nt===0&&(Nt=3):lf())),e.updateQueue!==null&&(e.flags|=4),$t(e),null);case 4:return Ws(),_d(t,e),t===null&&to(e.stateNode.containerInfo),$t(e),null;case 10:return Wh(e.type._context),$t(e),null;case 17:return xn(e.type)&&zl(),$t(e),null;case 19:if(xt(St),s=e.memoizedState,s===null)return $t(e),null;if(i=(e.flags&128)!==0,a=s.rendering,a===null)if(i)ga(s,!1);else{if(Nt!==0||t!==null&&t.flags&128)for(t=e.child;t!==null;){if(a=Kl(t),a!==null){for(e.flags|=128,ga(s,!1),i=a.updateQueue,i!==null&&(e.updateQueue=i,e.flags|=4),e.subtreeFlags=0,i=n,n=e.child;n!==null;)s=n,t=i,s.flags&=14680066,a=s.alternate,a===null?(s.childLanes=0,s.lanes=t,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=a.childLanes,s.lanes=a.lanes,s.child=a.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=a.memoizedProps,s.memoizedState=a.memoizedState,s.updateQueue=a.updateQueue,s.type=a.type,t=a.dependencies,s.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),n=n.sibling;return pt(St,St.current&1|2),e.child}t=t.sibling}s.tail!==null&&Ct()>Xs&&(e.flags|=128,i=!0,ga(s,!1),e.lanes=4194304)}else{if(!i)if(t=Kl(a),t!==null){if(e.flags|=128,i=!0,n=t.updateQueue,n!==null&&(e.updateQueue=n,e.flags|=4),ga(s,!0),s.tail===null&&s.tailMode==="hidden"&&!a.alternate&&!yt)return $t(e),null}else 2*Ct()-s.renderingStartTime>Xs&&n!==1073741824&&(e.flags|=128,i=!0,ga(s,!1),e.lanes=4194304);s.isBackwards?(a.sibling=e.child,e.child=a):(n=s.last,n!==null?n.sibling=a:e.child=a,s.last=a)}return s.tail!==null?(e=s.tail,s.rendering=e,s.tail=e.sibling,s.renderingStartTime=Ct(),e.sibling=null,n=St.current,pt(St,i?n&1|2:n&1),e):($t(e),null);case 22:case 23:return of(),i=e.memoizedState!==null,t!==null&&t.memoizedState!==null!==i&&(e.flags|=8192),i&&e.mode&1?wn&1073741824&&($t(e),e.subtreeFlags&6&&(e.flags|=8192)):$t(e),null;case 24:return null;case 25:return null}throw Error(ie(156,e.tag))}function C_(t,e){switch(zh(e),e.tag){case 1:return xn(e.type)&&zl(),t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 3:return Ws(),xt(vn),xt(nn),qh(),t=e.flags,t&65536&&!(t&128)?(e.flags=t&-65537|128,e):null;case 5:return Yh(e),null;case 13:if(xt(St),t=e.memoizedState,t!==null&&t.dehydrated!==null){if(e.alternate===null)throw Error(ie(340));Gs()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 19:return xt(St),null;case 4:return Ws(),null;case 10:return Wh(e.type._context),null;case 22:case 23:return of(),null;case 24:return null;default:return null}}var ko=!1,en=!1,R_=typeof WeakSet=="function"?WeakSet:Set,xe=null;function Cs(t,e){var n=t.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(i){At(t,e,i)}else n.current=null}function Md(t,e,n){try{n()}catch(i){At(t,e,i)}}var zp=!1;function P_(t,e){if(rd=Ol,t=mg(),kh(t)){if("selectionStart"in t)var n={start:t.selectionStart,end:t.selectionEnd};else e:{n=(n=t.ownerDocument)&&n.defaultView||window;var i=n.getSelection&&n.getSelection();if(i&&i.rangeCount!==0){n=i.anchorNode;var r=i.anchorOffset,s=i.focusNode;i=i.focusOffset;try{n.nodeType,s.nodeType}catch{n=null;break e}var a=0,o=-1,l=-1,c=0,u=0,h=t,f=null;t:for(;;){for(var p;h!==n||r!==0&&h.nodeType!==3||(o=a+r),h!==s||i!==0&&h.nodeType!==3||(l=a+i),h.nodeType===3&&(a+=h.nodeValue.length),(p=h.firstChild)!==null;)f=h,h=p;for(;;){if(h===t)break t;if(f===n&&++c===r&&(o=a),f===s&&++u===i&&(l=a),(p=h.nextSibling)!==null)break;h=f,f=h.parentNode}h=p}n=o===-1||l===-1?null:{start:o,end:l}}else n=null}n=n||{start:0,end:0}}else n=null;for(sd={focusedElem:t,selectionRange:n},Ol=!1,xe=e;xe!==null;)if(e=xe,t=e.child,(e.subtreeFlags&1028)!==0&&t!==null)t.return=e,xe=t;else for(;xe!==null;){e=xe;try{var v=e.alternate;if(e.flags&1024)switch(e.tag){case 0:case 11:case 15:break;case 1:if(v!==null){var y=v.memoizedProps,m=v.memoizedState,d=e.stateNode,g=d.getSnapshotBeforeUpdate(e.elementType===e.type?y:Kn(e.type,y),m);d.__reactInternalSnapshotBeforeUpdate=g}break;case 3:var x=e.stateNode.containerInfo;x.nodeType===1?x.textContent="":x.nodeType===9&&x.documentElement&&x.removeChild(x.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(ie(163))}}catch(_){At(e,e.return,_)}if(t=e.sibling,t!==null){t.return=e.return,xe=t;break}xe=e.return}return v=zp,zp=!1,v}function za(t,e,n){var i=e.updateQueue;if(i=i!==null?i.lastEffect:null,i!==null){var r=i=i.next;do{if((r.tag&t)===t){var s=r.destroy;r.destroy=void 0,s!==void 0&&Md(e,n,s)}r=r.next}while(r!==i)}}function gc(t,e){if(e=e.updateQueue,e=e!==null?e.lastEffect:null,e!==null){var n=e=e.next;do{if((n.tag&t)===t){var i=n.create;n.destroy=i()}n=n.next}while(n!==e)}}function Sd(t){var e=t.ref;if(e!==null){var n=t.stateNode;switch(t.tag){case 5:t=n;break;default:t=n}typeof e=="function"?e(t):e.current=t}}function dv(t){var e=t.alternate;e!==null&&(t.alternate=null,dv(e)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(e=t.stateNode,e!==null&&(delete e[oi],delete e[io],delete e[ld],delete e[h_],delete e[f_])),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}function hv(t){return t.tag===5||t.tag===3||t.tag===4}function Hp(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||hv(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function wd(t,e,n){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?n.nodeType===8?n.parentNode.insertBefore(t,e):n.insertBefore(t,e):(n.nodeType===8?(e=n.parentNode,e.insertBefore(t,n)):(e=n,e.appendChild(t)),n=n._reactRootContainer,n!=null||e.onclick!==null||(e.onclick=Bl));else if(i!==4&&(t=t.child,t!==null))for(wd(t,e,n),t=t.sibling;t!==null;)wd(t,e,n),t=t.sibling}function Ed(t,e,n){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?n.insertBefore(t,e):n.appendChild(t);else if(i!==4&&(t=t.child,t!==null))for(Ed(t,e,n),t=t.sibling;t!==null;)Ed(t,e,n),t=t.sibling}var Gt=null,Yn=!1;function Fi(t,e,n){for(n=n.child;n!==null;)fv(t,e,n),n=n.sibling}function fv(t,e,n){if(ci&&typeof ci.onCommitFiberUnmount=="function")try{ci.onCommitFiberUnmount(lc,n)}catch{}switch(n.tag){case 5:en||Cs(n,e);case 6:var i=Gt,r=Yn;Gt=null,Fi(t,e,n),Gt=i,Yn=r,Gt!==null&&(Yn?(t=Gt,n=n.stateNode,t.nodeType===8?t.parentNode.removeChild(n):t.removeChild(n)):Gt.removeChild(n.stateNode));break;case 18:Gt!==null&&(Yn?(t=Gt,n=n.stateNode,t.nodeType===8?jc(t.parentNode,n):t.nodeType===1&&jc(t,n),Ja(t)):jc(Gt,n.stateNode));break;case 4:i=Gt,r=Yn,Gt=n.stateNode.containerInfo,Yn=!0,Fi(t,e,n),Gt=i,Yn=r;break;case 0:case 11:case 14:case 15:if(!en&&(i=n.updateQueue,i!==null&&(i=i.lastEffect,i!==null))){r=i=i.next;do{var s=r,a=s.destroy;s=s.tag,a!==void 0&&(s&2||s&4)&&Md(n,e,a),r=r.next}while(r!==i)}Fi(t,e,n);break;case 1:if(!en&&(Cs(n,e),i=n.stateNode,typeof i.componentWillUnmount=="function"))try{i.props=n.memoizedProps,i.state=n.memoizedState,i.componentWillUnmount()}catch(o){At(n,e,o)}Fi(t,e,n);break;case 21:Fi(t,e,n);break;case 22:n.mode&1?(en=(i=en)||n.memoizedState!==null,Fi(t,e,n),en=i):Fi(t,e,n);break;default:Fi(t,e,n)}}function Gp(t){var e=t.updateQueue;if(e!==null){t.updateQueue=null;var n=t.stateNode;n===null&&(n=t.stateNode=new R_),e.forEach(function(i){var r=B_.bind(null,t,i);n.has(i)||(n.add(i),i.then(r,r))})}}function Vn(t,e){var n=e.deletions;if(n!==null)for(var i=0;i<n.length;i++){var r=n[i];try{var s=t,a=e,o=a;e:for(;o!==null;){switch(o.tag){case 5:Gt=o.stateNode,Yn=!1;break e;case 3:Gt=o.stateNode.containerInfo,Yn=!0;break e;case 4:Gt=o.stateNode.containerInfo,Yn=!0;break e}o=o.return}if(Gt===null)throw Error(ie(160));fv(s,a,r),Gt=null,Yn=!1;var l=r.alternate;l!==null&&(l.return=null),r.return=null}catch(c){At(r,e,c)}}if(e.subtreeFlags&12854)for(e=e.child;e!==null;)pv(e,t),e=e.sibling}function pv(t,e){var n=t.alternate,i=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:if(Vn(e,t),ii(t),i&4){try{za(3,t,t.return),gc(3,t)}catch(y){At(t,t.return,y)}try{za(5,t,t.return)}catch(y){At(t,t.return,y)}}break;case 1:Vn(e,t),ii(t),i&512&&n!==null&&Cs(n,n.return);break;case 5:if(Vn(e,t),ii(t),i&512&&n!==null&&Cs(n,n.return),t.flags&32){var r=t.stateNode;try{Ya(r,"")}catch(y){At(t,t.return,y)}}if(i&4&&(r=t.stateNode,r!=null)){var s=t.memoizedProps,a=n!==null?n.memoizedProps:s,o=t.type,l=t.updateQueue;if(t.updateQueue=null,l!==null)try{o==="input"&&s.type==="radio"&&s.name!=null&&O0(r,s),Yu(o,a);var c=Yu(o,s);for(a=0;a<l.length;a+=2){var u=l[a],h=l[a+1];u==="style"?H0(r,h):u==="dangerouslySetInnerHTML"?B0(r,h):u==="children"?Ya(r,h):Th(r,u,h,c)}switch(o){case"input":Vu(r,s);break;case"textarea":F0(r,s);break;case"select":var f=r._wrapperState.wasMultiple;r._wrapperState.wasMultiple=!!s.multiple;var p=s.value;p!=null?Ns(r,!!s.multiple,p,!1):f!==!!s.multiple&&(s.defaultValue!=null?Ns(r,!!s.multiple,s.defaultValue,!0):Ns(r,!!s.multiple,s.multiple?[]:"",!1))}r[io]=s}catch(y){At(t,t.return,y)}}break;case 6:if(Vn(e,t),ii(t),i&4){if(t.stateNode===null)throw Error(ie(162));r=t.stateNode,s=t.memoizedProps;try{r.nodeValue=s}catch(y){At(t,t.return,y)}}break;case 3:if(Vn(e,t),ii(t),i&4&&n!==null&&n.memoizedState.isDehydrated)try{Ja(e.containerInfo)}catch(y){At(t,t.return,y)}break;case 4:Vn(e,t),ii(t);break;case 13:Vn(e,t),ii(t),r=t.child,r.flags&8192&&(s=r.memoizedState!==null,r.stateNode.isHidden=s,!s||r.alternate!==null&&r.alternate.memoizedState!==null||(sf=Ct())),i&4&&Gp(t);break;case 22:if(u=n!==null&&n.memoizedState!==null,t.mode&1?(en=(c=en)||u,Vn(e,t),en=c):Vn(e,t),ii(t),i&8192){if(c=t.memoizedState!==null,(t.stateNode.isHidden=c)&&!u&&t.mode&1)for(xe=t,u=t.child;u!==null;){for(h=xe=u;xe!==null;){switch(f=xe,p=f.child,f.tag){case 0:case 11:case 14:case 15:za(4,f,f.return);break;case 1:Cs(f,f.return);var v=f.stateNode;if(typeof v.componentWillUnmount=="function"){i=f,n=f.return;try{e=i,v.props=e.memoizedProps,v.state=e.memoizedState,v.componentWillUnmount()}catch(y){At(i,n,y)}}break;case 5:Cs(f,f.return);break;case 22:if(f.memoizedState!==null){Wp(h);continue}}p!==null?(p.return=f,xe=p):Wp(h)}u=u.sibling}e:for(u=null,h=t;;){if(h.tag===5){if(u===null){u=h;try{r=h.stateNode,c?(s=r.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(o=h.stateNode,l=h.memoizedProps.style,a=l!=null&&l.hasOwnProperty("display")?l.display:null,o.style.display=z0("display",a))}catch(y){At(t,t.return,y)}}}else if(h.tag===6){if(u===null)try{h.stateNode.nodeValue=c?"":h.memoizedProps}catch(y){At(t,t.return,y)}}else if((h.tag!==22&&h.tag!==23||h.memoizedState===null||h===t)&&h.child!==null){h.child.return=h,h=h.child;continue}if(h===t)break e;for(;h.sibling===null;){if(h.return===null||h.return===t)break e;u===h&&(u=null),h=h.return}u===h&&(u=null),h.sibling.return=h.return,h=h.sibling}}break;case 19:Vn(e,t),ii(t),i&4&&Gp(t);break;case 21:break;default:Vn(e,t),ii(t)}}function ii(t){var e=t.flags;if(e&2){try{e:{for(var n=t.return;n!==null;){if(hv(n)){var i=n;break e}n=n.return}throw Error(ie(160))}switch(i.tag){case 5:var r=i.stateNode;i.flags&32&&(Ya(r,""),i.flags&=-33);var s=Hp(t);Ed(t,s,r);break;case 3:case 4:var a=i.stateNode.containerInfo,o=Hp(t);wd(t,o,a);break;default:throw Error(ie(161))}}catch(l){At(t,t.return,l)}t.flags&=-3}e&4096&&(t.flags&=-4097)}function D_(t,e,n){xe=t,mv(t)}function mv(t,e,n){for(var i=(t.mode&1)!==0;xe!==null;){var r=xe,s=r.child;if(r.tag===22&&i){var a=r.memoizedState!==null||ko;if(!a){var o=r.alternate,l=o!==null&&o.memoizedState!==null||en;o=ko;var c=en;if(ko=a,(en=l)&&!c)for(xe=r;xe!==null;)a=xe,l=a.child,a.tag===22&&a.memoizedState!==null?jp(r):l!==null?(l.return=a,xe=l):jp(r);for(;s!==null;)xe=s,mv(s),s=s.sibling;xe=r,ko=o,en=c}Vp(t)}else r.subtreeFlags&8772&&s!==null?(s.return=r,xe=s):Vp(t)}}function Vp(t){for(;xe!==null;){var e=xe;if(e.flags&8772){var n=e.alternate;try{if(e.flags&8772)switch(e.tag){case 0:case 11:case 15:en||gc(5,e);break;case 1:var i=e.stateNode;if(e.flags&4&&!en)if(n===null)i.componentDidMount();else{var r=e.elementType===e.type?n.memoizedProps:Kn(e.type,n.memoizedProps);i.componentDidUpdate(r,n.memoizedState,i.__reactInternalSnapshotBeforeUpdate)}var s=e.updateQueue;s!==null&&bp(e,s,i);break;case 3:var a=e.updateQueue;if(a!==null){if(n=null,e.child!==null)switch(e.child.tag){case 5:n=e.child.stateNode;break;case 1:n=e.child.stateNode}bp(e,a,n)}break;case 5:var o=e.stateNode;if(n===null&&e.flags&4){n=o;var l=e.memoizedProps;switch(e.type){case"button":case"input":case"select":case"textarea":l.autoFocus&&n.focus();break;case"img":l.src&&(n.src=l.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(e.memoizedState===null){var c=e.alternate;if(c!==null){var u=c.memoizedState;if(u!==null){var h=u.dehydrated;h!==null&&Ja(h)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(ie(163))}en||e.flags&512&&Sd(e)}catch(f){At(e,e.return,f)}}if(e===t){xe=null;break}if(n=e.sibling,n!==null){n.return=e.return,xe=n;break}xe=e.return}}function Wp(t){for(;xe!==null;){var e=xe;if(e===t){xe=null;break}var n=e.sibling;if(n!==null){n.return=e.return,xe=n;break}xe=e.return}}function jp(t){for(;xe!==null;){var e=xe;try{switch(e.tag){case 0:case 11:case 15:var n=e.return;try{gc(4,e)}catch(l){At(e,n,l)}break;case 1:var i=e.stateNode;if(typeof i.componentDidMount=="function"){var r=e.return;try{i.componentDidMount()}catch(l){At(e,r,l)}}var s=e.return;try{Sd(e)}catch(l){At(e,s,l)}break;case 5:var a=e.return;try{Sd(e)}catch(l){At(e,a,l)}}}catch(l){At(e,e.return,l)}if(e===t){xe=null;break}var o=e.sibling;if(o!==null){o.return=e.return,xe=o;break}xe=e.return}}var N_=Math.ceil,$l=Li.ReactCurrentDispatcher,nf=Li.ReactCurrentOwner,kn=Li.ReactCurrentBatchConfig,Ze=0,zt=null,Pt=null,jt=0,wn=0,Rs=gr(0),Nt=0,co=null,jr=0,vc=0,rf=0,Ha=null,pn=null,sf=0,Xs=1/0,_i=null,Zl=!1,Td=null,rr=null,Bo=!1,Zi=null,Jl=0,Ga=0,Ad=null,Sl=-1,wl=0;function un(){return Ze&6?Ct():Sl!==-1?Sl:Sl=Ct()}function sr(t){return t.mode&1?Ze&2&&jt!==0?jt&-jt:m_.transition!==null?(wl===0&&(wl=Q0()),wl):(t=rt,t!==0||(t=window.event,t=t===void 0?16:ag(t.type)),t):1}function ei(t,e,n,i){if(50<Ga)throw Ga=0,Ad=null,Error(ie(185));go(t,n,i),(!(Ze&2)||t!==zt)&&(t===zt&&(!(Ze&2)&&(vc|=n),Nt===4&&qi(t,jt)),yn(t,i),n===1&&Ze===0&&!(e.mode&1)&&(Xs=Ct()+500,fc&&vr()))}function yn(t,e){var n=t.callbackNode;my(t,e);var i=Ul(t,t===zt?jt:0);if(i===0)n!==null&&ep(n),t.callbackNode=null,t.callbackPriority=0;else if(e=i&-i,t.callbackPriority!==e){if(n!=null&&ep(n),e===1)t.tag===0?p_(Xp.bind(null,t)):Tg(Xp.bind(null,t)),u_(function(){!(Ze&6)&&vr()}),n=null;else{switch(eg(i)){case 1:n=Ph;break;case 4:n=Z0;break;case 16:n=Ll;break;case 536870912:n=J0;break;default:n=Ll}n=wv(n,gv.bind(null,t))}t.callbackPriority=e,t.callbackNode=n}}function gv(t,e){if(Sl=-1,wl=0,Ze&6)throw Error(ie(327));var n=t.callbackNode;if(Fs()&&t.callbackNode!==n)return null;var i=Ul(t,t===zt?jt:0);if(i===0)return null;if(i&30||i&t.expiredLanes||e)e=Ql(t,i);else{e=i;var r=Ze;Ze|=2;var s=xv();(zt!==t||jt!==e)&&(_i=null,Xs=Ct()+500,Br(t,e));do try{U_();break}catch(o){vv(t,o)}while(!0);Vh(),$l.current=s,Ze=r,Pt!==null?e=0:(zt=null,jt=0,e=Nt)}if(e!==0){if(e===2&&(r=Qu(t),r!==0&&(i=r,e=bd(t,r))),e===1)throw n=co,Br(t,0),qi(t,i),yn(t,Ct()),n;if(e===6)qi(t,i);else{if(r=t.current.alternate,!(i&30)&&!I_(r)&&(e=Ql(t,i),e===2&&(s=Qu(t),s!==0&&(i=s,e=bd(t,s))),e===1))throw n=co,Br(t,0),qi(t,i),yn(t,Ct()),n;switch(t.finishedWork=r,t.finishedLanes=i,e){case 0:case 1:throw Error(ie(345));case 2:Cr(t,pn,_i);break;case 3:if(qi(t,i),(i&130023424)===i&&(e=sf+500-Ct(),10<e)){if(Ul(t,0)!==0)break;if(r=t.suspendedLanes,(r&i)!==i){un(),t.pingedLanes|=t.suspendedLanes&r;break}t.timeoutHandle=od(Cr.bind(null,t,pn,_i),e);break}Cr(t,pn,_i);break;case 4:if(qi(t,i),(i&4194240)===i)break;for(e=t.eventTimes,r=-1;0<i;){var a=31-Qn(i);s=1<<a,a=e[a],a>r&&(r=a),i&=~s}if(i=r,i=Ct()-i,i=(120>i?120:480>i?480:1080>i?1080:1920>i?1920:3e3>i?3e3:4320>i?4320:1960*N_(i/1960))-i,10<i){t.timeoutHandle=od(Cr.bind(null,t,pn,_i),i);break}Cr(t,pn,_i);break;case 5:Cr(t,pn,_i);break;default:throw Error(ie(329))}}}return yn(t,Ct()),t.callbackNode===n?gv.bind(null,t):null}function bd(t,e){var n=Ha;return t.current.memoizedState.isDehydrated&&(Br(t,e).flags|=256),t=Ql(t,e),t!==2&&(e=pn,pn=n,e!==null&&Cd(e)),t}function Cd(t){pn===null?pn=t:pn.push.apply(pn,t)}function I_(t){for(var e=t;;){if(e.flags&16384){var n=e.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var i=0;i<n.length;i++){var r=n[i],s=r.getSnapshot;r=r.value;try{if(!ti(s(),r))return!1}catch{return!1}}}if(n=e.child,e.subtreeFlags&16384&&n!==null)n.return=e,e=n;else{if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function qi(t,e){for(e&=~rf,e&=~vc,t.suspendedLanes|=e,t.pingedLanes&=~e,t=t.expirationTimes;0<e;){var n=31-Qn(e),i=1<<n;t[n]=-1,e&=~i}}function Xp(t){if(Ze&6)throw Error(ie(327));Fs();var e=Ul(t,0);if(!(e&1))return yn(t,Ct()),null;var n=Ql(t,e);if(t.tag!==0&&n===2){var i=Qu(t);i!==0&&(e=i,n=bd(t,i))}if(n===1)throw n=co,Br(t,0),qi(t,e),yn(t,Ct()),n;if(n===6)throw Error(ie(345));return t.finishedWork=t.current.alternate,t.finishedLanes=e,Cr(t,pn,_i),yn(t,Ct()),null}function af(t,e){var n=Ze;Ze|=1;try{return t(e)}finally{Ze=n,Ze===0&&(Xs=Ct()+500,fc&&vr())}}function Xr(t){Zi!==null&&Zi.tag===0&&!(Ze&6)&&Fs();var e=Ze;Ze|=1;var n=kn.transition,i=rt;try{if(kn.transition=null,rt=1,t)return t()}finally{rt=i,kn.transition=n,Ze=e,!(Ze&6)&&vr()}}function of(){wn=Rs.current,xt(Rs)}function Br(t,e){t.finishedWork=null,t.finishedLanes=0;var n=t.timeoutHandle;if(n!==-1&&(t.timeoutHandle=-1,c_(n)),Pt!==null)for(n=Pt.return;n!==null;){var i=n;switch(zh(i),i.tag){case 1:i=i.type.childContextTypes,i!=null&&zl();break;case 3:Ws(),xt(vn),xt(nn),qh();break;case 5:Yh(i);break;case 4:Ws();break;case 13:xt(St);break;case 19:xt(St);break;case 10:Wh(i.type._context);break;case 22:case 23:of()}n=n.return}if(zt=t,Pt=t=ar(t.current,null),jt=wn=e,Nt=0,co=null,rf=vc=jr=0,pn=Ha=null,Fr!==null){for(e=0;e<Fr.length;e++)if(n=Fr[e],i=n.interleaved,i!==null){n.interleaved=null;var r=i.next,s=n.pending;if(s!==null){var a=s.next;s.next=r,i.next=a}n.pending=i}Fr=null}return t}function vv(t,e){do{var n=Pt;try{if(Vh(),yl.current=ql,Yl){for(var i=wt.memoizedState;i!==null;){var r=i.queue;r!==null&&(r.pending=null),i=i.next}Yl=!1}if(Wr=0,kt=Dt=wt=null,Ba=!1,ao=0,nf.current=null,n===null||n.return===null){Nt=1,co=e,Pt=null;break}e:{var s=t,a=n.return,o=n,l=e;if(e=jt,o.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){var c=l,u=o,h=u.tag;if(!(u.mode&1)&&(h===0||h===11||h===15)){var f=u.alternate;f?(u.updateQueue=f.updateQueue,u.memoizedState=f.memoizedState,u.lanes=f.lanes):(u.updateQueue=null,u.memoizedState=null)}var p=Ip(a);if(p!==null){p.flags&=-257,Lp(p,a,o,s,e),p.mode&1&&Np(s,c,e),e=p,l=c;var v=e.updateQueue;if(v===null){var y=new Set;y.add(l),e.updateQueue=y}else v.add(l);break e}else{if(!(e&1)){Np(s,c,e),lf();break e}l=Error(ie(426))}}else if(yt&&o.mode&1){var m=Ip(a);if(m!==null){!(m.flags&65536)&&(m.flags|=256),Lp(m,a,o,s,e),Hh(js(l,o));break e}}s=l=js(l,o),Nt!==4&&(Nt=2),Ha===null?Ha=[s]:Ha.push(s),s=a;do{switch(s.tag){case 3:s.flags|=65536,e&=-e,s.lanes|=e;var d=ev(s,l,e);Ap(s,d);break e;case 1:o=l;var g=s.type,x=s.stateNode;if(!(s.flags&128)&&(typeof g.getDerivedStateFromError=="function"||x!==null&&typeof x.componentDidCatch=="function"&&(rr===null||!rr.has(x)))){s.flags|=65536,e&=-e,s.lanes|=e;var _=tv(s,o,e);Ap(s,_);break e}}s=s.return}while(s!==null)}_v(n)}catch(R){e=R,Pt===n&&n!==null&&(Pt=n=n.return);continue}break}while(!0)}function xv(){var t=$l.current;return $l.current=ql,t===null?ql:t}function lf(){(Nt===0||Nt===3||Nt===2)&&(Nt=4),zt===null||!(jr&268435455)&&!(vc&268435455)||qi(zt,jt)}function Ql(t,e){var n=Ze;Ze|=2;var i=xv();(zt!==t||jt!==e)&&(_i=null,Br(t,e));do try{L_();break}catch(r){vv(t,r)}while(!0);if(Vh(),Ze=n,$l.current=i,Pt!==null)throw Error(ie(261));return zt=null,jt=0,Nt}function L_(){for(;Pt!==null;)yv(Pt)}function U_(){for(;Pt!==null&&!ay();)yv(Pt)}function yv(t){var e=Sv(t.alternate,t,wn);t.memoizedProps=t.pendingProps,e===null?_v(t):Pt=e,nf.current=null}function _v(t){var e=t;do{var n=e.alternate;if(t=e.return,e.flags&32768){if(n=C_(n,e),n!==null){n.flags&=32767,Pt=n;return}if(t!==null)t.flags|=32768,t.subtreeFlags=0,t.deletions=null;else{Nt=6,Pt=null;return}}else if(n=b_(n,e,wn),n!==null){Pt=n;return}if(e=e.sibling,e!==null){Pt=e;return}Pt=e=t}while(e!==null);Nt===0&&(Nt=5)}function Cr(t,e,n){var i=rt,r=kn.transition;try{kn.transition=null,rt=1,O_(t,e,n,i)}finally{kn.transition=r,rt=i}return null}function O_(t,e,n,i){do Fs();while(Zi!==null);if(Ze&6)throw Error(ie(327));n=t.finishedWork;var r=t.finishedLanes;if(n===null)return null;if(t.finishedWork=null,t.finishedLanes=0,n===t.current)throw Error(ie(177));t.callbackNode=null,t.callbackPriority=0;var s=n.lanes|n.childLanes;if(gy(t,s),t===zt&&(Pt=zt=null,jt=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||Bo||(Bo=!0,wv(Ll,function(){return Fs(),null})),s=(n.flags&15990)!==0,n.subtreeFlags&15990||s){s=kn.transition,kn.transition=null;var a=rt;rt=1;var o=Ze;Ze|=4,nf.current=null,P_(t,n),pv(n,t),n_(sd),Ol=!!rd,sd=rd=null,t.current=n,D_(n),oy(),Ze=o,rt=a,kn.transition=s}else t.current=n;if(Bo&&(Bo=!1,Zi=t,Jl=r),s=t.pendingLanes,s===0&&(rr=null),uy(n.stateNode),yn(t,Ct()),e!==null)for(i=t.onRecoverableError,n=0;n<e.length;n++)r=e[n],i(r.value,{componentStack:r.stack,digest:r.digest});if(Zl)throw Zl=!1,t=Td,Td=null,t;return Jl&1&&t.tag!==0&&Fs(),s=t.pendingLanes,s&1?t===Ad?Ga++:(Ga=0,Ad=t):Ga=0,vr(),null}function Fs(){if(Zi!==null){var t=eg(Jl),e=kn.transition,n=rt;try{if(kn.transition=null,rt=16>t?16:t,Zi===null)var i=!1;else{if(t=Zi,Zi=null,Jl=0,Ze&6)throw Error(ie(331));var r=Ze;for(Ze|=4,xe=t.current;xe!==null;){var s=xe,a=s.child;if(xe.flags&16){var o=s.deletions;if(o!==null){for(var l=0;l<o.length;l++){var c=o[l];for(xe=c;xe!==null;){var u=xe;switch(u.tag){case 0:case 11:case 15:za(8,u,s)}var h=u.child;if(h!==null)h.return=u,xe=h;else for(;xe!==null;){u=xe;var f=u.sibling,p=u.return;if(dv(u),u===c){xe=null;break}if(f!==null){f.return=p,xe=f;break}xe=p}}}var v=s.alternate;if(v!==null){var y=v.child;if(y!==null){v.child=null;do{var m=y.sibling;y.sibling=null,y=m}while(y!==null)}}xe=s}}if(s.subtreeFlags&2064&&a!==null)a.return=s,xe=a;else e:for(;xe!==null;){if(s=xe,s.flags&2048)switch(s.tag){case 0:case 11:case 15:za(9,s,s.return)}var d=s.sibling;if(d!==null){d.return=s.return,xe=d;break e}xe=s.return}}var g=t.current;for(xe=g;xe!==null;){a=xe;var x=a.child;if(a.subtreeFlags&2064&&x!==null)x.return=a,xe=x;else e:for(a=g;xe!==null;){if(o=xe,o.flags&2048)try{switch(o.tag){case 0:case 11:case 15:gc(9,o)}}catch(R){At(o,o.return,R)}if(o===a){xe=null;break e}var _=o.sibling;if(_!==null){_.return=o.return,xe=_;break e}xe=o.return}}if(Ze=r,vr(),ci&&typeof ci.onPostCommitFiberRoot=="function")try{ci.onPostCommitFiberRoot(lc,t)}catch{}i=!0}return i}finally{rt=n,kn.transition=e}}return!1}function Kp(t,e,n){e=js(n,e),e=ev(t,e,1),t=ir(t,e,1),e=un(),t!==null&&(go(t,1,e),yn(t,e))}function At(t,e,n){if(t.tag===3)Kp(t,t,n);else for(;e!==null;){if(e.tag===3){Kp(e,t,n);break}else if(e.tag===1){var i=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof i.componentDidCatch=="function"&&(rr===null||!rr.has(i))){t=js(n,t),t=tv(e,t,1),e=ir(e,t,1),t=un(),e!==null&&(go(e,1,t),yn(e,t));break}}e=e.return}}function F_(t,e,n){var i=t.pingCache;i!==null&&i.delete(e),e=un(),t.pingedLanes|=t.suspendedLanes&n,zt===t&&(jt&n)===n&&(Nt===4||Nt===3&&(jt&130023424)===jt&&500>Ct()-sf?Br(t,0):rf|=n),yn(t,e)}function Mv(t,e){e===0&&(t.mode&1?(e=Ro,Ro<<=1,!(Ro&130023424)&&(Ro=4194304)):e=1);var n=un();t=Pi(t,e),t!==null&&(go(t,e,n),yn(t,n))}function k_(t){var e=t.memoizedState,n=0;e!==null&&(n=e.retryLane),Mv(t,n)}function B_(t,e){var n=0;switch(t.tag){case 13:var i=t.stateNode,r=t.memoizedState;r!==null&&(n=r.retryLane);break;case 19:i=t.stateNode;break;default:throw Error(ie(314))}i!==null&&i.delete(e),Mv(t,n)}var Sv;Sv=function(t,e,n){if(t!==null)if(t.memoizedProps!==e.pendingProps||vn.current)mn=!0;else{if(!(t.lanes&n)&&!(e.flags&128))return mn=!1,A_(t,e,n);mn=!!(t.flags&131072)}else mn=!1,yt&&e.flags&1048576&&Ag(e,Vl,e.index);switch(e.lanes=0,e.tag){case 2:var i=e.type;Ml(t,e),t=e.pendingProps;var r=Hs(e,nn.current);Os(e,n),r=Zh(null,e,i,t,r,n);var s=Jh();return e.flags|=1,typeof r=="object"&&r!==null&&typeof r.render=="function"&&r.$$typeof===void 0?(e.tag=1,e.memoizedState=null,e.updateQueue=null,xn(i)?(s=!0,Hl(e)):s=!1,e.memoizedState=r.state!==null&&r.state!==void 0?r.state:null,Xh(e),r.updater=mc,e.stateNode=r,r._reactInternals=e,pd(e,i,t,n),e=vd(null,e,i,!0,s,n)):(e.tag=0,yt&&s&&Bh(e),on(null,e,r,n),e=e.child),e;case 16:i=e.elementType;e:{switch(Ml(t,e),t=e.pendingProps,r=i._init,i=r(i._payload),e.type=i,r=e.tag=H_(i),t=Kn(i,t),r){case 0:e=gd(null,e,i,t,n);break e;case 1:e=Fp(null,e,i,t,n);break e;case 11:e=Up(null,e,i,t,n);break e;case 14:e=Op(null,e,i,Kn(i.type,t),n);break e}throw Error(ie(306,i,""))}return e;case 0:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Kn(i,r),gd(t,e,i,r,n);case 1:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Kn(i,r),Fp(t,e,i,r,n);case 3:e:{if(sv(e),t===null)throw Error(ie(387));i=e.pendingProps,s=e.memoizedState,r=s.element,Ng(t,e),Xl(e,i,null,n);var a=e.memoizedState;if(i=a.element,s.isDehydrated)if(s={element:i,isDehydrated:!1,cache:a.cache,pendingSuspenseBoundaries:a.pendingSuspenseBoundaries,transitions:a.transitions},e.updateQueue.baseState=s,e.memoizedState=s,e.flags&256){r=js(Error(ie(423)),e),e=kp(t,e,i,n,r);break e}else if(i!==r){r=js(Error(ie(424)),e),e=kp(t,e,i,n,r);break e}else for(Tn=nr(e.stateNode.containerInfo.firstChild),An=e,yt=!0,qn=null,n=Pg(e,null,i,n),e.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(Gs(),i===r){e=Di(t,e,n);break e}on(t,e,i,n)}e=e.child}return e;case 5:return Ig(e),t===null&&dd(e),i=e.type,r=e.pendingProps,s=t!==null?t.memoizedProps:null,a=r.children,ad(i,r)?a=null:s!==null&&ad(i,s)&&(e.flags|=32),rv(t,e),on(t,e,a,n),e.child;case 6:return t===null&&dd(e),null;case 13:return av(t,e,n);case 4:return Kh(e,e.stateNode.containerInfo),i=e.pendingProps,t===null?e.child=Vs(e,null,i,n):on(t,e,i,n),e.child;case 11:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Kn(i,r),Up(t,e,i,r,n);case 7:return on(t,e,e.pendingProps,n),e.child;case 8:return on(t,e,e.pendingProps.children,n),e.child;case 12:return on(t,e,e.pendingProps.children,n),e.child;case 10:e:{if(i=e.type._context,r=e.pendingProps,s=e.memoizedProps,a=r.value,pt(Wl,i._currentValue),i._currentValue=a,s!==null)if(ti(s.value,a)){if(s.children===r.children&&!vn.current){e=Di(t,e,n);break e}}else for(s=e.child,s!==null&&(s.return=e);s!==null;){var o=s.dependencies;if(o!==null){a=s.child;for(var l=o.firstContext;l!==null;){if(l.context===i){if(s.tag===1){l=Ti(-1,n&-n),l.tag=2;var c=s.updateQueue;if(c!==null){c=c.shared;var u=c.pending;u===null?l.next=l:(l.next=u.next,u.next=l),c.pending=l}}s.lanes|=n,l=s.alternate,l!==null&&(l.lanes|=n),hd(s.return,n,e),o.lanes|=n;break}l=l.next}}else if(s.tag===10)a=s.type===e.type?null:s.child;else if(s.tag===18){if(a=s.return,a===null)throw Error(ie(341));a.lanes|=n,o=a.alternate,o!==null&&(o.lanes|=n),hd(a,n,e),a=s.sibling}else a=s.child;if(a!==null)a.return=s;else for(a=s;a!==null;){if(a===e){a=null;break}if(s=a.sibling,s!==null){s.return=a.return,a=s;break}a=a.return}s=a}on(t,e,r.children,n),e=e.child}return e;case 9:return r=e.type,i=e.pendingProps.children,Os(e,n),r=Bn(r),i=i(r),e.flags|=1,on(t,e,i,n),e.child;case 14:return i=e.type,r=Kn(i,e.pendingProps),r=Kn(i.type,r),Op(t,e,i,r,n);case 15:return nv(t,e,e.type,e.pendingProps,n);case 17:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Kn(i,r),Ml(t,e),e.tag=1,xn(i)?(t=!0,Hl(e)):t=!1,Os(e,n),Qg(e,i,r),pd(e,i,r,n),vd(null,e,i,!0,t,n);case 19:return ov(t,e,n);case 22:return iv(t,e,n)}throw Error(ie(156,e.tag))};function wv(t,e){return $0(t,e)}function z_(t,e,n,i){this.tag=t,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=i,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Fn(t,e,n,i){return new z_(t,e,n,i)}function cf(t){return t=t.prototype,!(!t||!t.isReactComponent)}function H_(t){if(typeof t=="function")return cf(t)?1:0;if(t!=null){if(t=t.$$typeof,t===bh)return 11;if(t===Ch)return 14}return 2}function ar(t,e){var n=t.alternate;return n===null?(n=Fn(t.tag,e,t.key,t.mode),n.elementType=t.elementType,n.type=t.type,n.stateNode=t.stateNode,n.alternate=t,t.alternate=n):(n.pendingProps=e,n.type=t.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=t.flags&14680064,n.childLanes=t.childLanes,n.lanes=t.lanes,n.child=t.child,n.memoizedProps=t.memoizedProps,n.memoizedState=t.memoizedState,n.updateQueue=t.updateQueue,e=t.dependencies,n.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},n.sibling=t.sibling,n.index=t.index,n.ref=t.ref,n}function El(t,e,n,i,r,s){var a=2;if(i=t,typeof t=="function")cf(t)&&(a=1);else if(typeof t=="string")a=5;else e:switch(t){case ys:return zr(n.children,r,s,e);case Ah:a=8,r|=8;break;case ku:return t=Fn(12,n,e,r|2),t.elementType=ku,t.lanes=s,t;case Bu:return t=Fn(13,n,e,r),t.elementType=Bu,t.lanes=s,t;case zu:return t=Fn(19,n,e,r),t.elementType=zu,t.lanes=s,t;case I0:return xc(n,r,s,e);default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case D0:a=10;break e;case N0:a=9;break e;case bh:a=11;break e;case Ch:a=14;break e;case Wi:a=16,i=null;break e}throw Error(ie(130,t==null?t:typeof t,""))}return e=Fn(a,n,e,r),e.elementType=t,e.type=i,e.lanes=s,e}function zr(t,e,n,i){return t=Fn(7,t,i,e),t.lanes=n,t}function xc(t,e,n,i){return t=Fn(22,t,i,e),t.elementType=I0,t.lanes=n,t.stateNode={isHidden:!1},t}function Qc(t,e,n){return t=Fn(6,t,null,e),t.lanes=n,t}function eu(t,e,n){return e=Fn(4,t.children!==null?t.children:[],t.key,e),e.lanes=n,e.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},e}function G_(t,e,n,i,r){this.tag=e,this.containerInfo=t,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Lc(0),this.expirationTimes=Lc(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Lc(0),this.identifierPrefix=i,this.onRecoverableError=r,this.mutableSourceEagerHydrationData=null}function uf(t,e,n,i,r,s,a,o,l){return t=new G_(t,e,n,o,l),e===1?(e=1,s===!0&&(e|=8)):e=0,s=Fn(3,null,null,e),t.current=s,s.stateNode=t,s.memoizedState={element:i,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},Xh(s),t}function V_(t,e,n){var i=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:xs,key:i==null?null:""+i,children:t,containerInfo:e,implementation:n}}function Ev(t){if(!t)return dr;t=t._reactInternals;e:{if($r(t)!==t||t.tag!==1)throw Error(ie(170));var e=t;do{switch(e.tag){case 3:e=e.stateNode.context;break e;case 1:if(xn(e.type)){e=e.stateNode.__reactInternalMemoizedMergedChildContext;break e}}e=e.return}while(e!==null);throw Error(ie(171))}if(t.tag===1){var n=t.type;if(xn(n))return Eg(t,n,e)}return e}function Tv(t,e,n,i,r,s,a,o,l){return t=uf(n,i,!0,t,r,s,a,o,l),t.context=Ev(null),n=t.current,i=un(),r=sr(n),s=Ti(i,r),s.callback=e??null,ir(n,s,r),t.current.lanes=r,go(t,r,i),yn(t,i),t}function yc(t,e,n,i){var r=e.current,s=un(),a=sr(r);return n=Ev(n),e.context===null?e.context=n:e.pendingContext=n,e=Ti(s,a),e.payload={element:t},i=i===void 0?null:i,i!==null&&(e.callback=i),t=ir(r,e,a),t!==null&&(ei(t,r,a,s),xl(t,r,a)),a}function ec(t){if(t=t.current,!t.child)return null;switch(t.child.tag){case 5:return t.child.stateNode;default:return t.child.stateNode}}function Yp(t,e){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var n=t.retryLane;t.retryLane=n!==0&&n<e?n:e}}function df(t,e){Yp(t,e),(t=t.alternate)&&Yp(t,e)}function W_(){return null}var Av=typeof reportError=="function"?reportError:function(t){console.error(t)};function hf(t){this._internalRoot=t}_c.prototype.render=hf.prototype.render=function(t){var e=this._internalRoot;if(e===null)throw Error(ie(409));yc(t,e,null,null)};_c.prototype.unmount=hf.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var e=t.containerInfo;Xr(function(){yc(null,t,null,null)}),e[Ri]=null}};function _c(t){this._internalRoot=t}_c.prototype.unstable_scheduleHydration=function(t){if(t){var e=ig();t={blockedOn:null,target:t,priority:e};for(var n=0;n<Yi.length&&e!==0&&e<Yi[n].priority;n++);Yi.splice(n,0,t),n===0&&sg(t)}};function ff(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function Mc(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11&&(t.nodeType!==8||t.nodeValue!==" react-mount-point-unstable "))}function qp(){}function j_(t,e,n,i,r){if(r){if(typeof i=="function"){var s=i;i=function(){var c=ec(a);s.call(c)}}var a=Tv(e,i,t,0,null,!1,!1,"",qp);return t._reactRootContainer=a,t[Ri]=a.current,to(t.nodeType===8?t.parentNode:t),Xr(),a}for(;r=t.lastChild;)t.removeChild(r);if(typeof i=="function"){var o=i;i=function(){var c=ec(l);o.call(c)}}var l=uf(t,0,!1,null,null,!1,!1,"",qp);return t._reactRootContainer=l,t[Ri]=l.current,to(t.nodeType===8?t.parentNode:t),Xr(function(){yc(e,l,n,i)}),l}function Sc(t,e,n,i,r){var s=n._reactRootContainer;if(s){var a=s;if(typeof r=="function"){var o=r;r=function(){var l=ec(a);o.call(l)}}yc(e,a,t,r)}else a=j_(n,e,t,r,i);return ec(a)}tg=function(t){switch(t.tag){case 3:var e=t.stateNode;if(e.current.memoizedState.isDehydrated){var n=Ra(e.pendingLanes);n!==0&&(Dh(e,n|1),yn(e,Ct()),!(Ze&6)&&(Xs=Ct()+500,vr()))}break;case 13:Xr(function(){var i=Pi(t,1);if(i!==null){var r=un();ei(i,t,1,r)}}),df(t,1)}};Nh=function(t){if(t.tag===13){var e=Pi(t,134217728);if(e!==null){var n=un();ei(e,t,134217728,n)}df(t,134217728)}};ng=function(t){if(t.tag===13){var e=sr(t),n=Pi(t,e);if(n!==null){var i=un();ei(n,t,e,i)}df(t,e)}};ig=function(){return rt};rg=function(t,e){var n=rt;try{return rt=t,e()}finally{rt=n}};$u=function(t,e,n){switch(e){case"input":if(Vu(t,n),e=n.name,n.type==="radio"&&e!=null){for(n=t;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+e)+'][type="radio"]'),e=0;e<n.length;e++){var i=n[e];if(i!==t&&i.form===t.form){var r=hc(i);if(!r)throw Error(ie(90));U0(i),Vu(i,r)}}}break;case"textarea":F0(t,n);break;case"select":e=n.value,e!=null&&Ns(t,!!n.multiple,e,!1)}};W0=af;j0=Xr;var X_={usingClientEntryPoint:!1,Events:[xo,ws,hc,G0,V0,af]},va={findFiberByHostInstance:Or,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},K_={bundleType:va.bundleType,version:va.version,rendererPackageName:va.rendererPackageName,rendererConfig:va.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Li.ReactCurrentDispatcher,findHostInstanceByFiber:function(t){return t=Y0(t),t===null?null:t.stateNode},findFiberByHostInstance:va.findFiberByHostInstance||W_,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var zo=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!zo.isDisabled&&zo.supportsFiber)try{lc=zo.inject(K_),ci=zo}catch{}}Rn.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=X_;Rn.createPortal=function(t,e){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!ff(e))throw Error(ie(200));return V_(t,e,null,n)};Rn.createRoot=function(t,e){if(!ff(t))throw Error(ie(299));var n=!1,i="",r=Av;return e!=null&&(e.unstable_strictMode===!0&&(n=!0),e.identifierPrefix!==void 0&&(i=e.identifierPrefix),e.onRecoverableError!==void 0&&(r=e.onRecoverableError)),e=uf(t,1,!1,null,null,n,!1,i,r),t[Ri]=e.current,to(t.nodeType===8?t.parentNode:t),new hf(e)};Rn.findDOMNode=function(t){if(t==null)return null;if(t.nodeType===1)return t;var e=t._reactInternals;if(e===void 0)throw typeof t.render=="function"?Error(ie(188)):(t=Object.keys(t).join(","),Error(ie(268,t)));return t=Y0(e),t=t===null?null:t.stateNode,t};Rn.flushSync=function(t){return Xr(t)};Rn.hydrate=function(t,e,n){if(!Mc(e))throw Error(ie(200));return Sc(null,t,e,!0,n)};Rn.hydrateRoot=function(t,e,n){if(!ff(t))throw Error(ie(405));var i=n!=null&&n.hydratedSources||null,r=!1,s="",a=Av;if(n!=null&&(n.unstable_strictMode===!0&&(r=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onRecoverableError!==void 0&&(a=n.onRecoverableError)),e=Tv(e,null,t,1,n??null,r,!1,s,a),t[Ri]=e.current,to(t),i)for(t=0;t<i.length;t++)n=i[t],r=n._getVersion,r=r(n._source),e.mutableSourceEagerHydrationData==null?e.mutableSourceEagerHydrationData=[n,r]:e.mutableSourceEagerHydrationData.push(n,r);return new _c(e)};Rn.render=function(t,e,n){if(!Mc(e))throw Error(ie(200));return Sc(null,t,e,!1,n)};Rn.unmountComponentAtNode=function(t){if(!Mc(t))throw Error(ie(40));return t._reactRootContainer?(Xr(function(){Sc(null,null,t,!1,function(){t._reactRootContainer=null,t[Ri]=null})}),!0):!1};Rn.unstable_batchedUpdates=af;Rn.unstable_renderSubtreeIntoContainer=function(t,e,n,i){if(!Mc(n))throw Error(ie(200));if(t==null||t._reactInternals===void 0)throw Error(ie(38));return Sc(t,e,n,!1,i)};Rn.version="18.3.1-next-f1338f8080-20240426";function bv(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(bv)}catch(t){console.error(t)}}bv(),b0.exports=Rn;var Y_=b0.exports,$p=Y_;Ou.createRoot=$p.createRoot,Ou.hydrateRoot=$p.hydrateRoot;/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const pf="170",q_=0,Zp=1,$_=2,Cv=1,Z_=2,yi=3,hr=0,It=1,cn=2,or=0,Ai=1,Bt=2,Jp=3,Qp=4,J_=5,Dr=100,Q_=101,eM=102,tM=103,nM=104,iM=200,rM=201,sM=202,aM=203,Rd=204,Pd=205,oM=206,lM=207,cM=208,uM=209,dM=210,hM=211,fM=212,pM=213,mM=214,Dd=0,Nd=1,Id=2,Ks=3,Ld=4,Ud=5,Od=6,Fd=7,Rv=0,gM=1,vM=2,lr=0,xM=1,yM=2,_M=3,Pv=4,MM=5,SM=6,wM=7,Dv=300,Ys=301,qs=302,kd=303,Bd=304,wc=306,Mt=1e3,Qe=1001,zd=1002,bn=1003,EM=1004,Ho=1005,gn=1006,tu=1007,Zn=1008,Ni=1009,Nv=1010,Iv=1011,uo=1012,mf=1013,Kr=1014,li=1015,_o=1016,gf=1017,vf=1018,$s=1020,Lv=35902,Uv=1021,Ov=1022,Jn=1023,Fv=1024,kv=1025,ks=1026,Zs=1027,xf=1028,yf=1029,Bv=1030,_f=1031,Mf=1033,Tl=33776,Al=33777,bl=33778,Cl=33779,Hd=35840,Gd=35841,Vd=35842,Wd=35843,jd=36196,Xd=37492,Kd=37496,Yd=37808,qd=37809,$d=37810,Zd=37811,Jd=37812,Qd=37813,eh=37814,th=37815,nh=37816,ih=37817,rh=37818,sh=37819,ah=37820,oh=37821,Rl=36492,lh=36494,ch=36495,zv=36283,uh=36284,dh=36285,hh=36286,TM=3200,AM=3201,Hv=0,bM=1,Un="",Vt="srgb",ia="srgb-linear",Ec="linear",ot="srgb",ns=7680,em=519,CM=512,RM=513,PM=514,Gv=515,DM=516,NM=517,IM=518,LM=519,tm=35044,nm="300 es",Ei=2e3,tc=2001;class ra{addEventListener(e,n){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(n)===-1&&i[e].push(n)}hasEventListener(e,n){if(this._listeners===void 0)return!1;const i=this._listeners;return i[e]!==void 0&&i[e].indexOf(n)!==-1}removeEventListener(e,n){if(this._listeners===void 0)return;const r=this._listeners[e];if(r!==void 0){const s=r.indexOf(n);s!==-1&&r.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const i=this._listeners[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,e);e.target=null}}}const Zt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let im=1234567;const Va=Math.PI/180,ho=180/Math.PI;function sa(){const t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Zt[t&255]+Zt[t>>8&255]+Zt[t>>16&255]+Zt[t>>24&255]+"-"+Zt[e&255]+Zt[e>>8&255]+"-"+Zt[e>>16&15|64]+Zt[e>>24&255]+"-"+Zt[n&63|128]+Zt[n>>8&255]+"-"+Zt[n>>16&255]+Zt[n>>24&255]+Zt[i&255]+Zt[i>>8&255]+Zt[i>>16&255]+Zt[i>>24&255]).toLowerCase()}function tn(t,e,n){return Math.max(e,Math.min(n,t))}function Sf(t,e){return(t%e+e)%e}function UM(t,e,n,i,r){return i+(t-e)*(r-i)/(n-e)}function OM(t,e,n){return t!==e?(n-t)/(e-t):0}function Wa(t,e,n){return(1-n)*t+n*e}function FM(t,e,n,i){return Wa(t,e,1-Math.exp(-n*i))}function kM(t,e=1){return e-Math.abs(Sf(t,e*2)-e)}function BM(t,e,n){return t<=e?0:t>=n?1:(t=(t-e)/(n-e),t*t*(3-2*t))}function zM(t,e,n){return t<=e?0:t>=n?1:(t=(t-e)/(n-e),t*t*t*(t*(t*6-15)+10))}function HM(t,e){return t+Math.floor(Math.random()*(e-t+1))}function GM(t,e){return t+Math.random()*(e-t)}function VM(t){return t*(.5-Math.random())}function WM(t){t!==void 0&&(im=t);let e=im+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function jM(t){return t*Va}function XM(t){return t*ho}function KM(t){return(t&t-1)===0&&t!==0}function YM(t){return Math.pow(2,Math.ceil(Math.log(t)/Math.LN2))}function qM(t){return Math.pow(2,Math.floor(Math.log(t)/Math.LN2))}function $M(t,e,n,i,r){const s=Math.cos,a=Math.sin,o=s(n/2),l=a(n/2),c=s((e+i)/2),u=a((e+i)/2),h=s((e-i)/2),f=a((e-i)/2),p=s((i-e)/2),v=a((i-e)/2);switch(r){case"XYX":t.set(o*u,l*h,l*f,o*c);break;case"YZY":t.set(l*f,o*u,l*h,o*c);break;case"ZXZ":t.set(l*h,l*f,o*u,o*c);break;case"XZX":t.set(o*u,l*v,l*p,o*c);break;case"YXY":t.set(l*p,o*u,l*v,o*c);break;case"ZYZ":t.set(l*v,l*p,o*u,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function vs(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return t/4294967295;case Uint16Array:return t/65535;case Uint8Array:return t/255;case Int32Array:return Math.max(t/2147483647,-1);case Int16Array:return Math.max(t/32767,-1);case Int8Array:return Math.max(t/127,-1);default:throw new Error("Invalid component type.")}}function sn(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return Math.round(t*4294967295);case Uint16Array:return Math.round(t*65535);case Uint8Array:return Math.round(t*255);case Int32Array:return Math.round(t*2147483647);case Int16Array:return Math.round(t*32767);case Int8Array:return Math.round(t*127);default:throw new Error("Invalid component type.")}}const bt={DEG2RAD:Va,RAD2DEG:ho,generateUUID:sa,clamp:tn,euclideanModulo:Sf,mapLinear:UM,inverseLerp:OM,lerp:Wa,damp:FM,pingpong:kM,smoothstep:BM,smootherstep:zM,randInt:HM,randFloat:GM,randFloatSpread:VM,seededRandom:WM,degToRad:jM,radToDeg:XM,isPowerOfTwo:KM,ceilPowerOfTwo:YM,floorPowerOfTwo:qM,setQuaternionFromProperEuler:$M,normalize:sn,denormalize:vs};class Ge{constructor(e=0,n=0){Ge.prototype.isVector2=!0,this.x=e,this.y=n}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,n){return this.x=e,this.y=n,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const n=this.x,i=this.y,r=e.elements;return this.x=r[0]*n+r[3]*i+r[6],this.y=r[1]*n+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(tn(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y;return n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this}rotateAround(e,n){const i=Math.cos(n),r=Math.sin(n),s=this.x-e.x,a=this.y-e.y;return this.x=s*i-a*r+e.x,this.y=s*r+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ke{constructor(e,n,i,r,s,a,o,l,c){ke.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,a,o,l,c)}set(e,n,i,r,s,a,o,l,c){const u=this.elements;return u[0]=e,u[1]=r,u[2]=o,u[3]=n,u[4]=s,u[5]=l,u[6]=i,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],this}extractBasis(e,n,i){return e.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const n=e.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],u=i[4],h=i[7],f=i[2],p=i[5],v=i[8],y=r[0],m=r[3],d=r[6],g=r[1],x=r[4],_=r[7],R=r[2],T=r[5],A=r[8];return s[0]=a*y+o*g+l*R,s[3]=a*m+o*x+l*T,s[6]=a*d+o*_+l*A,s[1]=c*y+u*g+h*R,s[4]=c*m+u*x+h*T,s[7]=c*d+u*_+h*A,s[2]=f*y+p*g+v*R,s[5]=f*m+p*x+v*T,s[8]=f*d+p*_+v*A,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[3]*=e,n[6]*=e,n[1]*=e,n[4]*=e,n[7]*=e,n[2]*=e,n[5]*=e,n[8]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8];return n*a*u-n*o*c-i*s*u+i*o*l+r*s*c-r*a*l}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],h=u*a-o*c,f=o*l-u*s,p=c*s-a*l,v=n*h+i*f+r*p;if(v===0)return this.set(0,0,0,0,0,0,0,0,0);const y=1/v;return e[0]=h*y,e[1]=(r*c-u*i)*y,e[2]=(o*i-r*a)*y,e[3]=f*y,e[4]=(u*n-r*l)*y,e[5]=(r*s-o*n)*y,e[6]=p*y,e[7]=(i*l-c*n)*y,e[8]=(a*n-i*s)*y,this}transpose(){let e;const n=this.elements;return e=n[1],n[1]=n[3],n[3]=e,e=n[2],n[2]=n[6],n[6]=e,e=n[5],n[5]=n[7],n[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const n=this.elements;return e[0]=n[0],e[1]=n[3],e[2]=n[6],e[3]=n[1],e[4]=n[4],e[5]=n[7],e[6]=n[2],e[7]=n[5],e[8]=n[8],this}setUvTransform(e,n,i,r,s,a,o){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-r*c,r*l,-r*(-c*a+l*o)+o+n,0,0,1),this}scale(e,n){return this.premultiply(nu.makeScale(e,n)),this}rotate(e){return this.premultiply(nu.makeRotation(-e)),this}translate(e,n){return this.premultiply(nu.makeTranslation(e,n)),this}makeTranslation(e,n){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,n,0,0,1),this}makeRotation(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,i,n,0,0,0,1),this}makeScale(e,n){return this.set(e,0,0,0,n,0,0,0,1),this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<9;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<9;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const nu=new ke;function Vv(t){for(let e=t.length-1;e>=0;--e)if(t[e]>=65535)return!0;return!1}function fo(t){return document.createElementNS("http://www.w3.org/1999/xhtml",t)}function ZM(){const t=fo("canvas");return t.style.display="block",t}const rm={};function Da(t){t in rm||(rm[t]=!0,console.warn(t))}function JM(t,e,n){return new Promise(function(i,r){function s(){switch(t.clientWaitSync(e,t.SYNC_FLUSH_COMMANDS_BIT,0)){case t.WAIT_FAILED:r();break;case t.TIMEOUT_EXPIRED:setTimeout(s,n);break;default:i()}}setTimeout(s,n)})}function QM(t){const e=t.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function eS(t){const e=t.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const $e={enabled:!0,workingColorSpace:ia,spaces:{},convert:function(t,e,n){return this.enabled===!1||e===n||!e||!n||(this.spaces[e].transfer===ot&&(t.r=bi(t.r),t.g=bi(t.g),t.b=bi(t.b)),this.spaces[e].primaries!==this.spaces[n].primaries&&(t.applyMatrix3(this.spaces[e].toXYZ),t.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===ot&&(t.r=Bs(t.r),t.g=Bs(t.g),t.b=Bs(t.b))),t},fromWorkingColorSpace:function(t,e){return this.convert(t,this.workingColorSpace,e)},toWorkingColorSpace:function(t,e){return this.convert(t,e,this.workingColorSpace)},getPrimaries:function(t){return this.spaces[t].primaries},getTransfer:function(t){return t===Un?Ec:this.spaces[t].transfer},getLuminanceCoefficients:function(t,e=this.workingColorSpace){return t.fromArray(this.spaces[e].luminanceCoefficients)},define:function(t){Object.assign(this.spaces,t)},_getMatrix:function(t,e,n){return t.copy(this.spaces[e].toXYZ).multiply(this.spaces[n].fromXYZ)},_getDrawingBufferColorSpace:function(t){return this.spaces[t].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(t=this.workingColorSpace){return this.spaces[t].workingColorSpaceConfig.unpackColorSpace}};function bi(t){return t<.04045?t*.0773993808:Math.pow(t*.9478672986+.0521327014,2.4)}function Bs(t){return t<.0031308?t*12.92:1.055*Math.pow(t,.41666)-.055}const sm=[.64,.33,.3,.6,.15,.06],am=[.2126,.7152,.0722],om=[.3127,.329],lm=new ke().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),cm=new ke().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);$e.define({[ia]:{primaries:sm,whitePoint:om,transfer:Ec,toXYZ:lm,fromXYZ:cm,luminanceCoefficients:am,workingColorSpaceConfig:{unpackColorSpace:Vt},outputColorSpaceConfig:{drawingBufferColorSpace:Vt}},[Vt]:{primaries:sm,whitePoint:om,transfer:ot,toXYZ:lm,fromXYZ:cm,luminanceCoefficients:am,outputColorSpaceConfig:{drawingBufferColorSpace:Vt}}});let is;class tS{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{is===void 0&&(is=fo("canvas")),is.width=e.width,is.height=e.height;const i=is.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=is}return n.width>2048||n.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),n.toDataURL("image/jpeg",.6)):n.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const n=fo("canvas");n.width=e.width,n.height=e.height;const i=n.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=bi(s[a]/255)*255;return i.putImageData(r,0,0),n}else if(e.data){const n=e.data.slice(0);for(let i=0;i<n.length;i++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[i]=Math.floor(bi(n[i]/255)*255):n[i]=bi(n[i]);return{data:n,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let nS=0;class Wv{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:nS++}),this.uuid=sa(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(iu(r[a].image)):s.push(iu(r[a]))}else s=iu(r);i.url=s}return n||(e.images[this.uuid]=i),i}}function iu(t){return typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap?tS.getDataURL(t):t.data?{data:Array.from(t.data),width:t.width,height:t.height,type:t.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let iS=0;class Ht extends ra{constructor(e=Ht.DEFAULT_IMAGE,n=Ht.DEFAULT_MAPPING,i=Qe,r=Qe,s=gn,a=Zn,o=Jn,l=Ni,c=Ht.DEFAULT_ANISOTROPY,u=Un){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:iS++}),this.uuid=sa(),this.name="",this.source=new Wv(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Ge(0,0),this.repeat=new Ge(1,1),this.center=new Ge(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ke,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),n||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Dv)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Mt:e.x=e.x-Math.floor(e.x);break;case Qe:e.x=e.x<0?0:1;break;case zd:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Mt:e.y=e.y-Math.floor(e.y);break;case Qe:e.y=e.y<0?0:1;break;case zd:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Ht.DEFAULT_IMAGE=null;Ht.DEFAULT_MAPPING=Dv;Ht.DEFAULT_ANISOTROPY=1;class lt{constructor(e=0,n=0,i=0,r=1){lt.prototype.isVector4=!0,this.x=e,this.y=n,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,n,i,r){return this.x=e,this.y=n,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this.w=e.w+n.w,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this.w+=e.w*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this.w=e.w-n.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=this.w,a=e.elements;return this.x=a[0]*n+a[4]*i+a[8]*r+a[12]*s,this.y=a[1]*n+a[5]*i+a[9]*r+a[13]*s,this.z=a[2]*n+a[6]*i+a[10]*r+a[14]*s,this.w=a[3]*n+a[7]*i+a[11]*r+a[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const n=Math.sqrt(1-e.w*e.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/n,this.y=e.y/n,this.z=e.z/n),this}setAxisAngleFromRotationMatrix(e){let n,i,r,s;const l=e.elements,c=l[0],u=l[4],h=l[8],f=l[1],p=l[5],v=l[9],y=l[2],m=l[6],d=l[10];if(Math.abs(u-f)<.01&&Math.abs(h-y)<.01&&Math.abs(v-m)<.01){if(Math.abs(u+f)<.1&&Math.abs(h+y)<.1&&Math.abs(v+m)<.1&&Math.abs(c+p+d-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;const x=(c+1)/2,_=(p+1)/2,R=(d+1)/2,T=(u+f)/4,A=(h+y)/4,b=(v+m)/4;return x>_&&x>R?x<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(x),r=T/i,s=A/i):_>R?_<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(_),i=T/r,s=b/r):R<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(R),i=A/s,r=b/s),this.set(i,r,s,n),this}let g=Math.sqrt((m-v)*(m-v)+(h-y)*(h-y)+(f-u)*(f-u));return Math.abs(g)<.001&&(g=1),this.x=(m-v)/g,this.y=(h-y)/g,this.z=(f-u)/g,this.w=Math.acos((c+p+d-1)/2),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this.w=n[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this.z=Math.max(e.z,Math.min(n.z,this.z)),this.w=Math.max(e.w,Math.min(n.w,this.w)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this.z=Math.max(e,Math.min(n,this.z)),this.w=Math.max(e,Math.min(n,this.w)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this.w+=(e.w-this.w)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this.w=e.w+(n.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this.w=e[n+3],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e[n+3]=this.w,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this.w=e.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class rS extends ra{constructor(e=1,n=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=n,this.depth=1,this.scissor=new lt(0,0,e,n),this.scissorTest=!1,this.viewport=new lt(0,0,e,n);const r={width:e,height:n,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:gn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new Ht(r,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const a=i.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,n,i=1){if(this.width!==e||this.height!==n||this.depth!==i){this.width=e,this.height=n,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=n,this.textures[r].image.depth=i;this.dispose()}this.viewport.set(0,0,e,n),this.scissor.set(0,0,e,n)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,r=e.textures.length;i<r;i++)this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const n=Object.assign({},e.texture.image);return this.texture.source=new Wv(n),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Yr extends rS{constructor(e=1,n=1,i={}){super(e,n,i),this.isWebGLRenderTarget=!0}}class jv extends Ht{constructor(e=null,n=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=bn,this.minFilter=bn,this.wrapR=Qe,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class sS extends Ht{constructor(e=null,n=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=bn,this.minFilter=bn,this.wrapR=Qe,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class aa{constructor(e=0,n=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=n,this._z=i,this._w=r}static slerpFlat(e,n,i,r,s,a,o){let l=i[r+0],c=i[r+1],u=i[r+2],h=i[r+3];const f=s[a+0],p=s[a+1],v=s[a+2],y=s[a+3];if(o===0){e[n+0]=l,e[n+1]=c,e[n+2]=u,e[n+3]=h;return}if(o===1){e[n+0]=f,e[n+1]=p,e[n+2]=v,e[n+3]=y;return}if(h!==y||l!==f||c!==p||u!==v){let m=1-o;const d=l*f+c*p+u*v+h*y,g=d>=0?1:-1,x=1-d*d;if(x>Number.EPSILON){const R=Math.sqrt(x),T=Math.atan2(R,d*g);m=Math.sin(m*T)/R,o=Math.sin(o*T)/R}const _=o*g;if(l=l*m+f*_,c=c*m+p*_,u=u*m+v*_,h=h*m+y*_,m===1-o){const R=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=R,c*=R,u*=R,h*=R}}e[n]=l,e[n+1]=c,e[n+2]=u,e[n+3]=h}static multiplyQuaternionsFlat(e,n,i,r,s,a){const o=i[r],l=i[r+1],c=i[r+2],u=i[r+3],h=s[a],f=s[a+1],p=s[a+2],v=s[a+3];return e[n]=o*v+u*h+l*p-c*f,e[n+1]=l*v+u*f+c*h-o*p,e[n+2]=c*v+u*p+o*f-l*h,e[n+3]=u*v-o*h-l*f-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,n,i,r){return this._x=e,this._y=n,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,n=!0){const i=e._x,r=e._y,s=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),u=o(r/2),h=o(s/2),f=l(i/2),p=l(r/2),v=l(s/2);switch(a){case"XYZ":this._x=f*u*h+c*p*v,this._y=c*p*h-f*u*v,this._z=c*u*v+f*p*h,this._w=c*u*h-f*p*v;break;case"YXZ":this._x=f*u*h+c*p*v,this._y=c*p*h-f*u*v,this._z=c*u*v-f*p*h,this._w=c*u*h+f*p*v;break;case"ZXY":this._x=f*u*h-c*p*v,this._y=c*p*h+f*u*v,this._z=c*u*v+f*p*h,this._w=c*u*h-f*p*v;break;case"ZYX":this._x=f*u*h-c*p*v,this._y=c*p*h+f*u*v,this._z=c*u*v-f*p*h,this._w=c*u*h+f*p*v;break;case"YZX":this._x=f*u*h+c*p*v,this._y=c*p*h+f*u*v,this._z=c*u*v-f*p*h,this._w=c*u*h-f*p*v;break;case"XZY":this._x=f*u*h-c*p*v,this._y=c*p*h-f*u*v,this._z=c*u*v+f*p*h,this._w=c*u*h+f*p*v;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return n===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,n){const i=n/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const n=e.elements,i=n[0],r=n[4],s=n[8],a=n[1],o=n[5],l=n[9],c=n[2],u=n[6],h=n[10],f=i+o+h;if(f>0){const p=.5/Math.sqrt(f+1);this._w=.25/p,this._x=(u-l)*p,this._y=(s-c)*p,this._z=(a-r)*p}else if(i>o&&i>h){const p=2*Math.sqrt(1+i-o-h);this._w=(u-l)/p,this._x=.25*p,this._y=(r+a)/p,this._z=(s+c)/p}else if(o>h){const p=2*Math.sqrt(1+o-i-h);this._w=(s-c)/p,this._x=(r+a)/p,this._y=.25*p,this._z=(l+u)/p}else{const p=2*Math.sqrt(1+h-i-o);this._w=(a-r)/p,this._x=(s+c)/p,this._y=(l+u)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,n){let i=e.dot(n)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*n.z-e.z*n.y,this._y=e.z*n.x-e.x*n.z,this._z=e.x*n.y-e.y*n.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(tn(this.dot(e),-1,1)))}rotateTowards(e,n){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,n/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,n){const i=e._x,r=e._y,s=e._z,a=e._w,o=n._x,l=n._y,c=n._z,u=n._w;return this._x=i*u+a*o+r*c-s*l,this._y=r*u+a*l+s*o-i*c,this._z=s*u+a*c+i*l-r*o,this._w=a*u-i*o-r*l-s*c,this._onChangeCallback(),this}slerp(e,n){if(n===0)return this;if(n===1)return this.copy(e);const i=this._x,r=this._y,s=this._z,a=this._w;let o=a*e._w+i*e._x+r*e._y+s*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=i,this._y=r,this._z=s,this;const l=1-o*o;if(l<=Number.EPSILON){const p=1-n;return this._w=p*a+n*this._w,this._x=p*i+n*this._x,this._y=p*r+n*this._y,this._z=p*s+n*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,o),h=Math.sin((1-n)*u)/c,f=Math.sin(n*u)/c;return this._w=a*h+this._w*f,this._x=i*h+this._x*f,this._y=r*h+this._y*f,this._z=s*h+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,n,i){return this.copy(e).slerp(n,i)}random(){const e=2*Math.PI*Math.random(),n=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(n),s*Math.cos(n))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,n=0){return this._x=e[n],this._y=e[n+1],this._z=e[n+2],this._w=e[n+3],this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._w,e}fromBufferAttribute(e,n){return this._x=e.getX(n),this._y=e.getY(n),this._z=e.getZ(n),this._w=e.getW(n),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class P{constructor(e=0,n=0,i=0){P.prototype.isVector3=!0,this.x=e,this.y=n,this.z=i}set(e,n,i){return i===void 0&&(i=this.z),this.x=e,this.y=n,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,n){return this.x=e.x*n.x,this.y=e.y*n.y,this.z=e.z*n.z,this}applyEuler(e){return this.applyQuaternion(um.setFromEuler(e))}applyAxisAngle(e,n){return this.applyQuaternion(um.setFromAxisAngle(e,n))}applyMatrix3(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[3]*i+s[6]*r,this.y=s[1]*n+s[4]*i+s[7]*r,this.z=s[2]*n+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=e.elements,a=1/(s[3]*n+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*n+s[4]*i+s[8]*r+s[12])*a,this.y=(s[1]*n+s[5]*i+s[9]*r+s[13])*a,this.z=(s[2]*n+s[6]*i+s[10]*r+s[14])*a,this}applyQuaternion(e){const n=this.x,i=this.y,r=this.z,s=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*r-o*i),u=2*(o*n-s*r),h=2*(s*i-a*n);return this.x=n+l*c+a*h-o*u,this.y=i+l*u+o*c-s*h,this.z=r+l*h+s*u-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[4]*i+s[8]*r,this.y=s[1]*n+s[5]*i+s[9]*r,this.z=s[2]*n+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this.z=Math.max(e.z,Math.min(n.z,this.z)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this.z=Math.max(e,Math.min(n,this.z)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,n){const i=e.x,r=e.y,s=e.z,a=n.x,o=n.y,l=n.z;return this.x=r*l-s*o,this.y=s*a-i*l,this.z=i*o-r*a,this}projectOnVector(e){const n=e.lengthSq();if(n===0)return this.set(0,0,0);const i=e.dot(this)/n;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return ru.copy(this).projectOnVector(e),this.sub(ru)}reflect(e){return this.sub(ru.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(tn(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return n*n+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,n,i){const r=Math.sin(n)*e;return this.x=r*Math.sin(i),this.y=Math.cos(n)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,n,i){return this.x=e*Math.sin(n),this.y=i,this.z=e*Math.cos(n),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(e){const n=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=n,this.y=i,this.z=r,this}setFromMatrixColumn(e,n){return this.fromArray(e.elements,n*4)}setFromMatrix3Column(e,n){return this.fromArray(e.elements,n*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,n=Math.random()*2-1,i=Math.sqrt(1-n*n);return this.x=i*Math.cos(e),this.y=n,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const ru=new P,um=new aa;class Zr{constructor(e=new P(1/0,1/0,1/0),n=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=n}set(e,n){return this.min.copy(e),this.max.copy(n),this}setFromArray(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n+=3)this.expandByPoint(Wn.fromArray(e,n));return this}setFromBufferAttribute(e){this.makeEmpty();for(let n=0,i=e.count;n<i;n++)this.expandByPoint(Wn.fromBufferAttribute(e,n));return this}setFromPoints(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n++)this.expandByPoint(e[n]);return this}setFromCenterAndSize(e,n){const i=Wn.copy(n).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,n=!1){return this.makeEmpty(),this.expandByObject(e,n)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,n=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(n===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Wn):Wn.fromBufferAttribute(s,a),Wn.applyMatrix4(e.matrixWorld),this.expandByPoint(Wn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Go.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Go.copy(i.boundingBox)),Go.applyMatrix4(e.matrixWorld),this.union(Go)}const r=e.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],n);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,n){return n.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Wn),Wn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let n,i;return e.normal.x>0?(n=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(n=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(n+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(n+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(n+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(n+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),n<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(xa),Vo.subVectors(this.max,xa),rs.subVectors(e.a,xa),ss.subVectors(e.b,xa),as.subVectors(e.c,xa),ki.subVectors(ss,rs),Bi.subVectors(as,ss),_r.subVectors(rs,as);let n=[0,-ki.z,ki.y,0,-Bi.z,Bi.y,0,-_r.z,_r.y,ki.z,0,-ki.x,Bi.z,0,-Bi.x,_r.z,0,-_r.x,-ki.y,ki.x,0,-Bi.y,Bi.x,0,-_r.y,_r.x,0];return!su(n,rs,ss,as,Vo)||(n=[1,0,0,0,1,0,0,0,1],!su(n,rs,ss,as,Vo))?!1:(Wo.crossVectors(ki,Bi),n=[Wo.x,Wo.y,Wo.z],su(n,rs,ss,as,Vo))}clampPoint(e,n){return n.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Wn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Wn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(pi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),pi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),pi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),pi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),pi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),pi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),pi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),pi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(pi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const pi=[new P,new P,new P,new P,new P,new P,new P,new P],Wn=new P,Go=new Zr,rs=new P,ss=new P,as=new P,ki=new P,Bi=new P,_r=new P,xa=new P,Vo=new P,Wo=new P,Mr=new P;function su(t,e,n,i,r){for(let s=0,a=t.length-3;s<=a;s+=3){Mr.fromArray(t,s);const o=r.x*Math.abs(Mr.x)+r.y*Math.abs(Mr.y)+r.z*Math.abs(Mr.z),l=e.dot(Mr),c=n.dot(Mr),u=i.dot(Mr);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}const aS=new Zr,ya=new P,au=new P;class Jr{constructor(e=new P,n=-1){this.isSphere=!0,this.center=e,this.radius=n}set(e,n){return this.center.copy(e),this.radius=n,this}setFromPoints(e,n){const i=this.center;n!==void 0?i.copy(n):aS.setFromPoints(e).getCenter(i);let r=0;for(let s=0,a=e.length;s<a;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const n=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=n*n}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,n){const i=this.center.distanceToSquared(e);return n.copy(e),i>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ya.subVectors(e,this.center);const n=ya.lengthSq();if(n>this.radius*this.radius){const i=Math.sqrt(n),r=(i-this.radius)*.5;this.center.addScaledVector(ya,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(au.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ya.copy(e.center).add(au)),this.expandByPoint(ya.copy(e.center).sub(au))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const mi=new P,ou=new P,jo=new P,zi=new P,lu=new P,Xo=new P,cu=new P;class Tc{constructor(e=new P,n=new P(0,0,-1)){this.origin=e,this.direction=n}set(e,n){return this.origin.copy(e),this.direction.copy(n),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,n){return n.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,mi)),this}closestPointToPoint(e,n){n.subVectors(e,this.origin);const i=n.dot(this.direction);return i<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const n=mi.subVectors(e,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(e):(mi.copy(this.origin).addScaledVector(this.direction,n),mi.distanceToSquared(e))}distanceSqToSegment(e,n,i,r){ou.copy(e).add(n).multiplyScalar(.5),jo.copy(n).sub(e).normalize(),zi.copy(this.origin).sub(ou);const s=e.distanceTo(n)*.5,a=-this.direction.dot(jo),o=zi.dot(this.direction),l=-zi.dot(jo),c=zi.lengthSq(),u=Math.abs(1-a*a);let h,f,p,v;if(u>0)if(h=a*l-o,f=a*o-l,v=s*u,h>=0)if(f>=-v)if(f<=v){const y=1/u;h*=y,f*=y,p=h*(h+a*f+2*o)+f*(a*h+f+2*l)+c}else f=s,h=Math.max(0,-(a*f+o)),p=-h*h+f*(f+2*l)+c;else f=-s,h=Math.max(0,-(a*f+o)),p=-h*h+f*(f+2*l)+c;else f<=-v?(h=Math.max(0,-(-a*s+o)),f=h>0?-s:Math.min(Math.max(-s,-l),s),p=-h*h+f*(f+2*l)+c):f<=v?(h=0,f=Math.min(Math.max(-s,-l),s),p=f*(f+2*l)+c):(h=Math.max(0,-(a*s+o)),f=h>0?s:Math.min(Math.max(-s,-l),s),p=-h*h+f*(f+2*l)+c);else f=a>0?-s:s,h=Math.max(0,-(a*f+o)),p=-h*h+f*(f+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,h),r&&r.copy(ou).addScaledVector(jo,f),p}intersectSphere(e,n){mi.subVectors(e.center,this.origin);const i=mi.dot(this.direction),r=mi.dot(mi)-i*i,s=e.radius*e.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,n):this.at(o,n)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const n=e.normal.dot(this.direction);if(n===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/n;return i>=0?i:null}intersectPlane(e,n){const i=this.distanceToPlane(e);return i===null?null:this.at(i,n)}intersectsPlane(e){const n=e.distanceToPoint(this.origin);return n===0||e.normal.dot(this.direction)*n<0}intersectBox(e,n){let i,r,s,a,o,l;const c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,f=this.origin;return c>=0?(i=(e.min.x-f.x)*c,r=(e.max.x-f.x)*c):(i=(e.max.x-f.x)*c,r=(e.min.x-f.x)*c),u>=0?(s=(e.min.y-f.y)*u,a=(e.max.y-f.y)*u):(s=(e.max.y-f.y)*u,a=(e.min.y-f.y)*u),i>a||s>r||((s>i||isNaN(i))&&(i=s),(a<r||isNaN(r))&&(r=a),h>=0?(o=(e.min.z-f.z)*h,l=(e.max.z-f.z)*h):(o=(e.max.z-f.z)*h,l=(e.min.z-f.z)*h),i>l||o>r)||((o>i||i!==i)&&(i=o),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,n)}intersectsBox(e){return this.intersectBox(e,mi)!==null}intersectTriangle(e,n,i,r,s){lu.subVectors(n,e),Xo.subVectors(i,e),cu.crossVectors(lu,Xo);let a=this.direction.dot(cu),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;zi.subVectors(this.origin,e);const l=o*this.direction.dot(Xo.crossVectors(zi,Xo));if(l<0)return null;const c=o*this.direction.dot(lu.cross(zi));if(c<0||l+c>a)return null;const u=-o*zi.dot(cu);return u<0?null:this.at(u/a,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class st{constructor(e,n,i,r,s,a,o,l,c,u,h,f,p,v,y,m){st.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,a,o,l,c,u,h,f,p,v,y,m)}set(e,n,i,r,s,a,o,l,c,u,h,f,p,v,y,m){const d=this.elements;return d[0]=e,d[4]=n,d[8]=i,d[12]=r,d[1]=s,d[5]=a,d[9]=o,d[13]=l,d[2]=c,d[6]=u,d[10]=h,d[14]=f,d[3]=p,d[7]=v,d[11]=y,d[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new st().fromArray(this.elements)}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],n[9]=i[9],n[10]=i[10],n[11]=i[11],n[12]=i[12],n[13]=i[13],n[14]=i[14],n[15]=i[15],this}copyPosition(e){const n=this.elements,i=e.elements;return n[12]=i[12],n[13]=i[13],n[14]=i[14],this}setFromMatrix3(e){const n=e.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(e,n,i){return e.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,n,i){return this.set(e.x,n.x,i.x,0,e.y,n.y,i.y,0,e.z,n.z,i.z,0,0,0,0,1),this}extractRotation(e){const n=this.elements,i=e.elements,r=1/os.setFromMatrixColumn(e,0).length(),s=1/os.setFromMatrixColumn(e,1).length(),a=1/os.setFromMatrixColumn(e,2).length();return n[0]=i[0]*r,n[1]=i[1]*r,n[2]=i[2]*r,n[3]=0,n[4]=i[4]*s,n[5]=i[5]*s,n[6]=i[6]*s,n[7]=0,n[8]=i[8]*a,n[9]=i[9]*a,n[10]=i[10]*a,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(e){const n=this.elements,i=e.x,r=e.y,s=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(r),c=Math.sin(r),u=Math.cos(s),h=Math.sin(s);if(e.order==="XYZ"){const f=a*u,p=a*h,v=o*u,y=o*h;n[0]=l*u,n[4]=-l*h,n[8]=c,n[1]=p+v*c,n[5]=f-y*c,n[9]=-o*l,n[2]=y-f*c,n[6]=v+p*c,n[10]=a*l}else if(e.order==="YXZ"){const f=l*u,p=l*h,v=c*u,y=c*h;n[0]=f+y*o,n[4]=v*o-p,n[8]=a*c,n[1]=a*h,n[5]=a*u,n[9]=-o,n[2]=p*o-v,n[6]=y+f*o,n[10]=a*l}else if(e.order==="ZXY"){const f=l*u,p=l*h,v=c*u,y=c*h;n[0]=f-y*o,n[4]=-a*h,n[8]=v+p*o,n[1]=p+v*o,n[5]=a*u,n[9]=y-f*o,n[2]=-a*c,n[6]=o,n[10]=a*l}else if(e.order==="ZYX"){const f=a*u,p=a*h,v=o*u,y=o*h;n[0]=l*u,n[4]=v*c-p,n[8]=f*c+y,n[1]=l*h,n[5]=y*c+f,n[9]=p*c-v,n[2]=-c,n[6]=o*l,n[10]=a*l}else if(e.order==="YZX"){const f=a*l,p=a*c,v=o*l,y=o*c;n[0]=l*u,n[4]=y-f*h,n[8]=v*h+p,n[1]=h,n[5]=a*u,n[9]=-o*u,n[2]=-c*u,n[6]=p*h+v,n[10]=f-y*h}else if(e.order==="XZY"){const f=a*l,p=a*c,v=o*l,y=o*c;n[0]=l*u,n[4]=-h,n[8]=c*u,n[1]=f*h+y,n[5]=a*u,n[9]=p*h-v,n[2]=v*h-p,n[6]=o*u,n[10]=y*h+f}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(e){return this.compose(oS,e,lS)}lookAt(e,n,i){const r=this.elements;return Mn.subVectors(e,n),Mn.lengthSq()===0&&(Mn.z=1),Mn.normalize(),Hi.crossVectors(i,Mn),Hi.lengthSq()===0&&(Math.abs(i.z)===1?Mn.x+=1e-4:Mn.z+=1e-4,Mn.normalize(),Hi.crossVectors(i,Mn)),Hi.normalize(),Ko.crossVectors(Mn,Hi),r[0]=Hi.x,r[4]=Ko.x,r[8]=Mn.x,r[1]=Hi.y,r[5]=Ko.y,r[9]=Mn.y,r[2]=Hi.z,r[6]=Ko.z,r[10]=Mn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],u=i[1],h=i[5],f=i[9],p=i[13],v=i[2],y=i[6],m=i[10],d=i[14],g=i[3],x=i[7],_=i[11],R=i[15],T=r[0],A=r[4],b=r[8],w=r[12],M=r[1],D=r[5],V=r[9],z=r[13],X=r[2],Z=r[6],Y=r[10],te=r[14],I=r[3],$=r[7],J=r[11],ae=r[15];return s[0]=a*T+o*M+l*X+c*I,s[4]=a*A+o*D+l*Z+c*$,s[8]=a*b+o*V+l*Y+c*J,s[12]=a*w+o*z+l*te+c*ae,s[1]=u*T+h*M+f*X+p*I,s[5]=u*A+h*D+f*Z+p*$,s[9]=u*b+h*V+f*Y+p*J,s[13]=u*w+h*z+f*te+p*ae,s[2]=v*T+y*M+m*X+d*I,s[6]=v*A+y*D+m*Z+d*$,s[10]=v*b+y*V+m*Y+d*J,s[14]=v*w+y*z+m*te+d*ae,s[3]=g*T+x*M+_*X+R*I,s[7]=g*A+x*D+_*Z+R*$,s[11]=g*b+x*V+_*Y+R*J,s[15]=g*w+x*z+_*te+R*ae,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[4]*=e,n[8]*=e,n[12]*=e,n[1]*=e,n[5]*=e,n[9]*=e,n[13]*=e,n[2]*=e,n[6]*=e,n[10]*=e,n[14]*=e,n[3]*=e,n[7]*=e,n[11]*=e,n[15]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[4],r=e[8],s=e[12],a=e[1],o=e[5],l=e[9],c=e[13],u=e[2],h=e[6],f=e[10],p=e[14],v=e[3],y=e[7],m=e[11],d=e[15];return v*(+s*l*h-r*c*h-s*o*f+i*c*f+r*o*p-i*l*p)+y*(+n*l*p-n*c*f+s*a*f-r*a*p+r*c*u-s*l*u)+m*(+n*c*h-n*o*p-s*a*h+i*a*p+s*o*u-i*c*u)+d*(-r*o*u-n*l*h+n*o*f+r*a*h-i*a*f+i*l*u)}transpose(){const e=this.elements;let n;return n=e[1],e[1]=e[4],e[4]=n,n=e[2],e[2]=e[8],e[8]=n,n=e[6],e[6]=e[9],e[9]=n,n=e[3],e[3]=e[12],e[12]=n,n=e[7],e[7]=e[13],e[13]=n,n=e[11],e[11]=e[14],e[14]=n,this}setPosition(e,n,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=n,r[14]=i),this}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],h=e[9],f=e[10],p=e[11],v=e[12],y=e[13],m=e[14],d=e[15],g=h*m*c-y*f*c+y*l*p-o*m*p-h*l*d+o*f*d,x=v*f*c-u*m*c-v*l*p+a*m*p+u*l*d-a*f*d,_=u*y*c-v*h*c+v*o*p-a*y*p-u*o*d+a*h*d,R=v*h*l-u*y*l-v*o*f+a*y*f+u*o*m-a*h*m,T=n*g+i*x+r*_+s*R;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/T;return e[0]=g*A,e[1]=(y*f*s-h*m*s-y*r*p+i*m*p+h*r*d-i*f*d)*A,e[2]=(o*m*s-y*l*s+y*r*c-i*m*c-o*r*d+i*l*d)*A,e[3]=(h*l*s-o*f*s-h*r*c+i*f*c+o*r*p-i*l*p)*A,e[4]=x*A,e[5]=(u*m*s-v*f*s+v*r*p-n*m*p-u*r*d+n*f*d)*A,e[6]=(v*l*s-a*m*s-v*r*c+n*m*c+a*r*d-n*l*d)*A,e[7]=(a*f*s-u*l*s+u*r*c-n*f*c-a*r*p+n*l*p)*A,e[8]=_*A,e[9]=(v*h*s-u*y*s-v*i*p+n*y*p+u*i*d-n*h*d)*A,e[10]=(a*y*s-v*o*s+v*i*c-n*y*c-a*i*d+n*o*d)*A,e[11]=(u*o*s-a*h*s-u*i*c+n*h*c+a*i*p-n*o*p)*A,e[12]=R*A,e[13]=(u*y*r-v*h*r+v*i*f-n*y*f-u*i*m+n*h*m)*A,e[14]=(v*o*r-a*y*r-v*i*l+n*y*l+a*i*m-n*o*m)*A,e[15]=(a*h*r-u*o*r+u*i*l-n*h*l-a*i*f+n*o*f)*A,this}scale(e){const n=this.elements,i=e.x,r=e.y,s=e.z;return n[0]*=i,n[4]*=r,n[8]*=s,n[1]*=i,n[5]*=r,n[9]*=s,n[2]*=i,n[6]*=r,n[10]*=s,n[3]*=i,n[7]*=r,n[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,n=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(n,i,r))}makeTranslation(e,n,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,n,0,0,1,i,0,0,0,1),this}makeRotationX(e){const n=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,n,-i,0,0,i,n,0,0,0,0,1),this}makeRotationY(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,0,i,0,0,1,0,0,-i,0,n,0,0,0,0,1),this}makeRotationZ(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,0,i,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,n){const i=Math.cos(n),r=Math.sin(n),s=1-i,a=e.x,o=e.y,l=e.z,c=s*a,u=s*o;return this.set(c*a+i,c*o-r*l,c*l+r*o,0,c*o+r*l,u*o+i,u*l-r*a,0,c*l-r*o,u*l+r*a,s*l*l+i,0,0,0,0,1),this}makeScale(e,n,i){return this.set(e,0,0,0,0,n,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,n,i,r,s,a){return this.set(1,i,s,0,e,1,a,0,n,r,1,0,0,0,0,1),this}compose(e,n,i){const r=this.elements,s=n._x,a=n._y,o=n._z,l=n._w,c=s+s,u=a+a,h=o+o,f=s*c,p=s*u,v=s*h,y=a*u,m=a*h,d=o*h,g=l*c,x=l*u,_=l*h,R=i.x,T=i.y,A=i.z;return r[0]=(1-(y+d))*R,r[1]=(p+_)*R,r[2]=(v-x)*R,r[3]=0,r[4]=(p-_)*T,r[5]=(1-(f+d))*T,r[6]=(m+g)*T,r[7]=0,r[8]=(v+x)*A,r[9]=(m-g)*A,r[10]=(1-(f+y))*A,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,n,i){const r=this.elements;let s=os.set(r[0],r[1],r[2]).length();const a=os.set(r[4],r[5],r[6]).length(),o=os.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],jn.copy(this);const c=1/s,u=1/a,h=1/o;return jn.elements[0]*=c,jn.elements[1]*=c,jn.elements[2]*=c,jn.elements[4]*=u,jn.elements[5]*=u,jn.elements[6]*=u,jn.elements[8]*=h,jn.elements[9]*=h,jn.elements[10]*=h,n.setFromRotationMatrix(jn),i.x=s,i.y=a,i.z=o,this}makePerspective(e,n,i,r,s,a,o=Ei){const l=this.elements,c=2*s/(n-e),u=2*s/(i-r),h=(n+e)/(n-e),f=(i+r)/(i-r);let p,v;if(o===Ei)p=-(a+s)/(a-s),v=-2*a*s/(a-s);else if(o===tc)p=-a/(a-s),v=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=u,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=v,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,n,i,r,s,a,o=Ei){const l=this.elements,c=1/(n-e),u=1/(i-r),h=1/(a-s),f=(n+e)*c,p=(i+r)*u;let v,y;if(o===Ei)v=(a+s)*h,y=-2*h;else if(o===tc)v=s*h,y=-1*h;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-f,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=y,l[14]=-v,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<16;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<16;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e[n+9]=i[9],e[n+10]=i[10],e[n+11]=i[11],e[n+12]=i[12],e[n+13]=i[13],e[n+14]=i[14],e[n+15]=i[15],e}}const os=new P,jn=new st,oS=new P(0,0,0),lS=new P(1,1,1),Hi=new P,Ko=new P,Mn=new P,dm=new st,hm=new aa;class di{constructor(e=0,n=0,i=0,r=di.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=n,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,n,i,r=this._order){return this._x=e,this._y=n,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,n=this._order,i=!0){const r=e.elements,s=r[0],a=r[4],o=r[8],l=r[1],c=r[5],u=r[9],h=r[2],f=r[6],p=r[10];switch(n){case"XYZ":this._y=Math.asin(tn(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,p),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-tn(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,s),this._z=0);break;case"ZXY":this._x=Math.asin(tn(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-h,p),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-tn(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(f,p),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(tn(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,s)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-tn(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-u,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,n,i){return dm.makeRotationFromQuaternion(e),this.setFromRotationMatrix(dm,n,i)}setFromVector3(e,n=this._order){return this.set(e.x,e.y,e.z,n)}reorder(e){return hm.setFromEuler(this),this.setFromQuaternion(hm,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}di.DEFAULT_ORDER="XYZ";class wf{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let cS=0;const fm=new P,ls=new aa,gi=new st,Yo=new P,_a=new P,uS=new P,dS=new aa,pm=new P(1,0,0),mm=new P(0,1,0),gm=new P(0,0,1),vm={type:"added"},hS={type:"removed"},cs={type:"childadded",child:null},uu={type:"childremoved",child:null};class Xt extends ra{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:cS++}),this.uuid=sa(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Xt.DEFAULT_UP.clone();const e=new P,n=new di,i=new aa,r=new P(1,1,1);function s(){i.setFromEuler(n,!1)}function a(){n.setFromQuaternion(i,void 0,!1)}n._onChange(s),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new st},normalMatrix:{value:new ke}}),this.matrix=new st,this.matrixWorld=new st,this.matrixAutoUpdate=Xt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Xt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new wf,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,n){this.quaternion.setFromAxisAngle(e,n)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,n){return ls.setFromAxisAngle(e,n),this.quaternion.multiply(ls),this}rotateOnWorldAxis(e,n){return ls.setFromAxisAngle(e,n),this.quaternion.premultiply(ls),this}rotateX(e){return this.rotateOnAxis(pm,e)}rotateY(e){return this.rotateOnAxis(mm,e)}rotateZ(e){return this.rotateOnAxis(gm,e)}translateOnAxis(e,n){return fm.copy(e).applyQuaternion(this.quaternion),this.position.add(fm.multiplyScalar(n)),this}translateX(e){return this.translateOnAxis(pm,e)}translateY(e){return this.translateOnAxis(mm,e)}translateZ(e){return this.translateOnAxis(gm,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(gi.copy(this.matrixWorld).invert())}lookAt(e,n,i){e.isVector3?Yo.copy(e):Yo.set(e,n,i);const r=this.parent;this.updateWorldMatrix(!0,!1),_a.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?gi.lookAt(_a,Yo,this.up):gi.lookAt(Yo,_a,this.up),this.quaternion.setFromRotationMatrix(gi),r&&(gi.extractRotation(r.matrixWorld),ls.setFromRotationMatrix(gi),this.quaternion.premultiply(ls.invert()))}add(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(vm),cs.child=e,this.dispatchEvent(cs),cs.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const n=this.children.indexOf(e);return n!==-1&&(e.parent=null,this.children.splice(n,1),e.dispatchEvent(hS),uu.child=e,this.dispatchEvent(uu),uu.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),gi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),gi.multiply(e.parent.matrixWorld)),e.applyMatrix4(gi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(vm),cs.child=e,this.dispatchEvent(cs),cs.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,n){if(this[e]===n)return this;for(let i=0,r=this.children.length;i<r;i++){const a=this.children[i].getObjectByProperty(e,n);if(a!==void 0)return a}}getObjectsByProperty(e,n,i=[]){this[e]===n&&i.push(this);const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(e,n,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(_a,e,uS),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(_a,dS,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const n=this.matrixWorld.elements;return e.set(n[8],n[9],n[10]).normalize()}raycast(){}traverse(e){e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverseVisible(e)}traverseAncestors(e){const n=this.parent;n!==null&&(e(n),n.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].updateMatrixWorld(e)}updateWorldMatrix(e,n){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),n===!0){const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const n=e===void 0||typeof e=="string",i={};n&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const h=l[c];s(e.shapes,h)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(e.materials,this.material[l]));r.material=o}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];r.animations.push(s(e.animations,l))}}if(n){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),u=a(e.images),h=a(e.shapes),f=a(e.skeletons),p=a(e.animations),v=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),h.length>0&&(i.shapes=h),f.length>0&&(i.skeletons=f),p.length>0&&(i.animations=p),v.length>0&&(i.nodes=v)}return i.object=r,i;function a(o){const l=[];for(const c in o){const u=o[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,n=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),n===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}Xt.DEFAULT_UP=new P(0,1,0);Xt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Xt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Xn=new P,vi=new P,du=new P,xi=new P,us=new P,ds=new P,xm=new P,hu=new P,fu=new P,pu=new P,mu=new lt,gu=new lt,vu=new lt;class $n{constructor(e=new P,n=new P,i=new P){this.a=e,this.b=n,this.c=i}static getNormal(e,n,i,r){r.subVectors(i,n),Xn.subVectors(e,n),r.cross(Xn);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,n,i,r,s){Xn.subVectors(r,n),vi.subVectors(i,n),du.subVectors(e,n);const a=Xn.dot(Xn),o=Xn.dot(vi),l=Xn.dot(du),c=vi.dot(vi),u=vi.dot(du),h=a*c-o*o;if(h===0)return s.set(0,0,0),null;const f=1/h,p=(c*l-o*u)*f,v=(a*u-o*l)*f;return s.set(1-p-v,v,p)}static containsPoint(e,n,i,r){return this.getBarycoord(e,n,i,r,xi)===null?!1:xi.x>=0&&xi.y>=0&&xi.x+xi.y<=1}static getInterpolation(e,n,i,r,s,a,o,l){return this.getBarycoord(e,n,i,r,xi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,xi.x),l.addScaledVector(a,xi.y),l.addScaledVector(o,xi.z),l)}static getInterpolatedAttribute(e,n,i,r,s,a){return mu.setScalar(0),gu.setScalar(0),vu.setScalar(0),mu.fromBufferAttribute(e,n),gu.fromBufferAttribute(e,i),vu.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(mu,s.x),a.addScaledVector(gu,s.y),a.addScaledVector(vu,s.z),a}static isFrontFacing(e,n,i,r){return Xn.subVectors(i,n),vi.subVectors(e,n),Xn.cross(vi).dot(r)<0}set(e,n,i){return this.a.copy(e),this.b.copy(n),this.c.copy(i),this}setFromPointsAndIndices(e,n,i,r){return this.a.copy(e[n]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,n,i,r){return this.a.fromBufferAttribute(e,n),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Xn.subVectors(this.c,this.b),vi.subVectors(this.a,this.b),Xn.cross(vi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return $n.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,n){return $n.getBarycoord(e,this.a,this.b,this.c,n)}getInterpolation(e,n,i,r,s){return $n.getInterpolation(e,this.a,this.b,this.c,n,i,r,s)}containsPoint(e){return $n.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return $n.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,n){const i=this.a,r=this.b,s=this.c;let a,o;us.subVectors(r,i),ds.subVectors(s,i),hu.subVectors(e,i);const l=us.dot(hu),c=ds.dot(hu);if(l<=0&&c<=0)return n.copy(i);fu.subVectors(e,r);const u=us.dot(fu),h=ds.dot(fu);if(u>=0&&h<=u)return n.copy(r);const f=l*h-u*c;if(f<=0&&l>=0&&u<=0)return a=l/(l-u),n.copy(i).addScaledVector(us,a);pu.subVectors(e,s);const p=us.dot(pu),v=ds.dot(pu);if(v>=0&&p<=v)return n.copy(s);const y=p*c-l*v;if(y<=0&&c>=0&&v<=0)return o=c/(c-v),n.copy(i).addScaledVector(ds,o);const m=u*v-p*h;if(m<=0&&h-u>=0&&p-v>=0)return xm.subVectors(s,r),o=(h-u)/(h-u+(p-v)),n.copy(r).addScaledVector(xm,o);const d=1/(m+y+f);return a=y*d,o=f*d,n.copy(i).addScaledVector(us,a).addScaledVector(ds,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Xv={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Gi={h:0,s:0,l:0},qo={h:0,s:0,l:0};function xu(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+(e-t)*6*n:n<1/2?e:n<2/3?t+(e-t)*6*(2/3-n):t}class me{constructor(e,n,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,n,i)}set(e,n,i){if(n===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,n,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,n=Vt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,$e.toWorkingColorSpace(this,n),this}setRGB(e,n,i,r=$e.workingColorSpace){return this.r=e,this.g=n,this.b=i,$e.toWorkingColorSpace(this,r),this}setHSL(e,n,i,r=$e.workingColorSpace){if(e=Sf(e,1),n=tn(n,0,1),i=tn(i,0,1),n===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+n):i+n-i*n,a=2*i-s;this.r=xu(a,s,e+1/3),this.g=xu(a,s,e),this.b=xu(a,s,e-1/3)}return $e.toWorkingColorSpace(this,r),this}setStyle(e,n=Vt){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,n);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,n);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,n);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,n);if(a===6)return this.setHex(parseInt(s,16),n);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,n);return this}setColorName(e,n=Vt){const i=Xv[e.toLowerCase()];return i!==void 0?this.setHex(i,n):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=bi(e.r),this.g=bi(e.g),this.b=bi(e.b),this}copyLinearToSRGB(e){return this.r=Bs(e.r),this.g=Bs(e.g),this.b=Bs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Vt){return $e.fromWorkingColorSpace(Jt.copy(this),e),Math.round(tn(Jt.r*255,0,255))*65536+Math.round(tn(Jt.g*255,0,255))*256+Math.round(tn(Jt.b*255,0,255))}getHexString(e=Vt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,n=$e.workingColorSpace){$e.fromWorkingColorSpace(Jt.copy(this),n);const i=Jt.r,r=Jt.g,s=Jt.b,a=Math.max(i,r,s),o=Math.min(i,r,s);let l,c;const u=(o+a)/2;if(o===a)l=0,c=0;else{const h=a-o;switch(c=u<=.5?h/(a+o):h/(2-a-o),a){case i:l=(r-s)/h+(r<s?6:0);break;case r:l=(s-i)/h+2;break;case s:l=(i-r)/h+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,n=$e.workingColorSpace){return $e.fromWorkingColorSpace(Jt.copy(this),n),e.r=Jt.r,e.g=Jt.g,e.b=Jt.b,e}getStyle(e=Vt){$e.fromWorkingColorSpace(Jt.copy(this),e);const n=Jt.r,i=Jt.g,r=Jt.b;return e!==Vt?`color(${e} ${n.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,n,i){return this.getHSL(Gi),this.setHSL(Gi.h+e,Gi.s+n,Gi.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,n){return this.r=e.r+n.r,this.g=e.g+n.g,this.b=e.b+n.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,n){return this.r+=(e.r-this.r)*n,this.g+=(e.g-this.g)*n,this.b+=(e.b-this.b)*n,this}lerpColors(e,n,i){return this.r=e.r+(n.r-e.r)*i,this.g=e.g+(n.g-e.g)*i,this.b=e.b+(n.b-e.b)*i,this}lerpHSL(e,n){this.getHSL(Gi),e.getHSL(qo);const i=Wa(Gi.h,qo.h,n),r=Wa(Gi.s,qo.s,n),s=Wa(Gi.l,qo.l,n);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const n=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*n+s[3]*i+s[6]*r,this.g=s[1]*n+s[4]*i+s[7]*r,this.b=s[2]*n+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,n=0){return this.r=e[n],this.g=e[n+1],this.b=e[n+2],this}toArray(e=[],n=0){return e[n]=this.r,e[n+1]=this.g,e[n+2]=this.b,e}fromBufferAttribute(e,n){return this.r=e.getX(n),this.g=e.getY(n),this.b=e.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Jt=new me;me.NAMES=Xv;let fS=0;class Qr extends ra{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:fS++}),this.uuid=sa(),this.name="",this.blending=Ai,this.side=hr,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Rd,this.blendDst=Pd,this.blendEquation=Dr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new me(0,0,0),this.blendAlpha=0,this.depthFunc=Ks,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=em,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ns,this.stencilZFail=ns,this.stencilZPass=ns,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const n in e){const i=e[n];if(i===void 0){console.warn(`THREE.Material: parameter '${n}' has value of undefined.`);continue}const r=this[n];if(r===void 0){console.warn(`THREE.Material: '${n}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[n]=i}}toJSON(e){const n=e===void 0||typeof e=="string";n&&(e={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Ai&&(i.blending=this.blending),this.side!==hr&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Rd&&(i.blendSrc=this.blendSrc),this.blendDst!==Pd&&(i.blendDst=this.blendDst),this.blendEquation!==Dr&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Ks&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==em&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ns&&(i.stencilFail=this.stencilFail),this.stencilZFail!==ns&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==ns&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const a=[];for(const o in s){const l=s[o];delete l.metadata,a.push(l)}return a}if(n){const s=r(e.textures),a=r(e.images);s.length>0&&(i.textures=s),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const n=e.clippingPlanes;let i=null;if(n!==null){const r=n.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=n[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Ef extends Qr{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new me(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new di,this.combine=Rv,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Rt=new P,$o=new Ge;class Ye{constructor(e,n,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=n,this.count=e!==void 0?e.length/n:0,this.normalized=i,this.usage=tm,this.updateRanges=[],this.gpuType=li,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,n,i){e*=this.itemSize,i*=n.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=n.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let n=0,i=this.count;n<i;n++)$o.fromBufferAttribute(this,n),$o.applyMatrix3(e),this.setXY(n,$o.x,$o.y);else if(this.itemSize===3)for(let n=0,i=this.count;n<i;n++)Rt.fromBufferAttribute(this,n),Rt.applyMatrix3(e),this.setXYZ(n,Rt.x,Rt.y,Rt.z);return this}applyMatrix4(e){for(let n=0,i=this.count;n<i;n++)Rt.fromBufferAttribute(this,n),Rt.applyMatrix4(e),this.setXYZ(n,Rt.x,Rt.y,Rt.z);return this}applyNormalMatrix(e){for(let n=0,i=this.count;n<i;n++)Rt.fromBufferAttribute(this,n),Rt.applyNormalMatrix(e),this.setXYZ(n,Rt.x,Rt.y,Rt.z);return this}transformDirection(e){for(let n=0,i=this.count;n<i;n++)Rt.fromBufferAttribute(this,n),Rt.transformDirection(e),this.setXYZ(n,Rt.x,Rt.y,Rt.z);return this}set(e,n=0){return this.array.set(e,n),this}getComponent(e,n){let i=this.array[e*this.itemSize+n];return this.normalized&&(i=vs(i,this.array)),i}setComponent(e,n,i){return this.normalized&&(i=sn(i,this.array)),this.array[e*this.itemSize+n]=i,this}getX(e){let n=this.array[e*this.itemSize];return this.normalized&&(n=vs(n,this.array)),n}setX(e,n){return this.normalized&&(n=sn(n,this.array)),this.array[e*this.itemSize]=n,this}getY(e){let n=this.array[e*this.itemSize+1];return this.normalized&&(n=vs(n,this.array)),n}setY(e,n){return this.normalized&&(n=sn(n,this.array)),this.array[e*this.itemSize+1]=n,this}getZ(e){let n=this.array[e*this.itemSize+2];return this.normalized&&(n=vs(n,this.array)),n}setZ(e,n){return this.normalized&&(n=sn(n,this.array)),this.array[e*this.itemSize+2]=n,this}getW(e){let n=this.array[e*this.itemSize+3];return this.normalized&&(n=vs(n,this.array)),n}setW(e,n){return this.normalized&&(n=sn(n,this.array)),this.array[e*this.itemSize+3]=n,this}setXY(e,n,i){return e*=this.itemSize,this.normalized&&(n=sn(n,this.array),i=sn(i,this.array)),this.array[e+0]=n,this.array[e+1]=i,this}setXYZ(e,n,i,r){return e*=this.itemSize,this.normalized&&(n=sn(n,this.array),i=sn(i,this.array),r=sn(r,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,n,i,r,s){return e*=this.itemSize,this.normalized&&(n=sn(n,this.array),i=sn(i,this.array),r=sn(r,this.array),s=sn(s,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==tm&&(e.usage=this.usage),e}}class Kv extends Ye{constructor(e,n,i){super(new Uint16Array(e),n,i)}}class Yv extends Ye{constructor(e,n,i){super(new Uint32Array(e),n,i)}}class Lt extends Ye{constructor(e,n,i){super(new Float32Array(e),n,i)}}let pS=0;const Nn=new st,yu=new Xt,hs=new P,Sn=new Zr,Ma=new Zr,Ft=new P;class ct extends ra{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:pS++}),this.uuid=sa(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Vv(e)?Yv:Kv)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,n){return this.attributes[e]=n,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,n,i=0){this.groups.push({start:e,count:n,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,n){this.drawRange.start=e,this.drawRange.count=n}applyMatrix4(e){const n=this.attributes.position;n!==void 0&&(n.applyMatrix4(e),n.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new ke().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Nn.makeRotationFromQuaternion(e),this.applyMatrix4(Nn),this}rotateX(e){return Nn.makeRotationX(e),this.applyMatrix4(Nn),this}rotateY(e){return Nn.makeRotationY(e),this.applyMatrix4(Nn),this}rotateZ(e){return Nn.makeRotationZ(e),this.applyMatrix4(Nn),this}translate(e,n,i){return Nn.makeTranslation(e,n,i),this.applyMatrix4(Nn),this}scale(e,n,i){return Nn.makeScale(e,n,i),this.applyMatrix4(Nn),this}lookAt(e){return yu.lookAt(e),yu.updateMatrix(),this.applyMatrix4(yu.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(hs).negate(),this.translate(hs.x,hs.y,hs.z),this}setFromPoints(e){const n=this.getAttribute("position");if(n===void 0){const i=[];for(let r=0,s=e.length;r<s;r++){const a=e[r];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Lt(i,3))}else{for(let i=0,r=n.count;i<r;i++){const s=e[i];n.setXYZ(i,s.x,s.y,s.z||0)}e.length>n.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),n.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Zr);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),n)for(let i=0,r=n.length;i<r;i++){const s=n[i];Sn.setFromBufferAttribute(s),this.morphTargetsRelative?(Ft.addVectors(this.boundingBox.min,Sn.min),this.boundingBox.expandByPoint(Ft),Ft.addVectors(this.boundingBox.max,Sn.max),this.boundingBox.expandByPoint(Ft)):(this.boundingBox.expandByPoint(Sn.min),this.boundingBox.expandByPoint(Sn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Jr);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(e){const i=this.boundingSphere.center;if(Sn.setFromBufferAttribute(e),n)for(let s=0,a=n.length;s<a;s++){const o=n[s];Ma.setFromBufferAttribute(o),this.morphTargetsRelative?(Ft.addVectors(Sn.min,Ma.min),Sn.expandByPoint(Ft),Ft.addVectors(Sn.max,Ma.max),Sn.expandByPoint(Ft)):(Sn.expandByPoint(Ma.min),Sn.expandByPoint(Ma.max))}Sn.getCenter(i);let r=0;for(let s=0,a=e.count;s<a;s++)Ft.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(Ft));if(n)for(let s=0,a=n.length;s<a;s++){const o=n[s],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)Ft.fromBufferAttribute(o,c),l&&(hs.fromBufferAttribute(e,c),Ft.add(hs)),r=Math.max(r,i.distanceToSquared(Ft))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,n=this.attributes;if(e===null||n.position===void 0||n.normal===void 0||n.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=n.position,r=n.normal,s=n.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ye(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let b=0;b<i.count;b++)o[b]=new P,l[b]=new P;const c=new P,u=new P,h=new P,f=new Ge,p=new Ge,v=new Ge,y=new P,m=new P;function d(b,w,M){c.fromBufferAttribute(i,b),u.fromBufferAttribute(i,w),h.fromBufferAttribute(i,M),f.fromBufferAttribute(s,b),p.fromBufferAttribute(s,w),v.fromBufferAttribute(s,M),u.sub(c),h.sub(c),p.sub(f),v.sub(f);const D=1/(p.x*v.y-v.x*p.y);isFinite(D)&&(y.copy(u).multiplyScalar(v.y).addScaledVector(h,-p.y).multiplyScalar(D),m.copy(h).multiplyScalar(p.x).addScaledVector(u,-v.x).multiplyScalar(D),o[b].add(y),o[w].add(y),o[M].add(y),l[b].add(m),l[w].add(m),l[M].add(m))}let g=this.groups;g.length===0&&(g=[{start:0,count:e.count}]);for(let b=0,w=g.length;b<w;++b){const M=g[b],D=M.start,V=M.count;for(let z=D,X=D+V;z<X;z+=3)d(e.getX(z+0),e.getX(z+1),e.getX(z+2))}const x=new P,_=new P,R=new P,T=new P;function A(b){R.fromBufferAttribute(r,b),T.copy(R);const w=o[b];x.copy(w),x.sub(R.multiplyScalar(R.dot(w))).normalize(),_.crossVectors(T,w);const D=_.dot(l[b])<0?-1:1;a.setXYZW(b,x.x,x.y,x.z,D)}for(let b=0,w=g.length;b<w;++b){const M=g[b],D=M.start,V=M.count;for(let z=D,X=D+V;z<X;z+=3)A(e.getX(z+0)),A(e.getX(z+1)),A(e.getX(z+2))}}computeVertexNormals(){const e=this.index,n=this.getAttribute("position");if(n!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Ye(new Float32Array(n.count*3),3),this.setAttribute("normal",i);else for(let f=0,p=i.count;f<p;f++)i.setXYZ(f,0,0,0);const r=new P,s=new P,a=new P,o=new P,l=new P,c=new P,u=new P,h=new P;if(e)for(let f=0,p=e.count;f<p;f+=3){const v=e.getX(f+0),y=e.getX(f+1),m=e.getX(f+2);r.fromBufferAttribute(n,v),s.fromBufferAttribute(n,y),a.fromBufferAttribute(n,m),u.subVectors(a,s),h.subVectors(r,s),u.cross(h),o.fromBufferAttribute(i,v),l.fromBufferAttribute(i,y),c.fromBufferAttribute(i,m),o.add(u),l.add(u),c.add(u),i.setXYZ(v,o.x,o.y,o.z),i.setXYZ(y,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let f=0,p=n.count;f<p;f+=3)r.fromBufferAttribute(n,f+0),s.fromBufferAttribute(n,f+1),a.fromBufferAttribute(n,f+2),u.subVectors(a,s),h.subVectors(r,s),u.cross(h),i.setXYZ(f+0,u.x,u.y,u.z),i.setXYZ(f+1,u.x,u.y,u.z),i.setXYZ(f+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let n=0,i=e.count;n<i;n++)Ft.fromBufferAttribute(e,n),Ft.normalize(),e.setXYZ(n,Ft.x,Ft.y,Ft.z)}toNonIndexed(){function e(o,l){const c=o.array,u=o.itemSize,h=o.normalized,f=new c.constructor(l.length*u);let p=0,v=0;for(let y=0,m=l.length;y<m;y++){o.isInterleavedBufferAttribute?p=l[y]*o.data.stride+o.offset:p=l[y]*u;for(let d=0;d<u;d++)f[v++]=c[p++]}return new Ye(f,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const n=new ct,i=this.index.array,r=this.attributes;for(const o in r){const l=r[o],c=e(l,i);n.setAttribute(o,c)}const s=this.morphAttributes;for(const o in s){const l=[],c=s[o];for(let u=0,h=c.length;u<h;u++){const f=c[u],p=e(f,i);l.push(p)}n.morphAttributes[o]=l}n.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];n.addGroup(c.start,c.count,c.materialIndex)}return n}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const n=this.index;n!==null&&(e.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let h=0,f=c.length;h<f;h++){const p=c[h];u.push(p.toJSON(e.data))}u.length>0&&(r[l]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const n={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone(n));const r=e.attributes;for(const c in r){const u=r[c];this.setAttribute(c,u.clone(n))}const s=e.morphAttributes;for(const c in s){const u=[],h=s[c];for(let f=0,p=h.length;f<p;f++)u.push(h[f].clone(n));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,u=a.length;c<u;c++){const h=a[c];this.addGroup(h.start,h.count,h.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const ym=new st,Sr=new Tc,Zo=new Jr,_m=new P,Jo=new P,Qo=new P,el=new P,_u=new P,tl=new P,Mm=new P,nl=new P;class et extends Xt{constructor(e=new ct,n=new Ef){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,n){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,a=i.morphTargetsRelative;n.fromBufferAttribute(r,e);const o=this.morphTargetInfluences;if(s&&o){tl.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const u=o[l],h=s[l];u!==0&&(_u.fromBufferAttribute(h,e),a?tl.addScaledVector(_u,u):tl.addScaledVector(_u.sub(n),u))}n.add(tl)}return n}raycast(e,n){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Zo.copy(i.boundingSphere),Zo.applyMatrix4(s),Sr.copy(e.ray).recast(e.near),!(Zo.containsPoint(Sr.origin)===!1&&(Sr.intersectSphere(Zo,_m)===null||Sr.origin.distanceToSquared(_m)>(e.far-e.near)**2))&&(ym.copy(s).invert(),Sr.copy(e.ray).applyMatrix4(ym),!(i.boundingBox!==null&&Sr.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,n,Sr)))}_computeIntersections(e,n,i){let r;const s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,h=s.attributes.normal,f=s.groups,p=s.drawRange;if(o!==null)if(Array.isArray(a))for(let v=0,y=f.length;v<y;v++){const m=f[v],d=a[m.materialIndex],g=Math.max(m.start,p.start),x=Math.min(o.count,Math.min(m.start+m.count,p.start+p.count));for(let _=g,R=x;_<R;_+=3){const T=o.getX(_),A=o.getX(_+1),b=o.getX(_+2);r=il(this,d,e,i,c,u,h,T,A,b),r&&(r.faceIndex=Math.floor(_/3),r.face.materialIndex=m.materialIndex,n.push(r))}}else{const v=Math.max(0,p.start),y=Math.min(o.count,p.start+p.count);for(let m=v,d=y;m<d;m+=3){const g=o.getX(m),x=o.getX(m+1),_=o.getX(m+2);r=il(this,a,e,i,c,u,h,g,x,_),r&&(r.faceIndex=Math.floor(m/3),n.push(r))}}else if(l!==void 0)if(Array.isArray(a))for(let v=0,y=f.length;v<y;v++){const m=f[v],d=a[m.materialIndex],g=Math.max(m.start,p.start),x=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let _=g,R=x;_<R;_+=3){const T=_,A=_+1,b=_+2;r=il(this,d,e,i,c,u,h,T,A,b),r&&(r.faceIndex=Math.floor(_/3),r.face.materialIndex=m.materialIndex,n.push(r))}}else{const v=Math.max(0,p.start),y=Math.min(l.count,p.start+p.count);for(let m=v,d=y;m<d;m+=3){const g=m,x=m+1,_=m+2;r=il(this,a,e,i,c,u,h,g,x,_),r&&(r.faceIndex=Math.floor(m/3),n.push(r))}}}}function mS(t,e,n,i,r,s,a,o){let l;if(e.side===It?l=i.intersectTriangle(a,s,r,!0,o):l=i.intersectTriangle(r,s,a,e.side===hr,o),l===null)return null;nl.copy(o),nl.applyMatrix4(t.matrixWorld);const c=n.ray.origin.distanceTo(nl);return c<n.near||c>n.far?null:{distance:c,point:nl.clone(),object:t}}function il(t,e,n,i,r,s,a,o,l,c){t.getVertexPosition(o,Jo),t.getVertexPosition(l,Qo),t.getVertexPosition(c,el);const u=mS(t,e,n,i,Jo,Qo,el,Mm);if(u){const h=new P;$n.getBarycoord(Mm,Jo,Qo,el,h),r&&(u.uv=$n.getInterpolatedAttribute(r,o,l,c,h,new Ge)),s&&(u.uv1=$n.getInterpolatedAttribute(s,o,l,c,h,new Ge)),a&&(u.normal=$n.getInterpolatedAttribute(a,o,l,c,h,new P),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const f={a:o,b:l,c,normal:new P,materialIndex:0};$n.getNormal(Jo,Qo,el,f.normal),u.face=f,u.barycoord=h}return u}class Mo extends ct{constructor(e=1,n=1,i=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:n,depth:i,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const l=[],c=[],u=[],h=[];let f=0,p=0;v("z","y","x",-1,-1,i,n,e,a,s,0),v("z","y","x",1,-1,i,n,-e,a,s,1),v("x","z","y",1,1,e,i,n,r,a,2),v("x","z","y",1,-1,e,i,-n,r,a,3),v("x","y","z",1,-1,e,n,i,r,s,4),v("x","y","z",-1,-1,e,n,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new Lt(c,3)),this.setAttribute("normal",new Lt(u,3)),this.setAttribute("uv",new Lt(h,2));function v(y,m,d,g,x,_,R,T,A,b,w){const M=_/A,D=R/b,V=_/2,z=R/2,X=T/2,Z=A+1,Y=b+1;let te=0,I=0;const $=new P;for(let J=0;J<Y;J++){const ae=J*D-z;for(let ye=0;ye<Z;ye++){const Ve=ye*M-V;$[y]=Ve*g,$[m]=ae*x,$[d]=X,c.push($.x,$.y,$.z),$[y]=0,$[m]=0,$[d]=T>0?1:-1,u.push($.x,$.y,$.z),h.push(ye/A),h.push(1-J/b),te+=1}}for(let J=0;J<b;J++)for(let ae=0;ae<A;ae++){const ye=f+ae+Z*J,Ve=f+ae+Z*(J+1),K=f+(ae+1)+Z*(J+1),ne=f+(ae+1)+Z*J;l.push(ye,Ve,ne),l.push(Ve,K,ne),I+=6}o.addGroup(p,I,w),p+=I,f+=te}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Mo(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Js(t){const e={};for(const n in t){e[n]={};for(const i in t[n]){const r=t[n][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[n][i]=null):e[n][i]=r.clone():Array.isArray(r)?e[n][i]=r.slice():e[n][i]=r}}return e}function an(t){const e={};for(let n=0;n<t.length;n++){const i=Js(t[n]);for(const r in i)e[r]=i[r]}return e}function gS(t){const e=[];for(let n=0;n<t.length;n++)e.push(t[n].clone());return e}function qv(t){const e=t.getRenderTarget();return e===null?t.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:$e.workingColorSpace}const vS={clone:Js,merge:an};var xS=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,yS=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ut extends Qr{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=xS,this.fragmentShader=yS,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Js(e.uniforms),this.uniformsGroups=gS(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const n=super.toJSON(e);n.glslVersion=this.glslVersion,n.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?n.uniforms[r]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?n.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?n.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?n.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?n.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?n.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?n.uniforms[r]={type:"m4",value:a.toArray()}:n.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(n.extensions=i),n}}class $v extends Xt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new st,this.projectionMatrix=new st,this.projectionMatrixInverse=new st,this.coordinateSystem=Ei}copy(e,n){return super.copy(e,n),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,n){super.updateWorldMatrix(e,n),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Vi=new P,Sm=new Ge,wm=new Ge;class En extends $v{constructor(e=50,n=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const n=.5*this.getFilmHeight()/e;this.fov=ho*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Va*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ho*2*Math.atan(Math.tan(Va*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,n,i){Vi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Vi.x,Vi.y).multiplyScalar(-e/Vi.z),Vi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Vi.x,Vi.y).multiplyScalar(-e/Vi.z)}getViewSize(e,n){return this.getViewBounds(e,Sm,wm),n.subVectors(wm,Sm)}setViewOffset(e,n,i,r,s,a){this.aspect=e/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let n=e*Math.tan(Va*.5*this.fov)/this.zoom,i=2*n,r=this.aspect*i,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*r/l,n-=a.offsetY*i/c,r*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,n,n-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}}const fs=-90,ps=1;class _S extends Xt{constructor(e,n,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new En(fs,ps,e,n);r.layers=this.layers,this.add(r);const s=new En(fs,ps,e,n);s.layers=this.layers,this.add(s);const a=new En(fs,ps,e,n);a.layers=this.layers,this.add(a);const o=new En(fs,ps,e,n);o.layers=this.layers,this.add(o);const l=new En(fs,ps,e,n);l.layers=this.layers,this.add(l);const c=new En(fs,ps,e,n);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,n=this.children.concat(),[i,r,s,a,o,l]=n;for(const c of n)this.remove(c);if(e===Ei)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===tc)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of n)this.add(c),c.updateMatrixWorld()}update(e,n){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,l,c,u]=this.children,h=e.getRenderTarget(),f=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),v=e.xr.enabled;e.xr.enabled=!1;const y=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,r),e.render(n,s),e.setRenderTarget(i,1,r),e.render(n,a),e.setRenderTarget(i,2,r),e.render(n,o),e.setRenderTarget(i,3,r),e.render(n,l),e.setRenderTarget(i,4,r),e.render(n,c),i.texture.generateMipmaps=y,e.setRenderTarget(i,5,r),e.render(n,u),e.setRenderTarget(h,f,p),e.xr.enabled=v,i.texture.needsPMREMUpdate=!0}}class Zv extends Ht{constructor(e,n,i,r,s,a,o,l,c,u){e=e!==void 0?e:[],n=n!==void 0?n:Ys,super(e,n,i,r,s,a,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class MS extends Yr{constructor(e=1,n={}){super(e,e,n),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new Zv(r,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=n.generateMipmaps!==void 0?n.generateMipmaps:!1,this.texture.minFilter=n.minFilter!==void 0?n.minFilter:gn}fromEquirectangularTexture(e,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new Mo(5,5,5),s=new ut({name:"CubemapFromEquirect",uniforms:Js(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:It,blending:or});s.uniforms.tEquirect.value=n;const a=new et(r,s),o=n.minFilter;return n.minFilter===Zn&&(n.minFilter=gn),new _S(1,10,this).update(e,a),n.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,n,i,r){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(n,i,r);e.setRenderTarget(s)}}const Mu=new P,SS=new P,wS=new ke;class Rr{constructor(e=new P(1,0,0),n=0){this.isPlane=!0,this.normal=e,this.constant=n}set(e,n){return this.normal.copy(e),this.constant=n,this}setComponents(e,n,i,r){return this.normal.set(e,n,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,n){return this.normal.copy(e),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(e,n,i){const r=Mu.subVectors(i,n).cross(SS.subVectors(e,n)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,n){return n.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,n){const i=e.delta(Mu),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?n.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:n.copy(e.start).addScaledVector(i,s)}intersectsLine(e){const n=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return n<0&&i>0||i<0&&n>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,n){const i=n||wS.getNormalMatrix(e),r=this.coplanarPoint(Mu).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const wr=new Jr,rl=new P;class Tf{constructor(e=new Rr,n=new Rr,i=new Rr,r=new Rr,s=new Rr,a=new Rr){this.planes=[e,n,i,r,s,a]}set(e,n,i,r,s,a){const o=this.planes;return o[0].copy(e),o[1].copy(n),o[2].copy(i),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(e){const n=this.planes;for(let i=0;i<6;i++)n[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,n=Ei){const i=this.planes,r=e.elements,s=r[0],a=r[1],o=r[2],l=r[3],c=r[4],u=r[5],h=r[6],f=r[7],p=r[8],v=r[9],y=r[10],m=r[11],d=r[12],g=r[13],x=r[14],_=r[15];if(i[0].setComponents(l-s,f-c,m-p,_-d).normalize(),i[1].setComponents(l+s,f+c,m+p,_+d).normalize(),i[2].setComponents(l+a,f+u,m+v,_+g).normalize(),i[3].setComponents(l-a,f-u,m-v,_-g).normalize(),i[4].setComponents(l-o,f-h,m-y,_-x).normalize(),n===Ei)i[5].setComponents(l+o,f+h,m+y,_+x).normalize();else if(n===tc)i[5].setComponents(o,h,y,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),wr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const n=e.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),wr.copy(n.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(wr)}intersectsSprite(e){return wr.center.set(0,0,0),wr.radius=.7071067811865476,wr.applyMatrix4(e.matrixWorld),this.intersectsSphere(wr)}intersectsSphere(e){const n=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(n[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const n=this.planes;for(let i=0;i<6;i++){const r=n[i];if(rl.x=r.normal.x>0?e.max.x:e.min.x,rl.y=r.normal.y>0?e.max.y:e.min.y,rl.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(rl)<0)return!1}return!0}containsPoint(e){const n=this.planes;for(let i=0;i<6;i++)if(n[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Jv(){let t=null,e=!1,n=null,i=null;function r(s,a){n(s,a),i=t.requestAnimationFrame(r)}return{start:function(){e!==!0&&n!==null&&(i=t.requestAnimationFrame(r),e=!0)},stop:function(){t.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){n=s},setContext:function(s){t=s}}}function ES(t){const e=new WeakMap;function n(o,l){const c=o.array,u=o.usage,h=c.byteLength,f=t.createBuffer();t.bindBuffer(l,f),t.bufferData(l,c,u),o.onUploadCallback();let p;if(c instanceof Float32Array)p=t.FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?p=t.HALF_FLOAT:p=t.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=t.SHORT;else if(c instanceof Uint32Array)p=t.UNSIGNED_INT;else if(c instanceof Int32Array)p=t.INT;else if(c instanceof Int8Array)p=t.BYTE;else if(c instanceof Uint8Array)p=t.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=t.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:h}}function i(o,l,c){const u=l.array,h=l.updateRanges;if(t.bindBuffer(c,o),h.length===0)t.bufferSubData(c,0,u);else{h.sort((p,v)=>p.start-v.start);let f=0;for(let p=1;p<h.length;p++){const v=h[f],y=h[p];y.start<=v.start+v.count+1?v.count=Math.max(v.count,y.start+y.count-v.start):(++f,h[f]=y)}h.length=f+1;for(let p=0,v=h.length;p<v;p++){const y=h[p];t.bufferSubData(c,y.start*u.BYTES_PER_ELEMENT,u,y.start,y.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(t.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,n(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:r,remove:s,update:a}}class fr extends ct{constructor(e=1,n=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:n,widthSegments:i,heightSegments:r};const s=e/2,a=n/2,o=Math.floor(i),l=Math.floor(r),c=o+1,u=l+1,h=e/o,f=n/l,p=[],v=[],y=[],m=[];for(let d=0;d<u;d++){const g=d*f-a;for(let x=0;x<c;x++){const _=x*h-s;v.push(_,-g,0),y.push(0,0,1),m.push(x/o),m.push(1-d/l)}}for(let d=0;d<l;d++)for(let g=0;g<o;g++){const x=g+c*d,_=g+c*(d+1),R=g+1+c*(d+1),T=g+1+c*d;p.push(x,_,T),p.push(_,R,T)}this.setIndex(p),this.setAttribute("position",new Lt(v,3)),this.setAttribute("normal",new Lt(y,3)),this.setAttribute("uv",new Lt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new fr(e.width,e.height,e.widthSegments,e.heightSegments)}}var TS=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,AS=`#ifdef USE_ALPHAHASH
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
#endif`,bS=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,CS=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,RS=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,PS=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,DS=`#ifdef USE_AOMAP
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
#endif`,NS=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,IS=`#ifdef USE_BATCHING
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
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,LS=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,US=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,OS=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,FS=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,kS=`#ifdef USE_IRIDESCENCE
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
#endif`,BS=`#ifdef USE_BUMPMAP
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
#endif`,zS=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,HS=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,GS=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,VS=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,WS=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,jS=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,XS=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,KS=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,YS=`#define PI 3.141592653589793
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
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
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
} // validated`,qS=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,$S=`vec3 transformedNormal = objectNormal;
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
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,ZS=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,JS=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,QS=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,e1=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,t1="gl_FragColor = linearToOutputTexel( gl_FragColor );",n1=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,i1=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,r1=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,s1=`#ifdef USE_ENVMAP
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
#endif`,a1=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,o1=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,l1=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,c1=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,u1=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,d1=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,h1=`#ifdef USE_GRADIENTMAP
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
}`,f1=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,p1=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,m1=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,g1=`uniform bool receiveShadow;
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
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
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
#endif`,v1=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
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
	#endif
#endif`,x1=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,y1=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,_1=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,M1=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,S1=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
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
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
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
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
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
#endif`,w1=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
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
		vec3 iridescenceF0;
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
		float v = 0.5 / ( gv + gl );
		return saturate(v);
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
	vec3 f0 = material.specularColor;
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
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
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
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
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
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
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
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,E1=`
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
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
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
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
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
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,T1=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,A1=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,b1=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,C1=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,R1=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,P1=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,D1=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,N1=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,I1=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,L1=`#if defined( USE_POINTS_UV )
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
#endif`,U1=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,O1=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,F1=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,k1=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,B1=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,z1=`#ifdef USE_MORPHTARGETS
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
#endif`,H1=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,G1=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
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
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,V1=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,W1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,j1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,X1=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,K1=`#ifdef USE_NORMALMAP
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
#endif`,Y1=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,q1=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,$1=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Z1=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,J1=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Q1=`vec3 packNormalToRGB( const in vec3 normal ) {
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
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,ew=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,tw=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,nw=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,iw=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,rw=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,sw=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,aw=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
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
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
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
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
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
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,ow=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
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
#endif`,lw=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
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
#endif`,cw=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
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
	#if NUM_POINT_LIGHT_SHADOWS > 0
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
}`,uw=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,dw=`#ifdef USE_SKINNING
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
#endif`,hw=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,fw=`#ifdef USE_SKINNING
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
#endif`,pw=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,mw=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,gw=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,vw=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,xw=`#ifdef USE_TRANSMISSION
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
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,yw=`#ifdef USE_TRANSMISSION
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
#endif`,_w=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Mw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Sw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ww=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Ew=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Tw=`uniform sampler2D t2D;
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
}`,Aw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,bw=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Cw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Rw=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Pw=`#include <common>
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
}`,Dw=`#if DEPTH_PACKING == 3200
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
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Nw=`#define DISTANCE
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
}`,Iw=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Lw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Uw=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ow=`uniform float scale;
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
}`,Fw=`uniform vec3 diffuse;
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
}`,kw=`#include <common>
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
}`,Bw=`uniform vec3 diffuse;
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
}`,zw=`#define LAMBERT
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
}`,Hw=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
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
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
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
}`,Gw=`#define MATCAP
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
}`,Vw=`#define MATCAP
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
}`,Ww=`#define NORMAL
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
}`,jw=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
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
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Xw=`#define PHONG
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
}`,Kw=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
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
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
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
}`,Yw=`#define STANDARD
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
}`,qw=`#define STANDARD
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
#include <packing>
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
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
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
}`,$w=`#define TOON
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
}`,Zw=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
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
}`,Jw=`uniform float size;
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
}`,Qw=`uniform vec3 diffuse;
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
}`,eE=`#include <common>
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
}`,tE=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
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
}`,nE=`uniform float rotation;
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
}`,iE=`uniform vec3 diffuse;
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
}`,He={alphahash_fragment:TS,alphahash_pars_fragment:AS,alphamap_fragment:bS,alphamap_pars_fragment:CS,alphatest_fragment:RS,alphatest_pars_fragment:PS,aomap_fragment:DS,aomap_pars_fragment:NS,batching_pars_vertex:IS,batching_vertex:LS,begin_vertex:US,beginnormal_vertex:OS,bsdfs:FS,iridescence_fragment:kS,bumpmap_pars_fragment:BS,clipping_planes_fragment:zS,clipping_planes_pars_fragment:HS,clipping_planes_pars_vertex:GS,clipping_planes_vertex:VS,color_fragment:WS,color_pars_fragment:jS,color_pars_vertex:XS,color_vertex:KS,common:YS,cube_uv_reflection_fragment:qS,defaultnormal_vertex:$S,displacementmap_pars_vertex:ZS,displacementmap_vertex:JS,emissivemap_fragment:QS,emissivemap_pars_fragment:e1,colorspace_fragment:t1,colorspace_pars_fragment:n1,envmap_fragment:i1,envmap_common_pars_fragment:r1,envmap_pars_fragment:s1,envmap_pars_vertex:a1,envmap_physical_pars_fragment:v1,envmap_vertex:o1,fog_vertex:l1,fog_pars_vertex:c1,fog_fragment:u1,fog_pars_fragment:d1,gradientmap_pars_fragment:h1,lightmap_pars_fragment:f1,lights_lambert_fragment:p1,lights_lambert_pars_fragment:m1,lights_pars_begin:g1,lights_toon_fragment:x1,lights_toon_pars_fragment:y1,lights_phong_fragment:_1,lights_phong_pars_fragment:M1,lights_physical_fragment:S1,lights_physical_pars_fragment:w1,lights_fragment_begin:E1,lights_fragment_maps:T1,lights_fragment_end:A1,logdepthbuf_fragment:b1,logdepthbuf_pars_fragment:C1,logdepthbuf_pars_vertex:R1,logdepthbuf_vertex:P1,map_fragment:D1,map_pars_fragment:N1,map_particle_fragment:I1,map_particle_pars_fragment:L1,metalnessmap_fragment:U1,metalnessmap_pars_fragment:O1,morphinstance_vertex:F1,morphcolor_vertex:k1,morphnormal_vertex:B1,morphtarget_pars_vertex:z1,morphtarget_vertex:H1,normal_fragment_begin:G1,normal_fragment_maps:V1,normal_pars_fragment:W1,normal_pars_vertex:j1,normal_vertex:X1,normalmap_pars_fragment:K1,clearcoat_normal_fragment_begin:Y1,clearcoat_normal_fragment_maps:q1,clearcoat_pars_fragment:$1,iridescence_pars_fragment:Z1,opaque_fragment:J1,packing:Q1,premultiplied_alpha_fragment:ew,project_vertex:tw,dithering_fragment:nw,dithering_pars_fragment:iw,roughnessmap_fragment:rw,roughnessmap_pars_fragment:sw,shadowmap_pars_fragment:aw,shadowmap_pars_vertex:ow,shadowmap_vertex:lw,shadowmask_pars_fragment:cw,skinbase_vertex:uw,skinning_pars_vertex:dw,skinning_vertex:hw,skinnormal_vertex:fw,specularmap_fragment:pw,specularmap_pars_fragment:mw,tonemapping_fragment:gw,tonemapping_pars_fragment:vw,transmission_fragment:xw,transmission_pars_fragment:yw,uv_pars_fragment:_w,uv_pars_vertex:Mw,uv_vertex:Sw,worldpos_vertex:ww,background_vert:Ew,background_frag:Tw,backgroundCube_vert:Aw,backgroundCube_frag:bw,cube_vert:Cw,cube_frag:Rw,depth_vert:Pw,depth_frag:Dw,distanceRGBA_vert:Nw,distanceRGBA_frag:Iw,equirect_vert:Lw,equirect_frag:Uw,linedashed_vert:Ow,linedashed_frag:Fw,meshbasic_vert:kw,meshbasic_frag:Bw,meshlambert_vert:zw,meshlambert_frag:Hw,meshmatcap_vert:Gw,meshmatcap_frag:Vw,meshnormal_vert:Ww,meshnormal_frag:jw,meshphong_vert:Xw,meshphong_frag:Kw,meshphysical_vert:Yw,meshphysical_frag:qw,meshtoon_vert:$w,meshtoon_frag:Zw,points_vert:Jw,points_frag:Qw,shadow_vert:eE,shadow_frag:tE,sprite_vert:nE,sprite_frag:iE},le={common:{diffuse:{value:new me(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ke},alphaMap:{value:null},alphaMapTransform:{value:new ke},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ke}},envmap:{envMap:{value:null},envMapRotation:{value:new ke},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ke}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ke}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ke},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ke},normalScale:{value:new Ge(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ke},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ke}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ke}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ke}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new me(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new me(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ke},alphaTest:{value:0},uvTransform:{value:new ke}},sprite:{diffuse:{value:new me(16777215)},opacity:{value:1},center:{value:new Ge(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ke},alphaMap:{value:null},alphaMapTransform:{value:new ke},alphaTest:{value:0}}},ai={basic:{uniforms:an([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.fog]),vertexShader:He.meshbasic_vert,fragmentShader:He.meshbasic_frag},lambert:{uniforms:an([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.fog,le.lights,{emissive:{value:new me(0)}}]),vertexShader:He.meshlambert_vert,fragmentShader:He.meshlambert_frag},phong:{uniforms:an([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.fog,le.lights,{emissive:{value:new me(0)},specular:{value:new me(1118481)},shininess:{value:30}}]),vertexShader:He.meshphong_vert,fragmentShader:He.meshphong_frag},standard:{uniforms:an([le.common,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.roughnessmap,le.metalnessmap,le.fog,le.lights,{emissive:{value:new me(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:He.meshphysical_vert,fragmentShader:He.meshphysical_frag},toon:{uniforms:an([le.common,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.gradientmap,le.fog,le.lights,{emissive:{value:new me(0)}}]),vertexShader:He.meshtoon_vert,fragmentShader:He.meshtoon_frag},matcap:{uniforms:an([le.common,le.bumpmap,le.normalmap,le.displacementmap,le.fog,{matcap:{value:null}}]),vertexShader:He.meshmatcap_vert,fragmentShader:He.meshmatcap_frag},points:{uniforms:an([le.points,le.fog]),vertexShader:He.points_vert,fragmentShader:He.points_frag},dashed:{uniforms:an([le.common,le.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:He.linedashed_vert,fragmentShader:He.linedashed_frag},depth:{uniforms:an([le.common,le.displacementmap]),vertexShader:He.depth_vert,fragmentShader:He.depth_frag},normal:{uniforms:an([le.common,le.bumpmap,le.normalmap,le.displacementmap,{opacity:{value:1}}]),vertexShader:He.meshnormal_vert,fragmentShader:He.meshnormal_frag},sprite:{uniforms:an([le.sprite,le.fog]),vertexShader:He.sprite_vert,fragmentShader:He.sprite_frag},background:{uniforms:{uvTransform:{value:new ke},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:He.background_vert,fragmentShader:He.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ke}},vertexShader:He.backgroundCube_vert,fragmentShader:He.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:He.cube_vert,fragmentShader:He.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:He.equirect_vert,fragmentShader:He.equirect_frag},distanceRGBA:{uniforms:an([le.common,le.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:He.distanceRGBA_vert,fragmentShader:He.distanceRGBA_frag},shadow:{uniforms:an([le.lights,le.fog,{color:{value:new me(0)},opacity:{value:1}}]),vertexShader:He.shadow_vert,fragmentShader:He.shadow_frag}};ai.physical={uniforms:an([ai.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ke},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ke},clearcoatNormalScale:{value:new Ge(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ke},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ke},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ke},sheen:{value:0},sheenColor:{value:new me(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ke},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ke},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ke},transmissionSamplerSize:{value:new Ge},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ke},attenuationDistance:{value:0},attenuationColor:{value:new me(0)},specularColor:{value:new me(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ke},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ke},anisotropyVector:{value:new Ge},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ke}}]),vertexShader:He.meshphysical_vert,fragmentShader:He.meshphysical_frag};const sl={r:0,b:0,g:0},Er=new di,rE=new st;function sE(t,e,n,i,r,s,a){const o=new me(0);let l=s===!0?0:1,c,u,h=null,f=0,p=null;function v(g){let x=g.isScene===!0?g.background:null;return x&&x.isTexture&&(x=(g.backgroundBlurriness>0?n:e).get(x)),x}function y(g){let x=!1;const _=v(g);_===null?d(o,l):_&&_.isColor&&(d(_,1),x=!0);const R=t.xr.getEnvironmentBlendMode();R==="additive"?i.buffers.color.setClear(0,0,0,1,a):R==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(t.autoClear||x)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil))}function m(g,x){const _=v(x);_&&(_.isCubeTexture||_.mapping===wc)?(u===void 0&&(u=new et(new Mo(1,1,1),new ut({name:"BackgroundCubeMaterial",uniforms:Js(ai.backgroundCube.uniforms),vertexShader:ai.backgroundCube.vertexShader,fragmentShader:ai.backgroundCube.fragmentShader,side:It,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(R,T,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),Er.copy(x.backgroundRotation),Er.x*=-1,Er.y*=-1,Er.z*=-1,_.isCubeTexture&&_.isRenderTargetTexture===!1&&(Er.y*=-1,Er.z*=-1),u.material.uniforms.envMap.value=_,u.material.uniforms.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(rE.makeRotationFromEuler(Er)),u.material.toneMapped=$e.getTransfer(_.colorSpace)!==ot,(h!==_||f!==_.version||p!==t.toneMapping)&&(u.material.needsUpdate=!0,h=_,f=_.version,p=t.toneMapping),u.layers.enableAll(),g.unshift(u,u.geometry,u.material,0,0,null)):_&&_.isTexture&&(c===void 0&&(c=new et(new fr(2,2),new ut({name:"BackgroundMaterial",uniforms:Js(ai.background.uniforms),vertexShader:ai.background.vertexShader,fragmentShader:ai.background.fragmentShader,side:hr,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=_,c.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,c.material.toneMapped=$e.getTransfer(_.colorSpace)!==ot,_.matrixAutoUpdate===!0&&_.updateMatrix(),c.material.uniforms.uvTransform.value.copy(_.matrix),(h!==_||f!==_.version||p!==t.toneMapping)&&(c.material.needsUpdate=!0,h=_,f=_.version,p=t.toneMapping),c.layers.enableAll(),g.unshift(c,c.geometry,c.material,0,0,null))}function d(g,x){g.getRGB(sl,qv(t)),i.buffers.color.setClear(sl.r,sl.g,sl.b,x,a)}return{getClearColor:function(){return o},setClearColor:function(g,x=1){o.set(g),l=x,d(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(g){l=g,d(o,l)},render:y,addToRenderList:m}}function aE(t,e){const n=t.getParameter(t.MAX_VERTEX_ATTRIBS),i={},r=f(null);let s=r,a=!1;function o(M,D,V,z,X){let Z=!1;const Y=h(z,V,D);s!==Y&&(s=Y,c(s.object)),Z=p(M,z,V,X),Z&&v(M,z,V,X),X!==null&&e.update(X,t.ELEMENT_ARRAY_BUFFER),(Z||a)&&(a=!1,_(M,D,V,z),X!==null&&t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,e.get(X).buffer))}function l(){return t.createVertexArray()}function c(M){return t.bindVertexArray(M)}function u(M){return t.deleteVertexArray(M)}function h(M,D,V){const z=V.wireframe===!0;let X=i[M.id];X===void 0&&(X={},i[M.id]=X);let Z=X[D.id];Z===void 0&&(Z={},X[D.id]=Z);let Y=Z[z];return Y===void 0&&(Y=f(l()),Z[z]=Y),Y}function f(M){const D=[],V=[],z=[];for(let X=0;X<n;X++)D[X]=0,V[X]=0,z[X]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:V,attributeDivisors:z,object:M,attributes:{},index:null}}function p(M,D,V,z){const X=s.attributes,Z=D.attributes;let Y=0;const te=V.getAttributes();for(const I in te)if(te[I].location>=0){const J=X[I];let ae=Z[I];if(ae===void 0&&(I==="instanceMatrix"&&M.instanceMatrix&&(ae=M.instanceMatrix),I==="instanceColor"&&M.instanceColor&&(ae=M.instanceColor)),J===void 0||J.attribute!==ae||ae&&J.data!==ae.data)return!0;Y++}return s.attributesNum!==Y||s.index!==z}function v(M,D,V,z){const X={},Z=D.attributes;let Y=0;const te=V.getAttributes();for(const I in te)if(te[I].location>=0){let J=Z[I];J===void 0&&(I==="instanceMatrix"&&M.instanceMatrix&&(J=M.instanceMatrix),I==="instanceColor"&&M.instanceColor&&(J=M.instanceColor));const ae={};ae.attribute=J,J&&J.data&&(ae.data=J.data),X[I]=ae,Y++}s.attributes=X,s.attributesNum=Y,s.index=z}function y(){const M=s.newAttributes;for(let D=0,V=M.length;D<V;D++)M[D]=0}function m(M){d(M,0)}function d(M,D){const V=s.newAttributes,z=s.enabledAttributes,X=s.attributeDivisors;V[M]=1,z[M]===0&&(t.enableVertexAttribArray(M),z[M]=1),X[M]!==D&&(t.vertexAttribDivisor(M,D),X[M]=D)}function g(){const M=s.newAttributes,D=s.enabledAttributes;for(let V=0,z=D.length;V<z;V++)D[V]!==M[V]&&(t.disableVertexAttribArray(V),D[V]=0)}function x(M,D,V,z,X,Z,Y){Y===!0?t.vertexAttribIPointer(M,D,V,X,Z):t.vertexAttribPointer(M,D,V,z,X,Z)}function _(M,D,V,z){y();const X=z.attributes,Z=V.getAttributes(),Y=D.defaultAttributeValues;for(const te in Z){const I=Z[te];if(I.location>=0){let $=X[te];if($===void 0&&(te==="instanceMatrix"&&M.instanceMatrix&&($=M.instanceMatrix),te==="instanceColor"&&M.instanceColor&&($=M.instanceColor)),$!==void 0){const J=$.normalized,ae=$.itemSize,ye=e.get($);if(ye===void 0)continue;const Ve=ye.buffer,K=ye.type,ne=ye.bytesPerElement,ce=K===t.INT||K===t.UNSIGNED_INT||$.gpuType===mf;if($.isInterleavedBufferAttribute){const oe=$.data,Ce=oe.stride,Ie=$.offset;if(oe.isInstancedInterleavedBuffer){for(let Ue=0;Ue<I.locationSize;Ue++)d(I.location+Ue,oe.meshPerAttribute);M.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=oe.meshPerAttribute*oe.count)}else for(let Ue=0;Ue<I.locationSize;Ue++)m(I.location+Ue);t.bindBuffer(t.ARRAY_BUFFER,Ve);for(let Ue=0;Ue<I.locationSize;Ue++)x(I.location+Ue,ae/I.locationSize,K,J,Ce*ne,(Ie+ae/I.locationSize*Ue)*ne,ce)}else{if($.isInstancedBufferAttribute){for(let oe=0;oe<I.locationSize;oe++)d(I.location+oe,$.meshPerAttribute);M.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=$.meshPerAttribute*$.count)}else for(let oe=0;oe<I.locationSize;oe++)m(I.location+oe);t.bindBuffer(t.ARRAY_BUFFER,Ve);for(let oe=0;oe<I.locationSize;oe++)x(I.location+oe,ae/I.locationSize,K,J,ae*ne,ae/I.locationSize*oe*ne,ce)}}else if(Y!==void 0){const J=Y[te];if(J!==void 0)switch(J.length){case 2:t.vertexAttrib2fv(I.location,J);break;case 3:t.vertexAttrib3fv(I.location,J);break;case 4:t.vertexAttrib4fv(I.location,J);break;default:t.vertexAttrib1fv(I.location,J)}}}}g()}function R(){b();for(const M in i){const D=i[M];for(const V in D){const z=D[V];for(const X in z)u(z[X].object),delete z[X];delete D[V]}delete i[M]}}function T(M){if(i[M.id]===void 0)return;const D=i[M.id];for(const V in D){const z=D[V];for(const X in z)u(z[X].object),delete z[X];delete D[V]}delete i[M.id]}function A(M){for(const D in i){const V=i[D];if(V[M.id]===void 0)continue;const z=V[M.id];for(const X in z)u(z[X].object),delete z[X];delete V[M.id]}}function b(){w(),a=!0,s!==r&&(s=r,c(s.object))}function w(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:b,resetDefaultState:w,dispose:R,releaseStatesOfGeometry:T,releaseStatesOfProgram:A,initAttributes:y,enableAttribute:m,disableUnusedAttributes:g}}function oE(t,e,n){let i;function r(c){i=c}function s(c,u){t.drawArrays(i,c,u),n.update(u,i,1)}function a(c,u,h){h!==0&&(t.drawArraysInstanced(i,c,u,h),n.update(u,i,h))}function o(c,u,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,u,0,h);let p=0;for(let v=0;v<h;v++)p+=u[v];n.update(p,i,1)}function l(c,u,h,f){if(h===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let v=0;v<c.length;v++)a(c[v],u[v],f[v]);else{p.multiDrawArraysInstancedWEBGL(i,c,0,u,0,f,0,h);let v=0;for(let y=0;y<h;y++)v+=u[y]*f[y];n.update(v,i,1)}}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function lE(t,e,n,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const A=e.get("EXT_texture_filter_anisotropic");r=t.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(A){return!(A!==Jn&&i.convert(A)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){const b=A===_o&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==Ni&&i.convert(A)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==li&&!b)}function l(A){if(A==="highp"){if(t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.HIGH_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.MEDIUM_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=n.precision!==void 0?n.precision:"highp";const u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const h=n.logarithmicDepthBuffer===!0,f=n.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),p=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),v=t.getParameter(t.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=t.getParameter(t.MAX_TEXTURE_SIZE),m=t.getParameter(t.MAX_CUBE_MAP_TEXTURE_SIZE),d=t.getParameter(t.MAX_VERTEX_ATTRIBS),g=t.getParameter(t.MAX_VERTEX_UNIFORM_VECTORS),x=t.getParameter(t.MAX_VARYING_VECTORS),_=t.getParameter(t.MAX_FRAGMENT_UNIFORM_VECTORS),R=v>0,T=t.getParameter(t.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:h,reverseDepthBuffer:f,maxTextures:p,maxVertexTextures:v,maxTextureSize:y,maxCubemapSize:m,maxAttributes:d,maxVertexUniforms:g,maxVaryings:x,maxFragmentUniforms:_,vertexTextures:R,maxSamples:T}}function cE(t){const e=this;let n=null,i=0,r=!1,s=!1;const a=new Rr,o=new ke,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,f){const p=h.length!==0||f||i!==0||r;return r=f,i=h.length,p},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,f){n=u(h,f,0)},this.setState=function(h,f,p){const v=h.clippingPlanes,y=h.clipIntersection,m=h.clipShadows,d=t.get(h);if(!r||v===null||v.length===0||s&&!m)s?u(null):c();else{const g=s?0:i,x=g*4;let _=d.clippingState||null;l.value=_,_=u(v,f,x,p);for(let R=0;R!==x;++R)_[R]=n[R];d.clippingState=_,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=g}};function c(){l.value!==n&&(l.value=n,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(h,f,p,v){const y=h!==null?h.length:0;let m=null;if(y!==0){if(m=l.value,v!==!0||m===null){const d=p+y*4,g=f.matrixWorldInverse;o.getNormalMatrix(g),(m===null||m.length<d)&&(m=new Float32Array(d));for(let x=0,_=p;x!==y;++x,_+=4)a.copy(h[x]).applyMatrix4(g,o),a.normal.toArray(m,_),m[_+3]=a.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=y,e.numIntersection=0,m}}function uE(t){let e=new WeakMap;function n(a,o){return o===kd?a.mapping=Ys:o===Bd&&(a.mapping=qs),a}function i(a){if(a&&a.isTexture){const o=a.mapping;if(o===kd||o===Bd)if(e.has(a)){const l=e.get(a).texture;return n(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new MS(l.height);return c.fromEquirectangularTexture(t,a),e.set(a,c),a.addEventListener("dispose",r),n(c.texture,a.mapping)}else return null}}return a}function r(a){const o=a.target;o.removeEventListener("dispose",r);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}class dE extends $v{constructor(e=-1,n=1,i=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=n,this.top=i,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,n,i,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,a=i+e,o=r+n,l=r-n;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}}const Ps=4,Em=[.125,.215,.35,.446,.526,.582],Nr=20,Su=new dE,Tm=new me;let wu=null,Eu=0,Tu=0,Au=!1;const Pr=(1+Math.sqrt(5))/2,ms=1/Pr,Am=[new P(-Pr,ms,0),new P(Pr,ms,0),new P(-ms,0,Pr),new P(ms,0,Pr),new P(0,Pr,-ms),new P(0,Pr,ms),new P(-1,1,-1),new P(1,1,-1),new P(-1,1,1),new P(1,1,1)];class bm{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,n=0,i=.1,r=100){wu=this._renderer.getRenderTarget(),Eu=this._renderer.getActiveCubeFace(),Tu=this._renderer.getActiveMipmapLevel(),Au=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,i,r,s),n>0&&this._blur(s,0,0,n),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,n=null){return this._fromTexture(e,n)}fromCubemap(e,n=null){return this._fromTexture(e,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Pm(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Rm(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(wu,Eu,Tu),this._renderer.xr.enabled=Au,e.scissorTest=!1,al(e,0,0,e.width,e.height)}_fromTexture(e,n){e.mapping===Ys||e.mapping===qs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),wu=this._renderer.getRenderTarget(),Eu=this._renderer.getActiveCubeFace(),Tu=this._renderer.getActiveMipmapLevel(),Au=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=n||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,i={magFilter:gn,minFilter:gn,generateMipmaps:!1,type:_o,format:Jn,colorSpace:ia,depthBuffer:!1},r=Cm(e,n,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Cm(e,n,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=hE(s)),this._blurMaterial=fE(s,e,n)}return r}_compileMaterial(e){const n=new et(this._lodPlanes[0],e);this._renderer.compile(n,Su)}_sceneToCubeUV(e,n,i,r){const o=new En(90,1,n,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],u=this._renderer,h=u.autoClear,f=u.toneMapping;u.getClearColor(Tm),u.toneMapping=lr,u.autoClear=!1;const p=new Ef({name:"PMREM.Background",side:It,depthWrite:!1,depthTest:!1}),v=new et(new Mo,p);let y=!1;const m=e.background;m?m.isColor&&(p.color.copy(m),e.background=null,y=!0):(p.color.copy(Tm),y=!0);for(let d=0;d<6;d++){const g=d%3;g===0?(o.up.set(0,l[d],0),o.lookAt(c[d],0,0)):g===1?(o.up.set(0,0,l[d]),o.lookAt(0,c[d],0)):(o.up.set(0,l[d],0),o.lookAt(0,0,c[d]));const x=this._cubeSize;al(r,g*x,d>2?x:0,x,x),u.setRenderTarget(r),y&&u.render(v,o),u.render(e,o)}v.geometry.dispose(),v.material.dispose(),u.toneMapping=f,u.autoClear=h,e.background=m}_textureToCubeUV(e,n){const i=this._renderer,r=e.mapping===Ys||e.mapping===qs;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Pm()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Rm());const s=r?this._cubemapMaterial:this._equirectMaterial,a=new et(this._lodPlanes[0],s),o=s.uniforms;o.envMap.value=e;const l=this._cubeSize;al(n,0,0,3*l,2*l),i.setRenderTarget(n),i.render(a,Su)}_applyPMREM(e){const n=this._renderer,i=n.autoClear;n.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const a=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=Am[(r-s-1)%Am.length];this._blur(e,s-1,s,a,o)}n.autoClear=i}_blur(e,n,i,r,s){const a=this._pingPongRenderTarget;this._halfBlur(e,a,n,i,r,"latitudinal",s),this._halfBlur(a,e,i,i,r,"longitudinal",s)}_halfBlur(e,n,i,r,s,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,h=new et(this._lodPlanes[r],c),f=c.uniforms,p=this._sizeLods[i]-1,v=isFinite(s)?Math.PI/(2*p):2*Math.PI/(2*Nr-1),y=s/v,m=isFinite(s)?1+Math.floor(u*y):Nr;m>Nr&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Nr}`);const d=[];let g=0;for(let A=0;A<Nr;++A){const b=A/y,w=Math.exp(-b*b/2);d.push(w),A===0?g+=w:A<m&&(g+=2*w)}for(let A=0;A<d.length;A++)d[A]=d[A]/g;f.envMap.value=e.texture,f.samples.value=m,f.weights.value=d,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:x}=this;f.dTheta.value=v,f.mipInt.value=x-i;const _=this._sizeLods[r],R=3*_*(r>x-Ps?r-x+Ps:0),T=4*(this._cubeSize-_);al(n,R,T,3*_,2*_),l.setRenderTarget(n),l.render(h,Su)}}function hE(t){const e=[],n=[],i=[];let r=t;const s=t-Ps+1+Em.length;for(let a=0;a<s;a++){const o=Math.pow(2,r);n.push(o);let l=1/o;a>t-Ps?l=Em[a-t+Ps-1]:a===0&&(l=0),i.push(l);const c=1/(o-2),u=-c,h=1+c,f=[u,u,h,u,h,h,u,u,h,h,u,h],p=6,v=6,y=3,m=2,d=1,g=new Float32Array(y*v*p),x=new Float32Array(m*v*p),_=new Float32Array(d*v*p);for(let T=0;T<p;T++){const A=T%3*2/3-1,b=T>2?0:-1,w=[A,b,0,A+2/3,b,0,A+2/3,b+1,0,A,b,0,A+2/3,b+1,0,A,b+1,0];g.set(w,y*v*T),x.set(f,m*v*T);const M=[T,T,T,T,T,T];_.set(M,d*v*T)}const R=new ct;R.setAttribute("position",new Ye(g,y)),R.setAttribute("uv",new Ye(x,m)),R.setAttribute("faceIndex",new Ye(_,d)),e.push(R),r>Ps&&r--}return{lodPlanes:e,sizeLods:n,sigmas:i}}function Cm(t,e,n){const i=new Yr(t,e,n);return i.texture.mapping=wc,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function al(t,e,n,i,r){t.viewport.set(e,n,i,r),t.scissor.set(e,n,i,r)}function fE(t,e,n){const i=new Float32Array(Nr),r=new P(0,1,0);return new ut({name:"SphericalGaussianBlur",defines:{n:Nr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Af(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:or,depthTest:!1,depthWrite:!1})}function Rm(){return new ut({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Af(),fragmentShader:`

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
		`,blending:or,depthTest:!1,depthWrite:!1})}function Pm(){return new ut({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Af(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:or,depthTest:!1,depthWrite:!1})}function Af(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function pE(t){let e=new WeakMap,n=null;function i(o){if(o&&o.isTexture){const l=o.mapping,c=l===kd||l===Bd,u=l===Ys||l===qs;if(c||u){let h=e.get(o);const f=h!==void 0?h.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return n===null&&(n=new bm(t)),h=c?n.fromEquirectangular(o,h):n.fromCubemap(o,h),h.texture.pmremVersion=o.pmremVersion,e.set(o,h),h.texture;if(h!==void 0)return h.texture;{const p=o.image;return c&&p&&p.height>0||u&&p&&r(p)?(n===null&&(n=new bm(t)),h=c?n.fromEquirectangular(o):n.fromCubemap(o),h.texture.pmremVersion=o.pmremVersion,e.set(o,h),o.addEventListener("dispose",s),h.texture):null}}}return o}function r(o){let l=0;const c=6;for(let u=0;u<c;u++)o[u]!==void 0&&l++;return l===c}function s(o){const l=o.target;l.removeEventListener("dispose",s);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:a}}function mE(t){const e={};function n(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=t.getExtension("WEBGL_depth_texture")||t.getExtension("MOZ_WEBGL_depth_texture")||t.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=t.getExtension("EXT_texture_filter_anisotropic")||t.getExtension("MOZ_EXT_texture_filter_anisotropic")||t.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=t.getExtension("WEBGL_compressed_texture_s3tc")||t.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=t.getExtension("WEBGL_compressed_texture_pvrtc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=t.getExtension(i)}return e[i]=r,r}return{has:function(i){return n(i)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(i){const r=n(i);return r===null&&Da("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function gE(t,e,n,i){const r={},s=new WeakMap;function a(h){const f=h.target;f.index!==null&&e.remove(f.index);for(const v in f.attributes)e.remove(f.attributes[v]);for(const v in f.morphAttributes){const y=f.morphAttributes[v];for(let m=0,d=y.length;m<d;m++)e.remove(y[m])}f.removeEventListener("dispose",a),delete r[f.id];const p=s.get(f);p&&(e.remove(p),s.delete(f)),i.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,n.memory.geometries--}function o(h,f){return r[f.id]===!0||(f.addEventListener("dispose",a),r[f.id]=!0,n.memory.geometries++),f}function l(h){const f=h.attributes;for(const v in f)e.update(f[v],t.ARRAY_BUFFER);const p=h.morphAttributes;for(const v in p){const y=p[v];for(let m=0,d=y.length;m<d;m++)e.update(y[m],t.ARRAY_BUFFER)}}function c(h){const f=[],p=h.index,v=h.attributes.position;let y=0;if(p!==null){const g=p.array;y=p.version;for(let x=0,_=g.length;x<_;x+=3){const R=g[x+0],T=g[x+1],A=g[x+2];f.push(R,T,T,A,A,R)}}else if(v!==void 0){const g=v.array;y=v.version;for(let x=0,_=g.length/3-1;x<_;x+=3){const R=x+0,T=x+1,A=x+2;f.push(R,T,T,A,A,R)}}else return;const m=new(Vv(f)?Yv:Kv)(f,1);m.version=y;const d=s.get(h);d&&e.remove(d),s.set(h,m)}function u(h){const f=s.get(h);if(f){const p=h.index;p!==null&&f.version<p.version&&c(h)}else c(h);return s.get(h)}return{get:o,update:l,getWireframeAttribute:u}}function vE(t,e,n){let i;function r(f){i=f}let s,a;function o(f){s=f.type,a=f.bytesPerElement}function l(f,p){t.drawElements(i,p,s,f*a),n.update(p,i,1)}function c(f,p,v){v!==0&&(t.drawElementsInstanced(i,p,s,f*a,v),n.update(p,i,v))}function u(f,p,v){if(v===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,p,0,s,f,0,v);let m=0;for(let d=0;d<v;d++)m+=p[d];n.update(m,i,1)}function h(f,p,v,y){if(v===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let d=0;d<f.length;d++)c(f[d]/a,p[d],y[d]);else{m.multiDrawElementsInstancedWEBGL(i,p,0,s,f,0,y,0,v);let d=0;for(let g=0;g<v;g++)d+=p[g]*y[g];n.update(d,i,1)}}this.setMode=r,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function xE(t){const e={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,a,o){switch(n.calls++,a){case t.TRIANGLES:n.triangles+=o*(s/3);break;case t.LINES:n.lines+=o*(s/2);break;case t.LINE_STRIP:n.lines+=o*(s-1);break;case t.LINE_LOOP:n.lines+=o*s;break;case t.POINTS:n.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function r(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:e,render:n,programs:null,autoReset:!0,reset:r,update:i}}function yE(t,e,n){const i=new WeakMap,r=new lt;function s(a,o,l){const c=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,h=u!==void 0?u.length:0;let f=i.get(o);if(f===void 0||f.count!==h){let w=function(){A.dispose(),i.delete(o),o.removeEventListener("dispose",w)};f!==void 0&&f.texture.dispose();const p=o.morphAttributes.position!==void 0,v=o.morphAttributes.normal!==void 0,y=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],d=o.morphAttributes.normal||[],g=o.morphAttributes.color||[];let x=0;p===!0&&(x=1),v===!0&&(x=2),y===!0&&(x=3);let _=o.attributes.position.count*x,R=1;_>e.maxTextureSize&&(R=Math.ceil(_/e.maxTextureSize),_=e.maxTextureSize);const T=new Float32Array(_*R*4*h),A=new jv(T,_,R,h);A.type=li,A.needsUpdate=!0;const b=x*4;for(let M=0;M<h;M++){const D=m[M],V=d[M],z=g[M],X=_*R*4*M;for(let Z=0;Z<D.count;Z++){const Y=Z*b;p===!0&&(r.fromBufferAttribute(D,Z),T[X+Y+0]=r.x,T[X+Y+1]=r.y,T[X+Y+2]=r.z,T[X+Y+3]=0),v===!0&&(r.fromBufferAttribute(V,Z),T[X+Y+4]=r.x,T[X+Y+5]=r.y,T[X+Y+6]=r.z,T[X+Y+7]=0),y===!0&&(r.fromBufferAttribute(z,Z),T[X+Y+8]=r.x,T[X+Y+9]=r.y,T[X+Y+10]=r.z,T[X+Y+11]=z.itemSize===4?r.w:1)}}f={count:h,texture:A,size:new Ge(_,R)},i.set(o,f),o.addEventListener("dispose",w)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(t,"morphTexture",a.morphTexture,n);else{let p=0;for(let y=0;y<c.length;y++)p+=c[y];const v=o.morphTargetsRelative?1:1-p;l.getUniforms().setValue(t,"morphTargetBaseInfluence",v),l.getUniforms().setValue(t,"morphTargetInfluences",c)}l.getUniforms().setValue(t,"morphTargetsTexture",f.texture,n),l.getUniforms().setValue(t,"morphTargetsTextureSize",f.size)}return{update:s}}function _E(t,e,n,i){let r=new WeakMap;function s(l){const c=i.render.frame,u=l.geometry,h=e.get(l,u);if(r.get(h)!==c&&(e.update(h),r.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),r.get(l)!==c&&(n.update(l.instanceMatrix,t.ARRAY_BUFFER),l.instanceColor!==null&&n.update(l.instanceColor,t.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const f=l.skeleton;r.get(f)!==c&&(f.update(),r.set(f,c))}return h}function a(){r=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),n.remove(c.instanceMatrix),c.instanceColor!==null&&n.remove(c.instanceColor)}return{update:s,dispose:a}}class Qv extends Ht{constructor(e,n,i,r,s,a,o,l,c,u=ks){if(u!==ks&&u!==Zs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&u===ks&&(i=Kr),i===void 0&&u===Zs&&(i=$s),super(null,r,s,a,o,l,u,i,c),this.isDepthTexture=!0,this.image={width:e,height:n},this.magFilter=o!==void 0?o:bn,this.minFilter=l!==void 0?l:bn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const n=super.toJSON(e);return this.compareFunction!==null&&(n.compareFunction=this.compareFunction),n}}const ex=new Ht,Dm=new Qv(1,1),tx=new jv,nx=new sS,ix=new Zv,Nm=[],Im=[],Lm=new Float32Array(16),Um=new Float32Array(9),Om=new Float32Array(4);function oa(t,e,n){const i=t[0];if(i<=0||i>0)return t;const r=e*n;let s=Nm[r];if(s===void 0&&(s=new Float32Array(r),Nm[r]=s),e!==0){i.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=n,t[a].toArray(s,o)}return s}function Ut(t,e){if(t.length!==e.length)return!1;for(let n=0,i=t.length;n<i;n++)if(t[n]!==e[n])return!1;return!0}function Ot(t,e){for(let n=0,i=e.length;n<i;n++)t[n]=e[n]}function Ac(t,e){let n=Im[e];n===void 0&&(n=new Int32Array(e),Im[e]=n);for(let i=0;i!==e;++i)n[i]=t.allocateTextureUnit();return n}function ME(t,e){const n=this.cache;n[0]!==e&&(t.uniform1f(this.addr,e),n[0]=e)}function SE(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2f(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Ut(n,e))return;t.uniform2fv(this.addr,e),Ot(n,e)}}function wE(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3f(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else if(e.r!==void 0)(n[0]!==e.r||n[1]!==e.g||n[2]!==e.b)&&(t.uniform3f(this.addr,e.r,e.g,e.b),n[0]=e.r,n[1]=e.g,n[2]=e.b);else{if(Ut(n,e))return;t.uniform3fv(this.addr,e),Ot(n,e)}}function EE(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4f(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Ut(n,e))return;t.uniform4fv(this.addr,e),Ot(n,e)}}function TE(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Ut(n,e))return;t.uniformMatrix2fv(this.addr,!1,e),Ot(n,e)}else{if(Ut(n,i))return;Om.set(i),t.uniformMatrix2fv(this.addr,!1,Om),Ot(n,i)}}function AE(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Ut(n,e))return;t.uniformMatrix3fv(this.addr,!1,e),Ot(n,e)}else{if(Ut(n,i))return;Um.set(i),t.uniformMatrix3fv(this.addr,!1,Um),Ot(n,i)}}function bE(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Ut(n,e))return;t.uniformMatrix4fv(this.addr,!1,e),Ot(n,e)}else{if(Ut(n,i))return;Lm.set(i),t.uniformMatrix4fv(this.addr,!1,Lm),Ot(n,i)}}function CE(t,e){const n=this.cache;n[0]!==e&&(t.uniform1i(this.addr,e),n[0]=e)}function RE(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2i(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Ut(n,e))return;t.uniform2iv(this.addr,e),Ot(n,e)}}function PE(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3i(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(Ut(n,e))return;t.uniform3iv(this.addr,e),Ot(n,e)}}function DE(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4i(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Ut(n,e))return;t.uniform4iv(this.addr,e),Ot(n,e)}}function NE(t,e){const n=this.cache;n[0]!==e&&(t.uniform1ui(this.addr,e),n[0]=e)}function IE(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2ui(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Ut(n,e))return;t.uniform2uiv(this.addr,e),Ot(n,e)}}function LE(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3ui(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(Ut(n,e))return;t.uniform3uiv(this.addr,e),Ot(n,e)}}function UE(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4ui(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Ut(n,e))return;t.uniform4uiv(this.addr,e),Ot(n,e)}}function OE(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r);let s;this.type===t.SAMPLER_2D_SHADOW?(Dm.compareFunction=Gv,s=Dm):s=ex,n.setTexture2D(e||s,r)}function FE(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture3D(e||nx,r)}function kE(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTextureCube(e||ix,r)}function BE(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture2DArray(e||tx,r)}function zE(t){switch(t){case 5126:return ME;case 35664:return SE;case 35665:return wE;case 35666:return EE;case 35674:return TE;case 35675:return AE;case 35676:return bE;case 5124:case 35670:return CE;case 35667:case 35671:return RE;case 35668:case 35672:return PE;case 35669:case 35673:return DE;case 5125:return NE;case 36294:return IE;case 36295:return LE;case 36296:return UE;case 35678:case 36198:case 36298:case 36306:case 35682:return OE;case 35679:case 36299:case 36307:return FE;case 35680:case 36300:case 36308:case 36293:return kE;case 36289:case 36303:case 36311:case 36292:return BE}}function HE(t,e){t.uniform1fv(this.addr,e)}function GE(t,e){const n=oa(e,this.size,2);t.uniform2fv(this.addr,n)}function VE(t,e){const n=oa(e,this.size,3);t.uniform3fv(this.addr,n)}function WE(t,e){const n=oa(e,this.size,4);t.uniform4fv(this.addr,n)}function jE(t,e){const n=oa(e,this.size,4);t.uniformMatrix2fv(this.addr,!1,n)}function XE(t,e){const n=oa(e,this.size,9);t.uniformMatrix3fv(this.addr,!1,n)}function KE(t,e){const n=oa(e,this.size,16);t.uniformMatrix4fv(this.addr,!1,n)}function YE(t,e){t.uniform1iv(this.addr,e)}function qE(t,e){t.uniform2iv(this.addr,e)}function $E(t,e){t.uniform3iv(this.addr,e)}function ZE(t,e){t.uniform4iv(this.addr,e)}function JE(t,e){t.uniform1uiv(this.addr,e)}function QE(t,e){t.uniform2uiv(this.addr,e)}function e2(t,e){t.uniform3uiv(this.addr,e)}function t2(t,e){t.uniform4uiv(this.addr,e)}function n2(t,e,n){const i=this.cache,r=e.length,s=Ac(n,r);Ut(i,s)||(t.uniform1iv(this.addr,s),Ot(i,s));for(let a=0;a!==r;++a)n.setTexture2D(e[a]||ex,s[a])}function i2(t,e,n){const i=this.cache,r=e.length,s=Ac(n,r);Ut(i,s)||(t.uniform1iv(this.addr,s),Ot(i,s));for(let a=0;a!==r;++a)n.setTexture3D(e[a]||nx,s[a])}function r2(t,e,n){const i=this.cache,r=e.length,s=Ac(n,r);Ut(i,s)||(t.uniform1iv(this.addr,s),Ot(i,s));for(let a=0;a!==r;++a)n.setTextureCube(e[a]||ix,s[a])}function s2(t,e,n){const i=this.cache,r=e.length,s=Ac(n,r);Ut(i,s)||(t.uniform1iv(this.addr,s),Ot(i,s));for(let a=0;a!==r;++a)n.setTexture2DArray(e[a]||tx,s[a])}function a2(t){switch(t){case 5126:return HE;case 35664:return GE;case 35665:return VE;case 35666:return WE;case 35674:return jE;case 35675:return XE;case 35676:return KE;case 5124:case 35670:return YE;case 35667:case 35671:return qE;case 35668:case 35672:return $E;case 35669:case 35673:return ZE;case 5125:return JE;case 36294:return QE;case 36295:return e2;case 36296:return t2;case 35678:case 36198:case 36298:case 36306:case 35682:return n2;case 35679:case 36299:case 36307:return i2;case 35680:case 36300:case 36308:case 36293:return r2;case 36289:case 36303:case 36311:case 36292:return s2}}class o2{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.setValue=zE(n.type)}}class l2{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=a2(n.type)}}class c2{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,n,i){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(e,n[o.id],i)}}}const bu=/(\w+)(\])?(\[|\.)?/g;function Fm(t,e){t.seq.push(e),t.map[e.id]=e}function u2(t,e,n){const i=t.name,r=i.length;for(bu.lastIndex=0;;){const s=bu.exec(i),a=bu.lastIndex;let o=s[1];const l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===r){Fm(n,c===void 0?new o2(o,t,e):new l2(o,t,e));break}else{let h=n.map[o];h===void 0&&(h=new c2(o),Fm(n,h)),n=h}}}class Pl{constructor(e,n){this.seq=[],this.map={};const i=e.getProgramParameter(n,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const s=e.getActiveUniform(n,r),a=e.getUniformLocation(n,s.name);u2(s,a,this)}}setValue(e,n,i,r){const s=this.map[n];s!==void 0&&s.setValue(e,i,r)}setOptional(e,n,i){const r=n[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,n,i,r){for(let s=0,a=n.length;s!==a;++s){const o=n[s],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,r)}}static seqWithValue(e,n){const i=[];for(let r=0,s=e.length;r!==s;++r){const a=e[r];a.id in n&&i.push(a)}return i}}function km(t,e,n){const i=t.createShader(e);return t.shaderSource(i,n),t.compileShader(i),i}const d2=37297;let h2=0;function f2(t,e){const n=t.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,n.length);for(let a=r;a<s;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${n[a]}`)}return i.join(`
`)}const Bm=new ke;function p2(t){$e._getMatrix(Bm,$e.workingColorSpace,t);const e=`mat3( ${Bm.elements.map(n=>n.toFixed(4))} )`;switch($e.getTransfer(t)){case Ec:return[e,"LinearTransferOETF"];case ot:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",t),[e,"LinearTransferOETF"]}}function zm(t,e,n){const i=t.getShaderParameter(e,t.COMPILE_STATUS),r=t.getShaderInfoLog(e).trim();if(i&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const a=parseInt(s[1]);return n.toUpperCase()+`

`+r+`

`+f2(t.getShaderSource(e),a)}else return r}function m2(t,e){const n=p2(e);return[`vec4 ${t}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,"}"].join(`
`)}function g2(t,e){let n;switch(e){case xM:n="Linear";break;case yM:n="Reinhard";break;case _M:n="Cineon";break;case Pv:n="ACESFilmic";break;case SM:n="AgX";break;case wM:n="Neutral";break;case MM:n="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),n="Linear"}return"vec3 "+t+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}const ol=new P;function v2(){$e.getLuminanceCoefficients(ol);const t=ol.x.toFixed(4),e=ol.y.toFixed(4),n=ol.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${t}, ${e}, ${n} );`,"	return dot( weights, rgb );","}"].join(`
`)}function x2(t){return[t.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",t.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Na).join(`
`)}function y2(t){const e=[];for(const n in t){const i=t[n];i!==!1&&e.push("#define "+n+" "+i)}return e.join(`
`)}function _2(t,e){const n={},i=t.getProgramParameter(e,t.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=t.getActiveAttrib(e,r),a=s.name;let o=1;s.type===t.FLOAT_MAT2&&(o=2),s.type===t.FLOAT_MAT3&&(o=3),s.type===t.FLOAT_MAT4&&(o=4),n[a]={type:s.type,location:t.getAttribLocation(e,a),locationSize:o}}return n}function Na(t){return t!==""}function Hm(t,e){const n=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return t.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Gm(t,e){return t.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const M2=/^[ \t]*#include +<([\w\d./]+)>/gm;function fh(t){return t.replace(M2,w2)}const S2=new Map;function w2(t,e){let n=He[e];if(n===void 0){const i=S2.get(e);if(i!==void 0)n=He[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return fh(n)}const E2=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Vm(t){return t.replace(E2,T2)}function T2(t,e,n,i){let r="";for(let s=parseInt(e);s<parseInt(n);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Wm(t){let e=`precision ${t.precision} float;
	precision ${t.precision} int;
	precision ${t.precision} sampler2D;
	precision ${t.precision} samplerCube;
	precision ${t.precision} sampler3D;
	precision ${t.precision} sampler2DArray;
	precision ${t.precision} sampler2DShadow;
	precision ${t.precision} samplerCubeShadow;
	precision ${t.precision} sampler2DArrayShadow;
	precision ${t.precision} isampler2D;
	precision ${t.precision} isampler3D;
	precision ${t.precision} isamplerCube;
	precision ${t.precision} isampler2DArray;
	precision ${t.precision} usampler2D;
	precision ${t.precision} usampler3D;
	precision ${t.precision} usamplerCube;
	precision ${t.precision} usampler2DArray;
	`;return t.precision==="highp"?e+=`
#define HIGH_PRECISION`:t.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:t.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function A2(t){let e="SHADOWMAP_TYPE_BASIC";return t.shadowMapType===Cv?e="SHADOWMAP_TYPE_PCF":t.shadowMapType===Z_?e="SHADOWMAP_TYPE_PCF_SOFT":t.shadowMapType===yi&&(e="SHADOWMAP_TYPE_VSM"),e}function b2(t){let e="ENVMAP_TYPE_CUBE";if(t.envMap)switch(t.envMapMode){case Ys:case qs:e="ENVMAP_TYPE_CUBE";break;case wc:e="ENVMAP_TYPE_CUBE_UV";break}return e}function C2(t){let e="ENVMAP_MODE_REFLECTION";if(t.envMap)switch(t.envMapMode){case qs:e="ENVMAP_MODE_REFRACTION";break}return e}function R2(t){let e="ENVMAP_BLENDING_NONE";if(t.envMap)switch(t.combine){case Rv:e="ENVMAP_BLENDING_MULTIPLY";break;case gM:e="ENVMAP_BLENDING_MIX";break;case vM:e="ENVMAP_BLENDING_ADD";break}return e}function P2(t){const e=t.envMapCubeUVHeight;if(e===null)return null;const n=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,n),7*16)),texelHeight:i,maxMip:n}}function D2(t,e,n,i){const r=t.getContext(),s=n.defines;let a=n.vertexShader,o=n.fragmentShader;const l=A2(n),c=b2(n),u=C2(n),h=R2(n),f=P2(n),p=x2(n),v=y2(s),y=r.createProgram();let m,d,g=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(m=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,v].filter(Na).join(`
`),m.length>0&&(m+=`
`),d=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,v].filter(Na).join(`
`),d.length>0&&(d+=`
`)):(m=[Wm(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,v,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+u:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Na).join(`
`),d=[Wm(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,v,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+c:"",n.envMap?"#define "+u:"",n.envMap?"#define "+h:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor||n.batchingColor?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==lr?"#define TONE_MAPPING":"",n.toneMapping!==lr?He.tonemapping_pars_fragment:"",n.toneMapping!==lr?g2("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",He.colorspace_pars_fragment,m2("linearToOutputTexel",n.outputColorSpace),v2(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(Na).join(`
`)),a=fh(a),a=Hm(a,n),a=Gm(a,n),o=fh(o),o=Hm(o,n),o=Gm(o,n),a=Vm(a),o=Vm(o),n.isRawShaderMaterial!==!0&&(g=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,d=["#define varying in",n.glslVersion===nm?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===nm?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);const x=g+m+a,_=g+d+o,R=km(r,r.VERTEX_SHADER,x),T=km(r,r.FRAGMENT_SHADER,_);r.attachShader(y,R),r.attachShader(y,T),n.index0AttributeName!==void 0?r.bindAttribLocation(y,0,n.index0AttributeName):n.morphTargets===!0&&r.bindAttribLocation(y,0,"position"),r.linkProgram(y);function A(D){if(t.debug.checkShaderErrors){const V=r.getProgramInfoLog(y).trim(),z=r.getShaderInfoLog(R).trim(),X=r.getShaderInfoLog(T).trim();let Z=!0,Y=!0;if(r.getProgramParameter(y,r.LINK_STATUS)===!1)if(Z=!1,typeof t.debug.onShaderError=="function")t.debug.onShaderError(r,y,R,T);else{const te=zm(r,R,"vertex"),I=zm(r,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(y,r.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+V+`
`+te+`
`+I)}else V!==""?console.warn("THREE.WebGLProgram: Program Info Log:",V):(z===""||X==="")&&(Y=!1);Y&&(D.diagnostics={runnable:Z,programLog:V,vertexShader:{log:z,prefix:m},fragmentShader:{log:X,prefix:d}})}r.deleteShader(R),r.deleteShader(T),b=new Pl(r,y),w=_2(r,y)}let b;this.getUniforms=function(){return b===void 0&&A(this),b};let w;this.getAttributes=function(){return w===void 0&&A(this),w};let M=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=r.getProgramParameter(y,d2)),M},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(y),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=h2++,this.cacheKey=e,this.usedTimes=1,this.program=y,this.vertexShader=R,this.fragmentShader=T,this}let N2=0;class I2{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const n=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(n),s=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(e){const n=this.materialCache.get(e);for(const i of n)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const n=this.materialCache;let i=n.get(e);return i===void 0&&(i=new Set,n.set(e,i)),i}_getShaderStage(e){const n=this.shaderCache;let i=n.get(e);return i===void 0&&(i=new L2(e),n.set(e,i)),i}}class L2{constructor(e){this.id=N2++,this.code=e,this.usedTimes=0}}function U2(t,e,n,i,r,s,a){const o=new wf,l=new I2,c=new Set,u=[],h=r.logarithmicDepthBuffer,f=r.vertexTextures;let p=r.precision;const v={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function y(w){return c.add(w),w===0?"uv":`uv${w}`}function m(w,M,D,V,z){const X=V.fog,Z=z.geometry,Y=w.isMeshStandardMaterial?V.environment:null,te=(w.isMeshStandardMaterial?n:e).get(w.envMap||Y),I=te&&te.mapping===wc?te.image.height:null,$=v[w.type];w.precision!==null&&(p=r.getMaxPrecision(w.precision),p!==w.precision&&console.warn("THREE.WebGLProgram.getParameters:",w.precision,"not supported, using",p,"instead."));const J=Z.morphAttributes.position||Z.morphAttributes.normal||Z.morphAttributes.color,ae=J!==void 0?J.length:0;let ye=0;Z.morphAttributes.position!==void 0&&(ye=1),Z.morphAttributes.normal!==void 0&&(ye=2),Z.morphAttributes.color!==void 0&&(ye=3);let Ve,K,ne,ce;if($){const it=ai[$];Ve=it.vertexShader,K=it.fragmentShader}else Ve=w.vertexShader,K=w.fragmentShader,l.update(w),ne=l.getVertexShaderID(w),ce=l.getFragmentShaderID(w);const oe=t.getRenderTarget(),Ce=t.state.buffers.depth.getReversed(),Ie=z.isInstancedMesh===!0,Ue=z.isBatchedMesh===!0,dt=!!w.map,je=!!w.matcap,Be=!!te,U=!!w.aoMap,rn=!!w.lightMap,Re=!!w.bumpMap,Xe=!!w.normalMap,be=!!w.displacementMap,at=!!w.emissiveMap,Ae=!!w.metalnessMap,C=!!w.roughnessMap,S=w.anisotropy>0,H=w.clearcoat>0,Q=w.dispersion>0,L=w.iridescence>0,B=w.sheen>0,ge=w.transmission>0,ue=S&&!!w.anisotropyMap,ve=H&&!!w.clearcoatMap,qe=H&&!!w.clearcoatNormalMap,re=H&&!!w.clearcoatRoughnessMap,_e=L&&!!w.iridescenceMap,Pe=L&&!!w.iridescenceThicknessMap,Ne=B&&!!w.sheenColorMap,Me=B&&!!w.sheenRoughnessMap,Ke=!!w.specularMap,ze=!!w.specularColorMap,ht=!!w.specularIntensityMap,O=ge&&!!w.transmissionMap,de=ge&&!!w.thicknessMap,q=!!w.gradientMap,ee=!!w.alphaMap,pe=w.alphaTest>0,he=!!w.alphaHash,Oe=!!w.extensions;let Tt=lr;w.toneMapped&&(oe===null||oe.isXRRenderTarget===!0)&&(Tt=t.toneMapping);const Yt={shaderID:$,shaderType:w.type,shaderName:w.name,vertexShader:Ve,fragmentShader:K,defines:w.defines,customVertexShaderID:ne,customFragmentShaderID:ce,isRawShaderMaterial:w.isRawShaderMaterial===!0,glslVersion:w.glslVersion,precision:p,batching:Ue,batchingColor:Ue&&z._colorsTexture!==null,instancing:Ie,instancingColor:Ie&&z.instanceColor!==null,instancingMorph:Ie&&z.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:oe===null?t.outputColorSpace:oe.isXRRenderTarget===!0?oe.texture.colorSpace:ia,alphaToCoverage:!!w.alphaToCoverage,map:dt,matcap:je,envMap:Be,envMapMode:Be&&te.mapping,envMapCubeUVHeight:I,aoMap:U,lightMap:rn,bumpMap:Re,normalMap:Xe,displacementMap:f&&be,emissiveMap:at,normalMapObjectSpace:Xe&&w.normalMapType===bM,normalMapTangentSpace:Xe&&w.normalMapType===Hv,metalnessMap:Ae,roughnessMap:C,anisotropy:S,anisotropyMap:ue,clearcoat:H,clearcoatMap:ve,clearcoatNormalMap:qe,clearcoatRoughnessMap:re,dispersion:Q,iridescence:L,iridescenceMap:_e,iridescenceThicknessMap:Pe,sheen:B,sheenColorMap:Ne,sheenRoughnessMap:Me,specularMap:Ke,specularColorMap:ze,specularIntensityMap:ht,transmission:ge,transmissionMap:O,thicknessMap:de,gradientMap:q,opaque:w.transparent===!1&&w.blending===Ai&&w.alphaToCoverage===!1,alphaMap:ee,alphaTest:pe,alphaHash:he,combine:w.combine,mapUv:dt&&y(w.map.channel),aoMapUv:U&&y(w.aoMap.channel),lightMapUv:rn&&y(w.lightMap.channel),bumpMapUv:Re&&y(w.bumpMap.channel),normalMapUv:Xe&&y(w.normalMap.channel),displacementMapUv:be&&y(w.displacementMap.channel),emissiveMapUv:at&&y(w.emissiveMap.channel),metalnessMapUv:Ae&&y(w.metalnessMap.channel),roughnessMapUv:C&&y(w.roughnessMap.channel),anisotropyMapUv:ue&&y(w.anisotropyMap.channel),clearcoatMapUv:ve&&y(w.clearcoatMap.channel),clearcoatNormalMapUv:qe&&y(w.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:re&&y(w.clearcoatRoughnessMap.channel),iridescenceMapUv:_e&&y(w.iridescenceMap.channel),iridescenceThicknessMapUv:Pe&&y(w.iridescenceThicknessMap.channel),sheenColorMapUv:Ne&&y(w.sheenColorMap.channel),sheenRoughnessMapUv:Me&&y(w.sheenRoughnessMap.channel),specularMapUv:Ke&&y(w.specularMap.channel),specularColorMapUv:ze&&y(w.specularColorMap.channel),specularIntensityMapUv:ht&&y(w.specularIntensityMap.channel),transmissionMapUv:O&&y(w.transmissionMap.channel),thicknessMapUv:de&&y(w.thicknessMap.channel),alphaMapUv:ee&&y(w.alphaMap.channel),vertexTangents:!!Z.attributes.tangent&&(Xe||S),vertexColors:w.vertexColors,vertexAlphas:w.vertexColors===!0&&!!Z.attributes.color&&Z.attributes.color.itemSize===4,pointsUvs:z.isPoints===!0&&!!Z.attributes.uv&&(dt||ee),fog:!!X,useFog:w.fog===!0,fogExp2:!!X&&X.isFogExp2,flatShading:w.flatShading===!0,sizeAttenuation:w.sizeAttenuation===!0,logarithmicDepthBuffer:h,reverseDepthBuffer:Ce,skinning:z.isSkinnedMesh===!0,morphTargets:Z.morphAttributes.position!==void 0,morphNormals:Z.morphAttributes.normal!==void 0,morphColors:Z.morphAttributes.color!==void 0,morphTargetsCount:ae,morphTextureStride:ye,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:w.dithering,shadowMapEnabled:t.shadowMap.enabled&&D.length>0,shadowMapType:t.shadowMap.type,toneMapping:Tt,decodeVideoTexture:dt&&w.map.isVideoTexture===!0&&$e.getTransfer(w.map.colorSpace)===ot,decodeVideoTextureEmissive:at&&w.emissiveMap.isVideoTexture===!0&&$e.getTransfer(w.emissiveMap.colorSpace)===ot,premultipliedAlpha:w.premultipliedAlpha,doubleSided:w.side===cn,flipSided:w.side===It,useDepthPacking:w.depthPacking>=0,depthPacking:w.depthPacking||0,index0AttributeName:w.index0AttributeName,extensionClipCullDistance:Oe&&w.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Oe&&w.extensions.multiDraw===!0||Ue)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:w.customProgramCacheKey()};return Yt.vertexUv1s=c.has(1),Yt.vertexUv2s=c.has(2),Yt.vertexUv3s=c.has(3),c.clear(),Yt}function d(w){const M=[];if(w.shaderID?M.push(w.shaderID):(M.push(w.customVertexShaderID),M.push(w.customFragmentShaderID)),w.defines!==void 0)for(const D in w.defines)M.push(D),M.push(w.defines[D]);return w.isRawShaderMaterial===!1&&(g(M,w),x(M,w),M.push(t.outputColorSpace)),M.push(w.customProgramCacheKey),M.join()}function g(w,M){w.push(M.precision),w.push(M.outputColorSpace),w.push(M.envMapMode),w.push(M.envMapCubeUVHeight),w.push(M.mapUv),w.push(M.alphaMapUv),w.push(M.lightMapUv),w.push(M.aoMapUv),w.push(M.bumpMapUv),w.push(M.normalMapUv),w.push(M.displacementMapUv),w.push(M.emissiveMapUv),w.push(M.metalnessMapUv),w.push(M.roughnessMapUv),w.push(M.anisotropyMapUv),w.push(M.clearcoatMapUv),w.push(M.clearcoatNormalMapUv),w.push(M.clearcoatRoughnessMapUv),w.push(M.iridescenceMapUv),w.push(M.iridescenceThicknessMapUv),w.push(M.sheenColorMapUv),w.push(M.sheenRoughnessMapUv),w.push(M.specularMapUv),w.push(M.specularColorMapUv),w.push(M.specularIntensityMapUv),w.push(M.transmissionMapUv),w.push(M.thicknessMapUv),w.push(M.combine),w.push(M.fogExp2),w.push(M.sizeAttenuation),w.push(M.morphTargetsCount),w.push(M.morphAttributeCount),w.push(M.numDirLights),w.push(M.numPointLights),w.push(M.numSpotLights),w.push(M.numSpotLightMaps),w.push(M.numHemiLights),w.push(M.numRectAreaLights),w.push(M.numDirLightShadows),w.push(M.numPointLightShadows),w.push(M.numSpotLightShadows),w.push(M.numSpotLightShadowsWithMaps),w.push(M.numLightProbes),w.push(M.shadowMapType),w.push(M.toneMapping),w.push(M.numClippingPlanes),w.push(M.numClipIntersection),w.push(M.depthPacking)}function x(w,M){o.disableAll(),M.supportsVertexTextures&&o.enable(0),M.instancing&&o.enable(1),M.instancingColor&&o.enable(2),M.instancingMorph&&o.enable(3),M.matcap&&o.enable(4),M.envMap&&o.enable(5),M.normalMapObjectSpace&&o.enable(6),M.normalMapTangentSpace&&o.enable(7),M.clearcoat&&o.enable(8),M.iridescence&&o.enable(9),M.alphaTest&&o.enable(10),M.vertexColors&&o.enable(11),M.vertexAlphas&&o.enable(12),M.vertexUv1s&&o.enable(13),M.vertexUv2s&&o.enable(14),M.vertexUv3s&&o.enable(15),M.vertexTangents&&o.enable(16),M.anisotropy&&o.enable(17),M.alphaHash&&o.enable(18),M.batching&&o.enable(19),M.dispersion&&o.enable(20),M.batchingColor&&o.enable(21),w.push(o.mask),o.disableAll(),M.fog&&o.enable(0),M.useFog&&o.enable(1),M.flatShading&&o.enable(2),M.logarithmicDepthBuffer&&o.enable(3),M.reverseDepthBuffer&&o.enable(4),M.skinning&&o.enable(5),M.morphTargets&&o.enable(6),M.morphNormals&&o.enable(7),M.morphColors&&o.enable(8),M.premultipliedAlpha&&o.enable(9),M.shadowMapEnabled&&o.enable(10),M.doubleSided&&o.enable(11),M.flipSided&&o.enable(12),M.useDepthPacking&&o.enable(13),M.dithering&&o.enable(14),M.transmission&&o.enable(15),M.sheen&&o.enable(16),M.opaque&&o.enable(17),M.pointsUvs&&o.enable(18),M.decodeVideoTexture&&o.enable(19),M.decodeVideoTextureEmissive&&o.enable(20),M.alphaToCoverage&&o.enable(21),w.push(o.mask)}function _(w){const M=v[w.type];let D;if(M){const V=ai[M];D=vS.clone(V.uniforms)}else D=w.uniforms;return D}function R(w,M){let D;for(let V=0,z=u.length;V<z;V++){const X=u[V];if(X.cacheKey===M){D=X,++D.usedTimes;break}}return D===void 0&&(D=new D2(t,M,w,s),u.push(D)),D}function T(w){if(--w.usedTimes===0){const M=u.indexOf(w);u[M]=u[u.length-1],u.pop(),w.destroy()}}function A(w){l.remove(w)}function b(){l.dispose()}return{getParameters:m,getProgramCacheKey:d,getUniforms:_,acquireProgram:R,releaseProgram:T,releaseShaderCache:A,programs:u,dispose:b}}function O2(){let t=new WeakMap;function e(a){return t.has(a)}function n(a){let o=t.get(a);return o===void 0&&(o={},t.set(a,o)),o}function i(a){t.delete(a)}function r(a,o,l){t.get(a)[o]=l}function s(){t=new WeakMap}return{has:e,get:n,remove:i,update:r,dispose:s}}function F2(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.material.id!==e.material.id?t.material.id-e.material.id:t.z!==e.z?t.z-e.z:t.id-e.id}function jm(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.z!==e.z?e.z-t.z:t.id-e.id}function Xm(){const t=[];let e=0;const n=[],i=[],r=[];function s(){e=0,n.length=0,i.length=0,r.length=0}function a(h,f,p,v,y,m){let d=t[e];return d===void 0?(d={id:h.id,object:h,geometry:f,material:p,groupOrder:v,renderOrder:h.renderOrder,z:y,group:m},t[e]=d):(d.id=h.id,d.object=h,d.geometry=f,d.material=p,d.groupOrder=v,d.renderOrder=h.renderOrder,d.z=y,d.group=m),e++,d}function o(h,f,p,v,y,m){const d=a(h,f,p,v,y,m);p.transmission>0?i.push(d):p.transparent===!0?r.push(d):n.push(d)}function l(h,f,p,v,y,m){const d=a(h,f,p,v,y,m);p.transmission>0?i.unshift(d):p.transparent===!0?r.unshift(d):n.unshift(d)}function c(h,f){n.length>1&&n.sort(h||F2),i.length>1&&i.sort(f||jm),r.length>1&&r.sort(f||jm)}function u(){for(let h=e,f=t.length;h<f;h++){const p=t[h];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:n,transmissive:i,transparent:r,init:s,push:o,unshift:l,finish:u,sort:c}}function k2(){let t=new WeakMap;function e(i,r){const s=t.get(i);let a;return s===void 0?(a=new Xm,t.set(i,[a])):r>=s.length?(a=new Xm,s.push(a)):a=s[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}function B2(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={direction:new P,color:new me};break;case"SpotLight":n={position:new P,direction:new P,color:new me,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new P,color:new me,distance:0,decay:0};break;case"HemisphereLight":n={direction:new P,skyColor:new me,groundColor:new me};break;case"RectAreaLight":n={color:new me,position:new P,halfWidth:new P,halfHeight:new P};break}return t[e.id]=n,n}}}function z2(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ge};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ge};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ge,shadowCameraNear:1,shadowCameraFar:1e3};break}return t[e.id]=n,n}}}let H2=0;function G2(t,e){return(e.castShadow?2:0)-(t.castShadow?2:0)+(e.map?1:0)-(t.map?1:0)}function V2(t){const e=new B2,n=z2(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new P);const r=new P,s=new st,a=new st;function o(c){let u=0,h=0,f=0;for(let w=0;w<9;w++)i.probe[w].set(0,0,0);let p=0,v=0,y=0,m=0,d=0,g=0,x=0,_=0,R=0,T=0,A=0;c.sort(G2);for(let w=0,M=c.length;w<M;w++){const D=c[w],V=D.color,z=D.intensity,X=D.distance,Z=D.shadow&&D.shadow.map?D.shadow.map.texture:null;if(D.isAmbientLight)u+=V.r*z,h+=V.g*z,f+=V.b*z;else if(D.isLightProbe){for(let Y=0;Y<9;Y++)i.probe[Y].addScaledVector(D.sh.coefficients[Y],z);A++}else if(D.isDirectionalLight){const Y=e.get(D);if(Y.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){const te=D.shadow,I=n.get(D);I.shadowIntensity=te.intensity,I.shadowBias=te.bias,I.shadowNormalBias=te.normalBias,I.shadowRadius=te.radius,I.shadowMapSize=te.mapSize,i.directionalShadow[p]=I,i.directionalShadowMap[p]=Z,i.directionalShadowMatrix[p]=D.shadow.matrix,g++}i.directional[p]=Y,p++}else if(D.isSpotLight){const Y=e.get(D);Y.position.setFromMatrixPosition(D.matrixWorld),Y.color.copy(V).multiplyScalar(z),Y.distance=X,Y.coneCos=Math.cos(D.angle),Y.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),Y.decay=D.decay,i.spot[y]=Y;const te=D.shadow;if(D.map&&(i.spotLightMap[R]=D.map,R++,te.updateMatrices(D),D.castShadow&&T++),i.spotLightMatrix[y]=te.matrix,D.castShadow){const I=n.get(D);I.shadowIntensity=te.intensity,I.shadowBias=te.bias,I.shadowNormalBias=te.normalBias,I.shadowRadius=te.radius,I.shadowMapSize=te.mapSize,i.spotShadow[y]=I,i.spotShadowMap[y]=Z,_++}y++}else if(D.isRectAreaLight){const Y=e.get(D);Y.color.copy(V).multiplyScalar(z),Y.halfWidth.set(D.width*.5,0,0),Y.halfHeight.set(0,D.height*.5,0),i.rectArea[m]=Y,m++}else if(D.isPointLight){const Y=e.get(D);if(Y.color.copy(D.color).multiplyScalar(D.intensity),Y.distance=D.distance,Y.decay=D.decay,D.castShadow){const te=D.shadow,I=n.get(D);I.shadowIntensity=te.intensity,I.shadowBias=te.bias,I.shadowNormalBias=te.normalBias,I.shadowRadius=te.radius,I.shadowMapSize=te.mapSize,I.shadowCameraNear=te.camera.near,I.shadowCameraFar=te.camera.far,i.pointShadow[v]=I,i.pointShadowMap[v]=Z,i.pointShadowMatrix[v]=D.shadow.matrix,x++}i.point[v]=Y,v++}else if(D.isHemisphereLight){const Y=e.get(D);Y.skyColor.copy(D.color).multiplyScalar(z),Y.groundColor.copy(D.groundColor).multiplyScalar(z),i.hemi[d]=Y,d++}}m>0&&(t.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=le.LTC_FLOAT_1,i.rectAreaLTC2=le.LTC_FLOAT_2):(i.rectAreaLTC1=le.LTC_HALF_1,i.rectAreaLTC2=le.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=h,i.ambient[2]=f;const b=i.hash;(b.directionalLength!==p||b.pointLength!==v||b.spotLength!==y||b.rectAreaLength!==m||b.hemiLength!==d||b.numDirectionalShadows!==g||b.numPointShadows!==x||b.numSpotShadows!==_||b.numSpotMaps!==R||b.numLightProbes!==A)&&(i.directional.length=p,i.spot.length=y,i.rectArea.length=m,i.point.length=v,i.hemi.length=d,i.directionalShadow.length=g,i.directionalShadowMap.length=g,i.pointShadow.length=x,i.pointShadowMap.length=x,i.spotShadow.length=_,i.spotShadowMap.length=_,i.directionalShadowMatrix.length=g,i.pointShadowMatrix.length=x,i.spotLightMatrix.length=_+R-T,i.spotLightMap.length=R,i.numSpotLightShadowsWithMaps=T,i.numLightProbes=A,b.directionalLength=p,b.pointLength=v,b.spotLength=y,b.rectAreaLength=m,b.hemiLength=d,b.numDirectionalShadows=g,b.numPointShadows=x,b.numSpotShadows=_,b.numSpotMaps=R,b.numLightProbes=A,i.version=H2++)}function l(c,u){let h=0,f=0,p=0,v=0,y=0;const m=u.matrixWorldInverse;for(let d=0,g=c.length;d<g;d++){const x=c[d];if(x.isDirectionalLight){const _=i.directional[h];_.direction.setFromMatrixPosition(x.matrixWorld),r.setFromMatrixPosition(x.target.matrixWorld),_.direction.sub(r),_.direction.transformDirection(m),h++}else if(x.isSpotLight){const _=i.spot[p];_.position.setFromMatrixPosition(x.matrixWorld),_.position.applyMatrix4(m),_.direction.setFromMatrixPosition(x.matrixWorld),r.setFromMatrixPosition(x.target.matrixWorld),_.direction.sub(r),_.direction.transformDirection(m),p++}else if(x.isRectAreaLight){const _=i.rectArea[v];_.position.setFromMatrixPosition(x.matrixWorld),_.position.applyMatrix4(m),a.identity(),s.copy(x.matrixWorld),s.premultiply(m),a.extractRotation(s),_.halfWidth.set(x.width*.5,0,0),_.halfHeight.set(0,x.height*.5,0),_.halfWidth.applyMatrix4(a),_.halfHeight.applyMatrix4(a),v++}else if(x.isPointLight){const _=i.point[f];_.position.setFromMatrixPosition(x.matrixWorld),_.position.applyMatrix4(m),f++}else if(x.isHemisphereLight){const _=i.hemi[y];_.direction.setFromMatrixPosition(x.matrixWorld),_.direction.transformDirection(m),y++}}}return{setup:o,setupView:l,state:i}}function Km(t){const e=new V2(t),n=[],i=[];function r(u){c.camera=u,n.length=0,i.length=0}function s(u){n.push(u)}function a(u){i.push(u)}function o(){e.setup(n)}function l(u){e.setupView(n,u)}const c={lightsArray:n,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:c,setupLights:o,setupLightsView:l,pushLight:s,pushShadow:a}}function W2(t){let e=new WeakMap;function n(r,s=0){const a=e.get(r);let o;return a===void 0?(o=new Km(t),e.set(r,[o])):s>=a.length?(o=new Km(t),a.push(o)):o=a[s],o}function i(){e=new WeakMap}return{get:n,dispose:i}}class j2 extends Qr{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=TM,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class X2 extends Qr{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const K2=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Y2=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function q2(t,e,n){let i=new Tf;const r=new Ge,s=new Ge,a=new lt,o=new j2({depthPacking:AM}),l=new X2,c={},u=n.maxTextureSize,h={[hr]:It,[It]:hr,[cn]:cn},f=new ut({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ge},radius:{value:4}},vertexShader:K2,fragmentShader:Y2}),p=f.clone();p.defines.HORIZONTAL_PASS=1;const v=new ct;v.setAttribute("position",new Ye(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const y=new et(v,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Cv;let d=this.type;this.render=function(T,A,b){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;const w=t.getRenderTarget(),M=t.getActiveCubeFace(),D=t.getActiveMipmapLevel(),V=t.state;V.setBlending(or),V.buffers.color.setClear(1,1,1,1),V.buffers.depth.setTest(!0),V.setScissorTest(!1);const z=d!==yi&&this.type===yi,X=d===yi&&this.type!==yi;for(let Z=0,Y=T.length;Z<Y;Z++){const te=T[Z],I=te.shadow;if(I===void 0){console.warn("THREE.WebGLShadowMap:",te,"has no shadow.");continue}if(I.autoUpdate===!1&&I.needsUpdate===!1)continue;r.copy(I.mapSize);const $=I.getFrameExtents();if(r.multiply($),s.copy(I.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/$.x),r.x=s.x*$.x,I.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/$.y),r.y=s.y*$.y,I.mapSize.y=s.y)),I.map===null||z===!0||X===!0){const ae=this.type!==yi?{minFilter:bn,magFilter:bn}:{};I.map!==null&&I.map.dispose(),I.map=new Yr(r.x,r.y,ae),I.map.texture.name=te.name+".shadowMap",I.camera.updateProjectionMatrix()}t.setRenderTarget(I.map),t.clear();const J=I.getViewportCount();for(let ae=0;ae<J;ae++){const ye=I.getViewport(ae);a.set(s.x*ye.x,s.y*ye.y,s.x*ye.z,s.y*ye.w),V.viewport(a),I.updateMatrices(te,ae),i=I.getFrustum(),_(A,b,I.camera,te,this.type)}I.isPointLightShadow!==!0&&this.type===yi&&g(I,b),I.needsUpdate=!1}d=this.type,m.needsUpdate=!1,t.setRenderTarget(w,M,D)};function g(T,A){const b=e.update(y);f.defines.VSM_SAMPLES!==T.blurSamples&&(f.defines.VSM_SAMPLES=T.blurSamples,p.defines.VSM_SAMPLES=T.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new Yr(r.x,r.y)),f.uniforms.shadow_pass.value=T.map.texture,f.uniforms.resolution.value=T.mapSize,f.uniforms.radius.value=T.radius,t.setRenderTarget(T.mapPass),t.clear(),t.renderBufferDirect(A,null,b,f,y,null),p.uniforms.shadow_pass.value=T.mapPass.texture,p.uniforms.resolution.value=T.mapSize,p.uniforms.radius.value=T.radius,t.setRenderTarget(T.map),t.clear(),t.renderBufferDirect(A,null,b,p,y,null)}function x(T,A,b,w){let M=null;const D=b.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(D!==void 0)M=D;else if(M=b.isPointLight===!0?l:o,t.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const V=M.uuid,z=A.uuid;let X=c[V];X===void 0&&(X={},c[V]=X);let Z=X[z];Z===void 0&&(Z=M.clone(),X[z]=Z,A.addEventListener("dispose",R)),M=Z}if(M.visible=A.visible,M.wireframe=A.wireframe,w===yi?M.side=A.shadowSide!==null?A.shadowSide:A.side:M.side=A.shadowSide!==null?A.shadowSide:h[A.side],M.alphaMap=A.alphaMap,M.alphaTest=A.alphaTest,M.map=A.map,M.clipShadows=A.clipShadows,M.clippingPlanes=A.clippingPlanes,M.clipIntersection=A.clipIntersection,M.displacementMap=A.displacementMap,M.displacementScale=A.displacementScale,M.displacementBias=A.displacementBias,M.wireframeLinewidth=A.wireframeLinewidth,M.linewidth=A.linewidth,b.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const V=t.properties.get(M);V.light=b}return M}function _(T,A,b,w,M){if(T.visible===!1)return;if(T.layers.test(A.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&M===yi)&&(!T.frustumCulled||i.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(b.matrixWorldInverse,T.matrixWorld);const z=e.update(T),X=T.material;if(Array.isArray(X)){const Z=z.groups;for(let Y=0,te=Z.length;Y<te;Y++){const I=Z[Y],$=X[I.materialIndex];if($&&$.visible){const J=x(T,$,w,M);T.onBeforeShadow(t,T,A,b,z,J,I),t.renderBufferDirect(b,null,z,J,T,I),T.onAfterShadow(t,T,A,b,z,J,I)}}}else if(X.visible){const Z=x(T,X,w,M);T.onBeforeShadow(t,T,A,b,z,Z,null),t.renderBufferDirect(b,null,z,Z,T,null),T.onAfterShadow(t,T,A,b,z,Z,null)}}const V=T.children;for(let z=0,X=V.length;z<X;z++)_(V[z],A,b,w,M)}function R(T){T.target.removeEventListener("dispose",R);for(const b in c){const w=c[b],M=T.target.uuid;M in w&&(w[M].dispose(),delete w[M])}}}const $2={[Dd]:Nd,[Id]:Od,[Ld]:Fd,[Ks]:Ud,[Nd]:Dd,[Od]:Id,[Fd]:Ld,[Ud]:Ks};function Z2(t,e){function n(){let O=!1;const de=new lt;let q=null;const ee=new lt(0,0,0,0);return{setMask:function(pe){q!==pe&&!O&&(t.colorMask(pe,pe,pe,pe),q=pe)},setLocked:function(pe){O=pe},setClear:function(pe,he,Oe,Tt,Yt){Yt===!0&&(pe*=Tt,he*=Tt,Oe*=Tt),de.set(pe,he,Oe,Tt),ee.equals(de)===!1&&(t.clearColor(pe,he,Oe,Tt),ee.copy(de))},reset:function(){O=!1,q=null,ee.set(-1,0,0,0)}}}function i(){let O=!1,de=!1,q=null,ee=null,pe=null;return{setReversed:function(he){if(de!==he){const Oe=e.get("EXT_clip_control");de?Oe.clipControlEXT(Oe.LOWER_LEFT_EXT,Oe.ZERO_TO_ONE_EXT):Oe.clipControlEXT(Oe.LOWER_LEFT_EXT,Oe.NEGATIVE_ONE_TO_ONE_EXT);const Tt=pe;pe=null,this.setClear(Tt)}de=he},getReversed:function(){return de},setTest:function(he){he?oe(t.DEPTH_TEST):Ce(t.DEPTH_TEST)},setMask:function(he){q!==he&&!O&&(t.depthMask(he),q=he)},setFunc:function(he){if(de&&(he=$2[he]),ee!==he){switch(he){case Dd:t.depthFunc(t.NEVER);break;case Nd:t.depthFunc(t.ALWAYS);break;case Id:t.depthFunc(t.LESS);break;case Ks:t.depthFunc(t.LEQUAL);break;case Ld:t.depthFunc(t.EQUAL);break;case Ud:t.depthFunc(t.GEQUAL);break;case Od:t.depthFunc(t.GREATER);break;case Fd:t.depthFunc(t.NOTEQUAL);break;default:t.depthFunc(t.LEQUAL)}ee=he}},setLocked:function(he){O=he},setClear:function(he){pe!==he&&(de&&(he=1-he),t.clearDepth(he),pe=he)},reset:function(){O=!1,q=null,ee=null,pe=null,de=!1}}}function r(){let O=!1,de=null,q=null,ee=null,pe=null,he=null,Oe=null,Tt=null,Yt=null;return{setTest:function(it){O||(it?oe(t.STENCIL_TEST):Ce(t.STENCIL_TEST))},setMask:function(it){de!==it&&!O&&(t.stencilMask(it),de=it)},setFunc:function(it,Hn,hi){(q!==it||ee!==Hn||pe!==hi)&&(t.stencilFunc(it,Hn,hi),q=it,ee=Hn,pe=hi)},setOp:function(it,Hn,hi){(he!==it||Oe!==Hn||Tt!==hi)&&(t.stencilOp(it,Hn,hi),he=it,Oe=Hn,Tt=hi)},setLocked:function(it){O=it},setClear:function(it){Yt!==it&&(t.clearStencil(it),Yt=it)},reset:function(){O=!1,de=null,q=null,ee=null,pe=null,he=null,Oe=null,Tt=null,Yt=null}}}const s=new n,a=new i,o=new r,l=new WeakMap,c=new WeakMap;let u={},h={},f=new WeakMap,p=[],v=null,y=!1,m=null,d=null,g=null,x=null,_=null,R=null,T=null,A=new me(0,0,0),b=0,w=!1,M=null,D=null,V=null,z=null,X=null;const Z=t.getParameter(t.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let Y=!1,te=0;const I=t.getParameter(t.VERSION);I.indexOf("WebGL")!==-1?(te=parseFloat(/^WebGL (\d)/.exec(I)[1]),Y=te>=1):I.indexOf("OpenGL ES")!==-1&&(te=parseFloat(/^OpenGL ES (\d)/.exec(I)[1]),Y=te>=2);let $=null,J={};const ae=t.getParameter(t.SCISSOR_BOX),ye=t.getParameter(t.VIEWPORT),Ve=new lt().fromArray(ae),K=new lt().fromArray(ye);function ne(O,de,q,ee){const pe=new Uint8Array(4),he=t.createTexture();t.bindTexture(O,he),t.texParameteri(O,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(O,t.TEXTURE_MAG_FILTER,t.NEAREST);for(let Oe=0;Oe<q;Oe++)O===t.TEXTURE_3D||O===t.TEXTURE_2D_ARRAY?t.texImage3D(de,0,t.RGBA,1,1,ee,0,t.RGBA,t.UNSIGNED_BYTE,pe):t.texImage2D(de+Oe,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,pe);return he}const ce={};ce[t.TEXTURE_2D]=ne(t.TEXTURE_2D,t.TEXTURE_2D,1),ce[t.TEXTURE_CUBE_MAP]=ne(t.TEXTURE_CUBE_MAP,t.TEXTURE_CUBE_MAP_POSITIVE_X,6),ce[t.TEXTURE_2D_ARRAY]=ne(t.TEXTURE_2D_ARRAY,t.TEXTURE_2D_ARRAY,1,1),ce[t.TEXTURE_3D]=ne(t.TEXTURE_3D,t.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),oe(t.DEPTH_TEST),a.setFunc(Ks),Re(!1),Xe(Zp),oe(t.CULL_FACE),U(or);function oe(O){u[O]!==!0&&(t.enable(O),u[O]=!0)}function Ce(O){u[O]!==!1&&(t.disable(O),u[O]=!1)}function Ie(O,de){return h[O]!==de?(t.bindFramebuffer(O,de),h[O]=de,O===t.DRAW_FRAMEBUFFER&&(h[t.FRAMEBUFFER]=de),O===t.FRAMEBUFFER&&(h[t.DRAW_FRAMEBUFFER]=de),!0):!1}function Ue(O,de){let q=p,ee=!1;if(O){q=f.get(de),q===void 0&&(q=[],f.set(de,q));const pe=O.textures;if(q.length!==pe.length||q[0]!==t.COLOR_ATTACHMENT0){for(let he=0,Oe=pe.length;he<Oe;he++)q[he]=t.COLOR_ATTACHMENT0+he;q.length=pe.length,ee=!0}}else q[0]!==t.BACK&&(q[0]=t.BACK,ee=!0);ee&&t.drawBuffers(q)}function dt(O){return v!==O?(t.useProgram(O),v=O,!0):!1}const je={[Dr]:t.FUNC_ADD,[Q_]:t.FUNC_SUBTRACT,[eM]:t.FUNC_REVERSE_SUBTRACT};je[tM]=t.MIN,je[nM]=t.MAX;const Be={[iM]:t.ZERO,[rM]:t.ONE,[sM]:t.SRC_COLOR,[Rd]:t.SRC_ALPHA,[dM]:t.SRC_ALPHA_SATURATE,[cM]:t.DST_COLOR,[oM]:t.DST_ALPHA,[aM]:t.ONE_MINUS_SRC_COLOR,[Pd]:t.ONE_MINUS_SRC_ALPHA,[uM]:t.ONE_MINUS_DST_COLOR,[lM]:t.ONE_MINUS_DST_ALPHA,[hM]:t.CONSTANT_COLOR,[fM]:t.ONE_MINUS_CONSTANT_COLOR,[pM]:t.CONSTANT_ALPHA,[mM]:t.ONE_MINUS_CONSTANT_ALPHA};function U(O,de,q,ee,pe,he,Oe,Tt,Yt,it){if(O===or){y===!0&&(Ce(t.BLEND),y=!1);return}if(y===!1&&(oe(t.BLEND),y=!0),O!==J_){if(O!==m||it!==w){if((d!==Dr||_!==Dr)&&(t.blendEquation(t.FUNC_ADD),d=Dr,_=Dr),it)switch(O){case Ai:t.blendFuncSeparate(t.ONE,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case Bt:t.blendFunc(t.ONE,t.ONE);break;case Jp:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case Qp:t.blendFuncSeparate(t.ZERO,t.SRC_COLOR,t.ZERO,t.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",O);break}else switch(O){case Ai:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case Bt:t.blendFunc(t.SRC_ALPHA,t.ONE);break;case Jp:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case Qp:t.blendFunc(t.ZERO,t.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",O);break}g=null,x=null,R=null,T=null,A.set(0,0,0),b=0,m=O,w=it}return}pe=pe||de,he=he||q,Oe=Oe||ee,(de!==d||pe!==_)&&(t.blendEquationSeparate(je[de],je[pe]),d=de,_=pe),(q!==g||ee!==x||he!==R||Oe!==T)&&(t.blendFuncSeparate(Be[q],Be[ee],Be[he],Be[Oe]),g=q,x=ee,R=he,T=Oe),(Tt.equals(A)===!1||Yt!==b)&&(t.blendColor(Tt.r,Tt.g,Tt.b,Yt),A.copy(Tt),b=Yt),m=O,w=!1}function rn(O,de){O.side===cn?Ce(t.CULL_FACE):oe(t.CULL_FACE);let q=O.side===It;de&&(q=!q),Re(q),O.blending===Ai&&O.transparent===!1?U(or):U(O.blending,O.blendEquation,O.blendSrc,O.blendDst,O.blendEquationAlpha,O.blendSrcAlpha,O.blendDstAlpha,O.blendColor,O.blendAlpha,O.premultipliedAlpha),a.setFunc(O.depthFunc),a.setTest(O.depthTest),a.setMask(O.depthWrite),s.setMask(O.colorWrite);const ee=O.stencilWrite;o.setTest(ee),ee&&(o.setMask(O.stencilWriteMask),o.setFunc(O.stencilFunc,O.stencilRef,O.stencilFuncMask),o.setOp(O.stencilFail,O.stencilZFail,O.stencilZPass)),at(O.polygonOffset,O.polygonOffsetFactor,O.polygonOffsetUnits),O.alphaToCoverage===!0?oe(t.SAMPLE_ALPHA_TO_COVERAGE):Ce(t.SAMPLE_ALPHA_TO_COVERAGE)}function Re(O){M!==O&&(O?t.frontFace(t.CW):t.frontFace(t.CCW),M=O)}function Xe(O){O!==q_?(oe(t.CULL_FACE),O!==D&&(O===Zp?t.cullFace(t.BACK):O===$_?t.cullFace(t.FRONT):t.cullFace(t.FRONT_AND_BACK))):Ce(t.CULL_FACE),D=O}function be(O){O!==V&&(Y&&t.lineWidth(O),V=O)}function at(O,de,q){O?(oe(t.POLYGON_OFFSET_FILL),(z!==de||X!==q)&&(t.polygonOffset(de,q),z=de,X=q)):Ce(t.POLYGON_OFFSET_FILL)}function Ae(O){O?oe(t.SCISSOR_TEST):Ce(t.SCISSOR_TEST)}function C(O){O===void 0&&(O=t.TEXTURE0+Z-1),$!==O&&(t.activeTexture(O),$=O)}function S(O,de,q){q===void 0&&($===null?q=t.TEXTURE0+Z-1:q=$);let ee=J[q];ee===void 0&&(ee={type:void 0,texture:void 0},J[q]=ee),(ee.type!==O||ee.texture!==de)&&($!==q&&(t.activeTexture(q),$=q),t.bindTexture(O,de||ce[O]),ee.type=O,ee.texture=de)}function H(){const O=J[$];O!==void 0&&O.type!==void 0&&(t.bindTexture(O.type,null),O.type=void 0,O.texture=void 0)}function Q(){try{t.compressedTexImage2D.apply(t,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function L(){try{t.compressedTexImage3D.apply(t,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function B(){try{t.texSubImage2D.apply(t,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function ge(){try{t.texSubImage3D.apply(t,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function ue(){try{t.compressedTexSubImage2D.apply(t,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function ve(){try{t.compressedTexSubImage3D.apply(t,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function qe(){try{t.texStorage2D.apply(t,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function re(){try{t.texStorage3D.apply(t,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function _e(){try{t.texImage2D.apply(t,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Pe(){try{t.texImage3D.apply(t,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Ne(O){Ve.equals(O)===!1&&(t.scissor(O.x,O.y,O.z,O.w),Ve.copy(O))}function Me(O){K.equals(O)===!1&&(t.viewport(O.x,O.y,O.z,O.w),K.copy(O))}function Ke(O,de){let q=c.get(de);q===void 0&&(q=new WeakMap,c.set(de,q));let ee=q.get(O);ee===void 0&&(ee=t.getUniformBlockIndex(de,O.name),q.set(O,ee))}function ze(O,de){const ee=c.get(de).get(O);l.get(de)!==ee&&(t.uniformBlockBinding(de,ee,O.__bindingPointIndex),l.set(de,ee))}function ht(){t.disable(t.BLEND),t.disable(t.CULL_FACE),t.disable(t.DEPTH_TEST),t.disable(t.POLYGON_OFFSET_FILL),t.disable(t.SCISSOR_TEST),t.disable(t.STENCIL_TEST),t.disable(t.SAMPLE_ALPHA_TO_COVERAGE),t.blendEquation(t.FUNC_ADD),t.blendFunc(t.ONE,t.ZERO),t.blendFuncSeparate(t.ONE,t.ZERO,t.ONE,t.ZERO),t.blendColor(0,0,0,0),t.colorMask(!0,!0,!0,!0),t.clearColor(0,0,0,0),t.depthMask(!0),t.depthFunc(t.LESS),a.setReversed(!1),t.clearDepth(1),t.stencilMask(4294967295),t.stencilFunc(t.ALWAYS,0,4294967295),t.stencilOp(t.KEEP,t.KEEP,t.KEEP),t.clearStencil(0),t.cullFace(t.BACK),t.frontFace(t.CCW),t.polygonOffset(0,0),t.activeTexture(t.TEXTURE0),t.bindFramebuffer(t.FRAMEBUFFER,null),t.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),t.bindFramebuffer(t.READ_FRAMEBUFFER,null),t.useProgram(null),t.lineWidth(1),t.scissor(0,0,t.canvas.width,t.canvas.height),t.viewport(0,0,t.canvas.width,t.canvas.height),u={},$=null,J={},h={},f=new WeakMap,p=[],v=null,y=!1,m=null,d=null,g=null,x=null,_=null,R=null,T=null,A=new me(0,0,0),b=0,w=!1,M=null,D=null,V=null,z=null,X=null,Ve.set(0,0,t.canvas.width,t.canvas.height),K.set(0,0,t.canvas.width,t.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:oe,disable:Ce,bindFramebuffer:Ie,drawBuffers:Ue,useProgram:dt,setBlending:U,setMaterial:rn,setFlipSided:Re,setCullFace:Xe,setLineWidth:be,setPolygonOffset:at,setScissorTest:Ae,activeTexture:C,bindTexture:S,unbindTexture:H,compressedTexImage2D:Q,compressedTexImage3D:L,texImage2D:_e,texImage3D:Pe,updateUBOMapping:Ke,uniformBlockBinding:ze,texStorage2D:qe,texStorage3D:re,texSubImage2D:B,texSubImage3D:ge,compressedTexSubImage2D:ue,compressedTexSubImage3D:ve,scissor:Ne,viewport:Me,reset:ht}}function Ym(t,e,n,i){const r=J2(i);switch(n){case Uv:return t*e;case Fv:return t*e;case kv:return t*e*2;case xf:return t*e/r.components*r.byteLength;case yf:return t*e/r.components*r.byteLength;case Bv:return t*e*2/r.components*r.byteLength;case _f:return t*e*2/r.components*r.byteLength;case Ov:return t*e*3/r.components*r.byteLength;case Jn:return t*e*4/r.components*r.byteLength;case Mf:return t*e*4/r.components*r.byteLength;case Tl:case Al:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case bl:case Cl:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Gd:case Wd:return Math.max(t,16)*Math.max(e,8)/4;case Hd:case Vd:return Math.max(t,8)*Math.max(e,8)/2;case jd:case Xd:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case Kd:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Yd:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case qd:return Math.floor((t+4)/5)*Math.floor((e+3)/4)*16;case $d:return Math.floor((t+4)/5)*Math.floor((e+4)/5)*16;case Zd:return Math.floor((t+5)/6)*Math.floor((e+4)/5)*16;case Jd:return Math.floor((t+5)/6)*Math.floor((e+5)/6)*16;case Qd:return Math.floor((t+7)/8)*Math.floor((e+4)/5)*16;case eh:return Math.floor((t+7)/8)*Math.floor((e+5)/6)*16;case th:return Math.floor((t+7)/8)*Math.floor((e+7)/8)*16;case nh:return Math.floor((t+9)/10)*Math.floor((e+4)/5)*16;case ih:return Math.floor((t+9)/10)*Math.floor((e+5)/6)*16;case rh:return Math.floor((t+9)/10)*Math.floor((e+7)/8)*16;case sh:return Math.floor((t+9)/10)*Math.floor((e+9)/10)*16;case ah:return Math.floor((t+11)/12)*Math.floor((e+9)/10)*16;case oh:return Math.floor((t+11)/12)*Math.floor((e+11)/12)*16;case Rl:case lh:case ch:return Math.ceil(t/4)*Math.ceil(e/4)*16;case zv:case uh:return Math.ceil(t/4)*Math.ceil(e/4)*8;case dh:case hh:return Math.ceil(t/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${n} format.`)}function J2(t){switch(t){case Ni:case Nv:return{byteLength:1,components:1};case uo:case Iv:case _o:return{byteLength:2,components:1};case gf:case vf:return{byteLength:2,components:4};case Kr:case mf:case li:return{byteLength:4,components:1};case Lv:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${t}.`)}function Q2(t,e,n,i,r,s,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Ge,u=new WeakMap;let h;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(C,S){return p?new OffscreenCanvas(C,S):fo("canvas")}function y(C,S,H){let Q=1;const L=Ae(C);if((L.width>H||L.height>H)&&(Q=H/Math.max(L.width,L.height)),Q<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){const B=Math.floor(Q*L.width),ge=Math.floor(Q*L.height);h===void 0&&(h=v(B,ge));const ue=S?v(B,ge):h;return ue.width=B,ue.height=ge,ue.getContext("2d").drawImage(C,0,0,B,ge),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+L.width+"x"+L.height+") to ("+B+"x"+ge+")."),ue}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+L.width+"x"+L.height+")."),C;return C}function m(C){return C.generateMipmaps}function d(C){t.generateMipmap(C)}function g(C){return C.isWebGLCubeRenderTarget?t.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?t.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?t.TEXTURE_2D_ARRAY:t.TEXTURE_2D}function x(C,S,H,Q,L=!1){if(C!==null){if(t[C]!==void 0)return t[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let B=S;if(S===t.RED&&(H===t.FLOAT&&(B=t.R32F),H===t.HALF_FLOAT&&(B=t.R16F),H===t.UNSIGNED_BYTE&&(B=t.R8)),S===t.RED_INTEGER&&(H===t.UNSIGNED_BYTE&&(B=t.R8UI),H===t.UNSIGNED_SHORT&&(B=t.R16UI),H===t.UNSIGNED_INT&&(B=t.R32UI),H===t.BYTE&&(B=t.R8I),H===t.SHORT&&(B=t.R16I),H===t.INT&&(B=t.R32I)),S===t.RG&&(H===t.FLOAT&&(B=t.RG32F),H===t.HALF_FLOAT&&(B=t.RG16F),H===t.UNSIGNED_BYTE&&(B=t.RG8)),S===t.RG_INTEGER&&(H===t.UNSIGNED_BYTE&&(B=t.RG8UI),H===t.UNSIGNED_SHORT&&(B=t.RG16UI),H===t.UNSIGNED_INT&&(B=t.RG32UI),H===t.BYTE&&(B=t.RG8I),H===t.SHORT&&(B=t.RG16I),H===t.INT&&(B=t.RG32I)),S===t.RGB_INTEGER&&(H===t.UNSIGNED_BYTE&&(B=t.RGB8UI),H===t.UNSIGNED_SHORT&&(B=t.RGB16UI),H===t.UNSIGNED_INT&&(B=t.RGB32UI),H===t.BYTE&&(B=t.RGB8I),H===t.SHORT&&(B=t.RGB16I),H===t.INT&&(B=t.RGB32I)),S===t.RGBA_INTEGER&&(H===t.UNSIGNED_BYTE&&(B=t.RGBA8UI),H===t.UNSIGNED_SHORT&&(B=t.RGBA16UI),H===t.UNSIGNED_INT&&(B=t.RGBA32UI),H===t.BYTE&&(B=t.RGBA8I),H===t.SHORT&&(B=t.RGBA16I),H===t.INT&&(B=t.RGBA32I)),S===t.RGB&&H===t.UNSIGNED_INT_5_9_9_9_REV&&(B=t.RGB9_E5),S===t.RGBA){const ge=L?Ec:$e.getTransfer(Q);H===t.FLOAT&&(B=t.RGBA32F),H===t.HALF_FLOAT&&(B=t.RGBA16F),H===t.UNSIGNED_BYTE&&(B=ge===ot?t.SRGB8_ALPHA8:t.RGBA8),H===t.UNSIGNED_SHORT_4_4_4_4&&(B=t.RGBA4),H===t.UNSIGNED_SHORT_5_5_5_1&&(B=t.RGB5_A1)}return(B===t.R16F||B===t.R32F||B===t.RG16F||B===t.RG32F||B===t.RGBA16F||B===t.RGBA32F)&&e.get("EXT_color_buffer_float"),B}function _(C,S){let H;return C?S===null||S===Kr||S===$s?H=t.DEPTH24_STENCIL8:S===li?H=t.DEPTH32F_STENCIL8:S===uo&&(H=t.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===Kr||S===$s?H=t.DEPTH_COMPONENT24:S===li?H=t.DEPTH_COMPONENT32F:S===uo&&(H=t.DEPTH_COMPONENT16),H}function R(C,S){return m(C)===!0||C.isFramebufferTexture&&C.minFilter!==bn&&C.minFilter!==gn?Math.log2(Math.max(S.width,S.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?S.mipmaps.length:1}function T(C){const S=C.target;S.removeEventListener("dispose",T),b(S),S.isVideoTexture&&u.delete(S)}function A(C){const S=C.target;S.removeEventListener("dispose",A),M(S)}function b(C){const S=i.get(C);if(S.__webglInit===void 0)return;const H=C.source,Q=f.get(H);if(Q){const L=Q[S.__cacheKey];L.usedTimes--,L.usedTimes===0&&w(C),Object.keys(Q).length===0&&f.delete(H)}i.remove(C)}function w(C){const S=i.get(C);t.deleteTexture(S.__webglTexture);const H=C.source,Q=f.get(H);delete Q[S.__cacheKey],a.memory.textures--}function M(C){const S=i.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),i.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let Q=0;Q<6;Q++){if(Array.isArray(S.__webglFramebuffer[Q]))for(let L=0;L<S.__webglFramebuffer[Q].length;L++)t.deleteFramebuffer(S.__webglFramebuffer[Q][L]);else t.deleteFramebuffer(S.__webglFramebuffer[Q]);S.__webglDepthbuffer&&t.deleteRenderbuffer(S.__webglDepthbuffer[Q])}else{if(Array.isArray(S.__webglFramebuffer))for(let Q=0;Q<S.__webglFramebuffer.length;Q++)t.deleteFramebuffer(S.__webglFramebuffer[Q]);else t.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&t.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&t.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let Q=0;Q<S.__webglColorRenderbuffer.length;Q++)S.__webglColorRenderbuffer[Q]&&t.deleteRenderbuffer(S.__webglColorRenderbuffer[Q]);S.__webglDepthRenderbuffer&&t.deleteRenderbuffer(S.__webglDepthRenderbuffer)}const H=C.textures;for(let Q=0,L=H.length;Q<L;Q++){const B=i.get(H[Q]);B.__webglTexture&&(t.deleteTexture(B.__webglTexture),a.memory.textures--),i.remove(H[Q])}i.remove(C)}let D=0;function V(){D=0}function z(){const C=D;return C>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+r.maxTextures),D+=1,C}function X(C){const S=[];return S.push(C.wrapS),S.push(C.wrapT),S.push(C.wrapR||0),S.push(C.magFilter),S.push(C.minFilter),S.push(C.anisotropy),S.push(C.internalFormat),S.push(C.format),S.push(C.type),S.push(C.generateMipmaps),S.push(C.premultiplyAlpha),S.push(C.flipY),S.push(C.unpackAlignment),S.push(C.colorSpace),S.join()}function Z(C,S){const H=i.get(C);if(C.isVideoTexture&&be(C),C.isRenderTargetTexture===!1&&C.version>0&&H.__version!==C.version){const Q=C.image;if(Q===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Q.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{K(H,C,S);return}}n.bindTexture(t.TEXTURE_2D,H.__webglTexture,t.TEXTURE0+S)}function Y(C,S){const H=i.get(C);if(C.version>0&&H.__version!==C.version){K(H,C,S);return}n.bindTexture(t.TEXTURE_2D_ARRAY,H.__webglTexture,t.TEXTURE0+S)}function te(C,S){const H=i.get(C);if(C.version>0&&H.__version!==C.version){K(H,C,S);return}n.bindTexture(t.TEXTURE_3D,H.__webglTexture,t.TEXTURE0+S)}function I(C,S){const H=i.get(C);if(C.version>0&&H.__version!==C.version){ne(H,C,S);return}n.bindTexture(t.TEXTURE_CUBE_MAP,H.__webglTexture,t.TEXTURE0+S)}const $={[Mt]:t.REPEAT,[Qe]:t.CLAMP_TO_EDGE,[zd]:t.MIRRORED_REPEAT},J={[bn]:t.NEAREST,[EM]:t.NEAREST_MIPMAP_NEAREST,[Ho]:t.NEAREST_MIPMAP_LINEAR,[gn]:t.LINEAR,[tu]:t.LINEAR_MIPMAP_NEAREST,[Zn]:t.LINEAR_MIPMAP_LINEAR},ae={[CM]:t.NEVER,[LM]:t.ALWAYS,[RM]:t.LESS,[Gv]:t.LEQUAL,[PM]:t.EQUAL,[IM]:t.GEQUAL,[DM]:t.GREATER,[NM]:t.NOTEQUAL};function ye(C,S){if(S.type===li&&e.has("OES_texture_float_linear")===!1&&(S.magFilter===gn||S.magFilter===tu||S.magFilter===Ho||S.magFilter===Zn||S.minFilter===gn||S.minFilter===tu||S.minFilter===Ho||S.minFilter===Zn)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),t.texParameteri(C,t.TEXTURE_WRAP_S,$[S.wrapS]),t.texParameteri(C,t.TEXTURE_WRAP_T,$[S.wrapT]),(C===t.TEXTURE_3D||C===t.TEXTURE_2D_ARRAY)&&t.texParameteri(C,t.TEXTURE_WRAP_R,$[S.wrapR]),t.texParameteri(C,t.TEXTURE_MAG_FILTER,J[S.magFilter]),t.texParameteri(C,t.TEXTURE_MIN_FILTER,J[S.minFilter]),S.compareFunction&&(t.texParameteri(C,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(C,t.TEXTURE_COMPARE_FUNC,ae[S.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===bn||S.minFilter!==Ho&&S.minFilter!==Zn||S.type===li&&e.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||i.get(S).__currentAnisotropy){const H=e.get("EXT_texture_filter_anisotropic");t.texParameterf(C,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,r.getMaxAnisotropy())),i.get(S).__currentAnisotropy=S.anisotropy}}}function Ve(C,S){let H=!1;C.__webglInit===void 0&&(C.__webglInit=!0,S.addEventListener("dispose",T));const Q=S.source;let L=f.get(Q);L===void 0&&(L={},f.set(Q,L));const B=X(S);if(B!==C.__cacheKey){L[B]===void 0&&(L[B]={texture:t.createTexture(),usedTimes:0},a.memory.textures++,H=!0),L[B].usedTimes++;const ge=L[C.__cacheKey];ge!==void 0&&(L[C.__cacheKey].usedTimes--,ge.usedTimes===0&&w(S)),C.__cacheKey=B,C.__webglTexture=L[B].texture}return H}function K(C,S,H){let Q=t.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(Q=t.TEXTURE_2D_ARRAY),S.isData3DTexture&&(Q=t.TEXTURE_3D);const L=Ve(C,S),B=S.source;n.bindTexture(Q,C.__webglTexture,t.TEXTURE0+H);const ge=i.get(B);if(B.version!==ge.__version||L===!0){n.activeTexture(t.TEXTURE0+H);const ue=$e.getPrimaries($e.workingColorSpace),ve=S.colorSpace===Un?null:$e.getPrimaries(S.colorSpace),qe=S.colorSpace===Un||ue===ve?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,S.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,S.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,qe);let re=y(S.image,!1,r.maxTextureSize);re=at(S,re);const _e=s.convert(S.format,S.colorSpace),Pe=s.convert(S.type);let Ne=x(S.internalFormat,_e,Pe,S.colorSpace,S.isVideoTexture);ye(Q,S);let Me;const Ke=S.mipmaps,ze=S.isVideoTexture!==!0,ht=ge.__version===void 0||L===!0,O=B.dataReady,de=R(S,re);if(S.isDepthTexture)Ne=_(S.format===Zs,S.type),ht&&(ze?n.texStorage2D(t.TEXTURE_2D,1,Ne,re.width,re.height):n.texImage2D(t.TEXTURE_2D,0,Ne,re.width,re.height,0,_e,Pe,null));else if(S.isDataTexture)if(Ke.length>0){ze&&ht&&n.texStorage2D(t.TEXTURE_2D,de,Ne,Ke[0].width,Ke[0].height);for(let q=0,ee=Ke.length;q<ee;q++)Me=Ke[q],ze?O&&n.texSubImage2D(t.TEXTURE_2D,q,0,0,Me.width,Me.height,_e,Pe,Me.data):n.texImage2D(t.TEXTURE_2D,q,Ne,Me.width,Me.height,0,_e,Pe,Me.data);S.generateMipmaps=!1}else ze?(ht&&n.texStorage2D(t.TEXTURE_2D,de,Ne,re.width,re.height),O&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,re.width,re.height,_e,Pe,re.data)):n.texImage2D(t.TEXTURE_2D,0,Ne,re.width,re.height,0,_e,Pe,re.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){ze&&ht&&n.texStorage3D(t.TEXTURE_2D_ARRAY,de,Ne,Ke[0].width,Ke[0].height,re.depth);for(let q=0,ee=Ke.length;q<ee;q++)if(Me=Ke[q],S.format!==Jn)if(_e!==null)if(ze){if(O)if(S.layerUpdates.size>0){const pe=Ym(Me.width,Me.height,S.format,S.type);for(const he of S.layerUpdates){const Oe=Me.data.subarray(he*pe/Me.data.BYTES_PER_ELEMENT,(he+1)*pe/Me.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,q,0,0,he,Me.width,Me.height,1,_e,Oe)}S.clearLayerUpdates()}else n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,q,0,0,0,Me.width,Me.height,re.depth,_e,Me.data)}else n.compressedTexImage3D(t.TEXTURE_2D_ARRAY,q,Ne,Me.width,Me.height,re.depth,0,Me.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else ze?O&&n.texSubImage3D(t.TEXTURE_2D_ARRAY,q,0,0,0,Me.width,Me.height,re.depth,_e,Pe,Me.data):n.texImage3D(t.TEXTURE_2D_ARRAY,q,Ne,Me.width,Me.height,re.depth,0,_e,Pe,Me.data)}else{ze&&ht&&n.texStorage2D(t.TEXTURE_2D,de,Ne,Ke[0].width,Ke[0].height);for(let q=0,ee=Ke.length;q<ee;q++)Me=Ke[q],S.format!==Jn?_e!==null?ze?O&&n.compressedTexSubImage2D(t.TEXTURE_2D,q,0,0,Me.width,Me.height,_e,Me.data):n.compressedTexImage2D(t.TEXTURE_2D,q,Ne,Me.width,Me.height,0,Me.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ze?O&&n.texSubImage2D(t.TEXTURE_2D,q,0,0,Me.width,Me.height,_e,Pe,Me.data):n.texImage2D(t.TEXTURE_2D,q,Ne,Me.width,Me.height,0,_e,Pe,Me.data)}else if(S.isDataArrayTexture)if(ze){if(ht&&n.texStorage3D(t.TEXTURE_2D_ARRAY,de,Ne,re.width,re.height,re.depth),O)if(S.layerUpdates.size>0){const q=Ym(re.width,re.height,S.format,S.type);for(const ee of S.layerUpdates){const pe=re.data.subarray(ee*q/re.data.BYTES_PER_ELEMENT,(ee+1)*q/re.data.BYTES_PER_ELEMENT);n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,ee,re.width,re.height,1,_e,Pe,pe)}S.clearLayerUpdates()}else n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,0,re.width,re.height,re.depth,_e,Pe,re.data)}else n.texImage3D(t.TEXTURE_2D_ARRAY,0,Ne,re.width,re.height,re.depth,0,_e,Pe,re.data);else if(S.isData3DTexture)ze?(ht&&n.texStorage3D(t.TEXTURE_3D,de,Ne,re.width,re.height,re.depth),O&&n.texSubImage3D(t.TEXTURE_3D,0,0,0,0,re.width,re.height,re.depth,_e,Pe,re.data)):n.texImage3D(t.TEXTURE_3D,0,Ne,re.width,re.height,re.depth,0,_e,Pe,re.data);else if(S.isFramebufferTexture){if(ht)if(ze)n.texStorage2D(t.TEXTURE_2D,de,Ne,re.width,re.height);else{let q=re.width,ee=re.height;for(let pe=0;pe<de;pe++)n.texImage2D(t.TEXTURE_2D,pe,Ne,q,ee,0,_e,Pe,null),q>>=1,ee>>=1}}else if(Ke.length>0){if(ze&&ht){const q=Ae(Ke[0]);n.texStorage2D(t.TEXTURE_2D,de,Ne,q.width,q.height)}for(let q=0,ee=Ke.length;q<ee;q++)Me=Ke[q],ze?O&&n.texSubImage2D(t.TEXTURE_2D,q,0,0,_e,Pe,Me):n.texImage2D(t.TEXTURE_2D,q,Ne,_e,Pe,Me);S.generateMipmaps=!1}else if(ze){if(ht){const q=Ae(re);n.texStorage2D(t.TEXTURE_2D,de,Ne,q.width,q.height)}O&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,_e,Pe,re)}else n.texImage2D(t.TEXTURE_2D,0,Ne,_e,Pe,re);m(S)&&d(Q),ge.__version=B.version,S.onUpdate&&S.onUpdate(S)}C.__version=S.version}function ne(C,S,H){if(S.image.length!==6)return;const Q=Ve(C,S),L=S.source;n.bindTexture(t.TEXTURE_CUBE_MAP,C.__webglTexture,t.TEXTURE0+H);const B=i.get(L);if(L.version!==B.__version||Q===!0){n.activeTexture(t.TEXTURE0+H);const ge=$e.getPrimaries($e.workingColorSpace),ue=S.colorSpace===Un?null:$e.getPrimaries(S.colorSpace),ve=S.colorSpace===Un||ge===ue?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,S.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,S.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,ve);const qe=S.isCompressedTexture||S.image[0].isCompressedTexture,re=S.image[0]&&S.image[0].isDataTexture,_e=[];for(let ee=0;ee<6;ee++)!qe&&!re?_e[ee]=y(S.image[ee],!0,r.maxCubemapSize):_e[ee]=re?S.image[ee].image:S.image[ee],_e[ee]=at(S,_e[ee]);const Pe=_e[0],Ne=s.convert(S.format,S.colorSpace),Me=s.convert(S.type),Ke=x(S.internalFormat,Ne,Me,S.colorSpace),ze=S.isVideoTexture!==!0,ht=B.__version===void 0||Q===!0,O=L.dataReady;let de=R(S,Pe);ye(t.TEXTURE_CUBE_MAP,S);let q;if(qe){ze&&ht&&n.texStorage2D(t.TEXTURE_CUBE_MAP,de,Ke,Pe.width,Pe.height);for(let ee=0;ee<6;ee++){q=_e[ee].mipmaps;for(let pe=0;pe<q.length;pe++){const he=q[pe];S.format!==Jn?Ne!==null?ze?O&&n.compressedTexSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,pe,0,0,he.width,he.height,Ne,he.data):n.compressedTexImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,pe,Ke,he.width,he.height,0,he.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):ze?O&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,pe,0,0,he.width,he.height,Ne,Me,he.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,pe,Ke,he.width,he.height,0,Ne,Me,he.data)}}}else{if(q=S.mipmaps,ze&&ht){q.length>0&&de++;const ee=Ae(_e[0]);n.texStorage2D(t.TEXTURE_CUBE_MAP,de,Ke,ee.width,ee.height)}for(let ee=0;ee<6;ee++)if(re){ze?O&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,0,0,_e[ee].width,_e[ee].height,Ne,Me,_e[ee].data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,Ke,_e[ee].width,_e[ee].height,0,Ne,Me,_e[ee].data);for(let pe=0;pe<q.length;pe++){const Oe=q[pe].image[ee].image;ze?O&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,pe+1,0,0,Oe.width,Oe.height,Ne,Me,Oe.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,pe+1,Ke,Oe.width,Oe.height,0,Ne,Me,Oe.data)}}else{ze?O&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,0,0,Ne,Me,_e[ee]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,Ke,Ne,Me,_e[ee]);for(let pe=0;pe<q.length;pe++){const he=q[pe];ze?O&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,pe+1,0,0,Ne,Me,he.image[ee]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,pe+1,Ke,Ne,Me,he.image[ee])}}}m(S)&&d(t.TEXTURE_CUBE_MAP),B.__version=L.version,S.onUpdate&&S.onUpdate(S)}C.__version=S.version}function ce(C,S,H,Q,L,B){const ge=s.convert(H.format,H.colorSpace),ue=s.convert(H.type),ve=x(H.internalFormat,ge,ue,H.colorSpace),qe=i.get(S),re=i.get(H);if(re.__renderTarget=S,!qe.__hasExternalTextures){const _e=Math.max(1,S.width>>B),Pe=Math.max(1,S.height>>B);L===t.TEXTURE_3D||L===t.TEXTURE_2D_ARRAY?n.texImage3D(L,B,ve,_e,Pe,S.depth,0,ge,ue,null):n.texImage2D(L,B,ve,_e,Pe,0,ge,ue,null)}n.bindFramebuffer(t.FRAMEBUFFER,C),Xe(S)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,Q,L,re.__webglTexture,0,Re(S)):(L===t.TEXTURE_2D||L>=t.TEXTURE_CUBE_MAP_POSITIVE_X&&L<=t.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&t.framebufferTexture2D(t.FRAMEBUFFER,Q,L,re.__webglTexture,B),n.bindFramebuffer(t.FRAMEBUFFER,null)}function oe(C,S,H){if(t.bindRenderbuffer(t.RENDERBUFFER,C),S.depthBuffer){const Q=S.depthTexture,L=Q&&Q.isDepthTexture?Q.type:null,B=_(S.stencilBuffer,L),ge=S.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,ue=Re(S);Xe(S)?o.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,ue,B,S.width,S.height):H?t.renderbufferStorageMultisample(t.RENDERBUFFER,ue,B,S.width,S.height):t.renderbufferStorage(t.RENDERBUFFER,B,S.width,S.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,ge,t.RENDERBUFFER,C)}else{const Q=S.textures;for(let L=0;L<Q.length;L++){const B=Q[L],ge=s.convert(B.format,B.colorSpace),ue=s.convert(B.type),ve=x(B.internalFormat,ge,ue,B.colorSpace),qe=Re(S);H&&Xe(S)===!1?t.renderbufferStorageMultisample(t.RENDERBUFFER,qe,ve,S.width,S.height):Xe(S)?o.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,qe,ve,S.width,S.height):t.renderbufferStorage(t.RENDERBUFFER,ve,S.width,S.height)}}t.bindRenderbuffer(t.RENDERBUFFER,null)}function Ce(C,S){if(S&&S.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(n.bindFramebuffer(t.FRAMEBUFFER,C),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const Q=i.get(S.depthTexture);Q.__renderTarget=S,(!Q.__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),Z(S.depthTexture,0);const L=Q.__webglTexture,B=Re(S);if(S.depthTexture.format===ks)Xe(S)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,L,0,B):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,L,0);else if(S.depthTexture.format===Zs)Xe(S)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,L,0,B):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,L,0);else throw new Error("Unknown depthTexture format")}function Ie(C){const S=i.get(C),H=C.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==C.depthTexture){const Q=C.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),Q){const L=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,Q.removeEventListener("dispose",L)};Q.addEventListener("dispose",L),S.__depthDisposeCallback=L}S.__boundDepthTexture=Q}if(C.depthTexture&&!S.__autoAllocateDepthBuffer){if(H)throw new Error("target.depthTexture not supported in Cube render targets");Ce(S.__webglFramebuffer,C)}else if(H){S.__webglDepthbuffer=[];for(let Q=0;Q<6;Q++)if(n.bindFramebuffer(t.FRAMEBUFFER,S.__webglFramebuffer[Q]),S.__webglDepthbuffer[Q]===void 0)S.__webglDepthbuffer[Q]=t.createRenderbuffer(),oe(S.__webglDepthbuffer[Q],C,!1);else{const L=C.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,B=S.__webglDepthbuffer[Q];t.bindRenderbuffer(t.RENDERBUFFER,B),t.framebufferRenderbuffer(t.FRAMEBUFFER,L,t.RENDERBUFFER,B)}}else if(n.bindFramebuffer(t.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=t.createRenderbuffer(),oe(S.__webglDepthbuffer,C,!1);else{const Q=C.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,L=S.__webglDepthbuffer;t.bindRenderbuffer(t.RENDERBUFFER,L),t.framebufferRenderbuffer(t.FRAMEBUFFER,Q,t.RENDERBUFFER,L)}n.bindFramebuffer(t.FRAMEBUFFER,null)}function Ue(C,S,H){const Q=i.get(C);S!==void 0&&ce(Q.__webglFramebuffer,C,C.texture,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,0),H!==void 0&&Ie(C)}function dt(C){const S=C.texture,H=i.get(C),Q=i.get(S);C.addEventListener("dispose",A);const L=C.textures,B=C.isWebGLCubeRenderTarget===!0,ge=L.length>1;if(ge||(Q.__webglTexture===void 0&&(Q.__webglTexture=t.createTexture()),Q.__version=S.version,a.memory.textures++),B){H.__webglFramebuffer=[];for(let ue=0;ue<6;ue++)if(S.mipmaps&&S.mipmaps.length>0){H.__webglFramebuffer[ue]=[];for(let ve=0;ve<S.mipmaps.length;ve++)H.__webglFramebuffer[ue][ve]=t.createFramebuffer()}else H.__webglFramebuffer[ue]=t.createFramebuffer()}else{if(S.mipmaps&&S.mipmaps.length>0){H.__webglFramebuffer=[];for(let ue=0;ue<S.mipmaps.length;ue++)H.__webglFramebuffer[ue]=t.createFramebuffer()}else H.__webglFramebuffer=t.createFramebuffer();if(ge)for(let ue=0,ve=L.length;ue<ve;ue++){const qe=i.get(L[ue]);qe.__webglTexture===void 0&&(qe.__webglTexture=t.createTexture(),a.memory.textures++)}if(C.samples>0&&Xe(C)===!1){H.__webglMultisampledFramebuffer=t.createFramebuffer(),H.__webglColorRenderbuffer=[],n.bindFramebuffer(t.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let ue=0;ue<L.length;ue++){const ve=L[ue];H.__webglColorRenderbuffer[ue]=t.createRenderbuffer(),t.bindRenderbuffer(t.RENDERBUFFER,H.__webglColorRenderbuffer[ue]);const qe=s.convert(ve.format,ve.colorSpace),re=s.convert(ve.type),_e=x(ve.internalFormat,qe,re,ve.colorSpace,C.isXRRenderTarget===!0),Pe=Re(C);t.renderbufferStorageMultisample(t.RENDERBUFFER,Pe,_e,C.width,C.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+ue,t.RENDERBUFFER,H.__webglColorRenderbuffer[ue])}t.bindRenderbuffer(t.RENDERBUFFER,null),C.depthBuffer&&(H.__webglDepthRenderbuffer=t.createRenderbuffer(),oe(H.__webglDepthRenderbuffer,C,!0)),n.bindFramebuffer(t.FRAMEBUFFER,null)}}if(B){n.bindTexture(t.TEXTURE_CUBE_MAP,Q.__webglTexture),ye(t.TEXTURE_CUBE_MAP,S);for(let ue=0;ue<6;ue++)if(S.mipmaps&&S.mipmaps.length>0)for(let ve=0;ve<S.mipmaps.length;ve++)ce(H.__webglFramebuffer[ue][ve],C,S,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+ue,ve);else ce(H.__webglFramebuffer[ue],C,S,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+ue,0);m(S)&&d(t.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(ge){for(let ue=0,ve=L.length;ue<ve;ue++){const qe=L[ue],re=i.get(qe);n.bindTexture(t.TEXTURE_2D,re.__webglTexture),ye(t.TEXTURE_2D,qe),ce(H.__webglFramebuffer,C,qe,t.COLOR_ATTACHMENT0+ue,t.TEXTURE_2D,0),m(qe)&&d(t.TEXTURE_2D)}n.unbindTexture()}else{let ue=t.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(ue=C.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(ue,Q.__webglTexture),ye(ue,S),S.mipmaps&&S.mipmaps.length>0)for(let ve=0;ve<S.mipmaps.length;ve++)ce(H.__webglFramebuffer[ve],C,S,t.COLOR_ATTACHMENT0,ue,ve);else ce(H.__webglFramebuffer,C,S,t.COLOR_ATTACHMENT0,ue,0);m(S)&&d(ue),n.unbindTexture()}C.depthBuffer&&Ie(C)}function je(C){const S=C.textures;for(let H=0,Q=S.length;H<Q;H++){const L=S[H];if(m(L)){const B=g(C),ge=i.get(L).__webglTexture;n.bindTexture(B,ge),d(B),n.unbindTexture()}}}const Be=[],U=[];function rn(C){if(C.samples>0){if(Xe(C)===!1){const S=C.textures,H=C.width,Q=C.height;let L=t.COLOR_BUFFER_BIT;const B=C.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,ge=i.get(C),ue=S.length>1;if(ue)for(let ve=0;ve<S.length;ve++)n.bindFramebuffer(t.FRAMEBUFFER,ge.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+ve,t.RENDERBUFFER,null),n.bindFramebuffer(t.FRAMEBUFFER,ge.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+ve,t.TEXTURE_2D,null,0);n.bindFramebuffer(t.READ_FRAMEBUFFER,ge.__webglMultisampledFramebuffer),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,ge.__webglFramebuffer);for(let ve=0;ve<S.length;ve++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(L|=t.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(L|=t.STENCIL_BUFFER_BIT)),ue){t.framebufferRenderbuffer(t.READ_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.RENDERBUFFER,ge.__webglColorRenderbuffer[ve]);const qe=i.get(S[ve]).__webglTexture;t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,qe,0)}t.blitFramebuffer(0,0,H,Q,0,0,H,Q,L,t.NEAREST),l===!0&&(Be.length=0,U.length=0,Be.push(t.COLOR_ATTACHMENT0+ve),C.depthBuffer&&C.resolveDepthBuffer===!1&&(Be.push(B),U.push(B),t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,U)),t.invalidateFramebuffer(t.READ_FRAMEBUFFER,Be))}if(n.bindFramebuffer(t.READ_FRAMEBUFFER,null),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),ue)for(let ve=0;ve<S.length;ve++){n.bindFramebuffer(t.FRAMEBUFFER,ge.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+ve,t.RENDERBUFFER,ge.__webglColorRenderbuffer[ve]);const qe=i.get(S[ve]).__webglTexture;n.bindFramebuffer(t.FRAMEBUFFER,ge.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+ve,t.TEXTURE_2D,qe,0)}n.bindFramebuffer(t.DRAW_FRAMEBUFFER,ge.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&l){const S=C.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,[S])}}}function Re(C){return Math.min(r.maxSamples,C.samples)}function Xe(C){const S=i.get(C);return C.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function be(C){const S=a.render.frame;u.get(C)!==S&&(u.set(C,S),C.update())}function at(C,S){const H=C.colorSpace,Q=C.format,L=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||H!==ia&&H!==Un&&($e.getTransfer(H)===ot?(Q!==Jn||L!==Ni)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",H)),S}function Ae(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(c.width=C.naturalWidth||C.width,c.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(c.width=C.displayWidth,c.height=C.displayHeight):(c.width=C.width,c.height=C.height),c}this.allocateTextureUnit=z,this.resetTextureUnits=V,this.setTexture2D=Z,this.setTexture2DArray=Y,this.setTexture3D=te,this.setTextureCube=I,this.rebindTextures=Ue,this.setupRenderTarget=dt,this.updateRenderTargetMipmap=je,this.updateMultisampleRenderTarget=rn,this.setupDepthRenderbuffer=Ie,this.setupFrameBufferTexture=ce,this.useMultisampledRTT=Xe}function eT(t,e){function n(i,r=Un){let s;const a=$e.getTransfer(r);if(i===Ni)return t.UNSIGNED_BYTE;if(i===gf)return t.UNSIGNED_SHORT_4_4_4_4;if(i===vf)return t.UNSIGNED_SHORT_5_5_5_1;if(i===Lv)return t.UNSIGNED_INT_5_9_9_9_REV;if(i===Nv)return t.BYTE;if(i===Iv)return t.SHORT;if(i===uo)return t.UNSIGNED_SHORT;if(i===mf)return t.INT;if(i===Kr)return t.UNSIGNED_INT;if(i===li)return t.FLOAT;if(i===_o)return t.HALF_FLOAT;if(i===Uv)return t.ALPHA;if(i===Ov)return t.RGB;if(i===Jn)return t.RGBA;if(i===Fv)return t.LUMINANCE;if(i===kv)return t.LUMINANCE_ALPHA;if(i===ks)return t.DEPTH_COMPONENT;if(i===Zs)return t.DEPTH_STENCIL;if(i===xf)return t.RED;if(i===yf)return t.RED_INTEGER;if(i===Bv)return t.RG;if(i===_f)return t.RG_INTEGER;if(i===Mf)return t.RGBA_INTEGER;if(i===Tl||i===Al||i===bl||i===Cl)if(a===ot)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===Tl)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Al)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===bl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Cl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===Tl)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Al)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===bl)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Cl)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Hd||i===Gd||i===Vd||i===Wd)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===Hd)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Gd)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Vd)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Wd)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===jd||i===Xd||i===Kd)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===jd||i===Xd)return a===ot?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===Kd)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Yd||i===qd||i===$d||i===Zd||i===Jd||i===Qd||i===eh||i===th||i===nh||i===ih||i===rh||i===sh||i===ah||i===oh)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===Yd)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===qd)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===$d)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Zd)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Jd)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Qd)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===eh)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===th)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===nh)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===ih)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===rh)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===sh)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===ah)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===oh)return a===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Rl||i===lh||i===ch)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===Rl)return a===ot?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===lh)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===ch)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===zv||i===uh||i===dh||i===hh)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===Rl)return s.COMPRESSED_RED_RGTC1_EXT;if(i===uh)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===dh)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===hh)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===$s?t.UNSIGNED_INT_24_8:t[i]!==void 0?t[i]:null}return{convert:n}}class tT extends En{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Wt extends Xt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const nT={type:"move"};class Cu{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Wt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Wt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Wt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const n=this._hand;if(n)for(const i of e.hand.values())this._getHandJoint(n,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,n,i){let r=null,s=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&n.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const y of e.hand.values()){const m=n.getJointPose(y,i),d=this._getHandJoint(c,y);m!==null&&(d.matrix.fromArray(m.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=m.radius),d.visible=m!==null}const u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],f=u.position.distanceTo(h.position),p=.02,v=.005;c.inputState.pinching&&f>p+v?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=p-v&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=n.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(r=n.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(nT)))}return o!==null&&(o.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,n){if(e.joints[n.jointName]===void 0){const i=new Wt;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[n.jointName]=i,e.add(i)}return e.joints[n.jointName]}}const iT=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,rT=`
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

}`;class sT{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,n,i){if(this.texture===null){const r=new Ht,s=e.properties.get(r);s.__webglTexture=n.texture,(n.depthNear!=i.depthNear||n.depthFar!=i.depthFar)&&(this.depthNear=n.depthNear,this.depthFar=n.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){const n=e.cameras[0].viewport,i=new ut({vertexShader:iT,fragmentShader:rT,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new et(new fr(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class aT extends ra{constructor(e,n){super();const i=this;let r=null,s=1,a=null,o="local-floor",l=1,c=null,u=null,h=null,f=null,p=null,v=null;const y=new sT,m=n.getContextAttributes();let d=null,g=null;const x=[],_=[],R=new Ge;let T=null;const A=new En;A.viewport=new lt;const b=new En;b.viewport=new lt;const w=[A,b],M=new tT;let D=null,V=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(K){let ne=x[K];return ne===void 0&&(ne=new Cu,x[K]=ne),ne.getTargetRaySpace()},this.getControllerGrip=function(K){let ne=x[K];return ne===void 0&&(ne=new Cu,x[K]=ne),ne.getGripSpace()},this.getHand=function(K){let ne=x[K];return ne===void 0&&(ne=new Cu,x[K]=ne),ne.getHandSpace()};function z(K){const ne=_.indexOf(K.inputSource);if(ne===-1)return;const ce=x[ne];ce!==void 0&&(ce.update(K.inputSource,K.frame,c||a),ce.dispatchEvent({type:K.type,data:K.inputSource}))}function X(){r.removeEventListener("select",z),r.removeEventListener("selectstart",z),r.removeEventListener("selectend",z),r.removeEventListener("squeeze",z),r.removeEventListener("squeezestart",z),r.removeEventListener("squeezeend",z),r.removeEventListener("end",X),r.removeEventListener("inputsourceschange",Z);for(let K=0;K<x.length;K++){const ne=_[K];ne!==null&&(_[K]=null,x[K].disconnect(ne))}D=null,V=null,y.reset(),e.setRenderTarget(d),p=null,f=null,h=null,r=null,g=null,Ve.stop(),i.isPresenting=!1,e.setPixelRatio(T),e.setSize(R.width,R.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(K){s=K,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(K){o=K,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(K){c=K},this.getBaseLayer=function(){return f!==null?f:p},this.getBinding=function(){return h},this.getFrame=function(){return v},this.getSession=function(){return r},this.setSession=async function(K){if(r=K,r!==null){if(d=e.getRenderTarget(),r.addEventListener("select",z),r.addEventListener("selectstart",z),r.addEventListener("selectend",z),r.addEventListener("squeeze",z),r.addEventListener("squeezestart",z),r.addEventListener("squeezeend",z),r.addEventListener("end",X),r.addEventListener("inputsourceschange",Z),m.xrCompatible!==!0&&await n.makeXRCompatible(),T=e.getPixelRatio(),e.getSize(R),r.renderState.layers===void 0){const ne={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(r,n,ne),r.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),g=new Yr(p.framebufferWidth,p.framebufferHeight,{format:Jn,type:Ni,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil})}else{let ne=null,ce=null,oe=null;m.depth&&(oe=m.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,ne=m.stencil?Zs:ks,ce=m.stencil?$s:Kr);const Ce={colorFormat:n.RGBA8,depthFormat:oe,scaleFactor:s};h=new XRWebGLBinding(r,n),f=h.createProjectionLayer(Ce),r.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),g=new Yr(f.textureWidth,f.textureHeight,{format:Jn,type:Ni,depthTexture:new Qv(f.textureWidth,f.textureHeight,ce,void 0,void 0,void 0,void 0,void 0,void 0,ne),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1})}g.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await r.requestReferenceSpace(o),Ve.setContext(r),Ve.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return y.getDepthTexture()};function Z(K){for(let ne=0;ne<K.removed.length;ne++){const ce=K.removed[ne],oe=_.indexOf(ce);oe>=0&&(_[oe]=null,x[oe].disconnect(ce))}for(let ne=0;ne<K.added.length;ne++){const ce=K.added[ne];let oe=_.indexOf(ce);if(oe===-1){for(let Ie=0;Ie<x.length;Ie++)if(Ie>=_.length){_.push(ce),oe=Ie;break}else if(_[Ie]===null){_[Ie]=ce,oe=Ie;break}if(oe===-1)break}const Ce=x[oe];Ce&&Ce.connect(ce)}}const Y=new P,te=new P;function I(K,ne,ce){Y.setFromMatrixPosition(ne.matrixWorld),te.setFromMatrixPosition(ce.matrixWorld);const oe=Y.distanceTo(te),Ce=ne.projectionMatrix.elements,Ie=ce.projectionMatrix.elements,Ue=Ce[14]/(Ce[10]-1),dt=Ce[14]/(Ce[10]+1),je=(Ce[9]+1)/Ce[5],Be=(Ce[9]-1)/Ce[5],U=(Ce[8]-1)/Ce[0],rn=(Ie[8]+1)/Ie[0],Re=Ue*U,Xe=Ue*rn,be=oe/(-U+rn),at=be*-U;if(ne.matrixWorld.decompose(K.position,K.quaternion,K.scale),K.translateX(at),K.translateZ(be),K.matrixWorld.compose(K.position,K.quaternion,K.scale),K.matrixWorldInverse.copy(K.matrixWorld).invert(),Ce[10]===-1)K.projectionMatrix.copy(ne.projectionMatrix),K.projectionMatrixInverse.copy(ne.projectionMatrixInverse);else{const Ae=Ue+be,C=dt+be,S=Re-at,H=Xe+(oe-at),Q=je*dt/C*Ae,L=Be*dt/C*Ae;K.projectionMatrix.makePerspective(S,H,Q,L,Ae,C),K.projectionMatrixInverse.copy(K.projectionMatrix).invert()}}function $(K,ne){ne===null?K.matrixWorld.copy(K.matrix):K.matrixWorld.multiplyMatrices(ne.matrixWorld,K.matrix),K.matrixWorldInverse.copy(K.matrixWorld).invert()}this.updateCamera=function(K){if(r===null)return;let ne=K.near,ce=K.far;y.texture!==null&&(y.depthNear>0&&(ne=y.depthNear),y.depthFar>0&&(ce=y.depthFar)),M.near=b.near=A.near=ne,M.far=b.far=A.far=ce,(D!==M.near||V!==M.far)&&(r.updateRenderState({depthNear:M.near,depthFar:M.far}),D=M.near,V=M.far),A.layers.mask=K.layers.mask|2,b.layers.mask=K.layers.mask|4,M.layers.mask=A.layers.mask|b.layers.mask;const oe=K.parent,Ce=M.cameras;$(M,oe);for(let Ie=0;Ie<Ce.length;Ie++)$(Ce[Ie],oe);Ce.length===2?I(M,A,b):M.projectionMatrix.copy(A.projectionMatrix),J(K,M,oe)};function J(K,ne,ce){ce===null?K.matrix.copy(ne.matrixWorld):(K.matrix.copy(ce.matrixWorld),K.matrix.invert(),K.matrix.multiply(ne.matrixWorld)),K.matrix.decompose(K.position,K.quaternion,K.scale),K.updateMatrixWorld(!0),K.projectionMatrix.copy(ne.projectionMatrix),K.projectionMatrixInverse.copy(ne.projectionMatrixInverse),K.isPerspectiveCamera&&(K.fov=ho*2*Math.atan(1/K.projectionMatrix.elements[5]),K.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(f===null&&p===null))return l},this.setFoveation=function(K){l=K,f!==null&&(f.fixedFoveation=K),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=K)},this.hasDepthSensing=function(){return y.texture!==null},this.getDepthSensingMesh=function(){return y.getMesh(M)};let ae=null;function ye(K,ne){if(u=ne.getViewerPose(c||a),v=ne,u!==null){const ce=u.views;p!==null&&(e.setRenderTargetFramebuffer(g,p.framebuffer),e.setRenderTarget(g));let oe=!1;ce.length!==M.cameras.length&&(M.cameras.length=0,oe=!0);for(let Ie=0;Ie<ce.length;Ie++){const Ue=ce[Ie];let dt=null;if(p!==null)dt=p.getViewport(Ue);else{const Be=h.getViewSubImage(f,Ue);dt=Be.viewport,Ie===0&&(e.setRenderTargetTextures(g,Be.colorTexture,f.ignoreDepthValues?void 0:Be.depthStencilTexture),e.setRenderTarget(g))}let je=w[Ie];je===void 0&&(je=new En,je.layers.enable(Ie),je.viewport=new lt,w[Ie]=je),je.matrix.fromArray(Ue.transform.matrix),je.matrix.decompose(je.position,je.quaternion,je.scale),je.projectionMatrix.fromArray(Ue.projectionMatrix),je.projectionMatrixInverse.copy(je.projectionMatrix).invert(),je.viewport.set(dt.x,dt.y,dt.width,dt.height),Ie===0&&(M.matrix.copy(je.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),oe===!0&&M.cameras.push(je)}const Ce=r.enabledFeatures;if(Ce&&Ce.includes("depth-sensing")){const Ie=h.getDepthInformation(ce[0]);Ie&&Ie.isValid&&Ie.texture&&y.init(e,Ie,r.renderState)}}for(let ce=0;ce<x.length;ce++){const oe=_[ce],Ce=x[ce];oe!==null&&Ce!==void 0&&Ce.update(oe,ne,c||a)}ae&&ae(K,ne),ne.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ne}),v=null}const Ve=new Jv;Ve.setAnimationLoop(ye),this.setAnimationLoop=function(K){ae=K},this.dispose=function(){}}}const Tr=new di,oT=new st;function lT(t,e){function n(m,d){m.matrixAutoUpdate===!0&&m.updateMatrix(),d.value.copy(m.matrix)}function i(m,d){d.color.getRGB(m.fogColor.value,qv(t)),d.isFog?(m.fogNear.value=d.near,m.fogFar.value=d.far):d.isFogExp2&&(m.fogDensity.value=d.density)}function r(m,d,g,x,_){d.isMeshBasicMaterial||d.isMeshLambertMaterial?s(m,d):d.isMeshToonMaterial?(s(m,d),h(m,d)):d.isMeshPhongMaterial?(s(m,d),u(m,d)):d.isMeshStandardMaterial?(s(m,d),f(m,d),d.isMeshPhysicalMaterial&&p(m,d,_)):d.isMeshMatcapMaterial?(s(m,d),v(m,d)):d.isMeshDepthMaterial?s(m,d):d.isMeshDistanceMaterial?(s(m,d),y(m,d)):d.isMeshNormalMaterial?s(m,d):d.isLineBasicMaterial?(a(m,d),d.isLineDashedMaterial&&o(m,d)):d.isPointsMaterial?l(m,d,g,x):d.isSpriteMaterial?c(m,d):d.isShadowMaterial?(m.color.value.copy(d.color),m.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function s(m,d){m.opacity.value=d.opacity,d.color&&m.diffuse.value.copy(d.color),d.emissive&&m.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(m.map.value=d.map,n(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,n(d.alphaMap,m.alphaMapTransform)),d.bumpMap&&(m.bumpMap.value=d.bumpMap,n(d.bumpMap,m.bumpMapTransform),m.bumpScale.value=d.bumpScale,d.side===It&&(m.bumpScale.value*=-1)),d.normalMap&&(m.normalMap.value=d.normalMap,n(d.normalMap,m.normalMapTransform),m.normalScale.value.copy(d.normalScale),d.side===It&&m.normalScale.value.negate()),d.displacementMap&&(m.displacementMap.value=d.displacementMap,n(d.displacementMap,m.displacementMapTransform),m.displacementScale.value=d.displacementScale,m.displacementBias.value=d.displacementBias),d.emissiveMap&&(m.emissiveMap.value=d.emissiveMap,n(d.emissiveMap,m.emissiveMapTransform)),d.specularMap&&(m.specularMap.value=d.specularMap,n(d.specularMap,m.specularMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest);const g=e.get(d),x=g.envMap,_=g.envMapRotation;x&&(m.envMap.value=x,Tr.copy(_),Tr.x*=-1,Tr.y*=-1,Tr.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(Tr.y*=-1,Tr.z*=-1),m.envMapRotation.value.setFromMatrix4(oT.makeRotationFromEuler(Tr)),m.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=d.reflectivity,m.ior.value=d.ior,m.refractionRatio.value=d.refractionRatio),d.lightMap&&(m.lightMap.value=d.lightMap,m.lightMapIntensity.value=d.lightMapIntensity,n(d.lightMap,m.lightMapTransform)),d.aoMap&&(m.aoMap.value=d.aoMap,m.aoMapIntensity.value=d.aoMapIntensity,n(d.aoMap,m.aoMapTransform))}function a(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,d.map&&(m.map.value=d.map,n(d.map,m.mapTransform))}function o(m,d){m.dashSize.value=d.dashSize,m.totalSize.value=d.dashSize+d.gapSize,m.scale.value=d.scale}function l(m,d,g,x){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.size.value=d.size*g,m.scale.value=x*.5,d.map&&(m.map.value=d.map,n(d.map,m.uvTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,n(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function c(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.rotation.value=d.rotation,d.map&&(m.map.value=d.map,n(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,n(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function u(m,d){m.specular.value.copy(d.specular),m.shininess.value=Math.max(d.shininess,1e-4)}function h(m,d){d.gradientMap&&(m.gradientMap.value=d.gradientMap)}function f(m,d){m.metalness.value=d.metalness,d.metalnessMap&&(m.metalnessMap.value=d.metalnessMap,n(d.metalnessMap,m.metalnessMapTransform)),m.roughness.value=d.roughness,d.roughnessMap&&(m.roughnessMap.value=d.roughnessMap,n(d.roughnessMap,m.roughnessMapTransform)),d.envMap&&(m.envMapIntensity.value=d.envMapIntensity)}function p(m,d,g){m.ior.value=d.ior,d.sheen>0&&(m.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),m.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(m.sheenColorMap.value=d.sheenColorMap,n(d.sheenColorMap,m.sheenColorMapTransform)),d.sheenRoughnessMap&&(m.sheenRoughnessMap.value=d.sheenRoughnessMap,n(d.sheenRoughnessMap,m.sheenRoughnessMapTransform))),d.clearcoat>0&&(m.clearcoat.value=d.clearcoat,m.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(m.clearcoatMap.value=d.clearcoatMap,n(d.clearcoatMap,m.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,n(d.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(m.clearcoatNormalMap.value=d.clearcoatNormalMap,n(d.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===It&&m.clearcoatNormalScale.value.negate())),d.dispersion>0&&(m.dispersion.value=d.dispersion),d.iridescence>0&&(m.iridescence.value=d.iridescence,m.iridescenceIOR.value=d.iridescenceIOR,m.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(m.iridescenceMap.value=d.iridescenceMap,n(d.iridescenceMap,m.iridescenceMapTransform)),d.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=d.iridescenceThicknessMap,n(d.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),d.transmission>0&&(m.transmission.value=d.transmission,m.transmissionSamplerMap.value=g.texture,m.transmissionSamplerSize.value.set(g.width,g.height),d.transmissionMap&&(m.transmissionMap.value=d.transmissionMap,n(d.transmissionMap,m.transmissionMapTransform)),m.thickness.value=d.thickness,d.thicknessMap&&(m.thicknessMap.value=d.thicknessMap,n(d.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=d.attenuationDistance,m.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(m.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(m.anisotropyMap.value=d.anisotropyMap,n(d.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=d.specularIntensity,m.specularColor.value.copy(d.specularColor),d.specularColorMap&&(m.specularColorMap.value=d.specularColorMap,n(d.specularColorMap,m.specularColorMapTransform)),d.specularIntensityMap&&(m.specularIntensityMap.value=d.specularIntensityMap,n(d.specularIntensityMap,m.specularIntensityMapTransform))}function v(m,d){d.matcap&&(m.matcap.value=d.matcap)}function y(m,d){const g=e.get(d).light;m.referencePosition.value.setFromMatrixPosition(g.matrixWorld),m.nearDistance.value=g.shadow.camera.near,m.farDistance.value=g.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function cT(t,e,n,i){let r={},s={},a=[];const o=t.getParameter(t.MAX_UNIFORM_BUFFER_BINDINGS);function l(g,x){const _=x.program;i.uniformBlockBinding(g,_)}function c(g,x){let _=r[g.id];_===void 0&&(v(g),_=u(g),r[g.id]=_,g.addEventListener("dispose",m));const R=x.program;i.updateUBOMapping(g,R);const T=e.render.frame;s[g.id]!==T&&(f(g),s[g.id]=T)}function u(g){const x=h();g.__bindingPointIndex=x;const _=t.createBuffer(),R=g.__size,T=g.usage;return t.bindBuffer(t.UNIFORM_BUFFER,_),t.bufferData(t.UNIFORM_BUFFER,R,T),t.bindBuffer(t.UNIFORM_BUFFER,null),t.bindBufferBase(t.UNIFORM_BUFFER,x,_),_}function h(){for(let g=0;g<o;g++)if(a.indexOf(g)===-1)return a.push(g),g;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(g){const x=r[g.id],_=g.uniforms,R=g.__cache;t.bindBuffer(t.UNIFORM_BUFFER,x);for(let T=0,A=_.length;T<A;T++){const b=Array.isArray(_[T])?_[T]:[_[T]];for(let w=0,M=b.length;w<M;w++){const D=b[w];if(p(D,T,w,R)===!0){const V=D.__offset,z=Array.isArray(D.value)?D.value:[D.value];let X=0;for(let Z=0;Z<z.length;Z++){const Y=z[Z],te=y(Y);typeof Y=="number"||typeof Y=="boolean"?(D.__data[0]=Y,t.bufferSubData(t.UNIFORM_BUFFER,V+X,D.__data)):Y.isMatrix3?(D.__data[0]=Y.elements[0],D.__data[1]=Y.elements[1],D.__data[2]=Y.elements[2],D.__data[3]=0,D.__data[4]=Y.elements[3],D.__data[5]=Y.elements[4],D.__data[6]=Y.elements[5],D.__data[7]=0,D.__data[8]=Y.elements[6],D.__data[9]=Y.elements[7],D.__data[10]=Y.elements[8],D.__data[11]=0):(Y.toArray(D.__data,X),X+=te.storage/Float32Array.BYTES_PER_ELEMENT)}t.bufferSubData(t.UNIFORM_BUFFER,V,D.__data)}}}t.bindBuffer(t.UNIFORM_BUFFER,null)}function p(g,x,_,R){const T=g.value,A=x+"_"+_;if(R[A]===void 0)return typeof T=="number"||typeof T=="boolean"?R[A]=T:R[A]=T.clone(),!0;{const b=R[A];if(typeof T=="number"||typeof T=="boolean"){if(b!==T)return R[A]=T,!0}else if(b.equals(T)===!1)return b.copy(T),!0}return!1}function v(g){const x=g.uniforms;let _=0;const R=16;for(let A=0,b=x.length;A<b;A++){const w=Array.isArray(x[A])?x[A]:[x[A]];for(let M=0,D=w.length;M<D;M++){const V=w[M],z=Array.isArray(V.value)?V.value:[V.value];for(let X=0,Z=z.length;X<Z;X++){const Y=z[X],te=y(Y),I=_%R,$=I%te.boundary,J=I+$;_+=$,J!==0&&R-J<te.storage&&(_+=R-J),V.__data=new Float32Array(te.storage/Float32Array.BYTES_PER_ELEMENT),V.__offset=_,_+=te.storage}}}const T=_%R;return T>0&&(_+=R-T),g.__size=_,g.__cache={},this}function y(g){const x={boundary:0,storage:0};return typeof g=="number"||typeof g=="boolean"?(x.boundary=4,x.storage=4):g.isVector2?(x.boundary=8,x.storage=8):g.isVector3||g.isColor?(x.boundary=16,x.storage=12):g.isVector4?(x.boundary=16,x.storage=16):g.isMatrix3?(x.boundary=48,x.storage=48):g.isMatrix4?(x.boundary=64,x.storage=64):g.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",g),x}function m(g){const x=g.target;x.removeEventListener("dispose",m);const _=a.indexOf(x.__bindingPointIndex);a.splice(_,1),t.deleteBuffer(r[x.id]),delete r[x.id],delete s[x.id]}function d(){for(const g in r)t.deleteBuffer(r[g]);a=[],r={},s={}}return{bind:l,update:c,dispose:d}}class uT{constructor(e={}){const{canvas:n=ZM(),context:i=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reverseDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=a;const v=new Uint32Array(4),y=new Int32Array(4);let m=null,d=null;const g=[],x=[];this.domElement=n,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Vt,this.toneMapping=lr,this.toneMappingExposure=1;const _=this;let R=!1,T=0,A=0,b=null,w=-1,M=null;const D=new lt,V=new lt;let z=null;const X=new me(0);let Z=0,Y=n.width,te=n.height,I=1,$=null,J=null;const ae=new lt(0,0,Y,te),ye=new lt(0,0,Y,te);let Ve=!1;const K=new Tf;let ne=!1,ce=!1;const oe=new st,Ce=new st,Ie=new P,Ue=new lt,dt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let je=!1;function Be(){return b===null?I:1}let U=i;function rn(E,F){return n.getContext(E,F)}try{const E={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${pf}`),n.addEventListener("webglcontextlost",ee,!1),n.addEventListener("webglcontextrestored",pe,!1),n.addEventListener("webglcontextcreationerror",he,!1),U===null){const F="webgl2";if(U=rn(F,E),U===null)throw rn(F)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let Re,Xe,be,at,Ae,C,S,H,Q,L,B,ge,ue,ve,qe,re,_e,Pe,Ne,Me,Ke,ze,ht,O;function de(){Re=new mE(U),Re.init(),ze=new eT(U,Re),Xe=new lE(U,Re,e,ze),be=new Z2(U,Re),Xe.reverseDepthBuffer&&f&&be.buffers.depth.setReversed(!0),at=new xE(U),Ae=new O2,C=new Q2(U,Re,be,Ae,Xe,ze,at),S=new uE(_),H=new pE(_),Q=new ES(U),ht=new aE(U,Q),L=new gE(U,Q,at,ht),B=new _E(U,L,Q,at),Ne=new yE(U,Xe,C),re=new cE(Ae),ge=new U2(_,S,H,Re,Xe,ht,re),ue=new lT(_,Ae),ve=new k2,qe=new W2(Re),Pe=new sE(_,S,H,be,B,p,l),_e=new q2(_,B,Xe),O=new cT(U,at,Xe,be),Me=new oE(U,Re,at),Ke=new vE(U,Re,at),at.programs=ge.programs,_.capabilities=Xe,_.extensions=Re,_.properties=Ae,_.renderLists=ve,_.shadowMap=_e,_.state=be,_.info=at}de();const q=new aT(_,U);this.xr=q,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){const E=Re.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=Re.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return I},this.setPixelRatio=function(E){E!==void 0&&(I=E,this.setSize(Y,te,!1))},this.getSize=function(E){return E.set(Y,te)},this.setSize=function(E,F,W=!0){if(q.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}Y=E,te=F,n.width=Math.floor(E*I),n.height=Math.floor(F*I),W===!0&&(n.style.width=E+"px",n.style.height=F+"px"),this.setViewport(0,0,E,F)},this.getDrawingBufferSize=function(E){return E.set(Y*I,te*I).floor()},this.setDrawingBufferSize=function(E,F,W){Y=E,te=F,I=W,n.width=Math.floor(E*W),n.height=Math.floor(F*W),this.setViewport(0,0,E,F)},this.getCurrentViewport=function(E){return E.copy(D)},this.getViewport=function(E){return E.copy(ae)},this.setViewport=function(E,F,W,j){E.isVector4?ae.set(E.x,E.y,E.z,E.w):ae.set(E,F,W,j),be.viewport(D.copy(ae).multiplyScalar(I).round())},this.getScissor=function(E){return E.copy(ye)},this.setScissor=function(E,F,W,j){E.isVector4?ye.set(E.x,E.y,E.z,E.w):ye.set(E,F,W,j),be.scissor(V.copy(ye).multiplyScalar(I).round())},this.getScissorTest=function(){return Ve},this.setScissorTest=function(E){be.setScissorTest(Ve=E)},this.setOpaqueSort=function(E){$=E},this.setTransparentSort=function(E){J=E},this.getClearColor=function(E){return E.copy(Pe.getClearColor())},this.setClearColor=function(){Pe.setClearColor.apply(Pe,arguments)},this.getClearAlpha=function(){return Pe.getClearAlpha()},this.setClearAlpha=function(){Pe.setClearAlpha.apply(Pe,arguments)},this.clear=function(E=!0,F=!0,W=!0){let j=0;if(E){let k=!1;if(b!==null){const se=b.texture.format;k=se===Mf||se===_f||se===yf}if(k){const se=b.texture.type,fe=se===Ni||se===Kr||se===uo||se===$s||se===gf||se===vf,Se=Pe.getClearColor(),we=Pe.getClearAlpha(),Le=Se.r,Fe=Se.g,Ee=Se.b;fe?(v[0]=Le,v[1]=Fe,v[2]=Ee,v[3]=we,U.clearBufferuiv(U.COLOR,0,v)):(y[0]=Le,y[1]=Fe,y[2]=Ee,y[3]=we,U.clearBufferiv(U.COLOR,0,y))}else j|=U.COLOR_BUFFER_BIT}F&&(j|=U.DEPTH_BUFFER_BIT),W&&(j|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),U.clear(j)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){n.removeEventListener("webglcontextlost",ee,!1),n.removeEventListener("webglcontextrestored",pe,!1),n.removeEventListener("webglcontextcreationerror",he,!1),ve.dispose(),qe.dispose(),Ae.dispose(),S.dispose(),H.dispose(),B.dispose(),ht.dispose(),O.dispose(),ge.dispose(),q.dispose(),q.removeEventListener("sessionstart",Lf),q.removeEventListener("sessionend",Uf),yr.stop()};function ee(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),R=!0}function pe(){console.log("THREE.WebGLRenderer: Context Restored."),R=!1;const E=at.autoReset,F=_e.enabled,W=_e.autoUpdate,j=_e.needsUpdate,k=_e.type;de(),at.autoReset=E,_e.enabled=F,_e.autoUpdate=W,_e.needsUpdate=j,_e.type=k}function he(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function Oe(E){const F=E.target;F.removeEventListener("dispose",Oe),Tt(F)}function Tt(E){Yt(E),Ae.remove(E)}function Yt(E){const F=Ae.get(E).programs;F!==void 0&&(F.forEach(function(W){ge.releaseProgram(W)}),E.isShaderMaterial&&ge.releaseShaderCache(E))}this.renderBufferDirect=function(E,F,W,j,k,se){F===null&&(F=dt);const fe=k.isMesh&&k.matrixWorld.determinant()<0,Se=gx(E,F,W,j,k);be.setMaterial(j,fe);let we=W.index,Le=1;if(j.wireframe===!0){if(we=L.getWireframeAttribute(W),we===void 0)return;Le=2}const Fe=W.drawRange,Ee=W.attributes.position;let Je=Fe.start*Le,ft=(Fe.start+Fe.count)*Le;se!==null&&(Je=Math.max(Je,se.start*Le),ft=Math.min(ft,(se.start+se.count)*Le)),we!==null?(Je=Math.max(Je,0),ft=Math.min(ft,we.count)):Ee!=null&&(Je=Math.max(Je,0),ft=Math.min(ft,Ee.count));const mt=ft-Je;if(mt<0||mt===1/0)return;ht.setup(k,j,Se,W,we);let fn,tt=Me;if(we!==null&&(fn=Q.get(we),tt=Ke,tt.setIndex(fn)),k.isMesh)j.wireframe===!0?(be.setLineWidth(j.wireframeLinewidth*Be()),tt.setMode(U.LINES)):tt.setMode(U.TRIANGLES);else if(k.isLine){let Te=j.linewidth;Te===void 0&&(Te=1),be.setLineWidth(Te*Be()),k.isLineSegments?tt.setMode(U.LINES):k.isLineLoop?tt.setMode(U.LINE_LOOP):tt.setMode(U.LINE_STRIP)}else k.isPoints?tt.setMode(U.POINTS):k.isSprite&&tt.setMode(U.TRIANGLES);if(k.isBatchedMesh)if(k._multiDrawInstances!==null)tt.renderMultiDrawInstances(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount,k._multiDrawInstances);else if(Re.get("WEBGL_multi_draw"))tt.renderMultiDraw(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount);else{const Te=k._multiDrawStarts,fi=k._multiDrawCounts,nt=k._multiDrawCount,Gn=we?Q.get(we).bytesPerElement:1,es=Ae.get(j).currentProgram.getUniforms();for(let _n=0;_n<nt;_n++)es.setValue(U,"_gl_DrawID",_n),tt.render(Te[_n]/Gn,fi[_n])}else if(k.isInstancedMesh)tt.renderInstances(Je,mt,k.count);else if(W.isInstancedBufferGeometry){const Te=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,fi=Math.min(W.instanceCount,Te);tt.renderInstances(Je,mt,fi)}else tt.render(Je,mt)};function it(E,F,W){E.transparent===!0&&E.side===cn&&E.forceSinglePass===!1?(E.side=It,E.needsUpdate=!0,wo(E,F,W),E.side=hr,E.needsUpdate=!0,wo(E,F,W),E.side=cn):wo(E,F,W)}this.compile=function(E,F,W=null){W===null&&(W=E),d=qe.get(W),d.init(F),x.push(d),W.traverseVisible(function(k){k.isLight&&k.layers.test(F.layers)&&(d.pushLight(k),k.castShadow&&d.pushShadow(k))}),E!==W&&E.traverseVisible(function(k){k.isLight&&k.layers.test(F.layers)&&(d.pushLight(k),k.castShadow&&d.pushShadow(k))}),d.setupLights();const j=new Set;return E.traverse(function(k){if(!(k.isMesh||k.isPoints||k.isLine||k.isSprite))return;const se=k.material;if(se)if(Array.isArray(se))for(let fe=0;fe<se.length;fe++){const Se=se[fe];it(Se,W,k),j.add(Se)}else it(se,W,k),j.add(se)}),x.pop(),d=null,j},this.compileAsync=function(E,F,W=null){const j=this.compile(E,F,W);return new Promise(k=>{function se(){if(j.forEach(function(fe){Ae.get(fe).currentProgram.isReady()&&j.delete(fe)}),j.size===0){k(E);return}setTimeout(se,10)}Re.get("KHR_parallel_shader_compile")!==null?se():setTimeout(se,10)})};let Hn=null;function hi(E){Hn&&Hn(E)}function Lf(){yr.stop()}function Uf(){yr.start()}const yr=new Jv;yr.setAnimationLoop(hi),typeof self<"u"&&yr.setContext(self),this.setAnimationLoop=function(E){Hn=E,q.setAnimationLoop(E),E===null?yr.stop():yr.start()},q.addEventListener("sessionstart",Lf),q.addEventListener("sessionend",Uf),this.render=function(E,F){if(F!==void 0&&F.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),q.enabled===!0&&q.isPresenting===!0&&(q.cameraAutoUpdate===!0&&q.updateCamera(F),F=q.getCamera()),E.isScene===!0&&E.onBeforeRender(_,E,F,b),d=qe.get(E,x.length),d.init(F),x.push(d),Ce.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),K.setFromProjectionMatrix(Ce),ce=this.localClippingEnabled,ne=re.init(this.clippingPlanes,ce),m=ve.get(E,g.length),m.init(),g.push(m),q.enabled===!0&&q.isPresenting===!0){const se=_.xr.getDepthSensingMesh();se!==null&&Cc(se,F,-1/0,_.sortObjects)}Cc(E,F,0,_.sortObjects),m.finish(),_.sortObjects===!0&&m.sort($,J),je=q.enabled===!1||q.isPresenting===!1||q.hasDepthSensing()===!1,je&&Pe.addToRenderList(m,E),this.info.render.frame++,ne===!0&&re.beginShadows();const W=d.state.shadowsArray;_e.render(W,E,F),ne===!0&&re.endShadows(),this.info.autoReset===!0&&this.info.reset();const j=m.opaque,k=m.transmissive;if(d.setupLights(),F.isArrayCamera){const se=F.cameras;if(k.length>0)for(let fe=0,Se=se.length;fe<Se;fe++){const we=se[fe];Ff(j,k,E,we)}je&&Pe.render(E);for(let fe=0,Se=se.length;fe<Se;fe++){const we=se[fe];Of(m,E,we,we.viewport)}}else k.length>0&&Ff(j,k,E,F),je&&Pe.render(E),Of(m,E,F);b!==null&&(C.updateMultisampleRenderTarget(b),C.updateRenderTargetMipmap(b)),E.isScene===!0&&E.onAfterRender(_,E,F),ht.resetDefaultState(),w=-1,M=null,x.pop(),x.length>0?(d=x[x.length-1],ne===!0&&re.setGlobalState(_.clippingPlanes,d.state.camera)):d=null,g.pop(),g.length>0?m=g[g.length-1]:m=null};function Cc(E,F,W,j){if(E.visible===!1)return;if(E.layers.test(F.layers)){if(E.isGroup)W=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(F);else if(E.isLight)d.pushLight(E),E.castShadow&&d.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||K.intersectsSprite(E)){j&&Ue.setFromMatrixPosition(E.matrixWorld).applyMatrix4(Ce);const fe=B.update(E),Se=E.material;Se.visible&&m.push(E,fe,Se,W,Ue.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||K.intersectsObject(E))){const fe=B.update(E),Se=E.material;if(j&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),Ue.copy(E.boundingSphere.center)):(fe.boundingSphere===null&&fe.computeBoundingSphere(),Ue.copy(fe.boundingSphere.center)),Ue.applyMatrix4(E.matrixWorld).applyMatrix4(Ce)),Array.isArray(Se)){const we=fe.groups;for(let Le=0,Fe=we.length;Le<Fe;Le++){const Ee=we[Le],Je=Se[Ee.materialIndex];Je&&Je.visible&&m.push(E,fe,Je,W,Ue.z,Ee)}}else Se.visible&&m.push(E,fe,Se,W,Ue.z,null)}}const se=E.children;for(let fe=0,Se=se.length;fe<Se;fe++)Cc(se[fe],F,W,j)}function Of(E,F,W,j){const k=E.opaque,se=E.transmissive,fe=E.transparent;d.setupLightsView(W),ne===!0&&re.setGlobalState(_.clippingPlanes,W),j&&be.viewport(D.copy(j)),k.length>0&&So(k,F,W),se.length>0&&So(se,F,W),fe.length>0&&So(fe,F,W),be.buffers.depth.setTest(!0),be.buffers.depth.setMask(!0),be.buffers.color.setMask(!0),be.setPolygonOffset(!1)}function Ff(E,F,W,j){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;d.state.transmissionRenderTarget[j.id]===void 0&&(d.state.transmissionRenderTarget[j.id]=new Yr(1,1,{generateMipmaps:!0,type:Re.has("EXT_color_buffer_half_float")||Re.has("EXT_color_buffer_float")?_o:Ni,minFilter:Zn,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:$e.workingColorSpace}));const se=d.state.transmissionRenderTarget[j.id],fe=j.viewport||D;se.setSize(fe.z,fe.w);const Se=_.getRenderTarget();_.setRenderTarget(se),_.getClearColor(X),Z=_.getClearAlpha(),Z<1&&_.setClearColor(16777215,.5),_.clear(),je&&Pe.render(W);const we=_.toneMapping;_.toneMapping=lr;const Le=j.viewport;if(j.viewport!==void 0&&(j.viewport=void 0),d.setupLightsView(j),ne===!0&&re.setGlobalState(_.clippingPlanes,j),So(E,W,j),C.updateMultisampleRenderTarget(se),C.updateRenderTargetMipmap(se),Re.has("WEBGL_multisampled_render_to_texture")===!1){let Fe=!1;for(let Ee=0,Je=F.length;Ee<Je;Ee++){const ft=F[Ee],mt=ft.object,fn=ft.geometry,tt=ft.material,Te=ft.group;if(tt.side===cn&&mt.layers.test(j.layers)){const fi=tt.side;tt.side=It,tt.needsUpdate=!0,kf(mt,W,j,fn,tt,Te),tt.side=fi,tt.needsUpdate=!0,Fe=!0}}Fe===!0&&(C.updateMultisampleRenderTarget(se),C.updateRenderTargetMipmap(se))}_.setRenderTarget(Se),_.setClearColor(X,Z),Le!==void 0&&(j.viewport=Le),_.toneMapping=we}function So(E,F,W){const j=F.isScene===!0?F.overrideMaterial:null;for(let k=0,se=E.length;k<se;k++){const fe=E[k],Se=fe.object,we=fe.geometry,Le=j===null?fe.material:j,Fe=fe.group;Se.layers.test(W.layers)&&kf(Se,F,W,we,Le,Fe)}}function kf(E,F,W,j,k,se){E.onBeforeRender(_,F,W,j,k,se),E.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),k.onBeforeRender(_,F,W,j,E,se),k.transparent===!0&&k.side===cn&&k.forceSinglePass===!1?(k.side=It,k.needsUpdate=!0,_.renderBufferDirect(W,F,j,k,E,se),k.side=hr,k.needsUpdate=!0,_.renderBufferDirect(W,F,j,k,E,se),k.side=cn):_.renderBufferDirect(W,F,j,k,E,se),E.onAfterRender(_,F,W,j,k,se)}function wo(E,F,W){F.isScene!==!0&&(F=dt);const j=Ae.get(E),k=d.state.lights,se=d.state.shadowsArray,fe=k.state.version,Se=ge.getParameters(E,k.state,se,F,W),we=ge.getProgramCacheKey(Se);let Le=j.programs;j.environment=E.isMeshStandardMaterial?F.environment:null,j.fog=F.fog,j.envMap=(E.isMeshStandardMaterial?H:S).get(E.envMap||j.environment),j.envMapRotation=j.environment!==null&&E.envMap===null?F.environmentRotation:E.envMapRotation,Le===void 0&&(E.addEventListener("dispose",Oe),Le=new Map,j.programs=Le);let Fe=Le.get(we);if(Fe!==void 0){if(j.currentProgram===Fe&&j.lightsStateVersion===fe)return zf(E,Se),Fe}else Se.uniforms=ge.getUniforms(E),E.onBeforeCompile(Se,_),Fe=ge.acquireProgram(Se,we),Le.set(we,Fe),j.uniforms=Se.uniforms;const Ee=j.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Ee.clippingPlanes=re.uniform),zf(E,Se),j.needsLights=xx(E),j.lightsStateVersion=fe,j.needsLights&&(Ee.ambientLightColor.value=k.state.ambient,Ee.lightProbe.value=k.state.probe,Ee.directionalLights.value=k.state.directional,Ee.directionalLightShadows.value=k.state.directionalShadow,Ee.spotLights.value=k.state.spot,Ee.spotLightShadows.value=k.state.spotShadow,Ee.rectAreaLights.value=k.state.rectArea,Ee.ltc_1.value=k.state.rectAreaLTC1,Ee.ltc_2.value=k.state.rectAreaLTC2,Ee.pointLights.value=k.state.point,Ee.pointLightShadows.value=k.state.pointShadow,Ee.hemisphereLights.value=k.state.hemi,Ee.directionalShadowMap.value=k.state.directionalShadowMap,Ee.directionalShadowMatrix.value=k.state.directionalShadowMatrix,Ee.spotShadowMap.value=k.state.spotShadowMap,Ee.spotLightMatrix.value=k.state.spotLightMatrix,Ee.spotLightMap.value=k.state.spotLightMap,Ee.pointShadowMap.value=k.state.pointShadowMap,Ee.pointShadowMatrix.value=k.state.pointShadowMatrix),j.currentProgram=Fe,j.uniformsList=null,Fe}function Bf(E){if(E.uniformsList===null){const F=E.currentProgram.getUniforms();E.uniformsList=Pl.seqWithValue(F.seq,E.uniforms)}return E.uniformsList}function zf(E,F){const W=Ae.get(E);W.outputColorSpace=F.outputColorSpace,W.batching=F.batching,W.batchingColor=F.batchingColor,W.instancing=F.instancing,W.instancingColor=F.instancingColor,W.instancingMorph=F.instancingMorph,W.skinning=F.skinning,W.morphTargets=F.morphTargets,W.morphNormals=F.morphNormals,W.morphColors=F.morphColors,W.morphTargetsCount=F.morphTargetsCount,W.numClippingPlanes=F.numClippingPlanes,W.numIntersection=F.numClipIntersection,W.vertexAlphas=F.vertexAlphas,W.vertexTangents=F.vertexTangents,W.toneMapping=F.toneMapping}function gx(E,F,W,j,k){F.isScene!==!0&&(F=dt),C.resetTextureUnits();const se=F.fog,fe=j.isMeshStandardMaterial?F.environment:null,Se=b===null?_.outputColorSpace:b.isXRRenderTarget===!0?b.texture.colorSpace:ia,we=(j.isMeshStandardMaterial?H:S).get(j.envMap||fe),Le=j.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,Fe=!!W.attributes.tangent&&(!!j.normalMap||j.anisotropy>0),Ee=!!W.morphAttributes.position,Je=!!W.morphAttributes.normal,ft=!!W.morphAttributes.color;let mt=lr;j.toneMapped&&(b===null||b.isXRRenderTarget===!0)&&(mt=_.toneMapping);const fn=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,tt=fn!==void 0?fn.length:0,Te=Ae.get(j),fi=d.state.lights;if(ne===!0&&(ce===!0||E!==M)){const Dn=E===M&&j.id===w;re.setState(j,E,Dn)}let nt=!1;j.version===Te.__version?(Te.needsLights&&Te.lightsStateVersion!==fi.state.version||Te.outputColorSpace!==Se||k.isBatchedMesh&&Te.batching===!1||!k.isBatchedMesh&&Te.batching===!0||k.isBatchedMesh&&Te.batchingColor===!0&&k.colorTexture===null||k.isBatchedMesh&&Te.batchingColor===!1&&k.colorTexture!==null||k.isInstancedMesh&&Te.instancing===!1||!k.isInstancedMesh&&Te.instancing===!0||k.isSkinnedMesh&&Te.skinning===!1||!k.isSkinnedMesh&&Te.skinning===!0||k.isInstancedMesh&&Te.instancingColor===!0&&k.instanceColor===null||k.isInstancedMesh&&Te.instancingColor===!1&&k.instanceColor!==null||k.isInstancedMesh&&Te.instancingMorph===!0&&k.morphTexture===null||k.isInstancedMesh&&Te.instancingMorph===!1&&k.morphTexture!==null||Te.envMap!==we||j.fog===!0&&Te.fog!==se||Te.numClippingPlanes!==void 0&&(Te.numClippingPlanes!==re.numPlanes||Te.numIntersection!==re.numIntersection)||Te.vertexAlphas!==Le||Te.vertexTangents!==Fe||Te.morphTargets!==Ee||Te.morphNormals!==Je||Te.morphColors!==ft||Te.toneMapping!==mt||Te.morphTargetsCount!==tt)&&(nt=!0):(nt=!0,Te.__version=j.version);let Gn=Te.currentProgram;nt===!0&&(Gn=wo(j,F,k));let es=!1,_n=!1,la=!1;const gt=Gn.getUniforms(),ni=Te.uniforms;if(be.useProgram(Gn.program)&&(es=!0,_n=!0,la=!0),j.id!==w&&(w=j.id,_n=!0),es||M!==E){be.buffers.depth.getReversed()?(oe.copy(E.projectionMatrix),QM(oe),eS(oe),gt.setValue(U,"projectionMatrix",oe)):gt.setValue(U,"projectionMatrix",E.projectionMatrix),gt.setValue(U,"viewMatrix",E.matrixWorldInverse);const Ui=gt.map.cameraPosition;Ui!==void 0&&Ui.setValue(U,Ie.setFromMatrixPosition(E.matrixWorld)),Xe.logarithmicDepthBuffer&&gt.setValue(U,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(j.isMeshPhongMaterial||j.isMeshToonMaterial||j.isMeshLambertMaterial||j.isMeshBasicMaterial||j.isMeshStandardMaterial||j.isShaderMaterial)&&gt.setValue(U,"isOrthographic",E.isOrthographicCamera===!0),M!==E&&(M=E,_n=!0,la=!0)}if(k.isSkinnedMesh){gt.setOptional(U,k,"bindMatrix"),gt.setOptional(U,k,"bindMatrixInverse");const Dn=k.skeleton;Dn&&(Dn.boneTexture===null&&Dn.computeBoneTexture(),gt.setValue(U,"boneTexture",Dn.boneTexture,C))}k.isBatchedMesh&&(gt.setOptional(U,k,"batchingTexture"),gt.setValue(U,"batchingTexture",k._matricesTexture,C),gt.setOptional(U,k,"batchingIdTexture"),gt.setValue(U,"batchingIdTexture",k._indirectTexture,C),gt.setOptional(U,k,"batchingColorTexture"),k._colorsTexture!==null&&gt.setValue(U,"batchingColorTexture",k._colorsTexture,C));const ca=W.morphAttributes;if((ca.position!==void 0||ca.normal!==void 0||ca.color!==void 0)&&Ne.update(k,W,Gn),(_n||Te.receiveShadow!==k.receiveShadow)&&(Te.receiveShadow=k.receiveShadow,gt.setValue(U,"receiveShadow",k.receiveShadow)),j.isMeshGouraudMaterial&&j.envMap!==null&&(ni.envMap.value=we,ni.flipEnvMap.value=we.isCubeTexture&&we.isRenderTargetTexture===!1?-1:1),j.isMeshStandardMaterial&&j.envMap===null&&F.environment!==null&&(ni.envMapIntensity.value=F.environmentIntensity),_n&&(gt.setValue(U,"toneMappingExposure",_.toneMappingExposure),Te.needsLights&&vx(ni,la),se&&j.fog===!0&&ue.refreshFogUniforms(ni,se),ue.refreshMaterialUniforms(ni,j,I,te,d.state.transmissionRenderTarget[E.id]),Pl.upload(U,Bf(Te),ni,C)),j.isShaderMaterial&&j.uniformsNeedUpdate===!0&&(Pl.upload(U,Bf(Te),ni,C),j.uniformsNeedUpdate=!1),j.isSpriteMaterial&&gt.setValue(U,"center",k.center),gt.setValue(U,"modelViewMatrix",k.modelViewMatrix),gt.setValue(U,"normalMatrix",k.normalMatrix),gt.setValue(U,"modelMatrix",k.matrixWorld),j.isShaderMaterial||j.isRawShaderMaterial){const Dn=j.uniformsGroups;for(let Ui=0,Oi=Dn.length;Ui<Oi;Ui++){const Hf=Dn[Ui];O.update(Hf,Gn),O.bind(Hf,Gn)}}return Gn}function vx(E,F){E.ambientLightColor.needsUpdate=F,E.lightProbe.needsUpdate=F,E.directionalLights.needsUpdate=F,E.directionalLightShadows.needsUpdate=F,E.pointLights.needsUpdate=F,E.pointLightShadows.needsUpdate=F,E.spotLights.needsUpdate=F,E.spotLightShadows.needsUpdate=F,E.rectAreaLights.needsUpdate=F,E.hemisphereLights.needsUpdate=F}function xx(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return T},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return b},this.setRenderTargetTextures=function(E,F,W){Ae.get(E.texture).__webglTexture=F,Ae.get(E.depthTexture).__webglTexture=W;const j=Ae.get(E);j.__hasExternalTextures=!0,j.__autoAllocateDepthBuffer=W===void 0,j.__autoAllocateDepthBuffer||Re.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),j.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(E,F){const W=Ae.get(E);W.__webglFramebuffer=F,W.__useDefaultFramebuffer=F===void 0},this.setRenderTarget=function(E,F=0,W=0){b=E,T=F,A=W;let j=!0,k=null,se=!1,fe=!1;if(E){const we=Ae.get(E);if(we.__useDefaultFramebuffer!==void 0)be.bindFramebuffer(U.FRAMEBUFFER,null),j=!1;else if(we.__webglFramebuffer===void 0)C.setupRenderTarget(E);else if(we.__hasExternalTextures)C.rebindTextures(E,Ae.get(E.texture).__webglTexture,Ae.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const Ee=E.depthTexture;if(we.__boundDepthTexture!==Ee){if(Ee!==null&&Ae.has(Ee)&&(E.width!==Ee.image.width||E.height!==Ee.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");C.setupDepthRenderbuffer(E)}}const Le=E.texture;(Le.isData3DTexture||Le.isDataArrayTexture||Le.isCompressedArrayTexture)&&(fe=!0);const Fe=Ae.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Fe[F])?k=Fe[F][W]:k=Fe[F],se=!0):E.samples>0&&C.useMultisampledRTT(E)===!1?k=Ae.get(E).__webglMultisampledFramebuffer:Array.isArray(Fe)?k=Fe[W]:k=Fe,D.copy(E.viewport),V.copy(E.scissor),z=E.scissorTest}else D.copy(ae).multiplyScalar(I).floor(),V.copy(ye).multiplyScalar(I).floor(),z=Ve;if(be.bindFramebuffer(U.FRAMEBUFFER,k)&&j&&be.drawBuffers(E,k),be.viewport(D),be.scissor(V),be.setScissorTest(z),se){const we=Ae.get(E.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+F,we.__webglTexture,W)}else if(fe){const we=Ae.get(E.texture),Le=F||0;U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,we.__webglTexture,W||0,Le)}w=-1},this.readRenderTargetPixels=function(E,F,W,j,k,se,fe){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Se=Ae.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&fe!==void 0&&(Se=Se[fe]),Se){be.bindFramebuffer(U.FRAMEBUFFER,Se);try{const we=E.texture,Le=we.format,Fe=we.type;if(!Xe.textureFormatReadable(Le)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Xe.textureTypeReadable(Fe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=E.width-j&&W>=0&&W<=E.height-k&&U.readPixels(F,W,j,k,ze.convert(Le),ze.convert(Fe),se)}finally{const we=b!==null?Ae.get(b).__webglFramebuffer:null;be.bindFramebuffer(U.FRAMEBUFFER,we)}}},this.readRenderTargetPixelsAsync=async function(E,F,W,j,k,se,fe){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Se=Ae.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&fe!==void 0&&(Se=Se[fe]),Se){const we=E.texture,Le=we.format,Fe=we.type;if(!Xe.textureFormatReadable(Le))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Xe.textureTypeReadable(Fe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(F>=0&&F<=E.width-j&&W>=0&&W<=E.height-k){be.bindFramebuffer(U.FRAMEBUFFER,Se);const Ee=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,Ee),U.bufferData(U.PIXEL_PACK_BUFFER,se.byteLength,U.STREAM_READ),U.readPixels(F,W,j,k,ze.convert(Le),ze.convert(Fe),0);const Je=b!==null?Ae.get(b).__webglFramebuffer:null;be.bindFramebuffer(U.FRAMEBUFFER,Je);const ft=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await JM(U,ft,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,Ee),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,se),U.deleteBuffer(Ee),U.deleteSync(ft),se}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(E,F=null,W=0){E.isTexture!==!0&&(Da("WebGLRenderer: copyFramebufferToTexture function signature has changed."),F=arguments[0]||null,E=arguments[1]);const j=Math.pow(2,-W),k=Math.floor(E.image.width*j),se=Math.floor(E.image.height*j),fe=F!==null?F.x:0,Se=F!==null?F.y:0;C.setTexture2D(E,0),U.copyTexSubImage2D(U.TEXTURE_2D,W,0,0,fe,Se,k,se),be.unbindTexture()},this.copyTextureToTexture=function(E,F,W=null,j=null,k=0){E.isTexture!==!0&&(Da("WebGLRenderer: copyTextureToTexture function signature has changed."),j=arguments[0]||null,E=arguments[1],F=arguments[2],k=arguments[3]||0,W=null);let se,fe,Se,we,Le,Fe,Ee,Je,ft;const mt=E.isCompressedTexture?E.mipmaps[k]:E.image;W!==null?(se=W.max.x-W.min.x,fe=W.max.y-W.min.y,Se=W.isBox3?W.max.z-W.min.z:1,we=W.min.x,Le=W.min.y,Fe=W.isBox3?W.min.z:0):(se=mt.width,fe=mt.height,Se=mt.depth||1,we=0,Le=0,Fe=0),j!==null?(Ee=j.x,Je=j.y,ft=j.z):(Ee=0,Je=0,ft=0);const fn=ze.convert(F.format),tt=ze.convert(F.type);let Te;F.isData3DTexture?(C.setTexture3D(F,0),Te=U.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(C.setTexture2DArray(F,0),Te=U.TEXTURE_2D_ARRAY):(C.setTexture2D(F,0),Te=U.TEXTURE_2D),U.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,F.flipY),U.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),U.pixelStorei(U.UNPACK_ALIGNMENT,F.unpackAlignment);const fi=U.getParameter(U.UNPACK_ROW_LENGTH),nt=U.getParameter(U.UNPACK_IMAGE_HEIGHT),Gn=U.getParameter(U.UNPACK_SKIP_PIXELS),es=U.getParameter(U.UNPACK_SKIP_ROWS),_n=U.getParameter(U.UNPACK_SKIP_IMAGES);U.pixelStorei(U.UNPACK_ROW_LENGTH,mt.width),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,mt.height),U.pixelStorei(U.UNPACK_SKIP_PIXELS,we),U.pixelStorei(U.UNPACK_SKIP_ROWS,Le),U.pixelStorei(U.UNPACK_SKIP_IMAGES,Fe);const la=E.isDataArrayTexture||E.isData3DTexture,gt=F.isDataArrayTexture||F.isData3DTexture;if(E.isRenderTargetTexture||E.isDepthTexture){const ni=Ae.get(E),ca=Ae.get(F),Dn=Ae.get(ni.__renderTarget),Ui=Ae.get(ca.__renderTarget);be.bindFramebuffer(U.READ_FRAMEBUFFER,Dn.__webglFramebuffer),be.bindFramebuffer(U.DRAW_FRAMEBUFFER,Ui.__webglFramebuffer);for(let Oi=0;Oi<Se;Oi++)la&&U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Ae.get(E).__webglTexture,k,Fe+Oi),E.isDepthTexture?(gt&&U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Ae.get(F).__webglTexture,k,ft+Oi),U.blitFramebuffer(we,Le,se,fe,Ee,Je,se,fe,U.DEPTH_BUFFER_BIT,U.NEAREST)):gt?U.copyTexSubImage3D(Te,k,Ee,Je,ft+Oi,we,Le,se,fe):U.copyTexSubImage2D(Te,k,Ee,Je,ft+Oi,we,Le,se,fe);be.bindFramebuffer(U.READ_FRAMEBUFFER,null),be.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else gt?E.isDataTexture||E.isData3DTexture?U.texSubImage3D(Te,k,Ee,Je,ft,se,fe,Se,fn,tt,mt.data):F.isCompressedArrayTexture?U.compressedTexSubImage3D(Te,k,Ee,Je,ft,se,fe,Se,fn,mt.data):U.texSubImage3D(Te,k,Ee,Je,ft,se,fe,Se,fn,tt,mt):E.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,k,Ee,Je,se,fe,fn,tt,mt.data):E.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,k,Ee,Je,mt.width,mt.height,fn,mt.data):U.texSubImage2D(U.TEXTURE_2D,k,Ee,Je,se,fe,fn,tt,mt);U.pixelStorei(U.UNPACK_ROW_LENGTH,fi),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,nt),U.pixelStorei(U.UNPACK_SKIP_PIXELS,Gn),U.pixelStorei(U.UNPACK_SKIP_ROWS,es),U.pixelStorei(U.UNPACK_SKIP_IMAGES,_n),k===0&&F.generateMipmaps&&U.generateMipmap(Te),be.unbindTexture()},this.copyTextureToTexture3D=function(E,F,W=null,j=null,k=0){return E.isTexture!==!0&&(Da("WebGLRenderer: copyTextureToTexture3D function signature has changed."),W=arguments[0]||null,j=arguments[1]||null,E=arguments[2],F=arguments[3],k=arguments[4]||0),Da('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(E,F,W,j,k)},this.initRenderTarget=function(E){Ae.get(E).__webglFramebuffer===void 0&&C.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?C.setTextureCube(E,0):E.isData3DTexture?C.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?C.setTexture2DArray(E,0):C.setTexture2D(E,0),be.unbindTexture()},this.resetState=function(){T=0,A=0,b=null,be.reset(),ht.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ei}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const n=this.getContext();n.drawingBufferColorspace=$e._getDrawingBufferColorSpace(e),n.unpackColorSpace=$e._getUnpackColorSpace()}}class dT extends Xt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new di,this.environmentIntensity=1,this.environmentRotation=new di,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,n){return super.copy(e,n),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const n=super.toJSON(e);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(n.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(n.object.backgroundIntensity=this.backgroundIntensity),n.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(n.object.environmentIntensity=this.environmentIntensity),n.object.environmentRotation=this.environmentRotation.toArray(),n}}class hT extends Ht{constructor(e=null,n=1,i=1,r,s,a,o,l,c=bn,u=bn,h,f){super(null,a,o,l,c,u,r,s,h,f),this.isDataTexture=!0,this.image={data:e,width:n,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class qm extends Ye{constructor(e,n,i,r=1){super(e,n,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const gs=new st,$m=new st,ll=[],Zm=new Zr,fT=new st,Sa=new et,wa=new Jr;class pT extends et{constructor(e,n,i){super(e,n),this.isInstancedMesh=!0,this.instanceMatrix=new qm(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let r=0;r<i;r++)this.setMatrixAt(r,fT)}computeBoundingBox(){const e=this.geometry,n=this.count;this.boundingBox===null&&(this.boundingBox=new Zr),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<n;i++)this.getMatrixAt(i,gs),Zm.copy(e.boundingBox).applyMatrix4(gs),this.boundingBox.union(Zm)}computeBoundingSphere(){const e=this.geometry,n=this.count;this.boundingSphere===null&&(this.boundingSphere=new Jr),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<n;i++)this.getMatrixAt(i,gs),wa.copy(e.boundingSphere).applyMatrix4(gs),this.boundingSphere.union(wa)}copy(e,n){return super.copy(e,n),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,n){n.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,n){n.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,n){const i=n.morphTargetInfluences,r=this.morphTexture.source.data.data,s=i.length+1,a=e*s+1;for(let o=0;o<i.length;o++)i[o]=r[a+o]}raycast(e,n){const i=this.matrixWorld,r=this.count;if(Sa.geometry=this.geometry,Sa.material=this.material,Sa.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),wa.copy(this.boundingSphere),wa.applyMatrix4(i),e.ray.intersectsSphere(wa)!==!1))for(let s=0;s<r;s++){this.getMatrixAt(s,gs),$m.multiplyMatrices(i,gs),Sa.matrixWorld=$m,Sa.raycast(e,ll);for(let a=0,o=ll.length;a<o;a++){const l=ll[a];l.instanceId=s,l.object=this,n.push(l)}ll.length=0}}setColorAt(e,n){this.instanceColor===null&&(this.instanceColor=new qm(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),n.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,n){n.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,n){const i=n.morphTargetInfluences,r=i.length+1;this.morphTexture===null&&(this.morphTexture=new hT(new Float32Array(r*this.count),r,this.count,xf,li));const s=this.morphTexture.source.data.data;let a=0;for(let c=0;c<i.length;c++)a+=i[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=r*e;s[l]=o,s.set(i,l+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}class Ii extends Qr{static get type(){return"LineBasicMaterial"}constructor(e){super(),this.isLineBasicMaterial=!0,this.color=new me(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const nc=new P,ic=new P,Jm=new st,Ea=new Tc,cl=new Jr,Ru=new P,Qm=new P;class cr extends Xt{constructor(e=new ct,n=new Ii){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const n=e.attributes.position,i=[0];for(let r=1,s=n.count;r<s;r++)nc.fromBufferAttribute(n,r-1),ic.fromBufferAttribute(n,r),i[r]=i[r-1],i[r]+=nc.distanceTo(ic);e.setAttribute("lineDistance",new Lt(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,n){const i=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),cl.copy(i.boundingSphere),cl.applyMatrix4(r),cl.radius+=s,e.ray.intersectsSphere(cl)===!1)return;Jm.copy(r).invert(),Ea.copy(e.ray).applyMatrix4(Jm);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,u=i.index,f=i.attributes.position;if(u!==null){const p=Math.max(0,a.start),v=Math.min(u.count,a.start+a.count);for(let y=p,m=v-1;y<m;y+=c){const d=u.getX(y),g=u.getX(y+1),x=ul(this,e,Ea,l,d,g);x&&n.push(x)}if(this.isLineLoop){const y=u.getX(v-1),m=u.getX(p),d=ul(this,e,Ea,l,y,m);d&&n.push(d)}}else{const p=Math.max(0,a.start),v=Math.min(f.count,a.start+a.count);for(let y=p,m=v-1;y<m;y+=c){const d=ul(this,e,Ea,l,y,y+1);d&&n.push(d)}if(this.isLineLoop){const y=ul(this,e,Ea,l,v-1,p);y&&n.push(y)}}}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function ul(t,e,n,i,r,s){const a=t.geometry.attributes.position;if(nc.fromBufferAttribute(a,r),ic.fromBufferAttribute(a,s),n.distanceSqToSegment(nc,ic,Ru,Qm)>i)return;Ru.applyMatrix4(t.matrixWorld);const l=e.ray.origin.distanceTo(Ru);if(!(l<e.near||l>e.far))return{distance:l,point:Qm.clone().applyMatrix4(t.matrixWorld),index:r,face:null,faceIndex:null,barycoord:null,object:t}}const e0=new P,t0=new P;class bf extends cr{constructor(e,n){super(e,n),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const n=e.attributes.position,i=[];for(let r=0,s=n.count;r<s;r+=2)e0.fromBufferAttribute(n,r),t0.fromBufferAttribute(n,r+1),i[r]=r===0?0:i[r-1],i[r+1]=i[r]+e0.distanceTo(t0);e.setAttribute("lineDistance",new Lt(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Cf extends Qr{static get type(){return"PointsMaterial"}constructor(e){super(),this.isPointsMaterial=!0,this.color=new me(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const n0=new st,ph=new Tc,dl=new Jr,hl=new P;class Ji extends Xt{constructor(e=new ct,n=new Cf){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,n){const i=this.geometry,r=this.matrixWorld,s=e.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),dl.copy(i.boundingSphere),dl.applyMatrix4(r),dl.radius+=s,e.ray.intersectsSphere(dl)===!1)return;n0.copy(r).invert(),ph.copy(e.ray).applyMatrix4(n0);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=i.index,h=i.attributes.position;if(c!==null){const f=Math.max(0,a.start),p=Math.min(c.count,a.start+a.count);for(let v=f,y=p;v<y;v++){const m=c.getX(v);hl.fromBufferAttribute(h,m),i0(hl,m,l,r,e,n,this)}}else{const f=Math.max(0,a.start),p=Math.min(h.count,a.start+a.count);for(let v=f,y=p;v<y;v++)hl.fromBufferAttribute(h,v),i0(hl,v,l,r,e,n,this)}}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function i0(t,e,n,i,r,s,a){const o=ph.distanceSqToPoint(t);if(o<n){const l=new P;ph.closestPointToPoint(t,l),l.applyMatrix4(i);const c=r.ray.origin.distanceTo(l);if(c<r.near||c>r.far)return;s.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class _t extends Ht{constructor(e,n,i,r,s,a,o,l,c){super(e,n,i,r,s,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Rf extends ct{constructor(e=[],n=[],i=1,r=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:n,radius:i,detail:r};const s=[],a=[];o(r),c(i),u(),this.setAttribute("position",new Lt(s,3)),this.setAttribute("normal",new Lt(s.slice(),3)),this.setAttribute("uv",new Lt(a,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function o(g){const x=new P,_=new P,R=new P;for(let T=0;T<n.length;T+=3)p(n[T+0],x),p(n[T+1],_),p(n[T+2],R),l(x,_,R,g)}function l(g,x,_,R){const T=R+1,A=[];for(let b=0;b<=T;b++){A[b]=[];const w=g.clone().lerp(_,b/T),M=x.clone().lerp(_,b/T),D=T-b;for(let V=0;V<=D;V++)V===0&&b===T?A[b][V]=w:A[b][V]=w.clone().lerp(M,V/D)}for(let b=0;b<T;b++)for(let w=0;w<2*(T-b)-1;w++){const M=Math.floor(w/2);w%2===0?(f(A[b][M+1]),f(A[b+1][M]),f(A[b][M])):(f(A[b][M+1]),f(A[b+1][M+1]),f(A[b+1][M]))}}function c(g){const x=new P;for(let _=0;_<s.length;_+=3)x.x=s[_+0],x.y=s[_+1],x.z=s[_+2],x.normalize().multiplyScalar(g),s[_+0]=x.x,s[_+1]=x.y,s[_+2]=x.z}function u(){const g=new P;for(let x=0;x<s.length;x+=3){g.x=s[x+0],g.y=s[x+1],g.z=s[x+2];const _=m(g)/2/Math.PI+.5,R=d(g)/Math.PI+.5;a.push(_,1-R)}v(),h()}function h(){for(let g=0;g<a.length;g+=6){const x=a[g+0],_=a[g+2],R=a[g+4],T=Math.max(x,_,R),A=Math.min(x,_,R);T>.9&&A<.1&&(x<.2&&(a[g+0]+=1),_<.2&&(a[g+2]+=1),R<.2&&(a[g+4]+=1))}}function f(g){s.push(g.x,g.y,g.z)}function p(g,x){const _=g*3;x.x=e[_+0],x.y=e[_+1],x.z=e[_+2]}function v(){const g=new P,x=new P,_=new P,R=new P,T=new Ge,A=new Ge,b=new Ge;for(let w=0,M=0;w<s.length;w+=9,M+=6){g.set(s[w+0],s[w+1],s[w+2]),x.set(s[w+3],s[w+4],s[w+5]),_.set(s[w+6],s[w+7],s[w+8]),T.set(a[M+0],a[M+1]),A.set(a[M+2],a[M+3]),b.set(a[M+4],a[M+5]),R.copy(g).add(x).add(_).divideScalar(3);const D=m(R);y(T,M+0,g,D),y(A,M+2,x,D),y(b,M+4,_,D)}}function y(g,x,_,R){R<0&&g.x===1&&(a[x]=g.x-1),_.x===0&&_.z===0&&(a[x]=R/2/Math.PI+.5)}function m(g){return Math.atan2(g.z,-g.x)}function d(g){return Math.atan2(-g.y,Math.sqrt(g.x*g.x+g.z*g.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Rf(e.vertices,e.indices,e.radius,e.details)}}class Pf extends Rf{constructor(e=1,n=0){const i=(1+Math.sqrt(5))/2,r=1/i,s=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-r,-i,0,-r,i,0,r,-i,0,r,i,-r,-i,0,-r,i,0,r,-i,0,r,i,0,-i,0,-r,i,0,-r,-i,0,r,i,0,r],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(s,a,e,n),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:n}}static fromJSON(e){return new Pf(e.radius,e.detail)}}class Df extends ct{constructor(e=.5,n=1,i=32,r=1,s=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:n,thetaSegments:i,phiSegments:r,thetaStart:s,thetaLength:a},i=Math.max(3,i),r=Math.max(1,r);const o=[],l=[],c=[],u=[];let h=e;const f=(n-e)/r,p=new P,v=new Ge;for(let y=0;y<=r;y++){for(let m=0;m<=i;m++){const d=s+m/i*a;p.x=h*Math.cos(d),p.y=h*Math.sin(d),l.push(p.x,p.y,p.z),c.push(0,0,1),v.x=(p.x/n+1)/2,v.y=(p.y/n+1)/2,u.push(v.x,v.y)}h+=f}for(let y=0;y<r;y++){const m=y*(i+1);for(let d=0;d<i;d++){const g=d+m,x=g,_=g+i+1,R=g+i+2,T=g+1;o.push(x,_,T),o.push(_,R,T)}}this.setIndex(o),this.setAttribute("position",new Lt(l,3)),this.setAttribute("normal",new Lt(c,3)),this.setAttribute("uv",new Lt(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Df(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class On extends ct{constructor(e=1,n=32,i=16,r=0,s=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:n,heightSegments:i,phiStart:r,phiLength:s,thetaStart:a,thetaLength:o},n=Math.max(3,Math.floor(n)),i=Math.max(2,Math.floor(i));const l=Math.min(a+o,Math.PI);let c=0;const u=[],h=new P,f=new P,p=[],v=[],y=[],m=[];for(let d=0;d<=i;d++){const g=[],x=d/i;let _=0;d===0&&a===0?_=.5/n:d===i&&l===Math.PI&&(_=-.5/n);for(let R=0;R<=n;R++){const T=R/n;h.x=-e*Math.cos(r+T*s)*Math.sin(a+x*o),h.y=e*Math.cos(a+x*o),h.z=e*Math.sin(r+T*s)*Math.sin(a+x*o),v.push(h.x,h.y,h.z),f.copy(h).normalize(),y.push(f.x,f.y,f.z),m.push(T+_,1-x),g.push(c++)}u.push(g)}for(let d=0;d<i;d++)for(let g=0;g<n;g++){const x=u[d][g+1],_=u[d][g],R=u[d+1][g],T=u[d+1][g+1];(d!==0||a>0)&&p.push(x,_,T),(d!==i-1||l<Math.PI)&&p.push(_,R,T)}this.setIndex(p),this.setAttribute("position",new Lt(v,3)),this.setAttribute("normal",new Lt(y,3)),this.setAttribute("uv",new Lt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new On(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class mT extends Qr{static get type(){return"MeshStandardMaterial"}constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new me(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new me(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Hv,this.normalScale=new Ge(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new di,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class r0 extends Ii{static get type(){return"LineDashedMaterial"}constructor(e){super(),this.isLineDashedMaterial=!0,this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(e)}copy(e){return super.copy(e),this.scale=e.scale,this.dashSize=e.dashSize,this.gapSize=e.gapSize,this}}const s0={enabled:!1,files:{},add:function(t,e){this.enabled!==!1&&(this.files[t]=e)},get:function(t){if(this.enabled!==!1)return this.files[t]},remove:function(t){delete this.files[t]},clear:function(){this.files={}}};class gT{constructor(e,n,i){const r=this;let s=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=n,this.onError=i,this.itemStart=function(u){o++,s===!1&&r.onStart!==void 0&&r.onStart(u,a,o),s=!0},this.itemEnd=function(u){a++,r.onProgress!==void 0&&r.onProgress(u,a,o),a===o&&(s=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(u){r.onError!==void 0&&r.onError(u)},this.resolveURL=function(u){return l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,h){return c.push(u,h),this},this.removeHandler=function(u){const h=c.indexOf(u);return h!==-1&&c.splice(h,2),this},this.getHandler=function(u){for(let h=0,f=c.length;h<f;h+=2){const p=c[h],v=c[h+1];if(p.global&&(p.lastIndex=0),p.test(u))return v}return null}}}const vT=new gT;class Nf{constructor(e){this.manager=e!==void 0?e:vT,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,n){const i=this;return new Promise(function(r,s){i.load(e,r,n,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}Nf.DEFAULT_MATERIAL_NAME="__DEFAULT";class xT extends Nf{constructor(e){super(e)}load(e,n,i,r){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,a=s0.get(e);if(a!==void 0)return s.manager.itemStart(e),setTimeout(function(){n&&n(a),s.manager.itemEnd(e)},0),a;const o=fo("img");function l(){u(),s0.add(e,this),n&&n(this),s.manager.itemEnd(e)}function c(h){u(),r&&r(h),s.manager.itemError(e),s.manager.itemEnd(e)}function u(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),s.manager.itemStart(e),o.src=e,o}}class yT extends Nf{constructor(e){super(e)}load(e,n,i,r){const s=new Ht,a=new xT(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){s.image=o,s.needsUpdate=!0,n!==void 0&&n(s)},i,r),s}}class rx extends Xt{constructor(e,n=1){super(),this.isLight=!0,this.type="Light",this.color=new me(e),this.intensity=n}dispose(){}copy(e,n){return super.copy(e,n),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const n=super.toJSON(e);return n.object.color=this.color.getHex(),n.object.intensity=this.intensity,this.groundColor!==void 0&&(n.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(n.object.distance=this.distance),this.angle!==void 0&&(n.object.angle=this.angle),this.decay!==void 0&&(n.object.decay=this.decay),this.penumbra!==void 0&&(n.object.penumbra=this.penumbra),this.shadow!==void 0&&(n.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(n.object.target=this.target.uuid),n}}const Pu=new st,a0=new P,o0=new P;class _T{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ge(512,512),this.map=null,this.mapPass=null,this.matrix=new st,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Tf,this._frameExtents=new Ge(1,1),this._viewportCount=1,this._viewports=[new lt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const n=this.camera,i=this.matrix;a0.setFromMatrixPosition(e.matrixWorld),n.position.copy(a0),o0.setFromMatrixPosition(e.target.matrixWorld),n.lookAt(o0),n.updateMatrixWorld(),Pu.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Pu),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Pu)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const l0=new st,Ta=new P,Du=new P;class MT extends _T{constructor(){super(new En(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Ge(4,2),this._viewportCount=6,this._viewports=[new lt(2,1,1,1),new lt(0,1,1,1),new lt(3,1,1,1),new lt(1,1,1,1),new lt(3,0,1,1),new lt(1,0,1,1)],this._cubeDirections=[new P(1,0,0),new P(-1,0,0),new P(0,0,1),new P(0,0,-1),new P(0,1,0),new P(0,-1,0)],this._cubeUps=[new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,0,1),new P(0,0,-1)]}updateMatrices(e,n=0){const i=this.camera,r=this.matrix,s=e.distance||i.far;s!==i.far&&(i.far=s,i.updateProjectionMatrix()),Ta.setFromMatrixPosition(e.matrixWorld),i.position.copy(Ta),Du.copy(i.position),Du.add(this._cubeDirections[n]),i.up.copy(this._cubeUps[n]),i.lookAt(Du),i.updateMatrixWorld(),r.makeTranslation(-Ta.x,-Ta.y,-Ta.z),l0.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(l0)}}class ST extends rx{constructor(e,n,i=0,r=2){super(e,n),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=r,this.shadow=new MT}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,n){return super.copy(e,n),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class wT extends rx{constructor(e,n){super(e,n),this.isAmbientLight=!0,this.type="AmbientLight"}}const c0=new st;class ET{constructor(e,n,i=0,r=1/0){this.ray=new Tc(e,n),this.near=i,this.far=r,this.camera=null,this.layers=new wf,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,n){this.ray.set(e,n)}setFromCamera(e,n){n.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(n.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(n).sub(this.ray.origin).normalize(),this.camera=n):n.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(n.near+n.far)/(n.near-n.far)).unproject(n),this.ray.direction.set(0,0,-1).transformDirection(n.matrixWorld),this.camera=n):console.error("THREE.Raycaster: Unsupported camera type: "+n.type)}setFromXRController(e){return c0.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(c0),this}intersectObject(e,n=!0,i=[]){return mh(e,this,i,n),i.sort(u0),i}intersectObjects(e,n=!0,i=[]){for(let r=0,s=e.length;r<s;r++)mh(e[r],this,i,n);return i.sort(u0),i}}function u0(t,e){return t.distance-e.distance}function mh(t,e,n,i){let r=!0;if(t.layers.test(e.layers)&&t.raycast(e,n)===!1&&(r=!1),r===!0&&i===!0){const s=t.children;for(let a=0,o=s.length;a<o;a++)mh(s[a],e,n,!0)}}class Aa{constructor(e=1,n=0,i=0){return this.radius=e,this.phi=n,this.theta=i,this}set(e,n,i){return this.radius=e,this.phi=n,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,n,i){return this.radius=Math.sqrt(e*e+n*n+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(tn(n/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:pf}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=pf);const TT=[{id:"10",name:"Sun",category:"star",orderFromSun:0,physical:{meanRadiusKm:695700,equatorialRadiusKm:695700,polarRadiusKm:695700,flattening:0,massKg:19885e26,gmKm3S2:1327124400419394e-4,rotationPeriodHours:609.12,axialTiltDeg:7.25,meanTemperatureK:5778,spectralType:"G2V",colorHex:"#ffdd77"},orbit:{semiMajorAxisKm:0,semiMajorAxisAU:0,eccentricity:0,inclinationDeg:0,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:0,orbitalPeriodDays:0},description:"Yellow dwarf star (G2V) at the gravitational center of the Solar System, containing 99.86% of the system’s total mass."},{id:"199",name:"Mercury",category:"planet",orderFromSun:1,physical:{meanRadiusKm:2439.7,equatorialRadiusKm:2439.7,polarRadiusKm:2439.7,flattening:0,massKg:33011e19,gmKm3S2:22031.78,rotationPeriodHours:1407.6,axialTiltDeg:.034,meanTemperatureK:440,colorHex:"#9c968f"},orbit:{semiMajorAxisKm:57909050,semiMajorAxisAU:.387098,eccentricity:.20563,inclinationDeg:7.005,longitudeAscendingNodeDeg:48.331,argumentPeriapsisDeg:29.124,meanAnomalyAtEpochDeg:174.796,orbitalPeriodDays:87.969},description:"Smallest planet, heavily cratered with silicate crust and large iron core; lacks a substantial atmosphere."},{id:"299",name:"Venus",category:"planet",orderFromSun:2,physical:{meanRadiusKm:6051.8,equatorialRadiusKm:6051.8,polarRadiusKm:6051.8,flattening:0,massKg:48675e20,gmKm3S2:324858.59,rotationPeriodHours:-5832.5,axialTiltDeg:177.36,meanTemperatureK:737,colorHex:"#e3bb7b"},orbit:{semiMajorAxisKm:108208e3,semiMajorAxisAU:.723332,eccentricity:.006772,inclinationDeg:3.39458,longitudeAscendingNodeDeg:76.68,argumentPeriapsisDeg:54.884,meanAnomalyAtEpochDeg:50.115,orbitalPeriodDays:224.701},description:"Terrestrial planet shrouded in dense carbon dioxide atmosphere and sulfuric acid clouds with runaway greenhouse effect."},{id:"399",name:"Earth",category:"planet",orderFromSun:3,physical:{meanRadiusKm:6371,equatorialRadiusKm:6378.137,polarRadiusKm:6356.752,flattening:.003353,massKg:59722e20,gmKm3S2:398600.4418,rotationPeriodHours:23.9344,axialTiltDeg:23.439,meanTemperatureK:288,colorHex:"#4b75a1"},orbit:{semiMajorAxisKm:149598023,semiMajorAxisAU:1,eccentricity:.0167086,inclinationDeg:5e-5,longitudeAscendingNodeDeg:-11.26064,argumentPeriapsisDeg:114.20783,meanAnomalyAtEpochDeg:358.617,orbitalPeriodDays:365.256},description:"Dense rocky world featuring liquid surface water, active plate tectonics, oxygen-rich atmosphere, and planetary biosphere."},{id:"499",name:"Mars",category:"planet",orderFromSun:4,physical:{meanRadiusKm:3389.5,equatorialRadiusKm:3396.2,polarRadiusKm:3376.2,flattening:.00589,massKg:64171e19,gmKm3S2:42828.375,rotationPeriodHours:24.6229,axialTiltDeg:25.19,meanTemperatureK:210,colorHex:"#c16138"},orbit:{semiMajorAxisKm:227939200,semiMajorAxisAU:1.523679,eccentricity:.0934,inclinationDeg:1.85,longitudeAscendingNodeDeg:49.558,argumentPeriapsisDeg:286.502,meanAnomalyAtEpochDeg:19.373,orbitalPeriodDays:686.98},description:"Cold desert world with iron-oxide regolith, giant shield volcanoes (Olympus Mons), rift canyon Valles Marineris, and polar ice caps."},{id:"599",name:"Jupiter",category:"planet",orderFromSun:5,physical:{meanRadiusKm:69911,equatorialRadiusKm:71492,polarRadiusKm:66854,flattening:.06487,massKg:18982e23,gmKm3S2:12668653492e-2,rotationPeriodHours:9.925,axialTiltDeg:3.13,meanTemperatureK:165,colorHex:"#c8a679"},orbit:{semiMajorAxisKm:77857e4,semiMajorAxisAU:5.2044,eccentricity:.048498,inclinationDeg:1.303,longitudeAscendingNodeDeg:100.464,argumentPeriapsisDeg:273.867,meanAnomalyAtEpochDeg:20.02,orbitalPeriodDays:4332.589},description:"Largest planet; hydrogen-helium gas giant displaying zonal atmospheric jet streams, turbulent vortices, and the Great Red Spot."},{id:"699",name:"Saturn",category:"planet",orderFromSun:6,physical:{meanRadiusKm:58232,equatorialRadiusKm:60268,polarRadiusKm:54364,flattening:.09796,massKg:56834e22,gmKm3S2:379311879e-1,rotationPeriodHours:10.656,axialTiltDeg:26.73,meanTemperatureK:134,colorHex:"#dfcf9f"},orbit:{semiMajorAxisKm:143353e4,semiMajorAxisAU:9.5826,eccentricity:.05555,inclinationDeg:2.485,longitudeAscendingNodeDeg:113.665,argumentPeriapsisDeg:339.392,meanAnomalyAtEpochDeg:317.02,orbitalPeriodDays:10759.22},description:"Gas giant celebrated for its extensive, brilliant ring system consisting of water ice particles, dust, and rock."},{id:"799",name:"Uranus",category:"planet",orderFromSun:7,physical:{meanRadiusKm:25362,equatorialRadiusKm:25559,polarRadiusKm:24973,flattening:.02293,massKg:8681e22,gmKm3S2:57939393e-1,rotationPeriodHours:-17.24,axialTiltDeg:97.77,meanTemperatureK:76,colorHex:"#8fe0ea"},orbit:{semiMajorAxisKm:287246e4,semiMajorAxisAU:19.201,eccentricity:.046381,inclinationDeg:.773,longitudeAscendingNodeDeg:74.006,argumentPeriapsisDeg:96.998,meanAnomalyAtEpochDeg:142.238,orbitalPeriodDays:30685.4},description:"Ice giant composed of water, ammonia, and methane ices; extreme 98° axial tilt results in extreme seasonal variations."},{id:"899",name:"Neptune",category:"planet",orderFromSun:8,physical:{meanRadiusKm:24622,equatorialRadiusKm:24764,polarRadiusKm:24341,flattening:.01708,massKg:102413e21,gmKm3S2:68350995e-1,rotationPeriodHours:16.11,axialTiltDeg:28.32,meanTemperatureK:72,colorHex:"#4b70dd"},orbit:{semiMajorAxisKm:449506e4,semiMajorAxisAU:30.047,eccentricity:.009456,inclinationDeg:1.77,longitudeAscendingNodeDeg:131.784,argumentPeriapsisDeg:273.187,meanAnomalyAtEpochDeg:256.228,orbitalPeriodDays:60189},description:"Outermost major planet; deep azure ice giant driven by violent supersonic winds, methane haze, and high-altitude cirrus clouds."}],AT=[{id:"301",name:"Moon",category:"moon",orderFromSun:3,parentId:"399",parentName:"Earth",physical:{meanRadiusKm:1737.4,equatorialRadiusKm:1738.1,polarRadiusKm:1736,flattening:.0012,massKg:7342e19,gmKm3S2:4902.8,rotationPeriodHours:655.728,axialTiltDeg:6.68,meanTemperatureK:250,colorHex:"#c4c3be"},orbit:{semiMajorAxisKm:384400,semiMajorAxisAU:.00257,eccentricity:.0549,inclinationDeg:5.145,longitudeAscendingNodeDeg:125.08,argumentPeriapsisDeg:318.15,meanAnomalyAtEpochDeg:135.27,orbitalPeriodDays:27.321661},description:"Earth’s only natural satellite; tidally locked with extensive lunar maria basalt plains and impact-cratered anorthositic highlands."},{id:"401",name:"Phobos",category:"moon",orderFromSun:4,parentId:"499",parentName:"Mars",physical:{meanRadiusKm:11.26,equatorialRadiusKm:13,polarRadiusKm:9.1,massKg:10659e12,gmKm3S2:71e-5,rotationPeriodHours:7.654,axialTiltDeg:0,colorHex:"#8b847d"},orbit:{semiMajorAxisKm:9376,semiMajorAxisAU:627e-7,eccentricity:.0151,inclinationDeg:1.093,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:180,orbitalPeriodDays:.31891},description:"Innermost and largest moon of Mars; heavily cratered irregular body featuring the massive Stickney impact crater, orbiting inside synchronous orbit."},{id:"402",name:"Deimos",category:"moon",orderFromSun:4,parentId:"499",parentName:"Mars",physical:{meanRadiusKm:6.2,massKg:14762e11,rotationPeriodHours:30.31,axialTiltDeg:0,colorHex:"#999186"},orbit:{semiMajorAxisKm:23463,semiMajorAxisAU:1568e-7,eccentricity:33e-5,inclinationDeg:.93,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:45,orbitalPeriodDays:1.263},description:"Outermost moon of Mars; smooth-looking irregular body coated in a thick regolith blanket that softens surface topography."},{id:"501",name:"Io",category:"moon",orderFromSun:5,parentId:"599",parentName:"Jupiter",physical:{meanRadiusKm:1821.5,massKg:89319e18,gmKm3S2:5959.91,rotationPeriodHours:42.456,axialTiltDeg:0,meanTemperatureK:130,colorHex:"#e5c158"},orbit:{semiMajorAxisKm:421700,semiMajorAxisAU:.002819,eccentricity:.0041,inclinationDeg:.05,longitudeAscendingNodeDeg:43.8,argumentPeriapsisDeg:84.1,meanAnomalyAtEpochDeg:200,orbitalPeriodDays:1.769138},description:"Most volcanically active body in the Solar System, driven by tidal friction from orbital resonance with Europa and Ganymede; coated in sulfur and sulfur dioxide."},{id:"502",name:"Europa",category:"moon",orderFromSun:5,parentId:"599",parentName:"Jupiter",physical:{meanRadiusKm:1560.8,massKg:47998e18,gmKm3S2:3202.73,rotationPeriodHours:85.224,axialTiltDeg:.1,meanTemperatureK:102,colorHex:"#c7bfae"},orbit:{semiMajorAxisKm:670900,semiMajorAxisAU:.004485,eccentricity:.009,inclinationDeg:.47,longitudeAscendingNodeDeg:219.1,argumentPeriapsisDeg:66.8,meanAnomalyAtEpochDeg:120,orbitalPeriodDays:3.551181},description:"Smooth, brilliant water-ice crust fractured by tectonic lineae and cycloids; harbors a deep global subsurface liquid water ocean with astrobiological potential."},{id:"503",name:"Ganymede",category:"moon",orderFromSun:5,parentId:"599",parentName:"Jupiter",physical:{meanRadiusKm:2631.2,massKg:14819e19,gmKm3S2:9887.83,rotationPeriodHours:171.72,axialTiltDeg:.2,meanTemperatureK:110,colorHex:"#8e8379"},orbit:{semiMajorAxisKm:1070400,semiMajorAxisAU:.007155,eccentricity:.0013,inclinationDeg:.2,longitudeAscendingNodeDeg:63.5,argumentPeriapsisDeg:192.4,meanAnomalyAtEpochDeg:60,orbitalPeriodDays:7.154553},description:"Largest natural satellite in the Solar System (larger than Mercury); only known moon with its own intrinsic magnetic field generated by a liquid iron core."},{id:"504",name:"Callisto",category:"moon",orderFromSun:5,parentId:"599",parentName:"Jupiter",physical:{meanRadiusKm:2410.3,massKg:10759e19,gmKm3S2:7179.29,rotationPeriodHours:400.536,axialTiltDeg:0,meanTemperatureK:134,colorHex:"#696057"},orbit:{semiMajorAxisKm:1882700,semiMajorAxisAU:.012585,eccentricity:.0074,inclinationDeg:.28,longitudeAscendingNodeDeg:298.8,argumentPeriapsisDeg:52.6,meanAnomalyAtEpochDeg:10,orbitalPeriodDays:16.689018},description:"Ancient, intensely cratered ice-rock moon; lacks tidal resonance heating, preserving the most heavily cratered surface in the Solar System (including Valhalla impact basin)."},{id:"601",name:"Mimas",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:198.2,massKg:37493e15,rotationPeriodHours:22.6,colorHex:"#b2b2b2"},orbit:{semiMajorAxisKm:185520,semiMajorAxisAU:.00124,eccentricity:.0202,inclinationDeg:1.574,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:90,orbitalPeriodDays:.942422},description:"Dominated by the 130 km Herschel impact crater, giving it a distinctive Death Star appearance; clearing agent for the Cassini Division."},{id:"602",name:"Enceladus",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:252.1,massKg:10802e16,gmKm3S2:7.21,rotationPeriodHours:32.88,colorHex:"#ffffff"},orbit:{semiMajorAxisKm:238029,semiMajorAxisAU:.001591,eccentricity:.0047,inclinationDeg:.019,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:180,orbitalPeriodDays:1.370218},description:'High-albedo icy world with active cryovolcanic geysers erupting water vapor, organic molecules, and ice crystals from south polar "tiger stripe" fractures.'},{id:"603",name:"Tethys",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:531,massKg:61745e16,rotationPeriodHours:45.31,colorHex:"#d8d8d8"},orbit:{semiMajorAxisKm:294660,semiMajorAxisAU:.00197,eccentricity:1e-4,inclinationDeg:1.12,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:270,orbitalPeriodDays:1.887802},description:"Low-density water-ice satellite featuring the vast Odysseus impact crater and the enormous Ithaca Chasma canyon system spanning 2,000 km."},{id:"604",name:"Dione",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:561.4,massKg:10955e17,rotationPeriodHours:65.69,colorHex:"#cac8c5"},orbit:{semiMajorAxisKm:377400,semiMajorAxisAU:.002523,eccentricity:.0022,inclinationDeg:.019,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:45,orbitalPeriodDays:2.736915},description:"Icy moon displaying bright wispy ice cliffs (chasmata) formed by extensional tectonic fractures across its trailing hemisphere."},{id:"605",name:"Rhea",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:763.5,massKg:23065e17,rotationPeriodHours:108.43,colorHex:"#bbb8b4"},orbit:{semiMajorAxisKm:527040,semiMajorAxisAU:.003523,eccentricity:.00125,inclinationDeg:.345,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:160,orbitalPeriodDays:4.5175},description:"Second-largest moon of Saturn; heavily cratered ice body with homogeneous interior composition and tenuous oxygen-carbon dioxide exosphere."},{id:"606",name:"Titan",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:2574.8,equatorialRadiusKm:2574.8,polarRadiusKm:2574.8,flattening:0,massKg:13452e19,gmKm3S2:8978.14,rotationPeriodHours:382.68,axialTiltDeg:0,meanTemperatureK:94,colorHex:"#e5a84b",atmosphere:{surfacePressureBar:1.45,composition:[{gas:"N2",percentage:95},{gas:"CH4",percentage:4.9}]}},orbit:{semiMajorAxisKm:1221870,semiMajorAxisAU:.008168,eccentricity:.0288,inclinationDeg:.3485,longitudeAscendingNodeDeg:28,argumentPeriapsisDeg:180,meanAnomalyAtEpochDeg:240,orbitalPeriodDays:15.945421},description:"Second-largest moon in the Solar System, enveloped by a dense nitrogen-methane atmosphere supporting active liquid methane/ethane lakes, rivers, and rain hydrologic cycles."},{id:"607",name:"Hyperion",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:135,massKg:56199e14,rotationPeriodHours:300,colorHex:"#9c8c7c"},orbit:{semiMajorAxisKm:1481100,semiMajorAxisAU:.0099,eccentricity:.123,inclinationDeg:.568,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:110,orbitalPeriodDays:21.276609},description:"Sponge-like irregularly shaped moon with low density (high porosity) undergoing non-repeating chaotic rotation influenced by Titan."},{id:"608",name:"Iapetus",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:734.3,massKg:18056e17,rotationPeriodHours:1903.92,colorHex:"#847970"},orbit:{semiMajorAxisKm:3561300,semiMajorAxisAU:.023806,eccentricity:.0286,inclinationDeg:15.47,longitudeAscendingNodeDeg:75.6,argumentPeriapsisDeg:275.8,meanAnomalyAtEpochDeg:300,orbitalPeriodDays:79.330183},description:"Two-tone world with extreme albedo dichotomy (pitch-black Cassini Regio leading hemisphere and brilliant ice trailing hemisphere), plus a towering 20 km equatorial ridge."},{id:"705",name:"Miranda",category:"moon",orderFromSun:7,parentId:"799",parentName:"Uranus",physical:{meanRadiusKm:235.8,massKg:659e17,rotationPeriodHours:33.91,colorHex:"#a0a0a0"},orbit:{semiMajorAxisKm:129900,semiMajorAxisAU:868e-6,eccentricity:.0013,inclinationDeg:4.232,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:15,orbitalPeriodDays:1.413479},description:"Exhibits extreme, chaotic terrain with gigantic tectonic rift grabens and chevron-shaped coronae, including Verona Rupes (tallest cliff in the Solar System at 20 km)."},{id:"701",name:"Ariel",category:"moon",orderFromSun:7,parentId:"799",parentName:"Uranus",physical:{meanRadiusKm:578.9,massKg:1251e18,rotationPeriodHours:60.48,colorHex:"#b4b4b4"},orbit:{semiMajorAxisKm:191020,semiMajorAxisAU:.001277,eccentricity:.0012,inclinationDeg:.26,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:75,orbitalPeriodDays:2.520379},description:"Brightest moon of Uranus; dissected by extensive interconnected fault scarps, deep graben valleys, and cryovolcanic flows."},{id:"702",name:"Umbriel",category:"moon",orderFromSun:7,parentId:"799",parentName:"Uranus",physical:{meanRadiusKm:584.7,massKg:1275e18,rotationPeriodHours:99.46,colorHex:"#737373"},orbit:{semiMajorAxisKm:266e3,semiMajorAxisAU:.001778,eccentricity:.0039,inclinationDeg:.205,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:190,orbitalPeriodDays:4.144177},description:"Darkest and most heavily cratered of Uranus’s large satellites, marked by the mysterious bright fluorescent ring floor of crater Wunda."},{id:"703",name:"Titania",category:"moon",orderFromSun:7,parentId:"799",parentName:"Uranus",physical:{meanRadiusKm:788.9,massKg:342e19,rotationPeriodHours:208.94,colorHex:"#9f9994"},orbit:{semiMajorAxisKm:435910,semiMajorAxisAU:.002914,eccentricity:.0011,inclinationDeg:.34,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:310,orbitalPeriodDays:8.706234},description:"Largest moon of Uranus; fractured by vast canyon systems (Messina Chasma) resulting from internal freezing and expansion of a primordial subsurface ocean."},{id:"704",name:"Oberon",category:"moon",orderFromSun:7,parentId:"799",parentName:"Uranus",physical:{meanRadiusKm:761.4,massKg:3014e18,rotationPeriodHours:323.11,colorHex:"#938c86"},orbit:{semiMajorAxisKm:583520,semiMajorAxisAU:.003901,eccentricity:.0014,inclinationDeg:.058,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:40,orbitalPeriodDays:13.463239},description:"Outermost major moon of Uranus; ancient heavily cratered ice-rock surface featuring prominent impact ray craters filled with dark carbonaceous deposits."},{id:"801",name:"Triton",category:"moon",orderFromSun:8,parentId:"899",parentName:"Neptune",physical:{meanRadiusKm:1352.6,massKg:2139e19,gmKm3S2:1427.6,rotationPeriodHours:-141.048,axialTiltDeg:0,meanTemperatureK:38,colorHex:"#e2cfc4"},orbit:{semiMajorAxisKm:354760,semiMajorAxisAU:.002371,eccentricity:16e-6,inclinationDeg:156.885,longitudeAscendingNodeDeg:177,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:120,orbitalPeriodDays:5.876854},description:"Captured Kuiper Belt dwarf planet orbiting Neptune in a retrograde direction; coldest measured surface in the Solar System (38 K) with nitrogen cryogeysers and cantaloupe terrain."},{id:"999",name:"Pluto",category:"dwarf_planet",orderFromSun:9,physical:{meanRadiusKm:1188.3,equatorialRadiusKm:1188.3,polarRadiusKm:1188.3,flattening:0,massKg:1303e19,gmKm3S2:869.6,rotationPeriodHours:-153.2928,axialTiltDeg:122.53,meanTemperatureK:44,colorHex:"#c79f82"},orbit:{semiMajorAxisKm:590638e4,semiMajorAxisAU:39.482,eccentricity:.2488,inclinationDeg:17.16,longitudeAscendingNodeDeg:110.3,argumentPeriapsisDeg:113.76,meanAnomalyAtEpochDeg:14.53,orbitalPeriodDays:90560},description:'Largest known Kuiper Belt dwarf planet; features the high-albedo nitrogen-ice glacier Sputnik Planitia (the "Heart"), water-ice mountains, and blue atmospheric haze.'},{id:"901",name:"Charon",category:"moon",orderFromSun:9,parentId:"999",parentName:"Pluto",physical:{meanRadiusKm:606,massKg:1586e18,rotationPeriodHours:153.29,colorHex:"#99948e"},orbit:{semiMajorAxisKm:19596,semiMajorAxisAU:131e-6,eccentricity:5e-5,inclinationDeg:.001,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:0,orbitalPeriodDays:6.38723},description:"Mutually tidally locked binary companion to Pluto; features a dark reddish tholin polar hood (Mordor Macula) and massive equatorial tectonic chasms."},{id:"1",name:"Ceres",category:"dwarf_planet",orderFromSun:4.5,physical:{meanRadiusKm:469.7,equatorialRadiusKm:487.3,polarRadiusKm:446,flattening:.0847,massKg:93835e16,gmKm3S2:62.63,rotationPeriodHours:9.074,axialTiltDeg:4,meanTemperatureK:168,colorHex:"#88847e"},orbit:{semiMajorAxisKm:41369e4,semiMajorAxisAU:2.767,eccentricity:.0758,inclinationDeg:10.593,longitudeAscendingNodeDeg:80.33,argumentPeriapsisDeg:73.59,meanAnomalyAtEpochDeg:95.99,orbitalPeriodDays:1680.5},description:"Largest body in the asteroid belt, comprising ~33% of its total mass; differentiated protoplanet with an ice-rich mantle and bright sodium-carbonate salt spots (Cerealia Facula in Occator Crater)."},{id:"4",name:"Vesta",category:"asteroid",orderFromSun:4.3,physical:{meanRadiusKm:261.4,equatorialRadiusKm:286.3,polarRadiusKm:229,flattening:.2,massKg:259e18,rotationPeriodHours:5.342,axialTiltDeg:29,colorHex:"#a39b91"},orbit:{semiMajorAxisKm:35326e4,semiMajorAxisAU:2.361,eccentricity:.0887,inclinationDeg:7.14,longitudeAscendingNodeDeg:103.81,argumentPeriapsisDeg:151.2,meanAnomalyAtEpochDeg:20.86,orbitalPeriodDays:1325.5},description:"Brightest asteroid visible from Earth; preserved basaltic differentiated protoplanet with metallic core, silicate mantle, and enormous south-polar impact crater Rheasilvia."},{id:"2",name:"Pallas",category:"asteroid",orderFromSun:4.6,physical:{meanRadiusKm:256.5,massKg:205e18,rotationPeriodHours:7.813,axialTiltDeg:84,colorHex:"#827f7a"},orbit:{semiMajorAxisKm:41475e4,semiMajorAxisAU:2.772,eccentricity:.231,inclinationDeg:34.841,longitudeAscendingNodeDeg:173.08,argumentPeriapsisDeg:310.05,meanAnomalyAtEpochDeg:58.74,orbitalPeriodDays:1686},description:"Third-largest asteroid in the belt; notable for its unusually high 34.8° orbital inclination and dynamic golf-ball-like surface topography."},{id:"10",name:"Hygiea",category:"asteroid",orderFromSun:4.8,physical:{meanRadiusKm:203.6,massKg:832e17,rotationPeriodHours:13.825,colorHex:"#605c57"},orbit:{semiMajorAxisKm:4703e5,semiMajorAxisAU:3.144,eccentricity:.117,inclinationDeg:3.842,longitudeAscendingNodeDeg:283.45,argumentPeriapsisDeg:312.31,meanAnomalyAtEpochDeg:145.2,orbitalPeriodDays:2036},description:"Fourth-largest asteroid and major carbonaceous C-type asteroid; nearly spherical body likely formed from a catastrophic impact parent-body disruption."},{id:"16",name:"Psyche",category:"asteroid",orderFromSun:4.7,physical:{meanRadiusKm:111,massKg:229e17,rotationPeriodHours:4.196,axialTiltDeg:95,colorHex:"#b8aba0"},orbit:{semiMajorAxisKm:4374e5,semiMajorAxisAU:2.924,eccentricity:.134,inclinationDeg:3.095,longitudeAscendingNodeDeg:150.06,argumentPeriapsisDeg:228.41,meanAnomalyAtEpochDeg:185,orbitalPeriodDays:1826},description:"Enormous metallic M-type asteroid thought to be the exposed nickel-iron core of an early protoplanet stripped by hit-and-run collisions; target of NASA’s Psyche mission."},{id:"433",name:"Eros",category:"asteroid",orderFromSun:3.5,physical:{meanRadiusKm:8.42,massKg:6687e12,rotationPeriodHours:5.27,colorHex:"#998d7f"},orbit:{semiMajorAxisKm:2175e5,semiMajorAxisAU:1.454,eccentricity:.2227,inclinationDeg:10.828,longitudeAscendingNodeDeg:304.32,argumentPeriapsisDeg:178.82,meanAnomalyAtEpochDeg:315,orbitalPeriodDays:643.2},description:"Elongated peanut-shaped S-type near-Earth asteroid; historic target orbited and landed upon by the NEAR Shoemaker spacecraft in 2001."},{id:"951",name:"Gaspra",category:"asteroid",orderFromSun:4.1,physical:{meanRadiusKm:6.1,massKg:2e16,rotationPeriodHours:7.042,colorHex:"#a09485"},orbit:{semiMajorAxisKm:3306e5,semiMajorAxisAU:2.21,eccentricity:.173,inclinationDeg:4.102,longitudeAscendingNodeDeg:253.2,argumentPeriapsisDeg:129.6,meanAnomalyAtEpochDeg:70,orbitalPeriodDays:1199.7},description:"First asteroid ever visited by a spacecraft (Galileo flyby in 1991); irregular S-type asteroid with prominent groove-like depressions."},{id:"243",name:"Ida",category:"asteroid",orderFromSun:4.6,physical:{meanRadiusKm:15.7,massKg:42e15,rotationPeriodHours:4.634,colorHex:"#9c9284"},orbit:{semiMajorAxisKm:428e6,semiMajorAxisAU:2.861,eccentricity:.046,inclinationDeg:1.138,longitudeAscendingNodeDeg:324,argumentPeriapsisDeg:109.8,meanAnomalyAtEpochDeg:210,orbitalPeriodDays:1768},description:"Coronis-family asteroid visited by Galileo in 1993, famous for the historic discovery of Dactyl, the first recognized asteroid moon."},{id:"101955",name:"Bennu",category:"asteroid",orderFromSun:3.2,physical:{meanRadiusKm:.242,massKg:7329e7,rotationPeriodHours:4.296,colorHex:"#3a3a3a"},orbit:{semiMajorAxisKm:1685e5,semiMajorAxisAU:1.126,eccentricity:.2037,inclinationDeg:6.035,longitudeAscendingNodeDeg:2.06,argumentPeriapsisDeg:66.22,meanAnomalyAtEpochDeg:101.7,orbitalPeriodDays:436.6},description:"Diamond-shaped carbonaceous rubble-pile near-Earth asteroid sampled by NASA’s OSIRIS-REx spacecraft, delivering pristine solar nebula samples to Earth in 2023."},{id:"162173",name:"Ryugu",category:"asteroid",orderFromSun:3.3,physical:{meanRadiusKm:.448,massKg:45e10,rotationPeriodHours:7.632,colorHex:"#353535"},orbit:{semiMajorAxisKm:178e6,semiMajorAxisAU:1.19,eccentricity:.1902,inclinationDeg:5.884,longitudeAscendingNodeDeg:251.6,argumentPeriapsisDeg:211.4,meanAnomalyAtEpochDeg:220,orbitalPeriodDays:474.5},description:"Spinning-top shaped Cb-type near-Earth asteroid sampled by JAXA’s Hayabusa2 spacecraft, rich in water-bearing minerals and prebiotic amino acids."}],Nu=[...TT,...AT],Ar={id:"SGR_A_STAR",name:"Sagittarius A*",category:"black_hole",orderFromSun:999,physical:{meanRadiusKm:12690400,equatorialRadiusKm:32971e3,polarRadiusKm:12690400,flattening:0,massKg:8544455e30,gmKm3S2:570283e12,rotationPeriodHours:.18,axialTiltDeg:42,meanTemperatureK:1e7,colorHex:"#ffaa33"},orbit:{semiMajorAxisKm:2554e14,semiMajorAxisAU:1707e6,eccentricity:0,inclinationDeg:62.87,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:0,orbitalPeriodDays:23e7*365.25},description:"Supermassive black hole at the gravitational center of the Milky Way galaxy (mass 4.3 million solar masses, distance 27,000 ly). Demonstrates extreme relativistic light bending, an apparent gravitational shadow, a photon sphere, and a glowing synchrotron accretion disk."},si=class si{static getSagittariusAStar(){return Ar}static getAllBodies(){return this.bodies}static getBody(e){return this.bodiesById.get(e)||this.bodiesByName.get(e.toLowerCase())}static getParent(e){if(e.parentId)return this.bodiesById.get(e.parentId)}static getMoonsOf(e){const n=this.getBody(e);return n?this.moonsByParentId.get(n.id)||[]:[]}static getByCategory(e){return this.bodies.filter(n=>n.category===e)}static getPlanets(){return this.getByCategory("planet")}static getMoons(){return this.getByCategory("moon")}static getDwarfPlanets(){return this.getByCategory("dwarf_planet")}static getAsteroids(){return this.getByCategory("asteroid")}static search(e){const n=e.trim().toLowerCase();return n?this.bodies.filter(i=>i.name.toLowerCase().includes(n)||i.category.toLowerCase().includes(n)||i.parentName&&i.parentName.toLowerCase().includes(n)||i.description.toLowerCase().includes(n)):this.bodies}static getStats(){return{total:this.bodies.length,stars:this.getByCategory("star").length,planets:this.getPlanets().length,moons:this.getMoons().length,dwarfPlanets:this.getDwarfPlanets().length,asteroids:this.getAsteroids().length}}};G(si,"bodies",Nu),G(si,"bodiesById",new Map([...Nu.map(e=>[e.id,e]),[Ar.id,Ar]])),G(si,"bodiesByName",new Map([...Nu.map(e=>[e.name.toLowerCase(),e]),["sagittarius a*",Ar],["sgr a*",Ar],["sgr a",Ar],["black hole",Ar]])),G(si,"moonsByParentId",new Map),(()=>{for(const e of si.bodies)e.parentId&&(si.moonsByParentId.has(e.parentId)||si.moonsByParentId.set(e.parentId,[]),si.moonsByParentId.get(e.parentId).push(e))})();let Qt=si;class Ia{static getTexture(e){if(this.cache.has(e))return this.cache.get(e);let n;switch(e){case"Sun":n=this.createSunTexture();break;case"Mercury":n=this.createMercuryTexture();break;case"Venus":n=this.createVenusTexture();break;case"Earth":n=this.createEarthTexture();break;case"EarthClouds":n=this.createEarthCloudsTexture();break;case"Mars":n=this.createMarsTexture();break;case"Jupiter":n=this.createJupiterTexture();break;case"Saturn":n=this.createSaturnTexture();break;case"SaturnRings":n=this.createSaturnRingsTexture();break;case"Uranus":n=this.createUranusTexture();break;case"Neptune":n=this.createNeptuneTexture();break;case"Moon":n=this.createMoonTexture();break;case"Io":n=this.createIoTexture();break;case"Europa":n=this.createEuropaTexture();break;case"Ganymede":n=this.createGanymedeTexture();break;case"Callisto":n=this.createCallistoTexture();break;case"Titan":n=this.createTitanTexture();break;case"Enceladus":n=this.createEnceladusTexture();break;case"Triton":n=this.createTritonTexture();break;case"Pluto":n=this.createPlutoTexture();break;case"Ceres":n=this.createCeresTexture();break;default:n=this.createRockyCrateredTexture(e)}return this.cache.set(e,n),n}static createSunTexture(){const i=document.createElement("canvas");i.width=1024,i.height=512;const r=i.getContext("2d"),s=r.createLinearGradient(0,0,0,512);s.addColorStop(0,"#fff4cc"),s.addColorStop(.5,"#ffbb33"),s.addColorStop(1,"#ff8800"),r.fillStyle=s,r.fillRect(0,0,1024,512);const a=r.getImageData(0,0,1024,512),o=a.data;for(let c=0;c<o.length;c+=4){const u=c/4%1024,h=Math.floor(c/4/1024),f=Math.sin(u*.05)*Math.cos(h*.05),p=Math.sin(u*.12+1.2)*Math.cos(h*.12+.8),v=Math.sin(u*.25)*Math.sin(h*.25),y=f*.5+p*.3+v*.2;o[c]=Math.min(255,Math.max(180,245+y*35)),o[c+1]=Math.min(240,Math.max(120,180+y*55)),o[c+2]=Math.min(180,Math.max(20,60+y*40)),o[c+3]=255}r.putImageData(a,0,0),r.fillStyle="rgba(120, 30, 0, 0.6)";for(let c=0;c<12;c++){const u=(c*85+40)%1024,h=160+c*37%180,f=6+c%5*3;r.beginPath(),r.arc(u,h,f,0,Math.PI*2),r.fill(),r.fillStyle="rgba(60, 10, 0, 0.85)",r.beginPath(),r.arc(u,h,f*.45,0,Math.PI*2),r.fill()}const l=new _t(i);return l.wrapS=Mt,l.wrapT=Qe,l}static createMercuryTexture(){const i=document.createElement("canvas");i.width=1024,i.height=512;const r=i.getContext("2d");r.fillStyle="#78736d",r.fillRect(0,0,1024,512);const s=r.getImageData(0,0,1024,512),a=s.data;for(let l=0;l<a.length;l+=4){const c=l/4%1024,u=Math.floor(l/4/1024),f=120+(Math.sin(c*.08)*Math.cos(u*.08)+Math.sin(c*.2)*Math.sin(u*.2))*18;a[l]=f*.95,a[l+1]=f*.93,a[l+2]=f*.9,a[l+3]=255}r.putImageData(s,0,0);for(let l=0;l<120;l++){const c=(l*79+33)%1024,u=20+l*47%472,h=4+l%15*2;r.fillStyle="rgba(40, 38, 36, 0.4)",r.beginPath(),r.arc(c,u,h,0,Math.PI*2),r.fill(),r.strokeStyle="rgba(210, 205, 200, 0.35)",r.lineWidth=1.5,r.beginPath(),r.arc(c,u,h,Math.PI*.8,Math.PI*1.8),r.stroke()}const o=new _t(i);return o.wrapS=Mt,o.wrapT=Qe,o}static createVenusTexture(){const i=document.createElement("canvas");i.width=1024,i.height=512;const r=i.getContext("2d"),s=r.createLinearGradient(0,0,0,512);s.addColorStop(0,"#f0d8a8"),s.addColorStop(.2,"#ecd096"),s.addColorStop(.5,"#e5c483"),s.addColorStop(.8,"#ecd096"),s.addColorStop(1,"#f0d8a8"),r.fillStyle=s,r.fillRect(0,0,1024,512),r.fillStyle="rgba(215, 180, 110, 0.25)";for(let o=0;o<18;o++){const l=o*28.444444444444443;r.beginPath(),r.moveTo(0,l);for(let c=0;c<=1024;c+=30){const u=Math.sin(c*.015+o)*12+Math.cos(c*.03)*6;r.lineTo(c,l+u)}r.lineTo(1024,l+20),r.lineTo(0,l+20),r.closePath(),r.fill()}const a=new _t(i);return a.wrapS=Mt,a.wrapT=Qe,a}static createEarthTexture(){const i=document.createElement("canvas");i.width=1024,i.height=512;const r=i.getContext("2d");r.fillStyle="#0f274a",r.fillRect(0,0,1024,512);const s=r.createLinearGradient(0,0,0,512);s.addColorStop(0,"rgba(25, 65, 115, 0.4)"),s.addColorStop(.5,"rgba(10, 35, 75, 0.1)"),s.addColorStop(1,"rgba(25, 65, 115, 0.4)"),r.fillStyle=s,r.fillRect(0,0,1024,512),r.fillStyle="#2d5930",r.beginPath(),r.ellipse(1024*.58,512*.38,140,85,.1,0,Math.PI*2),r.ellipse(1024*.53,512*.62,70,95,-.15,0,Math.PI*2),r.fill(),r.beginPath(),r.ellipse(1024*.22,512*.32,95,75,-.2,0,Math.PI*2),r.ellipse(1024*.3,512*.65,60,90,.25,0,Math.PI*2),r.fill(),r.beginPath(),r.ellipse(1024*.82,512*.72,45,35,.1,0,Math.PI*2),r.fill(),r.fillStyle="#9e8548",r.beginPath(),r.ellipse(1024*.52,512*.45,65,30,0,0,Math.PI*2),r.ellipse(1024*.82,512*.72,28,20,0,0,Math.PI*2),r.fill(),r.fillStyle="#f0f6ff",r.beginPath(),r.rect(0,0,1024,28),r.fill(),r.beginPath(),r.rect(0,476,1024,36),r.fill();const a=new _t(i);return a.wrapS=Mt,a.wrapT=Qe,a}static createEarthCloudsTexture(){const i=document.createElement("canvas");i.width=1024,i.height=512;const r=i.getContext("2d");r.clearRect(0,0,1024,512),r.fillStyle="rgba(255, 255, 255, 0.75)";for(let a=0;a<28;a++){const o=(a*65+15)%1024,l=60+a*42%392,c=55+a%7*15,u=18+a%4*6;r.beginPath(),r.ellipse(o,l,c,u,a%5*.2,0,Math.PI*2),r.fill()}const s=new _t(i);return s.wrapS=Mt,s.wrapT=Qe,s}static createMarsTexture(){const i=document.createElement("canvas");i.width=1024,i.height=512;const r=i.getContext("2d");r.fillStyle="#bd532b",r.fillRect(0,0,1024,512),r.fillStyle="rgba(68, 38, 25, 0.45)",r.beginPath(),r.ellipse(1024*.45,512*.52,90,45,.2,0,Math.PI*2),r.ellipse(1024*.75,512*.42,70,50,-.1,0,Math.PI*2),r.ellipse(1024*.15,512*.58,60,35,.15,0,Math.PI*2),r.fill(),r.fillStyle="rgba(165, 80, 45, 0.8)",r.beginPath(),r.arc(1024*.28,512*.45,24,0,Math.PI*2),r.fill(),r.fillStyle="#3a2015",r.beginPath(),r.arc(1024*.28,512*.45,6,0,Math.PI*2),r.fill(),r.fillStyle="#f8f4f0",r.beginPath(),r.ellipse(1024*.5,12,110,12,0,0,Math.PI*2),r.fill(),r.beginPath(),r.ellipse(1024*.5,498,85,14,0,0,Math.PI*2),r.fill();const s=new _t(i);return s.wrapS=Mt,s.wrapT=Qe,s}static createJupiterTexture(){const i=document.createElement("canvas");i.width=1024,i.height=512;const r=i.getContext("2d"),s=["#a88460","#dec8aa","#8f5c35","#f2e2ce","#9e673d","#ebd5be","#82522e","#f5e8da","#916139","#e6cfb8"],a=512/s.length;for(let h=0;h<s.length;h++)r.fillStyle=s[h],r.fillRect(0,h*a,1024,a);for(let h=0;h<s.length;h++){const f=h*a;r.fillStyle=h%2===0?"rgba(80, 45, 20, 0.35)":"rgba(255, 245, 235, 0.35)",r.beginPath(),r.moveTo(0,f);for(let p=0;p<=1024;p+=25){const v=Math.sin(p*.03+h*2)*5+Math.cos(p*.08)*3;r.lineTo(p,f+v)}r.lineTo(1024,f+a*.5),r.lineTo(0,f+a*.5),r.closePath(),r.fill()}const o=1024*.65,l=512*.62,c=r.createRadialGradient(o,l,5,o,l,32);c.addColorStop(0,"#c43d22"),c.addColorStop(.6,"#b5482e"),c.addColorStop(1,"#8f5c35"),r.fillStyle=c,r.beginPath(),r.ellipse(o,l,36,20,-.08,0,Math.PI*2),r.fill(),r.strokeStyle="rgba(255, 255, 255, 0.5)",r.lineWidth=2.5,r.beginPath(),r.ellipse(o+45,l-4,18,9,.1,0,Math.PI*2),r.stroke();const u=new _t(i);return u.wrapS=Mt,u.wrapT=Qe,u}static createSaturnTexture(){const i=document.createElement("canvas");i.width=1024,i.height=512;const r=i.getContext("2d"),s=r.createLinearGradient(0,0,0,512);s.addColorStop(0,"#757c6b"),s.addColorStop(.2,"#ccb98d"),s.addColorStop(.4,"#e8dcba"),s.addColorStop(.5,"#f4ebd2"),s.addColorStop(.6,"#e8dcba"),s.addColorStop(.8,"#ccb98d"),s.addColorStop(1,"#80806a"),r.fillStyle=s,r.fillRect(0,0,1024,512);for(let o=0;o<30;o++){const l=o/30*512;r.fillStyle=o%2===0?"rgba(120, 100, 70, 0.08)":"rgba(255, 250, 240, 0.08)",r.fillRect(0,l,1024,512/30)}const a=new _t(i);return a.wrapS=Mt,a.wrapT=Qe,a}static createSaturnRingsTexture(){const i=document.createElement("canvas");i.width=1024,i.height=64;const r=i.getContext("2d");r.clearRect(0,0,1024,64);const s=r.createLinearGradient(0,0,1024,0);s.addColorStop(0,"rgba(140, 130, 115, 0.0)"),s.addColorStop(.05,"rgba(150, 140, 125, 0.25)"),s.addColorStop(.18,"rgba(160, 150, 130, 0.35)"),s.addColorStop(.2,"rgba(225, 215, 185, 0.85)"),s.addColorStop(.35,"rgba(240, 230, 205, 0.95)"),s.addColorStop(.55,"rgba(230, 220, 195, 0.90)"),s.addColorStop(.57,"rgba(40, 35, 30, 0.02)"),s.addColorStop(.63,"rgba(40, 35, 30, 0.02)"),s.addColorStop(.65,"rgba(215, 205, 180, 0.75)"),s.addColorStop(.8,"rgba(225, 215, 190, 0.80)"),s.addColorStop(.83,"rgba(40, 35, 30, 0.05)"),s.addColorStop(.85,"rgba(220, 210, 185, 0.70)"),s.addColorStop(.95,"rgba(180, 170, 150, 0.35)"),s.addColorStop(1,"rgba(140, 130, 115, 0.0)"),r.fillStyle=s,r.fillRect(0,0,1024,64);const a=new _t(i);return a.wrapS=Qe,a.wrapT=Qe,a}static createUranusTexture(){const i=document.createElement("canvas");i.width=512,i.height=256;const r=i.getContext("2d"),s=r.createLinearGradient(0,0,0,256);return s.addColorStop(0,"#75c8d6"),s.addColorStop(.5,"#8ee0ed"),s.addColorStop(1,"#75c8d6"),r.fillStyle=s,r.fillRect(0,0,512,256),new _t(i)}static createNeptuneTexture(){const i=document.createElement("canvas");i.width=1024,i.height=512;const r=i.getContext("2d"),s=r.createLinearGradient(0,0,0,512);s.addColorStop(0,"#2d4aa0"),s.addColorStop(.3,"#3a62cb"),s.addColorStop(.5,"#4a75e6"),s.addColorStop(.7,"#3a62cb"),s.addColorStop(1,"#2d4aa0"),r.fillStyle=s,r.fillRect(0,0,1024,512),r.fillStyle="rgba(25, 40, 110, 0.35)",r.fillRect(0,512*.55,1024,40),r.fillStyle="#1b2c75",r.beginPath(),r.ellipse(1024*.45,512*.58,45,24,0,0,Math.PI*2),r.fill(),r.fillStyle="rgba(235, 245, 255, 0.8)",r.beginPath(),r.ellipse(1024*.45+50,512*.58-10,22,6,.1,0,Math.PI*2),r.fill();const a=new _t(i);return a.wrapS=Mt,a.wrapT=Qe,a}static createMoonTexture(){const i=document.createElement("canvas");i.width=512,i.height=256;const r=i.getContext("2d");r.fillStyle="#aba8a2",r.fillRect(0,0,512,256);const s=r.getImageData(0,0,512,256),a=s.data;for(let c=0;c<a.length;c+=4){const u=(Math.random()-.5)*24;a[c]=Math.max(0,Math.min(255,a[c]+u)),a[c+1]=Math.max(0,Math.min(255,a[c+1]+u)),a[c+2]=Math.max(0,Math.min(255,a[c+2]+u))}r.putImageData(s,0,0);const o=[{x:512*.35,y:256*.35,rx:55,ry:45,color:"#4a4844"},{x:512*.48,y:256*.38,rx:35,ry:30,color:"#4d4a46"},{x:512*.55,y:256*.48,rx:40,ry:32,color:"#494743"},{x:512*.22,y:256*.42,rx:65,ry:60,color:"#52504b"},{x:512*.42,y:256*.55,rx:38,ry:28,color:"#4b4844"},{x:512*.65,y:256*.45,rx:30,ry:25,color:"#504d49"}];for(const c of o){const u=r.createRadialGradient(c.x,c.y,5,c.x,c.y,c.rx);u.addColorStop(0,c.color),u.addColorStop(.85,c.color),u.addColorStop(1,"rgba(171, 168, 162, 0)"),r.fillStyle=u,r.beginPath(),r.ellipse(c.x,c.y,c.rx,c.ry,0,0,Math.PI*2),r.fill()}r.fillStyle="#ffffff",r.beginPath(),r.arc(512*.42,256*.72,4,0,Math.PI*2),r.fill(),r.strokeStyle="rgba(255, 255, 255, 0.25)",r.lineWidth=1;for(let c=0;c<Math.PI*2;c+=.35)r.beginPath(),r.moveTo(512*.42,256*.72),r.lineTo(512*.42+Math.cos(c)*75,256*.72+Math.sin(c)*75),r.stroke();const l=new _t(i);return l.wrapS=Mt,l.wrapT=Qe,l}static createIoTexture(){const i=document.createElement("canvas");i.width=512,i.height=256;const r=i.getContext("2d");r.fillStyle="#e5c158",r.fillRect(0,0,512,256);for(let o=0;o<40;o++){const l=Math.random()*512,c=Math.random()*256,u=10+Math.random()*25;r.fillStyle=Math.random()>.5?"rgba(215, 140, 30, 0.45)":"rgba(245, 230, 150, 0.4)",r.beginPath(),r.arc(l,c,u,0,Math.PI*2),r.fill()}const s=[{x:512*.25,y:256*.45,r:10,color:"#7a1800"},{x:512*.65,y:256*.35,r:14,color:"#2b1005"},{x:512*.45,y:256*.6,r:8,color:"#8c2505"},{x:512*.8,y:256*.55,r:11,color:"#541505"},{x:512*.15,y:256*.7,r:7,color:"#882200"}];for(const o of s)r.strokeStyle="rgba(200, 50, 0, 0.6)",r.lineWidth=3,r.beginPath(),r.arc(o.x,o.y,o.r*2.2,0,Math.PI*2),r.stroke(),r.fillStyle=o.color,r.beginPath(),r.arc(o.x,o.y,o.r,0,Math.PI*2),r.fill();const a=new _t(i);return a.wrapS=Mt,a.wrapT=Qe,a}static createEuropaTexture(){const i=document.createElement("canvas");i.width=1024,i.height=512;const r=i.getContext("2d");r.fillStyle="#f4f6fa",r.fillRect(0,0,1024,512);const s=r.createLinearGradient(0,0,0,512*.25);s.addColorStop(0,"rgba(230, 240, 250, 0.6)"),s.addColorStop(1,"rgba(244, 246, 250, 0.0)"),r.fillStyle=s,r.fillRect(0,0,1024,512*.25);const a=r.createLinearGradient(0,512,0,512*.75);a.addColorStop(0,"rgba(230, 240, 250, 0.6)"),a.addColorStop(1,"rgba(244, 246, 250, 0.0)"),r.fillStyle=a,r.fillRect(0,512*.75,1024,512*.25);for(let h=0;h<35;h++){const f=h*37%1024,p=512*.3+h*29%(512*.4),v=25+h%5*12,y=r.createRadialGradient(f,p,2,f,p,v);y.addColorStop(0,"rgba(225, 232, 240, 0.25)"),y.addColorStop(1,"rgba(244, 246, 250, 0.0)"),r.fillStyle=y,r.beginPath(),r.arc(f,p,v,0,Math.PI*2),r.fill()}const o=[{x:1024*.28,y:512*.45,rx:42,ry:28},{x:1024*.62,y:512*.52,rx:36,ry:24},{x:1024*.45,y:512*.35,rx:30,ry:20},{x:1024*.82,y:512*.42,rx:38,ry:25}];for(const h of o){const f=r.createRadialGradient(h.x,h.y,5,h.x,h.y,h.rx);f.addColorStop(0,"rgba(175, 135, 105, 0.16)"),f.addColorStop(.7,"rgba(160, 125, 98, 0.10)"),f.addColorStop(1,"rgba(244, 246, 250, 0.0)"),r.fillStyle=f,r.beginPath(),r.ellipse(h.x,h.y,h.rx,h.ry,.2,0,Math.PI*2),r.fill()}let l=42;const c=()=>(l=l*16807%2147483647,(l-1)/2147483646);for(let h=0;h<32;h++){const f=c()*1024,p=512*.15+c()*512*.7,v=80+c()*160,y=(c()-.5)*Math.PI*1.4,m=f+Math.cos(y)*(v*.5)+(c()-.5)*40,d=p+Math.sin(y)*(v*.5)+(c()-.5)*40,g=f+Math.cos(y)*v,x=p+Math.sin(y)*v;r.strokeStyle="rgba(155, 115, 90, 0.14)",r.lineWidth=4,r.beginPath(),r.moveTo(f,p),r.quadraticCurveTo(m,d,g,x),r.stroke(),r.strokeStyle="rgba(115, 80, 65, 0.45)",r.lineWidth=1.2,r.beginPath(),r.moveTo(f,p),r.quadraticCurveTo(m,d,g,x),r.stroke(),r.strokeStyle="rgba(255, 255, 255, 0.55)",r.lineWidth=.8,r.beginPath(),r.moveTo(f+1,p+1),r.quadraticCurveTo(m+1,d+1,g+1,x+1),r.stroke()}r.strokeStyle="rgba(130, 95, 78, 0.22)",r.lineWidth=.7;for(let h=0;h<50;h++){const f=c()*1024,p=c()*512,v=30+c()*60,y=c()*Math.PI*2;r.beginPath(),r.moveTo(f,p),r.lineTo(f+Math.cos(y)*v,p+Math.sin(y)*v),r.stroke()}const u=new _t(i);return u.wrapS=Mt,u.wrapT=Qe,u}static createGanymedeTexture(){const i=document.createElement("canvas");i.width=512,i.height=256;const r=i.getContext("2d");r.fillStyle="#6e655c",r.fillRect(0,0,512,256),r.fillStyle="#9c9288";for(let a=0;a<14;a++){const o=(a*20+10)%256;r.fillRect(0,o,512,8+a%4*3)}r.strokeStyle="rgba(230, 230, 230, 0.35)",r.lineWidth=1;for(let a=0;a<256;a+=6)r.beginPath(),r.moveTo(0,a),r.lineTo(512,a+Math.sin(a*.1)*8),r.stroke();const s=new _t(i);return s.wrapS=Mt,s.wrapT=Qe,s}static createCallistoTexture(){const i=document.createElement("canvas");i.width=512,i.height=256;const r=i.getContext("2d");r.fillStyle="#4e4741",r.fillRect(0,0,512,256);for(let l=0;l<180;l++){const c=Math.random()*512,u=Math.random()*256,h=2+Math.random()*8;r.fillStyle="#2f2a26",r.beginPath(),r.arc(c,u,h,0,Math.PI*2),r.fill(),r.strokeStyle="rgba(220, 225, 235, 0.7)",r.lineWidth=1,r.beginPath(),r.arc(c,u,h,0,Math.PI),r.stroke()}const s=512*.45,a=256*.4;r.strokeStyle="rgba(200, 210, 220, 0.4)";for(let l=8;l<=55;l+=7)r.beginPath(),r.arc(s,a,l,0,Math.PI*2),r.stroke();const o=new _t(i);return o.wrapS=Mt,o.wrapT=Qe,o}static createTitanTexture(){const i=document.createElement("canvas");i.width=512,i.height=256;const r=i.getContext("2d"),s=r.createLinearGradient(0,0,0,256);s.addColorStop(0,"#c78028"),s.addColorStop(.2,"#dba046"),s.addColorStop(.5,"#e8b258"),s.addColorStop(.8,"#dba046"),s.addColorStop(1,"#c07820"),r.fillStyle=s,r.fillRect(0,0,512,256),r.fillStyle="rgba(210, 130, 40, 0.2)",r.fillRect(0,256*.35,512,25),r.fillRect(0,256*.6,512,25);const a=new _t(i);return a.wrapS=Mt,a.wrapT=Qe,a}static createEnceladusTexture(){const i=document.createElement("canvas");i.width=512,i.height=256;const r=i.getContext("2d");r.fillStyle="#f6f8fb",r.fillRect(0,0,512,256),r.strokeStyle="#68a0c8",r.lineWidth=2;for(let a=0;a<4;a++){const o=217.6+a*5;r.beginPath(),r.moveTo(512*.3,o),r.bezierCurveTo(512*.45,o+4,512*.55,o-4,512*.7,o),r.stroke()}const s=new _t(i);return s.wrapS=Mt,s.wrapT=Qe,s}static createTritonTexture(){const i=document.createElement("canvas");i.width=512,i.height=256;const r=i.getContext("2d");r.fillStyle="#decac0",r.fillRect(0,0,512,256),r.fillStyle="rgba(165, 135, 125, 0.35)";for(let a=10;a<512;a+=16)for(let o=10;o<256*.6;o+=14)r.beginPath(),r.arc(a+o%8,o,5,0,Math.PI*2),r.fill();r.fillStyle="rgba(50, 40, 35, 0.6)";for(let a=0;a<8;a++){const o=102.4+a*45,l=256*.75+a%3*8;r.beginPath(),r.ellipse(o,l,12,3,.4,0,Math.PI*2),r.fill()}const s=new _t(i);return s.wrapS=Mt,s.wrapT=Qe,s}static createPlutoTexture(){const i=document.createElement("canvas");i.width=512,i.height=256;const r=i.getContext("2d");r.fillStyle="#8f4f35",r.fillRect(0,0,512,256),r.fillStyle="#421f14",r.fillRect(0,256*.5,512*.45,45);const s=512*.62,a=256*.42;r.fillStyle="#f0e6dc",r.beginPath(),r.ellipse(s-16,a,28,35,-.2,0,Math.PI*2),r.fill(),r.ellipse(s+16,a,26,32,.2,0,Math.PI*2),r.fill();const o=new _t(i);return o.wrapS=Mt,o.wrapT=Qe,o}static createCeresTexture(){const i=document.createElement("canvas");i.width=512,i.height=256;const r=i.getContext("2d");r.fillStyle="#6e6962",r.fillRect(0,0,512,256);for(let l=0;l<90;l++){const c=Math.random()*512,u=Math.random()*256,h=2+Math.random()*6;r.fillStyle="#48443e",r.beginPath(),r.arc(c,u,h,0,Math.PI*2),r.fill()}const s=512*.52,a=256*.44;r.fillStyle="#3a3630",r.beginPath(),r.arc(s,a,14,0,Math.PI*2),r.fill(),r.fillStyle="#ffffff",r.beginPath(),r.arc(s,a,3.5,0,Math.PI*2),r.fill();const o=new _t(i);return o.wrapS=Mt,o.wrapT=Qe,o}static createRockyCrateredTexture(e){const r=document.createElement("canvas");r.width=256,r.height=128;const s=r.getContext("2d"),a=e==="Bennu"||e==="Ryugu"||e==="Hygiea",o=e==="Psyche";s.fillStyle=a?"#323232":o?"#948a7e":"#7a746d",s.fillRect(0,0,256,128);for(let c=0;c<50;c++){const u=Math.random()*256,h=Math.random()*128,f=2+Math.random()*5;s.fillStyle=a?"#1a1a1a":"#4e4842",s.beginPath(),s.arc(u,h,f,0,Math.PI*2),s.fill(),s.strokeStyle=a?"#505050":"rgba(200, 195, 185, 0.5)",s.lineWidth=1,s.beginPath(),s.arc(u,h,f,0,Math.PI),s.stroke()}const l=new _t(r);return l.wrapS=Mt,l.wrapT=Qe,l}static createGenericTexture(e){const n=document.createElement("canvas");n.width=64,n.height=64;const i=n.getContext("2d");return i.fillStyle=e,i.fillRect(0,0,64,64),new _t(n)}}G(Ia,"cache",new Map);const Ir=class Ir{constructor(){G(this,"loader",new yT);G(this,"customLoader",null);G(this,"cache",new Map);G(this,"inFlightRequests",new Map);G(this,"maxAnisotropy",8);G(this,"baseUrl",(typeof import.meta<"u"&&"/solaris/"||"/").replace(/\/?$/,"/"))}resolveUrl(e){if(!e)return"";if(e.startsWith("http://")||e.startsWith("https://")||e.startsWith("data:")||e.startsWith("blob:"))return e;const n=e.replace(/^(\.\/)+/,"").replace(/^\/+/,"").replace(/\/+/g,"/");return`${this.baseUrl.replace(/\/+$/,"/")}${n}`}static getInstance(){return Ir.instance||(Ir.instance=new Ir),Ir.instance}setLoader(e){this.customLoader=e}setBaseUrl(e){this.baseUrl=e.replace(/\/?$/,"/")}setMaxAnisotropy(e){this.maxAnisotropy=Math.max(1,e);for(const n of this.cache.values())n.anisotropy=this.maxAnisotropy,n.needsUpdate=!0}isCached(e){const n=this.resolveUrl(e);return this.cache.has(n)}getCacheSize(){return this.cache.size}evictFromCache(e,n=!1){const i=this.resolveUrl(e),r=this.cache.get(i);return r?(this.cache.delete(i),this.inFlightRequests.delete(i),n&&r.dispose(),!0):!1}clearCache(e=!1){if(e)for(const n of this.cache.values())n.dispose();this.cache.clear(),this.inFlightRequests.clear()}resetForTesting(){this.clearCache(!1),this.customLoader=null,this.baseUrl=(typeof import.meta<"u"&&"/solaris/"||"/").replace(/\/?$/,"/")}loadTexture(e,n=!0,i){const r=this.resolveUrl(e),s=this.cache.get(r);if(s)return s;if(typeof document>"u"&&!this.customLoader){const u=new Ht;return u.colorSpace=n?Vt:Un,this.cache.set(r,u),u}const a=this.customLoader||this.loader;let o=!1,l=null;const c=a.load(r,u=>{u.colorSpace=n?Vt:Un,u.generateMipmaps=!0,u.minFilter=Zn,u.magFilter=gn,u.anisotropy=this.maxAnisotropy,u.needsUpdate=!0},void 0,u=>{if(o=!0,console.warn(`[TexturePipeline] Fallback activated for ${e} (${r}):`,u),this.cache.delete(r),this.inFlightRequests.delete(r),i&&l)try{const h=Ia.getTexture(i);h&&h.image&&(l.image=h.image,l.needsUpdate=!0)}catch(h){console.warn("[TexturePipeline] Fallback generation error:",h)}});if(l=c,o&&i)try{const u=Ia.getTexture(i);u&&u.image&&(l.image=u.image,l.needsUpdate=!0)}catch(u){console.warn("[TexturePipeline] Fallback generation error:",u)}return c.colorSpace=n?Vt:Un,c.generateMipmaps=!0,c.minFilter=Zn,c.magFilter=gn,c.anisotropy=this.maxAnisotropy,o||this.cache.set(r,c),c}loadTextureAsync(e,n=!0,i){const r=this.resolveUrl(e),s=this.cache.get(r);if(s)return Promise.resolve(s);const a=this.inFlightRequests.get(r);if(a)return a;if(typeof document>"u"&&!this.customLoader){const l=this.loadTexture(e,n,i);return Promise.resolve(l)}const o=new Promise((l,c)=>{(this.customLoader||this.loader).load(r,h=>{h.colorSpace=n?Vt:Un,h.generateMipmaps=!0,h.minFilter=Zn,h.magFilter=gn,h.anisotropy=this.maxAnisotropy,h.needsUpdate=!0,this.cache.set(r,h),this.inFlightRequests.delete(r),l(h)},void 0,h=>{if(this.cache.delete(r),this.inFlightRequests.delete(r),i){console.warn(`[TexturePipeline] Fallback activated for ${e}:`,h);const f=Ia.getTexture(i);l(f)}else c(h)})});return this.inFlightRequests.set(r,o),o}getPlanetTextures(e){switch(e){case"Sun":return{map:this.loadTexture("/textures/2k_sun.jpg",!0,"Sun"),emissiveMap:this.loadTexture("/textures/2k_sun.jpg",!0,"Sun")};case"Mercury":return{map:this.loadTexture("/textures/2k_mercury.jpg",!0,"Mercury")};case"Venus":return{map:this.loadTexture("/textures/2k_venus_atmosphere.jpg",!0,"Venus")};case"Earth":return{map:this.loadTexture("/textures/2k_earth_daymap.jpg",!0,"Earth"),normalMap:this.loadTexture("/textures/earth_normal_2048.jpg",!1),nightMap:this.loadTexture("/textures/2k_earth_nightmap.jpg",!0),cloudsMap:this.loadTexture("/textures/2k_earth_clouds.jpg",!0,"EarthClouds")};case"Moon":return{map:this.loadTexture("/textures/2k_moon.jpg",!0,"Moon")};case"Mars":return{map:this.loadTexture("/textures/2k_mars.jpg",!0,"Mars")};case"Jupiter":return{map:this.loadTexture("/textures/2k_jupiter.jpg",!0,"Jupiter")};case"Saturn":return{map:this.loadTexture("/textures/2k_saturn.jpg",!0,"Saturn"),ringAlphaMap:this.loadTexture("/textures/2k_saturn_ring_alpha.png",!1,"SaturnRings")};case"Uranus":return{map:this.loadTexture("/textures/2k_uranus.jpg",!0,"Uranus")};case"Neptune":return{map:this.loadTexture("/textures/2k_neptune.jpg",!0,"Neptune")};default:return{map:Ia.getTexture(e)}}}getMilkyWayTexture(){return this.loadTexture("/textures/gaia_sky.jpg",!0)}getMilkyWayDiskTexture(){return this.loadTexture("/textures/milky_way_disk.png",!0)}};G(Ir,"instance");let Qs=Ir;class Iu{static createPhotosphereMaterial(e){return new ut({uniforms:{sunTexture:{value:e},time:{value:0}},vertexShader:`
        varying vec2 vUv;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPosition;
        varying vec3 vLocalPosition;

        void main() {
          vUv = uv;
          vLocalPosition = position;
          vWorldNormal = normalize(mat3(modelMatrix) * normal);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,fragmentShader:`
        uniform sampler2D sunTexture;
        uniform float time;

        varying vec2 vUv;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPosition;
        varying vec3 vLocalPosition;

        // Hash and 3D Simplex-like noise anchored to local sphere surface
        vec3 hash33(vec3 p) {
          p = fract(p * vec3(443.897, 441.423, 437.195));
          p += dot(p, p.yxz + 19.19);
          return fract((p.xxy + p.yxx) * p.zyx);
        }

        float snoise(vec3 p) {
          vec3 i = floor(p);
          vec3 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);

          float n000 = dot(hash33(i + vec3(0.0, 0.0, 0.0)) - 0.5, f - vec3(0.0, 0.0, 0.0));
          float n100 = dot(hash33(i + vec3(1.0, 0.0, 0.0)) - 0.5, f - vec3(1.0, 0.0, 0.0));
          float n010 = dot(hash33(i + vec3(0.0, 1.0, 0.0)) - 0.5, f - vec3(0.0, 1.0, 0.0));
          float n110 = dot(hash33(i + vec3(1.0, 1.0, 0.0)) - 0.5, f - vec3(1.0, 1.0, 0.0));
          float n001 = dot(hash33(i + vec3(0.0, 0.0, 1.0)) - 0.5, f - vec3(0.0, 0.0, 1.0));
          float n101 = dot(hash33(i + vec3(1.0, 0.0, 1.0)) - 0.5, f - vec3(1.0, 0.0, 1.0));
          float n011 = dot(hash33(i + vec3(0.0, 1.0, 1.0)) - 0.5, f - vec3(0.0, 1.0, 1.0));
          float n111 = dot(hash33(i + vec3(1.0, 1.0, 1.0)) - 0.5, f - vec3(1.0, 1.0, 1.0));

          return mix(
            mix(mix(n000, n100, f.x), mix(n010, n110, f.x), f.y),
            mix(mix(n001, n101, f.x), mix(n011, n111, f.x), f.y),
            f.z
          );
        }

        // Cellular / Voronoi granulation approximation for solar convection cells
        float solarGranulation(vec3 p) {
          vec3 pi = floor(p);
          vec3 pf = fract(p);
          float minDist = 1.0;

          for (int x = -1; x <= 1; x++) {
            for (int y = -1; y <= 1; y++) {
              for (int z = -1; z <= 1; z++) {
                vec3 g = vec3(float(x), float(y), float(z));
                vec3 o = hash33(pi + g);
                vec3 delta = g + o - pf;
                float d = dot(delta, delta);
                minDist = min(minDist, d);
              }
            }
          }
          return sqrt(minDist);
        }

        void main() {
          vec3 norm = normalize(vWorldNormal);
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);
          float mu = clamp(dot(norm, viewDir), 0.0, 1.0);

          // 1. Physically calibrated solar limb darkening: I(mu) = I0 * (1.0 - u*(1.0-mu) - v*(1.0-mu)^2)
          // Coefficients for solar continuum: u = 0.48, v = 0.16
          float limbDarkening = 1.0 - 0.48 * (1.0 - mu) - 0.16 * pow(1.0 - mu, 2.0);
          limbDarkening = clamp(limbDarkening, 0.32, 1.0);

          // 2. Multi-scale plasma turbulence anchored to the rotating sphere
          vec3 localP = vLocalPosition * 14.0; // Scaled to granulation frequency
          float tSlow = time * 0.08;
          float tFast = time * 0.22;

          // Layer 1: Convective drift
          vec3 flow1 = localP + vec3(sin(tSlow + localP.y * 0.5), tSlow * 0.7, cos(tSlow + localP.x * 0.5));
          float noise1 = snoise(flow1 * 0.4);

          // Layer 2: Medium-scale turbulent boiling
          vec3 flow2 = localP * 1.8 + vec3(-tFast * 0.5, tFast * 0.8, sin(tFast));
          float noise2 = snoise(flow2 * 0.8);

          // Layer 3: High-frequency solar granulation (convection cells with dark intergranular lanes)
          float granules = solarGranulation(localP * 3.2 + vec3(sin(tFast * 0.4) * 0.3, tFast * 0.3, 0.0));
          // Granule centers are hot & bright; borders are cooler intergranular lanes
          float granulePattern = smoothstep(0.12, 0.85, granules);

          // 3. Photographic texture baseline with animated turbulent UV offset
          vec2 animUv = vUv + vec2(noise1 * 0.015, noise2 * 0.012);
          vec4 baseTex = texture2D(sunTexture, animUv);

          // 4. Photosphere Color Temperature Ramp:
          // Bright granules: ~6,400 K (warm white-gold)
          vec3 colBright = vec3(1.0, 0.96, 0.84) * 1.35;
          // Mid-surface: ~5,778 K (solar golden yellow)
          vec3 colMid = vec3(1.0, 0.78, 0.32);
          // Intergranular lanes: ~4,500 K (fiery deep orange-red)
          vec3 colLanes = vec3(0.85, 0.35, 0.08);
          // Magnetic active regions / sunspots: cooler dark umbra
          vec3 colSunspot = vec3(0.38, 0.12, 0.02);

          // Synthesize nuanced plasma temperature
          float tempMix = baseTex.r * 0.6 + (noise1 * 0.25 + noise2 * 0.15) + granulePattern * 0.22;
          tempMix = clamp(tempMix, 0.0, 1.0);

          vec3 plasmaCol;
          if (tempMix < 0.25) {
            plasmaCol = mix(colSunspot, colLanes, tempMix / 0.25);
          } else if (tempMix < 0.70) {
            plasmaCol = mix(colLanes, colMid, (tempMix - 0.25) / 0.45);
          } else {
            plasmaCol = mix(colMid, colBright, (tempMix - 0.70) / 0.30);
          }

          // Multiply by physical limb darkening
          vec3 finalColor = plasmaCol * limbDarkening;

          // Controlled luminance boost for realistic star brilliance
          gl_FragColor = vec4(finalColor * 1.25, 1.0);
        }
      `})}static createCoronaMaterial(e=14){return new ut({uniforms:{sunCenter:{value:new P(0,0,0)},sunRadius:{value:e},time:{value:0}},vertexShader:`
        varying vec3 vWorldNormal;
        varying vec3 vWorldPosition;

        void main() {
          vWorldNormal = normalize(mat3(modelMatrix) * normal);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,fragmentShader:`
        uniform vec3 sunCenter;
        uniform float sunRadius;
        uniform float time;

        varying vec3 vWorldNormal;
        varying vec3 vWorldPosition;

        void main() {
          // Camera ray toward this fragment on the corona shell
          vec3 viewRay = normalize(vWorldPosition - cameraPosition);
          vec3 toSun = sunCenter - cameraPosition;
          float t = dot(toSun, viewRay);
          if (t <= 0.0) discard;

          // Closest approach of the camera sightline to the Sun's center
          vec3 closest = cameraPosition + viewRay * t;
          vec3 offset = closest - sunCenter;
          float distToCenter = length(offset);

          // Impact parameter normalized by Sun radius (1.0 = solar limb)
          float rNorm = distToCenter / sunRadius;
          if (rNorm < 0.99) discard; // Sun photosphere occludes inner corona

          // Pure continuous C2 exponential decay reaching exact 0.0 at 2.4 R_sun
          float maxDist = 1.4; // Extends from 1.0 to 2.4
          float limbDist = clamp((rNorm - 1.0) / maxDist, 0.0, 1.0);
          float radialFade = exp(-limbDist * 5.0) * pow(1.0 - limbDist, 2.2);

          // Magnetic streamer rays projected on camera view plane
          vec3 camRight = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
          vec3 camUp = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
          float px = dot(offset, camRight);
          float py = dot(offset, camUp);
          float angle = atan(py, px);

          float streamers = sin(angle * 12.0 + time * 0.12) * 0.18 +
                            cos(angle * 26.0 - time * 0.18) * 0.10 +
                            sin(angle * 44.0 + time * 0.32) * 0.06;
          streamers = max(0.0, streamers);

          // Coronal color gradient (Thomson electron scattering into ionized solar wind)
          vec3 colInner = vec3(1.0, 0.92, 0.76); // Warm golden-white
          vec3 colMid = vec3(1.0, 0.65, 0.22);   // Radiant amber gold
          vec3 colOuter = vec3(0.85, 0.35, 0.08); // Distant solar wind fringe

          vec3 coronaCol = mix(colInner, colMid, smoothstep(0.0, 0.40, limbDist));
          coronaCol = mix(coronaCol, colOuter, smoothstep(0.40, 1.0, limbDist));

          float intensity = radialFade * (1.1 + streamers * 1.3);
          intensity = clamp(intensity, 0.0, 1.0);

          gl_FragColor = vec4(coronaCol * 1.35, intensity * 0.88);
        }
      `,blending:Bt,side:It,transparent:!0,depthWrite:!1})}static createProminencesMaterial(){return new ut({uniforms:{time:{value:0}},vertexShader:`
        varying vec2 vUv;
        varying vec3 vWorldPosition;
        varying vec3 vLocalPosition;

        void main() {
          vUv = uv;
          vLocalPosition = position;
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,fragmentShader:`
        uniform float time;
        varying vec2 vUv;
        varying vec3 vWorldPosition;
        varying vec3 vLocalPosition;

        void main() {
          // Arc coordinate: u is around the loop (0 to 1), v is across thickness (0 to 1)
          float u = vUv.x;
          float v = vUv.y;

          // Parabolic magnetic loop profile: high at u=0.5, anchored at u=0 and u=1
          float loopHeight = sin(u * 3.14159265);
          // Distance from central magnetic field line
          float distFromCenter = abs(v - 0.5) * 2.0;
          float filament = exp(-distFromCenter * distFromCenter * 4.5);

          // Plasma temporal flow: filaments drift along magnetic field lines
          float flow = sin(u * 16.0 - time * 2.5) * 0.3 + cos(u * 28.0 + time * 1.8) * 0.2;
          float pulse = 0.8 + 0.2 * sin(time * 0.8 + vLocalPosition.x);

          // Chromospheric H-alpha (656.3 nm) ruby-pink and core hot-plasma white
          vec3 colRoot = vec3(1.0, 0.95, 0.85); // Hot white loop footpoint
          vec3 colPlasma = vec3(1.0, 0.32, 0.12); // H-alpha red-orange
          vec3 colTip = vec3(0.95, 0.18, 0.08); // Cooler top arc

          vec3 color = mix(colPlasma, colRoot, filament * (1.0 - loopHeight * 0.7));
          color = mix(color, colTip, loopHeight * 0.5);

          float alpha = filament * loopHeight * pulse * (0.85 + flow);
          alpha = clamp(alpha, 0.0, 1.0);

          gl_FragColor = vec4(color * 1.8, alpha * 0.9);
        }
      `,blending:Bt,side:cn,transparent:!0,depthWrite:!1})}static createProminencesGroup(e){const n=new Wt;n.name="solar_prominences";const i=this.createProminencesMaterial();return[{lat:.35,lon:.2,scale:.14,angle:.4},{lat:-.42,lon:1.1,scale:.18,angle:-.3},{lat:.15,lon:2.3,scale:.11,angle:.6},{lat:-.25,lon:3.4,scale:.22,angle:-.5},{lat:.55,lon:4.2,scale:.15,angle:.2},{lat:-.1,lon:5.1,scale:.19,angle:.7},{lat:.4,lon:5.8,scale:.12,angle:-.4}].forEach((s,a)=>{const o=new fr(1,1,32,8),l=o.attributes.position,c=o.attributes.uv,u=s.scale*e*2.2,h=s.scale*e*1.6,f=s.scale*e*.28;for(let _=0;_<l.count;_++){const R=c.getX(_),T=c.getY(_),A=(R-.5)*u,b=Math.sin(R*Math.PI)*h,w=(T-.5)*f;l.setXYZ(_,A,b,w)}o.computeVertexNormals();const p=new et(o,i);p.name=`prominence_loop_${a}`;const v=Math.cos(s.lat),y=Math.sin(s.lat),m=e*v*Math.cos(s.lon),d=e*y,g=e*v*Math.sin(s.lon);p.position.set(m,d,g);const x=new P(m,d,g).normalize();p.quaternion.setFromUnitVectors(new P(0,1,0),x),p.rotateOnAxis(new P(0,1,0),s.angle),n.add(p)}),n}}const sx={Earth:{radiusScale:1.008,rayleighColor:new me(.24,.52,.92),twilightColor:new me(.95,.42,.16),density:.65,falloffPower:4.5,mieG:.72},Venus:{radiusScale:1.012,rayleighColor:new me(.92,.86,.64),twilightColor:new me(.85,.58,.32),density:1.1,falloffPower:3.5,mieG:.65},Mars:{radiusScale:1.004,rayleighColor:new me(.65,.55,.5),twilightColor:new me(.35,.5,.7),density:.12,falloffPower:6,mieG:.55},Uranus:{radiusScale:1.014,rayleighColor:new me(.48,.85,.82),twilightColor:new me(.32,.65,.72),density:.75,falloffPower:3.8,mieG:.7},Neptune:{radiusScale:1.014,rayleighColor:new me(.2,.45,.95),twilightColor:new me(.15,.3,.75),density:.8,falloffPower:3.8,mieG:.7}};class d0{static createAtmosphereMaterial(e){const n=sx[e];return n?new ut({uniforms:{rayleighColor:{value:n.rayleighColor},twilightColor:{value:n.twilightColor},density:{value:n.density},falloffPower:{value:n.falloffPower},mieG:{value:n.mieG}},vertexShader:`
        varying vec3 vWorldNormal;
        varying vec3 vWorldPosition;

        void main() {
          vWorldNormal = normalize(mat3(modelMatrix) * normal);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,fragmentShader:`
        uniform vec3 rayleighColor;
        uniform vec3 twilightColor;
        uniform float density;
        uniform float falloffPower;
        uniform float mieG;

        varying vec3 vWorldNormal;
        varying vec3 vWorldPosition;

        void main() {
          vec3 worldNormal = normalize(vWorldNormal);
          // Sun is located at world origin (0, 0, 0)
          vec3 sunDir = normalize(-vWorldPosition);
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);

          // 1. Fresnel limb optical path: peaks steeply at the grazing horizon silhouette
          float cosTheta = clamp(abs(dot(worldNormal, viewDir)), 0.0, 1.0);
          float limbFresnel = pow(1.0 - cosTheta, falloffPower);

          // 2. Solar illumination factor:
          // Strictly extinguished on the dark hemisphere, eliminating fake neon rim
          float sunDot = dot(worldNormal, sunDir);
          float dayFactor = smoothstep(-0.02, 0.28, sunDot);

          // 3. Henyey-Greenstein Mie forward scattering phase function:
          float cosViewSun = dot(viewDir, sunDir);
          float g = mieG;
          float miePhase = (1.0 - g * g) / pow(1.0 + g * g - 2.0 * g * cosViewSun, 1.5) * 0.15;
          float forwardScatter = max(0.0, miePhase) * dayFactor;

          // 4. Twilight reddening / sunset ember fringe at the terminator:
          float terminatorBand = smoothstep(-0.05, 0.08, sunDot) * (1.0 - smoothstep(0.08, 0.28, sunDot));
          vec3 scatterColor = mix(rayleighColor, twilightColor, terminatorBand * 0.75);

          // 5. Total scattered radiance
          float intensity = limbFresnel * density * (pow(dayFactor, 1.4) + forwardScatter * 1.2);
          if (intensity < 0.002) {
            discard; // Absolute dark-side transparency with zero overhead or halo artifacts
          }
          intensity = clamp(intensity, 0.0, 1.0);

          gl_FragColor = vec4(scatterColor * intensity, intensity);

          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
      `,blending:Bt,side:It,transparent:!0,depthWrite:!1}):null}}class h0{static createSurfaceMaterial(e,n,i,r){return new ut({uniforms:{dayMap:{value:e},normalMap:{value:n||null},nightMap:{value:i||null},cloudsMap:{value:r||null},hasNormalMap:{value:n?1:0},hasNightMap:{value:i?1:0},hasCloudsMap:{value:r?1:0}},vertexShader:`
        varying vec2 vUv;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPosition;

        void main() {
          vUv = uv;
          vWorldNormal = normalize(mat3(modelMatrix) * normal);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,fragmentShader:`
        uniform sampler2D dayMap;
        uniform sampler2D normalMap;
        uniform sampler2D nightMap;
        uniform sampler2D cloudsMap;
        uniform float hasNormalMap;
        uniform float hasNightMap;
        uniform float hasCloudsMap;

        varying vec2 vUv;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPosition;

        void main() {
          vec3 geomNormal = normalize(vWorldNormal);
          vec3 sunDir = normalize(-vWorldPosition); // Sun at (0, 0, 0)
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);

          // Normal mapping perturbation
          vec3 normal = geomNormal;
          vec3 T = vec3(1.0, 0.0, 0.0);
          vec3 B = vec3(0.0, 1.0, 0.0);
          if (hasNormalMap > 0.5) {
            vec3 normalTex = texture2D(normalMap, vUv).xyz * 2.0 - 1.0;
            vec3 dpdx = dFdx(vWorldPosition);
            vec3 dpdy = dFdy(vWorldPosition);
            vec2 duvdx = dFdx(vUv);
            vec2 duvdy = dFdy(vUv);

            vec3 N = geomNormal;
            T = normalize(dpdx * duvdy.y - dpdy * duvdx.y);
            B = -normalize(cross(N, T));
            mat3 TBN = mat3(T, B, N);
            normal = normalize(TBN * normalTex);
          }

          vec4 dayColor = texture2D(dayMap, vUv);

          // 1. Water mask derivation:
          // Earth oceans have low red reflectance (r < 0.25) and dominant blue
          float waterMask = smoothstep(0.30, 0.08, dayColor.r) * smoothstep(0.08, 0.25, dayColor.b);
          // Polar ice caps have high albedo across all channels
          float iceMask = smoothstep(0.55, 0.85, (dayColor.r + dayColor.g + dayColor.b) / 3.0);
          waterMask = waterMask * (1.0 - iceMask); // Ice is matte, not liquid water specular

          // 2. Solar diffuse lighting:
          float NdotL = dot(normal, sunDir);
          float dayFactor = smoothstep(-0.06, 0.22, NdotL);

          // 3. Restrained Ocean Specular reflection (Blinn-Phong lobe):
          vec3 halfVec = normalize(sunDir + viewDir);
          float NdotH = max(0.0, dot(normal, halfVec));
          float specularPower = 64.0;
          float oceanSpecular = pow(NdotH, specularPower) * waterMask * dayFactor * 1.35;

          // 4. Night-side city lights (strictly dark side only):
          float nightFactor = 1.0 - smoothstep(-0.12, 0.02, NdotL);
          vec3 cityLights = vec3(0.0);
          if (hasNightMap > 0.5) {
            vec4 nightTex = texture2D(nightMap, vUv);
            cityLights = nightTex.rgb * vec3(1.25, 1.10, 0.90) * nightFactor * 1.35;
          }

          // 5. Twilight sunset reddening along the terminator:
          float twilightBand = smoothstep(-0.06, 0.02, NdotL) * (1.0 - smoothstep(0.02, 0.20, NdotL));
          vec3 twilightGlow = vec3(0.85, 0.35, 0.12) * twilightBand * 0.35;

          // 6. Direct sunlight illumination with soft ambient fill:
          vec3 sunlightColor = vec3(1.0, 0.98, 0.92) * 1.35;
          vec3 ambientColor = vec3(0.022, 0.025, 0.035); // Deep space starlight fill

          vec3 surfaceColor = dayColor.rgb * (sunlightColor * dayFactor + twilightGlow + ambientColor);

          // 7. Cloud shadows cast onto terrain & ocean:
          if (hasCloudsMap > 0.5) {
            vec2 cloudUVOffset = vec2(dot(T, sunDir), dot(B, sunDir)) * 0.0035;
            float cloudShadow = texture2D(cloudsMap, vUv + cloudUVOffset).r;
            float shadowFactor = 1.0 - smoothstep(0.12, 0.75, cloudShadow) * 0.42 * dayFactor;
            surfaceColor *= shadowFactor;
          }

          surfaceColor += vec3(0.95, 0.98, 1.0) * oceanSpecular; // Crisp specular glint
          surfaceColor += cityLights; // Night cities

          gl_FragColor = vec4(surfaceColor, 1.0);

          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
      `})}static createCloudMaterial(e){return new ut({uniforms:{cloudsMap:{value:e}},vertexShader:`
        varying vec2 vUv;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPosition;

        void main() {
          vUv = uv;
          vWorldNormal = normalize(mat3(modelMatrix) * normal);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,fragmentShader:`
        uniform sampler2D cloudsMap;
        varying vec2 vUv;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPosition;

        void main() {
          vec4 cloudTex = texture2D(cloudsMap, vUv);
          float cloudDensity = cloudTex.r * 0.92;
          if (cloudDensity < 0.025) discard;

          vec3 normal = normalize(vWorldNormal);
          vec3 sunDir = normalize(-vWorldPosition);

          // Sunlight on clouds
          float NdotL = dot(normal, sunDir);
          float dayFactor = smoothstep(-0.06, 0.22, NdotL);

          // Twilight sunset rim on clouds
          float twilight = smoothstep(-0.06, 0.04, NdotL) * (1.0 - smoothstep(0.04, 0.22, NdotL));
          vec3 cloudSunColor = mix(vec3(1.0, 0.98, 0.95), vec3(0.95, 0.48, 0.25), twilight * 0.75);

          vec3 cloudColor = cloudSunColor * (dayFactor * 1.25 + 0.035);

          gl_FragColor = vec4(cloudColor, cloudDensity * (0.35 + dayFactor * 0.55));

          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
      `,transparent:!0,depthWrite:!1})}}class bT{static createMaterial(e){const{name:n,category:i,map:r,normalMap:s}=e,a=n==="Jupiter"||n==="Saturn"||n==="Uranus"||n==="Neptune",o=n==="Europa"||n==="Enceladus",l=n==="Mercury"||n==="Moon"||i==="asteroid",c=n==="Mars",u=n==="Venus",h=n==="Saturn";return new ut({uniforms:{map:{value:r},normalMap:{value:s||null},hasNormalMap:{value:s?1:0},isGasGiant:{value:a?1:0},isIcyMoon:{value:o?1:0},isAirlessRocky:{value:l?1:0},isMars:{value:c?1:0},isVenus:{value:u?1:0},isSaturn:{value:h?1:0}},vertexShader:`
        varying vec2 vUv;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPosition;
        varying vec3 vLocalPosition;
        varying vec3 vLocalSunDir;

        void main() {
          vUv = uv;
          vLocalPosition = position;
          vWorldNormal = normalize(mat3(modelMatrix) * normal);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;

          // Local direction toward Sun (Sun sits at 0,0,0 in world space)
          vec3 worldSun = normalize(-worldPos.xyz);
          mat3 normalMat = mat3(modelMatrix);
          vLocalSunDir = vec3(
            dot(worldSun, normalMat[0]),
            dot(worldSun, normalMat[1]),
            dot(worldSun, normalMat[2])
          );

          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,fragmentShader:`
        uniform sampler2D map;
        uniform sampler2D normalMap;
        uniform float hasNormalMap;
        uniform float isGasGiant;
        uniform float isIcyMoon;
        uniform float isAirlessRocky;
        uniform float isMars;
        uniform float isVenus;
        uniform float isSaturn;

        varying vec2 vUv;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPosition;
        varying vec3 vLocalPosition;
        varying vec3 vLocalSunDir;

        void main() {
          vec3 geomNormal = normalize(vWorldNormal);
          vec3 sunDir = normalize(-vWorldPosition); // Sun is at (0, 0, 0)
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);

          vec3 normal = geomNormal;
          if (hasNormalMap > 0.5) {
            vec3 normalTex = texture2D(normalMap, vUv).xyz * 2.0 - 1.0;
            vec3 dpdx = dFdx(vWorldPosition);
            vec3 dpdy = dFdy(vWorldPosition);
            vec2 duvdx = dFdx(vUv);
            vec2 duvdy = dFdy(vUv);

            vec3 N = geomNormal;
            vec3 T = normalize(dpdx * duvdy.y - dpdy * duvdx.y);
            vec3 B = -normalize(cross(N, T));
            mat3 TBN = mat3(T, B, N);
            normal = normalize(TBN * normalTex);
          }

          vec4 texColor = texture2D(map, vUv);
          vec3 albedo = texColor.rgb;

          // 1. Natural Planetary Color Calibration:
          if (isMars > 0.5) {
            // Mars true color: Convert oversaturated crimson asset to natural NASA Viking/Curiosity
            // oxidized ferric ochre, dusty tan, and dark grey-brown basaltic lowlands
            float lum = dot(albedo, vec3(0.299, 0.587, 0.114));
            // Balance red saturation with natural rock tones
            vec3 naturalMars = mix(vec3(lum * 1.08), albedo, 0.64) * vec3(0.96, 0.90, 0.82);
            // Protect polar ice caps (bright white CO2/H2O ice) from discoloration
            float isIce = smoothstep(0.60, 0.82, (albedo.r + albedo.g + albedo.b) / 3.0);
            albedo = mix(naturalMars, albedo * 1.02, isIce);
          } else if (isVenus > 0.5) {
            // Venus: soft creamy pale-yellow sulfuric acid cloud deck
            float lum = dot(albedo, vec3(0.299, 0.587, 0.114));
            albedo = mix(vec3(lum), albedo, 0.82) * vec3(1.0, 0.97, 0.90);
          } else if (isIcyMoon > 0.5) {
            // Europa / Enceladus: preserve red-brown fracture lineae while preventing blown-out ice highlights
            albedo = albedo * 0.92;
          }

          float NdotL = dot(normal, sunDir);
          float NdotV = max(0.001, dot(normal, viewDir));

          // 2. Physically Based Illumination Models:
          float diffuse = 0.0;
          if (isGasGiant > 0.5) {
            // Minnaert atmospheric limb darkening for dense planetary gas envelopes (k ~ 0.85)
            float k = 0.85;
            float minnaert = pow(max(0.0, NdotL), k) * pow(NdotV, k - 1.0);
            diffuse = smoothstep(-0.06, 0.28, NdotL) * min(minnaert, 1.35);
          } else if (isAirlessRocky > 0.5 || isMars > 0.5) {
            // Lommel-Seeliger / Lunar-Lambert approximation for airless cratered regolith
            // Gradual terminator with natural surface contrast
            diffuse = smoothstep(-0.04, 0.26, NdotL);
          } else if (isVenus > 0.5) {
            // Venus thick cloud scattering: smooth forward and limb diffuse
            diffuse = smoothstep(-0.08, 0.32, NdotL) * 1.05;
          } else {
            // Standard planetary diffuse
            diffuse = smoothstep(-0.06, 0.25, NdotL);
          }

          // 3. Analytical Saturn Ring Shadow Cast on Globe:
          // Ring extends in local equatorial plane (Y=0) from R=1.32 to R=2.65
          if (isSaturn > 0.5) {
            vec3 l = normalize(vLocalSunDir);
            if (abs(l.y) > 0.001) {
              float t = -vLocalPosition.y / l.y;
              if (t > 0.0) {
                vec3 q = vLocalPosition + t * l;
                float ringDist = length(vec2(q.x, q.z));
                float inRing = smoothstep(1.30, 1.34, ringDist) * (1.0 - smoothstep(2.63, 2.67, ringDist));
                // Attenuate sunlight by up to 80% under dense main rings
                diffuse *= mix(1.0, 0.20, inRing);
              }
            }
          }

          // 4. Icy Moon Specular Glint (Europa, Enceladus):
          float specular = 0.0;
          if (isIcyMoon > 0.5) {
            vec3 halfVec = normalize(sunDir + viewDir);
            float NdotH = max(0.0, dot(normal, halfVec));
            // Restrained frost specular with tight highlight lobe
            specular = pow(NdotH, 64.0) * smoothstep(0.05, 0.35, NdotL) * 0.22;
          }

          // 5. Ambient Starlight Fill:
          // Subtle cosmic ambient fill to keep night-side silhouette readable without flattening
          vec3 ambient = vec3(0.025, 0.028, 0.038);

          // Sunlight color and calibrated intensity
          vec3 sunlight = vec3(1.0, 0.98, 0.94) * 1.35;
          vec3 finalColor = albedo * (sunlight * diffuse + ambient);
          finalColor += vec3(0.92, 0.96, 1.0) * specular;

          gl_FragColor = vec4(finalColor, 1.0);

          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
      `})}}class CT{static getVisualRadius(e){if(e.category==="star")return 48;switch(e.name){case"Jupiter":return 26.9;case"Saturn":return 22.68;case"Uranus":return 9.62;case"Neptune":return 9.32;case"Earth":return 2.4;case"Venus":return 2.28;case"Mars":return 1.28;case"Mercury":return .92;case"Pluto":return .45}if(e.category==="moon"){const n=e.physical.meanRadiusKm;return n<100?.18:n<500?.32:n<1200?.48:n<2e3?.65:.95}if(e.category==="dwarf_planet")return .45;if(e.category==="asteroid"){const n=e.physical.meanRadiusKm;return n<10?.18:n<100?.25:.38}return Math.max(.18,e.physical.meanRadiusKm/6371*2.4)}static getVisualDistance(e){if(e.orderFromSun===0)return 0;const n=e.orbit.semiMajorAxisAU;return 50+Math.pow(n,.58)*65}static createPlanet(e){var A;const n=new Wt;n.name=`orbit_pivot_${e.name}`;const i=new Wt;i.name=`body_group_${e.name}`,n.add(i);const r=this.getVisualRadius(e),s=this.getVisualDistance(e);i.position.set(s,0,0);const a=bt.degToRad(e.physical.axialTiltDeg||0);i.rotation.z=a;const l=1-(e.physical.flattening||0),c=e.category==="moon"||e.category==="asteroid",u=e.category==="planet"||e.category==="star",h=new On(1,u?96:c?36:64,u?64:c?24:48);if(e.category==="asteroid"||e.category==="moon"&&e.physical.meanRadiusKm<200){const b=h.attributes.position;for(let w=0;w<b.count;w++){const M=b.getX(w),D=b.getY(w),V=b.getZ(w),z=1+.18*Math.sin(M*4)*Math.cos(D*4+V*3);b.setXYZ(w,M*z,D*z,V*z)}h.computeVertexNormals()}const p=Qs.getInstance().getPlanetTextures(e.name);let v,y,m,d,g,x;const _=[];if(e.category==="star"){v=Iu.createPhotosphereMaterial(p.map);const b=new On(2.45,96,64),w=Iu.createCoronaMaterial(r),M=new et(b,w);M.name="sun_corona",M.scale.set(r,r,r),i.add(M),_.push(M),x=Iu.createProminencesGroup(r),i.add(x)}else if(e.name==="Earth"){if(v=h0.createSurfaceMaterial(p.map,p.normalMap,p.nightMap,p.cloudsMap),p.cloudsMap){const w=new On(1.004,96,64),M=h0.createCloudMaterial(p.cloudsMap);m=new et(w,M),m.name="earth_clouds",m.renderOrder=2,m.scale.set(r,r,r),i.add(m)}const b=d0.createAtmosphereMaterial("Earth");if(b){const w=new On(1.012,96,64);d=new et(w,b),d.name="earth_atmosphere",d.renderOrder=3,d.scale.set(r,r,r),i.add(d)}}else{v=bT.createMaterial({name:e.name,category:e.category,map:p.map,normalMap:p.normalMap});const b=d0.createAtmosphereMaterial(e.name);if(b){const w=((A=sx[e.name])==null?void 0:A.radiusScale)||1.012,M=new On(w,48,36);d=new et(M,b),d.name=`${e.name.toLowerCase()}_atmosphere`,d.renderOrder=3,d.scale.set(r,r,r),i.add(d)}}const R=new et(h,v);if(R.name=`surface_${e.name}`,R.castShadow=e.category!=="star",R.receiveShadow=e.category!=="star",R.scale.set(r,r*l,r),i.add(R),e.name==="Saturn"){const M=new Df(1.32,2.65,128,8),D=M.attributes.position,V=M.attributes.uv;for(let Z=0;Z<D.count;Z++){const Y=D.getX(Z),te=D.getY(Z),$=(Math.sqrt(Y*Y+te*te)-1.32)/(2.65-1.32);V.setXY(Z,$,.5)}V.needsUpdate=!0;const z=p.ringAlphaMap||p.map,X=new ut({uniforms:{ringMap:{value:z},saturnCenter:{value:new P},saturnRadius:{value:r}},vertexShader:`
          varying vec2 vUv;
          varying vec3 vWorldPosition;
          varying vec3 vWorldNormal;
          void main() {
            vUv = uv;
            vec4 worldPos = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPos.xyz;
            vWorldNormal = normalize(mat3(modelMatrix) * normal);
            gl_Position = projectionMatrix * viewMatrix * worldPos;
          }
        `,fragmentShader:`
          uniform sampler2D ringMap;
          uniform vec3 saturnCenter;
          uniform float saturnRadius;
          varying vec2 vUv;
          varying vec3 vWorldPosition;
          varying vec3 vWorldNormal;

          void main() {
            vec4 ringTexCol = texture2D(ringMap, vUv);
            if (ringTexCol.a < 0.02) discard;

            // Sun sits at origin (0, 0, 0) in world coordinates
            vec3 sunDir = normalize(-vWorldPosition);
            vec3 normal = normalize(vWorldNormal);

            // Double-sided lighting: sunlight illuminates ring from both top and bottom
            float lightDot = max(0.12, abs(dot(normal, sunDir)));

            // Analytical spherical shadow cast by Saturn's globe onto its rings:
            vec3 saturnToSun = normalize(-saturnCenter);
            vec3 d = vWorldPosition - saturnCenter;
            float t = dot(d, saturnToSun);

            float shadowFactor = 1.0;
            // The shadow falls behind Saturn on the anti-sunward side (t < 0)
            if (t < 0.0) {
              vec3 d_perp = d - t * saturnToSun;
              float distToAxis = length(d_perp);
              // Soft penumbra edge at Saturn's limb
              shadowFactor = smoothstep(saturnRadius * 0.985, saturnRadius * 1.015, distToAxis);
            }

            // Direct sunlight + soft ambient for dark-side silhouette visibility
            vec3 directIllum = vec3(1.0, 0.97, 0.90) * 1.85 * lightDot * shadowFactor;
            vec3 ambientIllum = vec3(0.045, 0.048, 0.06);

            vec3 color = ringTexCol.rgb * (directIllum + ambientIllum);
            gl_FragColor = vec4(color, ringTexCol.a * 0.96);

            #include <tonemapping_fragment>
            #include <colorspace_fragment>
          }
        `,side:cn,transparent:!0,depthWrite:!1});g=new et(M,X),g.name="saturn_rings",g.rotation.x=Math.PI*.5,g.renderOrder=3,g.scale.set(r,r,r),i.add(g)}let T;if(s>0){const b=[];for(let V=0;V<=128;V++){const z=V/128*Math.PI*2;b.push(new P(Math.cos(z)*s,0,Math.sin(z)*s))}const M=new ct().setFromPoints(b),D=new Ii({color:new me(e.physical.colorHex||"#555566"),transparent:!0,opacity:.22});T=new cr(M,D),T.name=`orbit_line_${e.name}`,n.add(T)}return{definition:e,pivot:n,bodyGroup:i,surfaceMesh:R,nightMesh:y,cloudMesh:m,atmosphereMesh:d,ringMesh:g,glowMeshes:_.length>0?_:void 0,prominencesGroup:x,orbitLine:T,visualRadius:r,orbitalDistance:s}}}const f0={Sun:{targetCoverageY:.85,ndcOffsetX:-.28,ndcOffsetY:0,fov:42,preferredElevation:Math.PI*.35},Mercury:{targetCoverageY:.92,ndcOffsetX:-.34,ndcOffsetY:0,fov:40,preferredElevation:Math.PI*.38},Venus:{targetCoverageY:.92,ndcOffsetX:-.34,ndcOffsetY:0,fov:40,preferredElevation:Math.PI*.38},Earth:{targetCoverageY:.94,ndcOffsetX:-.35,ndcOffsetY:0,fov:40,preferredElevation:Math.PI*.37},Mars:{targetCoverageY:.92,ndcOffsetX:-.34,ndcOffsetY:0,fov:40,preferredElevation:Math.PI*.38},Jupiter:{targetCoverageY:1.08,ndcOffsetX:-.38,ndcOffsetY:0,fov:41,preferredElevation:Math.PI*.39},Saturn:{targetCoverageY:.88,ndcOffsetX:-.28,ndcOffsetY:0,fov:41,effectiveRadiusMultiplier:1.95,preferredElevation:Math.PI*.32},Uranus:{targetCoverageY:.92,ndcOffsetX:-.34,ndcOffsetY:0,fov:40,preferredElevation:Math.PI*.38},Neptune:{targetCoverageY:.92,ndcOffsetX:-.34,ndcOffsetY:0,fov:40,preferredElevation:Math.PI*.38},Pluto:{targetCoverageY:.9,ndcOffsetX:-.32,ndcOffsetY:0,fov:39,preferredElevation:Math.PI*.38},"Sagittarius A*":{targetCoverageY:.88,ndcOffsetX:-.24,ndcOffsetY:-.02,fov:40,preferredElevation:Math.PI*.42}},Lu={targetCoverageY:.92,ndcOffsetX:-.34,ndcOffsetY:0,fov:40,preferredElevation:Math.PI*.38},RT={targetCoverageY:.88,ndcOffsetX:-.33,ndcOffsetY:0,fov:39,preferredElevation:Math.PI*.38},ja=class ja{constructor(e){G(this,"camera");G(this,"subjectAnchor",new P(0,0,0));G(this,"orbitPivot",new P(0,0,0));G(this,"aimPoint",new P(0,0,0));G(this,"currentNdcOffset",new Ge(-.34,0));G(this,"targetNdcOffset",new Ge(-.34,0));G(this,"shotMode","cinematic_observation");G(this,"effectiveAnchor",new P(0,0,0));G(this,"currentVelocity",new P(0,0,0));G(this,"lastCameraPos",new P(0,0,0));G(this,"lastRadius",680);G(this,"zoomRate",0);G(this,"lastUpdateTime",performance.now());G(this,"spherical",new Aa(680,Math.PI*.3,Math.PI*.25));G(this,"targetSpherical",new Aa(680,Math.PI*.3,Math.PI*.25));G(this,"panOffset",new P(0,0,0));G(this,"targetPanOffset",new P(0,0,0));G(this,"focusedObject",null);G(this,"focusDistance",30);G(this,"focusedRadius",2.8);G(this,"transition",null);G(this,"isOrbiting",!1);G(this,"isPanning",!1);G(this,"previousMousePosition",{x:0,y:0});G(this,"lastInteractionTime",performance.now());G(this,"activeTouches",new Map);G(this,"initialPinchDist",0);G(this,"initialRadiusOnPinch",0);G(this,"enableIdleDrift",!0);G(this,"damping",.12);G(this,"domElement");G(this,"onMouseDown",e=>{if(this.lastInteractionTime=performance.now(),this.transition){this.transition=null;const n=new P().subVectors(this.camera.position,this.orbitPivot);this.spherical.setFromVector3(n),this.targetSpherical.copy(this.spherical)}e.button===0?e.shiftKey?this.isPanning=!0:this.isOrbiting=!0:e.button===2&&(this.isPanning=!0),this.previousMousePosition={x:e.clientX,y:e.clientY}});G(this,"onMouseUp",()=>{this.isOrbiting=!1,this.isPanning=!1,this.lastInteractionTime=performance.now()});G(this,"onMouseMove",e=>{if(this.lastInteractionTime=performance.now(),!this.isOrbiting&&!this.isPanning)return;const n=e.clientX-this.previousMousePosition.x,i=e.clientY-this.previousMousePosition.y;if(this.previousMousePosition={x:e.clientX,y:e.clientY},this.isOrbiting)this.targetSpherical.theta-=n*.005,this.targetSpherical.phi-=i*.005,this.targetSpherical.phi=Math.max(.02,Math.min(Math.PI-.02,this.targetSpherical.phi));else if(this.isPanning){const r=this.spherical.radius*.001,s=new P,a=new P;this.camera.matrixWorld.extractBasis(s,a,new P),this.targetPanOffset.addScaledVector(s,-n*r),this.targetPanOffset.addScaledVector(a,i*r)}});G(this,"onWheel",e=>{if(e.preventDefault(),this.lastInteractionTime=performance.now(),this.transition){this.transition=null;const a=new P().subVectors(this.camera.position,this.orbitPivot);this.spherical.setFromVector3(a),this.targetSpherical.copy(this.spherical)}const n=Math.pow(.92,e.deltaY*.012),r=this.focusedObject&&(this.focusedObject.name.includes("sagittarius")||this.focusedObject.name==="Sagittarius A*")?65:this.focusedObject?this.focusedRadius*1.15:.35,s=18e4;this.targetSpherical.radius=Math.max(r,Math.min(s,this.targetSpherical.radius*n))});G(this,"onContextMenu",e=>{e.preventDefault()});G(this,"onTouchStart",e=>{if(this.lastInteractionTime=performance.now(),this.transition){this.transition=null;const n=new P().subVectors(this.camera.position,this.orbitPivot);this.spherical.setFromVector3(n),this.targetSpherical.copy(this.spherical)}for(let n=0;n<e.changedTouches.length;n++){const i=e.changedTouches[n];this.activeTouches.set(i.identifier,{x:i.clientX,y:i.clientY})}if(this.activeTouches.size===2){const n=Array.from(this.activeTouches.values());this.initialPinchDist=Math.hypot(n[0].x-n[1].x,n[0].y-n[1].y),this.initialRadiusOnPinch=this.targetSpherical.radius}});G(this,"onTouchMove",e=>{if(this.lastInteractionTime=performance.now(),this.activeTouches.size===1&&e.touches.length===1){const n=e.touches[0],i=this.activeTouches.get(n.identifier);if(i){const r=n.clientX-i.x,s=n.clientY-i.y;this.targetSpherical.theta-=r*.006,this.targetSpherical.phi-=s*.006,this.targetSpherical.phi=Math.max(.02,Math.min(Math.PI-.02,this.targetSpherical.phi)),this.activeTouches.set(n.identifier,{x:n.clientX,y:n.clientY})}}else if(this.activeTouches.size>=2&&e.touches.length>=2){const n=[e.touches[0],e.touches[1]],i=Math.hypot(n[0].clientX-n[1].clientX,n[0].clientY-n[1].clientY);if(this.initialPinchDist>0){const r=this.initialPinchDist/i,a=this.focusedObject&&(this.focusedObject.name.includes("sagittarius")||this.focusedObject.name==="Sagittarius A*")?65:this.focusedObject?this.focusedRadius*1.15:.35;this.targetSpherical.radius=Math.max(a,Math.min(18e4,this.initialRadiusOnPinch*r))}}});G(this,"onTouchEnd",e=>{this.lastInteractionTime=performance.now();for(let n=0;n<e.changedTouches.length;n++)this.activeTouches.delete(e.changedTouches[n].identifier);this.activeTouches.size<2&&(this.initialPinchDist=0)});this.domElement=e,this.camera=new En(45,e.clientWidth/e.clientHeight,.05,16e4),this.updateCameraPosition(),this.setupEventListeners(e)}static calculateViewingDistance(e,n,i=n.fov){const r=e*(n.effectiveRadiusMultiplier||1),s=bt.degToRad(i*.5),a=Math.tan(s),o=Math.max(.1,n.targetCoverageY),l=r/(o*a);return Math.max(r*1.15,l)}getResponsiveNdcOffset(e,n,i){let r=e,s=n;if(i>=1.5)r=e,s=n;else if(i>=1){const a=(i-1)/.5;r=e*(.45+.55*a),s=n}else r=e*.15,s=-.1;return{x:r,y:s}}calculateAimPoint(e,n,i,r,s,a){if(Math.abs(i)<.001&&Math.abs(r)<.001)return n.clone();const o=new P().subVectors(n,e),l=o.length();if(l<.001)return n.clone();const c=o.clone().divideScalar(l),u=new P(0,1,0);let h=new P().crossVectors(c,u);h.lengthSq()<1e-4&&(h=new P().crossVectors(c,new P(0,0,1))),h.normalize();const f=new P().crossVectors(h,c).normalize(),p=this.getResponsiveNdcOffset(i,r,a),v=bt.degToRad(s*.5),y=Math.tan(v),m=a*y,d=p.x*l*m,g=p.y*l*y;return new P().copy(n).addScaledVector(h,-d).addScaledVector(f,-g)}updateCameraPosition(){if(this.transition){const l=performance.now()-this.transition.startTime,c=Math.min(1,l/this.transition.durationMs),u=c<.5?16*Math.pow(c,5):1-Math.pow(-2*c+2,5)/2;this.transition.targetObject?(this.transition.targetObject.updateWorldMatrix(!0,!1),this.transition.targetObject.getWorldPosition(this.subjectAnchor)):this.subjectAnchor.set(0,0,0),this.camera.fov=bt.lerp(this.transition.startFov,this.transition.targetFov,u),this.currentNdcOffset.x=bt.lerp(this.transition.startNdcOffsetX,this.transition.targetNdcOffsetX,u),this.currentNdcOffset.y=bt.lerp(this.transition.startNdcOffsetY,this.transition.targetNdcOffsetY,u);const h=bt.lerp(this.spherical.theta,this.transition.targetTheta,u),f=bt.lerp(this.spherical.phi,this.transition.targetPhi,u),p=bt.lerp(this.spherical.radius,this.transition.targetDistance,u);this.orbitPivot.lerpVectors(this.transition.startPivot,this.subjectAnchor,u);const v=new P().setFromSphericalCoords(p,f,h);this.camera.position.copy(this.orbitPivot).add(v),this.aimPoint=this.calculateAimPoint(this.camera.position,this.orbitPivot,this.currentNdcOffset.x,this.currentNdcOffset.y,this.camera.fov,this.camera.aspect),this.camera.lookAt(this.aimPoint);const y=Math.max(.05,p-this.focusedRadius);this.camera.near=Math.max(.04,y*.08),this.camera.far=Math.max(16e4,p*30),this.camera.updateProjectionMatrix(),c>=1&&(this.transition.onComplete&&this.transition.onComplete(),this.spherical.set(p,f,h),this.targetSpherical.copy(this.spherical),this.panOffset.set(0,0,0),this.targetPanOffset.set(0,0,0),this.transition=null);return}let e=this.subjectAnchor;if(this.focusedObject){this.focusedObject.updateWorldMatrix(!0,!1),this.focusedObject.getWorldPosition(this.subjectAnchor);const o=this.spherical.radius;if(!(this.focusedObject.name.includes("sagittarius")||this.focusedObject.name==="Sagittarius A*")&&o>320){const c=Math.min(1,(o-320)/480);this.effectiveAnchor.lerpVectors(this.subjectAnchor,ja.ORIGIN_VEC,c),e=this.effectiveAnchor}else e=this.subjectAnchor}else this.subjectAnchor.set(0,0,0),e=this.subjectAnchor;this.currentNdcOffset.x+=(this.targetNdcOffset.x-this.currentNdcOffset.x)*this.damping,this.currentNdcOffset.y+=(this.targetNdcOffset.y-this.currentNdcOffset.y)*this.damping,this.panOffset.lerp(this.targetPanOffset,this.damping),this.orbitPivot.copy(e).add(this.panOffset),this.enableIdleDrift&&!this.isOrbiting&&!this.isPanning&&this.shotMode==="cinematic_observation"&&performance.now()-this.lastInteractionTime>3e3&&(this.targetSpherical.theta+=8e-5),this.spherical.theta+=(this.targetSpherical.theta-this.spherical.theta)*this.damping,this.spherical.phi+=(this.targetSpherical.phi-this.spherical.phi)*this.damping,this.spherical.radius+=(this.targetSpherical.radius-this.spherical.radius)*this.damping,this.spherical.phi=Math.max(.02,Math.min(Math.PI-.02,this.spherical.phi));const n=new P().setFromSpherical(this.spherical);this.camera.position.copy(this.orbitPivot).add(n),this.aimPoint=this.calculateAimPoint(this.camera.position,this.orbitPivot,this.currentNdcOffset.x,this.currentNdcOffset.y,this.camera.fov,this.camera.aspect),this.camera.lookAt(this.aimPoint);const i=this.spherical.radius,r=Math.max(.05,i-this.focusedRadius);this.camera.near=Math.max(.04,Math.min(30,r*.08)),this.camera.far=Math.max(25e4,i*35),this.camera.updateProjectionMatrix();const s=performance.now(),a=Math.max(.001,(s-this.lastUpdateTime)*.001);this.currentVelocity.subVectors(this.camera.position,this.lastCameraPos).divideScalar(a),this.lastRadius>.001&&(this.zoomRate=(Math.log(this.spherical.radius)-Math.log(this.lastRadius))/a),this.lastCameraPos.copy(this.camera.position),this.lastRadius=this.spherical.radius,this.lastUpdateTime=s}update(){this.updateCameraPosition()}get lookAtTarget(){return this.aimPoint}focusCinematic(e,n,i="",r=1800,s){this.focusedObject=e,this.focusedRadius=n,this.shotMode="cinematic_observation",typeof window<"u"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches&&(r=150),e.updateWorldMatrix(!0,!1);const a=new P;e.getWorldPosition(a);const o=f0[i]||(n<1?RT:Lu);this.targetNdcOffset.set(o.ndcOffsetX,o.ndcOffsetY);const l=ja.calculateViewingDistance(n,o,o.fov);this.focusDistance=l;const c=new P().copy(a).negate(),u=c.lengthSq()<1||i==="Sun";u?c.set(0,0,1):c.normalize();const h=new P(-c.z,0,c.x).normalize(),f=new P(0,1,0);let p;if(u)p=new P(0,.4,1).normalize().multiplyScalar(l);else if(i==="Saturn")p=new P().copy(c).multiplyScalar(-.35).addScaledVector(h,.65).addScaledVector(f,.58).normalize().multiplyScalar(l);else if(i==="Sagittarius A*"||i==="Sgr A*"||i==="sagittarius_a_star"){const y=new aa;e.getWorldQuaternion(y),p=new P(.28,.25,.92).normalize().applyQuaternion(y).multiplyScalar(l)}else p=new P().copy(c).multiplyScalar(.48).addScaledVector(h,.72).addScaledVector(f,.36).normalize().multiplyScalar(l);const v=new Aa().setFromVector3(p);v.phi=Math.max(.04,Math.min(Math.PI-.04,v.phi)),this.targetPanOffset.set(0,0,0),this.panOffset.set(0,0,0),this.transition={startPos:this.camera.position.clone(),startAimPoint:this.aimPoint.clone(),startFov:this.camera.fov,startNdcOffsetX:this.currentNdcOffset.x,startNdcOffsetY:this.currentNdcOffset.y,startPivot:this.orbitPivot.clone(),startSpherical:this.spherical.clone(),targetObject:e,targetRadius:n,targetBodyName:i,targetShotMode:"cinematic_observation",targetFov:o.fov,targetNdcOffsetX:o.ndcOffsetX,targetNdcOffsetY:o.ndcOffsetY,targetDistance:l,targetTheta:v.theta,targetPhi:v.phi,startTime:performance.now(),durationMs:r,onComplete:()=>{this.spherical.copy(v),this.targetSpherical.copy(v),this.camera.fov=o.fov,this.currentNdcOffset.set(o.ndcOffsetX,o.ndcOffsetY),s&&s()}}}focusOn(e,n,i=1800){this.focusCinematic(e,n,e.name,i)}resetToOverview(e=1600){this.focusedObject=null,this.focusedRadius=48,this.shotMode="deep_space_overview",this.targetPanOffset.set(0,0,0),this.panOffset.set(0,0,0),this.targetNdcOffset.set(0,0),typeof window<"u"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches&&(e=150);const n=new Aa(680,Math.PI*.3,Math.PI*.25);this.transition={startPos:this.camera.position.clone(),startAimPoint:this.aimPoint.clone(),startFov:this.camera.fov,startNdcOffsetX:this.currentNdcOffset.x,startNdcOffsetY:this.currentNdcOffset.y,startPivot:this.orbitPivot.clone(),startSpherical:this.spherical.clone(),targetObject:null,targetRadius:48,targetBodyName:"Overview",targetShotMode:"deep_space_overview",targetFov:45,targetNdcOffsetX:0,targetNdcOffsetY:0,targetDistance:680,targetTheta:n.theta,targetPhi:n.phi,startTime:performance.now(),durationMs:e,onComplete:()=>{this.spherical.copy(n),this.targetSpherical.copy(n),this.subjectAnchor.set(0,0,0),this.orbitPivot.set(0,0,0),this.camera.fov=45,this.currentNdcOffset.set(0,0)}}}transitionToDistance(e,n=45,i="deep_space_overview",r=1600,s){typeof window<"u"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches&&(r=150);const a=this.targetSpherical.theta,o=s!==void 0?s:Math.max(.08,Math.min(Math.PI*.45,this.targetSpherical.phi)),l=new Aa(e,o,a);this.shotMode=i,this.targetPanOffset.set(0,0,0);const c=i==="cinematic_observation"?-.34:0,u=0;this.transition={startPos:this.camera.position.clone(),startAimPoint:this.aimPoint.clone(),startFov:this.camera.fov,startNdcOffsetX:this.currentNdcOffset.x,startNdcOffsetY:this.currentNdcOffset.y,startPivot:this.orbitPivot.clone(),startSpherical:this.spherical.clone(),targetObject:e<350?this.focusedObject:null,targetRadius:this.focusedRadius,targetBodyName:this.focusedObject?this.focusedObject.name:"Cosmos",targetShotMode:i,targetFov:n,targetNdcOffsetX:c,targetNdcOffsetY:u,targetDistance:e,targetTheta:l.theta,targetPhi:l.phi,startTime:performance.now(),durationMs:r,onComplete:()=>{this.spherical.copy(l),this.targetSpherical.copy(l),e>=350&&(this.subjectAnchor.set(0,0,0),this.orbitPivot.set(0,0,0)),this.camera.fov=n,this.currentNdcOffset.set(c,u),this.targetNdcOffset.set(c,u)}}}jumpToScale(e,n=1800){let i=680,r="scientific_overview",s=45,a;switch(e){case"planetary":i=this.focusedRadius>0?this.focusedRadius*2.8:12,r="cinematic_observation",s=40;break;case"inner_system":i=180,r="scientific_overview",s=45,a=Math.PI*.32;break;case"outer_system":i=1100,r="deep_space_overview",s=46,a=Math.PI*.28;break;case"interstellar":i=8200,r="deep_space_overview",s=48,a=Math.PI*.26;break;case"galactic":i=52e3,r="deep_space_overview",s=48,a=Math.PI*.24;break}this.transitionToDistance(i,s,r,n,a)}getVelocity(){return this.currentVelocity}getZoomVelocity(){return this.zoomRate}getTravelSpeed(){return this.currentVelocity.length()}getObserverScaleMetric(){const e=this.spherical.radius;if(this.focusedObject&&(this.focusedObject.name.includes("sagittarius")||this.focusedObject.name==="Sagittarius A*")){const i=(e/20).toFixed(1),r=Math.round(e*634520);return{distance:e,formatted:`${i} r_s (${r.toLocaleString()} KM)`,domain:"planetary"}}if(e<30){const i=Math.round(e*4200);return{distance:e,formatted:`${i.toLocaleString()} KM`,domain:"planetary"}}if(e<380){const i=(e/28).toFixed(2);return{distance:e,formatted:`${i} AU`,domain:"inner_system"}}if(e<3500){const i=(e/28).toFixed(1);return{distance:e,formatted:`${i} AU`,domain:"outer_system"}}if(e<25e3){const i=(e/380).toFixed(2);return{distance:e,formatted:`${i} LY`,domain:"interstellar"}}const n=(e/6200).toFixed(1);return{distance:e,formatted:`${n} KPC`,domain:"galactic"}}toggleFramingOffset(){if(Math.abs(this.targetNdcOffset.x)>.05)return this.targetNdcOffset.set(0,0),this.shotMode="free_inspection",!1;{const e=this.focusedObject&&f0[this.focusedObject.name]||Lu;return this.targetNdcOffset.set(e.ndcOffsetX,e.ndcOffsetY),this.shotMode="cinematic_observation",!0}}setupEventListeners(e){this.domElement=e,e&&e.addEventListener&&(e.addEventListener("mousedown",this.onMouseDown),e.addEventListener("wheel",this.onWheel,{passive:!1}),e.addEventListener("contextmenu",this.onContextMenu),e.addEventListener("touchstart",this.onTouchStart,{passive:!0})),typeof window<"u"&&(window.addEventListener("mouseup",this.onMouseUp),window.addEventListener("mousemove",this.onMouseMove),window.addEventListener("touchmove",this.onTouchMove,{passive:!0}),window.addEventListener("touchend",this.onTouchEnd,{passive:!0}))}handleResize(e,n){this.camera.aspect=e/n,this.camera.updateProjectionMatrix()}dispose(){this.domElement&&this.domElement.removeEventListener&&(this.domElement.removeEventListener("mousedown",this.onMouseDown),this.domElement.removeEventListener("wheel",this.onWheel),this.domElement.removeEventListener("contextmenu",this.onContextMenu),this.domElement.removeEventListener("touchstart",this.onTouchStart)),typeof window<"u"&&(window.removeEventListener("mouseup",this.onMouseUp),window.removeEventListener("mousemove",this.onMouseMove),window.removeEventListener("touchmove",this.onTouchMove),window.removeEventListener("touchend",this.onTouchEnd))}};G(ja,"ORIGIN_VEC",new P(0,0,0));let gh=ja;const Lr=class Lr{constructor(e=Date.now()){G(this,"currentUtcMs");G(this,"lastPerfTimeMs");G(this,"isPaused",!1);G(this,"timeMultiplier",1);this.currentUtcMs=e,this.lastPerfTimeMs=performance.now()}update(e=performance.now()){const n=e-this.lastPerfTimeMs;if(this.lastPerfTimeMs=e,!this.isPaused&&n>0){const i=n*this.timeMultiplier;this.currentUtcMs+=i}return this.currentUtcMs}getUtcMs(){return this.currentUtcMs}setUtcMs(e){this.currentUtcMs=e,this.lastPerfTimeMs=performance.now()}getIsoString(){return new Date(this.currentUtcMs).toISOString()}getJulianDate(){return Lr.utcMsToJulianDate(this.currentUtcMs)}getJulianCenturiesJ2000(){return(this.getJulianDate()-Lr.J2000_JD)/36525}static utcMsToJulianDate(e){return e/864e5+24405875e-1}static julianDateToUtcMs(e){return(e-24405875e-1)*864e5}resetToJ2000(){this.setUtcMs(Lr.J2000_UTC_MS)}resetToNow(){this.setUtcMs(Date.now())}};G(Lr,"J2000_JD",2451545),G(Lr,"J2000_UTC_MS",946728e6);let rc=Lr;const Xa=class Xa{static solveKepler(e,n,i=1e-12,r=25){const s=Math.PI*2;e=(e%s+s)%s,e>Math.PI&&(e-=s);let a;if(n<.18)a=e+n*Math.sin(e);else{const o=e<0?-1:1;a=e+o*.85*n}for(let o=0;o<r;o++){const l=a-n*Math.sin(a)-e;if(Math.abs(l)<i)return a;const c=1-n*Math.cos(a);if(Math.abs(c)<1e-15)break;const u=l/c;if(a-=u,Math.abs(u)<i)return a}return a}static propagate(e,n,i=Xa.GM_SUN){const r=e.semiMajorAxisKm,s=e.eccentricity;if(r<=0)return{positionKm:[0,0,0],velocityKmPerSec:[0,0,0],trueAnomalyDeg:0,eccentricAnomalyDeg:0,distanceKm:0,speedKmPerSec:0};const a=Math.sqrt(i/(r*r*r)),o=n*86400,c=e.meanAnomalyAtEpochDeg*Math.PI/180+a*o,u=Xa.solveKepler(c,s),h=Math.sin(u),f=Math.cos(u),p=Math.sqrt(1-s*s)*h/(1-s*f),v=(f-s)/(1-s*f),y=Math.atan2(p,v),m=r*(1-s*f),d=r*(f-s),g=r*Math.sqrt(1-s*s)*h,x=Math.sqrt(i*r)/m,_=-x*h,R=x*Math.sqrt(1-s*s)*f,T=e.inclinationDeg*Math.PI/180,A=e.argumentPeriapsisDeg*Math.PI/180,b=e.longitudeAscendingNodeDeg*Math.PI/180,w=Math.cos(b),M=Math.sin(b),D=Math.cos(T),V=Math.sin(T),z=Math.cos(A),X=Math.sin(A),Z=w*z-M*X*D,Y=M*z+w*X*D,te=X*V,I=-w*X-M*z*D,$=-M*X+w*z*D,J=z*V,ae=d*Z+g*I,ye=d*Y+g*$,Ve=d*te+g*J,K=_*Z+R*I,ne=_*Y+R*$,ce=_*te+R*J,oe=Math.sqrt(K*K+ne*ne+ce*ce);return{positionKm:[ae,ye,Ve],velocityKmPerSec:[K,ne,ce],trueAnomalyDeg:(y*180/Math.PI+360)%360,eccentricAnomalyDeg:(u*180/Math.PI+360)%360,distanceKm:m,speedKmPerSec:oe}}static sampleOrbitPath(e,n=128){const i=[],r=e.semiMajorAxisKm,s=e.eccentricity;if(r<=0)return i;const a=e.inclinationDeg*Math.PI/180,o=e.argumentPeriapsisDeg*Math.PI/180,l=e.longitudeAscendingNodeDeg*Math.PI/180,c=Math.cos(l),u=Math.sin(l),h=Math.cos(a),f=Math.sin(a),p=Math.cos(o),v=Math.sin(o),y=c*p-u*v*h,m=u*p+c*v*h,d=v*f,g=-c*v-u*p*h,x=-u*v+c*p*h,_=p*f,R=r*Math.sqrt(Math.max(0,1-s*s));for(let T=0;T<=n;T++){const A=T/n*Math.PI*2,b=r*(Math.cos(A)-s),w=R*Math.sin(A),M=b*y+w*g,D=b*m+w*x,V=b*d+w*_;i.push([M,D,V])}return i}};G(Xa,"GM_SUN",1327124400419394e-4);let Hr=Xa;const Xi=class Xi{static eclipticToIcrf(e){const[n,i,r]=e,s=Math.cos(Xi.OBLIQUITY_J2000_RAD),a=Math.sin(Xi.OBLIQUITY_J2000_RAD);return[n,i*s-r*a,i*a+r*s]}static icrfToEcliptic(e){const[n,i,r]=e,s=Math.cos(Xi.OBLIQUITY_J2000_RAD),a=Math.sin(Xi.OBLIQUITY_J2000_RAD);return[n,i*s+r*a,-i*a+r*s]}static eclipticToThree(e){return[e[0],e[2],-e[1]]}static threeToEcliptic(e){return[e[0],-e[2],e[1]]}};G(Xi,"OBLIQUITY_J2000_DEG",23.43929111),G(Xi,"OBLIQUITY_J2000_RAD",23.43929111*Math.PI/180);let Ds=Xi;const Ki=class Ki{constructor(){G(this,"mode","exploration")}toRenderPosition(e,n){if(this.mode==="scientific"){const u=1/Ki.SCIENTIFIC_KM_PER_UNIT,h=[e[0]*u,e[1]*u,e[2]*u];return Ds.eclipticToThree(h)}const i=Math.sqrt(e[0]*e[0]+e[1]*e[1]+e[2]*e[2]);if(i<1e3||!n||n.orderFromSun===0)return[0,0,0];const r=i/Ki.AU_KM,s=50+Math.pow(r,.58)*65,a=e[0]/i,o=e[1]/i,l=e[2]/i,c=[a*s,o*s,l*s];return Ds.eclipticToThree(c)}toMoonRenderPosition(e,n,i,r){if(this.mode==="scientific"){const f=1/Ki.SCIENTIFIC_KM_PER_UNIT,p=[e[0]*f,e[1]*f,e[2]*f],v=Ds.eclipticToThree(p);return[i[0]+v[0],i[1]+v[1],i[2]+v[2]]}const s=Math.sqrt(e[0]*e[0]+e[1]*e[1]+e[2]*e[2]);if(s<1)return i;const a=e[0]/s,o=e[1]/s,l=e[2]/s,c=Ds.eclipticToThree([a,o,l]),h=this.getVisualRadius(r)*(1.35+1.25*Math.log10(1+s/4e4));return[i[0]+c[0]*h,i[1]+c[1]*h,i[2]+c[2]*h]}getVisualRadius(e){if(this.mode==="scientific"){const n=e.physical.meanRadiusKm/Ki.SCIENTIFIC_KM_PER_UNIT;return Math.max(.015,n*4)}if(e.category==="star")return 48;switch(e.name){case"Jupiter":return 26.9;case"Saturn":return 22.68;case"Uranus":return 9.62;case"Neptune":return 9.32;case"Earth":return 2.4;case"Venus":return 2.28;case"Mars":return 1.28;case"Mercury":return .92;case"Pluto":return .45}if(e.category==="moon"){const n=e.physical.meanRadiusKm;return n<100?.18:n<500?.32:n<1200?.48:n<2e3?.65:.95}if(e.category==="dwarf_planet")return .45;if(e.category==="asteroid"){const n=e.physical.meanRadiusKm;return n<10?.18:n<100?.25:.38}return Math.max(.18,e.physical.meanRadiusKm/6371*2.4)}};G(Ki,"SCIENTIFIC_KM_PER_UNIT",1e6),G(Ki,"AU_KM",1495978707e-1);let po=Ki;class p0{static createOrbitLine(e,n,i=180){if(e.orderFromSun===0||e.orbit.semiMajorAxisKm<=0)return null;const s=Hr.sampleOrbitPath(e.orbit,i).map(c=>{const u=n.toRenderPosition(c,e);return new P(u[0],u[1],u[2])}),a=new ct().setFromPoints(s),o=new Ii({color:new me(e.physical.colorHex||"#555566"),transparent:!0,opacity:e.category==="planet"?.3:.18,linewidth:1}),l=new cr(a,o);return l.name=`kepler_orbit_${e.name}`,l}static createMoonOrbitLine(e,n,i,r=96){if(e.orbit.semiMajorAxisKm<=0)return null;const a=Hr.sampleOrbitPath(e.orbit,r).map(u=>{const h=i.toMoonRenderPosition(u,e,[0,0,0],n);return new P(h[0],h[1],h[2])}),o=new ct().setFromPoints(a),l=new Ii({color:new me(e.physical.colorHex||"#778899"),transparent:!0,opacity:.2,linewidth:1}),c=new cr(o,l);return c.name=`kepler_moon_orbit_${e.name}`,c}}const ax=66743e-15,sc=299792458,ox=198847e25,If=149597870700,lx=3085677581e7,cx=9460730472e6,ux=4297e3,PT=12e3,dx=8.277,DT=.033,hx=dx*1e3*lx,NT=hx/cx,fx=ux*ox,pr=2*ax*fx/(sc*sc),IT=pr/1e3,LT=pr/If,px=1.5*pr,UT=px/1e3,bc=3*Math.sqrt(3)/2*pr,OT=bc/1e3,FT=bc/If,kT=2*bc/hx,BT=180*3600*1e6/Math.PI,zT=kT*BT,ac=3*pr,HT=ac/1e3,GT=Math.sqrt(pr/(2*ac)),ln={name:"Sagittarius A*",designation:"CXOGC J174540.0-290028",classification:"Supermassive Black Hole (SMBH)",galacticCenter:{system:"Galactic Coordinate System (IAU 1958 / ICRF J2000)",longitudeDeg:359.944,latitudeDeg:-.046,rightAscensionJ2000:"17h 45m 40.0409s",declinationJ2000:"-29° 00′ 28.118″"},physicalConstants:{G:ax,c:sc,solarMassKg:ox,auMeters:If,parsecMeters:lx,lightYearMeters:cx},measurements:{adoptedMassSolar:ux,massUncertaintySolar:PT,adoptedDistanceKpc:dx,distanceUncertaintyKpc:DT,distanceLightYears:NT,spinParameterAStar:0,spinAssumption:"Adopted Schwarzschild metric (a* = 0) as physical baseline; Kerr prograde spin creates asymmetric shadow offset and reduces ISCO down to 1.0 r_s.",metricAdopted:"Schwarzschild Metric with Relativistic Null-Geodesic Integration",accretionDiskInclinationDeg:42},derivedParameters:{massKg:fx,schwarzschildRadiusM:pr,schwarzschildRadiusKm:IT,schwarzschildRadiusAU:LT,photonSphereRadiusM:px,photonSphereRadiusKm:UT,shadowRadiusM:bc,shadowRadiusKm:OT,shadowRadiusAU:FT,shadowAngularDiameterMicroArcsec:zT,iscoRadiusM:ac,iscoRadiusKm:HT,accretionDiskInnerRadiusM:ac,accretionDiskOuterRadiusM:16*pr,iscoOrbitalSpeedFractionC:GT},sources:[{title:"First Sagittarius A* Event Horizon Telescope Results. I. The Shadow of the Supermassive Black Hole in the Center of the Milky Way",organization:"Event Horizon Telescope Collaboration",url:"https://www.jpl.nasa.gov/news/nasa-supports-event-horizon-telescope-in-studying-milky-ways-black-hole/",dateVerified:"2026-10-13",citation:"EHT Collaboration, 2022, ApJL, 930, L12. Measured shadow diameter: 51.8 +/- 2.3 microarcseconds."},{title:"The mass and distance of the Milky Way’s central black hole from stellar orbits",organization:"GRAVITY Collaboration (ESO / MPE)",url:"https://science.nasa.gov/universe/black-holes/",dateVerified:"2026-10-13",citation:"Abuter et al. (GRAVITY Collaboration), 2021, A&A, 647, A59. Mass: 4.297 +/- 0.012 x 10^6 M_sun, R_0: 8.277 +/- 0.033 kpc."},{title:"Black Hole Anatomy and Physics",organization:"NASA Astrophysics Science Division",url:"https://science.nasa.gov/universe/black-holes/anatomy/",dateVerified:"2026-10-13",citation:"NASA Science Directorate: Event horizon, photon ring, and relativistic accretion disk structure."},{title:"Simulation of Light Geodesics and Relativistic Ray Tracing Around a Supermassive Black Hole",organization:"NASA Goddard Space Flight Center (SVS 14619)",url:"https://svs.gsfc.nasa.gov/14619/",dateVerified:"2026-10-13",citation:"Jeremy Schnittman (NASA GSFC, July 2024): Relativistic ray-tracing, Doppler boosting, and gravitational lensing."},{title:"NASA’s Swift Catches X-ray Action at Milky Way’s Center",organization:"NASA Goddard Space Flight Center",url:"https://www.nasa.gov/news-release/nasas-swift-catches-x-ray-action-at-milky-ways-center/",dateVerified:"2026-10-13",citation:"Multiwavelength monitoring of Sgr A* accretion variability and relativistic flares."}]};ln.measurements.adoptedMassSolar,ln.measurements.massUncertaintySolar,ln.measurements.adoptedDistanceKpc,ln.measurements.distanceLightYears,ln.derivedParameters.massKg;ln.derivedParameters.schwarzschildRadiusKm,ln.derivedParameters.schwarzschildRadiusAU,ln.derivedParameters.photonSphereRadiusKm,ln.derivedParameters.shadowRadiusKm,ln.derivedParameters.shadowRadiusAU,ln.derivedParameters.shadowAngularDiameterMicroArcsec,ln.derivedParameters.iscoRadiusKm,ln.derivedParameters.iscoOrbitalSpeedFractionC,ln.derivedParameters.iscoOrbitalSpeedFractionC*(sc/1e3);const VT={schwarzschildRadius:24,diskInnerRadius:72,diskOuterRadius:340,boundingRadius:520};class WT{constructor(e=VT){G(this,"group",new Wt);G(this,"boundingMesh");G(this,"sStarsPoints");G(this,"jetPolesGroup",new Wt);G(this,"config");G(this,"scientificData",ln);G(this,"timeUniform",{value:0});G(this,"opacityUniform",{value:1});G(this,"cameraPosUniform",{value:new P});this.config=e,this.group.name="sagittarius_a_star_black_hole",this.boundingMesh=this.createRelativisticRayMarchMesh(),this.group.add(this.boundingMesh),this.sStarsPoints=this.createNuclearStarCluster(),this.group.add(this.sStarsPoints),this.createPolarOutflowJets(),this.group.add(this.jetPolesGroup)}createRelativisticRayMarchMesh(){const e=new On(this.config.boundingRadius,64,48),n=this.config.schwarzschildRadius,i=n*(3*Math.sqrt(3)/2),r=this.config.diskInnerRadius,s=this.config.diskOuterRadius,a=new ut({uniforms:{uTime:this.timeUniform,uOpacity:this.opacityUniform,uCameraPosLocal:this.cameraPosUniform,uRs:{value:n},uRShadow:{value:i},uRIn:{value:r},uROut:{value:s},uBoundingR:{value:this.config.boundingRadius}},vertexShader:`
        varying vec3 vLocalPos;
        varying vec3 vWorldPos;

        void main() {
          vLocalPos = position;
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPos = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,fragmentShader:`
        uniform float uTime;
        uniform float uOpacity;
        uniform vec3 uCameraPosLocal;
        uniform float uRs;
        uniform float uRShadow;
        uniform float uRIn;
        uniform float uROut;
        uniform float uBoundingR;

        varying vec3 vLocalPos;

        #define PI 3.14159265359
        #define STEPS 68

        // Fast hash for procedural plasma grain
        float hash(vec2 p) {
          p = fract(p * vec2(123.34, 456.21));
          p += dot(p, p + 45.32);
          return fract(p.x * p.y);
        }

        // Multi-frequency Keplerian sheared streamline generator
        float computeStreamlineFibers(float r, float phi, float time, float rIn) {
          float omega = 3.6 * pow(rIn / r, 1.5);
          float phiOrbit = phi + omega * time * 0.35;
          float logR = log(max(1.0, r / rIn));

          // 5 octaves of logarithmic spiral shear
          float s1 = phiOrbit * 3.0 - logR * 4.2;
          float s2 = phiOrbit * 8.0 - logR * 11.5;
          float s3 = phiOrbit * 22.0 - logR * 31.0;
          float s4 = phiOrbit * 58.0 - logR * 82.0;
          float s5 = phiOrbit * 140.0 - logR * 195.0;

          float fibers = 0.52
                       + 0.16 * sin(s1)
                       + 0.13 * sin(s2)
                       + 0.09 * sin(s3)
                       + 0.07 * sin(s4)
                       + 0.05 * cos(s5);

          // Fine concentric Keplerian striations
          float concentric = 0.86 + 0.14 * sin(r * 2.4 + sin(r * 0.75) * 1.6);
          return clamp(fibers * concentric, 0.08, 1.25);
        }

        // Magnetorotational instability (MRI) reconnection flare clumps
        float computePlasmaFlares(float r, float phi, float time, float rIn) {
          float omega = 3.6 * pow(rIn / r, 1.5);
          float phiOrbit = phi + omega * time * 0.35;
          float logR = log(max(1.0, r / rIn));

          float n1 = sin(phiOrbit * 4.0 + logR * 5.0 + time * 0.7) * cos(phiOrbit * 7.0 - logR * 8.0 - time * 1.1);
          float n2 = sin(phiOrbit * 14.0 - logR * 18.0 + time * 1.5);
          float flareVal = clamp((n1 * 0.72 + n2 * 0.28) * 0.5 + 0.5, 0.0, 1.0);

          float innerRamp = smoothstep(rIn * 2.8, rIn * 1.05, r);
          return pow(flareVal, 3.4) * 2.6 * innerRamp;
        }

        // Interstellar soot / carbon-silicate dust absorption lanes
        float computeDustExtinction(float r, float phi, float time, float rIn, float rOut) {
          float omega = 3.6 * pow(rIn / r, 1.5);
          float phiOrbit = phi + omega * time * 0.35;
          float logR = log(max(1.0, r / rIn));

          float sDust = sin(phiOrbit * 6.5 - logR * 9.0) * cos(phiOrbit * 15.0 - logR * 21.0);
          float dust = smoothstep(0.20, 0.70, sDust * 0.5 + 0.5);

          float outerMask = smoothstep(rIn * 1.6, rIn * 3.4, r) * smoothstep(rOut, rOut * 0.78, r);
          return dust * outerMask * 0.85;
        }

        // Spectral blackbody emission curve calibrated for extreme dynamic range (HDR)
        vec3 spectralPlasmaColor(float temp, float dust) {
          // Palette: Deep soot -> Carmine -> Honey Copper -> Incandescent Gold -> Electric Cyan-White
          vec3 colSoot   = vec3(0.07, 0.02, 0.008);
          vec3 colCrimson= vec3(1.15, 0.22, 0.04);
          vec3 colCopper = vec3(1.90, 0.95, 0.26);
          vec3 colGold   = vec3(2.65, 1.95, 0.68);
          vec3 colHot    = vec3(3.20, 3.60, 4.80);

          vec3 plasma = mix(colCrimson, colCopper, smoothstep(0.04, 0.30, temp));
          plasma = mix(plasma, colGold, smoothstep(0.30, 0.68, temp));
          plasma = mix(plasma, colHot, smoothstep(0.68, 1.15, temp));

          // Interstellar dust extinction absorbs light and cools emission
          plasma = mix(plasma, colSoot, dust * 0.82);
          return plasma;
        }

        void main() {
          vec3 rayOrigin = uCameraPosLocal;
          vec3 rayDir = normalize(vLocalPos - rayOrigin);

          // 1. Analytic Ray-Sphere Intersection with Bounding Volume
          float b0 = dot(rayOrigin, rayDir);
          float c0 = dot(rayOrigin, rayOrigin) - uBoundingR * uBoundingR;
          float disc = b0 * b0 - c0;

          if (disc < 0.0) discard;

          float sqrtDisc = sqrt(disc);
          float tNear = -b0 - sqrtDisc;
          float tFar  = -b0 + sqrtDisc;

          if (tFar < 0.0) discard;

          float tStart = max(0.0, tNear);
          float totalDist = tFar - tStart;
          if (totalDist <= 0.0) discard;

          // Asymptotic impact parameter for straight line
          vec3 rCrossD = cross(rayOrigin, rayDir);
          float b = length(rCrossD);

          vec3 pos = rayOrigin + rayDir * tStart;
          float stepSize = totalDist / float(STEPS);

          vec3 accumColor = vec3(0.0);
          float accumAlpha = 0.0;
          bool hitShadow = false;

          for (int i = 0; i < STEPS; i++) {
            float r = length(pos);

            // A. Check for Capture into Event Horizon Shadow:
            // Inside photon sphere and impact parameter within critical capture b < b_crit
            if (r <= uRs * 1.04 || (b < uRShadow * 0.995 && r <= uRs * 1.54)) {
              hitShadow = true;
              break;
            }

            // B. General Relativistic Light Bending (Null Geodesic Acceleration):
            // d2r/dlambda2 = - (1.5 * rs * h^2 / r^5) * r
            vec3 angMom = cross(pos, rayDir);
            float h2 = dot(angMom, angMom);
            vec3 bendingAccel = - (1.5 * uRs * h2 / max(pow(r, 5.0), 22.0)) * pos;

            vec3 nextRayDir = normalize(rayDir + bendingAccel * stepSize);
            vec3 nextPos = pos + nextRayDir * stepSize;

            // C. 3D Volumetric Accretion Disk Sampling along Geodesic Path:
            float rCyl = length(pos.xz);
            // Flared disk scale height H(r) ~ H0 * sqrt(r / r_in)
            float diskH = 3.8 * sqrt(max(0.6, rCyl / uRIn));

            if (abs(pos.y) <= 3.2 * diskH && rCyl >= uRIn * 0.98 && rCyl <= uROut) {
              // 1. Vertical Gaussian density profile
              float vertProfile = exp(-0.5 * (pos.y * pos.y) / (diskH * diskH));

              // 2. Novikov-Thorne Relativistic Radial Temperature Flux
              float normR = rCyl / uRIn;
              float flux = pow(normR, -2.1) * max(0.0, 1.0 - sqrt(1.0 / normR));

              // 3. Gravitational Redshift: g_grav = sqrt(1 - rs / r)
              float gravRedshift = sqrt(max(0.04, 1.0 - uRs / rCyl));

              // 4. Relativistic Keplerian Orbital Speed: beta = v/c = sqrt(rs / (2 * r))
              float beta = clamp(sqrt(uRs / (2.0 * rCyl)), 0.0, 0.55);
              float gamma = 1.0 / sqrt(max(0.05, 1.0 - beta * beta));

              // Keplerian velocity vector (counter-clockwise in X-Z plane, approaching on left)
              vec3 vel = normalize(vec3(pos.z, 0.0, -pos.x)) * beta;
              float cosAlpha = dot(vel, -rayDir) / max(0.001, beta);
              float delta = 1.0 / (gamma * (1.0 - beta * cosAlpha));

              // Relativistic Doppler Beaming boost: I_obs = I_emit * delta^3.8
              float dopplerBoost = pow(clamp(delta, 0.20, 3.8), 3.8);

              // 5. Multi-octave Procedural Fibers & MRI Flares
              float phi = atan(pos.z, pos.x);
              float fibers = computeStreamlineFibers(rCyl, phi, uTime, uRIn);
              float flares = computePlasmaFlares(rCyl, phi, uTime, uRIn);
              float dust   = computeDustExtinction(rCyl, phi, uTime, uRIn, uROut);

              // Relativistic effective temperature
              float effTemp = clamp((flux * 3.8 + flares * 0.38) * delta * gravRedshift, 0.0, 1.35);
              vec3 plasmaRgb = spectralPlasmaColor(effTemp, dust);

              // Boundaries: sharp ISCO inner cutoff, soft outer fade
              float innerCut = smoothstep(uRIn, uRIn * 1.05, rCyl);
              float outerCut = smoothstep(uROut, uROut * 0.72, rCyl);
              float density = vertProfile * innerCut * outerCut * fibers * (1.0 + flares * 0.5);

              float stepAlpha = clamp(density * stepSize * 0.045, 0.0, 0.85);
              vec3 stepEmission = plasmaRgb * dopplerBoost * (fibers * 0.75 + 0.25) * (1.0 + flares);

              accumColor += (1.0 - accumAlpha) * stepEmission * stepAlpha;
              accumAlpha += (1.0 - accumAlpha) * stepAlpha;

              if (accumAlpha >= 0.985) break;
            }

            // D. Razor-Sharp Equatorial Midplane Crossing Enhancement (Y = 0)
            if (pos.y * nextPos.y <= 0.0) {
              float tCross = abs(pos.y) / max(0.0001, abs(pos.y) + abs(nextPos.y));
              vec3 crossPos = mix(pos, nextPos, tCross);
              float rCross = length(crossPos.xz);

              if (rCross >= uRIn && rCross <= uROut) {
                float normR = rCross / uRIn;
                float flux = pow(normR, -2.1) * max(0.0, 1.0 - sqrt(1.0 / normR));
                float gravRedshift = sqrt(max(0.04, 1.0 - uRs / rCross));

                float beta = clamp(sqrt(uRs / (2.0 * rCross)), 0.0, 0.55);
                float gamma = 1.0 / sqrt(max(0.05, 1.0 - beta * beta));
                vec3 vel = normalize(vec3(crossPos.z, 0.0, -crossPos.x)) * beta;
                float cosAlpha = dot(vel, -rayDir) / max(0.001, beta);
                float delta = 1.0 / (gamma * (1.0 - beta * cosAlpha));
                float dopplerBoost = pow(clamp(delta, 0.20, 3.8), 3.8);

                float phi = atan(crossPos.z, crossPos.x);
                float fibers = computeStreamlineFibers(rCross, phi, uTime, uRIn);
                float flares = computePlasmaFlares(rCross, phi, uTime, uRIn);
                float dust   = computeDustExtinction(rCross, phi, uTime, uRIn, uROut);

                float effTemp = clamp((flux * 3.8 + flares * 0.38) * delta * gravRedshift, 0.0, 1.35);
                vec3 plasmaRgb = spectralPlasmaColor(effTemp, dust);

                float innerCut = smoothstep(uRIn, uRIn * 1.04, rCross);
                float outerCut = smoothstep(uROut, uROut * 0.75, rCross);
                float midOpacity = clamp(innerCut * outerCut * fibers * 0.42 * (1.0 + flares * 0.4), 0.0, 0.95);
                vec3 midEmission = plasmaRgb * dopplerBoost * (fibers * 0.8 + 0.2) * (1.0 + flares);

                accumColor += (1.0 - accumAlpha) * midEmission * midOpacity;
                accumAlpha += (1.0 - accumAlpha) * midOpacity;

                if (accumAlpha >= 0.985) break;
              }
            }

            rayDir = nextRayDir;
            pos = nextPos;

            if (length(pos) > uBoundingR * 1.02) break;
          }

          // E. Event Horizon Shadow Plunge:
          // Any accumulated emission in FRONT of the black hole is visible;
          // everything directly behind is profound pitch black (alpha = 1.0)!
          if (hitShadow) {
            // Apply subtle Reinhard HDR tone mapping
            vec3 finalHdr = accumColor / (vec3(1.0) + accumColor * 0.18);
            gl_FragColor = vec4(finalHdr, 1.0 * uOpacity);
            return;
          }

          // F. Ultra-Sharp Relativistic Photon Ring:
          // Ring of looping photons at the critical shadow boundary (b ~ b_crit)
          float shadowDist = abs(b - uRShadow);
          float photonRing = exp(-pow(shadowDist / (uRs * 0.055), 2.0));
          if (photonRing > 0.008) {
            vec3 ringColor = vec3(3.6, 3.2, 2.6) * photonRing * 3.8;
            accumColor += (1.0 - accumAlpha) * ringColor;
            accumAlpha += (1.0 - accumAlpha) * photonRing * 0.96;
          }

          // G. Einstein Gravitational Deflection Glow of Background Cosmos:
          if (accumAlpha < 0.95) {
            float deflectionGlow = exp(-pow(shadowDist / (uRs * 0.42), 2.0)) * 0.24;
            vec3 cosmicGlow = vec3(0.12, 0.08, 0.18) * deflectionGlow;
            accumColor += (1.0 - accumAlpha) * cosmicGlow;
            accumAlpha += (1.0 - accumAlpha) * deflectionGlow;
          }

          if (accumAlpha < 0.005) discard;

          // H. High Dynamic Range (HDR) Tone-Mapping
          vec3 finalToneMapped = accumColor / (vec3(1.0) + accumColor * 0.18);
          gl_FragColor = vec4(finalToneMapped, clamp(accumAlpha, 0.0, 1.0) * uOpacity);
        }
      `,transparent:!0,side:cn,depthWrite:!1,blending:Ai}),o=new et(e,a);return o.name="sagittarius_a_star_lensing_volume",o.renderOrder=50,o}createNuclearStarCluster(){const n=new Float32Array(1140),i=new Float32Array(380*3),r=new Float32Array(380),s=this.config.diskOuterRadius*1.08,a=this.config.boundingRadius*.96;for(let u=0;u<380;u++){const h=Math.random(),f=s+Math.pow(h,1.6)*(a-s),p=Math.random()*Math.PI*2,v=(Math.random()-.5)*Math.PI;n[u*3]=f*Math.cos(p)*Math.cos(v),n[u*3+1]=f*Math.sin(v),n[u*3+2]=f*Math.sin(p)*Math.cos(v);const y=Math.random();y<.45?(i[u*3]=.82,i[u*3+1]=.9,i[u*3+2]=1,r[u]=1.4+Math.random()*2.2):y<.75?(i[u*3]=.98,i[u*3+1]=.98,i[u*3+2]=1,r[u]=1.2+Math.random()*1.8):(i[u*3]=1,i[u*3+1]=.85,i[u*3+2]=.58,r[u]=1.5+Math.random()*2.5)}const o=new ct;o.setAttribute("position",new Ye(n,3)),o.setAttribute("color",new Ye(i,3)),o.setAttribute("size",new Ye(r,1));const l=new ut({uniforms:{uOpacity:this.opacityUniform,uTime:this.timeUniform},vertexShader:`
        attribute float size;
        varying vec3 vColor;
        uniform float uOpacity;

        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          float dist = -mvPosition.z;
          gl_PointSize = clamp(size * (1600.0 / max(dist, 10.0)), 1.2, 7.5);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,fragmentShader:`
        varying vec3 vColor;
        uniform float uOpacity;

        void main() {
          vec2 coord = gl_PointCoord - vec2(0.5);
          float d = length(coord);
          if (d > 0.5) discard;

          float core = exp(-d * d * 18.0);
          float halo = smoothstep(0.5, 0.05, d) * 0.28;
          float alpha = clamp(core + halo, 0.0, 1.0) * uOpacity;

          gl_FragColor = vec4(vColor * 1.5, alpha);
        }
      `,vertexColors:!0,transparent:!0,blending:Bt,depthWrite:!1}),c=new Ji(o,l);return c.name="s_stars_nuclear_cluster",c}createPolarOutflowJets(){const i=new fr(65,720,1,32);i.translate(0,720*.5+this.config.schwarzschildRadius*.95,0);const r=new ut({uniforms:{uTime:this.timeUniform,uOpacity:this.opacityUniform},vertexShader:`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,fragmentShader:`
        uniform float uTime;
        uniform float uOpacity;
        varying vec2 vUv;

        void main() {
          // Distance from central spine (-1.0 to +1.0)
          float dx = abs(vUv.x * 2.0 - 1.0);

          // Jet cone expansion: beam width gently flares with height
          float widthFactor = 0.14 + 0.86 * pow(vUv.y, 0.75);
          float normDist = dx / widthFactor;
          if (normDist > 1.0) discard;

          // Ultra-collimated white-hot central core spine
          float coreSpine = exp(-normDist * normDist * 45.0);

          // Fiery ruby/coral synchrotron plasma sheath
          float sheathGlow = exp(-normDist * normDist * 4.8);

          // Relativistic outward flow and helical shock knots (v ~ 0.98 c)
          float flowCoord = vUv.y * 7.5 - uTime * 3.8;
          float helix = sin(vUv.x * 6.28318 * 2.5 + flowCoord * 3.0);
          float knot = pow(clamp(sin(flowCoord * 3.14159), 0.0, 1.0), 6.0) * 2.2;

          // Seamless axial fade: 0 at horizon base, smooth fade at tip
          float baseFade = smoothstep(0.01, 0.15, vUv.y);
          float tipFade  = pow(1.0 - vUv.y, 1.6);
          float axialFade = baseFade * tipFade;

          // Colors (NASA Anatomy - Image 2)
          vec3 rubyRed = vec3(1.35, 0.16, 0.04);
          vec3 coralOrange = vec3(2.1, 0.85, 0.22);
          vec3 whiteHot = vec3(3.8, 3.5, 3.0);

          vec3 col = mix(rubyRed, coralOrange, helix * 0.4 + 0.6);
          col = mix(col, whiteHot, coreSpine);
          col += whiteHot * knot * coreSpine;

          float alpha = (coreSpine * 0.92 + sheathGlow * 0.30 * (1.0 + knot * 0.4)) * axialFade * uOpacity;
          if (alpha < 0.005) discard;

          gl_FragColor = vec4(col, alpha);
        }
      `,transparent:!0,side:cn,blending:Bt,depthWrite:!1});[0,Math.PI*.25,Math.PI*.5,Math.PI*.75].forEach(a=>{const o=new et(i,r);o.rotation.y=a,this.jetPolesGroup.add(o);const l=i.clone();l.rotateZ(Math.PI);const c=new et(l,r);c.rotation.y=a,this.jetPolesGroup.add(c)})}update(e,n){this.timeUniform.value=n;const i=e.position.clone();this.group.worldToLocal(i),this.cameraPosUniform.value.copy(i),this.sStarsPoints&&(this.sStarsPoints.rotation.y=n*.015)}setOpacity(e){const n=Math.max(0,Math.min(1,e));this.opacityUniform.value=n,this.group.visible=n>.005}dispose(){this.boundingMesh.geometry.dispose(),this.boundingMesh.material.dispose(),this.sStarsPoints.geometry.dispose(),this.sStarsPoints.material.dispose(),this.jetPolesGroup.traverse(e=>{e instanceof et&&(e.geometry.dispose(),Array.isArray(e.material)?e.material.forEach(n=>n.dispose()):e.material.dispose())})}}const jT={radius:28e3,coreRadius:4800,sunDistance:15600};class XT{constructor(e=jT){G(this,"group",new Wt);G(this,"sagittariusAStar");G(this,"masterDiskMesh");G(this,"coreBulgeMesh");G(this,"dustExtinctionMesh");G(this,"starPoints");G(this,"satelliteGroup",new Wt);G(this,"sunBeaconGroup",new Wt);G(this,"sunReticleMesh");G(this,"sunPulseMesh");G(this,"sunRadarRing");G(this,"opacityUniform",{value:0});G(this,"timeUniform",{value:0});G(this,"bulgeFadeUniform",{value:1});G(this,"config");G(this,"sunWorldPosition",new P);this.config=e,this.group.name="milky_way_external_galaxy",this.group.position.set(0,0,0),this.group.rotation.x=bt.degToRad(62.87),this.group.rotation.y=bt.degToRad(122.93),this.group.rotation.z=bt.degToRad(282.25),this.masterDiskMesh=this.createMasterDisk(),this.group.add(this.masterDiskMesh),this.coreBulgeMesh=this.createVolumetricCore(),this.group.add(this.coreBulgeMesh),this.dustExtinctionMesh=this.createDustExtinction(),this.group.add(this.dustExtinctionMesh),this.starPoints=this.create3DStars(),this.group.add(this.starPoints),this.buildSatelliteGalaxies(),this.group.add(this.satelliteGroup);const{beaconGroup:n,reticleMesh:i,pulseMesh:r,radarRing:s,sunPos:a}=this.createSunBeacon();this.sunBeaconGroup=n,this.sunReticleMesh=i,this.sunPulseMesh=r,this.sunRadarRing=s,this.sunWorldPosition.copy(a),this.group.add(this.sunBeaconGroup),this.sagittariusAStar=new WT,this.group.add(this.sagittariusAStar.group),this.setOpacity(0)}createMasterDisk(){const e=new fr(this.config.radius*2,this.config.radius*2,64,64);e.rotateX(-Math.PI*.5);const n=Qs.getInstance().getMilkyWayDiskTexture();n.wrapS=Qe,n.wrapT=Qe,n.generateMipmaps=!0,n.minFilter=Zn,n.magFilter=gn;const i=new ut({uniforms:{uGalaxyMap:{value:n},uOpacity:this.opacityUniform,uBulgeFade:this.bulgeFadeUniform,uTime:this.timeUniform},vertexShader:`
        varying vec2 vUv;
        varying vec3 vWorldPos;
        varying vec3 vViewDir;
        varying vec3 vNormalVec;

        void main() {
          vUv = uv;
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPos = worldPos.xyz;
          vNormalVec = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
          vViewDir = normalize(cameraPosition - worldPos.xyz);
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,fragmentShader:`
        uniform sampler2D uGalaxyMap;
        uniform float uOpacity;
        uniform float uBulgeFade;
        uniform float uTime;
        varying vec2 vUv;
        varying vec3 vViewDir;
        varying vec3 vNormalVec;

        void main() {
          vec4 tex = texture2D(uGalaxyMap, vUv);
          if (tex.a < 0.005) discard;

          // Glancing angle depth enhancement:
          // Viewing at an oblique angle increases line-of-sight optical depth
          float cosView = clamp(abs(dot(vNormalVec, vViewDir)), 0.22, 1.0);
          float depthFactor = 1.0 + 0.25 * (1.0 - cosView);

          // Subtle organic micro-scintillation in OB star-forming clusters
          float isBlueStar = max(0.0, tex.b - tex.r * 0.92);
          float twinkle = 1.0 + isBlueStar * 0.18 * sin(uTime * 3.0 + vUv.x * 50.0 + vUv.y * 65.0);

          // Clear out innermost void for 3D Sagittarius A* relativistic system
          float distFromCenter = length(vUv - vec2(0.5)) * 2.0;
          float innerDiskMask = smoothstep(0.012, 0.045, distFromCenter);

          vec3 rgb = tex.rgb * 1.25 * depthFactor * twinkle;
          float alpha = clamp(tex.a * 1.10, 0.0, 1.0) * uOpacity * innerDiskMask * uBulgeFade;

          gl_FragColor = vec4(rgb, alpha);
        }
      `,transparent:!0,side:cn,depthWrite:!1,blending:Ai}),r=new et(e,i);return r.name="milky_way_master_disk",r.renderOrder=-8,r}createVolumetricCore(){const e=new On(this.config.coreRadius,32,24);e.scale(1,.42,.82);const n=new ut({uniforms:{uOpacity:this.opacityUniform,uBulgeFade:this.bulgeFadeUniform,uTime:this.timeUniform},vertexShader:`
        varying vec3 vNormal;
        varying vec3 vViewDir;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          vViewDir = normalize(-mvPos.xyz);
          gl_Position = projectionMatrix * mvPos;
        }
      `,fragmentShader:`
        uniform float uOpacity;
        uniform float uBulgeFade;
        uniform float uTime;
        varying vec3 vNormal;
        varying vec3 vViewDir;

        void main() {
          float rim = max(0.0, dot(vNormal, vViewDir));
          
          // Concentrated pinhead nucleus (innermost 5%)
          float nucleus = pow(rim, 6.5);
          // Luminous golden Population II core halo
          float halo = pow(rim, 2.8);
          
          vec3 nucleusCol = vec3(1.20, 1.15, 1.05);
          vec3 goldenBulgeCol = vec3(1.0, 0.78, 0.42);
          vec3 amberHaloCol = vec3(0.85, 0.45, 0.18);

          vec3 rgb = mix(amberHaloCol, goldenBulgeCol, halo);
          rgb = mix(rgb, nucleusCol, nucleus);

          float alpha = (nucleus * 0.50 + halo * 0.22) * uOpacity * uBulgeFade;
          gl_FragColor = vec4(rgb * 1.05, alpha);
        }
      `,transparent:!0,blending:Bt,depthWrite:!1,side:It}),i=new et(e,n);return i.name="galactic_volumetric_core",i.renderOrder=-7,i}createDustExtinction(){const e=new fr(this.config.radius*1.85,this.config.radius*1.85,48,48);e.rotateX(-Math.PI*.5);const n=Qs.getInstance().getMilkyWayDiskTexture(),i=new ut({uniforms:{uGalaxyMap:{value:n},uOpacity:this.opacityUniform,uBulgeFade:this.bulgeFadeUniform},vertexShader:`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,fragmentShader:`
        uniform sampler2D uGalaxyMap;
        uniform float uOpacity;
        uniform float uBulgeFade;
        varying vec2 vUv;

        void main() {
          vec4 tex = texture2D(uGalaxyMap, vUv);
          // Detect dark dust lanes: high red/amber relative to blue with moderate luminance
          float dustMask = clamp((tex.r * 1.1 - tex.b) * 1.8, 0.0, 1.0) * (1.0 - tex.b * 0.6);
          float distFromCenter = length(vUv - vec2(0.5)) * 2.0;
          float innerMask = smoothstep(0.012, 0.045, distFromCenter);
          float alpha = dustMask * 0.38 * uOpacity * innerMask * uBulgeFade;
          if (alpha < 0.01) discard;

          // Deep interstellar coal-dust absorption tone
          gl_FragColor = vec4(0.04, 0.02, 0.012, alpha);
        }
      `,transparent:!0,side:cn,depthWrite:!1,blending:Ai}),r=new et(e,i);return r.name="galactic_dust_extinction_sheet",r.position.y=80,r.renderOrder=-6,r}create3DStars(){const n=new Float32Array(42e3),i=new Float32Array(14e3*3),r=new Float32Array(14e3),s=this.config.radius,a=this.config.coreRadius;let o=0;const l=4e3;for(let v=0;v<l;v++){const y=Math.random(),m=Math.pow(y,1.6)*a,d=Math.random()*Math.PI*2,g=(Math.random()-.5)*Math.PI,x=m*Math.cos(d)*Math.cos(g)*1.15,_=m*Math.sin(d)*Math.cos(g)*.85,R=m*Math.sin(g)*.42;n[o*3]=x,n[o*3+1]=R,n[o*3+2]=_,Math.random()<.6?(i[o*3]=1,i[o*3+1]=.85,i[o*3+2]=.6):(i[o*3]=.98,i[o*3+1]=.7,i[o*3+2]=.4),r[o]=1+Math.random()*1.5,o++}const c=8e3;for(let v=0;v<c;v++){const y=Math.random(),m=a*.8+Math.pow(y,1.1)*(s*.9-a*.8),d=Math.random()*Math.PI*2,g=550+m/s*450,x=(Math.random()-.5+(Math.random()-.5))*g,_=Math.cos(d)*m,R=Math.sin(d)*m;n[o*3]=_,n[o*3+1]=x,n[o*3+2]=R;const T=Math.random();T<.28?(i[o*3]=.75,i[o*3+1]=.88,i[o*3+2]=1,r[o]=1.4+Math.random()*1.8):T<.38?(i[o*3]=1,i[o*3+1]=.52,i[o*3+2]=.78,r[o]=1.6+Math.random()*1.6):T<.72?(i[o*3]=.98,i[o*3+1]=.96,i[o*3+2]=.92,r[o]=.9+Math.random()*1.2):(i[o*3]=1,i[o*3+1]=.82,i[o*3+2]=.52,r[o]=1+Math.random()*1.4),o++}const u=2e3;for(let v=0;v<u;v++){const y=Math.random(),m=Math.pow(y,1.4)*(s*1.35),d=Math.random()*Math.PI*2,g=(Math.random()-.5)*Math.PI;n[o*3]=m*Math.cos(d)*Math.cos(g),n[o*3+1]=m*Math.sin(g)*.7,n[o*3+2]=m*Math.sin(d)*Math.cos(g),i[o*3]=.92,i[o*3+1]=.9,i[o*3+2]=.95,r[o]=.8+Math.random()*1,o++}const h=new ct;h.setAttribute("position",new Ye(n,3)),h.setAttribute("color",new Ye(i,3)),h.setAttribute("size",new Ye(r,1));const f=new ut({uniforms:{uOpacity:this.opacityUniform,uTime:this.timeUniform},vertexShader:`
        attribute float size;
        varying vec3 vColor;
        uniform float uOpacity;

        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          float dist = -mvPosition.z;
          gl_PointSize = clamp(size * (36000.0 / max(dist, 100.0)), 0.8, 4.5);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,fragmentShader:`
        varying vec3 vColor;
        uniform float uOpacity;

        void main() {
          vec2 coord = gl_PointCoord - vec2(0.5);
          float d = length(coord);
          if (d > 0.5) discard;

          float core = exp(-d * d * 18.0);
          float halo = smoothstep(0.5, 0.05, d) * 0.22;
          float alpha = clamp(core + halo, 0.0, 1.0) * uOpacity * 0.65;

          gl_FragColor = vec4(vColor * 1.3, alpha);
        }
      `,vertexColors:!0,transparent:!0,blending:Bt,depthWrite:!1}),p=new Ji(h,f);return p.name="galactic_3d_stars",p.renderOrder=-5,p}buildSatelliteGalaxies(){const e=this.createDwarfGalaxy("large_magellanic_cloud",new P(-9500,-13500,11800),3600,new me(13822207),450);this.satelliteGroup.add(e);const n=this.createDwarfGalaxy("small_magellanic_cloud",new P(-14800,-18200,7800),2100,new me(14741247),220);this.satelliteGroup.add(n);const i=this.createDwarfGalaxy("sagittarius_dwarf_spheroidal",new P(-1600,-6200,3200),2400,new me(16770756),280);this.satelliteGroup.add(i)}createDwarfGalaxy(e,n,i,r,s){const a=new Wt;a.name=e,a.position.copy(n);const o=new On(i,24,16);o.scale(1.25,.55,.95);const l=new ut({uniforms:{uOpacity:this.opacityUniform,uColor:{value:r}},vertexShader:`
        varying vec3 vNormal;
        varying vec3 vViewDir;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          vViewDir = normalize(-mvPos.xyz);
          gl_Position = projectionMatrix * mvPos;
        }
      `,fragmentShader:`
        uniform float uOpacity;
        uniform vec3 uColor;
        varying vec3 vNormal;
        varying vec3 vViewDir;
        void main() {
          float rim = max(0.0, dot(vNormal, vViewDir));
          float alpha = pow(rim, 2.5) * 0.38 * uOpacity;
          gl_FragColor = vec4(uColor * 1.15, alpha);
        }
      `,transparent:!0,blending:Bt,depthWrite:!1,side:It}),c=new et(o,l);c.renderOrder=-9,a.add(c);const u=new ct,h=new Float32Array(s*3);for(let v=0;v<s;v++){const y=Math.random(),m=Math.pow(y,1.8)*i,d=Math.random()*Math.PI*2,g=(Math.random()-.5)*Math.PI;h[v*3]=m*Math.cos(d)*Math.cos(g)*1.25,h[v*3+1]=m*Math.sin(g)*.55,h[v*3+2]=m*Math.sin(d)*Math.cos(g)}u.setAttribute("position",new Ye(h,3));const f=new Cf({color:r,size:1.2,transparent:!0,opacity:.55,blending:Bt,depthWrite:!1}),p=new Ji(u,f);return a.add(p),a}createSunBeacon(){const e=new Wt;e.name="sun_orion_spur_beacon";const n=this.config.sunDistance,i=bt.degToRad(215),r=55,s=new P(Math.cos(i)*n,r,Math.sin(i)*n);e.position.copy(s);const a=new ct,o=64,l=[],c=450;for(let A=0;A<=o;A++){const b=A/o*Math.PI*2;l.push(new P(Math.cos(b)*c,0,Math.sin(b)*c))}a.setFromPoints(l);const u=new Ii({color:16766720,transparent:!0,opacity:.9}),h=new cr(a,u);e.add(h);const f=new ct,p=[],v=750;for(let A=0;A<=o;A++){const b=A/o*Math.PI*2;p.push(new P(Math.cos(b)*v,0,Math.sin(b)*v))}f.setFromPoints(p);const y=new r0({color:16771704,dashSize:40,gapSize:25,transparent:!0,opacity:.65}),m=new cr(f,y);m.computeLineDistances(),e.add(m);const d=new On(180,16,12),g=new Ef({color:16771976,transparent:!0,opacity:.95,blending:Bt}),x=new et(d,g);e.add(x);const _=new ct().setFromPoints([new P(0,-r,0),new P(0,0,0)]),R=new r0({color:16769138,dashSize:22,gapSize:15,transparent:!0,opacity:.55}),T=new cr(_,R);return T.computeLineDistances(),e.add(T),{beaconGroup:e,reticleMesh:h,pulseMesh:x,radarRing:m,sunPos:s}}getGalacticCenterWorldPosition(e=new P){return this.group.updateWorldMatrix(!0,!1),this.group.getWorldPosition(e)}setOpacity(e){const n=Math.max(0,Math.min(1,e));this.opacityUniform.value=n,this.group.visible=n>.005,this.sagittariusAStar&&this.sagittariusAStar.setOpacity(n),this.sunReticleMesh&&(this.sunReticleMesh.material.opacity=n*.9),this.sunRadarRing&&(this.sunRadarRing.material.opacity=n*.65),this.sunPulseMesh&&(this.sunPulseMesh.material.opacity=n*.95)}update(e,n){if(this.timeUniform.value=e,this.sagittariusAStar&&n){this.sagittariusAStar.update(n,e);const i=n.position.clone();this.group.worldToLocal(i);const r=i.length(),s=bt.clamp((r-450)/2200,0,1);this.bulgeFadeUniform.value=s}if(this.sunPulseMesh&&this.group.visible){const i=1+.22*Math.sin(e*3.5);this.sunPulseMesh.scale.set(i,i,i)}this.sunReticleMesh&&this.group.visible&&(this.sunReticleMesh.rotation.y=e*.35),this.sunRadarRing&&this.group.visible&&(this.sunRadarRing.rotation.y=-e*.22)}dispose(){this.sagittariusAStar.dispose(),this.masterDiskMesh.geometry.dispose(),this.masterDiskMesh.material.dispose(),this.coreBulgeMesh.geometry.dispose(),this.coreBulgeMesh.material.dispose(),this.dustExtinctionMesh.geometry.dispose(),this.dustExtinctionMesh.material.dispose(),this.starPoints.geometry.dispose(),this.starPoints.material.dispose(),this.sunReticleMesh.geometry.dispose(),this.sunReticleMesh.material.dispose(),this.sunRadarRing.geometry.dispose(),this.sunRadarRing.material.dispose(),this.sunPulseMesh.geometry.dispose(),this.sunPulseMesh.material.dispose(),this.satelliteGroup.traverse(e=>{(e instanceof et||e instanceof Ji)&&(e.geometry.dispose(),Array.isArray(e.material)?e.material.forEach(n=>n.dispose()):e.material.dispose())})}}class KT{constructor(){G(this,"mesh");G(this,"count",700);G(this,"positions");G(this,"colors");G(this,"relativePositions");G(this,"radius",110);G(this,"currentSpeed",0);this.positions=new Float32Array(this.count*2*3),this.colors=new Float32Array(this.count*2*3),this.relativePositions=new Float32Array(this.count*3);for(let i=0;i<this.count;i++){const r=Math.random(),s=(.2+.8*Math.cbrt(r))*this.radius,a=Math.random()*Math.PI*2,o=Math.acos(2*Math.random()-1);this.relativePositions[i*3]=s*Math.sin(o)*Math.cos(a),this.relativePositions[i*3+1]=s*Math.sin(o)*Math.sin(a),this.relativePositions[i*3+2]=s*Math.cos(o)}const e=new ct;e.setAttribute("position",new Ye(this.positions,3)),e.setAttribute("color",new Ye(this.colors,3));const n=new Ii({vertexColors:!0,transparent:!0,blending:Bt,depthWrite:!1});this.mesh=new bf(e,n),this.mesh.name="velocity_travel_particles",this.mesh.frustumCulled=!1}update(e,n,i,r){const s=n.length(),a=s+Math.abs(i)*45;this.currentSpeed+=(a-this.currentSpeed)*Math.min(1,r*8);const o=this.currentSpeed>.8,l=Math.min(28,this.currentSpeed*.16+Math.abs(i)*14),c=Math.min(.85,Math.max(.08,(this.currentSpeed-.5)*.08));let u=0,h=0,f=-1;s>.01?(u=-n.x/s,h=-n.y/s,f=-n.z/s):Math.abs(i)>.01&&(f=i>0?1:-1);const p=this.mesh.geometry.attributes.position,v=this.mesh.geometry.attributes.color,y=this.radius*2,m=this.radius;for(let d=0;d<this.count;d++){const g=d*3,x=d*6,_=d*6+3;o&&(this.relativePositions[g]+=u*this.currentSpeed*r*.5,this.relativePositions[g+1]+=h*this.currentSpeed*r*.5,this.relativePositions[g+2]+=f*this.currentSpeed*r*.5);for(let M=0;M<3;M++)this.relativePositions[g+M]>m?this.relativePositions[g+M]-=y:this.relativePositions[g+M]<-m&&(this.relativePositions[g+M]+=y);const R=e.x+this.relativePositions[g],T=e.y+this.relativePositions[g+1],A=e.z+this.relativePositions[g+2];this.positions[x]=R,this.positions[x+1]=T,this.positions[x+2]=A,l>.4?(this.positions[_]=R+u*l,this.positions[_+1]=T+h*l,this.positions[_+2]=A+f*l):(this.positions[_]=R+.05,this.positions[_+1]=T+.05,this.positions[_+2]=A+.05);const b=c*1.2,w=c*.15;this.colors[x]=.88*b,this.colors[x+1]=.92*b,this.colors[x+2]=1*b,this.colors[_]=.65*w,this.colors[_+1]=.8*w,this.colors[_+2]=.95*w}p.needsUpdate=!0,v.needsUpdate=!0}dispose(){this.mesh.geometry.dispose(),this.mesh.material.dispose()}}const YT=[[54061,53910],[53910,58001],[58001,59774],[59774,54061],[59774,62956],[62956,65378],[65378,67301],[27989,25336],[27989,27366],[25336,24436],[27366,24436],[25930,26311],[26311,26727],[26727,27989],[25930,25336],[746,3179],[3179,2920],[2920,6686],[6686,8886],[60718,61084],[62434,61932],[102098,100453],[100453,95947],[102488,100453],[100453,97165],[49669,50583],[50583,50335],[50335,48455],[50583,54872],[54872,57632],[57632,49669],[80763,78820],[78820,78401],[80763,82396],[82396,86228],[86228,85927],[32349,30324],[32349,33579],[33579,34444],[34444,35904]];class qT{constructor(){G(this,"mesh");G(this,"meteors",[]);G(this,"positions");G(this,"colors");G(this,"count",5);this.positions=new Float32Array(this.count*2*3),this.colors=new Float32Array(this.count*2*3);for(let i=0;i<this.count;i++)this.meteors.push({active:!1,startPos:new P,dir:new P,speed:380+Math.random()*260,length:28+Math.random()*24,progress:0,cooldown:2+Math.random()*8,color:new me(Math.random()>.35?14348543:16771266)});const e=new ct;e.setAttribute("position",new Ye(this.positions,3)),e.setAttribute("color",new Ye(this.colors,3));const n=new Ii({vertexColors:!0,transparent:!0,blending:Bt,depthWrite:!1});this.mesh=new bf(e,n),this.mesh.name="meteor_streaks",this.mesh.renderOrder=-1}update(e,n){const i=this.mesh.geometry.getAttribute("position"),r=this.mesh.geometry.getAttribute("color");for(let s=0;s<this.count;s++){const a=this.meteors[s],o=s*6,l=s*6+3;if(!a.active)if(a.cooldown-=e,a.cooldown<=0){a.active=!0,a.progress=0,a.speed=360+Math.random()*320,a.length=26+Math.random()*26;const g=Math.random()*Math.PI*2,x=(Math.random()-.5)*180,_=160+Math.random()*240;a.startPos.set(n.x+Math.cos(g)*_,n.y+x,n.z+Math.sin(g)*_);const R=g+Math.PI*.5+(Math.random()-.5)*1.2;a.dir.set(Math.cos(R),(Math.random()-.5)*.45,Math.sin(R)).normalize()}else{this.positions[o]=0,this.positions[o+1]=0,this.positions[o+2]=0,this.positions[l]=0,this.positions[l+1]=0,this.positions[l+2]=0,this.colors[o]=0,this.colors[o+1]=0,this.colors[o+2]=0,this.colors[l]=0,this.colors[l+1]=0,this.colors[l+2]=0;continue}if(a.progress+=a.speed*e/260,a.progress>=1){a.active=!1,a.cooldown=4+Math.random()*9,this.positions[o]=0,this.positions[o+1]=0,this.positions[o+2]=0,this.positions[l]=0,this.positions[l+1]=0,this.positions[l+2]=0,this.colors[o]=0,this.colors[o+1]=0,this.colors[o+2]=0,this.colors[l]=0,this.colors[l+1]=0,this.colors[l+2]=0;continue}const c=a.progress*260,u=a.startPos.x+a.dir.x*c,h=a.startPos.y+a.dir.y*c,f=a.startPos.z+a.dir.z*c,p=Math.max(0,c-a.length),v=a.startPos.x+a.dir.x*p,y=a.startPos.y+a.dir.y*p,m=a.startPos.z+a.dir.z*p;this.positions[o]=u,this.positions[o+1]=h,this.positions[o+2]=f,this.positions[l]=v,this.positions[l+1]=y,this.positions[l+2]=m;const d=Math.sin(a.progress*Math.PI)*.95;this.colors[o]=a.color.r*d*1.6,this.colors[o+1]=a.color.g*d*1.6,this.colors[o+2]=a.color.b*d*1.6,this.colors[l]=a.color.r*d*.12,this.colors[l+1]=a.color.g*d*.12,this.colors[l+2]=a.color.b*d*.12}i.needsUpdate=!0,r.needsUpdate=!0}dispose(){this.mesh.geometry.dispose(),this.mesh.material.dispose()}}const Ur=class Ur{constructor(){G(this,"group",new Wt);G(this,"celestialGroup",new Wt);G(this,"pointsMesh");G(this,"localInterstellarStars");G(this,"constellationLines");G(this,"milkyWayMesh");G(this,"milkyWayOpacityUniform",{value:1});G(this,"stardustMesh");G(this,"meteorSystem");G(this,"externalGalaxy");G(this,"travelParticles");G(this,"isLoaded",!1);this.group.name="starfield_hipparcos",this.group.add(this.celestialGroup),this.celestialGroup.name="celestial_infinite_sphere",this.buildMilkyWayBackground(),this.build3DCosmicStardust(),this.meteorSystem=new qT,this.group.add(this.meteorSystem.mesh),this.externalGalaxy=new XT;const e=this.externalGalaxy.sunWorldPosition.clone().applyEuler(this.externalGalaxy.group.rotation);this.externalGalaxy.group.position.copy(e).negate(),this.group.add(this.externalGalaxy.group),this.travelParticles=new KT,this.group.add(this.travelParticles.mesh),this.loadCatalog()}buildMilkyWayBackground(){const e=new On(Ur.SPHERE_RADIUS*1.05,64,48),n=Qs.getInstance().getMilkyWayTexture(),i=new ut({uniforms:{milkyWayMap:{value:n},uOpacity:this.milkyWayOpacityUniform},vertexShader:`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,fragmentShader:`
        uniform sampler2D milkyWayMap;
        uniform float uOpacity;
        varying vec2 vUv;

        void main() {
          vec4 tex = texture2D(milkyWayMap, vUv);
          vec3 rgb = tex.rgb;

          // Pure, natural photographic contrast matching the ESA Gaia DR3 reference (test_gaia.jpg):
          // Deep clean space vacuum without washed-out toe or artificial fog,
          // preserving the authentic golden galactic core and dark absorption dust lanes.
          rgb = smoothstep(vec3(0.016), vec3(1.0), rgb);

          gl_FragColor = vec4(rgb, uOpacity);
        }
      `,side:It,transparent:!0,depthWrite:!1});this.milkyWayMesh=new et(e,i),this.milkyWayMesh.name="milky_way_skybox",this.milkyWayMesh.renderOrder=-10,this.milkyWayMesh.rotation.x=bt.degToRad(62.87),this.milkyWayMesh.rotation.y=bt.degToRad(122.93),this.milkyWayMesh.rotation.z=bt.degToRad(282.25),this.celestialGroup.add(this.milkyWayMesh)}build3DCosmicStardust(){const n=new Float32Array(2400),i=new Float32Array(800*3),r=new Float32Array(800),s=new Float32Array(800);for(let l=0;l<800;l++){const c=30+Math.pow(Math.random(),.7)*750,u=Math.random()*Math.PI*2,h=(Math.random()-.5)*(90+c*.1);n[l*3]=Math.cos(u)*c,n[l*3+1]=h,n[l*3+2]=Math.sin(u)*c;const f=Math.random();f<.5?(i[l*3]=.9,i[l*3+1]=.92,i[l*3+2]=.98):f<.8?(i[l*3]=.98,i[l*3+1]=.85,i[l*3+2]=.6):(i[l*3]=.65,i[l*3+1]=.85,i[l*3+2]=.98),r[l]=1+Math.random()*1.5,s[l]=Math.random()*Math.PI*2}const a=new ct;a.setAttribute("position",new Ye(n,3)),a.setAttribute("color",new Ye(i,3)),a.setAttribute("aScale",new Ye(r,1)),a.setAttribute("aPhase",new Ye(s,1));const o=new ut({uniforms:{time:{value:0}},vertexShader:`
        attribute float aScale;
        attribute float aPhase;
        uniform float time;
        varying vec3 vColor;
        varying float vTwinkle;

        void main() {
          vColor = color;
          vTwinkle = 0.65 + 0.35 * sin(time * 1.8 + aPhase);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          float dist = -mvPosition.z;
          // Distance falloff: motes naturally vanish beyond 300 units so overview stays clean
          float fade = clamp(1.0 - (dist - 100.0) / 220.0, 0.0, 1.0);
          gl_PointSize = clamp(aScale * (120.0 / max(dist, 10.0)) * fade, 0.0, 3.5);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,fragmentShader:`
        varying vec3 vColor;
        varying float vTwinkle;

        void main() {
          vec2 coord = gl_PointCoord - vec2(0.5);
          float d = length(coord);
          if (d > 0.5) discard;

          float core = exp(-d * d * 26.0);
          float alpha = core * vTwinkle * 0.40;

          gl_FragColor = vec4(vColor, alpha);
        }
      `,vertexColors:!0,transparent:!0,blending:Bt,depthWrite:!1});this.stardustMesh=new Ji(a,o),this.stardustMesh.name="cosmic_stardust_motes",this.stardustMesh.renderOrder=-2,this.group.add(this.stardustMesh)}async loadCatalog(){try{const e="/solaris/".replace(/\/?$/,"/"),n=await fetch(`${e}data/stars.json`);if(!n.ok)throw new Error(`Failed to fetch stars.json: HTTP ${n.status}`);const i=await n.json();this.buildStarfieldMesh(i),this.buildConstellations(i),this.isLoaded=!0}catch(e){console.warn("Could not stream Hipparcos stars dataset, using procedural fallback:",e),this.buildProceduralFallback()}}buildStarfieldMesh(e){const n=e.stars.filter(p=>p[4]<=4.6),i=n.length,r=new Float32Array(i*3),s=new Float32Array(i*3),a=new Float32Array(i),o=Ur.SPHERE_RADIUS;for(let p=0;p<i;p++){const v=n[p],y=v[1],m=v[2],d=v[3],g=v[4],x=v[5];r[p*3]=y*o,r[p*3+1]=d*o,r[p*3+2]=-m*o;const _=this.bvToRGB(x,v[8]);s[p*3]=_.r,s[p*3+1]=_.g,s[p*3+2]=_.b;const R=Math.max(.6,2.8-.42*g);a[p]=R}const l=new ct;l.setAttribute("position",new Ye(r,3)),l.setAttribute("color",new Ye(s,3)),l.setAttribute("size",new Ye(a,1));const c=`
      attribute float size;
      varying vec3 vColor;
      varying float vBrightness;

      void main() {
        vColor = color;
        vBrightness = size;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = clamp(size, 0.6, 6.0);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,u=`
      varying vec3 vColor;
      varying float vBrightness;

      void main() {
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        if (dist > 0.5) discard;

        float core = exp(-dist * dist * 40.0);
        float halo = smoothstep(0.5, 0.05, dist) * 0.12;

        float spikes = 0.0;
        if (vBrightness > 2.4) {
          float crossX = exp(-abs(coord.y) * 45.0) * max(0.0, 1.0 - abs(coord.x) * 2.0);
          float crossY = exp(-abs(coord.x) * 45.0) * max(0.0, 1.0 - abs(coord.y) * 2.0);
          spikes = max(crossX, crossY) * 0.30;
        }

        float alpha = clamp(core + halo + spikes, 0.0, 1.0) * clamp(vBrightness * 0.20, 0.12, 0.60);
        gl_FragColor = vec4(vColor, alpha);
      }
    `,h=new ut({vertexShader:c,fragmentShader:u,vertexColors:!0,transparent:!0,blending:Bt,depthWrite:!1});this.pointsMesh=new Ji(l,h),this.pointsMesh.renderOrder=0,this.celestialGroup.add(this.pointsMesh);const f=e.stars.filter(p=>p[6]!==null&&p[6]>0&&p[6]<120);if(f.length>0){const p=new Float32Array(f.length*3),v=new Float32Array(f.length*3),y=new Float32Array(f.length);for(let g=0;g<f.length;g++){const x=f[g],_=Math.max(12,x[6]*38);p[g*3]=x[1]*_,p[g*3+1]=x[3]*_,p[g*3+2]=-x[2]*_;const R=this.bvToRGB(x[5],x[8]);v[g*3]=R.r,v[g*3+1]=R.g,v[g*3+2]=R.b;const T=x[4];y[g]=Math.max(.8,2.6-.3*T)}const m=new ct;m.setAttribute("position",new Ye(p,3)),m.setAttribute("color",new Ye(v,3)),m.setAttribute("size",new Ye(y,1));const d=new ut({vertexShader:`
          attribute float size;
          varying vec3 vColor;
          varying float vBrightness;

          void main() {
            vColor = color;
            vBrightness = size;
            vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
            float dist = -mvPos.z;
            gl_PointSize = clamp(size * (750.0 / max(dist, 10.0)), 1.0, 5.5);
            gl_Position = projectionMatrix * mvPos;
          }
        `,fragmentShader:u,vertexColors:!0,transparent:!0,blending:Bt,depthWrite:!1});this.localInterstellarStars=new Ji(m,d),this.localInterstellarStars.name="local_interstellar_3d_stars",this.localInterstellarStars.renderOrder=1,this.group.add(this.localInterstellarStars)}}buildConstellations(e){const n=new Map,i=Ur.SPHERE_RADIUS*.998;for(const o of e.stars){const l=o[0],c=o[1]*i,u=o[3]*i,h=-o[2]*i;n.set(l,[c,u,h])}const r=[];for(const[o,l]of YT){const c=n.get(o),u=n.get(l);c&&u&&(r.push(c[0],c[1],c[2]),r.push(u[0],u[1],u[2]))}if(r.length===0)return;const s=new ct;s.setAttribute("position",new Lt(r,3));const a=new Ii({color:5231045,transparent:!0,opacity:.38,depthWrite:!1,blending:Bt});this.constellationLines=new bf(s,a),this.constellationLines.name="constellation_lines",this.celestialGroup.add(this.constellationLines)}bvToRGB(e,n){if(e!==null)return e<-.1?new me(10335487):e<.15?new me(12374783):e<.35?new me(15791359):e<.6?new me(16775144):e<.85?new me(16770723):e<1.3?new me(16760437):new me(16747093);switch(n){case"O":return new me(10335487);case"B":return new me(12374783);case"A":return new me(15791359);case"F":return new me(16775144);case"G":return new me(16770723);case"K":return new me(16760437);case"M":return new me(16747093);default:return new me(16777215)}}buildProceduralFallback(){const n=new ct,i=new Float32Array(6e3*3),r=new Float32Array(6e3*3),s=Ur.SPHERE_RADIUS;for(let o=0;o<6e3;o++){const l=Math.random()*Math.PI*2,c=Math.acos(Math.random()*2-1);i[o*3]=s*Math.sin(c)*Math.cos(l),i[o*3+1]=s*Math.cos(c),i[o*3+2]=s*Math.sin(c)*Math.sin(l),r[o*3]=.9,r[o*3+1]=.92,r[o*3+2]=1}n.setAttribute("position",new Ye(i,3)),n.setAttribute("color",new Ye(r,3));const a=new Cf({size:2.5,vertexColors:!0,transparent:!0,opacity:.85});this.pointsMesh=new Ji(n,a),this.celestialGroup.add(this.pointsMesh)}update(e,n,i,r,s){var p;this.celestialGroup.position.copy(e);const a=e.length(),o=this.externalGalaxy.getGalacticCenterWorldPosition(),l=e.distanceTo(o),c=bt.clamp((a-3500)/18500,0,1),u=l<8e3?bt.clamp((8e3-l)/4e3,0,1):0,h=Math.max(c,u),f=h*h*(3-2*h);if(this.externalGalaxy.setOpacity(f),this.milkyWayOpacityUniform.value=1-f,this.externalGalaxy.update(performance.now()*.001,s),this.travelParticles.update(e,i||new P,r||0,n),this.stardustMesh){const v=this.stardustMesh.material;(p=v.uniforms)!=null&&p.time&&(v.uniforms.time.value+=n)}this.meteorSystem&&a<3200&&this.meteorSystem.update(n,e)}setConstellationsVisible(e){this.constellationLines&&(this.constellationLines.visible=e)}toggleConstellations(){return this.constellationLines?(this.constellationLines.visible=!this.constellationLines.visible,this.constellationLines.visible):!1}areConstellationsVisible(){var e;return((e=this.constellationLines)==null?void 0:e.visible)??!0}dispose(){this.externalGalaxy.dispose(),this.travelParticles.dispose(),this.localInterstellarStars&&(this.localInterstellarStars.geometry.dispose(),this.localInterstellarStars.material.dispose()),this.milkyWayMesh&&(this.milkyWayMesh.geometry.dispose(),this.milkyWayMesh.material.dispose()),this.pointsMesh&&(this.pointsMesh.geometry.dispose(),this.pointsMesh.material.dispose()),this.constellationLines&&(this.constellationLines.geometry.dispose(),this.constellationLines.material.dispose()),this.stardustMesh&&(this.stardustMesh.geometry.dispose(),this.stardustMesh.material.dispose()),this.meteorSystem&&this.meteorSystem.dispose()}};G(Ur,"SPHERE_RADIUS",8500);let vh=Ur;function $T(t=19890825){let e=t>>>0;return function(){let n=e+=1831565813;return n=Math.imul(n^n>>>15,n|1),n^=n+Math.imul(n^n>>>7,n|61),((n^n>>>14)>>>0)/4294967296}}class ZT{constructor(e,n=19890825){G(this,"mesh");G(this,"count",3200);G(this,"elements",[]);G(this,"dummy",new Xt);G(this,"transform");G(this,"seed");this.transform=e,this.seed=n;const i=new Pf(.35,1),r=i.attributes.position;for(let a=0;a<r.count;a++){const o=r.getX(a),l=r.getY(a),c=r.getZ(a),u=1+.22*Math.sin(o*5)*Math.cos(l*5+c*3);r.setXYZ(a,o*u,l*u,c*u)}i.computeVertexNormals();const s=new mT({roughness:.88,metalness:.12,vertexColors:!0});this.mesh=new pT(i,s,this.count),this.mesh.name="asteroid_belt_instanced",this.mesh.castShadow=!1,this.mesh.receiveShadow=!1,this.generateElements(),this.updatePositions(0)}generateElements(){const e=$T(this.seed),n=[{au:2.5,width:.045},{au:2.82,width:.04},{au:2.96,width:.035},{au:3.27,width:.05}],i=[];let r=0;for(;r<this.count;){const s=2.12+e()*1.16;let a=!1;for(const d of n)if(Math.abs(s-d.au)<d.width&&e()<.88){a=!0;break}if(a)continue;const o=.03+e()*.19,l=e()*e()*18,c=bt.degToRad(l),u=e()*Math.PI*2,h=e()*Math.PI*2,f=e()*Math.PI*2,p=Math.pow(s,1.5)*365.25,v=Math.PI*2/p,y=.45+e()*.9;this.elements.push({semiMajorAxisAU:s,eccentricity:o,inclinationRad:c,longNodeRad:u,argPeriRad:h,meanAnomalyEpochRad:f,meanMotionRadPerDay:v,scale:y});const m=e();if(m<.7){const d=.28+e()*.18;i.push(new me(d*.95,d*.92,d*.88))}else if(m<.9){const d=.45+e()*.22;i.push(new me(d*1.05,d*.95,d*.8))}else{const d=.55+e()*.25;i.push(new me(d,d*.95,d*.9))}r++}for(let s=0;s<i.length;s++)this.mesh.setColorAt(s,i[s]);this.mesh.instanceColor&&(this.mesh.instanceColor.needsUpdate=!0)}updatePositions(e){const n=this.transform.mode==="scientific";for(let i=0;i<this.elements.length;i++){const r=this.elements[i],s=(r.meanAnomalyEpochRad+r.meanMotionRadPerDay*e)%(Math.PI*2),a=s+2*r.eccentricity*Math.sin(s),o=r.semiMajorAxisAU*(1-r.eccentricity*r.eccentricity)/(1+r.eccentricity*Math.cos(a)),l=a+r.argPeriRad,c=Math.cos(l),u=Math.sin(l),h=Math.cos(r.longNodeRad),f=Math.sin(r.longNodeRad),p=Math.cos(r.inclinationRad),v=Math.sin(r.inclinationRad),y=o,m=y*(h*c-f*u*p),d=y*(f*c+h*u*p),g=y*(u*v);let x,_,R;if(n){const A=po.AU_KM/po.SCIENTIFIC_KM_PER_UNIT;x=m*A,_=g*A,R=-d*A}else{const A=30+Math.sqrt(o)*65,b=Math.sqrt(m*m+d*d+g*g);x=m/b*A,_=g/b*A,R=-(d/b)*A}this.dummy.position.set(x,_,R);const T=r.scale*(n?.15:1);this.dummy.scale.set(T,T,T),this.dummy.rotation.set(s*2,s*3.5,s*1.5),this.dummy.updateMatrix(),this.mesh.setMatrixAt(i,this.dummy.matrix)}this.mesh.instanceMatrix.needsUpdate=!0}setVisible(e){this.mesh.visible=e}isVisible(){return this.mesh.visible}dispose(){this.mesh.geometry.dispose(),this.mesh.material.dispose()}}class JT{constructor(e,n){G(this,"container");G(this,"renderer");G(this,"scene");G(this,"cameraRig");G(this,"clock",new rc);G(this,"transform",new po);G(this,"planetBundles",new Map);G(this,"orbitLinesGroup",new Wt);G(this,"moonOrbitLines",new Map);G(this,"latestPhysicalStates",new Map);G(this,"starfield");G(this,"asteroidBelt");G(this,"raycaster",new ET);G(this,"mouse",new Ge);G(this,"isRunning",!0);G(this,"animationFrameId",null);G(this,"lastFrameTime",performance.now());G(this,"selectedBody");G(this,"onTelemetryUpdate");G(this,"telemetryThrottleCounter",0);G(this,"pointerDownPos",{x:0,y:0});G(this,"onPointerDown",e=>{this.pointerDownPos={x:e.clientX,y:e.clientY}});G(this,"onCanvasClick",e=>{if(e.target!==this.renderer.domElement||Math.hypot(e.clientX-this.pointerDownPos.x,e.clientY-this.pointerDownPos.y)>6)return;const i=this.renderer.domElement.getBoundingClientRect();this.mouse.x=(e.clientX-i.left)/i.width*2-1,this.mouse.y=-((e.clientY-i.top)/i.height)*2+1,this.raycaster.setFromCamera(this.mouse,this.cameraRig.camera);const r=[];this.planetBundles.forEach(a=>{r.push(a.surfaceMesh)});const s=this.raycaster.intersectObjects(r,!1);if(s.length>0){const a=s[0].object;for(const o of this.planetBundles.values())if(o.surfaceMesh===a){this.selectBody(o.definition.name);break}}});G(this,"onResize",()=>{if(!this.container)return;const e=this.container.clientWidth||window.innerWidth,n=this.container.clientHeight||window.innerHeight;this.renderer.setSize(e,n),this.cameraRig.handleResize(e,n)});G(this,"animate",()=>{var a,o,l;if(!this.isRunning)return;this.animationFrameId=requestAnimationFrame(this.animate);const e=performance.now(),n=Math.min(Math.max((e-this.lastFrameTime)*.001,.001),.1);this.lastFrameTime=e,this.clock.update(e);const r=this.clock.getJulianDate()-rc.J2000_JD;this.propagateAll(r);const s=this.planetBundles.get("Sun");if(s){const c=e*.001,u=s.surfaceMesh.material;if((a=u.uniforms)!=null&&a.time&&(u.uniforms.time.value=c),s.glowMeshes)for(const h of s.glowMeshes){const f=h.material;(o=f.uniforms)!=null&&o.time&&(f.uniforms.time.value=c)}if(s.prominencesGroup){for(const h of s.prominencesGroup.children)if(h instanceof et){const f=h.material;(l=f.uniforms)!=null&&l.time&&(f.uniforms.time.value=c)}}}this.cameraRig.update(),this.starfield.update(this.cameraRig.camera.position,n,this.cameraRig.getVelocity(),this.cameraRig.getZoomVelocity(),this.cameraRig.camera),this.renderer.render(this.scene,this.cameraRig.camera),this.telemetryThrottleCounter++,this.telemetryThrottleCounter%3===0&&this.onTelemetryUpdate&&this.dispatchTelemetry()});this.container=e,this.onTelemetryUpdate=n,this.selectedBody=Qt.getBody("Mercury")||Qt.getAllBodies()[0],this.scene=new dT,this.scene.background=new me(131333),this.renderer=new uT({antialias:!0,powerPreference:"high-performance"});const i=e.clientWidth||window.innerWidth,r=e.clientHeight||window.innerHeight;this.renderer.setSize(i,r),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.outputColorSpace=Vt,this.renderer.toneMapping=Pv,this.renderer.toneMappingExposure=1.05,this.renderer.domElement.style.position="absolute",this.renderer.domElement.style.top="0",this.renderer.domElement.style.left="0",this.renderer.domElement.style.width="100%",this.renderer.domElement.style.height="100%",this.renderer.domElement.style.display="block",e.appendChild(this.renderer.domElement),this.cameraRig=new gh(e),this.setupLighting(),this.starfield=new vh,this.scene.add(this.starfield.group),this.asteroidBelt=new ZT(this.transform),this.scene.add(this.asteroidBelt.mesh),this.orbitLinesGroup.visible=!1,this.scene.add(this.orbitLinesGroup),this.setupBodies(),this.rebuildOrbitLines(),this.propagateAll(0),this.scene.updateMatrixWorld(!0),this.selectBody("Mercury",1800),this.setupInteraction(),this.animate()}setupLighting(){const e=new ST(16775917,2.4,0,0);e.position.set(0,0,0),e.castShadow=!1,this.scene.add(e);const n=new wT(2238008,.25);this.scene.add(n)}setupBodies(){const e=Qt.getAllBodies();for(const n of e){const i=CT.createPlanet(n);this.scene.add(i.bodyGroup),this.planetBundles.set(n.name,i)}}rebuildOrbitLines(){for(;this.orbitLinesGroup.children.length>0;){const n=this.orbitLinesGroup.children[0];this.orbitLinesGroup.remove(n),n instanceof cr&&(n.geometry.dispose(),n.material.dispose())}this.moonOrbitLines.clear();const e=Qt.getAllBodies();for(const n of e)if(n.category!=="moon"&&n.orderFromSun>0){const i=p0.createOrbitLine(n,this.transform);i&&this.orbitLinesGroup.add(i)}for(const n of e)if(n.category==="moon"&&n.parentId){const i=Qt.getParent(n);if(i){const r=p0.createMoonOrbitLine(n,i,this.transform);r&&(this.orbitLinesGroup.add(r),this.moonOrbitLines.set(n.name,r))}}}setScaleMode(e){this.transform.mode!==e&&(this.transform.mode=e,this.planetBundles.forEach(n=>{const i=this.transform.getVisualRadius(n.definition);n.visualRadius=i;const s=1-(n.definition.physical.flattening||0);if(n.surfaceMesh.scale.set(i,i*s,i),n.nightMesh&&n.nightMesh.scale.set(i,i*s,i),n.cloudMesh&&n.cloudMesh.scale.set(i,i,i),n.atmosphereMesh&&n.atmosphereMesh.scale.set(i,i,i),n.ringMesh){n.ringMesh.scale.set(i,i,i);const a=n.ringMesh.material;a.uniforms&&a.uniforms.saturnRadius&&(a.uniforms.saturnRadius.value=i)}n.glowMeshes&&n.glowMeshes.forEach(a=>a.scale.set(i,i,i))}),this.rebuildOrbitLines())}toggleConstellations(){return this.starfield.toggleConstellations()}toggleAsteroidBelt(){const e=!this.asteroidBelt.isVisible();return this.asteroidBelt.setVisible(e),e}toggleOrbits(){return this.orbitLinesGroup.visible=!this.orbitLinesGroup.visible,this.orbitLinesGroup.visible}setupInteraction(){this.renderer.domElement.addEventListener("mousedown",this.onPointerDown),this.renderer.domElement.addEventListener("click",this.onCanvasClick),window.addEventListener("resize",this.onResize)}selectBody(e,n=1800){if(e==="Sagittarius A*"||e==="Sgr A*"||e==="sagittarius_a_star"){const r=Qt.getSagittariusAStar();if(r){this.selectedBody=r;const s=this.starfield.externalGalaxy.sagittariusAStar.group;this.cameraRig.focusCinematic(s,180,r.name,n);return}}const i=this.planetBundles.get(e);i&&(this.selectedBody=i.definition,this.cameraRig.focusCinematic(i.bodyGroup,i.visualRadius,i.definition.name,n))}resetView(){this.selectedBody=Qt.getBody("Sun")||Qt.getAllBodies()[0],this.cameraRig.resetToOverview()}propagateAll(e){const n=Qt.getAllBodies(),i=new Map;for(const r of n){if(r.category==="moon")continue;const s=this.planetBundles.get(r.name);if(!s)continue;if(r.orderFromSun===0){s.bodyGroup.position.set(0,0,0),i.set(r.id,[0,0,0]);const u=e*24/609.12*Math.PI*2;s.surfaceMesh.rotation.y=u;continue}const a=Hr.propagate(r.orbit,e);this.latestPhysicalStates.set(r.name,a);const o=this.transform.toRenderPosition(a.positionKm,r);s.bodyGroup.position.set(o[0],o[1],o[2]),i.set(r.id,o);const l=r.physical.rotationPeriodHours||24,c=e*24/l*Math.PI*2;if(s.surfaceMesh.rotation.y=c,s.nightMesh&&(s.nightMesh.rotation.y=c),s.cloudMesh&&(s.cloudMesh.rotation.y=c*1.05),r.name==="Saturn"&&s.ringMesh){const u=s.ringMesh.material;u.uniforms&&u.uniforms.saturnCenter&&(u.uniforms.saturnCenter.value.set(o[0],o[1],o[2]),u.uniforms.saturnRadius.value=s.visualRadius)}}for(const r of n){if(r.category!=="moon"||!r.parentId)continue;const s=this.planetBundles.get(r.name);if(!s)continue;const a=Qt.getParent(r);if(!a)continue;const o=this.latestPhysicalStates.get(a.name),l=i.get(a.id)||[0,0,0],c=a.physical.gmKm3S2??(a.physical.massKg?a.physical.massKg*66743e-24:void 0),u=r.physical.gmKm3S2??(r.physical.massKg?r.physical.massKg*66743e-24:0),h=c!==void 0?c+u:Hr.GM_SUN,f=Hr.propagate(r.orbit,e,h),p=(o==null?void 0:o.positionKm)||[0,0,0],v=(o==null?void 0:o.velocityKmPerSec)||[0,0,0],y=[p[0]+f.positionKm[0],p[1]+f.positionKm[1],p[2]+f.positionKm[2]],m=[v[0]+f.velocityKmPerSec[0],v[1]+f.velocityKmPerSec[1],v[2]+f.velocityKmPerSec[2]];this.latestPhysicalStates.set(r.name,{positionKm:y,velocityKmPerSec:m,distanceKm:Math.hypot(...y),speedKmPerSec:Math.hypot(...m),trueAnomalyDeg:f.trueAnomalyDeg,eccentricAnomalyDeg:f.eccentricAnomalyDeg});const d=this.transform.toMoonRenderPosition(f.positionKm,r,l,a);s.bodyGroup.position.set(d[0],d[1],d[2]);const g=this.moonOrbitLines.get(r.name);g&&g.position.set(l[0],l[1],l[2]);const x=r.physical.rotationPeriodHours||r.orbit.orbitalPeriodDays*24,_=e*24/x*Math.PI*2;s.surfaceMesh.rotation.y=_}this.asteroidBelt.updatePositions(e)}jumpToScale(e){if(e==="sgr_a"){this.selectBody("Sagittarius A*");return}this.cameraRig.jumpToScale(e)}dispatchTelemetry(){const e=this.latestPhysicalStates.get(this.selectedBody.name);let n=(e==null?void 0:e.distanceKm)||this.selectedBody.orbit.semiMajorAxisKm,i=(e==null?void 0:e.speedKmPerSec)||0;(this.selectedBody.id==="sagittarius_a_star"||this.selectedBody.name==="Sagittarius A*")&&(n=2553e14,i=122400);const r=new P;this.cameraRig.camera.getWorldDirection(r);const s=Math.atan2(r.x,r.z)*bt.RAD2DEG,a=Math.asin(r.y)*bt.RAD2DEG,o=this.cameraRig.getObserverScaleMetric(),l=this.cameraRig.getTravelSpeed(),c={id:this.selectedBody.id,name:this.selectedBody.name,category:this.selectedBody.category,parentId:this.selectedBody.parentId,parentName:this.selectedBody.parentName,distanceKm:n,apparentSpeedKmS:i,radiusKm:this.selectedBody.physical.meanRadiusKm,orbitalPeriodDays:this.selectedBody.orbit.orbitalPeriodDays,axialTiltDeg:this.selectedBody.physical.axialTiltDeg||0,colorHex:this.selectedBody.physical.colorHex||"#ffffff"};this.onTelemetryUpdate({speedKmS:i,lookAzimuthDeg:Math.round(s),lookElevationDeg:Math.round(a),activeTarget:c,timeScale:this.clock.timeMultiplier,julianDate:this.clock.getJulianDate(),utcIso:this.clock.getIsoString(),scaleMode:this.transform.mode,isPaused:this.clock.isPaused,constellationsVisible:this.starfield.areConstellationsVisible(),asteroidBeltVisible:this.asteroidBelt.isVisible(),orbitsVisible:this.orbitLinesGroup.visible,observerScaleMetric:o.formatted,observerDomain:o.domain,travelSpeed:Math.round(l),cameraDistance:Math.round(o.distance)})}dispose(){this.isRunning=!1,this.animationFrameId!==null&&cancelAnimationFrame(this.animationFrameId),window.removeEventListener("resize",this.onResize),this.renderer.domElement.removeEventListener("mousedown",this.onPointerDown),this.renderer.domElement.removeEventListener("click",this.onCanvasClick),this.cameraRig.dispose(),this.starfield.dispose(),this.asteroidBelt.dispose(),this.planetBundles.forEach(e=>{e.surfaceMesh.geometry.dispose(),e.surfaceMesh.material.dispose(),e.nightMesh&&(e.nightMesh.geometry.dispose(),e.nightMesh.material.dispose()),e.cloudMesh&&(e.cloudMesh.geometry.dispose(),e.cloudMesh.material.dispose()),e.atmosphereMesh&&(e.atmosphereMesh.geometry.dispose(),e.atmosphereMesh.material.dispose()),e.ringMesh&&(e.ringMesh.geometry.dispose(),e.ringMesh.material.dispose()),e.glowMeshes&&e.glowMeshes.forEach(n=>{n.geometry.dispose(),n.material.dispose()}),e.prominencesGroup&&e.prominencesGroup.children.forEach(n=>{n instanceof et&&(n.geometry.dispose(),n.material.dispose())})}),this.renderer.dispose(),this.renderer.domElement.parentElement&&this.renderer.domElement.parentElement.removeChild(this.renderer.domElement)}}const xh={Mercury:{name:"Mercury",category:"planet",eyebrow:"PLANET",accentColor:"#E8927C",eyebrowColor:"#fabfad",distanceAU:"0.39 AU",textureThumb:"textures/2k_mercury.jpg",monographText:"THE CLOSEST PLANET TO THE SUN. IT CIRCLES THE SUN FASTER THAN ALL THE OTHER PLANETS, WHICH IS WHY ROMANS NAMED IT AFTER THEIR SWIFT-FOOTED MESSENGER GOD.",extendedLore:"Mercury is a world of fierce cosmic extremes. With virtually no atmosphere to trap heat, midday temperatures soar to 430°C (800°F), while the sunless night plummets to -180°C (-290°F). Its massive metallic core occupies roughly 85% of the planet's total radius, suggesting a colossal primordial impact stripped away much of its ancient silicate mantle.",missions:[{name:"Mariner 10",year:"1974–1975",agency:"NASA",role:"First flybys; mapped 45% of surface"},{name:"MESSENGER",year:"2011–2015",agency:"NASA",role:"First orbiter; discovered polar water ice in permanently shadowed craters"},{name:"BepiColombo",year:"2025–2026",agency:"ESA / JAXA",role:"Dual orbiter study of magnetosphere and exosphere"}]},Venus:{name:"Venus",category:"planet",eyebrow:"PLANET",accentColor:"#b45d15",eyebrowColor:"#e58e45",distanceAU:"0.723 AU",textureThumb:"textures/2k_venus_atmosphere.jpg",monographText:"NAMED FOR THE ROMAN GODDESS OF LOVE AND BEAUTY. ENSHROUDED IN DENSE OPAQUE CLOUDS OF SULFURIC ACID, IT SUFFERS A RUNAWAY GREENHOUSE EFFECT WITH SURFACE TEMPERATURES REACHING 465°C.",extendedLore:"Venus is Earth's twin in diameter and mass, but an infernal counterpart in environment. A crushing supercritical carbon dioxide atmosphere exerts 92 times Earth's sea-level pressure. Venus rotates backwards compared to most planets, with the Sun rising in the west, and its day is longer than its orbital year.",missions:[{name:"Venera 7",year:"1970",agency:"Soviet Union",role:"First human spacecraft to softly land and transmit data from another planet"},{name:"Magellan",year:"1990–1994",agency:"NASA",role:"Global radar mapping revealing extensive volcanism and lava channels"},{name:"Akatsuki",year:"2015–Present",agency:"JAXA",role:"Atmospheric super-rotation and cloud dynamics investigation"}]},Earth:{name:"Earth",category:"planet",eyebrow:"PLANET",accentColor:"#26daaa",eyebrowColor:"#7bf0d0",distanceAU:"1.000 AU",textureThumb:"textures/2k_earth_daymap.jpg",monographText:"OUR HOME AND THE ONLY KNOWN SANCTUARY OF LIFE IN THE COSMOS. A VIBRANT BLUE MARBLE ENVELOPED BY A NITROGEN-OXYGEN ATMOSPHERE, WITH LIQUID OCEANS COVERING SEVENTY PERCENT OF ITS CRUST.",extendedLore:"Earth resides at the temperate sweet spot of the circumstellar habitable zone. Dynamic plate tectonics continuously recycle carbon, while a vigorous geodynamo generates a protective magnetosphere shielding the biosphere from solar wind stripping and high-energy galactic cosmic rays.",missions:[{name:"Apollo Program",year:"1961–1972",agency:"NASA",role:"Human lunar landings; transformed humanity's ecological perspective of Earth"},{name:"Terra & Aqua",year:"1999–Present",agency:"NASA",role:"Comprehensive global climate and ocean monitoring system"},{name:"Copernicus Sentinel",year:"2014–Present",agency:"ESA",role:"Constellation observing biosphere, ice sheets, and atmosphere"}]},Mars:{name:"Mars",category:"planet",eyebrow:"PLANET",accentColor:"#e55f45",eyebrowColor:"#fca595",distanceAU:"1.524 AU",textureThumb:"textures/2k_mars.jpg",monographText:"THE RED PLANET, COLORED BY IRON OXIDE SPREAD ACROSS ITS WINDSWEPT DESERTS. HOME TO OLYMPUS MONS, THE TALLEST VOLCANO IN THE SOLAR SYSTEM, AND VAST DRY RIVER VALLEYS.",extendedLore:"Though frozen and desiccated today, geochemical fingerprints captured by rovers prove ancient Mars possessed lakes, river deltas, and a thicker insulating atmosphere over three billion years ago. Its thin CO2 atmosphere generates continent-scale dust storms that periodically veil the entire globe.",missions:[{name:"Viking 1 & 2",year:"1976",agency:"NASA",role:"First successful long-duration Mars surface landers and biological tests"},{name:"Curiosity",year:"2012–Present",agency:"NASA",role:"Discovered ancient habitable lacustrine environments in Gale Crater"},{name:"Perseverance",year:"2021–Present",agency:"NASA",role:"Searching for ancient microbial biosignatures and caching core samples"}]},Jupiter:{name:"Jupiter",category:"planet",eyebrow:"PLANET",accentColor:"#f59e0b",eyebrowColor:"#fcd34d",distanceAU:"5.203 AU",textureThumb:"textures/2k_jupiter.jpg",monographText:"THE TITAN OF OUR SOLAR SYSTEM, WITH MORE MASS THAN ALL OTHER WORLDS COMBINED. A SWIRLING GAS GIANT DOMINATED BY THE CENTURIES-OLD GREAT RED SPOT AND 95 KNOWN SATELLITES.",extendedLore:"Jupiter acted as the primary gravitational architect of the early Solar System, shaping asteroid orbits and scattering comets. Below its dynamic ammonia cloud belts, hydrogen transitions into liquid and eventually into an exotic state of liquid metallic hydrogen that conducts immense electrical currents, powering the most powerful planetary magnetic field in the system.",missions:[{name:"Voyager 1 & 2",year:"1979",agency:"NASA",role:"Discovered Jovian rings and active volcanism on Io"},{name:"Galileo",year:"1995–2003",agency:"NASA",role:"First orbiter; gathered initial evidence of subsurface ocean on Europa"},{name:"Juno",year:"2016–Present",agency:"NASA",role:"Mapping gravitational anomalies and deep atmospheric water abundance"}]},Saturn:{name:"Saturn",category:"planet",eyebrow:"PLANET",accentColor:"#b29d81",eyebrowColor:"#d4c5b0",distanceAU:"9.539 AU",textureThumb:"textures/2k_saturn.jpg",monographText:"A MAJESTIC WORLD ADORNED BY AN EXTRAORDINARY SYSTEM OF ICY RINGS EXTENDING THOUSANDS OF KILOMETERS INTO THE VOID, ACCOMPANIED BY THE HAZE-CLOAKED MOON TITAN.",extendedLore:"Saturn's ring system spans up to 282,000 km in width yet is astonishingly paper-thin—averaging barely 10 to 30 meters in vertical thickness. Composed of 99% pure water ice particles ranging from dust grains to boulder sizes, the rings are sustained and sculpted by subtle gravitational resonances with shepherd moons.",missions:[{name:"Pioneer 11",year:"1979",agency:"NASA",role:"First close encounter with Saturn and discovery of the F Ring"},{name:"Cassini-Huygens",year:"2004–2017",agency:"NASA / ESA / ASI",role:"Thirteen-year orbital odyssey; landed probe on Titan, found Enceladus plumes"},{name:"Dragonfly",year:"Launching 2028",agency:"NASA",role:"Rotorcraft lander to explore prebiotic chemistry on Titan"}]},Uranus:{name:"Uranus",category:"planet",eyebrow:"PLANET",accentColor:"#8dcdd8",eyebrowColor:"#b3e8f0",distanceAU:"19.18 AU",textureThumb:"textures/2k_uranus.jpg",monographText:"AN ICE GIANT TILTED SO DRAMATICALLY ON ITS SIDE THAT ITS ROTATION AXIS POINTS ALMOST DIRECTLY AT THE SUN, DRIVING EXTREME DECADES-LONG SEASONS IN COMPLETE FREEZE.",extendedLore:"With an axial tilt of 97.77°, Uranus literally rolls along its orbital path like a ball. Scientists theorize a sequence of Earth-sized protoplanetary impacts knocked the giant onto its side early in solar history. Its pale aquamarine coloration originates from methane gas in its upper atmosphere absorbing red light wavelengths.",missions:[{name:"Voyager 2",year:"1986",agency:"NASA",role:"Only spacecraft to encounter Uranus; discovered 10 moons and 2 new rings"},{name:"Uranus Orbiter & Probe",year:"Proposed 2030s",agency:"NASA Decadal",role:"Flagship mission concept prioritized to explore ice giant interiors"}]},Neptune:{name:"Neptune",category:"planet",eyebrow:"PLANET",accentColor:"#4f83e2",eyebrowColor:"#7ca8ff",distanceAU:"30.06 AU",textureThumb:"textures/2k_neptune.jpg",monographText:"THE MOST DISTANT MAJOR PLANET, SHROUDED IN AN INTENSE DEEP-AZURE METHANE ATMOSPHERE WHERE SUPERSONIC WINDS SURPASS TWO THOUSAND KILOMETERS PER HOUR.",extendedLore:"Neptune was the first planet located through mathematical prediction rather than empirical observation: slight perturbations in Uranus's orbit allowed French astronomer Urbain Le Verrier to calculate its precise position in 1846. It harbors the retrograde moon Triton, a captured Kuiper Belt dwarf world exhibiting nitrogen cryovolcanoes.",missions:[{name:"Voyager 2",year:"1989",agency:"NASA",role:"Close flyby; detected the Great Dark Spot and geysers on Triton"}]},Pluto:{name:"Pluto",category:"dwarf_planet",eyebrow:"DWARF PLANET",accentColor:"#FF8732",eyebrowColor:"#ffa463",distanceAU:"39.48 AU",textureThumb:"textures/2k_moon.jpg",monographText:"SENTINEL OF THE KUIPER BELT, BEARING THE GLOWING NITROGEN ICE PLAINS OF TOMBAUGH REGIO AND SHARING A SYNCHRONOUS GRAVITATIONAL DANCE WITH ITS COMPANION CHARON.",extendedLore:"Reclassified as a dwarf planet in 2006, Pluto revealed itself during the 2015 New Horizons flyby as a geologically active wonderland. It features convection cells of churned nitrogen-carbon-monoxide ice, water-ice mountains towering 3,500 meters into its thin blue hazy atmosphere, and a likely deep subsurface liquid ocean.",missions:[{name:"New Horizons",year:"2015",agency:"NASA",role:"Historic historic flyby capturing high-resolution imagery of Tombaugh Regio"}]},Moon:{name:"Moon",category:"moon",eyebrow:"NATURAL SATELLITE · EARTH I",accentColor:"#d1d5db",eyebrowColor:"#e5e7eb",distanceAU:"1.000 AU",textureThumb:"textures/2k_moon.jpg",monographText:"EARTH'S CONSTANT CELESTIAL COMPANION, TIDALLY LOCKED IN AN ANCIENT GRAVITATIONAL EMBRACE. ITS HIGHLANDS AND BASALTIC MARIA PRESERVE FOUR BILLION YEARS OF COSMIC HISTORY.",extendedLore:"Formed ~4.5 billion years ago from the debris of a giant collision between the proto-Earth and a Mars-sized protoplanet named Theia. The Moon stabilizes Earth's rotational tilt, modulating climate extremes and generating oceanic tides.",missions:[{name:"Apollo 11",year:"1969",agency:"NASA",role:"First human landing on another celestial world"},{name:"LRO",year:"2009–Present",agency:"NASA",role:"High-resolution sub-meter 3D laser altimetry and mapping"},{name:"Artemis I",year:"2022",agency:"NASA",role:"Uncrewed lunar orbital qualification flight for deep space exploration"}]},Europa:{name:"Europa",category:"moon",eyebrow:"OCEAN MOON · JUPITER II",accentColor:"#7dd3fc",eyebrowColor:"#bae6fd",distanceAU:"5.203 AU",textureThumb:"textures/2k_moon.jpg",monographText:"A SMOOTH CRUST OF WATER ICE FRACTURED BY REDDISH LINEAE, CONCEALING A VAST GLOBAL SALTWATER OCEAN CONTAINING TWICE THE WATER OF ALL EARTH'S OCEANS COMBINED.",extendedLore:"Tidally flexed by orbital resonance with Io and Ganymede, Europa's rocky mantle produces geothermal heating that keeps its deep subsurface ocean in a liquid state. Cryovolcanic plumes venting water into space make it one of humankind's top destinations in the search for extraterrestrial habitability.",missions:[{name:"Galileo",year:"1995–2003",agency:"NASA",role:"Discovered induced magnetic field evidence for a subsurface saline ocean"},{name:"Europa Clipper",year:"2024–Present",agency:"NASA",role:"Dedicated mission equipped with ice-penetrating radar to confirm habitability"}]},Io:{name:"Io",category:"moon",eyebrow:"VOLCANIC MOON · JUPITER I",accentColor:"#facc15",eyebrowColor:"#fef08a",distanceAU:"5.203 AU",textureThumb:"textures/2k_moon.jpg",monographText:"THE MOST VOLCANICALLY ACTIVE BODY IN THE SOLAR SYSTEM, SCARRED BY HUNDREDS OF ACTIVE VOLCANOES DRIVEN BY INTENSE GRAVITATIONAL TIDAL FRICTION.",extendedLore:"Caught in an eccentric resonance between Jupiter and its sibling moons, Io undergoes constant tidal flexing that generates ferocious internal heat, driving molten silicate lava lakes and sulfur plumes hundreds of kilometers into space.",missions:[{name:"Voyager 1",year:"1979",agency:"NASA",role:"First observation of active extraterrestrial volcanism"},{name:"Juno",year:"2016–Present",agency:"NASA",role:"Close flybys mapping polar volcanic hotspots and magma oceans"}]},Ganymede:{name:"Ganymede",category:"moon",eyebrow:"GIANT MOON · JUPITER III",accentColor:"#cbd5e1",eyebrowColor:"#e2e8f0",distanceAU:"5.203 AU",textureThumb:"textures/2k_moon.jpg",monographText:"THE LARGEST MOON IN THE SOLAR SYSTEM, EVEN EXCEEDING MERCURY IN DIAMETER, AND THE ONLY SATELLITE BEARING AN INTERNALLY GENERATED MAGNETIC FIELD.",extendedLore:"Possesses a molten iron-rich core that generates an intrinsic magnetosphere. Beneath its grooved and fractured tectonic ice shell lies a deep subterranean liquid ocean separated by high-pressure ice phases.",missions:[{name:"Galileo",year:"1995–2003",agency:"NASA",role:"Identified intrinsic dipolar magnetic field"},{name:"JUICE",year:"2023–Present",agency:"ESA",role:"En route to enter permanent orbit around Ganymede in 2034"}]},Titan:{name:"Titan",category:"moon",eyebrow:"HYDROCARBON WORLD · SATURN VI",accentColor:"#f59e0b",eyebrowColor:"#fde68a",distanceAU:"9.539 AU",textureThumb:"textures/2k_moon.jpg",monographText:"THE ONLY MOON WITH A DENSE ATMOSPHERE AND STABLE SURFACE SEAS, WHERE METHANE AND ETHANE FORM A COMPLETE METEOROLOGICAL HYDROLOGIC CYCLE.",extendedLore:"Exceeding Mercury in size, Titan possesses an orange smoggy atmosphere 1.5 times denser than Earth's sea-level pressure. Cryogenic rivers carve canyon networks feeding liquid hydrocarbon seas like Kraken Mare.",missions:[{name:"Cassini-Huygens",year:"2004–2017",agency:"NASA / ESA",role:"Huygens landed directly on Titan's surface in 2005"},{name:"Dragonfly",year:"Planned 2028",agency:"NASA",role:"Rotorcraft lander to explore prebiotic organic chemistry"}]},Enceladus:{name:"Enceladus",category:"moon",eyebrow:"CRYOVOLCANIC MOON · SATURN II",accentColor:"#e0f2fe",eyebrowColor:"#f0f9ff",distanceAU:"9.539 AU",textureThumb:"textures/2k_moon.jpg",monographText:"AN IMMACULATE WORLD OF PURE REFLECTIVE ICE, ERUPTING GIANT HYDROTHERMAL GEYSERS FROM TIGER STRIPES OVER ITS SOUTH POLAR TERRAIN.",extendedLore:"Enceladus possesses a global liquid saltwater ocean in direct physical contact with an active hydrothermal rocky seafloor. Cassini detected complex macromolecules and molecular hydrogen in its plumes, confirming active serpentinization.",missions:[{name:"Cassini",year:"2005–2017",agency:"NASA / ESA",role:"Flew directly through erupting plumes, sampling water vapor, salts, and organics"}]},Ceres:{name:"Ceres",category:"dwarf_planet",eyebrow:"DWARF PLANET · ASTEROID BELT",accentColor:"#a1a1aa",eyebrowColor:"#d4d4d8",distanceAU:"2.767 AU",textureThumb:"textures/2k_moon.jpg",monographText:"EMPRESS OF THE ASTEROID BELT, HOLDING A THIRD OF ITS ENTIRE MASS. AN ICE-RICH RELICT WORLD FEATURING RADIANT SODIUM CARBONATE SALT DOMES.",extendedLore:"Ceres is a differentiated protoplanet containing significant quantities of water ice and hydrous minerals. Occator Crater hosts the bright Cerealia Facula, formed by subsurface brine percolation and cryovolcanic extrusion.",missions:[{name:"Dawn",year:"2015–2018",agency:"NASA",role:"Orbited Ceres for three years, discovering active cryovolcanism and hydrated minerals"}]},Sun:{name:"Sun",category:"star",eyebrow:"STAR",accentColor:"#ffaa33",eyebrowColor:"#ffe4a0",distanceAU:"0.000 AU",textureThumb:"textures/2k_sun.jpg",monographText:"THE GLOWING HEART OF OUR SYSTEM, CONTAINING OVER NINETY-NINE POINT EIGHT PERCENT OF ALL MASS. A THERMONUCLEAR ENGINE POWERING ALL LIGHT, LIFE, AND GRAVITATIONAL HARMONY.",extendedLore:"Every second in the solar core, 600 million tons of hydrogen undergo thermonuclear fusion into helium, converting 4 million tons of matter into pure radiant energy. The photon diffusion through the dense radiative zone takes over 100,000 years to reach the convective layer and escape as solar light.",missions:[{name:"SOHO",year:"1995–Present",agency:"ESA / NASA",role:"Continuous monitoring of helioseismology and coronal mass ejections"},{name:"Parker Solar Probe",year:"2018–Present",agency:"NASA",role:"Closest spacecraft to Sun, diving directly through the outer corona"},{name:"Solar Orbiter",year:"2020–Present",agency:"ESA / NASA",role:"Capturing the first close-up images of the Sun's polar regions"}]},"Sagittarius A*":{name:"Sagittarius A*",category:"black_hole",eyebrow:"SUPERMASSIVE BLACK HOLE",accentColor:"#f59e0b",eyebrowColor:"#fde68a",distanceAU:"1.65 × 10⁹ AU (26,990 LY)",textureThumb:"textures/milky_way_disk.png",monographText:"THE 4.3 MILLION SOLAR MASS SUPERMASSIVE BLACK HOLE AT THE DYNAMICAL HEART OF THE MILKY WAY. ITS EVENT HORIZON TRAPS ALL LIGHT, BENDING SPACETIME INTO A RELATIVISTIC PHOTON RING.",extendedLore:"Sagittarius A* (Sgr A*) anchors the Milky Way Galaxy with a mass of 4.297 ± 0.012 × 10⁶ M☉ located 8.277 ± 0.033 kpc (~26,990 light-years) from Earth. In May 2022, the Event Horizon Telescope (EHT) collaboration released the first direct horizon-scale image of its shadow, resolving an angular diameter of 51.8 ± 2.3 microarcseconds that confirms Einstein's General Relativity. Matter orbiting near the innermost stable circular orbit (ISCO at 3.0 r_s) reaches speeds of 0.408 c (122,400 km/s), generating extreme relativistic Doppler beaming and gravitational redshift, framed by high-velocity stars of the central nuclear S-cluster.",missions:[{name:"Event Horizon Telescope (EHT)",year:"2022",agency:"Global Consortium / NSF / ESO",role:"First direct millimeter-wave imaging of Sgr A* event horizon shadow"},{name:"GRAVITY / ESO VLTI",year:"2018–Present",agency:"ESO",role:"Detection of gravitational redshift in star S2 orbit and orbital flares near ISCO"},{name:"Chandra X-ray Observatory",year:"1999–Present",agency:"NASA",role:"Long-term monitoring of hot gas accretion and high-energy flare eruptions"},{name:"Neil Gehrels Swift Observatory",year:"2004–Present",agency:"NASA",role:"Daily multiwavelength monitoring of Galactic Center flaring activity"}]}};function QT(t){return xh[t]?xh[t]:{name:t,category:"moon",eyebrow:"CELESTIAL BODY",accentColor:"#93c5fd",eyebrowColor:"#bfdbfe",distanceAU:"—",textureThumb:"textures/2k_moon.jpg",monographText:`${t.toUpperCase()} IS A DOCUMENTED COMPONENT OF THE SOLAR SYSTEM CATALOGUE.`,extendedLore:`${t} is catalogued under the NASA JPL DE440 ephemeris model.`,missions:[]}}/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const eA=t=>t.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),mx=(...t)=>t.filter((e,n,i)=>!!e&&e.trim()!==""&&i.indexOf(e)===n).join(" ").trim();/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var tA={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nA=De.forwardRef(({color:t="currentColor",size:e=24,strokeWidth:n=2,absoluteStrokeWidth:i,className:r="",children:s,iconNode:a,...o},l)=>De.createElement("svg",{ref:l,...tA,width:e,height:e,stroke:t,strokeWidth:i?Number(n)*24/Number(e):n,className:mx("lucide",r),...o},[...a.map(([c,u])=>De.createElement(c,u)),...Array.isArray(s)?s:[s]]));/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xr=(t,e)=>{const n=De.forwardRef(({className:i,...r},s)=>De.createElement(nA,{ref:s,iconNode:e,className:mx(`lucide-${eA(t)}`,i),...r}));return n.displayName=`${t}`,n};/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const iA=xr("Calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rA=xr("EyeOff",[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sA=xr("Eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const aA=xr("Pause",[["rect",{x:"14",y:"4",width:"4",height:"16",rx:"1",key:"zuxfzm"}],["rect",{x:"6",y:"4",width:"4",height:"16",rx:"1",key:"1okwgv"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oA=xr("Play",[["polygon",{points:"6 3 20 12 6 21 6 3",key:"1oa8hb"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lA=xr("RotateCcw",[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m0=xr("Search",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Uu=xr("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]),cA=["Sagittarius A*","Pluto","Neptune","Uranus","Saturn","Jupiter","Mars","Earth","Venus","Mercury"],uA=({telemetry:t,onSelectPlanet:e,onResetView:n,onTogglePlay:i,onSetTimeMultiplier:r,onSetScaleMode:s,onSeekDate:a,onResetToJ2000:o,onResetToNow:l,onToggleConstellations:c,onToggleAsteroidBelt:u,onToggleOrbits:h,onJumpToScale:f})=>{const p=t==null?void 0:t.activeTarget,v=(t==null?void 0:t.isPaused)??!1,y=(t==null?void 0:t.timeScale)??1,m=(t==null?void 0:t.scaleMode)??"exploration",d=(t==null?void 0:t.julianDate)??2451545,g=(t==null?void 0:t.utcIso)??new Date().toISOString(),x=(t==null?void 0:t.constellationsVisible)??!0,_=(t==null?void 0:t.asteroidBeltVisible)??!0,R=(t==null?void 0:t.orbitsVisible)??!0,T=(t==null?void 0:t.observerScaleMetric)??"1.00 AU",A=(t==null?void 0:t.observerDomain)??"inner_system",b=(t==null?void 0:t.travelSpeed)??0,[w,M]=De.useState(!0),[D,V]=De.useState(!1),[z,X]=De.useState(!1),[Z,Y]=De.useState("all"),[te,I]=De.useState(""),[$,J]=De.useState(g.slice(0,10)),[ae,ye]=De.useState(!1),[Ve,K]=De.useState(!1),[ne,ce]=De.useState(0),[oe,Ce]=De.useState(!0),[Ie,Ue]=De.useState(!1),[dt,je]=De.useState(!1);De.useEffect(()=>{if(typeof window<"u"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches){ce(2);return}const L=setTimeout(()=>ce(1),500),B=setTimeout(()=>ce(2),1200);return()=>{clearTimeout(L),clearTimeout(B)}},[]),De.useEffect(()=>{const L=B=>{B.target instanceof HTMLInputElement||B.target instanceof HTMLTextAreaElement||(B.key===" "||B.code==="Space"?(B.preventDefault(),i()):B.key==="h"||B.key==="H"?(B.preventDefault(),M(ge=>!ge)):B.key==="Escape"?D?V(!1):z||ae?(X(!1),ye(!1)):n():B.key==="o"||B.key==="O"?h==null||h():B.key==="c"||B.key==="C"?c==null||c():(B.key==="b"||B.key==="B")&&(u==null||u()))};return window.addEventListener("keydown",L),()=>window.removeEventListener("keydown",L)},[i,h,c,u,n,D,z,ae]),De.useEffect(()=>{!Ve&&!ae&&J(g.slice(0,10))},[g,Ve,ae]);const Be=(p==null?void 0:p.name)||"Mercury",U=De.useMemo(()=>QT(Be),[Be]),rn=De.useMemo(()=>{const L=[...Qt.getAllBodies()],B=Qt.getSagittariusAStar();return B&&L.unshift(B),L},[]),Re=De.useMemo(()=>Be==="Sagittarius A*"||Be==="Sgr A*"||Be==="sagittarius_a_star"?Qt.getSagittariusAStar():Qt.getBody(Be),[Be]),[Xe,be]=De.useState(1),at=De.useRef(null);De.useEffect(()=>{Be!==at.current&&(at.current=Be,be(L=>L+1))},[Be]),De.useEffect(()=>{if(Ce(!0),Ue(!1),dt)return;const L=setTimeout(()=>{Ue(!0)},5500),B=setTimeout(()=>{Ce(!1),Ue(!1)},7100);return()=>{clearTimeout(L),clearTimeout(B)}},[Xe,dt]);const Ae=De.useCallback(()=>{Ce(!0),Ue(!1),be(L=>L+1)},[]),C=De.useMemo(()=>rn.filter(L=>{if(Z==="planet"&&L.category!=="planet"||Z==="moon"&&L.category!=="moon"||Z==="minor"&&L.category!=="asteroid"&&L.category!=="dwarf_planet")return!1;if(te.trim()){const B=te.toLowerCase();return L.name.toLowerCase().includes(B)||L.category.toLowerCase().includes(B)||L.parentName&&L.parentName.toLowerCase().includes(B)}return!0}),[rn,Z,te]),S=L=>{L.preventDefault(),K(!1);const B=Date.parse($);isNaN(B)||(a(B),ye(!1))},H=[{label:"1×",val:1},{label:"10×",val:10},{label:"100×",val:100},{label:"1 D/S",val:86400},{label:"1 M/S",val:2592e3},{label:"1 Y/S",val:31536e3}],Q="/solaris/";return w?N.jsxs("div",{className:"absolute inset-0 pointer-events-none select-none flex flex-col justify-between p-6 z-20 font-sans text-white/90 overflow-hidden",children:[N.jsx("div",{className:"absolute -top-16 left-1/2 -translate-x-1/2 w-[540px] h-32 rounded-[100%] bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-transparent blur-3xl pointer-events-none"}),N.jsxs("header",{className:"flex justify-between items-start pointer-events-auto w-full z-30",children:[N.jsxs("div",{className:`flex flex-col gap-1.5 transition-all duration-1000 ${ne>=0?"opacity-100 translate-y-0":"opacity-0 -translate-y-4"}`,children:[N.jsxs("div",{className:"flex items-baseline gap-3 relative group cursor-pointer",onClick:n,title:"Reset to Solaris Overview",children:[N.jsx("div",{className:"absolute -inset-2 bg-gradient-to-r from-amber-500/10 via-white/5 to-transparent rounded-lg blur-md opacity-40 group-hover:opacity-90 transition-opacity animate-corona-aura pointer-events-none"}),N.jsx("h1",{className:"relative text-xl md:text-2xl uppercase tracking-[0.52em] font-extralight drop-shadow-md select-none animate-solaris-shimmer",children:"SOLARIS"}),N.jsx("span",{className:"text-[9px] uppercase tracking-[0.32em] text-white/35 font-light hidden sm:inline",children:"Solar System Explorer"})]}),N.jsxs("div",{className:"flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-light text-white/60 bg-black/40 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/10 shadow-lg w-fit mt-0.5",children:[N.jsx("span",{className:`w-1.5 h-1.5 rounded-full ${v?"bg-amber-400":"bg-emerald-400 animate-pulse"}`}),N.jsxs("span",{className:"text-white/85",children:[g.replace("T"," ").slice(0,19)," UTC"]}),N.jsx("span",{className:"text-white/20",children:"·"}),N.jsxs("span",{children:["JD ",d.toFixed(2)]}),N.jsx("span",{className:"text-white/20",children:"·"}),N.jsx("span",{className:"text-amber-300/90 font-mono tracking-wider",children:T})]})]}),N.jsxs("div",{className:"hidden xl:flex items-center gap-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-1 shadow-lg pointer-events-auto",children:[N.jsxs("div",{className:"flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] tracking-[0.2em] font-light",children:[N.jsx("span",{className:`w-1.5 h-1.5 rounded-full ${b>4?"bg-cyan-400 animate-ping":"bg-amber-400"}`}),N.jsx("span",{className:"text-white/40 uppercase",children:"SCALE:"}),N.jsx("span",{className:"text-white font-medium tracking-[0.12em]",children:T})]}),N.jsxs("div",{className:"flex items-center gap-0.5 text-[9px] uppercase tracking-[0.2em] font-light",children:[N.jsx("button",{onClick:()=>f==null?void 0:f("planetary"),className:`px-2.5 py-1 rounded-full transition-all duration-200 ${A==="planetary"?"bg-white/20 text-white font-medium shadow-sm border border-white/25":"text-white/40 hover:text-white/80"}`,children:"Planet"}),N.jsx("button",{onClick:()=>f==null?void 0:f("inner_system"),className:`px-2.5 py-1 rounded-full transition-all duration-200 ${A==="inner_system"?"bg-white/20 text-white font-medium shadow-sm border border-white/25":"text-white/40 hover:text-white/80"}`,children:"Inner Sys"}),N.jsx("button",{onClick:()=>f==null?void 0:f("outer_system"),className:`px-2.5 py-1 rounded-full transition-all duration-200 ${A==="outer_system"?"bg-white/20 text-white font-medium shadow-sm border border-white/25":"text-white/40 hover:text-white/80"}`,children:"Outer Sys"}),N.jsx("button",{onClick:()=>f==null?void 0:f("interstellar"),className:`px-2.5 py-1 rounded-full transition-all duration-200 ${A==="interstellar"?"bg-cyan-400/25 text-cyan-200 font-medium shadow-sm border border-cyan-400/35":"text-white/40 hover:text-white/80"}`,children:"Interstellar"}),N.jsx("button",{onClick:()=>f==null?void 0:f("galactic"),className:`px-2.5 py-1 rounded-full transition-all duration-200 ${A==="galactic"&&Be!=="Sagittarius A*"?"bg-purple-400/25 text-purple-200 font-medium shadow-sm border border-purple-400/35":"text-white/40 hover:text-white/80"}`,children:"Milky Way"}),N.jsx("button",{onClick:()=>{e("Sagittarius A*"),Ae()},className:`px-2.5 py-1 rounded-full transition-all duration-200 ${Be==="Sagittarius A*"?"bg-amber-500/30 text-amber-200 font-medium shadow-sm border border-amber-500/40":"text-white/40 hover:text-white/80"}`,children:"Sgr A*"})]})]}),N.jsxs("div",{className:"flex items-center gap-2",children:[N.jsxs("div",{className:"flex items-center bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-0.5 text-[10px] uppercase tracking-[0.2em] font-light shadow-lg",children:[N.jsx("button",{onClick:L=>{L.stopPropagation(),h==null||h()},title:"Toggle Orbit Lines (O)",className:`px-3 py-1 rounded-full transition-all duration-200 ${R?"bg-white/15 text-white shadow-sm border border-white/20":"text-white/40 hover:text-white/80"}`,children:"Orbits"}),N.jsx("button",{onClick:L=>{L.stopPropagation(),c==null||c()},title:"Toggle IAU Constellations (C)",className:`px-3 py-1 rounded-full transition-all duration-200 ${x?"bg-white/15 text-white shadow-sm border border-white/20":"text-white/40 hover:text-white/80"}`,children:"Constellations"}),N.jsx("button",{onClick:L=>{L.stopPropagation(),u==null||u()},title:"Toggle Asteroid Belt (B)",className:`px-3 py-1 rounded-full transition-all duration-200 ${_?"bg-white/15 text-white shadow-sm border border-white/20":"text-white/40 hover:text-white/80"}`,children:"Belt"})]}),N.jsxs("div",{className:"flex items-center bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-0.5 text-[10px] uppercase tracking-[0.2em] font-light shadow-lg",children:[N.jsx("button",{onClick:L=>{L.stopPropagation(),s("exploration")},className:`px-3 py-1 rounded-full transition-all duration-200 ${m==="exploration"?"bg-white/15 text-white shadow-sm border border-white/20":"text-white/40 hover:text-white/80"}`,children:"Exploration"}),N.jsx("button",{onClick:L=>{L.stopPropagation(),s("scientific")},className:`px-3 py-1 rounded-full transition-all duration-200 ${m==="scientific"?"bg-white/15 text-white shadow-sm border border-white/20":"text-white/40 hover:text-white/80"}`,children:"Scientific 1:1"})]}),N.jsxs("button",{onClick:L=>{L.stopPropagation(),X(!0)},className:"flex items-center gap-1.5 px-3.5 py-1.5 bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/10 hover:border-white/20 rounded-full text-[10px] uppercase tracking-[0.2em] font-light text-white/80 transition shadow-lg",children:[N.jsx(m0,{size:11,className:"text-white/50"}),N.jsx("span",{children:"Catalogue (42)"})]}),N.jsxs("button",{onClick:L=>{L.stopPropagation(),n()},title:"Reset to System Overview",className:"flex items-center gap-1.5 px-3.5 py-1.5 bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/10 hover:border-white/20 rounded-full text-[10px] uppercase tracking-[0.2em] font-light text-white/80 transition shadow-lg",children:[N.jsx(lA,{size:11,className:"text-white/50"}),N.jsx("span",{children:"Overview"})]}),N.jsx("button",{onClick:L=>{L.stopPropagation(),M(!1)},title:"Hide Interface (H)",className:"p-2 bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/10 rounded-full text-white/40 hover:text-white transition shadow-lg",children:N.jsx(rA,{size:12})})]})]}),N.jsx("nav",{className:`absolute left-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 pointer-events-auto transition-all duration-1000 z-30 ${ne>=1?"opacity-100 translate-x-0":"opacity-0 -translate-x-8"}`,children:cA.map(L=>{const B=xh[L],ge=Be===L,ue=`${Q}${(B==null?void 0:B.textureThumb)||"textures/2k_moon.jpg"}`;return N.jsxs("button",{onClick:ve=>{ve.stopPropagation(),e(L),Ae()},className:"flex items-center gap-3.5 group text-left cursor-pointer transition-all duration-200 outline-none focus:outline-none",children:[N.jsx("div",{className:`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${ge?"border-white":"border-white/35 group-hover:border-white/60"}`,children:ge&&N.jsx("div",{className:"w-1.5 h-1.5 rounded-full bg-white transition-transform scale-100"})}),ge?N.jsx("div",{className:"h-2.5 rounded-sm transition-all duration-300",style:{backgroundColor:(B==null?void 0:B.accentColor)||"#ffffff",width:"28px",boxShadow:`0 0 10px ${(B==null?void 0:B.accentColor)||"#ffffff"}88`}}):N.jsx("div",{className:"w-6 h-6 rounded-full bg-cover bg-center transition-opacity duration-200 opacity-60 group-hover:opacity-90 flex-shrink-0",style:{backgroundImage:`url(${ue})`,boxShadow:"inset -2px -4px 5px 1px rgba(0,0,0,0.9), inset 1px 1px 2px rgba(255,255,255,0.2)"}}),N.jsxs("div",{className:"flex flex-col",children:[N.jsx("span",{className:`text-[11px] uppercase tracking-[0.22em] transition-colors duration-200 ${ge?"text-white font-medium":"text-white/40 group-hover:text-white/80"}`,children:L}),N.jsx("span",{className:`text-[9px] tracking-wider transition-colors duration-200 font-light ${ge?"text-white/50":"text-white/20 group-hover:text-white/40"}`,children:(B==null?void 0:B.distanceAU)||""})]})]},L)})}),oe&&N.jsx("section",{onMouseEnter:()=>je(!0),onMouseLeave:()=>je(!1),className:"absolute left-1/2 bottom-20 md:bottom-24 -translate-x-1/2 pointer-events-auto select-none z-20",children:N.jsxs("div",{className:`flex flex-col items-center text-center max-w-2xl px-6 ${Ie?"monograph-vanishing":"monograph-visible"}`,children:[N.jsx("span",{className:"text-[11px] md:text-xs uppercase tracking-[0.52em] font-light transition-colors duration-500 mb-1",style:{color:U.eyebrowColor},children:U.eyebrow}),N.jsx("h2",{className:"text-5xl md:text-6xl lg:text-7xl font-extralight tracking-[0.36em] text-white uppercase drop-shadow-2xl my-1.5 transition-all duration-500",children:Be}),N.jsx("p",{className:"text-[10px] md:text-[11px] lg:text-[12px] font-light tracking-[0.20em] leading-relaxed text-white/75 uppercase max-w-xl mx-auto my-3 text-center transition-all duration-500",children:U.monographText}),N.jsxs("button",{onClick:L=>{L.stopPropagation(),V(!0)},className:"group mt-2.5 flex flex-col items-center cursor-pointer transition-all duration-300 outline-none focus:outline-none",children:[N.jsx("span",{className:"text-xs uppercase tracking-[0.32em] font-light transition-colors duration-300",style:{color:U.accentColor},children:"READ MORE"}),N.jsx("div",{className:"h-[1px] w-full mt-1 transition-all duration-300 group-hover:w-[115%]",style:{backgroundColor:U.accentColor,boxShadow:`0 0 6px ${U.accentColor}66`}})]})]})}),!oe&&N.jsx("div",{className:"absolute left-1/2 bottom-20 -translate-x-1/2 pointer-events-auto z-20 transition-all duration-700 opacity-60 hover:opacity-100",children:N.jsxs("button",{onClick:L=>{L.stopPropagation(),Ae()},className:"flex items-center gap-2 px-3.5 py-1 text-[10px] uppercase tracking-[0.25em] font-light text-white/60 hover:text-white bg-black/40 hover:bg-black/80 backdrop-blur-md border border-white/10 hover:border-white/25 rounded-full transition-all shadow-lg cursor-pointer",children:[N.jsx("span",{className:"w-1.5 h-1.5 rounded-full animate-pulse",style:{backgroundColor:U.accentColor}}),N.jsxs("span",{children:[Be," Overview"]})]})}),N.jsxs("footer",{className:"flex flex-col items-center gap-2 w-full pointer-events-auto z-30",children:[N.jsxs("div",{className:"flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-4 py-1 text-[10px] uppercase tracking-[0.2em] font-light shadow-xl",children:[N.jsx("button",{onClick:L=>{L.stopPropagation(),i()},className:"p-1 text-white/70 hover:text-white transition rounded-full",title:"Space to toggle play",children:v?N.jsx(oA,{size:11}):N.jsx(aA,{size:11})}),N.jsx("div",{className:"flex items-center gap-1 border-l border-white/10 pl-3",children:H.map(L=>{const B=!v&&y===L.val;return N.jsx("button",{onClick:ge=>{ge.stopPropagation(),r(L.val)},className:`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-[0.15em] transition-all duration-200 ${B?"bg-white/20 text-white font-normal border border-white/25 shadow-sm":"text-white/40 hover:text-white/70"}`,children:L.label},L.label)})}),N.jsxs("div",{className:"flex items-center gap-1.5 border-l border-white/10 pl-3 text-[10px] uppercase tracking-[0.2em] font-light",children:[N.jsx("button",{onClick:L=>{L.stopPropagation(),o()},className:"text-white/40 hover:text-white px-1.5 py-0.5 rounded transition",children:"J2000"}),N.jsx("button",{onClick:L=>{L.stopPropagation(),l()},className:"text-white/40 hover:text-white px-1.5 py-0.5 rounded transition",children:"Now"}),N.jsxs("button",{onClick:L=>{L.stopPropagation(),ye(!ae)},className:"flex items-center gap-1 text-white/50 hover:text-white px-1.5 py-0.5 rounded transition",children:[N.jsx(iA,{size:10}),N.jsx("span",{children:$})]})]})]}),ae&&N.jsxs("form",{onSubmit:S,className:"flex items-center gap-2 bg-black/85 backdrop-blur-xl border border-white/15 rounded-xl px-3 py-2 text-[10px] uppercase tracking-[0.2em] font-light shadow-2xl",children:[N.jsx("input",{type:"date",value:$,onFocus:()=>K(!0),onChange:L=>{K(!0),J(L.target.value)},onBlur:()=>K(!1),className:"bg-white/10 text-white px-2 py-1 rounded border border-white/15 outline-none focus:border-white/40 text-[11px] font-sans"}),N.jsx("button",{type:"submit",className:"px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg transition text-[10px] uppercase tracking-[0.2em] font-light",children:"Jump"}),N.jsx("button",{type:"button",onClick:()=>ye(!1),className:"p-1 text-white/40 hover:text-white",children:N.jsx(Uu,{size:12})})]})]}),D&&N.jsxs("div",{className:"fixed inset-0 z-50 pointer-events-auto flex justify-end animate-fadeIn",children:[N.jsx("div",{onClick:()=>V(!1),className:"flex-1 bg-black/60 backdrop-blur-sm transition-opacity"}),N.jsxs("aside",{className:"w-[420px] max-w-full bg-[#040307]/95 backdrop-blur-2xl border-l border-white/10 p-7 flex flex-col gap-6 shadow-2xl h-full font-sans overflow-y-auto no-scrollbar",children:[N.jsxs("div",{className:"flex justify-between items-start border-b border-white/10 pb-4",children:[N.jsxs("div",{children:[N.jsxs("span",{className:"text-[10px] uppercase tracking-[0.25em] font-light block",style:{color:U.eyebrowColor},children:[U.eyebrow," · SOLAR SYSTEM EXPLORER"]}),N.jsx("h2",{className:"text-3xl font-extralight text-white tracking-[0.25em] uppercase mt-1",children:Be})]}),N.jsx("button",{onClick:()=>V(!1),className:"text-white/40 hover:text-white transition p-1.5 rounded-full hover:bg-white/10",children:N.jsx(Uu,{size:18})})]}),N.jsxs("div",{className:"flex flex-col gap-2",children:[N.jsx("span",{className:"text-[10px] tracking-[0.25em] uppercase text-white/40 font-light",children:"Astronomical Lore & Physical Environment"}),N.jsx("p",{className:"text-xs leading-relaxed text-white/80 font-light",children:U.extendedLore})]}),(Be==="Sagittarius A*"||(p==null?void 0:p.category)==="black_hole")&&N.jsxs("div",{className:"flex flex-col gap-2.5 pt-2 border-t border-amber-500/30",children:[N.jsxs("div",{className:"flex items-center justify-between",children:[N.jsx("span",{className:"text-[10px] tracking-[0.25em] uppercase text-amber-400 font-medium",children:"Relativistic Horizons & Metrics"}),N.jsx("span",{className:"text-[9px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30",children:"EHT / NASA SVS"})]}),N.jsxs("div",{className:"grid grid-cols-2 gap-y-2 text-xs font-light bg-amber-500/5 p-3 rounded-xl border border-amber-500/15",children:[N.jsx("span",{className:"text-white/40",children:"Mass (M)"}),N.jsx("span",{className:"text-right text-amber-200 font-mono",children:"4.297 ± 0.012 × 10⁶ M☉"}),N.jsx("span",{className:"text-white/40",children:"Schwarzschild Radius (r_s)"}),N.jsx("span",{className:"text-right text-amber-200 font-mono",children:"12.69 × 10⁶ km (0.085 AU)"}),N.jsx("span",{className:"text-white/40",children:"Photon Sphere (r_ph)"}),N.jsx("span",{className:"text-right text-amber-200 font-mono",children:"1.5 r_s · 19.04 × 10⁶ km"}),N.jsx("span",{className:"text-white/40",children:"Shadow Radius (r_shadow)"}),N.jsx("span",{className:"text-right text-amber-200 font-mono",children:"2.60 r_s · 32.97 × 10⁶ km"}),N.jsx("span",{className:"text-white/40",children:"EHT Shadow Diameter (θ)"}),N.jsx("span",{className:"text-right text-amber-200 font-mono",children:"51.8 ± 2.3 µas"}),N.jsx("span",{className:"text-white/40",children:"ISCO Radius (r_isco)"}),N.jsx("span",{className:"text-right text-amber-200 font-mono",children:"3.0 r_s · 38.07 × 10⁶ km"}),N.jsx("span",{className:"text-white/40",children:"ISCO Orbital Velocity"}),N.jsx("span",{className:"text-right text-amber-200 font-mono",children:"0.408 c (122,400 km/s)"}),N.jsx("span",{className:"text-white/40",children:"Galactic Center Distance"}),N.jsx("span",{className:"text-right text-amber-200 font-mono",children:"8.277 kpc (26,990 ly)"})]}),N.jsxs("div",{className:"flex flex-col gap-1.5 p-3 rounded-xl bg-black/50 border border-white/10 text-[11px] text-white/70 font-light",children:[N.jsx("span",{className:"text-[10px] uppercase tracking-[0.2em] text-white/40 font-medium",children:"Relativistic Optical Phenomena:"}),N.jsxs("p",{children:["• ",N.jsx("strong",{className:"text-amber-200 font-normal",children:"Event Horizon Shadow:"})," Null-geodesic ray tracing confirms absolute photon capture for impact parameters b < 2.598 r_s (3√3/2 r_s)."]}),N.jsxs("p",{children:["• ",N.jsx("strong",{className:"text-amber-200 font-normal",children:"Lensed Accretion Arches:"})," Light emitted from the rear accretion disk loops over and under the black hole's gravitational potential well, projecting primary and secondary lensed arcs."]}),N.jsxs("p",{children:["• ",N.jsx("strong",{className:"text-amber-200 font-normal",children:"Relativistic Doppler Beaming:"})," Plasma orbiting at ~0.4 c blazes in intense blue-white on the approaching left limb (intensity boost ~ δ⁴) while receding plasma dims into deep red."]}),N.jsxs("p",{children:["• ",N.jsx("strong",{className:"text-amber-200 font-normal",children:"Relativistic Polar Jets:"})," Twin collimated particle beams erupting at ~0.98 c along the spin axis, featuring an incandescent white-hot core and helical synchrotron shock sheaths."]}),N.jsxs("p",{children:["• ",N.jsx("strong",{className:"text-amber-200 font-normal",children:"Nuclear S-Cluster:"})," Over 300 massive B/O-type stars orbit Sgr A* in the central parsec, including star S2 reaching speeds of 7,650 km/s at pericenter."]})]})]}),Re&&N.jsxs("div",{className:"flex flex-col gap-2 pt-2 border-t border-white/10",children:[N.jsx("span",{className:"text-[10px] tracking-[0.25em] uppercase text-white/40 font-light",children:"Physical Dimensions"}),N.jsxs("div",{className:"grid grid-cols-2 gap-y-2 text-xs font-light",children:[N.jsx("span",{className:"text-white/40",children:"Mean Radius"}),N.jsxs("span",{className:"text-right text-white/90",children:[Re.physical.meanRadiusKm.toLocaleString()," km"]}),N.jsx("span",{className:"text-white/40",children:"Surface Gravity"}),N.jsx("span",{className:"text-right text-white/90",children:Re.physical.gmKm3S2?`${(Re.physical.gmKm3S2*1e3/Math.pow(Re.physical.meanRadiusKm,2)).toFixed(2)} m/s²`:"—"}),N.jsx("span",{className:"text-white/40",children:"Sidereal Day"}),N.jsx("span",{className:"text-right text-white/90",children:Re.physical.rotationPeriodHours!==void 0?`${Re.physical.rotationPeriodHours.toFixed(1)} h`:"Synchronous"}),N.jsx("span",{className:"text-white/40",children:"Axial Tilt"}),N.jsx("span",{className:"text-right text-white/90",children:Re.physical.axialTiltDeg!==void 0?`${Re.physical.axialTiltDeg.toFixed(2)}°`:"0.00°"})]})]}),Re&&N.jsxs("div",{className:"flex flex-col gap-2 pt-2 border-t border-white/10",children:[N.jsx("span",{className:"text-[10px] tracking-[0.25em] uppercase text-white/40 font-light",children:"Keplerian Orbit (J2000)"}),N.jsxs("div",{className:"grid grid-cols-2 gap-y-2 text-xs font-light",children:[N.jsx("span",{className:"text-white/40",children:"Semi-Major Axis"}),N.jsxs("span",{className:"text-right text-white/90",children:[Re.orbit.semiMajorAxisAU.toFixed(3)," AU"]}),N.jsx("span",{className:"text-white/40",children:"Eccentricity"}),N.jsx("span",{className:"text-right text-white/90",children:Re.orbit.eccentricity.toFixed(4)}),N.jsx("span",{className:"text-white/40",children:"Orbital Period"}),N.jsx("span",{className:"text-right text-white/90",children:Re.orbit.orbitalPeriodDays>730?`${(Re.orbit.orbitalPeriodDays/365.25).toFixed(2)} yr`:`${Re.orbit.orbitalPeriodDays.toFixed(1)} d`}),N.jsx("span",{className:"text-white/40",children:"Inclination"}),N.jsxs("span",{className:"text-right text-white/90",children:[Re.orbit.inclinationDeg.toFixed(2),"°"]})]})]}),p&&N.jsxs("div",{className:"flex flex-col gap-2 pt-2 border-t border-white/10",children:[N.jsx("span",{className:"text-[10px] tracking-[0.25em] uppercase text-white/40 font-light",children:"Live Ephemeris Telemetry"}),N.jsxs("div",{className:"grid grid-cols-2 gap-y-2 text-xs font-light",children:[N.jsx("span",{className:"text-white/40",children:"Heliocentric Dist"}),N.jsx("span",{className:"text-right text-white/90",children:p.distanceKm>1e6?`${(p.distanceKm/1e6).toFixed(2)}M km`:`${Math.round(p.distanceKm).toLocaleString()} km`}),N.jsx("span",{className:"text-white/40",children:"AU Distance"}),N.jsxs("span",{className:"text-right text-white/90",children:[(p.distanceKm/1495978707e-1).toFixed(3)," AU"]}),N.jsx("span",{className:"text-white/40",children:"Orbital Velocity"}),N.jsxs("span",{className:"text-right text-white/90",children:[p.apparentSpeedKmS.toFixed(2)," km/s"]})]})]}),U.missions&&U.missions.length>0&&N.jsxs("div",{className:"flex flex-col gap-3 pt-2 border-t border-white/10",children:[N.jsx("span",{className:"text-[10px] tracking-[0.25em] uppercase text-white/40 font-light",children:"Exploration Missions"}),N.jsx("div",{className:"flex flex-col gap-2.5",children:U.missions.map(L=>N.jsxs("div",{className:"p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col gap-1",children:[N.jsxs("div",{className:"flex justify-between items-center text-xs",children:[N.jsx("span",{className:"text-white font-medium tracking-[0.1em]",children:L.name}),N.jsxs("span",{className:"text-[10px] text-white/40 font-light",children:[L.year," · ",L.agency]})]}),N.jsx("p",{className:"text-[11px] text-white/60 font-light",children:L.role})]},L.name))})]}),N.jsxs("div",{className:"pt-3 border-t border-white/10 flex justify-between items-center text-[10px] font-light text-white/30 uppercase tracking-[0.2em]",children:[N.jsx("span",{children:"NASA JPL SSD Horizons DE440"}),N.jsx("span",{children:"Keplerian 2-Body Solver"})]})]})]}),z&&N.jsxs("div",{className:"fixed inset-0 z-50 pointer-events-auto flex",children:[N.jsx("div",{onClick:()=>X(!1),className:"flex-1 bg-black/60 backdrop-blur-sm transition-opacity"}),N.jsxs("aside",{className:"w-96 bg-[#07060a]/95 backdrop-blur-2xl border-l border-white/10 p-6 flex flex-col gap-5 shadow-2xl h-full font-sans",children:[N.jsxs("div",{className:"flex justify-between items-center border-b border-white/10 pb-4",children:[N.jsxs("div",{children:[N.jsx("h3",{className:"text-lg font-extralight text-white tracking-[0.25em] uppercase",children:"Astronomical Catalogue"}),N.jsx("span",{className:"text-[10px] uppercase tracking-[0.2em] font-light text-white/40",children:"42 bodies · NASA JPL DE440"})]}),N.jsx("button",{onClick:()=>X(!1),className:"text-white/40 hover:text-white transition p-1.5 rounded-full hover:bg-white/5",children:N.jsx(Uu,{size:16})})]}),N.jsxs("div",{className:"flex flex-col gap-2.5 text-xs",children:[N.jsxs("div",{className:"relative",children:[N.jsx(m0,{size:13,className:"absolute left-3 top-2.5 text-white/35"}),N.jsx("input",{type:"text",placeholder:"FILTER BY NAME, CATEGORY...",value:te,onChange:L=>I(L.target.value),className:"w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white placeholder-white/30 text-[11px] uppercase tracking-[0.15em] outline-none focus:border-white/30"})]}),N.jsx("div",{className:"grid grid-cols-4 gap-1 text-[10px] uppercase tracking-[0.18em] font-light",children:["all","planet","moon","minor"].map(L=>N.jsx("button",{onClick:()=>Y(L),className:`py-1 rounded-lg text-center uppercase tracking-wider transition-all duration-200 ${Z===L?"bg-white/15 text-white font-normal border border-white/20":"text-white/40 hover:text-white/70"}`,children:L==="all"?"All (42)":L==="planet"?"Planets":L==="moon"?"Moons":"Minor"},L))})]}),N.jsx("div",{className:"flex-1 overflow-y-auto no-scrollbar flex flex-col gap-1.5 pr-1",children:C.map(L=>{const B=Be===L.name;return N.jsxs("button",{onClick:()=>{e(L.name),Ae(),X(!1)},className:`flex items-center justify-between p-2.5 rounded-xl border transition text-left ${B?"bg-white/15 border-white/30 text-white":"bg-white/[0.02] border-white/5 text-white/70 hover:bg-white/[0.06] hover:text-white"}`,children:[N.jsxs("div",{className:"flex items-center gap-3",children:[N.jsx("span",{className:"w-2 h-2 rounded-full flex-shrink-0",style:{backgroundColor:L.physical.colorHex||"#ffffff"}}),N.jsxs("div",{className:"flex flex-col",children:[N.jsx("span",{className:"text-xs text-white font-light tracking-[0.15em] uppercase",children:L.name}),N.jsxs("span",{className:"text-[10px] text-white/35 uppercase tracking-[0.1em]",children:[L.category.replace("_"," "),L.parentName&&` · ${L.parentName}`]})]})]}),N.jsxs("div",{className:"text-right text-[10px] text-white/40 font-light tracking-wider",children:[N.jsxs("div",{children:[L.physical.meanRadiusKm.toLocaleString()," km"]}),N.jsxs("div",{children:[L.orbit.semiMajorAxisAU.toFixed(2)," AU"]})]})]},L.name)})})]})]})]}):N.jsx("div",{className:"absolute bottom-6 right-6 z-50 pointer-events-auto",children:N.jsxs("button",{onClick:()=>M(!0),className:"flex items-center gap-2 px-3.5 py-1.5 text-xs text-white/50 hover:text-white bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/10 rounded-full transition uppercase tracking-[0.2em] font-light",children:[N.jsx(sA,{size:13}),N.jsx("span",{children:"Show Interface (H)"})]})})},dA=()=>{const t=De.useRef(null),e=De.useRef(null),[n,i]=De.useState(null);De.useEffect(()=>{if(!t.current)return;const m=new JT(t.current,d=>{i(d)});return e.current=m,window.__solaris_scene=m,()=>{delete window.__solaris_scene,m.dispose(),e.current=null}},[]);const r=De.useCallback(m=>{var d;(d=e.current)==null||d.selectBody(m)},[]),s=De.useCallback(()=>{var m;(m=e.current)==null||m.resetView()},[]),a=De.useCallback(()=>{if(!e.current)return;const m=e.current.clock.isPaused;e.current.clock.isPaused=!m},[]),o=De.useCallback(m=>{e.current&&(e.current.clock.timeMultiplier=m,e.current.clock.isPaused=!1)},[]),l=De.useCallback(m=>{var d;(d=e.current)==null||d.setScaleMode(m)},[]),c=De.useCallback(m=>{var d;(d=e.current)==null||d.clock.setUtcMs(m)},[]),u=De.useCallback(()=>{var m;(m=e.current)==null||m.clock.resetToJ2000()},[]),h=De.useCallback(()=>{var m;(m=e.current)==null||m.clock.resetToNow()},[]),f=De.useCallback(()=>{var m;(m=e.current)==null||m.toggleConstellations()},[]),p=De.useCallback(()=>{var m;(m=e.current)==null||m.toggleAsteroidBelt()},[]),v=De.useCallback(()=>{var m;(m=e.current)==null||m.toggleOrbits()},[]),y=De.useCallback(m=>{var d;(d=e.current)==null||d.jumpToScale(m)},[]);return N.jsxs("div",{className:"relative w-screen h-screen overflow-hidden bg-[#030206]",style:{width:"100vw",height:"100vh",position:"relative",overflow:"hidden"},children:[N.jsx("div",{ref:t,className:"absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing",style:{position:"absolute",top:0,left:0,width:"100%",height:"100%"}}),N.jsx(uA,{telemetry:n,onSelectPlanet:r,onResetView:s,onTogglePlay:a,onSetTimeMultiplier:o,onSetScaleMode:l,onSeekDate:c,onResetToJ2000:u,onResetToNow:h,onToggleConstellations:f,onToggleAsteroidBelt:p,onToggleOrbits:v,onJumpToScale:y})]})};Ou.createRoot(document.getElementById("root")).render(N.jsx(Fx.StrictMode,{children:N.jsx(dA,{})}));
