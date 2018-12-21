<?php

declare(strict_types=1);

require_once dirname(__FILE__) . '/../vendor/autoload.php';
require_once dirname(__FILE__) . '/../lib/search.php';
require_once dirname(__FILE__) . '/../lib/db.php';
require_once dirname(__FILE__) . '/../lib/config.php';

function main()
{
    if (empty($_GET['q'])) {
        http_response_code(404);
        echo "Not Found\n";
        return;
    }

    $stream = !empty($_GET['stream']);
    $terms = trim($_GET['q']);

    $offset = empty($_GET['offset']) ? 0 : (int) $_GET['offset'];
    $limit = empty($_GET['limit']) ? 10 : (int) $_GET['limit'];

    if ($stream) {
        header('Content-Type: application/jsonstream');
    } else {
        header('Content-Type: application/json');
    }

    $results = search($terms, $offset, $limit);
    $total = searchCount($terms);

    $cfg = loadConfig();
    $metadata = ["total" => $total];

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

main();

db('index')->close();
