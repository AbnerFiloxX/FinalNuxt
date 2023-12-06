<template>
    <v-card elevation="15" color="blue lighten-5" width="600">
      <v-card-title class="text-h3">
        Registro de Usuario
      </v-card-title>
      <v-card-text>
        <v-form v-model="isValid" ref="formRegistro">
          <v-row>
            <v-text-field
              v-model="nombre"
              placeholder="Ingresa tu nombre"
              label="Nombre"
              filled
              :rules="[regla.vacio]"
            />
          </v-row>
          <v-row>
            <v-text-field
              v-model="usuario"
              placeholder="Ingresa tu usuario"
              label="Usuario"
              filled
              :rules="[regla.vacio]"
            />
          </v-row>
          <v-row>
            <v-text-field
              v-model="password"
              type="password"
              placeholder="Ingresa tu contraseña"
              label="Contraseña"
              filled
              :rules="[regla.vacio, regla.cantidad]"
            />
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-row class="pa-2 ma-2" justify="space-around" align="center">
          <v-btn color="red" @click="cancelar">
            Cancelar
          </v-btn>
          <v-btn color="green" @click="registrarUsuario">
            Registrarse
          </v-btn>
        </v-row>
      </v-card-actions>
    </v-card>
  </template>
  
  <script>
  export default {
    data() {
      return {
        nombre: '',
        usuario: '',
        password: '',
        isValid: false,
        regla: {
          vacio: (value) => !!value || 'Campo Requerido!!!',
          cantidad: (value) => value.length > 8 || 'Minimo 9 Caractéres',
        },
      };
    },
    methods: {
      async registrarUsuario() {
        const valid = this.$refs.formRegistro.validate();
  
        if (valid) {
          try {
            const response = await fetch('http://localhost:5000/new-doctor', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                nombre: this.nombre,
                usuario: this.usuario,
                password: this.password,
              }),
            });
  
            const data = await response.json();
  
            if (data.alert === 'Registro exitoso') {
              alert('Registro exitoso');
              this.$router.push('/'); // Redirigir al login después del registro exitoso
            } else {
              alert('Error en el registro');
            }
          } catch (error) {
            alert('Error en el registro');
            console.error(error);
          }
        } else {
          alert('Datos incorrectos');
        }
      },
      cancelar() {
        this.$router.push('/');
      },
    },
  };
  </script>  