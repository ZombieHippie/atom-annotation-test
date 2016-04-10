/// <reference path="../typings/main.d.ts"/>
var Task, idCounter

Task = require('atom').Task

var idCounter = 0
var callbacksById = {}
var task = null

var dispatchNotes = function(arg) {
  var id = arg.id
  var notes = arg.notes
  return typeof callbacksById[id] === "function" ? callbacksById[id](notes) : void 0
}

module.exports =
class AnnotationTask  {
  constructor () {
    this.id = idCounter++
  }

  terminate () {
    delete callbacksById[this.id]
    if (Object.keys(callbacksById).length === 0) {
      if (task != null) {
        task.terminate()
      }
      return task = null
    }
  }

  start (text) {
    var base, ref
    if (task == null) {
      task = new Task(require.resolve('./annotation-handler'))
    }
    return (ref = task) != null ? ref.start({
      id: this.id,
      text: text
    }, dispatchNotes) : void 0
  }

  onDidAnnotation (callback) {
    return callbacksById[this.id] = callback
  }
}
