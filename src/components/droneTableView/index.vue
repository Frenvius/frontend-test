<template>
  <b-container fluid="lg">
    <div v-if="!hasRecords" style="text-align: center">
      <br /><br />LOADING DATA...
    </div>
    <div v-if="hasRecords">
      <div class="justify-content-centermy-1 row">
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
        :items="filteredItems"
        :fields="fields"
        striped
        hover
        :current-page="currentPage"
        :per-page="perPage"
      >
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
type Drone = {
  [index: string]: string | number;
  id: number;
  image: string;
  name: string;
  address: string;
  battery: number;
  max_speed: number;
  average_speed: number;
  status: string;
  fly: number;
  currentFly: string;
};

type Filter = {
  [index: string]: string;
  id: string;
  name: string;
  currentFly: string;
  status: string;
};

type DataType = {
  selectAll: boolean;
  records: Drone[];
  perPage: number;
  currentPage: number;
  filters: Filter;
  pageOptions: number[];
  currentFlyOptions: string[];
  StatusOptions: string[];
  fields: object[];
};

import Vue from "vue";
import axios from "axios";

export default Vue.extend({
  data(): DataType {
    return {
      selectAll: false,
      records: [],
      perPage: 10,
      currentPage: 1,
      filters: {
        id: "",
        name: "",
        currentFly: "Select",
        status: "Select"
      },
      pageOptions: [10, 20, 30, 50, 100],
      currentFlyOptions: ["Select", "Going", "Coming"],
      StatusOptions: [
        "Select",
        "Charging",
        "Failed",
        "Flying",
        "Offline",
        "Repair",
        "Success"
      ],
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
    hasRecords() {
      const records: Drone[] = this.records;
      return records.length > 0;
    },
    totalRows() {
      const filteredItems: Drone[] = this.filteredItems;
      return filteredItems.length;
    }
  },
  mounted() {
    axios.get("http://services.solucx.com.br/mock/drones/").then(res => {
      this.records = res.data;
    });
  }
});
</script>

<style lang="scss"></style>
