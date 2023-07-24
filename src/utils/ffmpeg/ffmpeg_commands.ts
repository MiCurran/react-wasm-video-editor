import { fetchFile } from ".";
const trim: (ffmpeg: any, video: File, start?: string, end?: string) => Promise<Uint8Array> = async (ffmpeg, video, start = '00:00:00', end = '00:00:10') => {
// ffmpeg should be changed to instance of FFMPEG

        ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));
        await ffmpeg.run('-i', 'test.mp4', '-ss', start, '-to', end, '-f', 'mp4', 'output.mp4')
        // Read the result
        const data = ffmpeg.FS('readFile', 'output.mp4');
    
    return (
        await data
    )
}

export {trim};