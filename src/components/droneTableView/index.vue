<template>
  <b-container fluid="lg">
    <div v-if="!hasRecords" style="text-align: center">
      <br /><br />LOADING DATA...
    </div>
    <div v-if="hasRecords">
      <div class="justify-content-centermy-1 row filter-row">
        <b-form-fieldset horizontal label="Drone ID" class="col-2">
          <b-form-input v-model="filters.id" type="number"></b-form-input>
        </b-form-fieldset>
        <b-form-fieldset horizontal label="Name" class="col-4">
          <b-form-input v-model="filters.name"></b-form-input>
        </b-form-fieldset>
        <b-form-fieldset horizontal label="Current Fly" class="col-2">
          <b-form-select
            v-model="filters.currentFly"
            :options="currentFlyOptions"
          />
        </b-form-fieldset>
        <b-form-fieldset horizontal label="Status" class="col-2">
          <b-form-select v-model="filters.status" :options="StatusOptions" />
        </b-form-fieldset>
        <b-form-fieldset horizontal label="Per Page" class="col-2">
          <b-form-select v-model="perPage" :options="pageOptions" />
        </b-form-fieldset>
      </div>
      <b-table
        class="drone-table"
        :items="filteredItems"
        :fields="fields"
        hover
        :current-page="currentPage"
        :per-page="perPage"
        :tbody-tr-class="droneStatus"
        @row-hovered="onRowHover"
        @row-unhovered="onRowUnhovered"
        @row-clicked="seeDetails"
      >
        <template #cell(name)="data">
          <b-img
            class="customer__avatar"
            :src="data.item.image"
            alt="Drone avatar"
          ></b-img>
          <span class="customer__info">
            <div class="customer__info__name">{{ data.item.name }}</div>
            <small class="customer__info__address">{{
              data.item.address
            }}</small>
          </span>
        </template>
        <template #cell(battery)="data">
          <span :id="'tooltip-wrapper-' + data.index">
            <b-progress
              :value="data.item.battery"
              :max="100"
              class="battery__progress"
              align-v="center"
              :id="'battery-status-' + data.index"
            ></b-progress>
            <b-tooltip
              :ref="'batteryTooltip-' + data.index"
              :target="'battery-status-' + data.index"
              :container="'tooltip-wrapper-' + data.index"
            >
              {{ data.item.battery }}%
            </b-tooltip>
          </span>
        </template>
        <template #cell(max_speed)="data">
          <span class="speed">
            {{ formatSpeed(data.item.max_speed)[0] }}.<small
              >{{ formatSpeed(data.item.max_speed)[1] }} m/h</small
            ></span
          >
        </template>
        <template #cell(average_speed)="data">
          <span class="speed">
            {{ formatSpeed(data.item.average_speed)[0] }}.<small
              >{{ formatSpeed(data.item.average_speed)[1] }} m/h</small
            ></span
          >
        </template>
        <template #cell(fly)="data">
          <span
            class="tooltip-wrapper"
            v-b-tooltip.hover
            :title="data.item.currentFly"
          >
            <b-form-input
              :value="data.item.fly"
              :class="data.item.currentFly + ' fly-range'"
              type="range"
              :max="100"
              disabled
            ></b-form-input>
          </span>
        </template>
        <template #cell(status)="data">
          <span :class="'status_box ' + data.item.status">{{
            data.item.status
          }}</span>
        </template>
      </b-table>
      <b-row>
        <b-col md="6" class="my-1">
          <b-pagination
            :total-rows="totalRows"
            :per-page="perPage"
            v-model="currentPage"
            class="my-0"
          />
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";

import { Drone } from "@/models/Drone";
import { DataType } from "@/models/DataType";

export default Vue.extend({
  data(): DataType {
    return {
      selectAll: false,
      records: [],
      perPage: 5,
      currentPage: 1,
      filters: {
        id: "",
        name: "",
        currentFly: "Select",
        status: "Select"
      },
      pageOptions: [5, 10, 20, 30, 50, 100],
      currentFlyOptions: ["Select", "Going", "Coming"],
      fields: [
        {
          key: "id",
          sortable: true,
          label: "Drone"
        },
        {
          key: "name",
          sortable: true,
          label: "Customer",
          class: "customer"
        },
        {
          key: "battery",
          sortable: true,
          label: "Batteries",
          class: "battery"
        },
        {
          key: "max_speed",
          sortable: true,
          label: "Max Speed"
        },
        {
          key: "average_speed",
          sortable: true,
          label: "Average Speed"
        },
        {
          key: "fly",
          sortable: false,
          label: "Current Fly",
          class: "current-fly"
        },
        {
          key: "status",
          sortable: false,
          label: "Status"
        }
      ]
    };
  },
  computed: {
    filteredItems(): Drone[] {
      return this.records.filter((e: Drone) => {
        e.fly < 50 ? (e.currentFly = "going") : (e.currentFly = "coming");
        return Object.keys(this.filters).every((el: string) => {
          return (
            this.filters[el] === "" ||
            this.filters[el] === "Select" ||
            String(e[el])
              .toLowerCase()
              .indexOf(this.filters[el].toLowerCase()) !== -1
          );
        });
      });
    },
    StatusOptions(): string[] {
      const records: Drone[] = this.records;
      const statuses: string[] = ["Select"];
      records.map(item => statuses.push(item.status));
      return [...new Set(statuses)];
    },
    hasRecords(): boolean {
      const records: Drone[] = this.records;
      return records.length > 0;
    },
    totalRows(): number {
      const filteredItems: Drone[] = this.filteredItems;
      return filteredItems.length;
    }
  },
  methods: {
    formatSpeed(speed: string): string[] {
      return speed.toString().split(".");
    },
    droneStatus(item: Drone, type: string): string | void {
      const isDroneOnGround =
        item.status === "offline" || item.status === "charging";
      if (item && type === "row") {
        return isDroneOnGround ? "drone-on-ground" : undefined;
      }
    },
    onRowHover: function(item: Drone, index: number) {
      (this as any).$refs["batteryTooltip-" + index].$emit("open");
    },
    onRowUnhovered: function(item: Drone, index: number) {
      console.log(this);
      (this as any).$refs["batteryTooltip-" + index].$emit("close");
    },
    seeDetails: function(item: Drone) {
      this.$router.push({
        path: "/details",
        name: "Details",
        params: { id: String(item.id) }
      });
    }
  },
  mounted() {
    axios.get("http://services.solucx.com.br/mock/drones/").then(res => {
      this.records = res.data;
    });
  }
});
</script>

<style lang="scss">
@import "./styles.scss";
</style>
