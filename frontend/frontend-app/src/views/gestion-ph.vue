<script setup>
import "@/styles/variables.css";
import "@/styles/gestion-ph.css";
import { ref, computed } from "vue";

const nombre    = ref("");
const direccion = ref("");
const tipo      = ref("");
const monto     = ref("");
const adminAsig = ref("");
const estadoPH  = ref("activo");
const busqueda  = ref("");
const editandoId = ref(null);
const errores   = ref({});

const phList = ref([
  { id:1, nombre:"PH Vista Sol",  admin:"Juan Pérez",    tipo:"Residencial", monto:1500, activo:true  },
  { id:2, nombre:"PH Central",    admin:"María López",   tipo:"Residencial", monto:2000, activo:false },
  { id:3, nombre:"PH Las Palmas", admin:"Carlos Gómez",  tipo:"Comercial",   monto:3200, activo:true  },
  { id:4, nombre:"PH Altamira",   admin:"Ana Torres",    tipo:"Residencial", monto:1800, activo:true  },
  { id:5, nombre:"PH El Bosque",  admin:"Luis Martínez", tipo:"Comercial",   monto:2500, activo:false },
]);

const administradores = ref([
  "Juan Pérez", "María López", "Carlos Gómez", "Ana Torres", "Luis Martínez"
]);

const phFiltrados = computed(() => {
  const q = busqueda.value.toLowerCase();
  if (!q) return phList.value;
  return phList.value.filter(p =>
    p.nombre.toLowerCase().includes(q) ||
    p.admin.toLowerCase().includes(q)
  );
});

const formTitle = computed(() =>
  editandoId.value ? `Editando: ${phList.value.find(p => p.id === editandoId.value)?.nombre}` : "Agregar / Editar PH"
);

const validar = () => {
  const e = {};
  if (!nombre.value.trim())  e.nombre  = "Requerido.";
  if (!direccion.value.trim()) e.direccion = "Requerido.";
  if (!tipo.value)           e.tipo    = "Selecciona un tipo.";
  if (!monto.value || Number(monto.value) <= 0) e.monto = "Ingresa un monto válido.";
  if (!adminAsig.value)      e.adminAsig = "Selecciona un administrador.";
  errores.value = e;
  return Object.keys(e).length === 0;
};

const guardar = () => {
  if (!validar()) return;
  if (editandoId.value) {
    const ph = phList.value.find(p => p.id === editandoId.value);
    if (ph) {
      ph.nombre  = nombre.value.trim();
      ph.admin   = adminAsig.value;
      ph.tipo    = tipo.value;
      ph.monto   = Number(monto.value);
      ph.activo  = estadoPH.value === "activo";
    }
  } else {
    phList.value.push({
      id: Date.now(),
      nombre:  nombre.value.trim(),
      admin:   adminAsig.value,
      tipo:    tipo.value,
      monto:   Number(monto.value),
      activo:  estadoPH.value === "activo",
    });
  }
  limpiar();
};

const editar = (ph) => {
  editandoId.value = ph.id;
  nombre.value    = ph.nombre;
  direccion.value = ph.tipo;
  tipo.value      = ph.tipo;
  monto.value     = ph.monto;
  adminAsig.value = ph.admin;
  estadoPH.value  = ph.activo ? "activo" : "inactivo";
  errores.value   = {};
};

const toggleEstado = (ph) => { ph.activo = !ph.activo; };

const limpiar = () => {
  editandoId.value = null;
  nombre.value = direccion.value = tipo.value = monto.value = adminAsig.value = "";
  estadoPH.value = "activo";
  errores.value = {};
};
</script>

