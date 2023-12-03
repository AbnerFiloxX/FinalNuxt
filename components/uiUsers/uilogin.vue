<template>
    <v-card 
        elevation="15"
        color="blue lighten-5"
        width="600"
    >
        <v-card-title class="text-h3">
            Welcome to my App
        </v-card-title>
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
                <v-btn color="red">
                    Cancelar
                </v-btn>
                <v-btn color="green" @click="ingresarSistema">
                    Ingresar
                </v-btn>
            </v-row>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    data () {
        return {
            usuario: '',
            password:'',
            isValid: false,
            regla: {
                vacio: value => !!value || 'Campo Requerido!!!',
                cantidad: value => value.length > 8 || 'Minimo 9 Caractéres'
            }
        }
    },
    methods: {
        ingresarSistema () {
            const valid = this.$refs.formLogin.validate()
            if (valid) {//codigo para cambiar de pagina
                this.$router.push('/dashboard')
            } else {//mostrar una alerta
                alert('Datos Incorrectos')
            }
        }
    }
}
</script>