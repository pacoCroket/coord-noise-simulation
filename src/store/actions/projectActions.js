// Create a new blank project
export const createProject = project => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    // make async call to DB
    const firestore = getFirestore();
    const profile = getState().firebase.profile;
    const uid = getState().firebase.auth.uid;

    firestore
      .collection("projects")
      .add({
        ...project,
        authorFirstName: profile.firstName,
        authorLastName: profile.lastName,
        authorId: uid,
        createdAt: new Date()
      })
      .then(() => {
        dispatch({ type: "CREATE_PROJECT", project });
      })
      .catch(err => {
        dispatch({ type: "CREATE_PROJECT_ERROR", err });
      });
  };
};

export const getUserProjects = () => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    // make async call to DB
    const firestore = getFirestore();
    const uid = getState().firebase.auth.uid;

    firestore
      .collection("projects")
      .where("authorId", "==", uid)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          // doc.data() is never undefined for query doc snapshots
          dispatch({ type: "LOAD_PROJECT", project: {...doc.data(), id: doc.id}});
        });
      })
      .catch(error => {
        console.log("Error getting documents: ", error);
      });
  };
};

export const addImg = backImg => {
  return (dispatch, getState) => {
    // make async call to DB
    dispatch({ type: "ADD_IMG", backImg });
  };
};

export const addLed = led => {
  return (dispatch, getState) => {
    // make async call to DB
    dispatch({ type: "ADD_LED", led });
  };
};

export const delLed = led => {
  return (dispatch, getState) => {
    // make async call to DB
    dispatch({ type: "DEL_LED", led });
  };
};

export const setLed = led => {
  return (dispatch, getState) => {
    // make async call to DB
    dispatch({ type: "SET_LED", led });
  };
};

// Sing up user
