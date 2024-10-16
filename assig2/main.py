from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
app= Flask(__name__)
CORS(app)

timesteps="1d"
API_KEY = "XOqfWek85TE1R2UOftXMwodhVfThI98F"  # Replace with your actual API key
TOMORROW_API_URL = f"https://api.tomorrow.io/v4/timelines?location=42.3478%2C%20-71.0466&fields=temperature&units=metric&timesteps={timesteps}&startTime=now&endTime=nowPlus6h&apikey={API_KEY}"  # Replace with the actual API endpoint
@app.route("/",methods=['GET'])
def home():
    return app.send_static_file("index.html")


@app.route('/api/v1/tomorrow',methods=['GET'])
def tomorrow():
    FIELDS="temperature,sunriseTime,sunsetTime,temperatureApparent,temperatureMin,temperatureMax,windSpeed,windDirection,pressureSeaLevel,weatherCode,precipitationProbability,precipitationType,visibility,moonPhase,cloudCover,humidity,uvIndex"
    UNITS= "imperial"
    TIMESTEPS="1d,1h"
    TIMEZONE="America/Los_Angeles"
    #LOCATION_LAT_LONG='42.3478,-71.0466'
    LAT=request.args.get('lat')
    LONG=request.args.get('long')
    print(LAT)
    if LAT is None or LONG is None:
        return "Missing latitude or longitude", 400
    LOCATION_LAT_LONG=LAT + "," + LONG
    url=f"https://api.tomorrow.io/v4/timelines?location={LOCATION_LAT_LONG}&fields={FIELDS}&units={UNITS}&timesteps={TIMESTEPS}&startTime=now&timezone=America%2FLos_Angeles&apikey={API_KEY}"
    
    response = requests.get(url)
    #return response.text
    return response.text

if __name__ == "__main__":
    app.run(debug=True)
    
   
   
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
'''
    FIELDS="temperature,temperatureApparent,temperatureMin,temperatureMax,windSpeed,windDirection,pressureSeaLevel,weatherCode,precipitationProbability,precipitationType,visibility,moonPhase,cloudCover,humidity"

url = ""

headers = {
    "accept": "application/json",
    "Accept-Encoding": "gzip"
}

response = requests.get(url, headers=headers)

print(response.text)
    payload = {
    "location": "34.0223519, -118.285117",
    "fields": ["temperature"],
    "units": "imperial",
    "timesteps": ["1d"],
    "startTime": "now",
    "endTime": "nowPlus24h"
    }
    headers = {
    "accept": "application/json",
    "Accept-Encoding": "gzip",
    "content-type": "application/json"
    }

'''
