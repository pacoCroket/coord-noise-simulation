import Utils from "../../Utils";

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
    let projects = [];
    firestore
      .collection("projects")
      .where("authorId", "==", uid)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          // doc.data() is never undefined for query doc snapshots
          projects.push({ ...doc.data(), id: doc.id });
        });
        dispatch({ type: "LOAD_PROJECTS", projects });
      })
      .catch(error => {
        console.log("Error getting documents: ", error);
      });
  };
};

export const delProject = projectId => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    // make async call to DB
    const firestore = getFirestore();
    console.log("delete Project");
  };
};

export const setCurrentProject = currentProject => {
  console.log("dispatch currentProject, ", currentProject);
  return dispatch => dispatch({ type: "SET_CURRENT_PROJECT", currentProject });
};

export const uploadImg = img => {
  // TODO check for file types
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    // Path within Database for metadata (also used for file Storage path)
    const authorId = getState().firebase.auth.uid;
    const projectId = getState().project.currentProject.id;
    const storagePath = "projectImages/" + authorId;
    const fileName = projectId + "_" + Date.now();
    const renamedImg = new File([img], fileName, { type: img.type });
    // TODO metadata not working
    // const dbPath = "projectFilesInfo/" + authorId;
    // const fileMetadata = { authorId, projectId, fileName};

    firebase
      .uploadFile(storagePath, renamedImg)
      // firebase.uploadFile(storagePath, img, storagePath)
      .then(res => {
        res.uploadTaskSnapshot.ref.getDownloadURL().then(imgURL => {
          dispatch({ type: "UPLOAD_IMG", imgURL });
          console.log("Img upload Sucess: " + imgURL);
        });
      })
      .catch(error => {
        console.log("Error uploading image: ", error.message);
      });
  };
};

export const addImg = backImg => {
  return (dispatch, getState) => {
    const { currrentProjectId } = getState().project;
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
