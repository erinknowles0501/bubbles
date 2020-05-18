<template>
  <v-navigation-drawer
    v-model="value"
    fixed
    temporary
    right
    width="40%"
    color="main"
    overlay-color="#FFFFFF"
    class="expand"
  >
    <h3>Create</h3>

    <v-form action.prevent @submit="create">
      <v-textarea
        label="Question:"
        v-model="question"
        auto-grow
        dark
        rows="1"
        @keydown.enter.prevent
        counter="75"
      ></v-textarea>

      <v-textarea
        label="Description"
        hint="Optional"
        v-model="description"
        dark
        auto-grow
        rows="2"
        counter="1000"
      ></v-textarea>

      <v-btn type="submit">Post</v-btn>
    </v-form>
  </v-navigation-drawer>
</template>

<script>
import firebase from "firebase";
import db from "@/firebase/init";
import { getPosts } from "../utilities/store";

export default {
  name: "create",
  props: ["value"],
  data() {
    return {
      question: null,
      description: null
    };
  },
  methods: {
    create() {
      db.collection("threads")
        .add({
          question: this.question,
          description: this.description,
          active: true,
          created: Date.now(),
          userUid: firebase.auth().currentUser.uid
        })
        .then(res => {
          console.log(res);
          this.question = null;
          this.description = null;
        })
        .catch(error => console.log("Error! ", error));

      this.$emit("input", false);

      getPosts();
    }
  }
};
</script>

<style scoped>
.expand {
  padding: 2em;
  padding-top: 5em;
  text-align: right;
  color: white;
}
</style>
