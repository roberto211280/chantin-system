<script setup>
import { ref } from "vue";

// Estado del formulario
const nombre = ref("");
const direccion = ref("");

// Lista de PH (simulada por ahora)
const phList = ref([
  { id: 1, nombre: "PH Vista Sol", direccion: "David", activo: true },
]);

// Agregar PH
const agregarPH = () => {
  if (!nombre.value || !direccion.value) return;

  phList.value.push({
    id: Date.now(),
    nombre: nombre.value,
    direccion: direccion.value,
    activo: true,
  });

  nombre.value = "";
  direccion.value = "";
};

// Activar / Desactivar
const toggleEstado = (ph) => {
  ph.activo = !ph.activo;
};
</script>

<template>
  <div style="padding: 30px;">
    <h1>Gestión de PH</h1>

    <!-- FORMULARIO -->
    <div style="margin-bottom: 20px;">
      <h3>Agregar PH</h3>

      <input
        v-model="nombre"
        placeholder="Nombre del PH"
      />

      <input
        v-model="direccion"
        placeholder="Dirección"
      />

      <button @click="agregarPH">
        Guardar
      </button>
    </div>

    <!-- TABLA -->
    <div>
      <h3>Lista de PH</h3>

      <table border="1" cellpadding="10">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="ph in phList" :key="ph.id">
            <td>{{ ph.nombre }}</td>
            <td>{{ ph.direccion }}</td>
            <td>
              {{ ph.activo ? "Activo" : "Inactivo" }}
            </td>
            <td>
              <button @click="toggleEstado(ph)">
                {{ ph.activo ? "Desactivar" : "Activar" }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>