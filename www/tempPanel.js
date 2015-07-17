
function temperatureChart()
{
	$.ajax({
  		method: "GET",
  		url: "tempLog.txt",
 		dataType: "text",
 		contentType: "text/plain",
 		success : function(result)
 		{
 			plotData = parseLog(result);
 			drawChart(plotData);
 		}
	});
	
}

function parseLog(log)
{
	lines = log.split('\n');
	plotData = [];

	plotData.push(['Čas', 'Teplota'])

	for(var i = 0; i < lines.length;i++)
	{
		entry = lines[i].split(' ');
		time = entry[0].substring(0,2);
		temperature = parseFloat(entry[1]);
		plotData.push([time, temperature]);
	}

	return plotData;
}

function drawChart(plotData)
{
	var data = google.visualization.arrayToDataTable(plotData);

  	var options = {
          title: 'Průběh teploty během posledních 24 hodin',
          titleTextStyle:
          	{
          		color: '98A2A4',
          		bold: 'true'
          },
          legend: 'none',
          pointSize: 5,
          colors: ['#26d376'],
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

    var chart = new google.visualization.LineChart(document.getElementById('chart'));
    chart.draw(data, options);
    document.getElementById('exportPngButton').href = chart.getImageURI();
}

function getCurrentTemp()
{
	$('#temp').load('/arduino/getTemp');
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
    document.getElementById(elemId + 'temp').innerHTML = '<b>' + forecastData[i].temp.day + ' °C' + '</b>'
    document.getElementById('night' + String(i + 1) + 'temp').innerHTML = '<b>' + forecastData[i].temp.night + ' °C' + '</b>';
    document.getElementById(elemId + 'hum').innerHTML = '<b>' + forecastData[i].humidity + ' %' + '</b>';
    document.getElementById(elemId + 'press').innerHTML =   '<b>' + forecastData[i].pressure + ' hPa' + '</b>';
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
