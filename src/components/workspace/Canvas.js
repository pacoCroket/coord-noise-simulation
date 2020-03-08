import React, { Component } from "react";
import Draggable from "./Draggable";
import Image from "react-bootstrap/Image";
import Utils from "../../Utils";
import { isEmpty } from "underscore";

class Canvas extends Component {
    constructor() {
        super();
        this.state = {
            isDragging: false,
            isDraggingLed: false,
            tempLeds: [],
            imgPos: { imgX: 0, imgY: 0 },
            dragArea: { top: 0, left: 0, width: 0, height: 0 },
            dragStart: { top: 0, left: 0 }
        };
    }

    componentDidUpdate = prevProps => {
        if (prevProps.paintMode !== this.props.paintMode) {
            this.resetDragArea();
        }
    };

    componentDidMount() {
        window.addEventListener("resize", this.updateImageDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateImageDimensions);
        window.removeEventListener("mousemove", this.handleMouseMove);
        window.removeEventListener("mouseup", this.handleMouseUp);
        window.removeEventListener("touchmove", this.handleTouchMove);
        window.removeEventListener("touchend", this.handleTouchEnd);
    }

    // Update image dimensions when resizing window
    updateImageDimensions = () => {
        const canvas = document.getElementById("canvas");

        const imgPos = {
            imgX: canvas.getBoundingClientRect().left,
            imgY: canvas.getBoundingClientRect().top
        };
        this.props.updateImageDimensions();
        this.setState({ imgPos });
    };

    getRelativePos = (xPos, yPos) => {
        const { imgX, imgY } = this.state.imgPos;
        const xRelative = xPos - imgX;
        const yRelative = yPos - imgY;
        return { xRelative, yRelative };
    };

    getRelativeFractionPos = (xPos, yPos) => {
        const { xRelative, yRelative } = this.getRelativePos(xPos, yPos);
        // scale x and y to be fractions of the image
        const { width, height } = this.props.imgSize;
        const xFraction = xRelative / width;
        const yFraction = yRelative / height;
        return { xFraction, yFraction };
    };

    resetDragArea = () => {
        this.setState({ dragArea: { left: 0, top: 0, width: 0, height: 0 } });
    };

    setLed = led => {
        // TODO this led could be already relative to the canvas, not window
        const { xFraction, yFraction } = this.getRelativeFractionPos(led.x, led.y);
        this.props.setLed(xFraction, yFraction);
    };

    handleTouchStart = evt => {
        window.addEventListener("touchmove", this.handleTouchMove);
        window.addEventListener("touchend", this.handleTouchEnd);
        evt.preventDefault();
        const touch = evt.changedTouches[0];
        const { pageX, pageY } = touch;
        this.handleStartOrDown(pageX, pageY);
    };

    handleMouseDown = ({ clientX, clientY }) => {
        window.addEventListener("mousemove", this.handleMouseMove);
        window.addEventListener("mouseup", this.handleMouseUp);

        this.handleStartOrDown(clientX, clientY);
    };

    handleStartOrDown = (xPos, yPos) => {
        if (isEmpty(this.props.imgURL) || this.state.isDraggingLed) return;
        const { paintMode } = this.props;
        // reset dragArea
        this.resetDragArea();

        if (paintMode === Utils.paintModes.paint || paintMode === Utils.paintModes.line) {
            const { xFraction, yFraction } = this.getRelativeFractionPos(xPos, yPos);
            this.setState({
                tempLeds: [{ id: this.props.leds.length, x: xFraction, y: yFraction }]
            });
            return;
        }

        const { xRelative, yRelative } = this.getRelativePos(xPos, yPos);
        this.setState({ dragStart: { left: xRelative, top: yRelative } });
    };

    handleMouseMove = ({ clientX, clientY }) => {
        this.handleMove(clientX, clientY);
    };

    handleTouchMove = evt => {
        evt.preventDefault();
        const touch = evt.changedTouches[0];
        const { pageX, pageY } = touch;
        this.handleMove(pageX, pageY);
    };

    handleMove = (xPos, yPos) => {
        if (isEmpty(this.props.imgURL) || this.state.isDraggingLed) return;
        const { paintMode } = this.props;
        this.setState({ isDragging: true });

        if (
            (paintMode === Utils.paintModes.line || paintMode === Utils.paintModes.paint) &&
            this.state.tempLeds[0]
        ) {
            let { xFraction, yFraction } = this.getRelativeFractionPos(xPos, yPos);
            const { width, height } = this.props.imgSize;

            // append new Leds to tempLeds and update their pos
            if (paintMode === Utils.paintModes.line) {
                // scale fractional coordinates back to 'regular' coordinates
                const dX = (xFraction - this.state.tempLeds[0].x) * width;
                const dY = (yFraction - this.state.tempLeds[0].y) * height;
                const dist = Math.sqrt(dX * dX + dY * dY);
                const fittingCount = dist / this.props.ledSize;
                let tempLeds = [];

                // fit LEDs between original mouseDown and current mouse position
                for (var j = 0; j < fittingCount; j++) {
                    // scale back down to fractional coordinates
                    let fract = (j * this.props.ledSize) / dist;
                    let newX = (this.state.tempLeds[0].x * width + dX * fract) / width;
                    let newY = (this.state.tempLeds[0].y * height + dY * fract) / height;
                    // skip if out of canvas
                    if (newX < 0 || newX > 1 || newY < 0 || newY > 1) continue;

                    tempLeds.push({ id: this.props.leds.length + j, x: newX, y: newY });
                }
                // add the calculated leds to state
                this.setState({ tempLeds });
            } else if (paintMode === Utils.paintModes.paint) {
                // constrain to canvas
                xFraction = Utils.constrain(xFraction, 0, 1);
                yFraction = Utils.constrain(yFraction, 0, 1);
                const tempLeds = [{ id: this.props.leds.length, x: xFraction, y: yFraction }];
                this.setState({ tempLeds });
            }
        } else if (paintMode === Utils.paintModes.grab || paintMode === Utils.paintModes.erase) {
            const { xRelative, yRelative } = this.getRelativePos(xPos, yPos);
            let left = this.state.dragStart.left;
            let top = this.state.dragStart.top;
            let width = xRelative - left;
            let height = yRelative - top;

            // consider negative width or height
            if (width < 0) {
                left += width;
                width = Math.abs(width);
            }
            if (height < 0) {
                top += height;
                height = Math.abs(height);
            }
            this.setState({ dragArea: { left, top, width, height } });
        }
    };

