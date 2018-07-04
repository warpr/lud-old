/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2018  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 */

const e = React.createElement;
const M = window['material-ui'];

// import { Album } from '/lud/album.js';
import { AudioGlue } from '/lud/audio-glue.js';
import * as db from '/lud/db.js';
// import { Library } from '/lud/library.js';
import { MainMenu } from '/lud/main-menu.js';
import { keys } from '/lud/misc.js';
// import { NowPlaying } from '/lud/now-playing.js';
import { SearchResults } from '/lud/search-results.js';

// FIXME: should probably use a React context for this.  For now this will do.
window.lûd = {
    verbose: true,
    glue: new AudioGlue(),
};

db.bootstrap(window.lûd);
SearchResults.bootstrap(window.lûd);

function throttleEvent(type, name) {
    var running = false;
    var func = function() {
        if (running) {
            return;
        }
        running = true;
        requestAnimationFrame(function() {
            window.dispatchEvent(new CustomEvent(name));
            running = false;
        });
    };
    window.addEventListener(type, func);
}

throttleEvent('resize', 'lûd-raf-resize');

class Sections extends React.Component {
    render() {
        return e(
            'div',
            { style: { width: '100%' } },
            keys([
                e(SearchResults),
                e(
                    M.ExpansionPanel,
                    {},
                    keys([
                        e(
                            M.ExpansionPanelSummary,
                            { expandIcon: e(M.Icon, {}, 'expand_more') },
                            e(M.Typography, {}, 'Expansion Panel 1')
                        ),
                        e(
                            M.ExpansionPanelDetails,
                            {},
                            e(
                                M.Typography,
                                {},
                                'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' +
                                    ' Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.'
                            )
                        ),
                    ])
                ),
                e(
                    M.ExpansionPanel,
                    {},
                    keys([
                        e(
                            M.ExpansionPanelSummary,
                            { expandIcon: e(M.Icon, {}, 'expand_more') },
                            e(M.Typography, {}, 'Expansion Panel 2')
                        ),
                        e(
                            M.ExpansionPanelDetails,
                            {},
                            e(
                                M.Typography,
                                {},
                                'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' +
                                    ' Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.'
                            )
                        ),
                    ])
                ),
                e(
                    M.ExpansionPanel,
                    {},
                    keys([
                        e(
                            M.ExpansionPanelSummary,
                            { expandIcon: e(M.Icon, {}, 'expand_more') },
                            e(M.Typography, {}, 'Expansion Panel 3')
                        ),
                        e(
                            M.ExpansionPanelDetails,
                            {},
                            e(
                                M.Typography,
                                {},
                                'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' +
                                    ' Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.'
                            )
                        ),
                    ])
                ),
            ])
        );
    }
}

/*
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
});

function SimpleExpansionPanel(props) {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>Expansion Panel 1</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
            sit amet blandit leo lobortis eget.
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>Expansion Panel 2</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
            sit amet blandit leo lobortis eget.
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel disabled>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>Disabled Expansion Panel</Typography>
        </ExpansionPanelSummary>
      </ExpansionPanel>
    </div>
  );
}

SimpleExpansionPanel.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleExpansionPanel);
*/

/*
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
});

class ControlledExpansionPanels extends React.Component {
  state = {
    expanded: null,
  };

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  render() {
    const { classes } = this.props;
    const { expanded } = this.state;

    return (
      <div className={classes.root}>
        <ExpansionPanel expanded={expanded === 'panel1'} onChange={this.handleChange('panel1')}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>General settings</Typography>
            <Typography className={classes.secondaryHeading}>I am an expansion panel</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam eget
              maximus est, id dignissim quam.
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel expanded={expanded === 'panel2'} onChange={this.handleChange('panel2')}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>Users</Typography>
            <Typography className={classes.secondaryHeading}>
              You are currently not an owner
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              Donec placerat, lectus sed mattis semper, neque lectus feugiat lectus, varius pulvinar
              diam eros in elit. Pellentesque convallis laoreet laoreet.
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel expanded={expanded === 'panel3'} onChange={this.handleChange('panel3')}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>Advanced settings</Typography>
            <Typography className={classes.secondaryHeading}>
              Filtering has been entirely disabled for whole web server
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit amet egestas
              eros, vitae egestas augue. Duis vel est augue.
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel expanded={expanded === 'panel4'} onChange={this.handleChange('panel4')}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>Personal data</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit amet egestas
              eros, vitae egestas augue. Duis vel est augue.
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}

ControlledExpansionPanels.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ControlledExpansionPanels);
*/

export function start(app_div) {
    window.lûd.db.loadIndex();

    const theme = M.createMuiTheme({
        palette: {
            type: 'dark',
            primary: M.colors.red,
        },
    });

    window.kuno = theme;

    const app = e(M.MuiThemeProvider, { theme, key: 'layout' }, [
        e(M.CssBaseline, { key: 'css-baseline' }),
        e(MainMenu, { key: 'main-menu' }),
        e(Sections, { key: 'sections' }),
    ]);

    // const app = e('div', { id: 'layout', style: style }, [
    //     e('div', { key: 'header', className: 'header' }, [
    //         e(MainMenu, { key: 'main-menu' }),
    //         e(NowPlaying, { key: 'now-playing' }),
    //     ]),
    //     e(Album, { key: 'now-playing-album' }),
    //     e(
    //         'div',
    //         { key: 'playlist', className: 'playlist' },
    //         e('span', {}, 'playlist')
    //     ),
    //     e(
    //         'div',
    //         { key: 'search-results', className: 'search-results' },
    //         e(SearchResults)
    //     ),
    //     //        e(Library, { key: 'library' })
    // ]);

    ReactDOM.render(app, app_div);
}

function layout(width) {
    const min = 320;
    const max = 512;

    if (width < min) {
        return { columns: 1, columnWidth: min };
    }

    let columns = Math.floor(width / min);

    if (columns > 4) {
        // if we have space for more than 4 columns, we can try to get larger
        // columns instead of just more columns.
        columns = Math.ceil(width / max);
    }

    const columnWidth = Math.floor(width / columns);
    return { columns, columnWidth };
}

window.addEventListener('lûd-raf-resize', event => {
    const l = layout(window.innerWidth);
    console.log(
        'resize event',
        window.innerWidth,
        'columns',
        l.columns,
        'per column',
        l.columnWidth
    );
});

/* layout:

   1280x720
   1366x768
   1440x900
   1600x900
   1920x1080

   header
   now-playing   queue    search-results    library
   footer

   [now playing cover] [now playing tracklisting] [next up] [search results]

1280 (* 3 420)
1366 (* 3 453)
1440 (* 4 360) (* 3 500)
1600 (* 4 400)
1920 (* 4 520)

*/
