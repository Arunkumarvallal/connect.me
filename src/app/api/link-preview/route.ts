import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Missing url param' }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; ConnectMeBot/1.0; +https://connect.me)',
        Accept: 'text/html',
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const html = await res.text();

    const get = (property: string): string | undefined => {
      // og:<property>
      const ogMatch = html.match(
        new RegExp(
          `<meta[^>]+property=["']og:${property}["'][^>]+content=["']([^"']+)["']`,
          'i'
        )
      );
      if (ogMatch) return ogMatch[1];
      // twitter:
      const twMatch = html.match(
        new RegExp(
          `<meta[^>]+name=["']twitter:${property}["'][^>]+content=["']([^"']+)["']`,
          'i'
        )
      );
      if (twMatch) return twMatch[1];
      return undefined;
    };

    const titleTagMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const titleFallback = titleTagMatch?.[1]?.trim();

    const origin = new URL(url).origin;

    // Try common favicon locations
    const faviconMatch = html.match(
      /<link[^>]+rel=["'](?:shortcut )?icon["'][^>]+href=["']([^"']+)["']/i
    );
    const faviconHref = faviconMatch?.[1];
    const favicon = faviconHref
      ? faviconHref.startsWith('http')
        ? faviconHref
        : `${origin}${faviconHref.startsWith('/') ? '' : '/'}${faviconHref}`
      : `${origin}/favicon.ico`;

    const imageUrl = get('image');
    const resolvedImage =
      imageUrl && !imageUrl.startsWith('http')
        ? `${origin}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`
        : imageUrl;

    return NextResponse.json({
      title: get('title') ?? titleFallback ?? url,
      description: get('description'),
      image: resolvedImage,
      siteName: get('site_name'),
      favicon,
      url,
    });
  } catch (err) {
    console.error('[link-preview]', err);
    return NextResponse.json({ error: 'Failed to fetch preview' }, { status: 500 });
  }
}
