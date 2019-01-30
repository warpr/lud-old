<?php

/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2018  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 */

declare(strict_types=1);

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../config.php';

function database_filename($name)
{
    $cfg = loadConfig();
    return $cfg['index_root'] . "/lud.sqlite";
}

trait Model
{
    /**
     * The database connection.
     */
    public static $_connection = null;

    /**
     * Create database tables.
     */
    abstract public static function create();

    /**
     * Return a database connection.
     */
    public static function connect()
    {
        if (empty(static::$_connection)) {
            $config = new \Doctrine\DBAL\Configuration();

            $params = [
                "url" => "sqlite3:///" . static::_filename(),
                "driverOptions" => [PDO::ATTR_TIMEOUT => 1000]
            ];

            static::$_connection = \Doctrine\DBAL\DriverManager::getConnection($params, $config);
            $stmt = static::$_connection->query('PRAGMA journal_mode = wal;');

            $row = $stmt->fetch();
            if ($row['journal_mode'] != 'wal') {
                echo "ERROR: unable to connect to database\n";
                die();
            }
        }

        return static::$_connection;
    }

    /**
     * Return a direct SQLite3 connection instance.
     */
    public static function _directConnect()
    {
        $connection = new SQLite3(static::_filename());
        $connection->busyTimeout(1000);
        $connection->exec('PRAGMA journal_mode = wal;');

        return $connection;
    }

    /**
     * Disconnects a database.
     */
    public static function disconnect()
    {
        if (empty(static::$_connection)) {
            return;
        }

        static::$_connection->close();
        static::$_connection = null;
    }

    /**
     * Delete database tables.
     */
    public static function delete()
    {
        // FIXME: do this with DBAL?
        $db = static::_directConnect();
        $db->query('DROP TABLE IF EXISTS `' . static::_tablename() . '`');

        static::disconnect();
    }

    /**
     * Check whether this database exists.
     */
    public static function exists()
    {
        $conn = static::connect();
        $sm = $conn->getSchemaManager();
        return $sm->tablesExist(static::_tablename());
    }

    /**
     * Reset / clear database tables.
     */
    public static function reset()
    {
        static::delete();
        static::create();
    }

    /**
     * Get the SQLite database filename.
     */
    public static function _filename()
    {
        $mirror = new \ReflectionClass(__CLASS__);
        $name = strtolower($mirror->getShortName());

        return database_filename($name);
    }

    /**
     * Get the table name..
     */
    public static function _tablename()
    {
        $mirror = new \ReflectionClass(__CLASS__);
        $name = strtolower($mirror->getShortName());

        return $name;
    }

    /**
     * Create a query builder
     */
    public static function builder()
    {
        $db = static::connect();
        return $db->createQueryBuilder();
    }

    /**
     * Run a query created with the query builder.
     */
    public static function run($builder)
    {
        $stmt = $builder->execute();

        while (($row = $stmt->fetch())) {
            yield $row;
        }
    }

    /**
     * Construct a simple insert.
     */
    public static function insert($values)
    {
        $db = static::connect();
        $sql = $db->createQueryBuilder();
        $insert = $sql->insert($db->quoteIdentifier(static::_tablename()));

        $idx = 0;
        foreach ($values as $name => $value) {
            $insert->setValue($name, '?')->setParameter($idx++, $value);
        }

        $insert->execute();

        return $db->lastInsertId();
    }
}
