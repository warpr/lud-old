<?php
/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2018  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 */

declare(strict_types=1);

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../lib/db/index.php';

function search($str, $offset = 0, $limit = 100)
{
    if (empty($str)) {
        return [];
    }

    $query = Index::connect()->prepare(
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
    $query = Index::connect()->prepare("SELECT count(*) FROM records (:query)");

    $searchString = $str;
    $query->bindParam(':query', $searchString);
    $result = $query->execute();

    $row = $result->fetchArray(SQLITE3_NUM);

    return $row[0];
}

function filter($type, $offset = 0, $limit = 100)
{
    $query = db()->prepare(
        "SELECT * FROM records WHERE type = :type ORDER BY year DESC LIMIT :limit OFFSET :offset"
    );

    $query->bindParam(':type', $type);
    $query->bindValue(':offset', $offset, SQLITE3_INTEGER);
    $query->bindValue(':limit', $limit, SQLITE3_INTEGER);
    $result = $query->execute();

    $ret = [];
    while (($row = $result->fetchArray(SQLITE3_ASSOC))) {
        $ret[] = $row;
    }

    return $ret;
}

function filterCount($type)
{
    $query = db()->prepare("SELECT count(*) FROM records WHERE type = :type");

    $query->bindParam(':type', $type);

    $result = $query->execute();

    $row = $result->fetchArray(SQLITE3_NUM);

    return $row[0];
}
