<?php declare(strict_types=1)
/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2019  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 */
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta http-equiv="Accept-CH" content="Device-Memory">
        <title>Lûd</title>

        <!-- favicon, see /icons/README.md -->
        <link rel="apple-touch-icon" sizes="180x180" href="/app-icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/app-icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/app-icons/favicon-16x16.png" />
        <link rel="manifest" href="/app-icons/site.webmanifest" />
        <link rel="mask-icon" href="/app-icons/safari-pinned-tab.svg" color="#c04848" />
        <link rel="shortcut icon" href="/app-icons/favicon.ico" />
        <meta name="apple-mobile-web-app-title" content="L&ucirc;d" />
        <meta name="application-name" content="L&ucirc;d" />
        <meta name="msapplication-TileColor" content="#c04848" />
        <meta name="msapplication-config" content="/app-icons/browserconfig.xml" />
        <meta name="theme-color" content="#dedede" />

        <link rel="stylesheet" href="js/@fortawesome/fontawesome-free/css/all.css" />
        <link rel="stylesheet" href="js/normalize.css/normalize.css" />
        <link rel="stylesheet" href="material-colors.css" />
        <link rel="stylesheet" href="theme.php" />

        <script src="js/react/umd/react.development.js"></script>
        <script src="js/react-dom/umd/react-dom.development.js"></script>
        <script src="js/jss/dist/jss.js"></script>
        <script src="js/jss-preset-default/dist/jss-preset-default.js"></script>
        <script>jss.default.setup(jssPreset.default());</script>
        <script src="js/react-jss/dist/react-jss.js"></script>
        <script type="module" src="components/lud-queue.js"></script>
        <script type="module" src="components/lud-browse-library.js"></script>
        <script type="module" src="components/lud-now-playing.js"></script>
        <script type="module" src="components/lud-tracklist.js"></script>
        <style>
         * { box-sizing: border-box; }

         :root {
/* try this?
54screen width - column widths
< 800px        100vw
< 1200px       50vw
< 1600px       calc(100vw / 3)
*/
             --column-width: 512px;
             --column-count: 4;
             --scrollbar-width: 0px;
         }

         body {
             background: var(--theme-background);
             color: var(--theme-on-background);;
             font-family: Helvetica, Arial, sans-serif;
         }

         html, body, div, section {
             margin: 0;
             border: 0;
             padding: 0;
         }

         .kolom-body {
             width: 100%;
             height: auto;
             font-family: sans-serif;
             scroll-snap-type: x mandatory;
             -webkit-overflow-scrolling: touch;

             display: grid;
             grid-template-columns: repeat(5, var(--column-width));
             grid-template-rows: auto;
             align-content: stretch;
             overflow-x: scroll;
         }

         .kolom-column {
             padding: 1em;
             display: block;
             width: var(--column-width);
             scroll-snap-align: start;
             flex: 0 0 auto;
         }

         .narrow { display: none; }

         @media screen and (max-width: 512px) {
             .kolom-column {
                 width: 100vw;
             }

             .kolom-body {
                 grid-template-columns: repeat(5, 100vw);
             }

             .kolom-tab {
                 text-align: center;
             }

             .narrow { display: initial; }
             .wide { display: none; }
         }

         section { background: --theme-background; }

         #main-menu {
             background: var(--theme-menu-bar);
             color: var(--theme-on-menu-bar);
             margin: 0;
             border: 0;
             height: 54px;
             width: 100%;
         }

         #kolom-drawer,
         #main-menu { padding: 1em; }

         #kolom-drawer > span,
         #main-menu > span { padding-right: 1em; }

         #kolom-drawer {
             width: 320px;
             min-height: 100vh;
             transition-property: transform;
             transition-duration: 0.5s;
         }
         @media screen and (max-width: 340px) {
             #kolom-drawer { width: 100vw; left: -100vw; }
             body[data-open-drawer] #kolom-drawer {
                 transform: translateX(100vw);
             }
         }

         #kolom-drawer li .shortcut { float: right; }

         body[data-open-drawer] #kolom-drawer {
             display: block;
             transform: translateX(320px);
         }
         body[data-open-drawer] .kolom-header,
         body[data-open-drawer] .kolom-body {
             opacity: 0.4;
         }

         #open-drawer, #close-drawer { cursor: pointer; }

         .kolom-header,
         .kolom-body {
             transition-property: opacity;
             transition-duration: 0.5s;
         }

         kbd {
             display: inline-block;
             margin: 0 .1em;
             padding: .1em .6em;
             font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
             font-size: 11px;
             line-height: 1.4;
             border: 1px solid;
             border-radius: 3px;
             white-space: nowrap;
             background: rgba(0, 0, 0, 0.2);
         }

         #kolom-drawer {
             display: block;
             position: absolute;
             top: 0;
             left: -320px;
             background: var(--theme-surface-24dp);
             color: var(--theme-on-surface);
             z-index: 100;
         }

         .kolom-header {
             height: 108px;
             width: 100%;
         }

         .kolom-tabs {
             width: 100%;
             height: 54px;
             flex-flow: row nowrap;
             display: flex;
             justify-content: space-between;
             align-items: stretch;
             cursor: pointer;
         }

         .kolom-tab {
             flex: 1 1 auto;
             white-space: nowrap;
             overflow: hidden;
             text-overflow: ellipsis;
         }

         .kolom-tab { background: var(--theme-surface-01dp); padding: 1em; }

         #lud-queue ul { margin: 0; }

         #lud-library h2.browse-menu { margin-bottom: 0; }
        </style>
    </head>
    <body class="drawer-is-open">
        <div id='kolom-drawer'>
            <span id='close-drawer'>☰</span>
            <span>Main menu</span>
            <ul>
                <li>Add to library</li>
                <li>Library stats</li>
                <li>Settings</li>
                <br />
                <li>Keyboard help <span class="shortcut"><kbd>?</kbd></span></li>
                <li>Colophon</li>
            </ul>
        </div>

        <div class='kolom-header'>
            <nav id='main-menu'>
                <span id='open-drawer'>☰</span>
                <span>Main menu</span>
                <span id='size' style="float: right"></span>
            </nav>
            <div id='main-tabs' class='kolom-tabs'>
                <div class='kolom-tab' data-tab="0">
                    <span class="narrow"><i class="fas fa-eject"></i></span>
                    <span class="wide">Now Playing</span>
                </div>
                <div class='kolom-tab' data-tab="1">
                    <span class="narrow"><i class="fas fa-compact-disc"></i></span>
                    <span class="wide">Tracklist</span>
                </div>
                <div class='kolom-tab' data-tab="2">
                    <span class="narrow"><i class="fas fa-list-alt"></i></span>
                    <span class="wide">Queue</span>
                </div>
                <div class='kolom-tab' data-tab="3">
                    <span class="narrow"><i class="fas fa-music"></i></span>
                    <span class="wide">Library</span>
                </div>
            </div>
        </div>

        <div id='main-sections' class="kolom-body">
            <section class='kolom-column'>
              <lud-now-playing></lud-now-playing>
            </section>

            <section class='kolom-column'>
              <lud-tracklist></lud-tracklist>
            </section>

            <section class='kolom-column'>
                <lud-queue></lud-queue>
            </section>
            <section class='kolom-column'>
                <lud-browse-library></lud-browse-library>
                <div id="lud-library">
                    <h1>Library</h1>
                    <h2 class="browse-menu">Browse</h2>
                    <a href="#">by Artist</a> | <a href="#">by Genre</a> | <a href="#">by Year</a> | <a href="#">file system</a>
                    <h2>Search</h2>
                    <h2>Recently added</h2>
                    <h2>History</h2>
                </div>
            </section>
            <section class='kolom-column' style="display: none">
                <div id="lud-add-to-library">
                    <h1>Add to Library</h1>
                    <h2>Import from...</h2>
                    <ul>
                        <li><h3>Youtube</h3></li>
                        <li><h3>Apple Music</h3></li>
                    </ul>
                    <h2>Upload archive</h2>
                </div>
            </section>
        </div>

        <script type="module">
         function switchTab(event) {
             let newPos = 0;
             const mainSections = document.getElementById('main-sections');
             const tabWidth = document.querySelector('.kolom-column').clientWidth;

             const tab = event.target.closest('.kolom-tab');

             if (tab.dataset.tab == "prev") {
                 newPos = mainSections.scrollLeft - tabWidth;
             } else if (tab.dataset.tab == "next") {
                 newPos = mainSections.scrollLeft + tabWidth;
             } else {
                 const tabNo = parseInt(tab.dataset.tab, 10);
                 newPos = tabNo * tabWidth;
             }

             mainSections.scroll({left: newPos, behavior: "smooth"});
         }

         document.getElementById('main-tabs').addEventListener('click', switchTab);


         function openDrawer(event) {
             event.preventDefault();
             document.querySelector('body').dataset.openDrawer = true;
         }

         function closeDrawer(event) {
             delete document.querySelector('body').dataset.openDrawer;
         }

         document.getElementById('open-drawer').addEventListener('click', openDrawer);
         document.getElementById('close-drawer').addEventListener('click', closeDrawer);
         document.addEventListener('click', event => {
             if (document.getElementById('close-drawer').contains(event.target)
                 || document.getElementById('open-drawer').contains(event.target)
                 || document.getElementById('kolom-drawer').contains(event.target)
             ) {
                 return;
             }

             closeDrawer(event);
         });

         function scrollbarWidth() {
             return window.innerWidth - document.documentElement.clientWidth;
         }

         // Show window size in top-right corner
         function handleResize() {
             const sizeText = window.innerWidth + 'x' + window.innerHeight +
                  (scrollbarWidth() > 0 ? ' [⬍' + scrollbarWidth() + ']' : '');

             document.getElementById("size").innerText = sizeText;
             document.documentElement.style.setProperty('--scrollbar-width', scrollbarWidth() + 'px');
         }

         window.addEventListener("resize", handleResize);
         handleResize();

        </script>
    </body>
</html>
