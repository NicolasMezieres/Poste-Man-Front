import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Footer } from '../../component/footer/footer';
import { Logo } from '../../component/logo/logo';

@Component({
  selector: 'app-mention',
  imports: [Logo, MatButtonModule, MatIcon, Footer],
  template: `<div>
    <div>
      <button mat-icon-button class="!absolute" (click)="getBack()">
        <mat-icon>arrow_back</mat-icon>
      </button>
      <app-logo></app-logo>
    </div>
    <div class="md:text-center">
      <h2 class="font-Julius text-[32px] text-center m-4">Mentions légales</h2>
      <div class="font-Agdasima p-4">
        <h3 class="text-[28px] underline font-bold">1. Informations légales</h3>
        <ol class="text-[20px]">
          <li class="font-bold">Éditeurs du site :</li>
          <li>Nom : Rémy Da Rocha & Mezieres Nicolas</li>
        </ol>
        <ol class="text-[20px]">
          <li class="font-bold">Hébergement du site :</li>
          <li>Hébergeur : Heroku</li>
          <li>
            Site Web :<a target="_blank" href="https://www.heroku.com"
              >https://www.heroku.com</a
            >
          </li>
        </ol>
        <h3 class="text-[28px] underline font-bold">
          2. Description du service
        </h3>
        <section class="text-[20px]">
          <p>
            Le site Poste Man est une plateforme collaborative permettant de
            créer tt gérer des projets organisés en sections thématiques ( ex:
            Viande, Boisson, etc...)
          </p>
          <p>
            Chaque projet peut contenir des postes que les utilisateurs peuvent
            déplacer, organiser, voter, et commenter. Un système de chat intégré
            permet au membres de chaque projet de communiquer en temps réel.
          </p>
        </section>

        <h3 class="text-[28px] underline font-bold">
          3. Données personelles et cookies
        </h3>
        <ol class="text-[20px]">
          <li class="font-bold">Données collectées :</li>
          <p>
            Lors de l'inscription, les données suivantes peuvent être collectées
            :
          </p>
          <ul class="list-disc list-inside">
            <li>Adresse email</li>
            <li>Prénom</li>
            <li>Nom</li>
            <li>Pseudonyme</li>
            <li>Mot de passe ( chiffé )</li>
          </ul>
        </ol>
        <ol class="text-[20px]">
          <li class="font-bold">Cookies :</li>
          <p>
            Le site utilise uniquement un cookie technique pour stocker un jeton
            d'authenfication, nécessaire au maintien de la session.
          </p>
          <p>Aucun outil tiers de traçage n'est utilisé.</p>
          <li class="font-bold">Droits des utilisateurs :</li>
          <p>
            Conformément au RGPD, vous pouvez demander l'accès, la modification
            ou la suppression de vos données à l'adresse suivante :
          </p>
        </ol>
        <h3 class="text-[28px] underline font-bold">
          4. Propriété intellectuelle
        </h3>
        <section class="text-[20px]">
          <p>
            Tout les éléments présents sur le site (textes, images, logo,
            interface, structure) sont protégés par le droit d'auteur.
          </p>
          <p>
            Toute reproduction, distribution, modification ou utilisation sans
            autorisation est interdite.
          </p>
          <p>
            Le contenue publiés par les utilisateurs restent leur propriété,
            mais léditeur se réserve le droit de les modérer ou de les supprimer
            en cas de non-respect des règles d'utilisation
          </p>
        </section>
        <h3 class="text-[28px] underline font-bold">
          5. Conditions Générales d'Utilisation
        </h3>
        <li class="font-bold text-[24px] list-none">5.1 Accès au service</li>
        <p class="text-[20px]">
          L'acces au site est gratuit, mais certaines fonctionnlitées
          nécessitent la création d'un compte. Les utilisateurs s'engagent à
          fournir des informations exactes lors de l'inscription.
        </p>
        <li class="font-bold text-[24px] list-none">
          5.2 Comportement des utilisateurs
        </li>
        <section class="text-[20px]">
          <p>Les utlisateurs s'engagent à :</p>
          <ol class="list-disc list-inside">
            <li>Respecter les autres membres</li>
            <li>
              Ne pas publier de contenus illicites, haineux, diffamatoires ou
              offensants
            </li>
            <li>Ne pas spammer ou perturber le fonctionnement du site</li>
            <li>
              Utiliser les fonctionnalités conformément à leur usage prévu
            </li>
          </ol>
          <p>
            Tout comportement abusif peut entraîner la suppression du compte
            sans préavis.
          </p>
        </section>
        <li class="font-bold text-[24px] list-none">5.3 Modération</li>
        <p class="text-[20px]">
          L’éditeur du site se réserve le droit de supprimer tout contenu non
          conforme ou nuisible au bon fonctionnement du service.
        </p>
        <li class="font-bold text-[24px] list-none">5.4 Responsabilités</li>
        <p class="text-[20px]">L’éditeur ne peut être tenu responsable des :</p>
        <ol class="list-disc list-inside text-[20px]">
          <li>Contenus publiés par les utilisateurs</li>
          <li>Bugs, interruptions temporaires, ou pertes de données</li>
          <li>Mauvaises utilisations du service par les membres</li>
        </ol>
        <li class="font-bold text-[24px] list-none">5.5 Résiliation</li>
        <section class="text-[20px]">
          <p>Chaque utilisateur peut à tout moment supprimer son compte.</p>
          <p>
            L’éditeur peut également supprimer un compte en cas de non-respect
            des présentes conditions.
          </p>
        </section>
        <li class="font-bold text-[24px] list-none underline">
          6. Droit applicable
        </li>
        <p class="text-[20px]">
          Le site est soumis au droit français. En cas de litige, seuls les
          tribunaux du ressort du siège social de l’éditeur sont compétents.
        </p>
      </div>
    </div>
    <app-footer></app-footer>
  </div>`,
})
export class Mention {
  private readonly location = inject(Location);

  getBack(): void {
    this.location.back();
  }
}
