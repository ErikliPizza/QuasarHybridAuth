import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from 'stores/auth';

export interface NavItem {
  text: string;
  icon: string;
  to?: string;
  permissions?: string[];
  disabled?: boolean;
}

export interface NavGroup {
  title: string;
  icon: string;
  items: NavItem[];
}

// Single source of truth for navigation items
// Add permissions: [...] to restrict visibility; omit to show for all
// User must have at least one of the specified permissions to see the item
// Add disabled: true to make items non-clickable (optional)
const navigationGroups: NavGroup[] = [
  {
    title: 'Main Page',
    icon: 'home',
    items: [
      { text: 'Dashboard', icon: 'dashboard', to: 'index' },
      {
        text: 'Departments',
        icon: 'domain',
        to: 'departments.index',
      },
    ],
  },
  {
    title: 'Permission&Roles',
    icon: 'security',
    items: [
      {
        text: 'Roles',
        icon: 'groups',
        to: 'roles.index',
      },
      {
        text: 'Permissions',
        icon: 'rule',
        to: 'permissions.index',
      },
    ],
  },
  {
    title: 'Examples',
    icon: 'article',
    items: [
      {
        text: 'Treats Page',
        icon: 'cake',
        to: 'example',
        permissions: ['view treats'],
      },
    ],
  },
];

export function useNavItems() {
  const router = useRouter();
  const route = useRoute();
  const authStore = useAuthStore();

  const userPermissions = computed(() => authStore.user?.permissions ?? []);

  // Filter groups and their items based on user permissions
  // User must have at least one of the required permissions to see an item
  const visibleGroups = computed(() => {
    return navigationGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => {
          // If no permissions specified, show to all users
          if (!item.permissions || item.permissions.length === 0) {
            return true;
          }
          // Check if user has at least one of the required permissions
          return item.permissions.some((permission) => userPermissions.value.includes(permission));
        }),
      }))
      .filter((group) => group.items.length > 0);
  });

  const allVisible = computed(() => {
    return visibleGroups.value.flatMap((group) => group.items).filter((item) => !!item.to);
  });

  const itemsAVisible = computed(() => {
    const mainGroup = visibleGroups.value.find((g) => g.title === 'Main Page');
    return mainGroup ? mainGroup.items : [];
  });

  const itemsBVisible = computed(() => {
    return visibleGroups.value
      .filter((g) => g.title !== 'Main Page')
      .flatMap((group) => group.items);
  });

  function navigate(to?: string) {
    if (!to) return;
    if (!router.hasRoute(to)) {
      console.warn(`Route "${to}" not found, navigation skipped.`);
      return;
    }
    void router.push({ name: to });
  }

  function isActive(to?: string) {
    if (!to) return false;
    return route.name === to;
  }

  return {
    visibleGroups,
    allVisible,
    itemsAVisible,
    itemsBVisible,
    navigate,
    isActive,
  };
}
