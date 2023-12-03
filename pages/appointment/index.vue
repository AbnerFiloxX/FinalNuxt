<template>
    <div class="ma-5">
        <v-row>
            <v-col>
                <ui-register />
            </v-col>
        </v-row>
    </div>
</template>

<script>
import uiRegister from '@/components/uiUsers/uiRegister.vue'



export default {
    layout: 'appointment',
    components: {
        uiRegister
    }
}
</script>