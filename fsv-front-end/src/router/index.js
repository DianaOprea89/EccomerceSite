import Vue from 'vue';
import VueRouter from 'vue-router';
import ProductDetailPage from '@/views/ProductDetailPage';
import CartPage from '@/views/CartPage';
import ProductsPage from '@/views/ProductsPage';
import NotFoundPage from '@/views/NotFoundPage';
import loginPage from "@/views/LoginPage";
import registerPage from "@/views/RegisterPage";

Vue.use(VueRouter);

const routes = [
  {
    path: '/products',
    name: 'Products',
    component: ProductsPage,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/users/:userId/cart',
    name: 'CartPage',
    component: CartPage,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/products/:productId',
    name: 'ProductDetail',
    component: ProductDetailPage,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/',
    redirect: '/products',
  },
  {
    path: '*',
    name: 'NotFoundPage',
    component: NotFoundPage
  },
  {
    path: '/login',
    name: 'Login',
    component: loginPage
  },
  {
    path: '/register',
    name: "Register",
    component: registerPage
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  const userEmail = localStorage.getItem('userEmail');

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!userEmail) {
      next('/login');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
