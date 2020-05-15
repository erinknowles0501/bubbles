<template>
  <v-menu bottom left offset-y class="list" transition="slide-x-transition">
    <template v-slot:activator="{ on }">
      <v-btn dark x-large icon v-on="on" color="main">
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>
    </template>

    <UserBubble :user="user" :fabMenu="true"></UserBubble>

    <!-- <div class="links">
      <v-btn
        text
        :to="{ name: 'user', params: { username: username } }"
        color="main"
        large
        depressed
      >
        {{ username }}
      </v-btn>
      <v-btn text depressed small color="main" @click="logout">
        Logout
      </v-btn>
    </div> -->
  </v-menu>
</template>

<script>
import firebase from "firebase";
import UserBubble from "./UserBubble";

export default {
  name: "userButton",
  props: ["user"],
  components: { UserBubble },
  data() {
    return {
      //
    };
  }
};
</script>

<style scoped>
.list {
  background: transparent;
  box-shadow: 0 0 !important;
}

/* .links {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
} */

.v-menu__content {
  box-shadow: 0 0 !important;
}
</style>
