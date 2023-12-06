<template>
  <v-navigation-drawer app color="white" permanent left width="400">
    <v-list>
      <v-list-item>
        <v-list-item-content
          class="d-flex justify-center align-center flex-column"
        >
          <v-img
            :src="require('/assets/images/logo2.png')"
            style="max-width: 80%; object-fit: cover"
          ></v-img>
          <v-list-item-avatar size="160">
            <v-img :src="require('/assets/images/Dra.jpg')"></v-img>
          </v-list-item-avatar>
          <v-list-item-title class="text-center display-1">
            {{ doctorName }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-divider />
    <v-list nav dense>
      <v-list-item v-for="(item, i) in items" :key="i" :to="item.route" link>
        <v-list-item-icon>
          <v-icon>
            {{ item.icon }}
          </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            {{ item.text }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
  
  <script>
export default {
  data() {
    return {
      items: [
        {
          text: "Dashboard",
          icon: "mdi mdi-view-dashboard",
          route: "/dashboard",
        },
        {
          text: "Appointment",
          icon: "mdi mdi-calendar-clock",
          route: "/appointment",
        },
        { text: "Patients", icon: "mdi mdi-account-group", route: "/patients" },
        {
          text: "Schedule",
          icon: "mdi mdi-clock-check-outline",
          route: "/schedule",
        },
      ],
      doctorName: "",
    };
  },
  methods: {
    async obtenerNombreDoctor() {
      try {
        const token = localStorage.getItem("token"); // Obtener el token almacenado

        const response = await fetch("http://localhost:5000/nombre-doctor", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Enviar el token en el encabezado de autorización
          },
        });

        const data = await response.json();

        if (data.alert === "success") {
          this.doctorName = data.nombre;
        } else {
          console.error("Error al obtener el nombre del doctor");
        }
      } catch (error) {
        console.error("Error en la solicitud al backend", error);
      }
    },
  },
  mounted() {
    this.obtenerNombreDoctor();
  },
};
</script>
