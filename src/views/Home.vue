<template>
  <div class="home">
    <droneTable msg="Welcome to Your Vue.js + TypeScript App" />
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
