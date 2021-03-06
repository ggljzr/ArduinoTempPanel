# ArduinoTempPanel

Program for logging and displaying temperature/humidity using Arduino Yún, TMP36 and DHT11.
Based on https://www.arduino.cc/en/Tutorial/TemperatureWebPanel.


## Function
Program running on ATmega32U4 displays current temperature on ArduinoTFT display and sends data to Linux
part of the board via Bridge library (Bridge.put()). Current humidity and temperature (from TMP36 sensor) can also be obtained via REST 
call ('arduino.local/arduino/getTemp' and 'arduino.local/arduino/getHum').

Linux part runs a python script that logs temperature values into a .txt file every hour. Temperature and humidity charts are displayed on a web page placed on Yún's webserver ('arduino.local/sd/TempPanel'). Address of the web page may vary depending on the name of directory in Yún's 'www' folder. Temperature chart shows data collected with both TMP36 (analog) and DHT11 (digital) sensors. Humidity chart shows data from DHT11 sensor.

Web page also displays weather forecast for next five days (forecast is provided by openweathermap.org). Forecast location (Prague) is hardwired into js code for the moment.

Text file contains 24 hour log, with oldest entry erased a new entry added every hour (FIFO).

File is accessed with jQuery/AJAX, plotting is done with Google charts library.

TODO: display current humidity on tft display. It would also probably be better to make panel more server side, maybe with flask or node.js. Also access to openweathermap api now requires api key, so that needs to be worked in.
