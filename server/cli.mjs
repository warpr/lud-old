/**
 * This file is part of lûd, an opinionated browser based media player.
 * Copyright (C) 2019  Kuno Woudt <kuno@frob.nl>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 *
 * @flow
 */

// 7PPB241

import { db } from './db.mjs';
import { help } from './help.mjs';

function init() {
    const knex = db();

    //     $createdDatabase = false;
    //     if (!Devices::exists()) {
    //         Devices::create();
    //         $createdDatabase = true;
    //     }

    //     if (!Index::exists()) {
    //         Index::create();
    //         $createdDatabase = true;
    //     }

    //     if (!Playlist::exists()) {
    //         Playlist::create();
    //         $createdDatabase = true;
    //     }

    //     if ($createdDatabase) {
    //         fixPermissions();
    //     }
}

export function main(project_root /*: string */, argv /*: Array<string> */) {
    if (argv.length < 3) {
        help();
        return;
    }

    argv.shift(); // node cmd
    argv.shift(); // lud script

    const action = argv.shift();

    if (['--help', '-h', 'help'].includes(action)) {
        console.log('help action yeah');
        help();
        return;
    }

    init();

    console.log('Unknown command:', action, argv.join(' '));
}

// function main($argv)
// {

//     init();

//     switch ($command) {
//         case "add-last":
//             ludAddLast($argv);
//             break;
//         case "list":
//             listPlaylist();
//             break;
//         case "reset-databases":
//             Devices::reset();
//             // Don't reset the index, as it takes a long time to rebuild... and it is
//             // reset automatically whenever it is rebuilt.
//             Playlist::reset();
//             fixPermissions();
//             break;
//         case "clear":
//             clearPlaylist();
//             break;
//         case "np":
//         case "now-playing":
//             nowPlayingCommand();
//             break;
//         case "status":
//             statusCommand();
//             break;
//         case "pause":
//             pauseCommand();
//             break;
//         case "play":
//             playCommand();
//             break;
//         case "search":
//             searchCommand($argv);
//             break;
//         case "index":
//             $cmd = array_shift($argv);
//             $terms = implode(" ", $argv);
//             updateIndex($terms);
//             fixPermissions();
//             break;
//         default:
//             help();
//     }
// }
