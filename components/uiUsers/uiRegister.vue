<template>
    <v-form ref="frmRegistro" v-model="frmRegistro">
        <v-app-bar app color="white" dark>
            <v-toolbar-title class="black--text font-weight-bold">Doctor</v-toolbar-title>
            <v-icon class="mr-2 grey--text"> mdi-chevron-right</v-icon>
            <v-toolbar-title class="black--text">{{ pageTitle }}</v-toolbar-title>
            <v-icon class="mr-2 green--text ml-auto"> mdi mdi-bell-badge</v-icon>
            <v-card class="pa-0.8 rounded-xl" color="green" >
                    <v-avatar size="38">
                    <v-img :src="require('/assets/images/Dra.jpg')" alt="Foto"></v-img>
                    </v-avatar>
                    <span class="mr-7 white--text">Available</span>
                </v-card>
        </v-app-bar>

        <v-row align="center" class="text-h2">
            Datos del Usuario
        </v-row>
        <v-row align="center">
            <label for="">Nombre(s):</label>
            <v-text-field
                class="ml-3"
                type="text"
                v-model="nombre"
                placeholder="Nombre"
                :rules="[reglas.requerido]"
                />
        </v-row>
        <v-row align="center">
            <label for="">A. Paterno:</label>
            <v-text-field
                class="ml-3"
                type="text"
                v-model="apaterno"
                placeholder="Apellido Paterno"
                :rules="[reglas.requerido]"
                />
        </v-row>
        <v-row align="center">
            <label for="">A. Materno:</label>
            <v-text-field
                class="ml-3"
                type="text"
                v-model="amaterno"
                placeholder="Apellido Materno"
                />
        </v-row>
        <v-row align="center">
            <label for="">Correo Electronico:</label>
            <v-text-field
                class="ml-3"
                type="text"
                v-model="email"
                placeholder="Correo Electronico (se toma como usuario)"
                :rules="[reglas.requerido]"
                />
        </v-row>
        <v-row align="center">
            <label for="">Telefono:</label>
            <v-text-field
                class="ml-3"
                type="phone"
                v-model="telefono"
                placeholder="Telefono"
                />
        </v-row>
        <v-row align="center">
            <label for="">Password:</label>
            <v-text-field
                class="ml-3"
                type="text"
                v-model="password"
                placeholder="Escribe tu Password"
                :rules="[reglas.requerido,reglas.cantidad]"
                />
        </v-row>
        <v-row align="center">
            <label for=""> Verificar Password:</label>
            <v-text-field
                class="ml-3"
                type="text"
                v-model="passwordVerifica"
                placeholder="Verifica tu Password"
                :rules="[
                    reglas.requerido,
                    reglas.cantidad,
                    reglas.verifica
                ]"
            />
        </v-row>
        <v-row align="center" justify="center">
            <v-btn
                color="green"
                @click="registraUsuario"
            >
                Guardar
            </v-btn>
        </v-row>
    </v-form>
</template>

<script>
export default {
    data() {
        return {
            frmRegistro: false,
            nombre: '',
            apaterno: '',
            amaterno: '',
            email: '',
            telefono: '',
            password: '',
            passwordVerifica: '',
            reglas: {
                requerido: value => !!value || 'Campo Requerido!!!',
                cantidad: value => value.length > 8 || 'Minimo 9 Caractéres',
                verifica: value => value === this.password || 'Contraseña no coincide'
            }
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
    methods: {
        async registraUsuario () {
            this.frmRegistro = this.$refs.frmRegistro.validate()
            if (this.frmRegistro) {
                //Registro el Usuario
                const sendData = {
                    nombre: this.nombre,
                    apaterno: this.apaterno,
                    amaterno: this.amaterno,
                    email: this.email,
                    telefono: this.telefono,
                    password: this.password
                }
                const rawResponse = await fetch('http://localhost:5000/new-user', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(sendData)
                })
                const content = await rawResponse.json()
                if (content.alert ==='success') {
                    this.nombre = ''
                    this.apaterno = ''
                    this.amaterno = ''
                    this.telefono = ''
                    this.email = ''
                    this.password =' '
                    this.passwordVerifica = ''
                    this.$store.commit('setNewUser', true)
                } else if (content.alert === 'El usuario ya existe') {
                    //crear alerta cuando ya existe
                }
                console.log('@@@ response =>', content)
            } else {
                //Notificacion de Error
            }
        }
    }
}
</script>