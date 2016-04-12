module.exports =
class AnnotationMarkers {
  constructor (editor) {
    this._markers = []
    this._decorations = []
    this._editor = editor
  }

  /** See TextEditor::markBufferRange */
  markBufferRange() {
    var marker = this._editor.markBufferRange.apply(this._editor, arguments)
    // store marker for removal
    this._markers.push(marker)
    return marker
  }

  /** See TextEditor::decorateMarker */
  decorateMarker() {
    var decoration = this._editor.decorateMarker.apply(this._editor, arguments)
    // store decoration for removal
    this._decorations.push(decoration)
    return decoration
  }

  destroy () {
    var marker, decoration
    while (decoration = this._decorations.pop()) {
      decoration.destroy()
    }
    while (marker = this._markers.pop()) {
      marker.destroy()
    }
  }
}
