/// <reference path="../typings/main.d.ts"/>
var AnnotationView, annotationViews;

annotationViews = {}

AnnotationView = null

module.exports = {
  activate: function () {

    // Set up the command subscription for toggle
    this.commandSubscription = atom.commands.add('atom-workspace', {
      'annotation-test:toggle': () => {
        console.log("TOGGLE", this)
        this.toggle()
      }
    })

    this.viewsByEditor = new WeakMap

    this.disposable = atom.workspace.observeTextEditors((editor) => {
      var editorId, spellCheckView
      if (AnnotationView == null) {
        AnnotationView = require('./annotation-view')
      }
      annotationView = new AnnotationView(editor)
      editorId = editor.id
      annotationViews[editorId] = {}
      annotationViews[editorId]['view'] = annotationView
      annotationViews[editorId]['active'] = true
      this.viewsByEditor.set(editor, annotationView)
    })
  },

  misspellingMarkersForEditor: function(editor) {
    return this.viewsByEditor.get(editor).markerLayer.getMarkers()
  },

  deactivate: function() {
    this.commandSubscription.dispose()
    this.commandSubscription = null
    return this.disposable.dispose()
  },

  toggle: function() {
    var editorId
    editorId = atom.workspace.getActiveTextEditor().id
    if (spellCheckViews[editorId]['active']) {
      spellCheckViews[editorId]['active'] = false
      return spellCheckViews[editorId]['view'].unsubscribeFromBuffer()
    } else {
      spellCheckViews[editorId]['active'] = true
      return spellCheckViews[editorId]['view'].subscribeToBuffer()
    }
  }
}
