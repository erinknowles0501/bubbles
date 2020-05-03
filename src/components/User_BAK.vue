<template>
  <v-menu bottom left offset-y>
    <template v-slot:activator="{ on }">
      <v-btn dark x-large icon v-on="on" color="main">
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>
    </template>

    <v-list flat class="list">
      <v-list-item v-for="(item, i) in items" :key="i" @click="">
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: "user",
  data() {
    return {
      items: [
        {
          title: "My account"
        }
      ]
    };
  }
};
</script>

<style scoped>
.list {
  background: transparent;
  box-shadow: 0 !important;
}
</style>
