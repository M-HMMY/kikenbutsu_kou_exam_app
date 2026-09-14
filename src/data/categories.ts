import type { Category, FieldId } from '../types';

/**
 * 分野と章の定義。
 *
 * **分野（`FIELDS`）は公式の試験科目そのもの。**危険物取扱者試験（甲種）の科目は
 * 「危険物に関する法令」15 問／「物理学及び化学」10 問／
 * 「危険物の性質並びにその火災予防及び消火の方法」20 問の 3 科目で、**合計 45 問**。
 * 問題数は消防試験研究センターが公表しているので、**模試の構成比は推定値ではなく実数**である。
 *
 * **乙種と科目名が違うところに意味がある。**乙種は「**基礎的な**物理学及び**基礎的な**化学」だが、
 * 甲種は「物理学及び化学」で、「基礎的な」が付かない。**同じ 10 問でも深さが違う。**
 *
 * **性消が 20 問あるのは、甲種が全 6 類を扱うから。**乙種第 4 類は第 4 類だけで 10 問だった。
 * ここが乙 4 版から最も大きく変わる部分で、章の数もここがいちばん多くなるはず。
 *
 * **章（`CATEGORIES`）は仮置きである。**
 * この試験にもシラバスにあたる詳細な出題範囲の公表がないので、
 * 消防法・政令・規則と公開問題から自前で起こす必要がある（`docs/syllabus.md`）。
 * **出題範囲を洗い出してから、この並びを確定すること。**
 * 章を足す・減らすときは、先に `docs/section-plan.md` を直す。
 *
 * `questions` は章ごとの目安の出題数で、科目の問題数を章へ割ったもの。
 * **科目の合計（15 / 10 / 20）は公表値だが、章への割り方はこちらの見立て。**
 */
export const FIELDS: { id: FieldId; name: string; note: string; questions: number }[] = [
  {
    id: 'intro',
    name: '入門編',
    note: '試験の形、受験資格、3 科目それぞれで 6 割を取る必要があること、法令用語の読み方をここでそろえる',
    questions: 0,
  },
  {
    id: 'law',
    name: '危険物に関する法令',
    note: '消防法別表による危険物の分類、指定数量、製造所等の区分と手続、危険物取扱者と保安体制、貯蔵・取扱い・運搬の基準。乙種と同じ 15 問だが、全 6 類を扱うぶん問われ方が広い',
    questions: 15,
  },
  {
    id: 'science',
    name: '物理学及び化学',
    note: '乙種の「基礎的な物理学及び基礎的な化学」から「基礎的な」が外れる科目。物質の状態、熱、反応速度と化学平衡、酸化還元と電気化学、有機化学、燃焼と消火の理論。計算問題が出る',
    questions: 10,
  },
  {
    id: 'property',
    name: '危険物の性質並びにその火災予防及び消火の方法',
    note: '第 1 類から第 6 類までの全類が対象。45 問中 20 問で最も配点が大きく、乙種第 4 類（10 問・第 4 類のみ）から最も大きく変わる科目',
    questions: 20,
  },
];

/**
 * 章。
 *
 * **★ この並びは仮置きです。**出題範囲の洗い出し（`docs/syllabus.md`）が終わるまで、
 * 確定したものとして扱わないでください。
 *
 * いまは**科目の構造をそのまま章にしただけ**で、根拠は次の 2 つしかありません。
 *
 * - 科目ごとの問題数は公表値（法令 15 / 物化 10 / 性消 20）
 * - 性消は第 1 類〜第 6 類が対象（消防法別表第一）
 *
 * **章ごとの `questions` は見立てです。**とくに性消の類ごとの配分は、
 * 公開問題を分析して、どの類が何問出ているかを確かめてから直してください。
 */
