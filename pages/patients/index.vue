<template>
    <div class="ma-5">
        <v-row>
            <v-col>
               <ui-usuarios />
            </v-col>
        </v-row>
    </div>
</template>

<script>
import uiUsuarios from '~/components/uiUsers/uiUsuarios.vue'


export default {
    layout: 'patients',
    components: {
        uiUsuarios
    }
}
</script>