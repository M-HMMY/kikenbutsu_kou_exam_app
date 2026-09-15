import type { TextbookSection } from '../../types';
import { intro } from './intro';
import { lawWhat } from './law-what';
import { lawPlace } from './law-place';
import { lawPeople } from './law-people';
import { lawRule } from './law-rule';
import { sciBase } from './sci-base';
import { sciBurn } from './sci-burn';
import { sciStop } from './sci-stop';
import { propCommon } from './prop-common';
import { prop1 } from './prop-1';
import { prop2 } from './prop-2';
import { prop3 } from './prop-3';
import { prop4 } from './prop-4';
import { prop5 } from './prop-5';
import { prop6 } from './prop-6';

/**
 * 教本の全セクション。CATEGORIES の並び順に対応させる。
 *
 * 1 章 1 ファイル（`src/data/textbook/<章 ID>.ts`）にしてあるので、
 * 複数のエージェントを並行で走らせても衝突しない。
 * **並びは `CATEGORIES` と同じ順にすること。**目次の表示順がここで決まる。
 *
 * **節割りは `docs/section-plan.md` で確定している（全 50 節）。**
 * 節を足す・減らすときは、先にあちらを直すこと。
 */
export const SECTIONS: TextbookSection[] = [...intro, ...lawWhat, ...lawPlace, ...lawPeople, ...lawRule, ...sciBase, ...sciBurn, ...sciStop, ...propCommon, ...prop1, ...prop2, ...prop3, ...prop4, ...prop5, ...prop6];

export const sectionById = (id: string): TextbookSection | undefined => SECTIONS.find((s) => s.id === id);

export const sectionsOfCategory = (categoryId: string): TextbookSection[] =>
  SECTIONS.filter((s) => s.categoryId === categoryId);

/** 教本全体の目安学習時間（分）。ホームと目次に出す */
export const totalMinutes = SECTIONS.reduce((sum, s) => sum + s.minutes, 0);
