let maindata = {};
let hourlydata={};
let coordinatesForChart=[]
let count = 0;
const stateDictionary = {
    "Alabama": "AL",
    "Alaska": "AK",
    "Arizona": "AZ",
    "Arkansas": "AR",
    "California": "CA",
    "Colorado": "CO",
    "Connecticut": "CT",
    "Delaware": "DE",
    "District Of Columbia": "DC",
    "Florida": "FL",
    "Georgia": "GA",
    "Hawaii": "HI",
    "Idaho": "ID",
    "Illinois": "IL",
    "Indiana": "IN",
    "Iowa": "IA",
    "Kansas": "KS",
    "Kentucky": "KY",
    "Louisiana": "LA",
    "Maine": "ME",
    "Maryland": "MD",
    "Massachusetts": "MA",
    "Michigan": "MI",
    "Minnesota": "MN",
    "Mississippi": "MS",
    "Missouri": "MO",
    "Montana": "MT",
    "Nebraska": "NE",
    "Nevada": "NV",
    "New Hampshire": "NH",
    "New Jersey": "NJ",
    "New Mexico": "NM",
    "New York": "NY",
    "North Carolina": "NC",
    "North Dakota": "ND",
    "Ohio": "OH",
    "Oklahoma": "OK",
    "Oregon": "OR",
    "Pennsylvania": "PA",
    "Rhode Island": "RI",
    "South Carolina": "SC",
    "South Dakota": "SD",
    "Tennessee": "TN",
    "Texas": "TX",
    "Utah": "UT",
    "Vermont": "VT",
    "Virginia": "VA",
    "Washington": "WA",
    "West Virginia": "WV",
    "Wisconsin": "WI",
    "Wyoming": "WY"
};

