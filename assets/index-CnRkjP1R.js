var Ta=Object.defineProperty;var Ca=(l,e,t)=>e in l?Ta(l,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):l[e]=t;var d=(l,e,t)=>Ca(l,typeof e!="symbol"?e+"":e,t);import{r as C,a as Ra,R as Ea}from"./react-nf7bT_Uh.js";import{C as B,R as V,a as _,T as Na,b as Li,S as ke,N as dt,L as ft,c as Lt,d as L,B as Ke,A as q,V as M,D as Oe,G as he,P as yt,M as z,e as I,f as ue,g as ji,h as qt,i as Gt,j as Z,k as F,l as xe,m as ye,n as ka,o as Ia,p as Fi,q as Ze,r as _e,s as mi,t as R,u as Ui,I as Oa,F as ze,v as te,w as Ce,x as pi,Q as Se,y as _i,z as zi,O as La,E as ja,H as Fa,J as Ua,K as _a,U as bt,W as Xe,X as Qe,Y as za,Z as Ka,_ as Ba,$ as Ga,a0 as Ha,a1 as Va,a2 as Wa,a3 as Ya,a4 as Ki,a5 as Ja,a6 as qa,a7 as $a,a8 as Xa,a9 as Qa,aa as Za,ab as es,ac as ts,ad as is,ae as as,af as ss,ag as os,ah as rs,ai as ns}from"./three-BzNYA8Ch.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))a(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&a(o)}).observe(document,{childList:!0,subtree:!0});function t(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function a(i){if(i.ep)return;i.ep=!0;const s=t(i);fetch(i.href,s)}})();var Bi={exports:{}},Ct={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var ls=C,cs=Symbol.for("react.element"),hs=Symbol.for("react.fragment"),ds=Object.prototype.hasOwnProperty,us=ls.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,ms={key:!0,ref:!0,__self:!0,__source:!0};function Gi(l,e,t){var a,i={},s=null,o=null;t!==void 0&&(s=""+t),e.key!==void 0&&(s=""+e.key),e.ref!==void 0&&(o=e.ref);for(a in e)ds.call(e,a)&&!ms.hasOwnProperty(a)&&(i[a]=e[a]);if(l&&l.defaultProps)for(a in e=l.defaultProps,e)i[a]===void 0&&(i[a]=e[a]);return{$$typeof:cs,type:l,key:s,ref:o,props:i,_owner:us.current}}Ct.Fragment=hs;Ct.jsx=Gi;Ct.jsxs=Gi;Bi.exports=Ct;var u=Bi.exports,Ht={},gi=Ra;Ht.createRoot=gi.createRoot,Ht.hydrateRoot=gi.hydrateRoot;const ps=[{id:"10",name:"Sun",category:"star",orderFromSun:0,physical:{meanRadiusKm:695700,equatorialRadiusKm:695700,polarRadiusKm:695700,flattening:0,massKg:19885e26,gmKm3S2:1327124400419394e-4,rotationPeriodHours:609.12,axialTiltDeg:7.25,meanTemperatureK:5778,spectralType:"G2V",colorHex:"#ffdd77"},orbit:{semiMajorAxisKm:0,semiMajorAxisAU:0,eccentricity:0,inclinationDeg:0,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:0,orbitalPeriodDays:0},description:"Yellow dwarf star (G2V) at the gravitational center of the Solar System, containing 99.86% of the system’s total mass."},{id:"199",name:"Mercury",category:"planet",orderFromSun:1,physical:{meanRadiusKm:2439.7,equatorialRadiusKm:2439.7,polarRadiusKm:2439.7,flattening:0,massKg:33011e19,gmKm3S2:22031.78,rotationPeriodHours:1407.6,axialTiltDeg:.034,meanTemperatureK:440,colorHex:"#9c968f"},orbit:{semiMajorAxisKm:579092265e-1,semiMajorAxisAU:.38709927,eccentricity:.20563593,inclinationDeg:7.00497902,longitudeAscendingNodeDeg:48.33076593,argumentPeriapsisDeg:29.12703035,meanAnomalyAtEpochDeg:174.79252722,orbitalPeriodDays:87.969,epochJd:2451545,ratesPerCentury:{semiMajorAxisAU:37e-8,eccentricity:1906e-8,inclinationDeg:-.00594749,longitudeAscendingNodeDeg:-.12534081,argumentPeriapsisDeg:.2858177,meanAnomalyDeg:149472.51363486},source:"JPL SSD approximate planetary positions (Standish), Table 1"},description:"Smallest planet, heavily cratered with silicate crust and large iron core; lacks a substantial atmosphere."},{id:"299",name:"Venus",category:"planet",orderFromSun:2,physical:{meanRadiusKm:6051.8,equatorialRadiusKm:6051.8,polarRadiusKm:6051.8,flattening:0,massKg:48675e20,gmKm3S2:324858.59,rotationPeriodHours:-5832.5,axialTiltDeg:177.36,meanTemperatureK:737,colorHex:"#e3bb7b"},orbit:{semiMajorAxisKm:1082094745e-1,semiMajorAxisAU:.72333566,eccentricity:.00677672,inclinationDeg:3.39467605,longitudeAscendingNodeDeg:76.67984255,argumentPeriapsisDeg:54.92262463,meanAnomalyAtEpochDeg:50.37663232,orbitalPeriodDays:224.701,epochJd:2451545,ratesPerCentury:{semiMajorAxisAU:39e-7,eccentricity:-4107e-8,inclinationDeg:-7889e-7,longitudeAscendingNodeDeg:-.27769418,argumentPeriapsisDeg:.28037747,meanAnomalyDeg:58517.812704},source:"JPL SSD approximate planetary positions (Standish), Table 1"},description:"Terrestrial planet shrouded in dense carbon dioxide atmosphere and sulfuric acid clouds with runaway greenhouse effect."},{id:"399",name:"Earth",category:"planet",orderFromSun:3,physical:{meanRadiusKm:6371,equatorialRadiusKm:6378.137,polarRadiusKm:6356.752,flattening:.003353,massKg:59722e20,gmKm3S2:398600.4418,rotationPeriodHours:23.9344,axialTiltDeg:23.439,meanTemperatureK:288,colorHex:"#4b75a1"},orbit:{semiMajorAxisKm:1495982612e-1,semiMajorAxisAU:1.00000261,eccentricity:.01671123,inclinationDeg:-1531e-8,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:102.93768193,meanAnomalyAtEpochDeg:357.52688973,orbitalPeriodDays:365.256,epochJd:2451545,ratesPerCentury:{semiMajorAxisAU:562e-8,eccentricity:-4392e-8,inclinationDeg:-.01294668,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:.32327364,meanAnomalyDeg:35999.04917617},source:"JPL SSD approximate planetary positions (Standish), Table 1"},description:"Dense rocky world featuring liquid surface water, active plate tectonics, oxygen-rich atmosphere, and planetary biosphere."},{id:"499",name:"Mars",category:"planet",orderFromSun:4,physical:{meanRadiusKm:3389.5,equatorialRadiusKm:3396.2,polarRadiusKm:3376.2,flattening:.00589,massKg:64171e19,gmKm3S2:42828.375,rotationPeriodHours:24.6229,axialTiltDeg:25.19,meanTemperatureK:210,colorHex:"#c16138"},orbit:{semiMajorAxisKm:2279438224e-1,semiMajorAxisAU:1.52371034,eccentricity:.0933941,inclinationDeg:1.84969142,longitudeAscendingNodeDeg:49.55953891,argumentPeriapsisDeg:-73.5031685,meanAnomalyAtEpochDeg:19.39019754,orbitalPeriodDays:686.98,epochJd:2451545,ratesPerCentury:{semiMajorAxisAU:1847e-8,eccentricity:7882e-8,inclinationDeg:-.00813131,longitudeAscendingNodeDeg:-.29257343,argumentPeriapsisDeg:.73698431,meanAnomalyDeg:19139.85827411},source:"JPL SSD approximate planetary positions (Standish), Table 1"},description:"Cold desert world with iron-oxide regolith, giant shield volcanoes (Olympus Mons), rift canyon Valles Marineris, and polar ice caps."},{id:"599",name:"Jupiter",category:"planet",orderFromSun:5,physical:{meanRadiusKm:69911,equatorialRadiusKm:71492,polarRadiusKm:66854,flattening:.06487,massKg:18982e23,gmKm3S2:12668653492e-2,rotationPeriodHours:9.925,axialTiltDeg:3.13,meanTemperatureK:165,colorHex:"#c8a679"},orbit:{semiMajorAxisKm:7783408167e-1,semiMajorAxisAU:5.202887,eccentricity:.04838624,inclinationDeg:1.30439695,longitudeAscendingNodeDeg:100.47390909,argumentPeriapsisDeg:-85.74542926,meanAnomalyAtEpochDeg:19.66796068,orbitalPeriodDays:4332.589,epochJd:2451545,ratesPerCentury:{semiMajorAxisAU:-11607e-8,eccentricity:-13253e-8,inclinationDeg:-.00183714,longitudeAscendingNodeDeg:.20469106,argumentPeriapsisDeg:.00783562,meanAnomalyDeg:3034.53360107},source:"JPL SSD approximate planetary positions (Standish), Table 1"},description:"Largest planet; hydrogen-helium gas giant displaying zonal atmospheric jet streams, turbulent vortices, and the Great Red Spot."},{id:"699",name:"Saturn",category:"planet",orderFromSun:6,physical:{meanRadiusKm:58232,equatorialRadiusKm:60268,polarRadiusKm:54364,flattening:.09796,massKg:56834e22,gmKm3S2:379311879e-1,rotationPeriodHours:10.656,axialTiltDeg:26.73,meanTemperatureK:134,colorHex:"#dfcf9f"},orbit:{semiMajorAxisKm:14266664142e-1,semiMajorAxisAU:9.53667594,eccentricity:.05386179,inclinationDeg:2.48599187,longitudeAscendingNodeDeg:113.66242448,argumentPeriapsisDeg:-21.06354617,meanAnomalyAtEpochDeg:317.35536592,orbitalPeriodDays:10759.22,epochJd:2451545,ratesPerCentury:{semiMajorAxisAU:-.0012506,eccentricity:-50991e-8,inclinationDeg:.00193609,longitudeAscendingNodeDeg:-.28867794,argumentPeriapsisDeg:-.13029422,meanAnomalyDeg:1222.91259417},source:"JPL SSD approximate planetary positions (Standish), Table 1"},description:"Gas giant celebrated for its extensive, brilliant ring system consisting of water ice particles, dust, and rock."},{id:"799",name:"Uranus",category:"planet",orderFromSun:7,physical:{meanRadiusKm:25362,equatorialRadiusKm:25559,polarRadiusKm:24973,flattening:.02293,massKg:8681e22,gmKm3S2:57939393e-1,rotationPeriodHours:-17.24,axialTiltDeg:97.77,meanTemperatureK:76,colorHex:"#8fe0ea"},orbit:{semiMajorAxisKm:28706581707e-1,semiMajorAxisAU:19.18916464,eccentricity:.04725744,inclinationDeg:.77263783,longitudeAscendingNodeDeg:74.01692503,argumentPeriapsisDeg:96.93735127,meanAnomalyAtEpochDeg:142.28382821,orbitalPeriodDays:30685.4,epochJd:2451545,ratesPerCentury:{semiMajorAxisAU:-.00196176,eccentricity:-4397e-8,inclinationDeg:-.00242939,longitudeAscendingNodeDeg:.04240589,argumentPeriapsisDeg:.36564692,meanAnomalyDeg:428.07397504},source:"JPL SSD approximate planetary positions (Standish), Table 1"},description:"Ice giant composed of water, ammonia, and methane ices; extreme 98° axial tilt results in extreme seasonal variations."},{id:"899",name:"Neptune",category:"planet",orderFromSun:8,physical:{meanRadiusKm:24622,equatorialRadiusKm:24764,polarRadiusKm:24341,flattening:.01708,massKg:102413e21,gmKm3S2:68350995e-1,rotationPeriodHours:16.11,axialTiltDeg:28.32,meanTemperatureK:72,colorHex:"#4b70dd"},orbit:{semiMajorAxisKm:4498396417,semiMajorAxisAU:30.06992276,eccentricity:.00859048,inclinationDeg:1.77004347,longitudeAscendingNodeDeg:131.78422574,argumentPeriapsisDeg:-86.81946347,meanAnomalyAtEpochDeg:259.91520804,orbitalPeriodDays:60189,epochJd:2451545,ratesPerCentury:{semiMajorAxisAU:26291e-8,eccentricity:5105e-8,inclinationDeg:35372e-8,longitudeAscendingNodeDeg:-.00508664,argumentPeriapsisDeg:-.317328,meanAnomalyDeg:218.78186789},source:"JPL SSD approximate planetary positions (Standish), Table 1"},description:"Outermost major planet; deep azure ice giant driven by violent supersonic winds, methane haze, and high-altitude cirrus clouds."}],gs=[{id:"301",name:"Moon",category:"moon",orderFromSun:3,parentId:"399",parentName:"Earth",physical:{meanRadiusKm:1737.4,equatorialRadiusKm:1738.1,polarRadiusKm:1736,flattening:.0012,massKg:7342e19,gmKm3S2:4902.8,rotationPeriodHours:655.728,axialTiltDeg:6.68,meanTemperatureK:250,colorHex:"#c4c3be"},orbit:{semiMajorAxisKm:384400,semiMajorAxisAU:.0025695553,eccentricity:.0554,inclinationDeg:5.16,longitudeAscendingNodeDeg:125.08,argumentPeriapsisDeg:318.15,meanAnomalyAtEpochDeg:135.27,orbitalPeriodDays:27.321661,epochJd:2451545,meanMotionDegPerDay:13.064995931,periapsisArgRateDegPerDay:.164353224,nodeRateDegPerDay:-.05299066,source:"JPL SSD planetary satellite mean elements"},description:"Earth’s only natural satellite; tidally locked with extensive lunar maria basalt plains and impact-cratered anorthositic highlands."},{id:"401",name:"Phobos",category:"moon",orderFromSun:4,parentId:"499",parentName:"Mars",physical:{meanRadiusKm:11.26,equatorialRadiusKm:13,polarRadiusKm:9.1,massKg:10659e12,gmKm3S2:71e-5,rotationPeriodHours:7.654,axialTiltDeg:0,colorHex:"#8b847d"},orbit:{semiMajorAxisKm:9377.9,semiMajorAxisAU:626874e-10,eccentricity:.01468188,inclinationDeg:25.639416,longitudeAscendingNodeDeg:82.61167,argumentPeriapsisDeg:282.404283,meanAnomalyAtEpochDeg:176.914893,orbitalPeriodDays:.31891023,epochJd:24613275e-1,meanMotionDegPerDay:1128.84431459,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Innermost and largest moon of Mars; heavily cratered irregular body featuring the massive Stickney impact crater, orbiting inside synchronous orbit."},{id:"402",name:"Deimos",category:"moon",orderFromSun:4,parentId:"499",parentName:"Mars",physical:{meanRadiusKm:6.2,massKg:14762e11,rotationPeriodHours:30.31,axialTiltDeg:0,colorHex:"#999186"},orbit:{semiMajorAxisKm:23458.846,semiMajorAxisAU:.0001568127,eccentricity:25811e-8,inclinationDeg:24.120481,longitudeAscendingNodeDeg:81.546986,argumentPeriapsisDeg:52.283083,meanAnomalyAtEpochDeg:122.884373,orbitalPeriodDays:1.2624407,epochJd:24613275e-1,meanMotionDegPerDay:285.161908991,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Outermost moon of Mars; smooth-looking irregular body coated in a thick regolith blanket that softens surface topography."},{id:"501",name:"Io",category:"moon",orderFromSun:5,parentId:"599",parentName:"Jupiter",physical:{meanRadiusKm:1821.5,massKg:89319e18,gmKm3S2:5959.91,rotationPeriodHours:42.456,axialTiltDeg:0,meanTemperatureK:130,colorHex:"#e5c158"},orbit:{semiMajorAxisKm:422020.056,semiMajorAxisAU:.0028210298,eccentricity:.00359279,inclinationDeg:2.228063,longitudeAscendingNodeDeg:338.403388,argumentPeriapsisDeg:31.382494,meanAnomalyAtEpochDeg:199.124628,orbitalPeriodDays:1.769137786,epochJd:24613275e-1,meanMotionDegPerDay:203.488955382,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Most volcanically active body in the Solar System, driven by tidal friction from orbital resonance with Europa and Ganymede; coated in sulfur and sulfur dioxide."},{id:"502",name:"Europa",category:"moon",orderFromSun:5,parentId:"599",parentName:"Jupiter",physical:{meanRadiusKm:1560.8,massKg:47998e18,gmKm3S2:3202.73,rotationPeriodHours:85.224,axialTiltDeg:.1,meanTemperatureK:102,colorHex:"#c7bfae"},orbit:{semiMajorAxisKm:671258.947,semiMajorAxisAU:.0044870889,eccentricity:.00931579,inclinationDeg:2.07625,longitudeAscendingNodeDeg:326.203313,argumentPeriapsisDeg:224.926561,meanAnomalyAtEpochDeg:279.791695,orbitalPeriodDays:3.551181041,epochJd:24613275e-1,meanMotionDegPerDay:101.37472459,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Smooth, brilliant water-ice crust fractured by tectonic lineae and cycloids; harbors a deep global subsurface liquid water ocean with astrobiological potential."},{id:"503",name:"Ganymede",category:"moon",orderFromSun:5,parentId:"599",parentName:"Jupiter",physical:{meanRadiusKm:2631.2,massKg:14819e19,gmKm3S2:9887.83,rotationPeriodHours:171.72,axialTiltDeg:.2,meanTemperatureK:110,colorHex:"#8e8379"},orbit:{semiMajorAxisKm:1070453601e-3,semiMajorAxisAU:.0071555404,eccentricity:.00274315,inclinationDeg:2.34352,longitudeAscendingNodeDeg:339.06555,argumentPeriapsisDeg:3.818835,meanAnomalyAtEpochDeg:349.11927,orbitalPeriodDays:7.15455296,epochJd:24613275e-1,meanMotionDegPerDay:50.317609222,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Largest natural satellite in the Solar System (larger than Mercury); only known moon with its own intrinsic magnetic field generated by a liquid iron core."},{id:"504",name:"Callisto",category:"moon",orderFromSun:5,parentId:"599",parentName:"Jupiter",physical:{meanRadiusKm:2410.3,massKg:10759e19,gmKm3S2:7179.29,rotationPeriodHours:400.536,axialTiltDeg:0,meanTemperatureK:134,colorHex:"#696057"},orbit:{semiMajorAxisKm:1882917904e-3,semiMajorAxisAU:.0125865288,eccentricity:.00707683,inclinationDeg:1.952455,longitudeAscendingNodeDeg:336.746982,argumentPeriapsisDeg:34.494869,meanAnomalyAtEpochDeg:126.955427,orbitalPeriodDays:16.6890184,epochJd:24613275e-1,meanMotionDegPerDay:21.57107095,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Ancient, intensely cratered ice-rock moon; lacks tidal resonance heating, preserving the most heavily cratered surface in the Solar System (including Valhalla impact basin)."},{id:"601",name:"Mimas",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:198.2,massKg:37493e15,rotationPeriodHours:22.6,colorHex:"#b2b2b2"},orbit:{semiMajorAxisKm:186034.255,semiMajorAxisAU:.0012435622,eccentricity:.0218639,inclinationDeg:28.47676,longitudeAscendingNodeDeg:172.727658,argumentPeriapsisDeg:169.377604,meanAnomalyAtEpochDeg:326.994857,orbitalPeriodDays:.942421959,epochJd:24613275e-1,meanMotionDegPerDay:381.994494676,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Dominated by the 130 km Herschel impact crater, giving it a distinctive Death Star appearance; clearing agent for the Cassini Division."},{id:"602",name:"Enceladus",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:252.1,massKg:10802e16,gmKm3S2:7.21,rotationPeriodHours:32.88,colorHex:"#ffffff"},orbit:{semiMajorAxisKm:238411.673,semiMajorAxisAU:.0015936836,eccentricity:.00513554,inclinationDeg:28.043619,longitudeAscendingNodeDeg:169.530888,argumentPeriapsisDeg:214.451065,meanAnomalyAtEpochDeg:62.261399,orbitalPeriodDays:1.370217855,epochJd:24613275e-1,meanMotionDegPerDay:262.731943454,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:'High-albedo icy world with active cryovolcanic geysers erupting water vapor, organic molecules, and ice crystals from south polar "tiger stripe" fractures.'},{id:"603",name:"Tethys",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:531,massKg:61745e16,rotationPeriodHours:45.31,colorHex:"#d8d8d8"},orbit:{semiMajorAxisKm:294976.454,semiMajorAxisAU:.0019717958,eccentricity:99726e-8,inclinationDeg:28.175586,longitudeAscendingNodeDeg:171.825733,argumentPeriapsisDeg:127.950883,meanAnomalyAtEpochDeg:2.809594,orbitalPeriodDays:1.88780216,epochJd:24613275e-1,meanMotionDegPerDay:190.697948984,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Low-density water-ice satellite featuring the vast Odysseus impact crater and the enormous Ithaca Chasma canyon system spanning 2,000 km."},{id:"604",name:"Dione",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:561.4,massKg:10955e17,rotationPeriodHours:65.69,colorHex:"#cac8c5"},orbit:{semiMajorAxisKm:377644.232,semiMajorAxisAU:.0025243958,eccentricity:.00265791,inclinationDeg:28.025672,longitudeAscendingNodeDeg:169.549925,argumentPeriapsisDeg:268.312567,meanAnomalyAtEpochDeg:329.102147,orbitalPeriodDays:2.736914742,epochJd:24613275e-1,meanMotionDegPerDay:131.534970555,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Icy moon displaying bright wispy ice cliffs (chasmata) formed by extensional tectonic fractures across its trailing hemisphere."},{id:"605",name:"Rhea",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:763.5,massKg:23065e17,rotationPeriodHours:108.43,colorHex:"#bbb8b4"},orbit:{semiMajorAxisKm:527244.268,semiMajorAxisAU:.0035244102,eccentricity:.00136693,inclinationDeg:28.274533,longitudeAscendingNodeDeg:169.967171,argumentPeriapsisDeg:166.661352,meanAnomalyAtEpochDeg:13.027101,orbitalPeriodDays:4.517500436,epochJd:24613275e-1,meanMotionDegPerDay:79.690086387,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Second-largest moon of Saturn; heavily cratered ice body with homogeneous interior composition and tenuous oxygen-carbon dioxide exosphere."},{id:"606",name:"Titan",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:2574.8,equatorialRadiusKm:2574.8,polarRadiusKm:2574.8,flattening:0,massKg:13452e19,gmKm3S2:8978.14,rotationPeriodHours:382.68,axialTiltDeg:0,meanTemperatureK:94,colorHex:"#e5a84b",atmosphere:{surfacePressureBar:1.45,composition:[{gas:"N2",percentage:95},{gas:"CH4",percentage:4.9}]}},orbit:{semiMajorAxisKm:1221971892e-3,semiMajorAxisAU:.0081683776,eccentricity:.02881004,inclinationDeg:27.705537,longitudeAscendingNodeDeg:169.080756,argumentPeriapsisDeg:178.340423,meanAnomalyAtEpochDeg:328.923552,orbitalPeriodDays:15.94542068,epochJd:24613275e-1,meanMotionDegPerDay:22.577014882,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Second-largest moon in the Solar System, enveloped by a dense nitrogen-methane atmosphere supporting active liquid methane/ethane lakes, rivers, and rain hydrologic cycles."},{id:"607",name:"Hyperion",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:135,massKg:56199e14,rotationPeriodHours:300,colorHex:"#9c8c7c"},orbit:{semiMajorAxisKm:1486933985e-3,semiMajorAxisAU:.0099395398,eccentricity:.09542499,inclinationDeg:27.056176,longitudeAscendingNodeDeg:169.549243,argumentPeriapsisDeg:67.294493,meanAnomalyAtEpochDeg:98.155885,orbitalPeriodDays:21.2766088,epochJd:24613275e-1,meanMotionDegPerDay:16.919989618,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Sponge-like irregularly shaped moon with low density (high porosity) undergoing non-repeating chaotic rotation influenced by Titan."},{id:"608",name:"Iapetus",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:734.3,massKg:18056e17,rotationPeriodHours:1903.92,colorHex:"#847970"},orbit:{semiMajorAxisKm:3565269983e-3,semiMajorAxisAU:.0238323578,eccentricity:.02970025,inclinationDeg:16.979231,longitudeAscendingNodeDeg:138.869009,argumentPeriapsisDeg:230.853136,meanAnomalyAtEpochDeg:320.152812,orbitalPeriodDays:79.3301825,epochJd:24613275e-1,meanMotionDegPerDay:4.537995359,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Two-tone world with extreme albedo dichotomy (pitch-black Cassini Regio leading hemisphere and brilliant ice trailing hemisphere), plus a towering 20 km equatorial ridge."},{id:"705",name:"Miranda",category:"moon",orderFromSun:7,parentId:"799",parentName:"Uranus",physical:{meanRadiusKm:235.8,massKg:659e17,rotationPeriodHours:33.91,colorHex:"#a0a0a0"},orbit:{semiMajorAxisKm:129871.122,semiMajorAxisAU:.0008681348,eccentricity:.0011248,inclinationDeg:97.989082,longitudeAscendingNodeDeg:163.186619,argumentPeriapsisDeg:67.391864,meanAnomalyAtEpochDeg:207.222114,orbitalPeriodDays:1.413479,epochJd:24613275e-1,meanMotionDegPerDay:254.690731168,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Exhibits extreme, chaotic terrain with gigantic tectonic rift grabens and chevron-shaped coronae, including Verona Rupes (tallest cliff in the Solar System at 20 km)."},{id:"701",name:"Ariel",category:"moon",orderFromSun:7,parentId:"799",parentName:"Uranus",physical:{meanRadiusKm:578.9,massKg:1251e18,rotationPeriodHours:60.48,colorHex:"#b4b4b4"},orbit:{semiMajorAxisKm:190944.721,semiMajorAxisAU:.0012763866,eccentricity:5326e-7,inclinationDeg:97.718049,longitudeAscendingNodeDeg:167.665855,argumentPeriapsisDeg:276.587566,meanAnomalyAtEpochDeg:51.205773,orbitalPeriodDays:2.520379,epochJd:24613275e-1,meanMotionDegPerDay:142.835660827,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Brightest moon of Uranus; dissected by extensive interconnected fault scarps, deep graben valleys, and cryovolcanic flows."},{id:"702",name:"Umbriel",category:"moon",orderFromSun:7,parentId:"799",parentName:"Uranus",physical:{meanRadiusKm:584.7,massKg:1275e18,rotationPeriodHours:99.46,colorHex:"#737373"},orbit:{semiMajorAxisKm:265988.581,semiMajorAxisAU:.0017780238,eccentricity:.00337264,inclinationDeg:97.714436,longitudeAscendingNodeDeg:167.725316,argumentPeriapsisDeg:66.275993,meanAnomalyAtEpochDeg:14.683581,orbitalPeriodDays:4.144177,epochJd:24613275e-1,meanMotionDegPerDay:86.868876498,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Darkest and most heavily cratered of Uranus’s large satellites, marked by the mysterious bright fluorescent ring floor of crater Wunda."},{id:"703",name:"Titania",category:"moon",orderFromSun:7,parentId:"799",parentName:"Uranus",physical:{meanRadiusKm:788.9,massKg:342e19,rotationPeriodHours:208.94,colorHex:"#9f9994"},orbit:{semiMajorAxisKm:436251.111,semiMajorAxisAU:.0029161586,eccentricity:.00197821,inclinationDeg:97.762135,longitudeAscendingNodeDeg:167.643651,argumentPeriapsisDeg:280.488041,meanAnomalyAtEpochDeg:236.26202,orbitalPeriodDays:8.705872,epochJd:24613275e-1,meanMotionDegPerDay:41.351400526,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Largest moon of Uranus; fractured by vast canyon systems (Messina Chasma) resulting from internal freezing and expansion of a primordial subsurface ocean."},{id:"704",name:"Oberon",category:"moon",orderFromSun:7,parentId:"799",parentName:"Uranus",physical:{meanRadiusKm:761.4,massKg:3014e18,rotationPeriodHours:323.11,colorHex:"#938c86"},orbit:{semiMajorAxisKm:583573.694,semiMajorAxisAU:.0039009492,eccentricity:.00243809,inclinationDeg:97.905711,longitudeAscendingNodeDeg:167.708289,argumentPeriapsisDeg:171.765242,meanAnomalyAtEpochDeg:34.68861,orbitalPeriodDays:13.463239,epochJd:24613275e-1,meanMotionDegPerDay:26.739479259,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Outermost major moon of Uranus; ancient heavily cratered ice-rock surface featuring prominent impact ray craters filled with dark carbonaceous deposits."},{id:"801",name:"Triton",category:"moon",orderFromSun:8,parentId:"899",parentName:"Neptune",physical:{meanRadiusKm:1352.6,massKg:2139e19,gmKm3S2:1427.6,rotationPeriodHours:-141.048,axialTiltDeg:0,meanTemperatureK:38,colorHex:"#e2cfc4"},orbit:{semiMajorAxisKm:354765.344,semiMajorAxisAU:.0023714598,eccentricity:10818e-8,inclinationDeg:129.126619,longitudeAscendingNodeDeg:222.868711,argumentPeriapsisDeg:109.713483,meanAnomalyAtEpochDeg:179.672821,orbitalPeriodDays:5.876854,epochJd:24613275e-1,meanMotionDegPerDay:61.257264516,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Captured Kuiper Belt dwarf planet orbiting Neptune in a retrograde direction; coldest measured surface in the Solar System (38 K) with nitrogen cryogeysers and cantaloupe terrain."},{id:"999",name:"Pluto",category:"dwarf_planet",orderFromSun:9,physical:{meanRadiusKm:1188.3,equatorialRadiusKm:1188.3,polarRadiusKm:1188.3,flattening:0,massKg:1303e19,gmKm3S2:869.6,rotationPeriodHours:-153.2928,axialTiltDeg:122.53,meanTemperatureK:44,colorHex:"#c79f82"},orbit:{semiMajorAxisKm:5922374660,semiMajorAxisAU:39.5886293852,eccentricity:.2518378779,inclinationDeg:17.14771141,longitudeAscendingNodeDeg:110.29238405,argumentPeriapsisDeg:113.70900152,meanAnomalyAtEpochDeg:38.68366347,orbitalPeriodDays:90981.716,epochJd:24575885e-1,meanMotionDegPerDay:.003956838956,source:"JPL SBDB osculating elements"},description:'Largest known Kuiper Belt dwarf planet; features the high-albedo nitrogen-ice glacier Sputnik Planitia (the "Heart"), water-ice mountains, and blue atmospheric haze.'},{id:"901",name:"Charon",category:"moon",orderFromSun:9,parentId:"999",parentName:"Pluto",physical:{meanRadiusKm:606,massKg:1586e18,rotationPeriodHours:153.29,colorHex:"#99948e"},orbit:{semiMajorAxisKm:19595.763,semiMajorAxisAU:.0001309896,eccentricity:16098e-8,inclinationDeg:112.887772,longitudeAscendingNodeDeg:227.393077,argumentPeriapsisDeg:172.262887,meanAnomalyAtEpochDeg:355.44348,orbitalPeriodDays:6.3872304,epochJd:24613275e-1,meanMotionDegPerDay:56.362457193,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Mutually tidally locked binary companion to Pluto; features a dark reddish tholin polar hood (Mordor Macula) and massive equatorial tectonic chasms."},{id:"1",name:"Ceres",category:"dwarf_planet",orderFromSun:4.5,physical:{meanRadiusKm:469.7,equatorialRadiusKm:487.3,polarRadiusKm:446,flattening:.0847,massKg:93835e16,gmKm3S2:62.63,rotationPeriodHours:9.074,axialTiltDeg:4,meanTemperatureK:168,colorHex:"#88847e"},orbit:{semiMajorAxisKm:4137207795e-1,semiMajorAxisAU:2.765552595,eccentricity:.0796922951,inclinationDeg:10.5880278,longitudeAscendingNodeDeg:80.24862682,argumentPeriapsisDeg:73.29421453,meanAnomalyAtEpochDeg:274.41934638,orbitalPeriodDays:1679.853,epochJd:24612005e-1,meanMotionDegPerDay:.214304450648,source:"JPL SBDB osculating elements"},description:"Largest body in the asteroid belt, comprising ~33% of its total mass; differentiated protoplanet with an ice-rich mantle and bright sodium-carbonate salt spots (Cerealia Facula in Occator Crater)."},{id:"4",name:"Vesta",category:"asteroid",orderFromSun:4.3,physical:{meanRadiusKm:261.4,equatorialRadiusKm:286.3,polarRadiusKm:229,flattening:.2,massKg:259e18,rotationPeriodHours:5.342,axialTiltDeg:29,colorHex:"#a39b91"},orbit:{semiMajorAxisKm:3532553203e-1,semiMajorAxisAU:2.3613659651,eccentricity:.0902037438,inclinationDeg:7.14392555,longitudeAscendingNodeDeg:103.70129327,argumentPeriapsisDeg:151.46864782,meanAnomalyAtEpochDeg:81.19015608,orbitalPeriodDays:1325.389,epochJd:24612005e-1,meanMotionDegPerDay:.27161836136,source:"JPL SBDB osculating elements"},description:"Brightest asteroid visible from Earth; preserved basaltic differentiated protoplanet with metallic core, silicate mantle, and enormous south-polar impact crater Rheasilvia."},{id:"2",name:"Pallas",category:"asteroid",orderFromSun:4.6,physical:{meanRadiusKm:256.5,massKg:205e18,rotationPeriodHours:7.813,axialTiltDeg:84,colorHex:"#827f7a"},orbit:{semiMajorAxisKm:4143201308e-1,semiMajorAxisAU:2.7695590107,eccentricity:.2307000996,inclinationDeg:34.93279322,longitudeAscendingNodeDeg:172.88661934,argumentPeriapsisDeg:310.96991617,meanAnomalyAtEpochDeg:254.24965217,orbitalPeriodDays:1683.505,epochJd:24612005e-1,meanMotionDegPerDay:.213839602925,source:"JPL SBDB osculating elements"},description:"Third-largest asteroid in the belt; notable for its unusually high 34.8° orbital inclination and dynamic golf-ball-like surface topography."},{id:"10",name:"Hygiea",category:"asteroid",orderFromSun:4.8,physical:{meanRadiusKm:203.6,massKg:832e17,rotationPeriodHours:13.825,colorHex:"#605c57"},orbit:{semiMajorAxisKm:4713790061e-1,semiMajorAxisAU:3.150974034,eccentricity:.1067092741,inclinationDeg:3.82952995,longitudeAscendingNodeDeg:283.11989275,argumentPeriapsisDeg:312.42423873,meanAnomalyAtEpochDeg:252.03442424,orbitalPeriodDays:2042.987,epochJd:24612005e-1,meanMotionDegPerDay:.176212550579,source:"JPL SBDB osculating elements"},description:"Fourth-largest asteroid and major carbonaceous C-type asteroid; nearly spherical body likely formed from a catastrophic impact parent-body disruption."},{id:"16",name:"Psyche",category:"asteroid",orderFromSun:4.7,physical:{meanRadiusKm:111,massKg:229e17,rotationPeriodHours:4.196,axialTiltDeg:95,colorHex:"#b8aba0"},orbit:{semiMajorAxisKm:437681552,semiMajorAxisAU:2.9257204665,eccentricity:.1349324738,inclinationDeg:3.09874912,longitudeAscendingNodeDeg:149.97538593,argumentPeriapsisDeg:230.03267827,meanAnomalyAtEpochDeg:79.76939505,orbitalPeriodDays:1827.88,epochJd:24612005e-1,meanMotionDegPerDay:.196949475811,source:"JPL SBDB osculating elements"},description:"Enormous metallic M-type asteroid thought to be the exposed nickel-iron core of an early protoplanet stripped by hit-and-run collisions; target of NASA’s Psyche mission."},{id:"433",name:"Eros",category:"asteroid",orderFromSun:3.5,physical:{meanRadiusKm:8.42,massKg:6687e12,rotationPeriodHours:5.27,colorHex:"#998d7f"},orbit:{semiMajorAxisKm:218150155,semiMajorAxisAU:1.4582437168,eccentricity:.2228779628,inclinationDeg:10.8285441,longitudeAscendingNodeDeg:304.26797134,argumentPeriapsisDeg:178.91813191,meanAnomalyAtEpochDeg:62.51145502,orbitalPeriodDays:643.196,epochJd:24612005e-1,meanMotionDegPerDay:.559704634704,source:"JPL SBDB osculating elements"},description:"Elongated peanut-shaped S-type near-Earth asteroid; historic target orbited and landed upon by the NEAR Shoemaker spacecraft in 2001."},{id:"951",name:"Gaspra",category:"asteroid",orderFromSun:4.1,physical:{meanRadiusKm:6.1,massKg:2e16,rotationPeriodHours:7.042,colorHex:"#a09485"},orbit:{semiMajorAxisKm:330608056,semiMajorAxisAU:2.2099783537,eccentricity:.1737374595,inclinationDeg:4.10465497,longitudeAscendingNodeDeg:252.96729133,argumentPeriapsisDeg:130.00376374,meanAnomalyAtEpochDeg:112.95087164,orbitalPeriodDays:1199.998,epochJd:24612005e-1,meanMotionDegPerDay:.300000545277,source:"JPL SBDB osculating elements"},description:"First asteroid ever visited by a spacecraft (Galileo flyby in 1991); irregular S-type asteroid with prominent groove-like depressions."},{id:"243",name:"Ida",category:"asteroid",orderFromSun:4.6,physical:{meanRadiusKm:15.7,massKg:42e15,rotationPeriodHours:4.634,colorHex:"#9c9284"},orbit:{semiMajorAxisKm:4283507686e-1,semiMajorAxisAU:2.8633480317,eccentricity:.046109628,inclinationDeg:1.13036309,longitudeAscendingNodeDeg:323.53666094,argumentPeriapsisDeg:113.25718268,meanAnomalyAtEpochDeg:49.64769088,orbitalPeriodDays:1769.741,epochJd:24612005e-1,meanMotionDegPerDay:.20341963288,source:"JPL SBDB osculating elements"},description:"Coronis-family asteroid visited by Galileo in 1993, famous for the historic discovery of Dactyl, the first recognized asteroid moon."},{id:"101955",name:"Bennu",category:"asteroid",orderFromSun:3.2,physical:{meanRadiusKm:.242,massKg:7329e7,rotationPeriodHours:4.296,colorHex:"#3a3a3a"},orbit:{semiMajorAxisKm:168505699,semiMajorAxisAU:1.1263910259,eccentricity:.2037450762,inclinationDeg:6.03494377,longitudeAscendingNodeDeg:2.0608662,argumentPeriapsisDeg:66.22306084,meanAnomalyAtEpochDeg:101.703952,orbitalPeriodDays:436.649,epochJd:24555625e-1,meanMotionDegPerDay:.824461350332,source:"JPL SBDB osculating elements"},description:"Diamond-shaped carbonaceous rubble-pile near-Earth asteroid sampled by NASA’s OSIRIS-REx spacecraft, delivering pristine solar nebula samples to Earth in 2023."},{id:"162173",name:"Ryugu",category:"asteroid",orderFromSun:3.3,physical:{meanRadiusKm:.448,massKg:45e10,rotationPeriodHours:7.632,colorHex:"#353535"},orbit:{semiMajorAxisKm:1781589365e-1,semiMajorAxisAU:1.1909189327,eccentricity:.1910730046,inclinationDeg:5.86644249,longitudeAscendingNodeDeg:251.2897124,argumentPeriapsisDeg:211.60899381,meanAnomalyAtEpochDeg:62.34067409,orbitalPeriodDays:474.703,epochJd:24612005e-1,meanMotionDegPerDay:.758369353853,source:"JPL SBDB osculating elements"},description:"Spinning-top shaped Cb-type near-Earth asteroid sampled by JAXA’s Hayabusa2 spacecraft, rich in water-bearing minerals and prebiotic amino acids."}],jt=[...ps,...gs],Re={id:"SGR_A_STAR",name:"Sagittarius A*",category:"black_hole",orderFromSun:999,physical:{meanRadiusKm:12690400,equatorialRadiusKm:32971e3,polarRadiusKm:12690400,flattening:0,massKg:8544455e30,gmKm3S2:570283e12,rotationPeriodHours:.18,axialTiltDeg:42,meanTemperatureK:1e7,colorHex:"#ffaa33"},orbit:{semiMajorAxisKm:2554e14,semiMajorAxisAU:1707e6,eccentricity:0,inclinationDeg:60.19,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:0,orbitalPeriodDays:23e7*365.25},description:"Supermassive black hole at the gravitational center of the Milky Way galaxy (mass 4.3 million solar masses, distance 27,000 ly). Demonstrates extreme relativistic light bending, an apparent gravitational shadow, a photon sphere, and a glowing synchrotron accretion disk."},fe=class fe{static getSagittariusAStar(){return Re}static getAllBodies(){return this.bodies}static getBody(e){return this.bodiesById.get(e)||this.bodiesByName.get(e.toLowerCase())}static getParent(e){if(e.parentId)return this.bodiesById.get(e.parentId)}static getMoonsOf(e){const t=this.getBody(e);return t?this.moonsByParentId.get(t.id)||[]:[]}static getByCategory(e){return this.bodies.filter(t=>t.category===e)}static getPlanets(){return this.getByCategory("planet")}static getMoons(){return this.getByCategory("moon")}static getDwarfPlanets(){return this.getByCategory("dwarf_planet")}static getAsteroids(){return this.getByCategory("asteroid")}static search(e){const t=e.trim().toLowerCase();return t?this.bodies.filter(a=>a.name.toLowerCase().includes(t)||a.category.toLowerCase().includes(t)||a.parentName&&a.parentName.toLowerCase().includes(t)||a.description.toLowerCase().includes(t)):this.bodies}static getStats(){return{total:this.bodies.length,stars:this.getByCategory("star").length,planets:this.getPlanets().length,moons:this.getMoons().length,dwarfPlanets:this.getDwarfPlanets().length,asteroids:this.getAsteroids().length}}};d(fe,"bodies",jt),d(fe,"bodiesById",new Map([...jt.map(e=>[e.id,e]),[Re.id,Re]])),d(fe,"bodiesByName",new Map([...jt.map(e=>[e.name.toLowerCase(),e]),["sagittarius a*",Re],["sgr a*",Re],["sgr a",Re],["black hole",Re]])),d(fe,"moonsByParentId",new Map),(()=>{for(const e of fe.bodies)e.parentId&&(fe.moonsByParentId.has(e.parentId)||fe.moonsByParentId.set(e.parentId,[]),fe.moonsByParentId.get(e.parentId).push(e))})();let J=fe;class qe{static getTexture(e){if(this.cache.has(e))return this.cache.get(e);let t;switch(e){case"Sun":t=this.createSunTexture();break;case"Mercury":t=this.createMercuryTexture();break;case"Venus":t=this.createVenusTexture();break;case"Earth":t=this.createEarthTexture();break;case"EarthClouds":t=this.createEarthCloudsTexture();break;case"Mars":t=this.createMarsTexture();break;case"Jupiter":t=this.createJupiterTexture();break;case"Saturn":t=this.createSaturnTexture();break;case"SaturnRings":t=this.createSaturnRingsTexture();break;case"Uranus":t=this.createUranusTexture();break;case"Neptune":t=this.createNeptuneTexture();break;case"Moon":t=this.createMoonTexture();break;case"Io":t=this.createIoTexture();break;case"Europa":t=this.createEuropaTexture();break;case"Ganymede":t=this.createGanymedeTexture();break;case"Callisto":t=this.createCallistoTexture();break;case"Titan":t=this.createTitanTexture();break;case"Enceladus":t=this.createEnceladusTexture();break;case"Triton":t=this.createTritonTexture();break;case"Pluto":t=this.createPlutoTexture();break;case"Ceres":t=this.createCeresTexture();break;default:t=this.createRockyCrateredTexture(e)}return this.cache.set(e,t),t}static createSunTexture(){const a=document.createElement("canvas");a.width=1024,a.height=512;const i=a.getContext("2d"),s=i.createLinearGradient(0,0,0,512);s.addColorStop(0,"#fff4cc"),s.addColorStop(.5,"#ffbb33"),s.addColorStop(1,"#ff8800"),i.fillStyle=s,i.fillRect(0,0,1024,512);const o=i.getImageData(0,0,1024,512),r=o.data;for(let n=0;n<r.length;n+=4){const h=n/4%1024,m=Math.floor(n/4/1024),p=Math.sin(h*.05)*Math.cos(m*.05),f=Math.sin(h*.12+1.2)*Math.cos(m*.12+.8),g=Math.sin(h*.25)*Math.sin(m*.25),v=p*.5+f*.3+g*.2;r[n]=Math.min(255,Math.max(180,245+v*35)),r[n+1]=Math.min(240,Math.max(120,180+v*55)),r[n+2]=Math.min(180,Math.max(20,60+v*40)),r[n+3]=255}i.putImageData(o,0,0),i.fillStyle="rgba(120, 30, 0, 0.6)";for(let n=0;n<12;n++){const h=(n*85+40)%1024,m=160+n*37%180,p=6+n%5*3;i.beginPath(),i.arc(h,m,p,0,Math.PI*2),i.fill(),i.fillStyle="rgba(60, 10, 0, 0.85)",i.beginPath(),i.arc(h,m,p*.45,0,Math.PI*2),i.fill()}const c=new B(a);return c.wrapS=V,c.wrapT=_,c}static createMercuryTexture(){const a=document.createElement("canvas");a.width=1024,a.height=512;const i=a.getContext("2d");i.fillStyle="#78736d",i.fillRect(0,0,1024,512);const s=i.getImageData(0,0,1024,512),o=s.data;for(let c=0;c<o.length;c+=4){const n=c/4%1024,h=Math.floor(c/4/1024),p=120+(Math.sin(n*.08)*Math.cos(h*.08)+Math.sin(n*.2)*Math.sin(h*.2))*18;o[c]=p*.95,o[c+1]=p*.93,o[c+2]=p*.9,o[c+3]=255}i.putImageData(s,0,0);for(let c=0;c<120;c++){const n=(c*79+33)%1024,h=20+c*47%472,m=4+c%15*2;i.fillStyle="rgba(40, 38, 36, 0.4)",i.beginPath(),i.arc(n,h,m,0,Math.PI*2),i.fill(),i.strokeStyle="rgba(210, 205, 200, 0.35)",i.lineWidth=1.5,i.beginPath(),i.arc(n,h,m,Math.PI*.8,Math.PI*1.8),i.stroke()}const r=new B(a);return r.wrapS=V,r.wrapT=_,r}static createVenusTexture(){const a=document.createElement("canvas");a.width=1024,a.height=512;const i=a.getContext("2d"),s=i.createLinearGradient(0,0,0,512);s.addColorStop(0,"#f0d8a8"),s.addColorStop(.2,"#ecd096"),s.addColorStop(.5,"#e5c483"),s.addColorStop(.8,"#ecd096"),s.addColorStop(1,"#f0d8a8"),i.fillStyle=s,i.fillRect(0,0,1024,512),i.fillStyle="rgba(215, 180, 110, 0.25)";for(let r=0;r<18;r++){const c=r*28.444444444444443;i.beginPath(),i.moveTo(0,c);for(let n=0;n<=1024;n+=30){const h=Math.sin(n*.015+r)*12+Math.cos(n*.03)*6;i.lineTo(n,c+h)}i.lineTo(1024,c+20),i.lineTo(0,c+20),i.closePath(),i.fill()}const o=new B(a);return o.wrapS=V,o.wrapT=_,o}static createEarthTexture(){const a=document.createElement("canvas");a.width=1024,a.height=512;const i=a.getContext("2d");i.fillStyle="#0f274a",i.fillRect(0,0,1024,512);const s=i.createLinearGradient(0,0,0,512);s.addColorStop(0,"rgba(25, 65, 115, 0.4)"),s.addColorStop(.5,"rgba(10, 35, 75, 0.1)"),s.addColorStop(1,"rgba(25, 65, 115, 0.4)"),i.fillStyle=s,i.fillRect(0,0,1024,512),i.fillStyle="#2d5930",i.beginPath(),i.ellipse(1024*.58,512*.38,140,85,.1,0,Math.PI*2),i.ellipse(1024*.53,512*.62,70,95,-.15,0,Math.PI*2),i.fill(),i.beginPath(),i.ellipse(1024*.22,512*.32,95,75,-.2,0,Math.PI*2),i.ellipse(1024*.3,512*.65,60,90,.25,0,Math.PI*2),i.fill(),i.beginPath(),i.ellipse(1024*.82,512*.72,45,35,.1,0,Math.PI*2),i.fill(),i.fillStyle="#9e8548",i.beginPath(),i.ellipse(1024*.52,512*.45,65,30,0,0,Math.PI*2),i.ellipse(1024*.82,512*.72,28,20,0,0,Math.PI*2),i.fill(),i.fillStyle="#f0f6ff",i.beginPath(),i.rect(0,0,1024,28),i.fill(),i.beginPath(),i.rect(0,476,1024,36),i.fill();const o=new B(a);return o.wrapS=V,o.wrapT=_,o}static createEarthCloudsTexture(){const a=document.createElement("canvas");a.width=1024,a.height=512;const i=a.getContext("2d");i.clearRect(0,0,1024,512),i.fillStyle="rgba(255, 255, 255, 0.75)";for(let o=0;o<28;o++){const r=(o*65+15)%1024,c=60+o*42%392,n=55+o%7*15,h=18+o%4*6;i.beginPath(),i.ellipse(r,c,n,h,o%5*.2,0,Math.PI*2),i.fill()}const s=new B(a);return s.wrapS=V,s.wrapT=_,s}static createMarsTexture(){const a=document.createElement("canvas");a.width=1024,a.height=512;const i=a.getContext("2d");i.fillStyle="#bd532b",i.fillRect(0,0,1024,512),i.fillStyle="rgba(68, 38, 25, 0.45)",i.beginPath(),i.ellipse(1024*.45,512*.52,90,45,.2,0,Math.PI*2),i.ellipse(1024*.75,512*.42,70,50,-.1,0,Math.PI*2),i.ellipse(1024*.15,512*.58,60,35,.15,0,Math.PI*2),i.fill(),i.fillStyle="rgba(165, 80, 45, 0.8)",i.beginPath(),i.arc(1024*.28,512*.45,24,0,Math.PI*2),i.fill(),i.fillStyle="#3a2015",i.beginPath(),i.arc(1024*.28,512*.45,6,0,Math.PI*2),i.fill(),i.fillStyle="#f8f4f0",i.beginPath(),i.ellipse(1024*.5,12,110,12,0,0,Math.PI*2),i.fill(),i.beginPath(),i.ellipse(1024*.5,498,85,14,0,0,Math.PI*2),i.fill();const s=new B(a);return s.wrapS=V,s.wrapT=_,s}static createJupiterTexture(){const a=document.createElement("canvas");a.width=1024,a.height=512;const i=a.getContext("2d"),s=["#a88460","#dec8aa","#8f5c35","#f2e2ce","#9e673d","#ebd5be","#82522e","#f5e8da","#916139","#e6cfb8"],o=512/s.length;for(let m=0;m<s.length;m++)i.fillStyle=s[m],i.fillRect(0,m*o,1024,o);for(let m=0;m<s.length;m++){const p=m*o;i.fillStyle=m%2===0?"rgba(80, 45, 20, 0.35)":"rgba(255, 245, 235, 0.35)",i.beginPath(),i.moveTo(0,p);for(let f=0;f<=1024;f+=25){const g=Math.sin(f*.03+m*2)*5+Math.cos(f*.08)*3;i.lineTo(f,p+g)}i.lineTo(1024,p+o*.5),i.lineTo(0,p+o*.5),i.closePath(),i.fill()}const r=1024*.65,c=512*.62,n=i.createRadialGradient(r,c,5,r,c,32);n.addColorStop(0,"#c43d22"),n.addColorStop(.6,"#b5482e"),n.addColorStop(1,"#8f5c35"),i.fillStyle=n,i.beginPath(),i.ellipse(r,c,36,20,-.08,0,Math.PI*2),i.fill(),i.strokeStyle="rgba(255, 255, 255, 0.5)",i.lineWidth=2.5,i.beginPath(),i.ellipse(r+45,c-4,18,9,.1,0,Math.PI*2),i.stroke();const h=new B(a);return h.wrapS=V,h.wrapT=_,h}static createSaturnTexture(){const a=document.createElement("canvas");a.width=1024,a.height=512;const i=a.getContext("2d"),s=i.createLinearGradient(0,0,0,512);s.addColorStop(0,"#757c6b"),s.addColorStop(.2,"#ccb98d"),s.addColorStop(.4,"#e8dcba"),s.addColorStop(.5,"#f4ebd2"),s.addColorStop(.6,"#e8dcba"),s.addColorStop(.8,"#ccb98d"),s.addColorStop(1,"#80806a"),i.fillStyle=s,i.fillRect(0,0,1024,512);for(let r=0;r<30;r++){const c=r/30*512;i.fillStyle=r%2===0?"rgba(120, 100, 70, 0.08)":"rgba(255, 250, 240, 0.08)",i.fillRect(0,c,1024,512/30)}const o=new B(a);return o.wrapS=V,o.wrapT=_,o}static createSaturnRingsTexture(){const a=document.createElement("canvas");a.width=1024,a.height=64;const i=a.getContext("2d");i.clearRect(0,0,1024,64);const s=i.createLinearGradient(0,0,1024,0);s.addColorStop(0,"rgba(140, 130, 115, 0.0)"),s.addColorStop(.05,"rgba(150, 140, 125, 0.25)"),s.addColorStop(.18,"rgba(160, 150, 130, 0.35)"),s.addColorStop(.2,"rgba(225, 215, 185, 0.85)"),s.addColorStop(.35,"rgba(240, 230, 205, 0.95)"),s.addColorStop(.55,"rgba(230, 220, 195, 0.90)"),s.addColorStop(.57,"rgba(40, 35, 30, 0.02)"),s.addColorStop(.63,"rgba(40, 35, 30, 0.02)"),s.addColorStop(.65,"rgba(215, 205, 180, 0.75)"),s.addColorStop(.8,"rgba(225, 215, 190, 0.80)"),s.addColorStop(.83,"rgba(40, 35, 30, 0.05)"),s.addColorStop(.85,"rgba(220, 210, 185, 0.70)"),s.addColorStop(.95,"rgba(180, 170, 150, 0.35)"),s.addColorStop(1,"rgba(140, 130, 115, 0.0)"),i.fillStyle=s,i.fillRect(0,0,1024,64);const o=new B(a);return o.wrapS=_,o.wrapT=_,o}static createUranusTexture(){const a=document.createElement("canvas");a.width=512,a.height=256;const i=a.getContext("2d"),s=i.createLinearGradient(0,0,0,256);return s.addColorStop(0,"#75c8d6"),s.addColorStop(.5,"#8ee0ed"),s.addColorStop(1,"#75c8d6"),i.fillStyle=s,i.fillRect(0,0,512,256),new B(a)}static createNeptuneTexture(){const a=document.createElement("canvas");a.width=1024,a.height=512;const i=a.getContext("2d"),s=i.createLinearGradient(0,0,0,512);s.addColorStop(0,"#2d4aa0"),s.addColorStop(.3,"#3a62cb"),s.addColorStop(.5,"#4a75e6"),s.addColorStop(.7,"#3a62cb"),s.addColorStop(1,"#2d4aa0"),i.fillStyle=s,i.fillRect(0,0,1024,512),i.fillStyle="rgba(25, 40, 110, 0.35)",i.fillRect(0,512*.55,1024,40),i.fillStyle="#1b2c75",i.beginPath(),i.ellipse(1024*.45,512*.58,45,24,0,0,Math.PI*2),i.fill(),i.fillStyle="rgba(235, 245, 255, 0.8)",i.beginPath(),i.ellipse(1024*.45+50,512*.58-10,22,6,.1,0,Math.PI*2),i.fill();const o=new B(a);return o.wrapS=V,o.wrapT=_,o}static createMoonTexture(){const a=document.createElement("canvas");a.width=512,a.height=256;const i=a.getContext("2d");i.fillStyle="#aba8a2",i.fillRect(0,0,512,256);const s=i.getImageData(0,0,512,256),o=s.data;for(let n=0;n<o.length;n+=4){const h=(Math.random()-.5)*24;o[n]=Math.max(0,Math.min(255,o[n]+h)),o[n+1]=Math.max(0,Math.min(255,o[n+1]+h)),o[n+2]=Math.max(0,Math.min(255,o[n+2]+h))}i.putImageData(s,0,0);const r=[{x:512*.35,y:256*.35,rx:55,ry:45,color:"#4a4844"},{x:512*.48,y:256*.38,rx:35,ry:30,color:"#4d4a46"},{x:512*.55,y:256*.48,rx:40,ry:32,color:"#494743"},{x:512*.22,y:256*.42,rx:65,ry:60,color:"#52504b"},{x:512*.42,y:256*.55,rx:38,ry:28,color:"#4b4844"},{x:512*.65,y:256*.45,rx:30,ry:25,color:"#504d49"}];for(const n of r){const h=i.createRadialGradient(n.x,n.y,5,n.x,n.y,n.rx);h.addColorStop(0,n.color),h.addColorStop(.85,n.color),h.addColorStop(1,"rgba(171, 168, 162, 0)"),i.fillStyle=h,i.beginPath(),i.ellipse(n.x,n.y,n.rx,n.ry,0,0,Math.PI*2),i.fill()}i.fillStyle="#ffffff",i.beginPath(),i.arc(512*.42,256*.72,4,0,Math.PI*2),i.fill(),i.strokeStyle="rgba(255, 255, 255, 0.25)",i.lineWidth=1;for(let n=0;n<Math.PI*2;n+=.35)i.beginPath(),i.moveTo(512*.42,256*.72),i.lineTo(512*.42+Math.cos(n)*75,256*.72+Math.sin(n)*75),i.stroke();const c=new B(a);return c.wrapS=V,c.wrapT=_,c}static createIoTexture(){const a=document.createElement("canvas");a.width=512,a.height=256;const i=a.getContext("2d");i.fillStyle="#e5c158",i.fillRect(0,0,512,256);for(let r=0;r<40;r++){const c=Math.random()*512,n=Math.random()*256,h=10+Math.random()*25;i.fillStyle=Math.random()>.5?"rgba(215, 140, 30, 0.45)":"rgba(245, 230, 150, 0.4)",i.beginPath(),i.arc(c,n,h,0,Math.PI*2),i.fill()}const s=[{x:512*.25,y:256*.45,r:10,color:"#7a1800"},{x:512*.65,y:256*.35,r:14,color:"#2b1005"},{x:512*.45,y:256*.6,r:8,color:"#8c2505"},{x:512*.8,y:256*.55,r:11,color:"#541505"},{x:512*.15,y:256*.7,r:7,color:"#882200"}];for(const r of s)i.strokeStyle="rgba(200, 50, 0, 0.6)",i.lineWidth=3,i.beginPath(),i.arc(r.x,r.y,r.r*2.2,0,Math.PI*2),i.stroke(),i.fillStyle=r.color,i.beginPath(),i.arc(r.x,r.y,r.r,0,Math.PI*2),i.fill();const o=new B(a);return o.wrapS=V,o.wrapT=_,o}static createEuropaTexture(){const a=document.createElement("canvas");a.width=1024,a.height=512;const i=a.getContext("2d");i.fillStyle="#f4f6fa",i.fillRect(0,0,1024,512);const s=i.createLinearGradient(0,0,0,512*.25);s.addColorStop(0,"rgba(230, 240, 250, 0.6)"),s.addColorStop(1,"rgba(244, 246, 250, 0.0)"),i.fillStyle=s,i.fillRect(0,0,1024,512*.25);const o=i.createLinearGradient(0,512,0,512*.75);o.addColorStop(0,"rgba(230, 240, 250, 0.6)"),o.addColorStop(1,"rgba(244, 246, 250, 0.0)"),i.fillStyle=o,i.fillRect(0,512*.75,1024,512*.25);for(let m=0;m<35;m++){const p=m*37%1024,f=512*.3+m*29%(512*.4),g=25+m%5*12,v=i.createRadialGradient(p,f,2,p,f,g);v.addColorStop(0,"rgba(225, 232, 240, 0.25)"),v.addColorStop(1,"rgba(244, 246, 250, 0.0)"),i.fillStyle=v,i.beginPath(),i.arc(p,f,g,0,Math.PI*2),i.fill()}const r=[{x:1024*.28,y:512*.45,rx:42,ry:28},{x:1024*.62,y:512*.52,rx:36,ry:24},{x:1024*.45,y:512*.35,rx:30,ry:20},{x:1024*.82,y:512*.42,rx:38,ry:25}];for(const m of r){const p=i.createRadialGradient(m.x,m.y,5,m.x,m.y,m.rx);p.addColorStop(0,"rgba(175, 135, 105, 0.16)"),p.addColorStop(.7,"rgba(160, 125, 98, 0.10)"),p.addColorStop(1,"rgba(244, 246, 250, 0.0)"),i.fillStyle=p,i.beginPath(),i.ellipse(m.x,m.y,m.rx,m.ry,.2,0,Math.PI*2),i.fill()}let c=42;const n=()=>(c=c*16807%2147483647,(c-1)/2147483646);for(let m=0;m<32;m++){const p=n()*1024,f=512*.15+n()*512*.7,g=80+n()*160,v=(n()-.5)*Math.PI*1.4,S=p+Math.cos(v)*(g*.5)+(n()-.5)*40,x=f+Math.sin(v)*(g*.5)+(n()-.5)*40,b=p+Math.cos(v)*g,D=f+Math.sin(v)*g;i.strokeStyle="rgba(155, 115, 90, 0.14)",i.lineWidth=4,i.beginPath(),i.moveTo(p,f),i.quadraticCurveTo(S,x,b,D),i.stroke(),i.strokeStyle="rgba(115, 80, 65, 0.45)",i.lineWidth=1.2,i.beginPath(),i.moveTo(p,f),i.quadraticCurveTo(S,x,b,D),i.stroke(),i.strokeStyle="rgba(255, 255, 255, 0.55)",i.lineWidth=.8,i.beginPath(),i.moveTo(p+1,f+1),i.quadraticCurveTo(S+1,x+1,b+1,D+1),i.stroke()}i.strokeStyle="rgba(130, 95, 78, 0.22)",i.lineWidth=.7;for(let m=0;m<50;m++){const p=n()*1024,f=n()*512,g=30+n()*60,v=n()*Math.PI*2;i.beginPath(),i.moveTo(p,f),i.lineTo(p+Math.cos(v)*g,f+Math.sin(v)*g),i.stroke()}const h=new B(a);return h.wrapS=V,h.wrapT=_,h}static createGanymedeTexture(){const a=document.createElement("canvas");a.width=512,a.height=256;const i=a.getContext("2d");i.fillStyle="#6e655c",i.fillRect(0,0,512,256),i.fillStyle="#9c9288";for(let o=0;o<14;o++){const r=(o*20+10)%256;i.fillRect(0,r,512,8+o%4*3)}i.strokeStyle="rgba(230, 230, 230, 0.35)",i.lineWidth=1;for(let o=0;o<256;o+=6)i.beginPath(),i.moveTo(0,o),i.lineTo(512,o+Math.sin(o*.1)*8),i.stroke();const s=new B(a);return s.wrapS=V,s.wrapT=_,s}static createCallistoTexture(){const a=document.createElement("canvas");a.width=512,a.height=256;const i=a.getContext("2d");i.fillStyle="#4e4741",i.fillRect(0,0,512,256);for(let c=0;c<180;c++){const n=Math.random()*512,h=Math.random()*256,m=2+Math.random()*8;i.fillStyle="#2f2a26",i.beginPath(),i.arc(n,h,m,0,Math.PI*2),i.fill(),i.strokeStyle="rgba(220, 225, 235, 0.7)",i.lineWidth=1,i.beginPath(),i.arc(n,h,m,0,Math.PI),i.stroke()}const s=512*.45,o=256*.4;i.strokeStyle="rgba(200, 210, 220, 0.4)";for(let c=8;c<=55;c+=7)i.beginPath(),i.arc(s,o,c,0,Math.PI*2),i.stroke();const r=new B(a);return r.wrapS=V,r.wrapT=_,r}static createTitanTexture(){const a=document.createElement("canvas");a.width=512,a.height=256;const i=a.getContext("2d"),s=i.createLinearGradient(0,0,0,256);s.addColorStop(0,"#c78028"),s.addColorStop(.2,"#dba046"),s.addColorStop(.5,"#e8b258"),s.addColorStop(.8,"#dba046"),s.addColorStop(1,"#c07820"),i.fillStyle=s,i.fillRect(0,0,512,256),i.fillStyle="rgba(210, 130, 40, 0.2)",i.fillRect(0,256*.35,512,25),i.fillRect(0,256*.6,512,25);const o=new B(a);return o.wrapS=V,o.wrapT=_,o}static createEnceladusTexture(){const a=document.createElement("canvas");a.width=512,a.height=256;const i=a.getContext("2d");i.fillStyle="#f6f8fb",i.fillRect(0,0,512,256),i.strokeStyle="#68a0c8",i.lineWidth=2;for(let o=0;o<4;o++){const r=217.6+o*5;i.beginPath(),i.moveTo(512*.3,r),i.bezierCurveTo(512*.45,r+4,512*.55,r-4,512*.7,r),i.stroke()}const s=new B(a);return s.wrapS=V,s.wrapT=_,s}static createTritonTexture(){const a=document.createElement("canvas");a.width=512,a.height=256;const i=a.getContext("2d");i.fillStyle="#decac0",i.fillRect(0,0,512,256),i.fillStyle="rgba(165, 135, 125, 0.35)";for(let o=10;o<512;o+=16)for(let r=10;r<256*.6;r+=14)i.beginPath(),i.arc(o+r%8,r,5,0,Math.PI*2),i.fill();i.fillStyle="rgba(50, 40, 35, 0.6)";for(let o=0;o<8;o++){const r=102.4+o*45,c=256*.75+o%3*8;i.beginPath(),i.ellipse(r,c,12,3,.4,0,Math.PI*2),i.fill()}const s=new B(a);return s.wrapS=V,s.wrapT=_,s}static createPlutoTexture(){const a=document.createElement("canvas");a.width=512,a.height=256;const i=a.getContext("2d");i.fillStyle="#8f4f35",i.fillRect(0,0,512,256),i.fillStyle="#421f14",i.fillRect(0,256*.5,512*.45,45);const s=512*.62,o=256*.42;i.fillStyle="#f0e6dc",i.beginPath(),i.ellipse(s-16,o,28,35,-.2,0,Math.PI*2),i.fill(),i.ellipse(s+16,o,26,32,.2,0,Math.PI*2),i.fill();const r=new B(a);return r.wrapS=V,r.wrapT=_,r}static createCeresTexture(){const a=document.createElement("canvas");a.width=512,a.height=256;const i=a.getContext("2d");i.fillStyle="#6e6962",i.fillRect(0,0,512,256);for(let c=0;c<90;c++){const n=Math.random()*512,h=Math.random()*256,m=2+Math.random()*6;i.fillStyle="#48443e",i.beginPath(),i.arc(n,h,m,0,Math.PI*2),i.fill()}const s=512*.52,o=256*.44;i.fillStyle="#3a3630",i.beginPath(),i.arc(s,o,14,0,Math.PI*2),i.fill(),i.fillStyle="#ffffff",i.beginPath(),i.arc(s,o,3.5,0,Math.PI*2),i.fill();const r=new B(a);return r.wrapS=V,r.wrapT=_,r}static createRockyCrateredTexture(e){const i=document.createElement("canvas");i.width=256,i.height=128;const s=i.getContext("2d"),o=e==="Bennu"||e==="Ryugu"||e==="Hygiea",r=e==="Psyche";s.fillStyle=o?"#323232":r?"#948a7e":"#7a746d",s.fillRect(0,0,256,128);for(let n=0;n<50;n++){const h=Math.random()*256,m=Math.random()*128,p=2+Math.random()*5;s.fillStyle=o?"#1a1a1a":"#4e4842",s.beginPath(),s.arc(h,m,p,0,Math.PI*2),s.fill(),s.strokeStyle=o?"#505050":"rgba(200, 195, 185, 0.5)",s.lineWidth=1,s.beginPath(),s.arc(h,m,p,0,Math.PI),s.stroke()}const c=new B(i);return c.wrapS=V,c.wrapT=_,c}static createGenericTexture(e){const t=document.createElement("canvas");t.width=64,t.height=64;const a=t.getContext("2d");return a.fillStyle=e,a.fillRect(0,0,64,64),new B(t)}}d(qe,"cache",new Map);const Ne=class Ne{constructor(){d(this,"loader",new Na);d(this,"customLoader",null);d(this,"cache",new Map);d(this,"inFlightRequests",new Map);d(this,"maxAnisotropy",8);d(this,"baseUrl",(typeof import.meta<"u"&&"/solaris/"||"/").replace(/\/?$/,"/"))}resolveUrl(e){if(!e)return"";if(e.startsWith("http://")||e.startsWith("https://")||e.startsWith("data:")||e.startsWith("blob:"))return e;const t=e.replace(/^(\.\/)+/,"").replace(/^\/+/,"").replace(/\/+/g,"/");return`${this.baseUrl.replace(/\/+$/,"/")}${t}`}static getInstance(){return Ne.instance||(Ne.instance=new Ne),Ne.instance}setLoader(e){this.customLoader=e}setBaseUrl(e){this.baseUrl=e.replace(/\/?$/,"/")}setMaxAnisotropy(e){this.maxAnisotropy=Math.max(1,e);for(const t of this.cache.values())t.anisotropy=this.maxAnisotropy,t.needsUpdate=!0}isCached(e){const t=this.resolveUrl(e);return this.cache.has(t)}getCacheSize(){return this.cache.size}evictFromCache(e,t=!1){const a=this.resolveUrl(e),i=this.cache.get(a);return i?(this.cache.delete(a),this.inFlightRequests.delete(a),t&&i.dispose(),!0):!1}clearCache(e=!1){if(e)for(const t of this.cache.values())t.dispose();this.cache.clear(),this.inFlightRequests.clear()}resetForTesting(){this.clearCache(!1),this.customLoader=null,this.baseUrl=(typeof import.meta<"u"&&"/solaris/"||"/").replace(/\/?$/,"/")}loadTexture(e,t=!0,a){const i=this.resolveUrl(e),s=this.cache.get(i);if(s)return s;if(typeof document>"u"&&!this.customLoader){const h=new Li;return h.colorSpace=t?ke:dt,this.cache.set(i,h),h}const o=this.customLoader||this.loader;let r=!1,c=null;const n=o.load(i,h=>{h.colorSpace=t?ke:dt,h.generateMipmaps=!0,h.minFilter=ft,h.magFilter=Lt,h.anisotropy=this.maxAnisotropy,h.needsUpdate=!0},void 0,h=>{if(r=!0,console.warn(`[TexturePipeline] Fallback activated for ${e} (${i}):`,h),this.cache.delete(i),this.inFlightRequests.delete(i),a&&c)try{const m=qe.getTexture(a);m&&m.image&&(c.image=m.image,c.needsUpdate=!0)}catch(m){console.warn("[TexturePipeline] Fallback generation error:",m)}});if(c=n,r&&a)try{const h=qe.getTexture(a);h&&h.image&&(c.image=h.image,c.needsUpdate=!0)}catch(h){console.warn("[TexturePipeline] Fallback generation error:",h)}return n.colorSpace=t?ke:dt,n.generateMipmaps=!0,n.minFilter=ft,n.magFilter=Lt,n.anisotropy=this.maxAnisotropy,r||this.cache.set(i,n),n}loadTextureAsync(e,t=!0,a){const i=this.resolveUrl(e),s=this.cache.get(i);if(s)return Promise.resolve(s);const o=this.inFlightRequests.get(i);if(o)return o;if(typeof document>"u"&&!this.customLoader){const c=this.loadTexture(e,t,a);return Promise.resolve(c)}const r=new Promise((c,n)=>{(this.customLoader||this.loader).load(i,m=>{m.colorSpace=t?ke:dt,m.generateMipmaps=!0,m.minFilter=ft,m.magFilter=Lt,m.anisotropy=this.maxAnisotropy,m.needsUpdate=!0,this.cache.set(i,m),this.inFlightRequests.delete(i),c(m)},void 0,m=>{if(this.cache.delete(i),this.inFlightRequests.delete(i),a){console.warn(`[TexturePipeline] Fallback activated for ${e}:`,m);const p=qe.getTexture(a);c(p)}else n(m)})});return this.inFlightRequests.set(i,r),r}getPlanetTextures(e){switch(e){case"Sun":return{map:this.loadTexture("/textures/2k_sun.jpg",!0,"Sun"),emissiveMap:this.loadTexture("/textures/2k_sun.jpg",!0,"Sun")};case"Mercury":return{map:this.loadTexture("/textures/2k_mercury.jpg",!0,"Mercury")};case"Venus":return{map:this.loadTexture("/textures/2k_venus_atmosphere.jpg",!0,"Venus")};case"Earth":return{map:this.loadTexture("/textures/2k_earth_daymap.jpg",!0,"Earth"),normalMap:this.loadTexture("/textures/earth_normal_2048.jpg",!1),nightMap:this.loadTexture("/textures/2k_earth_nightmap.jpg",!0),cloudsMap:this.loadTexture("/textures/2k_earth_clouds.jpg",!0,"EarthClouds")};case"Moon":return{map:this.loadTexture("/textures/2k_moon.jpg",!0,"Moon")};case"Mars":return{map:this.loadTexture("/textures/2k_mars.jpg",!0,"Mars")};case"Jupiter":return{map:this.loadTexture("/textures/2k_jupiter.jpg",!0,"Jupiter")};case"Saturn":return{map:this.loadTexture("/textures/2k_saturn.jpg",!0,"Saturn"),ringAlphaMap:this.loadTexture("/textures/2k_saturn_ring_alpha.png",!1,"SaturnRings")};case"Uranus":return{map:this.loadTexture("/textures/2k_uranus.jpg",!0,"Uranus")};case"Neptune":return{map:this.loadTexture("/textures/2k_neptune.jpg",!0,"Neptune")};default:return{map:qe.getTexture(e)}}}getMilkyWayTexture(){return this.loadTexture("/textures/gaia_sky.webp",!0)}getMilkyWayDiskTexture(){return this.loadTexture("/textures/milky_way_disk.webp",!0)}};d(Ne,"instance");let et=Ne;class Ft{static createPhotosphereMaterial(e){return new L({uniforms:{sunTexture:{value:e},time:{value:0}},vertexShader:`
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
      `})}static createCoronaMaterial(e=14){return new L({uniforms:{sunCenter:{value:new M(0,0,0)},sunRadius:{value:e},time:{value:0}},vertexShader:`
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
      `,blending:q,side:Ke,transparent:!0,depthWrite:!1})}static createProminencesMaterial(){return new L({uniforms:{time:{value:0}},vertexShader:`
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
      `,blending:q,side:Oe,transparent:!0,depthWrite:!1})}static createProminencesGroup(e){const t=new he;t.name="solar_prominences";const a=this.createProminencesMaterial();return[{lat:.35,lon:.2,scale:.14,angle:.4},{lat:-.42,lon:1.1,scale:.18,angle:-.3},{lat:.15,lon:2.3,scale:.11,angle:.6},{lat:-.25,lon:3.4,scale:.22,angle:-.5},{lat:.55,lon:4.2,scale:.15,angle:.2},{lat:-.1,lon:5.1,scale:.19,angle:.7},{lat:.4,lon:5.8,scale:.12,angle:-.4}].forEach((s,o)=>{const r=new yt(1,1,32,8),c=r.attributes.position,n=r.attributes.uv,h=s.scale*e*2.2,m=s.scale*e*1.6,p=s.scale*e*.28;for(let P=0;P<c.count;P++){const w=n.getX(P),y=n.getY(P),T=(w-.5)*h,k=Math.sin(w*Math.PI)*m,N=(y-.5)*p;c.setXYZ(P,T,k,N)}r.computeVertexNormals();const f=new z(r,a);f.name=`prominence_loop_${o}`;const g=Math.cos(s.lat),v=Math.sin(s.lat),S=e*g*Math.cos(s.lon),x=e*v,b=e*g*Math.sin(s.lon);f.position.set(S,x,b);const D=new M(S,x,b).normalize();f.quaternion.setFromUnitVectors(new M(0,1,0),D),f.rotateOnAxis(new M(0,1,0),s.angle),t.add(f)}),t}}const Hi={Earth:{radiusScale:1.008,rayleighColor:new I(.24,.52,.92),twilightColor:new I(.95,.42,.16),density:.65,falloffPower:4.5,mieG:.72},Venus:{radiusScale:1.012,rayleighColor:new I(.92,.86,.64),twilightColor:new I(.85,.58,.32),density:1.1,falloffPower:3.5,mieG:.65},Mars:{radiusScale:1.004,rayleighColor:new I(.65,.55,.5),twilightColor:new I(.35,.5,.7),density:.12,falloffPower:6,mieG:.55},Uranus:{radiusScale:1.014,rayleighColor:new I(.48,.85,.82),twilightColor:new I(.32,.65,.72),density:.75,falloffPower:3.8,mieG:.7},Neptune:{radiusScale:1.014,rayleighColor:new I(.2,.45,.95),twilightColor:new I(.15,.3,.75),density:.8,falloffPower:3.8,mieG:.7}};class fi{static createAtmosphereMaterial(e){const t=Hi[e];return t?new L({uniforms:{rayleighColor:{value:t.rayleighColor},twilightColor:{value:t.twilightColor},density:{value:t.density},falloffPower:{value:t.falloffPower},mieG:{value:t.mieG}},vertexShader:`
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
      `,blending:q,side:Ke,transparent:!0,depthWrite:!1}):null}}class vi{static createSurfaceMaterial(e,t,a,i){return new L({uniforms:{dayMap:{value:e},normalMap:{value:t||null},nightMap:{value:a||null},cloudsMap:{value:i||null},hasNormalMap:{value:t?1:0},hasNightMap:{value:a?1:0},hasCloudsMap:{value:i?1:0}},vertexShader:`
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
      `})}static createCloudMaterial(e){return new L({uniforms:{cloudsMap:{value:e},uFade:{value:1}},vertexShader:`
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
        uniform float uFade;
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

          gl_FragColor = vec4(cloudColor, cloudDensity * (0.35 + dayFactor * 0.55) * uFade);

          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
      `,transparent:!0,depthWrite:!1})}}class fs{static createMaterial(e){const{name:t,category:a,map:i,normalMap:s}=e,o=t==="Jupiter"||t==="Saturn"||t==="Uranus"||t==="Neptune",r=t==="Europa"||t==="Enceladus",c=t==="Mercury"||t==="Moon"||a==="asteroid",n=t==="Mars",h=t==="Venus",m=t==="Saturn";return new L({uniforms:{map:{value:i},normalMap:{value:s||null},hasNormalMap:{value:s?1:0},isGasGiant:{value:o?1:0},isIcyMoon:{value:r?1:0},isAirlessRocky:{value:c?1:0},isMars:{value:n?1:0},isVenus:{value:h?1:0},isSaturn:{value:m?1:0}},vertexShader:`
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
      `})}}const vs=48,Vi=50,Wi=65,Yi=.58;function $t(l){return Vi+Math.pow(Math.max(0,l),Yi)*Wi}function xs(l){return Math.pow(Math.max(0,l-Vi)/Wi,1/Yi)}function Ji(l){if(l.category==="star")return vs;switch(l.name){case"Jupiter":return 26.9;case"Saturn":return 22.68;case"Uranus":return 9.62;case"Neptune":return 9.32;case"Earth":return 2.4;case"Venus":return 2.28;case"Mars":return 1.28;case"Mercury":return .92;case"Pluto":return .45}const e=l.physical.meanRadiusKm;return l.category==="moon"?e<100?.18:e<500?.32:e<1200?.48:e<2e3?.65:.95:l.category==="dwarf_planet"?.45:l.category==="asteroid"?e<10?.18:e<100?.25:.38:Math.max(.18,e/6371*2.4)}class ys{static getVisualRadius(e){return Ji(e)}static createPlanet(e){var D;const t=new he;t.name=`body_group_${e.name}`;const a=this.getVisualRadius(e),s=1-(e.physical.flattening||0),o=e.category==="moon"||e.category==="asteroid",r=e.category==="planet"||e.category==="star",c=new ue(1,r?96:o?36:64,r?64:o?24:48);if(e.category==="asteroid"||e.category==="moon"&&e.physical.meanRadiusKm<200){const P=c.attributes.position;for(let w=0;w<P.count;w++){const y=P.getX(w),T=P.getY(w),k=P.getZ(w),N=1+.18*Math.sin(y*4)*Math.cos(T*4+k*3);P.setXYZ(w,y*N,T*N,k*N)}c.computeVertexNormals()}const h=et.getInstance().getPlanetTextures(e.name);let m,p,f,g,v,S;const x=[];if(e.category==="star"){m=Ft.createPhotosphereMaterial(h.map);const P=new ue(2.45,96,64),w=Ft.createCoronaMaterial(a),y=new z(P,w);y.name="sun_corona",y.scale.set(a,a,a),t.add(y),x.push(y),S=Ft.createProminencesGroup(a),t.add(S)}else if(e.name==="Earth"){if(m=vi.createSurfaceMaterial(h.map,h.normalMap,h.nightMap,h.cloudsMap),h.cloudsMap){const w=new ue(1.004,96,64),y=vi.createCloudMaterial(h.cloudsMap);f=new z(w,y),f.name="earth_clouds",f.renderOrder=2,f.scale.set(a,a,a),t.add(f)}const P=fi.createAtmosphereMaterial("Earth");if(P){const w=new ue(1.012,96,64);g=new z(w,P),g.name="earth_atmosphere",g.renderOrder=3,g.scale.set(a,a,a),t.add(g)}}else{m=fs.createMaterial({name:e.name,category:e.category,map:h.map,normalMap:h.normalMap});const P=fi.createAtmosphereMaterial(e.name);if(P){const w=((D=Hi[e.name])==null?void 0:D.radiusScale)||1.012,y=new ue(w,48,36);g=new z(y,P),g.name=`${e.name.toLowerCase()}_atmosphere`,g.renderOrder=3,g.scale.set(a,a,a),t.add(g)}}const b=new z(c,m);if(b.name=`surface_${e.name}`,b.castShadow=e.category!=="star",b.receiveShadow=e.category!=="star",b.scale.set(a,a*s,a),t.add(b),e.name==="Saturn"){const y=new ji(1.32,2.65,128,8),T=y.attributes.position,k=y.attributes.uv;for(let G=0;G<T.count;G++){const ne=T.getX(G),O=T.getY(G),X=(Math.sqrt(ne*ne+O*O)-1.32)/(2.65-1.32);k.setXY(G,X,.5)}k.needsUpdate=!0;const N=h.ringAlphaMap||h.map,j=new L({uniforms:{ringMap:{value:N},saturnCenter:{value:new M},saturnRadius:{value:a}},vertexShader:`
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
        `,side:Oe,transparent:!0,depthWrite:!1});v=new z(y,j),v.name="saturn_rings",v.rotation.x=Math.PI*.5,v.renderOrder=3,v.scale.set(a,a,a),t.add(v)}return{definition:e,bodyGroup:t,surfaceMesh:b,nightMesh:p,cloudMesh:f,atmosphereMesh:g,ringMesh:v,glowMeshes:x.length>0?x:void 0,prominencesGroup:S,visualRadius:a}}}const H=class H{static eclipticToIcrf(e){const[t,a,i]=e,s=Math.cos(H.OBLIQUITY_J2000_RAD),o=Math.sin(H.OBLIQUITY_J2000_RAD);return[t,a*s-i*o,a*o+i*s]}static icrfToEcliptic(e){const[t,a,i]=e,s=Math.cos(H.OBLIQUITY_J2000_RAD),o=Math.sin(H.OBLIQUITY_J2000_RAD);return[t,a*s+i*o,-a*o+i*s]}static eclipticToThree(e){return[e[0],e[2],-e[1]]}static threeToEcliptic(e){return[e[0],-e[2],e[1]]}static icrfToThree(e){return H.eclipticToThree(H.icrfToEcliptic(e))}static raDecToIcrf(e,t){const a=e*Math.PI/180,i=t*Math.PI/180;return[Math.cos(i)*Math.cos(a),Math.cos(i)*Math.sin(a),Math.sin(i)]}static galacticBasisThree(){const e=H.icrfToThree(H.raDecToIcrf(H.NGP_RA_DEG,H.NGP_DEC_DEG)),t=H.icrfToThree(H.raDecToIcrf(H.GC_RA_DEG,H.GC_DEC_DEG)),a=t[0]*e[0]+t[1]*e[1]+t[2]*e[2],i=[t[0]-a*e[0],t[1]-a*e[1],t[2]-a*e[2]],s=Math.hypot(...i),o=[i[0]/s,i[1]/s,i[2]/s],r=[e[1]*o[2]-e[2]*o[1],e[2]*o[0]-e[0]*o[2],e[0]*o[1]-e[1]*o[0]];return{x:o,y:r,z:e}}};d(H,"OBLIQUITY_J2000_DEG",23.43929111),d(H,"OBLIQUITY_J2000_RAD",23.43929111*Math.PI/180),d(H,"NGP_RA_DEG",192.85948),d(H,"NGP_DEC_DEG",27.12825),d(H,"GC_RA_DEG",266.40499),d(H,"GC_DEC_DEG",-28.93617);let K=H;const Me=class Me{constructor(){d(this,"mode","exploration")}toRenderPosition(e,t){if(this.mode==="scientific"){const h=1/Me.SCIENTIFIC_KM_PER_UNIT,m=[e[0]*h,e[1]*h,e[2]*h];return K.eclipticToThree(m)}const a=Math.sqrt(e[0]*e[0]+e[1]*e[1]+e[2]*e[2]);if(a<1e3||!t||t.orderFromSun===0)return[0,0,0];const i=a/Me.AU_KM,s=$t(i),o=e[0]/a,r=e[1]/a,c=e[2]/a,n=[o*s,r*s,c*s];return K.eclipticToThree(n)}toMoonRenderPosition(e,t,a,i){if(this.mode==="scientific"){const p=1/Me.SCIENTIFIC_KM_PER_UNIT,f=[e[0]*p,e[1]*p,e[2]*p],g=K.eclipticToThree(f),v=Math.hypot(g[0],g[1],g[2]),S=this.getVisualRadius(i)*1.25+this.getVisualRadius(t);if(v>0&&v<S){const x=S/v;g[0]*=x,g[1]*=x,g[2]*=x}return[a[0]+g[0],a[1]+g[1],a[2]+g[2]]}const s=Math.sqrt(e[0]*e[0]+e[1]*e[1]+e[2]*e[2]);if(s<1)return a;const o=e[0]/s,r=e[1]/s,c=e[2]/s,n=K.eclipticToThree([o,r,c]),m=this.getVisualRadius(i)*(1.35+1.25*Math.log10(1+s/4e4));return[a[0]+n[0]*m,a[1]+n[1]*m,a[2]+n[2]*m]}getVisualRadius(e){if(this.mode==="scientific"){const t=e.physical.meanRadiusKm/Me.SCIENTIFIC_KM_PER_UNIT;return Math.max(.015,t*4)}return Ji(e)}};d(Me,"SCIENTIFIC_KM_PER_UNIT",1e6),d(Me,"AU_KM",1495978707e-1);let Pe=Me;const qi=66743e-15,wt=299792458,$i=198847e25,Xt=149597870700,Xi=3085677581e7,Qi=9460730472e6,Zi=4297e3,bs=12e3,ea=8.277,ws=.033,ta=ea*1e3*Xi,Ms=ta/Qi,ia=Zi*$i,Ae=2*qi*ia/(wt*wt),Ss=Ae/1e3,Ps=Ae/Xt,aa=1.5*Ae,As=aa/1e3,Rt=3*Math.sqrt(3)/2*Ae,Ds=Rt/1e3,Ts=Rt/Xt,Cs=2*Rt/ta,Rs=180*3600*1e6/Math.PI,Es=Cs*Rs,Mt=3*Ae,Ns=Mt/1e3,ks=Math.sqrt(Ae/(2*Mt)),re={name:"Sagittarius A*",designation:"CXOGC J174540.0-290028",classification:"Supermassive Black Hole (SMBH)",galacticCenter:{system:"Galactic Coordinate System (IAU 1958 / ICRF J2000)",longitudeDeg:359.944,latitudeDeg:-.046,rightAscensionJ2000:"17h 45m 40.0409s",declinationJ2000:"-29° 00′ 28.118″"},physicalConstants:{G:qi,c:wt,solarMassKg:$i,auMeters:Xt,parsecMeters:Xi,lightYearMeters:Qi},measurements:{adoptedMassSolar:Zi,massUncertaintySolar:bs,adoptedDistanceKpc:ea,distanceUncertaintyKpc:ws,distanceLightYears:Ms,spinParameterAStar:0,spinAssumption:"Adopted Schwarzschild metric (a* = 0) as physical baseline; Kerr prograde spin creates asymmetric shadow offset and reduces ISCO down to 1.0 r_s.",metricAdopted:"Schwarzschild Metric with Relativistic Null-Geodesic Integration",accretionDiskInclinationDeg:42},derivedParameters:{massKg:ia,schwarzschildRadiusM:Ae,schwarzschildRadiusKm:Ss,schwarzschildRadiusAU:Ps,photonSphereRadiusM:aa,photonSphereRadiusKm:As,shadowRadiusM:Rt,shadowRadiusKm:Ds,shadowRadiusAU:Ts,shadowAngularDiameterMicroArcsec:Es,iscoRadiusM:Mt,iscoRadiusKm:Ns,accretionDiskInnerRadiusM:Mt,accretionDiskOuterRadiusM:16*Ae,iscoOrbitalSpeedFractionC:ks},sources:[{title:"First Sagittarius A* Event Horizon Telescope Results. I. The Shadow of the Supermassive Black Hole in the Center of the Milky Way",organization:"Event Horizon Telescope Collaboration",url:"https://www.jpl.nasa.gov/news/nasa-supports-event-horizon-telescope-in-studying-milky-ways-black-hole/",dateVerified:"2026-10-13",citation:"EHT Collaboration, 2022, ApJL, 930, L12. Measured shadow diameter: 51.8 +/- 2.3 microarcseconds."},{title:"The mass and distance of the Milky Way’s central black hole from stellar orbits",organization:"GRAVITY Collaboration (ESO / MPE)",url:"https://science.nasa.gov/universe/black-holes/",dateVerified:"2026-10-13",citation:"Abuter et al. (GRAVITY Collaboration), 2021, A&A, 647, A59. Mass: 4.297 +/- 0.012 x 10^6 M_sun, R_0: 8.277 +/- 0.033 kpc."},{title:"Black Hole Anatomy and Physics",organization:"NASA Astrophysics Science Division",url:"https://science.nasa.gov/universe/black-holes/anatomy/",dateVerified:"2026-10-13",citation:"NASA Science Directorate: Event horizon, photon ring, and relativistic accretion disk structure."},{title:"Simulation of Light Geodesics and Relativistic Ray Tracing Around a Supermassive Black Hole",organization:"NASA Goddard Space Flight Center (SVS 14619)",url:"https://svs.gsfc.nasa.gov/14619/",dateVerified:"2026-10-13",citation:"Jeremy Schnittman (NASA GSFC, July 2024): Relativistic ray-tracing, Doppler boosting, and gravitational lensing."},{title:"NASA’s Swift Catches X-ray Action at Milky Way’s Center",organization:"NASA Goddard Space Flight Center",url:"https://www.nasa.gov/news-release/nasas-swift-catches-x-ray-action-at-milky-ways-center/",dateVerified:"2026-10-13",citation:"Multiwavelength monitoring of Sgr A* accretion variability and relativistic flares."}]};re.measurements.adoptedMassSolar,re.measurements.massUncertaintySolar,re.measurements.adoptedDistanceKpc,re.measurements.distanceLightYears,re.derivedParameters.massKg;re.derivedParameters.schwarzschildRadiusKm,re.derivedParameters.schwarzschildRadiusAU,re.derivedParameters.photonSphereRadiusKm,re.derivedParameters.shadowRadiusKm,re.derivedParameters.shadowRadiusAU,re.derivedParameters.shadowAngularDiameterMicroArcsec,re.derivedParameters.iscoRadiusKm,re.derivedParameters.iscoOrbitalSpeedFractionC,re.derivedParameters.iscoOrbitalSpeedFractionC*(wt/1e3);const sa={schwarzschildRadius:24,diskInnerRadius:72,diskOuterRadius:340,boundingRadius:520};class Is{constructor(e=sa){d(this,"group",new he);d(this,"boundingMesh");d(this,"sStarsPoints");d(this,"jetPolesGroup",new he);d(this,"hitMesh");d(this,"config");d(this,"scientificData",re);d(this,"timeUniform",{value:0});d(this,"opacityUniform",{value:1});d(this,"cameraPosUniform",{value:new M});this.config=e,this.group.name="sagittarius_a_star_black_hole",this.boundingMesh=this.createRelativisticRayMarchMesh(),this.group.add(this.boundingMesh),this.sStarsPoints=this.createNuclearStarCluster(),this.group.add(this.sStarsPoints);const t=new ue(Math.max(3200,this.config.boundingRadius*2),16,16),a=new qt({visible:!1});this.hitMesh=new z(t,a),this.hitMesh.name="sagittarius_a_star_hit_target",this.group.add(this.hitMesh),this.createPolarOutflowJets(),this.jetPolesGroup.visible=!1,this.group.add(this.jetPolesGroup)}createRelativisticRayMarchMesh(){const e=new ue(this.config.boundingRadius,64,48),t=this.config.schwarzschildRadius,a=t*(3*Math.sqrt(3)/2),i=this.config.diskInnerRadius,s=this.config.diskOuterRadius,o=new L({uniforms:{uTime:this.timeUniform,uOpacity:this.opacityUniform,uCameraPosLocal:this.cameraPosUniform,uRs:{value:t},uRShadow:{value:a},uRIn:{value:i},uROut:{value:s},uBoundingR:{value:this.config.boundingRadius}},vertexShader:`
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
      `,transparent:!0,side:Oe,depthWrite:!1,blending:Gt}),r=new z(e,o);return r.name="sagittarius_a_star_lensing_volume",r.renderOrder=50,r}createNuclearStarCluster(){const t=new Float32Array(1140),a=new Float32Array(380*3),i=new Float32Array(380),s=this.config.diskOuterRadius*1.08,o=this.config.boundingRadius*.96;for(let h=0;h<380;h++){const m=Math.random(),p=s+Math.pow(m,1.6)*(o-s),f=Math.random()*Math.PI*2,g=(Math.random()-.5)*Math.PI;t[h*3]=p*Math.cos(f)*Math.cos(g),t[h*3+1]=p*Math.sin(g),t[h*3+2]=p*Math.sin(f)*Math.cos(g);const v=Math.random();v<.45?(a[h*3]=.82,a[h*3+1]=.9,a[h*3+2]=1,i[h]=1.4+Math.random()*2.2):v<.75?(a[h*3]=.98,a[h*3+1]=.98,a[h*3+2]=1,i[h]=1.2+Math.random()*1.8):(a[h*3]=1,a[h*3+1]=.85,a[h*3+2]=.58,i[h]=1.5+Math.random()*2.5)}const r=new Z;r.setAttribute("position",new F(t,3)),r.setAttribute("color",new F(a,3)),r.setAttribute("size",new F(i,1));const c=new L({uniforms:{uOpacity:this.opacityUniform,uTime:this.timeUniform},vertexShader:`
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
      `,vertexColors:!0,transparent:!0,blending:q,depthWrite:!1}),n=new xe(r,c);return n.name="s_stars_nuclear_cluster",n}createPolarOutflowJets(){const a=new yt(65,720,1,32);a.translate(0,720*.5+this.config.schwarzschildRadius*.95,0);const i=new L({uniforms:{uTime:this.timeUniform,uOpacity:this.opacityUniform},vertexShader:`
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
      `,transparent:!0,side:Oe,blending:q,depthWrite:!1});[0,Math.PI*.25,Math.PI*.5,Math.PI*.75].forEach(o=>{const r=new z(a,i);r.rotation.y=o,this.jetPolesGroup.add(r);const c=a.clone();c.rotateZ(Math.PI);const n=new z(c,i);n.rotation.y=o,this.jetPolesGroup.add(n)})}update(e,t){this.timeUniform.value=t;const a=e.position.clone();this.group.worldToLocal(a),this.cameraPosUniform.value.copy(a),this.sStarsPoints&&(this.sStarsPoints.rotation.y=t*.015)}setOpacity(e){const t=Math.max(0,Math.min(1,e));this.opacityUniform.value=t,this.group.visible=t>.005}dispose(){this.boundingMesh.geometry.dispose(),this.boundingMesh.material.dispose(),this.sStarsPoints.geometry.dispose(),this.sStarsPoints.material.dispose(),this.jetPolesGroup.traverse(e=>{e instanceof z&&(e.geometry.dispose(),Array.isArray(e.material)?e.material.forEach(t=>t.dispose()):e.material.dispose())})}}const Ee=1320,Os=8.277,Ls=.0208,js={radius:28e3,coreRadius:4800,sunDistance:Os*Ee};class Ue{constructor(e=js){d(this,"group",new he);d(this,"sagittariusAStar");d(this,"masterDiskMesh");d(this,"coreBulgeMesh");d(this,"dustExtinctionMesh");d(this,"starPoints");d(this,"satelliteGroup",new he);d(this,"sunBeaconGroup",new he);d(this,"sunReticleMesh");d(this,"sunPulseMesh");d(this,"sunRadarRing");d(this,"opacityUniform",{value:0});d(this,"timeUniform",{value:0});d(this,"bulgeFadeUniform",{value:1});d(this,"diskTextureUniform",{value:Ue.createEmptyTexture()});d(this,"diskTextureRequested",!1);d(this,"config");d(this,"sunWorldPosition",new M);this.config=e,this.group.name="milky_way_external_galaxy";const t=K.galacticBasisThree(),a=new ye().makeBasis(new M(...t.y).negate(),new M(...t.z),new M(...t.x).negate());this.group.quaternion.setFromRotationMatrix(a),this.masterDiskMesh=this.createMasterDisk(),this.group.add(this.masterDiskMesh),this.coreBulgeMesh=this.createVolumetricCore(),this.group.add(this.coreBulgeMesh),this.dustExtinctionMesh=this.createDustExtinction(),this.group.add(this.dustExtinctionMesh),this.starPoints=this.create3DStars(),this.group.add(this.starPoints),this.buildSatelliteGalaxies(),this.group.add(this.satelliteGroup);const{beaconGroup:i,reticleMesh:s,pulseMesh:o,radarRing:r,sunPos:c}=this.createSunBeacon();this.sunBeaconGroup=i,this.sunReticleMesh=s,this.sunPulseMesh=o,this.sunRadarRing=r,this.sunWorldPosition.copy(c),this.group.add(this.sunBeaconGroup),this.group.position.copy(c.clone().applyQuaternion(this.group.quaternion)).negate(),this.sagittariusAStar=new Is,this.group.add(this.sagittariusAStar.group),this.setOpacity(0)}createMasterDisk(){const e=new yt(this.config.radius*2,this.config.radius*2,64,64);e.rotateX(-Math.PI*.5);const t=new L({uniforms:{uGalaxyMap:this.diskTextureUniform,uOpacity:this.opacityUniform,uBulgeFade:this.bulgeFadeUniform,uTime:this.timeUniform},vertexShader:`
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
      `,transparent:!0,side:Oe,depthWrite:!1,blending:Gt}),a=new z(e,t);return a.name="milky_way_master_disk",a.renderOrder=-8,a}createVolumetricCore(){const e=new ue(this.config.coreRadius,32,24);e.scale(1,.42,.82);const t=new L({uniforms:{uOpacity:this.opacityUniform,uBulgeFade:this.bulgeFadeUniform,uTime:this.timeUniform},vertexShader:`
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
      `,transparent:!0,blending:q,depthWrite:!1,side:Ke}),a=new z(e,t);return a.name="galactic_volumetric_core",a.renderOrder=-7,a}createDustExtinction(){const e=new yt(this.config.radius*1.85,this.config.radius*1.85,48,48);e.rotateX(-Math.PI*.5);const t=new L({uniforms:{uGalaxyMap:this.diskTextureUniform,uOpacity:this.opacityUniform,uBulgeFade:this.bulgeFadeUniform},vertexShader:`
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
      `,transparent:!0,side:Oe,depthWrite:!1,blending:Gt}),a=new z(e,t);return a.name="galactic_dust_extinction_sheet",a.position.y=80,a.renderOrder=-6,a}create3DStars(){const t=new Float32Array(42e3),a=new Float32Array(14e3*3),i=new Float32Array(14e3),s=this.config.radius,o=this.config.coreRadius;let r=0;const c=4e3;for(let g=0;g<c;g++){const v=Math.random(),S=Math.pow(v,1.6)*o,x=Math.random()*Math.PI*2,b=(Math.random()-.5)*Math.PI,D=S*Math.cos(x)*Math.cos(b)*1.15,P=S*Math.sin(x)*Math.cos(b)*.85,w=S*Math.sin(b)*.42;t[r*3]=D,t[r*3+1]=w,t[r*3+2]=P,Math.random()<.6?(a[r*3]=1,a[r*3+1]=.85,a[r*3+2]=.6):(a[r*3]=.98,a[r*3+1]=.7,a[r*3+2]=.4),i[r]=1+Math.random()*1.5,r++}const n=8e3;for(let g=0;g<n;g++){const v=Math.random(),S=o*.8+Math.pow(v,1.1)*(s*.9-o*.8),x=Math.random()*Math.PI*2,b=550+S/s*450,D=(Math.random()-.5+(Math.random()-.5))*b,P=Math.cos(x)*S,w=Math.sin(x)*S;t[r*3]=P,t[r*3+1]=D,t[r*3+2]=w;const y=Math.random();y<.28?(a[r*3]=.75,a[r*3+1]=.88,a[r*3+2]=1,i[r]=1.4+Math.random()*1.8):y<.38?(a[r*3]=1,a[r*3+1]=.52,a[r*3+2]=.78,i[r]=1.6+Math.random()*1.6):y<.72?(a[r*3]=.98,a[r*3+1]=.96,a[r*3+2]=.92,i[r]=.9+Math.random()*1.2):(a[r*3]=1,a[r*3+1]=.82,a[r*3+2]=.52,i[r]=1+Math.random()*1.4),r++}const h=2e3;for(let g=0;g<h;g++){const v=Math.random(),S=Math.pow(v,1.4)*(s*1.35),x=Math.random()*Math.PI*2,b=(Math.random()-.5)*Math.PI;t[r*3]=S*Math.cos(x)*Math.cos(b),t[r*3+1]=S*Math.sin(b)*.7,t[r*3+2]=S*Math.sin(x)*Math.cos(b),a[r*3]=.92,a[r*3+1]=.9,a[r*3+2]=.95,i[r]=.8+Math.random()*1,r++}const m=new Z;m.setAttribute("position",new F(t,3)),m.setAttribute("color",new F(a,3)),m.setAttribute("size",new F(i,1));const p=new L({uniforms:{uOpacity:this.opacityUniform,uTime:this.timeUniform},vertexShader:`
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
      `,vertexColors:!0,transparent:!0,blending:q,depthWrite:!1}),f=new xe(m,p);return f.name="galactic_3d_stars",f.renderOrder=-5,f}static createEmptyTexture(){const e=new ka(new Uint8Array([0,0,0,0]),1,1,Ia);return e.needsUpdate=!0,e}static galactocentricToLocal(e,t,a){return new M(-t,a,-e).multiplyScalar(Ee)}buildSatelliteGalaxies(){const e=this.createDwarfGalaxy("large_magellanic_cloud",Ue.galactocentricToLocal(-.71,-40.95,-26.93),4*Ee,new I(13822207),450);this.satelliteGroup.add(e);const t=this.createDwarfGalaxy("small_magellanic_cloud",Ue.galactocentricToLocal(15.93,-37.57,-43.61),2*Ee,new I(14741247),220);this.satelliteGroup.add(t);const a=this.createDwarfGalaxy("sagittarius_dwarf_spheroidal",Ue.galactocentricToLocal(17.29,2.51,-6.48),2.5*Ee,new I(16770756),280);this.satelliteGroup.add(a)}createDwarfGalaxy(e,t,a,i,s){const o=new he;o.name=e,o.position.copy(t);const r=new ue(a,24,16);r.scale(1.25,.55,.95);const c=new L({uniforms:{uOpacity:this.opacityUniform,uColor:{value:i}},vertexShader:`
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
      `,transparent:!0,blending:q,depthWrite:!1,side:Ke}),n=new z(r,c);n.renderOrder=-9,o.add(n);const h=new Z,m=new Float32Array(s*3);for(let g=0;g<s;g++){const v=Math.random(),S=Math.pow(v,1.8)*a,x=Math.random()*Math.PI*2,b=(Math.random()-.5)*Math.PI;m[g*3]=S*Math.cos(x)*Math.cos(b)*1.25,m[g*3+1]=S*Math.sin(b)*.55,m[g*3+2]=S*Math.sin(x)*Math.cos(b)}h.setAttribute("position",new F(m,3));const p=new Fi({color:i,size:1.2,transparent:!0,opacity:.55,blending:q,depthWrite:!1}),f=new xe(h,p);return o.add(f),o}createSunBeacon(){const e=new he;e.name="sun_orion_spur_beacon";const t=this.config.sunDistance,a=Ls*Ee,i=new M(0,a,t);e.position.copy(i);const s=new Z,o=64,r=[],c=450;for(let y=0;y<=o;y++){const T=y/o*Math.PI*2;r.push(new M(Math.cos(T)*c,0,Math.sin(T)*c))}s.setFromPoints(r);const n=new Ze({color:16766720,transparent:!0,opacity:.9}),h=new _e(s,n);e.add(h);const m=new Z,p=[],f=750;for(let y=0;y<=o;y++){const T=y/o*Math.PI*2;p.push(new M(Math.cos(T)*f,0,Math.sin(T)*f))}m.setFromPoints(p);const g=new mi({color:16771704,dashSize:40,gapSize:25,transparent:!0,opacity:.65}),v=new _e(m,g);v.computeLineDistances(),e.add(v);const S=new ue(180,16,12),x=new qt({color:16771976,transparent:!0,opacity:.95,blending:q}),b=new z(S,x);e.add(b);const D=new Z().setFromPoints([new M(0,-a,0),new M(0,0,0)]),P=new mi({color:16769138,dashSize:22,gapSize:15,transparent:!0,opacity:.55}),w=new _e(D,P);return w.computeLineDistances(),e.add(w),{beaconGroup:e,reticleMesh:h,pulseMesh:b,radarRing:v,sunPos:i}}getGalacticCenterWorldPosition(e=new M){return this.group.updateWorldMatrix(!0,!1),this.group.getWorldPosition(e)}setOpacity(e){const t=Math.max(0,Math.min(1,e));if(this.opacityUniform.value=t,this.group.visible=t>.005,this.group.visible&&!this.diskTextureRequested){this.diskTextureRequested=!0;const a=et.getInstance().getMilkyWayDiskTexture();a.wrapS=_,a.wrapT=_,this.diskTextureUniform.value=a}this.sagittariusAStar&&this.sagittariusAStar.setOpacity(t),this.sunReticleMesh&&(this.sunReticleMesh.material.opacity=t*.9),this.sunRadarRing&&(this.sunRadarRing.material.opacity=t*.65),this.sunPulseMesh&&(this.sunPulseMesh.material.opacity=t*.95)}update(e,t){if(this.timeUniform.value=e,this.sagittariusAStar&&t){this.sagittariusAStar.update(t,e);const a=t.position.clone();this.group.worldToLocal(a);const i=a.length(),s=R.clamp((i-450)/2200,0,1);this.bulgeFadeUniform.value=s}if(this.sunPulseMesh&&this.group.visible){const a=1+.22*Math.sin(e*3.5);this.sunPulseMesh.scale.set(a,a,a)}this.sunReticleMesh&&this.group.visible&&(this.sunReticleMesh.rotation.y=e*.35),this.sunRadarRing&&this.group.visible&&(this.sunRadarRing.rotation.y=-e*.22)}dispose(){this.sagittariusAStar.dispose(),this.masterDiskMesh.geometry.dispose(),this.masterDiskMesh.material.dispose(),this.coreBulgeMesh.geometry.dispose(),this.coreBulgeMesh.material.dispose(),this.dustExtinctionMesh.geometry.dispose(),this.dustExtinctionMesh.material.dispose(),this.starPoints.geometry.dispose(),this.starPoints.material.dispose(),this.sunReticleMesh.geometry.dispose(),this.sunReticleMesh.material.dispose(),this.sunRadarRing.geometry.dispose(),this.sunRadarRing.material.dispose(),this.sunPulseMesh.geometry.dispose(),this.sunPulseMesh.material.dispose(),this.satelliteGroup.traverse(e=>{(e instanceof z||e instanceof xe)&&(e.geometry.dispose(),Array.isArray(e.material)?e.material.forEach(t=>t.dispose()):e.material.dispose())})}}class Fs{constructor(){d(this,"mesh");d(this,"count",700);d(this,"positions");d(this,"colors");d(this,"relativePositions");d(this,"radius",110);d(this,"currentSpeed",0);this.positions=new Float32Array(this.count*2*3),this.colors=new Float32Array(this.count*2*3),this.relativePositions=new Float32Array(this.count*3);for(let a=0;a<this.count;a++){const i=Math.random(),s=(.2+.8*Math.cbrt(i))*this.radius,o=Math.random()*Math.PI*2,r=Math.acos(2*Math.random()-1);this.relativePositions[a*3]=s*Math.sin(r)*Math.cos(o),this.relativePositions[a*3+1]=s*Math.sin(r)*Math.sin(o),this.relativePositions[a*3+2]=s*Math.cos(r)}const e=new Z;e.setAttribute("position",new F(this.positions,3)),e.setAttribute("color",new F(this.colors,3));const t=new Ze({vertexColors:!0,transparent:!0,blending:q,depthWrite:!1});this.mesh=new Ui(e,t),this.mesh.name="velocity_travel_particles",this.mesh.frustumCulled=!1}update(e,t,a,i){const s=t.length(),o=s+Math.abs(a)*45;this.currentSpeed+=(o-this.currentSpeed)*Math.min(1,i*8);const r=this.currentSpeed>.8,c=Math.min(28,this.currentSpeed*.16+Math.abs(a)*14),n=Math.min(.85,Math.max(.08,(this.currentSpeed-.5)*.08));let h=0,m=0,p=-1;s>.01?(h=-t.x/s,m=-t.y/s,p=-t.z/s):Math.abs(a)>.01&&(p=a>0?1:-1);const f=this.mesh.geometry.attributes.position,g=this.mesh.geometry.attributes.color,v=this.radius*2,S=this.radius;for(let x=0;x<this.count;x++){const b=x*3,D=x*6,P=x*6+3;r&&(this.relativePositions[b]+=h*this.currentSpeed*i*.5,this.relativePositions[b+1]+=m*this.currentSpeed*i*.5,this.relativePositions[b+2]+=p*this.currentSpeed*i*.5);for(let j=0;j<3;j++)this.relativePositions[b+j]>S?this.relativePositions[b+j]-=v:this.relativePositions[b+j]<-S&&(this.relativePositions[b+j]+=v);const w=e.x+this.relativePositions[b],y=e.y+this.relativePositions[b+1],T=e.z+this.relativePositions[b+2];this.positions[D]=w,this.positions[D+1]=y,this.positions[D+2]=T,c>.4?(this.positions[P]=w+h*c,this.positions[P+1]=y+m*c,this.positions[P+2]=T+p*c):(this.positions[P]=w+.05,this.positions[P+1]=y+.05,this.positions[P+2]=T+.05);const k=n*1.2,N=n*.15;this.colors[D]=.88*k,this.colors[D+1]=.92*k,this.colors[D+2]=1*k,this.colors[P]=.65*N,this.colors[P+1]=.8*N,this.colors[P+2]=.95*N}f.needsUpdate=!0,g.needsUpdate=!0}dispose(){this.mesh.geometry.dispose(),this.mesh.material.dispose()}}const Us=[[54061,53910],[53910,58001],[58001,59774],[59774,54061],[59774,62956],[62956,65378],[65378,67301],[27989,25336],[27989,26207],[25336,26207],[27989,26727],[25336,25930],[25930,26311],[26311,26727],[26727,27366],[25930,24436],[746,3179],[3179,4427],[4427,6686],[6686,8886],[60718,61084],[62434,59747],[102098,100453],[100453,95947],[102488,100453],[100453,97165],[49669,50583],[50583,50335],[50335,48455],[50583,54872],[54872,57632],[57632,54879],[54879,49669],[80763,78820],[78820,78401],[80763,82396],[82396,86228],[86228,85927],[32349,30324],[32349,33579],[33579,34444],[34444,35904],[91262,91971],[91971,92420],[92420,93194],[93194,92791],[92791,91971]],oe=class oe{constructor(){d(this,"group",new he);d(this,"celestialGroup",new he);d(this,"pointsMesh");d(this,"localInterstellarStars");d(this,"constellationLines");d(this,"milkyWayMesh");d(this,"milkyWayOpacityUniform",{value:1});d(this,"resolvedMilkyWay");d(this,"stardustMesh");d(this,"externalGalaxy");d(this,"travelParticles");d(this,"isLoaded",!1);d(this,"localStarsOpacity",{value:0});d(this,"groundMode",!1);this.group.name="starfield_hipparcos",this.group.add(this.celestialGroup),this.celestialGroup.name="celestial_infinite_sphere",this.buildMilkyWayBackground(),this.buildResolvedMilkyWayStars(),this.build3DCosmicStardust(),this.externalGalaxy=new Ue,this.group.add(this.externalGalaxy.group),this.travelParticles=new Fs,this.group.add(this.travelParticles.mesh),this.loadCatalog()}buildMilkyWayBackground(){const e=new ue(oe.SPHERE_RADIUS*1.05,64,48),t=et.getInstance().getMilkyWayTexture(),a=new L({uniforms:{milkyWayMap:{value:t},uOpacity:this.milkyWayOpacityUniform},vertexShader:`
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
      `,side:Ke,transparent:!0,depthWrite:!1});this.milkyWayMesh=new z(e,a),this.milkyWayMesh.name="milky_way_skybox",this.milkyWayMesh.renderOrder=-10;const i=K.galacticBasisThree(),s=new ye().makeBasis(new M(...i.x),new M(...i.z),new M(...i.y).negate());this.milkyWayMesh.quaternion.setFromRotationMatrix(s),this.celestialGroup.add(this.milkyWayMesh)}buildResolvedMilkyWayStars(e=26e3){if(typeof document>"u")return;const t="/solaris/".replace(/\/?$/,"/");new Oa().load(`${t}textures/gaia_sky.webp`,a=>{const o=document.createElement("canvas");o.width=1024,o.height=512;const r=o.getContext("2d",{willReadFrequently:!0});if(!r)return;r.drawImage(a,0,0,1024,512);const c=r.getImageData(0,0,1024,512).data,n=new Float64Array(1024*512);let h=0;for(let P=0;P<512;P++){const w=Math.cos((.5-(P+.5)/512)*Math.PI);for(let y=0;y<1024;y++){const T=(P*1024+y)*4,k=(.2126*c[T]+.7152*c[T+1]+.0722*c[T+2])/255;h+=Math.pow(Math.max(0,k-.07),2.2)*w,n[P*1024+y]=h}}if(h<=0)return;const m=K.galacticBasisThree(),p=new Float32Array(e*3),f=new Float32Array(e*3),g=new Float32Array(e);let v=1592594996;const S=()=>{v=v+1831565813>>>0;let P=v;return P=Math.imul(P^P>>>15,P|1),P^=P+Math.imul(P^P>>>7,P|61),((P^P>>>14)>>>0)/4294967296},x=oe.SPHERE_RADIUS*.996;for(let P=0;P<e;P++){const w=S()*h;let y=0,T=n.length-1;for(;y<T;){const me=y+T>>>1;n[me]<w?y=me+1:T=me}const k=y%1024,N=y/1024|0,j=(k+S())/1024,G=(N+S())/512,ne=(.5-j)*2*Math.PI,O=(.5-G)*Math.PI,$=Math.cos(O)*Math.cos(ne),X=Math.cos(O)*Math.sin(ne),ie=Math.sin(O);p[P*3]=(m.x[0]*$+m.y[0]*X+m.z[0]*ie)*x,p[P*3+1]=(m.x[1]*$+m.y[1]*X+m.z[1]*ie)*x,p[P*3+2]=(m.x[2]*$+m.y[2]*X+m.z[2]*ie)*x;const ae=y*4,le=Math.max(c[ae],c[ae+1],c[ae+2],1),U=.55;f[P*3]=c[ae]/le*(1-U)+U,f[P*3+1]=c[ae+1]/le*(1-U)+U,f[P*3+2]=c[ae+2]/le*(1-U)+U,g[P]=.55+Math.pow(S(),6)*1.6}const b=new Z;b.setAttribute("position",new F(p,3)),b.setAttribute("color",new F(f,3)),b.setAttribute("size",new F(g,1));const D=new L({uniforms:{uOpacity:this.milkyWayOpacityUniform},vertexShader:`
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
        `,vertexColors:!0,transparent:!0,blending:q,depthWrite:!1});this.resolvedMilkyWay=new xe(b,D),this.resolvedMilkyWay.name="resolved_milky_way_stars",this.resolvedMilkyWay.renderOrder=-9,this.celestialGroup.add(this.resolvedMilkyWay)})}build3DCosmicStardust(){const t=new Float32Array(2400),a=new Float32Array(800*3),i=new Float32Array(800),s=new Float32Array(800);for(let c=0;c<800;c++){const n=30+Math.pow(Math.random(),.7)*750,h=Math.random()*Math.PI*2,m=(Math.random()-.5)*(90+n*.1);t[c*3]=Math.cos(h)*n,t[c*3+1]=m,t[c*3+2]=Math.sin(h)*n;const p=Math.random();p<.5?(a[c*3]=.9,a[c*3+1]=.92,a[c*3+2]=.98):p<.8?(a[c*3]=.98,a[c*3+1]=.85,a[c*3+2]=.6):(a[c*3]=.65,a[c*3+1]=.85,a[c*3+2]=.98),i[c]=1+Math.random()*1.5,s[c]=Math.random()*Math.PI*2}const o=new Z;o.setAttribute("position",new F(t,3)),o.setAttribute("color",new F(a,3)),o.setAttribute("aScale",new F(i,1)),o.setAttribute("aPhase",new F(s,1));const r=new L({uniforms:{time:{value:0}},vertexShader:`
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
      `,vertexColors:!0,transparent:!0,blending:q,depthWrite:!1});this.stardustMesh=new xe(o,r),this.stardustMesh.name="cosmic_stardust_motes",this.stardustMesh.renderOrder=-2,this.group.add(this.stardustMesh)}async loadCatalog(){try{const e="/solaris/".replace(/\/?$/,"/"),t=await fetch(`${e}data/stars.json`);if(!t.ok)throw new Error(`Failed to fetch stars.json: HTTP ${t.status}`);const a=await t.json();this.buildStarfieldMesh(a),this.buildConstellations(a),this.isLoaded=!0}catch(e){console.warn("Could not stream Hipparcos stars dataset, using procedural fallback:",e),this.buildProceduralFallback()}}buildStarfieldMesh(e){const t=e.stars.filter(f=>f[4]<=4.6),a=t.length,i=new Float32Array(a*3),s=new Float32Array(a*3),o=new Float32Array(a),r=oe.SPHERE_RADIUS;for(let f=0;f<a;f++){const g=t[f],v=g[1],S=g[2],x=g[3],b=g[4],D=g[5],P=K.icrfToThree([v,S,x]);i[f*3]=P[0]*r,i[f*3+1]=P[1]*r,i[f*3+2]=P[2]*r;const w=this.bvToRGB(D,g[8]);s[f*3]=w.r,s[f*3+1]=w.g,s[f*3+2]=w.b;const y=Math.max(.6,2.8-.42*b);o[f]=y}const c=new Z;c.setAttribute("position",new F(i,3)),c.setAttribute("color",new F(s,3)),c.setAttribute("size",new F(o,1));const n=`
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
    `,m=new L({vertexShader:n,fragmentShader:h,vertexColors:!0,transparent:!0,blending:q,depthWrite:!1});this.pointsMesh=new xe(c,m),this.pointsMesh.renderOrder=0,this.celestialGroup.add(this.pointsMesh);const p=e.stars.filter(f=>f[6]!==null&&f[6]>0&&f[6]<120);if(p.length>0){const f=new Float32Array(p.length*3),g=new Float32Array(p.length*3),v=new Float32Array(p.length);for(let b=0;b<p.length;b++){const D=p[b],P=oe.LOCAL_STAR_OFFSET+D[6]*oe.LOCAL_UNITS_PER_PC,w=K.icrfToThree([D[1],D[2],D[3]]);f[b*3]=w[0]*P,f[b*3+1]=w[1]*P,f[b*3+2]=w[2]*P;const y=this.bvToRGB(D[5],D[8]);g[b*3]=y.r,g[b*3+1]=y.g,g[b*3+2]=y.b;const T=D[4];v[b]=Math.max(.8,2.6-.3*T)}const S=new Z;S.setAttribute("position",new F(f,3)),S.setAttribute("color",new F(g,3)),S.setAttribute("size",new F(v,1));const x=new L({vertexShader:`
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
`+h.replace("gl_FragColor = vec4(vColor, alpha);","gl_FragColor = vec4(vColor, alpha * uOpacity);"),uniforms:{uOpacity:this.localStarsOpacity},vertexColors:!0,transparent:!0,blending:q,depthWrite:!1});this.localInterstellarStars=new xe(S,x),this.localInterstellarStars.visible=!1,this.localInterstellarStars.name="local_interstellar_3d_stars",this.localInterstellarStars.renderOrder=1,this.group.add(this.localInterstellarStars)}}buildConstellations(e){const t=new Map,a=oe.SPHERE_RADIUS*.998;for(const r of e.stars){const c=K.icrfToThree([r[1],r[2],r[3]]);t.set(r[0],[c[0]*a,c[1]*a,c[2]*a])}const i=[];for(const[r,c]of Us){const n=t.get(r),h=t.get(c);n&&h&&(i.push(n[0],n[1],n[2]),i.push(h[0],h[1],h[2]))}if(i.length===0)return;const s=new Z;s.setAttribute("position",new ze(i,3));const o=new Ze({color:5231045,transparent:!0,opacity:oe.CONSTELLATION_OPACITY,depthWrite:!1,blending:q});this.constellationLines=new Ui(s,o),this.constellationLines.name="constellation_lines",this.celestialGroup.add(this.constellationLines)}bvToRGB(e,t){if(e!==null)return e<-.1?new I(10335487):e<.15?new I(12374783):e<.35?new I(15791359):e<.6?new I(16775144):e<.85?new I(16770723):e<1.3?new I(16760437):new I(16747093);switch(t){case"O":return new I(10335487);case"B":return new I(12374783);case"A":return new I(15791359);case"F":return new I(16775144);case"G":return new I(16770723);case"K":return new I(16760437);case"M":return new I(16747093);default:return new I(16777215)}}buildProceduralFallback(){const t=new Z,a=new Float32Array(6e3*3),i=new Float32Array(6e3*3),s=oe.SPHERE_RADIUS;for(let r=0;r<6e3;r++){const c=Math.random()*Math.PI*2,n=Math.acos(Math.random()*2-1);a[r*3]=s*Math.sin(n)*Math.cos(c),a[r*3+1]=s*Math.cos(n),a[r*3+2]=s*Math.sin(n)*Math.sin(c),i[r*3]=.9,i[r*3+1]=.92,i[r*3+2]=1}t.setAttribute("position",new F(a,3)),t.setAttribute("color",new F(i,3));const o=new Fi({size:2.5,vertexColors:!0,transparent:!0,opacity:.85});this.pointsMesh=new xe(t,o),this.celestialGroup.add(this.pointsMesh)}setGroundMode(e,t=3){this.groundMode=e,this.celestialGroup.scale.setScalar(e?t/(oe.SPHERE_RADIUS*1.06):1),this.stardustMesh&&(this.stardustMesh.visible=!e),this.travelParticles.mesh.visible=!e,this.externalGalaxy.group.visible=!e}update(e,t,a,i,s){this.celestialGroup.position.copy(e);const o=e.length(),r=this.externalGalaxy.getGalacticCenterWorldPosition(),c=e.distanceTo(r),n=R.clamp((o-3500)/18500,0,1),h=c<8e3?R.clamp((8e3-c)/4e3,0,1):0,m=Math.max(n,h),p=m*m*(3-2*m);if(this.externalGalaxy.setOpacity(p),this.milkyWayOpacityUniform.value=1-p,this.constellationLines&&(this.constellationLines.material.opacity=oe.CONSTELLATION_OPACITY*(1-p)),this.localInterstellarStars){const f=R.smoothstep(o,700,1600),g=1-R.smoothstep(o,9e3,2e4),v=f*g;this.localStarsOpacity.value=v,this.localInterstellarStars.visible=v>.005}this.externalGalaxy.update(performance.now()*.001,s),!this.groundMode&&this.travelParticles.update(e,a||new M,i||0,t)}setConstellationsVisible(e){this.constellationLines&&(this.constellationLines.visible=e)}toggleConstellations(){return this.constellationLines?(this.constellationLines.visible=!this.constellationLines.visible,this.constellationLines.visible):!1}areConstellationsVisible(){var e;return((e=this.constellationLines)==null?void 0:e.visible)??!0}dispose(){this.externalGalaxy.dispose(),this.travelParticles.dispose(),this.localInterstellarStars&&(this.localInterstellarStars.geometry.dispose(),this.localInterstellarStars.material.dispose()),this.milkyWayMesh&&(this.milkyWayMesh.geometry.dispose(),this.milkyWayMesh.material.dispose()),this.pointsMesh&&(this.pointsMesh.geometry.dispose(),this.pointsMesh.material.dispose()),this.constellationLines&&(this.constellationLines.geometry.dispose(),this.constellationLines.material.dispose()),this.stardustMesh&&(this.stardustMesh.geometry.dispose(),this.stardustMesh.material.dispose()),this.resolvedMilkyWay&&(this.resolvedMilkyWay.geometry.dispose(),this.resolvedMilkyWay.material.dispose())}};d(oe,"SPHERE_RADIUS",8500),d(oe,"LOCAL_STAR_OFFSET",700),d(oe,"CONSTELLATION_OPACITY",.38),d(oe,"LOCAL_UNITS_PER_PC",38);let tt=oe;const xi={Sun:{targetCoverageY:.85,ndcOffsetX:-.28,ndcOffsetY:0,fov:42,preferredElevation:Math.PI*.35},Mercury:{targetCoverageY:.92,ndcOffsetX:-.34,ndcOffsetY:0,fov:40,preferredElevation:Math.PI*.38},Venus:{targetCoverageY:.92,ndcOffsetX:-.34,ndcOffsetY:0,fov:40,preferredElevation:Math.PI*.38},Earth:{targetCoverageY:.94,ndcOffsetX:-.35,ndcOffsetY:0,fov:40,preferredElevation:Math.PI*.37},Mars:{targetCoverageY:.92,ndcOffsetX:-.34,ndcOffsetY:0,fov:40,preferredElevation:Math.PI*.38},Jupiter:{targetCoverageY:1.08,ndcOffsetX:-.38,ndcOffsetY:0,fov:41,preferredElevation:Math.PI*.39},Saturn:{targetCoverageY:.88,ndcOffsetX:-.28,ndcOffsetY:0,fov:41,effectiveRadiusMultiplier:1.95,preferredElevation:Math.PI*.32},Uranus:{targetCoverageY:.92,ndcOffsetX:-.34,ndcOffsetY:0,fov:40,preferredElevation:Math.PI*.38},Neptune:{targetCoverageY:.92,ndcOffsetX:-.34,ndcOffsetY:0,fov:40,preferredElevation:Math.PI*.38},Pluto:{targetCoverageY:.9,ndcOffsetX:-.32,ndcOffsetY:0,fov:39,preferredElevation:Math.PI*.38},"Sagittarius A*":{targetCoverageY:.88,ndcOffsetX:.22,ndcOffsetY:-.02,fov:40,preferredElevation:Math.PI*.42}},Ut={targetCoverageY:.92,ndcOffsetX:-.34,ndcOffsetY:0,fov:40,preferredElevation:Math.PI*.38},_s={targetCoverageY:.88,ndcOffsetX:-.33,ndcOffsetY:0,fov:39,preferredElevation:Math.PI*.38},$e=55,zs=2.12,Ks=6371;function Bs(l,e=1.25){const t=1+zs*Math.sqrt(Ks/Math.max(.001,l));return Math.max(e,t)}const ce=class ce{constructor(e){d(this,"camera");d(this,"subjectAnchor",new M(0,0,0));d(this,"orbitPivot",new M(0,0,0));d(this,"aimPoint",new M(0,0,0));d(this,"currentNdcOffset",new te(-.34,0));d(this,"targetNdcOffset",new te(-.34,0));d(this,"shotMode","cinematic_observation");d(this,"effectiveAnchor",new M(0,0,0));d(this,"currentVelocity",new M(0,0,0));d(this,"lastCameraPos",new M(0,0,0));d(this,"lastRadius",680);d(this,"zoomRate",0);d(this,"lastUpdateTime",performance.now());d(this,"hasMotionSample",!1);d(this,"motionBasis","relative");d(this,"tmpRelPos",new M);d(this,"spherical",new Ce(680,Math.PI*.3,Math.PI*.25));d(this,"targetSpherical",new Ce(680,Math.PI*.3,Math.PI*.25));d(this,"panOffset",new M(0,0,0));d(this,"targetPanOffset",new M(0,0,0));d(this,"focusedObject",null);d(this,"focusDistance",30);d(this,"focusedRadius",2.8);d(this,"focusedPhysicalRadiusKm",null);d(this,"surfaceMinAltitude",null);d(this,"distanceModel","exploration");d(this,"transition",null);d(this,"isOrbiting",!1);d(this,"isPanning",!1);d(this,"previousMousePosition",{x:0,y:0});d(this,"lastInteractionTime",performance.now());d(this,"activeTouches",new Map);d(this,"initialPinchDist",0);d(this,"initialRadiusOnPinch",0);d(this,"enableIdleDrift",!0);d(this,"damping",.12);d(this,"frameDamping",.12);d(this,"lastDampingTime",performance.now());d(this,"lookYaw",0);d(this,"lookPitch",0);d(this,"targetLookYaw",0);d(this,"targetLookPitch",0);d(this,"isLooking",!1);d(this,"heldLookKeys",new Set);d(this,"lastLookUpdate",performance.now());d(this,"domElement");d(this,"suspended",!1);d(this,"onMouseDown",e=>{if(!this.suspended){if(this.lastInteractionTime=performance.now(),this.transition){this.transition=null;const t=new M().subVectors(this.camera.position,this.orbitPivot);this.spherical.setFromVector3(t),this.targetSpherical.copy(this.spherical)}e.button===0?e.shiftKey?this.isPanning=!0:(this.isOrbiting=!0,this.beginGrab(e.clientX,e.clientY)):e.button===1?this.isPanning=!0:e.button===2&&(this.isLooking=!0),this.previousMousePosition={x:e.clientX,y:e.clientY}}});d(this,"onMouseUp",()=>{this.grabLocal=null,this.isOrbiting=!1,this.isPanning=!1,this.isLooking=!1,this.lastInteractionTime=performance.now()});d(this,"onMouseMove",e=>{if(this.suspended||(this.lastInteractionTime=performance.now(),!this.isOrbiting&&!this.isPanning&&!this.isLooking))return;const t=e.clientX-this.previousMousePosition.x,a=e.clientY-this.previousMousePosition.y;if(this.previousMousePosition={x:e.clientX,y:e.clientY},this.isLooking){const i=R.degToRad(this.camera.fov)/Math.max(1,this.domElement.clientHeight||800);this.targetLookYaw+=t*i,this.targetLookPitch+=a*i;return}if(this.isOrbiting){if(this.grabSurface(e.clientX,e.clientY))return;const i=.005*Math.min(1,Math.max(5e-4,this.altitudeInRadii()));this.targetSpherical.theta-=t*i,this.targetSpherical.phi-=a*i,this.targetSpherical.phi=Math.max(.02,Math.min(Math.PI-.02,this.targetSpherical.phi))}else if(this.isPanning){const i=this.spherical.radius*.001,s=new M,o=new M;this.camera.matrixWorld.extractBasis(s,o,new M),this.targetPanOffset.addScaledVector(s,-t*i),this.targetPanOffset.addScaledVector(o,a*i)}});d(this,"onWheel",e=>{if(this.suspended)return;if(e.preventDefault(),this.lastInteractionTime=performance.now(),this.transition){this.transition=null;const c=new M().subVectors(this.camera.position,this.orbitPivot);this.spherical.setFromVector3(c),this.targetSpherical.copy(this.spherical)}const t=e.deltaMode===1?33:e.deltaMode===2?400:1,a=R.clamp(e.deltaY*t,-600,600),i=Math.pow(.92,-a*.012),s=this.minimumDistance(),o=18e4;let r;if(this.focusedObject&&!this.isBlackHoleFocus()&&this.targetSpherical.radius<this.focusedRadius*4){const c=this.targetSpherical.radius-this.focusedRadius;r=this.focusedRadius+c*i}else r=this.targetSpherical.radius*i;r=Math.max(s,Math.min(o,r)),this.zoomTowardCursor(e.clientX,e.clientY,this.targetSpherical.radius,r),this.targetSpherical.radius=r});d(this,"raycaster",new _i);d(this,"tmpNdc",new te);d(this,"tmpSphere",new zi);d(this,"grabLocal",null);d(this,"virtualCam",new pi);d(this,"onContextMenu",e=>{e.preventDefault()});d(this,"onTouchStart",e=>{if(!this.suspended){if(this.lastInteractionTime=performance.now(),this.transition){this.transition=null;const t=new M().subVectors(this.camera.position,this.orbitPivot);this.spherical.setFromVector3(t),this.targetSpherical.copy(this.spherical)}for(let t=0;t<e.changedTouches.length;t++){const a=e.changedTouches[t];this.activeTouches.set(a.identifier,{x:a.clientX,y:a.clientY})}if(this.activeTouches.size===2){const t=Array.from(this.activeTouches.values());this.initialPinchDist=Math.hypot(t[0].x-t[1].x,t[0].y-t[1].y),this.initialRadiusOnPinch=this.targetSpherical.radius}}});d(this,"onTouchMove",e=>{if(!this.suspended){if(this.lastInteractionTime=performance.now(),this.activeTouches.size===1&&e.touches.length===1){const t=e.touches[0],a=this.activeTouches.get(t.identifier);if(a){const i=t.clientX-a.x,s=t.clientY-a.y,o=.006*Math.min(1,Math.max(5e-4,this.altitudeInRadii()));this.targetSpherical.theta-=i*o,this.targetSpherical.phi-=s*o,this.targetSpherical.phi=Math.max(.02,Math.min(Math.PI-.02,this.targetSpherical.phi)),this.activeTouches.set(t.identifier,{x:t.clientX,y:t.clientY})}}else if(this.activeTouches.size>=2&&e.touches.length>=2){const t=[e.touches[0],e.touches[1]],a=Math.hypot(t[0].clientX-t[1].clientX,t[0].clientY-t[1].clientY);if(this.initialPinchDist>0){const i=this.initialPinchDist/a,s=this.minimumDistance();let o=this.initialRadiusOnPinch*i;this.focusedObject&&!this.isBlackHoleFocus()&&this.initialRadiusOnPinch<this.focusedRadius*4&&(o=this.focusedRadius+(this.initialRadiusOnPinch-this.focusedRadius)*i),this.targetSpherical.radius=Math.max(s,Math.min(18e4,o))}}}});d(this,"onTouchEnd",e=>{this.lastInteractionTime=performance.now();for(let t=0;t<e.changedTouches.length;t++)this.activeTouches.delete(e.changedTouches[t].identifier);this.activeTouches.size<2&&(this.initialPinchDist=0)});d(this,"onKeyDown",e=>{if(this.suspended||!ce.LOOK_KEYS.has(e.key))return;const t=e.target;t&&(t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.isContentEditable)||(e.preventDefault(),this.heldLookKeys.add(e.key))});d(this,"onKeyUp",e=>{this.heldLookKeys.delete(e.key)});d(this,"onWindowBlur",()=>{this.heldLookKeys.clear(),this.isLooking=!1});d(this,"onDoubleClick",()=>{this.suspended||this.resetLook()});this.domElement=e,this.camera=new pi(45,e.clientWidth/e.clientHeight,.05,16e4),this.updateCameraPosition(),this.setupEventListeners(e)}static calculateViewingDistance(e,t,a=t.fov){const i=e*(t.effectiveRadiusMultiplier||1),s=R.degToRad(a*.5),o=Math.tan(s),r=Math.max(.1,t.targetCoverageY),c=i/(r*o);return Math.max(i*1.15,c)}getResponsiveNdcOffset(e,t,a){let i=e,s=t;if(a>=1.5)i=e,s=t;else if(a>=1){const o=(a-1)/.5;i=e*(.45+.55*o),s=t}else i=e*.15,s=-.1;return{x:i,y:s}}calculateAimPoint(e,t,a,i,s,o){if(Math.abs(a)<.001&&Math.abs(i)<.001)return t.clone();const r=new M().subVectors(t,e),c=r.length();if(c<.001)return t.clone();const n=r.clone().divideScalar(c),h=new M(0,1,0);let m=new M().crossVectors(n,h);m.lengthSq()<1e-4&&(m=new M().crossVectors(n,new M(0,0,1))),m.normalize();const p=new M().crossVectors(m,n).normalize(),f=this.getResponsiveNdcOffset(a,i,o),g=R.degToRad(s*.5),v=Math.tan(g),S=o*v,x=f.x*c*S,b=f.y*c*v;return new M().copy(t).addScaledVector(m,-x).addScaledVector(p,-b)}updateCameraPosition(){if(this.transition){const r=performance.now()-this.transition.startTime,c=Math.min(1,r/this.transition.durationMs),n=c<.5?16*Math.pow(c,5):1-Math.pow(-2*c+2,5)/2;this.transition.targetObject?(this.transition.targetObject.updateWorldMatrix(!0,!1),this.transition.targetObject.getWorldPosition(this.subjectAnchor)):this.subjectAnchor.set(0,0,0),this.camera.fov=R.lerp(this.transition.startFov,this.transition.targetFov,n),this.currentNdcOffset.x=R.lerp(this.transition.startNdcOffsetX,this.transition.targetNdcOffsetX,n),this.currentNdcOffset.y=R.lerp(this.transition.startNdcOffsetY,this.transition.targetNdcOffsetY,n);const h=R.lerp(this.spherical.theta,this.transition.targetTheta,n),m=R.lerp(this.spherical.phi,this.transition.targetPhi,n),p=R.lerp(this.spherical.radius,this.transition.targetDistance,n);this.orbitPivot.lerpVectors(this.transition.startPivot,this.subjectAnchor,n);const f=new M().setFromSphericalCoords(p,m,h);this.camera.position.copy(this.orbitPivot).add(f),this.aimPoint=this.calculateAimPoint(this.camera.position,this.orbitPivot,this.currentNdcOffset.x,this.currentNdcOffset.y,this.camera.fov,this.camera.aspect),this.camera.lookAt(this.aimPoint),this.applyLookOffset();const g=Math.max(this.focusedObject?1e-4:.05,p-this.focusedRadius);this.camera.near=Math.max(this.focusedObject?1e-5:.04,g*.08),this.camera.far=Math.max(16e4,p*30),this.camera.updateProjectionMatrix(),this.trackMotion(this.tmpRelPos.copy(this.camera.position),p,"absolute"),c>=1&&(this.transition.onComplete&&this.transition.onComplete(),this.spherical.set(p,m,h),this.targetSpherical.copy(this.spherical),this.panOffset.set(0,0,0),this.targetPanOffset.set(0,0,0),this.transition=null);return}let e=this.subjectAnchor;if(this.focusedObject){this.focusedObject.updateWorldMatrix(!0,!1),this.focusedObject.getWorldPosition(this.subjectAnchor);const o=this.spherical.radius;if(!(this.focusedObject.name.includes("sagittarius")||this.focusedObject.name==="Sagittarius A*")&&o>320){const c=Math.min(1,(o-320)/480);this.effectiveAnchor.lerpVectors(this.subjectAnchor,ce.ORIGIN_VEC,c),e=this.effectiveAnchor}else e=this.subjectAnchor}else this.subjectAnchor.set(0,0,0),e=this.subjectAnchor;this.currentNdcOffset.x+=(this.targetNdcOffset.x-this.currentNdcOffset.x)*this.frameDamping,this.currentNdcOffset.y+=(this.targetNdcOffset.y-this.currentNdcOffset.y)*this.frameDamping,this.panOffset.lerp(this.targetPanOffset,this.frameDamping),this.orbitPivot.copy(e).add(this.panOffset),this.enableIdleDrift&&!this.isOrbiting&&!this.isPanning&&this.shotMode==="cinematic_observation"&&!(this.altitudeInRadii()<4)&&performance.now()-this.lastInteractionTime>3e3&&(this.targetSpherical.theta+=8e-5),this.spherical.theta+=(this.targetSpherical.theta-this.spherical.theta)*this.frameDamping,this.spherical.phi+=(this.targetSpherical.phi-this.spherical.phi)*this.frameDamping,this.spherical.radius+=(this.targetSpherical.radius-this.spherical.radius)*this.frameDamping,this.spherical.phi=Math.max(.02,Math.min(Math.PI-.02,this.spherical.phi));const t=new M().setFromSpherical(this.spherical);this.camera.position.copy(this.orbitPivot).add(t);const a=this.compositionWeight();this.aimPoint=this.calculateAimPoint(this.camera.position,this.orbitPivot,this.currentNdcOffset.x*a,this.currentNdcOffset.y*a,this.camera.fov,this.camera.aspect),this.camera.lookAt(this.aimPoint),this.applyLookOffset();const i=this.spherical.radius,s=Math.max(this.focusedObject?1e-4:.05,i-this.focusedRadius);this.camera.near=Math.max(this.focusedObject?1e-5:.04,Math.min(30,s*.08)),this.camera.far=Math.max(25e4,i*35),this.camera.updateProjectionMatrix(),this.trackMotion(this.tmpRelPos.subVectors(this.camera.position,this.orbitPivot),this.spherical.radius,"relative")}trackMotion(e,t,a){const i=performance.now(),s=Math.max(.001,(i-this.lastUpdateTime)*.001);a!==this.motionBasis&&(this.motionBasis=a,this.hasMotionSample=!1),this.hasMotionSample&&(this.currentVelocity.subVectors(e,this.lastCameraPos).divideScalar(s),this.lastRadius>.001&&(this.zoomRate=(Math.log(t)-Math.log(this.lastRadius))/s)),this.hasMotionSample=!0,this.lastCameraPos.copy(e),this.lastRadius=t,this.lastUpdateTime=i}syncFromCamera(){this.transition=null,this.camera.up.set(0,1,0),this.focusedObject&&(this.focusedObject.updateWorldMatrix(!0,!1),this.focusedObject.getWorldPosition(this.subjectAnchor)),this.orbitPivot.copy(this.subjectAnchor),this.panOffset.set(0,0,0),this.targetPanOffset.set(0,0,0),this.spherical.setFromVector3(new M().subVectors(this.camera.position,this.orbitPivot)),this.targetSpherical.copy(this.spherical),this.resetLook(),this.lookYaw=0,this.lookPitch=0,this.hasMotionSample=!1}update(){if(this.suspended)return;const e=performance.now(),t=Math.min(.25,Math.max(.001,(e-this.lastDampingTime)/1e3));this.lastDampingTime=e,this.frameDamping=1-Math.pow(1-this.damping,t*60),this.updateLook(),this.updateCameraPosition()}updateLook(){const e=performance.now(),t=Math.min(.1,Math.max(0,(e-this.lastLookUpdate)*.001));if(this.lastLookUpdate=e,this.heldLookKeys.size>0){const a=ce.LOOK_KEY_RATE*(this.camera.fov/$e)*t;this.heldLookKeys.has("ArrowLeft")&&(this.targetLookYaw+=a),this.heldLookKeys.has("ArrowRight")&&(this.targetLookYaw-=a),this.heldLookKeys.has("ArrowUp")&&(this.targetLookPitch+=a),this.heldLookKeys.has("ArrowDown")&&(this.targetLookPitch-=a),this.lastInteractionTime=e}this.targetLookPitch=R.clamp(this.targetLookPitch,-ce.MAX_LOOK_PITCH,ce.MAX_LOOK_PITCH),this.lookYaw+=(this.targetLookYaw-this.lookYaw)*this.frameDamping,this.lookPitch+=(this.targetLookPitch-this.lookPitch)*this.frameDamping}applyLookOffset(){Math.abs(this.lookYaw)<1e-6&&Math.abs(this.lookPitch)<1e-6||(this.camera.rotateY(this.lookYaw),this.camera.rotateX(this.lookPitch))}isBlackHoleFocus(){return!!this.focusedObject&&(this.focusedObject.name.includes("sagittarius")||this.focusedObject.name==="Sagittarius A*")}minimumDistance(){return this.isBlackHoleFocus()?65:this.focusedObject?this.surfaceMinAltitude!==null?this.focusedRadius+this.surfaceMinAltitude:this.focusedRadius*1.15:.35}altitudeInRadii(e=this.spherical.radius){return!this.focusedObject||this.focusedRadius<=0||this.isBlackHoleFocus()?1/0:Math.max(0,e/this.focusedRadius-1)}compositionWeight(){const e=this.altitudeInRadii();return isFinite(e)?R.smoothstep(e,.25,1.2):1}applyFrameRotation(e){if(this.transition)return;const t=new M().setFromSpherical(this.spherical).applyQuaternion(e),a=new M().setFromSpherical(this.targetSpherical).applyQuaternion(e);this.spherical.setFromVector3(t),this.targetSpherical.setFromVector3(a),this.makeSphericalContinuous()}makeSphericalContinuous(){const e=Math.PI*2;for(;this.targetSpherical.theta-this.spherical.theta>Math.PI;)this.targetSpherical.theta-=e;for(;this.targetSpherical.theta-this.spherical.theta<-Math.PI;)this.targetSpherical.theta+=e}focusSurfacePoint(e,t,a,i,s=2200){this.focusedObject=e,this.focusedRadius=t,this.shotMode="free_inspection",this.resetLook(),typeof window<"u"&&window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches&&(s=150);const o=Math.max(this.minimumDistance(),t+i),r=new Ce().setFromVector3(a.clone().normalize().multiplyScalar(o));for(r.phi=Math.max(.02,Math.min(Math.PI-.02,r.phi));r.theta-this.spherical.theta>Math.PI;)r.theta-=Math.PI*2;for(;r.theta-this.spherical.theta<-Math.PI;)r.theta+=Math.PI*2;this.targetNdcOffset.set(0,0),this.targetPanOffset.set(0,0,0),this.panOffset.set(0,0,0),this.transition={startPos:this.camera.position.clone(),startAimPoint:this.aimPoint.clone(),startFov:this.camera.fov,startNdcOffsetX:this.currentNdcOffset.x,startNdcOffsetY:this.currentNdcOffset.y,startPivot:this.orbitPivot.clone(),startSpherical:this.spherical.clone(),targetObject:e,targetRadius:t,targetBodyName:e.name,targetShotMode:"free_inspection",targetFov:$e,targetNdcOffsetX:0,targetNdcOffsetY:0,targetDistance:o,targetTheta:r.theta,targetPhi:r.phi,startTime:performance.now(),durationMs:s,onComplete:()=>{this.spherical.copy(r),this.targetSpherical.copy(r),this.camera.fov=$e,this.currentNdcOffset.set(0,0)}}}resetLook(){this.targetLookYaw=0,this.targetLookPitch=0}getLookAngles(){return{yaw:this.lookYaw,pitch:this.lookPitch}}get lookAtTarget(){return this.aimPoint}focusCinematic(e,t,a="",i=1800,s,o){this.focusedObject=e,this.focusedRadius=t,this.shotMode="cinematic_observation",o!==void 0&&(this.focusedPhysicalRadiusKm=o),this.targetLookYaw=0,this.targetLookPitch=0,typeof window<"u"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches&&(i=150),e.updateWorldMatrix(!0,!1);const r=new M;e.getWorldPosition(r);const c=xi[a]||(t<1?_s:Ut);this.targetNdcOffset.set(c.ndcOffsetX,c.ndcOffsetY);const n=a==="Sagittarius A*"||a==="Sgr A*"||a==="sagittarius_a_star";let h=c.fov,m;if(o!==void 0&&!n){const S=c.effectiveRadiusMultiplier?2.9:a==="Sun"?1.6:1.25;m=t*Bs(o,S),h=$e}else m=ce.calculateViewingDistance(t,c,c.fov);this.focusDistance=m;const p=new M().copy(r).negate(),f=p.lengthSq()<1||a==="Sun";f?p.set(0,0,1):p.normalize();let g;if(f)g=new M(0,.4,1).normalize().multiplyScalar(m);else if(a==="Saturn"){const S=new Se;e.getWorldQuaternion(S);const x=new M(0,1,0).applyQuaternion(S);x.dot(p)<0&&x.negate();const b=ce.chooseObservationVantage(p,c.ndcOffsetX);b.addScaledVector(x,-b.dot(x)).normalize(),g=b.multiplyScalar(Math.cos(R.degToRad(30))).addScaledVector(x,Math.sin(R.degToRad(30))).normalize().multiplyScalar(m)}else if(a==="Sagittarius A*"||a==="Sgr A*"||a==="sagittarius_a_star"){const S=new Se;e.getWorldQuaternion(S),g=new M(.28,.25,.92).normalize().applyQuaternion(S).multiplyScalar(m)}else g=ce.chooseObservationVantage(p,c.ndcOffsetX).multiplyScalar(m);const v=new Ce().setFromVector3(g);v.phi=Math.max(.04,Math.min(Math.PI-.04,v.phi)),this.targetPanOffset.set(0,0,0),this.panOffset.set(0,0,0),this.transition={startPos:this.camera.position.clone(),startAimPoint:this.aimPoint.clone(),startFov:this.camera.fov,startNdcOffsetX:this.currentNdcOffset.x,startNdcOffsetY:this.currentNdcOffset.y,startPivot:this.orbitPivot.clone(),startSpherical:this.spherical.clone(),targetObject:e,targetRadius:t,targetBodyName:a,targetShotMode:"cinematic_observation",targetFov:h,targetNdcOffsetX:c.ndcOffsetX,targetNdcOffsetY:c.ndcOffsetY,targetDistance:m,targetTheta:v.theta,targetPhi:v.phi,startTime:performance.now(),durationMs:i,onComplete:()=>{this.spherical.copy(v),this.targetSpherical.copy(v),this.camera.fov=h,this.currentNdcOffset.set(c.ndcOffsetX,c.ndcOffsetY),s&&s()}}}static chooseObservationVantage(e,t=-.34){const a=e.clone().normalize(),i=new M(0,1,0),s=new M().crossVectors(i,a);s.lengthSq()<1e-8&&s.set(1,0,0),s.normalize();const o=new M().crossVectors(a,s).normalize(),r=K.galacticBasisThree(),c=new M(...r.z),n=new M(...r.x),h=R.degToRad(55),m=t<=0?1:-1;let p=new M().copy(a).multiplyScalar(Math.cos(h)).addScaledVector(s,Math.sin(h)),f=-1/0;const g=new M,v=new M,S=new M,x=new M,b=new M;for(let D=0;D<24;D++){const P=D/24*Math.PI*2;if(g.copy(a).multiplyScalar(Math.cos(h)).addScaledVector(s,Math.sin(h)*Math.cos(P)).addScaledVector(o,Math.sin(h)*Math.sin(P)).normalize(),Math.abs(g.y)>.75)continue;v.copy(g).negate(),S.crossVectors(v,i).normalize(),x.crossVectors(S,v).normalize(),b.copy(v).addScaledVector(S,.85*m).normalize();const w=1-Math.abs(b.dot(c)),y=Math.max(0,b.dot(n))*.35,T=Math.abs(g.y-.25)*.4,k=w+y-T;k>f&&(f=k,p=g.clone())}return p.normalize()}focusOn(e,t,a=1800){this.focusCinematic(e,t,e.name,a)}resetToOverview(e=1600){this.resetLook(),this.focusedObject=null,this.focusedRadius=48,this.shotMode="deep_space_overview",this.targetPanOffset.set(0,0,0),this.panOffset.set(0,0,0),this.targetNdcOffset.set(0,0),typeof window<"u"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches&&(e=150);const t=new Ce(680,Math.PI*.3,Math.PI*.25);this.transition={startPos:this.camera.position.clone(),startAimPoint:this.aimPoint.clone(),startFov:this.camera.fov,startNdcOffsetX:this.currentNdcOffset.x,startNdcOffsetY:this.currentNdcOffset.y,startPivot:this.orbitPivot.clone(),startSpherical:this.spherical.clone(),targetObject:null,targetRadius:48,targetBodyName:"Overview",targetShotMode:"deep_space_overview",targetFov:45,targetNdcOffsetX:0,targetNdcOffsetY:0,targetDistance:680,targetTheta:t.theta,targetPhi:t.phi,startTime:performance.now(),durationMs:e,onComplete:()=>{this.spherical.copy(t),this.targetSpherical.copy(t),this.subjectAnchor.set(0,0,0),this.orbitPivot.set(0,0,0),this.camera.fov=45,this.currentNdcOffset.set(0,0)}}}transitionToDistance(e,t=45,a="deep_space_overview",i=1600,s,o){typeof window<"u"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches&&(i=150);let r;if(o)r=new Ce().setFromVector3(o.clone().normalize().multiplyScalar(e)),r.phi=Math.max(.04,Math.min(Math.PI-.04,r.phi));else{const h=this.targetSpherical.theta,m=s!==void 0?s:Math.max(.08,Math.min(Math.PI*.45,this.targetSpherical.phi));r=new Ce(e,m,h)}this.shotMode=a,this.targetPanOffset.set(0,0,0);const c=a==="cinematic_observation"?-.34:0,n=0;this.transition={startPos:this.camera.position.clone(),startAimPoint:this.aimPoint.clone(),startFov:this.camera.fov,startNdcOffsetX:this.currentNdcOffset.x,startNdcOffsetY:this.currentNdcOffset.y,startPivot:this.orbitPivot.clone(),startSpherical:this.spherical.clone(),targetObject:e<350?this.focusedObject:null,targetRadius:this.focusedRadius,targetBodyName:this.focusedObject?this.focusedObject.name:"Cosmos",targetShotMode:a,targetFov:t,targetNdcOffsetX:c,targetNdcOffsetY:n,targetDistance:e,targetTheta:r.theta,targetPhi:r.phi,startTime:performance.now(),durationMs:i,onComplete:()=>{this.spherical.copy(r),this.targetSpherical.copy(r),e>=350&&(this.subjectAnchor.set(0,0,0),this.orbitPivot.set(0,0,0)),this.camera.fov=t,this.currentNdcOffset.set(c,n),this.targetNdcOffset.set(c,n)}}}jumpToScale(e,t=1800){let a=680,i="scientific_overview",s=45,o,r;switch(e){case"planetary":a=this.focusedRadius>0?this.focusedRadius*2.8:12,i="cinematic_observation",s=40;break;case"inner_system":a=180,i="scientific_overview",s=45,o=Math.PI*.32;break;case"outer_system":a=1100,i="deep_space_overview",s=46,o=Math.PI*.28;break;case"interstellar":a=8200,i="deep_space_overview",s=48,o=Math.PI*.26;break;case"galactic":a=52e3,i="deep_space_overview",s=48;{const c=K.galacticBasisThree(),n=R.degToRad(35);r=new M(...c.z).multiplyScalar(Math.cos(n)).addScaledVector(new M(...c.x),-Math.sin(n))}break}this.transitionToDistance(a,s,i,t,o,r)}getVelocity(){return this.currentVelocity}getZoomVelocity(){return this.zoomRate}getTravelSpeed(){return this.currentVelocity.length()}getObserverScaleMetric(){const e=this.spherical.radius,t=i=>`${Math.round(i).toLocaleString("en-US")} KM`;if(this.focusedObject&&(this.focusedObject.name.includes("sagittarius")||this.focusedObject.name==="Sagittarius A*")){const i=e/sa.schwarzschildRadius,s=i*re.derivedParameters.schwarzschildRadiusKm;return{distance:e,formatted:`${i.toFixed(1)} r_s (${t(s)})`,domain:"planetary"}}const a=this.focusedObject!==null&&this.focusedPhysicalRadiusKm!==null&&e<320;if(e<30||a){const i=this.distanceModel==="scientific"?Pe.SCIENTIFIC_KM_PER_UNIT:this.focusedPhysicalRadiusKm&&this.focusedRadius>0?this.focusedPhysicalRadiusKm/this.focusedRadius:2654.5833333333335;return this.focusedObject&&this.focusedRadius>0&&e>this.focusedRadius?{distance:e,formatted:`ALT ${t((e-this.focusedRadius)*i)}`,domain:"planetary"}:{distance:e,formatted:t(e*i),domain:"planetary"}}if(e<3500){let i;if(this.distanceModel==="scientific")i=e*Pe.SCIENTIFIC_KM_PER_UNIT/Pe.AU_KM;else{const o=$t(1);i=e<o?e/o:xs(e)}const s=e<380?"inner_system":"outer_system";return{distance:e,formatted:`${i.toFixed(i<10?2:1)} AU`,domain:s}}if(e<25e3){const i=Math.max(0,e-tt.LOCAL_STAR_OFFSET)/tt.LOCAL_UNITS_PER_PC;return{distance:e,formatted:`${(i*3.26156).toFixed(1)} LY`,domain:"interstellar"}}return{distance:e,formatted:`${(e/Ee).toFixed(1)} KPC`,domain:"galactic"}}toggleFramingOffset(){if(Math.abs(this.targetNdcOffset.x)>.05)return this.targetNdcOffset.set(0,0),this.shotMode="free_inspection",!1;{const e=this.focusedObject&&xi[this.focusedObject.name]||Ut;return this.targetNdcOffset.set(e.ndcOffsetX,e.ndcOffsetY),this.shotMode="cinematic_observation",!0}}pickGlobe(e,t,a,i=this.camera){if(!this.focusedObject||this.isBlackHoleFocus())return null;const s=this.domElement.getBoundingClientRect();return s.width<=0||s.height<=0?null:(this.tmpNdc.set((e-s.left)/s.width*2-1,-((t-s.top)/s.height)*2+1),this.raycaster.setFromCamera(this.tmpNdc,i),this.tmpSphere.set(this.orbitPivot,this.focusedRadius),this.raycaster.ray.intersectSphere(this.tmpSphere,a))}virtualCameraAt(e){const t=this.virtualCam;return t.fov=this.camera.fov,t.aspect=this.camera.aspect,t.near=this.camera.near,t.far=this.camera.far,t.updateProjectionMatrix(),t.up.set(0,1,0),t.position.copy(this.orbitPivot).add(new M().setFromSpherical(e)),t.lookAt(this.orbitPivot),t.updateMatrixWorld(),t}enterMapFraming(){this.altitudeInRadii()<4&&this.targetNdcOffset.set(0,0)}beginGrab(e,t){if(this.grabLocal=null,!(this.altitudeInRadii()<3)||!this.focusedObject)return;this.enterMapFraming();const a=this.pickGlobe(e,t,new M);a&&(this.focusedObject.updateWorldMatrix(!0,!1),this.grabLocal=this.focusedObject.worldToLocal(a))}steerTargetTo(e,t,a){for(let i=0;i<2;i++){const s=this.virtualCameraAt(this.targetSpherical),o=this.pickGlobe(e,t,new M,s);if(!o)return!1;const r=o.sub(this.orbitPivot).normalize(),c=a.clone().sub(this.orbitPivot).normalize(),n=new Se().setFromUnitVectors(r,c),h=this.targetSpherical.radius,m=new M().setFromSpherical(this.targetSpherical).applyQuaternion(n);this.targetSpherical.setFromVector3(m),this.targetSpherical.radius=h,this.targetSpherical.phi=Math.max(.02,Math.min(Math.PI-.02,this.targetSpherical.phi)),this.makeSphericalContinuous()}return!0}grabSurface(e,t){if(!this.grabLocal||!this.focusedObject||!(this.altitudeInRadii()<3))return!1;this.focusedObject.updateWorldMatrix(!0,!1);const a=this.focusedObject.localToWorld(this.grabLocal.clone());return this.steerTargetTo(e,t,a),!0}zoomTowardCursor(e,t,a,i){if(!(this.altitudeInRadii(a)<4))return;this.enterMapFraming();const s=this.pickGlobe(e,t,new M);if(!s)return;const o=this.targetSpherical.radius;this.targetSpherical.radius=i,this.steerTargetTo(e,t,s)||(this.targetSpherical.radius=o),this.targetSpherical.radius=i}setupEventListeners(e){this.domElement=e,e&&e.addEventListener&&(e.addEventListener("mousedown",this.onMouseDown),e.addEventListener("wheel",this.onWheel,{passive:!1}),e.addEventListener("contextmenu",this.onContextMenu),e.addEventListener("touchstart",this.onTouchStart,{passive:!0}),e.addEventListener("dblclick",this.onDoubleClick)),typeof window<"u"&&(window.addEventListener("keydown",this.onKeyDown),window.addEventListener("keyup",this.onKeyUp),window.addEventListener("blur",this.onWindowBlur)),typeof window<"u"&&(window.addEventListener("mouseup",this.onMouseUp),window.addEventListener("mousemove",this.onMouseMove),window.addEventListener("touchmove",this.onTouchMove,{passive:!0}),window.addEventListener("touchend",this.onTouchEnd,{passive:!0}))}handleResize(e,t){this.camera.aspect=e/t,this.camera.updateProjectionMatrix()}dispose(){this.domElement&&this.domElement.removeEventListener&&(this.domElement.removeEventListener("mousedown",this.onMouseDown),this.domElement.removeEventListener("wheel",this.onWheel),this.domElement.removeEventListener("contextmenu",this.onContextMenu),this.domElement.removeEventListener("touchstart",this.onTouchStart),this.domElement.removeEventListener("dblclick",this.onDoubleClick)),typeof window<"u"&&(window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("keyup",this.onKeyUp),window.removeEventListener("blur",this.onWindowBlur),window.removeEventListener("mouseup",this.onMouseUp),window.removeEventListener("mousemove",this.onMouseMove),window.removeEventListener("touchmove",this.onTouchMove),window.removeEventListener("touchend",this.onTouchEnd))}};d(ce,"ORIGIN_VEC",new M(0,0,0)),d(ce,"LOOK_KEY_RATE",.9),d(ce,"MAX_LOOK_PITCH",R.degToRad(80)),d(ce,"LOOK_KEYS",new Set(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"]));let Vt=ce;const ve=class ve{constructor(e=Date.now()){d(this,"currentUtcMs");d(this,"lastPerfTimeMs");d(this,"isPaused",!1);d(this,"timeMultiplier",1);this.currentUtcMs=e,this.lastPerfTimeMs=performance.now()}update(e=performance.now()){const t=e-this.lastPerfTimeMs;if(this.lastPerfTimeMs=e,!this.isPaused&&t>0){const a=t*this.timeMultiplier;this.currentUtcMs+=a}return this.currentUtcMs}getUtcMs(){return this.currentUtcMs}setUtcMs(e){this.currentUtcMs=e,this.lastPerfTimeMs=performance.now()}getIsoString(){return new Date(this.currentUtcMs).toISOString()}getJulianDate(){return ve.utcMsToJulianDate(this.currentUtcMs)}getJulianDateTDB(){return ve.utcMsToJulianDate(this.currentUtcMs)+ve.TT_MINUS_UTC_SECONDS/86400}getJulianCenturiesJ2000(){return(this.getJulianDateTDB()-ve.J2000_JD)/36525}static utcMsToJulianDate(e){return e/864e5+24405875e-1}static julianDateToUtcMs(e){return(e-24405875e-1)*864e5}resetToJ2000(){this.setUtcMs(ve.J2000_UTC_MS)}resetToNow(){this.setUtcMs(Date.now())}};d(ve,"J2000_JD",2451545),d(ve,"J2000_UTC_MS",946727935816),d(ve,"TT_MINUS_UTC_SECONDS",69.184);let we=ve;const ee=class ee{static solveKepler(e,t,a=1e-12,i=25){const s=Math.PI*2;e=(e%s+s)%s,e>Math.PI&&(e-=s);let o;if(t<.18)o=e+t*Math.sin(e);else{const r=e<0?-1:1;o=e+r*.85*t}for(let r=0;r<i;r++){const c=o-t*Math.sin(o)-e;if(Math.abs(c)<a)return o;const n=1-t*Math.cos(o);if(Math.abs(n)<1e-15)break;const h=c/n;if(o-=h,Math.abs(h)<a)return o}return o}static elementsAt(e,t,a=ee.GM_SUN){const i=(e.epochJd??ee.J2000_JD)-ee.J2000_JD,s=t-i,o=Math.PI/180,r=e.ratesPerCentury;if(r){const h=s/ee.DAYS_PER_CENTURY;return{a:(e.semiMajorAxisAU+r.semiMajorAxisAU*h)*ee.AU_KM,e:e.eccentricity+r.eccentricity*h,iDeg:e.inclinationDeg+r.inclinationDeg*h,nodeDeg:e.longitudeAscendingNodeDeg+r.longitudeAscendingNodeDeg*h,argPeriDeg:e.argumentPeriapsisDeg+r.argumentPeriapsisDeg*h,meanAnomalyRad:(e.meanAnomalyAtEpochDeg+r.meanAnomalyDeg*h)*o}}const c=e.semiMajorAxisKm,n=e.meanMotionDegPerDay!==void 0?e.meanMotionDegPerDay*o:Math.sqrt(a/(c*c*c))*86400;return{a:c,e:e.eccentricity,iDeg:e.inclinationDeg,nodeDeg:e.longitudeAscendingNodeDeg+(e.nodeRateDegPerDay??0)*s,argPeriDeg:e.argumentPeriapsisDeg+(e.periapsisArgRateDegPerDay??0)*s,meanAnomalyRad:e.meanAnomalyAtEpochDeg*o+n*s}}static propagate(e,t,a=ee.GM_SUN){if(e.semiMajorAxisKm<=0)return{positionKm:[0,0,0],velocityKmPerSec:[0,0,0],trueAnomalyDeg:0,eccentricAnomalyDeg:0,distanceKm:0,speedKmPerSec:0};const i=ee.elementsAt(e,t,a),s=i.a,o=i.e,r=ee.solveKepler(i.meanAnomalyRad,o),c=Math.sin(r),n=Math.cos(r),h=Math.sqrt(1-o*o)*c/(1-o*n),m=(n-o)/(1-o*n),p=Math.atan2(h,m),f=s*(1-o*n),g=s*(n-o),v=s*Math.sqrt(1-o*o)*c,S=Math.sqrt(a*s)/f,x=-S*c,b=S*Math.sqrt(1-o*o)*n,{P:D,Q:P}=ee.perifocalBasis(i.iDeg,i.argPeriDeg,i.nodeDeg),w=[g*D[0]+v*P[0],g*D[1]+v*P[1],g*D[2]+v*P[2]],y=[x*D[0]+b*P[0],x*D[1]+b*P[1],x*D[2]+b*P[2]],[T,k,N]=w,[j,G,ne]=y,O=Math.sqrt(j*j+G*G+ne*ne);return{positionKm:[T,k,N],velocityKmPerSec:[j,G,ne],trueAnomalyDeg:(p*180/Math.PI%360+360)%360,eccentricAnomalyDeg:(r*180/Math.PI%360+360)%360,distanceKm:f,speedKmPerSec:O}}static perifocalBasis(e,t,a){const i=e*Math.PI/180,s=t*Math.PI/180,o=a*Math.PI/180,r=Math.cos(o),c=Math.sin(o),n=Math.cos(i),h=Math.sin(i),m=Math.cos(s),p=Math.sin(s);return{P:[r*m-c*p*n,c*m+r*p*n,p*h],Q:[-r*p-c*m*n,-c*p+r*m*n,m*h]}}static sampleOrbitPath(e,t=128,a=0){const i=[];if(e.semiMajorAxisKm<=0)return i;const s=ee.elementsAt(e,a),o=s.a,r=s.e,c=o*Math.sqrt(Math.max(0,1-r*r)),{P:n,Q:h}=ee.perifocalBasis(s.iDeg,s.argPeriDeg,s.nodeDeg);for(let m=0;m<=t;m++){const p=m/t*Math.PI*2,f=o*(Math.cos(p)-r),g=c*Math.sin(p),v=[f*n[0]+g*h[0],f*n[1]+g*h[1],f*n[2]+g*h[2]];i.push(v)}return i}};d(ee,"GM_SUN",1327124400419394e-4),d(ee,"DAYS_PER_CENTURY",36525),d(ee,"AU_KM",1495978707e-1),d(ee,"J2000_JD",2451545);let pe=ee;class yi{static createOrbitLine(e,t,a=0,i=180){if(e.orderFromSun===0||e.orbit.semiMajorAxisKm<=0)return null;const o=pe.sampleOrbitPath(e.orbit,i,a).map(h=>{const m=t.toRenderPosition(h,e);return new M(m[0],m[1],m[2])}),r=new Z().setFromPoints(o),c=new Ze({color:new I(e.physical.colorHex||"#555566"),transparent:!0,opacity:e.category==="planet"?.3:.18,linewidth:1}),n=new _e(r,c);return n.name=`kepler_orbit_${e.name}`,n}static createMoonOrbitLine(e,t,a,i=0,s=96){if(e.orbit.semiMajorAxisKm<=0)return null;const r=pe.sampleOrbitPath(e.orbit,s,i).map(m=>{const p=a.toMoonRenderPosition(m,e,[0,0,0],t);return new M(p[0],p[1],p[2])}),c=new Z().setFromPoints(r),n=new Ze({color:new I(e.physical.colorHex||"#778899"),transparent:!0,opacity:.2,linewidth:1}),h=new _e(c,n);return h.name=`kepler_moon_orbit_${e.name}`,h}}function Gs(l=19890825){let e=l>>>0;return function(){let t=e+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}}class Hs{constructor(e,t=19890825){d(this,"mesh");d(this,"count",3200);d(this,"elements",[]);d(this,"dummy",new La);d(this,"transform");d(this,"seed");this.transform=e,this.seed=t;const a=new ja(.35,1),i=a.attributes.position;for(let o=0;o<i.count;o++){const r=i.getX(o),c=i.getY(o),n=i.getZ(o),h=1+.22*Math.sin(r*5)*Math.cos(c*5+n*3);i.setXYZ(o,r*h,c*h,n*h)}a.computeVertexNormals();const s=new Fa({roughness:.88,metalness:.12,vertexColors:!0});this.mesh=new Ua(a,s,this.count),this.mesh.name="asteroid_belt_instanced",this.mesh.castShadow=!1,this.mesh.receiveShadow=!1,this.generateElements(),this.updatePositions(0)}generateElements(){const e=Gs(this.seed),t=[{au:2.5,width:.045},{au:2.82,width:.04},{au:2.96,width:.035},{au:3.27,width:.05}],a=[];let i=0;for(;i<this.count;){const s=2.12+e()*1.16;let o=!1;for(const x of t)if(Math.abs(s-x.au)<x.width&&e()<.88){o=!0;break}if(o)continue;const r=.03+e()*.19,c=e()*e()*18,n=R.degToRad(c),h=e()*Math.PI*2,m=e()*Math.PI*2,p=e()*Math.PI*2,f=Math.pow(s,1.5)*365.25,g=Math.PI*2/f,v=.12+e()*.22;this.elements.push({semiMajorAxisAU:s,eccentricity:r,inclinationRad:n,longNodeRad:h,argPeriRad:m,meanAnomalyEpochRad:p,meanMotionRadPerDay:g,scale:v});const S=e();if(S<.7){const x=.28+e()*.18;a.push(new I(x*.95,x*.92,x*.88))}else if(S<.9){const x=.45+e()*.22;a.push(new I(x*1.05,x*.95,x*.8))}else{const x=.55+e()*.25;a.push(new I(x,x*.95,x*.9))}i++}for(let s=0;s<a.length;s++)this.mesh.setColorAt(s,a[s]);this.mesh.instanceColor&&(this.mesh.instanceColor.needsUpdate=!0)}updatePositions(e){const t=this.transform.mode==="scientific";for(let a=0;a<this.elements.length;a++){const i=this.elements[a],s=(i.meanAnomalyEpochRad+i.meanMotionRadPerDay*e)%(Math.PI*2),o=pe.solveKepler(s,i.eccentricity,1e-8,12),r=2*Math.atan2(Math.sqrt(1+i.eccentricity)*Math.sin(o/2),Math.sqrt(1-i.eccentricity)*Math.cos(o/2)),c=i.semiMajorAxisAU*(1-i.eccentricity*i.eccentricity)/(1+i.eccentricity*Math.cos(r)),n=r+i.argPeriRad,h=Math.cos(n),m=Math.sin(n),p=Math.cos(i.longNodeRad),f=Math.sin(i.longNodeRad),g=Math.cos(i.inclinationRad),v=Math.sin(i.inclinationRad),S=c,x=S*(p*h-f*m*g),b=S*(f*h+p*m*g),D=S*(m*v);let P,w,y;if(t){const k=Pe.AU_KM/Pe.SCIENTIFIC_KM_PER_UNIT;P=x*k,w=D*k,y=-b*k}else{const k=$t(c),N=Math.sqrt(x*x+b*b+D*D);P=x/N*k,w=D/N*k,y=-(b/N)*k}this.dummy.position.set(P,w,y);const T=i.scale*(t?.5:1);this.dummy.scale.set(T,T,T),this.dummy.rotation.set(s*2,s*3.5,s*1.5),this.dummy.updateMatrix(),this.mesh.setMatrixAt(a,this.dummy.matrix)}this.mesh.instanceMatrix.needsUpdate=!0}setVisible(e){this.mesh.visible=e}isVisible(){return this.mesh.visible}dispose(){this.mesh.geometry.dispose(),this.mesh.material.dispose()}}const oa={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class He{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const Vs=new _a(-1,1,1,-1,0,1);class Ws extends Z{constructor(){super(),this.setAttribute("position",new ze([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new ze([0,2,0,0,2,0],2))}}const Ys=new Ws;class Qt{constructor(e){this._mesh=new z(Ys,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,Vs)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class ra extends He{constructor(e,t){super(),this.textureID=t!==void 0?t:"tDiffuse",e instanceof L?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=bt.clone(e.uniforms),this.material=new L({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new Qt(this.material)}render(e,t,a){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=a.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class bi extends He{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,a){const i=e.getContext(),s=e.state;s.buffers.color.setMask(!1),s.buffers.depth.setMask(!1),s.buffers.color.setLocked(!0),s.buffers.depth.setLocked(!0);let o,r;this.inverse?(o=0,r=1):(o=1,r=0),s.buffers.stencil.setTest(!0),s.buffers.stencil.setOp(i.REPLACE,i.REPLACE,i.REPLACE),s.buffers.stencil.setFunc(i.ALWAYS,o,4294967295),s.buffers.stencil.setClear(r),s.buffers.stencil.setLocked(!0),e.setRenderTarget(a),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),s.buffers.color.setLocked(!1),s.buffers.depth.setLocked(!1),s.buffers.color.setMask(!0),s.buffers.depth.setMask(!0),s.buffers.stencil.setLocked(!1),s.buffers.stencil.setFunc(i.EQUAL,1,4294967295),s.buffers.stencil.setOp(i.KEEP,i.KEEP,i.KEEP),s.buffers.stencil.setLocked(!0)}}class Js extends He{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class qs{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const a=e.getSize(new te);this._width=a.width,this._height=a.height,t=new Xe(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Qe}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new ra(oa),this.copyPass.material.blending=za,this.clock=new Ka}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let a=!1;for(let i=0,s=this.passes.length;i<s;i++){const o=this.passes[i];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(i),o.render(this.renderer,this.writeBuffer,this.readBuffer,e,a),o.needsSwap){if(a){const r=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(r.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),c.setFunc(r.EQUAL,1,4294967295)}this.swapBuffers()}bi!==void 0&&(o instanceof bi?a=!0:o instanceof Js&&(a=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new te);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const a=this._width*this._pixelRatio,i=this._height*this._pixelRatio;this.renderTarget1.setSize(a,i),this.renderTarget2.setSize(a,i);for(let s=0;s<this.passes.length;s++)this.passes[s].setSize(a,i)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class $s extends He{constructor(e,t,a=null,i=null,s=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=a,this.clearColor=i,this.clearAlpha=s,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new I}render(e,t,a){const i=e.autoClear;e.autoClear=!1;let s,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(s=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:a),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(s),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),e.autoClear=i}}const Xs={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new I(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class Be extends He{constructor(e,t,a,i){super(),this.strength=t!==void 0?t:1,this.radius=a,this.threshold=i,this.resolution=e!==void 0?new te(e.x,e.y):new te(256,256),this.clearColor=new I(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let s=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new Xe(s,o,{type:Qe}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let m=0;m<this.nMips;m++){const p=new Xe(s,o,{type:Qe});p.texture.name="UnrealBloomPass.h"+m,p.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(p);const f=new Xe(s,o,{type:Qe});f.texture.name="UnrealBloomPass.v"+m,f.texture.generateMipmaps=!1,this.renderTargetsVertical.push(f),s=Math.round(s/2),o=Math.round(o/2)}const r=Xs;this.highPassUniforms=bt.clone(r.uniforms),this.highPassUniforms.luminosityThreshold.value=i,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new L({uniforms:this.highPassUniforms,vertexShader:r.vertexShader,fragmentShader:r.fragmentShader}),this.separableBlurMaterials=[];const c=[3,5,7,9,11];s=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let m=0;m<this.nMips;m++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(c[m])),this.separableBlurMaterials[m].uniforms.invSize.value=new te(1/s,1/o),s=Math.round(s/2),o=Math.round(o/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const n=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=n,this.bloomTintColors=[new M(1,1,1),new M(1,1,1),new M(1,1,1),new M(1,1,1),new M(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const h=oa;this.copyUniforms=bt.clone(h.uniforms),this.blendMaterial=new L({uniforms:this.copyUniforms,vertexShader:h.vertexShader,fragmentShader:h.fragmentShader,blending:q,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new I,this.oldClearAlpha=1,this.basic=new qt,this.fsQuad=new Qt(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(e,t){let a=Math.round(e/2),i=Math.round(t/2);this.renderTargetBright.setSize(a,i);for(let s=0;s<this.nMips;s++)this.renderTargetsHorizontal[s].setSize(a,i),this.renderTargetsVertical[s].setSize(a,i),this.separableBlurMaterials[s].uniforms.invSize.value=new te(1/a,1/i),a=Math.round(a/2),i=Math.round(i/2)}render(e,t,a,i,s){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();const o=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),s&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=a.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=a.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let r=this.renderTargetBright;for(let c=0;c<this.nMips;c++)this.fsQuad.material=this.separableBlurMaterials[c],this.separableBlurMaterials[c].uniforms.colorTexture.value=r.texture,this.separableBlurMaterials[c].uniforms.direction.value=Be.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[c]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[c].uniforms.colorTexture.value=this.renderTargetsHorizontal[c].texture,this.separableBlurMaterials[c].uniforms.direction.value=Be.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[c]),e.clear(),this.fsQuad.render(e),r=this.renderTargetsVertical[c];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,s&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(a),this.fsQuad.render(e)),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=o}getSeperableBlurMaterial(e){const t=[];for(let a=0;a<e;a++)t.push(.39894*Math.exp(-.5*a*a/(e*e))/e);return new L({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new te(.5,.5)},direction:{value:new te(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
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
				}`})}getCompositeMaterial(e){return new L({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
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
				}`})}}Be.BlurDirectionX=new te(1,0);Be.BlurDirectionY=new te(0,1);const Qs={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class Zs extends He{constructor(){super();const e=Qs;this.uniforms=bt.clone(e.uniforms),this.material=new Ba({name:e.name,uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader}),this.fsQuad=new Qt(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,a){this.uniforms.tDiffuse.value=a.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},Ga.getTransfer(this._outputColorSpace)===Ha&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Va?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Wa?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Ya?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Ki?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Ja?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===qa&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}const St={cinematic:{name:"cinematic",label:"Cinematic",distortion:.1,fisheyeMask:0,chromatic:.0035,edgeBlur:2.2,vignette:.42,grain:.016,shutter:0,bloomStrength:.4,bloomRadius:.55,bloomThreshold:.9},fisheye:{name:"fisheye",label:"Fisheye",distortion:.55,fisheyeMask:1.12,chromatic:.007,edgeBlur:4.5,vignette:.6,grain:.03,shutter:0,bloomStrength:.48,bloomRadius:.6,bloomThreshold:.88},clean:{name:"clean",label:"Clean",distortion:0,fisheyeMask:0,chromatic:0,edgeBlur:0,vignette:0,grain:0,shutter:0,bloomStrength:0,bloomRadius:0,bloomThreshold:1}},vt=["cinematic","fisheye","clean"];function eo(l,e,t,a){if(a===0)return[l,e];const i=(l*l+e*e)/(t*t+1),s=(1+a*i)/(1+a);return[l*s,e*s]}const to={uniforms:{tDiffuse:{value:null},uResolution:{value:new te(1,1)},uTime:{value:0},uDistortion:{value:0},uFisheyeMask:{value:0},uChromatic:{value:0},uEdgeBlur:{value:0},uVignette:{value:0},uGrain:{value:0},uShutter:{value:0},uCurrInvViewProj:{value:new ye},uPrevViewProj:{value:new ye}},vertexShader:`
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
  `};class io{constructor(e,t,a){d(this,"profile",St.cinematic);d(this,"renderer");d(this,"scene");d(this,"camera");d(this,"composer");d(this,"bloomPass");d(this,"lensPass");d(this,"prevViewProj",new ye);d(this,"hasPrev",!1);d(this,"tmpView",new ye);d(this,"tmpViewProj",new ye);d(this,"reducedMotion",!1);d(this,"effectScale",1);d(this,"bloomThresholdOverride",null);this.renderer=e,this.scene=t,this.camera=a;const i=e.getSize(new te),s=new Xe(i.x,i.y,{type:Qe});this.composer=new qs(e,s),this.composer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5)),this.composer.addPass(new $s(t,a)),this.bloomPass=new Be(new te(i.x,i.y),.4,.5,.85),this.composer.addPass(this.bloomPass),this.composer.addPass(new Zs),this.lensPass=new ra(to),this.composer.addPass(this.lensPass),typeof window<"u"&&window.matchMedia&&(this.reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches),this.setSize(i.x,i.y),this.setProfile("cinematic")}setEffectScale(e){const t=R.clamp(e,0,1);Math.abs(t-this.effectScale)<.001||(this.effectScale=t,this.applyProfileUniforms())}applyProfileUniforms(){const e=this.effectScale,t=this.lensPass.uniforms;t.uDistortion.value=this.profile.distortion*e,t.uFisheyeMask.value=e>.5?this.profile.fisheyeMask:0,t.uChromatic.value=this.profile.chromatic*e,t.uEdgeBlur.value=this.profile.edgeBlur*e,t.uVignette.value=this.profile.vignette*(.35+.65*e),t.uGrain.value=this.profile.grain*e,this.bloomPass.strength=this.profile.bloomStrength*e,this.bloomPass.threshold=this.bloomThresholdOverride??this.profile.bloomThreshold}setBloomThreshold(e){e!==this.bloomThresholdOverride&&(this.bloomThresholdOverride=e,this.applyProfileUniforms())}setProfile(e){this.profile=St[e];const t=this.lensPass.uniforms;this.applyProfileUniforms(),t.uShutter.value=this.reducedMotion?0:this.profile.shutter,this.bloomPass.radius=this.profile.bloomRadius,this.applyProfileUniforms(),this.hasPrev=!1}cycleProfile(){const e=vt[(vt.indexOf(this.profile.name)+1)%vt.length];return this.setProfile(e),e}setSize(e,t){this.composer.setSize(e,t);const a=Math.min(window.devicePixelRatio||1,1.5);this.lensPass.uniforms.uResolution.value.set(e*a,t*a)}outputToSceneNdc(e,t,a){const[i,s]=eo(e*a,t,a,this.profile.distortion*this.effectScale);return[i/a,s]}isMasked(e,t,a){return this.profile.fisheyeMask<=0||this.effectScale<=.5?!1:Math.hypot(e*a,t)>this.profile.fisheyeMask}render(e){if(this.profile.name==="clean"){this.renderer.render(this.scene,this.camera),this.hasPrev=!1;return}this.camera.updateMatrixWorld(),this.tmpView.copy(this.camera.matrixWorldInverse).setPosition(0,0,0),this.tmpViewProj.multiplyMatrices(this.camera.projectionMatrix,this.tmpView);const t=this.lensPass.uniforms;t.uCurrInvViewProj.value.copy(this.tmpViewProj).invert(),t.uPrevViewProj.value.copy(this.hasPrev?this.prevViewProj:this.tmpViewProj),t.uTime.value=e,this.composer.render(),this.prevViewProj.copy(this.tmpViewProj),this.hasPrev=!0}dispose(){var e,t;this.composer.dispose(),this.bloomPass.dispose(),(t=(e=this.lensPass).dispose)==null||t.call(e)}}const Et=1e3;function ao(l,e,t){return l.level0TileDeg/Math.pow(2,e)/l.tileSize*Math.PI/180*t*Et}const wi=(l,e,t)=>`https://trek.nasa.gov/tiles/${l}/EQ/${e}/1.0.0/default/default028mm/{z}/{y}/{x}.${t}`,ut={tileSize:256,level0TileDeg:180,minLevel:0},na={Earth:{body:"Earth",provider:{kind:"wmts",template:"https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless/default/WGS84/{z}/{y}/{x}.jpg",...ut,maxLevel:13},kind:"visible",title:"Sentinel-2 cloudless (2016, 10 m)",source:"EOX Sentinel-2 cloudless · Copernicus Sentinel-2",sourceUrl:"https://s2maps.eu",attribution:"Sentinel-2 cloudless – https://s2maps.eu by EOX IT Services GmbH (Contains modified Copernicus Sentinel data 2016), CC BY 4.0",bestMetresPerPixel:0,coverage:"Global cloud-free true-colour mosaic of the land; oceans are filled in by EOX"},Moon:{body:"Moon",provider:{kind:"wmts",template:wi("Moon","Kaguya_TCortho_Mosaic_Global_4096ppd","png"),...ut,maxLevel:10},kind:"monochrome",title:"SELENE/Kaguya Terrain Camera ortho mosaic",source:"NASA Moon Trek · JAXA SELENE (Kaguya) Terrain Camera",sourceUrl:"https://trek.nasa.gov/moon/",attribution:"JAXA/SELENE Terrain Camera via NASA Solar System Treks",bestMetresPerPixel:0,coverage:"Global monochrome mosaic; Trek serves it down to level 10 (≈21 m/px)"},Mercury:{body:"Mercury",provider:{kind:"wmts",template:wi("Mercury","Mercury_MESSENGER_MDIS_Basemap_BDR_Mosaic_Global_166m","jpg"),...ut,maxLevel:7},kind:"monochrome",title:"MESSENGER MDIS basemap (BDR, 166 m)",source:"NASA Mercury Trek · MESSENGER MDIS",sourceUrl:"https://trek.nasa.gov/mercury/",attribution:"NASA/JHUAPL/Carnegie Institution of Washington via NASA Solar System Treks",bestMetresPerPixel:0,coverage:"Global monochrome mosaic"},Venus:{body:"Venus",provider:{kind:"wms",template:"https://planetarymaps.usgs.gov/cgi-bin/mapserv?map=/maps/venus/venus_simp_cyl.map&service=WMS&version=1.1.1&request=GetMap&layers=MAGELLAN&styles=&srs=EPSG:4326&bbox={bbox}&width={size}&height={size}&format=image/jpeg",tileSize:256,level0TileDeg:180,minLevel:0,maxLevel:8},kind:"radar",title:"Magellan SAR radar mosaic",source:"USGS Astrogeology planetary WMS · NASA Magellan",sourceUrl:"https://planetarymaps.usgs.gov/",attribution:"NASA/JPL Magellan via USGS Astrogeology",bestMetresPerPixel:0,coverage:"Radar backscatter of the surface beneath the clouds — not a visible-light view",note:"Zoom is capped at level 8; the WMS resamples the mosaic and its native resolution was not verified."},Mars:{body:"Mars",provider:{kind:"wmts",template:"https://astro.arcgis.com/arcgis/rest/services/OnMars/CTX/MapServer/tile/{z}/{y}/{x}",...ut,maxLevel:12,colorize:!0},kind:"visible",title:"MRO CTX global mosaic (Caltech Murray Lab), tinted",source:"NASA Mars Trek · MRO Context Camera mosaic",sourceUrl:"https://trek.nasa.gov/mars/",attribution:"NASA/JPL/MSSS, Caltech Murray Lab CTX mosaic via NASA Solar System Treks / Esri",bestMetresPerPixel:0,coverage:"Near-global greyscale mosaic (beta, uncontrolled); colour comes from the global Mars map",note:"The CTX camera is monochrome: detail is CTX, hue is borrowed from the global colour map."},Jupiter:{body:"Jupiter",provider:null,kind:"atmosphere",title:"Global cloud-top map (2048 px)",source:"Solar System Scope (NASA Cassini/Juno imagery)",sourceUrl:"https://www.solarsystemscope.com/textures/",attribution:"Solar System Scope, CC BY 4.0",bestMetresPerPixel:0,coverage:"Cloud tops only — a gas giant has no solid surface to map",note:"No higher-resolution streaming map was verified; zoom stops at the globe map resolution."},Saturn:{body:"Saturn",provider:null,kind:"atmosphere",title:"Global cloud-top map (2048 px)",source:"Solar System Scope (NASA Cassini imagery)",sourceUrl:"https://www.solarsystemscope.com/textures/",attribution:"Solar System Scope, CC BY 4.0",bestMetresPerPixel:0,coverage:"Cloud tops only — a gas giant has no solid surface to map",note:"No higher-resolution streaming map was verified; zoom stops at the globe map resolution."},Uranus:{body:"Uranus",provider:null,kind:"atmosphere",title:"Global map (2048 px)",source:"Solar System Scope (Voyager 2-based, largely representative)",sourceUrl:"https://www.solarsystemscope.com/textures/",attribution:"Solar System Scope, CC BY 4.0",bestMetresPerPixel:0,coverage:"Low-detail representative cloud map",note:"Uranus has never been mapped at high resolution."},Neptune:{body:"Neptune",provider:null,kind:"atmosphere",title:"Global map (2048 px)",source:"Solar System Scope (Voyager 2-based, largely representative)",sourceUrl:"https://www.solarsystemscope.com/textures/",attribution:"Solar System Scope, CC BY 4.0",bestMetresPerPixel:0,coverage:"Low-detail representative cloud map",note:"Neptune has never been mapped at high resolution."}},so={Earth:6371,Moon:1737.4,Mercury:2439.7,Venus:6051.8,Mars:3389.5,Jupiter:69911,Saturn:58232,Uranus:25362,Neptune:24622};for(const l of Object.values(na)){const e=so[l.body];l.bestMetresPerPixel=l.provider?ao(l.provider,l.provider.maxLevel,e):2*Math.PI*e*Et/2048}const Mi=new Map;function Si(l,e){const t=na[l];if(t)return t;if(!e||l==="Sun")return null;let a=Mi.get(l);return a||(a={body:l,provider:null,kind:"monochrome",title:"Illustrative global map",source:"SOLARIS procedural texture",sourceUrl:"https://ssd.jpl.nasa.gov/",attribution:"Procedural (no real map bundled)",bestMetresPerPixel:2*Math.PI*e*Et/1024,coverage:"No real global map of this body is bundled; the surface texture is illustrative",note:"Positions, sizes and lighting of everything in its sky are computed from real ephemerides."},Mi.set(l,a)),a}function oo(l,e,t=1e3){const a=t/(2*Math.tan(e*Math.PI/360));return l.bestMetresPerPixel*a/2/Et}const mt=l=>`${l.z}/${l.y}/${l.x}`;function Zt(l,e){return l.level0TileDeg/Math.pow(2,e)}function la(l,e){const t=Zt(l,e);return{cols:Math.ceil(360/t-1e-9),rows:Math.ceil(180/t-1e-9)}}function Nt(l,e){const t=Zt(l,e.z),a=-180+e.x*t,i=90-e.y*t,s=a+t,o=i-t;return{west:a,east:s,north:i,south:o,clipWest:Math.max(-180,a),clipEast:Math.min(180,s),clipNorth:Math.min(90,i),clipSouth:Math.max(-90,o)}}function ro(l,e){if(e.z<l.minLevel||e.z>l.maxLevel)return!1;const{cols:t,rows:a}=la(l,e.z);return e.x>=0&&e.y>=0&&e.x<t&&e.y<a}function no(l){const{cols:e,rows:t}=la(l,l.minLevel),a=[];for(let i=0;i<t;i++)for(let s=0;s<e;s++)a.push({z:l.minLevel,x:s,y:i});return a}function lo(l,e){const t=[];for(let a=0;a<2;a++)for(let i=0;i<2;i++){const s={z:e.z+1,x:e.x*2+i,y:e.y*2+a};ro(l,s)&&ca(l,s)&&t.push(s)}return t}function pt(l){return l.z===0?null:{z:l.z-1,x:Math.floor(l.x/2),y:Math.floor(l.y/2)}}function ca(l,e){const t=Nt(l,e);return t.clipEast>t.clipWest&&t.clipNorth>t.clipSouth}const it=Math.PI/180;function Ge(l,e){const t=l*it,a=e*it;return[Math.cos(t)*Math.cos(a),Math.sin(t),-Math.cos(t)*Math.sin(a)]}function ha(l,e,t){const a=Math.hypot(l,e,t)||1;return{lat:Math.asin(Math.max(-1,Math.min(1,e/a)))/it,lon:Math.atan2(-t,l)/it}}function co(l,e){const t=Nt(l,e),a=(t.clipNorth+t.clipSouth)/2,i=(t.clipWest+t.clipEast)/2,s=Ge(a,i);let o=0;const r=[[t.clipNorth,t.clipWest],[t.clipNorth,t.clipEast],[t.clipSouth,t.clipWest],[t.clipSouth,t.clipEast],[t.clipNorth,i],[t.clipSouth,i],[a,t.clipWest],[a,t.clipEast]];t.clipNorth>0&&t.clipSouth<0&&r.push([0,t.clipWest],[0,t.clipEast]);for(const[c,n]of r){const h=Ge(c,n),m=Math.acos(Math.max(-1,Math.min(1,h[0]*s[0]+h[1]*s[1]+h[2]*s[2])));o=Math.max(o,m)}return{centre:s,radius:o}}function ho(l,e){return Zt(l,e)/l.tileSize*it}function uo(l,e,t=1.3,a=160){const[i,s,o]=e.position,r=Math.hypot(i,s,o);if(r<=1)return[];const c=[i/r,s/r,o/r],n=Math.acos(Math.min(1,1/r)),h=[],m=no(l).filter(p=>ca(l,p));for(;m.length>0;){const p=m.pop(),{centre:f,radius:g}=co(l,p),v=Math.acos(Math.max(-1,Math.min(1,f[0]*c[0]+f[1]*c[1]+f[2]*c[2])));if(v-g>n+.02||e.isCapVisible&&!e.isCapVisible(f,g))continue;const S=Math.max(0,v-g),x=Math.sqrt(Math.max(1e-12,r*r+1-2*r*Math.cos(S))),b=ho(l,p.z)/x*e.pixelsPerRadian,D=p.z<l.maxLevel?lo(l,p):[];b>t&&D.length>0&&h.length+m.length<a*4?m.push(...D):h.push({k:p,dist:x})}return h.sort((p,f)=>p.dist-f.dist),h.slice(0,a).map(p=>p.k)}function mo(l,e){const t=Nt(l,e);return`${t.west},${t.south},${t.east},${t.north}`}const po={load(l,e,t){const a=new Image;return a.crossOrigin="anonymous",a.decoding="async",a.onload=()=>e(a),a.onerror=()=>t(),a.src=l,a}},Ie=1.0001,go=6,Pi=220,fo=3,vo=8,xo=`
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying vec3 vWorldNormal;
  varying vec3 vViewPosition;
  void main() {
    vUv = uv;
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    // modelViewMatrix is composed in double precision on the CPU, so vertices stay steady even
    // a few hundred metres above a globe that sits far from the scene origin
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`,yo=`
  uniform sampler2D map;
  uniform sampler2D uBaseMap;
  uniform vec4 uBounds;       // nominal tile extent: west, south, east, north (degrees)
  uniform float uColorize;    // 1: luminance from the tile, hue from the global colour map
  uniform float uOpacity;
  uniform float uAmbient;
  uniform float uDaylight;    // 0: lit by the real Sun · 1: evenly lit, like a web map
  uniform vec3 uSunTint;      // sunlight colour after the atmosphere (surface view)
  uniform vec3 uHazeColor;
  uniform float uHazeDensity; // per view-space unit; aerial perspective near the ground
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying vec3 vWorldNormal;
  varying vec3 vViewPosition;

  float luma(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }

  void main() {
    vec4 tex = texture2D(map, vUv);
    vec3 col = tex.rgb;
    if (uColorize > 0.5) {
      float lon = mix(uBounds.x, uBounds.z, vUv.x);
      float lat = mix(uBounds.y, uBounds.w, vUv.y);
      vec3 base = texture2D(uBaseMap, vec2((lon + 180.0) / 360.0, (lat + 90.0) / 180.0)).rgb;
      col = clamp(base * (luma(tex.rgb) / max(luma(base), 0.03)), 0.0, 1.0);
    }
    vec3 sunDir = normalize(-vWorldPosition);
    float ndl = dot(normalize(vWorldNormal), sunDir);
    vec3 sunlit = uSunTint * (smoothstep(-0.08, 0.35, ndl) * 1.1) + vec3(uAmbient);
    vec3 light = mix(sunlit, vec3(1.0), uDaylight);
    col *= light;
    if (uHazeDensity > 0.0) {
      float h = 1.0 - exp(-length(vViewPosition) * uHazeDensity);
      col = mix(col, uHazeColor, clamp(h, 0.0, 1.0));
    }
    gl_FragColor = vec4(col, tex.a * uOpacity);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;class bo{constructor(e,t=po){d(this,"group",new he);d(this,"provider");d(this,"loader");d(this,"tiles",new Map);d(this,"queue",[]);d(this,"inFlight",0);d(this,"consecutiveFailures",0);d(this,"disabled",!1);d(this,"everLoaded",!1);d(this,"shared",{uOpacity:{value:1},uAmbient:{value:.07},uDaylight:{value:0},uSunTint:{value:new M(1,1,1)},uColorize:{value:0},uBaseMap:{value:null},uHazeColor:{value:new I(0,0,0)},uHazeDensity:{value:0}});d(this,"anisotropy",8);d(this,"frame",0);d(this,"status",{state:"idle",inFlight:0,queued:0,cached:0,drawn:0,deepestLevel:-1,failures:0});this.provider=e,this.loader=t,this.group.name="surface_tile_layer"}setDaylight(e){this.shared.uDaylight.value=typeof e=="number"?e:e?1:0}setOpacity(e){this.shared.uOpacity.value=e,this.group.visible=e>.001}setBaseMap(e){this.shared.uBaseMap.value=e,this.shared.uColorize.value=e&&this.provider.kind==="wmts"&&this.provider.colorize?1:0}setHaze(e,t){this.shared.uHazeColor.value.copy(e),this.shared.uHazeDensity.value=t}setLighting(e,t){this.shared.uSunTint.value.set(e[0],e[1],e[2]),this.shared.uAmbient.value=t}setMaxAnisotropy(e){this.anisotropy=Math.max(1,e)}getStatus(){return{...this.status}}tileUrl(e){const t=this.provider;return t.kind==="wms"?t.template.replace("{bbox}",mo(t,e)).split("{size}").join(String(t.tileSize)):t.template.replace("{z}",String(e.z)).replace("{y}",String(e.y)).replace("{x}",String(e.x))}update(e){if(this.frame++,this.disabled){this.status={...this.status,state:"unavailable",inFlight:0,queued:0};return}const t=uo(this.provider,e),a=new Set;let i=-1;this.queue=[];const s=[];for(const c of t){const n=mt(c);a.add(n);let h=this.tiles.get(n);h||(h={key:c,id:n,state:"queued",attempts:0,lastWanted:this.frame,lastDrawn:0},this.tiles.set(n,h)),h.lastWanted=this.frame,h.state==="queued"&&s.push(h)}for(const c of t){const n=pt(c);if(!n)continue;const h=mt(n);if(a.has(h))continue;a.add(h);let m=this.tiles.get(h);m||(m={key:n,id:h,state:"queued",attempts:0,lastWanted:this.frame,lastDrawn:0},this.tiles.set(h,m)),m.lastWanted=this.frame,m.state==="queued"&&this.queue.push(m)}this.queue.push(...s);for(const c of this.tiles.values())c.state==="loading"&&!a.has(c.id)&&c.image&&(c.image.onload=null,c.image.onerror=null,c.image.src="",c.image=void 0,c.state="queued",this.inFlight--);this.pump();const o=new Set;for(const c of t){let n=c;for(;n;){const h=this.tiles.get(mt(n));if(h&&h.state==="loaded"){o.add(h.id),i=Math.max(i,n.z);break}n=pt(n)}}for(const c of[...o]){let n=pt(this.tiles.get(c).key);for(;n;)o.delete(mt(n)),n=pt(n)}for(const c of this.tiles.values()){const n=o.has(c.id);n&&!c.mesh&&c.texture&&(c.mesh=this.createMesh(c)),c.mesh&&(c.mesh.visible=n),n&&(c.lastDrawn=this.frame)}this.evict();const r=this.inFlight+this.queue.length;this.status={state:this.consecutiveFailures>=3?"degraded":r>0?"streaming":t.length>0?"ready":"idle",inFlight:this.inFlight,queued:this.queue.length,cached:[...this.tiles.values()].filter(c=>c.state==="loaded").length,drawn:o.size,deepestLevel:i,failures:this.consecutiveFailures}}hide(){for(const e of this.tiles.values())e.mesh&&(e.mesh.visible=!1);this.queue=[],this.status={...this.status,state:this.disabled?"unavailable":"idle",queued:0,drawn:0}}pump(){for(;this.inFlight<go&&this.queue.length>0;){const e=this.queue.shift();e.state==="queued"&&this.request(e)}}request(e){e.state="loading",e.attempts++,this.inFlight++;const t=this.tileUrl(e.key);e.image=this.loader.load(t,a=>{if(e.state!=="loading")return;this.inFlight--,e.image=void 0;const i=new Li(a);i.colorSpace=ke,i.wrapS=_,i.wrapT=_,i.minFilter=ft,i.anisotropy=this.anisotropy,i.needsUpdate=!0,e.texture=i,e.state="loaded",this.everLoaded=!0,this.consecutiveFailures=0,this.pump()},()=>{if(e.state==="loading"){if(this.inFlight--,e.image=void 0,e.attempts<fo?(e.state="queued",setTimeout(()=>{e.state==="queued"&&e.lastWanted>=this.frame-2&&(this.queue.unshift(e),this.pump())},400*Math.pow(2,e.attempts))):(e.state="missing",this.consecutiveFailures++,this.status.failures=this.consecutiveFailures),this.consecutiveFailures>=vo&&!this.everLoaded){this.disableProvider();return}this.pump()}})}disableProvider(){this.disabled=!0;for(const e of this.tiles.values())e.state==="loading"&&e.image&&(e.image.onload=null,e.image.onerror=null,e.image.src="",e.image=void 0),e.state!=="loaded"&&(e.state="missing");this.queue=[],this.inFlight=0,this.status={...this.status,state:"unavailable",inFlight:0,queued:0}}createMesh(e){const t=Nt(this.provider,e.key),a=Math.max(t.clipEast-t.clipWest,t.clipNorth-t.clipSouth),i=Math.max(4,Math.min(48,Math.ceil(a/1.5))),s=i,o=Math.max(2,Math.ceil(i*((t.clipNorth-t.clipSouth)/Math.max(1e-6,t.clipEast-t.clipWest)))),r=Math.min(48,o),c=[],n=[],h=[],m=[];for(let v=0;v<=r;v++){const S=t.clipNorth+(t.clipSouth-t.clipNorth)*(v/r);for(let x=0;x<=s;x++){const b=t.clipWest+(t.clipEast-t.clipWest)*(x/s),[D,P,w]=Ge(S,b);c.push(D*Ie,P*Ie,w*Ie),n.push(D,P,w),h.push((b-t.west)/(t.east-t.west),(S-t.south)/(t.north-t.south))}}for(let v=0;v<r;v++)for(let S=0;S<s;S++){const x=v*(s+1)+S,b=x+s+1;m.push(x,b,x+1,x+1,b,b+1)}const p=new Z;p.setAttribute("position",new ze(c,3)),p.setAttribute("normal",new ze(n,3)),p.setAttribute("uv",new ze(h,2)),p.setIndex(m),p.computeBoundingSphere();const f=new L({uniforms:{...this.shared,map:{value:e.texture},uBounds:{value:new $a(t.west,t.south,t.east,t.north)}},vertexShader:xo,fragmentShader:yo,transparent:!0,depthWrite:!0}),g=new z(p,f);return g.name=`tile_${e.id}`,g.renderOrder=1+e.key.z*.01,this.group.add(g),g}evict(){const e=[...this.tiles.values()].filter(t=>t.state==="loaded");if(!(e.length<=Pi)){e.sort((t,a)=>Math.max(t.lastDrawn,t.lastWanted)-Math.max(a.lastDrawn,a.lastWanted));for(const t of e.slice(0,e.length-Pi))t.lastDrawn===this.frame||t.key.z<=1||(this.disposeEntry(t),this.tiles.delete(t.id));for(const t of this.tiles.values())t.state!=="loaded"&&t.state!=="loading"&&this.frame-t.lastWanted>600&&this.tiles.delete(t.id)}}disposeEntry(e){var t;e.mesh&&(this.group.remove(e.mesh),e.mesh.geometry.dispose(),e.mesh.material.dispose(),e.mesh=void 0),(t=e.texture)==null||t.dispose(),e.texture=void 0}dispose(){for(const e of this.tiles.values())e.image&&(e.image.onload=null,e.image.onerror=null,e.image.src=""),this.disposeEntry(e);this.tiles.clear(),this.queue=[],this.inFlight=0}}const se="Wikipedia coordinates (IAU/USGS Gazetteer of Planetary Nomenclature)",Ye="Wikipedia coordinates",je=l=>l>180?l-360:l,ei=[{id:"earth-everest",name:"Mount Everest",body:"Earth",lat:27.98833,lon:86.92528,viewAltitudeKm:900,source:Ye,description:"Highest summit above sea level (8,849 m), on the Nepal–China border in the Himalaya."},{id:"earth-grand-canyon",name:"Grand Canyon",body:"Earth",lat:36.3,lon:-112.75,viewAltitudeKm:700,source:Ye,description:"Canyon carved by the Colorado River through the Colorado Plateau, Arizona."},{id:"earth-richat",name:"Richat Structure",body:"Earth",lat:21.1147,lon:-11.3943,viewAltitudeKm:600,source:Ye,description:"A 40 km eroded dome in the Sahara of Mauritania, a landmark for astronauts."},{id:"earth-baikal",name:"Lake Baikal",body:"Earth",lat:53.5,lon:108,viewAltitudeKm:1500,source:Ye,description:"The world's deepest and oldest lake, in a continental rift in Siberia."},{id:"earth-nile-delta",name:"Nile Delta",body:"Earth",lat:30.9,lon:31.11667,viewAltitudeKm:800,source:Ye,description:"Green, densely farmed fan of the Nile against the desert, Egypt."},{id:"moon-tycho",name:"Tycho",body:"Moon",lat:-43.31,lon:-11.36,viewAltitudeKm:300,source:se,description:"Young 85 km crater with a bright ray system visible from Earth."},{id:"moon-copernicus",name:"Copernicus",body:"Moon",lat:9.62,lon:-20.08,viewAltitudeKm:300,source:se,description:"93 km crater with terraced walls and central peaks in Oceanus Procellarum."},{id:"moon-tranquility",name:"Tranquility Base",body:"Moon",lat:.6875,lon:23.43333,viewAltitudeKm:250,source:se,description:"Apollo 11 landing site, 20 July 1969, in Mare Tranquillitatis."},{id:"moon-imbrium",name:"Mare Imbrium",body:"Moon",lat:32.8,lon:-15.6,viewAltitudeKm:1200,source:se,description:"Vast basalt-flooded impact basin, about 1,100 km across."},{id:"moon-shackleton",name:"Shackleton",body:"Moon",lat:-89.67,lon:129.78,viewAltitudeKm:400,source:se,description:"Permanently shadowed crater at the lunar south pole (strongly stretched in this map projection)."},{id:"mercury-caloris",name:"Caloris Planitia",body:"Mercury",lat:30.5,lon:je(198.8),viewAltitudeKm:2500,source:se,description:"Impact basin about 1,550 km across, one of the largest in the Solar System."},{id:"mercury-hokusai",name:"Hokusai",body:"Mercury",lat:58.3,lon:je(342.3),viewAltitudeKm:600,source:se,description:"114 km crater with an extensive bright ray system."},{id:"mercury-rachmaninoff",name:"Rachmaninoff",body:"Mercury",lat:27.6,lon:je(302.4),viewAltitudeKm:600,source:se,description:"Peak-ring basin about 290 km across with smooth volcanic plains inside."},{id:"venus-maxwell",name:"Maxwell Montes",body:"Venus",lat:65.2,lon:3.3,viewAltitudeKm:1500,source:se,description:"Highest mountain range on Venus, about 11 km above the mean surface."},{id:"venus-maat",name:"Maat Mons",body:"Venus",lat:.5,lon:je(194.6),viewAltitudeKm:1200,source:se,description:"Largest volcano on Venus, about 8 km high."},{id:"venus-aphrodite",name:"Aphrodite Terra",body:"Venus",lat:-5.8,lon:104.8,viewAltitudeKm:6e3,source:se,description:"Equatorial highland roughly the size of South America."},{id:"mars-olympus",name:"Olympus Mons",body:"Mars",lat:18.65,lon:je(226.2),viewAltitudeKm:1200,source:se,description:"Shield volcano about 22 km high and 600 km across, the tallest in the Solar System."},{id:"mars-valles",name:"Valles Marineris",body:"Mars",lat:-13.9,lon:je(300.8),viewAltitudeKm:2500,source:se,description:"Canyon system over 4,000 km long and up to 7 km deep."},{id:"mars-gale",name:"Gale crater",body:"Mars",lat:-5.4,lon:137.8,viewAltitudeKm:500,source:se,description:"Landing site of the Curiosity rover (2012), with Mount Sharp at its centre."},{id:"mars-jezero",name:"Jezero crater",body:"Mars",lat:18.38,lon:77.58,viewAltitudeKm:400,source:se,description:"Ancient lake basin and river delta, landing site of Perseverance (2021)."},{id:"mars-hellas",name:"Hellas Planitia",body:"Mars",lat:-42.4,lon:70.5,viewAltitudeKm:3e3,source:se,description:"Impact basin about 2,300 km across and over 7 km deep."}];function da(l){return ei.filter(e=>e.body===l)}function wo(l){const e=l.trim().toLowerCase();return e?ei.filter(t=>t.name.toLowerCase().includes(e)||t.body.toLowerCase().includes(e)):[]}function Mo(l){return ei.find(e=>e.id===l)}const Ai=2.5,So=1.5,Po=2.4,Ao=1.6,Do=1.4,To=.35,Co=1,Ro=.3,Eo=2;class Pt{constructor(e,t,a){d(this,"rig");d(this,"getBody");d(this,"loader");d(this,"layers",new Map);d(this,"layerOrder",[]);d(this,"activeBody",null);d(this,"prevSurfaceQuat",new Se);d(this,"prevSurfaceBody",null);d(this,"frustum",new Xa);d(this,"projView",new ye);d(this,"tmpV",new M);d(this,"tmpS",new zi);d(this,"tmpColor",new I(0,0,0));d(this,"frameCounter",0);d(this,"landmark",null);d(this,"lighting","auto");d(this,"daylightFactor",0);d(this,"groundHaze",null);d(this,"groundLight",null);d(this,"maxAnisotropy",8);d(this,"lastViewportPx",1e3);d(this,"status",Pt.emptyStatus());this.rig=e,this.getBody=t,this.loader=a}static emptyStatus(){return{body:null,imagery:null,streaming:!1,layer:null,maxLevel:0,altitudeKm:0,altitudeRadii:1/0,minAltitudeKm:0,atZoomLimit:!1,subCamera:null,sunElevationDeg:null,lighting:"auto",daylight:!1,landmark:null}}getStatus(){return this.status}update(e,t,a){var D,P,w;this.frameCounter++;const i=e?this.getBody(e):null,s=e&&i?Si(e,i.radiusKm):null;if(this.activeBody&&this.activeBody!==e&&((D=this.layers.get(this.activeBody))==null||D.hide(),this.restoreClouds(this.activeBody),this.landmark&&this.landmark.body!==e&&(this.landmark=null)),this.activeBody=e,!i||!s){this.rig.surfaceMinAltitude=null,this.prevSurfaceBody=null,this.status=Pt.emptyStatus();return}this.lastViewportPx=a;const o=this.minAltitudeKmFor(i,s,t.fov);this.rig.surfaceMinAltitude=o/(i.radiusKm/i.visualRadius),i.surfaceMesh.updateWorldMatrix(!0,!1);const r=i.surfaceMesh.worldToLocal(this.tmpV.copy(t.position)),c=r.length(),n=Math.max(0,c-1),h=n*i.radiusKm,m=ha(r.x,r.y,r.z),p=i.surfaceMesh.getWorldQuaternion(new Se);if(this.prevSurfaceBody===i.name&&n<So){const y=p.clone().multiply(this.prevSurfaceQuat.clone().invert());1-Math.abs(y.w)>1e-12&&this.rig.applyFrameRotation(y)}if(this.prevSurfaceQuat.copy(p),this.prevSurfaceBody=i.name,i.cloudMesh){const y=R.smoothstep(n,Ro,Co),T=i.cloudMesh.material;(P=T.uniforms)!=null&&P.uFade&&(T.uniforms.uFade.value=y),i.cloudMesh.visible=y>.01}this.daylightFactor=this.lighting==="sun"||this.groundLight?0:1-R.smoothstep(n,To,Do);let f=null;if(s.provider){const y=this.ensureLayer(i,s);if(y.setDaylight(this.daylightFactor),y.setOpacity(1-R.smoothstep(n,Ao,Po)),this.groundHaze?y.setHaze(this.groundHaze.color,this.groundHaze.density):y.setHaze(this.tmpColor,0),this.groundLight?y.setLighting(this.groundLight.sunTint,this.groundLight.ambient):y.setLighting([1,1,1],.07),n<Ai){if(this.frameCounter%2===0){this.projView.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this.frustum.setFromProjectionMatrix(this.projView);const T=i.surfaceMesh,k=i.visualRadius;y.update({position:[r.x,r.y,r.z],pixelsPerRadian:a/(2*Math.tan(t.fov*Math.PI/360)),isCapVisible:(N,j)=>{if(j<Math.PI/2){const G=Math.cos(j);T.localToWorld(this.tmpS.center.set(N[0]*G,N[1]*G,N[2]*G)),this.tmpS.radius=Math.sin(j)*k*1.02+(1-G)*k}else T.localToWorld(this.tmpS.center.set(0,0,0)),this.tmpS.radius=k*1.02;return this.frustum.intersectsSphere(this.tmpS)}})}}else y.hide();f=y.getStatus()}const g=i.bodyGroup.getWorldPosition(new M),v=t.position.clone().sub(g).normalize(),S=g.clone().negate().normalize(),x=R.radToDeg(Math.asin(R.clamp(v.dot(S),-1,1))),b=this.rig.minimumDistance();this.status={body:i.name,imagery:{title:s.title,source:s.source,sourceUrl:s.sourceUrl,attribution:s.attribution,kind:s.kind,coverage:s.coverage,note:s.note,bestMetresPerPixel:s.bestMetresPerPixel},streaming:!!s.provider&&n<Ai,layer:f,maxLevel:((w=s.provider)==null?void 0:w.maxLevel)??0,altitudeKm:h,altitudeRadii:n,minAltitudeKm:o,atZoomLimit:t.position.distanceTo(g)<=b*1.01,subCamera:{lat:m.lat,lon:m.lon},sunElevationDeg:x,lighting:this.lighting,daylight:this.daylightFactor>.5,landmark:this.landmark}}minAltitudeKmFor(e,t,a){const i=oo(t,a,this.lastViewportPx);return t.provider?i:Math.min(i,.5*e.radiusKm)}featureLabels(e){const t=this.status;if(!t.body||!(t.altitudeRadii<1.6))return[];const a=this.getBody(t.body);if(!a)return[];a.surfaceMesh.updateWorldMatrix(!0,!1);const i=a.bodyGroup.getWorldPosition(new M),s=[];for(const o of da(t.body)){const[r,c,n]=Ge(o.lat,o.lon),h=a.surfaceMesh.localToWorld(new M(r*Ie,c*Ie,n*Ie)),m=h.clone().sub(i).normalize(),p=e.position.clone().sub(h).normalize();m.dot(p)<.08||s.push({id:o.id,text:o.name,world:h,kind:"feature"})}return s}surfaceDirection(e,t,a){e.surfaceMesh.updateWorldMatrix(!0,!1);const i=e.bodyGroup.getWorldPosition(new M),[s,o,r]=Ge(t,a);return e.surfaceMesh.localToWorld(new M(s,o,r)).sub(i).normalize()}flyToLandmark(e){const t=Mo(e);if(!t)return null;const a=this.getBody(t.body);if(!a)return null;const i=a.radiusKm/a.visualRadius,s=this.surfaceDirection(a,t.lat,t.lon),o=Si(t.body,a.radiusKm);return o&&(this.rig.surfaceMinAltitude=this.minAltitudeKmFor(a,o,$e)/i),this.rig.focusedPhysicalRadiusKm=a.radiusKm,this.rig.focusSurfacePoint(a.bodyGroup,a.visualRadius,s,t.viewAltitudeKm/i),this.landmark=t,t}setLighting(e){this.lighting=e}setDaylight(e){this.setLighting(e?"auto":"sun")}setMaxAnisotropy(e){this.maxAnisotropy=e;for(const t of this.layers.values())t.setMaxAnisotropy(e)}clearLandmark(){this.landmark=null}ensureLayer(e,t){var i;let a=this.layers.get(e.name);for(a||(a=new bo(t.provider,this.loader),a.setMaxAnisotropy(this.maxAnisotropy),a.setBaseMap(e.baseMap??null),e.surfaceMesh.add(a.group),this.layers.set(e.name,a)),this.layerOrder=[e.name,...this.layerOrder.filter(s=>s!==e.name)];this.layerOrder.length>Eo;){const s=this.layerOrder.pop(),o=this.layers.get(s);o&&((i=o.group.parent)==null||i.remove(o.group),o.dispose(),this.layers.delete(s))}return a}restoreClouds(e){var a;const t=this.getBody(e);if(t!=null&&t.cloudMesh){t.cloudMesh.visible=!0;const i=t.cloudMesh.material;(a=i.uniforms)!=null&&a.uFade&&(i.uniforms.uFade.value=1)}}dispose(){var e;for(const t of this.layers.values())(e=t.group.parent)==null||e.remove(t.group),t.dispose();this.layers.clear()}}const At={kind:"none",label:"No atmosphere — black sky, stars by day",radius:1,top:1,hr:1,hm:1,betaR:[0,0,0],betaMs:[0,0,0],betaMe:[0,0,0],betaA:[0,0,0],g:[.8,.8,.8],sunIntensity:0,visibilityKm:0},No={Earth:{kind:"scatter",label:"Rayleigh + aerosol scattering (clear sky)",radius:6371e3,top:8e4,hr:8e3,hm:1200,betaR:[5802e-9,13558e-9,331e-7],betaMs:[3996e-9,3996e-9,3996e-9],betaMe:[44e-7,44e-7,44e-7],betaA:[65e-8,1881e-9,85e-9],g:[.8,.8,.8],sunIntensity:22,visibilityKm:60},Mars:{kind:"scatter",label:"Thin CO₂ + suspended dust (τ≈0.5): butterscotch day, blue sunset",radius:3389500,top:8e4,hr:11100,hm:11100,betaR:[24e-8,56e-8,138e-8],betaMs:[43e-6,34e-6,22e-6],betaMe:[45e-6,45e-6,46e-6],betaA:[0,0,0],g:[.68,.76,.88],sunIntensity:9,visibilityKm:35},Venus:{...At,kind:"overcast",label:"Total overcast: the clouds hide the sky (dim orange daylight)",overcast:[.55,.36,.16],visibilityKm:12},Titan:{...At,kind:"overcast",label:"Thick nitrogen–methane haze: Saturn and the stars are hidden from the ground",overcast:[.36,.22,.08],visibilityKm:10},Jupiter:{kind:"scatter",label:"H₂/He Rayleigh sky above the clouds (approximate)",radius:69911e3,top:4e5,hr:27e3,hm:8e3,betaR:[17e-7,4e-6,98e-7],betaMs:[12e-7,12e-7,11e-7],betaMe:[16e-7,16e-7,16e-7],betaA:[4e-7,3e-7,6e-7],g:[.75,.75,.75],sunIntensity:22,visibilityKm:400},Saturn:{kind:"scatter",label:"H₂/He Rayleigh sky above the haze (approximate)",radius:58232e3,top:5e5,hr:59e3,hm:15e3,betaR:[8e-7,19e-7,46e-7],betaMs:[14e-7,13e-7,11e-7],betaMe:[18e-7,18e-7,18e-7],betaA:[2e-7,25e-8,5e-7],g:[.75,.75,.75],sunIntensity:22,visibilityKm:500},Uranus:{kind:"scatter",label:"H₂ Rayleigh with methane absorbing red light (approximate)",radius:25362e3,top:3e5,hr:28e3,hm:1e4,betaR:[12e-7,29e-7,71e-7],betaMs:[4e-7,4e-7,4e-7],betaMe:[5e-7,5e-7,5e-7],betaA:[6e-6,8e-7,2e-7],g:[.75,.75,.75],sunIntensity:22,visibilityKm:300},Neptune:{kind:"scatter",label:"H₂ Rayleigh with methane absorbing red light (approximate)",radius:24622e3,top:3e5,hr:2e4,hm:1e4,betaR:[14e-7,34e-7,83e-7],betaMs:[4e-7,4e-7,4e-7],betaMe:[5e-7,5e-7,5e-7],betaA:[7e-6,1e-6,2e-7],g:[.75,.75,.75],sunIntensity:22,visibilityKm:300}};function Di(l){return No[l]??At}const ko=`
  varying vec3 vDir;
  void main() {
    vDir = normalize((modelMatrix * vec4(position, 0.0)).xyz);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
  }
`,Io=`
  uniform vec3 uEast;
  uniform vec3 uUp;
  uniform vec3 uNorth;
  uniform vec3 uSunDir;
  uniform float uRadius;
  uniform float uTop;
  uniform float uHr;
  uniform float uHm;
  uniform vec3 uBetaR;
  uniform vec3 uBetaMs;
  uniform vec3 uBetaMe;
  uniform vec3 uBetaA;
  uniform vec3 uG;
  uniform float uSunI;
  uniform float uEye;
  uniform float uMode;      // 1 scatter · 2 overcast
  uniform vec3 uOvercast;
  uniform float uSunElev;   // sine of the solar elevation (overcast brightness)
  uniform float uExposure;
  uniform float uStarDim;   // 0 at night … 1 in daylight: the sky drowns the stars
  varying vec3 vDir;

  const float PI = 3.14159265;

  vec2 raySphere(vec3 o, vec3 d, float r) {
    float b = dot(o, d);
    float c = dot(o, o) - r * r;
    float h = b * b - c;
    if (h < 0.0) return vec2(1e30, -1e30);
    h = sqrt(h);
    return vec2(-b - h, -b + h);
  }

  vec3 phaseM(float mu) {
    vec3 g = uG;
    vec3 g2 = g * g;
    return 3.0 / (8.0 * PI) * ((1.0 - g2) * (1.0 + mu * mu)) / ((2.0 + g2) * pow(1.0 + g2 - 2.0 * g * mu, vec3(1.5)));
  }

  void main() {
    vec3 dw = normalize(vDir);
    vec3 d = vec3(dot(dw, uEast), dot(dw, uUp), dot(dw, uNorth));
    vec3 s = vec3(dot(uSunDir, uEast), dot(uSunDir, uUp), dot(uSunDir, uNorth));

    if (uMode > 1.5) {
      // Venus: diffuse light through ~90 bar of cloud and CO₂; no direct sky
      float day = smoothstep(-0.12, 0.25, uSunElev);
      float grad = 0.75 + 0.25 * clamp(d.y, 0.0, 1.0);
      vec3 col = uOvercast * (0.04 + 0.6 * day) * grad;
      gl_FragColor = vec4(col * uExposure, 0.0);
      return;
    }

    vec3 o = vec3(0.0, uRadius + uEye, 0.0);
    vec2 at = raySphere(o, d, uRadius + uTop);
    vec2 gr = raySphere(o, d, uRadius);
    float tEnd = at.y;
    if (gr.x > 0.0) tEnd = min(tEnd, gr.x);
    const int N = 16;
    const int M = 6;
    float seg = tEnd / float(N);
    vec3 sumR = vec3(0.0);
    vec3 sumM = vec3(0.0);
    float odR = 0.0;
    float odM = 0.0;
    for (int i = 0; i < N; i++) {
      vec3 p = o + d * (seg * (float(i) + 0.5));
      float h = length(p) - uRadius;
      float hrr = exp(-h / uHr) * seg;
      float hmm = exp(-h / uHm) * seg;
      odR += hrr;
      odM += hmm;
      // Light path to the Sun
      vec2 ls = raySphere(p, s, uRadius);
      if (ls.y > ls.x && ls.x > 0.0) continue; // in the planet's shadow
      float lseg = raySphere(p, s, uRadius + uTop).y / float(M);
      float lR = 0.0;
      float lM = 0.0;
      for (int j = 0; j < M; j++) {
        vec3 q = p + s * (lseg * (float(j) + 0.5));
        float hq = length(q) - uRadius;
        lR += exp(-hq / uHr) * lseg;
        lM += exp(-hq / uHm) * lseg;
      }
      vec3 tau = uBetaR * (odR + lR) + uBetaMe * (odM + lM) + uBetaA * (odR + lR);
      vec3 att = exp(-tau);
      sumR += att * hrr;
      sumM += att * hmm;
    }
    float mu = dot(d, s);
    float pr = 3.0 / (16.0 * PI) * (1.0 + mu * mu);
    vec3 col = uSunI * (sumR * uBetaR * pr + sumM * uBetaMs * phaseM(mu));
    vec3 trans = exp(-(uBetaR * odR + uBetaMe * odM + uBetaA * odR));
    col *= uExposure;
    float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
    // Background (stars) is dimmed by extinction and drowned by a bright sky
    float through = dot(trans, vec3(0.333)) * (1.0 - smoothstep(0.015, 0.35, lum)) * (1.0 - uStarDim);
    gl_FragColor = vec4(col, through);
  }
`;class Oo{constructor(){d(this,"mesh");d(this,"material");d(this,"model",At);this.material=new L({uniforms:{uEast:{value:new M(1,0,0)},uUp:{value:new M(0,1,0)},uNorth:{value:new M(0,0,-1)},uSunDir:{value:new M(0,1,0)},uRadius:{value:6371e3},uTop:{value:8e4},uHr:{value:8e3},uHm:{value:1200},uBetaR:{value:new M},uBetaMs:{value:new M},uBetaMe:{value:new M},uBetaA:{value:new M},uG:{value:new M(.8,.8,.8)},uSunI:{value:22},uEye:{value:400},uMode:{value:1},uOvercast:{value:new M},uSunElev:{value:0},uExposure:{value:1.15},uStarDim:{value:0}},vertexShader:ko,fragmentShader:Io,side:Ke,depthWrite:!1,depthTest:!0,transparent:!0,blending:ts,blendEquation:es,blendSrc:Za,blendDst:Qa}),this.mesh=new z(new ue(1,64,32),this.material),this.mesh.name="surface_sky_atmosphere",this.mesh.frustumCulled=!1,this.mesh.renderOrder=40,this.mesh.visible=!1}setModel(e){this.model=e;const t=this.material.uniforms;t.uRadius.value=e.radius,t.uTop.value=e.top,t.uHr.value=e.hr,t.uHm.value=e.hm,t.uBetaR.value.fromArray(e.betaR),t.uBetaMs.value.fromArray(e.betaMs),t.uBetaMe.value.fromArray(e.betaMe),t.uBetaA.value.fromArray(e.betaA),t.uG.value.fromArray(e.g),t.uSunI.value=e.sunIntensity,t.uMode.value=e.kind==="overcast"?2:1,e.overcast&&t.uOvercast.value.fromArray(e.overcast)}update(e,t,a,i,s,o){if(this.mesh.visible=o&&this.model.kind!=="none",!this.mesh.visible)return;this.mesh.position.copy(e),this.mesh.scale.setScalar(t);const r=this.material.uniforms;r.uEast.value.copy(a.east),r.uUp.value.copy(a.up),r.uNorth.value.copy(a.north),r.uSunDir.value.copy(i),r.uEye.value=Math.max(2,s),r.uSunElev.value=i.dot(a.up);const c=Math.asin(R.clamp(r.uSunElev.value,-1,1))*180/Math.PI;r.uStarDim.value=this.model.kind==="scatter"?R.smoothstep(c,-10,-1)*this.starDimScale:0}get starDimScale(){return this.model.radius>2e7?.6:1}dispose(){this.mesh.geometry.dispose(),this.material.dispose()}}function ua(l,e){if(l.kind==="none")return[1,1,1];if(l.kind==="overcast")return[0,0,0];if(e<-2)return[0,0,0];const t=Math.max(e,-1.5),a=1/(Math.sin(t*Math.PI/180)+.50572*Math.pow(t+6.07995,-1.6364)),i=[0,0,0];for(let s=0;s<3;s++){const o=(l.betaR[s]+l.betaA[s])*l.hr+l.betaMe[s]*l.hm;i[s]=Math.exp(-o*Math.min(a,40))}return i}const Lo={Sun:{ra0:286.13,dec0:63.87,w0:84.176,wRate:14.1844},Mercury:{ra0:281.0103,raRate:-.0328,dec0:61.4155,decRate:-.0049,w0:329.5988,wRate:6.1385108},Venus:{ra0:272.76,dec0:67.16,w0:160.2,wRate:-1.4813688},Earth:{ra0:0,raRate:-.641,dec0:90,decRate:-.557,w0:190.147,wRate:360.9856235},Mars:{ra0:317.269202,raRate:-.10927547,dec0:54.432516,decRate:-.05827105,w0:176.049863,wRate:350.891982443297},Jupiter:{ra0:268.056595,raRate:-.006499,dec0:64.495303,decRate:.002413,w0:284.95,wRate:870.536},Saturn:{ra0:40.589,raRate:-.036,dec0:83.537,decRate:-.004,w0:38.9,wRate:810.7939024},Uranus:{ra0:257.311,dec0:-15.175,w0:203.81,wRate:-501.1600928},Neptune:{ra0:299.36,dec0:43.46,w0:249.978,wRate:541.1397757,neptuneNutation:!0},Pluto:{ra0:132.993,dec0:-6.163,w0:302.695,wRate:56.3625225},Ceres:{ra0:291.418,dec0:66.764,w0:170.65,wRate:952.1532},Vesta:{ra0:309.031,dec0:42.235,w0:285.39,wRate:1617.3329428},Eros:{ra0:11.35,dec0:17.22,w0:326.07,wRate:1639.38864745},Gaspra:{ra0:9.47,dec0:26.7,w0:83.67,wRate:1226.911485},Ida:{ra0:168.76,dec0:-87.12,w0:274.05,wRate:1864.628007}},jo={Bennu:{lambdaDeg:69.92,betaDeg:-83.45,periodHours:4.296057},Ryugu:{lambdaDeg:179.3,betaDeg:-87.44,periodHours:7.6326}},Fe=Math.PI/180;function at(l){const e=Math.hypot(l[0],l[1],l[2])||1;return[l[0]/e,l[1]/e,l[2]/e]}function ti(l,e){return[l[1]*e[2]-l[2]*e[1],l[2]*e[0]-l[0]*e[2],l[0]*e[1]-l[1]*e[0]]}const Ti=K.icrfToThree,Fo=K.raDecToIcrf;function ma(l,e){const t=Lo[l];if(t){const i=e/36525;let s=t.ra0+(t.raRate??0)*i,o=t.dec0+(t.decRate??0)*i,r=t.w0+t.wRate*e;if(t.neptuneNutation){const h=(357.85+52.316*i)*Fe;s+=.7*Math.sin(h),o-=.51*Math.cos(h),r-=.48*Math.sin(h)}const c=Fo(s,o),n=[-Math.sin(s*Fe),Math.cos(s*Fe),0];return Wt(Ti(n),Ti(c),r*Fe)}const a=jo[l];if(a){const i=a.lambdaDeg*Fe,s=a.betaDeg*Fe,o=[Math.cos(s)*Math.cos(i),Math.cos(s)*Math.sin(i),Math.sin(s)],r=K.eclipticToThree(o),c=K.eclipticToThree([0,0,1]);let n=ti(c,r);Math.hypot(...n)<1e-6&&(n=[1,0,0]);const h=e*24/a.periodHours*2*Math.PI;return Wt(at(n),r,h)}return null}function pa(l,e){const t=K.eclipticToThree(l),a=K.eclipticToThree(e),i=at(ti(t,a)),s=at([-t[0],-t[1],-t[2]]);return Wt(s,i,0)}function Wt(l,e,t){const a=at(e),i=l[0]*a[0]+l[1]*a[1]+l[2]*a[2],s=at([l[0]-i*a[0],l[1]-i*a[1],l[2]-i*a[2]]),o=ti(s,a);return{xAxis:s,yAxis:a,zAxis:o,spinRad:t}}const Dt=Math.PI/180,Ci=1495978707e-1,Uo={Mercury:.142,Venus:.689,Earth:.434,Moon:.12,Mars:.17,Jupiter:.538,Saturn:.499,Uranus:.488,Neptune:.442,Pluto:.52,Io:.63,Europa:.67,Ganymede:.43,Callisto:.22,Titan:.22,Phobos:.07,Deimos:.08},Ri=(l,e)=>[l[0]+e[0],l[1]+e[1],l[2]+e[2]],st=l=>{const e=Math.hypot(l[0],l[1],l[2])||1;return[l[0]/e,l[1]/e,l[2]/e]},xt=(l,e)=>l[0]*e[0]+l[1]*e[1]+l[2]*e[2],_t=(l,e)=>[l[1]*e[2]-l[2]*e[1],l[2]*e[0]-l[0]*e[2],l[0]*e[1]-l[1]*e[0]];function Ei(l){return l.physical.gmKm3S2??(l.physical.massKg?l.physical.massKg*66743e-24:void 0)}function ii(l,e){if(l.orderFromSun===0||l.category==="star")return{pos:[0,0,0],vel:[0,0,0]};if(l.category==="moon"&&l.parentId){const a=J.getParent(l);if(a){const i=ii(a,e),s=Ei(a),o=s!==void 0?s+(Ei(l)??0):pe.GM_SUN,r=pe.propagate(l.orbit,e,o);return{pos:Ri(i.pos,r.positionKm),vel:Ri(i.vel,r.velocityKmPerSec),relPos:r.positionKm,relVel:r.velocityKmPerSec}}}const t=pe.propagate(l.orbit,e);return{pos:t.positionKm,vel:t.velocityKmPerSec}}function _o(l,e){if(l.category==="moon"&&l.name!=="Hyperion"){const t=ii(l,e);if(t.relPos&&t.relVel)return pa(t.relPos,t.relVel)}return ma(l.name,e)}function zo(l,e,t){const a=Math.cos(l.spinRad),i=Math.sin(l.spinRad),s=[l.xAxis[0]*a-l.zAxis[0]*i,l.xAxis[1]*a-l.zAxis[1]*i,l.xAxis[2]*a-l.zAxis[2]*i],o=_t(l.yAxis,s),r=e*Dt,c=t*Dt,n=[s[0]*Math.cos(c)+o[0]*Math.sin(c),s[1]*Math.cos(c)+o[1]*Math.sin(c),s[2]*Math.cos(c)+o[2]*Math.sin(c)],h=st([n[0]*Math.cos(r)+l.yAxis[0]*Math.sin(r),n[1]*Math.cos(r)+l.yAxis[1]*Math.sin(r),n[2]*Math.cos(r)+l.yAxis[2]*Math.sin(r)]),m=st(_t(l.yAxis,h)),p=_t(h,m);return{east:m,north:p,up:h}}function Ko(l,e){const t=st(l),a=Math.asin(Math.max(-1,Math.min(1,xt(t,e.up))))/Dt;let i=Math.atan2(xt(t,e.east),xt(t,e.north))/Dt;return i<0&&(i+=360),{alt:a,az:i}}function Bo(l,e,t,a){const i=J.getBody(l);if(!i)return null;const s=_o(i,a);if(!s)return null;const o=ii(i,a),r=K.eclipticToThree([-o.pos[0],-o.pos[1],-o.pos[2]]);return Ko(r,zo(s,e,t)).alt}function Go(l,e,t,a,i){const s=o=>Bo(l,e,t,o);if(s(a)===null)return null;for(const o of[1.6,3,40,200]){const c=o/720;let n=s(a),h={d:a,v:n},m=null;for(let p=1;p<=720&&m===null;p++){const f=a+p*c,g=s(f);(i==="noon"?g>h.v:i==="night"&&g<h.v)&&(h={d:f,v:g});const v=-.833;i==="sunrise"&&n<v&&g>=v&&(m=Ni(s,f-c,f,v)),i==="sunset"&&n>v&&g<=v&&(m=Ni(s,f-c,f,v)),n=g}if(m!==null)return m;if((i==="noon"||i==="night")&&h.d<a+o*.97&&h.d>a)return Ho(s,h.d,c,i==="noon")}return null}function Ni(l,e,t,a){let i=l(e)-a;for(let s=0;s<40;s++){const o=(e+t)/2,r=l(o)-a;Math.sign(r)===Math.sign(i)?(e=o,i=r):t=o}return(e+t)/2}function Ho(l,e,t,a){let i=e-t,s=e+t;for(let o=0;o<40;o++){const r=i+(s-i)/3,c=s-(s-i)/3,n=l(r),h=l(c);(a?n<h:n>h)?i=r:s=c}return(i+s)/2}function Vo(l,e,t,a){if(l==="Sun"){const p=Math.hypot(...a)/Ci;return-26.74+5*Math.log10(Math.max(1e-6,p))}const i=Uo[l]??.15,s=Math.hypot(...t),o=[a[0]-t[0],a[1]-t[1],a[2]-t[2]],r=Math.hypot(...o),c=xt(st([-t[0],-t[1],-t[2]]),st(o)),n=Math.acos(Math.max(-1,Math.min(1,c))),h=Math.max(1e-6,(Math.sin(n)+(Math.PI-n)*Math.cos(n))/Math.PI),m=i*h*(e/r)**2/(s/Ci)**2;return-26.74-2.5*Math.log10(Math.max(1e-30,m))}const Wo=`
  varying vec2 vUv;
  varying vec3 vNormalW;
  void main() {
    vUv = uv;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,Yo=`
  uniform sampler2D map;
  uniform float uHasMap;
  uniform vec3 uColor;
  uniform vec3 uSunDir;   // from the body towards the Sun
  uniform vec3 uTint;     // atmospheric extinction
  uniform float uAlpha;
  uniform float uEmissive;
  varying vec2 vUv;
  varying vec3 vNormalW;
  void main() {
    vec3 base = uHasMap > 0.5 ? texture2D(map, vUv).rgb : uColor;
    vec3 col;
    if (uEmissive > 0.0) {
      // Photosphere far brighter than white so the bloom pass gives it glare
      col = vec3(1.0, 0.95, 0.86) * uEmissive;
    } else {
      float ndl = dot(normalize(vNormalW), uSunDir);
      col = base * (smoothstep(-0.03, 0.25, ndl) * 1.15 + 0.012);
    }
    gl_FragColor = vec4(col * uTint, uAlpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`,Jo=`
  varying vec2 vUv;
  varying vec3 vNormalW;
  void main() {
    vUv = uv;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,qo=`
  uniform sampler2D ringMap;
  uniform vec3 uSunDir;
  uniform vec3 uTint;
  uniform float uAlpha;
  varying vec2 vUv;
  varying vec3 vNormalW;
  void main() {
    vec4 c = texture2D(ringMap, vUv);
    if (c.a < 0.02) discard;
    float lit = max(0.08, abs(dot(normalize(vNormalW), uSunDir)));
    gl_FragColor = vec4(c.rgb * lit * 1.6 * uTint, c.a * 0.95 * uAlpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`,$o=`
  attribute float aSize;
  attribute vec3 aColor;
  varying vec3 vColor;
  void main() {
    vColor = aColor;
    gl_PointSize = aSize;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,Xo=`
  varying vec3 vColor;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = length(c) * 2.0;
    float a = exp(-r * r * 3.5);
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor * a, 1.0);
  }
`;function Qo(){const e=document.createElement("canvas");e.width=e.height=256;const t=e.getContext("2d"),a=t.createRadialGradient(256/2,256/2,0,256/2,256/2,256/2);a.addColorStop(0,"rgba(255,250,235,1)"),a.addColorStop(.08,"rgba(255,240,210,0.55)"),a.addColorStop(.3,"rgba(255,220,170,0.12)"),a.addColorStop(1,"rgba(255,200,150,0)"),t.fillStyle=a,t.fillRect(0,0,256,256);const i=new B(e);return i.colorSpace=ke,i}const gt=64,Zo=.13;class er{constructor(){d(this,"group",new he);d(this,"sphereGeo",new ue(1,64,32));d(this,"ringGeo");d(this,"entries",new Map);d(this,"points");d(this,"pointPos",new Float32Array(gt*3));d(this,"pointSize",new Float32Array(gt));d(this,"pointColor",new Float32Array(gt*3));d(this,"sunGlow");d(this,"tmp",new M);this.group.name="surface_sky_bodies",this.group.visible=!1,this.ringGeo=new ji(1.32,2.65,128,4);const e=this.ringGeo.attributes.position,t=this.ringGeo.attributes.uv;for(let i=0;i<e.count;i++){const s=Math.hypot(e.getX(i),e.getY(i));t.setXY(i,(s-1.32)/(2.65-1.32),.5)}t.needsUpdate=!0;const a=new Z;a.setAttribute("position",new F(this.pointPos,3)),a.setAttribute("aSize",new F(this.pointSize,1)),a.setAttribute("aColor",new F(this.pointColor,3)),a.setDrawRange(0,0),this.points=new xe(a,new L({vertexShader:$o,fragmentShader:Xo,transparent:!0,depthWrite:!1,blending:q})),this.points.frustumCulled=!1,this.points.renderOrder=46,this.group.add(this.points),this.sunGlow=new is(new as({map:Qo(),blending:q,depthWrite:!1,transparent:!0})),this.sunGlow.renderOrder=47,this.group.add(this.sunGlow)}entryFor(e){let t=this.entries.get(e.name);if(t)return t;const a=new L({uniforms:{map:{value:e.map??null},uHasMap:{value:e.map?1:0},uColor:{value:new I(e.colorHex??"#b0a89a")},uSunDir:{value:new M(1,0,0)},uTint:{value:new M(1,1,1)},uAlpha:{value:1},uEmissive:{value:e.name==="Sun"?40:0}},vertexShader:Wo,fragmentShader:Yo,transparent:!0,depthWrite:!0}),i=new z(this.sphereGeo,a);if(i.name=`sky_${e.name}`,i.renderOrder=45,i.frustumCulled=!1,this.group.add(i),t={mesh:i,mat:a},e.ringMap){const s=new L({uniforms:{ringMap:{value:e.ringMap},uSunDir:{value:new M(1,0,0)},uTint:{value:new M(1,1,1)},uAlpha:{value:1}},vertexShader:Jo,fragmentShader:qo,side:Oe,transparent:!0,depthWrite:!1}),o=new z(this.ringGeo,s);o.rotation.x=Math.PI/2,o.renderOrder=45.5,o.frustumCulled=!1,i.add(o),t.ring=o,t.ringMat=s}return this.entries.set(e.name,t),t}update(e){const t=[];let a=0;const i=e.camera.position,s=new M().setFromMatrixColumn(e.camera.matrixWorld,0).normalize();this.sunGlow.visible=!1;const o=new Set,r=e.sources.filter(n=>n.name!==e.observerBody).map(n=>{const h=[n.positionKm[0]-e.observerKm[0],n.positionKm[1]-e.observerKm[1],n.positionKm[2]-e.observerKm[2]];return{s:n,rel:h,dist:Math.hypot(h[0],h[1],h[2])}}).sort((n,h)=>n.dist-h.dist);r.forEach(({s:n,rel:h,dist:m},p)=>{const f=K.eclipticToThree(h),g=this.tmp.set(f[0],f[1],f[2]).normalize().clone(),v=Math.asin(R.clamp(g.dot(e.frame.up),-1,1))*180/Math.PI;let S=Math.atan2(g.dot(e.frame.east),g.dot(e.frame.north))*180/Math.PI;S<0&&(S+=360);const x=Math.asin(Math.min(1,n.radiusKm/Math.max(m,n.radiusKm*1.0001))),b=n.name==="Sun",D=b?x:Math.max(x,Math.min(Zo,x*e.magnification)),P=D*e.pixelsPerRadian,w=Vo(n.name,n.radiusKm,n.positionKm,e.observerKm),y=e.atmosphere?ua(e.atmosphere,v):[1,1,1],T=v>-1.5-D*180/Math.PI,k=e.shellRadius*(1+.25*(p/Math.max(1,r.length))),N=new M().copy(i).addScaledVector(g,k),j={name:n.name,altDeg:v,azDeg:S,magnitude:w,diameterArcsec:x*2*206264.8,distanceKm:m,visible:!1,labelWorld:N.clone().addScaledVector(e.frame.up,0)},G=!e.hideAll&&T&&w<e.limitingMagnitude;if(!e.hideAll&&T&&P>=1&&(w<e.limitingMagnitude+3||b||P>6)||b){const O=this.entryFor(n);if(O.mesh.visible=!e.hideAll&&T,O.mesh.visible){o.add(n.name),O.mesh.position.copy(N),O.mesh.scale.setScalar(k*Math.tan(D)),n.orientation&&O.mesh.quaternion.copy(n.orientation);const $=K.eclipticToThree([-n.positionKm[0],-n.positionKm[1],-n.positionKm[2]]);O.mat.uniforms.uSunDir.value.set($[0],$[1],$[2]).normalize(),O.mat.uniforms.uTint.value.set(y[0],y[1],y[2]);const X=b?1:R.smoothstep(P,1,3);if(O.mat.uniforms.uAlpha.value=X,O.ringMat&&(O.ringMat.uniforms.uSunDir.value.copy(O.mat.uniforms.uSunDir.value),O.ringMat.uniforms.uTint.value.set(y[0],y[1],y[2]),O.ringMat.uniforms.uAlpha.value=X),j.visible=!0,j.labelWorld=N.clone().addScaledVector(s,k*Math.tan(D)*(O.ring?2.75:1.2)+k*.004),b){this.sunGlow.visible=!0,this.sunGlow.position.copy(N);const ie=k*Math.tan(Math.max(D*9,.06));this.sunGlow.scale.setScalar(ie*2);const ae=(y[0]+y[1]+y[2])/3;this.sunGlow.material.color.setRGB(y[0],y[1],y[2]),this.sunGlow.material.opacity=Math.min(1,.25+ae)}}}if(G&&P<3&&a<gt&&!b){const O=1-R.smoothstep(P,1,3),$=Math.pow(10,-.4*(w-1)),X=R.clamp(2.2+1.3*Math.log10(1+$*3),1.6,9),ie=R.clamp(.35+.45*Math.log10(1+$*4),.25,2.2)*O,ae=new I(n.colorHex??"#fff6e8"),le=N.clone().sub(i);this.pointPos.set([le.x,le.y,le.z],a*3),this.pointSize[a]=X*Math.min(2,window.devicePixelRatio||1),this.pointColor.set([(.6+.4*ae.r)*ie*y[0],(.6+.4*ae.g)*ie*y[1],(.6+.4*ae.b)*ie*y[2]],a*3),a++,j.visible=!0,j.labelWorld=N.clone().addScaledVector(s,k*.006)}t.push(j)});for(const[n,h]of this.entries)o.has(n)||(h.mesh.visible=!1);this.points.position.copy(i);const c=this.points.geometry;return c.setDrawRange(0,a),c.attributes.position.needsUpdate=!0,c.attributes.aSize.needsUpdate=!0,c.attributes.aColor.needsUpdate=!0,t}dispose(){var e,t;for(const a of this.entries.values())a.mat.dispose(),(e=a.ringMat)==null||e.dispose();this.sphereGeo.dispose(),this.ringGeo.dispose(),this.points.geometry.dispose(),this.points.material.dispose(),(t=this.sunGlow.material.map)==null||t.dispose(),this.sunGlow.material.dispose()}}const W=Math.PI/180,be=70,ki=.2,Ii=100;function Je(l){return l.radiusKm>2e4?l.radiusKm*.003:.3}class tr{constructor(e){d(this,"d");d(this,"atmosphere",new Oo);d(this,"sky",new er);d(this,"active",!1);d(this,"body",null);d(this,"lat",0);d(this,"lon",0);d(this,"place",null);d(this,"heading",0);d(this,"pitch",20*W);d(this,"targetHeading",0);d(this,"targetPitch",20*W);d(this,"fov",be);d(this,"targetFov",be);d(this,"magnification",1);d(this,"atmosphereOn",!0);d(this,"model",Di(""));d(this,"status",null);d(this,"objects",[]);d(this,"dragging",!1);d(this,"last",{x:0,y:0});d(this,"pinch",0);d(this,"keys",new Set);d(this,"pendingAim",null);d(this,"frame",{east:new M,north:new M,up:new M});d(this,"tmp",new M);d(this,"lastTime",performance.now());d(this,"onDown",e=>{this.dragging=!0,this.last={x:e.clientX,y:e.clientY}});d(this,"onMove",e=>{if(!this.dragging)return;const t=e.clientX-this.last.x,a=e.clientY-this.last.y;this.last={x:e.clientX,y:e.clientY},this.targetHeading-=t*this.radPerPx(),this.targetPitch=R.clamp(this.targetPitch+a*this.radPerPx(),-80*W,89.5*W)});d(this,"onUp",()=>{this.dragging=!1});d(this,"onWheel",e=>{e.preventDefault();const t=e.deltaMode===1?33:e.deltaMode===2?400:1,a=R.clamp(e.deltaY*t,-600,600);this.targetFov=R.clamp(this.targetFov*Math.exp(a*.0016),ki,Ii)});d(this,"onTouchStart",e=>{e.touches.length===1?(this.dragging=!0,this.last={x:e.touches[0].clientX,y:e.touches[0].clientY}):e.touches.length===2&&(this.dragging=!1,this.pinch=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY))});d(this,"onTouchMove",e=>{if(e.touches.length===1&&this.dragging){const t=e.touches[0],a=t.clientX-this.last.x,i=t.clientY-this.last.y;this.last={x:t.clientX,y:t.clientY},this.targetHeading-=a*this.radPerPx(),this.targetPitch=R.clamp(this.targetPitch+i*this.radPerPx(),-80*W,89.5*W)}else if(e.touches.length===2&&this.pinch>0){const t=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);this.targetFov=R.clamp(this.targetFov*(this.pinch/Math.max(1,t)),ki,Ii),this.pinch=t}});d(this,"onDbl",()=>{this.targetFov=be});d(this,"onKeyDown",e=>{const t=e.target;t&&(t.tagName==="INPUT"||t.tagName==="TEXTAREA")||e.key.startsWith("Arrow")&&(this.keys.add(e.key),e.preventDefault())});d(this,"onKeyUp",e=>{this.keys.delete(e.key)});this.d=e,e.scene.add(this.atmosphere.mesh),e.scene.add(this.sky.group)}isActive(){return this.active}getStatus(){return this.status}enter(e,t,a,i=null){const s=this.d.getBody(e);return s?(this.body=s,this.lat=t,this.lon=a,this.place=i,this.model=Di(e),this.atmosphere.setModel(this.model),this.atmosphereOn=!0,this.fov=this.targetFov=be,this.active=!0,this.attach(),this.computeFrame(),this.d.setSceneMode(!0,e,this.skyRadii().stars),this.pendingAim="auto",this.heading=this.targetHeading=180*W,this.pitch=this.targetPitch=25*W,!0):!1}exit(){this.active&&(this.active=!1,this.detach(),this.atmosphere.mesh.visible=!1,this.sky.group.visible=!1,this.d.camera.up.set(0,1,0),this.d.camera.fov=55,this.d.camera.updateProjectionMatrix(),this.body&&this.d.setSceneMode(!1,this.body.name,0),this.d.setGround(null,null),this.status=null)}getLocation(){return this.body?{body:this.body.name,lat:this.lat,lon:this.lon}:null}setMagnification(e){this.magnification=R.clamp(e,1,2e3)}setAtmosphere(e){this.atmosphereOn=e}resetZoom(){this.targetFov=be}lookAt(e){const t=this.objects.find(a=>a.name===e);t&&(this.targetHeading=this.continuousHeading(t.azDeg*W),this.targetPitch=R.clamp(t.altDeg*W,-.3,1.5))}setTimeOfDay(e){if(!this.body)return!1;const t=Go(this.body.name,this.lat,this.lon,this.d.getDays(),e);return t===null?!1:(this.d.setDays(t),!0)}labelItems(){return this.active?this.objects.filter(e=>e.visible&&e.altDeg>-1&&(e.magnitude<3.5||e.name==="Sun")).slice(0,14).map(e=>({id:`sky:${e.name}`,text:e.name,sub:e.name==="Sun"?void 0:`${e.magnitude.toFixed(1)} mag`,world:e.labelWorld,kind:"sky"})):[]}skyRadii(){const e=this.body,t=e.radiusKm/e.visualRadius,a=Je(e),i=Math.sqrt(2*e.radiusKm*a)/t,s=Math.max(.5,i*3),o=s*2,r=o*2.5,c=Math.max(r*1.6,e.name==="Saturn"?e.visualRadius*5:0),n=a/t;return{dome:s,shell:o,stars:r,far:c,near:Math.max(n*.15,1e-7),eyeUnits:n}}computeFrame(){const e=this.body;e.surfaceMesh.updateWorldMatrix(!0,!1);const t=Je(e),a=Ie+t/e.radiusKm,[i,s,o]=Ge(this.lat,this.lon),r=e.surfaceMesh.localToWorld(new M(i*a,s*a,o*a)),c=e.bodyGroup.getWorldPosition(new M),n=this.frame.up.copy(r).sub(c).normalize(),h=new M(0,1,0).applyQuaternion(e.surfaceMesh.getWorldQuaternion(new Se)),m=this.frame.north.copy(h).addScaledVector(n,-h.dot(n));return m.lengthSq()<1e-10&&m.set(1,0,0).addScaledVector(n,-n.x),m.normalize(),this.frame.east.crossVectors(m,n).normalize(),r}update(){if(!this.active||!this.body)return;const e=performance.now(),t=Math.min(.1,(e-this.lastTime)/1e3);this.lastTime=e;const a=this.body,i=this.d.camera,s=this.skyRadii(),o=1.2*(this.fov/be)*t;this.keys.has("ArrowLeft")&&(this.targetHeading-=o),this.keys.has("ArrowRight")&&(this.targetHeading+=o),this.keys.has("ArrowUp")&&(this.targetPitch+=o),this.keys.has("ArrowDown")&&(this.targetPitch-=o),this.targetPitch=R.clamp(this.targetPitch,-80*W,89.5*W);const r=1-Math.pow(5e-4,t);this.heading+=(this.targetHeading-this.heading)*r,this.pitch+=(this.targetPitch-this.pitch)*r,this.fov+=(this.targetFov-this.fov)*r;const c=this.computeFrame(),{east:n,north:h,up:m}=this.frame,p=Math.cos(this.heading),f=Math.sin(this.heading),g=Math.cos(this.pitch),v=this.tmp.set(0,0,0).addScaledVector(h,g*p).addScaledVector(n,g*f).addScaledVector(m,Math.sin(this.pitch));i.position.copy(c),i.up.copy(m),i.lookAt(c.clone().add(v)),i.fov=this.fov,i.near=s.near,i.far=s.far,i.updateProjectionMatrix(),i.updateMatrixWorld();const S=this.d.getPositionKm(a.name)??[0,0,0],x=a.radiusKm+Je(a),b=K.threeToEcliptic([m.x,m.y,m.z]),D=[S[0]+b[0]*x,S[1]+b[1]*x,S[2]+b[2]*x],P=[-D[0],-D[1],-D[2]],w=K.eclipticToThree(P),y=new M(w[0],w[1],w[2]).normalize(),T=Math.asin(R.clamp(y.dot(m),-1,1))/W;let k=Math.atan2(y.dot(n),y.dot(h))/W;k<0&&(k+=360);const N=this.atmosphereOn&&this.model.kind!=="none"?this.model:null;this.atmosphere.update(c,s.dome,this.frame,y,Je(a)*1e3,!!N);const j=N?N.kind==="overcast"?1:R.smoothstep(T,-14,2):0,G=5*Math.log10(Math.max(1,be/this.fov)),ne=(N?R.lerp(6.2,-3.8,j):6.5)+G;this.sky.group.visible=!0;const O=(this.d.dom.clientHeight||800)/(2*Math.tan(this.fov*W/2));this.objects=this.sky.update({camera:i,observerKm:D,observerBody:a.name,sources:this.d.getSources(),frame:this.frame,shellRadius:s.shell,pixelsPerRadian:O,magnification:this.magnification,limitingMagnitude:ne,atmosphere:N,hideAll:!!N&&N.kind==="overcast"});const $=N?ua(N,T):[1,1,1],X=R.smoothstep(T,-6,8),ie=N?N.kind==="overcast"?.03+.35*R.smoothstep(T,-10,20):.03+.22*X:.015,ae=N&&N.kind==="overcast"?[.05,.03,.01]:[$[0],$[1],$[2]];let le=null;if(N){const U=N.kind==="overcast"?new I(.32,.2,.09):this.horizonColor(N,X,$),me=a.radiusKm/a.visualRadius;le={color:U,density:1/Math.max(1,N.visibilityKm)*me}}this.d.setGround({sunTint:ae,ambient:ie},le),this.pendingAim&&(this.pendingAim=null,this.autoAim(T,k)),this.status={active:!0,body:a.name,lat:this.lat,lon:this.lon,place:this.place,eyeHeightKm:Je(a),headingDeg:(this.heading/W%360+360)%360,pitchDeg:this.pitch/W,fovDeg:this.fov,magnification:this.magnification,atmosphereOn:this.atmosphereOn,atmosphereKind:this.model.kind,atmosphereLabel:this.model.label,sunAltDeg:T,sunAzDeg:k,objects:this.objects.filter(U=>U.altDeg>0&&U.name!==a.name&&(U.magnitude<6.5||U.diameterArcsec>60)).sort((U,me)=>U.magnitude-me.magnitude).slice(0,12).map(U=>({name:U.name,altDeg:U.altDeg,azDeg:U.azDeg,magnitude:U.magnitude,diameterArcsec:U.diameterArcsec,distanceKm:U.distanceKm}))}}horizonColor(e,t,a){const i=e.betaR,s=e.betaMs,o=new I((i[0]*6e4+s[0]*5e4)*(.4+.6*a[0]),(i[1]*6e4+s[1]*5e4)*(.4+.6*a[1]),(i[2]*6e4+s[2]*5e4)*(.4+.6*a[2])),r=Math.max(o.r,o.g,o.b,1e-6);return o.multiplyScalar(.85/r*(.05+.95*t)),o}autoAim(e,t){const a=this.body,i=(m,p,f,g)=>{const v=Math.PI/180,S=Math.sin(m*v)*Math.sin(f*v)+Math.cos(m*v)*Math.cos(f*v)*Math.cos((p-g)*v);return Math.acos(R.clamp(S,-1,1))/v},s=e>-6,o=this.objects.filter(m=>m.altDeg>3&&m.name!=="Sun"),r=o.filter(m=>!s||i(m.altDeg,m.azDeg,e,t)>40),c=o.filter(m=>m.diameterArcsec>3600).sort((m,p)=>p.diameterArcsec-m.diameterArcsec)[0];let n=null;if(a.name==="Saturn")n={az:this.lat>=0?180:0,alt:28};else if(c)n={az:c.azDeg,alt:c.altDeg};else{const m=r.filter(g=>g.altDeg<45).sort((g,v)=>g.magnitude-v.magnitude)[0],p=r.sort((g,v)=>g.magnitude-v.magnitude)[0],f=m??p;f&&f.magnitude<1.5?n={az:f.azDeg,alt:f.altDeg}:s?n={az:(t+180)%360,alt:15}:n={az:180,alt:30}}this.heading=this.targetHeading=n.az*W;const h=c?n.alt-.45*(be/2):n.alt;this.pitch=this.targetPitch=R.clamp(h,8,c?50:30)*W}continuousHeading(e){let t=e;for(;t-this.heading>Math.PI;)t-=Math.PI*2;for(;t-this.heading<-Math.PI;)t+=Math.PI*2;return t}attach(){const e=this.d.dom;e.addEventListener("mousedown",this.onDown),window.addEventListener("mousemove",this.onMove),window.addEventListener("mouseup",this.onUp),e.addEventListener("wheel",this.onWheel,{passive:!1}),e.addEventListener("touchstart",this.onTouchStart,{passive:!0}),e.addEventListener("touchmove",this.onTouchMove,{passive:!0}),e.addEventListener("dblclick",this.onDbl),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("keyup",this.onKeyUp)}detach(){const e=this.d.dom;e.removeEventListener("mousedown",this.onDown),window.removeEventListener("mousemove",this.onMove),window.removeEventListener("mouseup",this.onUp),e.removeEventListener("wheel",this.onWheel),e.removeEventListener("touchstart",this.onTouchStart),e.removeEventListener("touchmove",this.onTouchMove),e.removeEventListener("dblclick",this.onDbl),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("keyup",this.onKeyUp),this.keys.clear(),this.dragging=!1}radPerPx(){return this.fov*W/Math.max(1,this.d.dom.clientHeight||800)}dispose(){this.exit(),this.atmosphere.dispose(),this.sky.dispose()}}class ir{constructor(e,t){d(this,"root");d(this,"nodes",new Map);d(this,"tmp",new M);d(this,"onClick");this.onClick=t,this.root=document.createElement("div"),this.root.className="solaris-screen-labels",Object.assign(this.root.style,{position:"absolute",inset:"0",pointerEvents:"none",overflow:"hidden",zIndex:"15"}),e.appendChild(this.root)}update(e,t,a,i){const s=new Set;for(const o of e){if(this.tmp.copy(o.world).project(t),this.tmp.z>1||this.tmp.z<-1)continue;const r=(this.tmp.x*.5+.5)*a,c=(-this.tmp.y*.5+.5)*i;if(r<-50||c<-20||r>a+50||c>i+20)continue;s.add(o.id);let n=this.nodes.get(o.id);n||(n=this.createNode(o),this.nodes.set(o.id,n));const h=n.firstChild.nextSibling;h.textContent!==o.text&&(h.textContent=o.text);const m=h.nextSibling,p=o.sub??"";m.textContent!==p&&(m.textContent=p),n.style.transform=`translate(${r.toFixed(1)}px, ${c.toFixed(1)}px)`,n.style.display="flex"}for(const[o,r]of this.nodes)s.has(o)||(r.style.display="none")}clear(){for(const e of this.nodes.values())e.style.display="none"}createNode(e){const t=document.createElement("button");t.type="button",t.setAttribute("aria-label",e.text),Object.assign(t.style,{position:"absolute",left:"0",top:"0",display:"flex",alignItems:"center",gap:"6px",marginLeft:"-4px",marginTop:"-4px",padding:"0",background:"none",border:"none",cursor:"pointer",pointerEvents:"auto",color:e.kind==="sky"?"rgba(255,236,200,0.92)":"rgba(255,255,255,0.95)",font:"500 12px/1.1 Inter, system-ui, sans-serif",letterSpacing:"0.02em",textShadow:"0 0 3px rgba(0,0,0,0.95), 0 0 8px rgba(0,0,0,0.75)",whiteSpace:"nowrap",willChange:"transform"});const a=document.createElement("span");Object.assign(a.style,{width:e.kind==="sky"?"0":"7px",height:e.kind==="sky"?"0":"7px",borderRadius:"50%",background:"rgba(255,255,255,0.95)",boxShadow:"0 0 0 1.5px rgba(0,0,0,0.6)",flex:"none"});const i=document.createElement("span"),s=document.createElement("span");return Object.assign(s.style,{fontSize:"10px",opacity:"0.65",fontWeight:"400"}),t.append(a,i,s),t.addEventListener("click",o=>{o.stopPropagation(),this.onClick(e.id)}),t.addEventListener("mousedown",o=>o.stopPropagation()),this.root.appendChild(t),t}dispose(){this.root.remove(),this.nodes.clear()}}const Tt=class Tt{constructor(e,t){d(this,"container");d(this,"renderer");d(this,"scene");d(this,"cameraRig");d(this,"clock",new we);d(this,"transform",new Pe);d(this,"planetBundles",new Map);d(this,"orbitLinesGroup",new he);d(this,"moonOrbitLines",new Map);d(this,"latestPhysicalStates",new Map);d(this,"pendingSkyView",null);d(this,"orbitLinesEpochDays",0);d(this,"tmpMatrix",new ye);d(this,"tmpX",new M);d(this,"tmpY",new M);d(this,"tmpZ",new M);d(this,"starfield");d(this,"asteroidBelt");d(this,"raycaster",new _i);d(this,"mouse",new te);d(this,"isRunning",!0);d(this,"animationFrameId",null);d(this,"lastFrameTime",performance.now());d(this,"lens");d(this,"explorer");d(this,"surface");d(this,"labels");d(this,"surfaceSaved",[]);d(this,"selectedBody");d(this,"onTelemetryUpdate");d(this,"lastTelemetryTime",0);d(this,"skySourceCache",new Map);d(this,"pointerDownPos",{x:0,y:0});d(this,"onPointerDown",e=>{this.pointerDownPos={x:e.clientX,y:e.clientY}});d(this,"onCanvasMouseMove",e=>{var s,o;if(e.target!==this.renderer.domElement)return;const t=this.renderer.domElement.getBoundingClientRect(),a=(e.clientX-t.left)/t.width*2-1,i=-((e.clientY-t.top)/t.height)*2+1;if((o=(s=this.starfield)==null?void 0:s.externalGalaxy)!=null&&o.sagittariusAStar){const r=this.starfield.externalGalaxy.getGalacticCenterWorldPosition(),c=r.clone().project(this.cameraRig.camera);if(c.z>=-1&&c.z<=1){const n=t.width/Math.max(1,t.height),h=(a-c.x)*n,m=i-c.y,p=Math.hypot(h,m),g=this.cameraRig.camera.position.distanceTo(r)>12e3?.18:.25;if(p<g){this.renderer.domElement.style.cursor="pointer";return}}}this.renderer.domElement.style.cursor==="pointer"&&(this.renderer.domElement.style.cursor="")});d(this,"onCanvasClick",e=>{var n,h,m,p,f,g,v,S,x,b;if(e.target!==this.renderer.domElement||this.surface.isActive()||Math.hypot(e.clientX-this.pointerDownPos.x,e.clientY-this.pointerDownPos.y)>6)return;const a=this.renderer.domElement.getBoundingClientRect();this.mouse.x=(e.clientX-a.left)/a.width*2-1,this.mouse.y=-((e.clientY-a.top)/a.height)*2+1;const i=a.width/Math.max(1,a.height);if(this.lens.isMasked(this.mouse.x,this.mouse.y,i))return;const[s,o]=this.lens.outputToSceneNdc(this.mouse.x,this.mouse.y,i);if(this.mouse.set(s,o),(h=(n=this.starfield)==null?void 0:n.externalGalaxy)!=null&&h.sagittariusAStar){const D=this.starfield.externalGalaxy.getGalacticCenterWorldPosition(),P=D.clone().project(this.cameraRig.camera);if(P.z>=-1&&P.z<=1){const w=a.width/Math.max(1,a.height),y=(this.mouse.x-P.x)*w,T=this.mouse.y-P.y,k=Math.hypot(y,T),j=this.cameraRig.camera.position.distanceTo(D)>12e3?.18:.25;if(k<j){this.selectBody("Sagittarius A*",2200);return}}}this.raycaster.setFromCamera(this.mouse,this.cameraRig.camera);const r=[];this.planetBundles.forEach(D=>{r.push(D.surfaceMesh)}),(p=(m=this.starfield)==null?void 0:m.externalGalaxy)!=null&&p.sagittariusAStar&&(this.starfield.externalGalaxy.sagittariusAStar.hitMesh&&r.push(this.starfield.externalGalaxy.sagittariusAStar.hitMesh),this.starfield.externalGalaxy.sagittariusAStar.boundingMesh&&r.push(this.starfield.externalGalaxy.sagittariusAStar.boundingMesh));const c=this.raycaster.intersectObjects(r,!1);if(c.length>0){const D=c[0].object;if(D===((v=(g=(f=this.starfield)==null?void 0:f.externalGalaxy)==null?void 0:g.sagittariusAStar)==null?void 0:v.hitMesh)||D===((b=(x=(S=this.starfield)==null?void 0:S.externalGalaxy)==null?void 0:x.sagittariusAStar)==null?void 0:b.boundingMesh)||D.name.includes("sagittarius")){this.selectBody("Sagittarius A*",2200);return}for(const P of this.planetBundles.values())if(P.surfaceMesh===D){if(P.definition.name===this.selectedBody.name&&this.cameraRig.altitudeInRadii()<4)break;this.selectBody(P.definition.name);break}}});d(this,"onResize",()=>{if(!this.container)return;const e=this.container.clientWidth||window.innerWidth,t=this.container.clientHeight||window.innerHeight;this.renderer.setSize(e,t),this.cameraRig.handleResize(e,t),this.lens.setSize(e,t)});d(this,"animate",()=>{var r,c,n;if(!this.isRunning)return;this.animationFrameId=requestAnimationFrame(this.animate);const e=performance.now(),t=Math.min(Math.max((e-this.lastFrameTime)*.001,.001),.1);this.lastFrameTime=e,this.clock.update(e);const a=this.clock.getJulianDateTDB()-we.J2000_JD;this.propagateAll(a);const i=this.planetBundles.get("Sun");if(i){const h=e*.001,m=i.surfaceMesh.material;if((r=m.uniforms)!=null&&r.time&&(m.uniforms.time.value=h),i.glowMeshes)for(const p of i.glowMeshes){const f=p.material;(c=f.uniforms)!=null&&c.time&&(f.uniforms.time.value=h)}if(i.prominencesGroup){for(const p of i.prominencesGroup.children)if(p instanceof z){const f=p.material;(n=f.uniforms)!=null&&n.time&&(f.uniforms.time.value=h)}}}this.cameraRig.update(),this.surface.update();const s=this.selectedBody.name==="Sagittarius A*",o=this.cameraRig.focusedObject&&!s?this.selectedBody.name:null;if(this.explorer.update(o,this.cameraRig.camera,this.renderer.domElement.height),this.pendingSkyView&&this.explorer.getStatus().body===this.pendingSkyView.body){const h=this.pendingSkyView;this.pendingSkyView=null,this.enterSurface(h.lat,h.lon,h.place)}if(!this.surface.isActive()){const h=this.cameraRig.altitudeInRadii();this.lens.setEffectScale(isFinite(h)?R.smoothstep(h,.3,1.5):1)}this.labels.update(this.surface.isActive()?this.surface.labelItems():this.explorer.featureLabels(this.cameraRig.camera),this.cameraRig.camera,this.container.clientWidth,this.container.clientHeight),this.starfield.update(this.cameraRig.camera.position,t,this.cameraRig.getVelocity(),this.cameraRig.getZoomVelocity(),this.cameraRig.camera),this.lens.render(e*.001),this.onTelemetryUpdate&&e-this.lastTelemetryTime>=Tt.TELEMETRY_INTERVAL_MS&&(this.lastTelemetryTime=e,this.dispatchTelemetry())});this.container=e,this.onTelemetryUpdate=t,this.selectedBody=J.getBody("Mercury")||J.getAllBodies()[0],this.scene=new ss,this.scene.background=new I(131333),this.renderer=new os({antialias:!0,powerPreference:"high-performance"});const a=e.clientWidth||window.innerWidth,i=e.clientHeight||window.innerHeight;this.renderer.setSize(a,i),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.outputColorSpace=ke,this.renderer.toneMapping=Ki,this.renderer.toneMappingExposure=1.05,this.renderer.domElement.style.position="absolute",this.renderer.domElement.style.top="0",this.renderer.domElement.style.left="0",this.renderer.domElement.style.width="100%",this.renderer.domElement.style.height="100%",this.renderer.domElement.style.display="block",e.appendChild(this.renderer.domElement),this.cameraRig=new Vt(e),this.lens=new io(this.renderer,this.scene,this.cameraRig.camera),this.setupLighting(),this.starfield=new tt,this.scene.add(this.starfield.group),this.asteroidBelt=new Hs(this.transform),this.scene.add(this.asteroidBelt.mesh),this.orbitLinesGroup.visible=!1,this.scene.add(this.orbitLinesGroup),this.setupBodies(),this.explorer=new Pt(this.cameraRig,s=>{const o=this.planetBundles.get(s);return o?{name:s,bodyGroup:o.bodyGroup,surfaceMesh:o.surfaceMesh,cloudMesh:o.cloudMesh,baseMap:(()=>{var c,n;const r=o.surfaceMesh.material.uniforms;return((c=r==null?void 0:r.map)==null?void 0:c.value)??((n=r==null?void 0:r.dayMap)==null?void 0:n.value)??null})(),visualRadius:o.visualRadius,radiusKm:o.definition.physical.meanRadiusKm}:null}),this.explorer.setMaxAnisotropy(this.renderer.capabilities.getMaxAnisotropy()),this.labels=new ir(e,s=>{s.startsWith("sky:")?this.surface.lookAt(s.slice(4)):this.flyToLandmark(s)}),this.surface=new tr({camera:this.cameraRig.camera,dom:e,scene:this.scene,getBody:s=>{const o=this.planetBundles.get(s);return o?{name:s,bodyGroup:o.bodyGroup,surfaceMesh:o.surfaceMesh,visualRadius:o.visualRadius,radiusKm:o.definition.physical.meanRadiusKm}:null},getSources:()=>this.skySources(),getPositionKm:s=>{if(s==="Sun")return[0,0,0];const o=this.latestPhysicalStates.get(s);return o?o.positionKm:null},getDays:()=>this.clock.getJulianDateTDB()-we.J2000_JD,setDays:s=>{const o=s+we.J2000_JD-.0008007407407407408;this.clock.setUtcMs((o-24405875e-1)*864e5)},setSceneMode:(s,o,r)=>this.setSurfaceSceneMode(s,o,r),setGround:(s,o)=>{this.explorer.groundLight=s,this.explorer.groundHaze=o}}),this.orbitLinesEpochDays=this.clock.getJulianDateTDB()-we.J2000_JD,this.rebuildOrbitLines(),this.propagateAll(this.clock.getJulianDateTDB()-we.J2000_JD),this.scene.updateMatrixWorld(!0),this.selectBody("Mercury",1800),this.setupInteraction(),this.animate()}setupLighting(){const e=new rs(16775917,2.4,0,0);e.position.set(0,0,0),e.castShadow=!1,this.scene.add(e);const t=new ns(2238008,.25);this.scene.add(t)}setupBodies(){const e=J.getAllBodies();for(const t of e){const a=ys.createPlanet(t);this.scene.add(a.bodyGroup),this.planetBundles.set(t.name,a)}}rebuildOrbitLines(){for(;this.orbitLinesGroup.children.length>0;){const t=this.orbitLinesGroup.children[0];this.orbitLinesGroup.remove(t),t instanceof _e&&(t.geometry.dispose(),t.material.dispose())}this.moonOrbitLines.clear();const e=J.getAllBodies();for(const t of e)if(t.category!=="moon"&&t.orderFromSun>0){const a=yi.createOrbitLine(t,this.transform,this.orbitLinesEpochDays);a&&this.orbitLinesGroup.add(a)}for(const t of e)if(t.category==="moon"&&t.parentId){const a=J.getParent(t);if(a){const i=yi.createMoonOrbitLine(t,a,this.transform,this.orbitLinesEpochDays);i&&(this.orbitLinesGroup.add(i),this.moonOrbitLines.set(t.name,i))}}}setScaleMode(e){this.transform.mode!==e&&(this.transform.mode=e,this.cameraRig.distanceModel=e,this.planetBundles.forEach(t=>{const a=this.transform.getVisualRadius(t.definition);t.visualRadius=a;const s=1-(t.definition.physical.flattening||0);if(t.surfaceMesh.scale.set(a,a*s,a),t.nightMesh&&t.nightMesh.scale.set(a,a*s,a),t.cloudMesh&&t.cloudMesh.scale.set(a,a,a),t.atmosphereMesh&&t.atmosphereMesh.scale.set(a,a,a),t.ringMesh){t.ringMesh.scale.set(a,a,a);const o=t.ringMesh.material;o.uniforms&&o.uniforms.saturnRadius&&(o.uniforms.saturnRadius.value=a)}t.glowMeshes&&t.glowMeshes.forEach(o=>o.scale.set(a,a,a))}),this.rebuildOrbitLines())}skySources(){var t,a,i;const e=[];for(const s of J.getAllBodies()){const o=s.orderFromSun===0||s.category==="star",r=this.latestPhysicalStates.get(s.name);if(!o&&!r)continue;const c=this.planetBundles.get(s.name);let n=this.skySourceCache.get(s.name);if(!n){const h=c?c.surfaceMesh.material.uniforms:void 0,m=c!=null&&c.ringMesh?c.ringMesh.material.uniforms:void 0;n={name:s.name,radiusKm:s.physical.meanRadiusKm,positionKm:[0,0,0],map:((t=h==null?void 0:h.map)==null?void 0:t.value)??((a=h==null?void 0:h.dayMap)==null?void 0:a.value)??null,ringMap:((i=m==null?void 0:m.ringMap)==null?void 0:i.value)??null,orientation:new Se,colorHex:s.physical.colorHex},this.skySourceCache.set(s.name,n)}n.positionKm=o?[0,0,0]:r.positionKm,c&&n.orientation&&c.surfaceMesh.getWorldQuaternion(n.orientation),e.push(n)}return e}setSurfaceSceneMode(e,t,a){if(e){this.surfaceSaved=[];const i=s=>{s&&(this.surfaceSaved.push([s,s.visible]),s.visible=!1)};for(const[s,o]of this.planetBundles)s===t?(i(o.atmosphereMesh),i(o.cloudMesh)):i(o.bodyGroup);i(this.orbitLinesGroup);for(const s of this.moonOrbitLines.values())i(s);i(this.asteroidBelt.mesh),this.starfield.setGroundMode(!0,a)}else{for(const[i,s]of this.surfaceSaved)i.visible=s;this.surfaceSaved=[],this.starfield.setGroundMode(!1)}}enterSurface(e,t,a){var n,h;const i=this.explorer.getStatus(),s=i.body;if(!s)return!1;const o=i.landmark&&i.landmark.body===s?i.landmark:null,r=e??(o==null?void 0:o.lat)??((n=i.subCamera)==null?void 0:n.lat),c=t??(o==null?void 0:o.lon)??((h=i.subCamera)==null?void 0:h.lon);return r===void 0||c===void 0?!1:(this.cameraRig.suspended=!0,this.lens.setEffectScale(.3),this.lens.setBloomThreshold(2.5),this.surface.enter(s,r,c,a??(o==null?void 0:o.name)??null))}enterSkyView(e,t){const a=this.planetBundles.get(e);if(!a||e==="Sun")return!1;this.surface.isActive()&&this.exitSurface(!1);const i=this.standingPointFacing(e,t)??{lat:0,lon:0};return this.selectedBody=a.definition,this.explorer.clearLandmark(),this.cameraRig.surfaceMinAltitude=null,this.cameraRig.focusCinematic(a.bodyGroup,a.visualRadius,e,150,void 0,a.definition.physical.meanRadiusKm),this.pendingSkyView={body:e,lat:i.lat,lon:i.lon,place:t?`${t} in the sky`:e},!0}standingPointFacing(e,t){const a=this.planetBundles.get(e),i=this.latestPhysicalStates.get(e);if(!a||!i)return null;const s=a.surfaceMesh.getWorldQuaternion(new Se).invert(),o=g=>{const v=[g[0]-i.positionKm[0],g[1]-i.positionKm[1],g[2]-i.positionKm[2]],S=K.eclipticToThree(v);return new M(S[0],S[1],S[2]).normalize().applyQuaternion(s)},r=o([0,0,0]),c=t?this.latestPhysicalStates.get(t):null,n=c?o(c.positionKm):r.clone();let h=c?r.clone().sub(n.clone().multiplyScalar(r.dot(n))):new M(0,1,0).cross(n).negate();h.lengthSq()<1e-6&&(h=new M(0,1,0).cross(n)),h.normalize();const m=R.degToRad(50),p=n.multiplyScalar(Math.cos(m)).add(h.multiplyScalar(Math.sin(m))),f=ha(p.x,p.y,p.z);return{lat:f.lat,lon:f.lon}}exitSurface(e=!0){if(!this.surface.isActive())return;const t=this.surface.getLocation();if(this.surface.exit(),this.lens.setBloomThreshold(null),this.cameraRig.suspended=!1,this.cameraRig.syncFromCamera(),e&&t){const a=this.planetBundles.get(t.body);if(a){const i=this.explorer.surfaceDirection({name:t.body,bodyGroup:a.bodyGroup,surfaceMesh:a.surfaceMesh,visualRadius:a.visualRadius,radiusKm:a.definition.physical.meanRadiusKm},t.lat,t.lon);this.cameraRig.focusSurfacePoint(a.bodyGroup,a.visualRadius,i,a.visualRadius*.12,1800)}}}setSurfaceMagnification(e){this.surface.setMagnification(e)}setSurfaceAtmosphere(e){this.surface.setAtmosphere(e)}setSurfaceTimeOfDay(e){return this.surface.setTimeOfDay(e)}surfaceLookAt(e){this.surface.lookAt(e)}resetSurfaceZoom(){this.surface.resetZoom()}flyToLandmark(e){var a;this.surface.isActive()&&this.exitSurface(!1);const t=this.explorer.flyToLandmark(e);if(t){const i=(a=this.planetBundles.get(t.body))==null?void 0:a.definition;i&&(this.selectedBody=i)}return t}setExplorerDaylight(e){this.explorer.setDaylight(e)}getExplorerStatus(){return this.explorer.getStatus()}setLensProfile(e){this.lens.setProfile(e)}cycleLensProfile(){return this.lens.cycleProfile()}resetLook(){this.cameraRig.resetLook()}toggleConstellations(){return this.starfield.toggleConstellations()}toggleAsteroidBelt(){const e=!this.asteroidBelt.isVisible();return this.asteroidBelt.setVisible(e),e}toggleOrbits(){return this.orbitLinesGroup.visible=!this.orbitLinesGroup.visible,this.orbitLinesGroup.visible}setupInteraction(){this.renderer.domElement.addEventListener("mousedown",this.onPointerDown),this.renderer.domElement.addEventListener("mousemove",this.onCanvasMouseMove),this.renderer.domElement.addEventListener("click",this.onCanvasClick),window.addEventListener("resize",this.onResize)}selectBody(e,t=1800){var i;if((i=this.surface)!=null&&i.isActive()&&this.exitSurface(!1),e==="Sagittarius A*"||e==="Sgr A*"||e==="sagittarius_a_star"){const s=J.getSagittariusAStar();if(s){this.selectedBody=s;const o=this.starfield.externalGalaxy.sagittariusAStar.group;this.cameraRig.focusCinematic(o,180,s.name,t);return}}const a=this.planetBundles.get(e);a&&(this.selectedBody=a.definition,this.explorer.clearLandmark(),this.cameraRig.surfaceMinAltitude=null,this.cameraRig.focusCinematic(a.bodyGroup,a.visualRadius,a.definition.name,t,void 0,a.definition.physical.meanRadiusKm))}resetView(){var e;(e=this.surface)!=null&&e.isActive()&&this.exitSurface(!1),this.selectedBody=J.getBody("Sun")||J.getAllBodies()[0],this.explorer.clearLandmark(),this.cameraRig.resetToOverview(),this.cameraRig.focusedPhysicalRadiusKm=this.selectedBody.physical.meanRadiusKm}applyBodyFrame(e,t,a=0){this.tmpMatrix.makeBasis(this.tmpX.set(t.xAxis[0],t.xAxis[1],t.xAxis[2]),this.tmpY.set(t.yAxis[0],t.yAxis[1],t.yAxis[2]),this.tmpZ.set(t.zAxis[0],t.zAxis[1],t.zAxis[2])),e.bodyGroup.quaternion.setFromRotationMatrix(this.tmpMatrix),e.surfaceMesh.rotation.y=t.spinRad,e.nightMesh&&(e.nightMesh.rotation.y=t.spinRad),e.cloudMesh&&(e.cloudMesh.rotation.y=t.spinRad+a)}applyFallbackSpin(e,t){const a=e.definition;e.bodyGroup.rotation.set(0,0,R.degToRad(a.physical.axialTiltDeg||0));const i=a.physical.rotationPeriodHours||a.orbit.orbitalPeriodDays*24||24;e.surfaceMesh.rotation.y=t*24/i*Math.PI*2}propagateAll(e){const t=J.getAllBodies(),a=new Map,i=e;for(const s of t){if(s.category==="moon")continue;const o=this.planetBundles.get(s.name);if(!o)continue;if(s.orderFromSun===0)o.bodyGroup.position.set(0,0,0),a.set(s.id,[0,0,0]);else{const c=pe.propagate(s.orbit,i);this.latestPhysicalStates.set(s.name,c);const n=this.transform.toRenderPosition(c.positionKm,s);if(o.bodyGroup.position.set(n[0],n[1],n[2]),a.set(s.id,n),s.name==="Saturn"&&o.ringMesh){const h=o.ringMesh.material;h.uniforms&&h.uniforms.saturnCenter&&(h.uniforms.saturnCenter.value.set(n[0],n[1],n[2]),h.uniforms.saturnRadius.value=o.visualRadius)}}const r=ma(s.name,i);r?this.applyBodyFrame(o,r,s.name==="Earth"?i/40*Math.PI*2:0):this.applyFallbackSpin(o,i)}for(const s of t){if(s.category!=="moon"||!s.parentId)continue;const o=this.planetBundles.get(s.name);if(!o)continue;const r=J.getParent(s);if(!r)continue;const c=this.latestPhysicalStates.get(r.name),n=a.get(r.id)||[0,0,0],h=r.physical.gmKm3S2??(r.physical.massKg?r.physical.massKg*66743e-24:void 0),m=s.physical.gmKm3S2??(s.physical.massKg?s.physical.massKg*66743e-24:0),p=h!==void 0?h+m:pe.GM_SUN,f=pe.propagate(s.orbit,i,p),g=(c==null?void 0:c.positionKm)||[0,0,0],v=(c==null?void 0:c.velocityKmPerSec)||[0,0,0],S=[g[0]+f.positionKm[0],g[1]+f.positionKm[1],g[2]+f.positionKm[2]],x=[v[0]+f.velocityKmPerSec[0],v[1]+f.velocityKmPerSec[1],v[2]+f.velocityKmPerSec[2]];this.latestPhysicalStates.set(s.name,{positionKm:S,velocityKmPerSec:x,distanceKm:Math.hypot(...S),speedKmPerSec:Math.hypot(...x),trueAnomalyDeg:f.trueAnomalyDeg,eccentricAnomalyDeg:f.eccentricAnomalyDeg});const b=this.transform.toMoonRenderPosition(f.positionKm,s,n,r);o.bodyGroup.position.set(b[0],b[1],b[2]);const D=this.moonOrbitLines.get(s.name);D&&D.position.set(n[0],n[1],n[2]),s.name==="Hyperion"?this.applyFallbackSpin(o,i):this.applyBodyFrame(o,pa(f.positionKm,f.velocityKmPerSec))}this.asteroidBelt.updatePositions(i),Math.abs(i-this.orbitLinesEpochDays)>365&&(this.orbitLinesEpochDays=i,this.rebuildOrbitLines())}jumpToScale(e){if(e==="sgr_a"){this.selectBody("Sagittarius A*");return}this.cameraRig.jumpToScale(e)}dispatchTelemetry(){const e=this.latestPhysicalStates.get(this.selectedBody.name);let t=(e==null?void 0:e.distanceKm)||this.selectedBody.orbit.semiMajorAxisKm,a=(e==null?void 0:e.speedKmPerSec)||0;(this.selectedBody.id==="sagittarius_a_star"||this.selectedBody.name==="Sagittarius A*")&&(t=2553e14,a=122400);const i=new M;this.cameraRig.camera.getWorldDirection(i);const s=Math.atan2(i.x,i.z)*R.RAD2DEG,o=Math.asin(i.y)*R.RAD2DEG,r=this.cameraRig.getObserverScaleMetric(),c=this.cameraRig.getTravelSpeed(),n={id:this.selectedBody.id,name:this.selectedBody.name,category:this.selectedBody.category,parentId:this.selectedBody.parentId,parentName:this.selectedBody.parentName,distanceKm:t,apparentSpeedKmS:a,radiusKm:this.selectedBody.physical.meanRadiusKm,orbitalPeriodDays:this.selectedBody.orbit.orbitalPeriodDays,axialTiltDeg:this.selectedBody.physical.axialTiltDeg||0,colorHex:this.selectedBody.physical.colorHex||"#ffffff"};this.onTelemetryUpdate({speedKmS:a,lookAzimuthDeg:Math.round(s),lookElevationDeg:Math.round(o),activeTarget:n,timeScale:this.clock.timeMultiplier,julianDate:this.clock.getJulianDate(),utcIso:this.clock.getIsoString(),scaleMode:this.transform.mode,isPaused:this.clock.isPaused,constellationsVisible:this.starfield.areConstellationsVisible(),asteroidBeltVisible:this.asteroidBelt.isVisible(),orbitsVisible:this.orbitLinesGroup.visible,observerScaleMetric:this.surface.isActive()?(()=>{var m;const h=((m=this.surface.getStatus())==null?void 0:m.eyeHeightKm)??0;return`ON SURFACE · EYE ${h>=1?`${h.toFixed(0)} KM`:`${(h*1e3).toFixed(0)} M`}`})():r.formatted,observerDomain:r.domain,travelSpeed:Math.round(c),cameraDistance:Math.round(r.distance),lensProfile:this.lens.profile.name,explorer:this.explorer.getStatus(),surface:this.surface.getStatus()})}dispose(){this.isRunning=!1,this.animationFrameId!==null&&cancelAnimationFrame(this.animationFrameId),window.removeEventListener("resize",this.onResize),this.renderer.domElement.removeEventListener("mousedown",this.onPointerDown),this.renderer.domElement.removeEventListener("mousemove",this.onCanvasMouseMove),this.renderer.domElement.removeEventListener("click",this.onCanvasClick),this.surface.dispose(),this.labels.dispose(),this.cameraRig.dispose(),this.explorer.dispose(),this.lens.dispose(),this.starfield.dispose(),this.asteroidBelt.dispose(),this.planetBundles.forEach(e=>{e.surfaceMesh.geometry.dispose(),e.surfaceMesh.material.dispose(),e.nightMesh&&(e.nightMesh.geometry.dispose(),e.nightMesh.material.dispose()),e.cloudMesh&&(e.cloudMesh.geometry.dispose(),e.cloudMesh.material.dispose()),e.atmosphereMesh&&(e.atmosphereMesh.geometry.dispose(),e.atmosphereMesh.material.dispose()),e.ringMesh&&(e.ringMesh.geometry.dispose(),e.ringMesh.material.dispose()),e.glowMeshes&&e.glowMeshes.forEach(t=>{t.geometry.dispose(),t.material.dispose()}),e.prominencesGroup&&e.prominencesGroup.children.forEach(t=>{t instanceof z&&(t.geometry.dispose(),t.material.dispose())})}),this.renderer.dispose(),this.renderer.domElement.parentElement&&this.renderer.domElement.parentElement.removeChild(this.renderer.domElement)}};d(Tt,"TELEMETRY_INTERVAL_MS",100);let Yt=Tt;const Jt={Mercury:{name:"Mercury",category:"planet",eyebrow:"PLANET",accentColor:"#E8927C",eyebrowColor:"#fabfad",distanceAU:"0.39 AU",textureThumb:"textures/thumbs/mercury.webp",monographText:"THE CLOSEST PLANET TO THE SUN. IT CIRCLES THE SUN FASTER THAN ALL THE OTHER PLANETS, WHICH IS WHY ROMANS NAMED IT AFTER THEIR SWIFT-FOOTED MESSENGER GOD.",extendedLore:"Mercury is a world of fierce cosmic extremes. With virtually no atmosphere to trap heat, midday temperatures soar to 430°C (800°F), while the sunless night plummets to -180°C (-290°F). Its massive metallic core occupies roughly 85% of the planet's total radius, suggesting a colossal primordial impact stripped away much of its ancient silicate mantle.",missions:[{name:"Mariner 10",year:"1974–1975",agency:"NASA",role:"First flybys; mapped 45% of surface"},{name:"MESSENGER",year:"2011–2015",agency:"NASA",role:"First orbiter; discovered polar water ice in permanently shadowed craters"},{name:"BepiColombo",year:"2025–2026",agency:"ESA / JAXA",role:"Dual orbiter study of magnetosphere and exosphere"}]},Venus:{name:"Venus",category:"planet",eyebrow:"PLANET",accentColor:"#b45d15",eyebrowColor:"#e58e45",distanceAU:"0.723 AU",textureThumb:"textures/thumbs/venus_atmosphere.webp",monographText:"NAMED FOR THE ROMAN GODDESS OF LOVE AND BEAUTY. ENSHROUDED IN DENSE OPAQUE CLOUDS OF SULFURIC ACID, IT SUFFERS A RUNAWAY GREENHOUSE EFFECT WITH SURFACE TEMPERATURES REACHING 465°C.",extendedLore:"Venus is Earth's twin in diameter and mass, but an infernal counterpart in environment. A crushing supercritical carbon dioxide atmosphere exerts 92 times Earth's sea-level pressure. Venus rotates backwards compared to most planets, with the Sun rising in the west, and its day is longer than its orbital year.",missions:[{name:"Venera 7",year:"1970",agency:"Soviet Union",role:"First human spacecraft to softly land and transmit data from another planet"},{name:"Magellan",year:"1990–1994",agency:"NASA",role:"Global radar mapping revealing extensive volcanism and lava channels"},{name:"Akatsuki",year:"2015–Present",agency:"JAXA",role:"Atmospheric super-rotation and cloud dynamics investigation"}]},Earth:{name:"Earth",category:"planet",eyebrow:"PLANET",accentColor:"#26daaa",eyebrowColor:"#7bf0d0",distanceAU:"1.000 AU",textureThumb:"textures/thumbs/earth_daymap.webp",monographText:"OUR HOME AND THE ONLY KNOWN SANCTUARY OF LIFE IN THE COSMOS. A VIBRANT BLUE MARBLE ENVELOPED BY A NITROGEN-OXYGEN ATMOSPHERE, WITH LIQUID OCEANS COVERING SEVENTY PERCENT OF ITS SURFACE.",extendedLore:"Earth resides at the temperate sweet spot of the circumstellar habitable zone. Dynamic plate tectonics continuously recycle carbon, while a vigorous geodynamo generates a protective magnetosphere shielding the biosphere from solar wind stripping and high-energy galactic cosmic rays.",missions:[{name:"Apollo Program",year:"1961–1972",agency:"NASA",role:"Human lunar landings; transformed humanity's ecological perspective of Earth"},{name:"Terra & Aqua",year:"1999–Present",agency:"NASA",role:"Comprehensive global climate and ocean monitoring system"},{name:"Copernicus Sentinel",year:"2014–Present",agency:"ESA",role:"Constellation observing biosphere, ice sheets, and atmosphere"}]},Mars:{name:"Mars",category:"planet",eyebrow:"PLANET",accentColor:"#e55f45",eyebrowColor:"#fca595",distanceAU:"1.524 AU",textureThumb:"textures/thumbs/mars.webp",monographText:"THE RED PLANET, COLORED BY IRON OXIDE SPREAD ACROSS ITS WINDSWEPT DESERTS. HOME TO OLYMPUS MONS, THE TALLEST VOLCANO IN THE SOLAR SYSTEM, AND VAST DRY RIVER VALLEYS.",extendedLore:"Though frozen and desiccated today, geochemical fingerprints captured by rovers prove ancient Mars possessed lakes, river deltas, and a thicker insulating atmosphere over three billion years ago. Its thin CO2 atmosphere generates continent-scale dust storms that periodically veil the entire globe.",missions:[{name:"Viking 1 & 2",year:"1976",agency:"NASA",role:"First successful long-duration Mars surface landers and biological tests"},{name:"Curiosity",year:"2012–Present",agency:"NASA",role:"Discovered ancient habitable lacustrine environments in Gale Crater"},{name:"Perseverance",year:"2021–Present",agency:"NASA",role:"Searching for ancient microbial biosignatures and caching core samples"}]},Jupiter:{name:"Jupiter",category:"planet",eyebrow:"PLANET",accentColor:"#f59e0b",eyebrowColor:"#fcd34d",distanceAU:"5.203 AU",textureThumb:"textures/thumbs/jupiter.webp",monographText:"THE TITAN OF OUR SOLAR SYSTEM, MORE THAN TWICE AS MASSIVE AS ALL THE OTHER PLANETS COMBINED. A SWIRLING GAS GIANT DOMINATED BY THE CENTURIES-OLD GREAT RED SPOT AND NEARLY A HUNDRED KNOWN MOONS.",extendedLore:"Jupiter acted as the primary gravitational architect of the early Solar System, shaping asteroid orbits and scattering comets. Below its dynamic ammonia cloud belts, hydrogen transitions into liquid and eventually into an exotic state of liquid metallic hydrogen that conducts immense electrical currents, powering the most powerful planetary magnetic field in the system.",missions:[{name:"Voyager 1 & 2",year:"1979",agency:"NASA",role:"Discovered Jovian rings and active volcanism on Io"},{name:"Galileo",year:"1995–2003",agency:"NASA",role:"First orbiter; gathered initial evidence of subsurface ocean on Europa"},{name:"Juno",year:"2016–Present",agency:"NASA",role:"Mapping gravitational anomalies and deep atmospheric water abundance"}]},Saturn:{name:"Saturn",category:"planet",eyebrow:"PLANET",accentColor:"#b29d81",eyebrowColor:"#d4c5b0",distanceAU:"9.539 AU",textureThumb:"textures/thumbs/saturn.webp",monographText:"A MAJESTIC WORLD ADORNED BY AN EXTRAORDINARY SYSTEM OF ICY RINGS EXTENDING HUNDREDS OF THOUSANDS OF KILOMETERS INTO THE VOID, ACCOMPANIED BY THE HAZE-CLOAKED MOON TITAN.",extendedLore:"Saturn's main rings span about 282,000 km in diameter yet are astonishingly paper-thin—averaging barely 10 to 30 meters in vertical thickness. Made almost entirely of water-ice particles ranging from dust grains to house-sized boulders, the rings are sustained and sculpted by subtle gravitational resonances with shepherd moons.",missions:[{name:"Pioneer 11",year:"1979",agency:"NASA",role:"First close encounter with Saturn and discovery of the F Ring"},{name:"Cassini-Huygens",year:"2004–2017",agency:"NASA / ESA / ASI",role:"Thirteen-year orbital odyssey; landed probe on Titan, found Enceladus plumes"},{name:"Dragonfly",year:"Launching 2028",agency:"NASA",role:"Rotorcraft lander to explore prebiotic chemistry on Titan"}]},Uranus:{name:"Uranus",category:"planet",eyebrow:"PLANET",accentColor:"#8dcdd8",eyebrowColor:"#b3e8f0",distanceAU:"19.18 AU",textureThumb:"textures/thumbs/uranus.webp",monographText:"AN ICE GIANT TILTED SO DRAMATICALLY ON ITS SIDE THAT AT ITS SOLSTICES ONE POLE POINTS ALMOST DIRECTLY AT THE SUN, DRIVING EXTREME DECADES-LONG SEASONS.",extendedLore:"With an axial tilt of 97.77°, Uranus literally rolls along its orbital path like a ball. Scientists theorize a sequence of Earth-sized protoplanetary impacts knocked the giant onto its side early in solar history. Its pale aquamarine coloration originates from methane gas in its upper atmosphere absorbing red light wavelengths.",missions:[{name:"Voyager 2",year:"1986",agency:"NASA",role:"Only spacecraft to encounter Uranus; discovered 10 moons and 2 new rings"},{name:"Uranus Orbiter & Probe",year:"Proposed 2030s",agency:"NASA Decadal",role:"Flagship mission concept prioritized to explore ice giant interiors"}]},Neptune:{name:"Neptune",category:"planet",eyebrow:"PLANET",accentColor:"#4f83e2",eyebrowColor:"#7ca8ff",distanceAU:"30.06 AU",textureThumb:"textures/thumbs/neptune.webp",monographText:"THE MOST DISTANT MAJOR PLANET, SHROUDED IN AN INTENSE DEEP-AZURE METHANE ATMOSPHERE WHERE SUPERSONIC WINDS SURPASS TWO THOUSAND KILOMETERS PER HOUR.",extendedLore:"Neptune was the first planet located through mathematical prediction rather than empirical observation: slight perturbations in Uranus's orbit allowed French astronomer Urbain Le Verrier to calculate its precise position in 1846. It harbors the retrograde moon Triton, a captured Kuiper Belt dwarf world exhibiting nitrogen cryovolcanoes.",missions:[{name:"Voyager 2",year:"1989",agency:"NASA",role:"Close flyby; detected the Great Dark Spot and geysers on Triton"}]},Pluto:{name:"Pluto",category:"dwarf_planet",eyebrow:"DWARF PLANET",accentColor:"#FF8732",eyebrowColor:"#ffa463",distanceAU:"39.48 AU",textureThumb:"textures/thumbs/moon.webp",monographText:"SENTINEL OF THE KUIPER BELT, BEARING THE GLOWING NITROGEN ICE PLAINS OF TOMBAUGH REGIO AND SHARING A SYNCHRONOUS GRAVITATIONAL DANCE WITH ITS COMPANION CHARON.",extendedLore:"Reclassified as a dwarf planet in 2006, Pluto revealed itself during the 2015 New Horizons flyby as a geologically active wonderland. It features convection cells of churned nitrogen-carbon-monoxide ice, water-ice mountains towering 3,500 meters into its thin blue hazy atmosphere, and a likely deep subsurface liquid ocean.",missions:[{name:"New Horizons",year:"2015",agency:"NASA",role:"Historic historic flyby capturing high-resolution imagery of Tombaugh Regio"}]},Moon:{name:"Moon",category:"moon",eyebrow:"NATURAL SATELLITE · EARTH I",accentColor:"#d1d5db",eyebrowColor:"#e5e7eb",distanceAU:"1.000 AU",textureThumb:"textures/thumbs/moon.webp",monographText:"EARTH'S CONSTANT CELESTIAL COMPANION, TIDALLY LOCKED IN AN ANCIENT GRAVITATIONAL EMBRACE. ITS HIGHLANDS AND BASALTIC MARIA PRESERVE FOUR BILLION YEARS OF COSMIC HISTORY.",extendedLore:"Formed ~4.5 billion years ago from the debris of a giant collision between the proto-Earth and a Mars-sized protoplanet named Theia. The Moon stabilizes Earth's rotational tilt, modulating climate extremes and generating oceanic tides.",missions:[{name:"Apollo 11",year:"1969",agency:"NASA",role:"First human landing on another celestial world"},{name:"LRO",year:"2009–Present",agency:"NASA",role:"High-resolution sub-meter 3D laser altimetry and mapping"},{name:"Artemis I",year:"2022",agency:"NASA",role:"Uncrewed lunar orbital qualification flight for deep space exploration"}]},Europa:{name:"Europa",category:"moon",eyebrow:"OCEAN MOON · JUPITER II",accentColor:"#7dd3fc",eyebrowColor:"#bae6fd",distanceAU:"5.203 AU",textureThumb:"textures/thumbs/moon.webp",monographText:"A SMOOTH CRUST OF WATER ICE FRACTURED BY REDDISH LINEAE, CONCEALING A VAST GLOBAL SALTWATER OCEAN CONTAINING TWICE THE WATER OF ALL EARTH'S OCEANS COMBINED.",extendedLore:"Tidally flexed by orbital resonance with Io and Ganymede, Europa's rocky mantle produces geothermal heating that keeps its deep subsurface ocean in a liquid state. Possible water plumes detected by Hubble make it one of humankind's top destinations in the search for extraterrestrial habitability.",missions:[{name:"Galileo",year:"1995–2003",agency:"NASA",role:"Discovered induced magnetic field evidence for a subsurface saline ocean"},{name:"Europa Clipper",year:"2024–Present",agency:"NASA",role:"Dedicated mission equipped with ice-penetrating radar to confirm habitability"}]},Io:{name:"Io",category:"moon",eyebrow:"VOLCANIC MOON · JUPITER I",accentColor:"#facc15",eyebrowColor:"#fef08a",distanceAU:"5.203 AU",textureThumb:"textures/thumbs/moon.webp",monographText:"THE MOST VOLCANICALLY ACTIVE BODY IN THE SOLAR SYSTEM, SCARRED BY HUNDREDS OF ACTIVE VOLCANOES DRIVEN BY INTENSE GRAVITATIONAL TIDAL FRICTION.",extendedLore:"Caught in an eccentric resonance between Jupiter and its sibling moons, Io undergoes constant tidal flexing that generates ferocious internal heat, driving molten silicate lava lakes and sulfur plumes hundreds of kilometers into space.",missions:[{name:"Voyager 1",year:"1979",agency:"NASA",role:"First observation of active extraterrestrial volcanism"},{name:"Juno",year:"2016–Present",agency:"NASA",role:"Close flybys mapping polar volcanic hotspots and magma oceans"}]},Ganymede:{name:"Ganymede",category:"moon",eyebrow:"GIANT MOON · JUPITER III",accentColor:"#cbd5e1",eyebrowColor:"#e2e8f0",distanceAU:"5.203 AU",textureThumb:"textures/thumbs/moon.webp",monographText:"THE LARGEST MOON IN THE SOLAR SYSTEM, EVEN EXCEEDING MERCURY IN DIAMETER, AND THE ONLY SATELLITE BEARING AN INTERNALLY GENERATED MAGNETIC FIELD.",extendedLore:"Possesses a molten iron-rich core that generates an intrinsic magnetosphere. Beneath its grooved and fractured tectonic ice shell lies a deep subterranean liquid ocean separated by high-pressure ice phases.",missions:[{name:"Galileo",year:"1995–2003",agency:"NASA",role:"Identified intrinsic dipolar magnetic field"},{name:"JUICE",year:"2023–Present",agency:"ESA",role:"En route to enter permanent orbit around Ganymede in 2034"}]},Titan:{name:"Titan",category:"moon",eyebrow:"HYDROCARBON WORLD · SATURN VI",accentColor:"#f59e0b",eyebrowColor:"#fde68a",distanceAU:"9.539 AU",textureThumb:"textures/thumbs/moon.webp",monographText:"THE ONLY MOON WITH A DENSE ATMOSPHERE AND STABLE SURFACE SEAS, WHERE METHANE AND ETHANE FORM A COMPLETE METEOROLOGICAL HYDROLOGIC CYCLE.",extendedLore:"Exceeding Mercury in size, Titan possesses an orange smoggy atmosphere whose surface pressure is about 1.5 times Earth's at sea level. Cryogenic rivers carve canyon networks feeding liquid hydrocarbon seas like Kraken Mare.",missions:[{name:"Cassini-Huygens",year:"2004–2017",agency:"NASA / ESA",role:"Huygens landed directly on Titan's surface in 2005"},{name:"Dragonfly",year:"Planned 2028",agency:"NASA",role:"Rotorcraft lander to explore prebiotic organic chemistry"}]},Enceladus:{name:"Enceladus",category:"moon",eyebrow:"CRYOVOLCANIC MOON · SATURN II",accentColor:"#e0f2fe",eyebrowColor:"#f0f9ff",distanceAU:"9.539 AU",textureThumb:"textures/thumbs/moon.webp",monographText:"AN IMMACULATE WORLD OF PURE REFLECTIVE ICE, ERUPTING GIANT HYDROTHERMAL GEYSERS FROM TIGER STRIPES OVER ITS SOUTH POLAR TERRAIN.",extendedLore:"Enceladus possesses a global liquid saltwater ocean in direct physical contact with an active hydrothermal rocky seafloor. Cassini detected complex organic molecules and molecular hydrogen in its plumes, pointing to ongoing hydrothermal chemistry on the seafloor.",missions:[{name:"Cassini",year:"2005–2017",agency:"NASA / ESA",role:"Flew directly through erupting plumes, sampling water vapor, salts, and organics"}]},Ceres:{name:"Ceres",category:"dwarf_planet",eyebrow:"DWARF PLANET · ASTEROID BELT",accentColor:"#a1a1aa",eyebrowColor:"#d4d4d8",distanceAU:"2.767 AU",textureThumb:"textures/thumbs/moon.webp",monographText:"EMPRESS OF THE ASTEROID BELT, HOLDING A THIRD OF ITS ENTIRE MASS. AN ICE-RICH RELICT WORLD FEATURING RADIANT SODIUM CARBONATE SALT DOMES.",extendedLore:"Ceres is a differentiated protoplanet containing significant quantities of water ice and hydrous minerals. Occator Crater hosts the bright Cerealia Facula, formed by subsurface brine percolation and cryovolcanic extrusion.",missions:[{name:"Dawn",year:"2015–2018",agency:"NASA",role:"Orbited Ceres for three years, discovering active cryovolcanism and hydrated minerals"}]},Sun:{name:"Sun",category:"star",eyebrow:"STAR",accentColor:"#ffaa33",eyebrowColor:"#ffe4a0",distanceAU:"0.000 AU",textureThumb:"textures/thumbs/sun.webp",monographText:"THE GLOWING HEART OF OUR SYSTEM, CONTAINING OVER NINETY-NINE POINT EIGHT PERCENT OF ALL MASS. A THERMONUCLEAR ENGINE POWERING ALL LIGHT, LIFE, AND GRAVITATIONAL HARMONY.",extendedLore:"Every second in the solar core, 600 million tons of hydrogen undergo thermonuclear fusion into helium, converting 4 million tons of matter into pure radiant energy. The photon diffusion through the dense radiative zone takes over 100,000 years to reach the convective layer and escape as solar light.",missions:[{name:"SOHO",year:"1995–Present",agency:"ESA / NASA",role:"Continuous monitoring of helioseismology and coronal mass ejections"},{name:"Parker Solar Probe",year:"2018–Present",agency:"NASA",role:"Closest spacecraft to Sun, diving directly through the outer corona"},{name:"Solar Orbiter",year:"2020–Present",agency:"ESA / NASA",role:"Capturing the first close-up images of the Sun's polar regions"}]},"Sagittarius A*":{name:"Sagittarius A*",category:"black_hole",eyebrow:"SUPERMASSIVE BLACK HOLE",accentColor:"#f59e0b",eyebrowColor:"#fde68a",distanceAU:"1.71 × 10⁹ AU (26,990 LY)",textureThumb:"textures/thumbs/milky_way.webp",monographText:"THE 4.3 MILLION SOLAR MASS SUPERMASSIVE BLACK HOLE AT THE DYNAMICAL HEART OF THE MILKY WAY. ITS EVENT HORIZON TRAPS ALL LIGHT, BENDING SPACETIME INTO A RELATIVISTIC PHOTON RING.",extendedLore:"Sagittarius A* (Sgr A*) anchors the Milky Way Galaxy with a mass of 4.297 ± 0.012 × 10⁶ M☉ located 8.277 ± 0.033 kpc (~26,990 light-years) from Earth. In May 2022, the Event Horizon Telescope (EHT) collaboration released the first direct horizon-scale image of its shadow, resolving an angular diameter of 51.8 ± 2.3 microarcseconds that confirms Einstein's General Relativity. Matter orbiting near the innermost stable circular orbit (ISCO at 3.0 r_s) reaches speeds of 0.408 c (122,400 km/s), generating extreme relativistic Doppler beaming and gravitational redshift, framed by high-velocity stars of the central nuclear S-cluster.",missions:[{name:"Event Horizon Telescope (EHT)",year:"2022",agency:"Global Consortium / NSF / ESO",role:"First direct millimeter-wave imaging of Sgr A* event horizon shadow"},{name:"GRAVITY / ESO VLTI",year:"2018–Present",agency:"ESO",role:"Detection of gravitational redshift in star S2 orbit and orbital flares near ISCO"},{name:"Chandra X-ray Observatory",year:"1999–Present",agency:"NASA",role:"Long-term monitoring of hot gas accretion and high-energy flare eruptions"},{name:"Neil Gehrels Swift Observatory",year:"2004–Present",agency:"NASA",role:"Daily multiwavelength monitoring of Galactic Center flaring activity"}]}};function ar(l){return Jt[l]?Jt[l]:{name:l,category:"moon",eyebrow:"CELESTIAL BODY",accentColor:"#93c5fd",eyebrowColor:"#bfdbfe",distanceAU:"—",textureThumb:"textures/thumbs/moon.webp",monographText:`${l.toUpperCase()} IS A DOCUMENTED COMPONENT OF THE SOLAR SYSTEM CATALOGUE.`,extendedLore:`${l}'s orbit is computed from NASA JPL orbital elements (Horizons / Small-Body Database).`,missions:[]}}const sr=[{body:"Moon",facing:"Earth",label:"Earth from the Moon"},{body:"Enceladus",facing:"Saturn",label:"Saturn from Enceladus"},{body:"Mimas",facing:"Saturn",label:"Saturn from Mimas"},{body:"Iapetus",facing:"Saturn",label:"Open rings from Iapetus"},{body:"Europa",facing:"Jupiter",label:"Jupiter from Europa"},{body:"Io",facing:"Jupiter",label:"Jupiter from Io"},{body:"Phobos",facing:"Mars",label:"Mars from Phobos"},{body:"Miranda",facing:"Uranus",label:"Uranus from Miranda"},{body:"Triton",facing:"Neptune",label:"Neptune from Triton"},{body:"Charon",facing:"Pluto",label:"Pluto from Charon"},{body:"Mars",label:"Mars sky"},{body:"Titan",label:"Titan's haze"}],ga=({current:l,onGo:e})=>u.jsxs("div",{className:"border-t border-white/10 pt-2",children:[u.jsx("div",{className:"text-[9px] uppercase tracking-[0.2em] text-white/40 mb-1.5",children:"Look up from…"}),u.jsx("div",{className:"flex flex-wrap gap-1.5",children:sr.map(t=>u.jsx("button",{onClick:()=>e(t.body,t.facing),"aria-current":l===t.body?"true":void 0,className:`px-2 py-0.5 rounded-full border text-[10px] transition focus-visible:ring-1 focus-visible:ring-white/60 ${l===t.body?"border-amber-300/50 text-amber-100 bg-amber-300/10":"border-white/15 text-white/65 hover:text-white hover:border-white/35"}`,children:t.label},t.label))})]}),or={visible:"Visible light",monochrome:"Monochrome mosaic",radar:"Radar (not visible light)",atmosphere:"Cloud tops"};function rr(l){return l>=1e4?`${Math.round(l).toLocaleString("en-US")} km`:l>=10?`${l.toFixed(0)} km`:`${l.toFixed(1)} km`}function nr(l){return l>=1e3?`${(l/1e3).toFixed(l>=1e4?0:1)} km/px`:`${Math.round(l)} m/px`}function zt(l,e){return`${Math.abs(l).toFixed(2)}°${l>=0?"N":"S"} ${Math.abs(e).toFixed(2)}°${e>=0?"E":"W"}`}const lr=({status:l,onFlyToLandmark:e,onDaylight:t,onStandHere:a,onSkyFrom:i,onSelectBody:s,onResetView:o})=>{const[r,c]=C.useState(()=>typeof window>"u"||window.innerWidth>=640),[n,h]=C.useState(""),m=(l==null?void 0:l.body)??null,p=C.useMemo(()=>m?da(m):[],[m]),f=C.useMemo(()=>wo(n).slice(0,8),[n]);if(!l||!m||!l.imagery)return null;const g=l.imagery,v=l.layer;let S;return l.streaming?(v==null?void 0:v.state)==="unavailable"?S="Imagery server unreachable — showing globe map":v&&(v.inFlight>0||v.queued>0)?S=`Loading ${v.inFlight+v.queued} tiles · level ${Math.max(0,v.deepestLevel)}/${l.maxLevel}`:v?S=`Level ${Math.max(0,v.deepestLevel)}/${l.maxLevel}${v.state==="degraded"?" · some tiles failed":""}`:S="Global map only":S=g.note&&!v?"Global map only":"Zoom in to stream detail",u.jsxs("section",{"aria-label":"Planetary explorer",className:"absolute right-3 md:right-6 bottom-20 md:bottom-24 w-[300px] max-w-[calc(100vw-24px)] pointer-events-auto z-30 bg-black/55 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl text-white/80 font-light",children:[u.jsxs("div",{className:"flex items-center justify-between px-4 pt-3 pb-2 text-[10px] uppercase tracking-[0.18em]",children:[u.jsxs("nav",{"aria-label":"Breadcrumb",className:"flex items-center gap-1.5 min-w-0",children:[u.jsx("button",{onClick:o,className:"text-white/45 hover:text-white focus-visible:ring-1 focus-visible:ring-white/60 rounded",children:"Solar System"}),u.jsx("span",{className:"text-white/25",children:"›"}),u.jsx("button",{onClick:()=>s(m),className:"text-white/80 hover:text-white focus-visible:ring-1 focus-visible:ring-white/60 rounded",children:m}),l.landmark&&u.jsxs(u.Fragment,{children:[u.jsx("span",{className:"text-white/25",children:"›"}),u.jsx("span",{className:"text-amber-200/90 truncate",children:l.landmark.name})]})]}),u.jsx("button",{onClick:()=>c(x=>!x),"aria-expanded":r,"aria-label":r?"Collapse explorer panel":"Expand explorer panel",className:"text-white/40 hover:text-white px-1 focus-visible:ring-1 focus-visible:ring-white/60 rounded",children:r?"–":"+"})]}),r&&u.jsxs("div",{className:"px-4 pb-3 flex flex-col gap-2.5 text-[11px]",children:[u.jsxs("div",{className:"flex justify-between font-mono text-[10px] text-amber-200/90","aria-live":"polite",children:[u.jsxs("span",{children:["ALT ",rr(l.altitudeKm)]}),l.subCamera&&u.jsx("span",{children:zt(l.subCamera.lat,l.subCamera.lon)})]}),u.jsxs("button",{onClick:a,className:"w-full flex items-center justify-between px-3 py-1.5 rounded-xl border border-amber-300/30 bg-amber-300/10 text-amber-50 hover:bg-amber-300/20 hover:border-amber-300/50 transition text-[11px] focus-visible:ring-1 focus-visible:ring-white/60",children:[u.jsxs("span",{children:["Stand ",l.landmark?`at ${l.landmark.name}`:"here"," · look up"]}),u.jsx("span",{"aria-hidden":!0,children:"↑"})]}),l.streaming&&l.sunElevationDeg!==null&&u.jsxs("div",{className:"flex items-center justify-between text-[10px] text-white/50",children:[u.jsx("span",{children:l.sunElevationDeg>0?`Sun ${l.sunElevationDeg.toFixed(0)}° above horizon`:`Night side · Sun ${Math.abs(l.sunElevationDeg).toFixed(0)}° below horizon`}),u.jsx("button",{onClick:()=>t(l.lighting==="sun"),"aria-pressed":l.lighting==="sun",title:"Auto lights the map evenly near the ground, like a web map; Real sun keeps the true day and night",className:`px-2 py-0.5 rounded-full border transition ${l.lighting==="sun"?"border-amber-300/50 text-amber-100 bg-amber-300/10":"border-white/15 text-white/60 hover:text-white"}`,children:"Real sunlight"})]}),u.jsxs("div",{className:"text-[10px] text-white/55",children:[S,l.atZoomLimit&&u.jsx("span",{className:"text-white/40",children:" · zoom limit of the source data"})]}),u.jsxs("div",{className:"border-t border-white/10 pt-2",children:[u.jsx("div",{className:"text-white/85",children:g.title}),u.jsxs("div",{className:"text-[10px] text-white/45 mt-0.5",children:[u.jsx("span",{className:"uppercase tracking-[0.14em] text-white/60",children:or[g.kind]})," · ","best ",nr(g.bestMetresPerPixel)]}),u.jsx("div",{className:"text-[10px] text-white/40 mt-1 leading-snug",children:g.coverage}),g.note&&u.jsx("div",{className:"text-[10px] text-white/40 mt-1 leading-snug",children:g.note}),u.jsx("div",{className:"text-[9px] text-white/35 mt-1 leading-snug",children:g.attribution}),u.jsx("a",{href:g.sourceUrl,target:"_blank",rel:"noopener noreferrer",className:"text-[10px] text-white/45 underline hover:text-white/80 mt-1 inline-block",children:g.source})]}),p.length>0&&u.jsxs("div",{className:"border-t border-white/10 pt-2",children:[u.jsx("div",{className:"text-[9px] uppercase tracking-[0.2em] text-white/40 mb-1.5",children:"Landmarks"}),u.jsx("div",{className:"flex flex-wrap gap-1.5",children:p.map(x=>{var b,D;return u.jsx("button",{onClick:()=>e(x.id),title:`${x.description} (${zt(x.lat,x.lon)} · ${x.source})`,"aria-current":((b=l.landmark)==null?void 0:b.id)===x.id?"true":void 0,className:`px-2 py-0.5 rounded-full border text-[10px] transition ${((D=l.landmark)==null?void 0:D.id)===x.id?"border-amber-300/50 text-amber-100 bg-amber-300/10":"border-white/15 text-white/65 hover:text-white hover:border-white/35"}`,children:x.name},x.id)})})]}),l.landmark&&u.jsxs("div",{className:"text-[10px] text-white/55 leading-snug",children:[l.landmark.description,u.jsxs("div",{className:"text-white/35 mt-0.5",children:[zt(l.landmark.lat,l.landmark.lon)," · ",l.landmark.source]})]}),u.jsx(ga,{current:null,onGo:i}),u.jsxs("div",{className:"border-t border-white/10 pt-2",children:[u.jsx("input",{type:"search",value:n,onChange:x=>h(x.target.value),placeholder:"Search landmarks on any world","aria-label":"Search landmarks",className:"w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-[11px] text-white placeholder:text-white/30 outline-none focus:border-white/35"}),f.length>0&&u.jsx("ul",{className:"mt-1.5 flex flex-col gap-0.5",role:"list",children:f.map(x=>u.jsx("li",{children:u.jsxs("button",{onClick:()=>{e(x.id),h("")},className:"w-full text-left flex justify-between px-2 py-1 rounded-md hover:bg-white/10 focus-visible:ring-1 focus-visible:ring-white/60",children:[u.jsx("span",{className:"text-white/80",children:x.name}),u.jsx("span",{className:"text-white/35",children:x.body})]})},x.id))})]})]})]})},cr=[{value:1,label:"Real"},{value:10,label:"×10"},{value:100,label:"×100"},{value:1e3,label:"Poster"}],hr=["N","NE","E","SE","S","SW","W","NW"],Kt=l=>hr[Math.round(l/45)%8];function dr(l,e){return`${Math.abs(l).toFixed(2)}°${l>=0?"N":"S"} ${Math.abs(e).toFixed(2)}°${e>=0?"E":"W"}`}function ur(l){return l>=3600?`${(l/3600).toFixed(1)}°`:l>=60?`${(l/60).toFixed(1)}′`:`${l.toFixed(l<10?1:0)}″`}const mr=({status:l,onAction:e})=>{const[t,a]=C.useState(()=>typeof window>"u"||window.innerWidth>=640),i=l,s=i.sunAltDeg>-.833,o="px-2 py-0.5 rounded-full border text-[10px] transition focus-visible:ring-1 focus-visible:ring-white/60",r="border-white/15 text-white/65 hover:text-white hover:border-white/35",c="border-amber-300/50 text-amber-100 bg-amber-300/10";return u.jsxs("section",{"aria-label":"Surface view",className:"absolute right-3 md:right-6 bottom-20 md:bottom-24 w-[310px] max-w-[calc(100vw-24px)] max-h-[calc(100vh-180px)] overflow-y-auto pointer-events-auto z-30 bg-black/55 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl text-white/80 font-light",children:[u.jsxs("div",{className:"flex items-center justify-between px-4 pt-3 pb-2 text-[10px] uppercase tracking-[0.18em]",children:[u.jsxs("div",{className:"min-w-0 truncate",children:[u.jsx("span",{className:"text-white/45",children:"On "}),u.jsx("span",{className:"text-white/90",children:i.body}),i.place&&u.jsxs("span",{className:"text-amber-200/90",children:[" · ",i.place]})]}),u.jsxs("div",{className:"flex items-center gap-1",children:[u.jsx("button",{onClick:()=>e({type:"exit"}),className:"normal-case tracking-normal text-[10px] px-2 py-0.5 rounded-full border border-white/20 text-white/80 hover:text-white hover:border-white/50",children:"Back to orbit"}),u.jsx("button",{onClick:()=>a(n=>!n),"aria-expanded":t,"aria-label":t?"Collapse surface panel":"Expand surface panel",className:"text-white/40 hover:text-white px-1 rounded focus-visible:ring-1 focus-visible:ring-white/60",children:t?"–":"+"})]})]}),t&&u.jsxs("div",{className:"px-4 pb-3 flex flex-col gap-2.5 text-[11px]",children:[u.jsxs("div",{className:"flex justify-between font-mono text-[10px] text-amber-200/90","aria-live":"polite",children:[u.jsx("span",{children:dr(i.lat,i.lon)}),u.jsxs("span",{children:["Facing ",Kt(i.headingDeg)," · ",i.pitchDeg.toFixed(0),"° up"]})]}),u.jsx("div",{className:"text-[10px] text-white/55",children:s?`Sun ${i.sunAltDeg.toFixed(0)}° above the horizon (${Kt(i.sunAzDeg)})`:`Night · Sun ${Math.abs(i.sunAltDeg).toFixed(0)}° below the horizon`}),u.jsxs("div",{children:[u.jsx("div",{className:"text-[9px] uppercase tracking-[0.2em] text-white/40 mb-1",children:"Jump to local"}),u.jsx("div",{className:"flex flex-wrap gap-1.5",children:["sunrise","noon","sunset","night"].map(n=>u.jsx("button",{onClick:()=>e({type:"time",what:n}),className:`${o} ${r} capitalize`,children:n},n))})]}),u.jsxs("div",{className:"border-t border-white/10 pt-2",children:[u.jsx("div",{className:"text-[9px] uppercase tracking-[0.2em] text-white/40 mb-1",children:"Planet sizes in the sky"}),u.jsx("div",{className:"flex flex-wrap gap-1.5",children:cr.map(n=>u.jsx("button",{onClick:()=>e({type:"magnification",value:n.value}),"aria-pressed":i.magnification===n.value,className:`${o} ${i.magnification===n.value?c:r}`,children:n.label},n.value))}),i.magnification>1&&u.jsxs("div",{className:"text-[10px] text-amber-200/70 mt-1 leading-snug",children:["Artistic view: planets and moons drawn ",i.magnification,"× larger than they really look (the Sun is not enlarged)."]})]}),u.jsxs("div",{className:"flex items-center justify-between text-[10px] text-white/55",children:[u.jsxs("span",{children:["Lens ",i.fovDeg<10?i.fovDeg.toFixed(1):i.fovDeg.toFixed(0),"° · scroll to zoom"]}),i.fovDeg<69&&u.jsx("button",{onClick:()=>e({type:"resetZoom"}),className:`${o} ${r}`,children:"Reset zoom"})]}),i.atmosphereKind!=="none"&&u.jsxs("div",{className:"flex items-start justify-between gap-2 text-[10px] text-white/45",children:[u.jsx("span",{className:"leading-snug",children:i.atmosphereLabel}),u.jsx("button",{onClick:()=>e({type:"atmosphere",on:!i.atmosphereOn}),"aria-pressed":!i.atmosphereOn,className:`${o} ${i.atmosphereOn?r:c} shrink-0`,children:i.atmosphereOn?"Hide air":"Show air"})]}),i.atmosphereKind==="none"&&u.jsx("div",{className:"text-[10px] text-white/45",children:"No atmosphere: the sky is black even by day."}),u.jsxs("div",{className:"border-t border-white/10 pt-2",children:[u.jsx("div",{className:"text-[9px] uppercase tracking-[0.2em] text-white/40 mb-1",children:"Above the horizon now"}),i.objects.length===0&&u.jsx("div",{className:"text-[10px] text-white/45",children:i.atmosphereKind==="overcast"&&i.atmosphereOn?'The clouds hide the sky — try "Hide air".':"Nothing bright enough right now."}),u.jsx("ul",{className:"flex flex-col gap-0.5",role:"list",children:i.objects.map(n=>u.jsx("li",{children:u.jsxs("button",{onClick:()=>e({type:"lookAt",name:n.name}),className:"w-full text-left grid grid-cols-[1fr_auto_auto] gap-2 px-2 py-1 rounded-md hover:bg-white/10 focus-visible:ring-1 focus-visible:ring-white/60",children:[u.jsx("span",{className:"text-white/85 truncate",children:n.name}),u.jsxs("span",{className:"text-white/45 font-mono text-[10px]",children:[n.altDeg.toFixed(0),"° ",Kt(n.azDeg)]}),u.jsx("span",{className:"text-white/35 font-mono text-[10px] w-[64px] text-right",children:n.diameterArcsec>=60?ur(n.diameterArcsec):`${n.magnitude.toFixed(1)}m`})]})},n.name))})]}),u.jsx(ga,{current:i.body,onGo:(n,h)=>e({type:"skyFrom",body:n,facing:h})}),u.jsx("div",{className:"text-[9px] text-white/35 leading-snug",children:"Drag to look around · scroll to zoom like a telescope · double-click to reset · Esc to leave"})]})]})};/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pr=l=>l.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),fa=(...l)=>l.filter((e,t,a)=>!!e&&e.trim()!==""&&a.indexOf(e)===t).join(" ").trim();/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var gr={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fr=C.forwardRef(({color:l="currentColor",size:e=24,strokeWidth:t=2,absoluteStrokeWidth:a,className:i="",children:s,iconNode:o,...r},c)=>C.createElement("svg",{ref:c,...gr,width:e,height:e,stroke:l,strokeWidth:a?Number(t)*24/Number(e):t,className:fa("lucide",i),...r},[...o.map(([n,h])=>C.createElement(n,h)),...Array.isArray(s)?s:[s]]));/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const De=(l,e)=>{const t=C.forwardRef(({className:a,...i},s)=>C.createElement(fr,{ref:s,iconNode:e,className:fa(`lucide-${pr(l)}`,a),...i}));return t.displayName=`${l}`,t};/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vr=De("Calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xr=De("EyeOff",[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yr=De("Eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const br=De("Pause",[["rect",{x:"14",y:"4",width:"4",height:"16",rx:"1",key:"zuxfzm"}],["rect",{x:"6",y:"4",width:"4",height:"16",rx:"1",key:"1okwgv"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wr=De("Play",[["polygon",{points:"6 3 20 12 6 21 6 3",key:"1oa8hb"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mr=De("RotateCcw",[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Oi=De("Search",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bt=De("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]),Sr=["Sagittarius A*","Pluto","Neptune","Uranus","Saturn","Jupiter","Mars","Earth","Venus","Mercury"],Pr=({telemetry:l,onSelectPlanet:e,onResetView:t,onTogglePlay:a,onSetTimeMultiplier:i,onSetScaleMode:s,onSeekDate:o,onResetToJ2000:r,onResetToNow:c,onToggleConstellations:n,onToggleAsteroidBelt:h,onToggleOrbits:m,onJumpToScale:p,onSetLens:f,onCycleLens:g,onFlyToLandmark:v,onExplorerDaylight:S,onSurface:x})=>{var di,ui;const b=l==null?void 0:l.activeTarget,D=(l==null?void 0:l.isPaused)??!1,P=(l==null?void 0:l.timeScale)??1,w=(l==null?void 0:l.scaleMode)??"exploration",y=(l==null?void 0:l.julianDate)??2451545,T=(l==null?void 0:l.utcIso)??new Date().toISOString(),k=(l==null?void 0:l.constellationsVisible)??!0,N=(l==null?void 0:l.asteroidBeltVisible)??!0,j=(l==null?void 0:l.orbitsVisible)??!0,G=(l==null?void 0:l.observerScaleMetric)??"1.00 AU",ne=(l==null?void 0:l.lensProfile)??"cinematic",O=(l==null?void 0:l.observerDomain)??"inner_system",$=(l==null?void 0:l.travelSpeed)??0,X=!!((di=l==null?void 0:l.surface)!=null&&di.active),ie=X||(((ui=l==null?void 0:l.explorer)==null?void 0:ui.altitudeRadii)??1/0)<1.2,[ae,le]=C.useState(!0),[U,me]=C.useState(!1),[kt,Ve]=C.useState(!1),[Le,va]=C.useState("all"),[ot,xa]=C.useState(""),[rt,ai]=C.useState(T.slice(0,10)),[Te,nt]=C.useState(!1),[si,lt]=C.useState(!1),[oi,It]=C.useState(0),[ri,Ot]=C.useState(!0),[ya,ct]=C.useState(!1),[ni,li]=C.useState(!1);C.useEffect(()=>{if(typeof window<"u"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches){It(2);return}const A=setTimeout(()=>It(1),500),E=setTimeout(()=>It(2),1200);return()=>{clearTimeout(A),clearTimeout(E)}},[]),C.useEffect(()=>{const A=E=>{E.target instanceof HTMLInputElement||E.target instanceof HTMLTextAreaElement||(E.key===" "||E.code==="Space"?(E.preventDefault(),a()):E.key==="h"||E.key==="H"?(E.preventDefault(),le(ge=>!ge)):E.key==="Escape"?U?me(!1):kt||Te?(Ve(!1),nt(!1)):X?x==null||x({type:"exit"}):t():E.key==="o"||E.key==="O"?m==null||m():E.key==="c"||E.key==="C"?n==null||n():E.key==="b"||E.key==="B"?h==null||h():(E.key==="l"||E.key==="L")&&(g==null||g()))};return window.addEventListener("keydown",A),()=>window.removeEventListener("keydown",A)},[a,m,n,h,g,t,U,kt,Te]),C.useEffect(()=>{!si&&!Te&&ai(T.slice(0,10))},[T,si,Te]);const Q=(b==null?void 0:b.name)||"Mercury",de=C.useMemo(()=>ar(Q),[Q]),We=C.useMemo(()=>{const A=[...J.getAllBodies()],E=J.getSagittariusAStar();return E&&A.unshift(E),A},[]),Y=C.useMemo(()=>Q==="Sagittarius A*"||Q==="Sgr A*"||Q==="sagittarius_a_star"?J.getSagittariusAStar():J.getBody(Q),[Q]),[ba,ci]=C.useState(1),hi=C.useRef(null);C.useEffect(()=>{Q!==hi.current&&(hi.current=Q,ci(A=>A+1))},[Q]),C.useEffect(()=>{if(Ot(!0),ct(!1),ni)return;const A=setTimeout(()=>{ct(!0)},5500),E=setTimeout(()=>{Ot(!1),ct(!1)},7100);return()=>{clearTimeout(A),clearTimeout(E)}},[ba,ni]);const ht=C.useCallback(()=>{Ot(!0),ct(!1),ci(A=>A+1)},[]),wa=C.useMemo(()=>We.filter(A=>{if(Le==="planet"&&A.category!=="planet"||Le==="moon"&&A.category!=="moon"||Le==="minor"&&A.category!=="asteroid"&&A.category!=="dwarf_planet")return!1;if(ot.trim()){const E=ot.toLowerCase();return A.name.toLowerCase().includes(E)||A.category.toLowerCase().includes(E)||A.parentName&&A.parentName.toLowerCase().includes(E)}return!0}),[We,Le,ot]),Ma=A=>{A.preventDefault(),lt(!1);const E=Date.parse(rt);isNaN(E)||(o(E),nt(!1))},Sa=[{label:"1×",val:1},{label:"10×",val:10},{label:"100×",val:100},{label:"1 D/S",val:86400},{label:"1 M/S",val:2592e3},{label:"1 Y/S",val:31536e3}],Pa="/solaris/";return ae?u.jsxs("div",{className:"absolute inset-0 pointer-events-none select-none flex flex-col justify-between p-3 md:p-6 z-20 font-sans text-white/90 overflow-hidden",children:[u.jsx("div",{className:"absolute -top-16 left-1/2 -translate-x-1/2 w-[540px] h-32 rounded-[100%] bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-transparent blur-3xl pointer-events-none"}),u.jsxs("header",{className:"flex flex-col md:flex-row md:justify-between items-start gap-2 pointer-events-auto w-full z-30",children:[u.jsxs("div",{className:`flex flex-col gap-1.5 transition-all duration-1000 ${oi>=0?"opacity-100 translate-y-0":"opacity-0 -translate-y-4"}`,children:[u.jsxs("div",{className:"flex items-baseline gap-3 relative group cursor-pointer",onClick:t,onKeyDown:A=>{(A.key==="Enter"||A.key===" ")&&(A.preventDefault(),t())},role:"button",tabIndex:0,"aria-label":"SOLARIS — reset to system overview",title:"Reset to Solaris Overview",children:[u.jsx("div",{className:"absolute -inset-2 bg-gradient-to-r from-amber-500/10 via-white/5 to-transparent rounded-lg blur-md opacity-40 group-hover:opacity-90 transition-opacity animate-corona-aura pointer-events-none"}),u.jsx("h1",{className:"relative text-xl md:text-2xl uppercase tracking-[0.52em] font-extralight drop-shadow-md select-none animate-solaris-shimmer",children:"SOLARIS"}),u.jsx("span",{className:"text-[9px] uppercase tracking-[0.32em] text-white/35 font-light hidden 2xl:inline",children:"Solar System Explorer"})]}),u.jsxs("div",{className:"flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-light text-white/60 bg-black/40 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/10 shadow-lg w-fit max-w-full mt-0.5 flex-wrap md:flex-nowrap md:whitespace-nowrap",children:[u.jsx("span",{className:`w-1.5 h-1.5 rounded-full ${D?"bg-amber-400":"bg-emerald-400 animate-pulse"}`}),u.jsxs("span",{className:"text-white/85",children:[T.replace("T"," ").slice(0,19)," UTC"]}),u.jsx("span",{className:"text-white/20",children:"·"}),u.jsxs("span",{children:["JD ",y.toFixed(2)]}),u.jsx("span",{className:"text-white/20",children:"·"}),u.jsx("span",{className:"text-amber-300/90 font-mono tracking-wider",children:G})]})]}),u.jsxs("div",{className:`hidden ${ie?"":"xl:flex"} items-center gap-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-1 shadow-lg pointer-events-auto`,children:[u.jsxs("div",{className:"flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] tracking-[0.2em] font-light",children:[u.jsx("span",{className:`w-1.5 h-1.5 rounded-full ${$>4?"bg-cyan-400 animate-ping":"bg-amber-400"}`}),u.jsx("span",{className:"text-white/40 uppercase",children:"SCALE:"}),u.jsx("span",{className:"text-white font-medium tracking-[0.12em]",children:G})]}),u.jsxs("div",{className:"flex items-center gap-0.5 text-[9px] uppercase tracking-[0.2em] font-light",children:[u.jsx("button",{onClick:()=>p==null?void 0:p("planetary"),className:`px-2.5 py-1 rounded-full transition-all duration-200 ${O==="planetary"?"bg-white/20 text-white font-medium shadow-sm border border-white/25":"text-white/40 hover:text-white/80"}`,children:"Planet"}),u.jsx("button",{onClick:()=>p==null?void 0:p("inner_system"),className:`px-2.5 py-1 rounded-full transition-all duration-200 ${O==="inner_system"?"bg-white/20 text-white font-medium shadow-sm border border-white/25":"text-white/40 hover:text-white/80"}`,children:"Inner Sys"}),u.jsx("button",{onClick:()=>p==null?void 0:p("outer_system"),className:`px-2.5 py-1 rounded-full transition-all duration-200 ${O==="outer_system"?"bg-white/20 text-white font-medium shadow-sm border border-white/25":"text-white/40 hover:text-white/80"}`,children:"Outer Sys"}),u.jsx("button",{onClick:()=>p==null?void 0:p("interstellar"),className:`px-2.5 py-1 rounded-full transition-all duration-200 ${O==="interstellar"?"bg-cyan-400/25 text-cyan-200 font-medium shadow-sm border border-cyan-400/35":"text-white/40 hover:text-white/80"}`,children:"Interstellar"}),u.jsx("button",{onClick:()=>p==null?void 0:p("galactic"),className:`px-2.5 py-1 rounded-full transition-all duration-200 ${O==="galactic"&&Q!=="Sagittarius A*"?"bg-purple-400/25 text-purple-200 font-medium shadow-sm border border-purple-400/35":"text-white/40 hover:text-white/80"}`,children:"Milky Way"}),u.jsx("button",{onClick:()=>{p==null||p("sgr_a"),e("Sagittarius A*"),ht()},className:`px-2.5 py-1 rounded-full transition-all duration-200 ${Q==="Sagittarius A*"?"bg-amber-500/30 text-amber-200 font-medium shadow-sm border border-amber-500/40":"text-white/40 hover:text-white/80"}`,children:"Sgr A*"})]})]}),u.jsxs("div",{className:"flex flex-wrap items-center justify-start md:justify-end gap-2 min-w-0",children:[u.jsxs("div",{className:"flex items-center bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-0.5 text-[10px] uppercase tracking-[0.2em] font-light shadow-lg",children:[u.jsx("button",{onClick:A=>{A.stopPropagation(),m==null||m()},title:"Toggle Orbit Lines (O)","aria-pressed":j,className:`px-3 py-1 rounded-full transition-all duration-200 ${j?"bg-white/15 text-white shadow-sm border border-white/20":"text-white/40 hover:text-white/80"}`,children:"Orbits"}),u.jsx("button",{onClick:A=>{A.stopPropagation(),n==null||n()},title:"Toggle constellation figures (C)","aria-pressed":k,className:`px-3 py-1 rounded-full transition-all duration-200 ${k?"bg-white/15 text-white shadow-sm border border-white/20":"text-white/40 hover:text-white/80"}`,children:"Constellations"}),u.jsx("button",{onClick:A=>{A.stopPropagation(),h==null||h()},title:"Toggle Asteroid Belt (B)","aria-pressed":N,className:`px-3 py-1 rounded-full transition-all duration-200 ${N?"bg-white/15 text-white shadow-sm border border-white/20":"text-white/40 hover:text-white/80"}`,children:"Belt"})]}),u.jsxs("div",{className:"flex items-center bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-0.5 text-[10px] uppercase tracking-[0.2em] font-light shadow-lg",children:[u.jsx("button",{onClick:A=>{A.stopPropagation(),s("exploration")},"aria-pressed":w==="exploration",title:"Compressed distances and enlarged bodies for exploring",className:`px-3 py-1 rounded-full transition-all duration-200 ${w==="exploration"?"bg-white/15 text-white shadow-sm border border-white/20":"text-white/40 hover:text-white/80"}`,children:"Exploration"}),u.jsx("button",{onClick:A=>{A.stopPropagation(),s("scientific")},"aria-pressed":w==="scientific",title:"Orbital distances to true scale (1 unit = 1,000,000 km); globes are enlarged 4× (minimum 15,000 km) so they stay visible",className:`px-3 py-1 rounded-full transition-all duration-200 ${w==="scientific"?"bg-white/15 text-white shadow-sm border border-white/20":"text-white/40 hover:text-white/80"}`,children:"True Distances"})]}),u.jsx("div",{className:"flex items-center bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-0.5 text-[10px] uppercase tracking-[0.2em] font-light shadow-lg",role:"group","aria-label":"Camera lens (L)",children:vt.map(A=>u.jsx("button",{onClick:E=>{E.stopPropagation(),f==null||f(A)},"aria-pressed":ne===A,title:`${St[A].label} lens (L cycles)`,className:`px-3 py-1 rounded-full transition-all duration-200 ${ne===A?"bg-white/15 text-white shadow-sm border border-white/20":"text-white/40 hover:text-white/80"}`,children:St[A].label},A))}),u.jsxs("button",{onClick:A=>{A.stopPropagation(),Ve(!0)},className:"flex items-center gap-1.5 px-3.5 py-1.5 bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/10 hover:border-white/20 rounded-full text-[10px] uppercase tracking-[0.2em] font-light text-white/80 transition shadow-lg",children:[u.jsx(Oi,{size:11,className:"text-white/50"}),u.jsxs("span",{children:["Catalogue (",We.length,")"]})]}),u.jsxs("button",{onClick:A=>{A.stopPropagation(),t()},title:"Reset to System Overview",className:"flex items-center gap-1.5 px-3.5 py-1.5 bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/10 hover:border-white/20 rounded-full text-[10px] uppercase tracking-[0.2em] font-light text-white/80 transition shadow-lg",children:[u.jsx(Mr,{size:11,className:"text-white/50"}),u.jsx("span",{children:"Overview"})]}),u.jsx("button",{onClick:A=>{A.stopPropagation(),le(!1)},title:"Hide Interface (H)","aria-label":"Hide interface",className:"p-2 bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/10 rounded-full text-white/40 hover:text-white transition shadow-lg",children:u.jsx(xr,{size:12})})]})]}),u.jsx("nav",{className:`absolute left-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-3 [@media(max-height:720px)]:gap-1 [@media(max-height:720px)]:top-[calc(50%+28px)] [@media(max-height:560px)]:hidden pointer-events-auto transition-all duration-1000 z-30 ${oi>=1?X?"opacity-0 -translate-x-8 pointer-events-none":ie?"opacity-40 hover:opacity-100 translate-x-0":"opacity-100 translate-x-0":"opacity-0 -translate-x-8"}`,children:Sr.map(A=>{const E=Jt[A],ge=Q===A,Aa=`${Pa}${(E==null?void 0:E.textureThumb)||"textures/2k_moon.jpg"}`;return u.jsxs("button",{"aria-current":ge?"true":void 0,"aria-label":`Fly to ${A}`,onClick:Da=>{Da.stopPropagation(),A==="Sagittarius A*"&&(p==null||p("sgr_a")),e(A),ht()},className:"flex items-center gap-3.5 group text-left cursor-pointer transition-all duration-200 outline-none focus-visible:ring-1 focus-visible:ring-white/60 rounded",children:[u.jsx("div",{className:`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${ge?"border-white":"border-white/35 group-hover:border-white/60"}`,children:ge&&u.jsx("div",{className:"w-1.5 h-1.5 rounded-full bg-white transition-transform scale-100"})}),ge?u.jsx("div",{className:"h-2.5 rounded-sm transition-all duration-300",style:{backgroundColor:(E==null?void 0:E.accentColor)||"#ffffff",width:"28px",boxShadow:`0 0 10px ${(E==null?void 0:E.accentColor)||"#ffffff"}88`}}):u.jsx("div",{className:"w-6 h-6 rounded-full bg-cover bg-center transition-opacity duration-200 opacity-60 group-hover:opacity-90 flex-shrink-0",style:{backgroundImage:`url(${Aa})`,boxShadow:"inset -2px -4px 5px 1px rgba(0,0,0,0.9), inset 1px 1px 2px rgba(255,255,255,0.2)"}}),u.jsxs("div",{className:"flex flex-col",children:[u.jsx("span",{className:`text-[11px] uppercase tracking-[0.22em] transition-colors duration-200 ${ge?"text-white font-medium":"text-white/40 group-hover:text-white/80"}`,children:A}),u.jsx("span",{className:`text-[9px] tracking-wider transition-colors duration-200 font-light ${ge?"text-white/50":"text-white/20 group-hover:text-white/40"}`,children:(E==null?void 0:E.distanceAU)||""})]})]},A)})}),ri&&!ie&&u.jsx("section",{onMouseEnter:()=>li(!0),onMouseLeave:()=>li(!1),className:"absolute left-1/2 bottom-20 md:bottom-24 -translate-x-1/2 pointer-events-auto select-none z-20",children:u.jsxs("div",{className:`flex flex-col items-center text-center max-w-2xl px-6 ${ya?"monograph-vanishing":"monograph-visible"}`,children:[u.jsx("span",{className:"text-[11px] md:text-xs uppercase tracking-[0.52em] font-light transition-colors duration-500 mb-1",style:{color:de.eyebrowColor},children:de.eyebrow}),u.jsx("h2",{className:"text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight tracking-[0.2em] sm:tracking-[0.36em] text-white uppercase drop-shadow-2xl my-1.5 transition-all duration-500",children:Q}),u.jsx("p",{className:"text-[10px] md:text-[11px] lg:text-[12px] font-light tracking-[0.20em] leading-relaxed text-white/75 uppercase max-w-xl mx-auto my-3 text-center transition-all duration-500",children:de.monographText}),u.jsxs("button",{onClick:A=>{A.stopPropagation(),me(!0)},className:"group mt-2.5 flex flex-col items-center cursor-pointer transition-all duration-300 outline-none focus-visible:ring-1 focus-visible:ring-white/60 rounded",children:[u.jsx("span",{className:"text-xs uppercase tracking-[0.32em] font-light transition-colors duration-300",style:{color:de.accentColor},children:"READ MORE"}),u.jsx("div",{className:"h-[1px] w-full mt-1 transition-all duration-300 group-hover:w-[115%]",style:{backgroundColor:de.accentColor,boxShadow:`0 0 6px ${de.accentColor}66`}})]})]})}),!ri&&!ie&&u.jsx("div",{className:"absolute left-1/2 bottom-20 -translate-x-1/2 pointer-events-auto z-20 transition-all duration-700 opacity-60 hover:opacity-100",children:u.jsxs("button",{onClick:A=>{A.stopPropagation(),ht()},className:"flex items-center gap-2 px-3.5 py-1 text-[10px] uppercase tracking-[0.25em] font-light text-white/60 hover:text-white bg-black/40 hover:bg-black/80 backdrop-blur-md border border-white/10 hover:border-white/25 rounded-full transition-all shadow-lg cursor-pointer",children:[u.jsx("span",{className:"w-1.5 h-1.5 rounded-full animate-pulse",style:{backgroundColor:de.accentColor}}),u.jsxs("span",{children:[Q," Overview"]})]})}),X&&(l!=null&&l.surface)?u.jsx(mr,{status:l.surface,onAction:A=>x==null?void 0:x(A)}):u.jsx(lr,{status:l==null?void 0:l.explorer,onFlyToLandmark:A=>v==null?void 0:v(A),onDaylight:A=>S==null?void 0:S(A),onStandHere:()=>x==null?void 0:x({type:"enter"}),onSkyFrom:(A,E)=>x==null?void 0:x({type:"skyFrom",body:A,facing:E}),onSelectBody:e,onResetView:t}),u.jsxs("footer",{className:"flex flex-col items-center gap-2 w-full pointer-events-auto z-30",children:[u.jsxs("div",{className:"flex flex-wrap items-center justify-center gap-x-3 gap-y-1 max-w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl md:rounded-full px-4 py-1 text-[10px] uppercase tracking-[0.2em] font-light shadow-xl",children:[u.jsx("button",{onClick:A=>{A.stopPropagation(),a()},className:"p-1 text-white/70 hover:text-white transition rounded-full",title:"Space to toggle play","aria-label":D?"Play simulation":"Pause simulation",children:D?u.jsx(wr,{size:11}):u.jsx(br,{size:11})}),u.jsx("div",{className:"flex items-center gap-1 border-l border-white/10 pl-3",children:Sa.map(A=>{const E=!D&&P===A.val;return u.jsx("button",{"aria-pressed":E,onClick:ge=>{ge.stopPropagation(),i(A.val)},className:`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-[0.15em] transition-all duration-200 ${E?"bg-white/20 text-white font-normal border border-white/25 shadow-sm":"text-white/40 hover:text-white/70"}`,children:A.label},A.label)})}),u.jsxs("div",{className:"flex items-center gap-1.5 border-l border-white/10 pl-3 text-[10px] uppercase tracking-[0.2em] font-light",children:[u.jsx("button",{onClick:A=>{A.stopPropagation(),r()},className:"text-white/40 hover:text-white px-1.5 py-0.5 rounded transition",children:"J2000"}),u.jsx("button",{onClick:A=>{A.stopPropagation(),c()},className:"text-white/40 hover:text-white px-1.5 py-0.5 rounded transition",children:"Now"}),u.jsxs("button",{onClick:A=>{A.stopPropagation(),nt(!Te)},"aria-label":`Jump to date (current ${rt})`,"aria-expanded":Te,className:"flex items-center gap-1 text-white/50 hover:text-white px-1.5 py-0.5 rounded transition",children:[u.jsx(vr,{size:10}),u.jsx("span",{children:rt})]})]})]}),Te&&u.jsxs("form",{onSubmit:Ma,className:"flex items-center gap-2 bg-black/85 backdrop-blur-xl border border-white/15 rounded-xl px-3 py-2 text-[10px] uppercase tracking-[0.2em] font-light shadow-2xl",children:[u.jsx("input",{type:"date","aria-label":"Simulation date (UTC)",value:rt,onFocus:()=>lt(!0),onChange:A=>{lt(!0),ai(A.target.value)},onBlur:()=>lt(!1),className:"bg-white/10 text-white px-2 py-1 rounded border border-white/15 outline-none focus:border-white/40 text-[11px] font-sans"}),u.jsx("button",{type:"submit",className:"px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg transition text-[10px] uppercase tracking-[0.2em] font-light",children:"Jump"}),u.jsx("button",{type:"button",onClick:()=>nt(!1),className:"p-1 text-white/40 hover:text-white","aria-label":"Close date picker",children:u.jsx(Bt,{size:12})})]})]}),U&&u.jsxs("div",{className:"fixed inset-0 z-50 pointer-events-auto flex justify-end animate-fadeIn",children:[u.jsx("div",{onClick:()=>me(!1),className:"flex-1 bg-black/60 backdrop-blur-sm transition-opacity"}),u.jsxs("aside",{className:"w-[420px] max-w-full bg-[#040307]/95 backdrop-blur-2xl border-l border-white/10 p-7 flex flex-col gap-6 shadow-2xl h-full font-sans overflow-y-auto no-scrollbar",children:[u.jsxs("div",{className:"flex justify-between items-start border-b border-white/10 pb-4",children:[u.jsxs("div",{children:[u.jsxs("span",{className:"text-[10px] uppercase tracking-[0.25em] font-light block",style:{color:de.eyebrowColor},children:[de.eyebrow," · SOLAR SYSTEM EXPLORER"]}),u.jsx("h2",{className:"text-3xl font-extralight text-white tracking-[0.25em] uppercase mt-1",children:Q})]}),u.jsx("button",{onClick:()=>me(!1),className:"text-white/40 hover:text-white transition p-1.5 rounded-full hover:bg-white/10","aria-label":"Close details",children:u.jsx(Bt,{size:18})})]}),u.jsxs("div",{className:"flex flex-col gap-2",children:[u.jsx("span",{className:"text-[10px] tracking-[0.25em] uppercase text-white/40 font-light",children:"Astronomical Lore & Physical Environment"}),u.jsx("p",{className:"text-xs leading-relaxed text-white/80 font-light",children:de.extendedLore})]}),(Q==="Sagittarius A*"||(b==null?void 0:b.category)==="black_hole")&&u.jsxs("div",{className:"flex flex-col gap-2.5 pt-2 border-t border-amber-500/30",children:[u.jsxs("div",{className:"flex items-center justify-between",children:[u.jsx("span",{className:"text-[10px] tracking-[0.25em] uppercase text-amber-400 font-medium",children:"Relativistic Horizons & Metrics"}),u.jsx("span",{className:"text-[9px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30",children:"EHT / NASA SVS"})]}),u.jsxs("div",{className:"grid grid-cols-2 gap-y-2 text-xs font-light bg-amber-500/5 p-3 rounded-xl border border-amber-500/15",children:[u.jsx("span",{className:"text-white/40",children:"Mass (M)"}),u.jsx("span",{className:"text-right text-amber-200 font-mono",children:"4.297 ± 0.012 × 10⁶ M☉"}),u.jsx("span",{className:"text-white/40",children:"Schwarzschild Radius (r_s)"}),u.jsx("span",{className:"text-right text-amber-200 font-mono",children:"12.69 × 10⁶ km (0.085 AU)"}),u.jsx("span",{className:"text-white/40",children:"Photon Sphere (r_ph)"}),u.jsx("span",{className:"text-right text-amber-200 font-mono",children:"1.5 r_s · 19.04 × 10⁶ km"}),u.jsx("span",{className:"text-white/40",children:"Shadow Radius (r_shadow)"}),u.jsx("span",{className:"text-right text-amber-200 font-mono",children:"2.60 r_s · 32.97 × 10⁶ km"}),u.jsx("span",{className:"text-white/40",children:"EHT Shadow Diameter (θ)"}),u.jsx("span",{className:"text-right text-amber-200 font-mono",children:"51.8 ± 2.3 µas"}),u.jsx("span",{className:"text-white/40",children:"ISCO Radius (r_isco)"}),u.jsx("span",{className:"text-right text-amber-200 font-mono",children:"3.0 r_s · 38.07 × 10⁶ km"}),u.jsx("span",{className:"text-white/40",children:"ISCO Orbital Velocity"}),u.jsx("span",{className:"text-right text-amber-200 font-mono",children:"0.408 c (122,400 km/s)"}),u.jsx("span",{className:"text-white/40",children:"Galactic Center Distance"}),u.jsx("span",{className:"text-right text-amber-200 font-mono",children:"8.277 kpc (26,990 ly)"})]}),u.jsxs("div",{className:"flex flex-col gap-1.5 p-3 rounded-xl bg-black/50 border border-white/10 text-[11px] text-white/70 font-light",children:[u.jsx("span",{className:"text-[10px] uppercase tracking-[0.2em] text-white/40 font-medium",children:"Relativistic Optical Phenomena:"}),u.jsxs("p",{children:["• ",u.jsx("strong",{className:"text-amber-200 font-normal",children:"Event Horizon Shadow:"})," In the Schwarzschild metric every photon with impact parameter b Null-geodesic ray tracing confirms absolute photon capture for impact parameters b < 2.598 r_s (3√3/2 r_s).lt; 3√3/2 r_s ≈ 2.598 r_s is captured."]}),u.jsxs("p",{children:["• ",u.jsx("strong",{className:"text-amber-200 font-normal",children:"Lensed Accretion Arches:"})," Light emitted from the rear accretion disk loops over and under the black hole's gravitational potential well, projecting primary and secondary lensed arcs."]}),u.jsxs("p",{children:["• ",u.jsx("strong",{className:"text-amber-200 font-normal",children:"Relativistic Doppler Beaming:"})," Plasma orbiting at ~0.4 c blazes in intense blue-white on the approaching left limb (intensity boost ~ δ⁴) while receding plasma dims into deep red."]}),u.jsxs("p",{children:["• ",u.jsx("strong",{className:"text-amber-200 font-normal",children:"Relativistic Polar Jets:"})," Twin collimated particle beams erupting at ~0.98 c along the spin axis, featuring an incandescent white-hot core and helical synchrotron shock sheaths."]}),u.jsxs("p",{children:["• ",u.jsx("strong",{className:"text-amber-200 font-normal",children:"Nuclear S-Cluster:"})," Over 300 massive B/O-type stars orbit Sgr A* in the central parsec, including star S2 reaching speeds of 7,650 km/s at pericenter."]})]})]}),Y&&u.jsxs("div",{className:"flex flex-col gap-2 pt-2 border-t border-white/10",children:[u.jsx("span",{className:"text-[10px] tracking-[0.25em] uppercase text-white/40 font-light",children:"Physical Dimensions"}),u.jsxs("div",{className:"grid grid-cols-2 gap-y-2 text-xs font-light",children:[u.jsx("span",{className:"text-white/40",children:"Mean Radius"}),u.jsxs("span",{className:"text-right text-white/90",children:[Y.physical.meanRadiusKm.toLocaleString()," km"]}),u.jsx("span",{className:"text-white/40",children:"Surface Gravity"}),u.jsx("span",{className:"text-right text-white/90",children:Y.physical.gmKm3S2?`${(Y.physical.gmKm3S2*1e3/Math.pow(Y.physical.meanRadiusKm,2)).toFixed(2)} m/s²`:"—"}),u.jsx("span",{className:"text-white/40",children:"Sidereal Day"}),u.jsx("span",{className:"text-right text-white/90",children:Y.physical.rotationPeriodHours!==void 0?`${Y.physical.rotationPeriodHours.toFixed(1)} h`:"Synchronous"}),u.jsx("span",{className:"text-white/40",children:"Axial Tilt"}),u.jsx("span",{className:"text-right text-white/90",children:Y.physical.axialTiltDeg!==void 0?`${Y.physical.axialTiltDeg.toFixed(2)}°`:"0.00°"})]})]}),Y&&u.jsxs("div",{className:"flex flex-col gap-2 pt-2 border-t border-white/10",children:[u.jsx("span",{className:"text-[10px] tracking-[0.25em] uppercase text-white/40 font-light",children:"Keplerian Orbit (J2000)"}),u.jsxs("div",{className:"grid grid-cols-2 gap-y-2 text-xs font-light",children:[u.jsx("span",{className:"text-white/40",children:"Semi-Major Axis"}),u.jsxs("span",{className:"text-right text-white/90",children:[Y.orbit.semiMajorAxisAU.toFixed(3)," AU"]}),u.jsx("span",{className:"text-white/40",children:"Eccentricity"}),u.jsx("span",{className:"text-right text-white/90",children:Y.orbit.eccentricity.toFixed(4)}),u.jsx("span",{className:"text-white/40",children:"Orbital Period"}),u.jsx("span",{className:"text-right text-white/90",children:Y.orbit.orbitalPeriodDays>730?`${(Y.orbit.orbitalPeriodDays/365.25).toFixed(2)} yr`:`${Y.orbit.orbitalPeriodDays.toFixed(1)} d`}),u.jsx("span",{className:"text-white/40",children:"Inclination"}),u.jsxs("span",{className:"text-right text-white/90",children:[Y.orbit.inclinationDeg.toFixed(2),"°"]})]})]}),b&&u.jsxs("div",{className:"flex flex-col gap-2 pt-2 border-t border-white/10",children:[u.jsx("span",{className:"text-[10px] tracking-[0.25em] uppercase text-white/40 font-light",children:"Live Ephemeris Telemetry"}),u.jsxs("div",{className:"grid grid-cols-2 gap-y-2 text-xs font-light",children:[u.jsx("span",{className:"text-white/40",children:"Heliocentric Dist"}),u.jsx("span",{className:"text-right text-white/90",children:b.distanceKm>1e6?`${(b.distanceKm/1e6).toFixed(2)}M km`:`${Math.round(b.distanceKm).toLocaleString()} km`}),u.jsx("span",{className:"text-white/40",children:"AU Distance"}),u.jsxs("span",{className:"text-right text-white/90",children:[(b.distanceKm/1495978707e-1).toFixed(3)," AU"]}),u.jsx("span",{className:"text-white/40",children:"Orbital Velocity"}),u.jsxs("span",{className:"text-right text-white/90",children:[b.apparentSpeedKmS.toFixed(2)," km/s"]})]})]}),de.missions&&de.missions.length>0&&u.jsxs("div",{className:"flex flex-col gap-3 pt-2 border-t border-white/10",children:[u.jsx("span",{className:"text-[10px] tracking-[0.25em] uppercase text-white/40 font-light",children:"Exploration Missions"}),u.jsx("div",{className:"flex flex-col gap-2.5",children:de.missions.map(A=>u.jsxs("div",{className:"p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col gap-1",children:[u.jsxs("div",{className:"flex justify-between items-center text-xs",children:[u.jsx("span",{className:"text-white font-medium tracking-[0.1em]",children:A.name}),u.jsxs("span",{className:"text-[10px] text-white/40 font-light",children:[A.year," · ",A.agency]})]}),u.jsx("p",{className:"text-[11px] text-white/60 font-light",children:A.role})]},A.name))})]}),u.jsxs("div",{className:"pt-3 border-t border-white/10 flex justify-between items-center text-[10px] font-light text-white/30 uppercase tracking-[0.2em]",children:[u.jsx("span",{children:(Y==null?void 0:Y.orbit.source)??"NASA JPL orbital elements"}),u.jsx("span",{children:"Keplerian 2-Body Solver"})]}),u.jsxs("p",{className:"text-[10px] leading-relaxed font-light text-white/35",children:["Textures: Solar System Scope (CC BY 4.0) · Sky map: ESA/Gaia/DPAC (CC BY-SA 3.0 IGO) · Stars: ESA/Hipparcos (CC BY-NC 3.0 IGO) · Galaxy art: NASA/JPL-Caltech/ESO/R. Hurt (CC BY 4.0) · Orbits: NASA JPL."," ",u.jsx("a",{href:"https://github.com/LetMeCodex/solaris/blob/main/ASSETS.md",target:"_blank",rel:"noopener noreferrer",className:"underline hover:text-white/70",children:"Full credits"})]})]})]}),kt&&u.jsxs("div",{className:"fixed inset-0 z-50 pointer-events-auto flex",children:[u.jsx("div",{onClick:()=>Ve(!1),className:"flex-1 bg-black/60 backdrop-blur-sm transition-opacity"}),u.jsxs("aside",{className:"w-96 bg-[#07060a]/95 backdrop-blur-2xl border-l border-white/10 p-6 flex flex-col gap-5 shadow-2xl h-full font-sans",children:[u.jsxs("div",{className:"flex justify-between items-center border-b border-white/10 pb-4",children:[u.jsxs("div",{children:[u.jsx("h3",{className:"text-lg font-extralight text-white tracking-[0.25em] uppercase",children:"Astronomical Catalogue"}),u.jsxs("span",{className:"text-[10px] uppercase tracking-[0.2em] font-light text-white/40",children:[We.length," bodies · NASA JPL elements"]})]}),u.jsx("button",{onClick:()=>Ve(!1),className:"text-white/40 hover:text-white transition p-1.5 rounded-full hover:bg-white/5","aria-label":"Close catalogue",children:u.jsx(Bt,{size:16})})]}),u.jsxs("div",{className:"flex flex-col gap-2.5 text-xs",children:[u.jsxs("div",{className:"relative",children:[u.jsx(Oi,{size:13,className:"absolute left-3 top-2.5 text-white/35"}),u.jsx("input",{type:"text",placeholder:"FILTER BY NAME, CATEGORY...","aria-label":"Filter catalogue by name or category",value:ot,onChange:A=>xa(A.target.value),className:"w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white placeholder-white/30 text-[11px] uppercase tracking-[0.15em] outline-none focus:border-white/30"})]}),u.jsx("div",{className:"grid grid-cols-4 gap-1 text-[10px] uppercase tracking-[0.18em] font-light",children:["all","planet","moon","minor"].map(A=>u.jsx("button",{onClick:()=>va(A),"aria-pressed":Le===A,className:`py-1 rounded-lg text-center uppercase tracking-wider transition-all duration-200 ${Le===A?"bg-white/15 text-white font-normal border border-white/20":"text-white/40 hover:text-white/70"}`,children:A==="all"?`All (${We.length})`:A==="planet"?"Planets":A==="moon"?"Moons":"Minor"},A))})]}),u.jsx("div",{className:"flex-1 overflow-y-auto no-scrollbar flex flex-col gap-1.5 pr-1",children:wa.map(A=>{const E=Q===A.name;return u.jsxs("button",{onClick:()=>{e(A.name),ht(),Ve(!1)},className:`flex items-center justify-between p-2.5 rounded-xl border transition text-left ${E?"bg-white/15 border-white/30 text-white":"bg-white/[0.02] border-white/5 text-white/70 hover:bg-white/[0.06] hover:text-white"}`,children:[u.jsxs("div",{className:"flex items-center gap-3",children:[u.jsx("span",{className:"w-2 h-2 rounded-full flex-shrink-0",style:{backgroundColor:A.physical.colorHex||"#ffffff"}}),u.jsxs("div",{className:"flex flex-col",children:[u.jsx("span",{className:"text-xs text-white font-light tracking-[0.15em] uppercase",children:A.name}),u.jsxs("span",{className:"text-[10px] text-white/35 uppercase tracking-[0.1em]",children:[A.category.replace("_"," "),A.parentName&&` · ${A.parentName}`]})]})]}),u.jsxs("div",{className:"text-right text-[10px] text-white/40 font-light tracking-wider",children:[u.jsxs("div",{children:[A.physical.meanRadiusKm.toLocaleString()," km"]}),u.jsxs("div",{children:[A.orbit.semiMajorAxisAU.toFixed(2)," AU"]})]})]},A.name)})})]})]})]}):u.jsx("div",{className:"absolute bottom-6 right-6 z-50 pointer-events-auto",children:u.jsxs("button",{onClick:()=>le(!0),className:"flex items-center gap-2 px-3.5 py-1.5 text-xs text-white/50 hover:text-white bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/10 rounded-full transition uppercase tracking-[0.2em] font-light",children:[u.jsx(yr,{size:13}),u.jsx("span",{children:"Show Interface (H)"})]})})},Ar=()=>{const l=C.useRef(null),e=C.useRef(null),[t,a]=C.useState(null);C.useEffect(()=>{if(!l.current)return;const w=new Yt(l.current,y=>{a(y)});return e.current=w,window.__solaris_scene=w,()=>{delete window.__solaris_scene,w.dispose(),e.current=null}},[]);const i=C.useCallback(w=>{var y;(y=e.current)==null||y.selectBody(w)},[]),s=C.useCallback(()=>{var w;(w=e.current)==null||w.resetView()},[]),o=C.useCallback(()=>{if(!e.current)return;const w=e.current.clock.isPaused;e.current.clock.isPaused=!w},[]),r=C.useCallback(w=>{e.current&&(e.current.clock.timeMultiplier=w,e.current.clock.isPaused=!1)},[]),c=C.useCallback(w=>{var y;(y=e.current)==null||y.setScaleMode(w)},[]),n=C.useCallback(w=>{var y;(y=e.current)==null||y.clock.setUtcMs(w)},[]),h=C.useCallback(()=>{var w;(w=e.current)==null||w.clock.resetToJ2000()},[]),m=C.useCallback(()=>{var w;(w=e.current)==null||w.clock.resetToNow()},[]),p=C.useCallback(()=>{var w;(w=e.current)==null||w.toggleConstellations()},[]),f=C.useCallback(()=>{var w;(w=e.current)==null||w.toggleAsteroidBelt()},[]),g=C.useCallback(()=>{var w;(w=e.current)==null||w.toggleOrbits()},[]),v=C.useCallback(w=>{var y;(y=e.current)==null||y.setLensProfile(w)},[]),S=C.useCallback(w=>{var y;(y=e.current)==null||y.flyToLandmark(w)},[]),x=C.useCallback(w=>{var y;(y=e.current)==null||y.setExplorerDaylight(w)},[]),b=C.useCallback(w=>{const y=e.current;if(y)switch(w.type){case"enter":y.enterSurface();break;case"exit":y.exitSurface();break;case"magnification":y.setSurfaceMagnification(w.value);break;case"atmosphere":y.setSurfaceAtmosphere(w.on);break;case"time":y.setSurfaceTimeOfDay(w.what);break;case"lookAt":y.surfaceLookAt(w.name);break;case"resetZoom":y.resetSurfaceZoom();break;case"skyFrom":y.enterSkyView(w.body,w.facing);break}},[]),D=C.useCallback(()=>{var w;(w=e.current)==null||w.cycleLensProfile()},[]),P=C.useCallback(w=>{var y;(y=e.current)==null||y.jumpToScale(w)},[]);return u.jsxs("div",{className:"relative w-screen h-screen overflow-hidden bg-[#030206]",style:{width:"100vw",height:"100vh",position:"relative",overflow:"hidden"},children:[u.jsx("div",{ref:l,className:"absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing",style:{position:"absolute",top:0,left:0,width:"100%",height:"100%"}}),u.jsx(Pr,{telemetry:t,onSelectPlanet:i,onResetView:s,onTogglePlay:o,onSetTimeMultiplier:r,onSetScaleMode:c,onSeekDate:n,onResetToJ2000:h,onResetToNow:m,onToggleConstellations:p,onToggleAsteroidBelt:f,onToggleOrbits:g,onJumpToScale:P,onSetLens:v,onCycleLens:D,onFlyToLandmark:S,onExplorerDaylight:x,onSurface:b})]})};Ht.createRoot(document.getElementById("root")).render(u.jsx(Ea.StrictMode,{children:u.jsx(Ar,{})}));
