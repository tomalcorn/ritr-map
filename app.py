from flask import Flask, send_file, jsonify, request
import json

app = Flask(__name__)

# Store sticker positions in memory (we'll use a file later)
sticker_positions = []

@app.route('/')
def home():
    return send_file('index.html')

@app.route('/add_sticker', methods=['POST'])
def add_sticker():
    data = request.json
    sticker_positions.append(data)
    return jsonify({"success": True})

@app.route('/get_stickers')
def get_stickers():
    return jsonify(sticker_positions)

@app.route('/update_planet', methods=['POST'])
def update_planet():
    data = request.json
    print('Received data:', data)  # Debug log
    with open('static/planets.json', 'r') as f:
        planets = json.load(f)
    
    if data['planet'] in planets:
        planets[data['planet']]['status'] = data['status']
    
    with open('static/planets.json', 'w') as f:
        json.dump(planets, f, indent=2)
    
    return jsonify({"success": True})

@app.route('/update_sector_data', methods=['POST'])
def update_sector_data():
    data = request.json
    print('Received data:', data)  # Debug log
    with open('static/sector_data.json', 'r') as f:
        sectors = json.load(f)
    
    faction = data.get('faction')
    sector = data.get('sector')
    status = data.get('status')
    
    if faction in sectors and sector in sectors[faction]:
        sectors[faction][sector]['status'] = status
    
    with open('static/sector_data.json', 'w') as f:
        json.dump(sectors, f, indent=2)
    
    return jsonify({"success": True})

# Store lock state (default: unlocked)
lock_state = {"locked": False}

@app.route('/update-lock', methods=['POST'])
def update_lock():
    global lock_state
    data = request.json
    lock_state["locked"] = data.get("locked", False)
    return jsonify(lock_state)

@app.route('/get-lock', methods=['GET'])
def get_lock():
    return jsonify(lock_state)

if __name__ == '__main__':
    app.run(debug=True)