<template>
  <div class="shell">

    <!-- ── Sidebar ── -->
    <aside class="sidebar">
      <div class="sb-brand">
        <div class="sb-brand-icon">
          <i class="ti ti-building"></i>
        </div>
        <div>
          <div class="sb-brand-name">Chantin</div>
          <div class="sb-brand-role">Super Admin</div>
        </div>
      </div>

      <div style="padding: 8px 0;">
        <router-link to="/dashboard" class="sb-item">
          <i class="ti ti-layout-dashboard"></i> Dashboard
        </router-link>
      </div>

      <div class="sb-section">Gestión</div>
      <router-link to="/gestion-ph" class="sb-item active">
        <i class="ti ti-building-estate"></i> PH
      </router-link>
      <router-link to="/usuarios" class="sb-item">
        <i class="ti ti-users"></i> Usuarios
      </router-link>
      <router-link to="/administradores" class="sb-item">
        <i class="ti ti-user-shield"></i> Administradores
      </router-link>
      <router-link to="/morosidad" class="sb-item">
        <i class="ti ti-alert-circle"></i> Morosidad
      </router-link>
      <router-link to="/reportes" class="sb-item">
        <i class="ti ti-chart-bar"></i> Reportes
      </router-link>
      <router-link to="/configuracion" class="sb-item">
        <i class="ti ti-settings"></i> Configuración
      </router-link>

      <div class="sb-bottom">
        <a href="#" class="sb-item">
          <i class="ti ti-logout"></i> Cerrar sesión
        </a>
      </div>
    </aside>

    <!-- ── Main ── -->
    <div class="main-wrap">

      <!-- Topbar -->
      <header class="topbar">
        <button class="icon-btn" aria-label="Menú">
          <i class="ti ti-menu-2"></i>
        </button>
        <div class="topbar-right">
          <button class="icon-btn" aria-label="Notificaciones">
            <i class="ti ti-bell"></i>
          </button>
          <div class="topbar-avatar">SA</div>
          <span class="topbar-name">Super Admin</span>
          <i class="ti ti-chevron-down" style="font-size:13px; color:var(--text-muted)"></i>
        </div>
      </header>

      <!-- Content -->
      <main class="content">
        <div class="page-header">
          <div>
            <h1 class="page-title">Gestión de PH</h1>
            <p class="breadcrumb">Inicio / Gestión de PH</p>
          </div>
          <button class="btn-add" @click="limpiar">
            <i class="ti ti-plus"></i> Agregar PH
          </button>
        </div>

        <div class="two-col">

          <!-- Formulario -->
          <div class="card">
            <div class="card-header">
              <div class="card-icon"><i class="ti ti-building"></i></div>
              <div>
                <p class="card-title">{{ formTitle }}</p>
                <p class="card-sub">Completa la información del PH.</p>
              </div>
            </div>
            <div class="card-body">

              <div class="field">
                <label>Nombre del PH <span class="req">*</span></label>
                <input v-model="nombre" type="text" placeholder="Ej. PH Vista Sol"
                  :class="{ error: errores.nombre }" />
                <span v-if="errores.nombre" class="error-msg">{{ errores.nombre }}</span>
              </div>

              <div class="field">
                <label>Dirección <span class="req">*</span></label>
                <input v-model="direccion" type="text" placeholder="Ej. Av. Principal, Calle 123"
                  :class="{ error: errores.direccion }" />
                <span v-if="errores.direccion" class="error-msg">{{ errores.direccion }}</span>
              </div>

              <div class="two-field">
                <div class="field">
                  <label>Tipo <span class="req">*</span></label>
                  <select v-model="tipo" :class="{ error: errores.tipo }">
                    <option value="">Seleccionar tipo</option>
                    <option>Residencial</option>
                    <option>Comercial</option>
                    <option>Mixto</option>
                  </select>
                  <span v-if="errores.tipo" class="error-msg">{{ errores.tipo }}</span>
                </div>
                <div class="field">
                  <label>Monto de contrato <span class="req">*</span></label>
                  <div class="monto-wrap">
                    <span class="monto-prefix">$</span>
                    <input v-model="monto" type="number" min="0" placeholder="1500.00"
                      :class="{ error: errores.monto }" />
                  </div>
                  <span v-if="errores.monto" class="error-msg">{{ errores.monto }}</span>
                </div>
              </div>

              <div class="field">
                <label>Administrador asignado <span class="req">*</span></label>
                <select v-model="adminAsig" :class="{ error: errores.adminAsig }">
                  <option value="">Seleccionar administrador</option>
                  <option v-for="a in administradores" :key="a">{{ a }}</option>
                </select>
                <span v-if="errores.adminAsig" class="error-msg">{{ errores.adminAsig }}</span>
              </div>

              <div class="field">
                <label>Estado <span class="req">*</span></label>
                <div class="toggle-row">
                  <div class="toggle-opt" :class="{ active: estadoPH === 'activo' }"
                    @click="estadoPH = 'activo'">
                    <div class="toggle-knob" :class="estadoPH === 'activo' ? 'on' : 'off'"></div>
                    <div>
                      <div class="toggle-label">Activo</div>
                      <div class="toggle-desc">PH habilitado</div>
                    </div>
                  </div>
                  <div class="toggle-opt" :class="{ active: estadoPH === 'inactivo' }"
                    @click="estadoPH = 'inactivo'">
                    <div class="toggle-knob" :class="estadoPH === 'inactivo' ? 'on' : 'off'"></div>
                    <div>
                      <div class="toggle-label">Inactivo</div>
                      <div class="toggle-desc">PH deshabilitado</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="info-box">
                <i class="ti ti-info-circle" style="font-size:15px; flex-shrink:0; margin-top:1px"></i>
                Si el PH se encuentra con morosidad extrema, cámbialo a Inactivo para restringir el acceso.
              </div>

              <div class="btn-row">
                <button class="btn-primary" @click="guardar">
                  <i class="ti ti-device-floppy"></i>
                  {{ editandoId ? 'Guardar cambios' : 'Guardar PH' }}
                </button>
                <button class="btn-secondary" @click="limpiar">
                  <i class="ti ti-x"></i> Cancelar
                </button>
              </div>

            </div>
          </div>

          <!-- Columna derecha -->
          <div style="display: flex; flex-direction: column; gap: 14px;">

            <!-- Tabla -->
            <div class="card">
              <div class="card-header">
                <div class="card-icon"><i class="ti ti-list"></i></div>
                <div>
                  <p class="card-title">Listado de PH</p>
                  <p class="card-sub">Administra los PH registrados en el sistema.</p>
                </div>
              </div>

              <div class="search-row">
                <div class="search-wrap">
                  <i class="ti ti-search"></i>
                  <input v-model="busqueda" type="text"
                    placeholder="Buscar por nombre o administrador..." />
                </div>
                <button class="btn-filter">
                  <i class="ti ti-filter"></i> Filtros
                </button>
              </div>

              <div class="table-wrap">
                <table class="ph-table">
                  <thead>
                    <tr>
                      <th>Nombre del PH</th>
                      <th>Administrador</th>
                      <th>Tipo</th>
                      <th>Monto contrato</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="phFiltrados.length === 0">
                      <td colspan="6" style="text-align:center; padding:2rem; color:var(--text-muted);">
                        No se encontraron resultados.
                      </td>
                    </tr>
                    <tr v-for="ph in phFiltrados" :key="ph.id">
                      <td>{{ ph.nombre }}</td>
                      <td>{{ ph.admin }}</td>
                      <td>{{ ph.tipo }}</td>
                      <td>${{ ph.monto.toLocaleString('es-PA', { minimumFractionDigits: 2 }) }}</td>
                      <td>
                        <span :class="ph.activo ? 'badge badge-on' : 'badge badge-off'">
                          {{ ph.activo ? 'Activo' : 'Inactivo' }}
                        </span>
                      </td>
                      <td>
                        <div class="td-actions">
                          <button class="act-btn" @click="editar(ph)" title="Editar">
                            <i class="ti ti-edit"></i>
                          </button>
                          <button class="act-btn" @click="toggleEstado(ph)"
                            :title="ph.activo ? 'Desactivar' : 'Activar'">
                            <i :class="ph.activo ? 'ti ti-player-pause' : 'ti ti-player-play'"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="table-footer">
                <span>Mostrando {{ phFiltrados.length }} de {{ phList.length }} PH</span>
                <div class="pag">
                  <button class="pag-btn"><i class="ti ti-chevron-left" style="font-size:11px"></i></button>
                  <button class="pag-btn active">1</button>
                  <button class="pag-btn"><i class="ti ti-chevron-right" style="font-size:11px"></i></button>
                </div>
              </div>
            </div>

            <!-- Acciones info -->
            <div class="card">
              <div class="card-header" style="padding: 11px 18px;">
                <p class="card-title">Acciones disponibles</p>
              </div>
              <div class="actions-grid">
                <div class="action-item">
                  <div class="action-icon"><i class="ti ti-player-pause"></i></div>
                  <div>
                    <div class="action-title">Desactivar</div>
                    <div class="action-desc">Deshabilita el PH por morosidad extrema.</div>
                  </div>
                </div>
                <div class="action-item">
                  <div class="action-icon"><i class="ti ti-player-play"></i></div>
                  <div>
                    <div class="action-title">Activar</div>
                    <div class="action-desc">Habilita el PH nuevamente.</div>
                  </div>
                </div>
                <div class="action-item">
                  <div class="action-icon"><i class="ti ti-info-circle"></i></div>
                  <div>
                    <div class="action-title">Nota</div>
                    <div class="action-desc">Solo PH inactivos pueden reactivarse.</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <div class="note-bar">
        <i class="ti ti-info-circle" style="font-size:15px; flex-shrink:0; margin-top:1px"></i>
        Nota: Los PH inactivos no podrán ser seleccionados por los usuarios ni realizar operaciones dentro del sistema.
      </div>

    </div>
  </div>
</template>