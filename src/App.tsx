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
      const url = URL.createObjectURL(
        new Blob([(await overlay(ffmpeg, videoToUse, image)).buffer], {type: 'video/mp4'})
      )
      setUpdatedVideo(url);
      setReady(true);
    }
    else setReady(true)
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
                  <FileUploader btnText={'Upload Video'} accepts={'.mp4'} handleFile={setVideo}/>
                  <FileUploader btnText={'Image Overlay'} accepts={'.png'} handleFile={setImage}/>
                  {image && 
                    <img src={URL.createObjectURL(image)}/>
                  }
                  {video &&
                    <>
                    <video
                      controls
                      width="1250"
                      src={updatedVideo || URL.createObjectURL(video)}>
                    </video>
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
                    </div>
                    </>
                  }
              </div>
            </div>
          </div>
        )
}

export default App;
