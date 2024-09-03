import {createRouter, createWebHistory} from 'vue-router'
// 导入进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// 导入layout
import Layout from '@/layout/Layout.vue'
// 导入md5
import md5 from 'md5';
//定义路由规则
const routes = [
    {
        path: '/login',  //url路径
        component: () => import('@/views/login/Login.vue'),  //视图组件
        meta: {title: "登录", requireAuth: false},  //meta元信息
    },
    {
        path: '/',
        redirect: '/home',
    },
    {
        path: '/home', //视图
        component: Layout,
        icon: "odometer", //图标
        meta: {title:"Layout", requireAuth: false},
        children: [
            {
                path: '/home', //视图
                name: "仪表盘",
                component: () => import('@/views/home/Home.vue'),
                icon: "odometer", //图标
                meta: {title:"仪表盘", requireAuth: false}, //定义meta元数据
            },
        ]
    },
    {
        path: '/volcano',
        component: Layout,
        icon: "VideoPlay",
        children: [
            {
                path: '/volcano',
                name: '任务列表',
                icon: "VideoPlay", //图标
                meta: {title:"任务列表", requireAuth: true}, //定义meta元数据
                component: () => import('@/views/volcano/Vcjob.vue')
            },
        ]
    },
    {
        path: '/cluster',
        name: "集群",
        component: Layout,
        icon: "home-filled", //图标
        meta: {title:"集群", requireAuth: false},
        children: [
            {
                path: '/cluster/node',
                name: 'Node',
                icon: "el-icons-s-data", //图标
                meta: {title:"Node", requireAuth: true}, //定义meta元数据
                component: () => import('@/views/cluster/Node.vue')
            },
            {
                path: '/cluster/namespace',
                name: 'Namespace',
                icon: "el-icons-s-data", //图标
                meta: {title:"Namespace", requireAuth: true}, //定义meta元数据
                component: () => import('@/views/cluster/Namespace.vue')
            },
            {
                path: '/cluster/pv',
                name: 'Persistentvolume',
                icon: "el-icons-s-data", //图标
                meta: {title:"Persistentvolume", requireAuth: true}, //定义meta元数据
                component: () => import('@/views/cluster/Pv.vue')
            },
        ]
    },
    {
        path: '/workload',
        name: "工作负载",
        component: Layout,
        icon: "menu", //图标
        meta: {title:"工作负载", requireAuth: false},
        children: [
            {
                path: '/workload/deployment',
                name: 'Deployment',
                icon: "el-icons-s-data", //图标
                meta: {title:"Deployment", requireAuth: true}, //定义meta元数据
                component: () => import('@/views/workload/Deployment.vue')
            },
            {
                path: '/workload/pod',
                name: 'Pod',
                icon: "el-icons-document-add", //图标
                meta: {title:"Pod", requireAuth: true}, //定义meta元数据
                component: () => import('@/views/workload/Pod.vue')
            },
            {
                path: '/workload/daemonset',
                name: 'DaemonSet',
                icon: "el-icons-document-add", //图标
                meta: {title:"DaemonSet", requireAuth: true}, //定义meta元数据
                component: () => import('@/views/workload/DaemonSet.vue')
            },
            {
                path: '/workload/statefulset',
                name: 'StatefulSet',
                icon: "el-icons-document-add", //图标
                meta: {title:"StatefulSet", requireAuth: true}, //定义meta元数据
                component: () => import('@/views/workload/StatefulSet.vue')
            },
        ]
    },
    {
        path: '/loadbalance',
        name: "负载均衡",
        component: Layout,
        icon: "files", //图标
        meta: {title:"负载均衡", requireAuth: false},
        children: [
            {
                path: '/loadbalance/service',
                name: 'Service',
                icon: "el-icons-s-data", //图标
                meta: {title:"Service", requireAuth: true}, //定义meta元数据
                component: () => import('@/views/loadbalance/Service.vue')
            },
            {
                path: '/loadbalance/ingress',
                name: 'Ingress',
                icon: "el-icons-document-add", //图标
                meta: {title:"Ingress", requireAuth: true}, //定义meta元数据
                component: () => import('@/views/loadbalance/Ingress.vue')
            }
        ]
    },
    {
        path: '/storage',
        name: "存储",
        component: Layout,
        icon: "tickets", //图标
        meta: {title:"存储", requireAuth: false},
        children: [
            {
                path: '/storage/pvc',
                name: 'Pvc',
                icon: "tickets", //图标
                meta: {title:"Pvc", requireAuth: true}, //定义meta元数据
                component: () => import('@/views/storage/Pvc.vue')
            },
            {
                path: '/storage/secret',
                name: 'Secret',
                icon: "el-icons-document-add", //图标
                meta: {title:"Secret", requireAuth: true}, //定义meta元数据
                component: () => import('@/views/storage/Secret.vue')
            },
            {
                path: '/storage/configmap',
                name: 'ConfigMap',
                icon: "el-icons-document-add", //图标
                meta: {title:"ConfigMap", requireAuth: true}, //定义meta元数据
                component: () => import('@/views/storage/Configmap.vue')
            },
        ]
    },
    {
        path: '/403',
        component: () => import('@/views/common/403.vue'),
        meta: {title:"403",requiredAuth:true},
    },
    {
        path: '/404',
        component: () => import('@/views/common/404.vue'),
        meta: {title:"404",requiredAuth:true},
    },
    {
        path: '/:pathMatch(.*)',
        redirect: '/404',
    }
]

//创建路由实例
const router = createRouter({
    history: createWebHistory(),
    routes
})

//进度条配置
NProgress.inc(0.2) //设置进度条递增
NProgress.configure({easing: 'ease', speed: 600, showSpinner: false})//动画效果、动画速度、进度环是否显示

//路由守卫，路由拦截
router.beforeEach((to, from, next) => {
    //启动进度条
    NProgress.start()
    //设置头部
    if (to.meta.title) {
        document.title = to.meta.title
    } else {
        document.title = "Kubernetes"
    }
    // 放行
    if (window.location.pathname == '/login') {
        next()
    }else{
        // 获取localStorage中保存的Token和过期时间
        const storedToken = localStorage.getItem('token');
        const storedTokenExpireTime = localStorage.getItem('tokenExpireTime');
        // 如果没有保存Token或过期时间，或者Token已经过期，则跳转到登录页面

        if (!storedToken || !storedTokenExpireTime || Date.now() > parseInt(storedTokenExpireTime)) {
            // 删除localStorage中保存的Token和过期时间
            localStorage.removeItem('token');
            localStorage.removeItem('tokenExpireTime');

            // 如果当前不在登录页面，则跳转到登录页面
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        } else {
            // 验证Token是否正确
            const salt = localStorage.getItem('username')+localStorage.getItem('loginDate')
            const token = md5(salt); // 使用md5算法生成Token

            if (token === storedToken) {
                // Token正确，且在有效期内，继续进行其他操作
                // TODO: 继续访问
                next()
            } else {
                // Token错误，跳转到登录页面
                localStorage.removeItem('token');
                localStorage.removeItem('tokenExpireTime');

                // 如果当前不在登录页面，则跳转到登录页面
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            }
        }
    }
})


//关闭进度条
router.afterEach(() => {
    NProgress.done()
})

export default router