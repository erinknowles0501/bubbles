<template>
  <div
    v-if="loaded"
    @click="openBubble"
    :style="
      `top: ${top}; left: ${left}; height: ${radius}px; width: ${radius}px;`
    "
  >
    <h3 :style="`font-size: ${em * 2}px !important; line-height: ${em * 2}px`">
      {{ bubble.question }}
    </h3>
    <p :style="`font-size: ${em}px !important`">
      {{ bubble.description }}
    </p>
  </div>
</template>

<script>
// import { getPostReplies } from "@/utilities/store";
import db from "@/firebase/init";

export default {
  name: "bubble",
  props: ["bubble"],
  data() {
    return {
      loaded: false,
      top: Math.random() * 90 + "%",
      left: Math.random() * 90 + "%",
      replies: []
    };
  },
  computed: {
    em() {
      if (this.loaded && this.radius !== 100) {
        console.log("this replies number: ", this.replies.length);
        return (this.replies.length * 0.25 + 1) * 6;
        // okay we want em to get larger with each reply, but get larger slower.
        // replies | expected value
        //       1 | 1
        //       2 | 1.25
        //       3 | 1.5
        //       4 | 1.75
        // is this...quadratics??? -> it would be
        // okay but each reply is worth 0.25 and it starts at 1.
      } else {
        return 0.6 * 16;
      }
    },
    radius() {
      if (this.loaded && this.replies.length > 0) {
        return this.replies.length * 40 + 100;
      } else {
        console.log("no replies");
        return 100;
      }
    }
  },
  async created() {
    await db
      .collection("replies")
      .where("parentUid", "==", this.bubble.id)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          let tempReply = doc.data();
          tempReply.id = doc.id;
          this.replies.push(tempReply);
        });
      })
      .catch(error => console.log("Error!", error));
    console.log("bubble returned replies: ", this.replies);
    // await db
    //   .collection("replies")
    //   .where("parentUid", "==", this.bubble.id)
    //   .get()
    //   .then(snapshot => {
    //     snapshot.forEach(doc => {
    //       let tempReply = doc.data();
    //       tempReply.id = doc.id;
    //       this.replies.push(tempReply);
    //     });
    //   });

    this.loaded = true;
  },
  methods: {
    openBubble() {
      this.$router.push({ name: "view", params: { uid: this.bubble.id } });
    }
  }
};
</script>

<style scoped>
div {
  background: blue;
  border-radius: 50%;
  color: white;
  text-align: center;

  transition: all 0.2s;
  text-overflow: ellipsis;
  background-clip: padding-box;

  position: absolute;

  display: flex;
  justify-content: center;
  flex-direction: column;
}
h3 {
  font-size: 30px;
  font-family: "neuton";
}

div:hover {
  transform: scale(1.1);
}
</style>
