import type { Question } from '../../types';

/**
 * 確認問題の全体。
 *
 * **まだ 1 問もない。**9 章ぶんの空ファイルは揃っているので、
 * `src/data/questions/<章 ID>.ts` にそれぞれ書き足していく。
 * 1 ファイル 1 担当にしておくと、複数のエージェントを並行で走らせても衝突しない。
 * **教本を書き終えて、そのレビューを反映してから作ること。**
 *
 * 目安は**本番の 3 倍（105 問）**。入門編を除く全節にひも付ける（`sectionId` は必須）。
 */
/**
 * **★ まだ 1 問も書いていません。**
 *
 * **甲種は五肢択一。**`choices` は 5 要素、`answer` は 0〜4 です。
 * **教本を書いた側とは別の側が書くこと**（CLAUDE.md の「内容の正しさ」）。
 */
export const QUESTIONS: Question[] = [];

export const questionById = (id: string): Question | undefined => QUESTIONS.find((q) => q.id === id);

export const questionsOfCategory = (categoryId: string): Question[] =>
  QUESTIONS.filter((q) => q.categoryId === categoryId);

export const questionsOfSection = (sectionId: string): Question[] =>
  QUESTIONS.filter((q) => q.sectionId === sectionId);
