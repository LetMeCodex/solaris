import React from 'react';
import { Composition } from 'remotion';
import { Launch, DURATION } from './Launch';
import { FPS } from './theme';

export const Root: React.FC = () => (
  <Composition id="Launch" component={Launch} durationInFrames={Math.round(DURATION * FPS)} fps={FPS} width={1920} height={1080} />
);
