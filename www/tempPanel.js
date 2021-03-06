function refresh()
{
    charts();
    getCurrentTemp();
    loadForecast();
    loadCurrentWeather();
    $('#humchart').hide(1);
}

function switchCharts()
{
    button = document.getElementById('switch');

    if($('#humchart').is(':hidden'))
    {
        button.innerHTML = 'Teplota';
        button.style.background = '#21AE6C'
            $('#humchart').slideDown();
        $('#tempchart').slideUp();
    }
    else if($('#tempchart').is(':hidden'))
    {
        button.innerHTML = 'Vlhkost';
        button.style.background = '#FFB300'
            $('#humchart').slideUp();
        $('#tempchart').slideDown();
    }
}
function charts()
{
    $.ajax({
        method: "GET",
        url: "tempLog.txt",
        dataType: "text",
        contentType: "text/plain",
        success : function(result)
        {
            plotData = parseLog(result);
            drawTempChart(plotData.temp);
            drawHumChart(plotData.hum);
        }
    });

}

function parseLog(log)
{
    lines = log.split('\n');
    tempData = [];
    humData = [];

    tempData.push(['Čas', 'TMP36', 'DHT11']);
    humData.push(['Čas', 'DHT11']);

    for(var i = 0; i < lines.length;i++)
    {
        entry = lines[i].split(' ');
        time = entry[0].substring(0,2);
        temperatureTMP36 = parseFloat(entry[1]);
        temperatureDHT11 = parseFloat(entry[2]);
        humidity = parseInt(entry[3]);
        tempData.push([time, temperatureTMP36, temperatureDHT11]);
        humData.push([time, humidity]);
    }

    var plotData =
    {
        temp: tempData,
        hum: humData
    }

    return plotData;
}

function drawTempChart(plotData)
{
    var data = google.visualization.arrayToDataTable(plotData);

    var options = {
        title: 'Průběh teploty během posledních 24 hodin',
        titleTextStyle:
        {
            color: '#98A2A4',
            bold: 'true'
        },
        //legend: 'none',
        pointSize: 5,
        colors: ['#26d376', '#d1154a'],
        hAxis:
        {
            title : 'Čas',
            titleTextStyle:
            {
                color: '#5294E2',
                bold: 'true'
            }
        },
        vAxis:
        {
            title : 'Teplota (°C)',
            titleTextStyle:
            {
                color: '#21AE6C',
                bold: 'true'
            }
        }
    };

    var chart = new google.visualization.LineChart(document.getElementById('tempchart'));
    chart.draw(data, options);
    document.getElementById('exporttempbutton').href = chart.getImageURI();
}


function drawHumChart(plotData)
{
    var data = google.visualization.arrayToDataTable(plotData);

    var options =
    {
        title: 'Průběh vlhkosti během posledních 24 hodin',
        titleTextStyle:
        {
            color: '#98A2A4',
            bold: 'true'
        },
        pointSize: 5,
        colors: ['#FFC107'],
        hAxis:
        {
            title: 'Čas',
            titleTextStyle:
            {
                color:'#5294E2',
                bold: 'true'
            }
        },
        vAxis:
        {
            title: 'Vlhkost (%)',
            titleTextStyle:
            {
                color: '#FFB300',
                bold: 'true'
            }
        }
    };

    var chart = new google.visualization.LineChart(document.getElementById('humchart'));
    chart.draw(data,options);
    document.getElementById('exporthumbutton').href = chart.getImageURI();
}

function getCurrentTemp()
{
    $('#temp').load('/arduino/getTemp');
}

