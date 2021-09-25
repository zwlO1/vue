import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '@/components/Login'
// import Home from '@/components/home/Home'
// import Welcome from '@/components//home/Welcome'
// import Users from '@/components/home/user/Users'
// import Roles from '@/components/home/power/Roles'

const Login = () => import( /* webpackChunkName: "login_home_welome" */ '@/components/login/Login')
const Home = () => import( /* webpackChunkName: "login_home_welome" */ '@/components/home/Home')
const Welcome = () => import( /* webpackChunkName: "login_home_welome" */ '@/components/home/Welcome')

const Users = () => import( /* webpackChunkName: "Users_Rights_Roles" */ '@/components/home/users/Users')
const Rights = () => import( /* webpackChunkName: "Users_Rights_Roles" */ '@/components/home/power/rights/Rights')
const Roles = () => import( /* webpackChunkName: "Users_Rights_Roles" */ '@/components/home/power/roles/Roles')

const Cate = () => import( /* webpackChunkName: "Cate_Params" */ '@/components/home/goods/cate/Cate')
const Params = () => import( /* webpackChunkName: "Cate_Params" */ '@/components/home/goods/params/Params')

const GoodsList = () => import( /* webpackChunkName: "GoodsList_Add" */ '@/components/home/goods/list/List')
const Add = () => import( /* webpackChunkName: "GoodsList_Add" */ '@/components/home/goods/list/children/Add')

const Order = () => import( /* webpackChunkName: "Order_Report" */ '@/components/home/order/Order')
const Report = () => import( /* webpackChunkName: "Order_Report" */ '@/components/home/report/Report')

Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [{
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/categories',
        component: Cate
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/goods',
        component: GoodsList
      },
      {
        path: '/goods/add',
        component: Add
      },
      {
        path: '/orders',
        component: Order
      },
      {
        path: '/reports',
        component: Report
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

//导航守卫 
router.beforeEach((to, from, next) => {
  //要去到 login页面 直接放行
  if (to.path === '/login') return next()
  //没有token 回到 login登录
  const token = window.sessionStorage.getItem('token')
  // console.log(token);
  if (!token) return next('/login')
  next()
})

export default router