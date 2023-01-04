/* eslint-disable */

'use strict';

const Sitemap = require('react-router-sitemap').default;
const router = require('./routes/sitemap').default;

/* eslint-enable */

const generateSitemap = () =>
{
  const sitemaps = new Sitemap(router).build('https://resen-reactjs.netlify.app');

  for (const url of sitemaps.sitemaps[0].urls)
  {
    switch (url.url)
    {
      case '/':
        url.changefreq = 'weekly';
        url.priority = 1.0;
        break;

      case '/project/the-lounge':
        url.changefreq = 'weekly';
        url.priority = 0.7;
        break;

      default:
        url.changefreq = 'monthly';
        url.priority = 0.3;
        break;
    }

    url.lastmod = new Date();
  }

  sitemaps.save('./public/sitemap.xml');
};

generateSitemap();
