module.exports = {
    printWidth: 120,
    semi: false,
    singleQuote: true,
    tabWidth: 4,
    overrides: [
        {
            files: ['*.yml', '*.json'],
            options: {
                tabWidth: 2,
            },
        },
    ],
}
