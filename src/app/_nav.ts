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
    name: 'Usuários',
    url: '/usuarios',
    icon: 'icon-user',
  },
  {
    name: 'Habilidades',
    url: '/habilidades',
    icon: 'icon-star',
  },
  {
    name: 'Atendimentos',
    url: '/atendimento',
    icon: 'icon-calendar',
  },
  {
    name: 'Projetos',
    url: '/projetos',
    icon: 'icon-calendar',
  }
];
