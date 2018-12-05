import json
import html

import bottle
import eventlet
import eventlet.wsgi

import levels


@bottle.route('/')
def index():
    return bottle.static_file("index.html", root="")

@bottle.route('/gameInterface.js')
def interface():
    return bottle.static_file("gameInterface.js", root="")

@bottle.route('/gameModel.js')
def model():
    return bottle.static_file("gameModel.js", root="")

@bottle.route('/level/<number>')
def level(number='1'):
    try:
        number = int(number)
    except ValueError:
        number = 1
    return json.dumps(levels.getLevel(number))


# host all assets at paths equal to their filenames
@bottle.route('/<file>')
def static(file):
    return bottle.static_file("assets/" + file, root="")


eventlet.wsgi.server(eventlet.listen(('', 8080)), bottle.default_app())

