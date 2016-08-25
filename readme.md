For local running - due to One Signal dependancy, the offline functionality does not work locally.

npm install
npm run dev
localhost:8080

For proper functionality - visit https://stir-recipe.herokuapp.com in Google Chrome (latest version preferably).

Due to the OneSignal dependency, the personal Service Worker does not update unless a full SW update is carried out.

If you have visited the site before, please right click and inspect. Depending on your browser version, either click
on Application or Resources. From there ensure all Service Workers are deleted, IndexedDB and Local Storage are deleted, and cache storage is deleted. You may also have to click on the red notification icon to reset the service worker. This will then give you a fresh experience.

This issue has been tracked on Github after a conversation with the support team https://github.com/OneSignal/OneSignal-Website-SDK/issues/113 . It is also being tracked by developers working on the Service Worker spec at https://jakearchibald.com/2016/service-worker-meeting-notes/. It should be fixed soon.

Please watch the video provided in the assets folder, this gives a demo of the app in use - with and without a network connection. You can control the network through the network tab, either making it offline or throttled. If the network is throttled on the View Posts page - you will notice that the offline posts are painted to the screen immediately, and once the request is successful, the network only posts are also displayed.
