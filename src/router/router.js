import { createRouter, createWebHistory } from "vue-router";
import Home from "@/page/PageHome.vue";
import Video from "@/page/PageVideo.vue"
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/video/:id",
    name: "Video",
    component: Video,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
