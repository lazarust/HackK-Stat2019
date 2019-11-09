from flask import Flask
import requests
import json
import random
from PIL import Image
import os

app = Flask(__name__)

#minecraft block data
@app.route('/')
def get_colors():
    mc_resp = requests.get('http://minecraft-ids.grahamedgecombe.com/items.json')
    block_data = json.loads(mc_resp.text)

    print(block_data)
    for icon in os.listdir('items'):
        pass

    image = Image.open('items/17-1.png')
    rgb_im = image.convert('RGB')

    pixels = []

    for i in range(0, 32):
        for j in range(0, 32):
            pixel = rgb_im.getpixel((i, j))
            if pixel != (0,0,0):
                r, g, b = pixel
                pixels.append([r, g, b])
    pixels.extend(["N", "N", "N"])

    data = {
    	'model':"default",
    	'input':pixels
    }

    url = "http://colormind.io/api/"

    resp = requests.post(url=url, data=json.dumps(data))
    scheme = json.loads(resp.text)

    out = ""

    for px in scheme['result']:
        hex = '#%02x%02x%02x' % tuple(px)
        out += f"<p style='background-color:{hex}'>h</p>"

    return out
