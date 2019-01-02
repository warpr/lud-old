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

const loremIpsum = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
    'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.',
    'Nullam arcu sapien, luctus a justo feugiat, convallis sagittis nisl. Vestibulum quis consectetur nulla. Fusce sem ante, tempor eget dolor et, fermentum lacinia nisl. Fusce est felis, commodo quis dapibus id, mollis sed eros. Integer ornare pharetra eleifend. Integer elementum ut erat id semper. Suspendisse luctus nec velit ac convallis. In eu imperdiet sapien.',
];

var loremIdx = 0;

function randomLorem() {
    return loremIpsum[~~(loremIpsum.length * Math.random())];
}

function nextLorem() {
    if (loremIdx >= loremIpsum.length) {
        loremIdx = 0;
    }

    return loremIpsum[loremIdx++];
}

function MainMenu(props) {
    return e(
        'nav',
        { id: 'main-menu' },
        e('span', {}, '☰'),
        e('span', {}, 'Main menu'),
        e('span', { id: 'size', style: { float: 'right' } })
    );
}

function TitleBarButton(props) {
    return e('div', { className: 'lud-ColumnLayout-TitleBarButton' }, props.left ? '◀' : '▶');
}

function Title(props) {
    return e('div', { className: 'lud-ColumnLayout-Title' }, props.children);
}

function TitleBar(props) {
    const titles = React.Children.toArray(props.children).map((child, idx) =>
        e(Title, { key: 'title-' + idx }, child.props.title)
    );

    const parts = [e(TitleBarButton, { key: 'title-left', left: true })]
        .concat(titles)
        .concat([e(TitleBarButton, { key: 'title-right', right: true })]);

    return e('div', { className: 'lud-ColumnLayout-TitleBar' }, parts);
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

    document.documentElement.style.setProperty('--column-count', children.length);

    return e(
        'div',
        { className: 'lud-ColumnLayout' },
        e(
            'div',
            { className: 'lud-ColumnLayout-HeaderContainer' },
            e(
                'div',
                { className: 'lud-ColumnLayout-Header' },
                e(MainMenu, {}),
                e(TitleBar, {}, children)
            )
        ),
        e('div', { className: 'lud-ColumnLayout-Content' }, children)
    );
}

export function Column(props) {
    const children = React.Children.toArray(props.children);
    return e(
        'div',
        { className: 'lud-ColumnLayout-Column' },
        e('h1', {}, children),
        e('p', {}, nextLorem()),
        e('p', {}, nextLorem()),
        e('p', {}, nextLorem())
    );
}
