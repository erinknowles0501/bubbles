<template>
  <svg height="100vh" width="100vw">
    <circle
      class="circle"
      cx="50%"
      cy="50%"
      :r="radius"
      stroke="blue"
      stroke-width="2"
      fill="#FFF"
      @mouseover="setRadius(1.15)"
      @mouseleave="setRadius(1)"
    />
  </svg>
</template>

<script>
export default {
  name: "bubble",
  data() {
    return {
      radius: null
    };
  },
  created() {
    this.setRadius(1);
  },
  methods: {
    setRadius(multiplier) {
      this.radius = 25 * multiplier + "%";
    }
  }
};
</script>

<style scoped>
.circle {
  transition: all 0.2s;
}
</style>
