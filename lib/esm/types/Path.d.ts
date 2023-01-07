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
declare enum Unit {
    Mm = "MILLIMETERS",
    Cm = "CENTIMETERS",
    M = "METERS",
    Px = "PIXELS"
}
export interface PathConfig {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    onUpdate: Function | undefined;
    coordinates: Coordinates | undefined;
    pxPerUnit: number;
    unit: Unit;
    active: boolean;
    lineCap: CanvasLineCap | undefined;
    lineWidth: number;
    color: string;
}
export declare class Path {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    onUpdate: Function | undefined;
    pxPerUnit: number;
    unit: Unit;
    active: boolean;
    lineCap: CanvasLineCap;
    lineWidth: number;
    color: string;
    drawing: boolean;
    aPointXPx: number;
    aPointYPx: number;
    bPointXPx: number;
    bPointYPx: number;
    get coordinates(): Coordinates;
    get unitQuantity(): number;
    constructor(config: PathConfig);
    private _initCtx;
    private _onMouseDown;
    private _onMouseUp;
    private _onMouseMove;
    private _draw;
    private _getMousePosition;
}
export {};
//# sourceMappingURL=Path.d.ts.map