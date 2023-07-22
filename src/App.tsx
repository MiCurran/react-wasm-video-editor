import { useState, useEffect } from 'react';
import './App.css';

import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
const ffmpeg = createFFmpeg({ log: true });

function App() {
  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState<any>();
  const [trimmed, setTrimmed] = useState<string>();

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  }

  const reset = () => {
    setTrimmed(undefined);
    setVideo(undefined);
  }

  useEffect(() => {
    load();
  }, [])

  const convertToGif = async () => {
    setReady(false)
    // Write the file to memory 
    ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));
    await ffmpeg.run('-i', 'test.mp4', '-ss', '00:00:00', '-to', '00:00:10', '-f', 'mp4', 'output.mp4')
    // Read the result
    const data = ffmpeg.FS('readFile', 'output.mp4');

    // Create a URL
    const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
    setTrimmed(url)
    setReady(true);
  }

  return ready ? (
    
    <div className="App">
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          { video && !trimmed && 
          <>
          <video
            controls
            width="250"
            src={URL.createObjectURL(video)}>
          </video>
          <button onClick={convertToGif}>Trim</button>
          </>
          }
          { trimmed && 
            <>
              <video controls src={trimmed} width="250" />
              <button onClick={reset}>reset</button>
            </>
          }
          <input type="file" onChange={(e) => setVideo(e.target.files?.item(0))} />
        </div>
      </div>
    </div>
  )
    :
    (
      <p>Loading...</p>
    );
}

export default App;
