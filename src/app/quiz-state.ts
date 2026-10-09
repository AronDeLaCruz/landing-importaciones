import { Injectable, signal } from '@angular/core';

export type QuizResult = {
  recommendation: string;
  type: string;
  answers: { question: string; answer: string }[];
};

@Injectable({ providedIn: 'root' })
export class QuizState {
  result = signal<QuizResult | null>(null);
}