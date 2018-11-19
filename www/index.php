<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta http-equiv="Accept-CH" content="Device-Memory">
        <title>Loading... | Lûd</title>

        <!-- favicon, see /icons/README.md -->
        <link rel="apple-touch-icon" sizes="180x180" href="/lud/icons/apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="32x32" href="/lud/icons/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/lud/icons/favicon-16x16.png">
        <link rel="manifest" href="/lud/icons/site.webmanifest">
        <link rel="mask-icon" href="/lud/icons/safari-pinned-tab.svg" color="#c04848">
        <link rel="shortcut icon" href="/lud/icons/favicon.ico">
        <meta name="apple-mobile-web-app-title" content="L&ucirc;d">
        <meta name="application-name" content="L&ucirc;d">
        <meta name="msapplication-TileColor" content="#c04848">
        <meta name="msapplication-config" content="/lud/icons/browserconfig.xml">
        <meta name="theme-color" content="#dedede">

        <!-- Material UI -->
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        <link rel="stylesheet" href="/lud/js/@material/slider/dist/mdc.slider.css" />

        <link href="/lud/js/font-awesome/css/font-awesome.css" rel="stylesheet" />

        <link rel="stylesheet" href="/lud/media-controls.css" />
        <style>
         div#app {
             min-height: 100vh;
             position: relative;
         }

         :root {
             --connected-color:     #fff;
             --disconnected-color:  #fff;
         }
        </style>
    </head>
    <body>
        <!-- Mobile Console -->
        <script src="/lud/hnl.mobileConsole.js"></script>

        <!-- polyfills -->
        <script src="/lud/js/abortcontroller-polyfill/dist/umd-polyfill.js"></script>

        <!-- React -->
        <script src="/lud/js/react/umd/react.development.js"></script>
        <script src="/lud/js/react-dom/umd/react-dom.development.js"></script>

        <!-- Styled Components -->
        <script src="/lud/js/styled-components/dist/styled-components.js"></script>

        <!-- Material UI -->
        <script src="/lud/js/@material-ui/core/umd/material-ui.development.js"></script>
        <script src="/lud/js/@material/slider/dist/mdc.slider.js"></script>

        <!-- ReactiveX -->
        <!-- Not currently used.
        <script src="/lud/js/@reactivex/rxjs/dist/global/rxjs.umd.js"></script>
        -->

        <!-- Immutable -->
        <script src="/lud/js/immutable/dist/immutable.js"></script>
        <script src="/lud/js/immutable-devtools/dist/index.js"></script>

        <!-- Lûd -->
        <script src="/lud/js/lodash/lodash.js"></script>
        <script src="/lud/js/lunr/lunr.js"></script>

        <div id="app">Loading...</div>

        <script type="module">
         import * as app from '/lud/app.js';

         const ua = navigator.userAgent.toLowerCase();
         const isAndroid = ua.indexOf("android") > -1;

         if (isAndroid) {
             mobileConsole.init();

             setTimeout(() => {
                 app.start(document.querySelector("#app"));
                 mobileConsole.toggle();
             }, 1000);
         } else {
             app.start(document.querySelector("#app"));
             immutableDevTools(Immutable);
         }

        </script>
        <script src="https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1"></script>
    </body>
</html>

