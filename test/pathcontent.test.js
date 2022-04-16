const { server } = require("../app");
const { dirTestContent, api, createDirectorys, createFiles } = require('./helper')

const { createDirectory } = require("../create/create.controller");
const deleteDirectory = require("../tools/deletedir");

const pathTest = process.env.BASEPATH

const testDir = 'testPath'; 
const pathTestDir = `${pathTest}/${testDir}/`

const directories = [ 'dir_1', 'dir_2', 'dir_3', 'dir_4' ];
const files = [ 'file_1.txt', 'file_2.txt', 'file_3.txt', 'file_4.txt' ];

beforeAll( async () => {
    await deleteDirectory(`${pathTest}/${testDir}`)
    // Crear directorio testDir
    await createDirectory(pathTest, testDir);
    // Crear directorios dentro de testDir
    await createDirectorys(pathTestDir, directories)
    // Crear archivos dentro de testDir
    await createFiles(pathTestDir + directories[1], files)
})

describe('List path content', () => {
    
    test('Should list the contents of the testDir directory', async () => {
        const response = await api.get(`/${testDir}`)
            .expect(200);
        const content = response.body.content;
        // Comprobar si se crean los directorios dentro de testDir
        expect(Object.keys(content)).toEqual(directories);
        // Comprobar si se crean los archivos dentro de dir_2
        expect(content[directories[1]]).toEqual(files);
    })
    
    test('Should list basepath test content', async () => {
        const response = await api.get("/")
            .expect(200);
        const content = response.body.content;
        // Listar contenido de ruta base: 
        // /home/juanerq/Documentos/Proyectos/GoogleDriveCasero/test
        const dirTest = dirTestContent()

        expect(Object.keys(content)).toHaveLength(dirTest.length);
    })

    test('Should not list the contents of a directory that does not exist', async () => {
        const response = await api.get("/false")
            .expect(400);

        // Comprobar el error de "El directorio no existe"
        expect(response.body.error).toBe('The directory does not exist');
    })

    test('Should not list a file content', async () => {
        const pathFile = `${testDir}-${directories[1]}-${files[0]}`
        const response = await api.get(`/${pathFile}`)
            .expect(400)

        // Comprobar el error de "Solo se admiten directorios
        expect(response.body.error).toBe('Only directories are supported');
    })
    
})


// Ejecuta una acción al terminar TODOS los test
afterAll( async () => {
    //Eliminar directorio testPath
    await deleteDirectory(`${pathTest}/${testDir}`)
    server.close();
})