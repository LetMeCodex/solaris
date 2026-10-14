var Ya=Object.defineProperty;var Ja=(c,e,t)=>e in c?Ya(c,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):c[e]=t;var u=(c,e,t)=>Ja(c,typeof e!="symbol"?e+"":e,t);import{r as T,a as qa,R as $a}from"./react-nf7bT_Uh.js";import{C as _,R as G,a as L,T as Xa,b as ha,S as Ee,N as at,L as ot,c as bt,d as k,B as He,A as Y,V as P,D as Le,G as ie,P as nt,M as F,e as E,f as re,g as Qa,h as Ut,i as Et,j as V,k as j,l as me,m as pe,n as Za,o as ei,p as da,q as We,r as Ie,s as Qt,t as O,u as ua,I as ti,F as Oe,v as X,w as Se,x as ai,Q as lt,O as ii,y as si,z as oi,E as ri,H as ni,U as ct,W as ze,J as Ke,K as li,X as ci,Y as hi,Z as di,_ as ui,$ as mi,a0 as pi,a1 as gi,a2 as ma,a3 as fi,a4 as vi,a5 as yi,a6 as xi,a7 as wi,a8 as bi,a9 as Mi,aa as Si,ab as Pi}from"./three-D5IwsDt7.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function t(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(a){if(a.ep)return;a.ep=!0;const s=t(a);fetch(a.href,s)}})();var pa={exports:{}},ft={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ai=T,Di=Symbol.for("react.element"),Ti=Symbol.for("react.fragment"),Ci=Object.prototype.hasOwnProperty,Ri=Ai.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Ei={key:!0,ref:!0,__self:!0,__source:!0};function ga(c,e,t){var i,a={},s=null,o=null;t!==void 0&&(s=""+t),e.key!==void 0&&(s=""+e.key),e.ref!==void 0&&(o=e.ref);for(i in e)Ci.call(e,i)&&!Ei.hasOwnProperty(i)&&(a[i]=e[i]);if(c&&c.defaultProps)for(i in e=c.defaultProps,e)a[i]===void 0&&(a[i]=e[i]);return{$$typeof:Di,type:c,key:s,ref:o,props:a,_owner:Ri.current}}ft.Fragment=Ti;ft.jsx=ga;ft.jsxs=ga;pa.exports=ft;var d=pa.exports,Nt={},Zt=qa;Nt.createRoot=Zt.createRoot,Nt.hydrateRoot=Zt.hydrateRoot;const Ni=[{id:"10",name:"Sun",category:"star",orderFromSun:0,physical:{meanRadiusKm:695700,equatorialRadiusKm:695700,polarRadiusKm:695700,flattening:0,massKg:19885e26,gmKm3S2:1327124400419394e-4,rotationPeriodHours:609.12,axialTiltDeg:7.25,meanTemperatureK:5778,spectralType:"G2V",colorHex:"#ffdd77"},orbit:{semiMajorAxisKm:0,semiMajorAxisAU:0,eccentricity:0,inclinationDeg:0,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:0,orbitalPeriodDays:0},description:"Yellow dwarf star (G2V) at the gravitational center of the Solar System, containing 99.86% of the system’s total mass."},{id:"199",name:"Mercury",category:"planet",orderFromSun:1,physical:{meanRadiusKm:2439.7,equatorialRadiusKm:2439.7,polarRadiusKm:2439.7,flattening:0,massKg:33011e19,gmKm3S2:22031.78,rotationPeriodHours:1407.6,axialTiltDeg:.034,meanTemperatureK:440,colorHex:"#9c968f"},orbit:{semiMajorAxisKm:579092265e-1,semiMajorAxisAU:.38709927,eccentricity:.20563593,inclinationDeg:7.00497902,longitudeAscendingNodeDeg:48.33076593,argumentPeriapsisDeg:29.12703035,meanAnomalyAtEpochDeg:174.79252722,orbitalPeriodDays:87.969,epochJd:2451545,ratesPerCentury:{semiMajorAxisAU:37e-8,eccentricity:1906e-8,inclinationDeg:-.00594749,longitudeAscendingNodeDeg:-.12534081,argumentPeriapsisDeg:.2858177,meanAnomalyDeg:149472.51363486},source:"JPL SSD approximate planetary positions (Standish), Table 1"},description:"Smallest planet, heavily cratered with silicate crust and large iron core; lacks a substantial atmosphere."},{id:"299",name:"Venus",category:"planet",orderFromSun:2,physical:{meanRadiusKm:6051.8,equatorialRadiusKm:6051.8,polarRadiusKm:6051.8,flattening:0,massKg:48675e20,gmKm3S2:324858.59,rotationPeriodHours:-5832.5,axialTiltDeg:177.36,meanTemperatureK:737,colorHex:"#e3bb7b"},orbit:{semiMajorAxisKm:1082094745e-1,semiMajorAxisAU:.72333566,eccentricity:.00677672,inclinationDeg:3.39467605,longitudeAscendingNodeDeg:76.67984255,argumentPeriapsisDeg:54.92262463,meanAnomalyAtEpochDeg:50.37663232,orbitalPeriodDays:224.701,epochJd:2451545,ratesPerCentury:{semiMajorAxisAU:39e-7,eccentricity:-4107e-8,inclinationDeg:-7889e-7,longitudeAscendingNodeDeg:-.27769418,argumentPeriapsisDeg:.28037747,meanAnomalyDeg:58517.812704},source:"JPL SSD approximate planetary positions (Standish), Table 1"},description:"Terrestrial planet shrouded in dense carbon dioxide atmosphere and sulfuric acid clouds with runaway greenhouse effect."},{id:"399",name:"Earth",category:"planet",orderFromSun:3,physical:{meanRadiusKm:6371,equatorialRadiusKm:6378.137,polarRadiusKm:6356.752,flattening:.003353,massKg:59722e20,gmKm3S2:398600.4418,rotationPeriodHours:23.9344,axialTiltDeg:23.439,meanTemperatureK:288,colorHex:"#4b75a1"},orbit:{semiMajorAxisKm:1495982612e-1,semiMajorAxisAU:1.00000261,eccentricity:.01671123,inclinationDeg:-1531e-8,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:102.93768193,meanAnomalyAtEpochDeg:357.52688973,orbitalPeriodDays:365.256,epochJd:2451545,ratesPerCentury:{semiMajorAxisAU:562e-8,eccentricity:-4392e-8,inclinationDeg:-.01294668,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:.32327364,meanAnomalyDeg:35999.04917617},source:"JPL SSD approximate planetary positions (Standish), Table 1"},description:"Dense rocky world featuring liquid surface water, active plate tectonics, oxygen-rich atmosphere, and planetary biosphere."},{id:"499",name:"Mars",category:"planet",orderFromSun:4,physical:{meanRadiusKm:3389.5,equatorialRadiusKm:3396.2,polarRadiusKm:3376.2,flattening:.00589,massKg:64171e19,gmKm3S2:42828.375,rotationPeriodHours:24.6229,axialTiltDeg:25.19,meanTemperatureK:210,colorHex:"#c16138"},orbit:{semiMajorAxisKm:2279438224e-1,semiMajorAxisAU:1.52371034,eccentricity:.0933941,inclinationDeg:1.84969142,longitudeAscendingNodeDeg:49.55953891,argumentPeriapsisDeg:-73.5031685,meanAnomalyAtEpochDeg:19.39019754,orbitalPeriodDays:686.98,epochJd:2451545,ratesPerCentury:{semiMajorAxisAU:1847e-8,eccentricity:7882e-8,inclinationDeg:-.00813131,longitudeAscendingNodeDeg:-.29257343,argumentPeriapsisDeg:.73698431,meanAnomalyDeg:19139.85827411},source:"JPL SSD approximate planetary positions (Standish), Table 1"},description:"Cold desert world with iron-oxide regolith, giant shield volcanoes (Olympus Mons), rift canyon Valles Marineris, and polar ice caps."},{id:"599",name:"Jupiter",category:"planet",orderFromSun:5,physical:{meanRadiusKm:69911,equatorialRadiusKm:71492,polarRadiusKm:66854,flattening:.06487,massKg:18982e23,gmKm3S2:12668653492e-2,rotationPeriodHours:9.925,axialTiltDeg:3.13,meanTemperatureK:165,colorHex:"#c8a679"},orbit:{semiMajorAxisKm:7783408167e-1,semiMajorAxisAU:5.202887,eccentricity:.04838624,inclinationDeg:1.30439695,longitudeAscendingNodeDeg:100.47390909,argumentPeriapsisDeg:-85.74542926,meanAnomalyAtEpochDeg:19.66796068,orbitalPeriodDays:4332.589,epochJd:2451545,ratesPerCentury:{semiMajorAxisAU:-11607e-8,eccentricity:-13253e-8,inclinationDeg:-.00183714,longitudeAscendingNodeDeg:.20469106,argumentPeriapsisDeg:.00783562,meanAnomalyDeg:3034.53360107},source:"JPL SSD approximate planetary positions (Standish), Table 1"},description:"Largest planet; hydrogen-helium gas giant displaying zonal atmospheric jet streams, turbulent vortices, and the Great Red Spot."},{id:"699",name:"Saturn",category:"planet",orderFromSun:6,physical:{meanRadiusKm:58232,equatorialRadiusKm:60268,polarRadiusKm:54364,flattening:.09796,massKg:56834e22,gmKm3S2:379311879e-1,rotationPeriodHours:10.656,axialTiltDeg:26.73,meanTemperatureK:134,colorHex:"#dfcf9f"},orbit:{semiMajorAxisKm:14266664142e-1,semiMajorAxisAU:9.53667594,eccentricity:.05386179,inclinationDeg:2.48599187,longitudeAscendingNodeDeg:113.66242448,argumentPeriapsisDeg:-21.06354617,meanAnomalyAtEpochDeg:317.35536592,orbitalPeriodDays:10759.22,epochJd:2451545,ratesPerCentury:{semiMajorAxisAU:-.0012506,eccentricity:-50991e-8,inclinationDeg:.00193609,longitudeAscendingNodeDeg:-.28867794,argumentPeriapsisDeg:-.13029422,meanAnomalyDeg:1222.91259417},source:"JPL SSD approximate planetary positions (Standish), Table 1"},description:"Gas giant celebrated for its extensive, brilliant ring system consisting of water ice particles, dust, and rock."},{id:"799",name:"Uranus",category:"planet",orderFromSun:7,physical:{meanRadiusKm:25362,equatorialRadiusKm:25559,polarRadiusKm:24973,flattening:.02293,massKg:8681e22,gmKm3S2:57939393e-1,rotationPeriodHours:-17.24,axialTiltDeg:97.77,meanTemperatureK:76,colorHex:"#8fe0ea"},orbit:{semiMajorAxisKm:28706581707e-1,semiMajorAxisAU:19.18916464,eccentricity:.04725744,inclinationDeg:.77263783,longitudeAscendingNodeDeg:74.01692503,argumentPeriapsisDeg:96.93735127,meanAnomalyAtEpochDeg:142.28382821,orbitalPeriodDays:30685.4,epochJd:2451545,ratesPerCentury:{semiMajorAxisAU:-.00196176,eccentricity:-4397e-8,inclinationDeg:-.00242939,longitudeAscendingNodeDeg:.04240589,argumentPeriapsisDeg:.36564692,meanAnomalyDeg:428.07397504},source:"JPL SSD approximate planetary positions (Standish), Table 1"},description:"Ice giant composed of water, ammonia, and methane ices; extreme 98° axial tilt results in extreme seasonal variations."},{id:"899",name:"Neptune",category:"planet",orderFromSun:8,physical:{meanRadiusKm:24622,equatorialRadiusKm:24764,polarRadiusKm:24341,flattening:.01708,massKg:102413e21,gmKm3S2:68350995e-1,rotationPeriodHours:16.11,axialTiltDeg:28.32,meanTemperatureK:72,colorHex:"#4b70dd"},orbit:{semiMajorAxisKm:4498396417,semiMajorAxisAU:30.06992276,eccentricity:.00859048,inclinationDeg:1.77004347,longitudeAscendingNodeDeg:131.78422574,argumentPeriapsisDeg:-86.81946347,meanAnomalyAtEpochDeg:259.91520804,orbitalPeriodDays:60189,epochJd:2451545,ratesPerCentury:{semiMajorAxisAU:26291e-8,eccentricity:5105e-8,inclinationDeg:35372e-8,longitudeAscendingNodeDeg:-.00508664,argumentPeriapsisDeg:-.317328,meanAnomalyDeg:218.78186789},source:"JPL SSD approximate planetary positions (Standish), Table 1"},description:"Outermost major planet; deep azure ice giant driven by violent supersonic winds, methane haze, and high-altitude cirrus clouds."}],ki=[{id:"301",name:"Moon",category:"moon",orderFromSun:3,parentId:"399",parentName:"Earth",physical:{meanRadiusKm:1737.4,equatorialRadiusKm:1738.1,polarRadiusKm:1736,flattening:.0012,massKg:7342e19,gmKm3S2:4902.8,rotationPeriodHours:655.728,axialTiltDeg:6.68,meanTemperatureK:250,colorHex:"#c4c3be"},orbit:{semiMajorAxisKm:384400,semiMajorAxisAU:.0025695553,eccentricity:.0554,inclinationDeg:5.16,longitudeAscendingNodeDeg:125.08,argumentPeriapsisDeg:318.15,meanAnomalyAtEpochDeg:135.27,orbitalPeriodDays:27.321661,epochJd:2451545,meanMotionDegPerDay:13.064995931,periapsisArgRateDegPerDay:.164353224,nodeRateDegPerDay:-.05299066,source:"JPL SSD planetary satellite mean elements"},description:"Earth’s only natural satellite; tidally locked with extensive lunar maria basalt plains and impact-cratered anorthositic highlands."},{id:"401",name:"Phobos",category:"moon",orderFromSun:4,parentId:"499",parentName:"Mars",physical:{meanRadiusKm:11.26,equatorialRadiusKm:13,polarRadiusKm:9.1,massKg:10659e12,gmKm3S2:71e-5,rotationPeriodHours:7.654,axialTiltDeg:0,colorHex:"#8b847d"},orbit:{semiMajorAxisKm:9377.9,semiMajorAxisAU:626874e-10,eccentricity:.01468188,inclinationDeg:25.639416,longitudeAscendingNodeDeg:82.61167,argumentPeriapsisDeg:282.404283,meanAnomalyAtEpochDeg:176.914893,orbitalPeriodDays:.31891023,epochJd:24613275e-1,meanMotionDegPerDay:1128.84431459,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Innermost and largest moon of Mars; heavily cratered irregular body featuring the massive Stickney impact crater, orbiting inside synchronous orbit."},{id:"402",name:"Deimos",category:"moon",orderFromSun:4,parentId:"499",parentName:"Mars",physical:{meanRadiusKm:6.2,massKg:14762e11,rotationPeriodHours:30.31,axialTiltDeg:0,colorHex:"#999186"},orbit:{semiMajorAxisKm:23458.846,semiMajorAxisAU:.0001568127,eccentricity:25811e-8,inclinationDeg:24.120481,longitudeAscendingNodeDeg:81.546986,argumentPeriapsisDeg:52.283083,meanAnomalyAtEpochDeg:122.884373,orbitalPeriodDays:1.2624407,epochJd:24613275e-1,meanMotionDegPerDay:285.161908991,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Outermost moon of Mars; smooth-looking irregular body coated in a thick regolith blanket that softens surface topography."},{id:"501",name:"Io",category:"moon",orderFromSun:5,parentId:"599",parentName:"Jupiter",physical:{meanRadiusKm:1821.5,massKg:89319e18,gmKm3S2:5959.91,rotationPeriodHours:42.456,axialTiltDeg:0,meanTemperatureK:130,colorHex:"#e5c158"},orbit:{semiMajorAxisKm:422020.056,semiMajorAxisAU:.0028210298,eccentricity:.00359279,inclinationDeg:2.228063,longitudeAscendingNodeDeg:338.403388,argumentPeriapsisDeg:31.382494,meanAnomalyAtEpochDeg:199.124628,orbitalPeriodDays:1.769137786,epochJd:24613275e-1,meanMotionDegPerDay:203.488955382,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Most volcanically active body in the Solar System, driven by tidal friction from orbital resonance with Europa and Ganymede; coated in sulfur and sulfur dioxide."},{id:"502",name:"Europa",category:"moon",orderFromSun:5,parentId:"599",parentName:"Jupiter",physical:{meanRadiusKm:1560.8,massKg:47998e18,gmKm3S2:3202.73,rotationPeriodHours:85.224,axialTiltDeg:.1,meanTemperatureK:102,colorHex:"#c7bfae"},orbit:{semiMajorAxisKm:671258.947,semiMajorAxisAU:.0044870889,eccentricity:.00931579,inclinationDeg:2.07625,longitudeAscendingNodeDeg:326.203313,argumentPeriapsisDeg:224.926561,meanAnomalyAtEpochDeg:279.791695,orbitalPeriodDays:3.551181041,epochJd:24613275e-1,meanMotionDegPerDay:101.37472459,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Smooth, brilliant water-ice crust fractured by tectonic lineae and cycloids; harbors a deep global subsurface liquid water ocean with astrobiological potential."},{id:"503",name:"Ganymede",category:"moon",orderFromSun:5,parentId:"599",parentName:"Jupiter",physical:{meanRadiusKm:2631.2,massKg:14819e19,gmKm3S2:9887.83,rotationPeriodHours:171.72,axialTiltDeg:.2,meanTemperatureK:110,colorHex:"#8e8379"},orbit:{semiMajorAxisKm:1070453601e-3,semiMajorAxisAU:.0071555404,eccentricity:.00274315,inclinationDeg:2.34352,longitudeAscendingNodeDeg:339.06555,argumentPeriapsisDeg:3.818835,meanAnomalyAtEpochDeg:349.11927,orbitalPeriodDays:7.15455296,epochJd:24613275e-1,meanMotionDegPerDay:50.317609222,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Largest natural satellite in the Solar System (larger than Mercury); only known moon with its own intrinsic magnetic field generated by a liquid iron core."},{id:"504",name:"Callisto",category:"moon",orderFromSun:5,parentId:"599",parentName:"Jupiter",physical:{meanRadiusKm:2410.3,massKg:10759e19,gmKm3S2:7179.29,rotationPeriodHours:400.536,axialTiltDeg:0,meanTemperatureK:134,colorHex:"#696057"},orbit:{semiMajorAxisKm:1882917904e-3,semiMajorAxisAU:.0125865288,eccentricity:.00707683,inclinationDeg:1.952455,longitudeAscendingNodeDeg:336.746982,argumentPeriapsisDeg:34.494869,meanAnomalyAtEpochDeg:126.955427,orbitalPeriodDays:16.6890184,epochJd:24613275e-1,meanMotionDegPerDay:21.57107095,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Ancient, intensely cratered ice-rock moon; lacks tidal resonance heating, preserving the most heavily cratered surface in the Solar System (including Valhalla impact basin)."},{id:"601",name:"Mimas",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:198.2,massKg:37493e15,rotationPeriodHours:22.6,colorHex:"#b2b2b2"},orbit:{semiMajorAxisKm:186034.255,semiMajorAxisAU:.0012435622,eccentricity:.0218639,inclinationDeg:28.47676,longitudeAscendingNodeDeg:172.727658,argumentPeriapsisDeg:169.377604,meanAnomalyAtEpochDeg:326.994857,orbitalPeriodDays:.942421959,epochJd:24613275e-1,meanMotionDegPerDay:381.994494676,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Dominated by the 130 km Herschel impact crater, giving it a distinctive Death Star appearance; clearing agent for the Cassini Division."},{id:"602",name:"Enceladus",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:252.1,massKg:10802e16,gmKm3S2:7.21,rotationPeriodHours:32.88,colorHex:"#ffffff"},orbit:{semiMajorAxisKm:238411.673,semiMajorAxisAU:.0015936836,eccentricity:.00513554,inclinationDeg:28.043619,longitudeAscendingNodeDeg:169.530888,argumentPeriapsisDeg:214.451065,meanAnomalyAtEpochDeg:62.261399,orbitalPeriodDays:1.370217855,epochJd:24613275e-1,meanMotionDegPerDay:262.731943454,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:'High-albedo icy world with active cryovolcanic geysers erupting water vapor, organic molecules, and ice crystals from south polar "tiger stripe" fractures.'},{id:"603",name:"Tethys",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:531,massKg:61745e16,rotationPeriodHours:45.31,colorHex:"#d8d8d8"},orbit:{semiMajorAxisKm:294976.454,semiMajorAxisAU:.0019717958,eccentricity:99726e-8,inclinationDeg:28.175586,longitudeAscendingNodeDeg:171.825733,argumentPeriapsisDeg:127.950883,meanAnomalyAtEpochDeg:2.809594,orbitalPeriodDays:1.88780216,epochJd:24613275e-1,meanMotionDegPerDay:190.697948984,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Low-density water-ice satellite featuring the vast Odysseus impact crater and the enormous Ithaca Chasma canyon system spanning 2,000 km."},{id:"604",name:"Dione",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:561.4,massKg:10955e17,rotationPeriodHours:65.69,colorHex:"#cac8c5"},orbit:{semiMajorAxisKm:377644.232,semiMajorAxisAU:.0025243958,eccentricity:.00265791,inclinationDeg:28.025672,longitudeAscendingNodeDeg:169.549925,argumentPeriapsisDeg:268.312567,meanAnomalyAtEpochDeg:329.102147,orbitalPeriodDays:2.736914742,epochJd:24613275e-1,meanMotionDegPerDay:131.534970555,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Icy moon displaying bright wispy ice cliffs (chasmata) formed by extensional tectonic fractures across its trailing hemisphere."},{id:"605",name:"Rhea",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:763.5,massKg:23065e17,rotationPeriodHours:108.43,colorHex:"#bbb8b4"},orbit:{semiMajorAxisKm:527244.268,semiMajorAxisAU:.0035244102,eccentricity:.00136693,inclinationDeg:28.274533,longitudeAscendingNodeDeg:169.967171,argumentPeriapsisDeg:166.661352,meanAnomalyAtEpochDeg:13.027101,orbitalPeriodDays:4.517500436,epochJd:24613275e-1,meanMotionDegPerDay:79.690086387,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Second-largest moon of Saturn; heavily cratered ice body with homogeneous interior composition and tenuous oxygen-carbon dioxide exosphere."},{id:"606",name:"Titan",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:2574.8,equatorialRadiusKm:2574.8,polarRadiusKm:2574.8,flattening:0,massKg:13452e19,gmKm3S2:8978.14,rotationPeriodHours:382.68,axialTiltDeg:0,meanTemperatureK:94,colorHex:"#e5a84b",atmosphere:{surfacePressureBar:1.45,composition:[{gas:"N2",percentage:95},{gas:"CH4",percentage:4.9}]}},orbit:{semiMajorAxisKm:1221971892e-3,semiMajorAxisAU:.0081683776,eccentricity:.02881004,inclinationDeg:27.705537,longitudeAscendingNodeDeg:169.080756,argumentPeriapsisDeg:178.340423,meanAnomalyAtEpochDeg:328.923552,orbitalPeriodDays:15.94542068,epochJd:24613275e-1,meanMotionDegPerDay:22.577014882,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Second-largest moon in the Solar System, enveloped by a dense nitrogen-methane atmosphere supporting active liquid methane/ethane lakes, rivers, and rain hydrologic cycles."},{id:"607",name:"Hyperion",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:135,massKg:56199e14,rotationPeriodHours:300,colorHex:"#9c8c7c"},orbit:{semiMajorAxisKm:1486933985e-3,semiMajorAxisAU:.0099395398,eccentricity:.09542499,inclinationDeg:27.056176,longitudeAscendingNodeDeg:169.549243,argumentPeriapsisDeg:67.294493,meanAnomalyAtEpochDeg:98.155885,orbitalPeriodDays:21.2766088,epochJd:24613275e-1,meanMotionDegPerDay:16.919989618,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Sponge-like irregularly shaped moon with low density (high porosity) undergoing non-repeating chaotic rotation influenced by Titan."},{id:"608",name:"Iapetus",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:734.3,massKg:18056e17,rotationPeriodHours:1903.92,colorHex:"#847970"},orbit:{semiMajorAxisKm:3565269983e-3,semiMajorAxisAU:.0238323578,eccentricity:.02970025,inclinationDeg:16.979231,longitudeAscendingNodeDeg:138.869009,argumentPeriapsisDeg:230.853136,meanAnomalyAtEpochDeg:320.152812,orbitalPeriodDays:79.3301825,epochJd:24613275e-1,meanMotionDegPerDay:4.537995359,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Two-tone world with extreme albedo dichotomy (pitch-black Cassini Regio leading hemisphere and brilliant ice trailing hemisphere), plus a towering 20 km equatorial ridge."},{id:"705",name:"Miranda",category:"moon",orderFromSun:7,parentId:"799",parentName:"Uranus",physical:{meanRadiusKm:235.8,massKg:659e17,rotationPeriodHours:33.91,colorHex:"#a0a0a0"},orbit:{semiMajorAxisKm:129871.122,semiMajorAxisAU:.0008681348,eccentricity:.0011248,inclinationDeg:97.989082,longitudeAscendingNodeDeg:163.186619,argumentPeriapsisDeg:67.391864,meanAnomalyAtEpochDeg:207.222114,orbitalPeriodDays:1.413479,epochJd:24613275e-1,meanMotionDegPerDay:254.690731168,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Exhibits extreme, chaotic terrain with gigantic tectonic rift grabens and chevron-shaped coronae, including Verona Rupes (tallest cliff in the Solar System at 20 km)."},{id:"701",name:"Ariel",category:"moon",orderFromSun:7,parentId:"799",parentName:"Uranus",physical:{meanRadiusKm:578.9,massKg:1251e18,rotationPeriodHours:60.48,colorHex:"#b4b4b4"},orbit:{semiMajorAxisKm:190944.721,semiMajorAxisAU:.0012763866,eccentricity:5326e-7,inclinationDeg:97.718049,longitudeAscendingNodeDeg:167.665855,argumentPeriapsisDeg:276.587566,meanAnomalyAtEpochDeg:51.205773,orbitalPeriodDays:2.520379,epochJd:24613275e-1,meanMotionDegPerDay:142.835660827,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Brightest moon of Uranus; dissected by extensive interconnected fault scarps, deep graben valleys, and cryovolcanic flows."},{id:"702",name:"Umbriel",category:"moon",orderFromSun:7,parentId:"799",parentName:"Uranus",physical:{meanRadiusKm:584.7,massKg:1275e18,rotationPeriodHours:99.46,colorHex:"#737373"},orbit:{semiMajorAxisKm:265988.581,semiMajorAxisAU:.0017780238,eccentricity:.00337264,inclinationDeg:97.714436,longitudeAscendingNodeDeg:167.725316,argumentPeriapsisDeg:66.275993,meanAnomalyAtEpochDeg:14.683581,orbitalPeriodDays:4.144177,epochJd:24613275e-1,meanMotionDegPerDay:86.868876498,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Darkest and most heavily cratered of Uranus’s large satellites, marked by the mysterious bright fluorescent ring floor of crater Wunda."},{id:"703",name:"Titania",category:"moon",orderFromSun:7,parentId:"799",parentName:"Uranus",physical:{meanRadiusKm:788.9,massKg:342e19,rotationPeriodHours:208.94,colorHex:"#9f9994"},orbit:{semiMajorAxisKm:436251.111,semiMajorAxisAU:.0029161586,eccentricity:.00197821,inclinationDeg:97.762135,longitudeAscendingNodeDeg:167.643651,argumentPeriapsisDeg:280.488041,meanAnomalyAtEpochDeg:236.26202,orbitalPeriodDays:8.705872,epochJd:24613275e-1,meanMotionDegPerDay:41.351400526,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Largest moon of Uranus; fractured by vast canyon systems (Messina Chasma) resulting from internal freezing and expansion of a primordial subsurface ocean."},{id:"704",name:"Oberon",category:"moon",orderFromSun:7,parentId:"799",parentName:"Uranus",physical:{meanRadiusKm:761.4,massKg:3014e18,rotationPeriodHours:323.11,colorHex:"#938c86"},orbit:{semiMajorAxisKm:583573.694,semiMajorAxisAU:.0039009492,eccentricity:.00243809,inclinationDeg:97.905711,longitudeAscendingNodeDeg:167.708289,argumentPeriapsisDeg:171.765242,meanAnomalyAtEpochDeg:34.68861,orbitalPeriodDays:13.463239,epochJd:24613275e-1,meanMotionDegPerDay:26.739479259,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Outermost major moon of Uranus; ancient heavily cratered ice-rock surface featuring prominent impact ray craters filled with dark carbonaceous deposits."},{id:"801",name:"Triton",category:"moon",orderFromSun:8,parentId:"899",parentName:"Neptune",physical:{meanRadiusKm:1352.6,massKg:2139e19,gmKm3S2:1427.6,rotationPeriodHours:-141.048,axialTiltDeg:0,meanTemperatureK:38,colorHex:"#e2cfc4"},orbit:{semiMajorAxisKm:354765.344,semiMajorAxisAU:.0023714598,eccentricity:10818e-8,inclinationDeg:129.126619,longitudeAscendingNodeDeg:222.868711,argumentPeriapsisDeg:109.713483,meanAnomalyAtEpochDeg:179.672821,orbitalPeriodDays:5.876854,epochJd:24613275e-1,meanMotionDegPerDay:61.257264516,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Captured Kuiper Belt dwarf planet orbiting Neptune in a retrograde direction; coldest measured surface in the Solar System (38 K) with nitrogen cryogeysers and cantaloupe terrain."},{id:"999",name:"Pluto",category:"dwarf_planet",orderFromSun:9,physical:{meanRadiusKm:1188.3,equatorialRadiusKm:1188.3,polarRadiusKm:1188.3,flattening:0,massKg:1303e19,gmKm3S2:869.6,rotationPeriodHours:-153.2928,axialTiltDeg:122.53,meanTemperatureK:44,colorHex:"#c79f82"},orbit:{semiMajorAxisKm:5922374660,semiMajorAxisAU:39.5886293852,eccentricity:.2518378779,inclinationDeg:17.14771141,longitudeAscendingNodeDeg:110.29238405,argumentPeriapsisDeg:113.70900152,meanAnomalyAtEpochDeg:38.68366347,orbitalPeriodDays:90981.716,epochJd:24575885e-1,meanMotionDegPerDay:.003956838956,source:"JPL SBDB osculating elements"},description:'Largest known Kuiper Belt dwarf planet; features the high-albedo nitrogen-ice glacier Sputnik Planitia (the "Heart"), water-ice mountains, and blue atmospheric haze.'},{id:"901",name:"Charon",category:"moon",orderFromSun:9,parentId:"999",parentName:"Pluto",physical:{meanRadiusKm:606,massKg:1586e18,rotationPeriodHours:153.29,colorHex:"#99948e"},orbit:{semiMajorAxisKm:19595.763,semiMajorAxisAU:.0001309896,eccentricity:16098e-8,inclinationDeg:112.887772,longitudeAscendingNodeDeg:227.393077,argumentPeriapsisDeg:172.262887,meanAnomalyAtEpochDeg:355.44348,orbitalPeriodDays:6.3872304,epochJd:24613275e-1,meanMotionDegPerDay:56.362457193,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Mutually tidally locked binary companion to Pluto; features a dark reddish tholin polar hood (Mordor Macula) and massive equatorial tectonic chasms."},{id:"1",name:"Ceres",category:"dwarf_planet",orderFromSun:4.5,physical:{meanRadiusKm:469.7,equatorialRadiusKm:487.3,polarRadiusKm:446,flattening:.0847,massKg:93835e16,gmKm3S2:62.63,rotationPeriodHours:9.074,axialTiltDeg:4,meanTemperatureK:168,colorHex:"#88847e"},orbit:{semiMajorAxisKm:4137207795e-1,semiMajorAxisAU:2.765552595,eccentricity:.0796922951,inclinationDeg:10.5880278,longitudeAscendingNodeDeg:80.24862682,argumentPeriapsisDeg:73.29421453,meanAnomalyAtEpochDeg:274.41934638,orbitalPeriodDays:1679.853,epochJd:24612005e-1,meanMotionDegPerDay:.214304450648,source:"JPL SBDB osculating elements"},description:"Largest body in the asteroid belt, comprising ~33% of its total mass; differentiated protoplanet with an ice-rich mantle and bright sodium-carbonate salt spots (Cerealia Facula in Occator Crater)."},{id:"4",name:"Vesta",category:"asteroid",orderFromSun:4.3,physical:{meanRadiusKm:261.4,equatorialRadiusKm:286.3,polarRadiusKm:229,flattening:.2,massKg:259e18,rotationPeriodHours:5.342,axialTiltDeg:29,colorHex:"#a39b91"},orbit:{semiMajorAxisKm:3532553203e-1,semiMajorAxisAU:2.3613659651,eccentricity:.0902037438,inclinationDeg:7.14392555,longitudeAscendingNodeDeg:103.70129327,argumentPeriapsisDeg:151.46864782,meanAnomalyAtEpochDeg:81.19015608,orbitalPeriodDays:1325.389,epochJd:24612005e-1,meanMotionDegPerDay:.27161836136,source:"JPL SBDB osculating elements"},description:"Brightest asteroid visible from Earth; preserved basaltic differentiated protoplanet with metallic core, silicate mantle, and enormous south-polar impact crater Rheasilvia."},{id:"2",name:"Pallas",category:"asteroid",orderFromSun:4.6,physical:{meanRadiusKm:256.5,massKg:205e18,rotationPeriodHours:7.813,axialTiltDeg:84,colorHex:"#827f7a"},orbit:{semiMajorAxisKm:4143201308e-1,semiMajorAxisAU:2.7695590107,eccentricity:.2307000996,inclinationDeg:34.93279322,longitudeAscendingNodeDeg:172.88661934,argumentPeriapsisDeg:310.96991617,meanAnomalyAtEpochDeg:254.24965217,orbitalPeriodDays:1683.505,epochJd:24612005e-1,meanMotionDegPerDay:.213839602925,source:"JPL SBDB osculating elements"},description:"Third-largest asteroid in the belt; notable for its unusually high 34.8° orbital inclination and dynamic golf-ball-like surface topography."},{id:"10",name:"Hygiea",category:"asteroid",orderFromSun:4.8,physical:{meanRadiusKm:203.6,massKg:832e17,rotationPeriodHours:13.825,colorHex:"#605c57"},orbit:{semiMajorAxisKm:4713790061e-1,semiMajorAxisAU:3.150974034,eccentricity:.1067092741,inclinationDeg:3.82952995,longitudeAscendingNodeDeg:283.11989275,argumentPeriapsisDeg:312.42423873,meanAnomalyAtEpochDeg:252.03442424,orbitalPeriodDays:2042.987,epochJd:24612005e-1,meanMotionDegPerDay:.176212550579,source:"JPL SBDB osculating elements"},description:"Fourth-largest asteroid and major carbonaceous C-type asteroid; nearly spherical body likely formed from a catastrophic impact parent-body disruption."},{id:"16",name:"Psyche",category:"asteroid",orderFromSun:4.7,physical:{meanRadiusKm:111,massKg:229e17,rotationPeriodHours:4.196,axialTiltDeg:95,colorHex:"#b8aba0"},orbit:{semiMajorAxisKm:437681552,semiMajorAxisAU:2.9257204665,eccentricity:.1349324738,inclinationDeg:3.09874912,longitudeAscendingNodeDeg:149.97538593,argumentPeriapsisDeg:230.03267827,meanAnomalyAtEpochDeg:79.76939505,orbitalPeriodDays:1827.88,epochJd:24612005e-1,meanMotionDegPerDay:.196949475811,source:"JPL SBDB osculating elements"},description:"Enormous metallic M-type asteroid thought to be the exposed nickel-iron core of an early protoplanet stripped by hit-and-run collisions; target of NASA’s Psyche mission."},{id:"433",name:"Eros",category:"asteroid",orderFromSun:3.5,physical:{meanRadiusKm:8.42,massKg:6687e12,rotationPeriodHours:5.27,colorHex:"#998d7f"},orbit:{semiMajorAxisKm:218150155,semiMajorAxisAU:1.4582437168,eccentricity:.2228779628,inclinationDeg:10.8285441,longitudeAscendingNodeDeg:304.26797134,argumentPeriapsisDeg:178.91813191,meanAnomalyAtEpochDeg:62.51145502,orbitalPeriodDays:643.196,epochJd:24612005e-1,meanMotionDegPerDay:.559704634704,source:"JPL SBDB osculating elements"},description:"Elongated peanut-shaped S-type near-Earth asteroid; historic target orbited and landed upon by the NEAR Shoemaker spacecraft in 2001."},{id:"951",name:"Gaspra",category:"asteroid",orderFromSun:4.1,physical:{meanRadiusKm:6.1,massKg:2e16,rotationPeriodHours:7.042,colorHex:"#a09485"},orbit:{semiMajorAxisKm:330608056,semiMajorAxisAU:2.2099783537,eccentricity:.1737374595,inclinationDeg:4.10465497,longitudeAscendingNodeDeg:252.96729133,argumentPeriapsisDeg:130.00376374,meanAnomalyAtEpochDeg:112.95087164,orbitalPeriodDays:1199.998,epochJd:24612005e-1,meanMotionDegPerDay:.300000545277,source:"JPL SBDB osculating elements"},description:"First asteroid ever visited by a spacecraft (Galileo flyby in 1991); irregular S-type asteroid with prominent groove-like depressions."},{id:"243",name:"Ida",category:"asteroid",orderFromSun:4.6,physical:{meanRadiusKm:15.7,massKg:42e15,rotationPeriodHours:4.634,colorHex:"#9c9284"},orbit:{semiMajorAxisKm:4283507686e-1,semiMajorAxisAU:2.8633480317,eccentricity:.046109628,inclinationDeg:1.13036309,longitudeAscendingNodeDeg:323.53666094,argumentPeriapsisDeg:113.25718268,meanAnomalyAtEpochDeg:49.64769088,orbitalPeriodDays:1769.741,epochJd:24612005e-1,meanMotionDegPerDay:.20341963288,source:"JPL SBDB osculating elements"},description:"Coronis-family asteroid visited by Galileo in 1993, famous for the historic discovery of Dactyl, the first recognized asteroid moon."},{id:"101955",name:"Bennu",category:"asteroid",orderFromSun:3.2,physical:{meanRadiusKm:.242,massKg:7329e7,rotationPeriodHours:4.296,colorHex:"#3a3a3a"},orbit:{semiMajorAxisKm:168505699,semiMajorAxisAU:1.1263910259,eccentricity:.2037450762,inclinationDeg:6.03494377,longitudeAscendingNodeDeg:2.0608662,argumentPeriapsisDeg:66.22306084,meanAnomalyAtEpochDeg:101.703952,orbitalPeriodDays:436.649,epochJd:24555625e-1,meanMotionDegPerDay:.824461350332,source:"JPL SBDB osculating elements"},description:"Diamond-shaped carbonaceous rubble-pile near-Earth asteroid sampled by NASA’s OSIRIS-REx spacecraft, delivering pristine solar nebula samples to Earth in 2023."},{id:"162173",name:"Ryugu",category:"asteroid",orderFromSun:3.3,physical:{meanRadiusKm:.448,massKg:45e10,rotationPeriodHours:7.632,colorHex:"#353535"},orbit:{semiMajorAxisKm:1781589365e-1,semiMajorAxisAU:1.1909189327,eccentricity:.1910730046,inclinationDeg:5.86644249,longitudeAscendingNodeDeg:251.2897124,argumentPeriapsisDeg:211.60899381,meanAnomalyAtEpochDeg:62.34067409,orbitalPeriodDays:474.703,epochJd:24612005e-1,meanMotionDegPerDay:.758369353853,source:"JPL SBDB osculating elements"},description:"Spinning-top shaped Cb-type near-Earth asteroid sampled by JAXA’s Hayabusa2 spacecraft, rich in water-bearing minerals and prebiotic amino acids."}],Mt=[...Ni,...ki],Pe={id:"SGR_A_STAR",name:"Sagittarius A*",category:"black_hole",orderFromSun:999,physical:{meanRadiusKm:12690400,equatorialRadiusKm:32971e3,polarRadiusKm:12690400,flattening:0,massKg:8544455e30,gmKm3S2:570283e12,rotationPeriodHours:.18,axialTiltDeg:42,meanTemperatureK:1e7,colorHex:"#ffaa33"},orbit:{semiMajorAxisKm:2554e14,semiMajorAxisAU:1707e6,eccentricity:0,inclinationDeg:60.19,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:0,orbitalPeriodDays:23e7*365.25},description:"Supermassive black hole at the gravitational center of the Milky Way galaxy (mass 4.3 million solar masses, distance 27,000 ly). Demonstrates extreme relativistic light bending, an apparent gravitational shadow, a photon sphere, and a glowing synchrotron accretion disk."},he=class he{static getSagittariusAStar(){return Pe}static getAllBodies(){return this.bodies}static getBody(e){return this.bodiesById.get(e)||this.bodiesByName.get(e.toLowerCase())}static getParent(e){if(e.parentId)return this.bodiesById.get(e.parentId)}static getMoonsOf(e){const t=this.getBody(e);return t?this.moonsByParentId.get(t.id)||[]:[]}static getByCategory(e){return this.bodies.filter(t=>t.category===e)}static getPlanets(){return this.getByCategory("planet")}static getMoons(){return this.getByCategory("moon")}static getDwarfPlanets(){return this.getByCategory("dwarf_planet")}static getAsteroids(){return this.getByCategory("asteroid")}static search(e){const t=e.trim().toLowerCase();return t?this.bodies.filter(i=>i.name.toLowerCase().includes(t)||i.category.toLowerCase().includes(t)||i.parentName&&i.parentName.toLowerCase().includes(t)||i.description.toLowerCase().includes(t)):this.bodies}static getStats(){return{total:this.bodies.length,stars:this.getByCategory("star").length,planets:this.getPlanets().length,moons:this.getMoons().length,dwarfPlanets:this.getDwarfPlanets().length,asteroids:this.getAsteroids().length}}};u(he,"bodies",Mt),u(he,"bodiesById",new Map([...Mt.map(e=>[e.id,e]),[Pe.id,Pe]])),u(he,"bodiesByName",new Map([...Mt.map(e=>[e.name.toLowerCase(),e]),["sagittarius a*",Pe],["sgr a*",Pe],["sgr a",Pe],["black hole",Pe]])),u(he,"moonsByParentId",new Map),(()=>{for(const e of he.bodies)e.parentId&&(he.moonsByParentId.has(e.parentId)||he.moonsByParentId.set(e.parentId,[]),he.moonsByParentId.get(e.parentId).push(e))})();let q=he;class Be{static getTexture(e){if(this.cache.has(e))return this.cache.get(e);let t;switch(e){case"Sun":t=this.createSunTexture();break;case"Mercury":t=this.createMercuryTexture();break;case"Venus":t=this.createVenusTexture();break;case"Earth":t=this.createEarthTexture();break;case"EarthClouds":t=this.createEarthCloudsTexture();break;case"Mars":t=this.createMarsTexture();break;case"Jupiter":t=this.createJupiterTexture();break;case"Saturn":t=this.createSaturnTexture();break;case"SaturnRings":t=this.createSaturnRingsTexture();break;case"Uranus":t=this.createUranusTexture();break;case"Neptune":t=this.createNeptuneTexture();break;case"Moon":t=this.createMoonTexture();break;case"Io":t=this.createIoTexture();break;case"Europa":t=this.createEuropaTexture();break;case"Ganymede":t=this.createGanymedeTexture();break;case"Callisto":t=this.createCallistoTexture();break;case"Titan":t=this.createTitanTexture();break;case"Enceladus":t=this.createEnceladusTexture();break;case"Triton":t=this.createTritonTexture();break;case"Pluto":t=this.createPlutoTexture();break;case"Ceres":t=this.createCeresTexture();break;default:t=this.createRockyCrateredTexture(e)}return this.cache.set(e,t),t}static createSunTexture(){const i=document.createElement("canvas");i.width=1024,i.height=512;const a=i.getContext("2d"),s=a.createLinearGradient(0,0,0,512);s.addColorStop(0,"#fff4cc"),s.addColorStop(.5,"#ffbb33"),s.addColorStop(1,"#ff8800"),a.fillStyle=s,a.fillRect(0,0,1024,512);const o=a.getImageData(0,0,1024,512),r=o.data;for(let l=0;l<r.length;l+=4){const h=l/4%1024,m=Math.floor(l/4/1024),p=Math.sin(h*.05)*Math.cos(m*.05),g=Math.sin(h*.12+1.2)*Math.cos(m*.12+.8),v=Math.sin(h*.25)*Math.sin(m*.25),y=p*.5+g*.3+v*.2;r[l]=Math.min(255,Math.max(180,245+y*35)),r[l+1]=Math.min(240,Math.max(120,180+y*55)),r[l+2]=Math.min(180,Math.max(20,60+y*40)),r[l+3]=255}a.putImageData(o,0,0),a.fillStyle="rgba(120, 30, 0, 0.6)";for(let l=0;l<12;l++){const h=(l*85+40)%1024,m=160+l*37%180,p=6+l%5*3;a.beginPath(),a.arc(h,m,p,0,Math.PI*2),a.fill(),a.fillStyle="rgba(60, 10, 0, 0.85)",a.beginPath(),a.arc(h,m,p*.45,0,Math.PI*2),a.fill()}const n=new _(i);return n.wrapS=G,n.wrapT=L,n}static createMercuryTexture(){const i=document.createElement("canvas");i.width=1024,i.height=512;const a=i.getContext("2d");a.fillStyle="#78736d",a.fillRect(0,0,1024,512);const s=a.getImageData(0,0,1024,512),o=s.data;for(let n=0;n<o.length;n+=4){const l=n/4%1024,h=Math.floor(n/4/1024),p=120+(Math.sin(l*.08)*Math.cos(h*.08)+Math.sin(l*.2)*Math.sin(h*.2))*18;o[n]=p*.95,o[n+1]=p*.93,o[n+2]=p*.9,o[n+3]=255}a.putImageData(s,0,0);for(let n=0;n<120;n++){const l=(n*79+33)%1024,h=20+n*47%472,m=4+n%15*2;a.fillStyle="rgba(40, 38, 36, 0.4)",a.beginPath(),a.arc(l,h,m,0,Math.PI*2),a.fill(),a.strokeStyle="rgba(210, 205, 200, 0.35)",a.lineWidth=1.5,a.beginPath(),a.arc(l,h,m,Math.PI*.8,Math.PI*1.8),a.stroke()}const r=new _(i);return r.wrapS=G,r.wrapT=L,r}static createVenusTexture(){const i=document.createElement("canvas");i.width=1024,i.height=512;const a=i.getContext("2d"),s=a.createLinearGradient(0,0,0,512);s.addColorStop(0,"#f0d8a8"),s.addColorStop(.2,"#ecd096"),s.addColorStop(.5,"#e5c483"),s.addColorStop(.8,"#ecd096"),s.addColorStop(1,"#f0d8a8"),a.fillStyle=s,a.fillRect(0,0,1024,512),a.fillStyle="rgba(215, 180, 110, 0.25)";for(let r=0;r<18;r++){const n=r*28.444444444444443;a.beginPath(),a.moveTo(0,n);for(let l=0;l<=1024;l+=30){const h=Math.sin(l*.015+r)*12+Math.cos(l*.03)*6;a.lineTo(l,n+h)}a.lineTo(1024,n+20),a.lineTo(0,n+20),a.closePath(),a.fill()}const o=new _(i);return o.wrapS=G,o.wrapT=L,o}static createEarthTexture(){const i=document.createElement("canvas");i.width=1024,i.height=512;const a=i.getContext("2d");a.fillStyle="#0f274a",a.fillRect(0,0,1024,512);const s=a.createLinearGradient(0,0,0,512);s.addColorStop(0,"rgba(25, 65, 115, 0.4)"),s.addColorStop(.5,"rgba(10, 35, 75, 0.1)"),s.addColorStop(1,"rgba(25, 65, 115, 0.4)"),a.fillStyle=s,a.fillRect(0,0,1024,512),a.fillStyle="#2d5930",a.beginPath(),a.ellipse(1024*.58,512*.38,140,85,.1,0,Math.PI*2),a.ellipse(1024*.53,512*.62,70,95,-.15,0,Math.PI*2),a.fill(),a.beginPath(),a.ellipse(1024*.22,512*.32,95,75,-.2,0,Math.PI*2),a.ellipse(1024*.3,512*.65,60,90,.25,0,Math.PI*2),a.fill(),a.beginPath(),a.ellipse(1024*.82,512*.72,45,35,.1,0,Math.PI*2),a.fill(),a.fillStyle="#9e8548",a.beginPath(),a.ellipse(1024*.52,512*.45,65,30,0,0,Math.PI*2),a.ellipse(1024*.82,512*.72,28,20,0,0,Math.PI*2),a.fill(),a.fillStyle="#f0f6ff",a.beginPath(),a.rect(0,0,1024,28),a.fill(),a.beginPath(),a.rect(0,476,1024,36),a.fill();const o=new _(i);return o.wrapS=G,o.wrapT=L,o}static createEarthCloudsTexture(){const i=document.createElement("canvas");i.width=1024,i.height=512;const a=i.getContext("2d");a.clearRect(0,0,1024,512),a.fillStyle="rgba(255, 255, 255, 0.75)";for(let o=0;o<28;o++){const r=(o*65+15)%1024,n=60+o*42%392,l=55+o%7*15,h=18+o%4*6;a.beginPath(),a.ellipse(r,n,l,h,o%5*.2,0,Math.PI*2),a.fill()}const s=new _(i);return s.wrapS=G,s.wrapT=L,s}static createMarsTexture(){const i=document.createElement("canvas");i.width=1024,i.height=512;const a=i.getContext("2d");a.fillStyle="#bd532b",a.fillRect(0,0,1024,512),a.fillStyle="rgba(68, 38, 25, 0.45)",a.beginPath(),a.ellipse(1024*.45,512*.52,90,45,.2,0,Math.PI*2),a.ellipse(1024*.75,512*.42,70,50,-.1,0,Math.PI*2),a.ellipse(1024*.15,512*.58,60,35,.15,0,Math.PI*2),a.fill(),a.fillStyle="rgba(165, 80, 45, 0.8)",a.beginPath(),a.arc(1024*.28,512*.45,24,0,Math.PI*2),a.fill(),a.fillStyle="#3a2015",a.beginPath(),a.arc(1024*.28,512*.45,6,0,Math.PI*2),a.fill(),a.fillStyle="#f8f4f0",a.beginPath(),a.ellipse(1024*.5,12,110,12,0,0,Math.PI*2),a.fill(),a.beginPath(),a.ellipse(1024*.5,498,85,14,0,0,Math.PI*2),a.fill();const s=new _(i);return s.wrapS=G,s.wrapT=L,s}static createJupiterTexture(){const i=document.createElement("canvas");i.width=1024,i.height=512;const a=i.getContext("2d"),s=["#a88460","#dec8aa","#8f5c35","#f2e2ce","#9e673d","#ebd5be","#82522e","#f5e8da","#916139","#e6cfb8"],o=512/s.length;for(let m=0;m<s.length;m++)a.fillStyle=s[m],a.fillRect(0,m*o,1024,o);for(let m=0;m<s.length;m++){const p=m*o;a.fillStyle=m%2===0?"rgba(80, 45, 20, 0.35)":"rgba(255, 245, 235, 0.35)",a.beginPath(),a.moveTo(0,p);for(let g=0;g<=1024;g+=25){const v=Math.sin(g*.03+m*2)*5+Math.cos(g*.08)*3;a.lineTo(g,p+v)}a.lineTo(1024,p+o*.5),a.lineTo(0,p+o*.5),a.closePath(),a.fill()}const r=1024*.65,n=512*.62,l=a.createRadialGradient(r,n,5,r,n,32);l.addColorStop(0,"#c43d22"),l.addColorStop(.6,"#b5482e"),l.addColorStop(1,"#8f5c35"),a.fillStyle=l,a.beginPath(),a.ellipse(r,n,36,20,-.08,0,Math.PI*2),a.fill(),a.strokeStyle="rgba(255, 255, 255, 0.5)",a.lineWidth=2.5,a.beginPath(),a.ellipse(r+45,n-4,18,9,.1,0,Math.PI*2),a.stroke();const h=new _(i);return h.wrapS=G,h.wrapT=L,h}static createSaturnTexture(){const i=document.createElement("canvas");i.width=1024,i.height=512;const a=i.getContext("2d"),s=a.createLinearGradient(0,0,0,512);s.addColorStop(0,"#757c6b"),s.addColorStop(.2,"#ccb98d"),s.addColorStop(.4,"#e8dcba"),s.addColorStop(.5,"#f4ebd2"),s.addColorStop(.6,"#e8dcba"),s.addColorStop(.8,"#ccb98d"),s.addColorStop(1,"#80806a"),a.fillStyle=s,a.fillRect(0,0,1024,512);for(let r=0;r<30;r++){const n=r/30*512;a.fillStyle=r%2===0?"rgba(120, 100, 70, 0.08)":"rgba(255, 250, 240, 0.08)",a.fillRect(0,n,1024,512/30)}const o=new _(i);return o.wrapS=G,o.wrapT=L,o}static createSaturnRingsTexture(){const i=document.createElement("canvas");i.width=1024,i.height=64;const a=i.getContext("2d");a.clearRect(0,0,1024,64);const s=a.createLinearGradient(0,0,1024,0);s.addColorStop(0,"rgba(140, 130, 115, 0.0)"),s.addColorStop(.05,"rgba(150, 140, 125, 0.25)"),s.addColorStop(.18,"rgba(160, 150, 130, 0.35)"),s.addColorStop(.2,"rgba(225, 215, 185, 0.85)"),s.addColorStop(.35,"rgba(240, 230, 205, 0.95)"),s.addColorStop(.55,"rgba(230, 220, 195, 0.90)"),s.addColorStop(.57,"rgba(40, 35, 30, 0.02)"),s.addColorStop(.63,"rgba(40, 35, 30, 0.02)"),s.addColorStop(.65,"rgba(215, 205, 180, 0.75)"),s.addColorStop(.8,"rgba(225, 215, 190, 0.80)"),s.addColorStop(.83,"rgba(40, 35, 30, 0.05)"),s.addColorStop(.85,"rgba(220, 210, 185, 0.70)"),s.addColorStop(.95,"rgba(180, 170, 150, 0.35)"),s.addColorStop(1,"rgba(140, 130, 115, 0.0)"),a.fillStyle=s,a.fillRect(0,0,1024,64);const o=new _(i);return o.wrapS=L,o.wrapT=L,o}static createUranusTexture(){const i=document.createElement("canvas");i.width=512,i.height=256;const a=i.getContext("2d"),s=a.createLinearGradient(0,0,0,256);return s.addColorStop(0,"#75c8d6"),s.addColorStop(.5,"#8ee0ed"),s.addColorStop(1,"#75c8d6"),a.fillStyle=s,a.fillRect(0,0,512,256),new _(i)}static createNeptuneTexture(){const i=document.createElement("canvas");i.width=1024,i.height=512;const a=i.getContext("2d"),s=a.createLinearGradient(0,0,0,512);s.addColorStop(0,"#2d4aa0"),s.addColorStop(.3,"#3a62cb"),s.addColorStop(.5,"#4a75e6"),s.addColorStop(.7,"#3a62cb"),s.addColorStop(1,"#2d4aa0"),a.fillStyle=s,a.fillRect(0,0,1024,512),a.fillStyle="rgba(25, 40, 110, 0.35)",a.fillRect(0,512*.55,1024,40),a.fillStyle="#1b2c75",a.beginPath(),a.ellipse(1024*.45,512*.58,45,24,0,0,Math.PI*2),a.fill(),a.fillStyle="rgba(235, 245, 255, 0.8)",a.beginPath(),a.ellipse(1024*.45+50,512*.58-10,22,6,.1,0,Math.PI*2),a.fill();const o=new _(i);return o.wrapS=G,o.wrapT=L,o}static createMoonTexture(){const i=document.createElement("canvas");i.width=512,i.height=256;const a=i.getContext("2d");a.fillStyle="#aba8a2",a.fillRect(0,0,512,256);const s=a.getImageData(0,0,512,256),o=s.data;for(let l=0;l<o.length;l+=4){const h=(Math.random()-.5)*24;o[l]=Math.max(0,Math.min(255,o[l]+h)),o[l+1]=Math.max(0,Math.min(255,o[l+1]+h)),o[l+2]=Math.max(0,Math.min(255,o[l+2]+h))}a.putImageData(s,0,0);const r=[{x:512*.35,y:256*.35,rx:55,ry:45,color:"#4a4844"},{x:512*.48,y:256*.38,rx:35,ry:30,color:"#4d4a46"},{x:512*.55,y:256*.48,rx:40,ry:32,color:"#494743"},{x:512*.22,y:256*.42,rx:65,ry:60,color:"#52504b"},{x:512*.42,y:256*.55,rx:38,ry:28,color:"#4b4844"},{x:512*.65,y:256*.45,rx:30,ry:25,color:"#504d49"}];for(const l of r){const h=a.createRadialGradient(l.x,l.y,5,l.x,l.y,l.rx);h.addColorStop(0,l.color),h.addColorStop(.85,l.color),h.addColorStop(1,"rgba(171, 168, 162, 0)"),a.fillStyle=h,a.beginPath(),a.ellipse(l.x,l.y,l.rx,l.ry,0,0,Math.PI*2),a.fill()}a.fillStyle="#ffffff",a.beginPath(),a.arc(512*.42,256*.72,4,0,Math.PI*2),a.fill(),a.strokeStyle="rgba(255, 255, 255, 0.25)",a.lineWidth=1;for(let l=0;l<Math.PI*2;l+=.35)a.beginPath(),a.moveTo(512*.42,256*.72),a.lineTo(512*.42+Math.cos(l)*75,256*.72+Math.sin(l)*75),a.stroke();const n=new _(i);return n.wrapS=G,n.wrapT=L,n}static createIoTexture(){const i=document.createElement("canvas");i.width=512,i.height=256;const a=i.getContext("2d");a.fillStyle="#e5c158",a.fillRect(0,0,512,256);for(let r=0;r<40;r++){const n=Math.random()*512,l=Math.random()*256,h=10+Math.random()*25;a.fillStyle=Math.random()>.5?"rgba(215, 140, 30, 0.45)":"rgba(245, 230, 150, 0.4)",a.beginPath(),a.arc(n,l,h,0,Math.PI*2),a.fill()}const s=[{x:512*.25,y:256*.45,r:10,color:"#7a1800"},{x:512*.65,y:256*.35,r:14,color:"#2b1005"},{x:512*.45,y:256*.6,r:8,color:"#8c2505"},{x:512*.8,y:256*.55,r:11,color:"#541505"},{x:512*.15,y:256*.7,r:7,color:"#882200"}];for(const r of s)a.strokeStyle="rgba(200, 50, 0, 0.6)",a.lineWidth=3,a.beginPath(),a.arc(r.x,r.y,r.r*2.2,0,Math.PI*2),a.stroke(),a.fillStyle=r.color,a.beginPath(),a.arc(r.x,r.y,r.r,0,Math.PI*2),a.fill();const o=new _(i);return o.wrapS=G,o.wrapT=L,o}static createEuropaTexture(){const i=document.createElement("canvas");i.width=1024,i.height=512;const a=i.getContext("2d");a.fillStyle="#f4f6fa",a.fillRect(0,0,1024,512);const s=a.createLinearGradient(0,0,0,512*.25);s.addColorStop(0,"rgba(230, 240, 250, 0.6)"),s.addColorStop(1,"rgba(244, 246, 250, 0.0)"),a.fillStyle=s,a.fillRect(0,0,1024,512*.25);const o=a.createLinearGradient(0,512,0,512*.75);o.addColorStop(0,"rgba(230, 240, 250, 0.6)"),o.addColorStop(1,"rgba(244, 246, 250, 0.0)"),a.fillStyle=o,a.fillRect(0,512*.75,1024,512*.25);for(let m=0;m<35;m++){const p=m*37%1024,g=512*.3+m*29%(512*.4),v=25+m%5*12,y=a.createRadialGradient(p,g,2,p,g,v);y.addColorStop(0,"rgba(225, 232, 240, 0.25)"),y.addColorStop(1,"rgba(244, 246, 250, 0.0)"),a.fillStyle=y,a.beginPath(),a.arc(p,g,v,0,Math.PI*2),a.fill()}const r=[{x:1024*.28,y:512*.45,rx:42,ry:28},{x:1024*.62,y:512*.52,rx:36,ry:24},{x:1024*.45,y:512*.35,rx:30,ry:20},{x:1024*.82,y:512*.42,rx:38,ry:25}];for(const m of r){const p=a.createRadialGradient(m.x,m.y,5,m.x,m.y,m.rx);p.addColorStop(0,"rgba(175, 135, 105, 0.16)"),p.addColorStop(.7,"rgba(160, 125, 98, 0.10)"),p.addColorStop(1,"rgba(244, 246, 250, 0.0)"),a.fillStyle=p,a.beginPath(),a.ellipse(m.x,m.y,m.rx,m.ry,.2,0,Math.PI*2),a.fill()}let n=42;const l=()=>(n=n*16807%2147483647,(n-1)/2147483646);for(let m=0;m<32;m++){const p=l()*1024,g=512*.15+l()*512*.7,v=80+l()*160,y=(l()-.5)*Math.PI*1.4,M=p+Math.cos(y)*(v*.5)+(l()-.5)*40,x=g+Math.sin(y)*(v*.5)+(l()-.5)*40,b=p+Math.cos(y)*v,A=g+Math.sin(y)*v;a.strokeStyle="rgba(155, 115, 90, 0.14)",a.lineWidth=4,a.beginPath(),a.moveTo(p,g),a.quadraticCurveTo(M,x,b,A),a.stroke(),a.strokeStyle="rgba(115, 80, 65, 0.45)",a.lineWidth=1.2,a.beginPath(),a.moveTo(p,g),a.quadraticCurveTo(M,x,b,A),a.stroke(),a.strokeStyle="rgba(255, 255, 255, 0.55)",a.lineWidth=.8,a.beginPath(),a.moveTo(p+1,g+1),a.quadraticCurveTo(M+1,x+1,b+1,A+1),a.stroke()}a.strokeStyle="rgba(130, 95, 78, 0.22)",a.lineWidth=.7;for(let m=0;m<50;m++){const p=l()*1024,g=l()*512,v=30+l()*60,y=l()*Math.PI*2;a.beginPath(),a.moveTo(p,g),a.lineTo(p+Math.cos(y)*v,g+Math.sin(y)*v),a.stroke()}const h=new _(i);return h.wrapS=G,h.wrapT=L,h}static createGanymedeTexture(){const i=document.createElement("canvas");i.width=512,i.height=256;const a=i.getContext("2d");a.fillStyle="#6e655c",a.fillRect(0,0,512,256),a.fillStyle="#9c9288";for(let o=0;o<14;o++){const r=(o*20+10)%256;a.fillRect(0,r,512,8+o%4*3)}a.strokeStyle="rgba(230, 230, 230, 0.35)",a.lineWidth=1;for(let o=0;o<256;o+=6)a.beginPath(),a.moveTo(0,o),a.lineTo(512,o+Math.sin(o*.1)*8),a.stroke();const s=new _(i);return s.wrapS=G,s.wrapT=L,s}static createCallistoTexture(){const i=document.createElement("canvas");i.width=512,i.height=256;const a=i.getContext("2d");a.fillStyle="#4e4741",a.fillRect(0,0,512,256);for(let n=0;n<180;n++){const l=Math.random()*512,h=Math.random()*256,m=2+Math.random()*8;a.fillStyle="#2f2a26",a.beginPath(),a.arc(l,h,m,0,Math.PI*2),a.fill(),a.strokeStyle="rgba(220, 225, 235, 0.7)",a.lineWidth=1,a.beginPath(),a.arc(l,h,m,0,Math.PI),a.stroke()}const s=512*.45,o=256*.4;a.strokeStyle="rgba(200, 210, 220, 0.4)";for(let n=8;n<=55;n+=7)a.beginPath(),a.arc(s,o,n,0,Math.PI*2),a.stroke();const r=new _(i);return r.wrapS=G,r.wrapT=L,r}static createTitanTexture(){const i=document.createElement("canvas");i.width=512,i.height=256;const a=i.getContext("2d"),s=a.createLinearGradient(0,0,0,256);s.addColorStop(0,"#c78028"),s.addColorStop(.2,"#dba046"),s.addColorStop(.5,"#e8b258"),s.addColorStop(.8,"#dba046"),s.addColorStop(1,"#c07820"),a.fillStyle=s,a.fillRect(0,0,512,256),a.fillStyle="rgba(210, 130, 40, 0.2)",a.fillRect(0,256*.35,512,25),a.fillRect(0,256*.6,512,25);const o=new _(i);return o.wrapS=G,o.wrapT=L,o}static createEnceladusTexture(){const i=document.createElement("canvas");i.width=512,i.height=256;const a=i.getContext("2d");a.fillStyle="#f6f8fb",a.fillRect(0,0,512,256),a.strokeStyle="#68a0c8",a.lineWidth=2;for(let o=0;o<4;o++){const r=217.6+o*5;a.beginPath(),a.moveTo(512*.3,r),a.bezierCurveTo(512*.45,r+4,512*.55,r-4,512*.7,r),a.stroke()}const s=new _(i);return s.wrapS=G,s.wrapT=L,s}static createTritonTexture(){const i=document.createElement("canvas");i.width=512,i.height=256;const a=i.getContext("2d");a.fillStyle="#decac0",a.fillRect(0,0,512,256),a.fillStyle="rgba(165, 135, 125, 0.35)";for(let o=10;o<512;o+=16)for(let r=10;r<256*.6;r+=14)a.beginPath(),a.arc(o+r%8,r,5,0,Math.PI*2),a.fill();a.fillStyle="rgba(50, 40, 35, 0.6)";for(let o=0;o<8;o++){const r=102.4+o*45,n=256*.75+o%3*8;a.beginPath(),a.ellipse(r,n,12,3,.4,0,Math.PI*2),a.fill()}const s=new _(i);return s.wrapS=G,s.wrapT=L,s}static createPlutoTexture(){const i=document.createElement("canvas");i.width=512,i.height=256;const a=i.getContext("2d");a.fillStyle="#8f4f35",a.fillRect(0,0,512,256),a.fillStyle="#421f14",a.fillRect(0,256*.5,512*.45,45);const s=512*.62,o=256*.42;a.fillStyle="#f0e6dc",a.beginPath(),a.ellipse(s-16,o,28,35,-.2,0,Math.PI*2),a.fill(),a.ellipse(s+16,o,26,32,.2,0,Math.PI*2),a.fill();const r=new _(i);return r.wrapS=G,r.wrapT=L,r}static createCeresTexture(){const i=document.createElement("canvas");i.width=512,i.height=256;const a=i.getContext("2d");a.fillStyle="#6e6962",a.fillRect(0,0,512,256);for(let n=0;n<90;n++){const l=Math.random()*512,h=Math.random()*256,m=2+Math.random()*6;a.fillStyle="#48443e",a.beginPath(),a.arc(l,h,m,0,Math.PI*2),a.fill()}const s=512*.52,o=256*.44;a.fillStyle="#3a3630",a.beginPath(),a.arc(s,o,14,0,Math.PI*2),a.fill(),a.fillStyle="#ffffff",a.beginPath(),a.arc(s,o,3.5,0,Math.PI*2),a.fill();const r=new _(i);return r.wrapS=G,r.wrapT=L,r}static createRockyCrateredTexture(e){const a=document.createElement("canvas");a.width=256,a.height=128;const s=a.getContext("2d"),o=e==="Bennu"||e==="Ryugu"||e==="Hygiea",r=e==="Psyche";s.fillStyle=o?"#323232":r?"#948a7e":"#7a746d",s.fillRect(0,0,256,128);for(let l=0;l<50;l++){const h=Math.random()*256,m=Math.random()*128,p=2+Math.random()*5;s.fillStyle=o?"#1a1a1a":"#4e4842",s.beginPath(),s.arc(h,m,p,0,Math.PI*2),s.fill(),s.strokeStyle=o?"#505050":"rgba(200, 195, 185, 0.5)",s.lineWidth=1,s.beginPath(),s.arc(h,m,p,0,Math.PI),s.stroke()}const n=new _(a);return n.wrapS=G,n.wrapT=L,n}static createGenericTexture(e){const t=document.createElement("canvas");t.width=64,t.height=64;const i=t.getContext("2d");return i.fillStyle=e,i.fillRect(0,0,64,64),new _(t)}}u(Be,"cache",new Map);const De=class De{constructor(){u(this,"loader",new Xa);u(this,"customLoader",null);u(this,"cache",new Map);u(this,"inFlightRequests",new Map);u(this,"maxAnisotropy",8);u(this,"baseUrl",(typeof import.meta<"u"&&"/solaris/"||"/").replace(/\/?$/,"/"))}resolveUrl(e){if(!e)return"";if(e.startsWith("http://")||e.startsWith("https://")||e.startsWith("data:")||e.startsWith("blob:"))return e;const t=e.replace(/^(\.\/)+/,"").replace(/^\/+/,"").replace(/\/+/g,"/");return`${this.baseUrl.replace(/\/+$/,"/")}${t}`}static getInstance(){return De.instance||(De.instance=new De),De.instance}setLoader(e){this.customLoader=e}setBaseUrl(e){this.baseUrl=e.replace(/\/?$/,"/")}setMaxAnisotropy(e){this.maxAnisotropy=Math.max(1,e);for(const t of this.cache.values())t.anisotropy=this.maxAnisotropy,t.needsUpdate=!0}isCached(e){const t=this.resolveUrl(e);return this.cache.has(t)}getCacheSize(){return this.cache.size}evictFromCache(e,t=!1){const i=this.resolveUrl(e),a=this.cache.get(i);return a?(this.cache.delete(i),this.inFlightRequests.delete(i),t&&a.dispose(),!0):!1}clearCache(e=!1){if(e)for(const t of this.cache.values())t.dispose();this.cache.clear(),this.inFlightRequests.clear()}resetForTesting(){this.clearCache(!1),this.customLoader=null,this.baseUrl=(typeof import.meta<"u"&&"/solaris/"||"/").replace(/\/?$/,"/")}loadTexture(e,t=!0,i){const a=this.resolveUrl(e),s=this.cache.get(a);if(s)return s;if(typeof document>"u"&&!this.customLoader){const h=new ha;return h.colorSpace=t?Ee:at,this.cache.set(a,h),h}const o=this.customLoader||this.loader;let r=!1,n=null;const l=o.load(a,h=>{h.colorSpace=t?Ee:at,h.generateMipmaps=!0,h.minFilter=ot,h.magFilter=bt,h.anisotropy=this.maxAnisotropy,h.needsUpdate=!0},void 0,h=>{if(r=!0,console.warn(`[TexturePipeline] Fallback activated for ${e} (${a}):`,h),this.cache.delete(a),this.inFlightRequests.delete(a),i&&n)try{const m=Be.getTexture(i);m&&m.image&&(n.image=m.image,n.needsUpdate=!0)}catch(m){console.warn("[TexturePipeline] Fallback generation error:",m)}});if(n=l,r&&i)try{const h=Be.getTexture(i);h&&h.image&&(n.image=h.image,n.needsUpdate=!0)}catch(h){console.warn("[TexturePipeline] Fallback generation error:",h)}return l.colorSpace=t?Ee:at,l.generateMipmaps=!0,l.minFilter=ot,l.magFilter=bt,l.anisotropy=this.maxAnisotropy,r||this.cache.set(a,l),l}loadTextureAsync(e,t=!0,i){const a=this.resolveUrl(e),s=this.cache.get(a);if(s)return Promise.resolve(s);const o=this.inFlightRequests.get(a);if(o)return o;if(typeof document>"u"&&!this.customLoader){const n=this.loadTexture(e,t,i);return Promise.resolve(n)}const r=new Promise((n,l)=>{(this.customLoader||this.loader).load(a,m=>{m.colorSpace=t?Ee:at,m.generateMipmaps=!0,m.minFilter=ot,m.magFilter=bt,m.anisotropy=this.maxAnisotropy,m.needsUpdate=!0,this.cache.set(a,m),this.inFlightRequests.delete(a),n(m)},void 0,m=>{if(this.cache.delete(a),this.inFlightRequests.delete(a),i){console.warn(`[TexturePipeline] Fallback activated for ${e}:`,m);const p=Be.getTexture(i);n(p)}else l(m)})});return this.inFlightRequests.set(a,r),r}getPlanetTextures(e){switch(e){case"Sun":return{map:this.loadTexture("/textures/2k_sun.jpg",!0,"Sun"),emissiveMap:this.loadTexture("/textures/2k_sun.jpg",!0,"Sun")};case"Mercury":return{map:this.loadTexture("/textures/2k_mercury.jpg",!0,"Mercury")};case"Venus":return{map:this.loadTexture("/textures/2k_venus_atmosphere.jpg",!0,"Venus")};case"Earth":return{map:this.loadTexture("/textures/2k_earth_daymap.jpg",!0,"Earth"),normalMap:this.loadTexture("/textures/earth_normal_2048.jpg",!1),nightMap:this.loadTexture("/textures/2k_earth_nightmap.jpg",!0),cloudsMap:this.loadTexture("/textures/2k_earth_clouds.jpg",!0,"EarthClouds")};case"Moon":return{map:this.loadTexture("/textures/2k_moon.jpg",!0,"Moon")};case"Mars":return{map:this.loadTexture("/textures/2k_mars.jpg",!0,"Mars")};case"Jupiter":return{map:this.loadTexture("/textures/2k_jupiter.jpg",!0,"Jupiter")};case"Saturn":return{map:this.loadTexture("/textures/2k_saturn.jpg",!0,"Saturn"),ringAlphaMap:this.loadTexture("/textures/2k_saturn_ring_alpha.png",!1,"SaturnRings")};case"Uranus":return{map:this.loadTexture("/textures/2k_uranus.jpg",!0,"Uranus")};case"Neptune":return{map:this.loadTexture("/textures/2k_neptune.jpg",!0,"Neptune")};default:return{map:Be.getTexture(e)}}}getMilkyWayTexture(){return this.loadTexture("/textures/gaia_sky.webp",!0)}getMilkyWayDiskTexture(){return this.loadTexture("/textures/milky_way_disk.webp",!0)}};u(De,"instance");let Ve=De;class St{static createPhotosphereMaterial(e){return new k({uniforms:{sunTexture:{value:e},time:{value:0}},vertexShader:`
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
      `})}static createCoronaMaterial(e=14){return new k({uniforms:{sunCenter:{value:new P(0,0,0)},sunRadius:{value:e},time:{value:0}},vertexShader:`
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
      `,blending:Y,side:He,transparent:!0,depthWrite:!1})}static createProminencesMaterial(){return new k({uniforms:{time:{value:0}},vertexShader:`
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
      `,blending:Y,side:Le,transparent:!0,depthWrite:!1})}static createProminencesGroup(e){const t=new ie;t.name="solar_prominences";const i=this.createProminencesMaterial();return[{lat:.35,lon:.2,scale:.14,angle:.4},{lat:-.42,lon:1.1,scale:.18,angle:-.3},{lat:.15,lon:2.3,scale:.11,angle:.6},{lat:-.25,lon:3.4,scale:.22,angle:-.5},{lat:.55,lon:4.2,scale:.15,angle:.2},{lat:-.1,lon:5.1,scale:.19,angle:.7},{lat:.4,lon:5.8,scale:.12,angle:-.4}].forEach((s,o)=>{const r=new nt(1,1,32,8),n=r.attributes.position,l=r.attributes.uv,h=s.scale*e*2.2,m=s.scale*e*1.6,p=s.scale*e*.28;for(let f=0;f<n.count;f++){const S=l.getX(f),D=l.getY(f),R=(S-.5)*h,N=Math.sin(S*Math.PI)*m,I=(D-.5)*p;n.setXYZ(f,R,N,I)}r.computeVertexNormals();const g=new F(r,i);g.name=`prominence_loop_${o}`;const v=Math.cos(s.lat),y=Math.sin(s.lat),M=e*v*Math.cos(s.lon),x=e*y,b=e*v*Math.sin(s.lon);g.position.set(M,x,b);const A=new P(M,x,b).normalize();g.quaternion.setFromUnitVectors(new P(0,1,0),A),g.rotateOnAxis(new P(0,1,0),s.angle),t.add(g)}),t}}const fa={Earth:{radiusScale:1.008,rayleighColor:new E(.24,.52,.92),twilightColor:new E(.95,.42,.16),density:.65,falloffPower:4.5,mieG:.72},Venus:{radiusScale:1.012,rayleighColor:new E(.92,.86,.64),twilightColor:new E(.85,.58,.32),density:1.1,falloffPower:3.5,mieG:.65},Mars:{radiusScale:1.004,rayleighColor:new E(.65,.55,.5),twilightColor:new E(.35,.5,.7),density:.12,falloffPower:6,mieG:.55},Uranus:{radiusScale:1.014,rayleighColor:new E(.48,.85,.82),twilightColor:new E(.32,.65,.72),density:.75,falloffPower:3.8,mieG:.7},Neptune:{radiusScale:1.014,rayleighColor:new E(.2,.45,.95),twilightColor:new E(.15,.3,.75),density:.8,falloffPower:3.8,mieG:.7}};class ea{static createAtmosphereMaterial(e){const t=fa[e];return t?new k({uniforms:{rayleighColor:{value:t.rayleighColor},twilightColor:{value:t.twilightColor},density:{value:t.density},falloffPower:{value:t.falloffPower},mieG:{value:t.mieG}},vertexShader:`
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
      `,blending:Y,side:He,transparent:!0,depthWrite:!1}):null}}class ta{static createSurfaceMaterial(e,t,i,a){return new k({uniforms:{dayMap:{value:e},normalMap:{value:t||null},nightMap:{value:i||null},cloudsMap:{value:a||null},hasNormalMap:{value:t?1:0},hasNightMap:{value:i?1:0},hasCloudsMap:{value:a?1:0}},vertexShader:`
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
      `})}static createCloudMaterial(e){return new k({uniforms:{cloudsMap:{value:e}},vertexShader:`
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
      `,transparent:!0,depthWrite:!1})}}class Ii{static createMaterial(e){const{name:t,category:i,map:a,normalMap:s}=e,o=t==="Jupiter"||t==="Saturn"||t==="Uranus"||t==="Neptune",r=t==="Europa"||t==="Enceladus",n=t==="Mercury"||t==="Moon"||i==="asteroid",l=t==="Mars",h=t==="Venus",m=t==="Saturn";return new k({uniforms:{map:{value:a},normalMap:{value:s||null},hasNormalMap:{value:s?1:0},isGasGiant:{value:o?1:0},isIcyMoon:{value:r?1:0},isAirlessRocky:{value:n?1:0},isMars:{value:l?1:0},isVenus:{value:h?1:0},isSaturn:{value:m?1:0}},vertexShader:`
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
      `})}}const Oi=48,va=50,ya=65,xa=.58;function jt(c){return va+Math.pow(Math.max(0,c),xa)*ya}function Li(c){return Math.pow(Math.max(0,c-va)/ya,1/xa)}function wa(c){if(c.category==="star")return Oi;switch(c.name){case"Jupiter":return 26.9;case"Saturn":return 22.68;case"Uranus":return 9.62;case"Neptune":return 9.32;case"Earth":return 2.4;case"Venus":return 2.28;case"Mars":return 1.28;case"Mercury":return .92;case"Pluto":return .45}const e=c.physical.meanRadiusKm;return c.category==="moon"?e<100?.18:e<500?.32:e<1200?.48:e<2e3?.65:.95:c.category==="dwarf_planet"?.45:c.category==="asteroid"?e<10?.18:e<100?.25:.38:Math.max(.18,e/6371*2.4)}class Ui{static getVisualRadius(e){return wa(e)}static createPlanet(e){var A;const t=new ie;t.name=`body_group_${e.name}`;const i=this.getVisualRadius(e),s=1-(e.physical.flattening||0),o=e.category==="moon"||e.category==="asteroid",r=e.category==="planet"||e.category==="star",n=new re(1,r?96:o?36:64,r?64:o?24:48);if(e.category==="asteroid"||e.category==="moon"&&e.physical.meanRadiusKm<200){const f=n.attributes.position;for(let S=0;S<f.count;S++){const D=f.getX(S),R=f.getY(S),N=f.getZ(S),I=1+.18*Math.sin(D*4)*Math.cos(R*4+N*3);f.setXYZ(S,D*I,R*I,N*I)}n.computeVertexNormals()}const h=Ve.getInstance().getPlanetTextures(e.name);let m,p,g,v,y,M;const x=[];if(e.category==="star"){m=St.createPhotosphereMaterial(h.map);const f=new re(2.45,96,64),S=St.createCoronaMaterial(i),D=new F(f,S);D.name="sun_corona",D.scale.set(i,i,i),t.add(D),x.push(D),M=St.createProminencesGroup(i),t.add(M)}else if(e.name==="Earth"){if(m=ta.createSurfaceMaterial(h.map,h.normalMap,h.nightMap,h.cloudsMap),h.cloudsMap){const S=new re(1.004,96,64),D=ta.createCloudMaterial(h.cloudsMap);g=new F(S,D),g.name="earth_clouds",g.renderOrder=2,g.scale.set(i,i,i),t.add(g)}const f=ea.createAtmosphereMaterial("Earth");if(f){const S=new re(1.012,96,64);v=new F(S,f),v.name="earth_atmosphere",v.renderOrder=3,v.scale.set(i,i,i),t.add(v)}}else{m=Ii.createMaterial({name:e.name,category:e.category,map:h.map,normalMap:h.normalMap});const f=ea.createAtmosphereMaterial(e.name);if(f){const S=((A=fa[e.name])==null?void 0:A.radiusScale)||1.012,D=new re(S,48,36);v=new F(D,f),v.name=`${e.name.toLowerCase()}_atmosphere`,v.renderOrder=3,v.scale.set(i,i,i),t.add(v)}}const b=new F(n,m);if(b.name=`surface_${e.name}`,b.castShadow=e.category!=="star",b.receiveShadow=e.category!=="star",b.scale.set(i,i*s,i),t.add(b),e.name==="Saturn"){const D=new Qa(1.32,2.65,128,8),R=D.attributes.position,N=D.attributes.uv;for(let ee=0;ee<R.count;ee++){const Q=R.getX(ee),ne=R.getY(ee),ue=(Math.sqrt(Q*Q+ne*ne)-1.32)/(2.65-1.32);N.setXY(ee,ue,.5)}N.needsUpdate=!0;const I=h.ringAlphaMap||h.map,U=new k({uniforms:{ringMap:{value:I},saturnCenter:{value:new P},saturnRadius:{value:i}},vertexShader:`
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
        `,side:Le,transparent:!0,depthWrite:!1});y=new F(D,U),y.name="saturn_rings",y.rotation.x=Math.PI*.5,y.renderOrder=3,y.scale.set(i,i,i),t.add(y)}return{definition:e,bodyGroup:t,surfaceMesh:b,nightMesh:p,cloudMesh:g,atmosphereMesh:v,ringMesh:y,glowMeshes:x.length>0?x:void 0,prominencesGroup:M,visualRadius:i}}}const B=class B{static eclipticToIcrf(e){const[t,i,a]=e,s=Math.cos(B.OBLIQUITY_J2000_RAD),o=Math.sin(B.OBLIQUITY_J2000_RAD);return[t,i*s-a*o,i*o+a*s]}static icrfToEcliptic(e){const[t,i,a]=e,s=Math.cos(B.OBLIQUITY_J2000_RAD),o=Math.sin(B.OBLIQUITY_J2000_RAD);return[t,i*s+a*o,-i*o+a*s]}static eclipticToThree(e){return[e[0],e[2],-e[1]]}static threeToEcliptic(e){return[e[0],-e[2],e[1]]}static icrfToThree(e){return B.eclipticToThree(B.icrfToEcliptic(e))}static raDecToIcrf(e,t){const i=e*Math.PI/180,a=t*Math.PI/180;return[Math.cos(a)*Math.cos(i),Math.cos(a)*Math.sin(i),Math.sin(a)]}static galacticBasisThree(){const e=B.icrfToThree(B.raDecToIcrf(B.NGP_RA_DEG,B.NGP_DEC_DEG)),t=B.icrfToThree(B.raDecToIcrf(B.GC_RA_DEG,B.GC_DEC_DEG)),i=t[0]*e[0]+t[1]*e[1]+t[2]*e[2],a=[t[0]-i*e[0],t[1]-i*e[1],t[2]-i*e[2]],s=Math.hypot(...a),o=[a[0]/s,a[1]/s,a[2]/s],r=[e[1]*o[2]-e[2]*o[1],e[2]*o[0]-e[0]*o[2],e[0]*o[1]-e[1]*o[0]];return{x:o,y:r,z:e}}};u(B,"OBLIQUITY_J2000_DEG",23.43929111),u(B,"OBLIQUITY_J2000_RAD",23.43929111*Math.PI/180),u(B,"NGP_RA_DEG",192.85948),u(B,"NGP_DEC_DEG",27.12825),u(B,"GC_RA_DEG",266.40499),u(B,"GC_DEC_DEG",-28.93617);let z=B;const ge=class ge{constructor(){u(this,"mode","exploration")}toRenderPosition(e,t){if(this.mode==="scientific"){const h=1/ge.SCIENTIFIC_KM_PER_UNIT,m=[e[0]*h,e[1]*h,e[2]*h];return z.eclipticToThree(m)}const i=Math.sqrt(e[0]*e[0]+e[1]*e[1]+e[2]*e[2]);if(i<1e3||!t||t.orderFromSun===0)return[0,0,0];const a=i/ge.AU_KM,s=jt(a),o=e[0]/i,r=e[1]/i,n=e[2]/i,l=[o*s,r*s,n*s];return z.eclipticToThree(l)}toMoonRenderPosition(e,t,i,a){if(this.mode==="scientific"){const p=1/ge.SCIENTIFIC_KM_PER_UNIT,g=[e[0]*p,e[1]*p,e[2]*p],v=z.eclipticToThree(g),y=Math.hypot(v[0],v[1],v[2]),M=this.getVisualRadius(a)*1.25+this.getVisualRadius(t);if(y>0&&y<M){const x=M/y;v[0]*=x,v[1]*=x,v[2]*=x}return[i[0]+v[0],i[1]+v[1],i[2]+v[2]]}const s=Math.sqrt(e[0]*e[0]+e[1]*e[1]+e[2]*e[2]);if(s<1)return i;const o=e[0]/s,r=e[1]/s,n=e[2]/s,l=z.eclipticToThree([o,r,n]),m=this.getVisualRadius(a)*(1.35+1.25*Math.log10(1+s/4e4));return[i[0]+l[0]*m,i[1]+l[1]*m,i[2]+l[2]*m]}getVisualRadius(e){if(this.mode==="scientific"){const t=e.physical.meanRadiusKm/ge.SCIENTIFIC_KM_PER_UNIT;return Math.max(.015,t*4)}return wa(e)}};u(ge,"SCIENTIFIC_KM_PER_UNIT",1e6),u(ge,"AU_KM",1495978707e-1);let fe=ge;const ba=66743e-15,ht=299792458,Ma=198847e25,_t=149597870700,Sa=3085677581e7,Pa=9460730472e6,Aa=4297e3,ji=12e3,Da=8.277,_i=.033,Ta=Da*1e3*Sa,Fi=Ta/Pa,Ca=Aa*Ma,ye=2*ba*Ca/(ht*ht),Bi=ye/1e3,Gi=ye/_t,Ra=1.5*ye,zi=Ra/1e3,vt=3*Math.sqrt(3)/2*ye,Ki=vt/1e3,Hi=vt/_t,Wi=2*vt/Ta,Vi=180*3600*1e6/Math.PI,Yi=Wi*Vi,dt=3*ye,Ji=dt/1e3,qi=Math.sqrt(ye/(2*dt)),$={name:"Sagittarius A*",designation:"CXOGC J174540.0-290028",classification:"Supermassive Black Hole (SMBH)",galacticCenter:{system:"Galactic Coordinate System (IAU 1958 / ICRF J2000)",longitudeDeg:359.944,latitudeDeg:-.046,rightAscensionJ2000:"17h 45m 40.0409s",declinationJ2000:"-29° 00′ 28.118″"},physicalConstants:{G:ba,c:ht,solarMassKg:Ma,auMeters:_t,parsecMeters:Sa,lightYearMeters:Pa},measurements:{adoptedMassSolar:Aa,massUncertaintySolar:ji,adoptedDistanceKpc:Da,distanceUncertaintyKpc:_i,distanceLightYears:Fi,spinParameterAStar:0,spinAssumption:"Adopted Schwarzschild metric (a* = 0) as physical baseline; Kerr prograde spin creates asymmetric shadow offset and reduces ISCO down to 1.0 r_s.",metricAdopted:"Schwarzschild Metric with Relativistic Null-Geodesic Integration",accretionDiskInclinationDeg:42},derivedParameters:{massKg:Ca,schwarzschildRadiusM:ye,schwarzschildRadiusKm:Bi,schwarzschildRadiusAU:Gi,photonSphereRadiusM:Ra,photonSphereRadiusKm:zi,shadowRadiusM:vt,shadowRadiusKm:Ki,shadowRadiusAU:Hi,shadowAngularDiameterMicroArcsec:Yi,iscoRadiusM:dt,iscoRadiusKm:Ji,accretionDiskInnerRadiusM:dt,accretionDiskOuterRadiusM:16*ye,iscoOrbitalSpeedFractionC:qi},sources:[{title:"First Sagittarius A* Event Horizon Telescope Results. I. The Shadow of the Supermassive Black Hole in the Center of the Milky Way",organization:"Event Horizon Telescope Collaboration",url:"https://www.jpl.nasa.gov/news/nasa-supports-event-horizon-telescope-in-studying-milky-ways-black-hole/",dateVerified:"2026-10-13",citation:"EHT Collaboration, 2022, ApJL, 930, L12. Measured shadow diameter: 51.8 +/- 2.3 microarcseconds."},{title:"The mass and distance of the Milky Way’s central black hole from stellar orbits",organization:"GRAVITY Collaboration (ESO / MPE)",url:"https://science.nasa.gov/universe/black-holes/",dateVerified:"2026-10-13",citation:"Abuter et al. (GRAVITY Collaboration), 2021, A&A, 647, A59. Mass: 4.297 +/- 0.012 x 10^6 M_sun, R_0: 8.277 +/- 0.033 kpc."},{title:"Black Hole Anatomy and Physics",organization:"NASA Astrophysics Science Division",url:"https://science.nasa.gov/universe/black-holes/anatomy/",dateVerified:"2026-10-13",citation:"NASA Science Directorate: Event horizon, photon ring, and relativistic accretion disk structure."},{title:"Simulation of Light Geodesics and Relativistic Ray Tracing Around a Supermassive Black Hole",organization:"NASA Goddard Space Flight Center (SVS 14619)",url:"https://svs.gsfc.nasa.gov/14619/",dateVerified:"2026-10-13",citation:"Jeremy Schnittman (NASA GSFC, July 2024): Relativistic ray-tracing, Doppler boosting, and gravitational lensing."},{title:"NASA’s Swift Catches X-ray Action at Milky Way’s Center",organization:"NASA Goddard Space Flight Center",url:"https://www.nasa.gov/news-release/nasas-swift-catches-x-ray-action-at-milky-ways-center/",dateVerified:"2026-10-13",citation:"Multiwavelength monitoring of Sgr A* accretion variability and relativistic flares."}]};$.measurements.adoptedMassSolar,$.measurements.massUncertaintySolar,$.measurements.adoptedDistanceKpc,$.measurements.distanceLightYears,$.derivedParameters.massKg;$.derivedParameters.schwarzschildRadiusKm,$.derivedParameters.schwarzschildRadiusAU,$.derivedParameters.photonSphereRadiusKm,$.derivedParameters.shadowRadiusKm,$.derivedParameters.shadowRadiusAU,$.derivedParameters.shadowAngularDiameterMicroArcsec,$.derivedParameters.iscoRadiusKm,$.derivedParameters.iscoOrbitalSpeedFractionC,$.derivedParameters.iscoOrbitalSpeedFractionC*(ht/1e3);const Ea={schwarzschildRadius:24,diskInnerRadius:72,diskOuterRadius:340,boundingRadius:520};class $i{constructor(e=Ea){u(this,"group",new ie);u(this,"boundingMesh");u(this,"sStarsPoints");u(this,"jetPolesGroup",new ie);u(this,"hitMesh");u(this,"config");u(this,"scientificData",$);u(this,"timeUniform",{value:0});u(this,"opacityUniform",{value:1});u(this,"cameraPosUniform",{value:new P});this.config=e,this.group.name="sagittarius_a_star_black_hole",this.boundingMesh=this.createRelativisticRayMarchMesh(),this.group.add(this.boundingMesh),this.sStarsPoints=this.createNuclearStarCluster(),this.group.add(this.sStarsPoints);const t=new re(Math.max(3200,this.config.boundingRadius*2),16,16),i=new Ut({visible:!1});this.hitMesh=new F(t,i),this.hitMesh.name="sagittarius_a_star_hit_target",this.group.add(this.hitMesh),this.createPolarOutflowJets(),this.jetPolesGroup.visible=!1,this.group.add(this.jetPolesGroup)}createRelativisticRayMarchMesh(){const e=new re(this.config.boundingRadius,64,48),t=this.config.schwarzschildRadius,i=t*(3*Math.sqrt(3)/2),a=this.config.diskInnerRadius,s=this.config.diskOuterRadius,o=new k({uniforms:{uTime:this.timeUniform,uOpacity:this.opacityUniform,uCameraPosLocal:this.cameraPosUniform,uRs:{value:t},uRShadow:{value:i},uRIn:{value:a},uROut:{value:s},uBoundingR:{value:this.config.boundingRadius}},vertexShader:`
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
          float phiOrbit = phi + omega * time * 0.32;
          float logR = log(max(1.0, r / rIn));

          // 6 octaves of Keplerian sheared logarithmic spiral rays
          float s1 = phiOrbit * 3.0 - logR * 4.0;
          float s2 = phiOrbit * 7.0 - logR * 9.5;
          float s3 = phiOrbit * 18.0 - logR * 25.0;
          float s4 = phiOrbit * 45.0 - logR * 62.0;
          float s5 = phiOrbit * 110.0 - logR * 152.0;
          float s6 = phiOrbit * 260.0 - logR * 360.0;

          // Power-law sharpening creates crisp, silky light rays with distinct troughs
          float r1 = pow(sin(s1) * 0.5 + 0.5, 1.4);
          float r2 = pow(sin(s2) * 0.5 + 0.5, 1.6);
          float r3 = pow(sin(s3) * 0.5 + 0.5, 1.8);
          float r4 = pow(sin(s4) * 0.5 + 0.5, 2.0);
          float r5 = pow(sin(s5) * 0.5 + 0.5, 2.2);
          float r6 = pow(cos(s6) * 0.5 + 0.5, 2.4);

          float rays = 0.35 + 0.28 * r1 + 0.22 * r2 + 0.16 * r3 + 0.12 * r4 + 0.08 * r5 + 0.05 * r6;

          // Fine concentric Keplerian striations
          float concentric = pow(sin(r * 3.2 + sin(r * 0.8) * 1.5) * 0.5 + 0.5, 1.6);
          rays *= (0.75 + 0.35 * concentric);

          return clamp(rays, 0.06, 1.45);
        }

        // Magnetorotational instability (MRI) reconnection flare clumps (turbulent plumes on inner rim)
        float computePlasmaFlares(float r, float phi, float time, float rIn) {
          float omega = 3.6 * pow(rIn / r, 1.5);
          float phiOrbit = phi + omega * time * 0.32;
          float logR = log(max(1.0, r / rIn));

          float n1 = sin(phiOrbit * 3.5 + logR * 4.5 + time * 0.6) * cos(phiOrbit * 6.5 - logR * 7.5 - time * 0.9);
          float n2 = sin(phiOrbit * 12.0 - logR * 16.0 + time * 1.4) * cos(phiOrbit * 20.0 + logR * 26.0 - time * 1.8);
          float puff = clamp((n1 * 0.65 + n2 * 0.35) * 0.5 + 0.5, 0.0, 1.0);

          float innerRamp = smoothstep(rIn * 2.4, rIn * 1.02, r);
          return pow(puff, 2.8) * 2.4 * innerRamp;
        }

        // Interstellar soot / carbon-silicate dust absorption lanes
        float computeDustExtinction(float r, float phi, float time, float rIn, float rOut) {
          float omega = 3.6 * pow(rIn / r, 1.5);
          float phiOrbit = phi + omega * time * 0.32;
          float logR = log(max(1.0, r / rIn));

          float sDust = sin(phiOrbit * 6.5 - logR * 9.0) * cos(phiOrbit * 15.0 - logR * 21.0);
          float dust = smoothstep(0.20, 0.70, sDust * 0.5 + 0.5);

          float outerMask = smoothstep(rIn * 1.6, rIn * 3.4, r) * smoothstep(rOut, rOut * 0.78, r);
          return dust * outerMask * 0.85;
        }

        // Spectral blackbody emission curve calibrated exactly to Reference Image 1:
        // Deep espresso soot -> Warm caramel amber -> Glowing copper terracotta -> Luminous golden peach -> Incandescent warm white -> Blinding core
        vec3 spectralPlasmaColor(float temp, float dust, float flare) {
          vec3 colSoot    = vec3(0.04, 0.015, 0.008);
          vec3 colCaramel = vec3(0.68, 0.28, 0.09);
          vec3 colCopper  = vec3(1.28, 0.62, 0.22);
          vec3 colPeach   = vec3(2.15, 1.35, 0.66);
          vec3 colIncand  = vec3(3.60, 3.10, 2.40);
          vec3 colCore    = vec3(5.20, 4.90, 4.40);

          vec3 plasma = mix(colCaramel, colCopper, smoothstep(0.02, 0.25, temp));
          plasma = mix(plasma, colPeach, smoothstep(0.25, 0.65, temp));
          plasma = mix(plasma, colIncand, smoothstep(0.65, 0.95, temp));
          plasma = mix(plasma, colCore, smoothstep(0.95, 1.25, temp));

          // Delicate ethereal ice-white plumes ONLY on the inner turbulent plasma flares
          // (matching the subtle blue puffs on the inner rim in Image 1)
          vec3 colFlareWisp = vec3(3.40, 4.10, 5.00);
          plasma = mix(plasma, colFlareWisp, smoothstep(0.35, 1.0, flare) * 0.42);

          // Interstellar dust extinction absorbs light
          plasma = mix(plasma, colSoot, dust * 0.75);
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

              // 2. Novikov-Thorne Relativistic Radial Temperature Flux with extended outer radiance
              float normR = rCyl / uRIn;
              float flux = (0.42 * pow(normR, -0.92) + 0.58 * pow(normR, -1.85)) * max(0.0, 1.0 - sqrt(0.97 / normR));

              // 3. Gravitational Redshift: g_grav = sqrt(1 - rs / r)
              float gravRedshift = sqrt(max(0.04, 1.0 - uRs / rCyl));

              // 4. Relativistic Keplerian Orbital Speed: beta = v/c = sqrt(rs / (2 * r))
              float beta = clamp(sqrt(uRs / (2.0 * rCyl)), 0.0, 0.55);
              float gamma = 1.0 / sqrt(max(0.05, 1.0 - beta * beta));

              // Keplerian velocity vector (counter-clockwise in X-Z plane, approaching on left)
              vec3 vel = normalize(vec3(pos.z, 0.0, -pos.x)) * beta;
              float cosAlpha = dot(vel, -rayDir) / max(0.001, beta);
              float delta = 1.0 / (gamma * (1.0 - beta * cosAlpha));

              // Subtle physical Doppler Beaming boost: I_obs = I_emit * delta^2.6
              float dopplerBoost = pow(clamp(delta, 0.40, 2.8), 2.6);

              // 5. Multi-octave Procedural Fibers & MRI Flares
              float phi = atan(pos.z, pos.x);
              float fibers = computeStreamlineFibers(rCyl, phi, uTime, uRIn);
              float flares = computePlasmaFlares(rCyl, phi, uTime, uRIn);
              float dust   = computeDustExtinction(rCyl, phi, uTime, uRIn, uROut);

              // Relativistic effective temperature: warm radial flux + flares
              float effTemp = clamp((flux * 3.6 + flares * 0.40) * gravRedshift, 0.0, 1.40);
              vec3 plasmaRgb = spectralPlasmaColor(effTemp, dust, flares);

              // Boundaries: sharp ISCO inner cutoff, soft outer fade
              float innerCut = smoothstep(uRIn, uRIn * 1.05, rCyl);
              float outerCut = smoothstep(uROut, uROut * 0.76, rCyl);
              float density = vertProfile * innerCut * outerCut * (fibers * 0.85 + 0.15) * (1.0 + flares * 0.5);

              float stepAlpha = clamp(density * stepSize * 0.048, 0.0, 0.88);
              vec3 stepEmission = plasmaRgb * dopplerBoost * (fibers * 0.90 + 0.20) * (1.0 + flares * 0.7);

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
                float flux = (0.42 * pow(normR, -0.92) + 0.58 * pow(normR, -1.85)) * max(0.0, 1.0 - sqrt(0.97 / normR));
                float gravRedshift = sqrt(max(0.04, 1.0 - uRs / rCross));

                float beta = clamp(sqrt(uRs / (2.0 * rCross)), 0.0, 0.55);
                float gamma = 1.0 / sqrt(max(0.05, 1.0 - beta * beta));
                vec3 vel = normalize(vec3(crossPos.z, 0.0, -crossPos.x)) * beta;
                float cosAlpha = dot(vel, -rayDir) / max(0.001, beta);
                float delta = 1.0 / (gamma * (1.0 - beta * cosAlpha));
                float dopplerBoost = pow(clamp(delta, 0.40, 2.8), 2.6);

                float phi = atan(crossPos.z, crossPos.x);
                float fibers = computeStreamlineFibers(rCross, phi, uTime, uRIn);
                float flares = computePlasmaFlares(rCross, phi, uTime, uRIn);
                float dust   = computeDustExtinction(rCross, phi, uTime, uRIn, uROut);

                float effTemp = clamp((flux * 3.6 + flares * 0.40) * gravRedshift, 0.0, 1.40);
                vec3 plasmaRgb = spectralPlasmaColor(effTemp, dust, flares);

                float innerCut = smoothstep(uRIn, uRIn * 1.04, rCross);
                float outerCut = smoothstep(uROut, uROut * 0.78, rCross);
                float midOpacity = clamp(innerCut * outerCut * (fibers * 0.85 + 0.15) * 0.48 * (1.0 + flares * 0.4), 0.0, 0.96);
                vec3 midEmission = plasmaRgb * dopplerBoost * (fibers * 0.92 + 0.18) * (1.0 + flares * 0.7);

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
            vec3 finalHdr = accumColor / (vec3(1.0) + accumColor * 0.16);
            gl_FragColor = vec4(finalHdr, 1.0 * uOpacity);
            return;
          }

          // F. Ultra-Sharp Relativistic Photon Ring:
          // Ring of looping photons at the critical shadow boundary (b ~ b_crit)
          float shadowDist = abs(b - uRShadow);
          float photonRing = exp(-pow(shadowDist / (uRs * 0.038), 2.0));
          if (photonRing > 0.005) {
            vec3 ringColor = vec3(4.8, 4.4, 3.8) * photonRing * 4.2;
            accumColor += (1.0 - accumAlpha) * ringColor;
            accumAlpha += (1.0 - accumAlpha) * photonRing * 0.98;
          }

          // Secondary lensed sub-ring (higher-order relativistic image)
          float subRingDist = abs(b - (uRShadow + uRs * 0.22));
          float subRing = exp(-pow(subRingDist / (uRs * 0.024), 2.0));
          if (subRing > 0.008) {
            vec3 subRingColor = vec3(3.2, 2.4, 1.6) * subRing * 1.8;
            accumColor += (1.0 - accumAlpha) * subRingColor;
            accumAlpha += (1.0 - accumAlpha) * subRing * 0.65;
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
          vec3 finalToneMapped = accumColor / (vec3(1.0) + accumColor * 0.16);
          gl_FragColor = vec4(finalToneMapped, clamp(accumAlpha, 0.0, 1.0) * uOpacity);
        }
      `,transparent:!0,side:Le,depthWrite:!1,blending:Et}),r=new F(e,o);return r.name="sagittarius_a_star_lensing_volume",r.renderOrder=50,r}createNuclearStarCluster(){const t=new Float32Array(1140),i=new Float32Array(380*3),a=new Float32Array(380),s=this.config.diskOuterRadius*1.08,o=this.config.boundingRadius*.96;for(let h=0;h<380;h++){const m=Math.random(),p=s+Math.pow(m,1.6)*(o-s),g=Math.random()*Math.PI*2,v=(Math.random()-.5)*Math.PI;t[h*3]=p*Math.cos(g)*Math.cos(v),t[h*3+1]=p*Math.sin(v),t[h*3+2]=p*Math.sin(g)*Math.cos(v);const y=Math.random();y<.45?(i[h*3]=.82,i[h*3+1]=.9,i[h*3+2]=1,a[h]=1.4+Math.random()*2.2):y<.75?(i[h*3]=.98,i[h*3+1]=.98,i[h*3+2]=1,a[h]=1.2+Math.random()*1.8):(i[h*3]=1,i[h*3+1]=.85,i[h*3+2]=.58,a[h]=1.5+Math.random()*2.5)}const r=new V;r.setAttribute("position",new j(t,3)),r.setAttribute("color",new j(i,3)),r.setAttribute("size",new j(a,1));const n=new k({uniforms:{uOpacity:this.opacityUniform,uTime:this.timeUniform},vertexShader:`
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
      `,vertexColors:!0,transparent:!0,blending:Y,depthWrite:!1}),l=new me(r,n);return l.name="s_stars_nuclear_cluster",l}createPolarOutflowJets(){const i=new nt(65,720,1,32);i.translate(0,720*.5+this.config.schwarzschildRadius*.95,0);const a=new k({uniforms:{uTime:this.timeUniform,uOpacity:this.opacityUniform},vertexShader:`
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
      `,transparent:!0,side:Le,blending:Y,depthWrite:!1});[0,Math.PI*.25,Math.PI*.5,Math.PI*.75].forEach(o=>{const r=new F(i,a);r.rotation.y=o,this.jetPolesGroup.add(r);const n=i.clone();n.rotateZ(Math.PI);const l=new F(n,a);l.rotation.y=o,this.jetPolesGroup.add(l)})}update(e,t){this.timeUniform.value=t;const i=e.position.clone();this.group.worldToLocal(i),this.cameraPosUniform.value.copy(i),this.sStarsPoints&&(this.sStarsPoints.rotation.y=t*.015)}setOpacity(e){const t=Math.max(0,Math.min(1,e));this.opacityUniform.value=t,this.group.visible=t>.005}dispose(){this.boundingMesh.geometry.dispose(),this.boundingMesh.material.dispose(),this.sStarsPoints.geometry.dispose(),this.sStarsPoints.material.dispose(),this.jetPolesGroup.traverse(e=>{e instanceof F&&(e.geometry.dispose(),Array.isArray(e.material)?e.material.forEach(t=>t.dispose()):e.material.dispose())})}}const Ae=1320,Xi=8.277,Qi=.0208,Zi={radius:28e3,coreRadius:4800,sunDistance:Xi*Ae};class Ne{constructor(e=Zi){u(this,"group",new ie);u(this,"sagittariusAStar");u(this,"masterDiskMesh");u(this,"coreBulgeMesh");u(this,"dustExtinctionMesh");u(this,"starPoints");u(this,"satelliteGroup",new ie);u(this,"sunBeaconGroup",new ie);u(this,"sunReticleMesh");u(this,"sunPulseMesh");u(this,"sunRadarRing");u(this,"opacityUniform",{value:0});u(this,"timeUniform",{value:0});u(this,"bulgeFadeUniform",{value:1});u(this,"diskTextureUniform",{value:Ne.createEmptyTexture()});u(this,"diskTextureRequested",!1);u(this,"config");u(this,"sunWorldPosition",new P);this.config=e,this.group.name="milky_way_external_galaxy";const t=z.galacticBasisThree(),i=new pe().makeBasis(new P(...t.y).negate(),new P(...t.z),new P(...t.x).negate());this.group.quaternion.setFromRotationMatrix(i),this.masterDiskMesh=this.createMasterDisk(),this.group.add(this.masterDiskMesh),this.coreBulgeMesh=this.createVolumetricCore(),this.group.add(this.coreBulgeMesh),this.dustExtinctionMesh=this.createDustExtinction(),this.group.add(this.dustExtinctionMesh),this.starPoints=this.create3DStars(),this.group.add(this.starPoints),this.buildSatelliteGalaxies(),this.group.add(this.satelliteGroup);const{beaconGroup:a,reticleMesh:s,pulseMesh:o,radarRing:r,sunPos:n}=this.createSunBeacon();this.sunBeaconGroup=a,this.sunReticleMesh=s,this.sunPulseMesh=o,this.sunRadarRing=r,this.sunWorldPosition.copy(n),this.group.add(this.sunBeaconGroup),this.group.position.copy(n.clone().applyQuaternion(this.group.quaternion)).negate(),this.sagittariusAStar=new $i,this.group.add(this.sagittariusAStar.group),this.setOpacity(0)}createMasterDisk(){const e=new nt(this.config.radius*2,this.config.radius*2,64,64);e.rotateX(-Math.PI*.5);const t=new k({uniforms:{uGalaxyMap:this.diskTextureUniform,uOpacity:this.opacityUniform,uBulgeFade:this.bulgeFadeUniform,uTime:this.timeUniform},vertexShader:`
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
      `,transparent:!0,side:Le,depthWrite:!1,blending:Et}),i=new F(e,t);return i.name="milky_way_master_disk",i.renderOrder=-8,i}createVolumetricCore(){const e=new re(this.config.coreRadius,32,24);e.scale(1,.42,.82);const t=new k({uniforms:{uOpacity:this.opacityUniform,uBulgeFade:this.bulgeFadeUniform,uTime:this.timeUniform},vertexShader:`
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
      `,transparent:!0,blending:Y,depthWrite:!1,side:He}),i=new F(e,t);return i.name="galactic_volumetric_core",i.renderOrder=-7,i}createDustExtinction(){const e=new nt(this.config.radius*1.85,this.config.radius*1.85,48,48);e.rotateX(-Math.PI*.5);const t=new k({uniforms:{uGalaxyMap:this.diskTextureUniform,uOpacity:this.opacityUniform,uBulgeFade:this.bulgeFadeUniform},vertexShader:`
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
      `,transparent:!0,side:Le,depthWrite:!1,blending:Et}),i=new F(e,t);return i.name="galactic_dust_extinction_sheet",i.position.y=80,i.renderOrder=-6,i}create3DStars(){const t=new Float32Array(42e3),i=new Float32Array(14e3*3),a=new Float32Array(14e3),s=this.config.radius,o=this.config.coreRadius;let r=0;const n=4e3;for(let v=0;v<n;v++){const y=Math.random(),M=Math.pow(y,1.6)*o,x=Math.random()*Math.PI*2,b=(Math.random()-.5)*Math.PI,A=M*Math.cos(x)*Math.cos(b)*1.15,f=M*Math.sin(x)*Math.cos(b)*.85,S=M*Math.sin(b)*.42;t[r*3]=A,t[r*3+1]=S,t[r*3+2]=f,Math.random()<.6?(i[r*3]=1,i[r*3+1]=.85,i[r*3+2]=.6):(i[r*3]=.98,i[r*3+1]=.7,i[r*3+2]=.4),a[r]=1+Math.random()*1.5,r++}const l=8e3;for(let v=0;v<l;v++){const y=Math.random(),M=o*.8+Math.pow(y,1.1)*(s*.9-o*.8),x=Math.random()*Math.PI*2,b=550+M/s*450,A=(Math.random()-.5+(Math.random()-.5))*b,f=Math.cos(x)*M,S=Math.sin(x)*M;t[r*3]=f,t[r*3+1]=A,t[r*3+2]=S;const D=Math.random();D<.28?(i[r*3]=.75,i[r*3+1]=.88,i[r*3+2]=1,a[r]=1.4+Math.random()*1.8):D<.38?(i[r*3]=1,i[r*3+1]=.52,i[r*3+2]=.78,a[r]=1.6+Math.random()*1.6):D<.72?(i[r*3]=.98,i[r*3+1]=.96,i[r*3+2]=.92,a[r]=.9+Math.random()*1.2):(i[r*3]=1,i[r*3+1]=.82,i[r*3+2]=.52,a[r]=1+Math.random()*1.4),r++}const h=2e3;for(let v=0;v<h;v++){const y=Math.random(),M=Math.pow(y,1.4)*(s*1.35),x=Math.random()*Math.PI*2,b=(Math.random()-.5)*Math.PI;t[r*3]=M*Math.cos(x)*Math.cos(b),t[r*3+1]=M*Math.sin(b)*.7,t[r*3+2]=M*Math.sin(x)*Math.cos(b),i[r*3]=.92,i[r*3+1]=.9,i[r*3+2]=.95,a[r]=.8+Math.random()*1,r++}const m=new V;m.setAttribute("position",new j(t,3)),m.setAttribute("color",new j(i,3)),m.setAttribute("size",new j(a,1));const p=new k({uniforms:{uOpacity:this.opacityUniform,uTime:this.timeUniform},vertexShader:`
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
      `,vertexColors:!0,transparent:!0,blending:Y,depthWrite:!1}),g=new me(m,p);return g.name="galactic_3d_stars",g.renderOrder=-5,g}static createEmptyTexture(){const e=new Za(new Uint8Array([0,0,0,0]),1,1,ei);return e.needsUpdate=!0,e}static galactocentricToLocal(e,t,i){return new P(-t,i,-e).multiplyScalar(Ae)}buildSatelliteGalaxies(){const e=this.createDwarfGalaxy("large_magellanic_cloud",Ne.galactocentricToLocal(-.71,-40.95,-26.93),4*Ae,new E(13822207),450);this.satelliteGroup.add(e);const t=this.createDwarfGalaxy("small_magellanic_cloud",Ne.galactocentricToLocal(15.93,-37.57,-43.61),2*Ae,new E(14741247),220);this.satelliteGroup.add(t);const i=this.createDwarfGalaxy("sagittarius_dwarf_spheroidal",Ne.galactocentricToLocal(17.29,2.51,-6.48),2.5*Ae,new E(16770756),280);this.satelliteGroup.add(i)}createDwarfGalaxy(e,t,i,a,s){const o=new ie;o.name=e,o.position.copy(t);const r=new re(i,24,16);r.scale(1.25,.55,.95);const n=new k({uniforms:{uOpacity:this.opacityUniform,uColor:{value:a}},vertexShader:`
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
      `,transparent:!0,blending:Y,depthWrite:!1,side:He}),l=new F(r,n);l.renderOrder=-9,o.add(l);const h=new V,m=new Float32Array(s*3);for(let v=0;v<s;v++){const y=Math.random(),M=Math.pow(y,1.8)*i,x=Math.random()*Math.PI*2,b=(Math.random()-.5)*Math.PI;m[v*3]=M*Math.cos(x)*Math.cos(b)*1.25,m[v*3+1]=M*Math.sin(b)*.55,m[v*3+2]=M*Math.sin(x)*Math.cos(b)}h.setAttribute("position",new j(m,3));const p=new da({color:a,size:1.2,transparent:!0,opacity:.55,blending:Y,depthWrite:!1}),g=new me(h,p);return o.add(g),o}createSunBeacon(){const e=new ie;e.name="sun_orion_spur_beacon";const t=this.config.sunDistance,i=Qi*Ae,a=new P(0,i,t);e.position.copy(a);const s=new V,o=64,r=[],n=450;for(let D=0;D<=o;D++){const R=D/o*Math.PI*2;r.push(new P(Math.cos(R)*n,0,Math.sin(R)*n))}s.setFromPoints(r);const l=new We({color:16766720,transparent:!0,opacity:.9}),h=new Ie(s,l);e.add(h);const m=new V,p=[],g=750;for(let D=0;D<=o;D++){const R=D/o*Math.PI*2;p.push(new P(Math.cos(R)*g,0,Math.sin(R)*g))}m.setFromPoints(p);const v=new Qt({color:16771704,dashSize:40,gapSize:25,transparent:!0,opacity:.65}),y=new Ie(m,v);y.computeLineDistances(),e.add(y);const M=new re(180,16,12),x=new Ut({color:16771976,transparent:!0,opacity:.95,blending:Y}),b=new F(M,x);e.add(b);const A=new V().setFromPoints([new P(0,-i,0),new P(0,0,0)]),f=new Qt({color:16769138,dashSize:22,gapSize:15,transparent:!0,opacity:.55}),S=new Ie(A,f);return S.computeLineDistances(),e.add(S),{beaconGroup:e,reticleMesh:h,pulseMesh:b,radarRing:y,sunPos:a}}getGalacticCenterWorldPosition(e=new P){return this.group.updateWorldMatrix(!0,!1),this.group.getWorldPosition(e)}setOpacity(e){const t=Math.max(0,Math.min(1,e));if(this.opacityUniform.value=t,this.group.visible=t>.005,this.group.visible&&!this.diskTextureRequested){this.diskTextureRequested=!0;const i=Ve.getInstance().getMilkyWayDiskTexture();i.wrapS=L,i.wrapT=L,this.diskTextureUniform.value=i}this.sagittariusAStar&&this.sagittariusAStar.setOpacity(t),this.sunReticleMesh&&(this.sunReticleMesh.material.opacity=t*.9),this.sunRadarRing&&(this.sunRadarRing.material.opacity=t*.65),this.sunPulseMesh&&(this.sunPulseMesh.material.opacity=t*.95)}update(e,t){if(this.timeUniform.value=e,this.sagittariusAStar&&t){this.sagittariusAStar.update(t,e);const i=t.position.clone();this.group.worldToLocal(i);const a=i.length(),s=O.clamp((a-450)/2200,0,1);this.bulgeFadeUniform.value=s}if(this.sunPulseMesh&&this.group.visible){const i=1+.22*Math.sin(e*3.5);this.sunPulseMesh.scale.set(i,i,i)}this.sunReticleMesh&&this.group.visible&&(this.sunReticleMesh.rotation.y=e*.35),this.sunRadarRing&&this.group.visible&&(this.sunRadarRing.rotation.y=-e*.22)}dispose(){this.sagittariusAStar.dispose(),this.masterDiskMesh.geometry.dispose(),this.masterDiskMesh.material.dispose(),this.coreBulgeMesh.geometry.dispose(),this.coreBulgeMesh.material.dispose(),this.dustExtinctionMesh.geometry.dispose(),this.dustExtinctionMesh.material.dispose(),this.starPoints.geometry.dispose(),this.starPoints.material.dispose(),this.sunReticleMesh.geometry.dispose(),this.sunReticleMesh.material.dispose(),this.sunRadarRing.geometry.dispose(),this.sunRadarRing.material.dispose(),this.sunPulseMesh.geometry.dispose(),this.sunPulseMesh.material.dispose(),this.satelliteGroup.traverse(e=>{(e instanceof F||e instanceof me)&&(e.geometry.dispose(),Array.isArray(e.material)?e.material.forEach(t=>t.dispose()):e.material.dispose())})}}class es{constructor(){u(this,"mesh");u(this,"count",700);u(this,"positions");u(this,"colors");u(this,"relativePositions");u(this,"radius",110);u(this,"currentSpeed",0);this.positions=new Float32Array(this.count*2*3),this.colors=new Float32Array(this.count*2*3),this.relativePositions=new Float32Array(this.count*3);for(let i=0;i<this.count;i++){const a=Math.random(),s=(.2+.8*Math.cbrt(a))*this.radius,o=Math.random()*Math.PI*2,r=Math.acos(2*Math.random()-1);this.relativePositions[i*3]=s*Math.sin(r)*Math.cos(o),this.relativePositions[i*3+1]=s*Math.sin(r)*Math.sin(o),this.relativePositions[i*3+2]=s*Math.cos(r)}const e=new V;e.setAttribute("position",new j(this.positions,3)),e.setAttribute("color",new j(this.colors,3));const t=new We({vertexColors:!0,transparent:!0,blending:Y,depthWrite:!1});this.mesh=new ua(e,t),this.mesh.name="velocity_travel_particles",this.mesh.frustumCulled=!1}update(e,t,i,a){const s=t.length(),o=s+Math.abs(i)*45;this.currentSpeed+=(o-this.currentSpeed)*Math.min(1,a*8);const r=this.currentSpeed>.8,n=Math.min(28,this.currentSpeed*.16+Math.abs(i)*14),l=Math.min(.85,Math.max(.08,(this.currentSpeed-.5)*.08));let h=0,m=0,p=-1;s>.01?(h=-t.x/s,m=-t.y/s,p=-t.z/s):Math.abs(i)>.01&&(p=i>0?1:-1);const g=this.mesh.geometry.attributes.position,v=this.mesh.geometry.attributes.color,y=this.radius*2,M=this.radius;for(let x=0;x<this.count;x++){const b=x*3,A=x*6,f=x*6+3;r&&(this.relativePositions[b]+=h*this.currentSpeed*a*.5,this.relativePositions[b+1]+=m*this.currentSpeed*a*.5,this.relativePositions[b+2]+=p*this.currentSpeed*a*.5);for(let U=0;U<3;U++)this.relativePositions[b+U]>M?this.relativePositions[b+U]-=y:this.relativePositions[b+U]<-M&&(this.relativePositions[b+U]+=y);const S=e.x+this.relativePositions[b],D=e.y+this.relativePositions[b+1],R=e.z+this.relativePositions[b+2];this.positions[A]=S,this.positions[A+1]=D,this.positions[A+2]=R,n>.4?(this.positions[f]=S+h*n,this.positions[f+1]=D+m*n,this.positions[f+2]=R+p*n):(this.positions[f]=S+.05,this.positions[f+1]=D+.05,this.positions[f+2]=R+.05);const N=l*1.2,I=l*.15;this.colors[A]=.88*N,this.colors[A+1]=.92*N,this.colors[A+2]=1*N,this.colors[f]=.65*I,this.colors[f+1]=.8*I,this.colors[f+2]=.95*I}g.needsUpdate=!0,v.needsUpdate=!0}dispose(){this.mesh.geometry.dispose(),this.mesh.material.dispose()}}const ts=[[54061,53910],[53910,58001],[58001,59774],[59774,54061],[59774,62956],[62956,65378],[65378,67301],[27989,25336],[27989,26207],[25336,26207],[27989,26727],[25336,25930],[25930,26311],[26311,26727],[26727,27366],[25930,24436],[746,3179],[3179,4427],[4427,6686],[6686,8886],[60718,61084],[62434,59747],[102098,100453],[100453,95947],[102488,100453],[100453,97165],[49669,50583],[50583,50335],[50335,48455],[50583,54872],[54872,57632],[57632,54879],[54879,49669],[80763,78820],[78820,78401],[80763,82396],[82396,86228],[86228,85927],[32349,30324],[32349,33579],[33579,34444],[34444,35904],[91262,91971],[91971,92420],[92420,93194],[93194,92791],[92791,91971]],Z=class Z{constructor(){u(this,"group",new ie);u(this,"celestialGroup",new ie);u(this,"pointsMesh");u(this,"localInterstellarStars");u(this,"constellationLines");u(this,"milkyWayMesh");u(this,"milkyWayOpacityUniform",{value:1});u(this,"resolvedMilkyWay");u(this,"stardustMesh");u(this,"externalGalaxy");u(this,"travelParticles");u(this,"isLoaded",!1);u(this,"localStarsOpacity",{value:0});this.group.name="starfield_hipparcos",this.group.add(this.celestialGroup),this.celestialGroup.name="celestial_infinite_sphere",this.buildMilkyWayBackground(),this.buildResolvedMilkyWayStars(),this.build3DCosmicStardust(),this.externalGalaxy=new Ne,this.group.add(this.externalGalaxy.group),this.travelParticles=new es,this.group.add(this.travelParticles.mesh),this.loadCatalog()}buildMilkyWayBackground(){const e=new re(Z.SPHERE_RADIUS*1.05,64,48),t=Ve.getInstance().getMilkyWayTexture(),i=new k({uniforms:{milkyWayMap:{value:t},uOpacity:this.milkyWayOpacityUniform},vertexShader:`
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
          // Mirror u: the panorama is drawn as seen from inside the celestial sphere
          vec2 uv = vec2(1.0 - vUv.x, vUv.y);
          // The Gaia map is a star-count image: off the plane it is shot noise. A small texel-scale
          // average removes the speckle (resolved stars are drawn separately as points).
          vec2 t = vec2(1.0 / 4000.0, 1.0 / 2000.0);
          vec3 rgb = texture2D(milkyWayMap, uv).rgb * 0.36;
          rgb += texture2D(milkyWayMap, uv + vec2( t.x, 0.0)).rgb * 0.16;
          rgb += texture2D(milkyWayMap, uv + vec2(-t.x, 0.0)).rgb * 0.16;
          rgb += texture2D(milkyWayMap, uv + vec2(0.0,  t.y)).rgb * 0.16;
          rgb += texture2D(milkyWayMap, uv + vec2(0.0, -t.y)).rgb * 0.16;

          // Black point above the high-latitude count noise, gentle toe so the band edges fade
          // naturally into a deep, clean sky; keep the warm bulge and dark dust lanes.
          rgb = max(rgb - 0.075, 0.0) / 0.925;
          rgb = pow(rgb, vec3(1.12));
          float l = dot(rgb, vec3(0.2126, 0.7152, 0.0722));
          rgb = mix(vec3(l), rgb, 1.15);

          gl_FragColor = vec4(rgb, uOpacity);
        }
      `,side:He,transparent:!0,depthWrite:!1});this.milkyWayMesh=new F(e,i),this.milkyWayMesh.name="milky_way_skybox",this.milkyWayMesh.renderOrder=-10;const a=z.galacticBasisThree(),s=new pe().makeBasis(new P(...a.x),new P(...a.z),new P(...a.y).negate());this.milkyWayMesh.quaternion.setFromRotationMatrix(s),this.celestialGroup.add(this.milkyWayMesh)}buildResolvedMilkyWayStars(e=26e3){if(typeof document>"u")return;const t="/solaris/".replace(/\/?$/,"/");new ti().load(`${t}textures/gaia_sky.webp`,i=>{const o=document.createElement("canvas");o.width=1024,o.height=512;const r=o.getContext("2d",{willReadFrequently:!0});if(!r)return;r.drawImage(i,0,0,1024,512);const n=r.getImageData(0,0,1024,512).data,l=new Float64Array(1024*512);let h=0;for(let f=0;f<512;f++){const S=Math.cos((.5-(f+.5)/512)*Math.PI);for(let D=0;D<1024;D++){const R=(f*1024+D)*4,N=(.2126*n[R]+.7152*n[R+1]+.0722*n[R+2])/255;h+=Math.pow(Math.max(0,N-.07),2.2)*S,l[f*1024+D]=h}}if(h<=0)return;const m=z.galacticBasisThree(),p=new Float32Array(e*3),g=new Float32Array(e*3),v=new Float32Array(e);let y=1592594996;const M=()=>{y=y+1831565813>>>0;let f=y;return f=Math.imul(f^f>>>15,f|1),f^=f+Math.imul(f^f>>>7,f|61),((f^f>>>14)>>>0)/4294967296},x=Z.SPHERE_RADIUS*.996;for(let f=0;f<e;f++){const S=M()*h;let D=0,R=l.length-1;for(;D<R;){const le=D+R>>>1;l[le]<S?D=le+1:R=le}const N=D%1024,I=D/1024|0,U=(N+M())/1024,ee=(I+M())/512,Q=(.5-U)*2*Math.PI,ne=(.5-ee)*Math.PI,Te=Math.cos(ne)*Math.cos(Q),ue=Math.cos(ne)*Math.sin(Q),we=Math.sin(ne);p[f*3]=(m.x[0]*Te+m.y[0]*ue+m.z[0]*we)*x,p[f*3+1]=(m.x[1]*Te+m.y[1]*ue+m.z[1]*we)*x,p[f*3+2]=(m.x[2]*Te+m.y[2]*ue+m.z[2]*we)*x;const oe=D*4,be=Math.max(n[oe],n[oe+1],n[oe+2],1),se=.55;g[f*3]=n[oe]/be*(1-se)+se,g[f*3+1]=n[oe+1]/be*(1-se)+se,g[f*3+2]=n[oe+2]/be*(1-se)+se,v[f]=.55+Math.pow(M(),6)*1.6}const b=new V;b.setAttribute("position",new j(p,3)),b.setAttribute("color",new j(g,3)),b.setAttribute("size",new j(v,1));const A=new k({uniforms:{uOpacity:this.milkyWayOpacityUniform},vertexShader:`
          attribute float size;
          varying vec3 vColor;
          varying float vSize;
          void main() {
            vColor = color;
            vSize = size;
            gl_PointSize = size;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,fragmentShader:`
          uniform float uOpacity;
          varying vec3 vColor;
          varying float vSize;
          void main() {
            vec2 c = gl_PointCoord - 0.5;
            float d = dot(c, c);
            if (d > 0.25) discard;
            float a = exp(-d * 14.0) * clamp(vSize * 0.26, 0.08, 0.5) * uOpacity;
            gl_FragColor = vec4(vColor, a);
          }
        `,vertexColors:!0,transparent:!0,blending:Y,depthWrite:!1});this.resolvedMilkyWay=new me(b,A),this.resolvedMilkyWay.name="resolved_milky_way_stars",this.resolvedMilkyWay.renderOrder=-9,this.celestialGroup.add(this.resolvedMilkyWay)})}build3DCosmicStardust(){const t=new Float32Array(2400),i=new Float32Array(800*3),a=new Float32Array(800),s=new Float32Array(800);for(let n=0;n<800;n++){const l=30+Math.pow(Math.random(),.7)*750,h=Math.random()*Math.PI*2,m=(Math.random()-.5)*(90+l*.1);t[n*3]=Math.cos(h)*l,t[n*3+1]=m,t[n*3+2]=Math.sin(h)*l;const p=Math.random();p<.5?(i[n*3]=.9,i[n*3+1]=.92,i[n*3+2]=.98):p<.8?(i[n*3]=.98,i[n*3+1]=.85,i[n*3+2]=.6):(i[n*3]=.65,i[n*3+1]=.85,i[n*3+2]=.98),a[n]=1+Math.random()*1.5,s[n]=Math.random()*Math.PI*2}const o=new V;o.setAttribute("position",new j(t,3)),o.setAttribute("color",new j(i,3)),o.setAttribute("aScale",new j(a,1)),o.setAttribute("aPhase",new j(s,1));const r=new k({uniforms:{time:{value:0}},vertexShader:`
        attribute float aScale;
        attribute float aPhase;
        uniform float time;
        varying vec3 vColor;
        varying float vTwinkle;

        void main() {
          vColor = color;
          // No scintillation in vacuum: twinkling is an atmospheric effect
          vTwinkle = 0.8;
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
      `,vertexColors:!0,transparent:!0,blending:Y,depthWrite:!1});this.stardustMesh=new me(o,r),this.stardustMesh.name="cosmic_stardust_motes",this.stardustMesh.renderOrder=-2,this.group.add(this.stardustMesh)}async loadCatalog(){try{const e="/solaris/".replace(/\/?$/,"/"),t=await fetch(`${e}data/stars.json`);if(!t.ok)throw new Error(`Failed to fetch stars.json: HTTP ${t.status}`);const i=await t.json();this.buildStarfieldMesh(i),this.buildConstellations(i),this.isLoaded=!0}catch(e){console.warn("Could not stream Hipparcos stars dataset, using procedural fallback:",e),this.buildProceduralFallback()}}buildStarfieldMesh(e){const t=e.stars.filter(g=>g[4]<=4.6),i=t.length,a=new Float32Array(i*3),s=new Float32Array(i*3),o=new Float32Array(i),r=Z.SPHERE_RADIUS;for(let g=0;g<i;g++){const v=t[g],y=v[1],M=v[2],x=v[3],b=v[4],A=v[5],f=z.icrfToThree([y,M,x]);a[g*3]=f[0]*r,a[g*3+1]=f[1]*r,a[g*3+2]=f[2]*r;const S=this.bvToRGB(A,v[8]);s[g*3]=S.r,s[g*3+1]=S.g,s[g*3+2]=S.b;const D=Math.max(.6,2.8-.42*b);o[g]=D}const n=new V;n.setAttribute("position",new j(a,3)),n.setAttribute("color",new j(s,3)),n.setAttribute("size",new j(o,1));const l=`
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
    `,h=`
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
    `,m=new k({vertexShader:l,fragmentShader:h,vertexColors:!0,transparent:!0,blending:Y,depthWrite:!1});this.pointsMesh=new me(n,m),this.pointsMesh.renderOrder=0,this.celestialGroup.add(this.pointsMesh);const p=e.stars.filter(g=>g[6]!==null&&g[6]>0&&g[6]<120);if(p.length>0){const g=new Float32Array(p.length*3),v=new Float32Array(p.length*3),y=new Float32Array(p.length);for(let b=0;b<p.length;b++){const A=p[b],f=Z.LOCAL_STAR_OFFSET+A[6]*Z.LOCAL_UNITS_PER_PC,S=z.icrfToThree([A[1],A[2],A[3]]);g[b*3]=S[0]*f,g[b*3+1]=S[1]*f,g[b*3+2]=S[2]*f;const D=this.bvToRGB(A[5],A[8]);v[b*3]=D.r,v[b*3+1]=D.g,v[b*3+2]=D.b;const R=A[4];y[b]=Math.max(.8,2.6-.3*R)}const M=new V;M.setAttribute("position",new j(g,3)),M.setAttribute("color",new j(v,3)),M.setAttribute("size",new j(y,1));const x=new k({vertexShader:`
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
        `,fragmentShader:`uniform float uOpacity;
`+h.replace("gl_FragColor = vec4(vColor, alpha);","gl_FragColor = vec4(vColor, alpha * uOpacity);"),uniforms:{uOpacity:this.localStarsOpacity},vertexColors:!0,transparent:!0,blending:Y,depthWrite:!1});this.localInterstellarStars=new me(M,x),this.localInterstellarStars.visible=!1,this.localInterstellarStars.name="local_interstellar_3d_stars",this.localInterstellarStars.renderOrder=1,this.group.add(this.localInterstellarStars)}}buildConstellations(e){const t=new Map,i=Z.SPHERE_RADIUS*.998;for(const r of e.stars){const n=z.icrfToThree([r[1],r[2],r[3]]);t.set(r[0],[n[0]*i,n[1]*i,n[2]*i])}const a=[];for(const[r,n]of ts){const l=t.get(r),h=t.get(n);l&&h&&(a.push(l[0],l[1],l[2]),a.push(h[0],h[1],h[2]))}if(a.length===0)return;const s=new V;s.setAttribute("position",new Oe(a,3));const o=new We({color:5231045,transparent:!0,opacity:Z.CONSTELLATION_OPACITY,depthWrite:!1,blending:Y});this.constellationLines=new ua(s,o),this.constellationLines.name="constellation_lines",this.celestialGroup.add(this.constellationLines)}bvToRGB(e,t){if(e!==null)return e<-.1?new E(10335487):e<.15?new E(12374783):e<.35?new E(15791359):e<.6?new E(16775144):e<.85?new E(16770723):e<1.3?new E(16760437):new E(16747093);switch(t){case"O":return new E(10335487);case"B":return new E(12374783);case"A":return new E(15791359);case"F":return new E(16775144);case"G":return new E(16770723);case"K":return new E(16760437);case"M":return new E(16747093);default:return new E(16777215)}}buildProceduralFallback(){const t=new V,i=new Float32Array(6e3*3),a=new Float32Array(6e3*3),s=Z.SPHERE_RADIUS;for(let r=0;r<6e3;r++){const n=Math.random()*Math.PI*2,l=Math.acos(Math.random()*2-1);i[r*3]=s*Math.sin(l)*Math.cos(n),i[r*3+1]=s*Math.cos(l),i[r*3+2]=s*Math.sin(l)*Math.sin(n),a[r*3]=.9,a[r*3+1]=.92,a[r*3+2]=1}t.setAttribute("position",new j(i,3)),t.setAttribute("color",new j(a,3));const o=new da({size:2.5,vertexColors:!0,transparent:!0,opacity:.85});this.pointsMesh=new me(t,o),this.celestialGroup.add(this.pointsMesh)}update(e,t,i,a,s){this.celestialGroup.position.copy(e);const o=e.length(),r=this.externalGalaxy.getGalacticCenterWorldPosition(),n=e.distanceTo(r),l=O.clamp((o-3500)/18500,0,1),h=n<8e3?O.clamp((8e3-n)/4e3,0,1):0,m=Math.max(l,h),p=m*m*(3-2*m);if(this.externalGalaxy.setOpacity(p),this.milkyWayOpacityUniform.value=1-p,this.constellationLines&&(this.constellationLines.material.opacity=Z.CONSTELLATION_OPACITY*(1-p)),this.localInterstellarStars){const g=O.smoothstep(o,700,1600),v=1-O.smoothstep(o,9e3,2e4),y=g*v;this.localStarsOpacity.value=y,this.localInterstellarStars.visible=y>.005}this.externalGalaxy.update(performance.now()*.001,s),this.travelParticles.update(e,i||new P,a||0,t)}setConstellationsVisible(e){this.constellationLines&&(this.constellationLines.visible=e)}toggleConstellations(){return this.constellationLines?(this.constellationLines.visible=!this.constellationLines.visible,this.constellationLines.visible):!1}areConstellationsVisible(){var e;return((e=this.constellationLines)==null?void 0:e.visible)??!0}dispose(){this.externalGalaxy.dispose(),this.travelParticles.dispose(),this.localInterstellarStars&&(this.localInterstellarStars.geometry.dispose(),this.localInterstellarStars.material.dispose()),this.milkyWayMesh&&(this.milkyWayMesh.geometry.dispose(),this.milkyWayMesh.material.dispose()),this.pointsMesh&&(this.pointsMesh.geometry.dispose(),this.pointsMesh.material.dispose()),this.constellationLines&&(this.constellationLines.geometry.dispose(),this.constellationLines.material.dispose()),this.stardustMesh&&(this.stardustMesh.geometry.dispose(),this.stardustMesh.material.dispose()),this.resolvedMilkyWay&&(this.resolvedMilkyWay.geometry.dispose(),this.resolvedMilkyWay.material.dispose())}};u(Z,"SPHERE_RADIUS",8500),u(Z,"LOCAL_STAR_OFFSET",700),u(Z,"CONSTELLATION_OPACITY",.38),u(Z,"LOCAL_UNITS_PER_PC",38);let Ye=Z;const aa={Sun:{targetCoverageY:.85,ndcOffsetX:-.28,ndcOffsetY:0,fov:42,preferredElevation:Math.PI*.35},Mercury:{targetCoverageY:.92,ndcOffsetX:-.34,ndcOffsetY:0,fov:40,preferredElevation:Math.PI*.38},Venus:{targetCoverageY:.92,ndcOffsetX:-.34,ndcOffsetY:0,fov:40,preferredElevation:Math.PI*.38},Earth:{targetCoverageY:.94,ndcOffsetX:-.35,ndcOffsetY:0,fov:40,preferredElevation:Math.PI*.37},Mars:{targetCoverageY:.92,ndcOffsetX:-.34,ndcOffsetY:0,fov:40,preferredElevation:Math.PI*.38},Jupiter:{targetCoverageY:1.08,ndcOffsetX:-.38,ndcOffsetY:0,fov:41,preferredElevation:Math.PI*.39},Saturn:{targetCoverageY:.88,ndcOffsetX:-.28,ndcOffsetY:0,fov:41,effectiveRadiusMultiplier:1.95,preferredElevation:Math.PI*.32},Uranus:{targetCoverageY:.92,ndcOffsetX:-.34,ndcOffsetY:0,fov:40,preferredElevation:Math.PI*.38},Neptune:{targetCoverageY:.92,ndcOffsetX:-.34,ndcOffsetY:0,fov:40,preferredElevation:Math.PI*.38},Pluto:{targetCoverageY:.9,ndcOffsetX:-.32,ndcOffsetY:0,fov:39,preferredElevation:Math.PI*.38},"Sagittarius A*":{targetCoverageY:.88,ndcOffsetX:.22,ndcOffsetY:-.02,fov:40,preferredElevation:Math.PI*.42}},Pt={targetCoverageY:.92,ndcOffsetX:-.34,ndcOffsetY:0,fov:40,preferredElevation:Math.PI*.38},as={targetCoverageY:.88,ndcOffsetX:-.33,ndcOffsetY:0,fov:39,preferredElevation:Math.PI*.38},Ge=55,is=2.12,ss=6371;function os(c,e=1.25){const t=1+is*Math.sqrt(ss/Math.max(.001,c));return Math.max(e,t)}const te=class te{constructor(e){u(this,"camera");u(this,"subjectAnchor",new P(0,0,0));u(this,"orbitPivot",new P(0,0,0));u(this,"aimPoint",new P(0,0,0));u(this,"currentNdcOffset",new X(-.34,0));u(this,"targetNdcOffset",new X(-.34,0));u(this,"shotMode","cinematic_observation");u(this,"effectiveAnchor",new P(0,0,0));u(this,"currentVelocity",new P(0,0,0));u(this,"lastCameraPos",new P(0,0,0));u(this,"lastRadius",680);u(this,"zoomRate",0);u(this,"lastUpdateTime",performance.now());u(this,"hasMotionSample",!1);u(this,"motionBasis","relative");u(this,"tmpRelPos",new P);u(this,"spherical",new Se(680,Math.PI*.3,Math.PI*.25));u(this,"targetSpherical",new Se(680,Math.PI*.3,Math.PI*.25));u(this,"panOffset",new P(0,0,0));u(this,"targetPanOffset",new P(0,0,0));u(this,"focusedObject",null);u(this,"focusDistance",30);u(this,"focusedRadius",2.8);u(this,"focusedPhysicalRadiusKm",null);u(this,"surfaceMinAltitude",null);u(this,"distanceModel","exploration");u(this,"transition",null);u(this,"isOrbiting",!1);u(this,"isPanning",!1);u(this,"previousMousePosition",{x:0,y:0});u(this,"lastInteractionTime",performance.now());u(this,"activeTouches",new Map);u(this,"initialPinchDist",0);u(this,"initialRadiusOnPinch",0);u(this,"enableIdleDrift",!0);u(this,"damping",.12);u(this,"lookYaw",0);u(this,"lookPitch",0);u(this,"targetLookYaw",0);u(this,"targetLookPitch",0);u(this,"isLooking",!1);u(this,"heldLookKeys",new Set);u(this,"lastLookUpdate",performance.now());u(this,"domElement");u(this,"onMouseDown",e=>{if(this.lastInteractionTime=performance.now(),this.transition){this.transition=null;const t=new P().subVectors(this.camera.position,this.orbitPivot);this.spherical.setFromVector3(t),this.targetSpherical.copy(this.spherical)}e.button===0?e.shiftKey?this.isPanning=!0:this.isOrbiting=!0:e.button===1?this.isPanning=!0:e.button===2&&(this.isLooking=!0),this.previousMousePosition={x:e.clientX,y:e.clientY}});u(this,"onMouseUp",()=>{this.isOrbiting=!1,this.isPanning=!1,this.isLooking=!1,this.lastInteractionTime=performance.now()});u(this,"onMouseMove",e=>{if(this.lastInteractionTime=performance.now(),!this.isOrbiting&&!this.isPanning&&!this.isLooking)return;const t=e.clientX-this.previousMousePosition.x,i=e.clientY-this.previousMousePosition.y;if(this.previousMousePosition={x:e.clientX,y:e.clientY},this.isLooking){const a=O.degToRad(this.camera.fov)/Math.max(1,this.domElement.clientHeight||800);this.targetLookYaw+=t*a,this.targetLookPitch+=i*a;return}if(this.isOrbiting){const a=.005*Math.min(1,Math.max(5e-4,this.altitudeInRadii()));this.targetSpherical.theta-=t*a,this.targetSpherical.phi-=i*a,this.targetSpherical.phi=Math.max(.02,Math.min(Math.PI-.02,this.targetSpherical.phi))}else if(this.isPanning){const a=this.spherical.radius*.001,s=new P,o=new P;this.camera.matrixWorld.extractBasis(s,o,new P),this.targetPanOffset.addScaledVector(s,-t*a),this.targetPanOffset.addScaledVector(o,i*a)}});u(this,"onWheel",e=>{if(e.preventDefault(),this.lastInteractionTime=performance.now(),this.transition){this.transition=null;const o=new P().subVectors(this.camera.position,this.orbitPivot);this.spherical.setFromVector3(o),this.targetSpherical.copy(this.spherical)}const t=Math.pow(.92,e.deltaY*.012),i=this.minimumDistance(),a=18e4;let s;if(this.focusedObject&&!this.isBlackHoleFocus()&&this.targetSpherical.radius<this.focusedRadius*4){const o=this.targetSpherical.radius-this.focusedRadius;s=this.focusedRadius+o*t}else s=this.targetSpherical.radius*t;this.targetSpherical.radius=Math.max(i,Math.min(a,s))});u(this,"onContextMenu",e=>{e.preventDefault()});u(this,"onTouchStart",e=>{if(this.lastInteractionTime=performance.now(),this.transition){this.transition=null;const t=new P().subVectors(this.camera.position,this.orbitPivot);this.spherical.setFromVector3(t),this.targetSpherical.copy(this.spherical)}for(let t=0;t<e.changedTouches.length;t++){const i=e.changedTouches[t];this.activeTouches.set(i.identifier,{x:i.clientX,y:i.clientY})}if(this.activeTouches.size===2){const t=Array.from(this.activeTouches.values());this.initialPinchDist=Math.hypot(t[0].x-t[1].x,t[0].y-t[1].y),this.initialRadiusOnPinch=this.targetSpherical.radius}});u(this,"onTouchMove",e=>{if(this.lastInteractionTime=performance.now(),this.activeTouches.size===1&&e.touches.length===1){const t=e.touches[0],i=this.activeTouches.get(t.identifier);if(i){const a=t.clientX-i.x,s=t.clientY-i.y,o=.006*Math.min(1,Math.max(5e-4,this.altitudeInRadii()));this.targetSpherical.theta-=a*o,this.targetSpherical.phi-=s*o,this.targetSpherical.phi=Math.max(.02,Math.min(Math.PI-.02,this.targetSpherical.phi)),this.activeTouches.set(t.identifier,{x:t.clientX,y:t.clientY})}}else if(this.activeTouches.size>=2&&e.touches.length>=2){const t=[e.touches[0],e.touches[1]],i=Math.hypot(t[0].clientX-t[1].clientX,t[0].clientY-t[1].clientY);if(this.initialPinchDist>0){const a=this.initialPinchDist/i,s=this.minimumDistance();let o=this.initialRadiusOnPinch*a;this.focusedObject&&!this.isBlackHoleFocus()&&this.initialRadiusOnPinch<this.focusedRadius*4&&(o=this.focusedRadius+(this.initialRadiusOnPinch-this.focusedRadius)*a),this.targetSpherical.radius=Math.max(s,Math.min(18e4,o))}}});u(this,"onTouchEnd",e=>{this.lastInteractionTime=performance.now();for(let t=0;t<e.changedTouches.length;t++)this.activeTouches.delete(e.changedTouches[t].identifier);this.activeTouches.size<2&&(this.initialPinchDist=0)});u(this,"onKeyDown",e=>{if(!te.LOOK_KEYS.has(e.key))return;const t=e.target;t&&(t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.isContentEditable)||(e.preventDefault(),this.heldLookKeys.add(e.key))});u(this,"onKeyUp",e=>{this.heldLookKeys.delete(e.key)});u(this,"onWindowBlur",()=>{this.heldLookKeys.clear(),this.isLooking=!1});u(this,"onDoubleClick",()=>{this.resetLook()});this.domElement=e,this.camera=new ai(45,e.clientWidth/e.clientHeight,.05,16e4),this.updateCameraPosition(),this.setupEventListeners(e)}static calculateViewingDistance(e,t,i=t.fov){const a=e*(t.effectiveRadiusMultiplier||1),s=O.degToRad(i*.5),o=Math.tan(s),r=Math.max(.1,t.targetCoverageY),n=a/(r*o);return Math.max(a*1.15,n)}getResponsiveNdcOffset(e,t,i){let a=e,s=t;if(i>=1.5)a=e,s=t;else if(i>=1){const o=(i-1)/.5;a=e*(.45+.55*o),s=t}else a=e*.15,s=-.1;return{x:a,y:s}}calculateAimPoint(e,t,i,a,s,o){if(Math.abs(i)<.001&&Math.abs(a)<.001)return t.clone();const r=new P().subVectors(t,e),n=r.length();if(n<.001)return t.clone();const l=r.clone().divideScalar(n),h=new P(0,1,0);let m=new P().crossVectors(l,h);m.lengthSq()<1e-4&&(m=new P().crossVectors(l,new P(0,0,1))),m.normalize();const p=new P().crossVectors(m,l).normalize(),g=this.getResponsiveNdcOffset(i,a,o),v=O.degToRad(s*.5),y=Math.tan(v),M=o*y,x=g.x*n*M,b=g.y*n*y;return new P().copy(t).addScaledVector(m,-x).addScaledVector(p,-b)}updateCameraPosition(){if(this.transition){const r=performance.now()-this.transition.startTime,n=Math.min(1,r/this.transition.durationMs),l=n<.5?16*Math.pow(n,5):1-Math.pow(-2*n+2,5)/2;this.transition.targetObject?(this.transition.targetObject.updateWorldMatrix(!0,!1),this.transition.targetObject.getWorldPosition(this.subjectAnchor)):this.subjectAnchor.set(0,0,0),this.camera.fov=O.lerp(this.transition.startFov,this.transition.targetFov,l),this.currentNdcOffset.x=O.lerp(this.transition.startNdcOffsetX,this.transition.targetNdcOffsetX,l),this.currentNdcOffset.y=O.lerp(this.transition.startNdcOffsetY,this.transition.targetNdcOffsetY,l);const h=O.lerp(this.spherical.theta,this.transition.targetTheta,l),m=O.lerp(this.spherical.phi,this.transition.targetPhi,l),p=O.lerp(this.spherical.radius,this.transition.targetDistance,l);this.orbitPivot.lerpVectors(this.transition.startPivot,this.subjectAnchor,l);const g=new P().setFromSphericalCoords(p,m,h);this.camera.position.copy(this.orbitPivot).add(g),this.aimPoint=this.calculateAimPoint(this.camera.position,this.orbitPivot,this.currentNdcOffset.x,this.currentNdcOffset.y,this.camera.fov,this.camera.aspect),this.camera.lookAt(this.aimPoint),this.applyLookOffset();const v=Math.max(this.focusedObject?1e-4:.05,p-this.focusedRadius);this.camera.near=Math.max(this.focusedObject?1e-5:.04,v*.08),this.camera.far=Math.max(16e4,p*30),this.camera.updateProjectionMatrix(),this.trackMotion(this.tmpRelPos.copy(this.camera.position),p,"absolute"),n>=1&&(this.transition.onComplete&&this.transition.onComplete(),this.spherical.set(p,m,h),this.targetSpherical.copy(this.spherical),this.panOffset.set(0,0,0),this.targetPanOffset.set(0,0,0),this.transition=null);return}let e=this.subjectAnchor;if(this.focusedObject){this.focusedObject.updateWorldMatrix(!0,!1),this.focusedObject.getWorldPosition(this.subjectAnchor);const o=this.spherical.radius;if(!(this.focusedObject.name.includes("sagittarius")||this.focusedObject.name==="Sagittarius A*")&&o>320){const n=Math.min(1,(o-320)/480);this.effectiveAnchor.lerpVectors(this.subjectAnchor,te.ORIGIN_VEC,n),e=this.effectiveAnchor}else e=this.subjectAnchor}else this.subjectAnchor.set(0,0,0),e=this.subjectAnchor;this.currentNdcOffset.x+=(this.targetNdcOffset.x-this.currentNdcOffset.x)*this.damping,this.currentNdcOffset.y+=(this.targetNdcOffset.y-this.currentNdcOffset.y)*this.damping,this.panOffset.lerp(this.targetPanOffset,this.damping),this.orbitPivot.copy(e).add(this.panOffset),this.enableIdleDrift&&!this.isOrbiting&&!this.isPanning&&this.shotMode==="cinematic_observation"&&performance.now()-this.lastInteractionTime>3e3&&(this.targetSpherical.theta+=8e-5),this.spherical.theta+=(this.targetSpherical.theta-this.spherical.theta)*this.damping,this.spherical.phi+=(this.targetSpherical.phi-this.spherical.phi)*this.damping,this.spherical.radius+=(this.targetSpherical.radius-this.spherical.radius)*this.damping,this.spherical.phi=Math.max(.02,Math.min(Math.PI-.02,this.spherical.phi));const t=new P().setFromSpherical(this.spherical);this.camera.position.copy(this.orbitPivot).add(t);const i=this.compositionWeight();this.aimPoint=this.calculateAimPoint(this.camera.position,this.orbitPivot,this.currentNdcOffset.x*i,this.currentNdcOffset.y*i,this.camera.fov,this.camera.aspect),this.camera.lookAt(this.aimPoint),this.applyLookOffset();const a=this.spherical.radius,s=Math.max(this.focusedObject?1e-4:.05,a-this.focusedRadius);this.camera.near=Math.max(this.focusedObject?1e-5:.04,Math.min(30,s*.08)),this.camera.far=Math.max(25e4,a*35),this.camera.updateProjectionMatrix(),this.trackMotion(this.tmpRelPos.subVectors(this.camera.position,this.orbitPivot),this.spherical.radius,"relative")}trackMotion(e,t,i){const a=performance.now(),s=Math.max(.001,(a-this.lastUpdateTime)*.001);i!==this.motionBasis&&(this.motionBasis=i,this.hasMotionSample=!1),this.hasMotionSample&&(this.currentVelocity.subVectors(e,this.lastCameraPos).divideScalar(s),this.lastRadius>.001&&(this.zoomRate=(Math.log(t)-Math.log(this.lastRadius))/s)),this.hasMotionSample=!0,this.lastCameraPos.copy(e),this.lastRadius=t,this.lastUpdateTime=a}update(){this.updateLook(),this.updateCameraPosition()}updateLook(){const e=performance.now(),t=Math.min(.1,Math.max(0,(e-this.lastLookUpdate)*.001));if(this.lastLookUpdate=e,this.heldLookKeys.size>0){const i=te.LOOK_KEY_RATE*(this.camera.fov/Ge)*t;this.heldLookKeys.has("ArrowLeft")&&(this.targetLookYaw+=i),this.heldLookKeys.has("ArrowRight")&&(this.targetLookYaw-=i),this.heldLookKeys.has("ArrowUp")&&(this.targetLookPitch+=i),this.heldLookKeys.has("ArrowDown")&&(this.targetLookPitch-=i),this.lastInteractionTime=e}this.targetLookPitch=O.clamp(this.targetLookPitch,-te.MAX_LOOK_PITCH,te.MAX_LOOK_PITCH),this.lookYaw+=(this.targetLookYaw-this.lookYaw)*this.damping,this.lookPitch+=(this.targetLookPitch-this.lookPitch)*this.damping}applyLookOffset(){Math.abs(this.lookYaw)<1e-6&&Math.abs(this.lookPitch)<1e-6||(this.camera.rotateY(this.lookYaw),this.camera.rotateX(this.lookPitch))}isBlackHoleFocus(){return!!this.focusedObject&&(this.focusedObject.name.includes("sagittarius")||this.focusedObject.name==="Sagittarius A*")}minimumDistance(){return this.isBlackHoleFocus()?65:this.focusedObject?this.surfaceMinAltitude!==null?this.focusedRadius+this.surfaceMinAltitude:this.focusedRadius*1.15:.35}altitudeInRadii(e=this.spherical.radius){return!this.focusedObject||this.focusedRadius<=0||this.isBlackHoleFocus()?1/0:Math.max(0,e/this.focusedRadius-1)}compositionWeight(){const e=this.altitudeInRadii();return isFinite(e)?O.smoothstep(e,.25,1.2):1}applyFrameRotation(e){if(this.transition)return;const t=new P().setFromSpherical(this.spherical).applyQuaternion(e),i=new P().setFromSpherical(this.targetSpherical).applyQuaternion(e);this.spherical.setFromVector3(t),this.targetSpherical.setFromVector3(i),this.makeSphericalContinuous()}makeSphericalContinuous(){const e=Math.PI*2;for(;this.targetSpherical.theta-this.spherical.theta>Math.PI;)this.targetSpherical.theta-=e;for(;this.targetSpherical.theta-this.spherical.theta<-Math.PI;)this.targetSpherical.theta+=e}focusSurfacePoint(e,t,i,a,s=2200){this.focusedObject=e,this.focusedRadius=t,this.shotMode="free_inspection",this.resetLook(),typeof window<"u"&&window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches&&(s=150);const o=Math.max(this.minimumDistance(),t+a),r=new Se().setFromVector3(i.clone().normalize().multiplyScalar(o));for(r.phi=Math.max(.02,Math.min(Math.PI-.02,r.phi));r.theta-this.spherical.theta>Math.PI;)r.theta-=Math.PI*2;for(;r.theta-this.spherical.theta<-Math.PI;)r.theta+=Math.PI*2;this.targetNdcOffset.set(0,0),this.targetPanOffset.set(0,0,0),this.panOffset.set(0,0,0),this.transition={startPos:this.camera.position.clone(),startAimPoint:this.aimPoint.clone(),startFov:this.camera.fov,startNdcOffsetX:this.currentNdcOffset.x,startNdcOffsetY:this.currentNdcOffset.y,startPivot:this.orbitPivot.clone(),startSpherical:this.spherical.clone(),targetObject:e,targetRadius:t,targetBodyName:e.name,targetShotMode:"free_inspection",targetFov:Ge,targetNdcOffsetX:0,targetNdcOffsetY:0,targetDistance:o,targetTheta:r.theta,targetPhi:r.phi,startTime:performance.now(),durationMs:s,onComplete:()=>{this.spherical.copy(r),this.targetSpherical.copy(r),this.camera.fov=Ge,this.currentNdcOffset.set(0,0)}}}resetLook(){this.targetLookYaw=0,this.targetLookPitch=0}getLookAngles(){return{yaw:this.lookYaw,pitch:this.lookPitch}}get lookAtTarget(){return this.aimPoint}focusCinematic(e,t,i="",a=1800,s,o){this.focusedObject=e,this.focusedRadius=t,this.shotMode="cinematic_observation",o!==void 0&&(this.focusedPhysicalRadiusKm=o),this.targetLookYaw=0,this.targetLookPitch=0,typeof window<"u"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches&&(a=150),e.updateWorldMatrix(!0,!1);const r=new P;e.getWorldPosition(r);const n=aa[i]||(t<1?as:Pt);this.targetNdcOffset.set(n.ndcOffsetX,n.ndcOffsetY);const l=i==="Sagittarius A*"||i==="Sgr A*"||i==="sagittarius_a_star";let h=n.fov,m;if(o!==void 0&&!l){const M=n.effectiveRadiusMultiplier?2.9:i==="Sun"?1.6:1.25;m=t*os(o,M),h=Ge}else m=te.calculateViewingDistance(t,n,n.fov);this.focusDistance=m;const p=new P().copy(r).negate(),g=p.lengthSq()<1||i==="Sun";g?p.set(0,0,1):p.normalize();let v;if(g)v=new P(0,.4,1).normalize().multiplyScalar(m);else if(i==="Saturn"){const M=new lt;e.getWorldQuaternion(M);const x=new P(0,1,0).applyQuaternion(M);x.dot(p)<0&&x.negate();const b=te.chooseObservationVantage(p,n.ndcOffsetX);b.addScaledVector(x,-b.dot(x)).normalize(),v=b.multiplyScalar(Math.cos(O.degToRad(30))).addScaledVector(x,Math.sin(O.degToRad(30))).normalize().multiplyScalar(m)}else if(i==="Sagittarius A*"||i==="Sgr A*"||i==="sagittarius_a_star"){const M=new lt;e.getWorldQuaternion(M),v=new P(.28,.25,.92).normalize().applyQuaternion(M).multiplyScalar(m)}else v=te.chooseObservationVantage(p,n.ndcOffsetX).multiplyScalar(m);const y=new Se().setFromVector3(v);y.phi=Math.max(.04,Math.min(Math.PI-.04,y.phi)),this.targetPanOffset.set(0,0,0),this.panOffset.set(0,0,0),this.transition={startPos:this.camera.position.clone(),startAimPoint:this.aimPoint.clone(),startFov:this.camera.fov,startNdcOffsetX:this.currentNdcOffset.x,startNdcOffsetY:this.currentNdcOffset.y,startPivot:this.orbitPivot.clone(),startSpherical:this.spherical.clone(),targetObject:e,targetRadius:t,targetBodyName:i,targetShotMode:"cinematic_observation",targetFov:h,targetNdcOffsetX:n.ndcOffsetX,targetNdcOffsetY:n.ndcOffsetY,targetDistance:m,targetTheta:y.theta,targetPhi:y.phi,startTime:performance.now(),durationMs:a,onComplete:()=>{this.spherical.copy(y),this.targetSpherical.copy(y),this.camera.fov=h,this.currentNdcOffset.set(n.ndcOffsetX,n.ndcOffsetY),s&&s()}}}static chooseObservationVantage(e,t=-.34){const i=e.clone().normalize(),a=new P(0,1,0),s=new P().crossVectors(a,i);s.lengthSq()<1e-8&&s.set(1,0,0),s.normalize();const o=new P().crossVectors(i,s).normalize(),r=z.galacticBasisThree(),n=new P(...r.z),l=new P(...r.x),h=O.degToRad(55),m=t<=0?1:-1;let p=new P().copy(i).multiplyScalar(Math.cos(h)).addScaledVector(s,Math.sin(h)),g=-1/0;const v=new P,y=new P,M=new P,x=new P,b=new P;for(let A=0;A<24;A++){const f=A/24*Math.PI*2;if(v.copy(i).multiplyScalar(Math.cos(h)).addScaledVector(s,Math.sin(h)*Math.cos(f)).addScaledVector(o,Math.sin(h)*Math.sin(f)).normalize(),Math.abs(v.y)>.75)continue;y.copy(v).negate(),M.crossVectors(y,a).normalize(),x.crossVectors(M,y).normalize(),b.copy(y).addScaledVector(M,.85*m).normalize();const S=1-Math.abs(b.dot(n)),D=Math.max(0,b.dot(l))*.35,R=Math.abs(v.y-.25)*.4,N=S+D-R;N>g&&(g=N,p=v.clone())}return p.normalize()}focusOn(e,t,i=1800){this.focusCinematic(e,t,e.name,i)}resetToOverview(e=1600){this.resetLook(),this.focusedObject=null,this.focusedRadius=48,this.shotMode="deep_space_overview",this.targetPanOffset.set(0,0,0),this.panOffset.set(0,0,0),this.targetNdcOffset.set(0,0),typeof window<"u"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches&&(e=150);const t=new Se(680,Math.PI*.3,Math.PI*.25);this.transition={startPos:this.camera.position.clone(),startAimPoint:this.aimPoint.clone(),startFov:this.camera.fov,startNdcOffsetX:this.currentNdcOffset.x,startNdcOffsetY:this.currentNdcOffset.y,startPivot:this.orbitPivot.clone(),startSpherical:this.spherical.clone(),targetObject:null,targetRadius:48,targetBodyName:"Overview",targetShotMode:"deep_space_overview",targetFov:45,targetNdcOffsetX:0,targetNdcOffsetY:0,targetDistance:680,targetTheta:t.theta,targetPhi:t.phi,startTime:performance.now(),durationMs:e,onComplete:()=>{this.spherical.copy(t),this.targetSpherical.copy(t),this.subjectAnchor.set(0,0,0),this.orbitPivot.set(0,0,0),this.camera.fov=45,this.currentNdcOffset.set(0,0)}}}transitionToDistance(e,t=45,i="deep_space_overview",a=1600,s,o){typeof window<"u"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches&&(a=150);let r;if(o)r=new Se().setFromVector3(o.clone().normalize().multiplyScalar(e)),r.phi=Math.max(.04,Math.min(Math.PI-.04,r.phi));else{const h=this.targetSpherical.theta,m=s!==void 0?s:Math.max(.08,Math.min(Math.PI*.45,this.targetSpherical.phi));r=new Se(e,m,h)}this.shotMode=i,this.targetPanOffset.set(0,0,0);const n=i==="cinematic_observation"?-.34:0,l=0;this.transition={startPos:this.camera.position.clone(),startAimPoint:this.aimPoint.clone(),startFov:this.camera.fov,startNdcOffsetX:this.currentNdcOffset.x,startNdcOffsetY:this.currentNdcOffset.y,startPivot:this.orbitPivot.clone(),startSpherical:this.spherical.clone(),targetObject:e<350?this.focusedObject:null,targetRadius:this.focusedRadius,targetBodyName:this.focusedObject?this.focusedObject.name:"Cosmos",targetShotMode:i,targetFov:t,targetNdcOffsetX:n,targetNdcOffsetY:l,targetDistance:e,targetTheta:r.theta,targetPhi:r.phi,startTime:performance.now(),durationMs:a,onComplete:()=>{this.spherical.copy(r),this.targetSpherical.copy(r),e>=350&&(this.subjectAnchor.set(0,0,0),this.orbitPivot.set(0,0,0)),this.camera.fov=t,this.currentNdcOffset.set(n,l),this.targetNdcOffset.set(n,l)}}}jumpToScale(e,t=1800){let i=680,a="scientific_overview",s=45,o,r;switch(e){case"planetary":i=this.focusedRadius>0?this.focusedRadius*2.8:12,a="cinematic_observation",s=40;break;case"inner_system":i=180,a="scientific_overview",s=45,o=Math.PI*.32;break;case"outer_system":i=1100,a="deep_space_overview",s=46,o=Math.PI*.28;break;case"interstellar":i=8200,a="deep_space_overview",s=48,o=Math.PI*.26;break;case"galactic":i=52e3,a="deep_space_overview",s=48;{const n=z.galacticBasisThree(),l=O.degToRad(35);r=new P(...n.z).multiplyScalar(Math.cos(l)).addScaledVector(new P(...n.x),-Math.sin(l))}break}this.transitionToDistance(i,s,a,t,o,r)}getVelocity(){return this.currentVelocity}getZoomVelocity(){return this.zoomRate}getTravelSpeed(){return this.currentVelocity.length()}getObserverScaleMetric(){const e=this.spherical.radius,t=a=>`${Math.round(a).toLocaleString("en-US")} KM`;if(this.focusedObject&&(this.focusedObject.name.includes("sagittarius")||this.focusedObject.name==="Sagittarius A*")){const a=e/Ea.schwarzschildRadius,s=a*$.derivedParameters.schwarzschildRadiusKm;return{distance:e,formatted:`${a.toFixed(1)} r_s (${t(s)})`,domain:"planetary"}}const i=this.focusedObject!==null&&this.focusedPhysicalRadiusKm!==null&&e<320;if(e<30||i){const a=this.distanceModel==="scientific"?fe.SCIENTIFIC_KM_PER_UNIT:this.focusedPhysicalRadiusKm&&this.focusedRadius>0?this.focusedPhysicalRadiusKm/this.focusedRadius:2654.5833333333335;return this.focusedObject&&this.focusedRadius>0&&e>this.focusedRadius?{distance:e,formatted:`ALT ${t((e-this.focusedRadius)*a)}`,domain:"planetary"}:{distance:e,formatted:t(e*a),domain:"planetary"}}if(e<3500){let a;if(this.distanceModel==="scientific")a=e*fe.SCIENTIFIC_KM_PER_UNIT/fe.AU_KM;else{const o=jt(1);a=e<o?e/o:Li(e)}const s=e<380?"inner_system":"outer_system";return{distance:e,formatted:`${a.toFixed(a<10?2:1)} AU`,domain:s}}if(e<25e3){const a=Math.max(0,e-Ye.LOCAL_STAR_OFFSET)/Ye.LOCAL_UNITS_PER_PC;return{distance:e,formatted:`${(a*3.26156).toFixed(1)} LY`,domain:"interstellar"}}return{distance:e,formatted:`${(e/Ae).toFixed(1)} KPC`,domain:"galactic"}}toggleFramingOffset(){if(Math.abs(this.targetNdcOffset.x)>.05)return this.targetNdcOffset.set(0,0),this.shotMode="free_inspection",!1;{const e=this.focusedObject&&aa[this.focusedObject.name]||Pt;return this.targetNdcOffset.set(e.ndcOffsetX,e.ndcOffsetY),this.shotMode="cinematic_observation",!0}}setupEventListeners(e){this.domElement=e,e&&e.addEventListener&&(e.addEventListener("mousedown",this.onMouseDown),e.addEventListener("wheel",this.onWheel,{passive:!1}),e.addEventListener("contextmenu",this.onContextMenu),e.addEventListener("touchstart",this.onTouchStart,{passive:!0}),e.addEventListener("dblclick",this.onDoubleClick)),typeof window<"u"&&(window.addEventListener("keydown",this.onKeyDown),window.addEventListener("keyup",this.onKeyUp),window.addEventListener("blur",this.onWindowBlur)),typeof window<"u"&&(window.addEventListener("mouseup",this.onMouseUp),window.addEventListener("mousemove",this.onMouseMove),window.addEventListener("touchmove",this.onTouchMove,{passive:!0}),window.addEventListener("touchend",this.onTouchEnd,{passive:!0}))}handleResize(e,t){this.camera.aspect=e/t,this.camera.updateProjectionMatrix()}dispose(){this.domElement&&this.domElement.removeEventListener&&(this.domElement.removeEventListener("mousedown",this.onMouseDown),this.domElement.removeEventListener("wheel",this.onWheel),this.domElement.removeEventListener("contextmenu",this.onContextMenu),this.domElement.removeEventListener("touchstart",this.onTouchStart),this.domElement.removeEventListener("dblclick",this.onDoubleClick)),typeof window<"u"&&(window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("keyup",this.onKeyUp),window.removeEventListener("blur",this.onWindowBlur),window.removeEventListener("mouseup",this.onMouseUp),window.removeEventListener("mousemove",this.onMouseMove),window.removeEventListener("touchmove",this.onTouchMove),window.removeEventListener("touchend",this.onTouchEnd))}};u(te,"ORIGIN_VEC",new P(0,0,0)),u(te,"LOOK_KEY_RATE",.9),u(te,"MAX_LOOK_PITCH",O.degToRad(80)),u(te,"LOOK_KEYS",new Set(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"]));let kt=te;const de=class de{constructor(e=Date.now()){u(this,"currentUtcMs");u(this,"lastPerfTimeMs");u(this,"isPaused",!1);u(this,"timeMultiplier",1);this.currentUtcMs=e,this.lastPerfTimeMs=performance.now()}update(e=performance.now()){const t=e-this.lastPerfTimeMs;if(this.lastPerfTimeMs=e,!this.isPaused&&t>0){const i=t*this.timeMultiplier;this.currentUtcMs+=i}return this.currentUtcMs}getUtcMs(){return this.currentUtcMs}setUtcMs(e){this.currentUtcMs=e,this.lastPerfTimeMs=performance.now()}getIsoString(){return new Date(this.currentUtcMs).toISOString()}getJulianDate(){return de.utcMsToJulianDate(this.currentUtcMs)}getJulianDateTDB(){return de.utcMsToJulianDate(this.currentUtcMs)+de.TT_MINUS_UTC_SECONDS/86400}getJulianCenturiesJ2000(){return(this.getJulianDateTDB()-de.J2000_JD)/36525}static utcMsToJulianDate(e){return e/864e5+24405875e-1}static julianDateToUtcMs(e){return(e-24405875e-1)*864e5}resetToJ2000(){this.setUtcMs(de.J2000_UTC_MS)}resetToNow(){this.setUtcMs(Date.now())}};u(de,"J2000_JD",2451545),u(de,"J2000_UTC_MS",946727935816),u(de,"TT_MINUS_UTC_SECONDS",69.184);let ke=de;const W=class W{static solveKepler(e,t,i=1e-12,a=25){const s=Math.PI*2;e=(e%s+s)%s,e>Math.PI&&(e-=s);let o;if(t<.18)o=e+t*Math.sin(e);else{const r=e<0?-1:1;o=e+r*.85*t}for(let r=0;r<a;r++){const n=o-t*Math.sin(o)-e;if(Math.abs(n)<i)return o;const l=1-t*Math.cos(o);if(Math.abs(l)<1e-15)break;const h=n/l;if(o-=h,Math.abs(h)<i)return o}return o}static elementsAt(e,t,i=W.GM_SUN){const a=(e.epochJd??W.J2000_JD)-W.J2000_JD,s=t-a,o=Math.PI/180,r=e.ratesPerCentury;if(r){const h=s/W.DAYS_PER_CENTURY;return{a:(e.semiMajorAxisAU+r.semiMajorAxisAU*h)*W.AU_KM,e:e.eccentricity+r.eccentricity*h,iDeg:e.inclinationDeg+r.inclinationDeg*h,nodeDeg:e.longitudeAscendingNodeDeg+r.longitudeAscendingNodeDeg*h,argPeriDeg:e.argumentPeriapsisDeg+r.argumentPeriapsisDeg*h,meanAnomalyRad:(e.meanAnomalyAtEpochDeg+r.meanAnomalyDeg*h)*o}}const n=e.semiMajorAxisKm,l=e.meanMotionDegPerDay!==void 0?e.meanMotionDegPerDay*o:Math.sqrt(i/(n*n*n))*86400;return{a:n,e:e.eccentricity,iDeg:e.inclinationDeg,nodeDeg:e.longitudeAscendingNodeDeg+(e.nodeRateDegPerDay??0)*s,argPeriDeg:e.argumentPeriapsisDeg+(e.periapsisArgRateDegPerDay??0)*s,meanAnomalyRad:e.meanAnomalyAtEpochDeg*o+l*s}}static propagate(e,t,i=W.GM_SUN){if(e.semiMajorAxisKm<=0)return{positionKm:[0,0,0],velocityKmPerSec:[0,0,0],trueAnomalyDeg:0,eccentricAnomalyDeg:0,distanceKm:0,speedKmPerSec:0};const a=W.elementsAt(e,t,i),s=a.a,o=a.e,r=W.solveKepler(a.meanAnomalyRad,o),n=Math.sin(r),l=Math.cos(r),h=Math.sqrt(1-o*o)*n/(1-o*l),m=(l-o)/(1-o*l),p=Math.atan2(h,m),g=s*(1-o*l),v=s*(l-o),y=s*Math.sqrt(1-o*o)*n,M=Math.sqrt(i*s)/g,x=-M*n,b=M*Math.sqrt(1-o*o)*l,{P:A,Q:f}=W.perifocalBasis(a.iDeg,a.argPeriDeg,a.nodeDeg),S=[v*A[0]+y*f[0],v*A[1]+y*f[1],v*A[2]+y*f[2]],D=[x*A[0]+b*f[0],x*A[1]+b*f[1],x*A[2]+b*f[2]],[R,N,I]=S,[U,ee,Q]=D,ne=Math.sqrt(U*U+ee*ee+Q*Q);return{positionKm:[R,N,I],velocityKmPerSec:[U,ee,Q],trueAnomalyDeg:(p*180/Math.PI%360+360)%360,eccentricAnomalyDeg:(r*180/Math.PI%360+360)%360,distanceKm:g,speedKmPerSec:ne}}static perifocalBasis(e,t,i){const a=e*Math.PI/180,s=t*Math.PI/180,o=i*Math.PI/180,r=Math.cos(o),n=Math.sin(o),l=Math.cos(a),h=Math.sin(a),m=Math.cos(s),p=Math.sin(s);return{P:[r*m-n*p*l,n*m+r*p*l,p*h],Q:[-r*p-n*m*l,-n*p+r*m*l,m*h]}}static sampleOrbitPath(e,t=128,i=0){const a=[];if(e.semiMajorAxisKm<=0)return a;const s=W.elementsAt(e,i),o=s.a,r=s.e,n=o*Math.sqrt(Math.max(0,1-r*r)),{P:l,Q:h}=W.perifocalBasis(s.iDeg,s.argPeriDeg,s.nodeDeg);for(let m=0;m<=t;m++){const p=m/t*Math.PI*2,g=o*(Math.cos(p)-r),v=n*Math.sin(p),y=[g*l[0]+v*h[0],g*l[1]+v*h[1],g*l[2]+v*h[2]];a.push(y)}return a}};u(W,"GM_SUN",1327124400419394e-4),u(W,"DAYS_PER_CENTURY",36525),u(W,"AU_KM",1495978707e-1),u(W,"J2000_JD",2451545);let ve=W;class ia{static createOrbitLine(e,t,i=0,a=180){if(e.orderFromSun===0||e.orbit.semiMajorAxisKm<=0)return null;const o=ve.sampleOrbitPath(e.orbit,a,i).map(h=>{const m=t.toRenderPosition(h,e);return new P(m[0],m[1],m[2])}),r=new V().setFromPoints(o),n=new We({color:new E(e.physical.colorHex||"#555566"),transparent:!0,opacity:e.category==="planet"?.3:.18,linewidth:1}),l=new Ie(r,n);return l.name=`kepler_orbit_${e.name}`,l}static createMoonOrbitLine(e,t,i,a=0,s=96){if(e.orbit.semiMajorAxisKm<=0)return null;const r=ve.sampleOrbitPath(e.orbit,s,a).map(m=>{const p=i.toMoonRenderPosition(m,e,[0,0,0],t);return new P(p[0],p[1],p[2])}),n=new V().setFromPoints(r),l=new We({color:new E(e.physical.colorHex||"#778899"),transparent:!0,opacity:.2,linewidth:1}),h=new Ie(n,l);return h.name=`kepler_moon_orbit_${e.name}`,h}}function rs(c=19890825){let e=c>>>0;return function(){let t=e+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}}class ns{constructor(e,t=19890825){u(this,"mesh");u(this,"count",3200);u(this,"elements",[]);u(this,"dummy",new ii);u(this,"transform");u(this,"seed");this.transform=e,this.seed=t;const i=new si(.35,1),a=i.attributes.position;for(let o=0;o<a.count;o++){const r=a.getX(o),n=a.getY(o),l=a.getZ(o),h=1+.22*Math.sin(r*5)*Math.cos(n*5+l*3);a.setXYZ(o,r*h,n*h,l*h)}i.computeVertexNormals();const s=new oi({roughness:.88,metalness:.12,vertexColors:!0});this.mesh=new ri(i,s,this.count),this.mesh.name="asteroid_belt_instanced",this.mesh.castShadow=!1,this.mesh.receiveShadow=!1,this.generateElements(),this.updatePositions(0)}generateElements(){const e=rs(this.seed),t=[{au:2.5,width:.045},{au:2.82,width:.04},{au:2.96,width:.035},{au:3.27,width:.05}],i=[];let a=0;for(;a<this.count;){const s=2.12+e()*1.16;let o=!1;for(const x of t)if(Math.abs(s-x.au)<x.width&&e()<.88){o=!0;break}if(o)continue;const r=.03+e()*.19,n=e()*e()*18,l=O.degToRad(n),h=e()*Math.PI*2,m=e()*Math.PI*2,p=e()*Math.PI*2,g=Math.pow(s,1.5)*365.25,v=Math.PI*2/g,y=.12+e()*.22;this.elements.push({semiMajorAxisAU:s,eccentricity:r,inclinationRad:l,longNodeRad:h,argPeriRad:m,meanAnomalyEpochRad:p,meanMotionRadPerDay:v,scale:y});const M=e();if(M<.7){const x=.28+e()*.18;i.push(new E(x*.95,x*.92,x*.88))}else if(M<.9){const x=.45+e()*.22;i.push(new E(x*1.05,x*.95,x*.8))}else{const x=.55+e()*.25;i.push(new E(x,x*.95,x*.9))}a++}for(let s=0;s<i.length;s++)this.mesh.setColorAt(s,i[s]);this.mesh.instanceColor&&(this.mesh.instanceColor.needsUpdate=!0)}updatePositions(e){const t=this.transform.mode==="scientific";for(let i=0;i<this.elements.length;i++){const a=this.elements[i],s=(a.meanAnomalyEpochRad+a.meanMotionRadPerDay*e)%(Math.PI*2),o=ve.solveKepler(s,a.eccentricity,1e-8,12),r=2*Math.atan2(Math.sqrt(1+a.eccentricity)*Math.sin(o/2),Math.sqrt(1-a.eccentricity)*Math.cos(o/2)),n=a.semiMajorAxisAU*(1-a.eccentricity*a.eccentricity)/(1+a.eccentricity*Math.cos(r)),l=r+a.argPeriRad,h=Math.cos(l),m=Math.sin(l),p=Math.cos(a.longNodeRad),g=Math.sin(a.longNodeRad),v=Math.cos(a.inclinationRad),y=Math.sin(a.inclinationRad),M=n,x=M*(p*h-g*m*v),b=M*(g*h+p*m*v),A=M*(m*y);let f,S,D;if(t){const N=fe.AU_KM/fe.SCIENTIFIC_KM_PER_UNIT;f=x*N,S=A*N,D=-b*N}else{const N=jt(n),I=Math.sqrt(x*x+b*b+A*A);f=x/I*N,S=A/I*N,D=-(b/I)*N}this.dummy.position.set(f,S,D);const R=a.scale*(t?.5:1);this.dummy.scale.set(R,R,R),this.dummy.rotation.set(s*2,s*3.5,s*1.5),this.dummy.updateMatrix(),this.mesh.setMatrixAt(i,this.dummy.matrix)}this.mesh.instanceMatrix.needsUpdate=!0}setVisible(e){this.mesh.visible=e}isVisible(){return this.mesh.visible}dispose(){this.mesh.geometry.dispose(),this.mesh.material.dispose()}}const Na={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class je{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const ls=new ni(-1,1,1,-1,0,1);class cs extends V{constructor(){super(),this.setAttribute("position",new Oe([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Oe([0,2,0,0,2,0],2))}}const hs=new cs;class Ft{constructor(e){this._mesh=new F(hs,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,ls)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class ka extends je{constructor(e,t){super(),this.textureID=t!==void 0?t:"tDiffuse",e instanceof k?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=ct.clone(e.uniforms),this.material=new k({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new Ft(this.material)}render(e,t,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class sa extends je{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,i){const a=e.getContext(),s=e.state;s.buffers.color.setMask(!1),s.buffers.depth.setMask(!1),s.buffers.color.setLocked(!0),s.buffers.depth.setLocked(!0);let o,r;this.inverse?(o=0,r=1):(o=1,r=0),s.buffers.stencil.setTest(!0),s.buffers.stencil.setOp(a.REPLACE,a.REPLACE,a.REPLACE),s.buffers.stencil.setFunc(a.ALWAYS,o,4294967295),s.buffers.stencil.setClear(r),s.buffers.stencil.setLocked(!0),e.setRenderTarget(i),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),s.buffers.color.setLocked(!1),s.buffers.depth.setLocked(!1),s.buffers.color.setMask(!0),s.buffers.depth.setMask(!0),s.buffers.stencil.setLocked(!1),s.buffers.stencil.setFunc(a.EQUAL,1,4294967295),s.buffers.stencil.setOp(a.KEEP,a.KEEP,a.KEEP),s.buffers.stencil.setLocked(!0)}}class ds extends je{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class us{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const i=e.getSize(new X);this._width=i.width,this._height=i.height,t=new ze(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Ke}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new ka(Na),this.copyPass.material.blending=li,this.clock=new ci}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let i=!1;for(let a=0,s=this.passes.length;a<s;a++){const o=this.passes[a];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(a),o.render(this.renderer,this.writeBuffer,this.readBuffer,e,i),o.needsSwap){if(i){const r=this.renderer.getContext(),n=this.renderer.state.buffers.stencil;n.setFunc(r.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),n.setFunc(r.EQUAL,1,4294967295)}this.swapBuffers()}sa!==void 0&&(o instanceof sa?i=!0:o instanceof ds&&(i=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new X);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const i=this._width*this._pixelRatio,a=this._height*this._pixelRatio;this.renderTarget1.setSize(i,a),this.renderTarget2.setSize(i,a);for(let s=0;s<this.passes.length;s++)this.passes[s].setSize(i,a)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class ms extends je{constructor(e,t,i=null,a=null,s=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=i,this.clearColor=a,this.clearAlpha=s,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new E}render(e,t,i){const a=e.autoClear;e.autoClear=!1;let s,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(s=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(s),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),e.autoClear=a}}const ps={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new E(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class Ue extends je{constructor(e,t,i,a){super(),this.strength=t!==void 0?t:1,this.radius=i,this.threshold=a,this.resolution=e!==void 0?new X(e.x,e.y):new X(256,256),this.clearColor=new E(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let s=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new ze(s,o,{type:Ke}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let m=0;m<this.nMips;m++){const p=new ze(s,o,{type:Ke});p.texture.name="UnrealBloomPass.h"+m,p.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(p);const g=new ze(s,o,{type:Ke});g.texture.name="UnrealBloomPass.v"+m,g.texture.generateMipmaps=!1,this.renderTargetsVertical.push(g),s=Math.round(s/2),o=Math.round(o/2)}const r=ps;this.highPassUniforms=ct.clone(r.uniforms),this.highPassUniforms.luminosityThreshold.value=a,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new k({uniforms:this.highPassUniforms,vertexShader:r.vertexShader,fragmentShader:r.fragmentShader}),this.separableBlurMaterials=[];const n=[3,5,7,9,11];s=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let m=0;m<this.nMips;m++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(n[m])),this.separableBlurMaterials[m].uniforms.invSize.value=new X(1/s,1/o),s=Math.round(s/2),o=Math.round(o/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const l=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=l,this.bloomTintColors=[new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const h=Na;this.copyUniforms=ct.clone(h.uniforms),this.blendMaterial=new k({uniforms:this.copyUniforms,vertexShader:h.vertexShader,fragmentShader:h.fragmentShader,blending:Y,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new E,this.oldClearAlpha=1,this.basic=new Ut,this.fsQuad=new Ft(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(e,t){let i=Math.round(e/2),a=Math.round(t/2);this.renderTargetBright.setSize(i,a);for(let s=0;s<this.nMips;s++)this.renderTargetsHorizontal[s].setSize(i,a),this.renderTargetsVertical[s].setSize(i,a),this.separableBlurMaterials[s].uniforms.invSize.value=new X(1/i,1/a),i=Math.round(i/2),a=Math.round(a/2)}render(e,t,i,a,s){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();const o=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),s&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=i.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let r=this.renderTargetBright;for(let n=0;n<this.nMips;n++)this.fsQuad.material=this.separableBlurMaterials[n],this.separableBlurMaterials[n].uniforms.colorTexture.value=r.texture,this.separableBlurMaterials[n].uniforms.direction.value=Ue.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[n]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[n].uniforms.colorTexture.value=this.renderTargetsHorizontal[n].texture,this.separableBlurMaterials[n].uniforms.direction.value=Ue.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[n]),e.clear(),this.fsQuad.render(e),r=this.renderTargetsVertical[n];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,s&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(i),this.fsQuad.render(e)),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=o}getSeperableBlurMaterial(e){const t=[];for(let i=0;i<e;i++)t.push(.39894*Math.exp(-.5*i*i/(e*e))/e);return new k({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new X(.5,.5)},direction:{value:new X(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}getCompositeMaterial(e){return new k({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}}Ue.BlurDirectionX=new X(1,0);Ue.BlurDirectionY=new X(0,1);const gs={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

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

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class fs extends je{constructor(){super();const e=gs;this.uniforms=ct.clone(e.uniforms),this.material=new hi({name:e.name,uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader}),this.fsQuad=new Ft(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,i){this.uniforms.tDiffuse.value=i.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},di.getTransfer(this._outputColorSpace)===ui&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===mi?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===pi?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===gi?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===ma?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===fi?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===vi&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}const ut={cinematic:{name:"cinematic",label:"Cinematic",distortion:.1,fisheyeMask:0,chromatic:.0035,edgeBlur:2.2,vignette:.42,grain:.016,shutter:.5,bloomStrength:.4,bloomRadius:.55,bloomThreshold:.9},fisheye:{name:"fisheye",label:"Fisheye",distortion:.55,fisheyeMask:1.12,chromatic:.007,edgeBlur:4.5,vignette:.6,grain:.03,shutter:.5,bloomStrength:.48,bloomRadius:.6,bloomThreshold:.88},clean:{name:"clean",label:"Clean",distortion:0,fisheyeMask:0,chromatic:0,edgeBlur:0,vignette:0,grain:0,shutter:0,bloomStrength:0,bloomRadius:0,bloomThreshold:1}},rt=["cinematic","fisheye","clean"];function vs(c,e,t,i){if(i===0)return[c,e];const a=(c*c+e*e)/(t*t+1),s=(1+i*a)/(1+i);return[c*s,e*s]}const ys={uniforms:{tDiffuse:{value:null},uResolution:{value:new X(1,1)},uTime:{value:0},uDistortion:{value:0},uFisheyeMask:{value:0},uChromatic:{value:0},uEdgeBlur:{value:0},uVignette:{value:0},uGrain:{value:0},uShutter:{value:0},uCurrInvViewProj:{value:new pe},uPrevViewProj:{value:new pe}},vertexShader:`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform vec2 uResolution;
    uniform float uTime;
    uniform float uDistortion;
    uniform float uFisheyeMask;
    uniform float uChromatic;
    uniform float uEdgeBlur;
    uniform float uVignette;
    uniform float uGrain;
    uniform float uShutter;
    uniform mat4 uCurrInvViewProj;
    uniform mat4 uPrevViewProj;
    varying vec2 vUv;

    float hash(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }

    // Lateral chromatic aberration: red focuses slightly outside, blue slightly inside
    vec3 sampleChromatic(vec2 uv, vec2 dir, float amount) {
      float r = texture2D(tDiffuse, uv + dir * amount).r;
      float g = texture2D(tDiffuse, uv).g;
      float b = texture2D(tDiffuse, uv - dir * amount).b;
      return vec3(r, g, b);
    }

    void main() {
      float aspect = uResolution.x / uResolution.y;
      vec2 p = (vUv - 0.5) * vec2(aspect, 1.0) * 2.0;
      float r2 = dot(p, p) / (aspect * aspect + 1.0);

      // 1. Barrel distortion (corners stay corners, the centre is magnified)
      vec2 ps = p * (1.0 + uDistortion * r2) / (1.0 + uDistortion);
      vec2 uv = ps / (vec2(aspect, 1.0) * 2.0) + 0.5;

      vec2 radial = (uv - 0.5);
      float ca = uChromatic * r2;

      // 2. Rotational motion blur. Re-project this pixel's view ray with the previous frame's
      //    camera orientation: exact for the distant sky, and a tracked planet (which moves with
      //    the camera) is not smeared.
      vec2 ndc = uv * 2.0 - 1.0;
      vec4 world = uCurrInvViewProj * vec4(ndc, 1.0, 1.0);
      world /= world.w;
      vec4 prevClip = uPrevViewProj * vec4(world.xyz, 1.0);
      vec2 prevUv = (prevClip.w > 0.0) ? (prevClip.xy / prevClip.w) * 0.5 + 0.5 : uv;
      vec2 velocity = (uv - prevUv) * uShutter;
      float vLen = length(velocity);
      if (vLen > 0.08) velocity *= 0.08 / vLen;

      vec3 color;
      if (length(velocity * uResolution) > 0.75) {
        color = vec3(0.0);
        const int STEPS = 10;
        for (int i = 0; i < STEPS; i++) {
          float t = float(i) / float(STEPS - 1) - 0.5;
          color += sampleChromatic(uv + velocity * t, radial, ca);
        }
        color /= float(STEPS);
      } else {
        color = sampleChromatic(uv, radial, ca);
      }

      // 3. Off-axis softness: a small disc blur that grows towards the corners
      float blurPx = uEdgeBlur * smoothstep(0.25, 1.0, r2);
      if (blurPx > 0.3) {
        vec2 texel = blurPx / uResolution;
        vec3 acc = color;
        acc += texture2D(tDiffuse, uv + vec2( 1.0,  0.0) * texel).rgb;
        acc += texture2D(tDiffuse, uv + vec2(-1.0,  0.0) * texel).rgb;
        acc += texture2D(tDiffuse, uv + vec2( 0.0,  1.0) * texel).rgb;
        acc += texture2D(tDiffuse, uv + vec2( 0.0, -1.0) * texel).rgb;
        acc += texture2D(tDiffuse, uv + vec2( 0.7,  0.7) * texel).rgb;
        acc += texture2D(tDiffuse, uv + vec2(-0.7, -0.7) * texel).rgb;
        color = acc / 7.0;
      }

      // Samples outside the rendered frame are black (only reachable with strong distortion)
      if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) color = vec3(0.0);

      // 4. Natural vignetting (cos^4-like fall-off)
      float vig = 1.0 - uVignette * smoothstep(0.15, 1.05, r2);
      color *= vig;

      // 5. Circular image circle for the fisheye lens
      if (uFisheyeMask > 0.0) {
        float rho = length(p);
        color *= 1.0 - smoothstep(uFisheyeMask - 0.05, uFisheyeMask, rho);
      }

      // 6. Grain, strongest in the mid-tones like film
      float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
      float n = hash(vUv * uResolution + fract(uTime * 37.0) * 91.7) - 0.5;
      color += n * uGrain * (0.35 + 0.65 * (1.0 - abs(luma * 2.0 - 1.0)));

      gl_FragColor = vec4(max(color, 0.0), 1.0);
    }
  `};class xs{constructor(e,t,i){u(this,"profile",ut.cinematic);u(this,"renderer");u(this,"scene");u(this,"camera");u(this,"composer");u(this,"bloomPass");u(this,"lensPass");u(this,"prevViewProj",new pe);u(this,"hasPrev",!1);u(this,"tmpView",new pe);u(this,"tmpViewProj",new pe);u(this,"reducedMotion",!1);this.renderer=e,this.scene=t,this.camera=i;const a=e.getSize(new X),s=new ze(a.x,a.y,{type:Ke});this.composer=new us(e,s),this.composer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5)),this.composer.addPass(new ms(t,i)),this.bloomPass=new Ue(new X(a.x,a.y),.4,.5,.85),this.composer.addPass(this.bloomPass),this.composer.addPass(new fs),this.lensPass=new ka(ys),this.composer.addPass(this.lensPass),typeof window<"u"&&window.matchMedia&&(this.reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches),this.setSize(a.x,a.y),this.setProfile("cinematic")}setProfile(e){this.profile=ut[e];const t=this.lensPass.uniforms;t.uDistortion.value=this.profile.distortion,t.uFisheyeMask.value=this.profile.fisheyeMask,t.uChromatic.value=this.profile.chromatic,t.uEdgeBlur.value=this.profile.edgeBlur,t.uVignette.value=this.profile.vignette,t.uGrain.value=this.profile.grain,t.uShutter.value=this.reducedMotion?0:this.profile.shutter,this.bloomPass.strength=this.profile.bloomStrength,this.bloomPass.radius=this.profile.bloomRadius,this.bloomPass.threshold=this.profile.bloomThreshold,this.hasPrev=!1}cycleProfile(){const e=rt[(rt.indexOf(this.profile.name)+1)%rt.length];return this.setProfile(e),e}setSize(e,t){this.composer.setSize(e,t);const i=Math.min(window.devicePixelRatio||1,1.5);this.lensPass.uniforms.uResolution.value.set(e*i,t*i)}outputToSceneNdc(e,t,i){const[a,s]=vs(e*i,t,i,this.profile.distortion);return[a/i,s]}isMasked(e,t,i){return this.profile.fisheyeMask<=0?!1:Math.hypot(e*i,t)>this.profile.fisheyeMask}render(e){if(this.profile.name==="clean"){this.renderer.render(this.scene,this.camera),this.hasPrev=!1;return}this.camera.updateMatrixWorld(),this.tmpView.copy(this.camera.matrixWorldInverse).setPosition(0,0,0),this.tmpViewProj.multiplyMatrices(this.camera.projectionMatrix,this.tmpView);const t=this.lensPass.uniforms;t.uCurrInvViewProj.value.copy(this.tmpViewProj).invert(),t.uPrevViewProj.value.copy(this.hasPrev?this.prevViewProj:this.tmpViewProj),t.uTime.value=e,this.composer.render(),this.prevViewProj.copy(this.tmpViewProj),this.hasPrev=!0}dispose(){var e,t;this.composer.dispose(),this.bloomPass.dispose(),(t=(e=this.lensPass).dispose)==null||t.call(e)}}const Bt=1e3;function ws(c,e,t){return c.level0TileDeg/Math.pow(2,e)/c.tileSize*Math.PI/180*t*Bt}const At=(c,e,t)=>`https://trek.nasa.gov/tiles/${c}/EQ/${e}/1.0.0/default/default028mm/{z}/{y}/{x}.${t}`,Dt={tileSize:256,level0TileDeg:180,minLevel:0},Ia={Earth:{body:"Earth",provider:{kind:"wmts",template:"https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/BlueMarble_NextGeneration/default/500m/{z}/{y}/{x}.jpeg",tileSize:512,level0TileDeg:288,minLevel:0,maxLevel:7},kind:"visible",title:"Blue Marble: Next Generation (Aug 2004)",source:"NASA GIBS · MODIS / NASA Earth Observatory",sourceUrl:"https://nasa-gibs.github.io/gibs-api-docs/",attribution:"NASA Earth Observatory / GIBS",bestMetresPerPixel:0,coverage:"Global, cloud-free monthly composite"},Moon:{body:"Moon",provider:{kind:"wmts",template:At("Moon","LRO_WAC_Mosaic_Global_303ppd_v02","jpg"),...Dt,maxLevel:8},kind:"monochrome",title:"LRO WAC global mosaic (303 px/°)",source:"NASA Moon Trek · LRO Camera Wide Angle Camera",sourceUrl:"https://trek.nasa.gov/moon/",attribution:"NASA/GSFC/Arizona State University (LROC) via NASA Solar System Treks",bestMetresPerPixel:0,coverage:"Global; poles are stretched in this equirectangular product"},Mercury:{body:"Mercury",provider:{kind:"wmts",template:At("Mercury","Mercury_MESSENGER_MDIS_Basemap_BDR_Mosaic_Global_166m","jpg"),...Dt,maxLevel:7},kind:"monochrome",title:"MESSENGER MDIS basemap (BDR, 166 m)",source:"NASA Mercury Trek · MESSENGER MDIS",sourceUrl:"https://trek.nasa.gov/mercury/",attribution:"NASA/JHUAPL/Carnegie Institution of Washington via NASA Solar System Treks",bestMetresPerPixel:0,coverage:"Global monochrome mosaic"},Venus:{body:"Venus",provider:{kind:"wms",template:"https://planetarymaps.usgs.gov/cgi-bin/mapserv?map=/maps/venus/venus_simp_cyl.map&service=WMS&version=1.1.1&request=GetMap&layers=MAGELLAN&styles=&srs=EPSG:4326&bbox={bbox}&width={size}&height={size}&format=image/jpeg",tileSize:256,level0TileDeg:180,minLevel:0,maxLevel:8},kind:"radar",title:"Magellan SAR radar mosaic",source:"USGS Astrogeology planetary WMS · NASA Magellan",sourceUrl:"https://planetarymaps.usgs.gov/",attribution:"NASA/JPL Magellan via USGS Astrogeology",bestMetresPerPixel:0,coverage:"Radar backscatter of the surface beneath the clouds — not a visible-light view",note:"Zoom is capped at level 8; the WMS resamples the mosaic and its native resolution was not verified."},Mars:{body:"Mars",provider:{kind:"wmts",template:At("Mars","Mars_Viking_MDIM21_ClrMosaic_global_232m","jpg"),...Dt,maxLevel:7},kind:"visible",title:"Viking MDIM 2.1 colour mosaic (232 m)",source:"NASA Mars Trek · Viking Orbiter (USGS MDIM 2.1)",sourceUrl:"https://trek.nasa.gov/mars/",attribution:"NASA/JPL/USGS via NASA Solar System Treks",bestMetresPerPixel:0,coverage:"Global; visible frame seams and tone steps between Viking images"},Jupiter:{body:"Jupiter",provider:null,kind:"atmosphere",title:"Global cloud-top map (2048 px)",source:"Solar System Scope (NASA Cassini/Juno imagery)",sourceUrl:"https://www.solarsystemscope.com/textures/",attribution:"Solar System Scope, CC BY 4.0",bestMetresPerPixel:0,coverage:"Cloud tops only — a gas giant has no solid surface to map",note:"No higher-resolution streaming map was verified; zoom stops at the globe map resolution."},Saturn:{body:"Saturn",provider:null,kind:"atmosphere",title:"Global cloud-top map (2048 px)",source:"Solar System Scope (NASA Cassini imagery)",sourceUrl:"https://www.solarsystemscope.com/textures/",attribution:"Solar System Scope, CC BY 4.0",bestMetresPerPixel:0,coverage:"Cloud tops only — a gas giant has no solid surface to map",note:"No higher-resolution streaming map was verified; zoom stops at the globe map resolution."},Uranus:{body:"Uranus",provider:null,kind:"atmosphere",title:"Global map (2048 px)",source:"Solar System Scope (Voyager 2-based, largely representative)",sourceUrl:"https://www.solarsystemscope.com/textures/",attribution:"Solar System Scope, CC BY 4.0",bestMetresPerPixel:0,coverage:"Low-detail representative cloud map",note:"Uranus has never been mapped at high resolution."},Neptune:{body:"Neptune",provider:null,kind:"atmosphere",title:"Global map (2048 px)",source:"Solar System Scope (Voyager 2-based, largely representative)",sourceUrl:"https://www.solarsystemscope.com/textures/",attribution:"Solar System Scope, CC BY 4.0",bestMetresPerPixel:0,coverage:"Low-detail representative cloud map",note:"Neptune has never been mapped at high resolution."}},bs={Earth:6371,Moon:1737.4,Mercury:2439.7,Venus:6051.8,Mars:3389.5,Jupiter:69911,Saturn:58232,Uranus:25362,Neptune:24622};for(const c of Object.values(Ia)){const e=bs[c.body];c.bestMetresPerPixel=c.provider?ws(c.provider,c.provider.maxLevel,e):2*Math.PI*e*Bt/2048}function oa(c){return Ia[c]??null}function Ms(c,e,t=1e3){const i=t/(2*Math.tan(e*Math.PI/360));return c.bestMetresPerPixel*i/2/Bt}const it=c=>`${c.z}/${c.y}/${c.x}`;function Gt(c,e){return c.level0TileDeg/Math.pow(2,e)}function Oa(c,e){const t=Gt(c,e);return{cols:Math.ceil(360/t-1e-9),rows:Math.ceil(180/t-1e-9)}}function yt(c,e){const t=Gt(c,e.z),i=-180+e.x*t,a=90-e.y*t,s=i+t,o=a-t;return{west:i,east:s,north:a,south:o,clipWest:Math.max(-180,i),clipEast:Math.min(180,s),clipNorth:Math.min(90,a),clipSouth:Math.max(-90,o)}}function Ss(c,e){if(e.z<c.minLevel||e.z>c.maxLevel)return!1;const{cols:t,rows:i}=Oa(c,e.z);return e.x>=0&&e.y>=0&&e.x<t&&e.y<i}function Ps(c){const{cols:e,rows:t}=Oa(c,c.minLevel),i=[];for(let a=0;a<t;a++)for(let s=0;s<e;s++)i.push({z:c.minLevel,x:s,y:a});return i}function As(c,e){const t=[];for(let i=0;i<2;i++)for(let a=0;a<2;a++){const s={z:e.z+1,x:e.x*2+a,y:e.y*2+i};Ss(c,s)&&La(c,s)&&t.push(s)}return t}function st(c){return c.z===0?null:{z:c.z-1,x:Math.floor(c.x/2),y:Math.floor(c.y/2)}}function La(c,e){const t=yt(c,e);return t.clipEast>t.clipWest&&t.clipNorth>t.clipSouth}const Je=Math.PI/180;function mt(c,e){const t=c*Je,i=e*Je;return[Math.cos(t)*Math.cos(i),Math.sin(t),-Math.cos(t)*Math.sin(i)]}function Ds(c,e,t){const i=Math.hypot(c,e,t)||1;return{lat:Math.asin(Math.max(-1,Math.min(1,e/i)))/Je,lon:Math.atan2(-t,c)/Je}}function Ts(c,e){const t=yt(c,e),i=(t.clipNorth+t.clipSouth)/2,a=(t.clipWest+t.clipEast)/2,s=mt(i,a);let o=0;const r=[[t.clipNorth,t.clipWest],[t.clipNorth,t.clipEast],[t.clipSouth,t.clipWest],[t.clipSouth,t.clipEast],[t.clipNorth,a],[t.clipSouth,a],[i,t.clipWest],[i,t.clipEast]];t.clipNorth>0&&t.clipSouth<0&&r.push([0,t.clipWest],[0,t.clipEast]);for(const[n,l]of r){const h=mt(n,l),m=Math.acos(Math.max(-1,Math.min(1,h[0]*s[0]+h[1]*s[1]+h[2]*s[2])));o=Math.max(o,m)}return{centre:s,radius:o}}function Cs(c,e){return Gt(c,e)/c.tileSize*Je}function Rs(c,e,t=1.3,i=160){const[a,s,o]=e.position,r=Math.hypot(a,s,o);if(r<=1)return[];const n=[a/r,s/r,o/r],l=Math.acos(Math.min(1,1/r)),h=[],m=Ps(c).filter(p=>La(c,p));for(;m.length>0;){const p=m.pop(),{centre:g,radius:v}=Ts(c,p),y=Math.acos(Math.max(-1,Math.min(1,g[0]*n[0]+g[1]*n[1]+g[2]*n[2])));if(y-v>l+.02||e.isCapVisible&&!e.isCapVisible(g,v))continue;const M=Math.max(0,y-v),x=Math.sqrt(Math.max(1e-12,r*r+1-2*r*Math.cos(M))),b=Cs(c,p.z)/x*e.pixelsPerRadian,A=p.z<c.maxLevel?As(c,p):[];b>t&&A.length>0&&h.length+m.length<i*4?m.push(...A):h.push({k:p,dist:x})}return h.sort((p,g)=>p.dist-g.dist),h.slice(0,i).map(p=>p.k)}function Es(c,e){const t=yt(c,e);return`${t.west},${t.south},${t.east},${t.north}`}const Ns={load(c,e,t){const i=new Image;return i.crossOrigin="anonymous",i.decoding="async",i.onload=()=>e(i),i.onerror=()=>t(),i.src=c,i}},Tt=1.0001,ks=6,ra=220,Is=3,Os=8,Ls=`
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
`,Us=`
  uniform sampler2D map;
  uniform float uOpacity;
  uniform float uAmbient;
  uniform float uDaylight;
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying vec3 vWorldNormal;
  void main() {
    vec4 tex = texture2D(map, vUv);
    // Sunlight from the Sun at the origin, with a soft terminator; a faint ambient keeps the
    // night side legible for exploration
    vec3 sunDir = normalize(-vWorldPosition);
    float ndl = dot(normalize(vWorldNormal), sunDir);
    float light = smoothstep(-0.08, 0.35, ndl) * 1.1 + uAmbient;
    // Optional "daylight" view: even illumination for reading the map on the night side
    light = mix(light, 0.85 + 0.25 * max(ndl, 0.0), uDaylight);
    gl_FragColor = vec4(tex.rgb * light, uOpacity);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;class js{constructor(e,t=Ns){u(this,"group",new ie);u(this,"provider");u(this,"loader");u(this,"tiles",new Map);u(this,"queue",[]);u(this,"inFlight",0);u(this,"consecutiveFailures",0);u(this,"disabled",!1);u(this,"everLoaded",!1);u(this,"daylight",{value:0});u(this,"frame",0);u(this,"status",{state:"idle",inFlight:0,queued:0,cached:0,drawn:0,deepestLevel:-1,failures:0});this.provider=e,this.loader=t,this.group.name="surface_tile_layer"}setDaylight(e){this.daylight.value=e?1:0}getStatus(){return{...this.status}}tileUrl(e){const t=this.provider;return t.kind==="wms"?t.template.replace("{bbox}",Es(t,e)).split("{size}").join(String(t.tileSize)):t.template.replace("{z}",String(e.z)).replace("{y}",String(e.y)).replace("{x}",String(e.x))}update(e){if(this.frame++,this.disabled){this.status={...this.status,state:"unavailable",inFlight:0,queued:0};return}const t=Rs(this.provider,e),i=new Set;let a=-1;this.queue=[];const s=[];for(const n of t){const l=it(n);i.add(l);let h=this.tiles.get(l);h||(h={key:n,id:l,state:"queued",attempts:0,lastWanted:this.frame,lastDrawn:0},this.tiles.set(l,h)),h.lastWanted=this.frame,h.state==="queued"&&s.push(h)}for(const n of t){const l=st(n);if(!l)continue;const h=it(l);if(i.has(h))continue;i.add(h);let m=this.tiles.get(h);m||(m={key:l,id:h,state:"queued",attempts:0,lastWanted:this.frame,lastDrawn:0},this.tiles.set(h,m)),m.lastWanted=this.frame,m.state==="queued"&&this.queue.push(m)}this.queue.push(...s);for(const n of this.tiles.values())n.state==="loading"&&!i.has(n.id)&&n.image&&(n.image.onload=null,n.image.onerror=null,n.image.src="",n.image=void 0,n.state="queued",this.inFlight--);this.pump();const o=new Set;for(const n of t){let l=n;for(;l;){const h=this.tiles.get(it(l));if(h&&h.state==="loaded"){o.add(h.id),a=Math.max(a,l.z);break}l=st(l)}}for(const n of[...o]){let l=st(this.tiles.get(n).key);for(;l;)o.delete(it(l)),l=st(l)}for(const n of this.tiles.values()){const l=o.has(n.id);l&&!n.mesh&&n.texture&&(n.mesh=this.createMesh(n)),n.mesh&&(n.mesh.visible=l),l&&(n.lastDrawn=this.frame)}this.evict();const r=this.inFlight+this.queue.length;this.status={state:this.consecutiveFailures>=3?"degraded":r>0?"streaming":t.length>0?"ready":"idle",inFlight:this.inFlight,queued:this.queue.length,cached:[...this.tiles.values()].filter(n=>n.state==="loaded").length,drawn:o.size,deepestLevel:a,failures:this.consecutiveFailures}}hide(){for(const e of this.tiles.values())e.mesh&&(e.mesh.visible=!1);this.queue=[],this.status={...this.status,state:this.disabled?"unavailable":"idle",queued:0,drawn:0}}pump(){for(;this.inFlight<ks&&this.queue.length>0;){const e=this.queue.shift();e.state==="queued"&&this.request(e)}}request(e){e.state="loading",e.attempts++,this.inFlight++;const t=this.tileUrl(e.key);e.image=this.loader.load(t,i=>{if(e.state!=="loading")return;this.inFlight--,e.image=void 0;const a=new ha(i);a.colorSpace=Ee,a.wrapS=L,a.wrapT=L,a.minFilter=ot,a.anisotropy=4,a.needsUpdate=!0,e.texture=a,e.state="loaded",this.everLoaded=!0,this.consecutiveFailures=0,this.pump()},()=>{if(e.state==="loading"){if(this.inFlight--,e.image=void 0,e.attempts<Is?(e.state="queued",setTimeout(()=>{e.state==="queued"&&e.lastWanted>=this.frame-2&&(this.queue.unshift(e),this.pump())},400*Math.pow(2,e.attempts))):(e.state="missing",this.consecutiveFailures++,this.status.failures=this.consecutiveFailures),this.consecutiveFailures>=Os&&!this.everLoaded){this.disableProvider();return}this.pump()}})}disableProvider(){this.disabled=!0;for(const e of this.tiles.values())e.state==="loading"&&e.image&&(e.image.onload=null,e.image.onerror=null,e.image.src="",e.image=void 0),e.state!=="loaded"&&(e.state="missing");this.queue=[],this.inFlight=0,this.status={...this.status,state:"unavailable",inFlight:0,queued:0}}createMesh(e){const t=yt(this.provider,e.key),i=Math.max(t.clipEast-t.clipWest,t.clipNorth-t.clipSouth),a=Math.max(4,Math.min(48,Math.ceil(i/1.5))),s=a,o=Math.max(2,Math.ceil(a*((t.clipNorth-t.clipSouth)/Math.max(1e-6,t.clipEast-t.clipWest)))),r=Math.min(48,o),n=[],l=[],h=[],m=[];for(let y=0;y<=r;y++){const M=t.clipNorth+(t.clipSouth-t.clipNorth)*(y/r);for(let x=0;x<=s;x++){const b=t.clipWest+(t.clipEast-t.clipWest)*(x/s),[A,f,S]=mt(M,b);n.push(A*Tt,f*Tt,S*Tt),l.push(A,f,S),h.push((b-t.west)/(t.east-t.west),(M-t.south)/(t.north-t.south))}}for(let y=0;y<r;y++)for(let M=0;M<s;M++){const x=y*(s+1)+M,b=x+s+1;m.push(x,b,x+1,x+1,b,b+1)}const p=new V;p.setAttribute("position",new Oe(n,3)),p.setAttribute("normal",new Oe(l,3)),p.setAttribute("uv",new Oe(h,2)),p.setIndex(m),p.computeBoundingSphere();const g=new k({uniforms:{map:{value:e.texture},uOpacity:{value:1},uAmbient:{value:.07},uDaylight:this.daylight},vertexShader:Ls,fragmentShader:Us}),v=new F(p,g);return v.name=`tile_${e.id}`,v.renderOrder=1+e.key.z*.01,this.group.add(v),v}evict(){const e=[...this.tiles.values()].filter(t=>t.state==="loaded");if(!(e.length<=ra)){e.sort((t,i)=>Math.max(t.lastDrawn,t.lastWanted)-Math.max(i.lastDrawn,i.lastWanted));for(const t of e.slice(0,e.length-ra))t.lastDrawn===this.frame||t.key.z<=1||(this.disposeEntry(t),this.tiles.delete(t.id));for(const t of this.tiles.values())t.state!=="loaded"&&t.state!=="loading"&&this.frame-t.lastWanted>600&&this.tiles.delete(t.id)}}disposeEntry(e){var t;e.mesh&&(this.group.remove(e.mesh),e.mesh.geometry.dispose(),e.mesh.material.dispose(),e.mesh=void 0),(t=e.texture)==null||t.dispose(),e.texture=void 0}dispose(){for(const e of this.tiles.values())e.image&&(e.image.onload=null,e.image.onerror=null,e.image.src=""),this.disposeEntry(e);this.tiles.clear(),this.queue=[],this.inFlight=0}}const J="Wikipedia coordinates (IAU/USGS Gazetteer of Planetary Nomenclature)",Fe="Wikipedia coordinates",Ce=c=>c>180?c-360:c,zt=[{id:"earth-everest",name:"Mount Everest",body:"Earth",lat:27.98833,lon:86.92528,viewAltitudeKm:900,source:Fe,description:"Highest summit above sea level (8,849 m), on the Nepal–China border in the Himalaya."},{id:"earth-grand-canyon",name:"Grand Canyon",body:"Earth",lat:36.3,lon:-112.75,viewAltitudeKm:700,source:Fe,description:"Canyon carved by the Colorado River through the Colorado Plateau, Arizona."},{id:"earth-richat",name:"Richat Structure",body:"Earth",lat:21.1147,lon:-11.3943,viewAltitudeKm:600,source:Fe,description:"A 40 km eroded dome in the Sahara of Mauritania, a landmark for astronauts."},{id:"earth-baikal",name:"Lake Baikal",body:"Earth",lat:53.5,lon:108,viewAltitudeKm:1500,source:Fe,description:"The world's deepest and oldest lake, in a continental rift in Siberia."},{id:"earth-nile-delta",name:"Nile Delta",body:"Earth",lat:30.9,lon:31.11667,viewAltitudeKm:800,source:Fe,description:"Green, densely farmed fan of the Nile against the desert, Egypt."},{id:"moon-tycho",name:"Tycho",body:"Moon",lat:-43.31,lon:-11.36,viewAltitudeKm:300,source:J,description:"Young 85 km crater with a bright ray system visible from Earth."},{id:"moon-copernicus",name:"Copernicus",body:"Moon",lat:9.62,lon:-20.08,viewAltitudeKm:300,source:J,description:"93 km crater with terraced walls and central peaks in Oceanus Procellarum."},{id:"moon-tranquility",name:"Tranquility Base",body:"Moon",lat:.6875,lon:23.43333,viewAltitudeKm:250,source:J,description:"Apollo 11 landing site, 20 July 1969, in Mare Tranquillitatis."},{id:"moon-imbrium",name:"Mare Imbrium",body:"Moon",lat:32.8,lon:-15.6,viewAltitudeKm:1200,source:J,description:"Vast basalt-flooded impact basin, about 1,100 km across."},{id:"moon-shackleton",name:"Shackleton",body:"Moon",lat:-89.67,lon:129.78,viewAltitudeKm:400,source:J,description:"Permanently shadowed crater at the lunar south pole (strongly stretched in this map projection)."},{id:"mercury-caloris",name:"Caloris Planitia",body:"Mercury",lat:30.5,lon:Ce(198.8),viewAltitudeKm:2500,source:J,description:"Impact basin about 1,550 km across, one of the largest in the Solar System."},{id:"mercury-hokusai",name:"Hokusai",body:"Mercury",lat:58.3,lon:Ce(342.3),viewAltitudeKm:600,source:J,description:"114 km crater with an extensive bright ray system."},{id:"mercury-rachmaninoff",name:"Rachmaninoff",body:"Mercury",lat:27.6,lon:Ce(302.4),viewAltitudeKm:600,source:J,description:"Peak-ring basin about 290 km across with smooth volcanic plains inside."},{id:"venus-maxwell",name:"Maxwell Montes",body:"Venus",lat:65.2,lon:3.3,viewAltitudeKm:1500,source:J,description:"Highest mountain range on Venus, about 11 km above the mean surface."},{id:"venus-maat",name:"Maat Mons",body:"Venus",lat:.5,lon:Ce(194.6),viewAltitudeKm:1200,source:J,description:"Largest volcano on Venus, about 8 km high."},{id:"venus-aphrodite",name:"Aphrodite Terra",body:"Venus",lat:-5.8,lon:104.8,viewAltitudeKm:6e3,source:J,description:"Equatorial highland roughly the size of South America."},{id:"mars-olympus",name:"Olympus Mons",body:"Mars",lat:18.65,lon:Ce(226.2),viewAltitudeKm:1200,source:J,description:"Shield volcano about 22 km high and 600 km across, the tallest in the Solar System."},{id:"mars-valles",name:"Valles Marineris",body:"Mars",lat:-13.9,lon:Ce(300.8),viewAltitudeKm:2500,source:J,description:"Canyon system over 4,000 km long and up to 7 km deep."},{id:"mars-gale",name:"Gale crater",body:"Mars",lat:-5.4,lon:137.8,viewAltitudeKm:500,source:J,description:"Landing site of the Curiosity rover (2012), with Mount Sharp at its centre."},{id:"mars-jezero",name:"Jezero crater",body:"Mars",lat:18.38,lon:77.58,viewAltitudeKm:400,source:J,description:"Ancient lake basin and river delta, landing site of Perseverance (2021)."},{id:"mars-hellas",name:"Hellas Planitia",body:"Mars",lat:-42.4,lon:70.5,viewAltitudeKm:3e3,source:J,description:"Impact basin about 2,300 km across and over 7 km deep."}];function _s(c){return zt.filter(e=>e.body===c)}function Fs(c){const e=c.trim().toLowerCase();return e?zt.filter(t=>t.name.toLowerCase().includes(e)||t.body.toLowerCase().includes(e)):[]}function Bs(c){return zt.find(e=>e.id===c)}const na=2.5,Gs=1.5,zs=.2,Ks=2;class pt{constructor(e,t,i){u(this,"rig");u(this,"getBody");u(this,"loader");u(this,"layers",new Map);u(this,"layerOrder",[]);u(this,"activeBody",null);u(this,"prevSurfaceQuat",new lt);u(this,"prevSurfaceBody",null);u(this,"frustum",new yi);u(this,"projView",new pe);u(this,"tmpV",new P);u(this,"tmpS",new xi);u(this,"frameCounter",0);u(this,"landmark",null);u(this,"daylight",!1);u(this,"lastViewportPx",1e3);u(this,"status",pt.emptyStatus());this.rig=e,this.getBody=t,this.loader=i}static emptyStatus(){return{body:null,imagery:null,streaming:!1,layer:null,maxLevel:0,altitudeKm:0,minAltitudeKm:0,atZoomLimit:!1,subCamera:null,sunElevationDeg:null,daylight:!1,landmark:null}}getStatus(){return this.status}update(e,t,i){var A,f;this.frameCounter++;const a=e?this.getBody(e):null,s=e?oa(e):null;if(this.activeBody&&this.activeBody!==e&&((A=this.layers.get(this.activeBody))==null||A.hide(),this.restoreClouds(this.activeBody),this.landmark&&this.landmark.body!==e&&(this.landmark=null)),this.activeBody=e,!a||!s){this.rig.surfaceMinAltitude=null,this.prevSurfaceBody=null,this.status=pt.emptyStatus();return}this.lastViewportPx=i;const o=this.minAltitudeKmFor(a,s,t.fov);this.rig.surfaceMinAltitude=o/(a.radiusKm/a.visualRadius),a.surfaceMesh.updateWorldMatrix(!0,!1);const r=a.surfaceMesh.worldToLocal(this.tmpV.copy(t.position)),n=r.length(),l=Math.max(0,n-1),h=l*a.radiusKm,m=Ds(r.x,r.y,r.z),p=a.surfaceMesh.getWorldQuaternion(new lt);if(this.prevSurfaceBody===a.name&&l<Gs){const S=p.clone().multiply(this.prevSurfaceQuat.clone().invert());1-Math.abs(S.w)>1e-12&&this.rig.applyFrameRotation(S)}this.prevSurfaceQuat.copy(p),this.prevSurfaceBody=a.name,a.cloudMesh&&(a.cloudMesh.visible=l>zs);let g=null;if(s.provider){const S=this.ensureLayer(a,s);if(l<na){if(this.frameCounter%2===0){this.projView.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this.frustum.setFromProjectionMatrix(this.projView);const D=a.surfaceMesh,R=a.visualRadius;S.update({position:[r.x,r.y,r.z],pixelsPerRadian:i/(2*Math.tan(t.fov*Math.PI/360)),isCapVisible:(N,I)=>{if(I<Math.PI/2){const U=Math.cos(I);D.localToWorld(this.tmpS.center.set(N[0]*U,N[1]*U,N[2]*U)),this.tmpS.radius=Math.sin(I)*R*1.02+(1-U)*R}else D.localToWorld(this.tmpS.center.set(0,0,0)),this.tmpS.radius=R*1.02;return this.frustum.intersectsSphere(this.tmpS)}})}}else S.hide();g=S.getStatus()}const v=a.bodyGroup.getWorldPosition(new P),y=t.position.clone().sub(v).normalize(),M=v.clone().negate().normalize(),x=O.radToDeg(Math.asin(O.clamp(y.dot(M),-1,1))),b=this.rig.minimumDistance();this.status={body:a.name,imagery:{title:s.title,source:s.source,sourceUrl:s.sourceUrl,attribution:s.attribution,kind:s.kind,coverage:s.coverage,note:s.note,bestMetresPerPixel:s.bestMetresPerPixel},streaming:!!s.provider&&l<na,layer:g,maxLevel:((f=s.provider)==null?void 0:f.maxLevel)??0,altitudeKm:h,minAltitudeKm:o,atZoomLimit:t.position.distanceTo(v)<=b*1.01,subCamera:{lat:m.lat,lon:m.lon},sunElevationDeg:x,daylight:this.daylight,landmark:this.landmark}}minAltitudeKmFor(e,t,i){const a=Ms(t,i,this.lastViewportPx);return t.provider?a:Math.min(a,.5*e.radiusKm)}surfaceDirection(e,t,i){e.surfaceMesh.updateWorldMatrix(!0,!1);const a=e.bodyGroup.getWorldPosition(new P),[s,o,r]=mt(t,i);return e.surfaceMesh.localToWorld(new P(s,o,r)).sub(a).normalize()}flyToLandmark(e){const t=Bs(e);if(!t)return null;const i=this.getBody(t.body);if(!i)return null;const a=i.radiusKm/i.visualRadius,s=this.surfaceDirection(i,t.lat,t.lon),o=oa(t.body);return o&&(this.rig.surfaceMinAltitude=this.minAltitudeKmFor(i,o,Ge)/a),this.rig.focusedPhysicalRadiusKm=i.radiusKm,this.rig.focusSurfacePoint(i.bodyGroup,i.visualRadius,s,t.viewAltitudeKm/a),this.landmark=t,t}setDaylight(e){this.daylight=e;for(const t of this.layers.values())t.setDaylight(e)}clearLandmark(){this.landmark=null}ensureLayer(e,t){var a;let i=this.layers.get(e.name);for(i||(i=new js(t.provider,this.loader),i.setDaylight(this.daylight),e.surfaceMesh.add(i.group),this.layers.set(e.name,i)),this.layerOrder=[e.name,...this.layerOrder.filter(s=>s!==e.name)];this.layerOrder.length>Ks;){const s=this.layerOrder.pop(),o=this.layers.get(s);o&&((a=o.group.parent)==null||a.remove(o.group),o.dispose(),this.layers.delete(s))}return i}restoreClouds(e){const t=this.getBody(e);t!=null&&t.cloudMesh&&(t.cloudMesh.visible=!0)}dispose(){var e;for(const t of this.layers.values())(e=t.group.parent)==null||e.remove(t.group),t.dispose();this.layers.clear()}}const Hs={Sun:{ra0:286.13,dec0:63.87,w0:84.176,wRate:14.1844},Mercury:{ra0:281.0103,raRate:-.0328,dec0:61.4155,decRate:-.0049,w0:329.5988,wRate:6.1385108},Venus:{ra0:272.76,dec0:67.16,w0:160.2,wRate:-1.4813688},Earth:{ra0:0,raRate:-.641,dec0:90,decRate:-.557,w0:190.147,wRate:360.9856235},Mars:{ra0:317.269202,raRate:-.10927547,dec0:54.432516,decRate:-.05827105,w0:176.049863,wRate:350.891982443297},Jupiter:{ra0:268.056595,raRate:-.006499,dec0:64.495303,decRate:.002413,w0:284.95,wRate:870.536},Saturn:{ra0:40.589,raRate:-.036,dec0:83.537,decRate:-.004,w0:38.9,wRate:810.7939024},Uranus:{ra0:257.311,dec0:-15.175,w0:203.81,wRate:-501.1600928},Neptune:{ra0:299.36,dec0:43.46,w0:249.978,wRate:541.1397757,neptuneNutation:!0},Pluto:{ra0:132.993,dec0:-6.163,w0:302.695,wRate:56.3625225},Ceres:{ra0:291.418,dec0:66.764,w0:170.65,wRate:952.1532},Vesta:{ra0:309.031,dec0:42.235,w0:285.39,wRate:1617.3329428},Eros:{ra0:11.35,dec0:17.22,w0:326.07,wRate:1639.38864745},Gaspra:{ra0:9.47,dec0:26.7,w0:83.67,wRate:1226.911485},Ida:{ra0:168.76,dec0:-87.12,w0:274.05,wRate:1864.628007}},Ws={Bennu:{lambdaDeg:69.92,betaDeg:-83.45,periodHours:4.296057},Ryugu:{lambdaDeg:179.3,betaDeg:-87.44,periodHours:7.6326}},Re=Math.PI/180;function qe(c){const e=Math.hypot(c[0],c[1],c[2])||1;return[c[0]/e,c[1]/e,c[2]/e]}function Kt(c,e){return[c[1]*e[2]-c[2]*e[1],c[2]*e[0]-c[0]*e[2],c[0]*e[1]-c[1]*e[0]]}const la=z.icrfToThree,Vs=z.raDecToIcrf;function Ys(c,e){const t=Hs[c];if(t){const a=e/36525;let s=t.ra0+(t.raRate??0)*a,o=t.dec0+(t.decRate??0)*a,r=t.w0+t.wRate*e;if(t.neptuneNutation){const h=(357.85+52.316*a)*Re;s+=.7*Math.sin(h),o-=.51*Math.cos(h),r-=.48*Math.sin(h)}const n=Vs(s,o),l=[-Math.sin(s*Re),Math.cos(s*Re),0];return It(la(l),la(n),r*Re)}const i=Ws[c];if(i){const a=i.lambdaDeg*Re,s=i.betaDeg*Re,o=[Math.cos(s)*Math.cos(a),Math.cos(s)*Math.sin(a),Math.sin(s)],r=z.eclipticToThree(o),n=z.eclipticToThree([0,0,1]);let l=Kt(n,r);Math.hypot(...l)<1e-6&&(l=[1,0,0]);const h=e*24/i.periodHours*2*Math.PI;return It(qe(l),r,h)}return null}function Js(c,e){const t=z.eclipticToThree(c),i=z.eclipticToThree(e),a=qe(Kt(t,i)),s=qe([-t[0],-t[1],-t[2]]);return It(s,a,0)}function It(c,e,t){const i=qe(e),a=c[0]*i[0]+c[1]*i[1]+c[2]*i[2],s=qe([c[0]-a*i[0],c[1]-a*i[1],c[2]-a*i[2]]),o=Kt(s,i);return{xAxis:s,yAxis:i,zAxis:o,spinRad:t}}const gt=class gt{constructor(e,t){u(this,"container");u(this,"renderer");u(this,"scene");u(this,"cameraRig");u(this,"clock",new ke);u(this,"transform",new fe);u(this,"planetBundles",new Map);u(this,"orbitLinesGroup",new ie);u(this,"moonOrbitLines",new Map);u(this,"latestPhysicalStates",new Map);u(this,"orbitLinesEpochDays",0);u(this,"tmpMatrix",new pe);u(this,"tmpX",new P);u(this,"tmpY",new P);u(this,"tmpZ",new P);u(this,"starfield");u(this,"asteroidBelt");u(this,"raycaster",new wi);u(this,"mouse",new X);u(this,"isRunning",!0);u(this,"animationFrameId",null);u(this,"lastFrameTime",performance.now());u(this,"lens");u(this,"explorer");u(this,"selectedBody");u(this,"onTelemetryUpdate");u(this,"lastTelemetryTime",0);u(this,"pointerDownPos",{x:0,y:0});u(this,"onPointerDown",e=>{this.pointerDownPos={x:e.clientX,y:e.clientY}});u(this,"onCanvasMouseMove",e=>{var s,o;if(e.target!==this.renderer.domElement)return;const t=this.renderer.domElement.getBoundingClientRect(),i=(e.clientX-t.left)/t.width*2-1,a=-((e.clientY-t.top)/t.height)*2+1;if((o=(s=this.starfield)==null?void 0:s.externalGalaxy)!=null&&o.sagittariusAStar){const r=this.starfield.externalGalaxy.getGalacticCenterWorldPosition(),n=r.clone().project(this.cameraRig.camera);if(n.z>=-1&&n.z<=1){const l=t.width/Math.max(1,t.height),h=(i-n.x)*l,m=a-n.y,p=Math.hypot(h,m),v=this.cameraRig.camera.position.distanceTo(r)>12e3?.18:.25;if(p<v){this.renderer.domElement.style.cursor="pointer";return}}}this.renderer.domElement.style.cursor==="pointer"&&(this.renderer.domElement.style.cursor="")});u(this,"onCanvasClick",e=>{var l,h,m,p,g,v,y,M,x,b;if(e.target!==this.renderer.domElement||Math.hypot(e.clientX-this.pointerDownPos.x,e.clientY-this.pointerDownPos.y)>6)return;const i=this.renderer.domElement.getBoundingClientRect();this.mouse.x=(e.clientX-i.left)/i.width*2-1,this.mouse.y=-((e.clientY-i.top)/i.height)*2+1;const a=i.width/Math.max(1,i.height);if(this.lens.isMasked(this.mouse.x,this.mouse.y,a))return;const[s,o]=this.lens.outputToSceneNdc(this.mouse.x,this.mouse.y,a);if(this.mouse.set(s,o),(h=(l=this.starfield)==null?void 0:l.externalGalaxy)!=null&&h.sagittariusAStar){const A=this.starfield.externalGalaxy.getGalacticCenterWorldPosition(),f=A.clone().project(this.cameraRig.camera);if(f.z>=-1&&f.z<=1){const S=i.width/Math.max(1,i.height),D=(this.mouse.x-f.x)*S,R=this.mouse.y-f.y,N=Math.hypot(D,R),U=this.cameraRig.camera.position.distanceTo(A)>12e3?.18:.25;if(N<U){this.selectBody("Sagittarius A*",2200);return}}}this.raycaster.setFromCamera(this.mouse,this.cameraRig.camera);const r=[];this.planetBundles.forEach(A=>{r.push(A.surfaceMesh)}),(p=(m=this.starfield)==null?void 0:m.externalGalaxy)!=null&&p.sagittariusAStar&&(this.starfield.externalGalaxy.sagittariusAStar.hitMesh&&r.push(this.starfield.externalGalaxy.sagittariusAStar.hitMesh),this.starfield.externalGalaxy.sagittariusAStar.boundingMesh&&r.push(this.starfield.externalGalaxy.sagittariusAStar.boundingMesh));const n=this.raycaster.intersectObjects(r,!1);if(n.length>0){const A=n[0].object;if(A===((y=(v=(g=this.starfield)==null?void 0:g.externalGalaxy)==null?void 0:v.sagittariusAStar)==null?void 0:y.hitMesh)||A===((b=(x=(M=this.starfield)==null?void 0:M.externalGalaxy)==null?void 0:x.sagittariusAStar)==null?void 0:b.boundingMesh)||A.name.includes("sagittarius")){this.selectBody("Sagittarius A*",2200);return}for(const f of this.planetBundles.values())if(f.surfaceMesh===A){this.selectBody(f.definition.name);break}}});u(this,"onResize",()=>{if(!this.container)return;const e=this.container.clientWidth||window.innerWidth,t=this.container.clientHeight||window.innerHeight;this.renderer.setSize(e,t),this.cameraRig.handleResize(e,t),this.lens.setSize(e,t)});u(this,"animate",()=>{var r,n,l;if(!this.isRunning)return;this.animationFrameId=requestAnimationFrame(this.animate);const e=performance.now(),t=Math.min(Math.max((e-this.lastFrameTime)*.001,.001),.1);this.lastFrameTime=e,this.clock.update(e);const i=this.clock.getJulianDateTDB()-ke.J2000_JD;this.propagateAll(i);const a=this.planetBundles.get("Sun");if(a){const h=e*.001,m=a.surfaceMesh.material;if((r=m.uniforms)!=null&&r.time&&(m.uniforms.time.value=h),a.glowMeshes)for(const p of a.glowMeshes){const g=p.material;(n=g.uniforms)!=null&&n.time&&(g.uniforms.time.value=h)}if(a.prominencesGroup){for(const p of a.prominencesGroup.children)if(p instanceof F){const g=p.material;(l=g.uniforms)!=null&&l.time&&(g.uniforms.time.value=h)}}}this.cameraRig.update();const s=this.selectedBody.name==="Sagittarius A*",o=this.cameraRig.focusedObject&&!s?this.selectedBody.name:null;this.explorer.update(o,this.cameraRig.camera,this.renderer.domElement.height),this.starfield.update(this.cameraRig.camera.position,t,this.cameraRig.getVelocity(),this.cameraRig.getZoomVelocity(),this.cameraRig.camera),this.lens.render(e*.001),this.onTelemetryUpdate&&e-this.lastTelemetryTime>=gt.TELEMETRY_INTERVAL_MS&&(this.lastTelemetryTime=e,this.dispatchTelemetry())});this.container=e,this.onTelemetryUpdate=t,this.selectedBody=q.getBody("Mercury")||q.getAllBodies()[0],this.scene=new bi,this.scene.background=new E(131333),this.renderer=new Mi({antialias:!0,powerPreference:"high-performance"});const i=e.clientWidth||window.innerWidth,a=e.clientHeight||window.innerHeight;this.renderer.setSize(i,a),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.outputColorSpace=Ee,this.renderer.toneMapping=ma,this.renderer.toneMappingExposure=1.05,this.renderer.domElement.style.position="absolute",this.renderer.domElement.style.top="0",this.renderer.domElement.style.left="0",this.renderer.domElement.style.width="100%",this.renderer.domElement.style.height="100%",this.renderer.domElement.style.display="block",e.appendChild(this.renderer.domElement),this.cameraRig=new kt(e),this.lens=new xs(this.renderer,this.scene,this.cameraRig.camera),this.setupLighting(),this.starfield=new Ye,this.scene.add(this.starfield.group),this.asteroidBelt=new ns(this.transform),this.scene.add(this.asteroidBelt.mesh),this.orbitLinesGroup.visible=!1,this.scene.add(this.orbitLinesGroup),this.setupBodies(),this.explorer=new pt(this.cameraRig,s=>{const o=this.planetBundles.get(s);return o?{name:s,bodyGroup:o.bodyGroup,surfaceMesh:o.surfaceMesh,cloudMesh:o.cloudMesh,visualRadius:o.visualRadius,radiusKm:o.definition.physical.meanRadiusKm}:null}),this.orbitLinesEpochDays=this.clock.getJulianDateTDB()-ke.J2000_JD,this.rebuildOrbitLines(),this.propagateAll(this.clock.getJulianDateTDB()-ke.J2000_JD),this.scene.updateMatrixWorld(!0),this.selectBody("Mercury",1800),this.setupInteraction(),this.animate()}setupLighting(){const e=new Si(16775917,2.4,0,0);e.position.set(0,0,0),e.castShadow=!1,this.scene.add(e);const t=new Pi(2238008,.25);this.scene.add(t)}setupBodies(){const e=q.getAllBodies();for(const t of e){const i=Ui.createPlanet(t);this.scene.add(i.bodyGroup),this.planetBundles.set(t.name,i)}}rebuildOrbitLines(){for(;this.orbitLinesGroup.children.length>0;){const t=this.orbitLinesGroup.children[0];this.orbitLinesGroup.remove(t),t instanceof Ie&&(t.geometry.dispose(),t.material.dispose())}this.moonOrbitLines.clear();const e=q.getAllBodies();for(const t of e)if(t.category!=="moon"&&t.orderFromSun>0){const i=ia.createOrbitLine(t,this.transform,this.orbitLinesEpochDays);i&&this.orbitLinesGroup.add(i)}for(const t of e)if(t.category==="moon"&&t.parentId){const i=q.getParent(t);if(i){const a=ia.createMoonOrbitLine(t,i,this.transform,this.orbitLinesEpochDays);a&&(this.orbitLinesGroup.add(a),this.moonOrbitLines.set(t.name,a))}}}setScaleMode(e){this.transform.mode!==e&&(this.transform.mode=e,this.cameraRig.distanceModel=e,this.planetBundles.forEach(t=>{const i=this.transform.getVisualRadius(t.definition);t.visualRadius=i;const s=1-(t.definition.physical.flattening||0);if(t.surfaceMesh.scale.set(i,i*s,i),t.nightMesh&&t.nightMesh.scale.set(i,i*s,i),t.cloudMesh&&t.cloudMesh.scale.set(i,i,i),t.atmosphereMesh&&t.atmosphereMesh.scale.set(i,i,i),t.ringMesh){t.ringMesh.scale.set(i,i,i);const o=t.ringMesh.material;o.uniforms&&o.uniforms.saturnRadius&&(o.uniforms.saturnRadius.value=i)}t.glowMeshes&&t.glowMeshes.forEach(o=>o.scale.set(i,i,i))}),this.rebuildOrbitLines())}flyToLandmark(e){var i;const t=this.explorer.flyToLandmark(e);if(t){const a=(i=this.planetBundles.get(t.body))==null?void 0:i.definition;a&&(this.selectedBody=a)}return t}setExplorerDaylight(e){this.explorer.setDaylight(e)}getExplorerStatus(){return this.explorer.getStatus()}setLensProfile(e){this.lens.setProfile(e)}cycleLensProfile(){return this.lens.cycleProfile()}resetLook(){this.cameraRig.resetLook()}toggleConstellations(){return this.starfield.toggleConstellations()}toggleAsteroidBelt(){const e=!this.asteroidBelt.isVisible();return this.asteroidBelt.setVisible(e),e}toggleOrbits(){return this.orbitLinesGroup.visible=!this.orbitLinesGroup.visible,this.orbitLinesGroup.visible}setupInteraction(){this.renderer.domElement.addEventListener("mousedown",this.onPointerDown),this.renderer.domElement.addEventListener("mousemove",this.onCanvasMouseMove),this.renderer.domElement.addEventListener("click",this.onCanvasClick),window.addEventListener("resize",this.onResize)}selectBody(e,t=1800){if(e==="Sagittarius A*"||e==="Sgr A*"||e==="sagittarius_a_star"){const a=q.getSagittariusAStar();if(a){this.selectedBody=a;const s=this.starfield.externalGalaxy.sagittariusAStar.group;this.cameraRig.focusCinematic(s,180,a.name,t);return}}const i=this.planetBundles.get(e);i&&(this.selectedBody=i.definition,this.explorer.clearLandmark(),this.cameraRig.surfaceMinAltitude=null,this.cameraRig.focusCinematic(i.bodyGroup,i.visualRadius,i.definition.name,t,void 0,i.definition.physical.meanRadiusKm))}resetView(){this.selectedBody=q.getBody("Sun")||q.getAllBodies()[0],this.explorer.clearLandmark(),this.cameraRig.resetToOverview(),this.cameraRig.focusedPhysicalRadiusKm=this.selectedBody.physical.meanRadiusKm}applyBodyFrame(e,t,i=0){this.tmpMatrix.makeBasis(this.tmpX.set(t.xAxis[0],t.xAxis[1],t.xAxis[2]),this.tmpY.set(t.yAxis[0],t.yAxis[1],t.yAxis[2]),this.tmpZ.set(t.zAxis[0],t.zAxis[1],t.zAxis[2])),e.bodyGroup.quaternion.setFromRotationMatrix(this.tmpMatrix),e.surfaceMesh.rotation.y=t.spinRad,e.nightMesh&&(e.nightMesh.rotation.y=t.spinRad),e.cloudMesh&&(e.cloudMesh.rotation.y=t.spinRad+i)}applyFallbackSpin(e,t){const i=e.definition;e.bodyGroup.rotation.set(0,0,O.degToRad(i.physical.axialTiltDeg||0));const a=i.physical.rotationPeriodHours||i.orbit.orbitalPeriodDays*24||24;e.surfaceMesh.rotation.y=t*24/a*Math.PI*2}propagateAll(e){const t=q.getAllBodies(),i=new Map,a=e;for(const s of t){if(s.category==="moon")continue;const o=this.planetBundles.get(s.name);if(!o)continue;if(s.orderFromSun===0)o.bodyGroup.position.set(0,0,0),i.set(s.id,[0,0,0]);else{const n=ve.propagate(s.orbit,a);this.latestPhysicalStates.set(s.name,n);const l=this.transform.toRenderPosition(n.positionKm,s);if(o.bodyGroup.position.set(l[0],l[1],l[2]),i.set(s.id,l),s.name==="Saturn"&&o.ringMesh){const h=o.ringMesh.material;h.uniforms&&h.uniforms.saturnCenter&&(h.uniforms.saturnCenter.value.set(l[0],l[1],l[2]),h.uniforms.saturnRadius.value=o.visualRadius)}}const r=Ys(s.name,a);r?this.applyBodyFrame(o,r,s.name==="Earth"?a/40*Math.PI*2:0):this.applyFallbackSpin(o,a)}for(const s of t){if(s.category!=="moon"||!s.parentId)continue;const o=this.planetBundles.get(s.name);if(!o)continue;const r=q.getParent(s);if(!r)continue;const n=this.latestPhysicalStates.get(r.name),l=i.get(r.id)||[0,0,0],h=r.physical.gmKm3S2??(r.physical.massKg?r.physical.massKg*66743e-24:void 0),m=s.physical.gmKm3S2??(s.physical.massKg?s.physical.massKg*66743e-24:0),p=h!==void 0?h+m:ve.GM_SUN,g=ve.propagate(s.orbit,a,p),v=(n==null?void 0:n.positionKm)||[0,0,0],y=(n==null?void 0:n.velocityKmPerSec)||[0,0,0],M=[v[0]+g.positionKm[0],v[1]+g.positionKm[1],v[2]+g.positionKm[2]],x=[y[0]+g.velocityKmPerSec[0],y[1]+g.velocityKmPerSec[1],y[2]+g.velocityKmPerSec[2]];this.latestPhysicalStates.set(s.name,{positionKm:M,velocityKmPerSec:x,distanceKm:Math.hypot(...M),speedKmPerSec:Math.hypot(...x),trueAnomalyDeg:g.trueAnomalyDeg,eccentricAnomalyDeg:g.eccentricAnomalyDeg});const b=this.transform.toMoonRenderPosition(g.positionKm,s,l,r);o.bodyGroup.position.set(b[0],b[1],b[2]);const A=this.moonOrbitLines.get(s.name);A&&A.position.set(l[0],l[1],l[2]),s.name==="Hyperion"?this.applyFallbackSpin(o,a):this.applyBodyFrame(o,Js(g.positionKm,g.velocityKmPerSec))}this.asteroidBelt.updatePositions(a),Math.abs(a-this.orbitLinesEpochDays)>365&&(this.orbitLinesEpochDays=a,this.rebuildOrbitLines())}jumpToScale(e){if(e==="sgr_a"){this.selectBody("Sagittarius A*");return}this.cameraRig.jumpToScale(e)}dispatchTelemetry(){const e=this.latestPhysicalStates.get(this.selectedBody.name);let t=(e==null?void 0:e.distanceKm)||this.selectedBody.orbit.semiMajorAxisKm,i=(e==null?void 0:e.speedKmPerSec)||0;(this.selectedBody.id==="sagittarius_a_star"||this.selectedBody.name==="Sagittarius A*")&&(t=2553e14,i=122400);const a=new P;this.cameraRig.camera.getWorldDirection(a);const s=Math.atan2(a.x,a.z)*O.RAD2DEG,o=Math.asin(a.y)*O.RAD2DEG,r=this.cameraRig.getObserverScaleMetric(),n=this.cameraRig.getTravelSpeed(),l={id:this.selectedBody.id,name:this.selectedBody.name,category:this.selectedBody.category,parentId:this.selectedBody.parentId,parentName:this.selectedBody.parentName,distanceKm:t,apparentSpeedKmS:i,radiusKm:this.selectedBody.physical.meanRadiusKm,orbitalPeriodDays:this.selectedBody.orbit.orbitalPeriodDays,axialTiltDeg:this.selectedBody.physical.axialTiltDeg||0,colorHex:this.selectedBody.physical.colorHex||"#ffffff"};this.onTelemetryUpdate({speedKmS:i,lookAzimuthDeg:Math.round(s),lookElevationDeg:Math.round(o),activeTarget:l,timeScale:this.clock.timeMultiplier,julianDate:this.clock.getJulianDate(),utcIso:this.clock.getIsoString(),scaleMode:this.transform.mode,isPaused:this.clock.isPaused,constellationsVisible:this.starfield.areConstellationsVisible(),asteroidBeltVisible:this.asteroidBelt.isVisible(),orbitsVisible:this.orbitLinesGroup.visible,observerScaleMetric:r.formatted,observerDomain:r.domain,travelSpeed:Math.round(n),cameraDistance:Math.round(r.distance),lensProfile:this.lens.profile.name,explorer:this.explorer.getStatus()})}dispose(){this.isRunning=!1,this.animationFrameId!==null&&cancelAnimationFrame(this.animationFrameId),window.removeEventListener("resize",this.onResize),this.renderer.domElement.removeEventListener("mousedown",this.onPointerDown),this.renderer.domElement.removeEventListener("mousemove",this.onCanvasMouseMove),this.renderer.domElement.removeEventListener("click",this.onCanvasClick),this.cameraRig.dispose(),this.explorer.dispose(),this.lens.dispose(),this.starfield.dispose(),this.asteroidBelt.dispose(),this.planetBundles.forEach(e=>{e.surfaceMesh.geometry.dispose(),e.surfaceMesh.material.dispose(),e.nightMesh&&(e.nightMesh.geometry.dispose(),e.nightMesh.material.dispose()),e.cloudMesh&&(e.cloudMesh.geometry.dispose(),e.cloudMesh.material.dispose()),e.atmosphereMesh&&(e.atmosphereMesh.geometry.dispose(),e.atmosphereMesh.material.dispose()),e.ringMesh&&(e.ringMesh.geometry.dispose(),e.ringMesh.material.dispose()),e.glowMeshes&&e.glowMeshes.forEach(t=>{t.geometry.dispose(),t.material.dispose()}),e.prominencesGroup&&e.prominencesGroup.children.forEach(t=>{t instanceof F&&(t.geometry.dispose(),t.material.dispose())})}),this.renderer.dispose(),this.renderer.domElement.parentElement&&this.renderer.domElement.parentElement.removeChild(this.renderer.domElement)}};u(gt,"TELEMETRY_INTERVAL_MS",100);let Ot=gt;const Lt={Mercury:{name:"Mercury",category:"planet",eyebrow:"PLANET",accentColor:"#E8927C",eyebrowColor:"#fabfad",distanceAU:"0.39 AU",textureThumb:"textures/thumbs/mercury.webp",monographText:"THE CLOSEST PLANET TO THE SUN. IT CIRCLES THE SUN FASTER THAN ALL THE OTHER PLANETS, WHICH IS WHY ROMANS NAMED IT AFTER THEIR SWIFT-FOOTED MESSENGER GOD.",extendedLore:"Mercury is a world of fierce cosmic extremes. With virtually no atmosphere to trap heat, midday temperatures soar to 430°C (800°F), while the sunless night plummets to -180°C (-290°F). Its massive metallic core occupies roughly 85% of the planet's total radius, suggesting a colossal primordial impact stripped away much of its ancient silicate mantle.",missions:[{name:"Mariner 10",year:"1974–1975",agency:"NASA",role:"First flybys; mapped 45% of surface"},{name:"MESSENGER",year:"2011–2015",agency:"NASA",role:"First orbiter; discovered polar water ice in permanently shadowed craters"},{name:"BepiColombo",year:"2025–2026",agency:"ESA / JAXA",role:"Dual orbiter study of magnetosphere and exosphere"}]},Venus:{name:"Venus",category:"planet",eyebrow:"PLANET",accentColor:"#b45d15",eyebrowColor:"#e58e45",distanceAU:"0.723 AU",textureThumb:"textures/thumbs/venus_atmosphere.webp",monographText:"NAMED FOR THE ROMAN GODDESS OF LOVE AND BEAUTY. ENSHROUDED IN DENSE OPAQUE CLOUDS OF SULFURIC ACID, IT SUFFERS A RUNAWAY GREENHOUSE EFFECT WITH SURFACE TEMPERATURES REACHING 465°C.",extendedLore:"Venus is Earth's twin in diameter and mass, but an infernal counterpart in environment. A crushing supercritical carbon dioxide atmosphere exerts 92 times Earth's sea-level pressure. Venus rotates backwards compared to most planets, with the Sun rising in the west, and its day is longer than its orbital year.",missions:[{name:"Venera 7",year:"1970",agency:"Soviet Union",role:"First human spacecraft to softly land and transmit data from another planet"},{name:"Magellan",year:"1990–1994",agency:"NASA",role:"Global radar mapping revealing extensive volcanism and lava channels"},{name:"Akatsuki",year:"2015–Present",agency:"JAXA",role:"Atmospheric super-rotation and cloud dynamics investigation"}]},Earth:{name:"Earth",category:"planet",eyebrow:"PLANET",accentColor:"#26daaa",eyebrowColor:"#7bf0d0",distanceAU:"1.000 AU",textureThumb:"textures/thumbs/earth_daymap.webp",monographText:"OUR HOME AND THE ONLY KNOWN SANCTUARY OF LIFE IN THE COSMOS. A VIBRANT BLUE MARBLE ENVELOPED BY A NITROGEN-OXYGEN ATMOSPHERE, WITH LIQUID OCEANS COVERING SEVENTY PERCENT OF ITS SURFACE.",extendedLore:"Earth resides at the temperate sweet spot of the circumstellar habitable zone. Dynamic plate tectonics continuously recycle carbon, while a vigorous geodynamo generates a protective magnetosphere shielding the biosphere from solar wind stripping and high-energy galactic cosmic rays.",missions:[{name:"Apollo Program",year:"1961–1972",agency:"NASA",role:"Human lunar landings; transformed humanity's ecological perspective of Earth"},{name:"Terra & Aqua",year:"1999–Present",agency:"NASA",role:"Comprehensive global climate and ocean monitoring system"},{name:"Copernicus Sentinel",year:"2014–Present",agency:"ESA",role:"Constellation observing biosphere, ice sheets, and atmosphere"}]},Mars:{name:"Mars",category:"planet",eyebrow:"PLANET",accentColor:"#e55f45",eyebrowColor:"#fca595",distanceAU:"1.524 AU",textureThumb:"textures/thumbs/mars.webp",monographText:"THE RED PLANET, COLORED BY IRON OXIDE SPREAD ACROSS ITS WINDSWEPT DESERTS. HOME TO OLYMPUS MONS, THE TALLEST VOLCANO IN THE SOLAR SYSTEM, AND VAST DRY RIVER VALLEYS.",extendedLore:"Though frozen and desiccated today, geochemical fingerprints captured by rovers prove ancient Mars possessed lakes, river deltas, and a thicker insulating atmosphere over three billion years ago. Its thin CO2 atmosphere generates continent-scale dust storms that periodically veil the entire globe.",missions:[{name:"Viking 1 & 2",year:"1976",agency:"NASA",role:"First successful long-duration Mars surface landers and biological tests"},{name:"Curiosity",year:"2012–Present",agency:"NASA",role:"Discovered ancient habitable lacustrine environments in Gale Crater"},{name:"Perseverance",year:"2021–Present",agency:"NASA",role:"Searching for ancient microbial biosignatures and caching core samples"}]},Jupiter:{name:"Jupiter",category:"planet",eyebrow:"PLANET",accentColor:"#f59e0b",eyebrowColor:"#fcd34d",distanceAU:"5.203 AU",textureThumb:"textures/thumbs/jupiter.webp",monographText:"THE TITAN OF OUR SOLAR SYSTEM, MORE THAN TWICE AS MASSIVE AS ALL THE OTHER PLANETS COMBINED. A SWIRLING GAS GIANT DOMINATED BY THE CENTURIES-OLD GREAT RED SPOT AND NEARLY A HUNDRED KNOWN MOONS.",extendedLore:"Jupiter acted as the primary gravitational architect of the early Solar System, shaping asteroid orbits and scattering comets. Below its dynamic ammonia cloud belts, hydrogen transitions into liquid and eventually into an exotic state of liquid metallic hydrogen that conducts immense electrical currents, powering the most powerful planetary magnetic field in the system.",missions:[{name:"Voyager 1 & 2",year:"1979",agency:"NASA",role:"Discovered Jovian rings and active volcanism on Io"},{name:"Galileo",year:"1995–2003",agency:"NASA",role:"First orbiter; gathered initial evidence of subsurface ocean on Europa"},{name:"Juno",year:"2016–Present",agency:"NASA",role:"Mapping gravitational anomalies and deep atmospheric water abundance"}]},Saturn:{name:"Saturn",category:"planet",eyebrow:"PLANET",accentColor:"#b29d81",eyebrowColor:"#d4c5b0",distanceAU:"9.539 AU",textureThumb:"textures/thumbs/saturn.webp",monographText:"A MAJESTIC WORLD ADORNED BY AN EXTRAORDINARY SYSTEM OF ICY RINGS EXTENDING HUNDREDS OF THOUSANDS OF KILOMETERS INTO THE VOID, ACCOMPANIED BY THE HAZE-CLOAKED MOON TITAN.",extendedLore:"Saturn's main rings span about 282,000 km in diameter yet are astonishingly paper-thin—averaging barely 10 to 30 meters in vertical thickness. Made almost entirely of water-ice particles ranging from dust grains to house-sized boulders, the rings are sustained and sculpted by subtle gravitational resonances with shepherd moons.",missions:[{name:"Pioneer 11",year:"1979",agency:"NASA",role:"First close encounter with Saturn and discovery of the F Ring"},{name:"Cassini-Huygens",year:"2004–2017",agency:"NASA / ESA / ASI",role:"Thirteen-year orbital odyssey; landed probe on Titan, found Enceladus plumes"},{name:"Dragonfly",year:"Launching 2028",agency:"NASA",role:"Rotorcraft lander to explore prebiotic chemistry on Titan"}]},Uranus:{name:"Uranus",category:"planet",eyebrow:"PLANET",accentColor:"#8dcdd8",eyebrowColor:"#b3e8f0",distanceAU:"19.18 AU",textureThumb:"textures/thumbs/uranus.webp",monographText:"AN ICE GIANT TILTED SO DRAMATICALLY ON ITS SIDE THAT AT ITS SOLSTICES ONE POLE POINTS ALMOST DIRECTLY AT THE SUN, DRIVING EXTREME DECADES-LONG SEASONS.",extendedLore:"With an axial tilt of 97.77°, Uranus literally rolls along its orbital path like a ball. Scientists theorize a sequence of Earth-sized protoplanetary impacts knocked the giant onto its side early in solar history. Its pale aquamarine coloration originates from methane gas in its upper atmosphere absorbing red light wavelengths.",missions:[{name:"Voyager 2",year:"1986",agency:"NASA",role:"Only spacecraft to encounter Uranus; discovered 10 moons and 2 new rings"},{name:"Uranus Orbiter & Probe",year:"Proposed 2030s",agency:"NASA Decadal",role:"Flagship mission concept prioritized to explore ice giant interiors"}]},Neptune:{name:"Neptune",category:"planet",eyebrow:"PLANET",accentColor:"#4f83e2",eyebrowColor:"#7ca8ff",distanceAU:"30.06 AU",textureThumb:"textures/thumbs/neptune.webp",monographText:"THE MOST DISTANT MAJOR PLANET, SHROUDED IN AN INTENSE DEEP-AZURE METHANE ATMOSPHERE WHERE SUPERSONIC WINDS SURPASS TWO THOUSAND KILOMETERS PER HOUR.",extendedLore:"Neptune was the first planet located through mathematical prediction rather than empirical observation: slight perturbations in Uranus's orbit allowed French astronomer Urbain Le Verrier to calculate its precise position in 1846. It harbors the retrograde moon Triton, a captured Kuiper Belt dwarf world exhibiting nitrogen cryovolcanoes.",missions:[{name:"Voyager 2",year:"1989",agency:"NASA",role:"Close flyby; detected the Great Dark Spot and geysers on Triton"}]},Pluto:{name:"Pluto",category:"dwarf_planet",eyebrow:"DWARF PLANET",accentColor:"#FF8732",eyebrowColor:"#ffa463",distanceAU:"39.48 AU",textureThumb:"textures/thumbs/moon.webp",monographText:"SENTINEL OF THE KUIPER BELT, BEARING THE GLOWING NITROGEN ICE PLAINS OF TOMBAUGH REGIO AND SHARING A SYNCHRONOUS GRAVITATIONAL DANCE WITH ITS COMPANION CHARON.",extendedLore:"Reclassified as a dwarf planet in 2006, Pluto revealed itself during the 2015 New Horizons flyby as a geologically active wonderland. It features convection cells of churned nitrogen-carbon-monoxide ice, water-ice mountains towering 3,500 meters into its thin blue hazy atmosphere, and a likely deep subsurface liquid ocean.",missions:[{name:"New Horizons",year:"2015",agency:"NASA",role:"Historic historic flyby capturing high-resolution imagery of Tombaugh Regio"}]},Moon:{name:"Moon",category:"moon",eyebrow:"NATURAL SATELLITE · EARTH I",accentColor:"#d1d5db",eyebrowColor:"#e5e7eb",distanceAU:"1.000 AU",textureThumb:"textures/thumbs/moon.webp",monographText:"EARTH'S CONSTANT CELESTIAL COMPANION, TIDALLY LOCKED IN AN ANCIENT GRAVITATIONAL EMBRACE. ITS HIGHLANDS AND BASALTIC MARIA PRESERVE FOUR BILLION YEARS OF COSMIC HISTORY.",extendedLore:"Formed ~4.5 billion years ago from the debris of a giant collision between the proto-Earth and a Mars-sized protoplanet named Theia. The Moon stabilizes Earth's rotational tilt, modulating climate extremes and generating oceanic tides.",missions:[{name:"Apollo 11",year:"1969",agency:"NASA",role:"First human landing on another celestial world"},{name:"LRO",year:"2009–Present",agency:"NASA",role:"High-resolution sub-meter 3D laser altimetry and mapping"},{name:"Artemis I",year:"2022",agency:"NASA",role:"Uncrewed lunar orbital qualification flight for deep space exploration"}]},Europa:{name:"Europa",category:"moon",eyebrow:"OCEAN MOON · JUPITER II",accentColor:"#7dd3fc",eyebrowColor:"#bae6fd",distanceAU:"5.203 AU",textureThumb:"textures/thumbs/moon.webp",monographText:"A SMOOTH CRUST OF WATER ICE FRACTURED BY REDDISH LINEAE, CONCEALING A VAST GLOBAL SALTWATER OCEAN CONTAINING TWICE THE WATER OF ALL EARTH'S OCEANS COMBINED.",extendedLore:"Tidally flexed by orbital resonance with Io and Ganymede, Europa's rocky mantle produces geothermal heating that keeps its deep subsurface ocean in a liquid state. Possible water plumes detected by Hubble make it one of humankind's top destinations in the search for extraterrestrial habitability.",missions:[{name:"Galileo",year:"1995–2003",agency:"NASA",role:"Discovered induced magnetic field evidence for a subsurface saline ocean"},{name:"Europa Clipper",year:"2024–Present",agency:"NASA",role:"Dedicated mission equipped with ice-penetrating radar to confirm habitability"}]},Io:{name:"Io",category:"moon",eyebrow:"VOLCANIC MOON · JUPITER I",accentColor:"#facc15",eyebrowColor:"#fef08a",distanceAU:"5.203 AU",textureThumb:"textures/thumbs/moon.webp",monographText:"THE MOST VOLCANICALLY ACTIVE BODY IN THE SOLAR SYSTEM, SCARRED BY HUNDREDS OF ACTIVE VOLCANOES DRIVEN BY INTENSE GRAVITATIONAL TIDAL FRICTION.",extendedLore:"Caught in an eccentric resonance between Jupiter and its sibling moons, Io undergoes constant tidal flexing that generates ferocious internal heat, driving molten silicate lava lakes and sulfur plumes hundreds of kilometers into space.",missions:[{name:"Voyager 1",year:"1979",agency:"NASA",role:"First observation of active extraterrestrial volcanism"},{name:"Juno",year:"2016–Present",agency:"NASA",role:"Close flybys mapping polar volcanic hotspots and magma oceans"}]},Ganymede:{name:"Ganymede",category:"moon",eyebrow:"GIANT MOON · JUPITER III",accentColor:"#cbd5e1",eyebrowColor:"#e2e8f0",distanceAU:"5.203 AU",textureThumb:"textures/thumbs/moon.webp",monographText:"THE LARGEST MOON IN THE SOLAR SYSTEM, EVEN EXCEEDING MERCURY IN DIAMETER, AND THE ONLY SATELLITE BEARING AN INTERNALLY GENERATED MAGNETIC FIELD.",extendedLore:"Possesses a molten iron-rich core that generates an intrinsic magnetosphere. Beneath its grooved and fractured tectonic ice shell lies a deep subterranean liquid ocean separated by high-pressure ice phases.",missions:[{name:"Galileo",year:"1995–2003",agency:"NASA",role:"Identified intrinsic dipolar magnetic field"},{name:"JUICE",year:"2023–Present",agency:"ESA",role:"En route to enter permanent orbit around Ganymede in 2034"}]},Titan:{name:"Titan",category:"moon",eyebrow:"HYDROCARBON WORLD · SATURN VI",accentColor:"#f59e0b",eyebrowColor:"#fde68a",distanceAU:"9.539 AU",textureThumb:"textures/thumbs/moon.webp",monographText:"THE ONLY MOON WITH A DENSE ATMOSPHERE AND STABLE SURFACE SEAS, WHERE METHANE AND ETHANE FORM A COMPLETE METEOROLOGICAL HYDROLOGIC CYCLE.",extendedLore:"Exceeding Mercury in size, Titan possesses an orange smoggy atmosphere whose surface pressure is about 1.5 times Earth's at sea level. Cryogenic rivers carve canyon networks feeding liquid hydrocarbon seas like Kraken Mare.",missions:[{name:"Cassini-Huygens",year:"2004–2017",agency:"NASA / ESA",role:"Huygens landed directly on Titan's surface in 2005"},{name:"Dragonfly",year:"Planned 2028",agency:"NASA",role:"Rotorcraft lander to explore prebiotic organic chemistry"}]},Enceladus:{name:"Enceladus",category:"moon",eyebrow:"CRYOVOLCANIC MOON · SATURN II",accentColor:"#e0f2fe",eyebrowColor:"#f0f9ff",distanceAU:"9.539 AU",textureThumb:"textures/thumbs/moon.webp",monographText:"AN IMMACULATE WORLD OF PURE REFLECTIVE ICE, ERUPTING GIANT HYDROTHERMAL GEYSERS FROM TIGER STRIPES OVER ITS SOUTH POLAR TERRAIN.",extendedLore:"Enceladus possesses a global liquid saltwater ocean in direct physical contact with an active hydrothermal rocky seafloor. Cassini detected complex organic molecules and molecular hydrogen in its plumes, pointing to ongoing hydrothermal chemistry on the seafloor.",missions:[{name:"Cassini",year:"2005–2017",agency:"NASA / ESA",role:"Flew directly through erupting plumes, sampling water vapor, salts, and organics"}]},Ceres:{name:"Ceres",category:"dwarf_planet",eyebrow:"DWARF PLANET · ASTEROID BELT",accentColor:"#a1a1aa",eyebrowColor:"#d4d4d8",distanceAU:"2.767 AU",textureThumb:"textures/thumbs/moon.webp",monographText:"EMPRESS OF THE ASTEROID BELT, HOLDING A THIRD OF ITS ENTIRE MASS. AN ICE-RICH RELICT WORLD FEATURING RADIANT SODIUM CARBONATE SALT DOMES.",extendedLore:"Ceres is a differentiated protoplanet containing significant quantities of water ice and hydrous minerals. Occator Crater hosts the bright Cerealia Facula, formed by subsurface brine percolation and cryovolcanic extrusion.",missions:[{name:"Dawn",year:"2015–2018",agency:"NASA",role:"Orbited Ceres for three years, discovering active cryovolcanism and hydrated minerals"}]},Sun:{name:"Sun",category:"star",eyebrow:"STAR",accentColor:"#ffaa33",eyebrowColor:"#ffe4a0",distanceAU:"0.000 AU",textureThumb:"textures/thumbs/sun.webp",monographText:"THE GLOWING HEART OF OUR SYSTEM, CONTAINING OVER NINETY-NINE POINT EIGHT PERCENT OF ALL MASS. A THERMONUCLEAR ENGINE POWERING ALL LIGHT, LIFE, AND GRAVITATIONAL HARMONY.",extendedLore:"Every second in the solar core, 600 million tons of hydrogen undergo thermonuclear fusion into helium, converting 4 million tons of matter into pure radiant energy. The photon diffusion through the dense radiative zone takes over 100,000 years to reach the convective layer and escape as solar light.",missions:[{name:"SOHO",year:"1995–Present",agency:"ESA / NASA",role:"Continuous monitoring of helioseismology and coronal mass ejections"},{name:"Parker Solar Probe",year:"2018–Present",agency:"NASA",role:"Closest spacecraft to Sun, diving directly through the outer corona"},{name:"Solar Orbiter",year:"2020–Present",agency:"ESA / NASA",role:"Capturing the first close-up images of the Sun's polar regions"}]},"Sagittarius A*":{name:"Sagittarius A*",category:"black_hole",eyebrow:"SUPERMASSIVE BLACK HOLE",accentColor:"#f59e0b",eyebrowColor:"#fde68a",distanceAU:"1.71 × 10⁹ AU (26,990 LY)",textureThumb:"textures/thumbs/milky_way.webp",monographText:"THE 4.3 MILLION SOLAR MASS SUPERMASSIVE BLACK HOLE AT THE DYNAMICAL HEART OF THE MILKY WAY. ITS EVENT HORIZON TRAPS ALL LIGHT, BENDING SPACETIME INTO A RELATIVISTIC PHOTON RING.",extendedLore:"Sagittarius A* (Sgr A*) anchors the Milky Way Galaxy with a mass of 4.297 ± 0.012 × 10⁶ M☉ located 8.277 ± 0.033 kpc (~26,990 light-years) from Earth. In May 2022, the Event Horizon Telescope (EHT) collaboration released the first direct horizon-scale image of its shadow, resolving an angular diameter of 51.8 ± 2.3 microarcseconds that confirms Einstein's General Relativity. Matter orbiting near the innermost stable circular orbit (ISCO at 3.0 r_s) reaches speeds of 0.408 c (122,400 km/s), generating extreme relativistic Doppler beaming and gravitational redshift, framed by high-velocity stars of the central nuclear S-cluster.",missions:[{name:"Event Horizon Telescope (EHT)",year:"2022",agency:"Global Consortium / NSF / ESO",role:"First direct millimeter-wave imaging of Sgr A* event horizon shadow"},{name:"GRAVITY / ESO VLTI",year:"2018–Present",agency:"ESO",role:"Detection of gravitational redshift in star S2 orbit and orbital flares near ISCO"},{name:"Chandra X-ray Observatory",year:"1999–Present",agency:"NASA",role:"Long-term monitoring of hot gas accretion and high-energy flare eruptions"},{name:"Neil Gehrels Swift Observatory",year:"2004–Present",agency:"NASA",role:"Daily multiwavelength monitoring of Galactic Center flaring activity"}]}};function qs(c){return Lt[c]?Lt[c]:{name:c,category:"moon",eyebrow:"CELESTIAL BODY",accentColor:"#93c5fd",eyebrowColor:"#bfdbfe",distanceAU:"—",textureThumb:"textures/thumbs/moon.webp",monographText:`${c.toUpperCase()} IS A DOCUMENTED COMPONENT OF THE SOLAR SYSTEM CATALOGUE.`,extendedLore:`${c}'s orbit is computed from NASA JPL orbital elements (Horizons / Small-Body Database).`,missions:[]}}const $s={visible:"Visible light",monochrome:"Monochrome mosaic",radar:"Radar (not visible light)",atmosphere:"Cloud tops"};function Xs(c){return c>=1e4?`${Math.round(c).toLocaleString("en-US")} km`:c>=10?`${c.toFixed(0)} km`:`${c.toFixed(1)} km`}function Qs(c){return c>=1e3?`${(c/1e3).toFixed(c>=1e4?0:1)} km/px`:`${Math.round(c)} m/px`}function Ct(c,e){return`${Math.abs(c).toFixed(2)}°${c>=0?"N":"S"} ${Math.abs(e).toFixed(2)}°${e>=0?"E":"W"}`}const Zs=({status:c,onFlyToLandmark:e,onDaylight:t,onSelectBody:i,onResetView:a})=>{const[s,o]=T.useState(()=>typeof window>"u"||window.innerWidth>=640),[r,n]=T.useState(""),l=(c==null?void 0:c.body)??null,h=T.useMemo(()=>l?_s(l):[],[l]),m=T.useMemo(()=>Fs(r).slice(0,8),[r]);if(!c||!l||!c.imagery)return null;const p=c.imagery,g=c.layer;let v;return c.streaming?(g==null?void 0:g.state)==="unavailable"?v="Imagery server unreachable — showing globe map":g&&(g.inFlight>0||g.queued>0)?v=`Loading ${g.inFlight+g.queued} tiles · level ${Math.max(0,g.deepestLevel)}/${c.maxLevel}`:g?v=`Level ${Math.max(0,g.deepestLevel)}/${c.maxLevel}${g.state==="degraded"?" · some tiles failed":""}`:v="Global map only":v=p.note&&!g?"Global map only":"Zoom in to stream detail",d.jsxs("section",{"aria-label":"Planetary explorer",className:"absolute right-3 md:right-6 bottom-20 md:bottom-24 w-[300px] max-w-[calc(100vw-24px)] pointer-events-auto z-30 bg-black/55 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl text-white/80 font-light",children:[d.jsxs("div",{className:"flex items-center justify-between px-4 pt-3 pb-2 text-[10px] uppercase tracking-[0.18em]",children:[d.jsxs("nav",{"aria-label":"Breadcrumb",className:"flex items-center gap-1.5 min-w-0",children:[d.jsx("button",{onClick:a,className:"text-white/45 hover:text-white focus-visible:ring-1 focus-visible:ring-white/60 rounded",children:"Solar System"}),d.jsx("span",{className:"text-white/25",children:"›"}),d.jsx("button",{onClick:()=>i(l),className:"text-white/80 hover:text-white focus-visible:ring-1 focus-visible:ring-white/60 rounded",children:l}),c.landmark&&d.jsxs(d.Fragment,{children:[d.jsx("span",{className:"text-white/25",children:"›"}),d.jsx("span",{className:"text-amber-200/90 truncate",children:c.landmark.name})]})]}),d.jsx("button",{onClick:()=>o(y=>!y),"aria-expanded":s,"aria-label":s?"Collapse explorer panel":"Expand explorer panel",className:"text-white/40 hover:text-white px-1 focus-visible:ring-1 focus-visible:ring-white/60 rounded",children:s?"–":"+"})]}),s&&d.jsxs("div",{className:"px-4 pb-3 flex flex-col gap-2.5 text-[11px]",children:[d.jsxs("div",{className:"flex justify-between font-mono text-[10px] text-amber-200/90","aria-live":"polite",children:[d.jsxs("span",{children:["ALT ",Xs(c.altitudeKm)]}),c.subCamera&&d.jsx("span",{children:Ct(c.subCamera.lat,c.subCamera.lon)})]}),c.streaming&&c.sunElevationDeg!==null&&d.jsxs("div",{className:"flex items-center justify-between text-[10px] text-white/50",children:[d.jsx("span",{children:c.sunElevationDeg>0?`Sun ${c.sunElevationDeg.toFixed(0)}° above horizon`:`Night side · Sun ${Math.abs(c.sunElevationDeg).toFixed(0)}° below horizon`}),d.jsx("button",{onClick:()=>t(!c.daylight),"aria-pressed":c.daylight,title:"Light the imagery evenly instead of by the real Sun angle at this moment",className:`px-2 py-0.5 rounded-full border transition ${c.daylight?"border-amber-300/50 text-amber-100 bg-amber-300/10":"border-white/15 text-white/60 hover:text-white"}`,children:"Daylight view"})]}),d.jsxs("div",{className:"text-[10px] text-white/55",children:[v,c.atZoomLimit&&d.jsx("span",{className:"text-white/40",children:" · zoom limit of the source data"})]}),d.jsxs("div",{className:"border-t border-white/10 pt-2",children:[d.jsx("div",{className:"text-white/85",children:p.title}),d.jsxs("div",{className:"text-[10px] text-white/45 mt-0.5",children:[d.jsx("span",{className:"uppercase tracking-[0.14em] text-white/60",children:$s[p.kind]})," · ","best ",Qs(p.bestMetresPerPixel)]}),d.jsx("div",{className:"text-[10px] text-white/40 mt-1 leading-snug",children:p.coverage}),p.note&&d.jsx("div",{className:"text-[10px] text-white/40 mt-1 leading-snug",children:p.note}),d.jsx("a",{href:p.sourceUrl,target:"_blank",rel:"noopener noreferrer",className:"text-[10px] text-white/45 underline hover:text-white/80 mt-1 inline-block",children:p.source})]}),h.length>0&&d.jsxs("div",{className:"border-t border-white/10 pt-2",children:[d.jsx("div",{className:"text-[9px] uppercase tracking-[0.2em] text-white/40 mb-1.5",children:"Landmarks"}),d.jsx("div",{className:"flex flex-wrap gap-1.5",children:h.map(y=>{var M,x;return d.jsx("button",{onClick:()=>e(y.id),title:`${y.description} (${Ct(y.lat,y.lon)} · ${y.source})`,"aria-current":((M=c.landmark)==null?void 0:M.id)===y.id?"true":void 0,className:`px-2 py-0.5 rounded-full border text-[10px] transition ${((x=c.landmark)==null?void 0:x.id)===y.id?"border-amber-300/50 text-amber-100 bg-amber-300/10":"border-white/15 text-white/65 hover:text-white hover:border-white/35"}`,children:y.name},y.id)})})]}),c.landmark&&d.jsxs("div",{className:"text-[10px] text-white/55 leading-snug",children:[c.landmark.description,d.jsxs("div",{className:"text-white/35 mt-0.5",children:[Ct(c.landmark.lat,c.landmark.lon)," · ",c.landmark.source]})]}),d.jsxs("div",{className:"border-t border-white/10 pt-2",children:[d.jsx("input",{type:"search",value:r,onChange:y=>n(y.target.value),placeholder:"Search landmarks on any world","aria-label":"Search landmarks",className:"w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-[11px] text-white placeholder:text-white/30 outline-none focus:border-white/35"}),m.length>0&&d.jsx("ul",{className:"mt-1.5 flex flex-col gap-0.5",role:"list",children:m.map(y=>d.jsx("li",{children:d.jsxs("button",{onClick:()=>{e(y.id),n("")},className:"w-full text-left flex justify-between px-2 py-1 rounded-md hover:bg-white/10 focus-visible:ring-1 focus-visible:ring-white/60",children:[d.jsx("span",{className:"text-white/80",children:y.name}),d.jsx("span",{className:"text-white/35",children:y.body})]})},y.id))})]})]})]})};/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const eo=c=>c.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),Ua=(...c)=>c.filter((e,t,i)=>!!e&&e.trim()!==""&&i.indexOf(e)===t).join(" ").trim();/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var to={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ao=T.forwardRef(({color:c="currentColor",size:e=24,strokeWidth:t=2,absoluteStrokeWidth:i,className:a="",children:s,iconNode:o,...r},n)=>T.createElement("svg",{ref:n,...to,width:e,height:e,stroke:c,strokeWidth:i?Number(t)*24/Number(e):t,className:Ua("lucide",a),...r},[...o.map(([l,h])=>T.createElement(l,h)),...Array.isArray(s)?s:[s]]));/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xe=(c,e)=>{const t=T.forwardRef(({className:i,...a},s)=>T.createElement(ao,{ref:s,iconNode:e,className:Ua(`lucide-${eo(c)}`,i),...a}));return t.displayName=`${c}`,t};/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const io=xe("Calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const so=xe("EyeOff",[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oo=xe("Eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ro=xe("Pause",[["rect",{x:"14",y:"4",width:"4",height:"16",rx:"1",key:"zuxfzm"}],["rect",{x:"6",y:"4",width:"4",height:"16",rx:"1",key:"1okwgv"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const no=xe("Play",[["polygon",{points:"6 3 20 12 6 21 6 3",key:"1oa8hb"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lo=xe("RotateCcw",[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ca=xe("Search",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rt=xe("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]),co=["Sagittarius A*","Pluto","Neptune","Uranus","Saturn","Jupiter","Mars","Earth","Venus","Mercury"],ho=({telemetry:c,onSelectPlanet:e,onResetView:t,onTogglePlay:i,onSetTimeMultiplier:a,onSetScaleMode:s,onSeekDate:o,onResetToJ2000:r,onResetToNow:n,onToggleConstellations:l,onToggleAsteroidBelt:h,onToggleOrbits:m,onJumpToScale:p,onSetLens:g,onCycleLens:v,onFlyToLandmark:y,onExplorerDaylight:M})=>{const x=c==null?void 0:c.activeTarget,b=(c==null?void 0:c.isPaused)??!1,A=(c==null?void 0:c.timeScale)??1,f=(c==null?void 0:c.scaleMode)??"exploration",S=(c==null?void 0:c.julianDate)??2451545,D=(c==null?void 0:c.utcIso)??new Date().toISOString(),R=(c==null?void 0:c.constellationsVisible)??!0,N=(c==null?void 0:c.asteroidBeltVisible)??!0,I=(c==null?void 0:c.orbitsVisible)??!0,U=(c==null?void 0:c.observerScaleMetric)??"1.00 AU",ee=(c==null?void 0:c.lensProfile)??"cinematic",Q=(c==null?void 0:c.observerDomain)??"inner_system",ne=(c==null?void 0:c.travelSpeed)??0,[Te,ue]=T.useState(!0),[we,oe]=T.useState(!1),[be,se]=T.useState(!1),[le,ja]=T.useState("all"),[$e,_a]=T.useState(""),[Xe,Ht]=T.useState(D.slice(0,10)),[Me,Qe]=T.useState(!1),[Wt,Ze]=T.useState(!1),[Vt,xt]=T.useState(0),[Yt,wt]=T.useState(!0),[Fa,et]=T.useState(!1),[Jt,qt]=T.useState(!1);T.useEffect(()=>{if(typeof window<"u"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches){xt(2);return}const w=setTimeout(()=>xt(1),500),C=setTimeout(()=>xt(2),1200);return()=>{clearTimeout(w),clearTimeout(C)}},[]),T.useEffect(()=>{const w=C=>{C.target instanceof HTMLInputElement||C.target instanceof HTMLTextAreaElement||(C.key===" "||C.code==="Space"?(C.preventDefault(),i()):C.key==="h"||C.key==="H"?(C.preventDefault(),ue(ce=>!ce)):C.key==="Escape"?we?oe(!1):be||Me?(se(!1),Qe(!1)):t():C.key==="o"||C.key==="O"?m==null||m():C.key==="c"||C.key==="C"?l==null||l():C.key==="b"||C.key==="B"?h==null||h():(C.key==="l"||C.key==="L")&&(v==null||v()))};return window.addEventListener("keydown",w),()=>window.removeEventListener("keydown",w)},[i,m,l,h,v,t,we,be,Me]),T.useEffect(()=>{!Wt&&!Me&&Ht(D.slice(0,10))},[D,Wt,Me]);const H=(x==null?void 0:x.name)||"Mercury",ae=T.useMemo(()=>qs(H),[H]),_e=T.useMemo(()=>{const w=[...q.getAllBodies()],C=q.getSagittariusAStar();return C&&w.unshift(C),w},[]),K=T.useMemo(()=>H==="Sagittarius A*"||H==="Sgr A*"||H==="sagittarius_a_star"?q.getSagittariusAStar():q.getBody(H),[H]),[Ba,$t]=T.useState(1),Xt=T.useRef(null);T.useEffect(()=>{H!==Xt.current&&(Xt.current=H,$t(w=>w+1))},[H]),T.useEffect(()=>{if(wt(!0),et(!1),Jt)return;const w=setTimeout(()=>{et(!0)},5500),C=setTimeout(()=>{wt(!1),et(!1)},7100);return()=>{clearTimeout(w),clearTimeout(C)}},[Ba,Jt]);const tt=T.useCallback(()=>{wt(!0),et(!1),$t(w=>w+1)},[]),Ga=T.useMemo(()=>_e.filter(w=>{if(le==="planet"&&w.category!=="planet"||le==="moon"&&w.category!=="moon"||le==="minor"&&w.category!=="asteroid"&&w.category!=="dwarf_planet")return!1;if($e.trim()){const C=$e.toLowerCase();return w.name.toLowerCase().includes(C)||w.category.toLowerCase().includes(C)||w.parentName&&w.parentName.toLowerCase().includes(C)}return!0}),[_e,le,$e]),za=w=>{w.preventDefault(),Ze(!1);const C=Date.parse(Xe);isNaN(C)||(o(C),Qe(!1))},Ka=[{label:"1×",val:1},{label:"10×",val:10},{label:"100×",val:100},{label:"1 D/S",val:86400},{label:"1 M/S",val:2592e3},{label:"1 Y/S",val:31536e3}],Ha="/solaris/";return Te?d.jsxs("div",{className:"absolute inset-0 pointer-events-none select-none flex flex-col justify-between p-3 md:p-6 z-20 font-sans text-white/90 overflow-hidden",children:[d.jsx("div",{className:"absolute -top-16 left-1/2 -translate-x-1/2 w-[540px] h-32 rounded-[100%] bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-transparent blur-3xl pointer-events-none"}),d.jsxs("header",{className:"flex flex-col md:flex-row md:justify-between items-start gap-2 pointer-events-auto w-full z-30",children:[d.jsxs("div",{className:`flex flex-col gap-1.5 transition-all duration-1000 ${Vt>=0?"opacity-100 translate-y-0":"opacity-0 -translate-y-4"}`,children:[d.jsxs("div",{className:"flex items-baseline gap-3 relative group cursor-pointer",onClick:t,onKeyDown:w=>{(w.key==="Enter"||w.key===" ")&&(w.preventDefault(),t())},role:"button",tabIndex:0,"aria-label":"SOLARIS — reset to system overview",title:"Reset to Solaris Overview",children:[d.jsx("div",{className:"absolute -inset-2 bg-gradient-to-r from-amber-500/10 via-white/5 to-transparent rounded-lg blur-md opacity-40 group-hover:opacity-90 transition-opacity animate-corona-aura pointer-events-none"}),d.jsx("h1",{className:"relative text-xl md:text-2xl uppercase tracking-[0.52em] font-extralight drop-shadow-md select-none animate-solaris-shimmer",children:"SOLARIS"}),d.jsx("span",{className:"text-[9px] uppercase tracking-[0.32em] text-white/35 font-light hidden 2xl:inline",children:"Solar System Explorer"})]}),d.jsxs("div",{className:"flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-light text-white/60 bg-black/40 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/10 shadow-lg w-fit max-w-full mt-0.5 flex-wrap md:flex-nowrap md:whitespace-nowrap",children:[d.jsx("span",{className:`w-1.5 h-1.5 rounded-full ${b?"bg-amber-400":"bg-emerald-400 animate-pulse"}`}),d.jsxs("span",{className:"text-white/85",children:[D.replace("T"," ").slice(0,19)," UTC"]}),d.jsx("span",{className:"text-white/20",children:"·"}),d.jsxs("span",{children:["JD ",S.toFixed(2)]}),d.jsx("span",{className:"text-white/20",children:"·"}),d.jsx("span",{className:"text-amber-300/90 font-mono tracking-wider",children:U})]})]}),d.jsxs("div",{className:"hidden xl:flex items-center gap-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-1 shadow-lg pointer-events-auto",children:[d.jsxs("div",{className:"flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] tracking-[0.2em] font-light",children:[d.jsx("span",{className:`w-1.5 h-1.5 rounded-full ${ne>4?"bg-cyan-400 animate-ping":"bg-amber-400"}`}),d.jsx("span",{className:"text-white/40 uppercase",children:"SCALE:"}),d.jsx("span",{className:"text-white font-medium tracking-[0.12em]",children:U})]}),d.jsxs("div",{className:"flex items-center gap-0.5 text-[9px] uppercase tracking-[0.2em] font-light",children:[d.jsx("button",{onClick:()=>p==null?void 0:p("planetary"),className:`px-2.5 py-1 rounded-full transition-all duration-200 ${Q==="planetary"?"bg-white/20 text-white font-medium shadow-sm border border-white/25":"text-white/40 hover:text-white/80"}`,children:"Planet"}),d.jsx("button",{onClick:()=>p==null?void 0:p("inner_system"),className:`px-2.5 py-1 rounded-full transition-all duration-200 ${Q==="inner_system"?"bg-white/20 text-white font-medium shadow-sm border border-white/25":"text-white/40 hover:text-white/80"}`,children:"Inner Sys"}),d.jsx("button",{onClick:()=>p==null?void 0:p("outer_system"),className:`px-2.5 py-1 rounded-full transition-all duration-200 ${Q==="outer_system"?"bg-white/20 text-white font-medium shadow-sm border border-white/25":"text-white/40 hover:text-white/80"}`,children:"Outer Sys"}),d.jsx("button",{onClick:()=>p==null?void 0:p("interstellar"),className:`px-2.5 py-1 rounded-full transition-all duration-200 ${Q==="interstellar"?"bg-cyan-400/25 text-cyan-200 font-medium shadow-sm border border-cyan-400/35":"text-white/40 hover:text-white/80"}`,children:"Interstellar"}),d.jsx("button",{onClick:()=>p==null?void 0:p("galactic"),className:`px-2.5 py-1 rounded-full transition-all duration-200 ${Q==="galactic"&&H!=="Sagittarius A*"?"bg-purple-400/25 text-purple-200 font-medium shadow-sm border border-purple-400/35":"text-white/40 hover:text-white/80"}`,children:"Milky Way"}),d.jsx("button",{onClick:()=>{p==null||p("sgr_a"),e("Sagittarius A*"),tt()},className:`px-2.5 py-1 rounded-full transition-all duration-200 ${H==="Sagittarius A*"?"bg-amber-500/30 text-amber-200 font-medium shadow-sm border border-amber-500/40":"text-white/40 hover:text-white/80"}`,children:"Sgr A*"})]})]}),d.jsxs("div",{className:"flex flex-wrap items-center justify-start md:justify-end gap-2 min-w-0",children:[d.jsxs("div",{className:"flex items-center bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-0.5 text-[10px] uppercase tracking-[0.2em] font-light shadow-lg",children:[d.jsx("button",{onClick:w=>{w.stopPropagation(),m==null||m()},title:"Toggle Orbit Lines (O)","aria-pressed":I,className:`px-3 py-1 rounded-full transition-all duration-200 ${I?"bg-white/15 text-white shadow-sm border border-white/20":"text-white/40 hover:text-white/80"}`,children:"Orbits"}),d.jsx("button",{onClick:w=>{w.stopPropagation(),l==null||l()},title:"Toggle constellation figures (C)","aria-pressed":R,className:`px-3 py-1 rounded-full transition-all duration-200 ${R?"bg-white/15 text-white shadow-sm border border-white/20":"text-white/40 hover:text-white/80"}`,children:"Constellations"}),d.jsx("button",{onClick:w=>{w.stopPropagation(),h==null||h()},title:"Toggle Asteroid Belt (B)","aria-pressed":N,className:`px-3 py-1 rounded-full transition-all duration-200 ${N?"bg-white/15 text-white shadow-sm border border-white/20":"text-white/40 hover:text-white/80"}`,children:"Belt"})]}),d.jsxs("div",{className:"flex items-center bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-0.5 text-[10px] uppercase tracking-[0.2em] font-light shadow-lg",children:[d.jsx("button",{onClick:w=>{w.stopPropagation(),s("exploration")},"aria-pressed":f==="exploration",title:"Compressed distances and enlarged bodies for exploring",className:`px-3 py-1 rounded-full transition-all duration-200 ${f==="exploration"?"bg-white/15 text-white shadow-sm border border-white/20":"text-white/40 hover:text-white/80"}`,children:"Exploration"}),d.jsx("button",{onClick:w=>{w.stopPropagation(),s("scientific")},"aria-pressed":f==="scientific",title:"Orbital distances to true scale (1 unit = 1,000,000 km); globes are enlarged 4× (minimum 15,000 km) so they stay visible",className:`px-3 py-1 rounded-full transition-all duration-200 ${f==="scientific"?"bg-white/15 text-white shadow-sm border border-white/20":"text-white/40 hover:text-white/80"}`,children:"True Distances"})]}),d.jsx("div",{className:"flex items-center bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-0.5 text-[10px] uppercase tracking-[0.2em] font-light shadow-lg",role:"group","aria-label":"Camera lens (L)",children:rt.map(w=>d.jsx("button",{onClick:C=>{C.stopPropagation(),g==null||g(w)},"aria-pressed":ee===w,title:`${ut[w].label} lens (L cycles)`,className:`px-3 py-1 rounded-full transition-all duration-200 ${ee===w?"bg-white/15 text-white shadow-sm border border-white/20":"text-white/40 hover:text-white/80"}`,children:ut[w].label},w))}),d.jsxs("button",{onClick:w=>{w.stopPropagation(),se(!0)},className:"flex items-center gap-1.5 px-3.5 py-1.5 bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/10 hover:border-white/20 rounded-full text-[10px] uppercase tracking-[0.2em] font-light text-white/80 transition shadow-lg",children:[d.jsx(ca,{size:11,className:"text-white/50"}),d.jsxs("span",{children:["Catalogue (",_e.length,")"]})]}),d.jsxs("button",{onClick:w=>{w.stopPropagation(),t()},title:"Reset to System Overview",className:"flex items-center gap-1.5 px-3.5 py-1.5 bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/10 hover:border-white/20 rounded-full text-[10px] uppercase tracking-[0.2em] font-light text-white/80 transition shadow-lg",children:[d.jsx(lo,{size:11,className:"text-white/50"}),d.jsx("span",{children:"Overview"})]}),d.jsx("button",{onClick:w=>{w.stopPropagation(),ue(!1)},title:"Hide Interface (H)","aria-label":"Hide interface",className:"p-2 bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/10 rounded-full text-white/40 hover:text-white transition shadow-lg",children:d.jsx(so,{size:12})})]})]}),d.jsx("nav",{className:`absolute left-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-3 [@media(max-height:720px)]:gap-1 [@media(max-height:720px)]:top-[calc(50%+28px)] [@media(max-height:560px)]:hidden pointer-events-auto transition-all duration-1000 z-30 ${Vt>=1?"opacity-100 translate-x-0":"opacity-0 -translate-x-8"}`,children:co.map(w=>{const C=Lt[w],ce=H===w,Wa=`${Ha}${(C==null?void 0:C.textureThumb)||"textures/2k_moon.jpg"}`;return d.jsxs("button",{"aria-current":ce?"true":void 0,"aria-label":`Fly to ${w}`,onClick:Va=>{Va.stopPropagation(),w==="Sagittarius A*"&&(p==null||p("sgr_a")),e(w),tt()},className:"flex items-center gap-3.5 group text-left cursor-pointer transition-all duration-200 outline-none focus-visible:ring-1 focus-visible:ring-white/60 rounded",children:[d.jsx("div",{className:`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${ce?"border-white":"border-white/35 group-hover:border-white/60"}`,children:ce&&d.jsx("div",{className:"w-1.5 h-1.5 rounded-full bg-white transition-transform scale-100"})}),ce?d.jsx("div",{className:"h-2.5 rounded-sm transition-all duration-300",style:{backgroundColor:(C==null?void 0:C.accentColor)||"#ffffff",width:"28px",boxShadow:`0 0 10px ${(C==null?void 0:C.accentColor)||"#ffffff"}88`}}):d.jsx("div",{className:"w-6 h-6 rounded-full bg-cover bg-center transition-opacity duration-200 opacity-60 group-hover:opacity-90 flex-shrink-0",style:{backgroundImage:`url(${Wa})`,boxShadow:"inset -2px -4px 5px 1px rgba(0,0,0,0.9), inset 1px 1px 2px rgba(255,255,255,0.2)"}}),d.jsxs("div",{className:"flex flex-col",children:[d.jsx("span",{className:`text-[11px] uppercase tracking-[0.22em] transition-colors duration-200 ${ce?"text-white font-medium":"text-white/40 group-hover:text-white/80"}`,children:w}),d.jsx("span",{className:`text-[9px] tracking-wider transition-colors duration-200 font-light ${ce?"text-white/50":"text-white/20 group-hover:text-white/40"}`,children:(C==null?void 0:C.distanceAU)||""})]})]},w)})}),Yt&&d.jsx("section",{onMouseEnter:()=>qt(!0),onMouseLeave:()=>qt(!1),className:"absolute left-1/2 bottom-20 md:bottom-24 -translate-x-1/2 pointer-events-auto select-none z-20",children:d.jsxs("div",{className:`flex flex-col items-center text-center max-w-2xl px-6 ${Fa?"monograph-vanishing":"monograph-visible"}`,children:[d.jsx("span",{className:"text-[11px] md:text-xs uppercase tracking-[0.52em] font-light transition-colors duration-500 mb-1",style:{color:ae.eyebrowColor},children:ae.eyebrow}),d.jsx("h2",{className:"text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight tracking-[0.2em] sm:tracking-[0.36em] text-white uppercase drop-shadow-2xl my-1.5 transition-all duration-500",children:H}),d.jsx("p",{className:"text-[10px] md:text-[11px] lg:text-[12px] font-light tracking-[0.20em] leading-relaxed text-white/75 uppercase max-w-xl mx-auto my-3 text-center transition-all duration-500",children:ae.monographText}),d.jsxs("button",{onClick:w=>{w.stopPropagation(),oe(!0)},className:"group mt-2.5 flex flex-col items-center cursor-pointer transition-all duration-300 outline-none focus-visible:ring-1 focus-visible:ring-white/60 rounded",children:[d.jsx("span",{className:"text-xs uppercase tracking-[0.32em] font-light transition-colors duration-300",style:{color:ae.accentColor},children:"READ MORE"}),d.jsx("div",{className:"h-[1px] w-full mt-1 transition-all duration-300 group-hover:w-[115%]",style:{backgroundColor:ae.accentColor,boxShadow:`0 0 6px ${ae.accentColor}66`}})]})]})}),!Yt&&d.jsx("div",{className:"absolute left-1/2 bottom-20 -translate-x-1/2 pointer-events-auto z-20 transition-all duration-700 opacity-60 hover:opacity-100",children:d.jsxs("button",{onClick:w=>{w.stopPropagation(),tt()},className:"flex items-center gap-2 px-3.5 py-1 text-[10px] uppercase tracking-[0.25em] font-light text-white/60 hover:text-white bg-black/40 hover:bg-black/80 backdrop-blur-md border border-white/10 hover:border-white/25 rounded-full transition-all shadow-lg cursor-pointer",children:[d.jsx("span",{className:"w-1.5 h-1.5 rounded-full animate-pulse",style:{backgroundColor:ae.accentColor}}),d.jsxs("span",{children:[H," Overview"]})]})}),d.jsx(Zs,{status:c==null?void 0:c.explorer,onFlyToLandmark:w=>y==null?void 0:y(w),onDaylight:w=>M==null?void 0:M(w),onSelectBody:e,onResetView:t}),d.jsxs("footer",{className:"flex flex-col items-center gap-2 w-full pointer-events-auto z-30",children:[d.jsxs("div",{className:"flex flex-wrap items-center justify-center gap-x-3 gap-y-1 max-w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl md:rounded-full px-4 py-1 text-[10px] uppercase tracking-[0.2em] font-light shadow-xl",children:[d.jsx("button",{onClick:w=>{w.stopPropagation(),i()},className:"p-1 text-white/70 hover:text-white transition rounded-full",title:"Space to toggle play","aria-label":b?"Play simulation":"Pause simulation",children:b?d.jsx(no,{size:11}):d.jsx(ro,{size:11})}),d.jsx("div",{className:"flex items-center gap-1 border-l border-white/10 pl-3",children:Ka.map(w=>{const C=!b&&A===w.val;return d.jsx("button",{"aria-pressed":C,onClick:ce=>{ce.stopPropagation(),a(w.val)},className:`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-[0.15em] transition-all duration-200 ${C?"bg-white/20 text-white font-normal border border-white/25 shadow-sm":"text-white/40 hover:text-white/70"}`,children:w.label},w.label)})}),d.jsxs("div",{className:"flex items-center gap-1.5 border-l border-white/10 pl-3 text-[10px] uppercase tracking-[0.2em] font-light",children:[d.jsx("button",{onClick:w=>{w.stopPropagation(),r()},className:"text-white/40 hover:text-white px-1.5 py-0.5 rounded transition",children:"J2000"}),d.jsx("button",{onClick:w=>{w.stopPropagation(),n()},className:"text-white/40 hover:text-white px-1.5 py-0.5 rounded transition",children:"Now"}),d.jsxs("button",{onClick:w=>{w.stopPropagation(),Qe(!Me)},"aria-label":`Jump to date (current ${Xe})`,"aria-expanded":Me,className:"flex items-center gap-1 text-white/50 hover:text-white px-1.5 py-0.5 rounded transition",children:[d.jsx(io,{size:10}),d.jsx("span",{children:Xe})]})]})]}),Me&&d.jsxs("form",{onSubmit:za,className:"flex items-center gap-2 bg-black/85 backdrop-blur-xl border border-white/15 rounded-xl px-3 py-2 text-[10px] uppercase tracking-[0.2em] font-light shadow-2xl",children:[d.jsx("input",{type:"date","aria-label":"Simulation date (UTC)",value:Xe,onFocus:()=>Ze(!0),onChange:w=>{Ze(!0),Ht(w.target.value)},onBlur:()=>Ze(!1),className:"bg-white/10 text-white px-2 py-1 rounded border border-white/15 outline-none focus:border-white/40 text-[11px] font-sans"}),d.jsx("button",{type:"submit",className:"px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg transition text-[10px] uppercase tracking-[0.2em] font-light",children:"Jump"}),d.jsx("button",{type:"button",onClick:()=>Qe(!1),className:"p-1 text-white/40 hover:text-white","aria-label":"Close date picker",children:d.jsx(Rt,{size:12})})]})]}),we&&d.jsxs("div",{className:"fixed inset-0 z-50 pointer-events-auto flex justify-end animate-fadeIn",children:[d.jsx("div",{onClick:()=>oe(!1),className:"flex-1 bg-black/60 backdrop-blur-sm transition-opacity"}),d.jsxs("aside",{className:"w-[420px] max-w-full bg-[#040307]/95 backdrop-blur-2xl border-l border-white/10 p-7 flex flex-col gap-6 shadow-2xl h-full font-sans overflow-y-auto no-scrollbar",children:[d.jsxs("div",{className:"flex justify-between items-start border-b border-white/10 pb-4",children:[d.jsxs("div",{children:[d.jsxs("span",{className:"text-[10px] uppercase tracking-[0.25em] font-light block",style:{color:ae.eyebrowColor},children:[ae.eyebrow," · SOLAR SYSTEM EXPLORER"]}),d.jsx("h2",{className:"text-3xl font-extralight text-white tracking-[0.25em] uppercase mt-1",children:H})]}),d.jsx("button",{onClick:()=>oe(!1),className:"text-white/40 hover:text-white transition p-1.5 rounded-full hover:bg-white/10","aria-label":"Close details",children:d.jsx(Rt,{size:18})})]}),d.jsxs("div",{className:"flex flex-col gap-2",children:[d.jsx("span",{className:"text-[10px] tracking-[0.25em] uppercase text-white/40 font-light",children:"Astronomical Lore & Physical Environment"}),d.jsx("p",{className:"text-xs leading-relaxed text-white/80 font-light",children:ae.extendedLore})]}),(H==="Sagittarius A*"||(x==null?void 0:x.category)==="black_hole")&&d.jsxs("div",{className:"flex flex-col gap-2.5 pt-2 border-t border-amber-500/30",children:[d.jsxs("div",{className:"flex items-center justify-between",children:[d.jsx("span",{className:"text-[10px] tracking-[0.25em] uppercase text-amber-400 font-medium",children:"Relativistic Horizons & Metrics"}),d.jsx("span",{className:"text-[9px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30",children:"EHT / NASA SVS"})]}),d.jsxs("div",{className:"grid grid-cols-2 gap-y-2 text-xs font-light bg-amber-500/5 p-3 rounded-xl border border-amber-500/15",children:[d.jsx("span",{className:"text-white/40",children:"Mass (M)"}),d.jsx("span",{className:"text-right text-amber-200 font-mono",children:"4.297 ± 0.012 × 10⁶ M☉"}),d.jsx("span",{className:"text-white/40",children:"Schwarzschild Radius (r_s)"}),d.jsx("span",{className:"text-right text-amber-200 font-mono",children:"12.69 × 10⁶ km (0.085 AU)"}),d.jsx("span",{className:"text-white/40",children:"Photon Sphere (r_ph)"}),d.jsx("span",{className:"text-right text-amber-200 font-mono",children:"1.5 r_s · 19.04 × 10⁶ km"}),d.jsx("span",{className:"text-white/40",children:"Shadow Radius (r_shadow)"}),d.jsx("span",{className:"text-right text-amber-200 font-mono",children:"2.60 r_s · 32.97 × 10⁶ km"}),d.jsx("span",{className:"text-white/40",children:"EHT Shadow Diameter (θ)"}),d.jsx("span",{className:"text-right text-amber-200 font-mono",children:"51.8 ± 2.3 µas"}),d.jsx("span",{className:"text-white/40",children:"ISCO Radius (r_isco)"}),d.jsx("span",{className:"text-right text-amber-200 font-mono",children:"3.0 r_s · 38.07 × 10⁶ km"}),d.jsx("span",{className:"text-white/40",children:"ISCO Orbital Velocity"}),d.jsx("span",{className:"text-right text-amber-200 font-mono",children:"0.408 c (122,400 km/s)"}),d.jsx("span",{className:"text-white/40",children:"Galactic Center Distance"}),d.jsx("span",{className:"text-right text-amber-200 font-mono",children:"8.277 kpc (26,990 ly)"})]}),d.jsxs("div",{className:"flex flex-col gap-1.5 p-3 rounded-xl bg-black/50 border border-white/10 text-[11px] text-white/70 font-light",children:[d.jsx("span",{className:"text-[10px] uppercase tracking-[0.2em] text-white/40 font-medium",children:"Relativistic Optical Phenomena:"}),d.jsxs("p",{children:["• ",d.jsx("strong",{className:"text-amber-200 font-normal",children:"Event Horizon Shadow:"})," In the Schwarzschild metric every photon with impact parameter b Null-geodesic ray tracing confirms absolute photon capture for impact parameters b < 2.598 r_s (3√3/2 r_s).lt; 3√3/2 r_s ≈ 2.598 r_s is captured."]}),d.jsxs("p",{children:["• ",d.jsx("strong",{className:"text-amber-200 font-normal",children:"Lensed Accretion Arches:"})," Light emitted from the rear accretion disk loops over and under the black hole's gravitational potential well, projecting primary and secondary lensed arcs."]}),d.jsxs("p",{children:["• ",d.jsx("strong",{className:"text-amber-200 font-normal",children:"Relativistic Doppler Beaming:"})," Plasma orbiting at ~0.4 c blazes in intense blue-white on the approaching left limb (intensity boost ~ δ⁴) while receding plasma dims into deep red."]}),d.jsxs("p",{children:["• ",d.jsx("strong",{className:"text-amber-200 font-normal",children:"Relativistic Polar Jets:"})," Twin collimated particle beams erupting at ~0.98 c along the spin axis, featuring an incandescent white-hot core and helical synchrotron shock sheaths."]}),d.jsxs("p",{children:["• ",d.jsx("strong",{className:"text-amber-200 font-normal",children:"Nuclear S-Cluster:"})," Over 300 massive B/O-type stars orbit Sgr A* in the central parsec, including star S2 reaching speeds of 7,650 km/s at pericenter."]})]})]}),K&&d.jsxs("div",{className:"flex flex-col gap-2 pt-2 border-t border-white/10",children:[d.jsx("span",{className:"text-[10px] tracking-[0.25em] uppercase text-white/40 font-light",children:"Physical Dimensions"}),d.jsxs("div",{className:"grid grid-cols-2 gap-y-2 text-xs font-light",children:[d.jsx("span",{className:"text-white/40",children:"Mean Radius"}),d.jsxs("span",{className:"text-right text-white/90",children:[K.physical.meanRadiusKm.toLocaleString()," km"]}),d.jsx("span",{className:"text-white/40",children:"Surface Gravity"}),d.jsx("span",{className:"text-right text-white/90",children:K.physical.gmKm3S2?`${(K.physical.gmKm3S2*1e3/Math.pow(K.physical.meanRadiusKm,2)).toFixed(2)} m/s²`:"—"}),d.jsx("span",{className:"text-white/40",children:"Sidereal Day"}),d.jsx("span",{className:"text-right text-white/90",children:K.physical.rotationPeriodHours!==void 0?`${K.physical.rotationPeriodHours.toFixed(1)} h`:"Synchronous"}),d.jsx("span",{className:"text-white/40",children:"Axial Tilt"}),d.jsx("span",{className:"text-right text-white/90",children:K.physical.axialTiltDeg!==void 0?`${K.physical.axialTiltDeg.toFixed(2)}°`:"0.00°"})]})]}),K&&d.jsxs("div",{className:"flex flex-col gap-2 pt-2 border-t border-white/10",children:[d.jsx("span",{className:"text-[10px] tracking-[0.25em] uppercase text-white/40 font-light",children:"Keplerian Orbit (J2000)"}),d.jsxs("div",{className:"grid grid-cols-2 gap-y-2 text-xs font-light",children:[d.jsx("span",{className:"text-white/40",children:"Semi-Major Axis"}),d.jsxs("span",{className:"text-right text-white/90",children:[K.orbit.semiMajorAxisAU.toFixed(3)," AU"]}),d.jsx("span",{className:"text-white/40",children:"Eccentricity"}),d.jsx("span",{className:"text-right text-white/90",children:K.orbit.eccentricity.toFixed(4)}),d.jsx("span",{className:"text-white/40",children:"Orbital Period"}),d.jsx("span",{className:"text-right text-white/90",children:K.orbit.orbitalPeriodDays>730?`${(K.orbit.orbitalPeriodDays/365.25).toFixed(2)} yr`:`${K.orbit.orbitalPeriodDays.toFixed(1)} d`}),d.jsx("span",{className:"text-white/40",children:"Inclination"}),d.jsxs("span",{className:"text-right text-white/90",children:[K.orbit.inclinationDeg.toFixed(2),"°"]})]})]}),x&&d.jsxs("div",{className:"flex flex-col gap-2 pt-2 border-t border-white/10",children:[d.jsx("span",{className:"text-[10px] tracking-[0.25em] uppercase text-white/40 font-light",children:"Live Ephemeris Telemetry"}),d.jsxs("div",{className:"grid grid-cols-2 gap-y-2 text-xs font-light",children:[d.jsx("span",{className:"text-white/40",children:"Heliocentric Dist"}),d.jsx("span",{className:"text-right text-white/90",children:x.distanceKm>1e6?`${(x.distanceKm/1e6).toFixed(2)}M km`:`${Math.round(x.distanceKm).toLocaleString()} km`}),d.jsx("span",{className:"text-white/40",children:"AU Distance"}),d.jsxs("span",{className:"text-right text-white/90",children:[(x.distanceKm/1495978707e-1).toFixed(3)," AU"]}),d.jsx("span",{className:"text-white/40",children:"Orbital Velocity"}),d.jsxs("span",{className:"text-right text-white/90",children:[x.apparentSpeedKmS.toFixed(2)," km/s"]})]})]}),ae.missions&&ae.missions.length>0&&d.jsxs("div",{className:"flex flex-col gap-3 pt-2 border-t border-white/10",children:[d.jsx("span",{className:"text-[10px] tracking-[0.25em] uppercase text-white/40 font-light",children:"Exploration Missions"}),d.jsx("div",{className:"flex flex-col gap-2.5",children:ae.missions.map(w=>d.jsxs("div",{className:"p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col gap-1",children:[d.jsxs("div",{className:"flex justify-between items-center text-xs",children:[d.jsx("span",{className:"text-white font-medium tracking-[0.1em]",children:w.name}),d.jsxs("span",{className:"text-[10px] text-white/40 font-light",children:[w.year," · ",w.agency]})]}),d.jsx("p",{className:"text-[11px] text-white/60 font-light",children:w.role})]},w.name))})]}),d.jsxs("div",{className:"pt-3 border-t border-white/10 flex justify-between items-center text-[10px] font-light text-white/30 uppercase tracking-[0.2em]",children:[d.jsx("span",{children:(K==null?void 0:K.orbit.source)??"NASA JPL orbital elements"}),d.jsx("span",{children:"Keplerian 2-Body Solver"})]}),d.jsxs("p",{className:"text-[10px] leading-relaxed font-light text-white/35",children:["Textures: Solar System Scope (CC BY 4.0) · Sky map: ESA/Gaia/DPAC (CC BY-SA 3.0 IGO) · Stars: ESA/Hipparcos (CC BY-NC 3.0 IGO) · Galaxy art: NASA/JPL-Caltech/ESO/R. Hurt (CC BY 4.0) · Orbits: NASA JPL."," ",d.jsx("a",{href:"https://github.com/LetMeCodex/solaris/blob/main/ASSETS.md",target:"_blank",rel:"noopener noreferrer",className:"underline hover:text-white/70",children:"Full credits"})]})]})]}),be&&d.jsxs("div",{className:"fixed inset-0 z-50 pointer-events-auto flex",children:[d.jsx("div",{onClick:()=>se(!1),className:"flex-1 bg-black/60 backdrop-blur-sm transition-opacity"}),d.jsxs("aside",{className:"w-96 bg-[#07060a]/95 backdrop-blur-2xl border-l border-white/10 p-6 flex flex-col gap-5 shadow-2xl h-full font-sans",children:[d.jsxs("div",{className:"flex justify-between items-center border-b border-white/10 pb-4",children:[d.jsxs("div",{children:[d.jsx("h3",{className:"text-lg font-extralight text-white tracking-[0.25em] uppercase",children:"Astronomical Catalogue"}),d.jsxs("span",{className:"text-[10px] uppercase tracking-[0.2em] font-light text-white/40",children:[_e.length," bodies · NASA JPL elements"]})]}),d.jsx("button",{onClick:()=>se(!1),className:"text-white/40 hover:text-white transition p-1.5 rounded-full hover:bg-white/5","aria-label":"Close catalogue",children:d.jsx(Rt,{size:16})})]}),d.jsxs("div",{className:"flex flex-col gap-2.5 text-xs",children:[d.jsxs("div",{className:"relative",children:[d.jsx(ca,{size:13,className:"absolute left-3 top-2.5 text-white/35"}),d.jsx("input",{type:"text",placeholder:"FILTER BY NAME, CATEGORY...","aria-label":"Filter catalogue by name or category",value:$e,onChange:w=>_a(w.target.value),className:"w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white placeholder-white/30 text-[11px] uppercase tracking-[0.15em] outline-none focus:border-white/30"})]}),d.jsx("div",{className:"grid grid-cols-4 gap-1 text-[10px] uppercase tracking-[0.18em] font-light",children:["all","planet","moon","minor"].map(w=>d.jsx("button",{onClick:()=>ja(w),"aria-pressed":le===w,className:`py-1 rounded-lg text-center uppercase tracking-wider transition-all duration-200 ${le===w?"bg-white/15 text-white font-normal border border-white/20":"text-white/40 hover:text-white/70"}`,children:w==="all"?`All (${_e.length})`:w==="planet"?"Planets":w==="moon"?"Moons":"Minor"},w))})]}),d.jsx("div",{className:"flex-1 overflow-y-auto no-scrollbar flex flex-col gap-1.5 pr-1",children:Ga.map(w=>{const C=H===w.name;return d.jsxs("button",{onClick:()=>{e(w.name),tt(),se(!1)},className:`flex items-center justify-between p-2.5 rounded-xl border transition text-left ${C?"bg-white/15 border-white/30 text-white":"bg-white/[0.02] border-white/5 text-white/70 hover:bg-white/[0.06] hover:text-white"}`,children:[d.jsxs("div",{className:"flex items-center gap-3",children:[d.jsx("span",{className:"w-2 h-2 rounded-full flex-shrink-0",style:{backgroundColor:w.physical.colorHex||"#ffffff"}}),d.jsxs("div",{className:"flex flex-col",children:[d.jsx("span",{className:"text-xs text-white font-light tracking-[0.15em] uppercase",children:w.name}),d.jsxs("span",{className:"text-[10px] text-white/35 uppercase tracking-[0.1em]",children:[w.category.replace("_"," "),w.parentName&&` · ${w.parentName}`]})]})]}),d.jsxs("div",{className:"text-right text-[10px] text-white/40 font-light tracking-wider",children:[d.jsxs("div",{children:[w.physical.meanRadiusKm.toLocaleString()," km"]}),d.jsxs("div",{children:[w.orbit.semiMajorAxisAU.toFixed(2)," AU"]})]})]},w.name)})})]})]})]}):d.jsx("div",{className:"absolute bottom-6 right-6 z-50 pointer-events-auto",children:d.jsxs("button",{onClick:()=>ue(!0),className:"flex items-center gap-2 px-3.5 py-1.5 text-xs text-white/50 hover:text-white bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/10 rounded-full transition uppercase tracking-[0.2em] font-light",children:[d.jsx(oo,{size:13}),d.jsx("span",{children:"Show Interface (H)"})]})})},uo=()=>{const c=T.useRef(null),e=T.useRef(null),[t,i]=T.useState(null);T.useEffect(()=>{if(!c.current)return;const f=new Ot(c.current,S=>{i(S)});return e.current=f,window.__solaris_scene=f,()=>{delete window.__solaris_scene,f.dispose(),e.current=null}},[]);const a=T.useCallback(f=>{var S;(S=e.current)==null||S.selectBody(f)},[]),s=T.useCallback(()=>{var f;(f=e.current)==null||f.resetView()},[]),o=T.useCallback(()=>{if(!e.current)return;const f=e.current.clock.isPaused;e.current.clock.isPaused=!f},[]),r=T.useCallback(f=>{e.current&&(e.current.clock.timeMultiplier=f,e.current.clock.isPaused=!1)},[]),n=T.useCallback(f=>{var S;(S=e.current)==null||S.setScaleMode(f)},[]),l=T.useCallback(f=>{var S;(S=e.current)==null||S.clock.setUtcMs(f)},[]),h=T.useCallback(()=>{var f;(f=e.current)==null||f.clock.resetToJ2000()},[]),m=T.useCallback(()=>{var f;(f=e.current)==null||f.clock.resetToNow()},[]),p=T.useCallback(()=>{var f;(f=e.current)==null||f.toggleConstellations()},[]),g=T.useCallback(()=>{var f;(f=e.current)==null||f.toggleAsteroidBelt()},[]),v=T.useCallback(()=>{var f;(f=e.current)==null||f.toggleOrbits()},[]),y=T.useCallback(f=>{var S;(S=e.current)==null||S.setLensProfile(f)},[]),M=T.useCallback(f=>{var S;(S=e.current)==null||S.flyToLandmark(f)},[]),x=T.useCallback(f=>{var S;(S=e.current)==null||S.setExplorerDaylight(f)},[]),b=T.useCallback(()=>{var f;(f=e.current)==null||f.cycleLensProfile()},[]),A=T.useCallback(f=>{var S;(S=e.current)==null||S.jumpToScale(f)},[]);return d.jsxs("div",{className:"relative w-screen h-screen overflow-hidden bg-[#030206]",style:{width:"100vw",height:"100vh",position:"relative",overflow:"hidden"},children:[d.jsx("div",{ref:c,className:"absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing",style:{position:"absolute",top:0,left:0,width:"100%",height:"100%"}}),d.jsx(ho,{telemetry:t,onSelectPlanet:a,onResetView:s,onTogglePlay:o,onSetTimeMultiplier:r,onSetScaleMode:n,onSeekDate:l,onResetToJ2000:h,onResetToNow:m,onToggleConstellations:p,onToggleAsteroidBelt:g,onToggleOrbits:v,onJumpToScale:A,onSetLens:y,onCycleLens:b,onFlyToLandmark:M,onExplorerDaylight:x})]})};Nt.createRoot(document.getElementById("root")).render(d.jsx($a.StrictMode,{children:d.jsx(uo,{})}));
