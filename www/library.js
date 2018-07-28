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
import { type CueRecord } from '/lud/cue.js';
*/
import { parseCue } from '/lud/cue.js';

const React = window.React;
const Blueprint = window.Blueprint;
const e = React.createElement;

export class Library extends React.Component {
    render() {
        const tooltipLabel = e(
            Blueprint.Core.Tooltip,
            { content: 'An eye!' },
            e('span', { className: 'pt-icon-standard pt-icon-eye-open' })
        );
        const longLabel =
            'Organic meditation gluten-free, sriracha VHS drinking vinegar beard man.';

        const tree = [
            {
                id: 0,
                hasCaret: true,
                icon: 'folder-close',
                label: 'Folder 0',
            },
        ];
        //        };

        return e('div', { className: 'library' }, e(Blueprint.Core.Tree, { contents: tree }));
    }
}

/*

<div class="pt-tree pt-elevation-0">
  <ul class="pt-tree-node-list pt-tree-root">
    <li class="pt-tree-node pt-tree-node-expanded">
      <div class="pt-tree-node-content">
        <span class="pt-tree-node-caret pt-tree-node-caret-open pt-icon-standard"></span>
        <span class="pt-tree-node-icon pt-icon-standard pt-icon-folder-close"></span>
        <span class="pt-tree-node-label">Label</span>
        <span class="pt-tree-node-secondary-label">Secondary label</span>
      </div>
      <ul class="pt-tree-node-list">
        <li class="pt-tree-node">
          <div class="pt-tree-node-content">
            <span class="pt-tree-node-caret-none pt-icon-standard"></span>
            <span class="pt-tree-node-icon pt-icon-standard pt-icon-document"></span>
          <span class="pt-tree-node-label">A Document</span>
          </div>
        </li>
        <li class="pt-tree-node">
          <div class="pt-tree-node-content">
            <span class="pt-tree-node-caret-none pt-icon-standard"></span>
            <span class="pt-tree-node-icon pt-icon-standard pt-icon-document"></span>
            <span class="pt-tree-node-label">Another Document</span>
          </div>
        </li>
      </ul>
    </li>
  </ul>
            </div>


            }
}
*/
