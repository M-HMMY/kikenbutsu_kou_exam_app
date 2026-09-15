import { useState, type JSX } from 'react';

/**
 * 混載の可否（規則 別表第四）を引くツール。
 *
 * **6 × 6 の表を丸暗記しようとすると崩れる。**
 * 2 つの類を選んで ○ か × かを見ながら、
 * 「**酸化剤どうし（1 と 6）か、可燃物どうしか**」という理屈のほうを覚えてもらうための道具。
 *
 * ○ × は `docs/primary-numbers.md` の A-13（規則 別表第四）から写している。
 */

export const widgetId = 'konsai';

/** 規則 別表第四。allow[i][j] が true なら、第 (i+1) 類と第 (j+1) 類は混載してよい */
const ALLOW: boolean[][] = [
  // 1 類
  [false, false, false, false, false, true],
  // 2 類
  [false, false, false, true, true, false],
  // 3 類
  [false, false, false, true, false, false],
  // 4 類
  [false, true, true, false, true, false],
  // 5 類
  [false, true, false, true, false, false],
  // 6 類
  [true, false, false, false, false, false],
];

const NAMES = [
  '第 1 類（酸化性固体）',
  '第 2 類（可燃性固体）',
  '第 3 類（自然発火性・禁水性）',
  '第 4 類（引火性液体）',
  '第 5 類（自己反応性物質）',
  '第 6 類（酸化性液体）',
];

/** なぜその結論になるか。**丸暗記させないための一言** */
function reason(a: number, b: number): string {
  if (a === b) return '同じ類どうしなので、混載の表の出番はありません。';
  const oxidizer = (n: number): boolean => n === 0 || n === 5;
  if (oxidizer(a) && oxidizer(b)) {
    return '第 1 類と第 6 類は、どちらも酸化性です。酸化剤どうしなので混載できます。';
  }
  if (oxidizer(a) || oxidizer(b)) {
    return '一方が酸化剤（第 1 類・第 6 類）で、もう一方が可燃物です。この組合せは混載できません。';
  }
  if (ALLOW[a][b]) {
    return 'どちらも可燃物です。混載してよい組合せとして、規則 別表第四に ○ が付いています。';
  }
  return 'どちらも可燃物ですが、この組合せには ○ が付いていません。表のとおりに覚えてください。';
}

export default function KonsaiWidget(): JSX.Element {
  const [a, setA] = useState(3);
  const [b, setB] = useState(1);

  const allowed = a !== b && ALLOW[a][b];
  const same = a === b;

  return (
    <div className="widget-body">
      <p className="widget-lead">
        2 つの類を選ぶと、<strong>同じ車両に積んでよいか</strong>が分かります。
        <strong>混載してよいのは 5 組だけ</strong>です。
      </p>

      <div className="widget-row">
        <label className="widget-field">
          <span>積むもの 1</span>
          <select value={a} onChange={(e) => setA(Number(e.target.value))}>
            {NAMES.map((n, i) => (
              <option value={i} key={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <label className="widget-field">
          <span>積むもの 2</span>
          <select value={b} onChange={(e) => setB(Number(e.target.value))}>
            {NAMES.map((n, i) => (
              <option value={i} key={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className={'widget-result ' + (same ? 'tone-warn' : allowed ? 'tone-safe' : 'tone-danger')}>
        {same ? '同じ類どうし' : allowed ? '混載できます' : '混載できません'}
      </p>

      <p className="widget-note">{reason(a, b)}</p>

      <table className="widget-table">
        <thead>
          <tr>
            <th></th>
            {NAMES.map((_, i) => (
              <th key={i}>{i + 1} 類</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ALLOW.map((row, i) => (
            <tr key={i}>
              <th>{i + 1} 類</th>
              {row.map((ok, j) => (
                <td key={j} className={i === j ? undefined : ok ? 'hit' : 'miss'}>
                  {i === j ? '―' : ok ? '○' : '×'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <p className="widget-note">
        規則 別表第四のとおりです。混載してよいのは
        <strong>1 と 6／2 と 4／2 と 5／3 と 4／4 と 5</strong> の 5 組だけで、
        <strong>第 4 類がいちばん相手が多く、第 1 類と第 6 類は互いにしか組めません</strong>。
        なお<strong>この表は、指定数量の 10 分の 1 以下の危険物には適用されません</strong>。
      </p>
    </div>
  );
}
