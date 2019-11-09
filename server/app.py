from flask import Flask
from flask import request
from flask_pymongo import PyMongo
from flask_cors import CORS
import os.path


app = Flask(__name__)
CORS(app, resources=r'/*')
app.config["MONGO_URI"] = "mongodb://yoda:theforce@0.0.0.0:27017/minecraftapp"
mongo = PyMongo(app)

from flask import Flask
import binascii
import struct
import requests
import json
from PIL import Image

def get_rgb_values(pixel_value):
    red = pixel_value%256
    pixel_value //= 256
    green = pixel_value%256
    pixel_value //= 256
    blue = pixel_value
    return [red,green,blue]

@app.route('/', methods=['GET'])
def hello():
    file = os.join(root_dir)
    return

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

if __name__ == "__main__":
    app.run(host="0.0.0.0", port="4000", debug=True)
