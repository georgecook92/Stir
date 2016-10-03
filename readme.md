Node API is available at https://github.com/georgecook92/StirAPI

For local running - due to One Signal dependancy, the offline functionality does not work locally.

npm install

npm run dev

localhost:8080

For proper functionality - visit https://stir-recipe.herokuapp.com in Google Chrome (latest version preferably).

Due to the OneSignal dependency, the personal Service Worker does not update unless a full SW update is carried out.

If you have visited the site before, please reset your notifications permission settings. To do this, simply click on the https lock logo, and a list of permissions should appear. Click on the notifications logo and set it to use global default (Ask).

Please right click and inspect the page. Depending on your browser version, either click
on Application or Resources. From there ensure all Service Workers are deleted, IndexedDB and Local Storage are deleted, and cache storage is deleted and then refresh the page. You may also have to click on the red notification icon to reset the service worker. This will then give you a fresh experience.

This issue has been tracked on Github after a conversation with the support team https://github.com/OneSignal/OneSignal-Website-SDK/issues/113 . It is also being tracked by developers working on the Service Worker spec at https://jakearchibald.com/2016/service-worker-meeting-notes/. It should be fixed soon.

Once this bug is fixed, it will make the platform much more stable and easy to set up. If this were a production app, I would remove the push notifications, and add them back in once it has been stabilised.

Note, the developer tools can be a bit buggy - so if things are not behaving as expected, close your browser completely and start again. Any issues please contact me. 

Please watch the video provided in the assets folder, this gives a demo of the app in use - with and without a network connection. You can control the network through the network tab, either making it offline or throttled. If the network is throttled on the View Posts page - you will notice that the offline posts are painted to the screen immediately, and once the request is successful, the network only posts are also displayed.
