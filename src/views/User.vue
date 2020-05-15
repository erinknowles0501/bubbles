<template>
  <v-container>
    <h2>
      {{ $route.params.username }}
    </h2>
    <div v-for="n in 5">{{ n }}</div>
  </v-container>
</template>

<script>
export default {
  name: "user"
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

.v-input {
  margin-bottom: 1em;
  margin-top: 0.5em;
}
</style>
