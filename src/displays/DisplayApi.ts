export type ColorMap = {
    [key: number]: string;
};

export interface Display {
    name: string;
    width: number;
    height: number;
    resetColor: number;
    colorMap: ColorMap;
    css?:string;
    scrollTop?: number;
}
