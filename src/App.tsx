import { useState, useEffect } from 'react';
import './App.css';

import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
const ffmpeg = createFFmpeg({ log: true });

function App() {
  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState<any>();
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

  const trim = async (start: string = '00:00:00', end: string = '00:00:10') => {
    setReady(false)
    // Write the file to memory 
    ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));
    await ffmpeg.run('-i', 'test.mp4', '-ss', start, '-to', end, '-f', 'mp4', 'output.mp4')
    // Read the result
    const data = ffmpeg.FS('readFile', 'output.mp4');

    // Create a URL
    const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
    setUpdatedVideo(url)
    setReady(true);
  }

  return ready ? (
    
    <div className="App">
      <div className={'row'}>
        <div className={'col'}>
            {video &&
              <>
              <video
                controls
                width="1250"
                src={updatedVideo || URL.createObjectURL(video)}>
              </video>
              <input type="file" onChange={(e) => setVideo(e.target.files?.item(0))} />
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
                <button onClick={() => trim(undefined, trimLength.toString())}>Trim</button>
              </div>
              </>
            }
        </div>
      </div>
    </div>
  )
    :
    (
      <div
        style={{
          width: '95vw',
          height: '70vh',
          border: '1px solid #ccc',
          backgroundColor: 'black',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <p>Loading...</p>
      </div>
    );
}

export default App;
