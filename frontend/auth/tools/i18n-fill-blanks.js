const fs = require('fs')

const folderName = 'locales'

const files = fs.readdirSync(folderName)

for (let filename of files) {
  if (filename.substr(-4) !== 'json') continue
  let content = JSON.parse(fs.readFileSync(`${folderName}/${filename}`))
  let updated = false

  for (let key in content) {
    if (content[key] === '') {
      content[key] = key
      updated = true
    }
  }

  if (updated)
    fs.writeFileSync(
      `${folderName}/${filename}`,
      JSON.stringify(content, null, 4)
    )
}
