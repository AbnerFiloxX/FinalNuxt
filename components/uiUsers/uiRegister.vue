<template>
  <v-form ref="frmCitas" v-model="frmCitas">
    <v-app>
      <v-app-bar app color="white" dark>
        <v-toolbar-title class="black--text font-weight-bold">
          Doctor
        </v-toolbar-title>
        <v-icon class="mr-2 grey--text">mdi-chevron-right</v-icon>
        <v-toolbar-title class="black--text">{{ pageTitle }}</v-toolbar-title>
        <v-icon class="mr-2 green--text ml-auto">mdi mdi-bell-badge</v-icon>
        <v-card class="pa-0.8 rounded-xl" color="green">
          <v-avatar size="38">
            <v-img :src="require('/assets/images/Dra.jpg')" alt="Foto"></v-img>
          </v-avatar>
          <span class="mr-7 white--text">Available</span>
        </v-card>
      </v-app-bar>
      <v-btn depressed color="primary" @click="openCitaForm">
        Agregar nueva cita
      </v-btn>

      <v-dialog v-model="showCitaFormDialog" max-width="600">
        <v-card>
          <v-card-title class="text-h5">Nueva cita</v-card-title>
          <v-card-text>
            <v-row align="center">
              <label for="fecha">Fecha:</label>
              <v-text-field
                class="ml-3"
                v-model="nuevaCita.fecha"
                placeholder="Fecha"
                :rules="[reglas.requerido]"
                readonly
                @click="showDatePicker = true"
              ></v-text-field>
              <v-date-picker
                v-model="nuevaCita.fecha"
                :rules="[reglas.requerido]"
                v-if="showDatePicker"
                @input="showDatePicker = false"
              ></v-date-picker>
            </v-row>
            <v-row align="center">
              <label for="hora">Hora:</label>
              <v-text-field
                class="ml-3"
                v-model="nuevaCita.hora"
                placeholder="Hora"
                readonly
                @click="showTimePicker = true"
              ></v-text-field>
              <v-time-picker
                v-model="nuevaCita.hora"
                full-width
                @input="showTimePicker = false"
                v-if="showTimePicker"
              ></v-time-picker>
            </v-row>
            <v-row align="center">
              <label for="motivo">Motivo:</label>
              <v-text-field
                class="ml-3"
                v-model="nuevaCita.motivo"
                placeholder="Motivo"
                :rules="[reglas.requerido]"
              ></v-text-field>
            </v-row>
            <v-row align="center">
              <label for="doctor">Doctor:</label>
              <v-select
                class="ml-3"
                v-model="nuevaCita.doctor"
                :items="doctores"
                item-value="usuario"
                item-text="nombre"
                :rules="[reglas.requerido]"
              ></v-select>
            </v-row>
            <v-row align="center">
              <label for="paciente">Paciente:</label>
              <v-select
                class="ml-3"
                v-model="nuevaCita.paciente"
                :items="pacientes"
                item-value="email"
                item-text="nombre"
                :rules="[reglas.requerido]"
              ></v-select>
            </v-row>
            <v-row align="center">
              <label for="motivo">Palabra clave:</label>
              <v-text-field
                class="ml-3"
                v-model="nuevaCita.clave"
                placeholder="Clave"
                :rules="[reglas.requerido]"
              ></v-text-field>
            </v-row>
            <v-row align="center">
              <label for="estatus">Estatus:</label>
              <v-select
                class="ml-3"
                v-model="nuevaCita.estatus"
                :items="['Activa', 'Cancelada']"
                :rules="[reglas.requerido]"
              ></v-select>
            </v-row>
            <v-row align="center" justify="center">
              <v-btn color="green" @click="agregarCita">Guardar</v-btn>
              <v-btn color="red darken-1" @click="closeCitaForm"
                >Cerrar Formulario</v-btn
              >
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>

      <v-row>
        <v-data-table :headers="headers" :items="citas" elevation="2">
          <template v-slot:[`item.Acciones`]="{ item }">
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-if="item.estatus !== 'Activa'"
                  color="green"
                  icon
                  @click="changeStatus(item.clave, 'Activa')"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>mdi mdi-checkbox-marked-circle-outline</v-icon>
                </v-btn>
                <v-btn
                  v-if="item.estatus !== 'Cancelada'"
                  color="red"
                  icon
                  @click="changeStatus(item.clave, 'Cancelada')"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>mdi mdi-cancel</v-icon>
                </v-btn>
              </template>
              <span>
                Cambiar estatus de {{ item.paciente }} del {{ item.fecha }}
              </span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-row>
    </v-app>
  </v-form>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        {
          text: "Doctor",
          align: "center",
          sortable: true,
          value: "doctor",
        },
        {
          text: "Paciente",
          align: "center",
          sortable: true,
          value: "paciente",
        },
        {
          text: "Fecha",
          align: "center",
          sortable: true,
          value: "fecha",
        },
        {
          text: "Hora",
          align: "center",
          sortable: false,
          value: "hora",
        },
        {
          text: "Motivo",
          align: "center",
          sortable: true,
          value: "motivo",
        },
        {
          text: "Palabra clave",
          align: "center",
          sortable: true,
          value: "clave",
        },
        {
          text: "Estatus",
          align: "center",
          sortable: true,
          value: "estatus",
        },
        {
          text: "Acciones",
          align: "center",
          sortable: false,
          value: "Acciones",
        },
      ],
      citas: [],

      editCitaData: {},
      dialogEditCita: false,
      frmCitas: false,

      showCitaFormDialog: false,
      nuevaCita: {
        fecha: null,
        hora: "",
        motivo: "",
        doctor: null,
        paciente: null,
        clave: "",
        estatus: "",
      },
      doctores: [], // Lista de doctores obtenida del backend
      pacientes: [], // Lista de pacientes obtenida del backend
      reglas: {
        requerido: (value) => !!value || "Campo Requerido!!!",
      },
      showDatePicker: false,
      showTimePicker: false,
    };
  },

  watch: {
    newUser() {
      if (this.newUser) {
        this.usuarios = [];
        this.loadUsers();
        this.$store.commit("setNewUser", false);
      }
    },
  },

  mounted() {
    this.loadCitas();
  },

  computed: {
    pageTitle() {
      const currentRoute = this.$route.path;

      switch (currentRoute) {
        case "/dashboard":
          return "Dashboard";
        case "/appointment":
          return "Appointment";
        case "/patients":
          return "Patients";
        case "/schedule":
          return "Schedule";
        default:
          return "Unknown";
      }
    },
  },

  methods: {
    loadCitas() {
      fetch("http://localhost:5000/get-citas")
        .then((response) => response.json())
        .then((data) => {
          this.citas = data.citas;
        })
        .catch((error) => {
          console.error("Error al obtener las citas:", error);
        });
    },

    openCitaForm() {
      this.showCitaFormDialog = true;
      fetch("http://localhost:5000/get-doctores")
        .then((response) => response.json())
        .then((data) => {
          this.doctores = data.doctores;
        })
        .catch((error) => {
          console.error("Error al obtener los doctores:", error);
        });

      fetch("http://localhost:5000/get-pacientescitas")
        .then((response) => response.json())
        .then((data) => {
          this.pacientes = data.pacientes;
        })
        .catch((error) => {
          console.error("Error al obtener los doctores:", error);
        });
    },
    closeCitaForm() {
      // Lógica para cerrar el formulario de nueva cita
      this.showCitaFormDialog = false;
      this.nuevaCita = {
        fecha: null,
        hora: "",
        motivo: "",
        doctor: null,
        paciente: null,
        clave: "",
        estatus: "",
      };
    },

    agregarCita() {
      const citaData = {
        fecha: this.nuevaCita.fecha,
        hora: this.nuevaCita.hora,
        motivo: this.nuevaCita.motivo,
        doctor: this.nuevaCita.doctor,
        paciente: this.nuevaCita.paciente,
        clave: this.nuevaCita.clave,
        estatus: this.nuevaCita.estatus,
      };

      const valid = this.$refs.frmCitas.validate();
      if (valid) {
        fetch("http://localhost:5000/new-cita", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(citaData),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Respuesta del backend:", data);
            this.closeCitaForm();
            this.loadCitas();
          })
          .catch((error) => {
            console.error("Error al agregar la cita:", error);
          });
      } else {
        console.error("Formulario no válido");
      }
    },

    async changeStatus(clave, nuevoEstatus) {
      try {
        const rawResponse = await fetch("http://localhost:5000/change-status", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ clave, estatus: nuevoEstatus }),
        });
        const res = await rawResponse.json();
        console.log("Respuesta del cambio de estatus:", res);

        // Actualizar localmente la lista de citas después de cambiar el estado
        const citaIndex = this.citas.findIndex((cita) => cita.clave === clave);
        if (citaIndex !== -1) {
          this.citas[citaIndex].estatus = nuevoEstatus;
        } else {
          console.error(
            "No se encontró la cita para actualizar el estado localmente"
          );
        }
      } catch (error) {
        console.error("Error al cambiar el estatus:", error);
      }
    },
  },
};
</script>