import type { Metadata } from 'next';
import { Locale, locales } from './data';

export const siteUrl = 'https://amir77.vercel.app';

const localeDescriptions: Record<Locale, string> = {
  tr: 'AMIR 77 İnşaat, Yalova ve Çiftlikköy’de beton dökme, kalıp, demir donatı, duvar örme ve çatı uygulamaları sunar.',
  en: 'AMIR 77 İnşaat provides concrete pouring, formwork, reinforcement, masonry and roof works in Yalova and Çiftlikköy, Türkiye.',
  ar: 'تقدم شركة أمير 77 للإنشاءات أعمال صب الخرسانة والقوالب والتسليح والبناء والأسقف في يالوفا وتشفتلك كوي، تركيا.',
  fa: 'امیر ۷۷ اینشاعات خدمات بتن‌ریزی، قالب‌بندی، آرماتوربندی، دیوارچینی و اجرای سقف را در یالوا و چیفتلیک‌کوی ترکیه ارائه می‌دهد.',
};
const ogLocales: Record<Locale, string> = { tr: 'tr_TR', en: 'en_US', ar: 'ar_AR', fa: 'fa_IR' };

export function localizedAlternates(locale: Locale, path = ''): Metadata['alternates'] {
  return { canonical: `/${locale}${path}`, languages: Object.fromEntries(locales.map((item) => [item, `/${item}${path}`])) };
}

export function pageMetadata(locale: Locale, path: string, title: string, description = localeDescriptions[locale]): Metadata {
  const url = `/${locale}${path}`;
  return { title, description, keywords: ['Yalova inşaat', 'Çiftlikköy inşaat', 'beton dökme', 'kalıp işleri', 'demir donatı', 'çatı işleri', 'duvar örme', 'AMIR 77 İnşaat'], alternates: localizedAlternates(locale, path), openGraph: { type: 'website', url, siteName: 'AMIR 77 İnşaat', title, description, locale: ogLocales[locale], images: [{ url: '/images/hero-construction.png', width: 1920, height: 1080, alt: 'AMIR 77 İnşaat construction work in Yalova' }] }, twitter: { card: 'summary_large_image', title, description, images: ['/images/hero-construction.png'] } };
}
