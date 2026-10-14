var Ma=Object.defineProperty;var Sa=(p,e,i)=>e in p?Ma(p,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):p[e]=i;var u=(p,e,i)=>Sa(p,typeof e!="symbol"?e+"":e,i);import{r as C,a as Pa,R as Aa}from"./react-nf7bT_Uh.js";import{C as j,R as H,a as O,T as Ta,b as Da,S as Le,N as qe,L as nt,c as lt,d as I,B as Fe,A as W,V as P,D as Ne,G as ie,P as $e,M as B,e as E,f as oe,g as Ca,h as wt,i as mt,j as q,k,l as de,m as fe,n as Ra,o as Ea,p as zt,q as Be,r as Ee,s as Ot,t as L,u as Vt,I as Na,F as pt,v as X,w as Te,x as Ia,Q as kt,O as Oa,y as ka,z as La,E as Ua,H as ja,U as Qe,W as je,J as _e,K as _a,X as Fa,Y as Ba,Z as Ha,_ as Ga,$ as Ka,a0 as za,a1 as Va,a2 as Wt,a3 as Wa,a4 as Ya,a5 as Ja,a6 as qa,a7 as Xa,a8 as $a,a9 as Qa}from"./three-DytK_gVM.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))a(t);new MutationObserver(t=>{for(const s of t)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&a(o)}).observe(document,{childList:!0,subtree:!0});function i(t){const s={};return t.integrity&&(s.integrity=t.integrity),t.referrerPolicy&&(s.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?s.credentials="include":t.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function a(t){if(t.ep)return;t.ep=!0;const s=i(t);fetch(t.href,s)}})();var Yt={exports:{}},it={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Za=C,ei=Symbol.for("react.element"),ti=Symbol.for("react.fragment"),ai=Object.prototype.hasOwnProperty,ii=Za.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,si={key:!0,ref:!0,__self:!0,__source:!0};function Jt(p,e,i){var a,t={},s=null,o=null;i!==void 0&&(s=""+i),e.key!==void 0&&(s=""+e.key),e.ref!==void 0&&(o=e.ref);for(a in e)ai.call(e,a)&&!si.hasOwnProperty(a)&&(t[a]=e[a]);if(p&&p.defaultProps)for(a in e=p.defaultProps,e)t[a]===void 0&&(t[a]=e[a]);return{$$typeof:ei,type:p,key:s,ref:o,props:t,_owner:ii.current}}it.Fragment=ti;it.jsx=Jt;it.jsxs=Jt;Yt.exports=it;var h=Yt.exports,gt={},Lt=Pa;gt.createRoot=Lt.createRoot,gt.hydrateRoot=Lt.hydrateRoot;const oi=[{id:"10",name:"Sun",category:"star",orderFromSun:0,physical:{meanRadiusKm:695700,equatorialRadiusKm:695700,polarRadiusKm:695700,flattening:0,massKg:19885e26,gmKm3S2:1327124400419394e-4,rotationPeriodHours:609.12,axialTiltDeg:7.25,meanTemperatureK:5778,spectralType:"G2V",colorHex:"#ffdd77"},orbit:{semiMajorAxisKm:0,semiMajorAxisAU:0,eccentricity:0,inclinationDeg:0,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:0,orbitalPeriodDays:0},description:"Yellow dwarf star (G2V) at the gravitational center of the Solar System, containing 99.86% of the system’s total mass."},{id:"199",name:"Mercury",category:"planet",orderFromSun:1,physical:{meanRadiusKm:2439.7,equatorialRadiusKm:2439.7,polarRadiusKm:2439.7,flattening:0,massKg:33011e19,gmKm3S2:22031.78,rotationPeriodHours:1407.6,axialTiltDeg:.034,meanTemperatureK:440,colorHex:"#9c968f"},orbit:{semiMajorAxisKm:579092265e-1,semiMajorAxisAU:.38709927,eccentricity:.20563593,inclinationDeg:7.00497902,longitudeAscendingNodeDeg:48.33076593,argumentPeriapsisDeg:29.12703035,meanAnomalyAtEpochDeg:174.79252722,orbitalPeriodDays:87.969,epochJd:2451545,ratesPerCentury:{semiMajorAxisAU:37e-8,eccentricity:1906e-8,inclinationDeg:-.00594749,longitudeAscendingNodeDeg:-.12534081,argumentPeriapsisDeg:.2858177,meanAnomalyDeg:149472.51363486},source:"JPL SSD approximate planetary positions (Standish), Table 1"},description:"Smallest planet, heavily cratered with silicate crust and large iron core; lacks a substantial atmosphere."},{id:"299",name:"Venus",category:"planet",orderFromSun:2,physical:{meanRadiusKm:6051.8,equatorialRadiusKm:6051.8,polarRadiusKm:6051.8,flattening:0,massKg:48675e20,gmKm3S2:324858.59,rotationPeriodHours:-5832.5,axialTiltDeg:177.36,meanTemperatureK:737,colorHex:"#e3bb7b"},orbit:{semiMajorAxisKm:1082094745e-1,semiMajorAxisAU:.72333566,eccentricity:.00677672,inclinationDeg:3.39467605,longitudeAscendingNodeDeg:76.67984255,argumentPeriapsisDeg:54.92262463,meanAnomalyAtEpochDeg:50.37663232,orbitalPeriodDays:224.701,epochJd:2451545,ratesPerCentury:{semiMajorAxisAU:39e-7,eccentricity:-4107e-8,inclinationDeg:-7889e-7,longitudeAscendingNodeDeg:-.27769418,argumentPeriapsisDeg:.28037747,meanAnomalyDeg:58517.812704},source:"JPL SSD approximate planetary positions (Standish), Table 1"},description:"Terrestrial planet shrouded in dense carbon dioxide atmosphere and sulfuric acid clouds with runaway greenhouse effect."},{id:"399",name:"Earth",category:"planet",orderFromSun:3,physical:{meanRadiusKm:6371,equatorialRadiusKm:6378.137,polarRadiusKm:6356.752,flattening:.003353,massKg:59722e20,gmKm3S2:398600.4418,rotationPeriodHours:23.9344,axialTiltDeg:23.439,meanTemperatureK:288,colorHex:"#4b75a1"},orbit:{semiMajorAxisKm:1495982612e-1,semiMajorAxisAU:1.00000261,eccentricity:.01671123,inclinationDeg:-1531e-8,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:102.93768193,meanAnomalyAtEpochDeg:357.52688973,orbitalPeriodDays:365.256,epochJd:2451545,ratesPerCentury:{semiMajorAxisAU:562e-8,eccentricity:-4392e-8,inclinationDeg:-.01294668,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:.32327364,meanAnomalyDeg:35999.04917617},source:"JPL SSD approximate planetary positions (Standish), Table 1"},description:"Dense rocky world featuring liquid surface water, active plate tectonics, oxygen-rich atmosphere, and planetary biosphere."},{id:"499",name:"Mars",category:"planet",orderFromSun:4,physical:{meanRadiusKm:3389.5,equatorialRadiusKm:3396.2,polarRadiusKm:3376.2,flattening:.00589,massKg:64171e19,gmKm3S2:42828.375,rotationPeriodHours:24.6229,axialTiltDeg:25.19,meanTemperatureK:210,colorHex:"#c16138"},orbit:{semiMajorAxisKm:2279438224e-1,semiMajorAxisAU:1.52371034,eccentricity:.0933941,inclinationDeg:1.84969142,longitudeAscendingNodeDeg:49.55953891,argumentPeriapsisDeg:-73.5031685,meanAnomalyAtEpochDeg:19.39019754,orbitalPeriodDays:686.98,epochJd:2451545,ratesPerCentury:{semiMajorAxisAU:1847e-8,eccentricity:7882e-8,inclinationDeg:-.00813131,longitudeAscendingNodeDeg:-.29257343,argumentPeriapsisDeg:.73698431,meanAnomalyDeg:19139.85827411},source:"JPL SSD approximate planetary positions (Standish), Table 1"},description:"Cold desert world with iron-oxide regolith, giant shield volcanoes (Olympus Mons), rift canyon Valles Marineris, and polar ice caps."},{id:"599",name:"Jupiter",category:"planet",orderFromSun:5,physical:{meanRadiusKm:69911,equatorialRadiusKm:71492,polarRadiusKm:66854,flattening:.06487,massKg:18982e23,gmKm3S2:12668653492e-2,rotationPeriodHours:9.925,axialTiltDeg:3.13,meanTemperatureK:165,colorHex:"#c8a679"},orbit:{semiMajorAxisKm:7783408167e-1,semiMajorAxisAU:5.202887,eccentricity:.04838624,inclinationDeg:1.30439695,longitudeAscendingNodeDeg:100.47390909,argumentPeriapsisDeg:-85.74542926,meanAnomalyAtEpochDeg:19.66796068,orbitalPeriodDays:4332.589,epochJd:2451545,ratesPerCentury:{semiMajorAxisAU:-11607e-8,eccentricity:-13253e-8,inclinationDeg:-.00183714,longitudeAscendingNodeDeg:.20469106,argumentPeriapsisDeg:.00783562,meanAnomalyDeg:3034.53360107},source:"JPL SSD approximate planetary positions (Standish), Table 1"},description:"Largest planet; hydrogen-helium gas giant displaying zonal atmospheric jet streams, turbulent vortices, and the Great Red Spot."},{id:"699",name:"Saturn",category:"planet",orderFromSun:6,physical:{meanRadiusKm:58232,equatorialRadiusKm:60268,polarRadiusKm:54364,flattening:.09796,massKg:56834e22,gmKm3S2:379311879e-1,rotationPeriodHours:10.656,axialTiltDeg:26.73,meanTemperatureK:134,colorHex:"#dfcf9f"},orbit:{semiMajorAxisKm:14266664142e-1,semiMajorAxisAU:9.53667594,eccentricity:.05386179,inclinationDeg:2.48599187,longitudeAscendingNodeDeg:113.66242448,argumentPeriapsisDeg:-21.06354617,meanAnomalyAtEpochDeg:317.35536592,orbitalPeriodDays:10759.22,epochJd:2451545,ratesPerCentury:{semiMajorAxisAU:-.0012506,eccentricity:-50991e-8,inclinationDeg:.00193609,longitudeAscendingNodeDeg:-.28867794,argumentPeriapsisDeg:-.13029422,meanAnomalyDeg:1222.91259417},source:"JPL SSD approximate planetary positions (Standish), Table 1"},description:"Gas giant celebrated for its extensive, brilliant ring system consisting of water ice particles, dust, and rock."},{id:"799",name:"Uranus",category:"planet",orderFromSun:7,physical:{meanRadiusKm:25362,equatorialRadiusKm:25559,polarRadiusKm:24973,flattening:.02293,massKg:8681e22,gmKm3S2:57939393e-1,rotationPeriodHours:-17.24,axialTiltDeg:97.77,meanTemperatureK:76,colorHex:"#8fe0ea"},orbit:{semiMajorAxisKm:28706581707e-1,semiMajorAxisAU:19.18916464,eccentricity:.04725744,inclinationDeg:.77263783,longitudeAscendingNodeDeg:74.01692503,argumentPeriapsisDeg:96.93735127,meanAnomalyAtEpochDeg:142.28382821,orbitalPeriodDays:30685.4,epochJd:2451545,ratesPerCentury:{semiMajorAxisAU:-.00196176,eccentricity:-4397e-8,inclinationDeg:-.00242939,longitudeAscendingNodeDeg:.04240589,argumentPeriapsisDeg:.36564692,meanAnomalyDeg:428.07397504},source:"JPL SSD approximate planetary positions (Standish), Table 1"},description:"Ice giant composed of water, ammonia, and methane ices; extreme 98° axial tilt results in extreme seasonal variations."},{id:"899",name:"Neptune",category:"planet",orderFromSun:8,physical:{meanRadiusKm:24622,equatorialRadiusKm:24764,polarRadiusKm:24341,flattening:.01708,massKg:102413e21,gmKm3S2:68350995e-1,rotationPeriodHours:16.11,axialTiltDeg:28.32,meanTemperatureK:72,colorHex:"#4b70dd"},orbit:{semiMajorAxisKm:4498396417,semiMajorAxisAU:30.06992276,eccentricity:.00859048,inclinationDeg:1.77004347,longitudeAscendingNodeDeg:131.78422574,argumentPeriapsisDeg:-86.81946347,meanAnomalyAtEpochDeg:259.91520804,orbitalPeriodDays:60189,epochJd:2451545,ratesPerCentury:{semiMajorAxisAU:26291e-8,eccentricity:5105e-8,inclinationDeg:35372e-8,longitudeAscendingNodeDeg:-.00508664,argumentPeriapsisDeg:-.317328,meanAnomalyDeg:218.78186789},source:"JPL SSD approximate planetary positions (Standish), Table 1"},description:"Outermost major planet; deep azure ice giant driven by violent supersonic winds, methane haze, and high-altitude cirrus clouds."}],ri=[{id:"301",name:"Moon",category:"moon",orderFromSun:3,parentId:"399",parentName:"Earth",physical:{meanRadiusKm:1737.4,equatorialRadiusKm:1738.1,polarRadiusKm:1736,flattening:.0012,massKg:7342e19,gmKm3S2:4902.8,rotationPeriodHours:655.728,axialTiltDeg:6.68,meanTemperatureK:250,colorHex:"#c4c3be"},orbit:{semiMajorAxisKm:384400,semiMajorAxisAU:.0025695553,eccentricity:.0554,inclinationDeg:5.16,longitudeAscendingNodeDeg:125.08,argumentPeriapsisDeg:318.15,meanAnomalyAtEpochDeg:135.27,orbitalPeriodDays:27.321661,epochJd:2451545,meanMotionDegPerDay:13.064995931,periapsisArgRateDegPerDay:.164353224,nodeRateDegPerDay:-.05299066,source:"JPL SSD planetary satellite mean elements"},description:"Earth’s only natural satellite; tidally locked with extensive lunar maria basalt plains and impact-cratered anorthositic highlands."},{id:"401",name:"Phobos",category:"moon",orderFromSun:4,parentId:"499",parentName:"Mars",physical:{meanRadiusKm:11.26,equatorialRadiusKm:13,polarRadiusKm:9.1,massKg:10659e12,gmKm3S2:71e-5,rotationPeriodHours:7.654,axialTiltDeg:0,colorHex:"#8b847d"},orbit:{semiMajorAxisKm:9377.9,semiMajorAxisAU:626874e-10,eccentricity:.01468188,inclinationDeg:25.639416,longitudeAscendingNodeDeg:82.61167,argumentPeriapsisDeg:282.404283,meanAnomalyAtEpochDeg:176.914893,orbitalPeriodDays:.31891023,epochJd:24613275e-1,meanMotionDegPerDay:1128.84431459,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Innermost and largest moon of Mars; heavily cratered irregular body featuring the massive Stickney impact crater, orbiting inside synchronous orbit."},{id:"402",name:"Deimos",category:"moon",orderFromSun:4,parentId:"499",parentName:"Mars",physical:{meanRadiusKm:6.2,massKg:14762e11,rotationPeriodHours:30.31,axialTiltDeg:0,colorHex:"#999186"},orbit:{semiMajorAxisKm:23458.846,semiMajorAxisAU:.0001568127,eccentricity:25811e-8,inclinationDeg:24.120481,longitudeAscendingNodeDeg:81.546986,argumentPeriapsisDeg:52.283083,meanAnomalyAtEpochDeg:122.884373,orbitalPeriodDays:1.2624407,epochJd:24613275e-1,meanMotionDegPerDay:285.161908991,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Outermost moon of Mars; smooth-looking irregular body coated in a thick regolith blanket that softens surface topography."},{id:"501",name:"Io",category:"moon",orderFromSun:5,parentId:"599",parentName:"Jupiter",physical:{meanRadiusKm:1821.5,massKg:89319e18,gmKm3S2:5959.91,rotationPeriodHours:42.456,axialTiltDeg:0,meanTemperatureK:130,colorHex:"#e5c158"},orbit:{semiMajorAxisKm:422020.056,semiMajorAxisAU:.0028210298,eccentricity:.00359279,inclinationDeg:2.228063,longitudeAscendingNodeDeg:338.403388,argumentPeriapsisDeg:31.382494,meanAnomalyAtEpochDeg:199.124628,orbitalPeriodDays:1.769137786,epochJd:24613275e-1,meanMotionDegPerDay:203.488955382,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Most volcanically active body in the Solar System, driven by tidal friction from orbital resonance with Europa and Ganymede; coated in sulfur and sulfur dioxide."},{id:"502",name:"Europa",category:"moon",orderFromSun:5,parentId:"599",parentName:"Jupiter",physical:{meanRadiusKm:1560.8,massKg:47998e18,gmKm3S2:3202.73,rotationPeriodHours:85.224,axialTiltDeg:.1,meanTemperatureK:102,colorHex:"#c7bfae"},orbit:{semiMajorAxisKm:671258.947,semiMajorAxisAU:.0044870889,eccentricity:.00931579,inclinationDeg:2.07625,longitudeAscendingNodeDeg:326.203313,argumentPeriapsisDeg:224.926561,meanAnomalyAtEpochDeg:279.791695,orbitalPeriodDays:3.551181041,epochJd:24613275e-1,meanMotionDegPerDay:101.37472459,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Smooth, brilliant water-ice crust fractured by tectonic lineae and cycloids; harbors a deep global subsurface liquid water ocean with astrobiological potential."},{id:"503",name:"Ganymede",category:"moon",orderFromSun:5,parentId:"599",parentName:"Jupiter",physical:{meanRadiusKm:2631.2,massKg:14819e19,gmKm3S2:9887.83,rotationPeriodHours:171.72,axialTiltDeg:.2,meanTemperatureK:110,colorHex:"#8e8379"},orbit:{semiMajorAxisKm:1070453601e-3,semiMajorAxisAU:.0071555404,eccentricity:.00274315,inclinationDeg:2.34352,longitudeAscendingNodeDeg:339.06555,argumentPeriapsisDeg:3.818835,meanAnomalyAtEpochDeg:349.11927,orbitalPeriodDays:7.15455296,epochJd:24613275e-1,meanMotionDegPerDay:50.317609222,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Largest natural satellite in the Solar System (larger than Mercury); only known moon with its own intrinsic magnetic field generated by a liquid iron core."},{id:"504",name:"Callisto",category:"moon",orderFromSun:5,parentId:"599",parentName:"Jupiter",physical:{meanRadiusKm:2410.3,massKg:10759e19,gmKm3S2:7179.29,rotationPeriodHours:400.536,axialTiltDeg:0,meanTemperatureK:134,colorHex:"#696057"},orbit:{semiMajorAxisKm:1882917904e-3,semiMajorAxisAU:.0125865288,eccentricity:.00707683,inclinationDeg:1.952455,longitudeAscendingNodeDeg:336.746982,argumentPeriapsisDeg:34.494869,meanAnomalyAtEpochDeg:126.955427,orbitalPeriodDays:16.6890184,epochJd:24613275e-1,meanMotionDegPerDay:21.57107095,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Ancient, intensely cratered ice-rock moon; lacks tidal resonance heating, preserving the most heavily cratered surface in the Solar System (including Valhalla impact basin)."},{id:"601",name:"Mimas",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:198.2,massKg:37493e15,rotationPeriodHours:22.6,colorHex:"#b2b2b2"},orbit:{semiMajorAxisKm:186034.255,semiMajorAxisAU:.0012435622,eccentricity:.0218639,inclinationDeg:28.47676,longitudeAscendingNodeDeg:172.727658,argumentPeriapsisDeg:169.377604,meanAnomalyAtEpochDeg:326.994857,orbitalPeriodDays:.942421959,epochJd:24613275e-1,meanMotionDegPerDay:381.994494676,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Dominated by the 130 km Herschel impact crater, giving it a distinctive Death Star appearance; clearing agent for the Cassini Division."},{id:"602",name:"Enceladus",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:252.1,massKg:10802e16,gmKm3S2:7.21,rotationPeriodHours:32.88,colorHex:"#ffffff"},orbit:{semiMajorAxisKm:238411.673,semiMajorAxisAU:.0015936836,eccentricity:.00513554,inclinationDeg:28.043619,longitudeAscendingNodeDeg:169.530888,argumentPeriapsisDeg:214.451065,meanAnomalyAtEpochDeg:62.261399,orbitalPeriodDays:1.370217855,epochJd:24613275e-1,meanMotionDegPerDay:262.731943454,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:'High-albedo icy world with active cryovolcanic geysers erupting water vapor, organic molecules, and ice crystals from south polar "tiger stripe" fractures.'},{id:"603",name:"Tethys",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:531,massKg:61745e16,rotationPeriodHours:45.31,colorHex:"#d8d8d8"},orbit:{semiMajorAxisKm:294976.454,semiMajorAxisAU:.0019717958,eccentricity:99726e-8,inclinationDeg:28.175586,longitudeAscendingNodeDeg:171.825733,argumentPeriapsisDeg:127.950883,meanAnomalyAtEpochDeg:2.809594,orbitalPeriodDays:1.88780216,epochJd:24613275e-1,meanMotionDegPerDay:190.697948984,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Low-density water-ice satellite featuring the vast Odysseus impact crater and the enormous Ithaca Chasma canyon system spanning 2,000 km."},{id:"604",name:"Dione",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:561.4,massKg:10955e17,rotationPeriodHours:65.69,colorHex:"#cac8c5"},orbit:{semiMajorAxisKm:377644.232,semiMajorAxisAU:.0025243958,eccentricity:.00265791,inclinationDeg:28.025672,longitudeAscendingNodeDeg:169.549925,argumentPeriapsisDeg:268.312567,meanAnomalyAtEpochDeg:329.102147,orbitalPeriodDays:2.736914742,epochJd:24613275e-1,meanMotionDegPerDay:131.534970555,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Icy moon displaying bright wispy ice cliffs (chasmata) formed by extensional tectonic fractures across its trailing hemisphere."},{id:"605",name:"Rhea",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:763.5,massKg:23065e17,rotationPeriodHours:108.43,colorHex:"#bbb8b4"},orbit:{semiMajorAxisKm:527244.268,semiMajorAxisAU:.0035244102,eccentricity:.00136693,inclinationDeg:28.274533,longitudeAscendingNodeDeg:169.967171,argumentPeriapsisDeg:166.661352,meanAnomalyAtEpochDeg:13.027101,orbitalPeriodDays:4.517500436,epochJd:24613275e-1,meanMotionDegPerDay:79.690086387,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Second-largest moon of Saturn; heavily cratered ice body with homogeneous interior composition and tenuous oxygen-carbon dioxide exosphere."},{id:"606",name:"Titan",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:2574.8,equatorialRadiusKm:2574.8,polarRadiusKm:2574.8,flattening:0,massKg:13452e19,gmKm3S2:8978.14,rotationPeriodHours:382.68,axialTiltDeg:0,meanTemperatureK:94,colorHex:"#e5a84b",atmosphere:{surfacePressureBar:1.45,composition:[{gas:"N2",percentage:95},{gas:"CH4",percentage:4.9}]}},orbit:{semiMajorAxisKm:1221971892e-3,semiMajorAxisAU:.0081683776,eccentricity:.02881004,inclinationDeg:27.705537,longitudeAscendingNodeDeg:169.080756,argumentPeriapsisDeg:178.340423,meanAnomalyAtEpochDeg:328.923552,orbitalPeriodDays:15.94542068,epochJd:24613275e-1,meanMotionDegPerDay:22.577014882,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Second-largest moon in the Solar System, enveloped by a dense nitrogen-methane atmosphere supporting active liquid methane/ethane lakes, rivers, and rain hydrologic cycles."},{id:"607",name:"Hyperion",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:135,massKg:56199e14,rotationPeriodHours:300,colorHex:"#9c8c7c"},orbit:{semiMajorAxisKm:1486933985e-3,semiMajorAxisAU:.0099395398,eccentricity:.09542499,inclinationDeg:27.056176,longitudeAscendingNodeDeg:169.549243,argumentPeriapsisDeg:67.294493,meanAnomalyAtEpochDeg:98.155885,orbitalPeriodDays:21.2766088,epochJd:24613275e-1,meanMotionDegPerDay:16.919989618,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Sponge-like irregularly shaped moon with low density (high porosity) undergoing non-repeating chaotic rotation influenced by Titan."},{id:"608",name:"Iapetus",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:734.3,massKg:18056e17,rotationPeriodHours:1903.92,colorHex:"#847970"},orbit:{semiMajorAxisKm:3565269983e-3,semiMajorAxisAU:.0238323578,eccentricity:.02970025,inclinationDeg:16.979231,longitudeAscendingNodeDeg:138.869009,argumentPeriapsisDeg:230.853136,meanAnomalyAtEpochDeg:320.152812,orbitalPeriodDays:79.3301825,epochJd:24613275e-1,meanMotionDegPerDay:4.537995359,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Two-tone world with extreme albedo dichotomy (pitch-black Cassini Regio leading hemisphere and brilliant ice trailing hemisphere), plus a towering 20 km equatorial ridge."},{id:"705",name:"Miranda",category:"moon",orderFromSun:7,parentId:"799",parentName:"Uranus",physical:{meanRadiusKm:235.8,massKg:659e17,rotationPeriodHours:33.91,colorHex:"#a0a0a0"},orbit:{semiMajorAxisKm:129871.122,semiMajorAxisAU:.0008681348,eccentricity:.0011248,inclinationDeg:97.989082,longitudeAscendingNodeDeg:163.186619,argumentPeriapsisDeg:67.391864,meanAnomalyAtEpochDeg:207.222114,orbitalPeriodDays:1.413479,epochJd:24613275e-1,meanMotionDegPerDay:254.690731168,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Exhibits extreme, chaotic terrain with gigantic tectonic rift grabens and chevron-shaped coronae, including Verona Rupes (tallest cliff in the Solar System at 20 km)."},{id:"701",name:"Ariel",category:"moon",orderFromSun:7,parentId:"799",parentName:"Uranus",physical:{meanRadiusKm:578.9,massKg:1251e18,rotationPeriodHours:60.48,colorHex:"#b4b4b4"},orbit:{semiMajorAxisKm:190944.721,semiMajorAxisAU:.0012763866,eccentricity:5326e-7,inclinationDeg:97.718049,longitudeAscendingNodeDeg:167.665855,argumentPeriapsisDeg:276.587566,meanAnomalyAtEpochDeg:51.205773,orbitalPeriodDays:2.520379,epochJd:24613275e-1,meanMotionDegPerDay:142.835660827,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Brightest moon of Uranus; dissected by extensive interconnected fault scarps, deep graben valleys, and cryovolcanic flows."},{id:"702",name:"Umbriel",category:"moon",orderFromSun:7,parentId:"799",parentName:"Uranus",physical:{meanRadiusKm:584.7,massKg:1275e18,rotationPeriodHours:99.46,colorHex:"#737373"},orbit:{semiMajorAxisKm:265988.581,semiMajorAxisAU:.0017780238,eccentricity:.00337264,inclinationDeg:97.714436,longitudeAscendingNodeDeg:167.725316,argumentPeriapsisDeg:66.275993,meanAnomalyAtEpochDeg:14.683581,orbitalPeriodDays:4.144177,epochJd:24613275e-1,meanMotionDegPerDay:86.868876498,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Darkest and most heavily cratered of Uranus’s large satellites, marked by the mysterious bright fluorescent ring floor of crater Wunda."},{id:"703",name:"Titania",category:"moon",orderFromSun:7,parentId:"799",parentName:"Uranus",physical:{meanRadiusKm:788.9,massKg:342e19,rotationPeriodHours:208.94,colorHex:"#9f9994"},orbit:{semiMajorAxisKm:436251.111,semiMajorAxisAU:.0029161586,eccentricity:.00197821,inclinationDeg:97.762135,longitudeAscendingNodeDeg:167.643651,argumentPeriapsisDeg:280.488041,meanAnomalyAtEpochDeg:236.26202,orbitalPeriodDays:8.705872,epochJd:24613275e-1,meanMotionDegPerDay:41.351400526,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Largest moon of Uranus; fractured by vast canyon systems (Messina Chasma) resulting from internal freezing and expansion of a primordial subsurface ocean."},{id:"704",name:"Oberon",category:"moon",orderFromSun:7,parentId:"799",parentName:"Uranus",physical:{meanRadiusKm:761.4,massKg:3014e18,rotationPeriodHours:323.11,colorHex:"#938c86"},orbit:{semiMajorAxisKm:583573.694,semiMajorAxisAU:.0039009492,eccentricity:.00243809,inclinationDeg:97.905711,longitudeAscendingNodeDeg:167.708289,argumentPeriapsisDeg:171.765242,meanAnomalyAtEpochDeg:34.68861,orbitalPeriodDays:13.463239,epochJd:24613275e-1,meanMotionDegPerDay:26.739479259,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Outermost major moon of Uranus; ancient heavily cratered ice-rock surface featuring prominent impact ray craters filled with dark carbonaceous deposits."},{id:"801",name:"Triton",category:"moon",orderFromSun:8,parentId:"899",parentName:"Neptune",physical:{meanRadiusKm:1352.6,massKg:2139e19,gmKm3S2:1427.6,rotationPeriodHours:-141.048,axialTiltDeg:0,meanTemperatureK:38,colorHex:"#e2cfc4"},orbit:{semiMajorAxisKm:354765.344,semiMajorAxisAU:.0023714598,eccentricity:10818e-8,inclinationDeg:129.126619,longitudeAscendingNodeDeg:222.868711,argumentPeriapsisDeg:109.713483,meanAnomalyAtEpochDeg:179.672821,orbitalPeriodDays:5.876854,epochJd:24613275e-1,meanMotionDegPerDay:61.257264516,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Captured Kuiper Belt dwarf planet orbiting Neptune in a retrograde direction; coldest measured surface in the Solar System (38 K) with nitrogen cryogeysers and cantaloupe terrain."},{id:"999",name:"Pluto",category:"dwarf_planet",orderFromSun:9,physical:{meanRadiusKm:1188.3,equatorialRadiusKm:1188.3,polarRadiusKm:1188.3,flattening:0,massKg:1303e19,gmKm3S2:869.6,rotationPeriodHours:-153.2928,axialTiltDeg:122.53,meanTemperatureK:44,colorHex:"#c79f82"},orbit:{semiMajorAxisKm:5922374660,semiMajorAxisAU:39.5886293852,eccentricity:.2518378779,inclinationDeg:17.14771141,longitudeAscendingNodeDeg:110.29238405,argumentPeriapsisDeg:113.70900152,meanAnomalyAtEpochDeg:38.68366347,orbitalPeriodDays:90981.716,epochJd:24575885e-1,meanMotionDegPerDay:.003956838956,source:"JPL SBDB osculating elements"},description:'Largest known Kuiper Belt dwarf planet; features the high-albedo nitrogen-ice glacier Sputnik Planitia (the "Heart"), water-ice mountains, and blue atmospheric haze.'},{id:"901",name:"Charon",category:"moon",orderFromSun:9,parentId:"999",parentName:"Pluto",physical:{meanRadiusKm:606,massKg:1586e18,rotationPeriodHours:153.29,colorHex:"#99948e"},orbit:{semiMajorAxisKm:19595.763,semiMajorAxisAU:.0001309896,eccentricity:16098e-8,inclinationDeg:112.887772,longitudeAscendingNodeDeg:227.393077,argumentPeriapsisDeg:172.262887,meanAnomalyAtEpochDeg:355.44348,orbitalPeriodDays:6.3872304,epochJd:24613275e-1,meanMotionDegPerDay:56.362457193,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Mutually tidally locked binary companion to Pluto; features a dark reddish tholin polar hood (Mordor Macula) and massive equatorial tectonic chasms."},{id:"1",name:"Ceres",category:"dwarf_planet",orderFromSun:4.5,physical:{meanRadiusKm:469.7,equatorialRadiusKm:487.3,polarRadiusKm:446,flattening:.0847,massKg:93835e16,gmKm3S2:62.63,rotationPeriodHours:9.074,axialTiltDeg:4,meanTemperatureK:168,colorHex:"#88847e"},orbit:{semiMajorAxisKm:4137207795e-1,semiMajorAxisAU:2.765552595,eccentricity:.0796922951,inclinationDeg:10.5880278,longitudeAscendingNodeDeg:80.24862682,argumentPeriapsisDeg:73.29421453,meanAnomalyAtEpochDeg:274.41934638,orbitalPeriodDays:1679.853,epochJd:24612005e-1,meanMotionDegPerDay:.214304450648,source:"JPL SBDB osculating elements"},description:"Largest body in the asteroid belt, comprising ~33% of its total mass; differentiated protoplanet with an ice-rich mantle and bright sodium-carbonate salt spots (Cerealia Facula in Occator Crater)."},{id:"4",name:"Vesta",category:"asteroid",orderFromSun:4.3,physical:{meanRadiusKm:261.4,equatorialRadiusKm:286.3,polarRadiusKm:229,flattening:.2,massKg:259e18,rotationPeriodHours:5.342,axialTiltDeg:29,colorHex:"#a39b91"},orbit:{semiMajorAxisKm:3532553203e-1,semiMajorAxisAU:2.3613659651,eccentricity:.0902037438,inclinationDeg:7.14392555,longitudeAscendingNodeDeg:103.70129327,argumentPeriapsisDeg:151.46864782,meanAnomalyAtEpochDeg:81.19015608,orbitalPeriodDays:1325.389,epochJd:24612005e-1,meanMotionDegPerDay:.27161836136,source:"JPL SBDB osculating elements"},description:"Brightest asteroid visible from Earth; preserved basaltic differentiated protoplanet with metallic core, silicate mantle, and enormous south-polar impact crater Rheasilvia."},{id:"2",name:"Pallas",category:"asteroid",orderFromSun:4.6,physical:{meanRadiusKm:256.5,massKg:205e18,rotationPeriodHours:7.813,axialTiltDeg:84,colorHex:"#827f7a"},orbit:{semiMajorAxisKm:4143201308e-1,semiMajorAxisAU:2.7695590107,eccentricity:.2307000996,inclinationDeg:34.93279322,longitudeAscendingNodeDeg:172.88661934,argumentPeriapsisDeg:310.96991617,meanAnomalyAtEpochDeg:254.24965217,orbitalPeriodDays:1683.505,epochJd:24612005e-1,meanMotionDegPerDay:.213839602925,source:"JPL SBDB osculating elements"},description:"Third-largest asteroid in the belt; notable for its unusually high 34.8° orbital inclination and dynamic golf-ball-like surface topography."},{id:"10",name:"Hygiea",category:"asteroid",orderFromSun:4.8,physical:{meanRadiusKm:203.6,massKg:832e17,rotationPeriodHours:13.825,colorHex:"#605c57"},orbit:{semiMajorAxisKm:4713790061e-1,semiMajorAxisAU:3.150974034,eccentricity:.1067092741,inclinationDeg:3.82952995,longitudeAscendingNodeDeg:283.11989275,argumentPeriapsisDeg:312.42423873,meanAnomalyAtEpochDeg:252.03442424,orbitalPeriodDays:2042.987,epochJd:24612005e-1,meanMotionDegPerDay:.176212550579,source:"JPL SBDB osculating elements"},description:"Fourth-largest asteroid and major carbonaceous C-type asteroid; nearly spherical body likely formed from a catastrophic impact parent-body disruption."},{id:"16",name:"Psyche",category:"asteroid",orderFromSun:4.7,physical:{meanRadiusKm:111,massKg:229e17,rotationPeriodHours:4.196,axialTiltDeg:95,colorHex:"#b8aba0"},orbit:{semiMajorAxisKm:437681552,semiMajorAxisAU:2.9257204665,eccentricity:.1349324738,inclinationDeg:3.09874912,longitudeAscendingNodeDeg:149.97538593,argumentPeriapsisDeg:230.03267827,meanAnomalyAtEpochDeg:79.76939505,orbitalPeriodDays:1827.88,epochJd:24612005e-1,meanMotionDegPerDay:.196949475811,source:"JPL SBDB osculating elements"},description:"Enormous metallic M-type asteroid thought to be the exposed nickel-iron core of an early protoplanet stripped by hit-and-run collisions; target of NASA’s Psyche mission."},{id:"433",name:"Eros",category:"asteroid",orderFromSun:3.5,physical:{meanRadiusKm:8.42,massKg:6687e12,rotationPeriodHours:5.27,colorHex:"#998d7f"},orbit:{semiMajorAxisKm:218150155,semiMajorAxisAU:1.4582437168,eccentricity:.2228779628,inclinationDeg:10.8285441,longitudeAscendingNodeDeg:304.26797134,argumentPeriapsisDeg:178.91813191,meanAnomalyAtEpochDeg:62.51145502,orbitalPeriodDays:643.196,epochJd:24612005e-1,meanMotionDegPerDay:.559704634704,source:"JPL SBDB osculating elements"},description:"Elongated peanut-shaped S-type near-Earth asteroid; historic target orbited and landed upon by the NEAR Shoemaker spacecraft in 2001."},{id:"951",name:"Gaspra",category:"asteroid",orderFromSun:4.1,physical:{meanRadiusKm:6.1,massKg:2e16,rotationPeriodHours:7.042,colorHex:"#a09485"},orbit:{semiMajorAxisKm:330608056,semiMajorAxisAU:2.2099783537,eccentricity:.1737374595,inclinationDeg:4.10465497,longitudeAscendingNodeDeg:252.96729133,argumentPeriapsisDeg:130.00376374,meanAnomalyAtEpochDeg:112.95087164,orbitalPeriodDays:1199.998,epochJd:24612005e-1,meanMotionDegPerDay:.300000545277,source:"JPL SBDB osculating elements"},description:"First asteroid ever visited by a spacecraft (Galileo flyby in 1991); irregular S-type asteroid with prominent groove-like depressions."},{id:"243",name:"Ida",category:"asteroid",orderFromSun:4.6,physical:{meanRadiusKm:15.7,massKg:42e15,rotationPeriodHours:4.634,colorHex:"#9c9284"},orbit:{semiMajorAxisKm:4283507686e-1,semiMajorAxisAU:2.8633480317,eccentricity:.046109628,inclinationDeg:1.13036309,longitudeAscendingNodeDeg:323.53666094,argumentPeriapsisDeg:113.25718268,meanAnomalyAtEpochDeg:49.64769088,orbitalPeriodDays:1769.741,epochJd:24612005e-1,meanMotionDegPerDay:.20341963288,source:"JPL SBDB osculating elements"},description:"Coronis-family asteroid visited by Galileo in 1993, famous for the historic discovery of Dactyl, the first recognized asteroid moon."},{id:"101955",name:"Bennu",category:"asteroid",orderFromSun:3.2,physical:{meanRadiusKm:.242,massKg:7329e7,rotationPeriodHours:4.296,colorHex:"#3a3a3a"},orbit:{semiMajorAxisKm:168505699,semiMajorAxisAU:1.1263910259,eccentricity:.2037450762,inclinationDeg:6.03494377,longitudeAscendingNodeDeg:2.0608662,argumentPeriapsisDeg:66.22306084,meanAnomalyAtEpochDeg:101.703952,orbitalPeriodDays:436.649,epochJd:24555625e-1,meanMotionDegPerDay:.824461350332,source:"JPL SBDB osculating elements"},description:"Diamond-shaped carbonaceous rubble-pile near-Earth asteroid sampled by NASA’s OSIRIS-REx spacecraft, delivering pristine solar nebula samples to Earth in 2023."},{id:"162173",name:"Ryugu",category:"asteroid",orderFromSun:3.3,physical:{meanRadiusKm:.448,massKg:45e10,rotationPeriodHours:7.632,colorHex:"#353535"},orbit:{semiMajorAxisKm:1781589365e-1,semiMajorAxisAU:1.1909189327,eccentricity:.1910730046,inclinationDeg:5.86644249,longitudeAscendingNodeDeg:251.2897124,argumentPeriapsisDeg:211.60899381,meanAnomalyAtEpochDeg:62.34067409,orbitalPeriodDays:474.703,epochJd:24612005e-1,meanMotionDegPerDay:.758369353853,source:"JPL SBDB osculating elements"},description:"Spinning-top shaped Cb-type near-Earth asteroid sampled by JAXA’s Hayabusa2 spacecraft, rich in water-bearing minerals and prebiotic amino acids."}],ct=[...oi,...ri],Se={id:"SGR_A_STAR",name:"Sagittarius A*",category:"black_hole",orderFromSun:999,physical:{meanRadiusKm:12690400,equatorialRadiusKm:32971e3,polarRadiusKm:12690400,flattening:0,massKg:8544455e30,gmKm3S2:570283e12,rotationPeriodHours:.18,axialTiltDeg:42,meanTemperatureK:1e7,colorHex:"#ffaa33"},orbit:{semiMajorAxisKm:2554e14,semiMajorAxisAU:1707e6,eccentricity:0,inclinationDeg:60.19,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:0,orbitalPeriodDays:23e7*365.25},description:"Supermassive black hole at the gravitational center of the Milky Way galaxy (mass 4.3 million solar masses, distance 27,000 ly). Demonstrates extreme relativistic light bending, an apparent gravitational shadow, a photon sphere, and a glowing synchrotron accretion disk."},ce=class ce{static getSagittariusAStar(){return Se}static getAllBodies(){return this.bodies}static getBody(e){return this.bodiesById.get(e)||this.bodiesByName.get(e.toLowerCase())}static getParent(e){if(e.parentId)return this.bodiesById.get(e.parentId)}static getMoonsOf(e){const i=this.getBody(e);return i?this.moonsByParentId.get(i.id)||[]:[]}static getByCategory(e){return this.bodies.filter(i=>i.category===e)}static getPlanets(){return this.getByCategory("planet")}static getMoons(){return this.getByCategory("moon")}static getDwarfPlanets(){return this.getByCategory("dwarf_planet")}static getAsteroids(){return this.getByCategory("asteroid")}static search(e){const i=e.trim().toLowerCase();return i?this.bodies.filter(a=>a.name.toLowerCase().includes(i)||a.category.toLowerCase().includes(i)||a.parentName&&a.parentName.toLowerCase().includes(i)||a.description.toLowerCase().includes(i)):this.bodies}static getStats(){return{total:this.bodies.length,stars:this.getByCategory("star").length,planets:this.getPlanets().length,moons:this.getMoons().length,dwarfPlanets:this.getDwarfPlanets().length,asteroids:this.getAsteroids().length}}};u(ce,"bodies",ct),u(ce,"bodiesById",new Map([...ct.map(e=>[e.id,e]),[Se.id,Se]])),u(ce,"bodiesByName",new Map([...ct.map(e=>[e.name.toLowerCase(),e]),["sagittarius a*",Se],["sgr a*",Se],["sgr a",Se],["black hole",Se]])),u(ce,"moonsByParentId",new Map),(()=>{for(const e of ce.bodies)e.parentId&&(ce.moonsByParentId.has(e.parentId)||ce.moonsByParentId.set(e.parentId,[]),ce.moonsByParentId.get(e.parentId).push(e))})();let Y=ce;class Ue{static getTexture(e){if(this.cache.has(e))return this.cache.get(e);let i;switch(e){case"Sun":i=this.createSunTexture();break;case"Mercury":i=this.createMercuryTexture();break;case"Venus":i=this.createVenusTexture();break;case"Earth":i=this.createEarthTexture();break;case"EarthClouds":i=this.createEarthCloudsTexture();break;case"Mars":i=this.createMarsTexture();break;case"Jupiter":i=this.createJupiterTexture();break;case"Saturn":i=this.createSaturnTexture();break;case"SaturnRings":i=this.createSaturnRingsTexture();break;case"Uranus":i=this.createUranusTexture();break;case"Neptune":i=this.createNeptuneTexture();break;case"Moon":i=this.createMoonTexture();break;case"Io":i=this.createIoTexture();break;case"Europa":i=this.createEuropaTexture();break;case"Ganymede":i=this.createGanymedeTexture();break;case"Callisto":i=this.createCallistoTexture();break;case"Titan":i=this.createTitanTexture();break;case"Enceladus":i=this.createEnceladusTexture();break;case"Triton":i=this.createTritonTexture();break;case"Pluto":i=this.createPlutoTexture();break;case"Ceres":i=this.createCeresTexture();break;default:i=this.createRockyCrateredTexture(e)}return this.cache.set(e,i),i}static createSunTexture(){const a=document.createElement("canvas");a.width=1024,a.height=512;const t=a.getContext("2d"),s=t.createLinearGradient(0,0,0,512);s.addColorStop(0,"#fff4cc"),s.addColorStop(.5,"#ffbb33"),s.addColorStop(1,"#ff8800"),t.fillStyle=s,t.fillRect(0,0,1024,512);const o=t.getImageData(0,0,1024,512),r=o.data;for(let l=0;l<r.length;l+=4){const c=l/4%1024,d=Math.floor(l/4/1024),m=Math.sin(c*.05)*Math.cos(d*.05),f=Math.sin(c*.12+1.2)*Math.cos(d*.12+.8),v=Math.sin(c*.25)*Math.sin(d*.25),y=m*.5+f*.3+v*.2;r[l]=Math.min(255,Math.max(180,245+y*35)),r[l+1]=Math.min(240,Math.max(120,180+y*55)),r[l+2]=Math.min(180,Math.max(20,60+y*40)),r[l+3]=255}t.putImageData(o,0,0),t.fillStyle="rgba(120, 30, 0, 0.6)";for(let l=0;l<12;l++){const c=(l*85+40)%1024,d=160+l*37%180,m=6+l%5*3;t.beginPath(),t.arc(c,d,m,0,Math.PI*2),t.fill(),t.fillStyle="rgba(60, 10, 0, 0.85)",t.beginPath(),t.arc(c,d,m*.45,0,Math.PI*2),t.fill()}const n=new j(a);return n.wrapS=H,n.wrapT=O,n}static createMercuryTexture(){const a=document.createElement("canvas");a.width=1024,a.height=512;const t=a.getContext("2d");t.fillStyle="#78736d",t.fillRect(0,0,1024,512);const s=t.getImageData(0,0,1024,512),o=s.data;for(let n=0;n<o.length;n+=4){const l=n/4%1024,c=Math.floor(n/4/1024),m=120+(Math.sin(l*.08)*Math.cos(c*.08)+Math.sin(l*.2)*Math.sin(c*.2))*18;o[n]=m*.95,o[n+1]=m*.93,o[n+2]=m*.9,o[n+3]=255}t.putImageData(s,0,0);for(let n=0;n<120;n++){const l=(n*79+33)%1024,c=20+n*47%472,d=4+n%15*2;t.fillStyle="rgba(40, 38, 36, 0.4)",t.beginPath(),t.arc(l,c,d,0,Math.PI*2),t.fill(),t.strokeStyle="rgba(210, 205, 200, 0.35)",t.lineWidth=1.5,t.beginPath(),t.arc(l,c,d,Math.PI*.8,Math.PI*1.8),t.stroke()}const r=new j(a);return r.wrapS=H,r.wrapT=O,r}static createVenusTexture(){const a=document.createElement("canvas");a.width=1024,a.height=512;const t=a.getContext("2d"),s=t.createLinearGradient(0,0,0,512);s.addColorStop(0,"#f0d8a8"),s.addColorStop(.2,"#ecd096"),s.addColorStop(.5,"#e5c483"),s.addColorStop(.8,"#ecd096"),s.addColorStop(1,"#f0d8a8"),t.fillStyle=s,t.fillRect(0,0,1024,512),t.fillStyle="rgba(215, 180, 110, 0.25)";for(let r=0;r<18;r++){const n=r*28.444444444444443;t.beginPath(),t.moveTo(0,n);for(let l=0;l<=1024;l+=30){const c=Math.sin(l*.015+r)*12+Math.cos(l*.03)*6;t.lineTo(l,n+c)}t.lineTo(1024,n+20),t.lineTo(0,n+20),t.closePath(),t.fill()}const o=new j(a);return o.wrapS=H,o.wrapT=O,o}static createEarthTexture(){const a=document.createElement("canvas");a.width=1024,a.height=512;const t=a.getContext("2d");t.fillStyle="#0f274a",t.fillRect(0,0,1024,512);const s=t.createLinearGradient(0,0,0,512);s.addColorStop(0,"rgba(25, 65, 115, 0.4)"),s.addColorStop(.5,"rgba(10, 35, 75, 0.1)"),s.addColorStop(1,"rgba(25, 65, 115, 0.4)"),t.fillStyle=s,t.fillRect(0,0,1024,512),t.fillStyle="#2d5930",t.beginPath(),t.ellipse(1024*.58,512*.38,140,85,.1,0,Math.PI*2),t.ellipse(1024*.53,512*.62,70,95,-.15,0,Math.PI*2),t.fill(),t.beginPath(),t.ellipse(1024*.22,512*.32,95,75,-.2,0,Math.PI*2),t.ellipse(1024*.3,512*.65,60,90,.25,0,Math.PI*2),t.fill(),t.beginPath(),t.ellipse(1024*.82,512*.72,45,35,.1,0,Math.PI*2),t.fill(),t.fillStyle="#9e8548",t.beginPath(),t.ellipse(1024*.52,512*.45,65,30,0,0,Math.PI*2),t.ellipse(1024*.82,512*.72,28,20,0,0,Math.PI*2),t.fill(),t.fillStyle="#f0f6ff",t.beginPath(),t.rect(0,0,1024,28),t.fill(),t.beginPath(),t.rect(0,476,1024,36),t.fill();const o=new j(a);return o.wrapS=H,o.wrapT=O,o}static createEarthCloudsTexture(){const a=document.createElement("canvas");a.width=1024,a.height=512;const t=a.getContext("2d");t.clearRect(0,0,1024,512),t.fillStyle="rgba(255, 255, 255, 0.75)";for(let o=0;o<28;o++){const r=(o*65+15)%1024,n=60+o*42%392,l=55+o%7*15,c=18+o%4*6;t.beginPath(),t.ellipse(r,n,l,c,o%5*.2,0,Math.PI*2),t.fill()}const s=new j(a);return s.wrapS=H,s.wrapT=O,s}static createMarsTexture(){const a=document.createElement("canvas");a.width=1024,a.height=512;const t=a.getContext("2d");t.fillStyle="#bd532b",t.fillRect(0,0,1024,512),t.fillStyle="rgba(68, 38, 25, 0.45)",t.beginPath(),t.ellipse(1024*.45,512*.52,90,45,.2,0,Math.PI*2),t.ellipse(1024*.75,512*.42,70,50,-.1,0,Math.PI*2),t.ellipse(1024*.15,512*.58,60,35,.15,0,Math.PI*2),t.fill(),t.fillStyle="rgba(165, 80, 45, 0.8)",t.beginPath(),t.arc(1024*.28,512*.45,24,0,Math.PI*2),t.fill(),t.fillStyle="#3a2015",t.beginPath(),t.arc(1024*.28,512*.45,6,0,Math.PI*2),t.fill(),t.fillStyle="#f8f4f0",t.beginPath(),t.ellipse(1024*.5,12,110,12,0,0,Math.PI*2),t.fill(),t.beginPath(),t.ellipse(1024*.5,498,85,14,0,0,Math.PI*2),t.fill();const s=new j(a);return s.wrapS=H,s.wrapT=O,s}static createJupiterTexture(){const a=document.createElement("canvas");a.width=1024,a.height=512;const t=a.getContext("2d"),s=["#a88460","#dec8aa","#8f5c35","#f2e2ce","#9e673d","#ebd5be","#82522e","#f5e8da","#916139","#e6cfb8"],o=512/s.length;for(let d=0;d<s.length;d++)t.fillStyle=s[d],t.fillRect(0,d*o,1024,o);for(let d=0;d<s.length;d++){const m=d*o;t.fillStyle=d%2===0?"rgba(80, 45, 20, 0.35)":"rgba(255, 245, 235, 0.35)",t.beginPath(),t.moveTo(0,m);for(let f=0;f<=1024;f+=25){const v=Math.sin(f*.03+d*2)*5+Math.cos(f*.08)*3;t.lineTo(f,m+v)}t.lineTo(1024,m+o*.5),t.lineTo(0,m+o*.5),t.closePath(),t.fill()}const r=1024*.65,n=512*.62,l=t.createRadialGradient(r,n,5,r,n,32);l.addColorStop(0,"#c43d22"),l.addColorStop(.6,"#b5482e"),l.addColorStop(1,"#8f5c35"),t.fillStyle=l,t.beginPath(),t.ellipse(r,n,36,20,-.08,0,Math.PI*2),t.fill(),t.strokeStyle="rgba(255, 255, 255, 0.5)",t.lineWidth=2.5,t.beginPath(),t.ellipse(r+45,n-4,18,9,.1,0,Math.PI*2),t.stroke();const c=new j(a);return c.wrapS=H,c.wrapT=O,c}static createSaturnTexture(){const a=document.createElement("canvas");a.width=1024,a.height=512;const t=a.getContext("2d"),s=t.createLinearGradient(0,0,0,512);s.addColorStop(0,"#757c6b"),s.addColorStop(.2,"#ccb98d"),s.addColorStop(.4,"#e8dcba"),s.addColorStop(.5,"#f4ebd2"),s.addColorStop(.6,"#e8dcba"),s.addColorStop(.8,"#ccb98d"),s.addColorStop(1,"#80806a"),t.fillStyle=s,t.fillRect(0,0,1024,512);for(let r=0;r<30;r++){const n=r/30*512;t.fillStyle=r%2===0?"rgba(120, 100, 70, 0.08)":"rgba(255, 250, 240, 0.08)",t.fillRect(0,n,1024,512/30)}const o=new j(a);return o.wrapS=H,o.wrapT=O,o}static createSaturnRingsTexture(){const a=document.createElement("canvas");a.width=1024,a.height=64;const t=a.getContext("2d");t.clearRect(0,0,1024,64);const s=t.createLinearGradient(0,0,1024,0);s.addColorStop(0,"rgba(140, 130, 115, 0.0)"),s.addColorStop(.05,"rgba(150, 140, 125, 0.25)"),s.addColorStop(.18,"rgba(160, 150, 130, 0.35)"),s.addColorStop(.2,"rgba(225, 215, 185, 0.85)"),s.addColorStop(.35,"rgba(240, 230, 205, 0.95)"),s.addColorStop(.55,"rgba(230, 220, 195, 0.90)"),s.addColorStop(.57,"rgba(40, 35, 30, 0.02)"),s.addColorStop(.63,"rgba(40, 35, 30, 0.02)"),s.addColorStop(.65,"rgba(215, 205, 180, 0.75)"),s.addColorStop(.8,"rgba(225, 215, 190, 0.80)"),s.addColorStop(.83,"rgba(40, 35, 30, 0.05)"),s.addColorStop(.85,"rgba(220, 210, 185, 0.70)"),s.addColorStop(.95,"rgba(180, 170, 150, 0.35)"),s.addColorStop(1,"rgba(140, 130, 115, 0.0)"),t.fillStyle=s,t.fillRect(0,0,1024,64);const o=new j(a);return o.wrapS=O,o.wrapT=O,o}static createUranusTexture(){const a=document.createElement("canvas");a.width=512,a.height=256;const t=a.getContext("2d"),s=t.createLinearGradient(0,0,0,256);return s.addColorStop(0,"#75c8d6"),s.addColorStop(.5,"#8ee0ed"),s.addColorStop(1,"#75c8d6"),t.fillStyle=s,t.fillRect(0,0,512,256),new j(a)}static createNeptuneTexture(){const a=document.createElement("canvas");a.width=1024,a.height=512;const t=a.getContext("2d"),s=t.createLinearGradient(0,0,0,512);s.addColorStop(0,"#2d4aa0"),s.addColorStop(.3,"#3a62cb"),s.addColorStop(.5,"#4a75e6"),s.addColorStop(.7,"#3a62cb"),s.addColorStop(1,"#2d4aa0"),t.fillStyle=s,t.fillRect(0,0,1024,512),t.fillStyle="rgba(25, 40, 110, 0.35)",t.fillRect(0,512*.55,1024,40),t.fillStyle="#1b2c75",t.beginPath(),t.ellipse(1024*.45,512*.58,45,24,0,0,Math.PI*2),t.fill(),t.fillStyle="rgba(235, 245, 255, 0.8)",t.beginPath(),t.ellipse(1024*.45+50,512*.58-10,22,6,.1,0,Math.PI*2),t.fill();const o=new j(a);return o.wrapS=H,o.wrapT=O,o}static createMoonTexture(){const a=document.createElement("canvas");a.width=512,a.height=256;const t=a.getContext("2d");t.fillStyle="#aba8a2",t.fillRect(0,0,512,256);const s=t.getImageData(0,0,512,256),o=s.data;for(let l=0;l<o.length;l+=4){const c=(Math.random()-.5)*24;o[l]=Math.max(0,Math.min(255,o[l]+c)),o[l+1]=Math.max(0,Math.min(255,o[l+1]+c)),o[l+2]=Math.max(0,Math.min(255,o[l+2]+c))}t.putImageData(s,0,0);const r=[{x:512*.35,y:256*.35,rx:55,ry:45,color:"#4a4844"},{x:512*.48,y:256*.38,rx:35,ry:30,color:"#4d4a46"},{x:512*.55,y:256*.48,rx:40,ry:32,color:"#494743"},{x:512*.22,y:256*.42,rx:65,ry:60,color:"#52504b"},{x:512*.42,y:256*.55,rx:38,ry:28,color:"#4b4844"},{x:512*.65,y:256*.45,rx:30,ry:25,color:"#504d49"}];for(const l of r){const c=t.createRadialGradient(l.x,l.y,5,l.x,l.y,l.rx);c.addColorStop(0,l.color),c.addColorStop(.85,l.color),c.addColorStop(1,"rgba(171, 168, 162, 0)"),t.fillStyle=c,t.beginPath(),t.ellipse(l.x,l.y,l.rx,l.ry,0,0,Math.PI*2),t.fill()}t.fillStyle="#ffffff",t.beginPath(),t.arc(512*.42,256*.72,4,0,Math.PI*2),t.fill(),t.strokeStyle="rgba(255, 255, 255, 0.25)",t.lineWidth=1;for(let l=0;l<Math.PI*2;l+=.35)t.beginPath(),t.moveTo(512*.42,256*.72),t.lineTo(512*.42+Math.cos(l)*75,256*.72+Math.sin(l)*75),t.stroke();const n=new j(a);return n.wrapS=H,n.wrapT=O,n}static createIoTexture(){const a=document.createElement("canvas");a.width=512,a.height=256;const t=a.getContext("2d");t.fillStyle="#e5c158",t.fillRect(0,0,512,256);for(let r=0;r<40;r++){const n=Math.random()*512,l=Math.random()*256,c=10+Math.random()*25;t.fillStyle=Math.random()>.5?"rgba(215, 140, 30, 0.45)":"rgba(245, 230, 150, 0.4)",t.beginPath(),t.arc(n,l,c,0,Math.PI*2),t.fill()}const s=[{x:512*.25,y:256*.45,r:10,color:"#7a1800"},{x:512*.65,y:256*.35,r:14,color:"#2b1005"},{x:512*.45,y:256*.6,r:8,color:"#8c2505"},{x:512*.8,y:256*.55,r:11,color:"#541505"},{x:512*.15,y:256*.7,r:7,color:"#882200"}];for(const r of s)t.strokeStyle="rgba(200, 50, 0, 0.6)",t.lineWidth=3,t.beginPath(),t.arc(r.x,r.y,r.r*2.2,0,Math.PI*2),t.stroke(),t.fillStyle=r.color,t.beginPath(),t.arc(r.x,r.y,r.r,0,Math.PI*2),t.fill();const o=new j(a);return o.wrapS=H,o.wrapT=O,o}static createEuropaTexture(){const a=document.createElement("canvas");a.width=1024,a.height=512;const t=a.getContext("2d");t.fillStyle="#f4f6fa",t.fillRect(0,0,1024,512);const s=t.createLinearGradient(0,0,0,512*.25);s.addColorStop(0,"rgba(230, 240, 250, 0.6)"),s.addColorStop(1,"rgba(244, 246, 250, 0.0)"),t.fillStyle=s,t.fillRect(0,0,1024,512*.25);const o=t.createLinearGradient(0,512,0,512*.75);o.addColorStop(0,"rgba(230, 240, 250, 0.6)"),o.addColorStop(1,"rgba(244, 246, 250, 0.0)"),t.fillStyle=o,t.fillRect(0,512*.75,1024,512*.25);for(let d=0;d<35;d++){const m=d*37%1024,f=512*.3+d*29%(512*.4),v=25+d%5*12,y=t.createRadialGradient(m,f,2,m,f,v);y.addColorStop(0,"rgba(225, 232, 240, 0.25)"),y.addColorStop(1,"rgba(244, 246, 250, 0.0)"),t.fillStyle=y,t.beginPath(),t.arc(m,f,v,0,Math.PI*2),t.fill()}const r=[{x:1024*.28,y:512*.45,rx:42,ry:28},{x:1024*.62,y:512*.52,rx:36,ry:24},{x:1024*.45,y:512*.35,rx:30,ry:20},{x:1024*.82,y:512*.42,rx:38,ry:25}];for(const d of r){const m=t.createRadialGradient(d.x,d.y,5,d.x,d.y,d.rx);m.addColorStop(0,"rgba(175, 135, 105, 0.16)"),m.addColorStop(.7,"rgba(160, 125, 98, 0.10)"),m.addColorStop(1,"rgba(244, 246, 250, 0.0)"),t.fillStyle=m,t.beginPath(),t.ellipse(d.x,d.y,d.rx,d.ry,.2,0,Math.PI*2),t.fill()}let n=42;const l=()=>(n=n*16807%2147483647,(n-1)/2147483646);for(let d=0;d<32;d++){const m=l()*1024,f=512*.15+l()*512*.7,v=80+l()*160,y=(l()-.5)*Math.PI*1.4,M=m+Math.cos(y)*(v*.5)+(l()-.5)*40,b=f+Math.sin(y)*(v*.5)+(l()-.5)*40,g=m+Math.cos(y)*v,S=f+Math.sin(y)*v;t.strokeStyle="rgba(155, 115, 90, 0.14)",t.lineWidth=4,t.beginPath(),t.moveTo(m,f),t.quadraticCurveTo(M,b,g,S),t.stroke(),t.strokeStyle="rgba(115, 80, 65, 0.45)",t.lineWidth=1.2,t.beginPath(),t.moveTo(m,f),t.quadraticCurveTo(M,b,g,S),t.stroke(),t.strokeStyle="rgba(255, 255, 255, 0.55)",t.lineWidth=.8,t.beginPath(),t.moveTo(m+1,f+1),t.quadraticCurveTo(M+1,b+1,g+1,S+1),t.stroke()}t.strokeStyle="rgba(130, 95, 78, 0.22)",t.lineWidth=.7;for(let d=0;d<50;d++){const m=l()*1024,f=l()*512,v=30+l()*60,y=l()*Math.PI*2;t.beginPath(),t.moveTo(m,f),t.lineTo(m+Math.cos(y)*v,f+Math.sin(y)*v),t.stroke()}const c=new j(a);return c.wrapS=H,c.wrapT=O,c}static createGanymedeTexture(){const a=document.createElement("canvas");a.width=512,a.height=256;const t=a.getContext("2d");t.fillStyle="#6e655c",t.fillRect(0,0,512,256),t.fillStyle="#9c9288";for(let o=0;o<14;o++){const r=(o*20+10)%256;t.fillRect(0,r,512,8+o%4*3)}t.strokeStyle="rgba(230, 230, 230, 0.35)",t.lineWidth=1;for(let o=0;o<256;o+=6)t.beginPath(),t.moveTo(0,o),t.lineTo(512,o+Math.sin(o*.1)*8),t.stroke();const s=new j(a);return s.wrapS=H,s.wrapT=O,s}static createCallistoTexture(){const a=document.createElement("canvas");a.width=512,a.height=256;const t=a.getContext("2d");t.fillStyle="#4e4741",t.fillRect(0,0,512,256);for(let n=0;n<180;n++){const l=Math.random()*512,c=Math.random()*256,d=2+Math.random()*8;t.fillStyle="#2f2a26",t.beginPath(),t.arc(l,c,d,0,Math.PI*2),t.fill(),t.strokeStyle="rgba(220, 225, 235, 0.7)",t.lineWidth=1,t.beginPath(),t.arc(l,c,d,0,Math.PI),t.stroke()}const s=512*.45,o=256*.4;t.strokeStyle="rgba(200, 210, 220, 0.4)";for(let n=8;n<=55;n+=7)t.beginPath(),t.arc(s,o,n,0,Math.PI*2),t.stroke();const r=new j(a);return r.wrapS=H,r.wrapT=O,r}static createTitanTexture(){const a=document.createElement("canvas");a.width=512,a.height=256;const t=a.getContext("2d"),s=t.createLinearGradient(0,0,0,256);s.addColorStop(0,"#c78028"),s.addColorStop(.2,"#dba046"),s.addColorStop(.5,"#e8b258"),s.addColorStop(.8,"#dba046"),s.addColorStop(1,"#c07820"),t.fillStyle=s,t.fillRect(0,0,512,256),t.fillStyle="rgba(210, 130, 40, 0.2)",t.fillRect(0,256*.35,512,25),t.fillRect(0,256*.6,512,25);const o=new j(a);return o.wrapS=H,o.wrapT=O,o}static createEnceladusTexture(){const a=document.createElement("canvas");a.width=512,a.height=256;const t=a.getContext("2d");t.fillStyle="#f6f8fb",t.fillRect(0,0,512,256),t.strokeStyle="#68a0c8",t.lineWidth=2;for(let o=0;o<4;o++){const r=217.6+o*5;t.beginPath(),t.moveTo(512*.3,r),t.bezierCurveTo(512*.45,r+4,512*.55,r-4,512*.7,r),t.stroke()}const s=new j(a);return s.wrapS=H,s.wrapT=O,s}static createTritonTexture(){const a=document.createElement("canvas");a.width=512,a.height=256;const t=a.getContext("2d");t.fillStyle="#decac0",t.fillRect(0,0,512,256),t.fillStyle="rgba(165, 135, 125, 0.35)";for(let o=10;o<512;o+=16)for(let r=10;r<256*.6;r+=14)t.beginPath(),t.arc(o+r%8,r,5,0,Math.PI*2),t.fill();t.fillStyle="rgba(50, 40, 35, 0.6)";for(let o=0;o<8;o++){const r=102.4+o*45,n=256*.75+o%3*8;t.beginPath(),t.ellipse(r,n,12,3,.4,0,Math.PI*2),t.fill()}const s=new j(a);return s.wrapS=H,s.wrapT=O,s}static createPlutoTexture(){const a=document.createElement("canvas");a.width=512,a.height=256;const t=a.getContext("2d");t.fillStyle="#8f4f35",t.fillRect(0,0,512,256),t.fillStyle="#421f14",t.fillRect(0,256*.5,512*.45,45);const s=512*.62,o=256*.42;t.fillStyle="#f0e6dc",t.beginPath(),t.ellipse(s-16,o,28,35,-.2,0,Math.PI*2),t.fill(),t.ellipse(s+16,o,26,32,.2,0,Math.PI*2),t.fill();const r=new j(a);return r.wrapS=H,r.wrapT=O,r}static createCeresTexture(){const a=document.createElement("canvas");a.width=512,a.height=256;const t=a.getContext("2d");t.fillStyle="#6e6962",t.fillRect(0,0,512,256);for(let n=0;n<90;n++){const l=Math.random()*512,c=Math.random()*256,d=2+Math.random()*6;t.fillStyle="#48443e",t.beginPath(),t.arc(l,c,d,0,Math.PI*2),t.fill()}const s=512*.52,o=256*.44;t.fillStyle="#3a3630",t.beginPath(),t.arc(s,o,14,0,Math.PI*2),t.fill(),t.fillStyle="#ffffff",t.beginPath(),t.arc(s,o,3.5,0,Math.PI*2),t.fill();const r=new j(a);return r.wrapS=H,r.wrapT=O,r}static createRockyCrateredTexture(e){const t=document.createElement("canvas");t.width=256,t.height=128;const s=t.getContext("2d"),o=e==="Bennu"||e==="Ryugu"||e==="Hygiea",r=e==="Psyche";s.fillStyle=o?"#323232":r?"#948a7e":"#7a746d",s.fillRect(0,0,256,128);for(let l=0;l<50;l++){const c=Math.random()*256,d=Math.random()*128,m=2+Math.random()*5;s.fillStyle=o?"#1a1a1a":"#4e4842",s.beginPath(),s.arc(c,d,m,0,Math.PI*2),s.fill(),s.strokeStyle=o?"#505050":"rgba(200, 195, 185, 0.5)",s.lineWidth=1,s.beginPath(),s.arc(c,d,m,0,Math.PI),s.stroke()}const n=new j(t);return n.wrapS=H,n.wrapT=O,n}static createGenericTexture(e){const i=document.createElement("canvas");i.width=64,i.height=64;const a=i.getContext("2d");return a.fillStyle=e,a.fillRect(0,0,64,64),new j(i)}}u(Ue,"cache",new Map);const Ae=class Ae{constructor(){u(this,"loader",new Ta);u(this,"customLoader",null);u(this,"cache",new Map);u(this,"inFlightRequests",new Map);u(this,"maxAnisotropy",8);u(this,"baseUrl",(typeof import.meta<"u"&&"/solaris/"||"/").replace(/\/?$/,"/"))}resolveUrl(e){if(!e)return"";if(e.startsWith("http://")||e.startsWith("https://")||e.startsWith("data:")||e.startsWith("blob:"))return e;const i=e.replace(/^(\.\/)+/,"").replace(/^\/+/,"").replace(/\/+/g,"/");return`${this.baseUrl.replace(/\/+$/,"/")}${i}`}static getInstance(){return Ae.instance||(Ae.instance=new Ae),Ae.instance}setLoader(e){this.customLoader=e}setBaseUrl(e){this.baseUrl=e.replace(/\/?$/,"/")}setMaxAnisotropy(e){this.maxAnisotropy=Math.max(1,e);for(const i of this.cache.values())i.anisotropy=this.maxAnisotropy,i.needsUpdate=!0}isCached(e){const i=this.resolveUrl(e);return this.cache.has(i)}getCacheSize(){return this.cache.size}evictFromCache(e,i=!1){const a=this.resolveUrl(e),t=this.cache.get(a);return t?(this.cache.delete(a),this.inFlightRequests.delete(a),i&&t.dispose(),!0):!1}clearCache(e=!1){if(e)for(const i of this.cache.values())i.dispose();this.cache.clear(),this.inFlightRequests.clear()}resetForTesting(){this.clearCache(!1),this.customLoader=null,this.baseUrl=(typeof import.meta<"u"&&"/solaris/"||"/").replace(/\/?$/,"/")}loadTexture(e,i=!0,a){const t=this.resolveUrl(e),s=this.cache.get(t);if(s)return s;if(typeof document>"u"&&!this.customLoader){const c=new Da;return c.colorSpace=i?Le:qe,this.cache.set(t,c),c}const o=this.customLoader||this.loader;let r=!1,n=null;const l=o.load(t,c=>{c.colorSpace=i?Le:qe,c.generateMipmaps=!0,c.minFilter=nt,c.magFilter=lt,c.anisotropy=this.maxAnisotropy,c.needsUpdate=!0},void 0,c=>{if(r=!0,console.warn(`[TexturePipeline] Fallback activated for ${e} (${t}):`,c),this.cache.delete(t),this.inFlightRequests.delete(t),a&&n)try{const d=Ue.getTexture(a);d&&d.image&&(n.image=d.image,n.needsUpdate=!0)}catch(d){console.warn("[TexturePipeline] Fallback generation error:",d)}});if(n=l,r&&a)try{const c=Ue.getTexture(a);c&&c.image&&(n.image=c.image,n.needsUpdate=!0)}catch(c){console.warn("[TexturePipeline] Fallback generation error:",c)}return l.colorSpace=i?Le:qe,l.generateMipmaps=!0,l.minFilter=nt,l.magFilter=lt,l.anisotropy=this.maxAnisotropy,r||this.cache.set(t,l),l}loadTextureAsync(e,i=!0,a){const t=this.resolveUrl(e),s=this.cache.get(t);if(s)return Promise.resolve(s);const o=this.inFlightRequests.get(t);if(o)return o;if(typeof document>"u"&&!this.customLoader){const n=this.loadTexture(e,i,a);return Promise.resolve(n)}const r=new Promise((n,l)=>{(this.customLoader||this.loader).load(t,d=>{d.colorSpace=i?Le:qe,d.generateMipmaps=!0,d.minFilter=nt,d.magFilter=lt,d.anisotropy=this.maxAnisotropy,d.needsUpdate=!0,this.cache.set(t,d),this.inFlightRequests.delete(t),n(d)},void 0,d=>{if(this.cache.delete(t),this.inFlightRequests.delete(t),a){console.warn(`[TexturePipeline] Fallback activated for ${e}:`,d);const m=Ue.getTexture(a);n(m)}else l(d)})});return this.inFlightRequests.set(t,r),r}getPlanetTextures(e){switch(e){case"Sun":return{map:this.loadTexture("/textures/2k_sun.jpg",!0,"Sun"),emissiveMap:this.loadTexture("/textures/2k_sun.jpg",!0,"Sun")};case"Mercury":return{map:this.loadTexture("/textures/2k_mercury.jpg",!0,"Mercury")};case"Venus":return{map:this.loadTexture("/textures/2k_venus_atmosphere.jpg",!0,"Venus")};case"Earth":return{map:this.loadTexture("/textures/2k_earth_daymap.jpg",!0,"Earth"),normalMap:this.loadTexture("/textures/earth_normal_2048.jpg",!1),nightMap:this.loadTexture("/textures/2k_earth_nightmap.jpg",!0),cloudsMap:this.loadTexture("/textures/2k_earth_clouds.jpg",!0,"EarthClouds")};case"Moon":return{map:this.loadTexture("/textures/2k_moon.jpg",!0,"Moon")};case"Mars":return{map:this.loadTexture("/textures/2k_mars.jpg",!0,"Mars")};case"Jupiter":return{map:this.loadTexture("/textures/2k_jupiter.jpg",!0,"Jupiter")};case"Saturn":return{map:this.loadTexture("/textures/2k_saturn.jpg",!0,"Saturn"),ringAlphaMap:this.loadTexture("/textures/2k_saturn_ring_alpha.png",!1,"SaturnRings")};case"Uranus":return{map:this.loadTexture("/textures/2k_uranus.jpg",!0,"Uranus")};case"Neptune":return{map:this.loadTexture("/textures/2k_neptune.jpg",!0,"Neptune")};default:return{map:Ue.getTexture(e)}}}getMilkyWayTexture(){return this.loadTexture("/textures/gaia_sky.webp",!0)}getMilkyWayDiskTexture(){return this.loadTexture("/textures/milky_way_disk.webp",!0)}};u(Ae,"instance");let He=Ae;class ht{static createPhotosphereMaterial(e){return new I({uniforms:{sunTexture:{value:e},time:{value:0}},vertexShader:`
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
      `})}static createCoronaMaterial(e=14){return new I({uniforms:{sunCenter:{value:new P(0,0,0)},sunRadius:{value:e},time:{value:0}},vertexShader:`
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
      `,blending:W,side:Fe,transparent:!0,depthWrite:!1})}static createProminencesMaterial(){return new I({uniforms:{time:{value:0}},vertexShader:`
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
      `,blending:W,side:Ne,transparent:!0,depthWrite:!1})}static createProminencesGroup(e){const i=new ie;i.name="solar_prominences";const a=this.createProminencesMaterial();return[{lat:.35,lon:.2,scale:.14,angle:.4},{lat:-.42,lon:1.1,scale:.18,angle:-.3},{lat:.15,lon:2.3,scale:.11,angle:.6},{lat:-.25,lon:3.4,scale:.22,angle:-.5},{lat:.55,lon:4.2,scale:.15,angle:.2},{lat:-.1,lon:5.1,scale:.19,angle:.7},{lat:.4,lon:5.8,scale:.12,angle:-.4}].forEach((s,o)=>{const r=new $e(1,1,32,8),n=r.attributes.position,l=r.attributes.uv,c=s.scale*e*2.2,d=s.scale*e*1.6,m=s.scale*e*.28;for(let w=0;w<n.count;w++){const T=l.getX(w),A=l.getY(w),R=(T-.5)*c,N=Math.sin(T*Math.PI)*d,U=(A-.5)*m;n.setXYZ(w,R,N,U)}r.computeVertexNormals();const f=new B(r,a);f.name=`prominence_loop_${o}`;const v=Math.cos(s.lat),y=Math.sin(s.lat),M=e*v*Math.cos(s.lon),b=e*y,g=e*v*Math.sin(s.lon);f.position.set(M,b,g);const S=new P(M,b,g).normalize();f.quaternion.setFromUnitVectors(new P(0,1,0),S),f.rotateOnAxis(new P(0,1,0),s.angle),i.add(f)}),i}}const qt={Earth:{radiusScale:1.008,rayleighColor:new E(.24,.52,.92),twilightColor:new E(.95,.42,.16),density:.65,falloffPower:4.5,mieG:.72},Venus:{radiusScale:1.012,rayleighColor:new E(.92,.86,.64),twilightColor:new E(.85,.58,.32),density:1.1,falloffPower:3.5,mieG:.65},Mars:{radiusScale:1.004,rayleighColor:new E(.65,.55,.5),twilightColor:new E(.35,.5,.7),density:.12,falloffPower:6,mieG:.55},Uranus:{radiusScale:1.014,rayleighColor:new E(.48,.85,.82),twilightColor:new E(.32,.65,.72),density:.75,falloffPower:3.8,mieG:.7},Neptune:{radiusScale:1.014,rayleighColor:new E(.2,.45,.95),twilightColor:new E(.15,.3,.75),density:.8,falloffPower:3.8,mieG:.7}};class Ut{static createAtmosphereMaterial(e){const i=qt[e];return i?new I({uniforms:{rayleighColor:{value:i.rayleighColor},twilightColor:{value:i.twilightColor},density:{value:i.density},falloffPower:{value:i.falloffPower},mieG:{value:i.mieG}},vertexShader:`
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
      `,blending:W,side:Fe,transparent:!0,depthWrite:!1}):null}}class jt{static createSurfaceMaterial(e,i,a,t){return new I({uniforms:{dayMap:{value:e},normalMap:{value:i||null},nightMap:{value:a||null},cloudsMap:{value:t||null},hasNormalMap:{value:i?1:0},hasNightMap:{value:a?1:0},hasCloudsMap:{value:t?1:0}},vertexShader:`
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
      `})}static createCloudMaterial(e){return new I({uniforms:{cloudsMap:{value:e}},vertexShader:`
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
      `,transparent:!0,depthWrite:!1})}}class ni{static createMaterial(e){const{name:i,category:a,map:t,normalMap:s}=e,o=i==="Jupiter"||i==="Saturn"||i==="Uranus"||i==="Neptune",r=i==="Europa"||i==="Enceladus",n=i==="Mercury"||i==="Moon"||a==="asteroid",l=i==="Mars",c=i==="Venus",d=i==="Saturn";return new I({uniforms:{map:{value:t},normalMap:{value:s||null},hasNormalMap:{value:s?1:0},isGasGiant:{value:o?1:0},isIcyMoon:{value:r?1:0},isAirlessRocky:{value:n?1:0},isMars:{value:l?1:0},isVenus:{value:c?1:0},isSaturn:{value:d?1:0}},vertexShader:`
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
      `})}}const li=48,Xt=50,$t=65,Qt=.58;function bt(p){return Xt+Math.pow(Math.max(0,p),Qt)*$t}function ci(p){return Math.pow(Math.max(0,p-Xt)/$t,1/Qt)}function Zt(p){if(p.category==="star")return li;switch(p.name){case"Jupiter":return 26.9;case"Saturn":return 22.68;case"Uranus":return 9.62;case"Neptune":return 9.32;case"Earth":return 2.4;case"Venus":return 2.28;case"Mars":return 1.28;case"Mercury":return .92;case"Pluto":return .45}const e=p.physical.meanRadiusKm;return p.category==="moon"?e<100?.18:e<500?.32:e<1200?.48:e<2e3?.65:.95:p.category==="dwarf_planet"?.45:p.category==="asteroid"?e<10?.18:e<100?.25:.38:Math.max(.18,e/6371*2.4)}class hi{static getVisualRadius(e){return Zt(e)}static createPlanet(e){var S;const i=new ie;i.name=`body_group_${e.name}`;const a=this.getVisualRadius(e),s=1-(e.physical.flattening||0),o=e.category==="moon"||e.category==="asteroid",r=e.category==="planet"||e.category==="star",n=new oe(1,r?96:o?36:64,r?64:o?24:48);if(e.category==="asteroid"||e.category==="moon"&&e.physical.meanRadiusKm<200){const w=n.attributes.position;for(let T=0;T<w.count;T++){const A=w.getX(T),R=w.getY(T),N=w.getZ(T),U=1+.18*Math.sin(A*4)*Math.cos(R*4+N*3);w.setXYZ(T,A*U,R*U,N*U)}n.computeVertexNormals()}const c=He.getInstance().getPlanetTextures(e.name);let d,m,f,v,y,M;const b=[];if(e.category==="star"){d=ht.createPhotosphereMaterial(c.map);const w=new oe(2.45,96,64),T=ht.createCoronaMaterial(a),A=new B(w,T);A.name="sun_corona",A.scale.set(a,a,a),i.add(A),b.push(A),M=ht.createProminencesGroup(a),i.add(M)}else if(e.name==="Earth"){if(d=jt.createSurfaceMaterial(c.map,c.normalMap,c.nightMap,c.cloudsMap),c.cloudsMap){const T=new oe(1.004,96,64),A=jt.createCloudMaterial(c.cloudsMap);f=new B(T,A),f.name="earth_clouds",f.renderOrder=2,f.scale.set(a,a,a),i.add(f)}const w=Ut.createAtmosphereMaterial("Earth");if(w){const T=new oe(1.012,96,64);v=new B(T,w),v.name="earth_atmosphere",v.renderOrder=3,v.scale.set(a,a,a),i.add(v)}}else{d=ni.createMaterial({name:e.name,category:e.category,map:c.map,normalMap:c.normalMap});const w=Ut.createAtmosphereMaterial(e.name);if(w){const T=((S=qt[e.name])==null?void 0:S.radiusScale)||1.012,A=new oe(T,48,36);v=new B(A,w),v.name=`${e.name.toLowerCase()}_atmosphere`,v.renderOrder=3,v.scale.set(a,a,a),i.add(v)}}const g=new B(n,d);if(g.name=`surface_${e.name}`,g.castShadow=e.category!=="star",g.receiveShadow=e.category!=="star",g.scale.set(a,a*s,a),i.add(g),e.name==="Saturn"){const A=new Ca(1.32,2.65,128,8),R=A.attributes.position,N=A.attributes.uv;for(let Z=0;Z<R.count;Z++){const se=R.getX(Z),te=R.getY(Z),re=(Math.sqrt(se*se+te*te)-1.32)/(2.65-1.32);N.setXY(Z,re,.5)}N.needsUpdate=!0;const U=c.ringAlphaMap||c.map,_=new I({uniforms:{ringMap:{value:U},saturnCenter:{value:new P},saturnRadius:{value:a}},vertexShader:`
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
        `,side:Ne,transparent:!0,depthWrite:!1});y=new B(A,_),y.name="saturn_rings",y.rotation.x=Math.PI*.5,y.renderOrder=3,y.scale.set(a,a,a),i.add(y)}return{definition:e,bodyGroup:i,surfaceMesh:g,nightMesh:m,cloudMesh:f,atmosphereMesh:v,ringMesh:y,glowMeshes:b.length>0?b:void 0,prominencesGroup:M,visualRadius:a}}}const F=class F{static eclipticToIcrf(e){const[i,a,t]=e,s=Math.cos(F.OBLIQUITY_J2000_RAD),o=Math.sin(F.OBLIQUITY_J2000_RAD);return[i,a*s-t*o,a*o+t*s]}static icrfToEcliptic(e){const[i,a,t]=e,s=Math.cos(F.OBLIQUITY_J2000_RAD),o=Math.sin(F.OBLIQUITY_J2000_RAD);return[i,a*s+t*o,-a*o+t*s]}static eclipticToThree(e){return[e[0],e[2],-e[1]]}static threeToEcliptic(e){return[e[0],-e[2],e[1]]}static icrfToThree(e){return F.eclipticToThree(F.icrfToEcliptic(e))}static raDecToIcrf(e,i){const a=e*Math.PI/180,t=i*Math.PI/180;return[Math.cos(t)*Math.cos(a),Math.cos(t)*Math.sin(a),Math.sin(t)]}static galacticBasisThree(){const e=F.icrfToThree(F.raDecToIcrf(F.NGP_RA_DEG,F.NGP_DEC_DEG)),i=F.icrfToThree(F.raDecToIcrf(F.GC_RA_DEG,F.GC_DEC_DEG)),a=i[0]*e[0]+i[1]*e[1]+i[2]*e[2],t=[i[0]-a*e[0],i[1]-a*e[1],i[2]-a*e[2]],s=Math.hypot(...t),o=[t[0]/s,t[1]/s,t[2]/s],r=[e[1]*o[2]-e[2]*o[1],e[2]*o[0]-e[0]*o[2],e[0]*o[1]-e[1]*o[0]];return{x:o,y:r,z:e}}};u(F,"OBLIQUITY_J2000_DEG",23.43929111),u(F,"OBLIQUITY_J2000_RAD",23.43929111*Math.PI/180),u(F,"NGP_RA_DEG",192.85948),u(F,"NGP_DEC_DEG",27.12825),u(F,"GC_RA_DEG",266.40499),u(F,"GC_DEC_DEG",-28.93617);let G=F;const ge=class ge{constructor(){u(this,"mode","exploration")}toRenderPosition(e,i){if(this.mode==="scientific"){const c=1/ge.SCIENTIFIC_KM_PER_UNIT,d=[e[0]*c,e[1]*c,e[2]*c];return G.eclipticToThree(d)}const a=Math.sqrt(e[0]*e[0]+e[1]*e[1]+e[2]*e[2]);if(a<1e3||!i||i.orderFromSun===0)return[0,0,0];const t=a/ge.AU_KM,s=bt(t),o=e[0]/a,r=e[1]/a,n=e[2]/a,l=[o*s,r*s,n*s];return G.eclipticToThree(l)}toMoonRenderPosition(e,i,a,t){if(this.mode==="scientific"){const m=1/ge.SCIENTIFIC_KM_PER_UNIT,f=[e[0]*m,e[1]*m,e[2]*m],v=G.eclipticToThree(f),y=Math.hypot(v[0],v[1],v[2]),M=this.getVisualRadius(t)*1.25+this.getVisualRadius(i);if(y>0&&y<M){const b=M/y;v[0]*=b,v[1]*=b,v[2]*=b}return[a[0]+v[0],a[1]+v[1],a[2]+v[2]]}const s=Math.sqrt(e[0]*e[0]+e[1]*e[1]+e[2]*e[2]);if(s<1)return a;const o=e[0]/s,r=e[1]/s,n=e[2]/s,l=G.eclipticToThree([o,r,n]),d=this.getVisualRadius(t)*(1.35+1.25*Math.log10(1+s/4e4));return[a[0]+l[0]*d,a[1]+l[1]*d,a[2]+l[2]*d]}getVisualRadius(e){if(this.mode==="scientific"){const i=e.physical.meanRadiusKm/ge.SCIENTIFIC_KM_PER_UNIT;return Math.max(.015,i*4)}return Zt(e)}};u(ge,"SCIENTIFIC_KM_PER_UNIT",1e6),u(ge,"AU_KM",1495978707e-1);let ve=ge;const ea=66743e-15,Ze=299792458,ta=198847e25,Mt=149597870700,aa=3085677581e7,ia=9460730472e6,sa=4297e3,di=12e3,oa=8.277,ui=.033,ra=oa*1e3*aa,mi=ra/ia,na=sa*ta,xe=2*ea*na/(Ze*Ze),pi=xe/1e3,gi=xe/Mt,la=1.5*xe,fi=la/1e3,st=3*Math.sqrt(3)/2*xe,vi=st/1e3,yi=st/Mt,xi=2*st/ra,wi=180*3600*1e6/Math.PI,bi=xi*wi,et=3*xe,Mi=et/1e3,Si=Math.sqrt(xe/(2*et)),J={name:"Sagittarius A*",designation:"CXOGC J174540.0-290028",classification:"Supermassive Black Hole (SMBH)",galacticCenter:{system:"Galactic Coordinate System (IAU 1958 / ICRF J2000)",longitudeDeg:359.944,latitudeDeg:-.046,rightAscensionJ2000:"17h 45m 40.0409s",declinationJ2000:"-29° 00′ 28.118″"},physicalConstants:{G:ea,c:Ze,solarMassKg:ta,auMeters:Mt,parsecMeters:aa,lightYearMeters:ia},measurements:{adoptedMassSolar:sa,massUncertaintySolar:di,adoptedDistanceKpc:oa,distanceUncertaintyKpc:ui,distanceLightYears:mi,spinParameterAStar:0,spinAssumption:"Adopted Schwarzschild metric (a* = 0) as physical baseline; Kerr prograde spin creates asymmetric shadow offset and reduces ISCO down to 1.0 r_s.",metricAdopted:"Schwarzschild Metric with Relativistic Null-Geodesic Integration",accretionDiskInclinationDeg:42},derivedParameters:{massKg:na,schwarzschildRadiusM:xe,schwarzschildRadiusKm:pi,schwarzschildRadiusAU:gi,photonSphereRadiusM:la,photonSphereRadiusKm:fi,shadowRadiusM:st,shadowRadiusKm:vi,shadowRadiusAU:yi,shadowAngularDiameterMicroArcsec:bi,iscoRadiusM:et,iscoRadiusKm:Mi,accretionDiskInnerRadiusM:et,accretionDiskOuterRadiusM:16*xe,iscoOrbitalSpeedFractionC:Si},sources:[{title:"First Sagittarius A* Event Horizon Telescope Results. I. The Shadow of the Supermassive Black Hole in the Center of the Milky Way",organization:"Event Horizon Telescope Collaboration",url:"https://www.jpl.nasa.gov/news/nasa-supports-event-horizon-telescope-in-studying-milky-ways-black-hole/",dateVerified:"2026-10-13",citation:"EHT Collaboration, 2022, ApJL, 930, L12. Measured shadow diameter: 51.8 +/- 2.3 microarcseconds."},{title:"The mass and distance of the Milky Way’s central black hole from stellar orbits",organization:"GRAVITY Collaboration (ESO / MPE)",url:"https://science.nasa.gov/universe/black-holes/",dateVerified:"2026-10-13",citation:"Abuter et al. (GRAVITY Collaboration), 2021, A&A, 647, A59. Mass: 4.297 +/- 0.012 x 10^6 M_sun, R_0: 8.277 +/- 0.033 kpc."},{title:"Black Hole Anatomy and Physics",organization:"NASA Astrophysics Science Division",url:"https://science.nasa.gov/universe/black-holes/anatomy/",dateVerified:"2026-10-13",citation:"NASA Science Directorate: Event horizon, photon ring, and relativistic accretion disk structure."},{title:"Simulation of Light Geodesics and Relativistic Ray Tracing Around a Supermassive Black Hole",organization:"NASA Goddard Space Flight Center (SVS 14619)",url:"https://svs.gsfc.nasa.gov/14619/",dateVerified:"2026-10-13",citation:"Jeremy Schnittman (NASA GSFC, July 2024): Relativistic ray-tracing, Doppler boosting, and gravitational lensing."},{title:"NASA’s Swift Catches X-ray Action at Milky Way’s Center",organization:"NASA Goddard Space Flight Center",url:"https://www.nasa.gov/news-release/nasas-swift-catches-x-ray-action-at-milky-ways-center/",dateVerified:"2026-10-13",citation:"Multiwavelength monitoring of Sgr A* accretion variability and relativistic flares."}]};J.measurements.adoptedMassSolar,J.measurements.massUncertaintySolar,J.measurements.adoptedDistanceKpc,J.measurements.distanceLightYears,J.derivedParameters.massKg;J.derivedParameters.schwarzschildRadiusKm,J.derivedParameters.schwarzschildRadiusAU,J.derivedParameters.photonSphereRadiusKm,J.derivedParameters.shadowRadiusKm,J.derivedParameters.shadowRadiusAU,J.derivedParameters.shadowAngularDiameterMicroArcsec,J.derivedParameters.iscoRadiusKm,J.derivedParameters.iscoOrbitalSpeedFractionC,J.derivedParameters.iscoOrbitalSpeedFractionC*(Ze/1e3);const ca={schwarzschildRadius:24,diskInnerRadius:72,diskOuterRadius:340,boundingRadius:520};class Pi{constructor(e=ca){u(this,"group",new ie);u(this,"boundingMesh");u(this,"sStarsPoints");u(this,"jetPolesGroup",new ie);u(this,"hitMesh");u(this,"config");u(this,"scientificData",J);u(this,"timeUniform",{value:0});u(this,"opacityUniform",{value:1});u(this,"cameraPosUniform",{value:new P});this.config=e,this.group.name="sagittarius_a_star_black_hole",this.boundingMesh=this.createRelativisticRayMarchMesh(),this.group.add(this.boundingMesh),this.sStarsPoints=this.createNuclearStarCluster(),this.group.add(this.sStarsPoints);const i=new oe(Math.max(3200,this.config.boundingRadius*2),16,16),a=new wt({visible:!1});this.hitMesh=new B(i,a),this.hitMesh.name="sagittarius_a_star_hit_target",this.group.add(this.hitMesh),this.createPolarOutflowJets(),this.jetPolesGroup.visible=!1,this.group.add(this.jetPolesGroup)}createRelativisticRayMarchMesh(){const e=new oe(this.config.boundingRadius,64,48),i=this.config.schwarzschildRadius,a=i*(3*Math.sqrt(3)/2),t=this.config.diskInnerRadius,s=this.config.diskOuterRadius,o=new I({uniforms:{uTime:this.timeUniform,uOpacity:this.opacityUniform,uCameraPosLocal:this.cameraPosUniform,uRs:{value:i},uRShadow:{value:a},uRIn:{value:t},uROut:{value:s},uBoundingR:{value:this.config.boundingRadius}},vertexShader:`
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
      `,transparent:!0,side:Ne,depthWrite:!1,blending:mt}),r=new B(e,o);return r.name="sagittarius_a_star_lensing_volume",r.renderOrder=50,r}createNuclearStarCluster(){const i=new Float32Array(1140),a=new Float32Array(380*3),t=new Float32Array(380),s=this.config.diskOuterRadius*1.08,o=this.config.boundingRadius*.96;for(let c=0;c<380;c++){const d=Math.random(),m=s+Math.pow(d,1.6)*(o-s),f=Math.random()*Math.PI*2,v=(Math.random()-.5)*Math.PI;i[c*3]=m*Math.cos(f)*Math.cos(v),i[c*3+1]=m*Math.sin(v),i[c*3+2]=m*Math.sin(f)*Math.cos(v);const y=Math.random();y<.45?(a[c*3]=.82,a[c*3+1]=.9,a[c*3+2]=1,t[c]=1.4+Math.random()*2.2):y<.75?(a[c*3]=.98,a[c*3+1]=.98,a[c*3+2]=1,t[c]=1.2+Math.random()*1.8):(a[c*3]=1,a[c*3+1]=.85,a[c*3+2]=.58,t[c]=1.5+Math.random()*2.5)}const r=new q;r.setAttribute("position",new k(i,3)),r.setAttribute("color",new k(a,3)),r.setAttribute("size",new k(t,1));const n=new I({uniforms:{uOpacity:this.opacityUniform,uTime:this.timeUniform},vertexShader:`
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
      `,vertexColors:!0,transparent:!0,blending:W,depthWrite:!1}),l=new de(r,n);return l.name="s_stars_nuclear_cluster",l}createPolarOutflowJets(){const a=new $e(65,720,1,32);a.translate(0,720*.5+this.config.schwarzschildRadius*.95,0);const t=new I({uniforms:{uTime:this.timeUniform,uOpacity:this.opacityUniform},vertexShader:`
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
      `,transparent:!0,side:Ne,blending:W,depthWrite:!1});[0,Math.PI*.25,Math.PI*.5,Math.PI*.75].forEach(o=>{const r=new B(a,t);r.rotation.y=o,this.jetPolesGroup.add(r);const n=a.clone();n.rotateZ(Math.PI);const l=new B(n,t);l.rotation.y=o,this.jetPolesGroup.add(l)})}update(e,i){this.timeUniform.value=i;const a=e.position.clone();this.group.worldToLocal(a),this.cameraPosUniform.value.copy(a),this.sStarsPoints&&(this.sStarsPoints.rotation.y=i*.015)}setOpacity(e){const i=Math.max(0,Math.min(1,e));this.opacityUniform.value=i,this.group.visible=i>.005}dispose(){this.boundingMesh.geometry.dispose(),this.boundingMesh.material.dispose(),this.sStarsPoints.geometry.dispose(),this.sStarsPoints.material.dispose(),this.jetPolesGroup.traverse(e=>{e instanceof B&&(e.geometry.dispose(),Array.isArray(e.material)?e.material.forEach(i=>i.dispose()):e.material.dispose())})}}const Pe=1320,Ai=8.277,Ti=.0208,Di={radius:28e3,coreRadius:4800,sunDistance:Ai*Pe};class Ce{constructor(e=Di){u(this,"group",new ie);u(this,"sagittariusAStar");u(this,"masterDiskMesh");u(this,"coreBulgeMesh");u(this,"dustExtinctionMesh");u(this,"starPoints");u(this,"satelliteGroup",new ie);u(this,"sunBeaconGroup",new ie);u(this,"sunReticleMesh");u(this,"sunPulseMesh");u(this,"sunRadarRing");u(this,"opacityUniform",{value:0});u(this,"timeUniform",{value:0});u(this,"bulgeFadeUniform",{value:1});u(this,"diskTextureUniform",{value:Ce.createEmptyTexture()});u(this,"diskTextureRequested",!1);u(this,"config");u(this,"sunWorldPosition",new P);this.config=e,this.group.name="milky_way_external_galaxy";const i=G.galacticBasisThree(),a=new fe().makeBasis(new P(...i.y).negate(),new P(...i.z),new P(...i.x).negate());this.group.quaternion.setFromRotationMatrix(a),this.masterDiskMesh=this.createMasterDisk(),this.group.add(this.masterDiskMesh),this.coreBulgeMesh=this.createVolumetricCore(),this.group.add(this.coreBulgeMesh),this.dustExtinctionMesh=this.createDustExtinction(),this.group.add(this.dustExtinctionMesh),this.starPoints=this.create3DStars(),this.group.add(this.starPoints),this.buildSatelliteGalaxies(),this.group.add(this.satelliteGroup);const{beaconGroup:t,reticleMesh:s,pulseMesh:o,radarRing:r,sunPos:n}=this.createSunBeacon();this.sunBeaconGroup=t,this.sunReticleMesh=s,this.sunPulseMesh=o,this.sunRadarRing=r,this.sunWorldPosition.copy(n),this.group.add(this.sunBeaconGroup),this.group.position.copy(n.clone().applyQuaternion(this.group.quaternion)).negate(),this.sagittariusAStar=new Pi,this.group.add(this.sagittariusAStar.group),this.setOpacity(0)}createMasterDisk(){const e=new $e(this.config.radius*2,this.config.radius*2,64,64);e.rotateX(-Math.PI*.5);const i=new I({uniforms:{uGalaxyMap:this.diskTextureUniform,uOpacity:this.opacityUniform,uBulgeFade:this.bulgeFadeUniform,uTime:this.timeUniform},vertexShader:`
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
      `,transparent:!0,side:Ne,depthWrite:!1,blending:mt}),a=new B(e,i);return a.name="milky_way_master_disk",a.renderOrder=-8,a}createVolumetricCore(){const e=new oe(this.config.coreRadius,32,24);e.scale(1,.42,.82);const i=new I({uniforms:{uOpacity:this.opacityUniform,uBulgeFade:this.bulgeFadeUniform,uTime:this.timeUniform},vertexShader:`
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
      `,transparent:!0,blending:W,depthWrite:!1,side:Fe}),a=new B(e,i);return a.name="galactic_volumetric_core",a.renderOrder=-7,a}createDustExtinction(){const e=new $e(this.config.radius*1.85,this.config.radius*1.85,48,48);e.rotateX(-Math.PI*.5);const i=new I({uniforms:{uGalaxyMap:this.diskTextureUniform,uOpacity:this.opacityUniform,uBulgeFade:this.bulgeFadeUniform},vertexShader:`
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
      `,transparent:!0,side:Ne,depthWrite:!1,blending:mt}),a=new B(e,i);return a.name="galactic_dust_extinction_sheet",a.position.y=80,a.renderOrder=-6,a}create3DStars(){const i=new Float32Array(42e3),a=new Float32Array(14e3*3),t=new Float32Array(14e3),s=this.config.radius,o=this.config.coreRadius;let r=0;const n=4e3;for(let v=0;v<n;v++){const y=Math.random(),M=Math.pow(y,1.6)*o,b=Math.random()*Math.PI*2,g=(Math.random()-.5)*Math.PI,S=M*Math.cos(b)*Math.cos(g)*1.15,w=M*Math.sin(b)*Math.cos(g)*.85,T=M*Math.sin(g)*.42;i[r*3]=S,i[r*3+1]=T,i[r*3+2]=w,Math.random()<.6?(a[r*3]=1,a[r*3+1]=.85,a[r*3+2]=.6):(a[r*3]=.98,a[r*3+1]=.7,a[r*3+2]=.4),t[r]=1+Math.random()*1.5,r++}const l=8e3;for(let v=0;v<l;v++){const y=Math.random(),M=o*.8+Math.pow(y,1.1)*(s*.9-o*.8),b=Math.random()*Math.PI*2,g=550+M/s*450,S=(Math.random()-.5+(Math.random()-.5))*g,w=Math.cos(b)*M,T=Math.sin(b)*M;i[r*3]=w,i[r*3+1]=S,i[r*3+2]=T;const A=Math.random();A<.28?(a[r*3]=.75,a[r*3+1]=.88,a[r*3+2]=1,t[r]=1.4+Math.random()*1.8):A<.38?(a[r*3]=1,a[r*3+1]=.52,a[r*3+2]=.78,t[r]=1.6+Math.random()*1.6):A<.72?(a[r*3]=.98,a[r*3+1]=.96,a[r*3+2]=.92,t[r]=.9+Math.random()*1.2):(a[r*3]=1,a[r*3+1]=.82,a[r*3+2]=.52,t[r]=1+Math.random()*1.4),r++}const c=2e3;for(let v=0;v<c;v++){const y=Math.random(),M=Math.pow(y,1.4)*(s*1.35),b=Math.random()*Math.PI*2,g=(Math.random()-.5)*Math.PI;i[r*3]=M*Math.cos(b)*Math.cos(g),i[r*3+1]=M*Math.sin(g)*.7,i[r*3+2]=M*Math.sin(b)*Math.cos(g),a[r*3]=.92,a[r*3+1]=.9,a[r*3+2]=.95,t[r]=.8+Math.random()*1,r++}const d=new q;d.setAttribute("position",new k(i,3)),d.setAttribute("color",new k(a,3)),d.setAttribute("size",new k(t,1));const m=new I({uniforms:{uOpacity:this.opacityUniform,uTime:this.timeUniform},vertexShader:`
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
      `,vertexColors:!0,transparent:!0,blending:W,depthWrite:!1}),f=new de(d,m);return f.name="galactic_3d_stars",f.renderOrder=-5,f}static createEmptyTexture(){const e=new Ra(new Uint8Array([0,0,0,0]),1,1,Ea);return e.needsUpdate=!0,e}static galactocentricToLocal(e,i,a){return new P(-i,a,-e).multiplyScalar(Pe)}buildSatelliteGalaxies(){const e=this.createDwarfGalaxy("large_magellanic_cloud",Ce.galactocentricToLocal(-.71,-40.95,-26.93),4*Pe,new E(13822207),450);this.satelliteGroup.add(e);const i=this.createDwarfGalaxy("small_magellanic_cloud",Ce.galactocentricToLocal(15.93,-37.57,-43.61),2*Pe,new E(14741247),220);this.satelliteGroup.add(i);const a=this.createDwarfGalaxy("sagittarius_dwarf_spheroidal",Ce.galactocentricToLocal(17.29,2.51,-6.48),2.5*Pe,new E(16770756),280);this.satelliteGroup.add(a)}createDwarfGalaxy(e,i,a,t,s){const o=new ie;o.name=e,o.position.copy(i);const r=new oe(a,24,16);r.scale(1.25,.55,.95);const n=new I({uniforms:{uOpacity:this.opacityUniform,uColor:{value:t}},vertexShader:`
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
      `,transparent:!0,blending:W,depthWrite:!1,side:Fe}),l=new B(r,n);l.renderOrder=-9,o.add(l);const c=new q,d=new Float32Array(s*3);for(let v=0;v<s;v++){const y=Math.random(),M=Math.pow(y,1.8)*a,b=Math.random()*Math.PI*2,g=(Math.random()-.5)*Math.PI;d[v*3]=M*Math.cos(b)*Math.cos(g)*1.25,d[v*3+1]=M*Math.sin(g)*.55,d[v*3+2]=M*Math.sin(b)*Math.cos(g)}c.setAttribute("position",new k(d,3));const m=new zt({color:t,size:1.2,transparent:!0,opacity:.55,blending:W,depthWrite:!1}),f=new de(c,m);return o.add(f),o}createSunBeacon(){const e=new ie;e.name="sun_orion_spur_beacon";const i=this.config.sunDistance,a=Ti*Pe,t=new P(0,a,i);e.position.copy(t);const s=new q,o=64,r=[],n=450;for(let A=0;A<=o;A++){const R=A/o*Math.PI*2;r.push(new P(Math.cos(R)*n,0,Math.sin(R)*n))}s.setFromPoints(r);const l=new Be({color:16766720,transparent:!0,opacity:.9}),c=new Ee(s,l);e.add(c);const d=new q,m=[],f=750;for(let A=0;A<=o;A++){const R=A/o*Math.PI*2;m.push(new P(Math.cos(R)*f,0,Math.sin(R)*f))}d.setFromPoints(m);const v=new Ot({color:16771704,dashSize:40,gapSize:25,transparent:!0,opacity:.65}),y=new Ee(d,v);y.computeLineDistances(),e.add(y);const M=new oe(180,16,12),b=new wt({color:16771976,transparent:!0,opacity:.95,blending:W}),g=new B(M,b);e.add(g);const S=new q().setFromPoints([new P(0,-a,0),new P(0,0,0)]),w=new Ot({color:16769138,dashSize:22,gapSize:15,transparent:!0,opacity:.55}),T=new Ee(S,w);return T.computeLineDistances(),e.add(T),{beaconGroup:e,reticleMesh:c,pulseMesh:g,radarRing:y,sunPos:t}}getGalacticCenterWorldPosition(e=new P){return this.group.updateWorldMatrix(!0,!1),this.group.getWorldPosition(e)}setOpacity(e){const i=Math.max(0,Math.min(1,e));if(this.opacityUniform.value=i,this.group.visible=i>.005,this.group.visible&&!this.diskTextureRequested){this.diskTextureRequested=!0;const a=He.getInstance().getMilkyWayDiskTexture();a.wrapS=O,a.wrapT=O,this.diskTextureUniform.value=a}this.sagittariusAStar&&this.sagittariusAStar.setOpacity(i),this.sunReticleMesh&&(this.sunReticleMesh.material.opacity=i*.9),this.sunRadarRing&&(this.sunRadarRing.material.opacity=i*.65),this.sunPulseMesh&&(this.sunPulseMesh.material.opacity=i*.95)}update(e,i){if(this.timeUniform.value=e,this.sagittariusAStar&&i){this.sagittariusAStar.update(i,e);const a=i.position.clone();this.group.worldToLocal(a);const t=a.length(),s=L.clamp((t-450)/2200,0,1);this.bulgeFadeUniform.value=s}if(this.sunPulseMesh&&this.group.visible){const a=1+.22*Math.sin(e*3.5);this.sunPulseMesh.scale.set(a,a,a)}this.sunReticleMesh&&this.group.visible&&(this.sunReticleMesh.rotation.y=e*.35),this.sunRadarRing&&this.group.visible&&(this.sunRadarRing.rotation.y=-e*.22)}dispose(){this.sagittariusAStar.dispose(),this.masterDiskMesh.geometry.dispose(),this.masterDiskMesh.material.dispose(),this.coreBulgeMesh.geometry.dispose(),this.coreBulgeMesh.material.dispose(),this.dustExtinctionMesh.geometry.dispose(),this.dustExtinctionMesh.material.dispose(),this.starPoints.geometry.dispose(),this.starPoints.material.dispose(),this.sunReticleMesh.geometry.dispose(),this.sunReticleMesh.material.dispose(),this.sunRadarRing.geometry.dispose(),this.sunRadarRing.material.dispose(),this.sunPulseMesh.geometry.dispose(),this.sunPulseMesh.material.dispose(),this.satelliteGroup.traverse(e=>{(e instanceof B||e instanceof de)&&(e.geometry.dispose(),Array.isArray(e.material)?e.material.forEach(i=>i.dispose()):e.material.dispose())})}}class Ci{constructor(){u(this,"mesh");u(this,"count",700);u(this,"positions");u(this,"colors");u(this,"relativePositions");u(this,"radius",110);u(this,"currentSpeed",0);this.positions=new Float32Array(this.count*2*3),this.colors=new Float32Array(this.count*2*3),this.relativePositions=new Float32Array(this.count*3);for(let a=0;a<this.count;a++){const t=Math.random(),s=(.2+.8*Math.cbrt(t))*this.radius,o=Math.random()*Math.PI*2,r=Math.acos(2*Math.random()-1);this.relativePositions[a*3]=s*Math.sin(r)*Math.cos(o),this.relativePositions[a*3+1]=s*Math.sin(r)*Math.sin(o),this.relativePositions[a*3+2]=s*Math.cos(r)}const e=new q;e.setAttribute("position",new k(this.positions,3)),e.setAttribute("color",new k(this.colors,3));const i=new Be({vertexColors:!0,transparent:!0,blending:W,depthWrite:!1});this.mesh=new Vt(e,i),this.mesh.name="velocity_travel_particles",this.mesh.frustumCulled=!1}update(e,i,a,t){const s=i.length(),o=s+Math.abs(a)*45;this.currentSpeed+=(o-this.currentSpeed)*Math.min(1,t*8);const r=this.currentSpeed>.8,n=Math.min(28,this.currentSpeed*.16+Math.abs(a)*14),l=Math.min(.85,Math.max(.08,(this.currentSpeed-.5)*.08));let c=0,d=0,m=-1;s>.01?(c=-i.x/s,d=-i.y/s,m=-i.z/s):Math.abs(a)>.01&&(m=a>0?1:-1);const f=this.mesh.geometry.attributes.position,v=this.mesh.geometry.attributes.color,y=this.radius*2,M=this.radius;for(let b=0;b<this.count;b++){const g=b*3,S=b*6,w=b*6+3;r&&(this.relativePositions[g]+=c*this.currentSpeed*t*.5,this.relativePositions[g+1]+=d*this.currentSpeed*t*.5,this.relativePositions[g+2]+=m*this.currentSpeed*t*.5);for(let _=0;_<3;_++)this.relativePositions[g+_]>M?this.relativePositions[g+_]-=y:this.relativePositions[g+_]<-M&&(this.relativePositions[g+_]+=y);const T=e.x+this.relativePositions[g],A=e.y+this.relativePositions[g+1],R=e.z+this.relativePositions[g+2];this.positions[S]=T,this.positions[S+1]=A,this.positions[S+2]=R,n>.4?(this.positions[w]=T+c*n,this.positions[w+1]=A+d*n,this.positions[w+2]=R+m*n):(this.positions[w]=T+.05,this.positions[w+1]=A+.05,this.positions[w+2]=R+.05);const N=l*1.2,U=l*.15;this.colors[S]=.88*N,this.colors[S+1]=.92*N,this.colors[S+2]=1*N,this.colors[w]=.65*U,this.colors[w+1]=.8*U,this.colors[w+2]=.95*U}f.needsUpdate=!0,v.needsUpdate=!0}dispose(){this.mesh.geometry.dispose(),this.mesh.material.dispose()}}const Ri=[[54061,53910],[53910,58001],[58001,59774],[59774,54061],[59774,62956],[62956,65378],[65378,67301],[27989,25336],[27989,26207],[25336,26207],[27989,26727],[25336,25930],[25930,26311],[26311,26727],[26727,27366],[25930,24436],[746,3179],[3179,4427],[4427,6686],[6686,8886],[60718,61084],[62434,59747],[102098,100453],[100453,95947],[102488,100453],[100453,97165],[49669,50583],[50583,50335],[50335,48455],[50583,54872],[54872,57632],[57632,54879],[54879,49669],[80763,78820],[78820,78401],[80763,82396],[82396,86228],[86228,85927],[32349,30324],[32349,33579],[33579,34444],[34444,35904],[91262,91971],[91971,92420],[92420,93194],[93194,92791],[92791,91971]],$=class ${constructor(){u(this,"group",new ie);u(this,"celestialGroup",new ie);u(this,"pointsMesh");u(this,"localInterstellarStars");u(this,"constellationLines");u(this,"milkyWayMesh");u(this,"milkyWayOpacityUniform",{value:1});u(this,"resolvedMilkyWay");u(this,"stardustMesh");u(this,"externalGalaxy");u(this,"travelParticles");u(this,"isLoaded",!1);u(this,"localStarsOpacity",{value:0});this.group.name="starfield_hipparcos",this.group.add(this.celestialGroup),this.celestialGroup.name="celestial_infinite_sphere",this.buildMilkyWayBackground(),this.buildResolvedMilkyWayStars(),this.build3DCosmicStardust(),this.externalGalaxy=new Ce,this.group.add(this.externalGalaxy.group),this.travelParticles=new Ci,this.group.add(this.travelParticles.mesh),this.loadCatalog()}buildMilkyWayBackground(){const e=new oe($.SPHERE_RADIUS*1.05,64,48),i=He.getInstance().getMilkyWayTexture(),a=new I({uniforms:{milkyWayMap:{value:i},uOpacity:this.milkyWayOpacityUniform},vertexShader:`
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
      `,side:Fe,transparent:!0,depthWrite:!1});this.milkyWayMesh=new B(e,a),this.milkyWayMesh.name="milky_way_skybox",this.milkyWayMesh.renderOrder=-10;const t=G.galacticBasisThree(),s=new fe().makeBasis(new P(...t.x),new P(...t.z),new P(...t.y).negate());this.milkyWayMesh.quaternion.setFromRotationMatrix(s),this.celestialGroup.add(this.milkyWayMesh)}buildResolvedMilkyWayStars(e=26e3){if(typeof document>"u")return;const i="/solaris/".replace(/\/?$/,"/");new Na().load(`${i}textures/gaia_sky.webp`,a=>{const o=document.createElement("canvas");o.width=1024,o.height=512;const r=o.getContext("2d",{willReadFrequently:!0});if(!r)return;r.drawImage(a,0,0,1024,512);const n=r.getImageData(0,0,1024,512).data,l=new Float64Array(1024*512);let c=0;for(let w=0;w<512;w++){const T=Math.cos((.5-(w+.5)/512)*Math.PI);for(let A=0;A<1024;A++){const R=(w*1024+A)*4,N=(.2126*n[R]+.7152*n[R+1]+.0722*n[R+2])/255;c+=Math.pow(Math.max(0,N-.07),2.2)*T,l[w*1024+A]=c}}if(c<=0)return;const d=G.galacticBasisThree(),m=new Float32Array(e*3),f=new Float32Array(e*3),v=new Float32Array(e);let y=1592594996;const M=()=>{y=y+1831565813>>>0;let w=y;return w=Math.imul(w^w>>>15,w|1),w^=w+Math.imul(w^w>>>7,w|61),((w^w>>>14)>>>0)/4294967296},b=$.SPHERE_RADIUS*.996;for(let w=0;w<e;w++){const T=M()*c;let A=0,R=l.length-1;for(;A<R;){const pe=A+R>>>1;l[pe]<T?A=pe+1:R=pe}const N=A%1024,U=A/1024|0,_=(N+M())/1024,Z=(U+M())/512,se=(.5-_)*2*Math.PI,te=(.5-Z)*Math.PI,ue=Math.cos(te)*Math.cos(se),re=Math.cos(te)*Math.sin(se),be=Math.sin(te);m[w*3]=(d.x[0]*ue+d.y[0]*re+d.z[0]*be)*b,m[w*3+1]=(d.x[1]*ue+d.y[1]*re+d.z[1]*be)*b,m[w*3+2]=(d.x[2]*ue+d.y[2]*re+d.z[2]*be)*b;const ae=A*4,ne=Math.max(n[ae],n[ae+1],n[ae+2],1),me=.55;f[w*3]=n[ae]/ne*(1-me)+me,f[w*3+1]=n[ae+1]/ne*(1-me)+me,f[w*3+2]=n[ae+2]/ne*(1-me)+me,v[w]=.55+Math.pow(M(),6)*1.6}const g=new q;g.setAttribute("position",new k(m,3)),g.setAttribute("color",new k(f,3)),g.setAttribute("size",new k(v,1));const S=new I({uniforms:{uOpacity:this.milkyWayOpacityUniform},vertexShader:`
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
        `,vertexColors:!0,transparent:!0,blending:W,depthWrite:!1});this.resolvedMilkyWay=new de(g,S),this.resolvedMilkyWay.name="resolved_milky_way_stars",this.resolvedMilkyWay.renderOrder=-9,this.celestialGroup.add(this.resolvedMilkyWay)})}build3DCosmicStardust(){const i=new Float32Array(2400),a=new Float32Array(800*3),t=new Float32Array(800),s=new Float32Array(800);for(let n=0;n<800;n++){const l=30+Math.pow(Math.random(),.7)*750,c=Math.random()*Math.PI*2,d=(Math.random()-.5)*(90+l*.1);i[n*3]=Math.cos(c)*l,i[n*3+1]=d,i[n*3+2]=Math.sin(c)*l;const m=Math.random();m<.5?(a[n*3]=.9,a[n*3+1]=.92,a[n*3+2]=.98):m<.8?(a[n*3]=.98,a[n*3+1]=.85,a[n*3+2]=.6):(a[n*3]=.65,a[n*3+1]=.85,a[n*3+2]=.98),t[n]=1+Math.random()*1.5,s[n]=Math.random()*Math.PI*2}const o=new q;o.setAttribute("position",new k(i,3)),o.setAttribute("color",new k(a,3)),o.setAttribute("aScale",new k(t,1)),o.setAttribute("aPhase",new k(s,1));const r=new I({uniforms:{time:{value:0}},vertexShader:`
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
      `,vertexColors:!0,transparent:!0,blending:W,depthWrite:!1});this.stardustMesh=new de(o,r),this.stardustMesh.name="cosmic_stardust_motes",this.stardustMesh.renderOrder=-2,this.group.add(this.stardustMesh)}async loadCatalog(){try{const e="/solaris/".replace(/\/?$/,"/"),i=await fetch(`${e}data/stars.json`);if(!i.ok)throw new Error(`Failed to fetch stars.json: HTTP ${i.status}`);const a=await i.json();this.buildStarfieldMesh(a),this.buildConstellations(a),this.isLoaded=!0}catch(e){console.warn("Could not stream Hipparcos stars dataset, using procedural fallback:",e),this.buildProceduralFallback()}}buildStarfieldMesh(e){const i=e.stars.filter(f=>f[4]<=4.6),a=i.length,t=new Float32Array(a*3),s=new Float32Array(a*3),o=new Float32Array(a),r=$.SPHERE_RADIUS;for(let f=0;f<a;f++){const v=i[f],y=v[1],M=v[2],b=v[3],g=v[4],S=v[5],w=G.icrfToThree([y,M,b]);t[f*3]=w[0]*r,t[f*3+1]=w[1]*r,t[f*3+2]=w[2]*r;const T=this.bvToRGB(S,v[8]);s[f*3]=T.r,s[f*3+1]=T.g,s[f*3+2]=T.b;const A=Math.max(.6,2.8-.42*g);o[f]=A}const n=new q;n.setAttribute("position",new k(t,3)),n.setAttribute("color",new k(s,3)),n.setAttribute("size",new k(o,1));const l=`
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
    `,c=`
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
    `,d=new I({vertexShader:l,fragmentShader:c,vertexColors:!0,transparent:!0,blending:W,depthWrite:!1});this.pointsMesh=new de(n,d),this.pointsMesh.renderOrder=0,this.celestialGroup.add(this.pointsMesh);const m=e.stars.filter(f=>f[6]!==null&&f[6]>0&&f[6]<120);if(m.length>0){const f=new Float32Array(m.length*3),v=new Float32Array(m.length*3),y=new Float32Array(m.length);for(let g=0;g<m.length;g++){const S=m[g],w=$.LOCAL_STAR_OFFSET+S[6]*$.LOCAL_UNITS_PER_PC,T=G.icrfToThree([S[1],S[2],S[3]]);f[g*3]=T[0]*w,f[g*3+1]=T[1]*w,f[g*3+2]=T[2]*w;const A=this.bvToRGB(S[5],S[8]);v[g*3]=A.r,v[g*3+1]=A.g,v[g*3+2]=A.b;const R=S[4];y[g]=Math.max(.8,2.6-.3*R)}const M=new q;M.setAttribute("position",new k(f,3)),M.setAttribute("color",new k(v,3)),M.setAttribute("size",new k(y,1));const b=new I({vertexShader:`
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
`+c.replace("gl_FragColor = vec4(vColor, alpha);","gl_FragColor = vec4(vColor, alpha * uOpacity);"),uniforms:{uOpacity:this.localStarsOpacity},vertexColors:!0,transparent:!0,blending:W,depthWrite:!1});this.localInterstellarStars=new de(M,b),this.localInterstellarStars.visible=!1,this.localInterstellarStars.name="local_interstellar_3d_stars",this.localInterstellarStars.renderOrder=1,this.group.add(this.localInterstellarStars)}}buildConstellations(e){const i=new Map,a=$.SPHERE_RADIUS*.998;for(const r of e.stars){const n=G.icrfToThree([r[1],r[2],r[3]]);i.set(r[0],[n[0]*a,n[1]*a,n[2]*a])}const t=[];for(const[r,n]of Ri){const l=i.get(r),c=i.get(n);l&&c&&(t.push(l[0],l[1],l[2]),t.push(c[0],c[1],c[2]))}if(t.length===0)return;const s=new q;s.setAttribute("position",new pt(t,3));const o=new Be({color:5231045,transparent:!0,opacity:$.CONSTELLATION_OPACITY,depthWrite:!1,blending:W});this.constellationLines=new Vt(s,o),this.constellationLines.name="constellation_lines",this.celestialGroup.add(this.constellationLines)}bvToRGB(e,i){if(e!==null)return e<-.1?new E(10335487):e<.15?new E(12374783):e<.35?new E(15791359):e<.6?new E(16775144):e<.85?new E(16770723):e<1.3?new E(16760437):new E(16747093);switch(i){case"O":return new E(10335487);case"B":return new E(12374783);case"A":return new E(15791359);case"F":return new E(16775144);case"G":return new E(16770723);case"K":return new E(16760437);case"M":return new E(16747093);default:return new E(16777215)}}buildProceduralFallback(){const i=new q,a=new Float32Array(6e3*3),t=new Float32Array(6e3*3),s=$.SPHERE_RADIUS;for(let r=0;r<6e3;r++){const n=Math.random()*Math.PI*2,l=Math.acos(Math.random()*2-1);a[r*3]=s*Math.sin(l)*Math.cos(n),a[r*3+1]=s*Math.cos(l),a[r*3+2]=s*Math.sin(l)*Math.sin(n),t[r*3]=.9,t[r*3+1]=.92,t[r*3+2]=1}i.setAttribute("position",new k(a,3)),i.setAttribute("color",new k(t,3));const o=new zt({size:2.5,vertexColors:!0,transparent:!0,opacity:.85});this.pointsMesh=new de(i,o),this.celestialGroup.add(this.pointsMesh)}update(e,i,a,t,s){this.celestialGroup.position.copy(e);const o=e.length(),r=this.externalGalaxy.getGalacticCenterWorldPosition(),n=e.distanceTo(r),l=L.clamp((o-3500)/18500,0,1),c=n<8e3?L.clamp((8e3-n)/4e3,0,1):0,d=Math.max(l,c),m=d*d*(3-2*d);if(this.externalGalaxy.setOpacity(m),this.milkyWayOpacityUniform.value=1-m,this.constellationLines&&(this.constellationLines.material.opacity=$.CONSTELLATION_OPACITY*(1-m)),this.localInterstellarStars){const f=L.smoothstep(o,700,1600),v=1-L.smoothstep(o,9e3,2e4),y=f*v;this.localStarsOpacity.value=y,this.localInterstellarStars.visible=y>.005}this.externalGalaxy.update(performance.now()*.001,s),this.travelParticles.update(e,a||new P,t||0,i)}setConstellationsVisible(e){this.constellationLines&&(this.constellationLines.visible=e)}toggleConstellations(){return this.constellationLines?(this.constellationLines.visible=!this.constellationLines.visible,this.constellationLines.visible):!1}areConstellationsVisible(){var e;return((e=this.constellationLines)==null?void 0:e.visible)??!0}dispose(){this.externalGalaxy.dispose(),this.travelParticles.dispose(),this.localInterstellarStars&&(this.localInterstellarStars.geometry.dispose(),this.localInterstellarStars.material.dispose()),this.milkyWayMesh&&(this.milkyWayMesh.geometry.dispose(),this.milkyWayMesh.material.dispose()),this.pointsMesh&&(this.pointsMesh.geometry.dispose(),this.pointsMesh.material.dispose()),this.constellationLines&&(this.constellationLines.geometry.dispose(),this.constellationLines.material.dispose()),this.stardustMesh&&(this.stardustMesh.geometry.dispose(),this.stardustMesh.material.dispose()),this.resolvedMilkyWay&&(this.resolvedMilkyWay.geometry.dispose(),this.resolvedMilkyWay.material.dispose())}};u($,"SPHERE_RADIUS",8500),u($,"LOCAL_STAR_OFFSET",700),u($,"CONSTELLATION_OPACITY",.38),u($,"LOCAL_UNITS_PER_PC",38);let Ge=$;const _t={Sun:{targetCoverageY:.85,ndcOffsetX:-.28,ndcOffsetY:0,fov:42,preferredElevation:Math.PI*.35},Mercury:{targetCoverageY:.92,ndcOffsetX:-.34,ndcOffsetY:0,fov:40,preferredElevation:Math.PI*.38},Venus:{targetCoverageY:.92,ndcOffsetX:-.34,ndcOffsetY:0,fov:40,preferredElevation:Math.PI*.38},Earth:{targetCoverageY:.94,ndcOffsetX:-.35,ndcOffsetY:0,fov:40,preferredElevation:Math.PI*.37},Mars:{targetCoverageY:.92,ndcOffsetX:-.34,ndcOffsetY:0,fov:40,preferredElevation:Math.PI*.38},Jupiter:{targetCoverageY:1.08,ndcOffsetX:-.38,ndcOffsetY:0,fov:41,preferredElevation:Math.PI*.39},Saturn:{targetCoverageY:.88,ndcOffsetX:-.28,ndcOffsetY:0,fov:41,effectiveRadiusMultiplier:1.95,preferredElevation:Math.PI*.32},Uranus:{targetCoverageY:.92,ndcOffsetX:-.34,ndcOffsetY:0,fov:40,preferredElevation:Math.PI*.38},Neptune:{targetCoverageY:.92,ndcOffsetX:-.34,ndcOffsetY:0,fov:40,preferredElevation:Math.PI*.38},Pluto:{targetCoverageY:.9,ndcOffsetX:-.32,ndcOffsetY:0,fov:39,preferredElevation:Math.PI*.38},"Sagittarius A*":{targetCoverageY:.88,ndcOffsetX:.22,ndcOffsetY:-.02,fov:40,preferredElevation:Math.PI*.42}},dt={targetCoverageY:.92,ndcOffsetX:-.34,ndcOffsetY:0,fov:40,preferredElevation:Math.PI*.38},Ei={targetCoverageY:.88,ndcOffsetX:-.33,ndcOffsetY:0,fov:39,preferredElevation:Math.PI*.38},Ft=55,Ni=2.12,Ii=6371;function Oi(p,e=1.25){const i=1+Ni*Math.sqrt(Ii/Math.max(.001,p));return Math.max(e,i)}const Q=class Q{constructor(e){u(this,"camera");u(this,"subjectAnchor",new P(0,0,0));u(this,"orbitPivot",new P(0,0,0));u(this,"aimPoint",new P(0,0,0));u(this,"currentNdcOffset",new X(-.34,0));u(this,"targetNdcOffset",new X(-.34,0));u(this,"shotMode","cinematic_observation");u(this,"effectiveAnchor",new P(0,0,0));u(this,"currentVelocity",new P(0,0,0));u(this,"lastCameraPos",new P(0,0,0));u(this,"lastRadius",680);u(this,"zoomRate",0);u(this,"lastUpdateTime",performance.now());u(this,"hasMotionSample",!1);u(this,"motionBasis","relative");u(this,"tmpRelPos",new P);u(this,"spherical",new Te(680,Math.PI*.3,Math.PI*.25));u(this,"targetSpherical",new Te(680,Math.PI*.3,Math.PI*.25));u(this,"panOffset",new P(0,0,0));u(this,"targetPanOffset",new P(0,0,0));u(this,"focusedObject",null);u(this,"focusDistance",30);u(this,"focusedRadius",2.8);u(this,"focusedPhysicalRadiusKm",null);u(this,"distanceModel","exploration");u(this,"transition",null);u(this,"isOrbiting",!1);u(this,"isPanning",!1);u(this,"previousMousePosition",{x:0,y:0});u(this,"lastInteractionTime",performance.now());u(this,"activeTouches",new Map);u(this,"initialPinchDist",0);u(this,"initialRadiusOnPinch",0);u(this,"enableIdleDrift",!0);u(this,"damping",.12);u(this,"lookYaw",0);u(this,"lookPitch",0);u(this,"targetLookYaw",0);u(this,"targetLookPitch",0);u(this,"isLooking",!1);u(this,"heldLookKeys",new Set);u(this,"lastLookUpdate",performance.now());u(this,"domElement");u(this,"onMouseDown",e=>{if(this.lastInteractionTime=performance.now(),this.transition){this.transition=null;const i=new P().subVectors(this.camera.position,this.orbitPivot);this.spherical.setFromVector3(i),this.targetSpherical.copy(this.spherical)}e.button===0?e.shiftKey?this.isPanning=!0:this.isOrbiting=!0:e.button===1?this.isPanning=!0:e.button===2&&(this.isLooking=!0),this.previousMousePosition={x:e.clientX,y:e.clientY}});u(this,"onMouseUp",()=>{this.isOrbiting=!1,this.isPanning=!1,this.isLooking=!1,this.lastInteractionTime=performance.now()});u(this,"onMouseMove",e=>{if(this.lastInteractionTime=performance.now(),!this.isOrbiting&&!this.isPanning&&!this.isLooking)return;const i=e.clientX-this.previousMousePosition.x,a=e.clientY-this.previousMousePosition.y;if(this.previousMousePosition={x:e.clientX,y:e.clientY},this.isLooking){const t=L.degToRad(this.camera.fov)/Math.max(1,this.domElement.clientHeight||800);this.targetLookYaw+=i*t,this.targetLookPitch+=a*t;return}if(this.isOrbiting)this.targetSpherical.theta-=i*.005,this.targetSpherical.phi-=a*.005,this.targetSpherical.phi=Math.max(.02,Math.min(Math.PI-.02,this.targetSpherical.phi));else if(this.isPanning){const t=this.spherical.radius*.001,s=new P,o=new P;this.camera.matrixWorld.extractBasis(s,o,new P),this.targetPanOffset.addScaledVector(s,-i*t),this.targetPanOffset.addScaledVector(o,a*t)}});u(this,"onWheel",e=>{if(e.preventDefault(),this.lastInteractionTime=performance.now(),this.transition){this.transition=null;const o=new P().subVectors(this.camera.position,this.orbitPivot);this.spherical.setFromVector3(o),this.targetSpherical.copy(this.spherical)}const i=Math.pow(.92,e.deltaY*.012),t=this.focusedObject&&(this.focusedObject.name.includes("sagittarius")||this.focusedObject.name==="Sagittarius A*")?65:this.focusedObject?this.focusedRadius*1.15:.35,s=18e4;this.targetSpherical.radius=Math.max(t,Math.min(s,this.targetSpherical.radius*i))});u(this,"onContextMenu",e=>{e.preventDefault()});u(this,"onTouchStart",e=>{if(this.lastInteractionTime=performance.now(),this.transition){this.transition=null;const i=new P().subVectors(this.camera.position,this.orbitPivot);this.spherical.setFromVector3(i),this.targetSpherical.copy(this.spherical)}for(let i=0;i<e.changedTouches.length;i++){const a=e.changedTouches[i];this.activeTouches.set(a.identifier,{x:a.clientX,y:a.clientY})}if(this.activeTouches.size===2){const i=Array.from(this.activeTouches.values());this.initialPinchDist=Math.hypot(i[0].x-i[1].x,i[0].y-i[1].y),this.initialRadiusOnPinch=this.targetSpherical.radius}});u(this,"onTouchMove",e=>{if(this.lastInteractionTime=performance.now(),this.activeTouches.size===1&&e.touches.length===1){const i=e.touches[0],a=this.activeTouches.get(i.identifier);if(a){const t=i.clientX-a.x,s=i.clientY-a.y;this.targetSpherical.theta-=t*.006,this.targetSpherical.phi-=s*.006,this.targetSpherical.phi=Math.max(.02,Math.min(Math.PI-.02,this.targetSpherical.phi)),this.activeTouches.set(i.identifier,{x:i.clientX,y:i.clientY})}}else if(this.activeTouches.size>=2&&e.touches.length>=2){const i=[e.touches[0],e.touches[1]],a=Math.hypot(i[0].clientX-i[1].clientX,i[0].clientY-i[1].clientY);if(this.initialPinchDist>0){const t=this.initialPinchDist/a,o=this.focusedObject&&(this.focusedObject.name.includes("sagittarius")||this.focusedObject.name==="Sagittarius A*")?65:this.focusedObject?this.focusedRadius*1.15:.35;this.targetSpherical.radius=Math.max(o,Math.min(18e4,this.initialRadiusOnPinch*t))}}});u(this,"onTouchEnd",e=>{this.lastInteractionTime=performance.now();for(let i=0;i<e.changedTouches.length;i++)this.activeTouches.delete(e.changedTouches[i].identifier);this.activeTouches.size<2&&(this.initialPinchDist=0)});u(this,"onKeyDown",e=>{if(!Q.LOOK_KEYS.has(e.key))return;const i=e.target;i&&(i.tagName==="INPUT"||i.tagName==="TEXTAREA"||i.isContentEditable)||(e.preventDefault(),this.heldLookKeys.add(e.key))});u(this,"onKeyUp",e=>{this.heldLookKeys.delete(e.key)});u(this,"onWindowBlur",()=>{this.heldLookKeys.clear(),this.isLooking=!1});u(this,"onDoubleClick",()=>{this.resetLook()});this.domElement=e,this.camera=new Ia(45,e.clientWidth/e.clientHeight,.05,16e4),this.updateCameraPosition(),this.setupEventListeners(e)}static calculateViewingDistance(e,i,a=i.fov){const t=e*(i.effectiveRadiusMultiplier||1),s=L.degToRad(a*.5),o=Math.tan(s),r=Math.max(.1,i.targetCoverageY),n=t/(r*o);return Math.max(t*1.15,n)}getResponsiveNdcOffset(e,i,a){let t=e,s=i;if(a>=1.5)t=e,s=i;else if(a>=1){const o=(a-1)/.5;t=e*(.45+.55*o),s=i}else t=e*.15,s=-.1;return{x:t,y:s}}calculateAimPoint(e,i,a,t,s,o){if(Math.abs(a)<.001&&Math.abs(t)<.001)return i.clone();const r=new P().subVectors(i,e),n=r.length();if(n<.001)return i.clone();const l=r.clone().divideScalar(n),c=new P(0,1,0);let d=new P().crossVectors(l,c);d.lengthSq()<1e-4&&(d=new P().crossVectors(l,new P(0,0,1))),d.normalize();const m=new P().crossVectors(d,l).normalize(),f=this.getResponsiveNdcOffset(a,t,o),v=L.degToRad(s*.5),y=Math.tan(v),M=o*y,b=f.x*n*M,g=f.y*n*y;return new P().copy(i).addScaledVector(d,-b).addScaledVector(m,-g)}updateCameraPosition(){if(this.transition){const o=performance.now()-this.transition.startTime,r=Math.min(1,o/this.transition.durationMs),n=r<.5?16*Math.pow(r,5):1-Math.pow(-2*r+2,5)/2;this.transition.targetObject?(this.transition.targetObject.updateWorldMatrix(!0,!1),this.transition.targetObject.getWorldPosition(this.subjectAnchor)):this.subjectAnchor.set(0,0,0),this.camera.fov=L.lerp(this.transition.startFov,this.transition.targetFov,n),this.currentNdcOffset.x=L.lerp(this.transition.startNdcOffsetX,this.transition.targetNdcOffsetX,n),this.currentNdcOffset.y=L.lerp(this.transition.startNdcOffsetY,this.transition.targetNdcOffsetY,n);const l=L.lerp(this.spherical.theta,this.transition.targetTheta,n),c=L.lerp(this.spherical.phi,this.transition.targetPhi,n),d=L.lerp(this.spherical.radius,this.transition.targetDistance,n);this.orbitPivot.lerpVectors(this.transition.startPivot,this.subjectAnchor,n);const m=new P().setFromSphericalCoords(d,c,l);this.camera.position.copy(this.orbitPivot).add(m),this.aimPoint=this.calculateAimPoint(this.camera.position,this.orbitPivot,this.currentNdcOffset.x,this.currentNdcOffset.y,this.camera.fov,this.camera.aspect),this.camera.lookAt(this.aimPoint),this.applyLookOffset();const f=Math.max(.05,d-this.focusedRadius);this.camera.near=Math.max(.04,f*.08),this.camera.far=Math.max(16e4,d*30),this.camera.updateProjectionMatrix(),this.trackMotion(this.tmpRelPos.copy(this.camera.position),d,"absolute"),r>=1&&(this.transition.onComplete&&this.transition.onComplete(),this.spherical.set(d,c,l),this.targetSpherical.copy(this.spherical),this.panOffset.set(0,0,0),this.targetPanOffset.set(0,0,0),this.transition=null);return}let e=this.subjectAnchor;if(this.focusedObject){this.focusedObject.updateWorldMatrix(!0,!1),this.focusedObject.getWorldPosition(this.subjectAnchor);const s=this.spherical.radius;if(!(this.focusedObject.name.includes("sagittarius")||this.focusedObject.name==="Sagittarius A*")&&s>320){const r=Math.min(1,(s-320)/480);this.effectiveAnchor.lerpVectors(this.subjectAnchor,Q.ORIGIN_VEC,r),e=this.effectiveAnchor}else e=this.subjectAnchor}else this.subjectAnchor.set(0,0,0),e=this.subjectAnchor;this.currentNdcOffset.x+=(this.targetNdcOffset.x-this.currentNdcOffset.x)*this.damping,this.currentNdcOffset.y+=(this.targetNdcOffset.y-this.currentNdcOffset.y)*this.damping,this.panOffset.lerp(this.targetPanOffset,this.damping),this.orbitPivot.copy(e).add(this.panOffset),this.enableIdleDrift&&!this.isOrbiting&&!this.isPanning&&this.shotMode==="cinematic_observation"&&performance.now()-this.lastInteractionTime>3e3&&(this.targetSpherical.theta+=8e-5),this.spherical.theta+=(this.targetSpherical.theta-this.spherical.theta)*this.damping,this.spherical.phi+=(this.targetSpherical.phi-this.spherical.phi)*this.damping,this.spherical.radius+=(this.targetSpherical.radius-this.spherical.radius)*this.damping,this.spherical.phi=Math.max(.02,Math.min(Math.PI-.02,this.spherical.phi));const i=new P().setFromSpherical(this.spherical);this.camera.position.copy(this.orbitPivot).add(i),this.aimPoint=this.calculateAimPoint(this.camera.position,this.orbitPivot,this.currentNdcOffset.x,this.currentNdcOffset.y,this.camera.fov,this.camera.aspect),this.camera.lookAt(this.aimPoint),this.applyLookOffset();const a=this.spherical.radius,t=Math.max(.05,a-this.focusedRadius);this.camera.near=Math.max(.04,Math.min(30,t*.08)),this.camera.far=Math.max(25e4,a*35),this.camera.updateProjectionMatrix(),this.trackMotion(this.tmpRelPos.subVectors(this.camera.position,this.orbitPivot),this.spherical.radius,"relative")}trackMotion(e,i,a){const t=performance.now(),s=Math.max(.001,(t-this.lastUpdateTime)*.001);a!==this.motionBasis&&(this.motionBasis=a,this.hasMotionSample=!1),this.hasMotionSample&&(this.currentVelocity.subVectors(e,this.lastCameraPos).divideScalar(s),this.lastRadius>.001&&(this.zoomRate=(Math.log(i)-Math.log(this.lastRadius))/s)),this.hasMotionSample=!0,this.lastCameraPos.copy(e),this.lastRadius=i,this.lastUpdateTime=t}update(){this.updateLook(),this.updateCameraPosition()}updateLook(){const e=performance.now(),i=Math.min(.1,Math.max(0,(e-this.lastLookUpdate)*.001));if(this.lastLookUpdate=e,this.heldLookKeys.size>0){const a=Q.LOOK_KEY_RATE*(this.camera.fov/Ft)*i;this.heldLookKeys.has("ArrowLeft")&&(this.targetLookYaw+=a),this.heldLookKeys.has("ArrowRight")&&(this.targetLookYaw-=a),this.heldLookKeys.has("ArrowUp")&&(this.targetLookPitch+=a),this.heldLookKeys.has("ArrowDown")&&(this.targetLookPitch-=a),this.lastInteractionTime=e}this.targetLookPitch=L.clamp(this.targetLookPitch,-Q.MAX_LOOK_PITCH,Q.MAX_LOOK_PITCH),this.lookYaw+=(this.targetLookYaw-this.lookYaw)*this.damping,this.lookPitch+=(this.targetLookPitch-this.lookPitch)*this.damping}applyLookOffset(){Math.abs(this.lookYaw)<1e-6&&Math.abs(this.lookPitch)<1e-6||(this.camera.rotateY(this.lookYaw),this.camera.rotateX(this.lookPitch))}resetLook(){this.targetLookYaw=0,this.targetLookPitch=0}getLookAngles(){return{yaw:this.lookYaw,pitch:this.lookPitch}}get lookAtTarget(){return this.aimPoint}focusCinematic(e,i,a="",t=1800,s,o){this.focusedObject=e,this.focusedRadius=i,this.shotMode="cinematic_observation",o!==void 0&&(this.focusedPhysicalRadiusKm=o),this.targetLookYaw=0,this.targetLookPitch=0,typeof window<"u"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches&&(t=150),e.updateWorldMatrix(!0,!1);const r=new P;e.getWorldPosition(r);const n=_t[a]||(i<1?Ei:dt);this.targetNdcOffset.set(n.ndcOffsetX,n.ndcOffsetY);const l=a==="Sagittarius A*"||a==="Sgr A*"||a==="sagittarius_a_star";let c=n.fov,d;if(o!==void 0&&!l){const M=n.effectiveRadiusMultiplier?2.9:a==="Sun"?1.6:1.25;d=i*Oi(o,M),c=Ft}else d=Q.calculateViewingDistance(i,n,n.fov);this.focusDistance=d;const m=new P().copy(r).negate(),f=m.lengthSq()<1||a==="Sun";f?m.set(0,0,1):m.normalize();let v;if(f)v=new P(0,.4,1).normalize().multiplyScalar(d);else if(a==="Saturn"){const M=new kt;e.getWorldQuaternion(M);const b=new P(0,1,0).applyQuaternion(M);b.dot(m)<0&&b.negate();const g=Q.chooseObservationVantage(m,n.ndcOffsetX);g.addScaledVector(b,-g.dot(b)).normalize(),v=g.multiplyScalar(Math.cos(L.degToRad(30))).addScaledVector(b,Math.sin(L.degToRad(30))).normalize().multiplyScalar(d)}else if(a==="Sagittarius A*"||a==="Sgr A*"||a==="sagittarius_a_star"){const M=new kt;e.getWorldQuaternion(M),v=new P(.28,.25,.92).normalize().applyQuaternion(M).multiplyScalar(d)}else v=Q.chooseObservationVantage(m,n.ndcOffsetX).multiplyScalar(d);const y=new Te().setFromVector3(v);y.phi=Math.max(.04,Math.min(Math.PI-.04,y.phi)),this.targetPanOffset.set(0,0,0),this.panOffset.set(0,0,0),this.transition={startPos:this.camera.position.clone(),startAimPoint:this.aimPoint.clone(),startFov:this.camera.fov,startNdcOffsetX:this.currentNdcOffset.x,startNdcOffsetY:this.currentNdcOffset.y,startPivot:this.orbitPivot.clone(),startSpherical:this.spherical.clone(),targetObject:e,targetRadius:i,targetBodyName:a,targetShotMode:"cinematic_observation",targetFov:c,targetNdcOffsetX:n.ndcOffsetX,targetNdcOffsetY:n.ndcOffsetY,targetDistance:d,targetTheta:y.theta,targetPhi:y.phi,startTime:performance.now(),durationMs:t,onComplete:()=>{this.spherical.copy(y),this.targetSpherical.copy(y),this.camera.fov=c,this.currentNdcOffset.set(n.ndcOffsetX,n.ndcOffsetY),s&&s()}}}static chooseObservationVantage(e,i=-.34){const a=e.clone().normalize(),t=new P(0,1,0),s=new P().crossVectors(t,a);s.lengthSq()<1e-8&&s.set(1,0,0),s.normalize();const o=new P().crossVectors(a,s).normalize(),r=G.galacticBasisThree(),n=new P(...r.z),l=new P(...r.x),c=L.degToRad(55),d=i<=0?1:-1;let m=new P().copy(a).multiplyScalar(Math.cos(c)).addScaledVector(s,Math.sin(c)),f=-1/0;const v=new P,y=new P,M=new P,b=new P,g=new P;for(let S=0;S<24;S++){const w=S/24*Math.PI*2;if(v.copy(a).multiplyScalar(Math.cos(c)).addScaledVector(s,Math.sin(c)*Math.cos(w)).addScaledVector(o,Math.sin(c)*Math.sin(w)).normalize(),Math.abs(v.y)>.75)continue;y.copy(v).negate(),M.crossVectors(y,t).normalize(),b.crossVectors(M,y).normalize(),g.copy(y).addScaledVector(M,.85*d).normalize();const T=1-Math.abs(g.dot(n)),A=Math.max(0,g.dot(l))*.35,R=Math.abs(v.y-.25)*.4,N=T+A-R;N>f&&(f=N,m=v.clone())}return m.normalize()}focusOn(e,i,a=1800){this.focusCinematic(e,i,e.name,a)}resetToOverview(e=1600){this.resetLook(),this.focusedObject=null,this.focusedRadius=48,this.shotMode="deep_space_overview",this.targetPanOffset.set(0,0,0),this.panOffset.set(0,0,0),this.targetNdcOffset.set(0,0),typeof window<"u"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches&&(e=150);const i=new Te(680,Math.PI*.3,Math.PI*.25);this.transition={startPos:this.camera.position.clone(),startAimPoint:this.aimPoint.clone(),startFov:this.camera.fov,startNdcOffsetX:this.currentNdcOffset.x,startNdcOffsetY:this.currentNdcOffset.y,startPivot:this.orbitPivot.clone(),startSpherical:this.spherical.clone(),targetObject:null,targetRadius:48,targetBodyName:"Overview",targetShotMode:"deep_space_overview",targetFov:45,targetNdcOffsetX:0,targetNdcOffsetY:0,targetDistance:680,targetTheta:i.theta,targetPhi:i.phi,startTime:performance.now(),durationMs:e,onComplete:()=>{this.spherical.copy(i),this.targetSpherical.copy(i),this.subjectAnchor.set(0,0,0),this.orbitPivot.set(0,0,0),this.camera.fov=45,this.currentNdcOffset.set(0,0)}}}transitionToDistance(e,i=45,a="deep_space_overview",t=1600,s,o){typeof window<"u"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches&&(t=150);let r;if(o)r=new Te().setFromVector3(o.clone().normalize().multiplyScalar(e)),r.phi=Math.max(.04,Math.min(Math.PI-.04,r.phi));else{const c=this.targetSpherical.theta,d=s!==void 0?s:Math.max(.08,Math.min(Math.PI*.45,this.targetSpherical.phi));r=new Te(e,d,c)}this.shotMode=a,this.targetPanOffset.set(0,0,0);const n=a==="cinematic_observation"?-.34:0,l=0;this.transition={startPos:this.camera.position.clone(),startAimPoint:this.aimPoint.clone(),startFov:this.camera.fov,startNdcOffsetX:this.currentNdcOffset.x,startNdcOffsetY:this.currentNdcOffset.y,startPivot:this.orbitPivot.clone(),startSpherical:this.spherical.clone(),targetObject:e<350?this.focusedObject:null,targetRadius:this.focusedRadius,targetBodyName:this.focusedObject?this.focusedObject.name:"Cosmos",targetShotMode:a,targetFov:i,targetNdcOffsetX:n,targetNdcOffsetY:l,targetDistance:e,targetTheta:r.theta,targetPhi:r.phi,startTime:performance.now(),durationMs:t,onComplete:()=>{this.spherical.copy(r),this.targetSpherical.copy(r),e>=350&&(this.subjectAnchor.set(0,0,0),this.orbitPivot.set(0,0,0)),this.camera.fov=i,this.currentNdcOffset.set(n,l),this.targetNdcOffset.set(n,l)}}}jumpToScale(e,i=1800){let a=680,t="scientific_overview",s=45,o,r;switch(e){case"planetary":a=this.focusedRadius>0?this.focusedRadius*2.8:12,t="cinematic_observation",s=40;break;case"inner_system":a=180,t="scientific_overview",s=45,o=Math.PI*.32;break;case"outer_system":a=1100,t="deep_space_overview",s=46,o=Math.PI*.28;break;case"interstellar":a=8200,t="deep_space_overview",s=48,o=Math.PI*.26;break;case"galactic":a=52e3,t="deep_space_overview",s=48;{const n=G.galacticBasisThree(),l=L.degToRad(35);r=new P(...n.z).multiplyScalar(Math.cos(l)).addScaledVector(new P(...n.x),-Math.sin(l))}break}this.transitionToDistance(a,s,t,i,o,r)}getVelocity(){return this.currentVelocity}getZoomVelocity(){return this.zoomRate}getTravelSpeed(){return this.currentVelocity.length()}getObserverScaleMetric(){const e=this.spherical.radius,i=t=>`${Math.round(t).toLocaleString("en-US")} KM`;if(this.focusedObject&&(this.focusedObject.name.includes("sagittarius")||this.focusedObject.name==="Sagittarius A*")){const t=e/ca.schwarzschildRadius,s=t*J.derivedParameters.schwarzschildRadiusKm;return{distance:e,formatted:`${t.toFixed(1)} r_s (${i(s)})`,domain:"planetary"}}const a=this.focusedObject!==null&&this.focusedPhysicalRadiusKm!==null&&e<320;if(e<30||a){const t=this.distanceModel==="scientific"?ve.SCIENTIFIC_KM_PER_UNIT:this.focusedPhysicalRadiusKm&&this.focusedRadius>0?this.focusedPhysicalRadiusKm/this.focusedRadius:2654.5833333333335;return this.focusedObject&&this.focusedRadius>0&&e>this.focusedRadius?{distance:e,formatted:`ALT ${i((e-this.focusedRadius)*t)}`,domain:"planetary"}:{distance:e,formatted:i(e*t),domain:"planetary"}}if(e<3500){let t;if(this.distanceModel==="scientific")t=e*ve.SCIENTIFIC_KM_PER_UNIT/ve.AU_KM;else{const o=bt(1);t=e<o?e/o:ci(e)}const s=e<380?"inner_system":"outer_system";return{distance:e,formatted:`${t.toFixed(t<10?2:1)} AU`,domain:s}}if(e<25e3){const t=Math.max(0,e-Ge.LOCAL_STAR_OFFSET)/Ge.LOCAL_UNITS_PER_PC;return{distance:e,formatted:`${(t*3.26156).toFixed(1)} LY`,domain:"interstellar"}}return{distance:e,formatted:`${(e/Pe).toFixed(1)} KPC`,domain:"galactic"}}toggleFramingOffset(){if(Math.abs(this.targetNdcOffset.x)>.05)return this.targetNdcOffset.set(0,0),this.shotMode="free_inspection",!1;{const e=this.focusedObject&&_t[this.focusedObject.name]||dt;return this.targetNdcOffset.set(e.ndcOffsetX,e.ndcOffsetY),this.shotMode="cinematic_observation",!0}}setupEventListeners(e){this.domElement=e,e&&e.addEventListener&&(e.addEventListener("mousedown",this.onMouseDown),e.addEventListener("wheel",this.onWheel,{passive:!1}),e.addEventListener("contextmenu",this.onContextMenu),e.addEventListener("touchstart",this.onTouchStart,{passive:!0}),e.addEventListener("dblclick",this.onDoubleClick)),typeof window<"u"&&(window.addEventListener("keydown",this.onKeyDown),window.addEventListener("keyup",this.onKeyUp),window.addEventListener("blur",this.onWindowBlur)),typeof window<"u"&&(window.addEventListener("mouseup",this.onMouseUp),window.addEventListener("mousemove",this.onMouseMove),window.addEventListener("touchmove",this.onTouchMove,{passive:!0}),window.addEventListener("touchend",this.onTouchEnd,{passive:!0}))}handleResize(e,i){this.camera.aspect=e/i,this.camera.updateProjectionMatrix()}dispose(){this.domElement&&this.domElement.removeEventListener&&(this.domElement.removeEventListener("mousedown",this.onMouseDown),this.domElement.removeEventListener("wheel",this.onWheel),this.domElement.removeEventListener("contextmenu",this.onContextMenu),this.domElement.removeEventListener("touchstart",this.onTouchStart),this.domElement.removeEventListener("dblclick",this.onDoubleClick)),typeof window<"u"&&(window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("keyup",this.onKeyUp),window.removeEventListener("blur",this.onWindowBlur),window.removeEventListener("mouseup",this.onMouseUp),window.removeEventListener("mousemove",this.onMouseMove),window.removeEventListener("touchmove",this.onTouchMove),window.removeEventListener("touchend",this.onTouchEnd))}};u(Q,"ORIGIN_VEC",new P(0,0,0)),u(Q,"LOOK_KEY_RATE",.9),u(Q,"MAX_LOOK_PITCH",L.degToRad(80)),u(Q,"LOOK_KEYS",new Set(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"]));let ft=Q;const he=class he{constructor(e=Date.now()){u(this,"currentUtcMs");u(this,"lastPerfTimeMs");u(this,"isPaused",!1);u(this,"timeMultiplier",1);this.currentUtcMs=e,this.lastPerfTimeMs=performance.now()}update(e=performance.now()){const i=e-this.lastPerfTimeMs;if(this.lastPerfTimeMs=e,!this.isPaused&&i>0){const a=i*this.timeMultiplier;this.currentUtcMs+=a}return this.currentUtcMs}getUtcMs(){return this.currentUtcMs}setUtcMs(e){this.currentUtcMs=e,this.lastPerfTimeMs=performance.now()}getIsoString(){return new Date(this.currentUtcMs).toISOString()}getJulianDate(){return he.utcMsToJulianDate(this.currentUtcMs)}getJulianDateTDB(){return he.utcMsToJulianDate(this.currentUtcMs)+he.TT_MINUS_UTC_SECONDS/86400}getJulianCenturiesJ2000(){return(this.getJulianDateTDB()-he.J2000_JD)/36525}static utcMsToJulianDate(e){return e/864e5+24405875e-1}static julianDateToUtcMs(e){return(e-24405875e-1)*864e5}resetToJ2000(){this.setUtcMs(he.J2000_UTC_MS)}resetToNow(){this.setUtcMs(Date.now())}};u(he,"J2000_JD",2451545),u(he,"J2000_UTC_MS",946727935816),u(he,"TT_MINUS_UTC_SECONDS",69.184);let Re=he;const V=class V{static solveKepler(e,i,a=1e-12,t=25){const s=Math.PI*2;e=(e%s+s)%s,e>Math.PI&&(e-=s);let o;if(i<.18)o=e+i*Math.sin(e);else{const r=e<0?-1:1;o=e+r*.85*i}for(let r=0;r<t;r++){const n=o-i*Math.sin(o)-e;if(Math.abs(n)<a)return o;const l=1-i*Math.cos(o);if(Math.abs(l)<1e-15)break;const c=n/l;if(o-=c,Math.abs(c)<a)return o}return o}static elementsAt(e,i,a=V.GM_SUN){const t=(e.epochJd??V.J2000_JD)-V.J2000_JD,s=i-t,o=Math.PI/180,r=e.ratesPerCentury;if(r){const c=s/V.DAYS_PER_CENTURY;return{a:(e.semiMajorAxisAU+r.semiMajorAxisAU*c)*V.AU_KM,e:e.eccentricity+r.eccentricity*c,iDeg:e.inclinationDeg+r.inclinationDeg*c,nodeDeg:e.longitudeAscendingNodeDeg+r.longitudeAscendingNodeDeg*c,argPeriDeg:e.argumentPeriapsisDeg+r.argumentPeriapsisDeg*c,meanAnomalyRad:(e.meanAnomalyAtEpochDeg+r.meanAnomalyDeg*c)*o}}const n=e.semiMajorAxisKm,l=e.meanMotionDegPerDay!==void 0?e.meanMotionDegPerDay*o:Math.sqrt(a/(n*n*n))*86400;return{a:n,e:e.eccentricity,iDeg:e.inclinationDeg,nodeDeg:e.longitudeAscendingNodeDeg+(e.nodeRateDegPerDay??0)*s,argPeriDeg:e.argumentPeriapsisDeg+(e.periapsisArgRateDegPerDay??0)*s,meanAnomalyRad:e.meanAnomalyAtEpochDeg*o+l*s}}static propagate(e,i,a=V.GM_SUN){if(e.semiMajorAxisKm<=0)return{positionKm:[0,0,0],velocityKmPerSec:[0,0,0],trueAnomalyDeg:0,eccentricAnomalyDeg:0,distanceKm:0,speedKmPerSec:0};const t=V.elementsAt(e,i,a),s=t.a,o=t.e,r=V.solveKepler(t.meanAnomalyRad,o),n=Math.sin(r),l=Math.cos(r),c=Math.sqrt(1-o*o)*n/(1-o*l),d=(l-o)/(1-o*l),m=Math.atan2(c,d),f=s*(1-o*l),v=s*(l-o),y=s*Math.sqrt(1-o*o)*n,M=Math.sqrt(a*s)/f,b=-M*n,g=M*Math.sqrt(1-o*o)*l,{P:S,Q:w}=V.perifocalBasis(t.iDeg,t.argPeriDeg,t.nodeDeg),T=[v*S[0]+y*w[0],v*S[1]+y*w[1],v*S[2]+y*w[2]],A=[b*S[0]+g*w[0],b*S[1]+g*w[1],b*S[2]+g*w[2]],[R,N,U]=T,[_,Z,se]=A,te=Math.sqrt(_*_+Z*Z+se*se);return{positionKm:[R,N,U],velocityKmPerSec:[_,Z,se],trueAnomalyDeg:(m*180/Math.PI%360+360)%360,eccentricAnomalyDeg:(r*180/Math.PI%360+360)%360,distanceKm:f,speedKmPerSec:te}}static perifocalBasis(e,i,a){const t=e*Math.PI/180,s=i*Math.PI/180,o=a*Math.PI/180,r=Math.cos(o),n=Math.sin(o),l=Math.cos(t),c=Math.sin(t),d=Math.cos(s),m=Math.sin(s);return{P:[r*d-n*m*l,n*d+r*m*l,m*c],Q:[-r*m-n*d*l,-n*m+r*d*l,d*c]}}static sampleOrbitPath(e,i=128,a=0){const t=[];if(e.semiMajorAxisKm<=0)return t;const s=V.elementsAt(e,a),o=s.a,r=s.e,n=o*Math.sqrt(Math.max(0,1-r*r)),{P:l,Q:c}=V.perifocalBasis(s.iDeg,s.argPeriDeg,s.nodeDeg);for(let d=0;d<=i;d++){const m=d/i*Math.PI*2,f=o*(Math.cos(m)-r),v=n*Math.sin(m),y=[f*l[0]+v*c[0],f*l[1]+v*c[1],f*l[2]+v*c[2]];t.push(y)}return t}};u(V,"GM_SUN",1327124400419394e-4),u(V,"DAYS_PER_CENTURY",36525),u(V,"AU_KM",1495978707e-1),u(V,"J2000_JD",2451545);let ye=V;class Bt{static createOrbitLine(e,i,a=0,t=180){if(e.orderFromSun===0||e.orbit.semiMajorAxisKm<=0)return null;const o=ye.sampleOrbitPath(e.orbit,t,a).map(c=>{const d=i.toRenderPosition(c,e);return new P(d[0],d[1],d[2])}),r=new q().setFromPoints(o),n=new Be({color:new E(e.physical.colorHex||"#555566"),transparent:!0,opacity:e.category==="planet"?.3:.18,linewidth:1}),l=new Ee(r,n);return l.name=`kepler_orbit_${e.name}`,l}static createMoonOrbitLine(e,i,a,t=0,s=96){if(e.orbit.semiMajorAxisKm<=0)return null;const r=ye.sampleOrbitPath(e.orbit,s,t).map(d=>{const m=a.toMoonRenderPosition(d,e,[0,0,0],i);return new P(m[0],m[1],m[2])}),n=new q().setFromPoints(r),l=new Be({color:new E(e.physical.colorHex||"#778899"),transparent:!0,opacity:.2,linewidth:1}),c=new Ee(n,l);return c.name=`kepler_moon_orbit_${e.name}`,c}}function ki(p=19890825){let e=p>>>0;return function(){let i=e+=1831565813;return i=Math.imul(i^i>>>15,i|1),i^=i+Math.imul(i^i>>>7,i|61),((i^i>>>14)>>>0)/4294967296}}class Li{constructor(e,i=19890825){u(this,"mesh");u(this,"count",3200);u(this,"elements",[]);u(this,"dummy",new Oa);u(this,"transform");u(this,"seed");this.transform=e,this.seed=i;const a=new ka(.35,1),t=a.attributes.position;for(let o=0;o<t.count;o++){const r=t.getX(o),n=t.getY(o),l=t.getZ(o),c=1+.22*Math.sin(r*5)*Math.cos(n*5+l*3);t.setXYZ(o,r*c,n*c,l*c)}a.computeVertexNormals();const s=new La({roughness:.88,metalness:.12,vertexColors:!0});this.mesh=new Ua(a,s,this.count),this.mesh.name="asteroid_belt_instanced",this.mesh.castShadow=!1,this.mesh.receiveShadow=!1,this.generateElements(),this.updatePositions(0)}generateElements(){const e=ki(this.seed),i=[{au:2.5,width:.045},{au:2.82,width:.04},{au:2.96,width:.035},{au:3.27,width:.05}],a=[];let t=0;for(;t<this.count;){const s=2.12+e()*1.16;let o=!1;for(const b of i)if(Math.abs(s-b.au)<b.width&&e()<.88){o=!0;break}if(o)continue;const r=.03+e()*.19,n=e()*e()*18,l=L.degToRad(n),c=e()*Math.PI*2,d=e()*Math.PI*2,m=e()*Math.PI*2,f=Math.pow(s,1.5)*365.25,v=Math.PI*2/f,y=.12+e()*.22;this.elements.push({semiMajorAxisAU:s,eccentricity:r,inclinationRad:l,longNodeRad:c,argPeriRad:d,meanAnomalyEpochRad:m,meanMotionRadPerDay:v,scale:y});const M=e();if(M<.7){const b=.28+e()*.18;a.push(new E(b*.95,b*.92,b*.88))}else if(M<.9){const b=.45+e()*.22;a.push(new E(b*1.05,b*.95,b*.8))}else{const b=.55+e()*.25;a.push(new E(b,b*.95,b*.9))}t++}for(let s=0;s<a.length;s++)this.mesh.setColorAt(s,a[s]);this.mesh.instanceColor&&(this.mesh.instanceColor.needsUpdate=!0)}updatePositions(e){const i=this.transform.mode==="scientific";for(let a=0;a<this.elements.length;a++){const t=this.elements[a],s=(t.meanAnomalyEpochRad+t.meanMotionRadPerDay*e)%(Math.PI*2),o=ye.solveKepler(s,t.eccentricity,1e-8,12),r=2*Math.atan2(Math.sqrt(1+t.eccentricity)*Math.sin(o/2),Math.sqrt(1-t.eccentricity)*Math.cos(o/2)),n=t.semiMajorAxisAU*(1-t.eccentricity*t.eccentricity)/(1+t.eccentricity*Math.cos(r)),l=r+t.argPeriRad,c=Math.cos(l),d=Math.sin(l),m=Math.cos(t.longNodeRad),f=Math.sin(t.longNodeRad),v=Math.cos(t.inclinationRad),y=Math.sin(t.inclinationRad),M=n,b=M*(m*c-f*d*v),g=M*(f*c+m*d*v),S=M*(d*y);let w,T,A;if(i){const N=ve.AU_KM/ve.SCIENTIFIC_KM_PER_UNIT;w=b*N,T=S*N,A=-g*N}else{const N=bt(n),U=Math.sqrt(b*b+g*g+S*S);w=b/U*N,T=S/U*N,A=-(g/U)*N}this.dummy.position.set(w,T,A);const R=t.scale*(i?.5:1);this.dummy.scale.set(R,R,R),this.dummy.rotation.set(s*2,s*3.5,s*1.5),this.dummy.updateMatrix(),this.mesh.setMatrixAt(a,this.dummy.matrix)}this.mesh.instanceMatrix.needsUpdate=!0}setVisible(e){this.mesh.visible=e}isVisible(){return this.mesh.visible}dispose(){this.mesh.geometry.dispose(),this.mesh.material.dispose()}}const ha={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class Oe{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const Ui=new ja(-1,1,1,-1,0,1);class ji extends q{constructor(){super(),this.setAttribute("position",new pt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new pt([0,2,0,0,2,0],2))}}const _i=new ji;class St{constructor(e){this._mesh=new B(_i,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,Ui)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class da extends Oe{constructor(e,i){super(),this.textureID=i!==void 0?i:"tDiffuse",e instanceof I?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Qe.clone(e.uniforms),this.material=new I({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new St(this.material)}render(e,i,a){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=a.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(i),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class Ht extends Oe{constructor(e,i){super(),this.scene=e,this.camera=i,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,i,a){const t=e.getContext(),s=e.state;s.buffers.color.setMask(!1),s.buffers.depth.setMask(!1),s.buffers.color.setLocked(!0),s.buffers.depth.setLocked(!0);let o,r;this.inverse?(o=0,r=1):(o=1,r=0),s.buffers.stencil.setTest(!0),s.buffers.stencil.setOp(t.REPLACE,t.REPLACE,t.REPLACE),s.buffers.stencil.setFunc(t.ALWAYS,o,4294967295),s.buffers.stencil.setClear(r),s.buffers.stencil.setLocked(!0),e.setRenderTarget(a),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(i),this.clear&&e.clear(),e.render(this.scene,this.camera),s.buffers.color.setLocked(!1),s.buffers.depth.setLocked(!1),s.buffers.color.setMask(!0),s.buffers.depth.setMask(!0),s.buffers.stencil.setLocked(!1),s.buffers.stencil.setFunc(t.EQUAL,1,4294967295),s.buffers.stencil.setOp(t.KEEP,t.KEEP,t.KEEP),s.buffers.stencil.setLocked(!0)}}class Fi extends Oe{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class Bi{constructor(e,i){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),i===void 0){const a=e.getSize(new X);this._width=a.width,this._height=a.height,i=new je(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:_e}),i.texture.name="EffectComposer.rt1"}else this._width=i.width,this._height=i.height;this.renderTarget1=i,this.renderTarget2=i.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new da(ha),this.copyPass.material.blending=_a,this.clock=new Fa}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,i){this.passes.splice(i,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const i=this.passes.indexOf(e);i!==-1&&this.passes.splice(i,1)}isLastEnabledPass(e){for(let i=e+1;i<this.passes.length;i++)if(this.passes[i].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const i=this.renderer.getRenderTarget();let a=!1;for(let t=0,s=this.passes.length;t<s;t++){const o=this.passes[t];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(t),o.render(this.renderer,this.writeBuffer,this.readBuffer,e,a),o.needsSwap){if(a){const r=this.renderer.getContext(),n=this.renderer.state.buffers.stencil;n.setFunc(r.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),n.setFunc(r.EQUAL,1,4294967295)}this.swapBuffers()}Ht!==void 0&&(o instanceof Ht?a=!0:o instanceof Fi&&(a=!1))}}this.renderer.setRenderTarget(i)}reset(e){if(e===void 0){const i=this.renderer.getSize(new X);this._pixelRatio=this.renderer.getPixelRatio(),this._width=i.width,this._height=i.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,i){this._width=e,this._height=i;const a=this._width*this._pixelRatio,t=this._height*this._pixelRatio;this.renderTarget1.setSize(a,t),this.renderTarget2.setSize(a,t);for(let s=0;s<this.passes.length;s++)this.passes[s].setSize(a,t)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class Hi extends Oe{constructor(e,i,a=null,t=null,s=null){super(),this.scene=e,this.camera=i,this.overrideMaterial=a,this.clearColor=t,this.clearAlpha=s,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new E}render(e,i,a){const t=e.autoClear;e.autoClear=!1;let s,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(s=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:a),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(s),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),e.autoClear=t}}const Gi={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new E(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class Ie extends Oe{constructor(e,i,a,t){super(),this.strength=i!==void 0?i:1,this.radius=a,this.threshold=t,this.resolution=e!==void 0?new X(e.x,e.y):new X(256,256),this.clearColor=new E(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let s=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new je(s,o,{type:_e}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let d=0;d<this.nMips;d++){const m=new je(s,o,{type:_e});m.texture.name="UnrealBloomPass.h"+d,m.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(m);const f=new je(s,o,{type:_e});f.texture.name="UnrealBloomPass.v"+d,f.texture.generateMipmaps=!1,this.renderTargetsVertical.push(f),s=Math.round(s/2),o=Math.round(o/2)}const r=Gi;this.highPassUniforms=Qe.clone(r.uniforms),this.highPassUniforms.luminosityThreshold.value=t,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new I({uniforms:this.highPassUniforms,vertexShader:r.vertexShader,fragmentShader:r.fragmentShader}),this.separableBlurMaterials=[];const n=[3,5,7,9,11];s=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let d=0;d<this.nMips;d++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(n[d])),this.separableBlurMaterials[d].uniforms.invSize.value=new X(1/s,1/o),s=Math.round(s/2),o=Math.round(o/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=i,this.compositeMaterial.uniforms.bloomRadius.value=.1;const l=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=l,this.bloomTintColors=[new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const c=ha;this.copyUniforms=Qe.clone(c.uniforms),this.blendMaterial=new I({uniforms:this.copyUniforms,vertexShader:c.vertexShader,fragmentShader:c.fragmentShader,blending:W,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new E,this.oldClearAlpha=1,this.basic=new wt,this.fsQuad=new St(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(e,i){let a=Math.round(e/2),t=Math.round(i/2);this.renderTargetBright.setSize(a,t);for(let s=0;s<this.nMips;s++)this.renderTargetsHorizontal[s].setSize(a,t),this.renderTargetsVertical[s].setSize(a,t),this.separableBlurMaterials[s].uniforms.invSize.value=new X(1/a,1/t),a=Math.round(a/2),t=Math.round(t/2)}render(e,i,a,t,s){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();const o=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),s&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=a.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=a.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let r=this.renderTargetBright;for(let n=0;n<this.nMips;n++)this.fsQuad.material=this.separableBlurMaterials[n],this.separableBlurMaterials[n].uniforms.colorTexture.value=r.texture,this.separableBlurMaterials[n].uniforms.direction.value=Ie.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[n]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[n].uniforms.colorTexture.value=this.renderTargetsHorizontal[n].texture,this.separableBlurMaterials[n].uniforms.direction.value=Ie.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[n]),e.clear(),this.fsQuad.render(e),r=this.renderTargetsVertical[n];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,s&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(a),this.fsQuad.render(e)),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=o}getSeperableBlurMaterial(e){const i=[];for(let a=0;a<e;a++)i.push(.39894*Math.exp(-.5*a*a/(e*e))/e);return new I({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new X(.5,.5)},direction:{value:new X(.5,.5)},gaussianCoefficients:{value:i}},vertexShader:`varying vec2 vUv;
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
				}`})}getCompositeMaterial(e){return new I({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
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
				}`})}}Ie.BlurDirectionX=new X(1,0);Ie.BlurDirectionY=new X(0,1);const Ki={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class zi extends Oe{constructor(){super();const e=Ki;this.uniforms=Qe.clone(e.uniforms),this.material=new Ba({name:e.name,uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader}),this.fsQuad=new St(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,i,a){this.uniforms.tDiffuse.value=a.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},Ha.getTransfer(this._outputColorSpace)===Ga&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Ka?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===za?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Va?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Wt?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Wa?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Ya&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(i),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}const tt={cinematic:{name:"cinematic",label:"Cinematic",distortion:.1,fisheyeMask:0,chromatic:.0035,edgeBlur:2.2,vignette:.42,grain:.016,shutter:.5,bloomStrength:.4,bloomRadius:.55,bloomThreshold:.9},fisheye:{name:"fisheye",label:"Fisheye",distortion:.55,fisheyeMask:1.12,chromatic:.007,edgeBlur:4.5,vignette:.6,grain:.03,shutter:.5,bloomStrength:.48,bloomRadius:.6,bloomThreshold:.88},clean:{name:"clean",label:"Clean",distortion:0,fisheyeMask:0,chromatic:0,edgeBlur:0,vignette:0,grain:0,shutter:0,bloomStrength:0,bloomRadius:0,bloomThreshold:1}},Xe=["cinematic","fisheye","clean"];function Vi(p,e,i,a){if(a===0)return[p,e];const t=(p*p+e*e)/(i*i+1),s=(1+a*t)/(1+a);return[p*s,e*s]}const Wi={uniforms:{tDiffuse:{value:null},uResolution:{value:new X(1,1)},uTime:{value:0},uDistortion:{value:0},uFisheyeMask:{value:0},uChromatic:{value:0},uEdgeBlur:{value:0},uVignette:{value:0},uGrain:{value:0},uShutter:{value:0},uCurrInvViewProj:{value:new fe},uPrevViewProj:{value:new fe}},vertexShader:`
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
  `};class Yi{constructor(e,i,a){u(this,"profile",tt.cinematic);u(this,"renderer");u(this,"scene");u(this,"camera");u(this,"composer");u(this,"bloomPass");u(this,"lensPass");u(this,"prevViewProj",new fe);u(this,"hasPrev",!1);u(this,"tmpView",new fe);u(this,"tmpViewProj",new fe);u(this,"reducedMotion",!1);this.renderer=e,this.scene=i,this.camera=a;const t=e.getSize(new X),s=new je(t.x,t.y,{type:_e});this.composer=new Bi(e,s),this.composer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5)),this.composer.addPass(new Hi(i,a)),this.bloomPass=new Ie(new X(t.x,t.y),.4,.5,.85),this.composer.addPass(this.bloomPass),this.composer.addPass(new zi),this.lensPass=new da(Wi),this.composer.addPass(this.lensPass),typeof window<"u"&&window.matchMedia&&(this.reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches),this.setSize(t.x,t.y),this.setProfile("cinematic")}setProfile(e){this.profile=tt[e];const i=this.lensPass.uniforms;i.uDistortion.value=this.profile.distortion,i.uFisheyeMask.value=this.profile.fisheyeMask,i.uChromatic.value=this.profile.chromatic,i.uEdgeBlur.value=this.profile.edgeBlur,i.uVignette.value=this.profile.vignette,i.uGrain.value=this.profile.grain,i.uShutter.value=this.reducedMotion?0:this.profile.shutter,this.bloomPass.strength=this.profile.bloomStrength,this.bloomPass.radius=this.profile.bloomRadius,this.bloomPass.threshold=this.profile.bloomThreshold,this.hasPrev=!1}cycleProfile(){const e=Xe[(Xe.indexOf(this.profile.name)+1)%Xe.length];return this.setProfile(e),e}setSize(e,i){this.composer.setSize(e,i);const a=Math.min(window.devicePixelRatio||1,1.5);this.lensPass.uniforms.uResolution.value.set(e*a,i*a)}outputToSceneNdc(e,i,a){const[t,s]=Vi(e*a,i,a,this.profile.distortion);return[t/a,s]}isMasked(e,i,a){return this.profile.fisheyeMask<=0?!1:Math.hypot(e*a,i)>this.profile.fisheyeMask}render(e){if(this.profile.name==="clean"){this.renderer.render(this.scene,this.camera),this.hasPrev=!1;return}this.camera.updateMatrixWorld(),this.tmpView.copy(this.camera.matrixWorldInverse).setPosition(0,0,0),this.tmpViewProj.multiplyMatrices(this.camera.projectionMatrix,this.tmpView);const i=this.lensPass.uniforms;i.uCurrInvViewProj.value.copy(this.tmpViewProj).invert(),i.uPrevViewProj.value.copy(this.hasPrev?this.prevViewProj:this.tmpViewProj),i.uTime.value=e,this.composer.render(),this.prevViewProj.copy(this.tmpViewProj),this.hasPrev=!0}dispose(){var e,i;this.composer.dispose(),this.bloomPass.dispose(),(i=(e=this.lensPass).dispose)==null||i.call(e)}}const Ji={Sun:{ra0:286.13,dec0:63.87,w0:84.176,wRate:14.1844},Mercury:{ra0:281.0103,raRate:-.0328,dec0:61.4155,decRate:-.0049,w0:329.5988,wRate:6.1385108},Venus:{ra0:272.76,dec0:67.16,w0:160.2,wRate:-1.4813688},Earth:{ra0:0,raRate:-.641,dec0:90,decRate:-.557,w0:190.147,wRate:360.9856235},Mars:{ra0:317.269202,raRate:-.10927547,dec0:54.432516,decRate:-.05827105,w0:176.049863,wRate:350.891982443297},Jupiter:{ra0:268.056595,raRate:-.006499,dec0:64.495303,decRate:.002413,w0:284.95,wRate:870.536},Saturn:{ra0:40.589,raRate:-.036,dec0:83.537,decRate:-.004,w0:38.9,wRate:810.7939024},Uranus:{ra0:257.311,dec0:-15.175,w0:203.81,wRate:-501.1600928},Neptune:{ra0:299.36,dec0:43.46,w0:249.978,wRate:541.1397757,neptuneNutation:!0},Pluto:{ra0:132.993,dec0:-6.163,w0:302.695,wRate:56.3625225},Ceres:{ra0:291.418,dec0:66.764,w0:170.65,wRate:952.1532},Vesta:{ra0:309.031,dec0:42.235,w0:285.39,wRate:1617.3329428},Eros:{ra0:11.35,dec0:17.22,w0:326.07,wRate:1639.38864745},Gaspra:{ra0:9.47,dec0:26.7,w0:83.67,wRate:1226.911485},Ida:{ra0:168.76,dec0:-87.12,w0:274.05,wRate:1864.628007}},qi={Bennu:{lambdaDeg:69.92,betaDeg:-83.45,periodHours:4.296057},Ryugu:{lambdaDeg:179.3,betaDeg:-87.44,periodHours:7.6326}},De=Math.PI/180;function Ke(p){const e=Math.hypot(p[0],p[1],p[2])||1;return[p[0]/e,p[1]/e,p[2]/e]}function Pt(p,e){return[p[1]*e[2]-p[2]*e[1],p[2]*e[0]-p[0]*e[2],p[0]*e[1]-p[1]*e[0]]}const Gt=G.icrfToThree,Xi=G.raDecToIcrf;function $i(p,e){const i=Ji[p];if(i){const t=e/36525;let s=i.ra0+(i.raRate??0)*t,o=i.dec0+(i.decRate??0)*t,r=i.w0+i.wRate*e;if(i.neptuneNutation){const c=(357.85+52.316*t)*De;s+=.7*Math.sin(c),o-=.51*Math.cos(c),r-=.48*Math.sin(c)}const n=Xi(s,o),l=[-Math.sin(s*De),Math.cos(s*De),0];return vt(Gt(l),Gt(n),r*De)}const a=qi[p];if(a){const t=a.lambdaDeg*De,s=a.betaDeg*De,o=[Math.cos(s)*Math.cos(t),Math.cos(s)*Math.sin(t),Math.sin(s)],r=G.eclipticToThree(o),n=G.eclipticToThree([0,0,1]);let l=Pt(n,r);Math.hypot(...l)<1e-6&&(l=[1,0,0]);const c=e*24/a.periodHours*2*Math.PI;return vt(Ke(l),r,c)}return null}function Qi(p,e){const i=G.eclipticToThree(p),a=G.eclipticToThree(e),t=Ke(Pt(i,a)),s=Ke([-i[0],-i[1],-i[2]]);return vt(s,t,0)}function vt(p,e,i){const a=Ke(e),t=p[0]*a[0]+p[1]*a[1]+p[2]*a[2],s=Ke([p[0]-t*a[0],p[1]-t*a[1],p[2]-t*a[2]]),o=Pt(s,a);return{xAxis:s,yAxis:a,zAxis:o,spinRad:i}}const at=class at{constructor(e,i){u(this,"container");u(this,"renderer");u(this,"scene");u(this,"cameraRig");u(this,"clock",new Re);u(this,"transform",new ve);u(this,"planetBundles",new Map);u(this,"orbitLinesGroup",new ie);u(this,"moonOrbitLines",new Map);u(this,"latestPhysicalStates",new Map);u(this,"orbitLinesEpochDays",0);u(this,"tmpMatrix",new fe);u(this,"tmpX",new P);u(this,"tmpY",new P);u(this,"tmpZ",new P);u(this,"starfield");u(this,"asteroidBelt");u(this,"raycaster",new Ja);u(this,"mouse",new X);u(this,"isRunning",!0);u(this,"animationFrameId",null);u(this,"lastFrameTime",performance.now());u(this,"lens");u(this,"selectedBody");u(this,"onTelemetryUpdate");u(this,"lastTelemetryTime",0);u(this,"pointerDownPos",{x:0,y:0});u(this,"onPointerDown",e=>{this.pointerDownPos={x:e.clientX,y:e.clientY}});u(this,"onCanvasMouseMove",e=>{var s,o;if(e.target!==this.renderer.domElement)return;const i=this.renderer.domElement.getBoundingClientRect(),a=(e.clientX-i.left)/i.width*2-1,t=-((e.clientY-i.top)/i.height)*2+1;if((o=(s=this.starfield)==null?void 0:s.externalGalaxy)!=null&&o.sagittariusAStar){const r=this.starfield.externalGalaxy.getGalacticCenterWorldPosition(),n=r.clone().project(this.cameraRig.camera);if(n.z>=-1&&n.z<=1){const l=i.width/Math.max(1,i.height),c=(a-n.x)*l,d=t-n.y,m=Math.hypot(c,d),v=this.cameraRig.camera.position.distanceTo(r)>12e3?.18:.25;if(m<v){this.renderer.domElement.style.cursor="pointer";return}}}this.renderer.domElement.style.cursor==="pointer"&&(this.renderer.domElement.style.cursor="")});u(this,"onCanvasClick",e=>{var l,c,d,m,f,v,y,M,b,g;if(e.target!==this.renderer.domElement||Math.hypot(e.clientX-this.pointerDownPos.x,e.clientY-this.pointerDownPos.y)>6)return;const a=this.renderer.domElement.getBoundingClientRect();this.mouse.x=(e.clientX-a.left)/a.width*2-1,this.mouse.y=-((e.clientY-a.top)/a.height)*2+1;const t=a.width/Math.max(1,a.height);if(this.lens.isMasked(this.mouse.x,this.mouse.y,t))return;const[s,o]=this.lens.outputToSceneNdc(this.mouse.x,this.mouse.y,t);if(this.mouse.set(s,o),(c=(l=this.starfield)==null?void 0:l.externalGalaxy)!=null&&c.sagittariusAStar){const S=this.starfield.externalGalaxy.getGalacticCenterWorldPosition(),w=S.clone().project(this.cameraRig.camera);if(w.z>=-1&&w.z<=1){const T=a.width/Math.max(1,a.height),A=(this.mouse.x-w.x)*T,R=this.mouse.y-w.y,N=Math.hypot(A,R),_=this.cameraRig.camera.position.distanceTo(S)>12e3?.18:.25;if(N<_){this.selectBody("Sagittarius A*",2200);return}}}this.raycaster.setFromCamera(this.mouse,this.cameraRig.camera);const r=[];this.planetBundles.forEach(S=>{r.push(S.surfaceMesh)}),(m=(d=this.starfield)==null?void 0:d.externalGalaxy)!=null&&m.sagittariusAStar&&(this.starfield.externalGalaxy.sagittariusAStar.hitMesh&&r.push(this.starfield.externalGalaxy.sagittariusAStar.hitMesh),this.starfield.externalGalaxy.sagittariusAStar.boundingMesh&&r.push(this.starfield.externalGalaxy.sagittariusAStar.boundingMesh));const n=this.raycaster.intersectObjects(r,!1);if(n.length>0){const S=n[0].object;if(S===((y=(v=(f=this.starfield)==null?void 0:f.externalGalaxy)==null?void 0:v.sagittariusAStar)==null?void 0:y.hitMesh)||S===((g=(b=(M=this.starfield)==null?void 0:M.externalGalaxy)==null?void 0:b.sagittariusAStar)==null?void 0:g.boundingMesh)||S.name.includes("sagittarius")){this.selectBody("Sagittarius A*",2200);return}for(const w of this.planetBundles.values())if(w.surfaceMesh===S){this.selectBody(w.definition.name);break}}});u(this,"onResize",()=>{if(!this.container)return;const e=this.container.clientWidth||window.innerWidth,i=this.container.clientHeight||window.innerHeight;this.renderer.setSize(e,i),this.cameraRig.handleResize(e,i),this.lens.setSize(e,i)});u(this,"animate",()=>{var s,o,r;if(!this.isRunning)return;this.animationFrameId=requestAnimationFrame(this.animate);const e=performance.now(),i=Math.min(Math.max((e-this.lastFrameTime)*.001,.001),.1);this.lastFrameTime=e,this.clock.update(e);const a=this.clock.getJulianDateTDB()-Re.J2000_JD;this.propagateAll(a);const t=this.planetBundles.get("Sun");if(t){const n=e*.001,l=t.surfaceMesh.material;if((s=l.uniforms)!=null&&s.time&&(l.uniforms.time.value=n),t.glowMeshes)for(const c of t.glowMeshes){const d=c.material;(o=d.uniforms)!=null&&o.time&&(d.uniforms.time.value=n)}if(t.prominencesGroup){for(const c of t.prominencesGroup.children)if(c instanceof B){const d=c.material;(r=d.uniforms)!=null&&r.time&&(d.uniforms.time.value=n)}}}this.cameraRig.update(),this.starfield.update(this.cameraRig.camera.position,i,this.cameraRig.getVelocity(),this.cameraRig.getZoomVelocity(),this.cameraRig.camera),this.lens.render(e*.001),this.onTelemetryUpdate&&e-this.lastTelemetryTime>=at.TELEMETRY_INTERVAL_MS&&(this.lastTelemetryTime=e,this.dispatchTelemetry())});this.container=e,this.onTelemetryUpdate=i,this.selectedBody=Y.getBody("Mercury")||Y.getAllBodies()[0],this.scene=new qa,this.scene.background=new E(131333),this.renderer=new Xa({antialias:!0,powerPreference:"high-performance"});const a=e.clientWidth||window.innerWidth,t=e.clientHeight||window.innerHeight;this.renderer.setSize(a,t),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.outputColorSpace=Le,this.renderer.toneMapping=Wt,this.renderer.toneMappingExposure=1.05,this.renderer.domElement.style.position="absolute",this.renderer.domElement.style.top="0",this.renderer.domElement.style.left="0",this.renderer.domElement.style.width="100%",this.renderer.domElement.style.height="100%",this.renderer.domElement.style.display="block",e.appendChild(this.renderer.domElement),this.cameraRig=new ft(e),this.lens=new Yi(this.renderer,this.scene,this.cameraRig.camera),this.setupLighting(),this.starfield=new Ge,this.scene.add(this.starfield.group),this.asteroidBelt=new Li(this.transform),this.scene.add(this.asteroidBelt.mesh),this.orbitLinesGroup.visible=!1,this.scene.add(this.orbitLinesGroup),this.setupBodies(),this.orbitLinesEpochDays=this.clock.getJulianDateTDB()-Re.J2000_JD,this.rebuildOrbitLines(),this.propagateAll(this.clock.getJulianDateTDB()-Re.J2000_JD),this.scene.updateMatrixWorld(!0),this.selectBody("Mercury",1800),this.setupInteraction(),this.animate()}setupLighting(){const e=new $a(16775917,2.4,0,0);e.position.set(0,0,0),e.castShadow=!1,this.scene.add(e);const i=new Qa(2238008,.25);this.scene.add(i)}setupBodies(){const e=Y.getAllBodies();for(const i of e){const a=hi.createPlanet(i);this.scene.add(a.bodyGroup),this.planetBundles.set(i.name,a)}}rebuildOrbitLines(){for(;this.orbitLinesGroup.children.length>0;){const i=this.orbitLinesGroup.children[0];this.orbitLinesGroup.remove(i),i instanceof Ee&&(i.geometry.dispose(),i.material.dispose())}this.moonOrbitLines.clear();const e=Y.getAllBodies();for(const i of e)if(i.category!=="moon"&&i.orderFromSun>0){const a=Bt.createOrbitLine(i,this.transform,this.orbitLinesEpochDays);a&&this.orbitLinesGroup.add(a)}for(const i of e)if(i.category==="moon"&&i.parentId){const a=Y.getParent(i);if(a){const t=Bt.createMoonOrbitLine(i,a,this.transform,this.orbitLinesEpochDays);t&&(this.orbitLinesGroup.add(t),this.moonOrbitLines.set(i.name,t))}}}setScaleMode(e){this.transform.mode!==e&&(this.transform.mode=e,this.cameraRig.distanceModel=e,this.planetBundles.forEach(i=>{const a=this.transform.getVisualRadius(i.definition);i.visualRadius=a;const s=1-(i.definition.physical.flattening||0);if(i.surfaceMesh.scale.set(a,a*s,a),i.nightMesh&&i.nightMesh.scale.set(a,a*s,a),i.cloudMesh&&i.cloudMesh.scale.set(a,a,a),i.atmosphereMesh&&i.atmosphereMesh.scale.set(a,a,a),i.ringMesh){i.ringMesh.scale.set(a,a,a);const o=i.ringMesh.material;o.uniforms&&o.uniforms.saturnRadius&&(o.uniforms.saturnRadius.value=a)}i.glowMeshes&&i.glowMeshes.forEach(o=>o.scale.set(a,a,a))}),this.rebuildOrbitLines())}setLensProfile(e){this.lens.setProfile(e)}cycleLensProfile(){return this.lens.cycleProfile()}resetLook(){this.cameraRig.resetLook()}toggleConstellations(){return this.starfield.toggleConstellations()}toggleAsteroidBelt(){const e=!this.asteroidBelt.isVisible();return this.asteroidBelt.setVisible(e),e}toggleOrbits(){return this.orbitLinesGroup.visible=!this.orbitLinesGroup.visible,this.orbitLinesGroup.visible}setupInteraction(){this.renderer.domElement.addEventListener("mousedown",this.onPointerDown),this.renderer.domElement.addEventListener("mousemove",this.onCanvasMouseMove),this.renderer.domElement.addEventListener("click",this.onCanvasClick),window.addEventListener("resize",this.onResize)}selectBody(e,i=1800){if(e==="Sagittarius A*"||e==="Sgr A*"||e==="sagittarius_a_star"){const t=Y.getSagittariusAStar();if(t){this.selectedBody=t;const s=this.starfield.externalGalaxy.sagittariusAStar.group;this.cameraRig.focusCinematic(s,180,t.name,i);return}}const a=this.planetBundles.get(e);a&&(this.selectedBody=a.definition,this.cameraRig.focusCinematic(a.bodyGroup,a.visualRadius,a.definition.name,i,void 0,a.definition.physical.meanRadiusKm))}resetView(){this.selectedBody=Y.getBody("Sun")||Y.getAllBodies()[0],this.cameraRig.resetToOverview(),this.cameraRig.focusedPhysicalRadiusKm=this.selectedBody.physical.meanRadiusKm}applyBodyFrame(e,i,a=0){this.tmpMatrix.makeBasis(this.tmpX.set(i.xAxis[0],i.xAxis[1],i.xAxis[2]),this.tmpY.set(i.yAxis[0],i.yAxis[1],i.yAxis[2]),this.tmpZ.set(i.zAxis[0],i.zAxis[1],i.zAxis[2])),e.bodyGroup.quaternion.setFromRotationMatrix(this.tmpMatrix),e.surfaceMesh.rotation.y=i.spinRad,e.nightMesh&&(e.nightMesh.rotation.y=i.spinRad),e.cloudMesh&&(e.cloudMesh.rotation.y=i.spinRad+a)}applyFallbackSpin(e,i){const a=e.definition;e.bodyGroup.rotation.set(0,0,L.degToRad(a.physical.axialTiltDeg||0));const t=a.physical.rotationPeriodHours||a.orbit.orbitalPeriodDays*24||24;e.surfaceMesh.rotation.y=i*24/t*Math.PI*2}propagateAll(e){const i=Y.getAllBodies(),a=new Map,t=e;for(const s of i){if(s.category==="moon")continue;const o=this.planetBundles.get(s.name);if(!o)continue;if(s.orderFromSun===0)o.bodyGroup.position.set(0,0,0),a.set(s.id,[0,0,0]);else{const n=ye.propagate(s.orbit,t);this.latestPhysicalStates.set(s.name,n);const l=this.transform.toRenderPosition(n.positionKm,s);if(o.bodyGroup.position.set(l[0],l[1],l[2]),a.set(s.id,l),s.name==="Saturn"&&o.ringMesh){const c=o.ringMesh.material;c.uniforms&&c.uniforms.saturnCenter&&(c.uniforms.saturnCenter.value.set(l[0],l[1],l[2]),c.uniforms.saturnRadius.value=o.visualRadius)}}const r=$i(s.name,t);r?this.applyBodyFrame(o,r,s.name==="Earth"?t/40*Math.PI*2:0):this.applyFallbackSpin(o,t)}for(const s of i){if(s.category!=="moon"||!s.parentId)continue;const o=this.planetBundles.get(s.name);if(!o)continue;const r=Y.getParent(s);if(!r)continue;const n=this.latestPhysicalStates.get(r.name),l=a.get(r.id)||[0,0,0],c=r.physical.gmKm3S2??(r.physical.massKg?r.physical.massKg*66743e-24:void 0),d=s.physical.gmKm3S2??(s.physical.massKg?s.physical.massKg*66743e-24:0),m=c!==void 0?c+d:ye.GM_SUN,f=ye.propagate(s.orbit,t,m),v=(n==null?void 0:n.positionKm)||[0,0,0],y=(n==null?void 0:n.velocityKmPerSec)||[0,0,0],M=[v[0]+f.positionKm[0],v[1]+f.positionKm[1],v[2]+f.positionKm[2]],b=[y[0]+f.velocityKmPerSec[0],y[1]+f.velocityKmPerSec[1],y[2]+f.velocityKmPerSec[2]];this.latestPhysicalStates.set(s.name,{positionKm:M,velocityKmPerSec:b,distanceKm:Math.hypot(...M),speedKmPerSec:Math.hypot(...b),trueAnomalyDeg:f.trueAnomalyDeg,eccentricAnomalyDeg:f.eccentricAnomalyDeg});const g=this.transform.toMoonRenderPosition(f.positionKm,s,l,r);o.bodyGroup.position.set(g[0],g[1],g[2]);const S=this.moonOrbitLines.get(s.name);S&&S.position.set(l[0],l[1],l[2]),s.name==="Hyperion"?this.applyFallbackSpin(o,t):this.applyBodyFrame(o,Qi(f.positionKm,f.velocityKmPerSec))}this.asteroidBelt.updatePositions(t),Math.abs(t-this.orbitLinesEpochDays)>365&&(this.orbitLinesEpochDays=t,this.rebuildOrbitLines())}jumpToScale(e){if(e==="sgr_a"){this.selectBody("Sagittarius A*");return}this.cameraRig.jumpToScale(e)}dispatchTelemetry(){const e=this.latestPhysicalStates.get(this.selectedBody.name);let i=(e==null?void 0:e.distanceKm)||this.selectedBody.orbit.semiMajorAxisKm,a=(e==null?void 0:e.speedKmPerSec)||0;(this.selectedBody.id==="sagittarius_a_star"||this.selectedBody.name==="Sagittarius A*")&&(i=2553e14,a=122400);const t=new P;this.cameraRig.camera.getWorldDirection(t);const s=Math.atan2(t.x,t.z)*L.RAD2DEG,o=Math.asin(t.y)*L.RAD2DEG,r=this.cameraRig.getObserverScaleMetric(),n=this.cameraRig.getTravelSpeed(),l={id:this.selectedBody.id,name:this.selectedBody.name,category:this.selectedBody.category,parentId:this.selectedBody.parentId,parentName:this.selectedBody.parentName,distanceKm:i,apparentSpeedKmS:a,radiusKm:this.selectedBody.physical.meanRadiusKm,orbitalPeriodDays:this.selectedBody.orbit.orbitalPeriodDays,axialTiltDeg:this.selectedBody.physical.axialTiltDeg||0,colorHex:this.selectedBody.physical.colorHex||"#ffffff"};this.onTelemetryUpdate({speedKmS:a,lookAzimuthDeg:Math.round(s),lookElevationDeg:Math.round(o),activeTarget:l,timeScale:this.clock.timeMultiplier,julianDate:this.clock.getJulianDate(),utcIso:this.clock.getIsoString(),scaleMode:this.transform.mode,isPaused:this.clock.isPaused,constellationsVisible:this.starfield.areConstellationsVisible(),asteroidBeltVisible:this.asteroidBelt.isVisible(),orbitsVisible:this.orbitLinesGroup.visible,observerScaleMetric:r.formatted,observerDomain:r.domain,travelSpeed:Math.round(n),cameraDistance:Math.round(r.distance),lensProfile:this.lens.profile.name})}dispose(){this.isRunning=!1,this.animationFrameId!==null&&cancelAnimationFrame(this.animationFrameId),window.removeEventListener("resize",this.onResize),this.renderer.domElement.removeEventListener("mousedown",this.onPointerDown),this.renderer.domElement.removeEventListener("mousemove",this.onCanvasMouseMove),this.renderer.domElement.removeEventListener("click",this.onCanvasClick),this.cameraRig.dispose(),this.lens.dispose(),this.starfield.dispose(),this.asteroidBelt.dispose(),this.planetBundles.forEach(e=>{e.surfaceMesh.geometry.dispose(),e.surfaceMesh.material.dispose(),e.nightMesh&&(e.nightMesh.geometry.dispose(),e.nightMesh.material.dispose()),e.cloudMesh&&(e.cloudMesh.geometry.dispose(),e.cloudMesh.material.dispose()),e.atmosphereMesh&&(e.atmosphereMesh.geometry.dispose(),e.atmosphereMesh.material.dispose()),e.ringMesh&&(e.ringMesh.geometry.dispose(),e.ringMesh.material.dispose()),e.glowMeshes&&e.glowMeshes.forEach(i=>{i.geometry.dispose(),i.material.dispose()}),e.prominencesGroup&&e.prominencesGroup.children.forEach(i=>{i instanceof B&&(i.geometry.dispose(),i.material.dispose())})}),this.renderer.dispose(),this.renderer.domElement.parentElement&&this.renderer.domElement.parentElement.removeChild(this.renderer.domElement)}};u(at,"TELEMETRY_INTERVAL_MS",100);let yt=at;const xt={Mercury:{name:"Mercury",category:"planet",eyebrow:"PLANET",accentColor:"#E8927C",eyebrowColor:"#fabfad",distanceAU:"0.39 AU",textureThumb:"textures/thumbs/mercury.webp",monographText:"THE CLOSEST PLANET TO THE SUN. IT CIRCLES THE SUN FASTER THAN ALL THE OTHER PLANETS, WHICH IS WHY ROMANS NAMED IT AFTER THEIR SWIFT-FOOTED MESSENGER GOD.",extendedLore:"Mercury is a world of fierce cosmic extremes. With virtually no atmosphere to trap heat, midday temperatures soar to 430°C (800°F), while the sunless night plummets to -180°C (-290°F). Its massive metallic core occupies roughly 85% of the planet's total radius, suggesting a colossal primordial impact stripped away much of its ancient silicate mantle.",missions:[{name:"Mariner 10",year:"1974–1975",agency:"NASA",role:"First flybys; mapped 45% of surface"},{name:"MESSENGER",year:"2011–2015",agency:"NASA",role:"First orbiter; discovered polar water ice in permanently shadowed craters"},{name:"BepiColombo",year:"2025–2026",agency:"ESA / JAXA",role:"Dual orbiter study of magnetosphere and exosphere"}]},Venus:{name:"Venus",category:"planet",eyebrow:"PLANET",accentColor:"#b45d15",eyebrowColor:"#e58e45",distanceAU:"0.723 AU",textureThumb:"textures/thumbs/venus_atmosphere.webp",monographText:"NAMED FOR THE ROMAN GODDESS OF LOVE AND BEAUTY. ENSHROUDED IN DENSE OPAQUE CLOUDS OF SULFURIC ACID, IT SUFFERS A RUNAWAY GREENHOUSE EFFECT WITH SURFACE TEMPERATURES REACHING 465°C.",extendedLore:"Venus is Earth's twin in diameter and mass, but an infernal counterpart in environment. A crushing supercritical carbon dioxide atmosphere exerts 92 times Earth's sea-level pressure. Venus rotates backwards compared to most planets, with the Sun rising in the west, and its day is longer than its orbital year.",missions:[{name:"Venera 7",year:"1970",agency:"Soviet Union",role:"First human spacecraft to softly land and transmit data from another planet"},{name:"Magellan",year:"1990–1994",agency:"NASA",role:"Global radar mapping revealing extensive volcanism and lava channels"},{name:"Akatsuki",year:"2015–Present",agency:"JAXA",role:"Atmospheric super-rotation and cloud dynamics investigation"}]},Earth:{name:"Earth",category:"planet",eyebrow:"PLANET",accentColor:"#26daaa",eyebrowColor:"#7bf0d0",distanceAU:"1.000 AU",textureThumb:"textures/thumbs/earth_daymap.webp",monographText:"OUR HOME AND THE ONLY KNOWN SANCTUARY OF LIFE IN THE COSMOS. A VIBRANT BLUE MARBLE ENVELOPED BY A NITROGEN-OXYGEN ATMOSPHERE, WITH LIQUID OCEANS COVERING SEVENTY PERCENT OF ITS SURFACE.",extendedLore:"Earth resides at the temperate sweet spot of the circumstellar habitable zone. Dynamic plate tectonics continuously recycle carbon, while a vigorous geodynamo generates a protective magnetosphere shielding the biosphere from solar wind stripping and high-energy galactic cosmic rays.",missions:[{name:"Apollo Program",year:"1961–1972",agency:"NASA",role:"Human lunar landings; transformed humanity's ecological perspective of Earth"},{name:"Terra & Aqua",year:"1999–Present",agency:"NASA",role:"Comprehensive global climate and ocean monitoring system"},{name:"Copernicus Sentinel",year:"2014–Present",agency:"ESA",role:"Constellation observing biosphere, ice sheets, and atmosphere"}]},Mars:{name:"Mars",category:"planet",eyebrow:"PLANET",accentColor:"#e55f45",eyebrowColor:"#fca595",distanceAU:"1.524 AU",textureThumb:"textures/thumbs/mars.webp",monographText:"THE RED PLANET, COLORED BY IRON OXIDE SPREAD ACROSS ITS WINDSWEPT DESERTS. HOME TO OLYMPUS MONS, THE TALLEST VOLCANO IN THE SOLAR SYSTEM, AND VAST DRY RIVER VALLEYS.",extendedLore:"Though frozen and desiccated today, geochemical fingerprints captured by rovers prove ancient Mars possessed lakes, river deltas, and a thicker insulating atmosphere over three billion years ago. Its thin CO2 atmosphere generates continent-scale dust storms that periodically veil the entire globe.",missions:[{name:"Viking 1 & 2",year:"1976",agency:"NASA",role:"First successful long-duration Mars surface landers and biological tests"},{name:"Curiosity",year:"2012–Present",agency:"NASA",role:"Discovered ancient habitable lacustrine environments in Gale Crater"},{name:"Perseverance",year:"2021–Present",agency:"NASA",role:"Searching for ancient microbial biosignatures and caching core samples"}]},Jupiter:{name:"Jupiter",category:"planet",eyebrow:"PLANET",accentColor:"#f59e0b",eyebrowColor:"#fcd34d",distanceAU:"5.203 AU",textureThumb:"textures/thumbs/jupiter.webp",monographText:"THE TITAN OF OUR SOLAR SYSTEM, MORE THAN TWICE AS MASSIVE AS ALL THE OTHER PLANETS COMBINED. A SWIRLING GAS GIANT DOMINATED BY THE CENTURIES-OLD GREAT RED SPOT AND NEARLY A HUNDRED KNOWN MOONS.",extendedLore:"Jupiter acted as the primary gravitational architect of the early Solar System, shaping asteroid orbits and scattering comets. Below its dynamic ammonia cloud belts, hydrogen transitions into liquid and eventually into an exotic state of liquid metallic hydrogen that conducts immense electrical currents, powering the most powerful planetary magnetic field in the system.",missions:[{name:"Voyager 1 & 2",year:"1979",agency:"NASA",role:"Discovered Jovian rings and active volcanism on Io"},{name:"Galileo",year:"1995–2003",agency:"NASA",role:"First orbiter; gathered initial evidence of subsurface ocean on Europa"},{name:"Juno",year:"2016–Present",agency:"NASA",role:"Mapping gravitational anomalies and deep atmospheric water abundance"}]},Saturn:{name:"Saturn",category:"planet",eyebrow:"PLANET",accentColor:"#b29d81",eyebrowColor:"#d4c5b0",distanceAU:"9.539 AU",textureThumb:"textures/thumbs/saturn.webp",monographText:"A MAJESTIC WORLD ADORNED BY AN EXTRAORDINARY SYSTEM OF ICY RINGS EXTENDING HUNDREDS OF THOUSANDS OF KILOMETERS INTO THE VOID, ACCOMPANIED BY THE HAZE-CLOAKED MOON TITAN.",extendedLore:"Saturn's main rings span about 282,000 km in diameter yet are astonishingly paper-thin—averaging barely 10 to 30 meters in vertical thickness. Made almost entirely of water-ice particles ranging from dust grains to house-sized boulders, the rings are sustained and sculpted by subtle gravitational resonances with shepherd moons.",missions:[{name:"Pioneer 11",year:"1979",agency:"NASA",role:"First close encounter with Saturn and discovery of the F Ring"},{name:"Cassini-Huygens",year:"2004–2017",agency:"NASA / ESA / ASI",role:"Thirteen-year orbital odyssey; landed probe on Titan, found Enceladus plumes"},{name:"Dragonfly",year:"Launching 2028",agency:"NASA",role:"Rotorcraft lander to explore prebiotic chemistry on Titan"}]},Uranus:{name:"Uranus",category:"planet",eyebrow:"PLANET",accentColor:"#8dcdd8",eyebrowColor:"#b3e8f0",distanceAU:"19.18 AU",textureThumb:"textures/thumbs/uranus.webp",monographText:"AN ICE GIANT TILTED SO DRAMATICALLY ON ITS SIDE THAT AT ITS SOLSTICES ONE POLE POINTS ALMOST DIRECTLY AT THE SUN, DRIVING EXTREME DECADES-LONG SEASONS.",extendedLore:"With an axial tilt of 97.77°, Uranus literally rolls along its orbital path like a ball. Scientists theorize a sequence of Earth-sized protoplanetary impacts knocked the giant onto its side early in solar history. Its pale aquamarine coloration originates from methane gas in its upper atmosphere absorbing red light wavelengths.",missions:[{name:"Voyager 2",year:"1986",agency:"NASA",role:"Only spacecraft to encounter Uranus; discovered 10 moons and 2 new rings"},{name:"Uranus Orbiter & Probe",year:"Proposed 2030s",agency:"NASA Decadal",role:"Flagship mission concept prioritized to explore ice giant interiors"}]},Neptune:{name:"Neptune",category:"planet",eyebrow:"PLANET",accentColor:"#4f83e2",eyebrowColor:"#7ca8ff",distanceAU:"30.06 AU",textureThumb:"textures/thumbs/neptune.webp",monographText:"THE MOST DISTANT MAJOR PLANET, SHROUDED IN AN INTENSE DEEP-AZURE METHANE ATMOSPHERE WHERE SUPERSONIC WINDS SURPASS TWO THOUSAND KILOMETERS PER HOUR.",extendedLore:"Neptune was the first planet located through mathematical prediction rather than empirical observation: slight perturbations in Uranus's orbit allowed French astronomer Urbain Le Verrier to calculate its precise position in 1846. It harbors the retrograde moon Triton, a captured Kuiper Belt dwarf world exhibiting nitrogen cryovolcanoes.",missions:[{name:"Voyager 2",year:"1989",agency:"NASA",role:"Close flyby; detected the Great Dark Spot and geysers on Triton"}]},Pluto:{name:"Pluto",category:"dwarf_planet",eyebrow:"DWARF PLANET",accentColor:"#FF8732",eyebrowColor:"#ffa463",distanceAU:"39.48 AU",textureThumb:"textures/thumbs/moon.webp",monographText:"SENTINEL OF THE KUIPER BELT, BEARING THE GLOWING NITROGEN ICE PLAINS OF TOMBAUGH REGIO AND SHARING A SYNCHRONOUS GRAVITATIONAL DANCE WITH ITS COMPANION CHARON.",extendedLore:"Reclassified as a dwarf planet in 2006, Pluto revealed itself during the 2015 New Horizons flyby as a geologically active wonderland. It features convection cells of churned nitrogen-carbon-monoxide ice, water-ice mountains towering 3,500 meters into its thin blue hazy atmosphere, and a likely deep subsurface liquid ocean.",missions:[{name:"New Horizons",year:"2015",agency:"NASA",role:"Historic historic flyby capturing high-resolution imagery of Tombaugh Regio"}]},Moon:{name:"Moon",category:"moon",eyebrow:"NATURAL SATELLITE · EARTH I",accentColor:"#d1d5db",eyebrowColor:"#e5e7eb",distanceAU:"1.000 AU",textureThumb:"textures/thumbs/moon.webp",monographText:"EARTH'S CONSTANT CELESTIAL COMPANION, TIDALLY LOCKED IN AN ANCIENT GRAVITATIONAL EMBRACE. ITS HIGHLANDS AND BASALTIC MARIA PRESERVE FOUR BILLION YEARS OF COSMIC HISTORY.",extendedLore:"Formed ~4.5 billion years ago from the debris of a giant collision between the proto-Earth and a Mars-sized protoplanet named Theia. The Moon stabilizes Earth's rotational tilt, modulating climate extremes and generating oceanic tides.",missions:[{name:"Apollo 11",year:"1969",agency:"NASA",role:"First human landing on another celestial world"},{name:"LRO",year:"2009–Present",agency:"NASA",role:"High-resolution sub-meter 3D laser altimetry and mapping"},{name:"Artemis I",year:"2022",agency:"NASA",role:"Uncrewed lunar orbital qualification flight for deep space exploration"}]},Europa:{name:"Europa",category:"moon",eyebrow:"OCEAN MOON · JUPITER II",accentColor:"#7dd3fc",eyebrowColor:"#bae6fd",distanceAU:"5.203 AU",textureThumb:"textures/thumbs/moon.webp",monographText:"A SMOOTH CRUST OF WATER ICE FRACTURED BY REDDISH LINEAE, CONCEALING A VAST GLOBAL SALTWATER OCEAN CONTAINING TWICE THE WATER OF ALL EARTH'S OCEANS COMBINED.",extendedLore:"Tidally flexed by orbital resonance with Io and Ganymede, Europa's rocky mantle produces geothermal heating that keeps its deep subsurface ocean in a liquid state. Possible water plumes detected by Hubble make it one of humankind's top destinations in the search for extraterrestrial habitability.",missions:[{name:"Galileo",year:"1995–2003",agency:"NASA",role:"Discovered induced magnetic field evidence for a subsurface saline ocean"},{name:"Europa Clipper",year:"2024–Present",agency:"NASA",role:"Dedicated mission equipped with ice-penetrating radar to confirm habitability"}]},Io:{name:"Io",category:"moon",eyebrow:"VOLCANIC MOON · JUPITER I",accentColor:"#facc15",eyebrowColor:"#fef08a",distanceAU:"5.203 AU",textureThumb:"textures/thumbs/moon.webp",monographText:"THE MOST VOLCANICALLY ACTIVE BODY IN THE SOLAR SYSTEM, SCARRED BY HUNDREDS OF ACTIVE VOLCANOES DRIVEN BY INTENSE GRAVITATIONAL TIDAL FRICTION.",extendedLore:"Caught in an eccentric resonance between Jupiter and its sibling moons, Io undergoes constant tidal flexing that generates ferocious internal heat, driving molten silicate lava lakes and sulfur plumes hundreds of kilometers into space.",missions:[{name:"Voyager 1",year:"1979",agency:"NASA",role:"First observation of active extraterrestrial volcanism"},{name:"Juno",year:"2016–Present",agency:"NASA",role:"Close flybys mapping polar volcanic hotspots and magma oceans"}]},Ganymede:{name:"Ganymede",category:"moon",eyebrow:"GIANT MOON · JUPITER III",accentColor:"#cbd5e1",eyebrowColor:"#e2e8f0",distanceAU:"5.203 AU",textureThumb:"textures/thumbs/moon.webp",monographText:"THE LARGEST MOON IN THE SOLAR SYSTEM, EVEN EXCEEDING MERCURY IN DIAMETER, AND THE ONLY SATELLITE BEARING AN INTERNALLY GENERATED MAGNETIC FIELD.",extendedLore:"Possesses a molten iron-rich core that generates an intrinsic magnetosphere. Beneath its grooved and fractured tectonic ice shell lies a deep subterranean liquid ocean separated by high-pressure ice phases.",missions:[{name:"Galileo",year:"1995–2003",agency:"NASA",role:"Identified intrinsic dipolar magnetic field"},{name:"JUICE",year:"2023–Present",agency:"ESA",role:"En route to enter permanent orbit around Ganymede in 2034"}]},Titan:{name:"Titan",category:"moon",eyebrow:"HYDROCARBON WORLD · SATURN VI",accentColor:"#f59e0b",eyebrowColor:"#fde68a",distanceAU:"9.539 AU",textureThumb:"textures/thumbs/moon.webp",monographText:"THE ONLY MOON WITH A DENSE ATMOSPHERE AND STABLE SURFACE SEAS, WHERE METHANE AND ETHANE FORM A COMPLETE METEOROLOGICAL HYDROLOGIC CYCLE.",extendedLore:"Exceeding Mercury in size, Titan possesses an orange smoggy atmosphere whose surface pressure is about 1.5 times Earth's at sea level. Cryogenic rivers carve canyon networks feeding liquid hydrocarbon seas like Kraken Mare.",missions:[{name:"Cassini-Huygens",year:"2004–2017",agency:"NASA / ESA",role:"Huygens landed directly on Titan's surface in 2005"},{name:"Dragonfly",year:"Planned 2028",agency:"NASA",role:"Rotorcraft lander to explore prebiotic organic chemistry"}]},Enceladus:{name:"Enceladus",category:"moon",eyebrow:"CRYOVOLCANIC MOON · SATURN II",accentColor:"#e0f2fe",eyebrowColor:"#f0f9ff",distanceAU:"9.539 AU",textureThumb:"textures/thumbs/moon.webp",monographText:"AN IMMACULATE WORLD OF PURE REFLECTIVE ICE, ERUPTING GIANT HYDROTHERMAL GEYSERS FROM TIGER STRIPES OVER ITS SOUTH POLAR TERRAIN.",extendedLore:"Enceladus possesses a global liquid saltwater ocean in direct physical contact with an active hydrothermal rocky seafloor. Cassini detected complex organic molecules and molecular hydrogen in its plumes, pointing to ongoing hydrothermal chemistry on the seafloor.",missions:[{name:"Cassini",year:"2005–2017",agency:"NASA / ESA",role:"Flew directly through erupting plumes, sampling water vapor, salts, and organics"}]},Ceres:{name:"Ceres",category:"dwarf_planet",eyebrow:"DWARF PLANET · ASTEROID BELT",accentColor:"#a1a1aa",eyebrowColor:"#d4d4d8",distanceAU:"2.767 AU",textureThumb:"textures/thumbs/moon.webp",monographText:"EMPRESS OF THE ASTEROID BELT, HOLDING A THIRD OF ITS ENTIRE MASS. AN ICE-RICH RELICT WORLD FEATURING RADIANT SODIUM CARBONATE SALT DOMES.",extendedLore:"Ceres is a differentiated protoplanet containing significant quantities of water ice and hydrous minerals. Occator Crater hosts the bright Cerealia Facula, formed by subsurface brine percolation and cryovolcanic extrusion.",missions:[{name:"Dawn",year:"2015–2018",agency:"NASA",role:"Orbited Ceres for three years, discovering active cryovolcanism and hydrated minerals"}]},Sun:{name:"Sun",category:"star",eyebrow:"STAR",accentColor:"#ffaa33",eyebrowColor:"#ffe4a0",distanceAU:"0.000 AU",textureThumb:"textures/thumbs/sun.webp",monographText:"THE GLOWING HEART OF OUR SYSTEM, CONTAINING OVER NINETY-NINE POINT EIGHT PERCENT OF ALL MASS. A THERMONUCLEAR ENGINE POWERING ALL LIGHT, LIFE, AND GRAVITATIONAL HARMONY.",extendedLore:"Every second in the solar core, 600 million tons of hydrogen undergo thermonuclear fusion into helium, converting 4 million tons of matter into pure radiant energy. The photon diffusion through the dense radiative zone takes over 100,000 years to reach the convective layer and escape as solar light.",missions:[{name:"SOHO",year:"1995–Present",agency:"ESA / NASA",role:"Continuous monitoring of helioseismology and coronal mass ejections"},{name:"Parker Solar Probe",year:"2018–Present",agency:"NASA",role:"Closest spacecraft to Sun, diving directly through the outer corona"},{name:"Solar Orbiter",year:"2020–Present",agency:"ESA / NASA",role:"Capturing the first close-up images of the Sun's polar regions"}]},"Sagittarius A*":{name:"Sagittarius A*",category:"black_hole",eyebrow:"SUPERMASSIVE BLACK HOLE",accentColor:"#f59e0b",eyebrowColor:"#fde68a",distanceAU:"1.71 × 10⁹ AU (26,990 LY)",textureThumb:"textures/thumbs/milky_way.webp",monographText:"THE 4.3 MILLION SOLAR MASS SUPERMASSIVE BLACK HOLE AT THE DYNAMICAL HEART OF THE MILKY WAY. ITS EVENT HORIZON TRAPS ALL LIGHT, BENDING SPACETIME INTO A RELATIVISTIC PHOTON RING.",extendedLore:"Sagittarius A* (Sgr A*) anchors the Milky Way Galaxy with a mass of 4.297 ± 0.012 × 10⁶ M☉ located 8.277 ± 0.033 kpc (~26,990 light-years) from Earth. In May 2022, the Event Horizon Telescope (EHT) collaboration released the first direct horizon-scale image of its shadow, resolving an angular diameter of 51.8 ± 2.3 microarcseconds that confirms Einstein's General Relativity. Matter orbiting near the innermost stable circular orbit (ISCO at 3.0 r_s) reaches speeds of 0.408 c (122,400 km/s), generating extreme relativistic Doppler beaming and gravitational redshift, framed by high-velocity stars of the central nuclear S-cluster.",missions:[{name:"Event Horizon Telescope (EHT)",year:"2022",agency:"Global Consortium / NSF / ESO",role:"First direct millimeter-wave imaging of Sgr A* event horizon shadow"},{name:"GRAVITY / ESO VLTI",year:"2018–Present",agency:"ESO",role:"Detection of gravitational redshift in star S2 orbit and orbital flares near ISCO"},{name:"Chandra X-ray Observatory",year:"1999–Present",agency:"NASA",role:"Long-term monitoring of hot gas accretion and high-energy flare eruptions"},{name:"Neil Gehrels Swift Observatory",year:"2004–Present",agency:"NASA",role:"Daily multiwavelength monitoring of Galactic Center flaring activity"}]}};function Zi(p){return xt[p]?xt[p]:{name:p,category:"moon",eyebrow:"CELESTIAL BODY",accentColor:"#93c5fd",eyebrowColor:"#bfdbfe",distanceAU:"—",textureThumb:"textures/thumbs/moon.webp",monographText:`${p.toUpperCase()} IS A DOCUMENTED COMPONENT OF THE SOLAR SYSTEM CATALOGUE.`,extendedLore:`${p}'s orbit is computed from NASA JPL orbital elements (Horizons / Small-Body Database).`,missions:[]}}/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const es=p=>p.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),ua=(...p)=>p.filter((e,i,a)=>!!e&&e.trim()!==""&&a.indexOf(e)===i).join(" ").trim();/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var ts={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const as=C.forwardRef(({color:p="currentColor",size:e=24,strokeWidth:i=2,absoluteStrokeWidth:a,className:t="",children:s,iconNode:o,...r},n)=>C.createElement("svg",{ref:n,...ts,width:e,height:e,stroke:p,strokeWidth:a?Number(i)*24/Number(e):i,className:ua("lucide",t),...r},[...o.map(([l,c])=>C.createElement(l,c)),...Array.isArray(s)?s:[s]]));/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const we=(p,e)=>{const i=C.forwardRef(({className:a,...t},s)=>C.createElement(as,{ref:s,iconNode:e,className:ua(`lucide-${es(p)}`,a),...t}));return i.displayName=`${p}`,i};/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const is=we("Calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ss=we("EyeOff",[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const os=we("Eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rs=we("Pause",[["rect",{x:"14",y:"4",width:"4",height:"16",rx:"1",key:"zuxfzm"}],["rect",{x:"6",y:"4",width:"4",height:"16",rx:"1",key:"1okwgv"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ns=we("Play",[["polygon",{points:"6 3 20 12 6 21 6 3",key:"1oa8hb"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ls=we("RotateCcw",[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kt=we("Search",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ut=we("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]),cs=["Sagittarius A*","Pluto","Neptune","Uranus","Saturn","Jupiter","Mars","Earth","Venus","Mercury"],hs=({telemetry:p,onSelectPlanet:e,onResetView:i,onTogglePlay:a,onSetTimeMultiplier:t,onSetScaleMode:s,onSeekDate:o,onResetToJ2000:r,onResetToNow:n,onToggleConstellations:l,onToggleAsteroidBelt:c,onToggleOrbits:d,onJumpToScale:m,onSetLens:f,onCycleLens:v})=>{const y=p==null?void 0:p.activeTarget,M=(p==null?void 0:p.isPaused)??!1,b=(p==null?void 0:p.timeScale)??1,g=(p==null?void 0:p.scaleMode)??"exploration",S=(p==null?void 0:p.julianDate)??2451545,w=(p==null?void 0:p.utcIso)??new Date().toISOString(),T=(p==null?void 0:p.constellationsVisible)??!0,A=(p==null?void 0:p.asteroidBeltVisible)??!0,R=(p==null?void 0:p.orbitsVisible)??!0,N=(p==null?void 0:p.observerScaleMetric)??"1.00 AU",U=(p==null?void 0:p.lensProfile)??"cinematic",_=(p==null?void 0:p.observerDomain)??"inner_system",Z=(p==null?void 0:p.travelSpeed)??0,[se,te]=C.useState(!0),[ue,re]=C.useState(!1),[be,ae]=C.useState(!1),[ne,me]=C.useState("all"),[pe,ma]=C.useState(""),[ze,At]=C.useState(w.slice(0,10)),[Me,Ve]=C.useState(!1),[Tt,We]=C.useState(!1),[Dt,ot]=C.useState(0),[Ct,rt]=C.useState(!0),[pa,Ye]=C.useState(!1),[Rt,Et]=C.useState(!1);C.useEffect(()=>{if(typeof window<"u"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches){ot(2);return}const x=setTimeout(()=>ot(1),500),D=setTimeout(()=>ot(2),1200);return()=>{clearTimeout(x),clearTimeout(D)}},[]),C.useEffect(()=>{const x=D=>{D.target instanceof HTMLInputElement||D.target instanceof HTMLTextAreaElement||(D.key===" "||D.code==="Space"?(D.preventDefault(),a()):D.key==="h"||D.key==="H"?(D.preventDefault(),te(le=>!le)):D.key==="Escape"?ue?re(!1):be||Me?(ae(!1),Ve(!1)):i():D.key==="o"||D.key==="O"?d==null||d():D.key==="c"||D.key==="C"?l==null||l():D.key==="b"||D.key==="B"?c==null||c():(D.key==="l"||D.key==="L")&&(v==null||v()))};return window.addEventListener("keydown",x),()=>window.removeEventListener("keydown",x)},[a,d,l,c,v,i,ue,be,Me]),C.useEffect(()=>{!Tt&&!Me&&At(w.slice(0,10))},[w,Tt,Me]);const z=(y==null?void 0:y.name)||"Mercury",ee=C.useMemo(()=>Zi(z),[z]),ke=C.useMemo(()=>{const x=[...Y.getAllBodies()],D=Y.getSagittariusAStar();return D&&x.unshift(D),x},[]),K=C.useMemo(()=>z==="Sagittarius A*"||z==="Sgr A*"||z==="sagittarius_a_star"?Y.getSagittariusAStar():Y.getBody(z),[z]),[ga,Nt]=C.useState(1),It=C.useRef(null);C.useEffect(()=>{z!==It.current&&(It.current=z,Nt(x=>x+1))},[z]),C.useEffect(()=>{if(rt(!0),Ye(!1),Rt)return;const x=setTimeout(()=>{Ye(!0)},5500),D=setTimeout(()=>{rt(!1),Ye(!1)},7100);return()=>{clearTimeout(x),clearTimeout(D)}},[ga,Rt]);const Je=C.useCallback(()=>{rt(!0),Ye(!1),Nt(x=>x+1)},[]),fa=C.useMemo(()=>ke.filter(x=>{if(ne==="planet"&&x.category!=="planet"||ne==="moon"&&x.category!=="moon"||ne==="minor"&&x.category!=="asteroid"&&x.category!=="dwarf_planet")return!1;if(pe.trim()){const D=pe.toLowerCase();return x.name.toLowerCase().includes(D)||x.category.toLowerCase().includes(D)||x.parentName&&x.parentName.toLowerCase().includes(D)}return!0}),[ke,ne,pe]),va=x=>{x.preventDefault(),We(!1);const D=Date.parse(ze);isNaN(D)||(o(D),Ve(!1))},ya=[{label:"1×",val:1},{label:"10×",val:10},{label:"100×",val:100},{label:"1 D/S",val:86400},{label:"1 M/S",val:2592e3},{label:"1 Y/S",val:31536e3}],xa="/solaris/";return se?h.jsxs("div",{className:"absolute inset-0 pointer-events-none select-none flex flex-col justify-between p-3 md:p-6 z-20 font-sans text-white/90 overflow-hidden",children:[h.jsx("div",{className:"absolute -top-16 left-1/2 -translate-x-1/2 w-[540px] h-32 rounded-[100%] bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-transparent blur-3xl pointer-events-none"}),h.jsxs("header",{className:"flex flex-col md:flex-row md:justify-between items-start gap-2 pointer-events-auto w-full z-30",children:[h.jsxs("div",{className:`flex flex-col gap-1.5 transition-all duration-1000 ${Dt>=0?"opacity-100 translate-y-0":"opacity-0 -translate-y-4"}`,children:[h.jsxs("div",{className:"flex items-baseline gap-3 relative group cursor-pointer",onClick:i,onKeyDown:x=>{(x.key==="Enter"||x.key===" ")&&(x.preventDefault(),i())},role:"button",tabIndex:0,"aria-label":"SOLARIS — reset to system overview",title:"Reset to Solaris Overview",children:[h.jsx("div",{className:"absolute -inset-2 bg-gradient-to-r from-amber-500/10 via-white/5 to-transparent rounded-lg blur-md opacity-40 group-hover:opacity-90 transition-opacity animate-corona-aura pointer-events-none"}),h.jsx("h1",{className:"relative text-xl md:text-2xl uppercase tracking-[0.52em] font-extralight drop-shadow-md select-none animate-solaris-shimmer",children:"SOLARIS"}),h.jsx("span",{className:"text-[9px] uppercase tracking-[0.32em] text-white/35 font-light hidden 2xl:inline",children:"Solar System Explorer"})]}),h.jsxs("div",{className:"flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-light text-white/60 bg-black/40 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/10 shadow-lg w-fit max-w-full mt-0.5 flex-wrap md:flex-nowrap md:whitespace-nowrap",children:[h.jsx("span",{className:`w-1.5 h-1.5 rounded-full ${M?"bg-amber-400":"bg-emerald-400 animate-pulse"}`}),h.jsxs("span",{className:"text-white/85",children:[w.replace("T"," ").slice(0,19)," UTC"]}),h.jsx("span",{className:"text-white/20",children:"·"}),h.jsxs("span",{children:["JD ",S.toFixed(2)]}),h.jsx("span",{className:"text-white/20",children:"·"}),h.jsx("span",{className:"text-amber-300/90 font-mono tracking-wider",children:N})]})]}),h.jsxs("div",{className:"hidden xl:flex items-center gap-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-1 shadow-lg pointer-events-auto",children:[h.jsxs("div",{className:"flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] tracking-[0.2em] font-light",children:[h.jsx("span",{className:`w-1.5 h-1.5 rounded-full ${Z>4?"bg-cyan-400 animate-ping":"bg-amber-400"}`}),h.jsx("span",{className:"text-white/40 uppercase",children:"SCALE:"}),h.jsx("span",{className:"text-white font-medium tracking-[0.12em]",children:N})]}),h.jsxs("div",{className:"flex items-center gap-0.5 text-[9px] uppercase tracking-[0.2em] font-light",children:[h.jsx("button",{onClick:()=>m==null?void 0:m("planetary"),className:`px-2.5 py-1 rounded-full transition-all duration-200 ${_==="planetary"?"bg-white/20 text-white font-medium shadow-sm border border-white/25":"text-white/40 hover:text-white/80"}`,children:"Planet"}),h.jsx("button",{onClick:()=>m==null?void 0:m("inner_system"),className:`px-2.5 py-1 rounded-full transition-all duration-200 ${_==="inner_system"?"bg-white/20 text-white font-medium shadow-sm border border-white/25":"text-white/40 hover:text-white/80"}`,children:"Inner Sys"}),h.jsx("button",{onClick:()=>m==null?void 0:m("outer_system"),className:`px-2.5 py-1 rounded-full transition-all duration-200 ${_==="outer_system"?"bg-white/20 text-white font-medium shadow-sm border border-white/25":"text-white/40 hover:text-white/80"}`,children:"Outer Sys"}),h.jsx("button",{onClick:()=>m==null?void 0:m("interstellar"),className:`px-2.5 py-1 rounded-full transition-all duration-200 ${_==="interstellar"?"bg-cyan-400/25 text-cyan-200 font-medium shadow-sm border border-cyan-400/35":"text-white/40 hover:text-white/80"}`,children:"Interstellar"}),h.jsx("button",{onClick:()=>m==null?void 0:m("galactic"),className:`px-2.5 py-1 rounded-full transition-all duration-200 ${_==="galactic"&&z!=="Sagittarius A*"?"bg-purple-400/25 text-purple-200 font-medium shadow-sm border border-purple-400/35":"text-white/40 hover:text-white/80"}`,children:"Milky Way"}),h.jsx("button",{onClick:()=>{m==null||m("sgr_a"),e("Sagittarius A*"),Je()},className:`px-2.5 py-1 rounded-full transition-all duration-200 ${z==="Sagittarius A*"?"bg-amber-500/30 text-amber-200 font-medium shadow-sm border border-amber-500/40":"text-white/40 hover:text-white/80"}`,children:"Sgr A*"})]})]}),h.jsxs("div",{className:"flex flex-wrap items-center justify-start md:justify-end gap-2 min-w-0",children:[h.jsxs("div",{className:"flex items-center bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-0.5 text-[10px] uppercase tracking-[0.2em] font-light shadow-lg",children:[h.jsx("button",{onClick:x=>{x.stopPropagation(),d==null||d()},title:"Toggle Orbit Lines (O)","aria-pressed":R,className:`px-3 py-1 rounded-full transition-all duration-200 ${R?"bg-white/15 text-white shadow-sm border border-white/20":"text-white/40 hover:text-white/80"}`,children:"Orbits"}),h.jsx("button",{onClick:x=>{x.stopPropagation(),l==null||l()},title:"Toggle constellation figures (C)","aria-pressed":T,className:`px-3 py-1 rounded-full transition-all duration-200 ${T?"bg-white/15 text-white shadow-sm border border-white/20":"text-white/40 hover:text-white/80"}`,children:"Constellations"}),h.jsx("button",{onClick:x=>{x.stopPropagation(),c==null||c()},title:"Toggle Asteroid Belt (B)","aria-pressed":A,className:`px-3 py-1 rounded-full transition-all duration-200 ${A?"bg-white/15 text-white shadow-sm border border-white/20":"text-white/40 hover:text-white/80"}`,children:"Belt"})]}),h.jsxs("div",{className:"flex items-center bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-0.5 text-[10px] uppercase tracking-[0.2em] font-light shadow-lg",children:[h.jsx("button",{onClick:x=>{x.stopPropagation(),s("exploration")},"aria-pressed":g==="exploration",title:"Compressed distances and enlarged bodies for exploring",className:`px-3 py-1 rounded-full transition-all duration-200 ${g==="exploration"?"bg-white/15 text-white shadow-sm border border-white/20":"text-white/40 hover:text-white/80"}`,children:"Exploration"}),h.jsx("button",{onClick:x=>{x.stopPropagation(),s("scientific")},"aria-pressed":g==="scientific",title:"Orbital distances to true scale (1 unit = 1,000,000 km); globes are enlarged 4× (minimum 15,000 km) so they stay visible",className:`px-3 py-1 rounded-full transition-all duration-200 ${g==="scientific"?"bg-white/15 text-white shadow-sm border border-white/20":"text-white/40 hover:text-white/80"}`,children:"True Distances"})]}),h.jsx("div",{className:"flex items-center bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-0.5 text-[10px] uppercase tracking-[0.2em] font-light shadow-lg",role:"group","aria-label":"Camera lens (L)",children:Xe.map(x=>h.jsx("button",{onClick:D=>{D.stopPropagation(),f==null||f(x)},"aria-pressed":U===x,title:`${tt[x].label} lens (L cycles)`,className:`px-3 py-1 rounded-full transition-all duration-200 ${U===x?"bg-white/15 text-white shadow-sm border border-white/20":"text-white/40 hover:text-white/80"}`,children:tt[x].label},x))}),h.jsxs("button",{onClick:x=>{x.stopPropagation(),ae(!0)},className:"flex items-center gap-1.5 px-3.5 py-1.5 bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/10 hover:border-white/20 rounded-full text-[10px] uppercase tracking-[0.2em] font-light text-white/80 transition shadow-lg",children:[h.jsx(Kt,{size:11,className:"text-white/50"}),h.jsxs("span",{children:["Catalogue (",ke.length,")"]})]}),h.jsxs("button",{onClick:x=>{x.stopPropagation(),i()},title:"Reset to System Overview",className:"flex items-center gap-1.5 px-3.5 py-1.5 bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/10 hover:border-white/20 rounded-full text-[10px] uppercase tracking-[0.2em] font-light text-white/80 transition shadow-lg",children:[h.jsx(ls,{size:11,className:"text-white/50"}),h.jsx("span",{children:"Overview"})]}),h.jsx("button",{onClick:x=>{x.stopPropagation(),te(!1)},title:"Hide Interface (H)","aria-label":"Hide interface",className:"p-2 bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/10 rounded-full text-white/40 hover:text-white transition shadow-lg",children:h.jsx(ss,{size:12})})]})]}),h.jsx("nav",{className:`absolute left-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-3 [@media(max-height:720px)]:gap-1 [@media(max-height:720px)]:top-[calc(50%+28px)] [@media(max-height:560px)]:hidden pointer-events-auto transition-all duration-1000 z-30 ${Dt>=1?"opacity-100 translate-x-0":"opacity-0 -translate-x-8"}`,children:cs.map(x=>{const D=xt[x],le=z===x,wa=`${xa}${(D==null?void 0:D.textureThumb)||"textures/2k_moon.jpg"}`;return h.jsxs("button",{"aria-current":le?"true":void 0,"aria-label":`Fly to ${x}`,onClick:ba=>{ba.stopPropagation(),x==="Sagittarius A*"&&(m==null||m("sgr_a")),e(x),Je()},className:"flex items-center gap-3.5 group text-left cursor-pointer transition-all duration-200 outline-none focus-visible:ring-1 focus-visible:ring-white/60 rounded",children:[h.jsx("div",{className:`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${le?"border-white":"border-white/35 group-hover:border-white/60"}`,children:le&&h.jsx("div",{className:"w-1.5 h-1.5 rounded-full bg-white transition-transform scale-100"})}),le?h.jsx("div",{className:"h-2.5 rounded-sm transition-all duration-300",style:{backgroundColor:(D==null?void 0:D.accentColor)||"#ffffff",width:"28px",boxShadow:`0 0 10px ${(D==null?void 0:D.accentColor)||"#ffffff"}88`}}):h.jsx("div",{className:"w-6 h-6 rounded-full bg-cover bg-center transition-opacity duration-200 opacity-60 group-hover:opacity-90 flex-shrink-0",style:{backgroundImage:`url(${wa})`,boxShadow:"inset -2px -4px 5px 1px rgba(0,0,0,0.9), inset 1px 1px 2px rgba(255,255,255,0.2)"}}),h.jsxs("div",{className:"flex flex-col",children:[h.jsx("span",{className:`text-[11px] uppercase tracking-[0.22em] transition-colors duration-200 ${le?"text-white font-medium":"text-white/40 group-hover:text-white/80"}`,children:x}),h.jsx("span",{className:`text-[9px] tracking-wider transition-colors duration-200 font-light ${le?"text-white/50":"text-white/20 group-hover:text-white/40"}`,children:(D==null?void 0:D.distanceAU)||""})]})]},x)})}),Ct&&h.jsx("section",{onMouseEnter:()=>Et(!0),onMouseLeave:()=>Et(!1),className:"absolute left-1/2 bottom-20 md:bottom-24 -translate-x-1/2 pointer-events-auto select-none z-20",children:h.jsxs("div",{className:`flex flex-col items-center text-center max-w-2xl px-6 ${pa?"monograph-vanishing":"monograph-visible"}`,children:[h.jsx("span",{className:"text-[11px] md:text-xs uppercase tracking-[0.52em] font-light transition-colors duration-500 mb-1",style:{color:ee.eyebrowColor},children:ee.eyebrow}),h.jsx("h2",{className:"text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight tracking-[0.2em] sm:tracking-[0.36em] text-white uppercase drop-shadow-2xl my-1.5 transition-all duration-500",children:z}),h.jsx("p",{className:"text-[10px] md:text-[11px] lg:text-[12px] font-light tracking-[0.20em] leading-relaxed text-white/75 uppercase max-w-xl mx-auto my-3 text-center transition-all duration-500",children:ee.monographText}),h.jsxs("button",{onClick:x=>{x.stopPropagation(),re(!0)},className:"group mt-2.5 flex flex-col items-center cursor-pointer transition-all duration-300 outline-none focus-visible:ring-1 focus-visible:ring-white/60 rounded",children:[h.jsx("span",{className:"text-xs uppercase tracking-[0.32em] font-light transition-colors duration-300",style:{color:ee.accentColor},children:"READ MORE"}),h.jsx("div",{className:"h-[1px] w-full mt-1 transition-all duration-300 group-hover:w-[115%]",style:{backgroundColor:ee.accentColor,boxShadow:`0 0 6px ${ee.accentColor}66`}})]})]})}),!Ct&&h.jsx("div",{className:"absolute left-1/2 bottom-20 -translate-x-1/2 pointer-events-auto z-20 transition-all duration-700 opacity-60 hover:opacity-100",children:h.jsxs("button",{onClick:x=>{x.stopPropagation(),Je()},className:"flex items-center gap-2 px-3.5 py-1 text-[10px] uppercase tracking-[0.25em] font-light text-white/60 hover:text-white bg-black/40 hover:bg-black/80 backdrop-blur-md border border-white/10 hover:border-white/25 rounded-full transition-all shadow-lg cursor-pointer",children:[h.jsx("span",{className:"w-1.5 h-1.5 rounded-full animate-pulse",style:{backgroundColor:ee.accentColor}}),h.jsxs("span",{children:[z," Overview"]})]})}),h.jsxs("footer",{className:"flex flex-col items-center gap-2 w-full pointer-events-auto z-30",children:[h.jsxs("div",{className:"flex flex-wrap items-center justify-center gap-x-3 gap-y-1 max-w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl md:rounded-full px-4 py-1 text-[10px] uppercase tracking-[0.2em] font-light shadow-xl",children:[h.jsx("button",{onClick:x=>{x.stopPropagation(),a()},className:"p-1 text-white/70 hover:text-white transition rounded-full",title:"Space to toggle play","aria-label":M?"Play simulation":"Pause simulation",children:M?h.jsx(ns,{size:11}):h.jsx(rs,{size:11})}),h.jsx("div",{className:"flex items-center gap-1 border-l border-white/10 pl-3",children:ya.map(x=>{const D=!M&&b===x.val;return h.jsx("button",{"aria-pressed":D,onClick:le=>{le.stopPropagation(),t(x.val)},className:`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-[0.15em] transition-all duration-200 ${D?"bg-white/20 text-white font-normal border border-white/25 shadow-sm":"text-white/40 hover:text-white/70"}`,children:x.label},x.label)})}),h.jsxs("div",{className:"flex items-center gap-1.5 border-l border-white/10 pl-3 text-[10px] uppercase tracking-[0.2em] font-light",children:[h.jsx("button",{onClick:x=>{x.stopPropagation(),r()},className:"text-white/40 hover:text-white px-1.5 py-0.5 rounded transition",children:"J2000"}),h.jsx("button",{onClick:x=>{x.stopPropagation(),n()},className:"text-white/40 hover:text-white px-1.5 py-0.5 rounded transition",children:"Now"}),h.jsxs("button",{onClick:x=>{x.stopPropagation(),Ve(!Me)},"aria-label":`Jump to date (current ${ze})`,"aria-expanded":Me,className:"flex items-center gap-1 text-white/50 hover:text-white px-1.5 py-0.5 rounded transition",children:[h.jsx(is,{size:10}),h.jsx("span",{children:ze})]})]})]}),Me&&h.jsxs("form",{onSubmit:va,className:"flex items-center gap-2 bg-black/85 backdrop-blur-xl border border-white/15 rounded-xl px-3 py-2 text-[10px] uppercase tracking-[0.2em] font-light shadow-2xl",children:[h.jsx("input",{type:"date","aria-label":"Simulation date (UTC)",value:ze,onFocus:()=>We(!0),onChange:x=>{We(!0),At(x.target.value)},onBlur:()=>We(!1),className:"bg-white/10 text-white px-2 py-1 rounded border border-white/15 outline-none focus:border-white/40 text-[11px] font-sans"}),h.jsx("button",{type:"submit",className:"px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg transition text-[10px] uppercase tracking-[0.2em] font-light",children:"Jump"}),h.jsx("button",{type:"button",onClick:()=>Ve(!1),className:"p-1 text-white/40 hover:text-white","aria-label":"Close date picker",children:h.jsx(ut,{size:12})})]})]}),ue&&h.jsxs("div",{className:"fixed inset-0 z-50 pointer-events-auto flex justify-end animate-fadeIn",children:[h.jsx("div",{onClick:()=>re(!1),className:"flex-1 bg-black/60 backdrop-blur-sm transition-opacity"}),h.jsxs("aside",{className:"w-[420px] max-w-full bg-[#040307]/95 backdrop-blur-2xl border-l border-white/10 p-7 flex flex-col gap-6 shadow-2xl h-full font-sans overflow-y-auto no-scrollbar",children:[h.jsxs("div",{className:"flex justify-between items-start border-b border-white/10 pb-4",children:[h.jsxs("div",{children:[h.jsxs("span",{className:"text-[10px] uppercase tracking-[0.25em] font-light block",style:{color:ee.eyebrowColor},children:[ee.eyebrow," · SOLAR SYSTEM EXPLORER"]}),h.jsx("h2",{className:"text-3xl font-extralight text-white tracking-[0.25em] uppercase mt-1",children:z})]}),h.jsx("button",{onClick:()=>re(!1),className:"text-white/40 hover:text-white transition p-1.5 rounded-full hover:bg-white/10","aria-label":"Close details",children:h.jsx(ut,{size:18})})]}),h.jsxs("div",{className:"flex flex-col gap-2",children:[h.jsx("span",{className:"text-[10px] tracking-[0.25em] uppercase text-white/40 font-light",children:"Astronomical Lore & Physical Environment"}),h.jsx("p",{className:"text-xs leading-relaxed text-white/80 font-light",children:ee.extendedLore})]}),(z==="Sagittarius A*"||(y==null?void 0:y.category)==="black_hole")&&h.jsxs("div",{className:"flex flex-col gap-2.5 pt-2 border-t border-amber-500/30",children:[h.jsxs("div",{className:"flex items-center justify-between",children:[h.jsx("span",{className:"text-[10px] tracking-[0.25em] uppercase text-amber-400 font-medium",children:"Relativistic Horizons & Metrics"}),h.jsx("span",{className:"text-[9px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30",children:"EHT / NASA SVS"})]}),h.jsxs("div",{className:"grid grid-cols-2 gap-y-2 text-xs font-light bg-amber-500/5 p-3 rounded-xl border border-amber-500/15",children:[h.jsx("span",{className:"text-white/40",children:"Mass (M)"}),h.jsx("span",{className:"text-right text-amber-200 font-mono",children:"4.297 ± 0.012 × 10⁶ M☉"}),h.jsx("span",{className:"text-white/40",children:"Schwarzschild Radius (r_s)"}),h.jsx("span",{className:"text-right text-amber-200 font-mono",children:"12.69 × 10⁶ km (0.085 AU)"}),h.jsx("span",{className:"text-white/40",children:"Photon Sphere (r_ph)"}),h.jsx("span",{className:"text-right text-amber-200 font-mono",children:"1.5 r_s · 19.04 × 10⁶ km"}),h.jsx("span",{className:"text-white/40",children:"Shadow Radius (r_shadow)"}),h.jsx("span",{className:"text-right text-amber-200 font-mono",children:"2.60 r_s · 32.97 × 10⁶ km"}),h.jsx("span",{className:"text-white/40",children:"EHT Shadow Diameter (θ)"}),h.jsx("span",{className:"text-right text-amber-200 font-mono",children:"51.8 ± 2.3 µas"}),h.jsx("span",{className:"text-white/40",children:"ISCO Radius (r_isco)"}),h.jsx("span",{className:"text-right text-amber-200 font-mono",children:"3.0 r_s · 38.07 × 10⁶ km"}),h.jsx("span",{className:"text-white/40",children:"ISCO Orbital Velocity"}),h.jsx("span",{className:"text-right text-amber-200 font-mono",children:"0.408 c (122,400 km/s)"}),h.jsx("span",{className:"text-white/40",children:"Galactic Center Distance"}),h.jsx("span",{className:"text-right text-amber-200 font-mono",children:"8.277 kpc (26,990 ly)"})]}),h.jsxs("div",{className:"flex flex-col gap-1.5 p-3 rounded-xl bg-black/50 border border-white/10 text-[11px] text-white/70 font-light",children:[h.jsx("span",{className:"text-[10px] uppercase tracking-[0.2em] text-white/40 font-medium",children:"Relativistic Optical Phenomena:"}),h.jsxs("p",{children:["• ",h.jsx("strong",{className:"text-amber-200 font-normal",children:"Event Horizon Shadow:"})," In the Schwarzschild metric every photon with impact parameter b Null-geodesic ray tracing confirms absolute photon capture for impact parameters b < 2.598 r_s (3√3/2 r_s).lt; 3√3/2 r_s ≈ 2.598 r_s is captured."]}),h.jsxs("p",{children:["• ",h.jsx("strong",{className:"text-amber-200 font-normal",children:"Lensed Accretion Arches:"})," Light emitted from the rear accretion disk loops over and under the black hole's gravitational potential well, projecting primary and secondary lensed arcs."]}),h.jsxs("p",{children:["• ",h.jsx("strong",{className:"text-amber-200 font-normal",children:"Relativistic Doppler Beaming:"})," Plasma orbiting at ~0.4 c blazes in intense blue-white on the approaching left limb (intensity boost ~ δ⁴) while receding plasma dims into deep red."]}),h.jsxs("p",{children:["• ",h.jsx("strong",{className:"text-amber-200 font-normal",children:"Relativistic Polar Jets:"})," Twin collimated particle beams erupting at ~0.98 c along the spin axis, featuring an incandescent white-hot core and helical synchrotron shock sheaths."]}),h.jsxs("p",{children:["• ",h.jsx("strong",{className:"text-amber-200 font-normal",children:"Nuclear S-Cluster:"})," Over 300 massive B/O-type stars orbit Sgr A* in the central parsec, including star S2 reaching speeds of 7,650 km/s at pericenter."]})]})]}),K&&h.jsxs("div",{className:"flex flex-col gap-2 pt-2 border-t border-white/10",children:[h.jsx("span",{className:"text-[10px] tracking-[0.25em] uppercase text-white/40 font-light",children:"Physical Dimensions"}),h.jsxs("div",{className:"grid grid-cols-2 gap-y-2 text-xs font-light",children:[h.jsx("span",{className:"text-white/40",children:"Mean Radius"}),h.jsxs("span",{className:"text-right text-white/90",children:[K.physical.meanRadiusKm.toLocaleString()," km"]}),h.jsx("span",{className:"text-white/40",children:"Surface Gravity"}),h.jsx("span",{className:"text-right text-white/90",children:K.physical.gmKm3S2?`${(K.physical.gmKm3S2*1e3/Math.pow(K.physical.meanRadiusKm,2)).toFixed(2)} m/s²`:"—"}),h.jsx("span",{className:"text-white/40",children:"Sidereal Day"}),h.jsx("span",{className:"text-right text-white/90",children:K.physical.rotationPeriodHours!==void 0?`${K.physical.rotationPeriodHours.toFixed(1)} h`:"Synchronous"}),h.jsx("span",{className:"text-white/40",children:"Axial Tilt"}),h.jsx("span",{className:"text-right text-white/90",children:K.physical.axialTiltDeg!==void 0?`${K.physical.axialTiltDeg.toFixed(2)}°`:"0.00°"})]})]}),K&&h.jsxs("div",{className:"flex flex-col gap-2 pt-2 border-t border-white/10",children:[h.jsx("span",{className:"text-[10px] tracking-[0.25em] uppercase text-white/40 font-light",children:"Keplerian Orbit (J2000)"}),h.jsxs("div",{className:"grid grid-cols-2 gap-y-2 text-xs font-light",children:[h.jsx("span",{className:"text-white/40",children:"Semi-Major Axis"}),h.jsxs("span",{className:"text-right text-white/90",children:[K.orbit.semiMajorAxisAU.toFixed(3)," AU"]}),h.jsx("span",{className:"text-white/40",children:"Eccentricity"}),h.jsx("span",{className:"text-right text-white/90",children:K.orbit.eccentricity.toFixed(4)}),h.jsx("span",{className:"text-white/40",children:"Orbital Period"}),h.jsx("span",{className:"text-right text-white/90",children:K.orbit.orbitalPeriodDays>730?`${(K.orbit.orbitalPeriodDays/365.25).toFixed(2)} yr`:`${K.orbit.orbitalPeriodDays.toFixed(1)} d`}),h.jsx("span",{className:"text-white/40",children:"Inclination"}),h.jsxs("span",{className:"text-right text-white/90",children:[K.orbit.inclinationDeg.toFixed(2),"°"]})]})]}),y&&h.jsxs("div",{className:"flex flex-col gap-2 pt-2 border-t border-white/10",children:[h.jsx("span",{className:"text-[10px] tracking-[0.25em] uppercase text-white/40 font-light",children:"Live Ephemeris Telemetry"}),h.jsxs("div",{className:"grid grid-cols-2 gap-y-2 text-xs font-light",children:[h.jsx("span",{className:"text-white/40",children:"Heliocentric Dist"}),h.jsx("span",{className:"text-right text-white/90",children:y.distanceKm>1e6?`${(y.distanceKm/1e6).toFixed(2)}M km`:`${Math.round(y.distanceKm).toLocaleString()} km`}),h.jsx("span",{className:"text-white/40",children:"AU Distance"}),h.jsxs("span",{className:"text-right text-white/90",children:[(y.distanceKm/1495978707e-1).toFixed(3)," AU"]}),h.jsx("span",{className:"text-white/40",children:"Orbital Velocity"}),h.jsxs("span",{className:"text-right text-white/90",children:[y.apparentSpeedKmS.toFixed(2)," km/s"]})]})]}),ee.missions&&ee.missions.length>0&&h.jsxs("div",{className:"flex flex-col gap-3 pt-2 border-t border-white/10",children:[h.jsx("span",{className:"text-[10px] tracking-[0.25em] uppercase text-white/40 font-light",children:"Exploration Missions"}),h.jsx("div",{className:"flex flex-col gap-2.5",children:ee.missions.map(x=>h.jsxs("div",{className:"p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col gap-1",children:[h.jsxs("div",{className:"flex justify-between items-center text-xs",children:[h.jsx("span",{className:"text-white font-medium tracking-[0.1em]",children:x.name}),h.jsxs("span",{className:"text-[10px] text-white/40 font-light",children:[x.year," · ",x.agency]})]}),h.jsx("p",{className:"text-[11px] text-white/60 font-light",children:x.role})]},x.name))})]}),h.jsxs("div",{className:"pt-3 border-t border-white/10 flex justify-between items-center text-[10px] font-light text-white/30 uppercase tracking-[0.2em]",children:[h.jsx("span",{children:(K==null?void 0:K.orbit.source)??"NASA JPL orbital elements"}),h.jsx("span",{children:"Keplerian 2-Body Solver"})]}),h.jsxs("p",{className:"text-[10px] leading-relaxed font-light text-white/35",children:["Textures: Solar System Scope (CC BY 4.0) · Sky map: ESA/Gaia/DPAC (CC BY-SA 3.0 IGO) · Stars: ESA/Hipparcos (CC BY-NC 3.0 IGO) · Galaxy art: NASA/JPL-Caltech/ESO/R. Hurt (CC BY 4.0) · Orbits: NASA JPL."," ",h.jsx("a",{href:"https://github.com/LetMeCodex/solaris/blob/main/ASSETS.md",target:"_blank",rel:"noopener noreferrer",className:"underline hover:text-white/70",children:"Full credits"})]})]})]}),be&&h.jsxs("div",{className:"fixed inset-0 z-50 pointer-events-auto flex",children:[h.jsx("div",{onClick:()=>ae(!1),className:"flex-1 bg-black/60 backdrop-blur-sm transition-opacity"}),h.jsxs("aside",{className:"w-96 bg-[#07060a]/95 backdrop-blur-2xl border-l border-white/10 p-6 flex flex-col gap-5 shadow-2xl h-full font-sans",children:[h.jsxs("div",{className:"flex justify-between items-center border-b border-white/10 pb-4",children:[h.jsxs("div",{children:[h.jsx("h3",{className:"text-lg font-extralight text-white tracking-[0.25em] uppercase",children:"Astronomical Catalogue"}),h.jsxs("span",{className:"text-[10px] uppercase tracking-[0.2em] font-light text-white/40",children:[ke.length," bodies · NASA JPL elements"]})]}),h.jsx("button",{onClick:()=>ae(!1),className:"text-white/40 hover:text-white transition p-1.5 rounded-full hover:bg-white/5","aria-label":"Close catalogue",children:h.jsx(ut,{size:16})})]}),h.jsxs("div",{className:"flex flex-col gap-2.5 text-xs",children:[h.jsxs("div",{className:"relative",children:[h.jsx(Kt,{size:13,className:"absolute left-3 top-2.5 text-white/35"}),h.jsx("input",{type:"text",placeholder:"FILTER BY NAME, CATEGORY...","aria-label":"Filter catalogue by name or category",value:pe,onChange:x=>ma(x.target.value),className:"w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white placeholder-white/30 text-[11px] uppercase tracking-[0.15em] outline-none focus:border-white/30"})]}),h.jsx("div",{className:"grid grid-cols-4 gap-1 text-[10px] uppercase tracking-[0.18em] font-light",children:["all","planet","moon","minor"].map(x=>h.jsx("button",{onClick:()=>me(x),"aria-pressed":ne===x,className:`py-1 rounded-lg text-center uppercase tracking-wider transition-all duration-200 ${ne===x?"bg-white/15 text-white font-normal border border-white/20":"text-white/40 hover:text-white/70"}`,children:x==="all"?`All (${ke.length})`:x==="planet"?"Planets":x==="moon"?"Moons":"Minor"},x))})]}),h.jsx("div",{className:"flex-1 overflow-y-auto no-scrollbar flex flex-col gap-1.5 pr-1",children:fa.map(x=>{const D=z===x.name;return h.jsxs("button",{onClick:()=>{e(x.name),Je(),ae(!1)},className:`flex items-center justify-between p-2.5 rounded-xl border transition text-left ${D?"bg-white/15 border-white/30 text-white":"bg-white/[0.02] border-white/5 text-white/70 hover:bg-white/[0.06] hover:text-white"}`,children:[h.jsxs("div",{className:"flex items-center gap-3",children:[h.jsx("span",{className:"w-2 h-2 rounded-full flex-shrink-0",style:{backgroundColor:x.physical.colorHex||"#ffffff"}}),h.jsxs("div",{className:"flex flex-col",children:[h.jsx("span",{className:"text-xs text-white font-light tracking-[0.15em] uppercase",children:x.name}),h.jsxs("span",{className:"text-[10px] text-white/35 uppercase tracking-[0.1em]",children:[x.category.replace("_"," "),x.parentName&&` · ${x.parentName}`]})]})]}),h.jsxs("div",{className:"text-right text-[10px] text-white/40 font-light tracking-wider",children:[h.jsxs("div",{children:[x.physical.meanRadiusKm.toLocaleString()," km"]}),h.jsxs("div",{children:[x.orbit.semiMajorAxisAU.toFixed(2)," AU"]})]})]},x.name)})})]})]})]}):h.jsx("div",{className:"absolute bottom-6 right-6 z-50 pointer-events-auto",children:h.jsxs("button",{onClick:()=>te(!0),className:"flex items-center gap-2 px-3.5 py-1.5 text-xs text-white/50 hover:text-white bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/10 rounded-full transition uppercase tracking-[0.2em] font-light",children:[h.jsx(os,{size:13}),h.jsx("span",{children:"Show Interface (H)"})]})})},ds=()=>{const p=C.useRef(null),e=C.useRef(null),[i,a]=C.useState(null);C.useEffect(()=>{if(!p.current)return;const g=new yt(p.current,S=>{a(S)});return e.current=g,window.__solaris_scene=g,()=>{delete window.__solaris_scene,g.dispose(),e.current=null}},[]);const t=C.useCallback(g=>{var S;(S=e.current)==null||S.selectBody(g)},[]),s=C.useCallback(()=>{var g;(g=e.current)==null||g.resetView()},[]),o=C.useCallback(()=>{if(!e.current)return;const g=e.current.clock.isPaused;e.current.clock.isPaused=!g},[]),r=C.useCallback(g=>{e.current&&(e.current.clock.timeMultiplier=g,e.current.clock.isPaused=!1)},[]),n=C.useCallback(g=>{var S;(S=e.current)==null||S.setScaleMode(g)},[]),l=C.useCallback(g=>{var S;(S=e.current)==null||S.clock.setUtcMs(g)},[]),c=C.useCallback(()=>{var g;(g=e.current)==null||g.clock.resetToJ2000()},[]),d=C.useCallback(()=>{var g;(g=e.current)==null||g.clock.resetToNow()},[]),m=C.useCallback(()=>{var g;(g=e.current)==null||g.toggleConstellations()},[]),f=C.useCallback(()=>{var g;(g=e.current)==null||g.toggleAsteroidBelt()},[]),v=C.useCallback(()=>{var g;(g=e.current)==null||g.toggleOrbits()},[]),y=C.useCallback(g=>{var S;(S=e.current)==null||S.setLensProfile(g)},[]),M=C.useCallback(()=>{var g;(g=e.current)==null||g.cycleLensProfile()},[]),b=C.useCallback(g=>{var S;(S=e.current)==null||S.jumpToScale(g)},[]);return h.jsxs("div",{className:"relative w-screen h-screen overflow-hidden bg-[#030206]",style:{width:"100vw",height:"100vh",position:"relative",overflow:"hidden"},children:[h.jsx("div",{ref:p,className:"absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing",style:{position:"absolute",top:0,left:0,width:"100%",height:"100%"}}),h.jsx(hs,{telemetry:i,onSelectPlanet:t,onResetView:s,onTogglePlay:o,onSetTimeMultiplier:r,onSetScaleMode:n,onSeekDate:l,onResetToJ2000:c,onResetToNow:d,onToggleConstellations:m,onToggleAsteroidBelt:f,onToggleOrbits:v,onJumpToScale:b,onSetLens:y,onCycleLens:M})]})};gt.createRoot(document.getElementById("root")).render(h.jsx(Aa.StrictMode,{children:h.jsx(ds,{})}));
