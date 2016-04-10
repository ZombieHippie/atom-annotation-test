var SpellChecker = require('spellchecker')

var annotationHelper = require('./annotation-helper')

/** return {
  id: number,
  notes: [][
    start: [row: number, col: number],
    end: [row: number, col: number],
    data: any
  ]
}
 */
module.exports =
function AnnotationHandler (arg) {
  var id = arg.id
  var text = arg.text
  SpellChecker.add("GitHub")
  SpellChecker.add("github")

  // []{ start: number, end: number, data: any }
  var misspelledCharacterRanges = SpellChecker.checkSpelling(text)

  console.log("misspelledCharacterRanges", misspelledCharacterRanges)
  
  var notes = annotationHelper(misspelledCharacterRanges, text)
  return {
    id: id,
    notes: notes
  }
}
