import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter } from "../../components/site-footer";

export const metadata: Metadata = {
  title: "このサイトについて | DVD Sleep Screen",
  description: "DVD Sleep Screen の概要と使い方。"
};

export default function AboutPage() {
  return (
    <main className="static-page-root">
      <article className="static-page">
        <p className="static-page-back">
          <Link href="/">← トップへ戻る</Link>
        </p>
        <h1>このサイトについて</h1>
        <p>
          DVD Sleep Screen は、平成のテレビや DVD プレーヤーにあった「DVD ロゴが画面内を跳ね返る」スリープ画面を、ブラウザで再現した個人制作の Web サイトです。
        </p>
        <h2>できること</h2>
        <ul>
          <li>DVD ロゴ（または任意の画像）が画面内を反射移動するアニメーション</li>
          <li>壁に当たるたびの色変化（カラーモード）</li>
          <li>速度・ロゴサイズ・TV 比率（4:3 / 16:9）の調整</li>
          <li>ローカル画像のアップロードによるカスタムロゴ</li>
        </ul>
        <h2>使い方</h2>
        <p>
          トップページ右側（スマホでは下部）の設定パネルから、速度やロゴ幅などを変更できます。一時停止ボタンでアニメーションを止めることもできます。
        </p>
        <h2>運営について</h2>
        <p>
          学習・趣味目的で制作・公開しています。不具合や要望は{" "}
          <a href="https://github.com/mmm-000/mmm-000.github.io/issues" target="_blank" rel="noopener noreferrer">
            GitHub Issues
          </a>
          からお知らせください。
        </p>
        <SiteFooter aboutLabel="このサイトについて" privacyLabel="プライバシーポリシー" />
      </article>
    </main>
  );
}
