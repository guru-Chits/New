import { INavigationMenu } from '../interface/navigation-menus';

export const NavigationMenus: INavigationMenu[] = [
  // {
  //   path: '',
  //   title: 'Payments',
  //   img: '/assets/sidebar/inactive/subscriber.svg',
  //   activeImg:'/assets/sidebar/active/subscriber selected.svg',
  //   class: ''
  // },
  { path:'/subscriber',
    title: 'Subscriber Management',
    img: '/assets/sidebar/inactive/subscriber.svg',
    activeImg:'/assets/sidebar/active/subscriber selected.svg',
    class: '',
  },
  { 
    path:'/chit',
    title: 'Chit Management',
    img: '/assets/sidebar/inactive/chitgroup.svg',
    activeImg:'/assets/sidebar/active/chit selected.svg',
    class: '',
  },
  { 
    path:'/ledger',
    title: 'Ledger',
    img: '/assets/sidebar/inactive/ledger.svg',
    activeImg:'/assets/sidebar/active/ledger selected.svg',
    class: '',
  },
  { 
    path:'/payment',
    title: 'Payments',
    img: '/assets/sidebar/inactive/payment.svg',
    activeImg:'/assets/sidebar/active/payment selected.svg',
    class: '',
  },
  {
    path: '/area',
    title: 'Route Manager',
    img: '/assets/sidebar/inactive/area.svg',
    activeImg: '/assets/sidebar/active/area selected.svg',
    class: ''
  },
  {
    path: '/access',
    title: 'Access Management',
    img: '/assets/sidebar/inactive/access.svg',
    activeImg: '/assets/sidebar/active/access active.svg',
    class: ''
  },
  {
    path: '/staff',
    title: 'Staffs',
    img: '/assets/sidebar/inactive/staff.svg',
    activeImg: '/assets/sidebar/active/staff selected.svg',
    class: ''
  },
  {
    path: '/settings',
    title: 'Settings',
    img: '/assets/sidebar/inactive/settings.svg',
    activeImg: '/assets/sidebar/active/settings selected.svg',
    class: ''
  },
];
