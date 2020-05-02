import db from "@/firebase/init";

export const store = {
  bubbles: [],
  replies: []
};

export const getters = {
  bubbles: () => {
    return store.bubbles;
  }
};

// export function getPosts() {
//   db.collection("threads")
//     .get()
//     .then(snapshot => {
//       snapshot.forEach(doc => {
//         let tempDoc = doc.data();
//         tempDoc.id = doc.id;
//         store.bubbles.push(tempDoc);
//       });
//     })
//     .catch(error => {
//       console.log("Error!", error);
//     });
// }

function getAllReplies() {
  let replies = [];
  db.collection("replies")
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        tempReply = doc.data();
        tempReply.id = doc.id;
        replies.push(tempReply);
      });
    });
  store.replies = replies;
}

// i think something about vue reactivity with arrays is breaking this
// nope probably something about getters

export function getPosts() {
  let bubbles = [];
  db.collection("threads")
    .get()
    .then(snapshot => {
      console.log("posts snapshot: ", snapshot);
      snapshot.forEach(doc => {
        let tempDoc = doc.data();
        tempDoc.id = doc.id;
        bubbles.push(tempDoc);
      });
    })
    .catch(error => {
      console.log("Error!", error);
    });
  store.bubbles = bubbles;
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
