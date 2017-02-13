<?php

namespace KriptoniteConfig;

use Pimple\Container;
use Pimple\ServiceProviderInterface;

use Silex\Provider\HttpFragmentServiceProvider;
use Silex\Provider\ServiceControllerServiceProvider;
use Silex\Provider\ValidatorServiceProvider;

use Symfony\Component\HttpFoundation\Request;

class Config implements ServiceProviderInterface
{
    public function register(Container $app)
    {
        $app->register(new ServiceControllerServiceProvider());
        $app->register(new HttpFragmentServiceProvider());
        $app->register(new ValidatorServiceProvider());

        $this->registerRoutes($app);


        $app->before(function (Request $request) {
            if (0 === strpos($request->headers->get('Content-Type'), 'application/json')) {
                $data = json_decode($request->getContent(), true);
                $request->request->replace($data);
            }
        });
    }

    private function registerRoutes(Container $app)
    {
        // Recherche tous les controllers pour les loader dans $app
        foreach (glob(__DIR__ . "/../src/Controllers/*.php") as $controller_name) {
            $controller_name = pathinfo($controller_name)["filename"];
            $class_name = "\\Kriptonite\\Controllers\\{$controller_name}";

            // Si la class existe et qu'elle herite bien de l'interface d'un controlleur, on l'ajoute
            if (class_exists($class_name)
                && in_array("Silex\Api\ControllerProviderInterface", class_implements($class_name)))
            {
                $app[$controller_name] = function () use ($class_name) {
                    return new $class_name();
                };
                $app->mount('/', $app[$controller_name]);
            }
        }
    }
}