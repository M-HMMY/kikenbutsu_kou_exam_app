import { useState, type JSX } from 'react';

/**
 * 指定数量の倍数を、品名と量を変えながら確かめるツール。
 *
 * **甲種版は全 6 類を並べてある。**乙 4 版は第 4 類だけだったので、
 * 単位はすべて L で済んでいた。**甲種では kg と L が混ざる**ので、
 * 「単位が違っても倍数は足せる」という一点を、手を動かして確かめられるようにした。
 *
 * 指定数量は `docs/primary-numbers.md` の A-5（政令 別表第三）。
 * **法令の値なので断定してよい。**物性値と違って出典が割れていない。
 */

export const widgetId = 'baisu';

interface Item {
  /** 表示名 */
  name: string;
  /** 指定数量 */
  amount: number;
  /** 単位。**第 4 類だけが L で、ほかの 5 類は kg** */
  unit: 'L' | 'kg';
  /** 何類か。選ぶときの手がかりに出す */
  group: string;
}

/** 全 6 類の区分と指定数量（政令 別表第三）。代表物質は覚えやすさのために添えている */
const ITEMS: Item[] = [
  { name: '第一種酸化性固体', amount: 50, unit: 'kg', group: '第 1 類' },
  { name: '第二種酸化性固体', amount: 300, unit: 'kg', group: '第 1 類' },
  { name: '第三種酸化性固体', amount: 1000, unit: 'kg', group: '第 1 類' },
  { name: '硫黄・赤りん・硫化りん', amount: 100, unit: 'kg', group: '第 2 類' },
  { name: '鉄粉', amount: 500, unit: 'kg', group: '第 2 類' },
  { name: '引火性固体', amount: 1000, unit: 'kg', group: '第 2 類' },
  { name: 'カリウム・ナトリウム', amount: 10, unit: 'kg', group: '第 3 類' },
  { name: '黄りん', amount: 20, unit: 'kg', group: '第 3 類' },
  { name: '第二種自然発火性物質及び禁水性物質', amount: 50, unit: 'kg', group: '第 3 類' },
  { name: '特殊引火物', amount: 50, unit: 'L', group: '第 4 類' },
  { name: '第 1 石油類（非水溶性）', amount: 200, unit: 'L', group: '第 4 類' },
  { name: '第 1 石油類（水溶性）・アルコール類', amount: 400, unit: 'L', group: '第 4 類' },
  { name: '第 2 石油類（非水溶性）', amount: 1000, unit: 'L', group: '第 4 類' },
  { name: '第 3 石油類（非水溶性）', amount: 2000, unit: 'L', group: '第 4 類' },
  { name: '第 4 石油類', amount: 6000, unit: 'L', group: '第 4 類' },
  { name: '動植物油類', amount: 10000, unit: 'L', group: '第 4 類' },
  { name: '第一種自己反応性物質', amount: 10, unit: 'kg', group: '第 5 類' },
  { name: '第二種自己反応性物質', amount: 100, unit: 'kg', group: '第 5 類' },
  { name: '第 6 類のすべて', amount: 300, unit: 'kg', group: '第 6 類' },
];

interface Row {
  itemIndex: number;
  volume: number;
}

/**
 * 小数を読みやすく整える（末尾の 0 を落とす）。
 *
 * **1 未満の値を「1」と表示しないこと。**
 * この画面は「倍数が 1 以上かどうか」で結論が変わるので、
 * 素朴に 3 桁で丸めると 0.9999 が「1 倍」と出て、
 * 下の判定（指定数量未満）と矛盾して見える。
 * **境目をまたぐ側だけ、桁を増やして正直に出す。**
 */
const fx = (n: number): string => {
  const rounded = Number(n.toFixed(3));
  if (n < 1 && rounded >= 1) return Number(n.toFixed(6)).toString();
  if (n >= 1 && rounded < 1) return Number(n.toFixed(6)).toString();
  return rounded.toString();
};

export default function BaisuWidget(): JSX.Element {
  // 初期値は「kg と L が混ざる」形にしておく。甲種でつまずくのはここなので。
  const [rows, setRows] = useState<Row[]>([
    { itemIndex: 3, volume: 300 },
    { itemIndex: 12, volume: 2000 },
  ]);

  const each = rows.map((r) => {
    const item = ITEMS[r.itemIndex];
    return { item, volume: r.volume, ratio: item ? r.volume / item.amount : 0 };
  });
  const total = each.reduce((n, e) => n + e.ratio, 0);
  const units = new Set(each.map((e) => e.item?.unit));

  const setRow = (i: number, patch: Partial<Row>): void => {
    setRows((prev) => prev.map((r, j) => (i === j ? { ...r, ...patch } : r)));
  };

  const tone = total >= 1 ? 'tone-danger' : 'tone-safe';

  return (
    <div className="widget-body">
      <p className="widget-lead">
        品名と量を変えて、<strong>指定数量の倍数</strong>がどう動くかを確かめてください。
        <strong>倍数は商の和</strong>で、<strong>1 以上になると製造所等の許可が要ります</strong>。
      </p>

      {rows.map((row, i) => (
        <div className="widget-row" key={i}>
          <label className="widget-field">
            <span>品名・区分</span>
            <select
              value={row.itemIndex}
              onChange={(e) => setRow(i, { itemIndex: Number(e.target.value) })}
            >
              {ITEMS.map((item, index) => (
                <option value={index} key={item.name + item.group}>
                  {item.group}　{item.name}（{item.amount.toLocaleString()} {item.unit}）
                </option>
              ))}
            </select>
          </label>
          <label className="widget-field">
            <span>貯蔵量（{ITEMS[row.itemIndex]?.unit ?? ''}）</span>
            <input
              type="number"
              min={0}
              step={10}
              value={row.volume}
              onChange={(e) => setRow(i, { volume: Math.max(0, Number(e.target.value)) })}
            />
          </label>
        </div>
      ))}

      <div className="widget-actions">
        <button
          type="button"
          className="btn small ghost"
          onClick={() => setRows((prev) => [...prev, { itemIndex: 9, volume: 50 }])}
          disabled={rows.length >= 4}
        >
          品名を足す
        </button>
        <button
          type="button"
          className="btn small ghost"
          onClick={() => setRows((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev))}
          disabled={rows.length <= 1}
        >
          最後の 1 つを外す
        </button>
      </div>

      <table className="widget-table">
        <thead>
          <tr>
            <th>品名・区分</th>
            <th>貯蔵量</th>
            <th>指定数量</th>
            <th>倍数</th>
          </tr>
        </thead>
        <tbody>
          {each.map((e, i) => (
            <tr key={i}>
              <td>{e.item?.name ?? '―'}</td>
              <td>
                {e.volume.toLocaleString()} {e.item?.unit}
              </td>
              <td>
                {e.item?.amount.toLocaleString()} {e.item?.unit}
              </td>
              <td>{fx(e.ratio)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className={'widget-result ' + tone}>
        合計 {fx(total)} 倍 ―{' '}
        {total >= 1 ? '指定数量以上。市町村長等の許可が要ります' : '指定数量未満。市町村の火災予防条例の世界です'}
      </p>

      {units.size > 1 && (
        <p className="widget-warn">
          いま kg と L が混ざっています。<strong>それでも倍数は足せます。</strong>
          倍数は「何倍か」という単位のない数だからです。
        </p>
      )}

      <p className="widget-note">
        指定数量は政令 別表第三の値です。<strong>第 4 類だけが L で、ほかの 5 類は kg</strong> で数えます。
        第 6 類は液体ですが 300 kg です。
      </p>
    </div>
  );
}
