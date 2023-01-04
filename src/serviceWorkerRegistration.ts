const localhost: boolean = Boolean(window.location.hostname === 'localhost' || window.location.hostname === '[::1]' || window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/u));

type ServiceWorkerConfig =
{
  onSuccess: (registration: ServiceWorkerRegistration) => void,
  onUpdate: (registration: ServiceWorkerRegistration) => void
};

const registerValidServiceWorker = (swUrl: string, swConfig?: ServiceWorkerConfig): void =>
{
  navigator.serviceWorker.register(swUrl).then((registration): void =>
  {
    registration.onupdatefound = (): void =>
    {
      const serviceWorker: ServiceWorker | null = registration.installing;

      if (serviceWorker !== null)
      {
        serviceWorker.onstatechange = (): void =>
        {
          if (serviceWorker.state === 'installed')
          {
            if (navigator.serviceWorker.controller)
            {
              console.log('New content is available and will be used when all tabs for this page are closed.'); // eslint-disable-line

              if (swConfig && swConfig.onUpdate)
              {
                swConfig.onUpdate(registration);
              }
            }
          }
          else
          {
            console.log('Content is cached for offline use.'); // eslint-disable-line

            if (swConfig && swConfig.onSuccess)
            {
              swConfig.onSuccess(registration);
            }
          }
        };
      }
    };
  })
  .catch(({message}): void =>
  {
    console.log(`Error during service worker registration: ${message}`); // eslint-disable-line
  });
};

const checkValidServiceWorker = (swUrl: string, swConfig?: ServiceWorkerConfig): void =>
{
  fetch(swUrl,
  {
    headers:
    {
      'Service-Worker': 'script'
    }
  })
  .then((response): void =>
  {
    const contentType: string | null = response.headers.get('content-type');

    if (response.status === 404 || (contentType !== null && contentType.indexOf('javascript') === -1))
    {
      navigator.serviceWorker.ready.then((registration): void =>
      {
        registration.unregister().then((): void =>
        {
          window.location.reload();
        });
      });
    }
    else
    {
      registerValidServiceWorker(swUrl, swConfig);
    }
  })
  .catch((): void =>
  {
    console.log('No internet connection found. App is running in offline mode.'); // eslint-disable-line
  });
};

export const register = (swConfig?: ServiceWorkerConfig): void =>
{
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator)
  {
    const publicUrl: URL = new URL(process.env.PUBLIC_URL, window.location.href);

    if (publicUrl.origin === window.location.origin)
    {
      window.addEventListener('load', (): void =>
      {
        const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

        if (localhost)
        {
          checkValidServiceWorker(swUrl, swConfig);

          navigator.serviceWorker.ready.then((): void =>
          {
            console.log('This web app is being served cache-first by a service worker.'); // eslint-disable-line
          });
        }
        else
        {
          registerValidServiceWorker(swUrl, swConfig);
        }
      });
    }
  }
};


export const unregister = (): void =>
{
  if ('serviceWorker' in navigator)
  {
    navigator.serviceWorker.ready.then((registration): void =>
    {
      registration.unregister();
    })
    .catch(({message}): void =>
    {
      console.log(`Error during service worker unregistration: ${message}`); // eslint-disable-line
    });
  }
};
