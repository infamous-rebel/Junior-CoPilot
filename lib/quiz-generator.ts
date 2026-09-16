import { DailyInput, MicroQuizQuestion } from './types';
import { INITIAL_QUIZZES } from './mock-data';

export function getQuizzesForClass(classId: string, dailyInputs: DailyInput[]): MicroQuizQuestion[] {
  // Combine pre-built quizzes with any custom-generated quizzes
  return INITIAL_QUIZZES;
}

export function generateQuizFromDailyInput(input: DailyInput): MicroQuizQuestion {
  const isMath = input.subject === 'Math';
  const isScience = input.subject === 'Science';

  if (isMath) {
    return {
      id: `q-gen-${Date.now()}`,
      daily_input_id: input.id,
      subject: 'Math',
      question: `Based on today's math lesson (${input.topics_covered.slice(0, 40)}...), what key concept did we practice?`,
      options: [
        { id: 'a', text: 'Equal parts & counting shapes' },
        { id: 'b', text: 'Complex calculus formulas' },
        { id: 'c', text: 'World geography maps' },
        { id: 'd', text: 'Ancient history dates' }
      ],
      correct_option_id: 'a',
      hint_text: 'Think about what your teacher taught in class today!',
      explanation: 'Super work! We practiced equal parts and foundational math counting!',
      difficulty_level: 'easy'
    };
  }

  if (isScience) {
    return {
      id: `q-gen-${Date.now()}`,
      daily_input_id: input.id,
      subject: 'Science',
      question: `In today's science lesson on ${input.topics_covered.slice(0, 30)}..., what do living organisms need to grow?`,
      options: [
        { id: 'a', text: 'Only plastic toys' },
        { id: 'b', text: 'Sunlight, water, and nutrients' },
        { id: 'c', text: 'Soda and candy bars' },
        { id: 'd', text: 'Batteries and wifi' }
      ],
      correct_option_id: 'b',
      hint_text: 'Remember what plants and animals need to thrive!',
      explanation: 'Fantastic! Sunlight, water, and natural nutrients help living things grow healthy and strong!',
      difficulty_level: 'easy'
    };
  }

  return {
    id: `q-gen-${Date.now()}`,
    daily_input_id: input.id,
    subject: input.subject,
    question: `What was the main topic in our ${input.subject} class today?`,
    options: [
      { id: 'a', text: input.topics_covered.slice(0, 35) },
      { id: 'b', text: 'Building rockets to Mars' },
      { id: 'c', text: 'Learning how to juggle' },
      { id: 'd', text: 'Cooking Italian pasta' }
    ],
    correct_option_id: 'a',
    hint_text: 'Check today\'s lesson title!',
    explanation: `Way to go! Today in ${input.subject} we learned all about ${input.topics_covered.slice(0, 40)}!`,
    difficulty_level: 'easy'
  };
}
