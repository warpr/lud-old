<?php
/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2018  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 */

declare(strict_types=1);

require_once __DIR__ . '/../../lib/config.php';
require_once __DIR__ . '/../../lib/db/index.php';
require_once __DIR__ . '/../../lib/search.php';
require_once __DIR__ . '/../../vendor/autoload.php';

function searchRequest($q, $offset, $limit)
{
    $terms = trim($q);

    $results = search($terms, $offset, $limit);
    $total = searchCount($terms);

    $cfg = loadConfig();
    $metadata = ["total" => $total];

    if ($offset > 0) {
        $newOffset = $offset - $limit;
        $prevQuery = [
            "q" => $terms,
            "offset" => $newOffset < 0 ? 0 : $newOffset,
            "limit" => $limit
        ];

        $metadata["prev"] = $cfg['search_root'] . '?' . http_build_query($prevQuery);
    }

    if ($offset + $limit < $total) {
        $nextQuery = [
            "q" => $terms,
            "offset" => $offset + $limit,
            "limit" => $limit
        ];

        $metadata["next"] = $cfg['search_root'] . '?' . http_build_query($nextQuery);
    }

    $response = compact('results', 'metadata');

    echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n";
}

function filterRequest($type, $offset, $limit)
{
    $type = trim($type);

    $results = filter($type, $offset, $limit);
    $total = filterCount($type);

    $cfg = loadConfig();
    $metadata = ["total" => $total];

    if ($offset > 0) {
        $newOffset = $offset - $limit;
        $prevQuery = [
            "type" => $type,
            "offset" => $newOffset < 0 ? 0 : $newOffset,
            "limit" => $limit
        ];

        $metadata["prev"] = $cfg['search_root'] . '?' . http_build_query($prevQuery);
    }

    if ($offset + $limit < $total) {
        $nextQuery = [
            "type" => $type,
            "offset" => $offset + $limit,
            "limit" => $limit
        ];

        $metadata["next"] = $cfg['search_root'] . '?' . http_build_query($nextQuery);
    }

    $response = compact('results', 'metadata');

    echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n";
}

function main()
{
    header('Content-Type: application/json');

    $offset = empty($_GET['offset']) ? 0 : (int) $_GET['offset'];
    $limit = empty($_GET['limit']) ? 10 : (int) $_GET['limit'];

    if (!empty($_GET['q'])) {
        return searchRequest($_GET['q'], $offset, $limit);
    }

    if (!empty($_GET['type'])) {
        return filterRequest($_GET['type'], $offset, $limit);
    }

    http_response_code(404);
    echo "Not Found\n";
    return;
}

main();

Index::connect()->close();
