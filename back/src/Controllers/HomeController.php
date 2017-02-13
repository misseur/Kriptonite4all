<?php

namespace Kriptonite\Controllers;

use Silex\Application;
use Silex\ControllerCollection;
use Silex\Api\ControllerProviderInterface;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class HomeController implements ControllerProviderInterface
{
    public function connect(Application $app)
    {
        $controllers = $app['controllers_factory'];

        $controllers->get('/', [$this, 'homeGet']);

        return $controllers;
    }

    public function homeGet(Application $app, Request $req)
    {
        return $app->json("Success", 200);
    }
}