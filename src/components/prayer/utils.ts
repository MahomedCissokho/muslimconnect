import type { MagnetometerMeasurement } from 'expo-sensors';
import { KAABA_LAT, KAABA_LNG } from './types';

/** Parse "HH:mm" to minutes since midnight. */
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

/** Format seconds into HH:MM:SS. */
export function formatCountdown(totalSeconds: number): string {
  if (totalSeconds <= 0) return '00:00:00';
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/** Calculate Qibla bearing from user location to the Kaaba. */
export function calculateQiblaBearing(lat: number, lng: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const phiK = toRad(KAABA_LAT);
  const lambdaK = toRad(KAABA_LNG);
  const phi = toRad(lat);
  const lambda = toRad(lng);

  const numerator = Math.sin(lambdaK - lambda);
  const denominator =
    Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda);

  let bearing = (Math.atan2(numerator, denominator) * 180) / Math.PI;
  return (bearing + 360) % 360;
}

/** Convert magnetometer data to compass heading in degrees (0 = North). */
export function magnetometerToHeading(data: MagnetometerMeasurement): number {
  let heading = Math.atan2(data.y, data.x) * (180 / Math.PI);
  return (360 - heading + 90) % 360;
}

/** Calculate the shortest angular difference between two angles. */
export function angleDifference(a: number, b: number): number {
  let diff = ((a - b + 180) % 360) - 180;
  return Math.abs(diff < -180 ? diff + 360 : diff);
}
