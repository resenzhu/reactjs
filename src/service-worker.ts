import {createHandlerBoundToURL, precacheAndRoute} from 'workbox-precaching';
import {ExpirationPlugin} from 'workbox-expiration';
import {StaleWhileRevalidate} from 'workbox-strategies';
import {clientsClaim} from 'workbox-core';
import {registerRoute} from 'workbox-routing';

declare const self: ServiceWorkerGlobalScope; // eslint-disable-line

const fileExtensionRegExp: string = '/[^/?]+\\.[^/]+$u';

clientsClaim();

precacheAndRoute(self.__WB_MANIFEST); // eslint-disable-line

registerRoute(({request, url}:
{
  request: Request;
  url: URL
})
: boolean =>
{
  if (request.mode !== 'navigate')
  {
    return false;
  }

  if (url.pathname.startsWith('/_'))
  {
    return false;
  }

  if (url.pathname.match(fileExtensionRegExp))
  {
    return false;
  }

  return true;
},
createHandlerBoundToURL(`${process.env.PUBLIC_URL}/index.html`));

registerRoute(({url}:
{
  url: URL
})
: boolean =>
{
  const extensions: string[] = ['.jpg', '.png', '.svg', '.ico'];

  return url.origin === self.location.origin && extensions.some((extension) => url.pathname.endsWith(extension));
},
new StaleWhileRevalidate(
{
  cacheName: 'images',
  plugins:
  [
    new ExpirationPlugin(
    {
      maxEntries: 50
    })
  ]
}));

self.addEventListener('message', (event: ExtendableMessageEvent): void =>
{
  if (event.data && event.data.type === 'SKIP_WAITING')
  {
    self.skipWaiting();
  }
});
