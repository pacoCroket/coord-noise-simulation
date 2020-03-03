// Create a new blank project
export const createProject = project => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    // make async call to DB
    const firestore = getFirestore();
    firestore
      .collection("projects")
      .add({
        ...project,
        author: "Mario",
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
