const { server } = require("../app")
const { api } = require('./helper')

const { createFile } = require("../create/create.controller")
const deleteDirectory = require("../tools/deletedir")

const testDir = 'testDir' 
const pathTestDir = `${__dirname}/${testDir}`

beforeAll( async () => {
    // Eliminar directorio testDir
    await deleteDirectory(pathTestDir)
})

describe('Create directories', () => {
    // __dirname
    test('Should create a directory in basePath with name testDir', async () => {
        const response = await api.post('/')
            .send({
                restype: "directory",
                name: testDir
            })
            .expect(200)
        const content = response.body

        expect(content.message).toBe('Directory created successfully')
        expect(content.path).toBe(pathTestDir)
    })

    test('Should not create directory in testDir with name testDir_2', async () => {
        const response = await api.post(`/${testDir}`)
            .send({
                restype: "directory",
                name: `${testDir}_2`
            })
            .expect(200)
        const content = response.body

        expect(content.message).toBe('Directory created successfully')
        expect(content.path).toBe(`${pathTestDir}/${testDir}_2`)
    })

    test('Should not create directory in testDir_2 with name testDir_3', async () => {
        const response = await api.post(`/${testDir}-${testDir}_2`)
            .send({
                restype: "directory",
                name: `${testDir}_3`
            })
            .expect(200)
        const content = response.body

        expect(content.message).toBe('Directory created successfully')
        expect(content.path).toBe(`${pathTestDir}/${testDir}_2/${testDir}_3`)
    })

    test('Should not create directory that already exists', async () => {
        const response = await api.post(`/${testDir}-${testDir}_2`)
            .send({
                restype: "directory",
                name: `${testDir}_3`
            })
            .expect(400)
        const content = response.body

        expect(content.error).toBe('The directory already exists')
    })

    test('Should not create directory to an invalid path.', async () => {
        const response = await api.post(`/false`)
            .send({
                restype: "directory",
                name: `${testDir}_4`
            })
            .expect(400)
        const content = response.body
        // Comprobar el error de "El directorio no existe"
        expect(content.error).toBe('The directory does not exist')
    })

    test('Should not create directory to a file path', async () => {
        const filename = 'file.txt'
        createFile(`${pathTestDir}`, filename)

        const response = await api.post(`/${testDir}-${filename}`)
            .send({
                restype: "directory",
                name: `${testDir}_5`
            })
            .expect(400)
        const content = response.body
        // Comprobar el error de "Solo se admiten directorios"
        expect(content.error).toBe('Only directories are supported')
    })

})


afterAll( async () => {
    // Eliminar directorio testDir
    await deleteDirectory(pathTestDir)

    server.close()
})