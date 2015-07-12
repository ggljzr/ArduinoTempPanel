
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
		time = entry[0];
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

}

function getCurrentTemp()
{
	$('#temp').load('/arduino/getTemp')
}