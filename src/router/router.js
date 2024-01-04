import { createRouter, createWebHistory } from "vue-router";
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
