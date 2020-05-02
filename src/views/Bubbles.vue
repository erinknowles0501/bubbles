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
      loaded: false,
      bubbles: []
    };
  },
  // not dang workin
  // computed: {
  //   bubbles: {
  //     get() {
  //       console.log(getters.bubbles());
  //       return getters.bubbles();
  //     },
  //     set() {
  //       return getters.bubbles();
  //     }
  //   }
  // },
  async created() {
    await getPosts();
    this.bubbles = getters.bubbles();
    console.log("this bubbles!", this.bubbles);
    this.loaded = true;
  }
};
</script>
