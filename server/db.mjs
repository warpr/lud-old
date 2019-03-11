/**
 * This file is part of lûd, an opinionated browser based media player.
 * Copyright (C) 2019  Kuno Woudt <kuno@frob.nl>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 *
 * @flow
 */

import { config } from './config.mjs';
import knex from 'knex';

export function db() {
    const cfg = config();

    // $FlowFixMe seems the knex flow types are broken
    return knex({
        client: 'sqlite3',
        connection: {
            filename: cfg.database_filename,
        },
        useNullAsDefault: true,
    });
}
