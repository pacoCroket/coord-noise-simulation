class Pixel {
    constructor(pos_, id_) {
        this.pos = pos_;
        this.color = [0, 0, 1];
        this.id = id_;
    }

    setColor(color_) {
        this.color = color_;
    }

    show() {
        stroke(0);
        fill(this.color);
        ellipse(this.pos.x, this.pos.y, pixelSize, pixelSize);
        fill(0);
        noStroke();
        text(this.id, this.pos.x, this.pos.y);
    }
}