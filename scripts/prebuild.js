const fs = require('fs')
const path = require('path')

const files = fs.readdirSync(path.resolve('./node_modules/ag-grid-enterprise/dist'), { withFileTypes: true })

for (const file of files) {
    if (!file.isFile()) continue
    if (path.extname(file.name) != '.js') continue

    let content = fs.readFileSync(path.join(file.parentPath, file.name), { encoding: 'utf-8' })
    content = content.replace(/outputInvalidLicenseKey\s?=\s?function\s?\([^\)]*\)\s?\{[^\}]*\}/g, 'outputInvalidLicenseKey=function(){}')
    content = content.replace(/outputExpiredTrialKey\s?=\s?function\s?\([^\)]*\)\s?\{[^\}]*\}/g, 'outputExpiredTrialKey=function(){}')
    content = content.replace(/outputMissingLicenseKey\s?=\s?function\s?\([^\)]*\)\s?\{[^\}]*\}/g, 'outputMissingLicenseKey=function(){}')
    content = content.replace(/outputIncompatibleVersion\s?=\s?function\s?\([^\)]*\)\s?\{[^\}]*\}/g, 'outputIncompatibleVersion=function(){}')
    fs.writeFileSync(path.join(file.parentPath, file.name), content, { encoding: 'utf-8' })
}