const weatherCodeMapping = {
    1000: {
        status: "Clear",
        image: "static/Images/Weather Symbols for Weather Codes/clear_day.svg"
    },
    1100: {
        status: "Mostly Clear",
        image: "static/Images/Weather Symbols for Weather Codes/mostly_clear_day.svg"
    }, 1101: {
        status: "Partly Cloudy",
        image: "static/Images/Weather Symbols for Weather Codes/partly_cloudy_day.svg"
    }, 1102: {
        status: "Mostly Cloudy",
        image: "static/Images/Weather Symbols for Weather Codes/mostly_cloudy.svg"
    }, 1001: {
        status: "Cloudy",
        image: "static/Images/Weather Symbols for Weather Codes/cloudy.svg"
    }, 2000: {
        status: "Fog",
        image: "static/Images/Weather Symbols for Weather Codes/fog.svg"
    }, 2100: {
        status: "Light Fog",
        image: "static/Images/Weather Symbols for Weather Codes/fog_light.svg"
    }, 8000: {
        status: "Thunderstorm",
        image: "static/Images/Weather Symbols for Weather Codes/tstorm.svg"
    }, 5001: {
        status: "Flurries",
        image: "static/Images/Weather Symbols for Weather Codes/flurries.svg"
    }, 5100: {
        status: "Light Snow",
        image: "static/Images/Weather Symbols for Weather Codes/snow_light.svg"
    }, 5000: {
        status: "Snow",
        image: "static/Images/Weather Symbols for Weather Codes/snow.svg"
    }, 5101: {
        status: "Heavy Snow",
        image: "static/Images/Weather Symbols for Weather Codes/snow_heavy.svg"
    }, 7102: {
        status: "Light Ice Pellets",
        image: "static/Images/Weather Symbols for Weather Codes/ice_pellets_light.svg"
    }, 7000: {
        status: "Ice pellets",
        image: "static/Images/Weather Symbols for Weather Codes/ice_pellets.svg"
    }, 7101: {
        status: "Heavy Ice Pellets",
        image: "static/Images/Weather Symbols for Weather Codes/ice_pellets_heavy.svg"
    }, 4000: {
        status: "Drizzle",
        image: "static/Images/Weather Symbols for Weather Codes/drizzle.svg"
    }, 6000: {
        status: "Freezing Drizzle",
        image: "static/Images/Weather Symbols for Weather Codes/freezing_drizzle.svg"
    }, 6200: {
        status: "Light Freezing Rain",
        image: "static/Images/Weather Symbols for Weather Codes/freezing_light_rain.svg"
    }, 6001: {
        status: "Freezing Rain",
        image: "static/Images/Weather Symbols for Weather Codes/freezing_rain.svg"
    }, 6201: {
        status: "Heavy Freezing Rain",
        image: "static/Images/Weather Symbols for Weather Codes/freezing_rain_heavy.svg"
    }, 4200: {
        status: "Light Rain",
        image: "static/Images/Weather Symbols for Weather Codes/rain_light.svg"
    }, 4001: {
        status: "Rain",
        image: "static/Images/Weather Symbols for Weather Codes/rain.svg"
    }, 4201: {
        status: "Heavy Rain",
        image: "static/Images/Weather Symbols for Weather Codes/rain_heavy.svg"
    },
}
//if checkbox is checked then disable other fields
function checker() {
    console.log("checker() is called");
    const checkbox = document.getElementById("autofill");
    const inputs = [document.getElementById('street'), document.getElementById('city'), document.getElementById('state')];
    checkbox.addEventListener('change', function () {
        if (this.checked) {
            // Reset and disable other input fields
            inputs.forEach(input => {
                console.log(input);
                input.value = '';      // Reset the input value
                input.disabled = true; // Disable the input field
                input.classList.add('disabled'); // Add disabled styling
            });
        } else {
            // Enable input fields if checkbox is unchecked
            inputs.forEach(input => {
                input.disabled = false; // Enable the input field
                input.classList.remove('disabled'); // Remove disabled styling
            });
        }
    });
}
async function getCoordinateByState(state) {
    console.log(state);
    const apiKey = 'AIzaSyDHEr213qARbTv1YdIFeeRQaRvhYw8rbrY';
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${state}&key=${apiKey}`
    console.log('url',url);
    const response = await fetch(url, {
        method: 'GET',
    });
    const data = await response.json();
    console.log(data);
    const a = data.results[0].geometry['location']
    const lat_long = `${a.lat},${a.lng}`
    console.log(lat_long);
    coordinatesForChart=[a.lng,a.lat,25];
    displayGeoData(data);
    callBackEnd(lat_long);
}
async function getIPInfo() {
    let state = document.getElementById("state").value;
    let city = document.getElementById("city").value;
    let street = document.getElementById("street").value;
    try {
        console.log("getIPInfo() is called");
        const checkbox = document.getElementById("autofill");

        if (checkbox.checked) {
            console.log('Checkbox is checked');
            const response = await fetch('https://ipinfo.io/?token=e88658ecaf5d2e');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            //document.getElementById('output').textContent = JSON.stringify(data, null, 2);
            console.log("getIPInfo()", data);
            console.log("getIPInfo()", data['loc']);
            const tomorrowApiResponse = callBackEnd(data['loc']);
            console.log(tomorrowApiResponse);
            displayIPInfoData(data, tomorrowApiResponse);

        }
        else if (state.length >= 2 && city.trim() !== "" && street.trim() !== "") {
            console.log("hello")
            /*stateList = state.split(' '); cityList = city.split(' '); streetList = street.split(' ');
            let newState = ''; let newCity = ''; let newStreet = '';
            for (const a of stateList) {
                newState += a;
                //newState += '+';
            }
            for (const a of cityList) {
                newCity += a;
                //newCity += '+';
            }
            for (const a of streetList) {
                newStreet += a;
                //newStreet += '+';
            }
            state = newState.slice(0, -1); city = newCity.slice(0, -1); street = newStreet.slice(0, -1);
            */
            //console.log(state);console.log(city);console.log(street);12ddd34+W+29th+St+CA
            const apiKey = 'AIzaSyDHEr213qARbTv1YdIFeeRQaRvhYw8rbrY';
            //const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${street}+${city}+${stateDictionary[state]}&key=${apiKey}`
            const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${street}+${city}+${state}&key=${apiKey}`
            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    console.log(response);
                    return response.json();
                })
                .then(data => {
                    if (data.status === 'OK') {
                        const a = data.results[0].geometry['location'];
                        const lat_long = `${a.lat},${a.lng}`;
                        coordinatesForChart=[a.lng,a.lat,25];
                        console.log(lat_long);
                        callBackEnd(lat_long);
                        //console.log(tomorrowApiResponse);
                        displayGeoData(data);

                    } else if (data.status === 'ZERO_RESULTS') {
                        getCoordinateByState(state);
                    }
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                });

        }
        else {
            console.log('Checkbox is unchecked');


        }


    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        document.getElementById('output').textContent = 'Error fetching IP information.';
    }

}

async function callBackEnd(lat_long) {
    console.log(`callBackend() is called: ${lat_long}`);
    coordinates = lat_long.split(',');
    const LAT = coordinates[0];
    const LONG = coordinates[1];
    coordinatesForChart=[LONG,LAT,25];
    //backend
    //document.getElementById('greetButton').addEventListener('click', async () => {
    //const name = document.getElementById('nameInput').value;
    const response = await fetch(`http://127.0.0.1:5001/api/v1/tomorrow?lat=${LAT}&long=${LONG}`, {
        method: 'GET',
    });
    const data = await response.json();
    console.log(data);
    //console.log(data['data']['timelines'][0]);
    maindata = data['data']['timelines'][0];
    hourlydata=data['data']['timelines'][1];
    console.log('hourly:',data['data']['timelines'][1]);
    displayTomorrowApiData(data['data']['timelines'][0]);
    //return data;
}

