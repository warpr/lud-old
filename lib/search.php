<?php

require_once dirname(__FILE__) . '/../vendor/autoload.php';
require_once dirname(__FILE__) . '/../lib/db.php';

function search($str)
{
    $query = db()->prepare("SELECT * FROM records (:query) ORDER BY rank");

    $searchString = $str;
    $query->bindParam(':query', $searchString);
    $result = $query->execute();

    $ret = [];
    $maxResults = 10;
    $count = 0;
    while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
        $ret[] = $row;

        if (++$count >= $maxResults) {
            break;
        }
    }

    return $ret;
}
