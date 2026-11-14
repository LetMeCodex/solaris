import { CLOUD_NOISE_SIZE, generateCloudNoise } from './cloudNoiseGenerator';

self.onmessage = (event: MessageEvent<number | undefined>) => {
  const size = typeof event.data === 'number' && event.data > 0 ? event.data : CLOUD_NOISE_SIZE;
  const { data } = generateCloudNoise(size);
  (self as unknown as { postMessage(msg: Uint8Array, transfer: Transferable[]): void }).postMessage(data, [data.buffer]);
};
