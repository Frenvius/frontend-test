<template>
  <b-container fluid="lg">
    <router-link to="/" class="back-button"
      ><b-icon-arrow-left-circle-fill></b-icon-arrow-left-circle-fill></router-link>
    <div v-if="hasDroneInfo" style="text-align: center">
      <br /><br />LOADING DATA...
    </div>
    <div class="detail-box" v-if="!hasDroneInfo">
      <div class="header">
        <div class="info">
          <b-img
            class="header__avatar"
            :src="droneAvatar"
            alt="Drone avatar"
          ></b-img>
          <span class="header__info">
            <div class="header__info__name">
              {{ this.droneInfo.name }} <small>#{{ this.droneInfo.id }}</small>
            </div>
            <small class="header__info__address">{{
              this.droneInfo.address
            }}</small>
          </span>
        </div>
        <div class="header__battery">
          <b-progress
            :value="this.droneInfo.battery"
            max="100"
            class="battery-fill"
          ></b-progress>
          <b-icon-battery class="battery-icon"></b-icon-battery>
          <span class="header__battery__text"
            >{{ this.droneInfo.battery }}%</span
          >
        </div>
      </div>
      <div class="body">
        <span class="body__drone-info-item"
          ><b-icon-check-circle></b-icon-check-circle><strong>Status:</strong>
          {{ this.droneInfo.status }}</span
        >
        <span class="body__drone-info-item"
          ><b-icon-arrow-down-up></b-icon-arrow-down-up>
          <strong>Current Fly:</strong> {{ this.droneInfo.currentFly }}</span
        >
        <span class="body__drone-info-item"
          ><b-icon-bar-chart-line-fill></b-icon-bar-chart-line-fill>
          <strong>Max Speed:</strong>
          <span class="speed">
            {{ formatSpeed(this.droneInfo.max_speed)[0] }}.<small
              >{{ formatSpeed(this.droneInfo.max_speed)[1] }} m/h</small
            ></span
          ></span
        >
        <span class="body__drone-info-item"
          ><b-icon-bar-chart-line></b-icon-bar-chart-line>
          <strong>Average Speed:</strong>
          <span class="speed">
            {{ formatSpeed(this.droneInfo.average_speed)[0] }}.<small
              >{{ formatSpeed(this.droneInfo.average_speed)[1] }} m/h</small
            ></span
          ></span
        >
      </div>
    </div>
  </b-container>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";

import { Drone } from "@/models/Drone";

type DataType = {
  droneInfo: Drone;
};

export default Vue.extend({
  data(): DataType {
    return {
      droneInfo: {
        id: 0,
        image: "",
        name: "",
        address: "",
        battery: 0,
        // eslint-disable-next-line @typescript-eslint/camelcase
        max_speed: 0,
        // eslint-disable-next-line @typescript-eslint/camelcase
        average_speed: 0,
        status: "",
        fly: 0,
        currentFly: ""
      }
    };
  },
  computed: {
    droneAvatar(): string {
      const avatarUrlSplit: string[] = this.droneInfo.image.split("?");
      return avatarUrlSplit[0];
    },
    hasDroneInfo(): boolean {
      const droneInfo: Drone = this.droneInfo;
      return droneInfo.id === 0;
    }
  },
  methods: {
    formatSpeed(speed: string): string[] {
      return speed.toString().split(".");
    }
  },
  mounted() {
    const id = this.$route.params.id;
    axios.get("http://services.solucx.com.br/mock/drones/").then(res => {
      const droneArr = res.data;
      this.droneInfo = droneArr.find((item: Drone) => item.id === Number(id));
      this.droneInfo.fly < 50
        ? (this.droneInfo.currentFly = "going")
        : (this.droneInfo.currentFly = "coming");
    });
  }
});
</script>

<style lang="scss">
@import "./styles.scss";
</style>