function displayGeoData(data) {
    document.getElementById('temp-card-heading').textContent = data.results[0].formatted_address;

}
function displayIPInfoData(data) {
    document.getElementById('temp-card-heading').textContent = data.city + ", " + data.region;

}
function convertDate(d) {
    const date = new Date(d);
    // Manually format the components
    //const options = { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit' };
    //const formattedDate = date.toLocaleDateString('en-GB', options);
    // Replace the first space with a comma for proper formatting
    //const finalOutput = formattedDate.replace(/^(.*?)(\s.*)$/, "$1,$2");
    //return finalOutput;
    //console.log(finalOutput);

    // Options for formatting
    const options = { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' };

    // Get the formatted date
    const formattedDate = date.toLocaleDateString('en-GB', options);

    // Replace the full month name with the abbreviated version
    const finalOutput = formattedDate.replace(/([A-Za-z]+) ([0-9]{2}) ([0-9]{4})/, (match, dayName, dayNumber, year) => {
        return `${dayName}, ${dayNumber} ${date.toLocaleString('en-GB', { month: 'short' })} ${year}`;
    });
    return finalOutput;
}
function displayTomorrowApiData(data) {

    console.log("uiui");
    const weatherCode = data.intervals[0]['values']['weatherCode'];
    document.getElementById("temp-card-logo").setAttribute("src", weatherCodeMapping[weatherCode]['image']);
    document.getElementById('first-container').style.display = 'block';
    document.getElementById('temp-card-celsius').textContent = data.intervals[0]['values']['temperature'];
    document.getElementById('humidity-value').textContent = `${data.intervals[0]['values']['humidity']}%`;
    document.getElementById('pressure-value').textContent = `${data.intervals[0]['values']['pressureSeaLevel']}inHg`;
    document.getElementById('windspeed-value').textContent = `${data.intervals[0]['values']['windSpeed']}mph`;
    document.getElementById('visibility-value').textContent = `${data.intervals[0]['values']['visibility']}mi`;
    document.getElementById('cloudCover-value').textContent = `${data.intervals[0]['values']['cloudCover']}%`;
    document.getElementById('uvlevel-value').textContent = data.intervals[0]['values']['uvIndex'];
    let dateArr = document.getElementsByClassName('horizbars-text');
    let imageArr = document.getElementsByClassName('horizbars-image');
    let statusArr = document.getElementsByClassName('status_col');
    let tempHighArr = document.getElementsByClassName('temp-low_col');
    let tempLowArr = document.getElementsByClassName('temp-high_col');
    let windspeedArr = document.getElementsByClassName('windspeed-col');

    //fetching backend values in array
    let fetchedDate = [];
    for (let i = 0; i < data.intervals.length; i++) {
        fetchedDate.push(convertDate(data.intervals[i]['startTime']));
    }
    //console.log(fetchedDate);
    let fetchedStatusArr = [];
    for (let i = 0; i < data.intervals.length; i++) {
        fetchedStatusArr.push(weatherCodeMapping[data.intervals[i]['values']['weatherCode']]['status']);
    }
    let fetchedHighTemp = [];
    for (let i = 0; i < data.intervals.length; i++) {
        fetchedHighTemp.push(data.intervals[i]['values']['temperatureMax']);
    }
    let fetchedLowTemp = [];
    for (let i = 0; i < data.intervals.length; i++) {
        fetchedLowTemp.push(data.intervals[i]['values']['temperatureMin']);
    }
    let fetchedWindSpeed = [];
    for (let i = 0; i < data.intervals.length; i++) {
        fetchedWindSpeed.push(data.intervals[i]['values']['windSpeed']);
    }


    for (let i = 0; i < imageArr.length; i++) {
        imageArr[i].setAttribute("src", weatherCodeMapping[data.intervals[i]['values']['weatherCode']]['image'])
    }
    for (let i = 0; i < dateArr.length; i++) {
        dateArr[i].innerHTML = fetchedDate[i].replace(/ /, ', ');
    }
    for (let i = 0; i < statusArr.length; i++) {
        statusArr[i].innerHTML = fetchedStatusArr[i];
    }
    for (let i = 0; i < tempHighArr.length; i++) {
        tempHighArr[i].innerHTML = fetchedHighTemp[i];
    }
    for (let i = 0; i < tempLowArr.length; i++) {
        tempLowArr[i].innerHTML = fetchedLowTemp[i];
    }
    for (let i = 0; i < windspeedArr.length; i++) {
        windspeedArr[i].innerHTML = fetchedWindSpeed[i];
    }


    // const dateString = data.intervals[0]['startTime'];




}

// Add event listener to the button
//document.getElementById('fetchButton').addEventListener('click', getIPInfo);
const apiKey = 'AIzaSyDHEr213qARbTv1YdIFeeRQaRvhYw8rbrY'; // Replace with your actual API key
const address = 'University of Southern California, CA';
//document.getElementById('getLocation').addEventListener('click', () => {
    //const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    //const url = `https://maps.googleapis.com/maps/api/geocode/json?address=University+of+Southern+California+CA&key=AIzaSyDHEr213qARbTv1YdIFeeRQaRvhYw8rbrY`

//});
// Function to convert and format time
function formatTime(utcTime, timezone) {
    // Create a Date object from the UTC time
    const date = new Date(utcTime);

    // Use Intl.DateTimeFormat to convert to the desired timezone and format
    const options = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        timeZone: timezone,
    };

    return new Intl.DateTimeFormat('en-US', options).format(date);
}
function displayDailyWeatherDetails(index) {
    document.getElementById('first-container').style.display = 'none';
    document.getElementById('second-container').style.display = 'block';
    let date=convertDate(maindata.intervals[index]['startTime']);
    
    document.getElementById('second-container-date').textContent=date.replace(/ /, ', ');
    const weatherCode = maindata.intervals[index]['values']['weatherCode'];
    document.getElementById('second-container-status').textContent=weatherCodeMapping[weatherCode]['status'];
    document.getElementById('second-container-temp').textContent=`${maindata.intervals[index]['values']['temperatureMax']}°F/${maindata.intervals[index]['values']['temperatureMin']}°F`;
    document.getElementById("weather-image").setAttribute("src", weatherCodeMapping[weatherCode]['image']);
    let precipitationTypeMapping = {
        0: "N/A",
        1: "Rain",
        2: "Snow",
        3: "Freezing Rain",
        4: "Ice Pellets",
    };
    // Use requestAnimationFrame to ensure the display change is applied
    window.scrollTo(0, document.body.scrollHeight);
    const arr = document.getElementsByClassName('second-container-secondHalf1');
    let temp = [];
    temp.push(precipitationTypeMapping[maindata.intervals[index]['values']['precipitationType']]);
    temp.push(`${maindata.intervals[index]['values']['precipitationProbability']}%`);
    temp.push(`${maindata.intervals[index]['values']['windSpeed']}mph`);
    temp.push(`${maindata.intervals[index]['values']['humidity']}%`);
    temp.push(`${maindata.intervals[index]['values']['visibility']}mi`);
    //temp.push(`${maindata.intervals[index]['values']['sunrise']}%`);
    const sunriseTime = maindata.intervals[index]['values']['sunriseTime'];
    const sunsetTime = maindata.intervals[index]['values']['sunsetTime'];

    //Convert to Los Angeles time
    const losAngelesTimezone = "America/Los_Angeles";
    const formattedSunrise = formatTime(sunriseTime, losAngelesTimezone);
    const formattedSunset = formatTime(sunsetTime, losAngelesTimezone);

    console.log(`Sunrise: ${formattedSunrise}`); // Output: Sunrise: 3:51 AM
    console.log(`Sunset: ${formattedSunset}`);   // Output: Sunset: 9:10 PM
    temp.push(`${formattedSunrise}/${formattedSunset}`);
    for (let i = 0; i < arr.length; i++) {
        arr[i].innerHTML = temp[i];
    }
    console.log(temp);
    console.log(weatherCodeMapping[weatherCode]['image']);

}
function convertToUTC(isoDates) {
    return isoDates.map(isoDate => {
        // Create a new Date object from the ISO 8601 string
        const date = new Date(isoDate);
        
        // Return the UTC timestamp using Date.UTC
        return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 
                        date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    });
}

