import { ClassRoom, DailyInput, MicroQuizQuestion } from './types';

export const INITIAL_CLASSES: ClassRoom[] = [
  { id: 'cls-g3a', grade_level: 3, section: 'A', teacher_name: 'Ms. Ramirez', school_name: 'Sunshine Elementary' },
  { id: 'cls-g1b', grade_level: 1, section: 'B', teacher_name: 'Mr. Davis', school_name: 'Sunshine Elementary' },
  { id: 'cls-g2a', grade_level: 2, section: 'A', teacher_name: 'Mrs. Patel', school_name: 'Sunshine Elementary' },
  { id: 'cls-g4c', grade_level: 4, section: 'C', teacher_name: 'Mr. Johnson', school_name: 'Sunshine Elementary' },
  { id: 'cls-g5a', grade_level: 5, section: 'A', teacher_name: 'Ms. Carter', school_name: 'Sunshine Elementary' },
];

export const INITIAL_DAILY_INPUTS: DailyInput[] = [
  {
    id: 'log-3a-1',
    class_id: 'cls-g3a',
    input_date: new Date().toISOString().split('T')[0],
    subject: 'Math',
    topics_covered: 'Introduction to Fractions. We learned about numerator (top number, parts we have) and denominator (bottom number, total equal parts). Used pizza slices to practice half (1/2) and quarter (1/4).',
    homework_assigned: 'Complete Workbook Page 42, Questions 1 to 5. Shade 1/2 of shape A and 3/4 of shape B. (Hint: count total equal pieces first!)',
    has_upcoming_test: true,
    test_details: 'Fractions & Basic Division Quick Test on Friday, Sep 18th.',
    vocabulary_tags: ['Numerator', 'Denominator', 'Fraction', 'Equal Parts']
  },
  {
    id: 'log-3a-2',
    class_id: 'cls-g3a',
    input_date: new Date().toISOString().split('T')[0],
    subject: 'Science',
    topics_covered: 'Plant Lifecycle and Photosynthesis basics. Plants need sunlight, water, carbon dioxide, and soil to make plant food (glucose) and release oxygen for humans.',
    homework_assigned: 'Draw the 4 main stages of a plant lifecycle (Seed, Sprout, Plant, Flower) in your science notebook. Label water and sunlight.',
    has_upcoming_test: false,
    vocabulary_tags: ['Photosynthesis', 'Lifecycle', 'Germination', 'Oxygen']
  },
  {
    id: 'log-3a-3',
    class_id: 'cls-g3a',
    input_date: new Date().toISOString().split('T')[0],
    subject: 'English',
    topics_covered: 'Action Verbs vs Describing Adjectives. Practiced identifying verbs in sentences (run, jump, think) and describing words (sunny, bright, cheerful).',
    homework_assigned: 'Write 3 sentences about your favorite animal. Circle the verbs and underline the adjectives.',
    has_upcoming_test: true,
    test_details: 'Parts of Speech Unit Quiz on Monday, Sep 21st.',
    vocabulary_tags: ['Action Verb', 'Adjective', 'Sentence Structure']
  },
  {
    id: 'log-1b-1',
    class_id: 'cls-g1b',
    input_date: new Date().toISOString().split('T')[0],
    subject: 'Math',
    topics_covered: 'Adding numbers up to 10 using counting blocks and finger counting. Practice grouping 5 and 5 to make 10.',
    homework_assigned: 'Worksheet 12: Color 10 apples red and count how many are left.',
    has_upcoming_test: false,
    vocabulary_tags: ['Addition', 'Sum', 'Count']
  },
  {
    id: 'log-5a-1',
    class_id: 'cls-g5a',
    input_date: new Date().toISOString().split('T')[0],
    subject: 'Science',
    topics_covered: 'Solar System & Gravitational Orbits. Studied the 8 planets in order from the Sun (Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune). Explained how Sun gravity keeps planets in orbit.',
    homework_assigned: 'Read Textbook pages 110-115. Write down 2 fun facts about Jupiter and Saturn.',
    has_upcoming_test: true,
    test_details: 'Astronomy & Solar System Chapter Test next Wednesday.',
    vocabulary_tags: ['Gravity', 'Orbit', 'Planets', 'Solar System']
  }
];

export const INITIAL_QUIZZES: MicroQuizQuestion[] = [
  {
    id: 'q-1',
    daily_input_id: 'log-3a-1',
    subject: 'Math',
    question: 'In the fraction 3/4, what does the bottom number (4) represent?',
    options: [
      { id: 'a', text: 'The numerator (parts we have)' },
      { id: 'b', text: 'The denominator (total equal parts)' },
      { id: 'c', text: 'The total number of pizzas' },
      { id: 'd', text: 'The answer to addition' }
    ],
    correct_option_id: 'b',
    hint_text: 'Think about what "down below" means! The bottom number tells us how many equal pieces the whole shape is split into.',
    explanation: 'Great job! The bottom number is called the denominator. It shows how many equal parts make up the whole!',
    difficulty_level: 'easy'
  },
  {
    id: 'q-2',
    daily_input_id: 'log-3a-1',
    subject: 'Math',
    question: 'If you have a pizza cut into 2 equal slices and eat 1 slice, what fraction of the pizza did you eat?',
    options: [
      { id: 'a', text: '1/4' },
      { id: 'b', text: '1/2' },
      { id: 'c', text: '2/2' },
      { id: 'd', text: '3/4' }
    ],
    correct_option_id: 'b',
    hint_text: 'You ate 1 part out of 2 total equal parts!',
    explanation: 'Awesome! 1 slice out of 2 total slices is 1/2 (one half)!',
    difficulty_level: 'easy'
  },
  {
    id: 'q-3',
    daily_input_id: 'log-3a-2',
    subject: 'Science',
    question: 'What process do plants use to make food using sunlight and water?',
    options: [
      { id: 'a', text: 'Hibernation' },
      { id: 'b', text: 'Photosynthesis' },
      { id: 'c', text: 'Germination' },
      { id: 'd', text: 'Evaporation' }
    ],
    correct_option_id: 'b',
    hint_text: 'It starts with "Photo" which means light!',
    explanation: 'Correct! Photosynthesis is the magical way green plants convert sunlight, water, and carbon dioxide into food and oxygen!',
    difficulty_level: 'medium'
  },
  {
    id: 'q-4',
    daily_input_id: 'log-3a-3',
    subject: 'English',
    question: 'Which word in this sentence is an action verb? "The happy dog jumped over the fence."',
    options: [
      { id: 'a', text: 'happy' },
      { id: 'b', text: 'dog' },
      { id: 'c', text: 'jumped' },
      { id: 'd', text: 'fence' }
    ],
    correct_option_id: 'c',
    hint_text: 'Which word shows an action that the dog is DOING?',
    explanation: 'Spot on! "Jumped" is an action verb because it shows what the dog did!',
    difficulty_level: 'easy'
  }
];
