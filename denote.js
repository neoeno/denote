import moment from 'moment'
import fs from 'fs'
import tmp from 'tmp'
import editor from 'editor'
import trash from 'trash'
import git from 'simple-git'
import userHome from 'user-home'

const root = `${userHome}/notes`
const weekDirectory = moment().startOf('isoWeek').format("[WC]-YYYY-MM-DD")
const dayFilename = moment().format("YYYMMDDHHmmss-dddd-hh-mma")
const directoryPath = `${root}/${weekDirectory}`
const filename = `${directoryPath}/${dayFilename}.md`

const headingDate = moment().format("dddd, MMMM Do YYYY, h:mm:ss a")
const heading = `# Note for ${headingDate}`

const writeHeaderAnd = fn => {
  fs.writeFile(filename, `${heading}\n\n\n`, err => {
    if (err) throw err
    fn()
  })
}

const openEditorAnd = (fn) => {
  editor(filename, fn)
}

const makeDirectoryAnd = (fn) => {
  fs.mkdir(directoryPath, err => {
    if (err && err.code !== 'EEXIST') throw err
    fn()
  })
}

const deleteBlankNoteOr = (fn) => {
  fs.readFile(filename, 'utf8', (err, contents) => {
    if (contents.split("\n").join(" ").match(new RegExp(`^\\s*${heading}\\s*$`))) {
      trash(filename).then(() => {
        console.log("Nothing written! Trashed the file")
      })
    } else {
      fn()
    }
  })
}

const gitCommitAndPush = () => {
  console.log("Pushing to git remote...")
  git(root)
    .add('./*')
    .commit(`Add log for ${headingDate}`)
    .push('origin', 'master')
    .then(() => console.log("Pushed!"))
}

const chain = (fn, ...fns) => () => {
  if (fn == undefined) { return }
  return fn(chain(...fns))
}

chain(makeDirectoryAnd, writeHeaderAnd, openEditorAnd, deleteBlankNoteOr, gitCommitAndPush)()
