<template>
  <v-menu bottom left offset-y class="list">
    <template v-slot:activator="{ on }">
      <v-btn dark x-large icon v-on="on" color="main">
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>
    </template>

    <div class="links">
      <router-link class="link" :to="{ name: 'myAccount' }" color="secondary">
        My account
      </router-link>
    </div>
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
  box-shadow: 0 0 !important;
}

.link {
  font-size: 1.4em;
  padding: 1em;
  text-decoration: none;
  color: navy;
  font-family: "neuton";
  border-radius: 4px;
  transition: all 0.2s;
}

.link:hover {
  background: rgba(0, 0, 255, 0.2);
}

.v-menu__content {
  box-shadow: 0 0 !important;
}
</style>
