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
    
  
  
  </v-app>
  </template>
  
  <script>
  
  export default {
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
    }
  }
  </script>