import db from "@/firebase/init";
import firebase from "firebase";
import cuid from "cuid";

export const store = {
  bubbles: [],
  replies: [],
  users: [],
  currentUser: {}
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
  },
  currentUser: () => {
    console.log("getter currentuser: ", store.currentUser);
    return store.currentUser;
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

export async function getAllReplies() {
  let replies = [];
  await db
    .collection("replies")
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        let tempReply = doc.data();
        tempReply.id = doc.id;
        replies.push(tempReply);
      });
    })
    .catch(error => console.log("Error getting replies!", error));
  store.replies = replies;
  console.log("store replies: ", store.replies);
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

export async function getAllUsers() {
  let users = [];
  await db
    .collection("users")
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        let tempUser = doc.data();
        tempUser.id = doc.id;
        users.push(tempUser);
      });
    })
    .catch(error => console.log("Error!", error));
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
export async function createReply(data) {
  let fullData = {
    ...data,
    userUid: firebase.auth().currentUser.uid,
    created: Date.now(),
    id: cuid()
  };
  await db
    .collection("replies")
    .doc(fullData.id)
    .set(fullData)
    .then(res => {
      console.log("Create reply", res);
      store.replies.push(fullData);
    })
    .catch(error => console.log("error creating comment: ", error));
}
// Create user

//
//
//
//

/**
 * READ FUNCTIONS
 * */

// get all replies of a bubble by its uid:
export function getBubbleReplies(uid) {
  let bubbleReplies = store.replies.filter(reply => reply.parentUid === uid);

  // also need to populate the replies with the user data:

  bubbleReplies.map(reply => {
    reply.userData = store.users.find(user => user.id === reply.userUid);
    return reply;
  });

  return bubbleReplies;
  // getReplyUserData(reply) {
  //   console.log("reply: ", reply.userUid);
  //   return db
  //     .collection("users")
  //     .doc(reply.userUid)
  //     .get()
  //     .then(doc => {
  //       console.log("user data: ", doc.data());
  //       return doc.data();
  //     });
  // },
}

/**
 * UPDATE ALL FUNCTIONS
 * Take data, update in db and also locally
 * (but don't update db and then pull in from db to update locally)
 * */

// update all bubbles (on bubble create/delete)

// update all replies (on reply create/delete)
// update all users (on user create/edit/delete)

// update current user (in App::create() on auth change)
export function setCurrentUser(user) {
  store.currentUser = user;
}
