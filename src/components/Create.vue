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
// import { getPosts } from "../utilities/store";
import { createBubble, getters } from "../utilities/store";

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
    async create() {
      let data = { question: this.question, description: this.description };
      await createBubble(data);

      this.question = null;
      this.description = null;

      this.$emit("input", false);
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
