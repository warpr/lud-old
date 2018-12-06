/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2018  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 *
 *   @flow
 */

const React = window.React;
const e = React.createElement;

function TitleBar(props) {
    const titles = React.Children.toArray(props.children).map(child => child.props.title);

    return e('div', { className: 'lud-column-layout-title-bar' }, titles);
}

export function ColumnLayout(props) {
    const children = React.Children.toArray(props.children).filter(child => {
        if (child.type == Column) {
            return true;
        } else {
            console.log(
                'WARNING: only Columns are allowed as children of a ColumnLayout (found',
                child.type,
                'instead)'
            );
        }
    });
    return e('div', {}, e(TitleBar, {}, children), e('div', {}, children));
}

export function Column(props) {
    const children = React.Children.toArray(props.children);
    return e('h1', {}, children);
}
