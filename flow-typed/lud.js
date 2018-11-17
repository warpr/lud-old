/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2018  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 */

/**
 * AbortController isn't in flow-typed yet, see:
 *
 *     https://github.com/flow-typed/flow-typed/issues/1652
 */

declare interface AbortSignal extends EventTarget {
    +aborted: boolean;
    onabort: EventHandler;
}

declare class AbortController {
    +signal: AbortSignal;
    abort: () => void;
}
