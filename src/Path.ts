import { getDistanceBetweenTwoPoints } from "./helpers";

export interface Coordinates {
  a: {
    x: number;
    y: number;
  };
  b: {
    x: number;
    y: number;
  };
}

export interface PathConfig {
  container: HTMLElement;
  ctx: CanvasRenderingContext2D;
  active: boolean;
  lineWidth: number;
  color: string;
  onUpdate: Function | undefined;
  coordinates: Coordinates | undefined;
  lineCap: CanvasLineCap | undefined;
}

export class Path {
  container: HTMLElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  onUpdate: Function | undefined;
  active: boolean;
  lineCap: CanvasLineCap = "round";
  lineWidth = 10;
  color = "red";

  drawing = false;

  aPointXPx = 0;
  aPointYPx = 0;
  bPointXPx = 0;
  bPointYPx = 0;

  get coordinates(): Coordinates {
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

  get length(): number {
    return getDistanceBetweenTwoPoints(
      this.aPointXPx,
      this.aPointYPx,
      this.bPointXPx,
      this.bPointYPx
    );
  }

  constructor(config: PathConfig) {
    this.container = config.container;
    this.active = config.active;
    this.onUpdate = config.onUpdate;

    if (config.lineCap !== undefined) this.lineCap = config.lineCap;
    if (config.lineWidth !== undefined) this.lineWidth = config.lineWidth;
    if (config.color !== undefined) this.color = config.color;

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

  destroy(): void {
    this.container.removeChild(this.canvas);
    this.container.removeEventListener("mousedown", this._onMouseDown);
    this.container.removeEventListener("mouseup", this._onMouseUp);
    this.container.removeEventListener("mousemove", this._onMouseMove);
  }

  private _initCanvas(container: HTMLElement): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    container.appendChild(canvas);

    return canvas;
  }

  private _initCtx(
    canvas: HTMLCanvasElement,
    coordinates: Coordinates | undefined
  ): CanvasRenderingContext2D {
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

  private _onMouseDown(e: MouseEvent): void {
    if (!this.active) return;

    this.drawing = true;
    // set the starting point of the new path
    const { x, y } = this._getMousePosition(e);
    this.aPointXPx = x;
    this.aPointYPx = y;
    this._draw(e);
  }

  private _onMouseUp(_e: MouseEvent): void {
    if (!this.active) return;

    this.drawing = false;

    if (this.onUpdate !== undefined)
      this.onUpdate(this.coordinates, this.length);
  }

  private _onMouseMove(e: MouseEvent): void {
    if (!this.active || !this.drawing) return;

    this._draw(e);
  }

  private _draw(e: MouseEvent): void {
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

  private _getMousePosition(e: MouseEvent): { x: number; y: number } {
    return {
      x: e.clientX - this.canvas.offsetLeft,
      y: e.clientY - this.canvas.offsetTop,
    };
  }
}
