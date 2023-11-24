import { Bitmap } from "createjs-module";

export const getBitmap = (img: HTMLImageElement, width: number, height: number): Bitmap =>  {
    const bitmap = new Bitmap(img);
    bitmap.scaleX = width / img.width;
    bitmap.scaleY = height / img.height;

    return bitmap;
};