export const CATEGORIES: Category[] = [
  {
    id: 'intro',
    field: 'intro',
    name: 'はじめに',
    summary: '試験の形と、この教本の使い方',
    syllabus: '範囲外',
    questions: 0,
    intro:
      '**この章は試験範囲ではありません。**読み始める前に、試験の形と、この教本の歩き方をそろえるための章です。\n\nいちばん先に知っておいてほしいのは、**3 科目それぞれで 6 割を取らないと合格にならない**ことです。合計点ではありません。得意な科目で稼いでも、どれか 1 科目が 6 割を切れば不合格になります。',
  },

  // ---- 危険物に関する法令（本番 15 問）----
  // 法令は乙種と同じ条文が対象。ただし甲種は全 6 類を扱うので、
  // 指定数量・危険等級・混載・消火設備の適応が「第 4 類だけ」では済まない。
  {
    id: 'law-what',
    field: 'law',
    name: '危険物とは何か',
    summary: '消防法が「危険物」と呼ぶものと、指定数量',
    syllabus: '★未確定',
    questions: 4,
    intro: '**仮置きの章です。**`docs/syllabus.md` を起こしてから書き直してください。',
  },
  {
    id: 'law-place',
    field: 'law',
    name: '製造所等と手続',
    summary: '製造所等の区分と、許可・承認・認可・届出',
    syllabus: '★未確定',
    questions: 4,
    intro: '**仮置きの章です。**`docs/syllabus.md` を起こしてから書き直してください。',
  },
  {
    id: 'law-people',
    field: 'law',
    name: '危険物取扱者と保安体制',
    summary: '免状の種類と、保安に関する役職',
    syllabus: '★未確定',
    questions: 4,
    intro: '**仮置きの章です。**`docs/syllabus.md` を起こしてから書き直してください。',
  },
  {
    id: 'law-rule',
    field: 'law',
    name: '施設の基準・運搬・消火設備',
    summary: '位置・構造・設備の基準、貯蔵と運搬、消火設備と警報設備',
    syllabus: '★未確定',
    questions: 3,
    intro: '**仮置きの章です。**`docs/syllabus.md` を起こしてから書き直してください。',
  },

  // ---- 物理学及び化学（本番 10 問）----
  // **乙種の「基礎的な」が外れる科目。**反応速度・化学平衡・電気化学まで入るかどうかを
  // 出題範囲の洗い出しで確かめること。ここを乙 4 版のまま作ると足りない。
  {
    id: 'sci-base',
    field: 'science',
    name: '物理と化学の基礎',
    summary: '物質の状態、熱、密度と濃度、化学反応',
    syllabus: '★未確定',
    questions: 5,
    intro: '**仮置きの章です。**`docs/syllabus.md` を起こしてから書き直してください。',
  },
  {
    id: 'sci-burn',
    field: 'science',
    name: '燃焼の理論',
    summary: '燃焼の要素と形式、引火点・発火点、燃焼範囲',
    syllabus: '★未確定',
    questions: 3,
    intro: '**仮置きの章です。**`docs/syllabus.md` を起こしてから書き直してください。',
  },
  {
    id: 'sci-stop',
    field: 'science',
    name: '消火の理論と静電気',
    summary: '消火の方法、消火剤のはたらき、静電気',
    syllabus: '★未確定',
    questions: 2,
    intro: '**仮置きの章です。**`docs/syllabus.md` を起こしてから書き直してください。',
  },

  // ---- 危険物の性質並びにその火災予防及び消火の方法（本番 20 問）----
  // **ここが乙 4 版から最も大きく変わる。**第 4 類だけの 10 問から、全 6 類の 20 問へ。
  // いまは「全般 + 類ごと 6 章」に割ってあるが、**類ごとの配分は見立てにすぎない。**
  {
    id: 'prop-common',
    field: 'property',
    name: '危険物全般に共通すること',
    summary: '6 つの類の性質の違いと、類をまたいで問われること',
    syllabus: '★未確定',
    questions: 2,
    intro: '**仮置きの章です。**`docs/syllabus.md` を起こしてから書き直してください。',
  },
  {
    id: 'prop-1',
    field: 'property',
    name: '第 1 類（酸化性固体）',
    summary: 'それ自体は燃えないが、ほかの燃焼を助ける固体',
    syllabus: '★未確定',
    questions: 3,
    intro: '**仮置きの章です。**`docs/syllabus.md` を起こしてから書き直してください。',
  },
  {
    id: 'prop-2',
    field: 'property',
    name: '第 2 類（可燃性固体）',
    summary: '燃えやすい固体。硫黄、赤りん、金属粉など',
    syllabus: '★未確定',
    questions: 3,
    intro: '**仮置きの章です。**`docs/syllabus.md` を起こしてから書き直してください。',
  },
  {
    id: 'prop-3',
    field: 'property',
    name: '第 3 類（自然発火性・禁水性）',
    summary: '空気や水に触れると危険な物質',
    syllabus: '★未確定',
    questions: 3,
    intro: '**仮置きの章です。**`docs/syllabus.md` を起こしてから書き直してください。',
  },
  {
    id: 'prop-4',
    field: 'property',
    name: '第 4 類（引火性液体）',
    summary: 'ガソリン・灯油など。品名ごとの性質',
    syllabus: '★未確定',
    questions: 4,
    intro: '**仮置きの章です。**`docs/syllabus.md` を起こしてから書き直してください。',
  },
  {
    id: 'prop-5',
    field: 'property',
    name: '第 5 類（自己反応性物質）',
    summary: '自分の中で反応が進み、急激に熱を出す物質',
    syllabus: '★未確定',
    questions: 3,
    intro: '**仮置きの章です。**`docs/syllabus.md` を起こしてから書き直してください。',
  },
  {
    id: 'prop-6',
    field: 'property',
    name: '第 6 類（酸化性液体）',
    summary: 'それ自体は燃えないが、ほかの燃焼を助ける液体',
    syllabus: '★未確定',
    questions: 2,
    intro: '**仮置きの章です。**`docs/syllabus.md` を起こしてから書き直してください。',
  },
];

