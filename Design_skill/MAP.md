# poyon-site 配線図（迷子防止MAP）

このプロジェクトは「1つの入口（index.html）」から、
「セクションHTML（sections/*.html）」を読み込み、
「JS（nav/modal/scroll）」で体験を足し、
「CSS（base/style）」で整える構造ぽよん。

---

## 0. いちばん大事な設計ルール（これだけ覚えれば迷子しないぽよん）
### ルールA：index.html は“骨組み”だけ
- 画面に表示する本文（セクション本文）は index.html に書かない
- index.html は「ヘッダー」「表示エリア（main）」「フッター」だけを持つ

### ルールB：sections/*.html が“本文”
- Hero / Feature / Horizontal などの本文は sections に分割して置く
- 1ファイル＝1セクション（単一責務）

### ルールC：main（#app）に差し込むのは nav.js だけ
- “何を表示するか” の責務を nav.js に固定する
- 他のJSは表示差し込みをしない（modal/scrollは演出のみ）

---

## 1. Entry（入口と配線）
- index.html（入口 / 配線の起点）
  - assets/css/base.css（共通の土台）
  - style.css（見た目の本体）
  - assets/js/nav.js（どのsectionを表示するか決める）
  - assets/js/modal.js（モーダル開閉）
  - assets/js/scroll.js（スクロール体験）
  - sections/*.html（本文。nav.jsが必要に応じて読み込む）

---

## 2. “どこがどこと繋がってる？”を1行で言うぽよん
- index.html が CSS/JS を読み込む
- nav.js が main(#app) に sections/*.html を差し込む
- modal.js が data-modal-* を監視してモーダルを開閉する
- scroll.js が data-horizontal-scroll などの領域にスクロール演出を付ける

---

## 3. Sections（本文の部品）
- sections/hero.html
  - 役割：一番上の「世界観/キャッチ/導線」を出す
  - 主な内容：タイトル、サブコピー、CTAボタン
- sections/feature.html
  - 役割：「できること」をカードや文章で整理する
  - 主な内容：Featureカード、詳細ボタン（モーダル導線）
- sections/horizontal.html
  - 役割：横スクロールで事例/成果物を見せる（Apple風UX）
  - 主な内容：横に並ぶカード群、詳細ボタン（モーダル導線）

---

## 4. JS responsibilities（JSの責務）
- assets/js/nav.js（表示の切替担当 / ルーター）
  - やること：URLハッシュ（#/featureなど）を見て、表示する section を決める
  - やること：sections/*.html を fetch して main(#app) に挿入する
  - やらない：モーダルの中身管理、スクロール演出、CSS操作の大半

- assets/js/modal.js（モーダル担当）
  - やること：data-modal-open / data-modal-close を拾って開閉する
  - やること：Esc、背景クリック、フォーカス制御など
  - やらない：セクション切替（nav.jsの仕事）

- assets/js/scroll.js（スクロール体験担当）
  - やること：横スクロール領域の操作（例：縦ホイール→横移動）
  - やること：必要ならスクロール連動のフェードイン等
  - やらない：表示切替（nav.jsの仕事）

---

## 5. CSS responsibilities（CSSの責務）
- assets/css/base.css（土台 / リセット / 共通）
  - やること：reset、フォント、基本余白、リンク/ボタンの基礎
  - やること：モーダルの「存在できる最低限」（表示/非表示の仕組み）
  - やらない：色テーマ、影、装飾、Apple風の演出（style.cssの仕事）

- style.css（見た目 / 世界観 / Apple風）
  - やること：配色、角丸、影、カードデザイン、レイアウト
  - やること：セクションごとの見た目（hero/feature/horizontal）
  - やること：ホバー演出などのUX見た目

---

# 各ファイルの設計（中身を抽象化した構造ぽよん）

## index.html（骨組みだけ）
- head
  - base.css
  - style.css
- body
  - header（上ナビ・CTA）
  - main#app（ここに sections が差し込まれる“舞台”）
  - footer
  - script（nav.js / modal.js / scroll.js）

---

## sections/hero.html（Heroセクション）
- section.hero
  - container
    - eyebrow（小さい説明）
    - h1（キャッチ）
    - p（補足）
    - CTA（ボタン2つ）
      - 「# /feature へ」など（nav.jsに渡す導線）
      - 「data-modal-open=about」など（modal.jsに渡す導線）

---

## sections/feature.html（できること）
- section.feature
  - container
    - section header（見出し/説明）
    - feature list（カード群）
      - 各カード
        - タイトル
        - 説明
        - 箇条書き
        - CTA（モーダル or セクション移動）

---

## sections/horizontal.html（横スクロール）
- section.horizontal
  - container（見出し・説明）
  - h-scroll（横スクロールする箱）
    - h-track（横に並ぶトラック：display:flex）
      - h-card × N
        - タイトル
        - 説明
        - CTA（data-modal-open=case-xxx など）

---

## assets/js/nav.js（表示切替）
- routes（パス → sectionsファイル の対応表）
- render(path)
  - fetch(sections/*.html)
  - main#app.innerHTML = html
- onload / hashchange
  - 現在パスを読み取って render()

---

## assets/js/modal.js（モーダル）
- open(id)
- close()
- event delegation（クリックで data-modal-open / data-modal-close を拾う）
- accessibility（Esc、フォーカストラップ）

---

## assets/js/scroll.js（スクロール体験）
- 横スクロール領域の取得（data-horizontal-scrollなど）
- wheelイベントで横移動（任意）
- スクロール演出（任意）

---

## assets/css/base.css（土台）
- reset（box-sizing, margin, etc）
- typography（font, line-height）
- container / section の基本余白
- modal の基本表示制御（.is-open など）

---

## style.css（見た目）
- color tokens（パステル/ブラウン系など）
- components（nav pill、カード、ボタン、影、角丸）
- sections（hero背景、featureカード配置、horizontalカード）
- state（hover/focusの見た目）

---

## 迷子になったら見る場所ぽよん
1) 「表示されない」→ nav.js の routes と index.html の main#app を見る
2) 「横スクロールが効かない」→ style.css の .h-scroll/.h-track/.h-card を見る
3) 「モーダルが動かない」→ modal.js と data-modal-open 属性を見る