function loadCurrentWeather()
{
    $.getJSON('http://api.openweathermap.org/data/2.5/weather?q=Prague&units=metric', function(data)
            {
                var unixDate = parseInt(data.dt);

                document.getElementById('currentweekday').innerHTML = getWeekDay(unixDate);
                document.getElementById('currentdate').innerHTML = getDateString(unixDate);

                document.getElementById('currentmaxtemp').innerHTML = data.main.temp + ' °C';
                document.getElementById('currentmintemp').innerHTML =  data.main.temp_min + ' °C';
                document.getElementById('currentclouds').innerHTML = data.clouds.all + ' %';
                document.getElementById('currenthum').innerHTML = data.main.humidity + ' %';
                document.getElementById('currentpress').innerHTML = data.main.pressure + ' hPa';

                document.getElementById('currentweathericon').src = 'icons/' +  data.weather[0].icon + '.png';

                document.getElementById('sunrise').innerHTML = getTimeString(parseInt(data.sys.sunrise));
                document.getElementById('sunset').innerHTML = getTimeString(parseInt(data.sys.sunset));

                document.getElementById('windspeed').innerHTML = data.wind.speed + ' m/s';
                setWindDir(parseInt(data.wind.deg));
            });
}

function setWindDir(degrees)
{
    document.getElementById('windicon').title = 'Směr: ' + degrees + '°';
    degrees = 360 - degrees;
    document.getElementById('windicon').style = 'transform: rotate(' + degrees + 'deg);';
}

function loadForecast()
{
    $.getJSON('http://api.openweathermap.org/data/2.5/forecast/daily?q=Prague&units=metric&cnt=5', function (data)
            {
                loadLocation(data.city);
                loadForecastData(data.list);
            });
}

function loadLocation(locationData)
{
    document.getElementById('city').innerHTML = locationData.name;
    lon = locationData.coord.lon;
    lat = locationData.coord.lat;
    document.getElementById('coords').innerHTML = ' (' + String(lon) + ', ' + String(lat) + ') ';
}

function loadForecastData(forecastData)
{
    var unixDate;

    for(i = 0; i < 5; i++) //forecast for five days
    {
        unixDate = parseInt(forecastData[i].dt);
        elemId = 'day' + String(i+1);
        document.getElementById(elemId + 'day').innerHTML = getWeekDay(unixDate);

        document.getElementById(elemId + 'image').src = 'icons/' +  forecastData[i].weather[0].icon + '.png';
        document.getElementById(elemId + 'image').title = 'Denní teplota: ' + forecastData[i].temp.min + '/' +
            forecastData[i].temp.day + '/' +
            forecastData[i].temp.max + ' °C' +
            '\nNoc: ' + forecastData[i].temp.night + ' °C' +
            '\nVečer: ' + forecastData[i].temp.eve + ' °C' +
            '\nRáno: ' + forecastData[i].temp.morn + ' °C';

        document.getElementById(elemId + 'date').innerHTML = getDateString(unixDate);
        document.getElementById(elemId + 'temp').innerHTML = forecastData[i].temp.day + ' °C'
            document.getElementById('night' + String(i + 1) + 'temp').innerHTML = forecastData[i].temp.night + ' °C';
        document.getElementById(elemId + 'hum').innerHTML = forecastData[i].humidity + ' %';
        document.getElementById(elemId + 'press').innerHTML =   forecastData[i].pressure + ' hPa';
    }
}

function getDateString(unixDate)
{

    date = new Date(unixDate * 1000);
    day = String(date.getDate());
    month = String(date.getMonth() + 1);
    year = String(date.getFullYear());

    return year + '/' + month + '/' + day;
}

function getTimeString(unixDate)
{
    time = new Date(unixDate * 1000);
    hours = String(time.getHours());
    minutes = String(time.getMinutes());
    seconds = String(time.getSeconds());

    hours = (hours < 10 ) ? '0' + hours : hours;
    minutes = (minutes < 10 ) ? '0' + minutes : minutes;
    seconds = (seconds < 10 ) ? '0' + seconds : seconds;

    return hours + ':' + minutes + ':' + seconds;
}

function getWeekDay(unixDate)
{
    date = new Date(unixDate * 1000);

    dayNum = date.getDay();

    switch (dayNum){
        case 0:
            return 'Neděle';
        case 1:
            return 'Pondělí';
        case 2:
            return 'Úterý';
        case 3:
            return 'Středa';
        case 4:
            return 'Čtvrtek';
        case 5:
            return 'Pátek';
        case 6:
            return 'Sobota';
        default:
            return 'Default';
    }
}

