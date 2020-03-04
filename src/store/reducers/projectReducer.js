const initState = {
  projects: [],
  currrentProjectId: ""
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
      console.log("Current project ID ", action.currrentProjectId);
      return {...state, currrentProjectId: action.currrentProjectId};
    case "ADD_IMG":
      console.log("Img added", action.imgUrl);
      var projects = state.projects.map(project =>
        project.id === state.currrentProjectId ? { ...project, backImg: { imgUrl: action.imgUrl } } : project
      );
      return { ...state, projects };
    case "ADD_LED":
      var projects = state.projects.map(project =>
        project.id === state.currrentProjectId  ? { ...project, leds: [...project.leds, action.led] } : project
      );
      return { ...state, projects };
    case "DEL_LED":
      var leds = state.leds.filter(led => led.id !== action.led.id);
      // update ID of all LEDs to maintain continuity
      leds.forEach((led, index) => {
        led.id = index;
      });
      return { ...state, leds };
    case "SET_LED":
      var leds = state.leds.map(led => (led.id === action.led.id ? action.led : led));
      return { ...state, leds };
    default:
      return state;
  }
};

export default projectReducer;
