# 朝霧ヤマノ AIカウンセラー

ヤマノの美容AIカウンセラー「朝霧」が、お客様の肌悩み・年代・予算に合わせた商品を提案するチャットアプリです。
Google Gemini 2.0 Flash を使用し、トークン節約設計でストリーミング応答を実現しています。

## ローカル起動手順

```bash
npm install
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## 環境変数の設定

`.env.local.example` をコピーして `.env.local` を作成し、Gemini API キーを設定します。

```bash
cp .env.local.example .env.local
```

`.env.local` を編集：

```
GEMINI_API_KEY=あなたのAPIキー
```

Google AI Studio（https://aistudio.google.com/）でAPIキーを取得できます。

## Vercelへのデプロイ

1. [Vercel](https://vercel.com/) にログインし、GitHubリポジトリをインポート
2. **Environment Variables** に `GEMINI_API_KEY` を追加
3. デプロイ実行

または Vercel CLI を使う場合：

```bash
npm i -g vercel
vercel --prod
```

デプロイ時に環境変数を設定するよう促されます。
