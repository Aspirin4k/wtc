import { Bitmap, Rectangle } from "createjs-module";
import { AtlasImage } from "./AtlasImage";

export const getBitmap = (img: HTMLImageElement | AtlasImage, width: number, height: number): Bitmap => {
    let bitmap: Bitmap;
    if (img instanceof HTMLImageElement) {
        bitmap = new Bitmap(img);

        bitmap.scaleX = width / img.width;
        bitmap.scaleY = height / img.height;
    } else {
        bitmap = new Bitmap(img.atlas);

        const frame = img.frame.frame;
        bitmap.sourceRect = new Rectangle(frame.x, frame.y, frame.w, frame.h);
        
        bitmap.scaleX = width / img.frame.frame.w;
        bitmap.scaleY = height / img.frame.frame.h;

        img = img.atlas;
    }


    return bitmap;
};