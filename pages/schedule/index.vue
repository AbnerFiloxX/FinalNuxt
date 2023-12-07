<template>
    <div class="ma-5">
        <v-row>
            <v-col>
                <ui-Schedule />
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