<template>
  <div class="bubble-wrap">
    <v-container>
      <h1>{{ bubble.question }}</h1>
      <p class="description">{{ bubble.description }}</p>

      <ul v-if="replies">
        <li class="reply-wrap" v-for="reply in replies" :key="reply.id">
          <div class="meta">{{ reply.userData.username }}, posted blah</div>
          <p class="reply">{{ reply.comment }}</p>
        </li>
      </ul>

      <v-form v-model="valid" action.prevent @submit="createComment">
        <v-textarea
          v-model="comment"
          dark
          auto-grow
          rows="3"
          counter="1000"
          autofocus
        ></v-textarea>
        <v-btn type="submit" depressed large>Post</v-btn>
      </v-form>
    </v-container>
  </div>
</template>

<script>
import db from "@/firebase/init";
import firebase from "firebase";

export default {
  name: "view",
  data() {
    return {
      loaded: false,
      bubble: {},
      replies: [],
      valid: false,
      comment: null
    };
  },
  async created() {
    await db
      .collection("threads")
      .doc(this.$route.params.uid)
      .get()
      .then(doc => {
        this.bubble = doc.data();
        this.bubble.id = doc.id;
      })
      .catch(error => {
        console.log("Error! ", error);
        this.$router.push({ name: "home" });
      });

    await this.getReplies();
    console.log(this.replies);
    this.loaded = true;
  },
  methods: {
    async getReplies() {
      await db
        .collection("replies")
        .where("parentUid", "==", this.$route.params.uid)
        .get()
        .then(snapshot => {
          snapshot.forEach(async doc => {
            let tempComment = doc.data();
            tempComment.id = doc.id;
            tempComment.userData = await this.getReplyUserData(doc.data());
            // push no good. need splice
            if (!this.replies.find(reply => reply.id === doc.id)) {
              this.replies.splice(this.replies.length + 1, 0, tempComment);
            }
          });
          console.log("all replies", this.replies);
        })
        .catch(error => {
          console.log("Error!", error);
        });
    },
    getReplyUserData(reply) {
      console.log("reply: ", reply.userUid);
      return db
        .collection("users")
        .doc(reply.userUid)
        .get()
        .then(doc => {
          console.log("user data: ", doc.data());
          return doc.data();
        });
    },
    createComment() {
      db.collection("replies").add({
        comment: this.comment,
        userUid: firebase.auth().currentUser.uid,
        created: Date.now(),
        parentUid: this.$route.params.uid
      });
      this.comment = null;

      this.getReplies();
    }
  },
  watch: {
    replies: {
      handler() {
        console.log("REPLIES CHANGED");
      },
      deep: true
    }
  }
};
</script>

<style scoped>
.bubble-wrap {
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

.container {
  min-width: 300px;
  width: 60%;
  margin: 0 auto;
}

h1 {
  font-family: "neuton", serif;
  font-size: 4em;
}

.description {
  font-size: 1.7em;
}

ul {
  list-style: none;
  padding: 0;
}

.reply-wrap {
  margin: 50px 0;
  padding: 20px;
  font-size: 1.4em;
  border-left: 3px solid white;
}

.reply {
  margin: 0;
}

.meta {
  font-size: 0.9em;
  font-style: italic;
  font-family: "neuton", serif;
  color: rgba(255, 255, 255, 0.6);
}
</style>
