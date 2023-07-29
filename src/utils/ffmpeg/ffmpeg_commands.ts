import { fetchFile } from ".";
const trim: (ffmpeg: any, video: File, start?: string, end?: string) => Promise<Uint8Array> = async (ffmpeg, video, start = '00:00:00', end = '00:00:10') => {
        ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));
        await ffmpeg.run('-i', 'test.mp4', '-ss', start, '-to', end, '-f', 'mp4', 'output.mp4')
        // Read the result
        const data = ffmpeg.FS('readFile', 'output.mp4');
    
    return (
        await data
    )
}

const overlay: (ffmpeg: any, video: any, image: any, posx: number, posy: number) => Promise<Uint8Array>
    = async (ffmpeg, video, image, posy) => {
        const POS_Y = posy * 2.2
        ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video))
        ffmpeg.FS('writeFile', 'test.png', await fetchFile(image))
        await ffmpeg.run('-i', 'test.mp4','-i', 'test.png','-filter_complex',`[0:v][1:v]overlay=x='10':y=${POS_Y}`,'output.mp4')
        const data = ffmpeg.FS('readFile', 'output.mp4')
        return (await data)
    }

export {trim, overlay};
