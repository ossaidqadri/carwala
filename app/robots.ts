import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/maintenance',
        '/_next/',
        '/admin',
      ],
    },
    sitemap: 'https://carwala.org/sitemap.xml',
  };
}
