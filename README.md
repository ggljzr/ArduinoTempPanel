# ArduinoTempPanel

Program for logging and displaying temperature using Arduino Yún and TMP36.
Based on https://www.arduino.cc/en/Tutorial/TemperatureWebPanel

## Function
Program running on ATmega32U4 displays current temperature on ArduinoTFT display and sends temperature to Linux
part of the board via Bridge library (Bridge.put()). Current temperature can also be obtained via REST 
call ('arduino.local/arduino/getTemp')

Linux part runs a python script that logs temperature values into a .txt file every hour. Temperature chart is displayed
on a web page placed on Yún's webserver ('arduino.local/sd/TempPanel').

Text file contains 24 hour log, with oldest entry erased a new entry added every hour (FIFO).

File is accessed with jQuery/AJAX, plotting is done with Google charts library.
