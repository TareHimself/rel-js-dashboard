  /**
   * @param {HTMLImageElement} image - Image File Object
   * @param {Object} crop - crop Object
   * @param {String} fileName - Name of the returned file in Promise
   */
  export function getCroppedImg(image, crop, fileName,size = { x : 1000, y : 300}) {

    const canvas = document.createElement("canvas");
    const imageScaleX = image.naturalWidth / image.width;
    const imageScaleY = image.naturalHeight / image.height;

    canvas.width = size.x;
    canvas.height = size.y;
    const ctx = canvas.getContext("2d");

    // New lines to be added
    const pixelRatio = window.devicePixelRatio;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    console.log(crop.width * imageScaleX,crop.height * imageScaleY)
    ctx.drawImage(
      image,
      crop.x * imageScaleX,
      crop.y * imageScaleY,
      crop.width * imageScaleX * 2,//Multiplying by 2 not fully understood yet
      crop.height * imageScaleY * 2,//Multiplying by 2 not fully understood yet
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