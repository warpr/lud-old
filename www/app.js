/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2016  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 */

const e = React.createElement;

export function nav_bar() {
    return e('nav', {className: "pt-navbar pt-dark"}, [
        e('div', {className: "pt-navbar-group pt-align-left"},
          e('div', {className: "pt-navbar-heading"}, "Blueprint"),
          e('input', {className: "pt-input", placeholder: "Search...", type: "text"})
         ),
        e('div', {className: "pt-navbar-group pt-align-right"}, [
            e('button', {className: "pt-button pt-minimal pt-icon-home"}, 'Home'),
            e('button', {className: "pt-button pt-minimal pt-icon-document"}, 'Files'),
            e('span', {className: "pt-navbar-divider"}),
            e('button', {className: "pt-button pt-minimal pt-icon-user"}),
            e('button', {className: "pt-button pt-minimal pt-icon-notifications"}),
            e('button', {className: "pt-button pt-minimal pt-icon-cog"}),
        ]),
    ]);
}

export function start(app_div) {
    const style = {
        padding: 0,
        margin: 0,
        border: 0
    };

    const app = e('div', {style: style}, [
        nav_bar(),
        e(Blueprint.Core.Button, {
             iconName: "document",
             text: "Device memory: " + navigator.deviceMemory,
        })
    ]);

    ReactDOM.render(app, app_div);
}

/*
class Hello extends React.Component {
  render() {
    return <div>Hello {this.props.toWhat}</div>;
  }
}

ReactDOM.render(
  <Hello toWhat="World" />,
  document.getElementById('root')
);
can be compiled to this code that does not use JSX:

class Hello extends React.Component {
  render() {
    return React.createElement('div', null, `Hello ${this.props.toWhat}`);
  }
}

ReactDOM.render(
  React.createElement(Hello, {toWhat: 'World'}, null),
  document.getElementById('root')
);
*/

