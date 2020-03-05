// TODO just import all p5.js library or add create Vector library

class Utils {
  static paintModes = {
    paint: "paint",
    line: "line",
    erase: "erase"
  };

  /**
   * Re-maps a number from one range to another.
   * <br><br>
   * In the first example above, the number 25 is converted from a value in the
   * range of 0 to 100 into a value that ranges from the left edge of the
   * window (0) to the right edge (width).
   *
   * @method map
   * @param  {Number} value  the incoming value to be converted
   * @param  {Number} start1 lower bound of the value's current range
   * @param  {Number} stop1  upper bound of the value's current range
   * @param  {Number} start2 lower bound of the value's target range
   * @param  {Number} stop2  upper bound of the value's target range
   * @param  {Boolean} [withinBounds] constrain the value to the newly mapped range
   * @return {Number}        remapped number
   **/
  static map = function(n, start1, stop1, start2, stop2, withinBounds) {
    const newval = ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
    if (!withinBounds) {
      return newval;
    }
    if (start2 < stop2) {
      return this.constrain(newval, start2, stop2);
    } else {
      return this.constrain(newval, stop2, start2);
    }
  };

  /**
   * Constrains a value between a minimum and maximum value.
   *
   * @method constrain
   * @param  {Number} n    number to constrain
   * @param  {Number} low  minimum limit
   * @param  {Number} high maximum limit
   * @return {Number}      constrained number
   **/
  static constrain = function(n, low, high) {
    return Math.max(Math.min(n, high), low);
  };

  static getUrlFromObject = obj => {
    for (var key in obj) {
      console.log(key + ": " + obj[key]);
      if (typeof obj[key] == "string" && obj[key].match(/^http/g)) return obj[key];
    }
    return null;
  };

  static PrettyPrintJsonConsole(json) {
    if (typeof json != "string") {
      json = JSON.stringify(json, undefined, "\t");
    }

    var arr = [],
      _string = "color:green",
      _number = "color:darkorange",
      _boolean = "color:blue",
      _null = "color:magenta",
      _key = "color:red";

    json = json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      function(match) {
        var style = _number;
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            style = _key;
          } else {
            style = _string;
          }
        } else if (/true|false/.test(match)) {
          style = _boolean;
        } else if (/null/.test(match)) {
          style = _null;
        }
        arr.push(style);
        arr.push("");
        return "%c" + match + "%c";
      }
    );

    arr.unshift(json);

    console.log.apply(console, arr);
  }
}

export default Utils;
