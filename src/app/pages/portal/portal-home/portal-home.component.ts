import { Component } from '@angular/core';
import { BaseComponent } from '../../abstract/BaseComponent';
import { Router } from '@angular/router';

interface PortalOption {
  title: string;
  description: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-portal-home',
  templateUrl: './portal-home.component.html',
  styleUrls: ['./portal-home.component.css']
})
export class PortalHomeComponent extends BaseComponent {
  constructor(
    private router: Router
  ) {
    super();
  }

  menuOptions: PortalOption[] = [
    {
      title: 'Inserir/Editar informacoes do meu negocio',
      description: 'Atualize o perfil da sua empresa, descreva servicos, diferenciais e detalhes que ajudam o atendimento.',
      icon: 'bi-pencil-square',
      route: '/form-service'
    },
    {
      title: 'Ser premium',
      description: 'Ative recursos avancados, acompanhe relatorios priorizados e receba atendimento personalizado.',
      icon: 'bi-star-fill',
      route: '/be-premium'
    },
    {
      title: 'Excluir conta do cliente',
      description: 'Confirme a exclusao definitiva do cliente e remova o perfil da plataforma imediatamente.',
      icon: 'bi-trash-fill',
      route: '/account-deletion-confirmation'
    }
  ];

  handleOption(option: PortalOption): void {
    console.log(`Acao selecionada: ${option.title}`);
    console.log(option);

    this.router.navigate([option.route]);
  }
}
