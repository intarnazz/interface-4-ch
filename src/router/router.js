import { createRouter, createWebHistory } from "vue-router";
import Home from "@/page/PageHome.vue";
import ExpandedVideo from "@/page/PageExpandedVideo.vue";
import Profile from "@/page/PageProfile.vue";
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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
