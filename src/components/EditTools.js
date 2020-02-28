import React, { Component } from "react";
import Dropzone from "./Dropzone";
import App from "../App";

import { makeStyles } from "@material-ui/core/styles";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

const useStyles = makeStyles(theme => ({
  toggleContainer: {
    margin: theme.spacing(2, 0)
  }
}));

const [alignment, setAlignment] = React.useState("left");
const [formats, setFormats] = React.useState(() => ["bold"]);

export default class EditTools extends Component {

  handleFormat = (event, newFormats) => {
    setFormats(newFormats);
  };

  handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  classes = useStyles();

  getStyle = isActive => {
    console.log(isActive);
    return {
      background: isActive ? "rgb(239, 255, 220)" : "none"
    };
  };

  render() {
    const {
      tooling: { paintMode },
      paintModeChanged
    } = this.props;
    console.log(paintMode);

    return (
      <div className="editTools d-flex flex-column">
        {/* <input type="file" className="myButton" id="uploadImg" name="imgFile"></input> */}
        <div className="Card">
          <Dropzone onImgAdded={this.props.onImgAdded} />
        </div>

        {/* Painting single selector btn group */}
        <div className={this.classes.toggleContainer}>
          <ToggleButtonGroup value={this.alignment} exclusive onChange={this.handleAlignment} aria-label="text alignment">
            <ToggleButton value="left" aria-label="left aligned">
              
          <i className="fas fa-paint-brush"></i>
            </ToggleButton>
            <ToggleButton value="center" aria-label="centered">
             
          <i className="fas fa-paint-brush"></i>
            </ToggleButton>
            <ToggleButton value="right" aria-label="right aligned">
              
          <i className="fas fa-paint-brush"></i>
            </ToggleButton>
            <ToggleButton value="justify" aria-label="justified" disabled>
              
          <i className="fas fa-paint-brush"></i>
            </ToggleButton>
          </ToggleButtonGroup>
        </div>

        <button
          className="btn button"
          id="isPaiting"
          onClick={paintModeChanged.bind(this, App.paintModes.paint)}
          style={this.getStyle(paintMode === App.paintModes.paint)}
        >
          <i className="fas fa-paint-brush"></i>
        </button>
        <button
          className="btn button"
          id="isErase"
          onClick={paintModeChanged.bind(this, App.paintModes.erase)}
          style={this.getStyle(paintMode === App.paintModes.erase)}
        >
          <i className="fas fa-eraser"></i>
        </button>
      </div>
    );
  }
}
