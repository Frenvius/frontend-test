<template>
  <div class="home">
    <droneTable />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DroneTable from "@/components/droneTableView/index.vue";

@Component({
  components: {
    DroneTable
  }
})
export default class Home extends Vue {}
</script>
