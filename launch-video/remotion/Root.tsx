import React from 'react';
import { Composition } from 'remotion';
import { Launch, DURATION } from './Launch';
import { LaunchCinematic, CINEMATIC_DURATION } from './LaunchCinematic';
import { Flight, FLIGHT_DURATION } from './Flight';
import { FPS } from './theme';

export const Root: React.FC = () => (
  <>
    <Composition id="Launch" component={Launch} durationInFrames={Math.round(DURATION * FPS)} fps={FPS} width={1920} height={1080} />
    <Composition id="LaunchCinematic" component={LaunchCinematic} durationInFrames={Math.round(CINEMATIC_DURATION * FPS)} fps={FPS} width={1920} height={1080} />
    <Composition id="Flight" component={Flight} durationInFrames={Math.round(FLIGHT_DURATION * FPS)} fps={FPS} width={1920} height={1080} />
  </>
);
