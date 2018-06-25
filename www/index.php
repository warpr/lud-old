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

        <link href="/lud/js/normalize.css/normalize.css" rel="stylesheet" />
        <link href="/lud/js/@blueprintjs/core/lib/css/blueprint.css" rel="stylesheet" />
        <link href="/lud/js/@blueprintjs/icons/lib/css/blueprint-icons.css" rel="stylesheet" />
        <link href="css/color-aliases.css" rel="stylesheet" />
        <link href="css/layout.css" rel="stylesheet" />

        <link href="/lud/js/font-awesome/css/font-awesome.css" rel="stylesheet" />

        <style>
         body {
             background-color: var(--pt-dark-app-background-color);
         }
        </style>
    </head>
    <body>
        <!-- React -->
        <script src="/lud/js/react/umd/react.development.js"></script>
        <script src="/lud/js/react-dom/umd/react-dom.development.js"></script>

        <!-- Blueprint -->
        <script src="/lud/js/classnames/index.js"></script>
        <script src="/lud/js/dom4/build/dom4.max.js"></script>
        <script src="/lud/js/react-transition-group/dist/react-transition-group.js"></script>

<!--
        <script src="/lud/js/popper.js/dist/popper.js"></script>
        <script src="/lud/js/react-popper/dist/react-popper.js"></script>
-->

        <script src="/lud/js/@blueprintjs/core/dist/core.bundle.js"></script>
        <script src="/lud/js/@blueprintjs/icons/dist/icons.bundle.js"></script>

        <!-- Lûd -->
        <script src="/lud/js/lodash/lodash.js"></script>
        <script src="/lud/js/immutable/dist/immutable.js"></script>
        <script src="/lud/js/immutable-devtools/dist/index.js"></script>
        <script src="/lud/js/lunr/lunr.js"></script>

        <div id="app">Loading...</div>

        <script type="module">
         import * as app from '/lud/app.js';

         app.start(document.querySelector("#app"));

         immutableDevTools(Immutable);
        </script>
    </body>
</html>

