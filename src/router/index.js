import Vue from 'vue'
import Router from 'vue-router'
import Login from '../views/login/index'
import Home from '../views/home/index'
import Admin from '@/views/admin/index';
import Merchant from '@/views/merchant/index'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: 'login',
      component: Login
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      children: [
        {path: '/admin', name: 'Admin', component: Admin},
        {path: '/merchantList', name: 'Merchant', component: Merchant},
      ]
    },
  ]
})
router.beforeEach((to,from,next) => {
  //to 将要访问的路径
  //from 从哪里跳转来的
  //next 是一个函数，表示放行
  if(to.path === '/login'){
    return next();
  }else{
    const tokenStr=window.sessionStorage.getItem("token");
    if(tokenStr == null || tokenStr == ''){
      return next('/login');
    }else{
      next();
    }
  }
})

export default router
