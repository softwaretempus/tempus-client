interface NavAttributes {
  [propName: string]: any;
}
interface NavWrapper {
  attributes: NavAttributes;
  element: string;
}
interface NavBadge {
  text: string;
  variant: string;
}
interface NavLabel {
  class?: string;
  variant: string;
}

export interface NavData {
  name?: string;
  url?: string;
  icon?: string;
  badge?: NavBadge;
  title?: boolean;
  children?: NavData[];
  variant?: string;
  attributes?: NavAttributes;
  divider?: boolean;
  class?: string;
  label?: NavLabel;
  wrapper?: NavWrapper;
}

export const navItems: NavData[] = [
  {
    name: 'Habilidades',
    url: '/habilidades',
    icon: 'icon-star',
  },
  {
    name: 'Clientes',
    url: '/clientes',
    icon: 'icon-heart',
  },
  {
    name: 'Usuários',
    url: '/usuarios',
    icon: 'icon-user',
  },
  {
    name: 'Atendimentos',
    url: '/atendimentos',
    icon: 'icon-phone',
  },
  {
    name: 'Projetos',
    url: '/projetos',
    icon: 'icon-chart',
  },
  {
    name: 'Agendamentos',
    url: '/agendamentos',
    icon: 'icon-calendar',
  },
  {
    name: 'Ordens de Serviços',
    url: '/os',
    icon: 'fa fa-calendar-check-o',
  },
  {
    name: 'Relatórios',
    url: '/relatorios',
    icon: 'icon-pie-chart',
  },
];
