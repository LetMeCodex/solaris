import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { SolarShader } from '../rendering/SolarShader';
import { AtmosphereShader, ATMOSPHERE_CONFIGS } from '../rendering/AtmosphereShader';
import { EarthMaterial } from '../rendering/EarthMaterial';
import { PlanetMaterial } from '../rendering/PlanetMaterial';
import { PlanetFactory } from '../rendering/PlanetFactory';
import { CatalogueManager } from '../data/CatalogueManager';

describe('Astrophysical Shaders & Materials Suite', () => {
  it('1. SolarShader constructs the photosphere, the corona and living magnetic loops', () => {
    const dummyTex = new THREE.Texture();
    const photoMat = SolarShader.createPhotosphereMaterial(dummyTex);
    expect(photoMat).toBeInstanceOf(THREE.ShaderMaterial);
    expect(photoMat.uniforms.sunTexture.value).toBe(dummyTex);
    expect(photoMat.uniforms.time.value).toBe(0.0);

    const coronaMat = SolarShader.createCoronaMaterial(14.0);
    expect(coronaMat).toBeInstanceOf(THREE.ShaderMaterial);
    expect(coronaMat.uniforms.sunRadius.value).toBe(14.0);
    expect(coronaMat.uniforms.sunCenter.value.x).toBe(0);
    expect(coronaMat.transparent).toBe(true);
    expect(coronaMat.blending).toBe(THREE.AdditiveBlending);
    expect(coronaMat.side).toBe(THREE.BackSide);

    const prominences = SolarShader.createProminencesGroup(14.0);
    expect(prominences).toBeInstanceOf(THREE.Group);
    expect(prominences.children.length).toBe(9);
    prominences.children.forEach((child) => {
      expect(child).toBeInstanceOf(THREE.Mesh);
      const mesh = child as THREE.Mesh;
      expect(mesh.material).toBeInstanceOf(THREE.ShaderMaterial);
      expect(mesh.geometry).toBeInstanceOf(THREE.TubeGeometry);
      // Each loop stands on the photosphere (its base point is on the surface)
      expect(mesh.position.length()).toBeCloseTo(14.0, 3);
    });
  });

  it('2. AtmosphereShader provides configurations and materials only for atmospheric bodies', () => {
    // Configs exist for atmospheric worlds
    expect(ATMOSPHERE_CONFIGS['Earth']).toBeDefined();
    expect(ATMOSPHERE_CONFIGS['Venus']).toBeDefined();
    expect(ATMOSPHERE_CONFIGS['Mars']).toBeDefined();
    expect(ATMOSPHERE_CONFIGS['Uranus']).toBeDefined();
    expect(ATMOSPHERE_CONFIGS['Neptune']).toBeDefined();

    // Material generation
    const earthAtmo = AtmosphereShader.createAtmosphereMaterial('Earth');
    expect(earthAtmo).toBeInstanceOf(THREE.ShaderMaterial);
    expect(earthAtmo?.uniforms.rayleighColor).toBeDefined();
    expect(earthAtmo?.uniforms.twilightColor).toBeDefined();
    expect(earthAtmo?.transparent).toBe(true);

    const marsAtmo = AtmosphereShader.createAtmosphereMaterial('Mars');
    expect(marsAtmo).toBeInstanceOf(THREE.ShaderMaterial);

    // Airless worlds return null
    expect(AtmosphereShader.createAtmosphereMaterial('Mercury')).toBeNull();
    expect(AtmosphereShader.createAtmosphereMaterial('Moon')).toBeNull();
    expect(AtmosphereShader.createAtmosphereMaterial('Ceres')).toBeNull();
  });

  it('3. EarthMaterial creates unified surface and cloud materials', () => {
    const dayTex = new THREE.Texture();
    const normalTex = new THREE.Texture();
    const nightTex = new THREE.Texture();

    const earthSurf = EarthMaterial.createSurfaceMaterial(dayTex, normalTex, nightTex);
    expect(earthSurf).toBeInstanceOf(THREE.ShaderMaterial);
    expect(earthSurf.uniforms.dayMap.value).toBe(dayTex);
    expect(earthSurf.uniforms.normalMap.value).toBe(normalTex);
    expect(earthSurf.uniforms.nightMap.value).toBe(nightTex);
    expect(earthSurf.uniforms.hasNormalMap.value).toBe(1.0);
    expect(earthSurf.uniforms.hasNightMap.value).toBe(1.0);

    const cloudTex = new THREE.Texture();
    const earthClouds = EarthMaterial.createCloudMaterial(cloudTex);
    expect(earthClouds).toBeInstanceOf(THREE.ShaderMaterial);
    expect(earthClouds.uniforms.cloudsMap.value).toBe(cloudTex);
    expect(earthClouds.transparent).toBe(true);
  });

  it('4. PlanetMaterial correctly identifies planet categories and flags', () => {
    const dummyTex = new THREE.Texture();

    // Jupiter: Gas giant Minnaert flag active
    const jupiterMat = PlanetMaterial.createMaterial({
      name: 'Jupiter',
      category: 'planet',
      map: dummyTex,
    });
    expect(jupiterMat.uniforms.isGasGiant.value).toBe(1.0);
    expect(jupiterMat.uniforms.isSaturn.value).toBe(0.0);
    expect(jupiterMat.uniforms.isIcyMoon.value).toBe(0.0);

    // Saturn: Gas giant AND Saturn ring shadow active
    const saturnMat = PlanetMaterial.createMaterial({
      name: 'Saturn',
      category: 'planet',
      map: dummyTex,
    });
    expect(saturnMat.uniforms.isGasGiant.value).toBe(1.0);
    expect(saturnMat.uniforms.isSaturn.value).toBe(1.0);

    // Europa: Icy moon specular active
    const europaMat = PlanetMaterial.createMaterial({
      name: 'Europa',
      category: 'moon',
      map: dummyTex,
    });
    expect(europaMat.uniforms.isIcyMoon.value).toBe(1.0);
    expect(europaMat.uniforms.isGasGiant.value).toBe(0.0);

    // Mercury: Airless rocky regolith active
    const mercuryMat = PlanetMaterial.createMaterial({
      name: 'Mercury',
      category: 'planet',
      map: dummyTex,
    });
    expect(mercuryMat.uniforms.isAirlessRocky.value).toBe(1.0);
  });

  it('5. PlanetFactory creates complete mesh bundles for Sun, Earth, and Saturn', () => {
    const sunDef = CatalogueManager.getBody('Sun')!;
    const sunBundle = PlanetFactory.createPlanet(sunDef);
    expect(sunBundle.surfaceMesh).toBeDefined();
    expect(sunBundle.glowMeshes).toBeDefined();
    expect(sunBundle.glowMeshes?.length).toBeGreaterThan(0);
    expect(sunBundle.prominencesGroup).toBeDefined();

    const earthDef = CatalogueManager.getBody('Earth')!;
    const earthBundle = PlanetFactory.createPlanet(earthDef);
    expect(earthBundle.surfaceMesh).toBeDefined();
    expect(earthBundle.cloudMesh).toBeDefined();
    expect(earthBundle.atmosphereMesh).toBeDefined();

    const saturnDef = CatalogueManager.getBody('Saturn')!;
    const saturnBundle = PlanetFactory.createPlanet(saturnDef);
    expect(saturnBundle.surfaceMesh).toBeDefined();
    expect(saturnBundle.ringMesh).toBeDefined();
  });
});
