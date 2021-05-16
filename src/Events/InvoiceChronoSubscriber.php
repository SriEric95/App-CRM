<?php

namespace App\Events;

use App\Entity\Invoice;
use App\Repository\InvoiceRepository;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\Validator\Constraints\DateTime;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;


class InvoiceChronoSubscriber implements EventSubscriberInterface
{
    private $security;
    private $repo;

    public function __construct(Security $security, InvoiceRepository $repo)
    {
        $this->security = $security;
        $this->repo = $repo;
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['setChronoForInvoice', EventPriorities::PRE_VALIDATE]
        ];
    }

    public function setChronoForInvoice(ViewEvent $event)
    {
        // 1. Besoin de trouver l'user actuellement co
        // 2. Besoin du repo des factures
        // 3. Prendre la dernière facture inséré + chrono
        //4. Dans cette nouvelle facture on donne le dernier chrono +1 


        $invoice = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if ($invoice instanceof Invoice && $method === "POST") {
            $nextChrono = $this->repo->findNextChrono($this->security->getUser());
            $invoice->setChrono($nextChrono);

            //TODO : A déplacer dans une classe dédiée
            if (empty($invoice->getSentAt())) {
                $invoice->setSentAt((new \DateTime()));
            }
        }
    }
}
