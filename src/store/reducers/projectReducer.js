const initState = {
  projects: [],
  backImg: {imgUrl: ""},
  leds: [],
  title: "",
  description: "",
  author: "",
  createdAt: ""
};

const projectReducer = (state = initState, action) => {
  switch (action.type) {
    case "CREATE_PROJECT":
      console.log("Create project success ", action.project);
      return state;
    case "CREATE_PROJECT_ERROR":
      console.log("Create project error ", action.err);
      return state;
    case "LOAD_PROJECT":
      console.log("Load project success ", action.project);
      return {...state, projects: [...state.projects, action.project]};
    case "ADD_IMG":
      return { ...state, backImg: action.backImg };
    case "ADD_LED":
      return { ...state, leds: [...state.leds, action.led] };
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
