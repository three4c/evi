## 変更内容

<!-- 何を変更したか簡潔に記載 -->

## 変更の背景・目的

<!-- なぜこの変更が必要か -->

## 影響範囲

<!-- この変更が影響する範囲 -->

## スクリーンショット（該当する場合）

<!-- UI変更がある場合はスクリーンショットを添付 -->

## テストとチェック

### ビルド・品質チェック

- [ ] `bun run check` - Biomeのlint/formatチェック
- [ ] `bun run compile` - TypeScriptの型チェック
- [ ] `bun run test` - Vitestのユニットテスト

### 動作確認

- [ ] `bun run dev` - Chrome開発環境での動作確認
- [ ] `bun run dev:firefox` - Firefox開発環境での動作確認（必要な場合）
- [ ] WXTのHot Module Replacement (HMR)の動作確認
- [ ] Content Scriptの動作確認（対象Webページで正常に動作するか）
- [ ] Background/Popup/Optionsページの表示・機能確認
- [ ] chrome.storageの読み書き確認
- [ ] メッセージング（chrome.runtime.sendMessage）の動作確認

### その他

- [ ] コードレビューを受けた
- [ ] WXTのentrypointsが適切に配置されている
- [ ] ドキュメントを更新した（必要な場合）

## 関連Issue

<!-- 関連するIssue番号を記載（例: #123） -->
