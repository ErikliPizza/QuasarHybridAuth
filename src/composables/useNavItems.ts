import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from 'stores/auth';

export interface NavItem {
  text: string;
  icon: string;
  to?: string;
  permissions?: string[];
  disabled?: boolean;
  children?: NavItem[];
}

export interface NavGroup {
  title: string;
  icon: string;
  items: NavItem[];
}

export type NavVariant = 'main' | 'profile';

// Main (left drawer) navigation — items listed in display order
// Add permissions: [...] to restrict; omit = visible to all (user needs at least one)
const navigationGroups: NavGroup[] = [
  {
    title: 'Ana Menü',
    icon: 'home',
    items: [{ text: 'Başlangıç', icon: 'space_dashboard', to: 'index' }],
  },
  {
    title: 'Personel Yönetimi',
    icon: 'manage_accounts',
    items: [
      {
        text: 'Kullanıcılar',
        icon: 'person',
        to: 'users.index',
        permissions: ['view users'],
      },
    ],
  },
  {
    title: 'Sistem Ayarları',
    icon: 'admin_panel_settings',
    items: [
      {
        text: 'Unvan ve İzinler',
        icon: 'verified_user',
        permissions: ['manage roles', 'manage permissions'],
        children: [
          { text: 'Roller', icon: 'groups', to: 'roles.index', permissions: ['manage roles'] },
          {
            text: 'Yetkiler',
            icon: 'rule',
            to: 'permissions.index',
            permissions: ['manage permissions'],
          },
        ],
      },
    ],
  },
];

// Profile (right drawer) navigation — account-related items
const profileNavigationGroups: NavGroup[] = [];

const groupsByVariant: Record<NavVariant, NavGroup[]> = {
  main: navigationGroups,
  profile: profileNavigationGroups,
};

export function useNavItems(variant: NavVariant = 'main') {
  const router = useRouter();
  const route = useRoute();
  const authStore = useAuthStore();
  const userPermissions = computed(() => authStore.user?.permissions ?? []);

  const canSee = (item: NavItem): boolean =>
    !item.permissions?.length || item.permissions.some((p) => userPermissions.value.includes(p));

  const filterItems = (items: NavItem[]): NavItem[] =>
    items
      .map((item) => {
        if (item.children) {
          const children = item.children.filter(canSee);
          return children.length ? { ...item, children } : null;
        }
        return canSee(item) ? item : null;
      })
      .filter((item): item is NavItem => item !== null);

  const visibleGroups = computed(() =>
    groupsByVariant[variant]
      .map((group) => ({ ...group, items: filterItems(group.items) }))
      .filter((group) => group.items.length > 0),
  );

  const navigate = (to?: string) => {
    if (!to || !router.hasRoute(to)) return;
    void router.push({ name: to });
  };

  const isActive = (to?: string) => !!to && route.name === to;

  return { visibleGroups, navigate, isActive };
}
