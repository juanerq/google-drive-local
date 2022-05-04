const { server } = require("../app")
const { api } = require('./helper')

const { createFile, createDirectory } = require("../create/create.controller")
const deleteDirectory = require("../tools/deletedir")

const testPath = process.env.BASEPATH

const files = [
  `${testPath}/img/city.jpg`,
  `${testPath}/img/foxy.jpg`,
  `${testPath}/img/nezuko.png`,
  `${testPath}/img/springtrap.jpg`
]

const imagesName = files.map(img => img.split('/').pop())

const testFile = 'testFile.txt'
const testDir = 'testDir'

const pathTestDir = `${testPath}/${testDir}/`

beforeAll( async () => {
  await createDirectory(testPath, testDir)
  await createFile(pathTestDir, testFile)
})

describe('Upload a new file', () => {

  test('Should upload the test image to testDir', async () => {
    const file = files[0]

    const response = await api.put(`/upload/${testDir}`)
      .attach( 'files', file )
      .expect( 200 ) 
    const { existing, uploaded, msg } = response.body

    const imgName = file.split('/').pop()

    expect( msg ).toBe( 'Files received' )
    expect( uploaded ).toEqual([ imgName ])
    expect( existing ).toHaveLength( 0 )
  })

  test('Should only upload files that dont exist', async () => {
    const requestInstance = api.put(`/upload/${testDir}`)
    
    for(const file of files) {
      requestInstance.attach('files', file)
    }

    const response = await requestInstance
      .expect( 200 ) 
        
    const { existing, uploaded, msg } = response.body

    const repeatedImg = files[0].split('/').pop()

    const restOfImg = imagesName.filter(img => img != repeatedImg)

    expect( msg ).toBe( 'Files received' )
    expect( existing ).toEqual([ repeatedImg ])
    expect( uploaded ).toEqual( restOfImg )
  })

  test('Should not upload the file that already exists', async () => {
    const file = files[1]

    const response = await api.put(`/upload/${testDir}`)
      .attach( 'files', file )
      .expect( 400 ) 
        
    const{ error, path } = response.body

    const imgName = file.split('/').pop()

    expect( error ).toBe( 'The file already exists' )
    expect( path ).toEqual([ imgName ])
  })

  test('Should not upload any file ( the files already exist )', async () => {
    const requestInstance = api.put(`/upload/${testDir}`)
    
    for(const file of files) {
      requestInstance.attach('files', file)
    }

    const content = await requestInstance
      .expect( 400 ) 
    const { error, path } = content.body

    expect( error ).toBe( 'The file already exists' )
    expect( path ).toEqual( imagesName )
  })


  test('Should return an error for not sending a file', async () => {
    const content = await api.put(`/upload/${testDir}`)
      .expect( 400 ) 
    const { error } = content.body

    expect( error ).toBe( 'No files uploaded' )
  })

  test('Should not upload the file to an invalid path', async () => {
    const response = await api.put('/upload/false/')
      .attach( 'file', files[2] )
      .expect( 400 )
    const { error, path } = response.body

    expect(error).toBe('The directory does not exist')
    expect(path).toBe(testPath + '/false')
  })

  test('Should not upload the file to a file path', async () => {
    const response = await api.put(`/upload/${testDir}-${testFile}`)
      .attach( 'file', files[2] )
      .expect( 400 )
    const { error, path } = response.body

    expect(error).toBe('Only directories are supported')
    expect(path).toBe(pathTestDir + testFile)
  })
})

afterAll( async () => {
  await deleteDirectory(pathTestDir)

  server.close()
})