<template>
    <v-app>
       <uiDrawer />
            <v-main>
                <Nuxt />
            </v-main>
    </v-app>
</template>

<script>
import uiDrawer from '~/components/uiAppointment/uiDrawer.vue'//uiDRawer sera el de los patients(pacientes)
  export default {
    components: {
      uiDrawer
    }
  }
</script>