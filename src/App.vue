<template>
  <v-app>
    <v-content>
      <button
        class="add"
        @click="viewing ? $router.push({ name: 'home' }) : (create = !create)"
        :style="create && 'transform: rotate(45deg)'"
      >
        {{ viewing ? "<" : "+" }}
      </button>

      <Create v-model="create" />

      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import db from "@/firebase/init";
import Create from "./components/Create";

export default {
  name: "App",
  components: {
    Create: Create
  },
  data() {
    return {
      create: false
    };
  },
  computed: {
    viewing() {
      return this.$route.params.uid ? true : false;
    }
  }
};
</script>

<style>
html,
body {
  height: 100%;
  background: #cfdbd8 !important;
  color: white !important;
}

button.add {
  background: blue;
  color: white;
  font-size: 30px;
  line-height: 30px;
  padding: 10px;
  margin: 20px;
  border: 0;
  position: fixed;
  height: 50px;
  width: 50px;
  border-radius: 50%;
  top: 0;
  right: 0;
  transition: all 0.2s;
  z-index: 100;
}

button.add:hover {
  transform: scale(1.1);
}

ul {
  list-style: none;
}
/* 
.v-label {
  color: white !important;
} */
</style>
