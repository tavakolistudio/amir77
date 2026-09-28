import { NextResponse } from 'next/server';
import { del, put } from '@vercel/blob';
import { isAdmin } from '../../../lib/admin-auth';
import { addGalleryItem, deleteGalleryItem, getGalleryItems, updateGalleryItem, youtubeIdFromUrl } from '../../../lib/gallery';

function unauthorized() { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }

export async function GET() {
  if (!(await isAdmin())) return unauthorized();
  return NextResponse.json(await getGalleryItems(true));
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return unauthorized();
  try {
    const form = await request.formData();
    const type = String(form.get('type') || '');
    const title = String(form.get('title') || '').trim();
    const position = Number(form.get('position') || 0);
    const isPublished = form.get('isPublished') !== 'false';
    if (!title) return NextResponse.json({ error: 'عنوان الزامی است.' }, { status: 400 });
    if (type === 'video') {
      const url = String(form.get('url') || '').trim();
      const youtubeId = youtubeIdFromUrl(url);
      if (!youtubeId) return NextResponse.json({ error: 'لینک معتبر یوتیوب وارد کنید.' }, { status: 400 });
      return NextResponse.json(await addGalleryItem({ type, title, url, youtubeId, isPublished, position }));
    }
    const file = form.get('file');
    if (!(file instanceof File) || !file.size || !file.type.startsWith('image/')) return NextResponse.json({ error: 'یک فایل تصویر معتبر انتخاب کنید.' }, { status: 400 });
    if (file.size > 10 * 1024 * 1024) return NextResponse.json({ error: 'حداکثر حجم هر عکس ۱۰ مگابایت است.' }, { status: 400 });
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
    const blob = await put(`gallery/${Date.now()}-${safeName}`, file, { access: 'public' });
    return NextResponse.json(await addGalleryItem({ type: 'image', title, url: blob.url, youtubeId: null, isPublished, position }));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'ذخیره‌سازی انجام نشد.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdmin())) return unauthorized();
  try {
    const { id, url, type } = await request.json();
    if (type === 'image' && typeof url === 'string' && url.includes('.blob.vercel-storage.com')) await del(url);
    await deleteGalleryItem(String(id));
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'حذف انجام نشد.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdmin())) return unauthorized();
  try {
    const body = await request.json();
    const id = typeof body.id === 'string' ? body.id : '';
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const position = Number(body.position);
    if (!id || !title || !Number.isInteger(position) || position < 0) return NextResponse.json({ error: 'اطلاعات رسانه معتبر نیست.' }, { status: 400 });
    return NextResponse.json(await updateGalleryItem(id, { title, position, isPublished: Boolean(body.isPublished) }));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'ویرایش انجام نشد.' }, { status: 500 });
  }
}
