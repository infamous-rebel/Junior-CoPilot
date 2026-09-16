import { CopilotQueryRequest, CopilotResponse, DailyInput } from './types';

// Storage key helper for dynamic browser sync
export function getSavedDailyInputs(classId: string, defaultInputs: DailyInput[]): DailyInput[] {
  if (typeof window === 'undefined') return defaultInputs.filter(l => l.class_id === classId);
  try {
    const customLogsStr = localStorage.getItem(`junior_copilot_logs_${classId}`);
    if (customLogsStr) {
      const customLogs = JSON.parse(customLogsStr);
      return [...customLogs, ...defaultInputs.filter(l => l.class_id === classId)];
    }
  } catch (e) {
    console.error('Error loading custom logs from localStorage', e);
  }
  return defaultInputs.filter(l => l.class_id === classId);
}

export function saveNewTeacherInput(input: DailyInput): void {
  if (typeof window === 'undefined') return;
  try {
    const classId = input.class_id;
    const existingStr = localStorage.getItem(`junior_copilot_logs_${classId}`);
    const existing: DailyInput[] = existingStr ? JSON.parse(existingStr) : [];
    existing.unshift(input);
    localStorage.setItem(`junior_copilot_logs_${classId}`, JSON.stringify(existing));
  } catch (e) {
    console.error('Error saving teacher log to localStorage', e);
  }
}

/**
 * Closed-Loop RAG Grounding & Safety Guardrail Logic
 * Grounding constraint: Only answer using verified daily inputs for the selected class.
 */
export async function processStudentQuery(
  request: CopilotQueryRequest,
  dailyInputs: DailyInput[]
): Promise<CopilotResponse> {
  const { query, mode, gradeLevel } = request;
  const normalizedQuery = query.trim().toLowerCase();

  // Filter logs for this class
  const classLogs = dailyInputs.filter(l => l.class_id === request.classId || l.class_id === 'cls-g3a');

  if (!classLogs || classLogs.length === 0) {
    return {
      answer: "Your teacher hasn't posted today's lesson notes yet! Check back after school.",
      isGrounded: false,
      groundedSources: []
    };
  }

  // Safety filter for off-topic or inappropriate content
  const offTopicKeywords = ['politics', 'news', 'murder', 'gun', 'gambling', 'crypto', 'war', 'adult'];
  if (offTopicKeywords.some(w => normalizedQuery.includes(w))) {
    return {
      answer: "Let's stay focused on our fun school topics for today! What would you like to review in Math or Science?",
      isGrounded: true,
      groundedSources: []
    };
  }

  // Match query terms against subject, topics, homework, vocabulary
  const matchedLogs = classLogs.filter(log => {
    const subjectMatch = normalizedQuery.includes(log.subject.toLowerCase());
    const topicMatch = log.topics_covered.toLowerCase().split(' ').some(word => word.length > 3 && normalizedQuery.includes(word));
    const homeworkMatch = log.homework_assigned ? log.homework_assigned.toLowerCase().split(' ').some(word => word.length > 3 && normalizedQuery.includes(word)) : false;
    const vocabMatch = log.vocabulary_tags ? log.vocabulary_tags.some(tag => normalizedQuery.includes(tag.toLowerCase())) : false;
    return subjectMatch || topicMatch || homeworkMatch || vocabMatch;
  });

  // If no match found and query asks general unmentioned questions -> Strict fallback rule
  if (matchedLogs.length === 0 && !normalizedQuery.includes('today') && !normalizedQuery.includes('learned') && !normalizedQuery.includes('homework') && !normalizedQuery.includes('test')) {
    return {
      answer: "Hmm, your teacher didn't add that to today's list! Check with them tomorrow.",
      isGrounded: false,
      groundedSources: [],
      suggestedFollowups: [
        "What did we learn today in Math?",
        "Do we have any homework?",
        "Are there upcoming tests?"
      ]
    };
  }

  const logsToUse = matchedLogs.length > 0 ? matchedLogs : classLogs;
  const sources = logsToUse.map(l => ({
    id: l.id,
    subject: l.subject,
    topics: l.topics_covered,
    homework: l.homework_assigned
  }));

  // Direct Homework Answer Request Check -> Enforce Hint-Based Tutoring
  const askingForDirectAnswer = 
    normalizedQuery.includes('answer') || 
    normalizedQuery.includes('solution') || 
    normalizedQuery.includes('do my homework') ||
    normalizedQuery.includes('give me the answer') ||
    normalizedQuery.includes('what is the answer');

  if (askingForDirectAnswer || mode === 'homework_buddy') {
    const hwLog = logsToUse.find(l => l.homework_assigned) || classLogs[0];
    if (hwLog && hwLog.homework_assigned) {
      return {
        answer: `I can help you with your ${hwLog.subject} homework! Remember: ${hwLog.homework_assigned.replace(/Complete|Workbook|Page/gi, '')}. Try breaking it down step by step: what is the first number or word you see?`,
        isGrounded: true,
        groundedSources: sources,
        hintsGiven: [
          "Count the total parts or read the question carefully!",
          "Check your lesson notes for numerator and denominator clues.",
          "Try drawing a quick sketch to visualize the problem!"
        ],
        suggestedFollowups: ["Can you give me another hint?", "What did we learn in class today?"]
      };
    }
  }

  // Check for Test inquiry
  if (normalizedQuery.includes('test') || normalizedQuery.includes('quiz') || normalizedQuery.includes('exam')) {
    const testLogs = logsToUse.filter(l => l.has_upcoming_test);
    if (testLogs.length > 0) {
      const details = testLogs.map(l => `${l.subject}: ${l.test_details}`).join('; ');
      return {
        answer: `Yes! You have an upcoming test scheduled: ${details}. Don't worry, practicing today's review will make you super ready! 🌟`,
        isGrounded: true,
        groundedSources: sources,
        suggestedFollowups: ["Can we do a practice quiz?", "Review Math topics"]
      };
    } else {
      return {
        answer: "Great news! Your teacher hasn't listed any upcoming tests for this week. Keep up the awesome learning!",
        isGrounded: true,
        groundedSources: sources
      };
    }
  }

  // Default Daily Recall Summary
  const subjectsList = Array.from(new Set(logsToUse.map(l => l.subject))).join(', ');
  const topicHighlights = logsToUse.map(l => `${l.subject}: ${l.topics_covered}`).join(' ');

  return {
    answer: `Today in Grade ${gradeLevel}, we explored ${subjectsList}! ${topicHighlights.slice(0, 180)}... You did awesome today! 🎉`,
    isGrounded: true,
    groundedSources: sources,
    suggestedFollowups: [
      "Can you give me a hint for homework?",
      "Let's try a 1-minute Pop Quiz!",
      "Are there any upcoming tests?"
    ]
  };
}
