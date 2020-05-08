<template>
  <div class="bubble-wrap">
    <div class="bubble-bg"></div>
    <v-container>
      <h1>{{ bubble.question }}</h1>
      <p class="description">{{ bubble.description }}</p>

      <ul v-if="replies">
        <li class="reply-wrap" v-for="reply in replies" :key="reply.id">
          <div class="meta">
            {{ reply.userData.username }}, posted blah
            <v-btn
              icon
              class="delete"
              v-if="canDelete(reply.userUid)"
              @click="deleteReply(reply.id)"
            >
              <v-icon color="rgba(255,255,255,0.5)">mdi-delete</v-icon>
            </v-btn>
          </div>
          <p class="reply">{{ reply.comment }}</p>
        </li>
      </ul>

      <v-form
        v-if="user"
        v-model="valid"
        action.prevent
        @submit="createComment"
      >
        <v-textarea
          v-model="comment"
          dark
          auto-grow
          rows="3"
          counter="1000"
          autofocus
          @keyup.ctrl.enter="createComment"
        ></v-textarea>
        <v-btn type="submit" depressed large>Post</v-btn>
      </v-form>

      <p v-else>Sign up or log in to write replies</p>
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
      comment: null,
      user: null
    };
  },
  async created() {
    this.user = firebase.auth().currentUser;

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
            tempComment.userData = await this.getReplyUserData(doc.data()); // might take less reads to just pull in .where('username', '==', ['user1', 'user2']) and then squish the data with JS
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
    },
    canDelete(userUid) {
      if (firebase.auth().currentUser) {
        return userUid === firebase.auth().currentUser.uid;
      } else {
        return false;
      }
    },
    deleteReply(replyUid) {
      db.collection("replies")
        .doc(replyUid)
        .delete()
        .then(() => {
          console.log("Document successfully deleted");
          this.replies.splice(
            this.replies.findIndex(reply => (reply.id = replyUid)),
            1
          );
        })
        .catch(error => console.log("Error!", error));
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
  position: relative;
  z-index: 50;
  color: white;
  padding: 50px;
  padding-top: 100px;
}

.bubble-bg {
  background: blue;
  position: fixed;
  top: 60px;
  bottom: -500px;
  right: -500px;
  left: -500px;
  border-radius: 50%;
  z-index: -50;
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
  border-left: 4px solid rgba(255, 255, 255, 0.4);
}

.reply {
  margin: 0;
}

.meta {
  font-size: 0.9em;
  font-style: italic;
  font-family: "neuton", serif;
  color: rgba(255, 255, 255, 0.6);
  position: relative;
}

.delete {
  position: absolute;
  top: 0;
  right: 0;
  transition: all 0.15s;
}

.delete:hover {
  color: white;
  scale: 1.3;
}
</style>
