import { useState, type JSX } from 'react';

/**
 * 消火設備の適応表（政令 別表第五）を引くツール。
 *
 * **甲種でいちばん手が止まる表がこれ。**乙 4 版では第 4 類の行だけ見れば済んだが、
 * 甲種では**対象が 10 区分**（同じ類でも割れる）ある。
 * 「この火災にこれは使えるか」を 1 つずつ押して確かめられるようにした。
 *
 * ○ の位置は `docs/primary-numbers.md` の A-14 から写している。
 * **政令 別表第五の原文どおり**で、推測で埋めた欄はない。
 */

export const widgetId = 'shoka';

/** 対象物の区分。**別表第五は「6 類」ではなく、この 10 区分で書かれている** */
const TARGETS = [
  { key: 'a1', label: '第 1 類（アルカリ金属の過酸化物等）' },
  { key: 'a2', label: '第 1 類（その他）' },
  { key: 'b1', label: '第 2 類（鉄粉・金属粉・マグネシウム等）' },
  { key: 'b2', label: '第 2 類（引火性固体）' },
  { key: 'b3', label: '第 2 類（その他）' },
  { key: 'c1', label: '第 3 類（禁水性物品）' },
  { key: 'c2', label: '第 3 類（その他）' },
  { key: 'd', label: '第 4 類' },
  { key: 'e', label: '第 5 類' },
  { key: 'f', label: '第 6 類' },
] as const;

type TargetKey = (typeof TARGETS)[number]['key'];

interface Agent {
  name: string;
  /** 適応する区分。ここに無い区分には ○ が付いていない */
  ok: TargetKey[];
  note?: string;
}

/** 政令 別表第五の ○ をそのまま写したもの（docs/primary-numbers.md A-14） */
const AGENTS: Agent[] = [
  {
    name: '屋内消火栓・屋外消火栓／スプリンクラー',
    ok: ['a2', 'b2', 'b3', 'c2', 'e', 'f'],
  },
  {
    name: '水蒸気・水噴霧消火設備',
    ok: ['a2', 'b2', 'b3', 'c2', 'd', 'e', 'f'],
    note: '設備としての水噴霧は第 4 類に適応する',
  },
  {
    name: '泡消火設備・泡を放射する消火器',
    ok: ['a2', 'b2', 'b3', 'c2', 'd', 'e', 'f'],
  },
  {
    name: '不活性ガス（二酸化炭素）',
    ok: ['b2', 'd'],
  },
  {
    name: 'ハロゲン化物',
    ok: ['b2', 'd'],
  },
  {
    name: '粉末（りん酸塩類等）',
    ok: ['a2', 'b2', 'b3', 'd', 'f'],
  },
  {
    name: '粉末（炭酸水素塩類等）',
    ok: ['a1', 'b1', 'b2', 'c1', 'd'],
    note: '禁水のものに使える唯一の粉末',
  },
  {
    name: '棒状の水を放射する消火器',
    ok: ['a2', 'b2', 'b3', 'c2', 'e', 'f'],
  },
  {
    name: '霧状の水を放射する消火器',
    ok: ['a2', 'b2', 'b3', 'c2', 'e', 'f'],
    note: '霧状にしても第 4 類には適応しない',
  },
  {
    name: '棒状の強化液を放射する消火器',
    ok: ['a2', 'b2', 'b3', 'c2', 'e', 'f'],
  },
  {
    name: '霧状の強化液を放射する消火器',
    ok: ['a2', 'b2', 'b3', 'c2', 'd', 'e', 'f'],
    note: '強化液は霧状にすると第 4 類に適応する',
  },
  {
    name: '水バケツ・水槽',
    ok: ['a2', 'b2', 'b3', 'c2', 'e', 'f'],
  },
  {
    name: '乾燥砂／膨張ひる石・膨張真珠岩',
    ok: ['a1', 'a2', 'b1', 'b2', 'b3', 'c1', 'c2', 'd', 'e', 'f'],
    note: '危険物の 10 区分すべてに適応する唯一のもの',
  },
];

export default function ShokaWidget(): JSX.Element {
  const [target, setTarget] = useState<TargetKey>('d');

  const label = TARGETS.find((t) => t.key === target)?.label ?? '';
  const usable = AGENTS.filter((a) => a.ok.includes(target));
  const unusable = AGENTS.filter((a) => !a.ok.includes(target));

  return (
    <div className="widget-body">
      <p className="widget-lead">
        対象を選ぶと、<strong>政令 別表第五で ○ が付いている消火設備</strong>が並びます。
        <strong>同じ類でも結論が割れる</strong>ところを、切り替えて確かめてください。
      </p>

      <label className="widget-field">
        <span>対象物の区分</span>
        <select value={target} onChange={(e) => setTarget(e.target.value as TargetKey)}>
          {TARGETS.map((t) => (
            <option value={t.key} key={t.key}>
              {t.label}
            </option>
          ))}
        </select>
      </label>

      <p className="widget-result tone-safe">
        {label} に適応するのは {usable.length} 種類
      </p>

      <table className="widget-table">
        <thead>
          <tr>
            <th>消火設備</th>
            <th>適応</th>
          </tr>
        </thead>
        <tbody>
          {AGENTS.map((a) => {
            const hit = a.ok.includes(target);
            return (
              <tr key={a.name}>
                <td style={{ textAlign: 'left' }}>
                  {a.name}
                  {a.note !== undefined && <div className="widget-note">{a.note}</div>}
                </td>
                <td className={hit ? 'hit' : 'miss'}>{hit ? '○' : '―'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {unusable.length > 0 && (
        <p className="widget-warn">
          使えないのは {unusable.length} 種類あります。
          <strong>「とりあえず水」が誤りになる区分がある</strong>ことを、ここで確かめてください。
        </p>
      )}

      <p className="widget-note">
        ○ の位置は政令 別表第五の原文どおりです。
        <strong>乾燥砂・膨張ひる石・膨張真珠岩だけが危険物の 10 区分すべてに適応</strong>し、
        <strong>強化液は棒状と霧状で結論が変わります</strong>。
      </p>
    </div>
  );
}
