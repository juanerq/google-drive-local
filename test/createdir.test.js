const supertest = require("supertest");
const { app, server, createFile, deleteDirectory } = require("../app");
const api = supertest(app);

const testDir = 'newDir'; 
const testFile = 'testFile.txt'

beforeAll( async () => {
    // Eliminar directorio newDir
    await deleteDirectory(testDir);
    // Eliminar directorio el archivo testFile.txt
    await deleteDirectory(testFile);
    
    await createFile(testFile);

})

describe('Create directories', () => {

    test('Create directory', async () => {
        const response = await api.put(`/./${testDir}?restype=directory`)
            .expect(200)
        const content = response.body;

        expect(content.message).toBe('Directory created successfully')
    })

    test('Create directory that already exists', async () => {
        const response = await api.put(`/./${testDir}?restype=directory`)
            .expect(400)
        const content = response.body;

        expect(content.error).toBe('The directory already exists')
    })

    test('Create directory on invalid path', async () => {
        const response = await api.put(`/false/${testDir}?restype=directory`)
            .expect(400);
        const content = response.body;
        // Comprobar el error de "El directorio no existe"
        expect(content.error).toBe('The directory does not exist');
    })

    test('Create directory in file', async () => {
        const response = await api.put(`/${testFile}/${testDir}?restype=directory`)
            .expect(400);
        const content = response.body;
        // Comprobar el error de "Solo se admiten directorios"
        expect(content.error).toBe('Only directories are supported');
    })

})


afterAll( async () => {
    // Eliminar directorio newDir
    await deleteDirectory(testDir);
    // Eliminar directorio el archivo testFile.txt
    await deleteDirectory(testFile);

    server.close();
})