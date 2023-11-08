import {
  createRouter,
  createWebHashHistory,
  Router,
  RouteRecordRaw,
} from "vue-router";

import Index from "../views/index/index.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/index",
    name: "index",
    component: Index,
  },
  {
    path: "/:pathMatch(.*)*", // 404
    name: "NotFound",
    redirect: "/index",
  },
];
const router: Router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
