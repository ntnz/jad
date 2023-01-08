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
export declare class Path {
    container: HTMLElement;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    onUpdate: Function | undefined;
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
    get length(): number;
    constructor(config: PathConfig);
    destroy(): void;
    private _initCanvas;
    private _initCtx;
    private _onMouseDown;
    private _onMouseUp;
    private _onMouseMove;
    private _draw;
    private _getMousePosition;
}
//# sourceMappingURL=Path.d.ts.map