    handleMouseUp = () => {
        window.removeEventListener("mousemove", this.handleMouseMove);
        window.removeEventListener("mouseup", this.handleMouseUp);
        this.handleUpOrEnd();
    };

    handleTouchEnd = evt => {
        window.removeEventListener("touchmove", this.handleTouchMove);
        window.removeEventListener("touchend", this.handleTouchEnd);
        evt.preventDefault();
        this.handleUpOrEnd();
    };

    handleUpOrEnd = () => {
        if (isEmpty(this.props.imgURL) || this.state.isDraggingLed) return;
        const { paintMode, leds } = this.props;

        if (paintMode === Utils.paintModes.paint && this.state.tempLeds[0]) {
            // const led = { id: this.props.leds.length, x: this.state.tempLeds[0].x, y: this.state.tempLeds[0].y };
            this.props.addLed(this.state.tempLeds[0]);
        } else if (paintMode === Utils.paintModes.line) {
            // add all of tempLeds
            this.state.tempLeds.forEach(led => {
                this.props.addLed(led);
            });
        } else if (paintMode === Utils.paintModes.erase) {
            // Erase all selected LEDs/Draggables
            // leds.forEach(led)
        }

        // remove tempLeds
        this.setState({ isDragging: false, tempLeds: [] });
        // this.resetDragArea();
    };

    onDragStart = () => {
        this.setState({ isDraggingLed: true });
        // also update it within this render loop REACT COMPLAINS
        this.state.isDraggingLed = true;
    };

    // unused
    onDrag = led => {
        // this.setState({ tempLeds: [led] });
    };

    // unelegant way of letting 'isDragging' stick for a bit longer with timeout
    onDragEnd = () => setTimeout(() => this.setState({ isDraggingLed: false }), 200);

    render() {
        const { paintMode, ledSize, imgSize, imgURL, leds, setLed, clickedLed } = this.props;

        const { dragArea, isDragging, isDraggingLed, tempLeds } = this.state;

        let dragAreaElement = null;
        if (isDragging && !isDraggingLed) {
            if (paintMode === Utils.paintModes.grab || paintMode === Utils.paintModes.erase) {
                dragAreaElement = SelectArea({ dragArea, paintMode });
            }
        }

        return (
            <div
                className="paintArea noSel"
                onMouseDown={this.handleMouseDown}
                onTouchStart={this.handleTouchStart}
                id="paintArea"
            >
                {/* TODO fit img to screen for all cases */}
                <div className="d-flex canvas">
                    <div id="canvas">
                        <Image
                            src={imgURL}
                            className="img-fluid backImg"
                            // style={this.setImgStyle()}
                            onLoad={this.updateImageDimensions}
                            onLoadedData={this.updateImageDimensions}
                            alt="reference for leds"
                            fluid={true}
                        ></Image>
                    </div>

                    {/* Show current LEDs */}
                    {leds.map(led => (
                        <Draggable
                            className=""
                            key={led.id}
                            isTemp={false}
                            paintMode={paintMode}
                            isDragging={isDragging}
                            led={led}
                            imgSize={imgSize}
                            ledSize={ledSize}
                            clickedLed={clickedLed}
                            setLed={setLed}
                            dragArea={dragArea}
                            onDragStart={this.onDragStart}
                            onDrag={this.onDrag}
                            onDragEnd={this.onDragEnd}
                        ></Draggable>
                    ))}

                    {/* Show tempLeds */}
                    {tempLeds.map(led => (
                        <Draggable
                            className=""
                            key={led.id}
                            isTemp={true}
                            paintMode={paintMode}
                            isDragging={isDragging}
                            led={led}
                            imgSize={imgSize}
                            ledSize={ledSize}
                            clickedLed={clickedLed}
                            setLed={setLed}
                            dragArea={dragArea}
                            onDragStart={this.onDragStart}
                            onDrag={this.onDrag}
                            onDragEnd={this.onDragEnd}
                        ></Draggable>
                    ))}
                    {dragAreaElement}
                </div>
            </div>
        );
    }
}

export default Canvas;

function Stripe(props) {
    return <div></div>;
}

function SelectArea(props) {
    const { left, top, width, height } = props.dragArea;
    const { paintMode } = props;
    return (
        <div
            className="selectArea"
            style={{
                transform: `translate(${left}px, ${top}px)`,
                width,
                height,
                ...(paintMode == Utils.paintModes.erase && {
                    backgroundColor: "rgba(229, 160, 200, 0.233)",
                    borderColor: "red"
                })
            }}
        ></div>
    );
}
