const moment = require('moment');

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

function parseToken(token) {
    if (validateToken(token)) {
        const split = token.split('.');
        return {
            serverUid: split[0],
            startTime: moment(parseInt(split[1], 36)).format()
        };
    }
    return {};
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
    hashCode,
    createToken,
    parseToken
};
