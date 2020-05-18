<template>
  <div class="user-bubble" :style="fabMenu && 'position: relative'" @click.stop>
    <h2>{{ user.username }}<span v-if="isMe"> (this is you!)</span></h2>

    <p v-if="!editing" @click="startEditing">
      {{ user.details }}
    </p>
    <v-textarea
      v-show="editing && fabMenu"
      label="About me"
      hint="Optional"
      v-model="newDetails"
      dark
      auto-grow
      rows="2"
      counter="1000"
    >
    </v-textarea>
    <v-btn v-if="editing" @click="editing = !editing">Cancel</v-btn>
    <v-btn v-if="editing" @click="submitNewDetails">Update</v-btn>

    <v-btn
      :to="{ name: 'user', params: { username: user.username } }"
      outlined
      color="white"
    >
      {{ isMe ? "My" : user.username + "'s" }} bubbles
    </v-btn>
    <v-btn v-if="fabMenu" text color="white" @click="logout">
      Logout
    </v-btn>
  </div>
</template>

<script>
import firebase from "firebase";
import db from "@/firebase/init";
import { getters, setCurrentUser } from "../utilities/store";

export default {
  name: "userBubble",
  props: ["user", "fabMenu"],
  data() {
    return {
      isMe: false,
      editing: false,
      newDetails: this.user.details
    };
  },
  created() {
    console.log("user bubble user: ", this.user);
    if (this.user.userUid === getters.currentUser().uid) {
      this.isMe = true;
    }
  },
  methods: {
    startEditing() {
      if (this.fabMenu) {
        this.editing = true;
      }
    },
    submitNewDetails() {
      db.collection("users")
        .doc(this.user.userUid)
        .update({
          details: this.newDetails
        })
        .then(() => {
          console.log("Successfully written!");
          this.user.details = this.newDetails;
          this.editing = false;
          this.newDetails = "";
        })
        .catch(error => console.log("Error!", error));
    },
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.push({ name: "login" });
          setCurrentUser(null); //TODO look into why the onFirebaseAuthChange or whatever function isn't doing this for us
        });
    }
  }
};
</script>

<style scoped>
.user-bubble {
  background: blue;
  color: white;
  position: absolute;
  padding: 1.2em;
  z-index: 500;
  box-shadow: 0 0 200px 10px blue, 0 0 100px 10px blue;
  font-style: normal;
  font-family: "roboto", sans-serif;
  font-size: 1.2rem;
  transition: all 0.2s;
  width: 50vw;
  max-width: 500px;
}

h2 {
  font-family: "neuton", serif;
}

h2 span {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.7em;
}
</style>
