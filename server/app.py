from flask import Flask
from flask_pymongo import PyMongo

app = Flask(__name__)
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

@app.route('/')
def hello():
    return 'bop'

#minecraft block data
@app.route('/colors/')
def get_colors():
    mc_resp = requests.get('http://minecraft-ids.grahamedgecombe.com/items.json')
    block_data = json.loads(mc_resp.text)
    color_block = {} #stores blocks by their most prominent color
    count = 0
    for block in block_data:
        image = Image.open(f"static/{block['type']}-{block['meta']}.png")
        rgb = image.convert('RGB')

        histogram = {} # keep track of prominent pixels

        for i in range(0, 32): #block icons are 32x32
            for j in range(0, 32):
                pixel = rgb.getpixel((i, j))
                if pixel != (0,0,0):
                    pixel_val = pixel[0] + (256*pixel[1]) + (256*256*pixel[2]) #pixel value.. no longer rgb
                    if pixel_val in histogram:
                        histogram[pixel_val] += 1
                    else:
                        histogram[pixel_val] = 1
        if histogram:
            prominent_px = max(histogram, key = histogram.get) # most prominent pixel val for that block

            if prominent_px in color_block:
                color_block[prominent_px].append(block)
            else:
                color_block[prominent_px] = [block]

    # out = '<table><tr><th>color</th><th>blocks</th></tr>'
    # for k in color_block:
    #     out+=f'<tr><td>{k}</td><td><ul>'
    #     for block in color_block[k]:
    #         out+=f"<li><img src='/static/{block['type']}-{block['meta']}.png'/></li>"
    #     out+='</ul></td></tr>'
    #     print(k)
    # out += '</table>'

    out = ""
    pixels = []
    image = Image.open('static/17-1.png')
    rgb_im = image.convert('RGB')

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

    px_vals = list(color_block.keys())
    for pixel in scheme['result']:
        pixel_val = pixel[0] + (256*pixel[1]) + (256*256*pixel[2]) #pixel value.. no longer rgb
        if pixel_val in block:
            block = color_block[pixel_val]
            out+= f"<img src='/static/{block['type']}-{block['meta']}.png' style='border:2px solid {'#%02x%02x%02x' % tuple(get_rgb_values(pixel_val))}'/>"
        else:
            #find key closest...
            closest = px_vals[min(range(len(px_vals)), key = lambda i: abs(px_vals[i]-pixel_val))]
            block = color_block[closest]
            out+= f"<p style='background-color:{'#%02x%02x%02x' % tuple(get_rgb_values(pixel_val))}'><img src='/static/{block[0]['type']}-{block[0]['meta']}.png'/></p>"


    return out

if __name__ == "__main__":
    app.run(host="0.0.0.0", port="4000", debug=True)
