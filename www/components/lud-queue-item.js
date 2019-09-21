customElements.define(
    'lud-queue-item',
    class extends HTMLElement {
        shadowRoot = null;

        constructor() {
            super();

            this.shadowRoot = this.attachShadow({ mode: 'open' });
            this.shadowRoot.append(
                document.getElementById('lud-queue-item').content.cloneNode(true),
            );
        }

        connectedCallback() {
            this.shadowRoot.querySelectorAll('[data-lud-attributes]').forEach(elem => {
                elem.dataset.ludAttributes.split(' ').map(attr => {
                    if (this.hasAttribute(attr)) {
                        elem[attr] = this.getAttribute(attr);
                    }
                });
            });
        }
    },
);
