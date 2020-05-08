<template>
  <v-container>
    <v-card>
      <v-form v-model="valid" @submit.prevent="login">
        <v-card-title><h3>Login</h3></v-card-title>
        <v-card-text>
          <v-row v-if="submitError">
            <v-alert text type="error" width="100%">
              <h4>Could not log in!</h4>
              {{ submitError }}
            </v-alert>
          </v-row>
          <v-row>
            <v-text-field
              :rules="rules.emailUsernameRules"
              label="email or username"
              v-model="emailUsername"
            ></v-text-field>
          </v-row>
          <v-row>
            <v-text-field
              type="password"
              :rules="rules.passwordRules"
              label="password"
              v-model="password"
            >
            </v-text-field>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn text color="red">Cancel</v-btn>
          <v-btn :disabled="!valid" color="secondary" type="submit">
            Login
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
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
    login() {
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
              this.$router.push({ name: "Home" });
            })
            .catch(error => {
              console.log("error signing in with email: ", error);
              this.submitError = error;
            });
        } else {
          db.collection("users")
            .where("username", "==", this.emailUsername)
            .get()
            .then(snapshot => {
              snapshot.forEach(doc => {
                firebase
                  .auth()
                  .signInWithEmailAndPassword(doc.data().email, this.password);
              });
              this.$router.push({ name: "Home" });
            })
            .catch(error =>
              console.log("Error signing in with username! ", error)
            );
        }
      }
    }
  }
};
</script>

<style scoped>
.container {
  width: 60%;
  min-width: 300px;
}
.v-card {
  padding: 2rem;
}
.v-card__title {
  padding-left: 0;
}
.row {
  margin-bottom: 1rem;
}
</style>
