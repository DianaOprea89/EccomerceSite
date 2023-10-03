import Vue from 'vue'
import VueRouter from 'vue-router'
import ProductDetailPage from '@/views/ProductDetailPage';
import CartPage from '@/views/CartPage';
import ProductsPage from '@/views/ProductsPage';
import NotFoundPage from '@/views/NotFoundPage';
import loginPage from "@/views/LoginPage";
import registerPage from "@/views/RegisterPage";


Vue.use(VueRouter)

const routes = [
  {
    path:'/products',
    name : 'Products',
    component: ProductsPage
  },
  {
    path: '/users/:userId/cart',
    name: 'CartPage',
    component: CartPage,
    props: true
  }
  ,
  {
    path: '/products/:productId',
    name: 'ProductDetail',
    component: ProductDetailPage,
    props: true //
  }
  ,
  {
    path:'/',
    redirect:'/products',
    meta: { requiresAuth: true }
  },
  {
    path:'*',
    name: 'NotFoundPage',
    component: NotFoundPage
  },
  {
    path:'/login',
    name : 'Login',
    component: loginPage
  },

  {
    path: '/register',
    name: "Register",
    component: registerPage,
    meta: { requiresGuest: true }
  }


]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  const loggedInUser = JSON.parse(localStorage.getItem('user'));

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!loggedInUser) {
      next('/login');
    } else {
      next();
    }
  } else {
    next();
  }

  if (loggedInUser && to.path === '/') {
    next(`/products/${loggedInUser.id}`);
  }
});


export default router
