<template>
  <div class="detail">
    <DroneDetails />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DroneDetails from "@/components/droneDetailsView/index.vue";

@Component({
  components: {
    DroneDetails
  }
})
export default class Home extends Vue {}
</script>
