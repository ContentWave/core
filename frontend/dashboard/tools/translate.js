import { config } from 'dotenv'
import path from 'path'
import fs from 'fs'
import * as deepl from 'deepl-node'

config()

const translate = new deepl.Translator(process.env.DEEPL_KEY)

const directoryPath = path.resolve('./locales')

fs.readdir(directoryPath, function (err, files) {
  //handling error
  if (err) {
    return console.log('Unable to scan directory: ' + err)
  }
  //listing all files using forEach
  files.forEach(function (file) {
    if (file.substr(-4) !== 'json') return
    //if (file === 'en.json') return

    translateFile(file)
  })
})

async function translateFile (filename) {
  const file = JSON.parse(fs.readFileSync(path.join(directoryPath, filename)))
  const lang = filename.replace('.json', '')

  for (let key in file) {
    if (file[key].length) continue
    console.log(`[${lang}] Translating ${key}`)
    if (lang === 'en') file[key] = key
    else {
      let { text: translation } = await translate.translateText(key, null, lang)
      file[key] = translation
    }
  }

  fs.writeFileSync(
    path.join(directoryPath, filename),
    JSON.stringify(file, null, 4)
  )
  console.log(`Lang ${lang} translated.`)
}
