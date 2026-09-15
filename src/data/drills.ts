/**
 * 計算ドリル：出題のたびに数値が変わる自動生成問題。
 *
 * 計算問題は同じ問題文を暗記してしまうと本番で崩れるため、
 * 値を振り直して「手順」だけが身に付くようにしている。
 * 生成した問題は復習カード（SRS）には登録しない（同じ問題が二度と現れないため）。
 *
 * **この試験には計算問題が出る。**「物理学及び化学」の科目に加えて、
 * **甲種では法令にも計算が出る**（指定数量の倍数、防油堤の容量）。
 * 公開問題 1 回分では、法令 2 問・物化 2 問が計算だった（`docs/public-questions.md`）。
 *
 * **試験会場で電卓は使えない。**だから四則演算だけで解ける形にしてある。
 * 桁も、暗算か筆算で追える範囲に収める。
 *
 * **物性値をこちらで決め打ちしない。**比熱も反応式も、問題文の中で与えている。
 * 実在の物質の値を書くと `docs/primary-numbers.md` の裏づけが要るうえ、
 * 出典によって値が違う（同 B 節を参照）。**ドリルは手順の練習なので、値は与えてよい。**
 * **ただし指定数量だけは法令の値**なので、同 A-5 の表から取っている。
 *
 * 手順で必ず解けるものに絞ること。有効数字や単位の扱いで割れる問題は、
 * 自動生成すると答えが一意にならない。
 */

export interface DrillItem {
  question: string;
  choices: string[];
  answer: number;
  /** 計算手順の解説 */
  explanation: string;
}

export interface Drill {
  id: string;
  name: string;
  categoryId: string;
  sectionId: string;
  summary: string;
  generate: () => DrillItem;
}

// ---------------------------------------------------------------- 補助関数

const rnd = (min: number, max: number): number => min + Math.floor(Math.random() * (max - min + 1));

/** 選択肢や条件をランダムに 1 つ選ぶ。新しいドリルを書くときに使う */
export function pick<T>(items: readonly T[]): T {
  return items[rnd(0, items.length - 1)];
}

/** 小数を読みやすく整える（末尾の 0 を落とす）。新しいドリルを書くときに使う */
export function fx(n: number, digits = 2): string {
  return Number(n.toFixed(digits)).toString();
}

/**
 * 正解と誤答候補から 5 択を作る。重複は除き、足りなければ補充関数で埋める。
 *
 * **5 択なのは、この試験が五肢択一式だから。**姉妹アプリは四肢択一で 4 択だった。
 * 本番と選択肢の数が違うと、消去法の手応えが変わってしまう。
 */
function build(
  correct: string,
  wrongs: string[],
  fallback?: (i: number) => string,
): { choices: string[]; answer: number } {
  const pool: string[] = [];
  for (const w of wrongs) {
    if (w !== correct && !pool.includes(w)) pool.push(w);
    if (pool.length === 4) break;
  }
  for (let i = 1; pool.length < 4 && i < 80; i++) {
    const extra = fallback ? fallback(i) : String(i);
    if (extra !== correct && !pool.includes(extra)) pool.push(extra);
  }
  const all = [correct, ...pool];
  for (let j = all.length - 1; j > 0; j--) {
    const k = rnd(0, j);
    [all[j], all[k]] = [all[k], all[j]];
  }
  return { choices: all, answer: all.indexOf(correct) };
}

/**
 * 数値の 5 択。ありがちな誤答を先に使い、足りない分は倍率でずらして作る。
 * 正解が 0 や負になりうる問題では倍率では埋まらないので、build に自前の
 * 補充関数を渡すこと（npm run check が「選択肢が 2 個になる」で捕まえる）。
 */
export function buildNumeric(
  correct: number,
  fmt: (n: number) => string,
  mistakes: number[],
): { choices: string[]; answer: number } {
  const wrongs = mistakes.filter((n) => Number.isFinite(n) && n >= 0).map(fmt);
  const factors = [2, 0.5, 1.5, 0.8, 1.25, 3, 0.25, 1.1, 0.9, 1.4, 0.6];
  let fi = 0;
  return build(fmt(correct), wrongs, () => fmt(correct * factors[fi++ % factors.length]));
}

