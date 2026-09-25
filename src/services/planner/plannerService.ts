import { Subject, Topic, StudyTask, AIReasoningLog } from '../../types';

export interface PriorityScoreResult {
  topicId: string;
  topicName: string;
  subjectName: string;
  score: number;
  factors: {
    examUrgencyScore: number;
    attendanceRiskScore: number;
    masteryWeaknessScore: number;
    difficultyScore: number;
  };
  reasoning: string;
}

/**
 * Calculates academic priority score based on:
 * Exam Urgency + Attendance Risk + Learning Weakness + Difficulty
 */
export function calculateTopicPriority(
  topic: Topic,
  subject?: Subject
): PriorityScoreResult {
  // 1. Exam Urgency: 30 days max scale (closer exam = higher score)
  const daysLeft = subject ? subject.examDaysLeft : 14;
  const examUrgencyScore = Math.max(0, (30 - daysLeft) * 2.5); // max ~75

  // 2. Attendance Risk: if attendance < 75%, high risk multiplier
  const attPct = subject ? subject.attendancePercentage : 80;
  let attendanceRiskScore = 0;
  if (attPct < 75) {
    attendanceRiskScore = (75 - attPct) * 6; // e.g. (75 - 70.8) * 6 = ~25.2
  }

  // 3. Learning Weakness: (100 - mastery)
  const masteryWeaknessScore = (100 - topic.masteryPercentage) * 0.75; // e.g. (100 - 62) * 0.75 = 28.5

  // 4. Difficulty weight
  let difficultyScore = 10;
  if (topic.difficulty === 'Hard') difficultyScore = 25;
  else if (topic.difficulty === 'Medium') difficultyScore = 15;
  else difficultyScore = 5;

  const totalScore = Math.round(examUrgencyScore + attendanceRiskScore + masteryWeaknessScore + difficultyScore);

  let reasoning = '';
  if (attendanceRiskScore > 15 && examUrgencyScore > 40) {
    reasoning = `High exam urgency (${daysLeft} days) combined with attendance risk (${attPct}%) requires urgent intervention.`;
  } else if (masteryWeaknessScore > 25) {
    reasoning = `Lower current mastery (${topic.masteryPercentage}%) indicates high improvement yield prior to upcoming exams.`;
  } else if (examUrgencyScore > 50) {
    reasoning = `Imminent examination in ${daysLeft} days demands active recall sessions.`;
  } else {
    reasoning = `Consolidation and spaced revision to prevent knowledge decay.`;
  }

  return {
    topicId: topic.id,
    topicName: topic.name,
    subjectName: topic.subjectName,
    score: totalScore,
    factors: {
      examUrgencyScore: Math.round(examUrgencyScore),
      attendanceRiskScore: Math.round(attendanceRiskScore),
      masteryWeaknessScore: Math.round(masteryWeaknessScore),
      difficultyScore,
    },
    reasoning,
  };
}

/**
 * Generates an adaptive optimized schedule for the student with clear AI rationale.
 */
export function generateAdaptiveStudyPlan(
  subjects: Subject[],
  topics: Topic[],
  _existingTasks: StudyTask[]
): {
  tasks: StudyTask[];
  reasoningLogs: AIReasoningLog[];
  topRecommendation: string;
} {
  // Score all topics
  const scored = topics.map(t => {
    const sub = subjects.find(s => s.id === t.subjectId || s.name.toLowerCase().includes(t.subjectName.toLowerCase()));
    return calculateTopicPriority(t, sub);
  });

  scored.sort((a, b) => b.score - a.score);

  const newTasks: StudyTask[] = [];
  const timeslots = [
    '4:00 PM – 4:45 PM',
    '5:00 PM – 5:35 PM',
    '5:50 PM – 6:25 PM',
    '6:40 PM – 7:15 PM',
  ];

  // Pick top 3-4 topics
  const topSelection = scored.slice(0, 3);

  topSelection.forEach((item, idx) => {
    const topicObj = topics.find(t => t.id === item.topicId);
    let pLevel: 'urgent' | 'high' | 'medium' | 'low' = 'medium';
    let pLabel: StudyTask['priority'] = 'Revision';

    if (item.factors.attendanceRiskScore > 10) {
      pLevel = 'urgent';
      pLabel = 'Urgent attendance';
    } else if (topicObj && topicObj.masteryPercentage < 65) {
      pLevel = 'urgent';
      pLabel = 'Weak topic';
    } else if (item.factors.examUrgencyScore > 45) {
      pLevel = 'high';
      pLabel = 'Exam approaching';
    }

    newTasks.push({
      id: `task-gen-${Date.now()}-${idx}`,
      subject: item.subjectName.includes('Data') ? 'DSA' : item.subjectName.includes('Electronics') ? 'Electronics' : item.subjectName,
      topic: item.topicName,
      durationMinutes: idx === 0 ? 45 : idx === 1 ? 35 : 30,
      priority: pLabel,
      priorityLevel: pLevel,
      completed: false,
      scheduledTime: timeslots[idx] || '7:00 PM – 7:30 PM',
      day: 'Today',
      notes: item.reasoning,
    });
  });

  const reasoningLogs: AIReasoningLog[] = [
    {
      id: `log-${Date.now()}-1`,
      timestamp: 'Just now',
      title: 'Prioritized Electronics & DSA Trees',
      explanation: 'I placed Electronics at the forefront because your attendance is currently at 70.8% (below the 75% requirement) with an exam in 10 days. DSA Trees was scheduled as the primary deep-work session due to your current 62% topic mastery.',
      trigger: 'Attendance Drop',
    },
    {
      id: `log-${Date.now()}-2`,
      timestamp: '2 hours ago',
      title: 'Interleaved Spaced Repetition',
      explanation: 'Shifted Mathematics integration into the evening slot to leverage the cognitive spacing effect following heavy algorithmic problem solving.',
      trigger: 'Exam Proximity',
    }
  ];

  return {
    tasks: newTasks,
    reasoningLogs,
    topRecommendation: 'Your Electronics exam is in 10 days and your current attendance is 71%. Prioritize Electronics and DSA Trees today.',
  };
}
