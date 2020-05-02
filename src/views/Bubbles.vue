<template>
  <ul v-if="loaded">
    hello
    <li v-for="bubble in bubbles" :key="bubble.id">
      <Bubble :bubble="bubble" />
    </li>
  </ul>
</template>

<script>
import db from "@/firebase/init";
import Bubble from "../components/Bubble";
import { getPosts, getters } from "../utilities/store";

export default {
  name: "bubbles",
  components: {
    Bubble: Bubble
  },
  data() {
    return {
      loaded: false
    };
  },
  computed: {
    bubbles: {
      get() {
        console.log(getters.bubbles());
        return getters.bubbles();
      },
      set() {}
    }
  },
  async created() {
    await getPosts();
    this.loaded = true;
  }
};
</script>
