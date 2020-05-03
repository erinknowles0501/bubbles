<template>
  <v-speed-dial bottom left direction="left" transition="slide-y">
    <template v-slot:activator>
      <v-btn dark x-large icon color="main">
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>
    </template>

    <v-chip color="secondary" outlined x-large>my account</v-chip>
  </v-speed-dial>
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
