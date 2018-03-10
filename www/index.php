<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width">
        <meta http-equiv="Accept-CH" content="Device-Memory">
        <title>Blueprint Starter Kit</title>
        <link href="https://unpkg.com/normalize.css@^4.1.1" rel="stylesheet" />
        <link href="https://unpkg.com/@blueprintjs/core@^1.11.0/dist/blueprint.css" rel="stylesheet" />
    </head>
    <body>
        <script src="https://unpkg.com/classnames@^2.2"></script>
        <script src="https://unpkg.com/dom4@^1.8"></script>
        <script src="https://unpkg.com/tether@^1.4"></script>
        <script src="https://unpkg.com/react@^15.3.1/dist/react-with-addons.min.js"></script>
        <script src="https://unpkg.com/react-dom@^15.3.1/dist/react-dom.min.js"></script>
        <script src="https://unpkg.com/@blueprintjs/core@^1.11.0"></script>

        <script src="https://unpkg.com/lunr/lunr.js"></script>

        <div id="app">Loading...</div>

        <script type="module">
         import * as app from '/lud/app.js';
         import * as db from '/lud/db.js';

         app.start(document.querySelector("#app"));

         db.loadIndex().then(idx => {
             console.log('searching...', idx.search('*TKO*'));
         });
        </script>
    </body>
</html>

