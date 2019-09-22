/**
 * This file is part of lûd, an opinionated browser based media player.
 * Copyright 2019 Kuno Woudt <kuno@frob.nl>
 * SPDX-License-Identifier: copyleft-next-0.3.1
 */

const e = React.createElement;

export function registerComponent(tag, reactComponent) {
    customElements.define(
        tag,
        class extends HTMLElement {
            connectedCallback() {
                ReactDOM.render(e(reactComponent), this);
            }
        },
    );
}
