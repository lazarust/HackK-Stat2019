from flask import Flask
from flask import request
from flask_pymongo import PyMongo
from flask_cors import CORS
import os.path
import binascii
import struct
import requests
import json
import os
import numpy as np
import pandas as pd
from PIL import Image
import operator

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://yoda:theforce@0.0.0.0:27017/minecraftapp"
mongo = PyMongo(app)
ROOTDIR = os.path.dirname(os.path.abspath(__file__))
cors = CORS(app)

ground_attack_types = ['Jab 1', 'Jab 2', 'Jab 3', 'Forward Tilt',
                       'Up Tilt', 'Down Tilt', 'Dash Attack',
                       'Forward Smash', 'Up Smash', 'Down Smash']

def get_character_from_json(character):
    f = open('characters.json', 'r')
    characters = json.load(f)
    for c in characters:
        if str(c).lower() == str(character).lower():
            character = characters[c] # control is now json for posted character
    return character

def get_all_characters():
    f = open('characters.json', 'r')
    characters = json.load(f)
    return characters

def get_characters(control_name, opponent_name):
    control = get_character_from_json(control_name)
    opponent = get_character_from_json(opponent_name)

    cga = [ga for ga in control['ground_attacks']]
    oga = [ga for ga in opponent['ground_attacks']]
    results = {}

    cga_df = pd.DataFrame(cga)
    oga_df = pd.DataFrame(oga)

    if cga_df.shape[0] > oga_df.shape[0]:
        control_moves = list(cga_df['movename'])
        opponent_moves = list(oga_df['movename'])
        removed = False
        for move in control_moves:
            if move not in opponent_moves:
                print(move)
                cga_df = cga_df[cga_df.movename != move]

    cga_df = cga_df.reset_index(drop=True)

    if cga_df.shape[0] < oga_df.shape[0]:
        control_moves = list(cga_df['movename'])
        opponent_moves = list(oga_df['movename'])

        for move in opponent_moves:
            if move not in control_moves:
                print(move)
                oga_df = oga_df[oga_df.movename != move]

    oga_df = oga_df.reset_index(drop=True)

    #check diff again lol
    if cga_df.shape[0] > oga_df.shape[0]:
        control_moves = list(cga_df['movename'])
        opponent_moves = list(oga_df['movename'])
        removed = False
        for move in control_moves:
            if move not in opponent_moves:
                print(move)
                cga_df = cga_df[cga_df.movename != move]

    cga_df = cga_df.reset_index(drop=True)

    return[cga_df[['movename', 'totalframes', 'activeframes']], oga_df[['movename', 'totalframes', 'activeframes']]]

def compare(attack_set):
    control = attack_set[0]
    opponent = attack_set[1]

    control['win'] = np.where(control.totalframes < opponent.totalframes, 'yes', 'no')
    control['diff'] = np.where(control.totalframes != opponent.totalframes, control.totalframes.astype(int) - opponent.totalframes.astype(int), 0)

    return control.to_json()

@app.route('/threats/', methods=['GET'])
def weakest_strongest():
    control_name = request.args.get('control')
    char_power = {}
    for c in get_all_characters():
        if str(c).lower() != control_name:
            resp = 0
            try:
                resp = compare(get_characters(control_name, str(c).lower()))
                char_power[c] = sum(json.loads(resp)['diff'].values())
            except:
                break

    char_power = sorted(char_power.items(), key=operator.itemgetter(1))
    return json.dumps({'weakest':char_power[0], 'strongest':char_power[len(char_power) - 1]})

@app.route('/compare/', methods=['GET'])
def get_battle():
    control_name = request.args.get('control')
    opponent_name = request.args.get('opponent')
    #look for character in dataset somehow..
    return(compare(get_characters(control_name, opponent_name)))

def get_rgb_values(pixel_value):
    red = pixel_value%256
    pixel_value //= 256
    green = pixel_value%256
    pixel_value //= 256
    blue = pixel_value
    return [red,green,blue]

@app.route('/', methods=['GET'])
def hello():
    return 'boop'

#minecraft block data
@app.route('/colors/', methods=['GET'])
def get_colors():
    f = open('new.json', 'r')
    blocks = json.load(f)
    color_block = {}

    for block in blocks:
        color = block['color']
        if color is not None:
            if color in color_block:
                color_block[color].append(block)
            else:
                color_block[color] = [block]

    out = f"<img src='/static/17-1.png'/><br/>"
    pixels = []
    block_info = request.args.get('block')
    image = Image.open(f'static/{block_info}.png')
    rgb_im = image.convert('RGBA')

    for i in range(0, 32):
        for j in range(0, 32):
            pixel = rgb_im.getpixel((i, j))
            if pixel != (0,0,0,0):
                r, g, b, a = pixel
                pixels.append([r, g, b])
    pixels.extend(["N", "N", "N"])

    data = {
    	'model':"default",
    	'input':pixels
    }

    url = "http://colormind.io/api/"

    resp = requests.post(url=url, data=json.dumps(data))
    scheme = json.loads(resp.text)

    px_vals = list(color_block.keys())
    json_response = {}

    for pixel in scheme['result']:
        pixel_val = (pixel[0]) + (256*pixel[1]) + (256*256*pixel[2]) #pixel value.. no longer rgb
        if pixel_val in block:
            block = color_block[pixel_val]
            out+= f"<img src='/static/{block['type']}-{block['meta']}.png' style='border:2px solid {'#%02x%02x%02x' % tuple(get_rgb_values(pixel_val))}'/>"
        else:
            #find key closest...
            closest = px_vals[min(range(len(px_vals)), key = lambda i: abs(px_vals[i]-pixel_val))]
            block = color_block[closest]
            out+= f"<p style='background-color:{'#%02x%02x%02x' % tuple(get_rgb_values(closest))}'><img src='/static/{block[0]['type']}-{block[0]['meta']}.png'/></p>"

        json_response[f"{block[0]['type']}-{block[0]['meta']}"] = '#%02x%02x%02x' % tuple(get_rgb_values(pixel_val))

    return json.dumps(json_response)

def get_blocks_dict():
    blocks_list = []
    for dir, subdir, files in os.walk(os.path.join(ROOTDIR, 'api/static')):
        for fname in files:
            new_block = {
                'name': fname.replace('.png', ''),
                'path': f'api/static/{fname}'
            }
            image = Image.open(os.path.join(ROOTDIR, new_block['path']))
            rgbify = image.convert('RGB') # TODO: Get me the pixels pls
            new_block['color'] = rgbify
            blocks_list.append(new_block)
    blocks = mongo.blocks
    blocks.insert(blocks_list)

if __name__ == "__main__":
 app.run(host="0.0.0.0", port="4000", debug=True)
