import { Subject } from '../../types';

export interface AttendanceProjection {
  currentPercentage: number;
  afterMissingPercentage: number;
  afterAttendingPercentage: number;
  classesNeededForTarget: number;
  canAffordToMissCount: number;
  insight: string;
  urgency: 'urgent' | 'attention' | 'healthy';
}

/**
 * Calculates attendance percentage safely rounded to 1 decimal place.
 */
export function calculateCurrentAttendance(attended: number, total: number): number {
  if (total <= 0) return 100;
  return Math.round((attended / total) * 1000) / 10;
}

/**
 * Projects attendance if student misses the next `missCount` classes.
 */
export function projectIfMissClasses(attended: number, total: number, missCount: number): number {
  const newTotal = total + missCount;
  if (newTotal <= 0) return 0;
  return Math.round((attended / newTotal) * 1000) / 10;
}

/**
 * Projects attendance if student attends the next `attendCount` classes consecutively.
 */
export function projectIfAttendClasses(attended: number, total: number, attendCount: number): number {
  const newAttended = attended + attendCount;
  const newTotal = total + attendCount;
  if (newTotal <= 0) return 0;
  return Math.round((newAttended / newTotal) * 1000) / 10;
}

/**
 * Calculates exact minimum consecutive classes needed to reach or exceed target percentage (e.g. 75%).
 * Formula:
 * (Attended + x) / (Total + x) >= target / 100
 * Attended + x >= (target/100)*Total + (target/100)*x
 * x * (1 - target/100) >= (target/100)*Total - Attended
 * x >= (target * Total - 100 * Attended) / (100 - target)
 */
export function classesNeededForTarget(attended: number, total: number, targetPercentage: number = 75): number {
  const current = (attended / total) * 100;
  if (current >= targetPercentage) return 0;

  const targetDecimal = targetPercentage / 100;
  if (targetDecimal >= 1) return 999;

  const required = (targetDecimal * total - attended) / (1 - targetDecimal);
  return Math.max(0, Math.ceil(required));
}

/**
 * Calculates how many classes a student can afford to miss without dropping below the target threshold.
 * (Attended) / (Total + m) >= target / 100
 * Attended >= (target/100)*(Total + m)
 * Attended / (target/100) - Total >= m
 */
export function classesCanAffordToMiss(attended: number, total: number, targetPercentage: number = 75): number {
  const current = (attended / total) * 100;
  if (current < targetPercentage) return 0;

  const targetDecimal = targetPercentage / 100;
  const maxTotalAllowed = attended / targetDecimal;
  const margin = Math.floor(maxTotalAllowed - total);
  return Math.max(0, margin);
}

/**
 * Generates dynamic, data-driven AI attendance insights.
 */
export function getAttendanceInsight(subject: Subject, targetPercentage: number = 75): {
  message: string;
  urgency: 'urgent' | 'attention' | 'healthy';
  classesNeeded: number;
} {
  const current = calculateCurrentAttendance(subject.classesAttended, subject.totalClasses);
  const needed = classesNeededForTarget(subject.classesAttended, subject.totalClasses, targetPercentage);
  const canMiss = classesCanAffordToMiss(subject.classesAttended, subject.totalClasses, targetPercentage);

  if (current < targetPercentage) {
    const isCritical = current < targetPercentage - 5;
    return {
      message: `You need to attend your next ${needed} ${subject.name} classes to move above your ${targetPercentage}% target.`,
      urgency: isCritical ? 'urgent' : 'attention',
      classesNeeded: needed,
    };
  } else {
    return {
      message: canMiss > 0
        ? `Solid standing at ${current}%. You have an attendance buffer of ${canMiss} class${canMiss > 1 ? 'es' : ''} above the ${targetPercentage}% requirement.`
        : `Currently at ${current}%. Attending the upcoming sessions will ensure your hall-ticket eligibility remains protected.`,
      urgency: 'healthy',
      classesNeeded: 0,
    };
  }
}
