import React, { Component } from "react";

export default class EditTools extends Component {
  render() {
    return (
    <div className="editTools">
        <input type="file" className="myButton" id="uploadImg" name="imgFile"></input>
    </div>
    );
  }
}
