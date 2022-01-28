const supertest = require("supertest");
const { app, server, createDirectory, deleteDirectory, createFile } = require("../app");
const api = supertest(app);

const testDirectory = 'testDir'; 

beforeEach( async () => {
    // Eliminar directorio testDir
    await deleteDirectory(testDirectory);
    // Crear directorio testDir
    await createDirectory('.', testDirectory);
    // Crear directorios dentro de testDir
    const directories = [ 'dir_1', 'dir_2', 'dir_3' ];
    for(const dir of directories) {
        await createDirectory(`./${testDirectory}`, dir);
    }

    const numberFiles = 6;
    for(let i = 0; i < numberFiles; i++) {
        createFile(
            `${testDirectory}/dir_2/`, 
            `file_${i}.txt`, 
            `Estoy en el archivo numero ${i}`
        )
    }

})


test('List contents of directory testDir', async () => {
    const response = await api.get("/testDir")
        .expect(200);
    const content = response.body.content;

        expect(Object.keys(content)).toHaveLength(3);
        expect(Object.keys(content.dir_2)).toHaveLength(6);


})

// Ejecuta una acción al terminar TODOS los test
afterAll(() => {
    server.close();
})