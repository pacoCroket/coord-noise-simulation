import Utils from "../../Utils";

const initState = {
  backImg: {
    imgUrl: "https://via.placeholder.com/900x500",
    imgSize: { width: 900, height: 500 },
    imgPos: { imgX: 0, imgY: 0 }
  },
  leds: [
    {
      id: 0,
      x: 0.1,
      y: 0.5
    },
    {
      id: 1,
      x: 0.12,
      y: 0.845
    },
    {
      id: 2,
      x: 0.68453,
      y: 0.1687
    },
    {
      id: 3,
      x: 0.684,
      y: 0.96483
    },
    {
      id: 4,
      x: 0.13,
      y: 1
    },
    {
      id: 5,
      x: 0,
      y: 0.35
    }
  ]
};

const projectReducer = (state = initState, action) => {
  switch (action.type) {
    case "ADD_IMG":
      return { ...state, backImg: action.backImg };
      case "ADD_LED":
          return {...state, leds: [...state.leds, action.led]}
  }
  return state;
};

export default projectReducer;
