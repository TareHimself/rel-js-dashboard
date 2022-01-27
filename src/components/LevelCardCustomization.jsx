import '../scss/main.scss';
import { useState, useContext } from 'react';
import { IoColorPaletteSharp } from 'react-icons/io5';
import { AiOutlineLoading } from 'react-icons/ai';
import { MdFileUpload } from 'react-icons/md';
import { CgDropOpacity } from 'react-icons/cg';
import { getCroppedImg, getXpForNextLevel,isFileImage } from '../utils';
import { GlobalAppContext } from '../contexts';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import axios from 'axios';
import { useEffect } from 'react';

const defaultBackgroundUrl = `https://hdwallsource.com/img/2020/8/cool-wallpaper-hd-71336-73788-hd-wallpapers.jpg`;

function LevelCardCustomization() {

  const { sessionId, serverLink, userData, setUserData, setIsCustomizingCard } = useContext(GlobalAppContext);



  const level = 100;
  const currentXp = 200;

  const displayName = userData.username || 'Name';
  const rank = 1;
  const requiredXp = (getXpForNextLevel(level) / 1000).toFixed(2);

  let avatarUrl = '';
  let backgroundImage = defaultBackgroundUrl;

  const [isUploadingResult, setIsUploadingResult] = useState(false);

  const [imageFromFile, setImageFromFile] = useState(undefined);

  const [imageBeingCropped, setImageBeingCropped] = useState(undefined);

  const [croppedImage, setCroppedImage] = useState(undefined);

  const [cropSettings, setCropSettings] = useState({
    unit: '%',
    width: 30,
    aspect: 10 / 3
  });

  const [cardColor, setCardColor] = useState("#87ceeb");

  const [cardOpacity, setCardOpacity] = useState(0.8);

  if (userData) {
    const extension = userData.avatar.startsWith("a_") ? 'gif' : 'png';
    avatarUrl = `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.${extension}`;

    if (croppedImage) {
      backgroundImage = URL.createObjectURL(croppedImage);
    }
    else {
      backgroundImage = userData.card_bg_url || defaultBackgroundUrl;
    }


    if (cardOpacity === 0.8 && userData.card_opacity && userData.card_opacity !== cardOpacity) {
      setCardOpacity(userData.card_opacity);
    }

    if (cardColor === '#87ceeb' && userData.color && userData.color !== cardColor) {
      setCardColor(userData.color);
    }
  }

  function onColorChanged(event) {
    if (event.target && event.target.value) setCardColor(event.target.value);
  }

  function onBackgroundUploaded(event) {
    if (event.target.files && event.target.files.length > 0 && isFileImage(event.target.files[0])) {

      const reader = new FileReader();
      reader.addEventListener('load', () => setImageFromFile(reader.result));
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  function onCropChange(crop, percentCrop) {
    setCropSettings(crop);
  };

  function onCropImageLoaded(image) {
    setCropSettings({
      unit: 'px',
      width: image.width,
      aspect: 10 / 3
    });
    setImageBeingCropped(image);
  };

  function onOpacityUpdated(event) {
    setCardOpacity(event.target.value / 10);
  }

  function onDoneCustomizing(event) {
    const headers = { sessionId: sessionId }

    if (croppedImage) {
      const reader = new FileReader();
      reader.readAsDataURL(croppedImage);
      reader.onloadend = (event) => {

        const payload = {
          color: cardColor,
          card_opacity: cardOpacity,
          background: reader.result.split('base64,')[1]
        };

        setIsUploadingResult(true);

        axios.post(`${serverLink}/update-card`, payload, { headers: headers }).then((response) => {
          

          setIsUploadingResult(false);

          if (response.data.error) {
            console.log(response.data.error);
          }
          else {
            setUserData({ ...userData, card_bg_url: response.data.url, card_opacity: cardOpacity, color: cardColor });
          }

          setCroppedImage(undefined);
          setIsCustomizingCard(false);
        });

      }
    }
    else {
      const payload = {
        color: cardColor,
        card_opacity: cardOpacity,
      };

      setIsUploadingResult(true);

      axios.post(`${serverLink}/update-card`, payload, { headers: headers }).then((response) => {

        setIsUploadingResult(false);

        if (response.data.error) {
          console.log(response.data.error);
        }
        else {
          setUserData({ ...userData, card_bg_url: response.data.url, card_opacity: cardOpacity, color: cardColor });
        }

        setIsCustomizingCard(false);
      });
    }

  }

  async function onDoneCropping() {
    const imageTemp = await getCroppedImg(imageBeingCropped, cropSettings, 'user-background');

    setCropSettings({
      unit: '%',
      width: 30,
      aspect: 10 / 3
    });
    
    console.log(cropSettings);

    setImageBeingCropped(undefined);
    setImageFromFile(undefined);
    setCroppedImage(imageTemp);
  }

  useEffect(() => {

    const root = document.getElementById('root');
    if (root) {
      root.style.height = '100vh';
      root.style.overflow = 'hidden';

      return () => {
        const root = document.getElementById('root');
        if (root) {
          root.style.height = 'auto';
          root.style.overflow = 'auto';
        }
      };
    }
  })

  return (
    <div className='level-card-customization' style={{ '--main-color': cardColor, '--opacity': cardOpacity }}>

      {!imageFromFile &&
        <div className='level-card-customization-content'>

          {isUploadingResult && <div className='level-card-editing-background-upload-loading' >
            <AiOutlineLoading className='loading-icon' />
          </div>}

          <div className='level-card'>

            <img className="level-card-background" src={backgroundImage} alt="background" />

            <div className="level-card-content">

              <div className="user-level-profile">

                <img
                  src={avatarUrl} alt="profile" />

                <div className="online-status"></div>

              </div>
              <div className="user-level-info">
                <div className="user-level-info-row" pos='top'>
                  <h1>{displayName}</h1> <h1>RANK {rank}</h1>
                </div>
                <div className="user-level-info-row" pos='middle'>

                  <h2>Level {level}</h2> <h2>{(currentXp / 1000).toFixed(2)}k/{requiredXp}k</h2>

                </div>
                <div className="user-level-info-row">
                  <div className="user-level-info-bar">
                    <div className="user-level-info-progress"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='level-card-editing-content'>
            <div className='level-card-editing-item'>
              <div className='level-card-editing-item-background' />
              <IoColorPaletteSharp className='level-card-editing-item-icon' />
              <input type="color" onChange={onColorChanged} value={cardColor} />

            </div>

            <div className='level-card-editing-item' >
              <div className='level-card-editing-item-background' />
              <MdFileUpload className='level-card-editing-item-icon' />
              <input type='file' accept='image/png,image/jpeg' onChange={onBackgroundUploaded} />

            </div>

          </div>

          <div className='level-card-customization-content-opacity-slider'>
            <div className='level-card-customization-content-opacity-slider-track' />
            <CgDropOpacity className='level-card-customization-content-opacity-slider-thumb' />
            <input type='range' min='0' max='10' step='0.1' value={cardOpacity * 10} onChange={onOpacityUpdated} />
          </div>

          <button className='level-card-customization-button' onClick={onDoneCustomizing}>Done</button>


        </div>}

      {imageFromFile &&
        <div className='level-card-customization-backround-crop'>

          <div className='level-card-customization-backround-crop-image'>
            <ReactCrop
              style={{
                'maxWidth': '100',
                'maxHeight': '100%'
              }}
              src={imageFromFile}
              crop={cropSettings}
              ruleOfThirds
              onImageLoaded={onCropImageLoaded}
              onChange={onCropChange}
              keepSelection={true}
            />
          </div>

          <button className='level-card-customization-button' onClick={onDoneCropping}>Upload</button>
        </div>
      }


    </div>
  );
}

export default LevelCardCustomization;