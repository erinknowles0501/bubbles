<template>
  <v-container>
    <h2>Sign up</h2>
    <v-form v-model="valid" @submit.prevent="signup">
      <v-text-field
        v-model="username"
        filled
        type="text"
        label="username"
        color="secondary"
        hint="this is how other users will recognize you. can be as anonymous as you like."
        :rules="rules.username"
        ref="usernameField"
        :error-messages="errors"
        :success-messages="successes"
        @blur="checkExists"
      ></v-text-field>

      <v-text-field
        v-model="email"
        filled
        type="email"
        label="email"
        color="secondary"
        hint="this is required for verification and moderation purposes, but it will not be shared."
        :rules="rules.email"
      >
      </v-text-field>

      <v-text-field
        v-model="password"
        filled
        type="password"
        label="password"
        color="secondary"
        hint="at least 10 characters. there are no special character or capitalization requirements"
        :rules="rules.password"
      >
      </v-text-field>

      <v-text-field
        v-model="passwordConfirm"
        filled
        type="password"
        label="confirm password"
        color="secondary"
        :rules="rules.passwordConfirm"
      ></v-text-field>

      <v-btn type="submit" color="main" dark>Sign up</v-btn>
    </v-form>
  </v-container>
</template>

<script>
import firebase from "firebase";
import db from "@/firebase/init";

export default {
  name: "signup",
  data() {
    return {
      valid: true,
      username: "",
      email: "",
      password: "",
      passwordConfirm: "",
      rules: {
        username: [
          v => !!v || "Required.",
          v =>
            /^[a-z0-9-]+$/i.test(v) ||
            "Usernames can only contain a-z, A-Z, 0-9, and dashes."
        ],
        email: [
          v => !!v || "Required.",
          v =>
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
            "Not a valid email address."
        ],
        password: [
          v => !!v || "Required",
          v =>
            (v && v.length >= 10) || "Password much be at least 10 characters"
        ],
        passwordConfirm: [
          v => (v && v === this.password) || "Passwords do not match"
        ]
      },
      errors: "",
      successes: ""
    };
  },
  methods: {
    signup() {
      if (this.valid) {
        firebase
          .auth()
          .createUserWithEmailAndPassword(this.email, this.password)
          .then(cred => {
            db.collection("users")
              .doc(cred.user.uid)
              .set({
                username: this.username,
                userUid: cred.user.uid,
                email: this.email
              });
            // this.$router.push({
            //   name: "User",
            //   params: { userId: cred.user.uid }
            // });
            // TODO: have this redirect to user page once created
            this.$router.push({
              name: "home"
            });
          })
          .catch(error => console.log("Error: ", error));
      }
    },
    async checkExists(v) {
      // remove errors+successes so can start fresh
      this.errors = "";
      this.successes = "";

      this.$refs.usernameField.loading = true;
      console.log(this.username);
      await db
        .collection("users")
        .where("username", "==", this.username)
        .get()
        .then(snapshot => {
          let exists = false;
          snapshot.forEach(doc => {
            if (doc.exists) {
              console.log("exists!");
              exists = true;
            }
          });
          if (exists) {
            this.errors =
              "This username is already taken. Try adding dashes or different capitalization";
          } else {
            this.successes = "This username is available!";
            console.log("doesn't exist!");
          }
        });
      this.$refs.usernameField.loading = false;
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

.v-input {
  margin-bottom: 1em;
  margin-top: 0.5em;
}
</style>
