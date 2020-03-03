export const addImg = backImg => {
  return (dispatch, getState) => {
    // make async call to DB
    let dummyBackImg = {
      imgUrl: "https://via.placeholder.com/1200x600",
      imgSize: { width: 1200, height: 600 },
      imgPos: { imgX: 0, imgY: 0 }
    };
    dispatch({ type: "ADD_IMG", backImg: dummyBackImg });
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
