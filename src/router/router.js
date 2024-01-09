import { createRouter, createWebHistory } from "vue-router";
import { GetUser } from "@/api/api.js";
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
      console.log(to.params.login);
      const res = await GetUser(to.params.login);
      console.log(res);
      console.log(res.code);
      if (res.code === 200) {
        next();
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
