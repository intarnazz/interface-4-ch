import { createRouter, createWebHistory } from "vue-router";
import Home from "@/page/PageHome.vue";
import ExpandedVideo from "@/page/PageExpandedVideo.vue"
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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
