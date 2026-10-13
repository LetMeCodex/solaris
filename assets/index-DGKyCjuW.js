var Jv=Object.defineProperty;var Qv=(t,e,n)=>e in t?Jv(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var te=(t,e,n)=>Qv(t,typeof e!="symbol"?e+"":e,n);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function n(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=n(r);fetch(r.href,s)}})();function ex(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var tg={exports:{}},ec={},ng={exports:{}},Ge={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var oa=Symbol.for("react.element"),tx=Symbol.for("react.portal"),nx=Symbol.for("react.fragment"),ix=Symbol.for("react.strict_mode"),rx=Symbol.for("react.profiler"),sx=Symbol.for("react.provider"),ox=Symbol.for("react.context"),ax=Symbol.for("react.forward_ref"),lx=Symbol.for("react.suspense"),cx=Symbol.for("react.memo"),ux=Symbol.for("react.lazy"),Rf=Symbol.iterator;function dx(t){return t===null||typeof t!="object"?null:(t=Rf&&t[Rf]||t["@@iterator"],typeof t=="function"?t:null)}var ig={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},rg=Object.assign,sg={};function Ks(t,e,n){this.props=t,this.context=e,this.refs=sg,this.updater=n||ig}Ks.prototype.isReactComponent={};Ks.prototype.setState=function(t,e){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,t,e,"setState")};Ks.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function og(){}og.prototype=Ks.prototype;function uh(t,e,n){this.props=t,this.context=e,this.refs=sg,this.updater=n||ig}var dh=uh.prototype=new og;dh.constructor=uh;rg(dh,Ks.prototype);dh.isPureReactComponent=!0;var Pf=Array.isArray,ag=Object.prototype.hasOwnProperty,hh={current:null},lg={key:!0,ref:!0,__self:!0,__source:!0};function cg(t,e,n){var i,r={},s=null,o=null;if(e!=null)for(i in e.ref!==void 0&&(o=e.ref),e.key!==void 0&&(s=""+e.key),e)ag.call(e,i)&&!lg.hasOwnProperty(i)&&(r[i]=e[i]);var a=arguments.length-2;if(a===1)r.children=n;else if(1<a){for(var l=Array(a),c=0;c<a;c++)l[c]=arguments[c+2];r.children=l}if(t&&t.defaultProps)for(i in a=t.defaultProps,a)r[i]===void 0&&(r[i]=a[i]);return{$$typeof:oa,type:t,key:s,ref:o,props:r,_owner:hh.current}}function hx(t,e){return{$$typeof:oa,type:t.type,key:e,ref:t.ref,props:t.props,_owner:t._owner}}function fh(t){return typeof t=="object"&&t!==null&&t.$$typeof===oa}function fx(t){var e={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(n){return e[n]})}var Df=/\/+/g;function Sc(t,e){return typeof t=="object"&&t!==null&&t.key!=null?fx(""+t.key):e.toString(36)}function al(t,e,n,i,r){var s=typeof t;(s==="undefined"||s==="boolean")&&(t=null);var o=!1;if(t===null)o=!0;else switch(s){case"string":case"number":o=!0;break;case"object":switch(t.$$typeof){case oa:case tx:o=!0}}if(o)return o=t,r=r(o),t=i===""?"."+Sc(o,0):i,Pf(r)?(n="",t!=null&&(n=t.replace(Df,"$&/")+"/"),al(r,e,n,"",function(c){return c})):r!=null&&(fh(r)&&(r=hx(r,n+(!r.key||o&&o.key===r.key?"":(""+r.key).replace(Df,"$&/")+"/")+t)),e.push(r)),1;if(o=0,i=i===""?".":i+":",Pf(t))for(var a=0;a<t.length;a++){s=t[a];var l=i+Sc(s,a);o+=al(s,e,n,l,r)}else if(l=dx(t),typeof l=="function")for(t=l.call(t),a=0;!(s=t.next()).done;)s=s.value,l=i+Sc(s,a++),o+=al(s,e,n,l,r);else if(s==="object")throw e=String(t),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.");return o}function va(t,e,n){if(t==null)return t;var i=[],r=0;return al(t,i,"","",function(s){return e.call(n,s,r++)}),i}function px(t){if(t._status===-1){var e=t._result;e=e(),e.then(function(n){(t._status===0||t._status===-1)&&(t._status=1,t._result=n)},function(n){(t._status===0||t._status===-1)&&(t._status=2,t._result=n)}),t._status===-1&&(t._status=0,t._result=e)}if(t._status===1)return t._result.default;throw t._result}var sn={current:null},ll={transition:null},mx={ReactCurrentDispatcher:sn,ReactCurrentBatchConfig:ll,ReactCurrentOwner:hh};function ug(){throw Error("act(...) is not supported in production builds of React.")}Ge.Children={map:va,forEach:function(t,e,n){va(t,function(){e.apply(this,arguments)},n)},count:function(t){var e=0;return va(t,function(){e++}),e},toArray:function(t){return va(t,function(e){return e})||[]},only:function(t){if(!fh(t))throw Error("React.Children.only expected to receive a single React element child.");return t}};Ge.Component=Ks;Ge.Fragment=nx;Ge.Profiler=rx;Ge.PureComponent=uh;Ge.StrictMode=ix;Ge.Suspense=lx;Ge.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=mx;Ge.act=ug;Ge.cloneElement=function(t,e,n){if(t==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+t+".");var i=rg({},t.props),r=t.key,s=t.ref,o=t._owner;if(e!=null){if(e.ref!==void 0&&(s=e.ref,o=hh.current),e.key!==void 0&&(r=""+e.key),t.type&&t.type.defaultProps)var a=t.type.defaultProps;for(l in e)ag.call(e,l)&&!lg.hasOwnProperty(l)&&(i[l]=e[l]===void 0&&a!==void 0?a[l]:e[l])}var l=arguments.length-2;if(l===1)i.children=n;else if(1<l){a=Array(l);for(var c=0;c<l;c++)a[c]=arguments[c+2];i.children=a}return{$$typeof:oa,type:t.type,key:r,ref:s,props:i,_owner:o}};Ge.createContext=function(t){return t={$$typeof:ox,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},t.Provider={$$typeof:sx,_context:t},t.Consumer=t};Ge.createElement=cg;Ge.createFactory=function(t){var e=cg.bind(null,t);return e.type=t,e};Ge.createRef=function(){return{current:null}};Ge.forwardRef=function(t){return{$$typeof:ax,render:t}};Ge.isValidElement=fh;Ge.lazy=function(t){return{$$typeof:ux,_payload:{_status:-1,_result:t},_init:px}};Ge.memo=function(t,e){return{$$typeof:cx,type:t,compare:e===void 0?null:e}};Ge.startTransition=function(t){var e=ll.transition;ll.transition={};try{t()}finally{ll.transition=e}};Ge.unstable_act=ug;Ge.useCallback=function(t,e){return sn.current.useCallback(t,e)};Ge.useContext=function(t){return sn.current.useContext(t)};Ge.useDebugValue=function(){};Ge.useDeferredValue=function(t){return sn.current.useDeferredValue(t)};Ge.useEffect=function(t,e){return sn.current.useEffect(t,e)};Ge.useId=function(){return sn.current.useId()};Ge.useImperativeHandle=function(t,e,n){return sn.current.useImperativeHandle(t,e,n)};Ge.useInsertionEffect=function(t,e){return sn.current.useInsertionEffect(t,e)};Ge.useLayoutEffect=function(t,e){return sn.current.useLayoutEffect(t,e)};Ge.useMemo=function(t,e){return sn.current.useMemo(t,e)};Ge.useReducer=function(t,e,n){return sn.current.useReducer(t,e,n)};Ge.useRef=function(t){return sn.current.useRef(t)};Ge.useState=function(t){return sn.current.useState(t)};Ge.useSyncExternalStore=function(t,e,n){return sn.current.useSyncExternalStore(t,e,n)};Ge.useTransition=function(){return sn.current.useTransition()};Ge.version="18.3.1";ng.exports=Ge;var Ne=ng.exports;const gx=ex(Ne);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var vx=Ne,xx=Symbol.for("react.element"),_x=Symbol.for("react.fragment"),yx=Object.prototype.hasOwnProperty,Sx=vx.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Mx={key:!0,ref:!0,__self:!0,__source:!0};function dg(t,e,n){var i,r={},s=null,o=null;n!==void 0&&(s=""+n),e.key!==void 0&&(s=""+e.key),e.ref!==void 0&&(o=e.ref);for(i in e)yx.call(e,i)&&!Mx.hasOwnProperty(i)&&(r[i]=e[i]);if(t&&t.defaultProps)for(i in e=t.defaultProps,e)r[i]===void 0&&(r[i]=e[i]);return{$$typeof:xx,type:t,key:s,ref:o,props:r,_owner:Sx.current}}ec.Fragment=_x;ec.jsx=dg;ec.jsxs=dg;tg.exports=ec;var k=tg.exports,bu={},hg={exports:{}},wn={},fg={exports:{}},pg={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(t){function e(L,K){var q=L.length;L.push(K);e:for(;0<q;){var ae=q-1>>>1,ye=L[ae];if(0<r(ye,K))L[ae]=K,L[q]=ye,q=ae;else break e}}function n(L){return L.length===0?null:L[0]}function i(L){if(L.length===0)return null;var K=L[0],q=L.pop();if(q!==K){L[0]=q;e:for(var ae=0,ye=L.length,Ve=ye>>>1;ae<Ve;){var j=2*(ae+1)-1,ne=L[j],ce=j+1,oe=L[ce];if(0>r(ne,q))ce<ye&&0>r(oe,ne)?(L[ae]=oe,L[ce]=q,ae=ce):(L[ae]=ne,L[j]=q,ae=j);else if(ce<ye&&0>r(oe,q))L[ae]=oe,L[ce]=q,ae=ce;else break e}}return K}function r(L,K){var q=L.sortIndex-K.sortIndex;return q!==0?q:L.id-K.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;t.unstable_now=function(){return s.now()}}else{var o=Date,a=o.now();t.unstable_now=function(){return o.now()-a}}var l=[],c=[],u=1,h=null,f=3,p=!1,_=!1,v=!1,m=typeof setTimeout=="function"?setTimeout:null,d=typeof clearTimeout=="function"?clearTimeout:null,g=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function x(L){for(var K=n(c);K!==null;){if(K.callback===null)i(c);else if(K.startTime<=L)i(c),K.sortIndex=K.expirationTime,e(l,K);else break;K=n(c)}}function y(L){if(v=!1,x(L),!_)if(n(l)!==null)_=!0,W(R);else{var K=n(c);K!==null&&ee(y,K.startTime-L)}}function R(L,K){_=!1,v&&(v=!1,d(b),b=-1),p=!0;var q=f;try{for(x(K),h=n(l);h!==null&&(!(h.expirationTime>K)||L&&!P());){var ae=h.callback;if(typeof ae=="function"){h.callback=null,f=h.priorityLevel;var ye=ae(h.expirationTime<=K);K=t.unstable_now(),typeof ye=="function"?h.callback=ye:h===n(l)&&i(l),x(K)}else i(l);h=n(l)}if(h!==null)var Ve=!0;else{var j=n(c);j!==null&&ee(y,j.startTime-K),Ve=!1}return Ve}finally{h=null,f=q,p=!1}}var C=!1,A=null,b=-1,w=5,M=-1;function P(){return!(t.unstable_now()-M<w)}function V(){if(A!==null){var L=t.unstable_now();M=L;var K=!0;try{K=A(!0,L)}finally{K?B():(C=!1,A=null)}}else C=!1}var B;if(typeof g=="function")B=function(){g(V)};else if(typeof MessageChannel<"u"){var G=new MessageChannel,J=G.port2;G.port1.onmessage=V,B=function(){J.postMessage(null)}}else B=function(){m(V,0)};function W(L){A=L,C||(C=!0,B())}function ee(L,K){b=m(function(){L(t.unstable_now())},K)}t.unstable_IdlePriority=5,t.unstable_ImmediatePriority=1,t.unstable_LowPriority=4,t.unstable_NormalPriority=3,t.unstable_Profiling=null,t.unstable_UserBlockingPriority=2,t.unstable_cancelCallback=function(L){L.callback=null},t.unstable_continueExecution=function(){_||p||(_=!0,W(R))},t.unstable_forceFrameRate=function(L){0>L||125<L?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):w=0<L?Math.floor(1e3/L):5},t.unstable_getCurrentPriorityLevel=function(){return f},t.unstable_getFirstCallbackNode=function(){return n(l)},t.unstable_next=function(L){switch(f){case 1:case 2:case 3:var K=3;break;default:K=f}var q=f;f=K;try{return L()}finally{f=q}},t.unstable_pauseExecution=function(){},t.unstable_requestPaint=function(){},t.unstable_runWithPriority=function(L,K){switch(L){case 1:case 2:case 3:case 4:case 5:break;default:L=3}var q=f;f=L;try{return K()}finally{f=q}},t.unstable_scheduleCallback=function(L,K,q){var ae=t.unstable_now();switch(typeof q=="object"&&q!==null?(q=q.delay,q=typeof q=="number"&&0<q?ae+q:ae):q=ae,L){case 1:var ye=-1;break;case 2:ye=250;break;case 5:ye=1073741823;break;case 4:ye=1e4;break;default:ye=5e3}return ye=q+ye,L={id:u++,callback:K,priorityLevel:L,startTime:q,expirationTime:ye,sortIndex:-1},q>ae?(L.sortIndex=q,e(c,L),n(l)===null&&L===n(c)&&(v?(d(b),b=-1):v=!0,ee(y,q-ae))):(L.sortIndex=ye,e(l,L),_||p||(_=!0,W(R))),L},t.unstable_shouldYield=P,t.unstable_wrapCallback=function(L){var K=f;return function(){var q=f;f=K;try{return L.apply(this,arguments)}finally{f=q}}}})(pg);fg.exports=pg;var Ex=fg.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var wx=Ne,En=Ex;function ie(t){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+t,n=1;n<arguments.length;n++)e+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var mg=new Set,ko={};function Hr(t,e){Ns(t,e),Ns(t+"Capture",e)}function Ns(t,e){for(ko[t]=e,t=0;t<e.length;t++)mg.add(e[t])}var wi=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Ru=Object.prototype.hasOwnProperty,Tx=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,Lf={},Nf={};function Ax(t){return Ru.call(Nf,t)?!0:Ru.call(Lf,t)?!1:Tx.test(t)?Nf[t]=!0:(Lf[t]=!0,!1)}function Cx(t,e,n,i){if(n!==null&&n.type===0)return!1;switch(typeof e){case"function":case"symbol":return!0;case"boolean":return i?!1:n!==null?!n.acceptsBooleans:(t=t.toLowerCase().slice(0,5),t!=="data-"&&t!=="aria-");default:return!1}}function bx(t,e,n,i){if(e===null||typeof e>"u"||Cx(t,e,n,i))return!0;if(i)return!1;if(n!==null)switch(n.type){case 3:return!e;case 4:return e===!1;case 5:return isNaN(e);case 6:return isNaN(e)||1>e}return!1}function on(t,e,n,i,r,s,o){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=i,this.attributeNamespace=r,this.mustUseProperty=n,this.propertyName=t,this.type=e,this.sanitizeURL=s,this.removeEmptyString=o}var Wt={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t){Wt[t]=new on(t,0,!1,t,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(t){var e=t[0];Wt[e]=new on(e,1,!1,t[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(t){Wt[t]=new on(t,2,!1,t.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(t){Wt[t]=new on(t,2,!1,t,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t){Wt[t]=new on(t,3,!1,t.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(t){Wt[t]=new on(t,3,!0,t,null,!1,!1)});["capture","download"].forEach(function(t){Wt[t]=new on(t,4,!1,t,null,!1,!1)});["cols","rows","size","span"].forEach(function(t){Wt[t]=new on(t,6,!1,t,null,!1,!1)});["rowSpan","start"].forEach(function(t){Wt[t]=new on(t,5,!1,t.toLowerCase(),null,!1,!1)});var ph=/[\-:]([a-z])/g;function mh(t){return t[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t){var e=t.replace(ph,mh);Wt[e]=new on(e,1,!1,t,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t){var e=t.replace(ph,mh);Wt[e]=new on(e,1,!1,t,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(t){var e=t.replace(ph,mh);Wt[e]=new on(e,1,!1,t,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(t){Wt[t]=new on(t,1,!1,t.toLowerCase(),null,!1,!1)});Wt.xlinkHref=new on("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(t){Wt[t]=new on(t,1,!1,t.toLowerCase(),null,!0,!0)});function gh(t,e,n,i){var r=Wt.hasOwnProperty(e)?Wt[e]:null;(r!==null?r.type!==0:i||!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N")&&(bx(e,n,r,i)&&(n=null),i||r===null?Ax(e)&&(n===null?t.removeAttribute(e):t.setAttribute(e,""+n)):r.mustUseProperty?t[r.propertyName]=n===null?r.type===3?!1:"":n:(e=r.attributeName,i=r.attributeNamespace,n===null?t.removeAttribute(e):(r=r.type,n=r===3||r===4&&n===!0?"":""+n,i?t.setAttributeNS(i,e,n):t.setAttribute(e,n))))}var Ri=wx.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,xa=Symbol.for("react.element"),us=Symbol.for("react.portal"),ds=Symbol.for("react.fragment"),vh=Symbol.for("react.strict_mode"),Pu=Symbol.for("react.profiler"),gg=Symbol.for("react.provider"),vg=Symbol.for("react.context"),xh=Symbol.for("react.forward_ref"),Du=Symbol.for("react.suspense"),Lu=Symbol.for("react.suspense_list"),_h=Symbol.for("react.memo"),Bi=Symbol.for("react.lazy"),xg=Symbol.for("react.offscreen"),If=Symbol.iterator;function no(t){return t===null||typeof t!="object"?null:(t=If&&t[If]||t["@@iterator"],typeof t=="function"?t:null)}var yt=Object.assign,Mc;function _o(t){if(Mc===void 0)try{throw Error()}catch(n){var e=n.stack.trim().match(/\n( *(at )?)/);Mc=e&&e[1]||""}return`
`+Mc+t}var Ec=!1;function wc(t,e){if(!t||Ec)return"";Ec=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(e)if(e=function(){throw Error()},Object.defineProperty(e.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(e,[])}catch(c){var i=c}Reflect.construct(t,[],e)}else{try{e.call()}catch(c){i=c}t.call(e.prototype)}else{try{throw Error()}catch(c){i=c}t()}}catch(c){if(c&&i&&typeof c.stack=="string"){for(var r=c.stack.split(`
`),s=i.stack.split(`
`),o=r.length-1,a=s.length-1;1<=o&&0<=a&&r[o]!==s[a];)a--;for(;1<=o&&0<=a;o--,a--)if(r[o]!==s[a]){if(o!==1||a!==1)do if(o--,a--,0>a||r[o]!==s[a]){var l=`
`+r[o].replace(" at new "," at ");return t.displayName&&l.includes("<anonymous>")&&(l=l.replace("<anonymous>",t.displayName)),l}while(1<=o&&0<=a);break}}}finally{Ec=!1,Error.prepareStackTrace=n}return(t=t?t.displayName||t.name:"")?_o(t):""}function Rx(t){switch(t.tag){case 5:return _o(t.type);case 16:return _o("Lazy");case 13:return _o("Suspense");case 19:return _o("SuspenseList");case 0:case 2:case 15:return t=wc(t.type,!1),t;case 11:return t=wc(t.type.render,!1),t;case 1:return t=wc(t.type,!0),t;default:return""}}function Nu(t){if(t==null)return null;if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case ds:return"Fragment";case us:return"Portal";case Pu:return"Profiler";case vh:return"StrictMode";case Du:return"Suspense";case Lu:return"SuspenseList"}if(typeof t=="object")switch(t.$$typeof){case vg:return(t.displayName||"Context")+".Consumer";case gg:return(t._context.displayName||"Context")+".Provider";case xh:var e=t.render;return t=t.displayName,t||(t=e.displayName||e.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case _h:return e=t.displayName||null,e!==null?e:Nu(t.type)||"Memo";case Bi:e=t._payload,t=t._init;try{return Nu(t(e))}catch{}}return null}function Px(t){var e=t.type;switch(t.tag){case 24:return"Cache";case 9:return(e.displayName||"Context")+".Consumer";case 10:return(e._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return t=e.render,t=t.displayName||t.name||"",e.displayName||(t!==""?"ForwardRef("+t+")":"ForwardRef");case 7:return"Fragment";case 5:return e;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Nu(e);case 8:return e===vh?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e}return null}function rr(t){switch(typeof t){case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function _g(t){var e=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function Dx(t){var e=_g(t)?"checked":"value",n=Object.getOwnPropertyDescriptor(t.constructor.prototype,e),i=""+t[e];if(!t.hasOwnProperty(e)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var r=n.get,s=n.set;return Object.defineProperty(t,e,{configurable:!0,get:function(){return r.call(this)},set:function(o){i=""+o,s.call(this,o)}}),Object.defineProperty(t,e,{enumerable:n.enumerable}),{getValue:function(){return i},setValue:function(o){i=""+o},stopTracking:function(){t._valueTracker=null,delete t[e]}}}}function _a(t){t._valueTracker||(t._valueTracker=Dx(t))}function yg(t){if(!t)return!1;var e=t._valueTracker;if(!e)return!0;var n=e.getValue(),i="";return t&&(i=_g(t)?t.checked?"true":"false":t.value),t=i,t!==n?(e.setValue(t),!0):!1}function Tl(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}function Iu(t,e){var n=e.checked;return yt({},e,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??t._wrapperState.initialChecked})}function Uf(t,e){var n=e.defaultValue==null?"":e.defaultValue,i=e.checked!=null?e.checked:e.defaultChecked;n=rr(e.value!=null?e.value:n),t._wrapperState={initialChecked:i,initialValue:n,controlled:e.type==="checkbox"||e.type==="radio"?e.checked!=null:e.value!=null}}function Sg(t,e){e=e.checked,e!=null&&gh(t,"checked",e,!1)}function Uu(t,e){Sg(t,e);var n=rr(e.value),i=e.type;if(n!=null)i==="number"?(n===0&&t.value===""||t.value!=n)&&(t.value=""+n):t.value!==""+n&&(t.value=""+n);else if(i==="submit"||i==="reset"){t.removeAttribute("value");return}e.hasOwnProperty("value")?Fu(t,e.type,n):e.hasOwnProperty("defaultValue")&&Fu(t,e.type,rr(e.defaultValue)),e.checked==null&&e.defaultChecked!=null&&(t.defaultChecked=!!e.defaultChecked)}function Ff(t,e,n){if(e.hasOwnProperty("value")||e.hasOwnProperty("defaultValue")){var i=e.type;if(!(i!=="submit"&&i!=="reset"||e.value!==void 0&&e.value!==null))return;e=""+t._wrapperState.initialValue,n||e===t.value||(t.value=e),t.defaultValue=e}n=t.name,n!==""&&(t.name=""),t.defaultChecked=!!t._wrapperState.initialChecked,n!==""&&(t.name=n)}function Fu(t,e,n){(e!=="number"||Tl(t.ownerDocument)!==t)&&(n==null?t.defaultValue=""+t._wrapperState.initialValue:t.defaultValue!==""+n&&(t.defaultValue=""+n))}var yo=Array.isArray;function ws(t,e,n,i){if(t=t.options,e){e={};for(var r=0;r<n.length;r++)e["$"+n[r]]=!0;for(n=0;n<t.length;n++)r=e.hasOwnProperty("$"+t[n].value),t[n].selected!==r&&(t[n].selected=r),r&&i&&(t[n].defaultSelected=!0)}else{for(n=""+rr(n),e=null,r=0;r<t.length;r++){if(t[r].value===n){t[r].selected=!0,i&&(t[r].defaultSelected=!0);return}e!==null||t[r].disabled||(e=t[r])}e!==null&&(e.selected=!0)}}function Ou(t,e){if(e.dangerouslySetInnerHTML!=null)throw Error(ie(91));return yt({},e,{value:void 0,defaultValue:void 0,children:""+t._wrapperState.initialValue})}function Of(t,e){var n=e.value;if(n==null){if(n=e.children,e=e.defaultValue,n!=null){if(e!=null)throw Error(ie(92));if(yo(n)){if(1<n.length)throw Error(ie(93));n=n[0]}e=n}e==null&&(e=""),n=e}t._wrapperState={initialValue:rr(n)}}function Mg(t,e){var n=rr(e.value),i=rr(e.defaultValue);n!=null&&(n=""+n,n!==t.value&&(t.value=n),e.defaultValue==null&&t.defaultValue!==n&&(t.defaultValue=n)),i!=null&&(t.defaultValue=""+i)}function kf(t){var e=t.textContent;e===t._wrapperState.initialValue&&e!==""&&e!==null&&(t.value=e)}function Eg(t){switch(t){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function ku(t,e){return t==null||t==="http://www.w3.org/1999/xhtml"?Eg(e):t==="http://www.w3.org/2000/svg"&&e==="foreignObject"?"http://www.w3.org/1999/xhtml":t}var ya,wg=function(t){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(e,n,i,r){MSApp.execUnsafeLocalFunction(function(){return t(e,n,i,r)})}:t}(function(t,e){if(t.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in t)t.innerHTML=e;else{for(ya=ya||document.createElement("div"),ya.innerHTML="<svg>"+e.valueOf().toString()+"</svg>",e=ya.firstChild;t.firstChild;)t.removeChild(t.firstChild);for(;e.firstChild;)t.appendChild(e.firstChild)}});function Bo(t,e){if(e){var n=t.firstChild;if(n&&n===t.lastChild&&n.nodeType===3){n.nodeValue=e;return}}t.textContent=e}var Ao={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Lx=["Webkit","ms","Moz","O"];Object.keys(Ao).forEach(function(t){Lx.forEach(function(e){e=e+t.charAt(0).toUpperCase()+t.substring(1),Ao[e]=Ao[t]})});function Tg(t,e,n){return e==null||typeof e=="boolean"||e===""?"":n||typeof e!="number"||e===0||Ao.hasOwnProperty(t)&&Ao[t]?(""+e).trim():e+"px"}function Ag(t,e){t=t.style;for(var n in e)if(e.hasOwnProperty(n)){var i=n.indexOf("--")===0,r=Tg(n,e[n],i);n==="float"&&(n="cssFloat"),i?t.setProperty(n,r):t[n]=r}}var Nx=yt({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Bu(t,e){if(e){if(Nx[t]&&(e.children!=null||e.dangerouslySetInnerHTML!=null))throw Error(ie(137,t));if(e.dangerouslySetInnerHTML!=null){if(e.children!=null)throw Error(ie(60));if(typeof e.dangerouslySetInnerHTML!="object"||!("__html"in e.dangerouslySetInnerHTML))throw Error(ie(61))}if(e.style!=null&&typeof e.style!="object")throw Error(ie(62))}}function zu(t,e){if(t.indexOf("-")===-1)return typeof e.is=="string";switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Hu=null;function yh(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var Vu=null,Ts=null,As=null;function Bf(t){if(t=ca(t)){if(typeof Vu!="function")throw Error(ie(280));var e=t.stateNode;e&&(e=sc(e),Vu(t.stateNode,t.type,e))}}function Cg(t){Ts?As?As.push(t):As=[t]:Ts=t}function bg(){if(Ts){var t=Ts,e=As;if(As=Ts=null,Bf(t),e)for(t=0;t<e.length;t++)Bf(e[t])}}function Rg(t,e){return t(e)}function Pg(){}var Tc=!1;function Dg(t,e,n){if(Tc)return t(e,n);Tc=!0;try{return Rg(t,e,n)}finally{Tc=!1,(Ts!==null||As!==null)&&(Pg(),bg())}}function zo(t,e){var n=t.stateNode;if(n===null)return null;var i=sc(n);if(i===null)return null;n=i[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(i=!i.disabled)||(t=t.type,i=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!i;break e;default:t=!1}if(t)return null;if(n&&typeof n!="function")throw Error(ie(231,e,typeof n));return n}var Gu=!1;if(wi)try{var io={};Object.defineProperty(io,"passive",{get:function(){Gu=!0}}),window.addEventListener("test",io,io),window.removeEventListener("test",io,io)}catch{Gu=!1}function Ix(t,e,n,i,r,s,o,a,l){var c=Array.prototype.slice.call(arguments,3);try{e.apply(n,c)}catch(u){this.onError(u)}}var Co=!1,Al=null,Cl=!1,Wu=null,Ux={onError:function(t){Co=!0,Al=t}};function Fx(t,e,n,i,r,s,o,a,l){Co=!1,Al=null,Ix.apply(Ux,arguments)}function Ox(t,e,n,i,r,s,o,a,l){if(Fx.apply(this,arguments),Co){if(Co){var c=Al;Co=!1,Al=null}else throw Error(ie(198));Cl||(Cl=!0,Wu=c)}}function Vr(t){var e=t,n=t;if(t.alternate)for(;e.return;)e=e.return;else{t=e;do e=t,e.flags&4098&&(n=e.return),t=e.return;while(t)}return e.tag===3?n:null}function Lg(t){if(t.tag===13){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function zf(t){if(Vr(t)!==t)throw Error(ie(188))}function kx(t){var e=t.alternate;if(!e){if(e=Vr(t),e===null)throw Error(ie(188));return e!==t?null:t}for(var n=t,i=e;;){var r=n.return;if(r===null)break;var s=r.alternate;if(s===null){if(i=r.return,i!==null){n=i;continue}break}if(r.child===s.child){for(s=r.child;s;){if(s===n)return zf(r),t;if(s===i)return zf(r),e;s=s.sibling}throw Error(ie(188))}if(n.return!==i.return)n=r,i=s;else{for(var o=!1,a=r.child;a;){if(a===n){o=!0,n=r,i=s;break}if(a===i){o=!0,i=r,n=s;break}a=a.sibling}if(!o){for(a=s.child;a;){if(a===n){o=!0,n=s,i=r;break}if(a===i){o=!0,i=s,n=r;break}a=a.sibling}if(!o)throw Error(ie(189))}}if(n.alternate!==i)throw Error(ie(190))}if(n.tag!==3)throw Error(ie(188));return n.stateNode.current===n?t:e}function Ng(t){return t=kx(t),t!==null?Ig(t):null}function Ig(t){if(t.tag===5||t.tag===6)return t;for(t=t.child;t!==null;){var e=Ig(t);if(e!==null)return e;t=t.sibling}return null}var Ug=En.unstable_scheduleCallback,Hf=En.unstable_cancelCallback,Bx=En.unstable_shouldYield,zx=En.unstable_requestPaint,wt=En.unstable_now,Hx=En.unstable_getCurrentPriorityLevel,Sh=En.unstable_ImmediatePriority,Fg=En.unstable_UserBlockingPriority,bl=En.unstable_NormalPriority,Vx=En.unstable_LowPriority,Og=En.unstable_IdlePriority,tc=null,si=null;function Gx(t){if(si&&typeof si.onCommitFiberRoot=="function")try{si.onCommitFiberRoot(tc,t,void 0,(t.current.flags&128)===128)}catch{}}var Kn=Math.clz32?Math.clz32:Xx,Wx=Math.log,jx=Math.LN2;function Xx(t){return t>>>=0,t===0?32:31-(Wx(t)/jx|0)|0}var Sa=64,Ma=4194304;function So(t){switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return t&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return t}}function Rl(t,e){var n=t.pendingLanes;if(n===0)return 0;var i=0,r=t.suspendedLanes,s=t.pingedLanes,o=n&268435455;if(o!==0){var a=o&~r;a!==0?i=So(a):(s&=o,s!==0&&(i=So(s)))}else o=n&~r,o!==0?i=So(o):s!==0&&(i=So(s));if(i===0)return 0;if(e!==0&&e!==i&&!(e&r)&&(r=i&-i,s=e&-e,r>=s||r===16&&(s&4194240)!==0))return e;if(i&4&&(i|=n&16),e=t.entangledLanes,e!==0)for(t=t.entanglements,e&=i;0<e;)n=31-Kn(e),r=1<<n,i|=t[n],e&=~r;return i}function Kx(t,e){switch(t){case 1:case 2:case 4:return e+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Yx(t,e){for(var n=t.suspendedLanes,i=t.pingedLanes,r=t.expirationTimes,s=t.pendingLanes;0<s;){var o=31-Kn(s),a=1<<o,l=r[o];l===-1?(!(a&n)||a&i)&&(r[o]=Kx(a,e)):l<=e&&(t.expiredLanes|=a),s&=~a}}function ju(t){return t=t.pendingLanes&-1073741825,t!==0?t:t&1073741824?1073741824:0}function kg(){var t=Sa;return Sa<<=1,!(Sa&4194240)&&(Sa=64),t}function Ac(t){for(var e=[],n=0;31>n;n++)e.push(t);return e}function aa(t,e,n){t.pendingLanes|=e,e!==536870912&&(t.suspendedLanes=0,t.pingedLanes=0),t=t.eventTimes,e=31-Kn(e),t[e]=n}function qx(t,e){var n=t.pendingLanes&~e;t.pendingLanes=e,t.suspendedLanes=0,t.pingedLanes=0,t.expiredLanes&=e,t.mutableReadLanes&=e,t.entangledLanes&=e,e=t.entanglements;var i=t.eventTimes;for(t=t.expirationTimes;0<n;){var r=31-Kn(n),s=1<<r;e[r]=0,i[r]=-1,t[r]=-1,n&=~s}}function Mh(t,e){var n=t.entangledLanes|=e;for(t=t.entanglements;n;){var i=31-Kn(n),r=1<<i;r&e|t[i]&e&&(t[i]|=e),n&=~r}}var tt=0;function Bg(t){return t&=-t,1<t?4<t?t&268435455?16:536870912:4:1}var zg,Eh,Hg,Vg,Gg,Xu=!1,Ea=[],Yi=null,qi=null,$i=null,Ho=new Map,Vo=new Map,Gi=[],$x="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Vf(t,e){switch(t){case"focusin":case"focusout":Yi=null;break;case"dragenter":case"dragleave":qi=null;break;case"mouseover":case"mouseout":$i=null;break;case"pointerover":case"pointerout":Ho.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":Vo.delete(e.pointerId)}}function ro(t,e,n,i,r,s){return t===null||t.nativeEvent!==s?(t={blockedOn:e,domEventName:n,eventSystemFlags:i,nativeEvent:s,targetContainers:[r]},e!==null&&(e=ca(e),e!==null&&Eh(e)),t):(t.eventSystemFlags|=i,e=t.targetContainers,r!==null&&e.indexOf(r)===-1&&e.push(r),t)}function Zx(t,e,n,i,r){switch(e){case"focusin":return Yi=ro(Yi,t,e,n,i,r),!0;case"dragenter":return qi=ro(qi,t,e,n,i,r),!0;case"mouseover":return $i=ro($i,t,e,n,i,r),!0;case"pointerover":var s=r.pointerId;return Ho.set(s,ro(Ho.get(s)||null,t,e,n,i,r)),!0;case"gotpointercapture":return s=r.pointerId,Vo.set(s,ro(Vo.get(s)||null,t,e,n,i,r)),!0}return!1}function Wg(t){var e=Cr(t.target);if(e!==null){var n=Vr(e);if(n!==null){if(e=n.tag,e===13){if(e=Lg(n),e!==null){t.blockedOn=e,Gg(t.priority,function(){Hg(n)});return}}else if(e===3&&n.stateNode.current.memoizedState.isDehydrated){t.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}t.blockedOn=null}function cl(t){if(t.blockedOn!==null)return!1;for(var e=t.targetContainers;0<e.length;){var n=Ku(t.domEventName,t.eventSystemFlags,e[0],t.nativeEvent);if(n===null){n=t.nativeEvent;var i=new n.constructor(n.type,n);Hu=i,n.target.dispatchEvent(i),Hu=null}else return e=ca(n),e!==null&&Eh(e),t.blockedOn=n,!1;e.shift()}return!0}function Gf(t,e,n){cl(t)&&n.delete(e)}function Jx(){Xu=!1,Yi!==null&&cl(Yi)&&(Yi=null),qi!==null&&cl(qi)&&(qi=null),$i!==null&&cl($i)&&($i=null),Ho.forEach(Gf),Vo.forEach(Gf)}function so(t,e){t.blockedOn===e&&(t.blockedOn=null,Xu||(Xu=!0,En.unstable_scheduleCallback(En.unstable_NormalPriority,Jx)))}function Go(t){function e(r){return so(r,t)}if(0<Ea.length){so(Ea[0],t);for(var n=1;n<Ea.length;n++){var i=Ea[n];i.blockedOn===t&&(i.blockedOn=null)}}for(Yi!==null&&so(Yi,t),qi!==null&&so(qi,t),$i!==null&&so($i,t),Ho.forEach(e),Vo.forEach(e),n=0;n<Gi.length;n++)i=Gi[n],i.blockedOn===t&&(i.blockedOn=null);for(;0<Gi.length&&(n=Gi[0],n.blockedOn===null);)Wg(n),n.blockedOn===null&&Gi.shift()}var Cs=Ri.ReactCurrentBatchConfig,Pl=!0;function Qx(t,e,n,i){var r=tt,s=Cs.transition;Cs.transition=null;try{tt=1,wh(t,e,n,i)}finally{tt=r,Cs.transition=s}}function e_(t,e,n,i){var r=tt,s=Cs.transition;Cs.transition=null;try{tt=4,wh(t,e,n,i)}finally{tt=r,Cs.transition=s}}function wh(t,e,n,i){if(Pl){var r=Ku(t,e,n,i);if(r===null)Fc(t,e,i,Dl,n),Vf(t,i);else if(Zx(r,t,e,n,i))i.stopPropagation();else if(Vf(t,i),e&4&&-1<$x.indexOf(t)){for(;r!==null;){var s=ca(r);if(s!==null&&zg(s),s=Ku(t,e,n,i),s===null&&Fc(t,e,i,Dl,n),s===r)break;r=s}r!==null&&i.stopPropagation()}else Fc(t,e,i,null,n)}}var Dl=null;function Ku(t,e,n,i){if(Dl=null,t=yh(i),t=Cr(t),t!==null)if(e=Vr(t),e===null)t=null;else if(n=e.tag,n===13){if(t=Lg(e),t!==null)return t;t=null}else if(n===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;t=null}else e!==t&&(t=null);return Dl=t,null}function jg(t){switch(t){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(Hx()){case Sh:return 1;case Fg:return 4;case bl:case Vx:return 16;case Og:return 536870912;default:return 16}default:return 16}}var Xi=null,Th=null,ul=null;function Xg(){if(ul)return ul;var t,e=Th,n=e.length,i,r="value"in Xi?Xi.value:Xi.textContent,s=r.length;for(t=0;t<n&&e[t]===r[t];t++);var o=n-t;for(i=1;i<=o&&e[n-i]===r[s-i];i++);return ul=r.slice(t,1<i?1-i:void 0)}function dl(t){var e=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&e===13&&(t=13)):t=e,t===10&&(t=13),32<=t||t===13?t:0}function wa(){return!0}function Wf(){return!1}function Tn(t){function e(n,i,r,s,o){this._reactName=n,this._targetInst=r,this.type=i,this.nativeEvent=s,this.target=o,this.currentTarget=null;for(var a in t)t.hasOwnProperty(a)&&(n=t[a],this[a]=n?n(s):s[a]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?wa:Wf,this.isPropagationStopped=Wf,this}return yt(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=wa)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=wa)},persist:function(){},isPersistent:wa}),e}var Ys={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Ah=Tn(Ys),la=yt({},Ys,{view:0,detail:0}),t_=Tn(la),Cc,bc,oo,nc=yt({},la,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Ch,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==oo&&(oo&&t.type==="mousemove"?(Cc=t.screenX-oo.screenX,bc=t.screenY-oo.screenY):bc=Cc=0,oo=t),Cc)},movementY:function(t){return"movementY"in t?t.movementY:bc}}),jf=Tn(nc),n_=yt({},nc,{dataTransfer:0}),i_=Tn(n_),r_=yt({},la,{relatedTarget:0}),Rc=Tn(r_),s_=yt({},Ys,{animationName:0,elapsedTime:0,pseudoElement:0}),o_=Tn(s_),a_=yt({},Ys,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),l_=Tn(a_),c_=yt({},Ys,{data:0}),Xf=Tn(c_),u_={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},d_={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},h_={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function f_(t){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(t):(t=h_[t])?!!e[t]:!1}function Ch(){return f_}var p_=yt({},la,{key:function(t){if(t.key){var e=u_[t.key]||t.key;if(e!=="Unidentified")return e}return t.type==="keypress"?(t=dl(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?d_[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Ch,charCode:function(t){return t.type==="keypress"?dl(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?dl(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),m_=Tn(p_),g_=yt({},nc,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Kf=Tn(g_),v_=yt({},la,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Ch}),x_=Tn(v_),__=yt({},Ys,{propertyName:0,elapsedTime:0,pseudoElement:0}),y_=Tn(__),S_=yt({},nc,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),M_=Tn(S_),E_=[9,13,27,32],bh=wi&&"CompositionEvent"in window,bo=null;wi&&"documentMode"in document&&(bo=document.documentMode);var w_=wi&&"TextEvent"in window&&!bo,Kg=wi&&(!bh||bo&&8<bo&&11>=bo),Yf=" ",qf=!1;function Yg(t,e){switch(t){case"keyup":return E_.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function qg(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var hs=!1;function T_(t,e){switch(t){case"compositionend":return qg(e);case"keypress":return e.which!==32?null:(qf=!0,Yf);case"textInput":return t=e.data,t===Yf&&qf?null:t;default:return null}}function A_(t,e){if(hs)return t==="compositionend"||!bh&&Yg(t,e)?(t=Xg(),ul=Th=Xi=null,hs=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return Kg&&e.locale!=="ko"?null:e.data;default:return null}}var C_={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function $f(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e==="input"?!!C_[t.type]:e==="textarea"}function $g(t,e,n,i){Cg(i),e=Ll(e,"onChange"),0<e.length&&(n=new Ah("onChange","change",null,n,i),t.push({event:n,listeners:e}))}var Ro=null,Wo=null;function b_(t){a0(t,0)}function ic(t){var e=ms(t);if(yg(e))return t}function R_(t,e){if(t==="change")return e}var Zg=!1;if(wi){var Pc;if(wi){var Dc="oninput"in document;if(!Dc){var Zf=document.createElement("div");Zf.setAttribute("oninput","return;"),Dc=typeof Zf.oninput=="function"}Pc=Dc}else Pc=!1;Zg=Pc&&(!document.documentMode||9<document.documentMode)}function Jf(){Ro&&(Ro.detachEvent("onpropertychange",Jg),Wo=Ro=null)}function Jg(t){if(t.propertyName==="value"&&ic(Wo)){var e=[];$g(e,Wo,t,yh(t)),Dg(b_,e)}}function P_(t,e,n){t==="focusin"?(Jf(),Ro=e,Wo=n,Ro.attachEvent("onpropertychange",Jg)):t==="focusout"&&Jf()}function D_(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return ic(Wo)}function L_(t,e){if(t==="click")return ic(e)}function N_(t,e){if(t==="input"||t==="change")return ic(e)}function I_(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var qn=typeof Object.is=="function"?Object.is:I_;function jo(t,e){if(qn(t,e))return!0;if(typeof t!="object"||t===null||typeof e!="object"||e===null)return!1;var n=Object.keys(t),i=Object.keys(e);if(n.length!==i.length)return!1;for(i=0;i<n.length;i++){var r=n[i];if(!Ru.call(e,r)||!qn(t[r],e[r]))return!1}return!0}function Qf(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function ep(t,e){var n=Qf(t);t=0;for(var i;n;){if(n.nodeType===3){if(i=t+n.textContent.length,t<=e&&i>=e)return{node:n,offset:e-t};t=i}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=Qf(n)}}function Qg(t,e){return t&&e?t===e?!0:t&&t.nodeType===3?!1:e&&e.nodeType===3?Qg(t,e.parentNode):"contains"in t?t.contains(e):t.compareDocumentPosition?!!(t.compareDocumentPosition(e)&16):!1:!1}function e0(){for(var t=window,e=Tl();e instanceof t.HTMLIFrameElement;){try{var n=typeof e.contentWindow.location.href=="string"}catch{n=!1}if(n)t=e.contentWindow;else break;e=Tl(t.document)}return e}function Rh(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e&&(e==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||e==="textarea"||t.contentEditable==="true")}function U_(t){var e=e0(),n=t.focusedElem,i=t.selectionRange;if(e!==n&&n&&n.ownerDocument&&Qg(n.ownerDocument.documentElement,n)){if(i!==null&&Rh(n)){if(e=i.start,t=i.end,t===void 0&&(t=e),"selectionStart"in n)n.selectionStart=e,n.selectionEnd=Math.min(t,n.value.length);else if(t=(e=n.ownerDocument||document)&&e.defaultView||window,t.getSelection){t=t.getSelection();var r=n.textContent.length,s=Math.min(i.start,r);i=i.end===void 0?s:Math.min(i.end,r),!t.extend&&s>i&&(r=i,i=s,s=r),r=ep(n,s);var o=ep(n,i);r&&o&&(t.rangeCount!==1||t.anchorNode!==r.node||t.anchorOffset!==r.offset||t.focusNode!==o.node||t.focusOffset!==o.offset)&&(e=e.createRange(),e.setStart(r.node,r.offset),t.removeAllRanges(),s>i?(t.addRange(e),t.extend(o.node,o.offset)):(e.setEnd(o.node,o.offset),t.addRange(e)))}}for(e=[],t=n;t=t.parentNode;)t.nodeType===1&&e.push({element:t,left:t.scrollLeft,top:t.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<e.length;n++)t=e[n],t.element.scrollLeft=t.left,t.element.scrollTop=t.top}}var F_=wi&&"documentMode"in document&&11>=document.documentMode,fs=null,Yu=null,Po=null,qu=!1;function tp(t,e,n){var i=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;qu||fs==null||fs!==Tl(i)||(i=fs,"selectionStart"in i&&Rh(i)?i={start:i.selectionStart,end:i.selectionEnd}:(i=(i.ownerDocument&&i.ownerDocument.defaultView||window).getSelection(),i={anchorNode:i.anchorNode,anchorOffset:i.anchorOffset,focusNode:i.focusNode,focusOffset:i.focusOffset}),Po&&jo(Po,i)||(Po=i,i=Ll(Yu,"onSelect"),0<i.length&&(e=new Ah("onSelect","select",null,e,n),t.push({event:e,listeners:i}),e.target=fs)))}function Ta(t,e){var n={};return n[t.toLowerCase()]=e.toLowerCase(),n["Webkit"+t]="webkit"+e,n["Moz"+t]="moz"+e,n}var ps={animationend:Ta("Animation","AnimationEnd"),animationiteration:Ta("Animation","AnimationIteration"),animationstart:Ta("Animation","AnimationStart"),transitionend:Ta("Transition","TransitionEnd")},Lc={},t0={};wi&&(t0=document.createElement("div").style,"AnimationEvent"in window||(delete ps.animationend.animation,delete ps.animationiteration.animation,delete ps.animationstart.animation),"TransitionEvent"in window||delete ps.transitionend.transition);function rc(t){if(Lc[t])return Lc[t];if(!ps[t])return t;var e=ps[t],n;for(n in e)if(e.hasOwnProperty(n)&&n in t0)return Lc[t]=e[n];return t}var n0=rc("animationend"),i0=rc("animationiteration"),r0=rc("animationstart"),s0=rc("transitionend"),o0=new Map,np="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function ar(t,e){o0.set(t,e),Hr(e,[t])}for(var Nc=0;Nc<np.length;Nc++){var Ic=np[Nc],O_=Ic.toLowerCase(),k_=Ic[0].toUpperCase()+Ic.slice(1);ar(O_,"on"+k_)}ar(n0,"onAnimationEnd");ar(i0,"onAnimationIteration");ar(r0,"onAnimationStart");ar("dblclick","onDoubleClick");ar("focusin","onFocus");ar("focusout","onBlur");ar(s0,"onTransitionEnd");Ns("onMouseEnter",["mouseout","mouseover"]);Ns("onMouseLeave",["mouseout","mouseover"]);Ns("onPointerEnter",["pointerout","pointerover"]);Ns("onPointerLeave",["pointerout","pointerover"]);Hr("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Hr("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Hr("onBeforeInput",["compositionend","keypress","textInput","paste"]);Hr("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Hr("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Hr("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Mo="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),B_=new Set("cancel close invalid load scroll toggle".split(" ").concat(Mo));function ip(t,e,n){var i=t.type||"unknown-event";t.currentTarget=n,Ox(i,e,void 0,t),t.currentTarget=null}function a0(t,e){e=(e&4)!==0;for(var n=0;n<t.length;n++){var i=t[n],r=i.event;i=i.listeners;e:{var s=void 0;if(e)for(var o=i.length-1;0<=o;o--){var a=i[o],l=a.instance,c=a.currentTarget;if(a=a.listener,l!==s&&r.isPropagationStopped())break e;ip(r,a,c),s=l}else for(o=0;o<i.length;o++){if(a=i[o],l=a.instance,c=a.currentTarget,a=a.listener,l!==s&&r.isPropagationStopped())break e;ip(r,a,c),s=l}}}if(Cl)throw t=Wu,Cl=!1,Wu=null,t}function ht(t,e){var n=e[ed];n===void 0&&(n=e[ed]=new Set);var i=t+"__bubble";n.has(i)||(l0(e,t,2,!1),n.add(i))}function Uc(t,e,n){var i=0;e&&(i|=4),l0(n,t,i,e)}var Aa="_reactListening"+Math.random().toString(36).slice(2);function Xo(t){if(!t[Aa]){t[Aa]=!0,mg.forEach(function(n){n!=="selectionchange"&&(B_.has(n)||Uc(n,!1,t),Uc(n,!0,t))});var e=t.nodeType===9?t:t.ownerDocument;e===null||e[Aa]||(e[Aa]=!0,Uc("selectionchange",!1,e))}}function l0(t,e,n,i){switch(jg(e)){case 1:var r=Qx;break;case 4:r=e_;break;default:r=wh}n=r.bind(null,e,n,t),r=void 0,!Gu||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(r=!0),i?r!==void 0?t.addEventListener(e,n,{capture:!0,passive:r}):t.addEventListener(e,n,!0):r!==void 0?t.addEventListener(e,n,{passive:r}):t.addEventListener(e,n,!1)}function Fc(t,e,n,i,r){var s=i;if(!(e&1)&&!(e&2)&&i!==null)e:for(;;){if(i===null)return;var o=i.tag;if(o===3||o===4){var a=i.stateNode.containerInfo;if(a===r||a.nodeType===8&&a.parentNode===r)break;if(o===4)for(o=i.return;o!==null;){var l=o.tag;if((l===3||l===4)&&(l=o.stateNode.containerInfo,l===r||l.nodeType===8&&l.parentNode===r))return;o=o.return}for(;a!==null;){if(o=Cr(a),o===null)return;if(l=o.tag,l===5||l===6){i=s=o;continue e}a=a.parentNode}}i=i.return}Dg(function(){var c=s,u=yh(n),h=[];e:{var f=o0.get(t);if(f!==void 0){var p=Ah,_=t;switch(t){case"keypress":if(dl(n)===0)break e;case"keydown":case"keyup":p=m_;break;case"focusin":_="focus",p=Rc;break;case"focusout":_="blur",p=Rc;break;case"beforeblur":case"afterblur":p=Rc;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":p=jf;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":p=i_;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":p=x_;break;case n0:case i0:case r0:p=o_;break;case s0:p=y_;break;case"scroll":p=t_;break;case"wheel":p=M_;break;case"copy":case"cut":case"paste":p=l_;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":p=Kf}var v=(e&4)!==0,m=!v&&t==="scroll",d=v?f!==null?f+"Capture":null:f;v=[];for(var g=c,x;g!==null;){x=g;var y=x.stateNode;if(x.tag===5&&y!==null&&(x=y,d!==null&&(y=zo(g,d),y!=null&&v.push(Ko(g,y,x)))),m)break;g=g.return}0<v.length&&(f=new p(f,_,null,n,u),h.push({event:f,listeners:v}))}}if(!(e&7)){e:{if(f=t==="mouseover"||t==="pointerover",p=t==="mouseout"||t==="pointerout",f&&n!==Hu&&(_=n.relatedTarget||n.fromElement)&&(Cr(_)||_[Ti]))break e;if((p||f)&&(f=u.window===u?u:(f=u.ownerDocument)?f.defaultView||f.parentWindow:window,p?(_=n.relatedTarget||n.toElement,p=c,_=_?Cr(_):null,_!==null&&(m=Vr(_),_!==m||_.tag!==5&&_.tag!==6)&&(_=null)):(p=null,_=c),p!==_)){if(v=jf,y="onMouseLeave",d="onMouseEnter",g="mouse",(t==="pointerout"||t==="pointerover")&&(v=Kf,y="onPointerLeave",d="onPointerEnter",g="pointer"),m=p==null?f:ms(p),x=_==null?f:ms(_),f=new v(y,g+"leave",p,n,u),f.target=m,f.relatedTarget=x,y=null,Cr(u)===c&&(v=new v(d,g+"enter",_,n,u),v.target=x,v.relatedTarget=m,y=v),m=y,p&&_)t:{for(v=p,d=_,g=0,x=v;x;x=Kr(x))g++;for(x=0,y=d;y;y=Kr(y))x++;for(;0<g-x;)v=Kr(v),g--;for(;0<x-g;)d=Kr(d),x--;for(;g--;){if(v===d||d!==null&&v===d.alternate)break t;v=Kr(v),d=Kr(d)}v=null}else v=null;p!==null&&rp(h,f,p,v,!1),_!==null&&m!==null&&rp(h,m,_,v,!0)}}e:{if(f=c?ms(c):window,p=f.nodeName&&f.nodeName.toLowerCase(),p==="select"||p==="input"&&f.type==="file")var R=R_;else if($f(f))if(Zg)R=N_;else{R=D_;var C=P_}else(p=f.nodeName)&&p.toLowerCase()==="input"&&(f.type==="checkbox"||f.type==="radio")&&(R=L_);if(R&&(R=R(t,c))){$g(h,R,n,u);break e}C&&C(t,f,c),t==="focusout"&&(C=f._wrapperState)&&C.controlled&&f.type==="number"&&Fu(f,"number",f.value)}switch(C=c?ms(c):window,t){case"focusin":($f(C)||C.contentEditable==="true")&&(fs=C,Yu=c,Po=null);break;case"focusout":Po=Yu=fs=null;break;case"mousedown":qu=!0;break;case"contextmenu":case"mouseup":case"dragend":qu=!1,tp(h,n,u);break;case"selectionchange":if(F_)break;case"keydown":case"keyup":tp(h,n,u)}var A;if(bh)e:{switch(t){case"compositionstart":var b="onCompositionStart";break e;case"compositionend":b="onCompositionEnd";break e;case"compositionupdate":b="onCompositionUpdate";break e}b=void 0}else hs?Yg(t,n)&&(b="onCompositionEnd"):t==="keydown"&&n.keyCode===229&&(b="onCompositionStart");b&&(Kg&&n.locale!=="ko"&&(hs||b!=="onCompositionStart"?b==="onCompositionEnd"&&hs&&(A=Xg()):(Xi=u,Th="value"in Xi?Xi.value:Xi.textContent,hs=!0)),C=Ll(c,b),0<C.length&&(b=new Xf(b,t,null,n,u),h.push({event:b,listeners:C}),A?b.data=A:(A=qg(n),A!==null&&(b.data=A)))),(A=w_?T_(t,n):A_(t,n))&&(c=Ll(c,"onBeforeInput"),0<c.length&&(u=new Xf("onBeforeInput","beforeinput",null,n,u),h.push({event:u,listeners:c}),u.data=A))}a0(h,e)})}function Ko(t,e,n){return{instance:t,listener:e,currentTarget:n}}function Ll(t,e){for(var n=e+"Capture",i=[];t!==null;){var r=t,s=r.stateNode;r.tag===5&&s!==null&&(r=s,s=zo(t,n),s!=null&&i.unshift(Ko(t,s,r)),s=zo(t,e),s!=null&&i.push(Ko(t,s,r))),t=t.return}return i}function Kr(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5);return t||null}function rp(t,e,n,i,r){for(var s=e._reactName,o=[];n!==null&&n!==i;){var a=n,l=a.alternate,c=a.stateNode;if(l!==null&&l===i)break;a.tag===5&&c!==null&&(a=c,r?(l=zo(n,s),l!=null&&o.unshift(Ko(n,l,a))):r||(l=zo(n,s),l!=null&&o.push(Ko(n,l,a)))),n=n.return}o.length!==0&&t.push({event:e,listeners:o})}var z_=/\r\n?/g,H_=/\u0000|\uFFFD/g;function sp(t){return(typeof t=="string"?t:""+t).replace(z_,`
`).replace(H_,"")}function Ca(t,e,n){if(e=sp(e),sp(t)!==e&&n)throw Error(ie(425))}function Nl(){}var $u=null,Zu=null;function Ju(t,e){return t==="textarea"||t==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var Qu=typeof setTimeout=="function"?setTimeout:void 0,V_=typeof clearTimeout=="function"?clearTimeout:void 0,op=typeof Promise=="function"?Promise:void 0,G_=typeof queueMicrotask=="function"?queueMicrotask:typeof op<"u"?function(t){return op.resolve(null).then(t).catch(W_)}:Qu;function W_(t){setTimeout(function(){throw t})}function Oc(t,e){var n=e,i=0;do{var r=n.nextSibling;if(t.removeChild(n),r&&r.nodeType===8)if(n=r.data,n==="/$"){if(i===0){t.removeChild(r),Go(e);return}i--}else n!=="$"&&n!=="$?"&&n!=="$!"||i++;n=r}while(n);Go(e)}function Zi(t){for(;t!=null;t=t.nextSibling){var e=t.nodeType;if(e===1||e===3)break;if(e===8){if(e=t.data,e==="$"||e==="$!"||e==="$?")break;if(e==="/$")return null}}return t}function ap(t){t=t.previousSibling;for(var e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="$"||n==="$!"||n==="$?"){if(e===0)return t;e--}else n==="/$"&&e++}t=t.previousSibling}return null}var qs=Math.random().toString(36).slice(2),ti="__reactFiber$"+qs,Yo="__reactProps$"+qs,Ti="__reactContainer$"+qs,ed="__reactEvents$"+qs,j_="__reactListeners$"+qs,X_="__reactHandles$"+qs;function Cr(t){var e=t[ti];if(e)return e;for(var n=t.parentNode;n;){if(e=n[Ti]||n[ti]){if(n=e.alternate,e.child!==null||n!==null&&n.child!==null)for(t=ap(t);t!==null;){if(n=t[ti])return n;t=ap(t)}return e}t=n,n=t.parentNode}return null}function ca(t){return t=t[ti]||t[Ti],!t||t.tag!==5&&t.tag!==6&&t.tag!==13&&t.tag!==3?null:t}function ms(t){if(t.tag===5||t.tag===6)return t.stateNode;throw Error(ie(33))}function sc(t){return t[Yo]||null}var td=[],gs=-1;function lr(t){return{current:t}}function ft(t){0>gs||(t.current=td[gs],td[gs]=null,gs--)}function ct(t,e){gs++,td[gs]=t.current,t.current=e}var sr={},Jt=lr(sr),un=lr(!1),Ir=sr;function Is(t,e){var n=t.type.contextTypes;if(!n)return sr;var i=t.stateNode;if(i&&i.__reactInternalMemoizedUnmaskedChildContext===e)return i.__reactInternalMemoizedMaskedChildContext;var r={},s;for(s in n)r[s]=e[s];return i&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=e,t.__reactInternalMemoizedMaskedChildContext=r),r}function dn(t){return t=t.childContextTypes,t!=null}function Il(){ft(un),ft(Jt)}function lp(t,e,n){if(Jt.current!==sr)throw Error(ie(168));ct(Jt,e),ct(un,n)}function c0(t,e,n){var i=t.stateNode;if(e=e.childContextTypes,typeof i.getChildContext!="function")return n;i=i.getChildContext();for(var r in i)if(!(r in e))throw Error(ie(108,Px(t)||"Unknown",r));return yt({},n,i)}function Ul(t){return t=(t=t.stateNode)&&t.__reactInternalMemoizedMergedChildContext||sr,Ir=Jt.current,ct(Jt,t),ct(un,un.current),!0}function cp(t,e,n){var i=t.stateNode;if(!i)throw Error(ie(169));n?(t=c0(t,e,Ir),i.__reactInternalMemoizedMergedChildContext=t,ft(un),ft(Jt),ct(Jt,t)):ft(un),ct(un,n)}var vi=null,oc=!1,kc=!1;function u0(t){vi===null?vi=[t]:vi.push(t)}function K_(t){oc=!0,u0(t)}function cr(){if(!kc&&vi!==null){kc=!0;var t=0,e=tt;try{var n=vi;for(tt=1;t<n.length;t++){var i=n[t];do i=i(!0);while(i!==null)}vi=null,oc=!1}catch(r){throw vi!==null&&(vi=vi.slice(t+1)),Ug(Sh,cr),r}finally{tt=e,kc=!1}}return null}var vs=[],xs=0,Fl=null,Ol=0,bn=[],Rn=0,Ur=null,xi=1,_i="";function xr(t,e){vs[xs++]=Ol,vs[xs++]=Fl,Fl=t,Ol=e}function d0(t,e,n){bn[Rn++]=xi,bn[Rn++]=_i,bn[Rn++]=Ur,Ur=t;var i=xi;t=_i;var r=32-Kn(i)-1;i&=~(1<<r),n+=1;var s=32-Kn(e)+r;if(30<s){var o=r-r%5;s=(i&(1<<o)-1).toString(32),i>>=o,r-=o,xi=1<<32-Kn(e)+r|n<<r|i,_i=s+t}else xi=1<<s|n<<r|i,_i=t}function Ph(t){t.return!==null&&(xr(t,1),d0(t,1,0))}function Dh(t){for(;t===Fl;)Fl=vs[--xs],vs[xs]=null,Ol=vs[--xs],vs[xs]=null;for(;t===Ur;)Ur=bn[--Rn],bn[Rn]=null,_i=bn[--Rn],bn[Rn]=null,xi=bn[--Rn],bn[Rn]=null}var Sn=null,_n=null,pt=!1,Gn=null;function h0(t,e){var n=Dn(5,null,null,0);n.elementType="DELETED",n.stateNode=e,n.return=t,e=t.deletions,e===null?(t.deletions=[n],t.flags|=16):e.push(n)}function up(t,e){switch(t.tag){case 5:var n=t.type;return e=e.nodeType!==1||n.toLowerCase()!==e.nodeName.toLowerCase()?null:e,e!==null?(t.stateNode=e,Sn=t,_n=Zi(e.firstChild),!0):!1;case 6:return e=t.pendingProps===""||e.nodeType!==3?null:e,e!==null?(t.stateNode=e,Sn=t,_n=null,!0):!1;case 13:return e=e.nodeType!==8?null:e,e!==null?(n=Ur!==null?{id:xi,overflow:_i}:null,t.memoizedState={dehydrated:e,treeContext:n,retryLane:1073741824},n=Dn(18,null,null,0),n.stateNode=e,n.return=t,t.child=n,Sn=t,_n=null,!0):!1;default:return!1}}function nd(t){return(t.mode&1)!==0&&(t.flags&128)===0}function id(t){if(pt){var e=_n;if(e){var n=e;if(!up(t,e)){if(nd(t))throw Error(ie(418));e=Zi(n.nextSibling);var i=Sn;e&&up(t,e)?h0(i,n):(t.flags=t.flags&-4097|2,pt=!1,Sn=t)}}else{if(nd(t))throw Error(ie(418));t.flags=t.flags&-4097|2,pt=!1,Sn=t}}}function dp(t){for(t=t.return;t!==null&&t.tag!==5&&t.tag!==3&&t.tag!==13;)t=t.return;Sn=t}function ba(t){if(t!==Sn)return!1;if(!pt)return dp(t),pt=!0,!1;var e;if((e=t.tag!==3)&&!(e=t.tag!==5)&&(e=t.type,e=e!=="head"&&e!=="body"&&!Ju(t.type,t.memoizedProps)),e&&(e=_n)){if(nd(t))throw f0(),Error(ie(418));for(;e;)h0(t,e),e=Zi(e.nextSibling)}if(dp(t),t.tag===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(ie(317));e:{for(t=t.nextSibling,e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="/$"){if(e===0){_n=Zi(t.nextSibling);break e}e--}else n!=="$"&&n!=="$!"&&n!=="$?"||e++}t=t.nextSibling}_n=null}}else _n=Sn?Zi(t.stateNode.nextSibling):null;return!0}function f0(){for(var t=_n;t;)t=Zi(t.nextSibling)}function Us(){_n=Sn=null,pt=!1}function Lh(t){Gn===null?Gn=[t]:Gn.push(t)}var Y_=Ri.ReactCurrentBatchConfig;function ao(t,e,n){if(t=n.ref,t!==null&&typeof t!="function"&&typeof t!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(ie(309));var i=n.stateNode}if(!i)throw Error(ie(147,t));var r=i,s=""+t;return e!==null&&e.ref!==null&&typeof e.ref=="function"&&e.ref._stringRef===s?e.ref:(e=function(o){var a=r.refs;o===null?delete a[s]:a[s]=o},e._stringRef=s,e)}if(typeof t!="string")throw Error(ie(284));if(!n._owner)throw Error(ie(290,t))}return t}function Ra(t,e){throw t=Object.prototype.toString.call(e),Error(ie(31,t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t))}function hp(t){var e=t._init;return e(t._payload)}function p0(t){function e(d,g){if(t){var x=d.deletions;x===null?(d.deletions=[g],d.flags|=16):x.push(g)}}function n(d,g){if(!t)return null;for(;g!==null;)e(d,g),g=g.sibling;return null}function i(d,g){for(d=new Map;g!==null;)g.key!==null?d.set(g.key,g):d.set(g.index,g),g=g.sibling;return d}function r(d,g){return d=tr(d,g),d.index=0,d.sibling=null,d}function s(d,g,x){return d.index=x,t?(x=d.alternate,x!==null?(x=x.index,x<g?(d.flags|=2,g):x):(d.flags|=2,g)):(d.flags|=1048576,g)}function o(d){return t&&d.alternate===null&&(d.flags|=2),d}function a(d,g,x,y){return g===null||g.tag!==6?(g=jc(x,d.mode,y),g.return=d,g):(g=r(g,x),g.return=d,g)}function l(d,g,x,y){var R=x.type;return R===ds?u(d,g,x.props.children,y,x.key):g!==null&&(g.elementType===R||typeof R=="object"&&R!==null&&R.$$typeof===Bi&&hp(R)===g.type)?(y=r(g,x.props),y.ref=ao(d,g,x),y.return=d,y):(y=xl(x.type,x.key,x.props,null,d.mode,y),y.ref=ao(d,g,x),y.return=d,y)}function c(d,g,x,y){return g===null||g.tag!==4||g.stateNode.containerInfo!==x.containerInfo||g.stateNode.implementation!==x.implementation?(g=Xc(x,d.mode,y),g.return=d,g):(g=r(g,x.children||[]),g.return=d,g)}function u(d,g,x,y,R){return g===null||g.tag!==7?(g=Dr(x,d.mode,y,R),g.return=d,g):(g=r(g,x),g.return=d,g)}function h(d,g,x){if(typeof g=="string"&&g!==""||typeof g=="number")return g=jc(""+g,d.mode,x),g.return=d,g;if(typeof g=="object"&&g!==null){switch(g.$$typeof){case xa:return x=xl(g.type,g.key,g.props,null,d.mode,x),x.ref=ao(d,null,g),x.return=d,x;case us:return g=Xc(g,d.mode,x),g.return=d,g;case Bi:var y=g._init;return h(d,y(g._payload),x)}if(yo(g)||no(g))return g=Dr(g,d.mode,x,null),g.return=d,g;Ra(d,g)}return null}function f(d,g,x,y){var R=g!==null?g.key:null;if(typeof x=="string"&&x!==""||typeof x=="number")return R!==null?null:a(d,g,""+x,y);if(typeof x=="object"&&x!==null){switch(x.$$typeof){case xa:return x.key===R?l(d,g,x,y):null;case us:return x.key===R?c(d,g,x,y):null;case Bi:return R=x._init,f(d,g,R(x._payload),y)}if(yo(x)||no(x))return R!==null?null:u(d,g,x,y,null);Ra(d,x)}return null}function p(d,g,x,y,R){if(typeof y=="string"&&y!==""||typeof y=="number")return d=d.get(x)||null,a(g,d,""+y,R);if(typeof y=="object"&&y!==null){switch(y.$$typeof){case xa:return d=d.get(y.key===null?x:y.key)||null,l(g,d,y,R);case us:return d=d.get(y.key===null?x:y.key)||null,c(g,d,y,R);case Bi:var C=y._init;return p(d,g,x,C(y._payload),R)}if(yo(y)||no(y))return d=d.get(x)||null,u(g,d,y,R,null);Ra(g,y)}return null}function _(d,g,x,y){for(var R=null,C=null,A=g,b=g=0,w=null;A!==null&&b<x.length;b++){A.index>b?(w=A,A=null):w=A.sibling;var M=f(d,A,x[b],y);if(M===null){A===null&&(A=w);break}t&&A&&M.alternate===null&&e(d,A),g=s(M,g,b),C===null?R=M:C.sibling=M,C=M,A=w}if(b===x.length)return n(d,A),pt&&xr(d,b),R;if(A===null){for(;b<x.length;b++)A=h(d,x[b],y),A!==null&&(g=s(A,g,b),C===null?R=A:C.sibling=A,C=A);return pt&&xr(d,b),R}for(A=i(d,A);b<x.length;b++)w=p(A,d,b,x[b],y),w!==null&&(t&&w.alternate!==null&&A.delete(w.key===null?b:w.key),g=s(w,g,b),C===null?R=w:C.sibling=w,C=w);return t&&A.forEach(function(P){return e(d,P)}),pt&&xr(d,b),R}function v(d,g,x,y){var R=no(x);if(typeof R!="function")throw Error(ie(150));if(x=R.call(x),x==null)throw Error(ie(151));for(var C=R=null,A=g,b=g=0,w=null,M=x.next();A!==null&&!M.done;b++,M=x.next()){A.index>b?(w=A,A=null):w=A.sibling;var P=f(d,A,M.value,y);if(P===null){A===null&&(A=w);break}t&&A&&P.alternate===null&&e(d,A),g=s(P,g,b),C===null?R=P:C.sibling=P,C=P,A=w}if(M.done)return n(d,A),pt&&xr(d,b),R;if(A===null){for(;!M.done;b++,M=x.next())M=h(d,M.value,y),M!==null&&(g=s(M,g,b),C===null?R=M:C.sibling=M,C=M);return pt&&xr(d,b),R}for(A=i(d,A);!M.done;b++,M=x.next())M=p(A,d,b,M.value,y),M!==null&&(t&&M.alternate!==null&&A.delete(M.key===null?b:M.key),g=s(M,g,b),C===null?R=M:C.sibling=M,C=M);return t&&A.forEach(function(V){return e(d,V)}),pt&&xr(d,b),R}function m(d,g,x,y){if(typeof x=="object"&&x!==null&&x.type===ds&&x.key===null&&(x=x.props.children),typeof x=="object"&&x!==null){switch(x.$$typeof){case xa:e:{for(var R=x.key,C=g;C!==null;){if(C.key===R){if(R=x.type,R===ds){if(C.tag===7){n(d,C.sibling),g=r(C,x.props.children),g.return=d,d=g;break e}}else if(C.elementType===R||typeof R=="object"&&R!==null&&R.$$typeof===Bi&&hp(R)===C.type){n(d,C.sibling),g=r(C,x.props),g.ref=ao(d,C,x),g.return=d,d=g;break e}n(d,C);break}else e(d,C);C=C.sibling}x.type===ds?(g=Dr(x.props.children,d.mode,y,x.key),g.return=d,d=g):(y=xl(x.type,x.key,x.props,null,d.mode,y),y.ref=ao(d,g,x),y.return=d,d=y)}return o(d);case us:e:{for(C=x.key;g!==null;){if(g.key===C)if(g.tag===4&&g.stateNode.containerInfo===x.containerInfo&&g.stateNode.implementation===x.implementation){n(d,g.sibling),g=r(g,x.children||[]),g.return=d,d=g;break e}else{n(d,g);break}else e(d,g);g=g.sibling}g=Xc(x,d.mode,y),g.return=d,d=g}return o(d);case Bi:return C=x._init,m(d,g,C(x._payload),y)}if(yo(x))return _(d,g,x,y);if(no(x))return v(d,g,x,y);Ra(d,x)}return typeof x=="string"&&x!==""||typeof x=="number"?(x=""+x,g!==null&&g.tag===6?(n(d,g.sibling),g=r(g,x),g.return=d,d=g):(n(d,g),g=jc(x,d.mode,y),g.return=d,d=g),o(d)):n(d,g)}return m}var Fs=p0(!0),m0=p0(!1),kl=lr(null),Bl=null,_s=null,Nh=null;function Ih(){Nh=_s=Bl=null}function Uh(t){var e=kl.current;ft(kl),t._currentValue=e}function rd(t,e,n){for(;t!==null;){var i=t.alternate;if((t.childLanes&e)!==e?(t.childLanes|=e,i!==null&&(i.childLanes|=e)):i!==null&&(i.childLanes&e)!==e&&(i.childLanes|=e),t===n)break;t=t.return}}function bs(t,e){Bl=t,Nh=_s=null,t=t.dependencies,t!==null&&t.firstContext!==null&&(t.lanes&e&&(cn=!0),t.firstContext=null)}function Nn(t){var e=t._currentValue;if(Nh!==t)if(t={context:t,memoizedValue:e,next:null},_s===null){if(Bl===null)throw Error(ie(308));_s=t,Bl.dependencies={lanes:0,firstContext:t}}else _s=_s.next=t;return e}var br=null;function Fh(t){br===null?br=[t]:br.push(t)}function g0(t,e,n,i){var r=e.interleaved;return r===null?(n.next=n,Fh(e)):(n.next=r.next,r.next=n),e.interleaved=n,Ai(t,i)}function Ai(t,e){t.lanes|=e;var n=t.alternate;for(n!==null&&(n.lanes|=e),n=t,t=t.return;t!==null;)t.childLanes|=e,n=t.alternate,n!==null&&(n.childLanes|=e),n=t,t=t.return;return n.tag===3?n.stateNode:null}var zi=!1;function Oh(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function v0(t,e){t=t.updateQueue,e.updateQueue===t&&(e.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,effects:t.effects})}function Si(t,e){return{eventTime:t,lane:e,tag:0,payload:null,callback:null,next:null}}function Ji(t,e,n){var i=t.updateQueue;if(i===null)return null;if(i=i.shared,qe&2){var r=i.pending;return r===null?e.next=e:(e.next=r.next,r.next=e),i.pending=e,Ai(t,n)}return r=i.interleaved,r===null?(e.next=e,Fh(i)):(e.next=r.next,r.next=e),i.interleaved=e,Ai(t,n)}function hl(t,e,n){if(e=e.updateQueue,e!==null&&(e=e.shared,(n&4194240)!==0)){var i=e.lanes;i&=t.pendingLanes,n|=i,e.lanes=n,Mh(t,n)}}function fp(t,e){var n=t.updateQueue,i=t.alternate;if(i!==null&&(i=i.updateQueue,n===i)){var r=null,s=null;if(n=n.firstBaseUpdate,n!==null){do{var o={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};s===null?r=s=o:s=s.next=o,n=n.next}while(n!==null);s===null?r=s=e:s=s.next=e}else r=s=e;n={baseState:i.baseState,firstBaseUpdate:r,lastBaseUpdate:s,shared:i.shared,effects:i.effects},t.updateQueue=n;return}t=n.lastBaseUpdate,t===null?n.firstBaseUpdate=e:t.next=e,n.lastBaseUpdate=e}function zl(t,e,n,i){var r=t.updateQueue;zi=!1;var s=r.firstBaseUpdate,o=r.lastBaseUpdate,a=r.shared.pending;if(a!==null){r.shared.pending=null;var l=a,c=l.next;l.next=null,o===null?s=c:o.next=c,o=l;var u=t.alternate;u!==null&&(u=u.updateQueue,a=u.lastBaseUpdate,a!==o&&(a===null?u.firstBaseUpdate=c:a.next=c,u.lastBaseUpdate=l))}if(s!==null){var h=r.baseState;o=0,u=c=l=null,a=s;do{var f=a.lane,p=a.eventTime;if((i&f)===f){u!==null&&(u=u.next={eventTime:p,lane:0,tag:a.tag,payload:a.payload,callback:a.callback,next:null});e:{var _=t,v=a;switch(f=e,p=n,v.tag){case 1:if(_=v.payload,typeof _=="function"){h=_.call(p,h,f);break e}h=_;break e;case 3:_.flags=_.flags&-65537|128;case 0:if(_=v.payload,f=typeof _=="function"?_.call(p,h,f):_,f==null)break e;h=yt({},h,f);break e;case 2:zi=!0}}a.callback!==null&&a.lane!==0&&(t.flags|=64,f=r.effects,f===null?r.effects=[a]:f.push(a))}else p={eventTime:p,lane:f,tag:a.tag,payload:a.payload,callback:a.callback,next:null},u===null?(c=u=p,l=h):u=u.next=p,o|=f;if(a=a.next,a===null){if(a=r.shared.pending,a===null)break;f=a,a=f.next,f.next=null,r.lastBaseUpdate=f,r.shared.pending=null}}while(!0);if(u===null&&(l=h),r.baseState=l,r.firstBaseUpdate=c,r.lastBaseUpdate=u,e=r.shared.interleaved,e!==null){r=e;do o|=r.lane,r=r.next;while(r!==e)}else s===null&&(r.shared.lanes=0);Or|=o,t.lanes=o,t.memoizedState=h}}function pp(t,e,n){if(t=e.effects,e.effects=null,t!==null)for(e=0;e<t.length;e++){var i=t[e],r=i.callback;if(r!==null){if(i.callback=null,i=n,typeof r!="function")throw Error(ie(191,r));r.call(i)}}}var ua={},oi=lr(ua),qo=lr(ua),$o=lr(ua);function Rr(t){if(t===ua)throw Error(ie(174));return t}function kh(t,e){switch(ct($o,e),ct(qo,t),ct(oi,ua),t=e.nodeType,t){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:ku(null,"");break;default:t=t===8?e.parentNode:e,e=t.namespaceURI||null,t=t.tagName,e=ku(e,t)}ft(oi),ct(oi,e)}function Os(){ft(oi),ft(qo),ft($o)}function x0(t){Rr($o.current);var e=Rr(oi.current),n=ku(e,t.type);e!==n&&(ct(qo,t),ct(oi,n))}function Bh(t){qo.current===t&&(ft(oi),ft(qo))}var xt=lr(0);function Hl(t){for(var e=t;e!==null;){if(e.tag===13){var n=e.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if(e.flags&128)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var Bc=[];function zh(){for(var t=0;t<Bc.length;t++)Bc[t]._workInProgressVersionPrimary=null;Bc.length=0}var fl=Ri.ReactCurrentDispatcher,zc=Ri.ReactCurrentBatchConfig,Fr=0,_t=null,Rt=null,Ft=null,Vl=!1,Do=!1,Zo=0,q_=0;function Xt(){throw Error(ie(321))}function Hh(t,e){if(e===null)return!1;for(var n=0;n<e.length&&n<t.length;n++)if(!qn(t[n],e[n]))return!1;return!0}function Vh(t,e,n,i,r,s){if(Fr=s,_t=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,fl.current=t===null||t.memoizedState===null?Q_:ey,t=n(i,r),Do){s=0;do{if(Do=!1,Zo=0,25<=s)throw Error(ie(301));s+=1,Ft=Rt=null,e.updateQueue=null,fl.current=ty,t=n(i,r)}while(Do)}if(fl.current=Gl,e=Rt!==null&&Rt.next!==null,Fr=0,Ft=Rt=_t=null,Vl=!1,e)throw Error(ie(300));return t}function Gh(){var t=Zo!==0;return Zo=0,t}function Jn(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Ft===null?_t.memoizedState=Ft=t:Ft=Ft.next=t,Ft}function In(){if(Rt===null){var t=_t.alternate;t=t!==null?t.memoizedState:null}else t=Rt.next;var e=Ft===null?_t.memoizedState:Ft.next;if(e!==null)Ft=e,Rt=t;else{if(t===null)throw Error(ie(310));Rt=t,t={memoizedState:Rt.memoizedState,baseState:Rt.baseState,baseQueue:Rt.baseQueue,queue:Rt.queue,next:null},Ft===null?_t.memoizedState=Ft=t:Ft=Ft.next=t}return Ft}function Jo(t,e){return typeof e=="function"?e(t):e}function Hc(t){var e=In(),n=e.queue;if(n===null)throw Error(ie(311));n.lastRenderedReducer=t;var i=Rt,r=i.baseQueue,s=n.pending;if(s!==null){if(r!==null){var o=r.next;r.next=s.next,s.next=o}i.baseQueue=r=s,n.pending=null}if(r!==null){s=r.next,i=i.baseState;var a=o=null,l=null,c=s;do{var u=c.lane;if((Fr&u)===u)l!==null&&(l=l.next={lane:0,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null}),i=c.hasEagerState?c.eagerState:t(i,c.action);else{var h={lane:u,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null};l===null?(a=l=h,o=i):l=l.next=h,_t.lanes|=u,Or|=u}c=c.next}while(c!==null&&c!==s);l===null?o=i:l.next=a,qn(i,e.memoizedState)||(cn=!0),e.memoizedState=i,e.baseState=o,e.baseQueue=l,n.lastRenderedState=i}if(t=n.interleaved,t!==null){r=t;do s=r.lane,_t.lanes|=s,Or|=s,r=r.next;while(r!==t)}else r===null&&(n.lanes=0);return[e.memoizedState,n.dispatch]}function Vc(t){var e=In(),n=e.queue;if(n===null)throw Error(ie(311));n.lastRenderedReducer=t;var i=n.dispatch,r=n.pending,s=e.memoizedState;if(r!==null){n.pending=null;var o=r=r.next;do s=t(s,o.action),o=o.next;while(o!==r);qn(s,e.memoizedState)||(cn=!0),e.memoizedState=s,e.baseQueue===null&&(e.baseState=s),n.lastRenderedState=s}return[s,i]}function _0(){}function y0(t,e){var n=_t,i=In(),r=e(),s=!qn(i.memoizedState,r);if(s&&(i.memoizedState=r,cn=!0),i=i.queue,Wh(E0.bind(null,n,i,t),[t]),i.getSnapshot!==e||s||Ft!==null&&Ft.memoizedState.tag&1){if(n.flags|=2048,Qo(9,M0.bind(null,n,i,r,e),void 0,null),Ot===null)throw Error(ie(349));Fr&30||S0(n,e,r)}return r}function S0(t,e,n){t.flags|=16384,t={getSnapshot:e,value:n},e=_t.updateQueue,e===null?(e={lastEffect:null,stores:null},_t.updateQueue=e,e.stores=[t]):(n=e.stores,n===null?e.stores=[t]:n.push(t))}function M0(t,e,n,i){e.value=n,e.getSnapshot=i,w0(e)&&T0(t)}function E0(t,e,n){return n(function(){w0(e)&&T0(t)})}function w0(t){var e=t.getSnapshot;t=t.value;try{var n=e();return!qn(t,n)}catch{return!0}}function T0(t){var e=Ai(t,1);e!==null&&Yn(e,t,1,-1)}function mp(t){var e=Jn();return typeof t=="function"&&(t=t()),e.memoizedState=e.baseState=t,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Jo,lastRenderedState:t},e.queue=t,t=t.dispatch=J_.bind(null,_t,t),[e.memoizedState,t]}function Qo(t,e,n,i){return t={tag:t,create:e,destroy:n,deps:i,next:null},e=_t.updateQueue,e===null?(e={lastEffect:null,stores:null},_t.updateQueue=e,e.lastEffect=t.next=t):(n=e.lastEffect,n===null?e.lastEffect=t.next=t:(i=n.next,n.next=t,t.next=i,e.lastEffect=t)),t}function A0(){return In().memoizedState}function pl(t,e,n,i){var r=Jn();_t.flags|=t,r.memoizedState=Qo(1|e,n,void 0,i===void 0?null:i)}function ac(t,e,n,i){var r=In();i=i===void 0?null:i;var s=void 0;if(Rt!==null){var o=Rt.memoizedState;if(s=o.destroy,i!==null&&Hh(i,o.deps)){r.memoizedState=Qo(e,n,s,i);return}}_t.flags|=t,r.memoizedState=Qo(1|e,n,s,i)}function gp(t,e){return pl(8390656,8,t,e)}function Wh(t,e){return ac(2048,8,t,e)}function C0(t,e){return ac(4,2,t,e)}function b0(t,e){return ac(4,4,t,e)}function R0(t,e){if(typeof e=="function")return t=t(),e(t),function(){e(null)};if(e!=null)return t=t(),e.current=t,function(){e.current=null}}function P0(t,e,n){return n=n!=null?n.concat([t]):null,ac(4,4,R0.bind(null,e,t),n)}function jh(){}function D0(t,e){var n=In();e=e===void 0?null:e;var i=n.memoizedState;return i!==null&&e!==null&&Hh(e,i[1])?i[0]:(n.memoizedState=[t,e],t)}function L0(t,e){var n=In();e=e===void 0?null:e;var i=n.memoizedState;return i!==null&&e!==null&&Hh(e,i[1])?i[0]:(t=t(),n.memoizedState=[t,e],t)}function N0(t,e,n){return Fr&21?(qn(n,e)||(n=kg(),_t.lanes|=n,Or|=n,t.baseState=!0),e):(t.baseState&&(t.baseState=!1,cn=!0),t.memoizedState=n)}function $_(t,e){var n=tt;tt=n!==0&&4>n?n:4,t(!0);var i=zc.transition;zc.transition={};try{t(!1),e()}finally{tt=n,zc.transition=i}}function I0(){return In().memoizedState}function Z_(t,e,n){var i=er(t);if(n={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null},U0(t))F0(e,n);else if(n=g0(t,e,n,i),n!==null){var r=rn();Yn(n,t,i,r),O0(n,e,i)}}function J_(t,e,n){var i=er(t),r={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null};if(U0(t))F0(e,r);else{var s=t.alternate;if(t.lanes===0&&(s===null||s.lanes===0)&&(s=e.lastRenderedReducer,s!==null))try{var o=e.lastRenderedState,a=s(o,n);if(r.hasEagerState=!0,r.eagerState=a,qn(a,o)){var l=e.interleaved;l===null?(r.next=r,Fh(e)):(r.next=l.next,l.next=r),e.interleaved=r;return}}catch{}finally{}n=g0(t,e,r,i),n!==null&&(r=rn(),Yn(n,t,i,r),O0(n,e,i))}}function U0(t){var e=t.alternate;return t===_t||e!==null&&e===_t}function F0(t,e){Do=Vl=!0;var n=t.pending;n===null?e.next=e:(e.next=n.next,n.next=e),t.pending=e}function O0(t,e,n){if(n&4194240){var i=e.lanes;i&=t.pendingLanes,n|=i,e.lanes=n,Mh(t,n)}}var Gl={readContext:Nn,useCallback:Xt,useContext:Xt,useEffect:Xt,useImperativeHandle:Xt,useInsertionEffect:Xt,useLayoutEffect:Xt,useMemo:Xt,useReducer:Xt,useRef:Xt,useState:Xt,useDebugValue:Xt,useDeferredValue:Xt,useTransition:Xt,useMutableSource:Xt,useSyncExternalStore:Xt,useId:Xt,unstable_isNewReconciler:!1},Q_={readContext:Nn,useCallback:function(t,e){return Jn().memoizedState=[t,e===void 0?null:e],t},useContext:Nn,useEffect:gp,useImperativeHandle:function(t,e,n){return n=n!=null?n.concat([t]):null,pl(4194308,4,R0.bind(null,e,t),n)},useLayoutEffect:function(t,e){return pl(4194308,4,t,e)},useInsertionEffect:function(t,e){return pl(4,2,t,e)},useMemo:function(t,e){var n=Jn();return e=e===void 0?null:e,t=t(),n.memoizedState=[t,e],t},useReducer:function(t,e,n){var i=Jn();return e=n!==void 0?n(e):e,i.memoizedState=i.baseState=e,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:e},i.queue=t,t=t.dispatch=Z_.bind(null,_t,t),[i.memoizedState,t]},useRef:function(t){var e=Jn();return t={current:t},e.memoizedState=t},useState:mp,useDebugValue:jh,useDeferredValue:function(t){return Jn().memoizedState=t},useTransition:function(){var t=mp(!1),e=t[0];return t=$_.bind(null,t[1]),Jn().memoizedState=t,[e,t]},useMutableSource:function(){},useSyncExternalStore:function(t,e,n){var i=_t,r=Jn();if(pt){if(n===void 0)throw Error(ie(407));n=n()}else{if(n=e(),Ot===null)throw Error(ie(349));Fr&30||S0(i,e,n)}r.memoizedState=n;var s={value:n,getSnapshot:e};return r.queue=s,gp(E0.bind(null,i,s,t),[t]),i.flags|=2048,Qo(9,M0.bind(null,i,s,n,e),void 0,null),n},useId:function(){var t=Jn(),e=Ot.identifierPrefix;if(pt){var n=_i,i=xi;n=(i&~(1<<32-Kn(i)-1)).toString(32)+n,e=":"+e+"R"+n,n=Zo++,0<n&&(e+="H"+n.toString(32)),e+=":"}else n=q_++,e=":"+e+"r"+n.toString(32)+":";return t.memoizedState=e},unstable_isNewReconciler:!1},ey={readContext:Nn,useCallback:D0,useContext:Nn,useEffect:Wh,useImperativeHandle:P0,useInsertionEffect:C0,useLayoutEffect:b0,useMemo:L0,useReducer:Hc,useRef:A0,useState:function(){return Hc(Jo)},useDebugValue:jh,useDeferredValue:function(t){var e=In();return N0(e,Rt.memoizedState,t)},useTransition:function(){var t=Hc(Jo)[0],e=In().memoizedState;return[t,e]},useMutableSource:_0,useSyncExternalStore:y0,useId:I0,unstable_isNewReconciler:!1},ty={readContext:Nn,useCallback:D0,useContext:Nn,useEffect:Wh,useImperativeHandle:P0,useInsertionEffect:C0,useLayoutEffect:b0,useMemo:L0,useReducer:Vc,useRef:A0,useState:function(){return Vc(Jo)},useDebugValue:jh,useDeferredValue:function(t){var e=In();return Rt===null?e.memoizedState=t:N0(e,Rt.memoizedState,t)},useTransition:function(){var t=Vc(Jo)[0],e=In().memoizedState;return[t,e]},useMutableSource:_0,useSyncExternalStore:y0,useId:I0,unstable_isNewReconciler:!1};function Hn(t,e){if(t&&t.defaultProps){e=yt({},e),t=t.defaultProps;for(var n in t)e[n]===void 0&&(e[n]=t[n]);return e}return e}function sd(t,e,n,i){e=t.memoizedState,n=n(i,e),n=n==null?e:yt({},e,n),t.memoizedState=n,t.lanes===0&&(t.updateQueue.baseState=n)}var lc={isMounted:function(t){return(t=t._reactInternals)?Vr(t)===t:!1},enqueueSetState:function(t,e,n){t=t._reactInternals;var i=rn(),r=er(t),s=Si(i,r);s.payload=e,n!=null&&(s.callback=n),e=Ji(t,s,r),e!==null&&(Yn(e,t,r,i),hl(e,t,r))},enqueueReplaceState:function(t,e,n){t=t._reactInternals;var i=rn(),r=er(t),s=Si(i,r);s.tag=1,s.payload=e,n!=null&&(s.callback=n),e=Ji(t,s,r),e!==null&&(Yn(e,t,r,i),hl(e,t,r))},enqueueForceUpdate:function(t,e){t=t._reactInternals;var n=rn(),i=er(t),r=Si(n,i);r.tag=2,e!=null&&(r.callback=e),e=Ji(t,r,i),e!==null&&(Yn(e,t,i,n),hl(e,t,i))}};function vp(t,e,n,i,r,s,o){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(i,s,o):e.prototype&&e.prototype.isPureReactComponent?!jo(n,i)||!jo(r,s):!0}function k0(t,e,n){var i=!1,r=sr,s=e.contextType;return typeof s=="object"&&s!==null?s=Nn(s):(r=dn(e)?Ir:Jt.current,i=e.contextTypes,s=(i=i!=null)?Is(t,r):sr),e=new e(n,s),t.memoizedState=e.state!==null&&e.state!==void 0?e.state:null,e.updater=lc,t.stateNode=e,e._reactInternals=t,i&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=r,t.__reactInternalMemoizedMaskedChildContext=s),e}function xp(t,e,n,i){t=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(n,i),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(n,i),e.state!==t&&lc.enqueueReplaceState(e,e.state,null)}function od(t,e,n,i){var r=t.stateNode;r.props=n,r.state=t.memoizedState,r.refs={},Oh(t);var s=e.contextType;typeof s=="object"&&s!==null?r.context=Nn(s):(s=dn(e)?Ir:Jt.current,r.context=Is(t,s)),r.state=t.memoizedState,s=e.getDerivedStateFromProps,typeof s=="function"&&(sd(t,e,s,n),r.state=t.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof r.getSnapshotBeforeUpdate=="function"||typeof r.UNSAFE_componentWillMount!="function"&&typeof r.componentWillMount!="function"||(e=r.state,typeof r.componentWillMount=="function"&&r.componentWillMount(),typeof r.UNSAFE_componentWillMount=="function"&&r.UNSAFE_componentWillMount(),e!==r.state&&lc.enqueueReplaceState(r,r.state,null),zl(t,n,r,i),r.state=t.memoizedState),typeof r.componentDidMount=="function"&&(t.flags|=4194308)}function ks(t,e){try{var n="",i=e;do n+=Rx(i),i=i.return;while(i);var r=n}catch(s){r=`
Error generating stack: `+s.message+`
`+s.stack}return{value:t,source:e,stack:r,digest:null}}function Gc(t,e,n){return{value:t,source:null,stack:n??null,digest:e??null}}function ad(t,e){try{console.error(e.value)}catch(n){setTimeout(function(){throw n})}}var ny=typeof WeakMap=="function"?WeakMap:Map;function B0(t,e,n){n=Si(-1,n),n.tag=3,n.payload={element:null};var i=e.value;return n.callback=function(){jl||(jl=!0,vd=i),ad(t,e)},n}function z0(t,e,n){n=Si(-1,n),n.tag=3;var i=t.type.getDerivedStateFromError;if(typeof i=="function"){var r=e.value;n.payload=function(){return i(r)},n.callback=function(){ad(t,e)}}var s=t.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(n.callback=function(){ad(t,e),typeof i!="function"&&(Qi===null?Qi=new Set([this]):Qi.add(this));var o=e.stack;this.componentDidCatch(e.value,{componentStack:o!==null?o:""})}),n}function _p(t,e,n){var i=t.pingCache;if(i===null){i=t.pingCache=new ny;var r=new Set;i.set(e,r)}else r=i.get(e),r===void 0&&(r=new Set,i.set(e,r));r.has(n)||(r.add(n),t=gy.bind(null,t,e,n),e.then(t,t))}function yp(t){do{var e;if((e=t.tag===13)&&(e=t.memoizedState,e=e!==null?e.dehydrated!==null:!0),e)return t;t=t.return}while(t!==null);return null}function Sp(t,e,n,i,r){return t.mode&1?(t.flags|=65536,t.lanes=r,t):(t===e?t.flags|=65536:(t.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(e=Si(-1,1),e.tag=2,Ji(n,e,1))),n.lanes|=1),t)}var iy=Ri.ReactCurrentOwner,cn=!1;function nn(t,e,n,i){e.child=t===null?m0(e,null,n,i):Fs(e,t.child,n,i)}function Mp(t,e,n,i,r){n=n.render;var s=e.ref;return bs(e,r),i=Vh(t,e,n,i,s,r),n=Gh(),t!==null&&!cn?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~r,Ci(t,e,r)):(pt&&n&&Ph(e),e.flags|=1,nn(t,e,i,r),e.child)}function Ep(t,e,n,i,r){if(t===null){var s=n.type;return typeof s=="function"&&!Qh(s)&&s.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(e.tag=15,e.type=s,H0(t,e,s,i,r)):(t=xl(n.type,null,i,e,e.mode,r),t.ref=e.ref,t.return=e,e.child=t)}if(s=t.child,!(t.lanes&r)){var o=s.memoizedProps;if(n=n.compare,n=n!==null?n:jo,n(o,i)&&t.ref===e.ref)return Ci(t,e,r)}return e.flags|=1,t=tr(s,i),t.ref=e.ref,t.return=e,e.child=t}function H0(t,e,n,i,r){if(t!==null){var s=t.memoizedProps;if(jo(s,i)&&t.ref===e.ref)if(cn=!1,e.pendingProps=i=s,(t.lanes&r)!==0)t.flags&131072&&(cn=!0);else return e.lanes=t.lanes,Ci(t,e,r)}return ld(t,e,n,i,r)}function V0(t,e,n){var i=e.pendingProps,r=i.children,s=t!==null?t.memoizedState:null;if(i.mode==="hidden")if(!(e.mode&1))e.memoizedState={baseLanes:0,cachePool:null,transitions:null},ct(Ss,vn),vn|=n;else{if(!(n&1073741824))return t=s!==null?s.baseLanes|n:n,e.lanes=e.childLanes=1073741824,e.memoizedState={baseLanes:t,cachePool:null,transitions:null},e.updateQueue=null,ct(Ss,vn),vn|=t,null;e.memoizedState={baseLanes:0,cachePool:null,transitions:null},i=s!==null?s.baseLanes:n,ct(Ss,vn),vn|=i}else s!==null?(i=s.baseLanes|n,e.memoizedState=null):i=n,ct(Ss,vn),vn|=i;return nn(t,e,r,n),e.child}function G0(t,e){var n=e.ref;(t===null&&n!==null||t!==null&&t.ref!==n)&&(e.flags|=512,e.flags|=2097152)}function ld(t,e,n,i,r){var s=dn(n)?Ir:Jt.current;return s=Is(e,s),bs(e,r),n=Vh(t,e,n,i,s,r),i=Gh(),t!==null&&!cn?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~r,Ci(t,e,r)):(pt&&i&&Ph(e),e.flags|=1,nn(t,e,n,r),e.child)}function wp(t,e,n,i,r){if(dn(n)){var s=!0;Ul(e)}else s=!1;if(bs(e,r),e.stateNode===null)ml(t,e),k0(e,n,i),od(e,n,i,r),i=!0;else if(t===null){var o=e.stateNode,a=e.memoizedProps;o.props=a;var l=o.context,c=n.contextType;typeof c=="object"&&c!==null?c=Nn(c):(c=dn(n)?Ir:Jt.current,c=Is(e,c));var u=n.getDerivedStateFromProps,h=typeof u=="function"||typeof o.getSnapshotBeforeUpdate=="function";h||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(a!==i||l!==c)&&xp(e,o,i,c),zi=!1;var f=e.memoizedState;o.state=f,zl(e,i,o,r),l=e.memoizedState,a!==i||f!==l||un.current||zi?(typeof u=="function"&&(sd(e,n,u,i),l=e.memoizedState),(a=zi||vp(e,n,a,i,f,l,c))?(h||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount=="function"&&(e.flags|=4194308)):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=i,e.memoizedState=l),o.props=i,o.state=l,o.context=c,i=a):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),i=!1)}else{o=e.stateNode,v0(t,e),a=e.memoizedProps,c=e.type===e.elementType?a:Hn(e.type,a),o.props=c,h=e.pendingProps,f=o.context,l=n.contextType,typeof l=="object"&&l!==null?l=Nn(l):(l=dn(n)?Ir:Jt.current,l=Is(e,l));var p=n.getDerivedStateFromProps;(u=typeof p=="function"||typeof o.getSnapshotBeforeUpdate=="function")||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(a!==h||f!==l)&&xp(e,o,i,l),zi=!1,f=e.memoizedState,o.state=f,zl(e,i,o,r);var _=e.memoizedState;a!==h||f!==_||un.current||zi?(typeof p=="function"&&(sd(e,n,p,i),_=e.memoizedState),(c=zi||vp(e,n,c,i,f,_,l)||!1)?(u||typeof o.UNSAFE_componentWillUpdate!="function"&&typeof o.componentWillUpdate!="function"||(typeof o.componentWillUpdate=="function"&&o.componentWillUpdate(i,_,l),typeof o.UNSAFE_componentWillUpdate=="function"&&o.UNSAFE_componentWillUpdate(i,_,l)),typeof o.componentDidUpdate=="function"&&(e.flags|=4),typeof o.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof o.componentDidUpdate!="function"||a===t.memoizedProps&&f===t.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||a===t.memoizedProps&&f===t.memoizedState||(e.flags|=1024),e.memoizedProps=i,e.memoizedState=_),o.props=i,o.state=_,o.context=l,i=c):(typeof o.componentDidUpdate!="function"||a===t.memoizedProps&&f===t.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||a===t.memoizedProps&&f===t.memoizedState||(e.flags|=1024),i=!1)}return cd(t,e,n,i,s,r)}function cd(t,e,n,i,r,s){G0(t,e);var o=(e.flags&128)!==0;if(!i&&!o)return r&&cp(e,n,!1),Ci(t,e,s);i=e.stateNode,iy.current=e;var a=o&&typeof n.getDerivedStateFromError!="function"?null:i.render();return e.flags|=1,t!==null&&o?(e.child=Fs(e,t.child,null,s),e.child=Fs(e,null,a,s)):nn(t,e,a,s),e.memoizedState=i.state,r&&cp(e,n,!0),e.child}function W0(t){var e=t.stateNode;e.pendingContext?lp(t,e.pendingContext,e.pendingContext!==e.context):e.context&&lp(t,e.context,!1),kh(t,e.containerInfo)}function Tp(t,e,n,i,r){return Us(),Lh(r),e.flags|=256,nn(t,e,n,i),e.child}var ud={dehydrated:null,treeContext:null,retryLane:0};function dd(t){return{baseLanes:t,cachePool:null,transitions:null}}function j0(t,e,n){var i=e.pendingProps,r=xt.current,s=!1,o=(e.flags&128)!==0,a;if((a=o)||(a=t!==null&&t.memoizedState===null?!1:(r&2)!==0),a?(s=!0,e.flags&=-129):(t===null||t.memoizedState!==null)&&(r|=1),ct(xt,r&1),t===null)return id(e),t=e.memoizedState,t!==null&&(t=t.dehydrated,t!==null)?(e.mode&1?t.data==="$!"?e.lanes=8:e.lanes=1073741824:e.lanes=1,null):(o=i.children,t=i.fallback,s?(i=e.mode,s=e.child,o={mode:"hidden",children:o},!(i&1)&&s!==null?(s.childLanes=0,s.pendingProps=o):s=dc(o,i,0,null),t=Dr(t,i,n,null),s.return=e,t.return=e,s.sibling=t,e.child=s,e.child.memoizedState=dd(n),e.memoizedState=ud,t):Xh(e,o));if(r=t.memoizedState,r!==null&&(a=r.dehydrated,a!==null))return ry(t,e,o,i,a,r,n);if(s){s=i.fallback,o=e.mode,r=t.child,a=r.sibling;var l={mode:"hidden",children:i.children};return!(o&1)&&e.child!==r?(i=e.child,i.childLanes=0,i.pendingProps=l,e.deletions=null):(i=tr(r,l),i.subtreeFlags=r.subtreeFlags&14680064),a!==null?s=tr(a,s):(s=Dr(s,o,n,null),s.flags|=2),s.return=e,i.return=e,i.sibling=s,e.child=i,i=s,s=e.child,o=t.child.memoizedState,o=o===null?dd(n):{baseLanes:o.baseLanes|n,cachePool:null,transitions:o.transitions},s.memoizedState=o,s.childLanes=t.childLanes&~n,e.memoizedState=ud,i}return s=t.child,t=s.sibling,i=tr(s,{mode:"visible",children:i.children}),!(e.mode&1)&&(i.lanes=n),i.return=e,i.sibling=null,t!==null&&(n=e.deletions,n===null?(e.deletions=[t],e.flags|=16):n.push(t)),e.child=i,e.memoizedState=null,i}function Xh(t,e){return e=dc({mode:"visible",children:e},t.mode,0,null),e.return=t,t.child=e}function Pa(t,e,n,i){return i!==null&&Lh(i),Fs(e,t.child,null,n),t=Xh(e,e.pendingProps.children),t.flags|=2,e.memoizedState=null,t}function ry(t,e,n,i,r,s,o){if(n)return e.flags&256?(e.flags&=-257,i=Gc(Error(ie(422))),Pa(t,e,o,i)):e.memoizedState!==null?(e.child=t.child,e.flags|=128,null):(s=i.fallback,r=e.mode,i=dc({mode:"visible",children:i.children},r,0,null),s=Dr(s,r,o,null),s.flags|=2,i.return=e,s.return=e,i.sibling=s,e.child=i,e.mode&1&&Fs(e,t.child,null,o),e.child.memoizedState=dd(o),e.memoizedState=ud,s);if(!(e.mode&1))return Pa(t,e,o,null);if(r.data==="$!"){if(i=r.nextSibling&&r.nextSibling.dataset,i)var a=i.dgst;return i=a,s=Error(ie(419)),i=Gc(s,i,void 0),Pa(t,e,o,i)}if(a=(o&t.childLanes)!==0,cn||a){if(i=Ot,i!==null){switch(o&-o){case 4:r=2;break;case 16:r=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:r=32;break;case 536870912:r=268435456;break;default:r=0}r=r&(i.suspendedLanes|o)?0:r,r!==0&&r!==s.retryLane&&(s.retryLane=r,Ai(t,r),Yn(i,t,r,-1))}return Jh(),i=Gc(Error(ie(421))),Pa(t,e,o,i)}return r.data==="$?"?(e.flags|=128,e.child=t.child,e=vy.bind(null,t),r._reactRetry=e,null):(t=s.treeContext,_n=Zi(r.nextSibling),Sn=e,pt=!0,Gn=null,t!==null&&(bn[Rn++]=xi,bn[Rn++]=_i,bn[Rn++]=Ur,xi=t.id,_i=t.overflow,Ur=e),e=Xh(e,i.children),e.flags|=4096,e)}function Ap(t,e,n){t.lanes|=e;var i=t.alternate;i!==null&&(i.lanes|=e),rd(t.return,e,n)}function Wc(t,e,n,i,r){var s=t.memoizedState;s===null?t.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:i,tail:n,tailMode:r}:(s.isBackwards=e,s.rendering=null,s.renderingStartTime=0,s.last=i,s.tail=n,s.tailMode=r)}function X0(t,e,n){var i=e.pendingProps,r=i.revealOrder,s=i.tail;if(nn(t,e,i.children,n),i=xt.current,i&2)i=i&1|2,e.flags|=128;else{if(t!==null&&t.flags&128)e:for(t=e.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&Ap(t,n,e);else if(t.tag===19)Ap(t,n,e);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}i&=1}if(ct(xt,i),!(e.mode&1))e.memoizedState=null;else switch(r){case"forwards":for(n=e.child,r=null;n!==null;)t=n.alternate,t!==null&&Hl(t)===null&&(r=n),n=n.sibling;n=r,n===null?(r=e.child,e.child=null):(r=n.sibling,n.sibling=null),Wc(e,!1,r,n,s);break;case"backwards":for(n=null,r=e.child,e.child=null;r!==null;){if(t=r.alternate,t!==null&&Hl(t)===null){e.child=r;break}t=r.sibling,r.sibling=n,n=r,r=t}Wc(e,!0,n,null,s);break;case"together":Wc(e,!1,null,null,void 0);break;default:e.memoizedState=null}return e.child}function ml(t,e){!(e.mode&1)&&t!==null&&(t.alternate=null,e.alternate=null,e.flags|=2)}function Ci(t,e,n){if(t!==null&&(e.dependencies=t.dependencies),Or|=e.lanes,!(n&e.childLanes))return null;if(t!==null&&e.child!==t.child)throw Error(ie(153));if(e.child!==null){for(t=e.child,n=tr(t,t.pendingProps),e.child=n,n.return=e;t.sibling!==null;)t=t.sibling,n=n.sibling=tr(t,t.pendingProps),n.return=e;n.sibling=null}return e.child}function sy(t,e,n){switch(e.tag){case 3:W0(e),Us();break;case 5:x0(e);break;case 1:dn(e.type)&&Ul(e);break;case 4:kh(e,e.stateNode.containerInfo);break;case 10:var i=e.type._context,r=e.memoizedProps.value;ct(kl,i._currentValue),i._currentValue=r;break;case 13:if(i=e.memoizedState,i!==null)return i.dehydrated!==null?(ct(xt,xt.current&1),e.flags|=128,null):n&e.child.childLanes?j0(t,e,n):(ct(xt,xt.current&1),t=Ci(t,e,n),t!==null?t.sibling:null);ct(xt,xt.current&1);break;case 19:if(i=(n&e.childLanes)!==0,t.flags&128){if(i)return X0(t,e,n);e.flags|=128}if(r=e.memoizedState,r!==null&&(r.rendering=null,r.tail=null,r.lastEffect=null),ct(xt,xt.current),i)break;return null;case 22:case 23:return e.lanes=0,V0(t,e,n)}return Ci(t,e,n)}var K0,hd,Y0,q0;K0=function(t,e){for(var n=e.child;n!==null;){if(n.tag===5||n.tag===6)t.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};hd=function(){};Y0=function(t,e,n,i){var r=t.memoizedProps;if(r!==i){t=e.stateNode,Rr(oi.current);var s=null;switch(n){case"input":r=Iu(t,r),i=Iu(t,i),s=[];break;case"select":r=yt({},r,{value:void 0}),i=yt({},i,{value:void 0}),s=[];break;case"textarea":r=Ou(t,r),i=Ou(t,i),s=[];break;default:typeof r.onClick!="function"&&typeof i.onClick=="function"&&(t.onclick=Nl)}Bu(n,i);var o;n=null;for(c in r)if(!i.hasOwnProperty(c)&&r.hasOwnProperty(c)&&r[c]!=null)if(c==="style"){var a=r[c];for(o in a)a.hasOwnProperty(o)&&(n||(n={}),n[o]="")}else c!=="dangerouslySetInnerHTML"&&c!=="children"&&c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&c!=="autoFocus"&&(ko.hasOwnProperty(c)?s||(s=[]):(s=s||[]).push(c,null));for(c in i){var l=i[c];if(a=r!=null?r[c]:void 0,i.hasOwnProperty(c)&&l!==a&&(l!=null||a!=null))if(c==="style")if(a){for(o in a)!a.hasOwnProperty(o)||l&&l.hasOwnProperty(o)||(n||(n={}),n[o]="");for(o in l)l.hasOwnProperty(o)&&a[o]!==l[o]&&(n||(n={}),n[o]=l[o])}else n||(s||(s=[]),s.push(c,n)),n=l;else c==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,a=a?a.__html:void 0,l!=null&&a!==l&&(s=s||[]).push(c,l)):c==="children"?typeof l!="string"&&typeof l!="number"||(s=s||[]).push(c,""+l):c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&(ko.hasOwnProperty(c)?(l!=null&&c==="onScroll"&&ht("scroll",t),s||a===l||(s=[])):(s=s||[]).push(c,l))}n&&(s=s||[]).push("style",n);var c=s;(e.updateQueue=c)&&(e.flags|=4)}};q0=function(t,e,n,i){n!==i&&(e.flags|=4)};function lo(t,e){if(!pt)switch(t.tailMode){case"hidden":e=t.tail;for(var n=null;e!==null;)e.alternate!==null&&(n=e),e=e.sibling;n===null?t.tail=null:n.sibling=null;break;case"collapsed":n=t.tail;for(var i=null;n!==null;)n.alternate!==null&&(i=n),n=n.sibling;i===null?e||t.tail===null?t.tail=null:t.tail.sibling=null:i.sibling=null}}function Kt(t){var e=t.alternate!==null&&t.alternate.child===t.child,n=0,i=0;if(e)for(var r=t.child;r!==null;)n|=r.lanes|r.childLanes,i|=r.subtreeFlags&14680064,i|=r.flags&14680064,r.return=t,r=r.sibling;else for(r=t.child;r!==null;)n|=r.lanes|r.childLanes,i|=r.subtreeFlags,i|=r.flags,r.return=t,r=r.sibling;return t.subtreeFlags|=i,t.childLanes=n,e}function oy(t,e,n){var i=e.pendingProps;switch(Dh(e),e.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Kt(e),null;case 1:return dn(e.type)&&Il(),Kt(e),null;case 3:return i=e.stateNode,Os(),ft(un),ft(Jt),zh(),i.pendingContext&&(i.context=i.pendingContext,i.pendingContext=null),(t===null||t.child===null)&&(ba(e)?e.flags|=4:t===null||t.memoizedState.isDehydrated&&!(e.flags&256)||(e.flags|=1024,Gn!==null&&(yd(Gn),Gn=null))),hd(t,e),Kt(e),null;case 5:Bh(e);var r=Rr($o.current);if(n=e.type,t!==null&&e.stateNode!=null)Y0(t,e,n,i,r),t.ref!==e.ref&&(e.flags|=512,e.flags|=2097152);else{if(!i){if(e.stateNode===null)throw Error(ie(166));return Kt(e),null}if(t=Rr(oi.current),ba(e)){i=e.stateNode,n=e.type;var s=e.memoizedProps;switch(i[ti]=e,i[Yo]=s,t=(e.mode&1)!==0,n){case"dialog":ht("cancel",i),ht("close",i);break;case"iframe":case"object":case"embed":ht("load",i);break;case"video":case"audio":for(r=0;r<Mo.length;r++)ht(Mo[r],i);break;case"source":ht("error",i);break;case"img":case"image":case"link":ht("error",i),ht("load",i);break;case"details":ht("toggle",i);break;case"input":Uf(i,s),ht("invalid",i);break;case"select":i._wrapperState={wasMultiple:!!s.multiple},ht("invalid",i);break;case"textarea":Of(i,s),ht("invalid",i)}Bu(n,s),r=null;for(var o in s)if(s.hasOwnProperty(o)){var a=s[o];o==="children"?typeof a=="string"?i.textContent!==a&&(s.suppressHydrationWarning!==!0&&Ca(i.textContent,a,t),r=["children",a]):typeof a=="number"&&i.textContent!==""+a&&(s.suppressHydrationWarning!==!0&&Ca(i.textContent,a,t),r=["children",""+a]):ko.hasOwnProperty(o)&&a!=null&&o==="onScroll"&&ht("scroll",i)}switch(n){case"input":_a(i),Ff(i,s,!0);break;case"textarea":_a(i),kf(i);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(i.onclick=Nl)}i=r,e.updateQueue=i,i!==null&&(e.flags|=4)}else{o=r.nodeType===9?r:r.ownerDocument,t==="http://www.w3.org/1999/xhtml"&&(t=Eg(n)),t==="http://www.w3.org/1999/xhtml"?n==="script"?(t=o.createElement("div"),t.innerHTML="<script><\/script>",t=t.removeChild(t.firstChild)):typeof i.is=="string"?t=o.createElement(n,{is:i.is}):(t=o.createElement(n),n==="select"&&(o=t,i.multiple?o.multiple=!0:i.size&&(o.size=i.size))):t=o.createElementNS(t,n),t[ti]=e,t[Yo]=i,K0(t,e,!1,!1),e.stateNode=t;e:{switch(o=zu(n,i),n){case"dialog":ht("cancel",t),ht("close",t),r=i;break;case"iframe":case"object":case"embed":ht("load",t),r=i;break;case"video":case"audio":for(r=0;r<Mo.length;r++)ht(Mo[r],t);r=i;break;case"source":ht("error",t),r=i;break;case"img":case"image":case"link":ht("error",t),ht("load",t),r=i;break;case"details":ht("toggle",t),r=i;break;case"input":Uf(t,i),r=Iu(t,i),ht("invalid",t);break;case"option":r=i;break;case"select":t._wrapperState={wasMultiple:!!i.multiple},r=yt({},i,{value:void 0}),ht("invalid",t);break;case"textarea":Of(t,i),r=Ou(t,i),ht("invalid",t);break;default:r=i}Bu(n,r),a=r;for(s in a)if(a.hasOwnProperty(s)){var l=a[s];s==="style"?Ag(t,l):s==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,l!=null&&wg(t,l)):s==="children"?typeof l=="string"?(n!=="textarea"||l!=="")&&Bo(t,l):typeof l=="number"&&Bo(t,""+l):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(ko.hasOwnProperty(s)?l!=null&&s==="onScroll"&&ht("scroll",t):l!=null&&gh(t,s,l,o))}switch(n){case"input":_a(t),Ff(t,i,!1);break;case"textarea":_a(t),kf(t);break;case"option":i.value!=null&&t.setAttribute("value",""+rr(i.value));break;case"select":t.multiple=!!i.multiple,s=i.value,s!=null?ws(t,!!i.multiple,s,!1):i.defaultValue!=null&&ws(t,!!i.multiple,i.defaultValue,!0);break;default:typeof r.onClick=="function"&&(t.onclick=Nl)}switch(n){case"button":case"input":case"select":case"textarea":i=!!i.autoFocus;break e;case"img":i=!0;break e;default:i=!1}}i&&(e.flags|=4)}e.ref!==null&&(e.flags|=512,e.flags|=2097152)}return Kt(e),null;case 6:if(t&&e.stateNode!=null)q0(t,e,t.memoizedProps,i);else{if(typeof i!="string"&&e.stateNode===null)throw Error(ie(166));if(n=Rr($o.current),Rr(oi.current),ba(e)){if(i=e.stateNode,n=e.memoizedProps,i[ti]=e,(s=i.nodeValue!==n)&&(t=Sn,t!==null))switch(t.tag){case 3:Ca(i.nodeValue,n,(t.mode&1)!==0);break;case 5:t.memoizedProps.suppressHydrationWarning!==!0&&Ca(i.nodeValue,n,(t.mode&1)!==0)}s&&(e.flags|=4)}else i=(n.nodeType===9?n:n.ownerDocument).createTextNode(i),i[ti]=e,e.stateNode=i}return Kt(e),null;case 13:if(ft(xt),i=e.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(pt&&_n!==null&&e.mode&1&&!(e.flags&128))f0(),Us(),e.flags|=98560,s=!1;else if(s=ba(e),i!==null&&i.dehydrated!==null){if(t===null){if(!s)throw Error(ie(318));if(s=e.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(ie(317));s[ti]=e}else Us(),!(e.flags&128)&&(e.memoizedState=null),e.flags|=4;Kt(e),s=!1}else Gn!==null&&(yd(Gn),Gn=null),s=!0;if(!s)return e.flags&65536?e:null}return e.flags&128?(e.lanes=n,e):(i=i!==null,i!==(t!==null&&t.memoizedState!==null)&&i&&(e.child.flags|=8192,e.mode&1&&(t===null||xt.current&1?Pt===0&&(Pt=3):Jh())),e.updateQueue!==null&&(e.flags|=4),Kt(e),null);case 4:return Os(),hd(t,e),t===null&&Xo(e.stateNode.containerInfo),Kt(e),null;case 10:return Uh(e.type._context),Kt(e),null;case 17:return dn(e.type)&&Il(),Kt(e),null;case 19:if(ft(xt),s=e.memoizedState,s===null)return Kt(e),null;if(i=(e.flags&128)!==0,o=s.rendering,o===null)if(i)lo(s,!1);else{if(Pt!==0||t!==null&&t.flags&128)for(t=e.child;t!==null;){if(o=Hl(t),o!==null){for(e.flags|=128,lo(s,!1),i=o.updateQueue,i!==null&&(e.updateQueue=i,e.flags|=4),e.subtreeFlags=0,i=n,n=e.child;n!==null;)s=n,t=i,s.flags&=14680066,o=s.alternate,o===null?(s.childLanes=0,s.lanes=t,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=o.childLanes,s.lanes=o.lanes,s.child=o.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=o.memoizedProps,s.memoizedState=o.memoizedState,s.updateQueue=o.updateQueue,s.type=o.type,t=o.dependencies,s.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),n=n.sibling;return ct(xt,xt.current&1|2),e.child}t=t.sibling}s.tail!==null&&wt()>Bs&&(e.flags|=128,i=!0,lo(s,!1),e.lanes=4194304)}else{if(!i)if(t=Hl(o),t!==null){if(e.flags|=128,i=!0,n=t.updateQueue,n!==null&&(e.updateQueue=n,e.flags|=4),lo(s,!0),s.tail===null&&s.tailMode==="hidden"&&!o.alternate&&!pt)return Kt(e),null}else 2*wt()-s.renderingStartTime>Bs&&n!==1073741824&&(e.flags|=128,i=!0,lo(s,!1),e.lanes=4194304);s.isBackwards?(o.sibling=e.child,e.child=o):(n=s.last,n!==null?n.sibling=o:e.child=o,s.last=o)}return s.tail!==null?(e=s.tail,s.rendering=e,s.tail=e.sibling,s.renderingStartTime=wt(),e.sibling=null,n=xt.current,ct(xt,i?n&1|2:n&1),e):(Kt(e),null);case 22:case 23:return Zh(),i=e.memoizedState!==null,t!==null&&t.memoizedState!==null!==i&&(e.flags|=8192),i&&e.mode&1?vn&1073741824&&(Kt(e),e.subtreeFlags&6&&(e.flags|=8192)):Kt(e),null;case 24:return null;case 25:return null}throw Error(ie(156,e.tag))}function ay(t,e){switch(Dh(e),e.tag){case 1:return dn(e.type)&&Il(),t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 3:return Os(),ft(un),ft(Jt),zh(),t=e.flags,t&65536&&!(t&128)?(e.flags=t&-65537|128,e):null;case 5:return Bh(e),null;case 13:if(ft(xt),t=e.memoizedState,t!==null&&t.dehydrated!==null){if(e.alternate===null)throw Error(ie(340));Us()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 19:return ft(xt),null;case 4:return Os(),null;case 10:return Uh(e.type._context),null;case 22:case 23:return Zh(),null;case 24:return null;default:return null}}var Da=!1,$t=!1,ly=typeof WeakSet=="function"?WeakSet:Set,me=null;function ys(t,e){var n=t.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(i){Mt(t,e,i)}else n.current=null}function fd(t,e,n){try{n()}catch(i){Mt(t,e,i)}}var Cp=!1;function cy(t,e){if($u=Pl,t=e0(),Rh(t)){if("selectionStart"in t)var n={start:t.selectionStart,end:t.selectionEnd};else e:{n=(n=t.ownerDocument)&&n.defaultView||window;var i=n.getSelection&&n.getSelection();if(i&&i.rangeCount!==0){n=i.anchorNode;var r=i.anchorOffset,s=i.focusNode;i=i.focusOffset;try{n.nodeType,s.nodeType}catch{n=null;break e}var o=0,a=-1,l=-1,c=0,u=0,h=t,f=null;t:for(;;){for(var p;h!==n||r!==0&&h.nodeType!==3||(a=o+r),h!==s||i!==0&&h.nodeType!==3||(l=o+i),h.nodeType===3&&(o+=h.nodeValue.length),(p=h.firstChild)!==null;)f=h,h=p;for(;;){if(h===t)break t;if(f===n&&++c===r&&(a=o),f===s&&++u===i&&(l=o),(p=h.nextSibling)!==null)break;h=f,f=h.parentNode}h=p}n=a===-1||l===-1?null:{start:a,end:l}}else n=null}n=n||{start:0,end:0}}else n=null;for(Zu={focusedElem:t,selectionRange:n},Pl=!1,me=e;me!==null;)if(e=me,t=e.child,(e.subtreeFlags&1028)!==0&&t!==null)t.return=e,me=t;else for(;me!==null;){e=me;try{var _=e.alternate;if(e.flags&1024)switch(e.tag){case 0:case 11:case 15:break;case 1:if(_!==null){var v=_.memoizedProps,m=_.memoizedState,d=e.stateNode,g=d.getSnapshotBeforeUpdate(e.elementType===e.type?v:Hn(e.type,v),m);d.__reactInternalSnapshotBeforeUpdate=g}break;case 3:var x=e.stateNode.containerInfo;x.nodeType===1?x.textContent="":x.nodeType===9&&x.documentElement&&x.removeChild(x.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(ie(163))}}catch(y){Mt(e,e.return,y)}if(t=e.sibling,t!==null){t.return=e.return,me=t;break}me=e.return}return _=Cp,Cp=!1,_}function Lo(t,e,n){var i=e.updateQueue;if(i=i!==null?i.lastEffect:null,i!==null){var r=i=i.next;do{if((r.tag&t)===t){var s=r.destroy;r.destroy=void 0,s!==void 0&&fd(e,n,s)}r=r.next}while(r!==i)}}function cc(t,e){if(e=e.updateQueue,e=e!==null?e.lastEffect:null,e!==null){var n=e=e.next;do{if((n.tag&t)===t){var i=n.create;n.destroy=i()}n=n.next}while(n!==e)}}function pd(t){var e=t.ref;if(e!==null){var n=t.stateNode;switch(t.tag){case 5:t=n;break;default:t=n}typeof e=="function"?e(t):e.current=t}}function $0(t){var e=t.alternate;e!==null&&(t.alternate=null,$0(e)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(e=t.stateNode,e!==null&&(delete e[ti],delete e[Yo],delete e[ed],delete e[j_],delete e[X_])),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}function Z0(t){return t.tag===5||t.tag===3||t.tag===4}function bp(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||Z0(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function md(t,e,n){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?n.nodeType===8?n.parentNode.insertBefore(t,e):n.insertBefore(t,e):(n.nodeType===8?(e=n.parentNode,e.insertBefore(t,n)):(e=n,e.appendChild(t)),n=n._reactRootContainer,n!=null||e.onclick!==null||(e.onclick=Nl));else if(i!==4&&(t=t.child,t!==null))for(md(t,e,n),t=t.sibling;t!==null;)md(t,e,n),t=t.sibling}function gd(t,e,n){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?n.insertBefore(t,e):n.appendChild(t);else if(i!==4&&(t=t.child,t!==null))for(gd(t,e,n),t=t.sibling;t!==null;)gd(t,e,n),t=t.sibling}var Bt=null,Vn=!1;function Li(t,e,n){for(n=n.child;n!==null;)J0(t,e,n),n=n.sibling}function J0(t,e,n){if(si&&typeof si.onCommitFiberUnmount=="function")try{si.onCommitFiberUnmount(tc,n)}catch{}switch(n.tag){case 5:$t||ys(n,e);case 6:var i=Bt,r=Vn;Bt=null,Li(t,e,n),Bt=i,Vn=r,Bt!==null&&(Vn?(t=Bt,n=n.stateNode,t.nodeType===8?t.parentNode.removeChild(n):t.removeChild(n)):Bt.removeChild(n.stateNode));break;case 18:Bt!==null&&(Vn?(t=Bt,n=n.stateNode,t.nodeType===8?Oc(t.parentNode,n):t.nodeType===1&&Oc(t,n),Go(t)):Oc(Bt,n.stateNode));break;case 4:i=Bt,r=Vn,Bt=n.stateNode.containerInfo,Vn=!0,Li(t,e,n),Bt=i,Vn=r;break;case 0:case 11:case 14:case 15:if(!$t&&(i=n.updateQueue,i!==null&&(i=i.lastEffect,i!==null))){r=i=i.next;do{var s=r,o=s.destroy;s=s.tag,o!==void 0&&(s&2||s&4)&&fd(n,e,o),r=r.next}while(r!==i)}Li(t,e,n);break;case 1:if(!$t&&(ys(n,e),i=n.stateNode,typeof i.componentWillUnmount=="function"))try{i.props=n.memoizedProps,i.state=n.memoizedState,i.componentWillUnmount()}catch(a){Mt(n,e,a)}Li(t,e,n);break;case 21:Li(t,e,n);break;case 22:n.mode&1?($t=(i=$t)||n.memoizedState!==null,Li(t,e,n),$t=i):Li(t,e,n);break;default:Li(t,e,n)}}function Rp(t){var e=t.updateQueue;if(e!==null){t.updateQueue=null;var n=t.stateNode;n===null&&(n=t.stateNode=new ly),e.forEach(function(i){var r=xy.bind(null,t,i);n.has(i)||(n.add(i),i.then(r,r))})}}function On(t,e){var n=e.deletions;if(n!==null)for(var i=0;i<n.length;i++){var r=n[i];try{var s=t,o=e,a=o;e:for(;a!==null;){switch(a.tag){case 5:Bt=a.stateNode,Vn=!1;break e;case 3:Bt=a.stateNode.containerInfo,Vn=!0;break e;case 4:Bt=a.stateNode.containerInfo,Vn=!0;break e}a=a.return}if(Bt===null)throw Error(ie(160));J0(s,o,r),Bt=null,Vn=!1;var l=r.alternate;l!==null&&(l.return=null),r.return=null}catch(c){Mt(r,e,c)}}if(e.subtreeFlags&12854)for(e=e.child;e!==null;)Q0(e,t),e=e.sibling}function Q0(t,e){var n=t.alternate,i=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:if(On(e,t),Zn(t),i&4){try{Lo(3,t,t.return),cc(3,t)}catch(v){Mt(t,t.return,v)}try{Lo(5,t,t.return)}catch(v){Mt(t,t.return,v)}}break;case 1:On(e,t),Zn(t),i&512&&n!==null&&ys(n,n.return);break;case 5:if(On(e,t),Zn(t),i&512&&n!==null&&ys(n,n.return),t.flags&32){var r=t.stateNode;try{Bo(r,"")}catch(v){Mt(t,t.return,v)}}if(i&4&&(r=t.stateNode,r!=null)){var s=t.memoizedProps,o=n!==null?n.memoizedProps:s,a=t.type,l=t.updateQueue;if(t.updateQueue=null,l!==null)try{a==="input"&&s.type==="radio"&&s.name!=null&&Sg(r,s),zu(a,o);var c=zu(a,s);for(o=0;o<l.length;o+=2){var u=l[o],h=l[o+1];u==="style"?Ag(r,h):u==="dangerouslySetInnerHTML"?wg(r,h):u==="children"?Bo(r,h):gh(r,u,h,c)}switch(a){case"input":Uu(r,s);break;case"textarea":Mg(r,s);break;case"select":var f=r._wrapperState.wasMultiple;r._wrapperState.wasMultiple=!!s.multiple;var p=s.value;p!=null?ws(r,!!s.multiple,p,!1):f!==!!s.multiple&&(s.defaultValue!=null?ws(r,!!s.multiple,s.defaultValue,!0):ws(r,!!s.multiple,s.multiple?[]:"",!1))}r[Yo]=s}catch(v){Mt(t,t.return,v)}}break;case 6:if(On(e,t),Zn(t),i&4){if(t.stateNode===null)throw Error(ie(162));r=t.stateNode,s=t.memoizedProps;try{r.nodeValue=s}catch(v){Mt(t,t.return,v)}}break;case 3:if(On(e,t),Zn(t),i&4&&n!==null&&n.memoizedState.isDehydrated)try{Go(e.containerInfo)}catch(v){Mt(t,t.return,v)}break;case 4:On(e,t),Zn(t);break;case 13:On(e,t),Zn(t),r=t.child,r.flags&8192&&(s=r.memoizedState!==null,r.stateNode.isHidden=s,!s||r.alternate!==null&&r.alternate.memoizedState!==null||(qh=wt())),i&4&&Rp(t);break;case 22:if(u=n!==null&&n.memoizedState!==null,t.mode&1?($t=(c=$t)||u,On(e,t),$t=c):On(e,t),Zn(t),i&8192){if(c=t.memoizedState!==null,(t.stateNode.isHidden=c)&&!u&&t.mode&1)for(me=t,u=t.child;u!==null;){for(h=me=u;me!==null;){switch(f=me,p=f.child,f.tag){case 0:case 11:case 14:case 15:Lo(4,f,f.return);break;case 1:ys(f,f.return);var _=f.stateNode;if(typeof _.componentWillUnmount=="function"){i=f,n=f.return;try{e=i,_.props=e.memoizedProps,_.state=e.memoizedState,_.componentWillUnmount()}catch(v){Mt(i,n,v)}}break;case 5:ys(f,f.return);break;case 22:if(f.memoizedState!==null){Dp(h);continue}}p!==null?(p.return=f,me=p):Dp(h)}u=u.sibling}e:for(u=null,h=t;;){if(h.tag===5){if(u===null){u=h;try{r=h.stateNode,c?(s=r.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(a=h.stateNode,l=h.memoizedProps.style,o=l!=null&&l.hasOwnProperty("display")?l.display:null,a.style.display=Tg("display",o))}catch(v){Mt(t,t.return,v)}}}else if(h.tag===6){if(u===null)try{h.stateNode.nodeValue=c?"":h.memoizedProps}catch(v){Mt(t,t.return,v)}}else if((h.tag!==22&&h.tag!==23||h.memoizedState===null||h===t)&&h.child!==null){h.child.return=h,h=h.child;continue}if(h===t)break e;for(;h.sibling===null;){if(h.return===null||h.return===t)break e;u===h&&(u=null),h=h.return}u===h&&(u=null),h.sibling.return=h.return,h=h.sibling}}break;case 19:On(e,t),Zn(t),i&4&&Rp(t);break;case 21:break;default:On(e,t),Zn(t)}}function Zn(t){var e=t.flags;if(e&2){try{e:{for(var n=t.return;n!==null;){if(Z0(n)){var i=n;break e}n=n.return}throw Error(ie(160))}switch(i.tag){case 5:var r=i.stateNode;i.flags&32&&(Bo(r,""),i.flags&=-33);var s=bp(t);gd(t,s,r);break;case 3:case 4:var o=i.stateNode.containerInfo,a=bp(t);md(t,a,o);break;default:throw Error(ie(161))}}catch(l){Mt(t,t.return,l)}t.flags&=-3}e&4096&&(t.flags&=-4097)}function uy(t,e,n){me=t,ev(t)}function ev(t,e,n){for(var i=(t.mode&1)!==0;me!==null;){var r=me,s=r.child;if(r.tag===22&&i){var o=r.memoizedState!==null||Da;if(!o){var a=r.alternate,l=a!==null&&a.memoizedState!==null||$t;a=Da;var c=$t;if(Da=o,($t=l)&&!c)for(me=r;me!==null;)o=me,l=o.child,o.tag===22&&o.memoizedState!==null?Lp(r):l!==null?(l.return=o,me=l):Lp(r);for(;s!==null;)me=s,ev(s),s=s.sibling;me=r,Da=a,$t=c}Pp(t)}else r.subtreeFlags&8772&&s!==null?(s.return=r,me=s):Pp(t)}}function Pp(t){for(;me!==null;){var e=me;if(e.flags&8772){var n=e.alternate;try{if(e.flags&8772)switch(e.tag){case 0:case 11:case 15:$t||cc(5,e);break;case 1:var i=e.stateNode;if(e.flags&4&&!$t)if(n===null)i.componentDidMount();else{var r=e.elementType===e.type?n.memoizedProps:Hn(e.type,n.memoizedProps);i.componentDidUpdate(r,n.memoizedState,i.__reactInternalSnapshotBeforeUpdate)}var s=e.updateQueue;s!==null&&pp(e,s,i);break;case 3:var o=e.updateQueue;if(o!==null){if(n=null,e.child!==null)switch(e.child.tag){case 5:n=e.child.stateNode;break;case 1:n=e.child.stateNode}pp(e,o,n)}break;case 5:var a=e.stateNode;if(n===null&&e.flags&4){n=a;var l=e.memoizedProps;switch(e.type){case"button":case"input":case"select":case"textarea":l.autoFocus&&n.focus();break;case"img":l.src&&(n.src=l.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(e.memoizedState===null){var c=e.alternate;if(c!==null){var u=c.memoizedState;if(u!==null){var h=u.dehydrated;h!==null&&Go(h)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(ie(163))}$t||e.flags&512&&pd(e)}catch(f){Mt(e,e.return,f)}}if(e===t){me=null;break}if(n=e.sibling,n!==null){n.return=e.return,me=n;break}me=e.return}}function Dp(t){for(;me!==null;){var e=me;if(e===t){me=null;break}var n=e.sibling;if(n!==null){n.return=e.return,me=n;break}me=e.return}}function Lp(t){for(;me!==null;){var e=me;try{switch(e.tag){case 0:case 11:case 15:var n=e.return;try{cc(4,e)}catch(l){Mt(e,n,l)}break;case 1:var i=e.stateNode;if(typeof i.componentDidMount=="function"){var r=e.return;try{i.componentDidMount()}catch(l){Mt(e,r,l)}}var s=e.return;try{pd(e)}catch(l){Mt(e,s,l)}break;case 5:var o=e.return;try{pd(e)}catch(l){Mt(e,o,l)}}}catch(l){Mt(e,e.return,l)}if(e===t){me=null;break}var a=e.sibling;if(a!==null){a.return=e.return,me=a;break}me=e.return}}var dy=Math.ceil,Wl=Ri.ReactCurrentDispatcher,Kh=Ri.ReactCurrentOwner,Ln=Ri.ReactCurrentBatchConfig,qe=0,Ot=null,Ct=null,Ht=0,vn=0,Ss=lr(0),Pt=0,ea=null,Or=0,uc=0,Yh=0,No=null,ln=null,qh=0,Bs=1/0,gi=null,jl=!1,vd=null,Qi=null,La=!1,Ki=null,Xl=0,Io=0,xd=null,gl=-1,vl=0;function rn(){return qe&6?wt():gl!==-1?gl:gl=wt()}function er(t){return t.mode&1?qe&2&&Ht!==0?Ht&-Ht:Y_.transition!==null?(vl===0&&(vl=kg()),vl):(t=tt,t!==0||(t=window.event,t=t===void 0?16:jg(t.type)),t):1}function Yn(t,e,n,i){if(50<Io)throw Io=0,xd=null,Error(ie(185));aa(t,n,i),(!(qe&2)||t!==Ot)&&(t===Ot&&(!(qe&2)&&(uc|=n),Pt===4&&Wi(t,Ht)),hn(t,i),n===1&&qe===0&&!(e.mode&1)&&(Bs=wt()+500,oc&&cr()))}function hn(t,e){var n=t.callbackNode;Yx(t,e);var i=Rl(t,t===Ot?Ht:0);if(i===0)n!==null&&Hf(n),t.callbackNode=null,t.callbackPriority=0;else if(e=i&-i,t.callbackPriority!==e){if(n!=null&&Hf(n),e===1)t.tag===0?K_(Np.bind(null,t)):u0(Np.bind(null,t)),G_(function(){!(qe&6)&&cr()}),n=null;else{switch(Bg(i)){case 1:n=Sh;break;case 4:n=Fg;break;case 16:n=bl;break;case 536870912:n=Og;break;default:n=bl}n=lv(n,tv.bind(null,t))}t.callbackPriority=e,t.callbackNode=n}}function tv(t,e){if(gl=-1,vl=0,qe&6)throw Error(ie(327));var n=t.callbackNode;if(Rs()&&t.callbackNode!==n)return null;var i=Rl(t,t===Ot?Ht:0);if(i===0)return null;if(i&30||i&t.expiredLanes||e)e=Kl(t,i);else{e=i;var r=qe;qe|=2;var s=iv();(Ot!==t||Ht!==e)&&(gi=null,Bs=wt()+500,Pr(t,e));do try{py();break}catch(a){nv(t,a)}while(!0);Ih(),Wl.current=s,qe=r,Ct!==null?e=0:(Ot=null,Ht=0,e=Pt)}if(e!==0){if(e===2&&(r=ju(t),r!==0&&(i=r,e=_d(t,r))),e===1)throw n=ea,Pr(t,0),Wi(t,i),hn(t,wt()),n;if(e===6)Wi(t,i);else{if(r=t.current.alternate,!(i&30)&&!hy(r)&&(e=Kl(t,i),e===2&&(s=ju(t),s!==0&&(i=s,e=_d(t,s))),e===1))throw n=ea,Pr(t,0),Wi(t,i),hn(t,wt()),n;switch(t.finishedWork=r,t.finishedLanes=i,e){case 0:case 1:throw Error(ie(345));case 2:_r(t,ln,gi);break;case 3:if(Wi(t,i),(i&130023424)===i&&(e=qh+500-wt(),10<e)){if(Rl(t,0)!==0)break;if(r=t.suspendedLanes,(r&i)!==i){rn(),t.pingedLanes|=t.suspendedLanes&r;break}t.timeoutHandle=Qu(_r.bind(null,t,ln,gi),e);break}_r(t,ln,gi);break;case 4:if(Wi(t,i),(i&4194240)===i)break;for(e=t.eventTimes,r=-1;0<i;){var o=31-Kn(i);s=1<<o,o=e[o],o>r&&(r=o),i&=~s}if(i=r,i=wt()-i,i=(120>i?120:480>i?480:1080>i?1080:1920>i?1920:3e3>i?3e3:4320>i?4320:1960*dy(i/1960))-i,10<i){t.timeoutHandle=Qu(_r.bind(null,t,ln,gi),i);break}_r(t,ln,gi);break;case 5:_r(t,ln,gi);break;default:throw Error(ie(329))}}}return hn(t,wt()),t.callbackNode===n?tv.bind(null,t):null}function _d(t,e){var n=No;return t.current.memoizedState.isDehydrated&&(Pr(t,e).flags|=256),t=Kl(t,e),t!==2&&(e=ln,ln=n,e!==null&&yd(e)),t}function yd(t){ln===null?ln=t:ln.push.apply(ln,t)}function hy(t){for(var e=t;;){if(e.flags&16384){var n=e.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var i=0;i<n.length;i++){var r=n[i],s=r.getSnapshot;r=r.value;try{if(!qn(s(),r))return!1}catch{return!1}}}if(n=e.child,e.subtreeFlags&16384&&n!==null)n.return=e,e=n;else{if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function Wi(t,e){for(e&=~Yh,e&=~uc,t.suspendedLanes|=e,t.pingedLanes&=~e,t=t.expirationTimes;0<e;){var n=31-Kn(e),i=1<<n;t[n]=-1,e&=~i}}function Np(t){if(qe&6)throw Error(ie(327));Rs();var e=Rl(t,0);if(!(e&1))return hn(t,wt()),null;var n=Kl(t,e);if(t.tag!==0&&n===2){var i=ju(t);i!==0&&(e=i,n=_d(t,i))}if(n===1)throw n=ea,Pr(t,0),Wi(t,e),hn(t,wt()),n;if(n===6)throw Error(ie(345));return t.finishedWork=t.current.alternate,t.finishedLanes=e,_r(t,ln,gi),hn(t,wt()),null}function $h(t,e){var n=qe;qe|=1;try{return t(e)}finally{qe=n,qe===0&&(Bs=wt()+500,oc&&cr())}}function kr(t){Ki!==null&&Ki.tag===0&&!(qe&6)&&Rs();var e=qe;qe|=1;var n=Ln.transition,i=tt;try{if(Ln.transition=null,tt=1,t)return t()}finally{tt=i,Ln.transition=n,qe=e,!(qe&6)&&cr()}}function Zh(){vn=Ss.current,ft(Ss)}function Pr(t,e){t.finishedWork=null,t.finishedLanes=0;var n=t.timeoutHandle;if(n!==-1&&(t.timeoutHandle=-1,V_(n)),Ct!==null)for(n=Ct.return;n!==null;){var i=n;switch(Dh(i),i.tag){case 1:i=i.type.childContextTypes,i!=null&&Il();break;case 3:Os(),ft(un),ft(Jt),zh();break;case 5:Bh(i);break;case 4:Os();break;case 13:ft(xt);break;case 19:ft(xt);break;case 10:Uh(i.type._context);break;case 22:case 23:Zh()}n=n.return}if(Ot=t,Ct=t=tr(t.current,null),Ht=vn=e,Pt=0,ea=null,Yh=uc=Or=0,ln=No=null,br!==null){for(e=0;e<br.length;e++)if(n=br[e],i=n.interleaved,i!==null){n.interleaved=null;var r=i.next,s=n.pending;if(s!==null){var o=s.next;s.next=r,i.next=o}n.pending=i}br=null}return t}function nv(t,e){do{var n=Ct;try{if(Ih(),fl.current=Gl,Vl){for(var i=_t.memoizedState;i!==null;){var r=i.queue;r!==null&&(r.pending=null),i=i.next}Vl=!1}if(Fr=0,Ft=Rt=_t=null,Do=!1,Zo=0,Kh.current=null,n===null||n.return===null){Pt=1,ea=e,Ct=null;break}e:{var s=t,o=n.return,a=n,l=e;if(e=Ht,a.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){var c=l,u=a,h=u.tag;if(!(u.mode&1)&&(h===0||h===11||h===15)){var f=u.alternate;f?(u.updateQueue=f.updateQueue,u.memoizedState=f.memoizedState,u.lanes=f.lanes):(u.updateQueue=null,u.memoizedState=null)}var p=yp(o);if(p!==null){p.flags&=-257,Sp(p,o,a,s,e),p.mode&1&&_p(s,c,e),e=p,l=c;var _=e.updateQueue;if(_===null){var v=new Set;v.add(l),e.updateQueue=v}else _.add(l);break e}else{if(!(e&1)){_p(s,c,e),Jh();break e}l=Error(ie(426))}}else if(pt&&a.mode&1){var m=yp(o);if(m!==null){!(m.flags&65536)&&(m.flags|=256),Sp(m,o,a,s,e),Lh(ks(l,a));break e}}s=l=ks(l,a),Pt!==4&&(Pt=2),No===null?No=[s]:No.push(s),s=o;do{switch(s.tag){case 3:s.flags|=65536,e&=-e,s.lanes|=e;var d=B0(s,l,e);fp(s,d);break e;case 1:a=l;var g=s.type,x=s.stateNode;if(!(s.flags&128)&&(typeof g.getDerivedStateFromError=="function"||x!==null&&typeof x.componentDidCatch=="function"&&(Qi===null||!Qi.has(x)))){s.flags|=65536,e&=-e,s.lanes|=e;var y=z0(s,a,e);fp(s,y);break e}}s=s.return}while(s!==null)}sv(n)}catch(R){e=R,Ct===n&&n!==null&&(Ct=n=n.return);continue}break}while(!0)}function iv(){var t=Wl.current;return Wl.current=Gl,t===null?Gl:t}function Jh(){(Pt===0||Pt===3||Pt===2)&&(Pt=4),Ot===null||!(Or&268435455)&&!(uc&268435455)||Wi(Ot,Ht)}function Kl(t,e){var n=qe;qe|=2;var i=iv();(Ot!==t||Ht!==e)&&(gi=null,Pr(t,e));do try{fy();break}catch(r){nv(t,r)}while(!0);if(Ih(),qe=n,Wl.current=i,Ct!==null)throw Error(ie(261));return Ot=null,Ht=0,Pt}function fy(){for(;Ct!==null;)rv(Ct)}function py(){for(;Ct!==null&&!Bx();)rv(Ct)}function rv(t){var e=av(t.alternate,t,vn);t.memoizedProps=t.pendingProps,e===null?sv(t):Ct=e,Kh.current=null}function sv(t){var e=t;do{var n=e.alternate;if(t=e.return,e.flags&32768){if(n=ay(n,e),n!==null){n.flags&=32767,Ct=n;return}if(t!==null)t.flags|=32768,t.subtreeFlags=0,t.deletions=null;else{Pt=6,Ct=null;return}}else if(n=oy(n,e,vn),n!==null){Ct=n;return}if(e=e.sibling,e!==null){Ct=e;return}Ct=e=t}while(e!==null);Pt===0&&(Pt=5)}function _r(t,e,n){var i=tt,r=Ln.transition;try{Ln.transition=null,tt=1,my(t,e,n,i)}finally{Ln.transition=r,tt=i}return null}function my(t,e,n,i){do Rs();while(Ki!==null);if(qe&6)throw Error(ie(327));n=t.finishedWork;var r=t.finishedLanes;if(n===null)return null;if(t.finishedWork=null,t.finishedLanes=0,n===t.current)throw Error(ie(177));t.callbackNode=null,t.callbackPriority=0;var s=n.lanes|n.childLanes;if(qx(t,s),t===Ot&&(Ct=Ot=null,Ht=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||La||(La=!0,lv(bl,function(){return Rs(),null})),s=(n.flags&15990)!==0,n.subtreeFlags&15990||s){s=Ln.transition,Ln.transition=null;var o=tt;tt=1;var a=qe;qe|=4,Kh.current=null,cy(t,n),Q0(n,t),U_(Zu),Pl=!!$u,Zu=$u=null,t.current=n,uy(n),zx(),qe=a,tt=o,Ln.transition=s}else t.current=n;if(La&&(La=!1,Ki=t,Xl=r),s=t.pendingLanes,s===0&&(Qi=null),Gx(n.stateNode),hn(t,wt()),e!==null)for(i=t.onRecoverableError,n=0;n<e.length;n++)r=e[n],i(r.value,{componentStack:r.stack,digest:r.digest});if(jl)throw jl=!1,t=vd,vd=null,t;return Xl&1&&t.tag!==0&&Rs(),s=t.pendingLanes,s&1?t===xd?Io++:(Io=0,xd=t):Io=0,cr(),null}function Rs(){if(Ki!==null){var t=Bg(Xl),e=Ln.transition,n=tt;try{if(Ln.transition=null,tt=16>t?16:t,Ki===null)var i=!1;else{if(t=Ki,Ki=null,Xl=0,qe&6)throw Error(ie(331));var r=qe;for(qe|=4,me=t.current;me!==null;){var s=me,o=s.child;if(me.flags&16){var a=s.deletions;if(a!==null){for(var l=0;l<a.length;l++){var c=a[l];for(me=c;me!==null;){var u=me;switch(u.tag){case 0:case 11:case 15:Lo(8,u,s)}var h=u.child;if(h!==null)h.return=u,me=h;else for(;me!==null;){u=me;var f=u.sibling,p=u.return;if($0(u),u===c){me=null;break}if(f!==null){f.return=p,me=f;break}me=p}}}var _=s.alternate;if(_!==null){var v=_.child;if(v!==null){_.child=null;do{var m=v.sibling;v.sibling=null,v=m}while(v!==null)}}me=s}}if(s.subtreeFlags&2064&&o!==null)o.return=s,me=o;else e:for(;me!==null;){if(s=me,s.flags&2048)switch(s.tag){case 0:case 11:case 15:Lo(9,s,s.return)}var d=s.sibling;if(d!==null){d.return=s.return,me=d;break e}me=s.return}}var g=t.current;for(me=g;me!==null;){o=me;var x=o.child;if(o.subtreeFlags&2064&&x!==null)x.return=o,me=x;else e:for(o=g;me!==null;){if(a=me,a.flags&2048)try{switch(a.tag){case 0:case 11:case 15:cc(9,a)}}catch(R){Mt(a,a.return,R)}if(a===o){me=null;break e}var y=a.sibling;if(y!==null){y.return=a.return,me=y;break e}me=a.return}}if(qe=r,cr(),si&&typeof si.onPostCommitFiberRoot=="function")try{si.onPostCommitFiberRoot(tc,t)}catch{}i=!0}return i}finally{tt=n,Ln.transition=e}}return!1}function Ip(t,e,n){e=ks(n,e),e=B0(t,e,1),t=Ji(t,e,1),e=rn(),t!==null&&(aa(t,1,e),hn(t,e))}function Mt(t,e,n){if(t.tag===3)Ip(t,t,n);else for(;e!==null;){if(e.tag===3){Ip(e,t,n);break}else if(e.tag===1){var i=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof i.componentDidCatch=="function"&&(Qi===null||!Qi.has(i))){t=ks(n,t),t=z0(e,t,1),e=Ji(e,t,1),t=rn(),e!==null&&(aa(e,1,t),hn(e,t));break}}e=e.return}}function gy(t,e,n){var i=t.pingCache;i!==null&&i.delete(e),e=rn(),t.pingedLanes|=t.suspendedLanes&n,Ot===t&&(Ht&n)===n&&(Pt===4||Pt===3&&(Ht&130023424)===Ht&&500>wt()-qh?Pr(t,0):Yh|=n),hn(t,e)}function ov(t,e){e===0&&(t.mode&1?(e=Ma,Ma<<=1,!(Ma&130023424)&&(Ma=4194304)):e=1);var n=rn();t=Ai(t,e),t!==null&&(aa(t,e,n),hn(t,n))}function vy(t){var e=t.memoizedState,n=0;e!==null&&(n=e.retryLane),ov(t,n)}function xy(t,e){var n=0;switch(t.tag){case 13:var i=t.stateNode,r=t.memoizedState;r!==null&&(n=r.retryLane);break;case 19:i=t.stateNode;break;default:throw Error(ie(314))}i!==null&&i.delete(e),ov(t,n)}var av;av=function(t,e,n){if(t!==null)if(t.memoizedProps!==e.pendingProps||un.current)cn=!0;else{if(!(t.lanes&n)&&!(e.flags&128))return cn=!1,sy(t,e,n);cn=!!(t.flags&131072)}else cn=!1,pt&&e.flags&1048576&&d0(e,Ol,e.index);switch(e.lanes=0,e.tag){case 2:var i=e.type;ml(t,e),t=e.pendingProps;var r=Is(e,Jt.current);bs(e,n),r=Vh(null,e,i,t,r,n);var s=Gh();return e.flags|=1,typeof r=="object"&&r!==null&&typeof r.render=="function"&&r.$$typeof===void 0?(e.tag=1,e.memoizedState=null,e.updateQueue=null,dn(i)?(s=!0,Ul(e)):s=!1,e.memoizedState=r.state!==null&&r.state!==void 0?r.state:null,Oh(e),r.updater=lc,e.stateNode=r,r._reactInternals=e,od(e,i,t,n),e=cd(null,e,i,!0,s,n)):(e.tag=0,pt&&s&&Ph(e),nn(null,e,r,n),e=e.child),e;case 16:i=e.elementType;e:{switch(ml(t,e),t=e.pendingProps,r=i._init,i=r(i._payload),e.type=i,r=e.tag=yy(i),t=Hn(i,t),r){case 0:e=ld(null,e,i,t,n);break e;case 1:e=wp(null,e,i,t,n);break e;case 11:e=Mp(null,e,i,t,n);break e;case 14:e=Ep(null,e,i,Hn(i.type,t),n);break e}throw Error(ie(306,i,""))}return e;case 0:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Hn(i,r),ld(t,e,i,r,n);case 1:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Hn(i,r),wp(t,e,i,r,n);case 3:e:{if(W0(e),t===null)throw Error(ie(387));i=e.pendingProps,s=e.memoizedState,r=s.element,v0(t,e),zl(e,i,null,n);var o=e.memoizedState;if(i=o.element,s.isDehydrated)if(s={element:i,isDehydrated:!1,cache:o.cache,pendingSuspenseBoundaries:o.pendingSuspenseBoundaries,transitions:o.transitions},e.updateQueue.baseState=s,e.memoizedState=s,e.flags&256){r=ks(Error(ie(423)),e),e=Tp(t,e,i,n,r);break e}else if(i!==r){r=ks(Error(ie(424)),e),e=Tp(t,e,i,n,r);break e}else for(_n=Zi(e.stateNode.containerInfo.firstChild),Sn=e,pt=!0,Gn=null,n=m0(e,null,i,n),e.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(Us(),i===r){e=Ci(t,e,n);break e}nn(t,e,i,n)}e=e.child}return e;case 5:return x0(e),t===null&&id(e),i=e.type,r=e.pendingProps,s=t!==null?t.memoizedProps:null,o=r.children,Ju(i,r)?o=null:s!==null&&Ju(i,s)&&(e.flags|=32),G0(t,e),nn(t,e,o,n),e.child;case 6:return t===null&&id(e),null;case 13:return j0(t,e,n);case 4:return kh(e,e.stateNode.containerInfo),i=e.pendingProps,t===null?e.child=Fs(e,null,i,n):nn(t,e,i,n),e.child;case 11:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Hn(i,r),Mp(t,e,i,r,n);case 7:return nn(t,e,e.pendingProps,n),e.child;case 8:return nn(t,e,e.pendingProps.children,n),e.child;case 12:return nn(t,e,e.pendingProps.children,n),e.child;case 10:e:{if(i=e.type._context,r=e.pendingProps,s=e.memoizedProps,o=r.value,ct(kl,i._currentValue),i._currentValue=o,s!==null)if(qn(s.value,o)){if(s.children===r.children&&!un.current){e=Ci(t,e,n);break e}}else for(s=e.child,s!==null&&(s.return=e);s!==null;){var a=s.dependencies;if(a!==null){o=s.child;for(var l=a.firstContext;l!==null;){if(l.context===i){if(s.tag===1){l=Si(-1,n&-n),l.tag=2;var c=s.updateQueue;if(c!==null){c=c.shared;var u=c.pending;u===null?l.next=l:(l.next=u.next,u.next=l),c.pending=l}}s.lanes|=n,l=s.alternate,l!==null&&(l.lanes|=n),rd(s.return,n,e),a.lanes|=n;break}l=l.next}}else if(s.tag===10)o=s.type===e.type?null:s.child;else if(s.tag===18){if(o=s.return,o===null)throw Error(ie(341));o.lanes|=n,a=o.alternate,a!==null&&(a.lanes|=n),rd(o,n,e),o=s.sibling}else o=s.child;if(o!==null)o.return=s;else for(o=s;o!==null;){if(o===e){o=null;break}if(s=o.sibling,s!==null){s.return=o.return,o=s;break}o=o.return}s=o}nn(t,e,r.children,n),e=e.child}return e;case 9:return r=e.type,i=e.pendingProps.children,bs(e,n),r=Nn(r),i=i(r),e.flags|=1,nn(t,e,i,n),e.child;case 14:return i=e.type,r=Hn(i,e.pendingProps),r=Hn(i.type,r),Ep(t,e,i,r,n);case 15:return H0(t,e,e.type,e.pendingProps,n);case 17:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Hn(i,r),ml(t,e),e.tag=1,dn(i)?(t=!0,Ul(e)):t=!1,bs(e,n),k0(e,i,r),od(e,i,r,n),cd(null,e,i,!0,t,n);case 19:return X0(t,e,n);case 22:return V0(t,e,n)}throw Error(ie(156,e.tag))};function lv(t,e){return Ug(t,e)}function _y(t,e,n,i){this.tag=t,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=i,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Dn(t,e,n,i){return new _y(t,e,n,i)}function Qh(t){return t=t.prototype,!(!t||!t.isReactComponent)}function yy(t){if(typeof t=="function")return Qh(t)?1:0;if(t!=null){if(t=t.$$typeof,t===xh)return 11;if(t===_h)return 14}return 2}function tr(t,e){var n=t.alternate;return n===null?(n=Dn(t.tag,e,t.key,t.mode),n.elementType=t.elementType,n.type=t.type,n.stateNode=t.stateNode,n.alternate=t,t.alternate=n):(n.pendingProps=e,n.type=t.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=t.flags&14680064,n.childLanes=t.childLanes,n.lanes=t.lanes,n.child=t.child,n.memoizedProps=t.memoizedProps,n.memoizedState=t.memoizedState,n.updateQueue=t.updateQueue,e=t.dependencies,n.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},n.sibling=t.sibling,n.index=t.index,n.ref=t.ref,n}function xl(t,e,n,i,r,s){var o=2;if(i=t,typeof t=="function")Qh(t)&&(o=1);else if(typeof t=="string")o=5;else e:switch(t){case ds:return Dr(n.children,r,s,e);case vh:o=8,r|=8;break;case Pu:return t=Dn(12,n,e,r|2),t.elementType=Pu,t.lanes=s,t;case Du:return t=Dn(13,n,e,r),t.elementType=Du,t.lanes=s,t;case Lu:return t=Dn(19,n,e,r),t.elementType=Lu,t.lanes=s,t;case xg:return dc(n,r,s,e);default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case gg:o=10;break e;case vg:o=9;break e;case xh:o=11;break e;case _h:o=14;break e;case Bi:o=16,i=null;break e}throw Error(ie(130,t==null?t:typeof t,""))}return e=Dn(o,n,e,r),e.elementType=t,e.type=i,e.lanes=s,e}function Dr(t,e,n,i){return t=Dn(7,t,i,e),t.lanes=n,t}function dc(t,e,n,i){return t=Dn(22,t,i,e),t.elementType=xg,t.lanes=n,t.stateNode={isHidden:!1},t}function jc(t,e,n){return t=Dn(6,t,null,e),t.lanes=n,t}function Xc(t,e,n){return e=Dn(4,t.children!==null?t.children:[],t.key,e),e.lanes=n,e.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},e}function Sy(t,e,n,i,r){this.tag=e,this.containerInfo=t,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Ac(0),this.expirationTimes=Ac(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Ac(0),this.identifierPrefix=i,this.onRecoverableError=r,this.mutableSourceEagerHydrationData=null}function ef(t,e,n,i,r,s,o,a,l){return t=new Sy(t,e,n,a,l),e===1?(e=1,s===!0&&(e|=8)):e=0,s=Dn(3,null,null,e),t.current=s,s.stateNode=t,s.memoizedState={element:i,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},Oh(s),t}function My(t,e,n){var i=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:us,key:i==null?null:""+i,children:t,containerInfo:e,implementation:n}}function cv(t){if(!t)return sr;t=t._reactInternals;e:{if(Vr(t)!==t||t.tag!==1)throw Error(ie(170));var e=t;do{switch(e.tag){case 3:e=e.stateNode.context;break e;case 1:if(dn(e.type)){e=e.stateNode.__reactInternalMemoizedMergedChildContext;break e}}e=e.return}while(e!==null);throw Error(ie(171))}if(t.tag===1){var n=t.type;if(dn(n))return c0(t,n,e)}return e}function uv(t,e,n,i,r,s,o,a,l){return t=ef(n,i,!0,t,r,s,o,a,l),t.context=cv(null),n=t.current,i=rn(),r=er(n),s=Si(i,r),s.callback=e??null,Ji(n,s,r),t.current.lanes=r,aa(t,r,i),hn(t,i),t}function hc(t,e,n,i){var r=e.current,s=rn(),o=er(r);return n=cv(n),e.context===null?e.context=n:e.pendingContext=n,e=Si(s,o),e.payload={element:t},i=i===void 0?null:i,i!==null&&(e.callback=i),t=Ji(r,e,o),t!==null&&(Yn(t,r,o,s),hl(t,r,o)),o}function Yl(t){if(t=t.current,!t.child)return null;switch(t.child.tag){case 5:return t.child.stateNode;default:return t.child.stateNode}}function Up(t,e){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var n=t.retryLane;t.retryLane=n!==0&&n<e?n:e}}function tf(t,e){Up(t,e),(t=t.alternate)&&Up(t,e)}function Ey(){return null}var dv=typeof reportError=="function"?reportError:function(t){console.error(t)};function nf(t){this._internalRoot=t}fc.prototype.render=nf.prototype.render=function(t){var e=this._internalRoot;if(e===null)throw Error(ie(409));hc(t,e,null,null)};fc.prototype.unmount=nf.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var e=t.containerInfo;kr(function(){hc(null,t,null,null)}),e[Ti]=null}};function fc(t){this._internalRoot=t}fc.prototype.unstable_scheduleHydration=function(t){if(t){var e=Vg();t={blockedOn:null,target:t,priority:e};for(var n=0;n<Gi.length&&e!==0&&e<Gi[n].priority;n++);Gi.splice(n,0,t),n===0&&Wg(t)}};function rf(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function pc(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11&&(t.nodeType!==8||t.nodeValue!==" react-mount-point-unstable "))}function Fp(){}function wy(t,e,n,i,r){if(r){if(typeof i=="function"){var s=i;i=function(){var c=Yl(o);s.call(c)}}var o=uv(e,i,t,0,null,!1,!1,"",Fp);return t._reactRootContainer=o,t[Ti]=o.current,Xo(t.nodeType===8?t.parentNode:t),kr(),o}for(;r=t.lastChild;)t.removeChild(r);if(typeof i=="function"){var a=i;i=function(){var c=Yl(l);a.call(c)}}var l=ef(t,0,!1,null,null,!1,!1,"",Fp);return t._reactRootContainer=l,t[Ti]=l.current,Xo(t.nodeType===8?t.parentNode:t),kr(function(){hc(e,l,n,i)}),l}function mc(t,e,n,i,r){var s=n._reactRootContainer;if(s){var o=s;if(typeof r=="function"){var a=r;r=function(){var l=Yl(o);a.call(l)}}hc(e,o,t,r)}else o=wy(n,e,t,r,i);return Yl(o)}zg=function(t){switch(t.tag){case 3:var e=t.stateNode;if(e.current.memoizedState.isDehydrated){var n=So(e.pendingLanes);n!==0&&(Mh(e,n|1),hn(e,wt()),!(qe&6)&&(Bs=wt()+500,cr()))}break;case 13:kr(function(){var i=Ai(t,1);if(i!==null){var r=rn();Yn(i,t,1,r)}}),tf(t,1)}};Eh=function(t){if(t.tag===13){var e=Ai(t,134217728);if(e!==null){var n=rn();Yn(e,t,134217728,n)}tf(t,134217728)}};Hg=function(t){if(t.tag===13){var e=er(t),n=Ai(t,e);if(n!==null){var i=rn();Yn(n,t,e,i)}tf(t,e)}};Vg=function(){return tt};Gg=function(t,e){var n=tt;try{return tt=t,e()}finally{tt=n}};Vu=function(t,e,n){switch(e){case"input":if(Uu(t,n),e=n.name,n.type==="radio"&&e!=null){for(n=t;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+e)+'][type="radio"]'),e=0;e<n.length;e++){var i=n[e];if(i!==t&&i.form===t.form){var r=sc(i);if(!r)throw Error(ie(90));yg(i),Uu(i,r)}}}break;case"textarea":Mg(t,n);break;case"select":e=n.value,e!=null&&ws(t,!!n.multiple,e,!1)}};Rg=$h;Pg=kr;var Ty={usingClientEntryPoint:!1,Events:[ca,ms,sc,Cg,bg,$h]},co={findFiberByHostInstance:Cr,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Ay={bundleType:co.bundleType,version:co.version,rendererPackageName:co.rendererPackageName,rendererConfig:co.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Ri.ReactCurrentDispatcher,findHostInstanceByFiber:function(t){return t=Ng(t),t===null?null:t.stateNode},findFiberByHostInstance:co.findFiberByHostInstance||Ey,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Na=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Na.isDisabled&&Na.supportsFiber)try{tc=Na.inject(Ay),si=Na}catch{}}wn.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Ty;wn.createPortal=function(t,e){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!rf(e))throw Error(ie(200));return My(t,e,null,n)};wn.createRoot=function(t,e){if(!rf(t))throw Error(ie(299));var n=!1,i="",r=dv;return e!=null&&(e.unstable_strictMode===!0&&(n=!0),e.identifierPrefix!==void 0&&(i=e.identifierPrefix),e.onRecoverableError!==void 0&&(r=e.onRecoverableError)),e=ef(t,1,!1,null,null,n,!1,i,r),t[Ti]=e.current,Xo(t.nodeType===8?t.parentNode:t),new nf(e)};wn.findDOMNode=function(t){if(t==null)return null;if(t.nodeType===1)return t;var e=t._reactInternals;if(e===void 0)throw typeof t.render=="function"?Error(ie(188)):(t=Object.keys(t).join(","),Error(ie(268,t)));return t=Ng(e),t=t===null?null:t.stateNode,t};wn.flushSync=function(t){return kr(t)};wn.hydrate=function(t,e,n){if(!pc(e))throw Error(ie(200));return mc(null,t,e,!0,n)};wn.hydrateRoot=function(t,e,n){if(!rf(t))throw Error(ie(405));var i=n!=null&&n.hydratedSources||null,r=!1,s="",o=dv;if(n!=null&&(n.unstable_strictMode===!0&&(r=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onRecoverableError!==void 0&&(o=n.onRecoverableError)),e=uv(e,null,t,1,n??null,r,!1,s,o),t[Ti]=e.current,Xo(t),i)for(t=0;t<i.length;t++)n=i[t],r=n._getVersion,r=r(n._source),e.mutableSourceEagerHydrationData==null?e.mutableSourceEagerHydrationData=[n,r]:e.mutableSourceEagerHydrationData.push(n,r);return new fc(e)};wn.render=function(t,e,n){if(!pc(e))throw Error(ie(200));return mc(null,t,e,!1,n)};wn.unmountComponentAtNode=function(t){if(!pc(t))throw Error(ie(40));return t._reactRootContainer?(kr(function(){mc(null,null,t,!1,function(){t._reactRootContainer=null,t[Ti]=null})}),!0):!1};wn.unstable_batchedUpdates=$h;wn.unstable_renderSubtreeIntoContainer=function(t,e,n,i){if(!pc(n))throw Error(ie(200));if(t==null||t._reactInternals===void 0)throw Error(ie(38));return mc(t,e,n,!1,i)};wn.version="18.3.1-next-f1338f8080-20240426";function hv(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(hv)}catch(t){console.error(t)}}hv(),hg.exports=wn;var Cy=hg.exports,Op=Cy;bu.createRoot=Op.createRoot,bu.hydrateRoot=Op.hydrateRoot;/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const sf="170",by=0,kp=1,Ry=2,fv=1,Py=2,mi=3,or=0,Vt=1,Wn=2,nr=0,Ps=1,Mi=2,Bp=3,zp=4,Dy=5,Mr=100,Ly=101,Ny=102,Iy=103,Uy=104,Fy=200,Oy=201,ky=202,By=203,Sd=204,Md=205,zy=206,Hy=207,Vy=208,Gy=209,Wy=210,jy=211,Xy=212,Ky=213,Yy=214,Ed=0,wd=1,Td=2,zs=3,Ad=4,Cd=5,bd=6,Rd=7,pv=0,qy=1,$y=2,ir=0,Zy=1,Jy=2,Qy=3,mv=4,eS=5,tS=6,nS=7,gv=300,Hs=301,Vs=302,Pd=303,Dd=304,gc=306,vt=1e3,et=1001,Ld=1002,Mn=1003,iS=1004,Ia=1005,yn=1006,Kc=1007,ni=1008,bi=1009,vv=1010,xv=1011,ta=1012,of=1013,Br=1014,ii=1015,da=1016,af=1017,lf=1018,Gs=1020,_v=35902,yv=1021,Sv=1022,Xn=1023,Mv=1024,Ev=1025,Ds=1026,Ws=1027,cf=1028,uf=1029,wv=1030,df=1031,hf=1033,_l=33776,yl=33777,Sl=33778,Ml=33779,Nd=35840,Id=35841,Ud=35842,Fd=35843,Od=36196,kd=37492,Bd=37496,zd=37808,Hd=37809,Vd=37810,Gd=37811,Wd=37812,jd=37813,Xd=37814,Kd=37815,Yd=37816,qd=37817,$d=37818,Zd=37819,Jd=37820,Qd=37821,El=36492,eh=36494,th=36495,Tv=36283,nh=36284,ih=36285,rh=36286,rS=3200,sS=3201,Av=0,oS=1,Pn="",zt="srgb",$s="srgb-linear",vc="linear",it="srgb",Yr=7680,Hp=519,aS=512,lS=513,cS=514,Cv=515,uS=516,dS=517,hS=518,fS=519,Vp=35044,Gp="300 es",yi=2e3,ql=2001;class Zs{addEventListener(e,n){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(n)===-1&&i[e].push(n)}hasEventListener(e,n){if(this._listeners===void 0)return!1;const i=this._listeners;return i[e]!==void 0&&i[e].indexOf(n)!==-1}removeEventListener(e,n){if(this._listeners===void 0)return;const r=this._listeners[e];if(r!==void 0){const s=r.indexOf(n);s!==-1&&r.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const i=this._listeners[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,e);e.target=null}}}const Yt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Wp=1234567;const Uo=Math.PI/180,na=180/Math.PI;function Js(){const t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Yt[t&255]+Yt[t>>8&255]+Yt[t>>16&255]+Yt[t>>24&255]+"-"+Yt[e&255]+Yt[e>>8&255]+"-"+Yt[e>>16&15|64]+Yt[e>>24&255]+"-"+Yt[n&63|128]+Yt[n>>8&255]+"-"+Yt[n>>16&255]+Yt[n>>24&255]+Yt[i&255]+Yt[i>>8&255]+Yt[i>>16&255]+Yt[i>>24&255]).toLowerCase()}function Zt(t,e,n){return Math.max(e,Math.min(n,t))}function ff(t,e){return(t%e+e)%e}function pS(t,e,n,i,r){return i+(t-e)*(r-i)/(n-e)}function mS(t,e,n){return t!==e?(n-t)/(e-t):0}function Fo(t,e,n){return(1-n)*t+n*e}function gS(t,e,n,i){return Fo(t,e,1-Math.exp(-n*i))}function vS(t,e=1){return e-Math.abs(ff(t,e*2)-e)}function xS(t,e,n){return t<=e?0:t>=n?1:(t=(t-e)/(n-e),t*t*(3-2*t))}function _S(t,e,n){return t<=e?0:t>=n?1:(t=(t-e)/(n-e),t*t*t*(t*(t*6-15)+10))}function yS(t,e){return t+Math.floor(Math.random()*(e-t+1))}function SS(t,e){return t+Math.random()*(e-t)}function MS(t){return t*(.5-Math.random())}function ES(t){t!==void 0&&(Wp=t);let e=Wp+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function wS(t){return t*Uo}function TS(t){return t*na}function AS(t){return(t&t-1)===0&&t!==0}function CS(t){return Math.pow(2,Math.ceil(Math.log(t)/Math.LN2))}function bS(t){return Math.pow(2,Math.floor(Math.log(t)/Math.LN2))}function RS(t,e,n,i,r){const s=Math.cos,o=Math.sin,a=s(n/2),l=o(n/2),c=s((e+i)/2),u=o((e+i)/2),h=s((e-i)/2),f=o((e-i)/2),p=s((i-e)/2),_=o((i-e)/2);switch(r){case"XYX":t.set(a*u,l*h,l*f,a*c);break;case"YZY":t.set(l*f,a*u,l*h,a*c);break;case"ZXZ":t.set(l*h,l*f,a*u,a*c);break;case"XZX":t.set(a*u,l*_,l*p,a*c);break;case"YXY":t.set(l*p,a*u,l*_,a*c);break;case"ZYZ":t.set(l*_,l*p,a*u,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function cs(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return t/4294967295;case Uint16Array:return t/65535;case Uint8Array:return t/255;case Int32Array:return Math.max(t/2147483647,-1);case Int16Array:return Math.max(t/32767,-1);case Int8Array:return Math.max(t/127,-1);default:throw new Error("Invalid component type.")}}function en(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return Math.round(t*4294967295);case Uint16Array:return Math.round(t*65535);case Uint8Array:return Math.round(t*255);case Int32Array:return Math.round(t*2147483647);case Int16Array:return Math.round(t*32767);case Int8Array:return Math.round(t*127);default:throw new Error("Invalid component type.")}}const Lr={DEG2RAD:Uo,RAD2DEG:na,generateUUID:Js,clamp:Zt,euclideanModulo:ff,mapLinear:pS,inverseLerp:mS,lerp:Fo,damp:gS,pingpong:vS,smoothstep:xS,smootherstep:_S,randInt:yS,randFloat:SS,randFloatSpread:MS,seededRandom:ES,degToRad:wS,radToDeg:TS,isPowerOfTwo:AS,ceilPowerOfTwo:CS,floorPowerOfTwo:bS,setQuaternionFromProperEuler:RS,normalize:en,denormalize:cs};class je{constructor(e=0,n=0){je.prototype.isVector2=!0,this.x=e,this.y=n}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,n){return this.x=e,this.y=n,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const n=this.x,i=this.y,r=e.elements;return this.x=r[0]*n+r[3]*i+r[6],this.y=r[1]*n+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(Zt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y;return n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this}rotateAround(e,n){const i=Math.cos(n),r=Math.sin(n),s=this.x-e.x,o=this.y-e.y;return this.x=s*i-o*r+e.x,this.y=s*r+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ke{constructor(e,n,i,r,s,o,a,l,c){ke.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,o,a,l,c)}set(e,n,i,r,s,o,a,l,c){const u=this.elements;return u[0]=e,u[1]=r,u[2]=a,u[3]=n,u[4]=s,u[5]=l,u[6]=i,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],this}extractBasis(e,n,i){return e.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const n=e.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,o=i[0],a=i[3],l=i[6],c=i[1],u=i[4],h=i[7],f=i[2],p=i[5],_=i[8],v=r[0],m=r[3],d=r[6],g=r[1],x=r[4],y=r[7],R=r[2],C=r[5],A=r[8];return s[0]=o*v+a*g+l*R,s[3]=o*m+a*x+l*C,s[6]=o*d+a*y+l*A,s[1]=c*v+u*g+h*R,s[4]=c*m+u*x+h*C,s[7]=c*d+u*y+h*A,s[2]=f*v+p*g+_*R,s[5]=f*m+p*x+_*C,s[8]=f*d+p*y+_*A,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[3]*=e,n[6]*=e,n[1]*=e,n[4]*=e,n[7]*=e,n[2]*=e,n[5]*=e,n[8]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8];return n*o*u-n*a*c-i*s*u+i*a*l+r*s*c-r*o*l}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],h=u*o-a*c,f=a*l-u*s,p=c*s-o*l,_=n*h+i*f+r*p;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/_;return e[0]=h*v,e[1]=(r*c-u*i)*v,e[2]=(a*i-r*o)*v,e[3]=f*v,e[4]=(u*n-r*l)*v,e[5]=(r*s-a*n)*v,e[6]=p*v,e[7]=(i*l-c*n)*v,e[8]=(o*n-i*s)*v,this}transpose(){let e;const n=this.elements;return e=n[1],n[1]=n[3],n[3]=e,e=n[2],n[2]=n[6],n[6]=e,e=n[5],n[5]=n[7],n[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const n=this.elements;return e[0]=n[0],e[1]=n[3],e[2]=n[6],e[3]=n[1],e[4]=n[4],e[5]=n[7],e[6]=n[2],e[7]=n[5],e[8]=n[8],this}setUvTransform(e,n,i,r,s,o,a){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*o+c*a)+o+e,-r*c,r*l,-r*(-c*o+l*a)+a+n,0,0,1),this}scale(e,n){return this.premultiply(Yc.makeScale(e,n)),this}rotate(e){return this.premultiply(Yc.makeRotation(-e)),this}translate(e,n){return this.premultiply(Yc.makeTranslation(e,n)),this}makeTranslation(e,n){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,n,0,0,1),this}makeRotation(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,i,n,0,0,0,1),this}makeScale(e,n){return this.set(e,0,0,0,n,0,0,0,1),this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<9;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<9;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Yc=new ke;function bv(t){for(let e=t.length-1;e>=0;--e)if(t[e]>=65535)return!0;return!1}function ia(t){return document.createElementNS("http://www.w3.org/1999/xhtml",t)}function PS(){const t=ia("canvas");return t.style.display="block",t}const jp={};function Eo(t){t in jp||(jp[t]=!0,console.warn(t))}function DS(t,e,n){return new Promise(function(i,r){function s(){switch(t.clientWaitSync(e,t.SYNC_FLUSH_COMMANDS_BIT,0)){case t.WAIT_FAILED:r();break;case t.TIMEOUT_EXPIRED:setTimeout(s,n);break;default:i()}}setTimeout(s,n)})}function LS(t){const e=t.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function NS(t){const e=t.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const Ye={enabled:!0,workingColorSpace:$s,spaces:{},convert:function(t,e,n){return this.enabled===!1||e===n||!e||!n||(this.spaces[e].transfer===it&&(t.r=Ei(t.r),t.g=Ei(t.g),t.b=Ei(t.b)),this.spaces[e].primaries!==this.spaces[n].primaries&&(t.applyMatrix3(this.spaces[e].toXYZ),t.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===it&&(t.r=Ls(t.r),t.g=Ls(t.g),t.b=Ls(t.b))),t},fromWorkingColorSpace:function(t,e){return this.convert(t,this.workingColorSpace,e)},toWorkingColorSpace:function(t,e){return this.convert(t,e,this.workingColorSpace)},getPrimaries:function(t){return this.spaces[t].primaries},getTransfer:function(t){return t===Pn?vc:this.spaces[t].transfer},getLuminanceCoefficients:function(t,e=this.workingColorSpace){return t.fromArray(this.spaces[e].luminanceCoefficients)},define:function(t){Object.assign(this.spaces,t)},_getMatrix:function(t,e,n){return t.copy(this.spaces[e].toXYZ).multiply(this.spaces[n].fromXYZ)},_getDrawingBufferColorSpace:function(t){return this.spaces[t].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(t=this.workingColorSpace){return this.spaces[t].workingColorSpaceConfig.unpackColorSpace}};function Ei(t){return t<.04045?t*.0773993808:Math.pow(t*.9478672986+.0521327014,2.4)}function Ls(t){return t<.0031308?t*12.92:1.055*Math.pow(t,.41666)-.055}const Xp=[.64,.33,.3,.6,.15,.06],Kp=[.2126,.7152,.0722],Yp=[.3127,.329],qp=new ke().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),$p=new ke().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Ye.define({[$s]:{primaries:Xp,whitePoint:Yp,transfer:vc,toXYZ:qp,fromXYZ:$p,luminanceCoefficients:Kp,workingColorSpaceConfig:{unpackColorSpace:zt},outputColorSpaceConfig:{drawingBufferColorSpace:zt}},[zt]:{primaries:Xp,whitePoint:Yp,transfer:it,toXYZ:qp,fromXYZ:$p,luminanceCoefficients:Kp,outputColorSpaceConfig:{drawingBufferColorSpace:zt}}});let qr;class IS{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{qr===void 0&&(qr=ia("canvas")),qr.width=e.width,qr.height=e.height;const i=qr.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=qr}return n.width>2048||n.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),n.toDataURL("image/jpeg",.6)):n.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const n=ia("canvas");n.width=e.width,n.height=e.height;const i=n.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=Ei(s[o]/255)*255;return i.putImageData(r,0,0),n}else if(e.data){const n=e.data.slice(0);for(let i=0;i<n.length;i++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[i]=Math.floor(Ei(n[i]/255)*255):n[i]=Ei(n[i]);return{data:n,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let US=0;class Rv{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:US++}),this.uuid=Js(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(qc(r[o].image)):s.push(qc(r[o]))}else s=qc(r);i.url=s}return n||(e.images[this.uuid]=i),i}}function qc(t){return typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap?IS.getDataURL(t):t.data?{data:Array.from(t.data),width:t.width,height:t.height,type:t.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let FS=0;class kt extends Zs{constructor(e=kt.DEFAULT_IMAGE,n=kt.DEFAULT_MAPPING,i=et,r=et,s=yn,o=ni,a=Xn,l=bi,c=kt.DEFAULT_ANISOTROPY,u=Pn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:FS++}),this.uuid=Js(),this.name="",this.source=new Rv(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new je(0,0),this.repeat=new je(1,1),this.center=new je(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ke,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),n||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==gv)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case vt:e.x=e.x-Math.floor(e.x);break;case et:e.x=e.x<0?0:1;break;case Ld:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case vt:e.y=e.y-Math.floor(e.y);break;case et:e.y=e.y<0?0:1;break;case Ld:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}kt.DEFAULT_IMAGE=null;kt.DEFAULT_MAPPING=gv;kt.DEFAULT_ANISOTROPY=1;class rt{constructor(e=0,n=0,i=0,r=1){rt.prototype.isVector4=!0,this.x=e,this.y=n,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,n,i,r){return this.x=e,this.y=n,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this.w=e.w+n.w,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this.w+=e.w*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this.w=e.w-n.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*n+o[4]*i+o[8]*r+o[12]*s,this.y=o[1]*n+o[5]*i+o[9]*r+o[13]*s,this.z=o[2]*n+o[6]*i+o[10]*r+o[14]*s,this.w=o[3]*n+o[7]*i+o[11]*r+o[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const n=Math.sqrt(1-e.w*e.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/n,this.y=e.y/n,this.z=e.z/n),this}setAxisAngleFromRotationMatrix(e){let n,i,r,s;const l=e.elements,c=l[0],u=l[4],h=l[8],f=l[1],p=l[5],_=l[9],v=l[2],m=l[6],d=l[10];if(Math.abs(u-f)<.01&&Math.abs(h-v)<.01&&Math.abs(_-m)<.01){if(Math.abs(u+f)<.1&&Math.abs(h+v)<.1&&Math.abs(_+m)<.1&&Math.abs(c+p+d-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;const x=(c+1)/2,y=(p+1)/2,R=(d+1)/2,C=(u+f)/4,A=(h+v)/4,b=(_+m)/4;return x>y&&x>R?x<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(x),r=C/i,s=A/i):y>R?y<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(y),i=C/r,s=b/r):R<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(R),i=A/s,r=b/s),this.set(i,r,s,n),this}let g=Math.sqrt((m-_)*(m-_)+(h-v)*(h-v)+(f-u)*(f-u));return Math.abs(g)<.001&&(g=1),this.x=(m-_)/g,this.y=(h-v)/g,this.z=(f-u)/g,this.w=Math.acos((c+p+d-1)/2),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this.w=n[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this.z=Math.max(e.z,Math.min(n.z,this.z)),this.w=Math.max(e.w,Math.min(n.w,this.w)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this.z=Math.max(e,Math.min(n,this.z)),this.w=Math.max(e,Math.min(n,this.w)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this.w+=(e.w-this.w)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this.w=e.w+(n.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this.w=e[n+3],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e[n+3]=this.w,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this.w=e.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class OS extends Zs{constructor(e=1,n=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=n,this.depth=1,this.scissor=new rt(0,0,e,n),this.scissorTest=!1,this.viewport=new rt(0,0,e,n);const r={width:e,height:n,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:yn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new kt(r,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const o=i.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,n,i=1){if(this.width!==e||this.height!==n||this.depth!==i){this.width=e,this.height=n,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=n,this.textures[r].image.depth=i;this.dispose()}this.viewport.set(0,0,e,n),this.scissor.set(0,0,e,n)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,r=e.textures.length;i<r;i++)this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const n=Object.assign({},e.texture.image);return this.texture.source=new Rv(n),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class zr extends OS{constructor(e=1,n=1,i={}){super(e,n,i),this.isWebGLRenderTarget=!0}}class Pv extends kt{constructor(e=null,n=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=Mn,this.minFilter=Mn,this.wrapR=et,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class kS extends kt{constructor(e=null,n=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=Mn,this.minFilter=Mn,this.wrapR=et,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ha{constructor(e=0,n=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=n,this._z=i,this._w=r}static slerpFlat(e,n,i,r,s,o,a){let l=i[r+0],c=i[r+1],u=i[r+2],h=i[r+3];const f=s[o+0],p=s[o+1],_=s[o+2],v=s[o+3];if(a===0){e[n+0]=l,e[n+1]=c,e[n+2]=u,e[n+3]=h;return}if(a===1){e[n+0]=f,e[n+1]=p,e[n+2]=_,e[n+3]=v;return}if(h!==v||l!==f||c!==p||u!==_){let m=1-a;const d=l*f+c*p+u*_+h*v,g=d>=0?1:-1,x=1-d*d;if(x>Number.EPSILON){const R=Math.sqrt(x),C=Math.atan2(R,d*g);m=Math.sin(m*C)/R,a=Math.sin(a*C)/R}const y=a*g;if(l=l*m+f*y,c=c*m+p*y,u=u*m+_*y,h=h*m+v*y,m===1-a){const R=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=R,c*=R,u*=R,h*=R}}e[n]=l,e[n+1]=c,e[n+2]=u,e[n+3]=h}static multiplyQuaternionsFlat(e,n,i,r,s,o){const a=i[r],l=i[r+1],c=i[r+2],u=i[r+3],h=s[o],f=s[o+1],p=s[o+2],_=s[o+3];return e[n]=a*_+u*h+l*p-c*f,e[n+1]=l*_+u*f+c*h-a*p,e[n+2]=c*_+u*p+a*f-l*h,e[n+3]=u*_-a*h-l*f-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,n,i,r){return this._x=e,this._y=n,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,n=!0){const i=e._x,r=e._y,s=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(i/2),u=a(r/2),h=a(s/2),f=l(i/2),p=l(r/2),_=l(s/2);switch(o){case"XYZ":this._x=f*u*h+c*p*_,this._y=c*p*h-f*u*_,this._z=c*u*_+f*p*h,this._w=c*u*h-f*p*_;break;case"YXZ":this._x=f*u*h+c*p*_,this._y=c*p*h-f*u*_,this._z=c*u*_-f*p*h,this._w=c*u*h+f*p*_;break;case"ZXY":this._x=f*u*h-c*p*_,this._y=c*p*h+f*u*_,this._z=c*u*_+f*p*h,this._w=c*u*h-f*p*_;break;case"ZYX":this._x=f*u*h-c*p*_,this._y=c*p*h+f*u*_,this._z=c*u*_-f*p*h,this._w=c*u*h+f*p*_;break;case"YZX":this._x=f*u*h+c*p*_,this._y=c*p*h+f*u*_,this._z=c*u*_-f*p*h,this._w=c*u*h-f*p*_;break;case"XZY":this._x=f*u*h-c*p*_,this._y=c*p*h-f*u*_,this._z=c*u*_+f*p*h,this._w=c*u*h+f*p*_;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return n===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,n){const i=n/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const n=e.elements,i=n[0],r=n[4],s=n[8],o=n[1],a=n[5],l=n[9],c=n[2],u=n[6],h=n[10],f=i+a+h;if(f>0){const p=.5/Math.sqrt(f+1);this._w=.25/p,this._x=(u-l)*p,this._y=(s-c)*p,this._z=(o-r)*p}else if(i>a&&i>h){const p=2*Math.sqrt(1+i-a-h);this._w=(u-l)/p,this._x=.25*p,this._y=(r+o)/p,this._z=(s+c)/p}else if(a>h){const p=2*Math.sqrt(1+a-i-h);this._w=(s-c)/p,this._x=(r+o)/p,this._y=.25*p,this._z=(l+u)/p}else{const p=2*Math.sqrt(1+h-i-a);this._w=(o-r)/p,this._x=(s+c)/p,this._y=(l+u)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,n){let i=e.dot(n)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*n.z-e.z*n.y,this._y=e.z*n.x-e.x*n.z,this._z=e.x*n.y-e.y*n.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Zt(this.dot(e),-1,1)))}rotateTowards(e,n){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,n/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,n){const i=e._x,r=e._y,s=e._z,o=e._w,a=n._x,l=n._y,c=n._z,u=n._w;return this._x=i*u+o*a+r*c-s*l,this._y=r*u+o*l+s*a-i*c,this._z=s*u+o*c+i*l-r*a,this._w=o*u-i*a-r*l-s*c,this._onChangeCallback(),this}slerp(e,n){if(n===0)return this;if(n===1)return this.copy(e);const i=this._x,r=this._y,s=this._z,o=this._w;let a=o*e._w+i*e._x+r*e._y+s*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=i,this._y=r,this._z=s,this;const l=1-a*a;if(l<=Number.EPSILON){const p=1-n;return this._w=p*o+n*this._w,this._x=p*i+n*this._x,this._y=p*r+n*this._y,this._z=p*s+n*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,a),h=Math.sin((1-n)*u)/c,f=Math.sin(n*u)/c;return this._w=o*h+this._w*f,this._x=i*h+this._x*f,this._y=r*h+this._y*f,this._z=s*h+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,n,i){return this.copy(e).slerp(n,i)}random(){const e=2*Math.PI*Math.random(),n=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(n),s*Math.cos(n))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,n=0){return this._x=e[n],this._y=e[n+1],this._z=e[n+2],this._w=e[n+3],this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._w,e}fromBufferAttribute(e,n){return this._x=e.getX(n),this._y=e.getY(n),this._z=e.getZ(n),this._w=e.getW(n),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class D{constructor(e=0,n=0,i=0){D.prototype.isVector3=!0,this.x=e,this.y=n,this.z=i}set(e,n,i){return i===void 0&&(i=this.z),this.x=e,this.y=n,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,n){return this.x=e.x*n.x,this.y=e.y*n.y,this.z=e.z*n.z,this}applyEuler(e){return this.applyQuaternion(Zp.setFromEuler(e))}applyAxisAngle(e,n){return this.applyQuaternion(Zp.setFromAxisAngle(e,n))}applyMatrix3(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[3]*i+s[6]*r,this.y=s[1]*n+s[4]*i+s[7]*r,this.z=s[2]*n+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=e.elements,o=1/(s[3]*n+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*n+s[4]*i+s[8]*r+s[12])*o,this.y=(s[1]*n+s[5]*i+s[9]*r+s[13])*o,this.z=(s[2]*n+s[6]*i+s[10]*r+s[14])*o,this}applyQuaternion(e){const n=this.x,i=this.y,r=this.z,s=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*r-a*i),u=2*(a*n-s*r),h=2*(s*i-o*n);return this.x=n+l*c+o*h-a*u,this.y=i+l*u+a*c-s*h,this.z=r+l*h+s*u-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[4]*i+s[8]*r,this.y=s[1]*n+s[5]*i+s[9]*r,this.z=s[2]*n+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this.z=Math.max(e.z,Math.min(n.z,this.z)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this.z=Math.max(e,Math.min(n,this.z)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,n){const i=e.x,r=e.y,s=e.z,o=n.x,a=n.y,l=n.z;return this.x=r*l-s*a,this.y=s*o-i*l,this.z=i*a-r*o,this}projectOnVector(e){const n=e.lengthSq();if(n===0)return this.set(0,0,0);const i=e.dot(this)/n;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return $c.copy(this).projectOnVector(e),this.sub($c)}reflect(e){return this.sub($c.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(Zt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return n*n+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,n,i){const r=Math.sin(n)*e;return this.x=r*Math.sin(i),this.y=Math.cos(n)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,n,i){return this.x=e*Math.sin(n),this.y=i,this.z=e*Math.cos(n),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(e){const n=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=n,this.y=i,this.z=r,this}setFromMatrixColumn(e,n){return this.fromArray(e.elements,n*4)}setFromMatrix3Column(e,n){return this.fromArray(e.elements,n*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,n=Math.random()*2-1,i=Math.sqrt(1-n*n);return this.x=i*Math.cos(e),this.y=n,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const $c=new D,Zp=new ha;class Gr{constructor(e=new D(1/0,1/0,1/0),n=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=n}set(e,n){return this.min.copy(e),this.max.copy(n),this}setFromArray(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n+=3)this.expandByPoint(kn.fromArray(e,n));return this}setFromBufferAttribute(e){this.makeEmpty();for(let n=0,i=e.count;n<i;n++)this.expandByPoint(kn.fromBufferAttribute(e,n));return this}setFromPoints(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n++)this.expandByPoint(e[n]);return this}setFromCenterAndSize(e,n){const i=kn.copy(n).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,n=!1){return this.makeEmpty(),this.expandByObject(e,n)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,n=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(n===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,kn):kn.fromBufferAttribute(s,o),kn.applyMatrix4(e.matrixWorld),this.expandByPoint(kn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Ua.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Ua.copy(i.boundingBox)),Ua.applyMatrix4(e.matrixWorld),this.union(Ua)}const r=e.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],n);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,n){return n.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,kn),kn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let n,i;return e.normal.x>0?(n=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(n=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(n+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(n+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(n+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(n+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),n<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(uo),Fa.subVectors(this.max,uo),$r.subVectors(e.a,uo),Zr.subVectors(e.b,uo),Jr.subVectors(e.c,uo),Ni.subVectors(Zr,$r),Ii.subVectors(Jr,Zr),hr.subVectors($r,Jr);let n=[0,-Ni.z,Ni.y,0,-Ii.z,Ii.y,0,-hr.z,hr.y,Ni.z,0,-Ni.x,Ii.z,0,-Ii.x,hr.z,0,-hr.x,-Ni.y,Ni.x,0,-Ii.y,Ii.x,0,-hr.y,hr.x,0];return!Zc(n,$r,Zr,Jr,Fa)||(n=[1,0,0,0,1,0,0,0,1],!Zc(n,$r,Zr,Jr,Fa))?!1:(Oa.crossVectors(Ni,Ii),n=[Oa.x,Oa.y,Oa.z],Zc(n,$r,Zr,Jr,Fa))}clampPoint(e,n){return n.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,kn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(kn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(ui[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),ui[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),ui[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),ui[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),ui[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),ui[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),ui[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),ui[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(ui),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const ui=[new D,new D,new D,new D,new D,new D,new D,new D],kn=new D,Ua=new Gr,$r=new D,Zr=new D,Jr=new D,Ni=new D,Ii=new D,hr=new D,uo=new D,Fa=new D,Oa=new D,fr=new D;function Zc(t,e,n,i,r){for(let s=0,o=t.length-3;s<=o;s+=3){fr.fromArray(t,s);const a=r.x*Math.abs(fr.x)+r.y*Math.abs(fr.y)+r.z*Math.abs(fr.z),l=e.dot(fr),c=n.dot(fr),u=i.dot(fr);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}const BS=new Gr,ho=new D,Jc=new D;class Wr{constructor(e=new D,n=-1){this.isSphere=!0,this.center=e,this.radius=n}set(e,n){return this.center.copy(e),this.radius=n,this}setFromPoints(e,n){const i=this.center;n!==void 0?i.copy(n):BS.setFromPoints(e).getCenter(i);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const n=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=n*n}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,n){const i=this.center.distanceToSquared(e);return n.copy(e),i>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ho.subVectors(e,this.center);const n=ho.lengthSq();if(n>this.radius*this.radius){const i=Math.sqrt(n),r=(i-this.radius)*.5;this.center.addScaledVector(ho,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Jc.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ho.copy(e.center).add(Jc)),this.expandByPoint(ho.copy(e.center).sub(Jc))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const di=new D,Qc=new D,ka=new D,Ui=new D,eu=new D,Ba=new D,tu=new D;class xc{constructor(e=new D,n=new D(0,0,-1)){this.origin=e,this.direction=n}set(e,n){return this.origin.copy(e),this.direction.copy(n),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,n){return n.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,di)),this}closestPointToPoint(e,n){n.subVectors(e,this.origin);const i=n.dot(this.direction);return i<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const n=di.subVectors(e,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(e):(di.copy(this.origin).addScaledVector(this.direction,n),di.distanceToSquared(e))}distanceSqToSegment(e,n,i,r){Qc.copy(e).add(n).multiplyScalar(.5),ka.copy(n).sub(e).normalize(),Ui.copy(this.origin).sub(Qc);const s=e.distanceTo(n)*.5,o=-this.direction.dot(ka),a=Ui.dot(this.direction),l=-Ui.dot(ka),c=Ui.lengthSq(),u=Math.abs(1-o*o);let h,f,p,_;if(u>0)if(h=o*l-a,f=o*a-l,_=s*u,h>=0)if(f>=-_)if(f<=_){const v=1/u;h*=v,f*=v,p=h*(h+o*f+2*a)+f*(o*h+f+2*l)+c}else f=s,h=Math.max(0,-(o*f+a)),p=-h*h+f*(f+2*l)+c;else f=-s,h=Math.max(0,-(o*f+a)),p=-h*h+f*(f+2*l)+c;else f<=-_?(h=Math.max(0,-(-o*s+a)),f=h>0?-s:Math.min(Math.max(-s,-l),s),p=-h*h+f*(f+2*l)+c):f<=_?(h=0,f=Math.min(Math.max(-s,-l),s),p=f*(f+2*l)+c):(h=Math.max(0,-(o*s+a)),f=h>0?s:Math.min(Math.max(-s,-l),s),p=-h*h+f*(f+2*l)+c);else f=o>0?-s:s,h=Math.max(0,-(o*f+a)),p=-h*h+f*(f+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,h),r&&r.copy(Qc).addScaledVector(ka,f),p}intersectSphere(e,n){di.subVectors(e.center,this.origin);const i=di.dot(this.direction),r=di.dot(di)-i*i,s=e.radius*e.radius;if(r>s)return null;const o=Math.sqrt(s-r),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,n):this.at(a,n)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const n=e.normal.dot(this.direction);if(n===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/n;return i>=0?i:null}intersectPlane(e,n){const i=this.distanceToPlane(e);return i===null?null:this.at(i,n)}intersectsPlane(e){const n=e.distanceToPoint(this.origin);return n===0||e.normal.dot(this.direction)*n<0}intersectBox(e,n){let i,r,s,o,a,l;const c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,f=this.origin;return c>=0?(i=(e.min.x-f.x)*c,r=(e.max.x-f.x)*c):(i=(e.max.x-f.x)*c,r=(e.min.x-f.x)*c),u>=0?(s=(e.min.y-f.y)*u,o=(e.max.y-f.y)*u):(s=(e.max.y-f.y)*u,o=(e.min.y-f.y)*u),i>o||s>r||((s>i||isNaN(i))&&(i=s),(o<r||isNaN(r))&&(r=o),h>=0?(a=(e.min.z-f.z)*h,l=(e.max.z-f.z)*h):(a=(e.max.z-f.z)*h,l=(e.min.z-f.z)*h),i>l||a>r)||((a>i||i!==i)&&(i=a),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,n)}intersectsBox(e){return this.intersectBox(e,di)!==null}intersectTriangle(e,n,i,r,s){eu.subVectors(n,e),Ba.subVectors(i,e),tu.crossVectors(eu,Ba);let o=this.direction.dot(tu),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Ui.subVectors(this.origin,e);const l=a*this.direction.dot(Ba.crossVectors(Ui,Ba));if(l<0)return null;const c=a*this.direction.dot(eu.cross(Ui));if(c<0||l+c>o)return null;const u=-a*Ui.dot(tu);return u<0?null:this.at(u/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class nt{constructor(e,n,i,r,s,o,a,l,c,u,h,f,p,_,v,m){nt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,o,a,l,c,u,h,f,p,_,v,m)}set(e,n,i,r,s,o,a,l,c,u,h,f,p,_,v,m){const d=this.elements;return d[0]=e,d[4]=n,d[8]=i,d[12]=r,d[1]=s,d[5]=o,d[9]=a,d[13]=l,d[2]=c,d[6]=u,d[10]=h,d[14]=f,d[3]=p,d[7]=_,d[11]=v,d[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new nt().fromArray(this.elements)}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],n[9]=i[9],n[10]=i[10],n[11]=i[11],n[12]=i[12],n[13]=i[13],n[14]=i[14],n[15]=i[15],this}copyPosition(e){const n=this.elements,i=e.elements;return n[12]=i[12],n[13]=i[13],n[14]=i[14],this}setFromMatrix3(e){const n=e.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(e,n,i){return e.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,n,i){return this.set(e.x,n.x,i.x,0,e.y,n.y,i.y,0,e.z,n.z,i.z,0,0,0,0,1),this}extractRotation(e){const n=this.elements,i=e.elements,r=1/Qr.setFromMatrixColumn(e,0).length(),s=1/Qr.setFromMatrixColumn(e,1).length(),o=1/Qr.setFromMatrixColumn(e,2).length();return n[0]=i[0]*r,n[1]=i[1]*r,n[2]=i[2]*r,n[3]=0,n[4]=i[4]*s,n[5]=i[5]*s,n[6]=i[6]*s,n[7]=0,n[8]=i[8]*o,n[9]=i[9]*o,n[10]=i[10]*o,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(e){const n=this.elements,i=e.x,r=e.y,s=e.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(r),c=Math.sin(r),u=Math.cos(s),h=Math.sin(s);if(e.order==="XYZ"){const f=o*u,p=o*h,_=a*u,v=a*h;n[0]=l*u,n[4]=-l*h,n[8]=c,n[1]=p+_*c,n[5]=f-v*c,n[9]=-a*l,n[2]=v-f*c,n[6]=_+p*c,n[10]=o*l}else if(e.order==="YXZ"){const f=l*u,p=l*h,_=c*u,v=c*h;n[0]=f+v*a,n[4]=_*a-p,n[8]=o*c,n[1]=o*h,n[5]=o*u,n[9]=-a,n[2]=p*a-_,n[6]=v+f*a,n[10]=o*l}else if(e.order==="ZXY"){const f=l*u,p=l*h,_=c*u,v=c*h;n[0]=f-v*a,n[4]=-o*h,n[8]=_+p*a,n[1]=p+_*a,n[5]=o*u,n[9]=v-f*a,n[2]=-o*c,n[6]=a,n[10]=o*l}else if(e.order==="ZYX"){const f=o*u,p=o*h,_=a*u,v=a*h;n[0]=l*u,n[4]=_*c-p,n[8]=f*c+v,n[1]=l*h,n[5]=v*c+f,n[9]=p*c-_,n[2]=-c,n[6]=a*l,n[10]=o*l}else if(e.order==="YZX"){const f=o*l,p=o*c,_=a*l,v=a*c;n[0]=l*u,n[4]=v-f*h,n[8]=_*h+p,n[1]=h,n[5]=o*u,n[9]=-a*u,n[2]=-c*u,n[6]=p*h+_,n[10]=f-v*h}else if(e.order==="XZY"){const f=o*l,p=o*c,_=a*l,v=a*c;n[0]=l*u,n[4]=-h,n[8]=c*u,n[1]=f*h+v,n[5]=o*u,n[9]=p*h-_,n[2]=_*h-p,n[6]=a*u,n[10]=v*h+f}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(e){return this.compose(zS,e,HS)}lookAt(e,n,i){const r=this.elements;return pn.subVectors(e,n),pn.lengthSq()===0&&(pn.z=1),pn.normalize(),Fi.crossVectors(i,pn),Fi.lengthSq()===0&&(Math.abs(i.z)===1?pn.x+=1e-4:pn.z+=1e-4,pn.normalize(),Fi.crossVectors(i,pn)),Fi.normalize(),za.crossVectors(pn,Fi),r[0]=Fi.x,r[4]=za.x,r[8]=pn.x,r[1]=Fi.y,r[5]=za.y,r[9]=pn.y,r[2]=Fi.z,r[6]=za.z,r[10]=pn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,o=i[0],a=i[4],l=i[8],c=i[12],u=i[1],h=i[5],f=i[9],p=i[13],_=i[2],v=i[6],m=i[10],d=i[14],g=i[3],x=i[7],y=i[11],R=i[15],C=r[0],A=r[4],b=r[8],w=r[12],M=r[1],P=r[5],V=r[9],B=r[13],G=r[2],J=r[6],W=r[10],ee=r[14],L=r[3],K=r[7],q=r[11],ae=r[15];return s[0]=o*C+a*M+l*G+c*L,s[4]=o*A+a*P+l*J+c*K,s[8]=o*b+a*V+l*W+c*q,s[12]=o*w+a*B+l*ee+c*ae,s[1]=u*C+h*M+f*G+p*L,s[5]=u*A+h*P+f*J+p*K,s[9]=u*b+h*V+f*W+p*q,s[13]=u*w+h*B+f*ee+p*ae,s[2]=_*C+v*M+m*G+d*L,s[6]=_*A+v*P+m*J+d*K,s[10]=_*b+v*V+m*W+d*q,s[14]=_*w+v*B+m*ee+d*ae,s[3]=g*C+x*M+y*G+R*L,s[7]=g*A+x*P+y*J+R*K,s[11]=g*b+x*V+y*W+R*q,s[15]=g*w+x*B+y*ee+R*ae,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[4]*=e,n[8]*=e,n[12]*=e,n[1]*=e,n[5]*=e,n[9]*=e,n[13]*=e,n[2]*=e,n[6]*=e,n[10]*=e,n[14]*=e,n[3]*=e,n[7]*=e,n[11]*=e,n[15]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[4],r=e[8],s=e[12],o=e[1],a=e[5],l=e[9],c=e[13],u=e[2],h=e[6],f=e[10],p=e[14],_=e[3],v=e[7],m=e[11],d=e[15];return _*(+s*l*h-r*c*h-s*a*f+i*c*f+r*a*p-i*l*p)+v*(+n*l*p-n*c*f+s*o*f-r*o*p+r*c*u-s*l*u)+m*(+n*c*h-n*a*p-s*o*h+i*o*p+s*a*u-i*c*u)+d*(-r*a*u-n*l*h+n*a*f+r*o*h-i*o*f+i*l*u)}transpose(){const e=this.elements;let n;return n=e[1],e[1]=e[4],e[4]=n,n=e[2],e[2]=e[8],e[8]=n,n=e[6],e[6]=e[9],e[9]=n,n=e[3],e[3]=e[12],e[12]=n,n=e[7],e[7]=e[13],e[13]=n,n=e[11],e[11]=e[14],e[14]=n,this}setPosition(e,n,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=n,r[14]=i),this}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],h=e[9],f=e[10],p=e[11],_=e[12],v=e[13],m=e[14],d=e[15],g=h*m*c-v*f*c+v*l*p-a*m*p-h*l*d+a*f*d,x=_*f*c-u*m*c-_*l*p+o*m*p+u*l*d-o*f*d,y=u*v*c-_*h*c+_*a*p-o*v*p-u*a*d+o*h*d,R=_*h*l-u*v*l-_*a*f+o*v*f+u*a*m-o*h*m,C=n*g+i*x+r*y+s*R;if(C===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/C;return e[0]=g*A,e[1]=(v*f*s-h*m*s-v*r*p+i*m*p+h*r*d-i*f*d)*A,e[2]=(a*m*s-v*l*s+v*r*c-i*m*c-a*r*d+i*l*d)*A,e[3]=(h*l*s-a*f*s-h*r*c+i*f*c+a*r*p-i*l*p)*A,e[4]=x*A,e[5]=(u*m*s-_*f*s+_*r*p-n*m*p-u*r*d+n*f*d)*A,e[6]=(_*l*s-o*m*s-_*r*c+n*m*c+o*r*d-n*l*d)*A,e[7]=(o*f*s-u*l*s+u*r*c-n*f*c-o*r*p+n*l*p)*A,e[8]=y*A,e[9]=(_*h*s-u*v*s-_*i*p+n*v*p+u*i*d-n*h*d)*A,e[10]=(o*v*s-_*a*s+_*i*c-n*v*c-o*i*d+n*a*d)*A,e[11]=(u*a*s-o*h*s-u*i*c+n*h*c+o*i*p-n*a*p)*A,e[12]=R*A,e[13]=(u*v*r-_*h*r+_*i*f-n*v*f-u*i*m+n*h*m)*A,e[14]=(_*a*r-o*v*r-_*i*l+n*v*l+o*i*m-n*a*m)*A,e[15]=(o*h*r-u*a*r+u*i*l-n*h*l-o*i*f+n*a*f)*A,this}scale(e){const n=this.elements,i=e.x,r=e.y,s=e.z;return n[0]*=i,n[4]*=r,n[8]*=s,n[1]*=i,n[5]*=r,n[9]*=s,n[2]*=i,n[6]*=r,n[10]*=s,n[3]*=i,n[7]*=r,n[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,n=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(n,i,r))}makeTranslation(e,n,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,n,0,0,1,i,0,0,0,1),this}makeRotationX(e){const n=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,n,-i,0,0,i,n,0,0,0,0,1),this}makeRotationY(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,0,i,0,0,1,0,0,-i,0,n,0,0,0,0,1),this}makeRotationZ(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,0,i,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,n){const i=Math.cos(n),r=Math.sin(n),s=1-i,o=e.x,a=e.y,l=e.z,c=s*o,u=s*a;return this.set(c*o+i,c*a-r*l,c*l+r*a,0,c*a+r*l,u*a+i,u*l-r*o,0,c*l-r*a,u*l+r*o,s*l*l+i,0,0,0,0,1),this}makeScale(e,n,i){return this.set(e,0,0,0,0,n,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,n,i,r,s,o){return this.set(1,i,s,0,e,1,o,0,n,r,1,0,0,0,0,1),this}compose(e,n,i){const r=this.elements,s=n._x,o=n._y,a=n._z,l=n._w,c=s+s,u=o+o,h=a+a,f=s*c,p=s*u,_=s*h,v=o*u,m=o*h,d=a*h,g=l*c,x=l*u,y=l*h,R=i.x,C=i.y,A=i.z;return r[0]=(1-(v+d))*R,r[1]=(p+y)*R,r[2]=(_-x)*R,r[3]=0,r[4]=(p-y)*C,r[5]=(1-(f+d))*C,r[6]=(m+g)*C,r[7]=0,r[8]=(_+x)*A,r[9]=(m-g)*A,r[10]=(1-(f+v))*A,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,n,i){const r=this.elements;let s=Qr.set(r[0],r[1],r[2]).length();const o=Qr.set(r[4],r[5],r[6]).length(),a=Qr.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],Bn.copy(this);const c=1/s,u=1/o,h=1/a;return Bn.elements[0]*=c,Bn.elements[1]*=c,Bn.elements[2]*=c,Bn.elements[4]*=u,Bn.elements[5]*=u,Bn.elements[6]*=u,Bn.elements[8]*=h,Bn.elements[9]*=h,Bn.elements[10]*=h,n.setFromRotationMatrix(Bn),i.x=s,i.y=o,i.z=a,this}makePerspective(e,n,i,r,s,o,a=yi){const l=this.elements,c=2*s/(n-e),u=2*s/(i-r),h=(n+e)/(n-e),f=(i+r)/(i-r);let p,_;if(a===yi)p=-(o+s)/(o-s),_=-2*o*s/(o-s);else if(a===ql)p=-o/(o-s),_=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=u,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=_,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,n,i,r,s,o,a=yi){const l=this.elements,c=1/(n-e),u=1/(i-r),h=1/(o-s),f=(n+e)*c,p=(i+r)*u;let _,v;if(a===yi)_=(o+s)*h,v=-2*h;else if(a===ql)_=s*h,v=-1*h;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-f,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=v,l[14]=-_,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<16;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<16;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e[n+9]=i[9],e[n+10]=i[10],e[n+11]=i[11],e[n+12]=i[12],e[n+13]=i[13],e[n+14]=i[14],e[n+15]=i[15],e}}const Qr=new D,Bn=new nt,zS=new D(0,0,0),HS=new D(1,1,1),Fi=new D,za=new D,pn=new D,Jp=new nt,Qp=new ha;class ai{constructor(e=0,n=0,i=0,r=ai.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=n,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,n,i,r=this._order){return this._x=e,this._y=n,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,n=this._order,i=!0){const r=e.elements,s=r[0],o=r[4],a=r[8],l=r[1],c=r[5],u=r[9],h=r[2],f=r[6],p=r[10];switch(n){case"XYZ":this._y=Math.asin(Zt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,p),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Zt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,s),this._z=0);break;case"ZXY":this._x=Math.asin(Zt(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-h,p),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-Zt(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(f,p),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Zt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,s)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-Zt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-u,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,n,i){return Jp.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Jp,n,i)}setFromVector3(e,n=this._order){return this.set(e.x,e.y,e.z,n)}reorder(e){return Qp.setFromEuler(this),this.setFromQuaternion(Qp,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ai.DEFAULT_ORDER="XYZ";class pf{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let VS=0;const em=new D,es=new ha,hi=new nt,Ha=new D,fo=new D,GS=new D,WS=new ha,tm=new D(1,0,0),nm=new D(0,1,0),im=new D(0,0,1),rm={type:"added"},jS={type:"removed"},ts={type:"childadded",child:null},nu={type:"childremoved",child:null};class Gt extends Zs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:VS++}),this.uuid=Js(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Gt.DEFAULT_UP.clone();const e=new D,n=new ai,i=new ha,r=new D(1,1,1);function s(){i.setFromEuler(n,!1)}function o(){n.setFromQuaternion(i,void 0,!1)}n._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new nt},normalMatrix:{value:new ke}}),this.matrix=new nt,this.matrixWorld=new nt,this.matrixAutoUpdate=Gt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Gt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new pf,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,n){this.quaternion.setFromAxisAngle(e,n)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,n){return es.setFromAxisAngle(e,n),this.quaternion.multiply(es),this}rotateOnWorldAxis(e,n){return es.setFromAxisAngle(e,n),this.quaternion.premultiply(es),this}rotateX(e){return this.rotateOnAxis(tm,e)}rotateY(e){return this.rotateOnAxis(nm,e)}rotateZ(e){return this.rotateOnAxis(im,e)}translateOnAxis(e,n){return em.copy(e).applyQuaternion(this.quaternion),this.position.add(em.multiplyScalar(n)),this}translateX(e){return this.translateOnAxis(tm,e)}translateY(e){return this.translateOnAxis(nm,e)}translateZ(e){return this.translateOnAxis(im,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(hi.copy(this.matrixWorld).invert())}lookAt(e,n,i){e.isVector3?Ha.copy(e):Ha.set(e,n,i);const r=this.parent;this.updateWorldMatrix(!0,!1),fo.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?hi.lookAt(fo,Ha,this.up):hi.lookAt(Ha,fo,this.up),this.quaternion.setFromRotationMatrix(hi),r&&(hi.extractRotation(r.matrixWorld),es.setFromRotationMatrix(hi),this.quaternion.premultiply(es.invert()))}add(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(rm),ts.child=e,this.dispatchEvent(ts),ts.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const n=this.children.indexOf(e);return n!==-1&&(e.parent=null,this.children.splice(n,1),e.dispatchEvent(jS),nu.child=e,this.dispatchEvent(nu),nu.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),hi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),hi.multiply(e.parent.matrixWorld)),e.applyMatrix4(hi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(rm),ts.child=e,this.dispatchEvent(ts),ts.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,n){if(this[e]===n)return this;for(let i=0,r=this.children.length;i<r;i++){const o=this.children[i].getObjectByProperty(e,n);if(o!==void 0)return o}}getObjectsByProperty(e,n,i=[]){this[e]===n&&i.push(this);const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(e,n,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(fo,e,GS),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(fo,WS,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const n=this.matrixWorld.elements;return e.set(n[8],n[9],n[10]).normalize()}raycast(){}traverse(e){e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverseVisible(e)}traverseAncestors(e){const n=this.parent;n!==null&&(e(n),n.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].updateMatrixWorld(e)}updateWorldMatrix(e,n){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),n===!0){const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const n=e===void 0||typeof e=="string",i={};n&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const h=l[c];s(e.shapes,h)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(e.materials,this.material[l]));r.material=a}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];r.animations.push(s(e.animations,l))}}if(n){const a=o(e.geometries),l=o(e.materials),c=o(e.textures),u=o(e.images),h=o(e.shapes),f=o(e.skeletons),p=o(e.animations),_=o(e.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),h.length>0&&(i.shapes=h),f.length>0&&(i.skeletons=f),p.length>0&&(i.animations=p),_.length>0&&(i.nodes=_)}return i.object=r,i;function o(a){const l=[];for(const c in a){const u=a[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,n=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),n===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}Gt.DEFAULT_UP=new D(0,1,0);Gt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Gt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const zn=new D,fi=new D,iu=new D,pi=new D,ns=new D,is=new D,sm=new D,ru=new D,su=new D,ou=new D,au=new rt,lu=new rt,cu=new rt;class jn{constructor(e=new D,n=new D,i=new D){this.a=e,this.b=n,this.c=i}static getNormal(e,n,i,r){r.subVectors(i,n),zn.subVectors(e,n),r.cross(zn);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,n,i,r,s){zn.subVectors(r,n),fi.subVectors(i,n),iu.subVectors(e,n);const o=zn.dot(zn),a=zn.dot(fi),l=zn.dot(iu),c=fi.dot(fi),u=fi.dot(iu),h=o*c-a*a;if(h===0)return s.set(0,0,0),null;const f=1/h,p=(c*l-a*u)*f,_=(o*u-a*l)*f;return s.set(1-p-_,_,p)}static containsPoint(e,n,i,r){return this.getBarycoord(e,n,i,r,pi)===null?!1:pi.x>=0&&pi.y>=0&&pi.x+pi.y<=1}static getInterpolation(e,n,i,r,s,o,a,l){return this.getBarycoord(e,n,i,r,pi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,pi.x),l.addScaledVector(o,pi.y),l.addScaledVector(a,pi.z),l)}static getInterpolatedAttribute(e,n,i,r,s,o){return au.setScalar(0),lu.setScalar(0),cu.setScalar(0),au.fromBufferAttribute(e,n),lu.fromBufferAttribute(e,i),cu.fromBufferAttribute(e,r),o.setScalar(0),o.addScaledVector(au,s.x),o.addScaledVector(lu,s.y),o.addScaledVector(cu,s.z),o}static isFrontFacing(e,n,i,r){return zn.subVectors(i,n),fi.subVectors(e,n),zn.cross(fi).dot(r)<0}set(e,n,i){return this.a.copy(e),this.b.copy(n),this.c.copy(i),this}setFromPointsAndIndices(e,n,i,r){return this.a.copy(e[n]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,n,i,r){return this.a.fromBufferAttribute(e,n),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return zn.subVectors(this.c,this.b),fi.subVectors(this.a,this.b),zn.cross(fi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return jn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,n){return jn.getBarycoord(e,this.a,this.b,this.c,n)}getInterpolation(e,n,i,r,s){return jn.getInterpolation(e,this.a,this.b,this.c,n,i,r,s)}containsPoint(e){return jn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return jn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,n){const i=this.a,r=this.b,s=this.c;let o,a;ns.subVectors(r,i),is.subVectors(s,i),ru.subVectors(e,i);const l=ns.dot(ru),c=is.dot(ru);if(l<=0&&c<=0)return n.copy(i);su.subVectors(e,r);const u=ns.dot(su),h=is.dot(su);if(u>=0&&h<=u)return n.copy(r);const f=l*h-u*c;if(f<=0&&l>=0&&u<=0)return o=l/(l-u),n.copy(i).addScaledVector(ns,o);ou.subVectors(e,s);const p=ns.dot(ou),_=is.dot(ou);if(_>=0&&p<=_)return n.copy(s);const v=p*c-l*_;if(v<=0&&c>=0&&_<=0)return a=c/(c-_),n.copy(i).addScaledVector(is,a);const m=u*_-p*h;if(m<=0&&h-u>=0&&p-_>=0)return sm.subVectors(s,r),a=(h-u)/(h-u+(p-_)),n.copy(r).addScaledVector(sm,a);const d=1/(m+v+f);return o=v*d,a=f*d,n.copy(i).addScaledVector(ns,o).addScaledVector(is,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Dv={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Oi={h:0,s:0,l:0},Va={h:0,s:0,l:0};function uu(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+(e-t)*6*n:n<1/2?e:n<2/3?t+(e-t)*6*(2/3-n):t}class ge{constructor(e,n,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,n,i)}set(e,n,i){if(n===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,n,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,n=zt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ye.toWorkingColorSpace(this,n),this}setRGB(e,n,i,r=Ye.workingColorSpace){return this.r=e,this.g=n,this.b=i,Ye.toWorkingColorSpace(this,r),this}setHSL(e,n,i,r=Ye.workingColorSpace){if(e=ff(e,1),n=Zt(n,0,1),i=Zt(i,0,1),n===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+n):i+n-i*n,o=2*i-s;this.r=uu(o,s,e+1/3),this.g=uu(o,s,e),this.b=uu(o,s,e-1/3)}return Ye.toWorkingColorSpace(this,r),this}setStyle(e,n=zt){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,n);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,n);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,n);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,n);if(o===6)return this.setHex(parseInt(s,16),n);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,n);return this}setColorName(e,n=zt){const i=Dv[e.toLowerCase()];return i!==void 0?this.setHex(i,n):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ei(e.r),this.g=Ei(e.g),this.b=Ei(e.b),this}copyLinearToSRGB(e){return this.r=Ls(e.r),this.g=Ls(e.g),this.b=Ls(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=zt){return Ye.fromWorkingColorSpace(qt.copy(this),e),Math.round(Zt(qt.r*255,0,255))*65536+Math.round(Zt(qt.g*255,0,255))*256+Math.round(Zt(qt.b*255,0,255))}getHexString(e=zt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,n=Ye.workingColorSpace){Ye.fromWorkingColorSpace(qt.copy(this),n);const i=qt.r,r=qt.g,s=qt.b,o=Math.max(i,r,s),a=Math.min(i,r,s);let l,c;const u=(a+o)/2;if(a===o)l=0,c=0;else{const h=o-a;switch(c=u<=.5?h/(o+a):h/(2-o-a),o){case i:l=(r-s)/h+(r<s?6:0);break;case r:l=(s-i)/h+2;break;case s:l=(i-r)/h+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,n=Ye.workingColorSpace){return Ye.fromWorkingColorSpace(qt.copy(this),n),e.r=qt.r,e.g=qt.g,e.b=qt.b,e}getStyle(e=zt){Ye.fromWorkingColorSpace(qt.copy(this),e);const n=qt.r,i=qt.g,r=qt.b;return e!==zt?`color(${e} ${n.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,n,i){return this.getHSL(Oi),this.setHSL(Oi.h+e,Oi.s+n,Oi.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,n){return this.r=e.r+n.r,this.g=e.g+n.g,this.b=e.b+n.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,n){return this.r+=(e.r-this.r)*n,this.g+=(e.g-this.g)*n,this.b+=(e.b-this.b)*n,this}lerpColors(e,n,i){return this.r=e.r+(n.r-e.r)*i,this.g=e.g+(n.g-e.g)*i,this.b=e.b+(n.b-e.b)*i,this}lerpHSL(e,n){this.getHSL(Oi),e.getHSL(Va);const i=Fo(Oi.h,Va.h,n),r=Fo(Oi.s,Va.s,n),s=Fo(Oi.l,Va.l,n);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const n=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*n+s[3]*i+s[6]*r,this.g=s[1]*n+s[4]*i+s[7]*r,this.b=s[2]*n+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,n=0){return this.r=e[n],this.g=e[n+1],this.b=e[n+2],this}toArray(e=[],n=0){return e[n]=this.r,e[n+1]=this.g,e[n+2]=this.b,e}fromBufferAttribute(e,n){return this.r=e.getX(n),this.g=e.getY(n),this.b=e.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const qt=new ge;ge.NAMES=Dv;let XS=0;class jr extends Zs{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:XS++}),this.uuid=Js(),this.name="",this.blending=Ps,this.side=or,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Sd,this.blendDst=Md,this.blendEquation=Mr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ge(0,0,0),this.blendAlpha=0,this.depthFunc=zs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Hp,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Yr,this.stencilZFail=Yr,this.stencilZPass=Yr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const n in e){const i=e[n];if(i===void 0){console.warn(`THREE.Material: parameter '${n}' has value of undefined.`);continue}const r=this[n];if(r===void 0){console.warn(`THREE.Material: '${n}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[n]=i}}toJSON(e){const n=e===void 0||typeof e=="string";n&&(e={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Ps&&(i.blending=this.blending),this.side!==or&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Sd&&(i.blendSrc=this.blendSrc),this.blendDst!==Md&&(i.blendDst=this.blendDst),this.blendEquation!==Mr&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==zs&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Hp&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Yr&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Yr&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Yr&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const o=[];for(const a in s){const l=s[a];delete l.metadata,o.push(l)}return o}if(n){const s=r(e.textures),o=r(e.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const n=e.clippingPlanes;let i=null;if(n!==null){const r=n.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=n[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Lv extends jr{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new ge(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ai,this.combine=pv,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const At=new D,Ga=new je;class Et{constructor(e,n,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=n,this.count=e!==void 0?e.length/n:0,this.normalized=i,this.usage=Vp,this.updateRanges=[],this.gpuType=ii,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,n,i){e*=this.itemSize,i*=n.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=n.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let n=0,i=this.count;n<i;n++)Ga.fromBufferAttribute(this,n),Ga.applyMatrix3(e),this.setXY(n,Ga.x,Ga.y);else if(this.itemSize===3)for(let n=0,i=this.count;n<i;n++)At.fromBufferAttribute(this,n),At.applyMatrix3(e),this.setXYZ(n,At.x,At.y,At.z);return this}applyMatrix4(e){for(let n=0,i=this.count;n<i;n++)At.fromBufferAttribute(this,n),At.applyMatrix4(e),this.setXYZ(n,At.x,At.y,At.z);return this}applyNormalMatrix(e){for(let n=0,i=this.count;n<i;n++)At.fromBufferAttribute(this,n),At.applyNormalMatrix(e),this.setXYZ(n,At.x,At.y,At.z);return this}transformDirection(e){for(let n=0,i=this.count;n<i;n++)At.fromBufferAttribute(this,n),At.transformDirection(e),this.setXYZ(n,At.x,At.y,At.z);return this}set(e,n=0){return this.array.set(e,n),this}getComponent(e,n){let i=this.array[e*this.itemSize+n];return this.normalized&&(i=cs(i,this.array)),i}setComponent(e,n,i){return this.normalized&&(i=en(i,this.array)),this.array[e*this.itemSize+n]=i,this}getX(e){let n=this.array[e*this.itemSize];return this.normalized&&(n=cs(n,this.array)),n}setX(e,n){return this.normalized&&(n=en(n,this.array)),this.array[e*this.itemSize]=n,this}getY(e){let n=this.array[e*this.itemSize+1];return this.normalized&&(n=cs(n,this.array)),n}setY(e,n){return this.normalized&&(n=en(n,this.array)),this.array[e*this.itemSize+1]=n,this}getZ(e){let n=this.array[e*this.itemSize+2];return this.normalized&&(n=cs(n,this.array)),n}setZ(e,n){return this.normalized&&(n=en(n,this.array)),this.array[e*this.itemSize+2]=n,this}getW(e){let n=this.array[e*this.itemSize+3];return this.normalized&&(n=cs(n,this.array)),n}setW(e,n){return this.normalized&&(n=en(n,this.array)),this.array[e*this.itemSize+3]=n,this}setXY(e,n,i){return e*=this.itemSize,this.normalized&&(n=en(n,this.array),i=en(i,this.array)),this.array[e+0]=n,this.array[e+1]=i,this}setXYZ(e,n,i,r){return e*=this.itemSize,this.normalized&&(n=en(n,this.array),i=en(i,this.array),r=en(r,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,n,i,r,s){return e*=this.itemSize,this.normalized&&(n=en(n,this.array),i=en(i,this.array),r=en(r,this.array),s=en(s,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Vp&&(e.usage=this.usage),e}}class Nv extends Et{constructor(e,n,i){super(new Uint16Array(e),n,i)}}class Iv extends Et{constructor(e,n,i){super(new Uint32Array(e),n,i)}}class Dt extends Et{constructor(e,n,i){super(new Float32Array(e),n,i)}}let KS=0;const Cn=new nt,du=new Gt,rs=new D,mn=new Gr,po=new Gr,Ut=new D;class bt extends Zs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:KS++}),this.uuid=Js(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(bv(e)?Iv:Nv)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,n){return this.attributes[e]=n,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,n,i=0){this.groups.push({start:e,count:n,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,n){this.drawRange.start=e,this.drawRange.count=n}applyMatrix4(e){const n=this.attributes.position;n!==void 0&&(n.applyMatrix4(e),n.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new ke().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Cn.makeRotationFromQuaternion(e),this.applyMatrix4(Cn),this}rotateX(e){return Cn.makeRotationX(e),this.applyMatrix4(Cn),this}rotateY(e){return Cn.makeRotationY(e),this.applyMatrix4(Cn),this}rotateZ(e){return Cn.makeRotationZ(e),this.applyMatrix4(Cn),this}translate(e,n,i){return Cn.makeTranslation(e,n,i),this.applyMatrix4(Cn),this}scale(e,n,i){return Cn.makeScale(e,n,i),this.applyMatrix4(Cn),this}lookAt(e){return du.lookAt(e),du.updateMatrix(),this.applyMatrix4(du.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(rs).negate(),this.translate(rs.x,rs.y,rs.z),this}setFromPoints(e){const n=this.getAttribute("position");if(n===void 0){const i=[];for(let r=0,s=e.length;r<s;r++){const o=e[r];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Dt(i,3))}else{for(let i=0,r=n.count;i<r;i++){const s=e[i];n.setXYZ(i,s.x,s.y,s.z||0)}e.length>n.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),n.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Gr);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),n)for(let i=0,r=n.length;i<r;i++){const s=n[i];mn.setFromBufferAttribute(s),this.morphTargetsRelative?(Ut.addVectors(this.boundingBox.min,mn.min),this.boundingBox.expandByPoint(Ut),Ut.addVectors(this.boundingBox.max,mn.max),this.boundingBox.expandByPoint(Ut)):(this.boundingBox.expandByPoint(mn.min),this.boundingBox.expandByPoint(mn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Wr);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new D,1/0);return}if(e){const i=this.boundingSphere.center;if(mn.setFromBufferAttribute(e),n)for(let s=0,o=n.length;s<o;s++){const a=n[s];po.setFromBufferAttribute(a),this.morphTargetsRelative?(Ut.addVectors(mn.min,po.min),mn.expandByPoint(Ut),Ut.addVectors(mn.max,po.max),mn.expandByPoint(Ut)):(mn.expandByPoint(po.min),mn.expandByPoint(po.max))}mn.getCenter(i);let r=0;for(let s=0,o=e.count;s<o;s++)Ut.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(Ut));if(n)for(let s=0,o=n.length;s<o;s++){const a=n[s],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)Ut.fromBufferAttribute(a,c),l&&(rs.fromBufferAttribute(e,c),Ut.add(rs)),r=Math.max(r,i.distanceToSquared(Ut))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,n=this.attributes;if(e===null||n.position===void 0||n.normal===void 0||n.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=n.position,r=n.normal,s=n.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Et(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let b=0;b<i.count;b++)a[b]=new D,l[b]=new D;const c=new D,u=new D,h=new D,f=new je,p=new je,_=new je,v=new D,m=new D;function d(b,w,M){c.fromBufferAttribute(i,b),u.fromBufferAttribute(i,w),h.fromBufferAttribute(i,M),f.fromBufferAttribute(s,b),p.fromBufferAttribute(s,w),_.fromBufferAttribute(s,M),u.sub(c),h.sub(c),p.sub(f),_.sub(f);const P=1/(p.x*_.y-_.x*p.y);isFinite(P)&&(v.copy(u).multiplyScalar(_.y).addScaledVector(h,-p.y).multiplyScalar(P),m.copy(h).multiplyScalar(p.x).addScaledVector(u,-_.x).multiplyScalar(P),a[b].add(v),a[w].add(v),a[M].add(v),l[b].add(m),l[w].add(m),l[M].add(m))}let g=this.groups;g.length===0&&(g=[{start:0,count:e.count}]);for(let b=0,w=g.length;b<w;++b){const M=g[b],P=M.start,V=M.count;for(let B=P,G=P+V;B<G;B+=3)d(e.getX(B+0),e.getX(B+1),e.getX(B+2))}const x=new D,y=new D,R=new D,C=new D;function A(b){R.fromBufferAttribute(r,b),C.copy(R);const w=a[b];x.copy(w),x.sub(R.multiplyScalar(R.dot(w))).normalize(),y.crossVectors(C,w);const P=y.dot(l[b])<0?-1:1;o.setXYZW(b,x.x,x.y,x.z,P)}for(let b=0,w=g.length;b<w;++b){const M=g[b],P=M.start,V=M.count;for(let B=P,G=P+V;B<G;B+=3)A(e.getX(B+0)),A(e.getX(B+1)),A(e.getX(B+2))}}computeVertexNormals(){const e=this.index,n=this.getAttribute("position");if(n!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Et(new Float32Array(n.count*3),3),this.setAttribute("normal",i);else for(let f=0,p=i.count;f<p;f++)i.setXYZ(f,0,0,0);const r=new D,s=new D,o=new D,a=new D,l=new D,c=new D,u=new D,h=new D;if(e)for(let f=0,p=e.count;f<p;f+=3){const _=e.getX(f+0),v=e.getX(f+1),m=e.getX(f+2);r.fromBufferAttribute(n,_),s.fromBufferAttribute(n,v),o.fromBufferAttribute(n,m),u.subVectors(o,s),h.subVectors(r,s),u.cross(h),a.fromBufferAttribute(i,_),l.fromBufferAttribute(i,v),c.fromBufferAttribute(i,m),a.add(u),l.add(u),c.add(u),i.setXYZ(_,a.x,a.y,a.z),i.setXYZ(v,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let f=0,p=n.count;f<p;f+=3)r.fromBufferAttribute(n,f+0),s.fromBufferAttribute(n,f+1),o.fromBufferAttribute(n,f+2),u.subVectors(o,s),h.subVectors(r,s),u.cross(h),i.setXYZ(f+0,u.x,u.y,u.z),i.setXYZ(f+1,u.x,u.y,u.z),i.setXYZ(f+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let n=0,i=e.count;n<i;n++)Ut.fromBufferAttribute(e,n),Ut.normalize(),e.setXYZ(n,Ut.x,Ut.y,Ut.z)}toNonIndexed(){function e(a,l){const c=a.array,u=a.itemSize,h=a.normalized,f=new c.constructor(l.length*u);let p=0,_=0;for(let v=0,m=l.length;v<m;v++){a.isInterleavedBufferAttribute?p=l[v]*a.data.stride+a.offset:p=l[v]*u;for(let d=0;d<u;d++)f[_++]=c[p++]}return new Et(f,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const n=new bt,i=this.index.array,r=this.attributes;for(const a in r){const l=r[a],c=e(l,i);n.setAttribute(a,c)}const s=this.morphAttributes;for(const a in s){const l=[],c=s[a];for(let u=0,h=c.length;u<h;u++){const f=c[u],p=e(f,i);l.push(p)}n.morphAttributes[a]=l}n.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];n.addGroup(c.start,c.count,c.materialIndex)}return n}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const n=this.index;n!==null&&(e.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let h=0,f=c.length;h<f;h++){const p=c[h];u.push(p.toJSON(e.data))}u.length>0&&(r[l]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const n={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone(n));const r=e.attributes;for(const c in r){const u=r[c];this.setAttribute(c,u.clone(n))}const s=e.morphAttributes;for(const c in s){const u=[],h=s[c];for(let f=0,p=h.length;f<p;f++)u.push(h[f].clone(n));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let c=0,u=o.length;c<u;c++){const h=o[c];this.addGroup(h.start,h.count,h.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const om=new nt,pr=new xc,Wa=new Wr,am=new D,ja=new D,Xa=new D,Ka=new D,hu=new D,Ya=new D,lm=new D,qa=new D;class Tt extends Gt{constructor(e=new bt,n=new Lv){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,n){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;n.fromBufferAttribute(r,e);const a=this.morphTargetInfluences;if(s&&a){Ya.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const u=a[l],h=s[l];u!==0&&(hu.fromBufferAttribute(h,e),o?Ya.addScaledVector(hu,u):Ya.addScaledVector(hu.sub(n),u))}n.add(Ya)}return n}raycast(e,n){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Wa.copy(i.boundingSphere),Wa.applyMatrix4(s),pr.copy(e.ray).recast(e.near),!(Wa.containsPoint(pr.origin)===!1&&(pr.intersectSphere(Wa,am)===null||pr.origin.distanceToSquared(am)>(e.far-e.near)**2))&&(om.copy(s).invert(),pr.copy(e.ray).applyMatrix4(om),!(i.boundingBox!==null&&pr.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,n,pr)))}_computeIntersections(e,n,i){let r;const s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,h=s.attributes.normal,f=s.groups,p=s.drawRange;if(a!==null)if(Array.isArray(o))for(let _=0,v=f.length;_<v;_++){const m=f[_],d=o[m.materialIndex],g=Math.max(m.start,p.start),x=Math.min(a.count,Math.min(m.start+m.count,p.start+p.count));for(let y=g,R=x;y<R;y+=3){const C=a.getX(y),A=a.getX(y+1),b=a.getX(y+2);r=$a(this,d,e,i,c,u,h,C,A,b),r&&(r.faceIndex=Math.floor(y/3),r.face.materialIndex=m.materialIndex,n.push(r))}}else{const _=Math.max(0,p.start),v=Math.min(a.count,p.start+p.count);for(let m=_,d=v;m<d;m+=3){const g=a.getX(m),x=a.getX(m+1),y=a.getX(m+2);r=$a(this,o,e,i,c,u,h,g,x,y),r&&(r.faceIndex=Math.floor(m/3),n.push(r))}}else if(l!==void 0)if(Array.isArray(o))for(let _=0,v=f.length;_<v;_++){const m=f[_],d=o[m.materialIndex],g=Math.max(m.start,p.start),x=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let y=g,R=x;y<R;y+=3){const C=y,A=y+1,b=y+2;r=$a(this,d,e,i,c,u,h,C,A,b),r&&(r.faceIndex=Math.floor(y/3),r.face.materialIndex=m.materialIndex,n.push(r))}}else{const _=Math.max(0,p.start),v=Math.min(l.count,p.start+p.count);for(let m=_,d=v;m<d;m+=3){const g=m,x=m+1,y=m+2;r=$a(this,o,e,i,c,u,h,g,x,y),r&&(r.faceIndex=Math.floor(m/3),n.push(r))}}}}function YS(t,e,n,i,r,s,o,a){let l;if(e.side===Vt?l=i.intersectTriangle(o,s,r,!0,a):l=i.intersectTriangle(r,s,o,e.side===or,a),l===null)return null;qa.copy(a),qa.applyMatrix4(t.matrixWorld);const c=n.ray.origin.distanceTo(qa);return c<n.near||c>n.far?null:{distance:c,point:qa.clone(),object:t}}function $a(t,e,n,i,r,s,o,a,l,c){t.getVertexPosition(a,ja),t.getVertexPosition(l,Xa),t.getVertexPosition(c,Ka);const u=YS(t,e,n,i,ja,Xa,Ka,lm);if(u){const h=new D;jn.getBarycoord(lm,ja,Xa,Ka,h),r&&(u.uv=jn.getInterpolatedAttribute(r,a,l,c,h,new je)),s&&(u.uv1=jn.getInterpolatedAttribute(s,a,l,c,h,new je)),o&&(u.normal=jn.getInterpolatedAttribute(o,a,l,c,h,new D),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const f={a,b:l,c,normal:new D,materialIndex:0};jn.getNormal(ja,Xa,Ka,f.normal),u.face=f,u.barycoord=h}return u}class fa extends bt{constructor(e=1,n=1,i=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:n,depth:i,widthSegments:r,heightSegments:s,depthSegments:o};const a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);const l=[],c=[],u=[],h=[];let f=0,p=0;_("z","y","x",-1,-1,i,n,e,o,s,0),_("z","y","x",1,-1,i,n,-e,o,s,1),_("x","z","y",1,1,e,i,n,r,o,2),_("x","z","y",1,-1,e,i,-n,r,o,3),_("x","y","z",1,-1,e,n,i,r,s,4),_("x","y","z",-1,-1,e,n,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new Dt(c,3)),this.setAttribute("normal",new Dt(u,3)),this.setAttribute("uv",new Dt(h,2));function _(v,m,d,g,x,y,R,C,A,b,w){const M=y/A,P=R/b,V=y/2,B=R/2,G=C/2,J=A+1,W=b+1;let ee=0,L=0;const K=new D;for(let q=0;q<W;q++){const ae=q*P-B;for(let ye=0;ye<J;ye++){const Ve=ye*M-V;K[v]=Ve*g,K[m]=ae*x,K[d]=G,c.push(K.x,K.y,K.z),K[v]=0,K[m]=0,K[d]=C>0?1:-1,u.push(K.x,K.y,K.z),h.push(ye/A),h.push(1-q/b),ee+=1}}for(let q=0;q<b;q++)for(let ae=0;ae<A;ae++){const ye=f+ae+J*q,Ve=f+ae+J*(q+1),j=f+(ae+1)+J*(q+1),ne=f+(ae+1)+J*q;l.push(ye,Ve,ne),l.push(Ve,j,ne),L+=6}a.addGroup(p,L,w),p+=L,f+=ee}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new fa(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function js(t){const e={};for(const n in t){e[n]={};for(const i in t[n]){const r=t[n][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[n][i]=null):e[n][i]=r.clone():Array.isArray(r)?e[n][i]=r.slice():e[n][i]=r}}return e}function tn(t){const e={};for(let n=0;n<t.length;n++){const i=js(t[n]);for(const r in i)e[r]=i[r]}return e}function qS(t){const e=[];for(let n=0;n<t.length;n++)e.push(t[n].clone());return e}function Uv(t){const e=t.getRenderTarget();return e===null?t.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ye.workingColorSpace}const $S={clone:js,merge:tn};var ZS=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,JS=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Lt extends jr{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=ZS,this.fragmentShader=JS,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=js(e.uniforms),this.uniformsGroups=qS(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const n=super.toJSON(e);n.glslVersion=this.glslVersion,n.uniforms={};for(const r in this.uniforms){const o=this.uniforms[r].value;o&&o.isTexture?n.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?n.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?n.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?n.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?n.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?n.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?n.uniforms[r]={type:"m4",value:o.toArray()}:n.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(n.extensions=i),n}}class Fv extends Gt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new nt,this.projectionMatrix=new nt,this.projectionMatrixInverse=new nt,this.coordinateSystem=yi}copy(e,n){return super.copy(e,n),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,n){super.updateWorldMatrix(e,n),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const ki=new D,cm=new je,um=new je;class xn extends Fv{constructor(e=50,n=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const n=.5*this.getFilmHeight()/e;this.fov=na*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Uo*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return na*2*Math.atan(Math.tan(Uo*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,n,i){ki.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ki.x,ki.y).multiplyScalar(-e/ki.z),ki.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(ki.x,ki.y).multiplyScalar(-e/ki.z)}getViewSize(e,n){return this.getViewBounds(e,cm,um),n.subVectors(um,cm)}setViewOffset(e,n,i,r,s,o){this.aspect=e/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let n=e*Math.tan(Uo*.5*this.fov)/this.zoom,i=2*n,r=this.aspect*i,s=-.5*r;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*r/l,n-=o.offsetY*i/c,r*=o.width/l,i*=o.height/c}const a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,n,n-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}}const ss=-90,os=1;class QS extends Gt{constructor(e,n,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new xn(ss,os,e,n);r.layers=this.layers,this.add(r);const s=new xn(ss,os,e,n);s.layers=this.layers,this.add(s);const o=new xn(ss,os,e,n);o.layers=this.layers,this.add(o);const a=new xn(ss,os,e,n);a.layers=this.layers,this.add(a);const l=new xn(ss,os,e,n);l.layers=this.layers,this.add(l);const c=new xn(ss,os,e,n);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,n=this.children.concat(),[i,r,s,o,a,l]=n;for(const c of n)this.remove(c);if(e===yi)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===ql)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of n)this.add(c),c.updateMatrixWorld()}update(e,n){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,o,a,l,c,u]=this.children,h=e.getRenderTarget(),f=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),_=e.xr.enabled;e.xr.enabled=!1;const v=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,r),e.render(n,s),e.setRenderTarget(i,1,r),e.render(n,o),e.setRenderTarget(i,2,r),e.render(n,a),e.setRenderTarget(i,3,r),e.render(n,l),e.setRenderTarget(i,4,r),e.render(n,c),i.texture.generateMipmaps=v,e.setRenderTarget(i,5,r),e.render(n,u),e.setRenderTarget(h,f,p),e.xr.enabled=_,i.texture.needsPMREMUpdate=!0}}class Ov extends kt{constructor(e,n,i,r,s,o,a,l,c,u){e=e!==void 0?e:[],n=n!==void 0?n:Hs,super(e,n,i,r,s,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class eM extends zr{constructor(e=1,n={}){super(e,e,n),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new Ov(r,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=n.generateMipmaps!==void 0?n.generateMipmaps:!1,this.texture.minFilter=n.minFilter!==void 0?n.minFilter:yn}fromEquirectangularTexture(e,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new fa(5,5,5),s=new Lt({name:"CubemapFromEquirect",uniforms:js(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Vt,blending:nr});s.uniforms.tEquirect.value=n;const o=new Tt(r,s),a=n.minFilter;return n.minFilter===ni&&(n.minFilter=yn),new QS(1,10,this).update(e,o),n.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,n,i,r){const s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(n,i,r);e.setRenderTarget(s)}}const fu=new D,tM=new D,nM=new ke;class yr{constructor(e=new D(1,0,0),n=0){this.isPlane=!0,this.normal=e,this.constant=n}set(e,n){return this.normal.copy(e),this.constant=n,this}setComponents(e,n,i,r){return this.normal.set(e,n,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,n){return this.normal.copy(e),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(e,n,i){const r=fu.subVectors(i,n).cross(tM.subVectors(e,n)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,n){return n.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,n){const i=e.delta(fu),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?n.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:n.copy(e.start).addScaledVector(i,s)}intersectsLine(e){const n=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return n<0&&i>0||i<0&&n>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,n){const i=n||nM.getNormalMatrix(e),r=this.coplanarPoint(fu).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const mr=new Wr,Za=new D;class mf{constructor(e=new yr,n=new yr,i=new yr,r=new yr,s=new yr,o=new yr){this.planes=[e,n,i,r,s,o]}set(e,n,i,r,s,o){const a=this.planes;return a[0].copy(e),a[1].copy(n),a[2].copy(i),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(e){const n=this.planes;for(let i=0;i<6;i++)n[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,n=yi){const i=this.planes,r=e.elements,s=r[0],o=r[1],a=r[2],l=r[3],c=r[4],u=r[5],h=r[6],f=r[7],p=r[8],_=r[9],v=r[10],m=r[11],d=r[12],g=r[13],x=r[14],y=r[15];if(i[0].setComponents(l-s,f-c,m-p,y-d).normalize(),i[1].setComponents(l+s,f+c,m+p,y+d).normalize(),i[2].setComponents(l+o,f+u,m+_,y+g).normalize(),i[3].setComponents(l-o,f-u,m-_,y-g).normalize(),i[4].setComponents(l-a,f-h,m-v,y-x).normalize(),n===yi)i[5].setComponents(l+a,f+h,m+v,y+x).normalize();else if(n===ql)i[5].setComponents(a,h,v,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),mr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const n=e.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),mr.copy(n.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(mr)}intersectsSprite(e){return mr.center.set(0,0,0),mr.radius=.7071067811865476,mr.applyMatrix4(e.matrixWorld),this.intersectsSphere(mr)}intersectsSphere(e){const n=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(n[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const n=this.planes;for(let i=0;i<6;i++){const r=n[i];if(Za.x=r.normal.x>0?e.max.x:e.min.x,Za.y=r.normal.y>0?e.max.y:e.min.y,Za.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Za)<0)return!1}return!0}containsPoint(e){const n=this.planes;for(let i=0;i<6;i++)if(n[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function kv(){let t=null,e=!1,n=null,i=null;function r(s,o){n(s,o),i=t.requestAnimationFrame(r)}return{start:function(){e!==!0&&n!==null&&(i=t.requestAnimationFrame(r),e=!0)},stop:function(){t.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){n=s},setContext:function(s){t=s}}}function iM(t){const e=new WeakMap;function n(a,l){const c=a.array,u=a.usage,h=c.byteLength,f=t.createBuffer();t.bindBuffer(l,f),t.bufferData(l,c,u),a.onUploadCallback();let p;if(c instanceof Float32Array)p=t.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?p=t.HALF_FLOAT:p=t.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=t.SHORT;else if(c instanceof Uint32Array)p=t.UNSIGNED_INT;else if(c instanceof Int32Array)p=t.INT;else if(c instanceof Int8Array)p=t.BYTE;else if(c instanceof Uint8Array)p=t.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=t.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:h}}function i(a,l,c){const u=l.array,h=l.updateRanges;if(t.bindBuffer(c,a),h.length===0)t.bufferSubData(c,0,u);else{h.sort((p,_)=>p.start-_.start);let f=0;for(let p=1;p<h.length;p++){const _=h[f],v=h[p];v.start<=_.start+_.count+1?_.count=Math.max(_.count,v.start+v.count-_.start):(++f,h[f]=v)}h.length=f+1;for(let p=0,_=h.length;p<_;p++){const v=h[p];t.bufferSubData(c,v.start*u.BYTES_PER_ELEMENT,u,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=e.get(a);l&&(t.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=e.get(a);if(c===void 0)e.set(a,n(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,a,l),c.version=a.version}}return{get:r,remove:s,update:o}}class pa extends bt{constructor(e=1,n=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:n,widthSegments:i,heightSegments:r};const s=e/2,o=n/2,a=Math.floor(i),l=Math.floor(r),c=a+1,u=l+1,h=e/a,f=n/l,p=[],_=[],v=[],m=[];for(let d=0;d<u;d++){const g=d*f-o;for(let x=0;x<c;x++){const y=x*h-s;_.push(y,-g,0),v.push(0,0,1),m.push(x/a),m.push(1-d/l)}}for(let d=0;d<l;d++)for(let g=0;g<a;g++){const x=g+c*d,y=g+c*(d+1),R=g+1+c*(d+1),C=g+1+c*d;p.push(x,y,C),p.push(y,R,C)}this.setIndex(p),this.setAttribute("position",new Dt(_,3)),this.setAttribute("normal",new Dt(v,3)),this.setAttribute("uv",new Dt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new pa(e.width,e.height,e.widthSegments,e.heightSegments)}}var rM=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,sM=`#ifdef USE_ALPHAHASH
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
#endif`,oM=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,aM=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,lM=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,cM=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,uM=`#ifdef USE_AOMAP
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
#endif`,dM=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,hM=`#ifdef USE_BATCHING
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
#endif`,fM=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,pM=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,mM=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,gM=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,vM=`#ifdef USE_IRIDESCENCE
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
#endif`,xM=`#ifdef USE_BUMPMAP
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
#endif`,_M=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,yM=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,SM=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,MM=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,EM=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,wM=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,TM=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,AM=`#if defined( USE_COLOR_ALPHA )
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
#endif`,CM=`#define PI 3.141592653589793
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
} // validated`,bM=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,RM=`vec3 transformedNormal = objectNormal;
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
#endif`,PM=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,DM=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,LM=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,NM=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,IM="gl_FragColor = linearToOutputTexel( gl_FragColor );",UM=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,FM=`#ifdef USE_ENVMAP
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
#endif`,OM=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,kM=`#ifdef USE_ENVMAP
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
#endif`,BM=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,zM=`#ifdef USE_ENVMAP
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
#endif`,HM=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,VM=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,GM=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,WM=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,jM=`#ifdef USE_GRADIENTMAP
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
}`,XM=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,KM=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,YM=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,qM=`uniform bool receiveShadow;
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
#endif`,$M=`#ifdef USE_ENVMAP
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
#endif`,ZM=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,JM=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,QM=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,e1=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,t1=`PhysicalMaterial material;
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
#endif`,n1=`struct PhysicalMaterial {
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
}`,i1=`
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
#endif`,r1=`#if defined( RE_IndirectDiffuse )
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
#endif`,s1=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,o1=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,a1=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,l1=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,c1=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,u1=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,d1=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,h1=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,f1=`#if defined( USE_POINTS_UV )
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
#endif`,p1=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,m1=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,g1=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,v1=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,x1=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,_1=`#ifdef USE_MORPHTARGETS
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
#endif`,y1=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,S1=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,M1=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,E1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,w1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,T1=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,A1=`#ifdef USE_NORMALMAP
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
#endif`,C1=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,b1=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,R1=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,P1=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,D1=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,L1=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,N1=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,I1=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,U1=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,F1=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,O1=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,k1=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,B1=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,z1=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,H1=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,V1=`float getShadowMask() {
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
}`,G1=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,W1=`#ifdef USE_SKINNING
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
#endif`,j1=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,X1=`#ifdef USE_SKINNING
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
#endif`,K1=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Y1=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,q1=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,$1=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Z1=`#ifdef USE_TRANSMISSION
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
#endif`,J1=`#ifdef USE_TRANSMISSION
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
#endif`,Q1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,eE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,tE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,nE=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const iE=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,rE=`uniform sampler2D t2D;
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
}`,sE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,oE=`#ifdef ENVMAP_TYPE_CUBE
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
}`,aE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,lE=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cE=`#include <common>
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
}`,uE=`#if DEPTH_PACKING == 3200
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
}`,dE=`#define DISTANCE
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
}`,hE=`#define DISTANCE
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
}`,fE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,pE=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,mE=`uniform float scale;
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
}`,gE=`uniform vec3 diffuse;
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
}`,vE=`#include <common>
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
}`,xE=`uniform vec3 diffuse;
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
}`,_E=`#define LAMBERT
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
}`,yE=`#define LAMBERT
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
}`,SE=`#define MATCAP
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
}`,ME=`#define MATCAP
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
}`,EE=`#define NORMAL
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
}`,wE=`#define NORMAL
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
}`,TE=`#define PHONG
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
}`,AE=`#define PHONG
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
}`,CE=`#define STANDARD
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
}`,bE=`#define STANDARD
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
}`,RE=`#define TOON
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
}`,PE=`#define TOON
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
}`,DE=`uniform float size;
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
}`,LE=`uniform vec3 diffuse;
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
}`,NE=`#include <common>
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
}`,IE=`uniform vec3 color;
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
}`,UE=`uniform float rotation;
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
}`,FE=`uniform vec3 diffuse;
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
}`,ze={alphahash_fragment:rM,alphahash_pars_fragment:sM,alphamap_fragment:oM,alphamap_pars_fragment:aM,alphatest_fragment:lM,alphatest_pars_fragment:cM,aomap_fragment:uM,aomap_pars_fragment:dM,batching_pars_vertex:hM,batching_vertex:fM,begin_vertex:pM,beginnormal_vertex:mM,bsdfs:gM,iridescence_fragment:vM,bumpmap_pars_fragment:xM,clipping_planes_fragment:_M,clipping_planes_pars_fragment:yM,clipping_planes_pars_vertex:SM,clipping_planes_vertex:MM,color_fragment:EM,color_pars_fragment:wM,color_pars_vertex:TM,color_vertex:AM,common:CM,cube_uv_reflection_fragment:bM,defaultnormal_vertex:RM,displacementmap_pars_vertex:PM,displacementmap_vertex:DM,emissivemap_fragment:LM,emissivemap_pars_fragment:NM,colorspace_fragment:IM,colorspace_pars_fragment:UM,envmap_fragment:FM,envmap_common_pars_fragment:OM,envmap_pars_fragment:kM,envmap_pars_vertex:BM,envmap_physical_pars_fragment:$M,envmap_vertex:zM,fog_vertex:HM,fog_pars_vertex:VM,fog_fragment:GM,fog_pars_fragment:WM,gradientmap_pars_fragment:jM,lightmap_pars_fragment:XM,lights_lambert_fragment:KM,lights_lambert_pars_fragment:YM,lights_pars_begin:qM,lights_toon_fragment:ZM,lights_toon_pars_fragment:JM,lights_phong_fragment:QM,lights_phong_pars_fragment:e1,lights_physical_fragment:t1,lights_physical_pars_fragment:n1,lights_fragment_begin:i1,lights_fragment_maps:r1,lights_fragment_end:s1,logdepthbuf_fragment:o1,logdepthbuf_pars_fragment:a1,logdepthbuf_pars_vertex:l1,logdepthbuf_vertex:c1,map_fragment:u1,map_pars_fragment:d1,map_particle_fragment:h1,map_particle_pars_fragment:f1,metalnessmap_fragment:p1,metalnessmap_pars_fragment:m1,morphinstance_vertex:g1,morphcolor_vertex:v1,morphnormal_vertex:x1,morphtarget_pars_vertex:_1,morphtarget_vertex:y1,normal_fragment_begin:S1,normal_fragment_maps:M1,normal_pars_fragment:E1,normal_pars_vertex:w1,normal_vertex:T1,normalmap_pars_fragment:A1,clearcoat_normal_fragment_begin:C1,clearcoat_normal_fragment_maps:b1,clearcoat_pars_fragment:R1,iridescence_pars_fragment:P1,opaque_fragment:D1,packing:L1,premultiplied_alpha_fragment:N1,project_vertex:I1,dithering_fragment:U1,dithering_pars_fragment:F1,roughnessmap_fragment:O1,roughnessmap_pars_fragment:k1,shadowmap_pars_fragment:B1,shadowmap_pars_vertex:z1,shadowmap_vertex:H1,shadowmask_pars_fragment:V1,skinbase_vertex:G1,skinning_pars_vertex:W1,skinning_vertex:j1,skinnormal_vertex:X1,specularmap_fragment:K1,specularmap_pars_fragment:Y1,tonemapping_fragment:q1,tonemapping_pars_fragment:$1,transmission_fragment:Z1,transmission_pars_fragment:J1,uv_pars_fragment:Q1,uv_pars_vertex:eE,uv_vertex:tE,worldpos_vertex:nE,background_vert:iE,background_frag:rE,backgroundCube_vert:sE,backgroundCube_frag:oE,cube_vert:aE,cube_frag:lE,depth_vert:cE,depth_frag:uE,distanceRGBA_vert:dE,distanceRGBA_frag:hE,equirect_vert:fE,equirect_frag:pE,linedashed_vert:mE,linedashed_frag:gE,meshbasic_vert:vE,meshbasic_frag:xE,meshlambert_vert:_E,meshlambert_frag:yE,meshmatcap_vert:SE,meshmatcap_frag:ME,meshnormal_vert:EE,meshnormal_frag:wE,meshphong_vert:TE,meshphong_frag:AE,meshphysical_vert:CE,meshphysical_frag:bE,meshtoon_vert:RE,meshtoon_frag:PE,points_vert:DE,points_frag:LE,shadow_vert:NE,shadow_frag:IE,sprite_vert:UE,sprite_frag:FE},le={common:{diffuse:{value:new ge(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ke},alphaMap:{value:null},alphaMapTransform:{value:new ke},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ke}},envmap:{envMap:{value:null},envMapRotation:{value:new ke},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ke}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ke}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ke},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ke},normalScale:{value:new je(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ke},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ke}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ke}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ke}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ge(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ge(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ke},alphaTest:{value:0},uvTransform:{value:new ke}},sprite:{diffuse:{value:new ge(16777215)},opacity:{value:1},center:{value:new je(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ke},alphaMap:{value:null},alphaMapTransform:{value:new ke},alphaTest:{value:0}}},ei={basic:{uniforms:tn([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.fog]),vertexShader:ze.meshbasic_vert,fragmentShader:ze.meshbasic_frag},lambert:{uniforms:tn([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.fog,le.lights,{emissive:{value:new ge(0)}}]),vertexShader:ze.meshlambert_vert,fragmentShader:ze.meshlambert_frag},phong:{uniforms:tn([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.fog,le.lights,{emissive:{value:new ge(0)},specular:{value:new ge(1118481)},shininess:{value:30}}]),vertexShader:ze.meshphong_vert,fragmentShader:ze.meshphong_frag},standard:{uniforms:tn([le.common,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.roughnessmap,le.metalnessmap,le.fog,le.lights,{emissive:{value:new ge(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ze.meshphysical_vert,fragmentShader:ze.meshphysical_frag},toon:{uniforms:tn([le.common,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.gradientmap,le.fog,le.lights,{emissive:{value:new ge(0)}}]),vertexShader:ze.meshtoon_vert,fragmentShader:ze.meshtoon_frag},matcap:{uniforms:tn([le.common,le.bumpmap,le.normalmap,le.displacementmap,le.fog,{matcap:{value:null}}]),vertexShader:ze.meshmatcap_vert,fragmentShader:ze.meshmatcap_frag},points:{uniforms:tn([le.points,le.fog]),vertexShader:ze.points_vert,fragmentShader:ze.points_frag},dashed:{uniforms:tn([le.common,le.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ze.linedashed_vert,fragmentShader:ze.linedashed_frag},depth:{uniforms:tn([le.common,le.displacementmap]),vertexShader:ze.depth_vert,fragmentShader:ze.depth_frag},normal:{uniforms:tn([le.common,le.bumpmap,le.normalmap,le.displacementmap,{opacity:{value:1}}]),vertexShader:ze.meshnormal_vert,fragmentShader:ze.meshnormal_frag},sprite:{uniforms:tn([le.sprite,le.fog]),vertexShader:ze.sprite_vert,fragmentShader:ze.sprite_frag},background:{uniforms:{uvTransform:{value:new ke},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ze.background_vert,fragmentShader:ze.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ke}},vertexShader:ze.backgroundCube_vert,fragmentShader:ze.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ze.cube_vert,fragmentShader:ze.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ze.equirect_vert,fragmentShader:ze.equirect_frag},distanceRGBA:{uniforms:tn([le.common,le.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ze.distanceRGBA_vert,fragmentShader:ze.distanceRGBA_frag},shadow:{uniforms:tn([le.lights,le.fog,{color:{value:new ge(0)},opacity:{value:1}}]),vertexShader:ze.shadow_vert,fragmentShader:ze.shadow_frag}};ei.physical={uniforms:tn([ei.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ke},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ke},clearcoatNormalScale:{value:new je(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ke},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ke},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ke},sheen:{value:0},sheenColor:{value:new ge(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ke},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ke},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ke},transmissionSamplerSize:{value:new je},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ke},attenuationDistance:{value:0},attenuationColor:{value:new ge(0)},specularColor:{value:new ge(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ke},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ke},anisotropyVector:{value:new je},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ke}}]),vertexShader:ze.meshphysical_vert,fragmentShader:ze.meshphysical_frag};const Ja={r:0,b:0,g:0},gr=new ai,OE=new nt;function kE(t,e,n,i,r,s,o){const a=new ge(0);let l=s===!0?0:1,c,u,h=null,f=0,p=null;function _(g){let x=g.isScene===!0?g.background:null;return x&&x.isTexture&&(x=(g.backgroundBlurriness>0?n:e).get(x)),x}function v(g){let x=!1;const y=_(g);y===null?d(a,l):y&&y.isColor&&(d(y,1),x=!0);const R=t.xr.getEnvironmentBlendMode();R==="additive"?i.buffers.color.setClear(0,0,0,1,o):R==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(t.autoClear||x)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil))}function m(g,x){const y=_(x);y&&(y.isCubeTexture||y.mapping===gc)?(u===void 0&&(u=new Tt(new fa(1,1,1),new Lt({name:"BackgroundCubeMaterial",uniforms:js(ei.backgroundCube.uniforms),vertexShader:ei.backgroundCube.vertexShader,fragmentShader:ei.backgroundCube.fragmentShader,side:Vt,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(R,C,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),gr.copy(x.backgroundRotation),gr.x*=-1,gr.y*=-1,gr.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(gr.y*=-1,gr.z*=-1),u.material.uniforms.envMap.value=y,u.material.uniforms.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(OE.makeRotationFromEuler(gr)),u.material.toneMapped=Ye.getTransfer(y.colorSpace)!==it,(h!==y||f!==y.version||p!==t.toneMapping)&&(u.material.needsUpdate=!0,h=y,f=y.version,p=t.toneMapping),u.layers.enableAll(),g.unshift(u,u.geometry,u.material,0,0,null)):y&&y.isTexture&&(c===void 0&&(c=new Tt(new pa(2,2),new Lt({name:"BackgroundMaterial",uniforms:js(ei.background.uniforms),vertexShader:ei.background.vertexShader,fragmentShader:ei.background.fragmentShader,side:or,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=y,c.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,c.material.toneMapped=Ye.getTransfer(y.colorSpace)!==it,y.matrixAutoUpdate===!0&&y.updateMatrix(),c.material.uniforms.uvTransform.value.copy(y.matrix),(h!==y||f!==y.version||p!==t.toneMapping)&&(c.material.needsUpdate=!0,h=y,f=y.version,p=t.toneMapping),c.layers.enableAll(),g.unshift(c,c.geometry,c.material,0,0,null))}function d(g,x){g.getRGB(Ja,Uv(t)),i.buffers.color.setClear(Ja.r,Ja.g,Ja.b,x,o)}return{getClearColor:function(){return a},setClearColor:function(g,x=1){a.set(g),l=x,d(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(g){l=g,d(a,l)},render:v,addToRenderList:m}}function BE(t,e){const n=t.getParameter(t.MAX_VERTEX_ATTRIBS),i={},r=f(null);let s=r,o=!1;function a(M,P,V,B,G){let J=!1;const W=h(B,V,P);s!==W&&(s=W,c(s.object)),J=p(M,B,V,G),J&&_(M,B,V,G),G!==null&&e.update(G,t.ELEMENT_ARRAY_BUFFER),(J||o)&&(o=!1,y(M,P,V,B),G!==null&&t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,e.get(G).buffer))}function l(){return t.createVertexArray()}function c(M){return t.bindVertexArray(M)}function u(M){return t.deleteVertexArray(M)}function h(M,P,V){const B=V.wireframe===!0;let G=i[M.id];G===void 0&&(G={},i[M.id]=G);let J=G[P.id];J===void 0&&(J={},G[P.id]=J);let W=J[B];return W===void 0&&(W=f(l()),J[B]=W),W}function f(M){const P=[],V=[],B=[];for(let G=0;G<n;G++)P[G]=0,V[G]=0,B[G]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:V,attributeDivisors:B,object:M,attributes:{},index:null}}function p(M,P,V,B){const G=s.attributes,J=P.attributes;let W=0;const ee=V.getAttributes();for(const L in ee)if(ee[L].location>=0){const q=G[L];let ae=J[L];if(ae===void 0&&(L==="instanceMatrix"&&M.instanceMatrix&&(ae=M.instanceMatrix),L==="instanceColor"&&M.instanceColor&&(ae=M.instanceColor)),q===void 0||q.attribute!==ae||ae&&q.data!==ae.data)return!0;W++}return s.attributesNum!==W||s.index!==B}function _(M,P,V,B){const G={},J=P.attributes;let W=0;const ee=V.getAttributes();for(const L in ee)if(ee[L].location>=0){let q=J[L];q===void 0&&(L==="instanceMatrix"&&M.instanceMatrix&&(q=M.instanceMatrix),L==="instanceColor"&&M.instanceColor&&(q=M.instanceColor));const ae={};ae.attribute=q,q&&q.data&&(ae.data=q.data),G[L]=ae,W++}s.attributes=G,s.attributesNum=W,s.index=B}function v(){const M=s.newAttributes;for(let P=0,V=M.length;P<V;P++)M[P]=0}function m(M){d(M,0)}function d(M,P){const V=s.newAttributes,B=s.enabledAttributes,G=s.attributeDivisors;V[M]=1,B[M]===0&&(t.enableVertexAttribArray(M),B[M]=1),G[M]!==P&&(t.vertexAttribDivisor(M,P),G[M]=P)}function g(){const M=s.newAttributes,P=s.enabledAttributes;for(let V=0,B=P.length;V<B;V++)P[V]!==M[V]&&(t.disableVertexAttribArray(V),P[V]=0)}function x(M,P,V,B,G,J,W){W===!0?t.vertexAttribIPointer(M,P,V,G,J):t.vertexAttribPointer(M,P,V,B,G,J)}function y(M,P,V,B){v();const G=B.attributes,J=V.getAttributes(),W=P.defaultAttributeValues;for(const ee in J){const L=J[ee];if(L.location>=0){let K=G[ee];if(K===void 0&&(ee==="instanceMatrix"&&M.instanceMatrix&&(K=M.instanceMatrix),ee==="instanceColor"&&M.instanceColor&&(K=M.instanceColor)),K!==void 0){const q=K.normalized,ae=K.itemSize,ye=e.get(K);if(ye===void 0)continue;const Ve=ye.buffer,j=ye.type,ne=ye.bytesPerElement,ce=j===t.INT||j===t.UNSIGNED_INT||K.gpuType===of;if(K.isInterleavedBufferAttribute){const oe=K.data,Pe=oe.stride,Ae=K.offset;if(oe.isInstancedInterleavedBuffer){for(let be=0;be<L.locationSize;be++)d(L.location+be,oe.meshPerAttribute);M.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=oe.meshPerAttribute*oe.count)}else for(let be=0;be<L.locationSize;be++)m(L.location+be);t.bindBuffer(t.ARRAY_BUFFER,Ve);for(let be=0;be<L.locationSize;be++)x(L.location+be,ae/L.locationSize,j,q,Pe*ne,(Ae+ae/L.locationSize*be)*ne,ce)}else{if(K.isInstancedBufferAttribute){for(let oe=0;oe<L.locationSize;oe++)d(L.location+oe,K.meshPerAttribute);M.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let oe=0;oe<L.locationSize;oe++)m(L.location+oe);t.bindBuffer(t.ARRAY_BUFFER,Ve);for(let oe=0;oe<L.locationSize;oe++)x(L.location+oe,ae/L.locationSize,j,q,ae*ne,ae/L.locationSize*oe*ne,ce)}}else if(W!==void 0){const q=W[ee];if(q!==void 0)switch(q.length){case 2:t.vertexAttrib2fv(L.location,q);break;case 3:t.vertexAttrib3fv(L.location,q);break;case 4:t.vertexAttrib4fv(L.location,q);break;default:t.vertexAttrib1fv(L.location,q)}}}}g()}function R(){b();for(const M in i){const P=i[M];for(const V in P){const B=P[V];for(const G in B)u(B[G].object),delete B[G];delete P[V]}delete i[M]}}function C(M){if(i[M.id]===void 0)return;const P=i[M.id];for(const V in P){const B=P[V];for(const G in B)u(B[G].object),delete B[G];delete P[V]}delete i[M.id]}function A(M){for(const P in i){const V=i[P];if(V[M.id]===void 0)continue;const B=V[M.id];for(const G in B)u(B[G].object),delete B[G];delete V[M.id]}}function b(){w(),o=!0,s!==r&&(s=r,c(s.object))}function w(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:b,resetDefaultState:w,dispose:R,releaseStatesOfGeometry:C,releaseStatesOfProgram:A,initAttributes:v,enableAttribute:m,disableUnusedAttributes:g}}function zE(t,e,n){let i;function r(c){i=c}function s(c,u){t.drawArrays(i,c,u),n.update(u,i,1)}function o(c,u,h){h!==0&&(t.drawArraysInstanced(i,c,u,h),n.update(u,i,h))}function a(c,u,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,u,0,h);let p=0;for(let _=0;_<h;_++)p+=u[_];n.update(p,i,1)}function l(c,u,h,f){if(h===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let _=0;_<c.length;_++)o(c[_],u[_],f[_]);else{p.multiDrawArraysInstancedWEBGL(i,c,0,u,0,f,0,h);let _=0;for(let v=0;v<h;v++)_+=u[v]*f[v];n.update(_,i,1)}}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function HE(t,e,n,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const A=e.get("EXT_texture_filter_anisotropic");r=t.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(A){return!(A!==Xn&&i.convert(A)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(A){const b=A===da&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==bi&&i.convert(A)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==ii&&!b)}function l(A){if(A==="highp"){if(t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.HIGH_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.MEDIUM_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=n.precision!==void 0?n.precision:"highp";const u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const h=n.logarithmicDepthBuffer===!0,f=n.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),p=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),_=t.getParameter(t.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=t.getParameter(t.MAX_TEXTURE_SIZE),m=t.getParameter(t.MAX_CUBE_MAP_TEXTURE_SIZE),d=t.getParameter(t.MAX_VERTEX_ATTRIBS),g=t.getParameter(t.MAX_VERTEX_UNIFORM_VECTORS),x=t.getParameter(t.MAX_VARYING_VECTORS),y=t.getParameter(t.MAX_FRAGMENT_UNIFORM_VECTORS),R=_>0,C=t.getParameter(t.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:h,reverseDepthBuffer:f,maxTextures:p,maxVertexTextures:_,maxTextureSize:v,maxCubemapSize:m,maxAttributes:d,maxVertexUniforms:g,maxVaryings:x,maxFragmentUniforms:y,vertexTextures:R,maxSamples:C}}function VE(t){const e=this;let n=null,i=0,r=!1,s=!1;const o=new yr,a=new ke,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,f){const p=h.length!==0||f||i!==0||r;return r=f,i=h.length,p},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,f){n=u(h,f,0)},this.setState=function(h,f,p){const _=h.clippingPlanes,v=h.clipIntersection,m=h.clipShadows,d=t.get(h);if(!r||_===null||_.length===0||s&&!m)s?u(null):c();else{const g=s?0:i,x=g*4;let y=d.clippingState||null;l.value=y,y=u(_,f,x,p);for(let R=0;R!==x;++R)y[R]=n[R];d.clippingState=y,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=g}};function c(){l.value!==n&&(l.value=n,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(h,f,p,_){const v=h!==null?h.length:0;let m=null;if(v!==0){if(m=l.value,_!==!0||m===null){const d=p+v*4,g=f.matrixWorldInverse;a.getNormalMatrix(g),(m===null||m.length<d)&&(m=new Float32Array(d));for(let x=0,y=p;x!==v;++x,y+=4)o.copy(h[x]).applyMatrix4(g,a),o.normal.toArray(m,y),m[y+3]=o.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,m}}function GE(t){let e=new WeakMap;function n(o,a){return a===Pd?o.mapping=Hs:a===Dd&&(o.mapping=Vs),o}function i(o){if(o&&o.isTexture){const a=o.mapping;if(a===Pd||a===Dd)if(e.has(o)){const l=e.get(o).texture;return n(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new eM(l.height);return c.fromEquirectangularTexture(t,o),e.set(o,c),o.addEventListener("dispose",r),n(c.texture,o.mapping)}else return null}}return o}function r(o){const a=o.target;a.removeEventListener("dispose",r);const l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}class WE extends Fv{constructor(e=-1,n=1,i=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=n,this.top=i,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,n,i,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,o=i+e,a=r+n,l=r-n;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}}const Ms=4,dm=[.125,.215,.35,.446,.526,.582],Er=20,pu=new WE,hm=new ge;let mu=null,gu=0,vu=0,xu=!1;const Sr=(1+Math.sqrt(5))/2,as=1/Sr,fm=[new D(-Sr,as,0),new D(Sr,as,0),new D(-as,0,Sr),new D(as,0,Sr),new D(0,Sr,-as),new D(0,Sr,as),new D(-1,1,-1),new D(1,1,-1),new D(-1,1,1),new D(1,1,1)];class pm{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,n=0,i=.1,r=100){mu=this._renderer.getRenderTarget(),gu=this._renderer.getActiveCubeFace(),vu=this._renderer.getActiveMipmapLevel(),xu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,i,r,s),n>0&&this._blur(s,0,0,n),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,n=null){return this._fromTexture(e,n)}fromCubemap(e,n=null){return this._fromTexture(e,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=vm(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=gm(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(mu,gu,vu),this._renderer.xr.enabled=xu,e.scissorTest=!1,Qa(e,0,0,e.width,e.height)}_fromTexture(e,n){e.mapping===Hs||e.mapping===Vs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),mu=this._renderer.getRenderTarget(),gu=this._renderer.getActiveCubeFace(),vu=this._renderer.getActiveMipmapLevel(),xu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=n||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,i={magFilter:yn,minFilter:yn,generateMipmaps:!1,type:da,format:Xn,colorSpace:$s,depthBuffer:!1},r=mm(e,n,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=mm(e,n,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=jE(s)),this._blurMaterial=XE(s,e,n)}return r}_compileMaterial(e){const n=new Tt(this._lodPlanes[0],e);this._renderer.compile(n,pu)}_sceneToCubeUV(e,n,i,r){const a=new xn(90,1,n,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],u=this._renderer,h=u.autoClear,f=u.toneMapping;u.getClearColor(hm),u.toneMapping=ir,u.autoClear=!1;const p=new Lv({name:"PMREM.Background",side:Vt,depthWrite:!1,depthTest:!1}),_=new Tt(new fa,p);let v=!1;const m=e.background;m?m.isColor&&(p.color.copy(m),e.background=null,v=!0):(p.color.copy(hm),v=!0);for(let d=0;d<6;d++){const g=d%3;g===0?(a.up.set(0,l[d],0),a.lookAt(c[d],0,0)):g===1?(a.up.set(0,0,l[d]),a.lookAt(0,c[d],0)):(a.up.set(0,l[d],0),a.lookAt(0,0,c[d]));const x=this._cubeSize;Qa(r,g*x,d>2?x:0,x,x),u.setRenderTarget(r),v&&u.render(_,a),u.render(e,a)}_.geometry.dispose(),_.material.dispose(),u.toneMapping=f,u.autoClear=h,e.background=m}_textureToCubeUV(e,n){const i=this._renderer,r=e.mapping===Hs||e.mapping===Vs;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=vm()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=gm());const s=r?this._cubemapMaterial:this._equirectMaterial,o=new Tt(this._lodPlanes[0],s),a=s.uniforms;a.envMap.value=e;const l=this._cubeSize;Qa(n,0,0,3*l,2*l),i.setRenderTarget(n),i.render(o,pu)}_applyPMREM(e){const n=this._renderer,i=n.autoClear;n.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=fm[(r-s-1)%fm.length];this._blur(e,s-1,s,o,a)}n.autoClear=i}_blur(e,n,i,r,s){const o=this._pingPongRenderTarget;this._halfBlur(e,o,n,i,r,"latitudinal",s),this._halfBlur(o,e,i,i,r,"longitudinal",s)}_halfBlur(e,n,i,r,s,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,h=new Tt(this._lodPlanes[r],c),f=c.uniforms,p=this._sizeLods[i]-1,_=isFinite(s)?Math.PI/(2*p):2*Math.PI/(2*Er-1),v=s/_,m=isFinite(s)?1+Math.floor(u*v):Er;m>Er&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Er}`);const d=[];let g=0;for(let A=0;A<Er;++A){const b=A/v,w=Math.exp(-b*b/2);d.push(w),A===0?g+=w:A<m&&(g+=2*w)}for(let A=0;A<d.length;A++)d[A]=d[A]/g;f.envMap.value=e.texture,f.samples.value=m,f.weights.value=d,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);const{_lodMax:x}=this;f.dTheta.value=_,f.mipInt.value=x-i;const y=this._sizeLods[r],R=3*y*(r>x-Ms?r-x+Ms:0),C=4*(this._cubeSize-y);Qa(n,R,C,3*y,2*y),l.setRenderTarget(n),l.render(h,pu)}}function jE(t){const e=[],n=[],i=[];let r=t;const s=t-Ms+1+dm.length;for(let o=0;o<s;o++){const a=Math.pow(2,r);n.push(a);let l=1/a;o>t-Ms?l=dm[o-t+Ms-1]:o===0&&(l=0),i.push(l);const c=1/(a-2),u=-c,h=1+c,f=[u,u,h,u,h,h,u,u,h,h,u,h],p=6,_=6,v=3,m=2,d=1,g=new Float32Array(v*_*p),x=new Float32Array(m*_*p),y=new Float32Array(d*_*p);for(let C=0;C<p;C++){const A=C%3*2/3-1,b=C>2?0:-1,w=[A,b,0,A+2/3,b,0,A+2/3,b+1,0,A,b,0,A+2/3,b+1,0,A,b+1,0];g.set(w,v*_*C),x.set(f,m*_*C);const M=[C,C,C,C,C,C];y.set(M,d*_*C)}const R=new bt;R.setAttribute("position",new Et(g,v)),R.setAttribute("uv",new Et(x,m)),R.setAttribute("faceIndex",new Et(y,d)),e.push(R),r>Ms&&r--}return{lodPlanes:e,sizeLods:n,sigmas:i}}function mm(t,e,n){const i=new zr(t,e,n);return i.texture.mapping=gc,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Qa(t,e,n,i,r){t.viewport.set(e,n,i,r),t.scissor.set(e,n,i,r)}function XE(t,e,n){const i=new Float32Array(Er),r=new D(0,1,0);return new Lt({name:"SphericalGaussianBlur",defines:{n:Er,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:gf(),fragmentShader:`

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
		`,blending:nr,depthTest:!1,depthWrite:!1})}function gm(){return new Lt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:gf(),fragmentShader:`

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
		`,blending:nr,depthTest:!1,depthWrite:!1})}function vm(){return new Lt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:gf(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:nr,depthTest:!1,depthWrite:!1})}function gf(){return`

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
	`}function KE(t){let e=new WeakMap,n=null;function i(a){if(a&&a.isTexture){const l=a.mapping,c=l===Pd||l===Dd,u=l===Hs||l===Vs;if(c||u){let h=e.get(a);const f=h!==void 0?h.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==f)return n===null&&(n=new pm(t)),h=c?n.fromEquirectangular(a,h):n.fromCubemap(a,h),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),h.texture;if(h!==void 0)return h.texture;{const p=a.image;return c&&p&&p.height>0||u&&p&&r(p)?(n===null&&(n=new pm(t)),h=c?n.fromEquirectangular(a):n.fromCubemap(a),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),a.addEventListener("dispose",s),h.texture):null}}}return a}function r(a){let l=0;const c=6;for(let u=0;u<c;u++)a[u]!==void 0&&l++;return l===c}function s(a){const l=a.target;l.removeEventListener("dispose",s);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:o}}function YE(t){const e={};function n(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=t.getExtension("WEBGL_depth_texture")||t.getExtension("MOZ_WEBGL_depth_texture")||t.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=t.getExtension("EXT_texture_filter_anisotropic")||t.getExtension("MOZ_EXT_texture_filter_anisotropic")||t.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=t.getExtension("WEBGL_compressed_texture_s3tc")||t.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=t.getExtension("WEBGL_compressed_texture_pvrtc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=t.getExtension(i)}return e[i]=r,r}return{has:function(i){return n(i)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(i){const r=n(i);return r===null&&Eo("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function qE(t,e,n,i){const r={},s=new WeakMap;function o(h){const f=h.target;f.index!==null&&e.remove(f.index);for(const _ in f.attributes)e.remove(f.attributes[_]);for(const _ in f.morphAttributes){const v=f.morphAttributes[_];for(let m=0,d=v.length;m<d;m++)e.remove(v[m])}f.removeEventListener("dispose",o),delete r[f.id];const p=s.get(f);p&&(e.remove(p),s.delete(f)),i.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,n.memory.geometries--}function a(h,f){return r[f.id]===!0||(f.addEventListener("dispose",o),r[f.id]=!0,n.memory.geometries++),f}function l(h){const f=h.attributes;for(const _ in f)e.update(f[_],t.ARRAY_BUFFER);const p=h.morphAttributes;for(const _ in p){const v=p[_];for(let m=0,d=v.length;m<d;m++)e.update(v[m],t.ARRAY_BUFFER)}}function c(h){const f=[],p=h.index,_=h.attributes.position;let v=0;if(p!==null){const g=p.array;v=p.version;for(let x=0,y=g.length;x<y;x+=3){const R=g[x+0],C=g[x+1],A=g[x+2];f.push(R,C,C,A,A,R)}}else if(_!==void 0){const g=_.array;v=_.version;for(let x=0,y=g.length/3-1;x<y;x+=3){const R=x+0,C=x+1,A=x+2;f.push(R,C,C,A,A,R)}}else return;const m=new(bv(f)?Iv:Nv)(f,1);m.version=v;const d=s.get(h);d&&e.remove(d),s.set(h,m)}function u(h){const f=s.get(h);if(f){const p=h.index;p!==null&&f.version<p.version&&c(h)}else c(h);return s.get(h)}return{get:a,update:l,getWireframeAttribute:u}}function $E(t,e,n){let i;function r(f){i=f}let s,o;function a(f){s=f.type,o=f.bytesPerElement}function l(f,p){t.drawElements(i,p,s,f*o),n.update(p,i,1)}function c(f,p,_){_!==0&&(t.drawElementsInstanced(i,p,s,f*o,_),n.update(p,i,_))}function u(f,p,_){if(_===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,p,0,s,f,0,_);let m=0;for(let d=0;d<_;d++)m+=p[d];n.update(m,i,1)}function h(f,p,_,v){if(_===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let d=0;d<f.length;d++)c(f[d]/o,p[d],v[d]);else{m.multiDrawElementsInstancedWEBGL(i,p,0,s,f,0,v,0,_);let d=0;for(let g=0;g<_;g++)d+=p[g]*v[g];n.update(d,i,1)}}this.setMode=r,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function ZE(t){const e={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,a){switch(n.calls++,o){case t.TRIANGLES:n.triangles+=a*(s/3);break;case t.LINES:n.lines+=a*(s/2);break;case t.LINE_STRIP:n.lines+=a*(s-1);break;case t.LINE_LOOP:n.lines+=a*s;break;case t.POINTS:n.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function r(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:e,render:n,programs:null,autoReset:!0,reset:r,update:i}}function JE(t,e,n){const i=new WeakMap,r=new rt;function s(o,a,l){const c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=u!==void 0?u.length:0;let f=i.get(a);if(f===void 0||f.count!==h){let w=function(){A.dispose(),i.delete(a),a.removeEventListener("dispose",w)};f!==void 0&&f.texture.dispose();const p=a.morphAttributes.position!==void 0,_=a.morphAttributes.normal!==void 0,v=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],d=a.morphAttributes.normal||[],g=a.morphAttributes.color||[];let x=0;p===!0&&(x=1),_===!0&&(x=2),v===!0&&(x=3);let y=a.attributes.position.count*x,R=1;y>e.maxTextureSize&&(R=Math.ceil(y/e.maxTextureSize),y=e.maxTextureSize);const C=new Float32Array(y*R*4*h),A=new Pv(C,y,R,h);A.type=ii,A.needsUpdate=!0;const b=x*4;for(let M=0;M<h;M++){const P=m[M],V=d[M],B=g[M],G=y*R*4*M;for(let J=0;J<P.count;J++){const W=J*b;p===!0&&(r.fromBufferAttribute(P,J),C[G+W+0]=r.x,C[G+W+1]=r.y,C[G+W+2]=r.z,C[G+W+3]=0),_===!0&&(r.fromBufferAttribute(V,J),C[G+W+4]=r.x,C[G+W+5]=r.y,C[G+W+6]=r.z,C[G+W+7]=0),v===!0&&(r.fromBufferAttribute(B,J),C[G+W+8]=r.x,C[G+W+9]=r.y,C[G+W+10]=r.z,C[G+W+11]=B.itemSize===4?r.w:1)}}f={count:h,texture:A,size:new je(y,R)},i.set(a,f),a.addEventListener("dispose",w)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(t,"morphTexture",o.morphTexture,n);else{let p=0;for(let v=0;v<c.length;v++)p+=c[v];const _=a.morphTargetsRelative?1:1-p;l.getUniforms().setValue(t,"morphTargetBaseInfluence",_),l.getUniforms().setValue(t,"morphTargetInfluences",c)}l.getUniforms().setValue(t,"morphTargetsTexture",f.texture,n),l.getUniforms().setValue(t,"morphTargetsTextureSize",f.size)}return{update:s}}function QE(t,e,n,i){let r=new WeakMap;function s(l){const c=i.render.frame,u=l.geometry,h=e.get(l,u);if(r.get(h)!==c&&(e.update(h),r.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),r.get(l)!==c&&(n.update(l.instanceMatrix,t.ARRAY_BUFFER),l.instanceColor!==null&&n.update(l.instanceColor,t.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const f=l.skeleton;r.get(f)!==c&&(f.update(),r.set(f,c))}return h}function o(){r=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),n.remove(c.instanceMatrix),c.instanceColor!==null&&n.remove(c.instanceColor)}return{update:s,dispose:o}}class Bv extends kt{constructor(e,n,i,r,s,o,a,l,c,u=Ds){if(u!==Ds&&u!==Ws)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&u===Ds&&(i=Br),i===void 0&&u===Ws&&(i=Gs),super(null,r,s,o,a,l,u,i,c),this.isDepthTexture=!0,this.image={width:e,height:n},this.magFilter=a!==void 0?a:Mn,this.minFilter=l!==void 0?l:Mn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const n=super.toJSON(e);return this.compareFunction!==null&&(n.compareFunction=this.compareFunction),n}}const zv=new kt,xm=new Bv(1,1),Hv=new Pv,Vv=new kS,Gv=new Ov,_m=[],ym=[],Sm=new Float32Array(16),Mm=new Float32Array(9),Em=new Float32Array(4);function Qs(t,e,n){const i=t[0];if(i<=0||i>0)return t;const r=e*n;let s=_m[r];if(s===void 0&&(s=new Float32Array(r),_m[r]=s),e!==0){i.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=n,t[o].toArray(s,a)}return s}function Nt(t,e){if(t.length!==e.length)return!1;for(let n=0,i=t.length;n<i;n++)if(t[n]!==e[n])return!1;return!0}function It(t,e){for(let n=0,i=e.length;n<i;n++)t[n]=e[n]}function _c(t,e){let n=ym[e];n===void 0&&(n=new Int32Array(e),ym[e]=n);for(let i=0;i!==e;++i)n[i]=t.allocateTextureUnit();return n}function ew(t,e){const n=this.cache;n[0]!==e&&(t.uniform1f(this.addr,e),n[0]=e)}function tw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2f(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Nt(n,e))return;t.uniform2fv(this.addr,e),It(n,e)}}function nw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3f(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else if(e.r!==void 0)(n[0]!==e.r||n[1]!==e.g||n[2]!==e.b)&&(t.uniform3f(this.addr,e.r,e.g,e.b),n[0]=e.r,n[1]=e.g,n[2]=e.b);else{if(Nt(n,e))return;t.uniform3fv(this.addr,e),It(n,e)}}function iw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4f(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Nt(n,e))return;t.uniform4fv(this.addr,e),It(n,e)}}function rw(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Nt(n,e))return;t.uniformMatrix2fv(this.addr,!1,e),It(n,e)}else{if(Nt(n,i))return;Em.set(i),t.uniformMatrix2fv(this.addr,!1,Em),It(n,i)}}function sw(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Nt(n,e))return;t.uniformMatrix3fv(this.addr,!1,e),It(n,e)}else{if(Nt(n,i))return;Mm.set(i),t.uniformMatrix3fv(this.addr,!1,Mm),It(n,i)}}function ow(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Nt(n,e))return;t.uniformMatrix4fv(this.addr,!1,e),It(n,e)}else{if(Nt(n,i))return;Sm.set(i),t.uniformMatrix4fv(this.addr,!1,Sm),It(n,i)}}function aw(t,e){const n=this.cache;n[0]!==e&&(t.uniform1i(this.addr,e),n[0]=e)}function lw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2i(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Nt(n,e))return;t.uniform2iv(this.addr,e),It(n,e)}}function cw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3i(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(Nt(n,e))return;t.uniform3iv(this.addr,e),It(n,e)}}function uw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4i(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Nt(n,e))return;t.uniform4iv(this.addr,e),It(n,e)}}function dw(t,e){const n=this.cache;n[0]!==e&&(t.uniform1ui(this.addr,e),n[0]=e)}function hw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2ui(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Nt(n,e))return;t.uniform2uiv(this.addr,e),It(n,e)}}function fw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3ui(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(Nt(n,e))return;t.uniform3uiv(this.addr,e),It(n,e)}}function pw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4ui(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Nt(n,e))return;t.uniform4uiv(this.addr,e),It(n,e)}}function mw(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r);let s;this.type===t.SAMPLER_2D_SHADOW?(xm.compareFunction=Cv,s=xm):s=zv,n.setTexture2D(e||s,r)}function gw(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture3D(e||Vv,r)}function vw(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTextureCube(e||Gv,r)}function xw(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture2DArray(e||Hv,r)}function _w(t){switch(t){case 5126:return ew;case 35664:return tw;case 35665:return nw;case 35666:return iw;case 35674:return rw;case 35675:return sw;case 35676:return ow;case 5124:case 35670:return aw;case 35667:case 35671:return lw;case 35668:case 35672:return cw;case 35669:case 35673:return uw;case 5125:return dw;case 36294:return hw;case 36295:return fw;case 36296:return pw;case 35678:case 36198:case 36298:case 36306:case 35682:return mw;case 35679:case 36299:case 36307:return gw;case 35680:case 36300:case 36308:case 36293:return vw;case 36289:case 36303:case 36311:case 36292:return xw}}function yw(t,e){t.uniform1fv(this.addr,e)}function Sw(t,e){const n=Qs(e,this.size,2);t.uniform2fv(this.addr,n)}function Mw(t,e){const n=Qs(e,this.size,3);t.uniform3fv(this.addr,n)}function Ew(t,e){const n=Qs(e,this.size,4);t.uniform4fv(this.addr,n)}function ww(t,e){const n=Qs(e,this.size,4);t.uniformMatrix2fv(this.addr,!1,n)}function Tw(t,e){const n=Qs(e,this.size,9);t.uniformMatrix3fv(this.addr,!1,n)}function Aw(t,e){const n=Qs(e,this.size,16);t.uniformMatrix4fv(this.addr,!1,n)}function Cw(t,e){t.uniform1iv(this.addr,e)}function bw(t,e){t.uniform2iv(this.addr,e)}function Rw(t,e){t.uniform3iv(this.addr,e)}function Pw(t,e){t.uniform4iv(this.addr,e)}function Dw(t,e){t.uniform1uiv(this.addr,e)}function Lw(t,e){t.uniform2uiv(this.addr,e)}function Nw(t,e){t.uniform3uiv(this.addr,e)}function Iw(t,e){t.uniform4uiv(this.addr,e)}function Uw(t,e,n){const i=this.cache,r=e.length,s=_c(n,r);Nt(i,s)||(t.uniform1iv(this.addr,s),It(i,s));for(let o=0;o!==r;++o)n.setTexture2D(e[o]||zv,s[o])}function Fw(t,e,n){const i=this.cache,r=e.length,s=_c(n,r);Nt(i,s)||(t.uniform1iv(this.addr,s),It(i,s));for(let o=0;o!==r;++o)n.setTexture3D(e[o]||Vv,s[o])}function Ow(t,e,n){const i=this.cache,r=e.length,s=_c(n,r);Nt(i,s)||(t.uniform1iv(this.addr,s),It(i,s));for(let o=0;o!==r;++o)n.setTextureCube(e[o]||Gv,s[o])}function kw(t,e,n){const i=this.cache,r=e.length,s=_c(n,r);Nt(i,s)||(t.uniform1iv(this.addr,s),It(i,s));for(let o=0;o!==r;++o)n.setTexture2DArray(e[o]||Hv,s[o])}function Bw(t){switch(t){case 5126:return yw;case 35664:return Sw;case 35665:return Mw;case 35666:return Ew;case 35674:return ww;case 35675:return Tw;case 35676:return Aw;case 5124:case 35670:return Cw;case 35667:case 35671:return bw;case 35668:case 35672:return Rw;case 35669:case 35673:return Pw;case 5125:return Dw;case 36294:return Lw;case 36295:return Nw;case 36296:return Iw;case 35678:case 36198:case 36298:case 36306:case 35682:return Uw;case 35679:case 36299:case 36307:return Fw;case 35680:case 36300:case 36308:case 36293:return Ow;case 36289:case 36303:case 36311:case 36292:return kw}}class zw{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.setValue=_w(n.type)}}class Hw{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=Bw(n.type)}}class Vw{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,n,i){const r=this.seq;for(let s=0,o=r.length;s!==o;++s){const a=r[s];a.setValue(e,n[a.id],i)}}}const _u=/(\w+)(\])?(\[|\.)?/g;function wm(t,e){t.seq.push(e),t.map[e.id]=e}function Gw(t,e,n){const i=t.name,r=i.length;for(_u.lastIndex=0;;){const s=_u.exec(i),o=_u.lastIndex;let a=s[1];const l=s[2]==="]",c=s[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===r){wm(n,c===void 0?new zw(a,t,e):new Hw(a,t,e));break}else{let h=n.map[a];h===void 0&&(h=new Vw(a),wm(n,h)),n=h}}}class wl{constructor(e,n){this.seq=[],this.map={};const i=e.getProgramParameter(n,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const s=e.getActiveUniform(n,r),o=e.getUniformLocation(n,s.name);Gw(s,o,this)}}setValue(e,n,i,r){const s=this.map[n];s!==void 0&&s.setValue(e,i,r)}setOptional(e,n,i){const r=n[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,n,i,r){for(let s=0,o=n.length;s!==o;++s){const a=n[s],l=i[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,r)}}static seqWithValue(e,n){const i=[];for(let r=0,s=e.length;r!==s;++r){const o=e[r];o.id in n&&i.push(o)}return i}}function Tm(t,e,n){const i=t.createShader(e);return t.shaderSource(i,n),t.compileShader(i),i}const Ww=37297;let jw=0;function Xw(t,e){const n=t.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,n.length);for(let o=r;o<s;o++){const a=o+1;i.push(`${a===e?">":" "} ${a}: ${n[o]}`)}return i.join(`
`)}const Am=new ke;function Kw(t){Ye._getMatrix(Am,Ye.workingColorSpace,t);const e=`mat3( ${Am.elements.map(n=>n.toFixed(4))} )`;switch(Ye.getTransfer(t)){case vc:return[e,"LinearTransferOETF"];case it:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",t),[e,"LinearTransferOETF"]}}function Cm(t,e,n){const i=t.getShaderParameter(e,t.COMPILE_STATUS),r=t.getShaderInfoLog(e).trim();if(i&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const o=parseInt(s[1]);return n.toUpperCase()+`

`+r+`

`+Xw(t.getShaderSource(e),o)}else return r}function Yw(t,e){const n=Kw(e);return[`vec4 ${t}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,"}"].join(`
`)}function qw(t,e){let n;switch(e){case Zy:n="Linear";break;case Jy:n="Reinhard";break;case Qy:n="Cineon";break;case mv:n="ACESFilmic";break;case tS:n="AgX";break;case nS:n="Neutral";break;case eS:n="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),n="Linear"}return"vec3 "+t+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}const el=new D;function $w(){Ye.getLuminanceCoefficients(el);const t=el.x.toFixed(4),e=el.y.toFixed(4),n=el.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${t}, ${e}, ${n} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Zw(t){return[t.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",t.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(wo).join(`
`)}function Jw(t){const e=[];for(const n in t){const i=t[n];i!==!1&&e.push("#define "+n+" "+i)}return e.join(`
`)}function Qw(t,e){const n={},i=t.getProgramParameter(e,t.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=t.getActiveAttrib(e,r),o=s.name;let a=1;s.type===t.FLOAT_MAT2&&(a=2),s.type===t.FLOAT_MAT3&&(a=3),s.type===t.FLOAT_MAT4&&(a=4),n[o]={type:s.type,location:t.getAttribLocation(e,o),locationSize:a}}return n}function wo(t){return t!==""}function bm(t,e){const n=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return t.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Rm(t,e){return t.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const eT=/^[ \t]*#include +<([\w\d./]+)>/gm;function sh(t){return t.replace(eT,nT)}const tT=new Map;function nT(t,e){let n=ze[e];if(n===void 0){const i=tT.get(e);if(i!==void 0)n=ze[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return sh(n)}const iT=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Pm(t){return t.replace(iT,rT)}function rT(t,e,n,i){let r="";for(let s=parseInt(e);s<parseInt(n);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Dm(t){let e=`precision ${t.precision} float;
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
#define LOW_PRECISION`),e}function sT(t){let e="SHADOWMAP_TYPE_BASIC";return t.shadowMapType===fv?e="SHADOWMAP_TYPE_PCF":t.shadowMapType===Py?e="SHADOWMAP_TYPE_PCF_SOFT":t.shadowMapType===mi&&(e="SHADOWMAP_TYPE_VSM"),e}function oT(t){let e="ENVMAP_TYPE_CUBE";if(t.envMap)switch(t.envMapMode){case Hs:case Vs:e="ENVMAP_TYPE_CUBE";break;case gc:e="ENVMAP_TYPE_CUBE_UV";break}return e}function aT(t){let e="ENVMAP_MODE_REFLECTION";if(t.envMap)switch(t.envMapMode){case Vs:e="ENVMAP_MODE_REFRACTION";break}return e}function lT(t){let e="ENVMAP_BLENDING_NONE";if(t.envMap)switch(t.combine){case pv:e="ENVMAP_BLENDING_MULTIPLY";break;case qy:e="ENVMAP_BLENDING_MIX";break;case $y:e="ENVMAP_BLENDING_ADD";break}return e}function cT(t){const e=t.envMapCubeUVHeight;if(e===null)return null;const n=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,n),7*16)),texelHeight:i,maxMip:n}}function uT(t,e,n,i){const r=t.getContext(),s=n.defines;let o=n.vertexShader,a=n.fragmentShader;const l=sT(n),c=oT(n),u=aT(n),h=lT(n),f=cT(n),p=Zw(n),_=Jw(s),v=r.createProgram();let m,d,g=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(m=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,_].filter(wo).join(`
`),m.length>0&&(m+=`
`),d=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,_].filter(wo).join(`
`),d.length>0&&(d+=`
`)):(m=[Dm(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,_,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+u:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(wo).join(`
`),d=[Dm(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,_,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+c:"",n.envMap?"#define "+u:"",n.envMap?"#define "+h:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor||n.batchingColor?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==ir?"#define TONE_MAPPING":"",n.toneMapping!==ir?ze.tonemapping_pars_fragment:"",n.toneMapping!==ir?qw("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",ze.colorspace_pars_fragment,Yw("linearToOutputTexel",n.outputColorSpace),$w(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(wo).join(`
`)),o=sh(o),o=bm(o,n),o=Rm(o,n),a=sh(a),a=bm(a,n),a=Rm(a,n),o=Pm(o),a=Pm(a),n.isRawShaderMaterial!==!0&&(g=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,d=["#define varying in",n.glslVersion===Gp?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===Gp?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);const x=g+m+o,y=g+d+a,R=Tm(r,r.VERTEX_SHADER,x),C=Tm(r,r.FRAGMENT_SHADER,y);r.attachShader(v,R),r.attachShader(v,C),n.index0AttributeName!==void 0?r.bindAttribLocation(v,0,n.index0AttributeName):n.morphTargets===!0&&r.bindAttribLocation(v,0,"position"),r.linkProgram(v);function A(P){if(t.debug.checkShaderErrors){const V=r.getProgramInfoLog(v).trim(),B=r.getShaderInfoLog(R).trim(),G=r.getShaderInfoLog(C).trim();let J=!0,W=!0;if(r.getProgramParameter(v,r.LINK_STATUS)===!1)if(J=!1,typeof t.debug.onShaderError=="function")t.debug.onShaderError(r,v,R,C);else{const ee=Cm(r,R,"vertex"),L=Cm(r,C,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(v,r.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+V+`
`+ee+`
`+L)}else V!==""?console.warn("THREE.WebGLProgram: Program Info Log:",V):(B===""||G==="")&&(W=!1);W&&(P.diagnostics={runnable:J,programLog:V,vertexShader:{log:B,prefix:m},fragmentShader:{log:G,prefix:d}})}r.deleteShader(R),r.deleteShader(C),b=new wl(r,v),w=Qw(r,v)}let b;this.getUniforms=function(){return b===void 0&&A(this),b};let w;this.getAttributes=function(){return w===void 0&&A(this),w};let M=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=r.getProgramParameter(v,Ww)),M},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(v),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=jw++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=R,this.fragmentShader=C,this}let dT=0;class hT{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const n=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(n),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(e);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(e){const n=this.materialCache.get(e);for(const i of n)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const n=this.materialCache;let i=n.get(e);return i===void 0&&(i=new Set,n.set(e,i)),i}_getShaderStage(e){const n=this.shaderCache;let i=n.get(e);return i===void 0&&(i=new fT(e),n.set(e,i)),i}}class fT{constructor(e){this.id=dT++,this.code=e,this.usedTimes=0}}function pT(t,e,n,i,r,s,o){const a=new pf,l=new hT,c=new Set,u=[],h=r.logarithmicDepthBuffer,f=r.vertexTextures;let p=r.precision;const _={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(w){return c.add(w),w===0?"uv":`uv${w}`}function m(w,M,P,V,B){const G=V.fog,J=B.geometry,W=w.isMeshStandardMaterial?V.environment:null,ee=(w.isMeshStandardMaterial?n:e).get(w.envMap||W),L=ee&&ee.mapping===gc?ee.image.height:null,K=_[w.type];w.precision!==null&&(p=r.getMaxPrecision(w.precision),p!==w.precision&&console.warn("THREE.WebGLProgram.getParameters:",w.precision,"not supported, using",p,"instead."));const q=J.morphAttributes.position||J.morphAttributes.normal||J.morphAttributes.color,ae=q!==void 0?q.length:0;let ye=0;J.morphAttributes.position!==void 0&&(ye=1),J.morphAttributes.normal!==void 0&&(ye=2),J.morphAttributes.color!==void 0&&(ye=3);let Ve,j,ne,ce;if(K){const Qe=ei[K];Ve=Qe.vertexShader,j=Qe.fragmentShader}else Ve=w.vertexShader,j=w.fragmentShader,l.update(w),ne=l.getVertexShaderID(w),ce=l.getFragmentShaderID(w);const oe=t.getRenderTarget(),Pe=t.state.buffers.depth.getReversed(),Ae=B.isInstancedMesh===!0,be=B.isBatchedMesh===!0,ot=!!w.map,De=!!w.matcap,mt=!!ee,U=!!w.aoMap,Qt=!!w.lightMap,He=!!w.bumpMap,We=!!w.normalMap,Re=!!w.displacementMap,st=!!w.emissiveMap,Ce=!!w.metalnessMap,E=!!w.roughnessMap,S=w.anisotropy>0,O=w.clearcoat>0,$=w.dispersion>0,Q=w.iridescence>0,Y=w.sheen>0,we=w.transmission>0,de=S&&!!w.anisotropyMap,ve=O&&!!w.clearcoatMap,Ke=O&&!!w.clearcoatNormalMap,re=O&&!!w.clearcoatRoughnessMap,xe=Q&&!!w.iridescenceMap,Le=Q&&!!w.iridescenceThicknessMap,Ie=Y&&!!w.sheenColorMap,_e=Y&&!!w.sheenRoughnessMap,Xe=!!w.specularMap,Be=!!w.specularColorMap,at=!!w.specularIntensityMap,N=we&&!!w.transmissionMap,ue=we&&!!w.thicknessMap,X=!!w.gradientMap,Z=!!w.alphaMap,pe=w.alphaTest>0,he=!!w.alphaHash,Fe=!!w.extensions;let St=ir;w.toneMapped&&(oe===null||oe.isXRRenderTarget===!0)&&(St=t.toneMapping);const jt={shaderID:K,shaderType:w.type,shaderName:w.name,vertexShader:Ve,fragmentShader:j,defines:w.defines,customVertexShaderID:ne,customFragmentShaderID:ce,isRawShaderMaterial:w.isRawShaderMaterial===!0,glslVersion:w.glslVersion,precision:p,batching:be,batchingColor:be&&B._colorsTexture!==null,instancing:Ae,instancingColor:Ae&&B.instanceColor!==null,instancingMorph:Ae&&B.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:oe===null?t.outputColorSpace:oe.isXRRenderTarget===!0?oe.texture.colorSpace:$s,alphaToCoverage:!!w.alphaToCoverage,map:ot,matcap:De,envMap:mt,envMapMode:mt&&ee.mapping,envMapCubeUVHeight:L,aoMap:U,lightMap:Qt,bumpMap:He,normalMap:We,displacementMap:f&&Re,emissiveMap:st,normalMapObjectSpace:We&&w.normalMapType===oS,normalMapTangentSpace:We&&w.normalMapType===Av,metalnessMap:Ce,roughnessMap:E,anisotropy:S,anisotropyMap:de,clearcoat:O,clearcoatMap:ve,clearcoatNormalMap:Ke,clearcoatRoughnessMap:re,dispersion:$,iridescence:Q,iridescenceMap:xe,iridescenceThicknessMap:Le,sheen:Y,sheenColorMap:Ie,sheenRoughnessMap:_e,specularMap:Xe,specularColorMap:Be,specularIntensityMap:at,transmission:we,transmissionMap:N,thicknessMap:ue,gradientMap:X,opaque:w.transparent===!1&&w.blending===Ps&&w.alphaToCoverage===!1,alphaMap:Z,alphaTest:pe,alphaHash:he,combine:w.combine,mapUv:ot&&v(w.map.channel),aoMapUv:U&&v(w.aoMap.channel),lightMapUv:Qt&&v(w.lightMap.channel),bumpMapUv:He&&v(w.bumpMap.channel),normalMapUv:We&&v(w.normalMap.channel),displacementMapUv:Re&&v(w.displacementMap.channel),emissiveMapUv:st&&v(w.emissiveMap.channel),metalnessMapUv:Ce&&v(w.metalnessMap.channel),roughnessMapUv:E&&v(w.roughnessMap.channel),anisotropyMapUv:de&&v(w.anisotropyMap.channel),clearcoatMapUv:ve&&v(w.clearcoatMap.channel),clearcoatNormalMapUv:Ke&&v(w.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:re&&v(w.clearcoatRoughnessMap.channel),iridescenceMapUv:xe&&v(w.iridescenceMap.channel),iridescenceThicknessMapUv:Le&&v(w.iridescenceThicknessMap.channel),sheenColorMapUv:Ie&&v(w.sheenColorMap.channel),sheenRoughnessMapUv:_e&&v(w.sheenRoughnessMap.channel),specularMapUv:Xe&&v(w.specularMap.channel),specularColorMapUv:Be&&v(w.specularColorMap.channel),specularIntensityMapUv:at&&v(w.specularIntensityMap.channel),transmissionMapUv:N&&v(w.transmissionMap.channel),thicknessMapUv:ue&&v(w.thicknessMap.channel),alphaMapUv:Z&&v(w.alphaMap.channel),vertexTangents:!!J.attributes.tangent&&(We||S),vertexColors:w.vertexColors,vertexAlphas:w.vertexColors===!0&&!!J.attributes.color&&J.attributes.color.itemSize===4,pointsUvs:B.isPoints===!0&&!!J.attributes.uv&&(ot||Z),fog:!!G,useFog:w.fog===!0,fogExp2:!!G&&G.isFogExp2,flatShading:w.flatShading===!0,sizeAttenuation:w.sizeAttenuation===!0,logarithmicDepthBuffer:h,reverseDepthBuffer:Pe,skinning:B.isSkinnedMesh===!0,morphTargets:J.morphAttributes.position!==void 0,morphNormals:J.morphAttributes.normal!==void 0,morphColors:J.morphAttributes.color!==void 0,morphTargetsCount:ae,morphTextureStride:ye,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:w.dithering,shadowMapEnabled:t.shadowMap.enabled&&P.length>0,shadowMapType:t.shadowMap.type,toneMapping:St,decodeVideoTexture:ot&&w.map.isVideoTexture===!0&&Ye.getTransfer(w.map.colorSpace)===it,decodeVideoTextureEmissive:st&&w.emissiveMap.isVideoTexture===!0&&Ye.getTransfer(w.emissiveMap.colorSpace)===it,premultipliedAlpha:w.premultipliedAlpha,doubleSided:w.side===Wn,flipSided:w.side===Vt,useDepthPacking:w.depthPacking>=0,depthPacking:w.depthPacking||0,index0AttributeName:w.index0AttributeName,extensionClipCullDistance:Fe&&w.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Fe&&w.extensions.multiDraw===!0||be)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:w.customProgramCacheKey()};return jt.vertexUv1s=c.has(1),jt.vertexUv2s=c.has(2),jt.vertexUv3s=c.has(3),c.clear(),jt}function d(w){const M=[];if(w.shaderID?M.push(w.shaderID):(M.push(w.customVertexShaderID),M.push(w.customFragmentShaderID)),w.defines!==void 0)for(const P in w.defines)M.push(P),M.push(w.defines[P]);return w.isRawShaderMaterial===!1&&(g(M,w),x(M,w),M.push(t.outputColorSpace)),M.push(w.customProgramCacheKey),M.join()}function g(w,M){w.push(M.precision),w.push(M.outputColorSpace),w.push(M.envMapMode),w.push(M.envMapCubeUVHeight),w.push(M.mapUv),w.push(M.alphaMapUv),w.push(M.lightMapUv),w.push(M.aoMapUv),w.push(M.bumpMapUv),w.push(M.normalMapUv),w.push(M.displacementMapUv),w.push(M.emissiveMapUv),w.push(M.metalnessMapUv),w.push(M.roughnessMapUv),w.push(M.anisotropyMapUv),w.push(M.clearcoatMapUv),w.push(M.clearcoatNormalMapUv),w.push(M.clearcoatRoughnessMapUv),w.push(M.iridescenceMapUv),w.push(M.iridescenceThicknessMapUv),w.push(M.sheenColorMapUv),w.push(M.sheenRoughnessMapUv),w.push(M.specularMapUv),w.push(M.specularColorMapUv),w.push(M.specularIntensityMapUv),w.push(M.transmissionMapUv),w.push(M.thicknessMapUv),w.push(M.combine),w.push(M.fogExp2),w.push(M.sizeAttenuation),w.push(M.morphTargetsCount),w.push(M.morphAttributeCount),w.push(M.numDirLights),w.push(M.numPointLights),w.push(M.numSpotLights),w.push(M.numSpotLightMaps),w.push(M.numHemiLights),w.push(M.numRectAreaLights),w.push(M.numDirLightShadows),w.push(M.numPointLightShadows),w.push(M.numSpotLightShadows),w.push(M.numSpotLightShadowsWithMaps),w.push(M.numLightProbes),w.push(M.shadowMapType),w.push(M.toneMapping),w.push(M.numClippingPlanes),w.push(M.numClipIntersection),w.push(M.depthPacking)}function x(w,M){a.disableAll(),M.supportsVertexTextures&&a.enable(0),M.instancing&&a.enable(1),M.instancingColor&&a.enable(2),M.instancingMorph&&a.enable(3),M.matcap&&a.enable(4),M.envMap&&a.enable(5),M.normalMapObjectSpace&&a.enable(6),M.normalMapTangentSpace&&a.enable(7),M.clearcoat&&a.enable(8),M.iridescence&&a.enable(9),M.alphaTest&&a.enable(10),M.vertexColors&&a.enable(11),M.vertexAlphas&&a.enable(12),M.vertexUv1s&&a.enable(13),M.vertexUv2s&&a.enable(14),M.vertexUv3s&&a.enable(15),M.vertexTangents&&a.enable(16),M.anisotropy&&a.enable(17),M.alphaHash&&a.enable(18),M.batching&&a.enable(19),M.dispersion&&a.enable(20),M.batchingColor&&a.enable(21),w.push(a.mask),a.disableAll(),M.fog&&a.enable(0),M.useFog&&a.enable(1),M.flatShading&&a.enable(2),M.logarithmicDepthBuffer&&a.enable(3),M.reverseDepthBuffer&&a.enable(4),M.skinning&&a.enable(5),M.morphTargets&&a.enable(6),M.morphNormals&&a.enable(7),M.morphColors&&a.enable(8),M.premultipliedAlpha&&a.enable(9),M.shadowMapEnabled&&a.enable(10),M.doubleSided&&a.enable(11),M.flipSided&&a.enable(12),M.useDepthPacking&&a.enable(13),M.dithering&&a.enable(14),M.transmission&&a.enable(15),M.sheen&&a.enable(16),M.opaque&&a.enable(17),M.pointsUvs&&a.enable(18),M.decodeVideoTexture&&a.enable(19),M.decodeVideoTextureEmissive&&a.enable(20),M.alphaToCoverage&&a.enable(21),w.push(a.mask)}function y(w){const M=_[w.type];let P;if(M){const V=ei[M];P=$S.clone(V.uniforms)}else P=w.uniforms;return P}function R(w,M){let P;for(let V=0,B=u.length;V<B;V++){const G=u[V];if(G.cacheKey===M){P=G,++P.usedTimes;break}}return P===void 0&&(P=new uT(t,M,w,s),u.push(P)),P}function C(w){if(--w.usedTimes===0){const M=u.indexOf(w);u[M]=u[u.length-1],u.pop(),w.destroy()}}function A(w){l.remove(w)}function b(){l.dispose()}return{getParameters:m,getProgramCacheKey:d,getUniforms:y,acquireProgram:R,releaseProgram:C,releaseShaderCache:A,programs:u,dispose:b}}function mT(){let t=new WeakMap;function e(o){return t.has(o)}function n(o){let a=t.get(o);return a===void 0&&(a={},t.set(o,a)),a}function i(o){t.delete(o)}function r(o,a,l){t.get(o)[a]=l}function s(){t=new WeakMap}return{has:e,get:n,remove:i,update:r,dispose:s}}function gT(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.material.id!==e.material.id?t.material.id-e.material.id:t.z!==e.z?t.z-e.z:t.id-e.id}function Lm(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.z!==e.z?e.z-t.z:t.id-e.id}function Nm(){const t=[];let e=0;const n=[],i=[],r=[];function s(){e=0,n.length=0,i.length=0,r.length=0}function o(h,f,p,_,v,m){let d=t[e];return d===void 0?(d={id:h.id,object:h,geometry:f,material:p,groupOrder:_,renderOrder:h.renderOrder,z:v,group:m},t[e]=d):(d.id=h.id,d.object=h,d.geometry=f,d.material=p,d.groupOrder=_,d.renderOrder=h.renderOrder,d.z=v,d.group=m),e++,d}function a(h,f,p,_,v,m){const d=o(h,f,p,_,v,m);p.transmission>0?i.push(d):p.transparent===!0?r.push(d):n.push(d)}function l(h,f,p,_,v,m){const d=o(h,f,p,_,v,m);p.transmission>0?i.unshift(d):p.transparent===!0?r.unshift(d):n.unshift(d)}function c(h,f){n.length>1&&n.sort(h||gT),i.length>1&&i.sort(f||Lm),r.length>1&&r.sort(f||Lm)}function u(){for(let h=e,f=t.length;h<f;h++){const p=t[h];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:n,transmissive:i,transparent:r,init:s,push:a,unshift:l,finish:u,sort:c}}function vT(){let t=new WeakMap;function e(i,r){const s=t.get(i);let o;return s===void 0?(o=new Nm,t.set(i,[o])):r>=s.length?(o=new Nm,s.push(o)):o=s[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}function xT(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={direction:new D,color:new ge};break;case"SpotLight":n={position:new D,direction:new D,color:new ge,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new D,color:new ge,distance:0,decay:0};break;case"HemisphereLight":n={direction:new D,skyColor:new ge,groundColor:new ge};break;case"RectAreaLight":n={color:new ge,position:new D,halfWidth:new D,halfHeight:new D};break}return t[e.id]=n,n}}}function _T(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new je};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new je};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new je,shadowCameraNear:1,shadowCameraFar:1e3};break}return t[e.id]=n,n}}}let yT=0;function ST(t,e){return(e.castShadow?2:0)-(t.castShadow?2:0)+(e.map?1:0)-(t.map?1:0)}function MT(t){const e=new xT,n=_T(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new D);const r=new D,s=new nt,o=new nt;function a(c){let u=0,h=0,f=0;for(let w=0;w<9;w++)i.probe[w].set(0,0,0);let p=0,_=0,v=0,m=0,d=0,g=0,x=0,y=0,R=0,C=0,A=0;c.sort(ST);for(let w=0,M=c.length;w<M;w++){const P=c[w],V=P.color,B=P.intensity,G=P.distance,J=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)u+=V.r*B,h+=V.g*B,f+=V.b*B;else if(P.isLightProbe){for(let W=0;W<9;W++)i.probe[W].addScaledVector(P.sh.coefficients[W],B);A++}else if(P.isDirectionalLight){const W=e.get(P);if(W.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const ee=P.shadow,L=n.get(P);L.shadowIntensity=ee.intensity,L.shadowBias=ee.bias,L.shadowNormalBias=ee.normalBias,L.shadowRadius=ee.radius,L.shadowMapSize=ee.mapSize,i.directionalShadow[p]=L,i.directionalShadowMap[p]=J,i.directionalShadowMatrix[p]=P.shadow.matrix,g++}i.directional[p]=W,p++}else if(P.isSpotLight){const W=e.get(P);W.position.setFromMatrixPosition(P.matrixWorld),W.color.copy(V).multiplyScalar(B),W.distance=G,W.coneCos=Math.cos(P.angle),W.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),W.decay=P.decay,i.spot[v]=W;const ee=P.shadow;if(P.map&&(i.spotLightMap[R]=P.map,R++,ee.updateMatrices(P),P.castShadow&&C++),i.spotLightMatrix[v]=ee.matrix,P.castShadow){const L=n.get(P);L.shadowIntensity=ee.intensity,L.shadowBias=ee.bias,L.shadowNormalBias=ee.normalBias,L.shadowRadius=ee.radius,L.shadowMapSize=ee.mapSize,i.spotShadow[v]=L,i.spotShadowMap[v]=J,y++}v++}else if(P.isRectAreaLight){const W=e.get(P);W.color.copy(V).multiplyScalar(B),W.halfWidth.set(P.width*.5,0,0),W.halfHeight.set(0,P.height*.5,0),i.rectArea[m]=W,m++}else if(P.isPointLight){const W=e.get(P);if(W.color.copy(P.color).multiplyScalar(P.intensity),W.distance=P.distance,W.decay=P.decay,P.castShadow){const ee=P.shadow,L=n.get(P);L.shadowIntensity=ee.intensity,L.shadowBias=ee.bias,L.shadowNormalBias=ee.normalBias,L.shadowRadius=ee.radius,L.shadowMapSize=ee.mapSize,L.shadowCameraNear=ee.camera.near,L.shadowCameraFar=ee.camera.far,i.pointShadow[_]=L,i.pointShadowMap[_]=J,i.pointShadowMatrix[_]=P.shadow.matrix,x++}i.point[_]=W,_++}else if(P.isHemisphereLight){const W=e.get(P);W.skyColor.copy(P.color).multiplyScalar(B),W.groundColor.copy(P.groundColor).multiplyScalar(B),i.hemi[d]=W,d++}}m>0&&(t.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=le.LTC_FLOAT_1,i.rectAreaLTC2=le.LTC_FLOAT_2):(i.rectAreaLTC1=le.LTC_HALF_1,i.rectAreaLTC2=le.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=h,i.ambient[2]=f;const b=i.hash;(b.directionalLength!==p||b.pointLength!==_||b.spotLength!==v||b.rectAreaLength!==m||b.hemiLength!==d||b.numDirectionalShadows!==g||b.numPointShadows!==x||b.numSpotShadows!==y||b.numSpotMaps!==R||b.numLightProbes!==A)&&(i.directional.length=p,i.spot.length=v,i.rectArea.length=m,i.point.length=_,i.hemi.length=d,i.directionalShadow.length=g,i.directionalShadowMap.length=g,i.pointShadow.length=x,i.pointShadowMap.length=x,i.spotShadow.length=y,i.spotShadowMap.length=y,i.directionalShadowMatrix.length=g,i.pointShadowMatrix.length=x,i.spotLightMatrix.length=y+R-C,i.spotLightMap.length=R,i.numSpotLightShadowsWithMaps=C,i.numLightProbes=A,b.directionalLength=p,b.pointLength=_,b.spotLength=v,b.rectAreaLength=m,b.hemiLength=d,b.numDirectionalShadows=g,b.numPointShadows=x,b.numSpotShadows=y,b.numSpotMaps=R,b.numLightProbes=A,i.version=yT++)}function l(c,u){let h=0,f=0,p=0,_=0,v=0;const m=u.matrixWorldInverse;for(let d=0,g=c.length;d<g;d++){const x=c[d];if(x.isDirectionalLight){const y=i.directional[h];y.direction.setFromMatrixPosition(x.matrixWorld),r.setFromMatrixPosition(x.target.matrixWorld),y.direction.sub(r),y.direction.transformDirection(m),h++}else if(x.isSpotLight){const y=i.spot[p];y.position.setFromMatrixPosition(x.matrixWorld),y.position.applyMatrix4(m),y.direction.setFromMatrixPosition(x.matrixWorld),r.setFromMatrixPosition(x.target.matrixWorld),y.direction.sub(r),y.direction.transformDirection(m),p++}else if(x.isRectAreaLight){const y=i.rectArea[_];y.position.setFromMatrixPosition(x.matrixWorld),y.position.applyMatrix4(m),o.identity(),s.copy(x.matrixWorld),s.premultiply(m),o.extractRotation(s),y.halfWidth.set(x.width*.5,0,0),y.halfHeight.set(0,x.height*.5,0),y.halfWidth.applyMatrix4(o),y.halfHeight.applyMatrix4(o),_++}else if(x.isPointLight){const y=i.point[f];y.position.setFromMatrixPosition(x.matrixWorld),y.position.applyMatrix4(m),f++}else if(x.isHemisphereLight){const y=i.hemi[v];y.direction.setFromMatrixPosition(x.matrixWorld),y.direction.transformDirection(m),v++}}}return{setup:a,setupView:l,state:i}}function Im(t){const e=new MT(t),n=[],i=[];function r(u){c.camera=u,n.length=0,i.length=0}function s(u){n.push(u)}function o(u){i.push(u)}function a(){e.setup(n)}function l(u){e.setupView(n,u)}const c={lightsArray:n,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:c,setupLights:a,setupLightsView:l,pushLight:s,pushShadow:o}}function ET(t){let e=new WeakMap;function n(r,s=0){const o=e.get(r);let a;return o===void 0?(a=new Im(t),e.set(r,[a])):s>=o.length?(a=new Im(t),o.push(a)):a=o[s],a}function i(){e=new WeakMap}return{get:n,dispose:i}}class wT extends jr{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=rS,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class TT extends jr{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const AT=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,CT=`uniform sampler2D shadow_pass;
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
}`;function bT(t,e,n){let i=new mf;const r=new je,s=new je,o=new rt,a=new wT({depthPacking:sS}),l=new TT,c={},u=n.maxTextureSize,h={[or]:Vt,[Vt]:or,[Wn]:Wn},f=new Lt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new je},radius:{value:4}},vertexShader:AT,fragmentShader:CT}),p=f.clone();p.defines.HORIZONTAL_PASS=1;const _=new bt;_.setAttribute("position",new Et(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new Tt(_,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=fv;let d=this.type;this.render=function(C,A,b){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||C.length===0)return;const w=t.getRenderTarget(),M=t.getActiveCubeFace(),P=t.getActiveMipmapLevel(),V=t.state;V.setBlending(nr),V.buffers.color.setClear(1,1,1,1),V.buffers.depth.setTest(!0),V.setScissorTest(!1);const B=d!==mi&&this.type===mi,G=d===mi&&this.type!==mi;for(let J=0,W=C.length;J<W;J++){const ee=C[J],L=ee.shadow;if(L===void 0){console.warn("THREE.WebGLShadowMap:",ee,"has no shadow.");continue}if(L.autoUpdate===!1&&L.needsUpdate===!1)continue;r.copy(L.mapSize);const K=L.getFrameExtents();if(r.multiply(K),s.copy(L.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/K.x),r.x=s.x*K.x,L.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/K.y),r.y=s.y*K.y,L.mapSize.y=s.y)),L.map===null||B===!0||G===!0){const ae=this.type!==mi?{minFilter:Mn,magFilter:Mn}:{};L.map!==null&&L.map.dispose(),L.map=new zr(r.x,r.y,ae),L.map.texture.name=ee.name+".shadowMap",L.camera.updateProjectionMatrix()}t.setRenderTarget(L.map),t.clear();const q=L.getViewportCount();for(let ae=0;ae<q;ae++){const ye=L.getViewport(ae);o.set(s.x*ye.x,s.y*ye.y,s.x*ye.z,s.y*ye.w),V.viewport(o),L.updateMatrices(ee,ae),i=L.getFrustum(),y(A,b,L.camera,ee,this.type)}L.isPointLightShadow!==!0&&this.type===mi&&g(L,b),L.needsUpdate=!1}d=this.type,m.needsUpdate=!1,t.setRenderTarget(w,M,P)};function g(C,A){const b=e.update(v);f.defines.VSM_SAMPLES!==C.blurSamples&&(f.defines.VSM_SAMPLES=C.blurSamples,p.defines.VSM_SAMPLES=C.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),C.mapPass===null&&(C.mapPass=new zr(r.x,r.y)),f.uniforms.shadow_pass.value=C.map.texture,f.uniforms.resolution.value=C.mapSize,f.uniforms.radius.value=C.radius,t.setRenderTarget(C.mapPass),t.clear(),t.renderBufferDirect(A,null,b,f,v,null),p.uniforms.shadow_pass.value=C.mapPass.texture,p.uniforms.resolution.value=C.mapSize,p.uniforms.radius.value=C.radius,t.setRenderTarget(C.map),t.clear(),t.renderBufferDirect(A,null,b,p,v,null)}function x(C,A,b,w){let M=null;const P=b.isPointLight===!0?C.customDistanceMaterial:C.customDepthMaterial;if(P!==void 0)M=P;else if(M=b.isPointLight===!0?l:a,t.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const V=M.uuid,B=A.uuid;let G=c[V];G===void 0&&(G={},c[V]=G);let J=G[B];J===void 0&&(J=M.clone(),G[B]=J,A.addEventListener("dispose",R)),M=J}if(M.visible=A.visible,M.wireframe=A.wireframe,w===mi?M.side=A.shadowSide!==null?A.shadowSide:A.side:M.side=A.shadowSide!==null?A.shadowSide:h[A.side],M.alphaMap=A.alphaMap,M.alphaTest=A.alphaTest,M.map=A.map,M.clipShadows=A.clipShadows,M.clippingPlanes=A.clippingPlanes,M.clipIntersection=A.clipIntersection,M.displacementMap=A.displacementMap,M.displacementScale=A.displacementScale,M.displacementBias=A.displacementBias,M.wireframeLinewidth=A.wireframeLinewidth,M.linewidth=A.linewidth,b.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const V=t.properties.get(M);V.light=b}return M}function y(C,A,b,w,M){if(C.visible===!1)return;if(C.layers.test(A.layers)&&(C.isMesh||C.isLine||C.isPoints)&&(C.castShadow||C.receiveShadow&&M===mi)&&(!C.frustumCulled||i.intersectsObject(C))){C.modelViewMatrix.multiplyMatrices(b.matrixWorldInverse,C.matrixWorld);const B=e.update(C),G=C.material;if(Array.isArray(G)){const J=B.groups;for(let W=0,ee=J.length;W<ee;W++){const L=J[W],K=G[L.materialIndex];if(K&&K.visible){const q=x(C,K,w,M);C.onBeforeShadow(t,C,A,b,B,q,L),t.renderBufferDirect(b,null,B,q,C,L),C.onAfterShadow(t,C,A,b,B,q,L)}}}else if(G.visible){const J=x(C,G,w,M);C.onBeforeShadow(t,C,A,b,B,J,null),t.renderBufferDirect(b,null,B,J,C,null),C.onAfterShadow(t,C,A,b,B,J,null)}}const V=C.children;for(let B=0,G=V.length;B<G;B++)y(V[B],A,b,w,M)}function R(C){C.target.removeEventListener("dispose",R);for(const b in c){const w=c[b],M=C.target.uuid;M in w&&(w[M].dispose(),delete w[M])}}}const RT={[Ed]:wd,[Td]:bd,[Ad]:Rd,[zs]:Cd,[wd]:Ed,[bd]:Td,[Rd]:Ad,[Cd]:zs};function PT(t,e){function n(){let N=!1;const ue=new rt;let X=null;const Z=new rt(0,0,0,0);return{setMask:function(pe){X!==pe&&!N&&(t.colorMask(pe,pe,pe,pe),X=pe)},setLocked:function(pe){N=pe},setClear:function(pe,he,Fe,St,jt){jt===!0&&(pe*=St,he*=St,Fe*=St),ue.set(pe,he,Fe,St),Z.equals(ue)===!1&&(t.clearColor(pe,he,Fe,St),Z.copy(ue))},reset:function(){N=!1,X=null,Z.set(-1,0,0,0)}}}function i(){let N=!1,ue=!1,X=null,Z=null,pe=null;return{setReversed:function(he){if(ue!==he){const Fe=e.get("EXT_clip_control");ue?Fe.clipControlEXT(Fe.LOWER_LEFT_EXT,Fe.ZERO_TO_ONE_EXT):Fe.clipControlEXT(Fe.LOWER_LEFT_EXT,Fe.NEGATIVE_ONE_TO_ONE_EXT);const St=pe;pe=null,this.setClear(St)}ue=he},getReversed:function(){return ue},setTest:function(he){he?oe(t.DEPTH_TEST):Pe(t.DEPTH_TEST)},setMask:function(he){X!==he&&!N&&(t.depthMask(he),X=he)},setFunc:function(he){if(ue&&(he=RT[he]),Z!==he){switch(he){case Ed:t.depthFunc(t.NEVER);break;case wd:t.depthFunc(t.ALWAYS);break;case Td:t.depthFunc(t.LESS);break;case zs:t.depthFunc(t.LEQUAL);break;case Ad:t.depthFunc(t.EQUAL);break;case Cd:t.depthFunc(t.GEQUAL);break;case bd:t.depthFunc(t.GREATER);break;case Rd:t.depthFunc(t.NOTEQUAL);break;default:t.depthFunc(t.LEQUAL)}Z=he}},setLocked:function(he){N=he},setClear:function(he){pe!==he&&(ue&&(he=1-he),t.clearDepth(he),pe=he)},reset:function(){N=!1,X=null,Z=null,pe=null,ue=!1}}}function r(){let N=!1,ue=null,X=null,Z=null,pe=null,he=null,Fe=null,St=null,jt=null;return{setTest:function(Qe){N||(Qe?oe(t.STENCIL_TEST):Pe(t.STENCIL_TEST))},setMask:function(Qe){ue!==Qe&&!N&&(t.stencilMask(Qe),ue=Qe)},setFunc:function(Qe,Un,li){(X!==Qe||Z!==Un||pe!==li)&&(t.stencilFunc(Qe,Un,li),X=Qe,Z=Un,pe=li)},setOp:function(Qe,Un,li){(he!==Qe||Fe!==Un||St!==li)&&(t.stencilOp(Qe,Un,li),he=Qe,Fe=Un,St=li)},setLocked:function(Qe){N=Qe},setClear:function(Qe){jt!==Qe&&(t.clearStencil(Qe),jt=Qe)},reset:function(){N=!1,ue=null,X=null,Z=null,pe=null,he=null,Fe=null,St=null,jt=null}}}const s=new n,o=new i,a=new r,l=new WeakMap,c=new WeakMap;let u={},h={},f=new WeakMap,p=[],_=null,v=!1,m=null,d=null,g=null,x=null,y=null,R=null,C=null,A=new ge(0,0,0),b=0,w=!1,M=null,P=null,V=null,B=null,G=null;const J=t.getParameter(t.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let W=!1,ee=0;const L=t.getParameter(t.VERSION);L.indexOf("WebGL")!==-1?(ee=parseFloat(/^WebGL (\d)/.exec(L)[1]),W=ee>=1):L.indexOf("OpenGL ES")!==-1&&(ee=parseFloat(/^OpenGL ES (\d)/.exec(L)[1]),W=ee>=2);let K=null,q={};const ae=t.getParameter(t.SCISSOR_BOX),ye=t.getParameter(t.VIEWPORT),Ve=new rt().fromArray(ae),j=new rt().fromArray(ye);function ne(N,ue,X,Z){const pe=new Uint8Array(4),he=t.createTexture();t.bindTexture(N,he),t.texParameteri(N,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(N,t.TEXTURE_MAG_FILTER,t.NEAREST);for(let Fe=0;Fe<X;Fe++)N===t.TEXTURE_3D||N===t.TEXTURE_2D_ARRAY?t.texImage3D(ue,0,t.RGBA,1,1,Z,0,t.RGBA,t.UNSIGNED_BYTE,pe):t.texImage2D(ue+Fe,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,pe);return he}const ce={};ce[t.TEXTURE_2D]=ne(t.TEXTURE_2D,t.TEXTURE_2D,1),ce[t.TEXTURE_CUBE_MAP]=ne(t.TEXTURE_CUBE_MAP,t.TEXTURE_CUBE_MAP_POSITIVE_X,6),ce[t.TEXTURE_2D_ARRAY]=ne(t.TEXTURE_2D_ARRAY,t.TEXTURE_2D_ARRAY,1,1),ce[t.TEXTURE_3D]=ne(t.TEXTURE_3D,t.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),oe(t.DEPTH_TEST),o.setFunc(zs),He(!1),We(kp),oe(t.CULL_FACE),U(nr);function oe(N){u[N]!==!0&&(t.enable(N),u[N]=!0)}function Pe(N){u[N]!==!1&&(t.disable(N),u[N]=!1)}function Ae(N,ue){return h[N]!==ue?(t.bindFramebuffer(N,ue),h[N]=ue,N===t.DRAW_FRAMEBUFFER&&(h[t.FRAMEBUFFER]=ue),N===t.FRAMEBUFFER&&(h[t.DRAW_FRAMEBUFFER]=ue),!0):!1}function be(N,ue){let X=p,Z=!1;if(N){X=f.get(ue),X===void 0&&(X=[],f.set(ue,X));const pe=N.textures;if(X.length!==pe.length||X[0]!==t.COLOR_ATTACHMENT0){for(let he=0,Fe=pe.length;he<Fe;he++)X[he]=t.COLOR_ATTACHMENT0+he;X.length=pe.length,Z=!0}}else X[0]!==t.BACK&&(X[0]=t.BACK,Z=!0);Z&&t.drawBuffers(X)}function ot(N){return _!==N?(t.useProgram(N),_=N,!0):!1}const De={[Mr]:t.FUNC_ADD,[Ly]:t.FUNC_SUBTRACT,[Ny]:t.FUNC_REVERSE_SUBTRACT};De[Iy]=t.MIN,De[Uy]=t.MAX;const mt={[Fy]:t.ZERO,[Oy]:t.ONE,[ky]:t.SRC_COLOR,[Sd]:t.SRC_ALPHA,[Wy]:t.SRC_ALPHA_SATURATE,[Vy]:t.DST_COLOR,[zy]:t.DST_ALPHA,[By]:t.ONE_MINUS_SRC_COLOR,[Md]:t.ONE_MINUS_SRC_ALPHA,[Gy]:t.ONE_MINUS_DST_COLOR,[Hy]:t.ONE_MINUS_DST_ALPHA,[jy]:t.CONSTANT_COLOR,[Xy]:t.ONE_MINUS_CONSTANT_COLOR,[Ky]:t.CONSTANT_ALPHA,[Yy]:t.ONE_MINUS_CONSTANT_ALPHA};function U(N,ue,X,Z,pe,he,Fe,St,jt,Qe){if(N===nr){v===!0&&(Pe(t.BLEND),v=!1);return}if(v===!1&&(oe(t.BLEND),v=!0),N!==Dy){if(N!==m||Qe!==w){if((d!==Mr||y!==Mr)&&(t.blendEquation(t.FUNC_ADD),d=Mr,y=Mr),Qe)switch(N){case Ps:t.blendFuncSeparate(t.ONE,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case Mi:t.blendFunc(t.ONE,t.ONE);break;case Bp:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case zp:t.blendFuncSeparate(t.ZERO,t.SRC_COLOR,t.ZERO,t.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}else switch(N){case Ps:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case Mi:t.blendFunc(t.SRC_ALPHA,t.ONE);break;case Bp:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case zp:t.blendFunc(t.ZERO,t.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}g=null,x=null,R=null,C=null,A.set(0,0,0),b=0,m=N,w=Qe}return}pe=pe||ue,he=he||X,Fe=Fe||Z,(ue!==d||pe!==y)&&(t.blendEquationSeparate(De[ue],De[pe]),d=ue,y=pe),(X!==g||Z!==x||he!==R||Fe!==C)&&(t.blendFuncSeparate(mt[X],mt[Z],mt[he],mt[Fe]),g=X,x=Z,R=he,C=Fe),(St.equals(A)===!1||jt!==b)&&(t.blendColor(St.r,St.g,St.b,jt),A.copy(St),b=jt),m=N,w=!1}function Qt(N,ue){N.side===Wn?Pe(t.CULL_FACE):oe(t.CULL_FACE);let X=N.side===Vt;ue&&(X=!X),He(X),N.blending===Ps&&N.transparent===!1?U(nr):U(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),o.setFunc(N.depthFunc),o.setTest(N.depthTest),o.setMask(N.depthWrite),s.setMask(N.colorWrite);const Z=N.stencilWrite;a.setTest(Z),Z&&(a.setMask(N.stencilWriteMask),a.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),a.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),st(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?oe(t.SAMPLE_ALPHA_TO_COVERAGE):Pe(t.SAMPLE_ALPHA_TO_COVERAGE)}function He(N){M!==N&&(N?t.frontFace(t.CW):t.frontFace(t.CCW),M=N)}function We(N){N!==by?(oe(t.CULL_FACE),N!==P&&(N===kp?t.cullFace(t.BACK):N===Ry?t.cullFace(t.FRONT):t.cullFace(t.FRONT_AND_BACK))):Pe(t.CULL_FACE),P=N}function Re(N){N!==V&&(W&&t.lineWidth(N),V=N)}function st(N,ue,X){N?(oe(t.POLYGON_OFFSET_FILL),(B!==ue||G!==X)&&(t.polygonOffset(ue,X),B=ue,G=X)):Pe(t.POLYGON_OFFSET_FILL)}function Ce(N){N?oe(t.SCISSOR_TEST):Pe(t.SCISSOR_TEST)}function E(N){N===void 0&&(N=t.TEXTURE0+J-1),K!==N&&(t.activeTexture(N),K=N)}function S(N,ue,X){X===void 0&&(K===null?X=t.TEXTURE0+J-1:X=K);let Z=q[X];Z===void 0&&(Z={type:void 0,texture:void 0},q[X]=Z),(Z.type!==N||Z.texture!==ue)&&(K!==X&&(t.activeTexture(X),K=X),t.bindTexture(N,ue||ce[N]),Z.type=N,Z.texture=ue)}function O(){const N=q[K];N!==void 0&&N.type!==void 0&&(t.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function $(){try{t.compressedTexImage2D.apply(t,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Q(){try{t.compressedTexImage3D.apply(t,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Y(){try{t.texSubImage2D.apply(t,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function we(){try{t.texSubImage3D.apply(t,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function de(){try{t.compressedTexSubImage2D.apply(t,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ve(){try{t.compressedTexSubImage3D.apply(t,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ke(){try{t.texStorage2D.apply(t,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function re(){try{t.texStorage3D.apply(t,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function xe(){try{t.texImage2D.apply(t,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Le(){try{t.texImage3D.apply(t,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ie(N){Ve.equals(N)===!1&&(t.scissor(N.x,N.y,N.z,N.w),Ve.copy(N))}function _e(N){j.equals(N)===!1&&(t.viewport(N.x,N.y,N.z,N.w),j.copy(N))}function Xe(N,ue){let X=c.get(ue);X===void 0&&(X=new WeakMap,c.set(ue,X));let Z=X.get(N);Z===void 0&&(Z=t.getUniformBlockIndex(ue,N.name),X.set(N,Z))}function Be(N,ue){const Z=c.get(ue).get(N);l.get(ue)!==Z&&(t.uniformBlockBinding(ue,Z,N.__bindingPointIndex),l.set(ue,Z))}function at(){t.disable(t.BLEND),t.disable(t.CULL_FACE),t.disable(t.DEPTH_TEST),t.disable(t.POLYGON_OFFSET_FILL),t.disable(t.SCISSOR_TEST),t.disable(t.STENCIL_TEST),t.disable(t.SAMPLE_ALPHA_TO_COVERAGE),t.blendEquation(t.FUNC_ADD),t.blendFunc(t.ONE,t.ZERO),t.blendFuncSeparate(t.ONE,t.ZERO,t.ONE,t.ZERO),t.blendColor(0,0,0,0),t.colorMask(!0,!0,!0,!0),t.clearColor(0,0,0,0),t.depthMask(!0),t.depthFunc(t.LESS),o.setReversed(!1),t.clearDepth(1),t.stencilMask(4294967295),t.stencilFunc(t.ALWAYS,0,4294967295),t.stencilOp(t.KEEP,t.KEEP,t.KEEP),t.clearStencil(0),t.cullFace(t.BACK),t.frontFace(t.CCW),t.polygonOffset(0,0),t.activeTexture(t.TEXTURE0),t.bindFramebuffer(t.FRAMEBUFFER,null),t.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),t.bindFramebuffer(t.READ_FRAMEBUFFER,null),t.useProgram(null),t.lineWidth(1),t.scissor(0,0,t.canvas.width,t.canvas.height),t.viewport(0,0,t.canvas.width,t.canvas.height),u={},K=null,q={},h={},f=new WeakMap,p=[],_=null,v=!1,m=null,d=null,g=null,x=null,y=null,R=null,C=null,A=new ge(0,0,0),b=0,w=!1,M=null,P=null,V=null,B=null,G=null,Ve.set(0,0,t.canvas.width,t.canvas.height),j.set(0,0,t.canvas.width,t.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:oe,disable:Pe,bindFramebuffer:Ae,drawBuffers:be,useProgram:ot,setBlending:U,setMaterial:Qt,setFlipSided:He,setCullFace:We,setLineWidth:Re,setPolygonOffset:st,setScissorTest:Ce,activeTexture:E,bindTexture:S,unbindTexture:O,compressedTexImage2D:$,compressedTexImage3D:Q,texImage2D:xe,texImage3D:Le,updateUBOMapping:Xe,uniformBlockBinding:Be,texStorage2D:Ke,texStorage3D:re,texSubImage2D:Y,texSubImage3D:we,compressedTexSubImage2D:de,compressedTexSubImage3D:ve,scissor:Ie,viewport:_e,reset:at}}function Um(t,e,n,i){const r=DT(i);switch(n){case yv:return t*e;case Mv:return t*e;case Ev:return t*e*2;case cf:return t*e/r.components*r.byteLength;case uf:return t*e/r.components*r.byteLength;case wv:return t*e*2/r.components*r.byteLength;case df:return t*e*2/r.components*r.byteLength;case Sv:return t*e*3/r.components*r.byteLength;case Xn:return t*e*4/r.components*r.byteLength;case hf:return t*e*4/r.components*r.byteLength;case _l:case yl:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case Sl:case Ml:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Id:case Fd:return Math.max(t,16)*Math.max(e,8)/4;case Nd:case Ud:return Math.max(t,8)*Math.max(e,8)/2;case Od:case kd:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case Bd:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case zd:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Hd:return Math.floor((t+4)/5)*Math.floor((e+3)/4)*16;case Vd:return Math.floor((t+4)/5)*Math.floor((e+4)/5)*16;case Gd:return Math.floor((t+5)/6)*Math.floor((e+4)/5)*16;case Wd:return Math.floor((t+5)/6)*Math.floor((e+5)/6)*16;case jd:return Math.floor((t+7)/8)*Math.floor((e+4)/5)*16;case Xd:return Math.floor((t+7)/8)*Math.floor((e+5)/6)*16;case Kd:return Math.floor((t+7)/8)*Math.floor((e+7)/8)*16;case Yd:return Math.floor((t+9)/10)*Math.floor((e+4)/5)*16;case qd:return Math.floor((t+9)/10)*Math.floor((e+5)/6)*16;case $d:return Math.floor((t+9)/10)*Math.floor((e+7)/8)*16;case Zd:return Math.floor((t+9)/10)*Math.floor((e+9)/10)*16;case Jd:return Math.floor((t+11)/12)*Math.floor((e+9)/10)*16;case Qd:return Math.floor((t+11)/12)*Math.floor((e+11)/12)*16;case El:case eh:case th:return Math.ceil(t/4)*Math.ceil(e/4)*16;case Tv:case nh:return Math.ceil(t/4)*Math.ceil(e/4)*8;case ih:case rh:return Math.ceil(t/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${n} format.`)}function DT(t){switch(t){case bi:case vv:return{byteLength:1,components:1};case ta:case xv:case da:return{byteLength:2,components:1};case af:case lf:return{byteLength:2,components:4};case Br:case of:case ii:return{byteLength:4,components:1};case _v:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${t}.`)}function LT(t,e,n,i,r,s,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new je,u=new WeakMap;let h;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(E,S){return p?new OffscreenCanvas(E,S):ia("canvas")}function v(E,S,O){let $=1;const Q=Ce(E);if((Q.width>O||Q.height>O)&&($=O/Math.max(Q.width,Q.height)),$<1)if(typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&E instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&E instanceof ImageBitmap||typeof VideoFrame<"u"&&E instanceof VideoFrame){const Y=Math.floor($*Q.width),we=Math.floor($*Q.height);h===void 0&&(h=_(Y,we));const de=S?_(Y,we):h;return de.width=Y,de.height=we,de.getContext("2d").drawImage(E,0,0,Y,we),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Q.width+"x"+Q.height+") to ("+Y+"x"+we+")."),de}else return"data"in E&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Q.width+"x"+Q.height+")."),E;return E}function m(E){return E.generateMipmaps}function d(E){t.generateMipmap(E)}function g(E){return E.isWebGLCubeRenderTarget?t.TEXTURE_CUBE_MAP:E.isWebGL3DRenderTarget?t.TEXTURE_3D:E.isWebGLArrayRenderTarget||E.isCompressedArrayTexture?t.TEXTURE_2D_ARRAY:t.TEXTURE_2D}function x(E,S,O,$,Q=!1){if(E!==null){if(t[E]!==void 0)return t[E];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+E+"'")}let Y=S;if(S===t.RED&&(O===t.FLOAT&&(Y=t.R32F),O===t.HALF_FLOAT&&(Y=t.R16F),O===t.UNSIGNED_BYTE&&(Y=t.R8)),S===t.RED_INTEGER&&(O===t.UNSIGNED_BYTE&&(Y=t.R8UI),O===t.UNSIGNED_SHORT&&(Y=t.R16UI),O===t.UNSIGNED_INT&&(Y=t.R32UI),O===t.BYTE&&(Y=t.R8I),O===t.SHORT&&(Y=t.R16I),O===t.INT&&(Y=t.R32I)),S===t.RG&&(O===t.FLOAT&&(Y=t.RG32F),O===t.HALF_FLOAT&&(Y=t.RG16F),O===t.UNSIGNED_BYTE&&(Y=t.RG8)),S===t.RG_INTEGER&&(O===t.UNSIGNED_BYTE&&(Y=t.RG8UI),O===t.UNSIGNED_SHORT&&(Y=t.RG16UI),O===t.UNSIGNED_INT&&(Y=t.RG32UI),O===t.BYTE&&(Y=t.RG8I),O===t.SHORT&&(Y=t.RG16I),O===t.INT&&(Y=t.RG32I)),S===t.RGB_INTEGER&&(O===t.UNSIGNED_BYTE&&(Y=t.RGB8UI),O===t.UNSIGNED_SHORT&&(Y=t.RGB16UI),O===t.UNSIGNED_INT&&(Y=t.RGB32UI),O===t.BYTE&&(Y=t.RGB8I),O===t.SHORT&&(Y=t.RGB16I),O===t.INT&&(Y=t.RGB32I)),S===t.RGBA_INTEGER&&(O===t.UNSIGNED_BYTE&&(Y=t.RGBA8UI),O===t.UNSIGNED_SHORT&&(Y=t.RGBA16UI),O===t.UNSIGNED_INT&&(Y=t.RGBA32UI),O===t.BYTE&&(Y=t.RGBA8I),O===t.SHORT&&(Y=t.RGBA16I),O===t.INT&&(Y=t.RGBA32I)),S===t.RGB&&O===t.UNSIGNED_INT_5_9_9_9_REV&&(Y=t.RGB9_E5),S===t.RGBA){const we=Q?vc:Ye.getTransfer($);O===t.FLOAT&&(Y=t.RGBA32F),O===t.HALF_FLOAT&&(Y=t.RGBA16F),O===t.UNSIGNED_BYTE&&(Y=we===it?t.SRGB8_ALPHA8:t.RGBA8),O===t.UNSIGNED_SHORT_4_4_4_4&&(Y=t.RGBA4),O===t.UNSIGNED_SHORT_5_5_5_1&&(Y=t.RGB5_A1)}return(Y===t.R16F||Y===t.R32F||Y===t.RG16F||Y===t.RG32F||Y===t.RGBA16F||Y===t.RGBA32F)&&e.get("EXT_color_buffer_float"),Y}function y(E,S){let O;return E?S===null||S===Br||S===Gs?O=t.DEPTH24_STENCIL8:S===ii?O=t.DEPTH32F_STENCIL8:S===ta&&(O=t.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===Br||S===Gs?O=t.DEPTH_COMPONENT24:S===ii?O=t.DEPTH_COMPONENT32F:S===ta&&(O=t.DEPTH_COMPONENT16),O}function R(E,S){return m(E)===!0||E.isFramebufferTexture&&E.minFilter!==Mn&&E.minFilter!==yn?Math.log2(Math.max(S.width,S.height))+1:E.mipmaps!==void 0&&E.mipmaps.length>0?E.mipmaps.length:E.isCompressedTexture&&Array.isArray(E.image)?S.mipmaps.length:1}function C(E){const S=E.target;S.removeEventListener("dispose",C),b(S),S.isVideoTexture&&u.delete(S)}function A(E){const S=E.target;S.removeEventListener("dispose",A),M(S)}function b(E){const S=i.get(E);if(S.__webglInit===void 0)return;const O=E.source,$=f.get(O);if($){const Q=$[S.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&w(E),Object.keys($).length===0&&f.delete(O)}i.remove(E)}function w(E){const S=i.get(E);t.deleteTexture(S.__webglTexture);const O=E.source,$=f.get(O);delete $[S.__cacheKey],o.memory.textures--}function M(E){const S=i.get(E);if(E.depthTexture&&(E.depthTexture.dispose(),i.remove(E.depthTexture)),E.isWebGLCubeRenderTarget)for(let $=0;$<6;$++){if(Array.isArray(S.__webglFramebuffer[$]))for(let Q=0;Q<S.__webglFramebuffer[$].length;Q++)t.deleteFramebuffer(S.__webglFramebuffer[$][Q]);else t.deleteFramebuffer(S.__webglFramebuffer[$]);S.__webglDepthbuffer&&t.deleteRenderbuffer(S.__webglDepthbuffer[$])}else{if(Array.isArray(S.__webglFramebuffer))for(let $=0;$<S.__webglFramebuffer.length;$++)t.deleteFramebuffer(S.__webglFramebuffer[$]);else t.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&t.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&t.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let $=0;$<S.__webglColorRenderbuffer.length;$++)S.__webglColorRenderbuffer[$]&&t.deleteRenderbuffer(S.__webglColorRenderbuffer[$]);S.__webglDepthRenderbuffer&&t.deleteRenderbuffer(S.__webglDepthRenderbuffer)}const O=E.textures;for(let $=0,Q=O.length;$<Q;$++){const Y=i.get(O[$]);Y.__webglTexture&&(t.deleteTexture(Y.__webglTexture),o.memory.textures--),i.remove(O[$])}i.remove(E)}let P=0;function V(){P=0}function B(){const E=P;return E>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+E+" texture units while this GPU supports only "+r.maxTextures),P+=1,E}function G(E){const S=[];return S.push(E.wrapS),S.push(E.wrapT),S.push(E.wrapR||0),S.push(E.magFilter),S.push(E.minFilter),S.push(E.anisotropy),S.push(E.internalFormat),S.push(E.format),S.push(E.type),S.push(E.generateMipmaps),S.push(E.premultiplyAlpha),S.push(E.flipY),S.push(E.unpackAlignment),S.push(E.colorSpace),S.join()}function J(E,S){const O=i.get(E);if(E.isVideoTexture&&Re(E),E.isRenderTargetTexture===!1&&E.version>0&&O.__version!==E.version){const $=E.image;if($===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if($.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{j(O,E,S);return}}n.bindTexture(t.TEXTURE_2D,O.__webglTexture,t.TEXTURE0+S)}function W(E,S){const O=i.get(E);if(E.version>0&&O.__version!==E.version){j(O,E,S);return}n.bindTexture(t.TEXTURE_2D_ARRAY,O.__webglTexture,t.TEXTURE0+S)}function ee(E,S){const O=i.get(E);if(E.version>0&&O.__version!==E.version){j(O,E,S);return}n.bindTexture(t.TEXTURE_3D,O.__webglTexture,t.TEXTURE0+S)}function L(E,S){const O=i.get(E);if(E.version>0&&O.__version!==E.version){ne(O,E,S);return}n.bindTexture(t.TEXTURE_CUBE_MAP,O.__webglTexture,t.TEXTURE0+S)}const K={[vt]:t.REPEAT,[et]:t.CLAMP_TO_EDGE,[Ld]:t.MIRRORED_REPEAT},q={[Mn]:t.NEAREST,[iS]:t.NEAREST_MIPMAP_NEAREST,[Ia]:t.NEAREST_MIPMAP_LINEAR,[yn]:t.LINEAR,[Kc]:t.LINEAR_MIPMAP_NEAREST,[ni]:t.LINEAR_MIPMAP_LINEAR},ae={[aS]:t.NEVER,[fS]:t.ALWAYS,[lS]:t.LESS,[Cv]:t.LEQUAL,[cS]:t.EQUAL,[hS]:t.GEQUAL,[uS]:t.GREATER,[dS]:t.NOTEQUAL};function ye(E,S){if(S.type===ii&&e.has("OES_texture_float_linear")===!1&&(S.magFilter===yn||S.magFilter===Kc||S.magFilter===Ia||S.magFilter===ni||S.minFilter===yn||S.minFilter===Kc||S.minFilter===Ia||S.minFilter===ni)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),t.texParameteri(E,t.TEXTURE_WRAP_S,K[S.wrapS]),t.texParameteri(E,t.TEXTURE_WRAP_T,K[S.wrapT]),(E===t.TEXTURE_3D||E===t.TEXTURE_2D_ARRAY)&&t.texParameteri(E,t.TEXTURE_WRAP_R,K[S.wrapR]),t.texParameteri(E,t.TEXTURE_MAG_FILTER,q[S.magFilter]),t.texParameteri(E,t.TEXTURE_MIN_FILTER,q[S.minFilter]),S.compareFunction&&(t.texParameteri(E,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(E,t.TEXTURE_COMPARE_FUNC,ae[S.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===Mn||S.minFilter!==Ia&&S.minFilter!==ni||S.type===ii&&e.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||i.get(S).__currentAnisotropy){const O=e.get("EXT_texture_filter_anisotropic");t.texParameterf(E,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,r.getMaxAnisotropy())),i.get(S).__currentAnisotropy=S.anisotropy}}}function Ve(E,S){let O=!1;E.__webglInit===void 0&&(E.__webglInit=!0,S.addEventListener("dispose",C));const $=S.source;let Q=f.get($);Q===void 0&&(Q={},f.set($,Q));const Y=G(S);if(Y!==E.__cacheKey){Q[Y]===void 0&&(Q[Y]={texture:t.createTexture(),usedTimes:0},o.memory.textures++,O=!0),Q[Y].usedTimes++;const we=Q[E.__cacheKey];we!==void 0&&(Q[E.__cacheKey].usedTimes--,we.usedTimes===0&&w(S)),E.__cacheKey=Y,E.__webglTexture=Q[Y].texture}return O}function j(E,S,O){let $=t.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&($=t.TEXTURE_2D_ARRAY),S.isData3DTexture&&($=t.TEXTURE_3D);const Q=Ve(E,S),Y=S.source;n.bindTexture($,E.__webglTexture,t.TEXTURE0+O);const we=i.get(Y);if(Y.version!==we.__version||Q===!0){n.activeTexture(t.TEXTURE0+O);const de=Ye.getPrimaries(Ye.workingColorSpace),ve=S.colorSpace===Pn?null:Ye.getPrimaries(S.colorSpace),Ke=S.colorSpace===Pn||de===ve?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,S.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,S.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ke);let re=v(S.image,!1,r.maxTextureSize);re=st(S,re);const xe=s.convert(S.format,S.colorSpace),Le=s.convert(S.type);let Ie=x(S.internalFormat,xe,Le,S.colorSpace,S.isVideoTexture);ye($,S);let _e;const Xe=S.mipmaps,Be=S.isVideoTexture!==!0,at=we.__version===void 0||Q===!0,N=Y.dataReady,ue=R(S,re);if(S.isDepthTexture)Ie=y(S.format===Ws,S.type),at&&(Be?n.texStorage2D(t.TEXTURE_2D,1,Ie,re.width,re.height):n.texImage2D(t.TEXTURE_2D,0,Ie,re.width,re.height,0,xe,Le,null));else if(S.isDataTexture)if(Xe.length>0){Be&&at&&n.texStorage2D(t.TEXTURE_2D,ue,Ie,Xe[0].width,Xe[0].height);for(let X=0,Z=Xe.length;X<Z;X++)_e=Xe[X],Be?N&&n.texSubImage2D(t.TEXTURE_2D,X,0,0,_e.width,_e.height,xe,Le,_e.data):n.texImage2D(t.TEXTURE_2D,X,Ie,_e.width,_e.height,0,xe,Le,_e.data);S.generateMipmaps=!1}else Be?(at&&n.texStorage2D(t.TEXTURE_2D,ue,Ie,re.width,re.height),N&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,re.width,re.height,xe,Le,re.data)):n.texImage2D(t.TEXTURE_2D,0,Ie,re.width,re.height,0,xe,Le,re.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){Be&&at&&n.texStorage3D(t.TEXTURE_2D_ARRAY,ue,Ie,Xe[0].width,Xe[0].height,re.depth);for(let X=0,Z=Xe.length;X<Z;X++)if(_e=Xe[X],S.format!==Xn)if(xe!==null)if(Be){if(N)if(S.layerUpdates.size>0){const pe=Um(_e.width,_e.height,S.format,S.type);for(const he of S.layerUpdates){const Fe=_e.data.subarray(he*pe/_e.data.BYTES_PER_ELEMENT,(he+1)*pe/_e.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,X,0,0,he,_e.width,_e.height,1,xe,Fe)}S.clearLayerUpdates()}else n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,X,0,0,0,_e.width,_e.height,re.depth,xe,_e.data)}else n.compressedTexImage3D(t.TEXTURE_2D_ARRAY,X,Ie,_e.width,_e.height,re.depth,0,_e.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Be?N&&n.texSubImage3D(t.TEXTURE_2D_ARRAY,X,0,0,0,_e.width,_e.height,re.depth,xe,Le,_e.data):n.texImage3D(t.TEXTURE_2D_ARRAY,X,Ie,_e.width,_e.height,re.depth,0,xe,Le,_e.data)}else{Be&&at&&n.texStorage2D(t.TEXTURE_2D,ue,Ie,Xe[0].width,Xe[0].height);for(let X=0,Z=Xe.length;X<Z;X++)_e=Xe[X],S.format!==Xn?xe!==null?Be?N&&n.compressedTexSubImage2D(t.TEXTURE_2D,X,0,0,_e.width,_e.height,xe,_e.data):n.compressedTexImage2D(t.TEXTURE_2D,X,Ie,_e.width,_e.height,0,_e.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Be?N&&n.texSubImage2D(t.TEXTURE_2D,X,0,0,_e.width,_e.height,xe,Le,_e.data):n.texImage2D(t.TEXTURE_2D,X,Ie,_e.width,_e.height,0,xe,Le,_e.data)}else if(S.isDataArrayTexture)if(Be){if(at&&n.texStorage3D(t.TEXTURE_2D_ARRAY,ue,Ie,re.width,re.height,re.depth),N)if(S.layerUpdates.size>0){const X=Um(re.width,re.height,S.format,S.type);for(const Z of S.layerUpdates){const pe=re.data.subarray(Z*X/re.data.BYTES_PER_ELEMENT,(Z+1)*X/re.data.BYTES_PER_ELEMENT);n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,Z,re.width,re.height,1,xe,Le,pe)}S.clearLayerUpdates()}else n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,0,re.width,re.height,re.depth,xe,Le,re.data)}else n.texImage3D(t.TEXTURE_2D_ARRAY,0,Ie,re.width,re.height,re.depth,0,xe,Le,re.data);else if(S.isData3DTexture)Be?(at&&n.texStorage3D(t.TEXTURE_3D,ue,Ie,re.width,re.height,re.depth),N&&n.texSubImage3D(t.TEXTURE_3D,0,0,0,0,re.width,re.height,re.depth,xe,Le,re.data)):n.texImage3D(t.TEXTURE_3D,0,Ie,re.width,re.height,re.depth,0,xe,Le,re.data);else if(S.isFramebufferTexture){if(at)if(Be)n.texStorage2D(t.TEXTURE_2D,ue,Ie,re.width,re.height);else{let X=re.width,Z=re.height;for(let pe=0;pe<ue;pe++)n.texImage2D(t.TEXTURE_2D,pe,Ie,X,Z,0,xe,Le,null),X>>=1,Z>>=1}}else if(Xe.length>0){if(Be&&at){const X=Ce(Xe[0]);n.texStorage2D(t.TEXTURE_2D,ue,Ie,X.width,X.height)}for(let X=0,Z=Xe.length;X<Z;X++)_e=Xe[X],Be?N&&n.texSubImage2D(t.TEXTURE_2D,X,0,0,xe,Le,_e):n.texImage2D(t.TEXTURE_2D,X,Ie,xe,Le,_e);S.generateMipmaps=!1}else if(Be){if(at){const X=Ce(re);n.texStorage2D(t.TEXTURE_2D,ue,Ie,X.width,X.height)}N&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,xe,Le,re)}else n.texImage2D(t.TEXTURE_2D,0,Ie,xe,Le,re);m(S)&&d($),we.__version=Y.version,S.onUpdate&&S.onUpdate(S)}E.__version=S.version}function ne(E,S,O){if(S.image.length!==6)return;const $=Ve(E,S),Q=S.source;n.bindTexture(t.TEXTURE_CUBE_MAP,E.__webglTexture,t.TEXTURE0+O);const Y=i.get(Q);if(Q.version!==Y.__version||$===!0){n.activeTexture(t.TEXTURE0+O);const we=Ye.getPrimaries(Ye.workingColorSpace),de=S.colorSpace===Pn?null:Ye.getPrimaries(S.colorSpace),ve=S.colorSpace===Pn||we===de?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,S.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,S.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,ve);const Ke=S.isCompressedTexture||S.image[0].isCompressedTexture,re=S.image[0]&&S.image[0].isDataTexture,xe=[];for(let Z=0;Z<6;Z++)!Ke&&!re?xe[Z]=v(S.image[Z],!0,r.maxCubemapSize):xe[Z]=re?S.image[Z].image:S.image[Z],xe[Z]=st(S,xe[Z]);const Le=xe[0],Ie=s.convert(S.format,S.colorSpace),_e=s.convert(S.type),Xe=x(S.internalFormat,Ie,_e,S.colorSpace),Be=S.isVideoTexture!==!0,at=Y.__version===void 0||$===!0,N=Q.dataReady;let ue=R(S,Le);ye(t.TEXTURE_CUBE_MAP,S);let X;if(Ke){Be&&at&&n.texStorage2D(t.TEXTURE_CUBE_MAP,ue,Xe,Le.width,Le.height);for(let Z=0;Z<6;Z++){X=xe[Z].mipmaps;for(let pe=0;pe<X.length;pe++){const he=X[pe];S.format!==Xn?Ie!==null?Be?N&&n.compressedTexSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,pe,0,0,he.width,he.height,Ie,he.data):n.compressedTexImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,pe,Xe,he.width,he.height,0,he.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Be?N&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,pe,0,0,he.width,he.height,Ie,_e,he.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,pe,Xe,he.width,he.height,0,Ie,_e,he.data)}}}else{if(X=S.mipmaps,Be&&at){X.length>0&&ue++;const Z=Ce(xe[0]);n.texStorage2D(t.TEXTURE_CUBE_MAP,ue,Xe,Z.width,Z.height)}for(let Z=0;Z<6;Z++)if(re){Be?N&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,0,0,xe[Z].width,xe[Z].height,Ie,_e,xe[Z].data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,Xe,xe[Z].width,xe[Z].height,0,Ie,_e,xe[Z].data);for(let pe=0;pe<X.length;pe++){const Fe=X[pe].image[Z].image;Be?N&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,pe+1,0,0,Fe.width,Fe.height,Ie,_e,Fe.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,pe+1,Xe,Fe.width,Fe.height,0,Ie,_e,Fe.data)}}else{Be?N&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,0,0,Ie,_e,xe[Z]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,Xe,Ie,_e,xe[Z]);for(let pe=0;pe<X.length;pe++){const he=X[pe];Be?N&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,pe+1,0,0,Ie,_e,he.image[Z]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,pe+1,Xe,Ie,_e,he.image[Z])}}}m(S)&&d(t.TEXTURE_CUBE_MAP),Y.__version=Q.version,S.onUpdate&&S.onUpdate(S)}E.__version=S.version}function ce(E,S,O,$,Q,Y){const we=s.convert(O.format,O.colorSpace),de=s.convert(O.type),ve=x(O.internalFormat,we,de,O.colorSpace),Ke=i.get(S),re=i.get(O);if(re.__renderTarget=S,!Ke.__hasExternalTextures){const xe=Math.max(1,S.width>>Y),Le=Math.max(1,S.height>>Y);Q===t.TEXTURE_3D||Q===t.TEXTURE_2D_ARRAY?n.texImage3D(Q,Y,ve,xe,Le,S.depth,0,we,de,null):n.texImage2D(Q,Y,ve,xe,Le,0,we,de,null)}n.bindFramebuffer(t.FRAMEBUFFER,E),We(S)?a.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,$,Q,re.__webglTexture,0,He(S)):(Q===t.TEXTURE_2D||Q>=t.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=t.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&t.framebufferTexture2D(t.FRAMEBUFFER,$,Q,re.__webglTexture,Y),n.bindFramebuffer(t.FRAMEBUFFER,null)}function oe(E,S,O){if(t.bindRenderbuffer(t.RENDERBUFFER,E),S.depthBuffer){const $=S.depthTexture,Q=$&&$.isDepthTexture?$.type:null,Y=y(S.stencilBuffer,Q),we=S.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,de=He(S);We(S)?a.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,de,Y,S.width,S.height):O?t.renderbufferStorageMultisample(t.RENDERBUFFER,de,Y,S.width,S.height):t.renderbufferStorage(t.RENDERBUFFER,Y,S.width,S.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,we,t.RENDERBUFFER,E)}else{const $=S.textures;for(let Q=0;Q<$.length;Q++){const Y=$[Q],we=s.convert(Y.format,Y.colorSpace),de=s.convert(Y.type),ve=x(Y.internalFormat,we,de,Y.colorSpace),Ke=He(S);O&&We(S)===!1?t.renderbufferStorageMultisample(t.RENDERBUFFER,Ke,ve,S.width,S.height):We(S)?a.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,Ke,ve,S.width,S.height):t.renderbufferStorage(t.RENDERBUFFER,ve,S.width,S.height)}}t.bindRenderbuffer(t.RENDERBUFFER,null)}function Pe(E,S){if(S&&S.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(n.bindFramebuffer(t.FRAMEBUFFER,E),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const $=i.get(S.depthTexture);$.__renderTarget=S,(!$.__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),J(S.depthTexture,0);const Q=$.__webglTexture,Y=He(S);if(S.depthTexture.format===Ds)We(S)?a.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,Q,0,Y):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,Q,0);else if(S.depthTexture.format===Ws)We(S)?a.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,Q,0,Y):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,Q,0);else throw new Error("Unknown depthTexture format")}function Ae(E){const S=i.get(E),O=E.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==E.depthTexture){const $=E.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),$){const Q=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,$.removeEventListener("dispose",Q)};$.addEventListener("dispose",Q),S.__depthDisposeCallback=Q}S.__boundDepthTexture=$}if(E.depthTexture&&!S.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");Pe(S.__webglFramebuffer,E)}else if(O){S.__webglDepthbuffer=[];for(let $=0;$<6;$++)if(n.bindFramebuffer(t.FRAMEBUFFER,S.__webglFramebuffer[$]),S.__webglDepthbuffer[$]===void 0)S.__webglDepthbuffer[$]=t.createRenderbuffer(),oe(S.__webglDepthbuffer[$],E,!1);else{const Q=E.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,Y=S.__webglDepthbuffer[$];t.bindRenderbuffer(t.RENDERBUFFER,Y),t.framebufferRenderbuffer(t.FRAMEBUFFER,Q,t.RENDERBUFFER,Y)}}else if(n.bindFramebuffer(t.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=t.createRenderbuffer(),oe(S.__webglDepthbuffer,E,!1);else{const $=E.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,Q=S.__webglDepthbuffer;t.bindRenderbuffer(t.RENDERBUFFER,Q),t.framebufferRenderbuffer(t.FRAMEBUFFER,$,t.RENDERBUFFER,Q)}n.bindFramebuffer(t.FRAMEBUFFER,null)}function be(E,S,O){const $=i.get(E);S!==void 0&&ce($.__webglFramebuffer,E,E.texture,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,0),O!==void 0&&Ae(E)}function ot(E){const S=E.texture,O=i.get(E),$=i.get(S);E.addEventListener("dispose",A);const Q=E.textures,Y=E.isWebGLCubeRenderTarget===!0,we=Q.length>1;if(we||($.__webglTexture===void 0&&($.__webglTexture=t.createTexture()),$.__version=S.version,o.memory.textures++),Y){O.__webglFramebuffer=[];for(let de=0;de<6;de++)if(S.mipmaps&&S.mipmaps.length>0){O.__webglFramebuffer[de]=[];for(let ve=0;ve<S.mipmaps.length;ve++)O.__webglFramebuffer[de][ve]=t.createFramebuffer()}else O.__webglFramebuffer[de]=t.createFramebuffer()}else{if(S.mipmaps&&S.mipmaps.length>0){O.__webglFramebuffer=[];for(let de=0;de<S.mipmaps.length;de++)O.__webglFramebuffer[de]=t.createFramebuffer()}else O.__webglFramebuffer=t.createFramebuffer();if(we)for(let de=0,ve=Q.length;de<ve;de++){const Ke=i.get(Q[de]);Ke.__webglTexture===void 0&&(Ke.__webglTexture=t.createTexture(),o.memory.textures++)}if(E.samples>0&&We(E)===!1){O.__webglMultisampledFramebuffer=t.createFramebuffer(),O.__webglColorRenderbuffer=[],n.bindFramebuffer(t.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let de=0;de<Q.length;de++){const ve=Q[de];O.__webglColorRenderbuffer[de]=t.createRenderbuffer(),t.bindRenderbuffer(t.RENDERBUFFER,O.__webglColorRenderbuffer[de]);const Ke=s.convert(ve.format,ve.colorSpace),re=s.convert(ve.type),xe=x(ve.internalFormat,Ke,re,ve.colorSpace,E.isXRRenderTarget===!0),Le=He(E);t.renderbufferStorageMultisample(t.RENDERBUFFER,Le,xe,E.width,E.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+de,t.RENDERBUFFER,O.__webglColorRenderbuffer[de])}t.bindRenderbuffer(t.RENDERBUFFER,null),E.depthBuffer&&(O.__webglDepthRenderbuffer=t.createRenderbuffer(),oe(O.__webglDepthRenderbuffer,E,!0)),n.bindFramebuffer(t.FRAMEBUFFER,null)}}if(Y){n.bindTexture(t.TEXTURE_CUBE_MAP,$.__webglTexture),ye(t.TEXTURE_CUBE_MAP,S);for(let de=0;de<6;de++)if(S.mipmaps&&S.mipmaps.length>0)for(let ve=0;ve<S.mipmaps.length;ve++)ce(O.__webglFramebuffer[de][ve],E,S,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+de,ve);else ce(O.__webglFramebuffer[de],E,S,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+de,0);m(S)&&d(t.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(we){for(let de=0,ve=Q.length;de<ve;de++){const Ke=Q[de],re=i.get(Ke);n.bindTexture(t.TEXTURE_2D,re.__webglTexture),ye(t.TEXTURE_2D,Ke),ce(O.__webglFramebuffer,E,Ke,t.COLOR_ATTACHMENT0+de,t.TEXTURE_2D,0),m(Ke)&&d(t.TEXTURE_2D)}n.unbindTexture()}else{let de=t.TEXTURE_2D;if((E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&(de=E.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(de,$.__webglTexture),ye(de,S),S.mipmaps&&S.mipmaps.length>0)for(let ve=0;ve<S.mipmaps.length;ve++)ce(O.__webglFramebuffer[ve],E,S,t.COLOR_ATTACHMENT0,de,ve);else ce(O.__webglFramebuffer,E,S,t.COLOR_ATTACHMENT0,de,0);m(S)&&d(de),n.unbindTexture()}E.depthBuffer&&Ae(E)}function De(E){const S=E.textures;for(let O=0,$=S.length;O<$;O++){const Q=S[O];if(m(Q)){const Y=g(E),we=i.get(Q).__webglTexture;n.bindTexture(Y,we),d(Y),n.unbindTexture()}}}const mt=[],U=[];function Qt(E){if(E.samples>0){if(We(E)===!1){const S=E.textures,O=E.width,$=E.height;let Q=t.COLOR_BUFFER_BIT;const Y=E.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,we=i.get(E),de=S.length>1;if(de)for(let ve=0;ve<S.length;ve++)n.bindFramebuffer(t.FRAMEBUFFER,we.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+ve,t.RENDERBUFFER,null),n.bindFramebuffer(t.FRAMEBUFFER,we.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+ve,t.TEXTURE_2D,null,0);n.bindFramebuffer(t.READ_FRAMEBUFFER,we.__webglMultisampledFramebuffer),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,we.__webglFramebuffer);for(let ve=0;ve<S.length;ve++){if(E.resolveDepthBuffer&&(E.depthBuffer&&(Q|=t.DEPTH_BUFFER_BIT),E.stencilBuffer&&E.resolveStencilBuffer&&(Q|=t.STENCIL_BUFFER_BIT)),de){t.framebufferRenderbuffer(t.READ_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.RENDERBUFFER,we.__webglColorRenderbuffer[ve]);const Ke=i.get(S[ve]).__webglTexture;t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,Ke,0)}t.blitFramebuffer(0,0,O,$,0,0,O,$,Q,t.NEAREST),l===!0&&(mt.length=0,U.length=0,mt.push(t.COLOR_ATTACHMENT0+ve),E.depthBuffer&&E.resolveDepthBuffer===!1&&(mt.push(Y),U.push(Y),t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,U)),t.invalidateFramebuffer(t.READ_FRAMEBUFFER,mt))}if(n.bindFramebuffer(t.READ_FRAMEBUFFER,null),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),de)for(let ve=0;ve<S.length;ve++){n.bindFramebuffer(t.FRAMEBUFFER,we.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+ve,t.RENDERBUFFER,we.__webglColorRenderbuffer[ve]);const Ke=i.get(S[ve]).__webglTexture;n.bindFramebuffer(t.FRAMEBUFFER,we.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+ve,t.TEXTURE_2D,Ke,0)}n.bindFramebuffer(t.DRAW_FRAMEBUFFER,we.__webglMultisampledFramebuffer)}else if(E.depthBuffer&&E.resolveDepthBuffer===!1&&l){const S=E.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,[S])}}}function He(E){return Math.min(r.maxSamples,E.samples)}function We(E){const S=i.get(E);return E.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function Re(E){const S=o.render.frame;u.get(E)!==S&&(u.set(E,S),E.update())}function st(E,S){const O=E.colorSpace,$=E.format,Q=E.type;return E.isCompressedTexture===!0||E.isVideoTexture===!0||O!==$s&&O!==Pn&&(Ye.getTransfer(O)===it?($!==Xn||Q!==bi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",O)),S}function Ce(E){return typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement?(c.width=E.naturalWidth||E.width,c.height=E.naturalHeight||E.height):typeof VideoFrame<"u"&&E instanceof VideoFrame?(c.width=E.displayWidth,c.height=E.displayHeight):(c.width=E.width,c.height=E.height),c}this.allocateTextureUnit=B,this.resetTextureUnits=V,this.setTexture2D=J,this.setTexture2DArray=W,this.setTexture3D=ee,this.setTextureCube=L,this.rebindTextures=be,this.setupRenderTarget=ot,this.updateRenderTargetMipmap=De,this.updateMultisampleRenderTarget=Qt,this.setupDepthRenderbuffer=Ae,this.setupFrameBufferTexture=ce,this.useMultisampledRTT=We}function NT(t,e){function n(i,r=Pn){let s;const o=Ye.getTransfer(r);if(i===bi)return t.UNSIGNED_BYTE;if(i===af)return t.UNSIGNED_SHORT_4_4_4_4;if(i===lf)return t.UNSIGNED_SHORT_5_5_5_1;if(i===_v)return t.UNSIGNED_INT_5_9_9_9_REV;if(i===vv)return t.BYTE;if(i===xv)return t.SHORT;if(i===ta)return t.UNSIGNED_SHORT;if(i===of)return t.INT;if(i===Br)return t.UNSIGNED_INT;if(i===ii)return t.FLOAT;if(i===da)return t.HALF_FLOAT;if(i===yv)return t.ALPHA;if(i===Sv)return t.RGB;if(i===Xn)return t.RGBA;if(i===Mv)return t.LUMINANCE;if(i===Ev)return t.LUMINANCE_ALPHA;if(i===Ds)return t.DEPTH_COMPONENT;if(i===Ws)return t.DEPTH_STENCIL;if(i===cf)return t.RED;if(i===uf)return t.RED_INTEGER;if(i===wv)return t.RG;if(i===df)return t.RG_INTEGER;if(i===hf)return t.RGBA_INTEGER;if(i===_l||i===yl||i===Sl||i===Ml)if(o===it)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===_l)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===yl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Sl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Ml)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===_l)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===yl)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Sl)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Ml)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Nd||i===Id||i===Ud||i===Fd)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===Nd)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Id)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Ud)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Fd)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Od||i===kd||i===Bd)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===Od||i===kd)return o===it?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===Bd)return o===it?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===zd||i===Hd||i===Vd||i===Gd||i===Wd||i===jd||i===Xd||i===Kd||i===Yd||i===qd||i===$d||i===Zd||i===Jd||i===Qd)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===zd)return o===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Hd)return o===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Vd)return o===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Gd)return o===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Wd)return o===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===jd)return o===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Xd)return o===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Kd)return o===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Yd)return o===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===qd)return o===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===$d)return o===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Zd)return o===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Jd)return o===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Qd)return o===it?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===El||i===eh||i===th)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===El)return o===it?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===eh)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===th)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Tv||i===nh||i===ih||i===rh)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===El)return s.COMPRESSED_RED_RGTC1_EXT;if(i===nh)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===ih)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===rh)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Gs?t.UNSIGNED_INT_24_8:t[i]!==void 0?t[i]:null}return{convert:n}}class IT extends xn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class ri extends Gt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const UT={type:"move"};class yu{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ri,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ri,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ri,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const n=this._hand;if(n)for(const i of e.hand.values())this._getHandJoint(n,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,n,i){let r=null,s=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(e&&n.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(const v of e.hand.values()){const m=n.getJointPose(v,i),d=this._getHandJoint(c,v);m!==null&&(d.matrix.fromArray(m.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=m.radius),d.visible=m!==null}const u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],f=u.position.distanceTo(h.position),p=.02,_=.005;c.inputState.pinching&&f>p+_?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=p-_&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=n.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(r=n.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(UT)))}return a!==null&&(a.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,n){if(e.joints[n.jointName]===void 0){const i=new ri;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[n.jointName]=i,e.add(i)}return e.joints[n.jointName]}}const FT=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,OT=`
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

}`;class kT{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,n,i){if(this.texture===null){const r=new kt,s=e.properties.get(r);s.__webglTexture=n.texture,(n.depthNear!=i.depthNear||n.depthFar!=i.depthFar)&&(this.depthNear=n.depthNear,this.depthFar=n.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){const n=e.cameras[0].viewport,i=new Lt({vertexShader:FT,fragmentShader:OT,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new Tt(new pa(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class BT extends Zs{constructor(e,n){super();const i=this;let r=null,s=1,o=null,a="local-floor",l=1,c=null,u=null,h=null,f=null,p=null,_=null;const v=new kT,m=n.getContextAttributes();let d=null,g=null;const x=[],y=[],R=new je;let C=null;const A=new xn;A.viewport=new rt;const b=new xn;b.viewport=new rt;const w=[A,b],M=new IT;let P=null,V=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(j){let ne=x[j];return ne===void 0&&(ne=new yu,x[j]=ne),ne.getTargetRaySpace()},this.getControllerGrip=function(j){let ne=x[j];return ne===void 0&&(ne=new yu,x[j]=ne),ne.getGripSpace()},this.getHand=function(j){let ne=x[j];return ne===void 0&&(ne=new yu,x[j]=ne),ne.getHandSpace()};function B(j){const ne=y.indexOf(j.inputSource);if(ne===-1)return;const ce=x[ne];ce!==void 0&&(ce.update(j.inputSource,j.frame,c||o),ce.dispatchEvent({type:j.type,data:j.inputSource}))}function G(){r.removeEventListener("select",B),r.removeEventListener("selectstart",B),r.removeEventListener("selectend",B),r.removeEventListener("squeeze",B),r.removeEventListener("squeezestart",B),r.removeEventListener("squeezeend",B),r.removeEventListener("end",G),r.removeEventListener("inputsourceschange",J);for(let j=0;j<x.length;j++){const ne=y[j];ne!==null&&(y[j]=null,x[j].disconnect(ne))}P=null,V=null,v.reset(),e.setRenderTarget(d),p=null,f=null,h=null,r=null,g=null,Ve.stop(),i.isPresenting=!1,e.setPixelRatio(C),e.setSize(R.width,R.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(j){s=j,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(j){a=j,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(j){c=j},this.getBaseLayer=function(){return f!==null?f:p},this.getBinding=function(){return h},this.getFrame=function(){return _},this.getSession=function(){return r},this.setSession=async function(j){if(r=j,r!==null){if(d=e.getRenderTarget(),r.addEventListener("select",B),r.addEventListener("selectstart",B),r.addEventListener("selectend",B),r.addEventListener("squeeze",B),r.addEventListener("squeezestart",B),r.addEventListener("squeezeend",B),r.addEventListener("end",G),r.addEventListener("inputsourceschange",J),m.xrCompatible!==!0&&await n.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(R),r.renderState.layers===void 0){const ne={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(r,n,ne),r.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),g=new zr(p.framebufferWidth,p.framebufferHeight,{format:Xn,type:bi,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil})}else{let ne=null,ce=null,oe=null;m.depth&&(oe=m.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,ne=m.stencil?Ws:Ds,ce=m.stencil?Gs:Br);const Pe={colorFormat:n.RGBA8,depthFormat:oe,scaleFactor:s};h=new XRWebGLBinding(r,n),f=h.createProjectionLayer(Pe),r.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),g=new zr(f.textureWidth,f.textureHeight,{format:Xn,type:bi,depthTexture:new Bv(f.textureWidth,f.textureHeight,ce,void 0,void 0,void 0,void 0,void 0,void 0,ne),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1})}g.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await r.requestReferenceSpace(a),Ve.setContext(r),Ve.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function J(j){for(let ne=0;ne<j.removed.length;ne++){const ce=j.removed[ne],oe=y.indexOf(ce);oe>=0&&(y[oe]=null,x[oe].disconnect(ce))}for(let ne=0;ne<j.added.length;ne++){const ce=j.added[ne];let oe=y.indexOf(ce);if(oe===-1){for(let Ae=0;Ae<x.length;Ae++)if(Ae>=y.length){y.push(ce),oe=Ae;break}else if(y[Ae]===null){y[Ae]=ce,oe=Ae;break}if(oe===-1)break}const Pe=x[oe];Pe&&Pe.connect(ce)}}const W=new D,ee=new D;function L(j,ne,ce){W.setFromMatrixPosition(ne.matrixWorld),ee.setFromMatrixPosition(ce.matrixWorld);const oe=W.distanceTo(ee),Pe=ne.projectionMatrix.elements,Ae=ce.projectionMatrix.elements,be=Pe[14]/(Pe[10]-1),ot=Pe[14]/(Pe[10]+1),De=(Pe[9]+1)/Pe[5],mt=(Pe[9]-1)/Pe[5],U=(Pe[8]-1)/Pe[0],Qt=(Ae[8]+1)/Ae[0],He=be*U,We=be*Qt,Re=oe/(-U+Qt),st=Re*-U;if(ne.matrixWorld.decompose(j.position,j.quaternion,j.scale),j.translateX(st),j.translateZ(Re),j.matrixWorld.compose(j.position,j.quaternion,j.scale),j.matrixWorldInverse.copy(j.matrixWorld).invert(),Pe[10]===-1)j.projectionMatrix.copy(ne.projectionMatrix),j.projectionMatrixInverse.copy(ne.projectionMatrixInverse);else{const Ce=be+Re,E=ot+Re,S=He-st,O=We+(oe-st),$=De*ot/E*Ce,Q=mt*ot/E*Ce;j.projectionMatrix.makePerspective(S,O,$,Q,Ce,E),j.projectionMatrixInverse.copy(j.projectionMatrix).invert()}}function K(j,ne){ne===null?j.matrixWorld.copy(j.matrix):j.matrixWorld.multiplyMatrices(ne.matrixWorld,j.matrix),j.matrixWorldInverse.copy(j.matrixWorld).invert()}this.updateCamera=function(j){if(r===null)return;let ne=j.near,ce=j.far;v.texture!==null&&(v.depthNear>0&&(ne=v.depthNear),v.depthFar>0&&(ce=v.depthFar)),M.near=b.near=A.near=ne,M.far=b.far=A.far=ce,(P!==M.near||V!==M.far)&&(r.updateRenderState({depthNear:M.near,depthFar:M.far}),P=M.near,V=M.far),A.layers.mask=j.layers.mask|2,b.layers.mask=j.layers.mask|4,M.layers.mask=A.layers.mask|b.layers.mask;const oe=j.parent,Pe=M.cameras;K(M,oe);for(let Ae=0;Ae<Pe.length;Ae++)K(Pe[Ae],oe);Pe.length===2?L(M,A,b):M.projectionMatrix.copy(A.projectionMatrix),q(j,M,oe)};function q(j,ne,ce){ce===null?j.matrix.copy(ne.matrixWorld):(j.matrix.copy(ce.matrixWorld),j.matrix.invert(),j.matrix.multiply(ne.matrixWorld)),j.matrix.decompose(j.position,j.quaternion,j.scale),j.updateMatrixWorld(!0),j.projectionMatrix.copy(ne.projectionMatrix),j.projectionMatrixInverse.copy(ne.projectionMatrixInverse),j.isPerspectiveCamera&&(j.fov=na*2*Math.atan(1/j.projectionMatrix.elements[5]),j.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(f===null&&p===null))return l},this.setFoveation=function(j){l=j,f!==null&&(f.fixedFoveation=j),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=j)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(M)};let ae=null;function ye(j,ne){if(u=ne.getViewerPose(c||o),_=ne,u!==null){const ce=u.views;p!==null&&(e.setRenderTargetFramebuffer(g,p.framebuffer),e.setRenderTarget(g));let oe=!1;ce.length!==M.cameras.length&&(M.cameras.length=0,oe=!0);for(let Ae=0;Ae<ce.length;Ae++){const be=ce[Ae];let ot=null;if(p!==null)ot=p.getViewport(be);else{const mt=h.getViewSubImage(f,be);ot=mt.viewport,Ae===0&&(e.setRenderTargetTextures(g,mt.colorTexture,f.ignoreDepthValues?void 0:mt.depthStencilTexture),e.setRenderTarget(g))}let De=w[Ae];De===void 0&&(De=new xn,De.layers.enable(Ae),De.viewport=new rt,w[Ae]=De),De.matrix.fromArray(be.transform.matrix),De.matrix.decompose(De.position,De.quaternion,De.scale),De.projectionMatrix.fromArray(be.projectionMatrix),De.projectionMatrixInverse.copy(De.projectionMatrix).invert(),De.viewport.set(ot.x,ot.y,ot.width,ot.height),Ae===0&&(M.matrix.copy(De.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),oe===!0&&M.cameras.push(De)}const Pe=r.enabledFeatures;if(Pe&&Pe.includes("depth-sensing")){const Ae=h.getDepthInformation(ce[0]);Ae&&Ae.isValid&&Ae.texture&&v.init(e,Ae,r.renderState)}}for(let ce=0;ce<x.length;ce++){const oe=y[ce],Pe=x[ce];oe!==null&&Pe!==void 0&&Pe.update(oe,ne,c||o)}ae&&ae(j,ne),ne.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ne}),_=null}const Ve=new kv;Ve.setAnimationLoop(ye),this.setAnimationLoop=function(j){ae=j},this.dispose=function(){}}}const vr=new ai,zT=new nt;function HT(t,e){function n(m,d){m.matrixAutoUpdate===!0&&m.updateMatrix(),d.value.copy(m.matrix)}function i(m,d){d.color.getRGB(m.fogColor.value,Uv(t)),d.isFog?(m.fogNear.value=d.near,m.fogFar.value=d.far):d.isFogExp2&&(m.fogDensity.value=d.density)}function r(m,d,g,x,y){d.isMeshBasicMaterial||d.isMeshLambertMaterial?s(m,d):d.isMeshToonMaterial?(s(m,d),h(m,d)):d.isMeshPhongMaterial?(s(m,d),u(m,d)):d.isMeshStandardMaterial?(s(m,d),f(m,d),d.isMeshPhysicalMaterial&&p(m,d,y)):d.isMeshMatcapMaterial?(s(m,d),_(m,d)):d.isMeshDepthMaterial?s(m,d):d.isMeshDistanceMaterial?(s(m,d),v(m,d)):d.isMeshNormalMaterial?s(m,d):d.isLineBasicMaterial?(o(m,d),d.isLineDashedMaterial&&a(m,d)):d.isPointsMaterial?l(m,d,g,x):d.isSpriteMaterial?c(m,d):d.isShadowMaterial?(m.color.value.copy(d.color),m.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function s(m,d){m.opacity.value=d.opacity,d.color&&m.diffuse.value.copy(d.color),d.emissive&&m.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(m.map.value=d.map,n(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,n(d.alphaMap,m.alphaMapTransform)),d.bumpMap&&(m.bumpMap.value=d.bumpMap,n(d.bumpMap,m.bumpMapTransform),m.bumpScale.value=d.bumpScale,d.side===Vt&&(m.bumpScale.value*=-1)),d.normalMap&&(m.normalMap.value=d.normalMap,n(d.normalMap,m.normalMapTransform),m.normalScale.value.copy(d.normalScale),d.side===Vt&&m.normalScale.value.negate()),d.displacementMap&&(m.displacementMap.value=d.displacementMap,n(d.displacementMap,m.displacementMapTransform),m.displacementScale.value=d.displacementScale,m.displacementBias.value=d.displacementBias),d.emissiveMap&&(m.emissiveMap.value=d.emissiveMap,n(d.emissiveMap,m.emissiveMapTransform)),d.specularMap&&(m.specularMap.value=d.specularMap,n(d.specularMap,m.specularMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest);const g=e.get(d),x=g.envMap,y=g.envMapRotation;x&&(m.envMap.value=x,vr.copy(y),vr.x*=-1,vr.y*=-1,vr.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(vr.y*=-1,vr.z*=-1),m.envMapRotation.value.setFromMatrix4(zT.makeRotationFromEuler(vr)),m.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=d.reflectivity,m.ior.value=d.ior,m.refractionRatio.value=d.refractionRatio),d.lightMap&&(m.lightMap.value=d.lightMap,m.lightMapIntensity.value=d.lightMapIntensity,n(d.lightMap,m.lightMapTransform)),d.aoMap&&(m.aoMap.value=d.aoMap,m.aoMapIntensity.value=d.aoMapIntensity,n(d.aoMap,m.aoMapTransform))}function o(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,d.map&&(m.map.value=d.map,n(d.map,m.mapTransform))}function a(m,d){m.dashSize.value=d.dashSize,m.totalSize.value=d.dashSize+d.gapSize,m.scale.value=d.scale}function l(m,d,g,x){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.size.value=d.size*g,m.scale.value=x*.5,d.map&&(m.map.value=d.map,n(d.map,m.uvTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,n(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function c(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.rotation.value=d.rotation,d.map&&(m.map.value=d.map,n(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,n(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function u(m,d){m.specular.value.copy(d.specular),m.shininess.value=Math.max(d.shininess,1e-4)}function h(m,d){d.gradientMap&&(m.gradientMap.value=d.gradientMap)}function f(m,d){m.metalness.value=d.metalness,d.metalnessMap&&(m.metalnessMap.value=d.metalnessMap,n(d.metalnessMap,m.metalnessMapTransform)),m.roughness.value=d.roughness,d.roughnessMap&&(m.roughnessMap.value=d.roughnessMap,n(d.roughnessMap,m.roughnessMapTransform)),d.envMap&&(m.envMapIntensity.value=d.envMapIntensity)}function p(m,d,g){m.ior.value=d.ior,d.sheen>0&&(m.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),m.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(m.sheenColorMap.value=d.sheenColorMap,n(d.sheenColorMap,m.sheenColorMapTransform)),d.sheenRoughnessMap&&(m.sheenRoughnessMap.value=d.sheenRoughnessMap,n(d.sheenRoughnessMap,m.sheenRoughnessMapTransform))),d.clearcoat>0&&(m.clearcoat.value=d.clearcoat,m.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(m.clearcoatMap.value=d.clearcoatMap,n(d.clearcoatMap,m.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,n(d.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(m.clearcoatNormalMap.value=d.clearcoatNormalMap,n(d.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===Vt&&m.clearcoatNormalScale.value.negate())),d.dispersion>0&&(m.dispersion.value=d.dispersion),d.iridescence>0&&(m.iridescence.value=d.iridescence,m.iridescenceIOR.value=d.iridescenceIOR,m.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(m.iridescenceMap.value=d.iridescenceMap,n(d.iridescenceMap,m.iridescenceMapTransform)),d.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=d.iridescenceThicknessMap,n(d.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),d.transmission>0&&(m.transmission.value=d.transmission,m.transmissionSamplerMap.value=g.texture,m.transmissionSamplerSize.value.set(g.width,g.height),d.transmissionMap&&(m.transmissionMap.value=d.transmissionMap,n(d.transmissionMap,m.transmissionMapTransform)),m.thickness.value=d.thickness,d.thicknessMap&&(m.thicknessMap.value=d.thicknessMap,n(d.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=d.attenuationDistance,m.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(m.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(m.anisotropyMap.value=d.anisotropyMap,n(d.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=d.specularIntensity,m.specularColor.value.copy(d.specularColor),d.specularColorMap&&(m.specularColorMap.value=d.specularColorMap,n(d.specularColorMap,m.specularColorMapTransform)),d.specularIntensityMap&&(m.specularIntensityMap.value=d.specularIntensityMap,n(d.specularIntensityMap,m.specularIntensityMapTransform))}function _(m,d){d.matcap&&(m.matcap.value=d.matcap)}function v(m,d){const g=e.get(d).light;m.referencePosition.value.setFromMatrixPosition(g.matrixWorld),m.nearDistance.value=g.shadow.camera.near,m.farDistance.value=g.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function VT(t,e,n,i){let r={},s={},o=[];const a=t.getParameter(t.MAX_UNIFORM_BUFFER_BINDINGS);function l(g,x){const y=x.program;i.uniformBlockBinding(g,y)}function c(g,x){let y=r[g.id];y===void 0&&(_(g),y=u(g),r[g.id]=y,g.addEventListener("dispose",m));const R=x.program;i.updateUBOMapping(g,R);const C=e.render.frame;s[g.id]!==C&&(f(g),s[g.id]=C)}function u(g){const x=h();g.__bindingPointIndex=x;const y=t.createBuffer(),R=g.__size,C=g.usage;return t.bindBuffer(t.UNIFORM_BUFFER,y),t.bufferData(t.UNIFORM_BUFFER,R,C),t.bindBuffer(t.UNIFORM_BUFFER,null),t.bindBufferBase(t.UNIFORM_BUFFER,x,y),y}function h(){for(let g=0;g<a;g++)if(o.indexOf(g)===-1)return o.push(g),g;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(g){const x=r[g.id],y=g.uniforms,R=g.__cache;t.bindBuffer(t.UNIFORM_BUFFER,x);for(let C=0,A=y.length;C<A;C++){const b=Array.isArray(y[C])?y[C]:[y[C]];for(let w=0,M=b.length;w<M;w++){const P=b[w];if(p(P,C,w,R)===!0){const V=P.__offset,B=Array.isArray(P.value)?P.value:[P.value];let G=0;for(let J=0;J<B.length;J++){const W=B[J],ee=v(W);typeof W=="number"||typeof W=="boolean"?(P.__data[0]=W,t.bufferSubData(t.UNIFORM_BUFFER,V+G,P.__data)):W.isMatrix3?(P.__data[0]=W.elements[0],P.__data[1]=W.elements[1],P.__data[2]=W.elements[2],P.__data[3]=0,P.__data[4]=W.elements[3],P.__data[5]=W.elements[4],P.__data[6]=W.elements[5],P.__data[7]=0,P.__data[8]=W.elements[6],P.__data[9]=W.elements[7],P.__data[10]=W.elements[8],P.__data[11]=0):(W.toArray(P.__data,G),G+=ee.storage/Float32Array.BYTES_PER_ELEMENT)}t.bufferSubData(t.UNIFORM_BUFFER,V,P.__data)}}}t.bindBuffer(t.UNIFORM_BUFFER,null)}function p(g,x,y,R){const C=g.value,A=x+"_"+y;if(R[A]===void 0)return typeof C=="number"||typeof C=="boolean"?R[A]=C:R[A]=C.clone(),!0;{const b=R[A];if(typeof C=="number"||typeof C=="boolean"){if(b!==C)return R[A]=C,!0}else if(b.equals(C)===!1)return b.copy(C),!0}return!1}function _(g){const x=g.uniforms;let y=0;const R=16;for(let A=0,b=x.length;A<b;A++){const w=Array.isArray(x[A])?x[A]:[x[A]];for(let M=0,P=w.length;M<P;M++){const V=w[M],B=Array.isArray(V.value)?V.value:[V.value];for(let G=0,J=B.length;G<J;G++){const W=B[G],ee=v(W),L=y%R,K=L%ee.boundary,q=L+K;y+=K,q!==0&&R-q<ee.storage&&(y+=R-q),V.__data=new Float32Array(ee.storage/Float32Array.BYTES_PER_ELEMENT),V.__offset=y,y+=ee.storage}}}const C=y%R;return C>0&&(y+=R-C),g.__size=y,g.__cache={},this}function v(g){const x={boundary:0,storage:0};return typeof g=="number"||typeof g=="boolean"?(x.boundary=4,x.storage=4):g.isVector2?(x.boundary=8,x.storage=8):g.isVector3||g.isColor?(x.boundary=16,x.storage=12):g.isVector4?(x.boundary=16,x.storage=16):g.isMatrix3?(x.boundary=48,x.storage=48):g.isMatrix4?(x.boundary=64,x.storage=64):g.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",g),x}function m(g){const x=g.target;x.removeEventListener("dispose",m);const y=o.indexOf(x.__bindingPointIndex);o.splice(y,1),t.deleteBuffer(r[x.id]),delete r[x.id],delete s[x.id]}function d(){for(const g in r)t.deleteBuffer(r[g]);o=[],r={},s={}}return{bind:l,update:c,dispose:d}}class GT{constructor(e={}){const{canvas:n=PS(),context:i=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reverseDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=o;const _=new Uint32Array(4),v=new Int32Array(4);let m=null,d=null;const g=[],x=[];this.domElement=n,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=zt,this.toneMapping=ir,this.toneMappingExposure=1;const y=this;let R=!1,C=0,A=0,b=null,w=-1,M=null;const P=new rt,V=new rt;let B=null;const G=new ge(0);let J=0,W=n.width,ee=n.height,L=1,K=null,q=null;const ae=new rt(0,0,W,ee),ye=new rt(0,0,W,ee);let Ve=!1;const j=new mf;let ne=!1,ce=!1;const oe=new nt,Pe=new nt,Ae=new D,be=new rt,ot={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let De=!1;function mt(){return b===null?L:1}let U=i;function Qt(T,I){return n.getContext(T,I)}try{const T={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${sf}`),n.addEventListener("webglcontextlost",Z,!1),n.addEventListener("webglcontextrestored",pe,!1),n.addEventListener("webglcontextcreationerror",he,!1),U===null){const I="webgl2";if(U=Qt(I,T),U===null)throw Qt(I)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(T){throw console.error("THREE.WebGLRenderer: "+T.message),T}let He,We,Re,st,Ce,E,S,O,$,Q,Y,we,de,ve,Ke,re,xe,Le,Ie,_e,Xe,Be,at,N;function ue(){He=new YE(U),He.init(),Be=new NT(U,He),We=new HE(U,He,e,Be),Re=new PT(U,He),We.reverseDepthBuffer&&f&&Re.buffers.depth.setReversed(!0),st=new ZE(U),Ce=new mT,E=new LT(U,He,Re,Ce,We,Be,st),S=new GE(y),O=new KE(y),$=new iM(U),at=new BE(U,$),Q=new qE(U,$,st,at),Y=new QE(U,Q,$,st),Ie=new JE(U,We,E),re=new VE(Ce),we=new pT(y,S,O,He,We,at,re),de=new HT(y,Ce),ve=new vT,Ke=new ET(He),Le=new kE(y,S,O,Re,Y,p,l),xe=new bT(y,Y,We),N=new VT(U,st,We,Re),_e=new zE(U,He,st),Xe=new $E(U,He,st),st.programs=we.programs,y.capabilities=We,y.extensions=He,y.properties=Ce,y.renderLists=ve,y.shadowMap=xe,y.state=Re,y.info=st}ue();const X=new BT(y,U);this.xr=X,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){const T=He.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=He.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return L},this.setPixelRatio=function(T){T!==void 0&&(L=T,this.setSize(W,ee,!1))},this.getSize=function(T){return T.set(W,ee)},this.setSize=function(T,I,z=!0){if(X.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}W=T,ee=I,n.width=Math.floor(T*L),n.height=Math.floor(I*L),z===!0&&(n.style.width=T+"px",n.style.height=I+"px"),this.setViewport(0,0,T,I)},this.getDrawingBufferSize=function(T){return T.set(W*L,ee*L).floor()},this.setDrawingBufferSize=function(T,I,z){W=T,ee=I,L=z,n.width=Math.floor(T*z),n.height=Math.floor(I*z),this.setViewport(0,0,T,I)},this.getCurrentViewport=function(T){return T.copy(P)},this.getViewport=function(T){return T.copy(ae)},this.setViewport=function(T,I,z,H){T.isVector4?ae.set(T.x,T.y,T.z,T.w):ae.set(T,I,z,H),Re.viewport(P.copy(ae).multiplyScalar(L).round())},this.getScissor=function(T){return T.copy(ye)},this.setScissor=function(T,I,z,H){T.isVector4?ye.set(T.x,T.y,T.z,T.w):ye.set(T,I,z,H),Re.scissor(V.copy(ye).multiplyScalar(L).round())},this.getScissorTest=function(){return Ve},this.setScissorTest=function(T){Re.setScissorTest(Ve=T)},this.setOpaqueSort=function(T){K=T},this.setTransparentSort=function(T){q=T},this.getClearColor=function(T){return T.copy(Le.getClearColor())},this.setClearColor=function(){Le.setClearColor.apply(Le,arguments)},this.getClearAlpha=function(){return Le.getClearAlpha()},this.setClearAlpha=function(){Le.setClearAlpha.apply(Le,arguments)},this.clear=function(T=!0,I=!0,z=!0){let H=0;if(T){let F=!1;if(b!==null){const se=b.texture.format;F=se===hf||se===df||se===uf}if(F){const se=b.texture.type,fe=se===bi||se===Br||se===ta||se===Gs||se===af||se===lf,Se=Le.getClearColor(),Me=Le.getClearAlpha(),Ue=Se.r,Oe=Se.g,Ee=Se.b;fe?(_[0]=Ue,_[1]=Oe,_[2]=Ee,_[3]=Me,U.clearBufferuiv(U.COLOR,0,_)):(v[0]=Ue,v[1]=Oe,v[2]=Ee,v[3]=Me,U.clearBufferiv(U.COLOR,0,v))}else H|=U.COLOR_BUFFER_BIT}I&&(H|=U.DEPTH_BUFFER_BIT),z&&(H|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),U.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){n.removeEventListener("webglcontextlost",Z,!1),n.removeEventListener("webglcontextrestored",pe,!1),n.removeEventListener("webglcontextcreationerror",he,!1),ve.dispose(),Ke.dispose(),Ce.dispose(),S.dispose(),O.dispose(),Y.dispose(),at.dispose(),N.dispose(),we.dispose(),X.dispose(),X.removeEventListener("sessionstart",Sf),X.removeEventListener("sessionend",Mf),dr.stop()};function Z(T){T.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),R=!0}function pe(){console.log("THREE.WebGLRenderer: Context Restored."),R=!1;const T=st.autoReset,I=xe.enabled,z=xe.autoUpdate,H=xe.needsUpdate,F=xe.type;ue(),st.autoReset=T,xe.enabled=I,xe.autoUpdate=z,xe.needsUpdate=H,xe.type=F}function he(T){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function Fe(T){const I=T.target;I.removeEventListener("dispose",Fe),St(I)}function St(T){jt(T),Ce.remove(T)}function jt(T){const I=Ce.get(T).programs;I!==void 0&&(I.forEach(function(z){we.releaseProgram(z)}),T.isShaderMaterial&&we.releaseShaderCache(T))}this.renderBufferDirect=function(T,I,z,H,F,se){I===null&&(I=ot);const fe=F.isMesh&&F.matrixWorld.determinant()<0,Se=qv(T,I,z,H,F);Re.setMaterial(H,fe);let Me=z.index,Ue=1;if(H.wireframe===!0){if(Me=Q.getWireframeAttribute(z),Me===void 0)return;Ue=2}const Oe=z.drawRange,Ee=z.attributes.position;let $e=Oe.start*Ue,lt=(Oe.start+Oe.count)*Ue;se!==null&&($e=Math.max($e,se.start*Ue),lt=Math.min(lt,(se.start+se.count)*Ue)),Me!==null?($e=Math.max($e,0),lt=Math.min(lt,Me.count)):Ee!=null&&($e=Math.max($e,0),lt=Math.min(lt,Ee.count));const ut=lt-$e;if(ut<0||ut===1/0)return;at.setup(F,H,Se,z,Me);let an,Ze=_e;if(Me!==null&&(an=$.get(Me),Ze=Xe,Ze.setIndex(an)),F.isMesh)H.wireframe===!0?(Re.setLineWidth(H.wireframeLinewidth*mt()),Ze.setMode(U.LINES)):Ze.setMode(U.TRIANGLES);else if(F.isLine){let Te=H.linewidth;Te===void 0&&(Te=1),Re.setLineWidth(Te*mt()),F.isLineSegments?Ze.setMode(U.LINES):F.isLineLoop?Ze.setMode(U.LINE_LOOP):Ze.setMode(U.LINE_STRIP)}else F.isPoints?Ze.setMode(U.POINTS):F.isSprite&&Ze.setMode(U.TRIANGLES);if(F.isBatchedMesh)if(F._multiDrawInstances!==null)Ze.renderMultiDrawInstances(F._multiDrawStarts,F._multiDrawCounts,F._multiDrawCount,F._multiDrawInstances);else if(He.get("WEBGL_multi_draw"))Ze.renderMultiDraw(F._multiDrawStarts,F._multiDrawCounts,F._multiDrawCount);else{const Te=F._multiDrawStarts,ci=F._multiDrawCounts,Je=F._multiDrawCount,Fn=Me?$.get(Me).bytesPerElement:1,Xr=Ce.get(H).currentProgram.getUniforms();for(let fn=0;fn<Je;fn++)Xr.setValue(U,"_gl_DrawID",fn),Ze.render(Te[fn]/Fn,ci[fn])}else if(F.isInstancedMesh)Ze.renderInstances($e,ut,F.count);else if(z.isInstancedBufferGeometry){const Te=z._maxInstanceCount!==void 0?z._maxInstanceCount:1/0,ci=Math.min(z.instanceCount,Te);Ze.renderInstances($e,ut,ci)}else Ze.render($e,ut)};function Qe(T,I,z){T.transparent===!0&&T.side===Wn&&T.forceSinglePass===!1?(T.side=Vt,T.needsUpdate=!0,ga(T,I,z),T.side=or,T.needsUpdate=!0,ga(T,I,z),T.side=Wn):ga(T,I,z)}this.compile=function(T,I,z=null){z===null&&(z=T),d=Ke.get(z),d.init(I),x.push(d),z.traverseVisible(function(F){F.isLight&&F.layers.test(I.layers)&&(d.pushLight(F),F.castShadow&&d.pushShadow(F))}),T!==z&&T.traverseVisible(function(F){F.isLight&&F.layers.test(I.layers)&&(d.pushLight(F),F.castShadow&&d.pushShadow(F))}),d.setupLights();const H=new Set;return T.traverse(function(F){if(!(F.isMesh||F.isPoints||F.isLine||F.isSprite))return;const se=F.material;if(se)if(Array.isArray(se))for(let fe=0;fe<se.length;fe++){const Se=se[fe];Qe(Se,z,F),H.add(Se)}else Qe(se,z,F),H.add(se)}),x.pop(),d=null,H},this.compileAsync=function(T,I,z=null){const H=this.compile(T,I,z);return new Promise(F=>{function se(){if(H.forEach(function(fe){Ce.get(fe).currentProgram.isReady()&&H.delete(fe)}),H.size===0){F(T);return}setTimeout(se,10)}He.get("KHR_parallel_shader_compile")!==null?se():setTimeout(se,10)})};let Un=null;function li(T){Un&&Un(T)}function Sf(){dr.stop()}function Mf(){dr.start()}const dr=new kv;dr.setAnimationLoop(li),typeof self<"u"&&dr.setContext(self),this.setAnimationLoop=function(T){Un=T,X.setAnimationLoop(T),T===null?dr.stop():dr.start()},X.addEventListener("sessionstart",Sf),X.addEventListener("sessionend",Mf),this.render=function(T,I){if(I!==void 0&&I.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),I.parent===null&&I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),X.enabled===!0&&X.isPresenting===!0&&(X.cameraAutoUpdate===!0&&X.updateCamera(I),I=X.getCamera()),T.isScene===!0&&T.onBeforeRender(y,T,I,b),d=Ke.get(T,x.length),d.init(I),x.push(d),Pe.multiplyMatrices(I.projectionMatrix,I.matrixWorldInverse),j.setFromProjectionMatrix(Pe),ce=this.localClippingEnabled,ne=re.init(this.clippingPlanes,ce),m=ve.get(T,g.length),m.init(),g.push(m),X.enabled===!0&&X.isPresenting===!0){const se=y.xr.getDepthSensingMesh();se!==null&&yc(se,I,-1/0,y.sortObjects)}yc(T,I,0,y.sortObjects),m.finish(),y.sortObjects===!0&&m.sort(K,q),De=X.enabled===!1||X.isPresenting===!1||X.hasDepthSensing()===!1,De&&Le.addToRenderList(m,T),this.info.render.frame++,ne===!0&&re.beginShadows();const z=d.state.shadowsArray;xe.render(z,T,I),ne===!0&&re.endShadows(),this.info.autoReset===!0&&this.info.reset();const H=m.opaque,F=m.transmissive;if(d.setupLights(),I.isArrayCamera){const se=I.cameras;if(F.length>0)for(let fe=0,Se=se.length;fe<Se;fe++){const Me=se[fe];wf(H,F,T,Me)}De&&Le.render(T);for(let fe=0,Se=se.length;fe<Se;fe++){const Me=se[fe];Ef(m,T,Me,Me.viewport)}}else F.length>0&&wf(H,F,T,I),De&&Le.render(T),Ef(m,T,I);b!==null&&(E.updateMultisampleRenderTarget(b),E.updateRenderTargetMipmap(b)),T.isScene===!0&&T.onAfterRender(y,T,I),at.resetDefaultState(),w=-1,M=null,x.pop(),x.length>0?(d=x[x.length-1],ne===!0&&re.setGlobalState(y.clippingPlanes,d.state.camera)):d=null,g.pop(),g.length>0?m=g[g.length-1]:m=null};function yc(T,I,z,H){if(T.visible===!1)return;if(T.layers.test(I.layers)){if(T.isGroup)z=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(I);else if(T.isLight)d.pushLight(T),T.castShadow&&d.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||j.intersectsSprite(T)){H&&be.setFromMatrixPosition(T.matrixWorld).applyMatrix4(Pe);const fe=Y.update(T),Se=T.material;Se.visible&&m.push(T,fe,Se,z,be.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||j.intersectsObject(T))){const fe=Y.update(T),Se=T.material;if(H&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),be.copy(T.boundingSphere.center)):(fe.boundingSphere===null&&fe.computeBoundingSphere(),be.copy(fe.boundingSphere.center)),be.applyMatrix4(T.matrixWorld).applyMatrix4(Pe)),Array.isArray(Se)){const Me=fe.groups;for(let Ue=0,Oe=Me.length;Ue<Oe;Ue++){const Ee=Me[Ue],$e=Se[Ee.materialIndex];$e&&$e.visible&&m.push(T,fe,$e,z,be.z,Ee)}}else Se.visible&&m.push(T,fe,Se,z,be.z,null)}}const se=T.children;for(let fe=0,Se=se.length;fe<Se;fe++)yc(se[fe],I,z,H)}function Ef(T,I,z,H){const F=T.opaque,se=T.transmissive,fe=T.transparent;d.setupLightsView(z),ne===!0&&re.setGlobalState(y.clippingPlanes,z),H&&Re.viewport(P.copy(H)),F.length>0&&ma(F,I,z),se.length>0&&ma(se,I,z),fe.length>0&&ma(fe,I,z),Re.buffers.depth.setTest(!0),Re.buffers.depth.setMask(!0),Re.buffers.color.setMask(!0),Re.setPolygonOffset(!1)}function wf(T,I,z,H){if((z.isScene===!0?z.overrideMaterial:null)!==null)return;d.state.transmissionRenderTarget[H.id]===void 0&&(d.state.transmissionRenderTarget[H.id]=new zr(1,1,{generateMipmaps:!0,type:He.has("EXT_color_buffer_half_float")||He.has("EXT_color_buffer_float")?da:bi,minFilter:ni,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ye.workingColorSpace}));const se=d.state.transmissionRenderTarget[H.id],fe=H.viewport||P;se.setSize(fe.z,fe.w);const Se=y.getRenderTarget();y.setRenderTarget(se),y.getClearColor(G),J=y.getClearAlpha(),J<1&&y.setClearColor(16777215,.5),y.clear(),De&&Le.render(z);const Me=y.toneMapping;y.toneMapping=ir;const Ue=H.viewport;if(H.viewport!==void 0&&(H.viewport=void 0),d.setupLightsView(H),ne===!0&&re.setGlobalState(y.clippingPlanes,H),ma(T,z,H),E.updateMultisampleRenderTarget(se),E.updateRenderTargetMipmap(se),He.has("WEBGL_multisampled_render_to_texture")===!1){let Oe=!1;for(let Ee=0,$e=I.length;Ee<$e;Ee++){const lt=I[Ee],ut=lt.object,an=lt.geometry,Ze=lt.material,Te=lt.group;if(Ze.side===Wn&&ut.layers.test(H.layers)){const ci=Ze.side;Ze.side=Vt,Ze.needsUpdate=!0,Tf(ut,z,H,an,Ze,Te),Ze.side=ci,Ze.needsUpdate=!0,Oe=!0}}Oe===!0&&(E.updateMultisampleRenderTarget(se),E.updateRenderTargetMipmap(se))}y.setRenderTarget(Se),y.setClearColor(G,J),Ue!==void 0&&(H.viewport=Ue),y.toneMapping=Me}function ma(T,I,z){const H=I.isScene===!0?I.overrideMaterial:null;for(let F=0,se=T.length;F<se;F++){const fe=T[F],Se=fe.object,Me=fe.geometry,Ue=H===null?fe.material:H,Oe=fe.group;Se.layers.test(z.layers)&&Tf(Se,I,z,Me,Ue,Oe)}}function Tf(T,I,z,H,F,se){T.onBeforeRender(y,I,z,H,F,se),T.modelViewMatrix.multiplyMatrices(z.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),F.onBeforeRender(y,I,z,H,T,se),F.transparent===!0&&F.side===Wn&&F.forceSinglePass===!1?(F.side=Vt,F.needsUpdate=!0,y.renderBufferDirect(z,I,H,F,T,se),F.side=or,F.needsUpdate=!0,y.renderBufferDirect(z,I,H,F,T,se),F.side=Wn):y.renderBufferDirect(z,I,H,F,T,se),T.onAfterRender(y,I,z,H,F,se)}function ga(T,I,z){I.isScene!==!0&&(I=ot);const H=Ce.get(T),F=d.state.lights,se=d.state.shadowsArray,fe=F.state.version,Se=we.getParameters(T,F.state,se,I,z),Me=we.getProgramCacheKey(Se);let Ue=H.programs;H.environment=T.isMeshStandardMaterial?I.environment:null,H.fog=I.fog,H.envMap=(T.isMeshStandardMaterial?O:S).get(T.envMap||H.environment),H.envMapRotation=H.environment!==null&&T.envMap===null?I.environmentRotation:T.envMapRotation,Ue===void 0&&(T.addEventListener("dispose",Fe),Ue=new Map,H.programs=Ue);let Oe=Ue.get(Me);if(Oe!==void 0){if(H.currentProgram===Oe&&H.lightsStateVersion===fe)return Cf(T,Se),Oe}else Se.uniforms=we.getUniforms(T),T.onBeforeCompile(Se,y),Oe=we.acquireProgram(Se,Me),Ue.set(Me,Oe),H.uniforms=Se.uniforms;const Ee=H.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(Ee.clippingPlanes=re.uniform),Cf(T,Se),H.needsLights=Zv(T),H.lightsStateVersion=fe,H.needsLights&&(Ee.ambientLightColor.value=F.state.ambient,Ee.lightProbe.value=F.state.probe,Ee.directionalLights.value=F.state.directional,Ee.directionalLightShadows.value=F.state.directionalShadow,Ee.spotLights.value=F.state.spot,Ee.spotLightShadows.value=F.state.spotShadow,Ee.rectAreaLights.value=F.state.rectArea,Ee.ltc_1.value=F.state.rectAreaLTC1,Ee.ltc_2.value=F.state.rectAreaLTC2,Ee.pointLights.value=F.state.point,Ee.pointLightShadows.value=F.state.pointShadow,Ee.hemisphereLights.value=F.state.hemi,Ee.directionalShadowMap.value=F.state.directionalShadowMap,Ee.directionalShadowMatrix.value=F.state.directionalShadowMatrix,Ee.spotShadowMap.value=F.state.spotShadowMap,Ee.spotLightMatrix.value=F.state.spotLightMatrix,Ee.spotLightMap.value=F.state.spotLightMap,Ee.pointShadowMap.value=F.state.pointShadowMap,Ee.pointShadowMatrix.value=F.state.pointShadowMatrix),H.currentProgram=Oe,H.uniformsList=null,Oe}function Af(T){if(T.uniformsList===null){const I=T.currentProgram.getUniforms();T.uniformsList=wl.seqWithValue(I.seq,T.uniforms)}return T.uniformsList}function Cf(T,I){const z=Ce.get(T);z.outputColorSpace=I.outputColorSpace,z.batching=I.batching,z.batchingColor=I.batchingColor,z.instancing=I.instancing,z.instancingColor=I.instancingColor,z.instancingMorph=I.instancingMorph,z.skinning=I.skinning,z.morphTargets=I.morphTargets,z.morphNormals=I.morphNormals,z.morphColors=I.morphColors,z.morphTargetsCount=I.morphTargetsCount,z.numClippingPlanes=I.numClippingPlanes,z.numIntersection=I.numClipIntersection,z.vertexAlphas=I.vertexAlphas,z.vertexTangents=I.vertexTangents,z.toneMapping=I.toneMapping}function qv(T,I,z,H,F){I.isScene!==!0&&(I=ot),E.resetTextureUnits();const se=I.fog,fe=H.isMeshStandardMaterial?I.environment:null,Se=b===null?y.outputColorSpace:b.isXRRenderTarget===!0?b.texture.colorSpace:$s,Me=(H.isMeshStandardMaterial?O:S).get(H.envMap||fe),Ue=H.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,Oe=!!z.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),Ee=!!z.morphAttributes.position,$e=!!z.morphAttributes.normal,lt=!!z.morphAttributes.color;let ut=ir;H.toneMapped&&(b===null||b.isXRRenderTarget===!0)&&(ut=y.toneMapping);const an=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,Ze=an!==void 0?an.length:0,Te=Ce.get(H),ci=d.state.lights;if(ne===!0&&(ce===!0||T!==M)){const An=T===M&&H.id===w;re.setState(H,T,An)}let Je=!1;H.version===Te.__version?(Te.needsLights&&Te.lightsStateVersion!==ci.state.version||Te.outputColorSpace!==Se||F.isBatchedMesh&&Te.batching===!1||!F.isBatchedMesh&&Te.batching===!0||F.isBatchedMesh&&Te.batchingColor===!0&&F.colorTexture===null||F.isBatchedMesh&&Te.batchingColor===!1&&F.colorTexture!==null||F.isInstancedMesh&&Te.instancing===!1||!F.isInstancedMesh&&Te.instancing===!0||F.isSkinnedMesh&&Te.skinning===!1||!F.isSkinnedMesh&&Te.skinning===!0||F.isInstancedMesh&&Te.instancingColor===!0&&F.instanceColor===null||F.isInstancedMesh&&Te.instancingColor===!1&&F.instanceColor!==null||F.isInstancedMesh&&Te.instancingMorph===!0&&F.morphTexture===null||F.isInstancedMesh&&Te.instancingMorph===!1&&F.morphTexture!==null||Te.envMap!==Me||H.fog===!0&&Te.fog!==se||Te.numClippingPlanes!==void 0&&(Te.numClippingPlanes!==re.numPlanes||Te.numIntersection!==re.numIntersection)||Te.vertexAlphas!==Ue||Te.vertexTangents!==Oe||Te.morphTargets!==Ee||Te.morphNormals!==$e||Te.morphColors!==lt||Te.toneMapping!==ut||Te.morphTargetsCount!==Ze)&&(Je=!0):(Je=!0,Te.__version=H.version);let Fn=Te.currentProgram;Je===!0&&(Fn=ga(H,I,F));let Xr=!1,fn=!1,eo=!1;const dt=Fn.getUniforms(),$n=Te.uniforms;if(Re.useProgram(Fn.program)&&(Xr=!0,fn=!0,eo=!0),H.id!==w&&(w=H.id,fn=!0),Xr||M!==T){Re.buffers.depth.getReversed()?(oe.copy(T.projectionMatrix),LS(oe),NS(oe),dt.setValue(U,"projectionMatrix",oe)):dt.setValue(U,"projectionMatrix",T.projectionMatrix),dt.setValue(U,"viewMatrix",T.matrixWorldInverse);const Pi=dt.map.cameraPosition;Pi!==void 0&&Pi.setValue(U,Ae.setFromMatrixPosition(T.matrixWorld)),We.logarithmicDepthBuffer&&dt.setValue(U,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&dt.setValue(U,"isOrthographic",T.isOrthographicCamera===!0),M!==T&&(M=T,fn=!0,eo=!0)}if(F.isSkinnedMesh){dt.setOptional(U,F,"bindMatrix"),dt.setOptional(U,F,"bindMatrixInverse");const An=F.skeleton;An&&(An.boneTexture===null&&An.computeBoneTexture(),dt.setValue(U,"boneTexture",An.boneTexture,E))}F.isBatchedMesh&&(dt.setOptional(U,F,"batchingTexture"),dt.setValue(U,"batchingTexture",F._matricesTexture,E),dt.setOptional(U,F,"batchingIdTexture"),dt.setValue(U,"batchingIdTexture",F._indirectTexture,E),dt.setOptional(U,F,"batchingColorTexture"),F._colorsTexture!==null&&dt.setValue(U,"batchingColorTexture",F._colorsTexture,E));const to=z.morphAttributes;if((to.position!==void 0||to.normal!==void 0||to.color!==void 0)&&Ie.update(F,z,Fn),(fn||Te.receiveShadow!==F.receiveShadow)&&(Te.receiveShadow=F.receiveShadow,dt.setValue(U,"receiveShadow",F.receiveShadow)),H.isMeshGouraudMaterial&&H.envMap!==null&&($n.envMap.value=Me,$n.flipEnvMap.value=Me.isCubeTexture&&Me.isRenderTargetTexture===!1?-1:1),H.isMeshStandardMaterial&&H.envMap===null&&I.environment!==null&&($n.envMapIntensity.value=I.environmentIntensity),fn&&(dt.setValue(U,"toneMappingExposure",y.toneMappingExposure),Te.needsLights&&$v($n,eo),se&&H.fog===!0&&de.refreshFogUniforms($n,se),de.refreshMaterialUniforms($n,H,L,ee,d.state.transmissionRenderTarget[T.id]),wl.upload(U,Af(Te),$n,E)),H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(wl.upload(U,Af(Te),$n,E),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&dt.setValue(U,"center",F.center),dt.setValue(U,"modelViewMatrix",F.modelViewMatrix),dt.setValue(U,"normalMatrix",F.normalMatrix),dt.setValue(U,"modelMatrix",F.matrixWorld),H.isShaderMaterial||H.isRawShaderMaterial){const An=H.uniformsGroups;for(let Pi=0,Di=An.length;Pi<Di;Pi++){const bf=An[Pi];N.update(bf,Fn),N.bind(bf,Fn)}}return Fn}function $v(T,I){T.ambientLightColor.needsUpdate=I,T.lightProbe.needsUpdate=I,T.directionalLights.needsUpdate=I,T.directionalLightShadows.needsUpdate=I,T.pointLights.needsUpdate=I,T.pointLightShadows.needsUpdate=I,T.spotLights.needsUpdate=I,T.spotLightShadows.needsUpdate=I,T.rectAreaLights.needsUpdate=I,T.hemisphereLights.needsUpdate=I}function Zv(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return C},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return b},this.setRenderTargetTextures=function(T,I,z){Ce.get(T.texture).__webglTexture=I,Ce.get(T.depthTexture).__webglTexture=z;const H=Ce.get(T);H.__hasExternalTextures=!0,H.__autoAllocateDepthBuffer=z===void 0,H.__autoAllocateDepthBuffer||He.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),H.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(T,I){const z=Ce.get(T);z.__webglFramebuffer=I,z.__useDefaultFramebuffer=I===void 0},this.setRenderTarget=function(T,I=0,z=0){b=T,C=I,A=z;let H=!0,F=null,se=!1,fe=!1;if(T){const Me=Ce.get(T);if(Me.__useDefaultFramebuffer!==void 0)Re.bindFramebuffer(U.FRAMEBUFFER,null),H=!1;else if(Me.__webglFramebuffer===void 0)E.setupRenderTarget(T);else if(Me.__hasExternalTextures)E.rebindTextures(T,Ce.get(T.texture).__webglTexture,Ce.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){const Ee=T.depthTexture;if(Me.__boundDepthTexture!==Ee){if(Ee!==null&&Ce.has(Ee)&&(T.width!==Ee.image.width||T.height!==Ee.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");E.setupDepthRenderbuffer(T)}}const Ue=T.texture;(Ue.isData3DTexture||Ue.isDataArrayTexture||Ue.isCompressedArrayTexture)&&(fe=!0);const Oe=Ce.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(Oe[I])?F=Oe[I][z]:F=Oe[I],se=!0):T.samples>0&&E.useMultisampledRTT(T)===!1?F=Ce.get(T).__webglMultisampledFramebuffer:Array.isArray(Oe)?F=Oe[z]:F=Oe,P.copy(T.viewport),V.copy(T.scissor),B=T.scissorTest}else P.copy(ae).multiplyScalar(L).floor(),V.copy(ye).multiplyScalar(L).floor(),B=Ve;if(Re.bindFramebuffer(U.FRAMEBUFFER,F)&&H&&Re.drawBuffers(T,F),Re.viewport(P),Re.scissor(V),Re.setScissorTest(B),se){const Me=Ce.get(T.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+I,Me.__webglTexture,z)}else if(fe){const Me=Ce.get(T.texture),Ue=I||0;U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,Me.__webglTexture,z||0,Ue)}w=-1},this.readRenderTargetPixels=function(T,I,z,H,F,se,fe){if(!(T&&T.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Se=Ce.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&fe!==void 0&&(Se=Se[fe]),Se){Re.bindFramebuffer(U.FRAMEBUFFER,Se);try{const Me=T.texture,Ue=Me.format,Oe=Me.type;if(!We.textureFormatReadable(Ue)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!We.textureTypeReadable(Oe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}I>=0&&I<=T.width-H&&z>=0&&z<=T.height-F&&U.readPixels(I,z,H,F,Be.convert(Ue),Be.convert(Oe),se)}finally{const Me=b!==null?Ce.get(b).__webglFramebuffer:null;Re.bindFramebuffer(U.FRAMEBUFFER,Me)}}},this.readRenderTargetPixelsAsync=async function(T,I,z,H,F,se,fe){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Se=Ce.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&fe!==void 0&&(Se=Se[fe]),Se){const Me=T.texture,Ue=Me.format,Oe=Me.type;if(!We.textureFormatReadable(Ue))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!We.textureTypeReadable(Oe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(I>=0&&I<=T.width-H&&z>=0&&z<=T.height-F){Re.bindFramebuffer(U.FRAMEBUFFER,Se);const Ee=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,Ee),U.bufferData(U.PIXEL_PACK_BUFFER,se.byteLength,U.STREAM_READ),U.readPixels(I,z,H,F,Be.convert(Ue),Be.convert(Oe),0);const $e=b!==null?Ce.get(b).__webglFramebuffer:null;Re.bindFramebuffer(U.FRAMEBUFFER,$e);const lt=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await DS(U,lt,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,Ee),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,se),U.deleteBuffer(Ee),U.deleteSync(lt),se}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(T,I=null,z=0){T.isTexture!==!0&&(Eo("WebGLRenderer: copyFramebufferToTexture function signature has changed."),I=arguments[0]||null,T=arguments[1]);const H=Math.pow(2,-z),F=Math.floor(T.image.width*H),se=Math.floor(T.image.height*H),fe=I!==null?I.x:0,Se=I!==null?I.y:0;E.setTexture2D(T,0),U.copyTexSubImage2D(U.TEXTURE_2D,z,0,0,fe,Se,F,se),Re.unbindTexture()},this.copyTextureToTexture=function(T,I,z=null,H=null,F=0){T.isTexture!==!0&&(Eo("WebGLRenderer: copyTextureToTexture function signature has changed."),H=arguments[0]||null,T=arguments[1],I=arguments[2],F=arguments[3]||0,z=null);let se,fe,Se,Me,Ue,Oe,Ee,$e,lt;const ut=T.isCompressedTexture?T.mipmaps[F]:T.image;z!==null?(se=z.max.x-z.min.x,fe=z.max.y-z.min.y,Se=z.isBox3?z.max.z-z.min.z:1,Me=z.min.x,Ue=z.min.y,Oe=z.isBox3?z.min.z:0):(se=ut.width,fe=ut.height,Se=ut.depth||1,Me=0,Ue=0,Oe=0),H!==null?(Ee=H.x,$e=H.y,lt=H.z):(Ee=0,$e=0,lt=0);const an=Be.convert(I.format),Ze=Be.convert(I.type);let Te;I.isData3DTexture?(E.setTexture3D(I,0),Te=U.TEXTURE_3D):I.isDataArrayTexture||I.isCompressedArrayTexture?(E.setTexture2DArray(I,0),Te=U.TEXTURE_2D_ARRAY):(E.setTexture2D(I,0),Te=U.TEXTURE_2D),U.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,I.flipY),U.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,I.premultiplyAlpha),U.pixelStorei(U.UNPACK_ALIGNMENT,I.unpackAlignment);const ci=U.getParameter(U.UNPACK_ROW_LENGTH),Je=U.getParameter(U.UNPACK_IMAGE_HEIGHT),Fn=U.getParameter(U.UNPACK_SKIP_PIXELS),Xr=U.getParameter(U.UNPACK_SKIP_ROWS),fn=U.getParameter(U.UNPACK_SKIP_IMAGES);U.pixelStorei(U.UNPACK_ROW_LENGTH,ut.width),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,ut.height),U.pixelStorei(U.UNPACK_SKIP_PIXELS,Me),U.pixelStorei(U.UNPACK_SKIP_ROWS,Ue),U.pixelStorei(U.UNPACK_SKIP_IMAGES,Oe);const eo=T.isDataArrayTexture||T.isData3DTexture,dt=I.isDataArrayTexture||I.isData3DTexture;if(T.isRenderTargetTexture||T.isDepthTexture){const $n=Ce.get(T),to=Ce.get(I),An=Ce.get($n.__renderTarget),Pi=Ce.get(to.__renderTarget);Re.bindFramebuffer(U.READ_FRAMEBUFFER,An.__webglFramebuffer),Re.bindFramebuffer(U.DRAW_FRAMEBUFFER,Pi.__webglFramebuffer);for(let Di=0;Di<Se;Di++)eo&&U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Ce.get(T).__webglTexture,F,Oe+Di),T.isDepthTexture?(dt&&U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Ce.get(I).__webglTexture,F,lt+Di),U.blitFramebuffer(Me,Ue,se,fe,Ee,$e,se,fe,U.DEPTH_BUFFER_BIT,U.NEAREST)):dt?U.copyTexSubImage3D(Te,F,Ee,$e,lt+Di,Me,Ue,se,fe):U.copyTexSubImage2D(Te,F,Ee,$e,lt+Di,Me,Ue,se,fe);Re.bindFramebuffer(U.READ_FRAMEBUFFER,null),Re.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else dt?T.isDataTexture||T.isData3DTexture?U.texSubImage3D(Te,F,Ee,$e,lt,se,fe,Se,an,Ze,ut.data):I.isCompressedArrayTexture?U.compressedTexSubImage3D(Te,F,Ee,$e,lt,se,fe,Se,an,ut.data):U.texSubImage3D(Te,F,Ee,$e,lt,se,fe,Se,an,Ze,ut):T.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,F,Ee,$e,se,fe,an,Ze,ut.data):T.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,F,Ee,$e,ut.width,ut.height,an,ut.data):U.texSubImage2D(U.TEXTURE_2D,F,Ee,$e,se,fe,an,Ze,ut);U.pixelStorei(U.UNPACK_ROW_LENGTH,ci),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,Je),U.pixelStorei(U.UNPACK_SKIP_PIXELS,Fn),U.pixelStorei(U.UNPACK_SKIP_ROWS,Xr),U.pixelStorei(U.UNPACK_SKIP_IMAGES,fn),F===0&&I.generateMipmaps&&U.generateMipmap(Te),Re.unbindTexture()},this.copyTextureToTexture3D=function(T,I,z=null,H=null,F=0){return T.isTexture!==!0&&(Eo("WebGLRenderer: copyTextureToTexture3D function signature has changed."),z=arguments[0]||null,H=arguments[1]||null,T=arguments[2],I=arguments[3],F=arguments[4]||0),Eo('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(T,I,z,H,F)},this.initRenderTarget=function(T){Ce.get(T).__webglFramebuffer===void 0&&E.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?E.setTextureCube(T,0):T.isData3DTexture?E.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?E.setTexture2DArray(T,0):E.setTexture2D(T,0),Re.unbindTexture()},this.resetState=function(){C=0,A=0,b=null,Re.reset(),at.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return yi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const n=this.getContext();n.drawingBufferColorspace=Ye._getDrawingBufferColorSpace(e),n.unpackColorSpace=Ye._getUnpackColorSpace()}}class WT extends Gt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ai,this.environmentIntensity=1,this.environmentRotation=new ai,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,n){return super.copy(e,n),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const n=super.toJSON(e);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(n.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(n.object.backgroundIntensity=this.backgroundIntensity),n.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(n.object.environmentIntensity=this.environmentIntensity),n.object.environmentRotation=this.environmentRotation.toArray(),n}}class jT extends kt{constructor(e=null,n=1,i=1,r,s,o,a,l,c=Mn,u=Mn,h,f){super(null,o,a,l,c,u,r,s,h,f),this.isDataTexture=!0,this.image={data:e,width:n,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Fm extends Et{constructor(e,n,i,r=1){super(e,n,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const ls=new nt,Om=new nt,tl=[],km=new Gr,XT=new nt,mo=new Tt,go=new Wr;class KT extends Tt{constructor(e,n,i){super(e,n),this.isInstancedMesh=!0,this.instanceMatrix=new Fm(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let r=0;r<i;r++)this.setMatrixAt(r,XT)}computeBoundingBox(){const e=this.geometry,n=this.count;this.boundingBox===null&&(this.boundingBox=new Gr),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<n;i++)this.getMatrixAt(i,ls),km.copy(e.boundingBox).applyMatrix4(ls),this.boundingBox.union(km)}computeBoundingSphere(){const e=this.geometry,n=this.count;this.boundingSphere===null&&(this.boundingSphere=new Wr),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<n;i++)this.getMatrixAt(i,ls),go.copy(e.boundingSphere).applyMatrix4(ls),this.boundingSphere.union(go)}copy(e,n){return super.copy(e,n),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,n){n.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,n){n.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,n){const i=n.morphTargetInfluences,r=this.morphTexture.source.data.data,s=i.length+1,o=e*s+1;for(let a=0;a<i.length;a++)i[a]=r[o+a]}raycast(e,n){const i=this.matrixWorld,r=this.count;if(mo.geometry=this.geometry,mo.material=this.material,mo.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),go.copy(this.boundingSphere),go.applyMatrix4(i),e.ray.intersectsSphere(go)!==!1))for(let s=0;s<r;s++){this.getMatrixAt(s,ls),Om.multiplyMatrices(i,ls),mo.matrixWorld=Om,mo.raycast(e,tl);for(let o=0,a=tl.length;o<a;o++){const l=tl[o];l.instanceId=s,l.object=this,n.push(l)}tl.length=0}}setColorAt(e,n){this.instanceColor===null&&(this.instanceColor=new Fm(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),n.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,n){n.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,n){const i=n.morphTargetInfluences,r=i.length+1;this.morphTexture===null&&(this.morphTexture=new jT(new Float32Array(r*this.count),r,this.count,cf,ii));const s=this.morphTexture.source.data.data;let o=0;for(let c=0;c<i.length;c++)o+=i[c];const a=this.geometry.morphTargetsRelative?1:1-o,l=r*e;s[l]=a,s.set(i,l+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}class Xs extends jr{static get type(){return"LineBasicMaterial"}constructor(e){super(),this.isLineBasicMaterial=!0,this.color=new ge(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const $l=new D,Zl=new D,Bm=new nt,vo=new xc,nl=new Wr,Su=new D,zm=new D;class ra extends Gt{constructor(e=new bt,n=new Xs){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const n=e.attributes.position,i=[0];for(let r=1,s=n.count;r<s;r++)$l.fromBufferAttribute(n,r-1),Zl.fromBufferAttribute(n,r),i[r]=i[r-1],i[r]+=$l.distanceTo(Zl);e.setAttribute("lineDistance",new Dt(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,n){const i=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),nl.copy(i.boundingSphere),nl.applyMatrix4(r),nl.radius+=s,e.ray.intersectsSphere(nl)===!1)return;Bm.copy(r).invert(),vo.copy(e.ray).applyMatrix4(Bm);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,u=i.index,f=i.attributes.position;if(u!==null){const p=Math.max(0,o.start),_=Math.min(u.count,o.start+o.count);for(let v=p,m=_-1;v<m;v+=c){const d=u.getX(v),g=u.getX(v+1),x=il(this,e,vo,l,d,g);x&&n.push(x)}if(this.isLineLoop){const v=u.getX(_-1),m=u.getX(p),d=il(this,e,vo,l,v,m);d&&n.push(d)}}else{const p=Math.max(0,o.start),_=Math.min(f.count,o.start+o.count);for(let v=p,m=_-1;v<m;v+=c){const d=il(this,e,vo,l,v,v+1);d&&n.push(d)}if(this.isLineLoop){const v=il(this,e,vo,l,_-1,p);v&&n.push(v)}}}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function il(t,e,n,i,r,s){const o=t.geometry.attributes.position;if($l.fromBufferAttribute(o,r),Zl.fromBufferAttribute(o,s),n.distanceSqToSegment($l,Zl,Su,zm)>i)return;Su.applyMatrix4(t.matrixWorld);const l=e.ray.origin.distanceTo(Su);if(!(l<e.near||l>e.far))return{distance:l,point:zm.clone().applyMatrix4(t.matrixWorld),index:r,face:null,faceIndex:null,barycoord:null,object:t}}const Hm=new D,Vm=new D;class Wv extends ra{constructor(e,n){super(e,n),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const n=e.attributes.position,i=[];for(let r=0,s=n.count;r<s;r+=2)Hm.fromBufferAttribute(n,r),Vm.fromBufferAttribute(n,r+1),i[r]=r===0?0:i[r-1],i[r+1]=i[r]+Hm.distanceTo(Vm);e.setAttribute("lineDistance",new Dt(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class jv extends jr{static get type(){return"PointsMaterial"}constructor(e){super(),this.isPointsMaterial=!0,this.color=new ge(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Gm=new nt,oh=new xc,rl=new Wr,sl=new D;class Mu extends Gt{constructor(e=new bt,n=new jv){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,n){const i=this.geometry,r=this.matrixWorld,s=e.params.Points.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),rl.copy(i.boundingSphere),rl.applyMatrix4(r),rl.radius+=s,e.ray.intersectsSphere(rl)===!1)return;Gm.copy(r).invert(),oh.copy(e.ray).applyMatrix4(Gm);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=i.index,h=i.attributes.position;if(c!==null){const f=Math.max(0,o.start),p=Math.min(c.count,o.start+o.count);for(let _=f,v=p;_<v;_++){const m=c.getX(_);sl.fromBufferAttribute(h,m),Wm(sl,m,l,r,e,n,this)}}else{const f=Math.max(0,o.start),p=Math.min(h.count,o.start+o.count);for(let _=f,v=p;_<v;_++)sl.fromBufferAttribute(h,_),Wm(sl,_,l,r,e,n,this)}}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function Wm(t,e,n,i,r,s,o){const a=oh.distanceSqToPoint(t);if(a<n){const l=new D;oh.closestPointToPoint(t,l),l.applyMatrix4(i);const c=r.ray.origin.distanceTo(l);if(c<r.near||c>r.far)return;s.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}class gt extends kt{constructor(e,n,i,r,s,o,a,l,c){super(e,n,i,r,s,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class vf extends bt{constructor(e=[],n=[],i=1,r=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:n,radius:i,detail:r};const s=[],o=[];a(r),c(i),u(),this.setAttribute("position",new Dt(s,3)),this.setAttribute("normal",new Dt(s.slice(),3)),this.setAttribute("uv",new Dt(o,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function a(g){const x=new D,y=new D,R=new D;for(let C=0;C<n.length;C+=3)p(n[C+0],x),p(n[C+1],y),p(n[C+2],R),l(x,y,R,g)}function l(g,x,y,R){const C=R+1,A=[];for(let b=0;b<=C;b++){A[b]=[];const w=g.clone().lerp(y,b/C),M=x.clone().lerp(y,b/C),P=C-b;for(let V=0;V<=P;V++)V===0&&b===C?A[b][V]=w:A[b][V]=w.clone().lerp(M,V/P)}for(let b=0;b<C;b++)for(let w=0;w<2*(C-b)-1;w++){const M=Math.floor(w/2);w%2===0?(f(A[b][M+1]),f(A[b+1][M]),f(A[b][M])):(f(A[b][M+1]),f(A[b+1][M+1]),f(A[b+1][M]))}}function c(g){const x=new D;for(let y=0;y<s.length;y+=3)x.x=s[y+0],x.y=s[y+1],x.z=s[y+2],x.normalize().multiplyScalar(g),s[y+0]=x.x,s[y+1]=x.y,s[y+2]=x.z}function u(){const g=new D;for(let x=0;x<s.length;x+=3){g.x=s[x+0],g.y=s[x+1],g.z=s[x+2];const y=m(g)/2/Math.PI+.5,R=d(g)/Math.PI+.5;o.push(y,1-R)}_(),h()}function h(){for(let g=0;g<o.length;g+=6){const x=o[g+0],y=o[g+2],R=o[g+4],C=Math.max(x,y,R),A=Math.min(x,y,R);C>.9&&A<.1&&(x<.2&&(o[g+0]+=1),y<.2&&(o[g+2]+=1),R<.2&&(o[g+4]+=1))}}function f(g){s.push(g.x,g.y,g.z)}function p(g,x){const y=g*3;x.x=e[y+0],x.y=e[y+1],x.z=e[y+2]}function _(){const g=new D,x=new D,y=new D,R=new D,C=new je,A=new je,b=new je;for(let w=0,M=0;w<s.length;w+=9,M+=6){g.set(s[w+0],s[w+1],s[w+2]),x.set(s[w+3],s[w+4],s[w+5]),y.set(s[w+6],s[w+7],s[w+8]),C.set(o[M+0],o[M+1]),A.set(o[M+2],o[M+3]),b.set(o[M+4],o[M+5]),R.copy(g).add(x).add(y).divideScalar(3);const P=m(R);v(C,M+0,g,P),v(A,M+2,x,P),v(b,M+4,y,P)}}function v(g,x,y,R){R<0&&g.x===1&&(o[x]=g.x-1),y.x===0&&y.z===0&&(o[x]=R/2/Math.PI+.5)}function m(g){return Math.atan2(g.z,-g.x)}function d(g){return Math.atan2(-g.y,Math.sqrt(g.x*g.x+g.z*g.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new vf(e.vertices,e.indices,e.radius,e.details)}}class xf extends vf{constructor(e=1,n=0){const i=(1+Math.sqrt(5))/2,r=1/i,s=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-r,-i,0,-r,i,0,r,-i,0,r,i,-r,-i,0,-r,i,0,r,-i,0,r,i,0,-i,0,-r,i,0,-r,-i,0,r,i,0,r],o=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(s,o,e,n),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:n}}static fromJSON(e){return new xf(e.radius,e.detail)}}class _f extends bt{constructor(e=.5,n=1,i=32,r=1,s=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:n,thetaSegments:i,phiSegments:r,thetaStart:s,thetaLength:o},i=Math.max(3,i),r=Math.max(1,r);const a=[],l=[],c=[],u=[];let h=e;const f=(n-e)/r,p=new D,_=new je;for(let v=0;v<=r;v++){for(let m=0;m<=i;m++){const d=s+m/i*o;p.x=h*Math.cos(d),p.y=h*Math.sin(d),l.push(p.x,p.y,p.z),c.push(0,0,1),_.x=(p.x/n+1)/2,_.y=(p.y/n+1)/2,u.push(_.x,_.y)}h+=f}for(let v=0;v<r;v++){const m=v*(i+1);for(let d=0;d<i;d++){const g=d+m,x=g,y=g+i+1,R=g+i+2,C=g+1;a.push(x,y,C),a.push(y,R,C)}}this.setIndex(a),this.setAttribute("position",new Dt(l,3)),this.setAttribute("normal",new Dt(c,3)),this.setAttribute("uv",new Dt(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new _f(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class ji extends bt{constructor(e=1,n=32,i=16,r=0,s=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:n,heightSegments:i,phiStart:r,phiLength:s,thetaStart:o,thetaLength:a},n=Math.max(3,Math.floor(n)),i=Math.max(2,Math.floor(i));const l=Math.min(o+a,Math.PI);let c=0;const u=[],h=new D,f=new D,p=[],_=[],v=[],m=[];for(let d=0;d<=i;d++){const g=[],x=d/i;let y=0;d===0&&o===0?y=.5/n:d===i&&l===Math.PI&&(y=-.5/n);for(let R=0;R<=n;R++){const C=R/n;h.x=-e*Math.cos(r+C*s)*Math.sin(o+x*a),h.y=e*Math.cos(o+x*a),h.z=e*Math.sin(r+C*s)*Math.sin(o+x*a),_.push(h.x,h.y,h.z),f.copy(h).normalize(),v.push(f.x,f.y,f.z),m.push(C+y,1-x),g.push(c++)}u.push(g)}for(let d=0;d<i;d++)for(let g=0;g<n;g++){const x=u[d][g+1],y=u[d][g],R=u[d+1][g],C=u[d+1][g+1];(d!==0||o>0)&&p.push(x,y,C),(d!==i-1||l<Math.PI)&&p.push(y,R,C)}this.setIndex(p),this.setAttribute("position",new Dt(_,3)),this.setAttribute("normal",new Dt(v,3)),this.setAttribute("uv",new Dt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ji(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class YT extends jr{static get type(){return"MeshStandardMaterial"}constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new ge(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ge(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Av,this.normalScale=new je(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ai,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}const jm={enabled:!1,files:{},add:function(t,e){this.enabled!==!1&&(this.files[t]=e)},get:function(t){if(this.enabled!==!1)return this.files[t]},remove:function(t){delete this.files[t]},clear:function(){this.files={}}};class qT{constructor(e,n,i){const r=this;let s=!1,o=0,a=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=n,this.onError=i,this.itemStart=function(u){a++,s===!1&&r.onStart!==void 0&&r.onStart(u,o,a),s=!0},this.itemEnd=function(u){o++,r.onProgress!==void 0&&r.onProgress(u,o,a),o===a&&(s=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(u){r.onError!==void 0&&r.onError(u)},this.resolveURL=function(u){return l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,h){return c.push(u,h),this},this.removeHandler=function(u){const h=c.indexOf(u);return h!==-1&&c.splice(h,2),this},this.getHandler=function(u){for(let h=0,f=c.length;h<f;h+=2){const p=c[h],_=c[h+1];if(p.global&&(p.lastIndex=0),p.test(u))return _}return null}}}const $T=new qT;class yf{constructor(e){this.manager=e!==void 0?e:$T,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,n){const i=this;return new Promise(function(r,s){i.load(e,r,n,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}yf.DEFAULT_MATERIAL_NAME="__DEFAULT";class ZT extends yf{constructor(e){super(e)}load(e,n,i,r){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,o=jm.get(e);if(o!==void 0)return s.manager.itemStart(e),setTimeout(function(){n&&n(o),s.manager.itemEnd(e)},0),o;const a=ia("img");function l(){u(),jm.add(e,this),n&&n(this),s.manager.itemEnd(e)}function c(h){u(),r&&r(h),s.manager.itemError(e),s.manager.itemEnd(e)}function u(){a.removeEventListener("load",l,!1),a.removeEventListener("error",c,!1)}return a.addEventListener("load",l,!1),a.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),s.manager.itemStart(e),a.src=e,a}}class JT extends yf{constructor(e){super(e)}load(e,n,i,r){const s=new kt,o=new ZT(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(e,function(a){s.image=a,s.needsUpdate=!0,n!==void 0&&n(s)},i,r),s}}class Xv extends Gt{constructor(e,n=1){super(),this.isLight=!0,this.type="Light",this.color=new ge(e),this.intensity=n}dispose(){}copy(e,n){return super.copy(e,n),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const n=super.toJSON(e);return n.object.color=this.color.getHex(),n.object.intensity=this.intensity,this.groundColor!==void 0&&(n.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(n.object.distance=this.distance),this.angle!==void 0&&(n.object.angle=this.angle),this.decay!==void 0&&(n.object.decay=this.decay),this.penumbra!==void 0&&(n.object.penumbra=this.penumbra),this.shadow!==void 0&&(n.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(n.object.target=this.target.uuid),n}}const Eu=new nt,Xm=new D,Km=new D;class QT{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new je(512,512),this.map=null,this.mapPass=null,this.matrix=new nt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new mf,this._frameExtents=new je(1,1),this._viewportCount=1,this._viewports=[new rt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const n=this.camera,i=this.matrix;Xm.setFromMatrixPosition(e.matrixWorld),n.position.copy(Xm),Km.setFromMatrixPosition(e.target.matrixWorld),n.lookAt(Km),n.updateMatrixWorld(),Eu.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Eu),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Eu)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Ym=new nt,xo=new D,wu=new D;class e2 extends QT{constructor(){super(new xn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new je(4,2),this._viewportCount=6,this._viewports=[new rt(2,1,1,1),new rt(0,1,1,1),new rt(3,1,1,1),new rt(1,1,1,1),new rt(3,0,1,1),new rt(1,0,1,1)],this._cubeDirections=[new D(1,0,0),new D(-1,0,0),new D(0,0,1),new D(0,0,-1),new D(0,1,0),new D(0,-1,0)],this._cubeUps=[new D(0,1,0),new D(0,1,0),new D(0,1,0),new D(0,1,0),new D(0,0,1),new D(0,0,-1)]}updateMatrices(e,n=0){const i=this.camera,r=this.matrix,s=e.distance||i.far;s!==i.far&&(i.far=s,i.updateProjectionMatrix()),xo.setFromMatrixPosition(e.matrixWorld),i.position.copy(xo),wu.copy(i.position),wu.add(this._cubeDirections[n]),i.up.copy(this._cubeUps[n]),i.lookAt(wu),i.updateMatrixWorld(),r.makeTranslation(-xo.x,-xo.y,-xo.z),Ym.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ym)}}class t2 extends Xv{constructor(e,n,i=0,r=2){super(e,n),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=r,this.shadow=new e2}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,n){return super.copy(e,n),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class n2 extends Xv{constructor(e,n){super(e,n),this.isAmbientLight=!0,this.type="AmbientLight"}}const qm=new nt;class i2{constructor(e,n,i=0,r=1/0){this.ray=new xc(e,n),this.near=i,this.far=r,this.camera=null,this.layers=new pf,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,n){this.ray.set(e,n)}setFromCamera(e,n){n.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(n.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(n).sub(this.ray.origin).normalize(),this.camera=n):n.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(n.near+n.far)/(n.near-n.far)).unproject(n),this.ray.direction.set(0,0,-1).transformDirection(n.matrixWorld),this.camera=n):console.error("THREE.Raycaster: Unsupported camera type: "+n.type)}setFromXRController(e){return qm.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(qm),this}intersectObject(e,n=!0,i=[]){return ah(e,this,i,n),i.sort($m),i}intersectObjects(e,n=!0,i=[]){for(let r=0,s=e.length;r<s;r++)ah(e[r],this,i,n);return i.sort($m),i}}function $m(t,e){return t.distance-e.distance}function ah(t,e,n,i){let r=!0;if(t.layers.test(e.layers)&&t.raycast(e,n)===!1&&(r=!1),r===!0&&i===!0){const s=t.children;for(let o=0,a=s.length;o<a;o++)ah(s[o],e,n,!0)}}class ol{constructor(e=1,n=0,i=0){return this.radius=e,this.phi=n,this.theta=i,this}set(e,n,i){return this.radius=e,this.phi=n,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,n,i){return this.radius=Math.sqrt(e*e+n*n+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(Zt(n/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:sf}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=sf);const r2=[{id:"10",name:"Sun",category:"star",orderFromSun:0,physical:{meanRadiusKm:695700,equatorialRadiusKm:695700,polarRadiusKm:695700,flattening:0,massKg:19885e26,gmKm3S2:1327124400419394e-4,rotationPeriodHours:609.12,axialTiltDeg:7.25,meanTemperatureK:5778,spectralType:"G2V",colorHex:"#ffdd77"},orbit:{semiMajorAxisKm:0,semiMajorAxisAU:0,eccentricity:0,inclinationDeg:0,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:0,orbitalPeriodDays:0},description:"Yellow dwarf star (G2V) at the gravitational center of the Solar System, containing 99.86% of the system’s total mass."},{id:"199",name:"Mercury",category:"planet",orderFromSun:1,physical:{meanRadiusKm:2439.7,equatorialRadiusKm:2439.7,polarRadiusKm:2439.7,flattening:0,massKg:33011e19,gmKm3S2:22031.78,rotationPeriodHours:1407.6,axialTiltDeg:.034,meanTemperatureK:440,colorHex:"#9c968f"},orbit:{semiMajorAxisKm:57909050,semiMajorAxisAU:.387098,eccentricity:.20563,inclinationDeg:7.005,longitudeAscendingNodeDeg:48.331,argumentPeriapsisDeg:29.124,meanAnomalyAtEpochDeg:174.796,orbitalPeriodDays:87.969},description:"Smallest planet, heavily cratered with silicate crust and large iron core; lacks a substantial atmosphere."},{id:"299",name:"Venus",category:"planet",orderFromSun:2,physical:{meanRadiusKm:6051.8,equatorialRadiusKm:6051.8,polarRadiusKm:6051.8,flattening:0,massKg:48675e20,gmKm3S2:324858.59,rotationPeriodHours:-5832.5,axialTiltDeg:177.36,meanTemperatureK:737,colorHex:"#e3bb7b"},orbit:{semiMajorAxisKm:108208e3,semiMajorAxisAU:.723332,eccentricity:.006772,inclinationDeg:3.39458,longitudeAscendingNodeDeg:76.68,argumentPeriapsisDeg:54.884,meanAnomalyAtEpochDeg:50.115,orbitalPeriodDays:224.701},description:"Terrestrial planet shrouded in dense carbon dioxide atmosphere and sulfuric acid clouds with runaway greenhouse effect."},{id:"399",name:"Earth",category:"planet",orderFromSun:3,physical:{meanRadiusKm:6371,equatorialRadiusKm:6378.137,polarRadiusKm:6356.752,flattening:.003353,massKg:59722e20,gmKm3S2:398600.4418,rotationPeriodHours:23.9344,axialTiltDeg:23.439,meanTemperatureK:288,colorHex:"#4b75a1"},orbit:{semiMajorAxisKm:149598023,semiMajorAxisAU:1,eccentricity:.0167086,inclinationDeg:5e-5,longitudeAscendingNodeDeg:-11.26064,argumentPeriapsisDeg:114.20783,meanAnomalyAtEpochDeg:358.617,orbitalPeriodDays:365.256},description:"Dense rocky world featuring liquid surface water, active plate tectonics, oxygen-rich atmosphere, and planetary biosphere."},{id:"499",name:"Mars",category:"planet",orderFromSun:4,physical:{meanRadiusKm:3389.5,equatorialRadiusKm:3396.2,polarRadiusKm:3376.2,flattening:.00589,massKg:64171e19,gmKm3S2:42828.375,rotationPeriodHours:24.6229,axialTiltDeg:25.19,meanTemperatureK:210,colorHex:"#c16138"},orbit:{semiMajorAxisKm:227939200,semiMajorAxisAU:1.523679,eccentricity:.0934,inclinationDeg:1.85,longitudeAscendingNodeDeg:49.558,argumentPeriapsisDeg:286.502,meanAnomalyAtEpochDeg:19.373,orbitalPeriodDays:686.98},description:"Cold desert world with iron-oxide regolith, giant shield volcanoes (Olympus Mons), rift canyon Valles Marineris, and polar ice caps."},{id:"599",name:"Jupiter",category:"planet",orderFromSun:5,physical:{meanRadiusKm:69911,equatorialRadiusKm:71492,polarRadiusKm:66854,flattening:.06487,massKg:18982e23,gmKm3S2:12668653492e-2,rotationPeriodHours:9.925,axialTiltDeg:3.13,meanTemperatureK:165,colorHex:"#c8a679"},orbit:{semiMajorAxisKm:77857e4,semiMajorAxisAU:5.2044,eccentricity:.048498,inclinationDeg:1.303,longitudeAscendingNodeDeg:100.464,argumentPeriapsisDeg:273.867,meanAnomalyAtEpochDeg:20.02,orbitalPeriodDays:4332.589},description:"Largest planet; hydrogen-helium gas giant displaying zonal atmospheric jet streams, turbulent vortices, and the Great Red Spot."},{id:"699",name:"Saturn",category:"planet",orderFromSun:6,physical:{meanRadiusKm:58232,equatorialRadiusKm:60268,polarRadiusKm:54364,flattening:.09796,massKg:56834e22,gmKm3S2:379311879e-1,rotationPeriodHours:10.656,axialTiltDeg:26.73,meanTemperatureK:134,colorHex:"#dfcf9f"},orbit:{semiMajorAxisKm:143353e4,semiMajorAxisAU:9.5826,eccentricity:.05555,inclinationDeg:2.485,longitudeAscendingNodeDeg:113.665,argumentPeriapsisDeg:339.392,meanAnomalyAtEpochDeg:317.02,orbitalPeriodDays:10759.22},description:"Gas giant celebrated for its extensive, brilliant ring system consisting of water ice particles, dust, and rock."},{id:"799",name:"Uranus",category:"planet",orderFromSun:7,physical:{meanRadiusKm:25362,equatorialRadiusKm:25559,polarRadiusKm:24973,flattening:.02293,massKg:8681e22,gmKm3S2:57939393e-1,rotationPeriodHours:-17.24,axialTiltDeg:97.77,meanTemperatureK:76,colorHex:"#8fe0ea"},orbit:{semiMajorAxisKm:287246e4,semiMajorAxisAU:19.201,eccentricity:.046381,inclinationDeg:.773,longitudeAscendingNodeDeg:74.006,argumentPeriapsisDeg:96.998,meanAnomalyAtEpochDeg:142.238,orbitalPeriodDays:30685.4},description:"Ice giant composed of water, ammonia, and methane ices; extreme 98° axial tilt results in extreme seasonal variations."},{id:"899",name:"Neptune",category:"planet",orderFromSun:8,physical:{meanRadiusKm:24622,equatorialRadiusKm:24764,polarRadiusKm:24341,flattening:.01708,massKg:102413e21,gmKm3S2:68350995e-1,rotationPeriodHours:16.11,axialTiltDeg:28.32,meanTemperatureK:72,colorHex:"#4b70dd"},orbit:{semiMajorAxisKm:449506e4,semiMajorAxisAU:30.047,eccentricity:.009456,inclinationDeg:1.77,longitudeAscendingNodeDeg:131.784,argumentPeriapsisDeg:273.187,meanAnomalyAtEpochDeg:256.228,orbitalPeriodDays:60189},description:"Outermost major planet; deep azure ice giant driven by violent supersonic winds, methane haze, and high-altitude cirrus clouds."}],s2=[{id:"301",name:"Moon",category:"moon",orderFromSun:3,parentId:"399",parentName:"Earth",physical:{meanRadiusKm:1737.4,equatorialRadiusKm:1738.1,polarRadiusKm:1736,flattening:.0012,massKg:7342e19,gmKm3S2:4902.8,rotationPeriodHours:655.728,axialTiltDeg:6.68,meanTemperatureK:250,colorHex:"#c4c3be"},orbit:{semiMajorAxisKm:384400,semiMajorAxisAU:.00257,eccentricity:.0549,inclinationDeg:5.145,longitudeAscendingNodeDeg:125.08,argumentPeriapsisDeg:318.15,meanAnomalyAtEpochDeg:135.27,orbitalPeriodDays:27.321661},description:"Earth’s only natural satellite; tidally locked with extensive lunar maria basalt plains and impact-cratered anorthositic highlands."},{id:"401",name:"Phobos",category:"moon",orderFromSun:4,parentId:"499",parentName:"Mars",physical:{meanRadiusKm:11.26,equatorialRadiusKm:13,polarRadiusKm:9.1,massKg:10659e12,gmKm3S2:71e-5,rotationPeriodHours:7.654,axialTiltDeg:0,colorHex:"#8b847d"},orbit:{semiMajorAxisKm:9376,semiMajorAxisAU:627e-7,eccentricity:.0151,inclinationDeg:1.093,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:180,orbitalPeriodDays:.31891},description:"Innermost and largest moon of Mars; heavily cratered irregular body featuring the massive Stickney impact crater, orbiting inside synchronous orbit."},{id:"402",name:"Deimos",category:"moon",orderFromSun:4,parentId:"499",parentName:"Mars",physical:{meanRadiusKm:6.2,massKg:14762e11,rotationPeriodHours:30.31,axialTiltDeg:0,colorHex:"#999186"},orbit:{semiMajorAxisKm:23463,semiMajorAxisAU:1568e-7,eccentricity:33e-5,inclinationDeg:.93,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:45,orbitalPeriodDays:1.263},description:"Outermost moon of Mars; smooth-looking irregular body coated in a thick regolith blanket that softens surface topography."},{id:"501",name:"Io",category:"moon",orderFromSun:5,parentId:"599",parentName:"Jupiter",physical:{meanRadiusKm:1821.5,massKg:89319e18,gmKm3S2:5959.91,rotationPeriodHours:42.456,axialTiltDeg:0,meanTemperatureK:130,colorHex:"#e5c158"},orbit:{semiMajorAxisKm:421700,semiMajorAxisAU:.002819,eccentricity:.0041,inclinationDeg:.05,longitudeAscendingNodeDeg:43.8,argumentPeriapsisDeg:84.1,meanAnomalyAtEpochDeg:200,orbitalPeriodDays:1.769138},description:"Most volcanically active body in the Solar System, driven by tidal friction from orbital resonance with Europa and Ganymede; coated in sulfur and sulfur dioxide."},{id:"502",name:"Europa",category:"moon",orderFromSun:5,parentId:"599",parentName:"Jupiter",physical:{meanRadiusKm:1560.8,massKg:47998e18,gmKm3S2:3202.73,rotationPeriodHours:85.224,axialTiltDeg:.1,meanTemperatureK:102,colorHex:"#c7bfae"},orbit:{semiMajorAxisKm:670900,semiMajorAxisAU:.004485,eccentricity:.009,inclinationDeg:.47,longitudeAscendingNodeDeg:219.1,argumentPeriapsisDeg:66.8,meanAnomalyAtEpochDeg:120,orbitalPeriodDays:3.551181},description:"Smooth, brilliant water-ice crust fractured by tectonic lineae and cycloids; harbors a deep global subsurface liquid water ocean with astrobiological potential."},{id:"503",name:"Ganymede",category:"moon",orderFromSun:5,parentId:"599",parentName:"Jupiter",physical:{meanRadiusKm:2631.2,massKg:14819e19,gmKm3S2:9887.83,rotationPeriodHours:171.72,axialTiltDeg:.2,meanTemperatureK:110,colorHex:"#8e8379"},orbit:{semiMajorAxisKm:1070400,semiMajorAxisAU:.007155,eccentricity:.0013,inclinationDeg:.2,longitudeAscendingNodeDeg:63.5,argumentPeriapsisDeg:192.4,meanAnomalyAtEpochDeg:60,orbitalPeriodDays:7.154553},description:"Largest natural satellite in the Solar System (larger than Mercury); only known moon with its own intrinsic magnetic field generated by a liquid iron core."},{id:"504",name:"Callisto",category:"moon",orderFromSun:5,parentId:"599",parentName:"Jupiter",physical:{meanRadiusKm:2410.3,massKg:10759e19,gmKm3S2:7179.29,rotationPeriodHours:400.536,axialTiltDeg:0,meanTemperatureK:134,colorHex:"#696057"},orbit:{semiMajorAxisKm:1882700,semiMajorAxisAU:.012585,eccentricity:.0074,inclinationDeg:.28,longitudeAscendingNodeDeg:298.8,argumentPeriapsisDeg:52.6,meanAnomalyAtEpochDeg:10,orbitalPeriodDays:16.689018},description:"Ancient, intensely cratered ice-rock moon; lacks tidal resonance heating, preserving the most heavily cratered surface in the Solar System (including Valhalla impact basin)."},{id:"601",name:"Mimas",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:198.2,massKg:37493e15,rotationPeriodHours:22.6,colorHex:"#b2b2b2"},orbit:{semiMajorAxisKm:185520,semiMajorAxisAU:.00124,eccentricity:.0202,inclinationDeg:1.574,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:90,orbitalPeriodDays:.942422},description:"Dominated by the 130 km Herschel impact crater, giving it a distinctive Death Star appearance; clearing agent for the Cassini Division."},{id:"602",name:"Enceladus",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:252.1,massKg:10802e16,gmKm3S2:7.21,rotationPeriodHours:32.88,colorHex:"#ffffff"},orbit:{semiMajorAxisKm:238029,semiMajorAxisAU:.001591,eccentricity:.0047,inclinationDeg:.019,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:180,orbitalPeriodDays:1.370218},description:'High-albedo icy world with active cryovolcanic geysers erupting water vapor, organic molecules, and ice crystals from south polar "tiger stripe" fractures.'},{id:"603",name:"Tethys",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:531,massKg:61745e16,rotationPeriodHours:45.31,colorHex:"#d8d8d8"},orbit:{semiMajorAxisKm:294660,semiMajorAxisAU:.00197,eccentricity:1e-4,inclinationDeg:1.12,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:270,orbitalPeriodDays:1.887802},description:"Low-density water-ice satellite featuring the vast Odysseus impact crater and the enormous Ithaca Chasma canyon system spanning 2,000 km."},{id:"604",name:"Dione",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:561.4,massKg:10955e17,rotationPeriodHours:65.69,colorHex:"#cac8c5"},orbit:{semiMajorAxisKm:377400,semiMajorAxisAU:.002523,eccentricity:.0022,inclinationDeg:.019,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:45,orbitalPeriodDays:2.736915},description:"Icy moon displaying bright wispy ice cliffs (chasmata) formed by extensional tectonic fractures across its trailing hemisphere."},{id:"605",name:"Rhea",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:763.5,massKg:23065e17,rotationPeriodHours:108.43,colorHex:"#bbb8b4"},orbit:{semiMajorAxisKm:527040,semiMajorAxisAU:.003523,eccentricity:.00125,inclinationDeg:.345,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:160,orbitalPeriodDays:4.5175},description:"Second-largest moon of Saturn; heavily cratered ice body with homogeneous interior composition and tenuous oxygen-carbon dioxide exosphere."},{id:"606",name:"Titan",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:2574.8,equatorialRadiusKm:2574.8,polarRadiusKm:2574.8,flattening:0,massKg:13452e19,gmKm3S2:8978.14,rotationPeriodHours:382.68,axialTiltDeg:0,meanTemperatureK:94,colorHex:"#e5a84b",atmosphere:{surfacePressureBar:1.45,composition:[{gas:"N2",percentage:95},{gas:"CH4",percentage:4.9}]}},orbit:{semiMajorAxisKm:1221870,semiMajorAxisAU:.008168,eccentricity:.0288,inclinationDeg:.3485,longitudeAscendingNodeDeg:28,argumentPeriapsisDeg:180,meanAnomalyAtEpochDeg:240,orbitalPeriodDays:15.945421},description:"Second-largest moon in the Solar System, enveloped by a dense nitrogen-methane atmosphere supporting active liquid methane/ethane lakes, rivers, and rain hydrologic cycles."},{id:"607",name:"Hyperion",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:135,massKg:56199e14,rotationPeriodHours:300,colorHex:"#9c8c7c"},orbit:{semiMajorAxisKm:1481100,semiMajorAxisAU:.0099,eccentricity:.123,inclinationDeg:.568,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:110,orbitalPeriodDays:21.276609},description:"Sponge-like irregularly shaped moon with low density (high porosity) undergoing non-repeating chaotic rotation influenced by Titan."},{id:"608",name:"Iapetus",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:734.3,massKg:18056e17,rotationPeriodHours:1903.92,colorHex:"#847970"},orbit:{semiMajorAxisKm:3561300,semiMajorAxisAU:.023806,eccentricity:.0286,inclinationDeg:15.47,longitudeAscendingNodeDeg:75.6,argumentPeriapsisDeg:275.8,meanAnomalyAtEpochDeg:300,orbitalPeriodDays:79.330183},description:"Two-tone world with extreme albedo dichotomy (pitch-black Cassini Regio leading hemisphere and brilliant ice trailing hemisphere), plus a towering 20 km equatorial ridge."},{id:"705",name:"Miranda",category:"moon",orderFromSun:7,parentId:"799",parentName:"Uranus",physical:{meanRadiusKm:235.8,massKg:659e17,rotationPeriodHours:33.91,colorHex:"#a0a0a0"},orbit:{semiMajorAxisKm:129900,semiMajorAxisAU:868e-6,eccentricity:.0013,inclinationDeg:4.232,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:15,orbitalPeriodDays:1.413479},description:"Exhibits extreme, chaotic terrain with gigantic tectonic rift grabens and chevron-shaped coronae, including Verona Rupes (tallest cliff in the Solar System at 20 km)."},{id:"701",name:"Ariel",category:"moon",orderFromSun:7,parentId:"799",parentName:"Uranus",physical:{meanRadiusKm:578.9,massKg:1251e18,rotationPeriodHours:60.48,colorHex:"#b4b4b4"},orbit:{semiMajorAxisKm:191020,semiMajorAxisAU:.001277,eccentricity:.0012,inclinationDeg:.26,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:75,orbitalPeriodDays:2.520379},description:"Brightest moon of Uranus; dissected by extensive interconnected fault scarps, deep graben valleys, and cryovolcanic flows."},{id:"702",name:"Umbriel",category:"moon",orderFromSun:7,parentId:"799",parentName:"Uranus",physical:{meanRadiusKm:584.7,massKg:1275e18,rotationPeriodHours:99.46,colorHex:"#737373"},orbit:{semiMajorAxisKm:266e3,semiMajorAxisAU:.001778,eccentricity:.0039,inclinationDeg:.205,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:190,orbitalPeriodDays:4.144177},description:"Darkest and most heavily cratered of Uranus’s large satellites, marked by the mysterious bright fluorescent ring floor of crater Wunda."},{id:"703",name:"Titania",category:"moon",orderFromSun:7,parentId:"799",parentName:"Uranus",physical:{meanRadiusKm:788.9,massKg:342e19,rotationPeriodHours:208.94,colorHex:"#9f9994"},orbit:{semiMajorAxisKm:435910,semiMajorAxisAU:.002914,eccentricity:.0011,inclinationDeg:.34,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:310,orbitalPeriodDays:8.706234},description:"Largest moon of Uranus; fractured by vast canyon systems (Messina Chasma) resulting from internal freezing and expansion of a primordial subsurface ocean."},{id:"704",name:"Oberon",category:"moon",orderFromSun:7,parentId:"799",parentName:"Uranus",physical:{meanRadiusKm:761.4,massKg:3014e18,rotationPeriodHours:323.11,colorHex:"#938c86"},orbit:{semiMajorAxisKm:583520,semiMajorAxisAU:.003901,eccentricity:.0014,inclinationDeg:.058,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:40,orbitalPeriodDays:13.463239},description:"Outermost major moon of Uranus; ancient heavily cratered ice-rock surface featuring prominent impact ray craters filled with dark carbonaceous deposits."},{id:"801",name:"Triton",category:"moon",orderFromSun:8,parentId:"899",parentName:"Neptune",physical:{meanRadiusKm:1352.6,massKg:2139e19,gmKm3S2:1427.6,rotationPeriodHours:-141.048,axialTiltDeg:0,meanTemperatureK:38,colorHex:"#e2cfc4"},orbit:{semiMajorAxisKm:354760,semiMajorAxisAU:.002371,eccentricity:16e-6,inclinationDeg:156.885,longitudeAscendingNodeDeg:177,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:120,orbitalPeriodDays:5.876854},description:"Captured Kuiper Belt dwarf planet orbiting Neptune in a retrograde direction; coldest measured surface in the Solar System (38 K) with nitrogen cryogeysers and cantaloupe terrain."},{id:"999",name:"Pluto",category:"dwarf_planet",orderFromSun:9,physical:{meanRadiusKm:1188.3,equatorialRadiusKm:1188.3,polarRadiusKm:1188.3,flattening:0,massKg:1303e19,gmKm3S2:869.6,rotationPeriodHours:-153.2928,axialTiltDeg:122.53,meanTemperatureK:44,colorHex:"#c79f82"},orbit:{semiMajorAxisKm:590638e4,semiMajorAxisAU:39.482,eccentricity:.2488,inclinationDeg:17.16,longitudeAscendingNodeDeg:110.3,argumentPeriapsisDeg:113.76,meanAnomalyAtEpochDeg:14.53,orbitalPeriodDays:90560},description:'Largest known Kuiper Belt dwarf planet; features the high-albedo nitrogen-ice glacier Sputnik Planitia (the "Heart"), water-ice mountains, and blue atmospheric haze.'},{id:"901",name:"Charon",category:"moon",orderFromSun:9,parentId:"999",parentName:"Pluto",physical:{meanRadiusKm:606,massKg:1586e18,rotationPeriodHours:153.29,colorHex:"#99948e"},orbit:{semiMajorAxisKm:19596,semiMajorAxisAU:131e-6,eccentricity:5e-5,inclinationDeg:.001,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:0,orbitalPeriodDays:6.38723},description:"Mutually tidally locked binary companion to Pluto; features a dark reddish tholin polar hood (Mordor Macula) and massive equatorial tectonic chasms."},{id:"1",name:"Ceres",category:"dwarf_planet",orderFromSun:4.5,physical:{meanRadiusKm:469.7,equatorialRadiusKm:487.3,polarRadiusKm:446,flattening:.0847,massKg:93835e16,gmKm3S2:62.63,rotationPeriodHours:9.074,axialTiltDeg:4,meanTemperatureK:168,colorHex:"#88847e"},orbit:{semiMajorAxisKm:41369e4,semiMajorAxisAU:2.767,eccentricity:.0758,inclinationDeg:10.593,longitudeAscendingNodeDeg:80.33,argumentPeriapsisDeg:73.59,meanAnomalyAtEpochDeg:95.99,orbitalPeriodDays:1680.5},description:"Largest body in the asteroid belt, comprising ~33% of its total mass; differentiated protoplanet with an ice-rich mantle and bright sodium-carbonate salt spots (Cerealia Facula in Occator Crater)."},{id:"4",name:"Vesta",category:"asteroid",orderFromSun:4.3,physical:{meanRadiusKm:261.4,equatorialRadiusKm:286.3,polarRadiusKm:229,flattening:.2,massKg:259e18,rotationPeriodHours:5.342,axialTiltDeg:29,colorHex:"#a39b91"},orbit:{semiMajorAxisKm:35326e4,semiMajorAxisAU:2.361,eccentricity:.0887,inclinationDeg:7.14,longitudeAscendingNodeDeg:103.81,argumentPeriapsisDeg:151.2,meanAnomalyAtEpochDeg:20.86,orbitalPeriodDays:1325.5},description:"Brightest asteroid visible from Earth; preserved basaltic differentiated protoplanet with metallic core, silicate mantle, and enormous south-polar impact crater Rheasilvia."},{id:"2",name:"Pallas",category:"asteroid",orderFromSun:4.6,physical:{meanRadiusKm:256.5,massKg:205e18,rotationPeriodHours:7.813,axialTiltDeg:84,colorHex:"#827f7a"},orbit:{semiMajorAxisKm:41475e4,semiMajorAxisAU:2.772,eccentricity:.231,inclinationDeg:34.841,longitudeAscendingNodeDeg:173.08,argumentPeriapsisDeg:310.05,meanAnomalyAtEpochDeg:58.74,orbitalPeriodDays:1686},description:"Third-largest asteroid in the belt; notable for its unusually high 34.8° orbital inclination and dynamic golf-ball-like surface topography."},{id:"10",name:"Hygiea",category:"asteroid",orderFromSun:4.8,physical:{meanRadiusKm:203.6,massKg:832e17,rotationPeriodHours:13.825,colorHex:"#605c57"},orbit:{semiMajorAxisKm:4703e5,semiMajorAxisAU:3.144,eccentricity:.117,inclinationDeg:3.842,longitudeAscendingNodeDeg:283.45,argumentPeriapsisDeg:312.31,meanAnomalyAtEpochDeg:145.2,orbitalPeriodDays:2036},description:"Fourth-largest asteroid and major carbonaceous C-type asteroid; nearly spherical body likely formed from a catastrophic impact parent-body disruption."},{id:"16",name:"Psyche",category:"asteroid",orderFromSun:4.7,physical:{meanRadiusKm:111,massKg:229e17,rotationPeriodHours:4.196,axialTiltDeg:95,colorHex:"#b8aba0"},orbit:{semiMajorAxisKm:4374e5,semiMajorAxisAU:2.924,eccentricity:.134,inclinationDeg:3.095,longitudeAscendingNodeDeg:150.06,argumentPeriapsisDeg:228.41,meanAnomalyAtEpochDeg:185,orbitalPeriodDays:1826},description:"Enormous metallic M-type asteroid thought to be the exposed nickel-iron core of an early protoplanet stripped by hit-and-run collisions; target of NASA’s Psyche mission."},{id:"433",name:"Eros",category:"asteroid",orderFromSun:3.5,physical:{meanRadiusKm:8.42,massKg:6687e12,rotationPeriodHours:5.27,colorHex:"#998d7f"},orbit:{semiMajorAxisKm:2175e5,semiMajorAxisAU:1.454,eccentricity:.2227,inclinationDeg:10.828,longitudeAscendingNodeDeg:304.32,argumentPeriapsisDeg:178.82,meanAnomalyAtEpochDeg:315,orbitalPeriodDays:643.2},description:"Elongated peanut-shaped S-type near-Earth asteroid; historic target orbited and landed upon by the NEAR Shoemaker spacecraft in 2001."},{id:"951",name:"Gaspra",category:"asteroid",orderFromSun:4.1,physical:{meanRadiusKm:6.1,massKg:2e16,rotationPeriodHours:7.042,colorHex:"#a09485"},orbit:{semiMajorAxisKm:3306e5,semiMajorAxisAU:2.21,eccentricity:.173,inclinationDeg:4.102,longitudeAscendingNodeDeg:253.2,argumentPeriapsisDeg:129.6,meanAnomalyAtEpochDeg:70,orbitalPeriodDays:1199.7},description:"First asteroid ever visited by a spacecraft (Galileo flyby in 1991); irregular S-type asteroid with prominent groove-like depressions."},{id:"243",name:"Ida",category:"asteroid",orderFromSun:4.6,physical:{meanRadiusKm:15.7,massKg:42e15,rotationPeriodHours:4.634,colorHex:"#9c9284"},orbit:{semiMajorAxisKm:428e6,semiMajorAxisAU:2.861,eccentricity:.046,inclinationDeg:1.138,longitudeAscendingNodeDeg:324,argumentPeriapsisDeg:109.8,meanAnomalyAtEpochDeg:210,orbitalPeriodDays:1768},description:"Coronis-family asteroid visited by Galileo in 1993, famous for the historic discovery of Dactyl, the first recognized asteroid moon."},{id:"101955",name:"Bennu",category:"asteroid",orderFromSun:3.2,physical:{meanRadiusKm:.242,massKg:7329e7,rotationPeriodHours:4.296,colorHex:"#3a3a3a"},orbit:{semiMajorAxisKm:1685e5,semiMajorAxisAU:1.126,eccentricity:.2037,inclinationDeg:6.035,longitudeAscendingNodeDeg:2.06,argumentPeriapsisDeg:66.22,meanAnomalyAtEpochDeg:101.7,orbitalPeriodDays:436.6},description:"Diamond-shaped carbonaceous rubble-pile near-Earth asteroid sampled by NASA’s OSIRIS-REx spacecraft, delivering pristine solar nebula samples to Earth in 2023."},{id:"162173",name:"Ryugu",category:"asteroid",orderFromSun:3.3,physical:{meanRadiusKm:.448,massKg:45e10,rotationPeriodHours:7.632,colorHex:"#353535"},orbit:{semiMajorAxisKm:178e6,semiMajorAxisAU:1.19,eccentricity:.1902,inclinationDeg:5.884,longitudeAscendingNodeDeg:251.6,argumentPeriapsisDeg:211.4,meanAnomalyAtEpochDeg:220,orbitalPeriodDays:474.5},description:"Spinning-top shaped Cb-type near-Earth asteroid sampled by JAXA’s Hayabusa2 spacecraft, rich in water-bearing minerals and prebiotic amino acids."}],Tu=[...r2,...s2],Qn=class Qn{static getAllBodies(){return this.bodies}static getBody(e){return this.bodiesById.get(e)||this.bodiesByName.get(e.toLowerCase())}static getParent(e){if(e.parentId)return this.bodiesById.get(e.parentId)}static getMoonsOf(e){const n=this.getBody(e);return n?this.moonsByParentId.get(n.id)||[]:[]}static getByCategory(e){return this.bodies.filter(n=>n.category===e)}static getPlanets(){return this.getByCategory("planet")}static getMoons(){return this.getByCategory("moon")}static getDwarfPlanets(){return this.getByCategory("dwarf_planet")}static getAsteroids(){return this.getByCategory("asteroid")}static search(e){const n=e.trim().toLowerCase();return n?this.bodies.filter(i=>i.name.toLowerCase().includes(n)||i.category.toLowerCase().includes(n)||i.parentName&&i.parentName.toLowerCase().includes(n)||i.description.toLowerCase().includes(n)):this.bodies}static getStats(){return{total:this.bodies.length,stars:this.getByCategory("star").length,planets:this.getPlanets().length,moons:this.getMoons().length,dwarfPlanets:this.getDwarfPlanets().length,asteroids:this.getAsteroids().length}}};te(Qn,"bodies",Tu),te(Qn,"bodiesById",new Map(Tu.map(e=>[e.id,e]))),te(Qn,"bodiesByName",new Map(Tu.map(e=>[e.name.toLowerCase(),e]))),te(Qn,"moonsByParentId",new Map),(()=>{for(const e of Qn.bodies)e.parentId&&(Qn.moonsByParentId.has(e.parentId)||Qn.moonsByParentId.set(e.parentId,[]),Qn.moonsByParentId.get(e.parentId).push(e))})();let gn=Qn;class To{static getTexture(e){if(this.cache.has(e))return this.cache.get(e);let n;switch(e){case"Sun":n=this.createSunTexture();break;case"Mercury":n=this.createMercuryTexture();break;case"Venus":n=this.createVenusTexture();break;case"Earth":n=this.createEarthTexture();break;case"EarthClouds":n=this.createEarthCloudsTexture();break;case"Mars":n=this.createMarsTexture();break;case"Jupiter":n=this.createJupiterTexture();break;case"Saturn":n=this.createSaturnTexture();break;case"SaturnRings":n=this.createSaturnRingsTexture();break;case"Uranus":n=this.createUranusTexture();break;case"Neptune":n=this.createNeptuneTexture();break;case"Moon":n=this.createMoonTexture();break;case"Io":n=this.createIoTexture();break;case"Europa":n=this.createEuropaTexture();break;case"Ganymede":n=this.createGanymedeTexture();break;case"Callisto":n=this.createCallistoTexture();break;case"Titan":n=this.createTitanTexture();break;case"Enceladus":n=this.createEnceladusTexture();break;case"Triton":n=this.createTritonTexture();break;case"Pluto":n=this.createPlutoTexture();break;case"Ceres":n=this.createCeresTexture();break;default:n=this.createRockyCrateredTexture(e)}return this.cache.set(e,n),n}static createSunTexture(){const i=document.createElement("canvas");i.width=1024,i.height=512;const r=i.getContext("2d"),s=r.createLinearGradient(0,0,0,512);s.addColorStop(0,"#fff4cc"),s.addColorStop(.5,"#ffbb33"),s.addColorStop(1,"#ff8800"),r.fillStyle=s,r.fillRect(0,0,1024,512);const o=r.getImageData(0,0,1024,512),a=o.data;for(let c=0;c<a.length;c+=4){const u=c/4%1024,h=Math.floor(c/4/1024),f=Math.sin(u*.05)*Math.cos(h*.05),p=Math.sin(u*.12+1.2)*Math.cos(h*.12+.8),_=Math.sin(u*.25)*Math.sin(h*.25),v=f*.5+p*.3+_*.2;a[c]=Math.min(255,Math.max(180,245+v*35)),a[c+1]=Math.min(240,Math.max(120,180+v*55)),a[c+2]=Math.min(180,Math.max(20,60+v*40)),a[c+3]=255}r.putImageData(o,0,0),r.fillStyle="rgba(120, 30, 0, 0.6)";for(let c=0;c<12;c++){const u=(c*85+40)%1024,h=160+c*37%180,f=6+c%5*3;r.beginPath(),r.arc(u,h,f,0,Math.PI*2),r.fill(),r.fillStyle="rgba(60, 10, 0, 0.85)",r.beginPath(),r.arc(u,h,f*.45,0,Math.PI*2),r.fill()}const l=new gt(i);return l.wrapS=vt,l.wrapT=et,l}static createMercuryTexture(){const i=document.createElement("canvas");i.width=1024,i.height=512;const r=i.getContext("2d");r.fillStyle="#78736d",r.fillRect(0,0,1024,512);const s=r.getImageData(0,0,1024,512),o=s.data;for(let l=0;l<o.length;l+=4){const c=l/4%1024,u=Math.floor(l/4/1024),f=120+(Math.sin(c*.08)*Math.cos(u*.08)+Math.sin(c*.2)*Math.sin(u*.2))*18;o[l]=f*.95,o[l+1]=f*.93,o[l+2]=f*.9,o[l+3]=255}r.putImageData(s,0,0);for(let l=0;l<120;l++){const c=(l*79+33)%1024,u=20+l*47%472,h=4+l%15*2;r.fillStyle="rgba(40, 38, 36, 0.4)",r.beginPath(),r.arc(c,u,h,0,Math.PI*2),r.fill(),r.strokeStyle="rgba(210, 205, 200, 0.35)",r.lineWidth=1.5,r.beginPath(),r.arc(c,u,h,Math.PI*.8,Math.PI*1.8),r.stroke()}const a=new gt(i);return a.wrapS=vt,a.wrapT=et,a}static createVenusTexture(){const i=document.createElement("canvas");i.width=1024,i.height=512;const r=i.getContext("2d"),s=r.createLinearGradient(0,0,0,512);s.addColorStop(0,"#f0d8a8"),s.addColorStop(.2,"#ecd096"),s.addColorStop(.5,"#e5c483"),s.addColorStop(.8,"#ecd096"),s.addColorStop(1,"#f0d8a8"),r.fillStyle=s,r.fillRect(0,0,1024,512),r.fillStyle="rgba(215, 180, 110, 0.25)";for(let a=0;a<18;a++){const l=a*28.444444444444443;r.beginPath(),r.moveTo(0,l);for(let c=0;c<=1024;c+=30){const u=Math.sin(c*.015+a)*12+Math.cos(c*.03)*6;r.lineTo(c,l+u)}r.lineTo(1024,l+20),r.lineTo(0,l+20),r.closePath(),r.fill()}const o=new gt(i);return o.wrapS=vt,o.wrapT=et,o}static createEarthTexture(){const i=document.createElement("canvas");i.width=1024,i.height=512;const r=i.getContext("2d");r.fillStyle="#0f274a",r.fillRect(0,0,1024,512);const s=r.createLinearGradient(0,0,0,512);s.addColorStop(0,"rgba(25, 65, 115, 0.4)"),s.addColorStop(.5,"rgba(10, 35, 75, 0.1)"),s.addColorStop(1,"rgba(25, 65, 115, 0.4)"),r.fillStyle=s,r.fillRect(0,0,1024,512),r.fillStyle="#2d5930",r.beginPath(),r.ellipse(1024*.58,512*.38,140,85,.1,0,Math.PI*2),r.ellipse(1024*.53,512*.62,70,95,-.15,0,Math.PI*2),r.fill(),r.beginPath(),r.ellipse(1024*.22,512*.32,95,75,-.2,0,Math.PI*2),r.ellipse(1024*.3,512*.65,60,90,.25,0,Math.PI*2),r.fill(),r.beginPath(),r.ellipse(1024*.82,512*.72,45,35,.1,0,Math.PI*2),r.fill(),r.fillStyle="#9e8548",r.beginPath(),r.ellipse(1024*.52,512*.45,65,30,0,0,Math.PI*2),r.ellipse(1024*.82,512*.72,28,20,0,0,Math.PI*2),r.fill(),r.fillStyle="#f0f6ff",r.beginPath(),r.rect(0,0,1024,28),r.fill(),r.beginPath(),r.rect(0,476,1024,36),r.fill();const o=new gt(i);return o.wrapS=vt,o.wrapT=et,o}static createEarthCloudsTexture(){const i=document.createElement("canvas");i.width=1024,i.height=512;const r=i.getContext("2d");r.clearRect(0,0,1024,512),r.fillStyle="rgba(255, 255, 255, 0.75)";for(let o=0;o<28;o++){const a=(o*65+15)%1024,l=60+o*42%392,c=55+o%7*15,u=18+o%4*6;r.beginPath(),r.ellipse(a,l,c,u,o%5*.2,0,Math.PI*2),r.fill()}const s=new gt(i);return s.wrapS=vt,s.wrapT=et,s}static createMarsTexture(){const i=document.createElement("canvas");i.width=1024,i.height=512;const r=i.getContext("2d");r.fillStyle="#bd532b",r.fillRect(0,0,1024,512),r.fillStyle="rgba(68, 38, 25, 0.45)",r.beginPath(),r.ellipse(1024*.45,512*.52,90,45,.2,0,Math.PI*2),r.ellipse(1024*.75,512*.42,70,50,-.1,0,Math.PI*2),r.ellipse(1024*.15,512*.58,60,35,.15,0,Math.PI*2),r.fill(),r.fillStyle="rgba(165, 80, 45, 0.8)",r.beginPath(),r.arc(1024*.28,512*.45,24,0,Math.PI*2),r.fill(),r.fillStyle="#3a2015",r.beginPath(),r.arc(1024*.28,512*.45,6,0,Math.PI*2),r.fill(),r.fillStyle="#f8f4f0",r.beginPath(),r.ellipse(1024*.5,12,110,12,0,0,Math.PI*2),r.fill(),r.beginPath(),r.ellipse(1024*.5,498,85,14,0,0,Math.PI*2),r.fill();const s=new gt(i);return s.wrapS=vt,s.wrapT=et,s}static createJupiterTexture(){const i=document.createElement("canvas");i.width=1024,i.height=512;const r=i.getContext("2d"),s=["#a88460","#dec8aa","#8f5c35","#f2e2ce","#9e673d","#ebd5be","#82522e","#f5e8da","#916139","#e6cfb8"],o=512/s.length;for(let h=0;h<s.length;h++)r.fillStyle=s[h],r.fillRect(0,h*o,1024,o);for(let h=0;h<s.length;h++){const f=h*o;r.fillStyle=h%2===0?"rgba(80, 45, 20, 0.35)":"rgba(255, 245, 235, 0.35)",r.beginPath(),r.moveTo(0,f);for(let p=0;p<=1024;p+=25){const _=Math.sin(p*.03+h*2)*5+Math.cos(p*.08)*3;r.lineTo(p,f+_)}r.lineTo(1024,f+o*.5),r.lineTo(0,f+o*.5),r.closePath(),r.fill()}const a=1024*.65,l=512*.62,c=r.createRadialGradient(a,l,5,a,l,32);c.addColorStop(0,"#c43d22"),c.addColorStop(.6,"#b5482e"),c.addColorStop(1,"#8f5c35"),r.fillStyle=c,r.beginPath(),r.ellipse(a,l,36,20,-.08,0,Math.PI*2),r.fill(),r.strokeStyle="rgba(255, 255, 255, 0.5)",r.lineWidth=2.5,r.beginPath(),r.ellipse(a+45,l-4,18,9,.1,0,Math.PI*2),r.stroke();const u=new gt(i);return u.wrapS=vt,u.wrapT=et,u}static createSaturnTexture(){const i=document.createElement("canvas");i.width=1024,i.height=512;const r=i.getContext("2d"),s=r.createLinearGradient(0,0,0,512);s.addColorStop(0,"#757c6b"),s.addColorStop(.2,"#ccb98d"),s.addColorStop(.4,"#e8dcba"),s.addColorStop(.5,"#f4ebd2"),s.addColorStop(.6,"#e8dcba"),s.addColorStop(.8,"#ccb98d"),s.addColorStop(1,"#80806a"),r.fillStyle=s,r.fillRect(0,0,1024,512);for(let a=0;a<30;a++){const l=a/30*512;r.fillStyle=a%2===0?"rgba(120, 100, 70, 0.08)":"rgba(255, 250, 240, 0.08)",r.fillRect(0,l,1024,512/30)}const o=new gt(i);return o.wrapS=vt,o.wrapT=et,o}static createSaturnRingsTexture(){const i=document.createElement("canvas");i.width=1024,i.height=64;const r=i.getContext("2d");r.clearRect(0,0,1024,64);const s=r.createLinearGradient(0,0,1024,0);s.addColorStop(0,"rgba(140, 130, 115, 0.0)"),s.addColorStop(.05,"rgba(150, 140, 125, 0.25)"),s.addColorStop(.18,"rgba(160, 150, 130, 0.35)"),s.addColorStop(.2,"rgba(225, 215, 185, 0.85)"),s.addColorStop(.35,"rgba(240, 230, 205, 0.95)"),s.addColorStop(.55,"rgba(230, 220, 195, 0.90)"),s.addColorStop(.57,"rgba(40, 35, 30, 0.02)"),s.addColorStop(.63,"rgba(40, 35, 30, 0.02)"),s.addColorStop(.65,"rgba(215, 205, 180, 0.75)"),s.addColorStop(.8,"rgba(225, 215, 190, 0.80)"),s.addColorStop(.83,"rgba(40, 35, 30, 0.05)"),s.addColorStop(.85,"rgba(220, 210, 185, 0.70)"),s.addColorStop(.95,"rgba(180, 170, 150, 0.35)"),s.addColorStop(1,"rgba(140, 130, 115, 0.0)"),r.fillStyle=s,r.fillRect(0,0,1024,64);const o=new gt(i);return o.wrapS=et,o.wrapT=et,o}static createUranusTexture(){const i=document.createElement("canvas");i.width=512,i.height=256;const r=i.getContext("2d"),s=r.createLinearGradient(0,0,0,256);return s.addColorStop(0,"#75c8d6"),s.addColorStop(.5,"#8ee0ed"),s.addColorStop(1,"#75c8d6"),r.fillStyle=s,r.fillRect(0,0,512,256),new gt(i)}static createNeptuneTexture(){const i=document.createElement("canvas");i.width=1024,i.height=512;const r=i.getContext("2d"),s=r.createLinearGradient(0,0,0,512);s.addColorStop(0,"#2d4aa0"),s.addColorStop(.3,"#3a62cb"),s.addColorStop(.5,"#4a75e6"),s.addColorStop(.7,"#3a62cb"),s.addColorStop(1,"#2d4aa0"),r.fillStyle=s,r.fillRect(0,0,1024,512),r.fillStyle="rgba(25, 40, 110, 0.35)",r.fillRect(0,512*.55,1024,40),r.fillStyle="#1b2c75",r.beginPath(),r.ellipse(1024*.45,512*.58,45,24,0,0,Math.PI*2),r.fill(),r.fillStyle="rgba(235, 245, 255, 0.8)",r.beginPath(),r.ellipse(1024*.45+50,512*.58-10,22,6,.1,0,Math.PI*2),r.fill();const o=new gt(i);return o.wrapS=vt,o.wrapT=et,o}static createMoonTexture(){const i=document.createElement("canvas");i.width=512,i.height=256;const r=i.getContext("2d");r.fillStyle="#aba8a2",r.fillRect(0,0,512,256);const s=r.getImageData(0,0,512,256),o=s.data;for(let c=0;c<o.length;c+=4){const u=(Math.random()-.5)*24;o[c]=Math.max(0,Math.min(255,o[c]+u)),o[c+1]=Math.max(0,Math.min(255,o[c+1]+u)),o[c+2]=Math.max(0,Math.min(255,o[c+2]+u))}r.putImageData(s,0,0);const a=[{x:512*.35,y:256*.35,rx:55,ry:45,color:"#4a4844"},{x:512*.48,y:256*.38,rx:35,ry:30,color:"#4d4a46"},{x:512*.55,y:256*.48,rx:40,ry:32,color:"#494743"},{x:512*.22,y:256*.42,rx:65,ry:60,color:"#52504b"},{x:512*.42,y:256*.55,rx:38,ry:28,color:"#4b4844"},{x:512*.65,y:256*.45,rx:30,ry:25,color:"#504d49"}];for(const c of a){const u=r.createRadialGradient(c.x,c.y,5,c.x,c.y,c.rx);u.addColorStop(0,c.color),u.addColorStop(.85,c.color),u.addColorStop(1,"rgba(171, 168, 162, 0)"),r.fillStyle=u,r.beginPath(),r.ellipse(c.x,c.y,c.rx,c.ry,0,0,Math.PI*2),r.fill()}r.fillStyle="#ffffff",r.beginPath(),r.arc(512*.42,256*.72,4,0,Math.PI*2),r.fill(),r.strokeStyle="rgba(255, 255, 255, 0.25)",r.lineWidth=1;for(let c=0;c<Math.PI*2;c+=.35)r.beginPath(),r.moveTo(512*.42,256*.72),r.lineTo(512*.42+Math.cos(c)*75,256*.72+Math.sin(c)*75),r.stroke();const l=new gt(i);return l.wrapS=vt,l.wrapT=et,l}static createIoTexture(){const i=document.createElement("canvas");i.width=512,i.height=256;const r=i.getContext("2d");r.fillStyle="#e5c158",r.fillRect(0,0,512,256);for(let a=0;a<40;a++){const l=Math.random()*512,c=Math.random()*256,u=10+Math.random()*25;r.fillStyle=Math.random()>.5?"rgba(215, 140, 30, 0.45)":"rgba(245, 230, 150, 0.4)",r.beginPath(),r.arc(l,c,u,0,Math.PI*2),r.fill()}const s=[{x:512*.25,y:256*.45,r:10,color:"#7a1800"},{x:512*.65,y:256*.35,r:14,color:"#2b1005"},{x:512*.45,y:256*.6,r:8,color:"#8c2505"},{x:512*.8,y:256*.55,r:11,color:"#541505"},{x:512*.15,y:256*.7,r:7,color:"#882200"}];for(const a of s)r.strokeStyle="rgba(200, 50, 0, 0.6)",r.lineWidth=3,r.beginPath(),r.arc(a.x,a.y,a.r*2.2,0,Math.PI*2),r.stroke(),r.fillStyle=a.color,r.beginPath(),r.arc(a.x,a.y,a.r,0,Math.PI*2),r.fill();const o=new gt(i);return o.wrapS=vt,o.wrapT=et,o}static createEuropaTexture(){const i=document.createElement("canvas");i.width=1024,i.height=512;const r=i.getContext("2d");r.fillStyle="#f4f6fa",r.fillRect(0,0,1024,512);const s=r.createLinearGradient(0,0,0,512*.25);s.addColorStop(0,"rgba(230, 240, 250, 0.6)"),s.addColorStop(1,"rgba(244, 246, 250, 0.0)"),r.fillStyle=s,r.fillRect(0,0,1024,512*.25);const o=r.createLinearGradient(0,512,0,512*.75);o.addColorStop(0,"rgba(230, 240, 250, 0.6)"),o.addColorStop(1,"rgba(244, 246, 250, 0.0)"),r.fillStyle=o,r.fillRect(0,512*.75,1024,512*.25);for(let h=0;h<35;h++){const f=h*37%1024,p=512*.3+h*29%(512*.4),_=25+h%5*12,v=r.createRadialGradient(f,p,2,f,p,_);v.addColorStop(0,"rgba(225, 232, 240, 0.25)"),v.addColorStop(1,"rgba(244, 246, 250, 0.0)"),r.fillStyle=v,r.beginPath(),r.arc(f,p,_,0,Math.PI*2),r.fill()}const a=[{x:1024*.28,y:512*.45,rx:42,ry:28},{x:1024*.62,y:512*.52,rx:36,ry:24},{x:1024*.45,y:512*.35,rx:30,ry:20},{x:1024*.82,y:512*.42,rx:38,ry:25}];for(const h of a){const f=r.createRadialGradient(h.x,h.y,5,h.x,h.y,h.rx);f.addColorStop(0,"rgba(175, 135, 105, 0.16)"),f.addColorStop(.7,"rgba(160, 125, 98, 0.10)"),f.addColorStop(1,"rgba(244, 246, 250, 0.0)"),r.fillStyle=f,r.beginPath(),r.ellipse(h.x,h.y,h.rx,h.ry,.2,0,Math.PI*2),r.fill()}let l=42;const c=()=>(l=l*16807%2147483647,(l-1)/2147483646);for(let h=0;h<32;h++){const f=c()*1024,p=512*.15+c()*512*.7,_=80+c()*160,v=(c()-.5)*Math.PI*1.4,m=f+Math.cos(v)*(_*.5)+(c()-.5)*40,d=p+Math.sin(v)*(_*.5)+(c()-.5)*40,g=f+Math.cos(v)*_,x=p+Math.sin(v)*_;r.strokeStyle="rgba(155, 115, 90, 0.14)",r.lineWidth=4,r.beginPath(),r.moveTo(f,p),r.quadraticCurveTo(m,d,g,x),r.stroke(),r.strokeStyle="rgba(115, 80, 65, 0.45)",r.lineWidth=1.2,r.beginPath(),r.moveTo(f,p),r.quadraticCurveTo(m,d,g,x),r.stroke(),r.strokeStyle="rgba(255, 255, 255, 0.55)",r.lineWidth=.8,r.beginPath(),r.moveTo(f+1,p+1),r.quadraticCurveTo(m+1,d+1,g+1,x+1),r.stroke()}r.strokeStyle="rgba(130, 95, 78, 0.22)",r.lineWidth=.7;for(let h=0;h<50;h++){const f=c()*1024,p=c()*512,_=30+c()*60,v=c()*Math.PI*2;r.beginPath(),r.moveTo(f,p),r.lineTo(f+Math.cos(v)*_,p+Math.sin(v)*_),r.stroke()}const u=new gt(i);return u.wrapS=vt,u.wrapT=et,u}static createGanymedeTexture(){const i=document.createElement("canvas");i.width=512,i.height=256;const r=i.getContext("2d");r.fillStyle="#6e655c",r.fillRect(0,0,512,256),r.fillStyle="#9c9288";for(let o=0;o<14;o++){const a=(o*20+10)%256;r.fillRect(0,a,512,8+o%4*3)}r.strokeStyle="rgba(230, 230, 230, 0.35)",r.lineWidth=1;for(let o=0;o<256;o+=6)r.beginPath(),r.moveTo(0,o),r.lineTo(512,o+Math.sin(o*.1)*8),r.stroke();const s=new gt(i);return s.wrapS=vt,s.wrapT=et,s}static createCallistoTexture(){const i=document.createElement("canvas");i.width=512,i.height=256;const r=i.getContext("2d");r.fillStyle="#4e4741",r.fillRect(0,0,512,256);for(let l=0;l<180;l++){const c=Math.random()*512,u=Math.random()*256,h=2+Math.random()*8;r.fillStyle="#2f2a26",r.beginPath(),r.arc(c,u,h,0,Math.PI*2),r.fill(),r.strokeStyle="rgba(220, 225, 235, 0.7)",r.lineWidth=1,r.beginPath(),r.arc(c,u,h,0,Math.PI),r.stroke()}const s=512*.45,o=256*.4;r.strokeStyle="rgba(200, 210, 220, 0.4)";for(let l=8;l<=55;l+=7)r.beginPath(),r.arc(s,o,l,0,Math.PI*2),r.stroke();const a=new gt(i);return a.wrapS=vt,a.wrapT=et,a}static createTitanTexture(){const i=document.createElement("canvas");i.width=512,i.height=256;const r=i.getContext("2d"),s=r.createLinearGradient(0,0,0,256);s.addColorStop(0,"#c78028"),s.addColorStop(.2,"#dba046"),s.addColorStop(.5,"#e8b258"),s.addColorStop(.8,"#dba046"),s.addColorStop(1,"#c07820"),r.fillStyle=s,r.fillRect(0,0,512,256),r.fillStyle="rgba(210, 130, 40, 0.2)",r.fillRect(0,256*.35,512,25),r.fillRect(0,256*.6,512,25);const o=new gt(i);return o.wrapS=vt,o.wrapT=et,o}static createEnceladusTexture(){const i=document.createElement("canvas");i.width=512,i.height=256;const r=i.getContext("2d");r.fillStyle="#f6f8fb",r.fillRect(0,0,512,256),r.strokeStyle="#68a0c8",r.lineWidth=2;for(let o=0;o<4;o++){const a=217.6+o*5;r.beginPath(),r.moveTo(512*.3,a),r.bezierCurveTo(512*.45,a+4,512*.55,a-4,512*.7,a),r.stroke()}const s=new gt(i);return s.wrapS=vt,s.wrapT=et,s}static createTritonTexture(){const i=document.createElement("canvas");i.width=512,i.height=256;const r=i.getContext("2d");r.fillStyle="#decac0",r.fillRect(0,0,512,256),r.fillStyle="rgba(165, 135, 125, 0.35)";for(let o=10;o<512;o+=16)for(let a=10;a<256*.6;a+=14)r.beginPath(),r.arc(o+a%8,a,5,0,Math.PI*2),r.fill();r.fillStyle="rgba(50, 40, 35, 0.6)";for(let o=0;o<8;o++){const a=102.4+o*45,l=256*.75+o%3*8;r.beginPath(),r.ellipse(a,l,12,3,.4,0,Math.PI*2),r.fill()}const s=new gt(i);return s.wrapS=vt,s.wrapT=et,s}static createPlutoTexture(){const i=document.createElement("canvas");i.width=512,i.height=256;const r=i.getContext("2d");r.fillStyle="#8f4f35",r.fillRect(0,0,512,256),r.fillStyle="#421f14",r.fillRect(0,256*.5,512*.45,45);const s=512*.62,o=256*.42;r.fillStyle="#f0e6dc",r.beginPath(),r.ellipse(s-16,o,28,35,-.2,0,Math.PI*2),r.fill(),r.ellipse(s+16,o,26,32,.2,0,Math.PI*2),r.fill();const a=new gt(i);return a.wrapS=vt,a.wrapT=et,a}static createCeresTexture(){const i=document.createElement("canvas");i.width=512,i.height=256;const r=i.getContext("2d");r.fillStyle="#6e6962",r.fillRect(0,0,512,256);for(let l=0;l<90;l++){const c=Math.random()*512,u=Math.random()*256,h=2+Math.random()*6;r.fillStyle="#48443e",r.beginPath(),r.arc(c,u,h,0,Math.PI*2),r.fill()}const s=512*.52,o=256*.44;r.fillStyle="#3a3630",r.beginPath(),r.arc(s,o,14,0,Math.PI*2),r.fill(),r.fillStyle="#ffffff",r.beginPath(),r.arc(s,o,3.5,0,Math.PI*2),r.fill();const a=new gt(i);return a.wrapS=vt,a.wrapT=et,a}static createRockyCrateredTexture(e){const r=document.createElement("canvas");r.width=256,r.height=128;const s=r.getContext("2d"),o=e==="Bennu"||e==="Ryugu"||e==="Hygiea",a=e==="Psyche";s.fillStyle=o?"#323232":a?"#948a7e":"#7a746d",s.fillRect(0,0,256,128);for(let c=0;c<50;c++){const u=Math.random()*256,h=Math.random()*128,f=2+Math.random()*5;s.fillStyle=o?"#1a1a1a":"#4e4842",s.beginPath(),s.arc(u,h,f,0,Math.PI*2),s.fill(),s.strokeStyle=o?"#505050":"rgba(200, 195, 185, 0.5)",s.lineWidth=1,s.beginPath(),s.arc(u,h,f,0,Math.PI),s.stroke()}const l=new gt(r);return l.wrapS=vt,l.wrapT=et,l}static createGenericTexture(e){const n=document.createElement("canvas");n.width=64,n.height=64;const i=n.getContext("2d");return i.fillStyle=e,i.fillRect(0,0,64,64),new gt(n)}}te(To,"cache",new Map);const wr=class wr{constructor(){te(this,"loader",new JT);te(this,"customLoader",null);te(this,"cache",new Map);te(this,"inFlightRequests",new Map);te(this,"maxAnisotropy",8);te(this,"baseUrl",(typeof import.meta<"u"&&"/solaris/"||"/").replace(/\/?$/,"/"))}resolveUrl(e){if(!e)return"";if(e.startsWith("http://")||e.startsWith("https://")||e.startsWith("data:")||e.startsWith("blob:"))return e;const n=e.replace(/^(\.\/)+/,"").replace(/^\/+/,"").replace(/\/+/g,"/");return`${this.baseUrl.replace(/\/+$/,"/")}${n}`}static getInstance(){return wr.instance||(wr.instance=new wr),wr.instance}setLoader(e){this.customLoader=e}setBaseUrl(e){this.baseUrl=e.replace(/\/?$/,"/")}setMaxAnisotropy(e){this.maxAnisotropy=Math.max(1,e);for(const n of this.cache.values())n.anisotropy=this.maxAnisotropy,n.needsUpdate=!0}isCached(e){const n=this.resolveUrl(e);return this.cache.has(n)}getCacheSize(){return this.cache.size}evictFromCache(e,n=!1){const i=this.resolveUrl(e),r=this.cache.get(i);return r?(this.cache.delete(i),this.inFlightRequests.delete(i),n&&r.dispose(),!0):!1}clearCache(e=!1){if(e)for(const n of this.cache.values())n.dispose();this.cache.clear(),this.inFlightRequests.clear()}resetForTesting(){this.clearCache(!1),this.customLoader=null,this.baseUrl=(typeof import.meta<"u"&&"/solaris/"||"/").replace(/\/?$/,"/")}loadTexture(e,n=!0,i){const r=this.resolveUrl(e),s=this.cache.get(r);if(s)return s;if(typeof document>"u"&&!this.customLoader){const u=new kt;return u.colorSpace=n?zt:Pn,this.cache.set(r,u),u}const o=this.customLoader||this.loader;let a=!1,l=null;const c=o.load(r,u=>{u.colorSpace=n?zt:Pn,u.generateMipmaps=!0,u.minFilter=ni,u.magFilter=yn,u.anisotropy=this.maxAnisotropy,u.needsUpdate=!0},void 0,u=>{if(a=!0,console.warn(`[TexturePipeline] Fallback activated for ${e} (${r}):`,u),this.cache.delete(r),this.inFlightRequests.delete(r),i&&l)try{const h=To.getTexture(i);h&&h.image&&(l.image=h.image,l.needsUpdate=!0)}catch(h){console.warn("[TexturePipeline] Fallback generation error:",h)}});if(l=c,a&&i)try{const u=To.getTexture(i);u&&u.image&&(l.image=u.image,l.needsUpdate=!0)}catch(u){console.warn("[TexturePipeline] Fallback generation error:",u)}return c.colorSpace=n?zt:Pn,c.generateMipmaps=!0,c.minFilter=ni,c.magFilter=yn,c.anisotropy=this.maxAnisotropy,a||this.cache.set(r,c),c}loadTextureAsync(e,n=!0,i){const r=this.resolveUrl(e),s=this.cache.get(r);if(s)return Promise.resolve(s);const o=this.inFlightRequests.get(r);if(o)return o;if(typeof document>"u"&&!this.customLoader){const l=this.loadTexture(e,n,i);return Promise.resolve(l)}const a=new Promise((l,c)=>{(this.customLoader||this.loader).load(r,h=>{h.colorSpace=n?zt:Pn,h.generateMipmaps=!0,h.minFilter=ni,h.magFilter=yn,h.anisotropy=this.maxAnisotropy,h.needsUpdate=!0,this.cache.set(r,h),this.inFlightRequests.delete(r),l(h)},void 0,h=>{if(this.cache.delete(r),this.inFlightRequests.delete(r),i){console.warn(`[TexturePipeline] Fallback activated for ${e}:`,h);const f=To.getTexture(i);l(f)}else c(h)})});return this.inFlightRequests.set(r,a),a}getPlanetTextures(e){switch(e){case"Sun":return{map:this.loadTexture("/textures/2k_sun.jpg",!0,"Sun"),emissiveMap:this.loadTexture("/textures/2k_sun.jpg",!0,"Sun")};case"Mercury":return{map:this.loadTexture("/textures/2k_mercury.jpg",!0,"Mercury")};case"Venus":return{map:this.loadTexture("/textures/2k_venus_atmosphere.jpg",!0,"Venus")};case"Earth":return{map:this.loadTexture("/textures/2k_earth_daymap.jpg",!0,"Earth"),normalMap:this.loadTexture("/textures/earth_normal_2048.jpg",!1),nightMap:this.loadTexture("/textures/2k_earth_nightmap.jpg",!0),cloudsMap:this.loadTexture("/textures/2k_earth_clouds.jpg",!0,"EarthClouds")};case"Moon":return{map:this.loadTexture("/textures/2k_moon.jpg",!0,"Moon")};case"Mars":return{map:this.loadTexture("/textures/2k_mars.jpg",!0,"Mars")};case"Jupiter":return{map:this.loadTexture("/textures/2k_jupiter.jpg",!0,"Jupiter")};case"Saturn":return{map:this.loadTexture("/textures/2k_saturn.jpg",!0,"Saturn"),ringAlphaMap:this.loadTexture("/textures/2k_saturn_ring_alpha.png",!1,"SaturnRings")};case"Uranus":return{map:this.loadTexture("/textures/2k_uranus.jpg",!0,"Uranus")};case"Neptune":return{map:this.loadTexture("/textures/2k_neptune.jpg",!0,"Neptune")};default:return{map:To.getTexture(e)}}}getMilkyWayTexture(){return this.loadTexture("/textures/gaia_sky.jpg",!0)}};te(wr,"instance");let Jl=wr;class Au{static createPhotosphereMaterial(e){return new Lt({uniforms:{sunTexture:{value:e},time:{value:0}},vertexShader:`
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
      `})}static createCoronaMaterial(e=14){return new Lt({uniforms:{sunCenter:{value:new D(0,0,0)},sunRadius:{value:e},time:{value:0}},vertexShader:`
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
      `,blending:Mi,side:Vt,transparent:!0,depthWrite:!1})}static createProminencesMaterial(){return new Lt({uniforms:{time:{value:0}},vertexShader:`
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
      `,blending:Mi,side:Wn,transparent:!0,depthWrite:!1})}static createProminencesGroup(e){const n=new ri;n.name="solar_prominences";const i=this.createProminencesMaterial();return[{lat:.35,lon:.2,scale:.14,angle:.4},{lat:-.42,lon:1.1,scale:.18,angle:-.3},{lat:.15,lon:2.3,scale:.11,angle:.6},{lat:-.25,lon:3.4,scale:.22,angle:-.5},{lat:.55,lon:4.2,scale:.15,angle:.2},{lat:-.1,lon:5.1,scale:.19,angle:.7},{lat:.4,lon:5.8,scale:.12,angle:-.4}].forEach((s,o)=>{const a=new pa(1,1,32,8),l=a.attributes.position,c=a.attributes.uv,u=s.scale*e*2.2,h=s.scale*e*1.6,f=s.scale*e*.28;for(let y=0;y<l.count;y++){const R=c.getX(y),C=c.getY(y),A=(R-.5)*u,b=Math.sin(R*Math.PI)*h,w=(C-.5)*f;l.setXYZ(y,A,b,w)}a.computeVertexNormals();const p=new Tt(a,i);p.name=`prominence_loop_${o}`;const _=Math.cos(s.lat),v=Math.sin(s.lat),m=e*_*Math.cos(s.lon),d=e*v,g=e*_*Math.sin(s.lon);p.position.set(m,d,g);const x=new D(m,d,g).normalize();p.quaternion.setFromUnitVectors(new D(0,1,0),x),p.rotateOnAxis(new D(0,1,0),s.angle),n.add(p)}),n}}const Kv={Earth:{radiusScale:1.008,rayleighColor:new ge(.24,.52,.92),twilightColor:new ge(.95,.42,.16),density:.65,falloffPower:4.5,mieG:.72},Venus:{radiusScale:1.012,rayleighColor:new ge(.92,.86,.64),twilightColor:new ge(.85,.58,.32),density:1.1,falloffPower:3.5,mieG:.65},Mars:{radiusScale:1.004,rayleighColor:new ge(.65,.55,.5),twilightColor:new ge(.35,.5,.7),density:.12,falloffPower:6,mieG:.55},Uranus:{radiusScale:1.014,rayleighColor:new ge(.48,.85,.82),twilightColor:new ge(.32,.65,.72),density:.75,falloffPower:3.8,mieG:.7},Neptune:{radiusScale:1.014,rayleighColor:new ge(.2,.45,.95),twilightColor:new ge(.15,.3,.75),density:.8,falloffPower:3.8,mieG:.7}};class Zm{static createAtmosphereMaterial(e){const n=Kv[e];return n?new Lt({uniforms:{rayleighColor:{value:n.rayleighColor},twilightColor:{value:n.twilightColor},density:{value:n.density},falloffPower:{value:n.falloffPower},mieG:{value:n.mieG}},vertexShader:`
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
      `,blending:Mi,side:Vt,transparent:!0,depthWrite:!1}):null}}class Jm{static createSurfaceMaterial(e,n,i,r){return new Lt({uniforms:{dayMap:{value:e},normalMap:{value:n||null},nightMap:{value:i||null},cloudsMap:{value:r||null},hasNormalMap:{value:n?1:0},hasNightMap:{value:i?1:0},hasCloudsMap:{value:r?1:0}},vertexShader:`
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
      `})}static createCloudMaterial(e){return new Lt({uniforms:{cloudsMap:{value:e}},vertexShader:`
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
      `,transparent:!0,depthWrite:!1})}}class o2{static createMaterial(e){const{name:n,category:i,map:r,normalMap:s}=e,o=n==="Jupiter"||n==="Saturn"||n==="Uranus"||n==="Neptune",a=n==="Europa"||n==="Enceladus",l=n==="Mercury"||n==="Moon"||i==="asteroid",c=n==="Mars",u=n==="Venus",h=n==="Saturn";return new Lt({uniforms:{map:{value:r},normalMap:{value:s||null},hasNormalMap:{value:s?1:0},isGasGiant:{value:o?1:0},isIcyMoon:{value:a?1:0},isAirlessRocky:{value:l?1:0},isMars:{value:c?1:0},isVenus:{value:u?1:0},isSaturn:{value:h?1:0}},vertexShader:`
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
      `})}}class a2{static getVisualRadius(e){if(e.category==="star")return 48;switch(e.name){case"Jupiter":return 26.9;case"Saturn":return 22.68;case"Uranus":return 9.62;case"Neptune":return 9.32;case"Earth":return 2.4;case"Venus":return 2.28;case"Mars":return 1.28;case"Mercury":return .92;case"Pluto":return .45}if(e.category==="moon"){const n=e.physical.meanRadiusKm;return n<100?.18:n<500?.32:n<1200?.48:n<2e3?.65:.95}if(e.category==="dwarf_planet")return .45;if(e.category==="asteroid"){const n=e.physical.meanRadiusKm;return n<10?.18:n<100?.25:.38}return Math.max(.18,e.physical.meanRadiusKm/6371*2.4)}static getVisualDistance(e){if(e.orderFromSun===0)return 0;const n=e.orbit.semiMajorAxisAU;return 50+Math.pow(n,.58)*65}static createPlanet(e){var C;const n=new ri;n.name=`orbit_pivot_${e.name}`;const i=new ri;i.name=`body_group_${e.name}`,n.add(i);const r=this.getVisualRadius(e),s=this.getVisualDistance(e);i.position.set(s,0,0);const o=Lr.degToRad(e.physical.axialTiltDeg||0);i.rotation.z=o;const l=1-(e.physical.flattening||0),c=e.category==="moon"||e.category==="asteroid",u=new ji(1,c?36:64,c?24:48);if(e.category==="asteroid"||e.category==="moon"&&e.physical.meanRadiusKm<200){const A=u.attributes.position;for(let b=0;b<A.count;b++){const w=A.getX(b),M=A.getY(b),P=A.getZ(b),V=1+.18*Math.sin(w*4)*Math.cos(M*4+P*3);A.setXYZ(b,w*V,M*V,P*V)}u.computeVertexNormals()}const f=Jl.getInstance().getPlanetTextures(e.name);let p,_,v,m,d,g;const x=[];if(e.category==="star"){p=Au.createPhotosphereMaterial(f.map);const A=new ji(2.45,64,48),b=Au.createCoronaMaterial(r),w=new Tt(A,b);w.name="sun_corona",w.scale.set(r,r,r),i.add(w),x.push(w),g=Au.createProminencesGroup(r),i.add(g)}else if(e.name==="Earth"){if(p=Jm.createSurfaceMaterial(f.map,f.normalMap,f.nightMap,f.cloudsMap),f.cloudsMap){const b=new ji(1.016,64,48),w=Jm.createCloudMaterial(f.cloudsMap);v=new Tt(b,w),v.name="earth_clouds",v.renderOrder=2,v.scale.set(r,r,r),i.add(v)}const A=Zm.createAtmosphereMaterial("Earth");if(A){const b=new ji(1.008,64,48);m=new Tt(b,A),m.name="earth_atmosphere",m.renderOrder=3,m.scale.set(r,r,r),i.add(m)}}else{p=o2.createMaterial({name:e.name,category:e.category,map:f.map,normalMap:f.normalMap});const A=Zm.createAtmosphereMaterial(e.name);if(A){const b=((C=Kv[e.name])==null?void 0:C.radiusScale)||1.012,w=new ji(b,48,36);m=new Tt(w,A),m.name=`${e.name.toLowerCase()}_atmosphere`,m.renderOrder=3,m.scale.set(r,r,r),i.add(m)}}const y=new Tt(u,p);if(y.name=`surface_${e.name}`,y.castShadow=e.category!=="star",y.receiveShadow=e.category!=="star",y.scale.set(r,r*l,r),i.add(y),e.name==="Saturn"){const w=new _f(1.32,2.65,128,8),M=w.attributes.position,P=w.attributes.uv;for(let G=0;G<M.count;G++){const J=M.getX(G),W=M.getY(G),L=(Math.sqrt(J*J+W*W)-1.32)/(2.65-1.32);P.setXY(G,L,.5)}P.needsUpdate=!0;const V=f.ringAlphaMap||f.map,B=new Lt({uniforms:{ringMap:{value:V},saturnCenter:{value:new D},saturnRadius:{value:r}},vertexShader:`
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
        `,side:Wn,transparent:!0,depthWrite:!1});d=new Tt(w,B),d.name="saturn_rings",d.rotation.x=Math.PI*.5,d.renderOrder=3,d.scale.set(r,r,r),i.add(d)}let R;if(s>0){const A=[];for(let P=0;P<=128;P++){const V=P/128*Math.PI*2;A.push(new D(Math.cos(V)*s,0,Math.sin(V)*s))}const w=new bt().setFromPoints(A),M=new Xs({color:new ge(e.physical.colorHex||"#555566"),transparent:!0,opacity:.22});R=new ra(w,M),R.name=`orbit_line_${e.name}`,n.add(R)}return{definition:e,pivot:n,bodyGroup:i,surfaceMesh:y,nightMesh:_,cloudMesh:v,atmosphereMesh:m,ringMesh:d,glowMeshes:x.length>0?x:void 0,prominencesGroup:g,orbitLine:R,visualRadius:r,orbitalDistance:s}}}class l2{constructor(e){te(this,"camera");te(this,"lookAtTarget",new D(0,0,0));te(this,"spherical",new ol(680,Math.PI*.3,Math.PI*.25));te(this,"targetSpherical",new ol(680,Math.PI*.3,Math.PI*.25));te(this,"panOffset",new D(0,0,0));te(this,"targetPanOffset",new D(0,0,0));te(this,"focusedObject",null);te(this,"focusDistance",30);te(this,"focusedRadius",2.8);te(this,"transition",null);te(this,"isOrbiting",!1);te(this,"isPanning",!1);te(this,"previousMousePosition",{x:0,y:0});te(this,"activeTouches",new Map);te(this,"initialPinchDist",0);te(this,"initialRadiusOnPinch",0);te(this,"damping",.12);te(this,"domElement");te(this,"onMouseDown",e=>{if(this.transition){this.transition=null;const n=new D().subVectors(this.camera.position,this.lookAtTarget);this.spherical.setFromVector3(n),this.targetSpherical.copy(this.spherical)}e.button===0?e.shiftKey?this.isPanning=!0:this.isOrbiting=!0:e.button===2&&(this.isPanning=!0),this.previousMousePosition={x:e.clientX,y:e.clientY}});te(this,"onMouseUp",()=>{this.isOrbiting=!1,this.isPanning=!1});te(this,"onMouseMove",e=>{if(!this.isOrbiting&&!this.isPanning)return;const n=e.clientX-this.previousMousePosition.x,i=e.clientY-this.previousMousePosition.y;if(this.previousMousePosition={x:e.clientX,y:e.clientY},this.isOrbiting)this.targetSpherical.theta-=n*.005,this.targetSpherical.phi-=i*.005,this.targetSpherical.phi=Math.max(.02,Math.min(Math.PI-.02,this.targetSpherical.phi));else if(this.isPanning){const r=this.spherical.radius*.001,s=new D,o=new D;this.camera.matrixWorld.extractBasis(s,o,new D),this.targetPanOffset.addScaledVector(s,-n*r),this.targetPanOffset.addScaledVector(o,i*r)}});te(this,"onWheel",e=>{e.preventDefault(),this.transition&&(this.transition=null);const n=Math.pow(.95,e.deltaY*.015),i=this.focusedObject?this.focusedRadius*1.15:8,r=4500;this.targetSpherical.radius=Math.max(i,Math.min(r,this.targetSpherical.radius*n))});te(this,"onContextMenu",e=>{e.preventDefault()});te(this,"onTouchStart",e=>{this.transition&&(this.transition=null);for(let n=0;n<e.changedTouches.length;n++){const i=e.changedTouches[n];this.activeTouches.set(i.identifier,{x:i.clientX,y:i.clientY})}if(this.activeTouches.size===2){const n=Array.from(this.activeTouches.values());this.initialPinchDist=Math.hypot(n[0].x-n[1].x,n[0].y-n[1].y),this.initialRadiusOnPinch=this.targetSpherical.radius}});te(this,"onTouchMove",e=>{if(this.activeTouches.size===1&&e.touches.length===1){const n=e.touches[0],i=this.activeTouches.get(n.identifier);if(i){const r=n.clientX-i.x,s=n.clientY-i.y;this.targetSpherical.theta-=r*.006,this.targetSpherical.phi-=s*.006,this.targetSpherical.phi=Math.max(.02,Math.min(Math.PI-.02,this.targetSpherical.phi)),this.activeTouches.set(n.identifier,{x:n.clientX,y:n.clientY})}}else if(this.activeTouches.size>=2&&e.touches.length>=2){const n=[e.touches[0],e.touches[1]],i=Math.hypot(n[0].clientX-n[1].clientX,n[0].clientY-n[1].clientY);if(this.initialPinchDist>0){const r=this.initialPinchDist/i,s=this.focusedObject?this.focusedRadius*1.15:8;this.targetSpherical.radius=Math.max(s,Math.min(4500,this.initialRadiusOnPinch*r))}}});te(this,"onTouchEnd",e=>{for(let n=0;n<e.changedTouches.length;n++)this.activeTouches.delete(e.changedTouches[n].identifier);this.activeTouches.size<2&&(this.initialPinchDist=0)});this.domElement=e,this.camera=new xn(45,e.clientWidth/e.clientHeight,.1,1e5),this.updateCameraPosition(),this.setupEventListeners(e)}updateCameraPosition(){if(this.transition){const s=performance.now()-this.transition.startTime,o=Math.min(1,s/this.transition.durationMs),a=o<.5?16*Math.pow(o,5):1-Math.pow(-2*o+2,5)/2;if(this.camera.position.lerpVectors(this.transition.startPos,this.transition.targetPos,a),this.lookAtTarget.lerpVectors(this.transition.startLookAt,this.transition.targetLookAt,a),this.camera.lookAt(this.lookAtTarget),this.camera.near=Math.max(.02,this.focusedRadius*.05),this.camera.far=Math.max(3e4,this.camera.position.distanceTo(this.lookAtTarget)*25),this.camera.updateProjectionMatrix(),o>=1){this.transition.onComplete&&this.transition.onComplete(),this.transition=null;const l=new D().subVectors(this.camera.position,this.lookAtTarget);this.spherical.setFromVector3(l),this.targetSpherical.copy(this.spherical),this.panOffset.set(0,0,0),this.targetPanOffset.set(0,0,0)}return}this.focusedObject?(this.focusedObject.updateWorldMatrix(!0,!1),this.focusedObject.getWorldPosition(this.lookAtTarget)):this.lookAtTarget.set(0,0,0),this.panOffset.lerp(this.targetPanOffset,this.damping),this.lookAtTarget.add(this.panOffset),this.spherical.theta+=(this.targetSpherical.theta-this.spherical.theta)*this.damping,this.spherical.phi+=(this.targetSpherical.phi-this.spherical.phi)*this.damping,this.spherical.radius+=(this.targetSpherical.radius-this.spherical.radius)*this.damping,this.spherical.phi=Math.max(.02,Math.min(Math.PI-.02,this.spherical.phi));const e=new D().setFromSpherical(this.spherical);this.camera.position.copy(this.lookAtTarget).add(e),this.camera.lookAt(this.lookAtTarget);const n=this.spherical.radius,i=Math.max(.05,n-this.focusedRadius);this.camera.near=Math.max(.02,i*.1),this.camera.far=Math.max(3e4,n*25),this.camera.updateProjectionMatrix()}update(){this.updateCameraPosition()}focusCinematic(e,n,i="",r=1800,s){this.focusedObject=e,this.focusedRadius=n,typeof window<"u"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches&&(r=150),e.updateWorldMatrix(!0,!1);const o=new D;e.getWorldPosition(o);const a=new D().copy(o).negate(),l=a.lengthSq()<1||i==="Sun";l?a.set(0,0,1):a.normalize();let c=2.45;i==="Saturn"?c=3.6:i==="Sun"?c=2.2:i==="Jupiter"?c=2.05:n<1&&(c=2.8);const u=Math.max(2.4,n*c);this.focusDistance=u;const h=new D(-a.z,0,a.x).normalize(),f=new D(0,1,0);let p;l?p=new D(0,.4,1).normalize().multiplyScalar(u):i==="Saturn"?p=new D().copy(a).multiplyScalar(-.45).addScaledVector(h,.55).addScaledVector(f,.55).normalize().multiplyScalar(u):p=new D().copy(a).multiplyScalar(.45).addScaledVector(h,.65).addScaledVector(f,.35).normalize().multiplyScalar(u);const _=new D().copy(o).add(p),v=new ol().setFromVector3(p);this.targetPanOffset.set(0,0,0),this.panOffset.set(0,0,0),this.transition={startPos:this.camera.position.clone(),targetPos:_,startLookAt:this.lookAtTarget.clone(),targetLookAt:o.clone(),startTime:performance.now(),durationMs:r,onComplete:()=>{this.spherical.copy(v),this.targetSpherical.copy(v),s&&s()}}}focusOn(e,n,i=1800){this.focusCinematic(e,n,e.name,i)}resetToOverview(e=1600){this.focusedObject=null,this.focusedRadius=48,this.targetPanOffset.set(0,0,0),this.panOffset.set(0,0,0);const n=new ol(680,Math.PI*.3,Math.PI*.25),i=new D().setFromSpherical(n);this.transition={startPos:this.camera.position.clone(),targetPos:i,startLookAt:this.lookAtTarget.clone(),targetLookAt:new D(0,0,0),startTime:performance.now(),durationMs:e,onComplete:()=>{this.spherical.copy(n),this.targetSpherical.copy(n),this.lookAtTarget.set(0,0,0)}}}setupEventListeners(e){this.domElement=e,e.addEventListener("mousedown",this.onMouseDown),window.addEventListener("mouseup",this.onMouseUp),window.addEventListener("mousemove",this.onMouseMove),e.addEventListener("wheel",this.onWheel,{passive:!1}),e.addEventListener("contextmenu",this.onContextMenu),e.addEventListener("touchstart",this.onTouchStart,{passive:!0}),window.addEventListener("touchmove",this.onTouchMove,{passive:!0}),window.addEventListener("touchend",this.onTouchEnd,{passive:!0})}handleResize(e,n){this.camera.aspect=e/n,this.camera.updateProjectionMatrix()}dispose(){this.domElement&&(this.domElement.removeEventListener("mousedown",this.onMouseDown),this.domElement.removeEventListener("wheel",this.onWheel),this.domElement.removeEventListener("contextmenu",this.onContextMenu),this.domElement.removeEventListener("touchstart",this.onTouchStart)),window.removeEventListener("mouseup",this.onMouseUp),window.removeEventListener("mousemove",this.onMouseMove),window.removeEventListener("touchmove",this.onTouchMove),window.removeEventListener("touchend",this.onTouchEnd)}}const Tr=class Tr{constructor(e=Date.now()){te(this,"currentUtcMs");te(this,"lastPerfTimeMs");te(this,"isPaused",!1);te(this,"timeMultiplier",1);this.currentUtcMs=e,this.lastPerfTimeMs=performance.now()}update(e=performance.now()){const n=e-this.lastPerfTimeMs;if(this.lastPerfTimeMs=e,!this.isPaused&&n>0){const i=n*this.timeMultiplier;this.currentUtcMs+=i}return this.currentUtcMs}getUtcMs(){return this.currentUtcMs}setUtcMs(e){this.currentUtcMs=e,this.lastPerfTimeMs=performance.now()}getIsoString(){return new Date(this.currentUtcMs).toISOString()}getJulianDate(){return Tr.utcMsToJulianDate(this.currentUtcMs)}getJulianCenturiesJ2000(){return(this.getJulianDate()-Tr.J2000_JD)/36525}static utcMsToJulianDate(e){return e/864e5+24405875e-1}static julianDateToUtcMs(e){return(e-24405875e-1)*864e5}resetToJ2000(){this.setUtcMs(Tr.J2000_UTC_MS)}resetToNow(){this.setUtcMs(Date.now())}};te(Tr,"J2000_JD",2451545),te(Tr,"J2000_UTC_MS",946728e6);let Ql=Tr;const Oo=class Oo{static solveKepler(e,n,i=1e-12,r=25){const s=Math.PI*2;e=(e%s+s)%s,e>Math.PI&&(e-=s);let o;if(n<.18)o=e+n*Math.sin(e);else{const a=e<0?-1:1;o=e+a*.85*n}for(let a=0;a<r;a++){const l=o-n*Math.sin(o)-e;if(Math.abs(l)<i)return o;const c=1-n*Math.cos(o);if(Math.abs(c)<1e-15)break;const u=l/c;if(o-=u,Math.abs(u)<i)return o}return o}static propagate(e,n,i=Oo.GM_SUN){const r=e.semiMajorAxisKm,s=e.eccentricity;if(r<=0)return{positionKm:[0,0,0],velocityKmPerSec:[0,0,0],trueAnomalyDeg:0,eccentricAnomalyDeg:0,distanceKm:0,speedKmPerSec:0};const o=Math.sqrt(i/(r*r*r)),a=n*86400,c=e.meanAnomalyAtEpochDeg*Math.PI/180+o*a,u=Oo.solveKepler(c,s),h=Math.sin(u),f=Math.cos(u),p=Math.sqrt(1-s*s)*h/(1-s*f),_=(f-s)/(1-s*f),v=Math.atan2(p,_),m=r*(1-s*f),d=r*(f-s),g=r*Math.sqrt(1-s*s)*h,x=Math.sqrt(i*r)/m,y=-x*h,R=x*Math.sqrt(1-s*s)*f,C=e.inclinationDeg*Math.PI/180,A=e.argumentPeriapsisDeg*Math.PI/180,b=e.longitudeAscendingNodeDeg*Math.PI/180,w=Math.cos(b),M=Math.sin(b),P=Math.cos(C),V=Math.sin(C),B=Math.cos(A),G=Math.sin(A),J=w*B-M*G*P,W=M*B+w*G*P,ee=G*V,L=-w*G-M*B*P,K=-M*G+w*B*P,q=B*V,ae=d*J+g*L,ye=d*W+g*K,Ve=d*ee+g*q,j=y*J+R*L,ne=y*W+R*K,ce=y*ee+R*q,oe=Math.sqrt(j*j+ne*ne+ce*ce);return{positionKm:[ae,ye,Ve],velocityKmPerSec:[j,ne,ce],trueAnomalyDeg:(v*180/Math.PI+360)%360,eccentricAnomalyDeg:(u*180/Math.PI+360)%360,distanceKm:m,speedKmPerSec:oe}}static sampleOrbitPath(e,n=128){const i=[],r=e.semiMajorAxisKm,s=e.eccentricity;if(r<=0)return i;const o=e.inclinationDeg*Math.PI/180,a=e.argumentPeriapsisDeg*Math.PI/180,l=e.longitudeAscendingNodeDeg*Math.PI/180,c=Math.cos(l),u=Math.sin(l),h=Math.cos(o),f=Math.sin(o),p=Math.cos(a),_=Math.sin(a),v=c*p-u*_*h,m=u*p+c*_*h,d=_*f,g=-c*_-u*p*h,x=-u*_+c*p*h,y=p*f,R=r*Math.sqrt(Math.max(0,1-s*s));for(let C=0;C<=n;C++){const A=C/n*Math.PI*2,b=r*(Math.cos(A)-s),w=R*Math.sin(A),M=b*v+w*g,P=b*m+w*x,V=b*d+w*y;i.push([M,P,V])}return i}};te(Oo,"GM_SUN",1327124400419394e-4);let Nr=Oo;const Hi=class Hi{static eclipticToIcrf(e){const[n,i,r]=e,s=Math.cos(Hi.OBLIQUITY_J2000_RAD),o=Math.sin(Hi.OBLIQUITY_J2000_RAD);return[n,i*s-r*o,i*o+r*s]}static icrfToEcliptic(e){const[n,i,r]=e,s=Math.cos(Hi.OBLIQUITY_J2000_RAD),o=Math.sin(Hi.OBLIQUITY_J2000_RAD);return[n,i*s+r*o,-i*o+r*s]}static eclipticToThree(e){return[e[0],e[2],-e[1]]}static threeToEcliptic(e){return[e[0],-e[2],e[1]]}};te(Hi,"OBLIQUITY_J2000_DEG",23.43929111),te(Hi,"OBLIQUITY_J2000_RAD",23.43929111*Math.PI/180);let Es=Hi;const Vi=class Vi{constructor(){te(this,"mode","exploration")}toRenderPosition(e,n){if(this.mode==="scientific"){const u=1/Vi.SCIENTIFIC_KM_PER_UNIT,h=[e[0]*u,e[1]*u,e[2]*u];return Es.eclipticToThree(h)}const i=Math.sqrt(e[0]*e[0]+e[1]*e[1]+e[2]*e[2]);if(i<1e3||!n||n.orderFromSun===0)return[0,0,0];const r=i/Vi.AU_KM,s=50+Math.pow(r,.58)*65,o=e[0]/i,a=e[1]/i,l=e[2]/i,c=[o*s,a*s,l*s];return Es.eclipticToThree(c)}toMoonRenderPosition(e,n,i,r){if(this.mode==="scientific"){const f=1/Vi.SCIENTIFIC_KM_PER_UNIT,p=[e[0]*f,e[1]*f,e[2]*f],_=Es.eclipticToThree(p);return[i[0]+_[0],i[1]+_[1],i[2]+_[2]]}const s=Math.sqrt(e[0]*e[0]+e[1]*e[1]+e[2]*e[2]);if(s<1)return i;const o=e[0]/s,a=e[1]/s,l=e[2]/s,c=Es.eclipticToThree([o,a,l]),h=this.getVisualRadius(r)*(1.35+1.25*Math.log10(1+s/4e4));return[i[0]+c[0]*h,i[1]+c[1]*h,i[2]+c[2]*h]}getVisualRadius(e){if(this.mode==="scientific"){const n=e.physical.meanRadiusKm/Vi.SCIENTIFIC_KM_PER_UNIT;return Math.max(.015,n*4)}if(e.category==="star")return 48;switch(e.name){case"Jupiter":return 26.9;case"Saturn":return 22.68;case"Uranus":return 9.62;case"Neptune":return 9.32;case"Earth":return 2.4;case"Venus":return 2.28;case"Mars":return 1.28;case"Mercury":return .92;case"Pluto":return .45}if(e.category==="moon"){const n=e.physical.meanRadiusKm;return n<100?.18:n<500?.32:n<1200?.48:n<2e3?.65:.95}if(e.category==="dwarf_planet")return .45;if(e.category==="asteroid"){const n=e.physical.meanRadiusKm;return n<10?.18:n<100?.25:.38}return Math.max(.18,e.physical.meanRadiusKm/6371*2.4)}};te(Vi,"SCIENTIFIC_KM_PER_UNIT",1e6),te(Vi,"AU_KM",1495978707e-1);let sa=Vi;class Qm{static createOrbitLine(e,n,i=180){if(e.orderFromSun===0||e.orbit.semiMajorAxisKm<=0)return null;const s=Nr.sampleOrbitPath(e.orbit,i).map(c=>{const u=n.toRenderPosition(c,e);return new D(u[0],u[1],u[2])}),o=new bt().setFromPoints(s),a=new Xs({color:new ge(e.physical.colorHex||"#555566"),transparent:!0,opacity:e.category==="planet"?.3:.18,linewidth:1}),l=new ra(o,a);return l.name=`kepler_orbit_${e.name}`,l}static createMoonOrbitLine(e,n,i,r=96){if(e.orbit.semiMajorAxisKm<=0)return null;const o=Nr.sampleOrbitPath(e.orbit,r).map(u=>{const h=i.toMoonRenderPosition(u,e,[0,0,0],n);return new D(h[0],h[1],h[2])}),a=new bt().setFromPoints(o),l=new Xs({color:new ge(e.physical.colorHex||"#778899"),transparent:!0,opacity:.2,linewidth:1}),c=new ra(a,l);return c.name=`kepler_moon_orbit_${e.name}`,c}}const c2=[[54061,53910],[53910,58001],[58001,59774],[59774,54061],[59774,62956],[62956,65378],[65378,67301],[27989,25336],[27989,27366],[25336,24436],[27366,24436],[25930,26311],[26311,26727],[26727,27989],[25930,25336],[746,3179],[3179,2920],[2920,6686],[6686,8886],[60718,61084],[62434,61932],[102098,100453],[100453,95947],[102488,100453],[100453,97165],[49669,50583],[50583,50335],[50335,48455],[50583,54872],[54872,57632],[57632,49669],[80763,78820],[78820,78401],[80763,82396],[82396,86228],[86228,85927],[32349,30324],[32349,33579],[33579,34444],[34444,35904]];class u2{constructor(){te(this,"mesh");te(this,"meteors",[]);te(this,"positions");te(this,"colors");te(this,"count",5);this.positions=new Float32Array(this.count*2*3),this.colors=new Float32Array(this.count*2*3);for(let i=0;i<this.count;i++)this.meteors.push({active:!1,startPos:new D,dir:new D,speed:380+Math.random()*260,length:28+Math.random()*24,progress:0,cooldown:2+Math.random()*8,color:new ge(Math.random()>.35?14348543:16771266)});const e=new bt;e.setAttribute("position",new Et(this.positions,3)),e.setAttribute("color",new Et(this.colors,3));const n=new Xs({vertexColors:!0,transparent:!0,blending:Mi,depthWrite:!1});this.mesh=new Wv(e,n),this.mesh.name="meteor_streaks",this.mesh.renderOrder=-1}update(e,n){const i=this.mesh.geometry.getAttribute("position"),r=this.mesh.geometry.getAttribute("color");for(let s=0;s<this.count;s++){const o=this.meteors[s],a=s*6,l=s*6+3;if(!o.active)if(o.cooldown-=e,o.cooldown<=0){o.active=!0,o.progress=0,o.speed=360+Math.random()*320,o.length=26+Math.random()*26;const g=Math.random()*Math.PI*2,x=(Math.random()-.5)*180,y=160+Math.random()*240;o.startPos.set(n.x+Math.cos(g)*y,n.y+x,n.z+Math.sin(g)*y);const R=g+Math.PI*.5+(Math.random()-.5)*1.2;o.dir.set(Math.cos(R),(Math.random()-.5)*.45,Math.sin(R)).normalize()}else{this.positions[a]=0,this.positions[a+1]=0,this.positions[a+2]=0,this.positions[l]=0,this.positions[l+1]=0,this.positions[l+2]=0,this.colors[a]=0,this.colors[a+1]=0,this.colors[a+2]=0,this.colors[l]=0,this.colors[l+1]=0,this.colors[l+2]=0;continue}if(o.progress+=o.speed*e/260,o.progress>=1){o.active=!1,o.cooldown=4+Math.random()*9,this.positions[a]=0,this.positions[a+1]=0,this.positions[a+2]=0,this.positions[l]=0,this.positions[l+1]=0,this.positions[l+2]=0,this.colors[a]=0,this.colors[a+1]=0,this.colors[a+2]=0,this.colors[l]=0,this.colors[l+1]=0,this.colors[l+2]=0;continue}const c=o.progress*260,u=o.startPos.x+o.dir.x*c,h=o.startPos.y+o.dir.y*c,f=o.startPos.z+o.dir.z*c,p=Math.max(0,c-o.length),_=o.startPos.x+o.dir.x*p,v=o.startPos.y+o.dir.y*p,m=o.startPos.z+o.dir.z*p;this.positions[a]=u,this.positions[a+1]=h,this.positions[a+2]=f,this.positions[l]=_,this.positions[l+1]=v,this.positions[l+2]=m;const d=Math.sin(o.progress*Math.PI)*.95;this.colors[a]=o.color.r*d*1.6,this.colors[a+1]=o.color.g*d*1.6,this.colors[a+2]=o.color.b*d*1.6,this.colors[l]=o.color.r*d*.12,this.colors[l+1]=o.color.g*d*.12,this.colors[l+2]=o.color.b*d*.12}i.needsUpdate=!0,r.needsUpdate=!0}dispose(){this.mesh.geometry.dispose(),this.mesh.material.dispose()}}const Ar=class Ar{constructor(){te(this,"group",new ri);te(this,"celestialGroup",new ri);te(this,"pointsMesh");te(this,"constellationLines");te(this,"milkyWayMesh");te(this,"stardustMesh");te(this,"meteorSystem");te(this,"isLoaded",!1);this.group.name="starfield_hipparcos",this.group.add(this.celestialGroup),this.celestialGroup.name="celestial_infinite_sphere",this.buildMilkyWayBackground(),this.build3DCosmicStardust(),this.meteorSystem=new u2,this.group.add(this.meteorSystem.mesh),this.loadCatalog()}buildMilkyWayBackground(){const e=new ji(Ar.SPHERE_RADIUS*1.05,64,48),n=Jl.getInstance().getMilkyWayTexture(),i=new Lt({uniforms:{milkyWayMap:{value:n}},vertexShader:`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,fragmentShader:`
        uniform sampler2D milkyWayMap;
        varying vec2 vUv;

        void main() {
          vec4 tex = texture2D(milkyWayMap, vUv);

          // Gentle gamma lift: pulls faint galactic dust and star lanes out of the dark toe of ACESFilmic
          vec3 baseColor = pow(tex.rgb, vec3(0.82));
          float lum = dot(baseColor, vec3(0.299, 0.587, 0.114));

          // Warm golden core enhancement for the galactic bulge
          vec3 coreWarmth = vec3(1.22, 1.08, 0.88);
          float coreMask = smoothstep(0.10, 0.60, lum);

          // Deep interstellar dust enhancement: accentuate dark absorption silhouettes (Great Rift)
          float dustContrast = smoothstep(0.02, 0.22, lum);

          // Subtle H-alpha ionized hydrogen emission nebular wisps (656.3 nm deep ruby/crimson)
          vec3 hAlpha = vec3(0.68, 0.18, 0.32) * smoothstep(0.22, 0.68, tex.r) * 0.42;

          // Subtle O-III oxygen emission teal/cyan wisps
          vec3 oiii = vec3(0.12, 0.46, 0.62) * smoothstep(0.28, 0.78, tex.b) * 0.24;

          // Balanced cosmic color grading
          vec3 cosmicColor = baseColor * mix(vec3(0.96, 0.98, 1.04), coreWarmth, coreMask) * (0.90 + 0.48 * dustContrast) + hAlpha + oiii;

          // Maintain subtle atmospheric depth across deep space void (never crushed to flat black)
          cosmicColor = max(cosmicColor, vec3(0.003, 0.004, 0.008));

          gl_FragColor = vec4(cosmicColor * 1.35, 1.0);

          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
      `,side:Vt,depthWrite:!1});this.milkyWayMesh=new Tt(e,i),this.milkyWayMesh.name="milky_way_skybox",this.milkyWayMesh.renderOrder=-10,this.milkyWayMesh.rotation.x=Lr.degToRad(62.87),this.milkyWayMesh.rotation.y=Lr.degToRad(122.93),this.milkyWayMesh.rotation.z=Lr.degToRad(282.25),this.celestialGroup.add(this.milkyWayMesh)}build3DCosmicStardust(){const n=new Float32Array(8400),i=new Float32Array(2800*3),r=new Float32Array(2800),s=new Float32Array(2800);for(let l=0;l<2800;l++){const c=25+Math.pow(Math.random(),.65)*850,u=Math.random()*Math.PI*2,h=(Math.random()-.5)*(120+c*.15);n[l*3]=Math.cos(u)*c,n[l*3+1]=h,n[l*3+2]=Math.sin(u)*c;const f=Math.random();f<.4?(i[l*3]=.95,i[l*3+1]=.97,i[l*3+2]=1):f<.7?(i[l*3]=1,i[l*3+1]=.88,i[l*3+2]=.65):(i[l*3]=.72,i[l*3+1]=.9,i[l*3+2]=1),r[l]=1.8+Math.random()*2.6,s[l]=Math.random()*Math.PI*2}const o=new bt;o.setAttribute("position",new Et(n,3)),o.setAttribute("color",new Et(i,3)),o.setAttribute("aScale",new Et(r,1)),o.setAttribute("aPhase",new Et(s,1));const a=new Lt({uniforms:{time:{value:0}},vertexShader:`
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
          gl_PointSize = clamp(aScale * (220.0 / dist), 1.2, 5.5);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,fragmentShader:`
        varying vec3 vColor;
        varying float vTwinkle;

        void main() {
          vec2 coord = gl_PointCoord - vec2(0.5);
          float d = length(coord);
          if (d > 0.5) discard;

          float core = exp(-d * d * 22.0);
          float alpha = core * vTwinkle * 0.75;

          gl_FragColor = vec4(vColor * 1.3, alpha);
        }
      `,vertexColors:!0,transparent:!0,blending:Mi,depthWrite:!1});this.stardustMesh=new Mu(o,a),this.stardustMesh.name="cosmic_stardust_motes",this.stardustMesh.renderOrder=-2,this.group.add(this.stardustMesh)}async loadCatalog(){try{const e="/solaris/".replace(/\/?$/,"/"),n=await fetch(`${e}data/stars.json`);if(!n.ok)throw new Error(`Failed to fetch stars.json: HTTP ${n.status}`);const i=await n.json();this.buildStarfieldMesh(i),this.buildConstellations(i),this.isLoaded=!0}catch(e){console.warn("Could not stream Hipparcos stars dataset, using procedural fallback:",e),this.buildProceduralFallback()}}buildStarfieldMesh(e){const n=e.stars.filter(f=>f[4]<=6.2),i=n.length,r=new Float32Array(i*3),s=new Float32Array(i*3),o=new Float32Array(i),a=Ar.SPHERE_RADIUS;for(let f=0;f<i;f++){const p=n[f],_=p[1],v=p[2],m=p[3],d=p[4],g=p[5];r[f*3]=_*a,r[f*3+1]=m*a,r[f*3+2]=-v*a;const x=this.bvToRGB(g,p[8]);s[f*3]=x.r,s[f*3+1]=x.g,s[f*3+2]=x.b;const y=Math.max(.8,4.4-.58*d);o[f]=y}const l=new bt;l.setAttribute("position",new Et(r,3)),l.setAttribute("color",new Et(s,3)),l.setAttribute("size",new Et(o,1));const c=`
      attribute float size;
      varying vec3 vColor;
      varying float vBrightness;

      void main() {
        vColor = color;
        vBrightness = size;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = clamp(size, 0.8, 8.0);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,u=`
      varying vec3 vColor;
      varying float vBrightness;

      void main() {
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        if (dist > 0.5) discard;

        float core = exp(-dist * dist * 38.0);
        float halo = smoothstep(0.5, 0.05, dist) * 0.18;

        float spikes = 0.0;
        if (vBrightness > 3.6) {
          float crossX = exp(-abs(coord.y) * 45.0) * max(0.0, 1.0 - abs(coord.x) * 2.0);
          float crossY = exp(-abs(coord.x) * 45.0) * max(0.0, 1.0 - abs(coord.y) * 2.0);
          spikes = max(crossX, crossY) * 0.35;
        }

        float alpha = clamp(core + halo + spikes, 0.0, 1.0) * clamp(vBrightness * 0.28, 0.2, 0.95);
        gl_FragColor = vec4(vColor * 1.25, alpha);
      }
    `,h=new Lt({vertexShader:c,fragmentShader:u,vertexColors:!0,transparent:!0,blending:Mi,depthWrite:!1});this.pointsMesh=new Mu(l,h),this.pointsMesh.renderOrder=0,this.celestialGroup.add(this.pointsMesh)}buildConstellations(e){const n=new Map,i=Ar.SPHERE_RADIUS*.998;for(const a of e.stars){const l=a[0],c=a[1]*i,u=a[3]*i,h=-a[2]*i;n.set(l,[c,u,h])}const r=[];for(const[a,l]of c2){const c=n.get(a),u=n.get(l);c&&u&&(r.push(c[0],c[1],c[2]),r.push(u[0],u[1],u[2]))}if(r.length===0)return;const s=new bt;s.setAttribute("position",new Dt(r,3));const o=new Xs({color:5231045,transparent:!0,opacity:.38,depthWrite:!1,blending:Mi});this.constellationLines=new Wv(s,o),this.constellationLines.name="constellation_lines",this.celestialGroup.add(this.constellationLines)}bvToRGB(e,n){if(e!==null)return e<-.1?new ge(10335487):e<.15?new ge(12374783):e<.35?new ge(15791359):e<.6?new ge(16775144):e<.85?new ge(16770723):e<1.3?new ge(16760437):new ge(16747093);switch(n){case"O":return new ge(10335487);case"B":return new ge(12374783);case"A":return new ge(15791359);case"F":return new ge(16775144);case"G":return new ge(16770723);case"K":return new ge(16760437);case"M":return new ge(16747093);default:return new ge(16777215)}}buildProceduralFallback(){const n=new bt,i=new Float32Array(6e3*3),r=new Float32Array(6e3*3),s=Ar.SPHERE_RADIUS;for(let a=0;a<6e3;a++){const l=Math.random()*Math.PI*2,c=Math.acos(Math.random()*2-1);i[a*3]=s*Math.sin(c)*Math.cos(l),i[a*3+1]=s*Math.cos(c),i[a*3+2]=s*Math.sin(c)*Math.sin(l),r[a*3]=.9,r[a*3+1]=.92,r[a*3+2]=1}n.setAttribute("position",new Et(i,3)),n.setAttribute("color",new Et(r,3));const o=new jv({size:2.5,vertexColors:!0,transparent:!0,opacity:.85});this.pointsMesh=new Mu(n,o),this.celestialGroup.add(this.pointsMesh)}update(e,n){var i;if(this.celestialGroup.position.copy(e),this.stardustMesh){const r=this.stardustMesh.material;(i=r.uniforms)!=null&&i.time&&(r.uniforms.time.value+=n)}this.meteorSystem&&this.meteorSystem.update(n,e)}setConstellationsVisible(e){this.constellationLines&&(this.constellationLines.visible=e)}toggleConstellations(){return this.constellationLines?(this.constellationLines.visible=!this.constellationLines.visible,this.constellationLines.visible):!1}areConstellationsVisible(){var e;return((e=this.constellationLines)==null?void 0:e.visible)??!0}dispose(){this.milkyWayMesh&&(this.milkyWayMesh.geometry.dispose(),this.milkyWayMesh.material.dispose()),this.pointsMesh&&(this.pointsMesh.geometry.dispose(),this.pointsMesh.material.dispose()),this.constellationLines&&(this.constellationLines.geometry.dispose(),this.constellationLines.material.dispose()),this.stardustMesh&&(this.stardustMesh.geometry.dispose(),this.stardustMesh.material.dispose()),this.meteorSystem&&this.meteorSystem.dispose()}};te(Ar,"SPHERE_RADIUS",8500);let lh=Ar;function d2(t=19890825){let e=t>>>0;return function(){let n=e+=1831565813;return n=Math.imul(n^n>>>15,n|1),n^=n+Math.imul(n^n>>>7,n|61),((n^n>>>14)>>>0)/4294967296}}class h2{constructor(e,n=19890825){te(this,"mesh");te(this,"count",3200);te(this,"elements",[]);te(this,"dummy",new Gt);te(this,"transform");te(this,"seed");this.transform=e,this.seed=n;const i=new xf(.35,1),r=i.attributes.position;for(let o=0;o<r.count;o++){const a=r.getX(o),l=r.getY(o),c=r.getZ(o),u=1+.22*Math.sin(a*5)*Math.cos(l*5+c*3);r.setXYZ(o,a*u,l*u,c*u)}i.computeVertexNormals();const s=new YT({roughness:.88,metalness:.12,vertexColors:!0});this.mesh=new KT(i,s,this.count),this.mesh.name="asteroid_belt_instanced",this.mesh.castShadow=!1,this.mesh.receiveShadow=!1,this.generateElements(),this.updatePositions(0)}generateElements(){const e=d2(this.seed),n=[{au:2.5,width:.045},{au:2.82,width:.04},{au:2.96,width:.035},{au:3.27,width:.05}],i=[];let r=0;for(;r<this.count;){const s=2.12+e()*1.16;let o=!1;for(const d of n)if(Math.abs(s-d.au)<d.width&&e()<.88){o=!0;break}if(o)continue;const a=.03+e()*.19,l=e()*e()*18,c=Lr.degToRad(l),u=e()*Math.PI*2,h=e()*Math.PI*2,f=e()*Math.PI*2,p=Math.pow(s,1.5)*365.25,_=Math.PI*2/p,v=.45+e()*.9;this.elements.push({semiMajorAxisAU:s,eccentricity:a,inclinationRad:c,longNodeRad:u,argPeriRad:h,meanAnomalyEpochRad:f,meanMotionRadPerDay:_,scale:v});const m=e();if(m<.7){const d=.28+e()*.18;i.push(new ge(d*.95,d*.92,d*.88))}else if(m<.9){const d=.45+e()*.22;i.push(new ge(d*1.05,d*.95,d*.8))}else{const d=.55+e()*.25;i.push(new ge(d,d*.95,d*.9))}r++}for(let s=0;s<i.length;s++)this.mesh.setColorAt(s,i[s]);this.mesh.instanceColor&&(this.mesh.instanceColor.needsUpdate=!0)}updatePositions(e){const n=this.transform.mode==="scientific";for(let i=0;i<this.elements.length;i++){const r=this.elements[i],s=(r.meanAnomalyEpochRad+r.meanMotionRadPerDay*e)%(Math.PI*2),o=s+2*r.eccentricity*Math.sin(s),a=r.semiMajorAxisAU*(1-r.eccentricity*r.eccentricity)/(1+r.eccentricity*Math.cos(o)),l=o+r.argPeriRad,c=Math.cos(l),u=Math.sin(l),h=Math.cos(r.longNodeRad),f=Math.sin(r.longNodeRad),p=Math.cos(r.inclinationRad),_=Math.sin(r.inclinationRad),v=a,m=v*(h*c-f*u*p),d=v*(f*c+h*u*p),g=v*(u*_);let x,y,R;if(n){const A=sa.AU_KM/sa.SCIENTIFIC_KM_PER_UNIT;x=m*A,y=g*A,R=-d*A}else{const A=30+Math.sqrt(a)*65,b=Math.sqrt(m*m+d*d+g*g);x=m/b*A,y=g/b*A,R=-(d/b)*A}this.dummy.position.set(x,y,R);const C=r.scale*(n?.15:1);this.dummy.scale.set(C,C,C),this.dummy.rotation.set(s*2,s*3.5,s*1.5),this.dummy.updateMatrix(),this.mesh.setMatrixAt(i,this.dummy.matrix)}this.mesh.instanceMatrix.needsUpdate=!0}setVisible(e){this.mesh.visible=e}isVisible(){return this.mesh.visible}dispose(){this.mesh.geometry.dispose(),this.mesh.material.dispose()}}class f2{constructor(e,n){te(this,"container");te(this,"renderer");te(this,"scene");te(this,"cameraRig");te(this,"clock",new Ql);te(this,"transform",new sa);te(this,"planetBundles",new Map);te(this,"orbitLinesGroup",new ri);te(this,"moonOrbitLines",new Map);te(this,"latestPhysicalStates",new Map);te(this,"starfield");te(this,"asteroidBelt");te(this,"raycaster",new i2);te(this,"mouse",new je);te(this,"isRunning",!0);te(this,"animationFrameId",null);te(this,"lastFrameTime",performance.now());te(this,"selectedBody");te(this,"onTelemetryUpdate");te(this,"telemetryThrottleCounter",0);te(this,"pointerDownPos",{x:0,y:0});te(this,"onPointerDown",e=>{this.pointerDownPos={x:e.clientX,y:e.clientY}});te(this,"onCanvasClick",e=>{if(e.target!==this.renderer.domElement||Math.hypot(e.clientX-this.pointerDownPos.x,e.clientY-this.pointerDownPos.y)>6)return;const i=this.renderer.domElement.getBoundingClientRect();this.mouse.x=(e.clientX-i.left)/i.width*2-1,this.mouse.y=-((e.clientY-i.top)/i.height)*2+1,this.raycaster.setFromCamera(this.mouse,this.cameraRig.camera);const r=[];this.planetBundles.forEach(o=>{r.push(o.surfaceMesh)});const s=this.raycaster.intersectObjects(r,!1);if(s.length>0){const o=s[0].object;for(const a of this.planetBundles.values())if(a.surfaceMesh===o){this.selectBody(a.definition.name);break}}});te(this,"onResize",()=>{if(!this.container)return;const e=this.container.clientWidth||window.innerWidth,n=this.container.clientHeight||window.innerHeight;this.renderer.setSize(e,n),this.cameraRig.handleResize(e,n)});te(this,"animate",()=>{var o,a,l;if(!this.isRunning)return;this.animationFrameId=requestAnimationFrame(this.animate);const e=performance.now(),n=Math.min(Math.max((e-this.lastFrameTime)*.001,.001),.1);this.lastFrameTime=e,this.clock.update(e);const r=this.clock.getJulianDate()-Ql.J2000_JD;this.propagateAll(r);const s=this.planetBundles.get("Sun");if(s){const c=e*.001,u=s.surfaceMesh.material;if((o=u.uniforms)!=null&&o.time&&(u.uniforms.time.value=c),s.glowMeshes)for(const h of s.glowMeshes){const f=h.material;(a=f.uniforms)!=null&&a.time&&(f.uniforms.time.value=c)}if(s.prominencesGroup){for(const h of s.prominencesGroup.children)if(h instanceof Tt){const f=h.material;(l=f.uniforms)!=null&&l.time&&(f.uniforms.time.value=c)}}}this.cameraRig.update(),this.starfield.update(this.cameraRig.camera.position,n),this.renderer.render(this.scene,this.cameraRig.camera),this.telemetryThrottleCounter++,this.telemetryThrottleCounter%3===0&&this.onTelemetryUpdate&&this.dispatchTelemetry()});this.container=e,this.onTelemetryUpdate=n,this.selectedBody=gn.getBody("Mercury")||gn.getAllBodies()[0],this.scene=new WT,this.scene.background=new ge(131333),this.renderer=new GT({antialias:!0,powerPreference:"high-performance"});const i=e.clientWidth||window.innerWidth,r=e.clientHeight||window.innerHeight;this.renderer.setSize(i,r),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.outputColorSpace=zt,this.renderer.toneMapping=mv,this.renderer.toneMappingExposure=1.05,this.renderer.domElement.style.position="absolute",this.renderer.domElement.style.top="0",this.renderer.domElement.style.left="0",this.renderer.domElement.style.width="100%",this.renderer.domElement.style.height="100%",this.renderer.domElement.style.display="block",e.appendChild(this.renderer.domElement),this.cameraRig=new l2(e),this.setupLighting(),this.starfield=new lh,this.scene.add(this.starfield.group),this.asteroidBelt=new h2(this.transform),this.scene.add(this.asteroidBelt.mesh),this.orbitLinesGroup.visible=!1,this.scene.add(this.orbitLinesGroup),this.setupBodies(),this.rebuildOrbitLines(),this.propagateAll(0),this.scene.updateMatrixWorld(!0),this.selectBody("Mercury",1800),this.setupInteraction(),this.animate()}setupLighting(){const e=new t2(16775917,2.4,0,0);e.position.set(0,0,0),e.castShadow=!1,this.scene.add(e);const n=new n2(2238008,.25);this.scene.add(n)}setupBodies(){const e=gn.getAllBodies();for(const n of e){const i=a2.createPlanet(n);this.scene.add(i.bodyGroup),this.planetBundles.set(n.name,i)}}rebuildOrbitLines(){for(;this.orbitLinesGroup.children.length>0;){const n=this.orbitLinesGroup.children[0];this.orbitLinesGroup.remove(n),n instanceof ra&&(n.geometry.dispose(),n.material.dispose())}this.moonOrbitLines.clear();const e=gn.getAllBodies();for(const n of e)if(n.category!=="moon"&&n.orderFromSun>0){const i=Qm.createOrbitLine(n,this.transform);i&&this.orbitLinesGroup.add(i)}for(const n of e)if(n.category==="moon"&&n.parentId){const i=gn.getParent(n);if(i){const r=Qm.createMoonOrbitLine(n,i,this.transform);r&&(this.orbitLinesGroup.add(r),this.moonOrbitLines.set(n.name,r))}}}setScaleMode(e){this.transform.mode!==e&&(this.transform.mode=e,this.planetBundles.forEach(n=>{const i=this.transform.getVisualRadius(n.definition);n.visualRadius=i;const s=1-(n.definition.physical.flattening||0);if(n.surfaceMesh.scale.set(i,i*s,i),n.nightMesh&&n.nightMesh.scale.set(i,i*s,i),n.cloudMesh&&n.cloudMesh.scale.set(i,i,i),n.atmosphereMesh&&n.atmosphereMesh.scale.set(i,i,i),n.ringMesh){n.ringMesh.scale.set(i,i,i);const o=n.ringMesh.material;o.uniforms&&o.uniforms.saturnRadius&&(o.uniforms.saturnRadius.value=i)}n.glowMeshes&&n.glowMeshes.forEach(o=>o.scale.set(i,i,i))}),this.rebuildOrbitLines())}toggleConstellations(){return this.starfield.toggleConstellations()}toggleAsteroidBelt(){const e=!this.asteroidBelt.isVisible();return this.asteroidBelt.setVisible(e),e}toggleOrbits(){return this.orbitLinesGroup.visible=!this.orbitLinesGroup.visible,this.orbitLinesGroup.visible}setupInteraction(){this.renderer.domElement.addEventListener("mousedown",this.onPointerDown),this.renderer.domElement.addEventListener("click",this.onCanvasClick),window.addEventListener("resize",this.onResize)}selectBody(e,n=1800){const i=this.planetBundles.get(e);i&&(this.selectedBody=i.definition,this.cameraRig.focusCinematic(i.bodyGroup,i.visualRadius,i.definition.name,n))}resetView(){this.selectedBody=gn.getBody("Sun")||gn.getAllBodies()[0],this.cameraRig.resetToOverview()}propagateAll(e){const n=gn.getAllBodies(),i=new Map;for(const r of n){if(r.category==="moon")continue;const s=this.planetBundles.get(r.name);if(!s)continue;if(r.orderFromSun===0){s.bodyGroup.position.set(0,0,0),i.set(r.id,[0,0,0]);const u=e*24/609.12*Math.PI*2;s.surfaceMesh.rotation.y=u;continue}const o=Nr.propagate(r.orbit,e);this.latestPhysicalStates.set(r.name,o);const a=this.transform.toRenderPosition(o.positionKm,r);s.bodyGroup.position.set(a[0],a[1],a[2]),i.set(r.id,a);const l=r.physical.rotationPeriodHours||24,c=e*24/l*Math.PI*2;if(s.surfaceMesh.rotation.y=c,s.nightMesh&&(s.nightMesh.rotation.y=c),s.cloudMesh&&(s.cloudMesh.rotation.y=c*1.05),r.name==="Saturn"&&s.ringMesh){const u=s.ringMesh.material;u.uniforms&&u.uniforms.saturnCenter&&(u.uniforms.saturnCenter.value.set(a[0],a[1],a[2]),u.uniforms.saturnRadius.value=s.visualRadius)}}for(const r of n){if(r.category!=="moon"||!r.parentId)continue;const s=this.planetBundles.get(r.name);if(!s)continue;const o=gn.getParent(r);if(!o)continue;const a=this.latestPhysicalStates.get(o.name),l=i.get(o.id)||[0,0,0],c=o.physical.gmKm3S2??(o.physical.massKg?o.physical.massKg*66743e-24:void 0),u=r.physical.gmKm3S2??(r.physical.massKg?r.physical.massKg*66743e-24:0),h=c!==void 0?c+u:Nr.GM_SUN,f=Nr.propagate(r.orbit,e,h),p=(a==null?void 0:a.positionKm)||[0,0,0],_=(a==null?void 0:a.velocityKmPerSec)||[0,0,0],v=[p[0]+f.positionKm[0],p[1]+f.positionKm[1],p[2]+f.positionKm[2]],m=[_[0]+f.velocityKmPerSec[0],_[1]+f.velocityKmPerSec[1],_[2]+f.velocityKmPerSec[2]];this.latestPhysicalStates.set(r.name,{positionKm:v,velocityKmPerSec:m,distanceKm:Math.hypot(...v),speedKmPerSec:Math.hypot(...m),trueAnomalyDeg:f.trueAnomalyDeg,eccentricAnomalyDeg:f.eccentricAnomalyDeg});const d=this.transform.toMoonRenderPosition(f.positionKm,r,l,o);s.bodyGroup.position.set(d[0],d[1],d[2]);const g=this.moonOrbitLines.get(r.name);g&&g.position.set(l[0],l[1],l[2]);const x=r.physical.rotationPeriodHours||r.orbit.orbitalPeriodDays*24,y=e*24/x*Math.PI*2;s.surfaceMesh.rotation.y=y}this.asteroidBelt.updatePositions(e)}dispatchTelemetry(){const e=this.latestPhysicalStates.get(this.selectedBody.name),n=(e==null?void 0:e.distanceKm)||this.selectedBody.orbit.semiMajorAxisKm,i=(e==null?void 0:e.speedKmPerSec)||0,r=new D;this.cameraRig.camera.getWorldDirection(r);const s=Math.atan2(r.x,r.z)*Lr.RAD2DEG,o=Math.asin(r.y)*Lr.RAD2DEG,a={id:this.selectedBody.id,name:this.selectedBody.name,category:this.selectedBody.category,parentId:this.selectedBody.parentId,parentName:this.selectedBody.parentName,distanceKm:n,apparentSpeedKmS:i,radiusKm:this.selectedBody.physical.meanRadiusKm,orbitalPeriodDays:this.selectedBody.orbit.orbitalPeriodDays,axialTiltDeg:this.selectedBody.physical.axialTiltDeg||0,colorHex:this.selectedBody.physical.colorHex||"#ffffff"};this.onTelemetryUpdate({speedKmS:i,lookAzimuthDeg:Math.round(s),lookElevationDeg:Math.round(o),activeTarget:a,timeScale:this.clock.timeMultiplier,julianDate:this.clock.getJulianDate(),utcIso:this.clock.getIsoString(),scaleMode:this.transform.mode,isPaused:this.clock.isPaused,constellationsVisible:this.starfield.areConstellationsVisible(),asteroidBeltVisible:this.asteroidBelt.isVisible(),orbitsVisible:this.orbitLinesGroup.visible})}dispose(){this.isRunning=!1,this.animationFrameId!==null&&cancelAnimationFrame(this.animationFrameId),window.removeEventListener("resize",this.onResize),this.renderer.domElement.removeEventListener("mousedown",this.onPointerDown),this.renderer.domElement.removeEventListener("click",this.onCanvasClick),this.cameraRig.dispose(),this.starfield.dispose(),this.asteroidBelt.dispose(),this.planetBundles.forEach(e=>{e.surfaceMesh.geometry.dispose(),e.surfaceMesh.material.dispose(),e.nightMesh&&(e.nightMesh.geometry.dispose(),e.nightMesh.material.dispose()),e.cloudMesh&&(e.cloudMesh.geometry.dispose(),e.cloudMesh.material.dispose()),e.atmosphereMesh&&(e.atmosphereMesh.geometry.dispose(),e.atmosphereMesh.material.dispose()),e.ringMesh&&(e.ringMesh.geometry.dispose(),e.ringMesh.material.dispose()),e.glowMeshes&&e.glowMeshes.forEach(n=>{n.geometry.dispose(),n.material.dispose()}),e.prominencesGroup&&e.prominencesGroup.children.forEach(n=>{n instanceof Tt&&(n.geometry.dispose(),n.material.dispose())})}),this.renderer.dispose(),this.renderer.domElement.parentElement&&this.renderer.domElement.parentElement.removeChild(this.renderer.domElement)}}const ch={Mercury:{name:"Mercury",category:"planet",eyebrow:"PLANET",accentColor:"#E8927C",eyebrowColor:"#fabfad",distanceAU:"0.39 AU",textureThumb:"textures/2k_mercury.jpg",monographText:"THE CLOSEST PLANET TO THE SUN. IT CIRCLES THE SUN FASTER THAN ALL THE OTHER PLANETS, WHICH IS WHY ROMANS NAMED IT AFTER THEIR SWIFT-FOOTED MESSENGER GOD.",extendedLore:"Mercury is a world of fierce cosmic extremes. With virtually no atmosphere to trap heat, midday temperatures soar to 430°C (800°F), while the sunless night plummets to -180°C (-290°F). Its massive metallic core occupies roughly 85% of the planet's total radius, suggesting a colossal primordial impact stripped away much of its ancient silicate mantle.",missions:[{name:"Mariner 10",year:"1974–1975",agency:"NASA",role:"First flybys; mapped 45% of surface"},{name:"MESSENGER",year:"2011–2015",agency:"NASA",role:"First orbiter; discovered polar water ice in permanently shadowed craters"},{name:"BepiColombo",year:"2025–2026",agency:"ESA / JAXA",role:"Dual orbiter study of magnetosphere and exosphere"}]},Venus:{name:"Venus",category:"planet",eyebrow:"PLANET",accentColor:"#b45d15",eyebrowColor:"#e58e45",distanceAU:"0.723 AU",textureThumb:"textures/2k_venus_atmosphere.jpg",monographText:"NAMED FOR THE ROMAN GODDESS OF LOVE AND BEAUTY. ENSHROUDED IN DENSE OPAQUE CLOUDS OF SULFURIC ACID, IT SUFFERS A RUNAWAY GREENHOUSE EFFECT WITH SURFACE TEMPERATURES REACHING 465°C.",extendedLore:"Venus is Earth's twin in diameter and mass, but an infernal counterpart in environment. A crushing supercritical carbon dioxide atmosphere exerts 92 times Earth's sea-level pressure. Venus rotates backwards compared to most planets, with the Sun rising in the west, and its day is longer than its orbital year.",missions:[{name:"Venera 7",year:"1970",agency:"Soviet Union",role:"First human spacecraft to softly land and transmit data from another planet"},{name:"Magellan",year:"1990–1994",agency:"NASA",role:"Global radar mapping revealing extensive volcanism and lava channels"},{name:"Akatsuki",year:"2015–Present",agency:"JAXA",role:"Atmospheric super-rotation and cloud dynamics investigation"}]},Earth:{name:"Earth",category:"planet",eyebrow:"PLANET",accentColor:"#26daaa",eyebrowColor:"#7bf0d0",distanceAU:"1.000 AU",textureThumb:"textures/2k_earth_daymap.jpg",monographText:"OUR HOME AND THE ONLY KNOWN SANCTUARY OF LIFE IN THE COSMOS. A VIBRANT BLUE MARBLE ENVELOPED BY A NITROGEN-OXYGEN ATMOSPHERE, WITH LIQUID OCEANS COVERING SEVENTY PERCENT OF ITS CRUST.",extendedLore:"Earth resides at the temperate sweet spot of the circumstellar habitable zone. Dynamic plate tectonics continuously recycle carbon, while a vigorous geodynamo generates a protective magnetosphere shielding the biosphere from solar wind stripping and high-energy galactic cosmic rays.",missions:[{name:"Apollo Program",year:"1961–1972",agency:"NASA",role:"Human lunar landings; transformed humanity's ecological perspective of Earth"},{name:"Terra & Aqua",year:"1999–Present",agency:"NASA",role:"Comprehensive global climate and ocean monitoring system"},{name:"Copernicus Sentinel",year:"2014–Present",agency:"ESA",role:"Constellation observing biosphere, ice sheets, and atmosphere"}]},Mars:{name:"Mars",category:"planet",eyebrow:"PLANET",accentColor:"#e55f45",eyebrowColor:"#fca595",distanceAU:"1.524 AU",textureThumb:"textures/2k_mars.jpg",monographText:"THE RED PLANET, COLORED BY IRON OXIDE SPREAD ACROSS ITS WINDSWEPT DESERTS. HOME TO OLYMPUS MONS, THE TALLEST VOLCANO IN THE SOLAR SYSTEM, AND VAST DRY RIVER VALLEYS.",extendedLore:"Though frozen and desiccated today, geochemical fingerprints captured by rovers prove ancient Mars possessed lakes, river deltas, and a thicker insulating atmosphere over three billion years ago. Its thin CO2 atmosphere generates continent-scale dust storms that periodically veil the entire globe.",missions:[{name:"Viking 1 & 2",year:"1976",agency:"NASA",role:"First successful long-duration Mars surface landers and biological tests"},{name:"Curiosity",year:"2012–Present",agency:"NASA",role:"Discovered ancient habitable lacustrine environments in Gale Crater"},{name:"Perseverance",year:"2021–Present",agency:"NASA",role:"Searching for ancient microbial biosignatures and caching core samples"}]},Jupiter:{name:"Jupiter",category:"planet",eyebrow:"PLANET",accentColor:"#f59e0b",eyebrowColor:"#fcd34d",distanceAU:"5.203 AU",textureThumb:"textures/2k_jupiter.jpg",monographText:"THE TITAN OF OUR SOLAR SYSTEM, WITH MORE MASS THAN ALL OTHER WORLDS COMBINED. A SWIRLING GAS GIANT DOMINATED BY THE CENTURIES-OLD GREAT RED SPOT AND 95 KNOWN SATELLITES.",extendedLore:"Jupiter acted as the primary gravitational architect of the early Solar System, shaping asteroid orbits and scattering comets. Below its dynamic ammonia cloud belts, hydrogen transitions into liquid and eventually into an exotic state of liquid metallic hydrogen that conducts immense electrical currents, powering the most powerful planetary magnetic field in the system.",missions:[{name:"Voyager 1 & 2",year:"1979",agency:"NASA",role:"Discovered Jovian rings and active volcanism on Io"},{name:"Galileo",year:"1995–2003",agency:"NASA",role:"First orbiter; gathered initial evidence of subsurface ocean on Europa"},{name:"Juno",year:"2016–Present",agency:"NASA",role:"Mapping gravitational anomalies and deep atmospheric water abundance"}]},Saturn:{name:"Saturn",category:"planet",eyebrow:"PLANET",accentColor:"#b29d81",eyebrowColor:"#d4c5b0",distanceAU:"9.539 AU",textureThumb:"textures/2k_saturn.jpg",monographText:"A MAJESTIC WORLD ADORNED BY AN EXTRAORDINARY SYSTEM OF ICY RINGS EXTENDING THOUSANDS OF KILOMETERS INTO THE VOID, ACCOMPANIED BY THE HAZE-CLOAKED MOON TITAN.",extendedLore:"Saturn's ring system spans up to 282,000 km in width yet is astonishingly paper-thin—averaging barely 10 to 30 meters in vertical thickness. Composed of 99% pure water ice particles ranging from dust grains to boulder sizes, the rings are sustained and sculpted by subtle gravitational resonances with shepherd moons.",missions:[{name:"Pioneer 11",year:"1979",agency:"NASA",role:"First close encounter with Saturn and discovery of the F Ring"},{name:"Cassini-Huygens",year:"2004–2017",agency:"NASA / ESA / ASI",role:"Thirteen-year orbital odyssey; landed probe on Titan, found Enceladus plumes"},{name:"Dragonfly",year:"Launching 2028",agency:"NASA",role:"Rotorcraft lander to explore prebiotic chemistry on Titan"}]},Uranus:{name:"Uranus",category:"planet",eyebrow:"PLANET",accentColor:"#8dcdd8",eyebrowColor:"#b3e8f0",distanceAU:"19.18 AU",textureThumb:"textures/2k_uranus.jpg",monographText:"AN ICE GIANT TILTED SO DRAMATICALLY ON ITS SIDE THAT ITS ROTATION AXIS POINTS ALMOST DIRECTLY AT THE SUN, DRIVING EXTREME DECADES-LONG SEASONS IN COMPLETE FREEZE.",extendedLore:"With an axial tilt of 97.77°, Uranus literally rolls along its orbital path like a ball. Scientists theorize a sequence of Earth-sized protoplanetary impacts knocked the giant onto its side early in solar history. Its pale aquamarine coloration originates from methane gas in its upper atmosphere absorbing red light wavelengths.",missions:[{name:"Voyager 2",year:"1986",agency:"NASA",role:"Only spacecraft to encounter Uranus; discovered 10 moons and 2 new rings"},{name:"Uranus Orbiter & Probe",year:"Proposed 2030s",agency:"NASA Decadal",role:"Flagship mission concept prioritized to explore ice giant interiors"}]},Neptune:{name:"Neptune",category:"planet",eyebrow:"PLANET",accentColor:"#4f83e2",eyebrowColor:"#7ca8ff",distanceAU:"30.06 AU",textureThumb:"textures/2k_neptune.jpg",monographText:"THE MOST DISTANT MAJOR PLANET, SHROUDED IN AN INTENSE DEEP-AZURE METHANE ATMOSPHERE WHERE SUPERSONIC WINDS SURPASS TWO THOUSAND KILOMETERS PER HOUR.",extendedLore:"Neptune was the first planet located through mathematical prediction rather than empirical observation: slight perturbations in Uranus's orbit allowed French astronomer Urbain Le Verrier to calculate its precise position in 1846. It harbors the retrograde moon Triton, a captured Kuiper Belt dwarf world exhibiting nitrogen cryovolcanoes.",missions:[{name:"Voyager 2",year:"1989",agency:"NASA",role:"Close flyby; detected the Great Dark Spot and geysers on Triton"}]},Pluto:{name:"Pluto",category:"dwarf_planet",eyebrow:"DWARF PLANET",accentColor:"#FF8732",eyebrowColor:"#ffa463",distanceAU:"39.48 AU",textureThumb:"textures/2k_moon.jpg",monographText:"SENTINEL OF THE KUIPER BELT, BEARING THE GLOWING NITROGEN ICE PLAINS OF TOMBAUGH REGIO AND SHARING A SYNCHRONOUS GRAVITATIONAL DANCE WITH ITS COMPANION CHARON.",extendedLore:"Reclassified as a dwarf planet in 2006, Pluto revealed itself during the 2015 New Horizons flyby as a geologically active wonderland. It features convection cells of churned nitrogen-carbon-monoxide ice, water-ice mountains towering 3,500 meters into its thin blue hazy atmosphere, and a likely deep subsurface liquid ocean.",missions:[{name:"New Horizons",year:"2015",agency:"NASA",role:"Historic historic flyby capturing high-resolution imagery of Tombaugh Regio"}]},Moon:{name:"Moon",category:"moon",eyebrow:"NATURAL SATELLITE · EARTH I",accentColor:"#d1d5db",eyebrowColor:"#e5e7eb",distanceAU:"1.000 AU",textureThumb:"textures/2k_moon.jpg",monographText:"EARTH'S CONSTANT CELESTIAL COMPANION, TIDALLY LOCKED IN AN ANCIENT GRAVITATIONAL EMBRACE. ITS HIGHLANDS AND BASALTIC MARIA PRESERVE FOUR BILLION YEARS OF COSMIC HISTORY.",extendedLore:"Formed ~4.5 billion years ago from the debris of a giant collision between the proto-Earth and a Mars-sized protoplanet named Theia. The Moon stabilizes Earth's rotational tilt, modulating climate extremes and generating oceanic tides.",missions:[{name:"Apollo 11",year:"1969",agency:"NASA",role:"First human landing on another celestial world"},{name:"LRO",year:"2009–Present",agency:"NASA",role:"High-resolution sub-meter 3D laser altimetry and mapping"},{name:"Artemis I",year:"2022",agency:"NASA",role:"Uncrewed lunar orbital qualification flight for deep space exploration"}]},Europa:{name:"Europa",category:"moon",eyebrow:"OCEAN MOON · JUPITER II",accentColor:"#7dd3fc",eyebrowColor:"#bae6fd",distanceAU:"5.203 AU",textureThumb:"textures/2k_moon.jpg",monographText:"A SMOOTH CRUST OF WATER ICE FRACTURED BY REDDISH LINEAE, CONCEALING A VAST GLOBAL SALTWATER OCEAN CONTAINING TWICE THE WATER OF ALL EARTH'S OCEANS COMBINED.",extendedLore:"Tidally flexed by orbital resonance with Io and Ganymede, Europa's rocky mantle produces geothermal heating that keeps its deep subsurface ocean in a liquid state. Cryovolcanic plumes venting water into space make it one of humankind's top destinations in the search for extraterrestrial habitability.",missions:[{name:"Galileo",year:"1995–2003",agency:"NASA",role:"Discovered induced magnetic field evidence for a subsurface saline ocean"},{name:"Europa Clipper",year:"2024–Present",agency:"NASA",role:"Dedicated mission equipped with ice-penetrating radar to confirm habitability"}]},Io:{name:"Io",category:"moon",eyebrow:"VOLCANIC MOON · JUPITER I",accentColor:"#facc15",eyebrowColor:"#fef08a",distanceAU:"5.203 AU",textureThumb:"textures/2k_moon.jpg",monographText:"THE MOST VOLCANICALLY ACTIVE BODY IN THE SOLAR SYSTEM, SCARRED BY HUNDREDS OF ACTIVE VOLCANOES DRIVEN BY INTENSE GRAVITATIONAL TIDAL FRICTION.",extendedLore:"Caught in an eccentric resonance between Jupiter and its sibling moons, Io undergoes constant tidal flexing that generates ferocious internal heat, driving molten silicate lava lakes and sulfur plumes hundreds of kilometers into space.",missions:[{name:"Voyager 1",year:"1979",agency:"NASA",role:"First observation of active extraterrestrial volcanism"},{name:"Juno",year:"2016–Present",agency:"NASA",role:"Close flybys mapping polar volcanic hotspots and magma oceans"}]},Ganymede:{name:"Ganymede",category:"moon",eyebrow:"GIANT MOON · JUPITER III",accentColor:"#cbd5e1",eyebrowColor:"#e2e8f0",distanceAU:"5.203 AU",textureThumb:"textures/2k_moon.jpg",monographText:"THE LARGEST MOON IN THE SOLAR SYSTEM, EVEN EXCEEDING MERCURY IN DIAMETER, AND THE ONLY SATELLITE BEARING AN INTERNALLY GENERATED MAGNETIC FIELD.",extendedLore:"Possesses a molten iron-rich core that generates an intrinsic magnetosphere. Beneath its grooved and fractured tectonic ice shell lies a deep subterranean liquid ocean separated by high-pressure ice phases.",missions:[{name:"Galileo",year:"1995–2003",agency:"NASA",role:"Identified intrinsic dipolar magnetic field"},{name:"JUICE",year:"2023–Present",agency:"ESA",role:"En route to enter permanent orbit around Ganymede in 2034"}]},Titan:{name:"Titan",category:"moon",eyebrow:"HYDROCARBON WORLD · SATURN VI",accentColor:"#f59e0b",eyebrowColor:"#fde68a",distanceAU:"9.539 AU",textureThumb:"textures/2k_moon.jpg",monographText:"THE ONLY MOON WITH A DENSE ATMOSPHERE AND STABLE SURFACE SEAS, WHERE METHANE AND ETHANE FORM A COMPLETE METEOROLOGICAL HYDROLOGIC CYCLE.",extendedLore:"Exceeding Mercury in size, Titan possesses an orange smoggy atmosphere 1.5 times denser than Earth's sea-level pressure. Cryogenic rivers carve canyon networks feeding liquid hydrocarbon seas like Kraken Mare.",missions:[{name:"Cassini-Huygens",year:"2004–2017",agency:"NASA / ESA",role:"Huygens landed directly on Titan's surface in 2005"},{name:"Dragonfly",year:"Planned 2028",agency:"NASA",role:"Rotorcraft lander to explore prebiotic organic chemistry"}]},Enceladus:{name:"Enceladus",category:"moon",eyebrow:"CRYOVOLCANIC MOON · SATURN II",accentColor:"#e0f2fe",eyebrowColor:"#f0f9ff",distanceAU:"9.539 AU",textureThumb:"textures/2k_moon.jpg",monographText:"AN IMMACULATE WORLD OF PURE REFLECTIVE ICE, ERUPTING GIANT HYDROTHERMAL GEYSERS FROM TIGER STRIPES OVER ITS SOUTH POLAR TERRAIN.",extendedLore:"Enceladus possesses a global liquid saltwater ocean in direct physical contact with an active hydrothermal rocky seafloor. Cassini detected complex macromolecules and molecular hydrogen in its plumes, confirming active serpentinization.",missions:[{name:"Cassini",year:"2005–2017",agency:"NASA / ESA",role:"Flew directly through erupting plumes, sampling water vapor, salts, and organics"}]},Ceres:{name:"Ceres",category:"dwarf_planet",eyebrow:"DWARF PLANET · ASTEROID BELT",accentColor:"#a1a1aa",eyebrowColor:"#d4d4d8",distanceAU:"2.767 AU",textureThumb:"textures/2k_moon.jpg",monographText:"EMPRESS OF THE ASTEROID BELT, HOLDING A THIRD OF ITS ENTIRE MASS. AN ICE-RICH RELICT WORLD FEATURING RADIANT SODIUM CARBONATE SALT DOMES.",extendedLore:"Ceres is a differentiated protoplanet containing significant quantities of water ice and hydrous minerals. Occator Crater hosts the bright Cerealia Facula, formed by subsurface brine percolation and cryovolcanic extrusion.",missions:[{name:"Dawn",year:"2015–2018",agency:"NASA",role:"Orbited Ceres for three years, discovering active cryovolcanism and hydrated minerals"}]},Sun:{name:"Sun",category:"star",eyebrow:"STAR",accentColor:"#ffaa33",eyebrowColor:"#ffe4a0",distanceAU:"0.000 AU",textureThumb:"textures/2k_sun.jpg",monographText:"THE GLOWING HEART OF OUR SYSTEM, CONTAINING OVER NINETY-NINE POINT EIGHT PERCENT OF ALL MASS. A THERMONUCLEAR ENGINE POWERING ALL LIGHT, LIFE, AND GRAVITATIONAL HARMONY.",extendedLore:"Every second in the solar core, 600 million tons of hydrogen undergo thermonuclear fusion into helium, converting 4 million tons of matter into pure radiant energy. The photon diffusion through the dense radiative zone takes over 100,000 years to reach the convective layer and escape as solar light.",missions:[{name:"SOHO",year:"1995–Present",agency:"ESA / NASA",role:"Continuous monitoring of helioseismology and coronal mass ejections"},{name:"Parker Solar Probe",year:"2018–Present",agency:"NASA",role:"Closest spacecraft to Sun, diving directly through the outer corona"},{name:"Solar Orbiter",year:"2020–Present",agency:"ESA / NASA",role:"Capturing the first close-up images of the Sun's polar regions"}]}};function p2(t){return ch[t]?ch[t]:{name:t,category:"moon",eyebrow:"CELESTIAL BODY",accentColor:"#93c5fd",eyebrowColor:"#bfdbfe",distanceAU:"—",textureThumb:"textures/2k_moon.jpg",monographText:`${t.toUpperCase()} IS A DOCUMENTED COMPONENT OF THE SOLAR SYSTEM CATALOGUE.`,extendedLore:`${t} is catalogued under the NASA JPL DE440 ephemeris model.`,missions:[]}}/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m2=t=>t.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),Yv=(...t)=>t.filter((e,n,i)=>!!e&&e.trim()!==""&&i.indexOf(e)===n).join(" ").trim();/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var g2={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v2=Ne.forwardRef(({color:t="currentColor",size:e=24,strokeWidth:n=2,absoluteStrokeWidth:i,className:r="",children:s,iconNode:o,...a},l)=>Ne.createElement("svg",{ref:l,...g2,width:e,height:e,stroke:t,strokeWidth:i?Number(n)*24/Number(e):n,className:Yv("lucide",r),...a},[...o.map(([c,u])=>Ne.createElement(c,u)),...Array.isArray(s)?s:[s]]));/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ur=(t,e)=>{const n=Ne.forwardRef(({className:i,...r},s)=>Ne.createElement(v2,{ref:s,iconNode:e,className:Yv(`lucide-${m2(t)}`,i),...r}));return n.displayName=`${t}`,n};/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x2=ur("Calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _2=ur("EyeOff",[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y2=ur("Eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S2=ur("Pause",[["rect",{x:"14",y:"4",width:"4",height:"16",rx:"1",key:"zuxfzm"}],["rect",{x:"6",y:"4",width:"4",height:"16",rx:"1",key:"1okwgv"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M2=ur("Play",[["polygon",{points:"6 3 20 12 6 21 6 3",key:"1oa8hb"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E2=ur("RotateCcw",[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const eg=ur("Search",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cu=ur("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]),w2=["Pluto","Neptune","Uranus","Saturn","Jupiter","Mars","Earth","Venus","Mercury"],T2=({telemetry:t,onSelectPlanet:e,onResetView:n,onTogglePlay:i,onSetTimeMultiplier:r,onSetScaleMode:s,onSeekDate:o,onResetToJ2000:a,onResetToNow:l,onToggleConstellations:c,onToggleAsteroidBelt:u,onToggleOrbits:h})=>{const f=t==null?void 0:t.activeTarget,p=(t==null?void 0:t.isPaused)??!1,_=(t==null?void 0:t.timeScale)??1,v=(t==null?void 0:t.scaleMode)??"exploration",m=(t==null?void 0:t.julianDate)??2451545,d=(t==null?void 0:t.utcIso)??new Date().toISOString(),g=(t==null?void 0:t.constellationsVisible)??!0,x=(t==null?void 0:t.asteroidBeltVisible)??!0,y=(t==null?void 0:t.orbitsVisible)??!0,[R,C]=Ne.useState(!0),[A,b]=Ne.useState(!1),[w,M]=Ne.useState(!1),[P,V]=Ne.useState("all"),[B,G]=Ne.useState(""),[J,W]=Ne.useState(d.slice(0,10)),[ee,L]=Ne.useState(!1),[K,q]=Ne.useState(!1),[ae,ye]=Ne.useState(0),[Ve,j]=Ne.useState(!0),[ne,ce]=Ne.useState(!1),[oe,Pe]=Ne.useState(!1);Ne.useEffect(()=>{if(typeof window<"u"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches){ye(2);return}const E=setTimeout(()=>ye(1),500),S=setTimeout(()=>ye(2),1200);return()=>{clearTimeout(E),clearTimeout(S)}},[]),Ne.useEffect(()=>{const E=S=>{S.target instanceof HTMLInputElement||S.target instanceof HTMLTextAreaElement||(S.key===" "||S.code==="Space"?(S.preventDefault(),i()):S.key==="h"||S.key==="H"?(S.preventDefault(),C(O=>!O)):S.key==="Escape"?A?b(!1):w||ee?(M(!1),L(!1)):n():S.key==="o"||S.key==="O"?h==null||h():S.key==="c"||S.key==="C"?c==null||c():(S.key==="b"||S.key==="B")&&(u==null||u()))};return window.addEventListener("keydown",E),()=>window.removeEventListener("keydown",E)},[i,h,c,u,n,A,w,ee]),Ne.useEffect(()=>{!K&&!ee&&W(d.slice(0,10))},[d,K,ee]);const Ae=(f==null?void 0:f.name)||"Mercury",be=Ne.useMemo(()=>p2(Ae),[Ae]),ot=Ne.useMemo(()=>gn.getAllBodies(),[]),De=Ne.useMemo(()=>gn.getBody(Ae),[Ae]),[mt,U]=Ne.useState(1),Qt=Ne.useRef(null);Ne.useEffect(()=>{Ae!==Qt.current&&(Qt.current=Ae,U(E=>E+1))},[Ae]),Ne.useEffect(()=>{if(j(!0),ce(!1),oe)return;const E=setTimeout(()=>{ce(!0)},5500),S=setTimeout(()=>{j(!1),ce(!1)},7100);return()=>{clearTimeout(E),clearTimeout(S)}},[mt,oe]);const He=Ne.useCallback(()=>{j(!0),ce(!1),U(E=>E+1)},[]),We=Ne.useMemo(()=>ot.filter(E=>{if(P==="planet"&&E.category!=="planet"||P==="moon"&&E.category!=="moon"||P==="minor"&&E.category!=="asteroid"&&E.category!=="dwarf_planet")return!1;if(B.trim()){const S=B.toLowerCase();return E.name.toLowerCase().includes(S)||E.category.toLowerCase().includes(S)||E.parentName&&E.parentName.toLowerCase().includes(S)}return!0}),[ot,P,B]),Re=E=>{E.preventDefault(),q(!1);const S=Date.parse(J);isNaN(S)||(o(S),L(!1))},st=[{label:"1×",val:1},{label:"10×",val:10},{label:"100×",val:100},{label:"1 D/S",val:86400},{label:"1 M/S",val:2592e3},{label:"1 Y/S",val:31536e3}],Ce="/solaris/";return R?k.jsxs("div",{className:"absolute inset-0 pointer-events-none select-none flex flex-col justify-between p-6 z-20 font-sans text-white/90 overflow-hidden",children:[k.jsx("div",{className:"absolute -top-16 left-1/2 -translate-x-1/2 w-[540px] h-32 rounded-[100%] bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-transparent blur-3xl pointer-events-none"}),k.jsxs("header",{className:"flex justify-between items-start pointer-events-auto w-full z-30",children:[k.jsxs("div",{className:`flex flex-col gap-1.5 transition-all duration-1000 ${ae>=0?"opacity-100 translate-y-0":"opacity-0 -translate-y-4"}`,children:[k.jsxs("div",{className:"flex items-baseline gap-3 relative group cursor-pointer",onClick:n,title:"Reset to Solaris Overview",children:[k.jsx("div",{className:"absolute -inset-2 bg-gradient-to-r from-amber-500/10 via-white/5 to-transparent rounded-lg blur-md opacity-40 group-hover:opacity-90 transition-opacity animate-corona-aura pointer-events-none"}),k.jsx("h1",{className:"relative text-xl md:text-2xl uppercase tracking-[0.52em] font-extralight drop-shadow-md select-none animate-solaris-shimmer",children:"SOLARIS"}),k.jsx("span",{className:"text-[9px] uppercase tracking-[0.32em] text-white/35 font-light hidden sm:inline",children:"Solar System Explorer"})]}),k.jsxs("div",{className:"flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-light text-white/60 bg-black/40 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/10 shadow-lg w-fit mt-0.5",children:[k.jsx("span",{className:`w-1.5 h-1.5 rounded-full ${p?"bg-amber-400":"bg-emerald-400 animate-pulse"}`}),k.jsxs("span",{className:"text-white/85",children:[d.replace("T"," ").slice(0,19)," UTC"]}),k.jsx("span",{className:"text-white/20",children:"·"}),k.jsxs("span",{children:["JD ",m.toFixed(2)]}),k.jsx("span",{className:"text-white/20",children:"·"}),k.jsx("span",{className:"text-white/40",children:"ICRF J2000"})]})]}),k.jsxs("div",{className:"flex items-center gap-2",children:[k.jsxs("div",{className:"flex items-center bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-0.5 text-[10px] uppercase tracking-[0.2em] font-light shadow-lg",children:[k.jsx("button",{onClick:E=>{E.stopPropagation(),h==null||h()},title:"Toggle Orbit Lines (O)",className:`px-3 py-1 rounded-full transition-all duration-200 ${y?"bg-white/15 text-white shadow-sm border border-white/20":"text-white/40 hover:text-white/80"}`,children:"Orbits"}),k.jsx("button",{onClick:E=>{E.stopPropagation(),c==null||c()},title:"Toggle IAU Constellations (C)",className:`px-3 py-1 rounded-full transition-all duration-200 ${g?"bg-white/15 text-white shadow-sm border border-white/20":"text-white/40 hover:text-white/80"}`,children:"Constellations"}),k.jsx("button",{onClick:E=>{E.stopPropagation(),u==null||u()},title:"Toggle Asteroid Belt (B)",className:`px-3 py-1 rounded-full transition-all duration-200 ${x?"bg-white/15 text-white shadow-sm border border-white/20":"text-white/40 hover:text-white/80"}`,children:"Belt"})]}),k.jsxs("div",{className:"flex items-center bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-0.5 text-[10px] uppercase tracking-[0.2em] font-light shadow-lg",children:[k.jsx("button",{onClick:E=>{E.stopPropagation(),s("exploration")},className:`px-3 py-1 rounded-full transition-all duration-200 ${v==="exploration"?"bg-white/15 text-white shadow-sm border border-white/20":"text-white/40 hover:text-white/80"}`,children:"Exploration"}),k.jsx("button",{onClick:E=>{E.stopPropagation(),s("scientific")},className:`px-3 py-1 rounded-full transition-all duration-200 ${v==="scientific"?"bg-white/15 text-white shadow-sm border border-white/20":"text-white/40 hover:text-white/80"}`,children:"Scientific 1:1"})]}),k.jsxs("button",{onClick:E=>{E.stopPropagation(),M(!0)},className:"flex items-center gap-1.5 px-3.5 py-1.5 bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/10 hover:border-white/20 rounded-full text-[10px] uppercase tracking-[0.2em] font-light text-white/80 transition shadow-lg",children:[k.jsx(eg,{size:11,className:"text-white/50"}),k.jsx("span",{children:"Catalogue (42)"})]}),k.jsxs("button",{onClick:E=>{E.stopPropagation(),n()},title:"Reset to System Overview",className:"flex items-center gap-1.5 px-3.5 py-1.5 bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/10 hover:border-white/20 rounded-full text-[10px] uppercase tracking-[0.2em] font-light text-white/80 transition shadow-lg",children:[k.jsx(E2,{size:11,className:"text-white/50"}),k.jsx("span",{children:"Overview"})]}),k.jsx("button",{onClick:E=>{E.stopPropagation(),C(!1)},title:"Hide Interface (H)",className:"p-2 bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/10 rounded-full text-white/40 hover:text-white transition shadow-lg",children:k.jsx(_2,{size:12})})]})]}),k.jsx("nav",{className:`absolute left-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 pointer-events-auto transition-all duration-1000 z-30 ${ae>=1?"opacity-100 translate-x-0":"opacity-0 -translate-x-8"}`,children:w2.map(E=>{const S=ch[E],O=Ae===E,$=`${Ce}${(S==null?void 0:S.textureThumb)||"textures/2k_moon.jpg"}`;return k.jsxs("button",{onClick:Q=>{Q.stopPropagation(),e(E),He()},className:"flex items-center gap-3.5 group text-left cursor-pointer transition-all duration-200 outline-none focus:outline-none",children:[k.jsx("div",{className:`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${O?"border-white":"border-white/35 group-hover:border-white/60"}`,children:O&&k.jsx("div",{className:"w-1.5 h-1.5 rounded-full bg-white transition-transform scale-100"})}),O?k.jsx("div",{className:"h-2.5 rounded-sm transition-all duration-300",style:{backgroundColor:(S==null?void 0:S.accentColor)||"#ffffff",width:"28px",boxShadow:`0 0 10px ${(S==null?void 0:S.accentColor)||"#ffffff"}88`}}):k.jsx("div",{className:"w-6 h-6 rounded-full bg-cover bg-center transition-opacity duration-200 opacity-60 group-hover:opacity-90 flex-shrink-0",style:{backgroundImage:`url(${$})`,boxShadow:"inset -2px -4px 5px 1px rgba(0,0,0,0.9), inset 1px 1px 2px rgba(255,255,255,0.2)"}}),k.jsxs("div",{className:"flex flex-col",children:[k.jsx("span",{className:`text-[11px] uppercase tracking-[0.22em] transition-colors duration-200 ${O?"text-white font-medium":"text-white/40 group-hover:text-white/80"}`,children:E}),k.jsx("span",{className:`text-[9px] tracking-wider transition-colors duration-200 font-light ${O?"text-white/50":"text-white/20 group-hover:text-white/40"}`,children:(S==null?void 0:S.distanceAU)||""})]})]},E)})}),Ve&&k.jsx("section",{onMouseEnter:()=>Pe(!0),onMouseLeave:()=>Pe(!1),className:"absolute left-1/2 bottom-20 md:bottom-24 -translate-x-1/2 pointer-events-auto select-none z-20",children:k.jsxs("div",{className:`flex flex-col items-center text-center max-w-2xl px-6 ${ne?"monograph-vanishing":"monograph-visible"}`,children:[k.jsx("span",{className:"text-[11px] md:text-xs uppercase tracking-[0.52em] font-light transition-colors duration-500 mb-1",style:{color:be.eyebrowColor},children:be.eyebrow}),k.jsx("h2",{className:"text-5xl md:text-6xl lg:text-7xl font-extralight tracking-[0.36em] text-white uppercase drop-shadow-2xl my-1.5 transition-all duration-500",children:Ae}),k.jsx("p",{className:"text-[10px] md:text-[11px] lg:text-[12px] font-light tracking-[0.20em] leading-relaxed text-white/75 uppercase max-w-xl mx-auto my-3 text-center transition-all duration-500",children:be.monographText}),k.jsxs("button",{onClick:E=>{E.stopPropagation(),b(!0)},className:"group mt-2.5 flex flex-col items-center cursor-pointer transition-all duration-300 outline-none focus:outline-none",children:[k.jsx("span",{className:"text-xs uppercase tracking-[0.32em] font-light transition-colors duration-300",style:{color:be.accentColor},children:"READ MORE"}),k.jsx("div",{className:"h-[1px] w-full mt-1 transition-all duration-300 group-hover:w-[115%]",style:{backgroundColor:be.accentColor,boxShadow:`0 0 6px ${be.accentColor}66`}})]})]})}),!Ve&&k.jsx("div",{className:"absolute left-1/2 bottom-20 -translate-x-1/2 pointer-events-auto z-20 transition-all duration-700 opacity-60 hover:opacity-100",children:k.jsxs("button",{onClick:E=>{E.stopPropagation(),He()},className:"flex items-center gap-2 px-3.5 py-1 text-[10px] uppercase tracking-[0.25em] font-light text-white/60 hover:text-white bg-black/40 hover:bg-black/80 backdrop-blur-md border border-white/10 hover:border-white/25 rounded-full transition-all shadow-lg cursor-pointer",children:[k.jsx("span",{className:"w-1.5 h-1.5 rounded-full animate-pulse",style:{backgroundColor:be.accentColor}}),k.jsxs("span",{children:[Ae," Overview"]})]})}),k.jsxs("footer",{className:"flex flex-col items-center gap-2 w-full pointer-events-auto z-30",children:[k.jsxs("div",{className:"flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-4 py-1 text-[10px] uppercase tracking-[0.2em] font-light shadow-xl",children:[k.jsx("button",{onClick:E=>{E.stopPropagation(),i()},className:"p-1 text-white/70 hover:text-white transition rounded-full",title:"Space to toggle play",children:p?k.jsx(M2,{size:11}):k.jsx(S2,{size:11})}),k.jsx("div",{className:"flex items-center gap-1 border-l border-white/10 pl-3",children:st.map(E=>{const S=!p&&_===E.val;return k.jsx("button",{onClick:O=>{O.stopPropagation(),r(E.val)},className:`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-[0.15em] transition-all duration-200 ${S?"bg-white/20 text-white font-normal border border-white/25 shadow-sm":"text-white/40 hover:text-white/70"}`,children:E.label},E.label)})}),k.jsxs("div",{className:"flex items-center gap-1.5 border-l border-white/10 pl-3 text-[10px] uppercase tracking-[0.2em] font-light",children:[k.jsx("button",{onClick:E=>{E.stopPropagation(),a()},className:"text-white/40 hover:text-white px-1.5 py-0.5 rounded transition",children:"J2000"}),k.jsx("button",{onClick:E=>{E.stopPropagation(),l()},className:"text-white/40 hover:text-white px-1.5 py-0.5 rounded transition",children:"Now"}),k.jsxs("button",{onClick:E=>{E.stopPropagation(),L(!ee)},className:"flex items-center gap-1 text-white/50 hover:text-white px-1.5 py-0.5 rounded transition",children:[k.jsx(x2,{size:10}),k.jsx("span",{children:J})]})]})]}),ee&&k.jsxs("form",{onSubmit:Re,className:"flex items-center gap-2 bg-black/85 backdrop-blur-xl border border-white/15 rounded-xl px-3 py-2 text-[10px] uppercase tracking-[0.2em] font-light shadow-2xl",children:[k.jsx("input",{type:"date",value:J,onFocus:()=>q(!0),onChange:E=>{q(!0),W(E.target.value)},onBlur:()=>q(!1),className:"bg-white/10 text-white px-2 py-1 rounded border border-white/15 outline-none focus:border-white/40 text-[11px] font-sans"}),k.jsx("button",{type:"submit",className:"px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg transition text-[10px] uppercase tracking-[0.2em] font-light",children:"Jump"}),k.jsx("button",{type:"button",onClick:()=>L(!1),className:"p-1 text-white/40 hover:text-white",children:k.jsx(Cu,{size:12})})]})]}),A&&k.jsxs("div",{className:"fixed inset-0 z-50 pointer-events-auto flex justify-end animate-fadeIn",children:[k.jsx("div",{onClick:()=>b(!1),className:"flex-1 bg-black/60 backdrop-blur-sm transition-opacity"}),k.jsxs("aside",{className:"w-[420px] max-w-full bg-[#040307]/95 backdrop-blur-2xl border-l border-white/10 p-7 flex flex-col gap-6 shadow-2xl h-full font-sans overflow-y-auto no-scrollbar",children:[k.jsxs("div",{className:"flex justify-between items-start border-b border-white/10 pb-4",children:[k.jsxs("div",{children:[k.jsxs("span",{className:"text-[10px] uppercase tracking-[0.25em] font-light block",style:{color:be.eyebrowColor},children:[be.eyebrow," · SOLAR SYSTEM EXPLORER"]}),k.jsx("h2",{className:"text-3xl font-extralight text-white tracking-[0.25em] uppercase mt-1",children:Ae})]}),k.jsx("button",{onClick:()=>b(!1),className:"text-white/40 hover:text-white transition p-1.5 rounded-full hover:bg-white/10",children:k.jsx(Cu,{size:18})})]}),k.jsxs("div",{className:"flex flex-col gap-2",children:[k.jsx("span",{className:"text-[10px] tracking-[0.25em] uppercase text-white/40 font-light",children:"Astronomical Lore & Physical Environment"}),k.jsx("p",{className:"text-xs leading-relaxed text-white/80 font-light",children:be.extendedLore})]}),De&&k.jsxs("div",{className:"flex flex-col gap-2 pt-2 border-t border-white/10",children:[k.jsx("span",{className:"text-[10px] tracking-[0.25em] uppercase text-white/40 font-light",children:"Physical Dimensions"}),k.jsxs("div",{className:"grid grid-cols-2 gap-y-2 text-xs font-light",children:[k.jsx("span",{className:"text-white/40",children:"Mean Radius"}),k.jsxs("span",{className:"text-right text-white/90",children:[De.physical.meanRadiusKm.toLocaleString()," km"]}),k.jsx("span",{className:"text-white/40",children:"Surface Gravity"}),k.jsx("span",{className:"text-right text-white/90",children:De.physical.gmKm3S2?`${(De.physical.gmKm3S2*1e3/Math.pow(De.physical.meanRadiusKm,2)).toFixed(2)} m/s²`:"—"}),k.jsx("span",{className:"text-white/40",children:"Sidereal Day"}),k.jsx("span",{className:"text-right text-white/90",children:De.physical.rotationPeriodHours!==void 0?`${De.physical.rotationPeriodHours.toFixed(1)} h`:"Synchronous"}),k.jsx("span",{className:"text-white/40",children:"Axial Tilt"}),k.jsx("span",{className:"text-right text-white/90",children:De.physical.axialTiltDeg!==void 0?`${De.physical.axialTiltDeg.toFixed(2)}°`:"0.00°"})]})]}),De&&k.jsxs("div",{className:"flex flex-col gap-2 pt-2 border-t border-white/10",children:[k.jsx("span",{className:"text-[10px] tracking-[0.25em] uppercase text-white/40 font-light",children:"Keplerian Orbit (J2000)"}),k.jsxs("div",{className:"grid grid-cols-2 gap-y-2 text-xs font-light",children:[k.jsx("span",{className:"text-white/40",children:"Semi-Major Axis"}),k.jsxs("span",{className:"text-right text-white/90",children:[De.orbit.semiMajorAxisAU.toFixed(3)," AU"]}),k.jsx("span",{className:"text-white/40",children:"Eccentricity"}),k.jsx("span",{className:"text-right text-white/90",children:De.orbit.eccentricity.toFixed(4)}),k.jsx("span",{className:"text-white/40",children:"Orbital Period"}),k.jsx("span",{className:"text-right text-white/90",children:De.orbit.orbitalPeriodDays>730?`${(De.orbit.orbitalPeriodDays/365.25).toFixed(2)} yr`:`${De.orbit.orbitalPeriodDays.toFixed(1)} d`}),k.jsx("span",{className:"text-white/40",children:"Inclination"}),k.jsxs("span",{className:"text-right text-white/90",children:[De.orbit.inclinationDeg.toFixed(2),"°"]})]})]}),f&&k.jsxs("div",{className:"flex flex-col gap-2 pt-2 border-t border-white/10",children:[k.jsx("span",{className:"text-[10px] tracking-[0.25em] uppercase text-white/40 font-light",children:"Live Ephemeris Telemetry"}),k.jsxs("div",{className:"grid grid-cols-2 gap-y-2 text-xs font-light",children:[k.jsx("span",{className:"text-white/40",children:"Heliocentric Dist"}),k.jsx("span",{className:"text-right text-white/90",children:f.distanceKm>1e6?`${(f.distanceKm/1e6).toFixed(2)}M km`:`${Math.round(f.distanceKm).toLocaleString()} km`}),k.jsx("span",{className:"text-white/40",children:"AU Distance"}),k.jsxs("span",{className:"text-right text-white/90",children:[(f.distanceKm/1495978707e-1).toFixed(3)," AU"]}),k.jsx("span",{className:"text-white/40",children:"Orbital Velocity"}),k.jsxs("span",{className:"text-right text-white/90",children:[f.apparentSpeedKmS.toFixed(2)," km/s"]})]})]}),be.missions&&be.missions.length>0&&k.jsxs("div",{className:"flex flex-col gap-3 pt-2 border-t border-white/10",children:[k.jsx("span",{className:"text-[10px] tracking-[0.25em] uppercase text-white/40 font-light",children:"Exploration Missions"}),k.jsx("div",{className:"flex flex-col gap-2.5",children:be.missions.map(E=>k.jsxs("div",{className:"p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col gap-1",children:[k.jsxs("div",{className:"flex justify-between items-center text-xs",children:[k.jsx("span",{className:"text-white font-medium tracking-[0.1em]",children:E.name}),k.jsxs("span",{className:"text-[10px] text-white/40 font-light",children:[E.year," · ",E.agency]})]}),k.jsx("p",{className:"text-[11px] text-white/60 font-light",children:E.role})]},E.name))})]}),k.jsxs("div",{className:"pt-3 border-t border-white/10 flex justify-between items-center text-[10px] font-light text-white/30 uppercase tracking-[0.2em]",children:[k.jsx("span",{children:"NASA JPL SSD Horizons DE440"}),k.jsx("span",{children:"Keplerian 2-Body Solver"})]})]})]}),w&&k.jsxs("div",{className:"fixed inset-0 z-50 pointer-events-auto flex",children:[k.jsx("div",{onClick:()=>M(!1),className:"flex-1 bg-black/60 backdrop-blur-sm transition-opacity"}),k.jsxs("aside",{className:"w-96 bg-[#07060a]/95 backdrop-blur-2xl border-l border-white/10 p-6 flex flex-col gap-5 shadow-2xl h-full font-sans",children:[k.jsxs("div",{className:"flex justify-between items-center border-b border-white/10 pb-4",children:[k.jsxs("div",{children:[k.jsx("h3",{className:"text-lg font-extralight text-white tracking-[0.25em] uppercase",children:"Astronomical Catalogue"}),k.jsx("span",{className:"text-[10px] uppercase tracking-[0.2em] font-light text-white/40",children:"42 bodies · NASA JPL DE440"})]}),k.jsx("button",{onClick:()=>M(!1),className:"text-white/40 hover:text-white transition p-1.5 rounded-full hover:bg-white/5",children:k.jsx(Cu,{size:16})})]}),k.jsxs("div",{className:"flex flex-col gap-2.5 text-xs",children:[k.jsxs("div",{className:"relative",children:[k.jsx(eg,{size:13,className:"absolute left-3 top-2.5 text-white/35"}),k.jsx("input",{type:"text",placeholder:"FILTER BY NAME, CATEGORY...",value:B,onChange:E=>G(E.target.value),className:"w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white placeholder-white/30 text-[11px] uppercase tracking-[0.15em] outline-none focus:border-white/30"})]}),k.jsx("div",{className:"grid grid-cols-4 gap-1 text-[10px] uppercase tracking-[0.18em] font-light",children:["all","planet","moon","minor"].map(E=>k.jsx("button",{onClick:()=>V(E),className:`py-1 rounded-lg text-center uppercase tracking-wider transition-all duration-200 ${P===E?"bg-white/15 text-white font-normal border border-white/20":"text-white/40 hover:text-white/70"}`,children:E==="all"?"All (42)":E==="planet"?"Planets":E==="moon"?"Moons":"Minor"},E))})]}),k.jsx("div",{className:"flex-1 overflow-y-auto no-scrollbar flex flex-col gap-1.5 pr-1",children:We.map(E=>{const S=Ae===E.name;return k.jsxs("button",{onClick:()=>{e(E.name),He(),M(!1)},className:`flex items-center justify-between p-2.5 rounded-xl border transition text-left ${S?"bg-white/15 border-white/30 text-white":"bg-white/[0.02] border-white/5 text-white/70 hover:bg-white/[0.06] hover:text-white"}`,children:[k.jsxs("div",{className:"flex items-center gap-3",children:[k.jsx("span",{className:"w-2 h-2 rounded-full flex-shrink-0",style:{backgroundColor:E.physical.colorHex||"#ffffff"}}),k.jsxs("div",{className:"flex flex-col",children:[k.jsx("span",{className:"text-xs text-white font-light tracking-[0.15em] uppercase",children:E.name}),k.jsxs("span",{className:"text-[10px] text-white/35 uppercase tracking-[0.1em]",children:[E.category.replace("_"," "),E.parentName&&` · ${E.parentName}`]})]})]}),k.jsxs("div",{className:"text-right text-[10px] text-white/40 font-light tracking-wider",children:[k.jsxs("div",{children:[E.physical.meanRadiusKm.toLocaleString()," km"]}),k.jsxs("div",{children:[E.orbit.semiMajorAxisAU.toFixed(2)," AU"]})]})]},E.name)})})]})]})]}):k.jsx("div",{className:"absolute bottom-6 right-6 z-50 pointer-events-auto",children:k.jsxs("button",{onClick:()=>C(!0),className:"flex items-center gap-2 px-3.5 py-1.5 text-xs text-white/50 hover:text-white bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/10 rounded-full transition uppercase tracking-[0.2em] font-light",children:[k.jsx(y2,{size:13}),k.jsx("span",{children:"Show Interface (H)"})]})})},A2=()=>{const t=Ne.useRef(null),e=Ne.useRef(null),[n,i]=Ne.useState(null);Ne.useEffect(()=>{if(!t.current)return;const v=new f2(t.current,m=>{i(m)});return e.current=v,window.__solaris_scene=v,()=>{delete window.__solaris_scene,v.dispose(),e.current=null}},[]);const r=Ne.useCallback(v=>{var m;(m=e.current)==null||m.selectBody(v)},[]),s=Ne.useCallback(()=>{var v;(v=e.current)==null||v.resetView()},[]),o=Ne.useCallback(()=>{if(!e.current)return;const v=e.current.clock.isPaused;e.current.clock.isPaused=!v},[]),a=Ne.useCallback(v=>{e.current&&(e.current.clock.timeMultiplier=v,e.current.clock.isPaused=!1)},[]),l=Ne.useCallback(v=>{var m;(m=e.current)==null||m.setScaleMode(v)},[]),c=Ne.useCallback(v=>{var m;(m=e.current)==null||m.clock.setUtcMs(v)},[]),u=Ne.useCallback(()=>{var v;(v=e.current)==null||v.clock.resetToJ2000()},[]),h=Ne.useCallback(()=>{var v;(v=e.current)==null||v.clock.resetToNow()},[]),f=Ne.useCallback(()=>{var v;(v=e.current)==null||v.toggleConstellations()},[]),p=Ne.useCallback(()=>{var v;(v=e.current)==null||v.toggleAsteroidBelt()},[]),_=Ne.useCallback(()=>{var v;(v=e.current)==null||v.toggleOrbits()},[]);return k.jsxs("div",{className:"relative w-screen h-screen overflow-hidden bg-[#030206]",style:{width:"100vw",height:"100vh",position:"relative",overflow:"hidden"},children:[k.jsx("div",{ref:t,className:"absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing",style:{position:"absolute",top:0,left:0,width:"100%",height:"100%"}}),k.jsx(T2,{telemetry:n,onSelectPlanet:r,onResetView:s,onTogglePlay:o,onSetTimeMultiplier:a,onSetScaleMode:l,onSeekDate:c,onResetToJ2000:u,onResetToNow:h,onToggleConstellations:f,onToggleAsteroidBelt:p,onToggleOrbits:_})]})};bu.createRoot(document.getElementById("root")).render(k.jsx(gx.StrictMode,{children:k.jsx(A2,{})}));
