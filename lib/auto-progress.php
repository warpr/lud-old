<?php

require_once dirname(__FILE__) . '/../vendor/autoload.php';
require_once dirname(__FILE__) . '/file.php';
require_once dirname(__FILE__) . '/tty.php';

use Khill\Duration\Duration;

function spinner($number)
{
    $spinner = "-\|/";

    return $spinner[$number % 4];
}

class Autoprogress
{
    public $cacheDir = '/tmp';
    public $cacheFile = '/tmp/something.auto-progress';
    public $iterations = 0;
    public $start = 0;
    public $lastUpdate = 0;
    public $duration = 0;
    public $iterationEstimate = 0;
    public $durationEstimate = 0;

    function __construct($applicationName, $name)
    {
        $xdg = new \XdgBaseDir\Xdg();

        $this->cacheDir = abspath($xdg->getHomeCacheDir() . '/' . $applicationName . '/');
        $this->cacheFile = $this->cacheDir . '/' . $name . ".auto-progress";
        $this->start = time();
        $this->iterations = 0;
        $this->lastUpdate = 0;

        mkdirIfNotExists($this->cacheDir);

        $this->load();
    }

    function shouldUpdate()
    {
        if ((time() - $this->lastUpdate) >= 1) {
            $this->lastUpdate = time();
            return true;
        }

        return false;
    }

    function load()
    {
        if (is_readable($this->cacheFile)) {
            $data = json_decode(file_get_contents($this->cacheFile));
            $this->iterationEstimate = $data->iterations;
            $this->durationEstimate = $data->duration;
        }
    }

    function save($done)
    {
        $data = [
            "iterations" => $this->iterations,
            "duration" => time() - $this->start,
            "done" => $done
        ];
        file_put_contents($this->cacheFile, json_encode($data, JSON_PRETTY_PRINT) . "\n");
    }

    function next($newline = false)
    {
        $this->iterations++;
        $this->duration = time() - $this->start;

        if ($this->shouldUpdate()) {
            $this->save(false);
            if ($newline) {
                echo "\n";
            }
            $this->display();
        }
    }

    function done()
    {
        $this->save(true);
        $this->load();
        $this->display();
    }

    function display()
    {
        clearLine();

        if (empty($this->iterationEstimate) || empty($this->durationEstimate)) {
            echo "Step " . $this->iterations . " [" . spinner($this->iterations) . "]\n";
            return;
        }

        $stepProgress = $this->iterations / $this->iterationEstimate;
        if ($stepProgress > 1) {
            $stepProgress = 1;
        }

        $timeProgress = $this->duration / $this->durationEstimate;
        if ($timeProgress > 1) {
            $timeProgress = 1;
        }

        $progress = $stepProgress < $timeProgress ? $stepProgress : $timeProgress;

        $steps = "Step " . $this->iterations . " of " . $this->iterationEstimate;

        $currentDuration = new Duration($this->duration);
        $totalDuration = new Duration($this->durationEstimate);
        $time = $currentDuration->humanize() . " of " . $totalDuration->humanize();

        $percentage = (int) ($progress * 100) . "%";

        $lineStart = $steps . " (" . $percentage . ") [";
        $lineEnd = "] " . $time;

        $barTotal = getTerminalWidth() - strlen($lineStart) - strlen($lineEnd) - 2;
        $barLength = (int) ($barTotal * $progress);

        echo $lineStart .
            str_repeat("=", $barLength) .
            str_repeat(" ", $barTotal - $barLength) .
            $lineEnd .
            "\n";
    }
}

function autoProgressDemo()
{
    $autoprogress = new Autoprogress('lud', 'auto-progress-loop');

    for ($i = 0; $i < 64; $i++) {
        $autoprogress->next();
        sleep(1);
    }

    $autoprogress->done();
}
