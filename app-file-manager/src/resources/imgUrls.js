const fileImgUrl = {
    generic: 'https://img.icons8.com/color/480/000000/document--v1.png',
    js: 'https://img.icons8.com/color/480/000000/javascript--v1.png',
    json: 'https://img.icons8.com/fluency/480/000000/node-js.png',
    html: 'https://img.icons8.com/color/480/000000/html-5--v1.png',
    css: 'https://img.icons8.com/color/480/000000/css3.png',
    gitignore: 'https://img.icons8.com/color/480/000000/git.png',
    mp3: 'https://img.icons8.com/color/480/000000/music--v1.png',
    trash: 'https://img.icons8.com/color/480/000000/trash--v1.png',
    mp4: 'https://img.icons8.com/fluency/96/000000/video.png',
    pdf: 'https://img.icons8.com/color/480/000000/news.png',
    csv: 'https://img.icons8.com/color/480/000000/scroll.png'
}

const dirImgUrls = {
    folder: 'https://img.icons8.com/color/480/000000/folder-invoices--v1.png',
    openFolder: 'https://img.icons8.com/color/480/000000/opened-folder.png',
    git: 'https://img.icons8.com/ios-glyphs/480/000000/github.png',
    node_modules: 'https://img.icons8.com/color/480/000000/nodejs.png',
}

const imageType = { png:'', jpg:'', svg:'', jpeg: ''}

const searchFileType = (filename, isDir, isOpen) => {
    const type = filename.split('.').pop()
    
    if(isDir) {
        if(type in dirImgUrls)
            return dirImgUrls[type]
        return isOpen ? dirImgUrls.openFolder : dirImgUrls.folder
    } else {
        if(type in fileImgUrl) {
            return fileImgUrl[type]
        } else if(type in imageType) {
            return 'img'
        } 
        return fileImgUrl.generic
    }
}


export { fileImgUrl, dirImgUrls, searchFileType }