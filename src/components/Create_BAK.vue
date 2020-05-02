<template>
  <div :class="value && 'expand'">
    <h2>Create</h2>
    <v-form action.prevent @submit="create">
      <v-text-field
        label="Question:"
        v-model="question"
        style="position: static"
        dark
      ></v-text-field>

      <v-textarea
        label="Description"
        hint="Optional"
        v-model="description"
        style="position: static"
        dark
      ></v-textarea>

      <v-btn type="submit">Post</v-btn>
    </v-form>
  </div>
</template>

<script>
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
          userUid: "abcde"
        })
        .then(res => console.log(res))
        .catch(error => console.log("Error! ", error));

      this.$emit("input", false);

      getPosts();
    }
  }
};
</script>

<style scoped>
div {
  height: 100%;
  width: 50%;
  position: absolute;
  top: 0;
  bottom: 0;
  right: -50%;
  background: blue;
  color: white;
  padding: 40px;
  transition: all 0.2s;
  box-sizing: border-box;
}

.expand {
  right: 0;
}
</style>
