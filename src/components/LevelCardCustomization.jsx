import '../scss/main.scss';
import { useState, useContext } from 'react';
import { IoColorPaletteSharp } from 'react-icons/io5';
import { AiOutlineLoading } from 'react-icons/ai';
import { MdFileUpload } from 'react-icons/md';
import { getCroppedImg } from '../utils';
import { GlobalAppContext } from '../contexts';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import axios from 'axios';

const defaultBackgroundUrl = `https://hdwallsource.com/img/2020/8/cool-wallpaper-hd-71336-73788-hd-wallpapers.jpg`;

function LevelCardCustomization() {

  const { sessionId, serverLink, userData,setUserData } = useContext(GlobalAppContext);

  function getXpForNextLevel(currentLevel) {
    return (currentLevel ** 2) * 3 + 100;
  }

  const level = 30;
  const currentXp = 200;

  

  const displayName = userData? userData.username : 'Name';
  const rank = 1;
  const requiredXp = (getXpForNextLevel(level) / 1000).toFixed(2);

  const [cardColor, setCardColor] = useState("#87ceeb");

  let avatarUrl = '';
  let backgroundImage = defaultBackgroundUrl;

  if (userData) {
    const extension = userData.avatar.startsWith("a_") ? 'gif' : 'png';
    avatarUrl = `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.${extension}`;
    backgroundImage = userData.card_bg_url;
  }

  const [isUploadingResult, setIsUploadingResult] = useState(false);

  const [imageFromFile, setImageFromFile] = useState(undefined);

  const [imageBeingCropped, setImageBeingCropped] = useState(undefined);

  const [cropSettings, setCropSettings] = useState({
    unit: '%',
    width: 30,
    aspect: 10 / 3
  });


  function onColorChanged(event) {
    if (event.target && event.target.value) setCardColor(event.target.value);
  }

  function onBackgroundUploaded(event) {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setImageFromFile(reader.result));
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  function onCropChange(crop, percentCrop) {
    setCropSettings(crop);
  };

  function onImageCropped(image) {
    setImageBeingCropped(image);
  };

  async function onDoneCropping() {
    const croppedImage = await getCroppedImg(imageBeingCropped, cropSettings, 'user-background');

    const headers = { sessionId: sessionId }

    const reader = new FileReader();
    reader.readAsDataURL(croppedImage);
    reader.onloadend = (event) => {
      setIsUploadingResult(true);
      axios.post(`${serverLink}/update-card`, { card: reader.result.split('base64,')[1] }, { headers: headers }).then((response) => {
        if (response.data.error) {
          console.log(response.data.error);
          setIsUploadingResult(false);
        }
        else {
          
          setImageBeingCropped(undefined);
          setImageFromFile(undefined);
          setCropSettings({
            unit: '%',
            width: 30,
            aspect: 10 / 3
          });
          setIsUploadingResult(false);
          setUserData({...userData,card_bg_url : response.data.url})
        }
      });

    }
  }

  return (
    <div className='level-card-customization' style={{ '--scale': 0.5, '--main-color': cardColor }}>

      {!imageFromFile &&
        <div className='level-card-customization-content'>
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

                  <h2>Level {level}</h2> <h2>{currentXp}k/{requiredXp}k</h2>

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
            <div className='level-card-editing-item' style={{ 'backgroundColor': cardColor }}>
              <IoColorPaletteSharp className='level-card-editing-item-icon' />
              <input type="color" onChange={onColorChanged} value={cardColor} />
            </div>

            <div className='level-card-editing-item' >
              <MdFileUpload className='level-card-editing-item-icon' />
              <input type='file' accept='image/png,image/jpeg' onChange={onBackgroundUploaded} />
            </div>

          </div>


        </div>}

        {imageFromFile &&
        <div className='level-card-customization-backround-crop'>
          
          {isUploadingResult && <div className='level-card-editing-background-upload-loading' >
            <AiOutlineLoading className='loading-icon'/>
            </div>}

          <div className='level-card-customization-backround-crop-image'>
            <ReactCrop
              style={{
                'maxWidth':'100',
                'maxHeight':'100%'
              }}
              src={imageFromFile}
              crop={cropSettings}
              ruleOfThirds
              onImageLoaded={onImageCropped}
              onChange={onCropChange}
              keepSelection={true}
            />
          </div>

          <button onClick={onDoneCropping}>Done</button>
        </div>
        }
      

    </div>
    );
}

export default LevelCardCustomization;