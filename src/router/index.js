import Vue from "vue";
import Router from "vue-router";
import Bubbles from "@/views/Bubbles";
import View from "@/views/View";
import Signup from "@/views/Signup";
import Login from "@/views/Login";
import User from "@/views/User";

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
    },
    {
      path: "/signup",
      name: "signup",
      component: Signup
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/user/:username",
      name: "user",
      component: User
    }
  ]
});
