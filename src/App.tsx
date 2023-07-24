import { useState, useEffect } from 'react';
import './App.css';
import Loading from './components/loading';
import { trim } from './utils/ffmpeg';

function App({ffmpeg}: {ffmpeg: any}) {
  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState<File | null | undefined>();
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

  useEffect(() => {
    load();
  }, [])

  const trimVideo = async () => {
    setReady(false)
    // Write the file to memory 
    if (video) {
    // Create a URL
    const url = URL.createObjectURL(new Blob([(await trim(ffmpeg, video)).buffer], { type: 'video/mp4' }));
    setUpdatedVideo(url)
    setReady(true);
    }
    else setReady(true);
  }

  return ready ? (
    
    <div className="App">
      <div className={'row'}>
        <div className={'col'}>
            <input type="file" accept='.mp4' onChange={(e) => setVideo(e.target.files?.item(0))} />
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
              </div>
              </>
            }
        </div>
      </div>
    </div>
  )
    : <Loading />
}

export default App;
