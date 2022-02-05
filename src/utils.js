/**
 * @param {HTMLImageElement} image - Image File Object
 * @param {Object} crop - crop Object
 * @param {String} fileName - Name of the returned file in Promise
 */
export function getCroppedImg(image, crop, fileName, size = { x: 1000, y: 300 }) {

  const canvas = document.createElement("canvas");
  const imageScaleX = image.naturalWidth / image.width;
  const imageScaleY = image.naturalHeight / image.height;

  canvas.width = size.x;
  canvas.height = size.y;
  const ctx = canvas.getContext("2d");

  const pixelRatio = window.devicePixelRatio;

  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    image,
    crop.x * imageScaleX,
    crop.y * imageScaleY,
    crop.width * imageScaleX * pixelRatio,
    crop.height * imageScaleY * pixelRatio,
    0,
    0,
    size.x,
    size.y
  );

  // As a blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        blob.name = fileName;
        resolve(blob);
      },
      "image/jpeg",
      1
    );
  });
}

export function getXpForNextLevel(currentLevel) {
  return (currentLevel ** 2) * 3 + 100;
}

export function utcInSeconds() {
  return Math.floor(Date.now() / 1000);
}

export function hashString(str, seed = 0) {
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909);
  h2 = Math.imul(h2 ^ (h2>>>16), 2246822507) ^ Math.imul(h1 ^ (h1>>>13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1>>>0);
};

export function isFileImage(file) {
  const acceptedImageTypes = ['image/jpeg', 'image/png'];

  return file && acceptedImageTypes.includes(file['type'])
}

export function isEqual(a,b){

  if(typeof a !== 'object' ) return a === b;
  
  const aKeys = Object.keys(a);

  for(let i = 0; i < aKeys.length; i++)
  {
    const currentA = a[aKeys[i]];
    const currentB = b[aKeys[i]];

    if(typeof currentA !== typeof currentB){
      return false;
    } 

    if(typeof currentA === 'object' && currentA.toString() !== currentB.toString()){
      return false;
    } 

    if(typeof currentA !== 'object' && currentA !== currentB){
      return false;
    } 

  }


  return true;
}