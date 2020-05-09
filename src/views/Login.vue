<template>
  <v-container>
    <h2>Login</h2>
    <v-form v-model="valid" @submit.prevent="login">
      <v-alert text type="error" width="100%" v-if="submitError">
        <h4>Could not log in!</h4>
        {{ submitError }}
      </v-alert>

      <v-text-field
        :rules="rules.emailUsernameRules"
        label="email or username"
        v-model="emailUsername"
        color="secondary"
        filled
      ></v-text-field>

      <v-text-field
        type="password"
        :rules="rules.passwordRules"
        label="password"
        v-model="password"
        color="secondary"
        filled
      >
      </v-text-field>

      <v-btn text color="secondary" depressed>Cancel</v-btn>
      <v-btn :disabled="!valid" color="main" type="submit" dark depressed>
        Login
      </v-btn>
    </v-form>
  </v-container>
</template>

<script>
import firebase from "firebase";
import db from "@/firebase/init";
// import { mdiAlertCircle } from "@mdi/js";
export default {
  data() {
    return {
      valid: true,
      emailUsername: "",
      password: "",
      submitError: false,
      rules: {
        emailUsernameRules: [
          v => !!v || "Required. come on",
          v =>
            (!!v &&
              (/^[a-z0-9-]+$/i.test(v) ||
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v))) ||
            "Not a valid username or email address"
        ],
        passwordRules: [v => !!v || "Required."]
      }
    };
  },
  methods: {
    async login() {
      if (this.emailUsername && this.password) {
        // determine whether entered info is an email address or a username with ~.~.~regex~.~.~
        // rules.emailUsernameRules determines validity of one or other so we don't have to check validity here
        let infoType = /^[a-z0-9-]+$/i.test(this.emailUsername)
          ? "username"
          : "email";
        if (infoType === "email") {
          firebase
            .auth()
            .signInWithEmailAndPassword(this.emailUsername, this.password)
            .then(cred => {
              this.$router.push({ name: "home" });
            })
            .catch(error => {
              console.log("error signing in with email: ", error);
              this.submitError = error;
            });
        } else {
          let userEmail = null;
          await db
            .collection("users")
            .where("username", "==", this.emailUsername)
            .get()
            .then(snapshot => {
              snapshot.forEach(doc => (userEmail = doc.data().email));
            })
            .catch(error => {
              console.log("Error connecting to db ", error);
              this.submitError = error;
            });

          if (userEmail !== null) {
            firebase
              .auth()
              .signInWithEmailAndPassword(userEmail, this.password)
              .then(cred => {
                this.$router.push({ name: "home" });
              })
              .catch(error => {
                this.submitError = error;
                console.log("error signing in: ", error);
              });
          } else {
            console.log("nadaa");
            this.submitError =
              "Likely incorrect credentials. You can try using your email instead.";
          }
        }
      }
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

.row {
  margin-bottom: 1rem;
}
</style>
