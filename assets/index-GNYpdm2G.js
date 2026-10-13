var ix=Object.defineProperty;var rx=(t,e,n)=>e in t?ix(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var j=(t,e,n)=>rx(t,typeof e!="symbol"?e+"":e,n);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function n(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=n(r);fetch(r.href,s)}})();function sx(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var cg={exports:{}},nc={},ug={exports:{}},Ge={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var da=Symbol.for("react.element"),ox=Symbol.for("react.portal"),ax=Symbol.for("react.fragment"),lx=Symbol.for("react.strict_mode"),cx=Symbol.for("react.profiler"),ux=Symbol.for("react.provider"),dx=Symbol.for("react.context"),hx=Symbol.for("react.forward_ref"),fx=Symbol.for("react.suspense"),px=Symbol.for("react.memo"),mx=Symbol.for("react.lazy"),Uf=Symbol.iterator;function gx(t){return t===null||typeof t!="object"?null:(t=Uf&&t[Uf]||t["@@iterator"],typeof t=="function"?t:null)}var dg={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},hg=Object.assign,fg={};function Zs(t,e,n){this.props=t,this.context=e,this.refs=fg,this.updater=n||dg}Zs.prototype.isReactComponent={};Zs.prototype.setState=function(t,e){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,t,e,"setState")};Zs.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function pg(){}pg.prototype=Zs.prototype;function fh(t,e,n){this.props=t,this.context=e,this.refs=fg,this.updater=n||dg}var ph=fh.prototype=new pg;ph.constructor=fh;hg(ph,Zs.prototype);ph.isPureReactComponent=!0;var Of=Array.isArray,mg=Object.prototype.hasOwnProperty,mh={current:null},gg={key:!0,ref:!0,__self:!0,__source:!0};function vg(t,e,n){var i,r={},s=null,o=null;if(e!=null)for(i in e.ref!==void 0&&(o=e.ref),e.key!==void 0&&(s=""+e.key),e)mg.call(e,i)&&!gg.hasOwnProperty(i)&&(r[i]=e[i]);var a=arguments.length-2;if(a===1)r.children=n;else if(1<a){for(var l=Array(a),c=0;c<a;c++)l[c]=arguments[c+2];r.children=l}if(t&&t.defaultProps)for(i in a=t.defaultProps,a)r[i]===void 0&&(r[i]=a[i]);return{$$typeof:da,type:t,key:s,ref:o,props:r,_owner:mh.current}}function vx(t,e){return{$$typeof:da,type:t.type,key:e,ref:t.ref,props:t.props,_owner:t._owner}}function gh(t){return typeof t=="object"&&t!==null&&t.$$typeof===da}function xx(t){var e={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(n){return e[n]})}var Ff=/\/+/g;function wc(t,e){return typeof t=="object"&&t!==null&&t.key!=null?xx(""+t.key):e.toString(36)}function ul(t,e,n,i,r){var s=typeof t;(s==="undefined"||s==="boolean")&&(t=null);var o=!1;if(t===null)o=!0;else switch(s){case"string":case"number":o=!0;break;case"object":switch(t.$$typeof){case da:case ox:o=!0}}if(o)return o=t,r=r(o),t=i===""?"."+wc(o,0):i,Of(r)?(n="",t!=null&&(n=t.replace(Ff,"$&/")+"/"),ul(r,e,n,"",function(c){return c})):r!=null&&(gh(r)&&(r=vx(r,n+(!r.key||o&&o.key===r.key?"":(""+r.key).replace(Ff,"$&/")+"/")+t)),e.push(r)),1;if(o=0,i=i===""?".":i+":",Of(t))for(var a=0;a<t.length;a++){s=t[a];var l=i+wc(s,a);o+=ul(s,e,n,l,r)}else if(l=gx(t),typeof l=="function")for(t=l.call(t),a=0;!(s=t.next()).done;)s=s.value,l=i+wc(s,a++),o+=ul(s,e,n,l,r);else if(s==="object")throw e=String(t),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.");return o}function Ma(t,e,n){if(t==null)return t;var i=[],r=0;return ul(t,i,"","",function(s){return e.call(n,s,r++)}),i}function _x(t){if(t._status===-1){var e=t._result;e=e(),e.then(function(n){(t._status===0||t._status===-1)&&(t._status=1,t._result=n)},function(n){(t._status===0||t._status===-1)&&(t._status=2,t._result=n)}),t._status===-1&&(t._status=0,t._result=e)}if(t._status===1)return t._result.default;throw t._result}var ln={current:null},dl={transition:null},yx={ReactCurrentDispatcher:ln,ReactCurrentBatchConfig:dl,ReactCurrentOwner:mh};function xg(){throw Error("act(...) is not supported in production builds of React.")}Ge.Children={map:Ma,forEach:function(t,e,n){Ma(t,function(){e.apply(this,arguments)},n)},count:function(t){var e=0;return Ma(t,function(){e++}),e},toArray:function(t){return Ma(t,function(e){return e})||[]},only:function(t){if(!gh(t))throw Error("React.Children.only expected to receive a single React element child.");return t}};Ge.Component=Zs;Ge.Fragment=ax;Ge.Profiler=cx;Ge.PureComponent=fh;Ge.StrictMode=lx;Ge.Suspense=fx;Ge.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=yx;Ge.act=xg;Ge.cloneElement=function(t,e,n){if(t==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+t+".");var i=hg({},t.props),r=t.key,s=t.ref,o=t._owner;if(e!=null){if(e.ref!==void 0&&(s=e.ref,o=mh.current),e.key!==void 0&&(r=""+e.key),t.type&&t.type.defaultProps)var a=t.type.defaultProps;for(l in e)mg.call(e,l)&&!gg.hasOwnProperty(l)&&(i[l]=e[l]===void 0&&a!==void 0?a[l]:e[l])}var l=arguments.length-2;if(l===1)i.children=n;else if(1<l){a=Array(l);for(var c=0;c<l;c++)a[c]=arguments[c+2];i.children=a}return{$$typeof:da,type:t.type,key:r,ref:s,props:i,_owner:o}};Ge.createContext=function(t){return t={$$typeof:dx,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},t.Provider={$$typeof:ux,_context:t},t.Consumer=t};Ge.createElement=vg;Ge.createFactory=function(t){var e=vg.bind(null,t);return e.type=t,e};Ge.createRef=function(){return{current:null}};Ge.forwardRef=function(t){return{$$typeof:hx,render:t}};Ge.isValidElement=gh;Ge.lazy=function(t){return{$$typeof:mx,_payload:{_status:-1,_result:t},_init:_x}};Ge.memo=function(t,e){return{$$typeof:px,type:t,compare:e===void 0?null:e}};Ge.startTransition=function(t){var e=dl.transition;dl.transition={};try{t()}finally{dl.transition=e}};Ge.unstable_act=xg;Ge.useCallback=function(t,e){return ln.current.useCallback(t,e)};Ge.useContext=function(t){return ln.current.useContext(t)};Ge.useDebugValue=function(){};Ge.useDeferredValue=function(t){return ln.current.useDeferredValue(t)};Ge.useEffect=function(t,e){return ln.current.useEffect(t,e)};Ge.useId=function(){return ln.current.useId()};Ge.useImperativeHandle=function(t,e,n){return ln.current.useImperativeHandle(t,e,n)};Ge.useInsertionEffect=function(t,e){return ln.current.useInsertionEffect(t,e)};Ge.useLayoutEffect=function(t,e){return ln.current.useLayoutEffect(t,e)};Ge.useMemo=function(t,e){return ln.current.useMemo(t,e)};Ge.useReducer=function(t,e,n){return ln.current.useReducer(t,e,n)};Ge.useRef=function(t){return ln.current.useRef(t)};Ge.useState=function(t){return ln.current.useState(t)};Ge.useSyncExternalStore=function(t,e,n){return ln.current.useSyncExternalStore(t,e,n)};Ge.useTransition=function(){return ln.current.useTransition()};Ge.version="18.3.1";ug.exports=Ge;var De=ug.exports;const Mx=sx(De);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Sx=De,wx=Symbol.for("react.element"),Ex=Symbol.for("react.fragment"),Tx=Object.prototype.hasOwnProperty,Ax=Sx.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,bx={key:!0,ref:!0,__self:!0,__source:!0};function _g(t,e,n){var i,r={},s=null,o=null;n!==void 0&&(s=""+n),e.key!==void 0&&(s=""+e.key),e.ref!==void 0&&(o=e.ref);for(i in e)Tx.call(e,i)&&!bx.hasOwnProperty(i)&&(r[i]=e[i]);if(t&&t.defaultProps)for(i in e=t.defaultProps,e)r[i]===void 0&&(r[i]=e[i]);return{$$typeof:wx,type:t,key:s,ref:o,props:r,_owner:Ax.current}}nc.Fragment=Ex;nc.jsx=_g;nc.jsxs=_g;cg.exports=nc;var k=cg.exports,Ru={},yg={exports:{}},Cn={},Mg={exports:{}},Sg={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(t){function e(N,$){var Q=N.length;N.push($);e:for(;0<Q;){var oe=Q-1>>>1,_e=N[oe];if(0<r(_e,$))N[oe]=$,N[Q]=_e,Q=oe;else break e}}function n(N){return N.length===0?null:N[0]}function i(N){if(N.length===0)return null;var $=N[0],Q=N.pop();if(Q!==$){N[0]=Q;e:for(var oe=0,_e=N.length,Ve=_e>>>1;oe<Ve;){var K=2*(oe+1)-1,ne=N[K],ce=K+1,ae=N[ce];if(0>r(ne,Q))ce<_e&&0>r(ae,ne)?(N[oe]=ae,N[ce]=Q,oe=ce):(N[oe]=ne,N[K]=Q,oe=K);else if(ce<_e&&0>r(ae,Q))N[oe]=ae,N[ce]=Q,oe=ce;else break e}}return $}function r(N,$){var Q=N.sortIndex-$.sortIndex;return Q!==0?Q:N.id-$.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;t.unstable_now=function(){return s.now()}}else{var o=Date,a=o.now();t.unstable_now=function(){return o.now()-a}}var l=[],c=[],d=1,h=null,f=3,p=!1,v=!1,y=!1,m=typeof setTimeout=="function"?setTimeout:null,u=typeof clearTimeout=="function"?clearTimeout:null,g=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function x(N){for(var $=n(c);$!==null;){if($.callback===null)i(c);else if($.startTime<=N)i(c),$.sortIndex=$.expirationTime,e(l,$);else break;$=n(c)}}function _(N){if(y=!1,x(N),!v)if(n(l)!==null)v=!0,Y(P);else{var $=n(c);$!==null&&te(_,$.startTime-N)}}function P(N,$){v=!1,y&&(y=!1,u(b),b=-1),p=!0;var Q=f;try{for(x($),h=n(l);h!==null&&(!(h.expirationTime>$)||N&&!D());){var oe=h.callback;if(typeof oe=="function"){h.callback=null,f=h.priorityLevel;var _e=oe(h.expirationTime<=$);$=t.unstable_now(),typeof _e=="function"?h.callback=_e:h===n(l)&&i(l),x($)}else i(l);h=n(l)}if(h!==null)var Ve=!0;else{var K=n(c);K!==null&&te(_,K.startTime-$),Ve=!1}return Ve}finally{h=null,f=Q,p=!1}}var T=!1,A=null,b=-1,w=5,M=-1;function D(){return!(t.unstable_now()-M<w)}function V(){if(A!==null){var N=t.unstable_now();M=N;var $=!0;try{$=A(!0,N)}finally{$?z():(T=!1,A=null)}}else T=!1}var z;if(typeof g=="function")z=function(){g(V)};else if(typeof MessageChannel<"u"){var X=new MessageChannel,Z=X.port2;X.port1.onmessage=V,z=function(){Z.postMessage(null)}}else z=function(){m(V,0)};function Y(N){A=N,T||(T=!0,z())}function te(N,$){b=m(function(){N(t.unstable_now())},$)}t.unstable_IdlePriority=5,t.unstable_ImmediatePriority=1,t.unstable_LowPriority=4,t.unstable_NormalPriority=3,t.unstable_Profiling=null,t.unstable_UserBlockingPriority=2,t.unstable_cancelCallback=function(N){N.callback=null},t.unstable_continueExecution=function(){v||p||(v=!0,Y(P))},t.unstable_forceFrameRate=function(N){0>N||125<N?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):w=0<N?Math.floor(1e3/N):5},t.unstable_getCurrentPriorityLevel=function(){return f},t.unstable_getFirstCallbackNode=function(){return n(l)},t.unstable_next=function(N){switch(f){case 1:case 2:case 3:var $=3;break;default:$=f}var Q=f;f=$;try{return N()}finally{f=Q}},t.unstable_pauseExecution=function(){},t.unstable_requestPaint=function(){},t.unstable_runWithPriority=function(N,$){switch(N){case 1:case 2:case 3:case 4:case 5:break;default:N=3}var Q=f;f=N;try{return $()}finally{f=Q}},t.unstable_scheduleCallback=function(N,$,Q){var oe=t.unstable_now();switch(typeof Q=="object"&&Q!==null?(Q=Q.delay,Q=typeof Q=="number"&&0<Q?oe+Q:oe):Q=oe,N){case 1:var _e=-1;break;case 2:_e=250;break;case 5:_e=1073741823;break;case 4:_e=1e4;break;default:_e=5e3}return _e=Q+_e,N={id:d++,callback:$,priorityLevel:N,startTime:Q,expirationTime:_e,sortIndex:-1},Q>oe?(N.sortIndex=Q,e(c,N),n(l)===null&&N===n(c)&&(y?(u(b),b=-1):y=!0,te(_,Q-oe))):(N.sortIndex=_e,e(l,N),v||p||(v=!0,Y(P))),N},t.unstable_shouldYield=D,t.unstable_wrapCallback=function(N){var $=f;return function(){var Q=f;f=$;try{return N.apply(this,arguments)}finally{f=Q}}}})(Sg);Mg.exports=Sg;var Cx=Mg.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Px=De,bn=Cx;function ie(t){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+t,n=1;n<arguments.length;n++)e+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var wg=new Set,Wo={};function Xr(t,e){Fs(t,e),Fs(t+"Capture",e)}function Fs(t,e){for(Wo[t]=e,t=0;t<e.length;t++)wg.add(e[t])}var Ai=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Du=Object.prototype.hasOwnProperty,Rx=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,kf={},Bf={};function Dx(t){return Du.call(Bf,t)?!0:Du.call(kf,t)?!1:Rx.test(t)?Bf[t]=!0:(kf[t]=!0,!1)}function Nx(t,e,n,i){if(n!==null&&n.type===0)return!1;switch(typeof e){case"function":case"symbol":return!0;case"boolean":return i?!1:n!==null?!n.acceptsBooleans:(t=t.toLowerCase().slice(0,5),t!=="data-"&&t!=="aria-");default:return!1}}function Lx(t,e,n,i){if(e===null||typeof e>"u"||Nx(t,e,n,i))return!0;if(i)return!1;if(n!==null)switch(n.type){case 3:return!e;case 4:return e===!1;case 5:return isNaN(e);case 6:return isNaN(e)||1>e}return!1}function cn(t,e,n,i,r,s,o){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=i,this.attributeNamespace=r,this.mustUseProperty=n,this.propertyName=t,this.type=e,this.sanitizeURL=s,this.removeEmptyString=o}var jt={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t){jt[t]=new cn(t,0,!1,t,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(t){var e=t[0];jt[e]=new cn(e,1,!1,t[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(t){jt[t]=new cn(t,2,!1,t.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(t){jt[t]=new cn(t,2,!1,t,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t){jt[t]=new cn(t,3,!1,t.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(t){jt[t]=new cn(t,3,!0,t,null,!1,!1)});["capture","download"].forEach(function(t){jt[t]=new cn(t,4,!1,t,null,!1,!1)});["cols","rows","size","span"].forEach(function(t){jt[t]=new cn(t,6,!1,t,null,!1,!1)});["rowSpan","start"].forEach(function(t){jt[t]=new cn(t,5,!1,t.toLowerCase(),null,!1,!1)});var vh=/[\-:]([a-z])/g;function xh(t){return t[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t){var e=t.replace(vh,xh);jt[e]=new cn(e,1,!1,t,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t){var e=t.replace(vh,xh);jt[e]=new cn(e,1,!1,t,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(t){var e=t.replace(vh,xh);jt[e]=new cn(e,1,!1,t,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(t){jt[t]=new cn(t,1,!1,t.toLowerCase(),null,!1,!1)});jt.xlinkHref=new cn("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(t){jt[t]=new cn(t,1,!1,t.toLowerCase(),null,!0,!0)});function _h(t,e,n,i){var r=jt.hasOwnProperty(e)?jt[e]:null;(r!==null?r.type!==0:i||!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N")&&(Lx(e,n,r,i)&&(n=null),i||r===null?Dx(e)&&(n===null?t.removeAttribute(e):t.setAttribute(e,""+n)):r.mustUseProperty?t[r.propertyName]=n===null?r.type===3?!1:"":n:(e=r.attributeName,i=r.attributeNamespace,n===null?t.removeAttribute(e):(r=r.type,n=r===3||r===4&&n===!0?"":""+n,i?t.setAttributeNS(i,e,n):t.setAttribute(e,n))))}var Ni=Px.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Sa=Symbol.for("react.element"),ms=Symbol.for("react.portal"),gs=Symbol.for("react.fragment"),yh=Symbol.for("react.strict_mode"),Nu=Symbol.for("react.profiler"),Eg=Symbol.for("react.provider"),Tg=Symbol.for("react.context"),Mh=Symbol.for("react.forward_ref"),Lu=Symbol.for("react.suspense"),Iu=Symbol.for("react.suspense_list"),Sh=Symbol.for("react.memo"),Vi=Symbol.for("react.lazy"),Ag=Symbol.for("react.offscreen"),zf=Symbol.iterator;function oo(t){return t===null||typeof t!="object"?null:(t=zf&&t[zf]||t["@@iterator"],typeof t=="function"?t:null)}var Et=Object.assign,Ec;function Eo(t){if(Ec===void 0)try{throw Error()}catch(n){var e=n.stack.trim().match(/\n( *(at )?)/);Ec=e&&e[1]||""}return`
`+Ec+t}var Tc=!1;function Ac(t,e){if(!t||Tc)return"";Tc=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(e)if(e=function(){throw Error()},Object.defineProperty(e.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(e,[])}catch(c){var i=c}Reflect.construct(t,[],e)}else{try{e.call()}catch(c){i=c}t.call(e.prototype)}else{try{throw Error()}catch(c){i=c}t()}}catch(c){if(c&&i&&typeof c.stack=="string"){for(var r=c.stack.split(`
`),s=i.stack.split(`
`),o=r.length-1,a=s.length-1;1<=o&&0<=a&&r[o]!==s[a];)a--;for(;1<=o&&0<=a;o--,a--)if(r[o]!==s[a]){if(o!==1||a!==1)do if(o--,a--,0>a||r[o]!==s[a]){var l=`
`+r[o].replace(" at new "," at ");return t.displayName&&l.includes("<anonymous>")&&(l=l.replace("<anonymous>",t.displayName)),l}while(1<=o&&0<=a);break}}}finally{Tc=!1,Error.prepareStackTrace=n}return(t=t?t.displayName||t.name:"")?Eo(t):""}function Ix(t){switch(t.tag){case 5:return Eo(t.type);case 16:return Eo("Lazy");case 13:return Eo("Suspense");case 19:return Eo("SuspenseList");case 0:case 2:case 15:return t=Ac(t.type,!1),t;case 11:return t=Ac(t.type.render,!1),t;case 1:return t=Ac(t.type,!0),t;default:return""}}function Uu(t){if(t==null)return null;if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case gs:return"Fragment";case ms:return"Portal";case Nu:return"Profiler";case yh:return"StrictMode";case Lu:return"Suspense";case Iu:return"SuspenseList"}if(typeof t=="object")switch(t.$$typeof){case Tg:return(t.displayName||"Context")+".Consumer";case Eg:return(t._context.displayName||"Context")+".Provider";case Mh:var e=t.render;return t=t.displayName,t||(t=e.displayName||e.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case Sh:return e=t.displayName||null,e!==null?e:Uu(t.type)||"Memo";case Vi:e=t._payload,t=t._init;try{return Uu(t(e))}catch{}}return null}function Ux(t){var e=t.type;switch(t.tag){case 24:return"Cache";case 9:return(e.displayName||"Context")+".Consumer";case 10:return(e._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return t=e.render,t=t.displayName||t.name||"",e.displayName||(t!==""?"ForwardRef("+t+")":"ForwardRef");case 7:return"Fragment";case 5:return e;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Uu(e);case 8:return e===yh?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e}return null}function lr(t){switch(typeof t){case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function bg(t){var e=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function Ox(t){var e=bg(t)?"checked":"value",n=Object.getOwnPropertyDescriptor(t.constructor.prototype,e),i=""+t[e];if(!t.hasOwnProperty(e)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var r=n.get,s=n.set;return Object.defineProperty(t,e,{configurable:!0,get:function(){return r.call(this)},set:function(o){i=""+o,s.call(this,o)}}),Object.defineProperty(t,e,{enumerable:n.enumerable}),{getValue:function(){return i},setValue:function(o){i=""+o},stopTracking:function(){t._valueTracker=null,delete t[e]}}}}function wa(t){t._valueTracker||(t._valueTracker=Ox(t))}function Cg(t){if(!t)return!1;var e=t._valueTracker;if(!e)return!0;var n=e.getValue(),i="";return t&&(i=bg(t)?t.checked?"true":"false":t.value),t=i,t!==n?(e.setValue(t),!0):!1}function Cl(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}function Ou(t,e){var n=e.checked;return Et({},e,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??t._wrapperState.initialChecked})}function Hf(t,e){var n=e.defaultValue==null?"":e.defaultValue,i=e.checked!=null?e.checked:e.defaultChecked;n=lr(e.value!=null?e.value:n),t._wrapperState={initialChecked:i,initialValue:n,controlled:e.type==="checkbox"||e.type==="radio"?e.checked!=null:e.value!=null}}function Pg(t,e){e=e.checked,e!=null&&_h(t,"checked",e,!1)}function Fu(t,e){Pg(t,e);var n=lr(e.value),i=e.type;if(n!=null)i==="number"?(n===0&&t.value===""||t.value!=n)&&(t.value=""+n):t.value!==""+n&&(t.value=""+n);else if(i==="submit"||i==="reset"){t.removeAttribute("value");return}e.hasOwnProperty("value")?ku(t,e.type,n):e.hasOwnProperty("defaultValue")&&ku(t,e.type,lr(e.defaultValue)),e.checked==null&&e.defaultChecked!=null&&(t.defaultChecked=!!e.defaultChecked)}function Vf(t,e,n){if(e.hasOwnProperty("value")||e.hasOwnProperty("defaultValue")){var i=e.type;if(!(i!=="submit"&&i!=="reset"||e.value!==void 0&&e.value!==null))return;e=""+t._wrapperState.initialValue,n||e===t.value||(t.value=e),t.defaultValue=e}n=t.name,n!==""&&(t.name=""),t.defaultChecked=!!t._wrapperState.initialChecked,n!==""&&(t.name=n)}function ku(t,e,n){(e!=="number"||Cl(t.ownerDocument)!==t)&&(n==null?t.defaultValue=""+t._wrapperState.initialValue:t.defaultValue!==""+n&&(t.defaultValue=""+n))}var To=Array.isArray;function Ps(t,e,n,i){if(t=t.options,e){e={};for(var r=0;r<n.length;r++)e["$"+n[r]]=!0;for(n=0;n<t.length;n++)r=e.hasOwnProperty("$"+t[n].value),t[n].selected!==r&&(t[n].selected=r),r&&i&&(t[n].defaultSelected=!0)}else{for(n=""+lr(n),e=null,r=0;r<t.length;r++){if(t[r].value===n){t[r].selected=!0,i&&(t[r].defaultSelected=!0);return}e!==null||t[r].disabled||(e=t[r])}e!==null&&(e.selected=!0)}}function Bu(t,e){if(e.dangerouslySetInnerHTML!=null)throw Error(ie(91));return Et({},e,{value:void 0,defaultValue:void 0,children:""+t._wrapperState.initialValue})}function Gf(t,e){var n=e.value;if(n==null){if(n=e.children,e=e.defaultValue,n!=null){if(e!=null)throw Error(ie(92));if(To(n)){if(1<n.length)throw Error(ie(93));n=n[0]}e=n}e==null&&(e=""),n=e}t._wrapperState={initialValue:lr(n)}}function Rg(t,e){var n=lr(e.value),i=lr(e.defaultValue);n!=null&&(n=""+n,n!==t.value&&(t.value=n),e.defaultValue==null&&t.defaultValue!==n&&(t.defaultValue=n)),i!=null&&(t.defaultValue=""+i)}function Wf(t){var e=t.textContent;e===t._wrapperState.initialValue&&e!==""&&e!==null&&(t.value=e)}function Dg(t){switch(t){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function zu(t,e){return t==null||t==="http://www.w3.org/1999/xhtml"?Dg(e):t==="http://www.w3.org/2000/svg"&&e==="foreignObject"?"http://www.w3.org/1999/xhtml":t}var Ea,Ng=function(t){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(e,n,i,r){MSApp.execUnsafeLocalFunction(function(){return t(e,n,i,r)})}:t}(function(t,e){if(t.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in t)t.innerHTML=e;else{for(Ea=Ea||document.createElement("div"),Ea.innerHTML="<svg>"+e.valueOf().toString()+"</svg>",e=Ea.firstChild;t.firstChild;)t.removeChild(t.firstChild);for(;e.firstChild;)t.appendChild(e.firstChild)}});function jo(t,e){if(e){var n=t.firstChild;if(n&&n===t.lastChild&&n.nodeType===3){n.nodeValue=e;return}}t.textContent=e}var Do={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Fx=["Webkit","ms","Moz","O"];Object.keys(Do).forEach(function(t){Fx.forEach(function(e){e=e+t.charAt(0).toUpperCase()+t.substring(1),Do[e]=Do[t]})});function Lg(t,e,n){return e==null||typeof e=="boolean"||e===""?"":n||typeof e!="number"||e===0||Do.hasOwnProperty(t)&&Do[t]?(""+e).trim():e+"px"}function Ig(t,e){t=t.style;for(var n in e)if(e.hasOwnProperty(n)){var i=n.indexOf("--")===0,r=Lg(n,e[n],i);n==="float"&&(n="cssFloat"),i?t.setProperty(n,r):t[n]=r}}var kx=Et({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Hu(t,e){if(e){if(kx[t]&&(e.children!=null||e.dangerouslySetInnerHTML!=null))throw Error(ie(137,t));if(e.dangerouslySetInnerHTML!=null){if(e.children!=null)throw Error(ie(60));if(typeof e.dangerouslySetInnerHTML!="object"||!("__html"in e.dangerouslySetInnerHTML))throw Error(ie(61))}if(e.style!=null&&typeof e.style!="object")throw Error(ie(62))}}function Vu(t,e){if(t.indexOf("-")===-1)return typeof e.is=="string";switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Gu=null;function wh(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var Wu=null,Rs=null,Ds=null;function jf(t){if(t=pa(t)){if(typeof Wu!="function")throw Error(ie(280));var e=t.stateNode;e&&(e=ac(e),Wu(t.stateNode,t.type,e))}}function Ug(t){Rs?Ds?Ds.push(t):Ds=[t]:Rs=t}function Og(){if(Rs){var t=Rs,e=Ds;if(Ds=Rs=null,jf(t),e)for(t=0;t<e.length;t++)jf(e[t])}}function Fg(t,e){return t(e)}function kg(){}var bc=!1;function Bg(t,e,n){if(bc)return t(e,n);bc=!0;try{return Fg(t,e,n)}finally{bc=!1,(Rs!==null||Ds!==null)&&(kg(),Og())}}function Xo(t,e){var n=t.stateNode;if(n===null)return null;var i=ac(n);if(i===null)return null;n=i[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(i=!i.disabled)||(t=t.type,i=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!i;break e;default:t=!1}if(t)return null;if(n&&typeof n!="function")throw Error(ie(231,e,typeof n));return n}var ju=!1;if(Ai)try{var ao={};Object.defineProperty(ao,"passive",{get:function(){ju=!0}}),window.addEventListener("test",ao,ao),window.removeEventListener("test",ao,ao)}catch{ju=!1}function Bx(t,e,n,i,r,s,o,a,l){var c=Array.prototype.slice.call(arguments,3);try{e.apply(n,c)}catch(d){this.onError(d)}}var No=!1,Pl=null,Rl=!1,Xu=null,zx={onError:function(t){No=!0,Pl=t}};function Hx(t,e,n,i,r,s,o,a,l){No=!1,Pl=null,Bx.apply(zx,arguments)}function Vx(t,e,n,i,r,s,o,a,l){if(Hx.apply(this,arguments),No){if(No){var c=Pl;No=!1,Pl=null}else throw Error(ie(198));Rl||(Rl=!0,Xu=c)}}function Kr(t){var e=t,n=t;if(t.alternate)for(;e.return;)e=e.return;else{t=e;do e=t,e.flags&4098&&(n=e.return),t=e.return;while(t)}return e.tag===3?n:null}function zg(t){if(t.tag===13){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function Xf(t){if(Kr(t)!==t)throw Error(ie(188))}function Gx(t){var e=t.alternate;if(!e){if(e=Kr(t),e===null)throw Error(ie(188));return e!==t?null:t}for(var n=t,i=e;;){var r=n.return;if(r===null)break;var s=r.alternate;if(s===null){if(i=r.return,i!==null){n=i;continue}break}if(r.child===s.child){for(s=r.child;s;){if(s===n)return Xf(r),t;if(s===i)return Xf(r),e;s=s.sibling}throw Error(ie(188))}if(n.return!==i.return)n=r,i=s;else{for(var o=!1,a=r.child;a;){if(a===n){o=!0,n=r,i=s;break}if(a===i){o=!0,i=r,n=s;break}a=a.sibling}if(!o){for(a=s.child;a;){if(a===n){o=!0,n=s,i=r;break}if(a===i){o=!0,i=s,n=r;break}a=a.sibling}if(!o)throw Error(ie(189))}}if(n.alternate!==i)throw Error(ie(190))}if(n.tag!==3)throw Error(ie(188));return n.stateNode.current===n?t:e}function Hg(t){return t=Gx(t),t!==null?Vg(t):null}function Vg(t){if(t.tag===5||t.tag===6)return t;for(t=t.child;t!==null;){var e=Vg(t);if(e!==null)return e;t=t.sibling}return null}var Gg=bn.unstable_scheduleCallback,Kf=bn.unstable_cancelCallback,Wx=bn.unstable_shouldYield,jx=bn.unstable_requestPaint,bt=bn.unstable_now,Xx=bn.unstable_getCurrentPriorityLevel,Eh=bn.unstable_ImmediatePriority,Wg=bn.unstable_UserBlockingPriority,Dl=bn.unstable_NormalPriority,Kx=bn.unstable_LowPriority,jg=bn.unstable_IdlePriority,ic=null,li=null;function Yx(t){if(li&&typeof li.onCommitFiberRoot=="function")try{li.onCommitFiberRoot(ic,t,void 0,(t.current.flags&128)===128)}catch{}}var Qn=Math.clz32?Math.clz32:Zx,qx=Math.log,$x=Math.LN2;function Zx(t){return t>>>=0,t===0?32:31-(qx(t)/$x|0)|0}var Ta=64,Aa=4194304;function Ao(t){switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return t&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return t}}function Nl(t,e){var n=t.pendingLanes;if(n===0)return 0;var i=0,r=t.suspendedLanes,s=t.pingedLanes,o=n&268435455;if(o!==0){var a=o&~r;a!==0?i=Ao(a):(s&=o,s!==0&&(i=Ao(s)))}else o=n&~r,o!==0?i=Ao(o):s!==0&&(i=Ao(s));if(i===0)return 0;if(e!==0&&e!==i&&!(e&r)&&(r=i&-i,s=e&-e,r>=s||r===16&&(s&4194240)!==0))return e;if(i&4&&(i|=n&16),e=t.entangledLanes,e!==0)for(t=t.entanglements,e&=i;0<e;)n=31-Qn(e),r=1<<n,i|=t[n],e&=~r;return i}function Qx(t,e){switch(t){case 1:case 2:case 4:return e+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Jx(t,e){for(var n=t.suspendedLanes,i=t.pingedLanes,r=t.expirationTimes,s=t.pendingLanes;0<s;){var o=31-Qn(s),a=1<<o,l=r[o];l===-1?(!(a&n)||a&i)&&(r[o]=Qx(a,e)):l<=e&&(t.expiredLanes|=a),s&=~a}}function Ku(t){return t=t.pendingLanes&-1073741825,t!==0?t:t&1073741824?1073741824:0}function Xg(){var t=Ta;return Ta<<=1,!(Ta&4194240)&&(Ta=64),t}function Cc(t){for(var e=[],n=0;31>n;n++)e.push(t);return e}function ha(t,e,n){t.pendingLanes|=e,e!==536870912&&(t.suspendedLanes=0,t.pingedLanes=0),t=t.eventTimes,e=31-Qn(e),t[e]=n}function e_(t,e){var n=t.pendingLanes&~e;t.pendingLanes=e,t.suspendedLanes=0,t.pingedLanes=0,t.expiredLanes&=e,t.mutableReadLanes&=e,t.entangledLanes&=e,e=t.entanglements;var i=t.eventTimes;for(t=t.expirationTimes;0<n;){var r=31-Qn(n),s=1<<r;e[r]=0,i[r]=-1,t[r]=-1,n&=~s}}function Th(t,e){var n=t.entangledLanes|=e;for(t=t.entanglements;n;){var i=31-Qn(n),r=1<<i;r&e|t[i]&e&&(t[i]|=e),n&=~r}}var it=0;function Kg(t){return t&=-t,1<t?4<t?t&268435455?16:536870912:4:1}var Yg,Ah,qg,$g,Zg,Yu=!1,ba=[],$i=null,Zi=null,Qi=null,Ko=new Map,Yo=new Map,Xi=[],t_="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Yf(t,e){switch(t){case"focusin":case"focusout":$i=null;break;case"dragenter":case"dragleave":Zi=null;break;case"mouseover":case"mouseout":Qi=null;break;case"pointerover":case"pointerout":Ko.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":Yo.delete(e.pointerId)}}function lo(t,e,n,i,r,s){return t===null||t.nativeEvent!==s?(t={blockedOn:e,domEventName:n,eventSystemFlags:i,nativeEvent:s,targetContainers:[r]},e!==null&&(e=pa(e),e!==null&&Ah(e)),t):(t.eventSystemFlags|=i,e=t.targetContainers,r!==null&&e.indexOf(r)===-1&&e.push(r),t)}function n_(t,e,n,i,r){switch(e){case"focusin":return $i=lo($i,t,e,n,i,r),!0;case"dragenter":return Zi=lo(Zi,t,e,n,i,r),!0;case"mouseover":return Qi=lo(Qi,t,e,n,i,r),!0;case"pointerover":var s=r.pointerId;return Ko.set(s,lo(Ko.get(s)||null,t,e,n,i,r)),!0;case"gotpointercapture":return s=r.pointerId,Yo.set(s,lo(Yo.get(s)||null,t,e,n,i,r)),!0}return!1}function Qg(t){var e=Dr(t.target);if(e!==null){var n=Kr(e);if(n!==null){if(e=n.tag,e===13){if(e=zg(n),e!==null){t.blockedOn=e,Zg(t.priority,function(){qg(n)});return}}else if(e===3&&n.stateNode.current.memoizedState.isDehydrated){t.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}t.blockedOn=null}function hl(t){if(t.blockedOn!==null)return!1;for(var e=t.targetContainers;0<e.length;){var n=qu(t.domEventName,t.eventSystemFlags,e[0],t.nativeEvent);if(n===null){n=t.nativeEvent;var i=new n.constructor(n.type,n);Gu=i,n.target.dispatchEvent(i),Gu=null}else return e=pa(n),e!==null&&Ah(e),t.blockedOn=n,!1;e.shift()}return!0}function qf(t,e,n){hl(t)&&n.delete(e)}function i_(){Yu=!1,$i!==null&&hl($i)&&($i=null),Zi!==null&&hl(Zi)&&(Zi=null),Qi!==null&&hl(Qi)&&(Qi=null),Ko.forEach(qf),Yo.forEach(qf)}function co(t,e){t.blockedOn===e&&(t.blockedOn=null,Yu||(Yu=!0,bn.unstable_scheduleCallback(bn.unstable_NormalPriority,i_)))}function qo(t){function e(r){return co(r,t)}if(0<ba.length){co(ba[0],t);for(var n=1;n<ba.length;n++){var i=ba[n];i.blockedOn===t&&(i.blockedOn=null)}}for($i!==null&&co($i,t),Zi!==null&&co(Zi,t),Qi!==null&&co(Qi,t),Ko.forEach(e),Yo.forEach(e),n=0;n<Xi.length;n++)i=Xi[n],i.blockedOn===t&&(i.blockedOn=null);for(;0<Xi.length&&(n=Xi[0],n.blockedOn===null);)Qg(n),n.blockedOn===null&&Xi.shift()}var Ns=Ni.ReactCurrentBatchConfig,Ll=!0;function r_(t,e,n,i){var r=it,s=Ns.transition;Ns.transition=null;try{it=1,bh(t,e,n,i)}finally{it=r,Ns.transition=s}}function s_(t,e,n,i){var r=it,s=Ns.transition;Ns.transition=null;try{it=4,bh(t,e,n,i)}finally{it=r,Ns.transition=s}}function bh(t,e,n,i){if(Ll){var r=qu(t,e,n,i);if(r===null)kc(t,e,i,Il,n),Yf(t,i);else if(n_(r,t,e,n,i))i.stopPropagation();else if(Yf(t,i),e&4&&-1<t_.indexOf(t)){for(;r!==null;){var s=pa(r);if(s!==null&&Yg(s),s=qu(t,e,n,i),s===null&&kc(t,e,i,Il,n),s===r)break;r=s}r!==null&&i.stopPropagation()}else kc(t,e,i,null,n)}}var Il=null;function qu(t,e,n,i){if(Il=null,t=wh(i),t=Dr(t),t!==null)if(e=Kr(t),e===null)t=null;else if(n=e.tag,n===13){if(t=zg(e),t!==null)return t;t=null}else if(n===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;t=null}else e!==t&&(t=null);return Il=t,null}function Jg(t){switch(t){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(Xx()){case Eh:return 1;case Wg:return 4;case Dl:case Kx:return 16;case jg:return 536870912;default:return 16}default:return 16}}var Yi=null,Ch=null,fl=null;function e0(){if(fl)return fl;var t,e=Ch,n=e.length,i,r="value"in Yi?Yi.value:Yi.textContent,s=r.length;for(t=0;t<n&&e[t]===r[t];t++);var o=n-t;for(i=1;i<=o&&e[n-i]===r[s-i];i++);return fl=r.slice(t,1<i?1-i:void 0)}function pl(t){var e=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&e===13&&(t=13)):t=e,t===10&&(t=13),32<=t||t===13?t:0}function Ca(){return!0}function $f(){return!1}function Pn(t){function e(n,i,r,s,o){this._reactName=n,this._targetInst=r,this.type=i,this.nativeEvent=s,this.target=o,this.currentTarget=null;for(var a in t)t.hasOwnProperty(a)&&(n=t[a],this[a]=n?n(s):s[a]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?Ca:$f,this.isPropagationStopped=$f,this}return Et(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Ca)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Ca)},persist:function(){},isPersistent:Ca}),e}var Qs={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Ph=Pn(Qs),fa=Et({},Qs,{view:0,detail:0}),o_=Pn(fa),Pc,Rc,uo,rc=Et({},fa,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Rh,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==uo&&(uo&&t.type==="mousemove"?(Pc=t.screenX-uo.screenX,Rc=t.screenY-uo.screenY):Rc=Pc=0,uo=t),Pc)},movementY:function(t){return"movementY"in t?t.movementY:Rc}}),Zf=Pn(rc),a_=Et({},rc,{dataTransfer:0}),l_=Pn(a_),c_=Et({},fa,{relatedTarget:0}),Dc=Pn(c_),u_=Et({},Qs,{animationName:0,elapsedTime:0,pseudoElement:0}),d_=Pn(u_),h_=Et({},Qs,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),f_=Pn(h_),p_=Et({},Qs,{data:0}),Qf=Pn(p_),m_={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},g_={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},v_={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function x_(t){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(t):(t=v_[t])?!!e[t]:!1}function Rh(){return x_}var __=Et({},fa,{key:function(t){if(t.key){var e=m_[t.key]||t.key;if(e!=="Unidentified")return e}return t.type==="keypress"?(t=pl(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?g_[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Rh,charCode:function(t){return t.type==="keypress"?pl(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?pl(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),y_=Pn(__),M_=Et({},rc,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Jf=Pn(M_),S_=Et({},fa,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Rh}),w_=Pn(S_),E_=Et({},Qs,{propertyName:0,elapsedTime:0,pseudoElement:0}),T_=Pn(E_),A_=Et({},rc,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),b_=Pn(A_),C_=[9,13,27,32],Dh=Ai&&"CompositionEvent"in window,Lo=null;Ai&&"documentMode"in document&&(Lo=document.documentMode);var P_=Ai&&"TextEvent"in window&&!Lo,t0=Ai&&(!Dh||Lo&&8<Lo&&11>=Lo),ep=" ",tp=!1;function n0(t,e){switch(t){case"keyup":return C_.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function i0(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var vs=!1;function R_(t,e){switch(t){case"compositionend":return i0(e);case"keypress":return e.which!==32?null:(tp=!0,ep);case"textInput":return t=e.data,t===ep&&tp?null:t;default:return null}}function D_(t,e){if(vs)return t==="compositionend"||!Dh&&n0(t,e)?(t=e0(),fl=Ch=Yi=null,vs=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return t0&&e.locale!=="ko"?null:e.data;default:return null}}var N_={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function np(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e==="input"?!!N_[t.type]:e==="textarea"}function r0(t,e,n,i){Ug(i),e=Ul(e,"onChange"),0<e.length&&(n=new Ph("onChange","change",null,n,i),t.push({event:n,listeners:e}))}var Io=null,$o=null;function L_(t){m0(t,0)}function sc(t){var e=ys(t);if(Cg(e))return t}function I_(t,e){if(t==="change")return e}var s0=!1;if(Ai){var Nc;if(Ai){var Lc="oninput"in document;if(!Lc){var ip=document.createElement("div");ip.setAttribute("oninput","return;"),Lc=typeof ip.oninput=="function"}Nc=Lc}else Nc=!1;s0=Nc&&(!document.documentMode||9<document.documentMode)}function rp(){Io&&(Io.detachEvent("onpropertychange",o0),$o=Io=null)}function o0(t){if(t.propertyName==="value"&&sc($o)){var e=[];r0(e,$o,t,wh(t)),Bg(L_,e)}}function U_(t,e,n){t==="focusin"?(rp(),Io=e,$o=n,Io.attachEvent("onpropertychange",o0)):t==="focusout"&&rp()}function O_(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return sc($o)}function F_(t,e){if(t==="click")return sc(e)}function k_(t,e){if(t==="input"||t==="change")return sc(e)}function B_(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var ei=typeof Object.is=="function"?Object.is:B_;function Zo(t,e){if(ei(t,e))return!0;if(typeof t!="object"||t===null||typeof e!="object"||e===null)return!1;var n=Object.keys(t),i=Object.keys(e);if(n.length!==i.length)return!1;for(i=0;i<n.length;i++){var r=n[i];if(!Du.call(e,r)||!ei(t[r],e[r]))return!1}return!0}function sp(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function op(t,e){var n=sp(t);t=0;for(var i;n;){if(n.nodeType===3){if(i=t+n.textContent.length,t<=e&&i>=e)return{node:n,offset:e-t};t=i}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=sp(n)}}function a0(t,e){return t&&e?t===e?!0:t&&t.nodeType===3?!1:e&&e.nodeType===3?a0(t,e.parentNode):"contains"in t?t.contains(e):t.compareDocumentPosition?!!(t.compareDocumentPosition(e)&16):!1:!1}function l0(){for(var t=window,e=Cl();e instanceof t.HTMLIFrameElement;){try{var n=typeof e.contentWindow.location.href=="string"}catch{n=!1}if(n)t=e.contentWindow;else break;e=Cl(t.document)}return e}function Nh(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e&&(e==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||e==="textarea"||t.contentEditable==="true")}function z_(t){var e=l0(),n=t.focusedElem,i=t.selectionRange;if(e!==n&&n&&n.ownerDocument&&a0(n.ownerDocument.documentElement,n)){if(i!==null&&Nh(n)){if(e=i.start,t=i.end,t===void 0&&(t=e),"selectionStart"in n)n.selectionStart=e,n.selectionEnd=Math.min(t,n.value.length);else if(t=(e=n.ownerDocument||document)&&e.defaultView||window,t.getSelection){t=t.getSelection();var r=n.textContent.length,s=Math.min(i.start,r);i=i.end===void 0?s:Math.min(i.end,r),!t.extend&&s>i&&(r=i,i=s,s=r),r=op(n,s);var o=op(n,i);r&&o&&(t.rangeCount!==1||t.anchorNode!==r.node||t.anchorOffset!==r.offset||t.focusNode!==o.node||t.focusOffset!==o.offset)&&(e=e.createRange(),e.setStart(r.node,r.offset),t.removeAllRanges(),s>i?(t.addRange(e),t.extend(o.node,o.offset)):(e.setEnd(o.node,o.offset),t.addRange(e)))}}for(e=[],t=n;t=t.parentNode;)t.nodeType===1&&e.push({element:t,left:t.scrollLeft,top:t.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<e.length;n++)t=e[n],t.element.scrollLeft=t.left,t.element.scrollTop=t.top}}var H_=Ai&&"documentMode"in document&&11>=document.documentMode,xs=null,$u=null,Uo=null,Zu=!1;function ap(t,e,n){var i=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Zu||xs==null||xs!==Cl(i)||(i=xs,"selectionStart"in i&&Nh(i)?i={start:i.selectionStart,end:i.selectionEnd}:(i=(i.ownerDocument&&i.ownerDocument.defaultView||window).getSelection(),i={anchorNode:i.anchorNode,anchorOffset:i.anchorOffset,focusNode:i.focusNode,focusOffset:i.focusOffset}),Uo&&Zo(Uo,i)||(Uo=i,i=Ul($u,"onSelect"),0<i.length&&(e=new Ph("onSelect","select",null,e,n),t.push({event:e,listeners:i}),e.target=xs)))}function Pa(t,e){var n={};return n[t.toLowerCase()]=e.toLowerCase(),n["Webkit"+t]="webkit"+e,n["Moz"+t]="moz"+e,n}var _s={animationend:Pa("Animation","AnimationEnd"),animationiteration:Pa("Animation","AnimationIteration"),animationstart:Pa("Animation","AnimationStart"),transitionend:Pa("Transition","TransitionEnd")},Ic={},c0={};Ai&&(c0=document.createElement("div").style,"AnimationEvent"in window||(delete _s.animationend.animation,delete _s.animationiteration.animation,delete _s.animationstart.animation),"TransitionEvent"in window||delete _s.transitionend.transition);function oc(t){if(Ic[t])return Ic[t];if(!_s[t])return t;var e=_s[t],n;for(n in e)if(e.hasOwnProperty(n)&&n in c0)return Ic[t]=e[n];return t}var u0=oc("animationend"),d0=oc("animationiteration"),h0=oc("animationstart"),f0=oc("transitionend"),p0=new Map,lp="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function dr(t,e){p0.set(t,e),Xr(e,[t])}for(var Uc=0;Uc<lp.length;Uc++){var Oc=lp[Uc],V_=Oc.toLowerCase(),G_=Oc[0].toUpperCase()+Oc.slice(1);dr(V_,"on"+G_)}dr(u0,"onAnimationEnd");dr(d0,"onAnimationIteration");dr(h0,"onAnimationStart");dr("dblclick","onDoubleClick");dr("focusin","onFocus");dr("focusout","onBlur");dr(f0,"onTransitionEnd");Fs("onMouseEnter",["mouseout","mouseover"]);Fs("onMouseLeave",["mouseout","mouseover"]);Fs("onPointerEnter",["pointerout","pointerover"]);Fs("onPointerLeave",["pointerout","pointerover"]);Xr("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Xr("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Xr("onBeforeInput",["compositionend","keypress","textInput","paste"]);Xr("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Xr("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Xr("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var bo="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),W_=new Set("cancel close invalid load scroll toggle".split(" ").concat(bo));function cp(t,e,n){var i=t.type||"unknown-event";t.currentTarget=n,Vx(i,e,void 0,t),t.currentTarget=null}function m0(t,e){e=(e&4)!==0;for(var n=0;n<t.length;n++){var i=t[n],r=i.event;i=i.listeners;e:{var s=void 0;if(e)for(var o=i.length-1;0<=o;o--){var a=i[o],l=a.instance,c=a.currentTarget;if(a=a.listener,l!==s&&r.isPropagationStopped())break e;cp(r,a,c),s=l}else for(o=0;o<i.length;o++){if(a=i[o],l=a.instance,c=a.currentTarget,a=a.listener,l!==s&&r.isPropagationStopped())break e;cp(r,a,c),s=l}}}if(Rl)throw t=Xu,Rl=!1,Xu=null,t}function gt(t,e){var n=e[nd];n===void 0&&(n=e[nd]=new Set);var i=t+"__bubble";n.has(i)||(g0(e,t,2,!1),n.add(i))}function Fc(t,e,n){var i=0;e&&(i|=4),g0(n,t,i,e)}var Ra="_reactListening"+Math.random().toString(36).slice(2);function Qo(t){if(!t[Ra]){t[Ra]=!0,wg.forEach(function(n){n!=="selectionchange"&&(W_.has(n)||Fc(n,!1,t),Fc(n,!0,t))});var e=t.nodeType===9?t:t.ownerDocument;e===null||e[Ra]||(e[Ra]=!0,Fc("selectionchange",!1,e))}}function g0(t,e,n,i){switch(Jg(e)){case 1:var r=r_;break;case 4:r=s_;break;default:r=bh}n=r.bind(null,e,n,t),r=void 0,!ju||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(r=!0),i?r!==void 0?t.addEventListener(e,n,{capture:!0,passive:r}):t.addEventListener(e,n,!0):r!==void 0?t.addEventListener(e,n,{passive:r}):t.addEventListener(e,n,!1)}function kc(t,e,n,i,r){var s=i;if(!(e&1)&&!(e&2)&&i!==null)e:for(;;){if(i===null)return;var o=i.tag;if(o===3||o===4){var a=i.stateNode.containerInfo;if(a===r||a.nodeType===8&&a.parentNode===r)break;if(o===4)for(o=i.return;o!==null;){var l=o.tag;if((l===3||l===4)&&(l=o.stateNode.containerInfo,l===r||l.nodeType===8&&l.parentNode===r))return;o=o.return}for(;a!==null;){if(o=Dr(a),o===null)return;if(l=o.tag,l===5||l===6){i=s=o;continue e}a=a.parentNode}}i=i.return}Bg(function(){var c=s,d=wh(n),h=[];e:{var f=p0.get(t);if(f!==void 0){var p=Ph,v=t;switch(t){case"keypress":if(pl(n)===0)break e;case"keydown":case"keyup":p=y_;break;case"focusin":v="focus",p=Dc;break;case"focusout":v="blur",p=Dc;break;case"beforeblur":case"afterblur":p=Dc;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":p=Zf;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":p=l_;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":p=w_;break;case u0:case d0:case h0:p=d_;break;case f0:p=T_;break;case"scroll":p=o_;break;case"wheel":p=b_;break;case"copy":case"cut":case"paste":p=f_;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":p=Jf}var y=(e&4)!==0,m=!y&&t==="scroll",u=y?f!==null?f+"Capture":null:f;y=[];for(var g=c,x;g!==null;){x=g;var _=x.stateNode;if(x.tag===5&&_!==null&&(x=_,u!==null&&(_=Xo(g,u),_!=null&&y.push(Jo(g,_,x)))),m)break;g=g.return}0<y.length&&(f=new p(f,v,null,n,d),h.push({event:f,listeners:y}))}}if(!(e&7)){e:{if(f=t==="mouseover"||t==="pointerover",p=t==="mouseout"||t==="pointerout",f&&n!==Gu&&(v=n.relatedTarget||n.fromElement)&&(Dr(v)||v[bi]))break e;if((p||f)&&(f=d.window===d?d:(f=d.ownerDocument)?f.defaultView||f.parentWindow:window,p?(v=n.relatedTarget||n.toElement,p=c,v=v?Dr(v):null,v!==null&&(m=Kr(v),v!==m||v.tag!==5&&v.tag!==6)&&(v=null)):(p=null,v=c),p!==v)){if(y=Zf,_="onMouseLeave",u="onMouseEnter",g="mouse",(t==="pointerout"||t==="pointerover")&&(y=Jf,_="onPointerLeave",u="onPointerEnter",g="pointer"),m=p==null?f:ys(p),x=v==null?f:ys(v),f=new y(_,g+"leave",p,n,d),f.target=m,f.relatedTarget=x,_=null,Dr(d)===c&&(y=new y(u,g+"enter",v,n,d),y.target=x,y.relatedTarget=m,_=y),m=_,p&&v)t:{for(y=p,u=v,g=0,x=y;x;x=Qr(x))g++;for(x=0,_=u;_;_=Qr(_))x++;for(;0<g-x;)y=Qr(y),g--;for(;0<x-g;)u=Qr(u),x--;for(;g--;){if(y===u||u!==null&&y===u.alternate)break t;y=Qr(y),u=Qr(u)}y=null}else y=null;p!==null&&up(h,f,p,y,!1),v!==null&&m!==null&&up(h,m,v,y,!0)}}e:{if(f=c?ys(c):window,p=f.nodeName&&f.nodeName.toLowerCase(),p==="select"||p==="input"&&f.type==="file")var P=I_;else if(np(f))if(s0)P=k_;else{P=O_;var T=U_}else(p=f.nodeName)&&p.toLowerCase()==="input"&&(f.type==="checkbox"||f.type==="radio")&&(P=F_);if(P&&(P=P(t,c))){r0(h,P,n,d);break e}T&&T(t,f,c),t==="focusout"&&(T=f._wrapperState)&&T.controlled&&f.type==="number"&&ku(f,"number",f.value)}switch(T=c?ys(c):window,t){case"focusin":(np(T)||T.contentEditable==="true")&&(xs=T,$u=c,Uo=null);break;case"focusout":Uo=$u=xs=null;break;case"mousedown":Zu=!0;break;case"contextmenu":case"mouseup":case"dragend":Zu=!1,ap(h,n,d);break;case"selectionchange":if(H_)break;case"keydown":case"keyup":ap(h,n,d)}var A;if(Dh)e:{switch(t){case"compositionstart":var b="onCompositionStart";break e;case"compositionend":b="onCompositionEnd";break e;case"compositionupdate":b="onCompositionUpdate";break e}b=void 0}else vs?n0(t,n)&&(b="onCompositionEnd"):t==="keydown"&&n.keyCode===229&&(b="onCompositionStart");b&&(t0&&n.locale!=="ko"&&(vs||b!=="onCompositionStart"?b==="onCompositionEnd"&&vs&&(A=e0()):(Yi=d,Ch="value"in Yi?Yi.value:Yi.textContent,vs=!0)),T=Ul(c,b),0<T.length&&(b=new Qf(b,t,null,n,d),h.push({event:b,listeners:T}),A?b.data=A:(A=i0(n),A!==null&&(b.data=A)))),(A=P_?R_(t,n):D_(t,n))&&(c=Ul(c,"onBeforeInput"),0<c.length&&(d=new Qf("onBeforeInput","beforeinput",null,n,d),h.push({event:d,listeners:c}),d.data=A))}m0(h,e)})}function Jo(t,e,n){return{instance:t,listener:e,currentTarget:n}}function Ul(t,e){for(var n=e+"Capture",i=[];t!==null;){var r=t,s=r.stateNode;r.tag===5&&s!==null&&(r=s,s=Xo(t,n),s!=null&&i.unshift(Jo(t,s,r)),s=Xo(t,e),s!=null&&i.push(Jo(t,s,r))),t=t.return}return i}function Qr(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5);return t||null}function up(t,e,n,i,r){for(var s=e._reactName,o=[];n!==null&&n!==i;){var a=n,l=a.alternate,c=a.stateNode;if(l!==null&&l===i)break;a.tag===5&&c!==null&&(a=c,r?(l=Xo(n,s),l!=null&&o.unshift(Jo(n,l,a))):r||(l=Xo(n,s),l!=null&&o.push(Jo(n,l,a)))),n=n.return}o.length!==0&&t.push({event:e,listeners:o})}var j_=/\r\n?/g,X_=/\u0000|\uFFFD/g;function dp(t){return(typeof t=="string"?t:""+t).replace(j_,`
`).replace(X_,"")}function Da(t,e,n){if(e=dp(e),dp(t)!==e&&n)throw Error(ie(425))}function Ol(){}var Qu=null,Ju=null;function ed(t,e){return t==="textarea"||t==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var td=typeof setTimeout=="function"?setTimeout:void 0,K_=typeof clearTimeout=="function"?clearTimeout:void 0,hp=typeof Promise=="function"?Promise:void 0,Y_=typeof queueMicrotask=="function"?queueMicrotask:typeof hp<"u"?function(t){return hp.resolve(null).then(t).catch(q_)}:td;function q_(t){setTimeout(function(){throw t})}function Bc(t,e){var n=e,i=0;do{var r=n.nextSibling;if(t.removeChild(n),r&&r.nodeType===8)if(n=r.data,n==="/$"){if(i===0){t.removeChild(r),qo(e);return}i--}else n!=="$"&&n!=="$?"&&n!=="$!"||i++;n=r}while(n);qo(e)}function Ji(t){for(;t!=null;t=t.nextSibling){var e=t.nodeType;if(e===1||e===3)break;if(e===8){if(e=t.data,e==="$"||e==="$!"||e==="$?")break;if(e==="/$")return null}}return t}function fp(t){t=t.previousSibling;for(var e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="$"||n==="$!"||n==="$?"){if(e===0)return t;e--}else n==="/$"&&e++}t=t.previousSibling}return null}var Js=Math.random().toString(36).slice(2),oi="__reactFiber$"+Js,ea="__reactProps$"+Js,bi="__reactContainer$"+Js,nd="__reactEvents$"+Js,$_="__reactListeners$"+Js,Z_="__reactHandles$"+Js;function Dr(t){var e=t[oi];if(e)return e;for(var n=t.parentNode;n;){if(e=n[bi]||n[oi]){if(n=e.alternate,e.child!==null||n!==null&&n.child!==null)for(t=fp(t);t!==null;){if(n=t[oi])return n;t=fp(t)}return e}t=n,n=t.parentNode}return null}function pa(t){return t=t[oi]||t[bi],!t||t.tag!==5&&t.tag!==6&&t.tag!==13&&t.tag!==3?null:t}function ys(t){if(t.tag===5||t.tag===6)return t.stateNode;throw Error(ie(33))}function ac(t){return t[ea]||null}var id=[],Ms=-1;function hr(t){return{current:t}}function xt(t){0>Ms||(t.current=id[Ms],id[Ms]=null,Ms--)}function ft(t,e){Ms++,id[Ms]=t.current,t.current=e}var cr={},en=hr(cr),pn=hr(!1),kr=cr;function ks(t,e){var n=t.type.contextTypes;if(!n)return cr;var i=t.stateNode;if(i&&i.__reactInternalMemoizedUnmaskedChildContext===e)return i.__reactInternalMemoizedMaskedChildContext;var r={},s;for(s in n)r[s]=e[s];return i&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=e,t.__reactInternalMemoizedMaskedChildContext=r),r}function mn(t){return t=t.childContextTypes,t!=null}function Fl(){xt(pn),xt(en)}function pp(t,e,n){if(en.current!==cr)throw Error(ie(168));ft(en,e),ft(pn,n)}function v0(t,e,n){var i=t.stateNode;if(e=e.childContextTypes,typeof i.getChildContext!="function")return n;i=i.getChildContext();for(var r in i)if(!(r in e))throw Error(ie(108,Ux(t)||"Unknown",r));return Et({},n,i)}function kl(t){return t=(t=t.stateNode)&&t.__reactInternalMemoizedMergedChildContext||cr,kr=en.current,ft(en,t),ft(pn,pn.current),!0}function mp(t,e,n){var i=t.stateNode;if(!i)throw Error(ie(169));n?(t=v0(t,e,kr),i.__reactInternalMemoizedMergedChildContext=t,xt(pn),xt(en),ft(en,t)):xt(pn),ft(pn,n)}var yi=null,lc=!1,zc=!1;function x0(t){yi===null?yi=[t]:yi.push(t)}function Q_(t){lc=!0,x0(t)}function fr(){if(!zc&&yi!==null){zc=!0;var t=0,e=it;try{var n=yi;for(it=1;t<n.length;t++){var i=n[t];do i=i(!0);while(i!==null)}yi=null,lc=!1}catch(r){throw yi!==null&&(yi=yi.slice(t+1)),Gg(Eh,fr),r}finally{it=e,zc=!1}}return null}var Ss=[],ws=0,Bl=null,zl=0,Nn=[],Ln=0,Br=null,Mi=1,Si="";function Sr(t,e){Ss[ws++]=zl,Ss[ws++]=Bl,Bl=t,zl=e}function _0(t,e,n){Nn[Ln++]=Mi,Nn[Ln++]=Si,Nn[Ln++]=Br,Br=t;var i=Mi;t=Si;var r=32-Qn(i)-1;i&=~(1<<r),n+=1;var s=32-Qn(e)+r;if(30<s){var o=r-r%5;s=(i&(1<<o)-1).toString(32),i>>=o,r-=o,Mi=1<<32-Qn(e)+r|n<<r|i,Si=s+t}else Mi=1<<s|n<<r|i,Si=t}function Lh(t){t.return!==null&&(Sr(t,1),_0(t,1,0))}function Ih(t){for(;t===Bl;)Bl=Ss[--ws],Ss[ws]=null,zl=Ss[--ws],Ss[ws]=null;for(;t===Br;)Br=Nn[--Ln],Nn[Ln]=null,Si=Nn[--Ln],Nn[Ln]=null,Mi=Nn[--Ln],Nn[Ln]=null}var Tn=null,En=null,_t=!1,Kn=null;function y0(t,e){var n=Un(5,null,null,0);n.elementType="DELETED",n.stateNode=e,n.return=t,e=t.deletions,e===null?(t.deletions=[n],t.flags|=16):e.push(n)}function gp(t,e){switch(t.tag){case 5:var n=t.type;return e=e.nodeType!==1||n.toLowerCase()!==e.nodeName.toLowerCase()?null:e,e!==null?(t.stateNode=e,Tn=t,En=Ji(e.firstChild),!0):!1;case 6:return e=t.pendingProps===""||e.nodeType!==3?null:e,e!==null?(t.stateNode=e,Tn=t,En=null,!0):!1;case 13:return e=e.nodeType!==8?null:e,e!==null?(n=Br!==null?{id:Mi,overflow:Si}:null,t.memoizedState={dehydrated:e,treeContext:n,retryLane:1073741824},n=Un(18,null,null,0),n.stateNode=e,n.return=t,t.child=n,Tn=t,En=null,!0):!1;default:return!1}}function rd(t){return(t.mode&1)!==0&&(t.flags&128)===0}function sd(t){if(_t){var e=En;if(e){var n=e;if(!gp(t,e)){if(rd(t))throw Error(ie(418));e=Ji(n.nextSibling);var i=Tn;e&&gp(t,e)?y0(i,n):(t.flags=t.flags&-4097|2,_t=!1,Tn=t)}}else{if(rd(t))throw Error(ie(418));t.flags=t.flags&-4097|2,_t=!1,Tn=t}}}function vp(t){for(t=t.return;t!==null&&t.tag!==5&&t.tag!==3&&t.tag!==13;)t=t.return;Tn=t}function Na(t){if(t!==Tn)return!1;if(!_t)return vp(t),_t=!0,!1;var e;if((e=t.tag!==3)&&!(e=t.tag!==5)&&(e=t.type,e=e!=="head"&&e!=="body"&&!ed(t.type,t.memoizedProps)),e&&(e=En)){if(rd(t))throw M0(),Error(ie(418));for(;e;)y0(t,e),e=Ji(e.nextSibling)}if(vp(t),t.tag===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(ie(317));e:{for(t=t.nextSibling,e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="/$"){if(e===0){En=Ji(t.nextSibling);break e}e--}else n!=="$"&&n!=="$!"&&n!=="$?"||e++}t=t.nextSibling}En=null}}else En=Tn?Ji(t.stateNode.nextSibling):null;return!0}function M0(){for(var t=En;t;)t=Ji(t.nextSibling)}function Bs(){En=Tn=null,_t=!1}function Uh(t){Kn===null?Kn=[t]:Kn.push(t)}var J_=Ni.ReactCurrentBatchConfig;function ho(t,e,n){if(t=n.ref,t!==null&&typeof t!="function"&&typeof t!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(ie(309));var i=n.stateNode}if(!i)throw Error(ie(147,t));var r=i,s=""+t;return e!==null&&e.ref!==null&&typeof e.ref=="function"&&e.ref._stringRef===s?e.ref:(e=function(o){var a=r.refs;o===null?delete a[s]:a[s]=o},e._stringRef=s,e)}if(typeof t!="string")throw Error(ie(284));if(!n._owner)throw Error(ie(290,t))}return t}function La(t,e){throw t=Object.prototype.toString.call(e),Error(ie(31,t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t))}function xp(t){var e=t._init;return e(t._payload)}function S0(t){function e(u,g){if(t){var x=u.deletions;x===null?(u.deletions=[g],u.flags|=16):x.push(g)}}function n(u,g){if(!t)return null;for(;g!==null;)e(u,g),g=g.sibling;return null}function i(u,g){for(u=new Map;g!==null;)g.key!==null?u.set(g.key,g):u.set(g.index,g),g=g.sibling;return u}function r(u,g){return u=ir(u,g),u.index=0,u.sibling=null,u}function s(u,g,x){return u.index=x,t?(x=u.alternate,x!==null?(x=x.index,x<g?(u.flags|=2,g):x):(u.flags|=2,g)):(u.flags|=1048576,g)}function o(u){return t&&u.alternate===null&&(u.flags|=2),u}function a(u,g,x,_){return g===null||g.tag!==6?(g=Kc(x,u.mode,_),g.return=u,g):(g=r(g,x),g.return=u,g)}function l(u,g,x,_){var P=x.type;return P===gs?d(u,g,x.props.children,_,x.key):g!==null&&(g.elementType===P||typeof P=="object"&&P!==null&&P.$$typeof===Vi&&xp(P)===g.type)?(_=r(g,x.props),_.ref=ho(u,g,x),_.return=u,_):(_=Ml(x.type,x.key,x.props,null,u.mode,_),_.ref=ho(u,g,x),_.return=u,_)}function c(u,g,x,_){return g===null||g.tag!==4||g.stateNode.containerInfo!==x.containerInfo||g.stateNode.implementation!==x.implementation?(g=Yc(x,u.mode,_),g.return=u,g):(g=r(g,x.children||[]),g.return=u,g)}function d(u,g,x,_,P){return g===null||g.tag!==7?(g=Or(x,u.mode,_,P),g.return=u,g):(g=r(g,x),g.return=u,g)}function h(u,g,x){if(typeof g=="string"&&g!==""||typeof g=="number")return g=Kc(""+g,u.mode,x),g.return=u,g;if(typeof g=="object"&&g!==null){switch(g.$$typeof){case Sa:return x=Ml(g.type,g.key,g.props,null,u.mode,x),x.ref=ho(u,null,g),x.return=u,x;case ms:return g=Yc(g,u.mode,x),g.return=u,g;case Vi:var _=g._init;return h(u,_(g._payload),x)}if(To(g)||oo(g))return g=Or(g,u.mode,x,null),g.return=u,g;La(u,g)}return null}function f(u,g,x,_){var P=g!==null?g.key:null;if(typeof x=="string"&&x!==""||typeof x=="number")return P!==null?null:a(u,g,""+x,_);if(typeof x=="object"&&x!==null){switch(x.$$typeof){case Sa:return x.key===P?l(u,g,x,_):null;case ms:return x.key===P?c(u,g,x,_):null;case Vi:return P=x._init,f(u,g,P(x._payload),_)}if(To(x)||oo(x))return P!==null?null:d(u,g,x,_,null);La(u,x)}return null}function p(u,g,x,_,P){if(typeof _=="string"&&_!==""||typeof _=="number")return u=u.get(x)||null,a(g,u,""+_,P);if(typeof _=="object"&&_!==null){switch(_.$$typeof){case Sa:return u=u.get(_.key===null?x:_.key)||null,l(g,u,_,P);case ms:return u=u.get(_.key===null?x:_.key)||null,c(g,u,_,P);case Vi:var T=_._init;return p(u,g,x,T(_._payload),P)}if(To(_)||oo(_))return u=u.get(x)||null,d(g,u,_,P,null);La(g,_)}return null}function v(u,g,x,_){for(var P=null,T=null,A=g,b=g=0,w=null;A!==null&&b<x.length;b++){A.index>b?(w=A,A=null):w=A.sibling;var M=f(u,A,x[b],_);if(M===null){A===null&&(A=w);break}t&&A&&M.alternate===null&&e(u,A),g=s(M,g,b),T===null?P=M:T.sibling=M,T=M,A=w}if(b===x.length)return n(u,A),_t&&Sr(u,b),P;if(A===null){for(;b<x.length;b++)A=h(u,x[b],_),A!==null&&(g=s(A,g,b),T===null?P=A:T.sibling=A,T=A);return _t&&Sr(u,b),P}for(A=i(u,A);b<x.length;b++)w=p(A,u,b,x[b],_),w!==null&&(t&&w.alternate!==null&&A.delete(w.key===null?b:w.key),g=s(w,g,b),T===null?P=w:T.sibling=w,T=w);return t&&A.forEach(function(D){return e(u,D)}),_t&&Sr(u,b),P}function y(u,g,x,_){var P=oo(x);if(typeof P!="function")throw Error(ie(150));if(x=P.call(x),x==null)throw Error(ie(151));for(var T=P=null,A=g,b=g=0,w=null,M=x.next();A!==null&&!M.done;b++,M=x.next()){A.index>b?(w=A,A=null):w=A.sibling;var D=f(u,A,M.value,_);if(D===null){A===null&&(A=w);break}t&&A&&D.alternate===null&&e(u,A),g=s(D,g,b),T===null?P=D:T.sibling=D,T=D,A=w}if(M.done)return n(u,A),_t&&Sr(u,b),P;if(A===null){for(;!M.done;b++,M=x.next())M=h(u,M.value,_),M!==null&&(g=s(M,g,b),T===null?P=M:T.sibling=M,T=M);return _t&&Sr(u,b),P}for(A=i(u,A);!M.done;b++,M=x.next())M=p(A,u,b,M.value,_),M!==null&&(t&&M.alternate!==null&&A.delete(M.key===null?b:M.key),g=s(M,g,b),T===null?P=M:T.sibling=M,T=M);return t&&A.forEach(function(V){return e(u,V)}),_t&&Sr(u,b),P}function m(u,g,x,_){if(typeof x=="object"&&x!==null&&x.type===gs&&x.key===null&&(x=x.props.children),typeof x=="object"&&x!==null){switch(x.$$typeof){case Sa:e:{for(var P=x.key,T=g;T!==null;){if(T.key===P){if(P=x.type,P===gs){if(T.tag===7){n(u,T.sibling),g=r(T,x.props.children),g.return=u,u=g;break e}}else if(T.elementType===P||typeof P=="object"&&P!==null&&P.$$typeof===Vi&&xp(P)===T.type){n(u,T.sibling),g=r(T,x.props),g.ref=ho(u,T,x),g.return=u,u=g;break e}n(u,T);break}else e(u,T);T=T.sibling}x.type===gs?(g=Or(x.props.children,u.mode,_,x.key),g.return=u,u=g):(_=Ml(x.type,x.key,x.props,null,u.mode,_),_.ref=ho(u,g,x),_.return=u,u=_)}return o(u);case ms:e:{for(T=x.key;g!==null;){if(g.key===T)if(g.tag===4&&g.stateNode.containerInfo===x.containerInfo&&g.stateNode.implementation===x.implementation){n(u,g.sibling),g=r(g,x.children||[]),g.return=u,u=g;break e}else{n(u,g);break}else e(u,g);g=g.sibling}g=Yc(x,u.mode,_),g.return=u,u=g}return o(u);case Vi:return T=x._init,m(u,g,T(x._payload),_)}if(To(x))return v(u,g,x,_);if(oo(x))return y(u,g,x,_);La(u,x)}return typeof x=="string"&&x!==""||typeof x=="number"?(x=""+x,g!==null&&g.tag===6?(n(u,g.sibling),g=r(g,x),g.return=u,u=g):(n(u,g),g=Kc(x,u.mode,_),g.return=u,u=g),o(u)):n(u,g)}return m}var zs=S0(!0),w0=S0(!1),Hl=hr(null),Vl=null,Es=null,Oh=null;function Fh(){Oh=Es=Vl=null}function kh(t){var e=Hl.current;xt(Hl),t._currentValue=e}function od(t,e,n){for(;t!==null;){var i=t.alternate;if((t.childLanes&e)!==e?(t.childLanes|=e,i!==null&&(i.childLanes|=e)):i!==null&&(i.childLanes&e)!==e&&(i.childLanes|=e),t===n)break;t=t.return}}function Ls(t,e){Vl=t,Oh=Es=null,t=t.dependencies,t!==null&&t.firstContext!==null&&(t.lanes&e&&(hn=!0),t.firstContext=null)}function Fn(t){var e=t._currentValue;if(Oh!==t)if(t={context:t,memoizedValue:e,next:null},Es===null){if(Vl===null)throw Error(ie(308));Es=t,Vl.dependencies={lanes:0,firstContext:t}}else Es=Es.next=t;return e}var Nr=null;function Bh(t){Nr===null?Nr=[t]:Nr.push(t)}function E0(t,e,n,i){var r=e.interleaved;return r===null?(n.next=n,Bh(e)):(n.next=r.next,r.next=n),e.interleaved=n,Ci(t,i)}function Ci(t,e){t.lanes|=e;var n=t.alternate;for(n!==null&&(n.lanes|=e),n=t,t=t.return;t!==null;)t.childLanes|=e,n=t.alternate,n!==null&&(n.childLanes|=e),n=t,t=t.return;return n.tag===3?n.stateNode:null}var Gi=!1;function zh(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function T0(t,e){t=t.updateQueue,e.updateQueue===t&&(e.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,effects:t.effects})}function Ei(t,e){return{eventTime:t,lane:e,tag:0,payload:null,callback:null,next:null}}function er(t,e,n){var i=t.updateQueue;if(i===null)return null;if(i=i.shared,$e&2){var r=i.pending;return r===null?e.next=e:(e.next=r.next,r.next=e),i.pending=e,Ci(t,n)}return r=i.interleaved,r===null?(e.next=e,Bh(i)):(e.next=r.next,r.next=e),i.interleaved=e,Ci(t,n)}function ml(t,e,n){if(e=e.updateQueue,e!==null&&(e=e.shared,(n&4194240)!==0)){var i=e.lanes;i&=t.pendingLanes,n|=i,e.lanes=n,Th(t,n)}}function _p(t,e){var n=t.updateQueue,i=t.alternate;if(i!==null&&(i=i.updateQueue,n===i)){var r=null,s=null;if(n=n.firstBaseUpdate,n!==null){do{var o={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};s===null?r=s=o:s=s.next=o,n=n.next}while(n!==null);s===null?r=s=e:s=s.next=e}else r=s=e;n={baseState:i.baseState,firstBaseUpdate:r,lastBaseUpdate:s,shared:i.shared,effects:i.effects},t.updateQueue=n;return}t=n.lastBaseUpdate,t===null?n.firstBaseUpdate=e:t.next=e,n.lastBaseUpdate=e}function Gl(t,e,n,i){var r=t.updateQueue;Gi=!1;var s=r.firstBaseUpdate,o=r.lastBaseUpdate,a=r.shared.pending;if(a!==null){r.shared.pending=null;var l=a,c=l.next;l.next=null,o===null?s=c:o.next=c,o=l;var d=t.alternate;d!==null&&(d=d.updateQueue,a=d.lastBaseUpdate,a!==o&&(a===null?d.firstBaseUpdate=c:a.next=c,d.lastBaseUpdate=l))}if(s!==null){var h=r.baseState;o=0,d=c=l=null,a=s;do{var f=a.lane,p=a.eventTime;if((i&f)===f){d!==null&&(d=d.next={eventTime:p,lane:0,tag:a.tag,payload:a.payload,callback:a.callback,next:null});e:{var v=t,y=a;switch(f=e,p=n,y.tag){case 1:if(v=y.payload,typeof v=="function"){h=v.call(p,h,f);break e}h=v;break e;case 3:v.flags=v.flags&-65537|128;case 0:if(v=y.payload,f=typeof v=="function"?v.call(p,h,f):v,f==null)break e;h=Et({},h,f);break e;case 2:Gi=!0}}a.callback!==null&&a.lane!==0&&(t.flags|=64,f=r.effects,f===null?r.effects=[a]:f.push(a))}else p={eventTime:p,lane:f,tag:a.tag,payload:a.payload,callback:a.callback,next:null},d===null?(c=d=p,l=h):d=d.next=p,o|=f;if(a=a.next,a===null){if(a=r.shared.pending,a===null)break;f=a,a=f.next,f.next=null,r.lastBaseUpdate=f,r.shared.pending=null}}while(!0);if(d===null&&(l=h),r.baseState=l,r.firstBaseUpdate=c,r.lastBaseUpdate=d,e=r.shared.interleaved,e!==null){r=e;do o|=r.lane,r=r.next;while(r!==e)}else s===null&&(r.shared.lanes=0);Hr|=o,t.lanes=o,t.memoizedState=h}}function yp(t,e,n){if(t=e.effects,e.effects=null,t!==null)for(e=0;e<t.length;e++){var i=t[e],r=i.callback;if(r!==null){if(i.callback=null,i=n,typeof r!="function")throw Error(ie(191,r));r.call(i)}}}var ma={},ci=hr(ma),ta=hr(ma),na=hr(ma);function Lr(t){if(t===ma)throw Error(ie(174));return t}function Hh(t,e){switch(ft(na,e),ft(ta,t),ft(ci,ma),t=e.nodeType,t){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:zu(null,"");break;default:t=t===8?e.parentNode:e,e=t.namespaceURI||null,t=t.tagName,e=zu(e,t)}xt(ci),ft(ci,e)}function Hs(){xt(ci),xt(ta),xt(na)}function A0(t){Lr(na.current);var e=Lr(ci.current),n=zu(e,t.type);e!==n&&(ft(ta,t),ft(ci,n))}function Vh(t){ta.current===t&&(xt(ci),xt(ta))}var St=hr(0);function Wl(t){for(var e=t;e!==null;){if(e.tag===13){var n=e.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if(e.flags&128)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var Hc=[];function Gh(){for(var t=0;t<Hc.length;t++)Hc[t]._workInProgressVersionPrimary=null;Hc.length=0}var gl=Ni.ReactCurrentDispatcher,Vc=Ni.ReactCurrentBatchConfig,zr=0,wt=null,Dt=null,kt=null,jl=!1,Oo=!1,ia=0,ey=0;function Kt(){throw Error(ie(321))}function Wh(t,e){if(e===null)return!1;for(var n=0;n<e.length&&n<t.length;n++)if(!ei(t[n],e[n]))return!1;return!0}function jh(t,e,n,i,r,s){if(zr=s,wt=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,gl.current=t===null||t.memoizedState===null?ry:sy,t=n(i,r),Oo){s=0;do{if(Oo=!1,ia=0,25<=s)throw Error(ie(301));s+=1,kt=Dt=null,e.updateQueue=null,gl.current=oy,t=n(i,r)}while(Oo)}if(gl.current=Xl,e=Dt!==null&&Dt.next!==null,zr=0,kt=Dt=wt=null,jl=!1,e)throw Error(ie(300));return t}function Xh(){var t=ia!==0;return ia=0,t}function ii(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return kt===null?wt.memoizedState=kt=t:kt=kt.next=t,kt}function kn(){if(Dt===null){var t=wt.alternate;t=t!==null?t.memoizedState:null}else t=Dt.next;var e=kt===null?wt.memoizedState:kt.next;if(e!==null)kt=e,Dt=t;else{if(t===null)throw Error(ie(310));Dt=t,t={memoizedState:Dt.memoizedState,baseState:Dt.baseState,baseQueue:Dt.baseQueue,queue:Dt.queue,next:null},kt===null?wt.memoizedState=kt=t:kt=kt.next=t}return kt}function ra(t,e){return typeof e=="function"?e(t):e}function Gc(t){var e=kn(),n=e.queue;if(n===null)throw Error(ie(311));n.lastRenderedReducer=t;var i=Dt,r=i.baseQueue,s=n.pending;if(s!==null){if(r!==null){var o=r.next;r.next=s.next,s.next=o}i.baseQueue=r=s,n.pending=null}if(r!==null){s=r.next,i=i.baseState;var a=o=null,l=null,c=s;do{var d=c.lane;if((zr&d)===d)l!==null&&(l=l.next={lane:0,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null}),i=c.hasEagerState?c.eagerState:t(i,c.action);else{var h={lane:d,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null};l===null?(a=l=h,o=i):l=l.next=h,wt.lanes|=d,Hr|=d}c=c.next}while(c!==null&&c!==s);l===null?o=i:l.next=a,ei(i,e.memoizedState)||(hn=!0),e.memoizedState=i,e.baseState=o,e.baseQueue=l,n.lastRenderedState=i}if(t=n.interleaved,t!==null){r=t;do s=r.lane,wt.lanes|=s,Hr|=s,r=r.next;while(r!==t)}else r===null&&(n.lanes=0);return[e.memoizedState,n.dispatch]}function Wc(t){var e=kn(),n=e.queue;if(n===null)throw Error(ie(311));n.lastRenderedReducer=t;var i=n.dispatch,r=n.pending,s=e.memoizedState;if(r!==null){n.pending=null;var o=r=r.next;do s=t(s,o.action),o=o.next;while(o!==r);ei(s,e.memoizedState)||(hn=!0),e.memoizedState=s,e.baseQueue===null&&(e.baseState=s),n.lastRenderedState=s}return[s,i]}function b0(){}function C0(t,e){var n=wt,i=kn(),r=e(),s=!ei(i.memoizedState,r);if(s&&(i.memoizedState=r,hn=!0),i=i.queue,Kh(D0.bind(null,n,i,t),[t]),i.getSnapshot!==e||s||kt!==null&&kt.memoizedState.tag&1){if(n.flags|=2048,sa(9,R0.bind(null,n,i,r,e),void 0,null),Bt===null)throw Error(ie(349));zr&30||P0(n,e,r)}return r}function P0(t,e,n){t.flags|=16384,t={getSnapshot:e,value:n},e=wt.updateQueue,e===null?(e={lastEffect:null,stores:null},wt.updateQueue=e,e.stores=[t]):(n=e.stores,n===null?e.stores=[t]:n.push(t))}function R0(t,e,n,i){e.value=n,e.getSnapshot=i,N0(e)&&L0(t)}function D0(t,e,n){return n(function(){N0(e)&&L0(t)})}function N0(t){var e=t.getSnapshot;t=t.value;try{var n=e();return!ei(t,n)}catch{return!0}}function L0(t){var e=Ci(t,1);e!==null&&Jn(e,t,1,-1)}function Mp(t){var e=ii();return typeof t=="function"&&(t=t()),e.memoizedState=e.baseState=t,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:ra,lastRenderedState:t},e.queue=t,t=t.dispatch=iy.bind(null,wt,t),[e.memoizedState,t]}function sa(t,e,n,i){return t={tag:t,create:e,destroy:n,deps:i,next:null},e=wt.updateQueue,e===null?(e={lastEffect:null,stores:null},wt.updateQueue=e,e.lastEffect=t.next=t):(n=e.lastEffect,n===null?e.lastEffect=t.next=t:(i=n.next,n.next=t,t.next=i,e.lastEffect=t)),t}function I0(){return kn().memoizedState}function vl(t,e,n,i){var r=ii();wt.flags|=t,r.memoizedState=sa(1|e,n,void 0,i===void 0?null:i)}function cc(t,e,n,i){var r=kn();i=i===void 0?null:i;var s=void 0;if(Dt!==null){var o=Dt.memoizedState;if(s=o.destroy,i!==null&&Wh(i,o.deps)){r.memoizedState=sa(e,n,s,i);return}}wt.flags|=t,r.memoizedState=sa(1|e,n,s,i)}function Sp(t,e){return vl(8390656,8,t,e)}function Kh(t,e){return cc(2048,8,t,e)}function U0(t,e){return cc(4,2,t,e)}function O0(t,e){return cc(4,4,t,e)}function F0(t,e){if(typeof e=="function")return t=t(),e(t),function(){e(null)};if(e!=null)return t=t(),e.current=t,function(){e.current=null}}function k0(t,e,n){return n=n!=null?n.concat([t]):null,cc(4,4,F0.bind(null,e,t),n)}function Yh(){}function B0(t,e){var n=kn();e=e===void 0?null:e;var i=n.memoizedState;return i!==null&&e!==null&&Wh(e,i[1])?i[0]:(n.memoizedState=[t,e],t)}function z0(t,e){var n=kn();e=e===void 0?null:e;var i=n.memoizedState;return i!==null&&e!==null&&Wh(e,i[1])?i[0]:(t=t(),n.memoizedState=[t,e],t)}function H0(t,e,n){return zr&21?(ei(n,e)||(n=Xg(),wt.lanes|=n,Hr|=n,t.baseState=!0),e):(t.baseState&&(t.baseState=!1,hn=!0),t.memoizedState=n)}function ty(t,e){var n=it;it=n!==0&&4>n?n:4,t(!0);var i=Vc.transition;Vc.transition={};try{t(!1),e()}finally{it=n,Vc.transition=i}}function V0(){return kn().memoizedState}function ny(t,e,n){var i=nr(t);if(n={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null},G0(t))W0(e,n);else if(n=E0(t,e,n,i),n!==null){var r=an();Jn(n,t,i,r),j0(n,e,i)}}function iy(t,e,n){var i=nr(t),r={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null};if(G0(t))W0(e,r);else{var s=t.alternate;if(t.lanes===0&&(s===null||s.lanes===0)&&(s=e.lastRenderedReducer,s!==null))try{var o=e.lastRenderedState,a=s(o,n);if(r.hasEagerState=!0,r.eagerState=a,ei(a,o)){var l=e.interleaved;l===null?(r.next=r,Bh(e)):(r.next=l.next,l.next=r),e.interleaved=r;return}}catch{}finally{}n=E0(t,e,r,i),n!==null&&(r=an(),Jn(n,t,i,r),j0(n,e,i))}}function G0(t){var e=t.alternate;return t===wt||e!==null&&e===wt}function W0(t,e){Oo=jl=!0;var n=t.pending;n===null?e.next=e:(e.next=n.next,n.next=e),t.pending=e}function j0(t,e,n){if(n&4194240){var i=e.lanes;i&=t.pendingLanes,n|=i,e.lanes=n,Th(t,n)}}var Xl={readContext:Fn,useCallback:Kt,useContext:Kt,useEffect:Kt,useImperativeHandle:Kt,useInsertionEffect:Kt,useLayoutEffect:Kt,useMemo:Kt,useReducer:Kt,useRef:Kt,useState:Kt,useDebugValue:Kt,useDeferredValue:Kt,useTransition:Kt,useMutableSource:Kt,useSyncExternalStore:Kt,useId:Kt,unstable_isNewReconciler:!1},ry={readContext:Fn,useCallback:function(t,e){return ii().memoizedState=[t,e===void 0?null:e],t},useContext:Fn,useEffect:Sp,useImperativeHandle:function(t,e,n){return n=n!=null?n.concat([t]):null,vl(4194308,4,F0.bind(null,e,t),n)},useLayoutEffect:function(t,e){return vl(4194308,4,t,e)},useInsertionEffect:function(t,e){return vl(4,2,t,e)},useMemo:function(t,e){var n=ii();return e=e===void 0?null:e,t=t(),n.memoizedState=[t,e],t},useReducer:function(t,e,n){var i=ii();return e=n!==void 0?n(e):e,i.memoizedState=i.baseState=e,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:e},i.queue=t,t=t.dispatch=ny.bind(null,wt,t),[i.memoizedState,t]},useRef:function(t){var e=ii();return t={current:t},e.memoizedState=t},useState:Mp,useDebugValue:Yh,useDeferredValue:function(t){return ii().memoizedState=t},useTransition:function(){var t=Mp(!1),e=t[0];return t=ty.bind(null,t[1]),ii().memoizedState=t,[e,t]},useMutableSource:function(){},useSyncExternalStore:function(t,e,n){var i=wt,r=ii();if(_t){if(n===void 0)throw Error(ie(407));n=n()}else{if(n=e(),Bt===null)throw Error(ie(349));zr&30||P0(i,e,n)}r.memoizedState=n;var s={value:n,getSnapshot:e};return r.queue=s,Sp(D0.bind(null,i,s,t),[t]),i.flags|=2048,sa(9,R0.bind(null,i,s,n,e),void 0,null),n},useId:function(){var t=ii(),e=Bt.identifierPrefix;if(_t){var n=Si,i=Mi;n=(i&~(1<<32-Qn(i)-1)).toString(32)+n,e=":"+e+"R"+n,n=ia++,0<n&&(e+="H"+n.toString(32)),e+=":"}else n=ey++,e=":"+e+"r"+n.toString(32)+":";return t.memoizedState=e},unstable_isNewReconciler:!1},sy={readContext:Fn,useCallback:B0,useContext:Fn,useEffect:Kh,useImperativeHandle:k0,useInsertionEffect:U0,useLayoutEffect:O0,useMemo:z0,useReducer:Gc,useRef:I0,useState:function(){return Gc(ra)},useDebugValue:Yh,useDeferredValue:function(t){var e=kn();return H0(e,Dt.memoizedState,t)},useTransition:function(){var t=Gc(ra)[0],e=kn().memoizedState;return[t,e]},useMutableSource:b0,useSyncExternalStore:C0,useId:V0,unstable_isNewReconciler:!1},oy={readContext:Fn,useCallback:B0,useContext:Fn,useEffect:Kh,useImperativeHandle:k0,useInsertionEffect:U0,useLayoutEffect:O0,useMemo:z0,useReducer:Wc,useRef:I0,useState:function(){return Wc(ra)},useDebugValue:Yh,useDeferredValue:function(t){var e=kn();return Dt===null?e.memoizedState=t:H0(e,Dt.memoizedState,t)},useTransition:function(){var t=Wc(ra)[0],e=kn().memoizedState;return[t,e]},useMutableSource:b0,useSyncExternalStore:C0,useId:V0,unstable_isNewReconciler:!1};function jn(t,e){if(t&&t.defaultProps){e=Et({},e),t=t.defaultProps;for(var n in t)e[n]===void 0&&(e[n]=t[n]);return e}return e}function ad(t,e,n,i){e=t.memoizedState,n=n(i,e),n=n==null?e:Et({},e,n),t.memoizedState=n,t.lanes===0&&(t.updateQueue.baseState=n)}var uc={isMounted:function(t){return(t=t._reactInternals)?Kr(t)===t:!1},enqueueSetState:function(t,e,n){t=t._reactInternals;var i=an(),r=nr(t),s=Ei(i,r);s.payload=e,n!=null&&(s.callback=n),e=er(t,s,r),e!==null&&(Jn(e,t,r,i),ml(e,t,r))},enqueueReplaceState:function(t,e,n){t=t._reactInternals;var i=an(),r=nr(t),s=Ei(i,r);s.tag=1,s.payload=e,n!=null&&(s.callback=n),e=er(t,s,r),e!==null&&(Jn(e,t,r,i),ml(e,t,r))},enqueueForceUpdate:function(t,e){t=t._reactInternals;var n=an(),i=nr(t),r=Ei(n,i);r.tag=2,e!=null&&(r.callback=e),e=er(t,r,i),e!==null&&(Jn(e,t,i,n),ml(e,t,i))}};function wp(t,e,n,i,r,s,o){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(i,s,o):e.prototype&&e.prototype.isPureReactComponent?!Zo(n,i)||!Zo(r,s):!0}function X0(t,e,n){var i=!1,r=cr,s=e.contextType;return typeof s=="object"&&s!==null?s=Fn(s):(r=mn(e)?kr:en.current,i=e.contextTypes,s=(i=i!=null)?ks(t,r):cr),e=new e(n,s),t.memoizedState=e.state!==null&&e.state!==void 0?e.state:null,e.updater=uc,t.stateNode=e,e._reactInternals=t,i&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=r,t.__reactInternalMemoizedMaskedChildContext=s),e}function Ep(t,e,n,i){t=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(n,i),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(n,i),e.state!==t&&uc.enqueueReplaceState(e,e.state,null)}function ld(t,e,n,i){var r=t.stateNode;r.props=n,r.state=t.memoizedState,r.refs={},zh(t);var s=e.contextType;typeof s=="object"&&s!==null?r.context=Fn(s):(s=mn(e)?kr:en.current,r.context=ks(t,s)),r.state=t.memoizedState,s=e.getDerivedStateFromProps,typeof s=="function"&&(ad(t,e,s,n),r.state=t.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof r.getSnapshotBeforeUpdate=="function"||typeof r.UNSAFE_componentWillMount!="function"&&typeof r.componentWillMount!="function"||(e=r.state,typeof r.componentWillMount=="function"&&r.componentWillMount(),typeof r.UNSAFE_componentWillMount=="function"&&r.UNSAFE_componentWillMount(),e!==r.state&&uc.enqueueReplaceState(r,r.state,null),Gl(t,n,r,i),r.state=t.memoizedState),typeof r.componentDidMount=="function"&&(t.flags|=4194308)}function Vs(t,e){try{var n="",i=e;do n+=Ix(i),i=i.return;while(i);var r=n}catch(s){r=`
Error generating stack: `+s.message+`
`+s.stack}return{value:t,source:e,stack:r,digest:null}}function jc(t,e,n){return{value:t,source:null,stack:n??null,digest:e??null}}function cd(t,e){try{console.error(e.value)}catch(n){setTimeout(function(){throw n})}}var ay=typeof WeakMap=="function"?WeakMap:Map;function K0(t,e,n){n=Ei(-1,n),n.tag=3,n.payload={element:null};var i=e.value;return n.callback=function(){Yl||(Yl=!0,_d=i),cd(t,e)},n}function Y0(t,e,n){n=Ei(-1,n),n.tag=3;var i=t.type.getDerivedStateFromError;if(typeof i=="function"){var r=e.value;n.payload=function(){return i(r)},n.callback=function(){cd(t,e)}}var s=t.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(n.callback=function(){cd(t,e),typeof i!="function"&&(tr===null?tr=new Set([this]):tr.add(this));var o=e.stack;this.componentDidCatch(e.value,{componentStack:o!==null?o:""})}),n}function Tp(t,e,n){var i=t.pingCache;if(i===null){i=t.pingCache=new ay;var r=new Set;i.set(e,r)}else r=i.get(e),r===void 0&&(r=new Set,i.set(e,r));r.has(n)||(r.add(n),t=My.bind(null,t,e,n),e.then(t,t))}function Ap(t){do{var e;if((e=t.tag===13)&&(e=t.memoizedState,e=e!==null?e.dehydrated!==null:!0),e)return t;t=t.return}while(t!==null);return null}function bp(t,e,n,i,r){return t.mode&1?(t.flags|=65536,t.lanes=r,t):(t===e?t.flags|=65536:(t.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(e=Ei(-1,1),e.tag=2,er(n,e,1))),n.lanes|=1),t)}var ly=Ni.ReactCurrentOwner,hn=!1;function sn(t,e,n,i){e.child=t===null?w0(e,null,n,i):zs(e,t.child,n,i)}function Cp(t,e,n,i,r){n=n.render;var s=e.ref;return Ls(e,r),i=jh(t,e,n,i,s,r),n=Xh(),t!==null&&!hn?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~r,Pi(t,e,r)):(_t&&n&&Lh(e),e.flags|=1,sn(t,e,i,r),e.child)}function Pp(t,e,n,i,r){if(t===null){var s=n.type;return typeof s=="function"&&!nf(s)&&s.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(e.tag=15,e.type=s,q0(t,e,s,i,r)):(t=Ml(n.type,null,i,e,e.mode,r),t.ref=e.ref,t.return=e,e.child=t)}if(s=t.child,!(t.lanes&r)){var o=s.memoizedProps;if(n=n.compare,n=n!==null?n:Zo,n(o,i)&&t.ref===e.ref)return Pi(t,e,r)}return e.flags|=1,t=ir(s,i),t.ref=e.ref,t.return=e,e.child=t}function q0(t,e,n,i,r){if(t!==null){var s=t.memoizedProps;if(Zo(s,i)&&t.ref===e.ref)if(hn=!1,e.pendingProps=i=s,(t.lanes&r)!==0)t.flags&131072&&(hn=!0);else return e.lanes=t.lanes,Pi(t,e,r)}return ud(t,e,n,i,r)}function $0(t,e,n){var i=e.pendingProps,r=i.children,s=t!==null?t.memoizedState:null;if(i.mode==="hidden")if(!(e.mode&1))e.memoizedState={baseLanes:0,cachePool:null,transitions:null},ft(As,Mn),Mn|=n;else{if(!(n&1073741824))return t=s!==null?s.baseLanes|n:n,e.lanes=e.childLanes=1073741824,e.memoizedState={baseLanes:t,cachePool:null,transitions:null},e.updateQueue=null,ft(As,Mn),Mn|=t,null;e.memoizedState={baseLanes:0,cachePool:null,transitions:null},i=s!==null?s.baseLanes:n,ft(As,Mn),Mn|=i}else s!==null?(i=s.baseLanes|n,e.memoizedState=null):i=n,ft(As,Mn),Mn|=i;return sn(t,e,r,n),e.child}function Z0(t,e){var n=e.ref;(t===null&&n!==null||t!==null&&t.ref!==n)&&(e.flags|=512,e.flags|=2097152)}function ud(t,e,n,i,r){var s=mn(n)?kr:en.current;return s=ks(e,s),Ls(e,r),n=jh(t,e,n,i,s,r),i=Xh(),t!==null&&!hn?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~r,Pi(t,e,r)):(_t&&i&&Lh(e),e.flags|=1,sn(t,e,n,r),e.child)}function Rp(t,e,n,i,r){if(mn(n)){var s=!0;kl(e)}else s=!1;if(Ls(e,r),e.stateNode===null)xl(t,e),X0(e,n,i),ld(e,n,i,r),i=!0;else if(t===null){var o=e.stateNode,a=e.memoizedProps;o.props=a;var l=o.context,c=n.contextType;typeof c=="object"&&c!==null?c=Fn(c):(c=mn(n)?kr:en.current,c=ks(e,c));var d=n.getDerivedStateFromProps,h=typeof d=="function"||typeof o.getSnapshotBeforeUpdate=="function";h||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(a!==i||l!==c)&&Ep(e,o,i,c),Gi=!1;var f=e.memoizedState;o.state=f,Gl(e,i,o,r),l=e.memoizedState,a!==i||f!==l||pn.current||Gi?(typeof d=="function"&&(ad(e,n,d,i),l=e.memoizedState),(a=Gi||wp(e,n,a,i,f,l,c))?(h||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount=="function"&&(e.flags|=4194308)):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=i,e.memoizedState=l),o.props=i,o.state=l,o.context=c,i=a):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),i=!1)}else{o=e.stateNode,T0(t,e),a=e.memoizedProps,c=e.type===e.elementType?a:jn(e.type,a),o.props=c,h=e.pendingProps,f=o.context,l=n.contextType,typeof l=="object"&&l!==null?l=Fn(l):(l=mn(n)?kr:en.current,l=ks(e,l));var p=n.getDerivedStateFromProps;(d=typeof p=="function"||typeof o.getSnapshotBeforeUpdate=="function")||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(a!==h||f!==l)&&Ep(e,o,i,l),Gi=!1,f=e.memoizedState,o.state=f,Gl(e,i,o,r);var v=e.memoizedState;a!==h||f!==v||pn.current||Gi?(typeof p=="function"&&(ad(e,n,p,i),v=e.memoizedState),(c=Gi||wp(e,n,c,i,f,v,l)||!1)?(d||typeof o.UNSAFE_componentWillUpdate!="function"&&typeof o.componentWillUpdate!="function"||(typeof o.componentWillUpdate=="function"&&o.componentWillUpdate(i,v,l),typeof o.UNSAFE_componentWillUpdate=="function"&&o.UNSAFE_componentWillUpdate(i,v,l)),typeof o.componentDidUpdate=="function"&&(e.flags|=4),typeof o.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof o.componentDidUpdate!="function"||a===t.memoizedProps&&f===t.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||a===t.memoizedProps&&f===t.memoizedState||(e.flags|=1024),e.memoizedProps=i,e.memoizedState=v),o.props=i,o.state=v,o.context=l,i=c):(typeof o.componentDidUpdate!="function"||a===t.memoizedProps&&f===t.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||a===t.memoizedProps&&f===t.memoizedState||(e.flags|=1024),i=!1)}return dd(t,e,n,i,s,r)}function dd(t,e,n,i,r,s){Z0(t,e);var o=(e.flags&128)!==0;if(!i&&!o)return r&&mp(e,n,!1),Pi(t,e,s);i=e.stateNode,ly.current=e;var a=o&&typeof n.getDerivedStateFromError!="function"?null:i.render();return e.flags|=1,t!==null&&o?(e.child=zs(e,t.child,null,s),e.child=zs(e,null,a,s)):sn(t,e,a,s),e.memoizedState=i.state,r&&mp(e,n,!0),e.child}function Q0(t){var e=t.stateNode;e.pendingContext?pp(t,e.pendingContext,e.pendingContext!==e.context):e.context&&pp(t,e.context,!1),Hh(t,e.containerInfo)}function Dp(t,e,n,i,r){return Bs(),Uh(r),e.flags|=256,sn(t,e,n,i),e.child}var hd={dehydrated:null,treeContext:null,retryLane:0};function fd(t){return{baseLanes:t,cachePool:null,transitions:null}}function J0(t,e,n){var i=e.pendingProps,r=St.current,s=!1,o=(e.flags&128)!==0,a;if((a=o)||(a=t!==null&&t.memoizedState===null?!1:(r&2)!==0),a?(s=!0,e.flags&=-129):(t===null||t.memoizedState!==null)&&(r|=1),ft(St,r&1),t===null)return sd(e),t=e.memoizedState,t!==null&&(t=t.dehydrated,t!==null)?(e.mode&1?t.data==="$!"?e.lanes=8:e.lanes=1073741824:e.lanes=1,null):(o=i.children,t=i.fallback,s?(i=e.mode,s=e.child,o={mode:"hidden",children:o},!(i&1)&&s!==null?(s.childLanes=0,s.pendingProps=o):s=fc(o,i,0,null),t=Or(t,i,n,null),s.return=e,t.return=e,s.sibling=t,e.child=s,e.child.memoizedState=fd(n),e.memoizedState=hd,t):qh(e,o));if(r=t.memoizedState,r!==null&&(a=r.dehydrated,a!==null))return cy(t,e,o,i,a,r,n);if(s){s=i.fallback,o=e.mode,r=t.child,a=r.sibling;var l={mode:"hidden",children:i.children};return!(o&1)&&e.child!==r?(i=e.child,i.childLanes=0,i.pendingProps=l,e.deletions=null):(i=ir(r,l),i.subtreeFlags=r.subtreeFlags&14680064),a!==null?s=ir(a,s):(s=Or(s,o,n,null),s.flags|=2),s.return=e,i.return=e,i.sibling=s,e.child=i,i=s,s=e.child,o=t.child.memoizedState,o=o===null?fd(n):{baseLanes:o.baseLanes|n,cachePool:null,transitions:o.transitions},s.memoizedState=o,s.childLanes=t.childLanes&~n,e.memoizedState=hd,i}return s=t.child,t=s.sibling,i=ir(s,{mode:"visible",children:i.children}),!(e.mode&1)&&(i.lanes=n),i.return=e,i.sibling=null,t!==null&&(n=e.deletions,n===null?(e.deletions=[t],e.flags|=16):n.push(t)),e.child=i,e.memoizedState=null,i}function qh(t,e){return e=fc({mode:"visible",children:e},t.mode,0,null),e.return=t,t.child=e}function Ia(t,e,n,i){return i!==null&&Uh(i),zs(e,t.child,null,n),t=qh(e,e.pendingProps.children),t.flags|=2,e.memoizedState=null,t}function cy(t,e,n,i,r,s,o){if(n)return e.flags&256?(e.flags&=-257,i=jc(Error(ie(422))),Ia(t,e,o,i)):e.memoizedState!==null?(e.child=t.child,e.flags|=128,null):(s=i.fallback,r=e.mode,i=fc({mode:"visible",children:i.children},r,0,null),s=Or(s,r,o,null),s.flags|=2,i.return=e,s.return=e,i.sibling=s,e.child=i,e.mode&1&&zs(e,t.child,null,o),e.child.memoizedState=fd(o),e.memoizedState=hd,s);if(!(e.mode&1))return Ia(t,e,o,null);if(r.data==="$!"){if(i=r.nextSibling&&r.nextSibling.dataset,i)var a=i.dgst;return i=a,s=Error(ie(419)),i=jc(s,i,void 0),Ia(t,e,o,i)}if(a=(o&t.childLanes)!==0,hn||a){if(i=Bt,i!==null){switch(o&-o){case 4:r=2;break;case 16:r=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:r=32;break;case 536870912:r=268435456;break;default:r=0}r=r&(i.suspendedLanes|o)?0:r,r!==0&&r!==s.retryLane&&(s.retryLane=r,Ci(t,r),Jn(i,t,r,-1))}return tf(),i=jc(Error(ie(421))),Ia(t,e,o,i)}return r.data==="$?"?(e.flags|=128,e.child=t.child,e=Sy.bind(null,t),r._reactRetry=e,null):(t=s.treeContext,En=Ji(r.nextSibling),Tn=e,_t=!0,Kn=null,t!==null&&(Nn[Ln++]=Mi,Nn[Ln++]=Si,Nn[Ln++]=Br,Mi=t.id,Si=t.overflow,Br=e),e=qh(e,i.children),e.flags|=4096,e)}function Np(t,e,n){t.lanes|=e;var i=t.alternate;i!==null&&(i.lanes|=e),od(t.return,e,n)}function Xc(t,e,n,i,r){var s=t.memoizedState;s===null?t.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:i,tail:n,tailMode:r}:(s.isBackwards=e,s.rendering=null,s.renderingStartTime=0,s.last=i,s.tail=n,s.tailMode=r)}function ev(t,e,n){var i=e.pendingProps,r=i.revealOrder,s=i.tail;if(sn(t,e,i.children,n),i=St.current,i&2)i=i&1|2,e.flags|=128;else{if(t!==null&&t.flags&128)e:for(t=e.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&Np(t,n,e);else if(t.tag===19)Np(t,n,e);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}i&=1}if(ft(St,i),!(e.mode&1))e.memoizedState=null;else switch(r){case"forwards":for(n=e.child,r=null;n!==null;)t=n.alternate,t!==null&&Wl(t)===null&&(r=n),n=n.sibling;n=r,n===null?(r=e.child,e.child=null):(r=n.sibling,n.sibling=null),Xc(e,!1,r,n,s);break;case"backwards":for(n=null,r=e.child,e.child=null;r!==null;){if(t=r.alternate,t!==null&&Wl(t)===null){e.child=r;break}t=r.sibling,r.sibling=n,n=r,r=t}Xc(e,!0,n,null,s);break;case"together":Xc(e,!1,null,null,void 0);break;default:e.memoizedState=null}return e.child}function xl(t,e){!(e.mode&1)&&t!==null&&(t.alternate=null,e.alternate=null,e.flags|=2)}function Pi(t,e,n){if(t!==null&&(e.dependencies=t.dependencies),Hr|=e.lanes,!(n&e.childLanes))return null;if(t!==null&&e.child!==t.child)throw Error(ie(153));if(e.child!==null){for(t=e.child,n=ir(t,t.pendingProps),e.child=n,n.return=e;t.sibling!==null;)t=t.sibling,n=n.sibling=ir(t,t.pendingProps),n.return=e;n.sibling=null}return e.child}function uy(t,e,n){switch(e.tag){case 3:Q0(e),Bs();break;case 5:A0(e);break;case 1:mn(e.type)&&kl(e);break;case 4:Hh(e,e.stateNode.containerInfo);break;case 10:var i=e.type._context,r=e.memoizedProps.value;ft(Hl,i._currentValue),i._currentValue=r;break;case 13:if(i=e.memoizedState,i!==null)return i.dehydrated!==null?(ft(St,St.current&1),e.flags|=128,null):n&e.child.childLanes?J0(t,e,n):(ft(St,St.current&1),t=Pi(t,e,n),t!==null?t.sibling:null);ft(St,St.current&1);break;case 19:if(i=(n&e.childLanes)!==0,t.flags&128){if(i)return ev(t,e,n);e.flags|=128}if(r=e.memoizedState,r!==null&&(r.rendering=null,r.tail=null,r.lastEffect=null),ft(St,St.current),i)break;return null;case 22:case 23:return e.lanes=0,$0(t,e,n)}return Pi(t,e,n)}var tv,pd,nv,iv;tv=function(t,e){for(var n=e.child;n!==null;){if(n.tag===5||n.tag===6)t.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};pd=function(){};nv=function(t,e,n,i){var r=t.memoizedProps;if(r!==i){t=e.stateNode,Lr(ci.current);var s=null;switch(n){case"input":r=Ou(t,r),i=Ou(t,i),s=[];break;case"select":r=Et({},r,{value:void 0}),i=Et({},i,{value:void 0}),s=[];break;case"textarea":r=Bu(t,r),i=Bu(t,i),s=[];break;default:typeof r.onClick!="function"&&typeof i.onClick=="function"&&(t.onclick=Ol)}Hu(n,i);var o;n=null;for(c in r)if(!i.hasOwnProperty(c)&&r.hasOwnProperty(c)&&r[c]!=null)if(c==="style"){var a=r[c];for(o in a)a.hasOwnProperty(o)&&(n||(n={}),n[o]="")}else c!=="dangerouslySetInnerHTML"&&c!=="children"&&c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&c!=="autoFocus"&&(Wo.hasOwnProperty(c)?s||(s=[]):(s=s||[]).push(c,null));for(c in i){var l=i[c];if(a=r!=null?r[c]:void 0,i.hasOwnProperty(c)&&l!==a&&(l!=null||a!=null))if(c==="style")if(a){for(o in a)!a.hasOwnProperty(o)||l&&l.hasOwnProperty(o)||(n||(n={}),n[o]="");for(o in l)l.hasOwnProperty(o)&&a[o]!==l[o]&&(n||(n={}),n[o]=l[o])}else n||(s||(s=[]),s.push(c,n)),n=l;else c==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,a=a?a.__html:void 0,l!=null&&a!==l&&(s=s||[]).push(c,l)):c==="children"?typeof l!="string"&&typeof l!="number"||(s=s||[]).push(c,""+l):c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&(Wo.hasOwnProperty(c)?(l!=null&&c==="onScroll"&&gt("scroll",t),s||a===l||(s=[])):(s=s||[]).push(c,l))}n&&(s=s||[]).push("style",n);var c=s;(e.updateQueue=c)&&(e.flags|=4)}};iv=function(t,e,n,i){n!==i&&(e.flags|=4)};function fo(t,e){if(!_t)switch(t.tailMode){case"hidden":e=t.tail;for(var n=null;e!==null;)e.alternate!==null&&(n=e),e=e.sibling;n===null?t.tail=null:n.sibling=null;break;case"collapsed":n=t.tail;for(var i=null;n!==null;)n.alternate!==null&&(i=n),n=n.sibling;i===null?e||t.tail===null?t.tail=null:t.tail.sibling=null:i.sibling=null}}function Yt(t){var e=t.alternate!==null&&t.alternate.child===t.child,n=0,i=0;if(e)for(var r=t.child;r!==null;)n|=r.lanes|r.childLanes,i|=r.subtreeFlags&14680064,i|=r.flags&14680064,r.return=t,r=r.sibling;else for(r=t.child;r!==null;)n|=r.lanes|r.childLanes,i|=r.subtreeFlags,i|=r.flags,r.return=t,r=r.sibling;return t.subtreeFlags|=i,t.childLanes=n,e}function dy(t,e,n){var i=e.pendingProps;switch(Ih(e),e.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Yt(e),null;case 1:return mn(e.type)&&Fl(),Yt(e),null;case 3:return i=e.stateNode,Hs(),xt(pn),xt(en),Gh(),i.pendingContext&&(i.context=i.pendingContext,i.pendingContext=null),(t===null||t.child===null)&&(Na(e)?e.flags|=4:t===null||t.memoizedState.isDehydrated&&!(e.flags&256)||(e.flags|=1024,Kn!==null&&(Sd(Kn),Kn=null))),pd(t,e),Yt(e),null;case 5:Vh(e);var r=Lr(na.current);if(n=e.type,t!==null&&e.stateNode!=null)nv(t,e,n,i,r),t.ref!==e.ref&&(e.flags|=512,e.flags|=2097152);else{if(!i){if(e.stateNode===null)throw Error(ie(166));return Yt(e),null}if(t=Lr(ci.current),Na(e)){i=e.stateNode,n=e.type;var s=e.memoizedProps;switch(i[oi]=e,i[ea]=s,t=(e.mode&1)!==0,n){case"dialog":gt("cancel",i),gt("close",i);break;case"iframe":case"object":case"embed":gt("load",i);break;case"video":case"audio":for(r=0;r<bo.length;r++)gt(bo[r],i);break;case"source":gt("error",i);break;case"img":case"image":case"link":gt("error",i),gt("load",i);break;case"details":gt("toggle",i);break;case"input":Hf(i,s),gt("invalid",i);break;case"select":i._wrapperState={wasMultiple:!!s.multiple},gt("invalid",i);break;case"textarea":Gf(i,s),gt("invalid",i)}Hu(n,s),r=null;for(var o in s)if(s.hasOwnProperty(o)){var a=s[o];o==="children"?typeof a=="string"?i.textContent!==a&&(s.suppressHydrationWarning!==!0&&Da(i.textContent,a,t),r=["children",a]):typeof a=="number"&&i.textContent!==""+a&&(s.suppressHydrationWarning!==!0&&Da(i.textContent,a,t),r=["children",""+a]):Wo.hasOwnProperty(o)&&a!=null&&o==="onScroll"&&gt("scroll",i)}switch(n){case"input":wa(i),Vf(i,s,!0);break;case"textarea":wa(i),Wf(i);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(i.onclick=Ol)}i=r,e.updateQueue=i,i!==null&&(e.flags|=4)}else{o=r.nodeType===9?r:r.ownerDocument,t==="http://www.w3.org/1999/xhtml"&&(t=Dg(n)),t==="http://www.w3.org/1999/xhtml"?n==="script"?(t=o.createElement("div"),t.innerHTML="<script><\/script>",t=t.removeChild(t.firstChild)):typeof i.is=="string"?t=o.createElement(n,{is:i.is}):(t=o.createElement(n),n==="select"&&(o=t,i.multiple?o.multiple=!0:i.size&&(o.size=i.size))):t=o.createElementNS(t,n),t[oi]=e,t[ea]=i,tv(t,e,!1,!1),e.stateNode=t;e:{switch(o=Vu(n,i),n){case"dialog":gt("cancel",t),gt("close",t),r=i;break;case"iframe":case"object":case"embed":gt("load",t),r=i;break;case"video":case"audio":for(r=0;r<bo.length;r++)gt(bo[r],t);r=i;break;case"source":gt("error",t),r=i;break;case"img":case"image":case"link":gt("error",t),gt("load",t),r=i;break;case"details":gt("toggle",t),r=i;break;case"input":Hf(t,i),r=Ou(t,i),gt("invalid",t);break;case"option":r=i;break;case"select":t._wrapperState={wasMultiple:!!i.multiple},r=Et({},i,{value:void 0}),gt("invalid",t);break;case"textarea":Gf(t,i),r=Bu(t,i),gt("invalid",t);break;default:r=i}Hu(n,r),a=r;for(s in a)if(a.hasOwnProperty(s)){var l=a[s];s==="style"?Ig(t,l):s==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,l!=null&&Ng(t,l)):s==="children"?typeof l=="string"?(n!=="textarea"||l!=="")&&jo(t,l):typeof l=="number"&&jo(t,""+l):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(Wo.hasOwnProperty(s)?l!=null&&s==="onScroll"&&gt("scroll",t):l!=null&&_h(t,s,l,o))}switch(n){case"input":wa(t),Vf(t,i,!1);break;case"textarea":wa(t),Wf(t);break;case"option":i.value!=null&&t.setAttribute("value",""+lr(i.value));break;case"select":t.multiple=!!i.multiple,s=i.value,s!=null?Ps(t,!!i.multiple,s,!1):i.defaultValue!=null&&Ps(t,!!i.multiple,i.defaultValue,!0);break;default:typeof r.onClick=="function"&&(t.onclick=Ol)}switch(n){case"button":case"input":case"select":case"textarea":i=!!i.autoFocus;break e;case"img":i=!0;break e;default:i=!1}}i&&(e.flags|=4)}e.ref!==null&&(e.flags|=512,e.flags|=2097152)}return Yt(e),null;case 6:if(t&&e.stateNode!=null)iv(t,e,t.memoizedProps,i);else{if(typeof i!="string"&&e.stateNode===null)throw Error(ie(166));if(n=Lr(na.current),Lr(ci.current),Na(e)){if(i=e.stateNode,n=e.memoizedProps,i[oi]=e,(s=i.nodeValue!==n)&&(t=Tn,t!==null))switch(t.tag){case 3:Da(i.nodeValue,n,(t.mode&1)!==0);break;case 5:t.memoizedProps.suppressHydrationWarning!==!0&&Da(i.nodeValue,n,(t.mode&1)!==0)}s&&(e.flags|=4)}else i=(n.nodeType===9?n:n.ownerDocument).createTextNode(i),i[oi]=e,e.stateNode=i}return Yt(e),null;case 13:if(xt(St),i=e.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(_t&&En!==null&&e.mode&1&&!(e.flags&128))M0(),Bs(),e.flags|=98560,s=!1;else if(s=Na(e),i!==null&&i.dehydrated!==null){if(t===null){if(!s)throw Error(ie(318));if(s=e.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(ie(317));s[oi]=e}else Bs(),!(e.flags&128)&&(e.memoizedState=null),e.flags|=4;Yt(e),s=!1}else Kn!==null&&(Sd(Kn),Kn=null),s=!0;if(!s)return e.flags&65536?e:null}return e.flags&128?(e.lanes=n,e):(i=i!==null,i!==(t!==null&&t.memoizedState!==null)&&i&&(e.child.flags|=8192,e.mode&1&&(t===null||St.current&1?Nt===0&&(Nt=3):tf())),e.updateQueue!==null&&(e.flags|=4),Yt(e),null);case 4:return Hs(),pd(t,e),t===null&&Qo(e.stateNode.containerInfo),Yt(e),null;case 10:return kh(e.type._context),Yt(e),null;case 17:return mn(e.type)&&Fl(),Yt(e),null;case 19:if(xt(St),s=e.memoizedState,s===null)return Yt(e),null;if(i=(e.flags&128)!==0,o=s.rendering,o===null)if(i)fo(s,!1);else{if(Nt!==0||t!==null&&t.flags&128)for(t=e.child;t!==null;){if(o=Wl(t),o!==null){for(e.flags|=128,fo(s,!1),i=o.updateQueue,i!==null&&(e.updateQueue=i,e.flags|=4),e.subtreeFlags=0,i=n,n=e.child;n!==null;)s=n,t=i,s.flags&=14680066,o=s.alternate,o===null?(s.childLanes=0,s.lanes=t,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=o.childLanes,s.lanes=o.lanes,s.child=o.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=o.memoizedProps,s.memoizedState=o.memoizedState,s.updateQueue=o.updateQueue,s.type=o.type,t=o.dependencies,s.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),n=n.sibling;return ft(St,St.current&1|2),e.child}t=t.sibling}s.tail!==null&&bt()>Gs&&(e.flags|=128,i=!0,fo(s,!1),e.lanes=4194304)}else{if(!i)if(t=Wl(o),t!==null){if(e.flags|=128,i=!0,n=t.updateQueue,n!==null&&(e.updateQueue=n,e.flags|=4),fo(s,!0),s.tail===null&&s.tailMode==="hidden"&&!o.alternate&&!_t)return Yt(e),null}else 2*bt()-s.renderingStartTime>Gs&&n!==1073741824&&(e.flags|=128,i=!0,fo(s,!1),e.lanes=4194304);s.isBackwards?(o.sibling=e.child,e.child=o):(n=s.last,n!==null?n.sibling=o:e.child=o,s.last=o)}return s.tail!==null?(e=s.tail,s.rendering=e,s.tail=e.sibling,s.renderingStartTime=bt(),e.sibling=null,n=St.current,ft(St,i?n&1|2:n&1),e):(Yt(e),null);case 22:case 23:return ef(),i=e.memoizedState!==null,t!==null&&t.memoizedState!==null!==i&&(e.flags|=8192),i&&e.mode&1?Mn&1073741824&&(Yt(e),e.subtreeFlags&6&&(e.flags|=8192)):Yt(e),null;case 24:return null;case 25:return null}throw Error(ie(156,e.tag))}function hy(t,e){switch(Ih(e),e.tag){case 1:return mn(e.type)&&Fl(),t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 3:return Hs(),xt(pn),xt(en),Gh(),t=e.flags,t&65536&&!(t&128)?(e.flags=t&-65537|128,e):null;case 5:return Vh(e),null;case 13:if(xt(St),t=e.memoizedState,t!==null&&t.dehydrated!==null){if(e.alternate===null)throw Error(ie(340));Bs()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 19:return xt(St),null;case 4:return Hs(),null;case 10:return kh(e.type._context),null;case 22:case 23:return ef(),null;case 24:return null;default:return null}}var Ua=!1,Zt=!1,fy=typeof WeakSet=="function"?WeakSet:Set,xe=null;function Ts(t,e){var n=t.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(i){At(t,e,i)}else n.current=null}function md(t,e,n){try{n()}catch(i){At(t,e,i)}}var Lp=!1;function py(t,e){if(Qu=Ll,t=l0(),Nh(t)){if("selectionStart"in t)var n={start:t.selectionStart,end:t.selectionEnd};else e:{n=(n=t.ownerDocument)&&n.defaultView||window;var i=n.getSelection&&n.getSelection();if(i&&i.rangeCount!==0){n=i.anchorNode;var r=i.anchorOffset,s=i.focusNode;i=i.focusOffset;try{n.nodeType,s.nodeType}catch{n=null;break e}var o=0,a=-1,l=-1,c=0,d=0,h=t,f=null;t:for(;;){for(var p;h!==n||r!==0&&h.nodeType!==3||(a=o+r),h!==s||i!==0&&h.nodeType!==3||(l=o+i),h.nodeType===3&&(o+=h.nodeValue.length),(p=h.firstChild)!==null;)f=h,h=p;for(;;){if(h===t)break t;if(f===n&&++c===r&&(a=o),f===s&&++d===i&&(l=o),(p=h.nextSibling)!==null)break;h=f,f=h.parentNode}h=p}n=a===-1||l===-1?null:{start:a,end:l}}else n=null}n=n||{start:0,end:0}}else n=null;for(Ju={focusedElem:t,selectionRange:n},Ll=!1,xe=e;xe!==null;)if(e=xe,t=e.child,(e.subtreeFlags&1028)!==0&&t!==null)t.return=e,xe=t;else for(;xe!==null;){e=xe;try{var v=e.alternate;if(e.flags&1024)switch(e.tag){case 0:case 11:case 15:break;case 1:if(v!==null){var y=v.memoizedProps,m=v.memoizedState,u=e.stateNode,g=u.getSnapshotBeforeUpdate(e.elementType===e.type?y:jn(e.type,y),m);u.__reactInternalSnapshotBeforeUpdate=g}break;case 3:var x=e.stateNode.containerInfo;x.nodeType===1?x.textContent="":x.nodeType===9&&x.documentElement&&x.removeChild(x.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(ie(163))}}catch(_){At(e,e.return,_)}if(t=e.sibling,t!==null){t.return=e.return,xe=t;break}xe=e.return}return v=Lp,Lp=!1,v}function Fo(t,e,n){var i=e.updateQueue;if(i=i!==null?i.lastEffect:null,i!==null){var r=i=i.next;do{if((r.tag&t)===t){var s=r.destroy;r.destroy=void 0,s!==void 0&&md(e,n,s)}r=r.next}while(r!==i)}}function dc(t,e){if(e=e.updateQueue,e=e!==null?e.lastEffect:null,e!==null){var n=e=e.next;do{if((n.tag&t)===t){var i=n.create;n.destroy=i()}n=n.next}while(n!==e)}}function gd(t){var e=t.ref;if(e!==null){var n=t.stateNode;switch(t.tag){case 5:t=n;break;default:t=n}typeof e=="function"?e(t):e.current=t}}function rv(t){var e=t.alternate;e!==null&&(t.alternate=null,rv(e)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(e=t.stateNode,e!==null&&(delete e[oi],delete e[ea],delete e[nd],delete e[$_],delete e[Z_])),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}function sv(t){return t.tag===5||t.tag===3||t.tag===4}function Ip(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||sv(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function vd(t,e,n){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?n.nodeType===8?n.parentNode.insertBefore(t,e):n.insertBefore(t,e):(n.nodeType===8?(e=n.parentNode,e.insertBefore(t,n)):(e=n,e.appendChild(t)),n=n._reactRootContainer,n!=null||e.onclick!==null||(e.onclick=Ol));else if(i!==4&&(t=t.child,t!==null))for(vd(t,e,n),t=t.sibling;t!==null;)vd(t,e,n),t=t.sibling}function xd(t,e,n){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?n.insertBefore(t,e):n.appendChild(t);else if(i!==4&&(t=t.child,t!==null))for(xd(t,e,n),t=t.sibling;t!==null;)xd(t,e,n),t=t.sibling}var Ht=null,Xn=!1;function Ui(t,e,n){for(n=n.child;n!==null;)ov(t,e,n),n=n.sibling}function ov(t,e,n){if(li&&typeof li.onCommitFiberUnmount=="function")try{li.onCommitFiberUnmount(ic,n)}catch{}switch(n.tag){case 5:Zt||Ts(n,e);case 6:var i=Ht,r=Xn;Ht=null,Ui(t,e,n),Ht=i,Xn=r,Ht!==null&&(Xn?(t=Ht,n=n.stateNode,t.nodeType===8?t.parentNode.removeChild(n):t.removeChild(n)):Ht.removeChild(n.stateNode));break;case 18:Ht!==null&&(Xn?(t=Ht,n=n.stateNode,t.nodeType===8?Bc(t.parentNode,n):t.nodeType===1&&Bc(t,n),qo(t)):Bc(Ht,n.stateNode));break;case 4:i=Ht,r=Xn,Ht=n.stateNode.containerInfo,Xn=!0,Ui(t,e,n),Ht=i,Xn=r;break;case 0:case 11:case 14:case 15:if(!Zt&&(i=n.updateQueue,i!==null&&(i=i.lastEffect,i!==null))){r=i=i.next;do{var s=r,o=s.destroy;s=s.tag,o!==void 0&&(s&2||s&4)&&md(n,e,o),r=r.next}while(r!==i)}Ui(t,e,n);break;case 1:if(!Zt&&(Ts(n,e),i=n.stateNode,typeof i.componentWillUnmount=="function"))try{i.props=n.memoizedProps,i.state=n.memoizedState,i.componentWillUnmount()}catch(a){At(n,e,a)}Ui(t,e,n);break;case 21:Ui(t,e,n);break;case 22:n.mode&1?(Zt=(i=Zt)||n.memoizedState!==null,Ui(t,e,n),Zt=i):Ui(t,e,n);break;default:Ui(t,e,n)}}function Up(t){var e=t.updateQueue;if(e!==null){t.updateQueue=null;var n=t.stateNode;n===null&&(n=t.stateNode=new fy),e.forEach(function(i){var r=wy.bind(null,t,i);n.has(i)||(n.add(i),i.then(r,r))})}}function Hn(t,e){var n=e.deletions;if(n!==null)for(var i=0;i<n.length;i++){var r=n[i];try{var s=t,o=e,a=o;e:for(;a!==null;){switch(a.tag){case 5:Ht=a.stateNode,Xn=!1;break e;case 3:Ht=a.stateNode.containerInfo,Xn=!0;break e;case 4:Ht=a.stateNode.containerInfo,Xn=!0;break e}a=a.return}if(Ht===null)throw Error(ie(160));ov(s,o,r),Ht=null,Xn=!1;var l=r.alternate;l!==null&&(l.return=null),r.return=null}catch(c){At(r,e,c)}}if(e.subtreeFlags&12854)for(e=e.child;e!==null;)av(e,t),e=e.sibling}function av(t,e){var n=t.alternate,i=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:if(Hn(e,t),ni(t),i&4){try{Fo(3,t,t.return),dc(3,t)}catch(y){At(t,t.return,y)}try{Fo(5,t,t.return)}catch(y){At(t,t.return,y)}}break;case 1:Hn(e,t),ni(t),i&512&&n!==null&&Ts(n,n.return);break;case 5:if(Hn(e,t),ni(t),i&512&&n!==null&&Ts(n,n.return),t.flags&32){var r=t.stateNode;try{jo(r,"")}catch(y){At(t,t.return,y)}}if(i&4&&(r=t.stateNode,r!=null)){var s=t.memoizedProps,o=n!==null?n.memoizedProps:s,a=t.type,l=t.updateQueue;if(t.updateQueue=null,l!==null)try{a==="input"&&s.type==="radio"&&s.name!=null&&Pg(r,s),Vu(a,o);var c=Vu(a,s);for(o=0;o<l.length;o+=2){var d=l[o],h=l[o+1];d==="style"?Ig(r,h):d==="dangerouslySetInnerHTML"?Ng(r,h):d==="children"?jo(r,h):_h(r,d,h,c)}switch(a){case"input":Fu(r,s);break;case"textarea":Rg(r,s);break;case"select":var f=r._wrapperState.wasMultiple;r._wrapperState.wasMultiple=!!s.multiple;var p=s.value;p!=null?Ps(r,!!s.multiple,p,!1):f!==!!s.multiple&&(s.defaultValue!=null?Ps(r,!!s.multiple,s.defaultValue,!0):Ps(r,!!s.multiple,s.multiple?[]:"",!1))}r[ea]=s}catch(y){At(t,t.return,y)}}break;case 6:if(Hn(e,t),ni(t),i&4){if(t.stateNode===null)throw Error(ie(162));r=t.stateNode,s=t.memoizedProps;try{r.nodeValue=s}catch(y){At(t,t.return,y)}}break;case 3:if(Hn(e,t),ni(t),i&4&&n!==null&&n.memoizedState.isDehydrated)try{qo(e.containerInfo)}catch(y){At(t,t.return,y)}break;case 4:Hn(e,t),ni(t);break;case 13:Hn(e,t),ni(t),r=t.child,r.flags&8192&&(s=r.memoizedState!==null,r.stateNode.isHidden=s,!s||r.alternate!==null&&r.alternate.memoizedState!==null||(Qh=bt())),i&4&&Up(t);break;case 22:if(d=n!==null&&n.memoizedState!==null,t.mode&1?(Zt=(c=Zt)||d,Hn(e,t),Zt=c):Hn(e,t),ni(t),i&8192){if(c=t.memoizedState!==null,(t.stateNode.isHidden=c)&&!d&&t.mode&1)for(xe=t,d=t.child;d!==null;){for(h=xe=d;xe!==null;){switch(f=xe,p=f.child,f.tag){case 0:case 11:case 14:case 15:Fo(4,f,f.return);break;case 1:Ts(f,f.return);var v=f.stateNode;if(typeof v.componentWillUnmount=="function"){i=f,n=f.return;try{e=i,v.props=e.memoizedProps,v.state=e.memoizedState,v.componentWillUnmount()}catch(y){At(i,n,y)}}break;case 5:Ts(f,f.return);break;case 22:if(f.memoizedState!==null){Fp(h);continue}}p!==null?(p.return=f,xe=p):Fp(h)}d=d.sibling}e:for(d=null,h=t;;){if(h.tag===5){if(d===null){d=h;try{r=h.stateNode,c?(s=r.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(a=h.stateNode,l=h.memoizedProps.style,o=l!=null&&l.hasOwnProperty("display")?l.display:null,a.style.display=Lg("display",o))}catch(y){At(t,t.return,y)}}}else if(h.tag===6){if(d===null)try{h.stateNode.nodeValue=c?"":h.memoizedProps}catch(y){At(t,t.return,y)}}else if((h.tag!==22&&h.tag!==23||h.memoizedState===null||h===t)&&h.child!==null){h.child.return=h,h=h.child;continue}if(h===t)break e;for(;h.sibling===null;){if(h.return===null||h.return===t)break e;d===h&&(d=null),h=h.return}d===h&&(d=null),h.sibling.return=h.return,h=h.sibling}}break;case 19:Hn(e,t),ni(t),i&4&&Up(t);break;case 21:break;default:Hn(e,t),ni(t)}}function ni(t){var e=t.flags;if(e&2){try{e:{for(var n=t.return;n!==null;){if(sv(n)){var i=n;break e}n=n.return}throw Error(ie(160))}switch(i.tag){case 5:var r=i.stateNode;i.flags&32&&(jo(r,""),i.flags&=-33);var s=Ip(t);xd(t,s,r);break;case 3:case 4:var o=i.stateNode.containerInfo,a=Ip(t);vd(t,a,o);break;default:throw Error(ie(161))}}catch(l){At(t,t.return,l)}t.flags&=-3}e&4096&&(t.flags&=-4097)}function my(t,e,n){xe=t,lv(t)}function lv(t,e,n){for(var i=(t.mode&1)!==0;xe!==null;){var r=xe,s=r.child;if(r.tag===22&&i){var o=r.memoizedState!==null||Ua;if(!o){var a=r.alternate,l=a!==null&&a.memoizedState!==null||Zt;a=Ua;var c=Zt;if(Ua=o,(Zt=l)&&!c)for(xe=r;xe!==null;)o=xe,l=o.child,o.tag===22&&o.memoizedState!==null?kp(r):l!==null?(l.return=o,xe=l):kp(r);for(;s!==null;)xe=s,lv(s),s=s.sibling;xe=r,Ua=a,Zt=c}Op(t)}else r.subtreeFlags&8772&&s!==null?(s.return=r,xe=s):Op(t)}}function Op(t){for(;xe!==null;){var e=xe;if(e.flags&8772){var n=e.alternate;try{if(e.flags&8772)switch(e.tag){case 0:case 11:case 15:Zt||dc(5,e);break;case 1:var i=e.stateNode;if(e.flags&4&&!Zt)if(n===null)i.componentDidMount();else{var r=e.elementType===e.type?n.memoizedProps:jn(e.type,n.memoizedProps);i.componentDidUpdate(r,n.memoizedState,i.__reactInternalSnapshotBeforeUpdate)}var s=e.updateQueue;s!==null&&yp(e,s,i);break;case 3:var o=e.updateQueue;if(o!==null){if(n=null,e.child!==null)switch(e.child.tag){case 5:n=e.child.stateNode;break;case 1:n=e.child.stateNode}yp(e,o,n)}break;case 5:var a=e.stateNode;if(n===null&&e.flags&4){n=a;var l=e.memoizedProps;switch(e.type){case"button":case"input":case"select":case"textarea":l.autoFocus&&n.focus();break;case"img":l.src&&(n.src=l.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(e.memoizedState===null){var c=e.alternate;if(c!==null){var d=c.memoizedState;if(d!==null){var h=d.dehydrated;h!==null&&qo(h)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(ie(163))}Zt||e.flags&512&&gd(e)}catch(f){At(e,e.return,f)}}if(e===t){xe=null;break}if(n=e.sibling,n!==null){n.return=e.return,xe=n;break}xe=e.return}}function Fp(t){for(;xe!==null;){var e=xe;if(e===t){xe=null;break}var n=e.sibling;if(n!==null){n.return=e.return,xe=n;break}xe=e.return}}function kp(t){for(;xe!==null;){var e=xe;try{switch(e.tag){case 0:case 11:case 15:var n=e.return;try{dc(4,e)}catch(l){At(e,n,l)}break;case 1:var i=e.stateNode;if(typeof i.componentDidMount=="function"){var r=e.return;try{i.componentDidMount()}catch(l){At(e,r,l)}}var s=e.return;try{gd(e)}catch(l){At(e,s,l)}break;case 5:var o=e.return;try{gd(e)}catch(l){At(e,o,l)}}}catch(l){At(e,e.return,l)}if(e===t){xe=null;break}var a=e.sibling;if(a!==null){a.return=e.return,xe=a;break}xe=e.return}}var gy=Math.ceil,Kl=Ni.ReactCurrentDispatcher,$h=Ni.ReactCurrentOwner,On=Ni.ReactCurrentBatchConfig,$e=0,Bt=null,Rt=null,Gt=0,Mn=0,As=hr(0),Nt=0,oa=null,Hr=0,hc=0,Zh=0,ko=null,dn=null,Qh=0,Gs=1/0,_i=null,Yl=!1,_d=null,tr=null,Oa=!1,qi=null,ql=0,Bo=0,yd=null,_l=-1,yl=0;function an(){return $e&6?bt():_l!==-1?_l:_l=bt()}function nr(t){return t.mode&1?$e&2&&Gt!==0?Gt&-Gt:J_.transition!==null?(yl===0&&(yl=Xg()),yl):(t=it,t!==0||(t=window.event,t=t===void 0?16:Jg(t.type)),t):1}function Jn(t,e,n,i){if(50<Bo)throw Bo=0,yd=null,Error(ie(185));ha(t,n,i),(!($e&2)||t!==Bt)&&(t===Bt&&(!($e&2)&&(hc|=n),Nt===4&&Ki(t,Gt)),gn(t,i),n===1&&$e===0&&!(e.mode&1)&&(Gs=bt()+500,lc&&fr()))}function gn(t,e){var n=t.callbackNode;Jx(t,e);var i=Nl(t,t===Bt?Gt:0);if(i===0)n!==null&&Kf(n),t.callbackNode=null,t.callbackPriority=0;else if(e=i&-i,t.callbackPriority!==e){if(n!=null&&Kf(n),e===1)t.tag===0?Q_(Bp.bind(null,t)):x0(Bp.bind(null,t)),Y_(function(){!($e&6)&&fr()}),n=null;else{switch(Kg(i)){case 1:n=Eh;break;case 4:n=Wg;break;case 16:n=Dl;break;case 536870912:n=jg;break;default:n=Dl}n=gv(n,cv.bind(null,t))}t.callbackPriority=e,t.callbackNode=n}}function cv(t,e){if(_l=-1,yl=0,$e&6)throw Error(ie(327));var n=t.callbackNode;if(Is()&&t.callbackNode!==n)return null;var i=Nl(t,t===Bt?Gt:0);if(i===0)return null;if(i&30||i&t.expiredLanes||e)e=$l(t,i);else{e=i;var r=$e;$e|=2;var s=dv();(Bt!==t||Gt!==e)&&(_i=null,Gs=bt()+500,Ur(t,e));do try{_y();break}catch(a){uv(t,a)}while(!0);Fh(),Kl.current=s,$e=r,Rt!==null?e=0:(Bt=null,Gt=0,e=Nt)}if(e!==0){if(e===2&&(r=Ku(t),r!==0&&(i=r,e=Md(t,r))),e===1)throw n=oa,Ur(t,0),Ki(t,i),gn(t,bt()),n;if(e===6)Ki(t,i);else{if(r=t.current.alternate,!(i&30)&&!vy(r)&&(e=$l(t,i),e===2&&(s=Ku(t),s!==0&&(i=s,e=Md(t,s))),e===1))throw n=oa,Ur(t,0),Ki(t,i),gn(t,bt()),n;switch(t.finishedWork=r,t.finishedLanes=i,e){case 0:case 1:throw Error(ie(345));case 2:wr(t,dn,_i);break;case 3:if(Ki(t,i),(i&130023424)===i&&(e=Qh+500-bt(),10<e)){if(Nl(t,0)!==0)break;if(r=t.suspendedLanes,(r&i)!==i){an(),t.pingedLanes|=t.suspendedLanes&r;break}t.timeoutHandle=td(wr.bind(null,t,dn,_i),e);break}wr(t,dn,_i);break;case 4:if(Ki(t,i),(i&4194240)===i)break;for(e=t.eventTimes,r=-1;0<i;){var o=31-Qn(i);s=1<<o,o=e[o],o>r&&(r=o),i&=~s}if(i=r,i=bt()-i,i=(120>i?120:480>i?480:1080>i?1080:1920>i?1920:3e3>i?3e3:4320>i?4320:1960*gy(i/1960))-i,10<i){t.timeoutHandle=td(wr.bind(null,t,dn,_i),i);break}wr(t,dn,_i);break;case 5:wr(t,dn,_i);break;default:throw Error(ie(329))}}}return gn(t,bt()),t.callbackNode===n?cv.bind(null,t):null}function Md(t,e){var n=ko;return t.current.memoizedState.isDehydrated&&(Ur(t,e).flags|=256),t=$l(t,e),t!==2&&(e=dn,dn=n,e!==null&&Sd(e)),t}function Sd(t){dn===null?dn=t:dn.push.apply(dn,t)}function vy(t){for(var e=t;;){if(e.flags&16384){var n=e.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var i=0;i<n.length;i++){var r=n[i],s=r.getSnapshot;r=r.value;try{if(!ei(s(),r))return!1}catch{return!1}}}if(n=e.child,e.subtreeFlags&16384&&n!==null)n.return=e,e=n;else{if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function Ki(t,e){for(e&=~Zh,e&=~hc,t.suspendedLanes|=e,t.pingedLanes&=~e,t=t.expirationTimes;0<e;){var n=31-Qn(e),i=1<<n;t[n]=-1,e&=~i}}function Bp(t){if($e&6)throw Error(ie(327));Is();var e=Nl(t,0);if(!(e&1))return gn(t,bt()),null;var n=$l(t,e);if(t.tag!==0&&n===2){var i=Ku(t);i!==0&&(e=i,n=Md(t,i))}if(n===1)throw n=oa,Ur(t,0),Ki(t,e),gn(t,bt()),n;if(n===6)throw Error(ie(345));return t.finishedWork=t.current.alternate,t.finishedLanes=e,wr(t,dn,_i),gn(t,bt()),null}function Jh(t,e){var n=$e;$e|=1;try{return t(e)}finally{$e=n,$e===0&&(Gs=bt()+500,lc&&fr())}}function Vr(t){qi!==null&&qi.tag===0&&!($e&6)&&Is();var e=$e;$e|=1;var n=On.transition,i=it;try{if(On.transition=null,it=1,t)return t()}finally{it=i,On.transition=n,$e=e,!($e&6)&&fr()}}function ef(){Mn=As.current,xt(As)}function Ur(t,e){t.finishedWork=null,t.finishedLanes=0;var n=t.timeoutHandle;if(n!==-1&&(t.timeoutHandle=-1,K_(n)),Rt!==null)for(n=Rt.return;n!==null;){var i=n;switch(Ih(i),i.tag){case 1:i=i.type.childContextTypes,i!=null&&Fl();break;case 3:Hs(),xt(pn),xt(en),Gh();break;case 5:Vh(i);break;case 4:Hs();break;case 13:xt(St);break;case 19:xt(St);break;case 10:kh(i.type._context);break;case 22:case 23:ef()}n=n.return}if(Bt=t,Rt=t=ir(t.current,null),Gt=Mn=e,Nt=0,oa=null,Zh=hc=Hr=0,dn=ko=null,Nr!==null){for(e=0;e<Nr.length;e++)if(n=Nr[e],i=n.interleaved,i!==null){n.interleaved=null;var r=i.next,s=n.pending;if(s!==null){var o=s.next;s.next=r,i.next=o}n.pending=i}Nr=null}return t}function uv(t,e){do{var n=Rt;try{if(Fh(),gl.current=Xl,jl){for(var i=wt.memoizedState;i!==null;){var r=i.queue;r!==null&&(r.pending=null),i=i.next}jl=!1}if(zr=0,kt=Dt=wt=null,Oo=!1,ia=0,$h.current=null,n===null||n.return===null){Nt=1,oa=e,Rt=null;break}e:{var s=t,o=n.return,a=n,l=e;if(e=Gt,a.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){var c=l,d=a,h=d.tag;if(!(d.mode&1)&&(h===0||h===11||h===15)){var f=d.alternate;f?(d.updateQueue=f.updateQueue,d.memoizedState=f.memoizedState,d.lanes=f.lanes):(d.updateQueue=null,d.memoizedState=null)}var p=Ap(o);if(p!==null){p.flags&=-257,bp(p,o,a,s,e),p.mode&1&&Tp(s,c,e),e=p,l=c;var v=e.updateQueue;if(v===null){var y=new Set;y.add(l),e.updateQueue=y}else v.add(l);break e}else{if(!(e&1)){Tp(s,c,e),tf();break e}l=Error(ie(426))}}else if(_t&&a.mode&1){var m=Ap(o);if(m!==null){!(m.flags&65536)&&(m.flags|=256),bp(m,o,a,s,e),Uh(Vs(l,a));break e}}s=l=Vs(l,a),Nt!==4&&(Nt=2),ko===null?ko=[s]:ko.push(s),s=o;do{switch(s.tag){case 3:s.flags|=65536,e&=-e,s.lanes|=e;var u=K0(s,l,e);_p(s,u);break e;case 1:a=l;var g=s.type,x=s.stateNode;if(!(s.flags&128)&&(typeof g.getDerivedStateFromError=="function"||x!==null&&typeof x.componentDidCatch=="function"&&(tr===null||!tr.has(x)))){s.flags|=65536,e&=-e,s.lanes|=e;var _=Y0(s,a,e);_p(s,_);break e}}s=s.return}while(s!==null)}fv(n)}catch(P){e=P,Rt===n&&n!==null&&(Rt=n=n.return);continue}break}while(!0)}function dv(){var t=Kl.current;return Kl.current=Xl,t===null?Xl:t}function tf(){(Nt===0||Nt===3||Nt===2)&&(Nt=4),Bt===null||!(Hr&268435455)&&!(hc&268435455)||Ki(Bt,Gt)}function $l(t,e){var n=$e;$e|=2;var i=dv();(Bt!==t||Gt!==e)&&(_i=null,Ur(t,e));do try{xy();break}catch(r){uv(t,r)}while(!0);if(Fh(),$e=n,Kl.current=i,Rt!==null)throw Error(ie(261));return Bt=null,Gt=0,Nt}function xy(){for(;Rt!==null;)hv(Rt)}function _y(){for(;Rt!==null&&!Wx();)hv(Rt)}function hv(t){var e=mv(t.alternate,t,Mn);t.memoizedProps=t.pendingProps,e===null?fv(t):Rt=e,$h.current=null}function fv(t){var e=t;do{var n=e.alternate;if(t=e.return,e.flags&32768){if(n=hy(n,e),n!==null){n.flags&=32767,Rt=n;return}if(t!==null)t.flags|=32768,t.subtreeFlags=0,t.deletions=null;else{Nt=6,Rt=null;return}}else if(n=dy(n,e,Mn),n!==null){Rt=n;return}if(e=e.sibling,e!==null){Rt=e;return}Rt=e=t}while(e!==null);Nt===0&&(Nt=5)}function wr(t,e,n){var i=it,r=On.transition;try{On.transition=null,it=1,yy(t,e,n,i)}finally{On.transition=r,it=i}return null}function yy(t,e,n,i){do Is();while(qi!==null);if($e&6)throw Error(ie(327));n=t.finishedWork;var r=t.finishedLanes;if(n===null)return null;if(t.finishedWork=null,t.finishedLanes=0,n===t.current)throw Error(ie(177));t.callbackNode=null,t.callbackPriority=0;var s=n.lanes|n.childLanes;if(e_(t,s),t===Bt&&(Rt=Bt=null,Gt=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||Oa||(Oa=!0,gv(Dl,function(){return Is(),null})),s=(n.flags&15990)!==0,n.subtreeFlags&15990||s){s=On.transition,On.transition=null;var o=it;it=1;var a=$e;$e|=4,$h.current=null,py(t,n),av(n,t),z_(Ju),Ll=!!Qu,Ju=Qu=null,t.current=n,my(n),jx(),$e=a,it=o,On.transition=s}else t.current=n;if(Oa&&(Oa=!1,qi=t,ql=r),s=t.pendingLanes,s===0&&(tr=null),Yx(n.stateNode),gn(t,bt()),e!==null)for(i=t.onRecoverableError,n=0;n<e.length;n++)r=e[n],i(r.value,{componentStack:r.stack,digest:r.digest});if(Yl)throw Yl=!1,t=_d,_d=null,t;return ql&1&&t.tag!==0&&Is(),s=t.pendingLanes,s&1?t===yd?Bo++:(Bo=0,yd=t):Bo=0,fr(),null}function Is(){if(qi!==null){var t=Kg(ql),e=On.transition,n=it;try{if(On.transition=null,it=16>t?16:t,qi===null)var i=!1;else{if(t=qi,qi=null,ql=0,$e&6)throw Error(ie(331));var r=$e;for($e|=4,xe=t.current;xe!==null;){var s=xe,o=s.child;if(xe.flags&16){var a=s.deletions;if(a!==null){for(var l=0;l<a.length;l++){var c=a[l];for(xe=c;xe!==null;){var d=xe;switch(d.tag){case 0:case 11:case 15:Fo(8,d,s)}var h=d.child;if(h!==null)h.return=d,xe=h;else for(;xe!==null;){d=xe;var f=d.sibling,p=d.return;if(rv(d),d===c){xe=null;break}if(f!==null){f.return=p,xe=f;break}xe=p}}}var v=s.alternate;if(v!==null){var y=v.child;if(y!==null){v.child=null;do{var m=y.sibling;y.sibling=null,y=m}while(y!==null)}}xe=s}}if(s.subtreeFlags&2064&&o!==null)o.return=s,xe=o;else e:for(;xe!==null;){if(s=xe,s.flags&2048)switch(s.tag){case 0:case 11:case 15:Fo(9,s,s.return)}var u=s.sibling;if(u!==null){u.return=s.return,xe=u;break e}xe=s.return}}var g=t.current;for(xe=g;xe!==null;){o=xe;var x=o.child;if(o.subtreeFlags&2064&&x!==null)x.return=o,xe=x;else e:for(o=g;xe!==null;){if(a=xe,a.flags&2048)try{switch(a.tag){case 0:case 11:case 15:dc(9,a)}}catch(P){At(a,a.return,P)}if(a===o){xe=null;break e}var _=a.sibling;if(_!==null){_.return=a.return,xe=_;break e}xe=a.return}}if($e=r,fr(),li&&typeof li.onPostCommitFiberRoot=="function")try{li.onPostCommitFiberRoot(ic,t)}catch{}i=!0}return i}finally{it=n,On.transition=e}}return!1}function zp(t,e,n){e=Vs(n,e),e=K0(t,e,1),t=er(t,e,1),e=an(),t!==null&&(ha(t,1,e),gn(t,e))}function At(t,e,n){if(t.tag===3)zp(t,t,n);else for(;e!==null;){if(e.tag===3){zp(e,t,n);break}else if(e.tag===1){var i=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof i.componentDidCatch=="function"&&(tr===null||!tr.has(i))){t=Vs(n,t),t=Y0(e,t,1),e=er(e,t,1),t=an(),e!==null&&(ha(e,1,t),gn(e,t));break}}e=e.return}}function My(t,e,n){var i=t.pingCache;i!==null&&i.delete(e),e=an(),t.pingedLanes|=t.suspendedLanes&n,Bt===t&&(Gt&n)===n&&(Nt===4||Nt===3&&(Gt&130023424)===Gt&&500>bt()-Qh?Ur(t,0):Zh|=n),gn(t,e)}function pv(t,e){e===0&&(t.mode&1?(e=Aa,Aa<<=1,!(Aa&130023424)&&(Aa=4194304)):e=1);var n=an();t=Ci(t,e),t!==null&&(ha(t,e,n),gn(t,n))}function Sy(t){var e=t.memoizedState,n=0;e!==null&&(n=e.retryLane),pv(t,n)}function wy(t,e){var n=0;switch(t.tag){case 13:var i=t.stateNode,r=t.memoizedState;r!==null&&(n=r.retryLane);break;case 19:i=t.stateNode;break;default:throw Error(ie(314))}i!==null&&i.delete(e),pv(t,n)}var mv;mv=function(t,e,n){if(t!==null)if(t.memoizedProps!==e.pendingProps||pn.current)hn=!0;else{if(!(t.lanes&n)&&!(e.flags&128))return hn=!1,uy(t,e,n);hn=!!(t.flags&131072)}else hn=!1,_t&&e.flags&1048576&&_0(e,zl,e.index);switch(e.lanes=0,e.tag){case 2:var i=e.type;xl(t,e),t=e.pendingProps;var r=ks(e,en.current);Ls(e,n),r=jh(null,e,i,t,r,n);var s=Xh();return e.flags|=1,typeof r=="object"&&r!==null&&typeof r.render=="function"&&r.$$typeof===void 0?(e.tag=1,e.memoizedState=null,e.updateQueue=null,mn(i)?(s=!0,kl(e)):s=!1,e.memoizedState=r.state!==null&&r.state!==void 0?r.state:null,zh(e),r.updater=uc,e.stateNode=r,r._reactInternals=e,ld(e,i,t,n),e=dd(null,e,i,!0,s,n)):(e.tag=0,_t&&s&&Lh(e),sn(null,e,r,n),e=e.child),e;case 16:i=e.elementType;e:{switch(xl(t,e),t=e.pendingProps,r=i._init,i=r(i._payload),e.type=i,r=e.tag=Ty(i),t=jn(i,t),r){case 0:e=ud(null,e,i,t,n);break e;case 1:e=Rp(null,e,i,t,n);break e;case 11:e=Cp(null,e,i,t,n);break e;case 14:e=Pp(null,e,i,jn(i.type,t),n);break e}throw Error(ie(306,i,""))}return e;case 0:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:jn(i,r),ud(t,e,i,r,n);case 1:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:jn(i,r),Rp(t,e,i,r,n);case 3:e:{if(Q0(e),t===null)throw Error(ie(387));i=e.pendingProps,s=e.memoizedState,r=s.element,T0(t,e),Gl(e,i,null,n);var o=e.memoizedState;if(i=o.element,s.isDehydrated)if(s={element:i,isDehydrated:!1,cache:o.cache,pendingSuspenseBoundaries:o.pendingSuspenseBoundaries,transitions:o.transitions},e.updateQueue.baseState=s,e.memoizedState=s,e.flags&256){r=Vs(Error(ie(423)),e),e=Dp(t,e,i,n,r);break e}else if(i!==r){r=Vs(Error(ie(424)),e),e=Dp(t,e,i,n,r);break e}else for(En=Ji(e.stateNode.containerInfo.firstChild),Tn=e,_t=!0,Kn=null,n=w0(e,null,i,n),e.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(Bs(),i===r){e=Pi(t,e,n);break e}sn(t,e,i,n)}e=e.child}return e;case 5:return A0(e),t===null&&sd(e),i=e.type,r=e.pendingProps,s=t!==null?t.memoizedProps:null,o=r.children,ed(i,r)?o=null:s!==null&&ed(i,s)&&(e.flags|=32),Z0(t,e),sn(t,e,o,n),e.child;case 6:return t===null&&sd(e),null;case 13:return J0(t,e,n);case 4:return Hh(e,e.stateNode.containerInfo),i=e.pendingProps,t===null?e.child=zs(e,null,i,n):sn(t,e,i,n),e.child;case 11:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:jn(i,r),Cp(t,e,i,r,n);case 7:return sn(t,e,e.pendingProps,n),e.child;case 8:return sn(t,e,e.pendingProps.children,n),e.child;case 12:return sn(t,e,e.pendingProps.children,n),e.child;case 10:e:{if(i=e.type._context,r=e.pendingProps,s=e.memoizedProps,o=r.value,ft(Hl,i._currentValue),i._currentValue=o,s!==null)if(ei(s.value,o)){if(s.children===r.children&&!pn.current){e=Pi(t,e,n);break e}}else for(s=e.child,s!==null&&(s.return=e);s!==null;){var a=s.dependencies;if(a!==null){o=s.child;for(var l=a.firstContext;l!==null;){if(l.context===i){if(s.tag===1){l=Ei(-1,n&-n),l.tag=2;var c=s.updateQueue;if(c!==null){c=c.shared;var d=c.pending;d===null?l.next=l:(l.next=d.next,d.next=l),c.pending=l}}s.lanes|=n,l=s.alternate,l!==null&&(l.lanes|=n),od(s.return,n,e),a.lanes|=n;break}l=l.next}}else if(s.tag===10)o=s.type===e.type?null:s.child;else if(s.tag===18){if(o=s.return,o===null)throw Error(ie(341));o.lanes|=n,a=o.alternate,a!==null&&(a.lanes|=n),od(o,n,e),o=s.sibling}else o=s.child;if(o!==null)o.return=s;else for(o=s;o!==null;){if(o===e){o=null;break}if(s=o.sibling,s!==null){s.return=o.return,o=s;break}o=o.return}s=o}sn(t,e,r.children,n),e=e.child}return e;case 9:return r=e.type,i=e.pendingProps.children,Ls(e,n),r=Fn(r),i=i(r),e.flags|=1,sn(t,e,i,n),e.child;case 14:return i=e.type,r=jn(i,e.pendingProps),r=jn(i.type,r),Pp(t,e,i,r,n);case 15:return q0(t,e,e.type,e.pendingProps,n);case 17:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:jn(i,r),xl(t,e),e.tag=1,mn(i)?(t=!0,kl(e)):t=!1,Ls(e,n),X0(e,i,r),ld(e,i,r,n),dd(null,e,i,!0,t,n);case 19:return ev(t,e,n);case 22:return $0(t,e,n)}throw Error(ie(156,e.tag))};function gv(t,e){return Gg(t,e)}function Ey(t,e,n,i){this.tag=t,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=i,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Un(t,e,n,i){return new Ey(t,e,n,i)}function nf(t){return t=t.prototype,!(!t||!t.isReactComponent)}function Ty(t){if(typeof t=="function")return nf(t)?1:0;if(t!=null){if(t=t.$$typeof,t===Mh)return 11;if(t===Sh)return 14}return 2}function ir(t,e){var n=t.alternate;return n===null?(n=Un(t.tag,e,t.key,t.mode),n.elementType=t.elementType,n.type=t.type,n.stateNode=t.stateNode,n.alternate=t,t.alternate=n):(n.pendingProps=e,n.type=t.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=t.flags&14680064,n.childLanes=t.childLanes,n.lanes=t.lanes,n.child=t.child,n.memoizedProps=t.memoizedProps,n.memoizedState=t.memoizedState,n.updateQueue=t.updateQueue,e=t.dependencies,n.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},n.sibling=t.sibling,n.index=t.index,n.ref=t.ref,n}function Ml(t,e,n,i,r,s){var o=2;if(i=t,typeof t=="function")nf(t)&&(o=1);else if(typeof t=="string")o=5;else e:switch(t){case gs:return Or(n.children,r,s,e);case yh:o=8,r|=8;break;case Nu:return t=Un(12,n,e,r|2),t.elementType=Nu,t.lanes=s,t;case Lu:return t=Un(13,n,e,r),t.elementType=Lu,t.lanes=s,t;case Iu:return t=Un(19,n,e,r),t.elementType=Iu,t.lanes=s,t;case Ag:return fc(n,r,s,e);default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case Eg:o=10;break e;case Tg:o=9;break e;case Mh:o=11;break e;case Sh:o=14;break e;case Vi:o=16,i=null;break e}throw Error(ie(130,t==null?t:typeof t,""))}return e=Un(o,n,e,r),e.elementType=t,e.type=i,e.lanes=s,e}function Or(t,e,n,i){return t=Un(7,t,i,e),t.lanes=n,t}function fc(t,e,n,i){return t=Un(22,t,i,e),t.elementType=Ag,t.lanes=n,t.stateNode={isHidden:!1},t}function Kc(t,e,n){return t=Un(6,t,null,e),t.lanes=n,t}function Yc(t,e,n){return e=Un(4,t.children!==null?t.children:[],t.key,e),e.lanes=n,e.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},e}function Ay(t,e,n,i,r){this.tag=e,this.containerInfo=t,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Cc(0),this.expirationTimes=Cc(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Cc(0),this.identifierPrefix=i,this.onRecoverableError=r,this.mutableSourceEagerHydrationData=null}function rf(t,e,n,i,r,s,o,a,l){return t=new Ay(t,e,n,a,l),e===1?(e=1,s===!0&&(e|=8)):e=0,s=Un(3,null,null,e),t.current=s,s.stateNode=t,s.memoizedState={element:i,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},zh(s),t}function by(t,e,n){var i=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:ms,key:i==null?null:""+i,children:t,containerInfo:e,implementation:n}}function vv(t){if(!t)return cr;t=t._reactInternals;e:{if(Kr(t)!==t||t.tag!==1)throw Error(ie(170));var e=t;do{switch(e.tag){case 3:e=e.stateNode.context;break e;case 1:if(mn(e.type)){e=e.stateNode.__reactInternalMemoizedMergedChildContext;break e}}e=e.return}while(e!==null);throw Error(ie(171))}if(t.tag===1){var n=t.type;if(mn(n))return v0(t,n,e)}return e}function xv(t,e,n,i,r,s,o,a,l){return t=rf(n,i,!0,t,r,s,o,a,l),t.context=vv(null),n=t.current,i=an(),r=nr(n),s=Ei(i,r),s.callback=e??null,er(n,s,r),t.current.lanes=r,ha(t,r,i),gn(t,i),t}function pc(t,e,n,i){var r=e.current,s=an(),o=nr(r);return n=vv(n),e.context===null?e.context=n:e.pendingContext=n,e=Ei(s,o),e.payload={element:t},i=i===void 0?null:i,i!==null&&(e.callback=i),t=er(r,e,o),t!==null&&(Jn(t,r,o,s),ml(t,r,o)),o}function Zl(t){if(t=t.current,!t.child)return null;switch(t.child.tag){case 5:return t.child.stateNode;default:return t.child.stateNode}}function Hp(t,e){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var n=t.retryLane;t.retryLane=n!==0&&n<e?n:e}}function sf(t,e){Hp(t,e),(t=t.alternate)&&Hp(t,e)}function Cy(){return null}var _v=typeof reportError=="function"?reportError:function(t){console.error(t)};function of(t){this._internalRoot=t}mc.prototype.render=of.prototype.render=function(t){var e=this._internalRoot;if(e===null)throw Error(ie(409));pc(t,e,null,null)};mc.prototype.unmount=of.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var e=t.containerInfo;Vr(function(){pc(null,t,null,null)}),e[bi]=null}};function mc(t){this._internalRoot=t}mc.prototype.unstable_scheduleHydration=function(t){if(t){var e=$g();t={blockedOn:null,target:t,priority:e};for(var n=0;n<Xi.length&&e!==0&&e<Xi[n].priority;n++);Xi.splice(n,0,t),n===0&&Qg(t)}};function af(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function gc(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11&&(t.nodeType!==8||t.nodeValue!==" react-mount-point-unstable "))}function Vp(){}function Py(t,e,n,i,r){if(r){if(typeof i=="function"){var s=i;i=function(){var c=Zl(o);s.call(c)}}var o=xv(e,i,t,0,null,!1,!1,"",Vp);return t._reactRootContainer=o,t[bi]=o.current,Qo(t.nodeType===8?t.parentNode:t),Vr(),o}for(;r=t.lastChild;)t.removeChild(r);if(typeof i=="function"){var a=i;i=function(){var c=Zl(l);a.call(c)}}var l=rf(t,0,!1,null,null,!1,!1,"",Vp);return t._reactRootContainer=l,t[bi]=l.current,Qo(t.nodeType===8?t.parentNode:t),Vr(function(){pc(e,l,n,i)}),l}function vc(t,e,n,i,r){var s=n._reactRootContainer;if(s){var o=s;if(typeof r=="function"){var a=r;r=function(){var l=Zl(o);a.call(l)}}pc(e,o,t,r)}else o=Py(n,e,t,r,i);return Zl(o)}Yg=function(t){switch(t.tag){case 3:var e=t.stateNode;if(e.current.memoizedState.isDehydrated){var n=Ao(e.pendingLanes);n!==0&&(Th(e,n|1),gn(e,bt()),!($e&6)&&(Gs=bt()+500,fr()))}break;case 13:Vr(function(){var i=Ci(t,1);if(i!==null){var r=an();Jn(i,t,1,r)}}),sf(t,1)}};Ah=function(t){if(t.tag===13){var e=Ci(t,134217728);if(e!==null){var n=an();Jn(e,t,134217728,n)}sf(t,134217728)}};qg=function(t){if(t.tag===13){var e=nr(t),n=Ci(t,e);if(n!==null){var i=an();Jn(n,t,e,i)}sf(t,e)}};$g=function(){return it};Zg=function(t,e){var n=it;try{return it=t,e()}finally{it=n}};Wu=function(t,e,n){switch(e){case"input":if(Fu(t,n),e=n.name,n.type==="radio"&&e!=null){for(n=t;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+e)+'][type="radio"]'),e=0;e<n.length;e++){var i=n[e];if(i!==t&&i.form===t.form){var r=ac(i);if(!r)throw Error(ie(90));Cg(i),Fu(i,r)}}}break;case"textarea":Rg(t,n);break;case"select":e=n.value,e!=null&&Ps(t,!!n.multiple,e,!1)}};Fg=Jh;kg=Vr;var Ry={usingClientEntryPoint:!1,Events:[pa,ys,ac,Ug,Og,Jh]},po={findFiberByHostInstance:Dr,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Dy={bundleType:po.bundleType,version:po.version,rendererPackageName:po.rendererPackageName,rendererConfig:po.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Ni.ReactCurrentDispatcher,findHostInstanceByFiber:function(t){return t=Hg(t),t===null?null:t.stateNode},findFiberByHostInstance:po.findFiberByHostInstance||Cy,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Fa=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Fa.isDisabled&&Fa.supportsFiber)try{ic=Fa.inject(Dy),li=Fa}catch{}}Cn.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Ry;Cn.createPortal=function(t,e){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!af(e))throw Error(ie(200));return by(t,e,null,n)};Cn.createRoot=function(t,e){if(!af(t))throw Error(ie(299));var n=!1,i="",r=_v;return e!=null&&(e.unstable_strictMode===!0&&(n=!0),e.identifierPrefix!==void 0&&(i=e.identifierPrefix),e.onRecoverableError!==void 0&&(r=e.onRecoverableError)),e=rf(t,1,!1,null,null,n,!1,i,r),t[bi]=e.current,Qo(t.nodeType===8?t.parentNode:t),new of(e)};Cn.findDOMNode=function(t){if(t==null)return null;if(t.nodeType===1)return t;var e=t._reactInternals;if(e===void 0)throw typeof t.render=="function"?Error(ie(188)):(t=Object.keys(t).join(","),Error(ie(268,t)));return t=Hg(e),t=t===null?null:t.stateNode,t};Cn.flushSync=function(t){return Vr(t)};Cn.hydrate=function(t,e,n){if(!gc(e))throw Error(ie(200));return vc(null,t,e,!0,n)};Cn.hydrateRoot=function(t,e,n){if(!af(t))throw Error(ie(405));var i=n!=null&&n.hydratedSources||null,r=!1,s="",o=_v;if(n!=null&&(n.unstable_strictMode===!0&&(r=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onRecoverableError!==void 0&&(o=n.onRecoverableError)),e=xv(e,null,t,1,n??null,r,!1,s,o),t[bi]=e.current,Qo(t),i)for(t=0;t<i.length;t++)n=i[t],r=n._getVersion,r=r(n._source),e.mutableSourceEagerHydrationData==null?e.mutableSourceEagerHydrationData=[n,r]:e.mutableSourceEagerHydrationData.push(n,r);return new mc(e)};Cn.render=function(t,e,n){if(!gc(e))throw Error(ie(200));return vc(null,t,e,!1,n)};Cn.unmountComponentAtNode=function(t){if(!gc(t))throw Error(ie(40));return t._reactRootContainer?(Vr(function(){vc(null,null,t,!1,function(){t._reactRootContainer=null,t[bi]=null})}),!0):!1};Cn.unstable_batchedUpdates=Jh;Cn.unstable_renderSubtreeIntoContainer=function(t,e,n,i){if(!gc(n))throw Error(ie(200));if(t==null||t._reactInternals===void 0)throw Error(ie(38));return vc(t,e,n,!1,i)};Cn.version="18.3.1-next-f1338f8080-20240426";function yv(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(yv)}catch(t){console.error(t)}}yv(),yg.exports=Cn;var Ny=yg.exports,Gp=Ny;Ru.createRoot=Gp.createRoot,Ru.hydrateRoot=Gp.hydrateRoot;/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const lf="170",Ly=0,Wp=1,Iy=2,Mv=1,Uy=2,xi=3,ur=0,Lt=1,wn=2,rr=0,sr=1,Jt=2,jp=3,Xp=4,Oy=5,Ar=100,Fy=101,ky=102,By=103,zy=104,Hy=200,Vy=201,Gy=202,Wy=203,wd=204,Ed=205,jy=206,Xy=207,Ky=208,Yy=209,qy=210,$y=211,Zy=212,Qy=213,Jy=214,Td=0,Ad=1,bd=2,Ws=3,Cd=4,Pd=5,Rd=6,Dd=7,Sv=0,eM=1,tM=2,or=0,nM=1,iM=2,rM=3,wv=4,sM=5,oM=6,aM=7,Ev=300,js=301,Xs=302,Nd=303,Ld=304,xc=306,Mt=1e3,Qe=1001,Id=1002,An=1003,lM=1004,ka=1005,fn=1006,qc=1007,$n=1008,Ri=1009,Tv=1010,Av=1011,aa=1012,cf=1013,Gr=1014,ai=1015,ga=1016,uf=1017,df=1018,Ks=1020,bv=35902,Cv=1021,Pv=1022,Zn=1023,Rv=1024,Dv=1025,Us=1026,Ys=1027,hf=1028,ff=1029,Nv=1030,pf=1031,mf=1033,Sl=33776,wl=33777,El=33778,Tl=33779,Ud=35840,Od=35841,Fd=35842,kd=35843,Bd=36196,zd=37492,Hd=37496,Vd=37808,Gd=37809,Wd=37810,jd=37811,Xd=37812,Kd=37813,Yd=37814,qd=37815,$d=37816,Zd=37817,Qd=37818,Jd=37819,eh=37820,th=37821,Al=36492,nh=36494,ih=36495,Lv=36283,rh=36284,sh=36285,oh=36286,cM=3200,uM=3201,Iv=0,dM=1,In="",Vt="srgb",eo="srgb-linear",_c="linear",ot="srgb",Jr=7680,Kp=519,hM=512,fM=513,pM=514,Uv=515,mM=516,gM=517,vM=518,xM=519,Yp=35044,qp="300 es",wi=2e3,Ql=2001;class to{addEventListener(e,n){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(n)===-1&&i[e].push(n)}hasEventListener(e,n){if(this._listeners===void 0)return!1;const i=this._listeners;return i[e]!==void 0&&i[e].indexOf(n)!==-1}removeEventListener(e,n){if(this._listeners===void 0)return;const r=this._listeners[e];if(r!==void 0){const s=r.indexOf(n);s!==-1&&r.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const i=this._listeners[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,e);e.target=null}}}const qt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let $p=1234567;const zo=Math.PI/180,la=180/Math.PI;function no(){const t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(qt[t&255]+qt[t>>8&255]+qt[t>>16&255]+qt[t>>24&255]+"-"+qt[e&255]+qt[e>>8&255]+"-"+qt[e>>16&15|64]+qt[e>>24&255]+"-"+qt[n&63|128]+qt[n>>8&255]+"-"+qt[n>>16&255]+qt[n>>24&255]+qt[i&255]+qt[i>>8&255]+qt[i>>16&255]+qt[i>>24&255]).toLowerCase()}function Qt(t,e,n){return Math.max(e,Math.min(n,t))}function gf(t,e){return(t%e+e)%e}function _M(t,e,n,i,r){return i+(t-e)*(r-i)/(n-e)}function yM(t,e,n){return t!==e?(n-t)/(e-t):0}function Ho(t,e,n){return(1-n)*t+n*e}function MM(t,e,n,i){return Ho(t,e,1-Math.exp(-n*i))}function SM(t,e=1){return e-Math.abs(gf(t,e*2)-e)}function wM(t,e,n){return t<=e?0:t>=n?1:(t=(t-e)/(n-e),t*t*(3-2*t))}function EM(t,e,n){return t<=e?0:t>=n?1:(t=(t-e)/(n-e),t*t*t*(t*(t*6-15)+10))}function TM(t,e){return t+Math.floor(Math.random()*(e-t+1))}function AM(t,e){return t+Math.random()*(e-t)}function bM(t){return t*(.5-Math.random())}function CM(t){t!==void 0&&($p=t);let e=$p+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function PM(t){return t*zo}function RM(t){return t*la}function DM(t){return(t&t-1)===0&&t!==0}function NM(t){return Math.pow(2,Math.ceil(Math.log(t)/Math.LN2))}function LM(t){return Math.pow(2,Math.floor(Math.log(t)/Math.LN2))}function IM(t,e,n,i,r){const s=Math.cos,o=Math.sin,a=s(n/2),l=o(n/2),c=s((e+i)/2),d=o((e+i)/2),h=s((e-i)/2),f=o((e-i)/2),p=s((i-e)/2),v=o((i-e)/2);switch(r){case"XYX":t.set(a*d,l*h,l*f,a*c);break;case"YZY":t.set(l*f,a*d,l*h,a*c);break;case"ZXZ":t.set(l*h,l*f,a*d,a*c);break;case"XZX":t.set(a*d,l*v,l*p,a*c);break;case"YXY":t.set(l*p,a*d,l*v,a*c);break;case"ZYZ":t.set(l*v,l*p,a*d,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function ps(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return t/4294967295;case Uint16Array:return t/65535;case Uint8Array:return t/255;case Int32Array:return Math.max(t/2147483647,-1);case Int16Array:return Math.max(t/32767,-1);case Int8Array:return Math.max(t/127,-1);default:throw new Error("Invalid component type.")}}function nn(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return Math.round(t*4294967295);case Uint16Array:return Math.round(t*65535);case Uint8Array:return Math.round(t*255);case Int32Array:return Math.round(t*2147483647);case Int16Array:return Math.round(t*32767);case Int8Array:return Math.round(t*127);default:throw new Error("Invalid component type.")}}const Pt={DEG2RAD:zo,RAD2DEG:la,generateUUID:no,clamp:Qt,euclideanModulo:gf,mapLinear:_M,inverseLerp:yM,lerp:Ho,damp:MM,pingpong:SM,smoothstep:wM,smootherstep:EM,randInt:TM,randFloat:AM,randFloatSpread:bM,seededRandom:CM,degToRad:PM,radToDeg:RM,isPowerOfTwo:DM,ceilPowerOfTwo:NM,floorPowerOfTwo:LM,setQuaternionFromProperEuler:IM,normalize:nn,denormalize:ps};class He{constructor(e=0,n=0){He.prototype.isVector2=!0,this.x=e,this.y=n}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,n){return this.x=e,this.y=n,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const n=this.x,i=this.y,r=e.elements;return this.x=r[0]*n+r[3]*i+r[6],this.y=r[1]*n+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(Qt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y;return n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this}rotateAround(e,n){const i=Math.cos(n),r=Math.sin(n),s=this.x-e.x,o=this.y-e.y;return this.x=s*i-o*r+e.x,this.y=s*r+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ke{constructor(e,n,i,r,s,o,a,l,c){ke.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,o,a,l,c)}set(e,n,i,r,s,o,a,l,c){const d=this.elements;return d[0]=e,d[1]=r,d[2]=a,d[3]=n,d[4]=s,d[5]=l,d[6]=i,d[7]=o,d[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],this}extractBasis(e,n,i){return e.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const n=e.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,o=i[0],a=i[3],l=i[6],c=i[1],d=i[4],h=i[7],f=i[2],p=i[5],v=i[8],y=r[0],m=r[3],u=r[6],g=r[1],x=r[4],_=r[7],P=r[2],T=r[5],A=r[8];return s[0]=o*y+a*g+l*P,s[3]=o*m+a*x+l*T,s[6]=o*u+a*_+l*A,s[1]=c*y+d*g+h*P,s[4]=c*m+d*x+h*T,s[7]=c*u+d*_+h*A,s[2]=f*y+p*g+v*P,s[5]=f*m+p*x+v*T,s[8]=f*u+p*_+v*A,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[3]*=e,n[6]*=e,n[1]*=e,n[4]*=e,n[7]*=e,n[2]*=e,n[5]*=e,n[8]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],d=e[8];return n*o*d-n*a*c-i*s*d+i*a*l+r*s*c-r*o*l}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],d=e[8],h=d*o-a*c,f=a*l-d*s,p=c*s-o*l,v=n*h+i*f+r*p;if(v===0)return this.set(0,0,0,0,0,0,0,0,0);const y=1/v;return e[0]=h*y,e[1]=(r*c-d*i)*y,e[2]=(a*i-r*o)*y,e[3]=f*y,e[4]=(d*n-r*l)*y,e[5]=(r*s-a*n)*y,e[6]=p*y,e[7]=(i*l-c*n)*y,e[8]=(o*n-i*s)*y,this}transpose(){let e;const n=this.elements;return e=n[1],n[1]=n[3],n[3]=e,e=n[2],n[2]=n[6],n[6]=e,e=n[5],n[5]=n[7],n[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const n=this.elements;return e[0]=n[0],e[1]=n[3],e[2]=n[6],e[3]=n[1],e[4]=n[4],e[5]=n[7],e[6]=n[2],e[7]=n[5],e[8]=n[8],this}setUvTransform(e,n,i,r,s,o,a){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*o+c*a)+o+e,-r*c,r*l,-r*(-c*o+l*a)+a+n,0,0,1),this}scale(e,n){return this.premultiply($c.makeScale(e,n)),this}rotate(e){return this.premultiply($c.makeRotation(-e)),this}translate(e,n){return this.premultiply($c.makeTranslation(e,n)),this}makeTranslation(e,n){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,n,0,0,1),this}makeRotation(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,i,n,0,0,0,1),this}makeScale(e,n){return this.set(e,0,0,0,n,0,0,0,1),this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<9;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<9;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const $c=new ke;function Ov(t){for(let e=t.length-1;e>=0;--e)if(t[e]>=65535)return!0;return!1}function ca(t){return document.createElementNS("http://www.w3.org/1999/xhtml",t)}function UM(){const t=ca("canvas");return t.style.display="block",t}const Zp={};function Co(t){t in Zp||(Zp[t]=!0,console.warn(t))}function OM(t,e,n){return new Promise(function(i,r){function s(){switch(t.clientWaitSync(e,t.SYNC_FLUSH_COMMANDS_BIT,0)){case t.WAIT_FAILED:r();break;case t.TIMEOUT_EXPIRED:setTimeout(s,n);break;default:i()}}setTimeout(s,n)})}function FM(t){const e=t.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function kM(t){const e=t.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const qe={enabled:!0,workingColorSpace:eo,spaces:{},convert:function(t,e,n){return this.enabled===!1||e===n||!e||!n||(this.spaces[e].transfer===ot&&(t.r=Ti(t.r),t.g=Ti(t.g),t.b=Ti(t.b)),this.spaces[e].primaries!==this.spaces[n].primaries&&(t.applyMatrix3(this.spaces[e].toXYZ),t.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===ot&&(t.r=Os(t.r),t.g=Os(t.g),t.b=Os(t.b))),t},fromWorkingColorSpace:function(t,e){return this.convert(t,this.workingColorSpace,e)},toWorkingColorSpace:function(t,e){return this.convert(t,e,this.workingColorSpace)},getPrimaries:function(t){return this.spaces[t].primaries},getTransfer:function(t){return t===In?_c:this.spaces[t].transfer},getLuminanceCoefficients:function(t,e=this.workingColorSpace){return t.fromArray(this.spaces[e].luminanceCoefficients)},define:function(t){Object.assign(this.spaces,t)},_getMatrix:function(t,e,n){return t.copy(this.spaces[e].toXYZ).multiply(this.spaces[n].fromXYZ)},_getDrawingBufferColorSpace:function(t){return this.spaces[t].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(t=this.workingColorSpace){return this.spaces[t].workingColorSpaceConfig.unpackColorSpace}};function Ti(t){return t<.04045?t*.0773993808:Math.pow(t*.9478672986+.0521327014,2.4)}function Os(t){return t<.0031308?t*12.92:1.055*Math.pow(t,.41666)-.055}const Qp=[.64,.33,.3,.6,.15,.06],Jp=[.2126,.7152,.0722],em=[.3127,.329],tm=new ke().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),nm=new ke().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);qe.define({[eo]:{primaries:Qp,whitePoint:em,transfer:_c,toXYZ:tm,fromXYZ:nm,luminanceCoefficients:Jp,workingColorSpaceConfig:{unpackColorSpace:Vt},outputColorSpaceConfig:{drawingBufferColorSpace:Vt}},[Vt]:{primaries:Qp,whitePoint:em,transfer:ot,toXYZ:tm,fromXYZ:nm,luminanceCoefficients:Jp,outputColorSpaceConfig:{drawingBufferColorSpace:Vt}}});let es;class BM{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{es===void 0&&(es=ca("canvas")),es.width=e.width,es.height=e.height;const i=es.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=es}return n.width>2048||n.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),n.toDataURL("image/jpeg",.6)):n.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const n=ca("canvas");n.width=e.width,n.height=e.height;const i=n.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=Ti(s[o]/255)*255;return i.putImageData(r,0,0),n}else if(e.data){const n=e.data.slice(0);for(let i=0;i<n.length;i++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[i]=Math.floor(Ti(n[i]/255)*255):n[i]=Ti(n[i]);return{data:n,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let zM=0;class Fv{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:zM++}),this.uuid=no(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(Zc(r[o].image)):s.push(Zc(r[o]))}else s=Zc(r);i.url=s}return n||(e.images[this.uuid]=i),i}}function Zc(t){return typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap?BM.getDataURL(t):t.data?{data:Array.from(t.data),width:t.width,height:t.height,type:t.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let HM=0;class zt extends to{constructor(e=zt.DEFAULT_IMAGE,n=zt.DEFAULT_MAPPING,i=Qe,r=Qe,s=fn,o=$n,a=Zn,l=Ri,c=zt.DEFAULT_ANISOTROPY,d=In){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:HM++}),this.uuid=no(),this.name="",this.source=new Fv(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new He(0,0),this.repeat=new He(1,1),this.center=new He(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ke,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),n||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Ev)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Mt:e.x=e.x-Math.floor(e.x);break;case Qe:e.x=e.x<0?0:1;break;case Id:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Mt:e.y=e.y-Math.floor(e.y);break;case Qe:e.y=e.y<0?0:1;break;case Id:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}zt.DEFAULT_IMAGE=null;zt.DEFAULT_MAPPING=Ev;zt.DEFAULT_ANISOTROPY=1;class at{constructor(e=0,n=0,i=0,r=1){at.prototype.isVector4=!0,this.x=e,this.y=n,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,n,i,r){return this.x=e,this.y=n,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this.w=e.w+n.w,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this.w+=e.w*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this.w=e.w-n.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*n+o[4]*i+o[8]*r+o[12]*s,this.y=o[1]*n+o[5]*i+o[9]*r+o[13]*s,this.z=o[2]*n+o[6]*i+o[10]*r+o[14]*s,this.w=o[3]*n+o[7]*i+o[11]*r+o[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const n=Math.sqrt(1-e.w*e.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/n,this.y=e.y/n,this.z=e.z/n),this}setAxisAngleFromRotationMatrix(e){let n,i,r,s;const l=e.elements,c=l[0],d=l[4],h=l[8],f=l[1],p=l[5],v=l[9],y=l[2],m=l[6],u=l[10];if(Math.abs(d-f)<.01&&Math.abs(h-y)<.01&&Math.abs(v-m)<.01){if(Math.abs(d+f)<.1&&Math.abs(h+y)<.1&&Math.abs(v+m)<.1&&Math.abs(c+p+u-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;const x=(c+1)/2,_=(p+1)/2,P=(u+1)/2,T=(d+f)/4,A=(h+y)/4,b=(v+m)/4;return x>_&&x>P?x<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(x),r=T/i,s=A/i):_>P?_<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(_),i=T/r,s=b/r):P<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(P),i=A/s,r=b/s),this.set(i,r,s,n),this}let g=Math.sqrt((m-v)*(m-v)+(h-y)*(h-y)+(f-d)*(f-d));return Math.abs(g)<.001&&(g=1),this.x=(m-v)/g,this.y=(h-y)/g,this.z=(f-d)/g,this.w=Math.acos((c+p+u-1)/2),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this.w=n[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this.z=Math.max(e.z,Math.min(n.z,this.z)),this.w=Math.max(e.w,Math.min(n.w,this.w)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this.z=Math.max(e,Math.min(n,this.z)),this.w=Math.max(e,Math.min(n,this.w)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this.w+=(e.w-this.w)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this.w=e.w+(n.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this.w=e[n+3],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e[n+3]=this.w,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this.w=e.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class VM extends to{constructor(e=1,n=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=n,this.depth=1,this.scissor=new at(0,0,e,n),this.scissorTest=!1,this.viewport=new at(0,0,e,n);const r={width:e,height:n,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:fn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new zt(r,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const o=i.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,n,i=1){if(this.width!==e||this.height!==n||this.depth!==i){this.width=e,this.height=n,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=n,this.textures[r].image.depth=i;this.dispose()}this.viewport.set(0,0,e,n),this.scissor.set(0,0,e,n)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,r=e.textures.length;i<r;i++)this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const n=Object.assign({},e.texture.image);return this.texture.source=new Fv(n),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Wr extends VM{constructor(e=1,n=1,i={}){super(e,n,i),this.isWebGLRenderTarget=!0}}class kv extends zt{constructor(e=null,n=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=An,this.minFilter=An,this.wrapR=Qe,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class GM extends zt{constructor(e=null,n=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=An,this.minFilter=An,this.wrapR=Qe,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class va{constructor(e=0,n=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=n,this._z=i,this._w=r}static slerpFlat(e,n,i,r,s,o,a){let l=i[r+0],c=i[r+1],d=i[r+2],h=i[r+3];const f=s[o+0],p=s[o+1],v=s[o+2],y=s[o+3];if(a===0){e[n+0]=l,e[n+1]=c,e[n+2]=d,e[n+3]=h;return}if(a===1){e[n+0]=f,e[n+1]=p,e[n+2]=v,e[n+3]=y;return}if(h!==y||l!==f||c!==p||d!==v){let m=1-a;const u=l*f+c*p+d*v+h*y,g=u>=0?1:-1,x=1-u*u;if(x>Number.EPSILON){const P=Math.sqrt(x),T=Math.atan2(P,u*g);m=Math.sin(m*T)/P,a=Math.sin(a*T)/P}const _=a*g;if(l=l*m+f*_,c=c*m+p*_,d=d*m+v*_,h=h*m+y*_,m===1-a){const P=1/Math.sqrt(l*l+c*c+d*d+h*h);l*=P,c*=P,d*=P,h*=P}}e[n]=l,e[n+1]=c,e[n+2]=d,e[n+3]=h}static multiplyQuaternionsFlat(e,n,i,r,s,o){const a=i[r],l=i[r+1],c=i[r+2],d=i[r+3],h=s[o],f=s[o+1],p=s[o+2],v=s[o+3];return e[n]=a*v+d*h+l*p-c*f,e[n+1]=l*v+d*f+c*h-a*p,e[n+2]=c*v+d*p+a*f-l*h,e[n+3]=d*v-a*h-l*f-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,n,i,r){return this._x=e,this._y=n,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,n=!0){const i=e._x,r=e._y,s=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(i/2),d=a(r/2),h=a(s/2),f=l(i/2),p=l(r/2),v=l(s/2);switch(o){case"XYZ":this._x=f*d*h+c*p*v,this._y=c*p*h-f*d*v,this._z=c*d*v+f*p*h,this._w=c*d*h-f*p*v;break;case"YXZ":this._x=f*d*h+c*p*v,this._y=c*p*h-f*d*v,this._z=c*d*v-f*p*h,this._w=c*d*h+f*p*v;break;case"ZXY":this._x=f*d*h-c*p*v,this._y=c*p*h+f*d*v,this._z=c*d*v+f*p*h,this._w=c*d*h-f*p*v;break;case"ZYX":this._x=f*d*h-c*p*v,this._y=c*p*h+f*d*v,this._z=c*d*v-f*p*h,this._w=c*d*h+f*p*v;break;case"YZX":this._x=f*d*h+c*p*v,this._y=c*p*h+f*d*v,this._z=c*d*v-f*p*h,this._w=c*d*h-f*p*v;break;case"XZY":this._x=f*d*h-c*p*v,this._y=c*p*h-f*d*v,this._z=c*d*v+f*p*h,this._w=c*d*h+f*p*v;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return n===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,n){const i=n/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const n=e.elements,i=n[0],r=n[4],s=n[8],o=n[1],a=n[5],l=n[9],c=n[2],d=n[6],h=n[10],f=i+a+h;if(f>0){const p=.5/Math.sqrt(f+1);this._w=.25/p,this._x=(d-l)*p,this._y=(s-c)*p,this._z=(o-r)*p}else if(i>a&&i>h){const p=2*Math.sqrt(1+i-a-h);this._w=(d-l)/p,this._x=.25*p,this._y=(r+o)/p,this._z=(s+c)/p}else if(a>h){const p=2*Math.sqrt(1+a-i-h);this._w=(s-c)/p,this._x=(r+o)/p,this._y=.25*p,this._z=(l+d)/p}else{const p=2*Math.sqrt(1+h-i-a);this._w=(o-r)/p,this._x=(s+c)/p,this._y=(l+d)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,n){let i=e.dot(n)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*n.z-e.z*n.y,this._y=e.z*n.x-e.x*n.z,this._z=e.x*n.y-e.y*n.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Qt(this.dot(e),-1,1)))}rotateTowards(e,n){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,n/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,n){const i=e._x,r=e._y,s=e._z,o=e._w,a=n._x,l=n._y,c=n._z,d=n._w;return this._x=i*d+o*a+r*c-s*l,this._y=r*d+o*l+s*a-i*c,this._z=s*d+o*c+i*l-r*a,this._w=o*d-i*a-r*l-s*c,this._onChangeCallback(),this}slerp(e,n){if(n===0)return this;if(n===1)return this.copy(e);const i=this._x,r=this._y,s=this._z,o=this._w;let a=o*e._w+i*e._x+r*e._y+s*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=i,this._y=r,this._z=s,this;const l=1-a*a;if(l<=Number.EPSILON){const p=1-n;return this._w=p*o+n*this._w,this._x=p*i+n*this._x,this._y=p*r+n*this._y,this._z=p*s+n*this._z,this.normalize(),this}const c=Math.sqrt(l),d=Math.atan2(c,a),h=Math.sin((1-n)*d)/c,f=Math.sin(n*d)/c;return this._w=o*h+this._w*f,this._x=i*h+this._x*f,this._y=r*h+this._y*f,this._z=s*h+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,n,i){return this.copy(e).slerp(n,i)}random(){const e=2*Math.PI*Math.random(),n=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(n),s*Math.cos(n))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,n=0){return this._x=e[n],this._y=e[n+1],this._z=e[n+2],this._w=e[n+3],this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._w,e}fromBufferAttribute(e,n){return this._x=e.getX(n),this._y=e.getY(n),this._z=e.getZ(n),this._w=e.getW(n),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class R{constructor(e=0,n=0,i=0){R.prototype.isVector3=!0,this.x=e,this.y=n,this.z=i}set(e,n,i){return i===void 0&&(i=this.z),this.x=e,this.y=n,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,n){return this.x=e.x*n.x,this.y=e.y*n.y,this.z=e.z*n.z,this}applyEuler(e){return this.applyQuaternion(im.setFromEuler(e))}applyAxisAngle(e,n){return this.applyQuaternion(im.setFromAxisAngle(e,n))}applyMatrix3(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[3]*i+s[6]*r,this.y=s[1]*n+s[4]*i+s[7]*r,this.z=s[2]*n+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=e.elements,o=1/(s[3]*n+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*n+s[4]*i+s[8]*r+s[12])*o,this.y=(s[1]*n+s[5]*i+s[9]*r+s[13])*o,this.z=(s[2]*n+s[6]*i+s[10]*r+s[14])*o,this}applyQuaternion(e){const n=this.x,i=this.y,r=this.z,s=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*r-a*i),d=2*(a*n-s*r),h=2*(s*i-o*n);return this.x=n+l*c+o*h-a*d,this.y=i+l*d+a*c-s*h,this.z=r+l*h+s*d-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[4]*i+s[8]*r,this.y=s[1]*n+s[5]*i+s[9]*r,this.z=s[2]*n+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this.z=Math.max(e.z,Math.min(n.z,this.z)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this.z=Math.max(e,Math.min(n,this.z)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,n){const i=e.x,r=e.y,s=e.z,o=n.x,a=n.y,l=n.z;return this.x=r*l-s*a,this.y=s*o-i*l,this.z=i*a-r*o,this}projectOnVector(e){const n=e.lengthSq();if(n===0)return this.set(0,0,0);const i=e.dot(this)/n;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Qc.copy(this).projectOnVector(e),this.sub(Qc)}reflect(e){return this.sub(Qc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(Qt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return n*n+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,n,i){const r=Math.sin(n)*e;return this.x=r*Math.sin(i),this.y=Math.cos(n)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,n,i){return this.x=e*Math.sin(n),this.y=i,this.z=e*Math.cos(n),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(e){const n=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=n,this.y=i,this.z=r,this}setFromMatrixColumn(e,n){return this.fromArray(e.elements,n*4)}setFromMatrix3Column(e,n){return this.fromArray(e.elements,n*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,n=Math.random()*2-1,i=Math.sqrt(1-n*n);return this.x=i*Math.cos(e),this.y=n,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Qc=new R,im=new va;class Yr{constructor(e=new R(1/0,1/0,1/0),n=new R(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=n}set(e,n){return this.min.copy(e),this.max.copy(n),this}setFromArray(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n+=3)this.expandByPoint(Vn.fromArray(e,n));return this}setFromBufferAttribute(e){this.makeEmpty();for(let n=0,i=e.count;n<i;n++)this.expandByPoint(Vn.fromBufferAttribute(e,n));return this}setFromPoints(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n++)this.expandByPoint(e[n]);return this}setFromCenterAndSize(e,n){const i=Vn.copy(n).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,n=!1){return this.makeEmpty(),this.expandByObject(e,n)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,n=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(n===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,Vn):Vn.fromBufferAttribute(s,o),Vn.applyMatrix4(e.matrixWorld),this.expandByPoint(Vn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Ba.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Ba.copy(i.boundingBox)),Ba.applyMatrix4(e.matrixWorld),this.union(Ba)}const r=e.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],n);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,n){return n.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Vn),Vn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let n,i;return e.normal.x>0?(n=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(n=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(n+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(n+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(n+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(n+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),n<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(mo),za.subVectors(this.max,mo),ts.subVectors(e.a,mo),ns.subVectors(e.b,mo),is.subVectors(e.c,mo),Oi.subVectors(ns,ts),Fi.subVectors(is,ns),gr.subVectors(ts,is);let n=[0,-Oi.z,Oi.y,0,-Fi.z,Fi.y,0,-gr.z,gr.y,Oi.z,0,-Oi.x,Fi.z,0,-Fi.x,gr.z,0,-gr.x,-Oi.y,Oi.x,0,-Fi.y,Fi.x,0,-gr.y,gr.x,0];return!Jc(n,ts,ns,is,za)||(n=[1,0,0,0,1,0,0,0,1],!Jc(n,ts,ns,is,za))?!1:(Ha.crossVectors(Oi,Fi),n=[Ha.x,Ha.y,Ha.z],Jc(n,ts,ns,is,za))}clampPoint(e,n){return n.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Vn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Vn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(fi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),fi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),fi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),fi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),fi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),fi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),fi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),fi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(fi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const fi=[new R,new R,new R,new R,new R,new R,new R,new R],Vn=new R,Ba=new Yr,ts=new R,ns=new R,is=new R,Oi=new R,Fi=new R,gr=new R,mo=new R,za=new R,Ha=new R,vr=new R;function Jc(t,e,n,i,r){for(let s=0,o=t.length-3;s<=o;s+=3){vr.fromArray(t,s);const a=r.x*Math.abs(vr.x)+r.y*Math.abs(vr.y)+r.z*Math.abs(vr.z),l=e.dot(vr),c=n.dot(vr),d=i.dot(vr);if(Math.max(-Math.max(l,c,d),Math.min(l,c,d))>a)return!1}return!0}const WM=new Yr,go=new R,eu=new R;class qr{constructor(e=new R,n=-1){this.isSphere=!0,this.center=e,this.radius=n}set(e,n){return this.center.copy(e),this.radius=n,this}setFromPoints(e,n){const i=this.center;n!==void 0?i.copy(n):WM.setFromPoints(e).getCenter(i);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const n=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=n*n}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,n){const i=this.center.distanceToSquared(e);return n.copy(e),i>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;go.subVectors(e,this.center);const n=go.lengthSq();if(n>this.radius*this.radius){const i=Math.sqrt(n),r=(i-this.radius)*.5;this.center.addScaledVector(go,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(eu.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(go.copy(e.center).add(eu)),this.expandByPoint(go.copy(e.center).sub(eu))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const pi=new R,tu=new R,Va=new R,ki=new R,nu=new R,Ga=new R,iu=new R;class yc{constructor(e=new R,n=new R(0,0,-1)){this.origin=e,this.direction=n}set(e,n){return this.origin.copy(e),this.direction.copy(n),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,n){return n.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,pi)),this}closestPointToPoint(e,n){n.subVectors(e,this.origin);const i=n.dot(this.direction);return i<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const n=pi.subVectors(e,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(e):(pi.copy(this.origin).addScaledVector(this.direction,n),pi.distanceToSquared(e))}distanceSqToSegment(e,n,i,r){tu.copy(e).add(n).multiplyScalar(.5),Va.copy(n).sub(e).normalize(),ki.copy(this.origin).sub(tu);const s=e.distanceTo(n)*.5,o=-this.direction.dot(Va),a=ki.dot(this.direction),l=-ki.dot(Va),c=ki.lengthSq(),d=Math.abs(1-o*o);let h,f,p,v;if(d>0)if(h=o*l-a,f=o*a-l,v=s*d,h>=0)if(f>=-v)if(f<=v){const y=1/d;h*=y,f*=y,p=h*(h+o*f+2*a)+f*(o*h+f+2*l)+c}else f=s,h=Math.max(0,-(o*f+a)),p=-h*h+f*(f+2*l)+c;else f=-s,h=Math.max(0,-(o*f+a)),p=-h*h+f*(f+2*l)+c;else f<=-v?(h=Math.max(0,-(-o*s+a)),f=h>0?-s:Math.min(Math.max(-s,-l),s),p=-h*h+f*(f+2*l)+c):f<=v?(h=0,f=Math.min(Math.max(-s,-l),s),p=f*(f+2*l)+c):(h=Math.max(0,-(o*s+a)),f=h>0?s:Math.min(Math.max(-s,-l),s),p=-h*h+f*(f+2*l)+c);else f=o>0?-s:s,h=Math.max(0,-(o*f+a)),p=-h*h+f*(f+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,h),r&&r.copy(tu).addScaledVector(Va,f),p}intersectSphere(e,n){pi.subVectors(e.center,this.origin);const i=pi.dot(this.direction),r=pi.dot(pi)-i*i,s=e.radius*e.radius;if(r>s)return null;const o=Math.sqrt(s-r),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,n):this.at(a,n)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const n=e.normal.dot(this.direction);if(n===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/n;return i>=0?i:null}intersectPlane(e,n){const i=this.distanceToPlane(e);return i===null?null:this.at(i,n)}intersectsPlane(e){const n=e.distanceToPoint(this.origin);return n===0||e.normal.dot(this.direction)*n<0}intersectBox(e,n){let i,r,s,o,a,l;const c=1/this.direction.x,d=1/this.direction.y,h=1/this.direction.z,f=this.origin;return c>=0?(i=(e.min.x-f.x)*c,r=(e.max.x-f.x)*c):(i=(e.max.x-f.x)*c,r=(e.min.x-f.x)*c),d>=0?(s=(e.min.y-f.y)*d,o=(e.max.y-f.y)*d):(s=(e.max.y-f.y)*d,o=(e.min.y-f.y)*d),i>o||s>r||((s>i||isNaN(i))&&(i=s),(o<r||isNaN(r))&&(r=o),h>=0?(a=(e.min.z-f.z)*h,l=(e.max.z-f.z)*h):(a=(e.max.z-f.z)*h,l=(e.min.z-f.z)*h),i>l||a>r)||((a>i||i!==i)&&(i=a),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,n)}intersectsBox(e){return this.intersectBox(e,pi)!==null}intersectTriangle(e,n,i,r,s){nu.subVectors(n,e),Ga.subVectors(i,e),iu.crossVectors(nu,Ga);let o=this.direction.dot(iu),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;ki.subVectors(this.origin,e);const l=a*this.direction.dot(Ga.crossVectors(ki,Ga));if(l<0)return null;const c=a*this.direction.dot(nu.cross(ki));if(c<0||l+c>o)return null;const d=-a*ki.dot(iu);return d<0?null:this.at(d/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class rt{constructor(e,n,i,r,s,o,a,l,c,d,h,f,p,v,y,m){rt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,o,a,l,c,d,h,f,p,v,y,m)}set(e,n,i,r,s,o,a,l,c,d,h,f,p,v,y,m){const u=this.elements;return u[0]=e,u[4]=n,u[8]=i,u[12]=r,u[1]=s,u[5]=o,u[9]=a,u[13]=l,u[2]=c,u[6]=d,u[10]=h,u[14]=f,u[3]=p,u[7]=v,u[11]=y,u[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new rt().fromArray(this.elements)}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],n[9]=i[9],n[10]=i[10],n[11]=i[11],n[12]=i[12],n[13]=i[13],n[14]=i[14],n[15]=i[15],this}copyPosition(e){const n=this.elements,i=e.elements;return n[12]=i[12],n[13]=i[13],n[14]=i[14],this}setFromMatrix3(e){const n=e.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(e,n,i){return e.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,n,i){return this.set(e.x,n.x,i.x,0,e.y,n.y,i.y,0,e.z,n.z,i.z,0,0,0,0,1),this}extractRotation(e){const n=this.elements,i=e.elements,r=1/rs.setFromMatrixColumn(e,0).length(),s=1/rs.setFromMatrixColumn(e,1).length(),o=1/rs.setFromMatrixColumn(e,2).length();return n[0]=i[0]*r,n[1]=i[1]*r,n[2]=i[2]*r,n[3]=0,n[4]=i[4]*s,n[5]=i[5]*s,n[6]=i[6]*s,n[7]=0,n[8]=i[8]*o,n[9]=i[9]*o,n[10]=i[10]*o,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(e){const n=this.elements,i=e.x,r=e.y,s=e.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(r),c=Math.sin(r),d=Math.cos(s),h=Math.sin(s);if(e.order==="XYZ"){const f=o*d,p=o*h,v=a*d,y=a*h;n[0]=l*d,n[4]=-l*h,n[8]=c,n[1]=p+v*c,n[5]=f-y*c,n[9]=-a*l,n[2]=y-f*c,n[6]=v+p*c,n[10]=o*l}else if(e.order==="YXZ"){const f=l*d,p=l*h,v=c*d,y=c*h;n[0]=f+y*a,n[4]=v*a-p,n[8]=o*c,n[1]=o*h,n[5]=o*d,n[9]=-a,n[2]=p*a-v,n[6]=y+f*a,n[10]=o*l}else if(e.order==="ZXY"){const f=l*d,p=l*h,v=c*d,y=c*h;n[0]=f-y*a,n[4]=-o*h,n[8]=v+p*a,n[1]=p+v*a,n[5]=o*d,n[9]=y-f*a,n[2]=-o*c,n[6]=a,n[10]=o*l}else if(e.order==="ZYX"){const f=o*d,p=o*h,v=a*d,y=a*h;n[0]=l*d,n[4]=v*c-p,n[8]=f*c+y,n[1]=l*h,n[5]=y*c+f,n[9]=p*c-v,n[2]=-c,n[6]=a*l,n[10]=o*l}else if(e.order==="YZX"){const f=o*l,p=o*c,v=a*l,y=a*c;n[0]=l*d,n[4]=y-f*h,n[8]=v*h+p,n[1]=h,n[5]=o*d,n[9]=-a*d,n[2]=-c*d,n[6]=p*h+v,n[10]=f-y*h}else if(e.order==="XZY"){const f=o*l,p=o*c,v=a*l,y=a*c;n[0]=l*d,n[4]=-h,n[8]=c*d,n[1]=f*h+y,n[5]=o*d,n[9]=p*h-v,n[2]=v*h-p,n[6]=a*d,n[10]=y*h+f}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(e){return this.compose(jM,e,XM)}lookAt(e,n,i){const r=this.elements;return xn.subVectors(e,n),xn.lengthSq()===0&&(xn.z=1),xn.normalize(),Bi.crossVectors(i,xn),Bi.lengthSq()===0&&(Math.abs(i.z)===1?xn.x+=1e-4:xn.z+=1e-4,xn.normalize(),Bi.crossVectors(i,xn)),Bi.normalize(),Wa.crossVectors(xn,Bi),r[0]=Bi.x,r[4]=Wa.x,r[8]=xn.x,r[1]=Bi.y,r[5]=Wa.y,r[9]=xn.y,r[2]=Bi.z,r[6]=Wa.z,r[10]=xn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,o=i[0],a=i[4],l=i[8],c=i[12],d=i[1],h=i[5],f=i[9],p=i[13],v=i[2],y=i[6],m=i[10],u=i[14],g=i[3],x=i[7],_=i[11],P=i[15],T=r[0],A=r[4],b=r[8],w=r[12],M=r[1],D=r[5],V=r[9],z=r[13],X=r[2],Z=r[6],Y=r[10],te=r[14],N=r[3],$=r[7],Q=r[11],oe=r[15];return s[0]=o*T+a*M+l*X+c*N,s[4]=o*A+a*D+l*Z+c*$,s[8]=o*b+a*V+l*Y+c*Q,s[12]=o*w+a*z+l*te+c*oe,s[1]=d*T+h*M+f*X+p*N,s[5]=d*A+h*D+f*Z+p*$,s[9]=d*b+h*V+f*Y+p*Q,s[13]=d*w+h*z+f*te+p*oe,s[2]=v*T+y*M+m*X+u*N,s[6]=v*A+y*D+m*Z+u*$,s[10]=v*b+y*V+m*Y+u*Q,s[14]=v*w+y*z+m*te+u*oe,s[3]=g*T+x*M+_*X+P*N,s[7]=g*A+x*D+_*Z+P*$,s[11]=g*b+x*V+_*Y+P*Q,s[15]=g*w+x*z+_*te+P*oe,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[4]*=e,n[8]*=e,n[12]*=e,n[1]*=e,n[5]*=e,n[9]*=e,n[13]*=e,n[2]*=e,n[6]*=e,n[10]*=e,n[14]*=e,n[3]*=e,n[7]*=e,n[11]*=e,n[15]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[4],r=e[8],s=e[12],o=e[1],a=e[5],l=e[9],c=e[13],d=e[2],h=e[6],f=e[10],p=e[14],v=e[3],y=e[7],m=e[11],u=e[15];return v*(+s*l*h-r*c*h-s*a*f+i*c*f+r*a*p-i*l*p)+y*(+n*l*p-n*c*f+s*o*f-r*o*p+r*c*d-s*l*d)+m*(+n*c*h-n*a*p-s*o*h+i*o*p+s*a*d-i*c*d)+u*(-r*a*d-n*l*h+n*a*f+r*o*h-i*o*f+i*l*d)}transpose(){const e=this.elements;let n;return n=e[1],e[1]=e[4],e[4]=n,n=e[2],e[2]=e[8],e[8]=n,n=e[6],e[6]=e[9],e[9]=n,n=e[3],e[3]=e[12],e[12]=n,n=e[7],e[7]=e[13],e[13]=n,n=e[11],e[11]=e[14],e[14]=n,this}setPosition(e,n,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=n,r[14]=i),this}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],d=e[8],h=e[9],f=e[10],p=e[11],v=e[12],y=e[13],m=e[14],u=e[15],g=h*m*c-y*f*c+y*l*p-a*m*p-h*l*u+a*f*u,x=v*f*c-d*m*c-v*l*p+o*m*p+d*l*u-o*f*u,_=d*y*c-v*h*c+v*a*p-o*y*p-d*a*u+o*h*u,P=v*h*l-d*y*l-v*a*f+o*y*f+d*a*m-o*h*m,T=n*g+i*x+r*_+s*P;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/T;return e[0]=g*A,e[1]=(y*f*s-h*m*s-y*r*p+i*m*p+h*r*u-i*f*u)*A,e[2]=(a*m*s-y*l*s+y*r*c-i*m*c-a*r*u+i*l*u)*A,e[3]=(h*l*s-a*f*s-h*r*c+i*f*c+a*r*p-i*l*p)*A,e[4]=x*A,e[5]=(d*m*s-v*f*s+v*r*p-n*m*p-d*r*u+n*f*u)*A,e[6]=(v*l*s-o*m*s-v*r*c+n*m*c+o*r*u-n*l*u)*A,e[7]=(o*f*s-d*l*s+d*r*c-n*f*c-o*r*p+n*l*p)*A,e[8]=_*A,e[9]=(v*h*s-d*y*s-v*i*p+n*y*p+d*i*u-n*h*u)*A,e[10]=(o*y*s-v*a*s+v*i*c-n*y*c-o*i*u+n*a*u)*A,e[11]=(d*a*s-o*h*s-d*i*c+n*h*c+o*i*p-n*a*p)*A,e[12]=P*A,e[13]=(d*y*r-v*h*r+v*i*f-n*y*f-d*i*m+n*h*m)*A,e[14]=(v*a*r-o*y*r-v*i*l+n*y*l+o*i*m-n*a*m)*A,e[15]=(o*h*r-d*a*r+d*i*l-n*h*l-o*i*f+n*a*f)*A,this}scale(e){const n=this.elements,i=e.x,r=e.y,s=e.z;return n[0]*=i,n[4]*=r,n[8]*=s,n[1]*=i,n[5]*=r,n[9]*=s,n[2]*=i,n[6]*=r,n[10]*=s,n[3]*=i,n[7]*=r,n[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,n=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(n,i,r))}makeTranslation(e,n,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,n,0,0,1,i,0,0,0,1),this}makeRotationX(e){const n=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,n,-i,0,0,i,n,0,0,0,0,1),this}makeRotationY(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,0,i,0,0,1,0,0,-i,0,n,0,0,0,0,1),this}makeRotationZ(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,0,i,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,n){const i=Math.cos(n),r=Math.sin(n),s=1-i,o=e.x,a=e.y,l=e.z,c=s*o,d=s*a;return this.set(c*o+i,c*a-r*l,c*l+r*a,0,c*a+r*l,d*a+i,d*l-r*o,0,c*l-r*a,d*l+r*o,s*l*l+i,0,0,0,0,1),this}makeScale(e,n,i){return this.set(e,0,0,0,0,n,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,n,i,r,s,o){return this.set(1,i,s,0,e,1,o,0,n,r,1,0,0,0,0,1),this}compose(e,n,i){const r=this.elements,s=n._x,o=n._y,a=n._z,l=n._w,c=s+s,d=o+o,h=a+a,f=s*c,p=s*d,v=s*h,y=o*d,m=o*h,u=a*h,g=l*c,x=l*d,_=l*h,P=i.x,T=i.y,A=i.z;return r[0]=(1-(y+u))*P,r[1]=(p+_)*P,r[2]=(v-x)*P,r[3]=0,r[4]=(p-_)*T,r[5]=(1-(f+u))*T,r[6]=(m+g)*T,r[7]=0,r[8]=(v+x)*A,r[9]=(m-g)*A,r[10]=(1-(f+y))*A,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,n,i){const r=this.elements;let s=rs.set(r[0],r[1],r[2]).length();const o=rs.set(r[4],r[5],r[6]).length(),a=rs.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],Gn.copy(this);const c=1/s,d=1/o,h=1/a;return Gn.elements[0]*=c,Gn.elements[1]*=c,Gn.elements[2]*=c,Gn.elements[4]*=d,Gn.elements[5]*=d,Gn.elements[6]*=d,Gn.elements[8]*=h,Gn.elements[9]*=h,Gn.elements[10]*=h,n.setFromRotationMatrix(Gn),i.x=s,i.y=o,i.z=a,this}makePerspective(e,n,i,r,s,o,a=wi){const l=this.elements,c=2*s/(n-e),d=2*s/(i-r),h=(n+e)/(n-e),f=(i+r)/(i-r);let p,v;if(a===wi)p=-(o+s)/(o-s),v=-2*o*s/(o-s);else if(a===Ql)p=-o/(o-s),v=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=d,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=v,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,n,i,r,s,o,a=wi){const l=this.elements,c=1/(n-e),d=1/(i-r),h=1/(o-s),f=(n+e)*c,p=(i+r)*d;let v,y;if(a===wi)v=(o+s)*h,y=-2*h;else if(a===Ql)v=s*h,y=-1*h;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-f,l[1]=0,l[5]=2*d,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=y,l[14]=-v,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<16;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<16;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e[n+9]=i[9],e[n+10]=i[10],e[n+11]=i[11],e[n+12]=i[12],e[n+13]=i[13],e[n+14]=i[14],e[n+15]=i[15],e}}const rs=new R,Gn=new rt,jM=new R(0,0,0),XM=new R(1,1,1),Bi=new R,Wa=new R,xn=new R,rm=new rt,sm=new va;class ui{constructor(e=0,n=0,i=0,r=ui.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=n,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,n,i,r=this._order){return this._x=e,this._y=n,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,n=this._order,i=!0){const r=e.elements,s=r[0],o=r[4],a=r[8],l=r[1],c=r[5],d=r[9],h=r[2],f=r[6],p=r[10];switch(n){case"XYZ":this._y=Math.asin(Qt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-d,p),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Qt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,s),this._z=0);break;case"ZXY":this._x=Math.asin(Qt(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-h,p),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-Qt(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(f,p),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Qt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-d,c),this._y=Math.atan2(-h,s)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-Qt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-d,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,n,i){return rm.makeRotationFromQuaternion(e),this.setFromRotationMatrix(rm,n,i)}setFromVector3(e,n=this._order){return this.set(e.x,e.y,e.z,n)}reorder(e){return sm.setFromEuler(this),this.setFromQuaternion(sm,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ui.DEFAULT_ORDER="XYZ";class vf{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let KM=0;const om=new R,ss=new va,mi=new rt,ja=new R,vo=new R,YM=new R,qM=new va,am=new R(1,0,0),lm=new R(0,1,0),cm=new R(0,0,1),um={type:"added"},$M={type:"removed"},os={type:"childadded",child:null},ru={type:"childremoved",child:null};class Wt extends to{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:KM++}),this.uuid=no(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Wt.DEFAULT_UP.clone();const e=new R,n=new ui,i=new va,r=new R(1,1,1);function s(){i.setFromEuler(n,!1)}function o(){n.setFromQuaternion(i,void 0,!1)}n._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new rt},normalMatrix:{value:new ke}}),this.matrix=new rt,this.matrixWorld=new rt,this.matrixAutoUpdate=Wt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Wt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new vf,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,n){this.quaternion.setFromAxisAngle(e,n)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,n){return ss.setFromAxisAngle(e,n),this.quaternion.multiply(ss),this}rotateOnWorldAxis(e,n){return ss.setFromAxisAngle(e,n),this.quaternion.premultiply(ss),this}rotateX(e){return this.rotateOnAxis(am,e)}rotateY(e){return this.rotateOnAxis(lm,e)}rotateZ(e){return this.rotateOnAxis(cm,e)}translateOnAxis(e,n){return om.copy(e).applyQuaternion(this.quaternion),this.position.add(om.multiplyScalar(n)),this}translateX(e){return this.translateOnAxis(am,e)}translateY(e){return this.translateOnAxis(lm,e)}translateZ(e){return this.translateOnAxis(cm,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(mi.copy(this.matrixWorld).invert())}lookAt(e,n,i){e.isVector3?ja.copy(e):ja.set(e,n,i);const r=this.parent;this.updateWorldMatrix(!0,!1),vo.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?mi.lookAt(vo,ja,this.up):mi.lookAt(ja,vo,this.up),this.quaternion.setFromRotationMatrix(mi),r&&(mi.extractRotation(r.matrixWorld),ss.setFromRotationMatrix(mi),this.quaternion.premultiply(ss.invert()))}add(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(um),os.child=e,this.dispatchEvent(os),os.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const n=this.children.indexOf(e);return n!==-1&&(e.parent=null,this.children.splice(n,1),e.dispatchEvent($M),ru.child=e,this.dispatchEvent(ru),ru.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),mi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),mi.multiply(e.parent.matrixWorld)),e.applyMatrix4(mi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(um),os.child=e,this.dispatchEvent(os),os.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,n){if(this[e]===n)return this;for(let i=0,r=this.children.length;i<r;i++){const o=this.children[i].getObjectByProperty(e,n);if(o!==void 0)return o}}getObjectsByProperty(e,n,i=[]){this[e]===n&&i.push(this);const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(e,n,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(vo,e,YM),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(vo,qM,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const n=this.matrixWorld.elements;return e.set(n[8],n[9],n[10]).normalize()}raycast(){}traverse(e){e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverseVisible(e)}traverseAncestors(e){const n=this.parent;n!==null&&(e(n),n.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].updateMatrixWorld(e)}updateWorldMatrix(e,n){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),n===!0){const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const n=e===void 0||typeof e=="string",i={};n&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,d=l.length;c<d;c++){const h=l[c];s(e.shapes,h)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(e.materials,this.material[l]));r.material=a}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];r.animations.push(s(e.animations,l))}}if(n){const a=o(e.geometries),l=o(e.materials),c=o(e.textures),d=o(e.images),h=o(e.shapes),f=o(e.skeletons),p=o(e.animations),v=o(e.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),d.length>0&&(i.images=d),h.length>0&&(i.shapes=h),f.length>0&&(i.skeletons=f),p.length>0&&(i.animations=p),v.length>0&&(i.nodes=v)}return i.object=r,i;function o(a){const l=[];for(const c in a){const d=a[c];delete d.metadata,l.push(d)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,n=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),n===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}Wt.DEFAULT_UP=new R(0,1,0);Wt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Wt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Wn=new R,gi=new R,su=new R,vi=new R,as=new R,ls=new R,dm=new R,ou=new R,au=new R,lu=new R,cu=new at,uu=new at,du=new at;class Yn{constructor(e=new R,n=new R,i=new R){this.a=e,this.b=n,this.c=i}static getNormal(e,n,i,r){r.subVectors(i,n),Wn.subVectors(e,n),r.cross(Wn);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,n,i,r,s){Wn.subVectors(r,n),gi.subVectors(i,n),su.subVectors(e,n);const o=Wn.dot(Wn),a=Wn.dot(gi),l=Wn.dot(su),c=gi.dot(gi),d=gi.dot(su),h=o*c-a*a;if(h===0)return s.set(0,0,0),null;const f=1/h,p=(c*l-a*d)*f,v=(o*d-a*l)*f;return s.set(1-p-v,v,p)}static containsPoint(e,n,i,r){return this.getBarycoord(e,n,i,r,vi)===null?!1:vi.x>=0&&vi.y>=0&&vi.x+vi.y<=1}static getInterpolation(e,n,i,r,s,o,a,l){return this.getBarycoord(e,n,i,r,vi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,vi.x),l.addScaledVector(o,vi.y),l.addScaledVector(a,vi.z),l)}static getInterpolatedAttribute(e,n,i,r,s,o){return cu.setScalar(0),uu.setScalar(0),du.setScalar(0),cu.fromBufferAttribute(e,n),uu.fromBufferAttribute(e,i),du.fromBufferAttribute(e,r),o.setScalar(0),o.addScaledVector(cu,s.x),o.addScaledVector(uu,s.y),o.addScaledVector(du,s.z),o}static isFrontFacing(e,n,i,r){return Wn.subVectors(i,n),gi.subVectors(e,n),Wn.cross(gi).dot(r)<0}set(e,n,i){return this.a.copy(e),this.b.copy(n),this.c.copy(i),this}setFromPointsAndIndices(e,n,i,r){return this.a.copy(e[n]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,n,i,r){return this.a.fromBufferAttribute(e,n),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Wn.subVectors(this.c,this.b),gi.subVectors(this.a,this.b),Wn.cross(gi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Yn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,n){return Yn.getBarycoord(e,this.a,this.b,this.c,n)}getInterpolation(e,n,i,r,s){return Yn.getInterpolation(e,this.a,this.b,this.c,n,i,r,s)}containsPoint(e){return Yn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Yn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,n){const i=this.a,r=this.b,s=this.c;let o,a;as.subVectors(r,i),ls.subVectors(s,i),ou.subVectors(e,i);const l=as.dot(ou),c=ls.dot(ou);if(l<=0&&c<=0)return n.copy(i);au.subVectors(e,r);const d=as.dot(au),h=ls.dot(au);if(d>=0&&h<=d)return n.copy(r);const f=l*h-d*c;if(f<=0&&l>=0&&d<=0)return o=l/(l-d),n.copy(i).addScaledVector(as,o);lu.subVectors(e,s);const p=as.dot(lu),v=ls.dot(lu);if(v>=0&&p<=v)return n.copy(s);const y=p*c-l*v;if(y<=0&&c>=0&&v<=0)return a=c/(c-v),n.copy(i).addScaledVector(ls,a);const m=d*v-p*h;if(m<=0&&h-d>=0&&p-v>=0)return dm.subVectors(s,r),a=(h-d)/(h-d+(p-v)),n.copy(r).addScaledVector(dm,a);const u=1/(m+y+f);return o=y*u,a=f*u,n.copy(i).addScaledVector(as,o).addScaledVector(ls,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Bv={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},zi={h:0,s:0,l:0},Xa={h:0,s:0,l:0};function hu(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+(e-t)*6*n:n<1/2?e:n<2/3?t+(e-t)*6*(2/3-n):t}class me{constructor(e,n,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,n,i)}set(e,n,i){if(n===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,n,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,n=Vt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,qe.toWorkingColorSpace(this,n),this}setRGB(e,n,i,r=qe.workingColorSpace){return this.r=e,this.g=n,this.b=i,qe.toWorkingColorSpace(this,r),this}setHSL(e,n,i,r=qe.workingColorSpace){if(e=gf(e,1),n=Qt(n,0,1),i=Qt(i,0,1),n===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+n):i+n-i*n,o=2*i-s;this.r=hu(o,s,e+1/3),this.g=hu(o,s,e),this.b=hu(o,s,e-1/3)}return qe.toWorkingColorSpace(this,r),this}setStyle(e,n=Vt){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,n);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,n);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,n);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,n);if(o===6)return this.setHex(parseInt(s,16),n);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,n);return this}setColorName(e,n=Vt){const i=Bv[e.toLowerCase()];return i!==void 0?this.setHex(i,n):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ti(e.r),this.g=Ti(e.g),this.b=Ti(e.b),this}copyLinearToSRGB(e){return this.r=Os(e.r),this.g=Os(e.g),this.b=Os(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Vt){return qe.fromWorkingColorSpace($t.copy(this),e),Math.round(Qt($t.r*255,0,255))*65536+Math.round(Qt($t.g*255,0,255))*256+Math.round(Qt($t.b*255,0,255))}getHexString(e=Vt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,n=qe.workingColorSpace){qe.fromWorkingColorSpace($t.copy(this),n);const i=$t.r,r=$t.g,s=$t.b,o=Math.max(i,r,s),a=Math.min(i,r,s);let l,c;const d=(a+o)/2;if(a===o)l=0,c=0;else{const h=o-a;switch(c=d<=.5?h/(o+a):h/(2-o-a),o){case i:l=(r-s)/h+(r<s?6:0);break;case r:l=(s-i)/h+2;break;case s:l=(i-r)/h+4;break}l/=6}return e.h=l,e.s=c,e.l=d,e}getRGB(e,n=qe.workingColorSpace){return qe.fromWorkingColorSpace($t.copy(this),n),e.r=$t.r,e.g=$t.g,e.b=$t.b,e}getStyle(e=Vt){qe.fromWorkingColorSpace($t.copy(this),e);const n=$t.r,i=$t.g,r=$t.b;return e!==Vt?`color(${e} ${n.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,n,i){return this.getHSL(zi),this.setHSL(zi.h+e,zi.s+n,zi.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,n){return this.r=e.r+n.r,this.g=e.g+n.g,this.b=e.b+n.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,n){return this.r+=(e.r-this.r)*n,this.g+=(e.g-this.g)*n,this.b+=(e.b-this.b)*n,this}lerpColors(e,n,i){return this.r=e.r+(n.r-e.r)*i,this.g=e.g+(n.g-e.g)*i,this.b=e.b+(n.b-e.b)*i,this}lerpHSL(e,n){this.getHSL(zi),e.getHSL(Xa);const i=Ho(zi.h,Xa.h,n),r=Ho(zi.s,Xa.s,n),s=Ho(zi.l,Xa.l,n);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const n=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*n+s[3]*i+s[6]*r,this.g=s[1]*n+s[4]*i+s[7]*r,this.b=s[2]*n+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,n=0){return this.r=e[n],this.g=e[n+1],this.b=e[n+2],this}toArray(e=[],n=0){return e[n]=this.r,e[n+1]=this.g,e[n+2]=this.b,e}fromBufferAttribute(e,n){return this.r=e.getX(n),this.g=e.getY(n),this.b=e.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const $t=new me;me.NAMES=Bv;let ZM=0;class $r extends to{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:ZM++}),this.uuid=no(),this.name="",this.blending=sr,this.side=ur,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=wd,this.blendDst=Ed,this.blendEquation=Ar,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new me(0,0,0),this.blendAlpha=0,this.depthFunc=Ws,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Kp,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Jr,this.stencilZFail=Jr,this.stencilZPass=Jr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const n in e){const i=e[n];if(i===void 0){console.warn(`THREE.Material: parameter '${n}' has value of undefined.`);continue}const r=this[n];if(r===void 0){console.warn(`THREE.Material: '${n}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[n]=i}}toJSON(e){const n=e===void 0||typeof e=="string";n&&(e={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==sr&&(i.blending=this.blending),this.side!==ur&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==wd&&(i.blendSrc=this.blendSrc),this.blendDst!==Ed&&(i.blendDst=this.blendDst),this.blendEquation!==Ar&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Ws&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Kp&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Jr&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Jr&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Jr&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const o=[];for(const a in s){const l=s[a];delete l.metadata,o.push(l)}return o}if(n){const s=r(e.textures),o=r(e.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const n=e.clippingPlanes;let i=null;if(n!==null){const r=n.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=n[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class xf extends $r{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new me(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ui,this.combine=Sv,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Ct=new R,Ka=new He;class Je{constructor(e,n,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=n,this.count=e!==void 0?e.length/n:0,this.normalized=i,this.usage=Yp,this.updateRanges=[],this.gpuType=ai,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,n,i){e*=this.itemSize,i*=n.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=n.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let n=0,i=this.count;n<i;n++)Ka.fromBufferAttribute(this,n),Ka.applyMatrix3(e),this.setXY(n,Ka.x,Ka.y);else if(this.itemSize===3)for(let n=0,i=this.count;n<i;n++)Ct.fromBufferAttribute(this,n),Ct.applyMatrix3(e),this.setXYZ(n,Ct.x,Ct.y,Ct.z);return this}applyMatrix4(e){for(let n=0,i=this.count;n<i;n++)Ct.fromBufferAttribute(this,n),Ct.applyMatrix4(e),this.setXYZ(n,Ct.x,Ct.y,Ct.z);return this}applyNormalMatrix(e){for(let n=0,i=this.count;n<i;n++)Ct.fromBufferAttribute(this,n),Ct.applyNormalMatrix(e),this.setXYZ(n,Ct.x,Ct.y,Ct.z);return this}transformDirection(e){for(let n=0,i=this.count;n<i;n++)Ct.fromBufferAttribute(this,n),Ct.transformDirection(e),this.setXYZ(n,Ct.x,Ct.y,Ct.z);return this}set(e,n=0){return this.array.set(e,n),this}getComponent(e,n){let i=this.array[e*this.itemSize+n];return this.normalized&&(i=ps(i,this.array)),i}setComponent(e,n,i){return this.normalized&&(i=nn(i,this.array)),this.array[e*this.itemSize+n]=i,this}getX(e){let n=this.array[e*this.itemSize];return this.normalized&&(n=ps(n,this.array)),n}setX(e,n){return this.normalized&&(n=nn(n,this.array)),this.array[e*this.itemSize]=n,this}getY(e){let n=this.array[e*this.itemSize+1];return this.normalized&&(n=ps(n,this.array)),n}setY(e,n){return this.normalized&&(n=nn(n,this.array)),this.array[e*this.itemSize+1]=n,this}getZ(e){let n=this.array[e*this.itemSize+2];return this.normalized&&(n=ps(n,this.array)),n}setZ(e,n){return this.normalized&&(n=nn(n,this.array)),this.array[e*this.itemSize+2]=n,this}getW(e){let n=this.array[e*this.itemSize+3];return this.normalized&&(n=ps(n,this.array)),n}setW(e,n){return this.normalized&&(n=nn(n,this.array)),this.array[e*this.itemSize+3]=n,this}setXY(e,n,i){return e*=this.itemSize,this.normalized&&(n=nn(n,this.array),i=nn(i,this.array)),this.array[e+0]=n,this.array[e+1]=i,this}setXYZ(e,n,i,r){return e*=this.itemSize,this.normalized&&(n=nn(n,this.array),i=nn(i,this.array),r=nn(r,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,n,i,r,s){return e*=this.itemSize,this.normalized&&(n=nn(n,this.array),i=nn(i,this.array),r=nn(r,this.array),s=nn(s,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Yp&&(e.usage=this.usage),e}}class zv extends Je{constructor(e,n,i){super(new Uint16Array(e),n,i)}}class Hv extends Je{constructor(e,n,i){super(new Uint32Array(e),n,i)}}class It extends Je{constructor(e,n,i){super(new Float32Array(e),n,i)}}let QM=0;const Dn=new rt,fu=new Wt,cs=new R,_n=new Yr,xo=new Yr,Ft=new R;class ct extends to{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:QM++}),this.uuid=no(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Ov(e)?Hv:zv)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,n){return this.attributes[e]=n,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,n,i=0){this.groups.push({start:e,count:n,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,n){this.drawRange.start=e,this.drawRange.count=n}applyMatrix4(e){const n=this.attributes.position;n!==void 0&&(n.applyMatrix4(e),n.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new ke().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Dn.makeRotationFromQuaternion(e),this.applyMatrix4(Dn),this}rotateX(e){return Dn.makeRotationX(e),this.applyMatrix4(Dn),this}rotateY(e){return Dn.makeRotationY(e),this.applyMatrix4(Dn),this}rotateZ(e){return Dn.makeRotationZ(e),this.applyMatrix4(Dn),this}translate(e,n,i){return Dn.makeTranslation(e,n,i),this.applyMatrix4(Dn),this}scale(e,n,i){return Dn.makeScale(e,n,i),this.applyMatrix4(Dn),this}lookAt(e){return fu.lookAt(e),fu.updateMatrix(),this.applyMatrix4(fu.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(cs).negate(),this.translate(cs.x,cs.y,cs.z),this}setFromPoints(e){const n=this.getAttribute("position");if(n===void 0){const i=[];for(let r=0,s=e.length;r<s;r++){const o=e[r];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new It(i,3))}else{for(let i=0,r=n.count;i<r;i++){const s=e[i];n.setXYZ(i,s.x,s.y,s.z||0)}e.length>n.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),n.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Yr);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new R(-1/0,-1/0,-1/0),new R(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),n)for(let i=0,r=n.length;i<r;i++){const s=n[i];_n.setFromBufferAttribute(s),this.morphTargetsRelative?(Ft.addVectors(this.boundingBox.min,_n.min),this.boundingBox.expandByPoint(Ft),Ft.addVectors(this.boundingBox.max,_n.max),this.boundingBox.expandByPoint(Ft)):(this.boundingBox.expandByPoint(_n.min),this.boundingBox.expandByPoint(_n.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new qr);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new R,1/0);return}if(e){const i=this.boundingSphere.center;if(_n.setFromBufferAttribute(e),n)for(let s=0,o=n.length;s<o;s++){const a=n[s];xo.setFromBufferAttribute(a),this.morphTargetsRelative?(Ft.addVectors(_n.min,xo.min),_n.expandByPoint(Ft),Ft.addVectors(_n.max,xo.max),_n.expandByPoint(Ft)):(_n.expandByPoint(xo.min),_n.expandByPoint(xo.max))}_n.getCenter(i);let r=0;for(let s=0,o=e.count;s<o;s++)Ft.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(Ft));if(n)for(let s=0,o=n.length;s<o;s++){const a=n[s],l=this.morphTargetsRelative;for(let c=0,d=a.count;c<d;c++)Ft.fromBufferAttribute(a,c),l&&(cs.fromBufferAttribute(e,c),Ft.add(cs)),r=Math.max(r,i.distanceToSquared(Ft))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,n=this.attributes;if(e===null||n.position===void 0||n.normal===void 0||n.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=n.position,r=n.normal,s=n.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Je(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let b=0;b<i.count;b++)a[b]=new R,l[b]=new R;const c=new R,d=new R,h=new R,f=new He,p=new He,v=new He,y=new R,m=new R;function u(b,w,M){c.fromBufferAttribute(i,b),d.fromBufferAttribute(i,w),h.fromBufferAttribute(i,M),f.fromBufferAttribute(s,b),p.fromBufferAttribute(s,w),v.fromBufferAttribute(s,M),d.sub(c),h.sub(c),p.sub(f),v.sub(f);const D=1/(p.x*v.y-v.x*p.y);isFinite(D)&&(y.copy(d).multiplyScalar(v.y).addScaledVector(h,-p.y).multiplyScalar(D),m.copy(h).multiplyScalar(p.x).addScaledVector(d,-v.x).multiplyScalar(D),a[b].add(y),a[w].add(y),a[M].add(y),l[b].add(m),l[w].add(m),l[M].add(m))}let g=this.groups;g.length===0&&(g=[{start:0,count:e.count}]);for(let b=0,w=g.length;b<w;++b){const M=g[b],D=M.start,V=M.count;for(let z=D,X=D+V;z<X;z+=3)u(e.getX(z+0),e.getX(z+1),e.getX(z+2))}const x=new R,_=new R,P=new R,T=new R;function A(b){P.fromBufferAttribute(r,b),T.copy(P);const w=a[b];x.copy(w),x.sub(P.multiplyScalar(P.dot(w))).normalize(),_.crossVectors(T,w);const D=_.dot(l[b])<0?-1:1;o.setXYZW(b,x.x,x.y,x.z,D)}for(let b=0,w=g.length;b<w;++b){const M=g[b],D=M.start,V=M.count;for(let z=D,X=D+V;z<X;z+=3)A(e.getX(z+0)),A(e.getX(z+1)),A(e.getX(z+2))}}computeVertexNormals(){const e=this.index,n=this.getAttribute("position");if(n!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Je(new Float32Array(n.count*3),3),this.setAttribute("normal",i);else for(let f=0,p=i.count;f<p;f++)i.setXYZ(f,0,0,0);const r=new R,s=new R,o=new R,a=new R,l=new R,c=new R,d=new R,h=new R;if(e)for(let f=0,p=e.count;f<p;f+=3){const v=e.getX(f+0),y=e.getX(f+1),m=e.getX(f+2);r.fromBufferAttribute(n,v),s.fromBufferAttribute(n,y),o.fromBufferAttribute(n,m),d.subVectors(o,s),h.subVectors(r,s),d.cross(h),a.fromBufferAttribute(i,v),l.fromBufferAttribute(i,y),c.fromBufferAttribute(i,m),a.add(d),l.add(d),c.add(d),i.setXYZ(v,a.x,a.y,a.z),i.setXYZ(y,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let f=0,p=n.count;f<p;f+=3)r.fromBufferAttribute(n,f+0),s.fromBufferAttribute(n,f+1),o.fromBufferAttribute(n,f+2),d.subVectors(o,s),h.subVectors(r,s),d.cross(h),i.setXYZ(f+0,d.x,d.y,d.z),i.setXYZ(f+1,d.x,d.y,d.z),i.setXYZ(f+2,d.x,d.y,d.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let n=0,i=e.count;n<i;n++)Ft.fromBufferAttribute(e,n),Ft.normalize(),e.setXYZ(n,Ft.x,Ft.y,Ft.z)}toNonIndexed(){function e(a,l){const c=a.array,d=a.itemSize,h=a.normalized,f=new c.constructor(l.length*d);let p=0,v=0;for(let y=0,m=l.length;y<m;y++){a.isInterleavedBufferAttribute?p=l[y]*a.data.stride+a.offset:p=l[y]*d;for(let u=0;u<d;u++)f[v++]=c[p++]}return new Je(f,d,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const n=new ct,i=this.index.array,r=this.attributes;for(const a in r){const l=r[a],c=e(l,i);n.setAttribute(a,c)}const s=this.morphAttributes;for(const a in s){const l=[],c=s[a];for(let d=0,h=c.length;d<h;d++){const f=c[d],p=e(f,i);l.push(p)}n.morphAttributes[a]=l}n.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];n.addGroup(c.start,c.count,c.materialIndex)}return n}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const n=this.index;n!==null&&(e.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],d=[];for(let h=0,f=c.length;h<f;h++){const p=c[h];d.push(p.toJSON(e.data))}d.length>0&&(r[l]=d,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const n={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone(n));const r=e.attributes;for(const c in r){const d=r[c];this.setAttribute(c,d.clone(n))}const s=e.morphAttributes;for(const c in s){const d=[],h=s[c];for(let f=0,p=h.length;f<p;f++)d.push(h[f].clone(n));this.morphAttributes[c]=d}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let c=0,d=o.length;c<d;c++){const h=o[c];this.addGroup(h.start,h.count,h.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const hm=new rt,xr=new yc,Ya=new qr,fm=new R,qa=new R,$a=new R,Za=new R,pu=new R,Qa=new R,pm=new R,Ja=new R;class lt extends Wt{constructor(e=new ct,n=new xf){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,n){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;n.fromBufferAttribute(r,e);const a=this.morphTargetInfluences;if(s&&a){Qa.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const d=a[l],h=s[l];d!==0&&(pu.fromBufferAttribute(h,e),o?Qa.addScaledVector(pu,d):Qa.addScaledVector(pu.sub(n),d))}n.add(Qa)}return n}raycast(e,n){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Ya.copy(i.boundingSphere),Ya.applyMatrix4(s),xr.copy(e.ray).recast(e.near),!(Ya.containsPoint(xr.origin)===!1&&(xr.intersectSphere(Ya,fm)===null||xr.origin.distanceToSquared(fm)>(e.far-e.near)**2))&&(hm.copy(s).invert(),xr.copy(e.ray).applyMatrix4(hm),!(i.boundingBox!==null&&xr.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,n,xr)))}_computeIntersections(e,n,i){let r;const s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,c=s.attributes.uv,d=s.attributes.uv1,h=s.attributes.normal,f=s.groups,p=s.drawRange;if(a!==null)if(Array.isArray(o))for(let v=0,y=f.length;v<y;v++){const m=f[v],u=o[m.materialIndex],g=Math.max(m.start,p.start),x=Math.min(a.count,Math.min(m.start+m.count,p.start+p.count));for(let _=g,P=x;_<P;_+=3){const T=a.getX(_),A=a.getX(_+1),b=a.getX(_+2);r=el(this,u,e,i,c,d,h,T,A,b),r&&(r.faceIndex=Math.floor(_/3),r.face.materialIndex=m.materialIndex,n.push(r))}}else{const v=Math.max(0,p.start),y=Math.min(a.count,p.start+p.count);for(let m=v,u=y;m<u;m+=3){const g=a.getX(m),x=a.getX(m+1),_=a.getX(m+2);r=el(this,o,e,i,c,d,h,g,x,_),r&&(r.faceIndex=Math.floor(m/3),n.push(r))}}else if(l!==void 0)if(Array.isArray(o))for(let v=0,y=f.length;v<y;v++){const m=f[v],u=o[m.materialIndex],g=Math.max(m.start,p.start),x=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let _=g,P=x;_<P;_+=3){const T=_,A=_+1,b=_+2;r=el(this,u,e,i,c,d,h,T,A,b),r&&(r.faceIndex=Math.floor(_/3),r.face.materialIndex=m.materialIndex,n.push(r))}}else{const v=Math.max(0,p.start),y=Math.min(l.count,p.start+p.count);for(let m=v,u=y;m<u;m+=3){const g=m,x=m+1,_=m+2;r=el(this,o,e,i,c,d,h,g,x,_),r&&(r.faceIndex=Math.floor(m/3),n.push(r))}}}}function JM(t,e,n,i,r,s,o,a){let l;if(e.side===Lt?l=i.intersectTriangle(o,s,r,!0,a):l=i.intersectTriangle(r,s,o,e.side===ur,a),l===null)return null;Ja.copy(a),Ja.applyMatrix4(t.matrixWorld);const c=n.ray.origin.distanceTo(Ja);return c<n.near||c>n.far?null:{distance:c,point:Ja.clone(),object:t}}function el(t,e,n,i,r,s,o,a,l,c){t.getVertexPosition(a,qa),t.getVertexPosition(l,$a),t.getVertexPosition(c,Za);const d=JM(t,e,n,i,qa,$a,Za,pm);if(d){const h=new R;Yn.getBarycoord(pm,qa,$a,Za,h),r&&(d.uv=Yn.getInterpolatedAttribute(r,a,l,c,h,new He)),s&&(d.uv1=Yn.getInterpolatedAttribute(s,a,l,c,h,new He)),o&&(d.normal=Yn.getInterpolatedAttribute(o,a,l,c,h,new R),d.normal.dot(i.direction)>0&&d.normal.multiplyScalar(-1));const f={a,b:l,c,normal:new R,materialIndex:0};Yn.getNormal(qa,$a,Za,f.normal),d.face=f,d.barycoord=h}return d}class xa extends ct{constructor(e=1,n=1,i=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:n,depth:i,widthSegments:r,heightSegments:s,depthSegments:o};const a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);const l=[],c=[],d=[],h=[];let f=0,p=0;v("z","y","x",-1,-1,i,n,e,o,s,0),v("z","y","x",1,-1,i,n,-e,o,s,1),v("x","z","y",1,1,e,i,n,r,o,2),v("x","z","y",1,-1,e,i,-n,r,o,3),v("x","y","z",1,-1,e,n,i,r,s,4),v("x","y","z",-1,-1,e,n,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new It(c,3)),this.setAttribute("normal",new It(d,3)),this.setAttribute("uv",new It(h,2));function v(y,m,u,g,x,_,P,T,A,b,w){const M=_/A,D=P/b,V=_/2,z=P/2,X=T/2,Z=A+1,Y=b+1;let te=0,N=0;const $=new R;for(let Q=0;Q<Y;Q++){const oe=Q*D-z;for(let _e=0;_e<Z;_e++){const Ve=_e*M-V;$[y]=Ve*g,$[m]=oe*x,$[u]=X,c.push($.x,$.y,$.z),$[y]=0,$[m]=0,$[u]=T>0?1:-1,d.push($.x,$.y,$.z),h.push(_e/A),h.push(1-Q/b),te+=1}}for(let Q=0;Q<b;Q++)for(let oe=0;oe<A;oe++){const _e=f+oe+Z*Q,Ve=f+oe+Z*(Q+1),K=f+(oe+1)+Z*(Q+1),ne=f+(oe+1)+Z*Q;l.push(_e,Ve,ne),l.push(Ve,K,ne),N+=6}a.addGroup(p,N,w),p+=N,f+=te}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new xa(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function qs(t){const e={};for(const n in t){e[n]={};for(const i in t[n]){const r=t[n][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[n][i]=null):e[n][i]=r.clone():Array.isArray(r)?e[n][i]=r.slice():e[n][i]=r}}return e}function rn(t){const e={};for(let n=0;n<t.length;n++){const i=qs(t[n]);for(const r in i)e[r]=i[r]}return e}function eS(t){const e=[];for(let n=0;n<t.length;n++)e.push(t[n].clone());return e}function Vv(t){const e=t.getRenderTarget();return e===null?t.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:qe.workingColorSpace}const tS={clone:qs,merge:rn};var nS=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,iS=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class vt extends $r{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=nS,this.fragmentShader=iS,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=qs(e.uniforms),this.uniformsGroups=eS(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const n=super.toJSON(e);n.glslVersion=this.glslVersion,n.uniforms={};for(const r in this.uniforms){const o=this.uniforms[r].value;o&&o.isTexture?n.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?n.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?n.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?n.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?n.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?n.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?n.uniforms[r]={type:"m4",value:o.toArray()}:n.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(n.extensions=i),n}}class Gv extends Wt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new rt,this.projectionMatrix=new rt,this.projectionMatrixInverse=new rt,this.coordinateSystem=wi}copy(e,n){return super.copy(e,n),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,n){super.updateWorldMatrix(e,n),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Hi=new R,mm=new He,gm=new He;class Sn extends Gv{constructor(e=50,n=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const n=.5*this.getFilmHeight()/e;this.fov=la*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(zo*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return la*2*Math.atan(Math.tan(zo*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,n,i){Hi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Hi.x,Hi.y).multiplyScalar(-e/Hi.z),Hi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Hi.x,Hi.y).multiplyScalar(-e/Hi.z)}getViewSize(e,n){return this.getViewBounds(e,mm,gm),n.subVectors(gm,mm)}setViewOffset(e,n,i,r,s,o){this.aspect=e/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let n=e*Math.tan(zo*.5*this.fov)/this.zoom,i=2*n,r=this.aspect*i,s=-.5*r;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*r/l,n-=o.offsetY*i/c,r*=o.width/l,i*=o.height/c}const a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,n,n-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}}const us=-90,ds=1;class rS extends Wt{constructor(e,n,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new Sn(us,ds,e,n);r.layers=this.layers,this.add(r);const s=new Sn(us,ds,e,n);s.layers=this.layers,this.add(s);const o=new Sn(us,ds,e,n);o.layers=this.layers,this.add(o);const a=new Sn(us,ds,e,n);a.layers=this.layers,this.add(a);const l=new Sn(us,ds,e,n);l.layers=this.layers,this.add(l);const c=new Sn(us,ds,e,n);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,n=this.children.concat(),[i,r,s,o,a,l]=n;for(const c of n)this.remove(c);if(e===wi)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Ql)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of n)this.add(c),c.updateMatrixWorld()}update(e,n){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,o,a,l,c,d]=this.children,h=e.getRenderTarget(),f=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),v=e.xr.enabled;e.xr.enabled=!1;const y=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,r),e.render(n,s),e.setRenderTarget(i,1,r),e.render(n,o),e.setRenderTarget(i,2,r),e.render(n,a),e.setRenderTarget(i,3,r),e.render(n,l),e.setRenderTarget(i,4,r),e.render(n,c),i.texture.generateMipmaps=y,e.setRenderTarget(i,5,r),e.render(n,d),e.setRenderTarget(h,f,p),e.xr.enabled=v,i.texture.needsPMREMUpdate=!0}}class Wv extends zt{constructor(e,n,i,r,s,o,a,l,c,d){e=e!==void 0?e:[],n=n!==void 0?n:js,super(e,n,i,r,s,o,a,l,c,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class sS extends Wr{constructor(e=1,n={}){super(e,e,n),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new Wv(r,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=n.generateMipmaps!==void 0?n.generateMipmaps:!1,this.texture.minFilter=n.minFilter!==void 0?n.minFilter:fn}fromEquirectangularTexture(e,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new xa(5,5,5),s=new vt({name:"CubemapFromEquirect",uniforms:qs(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Lt,blending:rr});s.uniforms.tEquirect.value=n;const o=new lt(r,s),a=n.minFilter;return n.minFilter===$n&&(n.minFilter=fn),new rS(1,10,this).update(e,o),n.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,n,i,r){const s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(n,i,r);e.setRenderTarget(s)}}const mu=new R,oS=new R,aS=new ke;class Er{constructor(e=new R(1,0,0),n=0){this.isPlane=!0,this.normal=e,this.constant=n}set(e,n){return this.normal.copy(e),this.constant=n,this}setComponents(e,n,i,r){return this.normal.set(e,n,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,n){return this.normal.copy(e),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(e,n,i){const r=mu.subVectors(i,n).cross(oS.subVectors(e,n)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,n){return n.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,n){const i=e.delta(mu),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?n.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:n.copy(e.start).addScaledVector(i,s)}intersectsLine(e){const n=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return n<0&&i>0||i<0&&n>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,n){const i=n||aS.getNormalMatrix(e),r=this.coplanarPoint(mu).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const _r=new qr,tl=new R;class _f{constructor(e=new Er,n=new Er,i=new Er,r=new Er,s=new Er,o=new Er){this.planes=[e,n,i,r,s,o]}set(e,n,i,r,s,o){const a=this.planes;return a[0].copy(e),a[1].copy(n),a[2].copy(i),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(e){const n=this.planes;for(let i=0;i<6;i++)n[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,n=wi){const i=this.planes,r=e.elements,s=r[0],o=r[1],a=r[2],l=r[3],c=r[4],d=r[5],h=r[6],f=r[7],p=r[8],v=r[9],y=r[10],m=r[11],u=r[12],g=r[13],x=r[14],_=r[15];if(i[0].setComponents(l-s,f-c,m-p,_-u).normalize(),i[1].setComponents(l+s,f+c,m+p,_+u).normalize(),i[2].setComponents(l+o,f+d,m+v,_+g).normalize(),i[3].setComponents(l-o,f-d,m-v,_-g).normalize(),i[4].setComponents(l-a,f-h,m-y,_-x).normalize(),n===wi)i[5].setComponents(l+a,f+h,m+y,_+x).normalize();else if(n===Ql)i[5].setComponents(a,h,y,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),_r.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const n=e.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),_r.copy(n.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(_r)}intersectsSprite(e){return _r.center.set(0,0,0),_r.radius=.7071067811865476,_r.applyMatrix4(e.matrixWorld),this.intersectsSphere(_r)}intersectsSphere(e){const n=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(n[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const n=this.planes;for(let i=0;i<6;i++){const r=n[i];if(tl.x=r.normal.x>0?e.max.x:e.min.x,tl.y=r.normal.y>0?e.max.y:e.min.y,tl.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(tl)<0)return!1}return!0}containsPoint(e){const n=this.planes;for(let i=0;i<6;i++)if(n[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function jv(){let t=null,e=!1,n=null,i=null;function r(s,o){n(s,o),i=t.requestAnimationFrame(r)}return{start:function(){e!==!0&&n!==null&&(i=t.requestAnimationFrame(r),e=!0)},stop:function(){t.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){n=s},setContext:function(s){t=s}}}function lS(t){const e=new WeakMap;function n(a,l){const c=a.array,d=a.usage,h=c.byteLength,f=t.createBuffer();t.bindBuffer(l,f),t.bufferData(l,c,d),a.onUploadCallback();let p;if(c instanceof Float32Array)p=t.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?p=t.HALF_FLOAT:p=t.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=t.SHORT;else if(c instanceof Uint32Array)p=t.UNSIGNED_INT;else if(c instanceof Int32Array)p=t.INT;else if(c instanceof Int8Array)p=t.BYTE;else if(c instanceof Uint8Array)p=t.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=t.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:h}}function i(a,l,c){const d=l.array,h=l.updateRanges;if(t.bindBuffer(c,a),h.length===0)t.bufferSubData(c,0,d);else{h.sort((p,v)=>p.start-v.start);let f=0;for(let p=1;p<h.length;p++){const v=h[f],y=h[p];y.start<=v.start+v.count+1?v.count=Math.max(v.count,y.start+y.count-v.start):(++f,h[f]=y)}h.length=f+1;for(let p=0,v=h.length;p<v;p++){const y=h[p];t.bufferSubData(c,y.start*d.BYTES_PER_ELEMENT,d,y.start,y.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=e.get(a);l&&(t.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const d=e.get(a);(!d||d.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=e.get(a);if(c===void 0)e.set(a,n(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,a,l),c.version=a.version}}return{get:r,remove:s,update:o}}class jr extends ct{constructor(e=1,n=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:n,widthSegments:i,heightSegments:r};const s=e/2,o=n/2,a=Math.floor(i),l=Math.floor(r),c=a+1,d=l+1,h=e/a,f=n/l,p=[],v=[],y=[],m=[];for(let u=0;u<d;u++){const g=u*f-o;for(let x=0;x<c;x++){const _=x*h-s;v.push(_,-g,0),y.push(0,0,1),m.push(x/a),m.push(1-u/l)}}for(let u=0;u<l;u++)for(let g=0;g<a;g++){const x=g+c*u,_=g+c*(u+1),P=g+1+c*(u+1),T=g+1+c*u;p.push(x,_,T),p.push(_,P,T)}this.setIndex(p),this.setAttribute("position",new It(v,3)),this.setAttribute("normal",new It(y,3)),this.setAttribute("uv",new It(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new jr(e.width,e.height,e.widthSegments,e.heightSegments)}}var cS=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,uS=`#ifdef USE_ALPHAHASH
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
#endif`,dS=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,hS=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,fS=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,pS=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,mS=`#ifdef USE_AOMAP
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
#endif`,gS=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,vS=`#ifdef USE_BATCHING
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
#endif`,xS=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,_S=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,yS=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,MS=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,SS=`#ifdef USE_IRIDESCENCE
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
#endif`,wS=`#ifdef USE_BUMPMAP
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
#endif`,ES=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,TS=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,AS=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,bS=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,CS=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,PS=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,RS=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,DS=`#if defined( USE_COLOR_ALPHA )
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
#endif`,NS=`#define PI 3.141592653589793
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
} // validated`,LS=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,IS=`vec3 transformedNormal = objectNormal;
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
#endif`,US=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,OS=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,FS=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,kS=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,BS="gl_FragColor = linearToOutputTexel( gl_FragColor );",zS=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,HS=`#ifdef USE_ENVMAP
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
#endif`,VS=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,GS=`#ifdef USE_ENVMAP
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
#endif`,WS=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,jS=`#ifdef USE_ENVMAP
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
#endif`,XS=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,KS=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,YS=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,qS=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,$S=`#ifdef USE_GRADIENTMAP
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
}`,ZS=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,QS=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,JS=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,e1=`uniform bool receiveShadow;
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
#endif`,t1=`#ifdef USE_ENVMAP
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
#endif`,n1=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,i1=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,r1=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,s1=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,o1=`PhysicalMaterial material;
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
#endif`,a1=`struct PhysicalMaterial {
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
}`,l1=`
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
#endif`,c1=`#if defined( RE_IndirectDiffuse )
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
#endif`,u1=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,d1=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,h1=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,f1=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,p1=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,m1=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,g1=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,v1=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,x1=`#if defined( USE_POINTS_UV )
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
#endif`,_1=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,y1=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,M1=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,S1=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,w1=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,E1=`#ifdef USE_MORPHTARGETS
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
#endif`,T1=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,A1=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,b1=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,C1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,P1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,R1=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,D1=`#ifdef USE_NORMALMAP
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
#endif`,N1=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,L1=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,I1=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,U1=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,O1=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,F1=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,k1=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,B1=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,z1=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,H1=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,V1=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,G1=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,W1=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,j1=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,X1=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,K1=`float getShadowMask() {
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
}`,Y1=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,q1=`#ifdef USE_SKINNING
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
#endif`,$1=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Z1=`#ifdef USE_SKINNING
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
#endif`,Q1=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,J1=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,ew=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tw=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,nw=`#ifdef USE_TRANSMISSION
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
#endif`,iw=`#ifdef USE_TRANSMISSION
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
#endif`,rw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,sw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ow=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,aw=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const lw=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,cw=`uniform sampler2D t2D;
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
}`,uw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,dw=`#ifdef ENVMAP_TYPE_CUBE
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
}`,hw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,fw=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,pw=`#include <common>
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
}`,mw=`#if DEPTH_PACKING == 3200
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
}`,gw=`#define DISTANCE
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
}`,vw=`#define DISTANCE
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
}`,xw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,_w=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,yw=`uniform float scale;
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
}`,Mw=`uniform vec3 diffuse;
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
}`,Sw=`#include <common>
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
}`,ww=`uniform vec3 diffuse;
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
}`,Ew=`#define LAMBERT
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
}`,Tw=`#define LAMBERT
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
}`,Aw=`#define MATCAP
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
}`,bw=`#define MATCAP
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
}`,Cw=`#define NORMAL
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
}`,Pw=`#define NORMAL
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
}`,Rw=`#define PHONG
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
}`,Dw=`#define PHONG
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
}`,Nw=`#define STANDARD
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
}`,Lw=`#define STANDARD
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
}`,Iw=`#define TOON
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
}`,Uw=`#define TOON
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
}`,Ow=`uniform float size;
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
}`,Fw=`uniform vec3 diffuse;
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
}`,kw=`#include <common>
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
}`,Bw=`uniform vec3 color;
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
}`,zw=`uniform float rotation;
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
}`,Hw=`uniform vec3 diffuse;
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
}`,ze={alphahash_fragment:cS,alphahash_pars_fragment:uS,alphamap_fragment:dS,alphamap_pars_fragment:hS,alphatest_fragment:fS,alphatest_pars_fragment:pS,aomap_fragment:mS,aomap_pars_fragment:gS,batching_pars_vertex:vS,batching_vertex:xS,begin_vertex:_S,beginnormal_vertex:yS,bsdfs:MS,iridescence_fragment:SS,bumpmap_pars_fragment:wS,clipping_planes_fragment:ES,clipping_planes_pars_fragment:TS,clipping_planes_pars_vertex:AS,clipping_planes_vertex:bS,color_fragment:CS,color_pars_fragment:PS,color_pars_vertex:RS,color_vertex:DS,common:NS,cube_uv_reflection_fragment:LS,defaultnormal_vertex:IS,displacementmap_pars_vertex:US,displacementmap_vertex:OS,emissivemap_fragment:FS,emissivemap_pars_fragment:kS,colorspace_fragment:BS,colorspace_pars_fragment:zS,envmap_fragment:HS,envmap_common_pars_fragment:VS,envmap_pars_fragment:GS,envmap_pars_vertex:WS,envmap_physical_pars_fragment:t1,envmap_vertex:jS,fog_vertex:XS,fog_pars_vertex:KS,fog_fragment:YS,fog_pars_fragment:qS,gradientmap_pars_fragment:$S,lightmap_pars_fragment:ZS,lights_lambert_fragment:QS,lights_lambert_pars_fragment:JS,lights_pars_begin:e1,lights_toon_fragment:n1,lights_toon_pars_fragment:i1,lights_phong_fragment:r1,lights_phong_pars_fragment:s1,lights_physical_fragment:o1,lights_physical_pars_fragment:a1,lights_fragment_begin:l1,lights_fragment_maps:c1,lights_fragment_end:u1,logdepthbuf_fragment:d1,logdepthbuf_pars_fragment:h1,logdepthbuf_pars_vertex:f1,logdepthbuf_vertex:p1,map_fragment:m1,map_pars_fragment:g1,map_particle_fragment:v1,map_particle_pars_fragment:x1,metalnessmap_fragment:_1,metalnessmap_pars_fragment:y1,morphinstance_vertex:M1,morphcolor_vertex:S1,morphnormal_vertex:w1,morphtarget_pars_vertex:E1,morphtarget_vertex:T1,normal_fragment_begin:A1,normal_fragment_maps:b1,normal_pars_fragment:C1,normal_pars_vertex:P1,normal_vertex:R1,normalmap_pars_fragment:D1,clearcoat_normal_fragment_begin:N1,clearcoat_normal_fragment_maps:L1,clearcoat_pars_fragment:I1,iridescence_pars_fragment:U1,opaque_fragment:O1,packing:F1,premultiplied_alpha_fragment:k1,project_vertex:B1,dithering_fragment:z1,dithering_pars_fragment:H1,roughnessmap_fragment:V1,roughnessmap_pars_fragment:G1,shadowmap_pars_fragment:W1,shadowmap_pars_vertex:j1,shadowmap_vertex:X1,shadowmask_pars_fragment:K1,skinbase_vertex:Y1,skinning_pars_vertex:q1,skinning_vertex:$1,skinnormal_vertex:Z1,specularmap_fragment:Q1,specularmap_pars_fragment:J1,tonemapping_fragment:ew,tonemapping_pars_fragment:tw,transmission_fragment:nw,transmission_pars_fragment:iw,uv_pars_fragment:rw,uv_pars_vertex:sw,uv_vertex:ow,worldpos_vertex:aw,background_vert:lw,background_frag:cw,backgroundCube_vert:uw,backgroundCube_frag:dw,cube_vert:hw,cube_frag:fw,depth_vert:pw,depth_frag:mw,distanceRGBA_vert:gw,distanceRGBA_frag:vw,equirect_vert:xw,equirect_frag:_w,linedashed_vert:yw,linedashed_frag:Mw,meshbasic_vert:Sw,meshbasic_frag:ww,meshlambert_vert:Ew,meshlambert_frag:Tw,meshmatcap_vert:Aw,meshmatcap_frag:bw,meshnormal_vert:Cw,meshnormal_frag:Pw,meshphong_vert:Rw,meshphong_frag:Dw,meshphysical_vert:Nw,meshphysical_frag:Lw,meshtoon_vert:Iw,meshtoon_frag:Uw,points_vert:Ow,points_frag:Fw,shadow_vert:kw,shadow_frag:Bw,sprite_vert:zw,sprite_frag:Hw},le={common:{diffuse:{value:new me(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ke},alphaMap:{value:null},alphaMapTransform:{value:new ke},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ke}},envmap:{envMap:{value:null},envMapRotation:{value:new ke},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ke}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ke}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ke},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ke},normalScale:{value:new He(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ke},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ke}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ke}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ke}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new me(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new me(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ke},alphaTest:{value:0},uvTransform:{value:new ke}},sprite:{diffuse:{value:new me(16777215)},opacity:{value:1},center:{value:new He(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ke},alphaMap:{value:null},alphaMapTransform:{value:new ke},alphaTest:{value:0}}},si={basic:{uniforms:rn([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.fog]),vertexShader:ze.meshbasic_vert,fragmentShader:ze.meshbasic_frag},lambert:{uniforms:rn([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.fog,le.lights,{emissive:{value:new me(0)}}]),vertexShader:ze.meshlambert_vert,fragmentShader:ze.meshlambert_frag},phong:{uniforms:rn([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.fog,le.lights,{emissive:{value:new me(0)},specular:{value:new me(1118481)},shininess:{value:30}}]),vertexShader:ze.meshphong_vert,fragmentShader:ze.meshphong_frag},standard:{uniforms:rn([le.common,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.roughnessmap,le.metalnessmap,le.fog,le.lights,{emissive:{value:new me(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ze.meshphysical_vert,fragmentShader:ze.meshphysical_frag},toon:{uniforms:rn([le.common,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.gradientmap,le.fog,le.lights,{emissive:{value:new me(0)}}]),vertexShader:ze.meshtoon_vert,fragmentShader:ze.meshtoon_frag},matcap:{uniforms:rn([le.common,le.bumpmap,le.normalmap,le.displacementmap,le.fog,{matcap:{value:null}}]),vertexShader:ze.meshmatcap_vert,fragmentShader:ze.meshmatcap_frag},points:{uniforms:rn([le.points,le.fog]),vertexShader:ze.points_vert,fragmentShader:ze.points_frag},dashed:{uniforms:rn([le.common,le.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ze.linedashed_vert,fragmentShader:ze.linedashed_frag},depth:{uniforms:rn([le.common,le.displacementmap]),vertexShader:ze.depth_vert,fragmentShader:ze.depth_frag},normal:{uniforms:rn([le.common,le.bumpmap,le.normalmap,le.displacementmap,{opacity:{value:1}}]),vertexShader:ze.meshnormal_vert,fragmentShader:ze.meshnormal_frag},sprite:{uniforms:rn([le.sprite,le.fog]),vertexShader:ze.sprite_vert,fragmentShader:ze.sprite_frag},background:{uniforms:{uvTransform:{value:new ke},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ze.background_vert,fragmentShader:ze.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ke}},vertexShader:ze.backgroundCube_vert,fragmentShader:ze.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ze.cube_vert,fragmentShader:ze.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ze.equirect_vert,fragmentShader:ze.equirect_frag},distanceRGBA:{uniforms:rn([le.common,le.displacementmap,{referencePosition:{value:new R},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ze.distanceRGBA_vert,fragmentShader:ze.distanceRGBA_frag},shadow:{uniforms:rn([le.lights,le.fog,{color:{value:new me(0)},opacity:{value:1}}]),vertexShader:ze.shadow_vert,fragmentShader:ze.shadow_frag}};si.physical={uniforms:rn([si.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ke},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ke},clearcoatNormalScale:{value:new He(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ke},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ke},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ke},sheen:{value:0},sheenColor:{value:new me(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ke},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ke},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ke},transmissionSamplerSize:{value:new He},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ke},attenuationDistance:{value:0},attenuationColor:{value:new me(0)},specularColor:{value:new me(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ke},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ke},anisotropyVector:{value:new He},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ke}}]),vertexShader:ze.meshphysical_vert,fragmentShader:ze.meshphysical_frag};const nl={r:0,b:0,g:0},yr=new ui,Vw=new rt;function Gw(t,e,n,i,r,s,o){const a=new me(0);let l=s===!0?0:1,c,d,h=null,f=0,p=null;function v(g){let x=g.isScene===!0?g.background:null;return x&&x.isTexture&&(x=(g.backgroundBlurriness>0?n:e).get(x)),x}function y(g){let x=!1;const _=v(g);_===null?u(a,l):_&&_.isColor&&(u(_,1),x=!0);const P=t.xr.getEnvironmentBlendMode();P==="additive"?i.buffers.color.setClear(0,0,0,1,o):P==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(t.autoClear||x)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil))}function m(g,x){const _=v(x);_&&(_.isCubeTexture||_.mapping===xc)?(d===void 0&&(d=new lt(new xa(1,1,1),new vt({name:"BackgroundCubeMaterial",uniforms:qs(si.backgroundCube.uniforms),vertexShader:si.backgroundCube.vertexShader,fragmentShader:si.backgroundCube.fragmentShader,side:Lt,depthTest:!1,depthWrite:!1,fog:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(P,T,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(d)),yr.copy(x.backgroundRotation),yr.x*=-1,yr.y*=-1,yr.z*=-1,_.isCubeTexture&&_.isRenderTargetTexture===!1&&(yr.y*=-1,yr.z*=-1),d.material.uniforms.envMap.value=_,d.material.uniforms.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(Vw.makeRotationFromEuler(yr)),d.material.toneMapped=qe.getTransfer(_.colorSpace)!==ot,(h!==_||f!==_.version||p!==t.toneMapping)&&(d.material.needsUpdate=!0,h=_,f=_.version,p=t.toneMapping),d.layers.enableAll(),g.unshift(d,d.geometry,d.material,0,0,null)):_&&_.isTexture&&(c===void 0&&(c=new lt(new jr(2,2),new vt({name:"BackgroundMaterial",uniforms:qs(si.background.uniforms),vertexShader:si.background.vertexShader,fragmentShader:si.background.fragmentShader,side:ur,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=_,c.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,c.material.toneMapped=qe.getTransfer(_.colorSpace)!==ot,_.matrixAutoUpdate===!0&&_.updateMatrix(),c.material.uniforms.uvTransform.value.copy(_.matrix),(h!==_||f!==_.version||p!==t.toneMapping)&&(c.material.needsUpdate=!0,h=_,f=_.version,p=t.toneMapping),c.layers.enableAll(),g.unshift(c,c.geometry,c.material,0,0,null))}function u(g,x){g.getRGB(nl,Vv(t)),i.buffers.color.setClear(nl.r,nl.g,nl.b,x,o)}return{getClearColor:function(){return a},setClearColor:function(g,x=1){a.set(g),l=x,u(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(g){l=g,u(a,l)},render:y,addToRenderList:m}}function Ww(t,e){const n=t.getParameter(t.MAX_VERTEX_ATTRIBS),i={},r=f(null);let s=r,o=!1;function a(M,D,V,z,X){let Z=!1;const Y=h(z,V,D);s!==Y&&(s=Y,c(s.object)),Z=p(M,z,V,X),Z&&v(M,z,V,X),X!==null&&e.update(X,t.ELEMENT_ARRAY_BUFFER),(Z||o)&&(o=!1,_(M,D,V,z),X!==null&&t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,e.get(X).buffer))}function l(){return t.createVertexArray()}function c(M){return t.bindVertexArray(M)}function d(M){return t.deleteVertexArray(M)}function h(M,D,V){const z=V.wireframe===!0;let X=i[M.id];X===void 0&&(X={},i[M.id]=X);let Z=X[D.id];Z===void 0&&(Z={},X[D.id]=Z);let Y=Z[z];return Y===void 0&&(Y=f(l()),Z[z]=Y),Y}function f(M){const D=[],V=[],z=[];for(let X=0;X<n;X++)D[X]=0,V[X]=0,z[X]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:V,attributeDivisors:z,object:M,attributes:{},index:null}}function p(M,D,V,z){const X=s.attributes,Z=D.attributes;let Y=0;const te=V.getAttributes();for(const N in te)if(te[N].location>=0){const Q=X[N];let oe=Z[N];if(oe===void 0&&(N==="instanceMatrix"&&M.instanceMatrix&&(oe=M.instanceMatrix),N==="instanceColor"&&M.instanceColor&&(oe=M.instanceColor)),Q===void 0||Q.attribute!==oe||oe&&Q.data!==oe.data)return!0;Y++}return s.attributesNum!==Y||s.index!==z}function v(M,D,V,z){const X={},Z=D.attributes;let Y=0;const te=V.getAttributes();for(const N in te)if(te[N].location>=0){let Q=Z[N];Q===void 0&&(N==="instanceMatrix"&&M.instanceMatrix&&(Q=M.instanceMatrix),N==="instanceColor"&&M.instanceColor&&(Q=M.instanceColor));const oe={};oe.attribute=Q,Q&&Q.data&&(oe.data=Q.data),X[N]=oe,Y++}s.attributes=X,s.attributesNum=Y,s.index=z}function y(){const M=s.newAttributes;for(let D=0,V=M.length;D<V;D++)M[D]=0}function m(M){u(M,0)}function u(M,D){const V=s.newAttributes,z=s.enabledAttributes,X=s.attributeDivisors;V[M]=1,z[M]===0&&(t.enableVertexAttribArray(M),z[M]=1),X[M]!==D&&(t.vertexAttribDivisor(M,D),X[M]=D)}function g(){const M=s.newAttributes,D=s.enabledAttributes;for(let V=0,z=D.length;V<z;V++)D[V]!==M[V]&&(t.disableVertexAttribArray(V),D[V]=0)}function x(M,D,V,z,X,Z,Y){Y===!0?t.vertexAttribIPointer(M,D,V,X,Z):t.vertexAttribPointer(M,D,V,z,X,Z)}function _(M,D,V,z){y();const X=z.attributes,Z=V.getAttributes(),Y=D.defaultAttributeValues;for(const te in Z){const N=Z[te];if(N.location>=0){let $=X[te];if($===void 0&&(te==="instanceMatrix"&&M.instanceMatrix&&($=M.instanceMatrix),te==="instanceColor"&&M.instanceColor&&($=M.instanceColor)),$!==void 0){const Q=$.normalized,oe=$.itemSize,_e=e.get($);if(_e===void 0)continue;const Ve=_e.buffer,K=_e.type,ne=_e.bytesPerElement,ce=K===t.INT||K===t.UNSIGNED_INT||$.gpuType===cf;if($.isInterleavedBufferAttribute){const ae=$.data,Ce=ae.stride,Le=$.offset;if(ae.isInstancedInterleavedBuffer){for(let Ue=0;Ue<N.locationSize;Ue++)u(N.location+Ue,ae.meshPerAttribute);M.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=ae.meshPerAttribute*ae.count)}else for(let Ue=0;Ue<N.locationSize;Ue++)m(N.location+Ue);t.bindBuffer(t.ARRAY_BUFFER,Ve);for(let Ue=0;Ue<N.locationSize;Ue++)x(N.location+Ue,oe/N.locationSize,K,Q,Ce*ne,(Le+oe/N.locationSize*Ue)*ne,ce)}else{if($.isInstancedBufferAttribute){for(let ae=0;ae<N.locationSize;ae++)u(N.location+ae,$.meshPerAttribute);M.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=$.meshPerAttribute*$.count)}else for(let ae=0;ae<N.locationSize;ae++)m(N.location+ae);t.bindBuffer(t.ARRAY_BUFFER,Ve);for(let ae=0;ae<N.locationSize;ae++)x(N.location+ae,oe/N.locationSize,K,Q,oe*ne,oe/N.locationSize*ae*ne,ce)}}else if(Y!==void 0){const Q=Y[te];if(Q!==void 0)switch(Q.length){case 2:t.vertexAttrib2fv(N.location,Q);break;case 3:t.vertexAttrib3fv(N.location,Q);break;case 4:t.vertexAttrib4fv(N.location,Q);break;default:t.vertexAttrib1fv(N.location,Q)}}}}g()}function P(){b();for(const M in i){const D=i[M];for(const V in D){const z=D[V];for(const X in z)d(z[X].object),delete z[X];delete D[V]}delete i[M]}}function T(M){if(i[M.id]===void 0)return;const D=i[M.id];for(const V in D){const z=D[V];for(const X in z)d(z[X].object),delete z[X];delete D[V]}delete i[M.id]}function A(M){for(const D in i){const V=i[D];if(V[M.id]===void 0)continue;const z=V[M.id];for(const X in z)d(z[X].object),delete z[X];delete V[M.id]}}function b(){w(),o=!0,s!==r&&(s=r,c(s.object))}function w(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:b,resetDefaultState:w,dispose:P,releaseStatesOfGeometry:T,releaseStatesOfProgram:A,initAttributes:y,enableAttribute:m,disableUnusedAttributes:g}}function jw(t,e,n){let i;function r(c){i=c}function s(c,d){t.drawArrays(i,c,d),n.update(d,i,1)}function o(c,d,h){h!==0&&(t.drawArraysInstanced(i,c,d,h),n.update(d,i,h))}function a(c,d,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,d,0,h);let p=0;for(let v=0;v<h;v++)p+=d[v];n.update(p,i,1)}function l(c,d,h,f){if(h===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let v=0;v<c.length;v++)o(c[v],d[v],f[v]);else{p.multiDrawArraysInstancedWEBGL(i,c,0,d,0,f,0,h);let v=0;for(let y=0;y<h;y++)v+=d[y]*f[y];n.update(v,i,1)}}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function Xw(t,e,n,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const A=e.get("EXT_texture_filter_anisotropic");r=t.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(A){return!(A!==Zn&&i.convert(A)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(A){const b=A===ga&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==Ri&&i.convert(A)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==ai&&!b)}function l(A){if(A==="highp"){if(t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.HIGH_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.MEDIUM_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=n.precision!==void 0?n.precision:"highp";const d=l(c);d!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",d,"instead."),c=d);const h=n.logarithmicDepthBuffer===!0,f=n.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),p=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),v=t.getParameter(t.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=t.getParameter(t.MAX_TEXTURE_SIZE),m=t.getParameter(t.MAX_CUBE_MAP_TEXTURE_SIZE),u=t.getParameter(t.MAX_VERTEX_ATTRIBS),g=t.getParameter(t.MAX_VERTEX_UNIFORM_VECTORS),x=t.getParameter(t.MAX_VARYING_VECTORS),_=t.getParameter(t.MAX_FRAGMENT_UNIFORM_VECTORS),P=v>0,T=t.getParameter(t.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:h,reverseDepthBuffer:f,maxTextures:p,maxVertexTextures:v,maxTextureSize:y,maxCubemapSize:m,maxAttributes:u,maxVertexUniforms:g,maxVaryings:x,maxFragmentUniforms:_,vertexTextures:P,maxSamples:T}}function Kw(t){const e=this;let n=null,i=0,r=!1,s=!1;const o=new Er,a=new ke,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,f){const p=h.length!==0||f||i!==0||r;return r=f,i=h.length,p},this.beginShadows=function(){s=!0,d(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,f){n=d(h,f,0)},this.setState=function(h,f,p){const v=h.clippingPlanes,y=h.clipIntersection,m=h.clipShadows,u=t.get(h);if(!r||v===null||v.length===0||s&&!m)s?d(null):c();else{const g=s?0:i,x=g*4;let _=u.clippingState||null;l.value=_,_=d(v,f,x,p);for(let P=0;P!==x;++P)_[P]=n[P];u.clippingState=_,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=g}};function c(){l.value!==n&&(l.value=n,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function d(h,f,p,v){const y=h!==null?h.length:0;let m=null;if(y!==0){if(m=l.value,v!==!0||m===null){const u=p+y*4,g=f.matrixWorldInverse;a.getNormalMatrix(g),(m===null||m.length<u)&&(m=new Float32Array(u));for(let x=0,_=p;x!==y;++x,_+=4)o.copy(h[x]).applyMatrix4(g,a),o.normal.toArray(m,_),m[_+3]=o.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=y,e.numIntersection=0,m}}function Yw(t){let e=new WeakMap;function n(o,a){return a===Nd?o.mapping=js:a===Ld&&(o.mapping=Xs),o}function i(o){if(o&&o.isTexture){const a=o.mapping;if(a===Nd||a===Ld)if(e.has(o)){const l=e.get(o).texture;return n(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new sS(l.height);return c.fromEquirectangularTexture(t,o),e.set(o,c),o.addEventListener("dispose",r),n(c.texture,o.mapping)}else return null}}return o}function r(o){const a=o.target;a.removeEventListener("dispose",r);const l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}class qw extends Gv{constructor(e=-1,n=1,i=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=n,this.top=i,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,n,i,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,o=i+e,a=r+n,l=r-n;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,a-=d*this.view.offsetY,l=a-d*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}}const bs=4,vm=[.125,.215,.35,.446,.526,.582],br=20,gu=new qw,xm=new me;let vu=null,xu=0,_u=0,yu=!1;const Tr=(1+Math.sqrt(5))/2,hs=1/Tr,_m=[new R(-Tr,hs,0),new R(Tr,hs,0),new R(-hs,0,Tr),new R(hs,0,Tr),new R(0,Tr,-hs),new R(0,Tr,hs),new R(-1,1,-1),new R(1,1,-1),new R(-1,1,1),new R(1,1,1)];class ym{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,n=0,i=.1,r=100){vu=this._renderer.getRenderTarget(),xu=this._renderer.getActiveCubeFace(),_u=this._renderer.getActiveMipmapLevel(),yu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,i,r,s),n>0&&this._blur(s,0,0,n),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,n=null){return this._fromTexture(e,n)}fromCubemap(e,n=null){return this._fromTexture(e,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=wm(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Sm(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(vu,xu,_u),this._renderer.xr.enabled=yu,e.scissorTest=!1,il(e,0,0,e.width,e.height)}_fromTexture(e,n){e.mapping===js||e.mapping===Xs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),vu=this._renderer.getRenderTarget(),xu=this._renderer.getActiveCubeFace(),_u=this._renderer.getActiveMipmapLevel(),yu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=n||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,i={magFilter:fn,minFilter:fn,generateMipmaps:!1,type:ga,format:Zn,colorSpace:eo,depthBuffer:!1},r=Mm(e,n,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Mm(e,n,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=$w(s)),this._blurMaterial=Zw(s,e,n)}return r}_compileMaterial(e){const n=new lt(this._lodPlanes[0],e);this._renderer.compile(n,gu)}_sceneToCubeUV(e,n,i,r){const a=new Sn(90,1,n,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],d=this._renderer,h=d.autoClear,f=d.toneMapping;d.getClearColor(xm),d.toneMapping=or,d.autoClear=!1;const p=new xf({name:"PMREM.Background",side:Lt,depthWrite:!1,depthTest:!1}),v=new lt(new xa,p);let y=!1;const m=e.background;m?m.isColor&&(p.color.copy(m),e.background=null,y=!0):(p.color.copy(xm),y=!0);for(let u=0;u<6;u++){const g=u%3;g===0?(a.up.set(0,l[u],0),a.lookAt(c[u],0,0)):g===1?(a.up.set(0,0,l[u]),a.lookAt(0,c[u],0)):(a.up.set(0,l[u],0),a.lookAt(0,0,c[u]));const x=this._cubeSize;il(r,g*x,u>2?x:0,x,x),d.setRenderTarget(r),y&&d.render(v,a),d.render(e,a)}v.geometry.dispose(),v.material.dispose(),d.toneMapping=f,d.autoClear=h,e.background=m}_textureToCubeUV(e,n){const i=this._renderer,r=e.mapping===js||e.mapping===Xs;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=wm()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Sm());const s=r?this._cubemapMaterial:this._equirectMaterial,o=new lt(this._lodPlanes[0],s),a=s.uniforms;a.envMap.value=e;const l=this._cubeSize;il(n,0,0,3*l,2*l),i.setRenderTarget(n),i.render(o,gu)}_applyPMREM(e){const n=this._renderer,i=n.autoClear;n.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=_m[(r-s-1)%_m.length];this._blur(e,s-1,s,o,a)}n.autoClear=i}_blur(e,n,i,r,s){const o=this._pingPongRenderTarget;this._halfBlur(e,o,n,i,r,"latitudinal",s),this._halfBlur(o,e,i,i,r,"longitudinal",s)}_halfBlur(e,n,i,r,s,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const d=3,h=new lt(this._lodPlanes[r],c),f=c.uniforms,p=this._sizeLods[i]-1,v=isFinite(s)?Math.PI/(2*p):2*Math.PI/(2*br-1),y=s/v,m=isFinite(s)?1+Math.floor(d*y):br;m>br&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${br}`);const u=[];let g=0;for(let A=0;A<br;++A){const b=A/y,w=Math.exp(-b*b/2);u.push(w),A===0?g+=w:A<m&&(g+=2*w)}for(let A=0;A<u.length;A++)u[A]=u[A]/g;f.envMap.value=e.texture,f.samples.value=m,f.weights.value=u,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);const{_lodMax:x}=this;f.dTheta.value=v,f.mipInt.value=x-i;const _=this._sizeLods[r],P=3*_*(r>x-bs?r-x+bs:0),T=4*(this._cubeSize-_);il(n,P,T,3*_,2*_),l.setRenderTarget(n),l.render(h,gu)}}function $w(t){const e=[],n=[],i=[];let r=t;const s=t-bs+1+vm.length;for(let o=0;o<s;o++){const a=Math.pow(2,r);n.push(a);let l=1/a;o>t-bs?l=vm[o-t+bs-1]:o===0&&(l=0),i.push(l);const c=1/(a-2),d=-c,h=1+c,f=[d,d,h,d,h,h,d,d,h,h,d,h],p=6,v=6,y=3,m=2,u=1,g=new Float32Array(y*v*p),x=new Float32Array(m*v*p),_=new Float32Array(u*v*p);for(let T=0;T<p;T++){const A=T%3*2/3-1,b=T>2?0:-1,w=[A,b,0,A+2/3,b,0,A+2/3,b+1,0,A,b,0,A+2/3,b+1,0,A,b+1,0];g.set(w,y*v*T),x.set(f,m*v*T);const M=[T,T,T,T,T,T];_.set(M,u*v*T)}const P=new ct;P.setAttribute("position",new Je(g,y)),P.setAttribute("uv",new Je(x,m)),P.setAttribute("faceIndex",new Je(_,u)),e.push(P),r>bs&&r--}return{lodPlanes:e,sizeLods:n,sigmas:i}}function Mm(t,e,n){const i=new Wr(t,e,n);return i.texture.mapping=xc,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function il(t,e,n,i,r){t.viewport.set(e,n,i,r),t.scissor.set(e,n,i,r)}function Zw(t,e,n){const i=new Float32Array(br),r=new R(0,1,0);return new vt({name:"SphericalGaussianBlur",defines:{n:br,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:yf(),fragmentShader:`

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
		`,blending:rr,depthTest:!1,depthWrite:!1})}function Sm(){return new vt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:yf(),fragmentShader:`

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
		`,blending:rr,depthTest:!1,depthWrite:!1})}function wm(){return new vt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:yf(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:rr,depthTest:!1,depthWrite:!1})}function yf(){return`

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
	`}function Qw(t){let e=new WeakMap,n=null;function i(a){if(a&&a.isTexture){const l=a.mapping,c=l===Nd||l===Ld,d=l===js||l===Xs;if(c||d){let h=e.get(a);const f=h!==void 0?h.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==f)return n===null&&(n=new ym(t)),h=c?n.fromEquirectangular(a,h):n.fromCubemap(a,h),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),h.texture;if(h!==void 0)return h.texture;{const p=a.image;return c&&p&&p.height>0||d&&p&&r(p)?(n===null&&(n=new ym(t)),h=c?n.fromEquirectangular(a):n.fromCubemap(a),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),a.addEventListener("dispose",s),h.texture):null}}}return a}function r(a){let l=0;const c=6;for(let d=0;d<c;d++)a[d]!==void 0&&l++;return l===c}function s(a){const l=a.target;l.removeEventListener("dispose",s);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:o}}function Jw(t){const e={};function n(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=t.getExtension("WEBGL_depth_texture")||t.getExtension("MOZ_WEBGL_depth_texture")||t.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=t.getExtension("EXT_texture_filter_anisotropic")||t.getExtension("MOZ_EXT_texture_filter_anisotropic")||t.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=t.getExtension("WEBGL_compressed_texture_s3tc")||t.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=t.getExtension("WEBGL_compressed_texture_pvrtc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=t.getExtension(i)}return e[i]=r,r}return{has:function(i){return n(i)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(i){const r=n(i);return r===null&&Co("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function eE(t,e,n,i){const r={},s=new WeakMap;function o(h){const f=h.target;f.index!==null&&e.remove(f.index);for(const v in f.attributes)e.remove(f.attributes[v]);for(const v in f.morphAttributes){const y=f.morphAttributes[v];for(let m=0,u=y.length;m<u;m++)e.remove(y[m])}f.removeEventListener("dispose",o),delete r[f.id];const p=s.get(f);p&&(e.remove(p),s.delete(f)),i.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,n.memory.geometries--}function a(h,f){return r[f.id]===!0||(f.addEventListener("dispose",o),r[f.id]=!0,n.memory.geometries++),f}function l(h){const f=h.attributes;for(const v in f)e.update(f[v],t.ARRAY_BUFFER);const p=h.morphAttributes;for(const v in p){const y=p[v];for(let m=0,u=y.length;m<u;m++)e.update(y[m],t.ARRAY_BUFFER)}}function c(h){const f=[],p=h.index,v=h.attributes.position;let y=0;if(p!==null){const g=p.array;y=p.version;for(let x=0,_=g.length;x<_;x+=3){const P=g[x+0],T=g[x+1],A=g[x+2];f.push(P,T,T,A,A,P)}}else if(v!==void 0){const g=v.array;y=v.version;for(let x=0,_=g.length/3-1;x<_;x+=3){const P=x+0,T=x+1,A=x+2;f.push(P,T,T,A,A,P)}}else return;const m=new(Ov(f)?Hv:zv)(f,1);m.version=y;const u=s.get(h);u&&e.remove(u),s.set(h,m)}function d(h){const f=s.get(h);if(f){const p=h.index;p!==null&&f.version<p.version&&c(h)}else c(h);return s.get(h)}return{get:a,update:l,getWireframeAttribute:d}}function tE(t,e,n){let i;function r(f){i=f}let s,o;function a(f){s=f.type,o=f.bytesPerElement}function l(f,p){t.drawElements(i,p,s,f*o),n.update(p,i,1)}function c(f,p,v){v!==0&&(t.drawElementsInstanced(i,p,s,f*o,v),n.update(p,i,v))}function d(f,p,v){if(v===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,p,0,s,f,0,v);let m=0;for(let u=0;u<v;u++)m+=p[u];n.update(m,i,1)}function h(f,p,v,y){if(v===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let u=0;u<f.length;u++)c(f[u]/o,p[u],y[u]);else{m.multiDrawElementsInstancedWEBGL(i,p,0,s,f,0,y,0,v);let u=0;for(let g=0;g<v;g++)u+=p[g]*y[g];n.update(u,i,1)}}this.setMode=r,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=d,this.renderMultiDrawInstances=h}function nE(t){const e={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,a){switch(n.calls++,o){case t.TRIANGLES:n.triangles+=a*(s/3);break;case t.LINES:n.lines+=a*(s/2);break;case t.LINE_STRIP:n.lines+=a*(s-1);break;case t.LINE_LOOP:n.lines+=a*s;break;case t.POINTS:n.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function r(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:e,render:n,programs:null,autoReset:!0,reset:r,update:i}}function iE(t,e,n){const i=new WeakMap,r=new at;function s(o,a,l){const c=o.morphTargetInfluences,d=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=d!==void 0?d.length:0;let f=i.get(a);if(f===void 0||f.count!==h){let w=function(){A.dispose(),i.delete(a),a.removeEventListener("dispose",w)};f!==void 0&&f.texture.dispose();const p=a.morphAttributes.position!==void 0,v=a.morphAttributes.normal!==void 0,y=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],u=a.morphAttributes.normal||[],g=a.morphAttributes.color||[];let x=0;p===!0&&(x=1),v===!0&&(x=2),y===!0&&(x=3);let _=a.attributes.position.count*x,P=1;_>e.maxTextureSize&&(P=Math.ceil(_/e.maxTextureSize),_=e.maxTextureSize);const T=new Float32Array(_*P*4*h),A=new kv(T,_,P,h);A.type=ai,A.needsUpdate=!0;const b=x*4;for(let M=0;M<h;M++){const D=m[M],V=u[M],z=g[M],X=_*P*4*M;for(let Z=0;Z<D.count;Z++){const Y=Z*b;p===!0&&(r.fromBufferAttribute(D,Z),T[X+Y+0]=r.x,T[X+Y+1]=r.y,T[X+Y+2]=r.z,T[X+Y+3]=0),v===!0&&(r.fromBufferAttribute(V,Z),T[X+Y+4]=r.x,T[X+Y+5]=r.y,T[X+Y+6]=r.z,T[X+Y+7]=0),y===!0&&(r.fromBufferAttribute(z,Z),T[X+Y+8]=r.x,T[X+Y+9]=r.y,T[X+Y+10]=r.z,T[X+Y+11]=z.itemSize===4?r.w:1)}}f={count:h,texture:A,size:new He(_,P)},i.set(a,f),a.addEventListener("dispose",w)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(t,"morphTexture",o.morphTexture,n);else{let p=0;for(let y=0;y<c.length;y++)p+=c[y];const v=a.morphTargetsRelative?1:1-p;l.getUniforms().setValue(t,"morphTargetBaseInfluence",v),l.getUniforms().setValue(t,"morphTargetInfluences",c)}l.getUniforms().setValue(t,"morphTargetsTexture",f.texture,n),l.getUniforms().setValue(t,"morphTargetsTextureSize",f.size)}return{update:s}}function rE(t,e,n,i){let r=new WeakMap;function s(l){const c=i.render.frame,d=l.geometry,h=e.get(l,d);if(r.get(h)!==c&&(e.update(h),r.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),r.get(l)!==c&&(n.update(l.instanceMatrix,t.ARRAY_BUFFER),l.instanceColor!==null&&n.update(l.instanceColor,t.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const f=l.skeleton;r.get(f)!==c&&(f.update(),r.set(f,c))}return h}function o(){r=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),n.remove(c.instanceMatrix),c.instanceColor!==null&&n.remove(c.instanceColor)}return{update:s,dispose:o}}class Xv extends zt{constructor(e,n,i,r,s,o,a,l,c,d=Us){if(d!==Us&&d!==Ys)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&d===Us&&(i=Gr),i===void 0&&d===Ys&&(i=Ks),super(null,r,s,o,a,l,d,i,c),this.isDepthTexture=!0,this.image={width:e,height:n},this.magFilter=a!==void 0?a:An,this.minFilter=l!==void 0?l:An,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const n=super.toJSON(e);return this.compareFunction!==null&&(n.compareFunction=this.compareFunction),n}}const Kv=new zt,Em=new Xv(1,1),Yv=new kv,qv=new GM,$v=new Wv,Tm=[],Am=[],bm=new Float32Array(16),Cm=new Float32Array(9),Pm=new Float32Array(4);function io(t,e,n){const i=t[0];if(i<=0||i>0)return t;const r=e*n;let s=Tm[r];if(s===void 0&&(s=new Float32Array(r),Tm[r]=s),e!==0){i.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=n,t[o].toArray(s,a)}return s}function Ut(t,e){if(t.length!==e.length)return!1;for(let n=0,i=t.length;n<i;n++)if(t[n]!==e[n])return!1;return!0}function Ot(t,e){for(let n=0,i=e.length;n<i;n++)t[n]=e[n]}function Mc(t,e){let n=Am[e];n===void 0&&(n=new Int32Array(e),Am[e]=n);for(let i=0;i!==e;++i)n[i]=t.allocateTextureUnit();return n}function sE(t,e){const n=this.cache;n[0]!==e&&(t.uniform1f(this.addr,e),n[0]=e)}function oE(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2f(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Ut(n,e))return;t.uniform2fv(this.addr,e),Ot(n,e)}}function aE(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3f(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else if(e.r!==void 0)(n[0]!==e.r||n[1]!==e.g||n[2]!==e.b)&&(t.uniform3f(this.addr,e.r,e.g,e.b),n[0]=e.r,n[1]=e.g,n[2]=e.b);else{if(Ut(n,e))return;t.uniform3fv(this.addr,e),Ot(n,e)}}function lE(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4f(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Ut(n,e))return;t.uniform4fv(this.addr,e),Ot(n,e)}}function cE(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Ut(n,e))return;t.uniformMatrix2fv(this.addr,!1,e),Ot(n,e)}else{if(Ut(n,i))return;Pm.set(i),t.uniformMatrix2fv(this.addr,!1,Pm),Ot(n,i)}}function uE(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Ut(n,e))return;t.uniformMatrix3fv(this.addr,!1,e),Ot(n,e)}else{if(Ut(n,i))return;Cm.set(i),t.uniformMatrix3fv(this.addr,!1,Cm),Ot(n,i)}}function dE(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Ut(n,e))return;t.uniformMatrix4fv(this.addr,!1,e),Ot(n,e)}else{if(Ut(n,i))return;bm.set(i),t.uniformMatrix4fv(this.addr,!1,bm),Ot(n,i)}}function hE(t,e){const n=this.cache;n[0]!==e&&(t.uniform1i(this.addr,e),n[0]=e)}function fE(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2i(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Ut(n,e))return;t.uniform2iv(this.addr,e),Ot(n,e)}}function pE(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3i(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(Ut(n,e))return;t.uniform3iv(this.addr,e),Ot(n,e)}}function mE(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4i(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Ut(n,e))return;t.uniform4iv(this.addr,e),Ot(n,e)}}function gE(t,e){const n=this.cache;n[0]!==e&&(t.uniform1ui(this.addr,e),n[0]=e)}function vE(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2ui(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Ut(n,e))return;t.uniform2uiv(this.addr,e),Ot(n,e)}}function xE(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3ui(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(Ut(n,e))return;t.uniform3uiv(this.addr,e),Ot(n,e)}}function _E(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4ui(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Ut(n,e))return;t.uniform4uiv(this.addr,e),Ot(n,e)}}function yE(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r);let s;this.type===t.SAMPLER_2D_SHADOW?(Em.compareFunction=Uv,s=Em):s=Kv,n.setTexture2D(e||s,r)}function ME(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture3D(e||qv,r)}function SE(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTextureCube(e||$v,r)}function wE(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture2DArray(e||Yv,r)}function EE(t){switch(t){case 5126:return sE;case 35664:return oE;case 35665:return aE;case 35666:return lE;case 35674:return cE;case 35675:return uE;case 35676:return dE;case 5124:case 35670:return hE;case 35667:case 35671:return fE;case 35668:case 35672:return pE;case 35669:case 35673:return mE;case 5125:return gE;case 36294:return vE;case 36295:return xE;case 36296:return _E;case 35678:case 36198:case 36298:case 36306:case 35682:return yE;case 35679:case 36299:case 36307:return ME;case 35680:case 36300:case 36308:case 36293:return SE;case 36289:case 36303:case 36311:case 36292:return wE}}function TE(t,e){t.uniform1fv(this.addr,e)}function AE(t,e){const n=io(e,this.size,2);t.uniform2fv(this.addr,n)}function bE(t,e){const n=io(e,this.size,3);t.uniform3fv(this.addr,n)}function CE(t,e){const n=io(e,this.size,4);t.uniform4fv(this.addr,n)}function PE(t,e){const n=io(e,this.size,4);t.uniformMatrix2fv(this.addr,!1,n)}function RE(t,e){const n=io(e,this.size,9);t.uniformMatrix3fv(this.addr,!1,n)}function DE(t,e){const n=io(e,this.size,16);t.uniformMatrix4fv(this.addr,!1,n)}function NE(t,e){t.uniform1iv(this.addr,e)}function LE(t,e){t.uniform2iv(this.addr,e)}function IE(t,e){t.uniform3iv(this.addr,e)}function UE(t,e){t.uniform4iv(this.addr,e)}function OE(t,e){t.uniform1uiv(this.addr,e)}function FE(t,e){t.uniform2uiv(this.addr,e)}function kE(t,e){t.uniform3uiv(this.addr,e)}function BE(t,e){t.uniform4uiv(this.addr,e)}function zE(t,e,n){const i=this.cache,r=e.length,s=Mc(n,r);Ut(i,s)||(t.uniform1iv(this.addr,s),Ot(i,s));for(let o=0;o!==r;++o)n.setTexture2D(e[o]||Kv,s[o])}function HE(t,e,n){const i=this.cache,r=e.length,s=Mc(n,r);Ut(i,s)||(t.uniform1iv(this.addr,s),Ot(i,s));for(let o=0;o!==r;++o)n.setTexture3D(e[o]||qv,s[o])}function VE(t,e,n){const i=this.cache,r=e.length,s=Mc(n,r);Ut(i,s)||(t.uniform1iv(this.addr,s),Ot(i,s));for(let o=0;o!==r;++o)n.setTextureCube(e[o]||$v,s[o])}function GE(t,e,n){const i=this.cache,r=e.length,s=Mc(n,r);Ut(i,s)||(t.uniform1iv(this.addr,s),Ot(i,s));for(let o=0;o!==r;++o)n.setTexture2DArray(e[o]||Yv,s[o])}function WE(t){switch(t){case 5126:return TE;case 35664:return AE;case 35665:return bE;case 35666:return CE;case 35674:return PE;case 35675:return RE;case 35676:return DE;case 5124:case 35670:return NE;case 35667:case 35671:return LE;case 35668:case 35672:return IE;case 35669:case 35673:return UE;case 5125:return OE;case 36294:return FE;case 36295:return kE;case 36296:return BE;case 35678:case 36198:case 36298:case 36306:case 35682:return zE;case 35679:case 36299:case 36307:return HE;case 35680:case 36300:case 36308:case 36293:return VE;case 36289:case 36303:case 36311:case 36292:return GE}}class jE{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.setValue=EE(n.type)}}class XE{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=WE(n.type)}}class KE{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,n,i){const r=this.seq;for(let s=0,o=r.length;s!==o;++s){const a=r[s];a.setValue(e,n[a.id],i)}}}const Mu=/(\w+)(\])?(\[|\.)?/g;function Rm(t,e){t.seq.push(e),t.map[e.id]=e}function YE(t,e,n){const i=t.name,r=i.length;for(Mu.lastIndex=0;;){const s=Mu.exec(i),o=Mu.lastIndex;let a=s[1];const l=s[2]==="]",c=s[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===r){Rm(n,c===void 0?new jE(a,t,e):new XE(a,t,e));break}else{let h=n.map[a];h===void 0&&(h=new KE(a),Rm(n,h)),n=h}}}class bl{constructor(e,n){this.seq=[],this.map={};const i=e.getProgramParameter(n,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const s=e.getActiveUniform(n,r),o=e.getUniformLocation(n,s.name);YE(s,o,this)}}setValue(e,n,i,r){const s=this.map[n];s!==void 0&&s.setValue(e,i,r)}setOptional(e,n,i){const r=n[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,n,i,r){for(let s=0,o=n.length;s!==o;++s){const a=n[s],l=i[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,r)}}static seqWithValue(e,n){const i=[];for(let r=0,s=e.length;r!==s;++r){const o=e[r];o.id in n&&i.push(o)}return i}}function Dm(t,e,n){const i=t.createShader(e);return t.shaderSource(i,n),t.compileShader(i),i}const qE=37297;let $E=0;function ZE(t,e){const n=t.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,n.length);for(let o=r;o<s;o++){const a=o+1;i.push(`${a===e?">":" "} ${a}: ${n[o]}`)}return i.join(`
`)}const Nm=new ke;function QE(t){qe._getMatrix(Nm,qe.workingColorSpace,t);const e=`mat3( ${Nm.elements.map(n=>n.toFixed(4))} )`;switch(qe.getTransfer(t)){case _c:return[e,"LinearTransferOETF"];case ot:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",t),[e,"LinearTransferOETF"]}}function Lm(t,e,n){const i=t.getShaderParameter(e,t.COMPILE_STATUS),r=t.getShaderInfoLog(e).trim();if(i&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const o=parseInt(s[1]);return n.toUpperCase()+`

`+r+`

`+ZE(t.getShaderSource(e),o)}else return r}function JE(t,e){const n=QE(e);return[`vec4 ${t}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,"}"].join(`
`)}function e2(t,e){let n;switch(e){case nM:n="Linear";break;case iM:n="Reinhard";break;case rM:n="Cineon";break;case wv:n="ACESFilmic";break;case oM:n="AgX";break;case aM:n="Neutral";break;case sM:n="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),n="Linear"}return"vec3 "+t+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}const rl=new R;function t2(){qe.getLuminanceCoefficients(rl);const t=rl.x.toFixed(4),e=rl.y.toFixed(4),n=rl.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${t}, ${e}, ${n} );`,"	return dot( weights, rgb );","}"].join(`
`)}function n2(t){return[t.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",t.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Po).join(`
`)}function i2(t){const e=[];for(const n in t){const i=t[n];i!==!1&&e.push("#define "+n+" "+i)}return e.join(`
`)}function r2(t,e){const n={},i=t.getProgramParameter(e,t.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=t.getActiveAttrib(e,r),o=s.name;let a=1;s.type===t.FLOAT_MAT2&&(a=2),s.type===t.FLOAT_MAT3&&(a=3),s.type===t.FLOAT_MAT4&&(a=4),n[o]={type:s.type,location:t.getAttribLocation(e,o),locationSize:a}}return n}function Po(t){return t!==""}function Im(t,e){const n=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return t.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Um(t,e){return t.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const s2=/^[ \t]*#include +<([\w\d./]+)>/gm;function ah(t){return t.replace(s2,a2)}const o2=new Map;function a2(t,e){let n=ze[e];if(n===void 0){const i=o2.get(e);if(i!==void 0)n=ze[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return ah(n)}const l2=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Om(t){return t.replace(l2,c2)}function c2(t,e,n,i){let r="";for(let s=parseInt(e);s<parseInt(n);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Fm(t){let e=`precision ${t.precision} float;
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
#define LOW_PRECISION`),e}function u2(t){let e="SHADOWMAP_TYPE_BASIC";return t.shadowMapType===Mv?e="SHADOWMAP_TYPE_PCF":t.shadowMapType===Uy?e="SHADOWMAP_TYPE_PCF_SOFT":t.shadowMapType===xi&&(e="SHADOWMAP_TYPE_VSM"),e}function d2(t){let e="ENVMAP_TYPE_CUBE";if(t.envMap)switch(t.envMapMode){case js:case Xs:e="ENVMAP_TYPE_CUBE";break;case xc:e="ENVMAP_TYPE_CUBE_UV";break}return e}function h2(t){let e="ENVMAP_MODE_REFLECTION";if(t.envMap)switch(t.envMapMode){case Xs:e="ENVMAP_MODE_REFRACTION";break}return e}function f2(t){let e="ENVMAP_BLENDING_NONE";if(t.envMap)switch(t.combine){case Sv:e="ENVMAP_BLENDING_MULTIPLY";break;case eM:e="ENVMAP_BLENDING_MIX";break;case tM:e="ENVMAP_BLENDING_ADD";break}return e}function p2(t){const e=t.envMapCubeUVHeight;if(e===null)return null;const n=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,n),7*16)),texelHeight:i,maxMip:n}}function m2(t,e,n,i){const r=t.getContext(),s=n.defines;let o=n.vertexShader,a=n.fragmentShader;const l=u2(n),c=d2(n),d=h2(n),h=f2(n),f=p2(n),p=n2(n),v=i2(s),y=r.createProgram();let m,u,g=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(m=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,v].filter(Po).join(`
`),m.length>0&&(m+=`
`),u=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,v].filter(Po).join(`
`),u.length>0&&(u+=`
`)):(m=[Fm(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,v,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+d:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Po).join(`
`),u=[Fm(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,v,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+c:"",n.envMap?"#define "+d:"",n.envMap?"#define "+h:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor||n.batchingColor?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==or?"#define TONE_MAPPING":"",n.toneMapping!==or?ze.tonemapping_pars_fragment:"",n.toneMapping!==or?e2("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",ze.colorspace_pars_fragment,JE("linearToOutputTexel",n.outputColorSpace),t2(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(Po).join(`
`)),o=ah(o),o=Im(o,n),o=Um(o,n),a=ah(a),a=Im(a,n),a=Um(a,n),o=Om(o),a=Om(a),n.isRawShaderMaterial!==!0&&(g=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,u=["#define varying in",n.glslVersion===qp?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===qp?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+u);const x=g+m+o,_=g+u+a,P=Dm(r,r.VERTEX_SHADER,x),T=Dm(r,r.FRAGMENT_SHADER,_);r.attachShader(y,P),r.attachShader(y,T),n.index0AttributeName!==void 0?r.bindAttribLocation(y,0,n.index0AttributeName):n.morphTargets===!0&&r.bindAttribLocation(y,0,"position"),r.linkProgram(y);function A(D){if(t.debug.checkShaderErrors){const V=r.getProgramInfoLog(y).trim(),z=r.getShaderInfoLog(P).trim(),X=r.getShaderInfoLog(T).trim();let Z=!0,Y=!0;if(r.getProgramParameter(y,r.LINK_STATUS)===!1)if(Z=!1,typeof t.debug.onShaderError=="function")t.debug.onShaderError(r,y,P,T);else{const te=Lm(r,P,"vertex"),N=Lm(r,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(y,r.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+V+`
`+te+`
`+N)}else V!==""?console.warn("THREE.WebGLProgram: Program Info Log:",V):(z===""||X==="")&&(Y=!1);Y&&(D.diagnostics={runnable:Z,programLog:V,vertexShader:{log:z,prefix:m},fragmentShader:{log:X,prefix:u}})}r.deleteShader(P),r.deleteShader(T),b=new bl(r,y),w=r2(r,y)}let b;this.getUniforms=function(){return b===void 0&&A(this),b};let w;this.getAttributes=function(){return w===void 0&&A(this),w};let M=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=r.getProgramParameter(y,qE)),M},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(y),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=$E++,this.cacheKey=e,this.usedTimes=1,this.program=y,this.vertexShader=P,this.fragmentShader=T,this}let g2=0;class v2{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const n=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(n),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(e);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(e){const n=this.materialCache.get(e);for(const i of n)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const n=this.materialCache;let i=n.get(e);return i===void 0&&(i=new Set,n.set(e,i)),i}_getShaderStage(e){const n=this.shaderCache;let i=n.get(e);return i===void 0&&(i=new x2(e),n.set(e,i)),i}}class x2{constructor(e){this.id=g2++,this.code=e,this.usedTimes=0}}function _2(t,e,n,i,r,s,o){const a=new vf,l=new v2,c=new Set,d=[],h=r.logarithmicDepthBuffer,f=r.vertexTextures;let p=r.precision;const v={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function y(w){return c.add(w),w===0?"uv":`uv${w}`}function m(w,M,D,V,z){const X=V.fog,Z=z.geometry,Y=w.isMeshStandardMaterial?V.environment:null,te=(w.isMeshStandardMaterial?n:e).get(w.envMap||Y),N=te&&te.mapping===xc?te.image.height:null,$=v[w.type];w.precision!==null&&(p=r.getMaxPrecision(w.precision),p!==w.precision&&console.warn("THREE.WebGLProgram.getParameters:",w.precision,"not supported, using",p,"instead."));const Q=Z.morphAttributes.position||Z.morphAttributes.normal||Z.morphAttributes.color,oe=Q!==void 0?Q.length:0;let _e=0;Z.morphAttributes.position!==void 0&&(_e=1),Z.morphAttributes.normal!==void 0&&(_e=2),Z.morphAttributes.color!==void 0&&(_e=3);let Ve,K,ne,ce;if($){const nt=si[$];Ve=nt.vertexShader,K=nt.fragmentShader}else Ve=w.vertexShader,K=w.fragmentShader,l.update(w),ne=l.getVertexShaderID(w),ce=l.getFragmentShaderID(w);const ae=t.getRenderTarget(),Ce=t.state.buffers.depth.getReversed(),Le=z.isInstancedMesh===!0,Ue=z.isBatchedMesh===!0,ut=!!w.map,We=!!w.matcap,Xe=!!te,I=!!w.aoMap,tn=!!w.lightMap,Pe=!!w.bumpMap,je=!!w.normalMap,be=!!w.displacementMap,st=!!w.emissiveMap,Ae=!!w.metalnessMap,C=!!w.roughnessMap,S=w.anisotropy>0,H=w.clearcoat>0,J=w.dispersion>0,L=w.iridescence>0,B=w.sheen>0,ge=w.transmission>0,ue=S&&!!w.anisotropyMap,ve=H&&!!w.clearcoatMap,Ye=H&&!!w.clearcoatNormalMap,re=H&&!!w.clearcoatRoughnessMap,ye=L&&!!w.iridescenceMap,Re=L&&!!w.iridescenceThicknessMap,Ne=B&&!!w.sheenColorMap,Me=B&&!!w.sheenRoughnessMap,Ke=!!w.specularMap,Be=!!w.specularColorMap,dt=!!w.specularIntensityMap,U=ge&&!!w.transmissionMap,de=ge&&!!w.thicknessMap,q=!!w.gradientMap,ee=!!w.alphaMap,pe=w.alphaTest>0,he=!!w.alphaHash,Oe=!!w.extensions;let Tt=or;w.toneMapped&&(ae===null||ae.isXRRenderTarget===!0)&&(Tt=t.toneMapping);const Xt={shaderID:$,shaderType:w.type,shaderName:w.name,vertexShader:Ve,fragmentShader:K,defines:w.defines,customVertexShaderID:ne,customFragmentShaderID:ce,isRawShaderMaterial:w.isRawShaderMaterial===!0,glslVersion:w.glslVersion,precision:p,batching:Ue,batchingColor:Ue&&z._colorsTexture!==null,instancing:Le,instancingColor:Le&&z.instanceColor!==null,instancingMorph:Le&&z.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:ae===null?t.outputColorSpace:ae.isXRRenderTarget===!0?ae.texture.colorSpace:eo,alphaToCoverage:!!w.alphaToCoverage,map:ut,matcap:We,envMap:Xe,envMapMode:Xe&&te.mapping,envMapCubeUVHeight:N,aoMap:I,lightMap:tn,bumpMap:Pe,normalMap:je,displacementMap:f&&be,emissiveMap:st,normalMapObjectSpace:je&&w.normalMapType===dM,normalMapTangentSpace:je&&w.normalMapType===Iv,metalnessMap:Ae,roughnessMap:C,anisotropy:S,anisotropyMap:ue,clearcoat:H,clearcoatMap:ve,clearcoatNormalMap:Ye,clearcoatRoughnessMap:re,dispersion:J,iridescence:L,iridescenceMap:ye,iridescenceThicknessMap:Re,sheen:B,sheenColorMap:Ne,sheenRoughnessMap:Me,specularMap:Ke,specularColorMap:Be,specularIntensityMap:dt,transmission:ge,transmissionMap:U,thicknessMap:de,gradientMap:q,opaque:w.transparent===!1&&w.blending===sr&&w.alphaToCoverage===!1,alphaMap:ee,alphaTest:pe,alphaHash:he,combine:w.combine,mapUv:ut&&y(w.map.channel),aoMapUv:I&&y(w.aoMap.channel),lightMapUv:tn&&y(w.lightMap.channel),bumpMapUv:Pe&&y(w.bumpMap.channel),normalMapUv:je&&y(w.normalMap.channel),displacementMapUv:be&&y(w.displacementMap.channel),emissiveMapUv:st&&y(w.emissiveMap.channel),metalnessMapUv:Ae&&y(w.metalnessMap.channel),roughnessMapUv:C&&y(w.roughnessMap.channel),anisotropyMapUv:ue&&y(w.anisotropyMap.channel),clearcoatMapUv:ve&&y(w.clearcoatMap.channel),clearcoatNormalMapUv:Ye&&y(w.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:re&&y(w.clearcoatRoughnessMap.channel),iridescenceMapUv:ye&&y(w.iridescenceMap.channel),iridescenceThicknessMapUv:Re&&y(w.iridescenceThicknessMap.channel),sheenColorMapUv:Ne&&y(w.sheenColorMap.channel),sheenRoughnessMapUv:Me&&y(w.sheenRoughnessMap.channel),specularMapUv:Ke&&y(w.specularMap.channel),specularColorMapUv:Be&&y(w.specularColorMap.channel),specularIntensityMapUv:dt&&y(w.specularIntensityMap.channel),transmissionMapUv:U&&y(w.transmissionMap.channel),thicknessMapUv:de&&y(w.thicknessMap.channel),alphaMapUv:ee&&y(w.alphaMap.channel),vertexTangents:!!Z.attributes.tangent&&(je||S),vertexColors:w.vertexColors,vertexAlphas:w.vertexColors===!0&&!!Z.attributes.color&&Z.attributes.color.itemSize===4,pointsUvs:z.isPoints===!0&&!!Z.attributes.uv&&(ut||ee),fog:!!X,useFog:w.fog===!0,fogExp2:!!X&&X.isFogExp2,flatShading:w.flatShading===!0,sizeAttenuation:w.sizeAttenuation===!0,logarithmicDepthBuffer:h,reverseDepthBuffer:Ce,skinning:z.isSkinnedMesh===!0,morphTargets:Z.morphAttributes.position!==void 0,morphNormals:Z.morphAttributes.normal!==void 0,morphColors:Z.morphAttributes.color!==void 0,morphTargetsCount:oe,morphTextureStride:_e,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:w.dithering,shadowMapEnabled:t.shadowMap.enabled&&D.length>0,shadowMapType:t.shadowMap.type,toneMapping:Tt,decodeVideoTexture:ut&&w.map.isVideoTexture===!0&&qe.getTransfer(w.map.colorSpace)===ot,decodeVideoTextureEmissive:st&&w.emissiveMap.isVideoTexture===!0&&qe.getTransfer(w.emissiveMap.colorSpace)===ot,premultipliedAlpha:w.premultipliedAlpha,doubleSided:w.side===wn,flipSided:w.side===Lt,useDepthPacking:w.depthPacking>=0,depthPacking:w.depthPacking||0,index0AttributeName:w.index0AttributeName,extensionClipCullDistance:Oe&&w.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Oe&&w.extensions.multiDraw===!0||Ue)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:w.customProgramCacheKey()};return Xt.vertexUv1s=c.has(1),Xt.vertexUv2s=c.has(2),Xt.vertexUv3s=c.has(3),c.clear(),Xt}function u(w){const M=[];if(w.shaderID?M.push(w.shaderID):(M.push(w.customVertexShaderID),M.push(w.customFragmentShaderID)),w.defines!==void 0)for(const D in w.defines)M.push(D),M.push(w.defines[D]);return w.isRawShaderMaterial===!1&&(g(M,w),x(M,w),M.push(t.outputColorSpace)),M.push(w.customProgramCacheKey),M.join()}function g(w,M){w.push(M.precision),w.push(M.outputColorSpace),w.push(M.envMapMode),w.push(M.envMapCubeUVHeight),w.push(M.mapUv),w.push(M.alphaMapUv),w.push(M.lightMapUv),w.push(M.aoMapUv),w.push(M.bumpMapUv),w.push(M.normalMapUv),w.push(M.displacementMapUv),w.push(M.emissiveMapUv),w.push(M.metalnessMapUv),w.push(M.roughnessMapUv),w.push(M.anisotropyMapUv),w.push(M.clearcoatMapUv),w.push(M.clearcoatNormalMapUv),w.push(M.clearcoatRoughnessMapUv),w.push(M.iridescenceMapUv),w.push(M.iridescenceThicknessMapUv),w.push(M.sheenColorMapUv),w.push(M.sheenRoughnessMapUv),w.push(M.specularMapUv),w.push(M.specularColorMapUv),w.push(M.specularIntensityMapUv),w.push(M.transmissionMapUv),w.push(M.thicknessMapUv),w.push(M.combine),w.push(M.fogExp2),w.push(M.sizeAttenuation),w.push(M.morphTargetsCount),w.push(M.morphAttributeCount),w.push(M.numDirLights),w.push(M.numPointLights),w.push(M.numSpotLights),w.push(M.numSpotLightMaps),w.push(M.numHemiLights),w.push(M.numRectAreaLights),w.push(M.numDirLightShadows),w.push(M.numPointLightShadows),w.push(M.numSpotLightShadows),w.push(M.numSpotLightShadowsWithMaps),w.push(M.numLightProbes),w.push(M.shadowMapType),w.push(M.toneMapping),w.push(M.numClippingPlanes),w.push(M.numClipIntersection),w.push(M.depthPacking)}function x(w,M){a.disableAll(),M.supportsVertexTextures&&a.enable(0),M.instancing&&a.enable(1),M.instancingColor&&a.enable(2),M.instancingMorph&&a.enable(3),M.matcap&&a.enable(4),M.envMap&&a.enable(5),M.normalMapObjectSpace&&a.enable(6),M.normalMapTangentSpace&&a.enable(7),M.clearcoat&&a.enable(8),M.iridescence&&a.enable(9),M.alphaTest&&a.enable(10),M.vertexColors&&a.enable(11),M.vertexAlphas&&a.enable(12),M.vertexUv1s&&a.enable(13),M.vertexUv2s&&a.enable(14),M.vertexUv3s&&a.enable(15),M.vertexTangents&&a.enable(16),M.anisotropy&&a.enable(17),M.alphaHash&&a.enable(18),M.batching&&a.enable(19),M.dispersion&&a.enable(20),M.batchingColor&&a.enable(21),w.push(a.mask),a.disableAll(),M.fog&&a.enable(0),M.useFog&&a.enable(1),M.flatShading&&a.enable(2),M.logarithmicDepthBuffer&&a.enable(3),M.reverseDepthBuffer&&a.enable(4),M.skinning&&a.enable(5),M.morphTargets&&a.enable(6),M.morphNormals&&a.enable(7),M.morphColors&&a.enable(8),M.premultipliedAlpha&&a.enable(9),M.shadowMapEnabled&&a.enable(10),M.doubleSided&&a.enable(11),M.flipSided&&a.enable(12),M.useDepthPacking&&a.enable(13),M.dithering&&a.enable(14),M.transmission&&a.enable(15),M.sheen&&a.enable(16),M.opaque&&a.enable(17),M.pointsUvs&&a.enable(18),M.decodeVideoTexture&&a.enable(19),M.decodeVideoTextureEmissive&&a.enable(20),M.alphaToCoverage&&a.enable(21),w.push(a.mask)}function _(w){const M=v[w.type];let D;if(M){const V=si[M];D=tS.clone(V.uniforms)}else D=w.uniforms;return D}function P(w,M){let D;for(let V=0,z=d.length;V<z;V++){const X=d[V];if(X.cacheKey===M){D=X,++D.usedTimes;break}}return D===void 0&&(D=new m2(t,M,w,s),d.push(D)),D}function T(w){if(--w.usedTimes===0){const M=d.indexOf(w);d[M]=d[d.length-1],d.pop(),w.destroy()}}function A(w){l.remove(w)}function b(){l.dispose()}return{getParameters:m,getProgramCacheKey:u,getUniforms:_,acquireProgram:P,releaseProgram:T,releaseShaderCache:A,programs:d,dispose:b}}function y2(){let t=new WeakMap;function e(o){return t.has(o)}function n(o){let a=t.get(o);return a===void 0&&(a={},t.set(o,a)),a}function i(o){t.delete(o)}function r(o,a,l){t.get(o)[a]=l}function s(){t=new WeakMap}return{has:e,get:n,remove:i,update:r,dispose:s}}function M2(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.material.id!==e.material.id?t.material.id-e.material.id:t.z!==e.z?t.z-e.z:t.id-e.id}function km(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.z!==e.z?e.z-t.z:t.id-e.id}function Bm(){const t=[];let e=0;const n=[],i=[],r=[];function s(){e=0,n.length=0,i.length=0,r.length=0}function o(h,f,p,v,y,m){let u=t[e];return u===void 0?(u={id:h.id,object:h,geometry:f,material:p,groupOrder:v,renderOrder:h.renderOrder,z:y,group:m},t[e]=u):(u.id=h.id,u.object=h,u.geometry=f,u.material=p,u.groupOrder=v,u.renderOrder=h.renderOrder,u.z=y,u.group=m),e++,u}function a(h,f,p,v,y,m){const u=o(h,f,p,v,y,m);p.transmission>0?i.push(u):p.transparent===!0?r.push(u):n.push(u)}function l(h,f,p,v,y,m){const u=o(h,f,p,v,y,m);p.transmission>0?i.unshift(u):p.transparent===!0?r.unshift(u):n.unshift(u)}function c(h,f){n.length>1&&n.sort(h||M2),i.length>1&&i.sort(f||km),r.length>1&&r.sort(f||km)}function d(){for(let h=e,f=t.length;h<f;h++){const p=t[h];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:n,transmissive:i,transparent:r,init:s,push:a,unshift:l,finish:d,sort:c}}function S2(){let t=new WeakMap;function e(i,r){const s=t.get(i);let o;return s===void 0?(o=new Bm,t.set(i,[o])):r>=s.length?(o=new Bm,s.push(o)):o=s[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}function w2(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={direction:new R,color:new me};break;case"SpotLight":n={position:new R,direction:new R,color:new me,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new R,color:new me,distance:0,decay:0};break;case"HemisphereLight":n={direction:new R,skyColor:new me,groundColor:new me};break;case"RectAreaLight":n={color:new me,position:new R,halfWidth:new R,halfHeight:new R};break}return t[e.id]=n,n}}}function E2(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new He};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new He};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new He,shadowCameraNear:1,shadowCameraFar:1e3};break}return t[e.id]=n,n}}}let T2=0;function A2(t,e){return(e.castShadow?2:0)-(t.castShadow?2:0)+(e.map?1:0)-(t.map?1:0)}function b2(t){const e=new w2,n=E2(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new R);const r=new R,s=new rt,o=new rt;function a(c){let d=0,h=0,f=0;for(let w=0;w<9;w++)i.probe[w].set(0,0,0);let p=0,v=0,y=0,m=0,u=0,g=0,x=0,_=0,P=0,T=0,A=0;c.sort(A2);for(let w=0,M=c.length;w<M;w++){const D=c[w],V=D.color,z=D.intensity,X=D.distance,Z=D.shadow&&D.shadow.map?D.shadow.map.texture:null;if(D.isAmbientLight)d+=V.r*z,h+=V.g*z,f+=V.b*z;else if(D.isLightProbe){for(let Y=0;Y<9;Y++)i.probe[Y].addScaledVector(D.sh.coefficients[Y],z);A++}else if(D.isDirectionalLight){const Y=e.get(D);if(Y.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){const te=D.shadow,N=n.get(D);N.shadowIntensity=te.intensity,N.shadowBias=te.bias,N.shadowNormalBias=te.normalBias,N.shadowRadius=te.radius,N.shadowMapSize=te.mapSize,i.directionalShadow[p]=N,i.directionalShadowMap[p]=Z,i.directionalShadowMatrix[p]=D.shadow.matrix,g++}i.directional[p]=Y,p++}else if(D.isSpotLight){const Y=e.get(D);Y.position.setFromMatrixPosition(D.matrixWorld),Y.color.copy(V).multiplyScalar(z),Y.distance=X,Y.coneCos=Math.cos(D.angle),Y.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),Y.decay=D.decay,i.spot[y]=Y;const te=D.shadow;if(D.map&&(i.spotLightMap[P]=D.map,P++,te.updateMatrices(D),D.castShadow&&T++),i.spotLightMatrix[y]=te.matrix,D.castShadow){const N=n.get(D);N.shadowIntensity=te.intensity,N.shadowBias=te.bias,N.shadowNormalBias=te.normalBias,N.shadowRadius=te.radius,N.shadowMapSize=te.mapSize,i.spotShadow[y]=N,i.spotShadowMap[y]=Z,_++}y++}else if(D.isRectAreaLight){const Y=e.get(D);Y.color.copy(V).multiplyScalar(z),Y.halfWidth.set(D.width*.5,0,0),Y.halfHeight.set(0,D.height*.5,0),i.rectArea[m]=Y,m++}else if(D.isPointLight){const Y=e.get(D);if(Y.color.copy(D.color).multiplyScalar(D.intensity),Y.distance=D.distance,Y.decay=D.decay,D.castShadow){const te=D.shadow,N=n.get(D);N.shadowIntensity=te.intensity,N.shadowBias=te.bias,N.shadowNormalBias=te.normalBias,N.shadowRadius=te.radius,N.shadowMapSize=te.mapSize,N.shadowCameraNear=te.camera.near,N.shadowCameraFar=te.camera.far,i.pointShadow[v]=N,i.pointShadowMap[v]=Z,i.pointShadowMatrix[v]=D.shadow.matrix,x++}i.point[v]=Y,v++}else if(D.isHemisphereLight){const Y=e.get(D);Y.skyColor.copy(D.color).multiplyScalar(z),Y.groundColor.copy(D.groundColor).multiplyScalar(z),i.hemi[u]=Y,u++}}m>0&&(t.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=le.LTC_FLOAT_1,i.rectAreaLTC2=le.LTC_FLOAT_2):(i.rectAreaLTC1=le.LTC_HALF_1,i.rectAreaLTC2=le.LTC_HALF_2)),i.ambient[0]=d,i.ambient[1]=h,i.ambient[2]=f;const b=i.hash;(b.directionalLength!==p||b.pointLength!==v||b.spotLength!==y||b.rectAreaLength!==m||b.hemiLength!==u||b.numDirectionalShadows!==g||b.numPointShadows!==x||b.numSpotShadows!==_||b.numSpotMaps!==P||b.numLightProbes!==A)&&(i.directional.length=p,i.spot.length=y,i.rectArea.length=m,i.point.length=v,i.hemi.length=u,i.directionalShadow.length=g,i.directionalShadowMap.length=g,i.pointShadow.length=x,i.pointShadowMap.length=x,i.spotShadow.length=_,i.spotShadowMap.length=_,i.directionalShadowMatrix.length=g,i.pointShadowMatrix.length=x,i.spotLightMatrix.length=_+P-T,i.spotLightMap.length=P,i.numSpotLightShadowsWithMaps=T,i.numLightProbes=A,b.directionalLength=p,b.pointLength=v,b.spotLength=y,b.rectAreaLength=m,b.hemiLength=u,b.numDirectionalShadows=g,b.numPointShadows=x,b.numSpotShadows=_,b.numSpotMaps=P,b.numLightProbes=A,i.version=T2++)}function l(c,d){let h=0,f=0,p=0,v=0,y=0;const m=d.matrixWorldInverse;for(let u=0,g=c.length;u<g;u++){const x=c[u];if(x.isDirectionalLight){const _=i.directional[h];_.direction.setFromMatrixPosition(x.matrixWorld),r.setFromMatrixPosition(x.target.matrixWorld),_.direction.sub(r),_.direction.transformDirection(m),h++}else if(x.isSpotLight){const _=i.spot[p];_.position.setFromMatrixPosition(x.matrixWorld),_.position.applyMatrix4(m),_.direction.setFromMatrixPosition(x.matrixWorld),r.setFromMatrixPosition(x.target.matrixWorld),_.direction.sub(r),_.direction.transformDirection(m),p++}else if(x.isRectAreaLight){const _=i.rectArea[v];_.position.setFromMatrixPosition(x.matrixWorld),_.position.applyMatrix4(m),o.identity(),s.copy(x.matrixWorld),s.premultiply(m),o.extractRotation(s),_.halfWidth.set(x.width*.5,0,0),_.halfHeight.set(0,x.height*.5,0),_.halfWidth.applyMatrix4(o),_.halfHeight.applyMatrix4(o),v++}else if(x.isPointLight){const _=i.point[f];_.position.setFromMatrixPosition(x.matrixWorld),_.position.applyMatrix4(m),f++}else if(x.isHemisphereLight){const _=i.hemi[y];_.direction.setFromMatrixPosition(x.matrixWorld),_.direction.transformDirection(m),y++}}}return{setup:a,setupView:l,state:i}}function zm(t){const e=new b2(t),n=[],i=[];function r(d){c.camera=d,n.length=0,i.length=0}function s(d){n.push(d)}function o(d){i.push(d)}function a(){e.setup(n)}function l(d){e.setupView(n,d)}const c={lightsArray:n,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:c,setupLights:a,setupLightsView:l,pushLight:s,pushShadow:o}}function C2(t){let e=new WeakMap;function n(r,s=0){const o=e.get(r);let a;return o===void 0?(a=new zm(t),e.set(r,[a])):s>=o.length?(a=new zm(t),o.push(a)):a=o[s],a}function i(){e=new WeakMap}return{get:n,dispose:i}}class P2 extends $r{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=cM,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class R2 extends $r{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const D2=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,N2=`uniform sampler2D shadow_pass;
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
}`;function L2(t,e,n){let i=new _f;const r=new He,s=new He,o=new at,a=new P2({depthPacking:uM}),l=new R2,c={},d=n.maxTextureSize,h={[ur]:Lt,[Lt]:ur,[wn]:wn},f=new vt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new He},radius:{value:4}},vertexShader:D2,fragmentShader:N2}),p=f.clone();p.defines.HORIZONTAL_PASS=1;const v=new ct;v.setAttribute("position",new Je(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const y=new lt(v,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Mv;let u=this.type;this.render=function(T,A,b){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;const w=t.getRenderTarget(),M=t.getActiveCubeFace(),D=t.getActiveMipmapLevel(),V=t.state;V.setBlending(rr),V.buffers.color.setClear(1,1,1,1),V.buffers.depth.setTest(!0),V.setScissorTest(!1);const z=u!==xi&&this.type===xi,X=u===xi&&this.type!==xi;for(let Z=0,Y=T.length;Z<Y;Z++){const te=T[Z],N=te.shadow;if(N===void 0){console.warn("THREE.WebGLShadowMap:",te,"has no shadow.");continue}if(N.autoUpdate===!1&&N.needsUpdate===!1)continue;r.copy(N.mapSize);const $=N.getFrameExtents();if(r.multiply($),s.copy(N.mapSize),(r.x>d||r.y>d)&&(r.x>d&&(s.x=Math.floor(d/$.x),r.x=s.x*$.x,N.mapSize.x=s.x),r.y>d&&(s.y=Math.floor(d/$.y),r.y=s.y*$.y,N.mapSize.y=s.y)),N.map===null||z===!0||X===!0){const oe=this.type!==xi?{minFilter:An,magFilter:An}:{};N.map!==null&&N.map.dispose(),N.map=new Wr(r.x,r.y,oe),N.map.texture.name=te.name+".shadowMap",N.camera.updateProjectionMatrix()}t.setRenderTarget(N.map),t.clear();const Q=N.getViewportCount();for(let oe=0;oe<Q;oe++){const _e=N.getViewport(oe);o.set(s.x*_e.x,s.y*_e.y,s.x*_e.z,s.y*_e.w),V.viewport(o),N.updateMatrices(te,oe),i=N.getFrustum(),_(A,b,N.camera,te,this.type)}N.isPointLightShadow!==!0&&this.type===xi&&g(N,b),N.needsUpdate=!1}u=this.type,m.needsUpdate=!1,t.setRenderTarget(w,M,D)};function g(T,A){const b=e.update(y);f.defines.VSM_SAMPLES!==T.blurSamples&&(f.defines.VSM_SAMPLES=T.blurSamples,p.defines.VSM_SAMPLES=T.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new Wr(r.x,r.y)),f.uniforms.shadow_pass.value=T.map.texture,f.uniforms.resolution.value=T.mapSize,f.uniforms.radius.value=T.radius,t.setRenderTarget(T.mapPass),t.clear(),t.renderBufferDirect(A,null,b,f,y,null),p.uniforms.shadow_pass.value=T.mapPass.texture,p.uniforms.resolution.value=T.mapSize,p.uniforms.radius.value=T.radius,t.setRenderTarget(T.map),t.clear(),t.renderBufferDirect(A,null,b,p,y,null)}function x(T,A,b,w){let M=null;const D=b.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(D!==void 0)M=D;else if(M=b.isPointLight===!0?l:a,t.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const V=M.uuid,z=A.uuid;let X=c[V];X===void 0&&(X={},c[V]=X);let Z=X[z];Z===void 0&&(Z=M.clone(),X[z]=Z,A.addEventListener("dispose",P)),M=Z}if(M.visible=A.visible,M.wireframe=A.wireframe,w===xi?M.side=A.shadowSide!==null?A.shadowSide:A.side:M.side=A.shadowSide!==null?A.shadowSide:h[A.side],M.alphaMap=A.alphaMap,M.alphaTest=A.alphaTest,M.map=A.map,M.clipShadows=A.clipShadows,M.clippingPlanes=A.clippingPlanes,M.clipIntersection=A.clipIntersection,M.displacementMap=A.displacementMap,M.displacementScale=A.displacementScale,M.displacementBias=A.displacementBias,M.wireframeLinewidth=A.wireframeLinewidth,M.linewidth=A.linewidth,b.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const V=t.properties.get(M);V.light=b}return M}function _(T,A,b,w,M){if(T.visible===!1)return;if(T.layers.test(A.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&M===xi)&&(!T.frustumCulled||i.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(b.matrixWorldInverse,T.matrixWorld);const z=e.update(T),X=T.material;if(Array.isArray(X)){const Z=z.groups;for(let Y=0,te=Z.length;Y<te;Y++){const N=Z[Y],$=X[N.materialIndex];if($&&$.visible){const Q=x(T,$,w,M);T.onBeforeShadow(t,T,A,b,z,Q,N),t.renderBufferDirect(b,null,z,Q,T,N),T.onAfterShadow(t,T,A,b,z,Q,N)}}}else if(X.visible){const Z=x(T,X,w,M);T.onBeforeShadow(t,T,A,b,z,Z,null),t.renderBufferDirect(b,null,z,Z,T,null),T.onAfterShadow(t,T,A,b,z,Z,null)}}const V=T.children;for(let z=0,X=V.length;z<X;z++)_(V[z],A,b,w,M)}function P(T){T.target.removeEventListener("dispose",P);for(const b in c){const w=c[b],M=T.target.uuid;M in w&&(w[M].dispose(),delete w[M])}}}const I2={[Td]:Ad,[bd]:Rd,[Cd]:Dd,[Ws]:Pd,[Ad]:Td,[Rd]:bd,[Dd]:Cd,[Pd]:Ws};function U2(t,e){function n(){let U=!1;const de=new at;let q=null;const ee=new at(0,0,0,0);return{setMask:function(pe){q!==pe&&!U&&(t.colorMask(pe,pe,pe,pe),q=pe)},setLocked:function(pe){U=pe},setClear:function(pe,he,Oe,Tt,Xt){Xt===!0&&(pe*=Tt,he*=Tt,Oe*=Tt),de.set(pe,he,Oe,Tt),ee.equals(de)===!1&&(t.clearColor(pe,he,Oe,Tt),ee.copy(de))},reset:function(){U=!1,q=null,ee.set(-1,0,0,0)}}}function i(){let U=!1,de=!1,q=null,ee=null,pe=null;return{setReversed:function(he){if(de!==he){const Oe=e.get("EXT_clip_control");de?Oe.clipControlEXT(Oe.LOWER_LEFT_EXT,Oe.ZERO_TO_ONE_EXT):Oe.clipControlEXT(Oe.LOWER_LEFT_EXT,Oe.NEGATIVE_ONE_TO_ONE_EXT);const Tt=pe;pe=null,this.setClear(Tt)}de=he},getReversed:function(){return de},setTest:function(he){he?ae(t.DEPTH_TEST):Ce(t.DEPTH_TEST)},setMask:function(he){q!==he&&!U&&(t.depthMask(he),q=he)},setFunc:function(he){if(de&&(he=I2[he]),ee!==he){switch(he){case Td:t.depthFunc(t.NEVER);break;case Ad:t.depthFunc(t.ALWAYS);break;case bd:t.depthFunc(t.LESS);break;case Ws:t.depthFunc(t.LEQUAL);break;case Cd:t.depthFunc(t.EQUAL);break;case Pd:t.depthFunc(t.GEQUAL);break;case Rd:t.depthFunc(t.GREATER);break;case Dd:t.depthFunc(t.NOTEQUAL);break;default:t.depthFunc(t.LEQUAL)}ee=he}},setLocked:function(he){U=he},setClear:function(he){pe!==he&&(de&&(he=1-he),t.clearDepth(he),pe=he)},reset:function(){U=!1,q=null,ee=null,pe=null,de=!1}}}function r(){let U=!1,de=null,q=null,ee=null,pe=null,he=null,Oe=null,Tt=null,Xt=null;return{setTest:function(nt){U||(nt?ae(t.STENCIL_TEST):Ce(t.STENCIL_TEST))},setMask:function(nt){de!==nt&&!U&&(t.stencilMask(nt),de=nt)},setFunc:function(nt,Bn,di){(q!==nt||ee!==Bn||pe!==di)&&(t.stencilFunc(nt,Bn,di),q=nt,ee=Bn,pe=di)},setOp:function(nt,Bn,di){(he!==nt||Oe!==Bn||Tt!==di)&&(t.stencilOp(nt,Bn,di),he=nt,Oe=Bn,Tt=di)},setLocked:function(nt){U=nt},setClear:function(nt){Xt!==nt&&(t.clearStencil(nt),Xt=nt)},reset:function(){U=!1,de=null,q=null,ee=null,pe=null,he=null,Oe=null,Tt=null,Xt=null}}}const s=new n,o=new i,a=new r,l=new WeakMap,c=new WeakMap;let d={},h={},f=new WeakMap,p=[],v=null,y=!1,m=null,u=null,g=null,x=null,_=null,P=null,T=null,A=new me(0,0,0),b=0,w=!1,M=null,D=null,V=null,z=null,X=null;const Z=t.getParameter(t.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let Y=!1,te=0;const N=t.getParameter(t.VERSION);N.indexOf("WebGL")!==-1?(te=parseFloat(/^WebGL (\d)/.exec(N)[1]),Y=te>=1):N.indexOf("OpenGL ES")!==-1&&(te=parseFloat(/^OpenGL ES (\d)/.exec(N)[1]),Y=te>=2);let $=null,Q={};const oe=t.getParameter(t.SCISSOR_BOX),_e=t.getParameter(t.VIEWPORT),Ve=new at().fromArray(oe),K=new at().fromArray(_e);function ne(U,de,q,ee){const pe=new Uint8Array(4),he=t.createTexture();t.bindTexture(U,he),t.texParameteri(U,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(U,t.TEXTURE_MAG_FILTER,t.NEAREST);for(let Oe=0;Oe<q;Oe++)U===t.TEXTURE_3D||U===t.TEXTURE_2D_ARRAY?t.texImage3D(de,0,t.RGBA,1,1,ee,0,t.RGBA,t.UNSIGNED_BYTE,pe):t.texImage2D(de+Oe,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,pe);return he}const ce={};ce[t.TEXTURE_2D]=ne(t.TEXTURE_2D,t.TEXTURE_2D,1),ce[t.TEXTURE_CUBE_MAP]=ne(t.TEXTURE_CUBE_MAP,t.TEXTURE_CUBE_MAP_POSITIVE_X,6),ce[t.TEXTURE_2D_ARRAY]=ne(t.TEXTURE_2D_ARRAY,t.TEXTURE_2D_ARRAY,1,1),ce[t.TEXTURE_3D]=ne(t.TEXTURE_3D,t.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),ae(t.DEPTH_TEST),o.setFunc(Ws),Pe(!1),je(Wp),ae(t.CULL_FACE),I(rr);function ae(U){d[U]!==!0&&(t.enable(U),d[U]=!0)}function Ce(U){d[U]!==!1&&(t.disable(U),d[U]=!1)}function Le(U,de){return h[U]!==de?(t.bindFramebuffer(U,de),h[U]=de,U===t.DRAW_FRAMEBUFFER&&(h[t.FRAMEBUFFER]=de),U===t.FRAMEBUFFER&&(h[t.DRAW_FRAMEBUFFER]=de),!0):!1}function Ue(U,de){let q=p,ee=!1;if(U){q=f.get(de),q===void 0&&(q=[],f.set(de,q));const pe=U.textures;if(q.length!==pe.length||q[0]!==t.COLOR_ATTACHMENT0){for(let he=0,Oe=pe.length;he<Oe;he++)q[he]=t.COLOR_ATTACHMENT0+he;q.length=pe.length,ee=!0}}else q[0]!==t.BACK&&(q[0]=t.BACK,ee=!0);ee&&t.drawBuffers(q)}function ut(U){return v!==U?(t.useProgram(U),v=U,!0):!1}const We={[Ar]:t.FUNC_ADD,[Fy]:t.FUNC_SUBTRACT,[ky]:t.FUNC_REVERSE_SUBTRACT};We[By]=t.MIN,We[zy]=t.MAX;const Xe={[Hy]:t.ZERO,[Vy]:t.ONE,[Gy]:t.SRC_COLOR,[wd]:t.SRC_ALPHA,[qy]:t.SRC_ALPHA_SATURATE,[Ky]:t.DST_COLOR,[jy]:t.DST_ALPHA,[Wy]:t.ONE_MINUS_SRC_COLOR,[Ed]:t.ONE_MINUS_SRC_ALPHA,[Yy]:t.ONE_MINUS_DST_COLOR,[Xy]:t.ONE_MINUS_DST_ALPHA,[$y]:t.CONSTANT_COLOR,[Zy]:t.ONE_MINUS_CONSTANT_COLOR,[Qy]:t.CONSTANT_ALPHA,[Jy]:t.ONE_MINUS_CONSTANT_ALPHA};function I(U,de,q,ee,pe,he,Oe,Tt,Xt,nt){if(U===rr){y===!0&&(Ce(t.BLEND),y=!1);return}if(y===!1&&(ae(t.BLEND),y=!0),U!==Oy){if(U!==m||nt!==w){if((u!==Ar||_!==Ar)&&(t.blendEquation(t.FUNC_ADD),u=Ar,_=Ar),nt)switch(U){case sr:t.blendFuncSeparate(t.ONE,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case Jt:t.blendFunc(t.ONE,t.ONE);break;case jp:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case Xp:t.blendFuncSeparate(t.ZERO,t.SRC_COLOR,t.ZERO,t.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}else switch(U){case sr:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case Jt:t.blendFunc(t.SRC_ALPHA,t.ONE);break;case jp:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case Xp:t.blendFunc(t.ZERO,t.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}g=null,x=null,P=null,T=null,A.set(0,0,0),b=0,m=U,w=nt}return}pe=pe||de,he=he||q,Oe=Oe||ee,(de!==u||pe!==_)&&(t.blendEquationSeparate(We[de],We[pe]),u=de,_=pe),(q!==g||ee!==x||he!==P||Oe!==T)&&(t.blendFuncSeparate(Xe[q],Xe[ee],Xe[he],Xe[Oe]),g=q,x=ee,P=he,T=Oe),(Tt.equals(A)===!1||Xt!==b)&&(t.blendColor(Tt.r,Tt.g,Tt.b,Xt),A.copy(Tt),b=Xt),m=U,w=!1}function tn(U,de){U.side===wn?Ce(t.CULL_FACE):ae(t.CULL_FACE);let q=U.side===Lt;de&&(q=!q),Pe(q),U.blending===sr&&U.transparent===!1?I(rr):I(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),o.setFunc(U.depthFunc),o.setTest(U.depthTest),o.setMask(U.depthWrite),s.setMask(U.colorWrite);const ee=U.stencilWrite;a.setTest(ee),ee&&(a.setMask(U.stencilWriteMask),a.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),a.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),st(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?ae(t.SAMPLE_ALPHA_TO_COVERAGE):Ce(t.SAMPLE_ALPHA_TO_COVERAGE)}function Pe(U){M!==U&&(U?t.frontFace(t.CW):t.frontFace(t.CCW),M=U)}function je(U){U!==Ly?(ae(t.CULL_FACE),U!==D&&(U===Wp?t.cullFace(t.BACK):U===Iy?t.cullFace(t.FRONT):t.cullFace(t.FRONT_AND_BACK))):Ce(t.CULL_FACE),D=U}function be(U){U!==V&&(Y&&t.lineWidth(U),V=U)}function st(U,de,q){U?(ae(t.POLYGON_OFFSET_FILL),(z!==de||X!==q)&&(t.polygonOffset(de,q),z=de,X=q)):Ce(t.POLYGON_OFFSET_FILL)}function Ae(U){U?ae(t.SCISSOR_TEST):Ce(t.SCISSOR_TEST)}function C(U){U===void 0&&(U=t.TEXTURE0+Z-1),$!==U&&(t.activeTexture(U),$=U)}function S(U,de,q){q===void 0&&($===null?q=t.TEXTURE0+Z-1:q=$);let ee=Q[q];ee===void 0&&(ee={type:void 0,texture:void 0},Q[q]=ee),(ee.type!==U||ee.texture!==de)&&($!==q&&(t.activeTexture(q),$=q),t.bindTexture(U,de||ce[U]),ee.type=U,ee.texture=de)}function H(){const U=Q[$];U!==void 0&&U.type!==void 0&&(t.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function J(){try{t.compressedTexImage2D.apply(t,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function L(){try{t.compressedTexImage3D.apply(t,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function B(){try{t.texSubImage2D.apply(t,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ge(){try{t.texSubImage3D.apply(t,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ue(){try{t.compressedTexSubImage2D.apply(t,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ve(){try{t.compressedTexSubImage3D.apply(t,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ye(){try{t.texStorage2D.apply(t,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function re(){try{t.texStorage3D.apply(t,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ye(){try{t.texImage2D.apply(t,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Re(){try{t.texImage3D.apply(t,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ne(U){Ve.equals(U)===!1&&(t.scissor(U.x,U.y,U.z,U.w),Ve.copy(U))}function Me(U){K.equals(U)===!1&&(t.viewport(U.x,U.y,U.z,U.w),K.copy(U))}function Ke(U,de){let q=c.get(de);q===void 0&&(q=new WeakMap,c.set(de,q));let ee=q.get(U);ee===void 0&&(ee=t.getUniformBlockIndex(de,U.name),q.set(U,ee))}function Be(U,de){const ee=c.get(de).get(U);l.get(de)!==ee&&(t.uniformBlockBinding(de,ee,U.__bindingPointIndex),l.set(de,ee))}function dt(){t.disable(t.BLEND),t.disable(t.CULL_FACE),t.disable(t.DEPTH_TEST),t.disable(t.POLYGON_OFFSET_FILL),t.disable(t.SCISSOR_TEST),t.disable(t.STENCIL_TEST),t.disable(t.SAMPLE_ALPHA_TO_COVERAGE),t.blendEquation(t.FUNC_ADD),t.blendFunc(t.ONE,t.ZERO),t.blendFuncSeparate(t.ONE,t.ZERO,t.ONE,t.ZERO),t.blendColor(0,0,0,0),t.colorMask(!0,!0,!0,!0),t.clearColor(0,0,0,0),t.depthMask(!0),t.depthFunc(t.LESS),o.setReversed(!1),t.clearDepth(1),t.stencilMask(4294967295),t.stencilFunc(t.ALWAYS,0,4294967295),t.stencilOp(t.KEEP,t.KEEP,t.KEEP),t.clearStencil(0),t.cullFace(t.BACK),t.frontFace(t.CCW),t.polygonOffset(0,0),t.activeTexture(t.TEXTURE0),t.bindFramebuffer(t.FRAMEBUFFER,null),t.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),t.bindFramebuffer(t.READ_FRAMEBUFFER,null),t.useProgram(null),t.lineWidth(1),t.scissor(0,0,t.canvas.width,t.canvas.height),t.viewport(0,0,t.canvas.width,t.canvas.height),d={},$=null,Q={},h={},f=new WeakMap,p=[],v=null,y=!1,m=null,u=null,g=null,x=null,_=null,P=null,T=null,A=new me(0,0,0),b=0,w=!1,M=null,D=null,V=null,z=null,X=null,Ve.set(0,0,t.canvas.width,t.canvas.height),K.set(0,0,t.canvas.width,t.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:ae,disable:Ce,bindFramebuffer:Le,drawBuffers:Ue,useProgram:ut,setBlending:I,setMaterial:tn,setFlipSided:Pe,setCullFace:je,setLineWidth:be,setPolygonOffset:st,setScissorTest:Ae,activeTexture:C,bindTexture:S,unbindTexture:H,compressedTexImage2D:J,compressedTexImage3D:L,texImage2D:ye,texImage3D:Re,updateUBOMapping:Ke,uniformBlockBinding:Be,texStorage2D:Ye,texStorage3D:re,texSubImage2D:B,texSubImage3D:ge,compressedTexSubImage2D:ue,compressedTexSubImage3D:ve,scissor:Ne,viewport:Me,reset:dt}}function Hm(t,e,n,i){const r=O2(i);switch(n){case Cv:return t*e;case Rv:return t*e;case Dv:return t*e*2;case hf:return t*e/r.components*r.byteLength;case ff:return t*e/r.components*r.byteLength;case Nv:return t*e*2/r.components*r.byteLength;case pf:return t*e*2/r.components*r.byteLength;case Pv:return t*e*3/r.components*r.byteLength;case Zn:return t*e*4/r.components*r.byteLength;case mf:return t*e*4/r.components*r.byteLength;case Sl:case wl:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case El:case Tl:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Od:case kd:return Math.max(t,16)*Math.max(e,8)/4;case Ud:case Fd:return Math.max(t,8)*Math.max(e,8)/2;case Bd:case zd:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case Hd:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Vd:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Gd:return Math.floor((t+4)/5)*Math.floor((e+3)/4)*16;case Wd:return Math.floor((t+4)/5)*Math.floor((e+4)/5)*16;case jd:return Math.floor((t+5)/6)*Math.floor((e+4)/5)*16;case Xd:return Math.floor((t+5)/6)*Math.floor((e+5)/6)*16;case Kd:return Math.floor((t+7)/8)*Math.floor((e+4)/5)*16;case Yd:return Math.floor((t+7)/8)*Math.floor((e+5)/6)*16;case qd:return Math.floor((t+7)/8)*Math.floor((e+7)/8)*16;case $d:return Math.floor((t+9)/10)*Math.floor((e+4)/5)*16;case Zd:return Math.floor((t+9)/10)*Math.floor((e+5)/6)*16;case Qd:return Math.floor((t+9)/10)*Math.floor((e+7)/8)*16;case Jd:return Math.floor((t+9)/10)*Math.floor((e+9)/10)*16;case eh:return Math.floor((t+11)/12)*Math.floor((e+9)/10)*16;case th:return Math.floor((t+11)/12)*Math.floor((e+11)/12)*16;case Al:case nh:case ih:return Math.ceil(t/4)*Math.ceil(e/4)*16;case Lv:case rh:return Math.ceil(t/4)*Math.ceil(e/4)*8;case sh:case oh:return Math.ceil(t/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${n} format.`)}function O2(t){switch(t){case Ri:case Tv:return{byteLength:1,components:1};case aa:case Av:case ga:return{byteLength:2,components:1};case uf:case df:return{byteLength:2,components:4};case Gr:case cf:case ai:return{byteLength:4,components:1};case bv:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${t}.`)}function F2(t,e,n,i,r,s,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new He,d=new WeakMap;let h;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(C,S){return p?new OffscreenCanvas(C,S):ca("canvas")}function y(C,S,H){let J=1;const L=Ae(C);if((L.width>H||L.height>H)&&(J=H/Math.max(L.width,L.height)),J<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){const B=Math.floor(J*L.width),ge=Math.floor(J*L.height);h===void 0&&(h=v(B,ge));const ue=S?v(B,ge):h;return ue.width=B,ue.height=ge,ue.getContext("2d").drawImage(C,0,0,B,ge),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+L.width+"x"+L.height+") to ("+B+"x"+ge+")."),ue}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+L.width+"x"+L.height+")."),C;return C}function m(C){return C.generateMipmaps}function u(C){t.generateMipmap(C)}function g(C){return C.isWebGLCubeRenderTarget?t.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?t.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?t.TEXTURE_2D_ARRAY:t.TEXTURE_2D}function x(C,S,H,J,L=!1){if(C!==null){if(t[C]!==void 0)return t[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let B=S;if(S===t.RED&&(H===t.FLOAT&&(B=t.R32F),H===t.HALF_FLOAT&&(B=t.R16F),H===t.UNSIGNED_BYTE&&(B=t.R8)),S===t.RED_INTEGER&&(H===t.UNSIGNED_BYTE&&(B=t.R8UI),H===t.UNSIGNED_SHORT&&(B=t.R16UI),H===t.UNSIGNED_INT&&(B=t.R32UI),H===t.BYTE&&(B=t.R8I),H===t.SHORT&&(B=t.R16I),H===t.INT&&(B=t.R32I)),S===t.RG&&(H===t.FLOAT&&(B=t.RG32F),H===t.HALF_FLOAT&&(B=t.RG16F),H===t.UNSIGNED_BYTE&&(B=t.RG8)),S===t.RG_INTEGER&&(H===t.UNSIGNED_BYTE&&(B=t.RG8UI),H===t.UNSIGNED_SHORT&&(B=t.RG16UI),H===t.UNSIGNED_INT&&(B=t.RG32UI),H===t.BYTE&&(B=t.RG8I),H===t.SHORT&&(B=t.RG16I),H===t.INT&&(B=t.RG32I)),S===t.RGB_INTEGER&&(H===t.UNSIGNED_BYTE&&(B=t.RGB8UI),H===t.UNSIGNED_SHORT&&(B=t.RGB16UI),H===t.UNSIGNED_INT&&(B=t.RGB32UI),H===t.BYTE&&(B=t.RGB8I),H===t.SHORT&&(B=t.RGB16I),H===t.INT&&(B=t.RGB32I)),S===t.RGBA_INTEGER&&(H===t.UNSIGNED_BYTE&&(B=t.RGBA8UI),H===t.UNSIGNED_SHORT&&(B=t.RGBA16UI),H===t.UNSIGNED_INT&&(B=t.RGBA32UI),H===t.BYTE&&(B=t.RGBA8I),H===t.SHORT&&(B=t.RGBA16I),H===t.INT&&(B=t.RGBA32I)),S===t.RGB&&H===t.UNSIGNED_INT_5_9_9_9_REV&&(B=t.RGB9_E5),S===t.RGBA){const ge=L?_c:qe.getTransfer(J);H===t.FLOAT&&(B=t.RGBA32F),H===t.HALF_FLOAT&&(B=t.RGBA16F),H===t.UNSIGNED_BYTE&&(B=ge===ot?t.SRGB8_ALPHA8:t.RGBA8),H===t.UNSIGNED_SHORT_4_4_4_4&&(B=t.RGBA4),H===t.UNSIGNED_SHORT_5_5_5_1&&(B=t.RGB5_A1)}return(B===t.R16F||B===t.R32F||B===t.RG16F||B===t.RG32F||B===t.RGBA16F||B===t.RGBA32F)&&e.get("EXT_color_buffer_float"),B}function _(C,S){let H;return C?S===null||S===Gr||S===Ks?H=t.DEPTH24_STENCIL8:S===ai?H=t.DEPTH32F_STENCIL8:S===aa&&(H=t.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===Gr||S===Ks?H=t.DEPTH_COMPONENT24:S===ai?H=t.DEPTH_COMPONENT32F:S===aa&&(H=t.DEPTH_COMPONENT16),H}function P(C,S){return m(C)===!0||C.isFramebufferTexture&&C.minFilter!==An&&C.minFilter!==fn?Math.log2(Math.max(S.width,S.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?S.mipmaps.length:1}function T(C){const S=C.target;S.removeEventListener("dispose",T),b(S),S.isVideoTexture&&d.delete(S)}function A(C){const S=C.target;S.removeEventListener("dispose",A),M(S)}function b(C){const S=i.get(C);if(S.__webglInit===void 0)return;const H=C.source,J=f.get(H);if(J){const L=J[S.__cacheKey];L.usedTimes--,L.usedTimes===0&&w(C),Object.keys(J).length===0&&f.delete(H)}i.remove(C)}function w(C){const S=i.get(C);t.deleteTexture(S.__webglTexture);const H=C.source,J=f.get(H);delete J[S.__cacheKey],o.memory.textures--}function M(C){const S=i.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),i.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let J=0;J<6;J++){if(Array.isArray(S.__webglFramebuffer[J]))for(let L=0;L<S.__webglFramebuffer[J].length;L++)t.deleteFramebuffer(S.__webglFramebuffer[J][L]);else t.deleteFramebuffer(S.__webglFramebuffer[J]);S.__webglDepthbuffer&&t.deleteRenderbuffer(S.__webglDepthbuffer[J])}else{if(Array.isArray(S.__webglFramebuffer))for(let J=0;J<S.__webglFramebuffer.length;J++)t.deleteFramebuffer(S.__webglFramebuffer[J]);else t.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&t.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&t.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let J=0;J<S.__webglColorRenderbuffer.length;J++)S.__webglColorRenderbuffer[J]&&t.deleteRenderbuffer(S.__webglColorRenderbuffer[J]);S.__webglDepthRenderbuffer&&t.deleteRenderbuffer(S.__webglDepthRenderbuffer)}const H=C.textures;for(let J=0,L=H.length;J<L;J++){const B=i.get(H[J]);B.__webglTexture&&(t.deleteTexture(B.__webglTexture),o.memory.textures--),i.remove(H[J])}i.remove(C)}let D=0;function V(){D=0}function z(){const C=D;return C>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+r.maxTextures),D+=1,C}function X(C){const S=[];return S.push(C.wrapS),S.push(C.wrapT),S.push(C.wrapR||0),S.push(C.magFilter),S.push(C.minFilter),S.push(C.anisotropy),S.push(C.internalFormat),S.push(C.format),S.push(C.type),S.push(C.generateMipmaps),S.push(C.premultiplyAlpha),S.push(C.flipY),S.push(C.unpackAlignment),S.push(C.colorSpace),S.join()}function Z(C,S){const H=i.get(C);if(C.isVideoTexture&&be(C),C.isRenderTargetTexture===!1&&C.version>0&&H.__version!==C.version){const J=C.image;if(J===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(J.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{K(H,C,S);return}}n.bindTexture(t.TEXTURE_2D,H.__webglTexture,t.TEXTURE0+S)}function Y(C,S){const H=i.get(C);if(C.version>0&&H.__version!==C.version){K(H,C,S);return}n.bindTexture(t.TEXTURE_2D_ARRAY,H.__webglTexture,t.TEXTURE0+S)}function te(C,S){const H=i.get(C);if(C.version>0&&H.__version!==C.version){K(H,C,S);return}n.bindTexture(t.TEXTURE_3D,H.__webglTexture,t.TEXTURE0+S)}function N(C,S){const H=i.get(C);if(C.version>0&&H.__version!==C.version){ne(H,C,S);return}n.bindTexture(t.TEXTURE_CUBE_MAP,H.__webglTexture,t.TEXTURE0+S)}const $={[Mt]:t.REPEAT,[Qe]:t.CLAMP_TO_EDGE,[Id]:t.MIRRORED_REPEAT},Q={[An]:t.NEAREST,[lM]:t.NEAREST_MIPMAP_NEAREST,[ka]:t.NEAREST_MIPMAP_LINEAR,[fn]:t.LINEAR,[qc]:t.LINEAR_MIPMAP_NEAREST,[$n]:t.LINEAR_MIPMAP_LINEAR},oe={[hM]:t.NEVER,[xM]:t.ALWAYS,[fM]:t.LESS,[Uv]:t.LEQUAL,[pM]:t.EQUAL,[vM]:t.GEQUAL,[mM]:t.GREATER,[gM]:t.NOTEQUAL};function _e(C,S){if(S.type===ai&&e.has("OES_texture_float_linear")===!1&&(S.magFilter===fn||S.magFilter===qc||S.magFilter===ka||S.magFilter===$n||S.minFilter===fn||S.minFilter===qc||S.minFilter===ka||S.minFilter===$n)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),t.texParameteri(C,t.TEXTURE_WRAP_S,$[S.wrapS]),t.texParameteri(C,t.TEXTURE_WRAP_T,$[S.wrapT]),(C===t.TEXTURE_3D||C===t.TEXTURE_2D_ARRAY)&&t.texParameteri(C,t.TEXTURE_WRAP_R,$[S.wrapR]),t.texParameteri(C,t.TEXTURE_MAG_FILTER,Q[S.magFilter]),t.texParameteri(C,t.TEXTURE_MIN_FILTER,Q[S.minFilter]),S.compareFunction&&(t.texParameteri(C,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(C,t.TEXTURE_COMPARE_FUNC,oe[S.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===An||S.minFilter!==ka&&S.minFilter!==$n||S.type===ai&&e.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||i.get(S).__currentAnisotropy){const H=e.get("EXT_texture_filter_anisotropic");t.texParameterf(C,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,r.getMaxAnisotropy())),i.get(S).__currentAnisotropy=S.anisotropy}}}function Ve(C,S){let H=!1;C.__webglInit===void 0&&(C.__webglInit=!0,S.addEventListener("dispose",T));const J=S.source;let L=f.get(J);L===void 0&&(L={},f.set(J,L));const B=X(S);if(B!==C.__cacheKey){L[B]===void 0&&(L[B]={texture:t.createTexture(),usedTimes:0},o.memory.textures++,H=!0),L[B].usedTimes++;const ge=L[C.__cacheKey];ge!==void 0&&(L[C.__cacheKey].usedTimes--,ge.usedTimes===0&&w(S)),C.__cacheKey=B,C.__webglTexture=L[B].texture}return H}function K(C,S,H){let J=t.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(J=t.TEXTURE_2D_ARRAY),S.isData3DTexture&&(J=t.TEXTURE_3D);const L=Ve(C,S),B=S.source;n.bindTexture(J,C.__webglTexture,t.TEXTURE0+H);const ge=i.get(B);if(B.version!==ge.__version||L===!0){n.activeTexture(t.TEXTURE0+H);const ue=qe.getPrimaries(qe.workingColorSpace),ve=S.colorSpace===In?null:qe.getPrimaries(S.colorSpace),Ye=S.colorSpace===In||ue===ve?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,S.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,S.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ye);let re=y(S.image,!1,r.maxTextureSize);re=st(S,re);const ye=s.convert(S.format,S.colorSpace),Re=s.convert(S.type);let Ne=x(S.internalFormat,ye,Re,S.colorSpace,S.isVideoTexture);_e(J,S);let Me;const Ke=S.mipmaps,Be=S.isVideoTexture!==!0,dt=ge.__version===void 0||L===!0,U=B.dataReady,de=P(S,re);if(S.isDepthTexture)Ne=_(S.format===Ys,S.type),dt&&(Be?n.texStorage2D(t.TEXTURE_2D,1,Ne,re.width,re.height):n.texImage2D(t.TEXTURE_2D,0,Ne,re.width,re.height,0,ye,Re,null));else if(S.isDataTexture)if(Ke.length>0){Be&&dt&&n.texStorage2D(t.TEXTURE_2D,de,Ne,Ke[0].width,Ke[0].height);for(let q=0,ee=Ke.length;q<ee;q++)Me=Ke[q],Be?U&&n.texSubImage2D(t.TEXTURE_2D,q,0,0,Me.width,Me.height,ye,Re,Me.data):n.texImage2D(t.TEXTURE_2D,q,Ne,Me.width,Me.height,0,ye,Re,Me.data);S.generateMipmaps=!1}else Be?(dt&&n.texStorage2D(t.TEXTURE_2D,de,Ne,re.width,re.height),U&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,re.width,re.height,ye,Re,re.data)):n.texImage2D(t.TEXTURE_2D,0,Ne,re.width,re.height,0,ye,Re,re.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){Be&&dt&&n.texStorage3D(t.TEXTURE_2D_ARRAY,de,Ne,Ke[0].width,Ke[0].height,re.depth);for(let q=0,ee=Ke.length;q<ee;q++)if(Me=Ke[q],S.format!==Zn)if(ye!==null)if(Be){if(U)if(S.layerUpdates.size>0){const pe=Hm(Me.width,Me.height,S.format,S.type);for(const he of S.layerUpdates){const Oe=Me.data.subarray(he*pe/Me.data.BYTES_PER_ELEMENT,(he+1)*pe/Me.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,q,0,0,he,Me.width,Me.height,1,ye,Oe)}S.clearLayerUpdates()}else n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,q,0,0,0,Me.width,Me.height,re.depth,ye,Me.data)}else n.compressedTexImage3D(t.TEXTURE_2D_ARRAY,q,Ne,Me.width,Me.height,re.depth,0,Me.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Be?U&&n.texSubImage3D(t.TEXTURE_2D_ARRAY,q,0,0,0,Me.width,Me.height,re.depth,ye,Re,Me.data):n.texImage3D(t.TEXTURE_2D_ARRAY,q,Ne,Me.width,Me.height,re.depth,0,ye,Re,Me.data)}else{Be&&dt&&n.texStorage2D(t.TEXTURE_2D,de,Ne,Ke[0].width,Ke[0].height);for(let q=0,ee=Ke.length;q<ee;q++)Me=Ke[q],S.format!==Zn?ye!==null?Be?U&&n.compressedTexSubImage2D(t.TEXTURE_2D,q,0,0,Me.width,Me.height,ye,Me.data):n.compressedTexImage2D(t.TEXTURE_2D,q,Ne,Me.width,Me.height,0,Me.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Be?U&&n.texSubImage2D(t.TEXTURE_2D,q,0,0,Me.width,Me.height,ye,Re,Me.data):n.texImage2D(t.TEXTURE_2D,q,Ne,Me.width,Me.height,0,ye,Re,Me.data)}else if(S.isDataArrayTexture)if(Be){if(dt&&n.texStorage3D(t.TEXTURE_2D_ARRAY,de,Ne,re.width,re.height,re.depth),U)if(S.layerUpdates.size>0){const q=Hm(re.width,re.height,S.format,S.type);for(const ee of S.layerUpdates){const pe=re.data.subarray(ee*q/re.data.BYTES_PER_ELEMENT,(ee+1)*q/re.data.BYTES_PER_ELEMENT);n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,ee,re.width,re.height,1,ye,Re,pe)}S.clearLayerUpdates()}else n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,0,re.width,re.height,re.depth,ye,Re,re.data)}else n.texImage3D(t.TEXTURE_2D_ARRAY,0,Ne,re.width,re.height,re.depth,0,ye,Re,re.data);else if(S.isData3DTexture)Be?(dt&&n.texStorage3D(t.TEXTURE_3D,de,Ne,re.width,re.height,re.depth),U&&n.texSubImage3D(t.TEXTURE_3D,0,0,0,0,re.width,re.height,re.depth,ye,Re,re.data)):n.texImage3D(t.TEXTURE_3D,0,Ne,re.width,re.height,re.depth,0,ye,Re,re.data);else if(S.isFramebufferTexture){if(dt)if(Be)n.texStorage2D(t.TEXTURE_2D,de,Ne,re.width,re.height);else{let q=re.width,ee=re.height;for(let pe=0;pe<de;pe++)n.texImage2D(t.TEXTURE_2D,pe,Ne,q,ee,0,ye,Re,null),q>>=1,ee>>=1}}else if(Ke.length>0){if(Be&&dt){const q=Ae(Ke[0]);n.texStorage2D(t.TEXTURE_2D,de,Ne,q.width,q.height)}for(let q=0,ee=Ke.length;q<ee;q++)Me=Ke[q],Be?U&&n.texSubImage2D(t.TEXTURE_2D,q,0,0,ye,Re,Me):n.texImage2D(t.TEXTURE_2D,q,Ne,ye,Re,Me);S.generateMipmaps=!1}else if(Be){if(dt){const q=Ae(re);n.texStorage2D(t.TEXTURE_2D,de,Ne,q.width,q.height)}U&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,ye,Re,re)}else n.texImage2D(t.TEXTURE_2D,0,Ne,ye,Re,re);m(S)&&u(J),ge.__version=B.version,S.onUpdate&&S.onUpdate(S)}C.__version=S.version}function ne(C,S,H){if(S.image.length!==6)return;const J=Ve(C,S),L=S.source;n.bindTexture(t.TEXTURE_CUBE_MAP,C.__webglTexture,t.TEXTURE0+H);const B=i.get(L);if(L.version!==B.__version||J===!0){n.activeTexture(t.TEXTURE0+H);const ge=qe.getPrimaries(qe.workingColorSpace),ue=S.colorSpace===In?null:qe.getPrimaries(S.colorSpace),ve=S.colorSpace===In||ge===ue?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,S.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,S.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,ve);const Ye=S.isCompressedTexture||S.image[0].isCompressedTexture,re=S.image[0]&&S.image[0].isDataTexture,ye=[];for(let ee=0;ee<6;ee++)!Ye&&!re?ye[ee]=y(S.image[ee],!0,r.maxCubemapSize):ye[ee]=re?S.image[ee].image:S.image[ee],ye[ee]=st(S,ye[ee]);const Re=ye[0],Ne=s.convert(S.format,S.colorSpace),Me=s.convert(S.type),Ke=x(S.internalFormat,Ne,Me,S.colorSpace),Be=S.isVideoTexture!==!0,dt=B.__version===void 0||J===!0,U=L.dataReady;let de=P(S,Re);_e(t.TEXTURE_CUBE_MAP,S);let q;if(Ye){Be&&dt&&n.texStorage2D(t.TEXTURE_CUBE_MAP,de,Ke,Re.width,Re.height);for(let ee=0;ee<6;ee++){q=ye[ee].mipmaps;for(let pe=0;pe<q.length;pe++){const he=q[pe];S.format!==Zn?Ne!==null?Be?U&&n.compressedTexSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,pe,0,0,he.width,he.height,Ne,he.data):n.compressedTexImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,pe,Ke,he.width,he.height,0,he.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Be?U&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,pe,0,0,he.width,he.height,Ne,Me,he.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,pe,Ke,he.width,he.height,0,Ne,Me,he.data)}}}else{if(q=S.mipmaps,Be&&dt){q.length>0&&de++;const ee=Ae(ye[0]);n.texStorage2D(t.TEXTURE_CUBE_MAP,de,Ke,ee.width,ee.height)}for(let ee=0;ee<6;ee++)if(re){Be?U&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,0,0,ye[ee].width,ye[ee].height,Ne,Me,ye[ee].data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,Ke,ye[ee].width,ye[ee].height,0,Ne,Me,ye[ee].data);for(let pe=0;pe<q.length;pe++){const Oe=q[pe].image[ee].image;Be?U&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,pe+1,0,0,Oe.width,Oe.height,Ne,Me,Oe.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,pe+1,Ke,Oe.width,Oe.height,0,Ne,Me,Oe.data)}}else{Be?U&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,0,0,Ne,Me,ye[ee]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,Ke,Ne,Me,ye[ee]);for(let pe=0;pe<q.length;pe++){const he=q[pe];Be?U&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,pe+1,0,0,Ne,Me,he.image[ee]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ee,pe+1,Ke,Ne,Me,he.image[ee])}}}m(S)&&u(t.TEXTURE_CUBE_MAP),B.__version=L.version,S.onUpdate&&S.onUpdate(S)}C.__version=S.version}function ce(C,S,H,J,L,B){const ge=s.convert(H.format,H.colorSpace),ue=s.convert(H.type),ve=x(H.internalFormat,ge,ue,H.colorSpace),Ye=i.get(S),re=i.get(H);if(re.__renderTarget=S,!Ye.__hasExternalTextures){const ye=Math.max(1,S.width>>B),Re=Math.max(1,S.height>>B);L===t.TEXTURE_3D||L===t.TEXTURE_2D_ARRAY?n.texImage3D(L,B,ve,ye,Re,S.depth,0,ge,ue,null):n.texImage2D(L,B,ve,ye,Re,0,ge,ue,null)}n.bindFramebuffer(t.FRAMEBUFFER,C),je(S)?a.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,J,L,re.__webglTexture,0,Pe(S)):(L===t.TEXTURE_2D||L>=t.TEXTURE_CUBE_MAP_POSITIVE_X&&L<=t.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&t.framebufferTexture2D(t.FRAMEBUFFER,J,L,re.__webglTexture,B),n.bindFramebuffer(t.FRAMEBUFFER,null)}function ae(C,S,H){if(t.bindRenderbuffer(t.RENDERBUFFER,C),S.depthBuffer){const J=S.depthTexture,L=J&&J.isDepthTexture?J.type:null,B=_(S.stencilBuffer,L),ge=S.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,ue=Pe(S);je(S)?a.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,ue,B,S.width,S.height):H?t.renderbufferStorageMultisample(t.RENDERBUFFER,ue,B,S.width,S.height):t.renderbufferStorage(t.RENDERBUFFER,B,S.width,S.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,ge,t.RENDERBUFFER,C)}else{const J=S.textures;for(let L=0;L<J.length;L++){const B=J[L],ge=s.convert(B.format,B.colorSpace),ue=s.convert(B.type),ve=x(B.internalFormat,ge,ue,B.colorSpace),Ye=Pe(S);H&&je(S)===!1?t.renderbufferStorageMultisample(t.RENDERBUFFER,Ye,ve,S.width,S.height):je(S)?a.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,Ye,ve,S.width,S.height):t.renderbufferStorage(t.RENDERBUFFER,ve,S.width,S.height)}}t.bindRenderbuffer(t.RENDERBUFFER,null)}function Ce(C,S){if(S&&S.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(n.bindFramebuffer(t.FRAMEBUFFER,C),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const J=i.get(S.depthTexture);J.__renderTarget=S,(!J.__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),Z(S.depthTexture,0);const L=J.__webglTexture,B=Pe(S);if(S.depthTexture.format===Us)je(S)?a.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,L,0,B):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,L,0);else if(S.depthTexture.format===Ys)je(S)?a.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,L,0,B):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,L,0);else throw new Error("Unknown depthTexture format")}function Le(C){const S=i.get(C),H=C.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==C.depthTexture){const J=C.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),J){const L=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,J.removeEventListener("dispose",L)};J.addEventListener("dispose",L),S.__depthDisposeCallback=L}S.__boundDepthTexture=J}if(C.depthTexture&&!S.__autoAllocateDepthBuffer){if(H)throw new Error("target.depthTexture not supported in Cube render targets");Ce(S.__webglFramebuffer,C)}else if(H){S.__webglDepthbuffer=[];for(let J=0;J<6;J++)if(n.bindFramebuffer(t.FRAMEBUFFER,S.__webglFramebuffer[J]),S.__webglDepthbuffer[J]===void 0)S.__webglDepthbuffer[J]=t.createRenderbuffer(),ae(S.__webglDepthbuffer[J],C,!1);else{const L=C.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,B=S.__webglDepthbuffer[J];t.bindRenderbuffer(t.RENDERBUFFER,B),t.framebufferRenderbuffer(t.FRAMEBUFFER,L,t.RENDERBUFFER,B)}}else if(n.bindFramebuffer(t.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=t.createRenderbuffer(),ae(S.__webglDepthbuffer,C,!1);else{const J=C.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,L=S.__webglDepthbuffer;t.bindRenderbuffer(t.RENDERBUFFER,L),t.framebufferRenderbuffer(t.FRAMEBUFFER,J,t.RENDERBUFFER,L)}n.bindFramebuffer(t.FRAMEBUFFER,null)}function Ue(C,S,H){const J=i.get(C);S!==void 0&&ce(J.__webglFramebuffer,C,C.texture,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,0),H!==void 0&&Le(C)}function ut(C){const S=C.texture,H=i.get(C),J=i.get(S);C.addEventListener("dispose",A);const L=C.textures,B=C.isWebGLCubeRenderTarget===!0,ge=L.length>1;if(ge||(J.__webglTexture===void 0&&(J.__webglTexture=t.createTexture()),J.__version=S.version,o.memory.textures++),B){H.__webglFramebuffer=[];for(let ue=0;ue<6;ue++)if(S.mipmaps&&S.mipmaps.length>0){H.__webglFramebuffer[ue]=[];for(let ve=0;ve<S.mipmaps.length;ve++)H.__webglFramebuffer[ue][ve]=t.createFramebuffer()}else H.__webglFramebuffer[ue]=t.createFramebuffer()}else{if(S.mipmaps&&S.mipmaps.length>0){H.__webglFramebuffer=[];for(let ue=0;ue<S.mipmaps.length;ue++)H.__webglFramebuffer[ue]=t.createFramebuffer()}else H.__webglFramebuffer=t.createFramebuffer();if(ge)for(let ue=0,ve=L.length;ue<ve;ue++){const Ye=i.get(L[ue]);Ye.__webglTexture===void 0&&(Ye.__webglTexture=t.createTexture(),o.memory.textures++)}if(C.samples>0&&je(C)===!1){H.__webglMultisampledFramebuffer=t.createFramebuffer(),H.__webglColorRenderbuffer=[],n.bindFramebuffer(t.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let ue=0;ue<L.length;ue++){const ve=L[ue];H.__webglColorRenderbuffer[ue]=t.createRenderbuffer(),t.bindRenderbuffer(t.RENDERBUFFER,H.__webglColorRenderbuffer[ue]);const Ye=s.convert(ve.format,ve.colorSpace),re=s.convert(ve.type),ye=x(ve.internalFormat,Ye,re,ve.colorSpace,C.isXRRenderTarget===!0),Re=Pe(C);t.renderbufferStorageMultisample(t.RENDERBUFFER,Re,ye,C.width,C.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+ue,t.RENDERBUFFER,H.__webglColorRenderbuffer[ue])}t.bindRenderbuffer(t.RENDERBUFFER,null),C.depthBuffer&&(H.__webglDepthRenderbuffer=t.createRenderbuffer(),ae(H.__webglDepthRenderbuffer,C,!0)),n.bindFramebuffer(t.FRAMEBUFFER,null)}}if(B){n.bindTexture(t.TEXTURE_CUBE_MAP,J.__webglTexture),_e(t.TEXTURE_CUBE_MAP,S);for(let ue=0;ue<6;ue++)if(S.mipmaps&&S.mipmaps.length>0)for(let ve=0;ve<S.mipmaps.length;ve++)ce(H.__webglFramebuffer[ue][ve],C,S,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+ue,ve);else ce(H.__webglFramebuffer[ue],C,S,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+ue,0);m(S)&&u(t.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(ge){for(let ue=0,ve=L.length;ue<ve;ue++){const Ye=L[ue],re=i.get(Ye);n.bindTexture(t.TEXTURE_2D,re.__webglTexture),_e(t.TEXTURE_2D,Ye),ce(H.__webglFramebuffer,C,Ye,t.COLOR_ATTACHMENT0+ue,t.TEXTURE_2D,0),m(Ye)&&u(t.TEXTURE_2D)}n.unbindTexture()}else{let ue=t.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(ue=C.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(ue,J.__webglTexture),_e(ue,S),S.mipmaps&&S.mipmaps.length>0)for(let ve=0;ve<S.mipmaps.length;ve++)ce(H.__webglFramebuffer[ve],C,S,t.COLOR_ATTACHMENT0,ue,ve);else ce(H.__webglFramebuffer,C,S,t.COLOR_ATTACHMENT0,ue,0);m(S)&&u(ue),n.unbindTexture()}C.depthBuffer&&Le(C)}function We(C){const S=C.textures;for(let H=0,J=S.length;H<J;H++){const L=S[H];if(m(L)){const B=g(C),ge=i.get(L).__webglTexture;n.bindTexture(B,ge),u(B),n.unbindTexture()}}}const Xe=[],I=[];function tn(C){if(C.samples>0){if(je(C)===!1){const S=C.textures,H=C.width,J=C.height;let L=t.COLOR_BUFFER_BIT;const B=C.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,ge=i.get(C),ue=S.length>1;if(ue)for(let ve=0;ve<S.length;ve++)n.bindFramebuffer(t.FRAMEBUFFER,ge.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+ve,t.RENDERBUFFER,null),n.bindFramebuffer(t.FRAMEBUFFER,ge.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+ve,t.TEXTURE_2D,null,0);n.bindFramebuffer(t.READ_FRAMEBUFFER,ge.__webglMultisampledFramebuffer),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,ge.__webglFramebuffer);for(let ve=0;ve<S.length;ve++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(L|=t.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(L|=t.STENCIL_BUFFER_BIT)),ue){t.framebufferRenderbuffer(t.READ_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.RENDERBUFFER,ge.__webglColorRenderbuffer[ve]);const Ye=i.get(S[ve]).__webglTexture;t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,Ye,0)}t.blitFramebuffer(0,0,H,J,0,0,H,J,L,t.NEAREST),l===!0&&(Xe.length=0,I.length=0,Xe.push(t.COLOR_ATTACHMENT0+ve),C.depthBuffer&&C.resolveDepthBuffer===!1&&(Xe.push(B),I.push(B),t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,I)),t.invalidateFramebuffer(t.READ_FRAMEBUFFER,Xe))}if(n.bindFramebuffer(t.READ_FRAMEBUFFER,null),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),ue)for(let ve=0;ve<S.length;ve++){n.bindFramebuffer(t.FRAMEBUFFER,ge.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+ve,t.RENDERBUFFER,ge.__webglColorRenderbuffer[ve]);const Ye=i.get(S[ve]).__webglTexture;n.bindFramebuffer(t.FRAMEBUFFER,ge.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+ve,t.TEXTURE_2D,Ye,0)}n.bindFramebuffer(t.DRAW_FRAMEBUFFER,ge.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&l){const S=C.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,[S])}}}function Pe(C){return Math.min(r.maxSamples,C.samples)}function je(C){const S=i.get(C);return C.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function be(C){const S=o.render.frame;d.get(C)!==S&&(d.set(C,S),C.update())}function st(C,S){const H=C.colorSpace,J=C.format,L=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||H!==eo&&H!==In&&(qe.getTransfer(H)===ot?(J!==Zn||L!==Ri)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",H)),S}function Ae(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(c.width=C.naturalWidth||C.width,c.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(c.width=C.displayWidth,c.height=C.displayHeight):(c.width=C.width,c.height=C.height),c}this.allocateTextureUnit=z,this.resetTextureUnits=V,this.setTexture2D=Z,this.setTexture2DArray=Y,this.setTexture3D=te,this.setTextureCube=N,this.rebindTextures=Ue,this.setupRenderTarget=ut,this.updateRenderTargetMipmap=We,this.updateMultisampleRenderTarget=tn,this.setupDepthRenderbuffer=Le,this.setupFrameBufferTexture=ce,this.useMultisampledRTT=je}function k2(t,e){function n(i,r=In){let s;const o=qe.getTransfer(r);if(i===Ri)return t.UNSIGNED_BYTE;if(i===uf)return t.UNSIGNED_SHORT_4_4_4_4;if(i===df)return t.UNSIGNED_SHORT_5_5_5_1;if(i===bv)return t.UNSIGNED_INT_5_9_9_9_REV;if(i===Tv)return t.BYTE;if(i===Av)return t.SHORT;if(i===aa)return t.UNSIGNED_SHORT;if(i===cf)return t.INT;if(i===Gr)return t.UNSIGNED_INT;if(i===ai)return t.FLOAT;if(i===ga)return t.HALF_FLOAT;if(i===Cv)return t.ALPHA;if(i===Pv)return t.RGB;if(i===Zn)return t.RGBA;if(i===Rv)return t.LUMINANCE;if(i===Dv)return t.LUMINANCE_ALPHA;if(i===Us)return t.DEPTH_COMPONENT;if(i===Ys)return t.DEPTH_STENCIL;if(i===hf)return t.RED;if(i===ff)return t.RED_INTEGER;if(i===Nv)return t.RG;if(i===pf)return t.RG_INTEGER;if(i===mf)return t.RGBA_INTEGER;if(i===Sl||i===wl||i===El||i===Tl)if(o===ot)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===Sl)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===wl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===El)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Tl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===Sl)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===wl)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===El)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Tl)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Ud||i===Od||i===Fd||i===kd)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===Ud)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Od)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Fd)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===kd)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Bd||i===zd||i===Hd)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===Bd||i===zd)return o===ot?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===Hd)return o===ot?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Vd||i===Gd||i===Wd||i===jd||i===Xd||i===Kd||i===Yd||i===qd||i===$d||i===Zd||i===Qd||i===Jd||i===eh||i===th)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===Vd)return o===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Gd)return o===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Wd)return o===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===jd)return o===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Xd)return o===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Kd)return o===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Yd)return o===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===qd)return o===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===$d)return o===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Zd)return o===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Qd)return o===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Jd)return o===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===eh)return o===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===th)return o===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Al||i===nh||i===ih)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===Al)return o===ot?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===nh)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===ih)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Lv||i===rh||i===sh||i===oh)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===Al)return s.COMPRESSED_RED_RGTC1_EXT;if(i===rh)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===sh)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===oh)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Ks?t.UNSIGNED_INT_24_8:t[i]!==void 0?t[i]:null}return{convert:n}}class B2 extends Sn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class on extends Wt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const z2={type:"move"};class Su{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new on,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new on,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new R,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new R),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new on,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new R,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new R),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const n=this._hand;if(n)for(const i of e.hand.values())this._getHandJoint(n,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,n,i){let r=null,s=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(e&&n.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(const y of e.hand.values()){const m=n.getJointPose(y,i),u=this._getHandJoint(c,y);m!==null&&(u.matrix.fromArray(m.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,u.jointRadius=m.radius),u.visible=m!==null}const d=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],f=d.position.distanceTo(h.position),p=.02,v=.005;c.inputState.pinching&&f>p+v?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=p-v&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=n.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(r=n.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(z2)))}return a!==null&&(a.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,n){if(e.joints[n.jointName]===void 0){const i=new on;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[n.jointName]=i,e.add(i)}return e.joints[n.jointName]}}const H2=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,V2=`
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

}`;class G2{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,n,i){if(this.texture===null){const r=new zt,s=e.properties.get(r);s.__webglTexture=n.texture,(n.depthNear!=i.depthNear||n.depthFar!=i.depthFar)&&(this.depthNear=n.depthNear,this.depthFar=n.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){const n=e.cameras[0].viewport,i=new vt({vertexShader:H2,fragmentShader:V2,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new lt(new jr(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class W2 extends to{constructor(e,n){super();const i=this;let r=null,s=1,o=null,a="local-floor",l=1,c=null,d=null,h=null,f=null,p=null,v=null;const y=new G2,m=n.getContextAttributes();let u=null,g=null;const x=[],_=[],P=new He;let T=null;const A=new Sn;A.viewport=new at;const b=new Sn;b.viewport=new at;const w=[A,b],M=new B2;let D=null,V=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(K){let ne=x[K];return ne===void 0&&(ne=new Su,x[K]=ne),ne.getTargetRaySpace()},this.getControllerGrip=function(K){let ne=x[K];return ne===void 0&&(ne=new Su,x[K]=ne),ne.getGripSpace()},this.getHand=function(K){let ne=x[K];return ne===void 0&&(ne=new Su,x[K]=ne),ne.getHandSpace()};function z(K){const ne=_.indexOf(K.inputSource);if(ne===-1)return;const ce=x[ne];ce!==void 0&&(ce.update(K.inputSource,K.frame,c||o),ce.dispatchEvent({type:K.type,data:K.inputSource}))}function X(){r.removeEventListener("select",z),r.removeEventListener("selectstart",z),r.removeEventListener("selectend",z),r.removeEventListener("squeeze",z),r.removeEventListener("squeezestart",z),r.removeEventListener("squeezeend",z),r.removeEventListener("end",X),r.removeEventListener("inputsourceschange",Z);for(let K=0;K<x.length;K++){const ne=_[K];ne!==null&&(_[K]=null,x[K].disconnect(ne))}D=null,V=null,y.reset(),e.setRenderTarget(u),p=null,f=null,h=null,r=null,g=null,Ve.stop(),i.isPresenting=!1,e.setPixelRatio(T),e.setSize(P.width,P.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(K){s=K,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(K){a=K,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(K){c=K},this.getBaseLayer=function(){return f!==null?f:p},this.getBinding=function(){return h},this.getFrame=function(){return v},this.getSession=function(){return r},this.setSession=async function(K){if(r=K,r!==null){if(u=e.getRenderTarget(),r.addEventListener("select",z),r.addEventListener("selectstart",z),r.addEventListener("selectend",z),r.addEventListener("squeeze",z),r.addEventListener("squeezestart",z),r.addEventListener("squeezeend",z),r.addEventListener("end",X),r.addEventListener("inputsourceschange",Z),m.xrCompatible!==!0&&await n.makeXRCompatible(),T=e.getPixelRatio(),e.getSize(P),r.renderState.layers===void 0){const ne={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(r,n,ne),r.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),g=new Wr(p.framebufferWidth,p.framebufferHeight,{format:Zn,type:Ri,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil})}else{let ne=null,ce=null,ae=null;m.depth&&(ae=m.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,ne=m.stencil?Ys:Us,ce=m.stencil?Ks:Gr);const Ce={colorFormat:n.RGBA8,depthFormat:ae,scaleFactor:s};h=new XRWebGLBinding(r,n),f=h.createProjectionLayer(Ce),r.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),g=new Wr(f.textureWidth,f.textureHeight,{format:Zn,type:Ri,depthTexture:new Xv(f.textureWidth,f.textureHeight,ce,void 0,void 0,void 0,void 0,void 0,void 0,ne),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1})}g.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await r.requestReferenceSpace(a),Ve.setContext(r),Ve.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return y.getDepthTexture()};function Z(K){for(let ne=0;ne<K.removed.length;ne++){const ce=K.removed[ne],ae=_.indexOf(ce);ae>=0&&(_[ae]=null,x[ae].disconnect(ce))}for(let ne=0;ne<K.added.length;ne++){const ce=K.added[ne];let ae=_.indexOf(ce);if(ae===-1){for(let Le=0;Le<x.length;Le++)if(Le>=_.length){_.push(ce),ae=Le;break}else if(_[Le]===null){_[Le]=ce,ae=Le;break}if(ae===-1)break}const Ce=x[ae];Ce&&Ce.connect(ce)}}const Y=new R,te=new R;function N(K,ne,ce){Y.setFromMatrixPosition(ne.matrixWorld),te.setFromMatrixPosition(ce.matrixWorld);const ae=Y.distanceTo(te),Ce=ne.projectionMatrix.elements,Le=ce.projectionMatrix.elements,Ue=Ce[14]/(Ce[10]-1),ut=Ce[14]/(Ce[10]+1),We=(Ce[9]+1)/Ce[5],Xe=(Ce[9]-1)/Ce[5],I=(Ce[8]-1)/Ce[0],tn=(Le[8]+1)/Le[0],Pe=Ue*I,je=Ue*tn,be=ae/(-I+tn),st=be*-I;if(ne.matrixWorld.decompose(K.position,K.quaternion,K.scale),K.translateX(st),K.translateZ(be),K.matrixWorld.compose(K.position,K.quaternion,K.scale),K.matrixWorldInverse.copy(K.matrixWorld).invert(),Ce[10]===-1)K.projectionMatrix.copy(ne.projectionMatrix),K.projectionMatrixInverse.copy(ne.projectionMatrixInverse);else{const Ae=Ue+be,C=ut+be,S=Pe-st,H=je+(ae-st),J=We*ut/C*Ae,L=Xe*ut/C*Ae;K.projectionMatrix.makePerspective(S,H,J,L,Ae,C),K.projectionMatrixInverse.copy(K.projectionMatrix).invert()}}function $(K,ne){ne===null?K.matrixWorld.copy(K.matrix):K.matrixWorld.multiplyMatrices(ne.matrixWorld,K.matrix),K.matrixWorldInverse.copy(K.matrixWorld).invert()}this.updateCamera=function(K){if(r===null)return;let ne=K.near,ce=K.far;y.texture!==null&&(y.depthNear>0&&(ne=y.depthNear),y.depthFar>0&&(ce=y.depthFar)),M.near=b.near=A.near=ne,M.far=b.far=A.far=ce,(D!==M.near||V!==M.far)&&(r.updateRenderState({depthNear:M.near,depthFar:M.far}),D=M.near,V=M.far),A.layers.mask=K.layers.mask|2,b.layers.mask=K.layers.mask|4,M.layers.mask=A.layers.mask|b.layers.mask;const ae=K.parent,Ce=M.cameras;$(M,ae);for(let Le=0;Le<Ce.length;Le++)$(Ce[Le],ae);Ce.length===2?N(M,A,b):M.projectionMatrix.copy(A.projectionMatrix),Q(K,M,ae)};function Q(K,ne,ce){ce===null?K.matrix.copy(ne.matrixWorld):(K.matrix.copy(ce.matrixWorld),K.matrix.invert(),K.matrix.multiply(ne.matrixWorld)),K.matrix.decompose(K.position,K.quaternion,K.scale),K.updateMatrixWorld(!0),K.projectionMatrix.copy(ne.projectionMatrix),K.projectionMatrixInverse.copy(ne.projectionMatrixInverse),K.isPerspectiveCamera&&(K.fov=la*2*Math.atan(1/K.projectionMatrix.elements[5]),K.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(f===null&&p===null))return l},this.setFoveation=function(K){l=K,f!==null&&(f.fixedFoveation=K),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=K)},this.hasDepthSensing=function(){return y.texture!==null},this.getDepthSensingMesh=function(){return y.getMesh(M)};let oe=null;function _e(K,ne){if(d=ne.getViewerPose(c||o),v=ne,d!==null){const ce=d.views;p!==null&&(e.setRenderTargetFramebuffer(g,p.framebuffer),e.setRenderTarget(g));let ae=!1;ce.length!==M.cameras.length&&(M.cameras.length=0,ae=!0);for(let Le=0;Le<ce.length;Le++){const Ue=ce[Le];let ut=null;if(p!==null)ut=p.getViewport(Ue);else{const Xe=h.getViewSubImage(f,Ue);ut=Xe.viewport,Le===0&&(e.setRenderTargetTextures(g,Xe.colorTexture,f.ignoreDepthValues?void 0:Xe.depthStencilTexture),e.setRenderTarget(g))}let We=w[Le];We===void 0&&(We=new Sn,We.layers.enable(Le),We.viewport=new at,w[Le]=We),We.matrix.fromArray(Ue.transform.matrix),We.matrix.decompose(We.position,We.quaternion,We.scale),We.projectionMatrix.fromArray(Ue.projectionMatrix),We.projectionMatrixInverse.copy(We.projectionMatrix).invert(),We.viewport.set(ut.x,ut.y,ut.width,ut.height),Le===0&&(M.matrix.copy(We.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),ae===!0&&M.cameras.push(We)}const Ce=r.enabledFeatures;if(Ce&&Ce.includes("depth-sensing")){const Le=h.getDepthInformation(ce[0]);Le&&Le.isValid&&Le.texture&&y.init(e,Le,r.renderState)}}for(let ce=0;ce<x.length;ce++){const ae=_[ce],Ce=x[ce];ae!==null&&Ce!==void 0&&Ce.update(ae,ne,c||o)}oe&&oe(K,ne),ne.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ne}),v=null}const Ve=new jv;Ve.setAnimationLoop(_e),this.setAnimationLoop=function(K){oe=K},this.dispose=function(){}}}const Mr=new ui,j2=new rt;function X2(t,e){function n(m,u){m.matrixAutoUpdate===!0&&m.updateMatrix(),u.value.copy(m.matrix)}function i(m,u){u.color.getRGB(m.fogColor.value,Vv(t)),u.isFog?(m.fogNear.value=u.near,m.fogFar.value=u.far):u.isFogExp2&&(m.fogDensity.value=u.density)}function r(m,u,g,x,_){u.isMeshBasicMaterial||u.isMeshLambertMaterial?s(m,u):u.isMeshToonMaterial?(s(m,u),h(m,u)):u.isMeshPhongMaterial?(s(m,u),d(m,u)):u.isMeshStandardMaterial?(s(m,u),f(m,u),u.isMeshPhysicalMaterial&&p(m,u,_)):u.isMeshMatcapMaterial?(s(m,u),v(m,u)):u.isMeshDepthMaterial?s(m,u):u.isMeshDistanceMaterial?(s(m,u),y(m,u)):u.isMeshNormalMaterial?s(m,u):u.isLineBasicMaterial?(o(m,u),u.isLineDashedMaterial&&a(m,u)):u.isPointsMaterial?l(m,u,g,x):u.isSpriteMaterial?c(m,u):u.isShadowMaterial?(m.color.value.copy(u.color),m.opacity.value=u.opacity):u.isShaderMaterial&&(u.uniformsNeedUpdate=!1)}function s(m,u){m.opacity.value=u.opacity,u.color&&m.diffuse.value.copy(u.color),u.emissive&&m.emissive.value.copy(u.emissive).multiplyScalar(u.emissiveIntensity),u.map&&(m.map.value=u.map,n(u.map,m.mapTransform)),u.alphaMap&&(m.alphaMap.value=u.alphaMap,n(u.alphaMap,m.alphaMapTransform)),u.bumpMap&&(m.bumpMap.value=u.bumpMap,n(u.bumpMap,m.bumpMapTransform),m.bumpScale.value=u.bumpScale,u.side===Lt&&(m.bumpScale.value*=-1)),u.normalMap&&(m.normalMap.value=u.normalMap,n(u.normalMap,m.normalMapTransform),m.normalScale.value.copy(u.normalScale),u.side===Lt&&m.normalScale.value.negate()),u.displacementMap&&(m.displacementMap.value=u.displacementMap,n(u.displacementMap,m.displacementMapTransform),m.displacementScale.value=u.displacementScale,m.displacementBias.value=u.displacementBias),u.emissiveMap&&(m.emissiveMap.value=u.emissiveMap,n(u.emissiveMap,m.emissiveMapTransform)),u.specularMap&&(m.specularMap.value=u.specularMap,n(u.specularMap,m.specularMapTransform)),u.alphaTest>0&&(m.alphaTest.value=u.alphaTest);const g=e.get(u),x=g.envMap,_=g.envMapRotation;x&&(m.envMap.value=x,Mr.copy(_),Mr.x*=-1,Mr.y*=-1,Mr.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(Mr.y*=-1,Mr.z*=-1),m.envMapRotation.value.setFromMatrix4(j2.makeRotationFromEuler(Mr)),m.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=u.reflectivity,m.ior.value=u.ior,m.refractionRatio.value=u.refractionRatio),u.lightMap&&(m.lightMap.value=u.lightMap,m.lightMapIntensity.value=u.lightMapIntensity,n(u.lightMap,m.lightMapTransform)),u.aoMap&&(m.aoMap.value=u.aoMap,m.aoMapIntensity.value=u.aoMapIntensity,n(u.aoMap,m.aoMapTransform))}function o(m,u){m.diffuse.value.copy(u.color),m.opacity.value=u.opacity,u.map&&(m.map.value=u.map,n(u.map,m.mapTransform))}function a(m,u){m.dashSize.value=u.dashSize,m.totalSize.value=u.dashSize+u.gapSize,m.scale.value=u.scale}function l(m,u,g,x){m.diffuse.value.copy(u.color),m.opacity.value=u.opacity,m.size.value=u.size*g,m.scale.value=x*.5,u.map&&(m.map.value=u.map,n(u.map,m.uvTransform)),u.alphaMap&&(m.alphaMap.value=u.alphaMap,n(u.alphaMap,m.alphaMapTransform)),u.alphaTest>0&&(m.alphaTest.value=u.alphaTest)}function c(m,u){m.diffuse.value.copy(u.color),m.opacity.value=u.opacity,m.rotation.value=u.rotation,u.map&&(m.map.value=u.map,n(u.map,m.mapTransform)),u.alphaMap&&(m.alphaMap.value=u.alphaMap,n(u.alphaMap,m.alphaMapTransform)),u.alphaTest>0&&(m.alphaTest.value=u.alphaTest)}function d(m,u){m.specular.value.copy(u.specular),m.shininess.value=Math.max(u.shininess,1e-4)}function h(m,u){u.gradientMap&&(m.gradientMap.value=u.gradientMap)}function f(m,u){m.metalness.value=u.metalness,u.metalnessMap&&(m.metalnessMap.value=u.metalnessMap,n(u.metalnessMap,m.metalnessMapTransform)),m.roughness.value=u.roughness,u.roughnessMap&&(m.roughnessMap.value=u.roughnessMap,n(u.roughnessMap,m.roughnessMapTransform)),u.envMap&&(m.envMapIntensity.value=u.envMapIntensity)}function p(m,u,g){m.ior.value=u.ior,u.sheen>0&&(m.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen),m.sheenRoughness.value=u.sheenRoughness,u.sheenColorMap&&(m.sheenColorMap.value=u.sheenColorMap,n(u.sheenColorMap,m.sheenColorMapTransform)),u.sheenRoughnessMap&&(m.sheenRoughnessMap.value=u.sheenRoughnessMap,n(u.sheenRoughnessMap,m.sheenRoughnessMapTransform))),u.clearcoat>0&&(m.clearcoat.value=u.clearcoat,m.clearcoatRoughness.value=u.clearcoatRoughness,u.clearcoatMap&&(m.clearcoatMap.value=u.clearcoatMap,n(u.clearcoatMap,m.clearcoatMapTransform)),u.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=u.clearcoatRoughnessMap,n(u.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),u.clearcoatNormalMap&&(m.clearcoatNormalMap.value=u.clearcoatNormalMap,n(u.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(u.clearcoatNormalScale),u.side===Lt&&m.clearcoatNormalScale.value.negate())),u.dispersion>0&&(m.dispersion.value=u.dispersion),u.iridescence>0&&(m.iridescence.value=u.iridescence,m.iridescenceIOR.value=u.iridescenceIOR,m.iridescenceThicknessMinimum.value=u.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=u.iridescenceThicknessRange[1],u.iridescenceMap&&(m.iridescenceMap.value=u.iridescenceMap,n(u.iridescenceMap,m.iridescenceMapTransform)),u.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=u.iridescenceThicknessMap,n(u.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),u.transmission>0&&(m.transmission.value=u.transmission,m.transmissionSamplerMap.value=g.texture,m.transmissionSamplerSize.value.set(g.width,g.height),u.transmissionMap&&(m.transmissionMap.value=u.transmissionMap,n(u.transmissionMap,m.transmissionMapTransform)),m.thickness.value=u.thickness,u.thicknessMap&&(m.thicknessMap.value=u.thicknessMap,n(u.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=u.attenuationDistance,m.attenuationColor.value.copy(u.attenuationColor)),u.anisotropy>0&&(m.anisotropyVector.value.set(u.anisotropy*Math.cos(u.anisotropyRotation),u.anisotropy*Math.sin(u.anisotropyRotation)),u.anisotropyMap&&(m.anisotropyMap.value=u.anisotropyMap,n(u.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=u.specularIntensity,m.specularColor.value.copy(u.specularColor),u.specularColorMap&&(m.specularColorMap.value=u.specularColorMap,n(u.specularColorMap,m.specularColorMapTransform)),u.specularIntensityMap&&(m.specularIntensityMap.value=u.specularIntensityMap,n(u.specularIntensityMap,m.specularIntensityMapTransform))}function v(m,u){u.matcap&&(m.matcap.value=u.matcap)}function y(m,u){const g=e.get(u).light;m.referencePosition.value.setFromMatrixPosition(g.matrixWorld),m.nearDistance.value=g.shadow.camera.near,m.farDistance.value=g.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function K2(t,e,n,i){let r={},s={},o=[];const a=t.getParameter(t.MAX_UNIFORM_BUFFER_BINDINGS);function l(g,x){const _=x.program;i.uniformBlockBinding(g,_)}function c(g,x){let _=r[g.id];_===void 0&&(v(g),_=d(g),r[g.id]=_,g.addEventListener("dispose",m));const P=x.program;i.updateUBOMapping(g,P);const T=e.render.frame;s[g.id]!==T&&(f(g),s[g.id]=T)}function d(g){const x=h();g.__bindingPointIndex=x;const _=t.createBuffer(),P=g.__size,T=g.usage;return t.bindBuffer(t.UNIFORM_BUFFER,_),t.bufferData(t.UNIFORM_BUFFER,P,T),t.bindBuffer(t.UNIFORM_BUFFER,null),t.bindBufferBase(t.UNIFORM_BUFFER,x,_),_}function h(){for(let g=0;g<a;g++)if(o.indexOf(g)===-1)return o.push(g),g;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(g){const x=r[g.id],_=g.uniforms,P=g.__cache;t.bindBuffer(t.UNIFORM_BUFFER,x);for(let T=0,A=_.length;T<A;T++){const b=Array.isArray(_[T])?_[T]:[_[T]];for(let w=0,M=b.length;w<M;w++){const D=b[w];if(p(D,T,w,P)===!0){const V=D.__offset,z=Array.isArray(D.value)?D.value:[D.value];let X=0;for(let Z=0;Z<z.length;Z++){const Y=z[Z],te=y(Y);typeof Y=="number"||typeof Y=="boolean"?(D.__data[0]=Y,t.bufferSubData(t.UNIFORM_BUFFER,V+X,D.__data)):Y.isMatrix3?(D.__data[0]=Y.elements[0],D.__data[1]=Y.elements[1],D.__data[2]=Y.elements[2],D.__data[3]=0,D.__data[4]=Y.elements[3],D.__data[5]=Y.elements[4],D.__data[6]=Y.elements[5],D.__data[7]=0,D.__data[8]=Y.elements[6],D.__data[9]=Y.elements[7],D.__data[10]=Y.elements[8],D.__data[11]=0):(Y.toArray(D.__data,X),X+=te.storage/Float32Array.BYTES_PER_ELEMENT)}t.bufferSubData(t.UNIFORM_BUFFER,V,D.__data)}}}t.bindBuffer(t.UNIFORM_BUFFER,null)}function p(g,x,_,P){const T=g.value,A=x+"_"+_;if(P[A]===void 0)return typeof T=="number"||typeof T=="boolean"?P[A]=T:P[A]=T.clone(),!0;{const b=P[A];if(typeof T=="number"||typeof T=="boolean"){if(b!==T)return P[A]=T,!0}else if(b.equals(T)===!1)return b.copy(T),!0}return!1}function v(g){const x=g.uniforms;let _=0;const P=16;for(let A=0,b=x.length;A<b;A++){const w=Array.isArray(x[A])?x[A]:[x[A]];for(let M=0,D=w.length;M<D;M++){const V=w[M],z=Array.isArray(V.value)?V.value:[V.value];for(let X=0,Z=z.length;X<Z;X++){const Y=z[X],te=y(Y),N=_%P,$=N%te.boundary,Q=N+$;_+=$,Q!==0&&P-Q<te.storage&&(_+=P-Q),V.__data=new Float32Array(te.storage/Float32Array.BYTES_PER_ELEMENT),V.__offset=_,_+=te.storage}}}const T=_%P;return T>0&&(_+=P-T),g.__size=_,g.__cache={},this}function y(g){const x={boundary:0,storage:0};return typeof g=="number"||typeof g=="boolean"?(x.boundary=4,x.storage=4):g.isVector2?(x.boundary=8,x.storage=8):g.isVector3||g.isColor?(x.boundary=16,x.storage=12):g.isVector4?(x.boundary=16,x.storage=16):g.isMatrix3?(x.boundary=48,x.storage=48):g.isMatrix4?(x.boundary=64,x.storage=64):g.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",g),x}function m(g){const x=g.target;x.removeEventListener("dispose",m);const _=o.indexOf(x.__bindingPointIndex);o.splice(_,1),t.deleteBuffer(r[x.id]),delete r[x.id],delete s[x.id]}function u(){for(const g in r)t.deleteBuffer(r[g]);o=[],r={},s={}}return{bind:l,update:c,dispose:u}}class Y2{constructor(e={}){const{canvas:n=UM(),context:i=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:h=!1,reverseDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=o;const v=new Uint32Array(4),y=new Int32Array(4);let m=null,u=null;const g=[],x=[];this.domElement=n,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Vt,this.toneMapping=or,this.toneMappingExposure=1;const _=this;let P=!1,T=0,A=0,b=null,w=-1,M=null;const D=new at,V=new at;let z=null;const X=new me(0);let Z=0,Y=n.width,te=n.height,N=1,$=null,Q=null;const oe=new at(0,0,Y,te),_e=new at(0,0,Y,te);let Ve=!1;const K=new _f;let ne=!1,ce=!1;const ae=new rt,Ce=new rt,Le=new R,Ue=new at,ut={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let We=!1;function Xe(){return b===null?N:1}let I=i;function tn(E,O){return n.getContext(E,O)}try{const E={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:d,failIfMajorPerformanceCaveat:h};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${lf}`),n.addEventListener("webglcontextlost",ee,!1),n.addEventListener("webglcontextrestored",pe,!1),n.addEventListener("webglcontextcreationerror",he,!1),I===null){const O="webgl2";if(I=tn(O,E),I===null)throw tn(O)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let Pe,je,be,st,Ae,C,S,H,J,L,B,ge,ue,ve,Ye,re,ye,Re,Ne,Me,Ke,Be,dt,U;function de(){Pe=new Jw(I),Pe.init(),Be=new k2(I,Pe),je=new Xw(I,Pe,e,Be),be=new U2(I,Pe),je.reverseDepthBuffer&&f&&be.buffers.depth.setReversed(!0),st=new nE(I),Ae=new y2,C=new F2(I,Pe,be,Ae,je,Be,st),S=new Yw(_),H=new Qw(_),J=new lS(I),dt=new Ww(I,J),L=new eE(I,J,st,dt),B=new rE(I,L,J,st),Ne=new iE(I,je,C),re=new Kw(Ae),ge=new _2(_,S,H,Pe,je,dt,re),ue=new X2(_,Ae),ve=new S2,Ye=new C2(Pe),Re=new Gw(_,S,H,be,B,p,l),ye=new L2(_,B,je),U=new K2(I,st,je,be),Me=new jw(I,Pe,st),Ke=new tE(I,Pe,st),st.programs=ge.programs,_.capabilities=je,_.extensions=Pe,_.properties=Ae,_.renderLists=ve,_.shadowMap=ye,_.state=be,_.info=st}de();const q=new W2(_,I);this.xr=q,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){const E=Pe.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=Pe.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return N},this.setPixelRatio=function(E){E!==void 0&&(N=E,this.setSize(Y,te,!1))},this.getSize=function(E){return E.set(Y,te)},this.setSize=function(E,O,G=!0){if(q.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}Y=E,te=O,n.width=Math.floor(E*N),n.height=Math.floor(O*N),G===!0&&(n.style.width=E+"px",n.style.height=O+"px"),this.setViewport(0,0,E,O)},this.getDrawingBufferSize=function(E){return E.set(Y*N,te*N).floor()},this.setDrawingBufferSize=function(E,O,G){Y=E,te=O,N=G,n.width=Math.floor(E*G),n.height=Math.floor(O*G),this.setViewport(0,0,E,O)},this.getCurrentViewport=function(E){return E.copy(D)},this.getViewport=function(E){return E.copy(oe)},this.setViewport=function(E,O,G,W){E.isVector4?oe.set(E.x,E.y,E.z,E.w):oe.set(E,O,G,W),be.viewport(D.copy(oe).multiplyScalar(N).round())},this.getScissor=function(E){return E.copy(_e)},this.setScissor=function(E,O,G,W){E.isVector4?_e.set(E.x,E.y,E.z,E.w):_e.set(E,O,G,W),be.scissor(V.copy(_e).multiplyScalar(N).round())},this.getScissorTest=function(){return Ve},this.setScissorTest=function(E){be.setScissorTest(Ve=E)},this.setOpaqueSort=function(E){$=E},this.setTransparentSort=function(E){Q=E},this.getClearColor=function(E){return E.copy(Re.getClearColor())},this.setClearColor=function(){Re.setClearColor.apply(Re,arguments)},this.getClearAlpha=function(){return Re.getClearAlpha()},this.setClearAlpha=function(){Re.setClearAlpha.apply(Re,arguments)},this.clear=function(E=!0,O=!0,G=!0){let W=0;if(E){let F=!1;if(b!==null){const se=b.texture.format;F=se===mf||se===pf||se===ff}if(F){const se=b.texture.type,fe=se===Ri||se===Gr||se===aa||se===Ks||se===uf||se===df,Se=Re.getClearColor(),we=Re.getClearAlpha(),Ie=Se.r,Fe=Se.g,Ee=Se.b;fe?(v[0]=Ie,v[1]=Fe,v[2]=Ee,v[3]=we,I.clearBufferuiv(I.COLOR,0,v)):(y[0]=Ie,y[1]=Fe,y[2]=Ee,y[3]=we,I.clearBufferiv(I.COLOR,0,y))}else W|=I.COLOR_BUFFER_BIT}O&&(W|=I.DEPTH_BUFFER_BIT),G&&(W|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),I.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){n.removeEventListener("webglcontextlost",ee,!1),n.removeEventListener("webglcontextrestored",pe,!1),n.removeEventListener("webglcontextcreationerror",he,!1),ve.dispose(),Ye.dispose(),Ae.dispose(),S.dispose(),H.dispose(),B.dispose(),dt.dispose(),U.dispose(),ge.dispose(),q.dispose(),q.removeEventListener("sessionstart",bf),q.removeEventListener("sessionend",Cf),mr.stop()};function ee(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),P=!0}function pe(){console.log("THREE.WebGLRenderer: Context Restored."),P=!1;const E=st.autoReset,O=ye.enabled,G=ye.autoUpdate,W=ye.needsUpdate,F=ye.type;de(),st.autoReset=E,ye.enabled=O,ye.autoUpdate=G,ye.needsUpdate=W,ye.type=F}function he(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function Oe(E){const O=E.target;O.removeEventListener("dispose",Oe),Tt(O)}function Tt(E){Xt(E),Ae.remove(E)}function Xt(E){const O=Ae.get(E).programs;O!==void 0&&(O.forEach(function(G){ge.releaseProgram(G)}),E.isShaderMaterial&&ge.releaseShaderCache(E))}this.renderBufferDirect=function(E,O,G,W,F,se){O===null&&(O=ut);const fe=F.isMesh&&F.matrixWorld.determinant()<0,Se=ex(E,O,G,W,F);be.setMaterial(W,fe);let we=G.index,Ie=1;if(W.wireframe===!0){if(we=L.getWireframeAttribute(G),we===void 0)return;Ie=2}const Fe=G.drawRange,Ee=G.attributes.position;let Ze=Fe.start*Ie,ht=(Fe.start+Fe.count)*Ie;se!==null&&(Ze=Math.max(Ze,se.start*Ie),ht=Math.min(ht,(se.start+se.count)*Ie)),we!==null?(Ze=Math.max(Ze,0),ht=Math.min(ht,we.count)):Ee!=null&&(Ze=Math.max(Ze,0),ht=Math.min(ht,Ee.count));const pt=ht-Ze;if(pt<0||pt===1/0)return;dt.setup(F,W,Se,G,we);let un,et=Me;if(we!==null&&(un=J.get(we),et=Ke,et.setIndex(un)),F.isMesh)W.wireframe===!0?(be.setLineWidth(W.wireframeLinewidth*Xe()),et.setMode(I.LINES)):et.setMode(I.TRIANGLES);else if(F.isLine){let Te=W.linewidth;Te===void 0&&(Te=1),be.setLineWidth(Te*Xe()),F.isLineSegments?et.setMode(I.LINES):F.isLineLoop?et.setMode(I.LINE_LOOP):et.setMode(I.LINE_STRIP)}else F.isPoints?et.setMode(I.POINTS):F.isSprite&&et.setMode(I.TRIANGLES);if(F.isBatchedMesh)if(F._multiDrawInstances!==null)et.renderMultiDrawInstances(F._multiDrawStarts,F._multiDrawCounts,F._multiDrawCount,F._multiDrawInstances);else if(Pe.get("WEBGL_multi_draw"))et.renderMultiDraw(F._multiDrawStarts,F._multiDrawCounts,F._multiDrawCount);else{const Te=F._multiDrawStarts,hi=F._multiDrawCounts,tt=F._multiDrawCount,zn=we?J.get(we).bytesPerElement:1,Zr=Ae.get(W).currentProgram.getUniforms();for(let vn=0;vn<tt;vn++)Zr.setValue(I,"_gl_DrawID",vn),et.render(Te[vn]/zn,hi[vn])}else if(F.isInstancedMesh)et.renderInstances(Ze,pt,F.count);else if(G.isInstancedBufferGeometry){const Te=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,hi=Math.min(G.instanceCount,Te);et.renderInstances(Ze,pt,hi)}else et.render(Ze,pt)};function nt(E,O,G){E.transparent===!0&&E.side===wn&&E.forceSinglePass===!1?(E.side=Lt,E.needsUpdate=!0,ya(E,O,G),E.side=ur,E.needsUpdate=!0,ya(E,O,G),E.side=wn):ya(E,O,G)}this.compile=function(E,O,G=null){G===null&&(G=E),u=Ye.get(G),u.init(O),x.push(u),G.traverseVisible(function(F){F.isLight&&F.layers.test(O.layers)&&(u.pushLight(F),F.castShadow&&u.pushShadow(F))}),E!==G&&E.traverseVisible(function(F){F.isLight&&F.layers.test(O.layers)&&(u.pushLight(F),F.castShadow&&u.pushShadow(F))}),u.setupLights();const W=new Set;return E.traverse(function(F){if(!(F.isMesh||F.isPoints||F.isLine||F.isSprite))return;const se=F.material;if(se)if(Array.isArray(se))for(let fe=0;fe<se.length;fe++){const Se=se[fe];nt(Se,G,F),W.add(Se)}else nt(se,G,F),W.add(se)}),x.pop(),u=null,W},this.compileAsync=function(E,O,G=null){const W=this.compile(E,O,G);return new Promise(F=>{function se(){if(W.forEach(function(fe){Ae.get(fe).currentProgram.isReady()&&W.delete(fe)}),W.size===0){F(E);return}setTimeout(se,10)}Pe.get("KHR_parallel_shader_compile")!==null?se():setTimeout(se,10)})};let Bn=null;function di(E){Bn&&Bn(E)}function bf(){mr.stop()}function Cf(){mr.start()}const mr=new jv;mr.setAnimationLoop(di),typeof self<"u"&&mr.setContext(self),this.setAnimationLoop=function(E){Bn=E,q.setAnimationLoop(E),E===null?mr.stop():mr.start()},q.addEventListener("sessionstart",bf),q.addEventListener("sessionend",Cf),this.render=function(E,O){if(O!==void 0&&O.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),q.enabled===!0&&q.isPresenting===!0&&(q.cameraAutoUpdate===!0&&q.updateCamera(O),O=q.getCamera()),E.isScene===!0&&E.onBeforeRender(_,E,O,b),u=Ye.get(E,x.length),u.init(O),x.push(u),Ce.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),K.setFromProjectionMatrix(Ce),ce=this.localClippingEnabled,ne=re.init(this.clippingPlanes,ce),m=ve.get(E,g.length),m.init(),g.push(m),q.enabled===!0&&q.isPresenting===!0){const se=_.xr.getDepthSensingMesh();se!==null&&Sc(se,O,-1/0,_.sortObjects)}Sc(E,O,0,_.sortObjects),m.finish(),_.sortObjects===!0&&m.sort($,Q),We=q.enabled===!1||q.isPresenting===!1||q.hasDepthSensing()===!1,We&&Re.addToRenderList(m,E),this.info.render.frame++,ne===!0&&re.beginShadows();const G=u.state.shadowsArray;ye.render(G,E,O),ne===!0&&re.endShadows(),this.info.autoReset===!0&&this.info.reset();const W=m.opaque,F=m.transmissive;if(u.setupLights(),O.isArrayCamera){const se=O.cameras;if(F.length>0)for(let fe=0,Se=se.length;fe<Se;fe++){const we=se[fe];Rf(W,F,E,we)}We&&Re.render(E);for(let fe=0,Se=se.length;fe<Se;fe++){const we=se[fe];Pf(m,E,we,we.viewport)}}else F.length>0&&Rf(W,F,E,O),We&&Re.render(E),Pf(m,E,O);b!==null&&(C.updateMultisampleRenderTarget(b),C.updateRenderTargetMipmap(b)),E.isScene===!0&&E.onAfterRender(_,E,O),dt.resetDefaultState(),w=-1,M=null,x.pop(),x.length>0?(u=x[x.length-1],ne===!0&&re.setGlobalState(_.clippingPlanes,u.state.camera)):u=null,g.pop(),g.length>0?m=g[g.length-1]:m=null};function Sc(E,O,G,W){if(E.visible===!1)return;if(E.layers.test(O.layers)){if(E.isGroup)G=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(O);else if(E.isLight)u.pushLight(E),E.castShadow&&u.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||K.intersectsSprite(E)){W&&Ue.setFromMatrixPosition(E.matrixWorld).applyMatrix4(Ce);const fe=B.update(E),Se=E.material;Se.visible&&m.push(E,fe,Se,G,Ue.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||K.intersectsObject(E))){const fe=B.update(E),Se=E.material;if(W&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),Ue.copy(E.boundingSphere.center)):(fe.boundingSphere===null&&fe.computeBoundingSphere(),Ue.copy(fe.boundingSphere.center)),Ue.applyMatrix4(E.matrixWorld).applyMatrix4(Ce)),Array.isArray(Se)){const we=fe.groups;for(let Ie=0,Fe=we.length;Ie<Fe;Ie++){const Ee=we[Ie],Ze=Se[Ee.materialIndex];Ze&&Ze.visible&&m.push(E,fe,Ze,G,Ue.z,Ee)}}else Se.visible&&m.push(E,fe,Se,G,Ue.z,null)}}const se=E.children;for(let fe=0,Se=se.length;fe<Se;fe++)Sc(se[fe],O,G,W)}function Pf(E,O,G,W){const F=E.opaque,se=E.transmissive,fe=E.transparent;u.setupLightsView(G),ne===!0&&re.setGlobalState(_.clippingPlanes,G),W&&be.viewport(D.copy(W)),F.length>0&&_a(F,O,G),se.length>0&&_a(se,O,G),fe.length>0&&_a(fe,O,G),be.buffers.depth.setTest(!0),be.buffers.depth.setMask(!0),be.buffers.color.setMask(!0),be.setPolygonOffset(!1)}function Rf(E,O,G,W){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;u.state.transmissionRenderTarget[W.id]===void 0&&(u.state.transmissionRenderTarget[W.id]=new Wr(1,1,{generateMipmaps:!0,type:Pe.has("EXT_color_buffer_half_float")||Pe.has("EXT_color_buffer_float")?ga:Ri,minFilter:$n,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:qe.workingColorSpace}));const se=u.state.transmissionRenderTarget[W.id],fe=W.viewport||D;se.setSize(fe.z,fe.w);const Se=_.getRenderTarget();_.setRenderTarget(se),_.getClearColor(X),Z=_.getClearAlpha(),Z<1&&_.setClearColor(16777215,.5),_.clear(),We&&Re.render(G);const we=_.toneMapping;_.toneMapping=or;const Ie=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),u.setupLightsView(W),ne===!0&&re.setGlobalState(_.clippingPlanes,W),_a(E,G,W),C.updateMultisampleRenderTarget(se),C.updateRenderTargetMipmap(se),Pe.has("WEBGL_multisampled_render_to_texture")===!1){let Fe=!1;for(let Ee=0,Ze=O.length;Ee<Ze;Ee++){const ht=O[Ee],pt=ht.object,un=ht.geometry,et=ht.material,Te=ht.group;if(et.side===wn&&pt.layers.test(W.layers)){const hi=et.side;et.side=Lt,et.needsUpdate=!0,Df(pt,G,W,un,et,Te),et.side=hi,et.needsUpdate=!0,Fe=!0}}Fe===!0&&(C.updateMultisampleRenderTarget(se),C.updateRenderTargetMipmap(se))}_.setRenderTarget(Se),_.setClearColor(X,Z),Ie!==void 0&&(W.viewport=Ie),_.toneMapping=we}function _a(E,O,G){const W=O.isScene===!0?O.overrideMaterial:null;for(let F=0,se=E.length;F<se;F++){const fe=E[F],Se=fe.object,we=fe.geometry,Ie=W===null?fe.material:W,Fe=fe.group;Se.layers.test(G.layers)&&Df(Se,O,G,we,Ie,Fe)}}function Df(E,O,G,W,F,se){E.onBeforeRender(_,O,G,W,F,se),E.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),F.onBeforeRender(_,O,G,W,E,se),F.transparent===!0&&F.side===wn&&F.forceSinglePass===!1?(F.side=Lt,F.needsUpdate=!0,_.renderBufferDirect(G,O,W,F,E,se),F.side=ur,F.needsUpdate=!0,_.renderBufferDirect(G,O,W,F,E,se),F.side=wn):_.renderBufferDirect(G,O,W,F,E,se),E.onAfterRender(_,O,G,W,F,se)}function ya(E,O,G){O.isScene!==!0&&(O=ut);const W=Ae.get(E),F=u.state.lights,se=u.state.shadowsArray,fe=F.state.version,Se=ge.getParameters(E,F.state,se,O,G),we=ge.getProgramCacheKey(Se);let Ie=W.programs;W.environment=E.isMeshStandardMaterial?O.environment:null,W.fog=O.fog,W.envMap=(E.isMeshStandardMaterial?H:S).get(E.envMap||W.environment),W.envMapRotation=W.environment!==null&&E.envMap===null?O.environmentRotation:E.envMapRotation,Ie===void 0&&(E.addEventListener("dispose",Oe),Ie=new Map,W.programs=Ie);let Fe=Ie.get(we);if(Fe!==void 0){if(W.currentProgram===Fe&&W.lightsStateVersion===fe)return Lf(E,Se),Fe}else Se.uniforms=ge.getUniforms(E),E.onBeforeCompile(Se,_),Fe=ge.acquireProgram(Se,we),Ie.set(we,Fe),W.uniforms=Se.uniforms;const Ee=W.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Ee.clippingPlanes=re.uniform),Lf(E,Se),W.needsLights=nx(E),W.lightsStateVersion=fe,W.needsLights&&(Ee.ambientLightColor.value=F.state.ambient,Ee.lightProbe.value=F.state.probe,Ee.directionalLights.value=F.state.directional,Ee.directionalLightShadows.value=F.state.directionalShadow,Ee.spotLights.value=F.state.spot,Ee.spotLightShadows.value=F.state.spotShadow,Ee.rectAreaLights.value=F.state.rectArea,Ee.ltc_1.value=F.state.rectAreaLTC1,Ee.ltc_2.value=F.state.rectAreaLTC2,Ee.pointLights.value=F.state.point,Ee.pointLightShadows.value=F.state.pointShadow,Ee.hemisphereLights.value=F.state.hemi,Ee.directionalShadowMap.value=F.state.directionalShadowMap,Ee.directionalShadowMatrix.value=F.state.directionalShadowMatrix,Ee.spotShadowMap.value=F.state.spotShadowMap,Ee.spotLightMatrix.value=F.state.spotLightMatrix,Ee.spotLightMap.value=F.state.spotLightMap,Ee.pointShadowMap.value=F.state.pointShadowMap,Ee.pointShadowMatrix.value=F.state.pointShadowMatrix),W.currentProgram=Fe,W.uniformsList=null,Fe}function Nf(E){if(E.uniformsList===null){const O=E.currentProgram.getUniforms();E.uniformsList=bl.seqWithValue(O.seq,E.uniforms)}return E.uniformsList}function Lf(E,O){const G=Ae.get(E);G.outputColorSpace=O.outputColorSpace,G.batching=O.batching,G.batchingColor=O.batchingColor,G.instancing=O.instancing,G.instancingColor=O.instancingColor,G.instancingMorph=O.instancingMorph,G.skinning=O.skinning,G.morphTargets=O.morphTargets,G.morphNormals=O.morphNormals,G.morphColors=O.morphColors,G.morphTargetsCount=O.morphTargetsCount,G.numClippingPlanes=O.numClippingPlanes,G.numIntersection=O.numClipIntersection,G.vertexAlphas=O.vertexAlphas,G.vertexTangents=O.vertexTangents,G.toneMapping=O.toneMapping}function ex(E,O,G,W,F){O.isScene!==!0&&(O=ut),C.resetTextureUnits();const se=O.fog,fe=W.isMeshStandardMaterial?O.environment:null,Se=b===null?_.outputColorSpace:b.isXRRenderTarget===!0?b.texture.colorSpace:eo,we=(W.isMeshStandardMaterial?H:S).get(W.envMap||fe),Ie=W.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,Fe=!!G.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),Ee=!!G.morphAttributes.position,Ze=!!G.morphAttributes.normal,ht=!!G.morphAttributes.color;let pt=or;W.toneMapped&&(b===null||b.isXRRenderTarget===!0)&&(pt=_.toneMapping);const un=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,et=un!==void 0?un.length:0,Te=Ae.get(W),hi=u.state.lights;if(ne===!0&&(ce===!0||E!==M)){const Rn=E===M&&W.id===w;re.setState(W,E,Rn)}let tt=!1;W.version===Te.__version?(Te.needsLights&&Te.lightsStateVersion!==hi.state.version||Te.outputColorSpace!==Se||F.isBatchedMesh&&Te.batching===!1||!F.isBatchedMesh&&Te.batching===!0||F.isBatchedMesh&&Te.batchingColor===!0&&F.colorTexture===null||F.isBatchedMesh&&Te.batchingColor===!1&&F.colorTexture!==null||F.isInstancedMesh&&Te.instancing===!1||!F.isInstancedMesh&&Te.instancing===!0||F.isSkinnedMesh&&Te.skinning===!1||!F.isSkinnedMesh&&Te.skinning===!0||F.isInstancedMesh&&Te.instancingColor===!0&&F.instanceColor===null||F.isInstancedMesh&&Te.instancingColor===!1&&F.instanceColor!==null||F.isInstancedMesh&&Te.instancingMorph===!0&&F.morphTexture===null||F.isInstancedMesh&&Te.instancingMorph===!1&&F.morphTexture!==null||Te.envMap!==we||W.fog===!0&&Te.fog!==se||Te.numClippingPlanes!==void 0&&(Te.numClippingPlanes!==re.numPlanes||Te.numIntersection!==re.numIntersection)||Te.vertexAlphas!==Ie||Te.vertexTangents!==Fe||Te.morphTargets!==Ee||Te.morphNormals!==Ze||Te.morphColors!==ht||Te.toneMapping!==pt||Te.morphTargetsCount!==et)&&(tt=!0):(tt=!0,Te.__version=W.version);let zn=Te.currentProgram;tt===!0&&(zn=ya(W,O,F));let Zr=!1,vn=!1,ro=!1;const mt=zn.getUniforms(),ti=Te.uniforms;if(be.useProgram(zn.program)&&(Zr=!0,vn=!0,ro=!0),W.id!==w&&(w=W.id,vn=!0),Zr||M!==E){be.buffers.depth.getReversed()?(ae.copy(E.projectionMatrix),FM(ae),kM(ae),mt.setValue(I,"projectionMatrix",ae)):mt.setValue(I,"projectionMatrix",E.projectionMatrix),mt.setValue(I,"viewMatrix",E.matrixWorldInverse);const Li=mt.map.cameraPosition;Li!==void 0&&Li.setValue(I,Le.setFromMatrixPosition(E.matrixWorld)),je.logarithmicDepthBuffer&&mt.setValue(I,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&mt.setValue(I,"isOrthographic",E.isOrthographicCamera===!0),M!==E&&(M=E,vn=!0,ro=!0)}if(F.isSkinnedMesh){mt.setOptional(I,F,"bindMatrix"),mt.setOptional(I,F,"bindMatrixInverse");const Rn=F.skeleton;Rn&&(Rn.boneTexture===null&&Rn.computeBoneTexture(),mt.setValue(I,"boneTexture",Rn.boneTexture,C))}F.isBatchedMesh&&(mt.setOptional(I,F,"batchingTexture"),mt.setValue(I,"batchingTexture",F._matricesTexture,C),mt.setOptional(I,F,"batchingIdTexture"),mt.setValue(I,"batchingIdTexture",F._indirectTexture,C),mt.setOptional(I,F,"batchingColorTexture"),F._colorsTexture!==null&&mt.setValue(I,"batchingColorTexture",F._colorsTexture,C));const so=G.morphAttributes;if((so.position!==void 0||so.normal!==void 0||so.color!==void 0)&&Ne.update(F,G,zn),(vn||Te.receiveShadow!==F.receiveShadow)&&(Te.receiveShadow=F.receiveShadow,mt.setValue(I,"receiveShadow",F.receiveShadow)),W.isMeshGouraudMaterial&&W.envMap!==null&&(ti.envMap.value=we,ti.flipEnvMap.value=we.isCubeTexture&&we.isRenderTargetTexture===!1?-1:1),W.isMeshStandardMaterial&&W.envMap===null&&O.environment!==null&&(ti.envMapIntensity.value=O.environmentIntensity),vn&&(mt.setValue(I,"toneMappingExposure",_.toneMappingExposure),Te.needsLights&&tx(ti,ro),se&&W.fog===!0&&ue.refreshFogUniforms(ti,se),ue.refreshMaterialUniforms(ti,W,N,te,u.state.transmissionRenderTarget[E.id]),bl.upload(I,Nf(Te),ti,C)),W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(bl.upload(I,Nf(Te),ti,C),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&mt.setValue(I,"center",F.center),mt.setValue(I,"modelViewMatrix",F.modelViewMatrix),mt.setValue(I,"normalMatrix",F.normalMatrix),mt.setValue(I,"modelMatrix",F.matrixWorld),W.isShaderMaterial||W.isRawShaderMaterial){const Rn=W.uniformsGroups;for(let Li=0,Ii=Rn.length;Li<Ii;Li++){const If=Rn[Li];U.update(If,zn),U.bind(If,zn)}}return zn}function tx(E,O){E.ambientLightColor.needsUpdate=O,E.lightProbe.needsUpdate=O,E.directionalLights.needsUpdate=O,E.directionalLightShadows.needsUpdate=O,E.pointLights.needsUpdate=O,E.pointLightShadows.needsUpdate=O,E.spotLights.needsUpdate=O,E.spotLightShadows.needsUpdate=O,E.rectAreaLights.needsUpdate=O,E.hemisphereLights.needsUpdate=O}function nx(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return T},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return b},this.setRenderTargetTextures=function(E,O,G){Ae.get(E.texture).__webglTexture=O,Ae.get(E.depthTexture).__webglTexture=G;const W=Ae.get(E);W.__hasExternalTextures=!0,W.__autoAllocateDepthBuffer=G===void 0,W.__autoAllocateDepthBuffer||Pe.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),W.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(E,O){const G=Ae.get(E);G.__webglFramebuffer=O,G.__useDefaultFramebuffer=O===void 0},this.setRenderTarget=function(E,O=0,G=0){b=E,T=O,A=G;let W=!0,F=null,se=!1,fe=!1;if(E){const we=Ae.get(E);if(we.__useDefaultFramebuffer!==void 0)be.bindFramebuffer(I.FRAMEBUFFER,null),W=!1;else if(we.__webglFramebuffer===void 0)C.setupRenderTarget(E);else if(we.__hasExternalTextures)C.rebindTextures(E,Ae.get(E.texture).__webglTexture,Ae.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const Ee=E.depthTexture;if(we.__boundDepthTexture!==Ee){if(Ee!==null&&Ae.has(Ee)&&(E.width!==Ee.image.width||E.height!==Ee.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");C.setupDepthRenderbuffer(E)}}const Ie=E.texture;(Ie.isData3DTexture||Ie.isDataArrayTexture||Ie.isCompressedArrayTexture)&&(fe=!0);const Fe=Ae.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Fe[O])?F=Fe[O][G]:F=Fe[O],se=!0):E.samples>0&&C.useMultisampledRTT(E)===!1?F=Ae.get(E).__webglMultisampledFramebuffer:Array.isArray(Fe)?F=Fe[G]:F=Fe,D.copy(E.viewport),V.copy(E.scissor),z=E.scissorTest}else D.copy(oe).multiplyScalar(N).floor(),V.copy(_e).multiplyScalar(N).floor(),z=Ve;if(be.bindFramebuffer(I.FRAMEBUFFER,F)&&W&&be.drawBuffers(E,F),be.viewport(D),be.scissor(V),be.setScissorTest(z),se){const we=Ae.get(E.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+O,we.__webglTexture,G)}else if(fe){const we=Ae.get(E.texture),Ie=O||0;I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,we.__webglTexture,G||0,Ie)}w=-1},this.readRenderTargetPixels=function(E,O,G,W,F,se,fe){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Se=Ae.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&fe!==void 0&&(Se=Se[fe]),Se){be.bindFramebuffer(I.FRAMEBUFFER,Se);try{const we=E.texture,Ie=we.format,Fe=we.type;if(!je.textureFormatReadable(Ie)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!je.textureTypeReadable(Fe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=E.width-W&&G>=0&&G<=E.height-F&&I.readPixels(O,G,W,F,Be.convert(Ie),Be.convert(Fe),se)}finally{const we=b!==null?Ae.get(b).__webglFramebuffer:null;be.bindFramebuffer(I.FRAMEBUFFER,we)}}},this.readRenderTargetPixelsAsync=async function(E,O,G,W,F,se,fe){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Se=Ae.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&fe!==void 0&&(Se=Se[fe]),Se){const we=E.texture,Ie=we.format,Fe=we.type;if(!je.textureFormatReadable(Ie))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!je.textureTypeReadable(Fe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(O>=0&&O<=E.width-W&&G>=0&&G<=E.height-F){be.bindFramebuffer(I.FRAMEBUFFER,Se);const Ee=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,Ee),I.bufferData(I.PIXEL_PACK_BUFFER,se.byteLength,I.STREAM_READ),I.readPixels(O,G,W,F,Be.convert(Ie),Be.convert(Fe),0);const Ze=b!==null?Ae.get(b).__webglFramebuffer:null;be.bindFramebuffer(I.FRAMEBUFFER,Ze);const ht=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);return I.flush(),await OM(I,ht,4),I.bindBuffer(I.PIXEL_PACK_BUFFER,Ee),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,se),I.deleteBuffer(Ee),I.deleteSync(ht),se}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(E,O=null,G=0){E.isTexture!==!0&&(Co("WebGLRenderer: copyFramebufferToTexture function signature has changed."),O=arguments[0]||null,E=arguments[1]);const W=Math.pow(2,-G),F=Math.floor(E.image.width*W),se=Math.floor(E.image.height*W),fe=O!==null?O.x:0,Se=O!==null?O.y:0;C.setTexture2D(E,0),I.copyTexSubImage2D(I.TEXTURE_2D,G,0,0,fe,Se,F,se),be.unbindTexture()},this.copyTextureToTexture=function(E,O,G=null,W=null,F=0){E.isTexture!==!0&&(Co("WebGLRenderer: copyTextureToTexture function signature has changed."),W=arguments[0]||null,E=arguments[1],O=arguments[2],F=arguments[3]||0,G=null);let se,fe,Se,we,Ie,Fe,Ee,Ze,ht;const pt=E.isCompressedTexture?E.mipmaps[F]:E.image;G!==null?(se=G.max.x-G.min.x,fe=G.max.y-G.min.y,Se=G.isBox3?G.max.z-G.min.z:1,we=G.min.x,Ie=G.min.y,Fe=G.isBox3?G.min.z:0):(se=pt.width,fe=pt.height,Se=pt.depth||1,we=0,Ie=0,Fe=0),W!==null?(Ee=W.x,Ze=W.y,ht=W.z):(Ee=0,Ze=0,ht=0);const un=Be.convert(O.format),et=Be.convert(O.type);let Te;O.isData3DTexture?(C.setTexture3D(O,0),Te=I.TEXTURE_3D):O.isDataArrayTexture||O.isCompressedArrayTexture?(C.setTexture2DArray(O,0),Te=I.TEXTURE_2D_ARRAY):(C.setTexture2D(O,0),Te=I.TEXTURE_2D),I.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,O.flipY),I.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),I.pixelStorei(I.UNPACK_ALIGNMENT,O.unpackAlignment);const hi=I.getParameter(I.UNPACK_ROW_LENGTH),tt=I.getParameter(I.UNPACK_IMAGE_HEIGHT),zn=I.getParameter(I.UNPACK_SKIP_PIXELS),Zr=I.getParameter(I.UNPACK_SKIP_ROWS),vn=I.getParameter(I.UNPACK_SKIP_IMAGES);I.pixelStorei(I.UNPACK_ROW_LENGTH,pt.width),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,pt.height),I.pixelStorei(I.UNPACK_SKIP_PIXELS,we),I.pixelStorei(I.UNPACK_SKIP_ROWS,Ie),I.pixelStorei(I.UNPACK_SKIP_IMAGES,Fe);const ro=E.isDataArrayTexture||E.isData3DTexture,mt=O.isDataArrayTexture||O.isData3DTexture;if(E.isRenderTargetTexture||E.isDepthTexture){const ti=Ae.get(E),so=Ae.get(O),Rn=Ae.get(ti.__renderTarget),Li=Ae.get(so.__renderTarget);be.bindFramebuffer(I.READ_FRAMEBUFFER,Rn.__webglFramebuffer),be.bindFramebuffer(I.DRAW_FRAMEBUFFER,Li.__webglFramebuffer);for(let Ii=0;Ii<Se;Ii++)ro&&I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Ae.get(E).__webglTexture,F,Fe+Ii),E.isDepthTexture?(mt&&I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Ae.get(O).__webglTexture,F,ht+Ii),I.blitFramebuffer(we,Ie,se,fe,Ee,Ze,se,fe,I.DEPTH_BUFFER_BIT,I.NEAREST)):mt?I.copyTexSubImage3D(Te,F,Ee,Ze,ht+Ii,we,Ie,se,fe):I.copyTexSubImage2D(Te,F,Ee,Ze,ht+Ii,we,Ie,se,fe);be.bindFramebuffer(I.READ_FRAMEBUFFER,null),be.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else mt?E.isDataTexture||E.isData3DTexture?I.texSubImage3D(Te,F,Ee,Ze,ht,se,fe,Se,un,et,pt.data):O.isCompressedArrayTexture?I.compressedTexSubImage3D(Te,F,Ee,Ze,ht,se,fe,Se,un,pt.data):I.texSubImage3D(Te,F,Ee,Ze,ht,se,fe,Se,un,et,pt):E.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,F,Ee,Ze,se,fe,un,et,pt.data):E.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,F,Ee,Ze,pt.width,pt.height,un,pt.data):I.texSubImage2D(I.TEXTURE_2D,F,Ee,Ze,se,fe,un,et,pt);I.pixelStorei(I.UNPACK_ROW_LENGTH,hi),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,tt),I.pixelStorei(I.UNPACK_SKIP_PIXELS,zn),I.pixelStorei(I.UNPACK_SKIP_ROWS,Zr),I.pixelStorei(I.UNPACK_SKIP_IMAGES,vn),F===0&&O.generateMipmaps&&I.generateMipmap(Te),be.unbindTexture()},this.copyTextureToTexture3D=function(E,O,G=null,W=null,F=0){return E.isTexture!==!0&&(Co("WebGLRenderer: copyTextureToTexture3D function signature has changed."),G=arguments[0]||null,W=arguments[1]||null,E=arguments[2],O=arguments[3],F=arguments[4]||0),Co('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(E,O,G,W,F)},this.initRenderTarget=function(E){Ae.get(E).__webglFramebuffer===void 0&&C.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?C.setTextureCube(E,0):E.isData3DTexture?C.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?C.setTexture2DArray(E,0):C.setTexture2D(E,0),be.unbindTexture()},this.resetState=function(){T=0,A=0,b=null,be.reset(),dt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return wi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const n=this.getContext();n.drawingBufferColorspace=qe._getDrawingBufferColorSpace(e),n.unpackColorSpace=qe._getUnpackColorSpace()}}class q2 extends Wt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ui,this.environmentIntensity=1,this.environmentRotation=new ui,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,n){return super.copy(e,n),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const n=super.toJSON(e);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(n.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(n.object.backgroundIntensity=this.backgroundIntensity),n.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(n.object.environmentIntensity=this.environmentIntensity),n.object.environmentRotation=this.environmentRotation.toArray(),n}}class $2 extends zt{constructor(e=null,n=1,i=1,r,s,o,a,l,c=An,d=An,h,f){super(null,o,a,l,c,d,r,s,h,f),this.isDataTexture=!0,this.image={data:e,width:n,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Vm extends Je{constructor(e,n,i,r=1){super(e,n,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const fs=new rt,Gm=new rt,sl=[],Wm=new Yr,Z2=new rt,_o=new lt,yo=new qr;class Q2 extends lt{constructor(e,n,i){super(e,n),this.isInstancedMesh=!0,this.instanceMatrix=new Vm(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let r=0;r<i;r++)this.setMatrixAt(r,Z2)}computeBoundingBox(){const e=this.geometry,n=this.count;this.boundingBox===null&&(this.boundingBox=new Yr),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<n;i++)this.getMatrixAt(i,fs),Wm.copy(e.boundingBox).applyMatrix4(fs),this.boundingBox.union(Wm)}computeBoundingSphere(){const e=this.geometry,n=this.count;this.boundingSphere===null&&(this.boundingSphere=new qr),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<n;i++)this.getMatrixAt(i,fs),yo.copy(e.boundingSphere).applyMatrix4(fs),this.boundingSphere.union(yo)}copy(e,n){return super.copy(e,n),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,n){n.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,n){n.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,n){const i=n.morphTargetInfluences,r=this.morphTexture.source.data.data,s=i.length+1,o=e*s+1;for(let a=0;a<i.length;a++)i[a]=r[o+a]}raycast(e,n){const i=this.matrixWorld,r=this.count;if(_o.geometry=this.geometry,_o.material=this.material,_o.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),yo.copy(this.boundingSphere),yo.applyMatrix4(i),e.ray.intersectsSphere(yo)!==!1))for(let s=0;s<r;s++){this.getMatrixAt(s,fs),Gm.multiplyMatrices(i,fs),_o.matrixWorld=Gm,_o.raycast(e,sl);for(let o=0,a=sl.length;o<a;o++){const l=sl[o];l.instanceId=s,l.object=this,n.push(l)}sl.length=0}}setColorAt(e,n){this.instanceColor===null&&(this.instanceColor=new Vm(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),n.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,n){n.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,n){const i=n.morphTargetInfluences,r=i.length+1;this.morphTexture===null&&(this.morphTexture=new $2(new Float32Array(r*this.count),r,this.count,hf,ai));const s=this.morphTexture.source.data.data;let o=0;for(let c=0;c<i.length;c++)o+=i[c];const a=this.geometry.morphTargetsRelative?1:1-o,l=r*e;s[l]=a,s.set(i,l+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}class Di extends $r{static get type(){return"LineBasicMaterial"}constructor(e){super(),this.isLineBasicMaterial=!0,this.color=new me(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Jl=new R,ec=new R,jm=new rt,Mo=new yc,ol=new qr,wu=new R,Xm=new R;class ar extends Wt{constructor(e=new ct,n=new Di){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const n=e.attributes.position,i=[0];for(let r=1,s=n.count;r<s;r++)Jl.fromBufferAttribute(n,r-1),ec.fromBufferAttribute(n,r),i[r]=i[r-1],i[r]+=Jl.distanceTo(ec);e.setAttribute("lineDistance",new It(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,n){const i=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),ol.copy(i.boundingSphere),ol.applyMatrix4(r),ol.radius+=s,e.ray.intersectsSphere(ol)===!1)return;jm.copy(r).invert(),Mo.copy(e.ray).applyMatrix4(jm);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,d=i.index,f=i.attributes.position;if(d!==null){const p=Math.max(0,o.start),v=Math.min(d.count,o.start+o.count);for(let y=p,m=v-1;y<m;y+=c){const u=d.getX(y),g=d.getX(y+1),x=al(this,e,Mo,l,u,g);x&&n.push(x)}if(this.isLineLoop){const y=d.getX(v-1),m=d.getX(p),u=al(this,e,Mo,l,y,m);u&&n.push(u)}}else{const p=Math.max(0,o.start),v=Math.min(f.count,o.start+o.count);for(let y=p,m=v-1;y<m;y+=c){const u=al(this,e,Mo,l,y,y+1);u&&n.push(u)}if(this.isLineLoop){const y=al(this,e,Mo,l,v-1,p);y&&n.push(y)}}}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function al(t,e,n,i,r,s){const o=t.geometry.attributes.position;if(Jl.fromBufferAttribute(o,r),ec.fromBufferAttribute(o,s),n.distanceSqToSegment(Jl,ec,wu,Xm)>i)return;wu.applyMatrix4(t.matrixWorld);const l=e.ray.origin.distanceTo(wu);if(!(l<e.near||l>e.far))return{distance:l,point:Xm.clone().applyMatrix4(t.matrixWorld),index:r,face:null,faceIndex:null,barycoord:null,object:t}}const Km=new R,Ym=new R;class Mf extends ar{constructor(e,n){super(e,n),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const n=e.attributes.position,i=[];for(let r=0,s=n.count;r<s;r+=2)Km.fromBufferAttribute(n,r),Ym.fromBufferAttribute(n,r+1),i[r]=r===0?0:i[r-1],i[r+1]=i[r]+Km.distanceTo(Ym);e.setAttribute("lineDistance",new It(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Sf extends $r{static get type(){return"PointsMaterial"}constructor(e){super(),this.isPointsMaterial=!0,this.color=new me(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const qm=new rt,lh=new yc,ll=new qr,cl=new R;class Ir extends Wt{constructor(e=new ct,n=new Sf){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,n){const i=this.geometry,r=this.matrixWorld,s=e.params.Points.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),ll.copy(i.boundingSphere),ll.applyMatrix4(r),ll.radius+=s,e.ray.intersectsSphere(ll)===!1)return;qm.copy(r).invert(),lh.copy(e.ray).applyMatrix4(qm);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=i.index,h=i.attributes.position;if(c!==null){const f=Math.max(0,o.start),p=Math.min(c.count,o.start+o.count);for(let v=f,y=p;v<y;v++){const m=c.getX(v);cl.fromBufferAttribute(h,m),$m(cl,m,l,r,e,n,this)}}else{const f=Math.max(0,o.start),p=Math.min(h.count,o.start+o.count);for(let v=f,y=p;v<y;v++)cl.fromBufferAttribute(h,v),$m(cl,v,l,r,e,n,this)}}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function $m(t,e,n,i,r,s,o){const a=lh.distanceSqToPoint(t);if(a<n){const l=new R;lh.closestPointToPoint(t,l),l.applyMatrix4(i);const c=r.ray.origin.distanceTo(l);if(c<r.near||c>r.far)return;s.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}class yt extends zt{constructor(e,n,i,r,s,o,a,l,c){super(e,n,i,r,s,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class wf extends ct{constructor(e=[],n=[],i=1,r=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:n,radius:i,detail:r};const s=[],o=[];a(r),c(i),d(),this.setAttribute("position",new It(s,3)),this.setAttribute("normal",new It(s.slice(),3)),this.setAttribute("uv",new It(o,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function a(g){const x=new R,_=new R,P=new R;for(let T=0;T<n.length;T+=3)p(n[T+0],x),p(n[T+1],_),p(n[T+2],P),l(x,_,P,g)}function l(g,x,_,P){const T=P+1,A=[];for(let b=0;b<=T;b++){A[b]=[];const w=g.clone().lerp(_,b/T),M=x.clone().lerp(_,b/T),D=T-b;for(let V=0;V<=D;V++)V===0&&b===T?A[b][V]=w:A[b][V]=w.clone().lerp(M,V/D)}for(let b=0;b<T;b++)for(let w=0;w<2*(T-b)-1;w++){const M=Math.floor(w/2);w%2===0?(f(A[b][M+1]),f(A[b+1][M]),f(A[b][M])):(f(A[b][M+1]),f(A[b+1][M+1]),f(A[b+1][M]))}}function c(g){const x=new R;for(let _=0;_<s.length;_+=3)x.x=s[_+0],x.y=s[_+1],x.z=s[_+2],x.normalize().multiplyScalar(g),s[_+0]=x.x,s[_+1]=x.y,s[_+2]=x.z}function d(){const g=new R;for(let x=0;x<s.length;x+=3){g.x=s[x+0],g.y=s[x+1],g.z=s[x+2];const _=m(g)/2/Math.PI+.5,P=u(g)/Math.PI+.5;o.push(_,1-P)}v(),h()}function h(){for(let g=0;g<o.length;g+=6){const x=o[g+0],_=o[g+2],P=o[g+4],T=Math.max(x,_,P),A=Math.min(x,_,P);T>.9&&A<.1&&(x<.2&&(o[g+0]+=1),_<.2&&(o[g+2]+=1),P<.2&&(o[g+4]+=1))}}function f(g){s.push(g.x,g.y,g.z)}function p(g,x){const _=g*3;x.x=e[_+0],x.y=e[_+1],x.z=e[_+2]}function v(){const g=new R,x=new R,_=new R,P=new R,T=new He,A=new He,b=new He;for(let w=0,M=0;w<s.length;w+=9,M+=6){g.set(s[w+0],s[w+1],s[w+2]),x.set(s[w+3],s[w+4],s[w+5]),_.set(s[w+6],s[w+7],s[w+8]),T.set(o[M+0],o[M+1]),A.set(o[M+2],o[M+3]),b.set(o[M+4],o[M+5]),P.copy(g).add(x).add(_).divideScalar(3);const D=m(P);y(T,M+0,g,D),y(A,M+2,x,D),y(b,M+4,_,D)}}function y(g,x,_,P){P<0&&g.x===1&&(o[x]=g.x-1),_.x===0&&_.z===0&&(o[x]=P/2/Math.PI+.5)}function m(g){return Math.atan2(g.z,-g.x)}function u(g){return Math.atan2(-g.y,Math.sqrt(g.x*g.x+g.z*g.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new wf(e.vertices,e.indices,e.radius,e.details)}}class Ef extends wf{constructor(e=1,n=0){const i=(1+Math.sqrt(5))/2,r=1/i,s=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-r,-i,0,-r,i,0,r,-i,0,r,i,-r,-i,0,-r,i,0,r,-i,0,r,i,0,-i,0,-r,i,0,-r,-i,0,r,i,0,r],o=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(s,o,e,n),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:n}}static fromJSON(e){return new Ef(e.radius,e.detail)}}class Tf extends ct{constructor(e=.5,n=1,i=32,r=1,s=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:n,thetaSegments:i,phiSegments:r,thetaStart:s,thetaLength:o},i=Math.max(3,i),r=Math.max(1,r);const a=[],l=[],c=[],d=[];let h=e;const f=(n-e)/r,p=new R,v=new He;for(let y=0;y<=r;y++){for(let m=0;m<=i;m++){const u=s+m/i*o;p.x=h*Math.cos(u),p.y=h*Math.sin(u),l.push(p.x,p.y,p.z),c.push(0,0,1),v.x=(p.x/n+1)/2,v.y=(p.y/n+1)/2,d.push(v.x,v.y)}h+=f}for(let y=0;y<r;y++){const m=y*(i+1);for(let u=0;u<i;u++){const g=u+m,x=g,_=g+i+1,P=g+i+2,T=g+1;a.push(x,_,T),a.push(_,P,T)}}this.setIndex(a),this.setAttribute("position",new It(l,3)),this.setAttribute("normal",new It(c,3)),this.setAttribute("uv",new It(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Tf(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class qn extends ct{constructor(e=1,n=32,i=16,r=0,s=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:n,heightSegments:i,phiStart:r,phiLength:s,thetaStart:o,thetaLength:a},n=Math.max(3,Math.floor(n)),i=Math.max(2,Math.floor(i));const l=Math.min(o+a,Math.PI);let c=0;const d=[],h=new R,f=new R,p=[],v=[],y=[],m=[];for(let u=0;u<=i;u++){const g=[],x=u/i;let _=0;u===0&&o===0?_=.5/n:u===i&&l===Math.PI&&(_=-.5/n);for(let P=0;P<=n;P++){const T=P/n;h.x=-e*Math.cos(r+T*s)*Math.sin(o+x*a),h.y=e*Math.cos(o+x*a),h.z=e*Math.sin(r+T*s)*Math.sin(o+x*a),v.push(h.x,h.y,h.z),f.copy(h).normalize(),y.push(f.x,f.y,f.z),m.push(T+_,1-x),g.push(c++)}d.push(g)}for(let u=0;u<i;u++)for(let g=0;g<n;g++){const x=d[u][g+1],_=d[u][g],P=d[u+1][g],T=d[u+1][g+1];(u!==0||o>0)&&p.push(x,_,T),(u!==i-1||l<Math.PI)&&p.push(_,P,T)}this.setIndex(p),this.setAttribute("position",new It(v,3)),this.setAttribute("normal",new It(y,3)),this.setAttribute("uv",new It(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new qn(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class J2 extends $r{static get type(){return"MeshStandardMaterial"}constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new me(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new me(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Iv,this.normalScale=new He(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ui,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Zm extends Di{static get type(){return"LineDashedMaterial"}constructor(e){super(),this.isLineDashedMaterial=!0,this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(e)}copy(e){return super.copy(e),this.scale=e.scale,this.dashSize=e.dashSize,this.gapSize=e.gapSize,this}}const Qm={enabled:!1,files:{},add:function(t,e){this.enabled!==!1&&(this.files[t]=e)},get:function(t){if(this.enabled!==!1)return this.files[t]},remove:function(t){delete this.files[t]},clear:function(){this.files={}}};class eT{constructor(e,n,i){const r=this;let s=!1,o=0,a=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=n,this.onError=i,this.itemStart=function(d){a++,s===!1&&r.onStart!==void 0&&r.onStart(d,o,a),s=!0},this.itemEnd=function(d){o++,r.onProgress!==void 0&&r.onProgress(d,o,a),o===a&&(s=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(d){r.onError!==void 0&&r.onError(d)},this.resolveURL=function(d){return l?l(d):d},this.setURLModifier=function(d){return l=d,this},this.addHandler=function(d,h){return c.push(d,h),this},this.removeHandler=function(d){const h=c.indexOf(d);return h!==-1&&c.splice(h,2),this},this.getHandler=function(d){for(let h=0,f=c.length;h<f;h+=2){const p=c[h],v=c[h+1];if(p.global&&(p.lastIndex=0),p.test(d))return v}return null}}}const tT=new eT;class Af{constructor(e){this.manager=e!==void 0?e:tT,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,n){const i=this;return new Promise(function(r,s){i.load(e,r,n,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}Af.DEFAULT_MATERIAL_NAME="__DEFAULT";class nT extends Af{constructor(e){super(e)}load(e,n,i,r){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,o=Qm.get(e);if(o!==void 0)return s.manager.itemStart(e),setTimeout(function(){n&&n(o),s.manager.itemEnd(e)},0),o;const a=ca("img");function l(){d(),Qm.add(e,this),n&&n(this),s.manager.itemEnd(e)}function c(h){d(),r&&r(h),s.manager.itemError(e),s.manager.itemEnd(e)}function d(){a.removeEventListener("load",l,!1),a.removeEventListener("error",c,!1)}return a.addEventListener("load",l,!1),a.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),s.manager.itemStart(e),a.src=e,a}}class iT extends Af{constructor(e){super(e)}load(e,n,i,r){const s=new zt,o=new nT(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(e,function(a){s.image=a,s.needsUpdate=!0,n!==void 0&&n(s)},i,r),s}}class Zv extends Wt{constructor(e,n=1){super(),this.isLight=!0,this.type="Light",this.color=new me(e),this.intensity=n}dispose(){}copy(e,n){return super.copy(e,n),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const n=super.toJSON(e);return n.object.color=this.color.getHex(),n.object.intensity=this.intensity,this.groundColor!==void 0&&(n.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(n.object.distance=this.distance),this.angle!==void 0&&(n.object.angle=this.angle),this.decay!==void 0&&(n.object.decay=this.decay),this.penumbra!==void 0&&(n.object.penumbra=this.penumbra),this.shadow!==void 0&&(n.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(n.object.target=this.target.uuid),n}}const Eu=new rt,Jm=new R,eg=new R;class rT{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new He(512,512),this.map=null,this.mapPass=null,this.matrix=new rt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new _f,this._frameExtents=new He(1,1),this._viewportCount=1,this._viewports=[new at(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const n=this.camera,i=this.matrix;Jm.setFromMatrixPosition(e.matrixWorld),n.position.copy(Jm),eg.setFromMatrixPosition(e.target.matrixWorld),n.lookAt(eg),n.updateMatrixWorld(),Eu.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Eu),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Eu)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const tg=new rt,So=new R,Tu=new R;class sT extends rT{constructor(){super(new Sn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new He(4,2),this._viewportCount=6,this._viewports=[new at(2,1,1,1),new at(0,1,1,1),new at(3,1,1,1),new at(1,1,1,1),new at(3,0,1,1),new at(1,0,1,1)],this._cubeDirections=[new R(1,0,0),new R(-1,0,0),new R(0,0,1),new R(0,0,-1),new R(0,1,0),new R(0,-1,0)],this._cubeUps=[new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,0,1),new R(0,0,-1)]}updateMatrices(e,n=0){const i=this.camera,r=this.matrix,s=e.distance||i.far;s!==i.far&&(i.far=s,i.updateProjectionMatrix()),So.setFromMatrixPosition(e.matrixWorld),i.position.copy(So),Tu.copy(i.position),Tu.add(this._cubeDirections[n]),i.up.copy(this._cubeUps[n]),i.lookAt(Tu),i.updateMatrixWorld(),r.makeTranslation(-So.x,-So.y,-So.z),tg.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(tg)}}class oT extends Zv{constructor(e,n,i=0,r=2){super(e,n),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=r,this.shadow=new sT}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,n){return super.copy(e,n),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class aT extends Zv{constructor(e,n){super(e,n),this.isAmbientLight=!0,this.type="AmbientLight"}}const ng=new rt;class lT{constructor(e,n,i=0,r=1/0){this.ray=new yc(e,n),this.near=i,this.far=r,this.camera=null,this.layers=new vf,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,n){this.ray.set(e,n)}setFromCamera(e,n){n.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(n.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(n).sub(this.ray.origin).normalize(),this.camera=n):n.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(n.near+n.far)/(n.near-n.far)).unproject(n),this.ray.direction.set(0,0,-1).transformDirection(n.matrixWorld),this.camera=n):console.error("THREE.Raycaster: Unsupported camera type: "+n.type)}setFromXRController(e){return ng.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(ng),this}intersectObject(e,n=!0,i=[]){return ch(e,this,i,n),i.sort(ig),i}intersectObjects(e,n=!0,i=[]){for(let r=0,s=e.length;r<s;r++)ch(e[r],this,i,n);return i.sort(ig),i}}function ig(t,e){return t.distance-e.distance}function ch(t,e,n,i){let r=!0;if(t.layers.test(e.layers)&&t.raycast(e,n)===!1&&(r=!1),r===!0&&i===!0){const s=t.children;for(let o=0,a=s.length;o<a;o++)ch(s[o],e,n,!0)}}class wo{constructor(e=1,n=0,i=0){return this.radius=e,this.phi=n,this.theta=i,this}set(e,n,i){return this.radius=e,this.phi=n,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,n,i){return this.radius=Math.sqrt(e*e+n*n+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(Qt(n/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:lf}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=lf);const cT=[{id:"10",name:"Sun",category:"star",orderFromSun:0,physical:{meanRadiusKm:695700,equatorialRadiusKm:695700,polarRadiusKm:695700,flattening:0,massKg:19885e26,gmKm3S2:1327124400419394e-4,rotationPeriodHours:609.12,axialTiltDeg:7.25,meanTemperatureK:5778,spectralType:"G2V",colorHex:"#ffdd77"},orbit:{semiMajorAxisKm:0,semiMajorAxisAU:0,eccentricity:0,inclinationDeg:0,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:0,orbitalPeriodDays:0},description:"Yellow dwarf star (G2V) at the gravitational center of the Solar System, containing 99.86% of the system’s total mass."},{id:"199",name:"Mercury",category:"planet",orderFromSun:1,physical:{meanRadiusKm:2439.7,equatorialRadiusKm:2439.7,polarRadiusKm:2439.7,flattening:0,massKg:33011e19,gmKm3S2:22031.78,rotationPeriodHours:1407.6,axialTiltDeg:.034,meanTemperatureK:440,colorHex:"#9c968f"},orbit:{semiMajorAxisKm:57909050,semiMajorAxisAU:.387098,eccentricity:.20563,inclinationDeg:7.005,longitudeAscendingNodeDeg:48.331,argumentPeriapsisDeg:29.124,meanAnomalyAtEpochDeg:174.796,orbitalPeriodDays:87.969},description:"Smallest planet, heavily cratered with silicate crust and large iron core; lacks a substantial atmosphere."},{id:"299",name:"Venus",category:"planet",orderFromSun:2,physical:{meanRadiusKm:6051.8,equatorialRadiusKm:6051.8,polarRadiusKm:6051.8,flattening:0,massKg:48675e20,gmKm3S2:324858.59,rotationPeriodHours:-5832.5,axialTiltDeg:177.36,meanTemperatureK:737,colorHex:"#e3bb7b"},orbit:{semiMajorAxisKm:108208e3,semiMajorAxisAU:.723332,eccentricity:.006772,inclinationDeg:3.39458,longitudeAscendingNodeDeg:76.68,argumentPeriapsisDeg:54.884,meanAnomalyAtEpochDeg:50.115,orbitalPeriodDays:224.701},description:"Terrestrial planet shrouded in dense carbon dioxide atmosphere and sulfuric acid clouds with runaway greenhouse effect."},{id:"399",name:"Earth",category:"planet",orderFromSun:3,physical:{meanRadiusKm:6371,equatorialRadiusKm:6378.137,polarRadiusKm:6356.752,flattening:.003353,massKg:59722e20,gmKm3S2:398600.4418,rotationPeriodHours:23.9344,axialTiltDeg:23.439,meanTemperatureK:288,colorHex:"#4b75a1"},orbit:{semiMajorAxisKm:149598023,semiMajorAxisAU:1,eccentricity:.0167086,inclinationDeg:5e-5,longitudeAscendingNodeDeg:-11.26064,argumentPeriapsisDeg:114.20783,meanAnomalyAtEpochDeg:358.617,orbitalPeriodDays:365.256},description:"Dense rocky world featuring liquid surface water, active plate tectonics, oxygen-rich atmosphere, and planetary biosphere."},{id:"499",name:"Mars",category:"planet",orderFromSun:4,physical:{meanRadiusKm:3389.5,equatorialRadiusKm:3396.2,polarRadiusKm:3376.2,flattening:.00589,massKg:64171e19,gmKm3S2:42828.375,rotationPeriodHours:24.6229,axialTiltDeg:25.19,meanTemperatureK:210,colorHex:"#c16138"},orbit:{semiMajorAxisKm:227939200,semiMajorAxisAU:1.523679,eccentricity:.0934,inclinationDeg:1.85,longitudeAscendingNodeDeg:49.558,argumentPeriapsisDeg:286.502,meanAnomalyAtEpochDeg:19.373,orbitalPeriodDays:686.98},description:"Cold desert world with iron-oxide regolith, giant shield volcanoes (Olympus Mons), rift canyon Valles Marineris, and polar ice caps."},{id:"599",name:"Jupiter",category:"planet",orderFromSun:5,physical:{meanRadiusKm:69911,equatorialRadiusKm:71492,polarRadiusKm:66854,flattening:.06487,massKg:18982e23,gmKm3S2:12668653492e-2,rotationPeriodHours:9.925,axialTiltDeg:3.13,meanTemperatureK:165,colorHex:"#c8a679"},orbit:{semiMajorAxisKm:77857e4,semiMajorAxisAU:5.2044,eccentricity:.048498,inclinationDeg:1.303,longitudeAscendingNodeDeg:100.464,argumentPeriapsisDeg:273.867,meanAnomalyAtEpochDeg:20.02,orbitalPeriodDays:4332.589},description:"Largest planet; hydrogen-helium gas giant displaying zonal atmospheric jet streams, turbulent vortices, and the Great Red Spot."},{id:"699",name:"Saturn",category:"planet",orderFromSun:6,physical:{meanRadiusKm:58232,equatorialRadiusKm:60268,polarRadiusKm:54364,flattening:.09796,massKg:56834e22,gmKm3S2:379311879e-1,rotationPeriodHours:10.656,axialTiltDeg:26.73,meanTemperatureK:134,colorHex:"#dfcf9f"},orbit:{semiMajorAxisKm:143353e4,semiMajorAxisAU:9.5826,eccentricity:.05555,inclinationDeg:2.485,longitudeAscendingNodeDeg:113.665,argumentPeriapsisDeg:339.392,meanAnomalyAtEpochDeg:317.02,orbitalPeriodDays:10759.22},description:"Gas giant celebrated for its extensive, brilliant ring system consisting of water ice particles, dust, and rock."},{id:"799",name:"Uranus",category:"planet",orderFromSun:7,physical:{meanRadiusKm:25362,equatorialRadiusKm:25559,polarRadiusKm:24973,flattening:.02293,massKg:8681e22,gmKm3S2:57939393e-1,rotationPeriodHours:-17.24,axialTiltDeg:97.77,meanTemperatureK:76,colorHex:"#8fe0ea"},orbit:{semiMajorAxisKm:287246e4,semiMajorAxisAU:19.201,eccentricity:.046381,inclinationDeg:.773,longitudeAscendingNodeDeg:74.006,argumentPeriapsisDeg:96.998,meanAnomalyAtEpochDeg:142.238,orbitalPeriodDays:30685.4},description:"Ice giant composed of water, ammonia, and methane ices; extreme 98° axial tilt results in extreme seasonal variations."},{id:"899",name:"Neptune",category:"planet",orderFromSun:8,physical:{meanRadiusKm:24622,equatorialRadiusKm:24764,polarRadiusKm:24341,flattening:.01708,massKg:102413e21,gmKm3S2:68350995e-1,rotationPeriodHours:16.11,axialTiltDeg:28.32,meanTemperatureK:72,colorHex:"#4b70dd"},orbit:{semiMajorAxisKm:449506e4,semiMajorAxisAU:30.047,eccentricity:.009456,inclinationDeg:1.77,longitudeAscendingNodeDeg:131.784,argumentPeriapsisDeg:273.187,meanAnomalyAtEpochDeg:256.228,orbitalPeriodDays:60189},description:"Outermost major planet; deep azure ice giant driven by violent supersonic winds, methane haze, and high-altitude cirrus clouds."}],uT=[{id:"301",name:"Moon",category:"moon",orderFromSun:3,parentId:"399",parentName:"Earth",physical:{meanRadiusKm:1737.4,equatorialRadiusKm:1738.1,polarRadiusKm:1736,flattening:.0012,massKg:7342e19,gmKm3S2:4902.8,rotationPeriodHours:655.728,axialTiltDeg:6.68,meanTemperatureK:250,colorHex:"#c4c3be"},orbit:{semiMajorAxisKm:384400,semiMajorAxisAU:.00257,eccentricity:.0549,inclinationDeg:5.145,longitudeAscendingNodeDeg:125.08,argumentPeriapsisDeg:318.15,meanAnomalyAtEpochDeg:135.27,orbitalPeriodDays:27.321661},description:"Earth’s only natural satellite; tidally locked with extensive lunar maria basalt plains and impact-cratered anorthositic highlands."},{id:"401",name:"Phobos",category:"moon",orderFromSun:4,parentId:"499",parentName:"Mars",physical:{meanRadiusKm:11.26,equatorialRadiusKm:13,polarRadiusKm:9.1,massKg:10659e12,gmKm3S2:71e-5,rotationPeriodHours:7.654,axialTiltDeg:0,colorHex:"#8b847d"},orbit:{semiMajorAxisKm:9376,semiMajorAxisAU:627e-7,eccentricity:.0151,inclinationDeg:1.093,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:180,orbitalPeriodDays:.31891},description:"Innermost and largest moon of Mars; heavily cratered irregular body featuring the massive Stickney impact crater, orbiting inside synchronous orbit."},{id:"402",name:"Deimos",category:"moon",orderFromSun:4,parentId:"499",parentName:"Mars",physical:{meanRadiusKm:6.2,massKg:14762e11,rotationPeriodHours:30.31,axialTiltDeg:0,colorHex:"#999186"},orbit:{semiMajorAxisKm:23463,semiMajorAxisAU:1568e-7,eccentricity:33e-5,inclinationDeg:.93,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:45,orbitalPeriodDays:1.263},description:"Outermost moon of Mars; smooth-looking irregular body coated in a thick regolith blanket that softens surface topography."},{id:"501",name:"Io",category:"moon",orderFromSun:5,parentId:"599",parentName:"Jupiter",physical:{meanRadiusKm:1821.5,massKg:89319e18,gmKm3S2:5959.91,rotationPeriodHours:42.456,axialTiltDeg:0,meanTemperatureK:130,colorHex:"#e5c158"},orbit:{semiMajorAxisKm:421700,semiMajorAxisAU:.002819,eccentricity:.0041,inclinationDeg:.05,longitudeAscendingNodeDeg:43.8,argumentPeriapsisDeg:84.1,meanAnomalyAtEpochDeg:200,orbitalPeriodDays:1.769138},description:"Most volcanically active body in the Solar System, driven by tidal friction from orbital resonance with Europa and Ganymede; coated in sulfur and sulfur dioxide."},{id:"502",name:"Europa",category:"moon",orderFromSun:5,parentId:"599",parentName:"Jupiter",physical:{meanRadiusKm:1560.8,massKg:47998e18,gmKm3S2:3202.73,rotationPeriodHours:85.224,axialTiltDeg:.1,meanTemperatureK:102,colorHex:"#c7bfae"},orbit:{semiMajorAxisKm:670900,semiMajorAxisAU:.004485,eccentricity:.009,inclinationDeg:.47,longitudeAscendingNodeDeg:219.1,argumentPeriapsisDeg:66.8,meanAnomalyAtEpochDeg:120,orbitalPeriodDays:3.551181},description:"Smooth, brilliant water-ice crust fractured by tectonic lineae and cycloids; harbors a deep global subsurface liquid water ocean with astrobiological potential."},{id:"503",name:"Ganymede",category:"moon",orderFromSun:5,parentId:"599",parentName:"Jupiter",physical:{meanRadiusKm:2631.2,massKg:14819e19,gmKm3S2:9887.83,rotationPeriodHours:171.72,axialTiltDeg:.2,meanTemperatureK:110,colorHex:"#8e8379"},orbit:{semiMajorAxisKm:1070400,semiMajorAxisAU:.007155,eccentricity:.0013,inclinationDeg:.2,longitudeAscendingNodeDeg:63.5,argumentPeriapsisDeg:192.4,meanAnomalyAtEpochDeg:60,orbitalPeriodDays:7.154553},description:"Largest natural satellite in the Solar System (larger than Mercury); only known moon with its own intrinsic magnetic field generated by a liquid iron core."},{id:"504",name:"Callisto",category:"moon",orderFromSun:5,parentId:"599",parentName:"Jupiter",physical:{meanRadiusKm:2410.3,massKg:10759e19,gmKm3S2:7179.29,rotationPeriodHours:400.536,axialTiltDeg:0,meanTemperatureK:134,colorHex:"#696057"},orbit:{semiMajorAxisKm:1882700,semiMajorAxisAU:.012585,eccentricity:.0074,inclinationDeg:.28,longitudeAscendingNodeDeg:298.8,argumentPeriapsisDeg:52.6,meanAnomalyAtEpochDeg:10,orbitalPeriodDays:16.689018},description:"Ancient, intensely cratered ice-rock moon; lacks tidal resonance heating, preserving the most heavily cratered surface in the Solar System (including Valhalla impact basin)."},{id:"601",name:"Mimas",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:198.2,massKg:37493e15,rotationPeriodHours:22.6,colorHex:"#b2b2b2"},orbit:{semiMajorAxisKm:185520,semiMajorAxisAU:.00124,eccentricity:.0202,inclinationDeg:1.574,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:90,orbitalPeriodDays:.942422},description:"Dominated by the 130 km Herschel impact crater, giving it a distinctive Death Star appearance; clearing agent for the Cassini Division."},{id:"602",name:"Enceladus",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:252.1,massKg:10802e16,gmKm3S2:7.21,rotationPeriodHours:32.88,colorHex:"#ffffff"},orbit:{semiMajorAxisKm:238029,semiMajorAxisAU:.001591,eccentricity:.0047,inclinationDeg:.019,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:180,orbitalPeriodDays:1.370218},description:'High-albedo icy world with active cryovolcanic geysers erupting water vapor, organic molecules, and ice crystals from south polar "tiger stripe" fractures.'},{id:"603",name:"Tethys",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:531,massKg:61745e16,rotationPeriodHours:45.31,colorHex:"#d8d8d8"},orbit:{semiMajorAxisKm:294660,semiMajorAxisAU:.00197,eccentricity:1e-4,inclinationDeg:1.12,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:270,orbitalPeriodDays:1.887802},description:"Low-density water-ice satellite featuring the vast Odysseus impact crater and the enormous Ithaca Chasma canyon system spanning 2,000 km."},{id:"604",name:"Dione",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:561.4,massKg:10955e17,rotationPeriodHours:65.69,colorHex:"#cac8c5"},orbit:{semiMajorAxisKm:377400,semiMajorAxisAU:.002523,eccentricity:.0022,inclinationDeg:.019,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:45,orbitalPeriodDays:2.736915},description:"Icy moon displaying bright wispy ice cliffs (chasmata) formed by extensional tectonic fractures across its trailing hemisphere."},{id:"605",name:"Rhea",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:763.5,massKg:23065e17,rotationPeriodHours:108.43,colorHex:"#bbb8b4"},orbit:{semiMajorAxisKm:527040,semiMajorAxisAU:.003523,eccentricity:.00125,inclinationDeg:.345,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:160,orbitalPeriodDays:4.5175},description:"Second-largest moon of Saturn; heavily cratered ice body with homogeneous interior composition and tenuous oxygen-carbon dioxide exosphere."},{id:"606",name:"Titan",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:2574.8,equatorialRadiusKm:2574.8,polarRadiusKm:2574.8,flattening:0,massKg:13452e19,gmKm3S2:8978.14,rotationPeriodHours:382.68,axialTiltDeg:0,meanTemperatureK:94,colorHex:"#e5a84b",atmosphere:{surfacePressureBar:1.45,composition:[{gas:"N2",percentage:95},{gas:"CH4",percentage:4.9}]}},orbit:{semiMajorAxisKm:1221870,semiMajorAxisAU:.008168,eccentricity:.0288,inclinationDeg:.3485,longitudeAscendingNodeDeg:28,argumentPeriapsisDeg:180,meanAnomalyAtEpochDeg:240,orbitalPeriodDays:15.945421},description:"Second-largest moon in the Solar System, enveloped by a dense nitrogen-methane atmosphere supporting active liquid methane/ethane lakes, rivers, and rain hydrologic cycles."},{id:"607",name:"Hyperion",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:135,massKg:56199e14,rotationPeriodHours:300,colorHex:"#9c8c7c"},orbit:{semiMajorAxisKm:1481100,semiMajorAxisAU:.0099,eccentricity:.123,inclinationDeg:.568,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:110,orbitalPeriodDays:21.276609},description:"Sponge-like irregularly shaped moon with low density (high porosity) undergoing non-repeating chaotic rotation influenced by Titan."},{id:"608",name:"Iapetus",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:734.3,massKg:18056e17,rotationPeriodHours:1903.92,colorHex:"#847970"},orbit:{semiMajorAxisKm:3561300,semiMajorAxisAU:.023806,eccentricity:.0286,inclinationDeg:15.47,longitudeAscendingNodeDeg:75.6,argumentPeriapsisDeg:275.8,meanAnomalyAtEpochDeg:300,orbitalPeriodDays:79.330183},description:"Two-tone world with extreme albedo dichotomy (pitch-black Cassini Regio leading hemisphere and brilliant ice trailing hemisphere), plus a towering 20 km equatorial ridge."},{id:"705",name:"Miranda",category:"moon",orderFromSun:7,parentId:"799",parentName:"Uranus",physical:{meanRadiusKm:235.8,massKg:659e17,rotationPeriodHours:33.91,colorHex:"#a0a0a0"},orbit:{semiMajorAxisKm:129900,semiMajorAxisAU:868e-6,eccentricity:.0013,inclinationDeg:4.232,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:15,orbitalPeriodDays:1.413479},description:"Exhibits extreme, chaotic terrain with gigantic tectonic rift grabens and chevron-shaped coronae, including Verona Rupes (tallest cliff in the Solar System at 20 km)."},{id:"701",name:"Ariel",category:"moon",orderFromSun:7,parentId:"799",parentName:"Uranus",physical:{meanRadiusKm:578.9,massKg:1251e18,rotationPeriodHours:60.48,colorHex:"#b4b4b4"},orbit:{semiMajorAxisKm:191020,semiMajorAxisAU:.001277,eccentricity:.0012,inclinationDeg:.26,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:75,orbitalPeriodDays:2.520379},description:"Brightest moon of Uranus; dissected by extensive interconnected fault scarps, deep graben valleys, and cryovolcanic flows."},{id:"702",name:"Umbriel",category:"moon",orderFromSun:7,parentId:"799",parentName:"Uranus",physical:{meanRadiusKm:584.7,massKg:1275e18,rotationPeriodHours:99.46,colorHex:"#737373"},orbit:{semiMajorAxisKm:266e3,semiMajorAxisAU:.001778,eccentricity:.0039,inclinationDeg:.205,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:190,orbitalPeriodDays:4.144177},description:"Darkest and most heavily cratered of Uranus’s large satellites, marked by the mysterious bright fluorescent ring floor of crater Wunda."},{id:"703",name:"Titania",category:"moon",orderFromSun:7,parentId:"799",parentName:"Uranus",physical:{meanRadiusKm:788.9,massKg:342e19,rotationPeriodHours:208.94,colorHex:"#9f9994"},orbit:{semiMajorAxisKm:435910,semiMajorAxisAU:.002914,eccentricity:.0011,inclinationDeg:.34,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:310,orbitalPeriodDays:8.706234},description:"Largest moon of Uranus; fractured by vast canyon systems (Messina Chasma) resulting from internal freezing and expansion of a primordial subsurface ocean."},{id:"704",name:"Oberon",category:"moon",orderFromSun:7,parentId:"799",parentName:"Uranus",physical:{meanRadiusKm:761.4,massKg:3014e18,rotationPeriodHours:323.11,colorHex:"#938c86"},orbit:{semiMajorAxisKm:583520,semiMajorAxisAU:.003901,eccentricity:.0014,inclinationDeg:.058,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:40,orbitalPeriodDays:13.463239},description:"Outermost major moon of Uranus; ancient heavily cratered ice-rock surface featuring prominent impact ray craters filled with dark carbonaceous deposits."},{id:"801",name:"Triton",category:"moon",orderFromSun:8,parentId:"899",parentName:"Neptune",physical:{meanRadiusKm:1352.6,massKg:2139e19,gmKm3S2:1427.6,rotationPeriodHours:-141.048,axialTiltDeg:0,meanTemperatureK:38,colorHex:"#e2cfc4"},orbit:{semiMajorAxisKm:354760,semiMajorAxisAU:.002371,eccentricity:16e-6,inclinationDeg:156.885,longitudeAscendingNodeDeg:177,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:120,orbitalPeriodDays:5.876854},description:"Captured Kuiper Belt dwarf planet orbiting Neptune in a retrograde direction; coldest measured surface in the Solar System (38 K) with nitrogen cryogeysers and cantaloupe terrain."},{id:"999",name:"Pluto",category:"dwarf_planet",orderFromSun:9,physical:{meanRadiusKm:1188.3,equatorialRadiusKm:1188.3,polarRadiusKm:1188.3,flattening:0,massKg:1303e19,gmKm3S2:869.6,rotationPeriodHours:-153.2928,axialTiltDeg:122.53,meanTemperatureK:44,colorHex:"#c79f82"},orbit:{semiMajorAxisKm:590638e4,semiMajorAxisAU:39.482,eccentricity:.2488,inclinationDeg:17.16,longitudeAscendingNodeDeg:110.3,argumentPeriapsisDeg:113.76,meanAnomalyAtEpochDeg:14.53,orbitalPeriodDays:90560},description:'Largest known Kuiper Belt dwarf planet; features the high-albedo nitrogen-ice glacier Sputnik Planitia (the "Heart"), water-ice mountains, and blue atmospheric haze.'},{id:"901",name:"Charon",category:"moon",orderFromSun:9,parentId:"999",parentName:"Pluto",physical:{meanRadiusKm:606,massKg:1586e18,rotationPeriodHours:153.29,colorHex:"#99948e"},orbit:{semiMajorAxisKm:19596,semiMajorAxisAU:131e-6,eccentricity:5e-5,inclinationDeg:.001,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:0,orbitalPeriodDays:6.38723},description:"Mutually tidally locked binary companion to Pluto; features a dark reddish tholin polar hood (Mordor Macula) and massive equatorial tectonic chasms."},{id:"1",name:"Ceres",category:"dwarf_planet",orderFromSun:4.5,physical:{meanRadiusKm:469.7,equatorialRadiusKm:487.3,polarRadiusKm:446,flattening:.0847,massKg:93835e16,gmKm3S2:62.63,rotationPeriodHours:9.074,axialTiltDeg:4,meanTemperatureK:168,colorHex:"#88847e"},orbit:{semiMajorAxisKm:41369e4,semiMajorAxisAU:2.767,eccentricity:.0758,inclinationDeg:10.593,longitudeAscendingNodeDeg:80.33,argumentPeriapsisDeg:73.59,meanAnomalyAtEpochDeg:95.99,orbitalPeriodDays:1680.5},description:"Largest body in the asteroid belt, comprising ~33% of its total mass; differentiated protoplanet with an ice-rich mantle and bright sodium-carbonate salt spots (Cerealia Facula in Occator Crater)."},{id:"4",name:"Vesta",category:"asteroid",orderFromSun:4.3,physical:{meanRadiusKm:261.4,equatorialRadiusKm:286.3,polarRadiusKm:229,flattening:.2,massKg:259e18,rotationPeriodHours:5.342,axialTiltDeg:29,colorHex:"#a39b91"},orbit:{semiMajorAxisKm:35326e4,semiMajorAxisAU:2.361,eccentricity:.0887,inclinationDeg:7.14,longitudeAscendingNodeDeg:103.81,argumentPeriapsisDeg:151.2,meanAnomalyAtEpochDeg:20.86,orbitalPeriodDays:1325.5},description:"Brightest asteroid visible from Earth; preserved basaltic differentiated protoplanet with metallic core, silicate mantle, and enormous south-polar impact crater Rheasilvia."},{id:"2",name:"Pallas",category:"asteroid",orderFromSun:4.6,physical:{meanRadiusKm:256.5,massKg:205e18,rotationPeriodHours:7.813,axialTiltDeg:84,colorHex:"#827f7a"},orbit:{semiMajorAxisKm:41475e4,semiMajorAxisAU:2.772,eccentricity:.231,inclinationDeg:34.841,longitudeAscendingNodeDeg:173.08,argumentPeriapsisDeg:310.05,meanAnomalyAtEpochDeg:58.74,orbitalPeriodDays:1686},description:"Third-largest asteroid in the belt; notable for its unusually high 34.8° orbital inclination and dynamic golf-ball-like surface topography."},{id:"10",name:"Hygiea",category:"asteroid",orderFromSun:4.8,physical:{meanRadiusKm:203.6,massKg:832e17,rotationPeriodHours:13.825,colorHex:"#605c57"},orbit:{semiMajorAxisKm:4703e5,semiMajorAxisAU:3.144,eccentricity:.117,inclinationDeg:3.842,longitudeAscendingNodeDeg:283.45,argumentPeriapsisDeg:312.31,meanAnomalyAtEpochDeg:145.2,orbitalPeriodDays:2036},description:"Fourth-largest asteroid and major carbonaceous C-type asteroid; nearly spherical body likely formed from a catastrophic impact parent-body disruption."},{id:"16",name:"Psyche",category:"asteroid",orderFromSun:4.7,physical:{meanRadiusKm:111,massKg:229e17,rotationPeriodHours:4.196,axialTiltDeg:95,colorHex:"#b8aba0"},orbit:{semiMajorAxisKm:4374e5,semiMajorAxisAU:2.924,eccentricity:.134,inclinationDeg:3.095,longitudeAscendingNodeDeg:150.06,argumentPeriapsisDeg:228.41,meanAnomalyAtEpochDeg:185,orbitalPeriodDays:1826},description:"Enormous metallic M-type asteroid thought to be the exposed nickel-iron core of an early protoplanet stripped by hit-and-run collisions; target of NASA’s Psyche mission."},{id:"433",name:"Eros",category:"asteroid",orderFromSun:3.5,physical:{meanRadiusKm:8.42,massKg:6687e12,rotationPeriodHours:5.27,colorHex:"#998d7f"},orbit:{semiMajorAxisKm:2175e5,semiMajorAxisAU:1.454,eccentricity:.2227,inclinationDeg:10.828,longitudeAscendingNodeDeg:304.32,argumentPeriapsisDeg:178.82,meanAnomalyAtEpochDeg:315,orbitalPeriodDays:643.2},description:"Elongated peanut-shaped S-type near-Earth asteroid; historic target orbited and landed upon by the NEAR Shoemaker spacecraft in 2001."},{id:"951",name:"Gaspra",category:"asteroid",orderFromSun:4.1,physical:{meanRadiusKm:6.1,massKg:2e16,rotationPeriodHours:7.042,colorHex:"#a09485"},orbit:{semiMajorAxisKm:3306e5,semiMajorAxisAU:2.21,eccentricity:.173,inclinationDeg:4.102,longitudeAscendingNodeDeg:253.2,argumentPeriapsisDeg:129.6,meanAnomalyAtEpochDeg:70,orbitalPeriodDays:1199.7},description:"First asteroid ever visited by a spacecraft (Galileo flyby in 1991); irregular S-type asteroid with prominent groove-like depressions."},{id:"243",name:"Ida",category:"asteroid",orderFromSun:4.6,physical:{meanRadiusKm:15.7,massKg:42e15,rotationPeriodHours:4.634,colorHex:"#9c9284"},orbit:{semiMajorAxisKm:428e6,semiMajorAxisAU:2.861,eccentricity:.046,inclinationDeg:1.138,longitudeAscendingNodeDeg:324,argumentPeriapsisDeg:109.8,meanAnomalyAtEpochDeg:210,orbitalPeriodDays:1768},description:"Coronis-family asteroid visited by Galileo in 1993, famous for the historic discovery of Dactyl, the first recognized asteroid moon."},{id:"101955",name:"Bennu",category:"asteroid",orderFromSun:3.2,physical:{meanRadiusKm:.242,massKg:7329e7,rotationPeriodHours:4.296,colorHex:"#3a3a3a"},orbit:{semiMajorAxisKm:1685e5,semiMajorAxisAU:1.126,eccentricity:.2037,inclinationDeg:6.035,longitudeAscendingNodeDeg:2.06,argumentPeriapsisDeg:66.22,meanAnomalyAtEpochDeg:101.7,orbitalPeriodDays:436.6},description:"Diamond-shaped carbonaceous rubble-pile near-Earth asteroid sampled by NASA’s OSIRIS-REx spacecraft, delivering pristine solar nebula samples to Earth in 2023."},{id:"162173",name:"Ryugu",category:"asteroid",orderFromSun:3.3,physical:{meanRadiusKm:.448,massKg:45e10,rotationPeriodHours:7.632,colorHex:"#353535"},orbit:{semiMajorAxisKm:178e6,semiMajorAxisAU:1.19,eccentricity:.1902,inclinationDeg:5.884,longitudeAscendingNodeDeg:251.6,argumentPeriapsisDeg:211.4,meanAnomalyAtEpochDeg:220,orbitalPeriodDays:474.5},description:"Spinning-top shaped Cb-type near-Earth asteroid sampled by JAXA’s Hayabusa2 spacecraft, rich in water-bearing minerals and prebiotic amino acids."}],Au=[...cT,...uT],ri=class ri{static getAllBodies(){return this.bodies}static getBody(e){return this.bodiesById.get(e)||this.bodiesByName.get(e.toLowerCase())}static getParent(e){if(e.parentId)return this.bodiesById.get(e.parentId)}static getMoonsOf(e){const n=this.getBody(e);return n?this.moonsByParentId.get(n.id)||[]:[]}static getByCategory(e){return this.bodies.filter(n=>n.category===e)}static getPlanets(){return this.getByCategory("planet")}static getMoons(){return this.getByCategory("moon")}static getDwarfPlanets(){return this.getByCategory("dwarf_planet")}static getAsteroids(){return this.getByCategory("asteroid")}static search(e){const n=e.trim().toLowerCase();return n?this.bodies.filter(i=>i.name.toLowerCase().includes(n)||i.category.toLowerCase().includes(n)||i.parentName&&i.parentName.toLowerCase().includes(n)||i.description.toLowerCase().includes(n)):this.bodies}static getStats(){return{total:this.bodies.length,stars:this.getByCategory("star").length,planets:this.getPlanets().length,moons:this.getMoons().length,dwarfPlanets:this.getDwarfPlanets().length,asteroids:this.getAsteroids().length}}};j(ri,"bodies",Au),j(ri,"bodiesById",new Map(Au.map(e=>[e.id,e]))),j(ri,"bodiesByName",new Map(Au.map(e=>[e.name.toLowerCase(),e]))),j(ri,"moonsByParentId",new Map),(()=>{for(const e of ri.bodies)e.parentId&&(ri.moonsByParentId.has(e.parentId)||ri.moonsByParentId.set(e.parentId,[]),ri.moonsByParentId.get(e.parentId).push(e))})();let yn=ri;class Ro{static getTexture(e){if(this.cache.has(e))return this.cache.get(e);let n;switch(e){case"Sun":n=this.createSunTexture();break;case"Mercury":n=this.createMercuryTexture();break;case"Venus":n=this.createVenusTexture();break;case"Earth":n=this.createEarthTexture();break;case"EarthClouds":n=this.createEarthCloudsTexture();break;case"Mars":n=this.createMarsTexture();break;case"Jupiter":n=this.createJupiterTexture();break;case"Saturn":n=this.createSaturnTexture();break;case"SaturnRings":n=this.createSaturnRingsTexture();break;case"Uranus":n=this.createUranusTexture();break;case"Neptune":n=this.createNeptuneTexture();break;case"Moon":n=this.createMoonTexture();break;case"Io":n=this.createIoTexture();break;case"Europa":n=this.createEuropaTexture();break;case"Ganymede":n=this.createGanymedeTexture();break;case"Callisto":n=this.createCallistoTexture();break;case"Titan":n=this.createTitanTexture();break;case"Enceladus":n=this.createEnceladusTexture();break;case"Triton":n=this.createTritonTexture();break;case"Pluto":n=this.createPlutoTexture();break;case"Ceres":n=this.createCeresTexture();break;default:n=this.createRockyCrateredTexture(e)}return this.cache.set(e,n),n}static createSunTexture(){const i=document.createElement("canvas");i.width=1024,i.height=512;const r=i.getContext("2d"),s=r.createLinearGradient(0,0,0,512);s.addColorStop(0,"#fff4cc"),s.addColorStop(.5,"#ffbb33"),s.addColorStop(1,"#ff8800"),r.fillStyle=s,r.fillRect(0,0,1024,512);const o=r.getImageData(0,0,1024,512),a=o.data;for(let c=0;c<a.length;c+=4){const d=c/4%1024,h=Math.floor(c/4/1024),f=Math.sin(d*.05)*Math.cos(h*.05),p=Math.sin(d*.12+1.2)*Math.cos(h*.12+.8),v=Math.sin(d*.25)*Math.sin(h*.25),y=f*.5+p*.3+v*.2;a[c]=Math.min(255,Math.max(180,245+y*35)),a[c+1]=Math.min(240,Math.max(120,180+y*55)),a[c+2]=Math.min(180,Math.max(20,60+y*40)),a[c+3]=255}r.putImageData(o,0,0),r.fillStyle="rgba(120, 30, 0, 0.6)";for(let c=0;c<12;c++){const d=(c*85+40)%1024,h=160+c*37%180,f=6+c%5*3;r.beginPath(),r.arc(d,h,f,0,Math.PI*2),r.fill(),r.fillStyle="rgba(60, 10, 0, 0.85)",r.beginPath(),r.arc(d,h,f*.45,0,Math.PI*2),r.fill()}const l=new yt(i);return l.wrapS=Mt,l.wrapT=Qe,l}static createMercuryTexture(){const i=document.createElement("canvas");i.width=1024,i.height=512;const r=i.getContext("2d");r.fillStyle="#78736d",r.fillRect(0,0,1024,512);const s=r.getImageData(0,0,1024,512),o=s.data;for(let l=0;l<o.length;l+=4){const c=l/4%1024,d=Math.floor(l/4/1024),f=120+(Math.sin(c*.08)*Math.cos(d*.08)+Math.sin(c*.2)*Math.sin(d*.2))*18;o[l]=f*.95,o[l+1]=f*.93,o[l+2]=f*.9,o[l+3]=255}r.putImageData(s,0,0);for(let l=0;l<120;l++){const c=(l*79+33)%1024,d=20+l*47%472,h=4+l%15*2;r.fillStyle="rgba(40, 38, 36, 0.4)",r.beginPath(),r.arc(c,d,h,0,Math.PI*2),r.fill(),r.strokeStyle="rgba(210, 205, 200, 0.35)",r.lineWidth=1.5,r.beginPath(),r.arc(c,d,h,Math.PI*.8,Math.PI*1.8),r.stroke()}const a=new yt(i);return a.wrapS=Mt,a.wrapT=Qe,a}static createVenusTexture(){const i=document.createElement("canvas");i.width=1024,i.height=512;const r=i.getContext("2d"),s=r.createLinearGradient(0,0,0,512);s.addColorStop(0,"#f0d8a8"),s.addColorStop(.2,"#ecd096"),s.addColorStop(.5,"#e5c483"),s.addColorStop(.8,"#ecd096"),s.addColorStop(1,"#f0d8a8"),r.fillStyle=s,r.fillRect(0,0,1024,512),r.fillStyle="rgba(215, 180, 110, 0.25)";for(let a=0;a<18;a++){const l=a*28.444444444444443;r.beginPath(),r.moveTo(0,l);for(let c=0;c<=1024;c+=30){const d=Math.sin(c*.015+a)*12+Math.cos(c*.03)*6;r.lineTo(c,l+d)}r.lineTo(1024,l+20),r.lineTo(0,l+20),r.closePath(),r.fill()}const o=new yt(i);return o.wrapS=Mt,o.wrapT=Qe,o}static createEarthTexture(){const i=document.createElement("canvas");i.width=1024,i.height=512;const r=i.getContext("2d");r.fillStyle="#0f274a",r.fillRect(0,0,1024,512);const s=r.createLinearGradient(0,0,0,512);s.addColorStop(0,"rgba(25, 65, 115, 0.4)"),s.addColorStop(.5,"rgba(10, 35, 75, 0.1)"),s.addColorStop(1,"rgba(25, 65, 115, 0.4)"),r.fillStyle=s,r.fillRect(0,0,1024,512),r.fillStyle="#2d5930",r.beginPath(),r.ellipse(1024*.58,512*.38,140,85,.1,0,Math.PI*2),r.ellipse(1024*.53,512*.62,70,95,-.15,0,Math.PI*2),r.fill(),r.beginPath(),r.ellipse(1024*.22,512*.32,95,75,-.2,0,Math.PI*2),r.ellipse(1024*.3,512*.65,60,90,.25,0,Math.PI*2),r.fill(),r.beginPath(),r.ellipse(1024*.82,512*.72,45,35,.1,0,Math.PI*2),r.fill(),r.fillStyle="#9e8548",r.beginPath(),r.ellipse(1024*.52,512*.45,65,30,0,0,Math.PI*2),r.ellipse(1024*.82,512*.72,28,20,0,0,Math.PI*2),r.fill(),r.fillStyle="#f0f6ff",r.beginPath(),r.rect(0,0,1024,28),r.fill(),r.beginPath(),r.rect(0,476,1024,36),r.fill();const o=new yt(i);return o.wrapS=Mt,o.wrapT=Qe,o}static createEarthCloudsTexture(){const i=document.createElement("canvas");i.width=1024,i.height=512;const r=i.getContext("2d");r.clearRect(0,0,1024,512),r.fillStyle="rgba(255, 255, 255, 0.75)";for(let o=0;o<28;o++){const a=(o*65+15)%1024,l=60+o*42%392,c=55+o%7*15,d=18+o%4*6;r.beginPath(),r.ellipse(a,l,c,d,o%5*.2,0,Math.PI*2),r.fill()}const s=new yt(i);return s.wrapS=Mt,s.wrapT=Qe,s}static createMarsTexture(){const i=document.createElement("canvas");i.width=1024,i.height=512;const r=i.getContext("2d");r.fillStyle="#bd532b",r.fillRect(0,0,1024,512),r.fillStyle="rgba(68, 38, 25, 0.45)",r.beginPath(),r.ellipse(1024*.45,512*.52,90,45,.2,0,Math.PI*2),r.ellipse(1024*.75,512*.42,70,50,-.1,0,Math.PI*2),r.ellipse(1024*.15,512*.58,60,35,.15,0,Math.PI*2),r.fill(),r.fillStyle="rgba(165, 80, 45, 0.8)",r.beginPath(),r.arc(1024*.28,512*.45,24,0,Math.PI*2),r.fill(),r.fillStyle="#3a2015",r.beginPath(),r.arc(1024*.28,512*.45,6,0,Math.PI*2),r.fill(),r.fillStyle="#f8f4f0",r.beginPath(),r.ellipse(1024*.5,12,110,12,0,0,Math.PI*2),r.fill(),r.beginPath(),r.ellipse(1024*.5,498,85,14,0,0,Math.PI*2),r.fill();const s=new yt(i);return s.wrapS=Mt,s.wrapT=Qe,s}static createJupiterTexture(){const i=document.createElement("canvas");i.width=1024,i.height=512;const r=i.getContext("2d"),s=["#a88460","#dec8aa","#8f5c35","#f2e2ce","#9e673d","#ebd5be","#82522e","#f5e8da","#916139","#e6cfb8"],o=512/s.length;for(let h=0;h<s.length;h++)r.fillStyle=s[h],r.fillRect(0,h*o,1024,o);for(let h=0;h<s.length;h++){const f=h*o;r.fillStyle=h%2===0?"rgba(80, 45, 20, 0.35)":"rgba(255, 245, 235, 0.35)",r.beginPath(),r.moveTo(0,f);for(let p=0;p<=1024;p+=25){const v=Math.sin(p*.03+h*2)*5+Math.cos(p*.08)*3;r.lineTo(p,f+v)}r.lineTo(1024,f+o*.5),r.lineTo(0,f+o*.5),r.closePath(),r.fill()}const a=1024*.65,l=512*.62,c=r.createRadialGradient(a,l,5,a,l,32);c.addColorStop(0,"#c43d22"),c.addColorStop(.6,"#b5482e"),c.addColorStop(1,"#8f5c35"),r.fillStyle=c,r.beginPath(),r.ellipse(a,l,36,20,-.08,0,Math.PI*2),r.fill(),r.strokeStyle="rgba(255, 255, 255, 0.5)",r.lineWidth=2.5,r.beginPath(),r.ellipse(a+45,l-4,18,9,.1,0,Math.PI*2),r.stroke();const d=new yt(i);return d.wrapS=Mt,d.wrapT=Qe,d}static createSaturnTexture(){const i=document.createElement("canvas");i.width=1024,i.height=512;const r=i.getContext("2d"),s=r.createLinearGradient(0,0,0,512);s.addColorStop(0,"#757c6b"),s.addColorStop(.2,"#ccb98d"),s.addColorStop(.4,"#e8dcba"),s.addColorStop(.5,"#f4ebd2"),s.addColorStop(.6,"#e8dcba"),s.addColorStop(.8,"#ccb98d"),s.addColorStop(1,"#80806a"),r.fillStyle=s,r.fillRect(0,0,1024,512);for(let a=0;a<30;a++){const l=a/30*512;r.fillStyle=a%2===0?"rgba(120, 100, 70, 0.08)":"rgba(255, 250, 240, 0.08)",r.fillRect(0,l,1024,512/30)}const o=new yt(i);return o.wrapS=Mt,o.wrapT=Qe,o}static createSaturnRingsTexture(){const i=document.createElement("canvas");i.width=1024,i.height=64;const r=i.getContext("2d");r.clearRect(0,0,1024,64);const s=r.createLinearGradient(0,0,1024,0);s.addColorStop(0,"rgba(140, 130, 115, 0.0)"),s.addColorStop(.05,"rgba(150, 140, 125, 0.25)"),s.addColorStop(.18,"rgba(160, 150, 130, 0.35)"),s.addColorStop(.2,"rgba(225, 215, 185, 0.85)"),s.addColorStop(.35,"rgba(240, 230, 205, 0.95)"),s.addColorStop(.55,"rgba(230, 220, 195, 0.90)"),s.addColorStop(.57,"rgba(40, 35, 30, 0.02)"),s.addColorStop(.63,"rgba(40, 35, 30, 0.02)"),s.addColorStop(.65,"rgba(215, 205, 180, 0.75)"),s.addColorStop(.8,"rgba(225, 215, 190, 0.80)"),s.addColorStop(.83,"rgba(40, 35, 30, 0.05)"),s.addColorStop(.85,"rgba(220, 210, 185, 0.70)"),s.addColorStop(.95,"rgba(180, 170, 150, 0.35)"),s.addColorStop(1,"rgba(140, 130, 115, 0.0)"),r.fillStyle=s,r.fillRect(0,0,1024,64);const o=new yt(i);return o.wrapS=Qe,o.wrapT=Qe,o}static createUranusTexture(){const i=document.createElement("canvas");i.width=512,i.height=256;const r=i.getContext("2d"),s=r.createLinearGradient(0,0,0,256);return s.addColorStop(0,"#75c8d6"),s.addColorStop(.5,"#8ee0ed"),s.addColorStop(1,"#75c8d6"),r.fillStyle=s,r.fillRect(0,0,512,256),new yt(i)}static createNeptuneTexture(){const i=document.createElement("canvas");i.width=1024,i.height=512;const r=i.getContext("2d"),s=r.createLinearGradient(0,0,0,512);s.addColorStop(0,"#2d4aa0"),s.addColorStop(.3,"#3a62cb"),s.addColorStop(.5,"#4a75e6"),s.addColorStop(.7,"#3a62cb"),s.addColorStop(1,"#2d4aa0"),r.fillStyle=s,r.fillRect(0,0,1024,512),r.fillStyle="rgba(25, 40, 110, 0.35)",r.fillRect(0,512*.55,1024,40),r.fillStyle="#1b2c75",r.beginPath(),r.ellipse(1024*.45,512*.58,45,24,0,0,Math.PI*2),r.fill(),r.fillStyle="rgba(235, 245, 255, 0.8)",r.beginPath(),r.ellipse(1024*.45+50,512*.58-10,22,6,.1,0,Math.PI*2),r.fill();const o=new yt(i);return o.wrapS=Mt,o.wrapT=Qe,o}static createMoonTexture(){const i=document.createElement("canvas");i.width=512,i.height=256;const r=i.getContext("2d");r.fillStyle="#aba8a2",r.fillRect(0,0,512,256);const s=r.getImageData(0,0,512,256),o=s.data;for(let c=0;c<o.length;c+=4){const d=(Math.random()-.5)*24;o[c]=Math.max(0,Math.min(255,o[c]+d)),o[c+1]=Math.max(0,Math.min(255,o[c+1]+d)),o[c+2]=Math.max(0,Math.min(255,o[c+2]+d))}r.putImageData(s,0,0);const a=[{x:512*.35,y:256*.35,rx:55,ry:45,color:"#4a4844"},{x:512*.48,y:256*.38,rx:35,ry:30,color:"#4d4a46"},{x:512*.55,y:256*.48,rx:40,ry:32,color:"#494743"},{x:512*.22,y:256*.42,rx:65,ry:60,color:"#52504b"},{x:512*.42,y:256*.55,rx:38,ry:28,color:"#4b4844"},{x:512*.65,y:256*.45,rx:30,ry:25,color:"#504d49"}];for(const c of a){const d=r.createRadialGradient(c.x,c.y,5,c.x,c.y,c.rx);d.addColorStop(0,c.color),d.addColorStop(.85,c.color),d.addColorStop(1,"rgba(171, 168, 162, 0)"),r.fillStyle=d,r.beginPath(),r.ellipse(c.x,c.y,c.rx,c.ry,0,0,Math.PI*2),r.fill()}r.fillStyle="#ffffff",r.beginPath(),r.arc(512*.42,256*.72,4,0,Math.PI*2),r.fill(),r.strokeStyle="rgba(255, 255, 255, 0.25)",r.lineWidth=1;for(let c=0;c<Math.PI*2;c+=.35)r.beginPath(),r.moveTo(512*.42,256*.72),r.lineTo(512*.42+Math.cos(c)*75,256*.72+Math.sin(c)*75),r.stroke();const l=new yt(i);return l.wrapS=Mt,l.wrapT=Qe,l}static createIoTexture(){const i=document.createElement("canvas");i.width=512,i.height=256;const r=i.getContext("2d");r.fillStyle="#e5c158",r.fillRect(0,0,512,256);for(let a=0;a<40;a++){const l=Math.random()*512,c=Math.random()*256,d=10+Math.random()*25;r.fillStyle=Math.random()>.5?"rgba(215, 140, 30, 0.45)":"rgba(245, 230, 150, 0.4)",r.beginPath(),r.arc(l,c,d,0,Math.PI*2),r.fill()}const s=[{x:512*.25,y:256*.45,r:10,color:"#7a1800"},{x:512*.65,y:256*.35,r:14,color:"#2b1005"},{x:512*.45,y:256*.6,r:8,color:"#8c2505"},{x:512*.8,y:256*.55,r:11,color:"#541505"},{x:512*.15,y:256*.7,r:7,color:"#882200"}];for(const a of s)r.strokeStyle="rgba(200, 50, 0, 0.6)",r.lineWidth=3,r.beginPath(),r.arc(a.x,a.y,a.r*2.2,0,Math.PI*2),r.stroke(),r.fillStyle=a.color,r.beginPath(),r.arc(a.x,a.y,a.r,0,Math.PI*2),r.fill();const o=new yt(i);return o.wrapS=Mt,o.wrapT=Qe,o}static createEuropaTexture(){const i=document.createElement("canvas");i.width=1024,i.height=512;const r=i.getContext("2d");r.fillStyle="#f4f6fa",r.fillRect(0,0,1024,512);const s=r.createLinearGradient(0,0,0,512*.25);s.addColorStop(0,"rgba(230, 240, 250, 0.6)"),s.addColorStop(1,"rgba(244, 246, 250, 0.0)"),r.fillStyle=s,r.fillRect(0,0,1024,512*.25);const o=r.createLinearGradient(0,512,0,512*.75);o.addColorStop(0,"rgba(230, 240, 250, 0.6)"),o.addColorStop(1,"rgba(244, 246, 250, 0.0)"),r.fillStyle=o,r.fillRect(0,512*.75,1024,512*.25);for(let h=0;h<35;h++){const f=h*37%1024,p=512*.3+h*29%(512*.4),v=25+h%5*12,y=r.createRadialGradient(f,p,2,f,p,v);y.addColorStop(0,"rgba(225, 232, 240, 0.25)"),y.addColorStop(1,"rgba(244, 246, 250, 0.0)"),r.fillStyle=y,r.beginPath(),r.arc(f,p,v,0,Math.PI*2),r.fill()}const a=[{x:1024*.28,y:512*.45,rx:42,ry:28},{x:1024*.62,y:512*.52,rx:36,ry:24},{x:1024*.45,y:512*.35,rx:30,ry:20},{x:1024*.82,y:512*.42,rx:38,ry:25}];for(const h of a){const f=r.createRadialGradient(h.x,h.y,5,h.x,h.y,h.rx);f.addColorStop(0,"rgba(175, 135, 105, 0.16)"),f.addColorStop(.7,"rgba(160, 125, 98, 0.10)"),f.addColorStop(1,"rgba(244, 246, 250, 0.0)"),r.fillStyle=f,r.beginPath(),r.ellipse(h.x,h.y,h.rx,h.ry,.2,0,Math.PI*2),r.fill()}let l=42;const c=()=>(l=l*16807%2147483647,(l-1)/2147483646);for(let h=0;h<32;h++){const f=c()*1024,p=512*.15+c()*512*.7,v=80+c()*160,y=(c()-.5)*Math.PI*1.4,m=f+Math.cos(y)*(v*.5)+(c()-.5)*40,u=p+Math.sin(y)*(v*.5)+(c()-.5)*40,g=f+Math.cos(y)*v,x=p+Math.sin(y)*v;r.strokeStyle="rgba(155, 115, 90, 0.14)",r.lineWidth=4,r.beginPath(),r.moveTo(f,p),r.quadraticCurveTo(m,u,g,x),r.stroke(),r.strokeStyle="rgba(115, 80, 65, 0.45)",r.lineWidth=1.2,r.beginPath(),r.moveTo(f,p),r.quadraticCurveTo(m,u,g,x),r.stroke(),r.strokeStyle="rgba(255, 255, 255, 0.55)",r.lineWidth=.8,r.beginPath(),r.moveTo(f+1,p+1),r.quadraticCurveTo(m+1,u+1,g+1,x+1),r.stroke()}r.strokeStyle="rgba(130, 95, 78, 0.22)",r.lineWidth=.7;for(let h=0;h<50;h++){const f=c()*1024,p=c()*512,v=30+c()*60,y=c()*Math.PI*2;r.beginPath(),r.moveTo(f,p),r.lineTo(f+Math.cos(y)*v,p+Math.sin(y)*v),r.stroke()}const d=new yt(i);return d.wrapS=Mt,d.wrapT=Qe,d}static createGanymedeTexture(){const i=document.createElement("canvas");i.width=512,i.height=256;const r=i.getContext("2d");r.fillStyle="#6e655c",r.fillRect(0,0,512,256),r.fillStyle="#9c9288";for(let o=0;o<14;o++){const a=(o*20+10)%256;r.fillRect(0,a,512,8+o%4*3)}r.strokeStyle="rgba(230, 230, 230, 0.35)",r.lineWidth=1;for(let o=0;o<256;o+=6)r.beginPath(),r.moveTo(0,o),r.lineTo(512,o+Math.sin(o*.1)*8),r.stroke();const s=new yt(i);return s.wrapS=Mt,s.wrapT=Qe,s}static createCallistoTexture(){const i=document.createElement("canvas");i.width=512,i.height=256;const r=i.getContext("2d");r.fillStyle="#4e4741",r.fillRect(0,0,512,256);for(let l=0;l<180;l++){const c=Math.random()*512,d=Math.random()*256,h=2+Math.random()*8;r.fillStyle="#2f2a26",r.beginPath(),r.arc(c,d,h,0,Math.PI*2),r.fill(),r.strokeStyle="rgba(220, 225, 235, 0.7)",r.lineWidth=1,r.beginPath(),r.arc(c,d,h,0,Math.PI),r.stroke()}const s=512*.45,o=256*.4;r.strokeStyle="rgba(200, 210, 220, 0.4)";for(let l=8;l<=55;l+=7)r.beginPath(),r.arc(s,o,l,0,Math.PI*2),r.stroke();const a=new yt(i);return a.wrapS=Mt,a.wrapT=Qe,a}static createTitanTexture(){const i=document.createElement("canvas");i.width=512,i.height=256;const r=i.getContext("2d"),s=r.createLinearGradient(0,0,0,256);s.addColorStop(0,"#c78028"),s.addColorStop(.2,"#dba046"),s.addColorStop(.5,"#e8b258"),s.addColorStop(.8,"#dba046"),s.addColorStop(1,"#c07820"),r.fillStyle=s,r.fillRect(0,0,512,256),r.fillStyle="rgba(210, 130, 40, 0.2)",r.fillRect(0,256*.35,512,25),r.fillRect(0,256*.6,512,25);const o=new yt(i);return o.wrapS=Mt,o.wrapT=Qe,o}static createEnceladusTexture(){const i=document.createElement("canvas");i.width=512,i.height=256;const r=i.getContext("2d");r.fillStyle="#f6f8fb",r.fillRect(0,0,512,256),r.strokeStyle="#68a0c8",r.lineWidth=2;for(let o=0;o<4;o++){const a=217.6+o*5;r.beginPath(),r.moveTo(512*.3,a),r.bezierCurveTo(512*.45,a+4,512*.55,a-4,512*.7,a),r.stroke()}const s=new yt(i);return s.wrapS=Mt,s.wrapT=Qe,s}static createTritonTexture(){const i=document.createElement("canvas");i.width=512,i.height=256;const r=i.getContext("2d");r.fillStyle="#decac0",r.fillRect(0,0,512,256),r.fillStyle="rgba(165, 135, 125, 0.35)";for(let o=10;o<512;o+=16)for(let a=10;a<256*.6;a+=14)r.beginPath(),r.arc(o+a%8,a,5,0,Math.PI*2),r.fill();r.fillStyle="rgba(50, 40, 35, 0.6)";for(let o=0;o<8;o++){const a=102.4+o*45,l=256*.75+o%3*8;r.beginPath(),r.ellipse(a,l,12,3,.4,0,Math.PI*2),r.fill()}const s=new yt(i);return s.wrapS=Mt,s.wrapT=Qe,s}static createPlutoTexture(){const i=document.createElement("canvas");i.width=512,i.height=256;const r=i.getContext("2d");r.fillStyle="#8f4f35",r.fillRect(0,0,512,256),r.fillStyle="#421f14",r.fillRect(0,256*.5,512*.45,45);const s=512*.62,o=256*.42;r.fillStyle="#f0e6dc",r.beginPath(),r.ellipse(s-16,o,28,35,-.2,0,Math.PI*2),r.fill(),r.ellipse(s+16,o,26,32,.2,0,Math.PI*2),r.fill();const a=new yt(i);return a.wrapS=Mt,a.wrapT=Qe,a}static createCeresTexture(){const i=document.createElement("canvas");i.width=512,i.height=256;const r=i.getContext("2d");r.fillStyle="#6e6962",r.fillRect(0,0,512,256);for(let l=0;l<90;l++){const c=Math.random()*512,d=Math.random()*256,h=2+Math.random()*6;r.fillStyle="#48443e",r.beginPath(),r.arc(c,d,h,0,Math.PI*2),r.fill()}const s=512*.52,o=256*.44;r.fillStyle="#3a3630",r.beginPath(),r.arc(s,o,14,0,Math.PI*2),r.fill(),r.fillStyle="#ffffff",r.beginPath(),r.arc(s,o,3.5,0,Math.PI*2),r.fill();const a=new yt(i);return a.wrapS=Mt,a.wrapT=Qe,a}static createRockyCrateredTexture(e){const r=document.createElement("canvas");r.width=256,r.height=128;const s=r.getContext("2d"),o=e==="Bennu"||e==="Ryugu"||e==="Hygiea",a=e==="Psyche";s.fillStyle=o?"#323232":a?"#948a7e":"#7a746d",s.fillRect(0,0,256,128);for(let c=0;c<50;c++){const d=Math.random()*256,h=Math.random()*128,f=2+Math.random()*5;s.fillStyle=o?"#1a1a1a":"#4e4842",s.beginPath(),s.arc(d,h,f,0,Math.PI*2),s.fill(),s.strokeStyle=o?"#505050":"rgba(200, 195, 185, 0.5)",s.lineWidth=1,s.beginPath(),s.arc(d,h,f,0,Math.PI),s.stroke()}const l=new yt(r);return l.wrapS=Mt,l.wrapT=Qe,l}static createGenericTexture(e){const n=document.createElement("canvas");n.width=64,n.height=64;const i=n.getContext("2d");return i.fillStyle=e,i.fillRect(0,0,64,64),new yt(n)}}j(Ro,"cache",new Map);const Cr=class Cr{constructor(){j(this,"loader",new iT);j(this,"customLoader",null);j(this,"cache",new Map);j(this,"inFlightRequests",new Map);j(this,"maxAnisotropy",8);j(this,"baseUrl",(typeof import.meta<"u"&&"/solaris/"||"/").replace(/\/?$/,"/"))}resolveUrl(e){if(!e)return"";if(e.startsWith("http://")||e.startsWith("https://")||e.startsWith("data:")||e.startsWith("blob:"))return e;const n=e.replace(/^(\.\/)+/,"").replace(/^\/+/,"").replace(/\/+/g,"/");return`${this.baseUrl.replace(/\/+$/,"/")}${n}`}static getInstance(){return Cr.instance||(Cr.instance=new Cr),Cr.instance}setLoader(e){this.customLoader=e}setBaseUrl(e){this.baseUrl=e.replace(/\/?$/,"/")}setMaxAnisotropy(e){this.maxAnisotropy=Math.max(1,e);for(const n of this.cache.values())n.anisotropy=this.maxAnisotropy,n.needsUpdate=!0}isCached(e){const n=this.resolveUrl(e);return this.cache.has(n)}getCacheSize(){return this.cache.size}evictFromCache(e,n=!1){const i=this.resolveUrl(e),r=this.cache.get(i);return r?(this.cache.delete(i),this.inFlightRequests.delete(i),n&&r.dispose(),!0):!1}clearCache(e=!1){if(e)for(const n of this.cache.values())n.dispose();this.cache.clear(),this.inFlightRequests.clear()}resetForTesting(){this.clearCache(!1),this.customLoader=null,this.baseUrl=(typeof import.meta<"u"&&"/solaris/"||"/").replace(/\/?$/,"/")}loadTexture(e,n=!0,i){const r=this.resolveUrl(e),s=this.cache.get(r);if(s)return s;if(typeof document>"u"&&!this.customLoader){const d=new zt;return d.colorSpace=n?Vt:In,this.cache.set(r,d),d}const o=this.customLoader||this.loader;let a=!1,l=null;const c=o.load(r,d=>{d.colorSpace=n?Vt:In,d.generateMipmaps=!0,d.minFilter=$n,d.magFilter=fn,d.anisotropy=this.maxAnisotropy,d.needsUpdate=!0},void 0,d=>{if(a=!0,console.warn(`[TexturePipeline] Fallback activated for ${e} (${r}):`,d),this.cache.delete(r),this.inFlightRequests.delete(r),i&&l)try{const h=Ro.getTexture(i);h&&h.image&&(l.image=h.image,l.needsUpdate=!0)}catch(h){console.warn("[TexturePipeline] Fallback generation error:",h)}});if(l=c,a&&i)try{const d=Ro.getTexture(i);d&&d.image&&(l.image=d.image,l.needsUpdate=!0)}catch(d){console.warn("[TexturePipeline] Fallback generation error:",d)}return c.colorSpace=n?Vt:In,c.generateMipmaps=!0,c.minFilter=$n,c.magFilter=fn,c.anisotropy=this.maxAnisotropy,a||this.cache.set(r,c),c}loadTextureAsync(e,n=!0,i){const r=this.resolveUrl(e),s=this.cache.get(r);if(s)return Promise.resolve(s);const o=this.inFlightRequests.get(r);if(o)return o;if(typeof document>"u"&&!this.customLoader){const l=this.loadTexture(e,n,i);return Promise.resolve(l)}const a=new Promise((l,c)=>{(this.customLoader||this.loader).load(r,h=>{h.colorSpace=n?Vt:In,h.generateMipmaps=!0,h.minFilter=$n,h.magFilter=fn,h.anisotropy=this.maxAnisotropy,h.needsUpdate=!0,this.cache.set(r,h),this.inFlightRequests.delete(r),l(h)},void 0,h=>{if(this.cache.delete(r),this.inFlightRequests.delete(r),i){console.warn(`[TexturePipeline] Fallback activated for ${e}:`,h);const f=Ro.getTexture(i);l(f)}else c(h)})});return this.inFlightRequests.set(r,a),a}getPlanetTextures(e){switch(e){case"Sun":return{map:this.loadTexture("/textures/2k_sun.jpg",!0,"Sun"),emissiveMap:this.loadTexture("/textures/2k_sun.jpg",!0,"Sun")};case"Mercury":return{map:this.loadTexture("/textures/2k_mercury.jpg",!0,"Mercury")};case"Venus":return{map:this.loadTexture("/textures/2k_venus_atmosphere.jpg",!0,"Venus")};case"Earth":return{map:this.loadTexture("/textures/2k_earth_daymap.jpg",!0,"Earth"),normalMap:this.loadTexture("/textures/earth_normal_2048.jpg",!1),nightMap:this.loadTexture("/textures/2k_earth_nightmap.jpg",!0),cloudsMap:this.loadTexture("/textures/2k_earth_clouds.jpg",!0,"EarthClouds")};case"Moon":return{map:this.loadTexture("/textures/2k_moon.jpg",!0,"Moon")};case"Mars":return{map:this.loadTexture("/textures/2k_mars.jpg",!0,"Mars")};case"Jupiter":return{map:this.loadTexture("/textures/2k_jupiter.jpg",!0,"Jupiter")};case"Saturn":return{map:this.loadTexture("/textures/2k_saturn.jpg",!0,"Saturn"),ringAlphaMap:this.loadTexture("/textures/2k_saturn_ring_alpha.png",!1,"SaturnRings")};case"Uranus":return{map:this.loadTexture("/textures/2k_uranus.jpg",!0,"Uranus")};case"Neptune":return{map:this.loadTexture("/textures/2k_neptune.jpg",!0,"Neptune")};default:return{map:Ro.getTexture(e)}}}getMilkyWayTexture(){return this.loadTexture("/textures/gaia_sky.jpg",!0)}getMilkyWayDiskTexture(){return this.loadTexture("/textures/milky_way_disk.png",!0)}};j(Cr,"instance");let $s=Cr;class bu{static createPhotosphereMaterial(e){return new vt({uniforms:{sunTexture:{value:e},time:{value:0}},vertexShader:`
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
      `})}static createCoronaMaterial(e=14){return new vt({uniforms:{sunCenter:{value:new R(0,0,0)},sunRadius:{value:e},time:{value:0}},vertexShader:`
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
      `,blending:Jt,side:Lt,transparent:!0,depthWrite:!1})}static createProminencesMaterial(){return new vt({uniforms:{time:{value:0}},vertexShader:`
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
      `,blending:Jt,side:wn,transparent:!0,depthWrite:!1})}static createProminencesGroup(e){const n=new on;n.name="solar_prominences";const i=this.createProminencesMaterial();return[{lat:.35,lon:.2,scale:.14,angle:.4},{lat:-.42,lon:1.1,scale:.18,angle:-.3},{lat:.15,lon:2.3,scale:.11,angle:.6},{lat:-.25,lon:3.4,scale:.22,angle:-.5},{lat:.55,lon:4.2,scale:.15,angle:.2},{lat:-.1,lon:5.1,scale:.19,angle:.7},{lat:.4,lon:5.8,scale:.12,angle:-.4}].forEach((s,o)=>{const a=new jr(1,1,32,8),l=a.attributes.position,c=a.attributes.uv,d=s.scale*e*2.2,h=s.scale*e*1.6,f=s.scale*e*.28;for(let _=0;_<l.count;_++){const P=c.getX(_),T=c.getY(_),A=(P-.5)*d,b=Math.sin(P*Math.PI)*h,w=(T-.5)*f;l.setXYZ(_,A,b,w)}a.computeVertexNormals();const p=new lt(a,i);p.name=`prominence_loop_${o}`;const v=Math.cos(s.lat),y=Math.sin(s.lat),m=e*v*Math.cos(s.lon),u=e*y,g=e*v*Math.sin(s.lon);p.position.set(m,u,g);const x=new R(m,u,g).normalize();p.quaternion.setFromUnitVectors(new R(0,1,0),x),p.rotateOnAxis(new R(0,1,0),s.angle),n.add(p)}),n}}const Qv={Earth:{radiusScale:1.008,rayleighColor:new me(.24,.52,.92),twilightColor:new me(.95,.42,.16),density:.65,falloffPower:4.5,mieG:.72},Venus:{radiusScale:1.012,rayleighColor:new me(.92,.86,.64),twilightColor:new me(.85,.58,.32),density:1.1,falloffPower:3.5,mieG:.65},Mars:{radiusScale:1.004,rayleighColor:new me(.65,.55,.5),twilightColor:new me(.35,.5,.7),density:.12,falloffPower:6,mieG:.55},Uranus:{radiusScale:1.014,rayleighColor:new me(.48,.85,.82),twilightColor:new me(.32,.65,.72),density:.75,falloffPower:3.8,mieG:.7},Neptune:{radiusScale:1.014,rayleighColor:new me(.2,.45,.95),twilightColor:new me(.15,.3,.75),density:.8,falloffPower:3.8,mieG:.7}};class rg{static createAtmosphereMaterial(e){const n=Qv[e];return n?new vt({uniforms:{rayleighColor:{value:n.rayleighColor},twilightColor:{value:n.twilightColor},density:{value:n.density},falloffPower:{value:n.falloffPower},mieG:{value:n.mieG}},vertexShader:`
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
      `,blending:Jt,side:Lt,transparent:!0,depthWrite:!1}):null}}class sg{static createSurfaceMaterial(e,n,i,r){return new vt({uniforms:{dayMap:{value:e},normalMap:{value:n||null},nightMap:{value:i||null},cloudsMap:{value:r||null},hasNormalMap:{value:n?1:0},hasNightMap:{value:i?1:0},hasCloudsMap:{value:r?1:0}},vertexShader:`
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
      `})}static createCloudMaterial(e){return new vt({uniforms:{cloudsMap:{value:e}},vertexShader:`
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
      `,transparent:!0,depthWrite:!1})}}class dT{static createMaterial(e){const{name:n,category:i,map:r,normalMap:s}=e,o=n==="Jupiter"||n==="Saturn"||n==="Uranus"||n==="Neptune",a=n==="Europa"||n==="Enceladus",l=n==="Mercury"||n==="Moon"||i==="asteroid",c=n==="Mars",d=n==="Venus",h=n==="Saturn";return new vt({uniforms:{map:{value:r},normalMap:{value:s||null},hasNormalMap:{value:s?1:0},isGasGiant:{value:o?1:0},isIcyMoon:{value:a?1:0},isAirlessRocky:{value:l?1:0},isMars:{value:c?1:0},isVenus:{value:d?1:0},isSaturn:{value:h?1:0}},vertexShader:`
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
      `})}}class hT{static getVisualRadius(e){if(e.category==="star")return 48;switch(e.name){case"Jupiter":return 26.9;case"Saturn":return 22.68;case"Uranus":return 9.62;case"Neptune":return 9.32;case"Earth":return 2.4;case"Venus":return 2.28;case"Mars":return 1.28;case"Mercury":return .92;case"Pluto":return .45}if(e.category==="moon"){const n=e.physical.meanRadiusKm;return n<100?.18:n<500?.32:n<1200?.48:n<2e3?.65:.95}if(e.category==="dwarf_planet")return .45;if(e.category==="asteroid"){const n=e.physical.meanRadiusKm;return n<10?.18:n<100?.25:.38}return Math.max(.18,e.physical.meanRadiusKm/6371*2.4)}static getVisualDistance(e){if(e.orderFromSun===0)return 0;const n=e.orbit.semiMajorAxisAU;return 50+Math.pow(n,.58)*65}static createPlanet(e){var A;const n=new on;n.name=`orbit_pivot_${e.name}`;const i=new on;i.name=`body_group_${e.name}`,n.add(i);const r=this.getVisualRadius(e),s=this.getVisualDistance(e);i.position.set(s,0,0);const o=Pt.degToRad(e.physical.axialTiltDeg||0);i.rotation.z=o;const l=1-(e.physical.flattening||0),c=e.category==="moon"||e.category==="asteroid",d=e.category==="planet"||e.category==="star",h=new qn(1,d?96:c?36:64,d?64:c?24:48);if(e.category==="asteroid"||e.category==="moon"&&e.physical.meanRadiusKm<200){const b=h.attributes.position;for(let w=0;w<b.count;w++){const M=b.getX(w),D=b.getY(w),V=b.getZ(w),z=1+.18*Math.sin(M*4)*Math.cos(D*4+V*3);b.setXYZ(w,M*z,D*z,V*z)}h.computeVertexNormals()}const p=$s.getInstance().getPlanetTextures(e.name);let v,y,m,u,g,x;const _=[];if(e.category==="star"){v=bu.createPhotosphereMaterial(p.map);const b=new qn(2.45,96,64),w=bu.createCoronaMaterial(r),M=new lt(b,w);M.name="sun_corona",M.scale.set(r,r,r),i.add(M),_.push(M),x=bu.createProminencesGroup(r),i.add(x)}else if(e.name==="Earth"){if(v=sg.createSurfaceMaterial(p.map,p.normalMap,p.nightMap,p.cloudsMap),p.cloudsMap){const w=new qn(1.004,96,64),M=sg.createCloudMaterial(p.cloudsMap);m=new lt(w,M),m.name="earth_clouds",m.renderOrder=2,m.scale.set(r,r,r),i.add(m)}const b=rg.createAtmosphereMaterial("Earth");if(b){const w=new qn(1.012,96,64);u=new lt(w,b),u.name="earth_atmosphere",u.renderOrder=3,u.scale.set(r,r,r),i.add(u)}}else{v=dT.createMaterial({name:e.name,category:e.category,map:p.map,normalMap:p.normalMap});const b=rg.createAtmosphereMaterial(e.name);if(b){const w=((A=Qv[e.name])==null?void 0:A.radiusScale)||1.012,M=new qn(w,48,36);u=new lt(M,b),u.name=`${e.name.toLowerCase()}_atmosphere`,u.renderOrder=3,u.scale.set(r,r,r),i.add(u)}}const P=new lt(h,v);if(P.name=`surface_${e.name}`,P.castShadow=e.category!=="star",P.receiveShadow=e.category!=="star",P.scale.set(r,r*l,r),i.add(P),e.name==="Saturn"){const M=new Tf(1.32,2.65,128,8),D=M.attributes.position,V=M.attributes.uv;for(let Z=0;Z<D.count;Z++){const Y=D.getX(Z),te=D.getY(Z),$=(Math.sqrt(Y*Y+te*te)-1.32)/(2.65-1.32);V.setXY(Z,$,.5)}V.needsUpdate=!0;const z=p.ringAlphaMap||p.map,X=new vt({uniforms:{ringMap:{value:z},saturnCenter:{value:new R},saturnRadius:{value:r}},vertexShader:`
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
        `,side:wn,transparent:!0,depthWrite:!1});g=new lt(M,X),g.name="saturn_rings",g.rotation.x=Math.PI*.5,g.renderOrder=3,g.scale.set(r,r,r),i.add(g)}let T;if(s>0){const b=[];for(let V=0;V<=128;V++){const z=V/128*Math.PI*2;b.push(new R(Math.cos(z)*s,0,Math.sin(z)*s))}const M=new ct().setFromPoints(b),D=new Di({color:new me(e.physical.colorHex||"#555566"),transparent:!0,opacity:.22});T=new ar(M,D),T.name=`orbit_line_${e.name}`,n.add(T)}return{definition:e,pivot:n,bodyGroup:i,surfaceMesh:P,nightMesh:y,cloudMesh:m,atmosphereMesh:u,ringMesh:g,glowMeshes:_.length>0?_:void 0,prominencesGroup:x,orbitLine:T,visualRadius:r,orbitalDistance:s}}}const og={Sun:{targetCoverageY:.85,ndcOffsetX:-.28,ndcOffsetY:0,fov:42,preferredElevation:Math.PI*.35},Mercury:{targetCoverageY:.92,ndcOffsetX:-.34,ndcOffsetY:0,fov:40,preferredElevation:Math.PI*.38},Venus:{targetCoverageY:.92,ndcOffsetX:-.34,ndcOffsetY:0,fov:40,preferredElevation:Math.PI*.38},Earth:{targetCoverageY:.94,ndcOffsetX:-.35,ndcOffsetY:0,fov:40,preferredElevation:Math.PI*.37},Mars:{targetCoverageY:.92,ndcOffsetX:-.34,ndcOffsetY:0,fov:40,preferredElevation:Math.PI*.38},Jupiter:{targetCoverageY:1.08,ndcOffsetX:-.38,ndcOffsetY:0,fov:41,preferredElevation:Math.PI*.39},Saturn:{targetCoverageY:.88,ndcOffsetX:-.28,ndcOffsetY:0,fov:41,effectiveRadiusMultiplier:1.95,preferredElevation:Math.PI*.32},Uranus:{targetCoverageY:.92,ndcOffsetX:-.34,ndcOffsetY:0,fov:40,preferredElevation:Math.PI*.38},Neptune:{targetCoverageY:.92,ndcOffsetX:-.34,ndcOffsetY:0,fov:40,preferredElevation:Math.PI*.38},Pluto:{targetCoverageY:.9,ndcOffsetX:-.32,ndcOffsetY:0,fov:39,preferredElevation:Math.PI*.38}},Cu={targetCoverageY:.92,ndcOffsetX:-.34,ndcOffsetY:0,fov:40,preferredElevation:Math.PI*.38},fT={targetCoverageY:.88,ndcOffsetX:-.33,ndcOffsetY:0,fov:39,preferredElevation:Math.PI*.38},Vo=class Vo{constructor(e){j(this,"camera");j(this,"subjectAnchor",new R(0,0,0));j(this,"orbitPivot",new R(0,0,0));j(this,"aimPoint",new R(0,0,0));j(this,"currentNdcOffset",new He(-.34,0));j(this,"targetNdcOffset",new He(-.34,0));j(this,"shotMode","cinematic_observation");j(this,"effectiveAnchor",new R(0,0,0));j(this,"currentVelocity",new R(0,0,0));j(this,"lastCameraPos",new R(0,0,0));j(this,"lastRadius",680);j(this,"zoomRate",0);j(this,"lastUpdateTime",performance.now());j(this,"spherical",new wo(680,Math.PI*.3,Math.PI*.25));j(this,"targetSpherical",new wo(680,Math.PI*.3,Math.PI*.25));j(this,"panOffset",new R(0,0,0));j(this,"targetPanOffset",new R(0,0,0));j(this,"focusedObject",null);j(this,"focusDistance",30);j(this,"focusedRadius",2.8);j(this,"transition",null);j(this,"isOrbiting",!1);j(this,"isPanning",!1);j(this,"previousMousePosition",{x:0,y:0});j(this,"lastInteractionTime",performance.now());j(this,"activeTouches",new Map);j(this,"initialPinchDist",0);j(this,"initialRadiusOnPinch",0);j(this,"enableIdleDrift",!0);j(this,"damping",.12);j(this,"domElement");j(this,"onMouseDown",e=>{if(this.lastInteractionTime=performance.now(),this.transition){this.transition=null;const n=new R().subVectors(this.camera.position,this.orbitPivot);this.spherical.setFromVector3(n),this.targetSpherical.copy(this.spherical)}e.button===0?e.shiftKey?this.isPanning=!0:this.isOrbiting=!0:e.button===2&&(this.isPanning=!0),this.previousMousePosition={x:e.clientX,y:e.clientY}});j(this,"onMouseUp",()=>{this.isOrbiting=!1,this.isPanning=!1,this.lastInteractionTime=performance.now()});j(this,"onMouseMove",e=>{if(this.lastInteractionTime=performance.now(),!this.isOrbiting&&!this.isPanning)return;const n=e.clientX-this.previousMousePosition.x,i=e.clientY-this.previousMousePosition.y;if(this.previousMousePosition={x:e.clientX,y:e.clientY},this.isOrbiting)this.targetSpherical.theta-=n*.005,this.targetSpherical.phi-=i*.005,this.targetSpherical.phi=Math.max(.02,Math.min(Math.PI-.02,this.targetSpherical.phi));else if(this.isPanning){const r=this.spherical.radius*.001,s=new R,o=new R;this.camera.matrixWorld.extractBasis(s,o,new R),this.targetPanOffset.addScaledVector(s,-n*r),this.targetPanOffset.addScaledVector(o,i*r)}});j(this,"onWheel",e=>{if(e.preventDefault(),this.lastInteractionTime=performance.now(),this.transition){this.transition=null;const s=new R().subVectors(this.camera.position,this.orbitPivot);this.spherical.setFromVector3(s),this.targetSpherical.copy(this.spherical)}const n=Math.pow(.92,e.deltaY*.012),i=this.focusedObject?this.focusedRadius*1.15:.35,r=18e4;this.targetSpherical.radius=Math.max(i,Math.min(r,this.targetSpherical.radius*n))});j(this,"onContextMenu",e=>{e.preventDefault()});j(this,"onTouchStart",e=>{if(this.lastInteractionTime=performance.now(),this.transition){this.transition=null;const n=new R().subVectors(this.camera.position,this.orbitPivot);this.spherical.setFromVector3(n),this.targetSpherical.copy(this.spherical)}for(let n=0;n<e.changedTouches.length;n++){const i=e.changedTouches[n];this.activeTouches.set(i.identifier,{x:i.clientX,y:i.clientY})}if(this.activeTouches.size===2){const n=Array.from(this.activeTouches.values());this.initialPinchDist=Math.hypot(n[0].x-n[1].x,n[0].y-n[1].y),this.initialRadiusOnPinch=this.targetSpherical.radius}});j(this,"onTouchMove",e=>{if(this.lastInteractionTime=performance.now(),this.activeTouches.size===1&&e.touches.length===1){const n=e.touches[0],i=this.activeTouches.get(n.identifier);if(i){const r=n.clientX-i.x,s=n.clientY-i.y;this.targetSpherical.theta-=r*.006,this.targetSpherical.phi-=s*.006,this.targetSpherical.phi=Math.max(.02,Math.min(Math.PI-.02,this.targetSpherical.phi)),this.activeTouches.set(n.identifier,{x:n.clientX,y:n.clientY})}}else if(this.activeTouches.size>=2&&e.touches.length>=2){const n=[e.touches[0],e.touches[1]],i=Math.hypot(n[0].clientX-n[1].clientX,n[0].clientY-n[1].clientY);if(this.initialPinchDist>0){const r=this.initialPinchDist/i,s=this.focusedObject?this.focusedRadius*1.15:.35;this.targetSpherical.radius=Math.max(s,Math.min(18e4,this.initialRadiusOnPinch*r))}}});j(this,"onTouchEnd",e=>{this.lastInteractionTime=performance.now();for(let n=0;n<e.changedTouches.length;n++)this.activeTouches.delete(e.changedTouches[n].identifier);this.activeTouches.size<2&&(this.initialPinchDist=0)});this.domElement=e,this.camera=new Sn(45,e.clientWidth/e.clientHeight,.05,16e4),this.updateCameraPosition(),this.setupEventListeners(e)}static calculateViewingDistance(e,n,i=n.fov){const r=e*(n.effectiveRadiusMultiplier||1),s=Pt.degToRad(i*.5),o=Math.tan(s),a=Math.max(.1,n.targetCoverageY),l=r/(a*o);return Math.max(r*1.15,l)}getResponsiveNdcOffset(e,n,i){let r=e,s=n;if(i>=1.5)r=e,s=n;else if(i>=1){const o=(i-1)/.5;r=e*(.45+.55*o),s=n}else r=e*.15,s=-.1;return{x:r,y:s}}calculateAimPoint(e,n,i,r,s,o){if(Math.abs(i)<.001&&Math.abs(r)<.001)return n.clone();const a=new R().subVectors(n,e),l=a.length();if(l<.001)return n.clone();const c=a.clone().divideScalar(l),d=new R(0,1,0);let h=new R().crossVectors(c,d);h.lengthSq()<1e-4&&(h=new R().crossVectors(c,new R(0,0,1))),h.normalize();const f=new R().crossVectors(h,c).normalize(),p=this.getResponsiveNdcOffset(i,r,o),v=Pt.degToRad(s*.5),y=Math.tan(v),m=o*y,u=p.x*l*m,g=p.y*l*y;return new R().copy(n).addScaledVector(h,-u).addScaledVector(f,-g)}updateCameraPosition(){if(this.transition){const l=performance.now()-this.transition.startTime,c=Math.min(1,l/this.transition.durationMs),d=c<.5?16*Math.pow(c,5):1-Math.pow(-2*c+2,5)/2;this.transition.targetObject?(this.transition.targetObject.updateWorldMatrix(!0,!1),this.transition.targetObject.getWorldPosition(this.subjectAnchor)):this.subjectAnchor.set(0,0,0),this.camera.fov=Pt.lerp(this.transition.startFov,this.transition.targetFov,d),this.currentNdcOffset.x=Pt.lerp(this.transition.startNdcOffsetX,this.transition.targetNdcOffsetX,d),this.currentNdcOffset.y=Pt.lerp(this.transition.startNdcOffsetY,this.transition.targetNdcOffsetY,d);const h=Pt.lerp(this.spherical.theta,this.transition.targetTheta,d),f=Pt.lerp(this.spherical.phi,this.transition.targetPhi,d),p=Pt.lerp(this.spherical.radius,this.transition.targetDistance,d);this.orbitPivot.lerpVectors(this.transition.startPivot,this.subjectAnchor,d);const v=new R().setFromSphericalCoords(p,f,h);this.camera.position.copy(this.orbitPivot).add(v),this.aimPoint=this.calculateAimPoint(this.camera.position,this.orbitPivot,this.currentNdcOffset.x,this.currentNdcOffset.y,this.camera.fov,this.camera.aspect),this.camera.lookAt(this.aimPoint);const y=Math.max(.05,p-this.focusedRadius);this.camera.near=Math.max(.04,y*.08),this.camera.far=Math.max(16e4,p*30),this.camera.updateProjectionMatrix(),c>=1&&(this.transition.onComplete&&this.transition.onComplete(),this.spherical.set(p,f,h),this.targetSpherical.copy(this.spherical),this.panOffset.set(0,0,0),this.targetPanOffset.set(0,0,0),this.transition=null);return}let e=this.subjectAnchor;if(this.focusedObject){this.focusedObject.updateWorldMatrix(!0,!1),this.focusedObject.getWorldPosition(this.subjectAnchor);const a=this.spherical.radius;if(a>320){const l=Math.min(1,(a-320)/480);this.effectiveAnchor.lerpVectors(this.subjectAnchor,Vo.ORIGIN_VEC,l),e=this.effectiveAnchor}else e=this.subjectAnchor}else this.subjectAnchor.set(0,0,0),e=this.subjectAnchor;this.currentNdcOffset.x+=(this.targetNdcOffset.x-this.currentNdcOffset.x)*this.damping,this.currentNdcOffset.y+=(this.targetNdcOffset.y-this.currentNdcOffset.y)*this.damping,this.panOffset.lerp(this.targetPanOffset,this.damping),this.orbitPivot.copy(e).add(this.panOffset),this.enableIdleDrift&&!this.isOrbiting&&!this.isPanning&&this.shotMode==="cinematic_observation"&&performance.now()-this.lastInteractionTime>3e3&&(this.targetSpherical.theta+=8e-5),this.spherical.theta+=(this.targetSpherical.theta-this.spherical.theta)*this.damping,this.spherical.phi+=(this.targetSpherical.phi-this.spherical.phi)*this.damping,this.spherical.radius+=(this.targetSpherical.radius-this.spherical.radius)*this.damping,this.spherical.phi=Math.max(.02,Math.min(Math.PI-.02,this.spherical.phi));const n=new R().setFromSpherical(this.spherical);this.camera.position.copy(this.orbitPivot).add(n),this.aimPoint=this.calculateAimPoint(this.camera.position,this.orbitPivot,this.currentNdcOffset.x,this.currentNdcOffset.y,this.camera.fov,this.camera.aspect),this.camera.lookAt(this.aimPoint);const i=this.spherical.radius,r=Math.max(.05,i-this.focusedRadius);this.camera.near=Math.max(.04,Math.min(30,r*.08)),this.camera.far=Math.max(25e4,i*35),this.camera.updateProjectionMatrix();const s=performance.now(),o=Math.max(.001,(s-this.lastUpdateTime)*.001);this.currentVelocity.subVectors(this.camera.position,this.lastCameraPos).divideScalar(o),this.lastRadius>.001&&(this.zoomRate=(Math.log(this.spherical.radius)-Math.log(this.lastRadius))/o),this.lastCameraPos.copy(this.camera.position),this.lastRadius=this.spherical.radius,this.lastUpdateTime=s}update(){this.updateCameraPosition()}get lookAtTarget(){return this.aimPoint}focusCinematic(e,n,i="",r=1800,s){this.focusedObject=e,this.focusedRadius=n,this.shotMode="cinematic_observation",typeof window<"u"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches&&(r=150),e.updateWorldMatrix(!0,!1);const o=new R;e.getWorldPosition(o);const a=og[i]||(n<1?fT:Cu);this.targetNdcOffset.set(a.ndcOffsetX,a.ndcOffsetY);const l=Vo.calculateViewingDistance(n,a,a.fov);this.focusDistance=l;const c=new R().copy(o).negate(),d=c.lengthSq()<1||i==="Sun";d?c.set(0,0,1):c.normalize();const h=new R(-c.z,0,c.x).normalize(),f=new R(0,1,0);let p;d?p=new R(0,.4,1).normalize().multiplyScalar(l):i==="Saturn"?p=new R().copy(c).multiplyScalar(-.35).addScaledVector(h,.65).addScaledVector(f,.58).normalize().multiplyScalar(l):p=new R().copy(c).multiplyScalar(.48).addScaledVector(h,.72).addScaledVector(f,.36).normalize().multiplyScalar(l);const v=new wo().setFromVector3(p);v.phi=Math.max(.04,Math.min(Math.PI-.04,v.phi)),this.targetPanOffset.set(0,0,0),this.panOffset.set(0,0,0),this.transition={startPos:this.camera.position.clone(),startAimPoint:this.aimPoint.clone(),startFov:this.camera.fov,startNdcOffsetX:this.currentNdcOffset.x,startNdcOffsetY:this.currentNdcOffset.y,startPivot:this.orbitPivot.clone(),startSpherical:this.spherical.clone(),targetObject:e,targetRadius:n,targetBodyName:i,targetShotMode:"cinematic_observation",targetFov:a.fov,targetNdcOffsetX:a.ndcOffsetX,targetNdcOffsetY:a.ndcOffsetY,targetDistance:l,targetTheta:v.theta,targetPhi:v.phi,startTime:performance.now(),durationMs:r,onComplete:()=>{this.spherical.copy(v),this.targetSpherical.copy(v),this.camera.fov=a.fov,this.currentNdcOffset.set(a.ndcOffsetX,a.ndcOffsetY),s&&s()}}}focusOn(e,n,i=1800){this.focusCinematic(e,n,e.name,i)}resetToOverview(e=1600){this.focusedObject=null,this.focusedRadius=48,this.shotMode="deep_space_overview",this.targetPanOffset.set(0,0,0),this.panOffset.set(0,0,0),this.targetNdcOffset.set(0,0),typeof window<"u"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches&&(e=150);const n=new wo(680,Math.PI*.3,Math.PI*.25);this.transition={startPos:this.camera.position.clone(),startAimPoint:this.aimPoint.clone(),startFov:this.camera.fov,startNdcOffsetX:this.currentNdcOffset.x,startNdcOffsetY:this.currentNdcOffset.y,startPivot:this.orbitPivot.clone(),startSpherical:this.spherical.clone(),targetObject:null,targetRadius:48,targetBodyName:"Overview",targetShotMode:"deep_space_overview",targetFov:45,targetNdcOffsetX:0,targetNdcOffsetY:0,targetDistance:680,targetTheta:n.theta,targetPhi:n.phi,startTime:performance.now(),durationMs:e,onComplete:()=>{this.spherical.copy(n),this.targetSpherical.copy(n),this.subjectAnchor.set(0,0,0),this.orbitPivot.set(0,0,0),this.camera.fov=45,this.currentNdcOffset.set(0,0)}}}transitionToDistance(e,n=45,i="deep_space_overview",r=1600,s){typeof window<"u"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches&&(r=150);const o=this.targetSpherical.theta,a=s!==void 0?s:Math.max(.08,Math.min(Math.PI*.45,this.targetSpherical.phi)),l=new wo(e,a,o);this.shotMode=i,this.targetPanOffset.set(0,0,0);const c=i==="cinematic_observation"?-.34:0,d=0;this.transition={startPos:this.camera.position.clone(),startAimPoint:this.aimPoint.clone(),startFov:this.camera.fov,startNdcOffsetX:this.currentNdcOffset.x,startNdcOffsetY:this.currentNdcOffset.y,startPivot:this.orbitPivot.clone(),startSpherical:this.spherical.clone(),targetObject:e<350?this.focusedObject:null,targetRadius:this.focusedRadius,targetBodyName:this.focusedObject?this.focusedObject.name:"Cosmos",targetShotMode:i,targetFov:n,targetNdcOffsetX:c,targetNdcOffsetY:d,targetDistance:e,targetTheta:l.theta,targetPhi:l.phi,startTime:performance.now(),durationMs:r,onComplete:()=>{this.spherical.copy(l),this.targetSpherical.copy(l),e>=350&&(this.subjectAnchor.set(0,0,0),this.orbitPivot.set(0,0,0)),this.camera.fov=n,this.currentNdcOffset.set(c,d),this.targetNdcOffset.set(c,d)}}}jumpToScale(e,n=1800){let i=680,r="scientific_overview",s=45,o;switch(e){case"planetary":i=this.focusedRadius>0?this.focusedRadius*2.8:12,r="cinematic_observation",s=40;break;case"inner_system":i=180,r="scientific_overview",s=45,o=Math.PI*.32;break;case"outer_system":i=1100,r="deep_space_overview",s=46,o=Math.PI*.28;break;case"interstellar":i=8200,r="deep_space_overview",s=48,o=Math.PI*.26;break;case"galactic":i=52e3,r="deep_space_overview",s=48,o=Math.PI*.24;break}this.transitionToDistance(i,s,r,n,o)}getVelocity(){return this.currentVelocity}getZoomVelocity(){return this.zoomRate}getTravelSpeed(){return this.currentVelocity.length()}getObserverScaleMetric(){const e=this.spherical.radius;if(e<30){const i=Math.round(e*4200);return{distance:e,formatted:`${i.toLocaleString()} KM`,domain:"planetary"}}if(e<380){const i=(e/28).toFixed(2);return{distance:e,formatted:`${i} AU`,domain:"inner_system"}}if(e<3500){const i=(e/28).toFixed(1);return{distance:e,formatted:`${i} AU`,domain:"outer_system"}}if(e<25e3){const i=(e/380).toFixed(2);return{distance:e,formatted:`${i} LY`,domain:"interstellar"}}const n=(e/6200).toFixed(1);return{distance:e,formatted:`${n} KPC`,domain:"galactic"}}toggleFramingOffset(){if(Math.abs(this.targetNdcOffset.x)>.05)return this.targetNdcOffset.set(0,0),this.shotMode="free_inspection",!1;{const e=this.focusedObject&&og[this.focusedObject.name]||Cu;return this.targetNdcOffset.set(e.ndcOffsetX,e.ndcOffsetY),this.shotMode="cinematic_observation",!0}}setupEventListeners(e){this.domElement=e,e&&e.addEventListener&&(e.addEventListener("mousedown",this.onMouseDown),e.addEventListener("wheel",this.onWheel,{passive:!1}),e.addEventListener("contextmenu",this.onContextMenu),e.addEventListener("touchstart",this.onTouchStart,{passive:!0})),typeof window<"u"&&(window.addEventListener("mouseup",this.onMouseUp),window.addEventListener("mousemove",this.onMouseMove),window.addEventListener("touchmove",this.onTouchMove,{passive:!0}),window.addEventListener("touchend",this.onTouchEnd,{passive:!0}))}handleResize(e,n){this.camera.aspect=e/n,this.camera.updateProjectionMatrix()}dispose(){this.domElement&&this.domElement.removeEventListener&&(this.domElement.removeEventListener("mousedown",this.onMouseDown),this.domElement.removeEventListener("wheel",this.onWheel),this.domElement.removeEventListener("contextmenu",this.onContextMenu),this.domElement.removeEventListener("touchstart",this.onTouchStart)),typeof window<"u"&&(window.removeEventListener("mouseup",this.onMouseUp),window.removeEventListener("mousemove",this.onMouseMove),window.removeEventListener("touchmove",this.onTouchMove),window.removeEventListener("touchend",this.onTouchEnd))}};j(Vo,"ORIGIN_VEC",new R(0,0,0));let uh=Vo;const Pr=class Pr{constructor(e=Date.now()){j(this,"currentUtcMs");j(this,"lastPerfTimeMs");j(this,"isPaused",!1);j(this,"timeMultiplier",1);this.currentUtcMs=e,this.lastPerfTimeMs=performance.now()}update(e=performance.now()){const n=e-this.lastPerfTimeMs;if(this.lastPerfTimeMs=e,!this.isPaused&&n>0){const i=n*this.timeMultiplier;this.currentUtcMs+=i}return this.currentUtcMs}getUtcMs(){return this.currentUtcMs}setUtcMs(e){this.currentUtcMs=e,this.lastPerfTimeMs=performance.now()}getIsoString(){return new Date(this.currentUtcMs).toISOString()}getJulianDate(){return Pr.utcMsToJulianDate(this.currentUtcMs)}getJulianCenturiesJ2000(){return(this.getJulianDate()-Pr.J2000_JD)/36525}static utcMsToJulianDate(e){return e/864e5+24405875e-1}static julianDateToUtcMs(e){return(e-24405875e-1)*864e5}resetToJ2000(){this.setUtcMs(Pr.J2000_UTC_MS)}resetToNow(){this.setUtcMs(Date.now())}};j(Pr,"J2000_JD",2451545),j(Pr,"J2000_UTC_MS",946728e6);let tc=Pr;const Go=class Go{static solveKepler(e,n,i=1e-12,r=25){const s=Math.PI*2;e=(e%s+s)%s,e>Math.PI&&(e-=s);let o;if(n<.18)o=e+n*Math.sin(e);else{const a=e<0?-1:1;o=e+a*.85*n}for(let a=0;a<r;a++){const l=o-n*Math.sin(o)-e;if(Math.abs(l)<i)return o;const c=1-n*Math.cos(o);if(Math.abs(c)<1e-15)break;const d=l/c;if(o-=d,Math.abs(d)<i)return o}return o}static propagate(e,n,i=Go.GM_SUN){const r=e.semiMajorAxisKm,s=e.eccentricity;if(r<=0)return{positionKm:[0,0,0],velocityKmPerSec:[0,0,0],trueAnomalyDeg:0,eccentricAnomalyDeg:0,distanceKm:0,speedKmPerSec:0};const o=Math.sqrt(i/(r*r*r)),a=n*86400,c=e.meanAnomalyAtEpochDeg*Math.PI/180+o*a,d=Go.solveKepler(c,s),h=Math.sin(d),f=Math.cos(d),p=Math.sqrt(1-s*s)*h/(1-s*f),v=(f-s)/(1-s*f),y=Math.atan2(p,v),m=r*(1-s*f),u=r*(f-s),g=r*Math.sqrt(1-s*s)*h,x=Math.sqrt(i*r)/m,_=-x*h,P=x*Math.sqrt(1-s*s)*f,T=e.inclinationDeg*Math.PI/180,A=e.argumentPeriapsisDeg*Math.PI/180,b=e.longitudeAscendingNodeDeg*Math.PI/180,w=Math.cos(b),M=Math.sin(b),D=Math.cos(T),V=Math.sin(T),z=Math.cos(A),X=Math.sin(A),Z=w*z-M*X*D,Y=M*z+w*X*D,te=X*V,N=-w*X-M*z*D,$=-M*X+w*z*D,Q=z*V,oe=u*Z+g*N,_e=u*Y+g*$,Ve=u*te+g*Q,K=_*Z+P*N,ne=_*Y+P*$,ce=_*te+P*Q,ae=Math.sqrt(K*K+ne*ne+ce*ce);return{positionKm:[oe,_e,Ve],velocityKmPerSec:[K,ne,ce],trueAnomalyDeg:(y*180/Math.PI+360)%360,eccentricAnomalyDeg:(d*180/Math.PI+360)%360,distanceKm:m,speedKmPerSec:ae}}static sampleOrbitPath(e,n=128){const i=[],r=e.semiMajorAxisKm,s=e.eccentricity;if(r<=0)return i;const o=e.inclinationDeg*Math.PI/180,a=e.argumentPeriapsisDeg*Math.PI/180,l=e.longitudeAscendingNodeDeg*Math.PI/180,c=Math.cos(l),d=Math.sin(l),h=Math.cos(o),f=Math.sin(o),p=Math.cos(a),v=Math.sin(a),y=c*p-d*v*h,m=d*p+c*v*h,u=v*f,g=-c*v-d*p*h,x=-d*v+c*p*h,_=p*f,P=r*Math.sqrt(Math.max(0,1-s*s));for(let T=0;T<=n;T++){const A=T/n*Math.PI*2,b=r*(Math.cos(A)-s),w=P*Math.sin(A),M=b*y+w*g,D=b*m+w*x,V=b*u+w*_;i.push([M,D,V])}return i}};j(Go,"GM_SUN",1327124400419394e-4);let Fr=Go;const Wi=class Wi{static eclipticToIcrf(e){const[n,i,r]=e,s=Math.cos(Wi.OBLIQUITY_J2000_RAD),o=Math.sin(Wi.OBLIQUITY_J2000_RAD);return[n,i*s-r*o,i*o+r*s]}static icrfToEcliptic(e){const[n,i,r]=e,s=Math.cos(Wi.OBLIQUITY_J2000_RAD),o=Math.sin(Wi.OBLIQUITY_J2000_RAD);return[n,i*s+r*o,-i*o+r*s]}static eclipticToThree(e){return[e[0],e[2],-e[1]]}static threeToEcliptic(e){return[e[0],-e[2],e[1]]}};j(Wi,"OBLIQUITY_J2000_DEG",23.43929111),j(Wi,"OBLIQUITY_J2000_RAD",23.43929111*Math.PI/180);let Cs=Wi;const ji=class ji{constructor(){j(this,"mode","exploration")}toRenderPosition(e,n){if(this.mode==="scientific"){const d=1/ji.SCIENTIFIC_KM_PER_UNIT,h=[e[0]*d,e[1]*d,e[2]*d];return Cs.eclipticToThree(h)}const i=Math.sqrt(e[0]*e[0]+e[1]*e[1]+e[2]*e[2]);if(i<1e3||!n||n.orderFromSun===0)return[0,0,0];const r=i/ji.AU_KM,s=50+Math.pow(r,.58)*65,o=e[0]/i,a=e[1]/i,l=e[2]/i,c=[o*s,a*s,l*s];return Cs.eclipticToThree(c)}toMoonRenderPosition(e,n,i,r){if(this.mode==="scientific"){const f=1/ji.SCIENTIFIC_KM_PER_UNIT,p=[e[0]*f,e[1]*f,e[2]*f],v=Cs.eclipticToThree(p);return[i[0]+v[0],i[1]+v[1],i[2]+v[2]]}const s=Math.sqrt(e[0]*e[0]+e[1]*e[1]+e[2]*e[2]);if(s<1)return i;const o=e[0]/s,a=e[1]/s,l=e[2]/s,c=Cs.eclipticToThree([o,a,l]),h=this.getVisualRadius(r)*(1.35+1.25*Math.log10(1+s/4e4));return[i[0]+c[0]*h,i[1]+c[1]*h,i[2]+c[2]*h]}getVisualRadius(e){if(this.mode==="scientific"){const n=e.physical.meanRadiusKm/ji.SCIENTIFIC_KM_PER_UNIT;return Math.max(.015,n*4)}if(e.category==="star")return 48;switch(e.name){case"Jupiter":return 26.9;case"Saturn":return 22.68;case"Uranus":return 9.62;case"Neptune":return 9.32;case"Earth":return 2.4;case"Venus":return 2.28;case"Mars":return 1.28;case"Mercury":return .92;case"Pluto":return .45}if(e.category==="moon"){const n=e.physical.meanRadiusKm;return n<100?.18:n<500?.32:n<1200?.48:n<2e3?.65:.95}if(e.category==="dwarf_planet")return .45;if(e.category==="asteroid"){const n=e.physical.meanRadiusKm;return n<10?.18:n<100?.25:.38}return Math.max(.18,e.physical.meanRadiusKm/6371*2.4)}};j(ji,"SCIENTIFIC_KM_PER_UNIT",1e6),j(ji,"AU_KM",1495978707e-1);let ua=ji;class ag{static createOrbitLine(e,n,i=180){if(e.orderFromSun===0||e.orbit.semiMajorAxisKm<=0)return null;const s=Fr.sampleOrbitPath(e.orbit,i).map(c=>{const d=n.toRenderPosition(c,e);return new R(d[0],d[1],d[2])}),o=new ct().setFromPoints(s),a=new Di({color:new me(e.physical.colorHex||"#555566"),transparent:!0,opacity:e.category==="planet"?.3:.18,linewidth:1}),l=new ar(o,a);return l.name=`kepler_orbit_${e.name}`,l}static createMoonOrbitLine(e,n,i,r=96){if(e.orbit.semiMajorAxisKm<=0)return null;const o=Fr.sampleOrbitPath(e.orbit,r).map(d=>{const h=i.toMoonRenderPosition(d,e,[0,0,0],n);return new R(h[0],h[1],h[2])}),a=new ct().setFromPoints(o),l=new Di({color:new me(e.physical.colorHex||"#778899"),transparent:!0,opacity:.2,linewidth:1}),c=new ar(a,l);return c.name=`kepler_moon_orbit_${e.name}`,c}}const pT={radius:28e3,coreRadius:4800,sunDistance:15600};class mT{constructor(e=pT){j(this,"group",new on);j(this,"masterDiskMesh");j(this,"coreBulgeMesh");j(this,"dustExtinctionMesh");j(this,"starPoints");j(this,"satelliteGroup",new on);j(this,"sunBeaconGroup",new on);j(this,"sunReticleMesh");j(this,"sunPulseMesh");j(this,"sunRadarRing");j(this,"opacityUniform",{value:0});j(this,"timeUniform",{value:0});j(this,"config");j(this,"sunWorldPosition",new R);this.config=e,this.group.name="milky_way_external_galaxy",this.group.position.set(0,0,0),this.group.rotation.x=Pt.degToRad(62.87),this.group.rotation.y=Pt.degToRad(122.93),this.group.rotation.z=Pt.degToRad(282.25),this.masterDiskMesh=this.createMasterDisk(),this.group.add(this.masterDiskMesh),this.coreBulgeMesh=this.createVolumetricCore(),this.group.add(this.coreBulgeMesh),this.dustExtinctionMesh=this.createDustExtinction(),this.group.add(this.dustExtinctionMesh),this.starPoints=this.create3DStars(),this.group.add(this.starPoints),this.buildSatelliteGalaxies(),this.group.add(this.satelliteGroup);const{beaconGroup:n,reticleMesh:i,pulseMesh:r,radarRing:s,sunPos:o}=this.createSunBeacon();this.sunBeaconGroup=n,this.sunReticleMesh=i,this.sunPulseMesh=r,this.sunRadarRing=s,this.sunWorldPosition.copy(o),this.group.add(this.sunBeaconGroup),this.setOpacity(0)}createMasterDisk(){const e=new jr(this.config.radius*2,this.config.radius*2,64,64);e.rotateX(-Math.PI*.5);const n=$s.getInstance().getMilkyWayDiskTexture();n.wrapS=Qe,n.wrapT=Qe,n.generateMipmaps=!0,n.minFilter=$n,n.magFilter=fn;const i=new vt({uniforms:{uGalaxyMap:{value:n},uOpacity:this.opacityUniform,uTime:this.timeUniform},vertexShader:`
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

          vec3 rgb = tex.rgb * 1.25 * depthFactor * twinkle;
          float alpha = clamp(tex.a * 1.10, 0.0, 1.0) * uOpacity;

          gl_FragColor = vec4(rgb, alpha);
        }
      `,transparent:!0,side:wn,depthWrite:!1,blending:sr}),r=new lt(e,i);return r.name="milky_way_master_disk",r.renderOrder=-8,r}createVolumetricCore(){const e=new qn(this.config.coreRadius,32,24);e.scale(1,.42,.82);const n=new vt({uniforms:{uOpacity:this.opacityUniform,uTime:this.timeUniform},vertexShader:`
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

          float alpha = (nucleus * 0.50 + halo * 0.22) * uOpacity;
          gl_FragColor = vec4(rgb * 1.05, alpha);
        }
      `,transparent:!0,blending:Jt,depthWrite:!1,side:Lt}),i=new lt(e,n);return i.name="galactic_volumetric_core",i.renderOrder=-7,i}createDustExtinction(){const e=new jr(this.config.radius*1.85,this.config.radius*1.85,48,48);e.rotateX(-Math.PI*.5);const n=$s.getInstance().getMilkyWayDiskTexture(),i=new vt({uniforms:{uGalaxyMap:{value:n},uOpacity:this.opacityUniform},vertexShader:`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,fragmentShader:`
        uniform sampler2D uGalaxyMap;
        uniform float uOpacity;
        varying vec2 vUv;

        void main() {
          vec4 tex = texture2D(uGalaxyMap, vUv);
          // Detect dark dust lanes: high red/amber relative to blue with moderate luminance
          float dustMask = clamp((tex.r * 1.1 - tex.b) * 1.8, 0.0, 1.0) * (1.0 - tex.b * 0.6);
          float alpha = dustMask * 0.38 * uOpacity;
          if (alpha < 0.01) discard;

          // Deep interstellar coal-dust absorption tone
          gl_FragColor = vec4(0.04, 0.02, 0.012, alpha);
        }
      `,transparent:!0,side:wn,depthWrite:!1,blending:sr}),r=new lt(e,i);return r.name="galactic_dust_extinction_sheet",r.position.y=80,r.renderOrder=-6,r}create3DStars(){const n=new Float32Array(42e3),i=new Float32Array(14e3*3),r=new Float32Array(14e3),s=this.config.radius,o=this.config.coreRadius;let a=0;const l=4e3;for(let v=0;v<l;v++){const y=Math.random(),m=Math.pow(y,1.6)*o,u=Math.random()*Math.PI*2,g=(Math.random()-.5)*Math.PI,x=m*Math.cos(u)*Math.cos(g)*1.15,_=m*Math.sin(u)*Math.cos(g)*.85,P=m*Math.sin(g)*.42;n[a*3]=x,n[a*3+1]=P,n[a*3+2]=_,Math.random()<.6?(i[a*3]=1,i[a*3+1]=.85,i[a*3+2]=.6):(i[a*3]=.98,i[a*3+1]=.7,i[a*3+2]=.4),r[a]=1+Math.random()*1.5,a++}const c=8e3;for(let v=0;v<c;v++){const y=Math.random(),m=o*.8+Math.pow(y,1.1)*(s*.9-o*.8),u=Math.random()*Math.PI*2,g=550+m/s*450,x=(Math.random()-.5+(Math.random()-.5))*g,_=Math.cos(u)*m,P=Math.sin(u)*m;n[a*3]=_,n[a*3+1]=x,n[a*3+2]=P;const T=Math.random();T<.28?(i[a*3]=.75,i[a*3+1]=.88,i[a*3+2]=1,r[a]=1.4+Math.random()*1.8):T<.38?(i[a*3]=1,i[a*3+1]=.52,i[a*3+2]=.78,r[a]=1.6+Math.random()*1.6):T<.72?(i[a*3]=.98,i[a*3+1]=.96,i[a*3+2]=.92,r[a]=.9+Math.random()*1.2):(i[a*3]=1,i[a*3+1]=.82,i[a*3+2]=.52,r[a]=1+Math.random()*1.4),a++}const d=2e3;for(let v=0;v<d;v++){const y=Math.random(),m=Math.pow(y,1.4)*(s*1.35),u=Math.random()*Math.PI*2,g=(Math.random()-.5)*Math.PI;n[a*3]=m*Math.cos(u)*Math.cos(g),n[a*3+1]=m*Math.sin(g)*.7,n[a*3+2]=m*Math.sin(u)*Math.cos(g),i[a*3]=.92,i[a*3+1]=.9,i[a*3+2]=.95,r[a]=.8+Math.random()*1,a++}const h=new ct;h.setAttribute("position",new Je(n,3)),h.setAttribute("color",new Je(i,3)),h.setAttribute("size",new Je(r,1));const f=new vt({uniforms:{uOpacity:this.opacityUniform,uTime:this.timeUniform},vertexShader:`
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
      `,vertexColors:!0,transparent:!0,blending:Jt,depthWrite:!1}),p=new Ir(h,f);return p.name="galactic_3d_stars",p.renderOrder=-5,p}buildSatelliteGalaxies(){const e=this.createDwarfGalaxy("large_magellanic_cloud",new R(-9500,-13500,11800),3600,new me(13822207),450);this.satelliteGroup.add(e);const n=this.createDwarfGalaxy("small_magellanic_cloud",new R(-14800,-18200,7800),2100,new me(14741247),220);this.satelliteGroup.add(n);const i=this.createDwarfGalaxy("sagittarius_dwarf_spheroidal",new R(-1600,-6200,3200),2400,new me(16770756),280);this.satelliteGroup.add(i)}createDwarfGalaxy(e,n,i,r,s){const o=new on;o.name=e,o.position.copy(n);const a=new qn(i,24,16);a.scale(1.25,.55,.95);const l=new vt({uniforms:{uOpacity:this.opacityUniform,uColor:{value:r}},vertexShader:`
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
      `,transparent:!0,blending:Jt,depthWrite:!1,side:Lt}),c=new lt(a,l);c.renderOrder=-9,o.add(c);const d=new ct,h=new Float32Array(s*3);for(let v=0;v<s;v++){const y=Math.random(),m=Math.pow(y,1.8)*i,u=Math.random()*Math.PI*2,g=(Math.random()-.5)*Math.PI;h[v*3]=m*Math.cos(u)*Math.cos(g)*1.25,h[v*3+1]=m*Math.sin(g)*.55,h[v*3+2]=m*Math.sin(u)*Math.cos(g)}d.setAttribute("position",new Je(h,3));const f=new Sf({color:r,size:1.2,transparent:!0,opacity:.55,blending:Jt,depthWrite:!1}),p=new Ir(d,f);return o.add(p),o}createSunBeacon(){const e=new on;e.name="sun_orion_spur_beacon";const n=this.config.sunDistance,i=Pt.degToRad(215),r=55,s=new R(Math.cos(i)*n,r,Math.sin(i)*n);e.position.copy(s);const o=new ct,a=64,l=[],c=450;for(let A=0;A<=a;A++){const b=A/a*Math.PI*2;l.push(new R(Math.cos(b)*c,0,Math.sin(b)*c))}o.setFromPoints(l);const d=new Di({color:16766720,transparent:!0,opacity:.9}),h=new ar(o,d);e.add(h);const f=new ct,p=[],v=750;for(let A=0;A<=a;A++){const b=A/a*Math.PI*2;p.push(new R(Math.cos(b)*v,0,Math.sin(b)*v))}f.setFromPoints(p);const y=new Zm({color:16771704,dashSize:40,gapSize:25,transparent:!0,opacity:.65}),m=new ar(f,y);m.computeLineDistances(),e.add(m);const u=new qn(180,16,12),g=new xf({color:16771976,transparent:!0,opacity:.95,blending:Jt}),x=new lt(u,g);e.add(x);const _=new ct().setFromPoints([new R(0,-r,0),new R(0,0,0)]),P=new Zm({color:16769138,dashSize:22,gapSize:15,transparent:!0,opacity:.55}),T=new ar(_,P);return T.computeLineDistances(),e.add(T),{beaconGroup:e,reticleMesh:h,pulseMesh:x,radarRing:m,sunPos:s}}setOpacity(e){const n=Math.max(0,Math.min(1,e));this.opacityUniform.value=n,this.group.visible=n>.005,this.sunReticleMesh&&(this.sunReticleMesh.material.opacity=n*.9),this.sunRadarRing&&(this.sunRadarRing.material.opacity=n*.65),this.sunPulseMesh&&(this.sunPulseMesh.material.opacity=n*.95)}update(e){if(this.timeUniform.value=e,this.sunPulseMesh&&this.group.visible){const n=1+.22*Math.sin(e*3.5);this.sunPulseMesh.scale.set(n,n,n)}this.sunReticleMesh&&this.group.visible&&(this.sunReticleMesh.rotation.y=e*.35),this.sunRadarRing&&this.group.visible&&(this.sunRadarRing.rotation.y=-e*.22)}dispose(){this.masterDiskMesh.geometry.dispose(),this.masterDiskMesh.material.dispose(),this.coreBulgeMesh.geometry.dispose(),this.coreBulgeMesh.material.dispose(),this.dustExtinctionMesh.geometry.dispose(),this.dustExtinctionMesh.material.dispose(),this.starPoints.geometry.dispose(),this.starPoints.material.dispose(),this.sunReticleMesh.geometry.dispose(),this.sunReticleMesh.material.dispose(),this.sunRadarRing.geometry.dispose(),this.sunRadarRing.material.dispose(),this.sunPulseMesh.geometry.dispose(),this.sunPulseMesh.material.dispose(),this.satelliteGroup.traverse(e=>{(e instanceof lt||e instanceof Ir)&&(e.geometry.dispose(),Array.isArray(e.material)?e.material.forEach(n=>n.dispose()):e.material.dispose())})}}class gT{constructor(){j(this,"mesh");j(this,"count",700);j(this,"positions");j(this,"colors");j(this,"relativePositions");j(this,"radius",110);j(this,"currentSpeed",0);this.positions=new Float32Array(this.count*2*3),this.colors=new Float32Array(this.count*2*3),this.relativePositions=new Float32Array(this.count*3);for(let i=0;i<this.count;i++){const r=Math.random(),s=(.2+.8*Math.cbrt(r))*this.radius,o=Math.random()*Math.PI*2,a=Math.acos(2*Math.random()-1);this.relativePositions[i*3]=s*Math.sin(a)*Math.cos(o),this.relativePositions[i*3+1]=s*Math.sin(a)*Math.sin(o),this.relativePositions[i*3+2]=s*Math.cos(a)}const e=new ct;e.setAttribute("position",new Je(this.positions,3)),e.setAttribute("color",new Je(this.colors,3));const n=new Di({vertexColors:!0,transparent:!0,blending:Jt,depthWrite:!1});this.mesh=new Mf(e,n),this.mesh.name="velocity_travel_particles",this.mesh.frustumCulled=!1}update(e,n,i,r){const s=n.length(),o=s+Math.abs(i)*45;this.currentSpeed+=(o-this.currentSpeed)*Math.min(1,r*8);const a=this.currentSpeed>.8,l=Math.min(28,this.currentSpeed*.16+Math.abs(i)*14),c=Math.min(.85,Math.max(.08,(this.currentSpeed-.5)*.08));let d=0,h=0,f=-1;s>.01?(d=-n.x/s,h=-n.y/s,f=-n.z/s):Math.abs(i)>.01&&(f=i>0?1:-1);const p=this.mesh.geometry.attributes.position,v=this.mesh.geometry.attributes.color,y=this.radius*2,m=this.radius;for(let u=0;u<this.count;u++){const g=u*3,x=u*6,_=u*6+3;a&&(this.relativePositions[g]+=d*this.currentSpeed*r*.5,this.relativePositions[g+1]+=h*this.currentSpeed*r*.5,this.relativePositions[g+2]+=f*this.currentSpeed*r*.5);for(let M=0;M<3;M++)this.relativePositions[g+M]>m?this.relativePositions[g+M]-=y:this.relativePositions[g+M]<-m&&(this.relativePositions[g+M]+=y);const P=e.x+this.relativePositions[g],T=e.y+this.relativePositions[g+1],A=e.z+this.relativePositions[g+2];this.positions[x]=P,this.positions[x+1]=T,this.positions[x+2]=A,l>.4?(this.positions[_]=P+d*l,this.positions[_+1]=T+h*l,this.positions[_+2]=A+f*l):(this.positions[_]=P+.05,this.positions[_+1]=T+.05,this.positions[_+2]=A+.05);const b=c*1.2,w=c*.15;this.colors[x]=.88*b,this.colors[x+1]=.92*b,this.colors[x+2]=1*b,this.colors[_]=.65*w,this.colors[_+1]=.8*w,this.colors[_+2]=.95*w}p.needsUpdate=!0,v.needsUpdate=!0}dispose(){this.mesh.geometry.dispose(),this.mesh.material.dispose()}}const vT=[[54061,53910],[53910,58001],[58001,59774],[59774,54061],[59774,62956],[62956,65378],[65378,67301],[27989,25336],[27989,27366],[25336,24436],[27366,24436],[25930,26311],[26311,26727],[26727,27989],[25930,25336],[746,3179],[3179,2920],[2920,6686],[6686,8886],[60718,61084],[62434,61932],[102098,100453],[100453,95947],[102488,100453],[100453,97165],[49669,50583],[50583,50335],[50335,48455],[50583,54872],[54872,57632],[57632,49669],[80763,78820],[78820,78401],[80763,82396],[82396,86228],[86228,85927],[32349,30324],[32349,33579],[33579,34444],[34444,35904]];class xT{constructor(){j(this,"mesh");j(this,"meteors",[]);j(this,"positions");j(this,"colors");j(this,"count",5);this.positions=new Float32Array(this.count*2*3),this.colors=new Float32Array(this.count*2*3);for(let i=0;i<this.count;i++)this.meteors.push({active:!1,startPos:new R,dir:new R,speed:380+Math.random()*260,length:28+Math.random()*24,progress:0,cooldown:2+Math.random()*8,color:new me(Math.random()>.35?14348543:16771266)});const e=new ct;e.setAttribute("position",new Je(this.positions,3)),e.setAttribute("color",new Je(this.colors,3));const n=new Di({vertexColors:!0,transparent:!0,blending:Jt,depthWrite:!1});this.mesh=new Mf(e,n),this.mesh.name="meteor_streaks",this.mesh.renderOrder=-1}update(e,n){const i=this.mesh.geometry.getAttribute("position"),r=this.mesh.geometry.getAttribute("color");for(let s=0;s<this.count;s++){const o=this.meteors[s],a=s*6,l=s*6+3;if(!o.active)if(o.cooldown-=e,o.cooldown<=0){o.active=!0,o.progress=0,o.speed=360+Math.random()*320,o.length=26+Math.random()*26;const g=Math.random()*Math.PI*2,x=(Math.random()-.5)*180,_=160+Math.random()*240;o.startPos.set(n.x+Math.cos(g)*_,n.y+x,n.z+Math.sin(g)*_);const P=g+Math.PI*.5+(Math.random()-.5)*1.2;o.dir.set(Math.cos(P),(Math.random()-.5)*.45,Math.sin(P)).normalize()}else{this.positions[a]=0,this.positions[a+1]=0,this.positions[a+2]=0,this.positions[l]=0,this.positions[l+1]=0,this.positions[l+2]=0,this.colors[a]=0,this.colors[a+1]=0,this.colors[a+2]=0,this.colors[l]=0,this.colors[l+1]=0,this.colors[l+2]=0;continue}if(o.progress+=o.speed*e/260,o.progress>=1){o.active=!1,o.cooldown=4+Math.random()*9,this.positions[a]=0,this.positions[a+1]=0,this.positions[a+2]=0,this.positions[l]=0,this.positions[l+1]=0,this.positions[l+2]=0,this.colors[a]=0,this.colors[a+1]=0,this.colors[a+2]=0,this.colors[l]=0,this.colors[l+1]=0,this.colors[l+2]=0;continue}const c=o.progress*260,d=o.startPos.x+o.dir.x*c,h=o.startPos.y+o.dir.y*c,f=o.startPos.z+o.dir.z*c,p=Math.max(0,c-o.length),v=o.startPos.x+o.dir.x*p,y=o.startPos.y+o.dir.y*p,m=o.startPos.z+o.dir.z*p;this.positions[a]=d,this.positions[a+1]=h,this.positions[a+2]=f,this.positions[l]=v,this.positions[l+1]=y,this.positions[l+2]=m;const u=Math.sin(o.progress*Math.PI)*.95;this.colors[a]=o.color.r*u*1.6,this.colors[a+1]=o.color.g*u*1.6,this.colors[a+2]=o.color.b*u*1.6,this.colors[l]=o.color.r*u*.12,this.colors[l+1]=o.color.g*u*.12,this.colors[l+2]=o.color.b*u*.12}i.needsUpdate=!0,r.needsUpdate=!0}dispose(){this.mesh.geometry.dispose(),this.mesh.material.dispose()}}const Rr=class Rr{constructor(){j(this,"group",new on);j(this,"celestialGroup",new on);j(this,"pointsMesh");j(this,"localInterstellarStars");j(this,"constellationLines");j(this,"milkyWayMesh");j(this,"milkyWayOpacityUniform",{value:1});j(this,"stardustMesh");j(this,"meteorSystem");j(this,"externalGalaxy");j(this,"travelParticles");j(this,"isLoaded",!1);this.group.name="starfield_hipparcos",this.group.add(this.celestialGroup),this.celestialGroup.name="celestial_infinite_sphere",this.buildMilkyWayBackground(),this.build3DCosmicStardust(),this.meteorSystem=new xT,this.group.add(this.meteorSystem.mesh),this.externalGalaxy=new mT;const e=this.externalGalaxy.sunWorldPosition.clone().applyEuler(this.externalGalaxy.group.rotation);this.externalGalaxy.group.position.copy(e).negate(),this.group.add(this.externalGalaxy.group),this.travelParticles=new gT,this.group.add(this.travelParticles.mesh),this.loadCatalog()}buildMilkyWayBackground(){const e=new qn(Rr.SPHERE_RADIUS*1.05,64,48),n=$s.getInstance().getMilkyWayTexture(),i=new vt({uniforms:{milkyWayMap:{value:n},uOpacity:this.milkyWayOpacityUniform},vertexShader:`
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
      `,side:Lt,transparent:!0,depthWrite:!1});this.milkyWayMesh=new lt(e,i),this.milkyWayMesh.name="milky_way_skybox",this.milkyWayMesh.renderOrder=-10,this.milkyWayMesh.rotation.x=Pt.degToRad(62.87),this.milkyWayMesh.rotation.y=Pt.degToRad(122.93),this.milkyWayMesh.rotation.z=Pt.degToRad(282.25),this.celestialGroup.add(this.milkyWayMesh)}build3DCosmicStardust(){const n=new Float32Array(2400),i=new Float32Array(800*3),r=new Float32Array(800),s=new Float32Array(800);for(let l=0;l<800;l++){const c=30+Math.pow(Math.random(),.7)*750,d=Math.random()*Math.PI*2,h=(Math.random()-.5)*(90+c*.1);n[l*3]=Math.cos(d)*c,n[l*3+1]=h,n[l*3+2]=Math.sin(d)*c;const f=Math.random();f<.5?(i[l*3]=.9,i[l*3+1]=.92,i[l*3+2]=.98):f<.8?(i[l*3]=.98,i[l*3+1]=.85,i[l*3+2]=.6):(i[l*3]=.65,i[l*3+1]=.85,i[l*3+2]=.98),r[l]=1+Math.random()*1.5,s[l]=Math.random()*Math.PI*2}const o=new ct;o.setAttribute("position",new Je(n,3)),o.setAttribute("color",new Je(i,3)),o.setAttribute("aScale",new Je(r,1)),o.setAttribute("aPhase",new Je(s,1));const a=new vt({uniforms:{time:{value:0}},vertexShader:`
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
      `,vertexColors:!0,transparent:!0,blending:Jt,depthWrite:!1});this.stardustMesh=new Ir(o,a),this.stardustMesh.name="cosmic_stardust_motes",this.stardustMesh.renderOrder=-2,this.group.add(this.stardustMesh)}async loadCatalog(){try{const e="/solaris/".replace(/\/?$/,"/"),n=await fetch(`${e}data/stars.json`);if(!n.ok)throw new Error(`Failed to fetch stars.json: HTTP ${n.status}`);const i=await n.json();this.buildStarfieldMesh(i),this.buildConstellations(i),this.isLoaded=!0}catch(e){console.warn("Could not stream Hipparcos stars dataset, using procedural fallback:",e),this.buildProceduralFallback()}}buildStarfieldMesh(e){const n=e.stars.filter(p=>p[4]<=4.6),i=n.length,r=new Float32Array(i*3),s=new Float32Array(i*3),o=new Float32Array(i),a=Rr.SPHERE_RADIUS;for(let p=0;p<i;p++){const v=n[p],y=v[1],m=v[2],u=v[3],g=v[4],x=v[5];r[p*3]=y*a,r[p*3+1]=u*a,r[p*3+2]=-m*a;const _=this.bvToRGB(x,v[8]);s[p*3]=_.r,s[p*3+1]=_.g,s[p*3+2]=_.b;const P=Math.max(.6,2.8-.42*g);o[p]=P}const l=new ct;l.setAttribute("position",new Je(r,3)),l.setAttribute("color",new Je(s,3)),l.setAttribute("size",new Je(o,1));const c=`
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
    `,d=`
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
    `,h=new vt({vertexShader:c,fragmentShader:d,vertexColors:!0,transparent:!0,blending:Jt,depthWrite:!1});this.pointsMesh=new Ir(l,h),this.pointsMesh.renderOrder=0,this.celestialGroup.add(this.pointsMesh);const f=e.stars.filter(p=>p[6]!==null&&p[6]>0&&p[6]<120);if(f.length>0){const p=new Float32Array(f.length*3),v=new Float32Array(f.length*3),y=new Float32Array(f.length);for(let g=0;g<f.length;g++){const x=f[g],_=Math.max(12,x[6]*38);p[g*3]=x[1]*_,p[g*3+1]=x[3]*_,p[g*3+2]=-x[2]*_;const P=this.bvToRGB(x[5],x[8]);v[g*3]=P.r,v[g*3+1]=P.g,v[g*3+2]=P.b;const T=x[4];y[g]=Math.max(.8,2.6-.3*T)}const m=new ct;m.setAttribute("position",new Je(p,3)),m.setAttribute("color",new Je(v,3)),m.setAttribute("size",new Je(y,1));const u=new vt({vertexShader:`
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
        `,fragmentShader:d,vertexColors:!0,transparent:!0,blending:Jt,depthWrite:!1});this.localInterstellarStars=new Ir(m,u),this.localInterstellarStars.name="local_interstellar_3d_stars",this.localInterstellarStars.renderOrder=1,this.group.add(this.localInterstellarStars)}}buildConstellations(e){const n=new Map,i=Rr.SPHERE_RADIUS*.998;for(const a of e.stars){const l=a[0],c=a[1]*i,d=a[3]*i,h=-a[2]*i;n.set(l,[c,d,h])}const r=[];for(const[a,l]of vT){const c=n.get(a),d=n.get(l);c&&d&&(r.push(c[0],c[1],c[2]),r.push(d[0],d[1],d[2]))}if(r.length===0)return;const s=new ct;s.setAttribute("position",new It(r,3));const o=new Di({color:5231045,transparent:!0,opacity:.38,depthWrite:!1,blending:Jt});this.constellationLines=new Mf(s,o),this.constellationLines.name="constellation_lines",this.celestialGroup.add(this.constellationLines)}bvToRGB(e,n){if(e!==null)return e<-.1?new me(10335487):e<.15?new me(12374783):e<.35?new me(15791359):e<.6?new me(16775144):e<.85?new me(16770723):e<1.3?new me(16760437):new me(16747093);switch(n){case"O":return new me(10335487);case"B":return new me(12374783);case"A":return new me(15791359);case"F":return new me(16775144);case"G":return new me(16770723);case"K":return new me(16760437);case"M":return new me(16747093);default:return new me(16777215)}}buildProceduralFallback(){const n=new ct,i=new Float32Array(6e3*3),r=new Float32Array(6e3*3),s=Rr.SPHERE_RADIUS;for(let a=0;a<6e3;a++){const l=Math.random()*Math.PI*2,c=Math.acos(Math.random()*2-1);i[a*3]=s*Math.sin(c)*Math.cos(l),i[a*3+1]=s*Math.cos(c),i[a*3+2]=s*Math.sin(c)*Math.sin(l),r[a*3]=.9,r[a*3+1]=.92,r[a*3+2]=1}n.setAttribute("position",new Je(i,3)),n.setAttribute("color",new Je(r,3));const o=new Sf({size:2.5,vertexColors:!0,transparent:!0,opacity:.85});this.pointsMesh=new Ir(n,o),this.celestialGroup.add(this.pointsMesh)}update(e,n,i,r){var l;this.celestialGroup.position.copy(e);const s=e.length(),o=Pt.clamp((s-3500)/18500,0,1),a=o*o*(3-2*o);if(this.externalGalaxy.setOpacity(a),this.milkyWayOpacityUniform.value=1-a,this.externalGalaxy.update(performance.now()*.001),this.travelParticles.update(e,i||new R,r||0,n),this.stardustMesh){const c=this.stardustMesh.material;(l=c.uniforms)!=null&&l.time&&(c.uniforms.time.value+=n)}this.meteorSystem&&s<3200&&this.meteorSystem.update(n,e)}setConstellationsVisible(e){this.constellationLines&&(this.constellationLines.visible=e)}toggleConstellations(){return this.constellationLines?(this.constellationLines.visible=!this.constellationLines.visible,this.constellationLines.visible):!1}areConstellationsVisible(){var e;return((e=this.constellationLines)==null?void 0:e.visible)??!0}dispose(){this.externalGalaxy.dispose(),this.travelParticles.dispose(),this.localInterstellarStars&&(this.localInterstellarStars.geometry.dispose(),this.localInterstellarStars.material.dispose()),this.milkyWayMesh&&(this.milkyWayMesh.geometry.dispose(),this.milkyWayMesh.material.dispose()),this.pointsMesh&&(this.pointsMesh.geometry.dispose(),this.pointsMesh.material.dispose()),this.constellationLines&&(this.constellationLines.geometry.dispose(),this.constellationLines.material.dispose()),this.stardustMesh&&(this.stardustMesh.geometry.dispose(),this.stardustMesh.material.dispose()),this.meteorSystem&&this.meteorSystem.dispose()}};j(Rr,"SPHERE_RADIUS",8500);let dh=Rr;function _T(t=19890825){let e=t>>>0;return function(){let n=e+=1831565813;return n=Math.imul(n^n>>>15,n|1),n^=n+Math.imul(n^n>>>7,n|61),((n^n>>>14)>>>0)/4294967296}}class yT{constructor(e,n=19890825){j(this,"mesh");j(this,"count",3200);j(this,"elements",[]);j(this,"dummy",new Wt);j(this,"transform");j(this,"seed");this.transform=e,this.seed=n;const i=new Ef(.35,1),r=i.attributes.position;for(let o=0;o<r.count;o++){const a=r.getX(o),l=r.getY(o),c=r.getZ(o),d=1+.22*Math.sin(a*5)*Math.cos(l*5+c*3);r.setXYZ(o,a*d,l*d,c*d)}i.computeVertexNormals();const s=new J2({roughness:.88,metalness:.12,vertexColors:!0});this.mesh=new Q2(i,s,this.count),this.mesh.name="asteroid_belt_instanced",this.mesh.castShadow=!1,this.mesh.receiveShadow=!1,this.generateElements(),this.updatePositions(0)}generateElements(){const e=_T(this.seed),n=[{au:2.5,width:.045},{au:2.82,width:.04},{au:2.96,width:.035},{au:3.27,width:.05}],i=[];let r=0;for(;r<this.count;){const s=2.12+e()*1.16;let o=!1;for(const u of n)if(Math.abs(s-u.au)<u.width&&e()<.88){o=!0;break}if(o)continue;const a=.03+e()*.19,l=e()*e()*18,c=Pt.degToRad(l),d=e()*Math.PI*2,h=e()*Math.PI*2,f=e()*Math.PI*2,p=Math.pow(s,1.5)*365.25,v=Math.PI*2/p,y=.45+e()*.9;this.elements.push({semiMajorAxisAU:s,eccentricity:a,inclinationRad:c,longNodeRad:d,argPeriRad:h,meanAnomalyEpochRad:f,meanMotionRadPerDay:v,scale:y});const m=e();if(m<.7){const u=.28+e()*.18;i.push(new me(u*.95,u*.92,u*.88))}else if(m<.9){const u=.45+e()*.22;i.push(new me(u*1.05,u*.95,u*.8))}else{const u=.55+e()*.25;i.push(new me(u,u*.95,u*.9))}r++}for(let s=0;s<i.length;s++)this.mesh.setColorAt(s,i[s]);this.mesh.instanceColor&&(this.mesh.instanceColor.needsUpdate=!0)}updatePositions(e){const n=this.transform.mode==="scientific";for(let i=0;i<this.elements.length;i++){const r=this.elements[i],s=(r.meanAnomalyEpochRad+r.meanMotionRadPerDay*e)%(Math.PI*2),o=s+2*r.eccentricity*Math.sin(s),a=r.semiMajorAxisAU*(1-r.eccentricity*r.eccentricity)/(1+r.eccentricity*Math.cos(o)),l=o+r.argPeriRad,c=Math.cos(l),d=Math.sin(l),h=Math.cos(r.longNodeRad),f=Math.sin(r.longNodeRad),p=Math.cos(r.inclinationRad),v=Math.sin(r.inclinationRad),y=a,m=y*(h*c-f*d*p),u=y*(f*c+h*d*p),g=y*(d*v);let x,_,P;if(n){const A=ua.AU_KM/ua.SCIENTIFIC_KM_PER_UNIT;x=m*A,_=g*A,P=-u*A}else{const A=30+Math.sqrt(a)*65,b=Math.sqrt(m*m+u*u+g*g);x=m/b*A,_=g/b*A,P=-(u/b)*A}this.dummy.position.set(x,_,P);const T=r.scale*(n?.15:1);this.dummy.scale.set(T,T,T),this.dummy.rotation.set(s*2,s*3.5,s*1.5),this.dummy.updateMatrix(),this.mesh.setMatrixAt(i,this.dummy.matrix)}this.mesh.instanceMatrix.needsUpdate=!0}setVisible(e){this.mesh.visible=e}isVisible(){return this.mesh.visible}dispose(){this.mesh.geometry.dispose(),this.mesh.material.dispose()}}class MT{constructor(e,n){j(this,"container");j(this,"renderer");j(this,"scene");j(this,"cameraRig");j(this,"clock",new tc);j(this,"transform",new ua);j(this,"planetBundles",new Map);j(this,"orbitLinesGroup",new on);j(this,"moonOrbitLines",new Map);j(this,"latestPhysicalStates",new Map);j(this,"starfield");j(this,"asteroidBelt");j(this,"raycaster",new lT);j(this,"mouse",new He);j(this,"isRunning",!0);j(this,"animationFrameId",null);j(this,"lastFrameTime",performance.now());j(this,"selectedBody");j(this,"onTelemetryUpdate");j(this,"telemetryThrottleCounter",0);j(this,"pointerDownPos",{x:0,y:0});j(this,"onPointerDown",e=>{this.pointerDownPos={x:e.clientX,y:e.clientY}});j(this,"onCanvasClick",e=>{if(e.target!==this.renderer.domElement||Math.hypot(e.clientX-this.pointerDownPos.x,e.clientY-this.pointerDownPos.y)>6)return;const i=this.renderer.domElement.getBoundingClientRect();this.mouse.x=(e.clientX-i.left)/i.width*2-1,this.mouse.y=-((e.clientY-i.top)/i.height)*2+1,this.raycaster.setFromCamera(this.mouse,this.cameraRig.camera);const r=[];this.planetBundles.forEach(o=>{r.push(o.surfaceMesh)});const s=this.raycaster.intersectObjects(r,!1);if(s.length>0){const o=s[0].object;for(const a of this.planetBundles.values())if(a.surfaceMesh===o){this.selectBody(a.definition.name);break}}});j(this,"onResize",()=>{if(!this.container)return;const e=this.container.clientWidth||window.innerWidth,n=this.container.clientHeight||window.innerHeight;this.renderer.setSize(e,n),this.cameraRig.handleResize(e,n)});j(this,"animate",()=>{var o,a,l;if(!this.isRunning)return;this.animationFrameId=requestAnimationFrame(this.animate);const e=performance.now(),n=Math.min(Math.max((e-this.lastFrameTime)*.001,.001),.1);this.lastFrameTime=e,this.clock.update(e);const r=this.clock.getJulianDate()-tc.J2000_JD;this.propagateAll(r);const s=this.planetBundles.get("Sun");if(s){const c=e*.001,d=s.surfaceMesh.material;if((o=d.uniforms)!=null&&o.time&&(d.uniforms.time.value=c),s.glowMeshes)for(const h of s.glowMeshes){const f=h.material;(a=f.uniforms)!=null&&a.time&&(f.uniforms.time.value=c)}if(s.prominencesGroup){for(const h of s.prominencesGroup.children)if(h instanceof lt){const f=h.material;(l=f.uniforms)!=null&&l.time&&(f.uniforms.time.value=c)}}}this.cameraRig.update(),this.starfield.update(this.cameraRig.camera.position,n,this.cameraRig.getVelocity(),this.cameraRig.getZoomVelocity()),this.renderer.render(this.scene,this.cameraRig.camera),this.telemetryThrottleCounter++,this.telemetryThrottleCounter%3===0&&this.onTelemetryUpdate&&this.dispatchTelemetry()});this.container=e,this.onTelemetryUpdate=n,this.selectedBody=yn.getBody("Mercury")||yn.getAllBodies()[0],this.scene=new q2,this.scene.background=new me(131333),this.renderer=new Y2({antialias:!0,powerPreference:"high-performance"});const i=e.clientWidth||window.innerWidth,r=e.clientHeight||window.innerHeight;this.renderer.setSize(i,r),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.outputColorSpace=Vt,this.renderer.toneMapping=wv,this.renderer.toneMappingExposure=1.05,this.renderer.domElement.style.position="absolute",this.renderer.domElement.style.top="0",this.renderer.domElement.style.left="0",this.renderer.domElement.style.width="100%",this.renderer.domElement.style.height="100%",this.renderer.domElement.style.display="block",e.appendChild(this.renderer.domElement),this.cameraRig=new uh(e),this.setupLighting(),this.starfield=new dh,this.scene.add(this.starfield.group),this.asteroidBelt=new yT(this.transform),this.scene.add(this.asteroidBelt.mesh),this.orbitLinesGroup.visible=!1,this.scene.add(this.orbitLinesGroup),this.setupBodies(),this.rebuildOrbitLines(),this.propagateAll(0),this.scene.updateMatrixWorld(!0),this.selectBody("Mercury",1800),this.setupInteraction(),this.animate()}setupLighting(){const e=new oT(16775917,2.4,0,0);e.position.set(0,0,0),e.castShadow=!1,this.scene.add(e);const n=new aT(2238008,.25);this.scene.add(n)}setupBodies(){const e=yn.getAllBodies();for(const n of e){const i=hT.createPlanet(n);this.scene.add(i.bodyGroup),this.planetBundles.set(n.name,i)}}rebuildOrbitLines(){for(;this.orbitLinesGroup.children.length>0;){const n=this.orbitLinesGroup.children[0];this.orbitLinesGroup.remove(n),n instanceof ar&&(n.geometry.dispose(),n.material.dispose())}this.moonOrbitLines.clear();const e=yn.getAllBodies();for(const n of e)if(n.category!=="moon"&&n.orderFromSun>0){const i=ag.createOrbitLine(n,this.transform);i&&this.orbitLinesGroup.add(i)}for(const n of e)if(n.category==="moon"&&n.parentId){const i=yn.getParent(n);if(i){const r=ag.createMoonOrbitLine(n,i,this.transform);r&&(this.orbitLinesGroup.add(r),this.moonOrbitLines.set(n.name,r))}}}setScaleMode(e){this.transform.mode!==e&&(this.transform.mode=e,this.planetBundles.forEach(n=>{const i=this.transform.getVisualRadius(n.definition);n.visualRadius=i;const s=1-(n.definition.physical.flattening||0);if(n.surfaceMesh.scale.set(i,i*s,i),n.nightMesh&&n.nightMesh.scale.set(i,i*s,i),n.cloudMesh&&n.cloudMesh.scale.set(i,i,i),n.atmosphereMesh&&n.atmosphereMesh.scale.set(i,i,i),n.ringMesh){n.ringMesh.scale.set(i,i,i);const o=n.ringMesh.material;o.uniforms&&o.uniforms.saturnRadius&&(o.uniforms.saturnRadius.value=i)}n.glowMeshes&&n.glowMeshes.forEach(o=>o.scale.set(i,i,i))}),this.rebuildOrbitLines())}toggleConstellations(){return this.starfield.toggleConstellations()}toggleAsteroidBelt(){const e=!this.asteroidBelt.isVisible();return this.asteroidBelt.setVisible(e),e}toggleOrbits(){return this.orbitLinesGroup.visible=!this.orbitLinesGroup.visible,this.orbitLinesGroup.visible}setupInteraction(){this.renderer.domElement.addEventListener("mousedown",this.onPointerDown),this.renderer.domElement.addEventListener("click",this.onCanvasClick),window.addEventListener("resize",this.onResize)}selectBody(e,n=1800){const i=this.planetBundles.get(e);i&&(this.selectedBody=i.definition,this.cameraRig.focusCinematic(i.bodyGroup,i.visualRadius,i.definition.name,n))}resetView(){this.selectedBody=yn.getBody("Sun")||yn.getAllBodies()[0],this.cameraRig.resetToOverview()}propagateAll(e){const n=yn.getAllBodies(),i=new Map;for(const r of n){if(r.category==="moon")continue;const s=this.planetBundles.get(r.name);if(!s)continue;if(r.orderFromSun===0){s.bodyGroup.position.set(0,0,0),i.set(r.id,[0,0,0]);const d=e*24/609.12*Math.PI*2;s.surfaceMesh.rotation.y=d;continue}const o=Fr.propagate(r.orbit,e);this.latestPhysicalStates.set(r.name,o);const a=this.transform.toRenderPosition(o.positionKm,r);s.bodyGroup.position.set(a[0],a[1],a[2]),i.set(r.id,a);const l=r.physical.rotationPeriodHours||24,c=e*24/l*Math.PI*2;if(s.surfaceMesh.rotation.y=c,s.nightMesh&&(s.nightMesh.rotation.y=c),s.cloudMesh&&(s.cloudMesh.rotation.y=c*1.05),r.name==="Saturn"&&s.ringMesh){const d=s.ringMesh.material;d.uniforms&&d.uniforms.saturnCenter&&(d.uniforms.saturnCenter.value.set(a[0],a[1],a[2]),d.uniforms.saturnRadius.value=s.visualRadius)}}for(const r of n){if(r.category!=="moon"||!r.parentId)continue;const s=this.planetBundles.get(r.name);if(!s)continue;const o=yn.getParent(r);if(!o)continue;const a=this.latestPhysicalStates.get(o.name),l=i.get(o.id)||[0,0,0],c=o.physical.gmKm3S2??(o.physical.massKg?o.physical.massKg*66743e-24:void 0),d=r.physical.gmKm3S2??(r.physical.massKg?r.physical.massKg*66743e-24:0),h=c!==void 0?c+d:Fr.GM_SUN,f=Fr.propagate(r.orbit,e,h),p=(a==null?void 0:a.positionKm)||[0,0,0],v=(a==null?void 0:a.velocityKmPerSec)||[0,0,0],y=[p[0]+f.positionKm[0],p[1]+f.positionKm[1],p[2]+f.positionKm[2]],m=[v[0]+f.velocityKmPerSec[0],v[1]+f.velocityKmPerSec[1],v[2]+f.velocityKmPerSec[2]];this.latestPhysicalStates.set(r.name,{positionKm:y,velocityKmPerSec:m,distanceKm:Math.hypot(...y),speedKmPerSec:Math.hypot(...m),trueAnomalyDeg:f.trueAnomalyDeg,eccentricAnomalyDeg:f.eccentricAnomalyDeg});const u=this.transform.toMoonRenderPosition(f.positionKm,r,l,o);s.bodyGroup.position.set(u[0],u[1],u[2]);const g=this.moonOrbitLines.get(r.name);g&&g.position.set(l[0],l[1],l[2]);const x=r.physical.rotationPeriodHours||r.orbit.orbitalPeriodDays*24,_=e*24/x*Math.PI*2;s.surfaceMesh.rotation.y=_}this.asteroidBelt.updatePositions(e)}jumpToScale(e){this.cameraRig.jumpToScale(e)}dispatchTelemetry(){const e=this.latestPhysicalStates.get(this.selectedBody.name),n=(e==null?void 0:e.distanceKm)||this.selectedBody.orbit.semiMajorAxisKm,i=(e==null?void 0:e.speedKmPerSec)||0,r=new R;this.cameraRig.camera.getWorldDirection(r);const s=Math.atan2(r.x,r.z)*Pt.RAD2DEG,o=Math.asin(r.y)*Pt.RAD2DEG,a=this.cameraRig.getObserverScaleMetric(),l=this.cameraRig.getTravelSpeed(),c={id:this.selectedBody.id,name:this.selectedBody.name,category:this.selectedBody.category,parentId:this.selectedBody.parentId,parentName:this.selectedBody.parentName,distanceKm:n,apparentSpeedKmS:i,radiusKm:this.selectedBody.physical.meanRadiusKm,orbitalPeriodDays:this.selectedBody.orbit.orbitalPeriodDays,axialTiltDeg:this.selectedBody.physical.axialTiltDeg||0,colorHex:this.selectedBody.physical.colorHex||"#ffffff"};this.onTelemetryUpdate({speedKmS:i,lookAzimuthDeg:Math.round(s),lookElevationDeg:Math.round(o),activeTarget:c,timeScale:this.clock.timeMultiplier,julianDate:this.clock.getJulianDate(),utcIso:this.clock.getIsoString(),scaleMode:this.transform.mode,isPaused:this.clock.isPaused,constellationsVisible:this.starfield.areConstellationsVisible(),asteroidBeltVisible:this.asteroidBelt.isVisible(),orbitsVisible:this.orbitLinesGroup.visible,observerScaleMetric:a.formatted,observerDomain:a.domain,travelSpeed:Math.round(l),cameraDistance:Math.round(a.distance)})}dispose(){this.isRunning=!1,this.animationFrameId!==null&&cancelAnimationFrame(this.animationFrameId),window.removeEventListener("resize",this.onResize),this.renderer.domElement.removeEventListener("mousedown",this.onPointerDown),this.renderer.domElement.removeEventListener("click",this.onCanvasClick),this.cameraRig.dispose(),this.starfield.dispose(),this.asteroidBelt.dispose(),this.planetBundles.forEach(e=>{e.surfaceMesh.geometry.dispose(),e.surfaceMesh.material.dispose(),e.nightMesh&&(e.nightMesh.geometry.dispose(),e.nightMesh.material.dispose()),e.cloudMesh&&(e.cloudMesh.geometry.dispose(),e.cloudMesh.material.dispose()),e.atmosphereMesh&&(e.atmosphereMesh.geometry.dispose(),e.atmosphereMesh.material.dispose()),e.ringMesh&&(e.ringMesh.geometry.dispose(),e.ringMesh.material.dispose()),e.glowMeshes&&e.glowMeshes.forEach(n=>{n.geometry.dispose(),n.material.dispose()}),e.prominencesGroup&&e.prominencesGroup.children.forEach(n=>{n instanceof lt&&(n.geometry.dispose(),n.material.dispose())})}),this.renderer.dispose(),this.renderer.domElement.parentElement&&this.renderer.domElement.parentElement.removeChild(this.renderer.domElement)}}const hh={Mercury:{name:"Mercury",category:"planet",eyebrow:"PLANET",accentColor:"#E8927C",eyebrowColor:"#fabfad",distanceAU:"0.39 AU",textureThumb:"textures/2k_mercury.jpg",monographText:"THE CLOSEST PLANET TO THE SUN. IT CIRCLES THE SUN FASTER THAN ALL THE OTHER PLANETS, WHICH IS WHY ROMANS NAMED IT AFTER THEIR SWIFT-FOOTED MESSENGER GOD.",extendedLore:"Mercury is a world of fierce cosmic extremes. With virtually no atmosphere to trap heat, midday temperatures soar to 430°C (800°F), while the sunless night plummets to -180°C (-290°F). Its massive metallic core occupies roughly 85% of the planet's total radius, suggesting a colossal primordial impact stripped away much of its ancient silicate mantle.",missions:[{name:"Mariner 10",year:"1974–1975",agency:"NASA",role:"First flybys; mapped 45% of surface"},{name:"MESSENGER",year:"2011–2015",agency:"NASA",role:"First orbiter; discovered polar water ice in permanently shadowed craters"},{name:"BepiColombo",year:"2025–2026",agency:"ESA / JAXA",role:"Dual orbiter study of magnetosphere and exosphere"}]},Venus:{name:"Venus",category:"planet",eyebrow:"PLANET",accentColor:"#b45d15",eyebrowColor:"#e58e45",distanceAU:"0.723 AU",textureThumb:"textures/2k_venus_atmosphere.jpg",monographText:"NAMED FOR THE ROMAN GODDESS OF LOVE AND BEAUTY. ENSHROUDED IN DENSE OPAQUE CLOUDS OF SULFURIC ACID, IT SUFFERS A RUNAWAY GREENHOUSE EFFECT WITH SURFACE TEMPERATURES REACHING 465°C.",extendedLore:"Venus is Earth's twin in diameter and mass, but an infernal counterpart in environment. A crushing supercritical carbon dioxide atmosphere exerts 92 times Earth's sea-level pressure. Venus rotates backwards compared to most planets, with the Sun rising in the west, and its day is longer than its orbital year.",missions:[{name:"Venera 7",year:"1970",agency:"Soviet Union",role:"First human spacecraft to softly land and transmit data from another planet"},{name:"Magellan",year:"1990–1994",agency:"NASA",role:"Global radar mapping revealing extensive volcanism and lava channels"},{name:"Akatsuki",year:"2015–Present",agency:"JAXA",role:"Atmospheric super-rotation and cloud dynamics investigation"}]},Earth:{name:"Earth",category:"planet",eyebrow:"PLANET",accentColor:"#26daaa",eyebrowColor:"#7bf0d0",distanceAU:"1.000 AU",textureThumb:"textures/2k_earth_daymap.jpg",monographText:"OUR HOME AND THE ONLY KNOWN SANCTUARY OF LIFE IN THE COSMOS. A VIBRANT BLUE MARBLE ENVELOPED BY A NITROGEN-OXYGEN ATMOSPHERE, WITH LIQUID OCEANS COVERING SEVENTY PERCENT OF ITS CRUST.",extendedLore:"Earth resides at the temperate sweet spot of the circumstellar habitable zone. Dynamic plate tectonics continuously recycle carbon, while a vigorous geodynamo generates a protective magnetosphere shielding the biosphere from solar wind stripping and high-energy galactic cosmic rays.",missions:[{name:"Apollo Program",year:"1961–1972",agency:"NASA",role:"Human lunar landings; transformed humanity's ecological perspective of Earth"},{name:"Terra & Aqua",year:"1999–Present",agency:"NASA",role:"Comprehensive global climate and ocean monitoring system"},{name:"Copernicus Sentinel",year:"2014–Present",agency:"ESA",role:"Constellation observing biosphere, ice sheets, and atmosphere"}]},Mars:{name:"Mars",category:"planet",eyebrow:"PLANET",accentColor:"#e55f45",eyebrowColor:"#fca595",distanceAU:"1.524 AU",textureThumb:"textures/2k_mars.jpg",monographText:"THE RED PLANET, COLORED BY IRON OXIDE SPREAD ACROSS ITS WINDSWEPT DESERTS. HOME TO OLYMPUS MONS, THE TALLEST VOLCANO IN THE SOLAR SYSTEM, AND VAST DRY RIVER VALLEYS.",extendedLore:"Though frozen and desiccated today, geochemical fingerprints captured by rovers prove ancient Mars possessed lakes, river deltas, and a thicker insulating atmosphere over three billion years ago. Its thin CO2 atmosphere generates continent-scale dust storms that periodically veil the entire globe.",missions:[{name:"Viking 1 & 2",year:"1976",agency:"NASA",role:"First successful long-duration Mars surface landers and biological tests"},{name:"Curiosity",year:"2012–Present",agency:"NASA",role:"Discovered ancient habitable lacustrine environments in Gale Crater"},{name:"Perseverance",year:"2021–Present",agency:"NASA",role:"Searching for ancient microbial biosignatures and caching core samples"}]},Jupiter:{name:"Jupiter",category:"planet",eyebrow:"PLANET",accentColor:"#f59e0b",eyebrowColor:"#fcd34d",distanceAU:"5.203 AU",textureThumb:"textures/2k_jupiter.jpg",monographText:"THE TITAN OF OUR SOLAR SYSTEM, WITH MORE MASS THAN ALL OTHER WORLDS COMBINED. A SWIRLING GAS GIANT DOMINATED BY THE CENTURIES-OLD GREAT RED SPOT AND 95 KNOWN SATELLITES.",extendedLore:"Jupiter acted as the primary gravitational architect of the early Solar System, shaping asteroid orbits and scattering comets. Below its dynamic ammonia cloud belts, hydrogen transitions into liquid and eventually into an exotic state of liquid metallic hydrogen that conducts immense electrical currents, powering the most powerful planetary magnetic field in the system.",missions:[{name:"Voyager 1 & 2",year:"1979",agency:"NASA",role:"Discovered Jovian rings and active volcanism on Io"},{name:"Galileo",year:"1995–2003",agency:"NASA",role:"First orbiter; gathered initial evidence of subsurface ocean on Europa"},{name:"Juno",year:"2016–Present",agency:"NASA",role:"Mapping gravitational anomalies and deep atmospheric water abundance"}]},Saturn:{name:"Saturn",category:"planet",eyebrow:"PLANET",accentColor:"#b29d81",eyebrowColor:"#d4c5b0",distanceAU:"9.539 AU",textureThumb:"textures/2k_saturn.jpg",monographText:"A MAJESTIC WORLD ADORNED BY AN EXTRAORDINARY SYSTEM OF ICY RINGS EXTENDING THOUSANDS OF KILOMETERS INTO THE VOID, ACCOMPANIED BY THE HAZE-CLOAKED MOON TITAN.",extendedLore:"Saturn's ring system spans up to 282,000 km in width yet is astonishingly paper-thin—averaging barely 10 to 30 meters in vertical thickness. Composed of 99% pure water ice particles ranging from dust grains to boulder sizes, the rings are sustained and sculpted by subtle gravitational resonances with shepherd moons.",missions:[{name:"Pioneer 11",year:"1979",agency:"NASA",role:"First close encounter with Saturn and discovery of the F Ring"},{name:"Cassini-Huygens",year:"2004–2017",agency:"NASA / ESA / ASI",role:"Thirteen-year orbital odyssey; landed probe on Titan, found Enceladus plumes"},{name:"Dragonfly",year:"Launching 2028",agency:"NASA",role:"Rotorcraft lander to explore prebiotic chemistry on Titan"}]},Uranus:{name:"Uranus",category:"planet",eyebrow:"PLANET",accentColor:"#8dcdd8",eyebrowColor:"#b3e8f0",distanceAU:"19.18 AU",textureThumb:"textures/2k_uranus.jpg",monographText:"AN ICE GIANT TILTED SO DRAMATICALLY ON ITS SIDE THAT ITS ROTATION AXIS POINTS ALMOST DIRECTLY AT THE SUN, DRIVING EXTREME DECADES-LONG SEASONS IN COMPLETE FREEZE.",extendedLore:"With an axial tilt of 97.77°, Uranus literally rolls along its orbital path like a ball. Scientists theorize a sequence of Earth-sized protoplanetary impacts knocked the giant onto its side early in solar history. Its pale aquamarine coloration originates from methane gas in its upper atmosphere absorbing red light wavelengths.",missions:[{name:"Voyager 2",year:"1986",agency:"NASA",role:"Only spacecraft to encounter Uranus; discovered 10 moons and 2 new rings"},{name:"Uranus Orbiter & Probe",year:"Proposed 2030s",agency:"NASA Decadal",role:"Flagship mission concept prioritized to explore ice giant interiors"}]},Neptune:{name:"Neptune",category:"planet",eyebrow:"PLANET",accentColor:"#4f83e2",eyebrowColor:"#7ca8ff",distanceAU:"30.06 AU",textureThumb:"textures/2k_neptune.jpg",monographText:"THE MOST DISTANT MAJOR PLANET, SHROUDED IN AN INTENSE DEEP-AZURE METHANE ATMOSPHERE WHERE SUPERSONIC WINDS SURPASS TWO THOUSAND KILOMETERS PER HOUR.",extendedLore:"Neptune was the first planet located through mathematical prediction rather than empirical observation: slight perturbations in Uranus's orbit allowed French astronomer Urbain Le Verrier to calculate its precise position in 1846. It harbors the retrograde moon Triton, a captured Kuiper Belt dwarf world exhibiting nitrogen cryovolcanoes.",missions:[{name:"Voyager 2",year:"1989",agency:"NASA",role:"Close flyby; detected the Great Dark Spot and geysers on Triton"}]},Pluto:{name:"Pluto",category:"dwarf_planet",eyebrow:"DWARF PLANET",accentColor:"#FF8732",eyebrowColor:"#ffa463",distanceAU:"39.48 AU",textureThumb:"textures/2k_moon.jpg",monographText:"SENTINEL OF THE KUIPER BELT, BEARING THE GLOWING NITROGEN ICE PLAINS OF TOMBAUGH REGIO AND SHARING A SYNCHRONOUS GRAVITATIONAL DANCE WITH ITS COMPANION CHARON.",extendedLore:"Reclassified as a dwarf planet in 2006, Pluto revealed itself during the 2015 New Horizons flyby as a geologically active wonderland. It features convection cells of churned nitrogen-carbon-monoxide ice, water-ice mountains towering 3,500 meters into its thin blue hazy atmosphere, and a likely deep subsurface liquid ocean.",missions:[{name:"New Horizons",year:"2015",agency:"NASA",role:"Historic historic flyby capturing high-resolution imagery of Tombaugh Regio"}]},Moon:{name:"Moon",category:"moon",eyebrow:"NATURAL SATELLITE · EARTH I",accentColor:"#d1d5db",eyebrowColor:"#e5e7eb",distanceAU:"1.000 AU",textureThumb:"textures/2k_moon.jpg",monographText:"EARTH'S CONSTANT CELESTIAL COMPANION, TIDALLY LOCKED IN AN ANCIENT GRAVITATIONAL EMBRACE. ITS HIGHLANDS AND BASALTIC MARIA PRESERVE FOUR BILLION YEARS OF COSMIC HISTORY.",extendedLore:"Formed ~4.5 billion years ago from the debris of a giant collision between the proto-Earth and a Mars-sized protoplanet named Theia. The Moon stabilizes Earth's rotational tilt, modulating climate extremes and generating oceanic tides.",missions:[{name:"Apollo 11",year:"1969",agency:"NASA",role:"First human landing on another celestial world"},{name:"LRO",year:"2009–Present",agency:"NASA",role:"High-resolution sub-meter 3D laser altimetry and mapping"},{name:"Artemis I",year:"2022",agency:"NASA",role:"Uncrewed lunar orbital qualification flight for deep space exploration"}]},Europa:{name:"Europa",category:"moon",eyebrow:"OCEAN MOON · JUPITER II",accentColor:"#7dd3fc",eyebrowColor:"#bae6fd",distanceAU:"5.203 AU",textureThumb:"textures/2k_moon.jpg",monographText:"A SMOOTH CRUST OF WATER ICE FRACTURED BY REDDISH LINEAE, CONCEALING A VAST GLOBAL SALTWATER OCEAN CONTAINING TWICE THE WATER OF ALL EARTH'S OCEANS COMBINED.",extendedLore:"Tidally flexed by orbital resonance with Io and Ganymede, Europa's rocky mantle produces geothermal heating that keeps its deep subsurface ocean in a liquid state. Cryovolcanic plumes venting water into space make it one of humankind's top destinations in the search for extraterrestrial habitability.",missions:[{name:"Galileo",year:"1995–2003",agency:"NASA",role:"Discovered induced magnetic field evidence for a subsurface saline ocean"},{name:"Europa Clipper",year:"2024–Present",agency:"NASA",role:"Dedicated mission equipped with ice-penetrating radar to confirm habitability"}]},Io:{name:"Io",category:"moon",eyebrow:"VOLCANIC MOON · JUPITER I",accentColor:"#facc15",eyebrowColor:"#fef08a",distanceAU:"5.203 AU",textureThumb:"textures/2k_moon.jpg",monographText:"THE MOST VOLCANICALLY ACTIVE BODY IN THE SOLAR SYSTEM, SCARRED BY HUNDREDS OF ACTIVE VOLCANOES DRIVEN BY INTENSE GRAVITATIONAL TIDAL FRICTION.",extendedLore:"Caught in an eccentric resonance between Jupiter and its sibling moons, Io undergoes constant tidal flexing that generates ferocious internal heat, driving molten silicate lava lakes and sulfur plumes hundreds of kilometers into space.",missions:[{name:"Voyager 1",year:"1979",agency:"NASA",role:"First observation of active extraterrestrial volcanism"},{name:"Juno",year:"2016–Present",agency:"NASA",role:"Close flybys mapping polar volcanic hotspots and magma oceans"}]},Ganymede:{name:"Ganymede",category:"moon",eyebrow:"GIANT MOON · JUPITER III",accentColor:"#cbd5e1",eyebrowColor:"#e2e8f0",distanceAU:"5.203 AU",textureThumb:"textures/2k_moon.jpg",monographText:"THE LARGEST MOON IN THE SOLAR SYSTEM, EVEN EXCEEDING MERCURY IN DIAMETER, AND THE ONLY SATELLITE BEARING AN INTERNALLY GENERATED MAGNETIC FIELD.",extendedLore:"Possesses a molten iron-rich core that generates an intrinsic magnetosphere. Beneath its grooved and fractured tectonic ice shell lies a deep subterranean liquid ocean separated by high-pressure ice phases.",missions:[{name:"Galileo",year:"1995–2003",agency:"NASA",role:"Identified intrinsic dipolar magnetic field"},{name:"JUICE",year:"2023–Present",agency:"ESA",role:"En route to enter permanent orbit around Ganymede in 2034"}]},Titan:{name:"Titan",category:"moon",eyebrow:"HYDROCARBON WORLD · SATURN VI",accentColor:"#f59e0b",eyebrowColor:"#fde68a",distanceAU:"9.539 AU",textureThumb:"textures/2k_moon.jpg",monographText:"THE ONLY MOON WITH A DENSE ATMOSPHERE AND STABLE SURFACE SEAS, WHERE METHANE AND ETHANE FORM A COMPLETE METEOROLOGICAL HYDROLOGIC CYCLE.",extendedLore:"Exceeding Mercury in size, Titan possesses an orange smoggy atmosphere 1.5 times denser than Earth's sea-level pressure. Cryogenic rivers carve canyon networks feeding liquid hydrocarbon seas like Kraken Mare.",missions:[{name:"Cassini-Huygens",year:"2004–2017",agency:"NASA / ESA",role:"Huygens landed directly on Titan's surface in 2005"},{name:"Dragonfly",year:"Planned 2028",agency:"NASA",role:"Rotorcraft lander to explore prebiotic organic chemistry"}]},Enceladus:{name:"Enceladus",category:"moon",eyebrow:"CRYOVOLCANIC MOON · SATURN II",accentColor:"#e0f2fe",eyebrowColor:"#f0f9ff",distanceAU:"9.539 AU",textureThumb:"textures/2k_moon.jpg",monographText:"AN IMMACULATE WORLD OF PURE REFLECTIVE ICE, ERUPTING GIANT HYDROTHERMAL GEYSERS FROM TIGER STRIPES OVER ITS SOUTH POLAR TERRAIN.",extendedLore:"Enceladus possesses a global liquid saltwater ocean in direct physical contact with an active hydrothermal rocky seafloor. Cassini detected complex macromolecules and molecular hydrogen in its plumes, confirming active serpentinization.",missions:[{name:"Cassini",year:"2005–2017",agency:"NASA / ESA",role:"Flew directly through erupting plumes, sampling water vapor, salts, and organics"}]},Ceres:{name:"Ceres",category:"dwarf_planet",eyebrow:"DWARF PLANET · ASTEROID BELT",accentColor:"#a1a1aa",eyebrowColor:"#d4d4d8",distanceAU:"2.767 AU",textureThumb:"textures/2k_moon.jpg",monographText:"EMPRESS OF THE ASTEROID BELT, HOLDING A THIRD OF ITS ENTIRE MASS. AN ICE-RICH RELICT WORLD FEATURING RADIANT SODIUM CARBONATE SALT DOMES.",extendedLore:"Ceres is a differentiated protoplanet containing significant quantities of water ice and hydrous minerals. Occator Crater hosts the bright Cerealia Facula, formed by subsurface brine percolation and cryovolcanic extrusion.",missions:[{name:"Dawn",year:"2015–2018",agency:"NASA",role:"Orbited Ceres for three years, discovering active cryovolcanism and hydrated minerals"}]},Sun:{name:"Sun",category:"star",eyebrow:"STAR",accentColor:"#ffaa33",eyebrowColor:"#ffe4a0",distanceAU:"0.000 AU",textureThumb:"textures/2k_sun.jpg",monographText:"THE GLOWING HEART OF OUR SYSTEM, CONTAINING OVER NINETY-NINE POINT EIGHT PERCENT OF ALL MASS. A THERMONUCLEAR ENGINE POWERING ALL LIGHT, LIFE, AND GRAVITATIONAL HARMONY.",extendedLore:"Every second in the solar core, 600 million tons of hydrogen undergo thermonuclear fusion into helium, converting 4 million tons of matter into pure radiant energy. The photon diffusion through the dense radiative zone takes over 100,000 years to reach the convective layer and escape as solar light.",missions:[{name:"SOHO",year:"1995–Present",agency:"ESA / NASA",role:"Continuous monitoring of helioseismology and coronal mass ejections"},{name:"Parker Solar Probe",year:"2018–Present",agency:"NASA",role:"Closest spacecraft to Sun, diving directly through the outer corona"},{name:"Solar Orbiter",year:"2020–Present",agency:"ESA / NASA",role:"Capturing the first close-up images of the Sun's polar regions"}]}};function ST(t){return hh[t]?hh[t]:{name:t,category:"moon",eyebrow:"CELESTIAL BODY",accentColor:"#93c5fd",eyebrowColor:"#bfdbfe",distanceAU:"—",textureThumb:"textures/2k_moon.jpg",monographText:`${t.toUpperCase()} IS A DOCUMENTED COMPONENT OF THE SOLAR SYSTEM CATALOGUE.`,extendedLore:`${t} is catalogued under the NASA JPL DE440 ephemeris model.`,missions:[]}}/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wT=t=>t.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),Jv=(...t)=>t.filter((e,n,i)=>!!e&&e.trim()!==""&&i.indexOf(e)===n).join(" ").trim();/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var ET={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const TT=De.forwardRef(({color:t="currentColor",size:e=24,strokeWidth:n=2,absoluteStrokeWidth:i,className:r="",children:s,iconNode:o,...a},l)=>De.createElement("svg",{ref:l,...ET,width:e,height:e,stroke:t,strokeWidth:i?Number(n)*24/Number(e):n,className:Jv("lucide",r),...a},[...o.map(([c,d])=>De.createElement(c,d)),...Array.isArray(s)?s:[s]]));/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pr=(t,e)=>{const n=De.forwardRef(({className:i,...r},s)=>De.createElement(TT,{ref:s,iconNode:e,className:Jv(`lucide-${wT(t)}`,i),...r}));return n.displayName=`${t}`,n};/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const AT=pr("Calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bT=pr("EyeOff",[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const CT=pr("Eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const PT=pr("Pause",[["rect",{x:"14",y:"4",width:"4",height:"16",rx:"1",key:"zuxfzm"}],["rect",{x:"6",y:"4",width:"4",height:"16",rx:"1",key:"1okwgv"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const RT=pr("Play",[["polygon",{points:"6 3 20 12 6 21 6 3",key:"1oa8hb"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const DT=pr("RotateCcw",[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lg=pr("Search",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pu=pr("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]),NT=["Pluto","Neptune","Uranus","Saturn","Jupiter","Mars","Earth","Venus","Mercury"],LT=({telemetry:t,onSelectPlanet:e,onResetView:n,onTogglePlay:i,onSetTimeMultiplier:r,onSetScaleMode:s,onSeekDate:o,onResetToJ2000:a,onResetToNow:l,onToggleConstellations:c,onToggleAsteroidBelt:d,onToggleOrbits:h,onJumpToScale:f})=>{const p=t==null?void 0:t.activeTarget,v=(t==null?void 0:t.isPaused)??!1,y=(t==null?void 0:t.timeScale)??1,m=(t==null?void 0:t.scaleMode)??"exploration",u=(t==null?void 0:t.julianDate)??2451545,g=(t==null?void 0:t.utcIso)??new Date().toISOString(),x=(t==null?void 0:t.constellationsVisible)??!0,_=(t==null?void 0:t.asteroidBeltVisible)??!0,P=(t==null?void 0:t.orbitsVisible)??!0,T=(t==null?void 0:t.observerScaleMetric)??"1.00 AU",A=(t==null?void 0:t.observerDomain)??"inner_system",b=(t==null?void 0:t.travelSpeed)??0,[w,M]=De.useState(!0),[D,V]=De.useState(!1),[z,X]=De.useState(!1),[Z,Y]=De.useState("all"),[te,N]=De.useState(""),[$,Q]=De.useState(g.slice(0,10)),[oe,_e]=De.useState(!1),[Ve,K]=De.useState(!1),[ne,ce]=De.useState(0),[ae,Ce]=De.useState(!0),[Le,Ue]=De.useState(!1),[ut,We]=De.useState(!1);De.useEffect(()=>{if(typeof window<"u"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches){ce(2);return}const L=setTimeout(()=>ce(1),500),B=setTimeout(()=>ce(2),1200);return()=>{clearTimeout(L),clearTimeout(B)}},[]),De.useEffect(()=>{const L=B=>{B.target instanceof HTMLInputElement||B.target instanceof HTMLTextAreaElement||(B.key===" "||B.code==="Space"?(B.preventDefault(),i()):B.key==="h"||B.key==="H"?(B.preventDefault(),M(ge=>!ge)):B.key==="Escape"?D?V(!1):z||oe?(X(!1),_e(!1)):n():B.key==="o"||B.key==="O"?h==null||h():B.key==="c"||B.key==="C"?c==null||c():(B.key==="b"||B.key==="B")&&(d==null||d()))};return window.addEventListener("keydown",L),()=>window.removeEventListener("keydown",L)},[i,h,c,d,n,D,z,oe]),De.useEffect(()=>{!Ve&&!oe&&Q(g.slice(0,10))},[g,Ve,oe]);const Xe=(p==null?void 0:p.name)||"Mercury",I=De.useMemo(()=>ST(Xe),[Xe]),tn=De.useMemo(()=>yn.getAllBodies(),[]),Pe=De.useMemo(()=>yn.getBody(Xe),[Xe]),[je,be]=De.useState(1),st=De.useRef(null);De.useEffect(()=>{Xe!==st.current&&(st.current=Xe,be(L=>L+1))},[Xe]),De.useEffect(()=>{if(Ce(!0),Ue(!1),ut)return;const L=setTimeout(()=>{Ue(!0)},5500),B=setTimeout(()=>{Ce(!1),Ue(!1)},7100);return()=>{clearTimeout(L),clearTimeout(B)}},[je,ut]);const Ae=De.useCallback(()=>{Ce(!0),Ue(!1),be(L=>L+1)},[]),C=De.useMemo(()=>tn.filter(L=>{if(Z==="planet"&&L.category!=="planet"||Z==="moon"&&L.category!=="moon"||Z==="minor"&&L.category!=="asteroid"&&L.category!=="dwarf_planet")return!1;if(te.trim()){const B=te.toLowerCase();return L.name.toLowerCase().includes(B)||L.category.toLowerCase().includes(B)||L.parentName&&L.parentName.toLowerCase().includes(B)}return!0}),[tn,Z,te]),S=L=>{L.preventDefault(),K(!1);const B=Date.parse($);isNaN(B)||(o(B),_e(!1))},H=[{label:"1×",val:1},{label:"10×",val:10},{label:"100×",val:100},{label:"1 D/S",val:86400},{label:"1 M/S",val:2592e3},{label:"1 Y/S",val:31536e3}],J="/solaris/";return w?k.jsxs("div",{className:"absolute inset-0 pointer-events-none select-none flex flex-col justify-between p-6 z-20 font-sans text-white/90 overflow-hidden",children:[k.jsx("div",{className:"absolute -top-16 left-1/2 -translate-x-1/2 w-[540px] h-32 rounded-[100%] bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-transparent blur-3xl pointer-events-none"}),k.jsxs("header",{className:"flex justify-between items-start pointer-events-auto w-full z-30",children:[k.jsxs("div",{className:`flex flex-col gap-1.5 transition-all duration-1000 ${ne>=0?"opacity-100 translate-y-0":"opacity-0 -translate-y-4"}`,children:[k.jsxs("div",{className:"flex items-baseline gap-3 relative group cursor-pointer",onClick:n,title:"Reset to Solaris Overview",children:[k.jsx("div",{className:"absolute -inset-2 bg-gradient-to-r from-amber-500/10 via-white/5 to-transparent rounded-lg blur-md opacity-40 group-hover:opacity-90 transition-opacity animate-corona-aura pointer-events-none"}),k.jsx("h1",{className:"relative text-xl md:text-2xl uppercase tracking-[0.52em] font-extralight drop-shadow-md select-none animate-solaris-shimmer",children:"SOLARIS"}),k.jsx("span",{className:"text-[9px] uppercase tracking-[0.32em] text-white/35 font-light hidden sm:inline",children:"Solar System Explorer"})]}),k.jsxs("div",{className:"flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-light text-white/60 bg-black/40 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/10 shadow-lg w-fit mt-0.5",children:[k.jsx("span",{className:`w-1.5 h-1.5 rounded-full ${v?"bg-amber-400":"bg-emerald-400 animate-pulse"}`}),k.jsxs("span",{className:"text-white/85",children:[g.replace("T"," ").slice(0,19)," UTC"]}),k.jsx("span",{className:"text-white/20",children:"·"}),k.jsxs("span",{children:["JD ",u.toFixed(2)]}),k.jsx("span",{className:"text-white/20",children:"·"}),k.jsx("span",{className:"text-amber-300/90 font-mono tracking-wider",children:T})]})]}),k.jsxs("div",{className:"hidden xl:flex items-center gap-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-1 shadow-lg pointer-events-auto",children:[k.jsxs("div",{className:"flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] tracking-[0.2em] font-light",children:[k.jsx("span",{className:`w-1.5 h-1.5 rounded-full ${b>4?"bg-cyan-400 animate-ping":"bg-amber-400"}`}),k.jsx("span",{className:"text-white/40 uppercase",children:"SCALE:"}),k.jsx("span",{className:"text-white font-medium tracking-[0.12em]",children:T})]}),k.jsxs("div",{className:"flex items-center gap-0.5 text-[9px] uppercase tracking-[0.2em] font-light",children:[k.jsx("button",{onClick:()=>f==null?void 0:f("planetary"),className:`px-2.5 py-1 rounded-full transition-all duration-200 ${A==="planetary"?"bg-white/20 text-white font-medium shadow-sm border border-white/25":"text-white/40 hover:text-white/80"}`,children:"Planet"}),k.jsx("button",{onClick:()=>f==null?void 0:f("inner_system"),className:`px-2.5 py-1 rounded-full transition-all duration-200 ${A==="inner_system"?"bg-white/20 text-white font-medium shadow-sm border border-white/25":"text-white/40 hover:text-white/80"}`,children:"Inner Sys"}),k.jsx("button",{onClick:()=>f==null?void 0:f("outer_system"),className:`px-2.5 py-1 rounded-full transition-all duration-200 ${A==="outer_system"?"bg-white/20 text-white font-medium shadow-sm border border-white/25":"text-white/40 hover:text-white/80"}`,children:"Outer Sys"}),k.jsx("button",{onClick:()=>f==null?void 0:f("interstellar"),className:`px-2.5 py-1 rounded-full transition-all duration-200 ${A==="interstellar"?"bg-cyan-400/25 text-cyan-200 font-medium shadow-sm border border-cyan-400/35":"text-white/40 hover:text-white/80"}`,children:"Interstellar"}),k.jsx("button",{onClick:()=>f==null?void 0:f("galactic"),className:`px-2.5 py-1 rounded-full transition-all duration-200 ${A==="galactic"?"bg-purple-400/25 text-purple-200 font-medium shadow-sm border border-purple-400/35":"text-white/40 hover:text-white/80"}`,children:"Milky Way"})]})]}),k.jsxs("div",{className:"flex items-center gap-2",children:[k.jsxs("div",{className:"flex items-center bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-0.5 text-[10px] uppercase tracking-[0.2em] font-light shadow-lg",children:[k.jsx("button",{onClick:L=>{L.stopPropagation(),h==null||h()},title:"Toggle Orbit Lines (O)",className:`px-3 py-1 rounded-full transition-all duration-200 ${P?"bg-white/15 text-white shadow-sm border border-white/20":"text-white/40 hover:text-white/80"}`,children:"Orbits"}),k.jsx("button",{onClick:L=>{L.stopPropagation(),c==null||c()},title:"Toggle IAU Constellations (C)",className:`px-3 py-1 rounded-full transition-all duration-200 ${x?"bg-white/15 text-white shadow-sm border border-white/20":"text-white/40 hover:text-white/80"}`,children:"Constellations"}),k.jsx("button",{onClick:L=>{L.stopPropagation(),d==null||d()},title:"Toggle Asteroid Belt (B)",className:`px-3 py-1 rounded-full transition-all duration-200 ${_?"bg-white/15 text-white shadow-sm border border-white/20":"text-white/40 hover:text-white/80"}`,children:"Belt"})]}),k.jsxs("div",{className:"flex items-center bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-0.5 text-[10px] uppercase tracking-[0.2em] font-light shadow-lg",children:[k.jsx("button",{onClick:L=>{L.stopPropagation(),s("exploration")},className:`px-3 py-1 rounded-full transition-all duration-200 ${m==="exploration"?"bg-white/15 text-white shadow-sm border border-white/20":"text-white/40 hover:text-white/80"}`,children:"Exploration"}),k.jsx("button",{onClick:L=>{L.stopPropagation(),s("scientific")},className:`px-3 py-1 rounded-full transition-all duration-200 ${m==="scientific"?"bg-white/15 text-white shadow-sm border border-white/20":"text-white/40 hover:text-white/80"}`,children:"Scientific 1:1"})]}),k.jsxs("button",{onClick:L=>{L.stopPropagation(),X(!0)},className:"flex items-center gap-1.5 px-3.5 py-1.5 bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/10 hover:border-white/20 rounded-full text-[10px] uppercase tracking-[0.2em] font-light text-white/80 transition shadow-lg",children:[k.jsx(lg,{size:11,className:"text-white/50"}),k.jsx("span",{children:"Catalogue (42)"})]}),k.jsxs("button",{onClick:L=>{L.stopPropagation(),n()},title:"Reset to System Overview",className:"flex items-center gap-1.5 px-3.5 py-1.5 bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/10 hover:border-white/20 rounded-full text-[10px] uppercase tracking-[0.2em] font-light text-white/80 transition shadow-lg",children:[k.jsx(DT,{size:11,className:"text-white/50"}),k.jsx("span",{children:"Overview"})]}),k.jsx("button",{onClick:L=>{L.stopPropagation(),M(!1)},title:"Hide Interface (H)",className:"p-2 bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/10 rounded-full text-white/40 hover:text-white transition shadow-lg",children:k.jsx(bT,{size:12})})]})]}),k.jsx("nav",{className:`absolute left-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 pointer-events-auto transition-all duration-1000 z-30 ${ne>=1?"opacity-100 translate-x-0":"opacity-0 -translate-x-8"}`,children:NT.map(L=>{const B=hh[L],ge=Xe===L,ue=`${J}${(B==null?void 0:B.textureThumb)||"textures/2k_moon.jpg"}`;return k.jsxs("button",{onClick:ve=>{ve.stopPropagation(),e(L),Ae()},className:"flex items-center gap-3.5 group text-left cursor-pointer transition-all duration-200 outline-none focus:outline-none",children:[k.jsx("div",{className:`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${ge?"border-white":"border-white/35 group-hover:border-white/60"}`,children:ge&&k.jsx("div",{className:"w-1.5 h-1.5 rounded-full bg-white transition-transform scale-100"})}),ge?k.jsx("div",{className:"h-2.5 rounded-sm transition-all duration-300",style:{backgroundColor:(B==null?void 0:B.accentColor)||"#ffffff",width:"28px",boxShadow:`0 0 10px ${(B==null?void 0:B.accentColor)||"#ffffff"}88`}}):k.jsx("div",{className:"w-6 h-6 rounded-full bg-cover bg-center transition-opacity duration-200 opacity-60 group-hover:opacity-90 flex-shrink-0",style:{backgroundImage:`url(${ue})`,boxShadow:"inset -2px -4px 5px 1px rgba(0,0,0,0.9), inset 1px 1px 2px rgba(255,255,255,0.2)"}}),k.jsxs("div",{className:"flex flex-col",children:[k.jsx("span",{className:`text-[11px] uppercase tracking-[0.22em] transition-colors duration-200 ${ge?"text-white font-medium":"text-white/40 group-hover:text-white/80"}`,children:L}),k.jsx("span",{className:`text-[9px] tracking-wider transition-colors duration-200 font-light ${ge?"text-white/50":"text-white/20 group-hover:text-white/40"}`,children:(B==null?void 0:B.distanceAU)||""})]})]},L)})}),ae&&k.jsx("section",{onMouseEnter:()=>We(!0),onMouseLeave:()=>We(!1),className:"absolute left-1/2 bottom-20 md:bottom-24 -translate-x-1/2 pointer-events-auto select-none z-20",children:k.jsxs("div",{className:`flex flex-col items-center text-center max-w-2xl px-6 ${Le?"monograph-vanishing":"monograph-visible"}`,children:[k.jsx("span",{className:"text-[11px] md:text-xs uppercase tracking-[0.52em] font-light transition-colors duration-500 mb-1",style:{color:I.eyebrowColor},children:I.eyebrow}),k.jsx("h2",{className:"text-5xl md:text-6xl lg:text-7xl font-extralight tracking-[0.36em] text-white uppercase drop-shadow-2xl my-1.5 transition-all duration-500",children:Xe}),k.jsx("p",{className:"text-[10px] md:text-[11px] lg:text-[12px] font-light tracking-[0.20em] leading-relaxed text-white/75 uppercase max-w-xl mx-auto my-3 text-center transition-all duration-500",children:I.monographText}),k.jsxs("button",{onClick:L=>{L.stopPropagation(),V(!0)},className:"group mt-2.5 flex flex-col items-center cursor-pointer transition-all duration-300 outline-none focus:outline-none",children:[k.jsx("span",{className:"text-xs uppercase tracking-[0.32em] font-light transition-colors duration-300",style:{color:I.accentColor},children:"READ MORE"}),k.jsx("div",{className:"h-[1px] w-full mt-1 transition-all duration-300 group-hover:w-[115%]",style:{backgroundColor:I.accentColor,boxShadow:`0 0 6px ${I.accentColor}66`}})]})]})}),!ae&&k.jsx("div",{className:"absolute left-1/2 bottom-20 -translate-x-1/2 pointer-events-auto z-20 transition-all duration-700 opacity-60 hover:opacity-100",children:k.jsxs("button",{onClick:L=>{L.stopPropagation(),Ae()},className:"flex items-center gap-2 px-3.5 py-1 text-[10px] uppercase tracking-[0.25em] font-light text-white/60 hover:text-white bg-black/40 hover:bg-black/80 backdrop-blur-md border border-white/10 hover:border-white/25 rounded-full transition-all shadow-lg cursor-pointer",children:[k.jsx("span",{className:"w-1.5 h-1.5 rounded-full animate-pulse",style:{backgroundColor:I.accentColor}}),k.jsxs("span",{children:[Xe," Overview"]})]})}),k.jsxs("footer",{className:"flex flex-col items-center gap-2 w-full pointer-events-auto z-30",children:[k.jsxs("div",{className:"flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-4 py-1 text-[10px] uppercase tracking-[0.2em] font-light shadow-xl",children:[k.jsx("button",{onClick:L=>{L.stopPropagation(),i()},className:"p-1 text-white/70 hover:text-white transition rounded-full",title:"Space to toggle play",children:v?k.jsx(RT,{size:11}):k.jsx(PT,{size:11})}),k.jsx("div",{className:"flex items-center gap-1 border-l border-white/10 pl-3",children:H.map(L=>{const B=!v&&y===L.val;return k.jsx("button",{onClick:ge=>{ge.stopPropagation(),r(L.val)},className:`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-[0.15em] transition-all duration-200 ${B?"bg-white/20 text-white font-normal border border-white/25 shadow-sm":"text-white/40 hover:text-white/70"}`,children:L.label},L.label)})}),k.jsxs("div",{className:"flex items-center gap-1.5 border-l border-white/10 pl-3 text-[10px] uppercase tracking-[0.2em] font-light",children:[k.jsx("button",{onClick:L=>{L.stopPropagation(),a()},className:"text-white/40 hover:text-white px-1.5 py-0.5 rounded transition",children:"J2000"}),k.jsx("button",{onClick:L=>{L.stopPropagation(),l()},className:"text-white/40 hover:text-white px-1.5 py-0.5 rounded transition",children:"Now"}),k.jsxs("button",{onClick:L=>{L.stopPropagation(),_e(!oe)},className:"flex items-center gap-1 text-white/50 hover:text-white px-1.5 py-0.5 rounded transition",children:[k.jsx(AT,{size:10}),k.jsx("span",{children:$})]})]})]}),oe&&k.jsxs("form",{onSubmit:S,className:"flex items-center gap-2 bg-black/85 backdrop-blur-xl border border-white/15 rounded-xl px-3 py-2 text-[10px] uppercase tracking-[0.2em] font-light shadow-2xl",children:[k.jsx("input",{type:"date",value:$,onFocus:()=>K(!0),onChange:L=>{K(!0),Q(L.target.value)},onBlur:()=>K(!1),className:"bg-white/10 text-white px-2 py-1 rounded border border-white/15 outline-none focus:border-white/40 text-[11px] font-sans"}),k.jsx("button",{type:"submit",className:"px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg transition text-[10px] uppercase tracking-[0.2em] font-light",children:"Jump"}),k.jsx("button",{type:"button",onClick:()=>_e(!1),className:"p-1 text-white/40 hover:text-white",children:k.jsx(Pu,{size:12})})]})]}),D&&k.jsxs("div",{className:"fixed inset-0 z-50 pointer-events-auto flex justify-end animate-fadeIn",children:[k.jsx("div",{onClick:()=>V(!1),className:"flex-1 bg-black/60 backdrop-blur-sm transition-opacity"}),k.jsxs("aside",{className:"w-[420px] max-w-full bg-[#040307]/95 backdrop-blur-2xl border-l border-white/10 p-7 flex flex-col gap-6 shadow-2xl h-full font-sans overflow-y-auto no-scrollbar",children:[k.jsxs("div",{className:"flex justify-between items-start border-b border-white/10 pb-4",children:[k.jsxs("div",{children:[k.jsxs("span",{className:"text-[10px] uppercase tracking-[0.25em] font-light block",style:{color:I.eyebrowColor},children:[I.eyebrow," · SOLAR SYSTEM EXPLORER"]}),k.jsx("h2",{className:"text-3xl font-extralight text-white tracking-[0.25em] uppercase mt-1",children:Xe})]}),k.jsx("button",{onClick:()=>V(!1),className:"text-white/40 hover:text-white transition p-1.5 rounded-full hover:bg-white/10",children:k.jsx(Pu,{size:18})})]}),k.jsxs("div",{className:"flex flex-col gap-2",children:[k.jsx("span",{className:"text-[10px] tracking-[0.25em] uppercase text-white/40 font-light",children:"Astronomical Lore & Physical Environment"}),k.jsx("p",{className:"text-xs leading-relaxed text-white/80 font-light",children:I.extendedLore})]}),Pe&&k.jsxs("div",{className:"flex flex-col gap-2 pt-2 border-t border-white/10",children:[k.jsx("span",{className:"text-[10px] tracking-[0.25em] uppercase text-white/40 font-light",children:"Physical Dimensions"}),k.jsxs("div",{className:"grid grid-cols-2 gap-y-2 text-xs font-light",children:[k.jsx("span",{className:"text-white/40",children:"Mean Radius"}),k.jsxs("span",{className:"text-right text-white/90",children:[Pe.physical.meanRadiusKm.toLocaleString()," km"]}),k.jsx("span",{className:"text-white/40",children:"Surface Gravity"}),k.jsx("span",{className:"text-right text-white/90",children:Pe.physical.gmKm3S2?`${(Pe.physical.gmKm3S2*1e3/Math.pow(Pe.physical.meanRadiusKm,2)).toFixed(2)} m/s²`:"—"}),k.jsx("span",{className:"text-white/40",children:"Sidereal Day"}),k.jsx("span",{className:"text-right text-white/90",children:Pe.physical.rotationPeriodHours!==void 0?`${Pe.physical.rotationPeriodHours.toFixed(1)} h`:"Synchronous"}),k.jsx("span",{className:"text-white/40",children:"Axial Tilt"}),k.jsx("span",{className:"text-right text-white/90",children:Pe.physical.axialTiltDeg!==void 0?`${Pe.physical.axialTiltDeg.toFixed(2)}°`:"0.00°"})]})]}),Pe&&k.jsxs("div",{className:"flex flex-col gap-2 pt-2 border-t border-white/10",children:[k.jsx("span",{className:"text-[10px] tracking-[0.25em] uppercase text-white/40 font-light",children:"Keplerian Orbit (J2000)"}),k.jsxs("div",{className:"grid grid-cols-2 gap-y-2 text-xs font-light",children:[k.jsx("span",{className:"text-white/40",children:"Semi-Major Axis"}),k.jsxs("span",{className:"text-right text-white/90",children:[Pe.orbit.semiMajorAxisAU.toFixed(3)," AU"]}),k.jsx("span",{className:"text-white/40",children:"Eccentricity"}),k.jsx("span",{className:"text-right text-white/90",children:Pe.orbit.eccentricity.toFixed(4)}),k.jsx("span",{className:"text-white/40",children:"Orbital Period"}),k.jsx("span",{className:"text-right text-white/90",children:Pe.orbit.orbitalPeriodDays>730?`${(Pe.orbit.orbitalPeriodDays/365.25).toFixed(2)} yr`:`${Pe.orbit.orbitalPeriodDays.toFixed(1)} d`}),k.jsx("span",{className:"text-white/40",children:"Inclination"}),k.jsxs("span",{className:"text-right text-white/90",children:[Pe.orbit.inclinationDeg.toFixed(2),"°"]})]})]}),p&&k.jsxs("div",{className:"flex flex-col gap-2 pt-2 border-t border-white/10",children:[k.jsx("span",{className:"text-[10px] tracking-[0.25em] uppercase text-white/40 font-light",children:"Live Ephemeris Telemetry"}),k.jsxs("div",{className:"grid grid-cols-2 gap-y-2 text-xs font-light",children:[k.jsx("span",{className:"text-white/40",children:"Heliocentric Dist"}),k.jsx("span",{className:"text-right text-white/90",children:p.distanceKm>1e6?`${(p.distanceKm/1e6).toFixed(2)}M km`:`${Math.round(p.distanceKm).toLocaleString()} km`}),k.jsx("span",{className:"text-white/40",children:"AU Distance"}),k.jsxs("span",{className:"text-right text-white/90",children:[(p.distanceKm/1495978707e-1).toFixed(3)," AU"]}),k.jsx("span",{className:"text-white/40",children:"Orbital Velocity"}),k.jsxs("span",{className:"text-right text-white/90",children:[p.apparentSpeedKmS.toFixed(2)," km/s"]})]})]}),I.missions&&I.missions.length>0&&k.jsxs("div",{className:"flex flex-col gap-3 pt-2 border-t border-white/10",children:[k.jsx("span",{className:"text-[10px] tracking-[0.25em] uppercase text-white/40 font-light",children:"Exploration Missions"}),k.jsx("div",{className:"flex flex-col gap-2.5",children:I.missions.map(L=>k.jsxs("div",{className:"p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col gap-1",children:[k.jsxs("div",{className:"flex justify-between items-center text-xs",children:[k.jsx("span",{className:"text-white font-medium tracking-[0.1em]",children:L.name}),k.jsxs("span",{className:"text-[10px] text-white/40 font-light",children:[L.year," · ",L.agency]})]}),k.jsx("p",{className:"text-[11px] text-white/60 font-light",children:L.role})]},L.name))})]}),k.jsxs("div",{className:"pt-3 border-t border-white/10 flex justify-between items-center text-[10px] font-light text-white/30 uppercase tracking-[0.2em]",children:[k.jsx("span",{children:"NASA JPL SSD Horizons DE440"}),k.jsx("span",{children:"Keplerian 2-Body Solver"})]})]})]}),z&&k.jsxs("div",{className:"fixed inset-0 z-50 pointer-events-auto flex",children:[k.jsx("div",{onClick:()=>X(!1),className:"flex-1 bg-black/60 backdrop-blur-sm transition-opacity"}),k.jsxs("aside",{className:"w-96 bg-[#07060a]/95 backdrop-blur-2xl border-l border-white/10 p-6 flex flex-col gap-5 shadow-2xl h-full font-sans",children:[k.jsxs("div",{className:"flex justify-between items-center border-b border-white/10 pb-4",children:[k.jsxs("div",{children:[k.jsx("h3",{className:"text-lg font-extralight text-white tracking-[0.25em] uppercase",children:"Astronomical Catalogue"}),k.jsx("span",{className:"text-[10px] uppercase tracking-[0.2em] font-light text-white/40",children:"42 bodies · NASA JPL DE440"})]}),k.jsx("button",{onClick:()=>X(!1),className:"text-white/40 hover:text-white transition p-1.5 rounded-full hover:bg-white/5",children:k.jsx(Pu,{size:16})})]}),k.jsxs("div",{className:"flex flex-col gap-2.5 text-xs",children:[k.jsxs("div",{className:"relative",children:[k.jsx(lg,{size:13,className:"absolute left-3 top-2.5 text-white/35"}),k.jsx("input",{type:"text",placeholder:"FILTER BY NAME, CATEGORY...",value:te,onChange:L=>N(L.target.value),className:"w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white placeholder-white/30 text-[11px] uppercase tracking-[0.15em] outline-none focus:border-white/30"})]}),k.jsx("div",{className:"grid grid-cols-4 gap-1 text-[10px] uppercase tracking-[0.18em] font-light",children:["all","planet","moon","minor"].map(L=>k.jsx("button",{onClick:()=>Y(L),className:`py-1 rounded-lg text-center uppercase tracking-wider transition-all duration-200 ${Z===L?"bg-white/15 text-white font-normal border border-white/20":"text-white/40 hover:text-white/70"}`,children:L==="all"?"All (42)":L==="planet"?"Planets":L==="moon"?"Moons":"Minor"},L))})]}),k.jsx("div",{className:"flex-1 overflow-y-auto no-scrollbar flex flex-col gap-1.5 pr-1",children:C.map(L=>{const B=Xe===L.name;return k.jsxs("button",{onClick:()=>{e(L.name),Ae(),X(!1)},className:`flex items-center justify-between p-2.5 rounded-xl border transition text-left ${B?"bg-white/15 border-white/30 text-white":"bg-white/[0.02] border-white/5 text-white/70 hover:bg-white/[0.06] hover:text-white"}`,children:[k.jsxs("div",{className:"flex items-center gap-3",children:[k.jsx("span",{className:"w-2 h-2 rounded-full flex-shrink-0",style:{backgroundColor:L.physical.colorHex||"#ffffff"}}),k.jsxs("div",{className:"flex flex-col",children:[k.jsx("span",{className:"text-xs text-white font-light tracking-[0.15em] uppercase",children:L.name}),k.jsxs("span",{className:"text-[10px] text-white/35 uppercase tracking-[0.1em]",children:[L.category.replace("_"," "),L.parentName&&` · ${L.parentName}`]})]})]}),k.jsxs("div",{className:"text-right text-[10px] text-white/40 font-light tracking-wider",children:[k.jsxs("div",{children:[L.physical.meanRadiusKm.toLocaleString()," km"]}),k.jsxs("div",{children:[L.orbit.semiMajorAxisAU.toFixed(2)," AU"]})]})]},L.name)})})]})]})]}):k.jsx("div",{className:"absolute bottom-6 right-6 z-50 pointer-events-auto",children:k.jsxs("button",{onClick:()=>M(!0),className:"flex items-center gap-2 px-3.5 py-1.5 text-xs text-white/50 hover:text-white bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/10 rounded-full transition uppercase tracking-[0.2em] font-light",children:[k.jsx(CT,{size:13}),k.jsx("span",{children:"Show Interface (H)"})]})})},IT=()=>{const t=De.useRef(null),e=De.useRef(null),[n,i]=De.useState(null);De.useEffect(()=>{if(!t.current)return;const m=new MT(t.current,u=>{i(u)});return e.current=m,window.__solaris_scene=m,()=>{delete window.__solaris_scene,m.dispose(),e.current=null}},[]);const r=De.useCallback(m=>{var u;(u=e.current)==null||u.selectBody(m)},[]),s=De.useCallback(()=>{var m;(m=e.current)==null||m.resetView()},[]),o=De.useCallback(()=>{if(!e.current)return;const m=e.current.clock.isPaused;e.current.clock.isPaused=!m},[]),a=De.useCallback(m=>{e.current&&(e.current.clock.timeMultiplier=m,e.current.clock.isPaused=!1)},[]),l=De.useCallback(m=>{var u;(u=e.current)==null||u.setScaleMode(m)},[]),c=De.useCallback(m=>{var u;(u=e.current)==null||u.clock.setUtcMs(m)},[]),d=De.useCallback(()=>{var m;(m=e.current)==null||m.clock.resetToJ2000()},[]),h=De.useCallback(()=>{var m;(m=e.current)==null||m.clock.resetToNow()},[]),f=De.useCallback(()=>{var m;(m=e.current)==null||m.toggleConstellations()},[]),p=De.useCallback(()=>{var m;(m=e.current)==null||m.toggleAsteroidBelt()},[]),v=De.useCallback(()=>{var m;(m=e.current)==null||m.toggleOrbits()},[]),y=De.useCallback(m=>{var u;(u=e.current)==null||u.jumpToScale(m)},[]);return k.jsxs("div",{className:"relative w-screen h-screen overflow-hidden bg-[#030206]",style:{width:"100vw",height:"100vh",position:"relative",overflow:"hidden"},children:[k.jsx("div",{ref:t,className:"absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing",style:{position:"absolute",top:0,left:0,width:"100%",height:"100%"}}),k.jsx(LT,{telemetry:n,onSelectPlanet:r,onResetView:s,onTogglePlay:o,onSetTimeMultiplier:a,onSetScaleMode:l,onSeekDate:c,onResetToJ2000:d,onResetToNow:h,onToggleConstellations:f,onToggleAsteroidBelt:p,onToggleOrbits:v,onJumpToScale:y})]})};Ru.createRoot(document.getElementById("root")).render(k.jsx(Mx.StrictMode,{children:k.jsx(IT,{})}));
