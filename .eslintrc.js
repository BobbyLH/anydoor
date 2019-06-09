module.exports = {
    "extends": "eslint:recommended",
    "rules": {
        "no-console": ["error", {
            "allow": ["warn", "error", "info"]
        }],
        "indent": ["error", 2],
        "linebreak-style": ["warn", "unix"],
        "quotes": ["error", "single"]
    },
    // "parser": "babel-eslint",
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "srcipt"
    },
    "globals": {
        // "window": true,
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "env": {
        // "browser": true,
        "node": true,
        "commonjs": true,
        "es6": true,
        "mocha": true
    }
};