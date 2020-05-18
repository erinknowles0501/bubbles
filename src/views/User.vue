<template>
  <v-container>
    <h2>
      {{ $route.params.username }}
    </h2>
    <div v-if="!loading">
      <router-link
        :to="{ name: 'view', params: { uid: bubble.id } }"
        v-for="bubble in bubbles"
        :key="bubble.id"
      >
        <div class="bubble">
          {{ bubble.question }} <span>{{ formatTime(bubble.created) }}</span>
        </div></router-link
      >
    </div>
  </v-container>
</template>

<script>
import db from "@/firebase/init";
import firebase from "firebase";
import moment from "moment";

export default {
  name: "user",
  data() {
    return {
      loading: true,
      bubbles: [],
      user: {}
    };
  },
  async created() {
    await db
      .collection("users")
      .where("username", "==", this.$route.params.username)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          this.user = doc.data();
        });
      })
      .catch(error => console.log("error!", error));

    await db
      .collection("threads")
      .where("userUid", "==", this.user.userUid)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          let tempBubble = doc.data();
          tempBubble.id = doc.id;
          this.bubbles.push(tempBubble);
        });
      })
      .catch(error => console.log("error!", error));

    this.loading = false;
  },
  methods: {
    formatTime(created) {
      return moment(created).fromNow();
    }
  }
};
</script>

<style scoped>
h2 {
  margin-bottom: 2em;
}

.container {
  margin-top: 120px !important;
  color: navy !important;
  font-weight: 600;
  font-size: 20px;
}

.bubble {
  display: flex;
  align-items: center;
  font-size: 1.3rem;
  line-height: 1.3rem;
  padding-left: 4rem;
  position: relative;
  margin-bottom: 4rem;
}

.bubble::before {
  content: "";
  height: 3rem;
  width: 3rem;
  background: blue;
  border-radius: 50%;
  position: absolute;
  left: 0;
  transition: all 0.2s;
}

.bubble:hover::before {
  transform: scale(1.2);
}

.bubble span {
  font-size: 0.9rem;
  margin-left: 1rem;
}

a {
  color: rgba(0, 0, 255, 0.7);
  text-decoration: none;
}
</style>
