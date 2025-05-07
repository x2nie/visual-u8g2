export type ColorMap = {
    [key: number]: string;
};

export interface Display {
    name: string;
    width: number;  // actual pixel available
    height: number;
    screenRatio?: [ // visual stretech
        number, // horizontal
        number  // vertical
    ]
    resetColor: number;
    colorMap: ColorMap;
    css?:string;
    scrollTop?: number;
}
