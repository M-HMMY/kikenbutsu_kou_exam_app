import type { Question } from '../../types';
import { lawWhatQuestions } from './law-what';
import { lawPlaceQuestions } from './law-place';
import { lawPeopleQuestions } from './law-people';
import { lawRuleQuestions } from './law-rule';
import { sciBaseQuestions } from './sci-base';
import { sciBurnQuestions } from './sci-burn';
import { sciStopQuestions } from './sci-stop';
import { propCommonQuestions } from './prop-common';
import { prop1Questions } from './prop-1';
import { prop2Questions } from './prop-2';
import { prop3Questions } from './prop-3';
import { prop4Questions } from './prop-4';
import { prop5Questions } from './prop-5';
import { prop6Questions } from './prop-6';

/**
 * 確認問題の全体。
 *
 * **甲種は五肢択一。**`choices` は 5 要素、`answer` は 0〜4。
 * 1 ファイル 1 章にしてあるので、複数のエージェントを並行で走らせても衝突しない。
 *
 * **数は本番の 3 倍（135 問）。**章ごとの割り当ては `docs/section-plan.md` にある。
 * **入門編（intro）には問題を付けない。**試験範囲外だからである。
 *
 * **すべて自前で書き起こしたもの。**消防試験研究センターの公開問題は、
 * 利用条件により逐語では収録できない（`docs/public-questions.md`）。
 */
export const QUESTIONS: Question[] = [
  ...lawWhatQuestions,
  ...lawPlaceQuestions,
  ...lawPeopleQuestions,
  ...lawRuleQuestions,
  ...sciBaseQuestions,
  ...sciBurnQuestions,
  ...sciStopQuestions,
  ...propCommonQuestions,
  ...prop1Questions,
  ...prop2Questions,
  ...prop3Questions,
  ...prop4Questions,
  ...prop5Questions,
  ...prop6Questions,
];

export const questionById = (id: string): Question | undefined => QUESTIONS.find((q) => q.id === id);

export const questionsOfCategory = (categoryId: string): Question[] =>
  QUESTIONS.filter((q) => q.categoryId === categoryId);

export const questionsOfSection = (sectionId: string): Question[] =>
  QUESTIONS.filter((q) => q.sectionId === sectionId);
