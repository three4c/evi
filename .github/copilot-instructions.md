# GitHub Copilot レビュー指示

## 重要: 言語設定

**すべてのコードレビューコメントは必ず日本語で記述してください。**
**CRITICAL: All code reviews MUST be written in Japanese language.**

## レビューコメントのラベル付けルール

各レビューコメントの冒頭に、以下のラベルを必ず付与してください：

### ラベル一覧

- **`[MUST]`** - 必須 (Must)
  - これを直さないと承認できない
  - セキュリティ脆弱性、重大なバグ、パフォーマンスの致命的な問題など
- **`[IMO]`** - 提案 (In my opinion)
  - 個人的な見解や、軽微な提案
  - コードの可読性改善、リファクタリング提案など
- **`[Q]`** - 質問 (Question)
  - 質問。相手は回答が必要
  - 実装意図の確認、仕様の不明点など
- **`[NITS]`** - あら探し (Nitpick)
  - 重箱の隅をつつく提案。無視しても良い
  - コーディングスタイルの細かい指摘、命名の微調整など
- **`[NR]`** - お手すきで (No rush)
  - 今やらなくて良いが、将来的には解決したい提案
  - パフォーマンス最適化、技術的負債の解消など
- **`[FYI]`** - 参考まで (For your information)
  - 参考までに共有。アクションは不要
  - 関連情報の共有、類似実装の参照など

## レビュー観点（WXT + React + TypeScript + Chrome拡張）

### MUST (必須) とすべき項目

#### セキュリティ脆弱性

- Content Security Policy (CSP) 違反
- XSS脆弱性（特にdangerouslySetInnerHTMLの使用）
- 安全でないeval()やnew Function()の使用
- chrome.storage の適切な暗号化なしでの機密情報保存
- 外部スクリプトの安全でない読み込み

#### WXT設定関連

- wxt.config.ts の設定ミス
- entrypoints の適切な配置（background/content/popup/optionsなど）
- manifest の必須フィールド不足
- 不要な権限（permissions）の要求
- Manifest V3 への準拠

#### TypeScript型安全性

- `any` 型の不適切な使用
- 型アサーション（as）の乱用
- Chrome API の型定義未使用（@types/chrome）
- 必須プロパティの欠落

#### React関連

- useEffect の依存配列の不備によるメモリリーク
- 不要な再レンダリング
- イベントリスナーのクリーンアップ漏れ
- Chrome拡張のライフサイクルとReactの不整合

#### ビルド・テスト

- `bun run compile` でTypeScriptエラーが発生
- `bun run check` でBiomeエラーが発生
- `bun run test` でテストが失敗

### IMO/NR (提案) とすべき項目

#### コード品質

- WXTのユーティリティ関数の活用（storage, messaging など）
- Reactのカスタムフックへのリファクタリング
- CSS Modules の適切な活用
- 共通コンポーネントの抽出

#### パフォーマンス最適化

- React.memo、useMemo、useCallback の活用
- 不要なDOM操作の削減
- chrome.storage の読み書き頻度の最適化
- Content Script の遅延読み込み

#### 開発体験

- WXT HMRが効かない構造の改善
- より適切な型定義の追加
- エラーハンドリングの改善
- デバッグログの追加

### NITS (あら捜し) とすべき項目

- Biomeルールに準拠していないコード（`bun run check:fix`で自動修正可能）
- 不要なimport文
- console.log の削除忘れ
- 未使用の変数・関数
- コメントアウトコードの削除
- ファイル名の命名規則（WXTのentrypoint規則）

### Q (質問) とすべき項目

#### WXT設定の意図

- なぜこのentrypoint構成にしたか
- manifest設定の理由

#### 実装アプローチ

- なぜこのReactパターンを選択したか
- WXTのユーティリティを使わない理由

#### テストカバレッジ

- どのようにVitest でテストしたか
- Testing Library でのテスト戦略

#### ブラウザ互換性

- Firefox対応は必要か（`bun run dev:firefox`）
- Chromeのどのバージョンまでサポートするか

### FYI (参考まで) とすべき項目

- WXTの公式ドキュメント・ガイド
- React + Chrome拡張のベストプラクティス
- TypeScript型定義の参考例
- Biomeの設定例
- Vitestのテストパターン

## コメント記述のベストプラクティス

1. **具体的に指摘する**: 「ここが良くない」ではなく「この部分は○○の理由で△△すべきです」
2. **理由を明記する**: なぜその指摘をするのか背景を説明する
3. **代替案を提示する**: 問題だけでなく解決策も提案する
4. **肯定的なフィードバック**: 良いコードには積極的に称賛のコメントを
5. **優先順位を明確に**: MUSTは最優先、その他は重要度順に

## コメント例

```
[MUST] TypeScript: any 型を使用しています。chrome.storage.StorageArea 型を使用して型安全性を確保してください。

[MUST] React: useEffect の依存配列に state が含まれていません。無限ループまたはメモリリークの原因になります。

[MUST] セキュリティ: dangerouslySetInnerHTML を使用しています。DOMPurifyでのサニタイズまたは代替手段を検討してください。

[IMO] この処理は WXT の storage ユーティリティ (storage.defineItem) を使うことで型安全かつシンプルになります。

[Q] この Content Script は全ページで実行されていますが、特定のURLパターンのみで動作させる想定ですか？

[NITS] `bun run check:fix` で自動修正できるBiomeルール違反があります。実行してください。

[FYI] WXT の公式ドキュメントに同様の実装例があります: https://wxt.dev/guide/essentials/storage.html

👍 TypeScript の型定義が丁寧で、型安全性が高く保たれていて素晴らしいです！
```
