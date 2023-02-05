import { ReactCropProps } from "react-image-crop"
import { IVector2 } from "./types"

export class RoutesLookup {
  static Home = "Home"
  static Invite = "Invite"
  static Auth = "Login"
  static Commands = "Commands"
  static Servers = "Servers"
  static Dashboard = "Dashboard"
  static Support = "Support"
  static Privacy = "Privacy Policy"
  static Terms = "Terms Of Service"
  static None = "404"

  static get(location: keyof RoutesLookup) {

    if (!location) return RoutesLookup.Home;

    console.log(location)
    if (!RoutesLookup[location]) return RoutesLookup.None;

    return RoutesLookup[location];
  }
}

export function blobToBase64(blob: Blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

/**
 * @param {} image - Image File Object
 * @param {Object} CropOptions - crop Object
 * @param {String} fileName - Name of the returned file in Promise
 */
export function getCroppedSecion(image: HTMLImageElement, CropOptions: ReactCropProps['crop'], fileName: string, finalSectionSize: IVector2 = { x: 1000, y: 300 }): string | null {
  if (!CropOptions) {
    return null;
  }
  const canvas = document.createElement("canvas");
  const imageScaleX = image.naturalWidth / image.width;
  const imageScaleY = image.naturalHeight / image.height;

  canvas.width = finalSectionSize.x;
  canvas.height = finalSectionSize.y;
  const ctx = canvas.getContext("2d");

  if (!ctx) return null;

  const pixelRatio = window.devicePixelRatio;

  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    image,
    CropOptions.x! * imageScaleX,
    CropOptions.y! * imageScaleY,
    CropOptions.width! * imageScaleX * pixelRatio,
    CropOptions.height! * imageScaleY * pixelRatio,
    0,
    0,
    finalSectionSize.x,
    finalSectionSize.y
  );

  return canvas.toDataURL("image/jpeg", 1);
}

export function getXpForNextLevel(currentLevel: number) {
  return (currentLevel ** 2) * 3 + 100;
}

export function utcInSeconds() {
  return Math.floor(Date.now() / 1000);
}

export function hashString(str: string, seed = 0) {
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

export function isFileImage(file: File) {
  const acceptedImageTypes = ['image/jpeg', 'image/png'];

  return file && acceptedImageTypes.includes(file['type'])
}

export function isEqual(a: any, b: any) {

  if (typeof a !== 'object') return a === b;

  const aKeys = Object.keys(a);

  for (let i = 0; i < aKeys.length; i++) {
    const currentA = a[aKeys[i]];
    const currentB = b[aKeys[i]];

    if (typeof currentA !== typeof currentB) {
      return false;
    }

    if (typeof currentA === 'object' && currentA.toString() !== currentB.toString()) {
      return false;
    }

    if (typeof currentA !== 'object' && currentA !== currentB) {
      return false;
    }

  }
  return true;
}

export class DashboardConstants {
  static IS_DEV = true
  static SERVER_URL = DashboardConstants.IS_DEV ? 'http://localhost:9000' : 'https://server.umeko.dev'
  static CLIENT_ID = DashboardConstants.IS_DEV ? '895104527001354313' : '804165876362117141';
}