function makeChartsVisible() {

    count++; // Increment the counter
    if (count % 2 == 1) {
        const section = document.getElementById("charts-container");
        section.style.display = 'block'; 
        //change style of vbutton
        const element = document.getElementById('Vbutton');
        element.style.transform = 'rotate(-270deg)';
        // Use requestAnimationFrame to ensure the display change is applied
        requestAnimationFrame(() => {
            const offset = section.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
                top: offset - 50, // Adjust to move the section up slightly
                behavior: 'smooth' // Smooth scrolling
            });
        });
        //need array of UTC Dates to pass to High Charts:
        let ISODates=[];
        console.log(maindata);
        for(let i=0;i<=5;i++){
            ISODates.push(maindata.intervals[i]['startTime']);

        }
        let utcTimestamps = convertToUTC(ISODates);// i get array of utc dates
        let result=[]
        for(let i=0;i<=5;i++){
            result.push([utcTimestamps[i],maindata.intervals[i]['values']['temperatureMin'],maindata.intervals[i]['values']['temperatureMax'] ]);
        }
        console.log(result);
        
        

        /*const data = [
            [Date.UTC(2024, 9, 11), 10, 15], // Day 1: Min 10°C, Max 15°C
            [Date.UTC(2024, 9, 12), 12, 18], // Day 2: Min 12°C, Max 18°C
            [Date.UTC(2024, 9, 13), 14, 20], // Day 3: Min 14°C, Max 20°C
            [Date.UTC(2024, 9, 14), 11, 17], // Day 4: Min 11°C, Max 17°C
            [Date.UTC(2024, 9, 15), 13, 19]  // Day 5: Min 13°C, Max 19°C
        ];*/
        Highcharts.chart('container1', {
            chart: {
                type: 'arearange',
                zooming: {
                    type: 'x'
                },
                scrollablePlotArea: {
                    minWidth: 600,
                    scrollPositionX: 1
                }
            },
            title: {
                text: 'Temperature Ranges(Min, Max)',
                style: {
                    color: '#000000', // Black color
                    fontWeight: 'bold', // Bold text
                    fontSize: '20px' // Optional: adjust font size as needed
                }
            },
            xAxis: {
                type: 'datetime',
                accessibility: {
                    rangeDescription: 'Range: Oct 11th 2024 to Oct 16 2024.'
                }
            },
            yAxis: {
                title: {
                    text: null
                }
            },
            tooltip: {
                crosshairs: true,
                shared: true,
                valueSuffix: '°F',
                xDateFormat: '%A, %b %e'
            },
            legend: {
                enabled: false
            },
            series: [{
                name: 'Temperatures',
                data: result,
                color: {
                    linearGradient: {
                        x1: 0,
                        x2: 0,
                        y1: 0,
                        y2: 1
                    },
                    stops: [
                        [0, '#f5a82d'],
                        [1, '#87CEEB']
                    ]
                },
                marker: {
                    enabled: true, // Enable markers
                    radius: 5, // Size of the dots
                    fillColor: '#87CEEB', // Color of the dots (blue)
                    lineColor: '#f5a82d', // Optional: color of the border (white)
                    lineWidth: 1 // Optional: width of the border
                }
            }]
        });
        //Second Graph Coming
        let obj1={
                "time": "2024-10-15T07:00:00Z",
                "data": {
                  "instant": {
                    "details": {
                      "air_pressure_at_sea_level": 1015.8,
                      "air_temperature": 10.9,
                      "cloud_area_fraction": 100,
                      "relative_humidity": 98.3,
                      "wind_from_direction": 80.6,
                      "wind_speed": 3.7
                    }
                  },
                  "next_12_hours": {
                    "summary": {
                      "symbol_code": "cloudy"
                    },
                    "details": {
        
                    }
                  },
                  "next_1_hours": {
                    "summary": {
                      "symbol_code": "cloudy"
                    },
                    "details": {
                      "precipitation_amount": 0
                    }
                  },
                  "next_6_hours": {
                    "summary": {
                      "symbol_code": "cloudy"
                    },
                    "details": {
                      "precipitation_amount": 0
                    }
                  }
                }
              }
        json={
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": coordinatesForChart
          },
          "properties": {
            "meta": {
              "updated_at": "2024-10-15T07:25:31Z",
              "units": {
                "air_pressure_at_sea_level": "inHg",
                "air_temperature": "°F",
                "cloud_area_fraction": "%",
                "precipitation_amount": "mm",
                "relative_humidity": "%",
                "wind_from_direction": "degrees",
                "wind_speed": "mph"
              }
            },
            "timeseries": [
              /*enter 120 here*/
            ]
          }
        }
        
       
        let arrayOf120=[];
        json["properties"]["meta"]["updated_at"]=hourlydata['intervals'][0]['startTime'];
        console.log('hourlydata',hourlydata);
        for(let i=0;i<121;i++){
            let dateString = hourlydata['intervals'][i]['startTime'];
            let result = dateString.split('-07')[0];
            let newObj = JSON.parse(JSON.stringify(obj1));
            newObj["time"]=result;
            console.log("hi cutie",obj1["time"]);
            newObj["data"]["instant"]["details"]["air_pressure_at_sea_level"]=hourlydata['intervals'][i]['values']['pressureSeaLevel'];
            newObj["data"]["instant"]["details"]["air_temperature"]=hourlydata['intervals'][i]['values']['temperature'];
            console.log(`humidity at index${i} is ${hourlydata['intervals'][i]['values']['humidity']}`);
            newObj["data"]["next_1_hours"]["details"]["precipitation_amount"]=hourlydata['intervals'][i]['values']['humidity'];//
            newObj["data"]["instant"]["details"]["wind_from_direction"]=hourlydata['intervals'][i]['values']['windDirection'];
            newObj["data"]["instant"]["details"]["wind_speed"]=hourlydata['intervals'][i]['values']['windSpeed'];
            arrayOf120.push(newObj);
        }
        json["properties"]["timeseries"]=arrayOf120;
        console.log(json);
        function Meteogram(json, container2) {
            // Parallel arrays for the chart data, these are populated as the JSON file
            // is loaded
            this.symbols = [];
            this.precipitations = [];
            this.precipitationsError = []; // Only for some data sets
            this.winds = [];
            this.temperatures = [];
            this.pressures = [];
        
            // Initialize
            this.json = json;
            this.container = container2;
            console.log(json);
            // Run
            //this.parseYrData();
        }
        
        /**
         * Mapping of the symbol code in yr.no's API to the icons in their public
         * GitHub repo, as well as the text used in the tooltip.
         *
         * https://api.met.no/weatherapi/weathericon/2.0/documentation
         */
        
        
        /**
         * Draw the weather symbols on top of the temperature series. The symbols are
         * fetched from yr.no's MIT licensed weather symbol collection.
         * https://github.com/YR/weather-symbols
         */
        
        
        
        /**
         * Draw blocks around wind arrows, below the plot area
         */
        Meteogram.prototype.drawBlocksForWindArrows = function (chart) {
            const xAxis = chart.xAxis[0];
        
            for (
                let pos = xAxis.min, max = xAxis.max, i = 0;
                pos <= max + 36e5; pos += 36e5,
                i += 1
            ) {
        
                // Get the X position
                const isLast = pos === max + 36e5,
                    x = Math.round(xAxis.toPixels(pos)) + (isLast ? 0.5 : -0.5);
        
                // Draw the vertical dividers and ticks
                const isLong = this.resolution > 36e5 ?
                    pos % this.resolution === 0 :
                    i % 2 === 0;
        
                chart.renderer
                    .path([
                        'M', x, chart.plotTop + chart.plotHeight + (isLong ? 0 : 28),
                        'L', x, chart.plotTop + chart.plotHeight + 32,
                        'Z'
                    ])
                    .attr({
                        stroke: chart.options.chart.plotBorderColor,
                        'stroke-width': 1
                    })
                    .add();
            }
        
            // Center items in block
            chart.get('windbarbs').markerGroup.attr({
                translateX: chart.get('windbarbs').markerGroup.translateX + 8
            });
        
        };
        
        /**
         * Build and return the Highcharts options structure
         */
        Meteogram.prototype.getChartOptions = function () {
            return {
                chart: {
                    renderTo: this.container,
                    marginBottom: 70,
                    marginRight: 40,
                    marginTop: 50,
                    plotBorderWidth: 1,
                    height: 400,
                    alignTicks: false,
                    scrollablePlotArea: {
                        minWidth: 720
                    }
                },
        
                defs: {
                    patterns: [{
                        id: 'precipitation-error',
                        path: {
                            d: [
                                'M', 3.3, 0, 'L', -6.7, 10,
                                'M', 6.7, 0, 'L', -3.3, 10,
                                'M', 10, 0, 'L', 0, 10,
                                'M', 13.3, 0, 'L', 3.3, 10,
                                'M', 16.7, 0, 'L', 6.7, 10
                            ].join(' '),
                            stroke: '#68CFE8',
                            strokeWidth: 1
                        }
                    }]
                },
        
                title: {
                    text: 'Hourly Weather(For Next 5 Days)',
                    align: 'center',
                    style: {
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis'
                    }
                },
        
                credits: {
                    text: 'Forecast from <a href="https://yr.no">yr.no</a>',
                    href: 'https://yr.no',
                    position: {
                        x: -40
                    }
                },
        
                tooltip: {
                    shared: true,
                    useHTML: true,
                    headerFormat:
                        '<small>{point.x:%A, %b %e, %H:%M} - ' +
                        '{point.point.to:%H:%M}</small><br>' +
                        '<b>{point.point.symbolName}</b><br>'
        
                },
        
                /*xAxis: [{ // Bottom X axis
                    type: 'datetime',
                    tickInterval: 2 * 36e5, // two hours
                    minorTickInterval: 36e5, // one hour
                    tickLength: 0,
                    gridLineWidth: 1,
                    gridLineColor: 'rgba(128, 128, 128, 0.1)',
                    startOnTick: false,
                    endOnTick: false,
                    minPadding: 0,
                    maxPadding: 0,
                    offset: 30,
                    showLastLabel: true,
                    labels: {
                        format: '{value:%H}'
                    },
                    crosshair: true
                }, { // Top X axis
                    linkedTo: 0,
                    type: 'datetime',
                    tickInterval: 24 * 3600 * 1000,
                    labels: {
                        format: '{value:<span style="font-size: 12px; font-weight: ' +
                            'bold">%a</span> %b %e}',
                        align: 'left',
                        x: 3,
                        y: 8
                    },
                    opposite: true,
                    tickLength: 20,
                    gridLineWidth: 1
                }]*/
                    xAxis: [{
                        // Bottom X axis
                        type: 'datetime',
                        tickInterval: 6 * 3600 * 1000, // 6 hours in milliseconds
                        minorTickInterval: 3600 * 1000, // 1 hour in milliseconds
                        tickLength: 0,
                        gridLineWidth: 1,
                        gridLineColor: 'rgba(128, 128, 128, 0.1)',
                        startOnTick: false,
                        endOnTick: false,
                        minPadding: 0,
                        maxPadding: 0,
                        offset: 30,
                        showLastLabel: true,
                        labels: {
                            format: '{value:%H}' // Format for displaying hours
                        },
                        crosshair: true
                    }, {
                        // Top X axis
                        linkedTo: 0,
                        type: 'datetime',
                        tickInterval: 24 * 3600 * 1000, // 24 hours in milliseconds
                        min: Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate()), // Start from today
                        max: Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate() + 5), // Up to 5 days later
                        labels: {
                            format: '{value:<span style="font-size: 12px; font-weight: bold">%a</span> %b %e}', // Format for displaying days
                            align: 'left',
                            x: 3,
                            y: 8
                        },
                        opposite: true,
                        tickLength: 20,
                        gridLineWidth: 1
                    }]
                    ,
        
                yAxis: [{ // temperature axis
                    title: {
                        text: null
                    },
                    labels: {
                        format: '{value}°',
                        style: {
                            fontSize: '10px'
                        },
                        x: -3
                    },
                    plotLines: [{ // zero plane
                        value: 0,
                        color: '#BBBBBB',
                        width: 1,
                        zIndex: 2
                    }],
                    maxPadding: 0.3,
                    minRange: 8,
                    tickInterval: 1,
                    gridLineColor: 'rgba(128, 128, 128, 0.1)'
        
                }, { // precipitation axis
                    title: {
                        text: null
                    },
                    labels: {
                        enabled: false
                    },
                    gridLineWidth: 0,
                    tickLength: 0,
                    minRange: 10,
                    min: 0
        
                }, { // Air pressure
                    allowDecimals: false,
                    title: { // Title on top of axis
                        text: 'inHg',
                        offset: 0,
                        align: 'high',
                        rotation: 0,
                        style: {
                            fontSize: '10px',
                            color: '#f5a82d',
                        },
                        textAlign: 'left',
                        x: 3
                    },
                    labels: {
                        style: {
                            fontSize: '8px',
                            color: '#f5a82d'
                        },
                        y: 2,
                        x: 3
                    },
                    gridLineWidth: 0,
                    opposite: true,
                    showLastLabel: false
                }],
        
                legend: {
                    enabled: false
                },
        
                plotOptions: {
                    series: {
                        pointPlacement: 'between'
                    },
                    windbarb: {
                        dataGrouping: {
                          enabled: true,
                          groupPixelWidth: 24,
                          units: [
                             ['hour', [2]],
                          ]
                        },
                        vectorLength: 7,
                        color: '#4B0082',
                        linewidth: 1,
                        dataLabels: {
                          enabled: false
                        }
                     }
                },
        
        
                series: [{
                    name: 'Temperature',
                    data: this.temperatures,
                    type: 'spline',
                    marker: {
                        enabled: false,
                        states: {
                            hover: {
                                enabled: true
                            }
                        }
                    },
                    tooltip: {
                        pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
                            ' ' +
                            '{series.name}: <b>{point.y}°F</b><br/>'
                    },
                    zIndex: 1,
                    color: '#FF3333',
                    negativeColor: '#48AFE8'
                }, {
                    name: 'Precipitation',
                    data: this.precipitationsError,
                    type: 'column',
                    color: 'url(#precipitation-error)',
                    yAxis: 1,
                    groupPadding: 0,
                    pointPadding: 0,
                    tooltip: {
                        valueSuffix: ' mm',
                        pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
                            ' ' +
                            '{series.name}: <b>{point.minvalue} mm - ' +
                            '{point.maxvalue} mm</b><br/>'
                    },
                    grouping: false,
                    dataLabels: {
                        enabled: this.hasPrecipitationError,
                        filter: {
                            operator: '>',
                            property: 'maxValue',
                            value: 0
                        },
                        style: {
                            fontSize: '8px',
                            color: 'gray'
                        }
                    }
                }, {
                    name: 'Humidity',
                    data: this.precipitations,
                    type: 'column',
                    color: '#86cdfd',//'#68CFE8',
                    yAxis: 1,
                    groupPadding: 0,
                    pointPadding: 0,
                    grouping: false,
                    dataLabels: {
                        enabled: !this.hasPrecipitationError,
                        filter: {
                            operator: '>',
                            property: 'y',
                            value: 0
                        },
                        style: {
                            fontSize: '8px',
                            color: '#666'
                        }
                    },
                    tooltip: {
                        formatter: function() {
                            return `<b>Humidity:</b> ${this.y} %`; // Customize the label here
                        },
                        valueSuffix: '%'
                    }
                }, {
                    name: 'Air pressure',
                    color: '#f5a82d',
                    data: this.pressures,
                    marker: {
                        enabled: false
                    },
                    shadow: false,
                    tooltip: {
                        valueSuffix: 'inHg'
                    },
                    dashStyle: 'shortdot',
                    yAxis: 2
                }, {
                    name: 'Wind',
                    type: 'windbarb',
                    id: 'windbarbs',
                    color: Highcharts.getOptions().colors[1],
                    lineWidth: 1.5,
                    data: this.winds,
                    vectorLength: 18,
                    yOffset: -15,
                    tooltip: {
                        valueSuffix: 'mph'
                    }
                }]
            };
        };
        
        /**
         * Post-process the chart from the callback function, the second argument
         * Highcharts.Chart.
         */
        Meteogram.prototype.onChartLoad = function (chart) {
            this.drawBlocksForWindArrows(chart);
        
        };
        
        /**
         * Create the chart. This function is called async when the data file is loaded
         * and parsed.
         */
        Meteogram.prototype.createChart = function () {
            this.chart = new Highcharts.Chart(this.getChartOptions(), chart => {
                this.onChartLoad(chart);
            });
        };
        
        Meteogram.prototype.error = function () {
            document.getElementById('loading').innerHTML =
                '<i class="fa fa-frown-o"></i> Failed loading data, please try again ' +
                'later';
        };
        
        /**
         * Handle the data. This part of the code is not Highcharts specific, but deals
         * with yr.no's specific data format
         */
        Meteogram.prototype.parseYrData = function () {
        
            let pointStart;
        
            if (!this.json) {
                return this.error();
            }
        
            // Loop over hourly (or 6-hourly) forecasts
            this.json.properties.timeseries.forEach((node, i) => {
        
                const x = Date.parse(node.time),
                    nextHours = node.data.next_1_hours || node.data.next_6_hours,
                    symbolCode = nextHours && nextHours.summary.symbol_code,
                    to = node.data.next_1_hours ? x + 36e5 : x + 6 * 36e5;
        
                if (to > pointStart + 125 * 36e5) {
                    return;
                }
        
                // Populate the parallel arrays
                this.symbols.push(nextHours.summary.symbol_code);
        
                this.temperatures.push({
                    x,
                    y: node.data.instant.details.air_temperature,
                    // custom options used in the tooltip formatter
                    to,
                });
        
                this.precipitations.push({
                    x,
                    y: nextHours.details.precipitation_amount
                });
        
                if (i % 2 === 0) {
                    this.winds.push({
                        x,
                        value: node.data.instant.details.wind_speed,
                        direction: node.data.instant.details.wind_from_direction
                    });
                }
        
                this.pressures.push({
                    x,
                    y: node.data.instant.details.air_pressure_at_sea_level
                });
        
                if (i === 0) {
                    pointStart = (x + to) / 2;
                }
            });
        
            // Create the chart when the data is loaded
            this.createChart();
        };
        // End of the Meteogram protype
        
        
        // On DOM ready...
        
        // Set the hash to the yr.no URL we want to parse

        window.meteogram = new Meteogram(json, 'container2');
        meteogram.parseYrData();
        //Game Over
