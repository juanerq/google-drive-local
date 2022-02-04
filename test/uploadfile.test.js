const supertest = require("supertest");
const { app, server, deleteDirectory } = require("../app");
const api = supertest(app);
require('dotenv').config({path: '../.env'});

const imgPath = process.env.IMGPATH;

const files = [
    `${imgPath}/nezuko.png`,
    `${imgPath}/arch.png`,
    `${imgPath}/wallpaper.jpg`,
    `${imgPath}/katniss.jpg`
]

describe('Upload a new file', () => {

    test('should upload the test image to testDirectory', async () => {
        const response = await api.post('/')
            .attach( 'file', files[0] )
        const content = response.body;

        expect(content.message).toBe('Files received');
    })

    test('should upload the test image to testDirectory', async () => {
        const requestInstance = api.post('/')
        
            for(const file of files) {
                requestInstance.attach('file', file);
            }

        const content = await requestInstance;
        const { existing, uploaded, message } = content.body

        expect(message).toBe('Files received');
        expect(existing).toEqual(["nezuko.png"]);
        expect(uploaded).toEqual(["arch.png", "wallpaper.jpg", "katniss.jpg"])

    })

    // test('Should not upload file that already exists', async () => {
    //     const response = await api.post('/')
    //         .attach( 'file', filePath_1 )
    //     const content = response.body;

    //     expect(content.message).toBe('The file already exists')

    // })
})

afterAll( async () => {
    const deleteFiles = files.map((f) => {
        deleteDirectory(f.split('/')[f.split('/').length - 1])
    })
    await Promise.all(deleteFiles);

    server.close();
})