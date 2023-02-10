import '../scss/main.scss';
import { useState, useCallback, useRef } from 'react';
import { IoColorPaletteSharp } from 'react-icons/io5';
import { AiOutlineLoading } from 'react-icons/ai';
import { MdFileUpload } from 'react-icons/md';
import { CgDropOpacity } from 'react-icons/cg';
import { DashboardConstants, getCroppedSecion, getXpForNextLevel, isFileImage } from '../utils';
import ReactCrop, { PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import axios from 'axios';
import { useEffect } from 'react';
import { useAppSelector } from '../redux/hooks';
import React from 'react';
import { useDispatch } from 'react-redux';
import { setCustomizingCard, updateUser } from '../redux/slices/mainSlice';
import { ICardData } from '../types';
import { FrameworkConstants, ECardOptsKeys, IUmekoApiResponse, ObjectValues, OptsParser } from '../framework';
import useSessionId from '../hooks/useSessionId';
const CROP_ASPECT = 3 / 10
const DEFAULT_CROP_SETTINGS: PixelCrop = {
  unit: 'px',
  x: 0,
  y: 0,
  width: 30,
  height: 30 * CROP_ASPECT
}

function extractCardOpts(opts: string) {
  const options = new OptsParser<ObjectValues<typeof ECardOptsKeys>>(opts)
  return ({
    bg: options.get('bg_url', FrameworkConstants.DEFAULT_USER_CARD_BG),
    color: options.get('color', FrameworkConstants.DEFAULT_USER_CARD_COLOR),
    opacity: parseFloat(options.get('opacity', FrameworkConstants.DEFAULT_USER_CARD_OPACITY))
  })
}

export default function LevelCardCustomization() {

  const { sessionId } = useSessionId()
  const [userData] = useAppSelector(s => [s.main.user])

  const dispatch = useDispatch();

  const level = 100;
  const currentXp = 200;

  const displayName = userData?.username || 'Name';
  const rank = 1;
  const requiredXp = (getXpForNextLevel(level) / 1000).toFixed(2);

  const [backgroundTemp, setBackgroundTemp] = useState<string | null>(null);

  const [isUploadingResult, setIsUploadingResult] = useState(false);

  const [imageFromFile, setImageFromFile] = useState<string | null>(null);

  const [cropSettings, setCropSettings] = useState<PixelCrop>(DEFAULT_CROP_SETTINGS);

  const cardSettings = useRef<ICardData>(extractCardOpts(userData?.card_opts || ""))

  const onColorChanged = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target && event.target.value) {
      cardSettings.current.color = event.target.value;
      (document.getElementById('color-input')! as HTMLInputElement).value = event.target.value;
      document.getElementById('main-card')!.style.setProperty('--main-color', event.target.value);
    }
  }, [])

  const onOpacityUpdated = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target && event.target.value) {
      cardSettings.current.opacity = event.target.value as unknown as number;
      (document.getElementById('opacity-input')! as HTMLInputElement).value = event.target.value;
      document.getElementById('main-card')!.style.setProperty('--opacity', event.target.value);
    }
  }, [])

  function onBackgroundUploaded(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length > 0 && isFileImage(event.target.files[0])) {

      const reader = new FileReader();

      reader.addEventListener('load', () => {
        if (typeof reader.result === 'string') {
          setImageFromFile(reader.result);
        }
      })

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  function onCropChange(crop: PixelCrop) {

    crop.height = crop.width * CROP_ASPECT;

    setCropSettings(crop);
  };


  const onDoneCustomizing = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {

    const headers = { sessionId: sessionId }
    if (backgroundTemp) {
      const payload = {
        color: cardSettings.current.color,
        opacity: `${cardSettings.current.opacity}`,
        background: backgroundTemp.split('base64,')[1]
      };

      setIsUploadingResult(true);

      axios.post<IUmekoApiResponse<string>>(`${DashboardConstants.SERVER_URL}/${sessionId}/card`, payload, { headers: headers }).then((response) => {

        const ServerResponse = response.data
        setIsUploadingResult(false);

        if (ServerResponse.error) {
          console.error(ServerResponse.data);
        }
        else {
          cardSettings.current = extractCardOpts(ServerResponse.data)
          dispatch(updateUser({ card_opts: ServerResponse.data }))
        }
        setBackgroundTemp(null);
        dispatch(setCustomizingCard(false))
      });
    }
    else {
      const payload = {
        color: cardSettings.current.color,
        opacity: `${cardSettings.current.opacity}`,
      };

      setIsUploadingResult(true);

      axios.post<IUmekoApiResponse<string>>(`${DashboardConstants.SERVER_URL}/${sessionId}/card`, payload, { headers: headers }).then((response) => {

        const ServerResponse = response.data
        setIsUploadingResult(false);

        if (ServerResponse.error) {
          console.error(ServerResponse.data);
        }
        else {
          cardSettings.current = extractCardOpts(ServerResponse.data)
          dispatch(updateUser({ card_opts: ServerResponse.data }))
        }
        setBackgroundTemp(null);
        dispatch(setCustomizingCard(false))
      });
    }

  }, [sessionId, backgroundTemp, dispatch])

  async function onDoneCropping() {
    const imageTemp = getCroppedSecion(document.getElementById("crop-image")! as HTMLImageElement, cropSettings, 'user-background');

    setCropSettings(DEFAULT_CROP_SETTINGS);
    setImageFromFile(null);
    setBackgroundTemp(imageTemp)
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
    <div id="main-card" className='level-card-customization' style={{ '--main-color': cardSettings.current.color, '--opacity': `${cardSettings.current.opacity}` } as unknown as React.CSSProperties}>

      {!imageFromFile &&
        <div className='level-card-customization-content'>

          {isUploadingResult && <div className='level-card-editing-background-upload-loading' >
            <AiOutlineLoading className='loading-icon' />
          </div>}

          <div className='level-card'>

            <img className="level-card-background" src={backgroundTemp || cardSettings.current.bg} alt="background" />

            <div className="level-card-content">

              <div className="user-level-profile">

                <img
                  src={userData?.avatar} alt="profile" />

              </div>
              <div className="user-level-info">
                <div className="user-level-info-row" data-pos='top'>
                  <h1>{displayName}</h1> <h1>RANK {rank}</h1>
                </div>
                <div className="user-level-info-row" data-pos='middle'>

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
              <input id="color-input" type="color" onChange={onColorChanged} defaultValue={cardSettings.current.color} />

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
            <input id="opacity-input" type='range' min='0' max='1' step='0.001' defaultValue={cardSettings.current.opacity} onChange={onOpacityUpdated} />
          </div>

          <button className='level-card-customization-button' onClick={onDoneCustomizing}>Done</button>


        </div>}

      {imageFromFile &&
        <div className='level-card-customization-backround-crop'>

          <div className='level-card-customization-backround-crop-image'>
            <ReactCrop style={{
              'maxWidth': '100',
              'maxHeight': '100%'
            }}
              crop={cropSettings}
              onChange={(c, d) => onCropChange(c)}
            >
              <img
                id="crop-image"
                src={imageFromFile} onLoad={(ev) => {
                  setCropSettings({
                    unit: 'px',
                    width: ev.currentTarget.width,
                    height: ev.currentTarget.width * CROP_ASPECT,
                    x: 0,
                    y: 0
                  });
                }}
                alt="The background being cropped"
              />
            </ReactCrop>
          </div>

          <button className='level-card-customization-button' onClick={onDoneCropping}>Upload</button>
        </div>
      }


    </div>
  );
}