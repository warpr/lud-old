<?php declare(strict_types=1);
/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2019  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 */

header('Content-Type: text/css');

/*

Light theme
===========

See: https://material.io/design/color/dark-theme.html#ui-application

A primary color is the color displayed most frequently across
your app’s screens and components.

A secondary color provides more ways to accent and distinguish your
product. Having a secondary color is optional, and should be applied
sparingly to accent select parts of your UI.

Secondary colors are best for:

- Floating action buttons
- Selection controls, like sliders and switches
- Highlighting selected text
- Progress bars
- Links and headlines

Surface, background, and error colors typically don’t represent brand:

Surface colors affect surfaces of components, such as cards, sheets, and menus.
The background color appears behind scrollable content.
Error color indicates errors in components.

Dark theme
==========

The baseline Material Design dark theme uses the 200 tone of the
primary color.

When displaying elevated surfaces, consult
https://material.io/design/color/dark-theme.html#properties

*/

$lightTheme = "
    --theme-background: white;
    --theme-on-background: black;
    --theme-surface: white;
    --theme-on-surface: black;

    --theme-surface-00dp: white;
    --theme-surface-01dp: white;
    --theme-surface-02dp: white;
    --theme-surface-03dp: white;
    --theme-surface-04dp: white;
    --theme-surface-06dp: white;
    --theme-surface-08dp: white;
    --theme-surface-12dp: white;
    --theme-surface-16dp: white;
    --theme-surface-24dp: white;

    --theme-primary: var(--color-red-500);
    --theme-on-primary: white;

    --theme-menu-bar: var(--theme-primary);
    --theme-on-menu-bar: var(--theme-on-primary);
";

$darkTheme = "
    --theme-background: black;
    --theme-on-background: white;
    --theme-surface: #121212;
    --theme-on-surface: white;

    --theme-surface-00dp: #121212;
    --theme-surface-01dp: #1e1e1e;
    --theme-surface-02dp: #232323;
    --theme-surface-03dp: #252525;
    --theme-surface-04dp: #272727;
    --theme-surface-06dp: #2c2c2c;
    --theme-surface-08dp: #2f2f2f;
    --theme-surface-12dp: #333333;
    --theme-surface-16dp: #353535;
    --theme-surface-24dp: #383838;

    --theme-primary: var(--color-red-200);
    --theme-on-primary: black;

    --theme-menu-bar: var(--theme-surface-06dp);
    --theme-on-menu-bar: var(--theme-on-surface);
";
?>
html {
    <?= $lightTheme ?>
}

html.theme-force-dark {
    <?= $darkTheme ?>
}

@media screen and (prefers-color-scheme: dark) {
    html:not(.theme-force-light) {
        <?= $darkTheme ?>
    }
}

a { color: inherit; }
