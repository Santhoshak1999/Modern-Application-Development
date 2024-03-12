(function () 
{
    //method that runs when a service worker is installed for the first time
    self.addEventListener('install', event => {
        console.log("service worker is installing");
        //loading static html into cache first

        event.waitUntil(
            caches.open('PWD_app')
            .then(cache => 
                cache.addAll([
                    '/git'
                ])
                )
        )
        self.skipWaiting();
    })

    //Method that runs when the service worker is wainted
    self.addEventListener('activate', event  => {
        event.waitUntil(
            caches.delete('PWD_app')
        );
        console.log('service worker is activating');

    })

    //method that will run when the app make getch calls
    self.addEventListener('fetch', event => {
        console.log("fetching", event.request.url);
        event.responseWith(
            //cheking if the response is already is available on the cache
            caches.match(event.request)
            .then(async (response) => {
                if(response){
                    //found response in the cache
                    return response;
                }
                //loading the fetch responses into the cache
                let data = fetch(event.request);
                let data_clone = (await data).clone();
                event.waitUntil(caches.open('PWD_app')
                .then(cache => cache.put(event.request.data_clone)));
                return data; 
            })
        )

    })
})