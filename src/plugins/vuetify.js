// src/plugins/vuetify.js

import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";

Vue.use(Vuetify);

const opts = {
  theme: {
    themes: {
      light: {
        primary: "#ffffff",
        secondary: "#000066",
        anchor: "#8c9eff",
        accent: "#ffffff",
        main: "#0000FF"
      }
    }
  }
};

export default new Vuetify(opts);
