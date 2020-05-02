<template>
  <div @click="openBubble">
    <h3>{{ bubble.question }}</h3>
    <p>
      {{ bubble.description }}
    </p>
  </div>
</template>

<script>
export default {
  name: "bubble",
  props: ["bubble"],
  created() {
    console.log(this.bubble);
  },
  methods: {
    openBubble() {
      this.$router.push({ name: "view", params: { uid: this.bubble.id } });
    }
  }
};
</script>

<style scoped>
div {
  background: blue;
  padding: 30px;
  margin: 50px;
  border-radius: 50%;
  height: 300px;
  width: 300px;
  color: white;
  text-align: center;
  font-family: "georgia";
  transition: all 0.2s;
  text-overflow: ellipsis;
  background-clip: padding-box;
}
h3 {
  font-size: 30px;
  font-family: "neuton";
}

div:hover {
  transform: scale(1.1);
}
</style>
