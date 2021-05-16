<?php

namespace App\Events;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

class JwtCreatedSubscriber
{
    public function updateJwtData(JWTCreatedEvent $event)
    {
        dd($event);
        // 1. Récupérer l'user
        $user = $event->getUser();

        // 2. Enrichir les data pour qu'elles contiennent ces données
        $data = $event->getData();
        // $data['firstName'] = $user->getFirstName();
        // $data['lastName'] = $user->getLastName();

        $event->setData($data);
    }
}
