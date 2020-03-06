const initState = {
  localProject: {}
};

const projectReducer = (state = initState, action) => {
  switch (action.type) {
    case "CREATE_PROJECT":
      console.log("Create project success ", action.project);
      return { localProject: action.project };
    case "CREATE_PROJECT_ERROR":
      console.log("Create project error ", action.err);
      return state;
    case "DELETED_PROJECT":
      console.log("Load projects success ", action.project);
      return { localProject: {} };
    case "SET_LOCAL_PROJECT":
      console.log("Current project ID: ", action.project.id);
      return { localProject: action.project };
    case "UPLOAD_IMG":
      console.log("Image uploaded: ", action.imgURL);
      return { localProject: { ...state.localProject, imgURL: action.imgURL } };
    case "ADD_IMG":
      console.log("Img added ", action.imgUrl);
      return state;
    case "ADD_LED":
      var newLeds = [...state.localProject.leds, action.led];
      return { localProject: { ...state.localProject, leds: newLeds } };
    case "DEL_LED":
      var newLeds = state.localProject.leds.filter(led => led.id !== action.led.id);
      newLeds = newLeds.map(led => (led.id > action.led.id ? { ...led, id: led.id - 1 } : led));
      return { localProject: { ...state.localProject, leds: newLeds } };
    case "SET_LED":
      var newLeds = state.localProject.leds.map(led => (led.id === action.led.id ? action.led : led));
      return { localProject: { ...state.localProject, leds: newLeds } };
    default:
      return state;
  }
};

export default projectReducer;
