<template>
    <div class="ma-5">
        <v-row>
            <v-col cols="20">
                <ui-Schedule />
            </v-col>
            <v-col cols="20">
                AUN NO SE HACE NADA
            </v-col>
        </v-row>
    </div>
</template>

<script>
import uiSchedule from '@/components/uiUsers/uiSchedule.vue'
export default {
    layout: 'schedule',
    components: {
        uiSchedule
    }
}
</script>