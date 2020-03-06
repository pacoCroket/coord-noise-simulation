import React, { Component } from "react";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import moment from "moment";

const code = `#include <FastLED.h>
const PROGMEM uint8_t ledsArray[NUM_LEDS][2] = {{220, 68}, {228, 73}, {235, 77}, {243, 81}};
CRGB leds[NUM_LEDS];

void setup()
{
    LEDS.addLeds<LED_TYPE, LED_PIN, COLOR_ORDER>(leds, NUM_LEDS);
    // Initialize our coordinates to some random values
    x = random8();
    y = random8();
    z = random8();
}

for (uint8_t i = 0; i < NUM_LEDS; i++)
{
    uint16_t xoffset = pgm_read_byte(&(ledsArray[i][0])) * scale;
    uint16_t yoffset = pgm_read_byte(&(ledsArray[i][1])) * scale;

    uint8_t index = inoise8(x + xoffset, y + yoffset, z);
    uint8_t bri = inoise8(x + yoffset, y + xoffset, z); // another random point for brightness

    CRGB color = ColorFromPalette(currentPalette, index, bri);
    leds1[i] = color;

    z += speed;
    x -= speed;
}
`;

class HomePage extends Component {
  render() {
    const { auth, notifications } = this.props;

    return (
      <>
        <div className="homepage mw-100 mx-0 mt-5 d-flex flex-column justify-content-center align-items-center">
          {/* <div className="col d-flex flex-column justify-content-center align-items-center"> */}
          <h1>Noise2LED - by Paco Croket</h1>
          <span className="w-75 m-2">
            The idea here is to paint the position of your LEDs in ther order and then get an custom output to
            copy into your code. These can be mapped to 2D or 3D noise values.
          </span>
          <span className="w-75 m-2">1 - Upload a picture of your LED project showing all the LEDs.</span>
          <span className="w-75 m-2">
            2 - Following the actual id of your LEDs, mark their position in order with the paint tool. Adjust
            the LED distance and use the line tool to cover large straight areas
          </span>
          <span className="w-75 m-2">
            3 - Grab the LEDs to fine tune their position. Use the erase tool to remove an LED. Notice that
            the id of the LED is kept continuous.
          </span>
          <span className="w-75 m-2">
            4 - Copy the output from the outout area into your code. Set the output scaling to fit your
            microcontroller needs. 255 corresponds to 8-bit values, great for Arduino projects.
          </span>

          <span className="w-75 my-4">
            Here is an example of how you could implement the noise feature with C++. More details in{" "}
            <a
              href="https://github.com/pacoCroket/arduino-neopixel/blob/master/mandala1/mandala1.ino"
              target="_blank"
              rel="noopener noreferrer"
            >
              this full project
            </a>
            .
          </span>

          <pre className="m-2 p-3 border border-info">
            <code className="text-info">{code}</code>
          </pre>
        </div>

        {/* <div className="col-2 d-flex flex-column"> */}
        <ul className="notification-area mb-auto mt-5">
          <p className="h4 text-dark px-3">Latest Activity</p>
          {notifications &&
            notifications.map(item => {
              return (
                <li key={item.id} className="notification text-light">
                  <div>
                    <span className="text-capitalize text-info">{item.user} </span>
                    <span className="text-lowercase">{item.content}</span>
                  </div>
                  <div className="font-weight-light text-muted">{moment(item.time.toDate()).fromNow()}</div>
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
