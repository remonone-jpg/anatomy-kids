import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { getLocale, isLocale, localeCodes, locales } from "../i18n/config";
import { fontClassName } from "../i18n/fonts";
import { getDictionary } from "../i18n/dictionaries";
import { asset } from "../lib/asset";
import "../globals.css";

export function generateStaticParams() {
  return localeCodes.map((locale) => ({ locale }));
}

/**
 * Absolute URLs for og:image and friends, resolved per host so a preview
 * deployment never advertises another origin's assets.
 *
 * The fallback used to be the upstream project's own domain, inherited with
 * the fork. Every visitor's browser went off to fetch a favicon from a host
 * that does not resolve, and every shared link advertised an og:image nobody
 * owns here.
 */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://remonone-jpg.github.io/anatomy-kids/");

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const config = getLocale(locale);
  const { ui } = await getDictionary(locale);
  // Left relative: Next resolves this against `metadataBase`, which already
  // carries the project-page path. Prefixing it here doubles the segment.
  const image = { url: "/og.jpg", width: 1200, height: 675, alt: ui.meta.imageAlt };

  return {
    metadataBase: new URL(siteUrl),
    title: ui.meta.title,
    description: ui.meta.description,
    applicationName: "Anatomy Atelier",
    alternates: {
      canonical: `/${locale}`,
      // Lets search engines serve the right language and offer the rest.
      languages: {
        ...Object.fromEntries(locales.map((entry) => [entry.code, `/${entry.code}`])),
        "x-default": "/en",
      },
    },
    icons: {
      icon: [
        { url: asset("/favicon.svg"), type: "image/svg+xml" },
        { url: asset("/icon-192.png"), sizes: "192x192", type: "image/png" },
        { url: asset("/icon-512.png"), sizes: "512x512", type: "image/png" },
      ],
      shortcut: asset("/favicon.svg"),
      apple: { url: asset("/apple-touch-icon.png"), sizes: "180x180" },
    },
    openGraph: {
      type: "website",
      siteName: "Anatomy Atelier",
      locale: config.intl,
      alternateLocale: locales.filter((entry) => entry.code !== locale).map((entry) => entry.intl),
      title: ui.meta.ogTitle,
      description: ui.meta.ogDescription,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: ui.meta.ogTitle,
      description: ui.meta.ogDescription,
      images: [image],
    },
  };
}

export const viewport: Viewport = { themeColor: "#f7f0e7" };

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const config = getLocale(locale);

  return (
    <html lang={config.code} dir={config.dir}>
      <body className={fontClassName(config.script)}>{children}</body>
    </html>
  );
}
