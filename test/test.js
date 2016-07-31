/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2016  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 */

'use strict';

(function (factory) {
    const imports = [
        'require',
        'chai',
        '../lib/lûd',
    ];

    if (typeof define === 'function' && define.amd) {
        define (imports, factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory (require);
    } else {
        console.log ('Module system not recognized, please use AMD or CommonJS');
    }
} (function (require) {
    const assert = require ('chai').assert;
    const lûd = require ('../lib/lûd');

    suite ('import', function () {
        test ('discFileType', function () {
            const extensions = ['.mp3', '.flac', '.ogg'];

            const gantzGrafOgg = [
                '01. Gantz Graf.ogg',
                '02. Dial..ogg',
                '03. Cap.IV.ogg',
            ];

            assert.equal ('.ogg', lûd.discFileType (gantzGrafOgg, extensions));

            const gantzGrafMixed = [
                '01. Gantz Graf.mp3',
                '02. Dial..ogg',
                '03. Cap.IV.ogg',
            ];

            assert.throws (lûd.discFileType.bind (this, gantzGrafMixed, extensions));
        });
    });
}));

// -*- mode: javascript-mode -*-
