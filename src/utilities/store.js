import db from "@/firebase/init";

export const store = {
  bubbles: []
};

export const getters = {
  bubbles: () => {
    return store.bubbles;
  }
};

export function getPosts() {
  db.collection("threads")
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        let tempDoc = doc.data();
        tempDoc.id = doc.id;
        store.bubbles.push(tempDoc);
      });
    })
    .catch(error => {
      console.log("Error!", error);
    });
}

// i think something about vue reactivity with arrays is breaking this
// nope probably something about getters

// export function getPosts() {
//   let bubbles = [];
//   db.collection("threads")
//     .get()
//     .then(snapshot => {
//       snapshot.forEach(doc => {
//         let tempDoc = doc.data();
//         tempDoc.id = doc.id;
//         bubbles.push(tempDoc);
//       });
//     });
//   store.bubbles = bubbles;
// }
