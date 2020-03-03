import React, { Component } from "react";

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
    return (
      <div className="d-flex flex-column justify-content-center align-items-center h-75 my-4">
        <h1>Noise2LED - Paco Croket</h1>
        <span className="w-50 m-2">
          The idea here is to paint the position of your LEDs in ther order and then get an custom output to
          copy into your code. These can be mapped to 2D or 3D noise values.
        </span>
        <span className="w-50 m-2">1 - Upload a picture of your LED project showing all the LEDs.</span>
        <span className="w-50 m-2">
          2 - Following the actual id of your LEDs, mark their position in order with the paint tool. Adjust
          the LED distance and use the line tool to cover large straight areas
        </span>
        <span className="w-50 m-2">
          3 - Grab the LEDs to fine tune their position. Use the erase tool to remove an LED. Notice that the
          id of the LED is kept continuous.
        </span>
        <span className="w-50 m-2">
          4 - Copy the output from the outout area into your code. Set the output scaling to fit your
          microcontroller needs. 255 corresponds to 8-bit values, great for Arduino projects.
        </span>

        <span className="w-50 mt-4">
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

        <pre className="w-50 m-2">
          <code className="text-info">{code}</code>
        </pre>
      </div>
    );
  }
}

export default HomePage;
