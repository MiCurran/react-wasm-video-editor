import { useState, useEffect } from 'react';
import './App.css';
import Loading from './components/loading';
import { trim } from './utils/ffmpeg';
import { overlay } from './utils/ffmpeg/ffmpeg_commands';
import FileUploader from './components/fileUpload';

function App({ffmpeg}: {ffmpeg: any}) {
  const [ready, setReady] = useState<boolean>(false);
  const [video, setVideo] = useState<File | null | undefined>();
  const [image, setImage] = useState<File | null | undefined>();
  const [updatedVideo, setUpdatedVideo] = useState<string>();
  const [trimLength, setTrimLength] = useState<number>(10)
  const [posy, setPosy] = useState<number>(30);
  const [showGuide, setShowGuide] = useState<boolean>(true);

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  }

  const reset = () => {
    setUpdatedVideo(undefined);
    setVideo(undefined);
  }

  const trimVideo = async () => {
    setReady(false)
    if (video) {
    const url = URL.createObjectURL(new Blob([(await trim(ffmpeg, video)).buffer], { type: 'video/mp4' }));
    setUpdatedVideo(url)
    setReady(true);
    }
    else setReady(true);
  }

  const overlayVideo = async () => {
    const videoToUse = updatedVideo || video
    setReady(false);
    if  (image) {
      console.log(posy);
      const url = URL.createObjectURL(
        new Blob([(await overlay(ffmpeg, videoToUse, image, 30, posy)).buffer], {type: 'video/mp4'})
      )
      setUpdatedVideo(url);
      setReady(true);
    }
    else setReady(true)
  }

const changePos = (y: number) => {
  const element = document.querySelector<HTMLElement>(".content");
  if (element) {
    setPosy(y);
    element.style.setProperty("--ypos", `${posy}px`);
  }
}

const hideGuide = () => {
   const element = document.querySelector<HTMLElement>(".content");
  if (element) {
    setShowGuide(!showGuide);
    if(!showGuide){
    element.style.setProperty("--guide-display", 'none')
    }
    else {
    element.style.setProperty("--guide-display", 'unset')
    }
  } 
}

  useEffect(() => {
    if(!ffmpeg.isLoaded()){
      load();
    }
  }, [])

  return !ready 
        ? <Loading />
        : (
          <div className="App">
            <div className={'row'}>
              <div className={'col'}>
                  {!video && <FileUploader btnText={'Start With A Video'} accepts={'.mp4'} handleFile={setVideo}/> }
                  {image && 
                    <img src={URL.createObjectURL(image)}/>
                  }
                  {!video
                    ? <h3 id='breathe'>👆</h3>
                    : (
                    <>
                    <FileUploader btnText={'Image Overlay'} accepts={'.png'} handleFile={setImage}/>
                    <div className='content'>
                    <video
                      controls
                      width="1250"
                      src={updatedVideo || URL.createObjectURL(video)}>
                    </video>
                    </div>
                    <div>
                      <label htmlFor='trim-length'>Trim length</label>
                      <input 
                        type='number' 
                        min={1} 
                        max={60} id={'trim-length'} 
                        onChange={(e) => setTrimLength(parseInt(e.target.value))} 
                        value={trimLength}
                      />
                      <div className={'col'} />
                      <button onClick={reset}>reset</button>
                      <button onClick={() => trimVideo()}>Trim</button>
                      <button onClick={() => overlayVideo()}>Add Overlay</button>
                      <button onClick={() => changePos((posy + 10))} >move down</button>
                      <button onClick={() => hideGuide()}>toggle guide</button>
                    </div>
                    </>
                  )
                }
              </div>
            </div>
          </div>
        )
}

export default App;
