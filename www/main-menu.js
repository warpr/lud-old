/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2018  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 */

import { SearchInput } from '/lud/search-input.js';

const e = React.createElement;

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error, info) {
        this.setState({ hasError: true });
        console.log("Some error happened!", error, info);
    }

    render() {
        if (this.state.hasError) {
            return e('span', {});
        }

        return this.props.children;
    }
}

export class MainMenu extends React.Component {
    render() {
        return e(Blueprint.Core.Navbar, { className: "pt-dark" }, [
            e(Blueprint.Core.NavbarGroup, { key: "left", align: Blueprint.Core.Alignment.LEFT }, [
                e(Blueprint.Core.NavbarHeading, { key: "name" }, "Lûd"),
                e(SearchInput, { key: "search" }),
            ]),
            e(Blueprint.Core.NavbarGroup, { key: "right", align: Blueprint.Core.Alignment.RIGHT }, [
                e(ErrorBoundary, { key: "error-boundary" }, [
                // e(Blueprint.Core.Button, { key: "home", className: "pt-minimal", icon: "home" }, "Home"),
                // e(Blueprint.Core.Button, { key: "document", className: "pt-minimal", icon: "document" }, "Files"),
                // e(Blueprint.Core.NavbarDivider, { key: "divider" }),
                // e(Blueprint.Core.Button, { key: "user", className: "pt-minimal", icon: "user" }),
                // e(Blueprint.Core.Button, { key: "notifications", className: "pt-minimal", icon: "notifications" }),
                // e(Blueprint.Core.Button, { key: "cog", className: "pt-minimal", icon: "cog" }),
                ])
            ])
        ]);
    }
}

