<script setup>
import { ref, onMounted } from "vue";
import { getHealth } from "../services/api";

const status = ref("Cargando...");

onMounted(async () => {
  try {
    const res = await getHealth();
    status.value = res.data.message;
  } catch (error) {
    status.value = "Error conectando al backend";
  }
});
</script>

<template>
  <div class="p-6">
    <h1>Sistema Chantin</h1>
    <p>Estado API: {{ status }}</p>
  </div>
</template>