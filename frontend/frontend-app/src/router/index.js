import { createRouter, createWebHistory } from "vue-router";
import HealthView from "../views/HealthView.vue";
import GestionPH from "../views/gestion-ph.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HealthView,
  },
  {
    path: "/ph",
    name: "gestion-ph",
    component: GestionPH,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;