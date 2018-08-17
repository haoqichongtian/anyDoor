module.exports = {
    "env": {
        // "browser": true,
        "node":true,
        "commonjs": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 2017
    },
    "rules": {
        "indent": [
            "warn",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "off",
            "single"
        ],
        "semi": [
            "warn",
            "always"
        ],
        "linebreak-style":[
            "off",
            "lf"
        ],
        "no-unused-vars":[
            "off"
        ],
        "no-console":[
            "off"
        ]
        // "sourceMap":[
        //     "error",
        //     "module"
        // ]
    }
};
