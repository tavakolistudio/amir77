import type { Metadata } from 'next';
import { galleryLabels, Locale } from '../../lib/data';
import { getGalleryItems } from '../../lib/gallery';
import { pageMetadata } from '../../lib/seo';

export const dynamic = 'force-dynamic';

const text: Record<Locale, { eyebrow: string; title: string; description: string; empty: string }> = {
  tr: { eyebrow: 'AMIR 77 / MEDYA', title: 'SAHADAN GÖRÜNTÜLER', description: 'Projelerimizden fotoğraflar ve videolar.', empty: 'Henüz yayınlanmış medya bulunmuyor.' },
  en: { eyebrow: 'AMIR 77 / MEDIA', title: 'FROM THE FIELD', description: 'Photos and videos from our projects.', empty: 'No media has been published yet.' },
  ar: { eyebrow: 'أمير ٧٧ / الوسائط', title: 'من موقع العمل', description: 'صور وفيديوهات من مشاريعنا.', empty: 'لا توجد وسائط منشورة حتى الآن.' },
  fa: { eyebrow: 'امیر ۷۷ / رسانه', title: 'از محل پروژه', description: 'عکس‌ها و ویدیوهای پروژه‌های ما.', empty: 'هنوز رسانه‌ای منتشر نشده است.' },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, '/gallery', galleryLabels[locale]);
}

export default async function GalleryPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const copy = text[locale];
  const items = await getGalleryItems();
  return <main><section className="page-hero"><div className="wrap"><span className="breadcrumb">{copy.eyebrow}</span><h1 className="display">{copy.title}</h1><p>{copy.description}</p></div></section><section className="gallery wrap">{items.length ? <div className="gallery-grid">{items.map(item => item.type === 'video' && item.youtubeId ? <article className="gallery-card gallery-video" key={item.id}><iframe src={`https://www.youtube-nocookie.com/embed/${item.youtubeId}`} title={item.title} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/><h2>{item.title}</h2></article> : <article className="gallery-card" key={item.id}><img src={item.url} alt={item.title}/><h2>{item.title}</h2></article>)}</div> : <p className="gallery-empty">{copy.empty}</p>}</section></main>;
}
