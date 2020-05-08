<template>
  <v-app>
    <v-content>
      <v-btn
        fixed
        depressed
        text
        top
        left
        x-large
        color="main"
        dark
        @click="$router.push({ name: 'home' })"
        >Bubbles</v-btn
      >
      <div class="actions">
        <v-btn v-if="!user" text depressed color="main" :to="{ name: 'signup' }"
          >Signup</v-btn
        >
        <v-btn v-if="!user" text depressed color="main" :to="{ name: 'login' }"
          >Login</v-btn
        >

        <v-btn v-if="user" text depressed color="main" @click="logout"
          >Logout</v-btn
        >

        <v-btn
          v-if="user"
          dark
          x-large
          icon
          fab
          depressed
          color="main"
          :to="{ name: 'user', params: { username: user.username } }"
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
      user: null
    };
  },
  computed: {
    viewing() {
      return this.$route.params.uid ? true : false;
    }
  },
  created() {
    // firebase.auth().onAuthStateChanged(function(user) {
    //   if (user) {
    //     console.log("user signed in!", user.uid);

    //     console.log(this.user);
    //   } else {
    //     // No user is signed in.
    //     console.log("no user signed in :(");
    //     this.user = null;
    //   }
    // });
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        db.collection("users")
          .doc(user.uid)
          .get()
          .then(doc => (this.user = doc.data()))
          .catch(error =>
            console.log("Error getting user from current user uid: ", error)
          );
        //	this.user = firebase.auth().currentUser;
        console.log(user);
      } else {
        this.user = null;
      }
    });
  },
  methods: {
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.push({ name: "Login" });
        });
    }
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
