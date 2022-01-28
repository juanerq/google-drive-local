const sum = (...nums) => {
    let result = 0;
    nums.forEach( n => {
        if(isNaN(n)){
            result = 'Only numbers are allowed'; 
            return; 
        }
        result += n;
    })
    return result;
}

module.exports = sum