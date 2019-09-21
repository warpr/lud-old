<?php declare(strict_types=1);
/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2019  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *  it under the terms of copyleft-next 0.3.1. See copyleft-next-0.3.1.txt.
 */

function loadComponent($name)
{
    require_once __DIR__ . "/components/$name.html";
    echo "<script>\n";
    require_once __DIR__ . "/components/$name.js";
    echo "</script>\n";
}
