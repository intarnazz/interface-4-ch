import { createRouter, createWebHistory } from "vue-router";
import { loginPOST } from "@/api/api.js";
import Home from "@/page/PageHome.vue";
import ExpandedVideo from "@/page/PageExpandedVideo.vue";
import Profile from "@/page/PageProfile.vue";
import Page404 from "@/page/Page404.vue";
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/video/:id",
    name: "ExpandedVideo",
    component: ExpandedVideo,
  },
  {
    path: "/Profile/:login",
    name: "Profile",
    component: Profile,
    beforeEnter: async (to, from, next) => {
      const login = localStorage.getItem("user");
      if (to.params.login !== login) {
        next("/Profile");
      }
      const pasword = localStorage.getItem("pasword");
      try {
        const code = await loginPOST(login, pasword);
        if (code === 200) {
          next();
        } else {
          next("/Profile");
        }
      } catch (e) {
        console.log(e);
      }
    },
  },
  {
    path: "/:catchAll(.*)",
    name: "Page404",
    component: Page404,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