/**
 * 用語ミニ辞典の節 ID。教本の各節から「分からない語はここ」と案内するために使う。
 * 節の並びを変えるときはこの定数も一緒に直すこと（画面側は直接 id を持たない）。
 *
 * **この節はまだ無い。**入門編を書くときに作ること。
 *
 * **甲種は受験資格があるので、乙 4 版ほど手厚い辞典は要らないかもしれません。**
 * 読者を決める段階（CLAUDE.md の「読者を誰に置くか」）で判断してください。
 */
export const GLOSSARY_SECTION_ID = 'i-4';

/**
 * 計算の解き方を説明する節の ID。解説から飛ばすのに使う。
 *
 * **この節もまだ無い。**
 */
export const MATH_SECTION_ID = 'i-3';

export const categoryById = (id: string): Category | undefined => CATEGORIES.find((c) => c.id === id);

export const categoryName = (id: string): string => categoryById(id)?.name ?? id;

export const categoriesOfField = (field: FieldId): Category[] => CATEGORIES.filter((c) => c.field === field);

/** 分野の表示名 */
export const fieldName = (id: FieldId): string => FIELDS.find((f) => f.id === id)?.name ?? id;

/** 章 ID から分野 ID を引く。模試の科目別集計に使う */
export function fieldOfCategory(categoryId: string): FieldId | undefined {
  return categoryById(categoryId)?.field;
}

/** 本番の出題数（45 問）。法令 15 + 物理学及び化学 10 + 性質・火災予防・消火 20 */
export const EXAM_QUESTIONS = 45;

/**
 * 本番の試験時間（分）。**2 時間 30 分。**
 *
 * 45 問を 150 分なので、**1 問あたり 3 分 20 秒。**
 * 乙種（35 問 / 120 分＝約 3 分 26 秒）とほぼ同じペースで、
 * **問題数が増えたぶんだけ時間も増えている。**急かされる試験ではない。
 */
export const EXAM_MINUTES = 150;

/**
 * 合格基準。**この試験は合格基準が公表されている。**
 * 「試験科目ごとの成績が、それぞれ 60 % 以上」（消防試験研究センター）。
 *
 * 甲種で必要な正解数は **法令 9 問 / 物化 6 問 / 性消 12 問。**
 *
 * **姉妹アプリとここが決定的に違う。**生成AIパスポートや G 検定は合格基準が非公表なので、
 * アプリが合否を断定しない方針を採っていた。この試験は公表されているので、
 * **科目ごとに 6 割を満たしているかを出してよい。**
 *
 * ただし出してよいのは「**この模試の結果が基準を満たすか**」までである。
 * 本番の合否を予想するものではないし、収録した問題は本番ではない。
 *
 * **なお、甲種に科目免除はありません**（消防試験研究センターのよくある質問 Q16「ありません。」）。
 * 乙種版にあった「科目免除」の模試形式は、この版には入れていない。
 */
export const PASS_RATIO = 0.6;
