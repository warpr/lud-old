<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width">
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

        <link href="https://unpkg.com/normalize.css@^7.0.0" rel="stylesheet" />
        <link href="https://unpkg.com/@blueprintjs/core@^2.0.0/lib/css/blueprint.css" rel="stylesheet" />
        <link href="https://unpkg.com/@blueprintjs/icons@^2.0.0/lib/css/blueprint-icons.css" rel="stylesheet" />
        <link href="css/color-aliases.css" rel="stylesheet" />

        <style>
         body {
             background-color: var(--pt-dark-app-background-color);
         }
        </style>
    </head>
    <body>
        <!-- React -->
        <script crossorigin src="https://unpkg.com/react@16/umd/react.development.js"></script>
        <script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>

        <!-- Blueprint -->
        <script src="https://unpkg.com/classnames@^2.2"></script>
        <script src="https://unpkg.com/dom4@^1.8"></script>
        <script src="https://unpkg.com/react-transition-group@^2.2.1/dist/react-transition-group.js"></script>
<!--
        <script src="https://unpkg.com/popper.js@^1.12.6/dist/umd/popper.js"></script>
        <script src="https://unpkg.com/react-popper@~0.7.4/dist/react-popper.js"></script>
-->
        <script src="https://unpkg.com/@blueprintjs/core@^2.0.0"></script>
        <script src="https://unpkg.com/@blueprintjs/icons@^2.0.0"></script>

        <!-- Lûd -->
        <script src="https://cdn.jsdelivr.net/npm/lodash@4/lodash.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/immutable@3/dist/immutable.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/pubsub-js@1/src/pubsub.min.js"></script>
        <script src="https://unpkg.com/lunr/lunr.js"></script>

        <div id="app">Loading...</div>

        <script type="module">
         import * as app from '/lud/app.js';
         import * as db from '/lud/db.js';

         app.start(document.querySelector("#app"));
         db.loadIndex();
        </script>
    </body>
</html>

