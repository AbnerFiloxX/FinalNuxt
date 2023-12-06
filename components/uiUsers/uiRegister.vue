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
            <!-- Agrega más campos según sea necesario -->
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
          value: "motivo" },
      ],
      citas: [],

      showCitaFormDialog: false,
      nuevaCita: {
        fecha: null,
        hora: "",
        motivo: "",
        doctor: null,
        paciente: null,
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

  mounted() {
    this.loadCitas();
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
      };
    },
    agregarCita() {
      fetch("http://localhost:5000/new-cita", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.nuevaCita),
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
    },
  },
};
</script>