import type { TextbookSection } from '../../types';

/**
 * 教本の全セクション。CATEGORIES の並び順に対応させる。
 *
 * **10 章ぶんのファイルは揃っている。**中身は入門編 4 節だけで、残り 9 章は空。
 * 1 章 1 ファイル（`src/data/textbook/<章 ID>.ts`）にしてあるので、
 * 複数のエージェントを並行で走らせても衝突しない。
 * **並びは `CATEGORIES` と同じ順にすること。**目次の表示順がここで決まる。
 */
/**
 * **★ まだ 1 節も書いていません。**
 *
 * 章立てを確定してから、章ごとのファイル（乙 4 版の `law-what.ts` のようなもの）を作って、
 * ここで読み込んで結合してください。書き方は CLAUDE.md の「節の書き方」。
 *
 * **本文は TypeScript のテンプレートリテラルの中にあります。**
 * バックスラッシュとバックティックの扱いに注意すること（CLAUDE.md の落とし穴の節）。
 */
export const SECTIONS: TextbookSection[] = [];

export const sectionById = (id: string): TextbookSection | undefined => SECTIONS.find((s) => s.id === id);

export const sectionsOfCategory = (categoryId: string): TextbookSection[] =>
  SECTIONS.filter((s) => s.categoryId === categoryId);

/** 教本全体の目安学習時間（分）。ホームと目次に出す */
export const totalMinutes = SECTIONS.reduce((sum, s) => sum + s.minutes, 0);
