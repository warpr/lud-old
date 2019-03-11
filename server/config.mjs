/**
 * This file is part of lûd, an opinionated browser based media player.
 * Copyright (C) 2019  Kuno Woudt <kuno@frob.nl>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 */

import path from 'path';

export function config() {
    const project_root = path.dirname(path.dirname(new URL(import.meta.url).pathname));
    const database_filename = project_root + '/data/lud.sqlite';

    return { project_root, database_filename };
}
