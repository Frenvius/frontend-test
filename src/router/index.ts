import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/details/:id",
    name: "Details",
    component: () => import("../views/Details.vue")
  }
];

const router = new VueRouter({
  routes,
  mode: "history"
});

export default router;