/**
 * 計算ドリル。**5 種類**（2026 年 9 月 15 日）。
 *
 * 法令から 2 つ（指定数量の倍数・防油堤）、物化から 3 つ
 * （化学反応式と物質量・混合気体の全圧・熱量）。
 * **分圧と化学反応式の量的関係は、乙 4 版には無かった単元である。**
 */
export const DRILLS: Drill[] = [
  {
    id: 'drill-bairitsu',
    name: '指定数量の倍数',
    categoryId: 'law-what',
    sectionId: 'lw-4',
    summary: '品名の違う危険物が混ざったときの倍数を、商の和で求める',
    generate: () => {
      // 指定数量は政令別表第三（docs/primary-numbers.md A-5）から取っている。
      // **類をまたいで出す。**kg と L が混ざっても倍数は足せる、というのがこの試験の要点。
      const items = [
        { name: 'ガソリン', unit: 'L', base: 200 },
        { name: '灯油', unit: 'L', base: 1000 },
        { name: '軽油', unit: 'L', base: 1000 },
        { name: '重油', unit: 'L', base: 2000 },
        { name: 'シリンダー油', unit: 'L', base: 6000 },
        { name: 'アセトン', unit: 'L', base: 400 },
        { name: '硫黄', unit: 'kg', base: 100 },
        { name: '赤りん', unit: 'kg', base: 100 },
        { name: '鉄粉', unit: 'kg', base: 500 },
        { name: '黄りん', unit: 'kg', base: 20 },
        { name: '硝酸', unit: 'kg', base: 300 },
      ];
      const a = pick(items);
      let b = pick(items);
      while (b.name === a.name) b = pick(items);
      const ma = rnd(2, 8);
      const mb = rnd(2, 8);
      const qa = a.base * ma;
      const qb = b.base * mb;
      const correct = ma + mb;
      const { choices, answer } = buildNumeric(
        correct,
        (n) => fx(n, 1) + ' 倍',
        // ありがちな誤り: 積をとる、片方だけ、差をとる
        [ma * mb, ma, mb, Math.abs(ma - mb)],
      );
      return {
        question:
          a.name + ' ' + qa.toLocaleString() + ' ' + a.unit + ' と ' +
          b.name + ' ' + qb.toLocaleString() + ' ' + b.unit +
          ' を同一の場所で貯蔵している。指定数量の倍数はいくらか。',
        choices,
        answer,
        explanation:
          a.name + 'の指定数量は ' + a.base.toLocaleString() + ' ' + a.unit + ' なので ' +
          qa.toLocaleString() + ' ÷ ' + a.base.toLocaleString() + ' ＝ ' + ma + '。' +
          b.name + 'は ' + b.base.toLocaleString() + ' ' + b.unit + ' なので ' +
          qb.toLocaleString() + ' ÷ ' + b.base.toLocaleString() + ' ＝ ' + mb + '。' +
          '倍数は商の和なので ' + ma + ' ＋ ' + mb + ' ＝ ' + correct + ' 倍。掛けるのではなく足す。' +
          '単位が違っていても、倍数は単位のない数なので足せる。',
      };
    },
  },
  {
    id: 'drill-bouyutei',
    name: '防油堤の容量',
    categoryId: 'law-rule',
    sectionId: 'lr-2',
    summary: '屋外貯蔵タンクの防油堤は、最大タンクの 110 %。合計ではない',
    generate: () => {
      const n = pick([2, 3, 3, 4]);
      const caps: number[] = [];
      for (let i = 0; i < n; i++) caps.push(rnd(1, 9) * 10000);
      // 最大が 2 つあると「最大のタンク」が一意でなくなるので、必ず 1 つだけ突出させる
      const max = Math.max(...caps) + 10000;
      caps[rnd(0, caps.length - 1)] = max;
      const total = caps.reduce((x, y) => x + y, 0);
      const correct = max * 1.1;
      const { choices, answer } = buildNumeric(
        correct,
        (v) => Math.round(v).toLocaleString() + ' L',
        // ありがちな誤り: 合計の 110 %、合計そのもの、最大そのもの、最大の 50 %
        [total * 1.1, total, max, max * 0.5],
      );
      return {
        question:
          '容量が ' + caps.map((c) => c.toLocaleString() + ' L').join('、') +
          ' の ' + n + ' 基の屋外貯蔵タンクを同一敷地内に隣接して設置し、これらが共用する防油堤を造る。' +
          '法令上、必要な防油堤の最低限の容量はいくらか。',
        choices,
        answer,
        explanation:
          '2 以上の屋外貯蔵タンクが共用する防油堤の容量は、容量が最大であるタンクの容量の 110 % 以上（規則第 22 条）。' +
          '最大は ' + max.toLocaleString() + ' L なので ' + max.toLocaleString() + ' × 1.1 ＝ ' +
          Math.round(correct).toLocaleString() + ' L。' +
          '合計（' + total.toLocaleString() + ' L）を基準にしないこと。同時に全基が壊れることは想定していない。',
      };
    },
  },
  {
    id: 'drill-mol',
    name: '化学反応式と物質量',
    categoryId: 'sci-base',
    sectionId: 'sb-4',
    summary: '反応式の係数から、必要な酸素の物質量と体積を出す',
    generate: () => {
      // 反応式は問題文の中で与える。係数を読ませるのが目的なので、物性値は要らない。
      const fuels = [
        { name: 'メタン', formula: 'CH4', eq: 'CH4 ＋ 2 O2 → CO2 ＋ 2 H2O', ratio: 2 },
        { name: 'エタン', formula: 'C2H6', eq: '2 C2H6 ＋ 7 O2 → 4 CO2 ＋ 6 H2O', ratio: 3.5 },
        { name: 'プロパン', formula: 'C3H8', eq: 'C3H8 ＋ 5 O2 → 3 CO2 ＋ 4 H2O', ratio: 5 },
        { name: 'メタノール', formula: 'CH3OH', eq: '2 CH3OH ＋ 3 O2 → 2 CO2 ＋ 4 H2O', ratio: 1.5 },
        { name: 'エタノール', formula: 'C2H5OH', eq: 'C2H5OH ＋ 3 O2 → 2 CO2 ＋ 3 H2O', ratio: 3 },
      ];
      const f = pick(fuels);
      const mol = rnd(2, 6);
      const oxygen = f.ratio * mol;
      const correct = oxygen * 22.4;
      const { choices, answer } = buildNumeric(
        correct,
        (n) => fx(n, 1) + ' L',
        // ありがちな誤り: 燃料の物質量で計算する、係数の比だけで計算する、22.4 を掛け忘れる
        [mol * 22.4, f.ratio * 22.4, oxygen, correct / 2],
      );
      return {
        question:
          f.name + ' ' + f.formula + ' ' + mol +
          ' mol が完全燃焼するとき、消費される酸素の 0 ℃・1 気圧における体積はいくらか。' +
          'ただし 0 ℃・1 気圧における気体 1 mol の体積は 22.4 L とし、反応式は ' + f.eq + ' とする。',
        choices,
        answer,
        explanation:
          '反応式の係数は、そのまま物質量の比を表す。この式では ' + f.name + ' 1 mol に対して酸素 ' +
          fx(f.ratio, 1) + ' mol が反応するので、' + mol + ' mol では ' + fx(f.ratio, 1) + ' × ' + mol + ' ＝ ' +
          fx(oxygen, 1) + ' mol。体積は ' + fx(oxygen, 1) + ' × 22.4 ＝ ' + fx(correct, 1) + ' L。' +
          'この問題は 0 ℃なので温度の換算は要らない。別の温度を指定されたときだけ、絶対温度の比を掛ける。',
      };
    },
  },
  {
    id: 'drill-bunatsu',
    name: '混合気体の全圧',
    categoryId: 'sci-base',
    sectionId: 'sb-5',
    summary: 'ボイルの法則で分圧を出し、足して全圧にする',
    generate: () => {
      const v = pick([10, 20, 30, 40, 50]);
      // 分圧が整数になる組合せだけを作る（圧力 × 体積 が容積の整数倍になるようにする）
      const p1 = rnd(1, 6);
      const k1 = rnd(1, 4);
      const v1 = (v * k1) / p1;
      const p2 = rnd(1, 6);
      const k2 = rnd(1, 4);
      const v2 = (v * k2) / p2;
      const correct = k1 + k2;
      const { choices, answer } = buildNumeric(
        correct,
        (n) => fx(n, 2) + ' 気圧',
        // ありがちな誤り: もとの圧力を足す、片方の分圧だけ、分圧の積
        [p1 + p2, k1, k2, k1 * k2],
      );
      return {
        question:
          '温度一定の条件下で、容積 ' + v + ' L の容器に、' + p1 + ' 気圧の酸素 ' + fx(v1, 2) + ' L と ' +
          p2 + ' 気圧の窒素 ' + fx(v2, 2) + ' L を入れた。混合気体の全圧はいくらか。' +
          'ただし、酸素と窒素は互いに反応せず、いずれも理想気体として挙動するものとする。',
        choices,
        answer,
        explanation:
          '温度が一定なら圧力 × 体積は一定（ボイルの法則）。' +
          '酸素は ' + p1 + ' × ' + fx(v1, 2) + ' ＝ ' + fx(p1 * v1, 2) + ' なので、' + v + ' L の容器では ' +
          fx(p1 * v1, 2) + ' ÷ ' + v + ' ＝ ' + fx(k1, 2) + ' 気圧。' +
          '窒素は ' + p2 + ' × ' + fx(v2, 2) + ' ＝ ' + fx(p2 * v2, 2) + ' なので ' + fx(k2, 2) + ' 気圧。' +
          '全圧は分圧の和なので ' + fx(k1, 2) + ' ＋ ' + fx(k2, 2) + ' ＝ ' + fx(correct, 2) + ' 気圧。',
      };
    },
  },
  {
    id: 'drill-netsuryou',
    name: '熱量',
    categoryId: 'sci-base',
    sectionId: 'sb-1',
    summary: '熱量 ＝ 質量 × 比熱 × 温度差',
    generate: () => {
      // 比熱は問題文の中で与える。実在の物質の値を断定しないための作りにしてある。
      const mass = rnd(1, 9) * 100;
      const heat = pick([0.4, 0.5, 0.8, 1.0, 2.0, 2.5, 4.2]);
      const t1 = rnd(0, 4) * 5;
      const t2 = t1 + rnd(2, 12) * 5;
      const correct = mass * heat * (t2 - t1);
      const { choices, answer } = buildNumeric(
        correct,
        (n) => Math.round(n).toLocaleString() + ' J',
        // ありがちな誤り: 温度差ではなく到達温度を掛ける、比熱を掛け忘れる、質量を掛け忘れる
        [mass * heat * t2, mass * (t2 - t1), heat * (t2 - t1), correct / 2],
      );
      return {
        question:
          'ある液体 ' + mass.toLocaleString() + ' g を ' + t1 + ' ℃から ' + t2 +
          ' ℃まで温めるのに必要な熱量はいくらか。ただし、この液体の比熱は ' + fx(heat, 1) +
          ' J/(g・℃) とし、熱の損失はないものとする。',
        choices,
        answer,
        explanation:
          '熱量 ＝ 質量 × 比熱 × 温度差。温度差は ' + t2 + ' − ' + t1 + ' ＝ ' + (t2 - t1) + ' ℃なので、' +
          mass.toLocaleString() + ' × ' + fx(heat, 1) + ' × ' + (t2 - t1) + ' ＝ ' +
          Math.round(correct).toLocaleString() + ' J。' +
          '掛けるのは温度差であって、到達温度ではない。',
      };
    },
  },
];

export const drillById = (id: string): Drill | undefined => DRILLS.find((d) => d.id === id);
