module.exports = {
    '{**,.}/*.{js,jsx,ts,tsx,json,css,scss,md}': ['prettier --check'],
    '{**,.}/*.{js,jsx,ts,tsx}': ['eslint'],
    '{**,.}/*.{scss, css}': ['stylelint'],
    '*.md': ['markdownlint'],
}
