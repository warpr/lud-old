<?php
/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2018  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 */

declare(strict_types=1);

require_once dirname(__FILE__) . '/../vendor/autoload.php';
require_once dirname(__FILE__) . '/../lib/db.php';

function search($str, $offset = 0, $limit = 100)
{
    if (empty($str)) {
        return [];
    }

    $query = db('index')->prepare(
        "SELECT * FROM records (:query) ORDER BY rank" . " LIMIT :limit OFFSET :offset"
    );

    $searchString = $str;
    $query->bindParam(':query', $searchString);
    $query->bindValue(':offset', $offset, SQLITE3_INTEGER);
    $query->bindValue(':limit', $limit, SQLITE3_INTEGER);
    $result = $query->execute();

    $ret = [];
    while (($row = $result->fetchArray(SQLITE3_ASSOC))) {
        $ret[] = $row;
    }

    return $ret;
}

function searchCount($str)
{
    $query = db('index')->prepare("SELECT count(*) FROM records (:query)");

    $searchString = $str;
    $query->bindParam(':query', $searchString);
    $result = $query->execute();

    $row = $result->fetchArray(SQLITE3_NUM);

    return $row[0];
}
