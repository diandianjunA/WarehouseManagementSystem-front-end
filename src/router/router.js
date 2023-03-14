import { createRouter, createWebHashHistory } from "vue-router";
import login from "@/components/Index/Login";
import indexHome from "@/components/Index/IndexHome";
import home from "@/components/Index/Home";
import Main from "@/components/Index/Main";
import AdminManagement from "@/components/Index/AdminManagement";
import UserManagement from "@/components/Index/UserManagement";
import StorageManagement from "@/components/Index/StorageManagement";
import GoodsTypeManagement from "@/components/Index/GoodsTypeManagement";
import GoodsManagement from "@/components/Index/GoodsManagement";
import RecordManagement from "@/components/Index/RecordManagement";
const routes = [
    {
        path: "/",
        redirect: "/login"
    },
    {
        path: "/login",
        component: login
    },
    {
        path: "/indexHome",
        component: indexHome,
        children: [
            {
                path: 'home',
                component: home
            },
            {
                path: 'main',
                component: Main
            },
            {
                path: 'admin',
                component: AdminManagement
            },
            {
                path: 'user',
                component: UserManagement
            },
            {
                path: 'storage',
                component: StorageManagement
            },
            {
                path: 'goodsType',
                component: GoodsTypeManagement
            },
            {
                path: 'goods',
                component: GoodsManagement
            },
            {
                path: 'record',
                component: RecordManagement
            }
        ]
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
