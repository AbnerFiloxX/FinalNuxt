<template>
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

    <v-timeline align-top>
      <v-timeline-item
        v-for="cita in citas"
        :key="cita.clave"
        small
        color="primary"
      >
        <v-row>
          <v-col cols="4">{{ cita.fecha }}</v-col>
          <v-col cols="8">{{ cita.motivo }}</v-col>
        </v-row>
        <v-row>
          <v-col cols="4">{{ cita.hora }}</v-col>
          <v-col cols="8">{{ cita.paciente }}</v-col>
        </v-row>
        <!-- Agrega aquí más detalles si lo deseas -->
      </v-timeline-item>
    </v-timeline>
  </v-app>
</template>
  
<script>
export default {
  data() {
    return {
      citas: [],
    };
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
  mounted() {
    this.loadCitas();
  },
  methods: {
    loadCitas() {
      fetch("http://localhost:5000/get-citas")
        .then((response) => response.json())
        .then((data) => {
          // Ordenar las citas por fecha y, si están en el mismo día, por hora
          this.citas = data.citas.sort((a, b) => {
            const dateA = new Date(a.fecha);
            const dateB = new Date(b.fecha);

            // Comprobar si las fechas son iguales
            if (dateA.toDateString() === dateB.toDateString()) {
              // Si las fechas son iguales, ordenar por hora
              const timeA = a.hora.split(":");
              const timeB = b.hora.split(":");

              return (
                new Date(0, 0, 0, timeA[0], timeA[1]) -
                new Date(0, 0, 0, timeB[0], timeB[1])
              );
            }

            // Si las fechas son diferentes, ordenar por fecha
            return dateA - dateB;
          });
        })
        .catch((error) => {
          console.error("Error al obtener las citas:", error);
        });
    },
  },
};
</script>