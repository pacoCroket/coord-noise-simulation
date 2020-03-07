import React, { Component } from "react";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import moment from "moment";

const code = `#include <FastLED.h> // This library is doing all the work, actually!

// The next line is the array containing the resulting coordinates
// It has an efficient uint8_t type and is stored in flash
const PROGMEM uint8_t ledsArray[NUM_LEDS][2] = {{220, 68}, {228, 73}, {235, 77}, {243, 81}}; // << COPY HERE !!
CRGB leds[NUM_LEDS];

void setup()
{
    LEDS.addLeds<LED_TYPE, LED_PIN, COLOR_ORDER>(leds, NUM_LEDS);
    x = random8();
    y = random8();
    z = random8();
}

for (uint8_t i = 0; i < NUM_LEDS; i++)
{
    // Here we retrieve the coordinates form flash and scale them
    uint16_t xoffset = pgm_read_byte(&(ledsArray[i][0])) * scale;
    uint16_t yoffset = pgm_read_byte(&(ledsArray[i][1])) * scale;

    // Here we translate the coordinates into smooth, organic values
    uint8_t index = inoise8(x + xoffset, y + yoffset, z);
    uint8_t bri = inoise8(x + yoffset, y + xoffset, z);

    // Here we map the noise-generated index and brightness to a color from a palette
    CRGB color = ColorFromPalette(currentPalette, index, bri);
    leds1[i] = color;

    z += speed;
    x -= speed;
}
`;

class HomePage extends Component {
    render() {
        const { notifications } = this.props;

        return (
            <>
                <div className="homepage mx-0 mt-5 d-flex flex-column justify-content-center align-items-center">
                    {/* <div className="col d-flex flex-column justify-content-center align-items-center"> */}
                    <h1>Noise2LED - by Paco Croket</h1>
                    <label>
                        The motivation of this project originates on an issue that I had to solve for my own
                        Arduino LED projects. The Perlin Noise algorithm makes amusing visual effects by
                        relating the real position of the LEDs in space with their id (i.e. their position in
                        the stripe/line). LEDs by themselves have no idea where they stand, so it gets very
                        tricky to estimate their actual position if the project is not a regular matrix of
                        LEDs. My projects involve unsual shapes, like 3D clouds or some sort of geometries
                        like mandalas. The solution, provided by this online tool, is to associate the LED's
                        real position with their id by taking a picture of your project, "painting" the LEDs
                        over it, and copying the optimized output coordinates into the Arduino code. Here are
                        some step by step instructions:
                    </label>
                    <label>
                        1 - Upload a picture of your LED project showing all the LEDs - do it from your
                        smartphone and then switch to the PC for the next steps!.
                    </label>
                    <label>
                        2 - Following the actual id of your LEDs (e.i. their order), progessively mark their
                        position with the paint tool. Adjust the LED distance and use the line tool to cover
                        large straight areas
                    </label>
                    <label>
                        3 - Grab the LEDs to fine tune their position. Use the erase tool to remove an LED.
                        Notice that the id of the LEDs is automatically kept continuous.
                    </label>
                    <label>
                        4 - Copy the resulting coordinates from the output area into the place in your Arduino
                        code, where an array defines the coordinates of the LEDs. Notice that we don't need to
                        explicitly associate the id to the coordinaes, since that is essentially their position
                        within the array. Set the output scaling to fit your microcontroller needs. A value of
                        255 corresponds to 8-bit values, sufficient and effective for Arduino projects.
                    </label>

                    <label>
                        Here is an example of how you could implement the noise feature in an Arduino project with C++ and the                         <a
                            href="http://fastled.io/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            FastLED library
                        </a> for Arduino. More details
                        in{" "}
                        <a
                            href="https://github.com/pacoCroket/arduino-neopixel/blob/master/mandala1/mandala1.ino"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            this full project
                        </a>
                        .
                    </label>

                    <pre className="m-2 p-3 border border-info">
                        <code className="text-info">{code}</code>
                    </pre>
                </div>

                {/* <div className="col-2 d-flex flex-column"> */}
                <ul className="notification-area mb-auto">
                    <p className="h4 text-dark px-3">Latest Activity</p>
                    {notifications &&
                        notifications.map(item => {
                            return (
                                <li key={item.id} className="notification text-light">
                                    <div>
                                        <span className="text-capitalize text-info">{item.user} </span>
                                        <span className="text-lowercase">{item.content}</span>
                                    </div>
                                    <div className="font-weight-light text-muted">
                                        {moment(item.time.toDate()).fromNow()}
                                    </div>
                                </li>
                            );
                        })}
                </ul>
                {/* </div> */}
            </>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const { notifications } = state.firestore.ordered;
    return {
        notifications,
        auth: state.firebase.auth
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([{ collection: "notifications", limit: 5, orderBy: ["time", "desc"] }])
)(HomePage);
