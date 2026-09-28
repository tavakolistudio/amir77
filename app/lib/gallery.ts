import { neon } from '@neondatabase/serverless';

export type GalleryItem = {
  id: string;
  type: 'image' | 'video';
  title: string;
  url: string;
  youtubeId: string | null;
  isPublished: boolean;
  position: number;
  createdAt: string;
};

function database() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return null;
  return neon(connectionString);
}

export function youtubeIdFromUrl(value: string) {
  try {
    const url = new URL(value);
    if (url.hostname === 'youtu.be') return url.pathname.slice(1).split('/')[0] || null;
    if (url.hostname.endsWith('youtube.com')) {
      return url.searchParams.get('v') || url.pathname.match(/\/(?:embed|shorts)\/([^/?]+)/)?.[1] || null;
    }
  } catch {}
  return null;
}

function normalize(rows: Record<string, unknown>[]): GalleryItem[] {
  return rows.map((row) => ({
    id: String(row.id), type: row.type === 'video' ? 'video' : 'image', title: String(row.title),
    url: String(row.url), youtubeId: row.youtube_id ? String(row.youtube_id) : null,
    isPublished: Boolean(row.is_published), position: Number(row.position), createdAt: String(row.created_at),
  }));
}

export async function getGalleryItems(includeUnpublished = false) {
  const sql = database();
  if (!sql) return [];
  const rows = includeUnpublished
    ? await sql.query('SELECT * FROM gallery_media ORDER BY position ASC, created_at DESC')
    : await sql.query('SELECT * FROM gallery_media WHERE is_published = true ORDER BY position ASC, created_at DESC');
  return normalize(rows);
}

export async function addGalleryItem(input: Omit<GalleryItem, 'id' | 'createdAt'>) {
  const sql = database();
  if (!sql) throw new Error('DATABASE_URL is not configured.');
  const rows = await sql.query(
    'INSERT INTO gallery_media (type, title, url, youtube_id, is_published, position) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [input.type, input.title, input.url, input.youtubeId, input.isPublished, input.position],
  );
  return normalize(rows)[0];
}

export async function deleteGalleryItem(id: string) {
  const sql = database();
  if (!sql) throw new Error('DATABASE_URL is not configured.');
  await sql.query('DELETE FROM gallery_media WHERE id = $1', [id]);
}

export async function updateGalleryItem(id: string, input: Pick<GalleryItem, 'title' | 'position' | 'isPublished'>) {
  const sql = database();
  if (!sql) throw new Error('DATABASE_URL is not configured.');
  const rows = await sql.query(
    'UPDATE gallery_media SET title = $1, position = $2, is_published = $3 WHERE id = $4 RETURNING *',
    [input.title, input.position, input.isPublished, id],
  );
  if (!rows.length) throw new Error('رسانه پیدا نشد.');
  return normalize(rows)[0];
}
