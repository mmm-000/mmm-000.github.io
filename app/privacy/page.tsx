import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter } from "../../components/site-footer";

export const metadata: Metadata = {
  title: "プライバシーポリシー | DVD Sleep Screen",
  description: "DVD Sleep Screen のプライバシーポリシー。"
};

export default function PrivacyPage() {
  return (
    <main className="static-page-root">
      <article className="static-page">
        <p className="static-page-back">
          <Link href="/">← トップへ戻る</Link>
        </p>
        <h1>プライバシーポリシー</h1>
        <p>最終更新日: 2026年5月10日</p>
        <p>
          本ポリシーは、DVD Sleep Screen（以下「当サイト」）における個人情報の取り扱いについて説明するものです。
        </p>
        <h2>1. 運営者</h2>
        <p>
          当サイトは個人により運営されています。お問い合わせは{" "}
          <a href="https://github.com/mmm-000/mmm-000.github.io/issues" target="_blank" rel="noopener noreferrer">
            GitHub Issues
          </a>
          をご利用ください。
        </p>
        <h2>2. 収集する情報</h2>
        <p>
          当サイト自体では、氏名・メールアドレス等を入力するフォームは設けていません。アクセスログや Cookie は、ホスティング（GitHub Pages）や広告配信サービスにより自動的に扱われる場合があります。
        </p>
        <h2>3. Cookie と広告（Google AdSense）</h2>
        <p>
          当サイトでは、Google による広告配信のため Google AdSense を利用しています。広告配信事業者は、ユーザーの興味に応じた広告を表示するため Cookie を使用することがあります。
        </p>
        <p>
          詳細は{" "}
          <a href="https://policies.google.com/technologies/ads?hl=ja" target="_blank" rel="noopener noreferrer">
            Google の広告に関するポリシー
          </a>
          をご確認ください。Cookie の無効化は、お使いのブラウザの設定から行えます。
        </p>
        <h2>4. 第三者サービス</h2>
        <ul>
          <li>
            <strong>Google AdSense</strong> — 広告の表示（Google LLC）
          </li>
          <li>
            <strong>OFUSE</strong> — 開発者支援リンク（外部サイトへ遷移します）
          </li>
          <li>
            <strong>GitHub Pages</strong> — サイトのホスティング
          </li>
        </ul>
        <h2>5. お子様のプライバシー</h2>
        <p>当サイトは、13 歳未満のお子様を対象としたサービスではありません。</p>
        <h2>6. ポリシーの変更</h2>
        <p>本ポリシーは、必要に応じて予告なく変更することがあります。変更後も当サイトの利用を継続した場合、変更に同意したものとみなします。</p>
        <SiteFooter aboutLabel="このサイトについて" privacyLabel="プライバシーポリシー" />
      </article>
    </main>
  );
}
