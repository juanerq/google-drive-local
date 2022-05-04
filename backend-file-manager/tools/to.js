const to = (promise) => {
    return promise.then( data => {
        return [ null, data ]
    }).catch( error => [ error, null ]);
}

module.exports = to;