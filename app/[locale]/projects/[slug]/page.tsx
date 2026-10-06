import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Locale, projects, copy } from '../../../lib/data';
import { Final } from '../../../components';
import { localProjectName, localText } from '../../../lib/localize';
import { pageMetadata } from '../../../lib/seo';

export function generateStaticParams() { return projects.map(p => ({ slug: p.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ locale: Locale, slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const index = projects.findIndex(project => project.slug === slug);
  if (index < 0) return {};
  const name = localProjectName(locale, index, projects[index].name);
  return pageMetadata(locale, `/projects/${slug}`, name, localText(locale, 'projectIntro', 'Verified project information is pending.'));
}

export default async function Project({ params }: { params: Promise<{ locale: Locale, slug: string }> }) {
  const { locale, slug } = await params;
  const index = projects.findIndex(x => x.slug === slug);
  if (index < 0) notFound();
  const t = copy[locale];
  const name = localProjectName(locale, index, projects[index].name);
  const proj = projects[index];
  const fallbackIntro = locale === 'tr' ? 'Bu proje için doğrulanmış konum, kapsam, tarih ve görseller müşteriden bekleniyor.' : 'Verified location, scope, dates and imagery for this project are pending from the client.';
  return <main><section className="page-hero"><div className="wrap"><span className="breadcrumb">{t.projects} / {name}</span><h1 className="display">{name}</h1><p>{localText(locale, 'projectIntro', fallbackIntro)}</p></div></section><section className="detail wrap"><div className="placeholder" style={{backgroundImage:`url('${proj.image}')`,backgroundSize:'cover',backgroundPosition:'center',minHeight:'clamp(360px,50vw,650px)'}}><span>{name}</span></div><div className="detail-grid" style={{ marginTop: 70 }}><div><h2>{localText(locale, 'projectOverview', locale === 'tr' ? 'Proje özeti' : 'Project overview')}</h2><p className="about-copy">{localText(locale, 'projectOverviewText', locale === 'tr' ? 'Gerçek proje bilgisini görünür kılmak için tasarlanmış vaka çalışması şablonu. Doğrulanmamış teknik veya ticari bilgi yayınlanmaz.' : 'A case-study template designed to surface real project information. No unverified technical or commercial information is published.')}</p></div><div><h2>{localText(locale, 'projectDetails', locale === 'tr' ? 'Proje bilgileri' : 'Project details')}</h2>{[localText(locale, 'locationLabel', 'Location'), localText(locale, 'servicesLabel', 'Services'), localText(locale, 'status', 'Status')].map(x => <div className="capability" key={x}>{x}<span style={{ float: 'right', color: '#777' }}>{localText(locale, 'dataPending', 'Data to be provided')}</span></div>)}</div></div></section><section className="detail wrap"><h2>{localText(locale, 'nextProject', locale === 'tr' ? 'Sonraki proje' : 'Next project')}</h2><Link className="btn outline" href={`/${locale}/projects`}>{t.projects} →</Link></section><Final locale={locale} /></main>;
}
