<template>
  <v-app>
    <v-content>
      <v-btn
        fixed
        top
        left
        color="main"
        dark
        @click="$router.push({ name: 'home' })"
        >Bubbles</v-btn
      >
      <div class="actions">
        <v-btn
          dark
          x-large
          icon
          fab
          depressed
          color="main"
          @click="$router.push({ name: 'myAccount' })"
        >
          <v-icon>mdi-account-circle</v-icon>
        </v-btn>

        <v-btn
          v-if="!viewing"
          class="add"
          fab
          :color="create ? 'white' : 'main'"
          depressed
          dark
          x-large
          icon
          @click="create = !create"
          :style="create && 'transform: rotate(45deg)'"
          ><v-icon>mdi-plus</v-icon></v-btn
        >
        <v-btn
          v-if="viewing"
          @click="$router.push({ name: 'home' })"
          fab
          color="main"
          depressed
          dark
          x-large
          icon
          ><v-icon>mdi-arrow-left</v-icon></v-btn
        >
      </div>

      <Create v-model="create" />

      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import db from "@/firebase/init";
import firebase from "firebase";
import Create from "./components/Create";
import UserButton from "./components/UserButton";
// import { mdiPlus } from "@mdi/js";

export default {
  name: "App",
  components: {
    Create: Create,
    UserButton: UserButton
  },
  data() {
    return {
      create: false,
      user: false
    };
  },
  computed: {
    viewing() {
      return this.$route.params.uid ? true : false;
    }
  },
  created() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log("user signed in!", user.uid);
      } else {
        // No user is signed in.
        console.log("no user signed in :(");
      }
    });
  }
};
</script>

<style>
html,
body,
.theme--light.v-application {
  height: 100%;
  background: #cfdbd8 !important;
  color: white !important;
}

.actions {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 100;
  padding: 20px;
}

/* .actions button.add {
  background: blue;
  transition: all 0.2s;
  color: white;
  font-size: 30px;
  line-height: 30px;
  padding: 10px;
  margin: 20px;
  border: 0;
  height: 50px;
  width: 50px;
  border-radius: 50%;
} */

.actions button:hover {
  transform: scale(1.1);
}

ul {
  list-style: none;
}
</style>
