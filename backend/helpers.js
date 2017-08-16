
function validateKey(req) {
    return new Promise((resolve, reject) => {
        const db = req.app.locals.db;
        if (req.params.key && req.params.key.length >= 2) {
            const findArg = {
                allowedIds: req.params.key
            };
            db.collection('config').find(findArg).toArray((err, docs) => {
                if (docs.length > 0) {
                    resolve(docs);
                } else {
                    reject();
                }
            });
        } else {
            reject();
        }
    });
}

/* eslint 'no-bitwise': 'off' */
function hashCode(str) {
    let hash = 0;
    let i;
    let chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return ((hash + 2147483647) + 1).toString(36);
}

function createToken() {
    const radix = 36;
    const uid = parseInt(Math.random() * 1e8, 10).toString(radix);
    const timestamp = Date.now().toString(radix);
    const hash = hashCode(`${uid}.${timestamp}`);
    return `${uid}.${timestamp}.${hash}`;
}

function validateToken(token) {
    if (typeof token === 'string') {
        const split = token.split('.');
        if (split.length === 3) {
            return hashCode(`${split[0]}.${split[1]}`) === split[2];
        }
    }
    return false;
}

module.exports = {
    validateKey,
    hashCode,
    createToken,
    validateToken
};
