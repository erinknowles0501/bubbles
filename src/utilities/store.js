import db from "@/firebase/init";
import firebase from "firebase";
import cuid from "cuid";

export const store = {
  bubbles: [],
  replies: [],
  users: []
};

export const getters = {
  bubbles: () => {
    return store.bubbles;
  },
  replies: () => {
    return store.replies;
  },
  users: () => {
    return store.users;
  }
};

/**
 * Need to separate functions that get from firebase from those that use those functions to manip data.
 * IE getAllUsers(), getAllBubbles, getAllReplies. These run on load.
 * (and whenever something updates? Could just update the store and re-load later on next page load...!)
 * So in App::created() run getAllUsers getAllBubbles and getAllReplies.
 *
 * Also: probably need moment()-related functions here. Format time, sort by time...
 *
 */

export function getAllReplies() {
  let replies = [];
  db.collection("replies")
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        tempReply = doc.data();
        tempReply.id = doc.id;
        replies.push(tempReply);
      });
    })
    .catch(error => console.log("Error getting replies!", error));
  store.replies = replies;
}

// i think something about vue reactivity with arrays is breaking this
// nope probably something about getters

export function getAllBubbles() {
  let bubbles = [];
  db.collection("threads")
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        let tempDoc = doc.data();
        tempDoc.id = doc.id;
        bubbles.push(tempDoc);
      });
    })
    .catch(error => {
      console.log("Error getting bubbles!", error);
    });
  store.bubbles = bubbles;
}

export function getAllUsers() {
  let users = [];
  db.collection("users")
    .get()
    .then(snapshot => {
      snapshot
        .forEach(doc => {
          let tempUser = doc.data();
          tempUser.id = doc.id;
          users.push(tempUser);
        })
        .catch(error => console.log("Error!", error));
    });
  store.users = users;
}

// export async function getPostReplies(id) {
//   let replies = [];
//   await db
//     .collection("replies")
//     .get()
//     .then(querySnapshot => {
//       console.log(querySnapshot);
//       querySnapshot
//         .forEach(doc => {
//           let tempReply = doc.data();
//           tempReply.id = doc.id;
//           replies.push(tempReply);
//         })
//         .catch(error => console.log("Error!", error));
//       console.log(replies);
//     });
//   return replies;
// }

/**
 * CREATE FUNCTIONS
 * Take the data, create in db, create in store, but do not then get from db -
 * data should be there waiting for next page load.
 * That is, all data except the doc id firebase gives it....we could supply cuids on our end with cuid()...?
 * */

// Create bubble
export function createBubble(data) {
  let fullData = {
    ...data,
    active: true,
    created: Date.now(),
    userUid: firebase.auth().currentUser.uid,
    id: cuid()
  };

  db.collection("threads")
    .doc(fullData.id)
    .set(fullData)
    .then(res => {
      console.log("Created bubble", res);
      store.bubbles.push(fullData);
      console.log("new store bubbles: ", store.bubbles);
    })
    .catch(error => console.log("Error! ", error));
}

// Create reply
// Create user

/**
 * UPDATE ALL FUNCTIONS
 * Take data, update in db and also locally
 * (but don't update db and then pull in from db to update locally)
 * */

// update all bubbles (on bubble create/delete)

// update all replies (on reply create/delete)
// update all users (on user create/edit/delete)
