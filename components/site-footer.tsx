import Link from "next/link";

type SiteFooterProps = {
  aboutLabel: string;
  privacyLabel: string;
  homeLabel?: string;
};

export function SiteFooter({ aboutLabel, privacyLabel, homeLabel }: SiteFooterProps) {
  return (
    <nav className="site-footer" aria-label="Site navigation">
      {homeLabel ? (
        <Link href="/" className="site-footer-link">
          {homeLabel}
        </Link>
      ) : null}
      <Link href="/about/" className="site-footer-link">
        {aboutLabel}
      </Link>
      <Link href="/privacy/" className="site-footer-link">
        {privacyLabel}
      </Link>
    </nav>
  );
}
