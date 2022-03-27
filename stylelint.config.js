module.exports = {
    extends: [
        'stylelint-config-standard',
        'stylelint-config-standard-scss',
        'stylelint-config-sass-guidelines',
        'stylelint-prettier/recommended',
    ],
    rules: {
        'order/properties-alphabetical-order': null,
        'max-nesting-depth': null,
        'color-hex-length': 'long',
        'selector-no-qualifying-type': null,
        'selector-max-compound-selectors': null,
        'function-no-unknown': [true, { ignoreFunctions: ['color.adjust'] }], // fixes color.adjust false positives, remove when fixed by stylelint-scss
    },
}
