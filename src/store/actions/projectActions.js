// Create a new blank project
export const createProject = newProject => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    // make async call to DB
    const firestore = getFirestore();
    const profile = getState().firebase.profile;
    const uid = getState().firebase.auth.uid;
    const project = {
      ...newProject,
      authorFirstName: profile.firstName,
      authorLastName: profile.lastName,
      authorId: uid,
      leds: [],
      imgURL: "",
      createdAt: new Date(),
      lastEdit: new Date()
    };

    firestore
      .collection("projects")
      .add(project)
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

export const delProject = () => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const project = getState().project.localProject;
    const firestore = getFirestore();
    const projDocRef = firestore.collection("projects").doc(project.id);

    firestore
      .runTransaction(transaction => {
        // This code may get re-run multiple times if there are conflicts.
        return transaction.get(projDocRef).then(projDoc => {
          if (!projDoc.exists) {
            throw "Document does not exist!";
          }
          projDocRef.delete();
        });
      })
      .then(res => {
        dispatch({ type: "PROJECT_DELETED", project });

        console.log("Project deleted, " + res);
      })
      .catch(err => {
        console.log("project delete error: ", err.message);
      });
  };
};

export const setLocalProject = localProject => {
  console.log("dispatch localProject, ", localProject);
  return dispatch => dispatch({ type: "SET_LOCAL_PROJECT", localProject });
};

export const uploadImg = img => {
  // TODO check for file types
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    // Path within Database for metadata (also used for file Storage path)
    const authorId = getState().firebase.auth.uid;
    const currentProject = getState().project.localProject;
    const storagePath = "projectImages/" + authorId;
    const fileName = currentProject.id + "_" + Date.now();
    const renamedImg = new File([img], fileName, { type: img.type });
    // TODO metadata not working
    // const dbPath = "projectFilesInfo/" + authorId;
    // const fileMetadata = { authorId, projectId, fileName};

    firebase
      .uploadFile(storagePath, renamedImg)
      // firebase.uploadFile(storagePath, img, storagePath)
      .then(res => {
        res.uploadTaskSnapshot.ref.getDownloadURL().then(imgURL => {
          // add to the project in firestore
          const firestore = getFirestore();
          const projDocRef = firestore.collection("projects").doc(currentProject.id);

          firestore
            .runTransaction(function(transaction) {
              // This code may get re-run multiple times if there are conflicts.
              return transaction.get(projDocRef).then(function(projDoc) {
                if (!projDoc.exists) {
                  throw "Document does not exist!";
                }
                // set instead of update, in case there is no imgURL field
                projDocRef.set({ imgURL, lastEdit: new Date() }, { merge: true });
              });
            })
            .then(res => {
              dispatch({ type: "PROJECT_UPDATED", currentProject });

              console.log("Project updated, " + res);
            })
            .catch(err => {
              console.log("project update error: ", err.message);
            });

          dispatch({ type: "UPLOAD_IMG", imgURL });
        });
      })
      .catch(error => {
        console.log("Error uploading image: ", error.message);
      });
  };
};

export const updateProject = () => {
  // TODO fix setting the project!!
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const project = getState().project.localProject;
    const firestore = getFirestore();
    const projDocRef = firestore.collection("projects").doc(project.id);

    firestore
      .runTransaction(transaction => {
        // This code may get re-run multiple times if there are conflicts.
        return transaction.get(projDocRef).then(projDoc => {
          if (!projDoc.exists) {
            throw "Document does not exist!";
          }
          projDocRef.set({ ...project, lastEdit: new Date() }, { merge: true });
        });
      })
      .then(res => {
        dispatch({ type: "PROJECT_UPDATED", project });

        console.log("Project updated, " + res);
      })
      .catch(err => {
        console.log("project update error: ", err.message);
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
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    // make async call to DB
    // add to the project in firestore
    const firestore = getFirestore();
    const currentProject = getState().project.currentProject;
    const projDocRef = firestore.collection("projects").doc(currentProject.id);

    firestore
      .runTransaction(transaction => {
        // This code may get re-run multiple times if there are conflicts.
        return transaction.get(projDocRef).then(projDoc => {
          if (!projDoc.exists) {
            throw "Document does not exist!";
          }
          const newLeds = [...currentProject.leds, led];
          projDocRef.set({ leds: newLeds, lastEdit: new Date() }, { merge: true });
        });
      })
      .then(res => {
        dispatch({ type: "ADD_LED", led });

        console.log("LED added, " + res);
      })
      .catch(err => {
        console.log("LED add error: ", err.message);
      });
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
