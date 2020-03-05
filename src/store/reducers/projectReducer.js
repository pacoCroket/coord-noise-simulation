const initState = {
  projects: [],
  currentProject: {}
};

const projectReducer = (state = initState, action) => {
  switch (action.type) {
    case "CREATE_PROJECT":
      console.log("Create project success ", action.project);
      return state;
    case "CREATE_PROJECT_ERROR":
      console.log("Create project error ", action.err);
      return state;
    case "LOAD_PROJECTS":
      console.log("Load projects success ", action.projects);
      return { ...state, projects: [...action.projects] };
    case "SET_CURRENT_PROJECT":
      console.log("Current project ID: ", action.project.id);
      return { ...state, currentProject: { ...action.project } };
    case "UPLOAD_IMG":
      console.log("Image uploaded: ", action.imgURL);
      return {...state, currentProject: {...state.currentProject, imgURL: action.imgURL}};
    case "ADD_IMG":
      console.log("Img added ", action.imgUrl);
      return state;
    case "ADD_LED":

      return state;
    case "DEL_LED":

      return state;
    case "SET_LED":

      return state;
    default:
      return state;
  }
};

export default projectReducer;
