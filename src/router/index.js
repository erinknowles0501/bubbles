import Vue from "vue";
import Router from "vue-router";
import Bubbles from "@/views/Bubbles";
import View from "../views/View";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: Bubbles
    },
    {
      path: "/bubble/:uid",
      name: "view",
      component: View
    }
  ]
});
