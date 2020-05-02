<template>
  <div v-if="loaded">
    <h1>{{ bubble.question }}</h1>
    <p>{{ bubble.description }}</p>

    <ul v-if="replies">
      <li v-for="reply in replies" :key="reply.id">
        {{ reply.comment }} {{ reply.created }}
      </li>
    </ul>

    <form action.prevent @submit="createComment">
      <textarea v-model="comment"></textarea>
      <button type="submit">Post</button>
    </form>
  </div>
</template>

<script>
import db from "@/firebase/init";

export default {
  name: "view",
  data() {
    return {
      loaded: false,
      bubble: {},
      replies: [],
      comment: null
    };
  },
  async created() {
    await db
      .collection("threads")
      .doc(this.$route.params.uid)
      .get()
      .then(doc => {
        console.log(doc.data());
        this.bubble = doc.data();
        this.bubble.id = doc.id;
      })
      .catch(error => {
        console.log("Error! ", error);
        this.$router.push({ name: "home" });
      });

    await this.getReplies();

    this.loaded = true;
  },
  methods: {
    getReplies() {
      db.collection("replies")
        .where("parentUid", "==", this.$route.params.uid)
        .get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            let tempComment = doc.data();
            tempComment.id = doc.id;
            // push no good. need splice. or check
            if (!this.replies.find(reply => reply.id === doc.id)) {
              this.replies.push(tempComment);
            }
          });
        })
        .catch(error => {
          console.log("Error!", error);
        });
    },
    createComment() {
      db.collection("replies").add({
        comment: this.comment,
        created: Date.now(),
        parentUid: this.$route.params.uid
      });
      this.comment = null;

      this.getReplies();
    }
  }
};
</script>

<style scoped>
div {
  background: blue;
  position: absolute;
  top: 30px;
  bottom: 30px;
  right: 30px;
  left: 30px;
  z-index: 50;
  color: white;
  padding: 50px;
}
</style>
