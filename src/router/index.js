import AppLayout from '@/layout/AppLayout.vue';
import { authService, authState } from '@/services/authService';
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/services/auth';
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/dashboard',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue'),
                    meta: { requiresAuth: true, roles: ['ROLE_ADMIN'] },
                },
                // this is gonna be product List routing
                {
                    path: '/productManagement/product',
                    name: 'productList',
                    component: () => import('@/views/productManagement/Product.vue'),
                    meta: { requiresAuth: true, roles: ['ROLE_ADMIN'] },
                },
                {
                    path: '/productManagement/createProduct',
                    name: 'productCreate',
                    component: () => import('@/views/productManagement/CreateProduct.vue'),
                    meta: { requiresAuth: true, roles: ['ROLE_ADMIN'] },
                },
                {
                    path: '/uikit/AdminItems',
                    name: 'adminItems',
                    component: () => import('@/views/uikit/AdminItems.vue'),
                    meta: { requiresAuth: true },
                    meta: { requiresAuth: true, roles: ['ROLE_ADMIN'] },
                },
                {
                    path: '/uikit/formlayout',
                    name: 'formlayout',
                    component: () => import('@/views/uikit/FormLayout.vue'),
                    meta: { requiresAuth: true, roles: ['ROLE_ADMIN'] },
                },
                {
                    path: '/uikit/input',
                    name: 'input',
                    component: () => import('@/views/uikit/InputDoc.vue'),
                    meta: { requiresAuth: true, roles: ['ROLE_ADMIN'] },
                },
                {
                    path: '/uikit/button',
                    name: 'button',
                    component: () => import('@/views/uikit/ButtonDoc.vue'),
                    meta: { requiresAuth: true, roles: ['ROLE_ADMIN'] },
                },
                {
                    path: '/uikit/table',
                    name: 'table',
                    component: () => import('@/views/uikit/TableDoc.vue'),
                    meta: { requiresAuth: true, roles: ['ROLE_ADMIN'] },
                },
                {
                    path: '/uikit/list',
                    name: 'list',
                    component: () => import('@/views/uikit/ListDoc.vue')
                },
                {
                    path: '/uikit/tree',
                    name: 'tree',
                    component: () => import('@/views/uikit/TreeDoc.vue')
                },
                {
                    path: '/uikit/panel',
                    name: 'panel',
                    component: () => import('@/views/uikit/PanelsDoc.vue')
                },

                {
                    path: '/uikit/overlay',
                    name: 'overlay',
                    component: () => import('@/views/uikit/OverlayDoc.vue')
                },
                {
                    path: '/uikit/media',
                    name: 'media',
                    component: () => import('@/views/uikit/MediaDoc.vue')
                },
                {
                    path: '/uikit/message',
                    name: 'message',
                    component: () => import('@/views/uikit/MessagesDoc.vue')
                },
                {
                    path: '/uikit/file',
                    name: 'file',
                    component: () => import('@/views/uikit/FileDoc.vue')
                },
                {
                    path: '/uikit/menu',
                    name: 'menu',
                    component: () => import('@/views/uikit/MenuDoc.vue')
                },
                {
                    path: '/uikit/charts',
                    name: 'charts',
                    component: () => import('@/views/uikit/ChartDoc.vue')
                },
                {
                    path: '/uikit/misc',
                    name: 'misc',
                    component: () => import('@/views/uikit/MiscDoc.vue')
                },
                {
                    path: '/uikit/timeline',
                    name: 'timeline',
                    component: () => import('@/views/uikit/TimelineDoc.vue')
                },
                {
                    path: '/pages/empty',
                    name: 'empty',
                    component: () => import('@/views/pages/Empty.vue')
                },
                {
                    path: '/pages/crud',
                    name: 'crud',
                    component: () => import('@/views/pages/Crud.vue')
                },
                {
                    path: '/documentation',
                    name: 'documentation',
                    component: () => import('@/views/pages/Documentation.vue')
                }
            ]
        },
        {
            path: '/landing',
            name: 'landing',
            component: () => import('@/views/pages/Landing.vue')
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },

        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        },
         // Add the catch-all route
         {
            path: '/:pathMatch(.*)*', // Matches any route not defined above
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        }
    ]
});



router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore(); // Use Pinia to manage roles and token
  
    try {
      // Check if the route requires authentication
      if (to.matched.some((record) => record.meta.requiresAuth)) {
        // If authentication hasn't been checked, validate it
        if (!authState.authChecked) {
          const isAuthenticated = await authService.isAuthenticated();
  
          if (isAuthenticated) {
            // Fetch roles if not already set in the Pinia store
            if (!authStore.roles.length) {
              const response = await authService.fetchUserRoles(); // Example API call to fetch roles
              console.log("ROLES : ",response)
              authStore.setRoles(response.roles); // Store roles in Pinia
            }
          }
        }
  
        // Check if the user is authenticated
        if (authState.isLoggedIn) {
          // Check for role-based access
          const userRoles = authStore.roles;
          const requiredRoles = to.meta.roles;
  
          if (requiredRoles && !requiredRoles.some((role) => userRoles.includes(role))) {
            return next('/auth/access'); // Redirect to "Access Denied" page if roles don't match
          }
  
          return next(); // Allow navigation if authenticated and roles match
        } else {
          return next('/auth/login'); // Redirect to login if not authenticated
        }
      }
  
      // If the route doesn't require authentication, allow navigation
      next();
    } catch (error) {
      console.error('Error during navigation guard:', error);
      next('/auth/login'); // Redirect to login if an error occurs
    }
  });
export default router;
