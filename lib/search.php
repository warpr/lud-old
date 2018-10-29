<?php

require_once dirname(__FILE__) . '/../vendor/autoload.php';
require_once dirname(__FILE__) . '/../lib/db.php';

function search($str, $offset = 0, $limit = 100)
{
    if (empty($str)) {
        return [];
    }

    $query = db()->prepare(
        "SELECT * FROM records (:query) ORDER BY rank" . " LIMIT :limit OFFSET :offset"
    );

    $searchString = $str;
    $query->bindParam(':query', $searchString);
    $query->bindValue(':offset', $offset, SQLITE3_INTEGER);
    $query->bindValue(':limit', $limit, SQLITE3_INTEGER);
    $result = $query->execute();

    $ret = [];
    while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
        $ret[] = $row;
    }

    return $ret;
}

function searchCount($str)
{
    $query = db()->prepare("SELECT count(*) FROM records (:query)");

    $searchString = $str;
    $query->bindParam(':query', $searchString);
    $result = $query->execute();

    $row = $result->fetchArray(SQLITE3_NUM);

    return $row[0];
}
