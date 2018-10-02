<?php

require_once dirname(__FILE__) . '/../vendor/autoload.php';
require_once dirname(__FILE__) . '/../lib/search.php';

function streamResults($records)
{
    foreach ($records as $record) {
        echo json_encode($record) . "\n";
    }
    flush();
}

function main()
{
    if (empty($_GET['q'])) {
        http_response_code(404);
        echo "Not Found\n";
        return;
    }

    $stream = !empty($_GET['stream']);
    $terms = $_GET['q'];

    if ($stream) {
        header('Content-Type: application/jsonstream');
    } else {
        header('Content-Type: application/json');
    }

    $releases = search('releases', $terms);
    $stream && streamResults($releases);

    $discs = search('discs', $terms);
    $stream && streamResults($discs);

    $tracks = search('tracks', $terms);
    $stream && streamResults($tracks);

    if (!$stream) {
        echo json_encode(
            compact('releases', 'discs', 'tracks'),
            JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES
        ) . "\n";
    }
}

main();
