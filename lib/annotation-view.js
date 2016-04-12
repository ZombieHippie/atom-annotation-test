/// <reference path="../typings/main.d.ts"/>
var _ = require('underscore-plus')

var CompositeDisposable = require('atom').CompositeDisposable

var AnnotationTask = require('./annotation-task')
var AnnotationMarkers = require('./annotation-markers')

const COLOR_MAX = Math.pow(16, 6)

module.exports =
class AnnotationView {
  constructor(editor) {
    this.editor = editor
    this.disposables = new CompositeDisposable
    this.initializeMarkerLayer()

    this.task = new AnnotationTask()

    this.task.onDidAnnotation((notes) => {
      this.destroyMarkers()
      if (this.buffer != null) {
        this.addMarkers(notes)
      }
    })

    // Update whether we are listening based on the events:
    {
      this.disposables.add(this.editor.onDidChangePath(() => this.subscribeToBuffer()))

      this.disposables.add(this.editor.onDidChangeGrammar(() => this.subscribeToBuffer()))

      this.disposables.add(atom.config.onDidChange(
        'editor.fontSize',
        () => this.subscribeToBuffer()
      ))

      this.disposables.add(atom.config.onDidChange(
        'annotation-test.grammars',
        () => this.subscribeToBuffer()
      ))

      this.subscribeToBuffer()
      
      this.disposables.add(this.editor.onDidDestroy(this.destroy.bind(this)))
    }
  }

  static content () {
    return this.div({
      "class": 'annotation-test'
    })
  }

  initializeMarkerLayer () {
    this.markers = new AnnotationMarkers(this.editor)
  }

  destroy () {
    this.unsubscribeFromBuffer()
    this.disposables.dispose()
    this.task.terminate()
    this.markers.destroy()
  }

  unsubscribeFromBuffer () {
    this.destroyMarkers()
    if (this.buffer != null) {
      this.bufferDisposable.dispose()
      this.buffer = null
    }
  }

  subscribeToBuffer () {
    this.unsubscribeFromBuffer()
    if (this.annotateCurrentGrammar()) {
      this.buffer = this.editor.getBuffer()
      this.bufferDisposable = this.buffer.onDidStopChanging(() => this.updateAnnotations())

      return this.updateAnnotations()
    }
  }

  /** returns whether or not we should annotate this view */
  annotateCurrentGrammar () {
    var grammar = this.editor.getGrammar().scopeName
    return _.contains(atom.config.get('annotation-test.grammars'), grammar)
  }

  destroyMarkers () {
    this.markers.destroy()
    this.initializeMarkerLayer()
  }

  addMarkers (notes) {
    var i, len, note, results
    results = []
    for (i = 0, len = notes.length; i < len; i++) {
      note = notes[i]
      var marker = this.markers.markBufferRange(note, {
        invalidate: 'touch'
      })
      var noteEl = document.createElement("div")
      noteEl.style.height = "1.5em"
      noteEl.style.width = "100%"
      noteEl.style.display = "block"
      noteEl.style.backgroundColor = "rgba(255,255,255,0.3)"
      noteEl.addEventListener("click", function (event) {
        this.style.backgroundColor = "#" + Math.floor(Math.random() * COLOR_MAX).toString(16)
        event.stopImmediatePropagation()
        return false
      })
      this.markers.decorateMarker(marker, {
        type: 'block',
        position: 'after',
        item: noteEl
      })
    }
  }

  updateAnnotations () {
    var error, ref
    try {
      this.task.start(this.buffer.getText())
    } catch (_error) {
      error = _error
      console.warn('Error starting annotation task', (ref = error.stack) != null ? ref : error)
    }
  }

  getCorrections (marker) {
    console.log("getCorrections", marker)
  }
}
