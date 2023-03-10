import { getDistanceBetweenTwoPoints } from "./helpers";
export class Path {
    container;
    canvas;
    ctx;
    onUpdate;
    active;
    lineCap = "round";
    lineWidth = 10;
    color = "red";
    drawing = false;
    aPointXPx = 0;
    aPointYPx = 0;
    bPointXPx = 0;
    bPointYPx = 0;
    get coordinates() {
        return {
            a: {
                x: this.aPointXPx / this.canvas.width,
                y: this.aPointYPx / this.canvas.height,
            },
            b: {
                x: this.bPointXPx / this.canvas.width,
                y: this.bPointYPx / this.canvas.height,
            },
        };
    }
    get length() {
        return getDistanceBetweenTwoPoints(this.aPointXPx, this.aPointYPx, this.bPointXPx, this.bPointYPx);
    }
    constructor(config) {
        this.container = config.container;
        this.active = config.active;
        this.onUpdate = config.onUpdate;
        if (config.lineCap !== undefined)
            this.lineCap = config.lineCap;
        if (config.lineWidth !== undefined)
            this.lineWidth = config.lineWidth;
        if (config.color !== undefined)
            this.color = config.color;
        // create the 2d context
        this.canvas = this._initCanvas(config.container);
        this.ctx = this._initCtx(this.canvas, config.coordinates);
        // hookup the event listeners
        this._onMouseDown = this._onMouseDown.bind(this);
        this._onMouseUp = this._onMouseUp.bind(this);
        this._onMouseMove = this._onMouseMove.bind(this);
        this.container.addEventListener("mousedown", this._onMouseDown);
        this.container.addEventListener("mouseup", this._onMouseUp);
        this.container.addEventListener("mousemove", this._onMouseMove);
    }
    destroy() {
        this.container.removeChild(this.canvas);
        this.container.removeEventListener("mousedown", this._onMouseDown);
        this.container.removeEventListener("mouseup", this._onMouseUp);
        this.container.removeEventListener("mousemove", this._onMouseMove);
    }
    _initCanvas(container) {
        const canvas = document.createElement("canvas");
        canvas.style.position = "absolute";
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
        container.appendChild(canvas);
        return canvas;
    }
    _initCtx(canvas, coordinates) {
        const ctx = canvas.getContext("2d");
        if (ctx === null)
            throw new Error("Failed to get 2d context on provided canvas");
        ctx.lineWidth = this.lineWidth;
        ctx.lineCap = this.lineCap;
        ctx.strokeStyle = this.color;
        if (coordinates !== undefined) {
            // convert the percentages to px
            this.aPointXPx = coordinates.a.x * this.canvas.width;
            this.aPointYPx = coordinates.a.y * this.canvas.height;
            this.bPointXPx = coordinates.b.x * this.canvas.width;
            this.bPointYPx = coordinates.b.y * this.canvas.height;
            ctx.beginPath();
            // the initial position of the cursor is the start point
            ctx.moveTo(this.aPointXPx, this.aPointYPx);
            // draw the line using our current cursor position
            ctx.lineTo(this.bPointXPx, this.bPointYPx);
            ctx.stroke();
        }
        return ctx;
    }
    _onMouseDown(e) {
        if (!this.active)
            return;
        this.drawing = true;
        // set the starting point of the new path
        const { x, y } = this._getMousePosition(e);
        this.aPointXPx = x;
        this.aPointYPx = y;
        this._draw(e);
    }
    _onMouseUp(_e) {
        if (!this.active)
            return;
        this.drawing = false;
        if (this.onUpdate !== undefined)
            this.onUpdate(this.coordinates, this.length);
    }
    _onMouseMove(e) {
        if (!this.active || !this.drawing)
            return;
        this._draw(e);
    }
    _draw(e) {
        // TODO make this work
        // const shouldSnap = e.shiftKey;
        // set the end point of the path
        const { x, y } = this._getMousePosition(e);
        this.bPointXPx = x;
        this.bPointYPx = y;
        // we are redrawing the path each mouse movement - clear our 2d context entirely
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.beginPath();
        // the initial position of the cursor is the start point
        this.ctx.moveTo(this.aPointXPx, this.aPointYPx);
        // draw the line using our current cursor position
        this.ctx.lineTo(this.bPointXPx, this.bPointYPx);
        this.ctx.stroke();
    }
    _getMousePosition(e) {
        return {
            x: e.clientX - this.canvas.offsetLeft,
            y: e.clientY - this.canvas.offsetTop,
        };
    }
}
