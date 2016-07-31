/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2016  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 */

'use strict';

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define (['require', './namespace', './query', './tools'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory (require);
    } else {
        console.log ('Module system not recognized, please use AMD or CommonJS');
    }
} (function (require) {
    const _s = require ('underscore.string');

    function discFileType (filenames, extensions) {
        let discType = null;
        filenames.map (filename => {
            extensions.map (ext => {
                if (_s (filename).endsWith (ext)) {
                    if (!discType) {
                        discType = ext;
                    } else if (discType !== ext) {
                        throw new Error ('ERROR: disc consists of files in different formats')
                    }
                }
            })
        });

        return discType;
    }


    return {
        discFileType: discFileType
    };
}));
