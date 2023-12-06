<template>
  <v-card elevation="15" color="blue lighten-5" width="600">
    <v-card-title class="text-h3"> Welcome to my App </v-card-title>
    <v-card-text>
      <v-form v-model="isValid" ref="formLogin">
        <v-row>
          <v-text-field
            v-model="usuario"
            placeholder="Escribe tu usuario"
            label="Usuario"
            filled
            :rules="[regla.vacio]"
          />
        </v-row>
        <v-row>
          <v-text-field
            v-model="password"
            type="password"
            placeholder="Escribe tu contraseña"
            label="Contraseña"
            filled
            :rules="[regla.vacio, regla.cantidad]"
          />
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-row class="pa-2 ma-2" justify="space-around" align="center">
        <v-btn color="green" @click="ingresarSistema"> Ingresar </v-btn>
        <v-btn color="purple" @click="irRegistro"> Registro </v-btn>
      </v-row>
    </v-card-actions>
  </v-card>
</template>
  
<script>
export default {
  data() {
    return {
      usuario: "",
      password: "",
      isValid: false,
      regla: {
        vacio: (value) => !!value || "Campo Requerido!!!",
        cantidad: (value) => value.length > 8 || "Mínimo 9 Caracteres",
      },
    };
  },
  methods: {
    async ingresarSistema() {
      const valid = this.$refs.formLogin.validate();

      if (valid) {
        try {
          const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              usuario: this.usuario,
              password: this.password,
            }),
          });

          const data = await response.json();

          if (data.alert === "Inicio de sesión exitoso") {
            // Almacenar el token en localStorage
            localStorage.setItem("token", data.token);

            alert("Inicio de sesión exitoso");
            // Redirigir a la ruta del dashboard
            this.$router.push("/dashboard");
          } else {
            alert("Credenciales incorrectas");
          }
        } catch (error) {
          alert("Error en la autenticación");
          console.error(error);
        }
      } else {
        alert("Datos incorrectos");
      }
    },
    irRegistro() {
      this.$router.push("/registro"); // Esta será la ruta de registro
    },
  },
};
</script>