<template>
  <v-app>
  <v-app-bar app color="white" dark>
    <v-toolbar-title class="black--text font-weight-bold">Doctor</v-toolbar-title>
    <v-icon class="mr-2 grey--text"> mdi-chevron-right</v-icon>
    <v-toolbar-title class="black--text">{{ pageTitle }}</v-toolbar-title>
    <v-icon class="mr-2 green--text ml-auto"> mdi mdi-bell-badge</v-icon>
    <v-card class="pa-0.8 rounded-xl" color="green">
      <v-avatar size="38">
        <v-img :src="require('/assets/images/Dra.jpg')" alt="Foto"></v-img>
      </v-avatar>
      <span class="mr-7 white--text">Available</span>
    </v-card>
  </v-app-bar>

    <v-carousel
      cycle
      height="400"
      hide-delimiter-background
      show-arrows-on-hover
    >
      <template v-slot:prev="{ on, attrs }">
        <v-btn
          color="success"
          v-bind="attrs"
          v-on="on"
        >Previous slide</v-btn>
      </template>
      <template v-slot:next="{ on, attrs }">
        <v-btn
          color="info"
          v-bind="attrs"
          v-on="on"
        >Next slide</v-btn>
      </template>
      <v-carousel-item
        v-for="(slide, i) in slides"
        :key="i"
      >
        <v-sheet
          :color="colors[i]"
          height="100%"
        >
          <v-row
            class="fill-height"
            align="center"
            justify="center"
          >
          <v-img :src="slide" aspect-ratio="2.5"></v-img>
          </v-row>
        </v-sheet>
      </v-carousel-item>
    </v-carousel>
    
        <v-card
      class="mx-0"  
      max-width="100%"
      outlined
      elevation="24"
      shaped
    >
      <v-list-item three-line>
        <v-list-item-content>
          <v-list-item-title class="text-h5 mb-1">
            Bienvenid@ de vuelta Doctor 
          </v-list-item-title>
          <v-list-item-subtitle>Usted tiene {{ citasPendientes }} pacientes por atender.</v-list-item-subtitle>
        </v-list-item-content>

        <div class="text-overline mb-4">
          <v-img
            src="https://i.ibb.co/DgLvvD8/1572132.png"
            alt="Avatar"
            width="160"  
            height="160"
          ></v-img>
        </div>

      </v-list-item>

      <v-card-actions>
        <v-btn
          outlined
          rounded
          text
        >
          Ir a Appointments
        </v-btn>
      </v-card-actions>
    </v-card>


</v-app>
</template>

<script>

export default {
  data () {
      return {
        colors: [
          'indigo',
          'warning',
          'pink darken-2',
          'red lighten-1',
          'deep-purple accent-4',
        ],
        slides: [
          'https://i.ibb.co/9rmR9Kj/medica-sur-3.jpg',
          'https://i.ibb.co/DLVbRjv/medicos-mexicanos-de-especialidad-700x467.jpg',
          'https://i.ibb.co/JyxjGn1/gettyimages-1359987247-612x612.jpg',
          'https://i.ibb.co/VTBmNgK/psychotherapy-topic-landing-page-tile-tcm7-311728.jpg',
          'https://i.ibb.co/syQvH51/reasons-to-become-medical-assistant.jpg',
        ],
        citasPendientes: 0,
      }
    },
  computed: {
      pageTitle() {
    const currentRoute = this.$route.path;

    switch (currentRoute) {
      case '/dashboard':
        return 'Dashboard';
      case '/appointment':
        return 'Appointment';
      case '/patients':
        return 'Patients';
      case '/schedule':
        return 'Schedule';
      default:
        return 'Unknown';
    }
  }
  },
  mounted() {
  fetch('http://localhost:5000/get-citas')
    .then(response => response.json())
    .then(data => {
      if (data.alert === 'success') {
        this.citasPendientes = data.citas.length;
      } else {
        console.error('Error al obtener las citas:', data.error);
      }
    })
    .catch(error => {
      console.error('Error al realizar la solicitud:', error);
    });
},
}
</script>
