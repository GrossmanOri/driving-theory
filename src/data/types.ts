export interface Topic {
  id: string;
  name: string;
  icon: string; // emoji used on the topic map
}

export interface Option {
  id: string;
  text: string;
  correct: boolean;
}

export interface Question {
  id: string;
  topicId: string;
  /** Road sign / image. The seed uses inline SVG data-URIs. */
  imageUrl?: string;
  text: string;
  options: Option[];
  /** Short, human, eye-level explanation — not legalese. */
  explanation: string;
  difficulty?: 1 | 2 | 3;
}

/** A lesson is simply a group of 5 questions from one topic. */
export const LESSON_SIZE = 5;
