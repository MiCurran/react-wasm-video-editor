import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {createFFmpeg} from './utils/ffmpeg/index.ts';
const ffmpeg = createFFmpeg({log: true});

ReactDOM.createRoot(document.getElementById('root')!).render(
  
  <React.StrictMode>
    <App ffmpeg={ffmpeg}/>
  </React.StrictMode>,
)
