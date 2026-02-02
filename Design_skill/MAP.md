# poyon-site 配線図

## Entry
- index.html
  - assets/css/base.css
  - style.css
  - assets/js/nav.js
  - assets/js/modal.js
  - assets/js/scroll.js
  - sections/hero.html
  - sections/feature.html
  - sections/horizontal.html

## Sections
- hero.html: ヒーロー、導線（ボタン）
- feature.html: カード一覧、詳細はモーダル
- horizontal.html: 横スクロール領域

## JS responsibilities
- nav.js: セクション切替/ナビ操作（クリック→表示）
- modal.js: data-modal-open / data-modal / close
- scroll.js: 縦/横スクロール制御

## CSS responsibilities
- base.css: reset / typography / button / modal基礎
- style.css: 見た目（色、レイアウト、アニメ）