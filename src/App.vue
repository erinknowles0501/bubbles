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
        :to="{ name: 'home' }"
        >Bubbles</v-btn
      >
      <div class="actions">
        <v-btn
          v-if="!user"
          text
          depressed
          color="main"
          :to="{ name: 'signup' }"
        >
          Signup
        </v-btn>
        <v-btn v-if="!user" text depressed color="main" :to="{ name: 'login' }">
          Login
        </v-btn>

        <!-- <v-btn
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
        </v-btn> -->

        <UserButton v-if="user" :user="user"></UserButton>

        <v-btn
          v-if="!viewing && user"
          class="add"
          fab
          :color="create ? 'white' : 'main'"
          depressed
          dark
          x-large
          icon
          @click="create = !create"
          :style="create && 'transform: rotate(45deg)'"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-btn
          v-if="viewing"
          @click="$router.push({ name: 'home' })"
          fab
          color="main"
          depressed
          dark
          x-large
          icon
        >
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
      </div>

      <Create v-if="user" v-model="create" />

      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import db from "@/firebase/init";
import firebase from "firebase";
import Create from "./components/Create";
import UserButton from "./components/UserButton";
import {
  getAllUsers,
  getAllReplies,
  getters,
  setCurrentUser
} from "./utilities/store";
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
  async created() {
    // this has to just kind of run here, TODO find out why.
    // this sets currentUser
    // TODO look into why this isn't updating when you change user...
    // looks like it isn't making it to getter...why?
    // isn't even making it to the firebase user console log just below
    // need to make computed?
    // okay looks like if we drop an await on the following it doesn't watch properly
    // but if we don't make it await then it doesn't get to getters()
    // also even without the await logging out doesn't do anything to the current user state, not in firebase or in the store.

    // seems to be working like this - notice I set this.user directly after setCurrentUser because of the issue
    // we were having with async/await. I wonder how this is gonna bite me in the butt later.
    // TODO: could probably be restrcutrued - so the onauthstatechanged just calls a store function to fill in the db stuff and set current user.
    // we'd still run into the same problem maybe? worth a try
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log("firebase user: ", user);
        db.collection("users")
          .doc(user.uid) // replace this with user from callback?
          .get()
          .then(doc => {
            setCurrentUser(doc.data());
            this.user = getters.currentUser();
          })
          .catch(error => console.log("Error!", error));
      } else {
        setCurrentUser(null);
        this.user = getters.currentUser();
      }
    });

    await getAllUsers();
    await getAllReplies();
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
