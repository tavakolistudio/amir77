# راه‌اندازی گالری در Vercel

1. در Vercel Marketplace، یک **Vercel Blob** و یک **Neon Postgres** به همین پروژه متصل کنید. این کار متغیرهای `BLOB_READ_WRITE_TOKEN` و `DATABASE_URL` را در Vercel اضافه می‌کند.
2. در Neon SQL Editor، محتوای `database/gallery-media.sql` را اجرا کنید.
3. در Project Settings → Environment Variables، دو مقدار امن اضافه کنید: `ADMIN_PASSWORD` و `ADMIN_SESSION_SECRET`. برای مقدار دوم، یک رشته تصادفی طولانی (حداقل 32 کاراکتر) انتخاب کنید.
4. یک Deploy جدید اجرا کنید. پنل از مسیر `/admin` و گالری عمومی از مسیر `/tr/gallery` در دسترس است.

فقط حساب‌های دارای `ADMIN_PASSWORD` می‌توانند رسانه اضافه یا حذف کنند. تصاویر تا ۱۰ مگابایت پذیرفته می‌شوند و ویدیوها با لینک استاندارد YouTube یا `youtu.be` ثبت می‌شوند.
