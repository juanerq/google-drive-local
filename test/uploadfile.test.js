const { server } = require("../app")
const { api } = require('./helper')

const { createFile } = require("../create/create.controller")
const deleteDirectory = require("../tools/deletedir");

const testPath = process.env.BASEPATH

const files = [
    `${testPath}/city.jpg`,
    `${testPath}/foxy.jpg`,
    `${testPath}/nezuko.png`,
    `${testPath}/springtrap.jpg`
]

const testFile = 'testFile.txt'

beforeAll( async () => {
  await createFile(testPath, testFile)
})

describe('Upload a new file', () => {

    test.only('Should upload the test image to testDirectory', async () => {
        const response = await api.put('/upload/')
          .attach( 'files', files[0] )
          .expect( 200 ) 
        const { existing, uploaded, message } = response.body

        expect( message ).toBe( 'Files received' );
        expect( uploaded ).toEqual( [ "nezuko.png" ] );
        expect( existing ).toHaveLength( 0 );
    })

    test('Should only upload files that dont exist', async () => {
        const requestInstance = api.put('/')
        
            for(const file of files) {
                requestInstance.attach('file', file);
            }

        const content = await requestInstance
            .expect( 200 ) 
            
        const { existing, uploaded, message } = content.body

        expect( message ).toBe( 'Files received' );
        expect( existing ).toEqual( [ "nezuko.png" ] );
        expect( uploaded )
            .toEqual( ["arch.png", "wallpaper.jpg", "katniss.jpg"] )
    })

    test('Should not upload the file that already exists( arch.png )', async () => {
        const response = await api.put('/')
            .attach( 'file', files[1] )
            .expect( 400 ) 
        const{ existing, uploaded, message } = response.body

        expect( message ).toBe( 'The file already exists' )
        expect( existing ).toEqual( ["arch.png"] );
        expect( uploaded ).toEqual( undefined );
    })

    test('Should not upload any file ( the files already exist )', async () => {
        const requestInstance = api.put('/')
        
            for(const file of files) {
                requestInstance.attach('file', file);
            }

        const content = await requestInstance
            .expect( 400 ) 
        const { existing, uploaded, message } = content.body

        expect( message ).toBe( 'The file already exists' );
        expect( uploaded ).toEqual( undefined );
        expect( existing )
            .toEqual( [ "nezuko.png", "arch.png", "wallpaper.jpg", "katniss.jpg" ] );
    })


    test('Should return an error for not sending a file', async () => {
        const content = await api.put('/')
            .expect( 400 ) 
            
        const { existing, uploaded, message } = content.body;

        expect( message ).toBe( 'No files uploaded' );
        expect( uploaded ).toEqual( undefined );
        expect( existing ).toEqual( undefined );
    })

    test('Should not upload the file to an invalid path', async () => {
        const response = await api.put('/false/')
            .attach( 'file', files[2] )
            .expect( 400 );
        const content = response.body;

        expect(content.error).toBe('The directory does not exist');
    })

    test('Should not upload the file to a file path', async () => {
        const response = await api.put(`/${testFile}`)
            .attach( 'file', files[2] )
            .expect( 400 );
        const content = response.body;

        expect(content.error).toBe('Only directories are supported');
    })
})

afterAll( async () => {
    // const deleteFiles = files.map((f) => {
    //     deleteDirectory(f.split('/')[f.split('/').length - 1])
    // })
    // await Promise.all(deleteFiles);
    // await deleteDirectory(testPath, testFile);

    server.close();
})