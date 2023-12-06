<template>
    <div class="ma-5">
        <v-row>
            <v-col>
                <ui-Barradash />
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