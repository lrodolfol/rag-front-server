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
      title: 'Inserir/Editar informações do meu negócio',
      description: 'Atualize o perfil da sua empresa, descreva serviços, diferenciais e detalhes que ajudam o atendimento.',
      icon: 'bi-pencil-square',
      route: '/form-service'
    },
    {
      title: 'Ser premium',
      description: 'Ative recursos avançados, acompanhe relatórios priorizados e receba atendimento personalizado.',
      icon: 'bi-star-fill',
      route: '/be-premium'
    },
    {
      title: 'Remover meu negócio do sistema',
      description: 'Solicite a exclusão permanente dos dados cadastrados e encerre o uso do portal.',
      icon: 'bi-trash-fill',
      route: '/remove-business'
    }
  ];

  handleOption(option: PortalOption): void {
    console.log(`Ação selecionada: ${option.title}`);
    console.log(option)

    this.router.navigate([option.route]);
  }
}