/*
        if (!location.hash) {
            location.hash = 'https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=51.50853&lon=-0.12574&altitude=25';
        }
        
        const url = location.hash.substr(1);
        Highcharts.ajax({
            url,
            dataType: 'json',
            success: json => {
                window.meteogram = new Meteogram(json, 'container2');
            },
            error: Meteogram.prototype.error,
            headers: {
                // Override the Content-Type to avoid preflight problems with CORS
                // in the Highcharts demos
                'Content-Type': 'text/plain'
            }
        });*/

        

    }
    else {
        const section = document.getElementById("charts-container");
        section.style.display = 'none'; // Change to block and allow flex alignment
        const element = document.getElementById('Vbutton');
        element.style.transform = 'rotate(270deg)';
    }
}



function clearThePage(){
    document.getElementById('first-container').style.display = 'none'; 
    document.getElementById('second-container').style.display = 'none'; 
    document.getElementById('charts-container').style.display = 'none'; 
    
    document.getElementById('form').reset();
    

}




/*

*/

//https://api.tomorrow.io/v4/timelines?location=42.3478,-71.0466&fields=temperature,temperatureApparent,temperatureMin,temperatureMax,windSpeed,windDirection,pressureSeaLevel,weatherCode,precipitationProbability,precipitationType,visibility,moonPhase,cloudCover,humidity&units=imperial&timesteps=1d&apikey=XOqfWek85TE1R2UOftXMwodhVfThI98F
/*
/*const temperatureData = [
            15, 14, 13, 12, 11, 10, 9, 10, 12, 14, 16, 18, // Day 1
            15, 14, 13, 12, 11, 10,12,14 
        ];

        // Create an array of labels for the x-axis (06, 12, 18, 24 repeated)
        const categories = [];
        for (let i = 0; i < 5; i++) {
            categories.push('06', '12', '18', '00');
        }

        // Initialize the Highcharts chart
        Highcharts.chart('meteogram', {
            chart: {
                type: 'column',  // Change to 'column' for bar graph
            },
            title: {
                text: 'Hourly Temperature for 5 Days'
            },
            xAxis: {
                categories: categories,
                title: {
                    text: 'Time of Day'
                },
                crosshair: true
            },
            yAxis: {
                title: {
                    text: 'Temperature (°C)'
                }
            },
            series: [{
                name: 'Temperature',
                data: temperatureData,
                marker: {
                    enabled: false
                }
            }],
            tooltip: {
                shared: true,
                valueSuffix: ' °C'
            }
        });*/
        //BELOW IS THE COMMENTED CODE NEEDED FOR ARROWS
        /*function Meteogram(json, container) {
            // Parallel arrays for the chart data, these are populated as the JSON file
            // is loaded
            this.symbols = [];
            this.precipitations = [];
            this.precipitationsError = []; // Only for some data sets
            this.winds = [];
            this.temperatures = [];
            this.pressures = [];
        
            // Initialize
            this.json = json;
            this.container = container;
        
            // Run
            this.parseYrData();
        }
        Meteogram.prototype.drawBlocksForWindArrows = function (chart) {
            const xAxis = chart.xAxis[0];
        
            for (
                let pos = xAxis.min, max = xAxis.max, i = 0;
                pos <= max + 36e5; pos += 36e5,
                i += 1
            ) {
        
                // Get the X position
                const isLast = pos === max + 36e5,
                    x = Math.round(xAxis.toPixels(pos)) + (isLast ? 0.5 : -0.5);
        
                // Draw the vertical dividers and ticks
                const isLong = this.resolution > 36e5 ?
                    pos % this.resolution === 0 :
                    i % 2 === 0;
        
                chart.renderer
                    .path([
                        'M', x, chart.plotTop + chart.plotHeight + (isLong ? 0 : 28),
                        'L', x, chart.plotTop + chart.plotHeight + 32,
                        'Z'
                    ])
                    .attr({
                        stroke: chart.options.chart.plotBorderColor,
                        'stroke-width': 1
                    })
                    .add();
            }
        
            // Center items in block
            chart.get('windbarbs').markerGroup.attr({
                translateX: chart.get('windbarbs').markerGroup.translateX + 8
            });
        
        };*/
            // Generate labels for 5 days, 24 hours each
            /*const labels = [];
            for (let day = 0; day < 5; day++) {
                for (let hour = 0; hour < 24; hour++) {
                    const timeLabel = `${hour.toString().padStart(2, '0')}:00 Day ${day + 1}`;
                    labels.push(timeLabel);
                }
            }
            const humidityData = [
                30, 32, 35, 34, 33, 31, 30, 31, 33, 34, 36, 37, // Day 1
                28, 30, 32, 34, 33, 31, 29, 30, 32, 33, 35, 36, // Day 2
                26, 28, 30, 32, 31, 30, 29, 30, 31, 33, 34, 35, // Day 3
                25, 27, 29, 31, 30, 29, 28, 29, 31, 33, 34, 35, // Day 4
                24, 26, 28, 30, 29, 28, 27, 28, 30, 32, 33, 34  // Day 5
            ];
            // Sample temperature data (randomly generated for demonstration)
            const temperatureData = Array.from({ length: labels.length }, () => Math.floor(Math.random() * 100));
        
            Highcharts.chart('meteogram', {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Hourly Temperature Over 5 Days'
                },
                xAxis: {
                    categories: labels,
                    title: {
                        text: 'Hours'
                    },
                    labels: {
                        rotation: -45, // Rotate labels for better readability
                        style: {
                            fontSize: '10px'
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Temperature (°F)'
                    }
                },
                series: [{
                    name: 'Temperature',
                    data: temperatureData
                }, {
                    name: 'Humidity',
                    type: 'line',  // Change the type to 'line'
                    data: humidityData,
                    color: 'red',  // Set the color to red
                    marker: {
                        enabled: false // Disable markers for the line
                    }
                },
                
                ],
                /*plotOptions: {
                    column: {
                        dataLabels: {
                            enabled: true
                        }
                    },
                    series: {
                        marker: {
                            enabled: false
                        }
                    },
                    windbarb: {
                        dataGrouping: {
                          enabled: true,
                          groupPixelWidth: 24,
                          units: [
                             ['hour', [2]],
                          ]
                        },
                        vectorLength: 7,
                        color: '#4B0082',
                        linewidth: 1,
                        dataLabels: {
                          enabled: false
                        }
                     }
                },
                tooltip: {
                    shared: true,
                    useHTML: true,
                    formatter: function () {
                        let s = `<b>Hour: ${this.x}</b><br/>`;
                        this.points.forEach(point => {
                            s += `${point.series.name}: <b>${point.y}</b><br/>`;
                        });
                        return s;
                    }
                }*/
                
            //});*/