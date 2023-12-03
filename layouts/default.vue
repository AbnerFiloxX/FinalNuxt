<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row 
          width="100vw" 
          style="height: 100vh;"
          align="center" 
          justify="center"
        >
          <Nuxt />
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data () {
    return {
    }
  }
}
</script>
