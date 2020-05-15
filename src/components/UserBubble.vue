<template>
  <div class="user-bubble">
    <h2>{{ user.username }}</h2>
    <p>{{ user.details }}</p>
    <router-link :to="{ name: 'user', params: { username: user.username } }">
      {{ user.username }}'s bubbles
    </router-link>
  </div>
</template>

<script>
export default {
  name: "userBubble",
  props: ["user"]
};
</script>

<style scoped>
.user-bubble {
  background: blue;
  color: white;
  padding: 1.2em;
  position: absolute;
  z-index: 500;
  box-shadow: 0 0 200px 10px blue, 0 0 100px 10px blue;
  font-style: normal;
  transition: all 0.2s;
}
</style>
