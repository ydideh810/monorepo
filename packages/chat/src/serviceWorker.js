const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' || // IPv6 localhost
  window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/) // IPv4 localhost
)

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister()
      })
      .catch((error) => {
        console.error(error.message)
      })
  }
}

export function register(config) {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      return // Prevent registration if origin doesn't match
    }

    // Function declarations moved to the root of the function body
    const registerValidSW = (swUrl, configParam) => {
      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker == null) {
              return;
            }
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  console.log(
                    'New content is available and will be used when all tabs for this page are closed. See https://bit.ly/CRA-PWA.'
                  );
                  if (configParam && configParam.onUpdate) {
                    configParam.onUpdate(registration);
                  }
                } else {
                  console.log('Content is cached for offline use.');
                  if (configParam && configParam.onSuccess) {
                    configParam.onSuccess(registration);
                  }
                }
              }
            };
          };
        })
        .catch((error) => {
          console.error('Error during service worker registration:', error);
        });
    };

    const checkValidServiceWorker = (swUrl, configParam) => {
      fetch(swUrl, {
        headers: { 'Service-Worker': 'script' },
      })
        .then((response) => {
          const contentType = response.headers.get('content-type');
          if (
            response.status === 404 ||
            (contentType != null && contentType.indexOf('javascript') === -1)
          ) {
            navigator.serviceWorker.ready.then((registration) => {
              registration.unregister().then(() => {
                window.location.reload();
              });
            });
          } else {
            registerValidSW(swUrl, configParam)
          }
        })
        .catch(() => {
          console.log('No internet connection found. App is running in offline mode.')
        })
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`

      if (isLocalhost) {
        checkValidServiceWorker(swUrl, config)

        navigator.serviceWorker.ready.then(() => {
          console.log(
            'This web app is being served cache-first by a service worker. To learn more, visit https://bit.ly/CRA-PWA'
          )
        })
      } else {
        registerValidSW(swUrl, config)
      }
    })
  }
}
