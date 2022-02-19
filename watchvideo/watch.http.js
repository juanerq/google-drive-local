const fs = require("fs");
const path = require("path");
const convertPath = require("../tools/convertpath");

const watchVideo = async (req, res) => {
    const pathSent = req.params.path;
    const pathComplete = convertPath(pathSent);
    
    const videoName = req.query.v;
    if(!videoName) {
        return res.status(404).json({error: 'Video not found'})
    }
    
    const videoPath = path.join(pathComplete, videoName);
    
    const videoSize = fs.statSync(videoPath).size;
    const range = req.headers.range;

    if (range) {      
        // Parse Range
        // Example: "bytes=32324-"
        const CHUNK_SIZE = 10 ** 6; // 1MB
        const start = Number(range.replace(/\D/g, ""));
        const end = Math.min(start + CHUNK_SIZE, videoSize - 1);


        const contentLength = (end - start) + 1;
        const file = fs.createReadStream(videoPath, {start, end});
        const headers = {
            'Content-Range': `bytes ${start}-${end}/${videoSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': contentLength,
            'Content-Type': 'video/mp4',
        }
        res.writeHead(206, headers);
        file.pipe(res);
        
    } else {
        const headers = {
            'Content-Length': videoSize,
            'Content-Type': 'video/mp4',
        }
        res.writeHead(200, headers);
        fs.createReadStream(videoPath).pipe(res);
    }
}

exports.watchVideo = watchVideo;