<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width">
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

        <nav class="pt-navbar pt-dark">
            <div class="pt-navbar-group pt-align-left">
                <div class="pt-navbar-heading">Blueprint</div>
                <input class="pt-input" placeholder="Search files..." type="text" />
            </div>
            <div class="pt-navbar-group pt-align-right">
                <button class="pt-button pt-minimal pt-icon-home">Home</button>
                <button class="pt-button pt-minimal pt-icon-document">Files</button>
                <span class="pt-navbar-divider"></span>
                <button class="pt-button pt-minimal pt-icon-user"></button>
                <button class="pt-button pt-minimal pt-icon-notifications"></button>
                <button class="pt-button pt-minimal pt-icon-cog"></button>
            </div>
        </nav>

        <div id="btn"></div>
        <script>
         const button = React.createElement(Blueprint.Core.Button, {
             iconName: "predictive-analysis",
             text: "CDN Blueprint is go!",
         });
         ReactDOM.render(button, document.querySelector("#btn"));
        </script>
        <script>
         let idx = null;

         function indexAll(db) {
             idx = lunr(function () {
                 this.ref('id');
                 this.field('artist');
                 this.field('title');
                 this.field('disc');
                 this.field('song');
                 this.metadataWhitelist = ['position'];

                 Object.keys(db.artists).forEach(id => {
                     this.add({ id: id, name: db.artists[id] });
                 }, this);
             });

             window.db = db;
             window.idx = idx;
             console.log(idx.search('*londo*'));
         }

         fetch('cache/index.json')
             .then(response => response.json())
             .then(indexAll)
        </script>
    </body>
</html>

