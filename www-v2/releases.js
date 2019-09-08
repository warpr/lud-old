/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2018  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 *
 *   @flow
 */

/*::
import { type SearchResultItem } from '/lud/search-rest.js';
*/
import { listRest } from '/lud/search-rest.js';

const React = window.React;
const e = React.createElement;
const M = window['material-ui'];

function bestSize() {
    const availableWidth = window.innerWidth - 60;
    const padding = 10;

    const start = 200 + padding + padding;
    const end = 250 + padding + padding;

    let bestWidth = start;
    let bestRemainder = end;
    for (let i = start; i < end; i++) {
        const left = availableWidth % i;
        if (left < bestRemainder) {
            bestRemainder = left;
            bestWidth = i;
        }
    }

    console.log('selected', bestWidth, 'with a remainder of', bestRemainder);

    return bestWidth;
}

/* function searchResultClicked(cueFile, type, trackNo) {
 *     if (type === 'release') {
 *         window.lûd.glue.loadMedia(cueFile, 0).then(() => {
 *             window.lûd.glue.play(0);
 *         });
 *     } else {
 *         window.lûd.glue.loadMedia(cueFile, trackNo).then(() => {
 *             window.lûd.glue.play(trackNo);
 *         });
 *     }
 * }
 * 
 * function searchResultCard(result) {
 *     const { artist, cueFile, mbid, pos, title, type } = result;
 *     const body = 'by ' + artist;
 * 
 *     return e(
 *         M.ListItem,
 *         { button: true, key: mbid, onClick: e => searchResultClicked(cueFile, type, pos) },
 *         e(M.ListItemAvatar, {}, e(M.Avatar, {}, e(M.Icon, {}, 'folder'))),
 *         e(M.ListItemText, { primary: title, secondary: body }),
 *         e(M.ListItemSecondaryAction, {}, e(M.IconButton, {}, e(M.Icon, {}, 'delete')))
 *     );
 * }
 *  */

class ReleaseCover extends React.PureComponent {
    render() {
        const { theme } = this.props;

        const r = this.props.item;

        console.log(r);

        // FIXME: use styled.

        const imgStyle = {
            objectFit: 'cover',
            width: this.props.size + 'px',
            height: this.props.size + 'px',
            borderRadius: '5px',
        };

        return e(
            'div',
            { style: { position: 'relative', padding: '10px' } },
            e(
                'div',
                {
                    style: {
                        display: 'none',
                        position: 'absolute',
                        left: '10px',
                        bottom: '10px',
                        right: '10px',
                        top: '10px',
                        background: 'rgba(0.4, 0.4, 0.4, 0.8)',
                    },
                },
                e(
                    M.Typography,
                    {
                        style: {
                            float: 'right',
                            paddingRight: '5px',
                            color: theme.palette.text.secondary,
                        },
                        variant: 'body1',
                    },
                    r.year
                ),
                e(
                    M.Typography,
                    {
                        style: { paddingLeft: '5px', color: theme.palette.text.primary },
                        variant: 'body1',
                    },
                    r.title
                ),
                e('br', {}),
                e(
                    M.Typography,
                    {
                        style: {
                            float: 'right',
                            paddingRight: '5px',
                            color: theme.palette.text.secondary,
                        },
                        variant: 'body1',
                    },
                    r.duration
                ),
                e(
                    M.Typography,
                    {
                        style: { paddingLeft: '5px', color: theme.palette.text.secondary },
                        variant: 'body1',
                    },
                    'by ' + r.artist
                )
            ),
            e('img', { key: r.mbid, src: r.cover, style: imgStyle })
        );
    }
}

const StyledCover = M.withTheme()(ReleaseCover);

/*::
type ReleasesState = {
    expanded: boolean,
    isLoading: boolean,
    nextPage: string | null,
    prevPage: string | null,
    results: Array<SearchResultItem>,
};
*/
export class Releases extends React.Component /* <{}, ReleasesState> */ {
    constructor(props /*: {} */) {
        super(props);

        this.state = {
            expanded: false,
            isLoading: false,
            nextPage: null,
            prevPage: null,
            total: 0,
            results: [],
        };
        this._abortController = new AbortController();
        this.handleChange = this.handleChange.bind(this);
        this.loadReleases = this.loadReleases.bind(this);
    }

    componentWillMount() {}

    componentWillUnmount() {}

    /*:: handleChange: Function */
    handleChange(event /*: SyntheticEvent<HTMLElement>*/) /*: void */ {
        if (!this.state.expanded) {
            // we're expanding, kick off loading albums
            this.loadReleases();
        }

        this.setState({ expanded: !this.state.expanded });
    }

    /*:: loadReleases: Function */
    loadReleases() /*: void */ {
        console.log('loadReleases');
        this.setState({
            isLoading: true,
            nextPage: null,
            prevPage: null,
            total: 0,
        });

        this._abortController.abort();
        this._abortController = new window.AbortController();

        listRest('release', this._abortController.signal).then(response => {
            this.setState({
                nextPage: response.metadata.next ? response.metadata.next : null,
                prevPage: response.metadata.prev ? response.metadata.prev : null,
                results: response.results,
                total: response.metadata.total,
            });
        });
    }

    render() {
        const gridStyle = {
            display: 'flex',
            flexFlow: 'row wrap',
            justifyContent: 'left',
            alignItems: 'flex-start',
            alignContent: 'flex-start',
            width: '100%',
        };

        // FIXME: figure out a better way to do this.
        const size = bestSize();

        /* clearTimeout(this.tmp);
         * this.tmp = setTimeout(() => {
         *     this.setState({ total: this.state.total + 1 });
         * }, 2000);
         */
        return e(
            M.ExpansionPanel,
            {
                expanded: this.state.expanded,
                onChange: this.handleChange,
            },
            e(
                M.ExpansionPanelSummary,
                { expandIcon: e(M.Icon, {}, 'expand_more') },
                e(M.Typography, {}, 'Releases')
            ),
            e(
                M.ExpansionPanelDetails,
                {},
                e(
                    'div',
                    { style: gridStyle },
                    this.state.results.map(r =>
                        e(StyledCover, { key: r.mbid, item: r, size: size - 20 })
                    )
                )
            )
        );
    }
}
