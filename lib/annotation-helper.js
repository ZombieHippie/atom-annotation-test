
/** charRanges: []{ start: number, end: number, data: any }
  * return [][
    start: [row: number, col: number],
    end: [row: number, col: number],
    data: any
  ]
  */
module.exports =
function ApplyToLines (charRanges, text) {
  var row = 0
  var rangeIndex = 0
  var characterIndex = 0
  var notes = []
  while (characterIndex < text.length && rangeIndex < charRanges.length) {
    var lineBreakIndex = text.indexOf('\n', characterIndex)
    if (lineBreakIndex === -1) {
      lineBreakIndex = Infinity
    }
    while (true) {
      var range = charRanges[rangeIndex]
      if (range && range.start < lineBreakIndex) {
        notes.push([[row, range.start - characterIndex], [row, range.end - characterIndex], range.data])
        rangeIndex++
      } else {
        break;
      }
    }
    characterIndex = lineBreakIndex + 1
    row++
  }
  return notes
}