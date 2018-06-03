/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2016  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 */

const e = React.createElement;

export class SearchInput extends React.Component {
    constructor(props) {
        super(props);

        this.state = { query: '' };
        this.handleChange = this.handleChange.bind(this);

        this.search = _.debounce(
            value => {
                PubSub.publish('search-query', value);
            },
            300,
            { maxWait: 1000 }
        );

        setTimeout(() => {
            const value = 'calle';

            PubSub.publish('search-query', value);
            this.setState({ query: value });
        }, 1000);
    }

    handleChange(event) {
        const value = event.target.value;

        this.setState({ query: value });
        this.search(value);
    }

    render() {
        const attr = {
            className: 'pt-input',
            onChange: this.handleChange,
            placeholder: 'Search...',
            type: 'text',
            value: this.state.query,
        };

        return e('input', attr);
    }
}
