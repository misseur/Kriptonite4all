<?php

use Silex\Application;

use KriptoniteConfig\Config;

$app = new Application();
$app->register(new Config());
return $app;
