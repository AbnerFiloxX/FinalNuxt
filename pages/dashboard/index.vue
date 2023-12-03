<template>
    <div class="ma-5">
        <v-row>
            <v-col cols="20">
                <ui-Barradash />
            </v-col>
            <v-col cols="20">
                AUN NO SE HACE NADA
            </v-col>
        </v-row>
    </div>
</template>

<script>
import uiBarradash from '@/components/uiUsers/uiBarradash.vue'
export default {
    layout: 'dashboard',
    components: {
        uiBarradash
    }
}
</script>