const sum = require("../sum");


describe.skip('Sum function', () => {
    test('To add numbers', () => {
        const result = sum(9, 7, 5, 0, 1);
    
        expect(result).toBe(22);
    })
    
    test('Do not add anything', () => {
        const result = sum();
    
        expect(result).toBe(0);
    })
    
    test('Add strings', () => {
        const result = sum('hola', 'como', 'estas');
        
        expect(result).toBe('Only numbers are allowed');
    })
})