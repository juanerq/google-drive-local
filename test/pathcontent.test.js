const supertest = require("supertest");
const { app, server, deleteDirectory, createFile, basepath } = require("../app");
const api = supertest(app);

const createDirectory = require("../tools/createdir");

const testDirectory = 'testDir'; 
const testFile = 'testFile.txt'
const directories = [ 'dir_1', 'dir_2', 'dir_3' ];
const numberFiles = 6;

beforeEach( async () => {
    // Eliminar directorio testDir
    await deleteDirectory(testDirectory);
    // Crear directorio testDir
    await createDirectory(testDirectory, basepath);
    // Crear directorios dentro de testDir
    for(const dirName of directories) {
        await createDirectory(dirName, testDirectory);
    }

    for(let i = 0; i < numberFiles; i++) {
        createFile(
            `file_${i}.txt`, 
            `Estoy en el archivo numero ${i}`,
            `${testDirectory}/${directories[1]}` 
        )
    }

    createFile(testFile);

})

describe('List path content', () => {
    
    test('List the contents of the testDir directory', async () => {
        const response = await api.get("/testDir")
            .expect(200);
        const content = response.body.content;
        // Comprobar si se crean los directorios dentro de testDir
        expect(Object.keys(content)).toHaveLength(directories.length);
        // Comprobar si se crean los archivos dentro de dir_2
        expect(Object.keys(content.dir_2)).toHaveLength(numberFiles);
    })
    
    test('List basepath content', async () => {
        const response = await api.get("/")
            .expect(200);
        const content = response.body.content;
        // Listar contenido de ruta base: 
        // /home/juanerq/Documentos/Proyectos/GoogleDriveCasero
        expect(Object.keys(content)).toHaveLength(Object.keys(content).length);
    })

    test('List the contents of a directory that does not exist', async () => {
        const response = await api.get("/false")
            .expect(400);
        const content = response.body.message;
        // Comprobar el error de "El directorio no existe"
        expect(content.error).toBe('The directory does not exist');
    })

    test('List file content', async () => {
        const response = await api.get(`/${testFile}`)
            .expect(400);
        const content = response.body.message;
        // Comprobar el error de "Solo se admiten directorios
        expect(content.error).toBe('Only directories are supported');
    })
    
})

// Ejecuta una acción al terminar TODOS los test
afterAll( async () => {
    // // Eliminar directorio testDir
    await deleteDirectory(testDirectory);
    // Eliminar file.txt
    await deleteDirectory(testFile);

    server.close();
})