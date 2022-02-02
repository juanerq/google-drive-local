const supertest = require("supertest");
const { app, server, deleteDirectory, createFile } = require("../app");
const api = supertest(app);

const testFile = 'testFile.txt'

beforeAll( async () => {
    // Eliminar directorio el archivo testFile.txt
    await deleteDirectory(testFile);

})

describe('Create files', () => {

    test('Create file', async () => {
        const response = await api.put(`/./${testFile}?restype=file`)
            .expect(200)
        const result = response.body; 
        
        expect(result.message).toBe('File created successfully');
    })

    test('Create file that already exists', async () => {
        const response = await api.put(`/./${testFile}?restype=file`)
            .expect(400)
        const result = response.body; 
        
        expect(result.message).toBe('The file already exists');
    })

    test('Create file on invalid path', async () => {
        const response = await api.put(`/false/${testFile}?restype=file`)
            .expect(400);
        const content = response.body;
        // Comprobar el error de "El directorio no existe"
        expect(content.error).toBe('The directory does not exist');
    })

    test('Create file in another file', async () => {
        const response = await api.put(`/${testFile}/${testFile}?restype=directory`)
            .expect(400);
        const content = response.body;
        // Comprobar el error de "Solo se admiten directorios"
        expect(content.error).toBe('Only directories are supported');
    })

})

afterAll( async () => {
    // Eliminar directorio el archivo testFile.txt
    await deleteDirectory(testFile);

    server.close();
})