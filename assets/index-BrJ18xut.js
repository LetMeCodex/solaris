var oa=Object.defineProperty;var sa=(g,e,i)=>e in g?oa(g,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):g[e]=i;var m=(g,e,i)=>sa(g,typeof e!="symbol"?e+"":e,i);import{r as R,a as ra,R as na}from"./react-nf7bT_Uh.js";import{C as O,R as U,a as E,T as ca,b as la,S as Pe,N as Ge,L as Ye,c as qe,d as F,B as Re,A as Y,V as M,D as Se,G as Z,P as He,M as j,e as N,f as te,g as da,h as Tt,i as et,j as X,k as L,l as ce,m as nt,n as ha,o as ma,p as Rt,q as Ce,r as Me,s as vt,t as K,u as Ct,F as ua,v as tt,w as xe,x as pa,Q as ga,O as fa,y as ya,z as xa,I as va,E as wa,H as ba,W as Ma,J as Sa,K as Aa,U as Pa}from"./three-CIg2q4W1.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))a(t);new MutationObserver(t=>{for(const o of t)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function i(t){const o={};return t.integrity&&(o.integrity=t.integrity),t.referrerPolicy&&(o.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?o.credentials="include":t.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(t){if(t.ep)return;t.ep=!0;const o=i(t);fetch(t.href,o)}})();var Nt={exports:{}},ze={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Da=R,Ta=Symbol.for("react.element"),Ra=Symbol.for("react.fragment"),Ca=Object.prototype.hasOwnProperty,Na=Da.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Ea={key:!0,ref:!0,__self:!0,__source:!0};function Et(g,e,i){var a,t={},o=null,s=null;i!==void 0&&(o=""+i),e.key!==void 0&&(o=""+e.key),e.ref!==void 0&&(s=e.ref);for(a in e)Ca.call(e,a)&&!Ea.hasOwnProperty(a)&&(t[a]=e[a]);if(g&&g.defaultProps)for(a in e=g.defaultProps,e)t[a]===void 0&&(t[a]=e[a]);return{$$typeof:Ta,type:g,key:o,ref:s,props:t,_owner:Na.current}}ze.Fragment=Ra;ze.jsx=Et;ze.jsxs=Et;Nt.exports=ze;var d=Nt.exports,at={},wt=ra;at.createRoot=wt.createRoot,at.hydrateRoot=wt.hydrateRoot;const Ia=[{id:"10",name:"Sun",category:"star",orderFromSun:0,physical:{meanRadiusKm:695700,equatorialRadiusKm:695700,polarRadiusKm:695700,flattening:0,massKg:19885e26,gmKm3S2:1327124400419394e-4,rotationPeriodHours:609.12,axialTiltDeg:7.25,meanTemperatureK:5778,spectralType:"G2V",colorHex:"#ffdd77"},orbit:{semiMajorAxisKm:0,semiMajorAxisAU:0,eccentricity:0,inclinationDeg:0,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:0,orbitalPeriodDays:0},description:"Yellow dwarf star (G2V) at the gravitational center of the Solar System, containing 99.86% of the system’s total mass."},{id:"199",name:"Mercury",category:"planet",orderFromSun:1,physical:{meanRadiusKm:2439.7,equatorialRadiusKm:2439.7,polarRadiusKm:2439.7,flattening:0,massKg:33011e19,gmKm3S2:22031.78,rotationPeriodHours:1407.6,axialTiltDeg:.034,meanTemperatureK:440,colorHex:"#9c968f"},orbit:{semiMajorAxisKm:579092265e-1,semiMajorAxisAU:.38709927,eccentricity:.20563593,inclinationDeg:7.00497902,longitudeAscendingNodeDeg:48.33076593,argumentPeriapsisDeg:29.12703035,meanAnomalyAtEpochDeg:174.79252722,orbitalPeriodDays:87.969,epochJd:2451545,ratesPerCentury:{semiMajorAxisAU:37e-8,eccentricity:1906e-8,inclinationDeg:-.00594749,longitudeAscendingNodeDeg:-.12534081,argumentPeriapsisDeg:.2858177,meanAnomalyDeg:149472.51363486},source:"JPL SSD approximate planetary positions (Standish), Table 1"},description:"Smallest planet, heavily cratered with silicate crust and large iron core; lacks a substantial atmosphere."},{id:"299",name:"Venus",category:"planet",orderFromSun:2,physical:{meanRadiusKm:6051.8,equatorialRadiusKm:6051.8,polarRadiusKm:6051.8,flattening:0,massKg:48675e20,gmKm3S2:324858.59,rotationPeriodHours:-5832.5,axialTiltDeg:177.36,meanTemperatureK:737,colorHex:"#e3bb7b"},orbit:{semiMajorAxisKm:1082094745e-1,semiMajorAxisAU:.72333566,eccentricity:.00677672,inclinationDeg:3.39467605,longitudeAscendingNodeDeg:76.67984255,argumentPeriapsisDeg:54.92262463,meanAnomalyAtEpochDeg:50.37663232,orbitalPeriodDays:224.701,epochJd:2451545,ratesPerCentury:{semiMajorAxisAU:39e-7,eccentricity:-4107e-8,inclinationDeg:-7889e-7,longitudeAscendingNodeDeg:-.27769418,argumentPeriapsisDeg:.28037747,meanAnomalyDeg:58517.812704},source:"JPL SSD approximate planetary positions (Standish), Table 1"},description:"Terrestrial planet shrouded in dense carbon dioxide atmosphere and sulfuric acid clouds with runaway greenhouse effect."},{id:"399",name:"Earth",category:"planet",orderFromSun:3,physical:{meanRadiusKm:6371,equatorialRadiusKm:6378.137,polarRadiusKm:6356.752,flattening:.003353,massKg:59722e20,gmKm3S2:398600.4418,rotationPeriodHours:23.9344,axialTiltDeg:23.439,meanTemperatureK:288,colorHex:"#4b75a1"},orbit:{semiMajorAxisKm:1495982612e-1,semiMajorAxisAU:1.00000261,eccentricity:.01671123,inclinationDeg:-1531e-8,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:102.93768193,meanAnomalyAtEpochDeg:357.52688973,orbitalPeriodDays:365.256,epochJd:2451545,ratesPerCentury:{semiMajorAxisAU:562e-8,eccentricity:-4392e-8,inclinationDeg:-.01294668,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:.32327364,meanAnomalyDeg:35999.04917617},source:"JPL SSD approximate planetary positions (Standish), Table 1"},description:"Dense rocky world featuring liquid surface water, active plate tectonics, oxygen-rich atmosphere, and planetary biosphere."},{id:"499",name:"Mars",category:"planet",orderFromSun:4,physical:{meanRadiusKm:3389.5,equatorialRadiusKm:3396.2,polarRadiusKm:3376.2,flattening:.00589,massKg:64171e19,gmKm3S2:42828.375,rotationPeriodHours:24.6229,axialTiltDeg:25.19,meanTemperatureK:210,colorHex:"#c16138"},orbit:{semiMajorAxisKm:2279438224e-1,semiMajorAxisAU:1.52371034,eccentricity:.0933941,inclinationDeg:1.84969142,longitudeAscendingNodeDeg:49.55953891,argumentPeriapsisDeg:-73.5031685,meanAnomalyAtEpochDeg:19.39019754,orbitalPeriodDays:686.98,epochJd:2451545,ratesPerCentury:{semiMajorAxisAU:1847e-8,eccentricity:7882e-8,inclinationDeg:-.00813131,longitudeAscendingNodeDeg:-.29257343,argumentPeriapsisDeg:.73698431,meanAnomalyDeg:19139.85827411},source:"JPL SSD approximate planetary positions (Standish), Table 1"},description:"Cold desert world with iron-oxide regolith, giant shield volcanoes (Olympus Mons), rift canyon Valles Marineris, and polar ice caps."},{id:"599",name:"Jupiter",category:"planet",orderFromSun:5,physical:{meanRadiusKm:69911,equatorialRadiusKm:71492,polarRadiusKm:66854,flattening:.06487,massKg:18982e23,gmKm3S2:12668653492e-2,rotationPeriodHours:9.925,axialTiltDeg:3.13,meanTemperatureK:165,colorHex:"#c8a679"},orbit:{semiMajorAxisKm:7783408167e-1,semiMajorAxisAU:5.202887,eccentricity:.04838624,inclinationDeg:1.30439695,longitudeAscendingNodeDeg:100.47390909,argumentPeriapsisDeg:-85.74542926,meanAnomalyAtEpochDeg:19.66796068,orbitalPeriodDays:4332.589,epochJd:2451545,ratesPerCentury:{semiMajorAxisAU:-11607e-8,eccentricity:-13253e-8,inclinationDeg:-.00183714,longitudeAscendingNodeDeg:.20469106,argumentPeriapsisDeg:.00783562,meanAnomalyDeg:3034.53360107},source:"JPL SSD approximate planetary positions (Standish), Table 1"},description:"Largest planet; hydrogen-helium gas giant displaying zonal atmospheric jet streams, turbulent vortices, and the Great Red Spot."},{id:"699",name:"Saturn",category:"planet",orderFromSun:6,physical:{meanRadiusKm:58232,equatorialRadiusKm:60268,polarRadiusKm:54364,flattening:.09796,massKg:56834e22,gmKm3S2:379311879e-1,rotationPeriodHours:10.656,axialTiltDeg:26.73,meanTemperatureK:134,colorHex:"#dfcf9f"},orbit:{semiMajorAxisKm:14266664142e-1,semiMajorAxisAU:9.53667594,eccentricity:.05386179,inclinationDeg:2.48599187,longitudeAscendingNodeDeg:113.66242448,argumentPeriapsisDeg:-21.06354617,meanAnomalyAtEpochDeg:317.35536592,orbitalPeriodDays:10759.22,epochJd:2451545,ratesPerCentury:{semiMajorAxisAU:-.0012506,eccentricity:-50991e-8,inclinationDeg:.00193609,longitudeAscendingNodeDeg:-.28867794,argumentPeriapsisDeg:-.13029422,meanAnomalyDeg:1222.91259417},source:"JPL SSD approximate planetary positions (Standish), Table 1"},description:"Gas giant celebrated for its extensive, brilliant ring system consisting of water ice particles, dust, and rock."},{id:"799",name:"Uranus",category:"planet",orderFromSun:7,physical:{meanRadiusKm:25362,equatorialRadiusKm:25559,polarRadiusKm:24973,flattening:.02293,massKg:8681e22,gmKm3S2:57939393e-1,rotationPeriodHours:-17.24,axialTiltDeg:97.77,meanTemperatureK:76,colorHex:"#8fe0ea"},orbit:{semiMajorAxisKm:28706581707e-1,semiMajorAxisAU:19.18916464,eccentricity:.04725744,inclinationDeg:.77263783,longitudeAscendingNodeDeg:74.01692503,argumentPeriapsisDeg:96.93735127,meanAnomalyAtEpochDeg:142.28382821,orbitalPeriodDays:30685.4,epochJd:2451545,ratesPerCentury:{semiMajorAxisAU:-.00196176,eccentricity:-4397e-8,inclinationDeg:-.00242939,longitudeAscendingNodeDeg:.04240589,argumentPeriapsisDeg:.36564692,meanAnomalyDeg:428.07397504},source:"JPL SSD approximate planetary positions (Standish), Table 1"},description:"Ice giant composed of water, ammonia, and methane ices; extreme 98° axial tilt results in extreme seasonal variations."},{id:"899",name:"Neptune",category:"planet",orderFromSun:8,physical:{meanRadiusKm:24622,equatorialRadiusKm:24764,polarRadiusKm:24341,flattening:.01708,massKg:102413e21,gmKm3S2:68350995e-1,rotationPeriodHours:16.11,axialTiltDeg:28.32,meanTemperatureK:72,colorHex:"#4b70dd"},orbit:{semiMajorAxisKm:4498396417,semiMajorAxisAU:30.06992276,eccentricity:.00859048,inclinationDeg:1.77004347,longitudeAscendingNodeDeg:131.78422574,argumentPeriapsisDeg:-86.81946347,meanAnomalyAtEpochDeg:259.91520804,orbitalPeriodDays:60189,epochJd:2451545,ratesPerCentury:{semiMajorAxisAU:26291e-8,eccentricity:5105e-8,inclinationDeg:35372e-8,longitudeAscendingNodeDeg:-.00508664,argumentPeriapsisDeg:-.317328,meanAnomalyDeg:218.78186789},source:"JPL SSD approximate planetary positions (Standish), Table 1"},description:"Outermost major planet; deep azure ice giant driven by violent supersonic winds, methane haze, and high-altitude cirrus clouds."}],Oa=[{id:"301",name:"Moon",category:"moon",orderFromSun:3,parentId:"399",parentName:"Earth",physical:{meanRadiusKm:1737.4,equatorialRadiusKm:1738.1,polarRadiusKm:1736,flattening:.0012,massKg:7342e19,gmKm3S2:4902.8,rotationPeriodHours:655.728,axialTiltDeg:6.68,meanTemperatureK:250,colorHex:"#c4c3be"},orbit:{semiMajorAxisKm:384400,semiMajorAxisAU:.0025695553,eccentricity:.0554,inclinationDeg:5.16,longitudeAscendingNodeDeg:125.08,argumentPeriapsisDeg:318.15,meanAnomalyAtEpochDeg:135.27,orbitalPeriodDays:27.321661,epochJd:2451545,meanMotionDegPerDay:13.064995931,periapsisArgRateDegPerDay:.164353224,nodeRateDegPerDay:-.05299066,source:"JPL SSD planetary satellite mean elements"},description:"Earth’s only natural satellite; tidally locked with extensive lunar maria basalt plains and impact-cratered anorthositic highlands."},{id:"401",name:"Phobos",category:"moon",orderFromSun:4,parentId:"499",parentName:"Mars",physical:{meanRadiusKm:11.26,equatorialRadiusKm:13,polarRadiusKm:9.1,massKg:10659e12,gmKm3S2:71e-5,rotationPeriodHours:7.654,axialTiltDeg:0,colorHex:"#8b847d"},orbit:{semiMajorAxisKm:9377.9,semiMajorAxisAU:626874e-10,eccentricity:.01468188,inclinationDeg:25.639416,longitudeAscendingNodeDeg:82.61167,argumentPeriapsisDeg:282.404283,meanAnomalyAtEpochDeg:176.914893,orbitalPeriodDays:.31891023,epochJd:24613275e-1,meanMotionDegPerDay:1128.84431459,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Innermost and largest moon of Mars; heavily cratered irregular body featuring the massive Stickney impact crater, orbiting inside synchronous orbit."},{id:"402",name:"Deimos",category:"moon",orderFromSun:4,parentId:"499",parentName:"Mars",physical:{meanRadiusKm:6.2,massKg:14762e11,rotationPeriodHours:30.31,axialTiltDeg:0,colorHex:"#999186"},orbit:{semiMajorAxisKm:23458.846,semiMajorAxisAU:.0001568127,eccentricity:25811e-8,inclinationDeg:24.120481,longitudeAscendingNodeDeg:81.546986,argumentPeriapsisDeg:52.283083,meanAnomalyAtEpochDeg:122.884373,orbitalPeriodDays:1.2624407,epochJd:24613275e-1,meanMotionDegPerDay:285.161908991,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Outermost moon of Mars; smooth-looking irregular body coated in a thick regolith blanket that softens surface topography."},{id:"501",name:"Io",category:"moon",orderFromSun:5,parentId:"599",parentName:"Jupiter",physical:{meanRadiusKm:1821.5,massKg:89319e18,gmKm3S2:5959.91,rotationPeriodHours:42.456,axialTiltDeg:0,meanTemperatureK:130,colorHex:"#e5c158"},orbit:{semiMajorAxisKm:422020.056,semiMajorAxisAU:.0028210298,eccentricity:.00359279,inclinationDeg:2.228063,longitudeAscendingNodeDeg:338.403388,argumentPeriapsisDeg:31.382494,meanAnomalyAtEpochDeg:199.124628,orbitalPeriodDays:1.769137786,epochJd:24613275e-1,meanMotionDegPerDay:203.488955382,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Most volcanically active body in the Solar System, driven by tidal friction from orbital resonance with Europa and Ganymede; coated in sulfur and sulfur dioxide."},{id:"502",name:"Europa",category:"moon",orderFromSun:5,parentId:"599",parentName:"Jupiter",physical:{meanRadiusKm:1560.8,massKg:47998e18,gmKm3S2:3202.73,rotationPeriodHours:85.224,axialTiltDeg:.1,meanTemperatureK:102,colorHex:"#c7bfae"},orbit:{semiMajorAxisKm:671258.947,semiMajorAxisAU:.0044870889,eccentricity:.00931579,inclinationDeg:2.07625,longitudeAscendingNodeDeg:326.203313,argumentPeriapsisDeg:224.926561,meanAnomalyAtEpochDeg:279.791695,orbitalPeriodDays:3.551181041,epochJd:24613275e-1,meanMotionDegPerDay:101.37472459,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Smooth, brilliant water-ice crust fractured by tectonic lineae and cycloids; harbors a deep global subsurface liquid water ocean with astrobiological potential."},{id:"503",name:"Ganymede",category:"moon",orderFromSun:5,parentId:"599",parentName:"Jupiter",physical:{meanRadiusKm:2631.2,massKg:14819e19,gmKm3S2:9887.83,rotationPeriodHours:171.72,axialTiltDeg:.2,meanTemperatureK:110,colorHex:"#8e8379"},orbit:{semiMajorAxisKm:1070453601e-3,semiMajorAxisAU:.0071555404,eccentricity:.00274315,inclinationDeg:2.34352,longitudeAscendingNodeDeg:339.06555,argumentPeriapsisDeg:3.818835,meanAnomalyAtEpochDeg:349.11927,orbitalPeriodDays:7.15455296,epochJd:24613275e-1,meanMotionDegPerDay:50.317609222,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Largest natural satellite in the Solar System (larger than Mercury); only known moon with its own intrinsic magnetic field generated by a liquid iron core."},{id:"504",name:"Callisto",category:"moon",orderFromSun:5,parentId:"599",parentName:"Jupiter",physical:{meanRadiusKm:2410.3,massKg:10759e19,gmKm3S2:7179.29,rotationPeriodHours:400.536,axialTiltDeg:0,meanTemperatureK:134,colorHex:"#696057"},orbit:{semiMajorAxisKm:1882917904e-3,semiMajorAxisAU:.0125865288,eccentricity:.00707683,inclinationDeg:1.952455,longitudeAscendingNodeDeg:336.746982,argumentPeriapsisDeg:34.494869,meanAnomalyAtEpochDeg:126.955427,orbitalPeriodDays:16.6890184,epochJd:24613275e-1,meanMotionDegPerDay:21.57107095,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Ancient, intensely cratered ice-rock moon; lacks tidal resonance heating, preserving the most heavily cratered surface in the Solar System (including Valhalla impact basin)."},{id:"601",name:"Mimas",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:198.2,massKg:37493e15,rotationPeriodHours:22.6,colorHex:"#b2b2b2"},orbit:{semiMajorAxisKm:186034.255,semiMajorAxisAU:.0012435622,eccentricity:.0218639,inclinationDeg:28.47676,longitudeAscendingNodeDeg:172.727658,argumentPeriapsisDeg:169.377604,meanAnomalyAtEpochDeg:326.994857,orbitalPeriodDays:.942421959,epochJd:24613275e-1,meanMotionDegPerDay:381.994494676,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Dominated by the 130 km Herschel impact crater, giving it a distinctive Death Star appearance; clearing agent for the Cassini Division."},{id:"602",name:"Enceladus",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:252.1,massKg:10802e16,gmKm3S2:7.21,rotationPeriodHours:32.88,colorHex:"#ffffff"},orbit:{semiMajorAxisKm:238411.673,semiMajorAxisAU:.0015936836,eccentricity:.00513554,inclinationDeg:28.043619,longitudeAscendingNodeDeg:169.530888,argumentPeriapsisDeg:214.451065,meanAnomalyAtEpochDeg:62.261399,orbitalPeriodDays:1.370217855,epochJd:24613275e-1,meanMotionDegPerDay:262.731943454,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:'High-albedo icy world with active cryovolcanic geysers erupting water vapor, organic molecules, and ice crystals from south polar "tiger stripe" fractures.'},{id:"603",name:"Tethys",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:531,massKg:61745e16,rotationPeriodHours:45.31,colorHex:"#d8d8d8"},orbit:{semiMajorAxisKm:294976.454,semiMajorAxisAU:.0019717958,eccentricity:99726e-8,inclinationDeg:28.175586,longitudeAscendingNodeDeg:171.825733,argumentPeriapsisDeg:127.950883,meanAnomalyAtEpochDeg:2.809594,orbitalPeriodDays:1.88780216,epochJd:24613275e-1,meanMotionDegPerDay:190.697948984,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Low-density water-ice satellite featuring the vast Odysseus impact crater and the enormous Ithaca Chasma canyon system spanning 2,000 km."},{id:"604",name:"Dione",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:561.4,massKg:10955e17,rotationPeriodHours:65.69,colorHex:"#cac8c5"},orbit:{semiMajorAxisKm:377644.232,semiMajorAxisAU:.0025243958,eccentricity:.00265791,inclinationDeg:28.025672,longitudeAscendingNodeDeg:169.549925,argumentPeriapsisDeg:268.312567,meanAnomalyAtEpochDeg:329.102147,orbitalPeriodDays:2.736914742,epochJd:24613275e-1,meanMotionDegPerDay:131.534970555,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Icy moon displaying bright wispy ice cliffs (chasmata) formed by extensional tectonic fractures across its trailing hemisphere."},{id:"605",name:"Rhea",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:763.5,massKg:23065e17,rotationPeriodHours:108.43,colorHex:"#bbb8b4"},orbit:{semiMajorAxisKm:527244.268,semiMajorAxisAU:.0035244102,eccentricity:.00136693,inclinationDeg:28.274533,longitudeAscendingNodeDeg:169.967171,argumentPeriapsisDeg:166.661352,meanAnomalyAtEpochDeg:13.027101,orbitalPeriodDays:4.517500436,epochJd:24613275e-1,meanMotionDegPerDay:79.690086387,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Second-largest moon of Saturn; heavily cratered ice body with homogeneous interior composition and tenuous oxygen-carbon dioxide exosphere."},{id:"606",name:"Titan",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:2574.8,equatorialRadiusKm:2574.8,polarRadiusKm:2574.8,flattening:0,massKg:13452e19,gmKm3S2:8978.14,rotationPeriodHours:382.68,axialTiltDeg:0,meanTemperatureK:94,colorHex:"#e5a84b",atmosphere:{surfacePressureBar:1.45,composition:[{gas:"N2",percentage:95},{gas:"CH4",percentage:4.9}]}},orbit:{semiMajorAxisKm:1221971892e-3,semiMajorAxisAU:.0081683776,eccentricity:.02881004,inclinationDeg:27.705537,longitudeAscendingNodeDeg:169.080756,argumentPeriapsisDeg:178.340423,meanAnomalyAtEpochDeg:328.923552,orbitalPeriodDays:15.94542068,epochJd:24613275e-1,meanMotionDegPerDay:22.577014882,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Second-largest moon in the Solar System, enveloped by a dense nitrogen-methane atmosphere supporting active liquid methane/ethane lakes, rivers, and rain hydrologic cycles."},{id:"607",name:"Hyperion",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:135,massKg:56199e14,rotationPeriodHours:300,colorHex:"#9c8c7c"},orbit:{semiMajorAxisKm:1486933985e-3,semiMajorAxisAU:.0099395398,eccentricity:.09542499,inclinationDeg:27.056176,longitudeAscendingNodeDeg:169.549243,argumentPeriapsisDeg:67.294493,meanAnomalyAtEpochDeg:98.155885,orbitalPeriodDays:21.2766088,epochJd:24613275e-1,meanMotionDegPerDay:16.919989618,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Sponge-like irregularly shaped moon with low density (high porosity) undergoing non-repeating chaotic rotation influenced by Titan."},{id:"608",name:"Iapetus",category:"moon",orderFromSun:6,parentId:"699",parentName:"Saturn",physical:{meanRadiusKm:734.3,massKg:18056e17,rotationPeriodHours:1903.92,colorHex:"#847970"},orbit:{semiMajorAxisKm:3565269983e-3,semiMajorAxisAU:.0238323578,eccentricity:.02970025,inclinationDeg:16.979231,longitudeAscendingNodeDeg:138.869009,argumentPeriapsisDeg:230.853136,meanAnomalyAtEpochDeg:320.152812,orbitalPeriodDays:79.3301825,epochJd:24613275e-1,meanMotionDegPerDay:4.537995359,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Two-tone world with extreme albedo dichotomy (pitch-black Cassini Regio leading hemisphere and brilliant ice trailing hemisphere), plus a towering 20 km equatorial ridge."},{id:"705",name:"Miranda",category:"moon",orderFromSun:7,parentId:"799",parentName:"Uranus",physical:{meanRadiusKm:235.8,massKg:659e17,rotationPeriodHours:33.91,colorHex:"#a0a0a0"},orbit:{semiMajorAxisKm:129871.122,semiMajorAxisAU:.0008681348,eccentricity:.0011248,inclinationDeg:97.989082,longitudeAscendingNodeDeg:163.186619,argumentPeriapsisDeg:67.391864,meanAnomalyAtEpochDeg:207.222114,orbitalPeriodDays:1.413479,epochJd:24613275e-1,meanMotionDegPerDay:254.690731168,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Exhibits extreme, chaotic terrain with gigantic tectonic rift grabens and chevron-shaped coronae, including Verona Rupes (tallest cliff in the Solar System at 20 km)."},{id:"701",name:"Ariel",category:"moon",orderFromSun:7,parentId:"799",parentName:"Uranus",physical:{meanRadiusKm:578.9,massKg:1251e18,rotationPeriodHours:60.48,colorHex:"#b4b4b4"},orbit:{semiMajorAxisKm:190944.721,semiMajorAxisAU:.0012763866,eccentricity:5326e-7,inclinationDeg:97.718049,longitudeAscendingNodeDeg:167.665855,argumentPeriapsisDeg:276.587566,meanAnomalyAtEpochDeg:51.205773,orbitalPeriodDays:2.520379,epochJd:24613275e-1,meanMotionDegPerDay:142.835660827,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Brightest moon of Uranus; dissected by extensive interconnected fault scarps, deep graben valleys, and cryovolcanic flows."},{id:"702",name:"Umbriel",category:"moon",orderFromSun:7,parentId:"799",parentName:"Uranus",physical:{meanRadiusKm:584.7,massKg:1275e18,rotationPeriodHours:99.46,colorHex:"#737373"},orbit:{semiMajorAxisKm:265988.581,semiMajorAxisAU:.0017780238,eccentricity:.00337264,inclinationDeg:97.714436,longitudeAscendingNodeDeg:167.725316,argumentPeriapsisDeg:66.275993,meanAnomalyAtEpochDeg:14.683581,orbitalPeriodDays:4.144177,epochJd:24613275e-1,meanMotionDegPerDay:86.868876498,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Darkest and most heavily cratered of Uranus’s large satellites, marked by the mysterious bright fluorescent ring floor of crater Wunda."},{id:"703",name:"Titania",category:"moon",orderFromSun:7,parentId:"799",parentName:"Uranus",physical:{meanRadiusKm:788.9,massKg:342e19,rotationPeriodHours:208.94,colorHex:"#9f9994"},orbit:{semiMajorAxisKm:436251.111,semiMajorAxisAU:.0029161586,eccentricity:.00197821,inclinationDeg:97.762135,longitudeAscendingNodeDeg:167.643651,argumentPeriapsisDeg:280.488041,meanAnomalyAtEpochDeg:236.26202,orbitalPeriodDays:8.705872,epochJd:24613275e-1,meanMotionDegPerDay:41.351400526,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Largest moon of Uranus; fractured by vast canyon systems (Messina Chasma) resulting from internal freezing and expansion of a primordial subsurface ocean."},{id:"704",name:"Oberon",category:"moon",orderFromSun:7,parentId:"799",parentName:"Uranus",physical:{meanRadiusKm:761.4,massKg:3014e18,rotationPeriodHours:323.11,colorHex:"#938c86"},orbit:{semiMajorAxisKm:583573.694,semiMajorAxisAU:.0039009492,eccentricity:.00243809,inclinationDeg:97.905711,longitudeAscendingNodeDeg:167.708289,argumentPeriapsisDeg:171.765242,meanAnomalyAtEpochDeg:34.68861,orbitalPeriodDays:13.463239,epochJd:24613275e-1,meanMotionDegPerDay:26.739479259,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Outermost major moon of Uranus; ancient heavily cratered ice-rock surface featuring prominent impact ray craters filled with dark carbonaceous deposits."},{id:"801",name:"Triton",category:"moon",orderFromSun:8,parentId:"899",parentName:"Neptune",physical:{meanRadiusKm:1352.6,massKg:2139e19,gmKm3S2:1427.6,rotationPeriodHours:-141.048,axialTiltDeg:0,meanTemperatureK:38,colorHex:"#e2cfc4"},orbit:{semiMajorAxisKm:354765.344,semiMajorAxisAU:.0023714598,eccentricity:10818e-8,inclinationDeg:129.126619,longitudeAscendingNodeDeg:222.868711,argumentPeriapsisDeg:109.713483,meanAnomalyAtEpochDeg:179.672821,orbitalPeriodDays:5.876854,epochJd:24613275e-1,meanMotionDegPerDay:61.257264516,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Captured Kuiper Belt dwarf planet orbiting Neptune in a retrograde direction; coldest measured surface in the Solar System (38 K) with nitrogen cryogeysers and cantaloupe terrain."},{id:"999",name:"Pluto",category:"dwarf_planet",orderFromSun:9,physical:{meanRadiusKm:1188.3,equatorialRadiusKm:1188.3,polarRadiusKm:1188.3,flattening:0,massKg:1303e19,gmKm3S2:869.6,rotationPeriodHours:-153.2928,axialTiltDeg:122.53,meanTemperatureK:44,colorHex:"#c79f82"},orbit:{semiMajorAxisKm:5922374660,semiMajorAxisAU:39.5886293852,eccentricity:.2518378779,inclinationDeg:17.14771141,longitudeAscendingNodeDeg:110.29238405,argumentPeriapsisDeg:113.70900152,meanAnomalyAtEpochDeg:38.68366347,orbitalPeriodDays:90981.716,epochJd:24575885e-1,meanMotionDegPerDay:.003956838956,source:"JPL SBDB osculating elements"},description:'Largest known Kuiper Belt dwarf planet; features the high-albedo nitrogen-ice glacier Sputnik Planitia (the "Heart"), water-ice mountains, and blue atmospheric haze.'},{id:"901",name:"Charon",category:"moon",orderFromSun:9,parentId:"999",parentName:"Pluto",physical:{meanRadiusKm:606,massKg:1586e18,rotationPeriodHours:153.29,colorHex:"#99948e"},orbit:{semiMajorAxisKm:19595.763,semiMajorAxisAU:.0001309896,eccentricity:16098e-8,inclinationDeg:112.887772,longitudeAscendingNodeDeg:227.393077,argumentPeriapsisDeg:172.262887,meanAnomalyAtEpochDeg:355.44348,orbitalPeriodDays:6.3872304,epochJd:24613275e-1,meanMotionDegPerDay:56.362457193,source:"JPL Horizons osculating elements (parent-centred, ecliptic J2000)"},description:"Mutually tidally locked binary companion to Pluto; features a dark reddish tholin polar hood (Mordor Macula) and massive equatorial tectonic chasms."},{id:"1",name:"Ceres",category:"dwarf_planet",orderFromSun:4.5,physical:{meanRadiusKm:469.7,equatorialRadiusKm:487.3,polarRadiusKm:446,flattening:.0847,massKg:93835e16,gmKm3S2:62.63,rotationPeriodHours:9.074,axialTiltDeg:4,meanTemperatureK:168,colorHex:"#88847e"},orbit:{semiMajorAxisKm:4137207795e-1,semiMajorAxisAU:2.765552595,eccentricity:.0796922951,inclinationDeg:10.5880278,longitudeAscendingNodeDeg:80.24862682,argumentPeriapsisDeg:73.29421453,meanAnomalyAtEpochDeg:274.41934638,orbitalPeriodDays:1679.853,epochJd:24612005e-1,meanMotionDegPerDay:.214304450648,source:"JPL SBDB osculating elements"},description:"Largest body in the asteroid belt, comprising ~33% of its total mass; differentiated protoplanet with an ice-rich mantle and bright sodium-carbonate salt spots (Cerealia Facula in Occator Crater)."},{id:"4",name:"Vesta",category:"asteroid",orderFromSun:4.3,physical:{meanRadiusKm:261.4,equatorialRadiusKm:286.3,polarRadiusKm:229,flattening:.2,massKg:259e18,rotationPeriodHours:5.342,axialTiltDeg:29,colorHex:"#a39b91"},orbit:{semiMajorAxisKm:3532553203e-1,semiMajorAxisAU:2.3613659651,eccentricity:.0902037438,inclinationDeg:7.14392555,longitudeAscendingNodeDeg:103.70129327,argumentPeriapsisDeg:151.46864782,meanAnomalyAtEpochDeg:81.19015608,orbitalPeriodDays:1325.389,epochJd:24612005e-1,meanMotionDegPerDay:.27161836136,source:"JPL SBDB osculating elements"},description:"Brightest asteroid visible from Earth; preserved basaltic differentiated protoplanet with metallic core, silicate mantle, and enormous south-polar impact crater Rheasilvia."},{id:"2",name:"Pallas",category:"asteroid",orderFromSun:4.6,physical:{meanRadiusKm:256.5,massKg:205e18,rotationPeriodHours:7.813,axialTiltDeg:84,colorHex:"#827f7a"},orbit:{semiMajorAxisKm:4143201308e-1,semiMajorAxisAU:2.7695590107,eccentricity:.2307000996,inclinationDeg:34.93279322,longitudeAscendingNodeDeg:172.88661934,argumentPeriapsisDeg:310.96991617,meanAnomalyAtEpochDeg:254.24965217,orbitalPeriodDays:1683.505,epochJd:24612005e-1,meanMotionDegPerDay:.213839602925,source:"JPL SBDB osculating elements"},description:"Third-largest asteroid in the belt; notable for its unusually high 34.8° orbital inclination and dynamic golf-ball-like surface topography."},{id:"10",name:"Hygiea",category:"asteroid",orderFromSun:4.8,physical:{meanRadiusKm:203.6,massKg:832e17,rotationPeriodHours:13.825,colorHex:"#605c57"},orbit:{semiMajorAxisKm:4713790061e-1,semiMajorAxisAU:3.150974034,eccentricity:.1067092741,inclinationDeg:3.82952995,longitudeAscendingNodeDeg:283.11989275,argumentPeriapsisDeg:312.42423873,meanAnomalyAtEpochDeg:252.03442424,orbitalPeriodDays:2042.987,epochJd:24612005e-1,meanMotionDegPerDay:.176212550579,source:"JPL SBDB osculating elements"},description:"Fourth-largest asteroid and major carbonaceous C-type asteroid; nearly spherical body likely formed from a catastrophic impact parent-body disruption."},{id:"16",name:"Psyche",category:"asteroid",orderFromSun:4.7,physical:{meanRadiusKm:111,massKg:229e17,rotationPeriodHours:4.196,axialTiltDeg:95,colorHex:"#b8aba0"},orbit:{semiMajorAxisKm:437681552,semiMajorAxisAU:2.9257204665,eccentricity:.1349324738,inclinationDeg:3.09874912,longitudeAscendingNodeDeg:149.97538593,argumentPeriapsisDeg:230.03267827,meanAnomalyAtEpochDeg:79.76939505,orbitalPeriodDays:1827.88,epochJd:24612005e-1,meanMotionDegPerDay:.196949475811,source:"JPL SBDB osculating elements"},description:"Enormous metallic M-type asteroid thought to be the exposed nickel-iron core of an early protoplanet stripped by hit-and-run collisions; target of NASA’s Psyche mission."},{id:"433",name:"Eros",category:"asteroid",orderFromSun:3.5,physical:{meanRadiusKm:8.42,massKg:6687e12,rotationPeriodHours:5.27,colorHex:"#998d7f"},orbit:{semiMajorAxisKm:218150155,semiMajorAxisAU:1.4582437168,eccentricity:.2228779628,inclinationDeg:10.8285441,longitudeAscendingNodeDeg:304.26797134,argumentPeriapsisDeg:178.91813191,meanAnomalyAtEpochDeg:62.51145502,orbitalPeriodDays:643.196,epochJd:24612005e-1,meanMotionDegPerDay:.559704634704,source:"JPL SBDB osculating elements"},description:"Elongated peanut-shaped S-type near-Earth asteroid; historic target orbited and landed upon by the NEAR Shoemaker spacecraft in 2001."},{id:"951",name:"Gaspra",category:"asteroid",orderFromSun:4.1,physical:{meanRadiusKm:6.1,massKg:2e16,rotationPeriodHours:7.042,colorHex:"#a09485"},orbit:{semiMajorAxisKm:330608056,semiMajorAxisAU:2.2099783537,eccentricity:.1737374595,inclinationDeg:4.10465497,longitudeAscendingNodeDeg:252.96729133,argumentPeriapsisDeg:130.00376374,meanAnomalyAtEpochDeg:112.95087164,orbitalPeriodDays:1199.998,epochJd:24612005e-1,meanMotionDegPerDay:.300000545277,source:"JPL SBDB osculating elements"},description:"First asteroid ever visited by a spacecraft (Galileo flyby in 1991); irregular S-type asteroid with prominent groove-like depressions."},{id:"243",name:"Ida",category:"asteroid",orderFromSun:4.6,physical:{meanRadiusKm:15.7,massKg:42e15,rotationPeriodHours:4.634,colorHex:"#9c9284"},orbit:{semiMajorAxisKm:4283507686e-1,semiMajorAxisAU:2.8633480317,eccentricity:.046109628,inclinationDeg:1.13036309,longitudeAscendingNodeDeg:323.53666094,argumentPeriapsisDeg:113.25718268,meanAnomalyAtEpochDeg:49.64769088,orbitalPeriodDays:1769.741,epochJd:24612005e-1,meanMotionDegPerDay:.20341963288,source:"JPL SBDB osculating elements"},description:"Coronis-family asteroid visited by Galileo in 1993, famous for the historic discovery of Dactyl, the first recognized asteroid moon."},{id:"101955",name:"Bennu",category:"asteroid",orderFromSun:3.2,physical:{meanRadiusKm:.242,massKg:7329e7,rotationPeriodHours:4.296,colorHex:"#3a3a3a"},orbit:{semiMajorAxisKm:168505699,semiMajorAxisAU:1.1263910259,eccentricity:.2037450762,inclinationDeg:6.03494377,longitudeAscendingNodeDeg:2.0608662,argumentPeriapsisDeg:66.22306084,meanAnomalyAtEpochDeg:101.703952,orbitalPeriodDays:436.649,epochJd:24555625e-1,meanMotionDegPerDay:.824461350332,source:"JPL SBDB osculating elements"},description:"Diamond-shaped carbonaceous rubble-pile near-Earth asteroid sampled by NASA’s OSIRIS-REx spacecraft, delivering pristine solar nebula samples to Earth in 2023."},{id:"162173",name:"Ryugu",category:"asteroid",orderFromSun:3.3,physical:{meanRadiusKm:.448,massKg:45e10,rotationPeriodHours:7.632,colorHex:"#353535"},orbit:{semiMajorAxisKm:1781589365e-1,semiMajorAxisAU:1.1909189327,eccentricity:.1910730046,inclinationDeg:5.86644249,longitudeAscendingNodeDeg:251.2897124,argumentPeriapsisDeg:211.60899381,meanAnomalyAtEpochDeg:62.34067409,orbitalPeriodDays:474.703,epochJd:24612005e-1,meanMotionDegPerDay:.758369353853,source:"JPL SBDB osculating elements"},description:"Spinning-top shaped Cb-type near-Earth asteroid sampled by JAXA’s Hayabusa2 spacecraft, rich in water-bearing minerals and prebiotic amino acids."}],Xe=[...Ia,...Oa],pe={id:"SGR_A_STAR",name:"Sagittarius A*",category:"black_hole",orderFromSun:999,physical:{meanRadiusKm:12690400,equatorialRadiusKm:32971e3,polarRadiusKm:12690400,flattening:0,massKg:8544455e30,gmKm3S2:570283e12,rotationPeriodHours:.18,axialTiltDeg:42,meanTemperatureK:1e7,colorHex:"#ffaa33"},orbit:{semiMajorAxisKm:2554e14,semiMajorAxisAU:1707e6,eccentricity:0,inclinationDeg:60.19,longitudeAscendingNodeDeg:0,argumentPeriapsisDeg:0,meanAnomalyAtEpochDeg:0,orbitalPeriodDays:23e7*365.25},description:"Supermassive black hole at the gravitational center of the Milky Way galaxy (mass 4.3 million solar masses, distance 27,000 ly). Demonstrates extreme relativistic light bending, an apparent gravitational shadow, a photon sphere, and a glowing synchrotron accretion disk."},ie=class ie{static getSagittariusAStar(){return pe}static getAllBodies(){return this.bodies}static getBody(e){return this.bodiesById.get(e)||this.bodiesByName.get(e.toLowerCase())}static getParent(e){if(e.parentId)return this.bodiesById.get(e.parentId)}static getMoonsOf(e){const i=this.getBody(e);return i?this.moonsByParentId.get(i.id)||[]:[]}static getByCategory(e){return this.bodies.filter(i=>i.category===e)}static getPlanets(){return this.getByCategory("planet")}static getMoons(){return this.getByCategory("moon")}static getDwarfPlanets(){return this.getByCategory("dwarf_planet")}static getAsteroids(){return this.getByCategory("asteroid")}static search(e){const i=e.trim().toLowerCase();return i?this.bodies.filter(a=>a.name.toLowerCase().includes(i)||a.category.toLowerCase().includes(i)||a.parentName&&a.parentName.toLowerCase().includes(i)||a.description.toLowerCase().includes(i)):this.bodies}static getStats(){return{total:this.bodies.length,stars:this.getByCategory("star").length,planets:this.getPlanets().length,moons:this.getMoons().length,dwarfPlanets:this.getDwarfPlanets().length,asteroids:this.getAsteroids().length}}};m(ie,"bodies",Xe),m(ie,"bodiesById",new Map([...Xe.map(e=>[e.id,e]),[pe.id,pe]])),m(ie,"bodiesByName",new Map([...Xe.map(e=>[e.name.toLowerCase(),e]),["sagittarius a*",pe],["sgr a*",pe],["sgr a",pe],["black hole",pe]])),m(ie,"moonsByParentId",new Map),(()=>{for(const e of ie.bodies)e.parentId&&(ie.moonsByParentId.has(e.parentId)||ie.moonsByParentId.set(e.parentId,[]),ie.moonsByParentId.get(e.parentId).push(e))})();let W=ie;class De{static getTexture(e){if(this.cache.has(e))return this.cache.get(e);let i;switch(e){case"Sun":i=this.createSunTexture();break;case"Mercury":i=this.createMercuryTexture();break;case"Venus":i=this.createVenusTexture();break;case"Earth":i=this.createEarthTexture();break;case"EarthClouds":i=this.createEarthCloudsTexture();break;case"Mars":i=this.createMarsTexture();break;case"Jupiter":i=this.createJupiterTexture();break;case"Saturn":i=this.createSaturnTexture();break;case"SaturnRings":i=this.createSaturnRingsTexture();break;case"Uranus":i=this.createUranusTexture();break;case"Neptune":i=this.createNeptuneTexture();break;case"Moon":i=this.createMoonTexture();break;case"Io":i=this.createIoTexture();break;case"Europa":i=this.createEuropaTexture();break;case"Ganymede":i=this.createGanymedeTexture();break;case"Callisto":i=this.createCallistoTexture();break;case"Titan":i=this.createTitanTexture();break;case"Enceladus":i=this.createEnceladusTexture();break;case"Triton":i=this.createTritonTexture();break;case"Pluto":i=this.createPlutoTexture();break;case"Ceres":i=this.createCeresTexture();break;default:i=this.createRockyCrateredTexture(e)}return this.cache.set(e,i),i}static createSunTexture(){const a=document.createElement("canvas");a.width=1024,a.height=512;const t=a.getContext("2d"),o=t.createLinearGradient(0,0,0,512);o.addColorStop(0,"#fff4cc"),o.addColorStop(.5,"#ffbb33"),o.addColorStop(1,"#ff8800"),t.fillStyle=o,t.fillRect(0,0,1024,512);const s=t.getImageData(0,0,1024,512),r=s.data;for(let n=0;n<r.length;n+=4){const l=n/4%1024,h=Math.floor(n/4/1024),u=Math.sin(l*.05)*Math.cos(h*.05),p=Math.sin(l*.12+1.2)*Math.cos(h*.12+.8),f=Math.sin(l*.25)*Math.sin(h*.25),w=u*.5+p*.3+f*.2;r[n]=Math.min(255,Math.max(180,245+w*35)),r[n+1]=Math.min(240,Math.max(120,180+w*55)),r[n+2]=Math.min(180,Math.max(20,60+w*40)),r[n+3]=255}t.putImageData(s,0,0),t.fillStyle="rgba(120, 30, 0, 0.6)";for(let n=0;n<12;n++){const l=(n*85+40)%1024,h=160+n*37%180,u=6+n%5*3;t.beginPath(),t.arc(l,h,u,0,Math.PI*2),t.fill(),t.fillStyle="rgba(60, 10, 0, 0.85)",t.beginPath(),t.arc(l,h,u*.45,0,Math.PI*2),t.fill()}const c=new O(a);return c.wrapS=U,c.wrapT=E,c}static createMercuryTexture(){const a=document.createElement("canvas");a.width=1024,a.height=512;const t=a.getContext("2d");t.fillStyle="#78736d",t.fillRect(0,0,1024,512);const o=t.getImageData(0,0,1024,512),s=o.data;for(let c=0;c<s.length;c+=4){const n=c/4%1024,l=Math.floor(c/4/1024),u=120+(Math.sin(n*.08)*Math.cos(l*.08)+Math.sin(n*.2)*Math.sin(l*.2))*18;s[c]=u*.95,s[c+1]=u*.93,s[c+2]=u*.9,s[c+3]=255}t.putImageData(o,0,0);for(let c=0;c<120;c++){const n=(c*79+33)%1024,l=20+c*47%472,h=4+c%15*2;t.fillStyle="rgba(40, 38, 36, 0.4)",t.beginPath(),t.arc(n,l,h,0,Math.PI*2),t.fill(),t.strokeStyle="rgba(210, 205, 200, 0.35)",t.lineWidth=1.5,t.beginPath(),t.arc(n,l,h,Math.PI*.8,Math.PI*1.8),t.stroke()}const r=new O(a);return r.wrapS=U,r.wrapT=E,r}static createVenusTexture(){const a=document.createElement("canvas");a.width=1024,a.height=512;const t=a.getContext("2d"),o=t.createLinearGradient(0,0,0,512);o.addColorStop(0,"#f0d8a8"),o.addColorStop(.2,"#ecd096"),o.addColorStop(.5,"#e5c483"),o.addColorStop(.8,"#ecd096"),o.addColorStop(1,"#f0d8a8"),t.fillStyle=o,t.fillRect(0,0,1024,512),t.fillStyle="rgba(215, 180, 110, 0.25)";for(let r=0;r<18;r++){const c=r*28.444444444444443;t.beginPath(),t.moveTo(0,c);for(let n=0;n<=1024;n+=30){const l=Math.sin(n*.015+r)*12+Math.cos(n*.03)*6;t.lineTo(n,c+l)}t.lineTo(1024,c+20),t.lineTo(0,c+20),t.closePath(),t.fill()}const s=new O(a);return s.wrapS=U,s.wrapT=E,s}static createEarthTexture(){const a=document.createElement("canvas");a.width=1024,a.height=512;const t=a.getContext("2d");t.fillStyle="#0f274a",t.fillRect(0,0,1024,512);const o=t.createLinearGradient(0,0,0,512);o.addColorStop(0,"rgba(25, 65, 115, 0.4)"),o.addColorStop(.5,"rgba(10, 35, 75, 0.1)"),o.addColorStop(1,"rgba(25, 65, 115, 0.4)"),t.fillStyle=o,t.fillRect(0,0,1024,512),t.fillStyle="#2d5930",t.beginPath(),t.ellipse(1024*.58,512*.38,140,85,.1,0,Math.PI*2),t.ellipse(1024*.53,512*.62,70,95,-.15,0,Math.PI*2),t.fill(),t.beginPath(),t.ellipse(1024*.22,512*.32,95,75,-.2,0,Math.PI*2),t.ellipse(1024*.3,512*.65,60,90,.25,0,Math.PI*2),t.fill(),t.beginPath(),t.ellipse(1024*.82,512*.72,45,35,.1,0,Math.PI*2),t.fill(),t.fillStyle="#9e8548",t.beginPath(),t.ellipse(1024*.52,512*.45,65,30,0,0,Math.PI*2),t.ellipse(1024*.82,512*.72,28,20,0,0,Math.PI*2),t.fill(),t.fillStyle="#f0f6ff",t.beginPath(),t.rect(0,0,1024,28),t.fill(),t.beginPath(),t.rect(0,476,1024,36),t.fill();const s=new O(a);return s.wrapS=U,s.wrapT=E,s}static createEarthCloudsTexture(){const a=document.createElement("canvas");a.width=1024,a.height=512;const t=a.getContext("2d");t.clearRect(0,0,1024,512),t.fillStyle="rgba(255, 255, 255, 0.75)";for(let s=0;s<28;s++){const r=(s*65+15)%1024,c=60+s*42%392,n=55+s%7*15,l=18+s%4*6;t.beginPath(),t.ellipse(r,c,n,l,s%5*.2,0,Math.PI*2),t.fill()}const o=new O(a);return o.wrapS=U,o.wrapT=E,o}static createMarsTexture(){const a=document.createElement("canvas");a.width=1024,a.height=512;const t=a.getContext("2d");t.fillStyle="#bd532b",t.fillRect(0,0,1024,512),t.fillStyle="rgba(68, 38, 25, 0.45)",t.beginPath(),t.ellipse(1024*.45,512*.52,90,45,.2,0,Math.PI*2),t.ellipse(1024*.75,512*.42,70,50,-.1,0,Math.PI*2),t.ellipse(1024*.15,512*.58,60,35,.15,0,Math.PI*2),t.fill(),t.fillStyle="rgba(165, 80, 45, 0.8)",t.beginPath(),t.arc(1024*.28,512*.45,24,0,Math.PI*2),t.fill(),t.fillStyle="#3a2015",t.beginPath(),t.arc(1024*.28,512*.45,6,0,Math.PI*2),t.fill(),t.fillStyle="#f8f4f0",t.beginPath(),t.ellipse(1024*.5,12,110,12,0,0,Math.PI*2),t.fill(),t.beginPath(),t.ellipse(1024*.5,498,85,14,0,0,Math.PI*2),t.fill();const o=new O(a);return o.wrapS=U,o.wrapT=E,o}static createJupiterTexture(){const a=document.createElement("canvas");a.width=1024,a.height=512;const t=a.getContext("2d"),o=["#a88460","#dec8aa","#8f5c35","#f2e2ce","#9e673d","#ebd5be","#82522e","#f5e8da","#916139","#e6cfb8"],s=512/o.length;for(let h=0;h<o.length;h++)t.fillStyle=o[h],t.fillRect(0,h*s,1024,s);for(let h=0;h<o.length;h++){const u=h*s;t.fillStyle=h%2===0?"rgba(80, 45, 20, 0.35)":"rgba(255, 245, 235, 0.35)",t.beginPath(),t.moveTo(0,u);for(let p=0;p<=1024;p+=25){const f=Math.sin(p*.03+h*2)*5+Math.cos(p*.08)*3;t.lineTo(p,u+f)}t.lineTo(1024,u+s*.5),t.lineTo(0,u+s*.5),t.closePath(),t.fill()}const r=1024*.65,c=512*.62,n=t.createRadialGradient(r,c,5,r,c,32);n.addColorStop(0,"#c43d22"),n.addColorStop(.6,"#b5482e"),n.addColorStop(1,"#8f5c35"),t.fillStyle=n,t.beginPath(),t.ellipse(r,c,36,20,-.08,0,Math.PI*2),t.fill(),t.strokeStyle="rgba(255, 255, 255, 0.5)",t.lineWidth=2.5,t.beginPath(),t.ellipse(r+45,c-4,18,9,.1,0,Math.PI*2),t.stroke();const l=new O(a);return l.wrapS=U,l.wrapT=E,l}static createSaturnTexture(){const a=document.createElement("canvas");a.width=1024,a.height=512;const t=a.getContext("2d"),o=t.createLinearGradient(0,0,0,512);o.addColorStop(0,"#757c6b"),o.addColorStop(.2,"#ccb98d"),o.addColorStop(.4,"#e8dcba"),o.addColorStop(.5,"#f4ebd2"),o.addColorStop(.6,"#e8dcba"),o.addColorStop(.8,"#ccb98d"),o.addColorStop(1,"#80806a"),t.fillStyle=o,t.fillRect(0,0,1024,512);for(let r=0;r<30;r++){const c=r/30*512;t.fillStyle=r%2===0?"rgba(120, 100, 70, 0.08)":"rgba(255, 250, 240, 0.08)",t.fillRect(0,c,1024,512/30)}const s=new O(a);return s.wrapS=U,s.wrapT=E,s}static createSaturnRingsTexture(){const a=document.createElement("canvas");a.width=1024,a.height=64;const t=a.getContext("2d");t.clearRect(0,0,1024,64);const o=t.createLinearGradient(0,0,1024,0);o.addColorStop(0,"rgba(140, 130, 115, 0.0)"),o.addColorStop(.05,"rgba(150, 140, 125, 0.25)"),o.addColorStop(.18,"rgba(160, 150, 130, 0.35)"),o.addColorStop(.2,"rgba(225, 215, 185, 0.85)"),o.addColorStop(.35,"rgba(240, 230, 205, 0.95)"),o.addColorStop(.55,"rgba(230, 220, 195, 0.90)"),o.addColorStop(.57,"rgba(40, 35, 30, 0.02)"),o.addColorStop(.63,"rgba(40, 35, 30, 0.02)"),o.addColorStop(.65,"rgba(215, 205, 180, 0.75)"),o.addColorStop(.8,"rgba(225, 215, 190, 0.80)"),o.addColorStop(.83,"rgba(40, 35, 30, 0.05)"),o.addColorStop(.85,"rgba(220, 210, 185, 0.70)"),o.addColorStop(.95,"rgba(180, 170, 150, 0.35)"),o.addColorStop(1,"rgba(140, 130, 115, 0.0)"),t.fillStyle=o,t.fillRect(0,0,1024,64);const s=new O(a);return s.wrapS=E,s.wrapT=E,s}static createUranusTexture(){const a=document.createElement("canvas");a.width=512,a.height=256;const t=a.getContext("2d"),o=t.createLinearGradient(0,0,0,256);return o.addColorStop(0,"#75c8d6"),o.addColorStop(.5,"#8ee0ed"),o.addColorStop(1,"#75c8d6"),t.fillStyle=o,t.fillRect(0,0,512,256),new O(a)}static createNeptuneTexture(){const a=document.createElement("canvas");a.width=1024,a.height=512;const t=a.getContext("2d"),o=t.createLinearGradient(0,0,0,512);o.addColorStop(0,"#2d4aa0"),o.addColorStop(.3,"#3a62cb"),o.addColorStop(.5,"#4a75e6"),o.addColorStop(.7,"#3a62cb"),o.addColorStop(1,"#2d4aa0"),t.fillStyle=o,t.fillRect(0,0,1024,512),t.fillStyle="rgba(25, 40, 110, 0.35)",t.fillRect(0,512*.55,1024,40),t.fillStyle="#1b2c75",t.beginPath(),t.ellipse(1024*.45,512*.58,45,24,0,0,Math.PI*2),t.fill(),t.fillStyle="rgba(235, 245, 255, 0.8)",t.beginPath(),t.ellipse(1024*.45+50,512*.58-10,22,6,.1,0,Math.PI*2),t.fill();const s=new O(a);return s.wrapS=U,s.wrapT=E,s}static createMoonTexture(){const a=document.createElement("canvas");a.width=512,a.height=256;const t=a.getContext("2d");t.fillStyle="#aba8a2",t.fillRect(0,0,512,256);const o=t.getImageData(0,0,512,256),s=o.data;for(let n=0;n<s.length;n+=4){const l=(Math.random()-.5)*24;s[n]=Math.max(0,Math.min(255,s[n]+l)),s[n+1]=Math.max(0,Math.min(255,s[n+1]+l)),s[n+2]=Math.max(0,Math.min(255,s[n+2]+l))}t.putImageData(o,0,0);const r=[{x:512*.35,y:256*.35,rx:55,ry:45,color:"#4a4844"},{x:512*.48,y:256*.38,rx:35,ry:30,color:"#4d4a46"},{x:512*.55,y:256*.48,rx:40,ry:32,color:"#494743"},{x:512*.22,y:256*.42,rx:65,ry:60,color:"#52504b"},{x:512*.42,y:256*.55,rx:38,ry:28,color:"#4b4844"},{x:512*.65,y:256*.45,rx:30,ry:25,color:"#504d49"}];for(const n of r){const l=t.createRadialGradient(n.x,n.y,5,n.x,n.y,n.rx);l.addColorStop(0,n.color),l.addColorStop(.85,n.color),l.addColorStop(1,"rgba(171, 168, 162, 0)"),t.fillStyle=l,t.beginPath(),t.ellipse(n.x,n.y,n.rx,n.ry,0,0,Math.PI*2),t.fill()}t.fillStyle="#ffffff",t.beginPath(),t.arc(512*.42,256*.72,4,0,Math.PI*2),t.fill(),t.strokeStyle="rgba(255, 255, 255, 0.25)",t.lineWidth=1;for(let n=0;n<Math.PI*2;n+=.35)t.beginPath(),t.moveTo(512*.42,256*.72),t.lineTo(512*.42+Math.cos(n)*75,256*.72+Math.sin(n)*75),t.stroke();const c=new O(a);return c.wrapS=U,c.wrapT=E,c}static createIoTexture(){const a=document.createElement("canvas");a.width=512,a.height=256;const t=a.getContext("2d");t.fillStyle="#e5c158",t.fillRect(0,0,512,256);for(let r=0;r<40;r++){const c=Math.random()*512,n=Math.random()*256,l=10+Math.random()*25;t.fillStyle=Math.random()>.5?"rgba(215, 140, 30, 0.45)":"rgba(245, 230, 150, 0.4)",t.beginPath(),t.arc(c,n,l,0,Math.PI*2),t.fill()}const o=[{x:512*.25,y:256*.45,r:10,color:"#7a1800"},{x:512*.65,y:256*.35,r:14,color:"#2b1005"},{x:512*.45,y:256*.6,r:8,color:"#8c2505"},{x:512*.8,y:256*.55,r:11,color:"#541505"},{x:512*.15,y:256*.7,r:7,color:"#882200"}];for(const r of o)t.strokeStyle="rgba(200, 50, 0, 0.6)",t.lineWidth=3,t.beginPath(),t.arc(r.x,r.y,r.r*2.2,0,Math.PI*2),t.stroke(),t.fillStyle=r.color,t.beginPath(),t.arc(r.x,r.y,r.r,0,Math.PI*2),t.fill();const s=new O(a);return s.wrapS=U,s.wrapT=E,s}static createEuropaTexture(){const a=document.createElement("canvas");a.width=1024,a.height=512;const t=a.getContext("2d");t.fillStyle="#f4f6fa",t.fillRect(0,0,1024,512);const o=t.createLinearGradient(0,0,0,512*.25);o.addColorStop(0,"rgba(230, 240, 250, 0.6)"),o.addColorStop(1,"rgba(244, 246, 250, 0.0)"),t.fillStyle=o,t.fillRect(0,0,1024,512*.25);const s=t.createLinearGradient(0,512,0,512*.75);s.addColorStop(0,"rgba(230, 240, 250, 0.6)"),s.addColorStop(1,"rgba(244, 246, 250, 0.0)"),t.fillStyle=s,t.fillRect(0,512*.75,1024,512*.25);for(let h=0;h<35;h++){const u=h*37%1024,p=512*.3+h*29%(512*.4),f=25+h%5*12,w=t.createRadialGradient(u,p,2,u,p,f);w.addColorStop(0,"rgba(225, 232, 240, 0.25)"),w.addColorStop(1,"rgba(244, 246, 250, 0.0)"),t.fillStyle=w,t.beginPath(),t.arc(u,p,f,0,Math.PI*2),t.fill()}const r=[{x:1024*.28,y:512*.45,rx:42,ry:28},{x:1024*.62,y:512*.52,rx:36,ry:24},{x:1024*.45,y:512*.35,rx:30,ry:20},{x:1024*.82,y:512*.42,rx:38,ry:25}];for(const h of r){const u=t.createRadialGradient(h.x,h.y,5,h.x,h.y,h.rx);u.addColorStop(0,"rgba(175, 135, 105, 0.16)"),u.addColorStop(.7,"rgba(160, 125, 98, 0.10)"),u.addColorStop(1,"rgba(244, 246, 250, 0.0)"),t.fillStyle=u,t.beginPath(),t.ellipse(h.x,h.y,h.rx,h.ry,.2,0,Math.PI*2),t.fill()}let c=42;const n=()=>(c=c*16807%2147483647,(c-1)/2147483646);for(let h=0;h<32;h++){const u=n()*1024,p=512*.15+n()*512*.7,f=80+n()*160,w=(n()-.5)*Math.PI*1.4,y=u+Math.cos(w)*(f*.5)+(n()-.5)*40,v=p+Math.sin(w)*(f*.5)+(n()-.5)*40,b=u+Math.cos(w)*f,A=p+Math.sin(w)*f;t.strokeStyle="rgba(155, 115, 90, 0.14)",t.lineWidth=4,t.beginPath(),t.moveTo(u,p),t.quadraticCurveTo(y,v,b,A),t.stroke(),t.strokeStyle="rgba(115, 80, 65, 0.45)",t.lineWidth=1.2,t.beginPath(),t.moveTo(u,p),t.quadraticCurveTo(y,v,b,A),t.stroke(),t.strokeStyle="rgba(255, 255, 255, 0.55)",t.lineWidth=.8,t.beginPath(),t.moveTo(u+1,p+1),t.quadraticCurveTo(y+1,v+1,b+1,A+1),t.stroke()}t.strokeStyle="rgba(130, 95, 78, 0.22)",t.lineWidth=.7;for(let h=0;h<50;h++){const u=n()*1024,p=n()*512,f=30+n()*60,w=n()*Math.PI*2;t.beginPath(),t.moveTo(u,p),t.lineTo(u+Math.cos(w)*f,p+Math.sin(w)*f),t.stroke()}const l=new O(a);return l.wrapS=U,l.wrapT=E,l}static createGanymedeTexture(){const a=document.createElement("canvas");a.width=512,a.height=256;const t=a.getContext("2d");t.fillStyle="#6e655c",t.fillRect(0,0,512,256),t.fillStyle="#9c9288";for(let s=0;s<14;s++){const r=(s*20+10)%256;t.fillRect(0,r,512,8+s%4*3)}t.strokeStyle="rgba(230, 230, 230, 0.35)",t.lineWidth=1;for(let s=0;s<256;s+=6)t.beginPath(),t.moveTo(0,s),t.lineTo(512,s+Math.sin(s*.1)*8),t.stroke();const o=new O(a);return o.wrapS=U,o.wrapT=E,o}static createCallistoTexture(){const a=document.createElement("canvas");a.width=512,a.height=256;const t=a.getContext("2d");t.fillStyle="#4e4741",t.fillRect(0,0,512,256);for(let c=0;c<180;c++){const n=Math.random()*512,l=Math.random()*256,h=2+Math.random()*8;t.fillStyle="#2f2a26",t.beginPath(),t.arc(n,l,h,0,Math.PI*2),t.fill(),t.strokeStyle="rgba(220, 225, 235, 0.7)",t.lineWidth=1,t.beginPath(),t.arc(n,l,h,0,Math.PI),t.stroke()}const o=512*.45,s=256*.4;t.strokeStyle="rgba(200, 210, 220, 0.4)";for(let c=8;c<=55;c+=7)t.beginPath(),t.arc(o,s,c,0,Math.PI*2),t.stroke();const r=new O(a);return r.wrapS=U,r.wrapT=E,r}static createTitanTexture(){const a=document.createElement("canvas");a.width=512,a.height=256;const t=a.getContext("2d"),o=t.createLinearGradient(0,0,0,256);o.addColorStop(0,"#c78028"),o.addColorStop(.2,"#dba046"),o.addColorStop(.5,"#e8b258"),o.addColorStop(.8,"#dba046"),o.addColorStop(1,"#c07820"),t.fillStyle=o,t.fillRect(0,0,512,256),t.fillStyle="rgba(210, 130, 40, 0.2)",t.fillRect(0,256*.35,512,25),t.fillRect(0,256*.6,512,25);const s=new O(a);return s.wrapS=U,s.wrapT=E,s}static createEnceladusTexture(){const a=document.createElement("canvas");a.width=512,a.height=256;const t=a.getContext("2d");t.fillStyle="#f6f8fb",t.fillRect(0,0,512,256),t.strokeStyle="#68a0c8",t.lineWidth=2;for(let s=0;s<4;s++){const r=217.6+s*5;t.beginPath(),t.moveTo(512*.3,r),t.bezierCurveTo(512*.45,r+4,512*.55,r-4,512*.7,r),t.stroke()}const o=new O(a);return o.wrapS=U,o.wrapT=E,o}static createTritonTexture(){const a=document.createElement("canvas");a.width=512,a.height=256;const t=a.getContext("2d");t.fillStyle="#decac0",t.fillRect(0,0,512,256),t.fillStyle="rgba(165, 135, 125, 0.35)";for(let s=10;s<512;s+=16)for(let r=10;r<256*.6;r+=14)t.beginPath(),t.arc(s+r%8,r,5,0,Math.PI*2),t.fill();t.fillStyle="rgba(50, 40, 35, 0.6)";for(let s=0;s<8;s++){const r=102.4+s*45,c=256*.75+s%3*8;t.beginPath(),t.ellipse(r,c,12,3,.4,0,Math.PI*2),t.fill()}const o=new O(a);return o.wrapS=U,o.wrapT=E,o}static createPlutoTexture(){const a=document.createElement("canvas");a.width=512,a.height=256;const t=a.getContext("2d");t.fillStyle="#8f4f35",t.fillRect(0,0,512,256),t.fillStyle="#421f14",t.fillRect(0,256*.5,512*.45,45);const o=512*.62,s=256*.42;t.fillStyle="#f0e6dc",t.beginPath(),t.ellipse(o-16,s,28,35,-.2,0,Math.PI*2),t.fill(),t.ellipse(o+16,s,26,32,.2,0,Math.PI*2),t.fill();const r=new O(a);return r.wrapS=U,r.wrapT=E,r}static createCeresTexture(){const a=document.createElement("canvas");a.width=512,a.height=256;const t=a.getContext("2d");t.fillStyle="#6e6962",t.fillRect(0,0,512,256);for(let c=0;c<90;c++){const n=Math.random()*512,l=Math.random()*256,h=2+Math.random()*6;t.fillStyle="#48443e",t.beginPath(),t.arc(n,l,h,0,Math.PI*2),t.fill()}const o=512*.52,s=256*.44;t.fillStyle="#3a3630",t.beginPath(),t.arc(o,s,14,0,Math.PI*2),t.fill(),t.fillStyle="#ffffff",t.beginPath(),t.arc(o,s,3.5,0,Math.PI*2),t.fill();const r=new O(a);return r.wrapS=U,r.wrapT=E,r}static createRockyCrateredTexture(e){const t=document.createElement("canvas");t.width=256,t.height=128;const o=t.getContext("2d"),s=e==="Bennu"||e==="Ryugu"||e==="Hygiea",r=e==="Psyche";o.fillStyle=s?"#323232":r?"#948a7e":"#7a746d",o.fillRect(0,0,256,128);for(let n=0;n<50;n++){const l=Math.random()*256,h=Math.random()*128,u=2+Math.random()*5;o.fillStyle=s?"#1a1a1a":"#4e4842",o.beginPath(),o.arc(l,h,u,0,Math.PI*2),o.fill(),o.strokeStyle=s?"#505050":"rgba(200, 195, 185, 0.5)",o.lineWidth=1,o.beginPath(),o.arc(l,h,u,0,Math.PI),o.stroke()}const c=new O(t);return c.wrapS=U,c.wrapT=E,c}static createGenericTexture(e){const i=document.createElement("canvas");i.width=64,i.height=64;const a=i.getContext("2d");return a.fillStyle=e,a.fillRect(0,0,64,64),new O(i)}}m(De,"cache",new Map);const fe=class fe{constructor(){m(this,"loader",new ca);m(this,"customLoader",null);m(this,"cache",new Map);m(this,"inFlightRequests",new Map);m(this,"maxAnisotropy",8);m(this,"baseUrl",(typeof import.meta<"u"&&"/solaris/"||"/").replace(/\/?$/,"/"))}resolveUrl(e){if(!e)return"";if(e.startsWith("http://")||e.startsWith("https://")||e.startsWith("data:")||e.startsWith("blob:"))return e;const i=e.replace(/^(\.\/)+/,"").replace(/^\/+/,"").replace(/\/+/g,"/");return`${this.baseUrl.replace(/\/+$/,"/")}${i}`}static getInstance(){return fe.instance||(fe.instance=new fe),fe.instance}setLoader(e){this.customLoader=e}setBaseUrl(e){this.baseUrl=e.replace(/\/?$/,"/")}setMaxAnisotropy(e){this.maxAnisotropy=Math.max(1,e);for(const i of this.cache.values())i.anisotropy=this.maxAnisotropy,i.needsUpdate=!0}isCached(e){const i=this.resolveUrl(e);return this.cache.has(i)}getCacheSize(){return this.cache.size}evictFromCache(e,i=!1){const a=this.resolveUrl(e),t=this.cache.get(a);return t?(this.cache.delete(a),this.inFlightRequests.delete(a),i&&t.dispose(),!0):!1}clearCache(e=!1){if(e)for(const i of this.cache.values())i.dispose();this.cache.clear(),this.inFlightRequests.clear()}resetForTesting(){this.clearCache(!1),this.customLoader=null,this.baseUrl=(typeof import.meta<"u"&&"/solaris/"||"/").replace(/\/?$/,"/")}loadTexture(e,i=!0,a){const t=this.resolveUrl(e),o=this.cache.get(t);if(o)return o;if(typeof document>"u"&&!this.customLoader){const l=new la;return l.colorSpace=i?Pe:Ge,this.cache.set(t,l),l}const s=this.customLoader||this.loader;let r=!1,c=null;const n=s.load(t,l=>{l.colorSpace=i?Pe:Ge,l.generateMipmaps=!0,l.minFilter=Ye,l.magFilter=qe,l.anisotropy=this.maxAnisotropy,l.needsUpdate=!0},void 0,l=>{if(r=!0,console.warn(`[TexturePipeline] Fallback activated for ${e} (${t}):`,l),this.cache.delete(t),this.inFlightRequests.delete(t),a&&c)try{const h=De.getTexture(a);h&&h.image&&(c.image=h.image,c.needsUpdate=!0)}catch(h){console.warn("[TexturePipeline] Fallback generation error:",h)}});if(c=n,r&&a)try{const l=De.getTexture(a);l&&l.image&&(c.image=l.image,c.needsUpdate=!0)}catch(l){console.warn("[TexturePipeline] Fallback generation error:",l)}return n.colorSpace=i?Pe:Ge,n.generateMipmaps=!0,n.minFilter=Ye,n.magFilter=qe,n.anisotropy=this.maxAnisotropy,r||this.cache.set(t,n),n}loadTextureAsync(e,i=!0,a){const t=this.resolveUrl(e),o=this.cache.get(t);if(o)return Promise.resolve(o);const s=this.inFlightRequests.get(t);if(s)return s;if(typeof document>"u"&&!this.customLoader){const c=this.loadTexture(e,i,a);return Promise.resolve(c)}const r=new Promise((c,n)=>{(this.customLoader||this.loader).load(t,h=>{h.colorSpace=i?Pe:Ge,h.generateMipmaps=!0,h.minFilter=Ye,h.magFilter=qe,h.anisotropy=this.maxAnisotropy,h.needsUpdate=!0,this.cache.set(t,h),this.inFlightRequests.delete(t),c(h)},void 0,h=>{if(this.cache.delete(t),this.inFlightRequests.delete(t),a){console.warn(`[TexturePipeline] Fallback activated for ${e}:`,h);const u=De.getTexture(a);c(u)}else n(h)})});return this.inFlightRequests.set(t,r),r}getPlanetTextures(e){switch(e){case"Sun":return{map:this.loadTexture("/textures/2k_sun.jpg",!0,"Sun"),emissiveMap:this.loadTexture("/textures/2k_sun.jpg",!0,"Sun")};case"Mercury":return{map:this.loadTexture("/textures/2k_mercury.jpg",!0,"Mercury")};case"Venus":return{map:this.loadTexture("/textures/2k_venus_atmosphere.jpg",!0,"Venus")};case"Earth":return{map:this.loadTexture("/textures/2k_earth_daymap.jpg",!0,"Earth"),normalMap:this.loadTexture("/textures/earth_normal_2048.jpg",!1),nightMap:this.loadTexture("/textures/2k_earth_nightmap.jpg",!0),cloudsMap:this.loadTexture("/textures/2k_earth_clouds.jpg",!0,"EarthClouds")};case"Moon":return{map:this.loadTexture("/textures/2k_moon.jpg",!0,"Moon")};case"Mars":return{map:this.loadTexture("/textures/2k_mars.jpg",!0,"Mars")};case"Jupiter":return{map:this.loadTexture("/textures/2k_jupiter.jpg",!0,"Jupiter")};case"Saturn":return{map:this.loadTexture("/textures/2k_saturn.jpg",!0,"Saturn"),ringAlphaMap:this.loadTexture("/textures/2k_saturn_ring_alpha.png",!1,"SaturnRings")};case"Uranus":return{map:this.loadTexture("/textures/2k_uranus.jpg",!0,"Uranus")};case"Neptune":return{map:this.loadTexture("/textures/2k_neptune.jpg",!0,"Neptune")};default:return{map:De.getTexture(e)}}}getMilkyWayTexture(){return this.loadTexture("/textures/gaia_sky.webp",!0)}getMilkyWayDiskTexture(){return this.loadTexture("/textures/milky_way_disk.webp",!0)}};m(fe,"instance");let Ne=fe;class $e{static createPhotosphereMaterial(e){return new F({uniforms:{sunTexture:{value:e},time:{value:0}},vertexShader:`
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
      `})}static createCoronaMaterial(e=14){return new F({uniforms:{sunCenter:{value:new M(0,0,0)},sunRadius:{value:e},time:{value:0}},vertexShader:`
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
      `,blending:Y,side:Re,transparent:!0,depthWrite:!1})}static createProminencesMaterial(){return new F({uniforms:{time:{value:0}},vertexShader:`
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
      `,blending:Y,side:Se,transparent:!0,depthWrite:!1})}static createProminencesGroup(e){const i=new Z;i.name="solar_prominences";const a=this.createProminencesMaterial();return[{lat:.35,lon:.2,scale:.14,angle:.4},{lat:-.42,lon:1.1,scale:.18,angle:-.3},{lat:.15,lon:2.3,scale:.11,angle:.6},{lat:-.25,lon:3.4,scale:.22,angle:-.5},{lat:.55,lon:4.2,scale:.15,angle:.2},{lat:-.1,lon:5.1,scale:.19,angle:.7},{lat:.4,lon:5.8,scale:.12,angle:-.4}].forEach((o,s)=>{const r=new He(1,1,32,8),c=r.attributes.position,n=r.attributes.uv,l=o.scale*e*2.2,h=o.scale*e*1.6,u=o.scale*e*.28;for(let S=0;S<c.count;S++){const D=n.getX(S),P=n.getY(S),C=(D-.5)*l,I=Math.sin(D*Math.PI)*h,G=(P-.5)*u;c.setXYZ(S,C,I,G)}r.computeVertexNormals();const p=new j(r,a);p.name=`prominence_loop_${s}`;const f=Math.cos(o.lat),w=Math.sin(o.lat),y=e*f*Math.cos(o.lon),v=e*w,b=e*f*Math.sin(o.lon);p.position.set(y,v,b);const A=new M(y,v,b).normalize();p.quaternion.setFromUnitVectors(new M(0,1,0),A),p.rotateOnAxis(new M(0,1,0),o.angle),i.add(p)}),i}}const It={Earth:{radiusScale:1.008,rayleighColor:new N(.24,.52,.92),twilightColor:new N(.95,.42,.16),density:.65,falloffPower:4.5,mieG:.72},Venus:{radiusScale:1.012,rayleighColor:new N(.92,.86,.64),twilightColor:new N(.85,.58,.32),density:1.1,falloffPower:3.5,mieG:.65},Mars:{radiusScale:1.004,rayleighColor:new N(.65,.55,.5),twilightColor:new N(.35,.5,.7),density:.12,falloffPower:6,mieG:.55},Uranus:{radiusScale:1.014,rayleighColor:new N(.48,.85,.82),twilightColor:new N(.32,.65,.72),density:.75,falloffPower:3.8,mieG:.7},Neptune:{radiusScale:1.014,rayleighColor:new N(.2,.45,.95),twilightColor:new N(.15,.3,.75),density:.8,falloffPower:3.8,mieG:.7}};class bt{static createAtmosphereMaterial(e){const i=It[e];return i?new F({uniforms:{rayleighColor:{value:i.rayleighColor},twilightColor:{value:i.twilightColor},density:{value:i.density},falloffPower:{value:i.falloffPower},mieG:{value:i.mieG}},vertexShader:`
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
      `,blending:Y,side:Re,transparent:!0,depthWrite:!1}):null}}class Mt{static createSurfaceMaterial(e,i,a,t){return new F({uniforms:{dayMap:{value:e},normalMap:{value:i||null},nightMap:{value:a||null},cloudsMap:{value:t||null},hasNormalMap:{value:i?1:0},hasNightMap:{value:a?1:0},hasCloudsMap:{value:t?1:0}},vertexShader:`
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
      `})}static createCloudMaterial(e){return new F({uniforms:{cloudsMap:{value:e}},vertexShader:`
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
      `,transparent:!0,depthWrite:!1})}}class ka{static createMaterial(e){const{name:i,category:a,map:t,normalMap:o}=e,s=i==="Jupiter"||i==="Saturn"||i==="Uranus"||i==="Neptune",r=i==="Europa"||i==="Enceladus",c=i==="Mercury"||i==="Moon"||a==="asteroid",n=i==="Mars",l=i==="Venus",h=i==="Saturn";return new F({uniforms:{map:{value:t},normalMap:{value:o||null},hasNormalMap:{value:o?1:0},isGasGiant:{value:s?1:0},isIcyMoon:{value:r?1:0},isAirlessRocky:{value:c?1:0},isMars:{value:n?1:0},isVenus:{value:l?1:0},isSaturn:{value:h?1:0}},vertexShader:`
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
      `})}}const La=48,Ot=50,kt=65,Lt=.58;function ct(g){return Ot+Math.pow(Math.max(0,g),Lt)*kt}function ja(g){return Math.pow(Math.max(0,g-Ot)/kt,1/Lt)}function jt(g){if(g.category==="star")return La;switch(g.name){case"Jupiter":return 26.9;case"Saturn":return 22.68;case"Uranus":return 9.62;case"Neptune":return 9.32;case"Earth":return 2.4;case"Venus":return 2.28;case"Mars":return 1.28;case"Mercury":return .92;case"Pluto":return .45}const e=g.physical.meanRadiusKm;return g.category==="moon"?e<100?.18:e<500?.32:e<1200?.48:e<2e3?.65:.95:g.category==="dwarf_planet"?.45:g.category==="asteroid"?e<10?.18:e<100?.25:.38:Math.max(.18,e/6371*2.4)}class Ua{static getVisualRadius(e){return jt(e)}static createPlanet(e){var A;const i=new Z;i.name=`body_group_${e.name}`;const a=this.getVisualRadius(e),o=1-(e.physical.flattening||0),s=e.category==="moon"||e.category==="asteroid",r=e.category==="planet"||e.category==="star",c=new te(1,r?96:s?36:64,r?64:s?24:48);if(e.category==="asteroid"||e.category==="moon"&&e.physical.meanRadiusKm<200){const S=c.attributes.position;for(let D=0;D<S.count;D++){const P=S.getX(D),C=S.getY(D),I=S.getZ(D),G=1+.18*Math.sin(P*4)*Math.cos(C*4+I*3);S.setXYZ(D,P*G,C*G,I*G)}c.computeVertexNormals()}const l=Ne.getInstance().getPlanetTextures(e.name);let h,u,p,f,w,y;const v=[];if(e.category==="star"){h=$e.createPhotosphereMaterial(l.map);const S=new te(2.45,96,64),D=$e.createCoronaMaterial(a),P=new j(S,D);P.name="sun_corona",P.scale.set(a,a,a),i.add(P),v.push(P),y=$e.createProminencesGroup(a),i.add(y)}else if(e.name==="Earth"){if(h=Mt.createSurfaceMaterial(l.map,l.normalMap,l.nightMap,l.cloudsMap),l.cloudsMap){const D=new te(1.004,96,64),P=Mt.createCloudMaterial(l.cloudsMap);p=new j(D,P),p.name="earth_clouds",p.renderOrder=2,p.scale.set(a,a,a),i.add(p)}const S=bt.createAtmosphereMaterial("Earth");if(S){const D=new te(1.012,96,64);f=new j(D,S),f.name="earth_atmosphere",f.renderOrder=3,f.scale.set(a,a,a),i.add(f)}}else{h=ka.createMaterial({name:e.name,category:e.category,map:l.map,normalMap:l.normalMap});const S=bt.createAtmosphereMaterial(e.name);if(S){const D=((A=It[e.name])==null?void 0:A.radiusScale)||1.012,P=new te(D,48,36);f=new j(P,S),f.name=`${e.name.toLowerCase()}_atmosphere`,f.renderOrder=3,f.scale.set(a,a,a),i.add(f)}}const b=new j(c,h);if(b.name=`surface_${e.name}`,b.castShadow=e.category!=="star",b.receiveShadow=e.category!=="star",b.scale.set(a,a*o,a),i.add(b),e.name==="Saturn"){const P=new da(1.32,2.65,128,8),C=P.attributes.position,I=P.attributes.uv;for(let $=0;$<C.count;$++){const ee=C.getX($),se=C.getY($),re=(Math.sqrt(ee*ee+se*se)-1.32)/(2.65-1.32);I.setXY($,re,.5)}I.needsUpdate=!0;const G=l.ringAlphaMap||l.map,V=new F({uniforms:{ringMap:{value:G},saturnCenter:{value:new M},saturnRadius:{value:a}},vertexShader:`
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
        `,side:Se,transparent:!0,depthWrite:!1});w=new j(P,V),w.name="saturn_rings",w.rotation.x=Math.PI*.5,w.renderOrder=3,w.scale.set(a,a,a),i.add(w)}return{definition:e,bodyGroup:i,surfaceMesh:b,nightMesh:u,cloudMesh:p,atmosphereMesh:f,ringMesh:w,glowMeshes:v.length>0?v:void 0,prominencesGroup:y,visualRadius:a}}}const k=class k{static eclipticToIcrf(e){const[i,a,t]=e,o=Math.cos(k.OBLIQUITY_J2000_RAD),s=Math.sin(k.OBLIQUITY_J2000_RAD);return[i,a*o-t*s,a*s+t*o]}static icrfToEcliptic(e){const[i,a,t]=e,o=Math.cos(k.OBLIQUITY_J2000_RAD),s=Math.sin(k.OBLIQUITY_J2000_RAD);return[i,a*o+t*s,-a*s+t*o]}static eclipticToThree(e){return[e[0],e[2],-e[1]]}static threeToEcliptic(e){return[e[0],-e[2],e[1]]}static icrfToThree(e){return k.eclipticToThree(k.icrfToEcliptic(e))}static raDecToIcrf(e,i){const a=e*Math.PI/180,t=i*Math.PI/180;return[Math.cos(t)*Math.cos(a),Math.cos(t)*Math.sin(a),Math.sin(t)]}static galacticBasisThree(){const e=k.icrfToThree(k.raDecToIcrf(k.NGP_RA_DEG,k.NGP_DEC_DEG)),i=k.icrfToThree(k.raDecToIcrf(k.GC_RA_DEG,k.GC_DEC_DEG)),a=i[0]*e[0]+i[1]*e[1]+i[2]*e[2],t=[i[0]-a*e[0],i[1]-a*e[1],i[2]-a*e[2]],o=Math.hypot(...t),s=[t[0]/o,t[1]/o,t[2]/o],r=[e[1]*s[2]-e[2]*s[1],e[2]*s[0]-e[0]*s[2],e[0]*s[1]-e[1]*s[0]];return{x:s,y:r,z:e}}};m(k,"OBLIQUITY_J2000_DEG",23.43929111),m(k,"OBLIQUITY_J2000_RAD",23.43929111*Math.PI/180),m(k,"NGP_RA_DEG",192.85948),m(k,"NGP_DEC_DEG",27.12825),m(k,"GC_RA_DEG",266.40499),m(k,"GC_DEC_DEG",-28.93617);let B=k;const ne=class ne{constructor(){m(this,"mode","exploration")}toRenderPosition(e,i){if(this.mode==="scientific"){const l=1/ne.SCIENTIFIC_KM_PER_UNIT,h=[e[0]*l,e[1]*l,e[2]*l];return B.eclipticToThree(h)}const a=Math.sqrt(e[0]*e[0]+e[1]*e[1]+e[2]*e[2]);if(a<1e3||!i||i.orderFromSun===0)return[0,0,0];const t=a/ne.AU_KM,o=ct(t),s=e[0]/a,r=e[1]/a,c=e[2]/a,n=[s*o,r*o,c*o];return B.eclipticToThree(n)}toMoonRenderPosition(e,i,a,t){if(this.mode==="scientific"){const u=1/ne.SCIENTIFIC_KM_PER_UNIT,p=[e[0]*u,e[1]*u,e[2]*u],f=B.eclipticToThree(p),w=Math.hypot(f[0],f[1],f[2]),y=this.getVisualRadius(t)*1.25+this.getVisualRadius(i);if(w>0&&w<y){const v=y/w;f[0]*=v,f[1]*=v,f[2]*=v}return[a[0]+f[0],a[1]+f[1],a[2]+f[2]]}const o=Math.sqrt(e[0]*e[0]+e[1]*e[1]+e[2]*e[2]);if(o<1)return a;const s=e[0]/o,r=e[1]/o,c=e[2]/o,n=B.eclipticToThree([s,r,c]),h=this.getVisualRadius(t)*(1.35+1.25*Math.log10(1+o/4e4));return[a[0]+n[0]*h,a[1]+n[1]*h,a[2]+n[2]*h]}getVisualRadius(e){if(this.mode==="scientific"){const i=e.physical.meanRadiusKm/ne.SCIENTIFIC_KM_PER_UNIT;return Math.max(.015,i*4)}return jt(e)}};m(ne,"SCIENTIFIC_KM_PER_UNIT",1e6),m(ne,"AU_KM",1495978707e-1);let le=ne;const Ut=66743e-15,_e=299792458,Ft=198847e25,lt=149597870700,Gt=3085677581e7,Ht=9460730472e6,_t=4297e3,Fa=12e3,Kt=8.277,Ga=.033,Bt=Kt*1e3*Gt,Ha=Bt/Ht,zt=_t*Ft,he=2*Ut*zt/(_e*_e),_a=he/1e3,Ka=he/lt,Vt=1.5*he,Ba=Vt/1e3,Ve=3*Math.sqrt(3)/2*he,za=Ve/1e3,Va=Ve/lt,Wa=2*Ve/Bt,Ja=180*3600*1e6/Math.PI,Ya=Wa*Ja,Ke=3*he,qa=Ke/1e3,Xa=Math.sqrt(he/(2*Ke)),J={name:"Sagittarius A*",designation:"CXOGC J174540.0-290028",classification:"Supermassive Black Hole (SMBH)",galacticCenter:{system:"Galactic Coordinate System (IAU 1958 / ICRF J2000)",longitudeDeg:359.944,latitudeDeg:-.046,rightAscensionJ2000:"17h 45m 40.0409s",declinationJ2000:"-29° 00′ 28.118″"},physicalConstants:{G:Ut,c:_e,solarMassKg:Ft,auMeters:lt,parsecMeters:Gt,lightYearMeters:Ht},measurements:{adoptedMassSolar:_t,massUncertaintySolar:Fa,adoptedDistanceKpc:Kt,distanceUncertaintyKpc:Ga,distanceLightYears:Ha,spinParameterAStar:0,spinAssumption:"Adopted Schwarzschild metric (a* = 0) as physical baseline; Kerr prograde spin creates asymmetric shadow offset and reduces ISCO down to 1.0 r_s.",metricAdopted:"Schwarzschild Metric with Relativistic Null-Geodesic Integration",accretionDiskInclinationDeg:42},derivedParameters:{massKg:zt,schwarzschildRadiusM:he,schwarzschildRadiusKm:_a,schwarzschildRadiusAU:Ka,photonSphereRadiusM:Vt,photonSphereRadiusKm:Ba,shadowRadiusM:Ve,shadowRadiusKm:za,shadowRadiusAU:Va,shadowAngularDiameterMicroArcsec:Ya,iscoRadiusM:Ke,iscoRadiusKm:qa,accretionDiskInnerRadiusM:Ke,accretionDiskOuterRadiusM:16*he,iscoOrbitalSpeedFractionC:Xa},sources:[{title:"First Sagittarius A* Event Horizon Telescope Results. I. The Shadow of the Supermassive Black Hole in the Center of the Milky Way",organization:"Event Horizon Telescope Collaboration",url:"https://www.jpl.nasa.gov/news/nasa-supports-event-horizon-telescope-in-studying-milky-ways-black-hole/",dateVerified:"2026-10-13",citation:"EHT Collaboration, 2022, ApJL, 930, L12. Measured shadow diameter: 51.8 +/- 2.3 microarcseconds."},{title:"The mass and distance of the Milky Way’s central black hole from stellar orbits",organization:"GRAVITY Collaboration (ESO / MPE)",url:"https://science.nasa.gov/universe/black-holes/",dateVerified:"2026-10-13",citation:"Abuter et al. (GRAVITY Collaboration), 2021, A&A, 647, A59. Mass: 4.297 +/- 0.012 x 10^6 M_sun, R_0: 8.277 +/- 0.033 kpc."},{title:"Black Hole Anatomy and Physics",organization:"NASA Astrophysics Science Division",url:"https://science.nasa.gov/universe/black-holes/anatomy/",dateVerified:"2026-10-13",citation:"NASA Science Directorate: Event horizon, photon ring, and relativistic accretion disk structure."},{title:"Simulation of Light Geodesics and Relativistic Ray Tracing Around a Supermassive Black Hole",organization:"NASA Goddard Space Flight Center (SVS 14619)",url:"https://svs.gsfc.nasa.gov/14619/",dateVerified:"2026-10-13",citation:"Jeremy Schnittman (NASA GSFC, July 2024): Relativistic ray-tracing, Doppler boosting, and gravitational lensing."},{title:"NASA’s Swift Catches X-ray Action at Milky Way’s Center",organization:"NASA Goddard Space Flight Center",url:"https://www.nasa.gov/news-release/nasas-swift-catches-x-ray-action-at-milky-ways-center/",dateVerified:"2026-10-13",citation:"Multiwavelength monitoring of Sgr A* accretion variability and relativistic flares."}]};J.measurements.adoptedMassSolar,J.measurements.massUncertaintySolar,J.measurements.adoptedDistanceKpc,J.measurements.distanceLightYears,J.derivedParameters.massKg;J.derivedParameters.schwarzschildRadiusKm,J.derivedParameters.schwarzschildRadiusAU,J.derivedParameters.photonSphereRadiusKm,J.derivedParameters.shadowRadiusKm,J.derivedParameters.shadowRadiusAU,J.derivedParameters.shadowAngularDiameterMicroArcsec,J.derivedParameters.iscoRadiusKm,J.derivedParameters.iscoOrbitalSpeedFractionC,J.derivedParameters.iscoOrbitalSpeedFractionC*(_e/1e3);const Wt={schwarzschildRadius:24,diskInnerRadius:72,diskOuterRadius:340,boundingRadius:520};class $a{constructor(e=Wt){m(this,"group",new Z);m(this,"boundingMesh");m(this,"sStarsPoints");m(this,"jetPolesGroup",new Z);m(this,"hitMesh");m(this,"config");m(this,"scientificData",J);m(this,"timeUniform",{value:0});m(this,"opacityUniform",{value:1});m(this,"cameraPosUniform",{value:new M});this.config=e,this.group.name="sagittarius_a_star_black_hole",this.boundingMesh=this.createRelativisticRayMarchMesh(),this.group.add(this.boundingMesh),this.sStarsPoints=this.createNuclearStarCluster(),this.group.add(this.sStarsPoints);const i=new te(Math.max(3200,this.config.boundingRadius*2),16,16),a=new Tt({visible:!1});this.hitMesh=new j(i,a),this.hitMesh.name="sagittarius_a_star_hit_target",this.group.add(this.hitMesh),this.createPolarOutflowJets(),this.jetPolesGroup.visible=!1,this.group.add(this.jetPolesGroup)}createRelativisticRayMarchMesh(){const e=new te(this.config.boundingRadius,64,48),i=this.config.schwarzschildRadius,a=i*(3*Math.sqrt(3)/2),t=this.config.diskInnerRadius,o=this.config.diskOuterRadius,s=new F({uniforms:{uTime:this.timeUniform,uOpacity:this.opacityUniform,uCameraPosLocal:this.cameraPosUniform,uRs:{value:i},uRShadow:{value:a},uRIn:{value:t},uROut:{value:o},uBoundingR:{value:this.config.boundingRadius}},vertexShader:`
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
      `,transparent:!0,side:Se,depthWrite:!1,blending:et}),r=new j(e,s);return r.name="sagittarius_a_star_lensing_volume",r.renderOrder=50,r}createNuclearStarCluster(){const i=new Float32Array(1140),a=new Float32Array(380*3),t=new Float32Array(380),o=this.config.diskOuterRadius*1.08,s=this.config.boundingRadius*.96;for(let l=0;l<380;l++){const h=Math.random(),u=o+Math.pow(h,1.6)*(s-o),p=Math.random()*Math.PI*2,f=(Math.random()-.5)*Math.PI;i[l*3]=u*Math.cos(p)*Math.cos(f),i[l*3+1]=u*Math.sin(f),i[l*3+2]=u*Math.sin(p)*Math.cos(f);const w=Math.random();w<.45?(a[l*3]=.82,a[l*3+1]=.9,a[l*3+2]=1,t[l]=1.4+Math.random()*2.2):w<.75?(a[l*3]=.98,a[l*3+1]=.98,a[l*3+2]=1,t[l]=1.2+Math.random()*1.8):(a[l*3]=1,a[l*3+1]=.85,a[l*3+2]=.58,t[l]=1.5+Math.random()*2.5)}const r=new X;r.setAttribute("position",new L(i,3)),r.setAttribute("color",new L(a,3)),r.setAttribute("size",new L(t,1));const c=new F({uniforms:{uOpacity:this.opacityUniform,uTime:this.timeUniform},vertexShader:`
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
      `,vertexColors:!0,transparent:!0,blending:Y,depthWrite:!1}),n=new ce(r,c);return n.name="s_stars_nuclear_cluster",n}createPolarOutflowJets(){const a=new He(65,720,1,32);a.translate(0,720*.5+this.config.schwarzschildRadius*.95,0);const t=new F({uniforms:{uTime:this.timeUniform,uOpacity:this.opacityUniform},vertexShader:`
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
      `,transparent:!0,side:Se,blending:Y,depthWrite:!1});[0,Math.PI*.25,Math.PI*.5,Math.PI*.75].forEach(s=>{const r=new j(a,t);r.rotation.y=s,this.jetPolesGroup.add(r);const c=a.clone();c.rotateZ(Math.PI);const n=new j(c,t);n.rotation.y=s,this.jetPolesGroup.add(n)})}update(e,i){this.timeUniform.value=i;const a=e.position.clone();this.group.worldToLocal(a),this.cameraPosUniform.value.copy(a),this.sStarsPoints&&(this.sStarsPoints.rotation.y=i*.015)}setOpacity(e){const i=Math.max(0,Math.min(1,e));this.opacityUniform.value=i,this.group.visible=i>.005}dispose(){this.boundingMesh.geometry.dispose(),this.boundingMesh.material.dispose(),this.sStarsPoints.geometry.dispose(),this.sStarsPoints.material.dispose(),this.jetPolesGroup.traverse(e=>{e instanceof j&&(e.geometry.dispose(),Array.isArray(e.material)?e.material.forEach(i=>i.dispose()):e.material.dispose())})}}const ge=1320,Qa=8.277,Za=.0208,ei={radius:28e3,coreRadius:4800,sunDistance:Qa*ge};class we{constructor(e=ei){m(this,"group",new Z);m(this,"sagittariusAStar");m(this,"masterDiskMesh");m(this,"coreBulgeMesh");m(this,"dustExtinctionMesh");m(this,"starPoints");m(this,"satelliteGroup",new Z);m(this,"sunBeaconGroup",new Z);m(this,"sunReticleMesh");m(this,"sunPulseMesh");m(this,"sunRadarRing");m(this,"opacityUniform",{value:0});m(this,"timeUniform",{value:0});m(this,"bulgeFadeUniform",{value:1});m(this,"diskTextureUniform",{value:we.createEmptyTexture()});m(this,"diskTextureRequested",!1);m(this,"config");m(this,"sunWorldPosition",new M);this.config=e,this.group.name="milky_way_external_galaxy";const i=B.galacticBasisThree(),a=new nt().makeBasis(new M(...i.y).negate(),new M(...i.z),new M(...i.x).negate());this.group.quaternion.setFromRotationMatrix(a),this.masterDiskMesh=this.createMasterDisk(),this.group.add(this.masterDiskMesh),this.coreBulgeMesh=this.createVolumetricCore(),this.group.add(this.coreBulgeMesh),this.dustExtinctionMesh=this.createDustExtinction(),this.group.add(this.dustExtinctionMesh),this.starPoints=this.create3DStars(),this.group.add(this.starPoints),this.buildSatelliteGalaxies(),this.group.add(this.satelliteGroup);const{beaconGroup:t,reticleMesh:o,pulseMesh:s,radarRing:r,sunPos:c}=this.createSunBeacon();this.sunBeaconGroup=t,this.sunReticleMesh=o,this.sunPulseMesh=s,this.sunRadarRing=r,this.sunWorldPosition.copy(c),this.group.add(this.sunBeaconGroup),this.group.position.copy(c.clone().applyQuaternion(this.group.quaternion)).negate(),this.sagittariusAStar=new $a,this.group.add(this.sagittariusAStar.group),this.setOpacity(0)}createMasterDisk(){const e=new He(this.config.radius*2,this.config.radius*2,64,64);e.rotateX(-Math.PI*.5);const i=new F({uniforms:{uGalaxyMap:this.diskTextureUniform,uOpacity:this.opacityUniform,uBulgeFade:this.bulgeFadeUniform,uTime:this.timeUniform},vertexShader:`
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
      `,transparent:!0,side:Se,depthWrite:!1,blending:et}),a=new j(e,i);return a.name="milky_way_master_disk",a.renderOrder=-8,a}createVolumetricCore(){const e=new te(this.config.coreRadius,32,24);e.scale(1,.42,.82);const i=new F({uniforms:{uOpacity:this.opacityUniform,uBulgeFade:this.bulgeFadeUniform,uTime:this.timeUniform},vertexShader:`
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
      `,transparent:!0,blending:Y,depthWrite:!1,side:Re}),a=new j(e,i);return a.name="galactic_volumetric_core",a.renderOrder=-7,a}createDustExtinction(){const e=new He(this.config.radius*1.85,this.config.radius*1.85,48,48);e.rotateX(-Math.PI*.5);const i=new F({uniforms:{uGalaxyMap:this.diskTextureUniform,uOpacity:this.opacityUniform,uBulgeFade:this.bulgeFadeUniform},vertexShader:`
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
      `,transparent:!0,side:Se,depthWrite:!1,blending:et}),a=new j(e,i);return a.name="galactic_dust_extinction_sheet",a.position.y=80,a.renderOrder=-6,a}create3DStars(){const i=new Float32Array(42e3),a=new Float32Array(14e3*3),t=new Float32Array(14e3),o=this.config.radius,s=this.config.coreRadius;let r=0;const c=4e3;for(let f=0;f<c;f++){const w=Math.random(),y=Math.pow(w,1.6)*s,v=Math.random()*Math.PI*2,b=(Math.random()-.5)*Math.PI,A=y*Math.cos(v)*Math.cos(b)*1.15,S=y*Math.sin(v)*Math.cos(b)*.85,D=y*Math.sin(b)*.42;i[r*3]=A,i[r*3+1]=D,i[r*3+2]=S,Math.random()<.6?(a[r*3]=1,a[r*3+1]=.85,a[r*3+2]=.6):(a[r*3]=.98,a[r*3+1]=.7,a[r*3+2]=.4),t[r]=1+Math.random()*1.5,r++}const n=8e3;for(let f=0;f<n;f++){const w=Math.random(),y=s*.8+Math.pow(w,1.1)*(o*.9-s*.8),v=Math.random()*Math.PI*2,b=550+y/o*450,A=(Math.random()-.5+(Math.random()-.5))*b,S=Math.cos(v)*y,D=Math.sin(v)*y;i[r*3]=S,i[r*3+1]=A,i[r*3+2]=D;const P=Math.random();P<.28?(a[r*3]=.75,a[r*3+1]=.88,a[r*3+2]=1,t[r]=1.4+Math.random()*1.8):P<.38?(a[r*3]=1,a[r*3+1]=.52,a[r*3+2]=.78,t[r]=1.6+Math.random()*1.6):P<.72?(a[r*3]=.98,a[r*3+1]=.96,a[r*3+2]=.92,t[r]=.9+Math.random()*1.2):(a[r*3]=1,a[r*3+1]=.82,a[r*3+2]=.52,t[r]=1+Math.random()*1.4),r++}const l=2e3;for(let f=0;f<l;f++){const w=Math.random(),y=Math.pow(w,1.4)*(o*1.35),v=Math.random()*Math.PI*2,b=(Math.random()-.5)*Math.PI;i[r*3]=y*Math.cos(v)*Math.cos(b),i[r*3+1]=y*Math.sin(b)*.7,i[r*3+2]=y*Math.sin(v)*Math.cos(b),a[r*3]=.92,a[r*3+1]=.9,a[r*3+2]=.95,t[r]=.8+Math.random()*1,r++}const h=new X;h.setAttribute("position",new L(i,3)),h.setAttribute("color",new L(a,3)),h.setAttribute("size",new L(t,1));const u=new F({uniforms:{uOpacity:this.opacityUniform,uTime:this.timeUniform},vertexShader:`
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
      `,vertexColors:!0,transparent:!0,blending:Y,depthWrite:!1}),p=new ce(h,u);return p.name="galactic_3d_stars",p.renderOrder=-5,p}static createEmptyTexture(){const e=new ha(new Uint8Array([0,0,0,0]),1,1,ma);return e.needsUpdate=!0,e}static galactocentricToLocal(e,i,a){return new M(-i,a,-e).multiplyScalar(ge)}buildSatelliteGalaxies(){const e=this.createDwarfGalaxy("large_magellanic_cloud",we.galactocentricToLocal(-.71,-40.95,-26.93),4*ge,new N(13822207),450);this.satelliteGroup.add(e);const i=this.createDwarfGalaxy("small_magellanic_cloud",we.galactocentricToLocal(15.93,-37.57,-43.61),2*ge,new N(14741247),220);this.satelliteGroup.add(i);const a=this.createDwarfGalaxy("sagittarius_dwarf_spheroidal",we.galactocentricToLocal(17.29,2.51,-6.48),2.5*ge,new N(16770756),280);this.satelliteGroup.add(a)}createDwarfGalaxy(e,i,a,t,o){const s=new Z;s.name=e,s.position.copy(i);const r=new te(a,24,16);r.scale(1.25,.55,.95);const c=new F({uniforms:{uOpacity:this.opacityUniform,uColor:{value:t}},vertexShader:`
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
      `,transparent:!0,blending:Y,depthWrite:!1,side:Re}),n=new j(r,c);n.renderOrder=-9,s.add(n);const l=new X,h=new Float32Array(o*3);for(let f=0;f<o;f++){const w=Math.random(),y=Math.pow(w,1.8)*a,v=Math.random()*Math.PI*2,b=(Math.random()-.5)*Math.PI;h[f*3]=y*Math.cos(v)*Math.cos(b)*1.25,h[f*3+1]=y*Math.sin(b)*.55,h[f*3+2]=y*Math.sin(v)*Math.cos(b)}l.setAttribute("position",new L(h,3));const u=new Rt({color:t,size:1.2,transparent:!0,opacity:.55,blending:Y,depthWrite:!1}),p=new ce(l,u);return s.add(p),s}createSunBeacon(){const e=new Z;e.name="sun_orion_spur_beacon";const i=this.config.sunDistance,a=Za*ge,t=new M(0,a,i);e.position.copy(t);const o=new X,s=64,r=[],c=450;for(let P=0;P<=s;P++){const C=P/s*Math.PI*2;r.push(new M(Math.cos(C)*c,0,Math.sin(C)*c))}o.setFromPoints(r);const n=new Ce({color:16766720,transparent:!0,opacity:.9}),l=new Me(o,n);e.add(l);const h=new X,u=[],p=750;for(let P=0;P<=s;P++){const C=P/s*Math.PI*2;u.push(new M(Math.cos(C)*p,0,Math.sin(C)*p))}h.setFromPoints(u);const f=new vt({color:16771704,dashSize:40,gapSize:25,transparent:!0,opacity:.65}),w=new Me(h,f);w.computeLineDistances(),e.add(w);const y=new te(180,16,12),v=new Tt({color:16771976,transparent:!0,opacity:.95,blending:Y}),b=new j(y,v);e.add(b);const A=new X().setFromPoints([new M(0,-a,0),new M(0,0,0)]),S=new vt({color:16769138,dashSize:22,gapSize:15,transparent:!0,opacity:.55}),D=new Me(A,S);return D.computeLineDistances(),e.add(D),{beaconGroup:e,reticleMesh:l,pulseMesh:b,radarRing:w,sunPos:t}}getGalacticCenterWorldPosition(e=new M){return this.group.updateWorldMatrix(!0,!1),this.group.getWorldPosition(e)}setOpacity(e){const i=Math.max(0,Math.min(1,e));if(this.opacityUniform.value=i,this.group.visible=i>.005,this.group.visible&&!this.diskTextureRequested){this.diskTextureRequested=!0;const a=Ne.getInstance().getMilkyWayDiskTexture();a.wrapS=E,a.wrapT=E,this.diskTextureUniform.value=a}this.sagittariusAStar&&this.sagittariusAStar.setOpacity(i),this.sunReticleMesh&&(this.sunReticleMesh.material.opacity=i*.9),this.sunRadarRing&&(this.sunRadarRing.material.opacity=i*.65),this.sunPulseMesh&&(this.sunPulseMesh.material.opacity=i*.95)}update(e,i){if(this.timeUniform.value=e,this.sagittariusAStar&&i){this.sagittariusAStar.update(i,e);const a=i.position.clone();this.group.worldToLocal(a);const t=a.length(),o=K.clamp((t-450)/2200,0,1);this.bulgeFadeUniform.value=o}if(this.sunPulseMesh&&this.group.visible){const a=1+.22*Math.sin(e*3.5);this.sunPulseMesh.scale.set(a,a,a)}this.sunReticleMesh&&this.group.visible&&(this.sunReticleMesh.rotation.y=e*.35),this.sunRadarRing&&this.group.visible&&(this.sunRadarRing.rotation.y=-e*.22)}dispose(){this.sagittariusAStar.dispose(),this.masterDiskMesh.geometry.dispose(),this.masterDiskMesh.material.dispose(),this.coreBulgeMesh.geometry.dispose(),this.coreBulgeMesh.material.dispose(),this.dustExtinctionMesh.geometry.dispose(),this.dustExtinctionMesh.material.dispose(),this.starPoints.geometry.dispose(),this.starPoints.material.dispose(),this.sunReticleMesh.geometry.dispose(),this.sunReticleMesh.material.dispose(),this.sunRadarRing.geometry.dispose(),this.sunRadarRing.material.dispose(),this.sunPulseMesh.geometry.dispose(),this.sunPulseMesh.material.dispose(),this.satelliteGroup.traverse(e=>{(e instanceof j||e instanceof ce)&&(e.geometry.dispose(),Array.isArray(e.material)?e.material.forEach(i=>i.dispose()):e.material.dispose())})}}class ti{constructor(){m(this,"mesh");m(this,"count",700);m(this,"positions");m(this,"colors");m(this,"relativePositions");m(this,"radius",110);m(this,"currentSpeed",0);this.positions=new Float32Array(this.count*2*3),this.colors=new Float32Array(this.count*2*3),this.relativePositions=new Float32Array(this.count*3);for(let a=0;a<this.count;a++){const t=Math.random(),o=(.2+.8*Math.cbrt(t))*this.radius,s=Math.random()*Math.PI*2,r=Math.acos(2*Math.random()-1);this.relativePositions[a*3]=o*Math.sin(r)*Math.cos(s),this.relativePositions[a*3+1]=o*Math.sin(r)*Math.sin(s),this.relativePositions[a*3+2]=o*Math.cos(r)}const e=new X;e.setAttribute("position",new L(this.positions,3)),e.setAttribute("color",new L(this.colors,3));const i=new Ce({vertexColors:!0,transparent:!0,blending:Y,depthWrite:!1});this.mesh=new Ct(e,i),this.mesh.name="velocity_travel_particles",this.mesh.frustumCulled=!1}update(e,i,a,t){const o=i.length(),s=o+Math.abs(a)*45;this.currentSpeed+=(s-this.currentSpeed)*Math.min(1,t*8);const r=this.currentSpeed>.8,c=Math.min(28,this.currentSpeed*.16+Math.abs(a)*14),n=Math.min(.85,Math.max(.08,(this.currentSpeed-.5)*.08));let l=0,h=0,u=-1;o>.01?(l=-i.x/o,h=-i.y/o,u=-i.z/o):Math.abs(a)>.01&&(u=a>0?1:-1);const p=this.mesh.geometry.attributes.position,f=this.mesh.geometry.attributes.color,w=this.radius*2,y=this.radius;for(let v=0;v<this.count;v++){const b=v*3,A=v*6,S=v*6+3;r&&(this.relativePositions[b]+=l*this.currentSpeed*t*.5,this.relativePositions[b+1]+=h*this.currentSpeed*t*.5,this.relativePositions[b+2]+=u*this.currentSpeed*t*.5);for(let V=0;V<3;V++)this.relativePositions[b+V]>y?this.relativePositions[b+V]-=w:this.relativePositions[b+V]<-y&&(this.relativePositions[b+V]+=w);const D=e.x+this.relativePositions[b],P=e.y+this.relativePositions[b+1],C=e.z+this.relativePositions[b+2];this.positions[A]=D,this.positions[A+1]=P,this.positions[A+2]=C,c>.4?(this.positions[S]=D+l*c,this.positions[S+1]=P+h*c,this.positions[S+2]=C+u*c):(this.positions[S]=D+.05,this.positions[S+1]=P+.05,this.positions[S+2]=C+.05);const I=n*1.2,G=n*.15;this.colors[A]=.88*I,this.colors[A+1]=.92*I,this.colors[A+2]=1*I,this.colors[S]=.65*G,this.colors[S+1]=.8*G,this.colors[S+2]=.95*G}p.needsUpdate=!0,f.needsUpdate=!0}dispose(){this.mesh.geometry.dispose(),this.mesh.material.dispose()}}const ai=[[54061,53910],[53910,58001],[58001,59774],[59774,54061],[59774,62956],[62956,65378],[65378,67301],[27989,25336],[27989,26207],[25336,26207],[27989,26727],[25336,25930],[25930,26311],[26311,26727],[26727,27366],[25930,24436],[746,3179],[3179,4427],[4427,6686],[6686,8886],[60718,61084],[62434,59747],[102098,100453],[100453,95947],[102488,100453],[100453,97165],[49669,50583],[50583,50335],[50335,48455],[50583,54872],[54872,57632],[57632,54879],[54879,49669],[80763,78820],[78820,78401],[80763,82396],[82396,86228],[86228,85927],[32349,30324],[32349,33579],[33579,34444],[34444,35904],[91262,91971],[91971,92420],[92420,93194],[93194,92791],[92791,91971]],q=class q{constructor(){m(this,"group",new Z);m(this,"celestialGroup",new Z);m(this,"pointsMesh");m(this,"localInterstellarStars");m(this,"constellationLines");m(this,"milkyWayMesh");m(this,"milkyWayOpacityUniform",{value:1});m(this,"stardustMesh");m(this,"externalGalaxy");m(this,"travelParticles");m(this,"isLoaded",!1);m(this,"localStarsOpacity",{value:0});this.group.name="starfield_hipparcos",this.group.add(this.celestialGroup),this.celestialGroup.name="celestial_infinite_sphere",this.buildMilkyWayBackground(),this.build3DCosmicStardust(),this.externalGalaxy=new we,this.group.add(this.externalGalaxy.group),this.travelParticles=new ti,this.group.add(this.travelParticles.mesh),this.loadCatalog()}buildMilkyWayBackground(){const e=new te(q.SPHERE_RADIUS*1.05,64,48),i=Ne.getInstance().getMilkyWayTexture(),a=new F({uniforms:{milkyWayMap:{value:i},uOpacity:this.milkyWayOpacityUniform},vertexShader:`
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
          vec4 tex = texture2D(milkyWayMap, vec2(1.0 - vUv.x, vUv.y));
          vec3 rgb = tex.rgb;

          // Pure, natural photographic contrast matching the ESA Gaia DR3 reference (test_gaia.jpg):
          // Deep clean space vacuum without washed-out toe or artificial fog,
          // preserving the authentic golden galactic core and dark absorption dust lanes.
          rgb = smoothstep(vec3(0.016), vec3(1.0), rgb);

          gl_FragColor = vec4(rgb, uOpacity);
        }
      `,side:Re,transparent:!0,depthWrite:!1});this.milkyWayMesh=new j(e,a),this.milkyWayMesh.name="milky_way_skybox",this.milkyWayMesh.renderOrder=-10;const t=B.galacticBasisThree(),o=new nt().makeBasis(new M(...t.x),new M(...t.z),new M(...t.y).negate());this.milkyWayMesh.quaternion.setFromRotationMatrix(o),this.celestialGroup.add(this.milkyWayMesh)}build3DCosmicStardust(){const i=new Float32Array(2400),a=new Float32Array(800*3),t=new Float32Array(800),o=new Float32Array(800);for(let c=0;c<800;c++){const n=30+Math.pow(Math.random(),.7)*750,l=Math.random()*Math.PI*2,h=(Math.random()-.5)*(90+n*.1);i[c*3]=Math.cos(l)*n,i[c*3+1]=h,i[c*3+2]=Math.sin(l)*n;const u=Math.random();u<.5?(a[c*3]=.9,a[c*3+1]=.92,a[c*3+2]=.98):u<.8?(a[c*3]=.98,a[c*3+1]=.85,a[c*3+2]=.6):(a[c*3]=.65,a[c*3+1]=.85,a[c*3+2]=.98),t[c]=1+Math.random()*1.5,o[c]=Math.random()*Math.PI*2}const s=new X;s.setAttribute("position",new L(i,3)),s.setAttribute("color",new L(a,3)),s.setAttribute("aScale",new L(t,1)),s.setAttribute("aPhase",new L(o,1));const r=new F({uniforms:{time:{value:0}},vertexShader:`
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
      `,vertexColors:!0,transparent:!0,blending:Y,depthWrite:!1});this.stardustMesh=new ce(s,r),this.stardustMesh.name="cosmic_stardust_motes",this.stardustMesh.renderOrder=-2,this.group.add(this.stardustMesh)}async loadCatalog(){try{const e="/solaris/".replace(/\/?$/,"/"),i=await fetch(`${e}data/stars.json`);if(!i.ok)throw new Error(`Failed to fetch stars.json: HTTP ${i.status}`);const a=await i.json();this.buildStarfieldMesh(a),this.buildConstellations(a),this.isLoaded=!0}catch(e){console.warn("Could not stream Hipparcos stars dataset, using procedural fallback:",e),this.buildProceduralFallback()}}buildStarfieldMesh(e){const i=e.stars.filter(p=>p[4]<=4.6),a=i.length,t=new Float32Array(a*3),o=new Float32Array(a*3),s=new Float32Array(a),r=q.SPHERE_RADIUS;for(let p=0;p<a;p++){const f=i[p],w=f[1],y=f[2],v=f[3],b=f[4],A=f[5],S=B.icrfToThree([w,y,v]);t[p*3]=S[0]*r,t[p*3+1]=S[1]*r,t[p*3+2]=S[2]*r;const D=this.bvToRGB(A,f[8]);o[p*3]=D.r,o[p*3+1]=D.g,o[p*3+2]=D.b;const P=Math.max(.6,2.8-.42*b);s[p]=P}const c=new X;c.setAttribute("position",new L(t,3)),c.setAttribute("color",new L(o,3)),c.setAttribute("size",new L(s,1));const n=`
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
    `,l=`
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
    `,h=new F({vertexShader:n,fragmentShader:l,vertexColors:!0,transparent:!0,blending:Y,depthWrite:!1});this.pointsMesh=new ce(c,h),this.pointsMesh.renderOrder=0,this.celestialGroup.add(this.pointsMesh);const u=e.stars.filter(p=>p[6]!==null&&p[6]>0&&p[6]<120);if(u.length>0){const p=new Float32Array(u.length*3),f=new Float32Array(u.length*3),w=new Float32Array(u.length);for(let b=0;b<u.length;b++){const A=u[b],S=q.LOCAL_STAR_OFFSET+A[6]*q.LOCAL_UNITS_PER_PC,D=B.icrfToThree([A[1],A[2],A[3]]);p[b*3]=D[0]*S,p[b*3+1]=D[1]*S,p[b*3+2]=D[2]*S;const P=this.bvToRGB(A[5],A[8]);f[b*3]=P.r,f[b*3+1]=P.g,f[b*3+2]=P.b;const C=A[4];w[b]=Math.max(.8,2.6-.3*C)}const y=new X;y.setAttribute("position",new L(p,3)),y.setAttribute("color",new L(f,3)),y.setAttribute("size",new L(w,1));const v=new F({vertexShader:`
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
`+l.replace("gl_FragColor = vec4(vColor, alpha);","gl_FragColor = vec4(vColor, alpha * uOpacity);"),uniforms:{uOpacity:this.localStarsOpacity},vertexColors:!0,transparent:!0,blending:Y,depthWrite:!1});this.localInterstellarStars=new ce(y,v),this.localInterstellarStars.visible=!1,this.localInterstellarStars.name="local_interstellar_3d_stars",this.localInterstellarStars.renderOrder=1,this.group.add(this.localInterstellarStars)}}buildConstellations(e){const i=new Map,a=q.SPHERE_RADIUS*.998;for(const r of e.stars){const c=B.icrfToThree([r[1],r[2],r[3]]);i.set(r[0],[c[0]*a,c[1]*a,c[2]*a])}const t=[];for(const[r,c]of ai){const n=i.get(r),l=i.get(c);n&&l&&(t.push(n[0],n[1],n[2]),t.push(l[0],l[1],l[2]))}if(t.length===0)return;const o=new X;o.setAttribute("position",new ua(t,3));const s=new Ce({color:5231045,transparent:!0,opacity:q.CONSTELLATION_OPACITY,depthWrite:!1,blending:Y});this.constellationLines=new Ct(o,s),this.constellationLines.name="constellation_lines",this.celestialGroup.add(this.constellationLines)}bvToRGB(e,i){if(e!==null)return e<-.1?new N(10335487):e<.15?new N(12374783):e<.35?new N(15791359):e<.6?new N(16775144):e<.85?new N(16770723):e<1.3?new N(16760437):new N(16747093);switch(i){case"O":return new N(10335487);case"B":return new N(12374783);case"A":return new N(15791359);case"F":return new N(16775144);case"G":return new N(16770723);case"K":return new N(16760437);case"M":return new N(16747093);default:return new N(16777215)}}buildProceduralFallback(){const i=new X,a=new Float32Array(6e3*3),t=new Float32Array(6e3*3),o=q.SPHERE_RADIUS;for(let r=0;r<6e3;r++){const c=Math.random()*Math.PI*2,n=Math.acos(Math.random()*2-1);a[r*3]=o*Math.sin(n)*Math.cos(c),a[r*3+1]=o*Math.cos(n),a[r*3+2]=o*Math.sin(n)*Math.sin(c),t[r*3]=.9,t[r*3+1]=.92,t[r*3+2]=1}i.setAttribute("position",new L(a,3)),i.setAttribute("color",new L(t,3));const s=new Rt({size:2.5,vertexColors:!0,transparent:!0,opacity:.85});this.pointsMesh=new ce(i,s),this.celestialGroup.add(this.pointsMesh)}update(e,i,a,t,o){this.celestialGroup.position.copy(e);const s=e.length(),r=this.externalGalaxy.getGalacticCenterWorldPosition(),c=e.distanceTo(r),n=K.clamp((s-3500)/18500,0,1),l=c<8e3?K.clamp((8e3-c)/4e3,0,1):0,h=Math.max(n,l),u=h*h*(3-2*h);if(this.externalGalaxy.setOpacity(u),this.milkyWayOpacityUniform.value=1-u,this.constellationLines&&(this.constellationLines.material.opacity=q.CONSTELLATION_OPACITY*(1-u)),this.localInterstellarStars){const p=K.smoothstep(s,700,1600),f=1-K.smoothstep(s,9e3,2e4),w=p*f;this.localStarsOpacity.value=w,this.localInterstellarStars.visible=w>.005}this.externalGalaxy.update(performance.now()*.001,o),this.travelParticles.update(e,a||new M,t||0,i)}setConstellationsVisible(e){this.constellationLines&&(this.constellationLines.visible=e)}toggleConstellations(){return this.constellationLines?(this.constellationLines.visible=!this.constellationLines.visible,this.constellationLines.visible):!1}areConstellationsVisible(){var e;return((e=this.constellationLines)==null?void 0:e.visible)??!0}dispose(){this.externalGalaxy.dispose(),this.travelParticles.dispose(),this.localInterstellarStars&&(this.localInterstellarStars.geometry.dispose(),this.localInterstellarStars.material.dispose()),this.milkyWayMesh&&(this.milkyWayMesh.geometry.dispose(),this.milkyWayMesh.material.dispose()),this.pointsMesh&&(this.pointsMesh.geometry.dispose(),this.pointsMesh.material.dispose()),this.constellationLines&&(this.constellationLines.geometry.dispose(),this.constellationLines.material.dispose()),this.stardustMesh&&(this.stardustMesh.geometry.dispose(),this.stardustMesh.material.dispose())}};m(q,"SPHERE_RADIUS",8500),m(q,"LOCAL_STAR_OFFSET",700),m(q,"CONSTELLATION_OPACITY",.38),m(q,"LOCAL_UNITS_PER_PC",38);let Ee=q;const St={Sun:{targetCoverageY:.85,ndcOffsetX:-.28,ndcOffsetY:0,fov:42,preferredElevation:Math.PI*.35},Mercury:{targetCoverageY:.92,ndcOffsetX:-.34,ndcOffsetY:0,fov:40,preferredElevation:Math.PI*.38},Venus:{targetCoverageY:.92,ndcOffsetX:-.34,ndcOffsetY:0,fov:40,preferredElevation:Math.PI*.38},Earth:{targetCoverageY:.94,ndcOffsetX:-.35,ndcOffsetY:0,fov:40,preferredElevation:Math.PI*.37},Mars:{targetCoverageY:.92,ndcOffsetX:-.34,ndcOffsetY:0,fov:40,preferredElevation:Math.PI*.38},Jupiter:{targetCoverageY:1.08,ndcOffsetX:-.38,ndcOffsetY:0,fov:41,preferredElevation:Math.PI*.39},Saturn:{targetCoverageY:.88,ndcOffsetX:-.28,ndcOffsetY:0,fov:41,effectiveRadiusMultiplier:1.95,preferredElevation:Math.PI*.32},Uranus:{targetCoverageY:.92,ndcOffsetX:-.34,ndcOffsetY:0,fov:40,preferredElevation:Math.PI*.38},Neptune:{targetCoverageY:.92,ndcOffsetX:-.34,ndcOffsetY:0,fov:40,preferredElevation:Math.PI*.38},Pluto:{targetCoverageY:.9,ndcOffsetX:-.32,ndcOffsetY:0,fov:39,preferredElevation:Math.PI*.38},"Sagittarius A*":{targetCoverageY:.88,ndcOffsetX:.22,ndcOffsetY:-.02,fov:40,preferredElevation:Math.PI*.42}},Qe={targetCoverageY:.92,ndcOffsetX:-.34,ndcOffsetY:0,fov:40,preferredElevation:Math.PI*.38},ii={targetCoverageY:.88,ndcOffsetX:-.33,ndcOffsetY:0,fov:39,preferredElevation:Math.PI*.38},Te=class Te{constructor(e){m(this,"camera");m(this,"subjectAnchor",new M(0,0,0));m(this,"orbitPivot",new M(0,0,0));m(this,"aimPoint",new M(0,0,0));m(this,"currentNdcOffset",new tt(-.34,0));m(this,"targetNdcOffset",new tt(-.34,0));m(this,"shotMode","cinematic_observation");m(this,"effectiveAnchor",new M(0,0,0));m(this,"currentVelocity",new M(0,0,0));m(this,"lastCameraPos",new M(0,0,0));m(this,"lastRadius",680);m(this,"zoomRate",0);m(this,"lastUpdateTime",performance.now());m(this,"hasMotionSample",!1);m(this,"motionBasis","relative");m(this,"tmpRelPos",new M);m(this,"spherical",new xe(680,Math.PI*.3,Math.PI*.25));m(this,"targetSpherical",new xe(680,Math.PI*.3,Math.PI*.25));m(this,"panOffset",new M(0,0,0));m(this,"targetPanOffset",new M(0,0,0));m(this,"focusedObject",null);m(this,"focusDistance",30);m(this,"focusedRadius",2.8);m(this,"focusedPhysicalRadiusKm",null);m(this,"distanceModel","exploration");m(this,"transition",null);m(this,"isOrbiting",!1);m(this,"isPanning",!1);m(this,"previousMousePosition",{x:0,y:0});m(this,"lastInteractionTime",performance.now());m(this,"activeTouches",new Map);m(this,"initialPinchDist",0);m(this,"initialRadiusOnPinch",0);m(this,"enableIdleDrift",!0);m(this,"damping",.12);m(this,"domElement");m(this,"onMouseDown",e=>{if(this.lastInteractionTime=performance.now(),this.transition){this.transition=null;const i=new M().subVectors(this.camera.position,this.orbitPivot);this.spherical.setFromVector3(i),this.targetSpherical.copy(this.spherical)}e.button===0?e.shiftKey?this.isPanning=!0:this.isOrbiting=!0:e.button===2&&(this.isPanning=!0),this.previousMousePosition={x:e.clientX,y:e.clientY}});m(this,"onMouseUp",()=>{this.isOrbiting=!1,this.isPanning=!1,this.lastInteractionTime=performance.now()});m(this,"onMouseMove",e=>{if(this.lastInteractionTime=performance.now(),!this.isOrbiting&&!this.isPanning)return;const i=e.clientX-this.previousMousePosition.x,a=e.clientY-this.previousMousePosition.y;if(this.previousMousePosition={x:e.clientX,y:e.clientY},this.isOrbiting)this.targetSpherical.theta-=i*.005,this.targetSpherical.phi-=a*.005,this.targetSpherical.phi=Math.max(.02,Math.min(Math.PI-.02,this.targetSpherical.phi));else if(this.isPanning){const t=this.spherical.radius*.001,o=new M,s=new M;this.camera.matrixWorld.extractBasis(o,s,new M),this.targetPanOffset.addScaledVector(o,-i*t),this.targetPanOffset.addScaledVector(s,a*t)}});m(this,"onWheel",e=>{if(e.preventDefault(),this.lastInteractionTime=performance.now(),this.transition){this.transition=null;const s=new M().subVectors(this.camera.position,this.orbitPivot);this.spherical.setFromVector3(s),this.targetSpherical.copy(this.spherical)}const i=Math.pow(.92,e.deltaY*.012),t=this.focusedObject&&(this.focusedObject.name.includes("sagittarius")||this.focusedObject.name==="Sagittarius A*")?65:this.focusedObject?this.focusedRadius*1.15:.35,o=18e4;this.targetSpherical.radius=Math.max(t,Math.min(o,this.targetSpherical.radius*i))});m(this,"onContextMenu",e=>{e.preventDefault()});m(this,"onTouchStart",e=>{if(this.lastInteractionTime=performance.now(),this.transition){this.transition=null;const i=new M().subVectors(this.camera.position,this.orbitPivot);this.spherical.setFromVector3(i),this.targetSpherical.copy(this.spherical)}for(let i=0;i<e.changedTouches.length;i++){const a=e.changedTouches[i];this.activeTouches.set(a.identifier,{x:a.clientX,y:a.clientY})}if(this.activeTouches.size===2){const i=Array.from(this.activeTouches.values());this.initialPinchDist=Math.hypot(i[0].x-i[1].x,i[0].y-i[1].y),this.initialRadiusOnPinch=this.targetSpherical.radius}});m(this,"onTouchMove",e=>{if(this.lastInteractionTime=performance.now(),this.activeTouches.size===1&&e.touches.length===1){const i=e.touches[0],a=this.activeTouches.get(i.identifier);if(a){const t=i.clientX-a.x,o=i.clientY-a.y;this.targetSpherical.theta-=t*.006,this.targetSpherical.phi-=o*.006,this.targetSpherical.phi=Math.max(.02,Math.min(Math.PI-.02,this.targetSpherical.phi)),this.activeTouches.set(i.identifier,{x:i.clientX,y:i.clientY})}}else if(this.activeTouches.size>=2&&e.touches.length>=2){const i=[e.touches[0],e.touches[1]],a=Math.hypot(i[0].clientX-i[1].clientX,i[0].clientY-i[1].clientY);if(this.initialPinchDist>0){const t=this.initialPinchDist/a,s=this.focusedObject&&(this.focusedObject.name.includes("sagittarius")||this.focusedObject.name==="Sagittarius A*")?65:this.focusedObject?this.focusedRadius*1.15:.35;this.targetSpherical.radius=Math.max(s,Math.min(18e4,this.initialRadiusOnPinch*t))}}});m(this,"onTouchEnd",e=>{this.lastInteractionTime=performance.now();for(let i=0;i<e.changedTouches.length;i++)this.activeTouches.delete(e.changedTouches[i].identifier);this.activeTouches.size<2&&(this.initialPinchDist=0)});this.domElement=e,this.camera=new pa(45,e.clientWidth/e.clientHeight,.05,16e4),this.updateCameraPosition(),this.setupEventListeners(e)}static calculateViewingDistance(e,i,a=i.fov){const t=e*(i.effectiveRadiusMultiplier||1),o=K.degToRad(a*.5),s=Math.tan(o),r=Math.max(.1,i.targetCoverageY),c=t/(r*s);return Math.max(t*1.15,c)}getResponsiveNdcOffset(e,i,a){let t=e,o=i;if(a>=1.5)t=e,o=i;else if(a>=1){const s=(a-1)/.5;t=e*(.45+.55*s),o=i}else t=e*.15,o=-.1;return{x:t,y:o}}calculateAimPoint(e,i,a,t,o,s){if(Math.abs(a)<.001&&Math.abs(t)<.001)return i.clone();const r=new M().subVectors(i,e),c=r.length();if(c<.001)return i.clone();const n=r.clone().divideScalar(c),l=new M(0,1,0);let h=new M().crossVectors(n,l);h.lengthSq()<1e-4&&(h=new M().crossVectors(n,new M(0,0,1))),h.normalize();const u=new M().crossVectors(h,n).normalize(),p=this.getResponsiveNdcOffset(a,t,s),f=K.degToRad(o*.5),w=Math.tan(f),y=s*w,v=p.x*c*y,b=p.y*c*w;return new M().copy(i).addScaledVector(h,-v).addScaledVector(u,-b)}updateCameraPosition(){if(this.transition){const s=performance.now()-this.transition.startTime,r=Math.min(1,s/this.transition.durationMs),c=r<.5?16*Math.pow(r,5):1-Math.pow(-2*r+2,5)/2;this.transition.targetObject?(this.transition.targetObject.updateWorldMatrix(!0,!1),this.transition.targetObject.getWorldPosition(this.subjectAnchor)):this.subjectAnchor.set(0,0,0),this.camera.fov=K.lerp(this.transition.startFov,this.transition.targetFov,c),this.currentNdcOffset.x=K.lerp(this.transition.startNdcOffsetX,this.transition.targetNdcOffsetX,c),this.currentNdcOffset.y=K.lerp(this.transition.startNdcOffsetY,this.transition.targetNdcOffsetY,c);const n=K.lerp(this.spherical.theta,this.transition.targetTheta,c),l=K.lerp(this.spherical.phi,this.transition.targetPhi,c),h=K.lerp(this.spherical.radius,this.transition.targetDistance,c);this.orbitPivot.lerpVectors(this.transition.startPivot,this.subjectAnchor,c);const u=new M().setFromSphericalCoords(h,l,n);this.camera.position.copy(this.orbitPivot).add(u),this.aimPoint=this.calculateAimPoint(this.camera.position,this.orbitPivot,this.currentNdcOffset.x,this.currentNdcOffset.y,this.camera.fov,this.camera.aspect),this.camera.lookAt(this.aimPoint);const p=Math.max(.05,h-this.focusedRadius);this.camera.near=Math.max(.04,p*.08),this.camera.far=Math.max(16e4,h*30),this.camera.updateProjectionMatrix(),this.trackMotion(this.tmpRelPos.copy(this.camera.position),h,"absolute"),r>=1&&(this.transition.onComplete&&this.transition.onComplete(),this.spherical.set(h,l,n),this.targetSpherical.copy(this.spherical),this.panOffset.set(0,0,0),this.targetPanOffset.set(0,0,0),this.transition=null);return}let e=this.subjectAnchor;if(this.focusedObject){this.focusedObject.updateWorldMatrix(!0,!1),this.focusedObject.getWorldPosition(this.subjectAnchor);const o=this.spherical.radius;if(!(this.focusedObject.name.includes("sagittarius")||this.focusedObject.name==="Sagittarius A*")&&o>320){const r=Math.min(1,(o-320)/480);this.effectiveAnchor.lerpVectors(this.subjectAnchor,Te.ORIGIN_VEC,r),e=this.effectiveAnchor}else e=this.subjectAnchor}else this.subjectAnchor.set(0,0,0),e=this.subjectAnchor;this.currentNdcOffset.x+=(this.targetNdcOffset.x-this.currentNdcOffset.x)*this.damping,this.currentNdcOffset.y+=(this.targetNdcOffset.y-this.currentNdcOffset.y)*this.damping,this.panOffset.lerp(this.targetPanOffset,this.damping),this.orbitPivot.copy(e).add(this.panOffset),this.enableIdleDrift&&!this.isOrbiting&&!this.isPanning&&this.shotMode==="cinematic_observation"&&performance.now()-this.lastInteractionTime>3e3&&(this.targetSpherical.theta+=8e-5),this.spherical.theta+=(this.targetSpherical.theta-this.spherical.theta)*this.damping,this.spherical.phi+=(this.targetSpherical.phi-this.spherical.phi)*this.damping,this.spherical.radius+=(this.targetSpherical.radius-this.spherical.radius)*this.damping,this.spherical.phi=Math.max(.02,Math.min(Math.PI-.02,this.spherical.phi));const i=new M().setFromSpherical(this.spherical);this.camera.position.copy(this.orbitPivot).add(i),this.aimPoint=this.calculateAimPoint(this.camera.position,this.orbitPivot,this.currentNdcOffset.x,this.currentNdcOffset.y,this.camera.fov,this.camera.aspect),this.camera.lookAt(this.aimPoint);const a=this.spherical.radius,t=Math.max(.05,a-this.focusedRadius);this.camera.near=Math.max(.04,Math.min(30,t*.08)),this.camera.far=Math.max(25e4,a*35),this.camera.updateProjectionMatrix(),this.trackMotion(this.tmpRelPos.subVectors(this.camera.position,this.orbitPivot),this.spherical.radius,"relative")}trackMotion(e,i,a){const t=performance.now(),o=Math.max(.001,(t-this.lastUpdateTime)*.001);a!==this.motionBasis&&(this.motionBasis=a,this.hasMotionSample=!1),this.hasMotionSample&&(this.currentVelocity.subVectors(e,this.lastCameraPos).divideScalar(o),this.lastRadius>.001&&(this.zoomRate=(Math.log(i)-Math.log(this.lastRadius))/o)),this.hasMotionSample=!0,this.lastCameraPos.copy(e),this.lastRadius=i,this.lastUpdateTime=t}update(){this.updateCameraPosition()}get lookAtTarget(){return this.aimPoint}focusCinematic(e,i,a="",t=1800,o){this.focusedObject=e,this.focusedRadius=i,this.shotMode="cinematic_observation",typeof window<"u"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches&&(t=150),e.updateWorldMatrix(!0,!1);const s=new M;e.getWorldPosition(s);const r=St[a]||(i<1?ii:Qe);this.targetNdcOffset.set(r.ndcOffsetX,r.ndcOffsetY);const c=Te.calculateViewingDistance(i,r,r.fov);this.focusDistance=c;const n=new M().copy(s).negate(),l=n.lengthSq()<1||a==="Sun";l?n.set(0,0,1):n.normalize();const h=new M(-n.z,0,n.x).normalize(),u=new M(0,1,0);let p;if(l)p=new M(0,.4,1).normalize().multiplyScalar(c);else if(a==="Saturn")p=new M().copy(n).multiplyScalar(-.35).addScaledVector(h,.65).addScaledVector(u,.58).normalize().multiplyScalar(c);else if(a==="Sagittarius A*"||a==="Sgr A*"||a==="sagittarius_a_star"){const w=new ga;e.getWorldQuaternion(w),p=new M(.28,.25,.92).normalize().applyQuaternion(w).multiplyScalar(c)}else p=new M().copy(n).multiplyScalar(.48).addScaledVector(h,.72).addScaledVector(u,.36).normalize().multiplyScalar(c);const f=new xe().setFromVector3(p);f.phi=Math.max(.04,Math.min(Math.PI-.04,f.phi)),this.targetPanOffset.set(0,0,0),this.panOffset.set(0,0,0),this.transition={startPos:this.camera.position.clone(),startAimPoint:this.aimPoint.clone(),startFov:this.camera.fov,startNdcOffsetX:this.currentNdcOffset.x,startNdcOffsetY:this.currentNdcOffset.y,startPivot:this.orbitPivot.clone(),startSpherical:this.spherical.clone(),targetObject:e,targetRadius:i,targetBodyName:a,targetShotMode:"cinematic_observation",targetFov:r.fov,targetNdcOffsetX:r.ndcOffsetX,targetNdcOffsetY:r.ndcOffsetY,targetDistance:c,targetTheta:f.theta,targetPhi:f.phi,startTime:performance.now(),durationMs:t,onComplete:()=>{this.spherical.copy(f),this.targetSpherical.copy(f),this.camera.fov=r.fov,this.currentNdcOffset.set(r.ndcOffsetX,r.ndcOffsetY),o&&o()}}}focusOn(e,i,a=1800){this.focusCinematic(e,i,e.name,a)}resetToOverview(e=1600){this.focusedObject=null,this.focusedRadius=48,this.shotMode="deep_space_overview",this.targetPanOffset.set(0,0,0),this.panOffset.set(0,0,0),this.targetNdcOffset.set(0,0),typeof window<"u"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches&&(e=150);const i=new xe(680,Math.PI*.3,Math.PI*.25);this.transition={startPos:this.camera.position.clone(),startAimPoint:this.aimPoint.clone(),startFov:this.camera.fov,startNdcOffsetX:this.currentNdcOffset.x,startNdcOffsetY:this.currentNdcOffset.y,startPivot:this.orbitPivot.clone(),startSpherical:this.spherical.clone(),targetObject:null,targetRadius:48,targetBodyName:"Overview",targetShotMode:"deep_space_overview",targetFov:45,targetNdcOffsetX:0,targetNdcOffsetY:0,targetDistance:680,targetTheta:i.theta,targetPhi:i.phi,startTime:performance.now(),durationMs:e,onComplete:()=>{this.spherical.copy(i),this.targetSpherical.copy(i),this.subjectAnchor.set(0,0,0),this.orbitPivot.set(0,0,0),this.camera.fov=45,this.currentNdcOffset.set(0,0)}}}transitionToDistance(e,i=45,a="deep_space_overview",t=1600,o,s){typeof window<"u"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches&&(t=150);let r;if(s)r=new xe().setFromVector3(s.clone().normalize().multiplyScalar(e)),r.phi=Math.max(.04,Math.min(Math.PI-.04,r.phi));else{const l=this.targetSpherical.theta,h=o!==void 0?o:Math.max(.08,Math.min(Math.PI*.45,this.targetSpherical.phi));r=new xe(e,h,l)}this.shotMode=a,this.targetPanOffset.set(0,0,0);const c=a==="cinematic_observation"?-.34:0,n=0;this.transition={startPos:this.camera.position.clone(),startAimPoint:this.aimPoint.clone(),startFov:this.camera.fov,startNdcOffsetX:this.currentNdcOffset.x,startNdcOffsetY:this.currentNdcOffset.y,startPivot:this.orbitPivot.clone(),startSpherical:this.spherical.clone(),targetObject:e<350?this.focusedObject:null,targetRadius:this.focusedRadius,targetBodyName:this.focusedObject?this.focusedObject.name:"Cosmos",targetShotMode:a,targetFov:i,targetNdcOffsetX:c,targetNdcOffsetY:n,targetDistance:e,targetTheta:r.theta,targetPhi:r.phi,startTime:performance.now(),durationMs:t,onComplete:()=>{this.spherical.copy(r),this.targetSpherical.copy(r),e>=350&&(this.subjectAnchor.set(0,0,0),this.orbitPivot.set(0,0,0)),this.camera.fov=i,this.currentNdcOffset.set(c,n),this.targetNdcOffset.set(c,n)}}}jumpToScale(e,i=1800){let a=680,t="scientific_overview",o=45,s,r;switch(e){case"planetary":a=this.focusedRadius>0?this.focusedRadius*2.8:12,t="cinematic_observation",o=40;break;case"inner_system":a=180,t="scientific_overview",o=45,s=Math.PI*.32;break;case"outer_system":a=1100,t="deep_space_overview",o=46,s=Math.PI*.28;break;case"interstellar":a=8200,t="deep_space_overview",o=48,s=Math.PI*.26;break;case"galactic":a=52e3,t="deep_space_overview",o=48;{const c=B.galacticBasisThree(),n=K.degToRad(35);r=new M(...c.z).multiplyScalar(Math.cos(n)).addScaledVector(new M(...c.x),-Math.sin(n))}break}this.transitionToDistance(a,o,t,i,s,r)}getVelocity(){return this.currentVelocity}getZoomVelocity(){return this.zoomRate}getTravelSpeed(){return this.currentVelocity.length()}getObserverScaleMetric(){const e=this.spherical.radius,i=t=>`${Math.round(t).toLocaleString("en-US")} KM`;if(this.focusedObject&&(this.focusedObject.name.includes("sagittarius")||this.focusedObject.name==="Sagittarius A*")){const t=e/Wt.schwarzschildRadius,o=t*J.derivedParameters.schwarzschildRadiusKm;return{distance:e,formatted:`${t.toFixed(1)} r_s (${i(o)})`,domain:"planetary"}}const a=this.focusedObject!==null&&this.focusedPhysicalRadiusKm!==null&&e<320;if(e<30||a){const t=this.distanceModel==="scientific"?le.SCIENTIFIC_KM_PER_UNIT:this.focusedPhysicalRadiusKm&&this.focusedRadius>0?this.focusedPhysicalRadiusKm/this.focusedRadius:2654.5833333333335;return{distance:e,formatted:i(e*t),domain:"planetary"}}if(e<3500){let t;if(this.distanceModel==="scientific")t=e*le.SCIENTIFIC_KM_PER_UNIT/le.AU_KM;else{const s=ct(1);t=e<s?e/s:ja(e)}const o=e<380?"inner_system":"outer_system";return{distance:e,formatted:`${t.toFixed(t<10?2:1)} AU`,domain:o}}if(e<25e3){const t=Math.max(0,e-Ee.LOCAL_STAR_OFFSET)/Ee.LOCAL_UNITS_PER_PC;return{distance:e,formatted:`${(t*3.26156).toFixed(1)} LY`,domain:"interstellar"}}return{distance:e,formatted:`${(e/ge).toFixed(1)} KPC`,domain:"galactic"}}toggleFramingOffset(){if(Math.abs(this.targetNdcOffset.x)>.05)return this.targetNdcOffset.set(0,0),this.shotMode="free_inspection",!1;{const e=this.focusedObject&&St[this.focusedObject.name]||Qe;return this.targetNdcOffset.set(e.ndcOffsetX,e.ndcOffsetY),this.shotMode="cinematic_observation",!0}}setupEventListeners(e){this.domElement=e,e&&e.addEventListener&&(e.addEventListener("mousedown",this.onMouseDown),e.addEventListener("wheel",this.onWheel,{passive:!1}),e.addEventListener("contextmenu",this.onContextMenu),e.addEventListener("touchstart",this.onTouchStart,{passive:!0})),typeof window<"u"&&(window.addEventListener("mouseup",this.onMouseUp),window.addEventListener("mousemove",this.onMouseMove),window.addEventListener("touchmove",this.onTouchMove,{passive:!0}),window.addEventListener("touchend",this.onTouchEnd,{passive:!0}))}handleResize(e,i){this.camera.aspect=e/i,this.camera.updateProjectionMatrix()}dispose(){this.domElement&&this.domElement.removeEventListener&&(this.domElement.removeEventListener("mousedown",this.onMouseDown),this.domElement.removeEventListener("wheel",this.onWheel),this.domElement.removeEventListener("contextmenu",this.onContextMenu),this.domElement.removeEventListener("touchstart",this.onTouchStart)),typeof window<"u"&&(window.removeEventListener("mouseup",this.onMouseUp),window.removeEventListener("mousemove",this.onMouseMove),window.removeEventListener("touchmove",this.onTouchMove),window.removeEventListener("touchend",this.onTouchEnd))}};m(Te,"ORIGIN_VEC",new M(0,0,0));let it=Te;const oe=class oe{constructor(e=Date.now()){m(this,"currentUtcMs");m(this,"lastPerfTimeMs");m(this,"isPaused",!1);m(this,"timeMultiplier",1);this.currentUtcMs=e,this.lastPerfTimeMs=performance.now()}update(e=performance.now()){const i=e-this.lastPerfTimeMs;if(this.lastPerfTimeMs=e,!this.isPaused&&i>0){const a=i*this.timeMultiplier;this.currentUtcMs+=a}return this.currentUtcMs}getUtcMs(){return this.currentUtcMs}setUtcMs(e){this.currentUtcMs=e,this.lastPerfTimeMs=performance.now()}getIsoString(){return new Date(this.currentUtcMs).toISOString()}getJulianDate(){return oe.utcMsToJulianDate(this.currentUtcMs)}getJulianDateTDB(){return oe.utcMsToJulianDate(this.currentUtcMs)+oe.TT_MINUS_UTC_SECONDS/86400}getJulianCenturiesJ2000(){return(this.getJulianDateTDB()-oe.J2000_JD)/36525}static utcMsToJulianDate(e){return e/864e5+24405875e-1}static julianDateToUtcMs(e){return(e-24405875e-1)*864e5}resetToJ2000(){this.setUtcMs(oe.J2000_UTC_MS)}resetToNow(){this.setUtcMs(Date.now())}};m(oe,"J2000_JD",2451545),m(oe,"J2000_UTC_MS",946727935816),m(oe,"TT_MINUS_UTC_SECONDS",69.184);let be=oe;const z=class z{static solveKepler(e,i,a=1e-12,t=25){const o=Math.PI*2;e=(e%o+o)%o,e>Math.PI&&(e-=o);let s;if(i<.18)s=e+i*Math.sin(e);else{const r=e<0?-1:1;s=e+r*.85*i}for(let r=0;r<t;r++){const c=s-i*Math.sin(s)-e;if(Math.abs(c)<a)return s;const n=1-i*Math.cos(s);if(Math.abs(n)<1e-15)break;const l=c/n;if(s-=l,Math.abs(l)<a)return s}return s}static elementsAt(e,i,a=z.GM_SUN){const t=(e.epochJd??z.J2000_JD)-z.J2000_JD,o=i-t,s=Math.PI/180,r=e.ratesPerCentury;if(r){const l=o/z.DAYS_PER_CENTURY;return{a:(e.semiMajorAxisAU+r.semiMajorAxisAU*l)*z.AU_KM,e:e.eccentricity+r.eccentricity*l,iDeg:e.inclinationDeg+r.inclinationDeg*l,nodeDeg:e.longitudeAscendingNodeDeg+r.longitudeAscendingNodeDeg*l,argPeriDeg:e.argumentPeriapsisDeg+r.argumentPeriapsisDeg*l,meanAnomalyRad:(e.meanAnomalyAtEpochDeg+r.meanAnomalyDeg*l)*s}}const c=e.semiMajorAxisKm,n=e.meanMotionDegPerDay!==void 0?e.meanMotionDegPerDay*s:Math.sqrt(a/(c*c*c))*86400;return{a:c,e:e.eccentricity,iDeg:e.inclinationDeg,nodeDeg:e.longitudeAscendingNodeDeg+(e.nodeRateDegPerDay??0)*o,argPeriDeg:e.argumentPeriapsisDeg+(e.periapsisArgRateDegPerDay??0)*o,meanAnomalyRad:e.meanAnomalyAtEpochDeg*s+n*o}}static propagate(e,i,a=z.GM_SUN){if(e.semiMajorAxisKm<=0)return{positionKm:[0,0,0],velocityKmPerSec:[0,0,0],trueAnomalyDeg:0,eccentricAnomalyDeg:0,distanceKm:0,speedKmPerSec:0};const t=z.elementsAt(e,i,a),o=t.a,s=t.e,r=z.solveKepler(t.meanAnomalyRad,s),c=Math.sin(r),n=Math.cos(r),l=Math.sqrt(1-s*s)*c/(1-s*n),h=(n-s)/(1-s*n),u=Math.atan2(l,h),p=o*(1-s*n),f=o*(n-s),w=o*Math.sqrt(1-s*s)*c,y=Math.sqrt(a*o)/p,v=-y*c,b=y*Math.sqrt(1-s*s)*n,{P:A,Q:S}=z.perifocalBasis(t.iDeg,t.argPeriDeg,t.nodeDeg),D=[f*A[0]+w*S[0],f*A[1]+w*S[1],f*A[2]+w*S[2]],P=[v*A[0]+b*S[0],v*A[1]+b*S[1],v*A[2]+b*S[2]],[C,I,G]=D,[V,$,ee]=P,se=Math.sqrt(V*V+$*$+ee*ee);return{positionKm:[C,I,G],velocityKmPerSec:[V,$,ee],trueAnomalyDeg:(u*180/Math.PI%360+360)%360,eccentricAnomalyDeg:(r*180/Math.PI%360+360)%360,distanceKm:p,speedKmPerSec:se}}static perifocalBasis(e,i,a){const t=e*Math.PI/180,o=i*Math.PI/180,s=a*Math.PI/180,r=Math.cos(s),c=Math.sin(s),n=Math.cos(t),l=Math.sin(t),h=Math.cos(o),u=Math.sin(o);return{P:[r*h-c*u*n,c*h+r*u*n,u*l],Q:[-r*u-c*h*n,-c*u+r*h*n,h*l]}}static sampleOrbitPath(e,i=128,a=0){const t=[];if(e.semiMajorAxisKm<=0)return t;const o=z.elementsAt(e,a),s=o.a,r=o.e,c=s*Math.sqrt(Math.max(0,1-r*r)),{P:n,Q:l}=z.perifocalBasis(o.iDeg,o.argPeriDeg,o.nodeDeg);for(let h=0;h<=i;h++){const u=h/i*Math.PI*2,p=s*(Math.cos(u)-r),f=c*Math.sin(u),w=[p*n[0]+f*l[0],p*n[1]+f*l[1],p*n[2]+f*l[2]];t.push(w)}return t}};m(z,"GM_SUN",1327124400419394e-4),m(z,"DAYS_PER_CENTURY",36525),m(z,"AU_KM",1495978707e-1),m(z,"J2000_JD",2451545);let de=z;class At{static createOrbitLine(e,i,a=0,t=180){if(e.orderFromSun===0||e.orbit.semiMajorAxisKm<=0)return null;const s=de.sampleOrbitPath(e.orbit,t,a).map(l=>{const h=i.toRenderPosition(l,e);return new M(h[0],h[1],h[2])}),r=new X().setFromPoints(s),c=new Ce({color:new N(e.physical.colorHex||"#555566"),transparent:!0,opacity:e.category==="planet"?.3:.18,linewidth:1}),n=new Me(r,c);return n.name=`kepler_orbit_${e.name}`,n}static createMoonOrbitLine(e,i,a,t=0,o=96){if(e.orbit.semiMajorAxisKm<=0)return null;const r=de.sampleOrbitPath(e.orbit,o,t).map(h=>{const u=a.toMoonRenderPosition(h,e,[0,0,0],i);return new M(u[0],u[1],u[2])}),c=new X().setFromPoints(r),n=new Ce({color:new N(e.physical.colorHex||"#778899"),transparent:!0,opacity:.2,linewidth:1}),l=new Me(c,n);return l.name=`kepler_moon_orbit_${e.name}`,l}}function oi(g=19890825){let e=g>>>0;return function(){let i=e+=1831565813;return i=Math.imul(i^i>>>15,i|1),i^=i+Math.imul(i^i>>>7,i|61),((i^i>>>14)>>>0)/4294967296}}class si{constructor(e,i=19890825){m(this,"mesh");m(this,"count",3200);m(this,"elements",[]);m(this,"dummy",new fa);m(this,"transform");m(this,"seed");this.transform=e,this.seed=i;const a=new ya(.35,1),t=a.attributes.position;for(let s=0;s<t.count;s++){const r=t.getX(s),c=t.getY(s),n=t.getZ(s),l=1+.22*Math.sin(r*5)*Math.cos(c*5+n*3);t.setXYZ(s,r*l,c*l,n*l)}a.computeVertexNormals();const o=new xa({roughness:.88,metalness:.12,vertexColors:!0});this.mesh=new va(a,o,this.count),this.mesh.name="asteroid_belt_instanced",this.mesh.castShadow=!1,this.mesh.receiveShadow=!1,this.generateElements(),this.updatePositions(0)}generateElements(){const e=oi(this.seed),i=[{au:2.5,width:.045},{au:2.82,width:.04},{au:2.96,width:.035},{au:3.27,width:.05}],a=[];let t=0;for(;t<this.count;){const o=2.12+e()*1.16;let s=!1;for(const v of i)if(Math.abs(o-v.au)<v.width&&e()<.88){s=!0;break}if(s)continue;const r=.03+e()*.19,c=e()*e()*18,n=K.degToRad(c),l=e()*Math.PI*2,h=e()*Math.PI*2,u=e()*Math.PI*2,p=Math.pow(o,1.5)*365.25,f=Math.PI*2/p,w=.12+e()*.22;this.elements.push({semiMajorAxisAU:o,eccentricity:r,inclinationRad:n,longNodeRad:l,argPeriRad:h,meanAnomalyEpochRad:u,meanMotionRadPerDay:f,scale:w});const y=e();if(y<.7){const v=.28+e()*.18;a.push(new N(v*.95,v*.92,v*.88))}else if(y<.9){const v=.45+e()*.22;a.push(new N(v*1.05,v*.95,v*.8))}else{const v=.55+e()*.25;a.push(new N(v,v*.95,v*.9))}t++}for(let o=0;o<a.length;o++)this.mesh.setColorAt(o,a[o]);this.mesh.instanceColor&&(this.mesh.instanceColor.needsUpdate=!0)}updatePositions(e){const i=this.transform.mode==="scientific";for(let a=0;a<this.elements.length;a++){const t=this.elements[a],o=(t.meanAnomalyEpochRad+t.meanMotionRadPerDay*e)%(Math.PI*2),s=de.solveKepler(o,t.eccentricity,1e-8,12),r=2*Math.atan2(Math.sqrt(1+t.eccentricity)*Math.sin(s/2),Math.sqrt(1-t.eccentricity)*Math.cos(s/2)),c=t.semiMajorAxisAU*(1-t.eccentricity*t.eccentricity)/(1+t.eccentricity*Math.cos(r)),n=r+t.argPeriRad,l=Math.cos(n),h=Math.sin(n),u=Math.cos(t.longNodeRad),p=Math.sin(t.longNodeRad),f=Math.cos(t.inclinationRad),w=Math.sin(t.inclinationRad),y=c,v=y*(u*l-p*h*f),b=y*(p*l+u*h*f),A=y*(h*w);let S,D,P;if(i){const I=le.AU_KM/le.SCIENTIFIC_KM_PER_UNIT;S=v*I,D=A*I,P=-b*I}else{const I=ct(c),G=Math.sqrt(v*v+b*b+A*A);S=v/G*I,D=A/G*I,P=-(b/G)*I}this.dummy.position.set(S,D,P);const C=t.scale*(i?.5:1);this.dummy.scale.set(C,C,C),this.dummy.rotation.set(o*2,o*3.5,o*1.5),this.dummy.updateMatrix(),this.mesh.setMatrixAt(a,this.dummy.matrix)}this.mesh.instanceMatrix.needsUpdate=!0}setVisible(e){this.mesh.visible=e}isVisible(){return this.mesh.visible}dispose(){this.mesh.geometry.dispose(),this.mesh.material.dispose()}}const ri={Sun:{ra0:286.13,dec0:63.87,w0:84.176,wRate:14.1844},Mercury:{ra0:281.0103,raRate:-.0328,dec0:61.4155,decRate:-.0049,w0:329.5988,wRate:6.1385108},Venus:{ra0:272.76,dec0:67.16,w0:160.2,wRate:-1.4813688},Earth:{ra0:0,raRate:-.641,dec0:90,decRate:-.557,w0:190.147,wRate:360.9856235},Mars:{ra0:317.269202,raRate:-.10927547,dec0:54.432516,decRate:-.05827105,w0:176.049863,wRate:350.891982443297},Jupiter:{ra0:268.056595,raRate:-.006499,dec0:64.495303,decRate:.002413,w0:284.95,wRate:870.536},Saturn:{ra0:40.589,raRate:-.036,dec0:83.537,decRate:-.004,w0:38.9,wRate:810.7939024},Uranus:{ra0:257.311,dec0:-15.175,w0:203.81,wRate:-501.1600928},Neptune:{ra0:299.36,dec0:43.46,w0:249.978,wRate:541.1397757,neptuneNutation:!0},Pluto:{ra0:132.993,dec0:-6.163,w0:302.695,wRate:56.3625225},Ceres:{ra0:291.418,dec0:66.764,w0:170.65,wRate:952.1532},Vesta:{ra0:309.031,dec0:42.235,w0:285.39,wRate:1617.3329428},Eros:{ra0:11.35,dec0:17.22,w0:326.07,wRate:1639.38864745},Gaspra:{ra0:9.47,dec0:26.7,w0:83.67,wRate:1226.911485},Ida:{ra0:168.76,dec0:-87.12,w0:274.05,wRate:1864.628007}},ni={Bennu:{lambdaDeg:69.92,betaDeg:-83.45,periodHours:4.296057},Ryugu:{lambdaDeg:179.3,betaDeg:-87.44,periodHours:7.6326}},ve=Math.PI/180;function Ie(g){const e=Math.hypot(g[0],g[1],g[2])||1;return[g[0]/e,g[1]/e,g[2]/e]}function dt(g,e){return[g[1]*e[2]-g[2]*e[1],g[2]*e[0]-g[0]*e[2],g[0]*e[1]-g[1]*e[0]]}const Pt=B.icrfToThree,ci=B.raDecToIcrf;function li(g,e){const i=ri[g];if(i){const t=e/36525;let o=i.ra0+(i.raRate??0)*t,s=i.dec0+(i.decRate??0)*t,r=i.w0+i.wRate*e;if(i.neptuneNutation){const l=(357.85+52.316*t)*ve;o+=.7*Math.sin(l),s-=.51*Math.cos(l),r-=.48*Math.sin(l)}const c=ci(o,s),n=[-Math.sin(o*ve),Math.cos(o*ve),0];return ot(Pt(n),Pt(c),r*ve)}const a=ni[g];if(a){const t=a.lambdaDeg*ve,o=a.betaDeg*ve,s=[Math.cos(o)*Math.cos(t),Math.cos(o)*Math.sin(t),Math.sin(o)],r=B.eclipticToThree(s),c=B.eclipticToThree([0,0,1]);let n=dt(c,r);Math.hypot(...n)<1e-6&&(n=[1,0,0]);const l=e*24/a.periodHours*2*Math.PI;return ot(Ie(n),r,l)}return null}function di(g,e){const i=B.eclipticToThree(g),a=B.eclipticToThree(e),t=Ie(dt(i,a)),o=Ie([-i[0],-i[1],-i[2]]);return ot(o,t,0)}function ot(g,e,i){const a=Ie(e),t=g[0]*a[0]+g[1]*a[1]+g[2]*a[2],o=Ie([g[0]-t*a[0],g[1]-t*a[1],g[2]-t*a[2]]),s=dt(o,a);return{xAxis:o,yAxis:a,zAxis:s,spinRad:i}}const Be=class Be{constructor(e,i){m(this,"container");m(this,"renderer");m(this,"scene");m(this,"cameraRig");m(this,"clock",new be);m(this,"transform",new le);m(this,"planetBundles",new Map);m(this,"orbitLinesGroup",new Z);m(this,"moonOrbitLines",new Map);m(this,"latestPhysicalStates",new Map);m(this,"orbitLinesEpochDays",0);m(this,"tmpMatrix",new nt);m(this,"tmpX",new M);m(this,"tmpY",new M);m(this,"tmpZ",new M);m(this,"starfield");m(this,"asteroidBelt");m(this,"raycaster",new wa);m(this,"mouse",new tt);m(this,"isRunning",!0);m(this,"animationFrameId",null);m(this,"lastFrameTime",performance.now());m(this,"selectedBody");m(this,"onTelemetryUpdate");m(this,"lastTelemetryTime",0);m(this,"pointerDownPos",{x:0,y:0});m(this,"onPointerDown",e=>{this.pointerDownPos={x:e.clientX,y:e.clientY}});m(this,"onCanvasMouseMove",e=>{var o,s;if(e.target!==this.renderer.domElement)return;const i=this.renderer.domElement.getBoundingClientRect(),a=(e.clientX-i.left)/i.width*2-1,t=-((e.clientY-i.top)/i.height)*2+1;if((s=(o=this.starfield)==null?void 0:o.externalGalaxy)!=null&&s.sagittariusAStar){const r=this.starfield.externalGalaxy.getGalacticCenterWorldPosition(),c=r.clone().project(this.cameraRig.camera);if(c.z>=-1&&c.z<=1){const n=i.width/Math.max(1,i.height),l=(a-c.x)*n,h=t-c.y,u=Math.hypot(l,h),f=this.cameraRig.camera.position.distanceTo(r)>12e3?.18:.25;if(u<f){this.renderer.domElement.style.cursor="pointer";return}}}this.renderer.domElement.style.cursor==="pointer"&&(this.renderer.domElement.style.cursor="")});m(this,"onCanvasClick",e=>{var s,r,c,n,l,h,u,p,f,w;if(e.target!==this.renderer.domElement||Math.hypot(e.clientX-this.pointerDownPos.x,e.clientY-this.pointerDownPos.y)>6)return;const a=this.renderer.domElement.getBoundingClientRect();if(this.mouse.x=(e.clientX-a.left)/a.width*2-1,this.mouse.y=-((e.clientY-a.top)/a.height)*2+1,(r=(s=this.starfield)==null?void 0:s.externalGalaxy)!=null&&r.sagittariusAStar){const y=this.starfield.externalGalaxy.getGalacticCenterWorldPosition(),v=y.clone().project(this.cameraRig.camera);if(v.z>=-1&&v.z<=1){const b=a.width/Math.max(1,a.height),A=(this.mouse.x-v.x)*b,S=this.mouse.y-v.y,D=Math.hypot(A,S),C=this.cameraRig.camera.position.distanceTo(y)>12e3?.18:.25;if(D<C){this.selectBody("Sagittarius A*",2200);return}}}this.raycaster.setFromCamera(this.mouse,this.cameraRig.camera);const t=[];this.planetBundles.forEach(y=>{t.push(y.surfaceMesh)}),(n=(c=this.starfield)==null?void 0:c.externalGalaxy)!=null&&n.sagittariusAStar&&(this.starfield.externalGalaxy.sagittariusAStar.hitMesh&&t.push(this.starfield.externalGalaxy.sagittariusAStar.hitMesh),this.starfield.externalGalaxy.sagittariusAStar.boundingMesh&&t.push(this.starfield.externalGalaxy.sagittariusAStar.boundingMesh));const o=this.raycaster.intersectObjects(t,!1);if(o.length>0){const y=o[0].object;if(y===((u=(h=(l=this.starfield)==null?void 0:l.externalGalaxy)==null?void 0:h.sagittariusAStar)==null?void 0:u.hitMesh)||y===((w=(f=(p=this.starfield)==null?void 0:p.externalGalaxy)==null?void 0:f.sagittariusAStar)==null?void 0:w.boundingMesh)||y.name.includes("sagittarius")){this.selectBody("Sagittarius A*",2200);return}for(const v of this.planetBundles.values())if(v.surfaceMesh===y){this.selectBody(v.definition.name);break}}});m(this,"onResize",()=>{if(!this.container)return;const e=this.container.clientWidth||window.innerWidth,i=this.container.clientHeight||window.innerHeight;this.renderer.setSize(e,i),this.cameraRig.handleResize(e,i)});m(this,"animate",()=>{var o,s,r;if(!this.isRunning)return;this.animationFrameId=requestAnimationFrame(this.animate);const e=performance.now(),i=Math.min(Math.max((e-this.lastFrameTime)*.001,.001),.1);this.lastFrameTime=e,this.clock.update(e);const a=this.clock.getJulianDateTDB()-be.J2000_JD;this.propagateAll(a);const t=this.planetBundles.get("Sun");if(t){const c=e*.001,n=t.surfaceMesh.material;if((o=n.uniforms)!=null&&o.time&&(n.uniforms.time.value=c),t.glowMeshes)for(const l of t.glowMeshes){const h=l.material;(s=h.uniforms)!=null&&s.time&&(h.uniforms.time.value=c)}if(t.prominencesGroup){for(const l of t.prominencesGroup.children)if(l instanceof j){const h=l.material;(r=h.uniforms)!=null&&r.time&&(h.uniforms.time.value=c)}}}this.cameraRig.update(),this.starfield.update(this.cameraRig.camera.position,i,this.cameraRig.getVelocity(),this.cameraRig.getZoomVelocity(),this.cameraRig.camera),this.renderer.render(this.scene,this.cameraRig.camera),this.onTelemetryUpdate&&e-this.lastTelemetryTime>=Be.TELEMETRY_INTERVAL_MS&&(this.lastTelemetryTime=e,this.dispatchTelemetry())});this.container=e,this.onTelemetryUpdate=i,this.selectedBody=W.getBody("Mercury")||W.getAllBodies()[0],this.scene=new ba,this.scene.background=new N(131333),this.renderer=new Ma({antialias:!0,powerPreference:"high-performance"});const a=e.clientWidth||window.innerWidth,t=e.clientHeight||window.innerHeight;this.renderer.setSize(a,t),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.outputColorSpace=Pe,this.renderer.toneMapping=Sa,this.renderer.toneMappingExposure=1.05,this.renderer.domElement.style.position="absolute",this.renderer.domElement.style.top="0",this.renderer.domElement.style.left="0",this.renderer.domElement.style.width="100%",this.renderer.domElement.style.height="100%",this.renderer.domElement.style.display="block",e.appendChild(this.renderer.domElement),this.cameraRig=new it(e),this.setupLighting(),this.starfield=new Ee,this.scene.add(this.starfield.group),this.asteroidBelt=new si(this.transform),this.scene.add(this.asteroidBelt.mesh),this.orbitLinesGroup.visible=!1,this.scene.add(this.orbitLinesGroup),this.setupBodies(),this.orbitLinesEpochDays=this.clock.getJulianDateTDB()-be.J2000_JD,this.rebuildOrbitLines(),this.propagateAll(this.clock.getJulianDateTDB()-be.J2000_JD),this.scene.updateMatrixWorld(!0),this.selectBody("Mercury",1800),this.setupInteraction(),this.animate()}setupLighting(){const e=new Aa(16775917,2.4,0,0);e.position.set(0,0,0),e.castShadow=!1,this.scene.add(e);const i=new Pa(2238008,.25);this.scene.add(i)}setupBodies(){const e=W.getAllBodies();for(const i of e){const a=Ua.createPlanet(i);this.scene.add(a.bodyGroup),this.planetBundles.set(i.name,a)}}rebuildOrbitLines(){for(;this.orbitLinesGroup.children.length>0;){const i=this.orbitLinesGroup.children[0];this.orbitLinesGroup.remove(i),i instanceof Me&&(i.geometry.dispose(),i.material.dispose())}this.moonOrbitLines.clear();const e=W.getAllBodies();for(const i of e)if(i.category!=="moon"&&i.orderFromSun>0){const a=At.createOrbitLine(i,this.transform,this.orbitLinesEpochDays);a&&this.orbitLinesGroup.add(a)}for(const i of e)if(i.category==="moon"&&i.parentId){const a=W.getParent(i);if(a){const t=At.createMoonOrbitLine(i,a,this.transform,this.orbitLinesEpochDays);t&&(this.orbitLinesGroup.add(t),this.moonOrbitLines.set(i.name,t))}}}setScaleMode(e){this.transform.mode!==e&&(this.transform.mode=e,this.cameraRig.distanceModel=e,this.planetBundles.forEach(i=>{const a=this.transform.getVisualRadius(i.definition);i.visualRadius=a;const o=1-(i.definition.physical.flattening||0);if(i.surfaceMesh.scale.set(a,a*o,a),i.nightMesh&&i.nightMesh.scale.set(a,a*o,a),i.cloudMesh&&i.cloudMesh.scale.set(a,a,a),i.atmosphereMesh&&i.atmosphereMesh.scale.set(a,a,a),i.ringMesh){i.ringMesh.scale.set(a,a,a);const s=i.ringMesh.material;s.uniforms&&s.uniforms.saturnRadius&&(s.uniforms.saturnRadius.value=a)}i.glowMeshes&&i.glowMeshes.forEach(s=>s.scale.set(a,a,a))}),this.rebuildOrbitLines())}toggleConstellations(){return this.starfield.toggleConstellations()}toggleAsteroidBelt(){const e=!this.asteroidBelt.isVisible();return this.asteroidBelt.setVisible(e),e}toggleOrbits(){return this.orbitLinesGroup.visible=!this.orbitLinesGroup.visible,this.orbitLinesGroup.visible}setupInteraction(){this.renderer.domElement.addEventListener("mousedown",this.onPointerDown),this.renderer.domElement.addEventListener("mousemove",this.onCanvasMouseMove),this.renderer.domElement.addEventListener("click",this.onCanvasClick),window.addEventListener("resize",this.onResize)}selectBody(e,i=1800){if(e==="Sagittarius A*"||e==="Sgr A*"||e==="sagittarius_a_star"){const t=W.getSagittariusAStar();if(t){this.selectedBody=t;const o=this.starfield.externalGalaxy.sagittariusAStar.group;this.cameraRig.focusCinematic(o,180,t.name,i);return}}const a=this.planetBundles.get(e);a&&(this.selectedBody=a.definition,this.cameraRig.focusCinematic(a.bodyGroup,a.visualRadius,a.definition.name,i),this.cameraRig.focusedPhysicalRadiusKm=a.definition.physical.meanRadiusKm)}resetView(){this.selectedBody=W.getBody("Sun")||W.getAllBodies()[0],this.cameraRig.resetToOverview(),this.cameraRig.focusedPhysicalRadiusKm=this.selectedBody.physical.meanRadiusKm}applyBodyFrame(e,i,a=0){this.tmpMatrix.makeBasis(this.tmpX.set(i.xAxis[0],i.xAxis[1],i.xAxis[2]),this.tmpY.set(i.yAxis[0],i.yAxis[1],i.yAxis[2]),this.tmpZ.set(i.zAxis[0],i.zAxis[1],i.zAxis[2])),e.bodyGroup.quaternion.setFromRotationMatrix(this.tmpMatrix),e.surfaceMesh.rotation.y=i.spinRad,e.nightMesh&&(e.nightMesh.rotation.y=i.spinRad),e.cloudMesh&&(e.cloudMesh.rotation.y=i.spinRad+a)}applyFallbackSpin(e,i){const a=e.definition;e.bodyGroup.rotation.set(0,0,K.degToRad(a.physical.axialTiltDeg||0));const t=a.physical.rotationPeriodHours||a.orbit.orbitalPeriodDays*24||24;e.surfaceMesh.rotation.y=i*24/t*Math.PI*2}propagateAll(e){const i=W.getAllBodies(),a=new Map,t=e;for(const o of i){if(o.category==="moon")continue;const s=this.planetBundles.get(o.name);if(!s)continue;if(o.orderFromSun===0)s.bodyGroup.position.set(0,0,0),a.set(o.id,[0,0,0]);else{const c=de.propagate(o.orbit,t);this.latestPhysicalStates.set(o.name,c);const n=this.transform.toRenderPosition(c.positionKm,o);if(s.bodyGroup.position.set(n[0],n[1],n[2]),a.set(o.id,n),o.name==="Saturn"&&s.ringMesh){const l=s.ringMesh.material;l.uniforms&&l.uniforms.saturnCenter&&(l.uniforms.saturnCenter.value.set(n[0],n[1],n[2]),l.uniforms.saturnRadius.value=s.visualRadius)}}const r=li(o.name,t);r?this.applyBodyFrame(s,r,o.name==="Earth"?t/40*Math.PI*2:0):this.applyFallbackSpin(s,t)}for(const o of i){if(o.category!=="moon"||!o.parentId)continue;const s=this.planetBundles.get(o.name);if(!s)continue;const r=W.getParent(o);if(!r)continue;const c=this.latestPhysicalStates.get(r.name),n=a.get(r.id)||[0,0,0],l=r.physical.gmKm3S2??(r.physical.massKg?r.physical.massKg*66743e-24:void 0),h=o.physical.gmKm3S2??(o.physical.massKg?o.physical.massKg*66743e-24:0),u=l!==void 0?l+h:de.GM_SUN,p=de.propagate(o.orbit,t,u),f=(c==null?void 0:c.positionKm)||[0,0,0],w=(c==null?void 0:c.velocityKmPerSec)||[0,0,0],y=[f[0]+p.positionKm[0],f[1]+p.positionKm[1],f[2]+p.positionKm[2]],v=[w[0]+p.velocityKmPerSec[0],w[1]+p.velocityKmPerSec[1],w[2]+p.velocityKmPerSec[2]];this.latestPhysicalStates.set(o.name,{positionKm:y,velocityKmPerSec:v,distanceKm:Math.hypot(...y),speedKmPerSec:Math.hypot(...v),trueAnomalyDeg:p.trueAnomalyDeg,eccentricAnomalyDeg:p.eccentricAnomalyDeg});const b=this.transform.toMoonRenderPosition(p.positionKm,o,n,r);s.bodyGroup.position.set(b[0],b[1],b[2]);const A=this.moonOrbitLines.get(o.name);A&&A.position.set(n[0],n[1],n[2]),o.name==="Hyperion"?this.applyFallbackSpin(s,t):this.applyBodyFrame(s,di(p.positionKm,p.velocityKmPerSec))}this.asteroidBelt.updatePositions(t),Math.abs(t-this.orbitLinesEpochDays)>365&&(this.orbitLinesEpochDays=t,this.rebuildOrbitLines())}jumpToScale(e){if(e==="sgr_a"){this.selectBody("Sagittarius A*");return}this.cameraRig.jumpToScale(e)}dispatchTelemetry(){const e=this.latestPhysicalStates.get(this.selectedBody.name);let i=(e==null?void 0:e.distanceKm)||this.selectedBody.orbit.semiMajorAxisKm,a=(e==null?void 0:e.speedKmPerSec)||0;(this.selectedBody.id==="sagittarius_a_star"||this.selectedBody.name==="Sagittarius A*")&&(i=2553e14,a=122400);const t=new M;this.cameraRig.camera.getWorldDirection(t);const o=Math.atan2(t.x,t.z)*K.RAD2DEG,s=Math.asin(t.y)*K.RAD2DEG,r=this.cameraRig.getObserverScaleMetric(),c=this.cameraRig.getTravelSpeed(),n={id:this.selectedBody.id,name:this.selectedBody.name,category:this.selectedBody.category,parentId:this.selectedBody.parentId,parentName:this.selectedBody.parentName,distanceKm:i,apparentSpeedKmS:a,radiusKm:this.selectedBody.physical.meanRadiusKm,orbitalPeriodDays:this.selectedBody.orbit.orbitalPeriodDays,axialTiltDeg:this.selectedBody.physical.axialTiltDeg||0,colorHex:this.selectedBody.physical.colorHex||"#ffffff"};this.onTelemetryUpdate({speedKmS:a,lookAzimuthDeg:Math.round(o),lookElevationDeg:Math.round(s),activeTarget:n,timeScale:this.clock.timeMultiplier,julianDate:this.clock.getJulianDate(),utcIso:this.clock.getIsoString(),scaleMode:this.transform.mode,isPaused:this.clock.isPaused,constellationsVisible:this.starfield.areConstellationsVisible(),asteroidBeltVisible:this.asteroidBelt.isVisible(),orbitsVisible:this.orbitLinesGroup.visible,observerScaleMetric:r.formatted,observerDomain:r.domain,travelSpeed:Math.round(c),cameraDistance:Math.round(r.distance)})}dispose(){this.isRunning=!1,this.animationFrameId!==null&&cancelAnimationFrame(this.animationFrameId),window.removeEventListener("resize",this.onResize),this.renderer.domElement.removeEventListener("mousedown",this.onPointerDown),this.renderer.domElement.removeEventListener("mousemove",this.onCanvasMouseMove),this.renderer.domElement.removeEventListener("click",this.onCanvasClick),this.cameraRig.dispose(),this.starfield.dispose(),this.asteroidBelt.dispose(),this.planetBundles.forEach(e=>{e.surfaceMesh.geometry.dispose(),e.surfaceMesh.material.dispose(),e.nightMesh&&(e.nightMesh.geometry.dispose(),e.nightMesh.material.dispose()),e.cloudMesh&&(e.cloudMesh.geometry.dispose(),e.cloudMesh.material.dispose()),e.atmosphereMesh&&(e.atmosphereMesh.geometry.dispose(),e.atmosphereMesh.material.dispose()),e.ringMesh&&(e.ringMesh.geometry.dispose(),e.ringMesh.material.dispose()),e.glowMeshes&&e.glowMeshes.forEach(i=>{i.geometry.dispose(),i.material.dispose()}),e.prominencesGroup&&e.prominencesGroup.children.forEach(i=>{i instanceof j&&(i.geometry.dispose(),i.material.dispose())})}),this.renderer.dispose(),this.renderer.domElement.parentElement&&this.renderer.domElement.parentElement.removeChild(this.renderer.domElement)}};m(Be,"TELEMETRY_INTERVAL_MS",100);let st=Be;const rt={Mercury:{name:"Mercury",category:"planet",eyebrow:"PLANET",accentColor:"#E8927C",eyebrowColor:"#fabfad",distanceAU:"0.39 AU",textureThumb:"textures/thumbs/mercury.webp",monographText:"THE CLOSEST PLANET TO THE SUN. IT CIRCLES THE SUN FASTER THAN ALL THE OTHER PLANETS, WHICH IS WHY ROMANS NAMED IT AFTER THEIR SWIFT-FOOTED MESSENGER GOD.",extendedLore:"Mercury is a world of fierce cosmic extremes. With virtually no atmosphere to trap heat, midday temperatures soar to 430°C (800°F), while the sunless night plummets to -180°C (-290°F). Its massive metallic core occupies roughly 85% of the planet's total radius, suggesting a colossal primordial impact stripped away much of its ancient silicate mantle.",missions:[{name:"Mariner 10",year:"1974–1975",agency:"NASA",role:"First flybys; mapped 45% of surface"},{name:"MESSENGER",year:"2011–2015",agency:"NASA",role:"First orbiter; discovered polar water ice in permanently shadowed craters"},{name:"BepiColombo",year:"2025–2026",agency:"ESA / JAXA",role:"Dual orbiter study of magnetosphere and exosphere"}]},Venus:{name:"Venus",category:"planet",eyebrow:"PLANET",accentColor:"#b45d15",eyebrowColor:"#e58e45",distanceAU:"0.723 AU",textureThumb:"textures/thumbs/venus_atmosphere.webp",monographText:"NAMED FOR THE ROMAN GODDESS OF LOVE AND BEAUTY. ENSHROUDED IN DENSE OPAQUE CLOUDS OF SULFURIC ACID, IT SUFFERS A RUNAWAY GREENHOUSE EFFECT WITH SURFACE TEMPERATURES REACHING 465°C.",extendedLore:"Venus is Earth's twin in diameter and mass, but an infernal counterpart in environment. A crushing supercritical carbon dioxide atmosphere exerts 92 times Earth's sea-level pressure. Venus rotates backwards compared to most planets, with the Sun rising in the west, and its day is longer than its orbital year.",missions:[{name:"Venera 7",year:"1970",agency:"Soviet Union",role:"First human spacecraft to softly land and transmit data from another planet"},{name:"Magellan",year:"1990–1994",agency:"NASA",role:"Global radar mapping revealing extensive volcanism and lava channels"},{name:"Akatsuki",year:"2015–Present",agency:"JAXA",role:"Atmospheric super-rotation and cloud dynamics investigation"}]},Earth:{name:"Earth",category:"planet",eyebrow:"PLANET",accentColor:"#26daaa",eyebrowColor:"#7bf0d0",distanceAU:"1.000 AU",textureThumb:"textures/thumbs/earth_daymap.webp",monographText:"OUR HOME AND THE ONLY KNOWN SANCTUARY OF LIFE IN THE COSMOS. A VIBRANT BLUE MARBLE ENVELOPED BY A NITROGEN-OXYGEN ATMOSPHERE, WITH LIQUID OCEANS COVERING SEVENTY PERCENT OF ITS SURFACE.",extendedLore:"Earth resides at the temperate sweet spot of the circumstellar habitable zone. Dynamic plate tectonics continuously recycle carbon, while a vigorous geodynamo generates a protective magnetosphere shielding the biosphere from solar wind stripping and high-energy galactic cosmic rays.",missions:[{name:"Apollo Program",year:"1961–1972",agency:"NASA",role:"Human lunar landings; transformed humanity's ecological perspective of Earth"},{name:"Terra & Aqua",year:"1999–Present",agency:"NASA",role:"Comprehensive global climate and ocean monitoring system"},{name:"Copernicus Sentinel",year:"2014–Present",agency:"ESA",role:"Constellation observing biosphere, ice sheets, and atmosphere"}]},Mars:{name:"Mars",category:"planet",eyebrow:"PLANET",accentColor:"#e55f45",eyebrowColor:"#fca595",distanceAU:"1.524 AU",textureThumb:"textures/thumbs/mars.webp",monographText:"THE RED PLANET, COLORED BY IRON OXIDE SPREAD ACROSS ITS WINDSWEPT DESERTS. HOME TO OLYMPUS MONS, THE TALLEST VOLCANO IN THE SOLAR SYSTEM, AND VAST DRY RIVER VALLEYS.",extendedLore:"Though frozen and desiccated today, geochemical fingerprints captured by rovers prove ancient Mars possessed lakes, river deltas, and a thicker insulating atmosphere over three billion years ago. Its thin CO2 atmosphere generates continent-scale dust storms that periodically veil the entire globe.",missions:[{name:"Viking 1 & 2",year:"1976",agency:"NASA",role:"First successful long-duration Mars surface landers and biological tests"},{name:"Curiosity",year:"2012–Present",agency:"NASA",role:"Discovered ancient habitable lacustrine environments in Gale Crater"},{name:"Perseverance",year:"2021–Present",agency:"NASA",role:"Searching for ancient microbial biosignatures and caching core samples"}]},Jupiter:{name:"Jupiter",category:"planet",eyebrow:"PLANET",accentColor:"#f59e0b",eyebrowColor:"#fcd34d",distanceAU:"5.203 AU",textureThumb:"textures/thumbs/jupiter.webp",monographText:"THE TITAN OF OUR SOLAR SYSTEM, MORE THAN TWICE AS MASSIVE AS ALL THE OTHER PLANETS COMBINED. A SWIRLING GAS GIANT DOMINATED BY THE CENTURIES-OLD GREAT RED SPOT AND NEARLY A HUNDRED KNOWN MOONS.",extendedLore:"Jupiter acted as the primary gravitational architect of the early Solar System, shaping asteroid orbits and scattering comets. Below its dynamic ammonia cloud belts, hydrogen transitions into liquid and eventually into an exotic state of liquid metallic hydrogen that conducts immense electrical currents, powering the most powerful planetary magnetic field in the system.",missions:[{name:"Voyager 1 & 2",year:"1979",agency:"NASA",role:"Discovered Jovian rings and active volcanism on Io"},{name:"Galileo",year:"1995–2003",agency:"NASA",role:"First orbiter; gathered initial evidence of subsurface ocean on Europa"},{name:"Juno",year:"2016–Present",agency:"NASA",role:"Mapping gravitational anomalies and deep atmospheric water abundance"}]},Saturn:{name:"Saturn",category:"planet",eyebrow:"PLANET",accentColor:"#b29d81",eyebrowColor:"#d4c5b0",distanceAU:"9.539 AU",textureThumb:"textures/thumbs/saturn.webp",monographText:"A MAJESTIC WORLD ADORNED BY AN EXTRAORDINARY SYSTEM OF ICY RINGS EXTENDING HUNDREDS OF THOUSANDS OF KILOMETERS INTO THE VOID, ACCOMPANIED BY THE HAZE-CLOAKED MOON TITAN.",extendedLore:"Saturn's main rings span about 282,000 km in diameter yet are astonishingly paper-thin—averaging barely 10 to 30 meters in vertical thickness. Made almost entirely of water-ice particles ranging from dust grains to house-sized boulders, the rings are sustained and sculpted by subtle gravitational resonances with shepherd moons.",missions:[{name:"Pioneer 11",year:"1979",agency:"NASA",role:"First close encounter with Saturn and discovery of the F Ring"},{name:"Cassini-Huygens",year:"2004–2017",agency:"NASA / ESA / ASI",role:"Thirteen-year orbital odyssey; landed probe on Titan, found Enceladus plumes"},{name:"Dragonfly",year:"Launching 2028",agency:"NASA",role:"Rotorcraft lander to explore prebiotic chemistry on Titan"}]},Uranus:{name:"Uranus",category:"planet",eyebrow:"PLANET",accentColor:"#8dcdd8",eyebrowColor:"#b3e8f0",distanceAU:"19.18 AU",textureThumb:"textures/thumbs/uranus.webp",monographText:"AN ICE GIANT TILTED SO DRAMATICALLY ON ITS SIDE THAT AT ITS SOLSTICES ONE POLE POINTS ALMOST DIRECTLY AT THE SUN, DRIVING EXTREME DECADES-LONG SEASONS.",extendedLore:"With an axial tilt of 97.77°, Uranus literally rolls along its orbital path like a ball. Scientists theorize a sequence of Earth-sized protoplanetary impacts knocked the giant onto its side early in solar history. Its pale aquamarine coloration originates from methane gas in its upper atmosphere absorbing red light wavelengths.",missions:[{name:"Voyager 2",year:"1986",agency:"NASA",role:"Only spacecraft to encounter Uranus; discovered 10 moons and 2 new rings"},{name:"Uranus Orbiter & Probe",year:"Proposed 2030s",agency:"NASA Decadal",role:"Flagship mission concept prioritized to explore ice giant interiors"}]},Neptune:{name:"Neptune",category:"planet",eyebrow:"PLANET",accentColor:"#4f83e2",eyebrowColor:"#7ca8ff",distanceAU:"30.06 AU",textureThumb:"textures/thumbs/neptune.webp",monographText:"THE MOST DISTANT MAJOR PLANET, SHROUDED IN AN INTENSE DEEP-AZURE METHANE ATMOSPHERE WHERE SUPERSONIC WINDS SURPASS TWO THOUSAND KILOMETERS PER HOUR.",extendedLore:"Neptune was the first planet located through mathematical prediction rather than empirical observation: slight perturbations in Uranus's orbit allowed French astronomer Urbain Le Verrier to calculate its precise position in 1846. It harbors the retrograde moon Triton, a captured Kuiper Belt dwarf world exhibiting nitrogen cryovolcanoes.",missions:[{name:"Voyager 2",year:"1989",agency:"NASA",role:"Close flyby; detected the Great Dark Spot and geysers on Triton"}]},Pluto:{name:"Pluto",category:"dwarf_planet",eyebrow:"DWARF PLANET",accentColor:"#FF8732",eyebrowColor:"#ffa463",distanceAU:"39.48 AU",textureThumb:"textures/thumbs/moon.webp",monographText:"SENTINEL OF THE KUIPER BELT, BEARING THE GLOWING NITROGEN ICE PLAINS OF TOMBAUGH REGIO AND SHARING A SYNCHRONOUS GRAVITATIONAL DANCE WITH ITS COMPANION CHARON.",extendedLore:"Reclassified as a dwarf planet in 2006, Pluto revealed itself during the 2015 New Horizons flyby as a geologically active wonderland. It features convection cells of churned nitrogen-carbon-monoxide ice, water-ice mountains towering 3,500 meters into its thin blue hazy atmosphere, and a likely deep subsurface liquid ocean.",missions:[{name:"New Horizons",year:"2015",agency:"NASA",role:"Historic historic flyby capturing high-resolution imagery of Tombaugh Regio"}]},Moon:{name:"Moon",category:"moon",eyebrow:"NATURAL SATELLITE · EARTH I",accentColor:"#d1d5db",eyebrowColor:"#e5e7eb",distanceAU:"1.000 AU",textureThumb:"textures/thumbs/moon.webp",monographText:"EARTH'S CONSTANT CELESTIAL COMPANION, TIDALLY LOCKED IN AN ANCIENT GRAVITATIONAL EMBRACE. ITS HIGHLANDS AND BASALTIC MARIA PRESERVE FOUR BILLION YEARS OF COSMIC HISTORY.",extendedLore:"Formed ~4.5 billion years ago from the debris of a giant collision between the proto-Earth and a Mars-sized protoplanet named Theia. The Moon stabilizes Earth's rotational tilt, modulating climate extremes and generating oceanic tides.",missions:[{name:"Apollo 11",year:"1969",agency:"NASA",role:"First human landing on another celestial world"},{name:"LRO",year:"2009–Present",agency:"NASA",role:"High-resolution sub-meter 3D laser altimetry and mapping"},{name:"Artemis I",year:"2022",agency:"NASA",role:"Uncrewed lunar orbital qualification flight for deep space exploration"}]},Europa:{name:"Europa",category:"moon",eyebrow:"OCEAN MOON · JUPITER II",accentColor:"#7dd3fc",eyebrowColor:"#bae6fd",distanceAU:"5.203 AU",textureThumb:"textures/thumbs/moon.webp",monographText:"A SMOOTH CRUST OF WATER ICE FRACTURED BY REDDISH LINEAE, CONCEALING A VAST GLOBAL SALTWATER OCEAN CONTAINING TWICE THE WATER OF ALL EARTH'S OCEANS COMBINED.",extendedLore:"Tidally flexed by orbital resonance with Io and Ganymede, Europa's rocky mantle produces geothermal heating that keeps its deep subsurface ocean in a liquid state. Possible water plumes detected by Hubble make it one of humankind's top destinations in the search for extraterrestrial habitability.",missions:[{name:"Galileo",year:"1995–2003",agency:"NASA",role:"Discovered induced magnetic field evidence for a subsurface saline ocean"},{name:"Europa Clipper",year:"2024–Present",agency:"NASA",role:"Dedicated mission equipped with ice-penetrating radar to confirm habitability"}]},Io:{name:"Io",category:"moon",eyebrow:"VOLCANIC MOON · JUPITER I",accentColor:"#facc15",eyebrowColor:"#fef08a",distanceAU:"5.203 AU",textureThumb:"textures/thumbs/moon.webp",monographText:"THE MOST VOLCANICALLY ACTIVE BODY IN THE SOLAR SYSTEM, SCARRED BY HUNDREDS OF ACTIVE VOLCANOES DRIVEN BY INTENSE GRAVITATIONAL TIDAL FRICTION.",extendedLore:"Caught in an eccentric resonance between Jupiter and its sibling moons, Io undergoes constant tidal flexing that generates ferocious internal heat, driving molten silicate lava lakes and sulfur plumes hundreds of kilometers into space.",missions:[{name:"Voyager 1",year:"1979",agency:"NASA",role:"First observation of active extraterrestrial volcanism"},{name:"Juno",year:"2016–Present",agency:"NASA",role:"Close flybys mapping polar volcanic hotspots and magma oceans"}]},Ganymede:{name:"Ganymede",category:"moon",eyebrow:"GIANT MOON · JUPITER III",accentColor:"#cbd5e1",eyebrowColor:"#e2e8f0",distanceAU:"5.203 AU",textureThumb:"textures/thumbs/moon.webp",monographText:"THE LARGEST MOON IN THE SOLAR SYSTEM, EVEN EXCEEDING MERCURY IN DIAMETER, AND THE ONLY SATELLITE BEARING AN INTERNALLY GENERATED MAGNETIC FIELD.",extendedLore:"Possesses a molten iron-rich core that generates an intrinsic magnetosphere. Beneath its grooved and fractured tectonic ice shell lies a deep subterranean liquid ocean separated by high-pressure ice phases.",missions:[{name:"Galileo",year:"1995–2003",agency:"NASA",role:"Identified intrinsic dipolar magnetic field"},{name:"JUICE",year:"2023–Present",agency:"ESA",role:"En route to enter permanent orbit around Ganymede in 2034"}]},Titan:{name:"Titan",category:"moon",eyebrow:"HYDROCARBON WORLD · SATURN VI",accentColor:"#f59e0b",eyebrowColor:"#fde68a",distanceAU:"9.539 AU",textureThumb:"textures/thumbs/moon.webp",monographText:"THE ONLY MOON WITH A DENSE ATMOSPHERE AND STABLE SURFACE SEAS, WHERE METHANE AND ETHANE FORM A COMPLETE METEOROLOGICAL HYDROLOGIC CYCLE.",extendedLore:"Exceeding Mercury in size, Titan possesses an orange smoggy atmosphere whose surface pressure is about 1.5 times Earth's at sea level. Cryogenic rivers carve canyon networks feeding liquid hydrocarbon seas like Kraken Mare.",missions:[{name:"Cassini-Huygens",year:"2004–2017",agency:"NASA / ESA",role:"Huygens landed directly on Titan's surface in 2005"},{name:"Dragonfly",year:"Planned 2028",agency:"NASA",role:"Rotorcraft lander to explore prebiotic organic chemistry"}]},Enceladus:{name:"Enceladus",category:"moon",eyebrow:"CRYOVOLCANIC MOON · SATURN II",accentColor:"#e0f2fe",eyebrowColor:"#f0f9ff",distanceAU:"9.539 AU",textureThumb:"textures/thumbs/moon.webp",monographText:"AN IMMACULATE WORLD OF PURE REFLECTIVE ICE, ERUPTING GIANT HYDROTHERMAL GEYSERS FROM TIGER STRIPES OVER ITS SOUTH POLAR TERRAIN.",extendedLore:"Enceladus possesses a global liquid saltwater ocean in direct physical contact with an active hydrothermal rocky seafloor. Cassini detected complex organic molecules and molecular hydrogen in its plumes, pointing to ongoing hydrothermal chemistry on the seafloor.",missions:[{name:"Cassini",year:"2005–2017",agency:"NASA / ESA",role:"Flew directly through erupting plumes, sampling water vapor, salts, and organics"}]},Ceres:{name:"Ceres",category:"dwarf_planet",eyebrow:"DWARF PLANET · ASTEROID BELT",accentColor:"#a1a1aa",eyebrowColor:"#d4d4d8",distanceAU:"2.767 AU",textureThumb:"textures/thumbs/moon.webp",monographText:"EMPRESS OF THE ASTEROID BELT, HOLDING A THIRD OF ITS ENTIRE MASS. AN ICE-RICH RELICT WORLD FEATURING RADIANT SODIUM CARBONATE SALT DOMES.",extendedLore:"Ceres is a differentiated protoplanet containing significant quantities of water ice and hydrous minerals. Occator Crater hosts the bright Cerealia Facula, formed by subsurface brine percolation and cryovolcanic extrusion.",missions:[{name:"Dawn",year:"2015–2018",agency:"NASA",role:"Orbited Ceres for three years, discovering active cryovolcanism and hydrated minerals"}]},Sun:{name:"Sun",category:"star",eyebrow:"STAR",accentColor:"#ffaa33",eyebrowColor:"#ffe4a0",distanceAU:"0.000 AU",textureThumb:"textures/thumbs/sun.webp",monographText:"THE GLOWING HEART OF OUR SYSTEM, CONTAINING OVER NINETY-NINE POINT EIGHT PERCENT OF ALL MASS. A THERMONUCLEAR ENGINE POWERING ALL LIGHT, LIFE, AND GRAVITATIONAL HARMONY.",extendedLore:"Every second in the solar core, 600 million tons of hydrogen undergo thermonuclear fusion into helium, converting 4 million tons of matter into pure radiant energy. The photon diffusion through the dense radiative zone takes over 100,000 years to reach the convective layer and escape as solar light.",missions:[{name:"SOHO",year:"1995–Present",agency:"ESA / NASA",role:"Continuous monitoring of helioseismology and coronal mass ejections"},{name:"Parker Solar Probe",year:"2018–Present",agency:"NASA",role:"Closest spacecraft to Sun, diving directly through the outer corona"},{name:"Solar Orbiter",year:"2020–Present",agency:"ESA / NASA",role:"Capturing the first close-up images of the Sun's polar regions"}]},"Sagittarius A*":{name:"Sagittarius A*",category:"black_hole",eyebrow:"SUPERMASSIVE BLACK HOLE",accentColor:"#f59e0b",eyebrowColor:"#fde68a",distanceAU:"1.71 × 10⁹ AU (26,990 LY)",textureThumb:"textures/thumbs/milky_way.webp",monographText:"THE 4.3 MILLION SOLAR MASS SUPERMASSIVE BLACK HOLE AT THE DYNAMICAL HEART OF THE MILKY WAY. ITS EVENT HORIZON TRAPS ALL LIGHT, BENDING SPACETIME INTO A RELATIVISTIC PHOTON RING.",extendedLore:"Sagittarius A* (Sgr A*) anchors the Milky Way Galaxy with a mass of 4.297 ± 0.012 × 10⁶ M☉ located 8.277 ± 0.033 kpc (~26,990 light-years) from Earth. In May 2022, the Event Horizon Telescope (EHT) collaboration released the first direct horizon-scale image of its shadow, resolving an angular diameter of 51.8 ± 2.3 microarcseconds that confirms Einstein's General Relativity. Matter orbiting near the innermost stable circular orbit (ISCO at 3.0 r_s) reaches speeds of 0.408 c (122,400 km/s), generating extreme relativistic Doppler beaming and gravitational redshift, framed by high-velocity stars of the central nuclear S-cluster.",missions:[{name:"Event Horizon Telescope (EHT)",year:"2022",agency:"Global Consortium / NSF / ESO",role:"First direct millimeter-wave imaging of Sgr A* event horizon shadow"},{name:"GRAVITY / ESO VLTI",year:"2018–Present",agency:"ESO",role:"Detection of gravitational redshift in star S2 orbit and orbital flares near ISCO"},{name:"Chandra X-ray Observatory",year:"1999–Present",agency:"NASA",role:"Long-term monitoring of hot gas accretion and high-energy flare eruptions"},{name:"Neil Gehrels Swift Observatory",year:"2004–Present",agency:"NASA",role:"Daily multiwavelength monitoring of Galactic Center flaring activity"}]}};function hi(g){return rt[g]?rt[g]:{name:g,category:"moon",eyebrow:"CELESTIAL BODY",accentColor:"#93c5fd",eyebrowColor:"#bfdbfe",distanceAU:"—",textureThumb:"textures/thumbs/moon.webp",monographText:`${g.toUpperCase()} IS A DOCUMENTED COMPONENT OF THE SOLAR SYSTEM CATALOGUE.`,extendedLore:`${g}'s orbit is computed from NASA JPL orbital elements (Horizons / Small-Body Database).`,missions:[]}}/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mi=g=>g.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),Jt=(...g)=>g.filter((e,i,a)=>!!e&&e.trim()!==""&&a.indexOf(e)===i).join(" ").trim();/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var ui={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pi=R.forwardRef(({color:g="currentColor",size:e=24,strokeWidth:i=2,absoluteStrokeWidth:a,className:t="",children:o,iconNode:s,...r},c)=>R.createElement("svg",{ref:c,...ui,width:e,height:e,stroke:g,strokeWidth:a?Number(i)*24/Number(e):i,className:Jt("lucide",t),...r},[...s.map(([n,l])=>R.createElement(n,l)),...Array.isArray(o)?o:[o]]));/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const me=(g,e)=>{const i=R.forwardRef(({className:a,...t},o)=>R.createElement(pi,{ref:o,iconNode:e,className:Jt(`lucide-${mi(g)}`,a),...t}));return i.displayName=`${g}`,i};/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gi=me("Calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fi=me("EyeOff",[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yi=me("Eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xi=me("Pause",[["rect",{x:"14",y:"4",width:"4",height:"16",rx:"1",key:"zuxfzm"}],["rect",{x:"6",y:"4",width:"4",height:"16",rx:"1",key:"1okwgv"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vi=me("Play",[["polygon",{points:"6 3 20 12 6 21 6 3",key:"1oa8hb"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wi=me("RotateCcw",[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dt=me("Search",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ze=me("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]),bi=["Sagittarius A*","Pluto","Neptune","Uranus","Saturn","Jupiter","Mars","Earth","Venus","Mercury"],Mi=({telemetry:g,onSelectPlanet:e,onResetView:i,onTogglePlay:a,onSetTimeMultiplier:t,onSetScaleMode:o,onSeekDate:s,onResetToJ2000:r,onResetToNow:c,onToggleConstellations:n,onToggleAsteroidBelt:l,onToggleOrbits:h,onJumpToScale:u})=>{const p=g==null?void 0:g.activeTarget,f=(g==null?void 0:g.isPaused)??!1,w=(g==null?void 0:g.timeScale)??1,y=(g==null?void 0:g.scaleMode)??"exploration",v=(g==null?void 0:g.julianDate)??2451545,b=(g==null?void 0:g.utcIso)??new Date().toISOString(),A=(g==null?void 0:g.constellationsVisible)??!0,S=(g==null?void 0:g.asteroidBeltVisible)??!0,D=(g==null?void 0:g.orbitsVisible)??!0,P=(g==null?void 0:g.observerScaleMetric)??"1.00 AU",C=(g==null?void 0:g.observerDomain)??"inner_system",I=(g==null?void 0:g.travelSpeed)??0,[G,V]=R.useState(!0),[$,ee]=R.useState(!1),[se,ye]=R.useState(!1),[re,Yt]=R.useState("all"),[Oe,qt]=R.useState(""),[ke,ht]=R.useState(b.slice(0,10)),[ue,Le]=R.useState(!1),[mt,je]=R.useState(!1),[ut,We]=R.useState(0),[pt,Je]=R.useState(!0),[Xt,Ue]=R.useState(!1),[gt,ft]=R.useState(!1);R.useEffect(()=>{if(typeof window<"u"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches){We(2);return}const x=setTimeout(()=>We(1),500),T=setTimeout(()=>We(2),1200);return()=>{clearTimeout(x),clearTimeout(T)}},[]),R.useEffect(()=>{const x=T=>{T.target instanceof HTMLInputElement||T.target instanceof HTMLTextAreaElement||(T.key===" "||T.code==="Space"?(T.preventDefault(),a()):T.key==="h"||T.key==="H"?(T.preventDefault(),V(ae=>!ae)):T.key==="Escape"?$?ee(!1):se||ue?(ye(!1),Le(!1)):i():T.key==="o"||T.key==="O"?h==null||h():T.key==="c"||T.key==="C"?n==null||n():(T.key==="b"||T.key==="B")&&(l==null||l()))};return window.addEventListener("keydown",x),()=>window.removeEventListener("keydown",x)},[a,h,n,l,i,$,se,ue]),R.useEffect(()=>{!mt&&!ue&&ht(b.slice(0,10))},[b,mt,ue]);const _=(p==null?void 0:p.name)||"Mercury",Q=R.useMemo(()=>hi(_),[_]),Ae=R.useMemo(()=>{const x=[...W.getAllBodies()],T=W.getSagittariusAStar();return T&&x.unshift(T),x},[]),H=R.useMemo(()=>_==="Sagittarius A*"||_==="Sgr A*"||_==="sagittarius_a_star"?W.getSagittariusAStar():W.getBody(_),[_]),[$t,yt]=R.useState(1),xt=R.useRef(null);R.useEffect(()=>{_!==xt.current&&(xt.current=_,yt(x=>x+1))},[_]),R.useEffect(()=>{if(Je(!0),Ue(!1),gt)return;const x=setTimeout(()=>{Ue(!0)},5500),T=setTimeout(()=>{Je(!1),Ue(!1)},7100);return()=>{clearTimeout(x),clearTimeout(T)}},[$t,gt]);const Fe=R.useCallback(()=>{Je(!0),Ue(!1),yt(x=>x+1)},[]),Qt=R.useMemo(()=>Ae.filter(x=>{if(re==="planet"&&x.category!=="planet"||re==="moon"&&x.category!=="moon"||re==="minor"&&x.category!=="asteroid"&&x.category!=="dwarf_planet")return!1;if(Oe.trim()){const T=Oe.toLowerCase();return x.name.toLowerCase().includes(T)||x.category.toLowerCase().includes(T)||x.parentName&&x.parentName.toLowerCase().includes(T)}return!0}),[Ae,re,Oe]),Zt=x=>{x.preventDefault(),je(!1);const T=Date.parse(ke);isNaN(T)||(s(T),Le(!1))},ea=[{label:"1×",val:1},{label:"10×",val:10},{label:"100×",val:100},{label:"1 D/S",val:86400},{label:"1 M/S",val:2592e3},{label:"1 Y/S",val:31536e3}],ta="/solaris/";return G?d.jsxs("div",{className:"absolute inset-0 pointer-events-none select-none flex flex-col justify-between p-3 md:p-6 z-20 font-sans text-white/90 overflow-hidden",children:[d.jsx("div",{className:"absolute -top-16 left-1/2 -translate-x-1/2 w-[540px] h-32 rounded-[100%] bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-transparent blur-3xl pointer-events-none"}),d.jsxs("header",{className:"flex flex-col md:flex-row md:justify-between items-start gap-2 pointer-events-auto w-full z-30",children:[d.jsxs("div",{className:`flex flex-col gap-1.5 transition-all duration-1000 ${ut>=0?"opacity-100 translate-y-0":"opacity-0 -translate-y-4"}`,children:[d.jsxs("div",{className:"flex items-baseline gap-3 relative group cursor-pointer",onClick:i,onKeyDown:x=>{(x.key==="Enter"||x.key===" ")&&(x.preventDefault(),i())},role:"button",tabIndex:0,"aria-label":"SOLARIS — reset to system overview",title:"Reset to Solaris Overview",children:[d.jsx("div",{className:"absolute -inset-2 bg-gradient-to-r from-amber-500/10 via-white/5 to-transparent rounded-lg blur-md opacity-40 group-hover:opacity-90 transition-opacity animate-corona-aura pointer-events-none"}),d.jsx("h1",{className:"relative text-xl md:text-2xl uppercase tracking-[0.52em] font-extralight drop-shadow-md select-none animate-solaris-shimmer",children:"SOLARIS"}),d.jsx("span",{className:"text-[9px] uppercase tracking-[0.32em] text-white/35 font-light hidden 2xl:inline",children:"Solar System Explorer"})]}),d.jsxs("div",{className:"flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-light text-white/60 bg-black/40 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/10 shadow-lg w-fit max-w-full mt-0.5 flex-wrap md:flex-nowrap md:whitespace-nowrap",children:[d.jsx("span",{className:`w-1.5 h-1.5 rounded-full ${f?"bg-amber-400":"bg-emerald-400 animate-pulse"}`}),d.jsxs("span",{className:"text-white/85",children:[b.replace("T"," ").slice(0,19)," UTC"]}),d.jsx("span",{className:"text-white/20",children:"·"}),d.jsxs("span",{children:["JD ",v.toFixed(2)]}),d.jsx("span",{className:"text-white/20",children:"·"}),d.jsx("span",{className:"text-amber-300/90 font-mono tracking-wider",children:P})]})]}),d.jsxs("div",{className:"hidden xl:flex items-center gap-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-1 shadow-lg pointer-events-auto",children:[d.jsxs("div",{className:"flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] tracking-[0.2em] font-light",children:[d.jsx("span",{className:`w-1.5 h-1.5 rounded-full ${I>4?"bg-cyan-400 animate-ping":"bg-amber-400"}`}),d.jsx("span",{className:"text-white/40 uppercase",children:"SCALE:"}),d.jsx("span",{className:"text-white font-medium tracking-[0.12em]",children:P})]}),d.jsxs("div",{className:"flex items-center gap-0.5 text-[9px] uppercase tracking-[0.2em] font-light",children:[d.jsx("button",{onClick:()=>u==null?void 0:u("planetary"),className:`px-2.5 py-1 rounded-full transition-all duration-200 ${C==="planetary"?"bg-white/20 text-white font-medium shadow-sm border border-white/25":"text-white/40 hover:text-white/80"}`,children:"Planet"}),d.jsx("button",{onClick:()=>u==null?void 0:u("inner_system"),className:`px-2.5 py-1 rounded-full transition-all duration-200 ${C==="inner_system"?"bg-white/20 text-white font-medium shadow-sm border border-white/25":"text-white/40 hover:text-white/80"}`,children:"Inner Sys"}),d.jsx("button",{onClick:()=>u==null?void 0:u("outer_system"),className:`px-2.5 py-1 rounded-full transition-all duration-200 ${C==="outer_system"?"bg-white/20 text-white font-medium shadow-sm border border-white/25":"text-white/40 hover:text-white/80"}`,children:"Outer Sys"}),d.jsx("button",{onClick:()=>u==null?void 0:u("interstellar"),className:`px-2.5 py-1 rounded-full transition-all duration-200 ${C==="interstellar"?"bg-cyan-400/25 text-cyan-200 font-medium shadow-sm border border-cyan-400/35":"text-white/40 hover:text-white/80"}`,children:"Interstellar"}),d.jsx("button",{onClick:()=>u==null?void 0:u("galactic"),className:`px-2.5 py-1 rounded-full transition-all duration-200 ${C==="galactic"&&_!=="Sagittarius A*"?"bg-purple-400/25 text-purple-200 font-medium shadow-sm border border-purple-400/35":"text-white/40 hover:text-white/80"}`,children:"Milky Way"}),d.jsx("button",{onClick:()=>{u==null||u("sgr_a"),e("Sagittarius A*"),Fe()},className:`px-2.5 py-1 rounded-full transition-all duration-200 ${_==="Sagittarius A*"?"bg-amber-500/30 text-amber-200 font-medium shadow-sm border border-amber-500/40":"text-white/40 hover:text-white/80"}`,children:"Sgr A*"})]})]}),d.jsxs("div",{className:"flex flex-wrap items-center justify-start md:justify-end gap-2 min-w-0",children:[d.jsxs("div",{className:"flex items-center bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-0.5 text-[10px] uppercase tracking-[0.2em] font-light shadow-lg",children:[d.jsx("button",{onClick:x=>{x.stopPropagation(),h==null||h()},title:"Toggle Orbit Lines (O)","aria-pressed":D,className:`px-3 py-1 rounded-full transition-all duration-200 ${D?"bg-white/15 text-white shadow-sm border border-white/20":"text-white/40 hover:text-white/80"}`,children:"Orbits"}),d.jsx("button",{onClick:x=>{x.stopPropagation(),n==null||n()},title:"Toggle constellation figures (C)","aria-pressed":A,className:`px-3 py-1 rounded-full transition-all duration-200 ${A?"bg-white/15 text-white shadow-sm border border-white/20":"text-white/40 hover:text-white/80"}`,children:"Constellations"}),d.jsx("button",{onClick:x=>{x.stopPropagation(),l==null||l()},title:"Toggle Asteroid Belt (B)","aria-pressed":S,className:`px-3 py-1 rounded-full transition-all duration-200 ${S?"bg-white/15 text-white shadow-sm border border-white/20":"text-white/40 hover:text-white/80"}`,children:"Belt"})]}),d.jsxs("div",{className:"flex items-center bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-0.5 text-[10px] uppercase tracking-[0.2em] font-light shadow-lg",children:[d.jsx("button",{onClick:x=>{x.stopPropagation(),o("exploration")},"aria-pressed":y==="exploration",title:"Compressed distances and enlarged bodies for exploring",className:`px-3 py-1 rounded-full transition-all duration-200 ${y==="exploration"?"bg-white/15 text-white shadow-sm border border-white/20":"text-white/40 hover:text-white/80"}`,children:"Exploration"}),d.jsx("button",{onClick:x=>{x.stopPropagation(),o("scientific")},"aria-pressed":y==="scientific",title:"Orbital distances to true scale (1 unit = 1,000,000 km); globes are enlarged 4× (minimum 15,000 km) so they stay visible",className:`px-3 py-1 rounded-full transition-all duration-200 ${y==="scientific"?"bg-white/15 text-white shadow-sm border border-white/20":"text-white/40 hover:text-white/80"}`,children:"True Distances"})]}),d.jsxs("button",{onClick:x=>{x.stopPropagation(),ye(!0)},className:"flex items-center gap-1.5 px-3.5 py-1.5 bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/10 hover:border-white/20 rounded-full text-[10px] uppercase tracking-[0.2em] font-light text-white/80 transition shadow-lg",children:[d.jsx(Dt,{size:11,className:"text-white/50"}),d.jsxs("span",{children:["Catalogue (",Ae.length,")"]})]}),d.jsxs("button",{onClick:x=>{x.stopPropagation(),i()},title:"Reset to System Overview",className:"flex items-center gap-1.5 px-3.5 py-1.5 bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/10 hover:border-white/20 rounded-full text-[10px] uppercase tracking-[0.2em] font-light text-white/80 transition shadow-lg",children:[d.jsx(wi,{size:11,className:"text-white/50"}),d.jsx("span",{children:"Overview"})]}),d.jsx("button",{onClick:x=>{x.stopPropagation(),V(!1)},title:"Hide Interface (H)","aria-label":"Hide interface",className:"p-2 bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/10 rounded-full text-white/40 hover:text-white transition shadow-lg",children:d.jsx(fi,{size:12})})]})]}),d.jsx("nav",{className:`absolute left-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-3 [@media(max-height:720px)]:gap-1 [@media(max-height:720px)]:top-[calc(50%+28px)] [@media(max-height:560px)]:hidden pointer-events-auto transition-all duration-1000 z-30 ${ut>=1?"opacity-100 translate-x-0":"opacity-0 -translate-x-8"}`,children:bi.map(x=>{const T=rt[x],ae=_===x,aa=`${ta}${(T==null?void 0:T.textureThumb)||"textures/2k_moon.jpg"}`;return d.jsxs("button",{"aria-current":ae?"true":void 0,"aria-label":`Fly to ${x}`,onClick:ia=>{ia.stopPropagation(),x==="Sagittarius A*"&&(u==null||u("sgr_a")),e(x),Fe()},className:"flex items-center gap-3.5 group text-left cursor-pointer transition-all duration-200 outline-none focus-visible:ring-1 focus-visible:ring-white/60 rounded",children:[d.jsx("div",{className:`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${ae?"border-white":"border-white/35 group-hover:border-white/60"}`,children:ae&&d.jsx("div",{className:"w-1.5 h-1.5 rounded-full bg-white transition-transform scale-100"})}),ae?d.jsx("div",{className:"h-2.5 rounded-sm transition-all duration-300",style:{backgroundColor:(T==null?void 0:T.accentColor)||"#ffffff",width:"28px",boxShadow:`0 0 10px ${(T==null?void 0:T.accentColor)||"#ffffff"}88`}}):d.jsx("div",{className:"w-6 h-6 rounded-full bg-cover bg-center transition-opacity duration-200 opacity-60 group-hover:opacity-90 flex-shrink-0",style:{backgroundImage:`url(${aa})`,boxShadow:"inset -2px -4px 5px 1px rgba(0,0,0,0.9), inset 1px 1px 2px rgba(255,255,255,0.2)"}}),d.jsxs("div",{className:"flex flex-col",children:[d.jsx("span",{className:`text-[11px] uppercase tracking-[0.22em] transition-colors duration-200 ${ae?"text-white font-medium":"text-white/40 group-hover:text-white/80"}`,children:x}),d.jsx("span",{className:`text-[9px] tracking-wider transition-colors duration-200 font-light ${ae?"text-white/50":"text-white/20 group-hover:text-white/40"}`,children:(T==null?void 0:T.distanceAU)||""})]})]},x)})}),pt&&d.jsx("section",{onMouseEnter:()=>ft(!0),onMouseLeave:()=>ft(!1),className:"absolute left-1/2 bottom-20 md:bottom-24 -translate-x-1/2 pointer-events-auto select-none z-20",children:d.jsxs("div",{className:`flex flex-col items-center text-center max-w-2xl px-6 ${Xt?"monograph-vanishing":"monograph-visible"}`,children:[d.jsx("span",{className:"text-[11px] md:text-xs uppercase tracking-[0.52em] font-light transition-colors duration-500 mb-1",style:{color:Q.eyebrowColor},children:Q.eyebrow}),d.jsx("h2",{className:"text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight tracking-[0.2em] sm:tracking-[0.36em] text-white uppercase drop-shadow-2xl my-1.5 transition-all duration-500",children:_}),d.jsx("p",{className:"text-[10px] md:text-[11px] lg:text-[12px] font-light tracking-[0.20em] leading-relaxed text-white/75 uppercase max-w-xl mx-auto my-3 text-center transition-all duration-500",children:Q.monographText}),d.jsxs("button",{onClick:x=>{x.stopPropagation(),ee(!0)},className:"group mt-2.5 flex flex-col items-center cursor-pointer transition-all duration-300 outline-none focus-visible:ring-1 focus-visible:ring-white/60 rounded",children:[d.jsx("span",{className:"text-xs uppercase tracking-[0.32em] font-light transition-colors duration-300",style:{color:Q.accentColor},children:"READ MORE"}),d.jsx("div",{className:"h-[1px] w-full mt-1 transition-all duration-300 group-hover:w-[115%]",style:{backgroundColor:Q.accentColor,boxShadow:`0 0 6px ${Q.accentColor}66`}})]})]})}),!pt&&d.jsx("div",{className:"absolute left-1/2 bottom-20 -translate-x-1/2 pointer-events-auto z-20 transition-all duration-700 opacity-60 hover:opacity-100",children:d.jsxs("button",{onClick:x=>{x.stopPropagation(),Fe()},className:"flex items-center gap-2 px-3.5 py-1 text-[10px] uppercase tracking-[0.25em] font-light text-white/60 hover:text-white bg-black/40 hover:bg-black/80 backdrop-blur-md border border-white/10 hover:border-white/25 rounded-full transition-all shadow-lg cursor-pointer",children:[d.jsx("span",{className:"w-1.5 h-1.5 rounded-full animate-pulse",style:{backgroundColor:Q.accentColor}}),d.jsxs("span",{children:[_," Overview"]})]})}),d.jsxs("footer",{className:"flex flex-col items-center gap-2 w-full pointer-events-auto z-30",children:[d.jsxs("div",{className:"flex flex-wrap items-center justify-center gap-x-3 gap-y-1 max-w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl md:rounded-full px-4 py-1 text-[10px] uppercase tracking-[0.2em] font-light shadow-xl",children:[d.jsx("button",{onClick:x=>{x.stopPropagation(),a()},className:"p-1 text-white/70 hover:text-white transition rounded-full",title:"Space to toggle play","aria-label":f?"Play simulation":"Pause simulation",children:f?d.jsx(vi,{size:11}):d.jsx(xi,{size:11})}),d.jsx("div",{className:"flex items-center gap-1 border-l border-white/10 pl-3",children:ea.map(x=>{const T=!f&&w===x.val;return d.jsx("button",{"aria-pressed":T,onClick:ae=>{ae.stopPropagation(),t(x.val)},className:`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-[0.15em] transition-all duration-200 ${T?"bg-white/20 text-white font-normal border border-white/25 shadow-sm":"text-white/40 hover:text-white/70"}`,children:x.label},x.label)})}),d.jsxs("div",{className:"flex items-center gap-1.5 border-l border-white/10 pl-3 text-[10px] uppercase tracking-[0.2em] font-light",children:[d.jsx("button",{onClick:x=>{x.stopPropagation(),r()},className:"text-white/40 hover:text-white px-1.5 py-0.5 rounded transition",children:"J2000"}),d.jsx("button",{onClick:x=>{x.stopPropagation(),c()},className:"text-white/40 hover:text-white px-1.5 py-0.5 rounded transition",children:"Now"}),d.jsxs("button",{onClick:x=>{x.stopPropagation(),Le(!ue)},"aria-label":`Jump to date (current ${ke})`,"aria-expanded":ue,className:"flex items-center gap-1 text-white/50 hover:text-white px-1.5 py-0.5 rounded transition",children:[d.jsx(gi,{size:10}),d.jsx("span",{children:ke})]})]})]}),ue&&d.jsxs("form",{onSubmit:Zt,className:"flex items-center gap-2 bg-black/85 backdrop-blur-xl border border-white/15 rounded-xl px-3 py-2 text-[10px] uppercase tracking-[0.2em] font-light shadow-2xl",children:[d.jsx("input",{type:"date","aria-label":"Simulation date (UTC)",value:ke,onFocus:()=>je(!0),onChange:x=>{je(!0),ht(x.target.value)},onBlur:()=>je(!1),className:"bg-white/10 text-white px-2 py-1 rounded border border-white/15 outline-none focus:border-white/40 text-[11px] font-sans"}),d.jsx("button",{type:"submit",className:"px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg transition text-[10px] uppercase tracking-[0.2em] font-light",children:"Jump"}),d.jsx("button",{type:"button",onClick:()=>Le(!1),className:"p-1 text-white/40 hover:text-white","aria-label":"Close date picker",children:d.jsx(Ze,{size:12})})]})]}),$&&d.jsxs("div",{className:"fixed inset-0 z-50 pointer-events-auto flex justify-end animate-fadeIn",children:[d.jsx("div",{onClick:()=>ee(!1),className:"flex-1 bg-black/60 backdrop-blur-sm transition-opacity"}),d.jsxs("aside",{className:"w-[420px] max-w-full bg-[#040307]/95 backdrop-blur-2xl border-l border-white/10 p-7 flex flex-col gap-6 shadow-2xl h-full font-sans overflow-y-auto no-scrollbar",children:[d.jsxs("div",{className:"flex justify-between items-start border-b border-white/10 pb-4",children:[d.jsxs("div",{children:[d.jsxs("span",{className:"text-[10px] uppercase tracking-[0.25em] font-light block",style:{color:Q.eyebrowColor},children:[Q.eyebrow," · SOLAR SYSTEM EXPLORER"]}),d.jsx("h2",{className:"text-3xl font-extralight text-white tracking-[0.25em] uppercase mt-1",children:_})]}),d.jsx("button",{onClick:()=>ee(!1),className:"text-white/40 hover:text-white transition p-1.5 rounded-full hover:bg-white/10","aria-label":"Close details",children:d.jsx(Ze,{size:18})})]}),d.jsxs("div",{className:"flex flex-col gap-2",children:[d.jsx("span",{className:"text-[10px] tracking-[0.25em] uppercase text-white/40 font-light",children:"Astronomical Lore & Physical Environment"}),d.jsx("p",{className:"text-xs leading-relaxed text-white/80 font-light",children:Q.extendedLore})]}),(_==="Sagittarius A*"||(p==null?void 0:p.category)==="black_hole")&&d.jsxs("div",{className:"flex flex-col gap-2.5 pt-2 border-t border-amber-500/30",children:[d.jsxs("div",{className:"flex items-center justify-between",children:[d.jsx("span",{className:"text-[10px] tracking-[0.25em] uppercase text-amber-400 font-medium",children:"Relativistic Horizons & Metrics"}),d.jsx("span",{className:"text-[9px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30",children:"EHT / NASA SVS"})]}),d.jsxs("div",{className:"grid grid-cols-2 gap-y-2 text-xs font-light bg-amber-500/5 p-3 rounded-xl border border-amber-500/15",children:[d.jsx("span",{className:"text-white/40",children:"Mass (M)"}),d.jsx("span",{className:"text-right text-amber-200 font-mono",children:"4.297 ± 0.012 × 10⁶ M☉"}),d.jsx("span",{className:"text-white/40",children:"Schwarzschild Radius (r_s)"}),d.jsx("span",{className:"text-right text-amber-200 font-mono",children:"12.69 × 10⁶ km (0.085 AU)"}),d.jsx("span",{className:"text-white/40",children:"Photon Sphere (r_ph)"}),d.jsx("span",{className:"text-right text-amber-200 font-mono",children:"1.5 r_s · 19.04 × 10⁶ km"}),d.jsx("span",{className:"text-white/40",children:"Shadow Radius (r_shadow)"}),d.jsx("span",{className:"text-right text-amber-200 font-mono",children:"2.60 r_s · 32.97 × 10⁶ km"}),d.jsx("span",{className:"text-white/40",children:"EHT Shadow Diameter (θ)"}),d.jsx("span",{className:"text-right text-amber-200 font-mono",children:"51.8 ± 2.3 µas"}),d.jsx("span",{className:"text-white/40",children:"ISCO Radius (r_isco)"}),d.jsx("span",{className:"text-right text-amber-200 font-mono",children:"3.0 r_s · 38.07 × 10⁶ km"}),d.jsx("span",{className:"text-white/40",children:"ISCO Orbital Velocity"}),d.jsx("span",{className:"text-right text-amber-200 font-mono",children:"0.408 c (122,400 km/s)"}),d.jsx("span",{className:"text-white/40",children:"Galactic Center Distance"}),d.jsx("span",{className:"text-right text-amber-200 font-mono",children:"8.277 kpc (26,990 ly)"})]}),d.jsxs("div",{className:"flex flex-col gap-1.5 p-3 rounded-xl bg-black/50 border border-white/10 text-[11px] text-white/70 font-light",children:[d.jsx("span",{className:"text-[10px] uppercase tracking-[0.2em] text-white/40 font-medium",children:"Relativistic Optical Phenomena:"}),d.jsxs("p",{children:["• ",d.jsx("strong",{className:"text-amber-200 font-normal",children:"Event Horizon Shadow:"})," In the Schwarzschild metric every photon with impact parameter b Null-geodesic ray tracing confirms absolute photon capture for impact parameters b < 2.598 r_s (3√3/2 r_s).lt; 3√3/2 r_s ≈ 2.598 r_s is captured."]}),d.jsxs("p",{children:["• ",d.jsx("strong",{className:"text-amber-200 font-normal",children:"Lensed Accretion Arches:"})," Light emitted from the rear accretion disk loops over and under the black hole's gravitational potential well, projecting primary and secondary lensed arcs."]}),d.jsxs("p",{children:["• ",d.jsx("strong",{className:"text-amber-200 font-normal",children:"Relativistic Doppler Beaming:"})," Plasma orbiting at ~0.4 c blazes in intense blue-white on the approaching left limb (intensity boost ~ δ⁴) while receding plasma dims into deep red."]}),d.jsxs("p",{children:["• ",d.jsx("strong",{className:"text-amber-200 font-normal",children:"Relativistic Polar Jets:"})," Twin collimated particle beams erupting at ~0.98 c along the spin axis, featuring an incandescent white-hot core and helical synchrotron shock sheaths."]}),d.jsxs("p",{children:["• ",d.jsx("strong",{className:"text-amber-200 font-normal",children:"Nuclear S-Cluster:"})," Over 300 massive B/O-type stars orbit Sgr A* in the central parsec, including star S2 reaching speeds of 7,650 km/s at pericenter."]})]})]}),H&&d.jsxs("div",{className:"flex flex-col gap-2 pt-2 border-t border-white/10",children:[d.jsx("span",{className:"text-[10px] tracking-[0.25em] uppercase text-white/40 font-light",children:"Physical Dimensions"}),d.jsxs("div",{className:"grid grid-cols-2 gap-y-2 text-xs font-light",children:[d.jsx("span",{className:"text-white/40",children:"Mean Radius"}),d.jsxs("span",{className:"text-right text-white/90",children:[H.physical.meanRadiusKm.toLocaleString()," km"]}),d.jsx("span",{className:"text-white/40",children:"Surface Gravity"}),d.jsx("span",{className:"text-right text-white/90",children:H.physical.gmKm3S2?`${(H.physical.gmKm3S2*1e3/Math.pow(H.physical.meanRadiusKm,2)).toFixed(2)} m/s²`:"—"}),d.jsx("span",{className:"text-white/40",children:"Sidereal Day"}),d.jsx("span",{className:"text-right text-white/90",children:H.physical.rotationPeriodHours!==void 0?`${H.physical.rotationPeriodHours.toFixed(1)} h`:"Synchronous"}),d.jsx("span",{className:"text-white/40",children:"Axial Tilt"}),d.jsx("span",{className:"text-right text-white/90",children:H.physical.axialTiltDeg!==void 0?`${H.physical.axialTiltDeg.toFixed(2)}°`:"0.00°"})]})]}),H&&d.jsxs("div",{className:"flex flex-col gap-2 pt-2 border-t border-white/10",children:[d.jsx("span",{className:"text-[10px] tracking-[0.25em] uppercase text-white/40 font-light",children:"Keplerian Orbit (J2000)"}),d.jsxs("div",{className:"grid grid-cols-2 gap-y-2 text-xs font-light",children:[d.jsx("span",{className:"text-white/40",children:"Semi-Major Axis"}),d.jsxs("span",{className:"text-right text-white/90",children:[H.orbit.semiMajorAxisAU.toFixed(3)," AU"]}),d.jsx("span",{className:"text-white/40",children:"Eccentricity"}),d.jsx("span",{className:"text-right text-white/90",children:H.orbit.eccentricity.toFixed(4)}),d.jsx("span",{className:"text-white/40",children:"Orbital Period"}),d.jsx("span",{className:"text-right text-white/90",children:H.orbit.orbitalPeriodDays>730?`${(H.orbit.orbitalPeriodDays/365.25).toFixed(2)} yr`:`${H.orbit.orbitalPeriodDays.toFixed(1)} d`}),d.jsx("span",{className:"text-white/40",children:"Inclination"}),d.jsxs("span",{className:"text-right text-white/90",children:[H.orbit.inclinationDeg.toFixed(2),"°"]})]})]}),p&&d.jsxs("div",{className:"flex flex-col gap-2 pt-2 border-t border-white/10",children:[d.jsx("span",{className:"text-[10px] tracking-[0.25em] uppercase text-white/40 font-light",children:"Live Ephemeris Telemetry"}),d.jsxs("div",{className:"grid grid-cols-2 gap-y-2 text-xs font-light",children:[d.jsx("span",{className:"text-white/40",children:"Heliocentric Dist"}),d.jsx("span",{className:"text-right text-white/90",children:p.distanceKm>1e6?`${(p.distanceKm/1e6).toFixed(2)}M km`:`${Math.round(p.distanceKm).toLocaleString()} km`}),d.jsx("span",{className:"text-white/40",children:"AU Distance"}),d.jsxs("span",{className:"text-right text-white/90",children:[(p.distanceKm/1495978707e-1).toFixed(3)," AU"]}),d.jsx("span",{className:"text-white/40",children:"Orbital Velocity"}),d.jsxs("span",{className:"text-right text-white/90",children:[p.apparentSpeedKmS.toFixed(2)," km/s"]})]})]}),Q.missions&&Q.missions.length>0&&d.jsxs("div",{className:"flex flex-col gap-3 pt-2 border-t border-white/10",children:[d.jsx("span",{className:"text-[10px] tracking-[0.25em] uppercase text-white/40 font-light",children:"Exploration Missions"}),d.jsx("div",{className:"flex flex-col gap-2.5",children:Q.missions.map(x=>d.jsxs("div",{className:"p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col gap-1",children:[d.jsxs("div",{className:"flex justify-between items-center text-xs",children:[d.jsx("span",{className:"text-white font-medium tracking-[0.1em]",children:x.name}),d.jsxs("span",{className:"text-[10px] text-white/40 font-light",children:[x.year," · ",x.agency]})]}),d.jsx("p",{className:"text-[11px] text-white/60 font-light",children:x.role})]},x.name))})]}),d.jsxs("div",{className:"pt-3 border-t border-white/10 flex justify-between items-center text-[10px] font-light text-white/30 uppercase tracking-[0.2em]",children:[d.jsx("span",{children:(H==null?void 0:H.orbit.source)??"NASA JPL orbital elements"}),d.jsx("span",{children:"Keplerian 2-Body Solver"})]}),d.jsxs("p",{className:"text-[10px] leading-relaxed font-light text-white/35",children:["Textures: Solar System Scope (CC BY 4.0) · Sky map: ESA/Gaia/DPAC (CC BY-SA 3.0 IGO) · Stars: ESA/Hipparcos (CC BY-NC 3.0 IGO) · Galaxy art: NASA/JPL-Caltech/ESO/R. Hurt (CC BY 4.0) · Orbits: NASA JPL."," ",d.jsx("a",{href:"https://github.com/LetMeCodex/solaris/blob/main/ASSETS.md",target:"_blank",rel:"noopener noreferrer",className:"underline hover:text-white/70",children:"Full credits"})]})]})]}),se&&d.jsxs("div",{className:"fixed inset-0 z-50 pointer-events-auto flex",children:[d.jsx("div",{onClick:()=>ye(!1),className:"flex-1 bg-black/60 backdrop-blur-sm transition-opacity"}),d.jsxs("aside",{className:"w-96 bg-[#07060a]/95 backdrop-blur-2xl border-l border-white/10 p-6 flex flex-col gap-5 shadow-2xl h-full font-sans",children:[d.jsxs("div",{className:"flex justify-between items-center border-b border-white/10 pb-4",children:[d.jsxs("div",{children:[d.jsx("h3",{className:"text-lg font-extralight text-white tracking-[0.25em] uppercase",children:"Astronomical Catalogue"}),d.jsxs("span",{className:"text-[10px] uppercase tracking-[0.2em] font-light text-white/40",children:[Ae.length," bodies · NASA JPL elements"]})]}),d.jsx("button",{onClick:()=>ye(!1),className:"text-white/40 hover:text-white transition p-1.5 rounded-full hover:bg-white/5","aria-label":"Close catalogue",children:d.jsx(Ze,{size:16})})]}),d.jsxs("div",{className:"flex flex-col gap-2.5 text-xs",children:[d.jsxs("div",{className:"relative",children:[d.jsx(Dt,{size:13,className:"absolute left-3 top-2.5 text-white/35"}),d.jsx("input",{type:"text",placeholder:"FILTER BY NAME, CATEGORY...","aria-label":"Filter catalogue by name or category",value:Oe,onChange:x=>qt(x.target.value),className:"w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white placeholder-white/30 text-[11px] uppercase tracking-[0.15em] outline-none focus:border-white/30"})]}),d.jsx("div",{className:"grid grid-cols-4 gap-1 text-[10px] uppercase tracking-[0.18em] font-light",children:["all","planet","moon","minor"].map(x=>d.jsx("button",{onClick:()=>Yt(x),"aria-pressed":re===x,className:`py-1 rounded-lg text-center uppercase tracking-wider transition-all duration-200 ${re===x?"bg-white/15 text-white font-normal border border-white/20":"text-white/40 hover:text-white/70"}`,children:x==="all"?`All (${Ae.length})`:x==="planet"?"Planets":x==="moon"?"Moons":"Minor"},x))})]}),d.jsx("div",{className:"flex-1 overflow-y-auto no-scrollbar flex flex-col gap-1.5 pr-1",children:Qt.map(x=>{const T=_===x.name;return d.jsxs("button",{onClick:()=>{e(x.name),Fe(),ye(!1)},className:`flex items-center justify-between p-2.5 rounded-xl border transition text-left ${T?"bg-white/15 border-white/30 text-white":"bg-white/[0.02] border-white/5 text-white/70 hover:bg-white/[0.06] hover:text-white"}`,children:[d.jsxs("div",{className:"flex items-center gap-3",children:[d.jsx("span",{className:"w-2 h-2 rounded-full flex-shrink-0",style:{backgroundColor:x.physical.colorHex||"#ffffff"}}),d.jsxs("div",{className:"flex flex-col",children:[d.jsx("span",{className:"text-xs text-white font-light tracking-[0.15em] uppercase",children:x.name}),d.jsxs("span",{className:"text-[10px] text-white/35 uppercase tracking-[0.1em]",children:[x.category.replace("_"," "),x.parentName&&` · ${x.parentName}`]})]})]}),d.jsxs("div",{className:"text-right text-[10px] text-white/40 font-light tracking-wider",children:[d.jsxs("div",{children:[x.physical.meanRadiusKm.toLocaleString()," km"]}),d.jsxs("div",{children:[x.orbit.semiMajorAxisAU.toFixed(2)," AU"]})]})]},x.name)})})]})]})]}):d.jsx("div",{className:"absolute bottom-6 right-6 z-50 pointer-events-auto",children:d.jsxs("button",{onClick:()=>V(!0),className:"flex items-center gap-2 px-3.5 py-1.5 text-xs text-white/50 hover:text-white bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/10 rounded-full transition uppercase tracking-[0.2em] font-light",children:[d.jsx(yi,{size:13}),d.jsx("span",{children:"Show Interface (H)"})]})})},Si=()=>{const g=R.useRef(null),e=R.useRef(null),[i,a]=R.useState(null);R.useEffect(()=>{if(!g.current)return;const y=new st(g.current,v=>{a(v)});return e.current=y,window.__solaris_scene=y,()=>{delete window.__solaris_scene,y.dispose(),e.current=null}},[]);const t=R.useCallback(y=>{var v;(v=e.current)==null||v.selectBody(y)},[]),o=R.useCallback(()=>{var y;(y=e.current)==null||y.resetView()},[]),s=R.useCallback(()=>{if(!e.current)return;const y=e.current.clock.isPaused;e.current.clock.isPaused=!y},[]),r=R.useCallback(y=>{e.current&&(e.current.clock.timeMultiplier=y,e.current.clock.isPaused=!1)},[]),c=R.useCallback(y=>{var v;(v=e.current)==null||v.setScaleMode(y)},[]),n=R.useCallback(y=>{var v;(v=e.current)==null||v.clock.setUtcMs(y)},[]),l=R.useCallback(()=>{var y;(y=e.current)==null||y.clock.resetToJ2000()},[]),h=R.useCallback(()=>{var y;(y=e.current)==null||y.clock.resetToNow()},[]),u=R.useCallback(()=>{var y;(y=e.current)==null||y.toggleConstellations()},[]),p=R.useCallback(()=>{var y;(y=e.current)==null||y.toggleAsteroidBelt()},[]),f=R.useCallback(()=>{var y;(y=e.current)==null||y.toggleOrbits()},[]),w=R.useCallback(y=>{var v;(v=e.current)==null||v.jumpToScale(y)},[]);return d.jsxs("div",{className:"relative w-screen h-screen overflow-hidden bg-[#030206]",style:{width:"100vw",height:"100vh",position:"relative",overflow:"hidden"},children:[d.jsx("div",{ref:g,className:"absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing",style:{position:"absolute",top:0,left:0,width:"100%",height:"100%"}}),d.jsx(Mi,{telemetry:i,onSelectPlanet:t,onResetView:o,onTogglePlay:s,onSetTimeMultiplier:r,onSetScaleMode:c,onSeekDate:n,onResetToJ2000:l,onResetToNow:h,onToggleConstellations:u,onToggleAsteroidBelt:p,onToggleOrbits:f,onJumpToScale:w})]})};at.createRoot(document.getElementById("root")).render(d.jsx(na.StrictMode,{children:d.jsx(Si,{})}));
