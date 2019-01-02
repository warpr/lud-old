<?php

/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2018  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 */

declare(strict_types=1);

require_once __DIR__ . '/../config.php';

function database_filename($name)
{
    $cfg = loadConfig();
    return $cfg['index_root'] . "/$name.sqlite";
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
            static::$_connection = new SQLite3(static::_filename());
            static::$_connection->busyTimeout(1000);
            static::$_connection->exec('PRAGMA journal_mode = wal;');
        }

        return static::$_connection;
    }

    /**
     * Delete database tables.
     */
    public static function delete()
    {
        unlink(static::_filename());
        static::$_connection = null;
    }

    /**
     * Check whether this database exists.
     */
    public static function exists()
    {
        return is_readable(static::_filename());
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
     * Help create the database tables.
     */
    public static function _createTable(string $sql)
    {
        $db = static::connect();

        // NOTE: currently this creates each table in its own SQLite file,
        // which is fine for now... but will prevent us from using JOINs.

        $ret = $db->exec($sql);
        if (!$ret) {
            echo "Error creating " . static::_filename() . " database.\n";
        } else {
            $perms = fileperms(static::_filename());
        }
    }
}
