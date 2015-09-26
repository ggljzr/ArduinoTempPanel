#include <TFT.h>  // Arduino LCD library
#include <SPI.h>

#include "DHT.h"

#include <Bridge.h>
#include <YunServer.h>
#include <YunClient.h>

// pin definition for the Leonardo
//changed cs and dc pins because of
//Yuns serial interface
#define cs   7
#define dc   9
#define rst  10

#define DHTPIN 4
#define DHTTYPE DHT11

#define LOOP_DELAY 2000

// create an instance of the library
TFT TFTscreen = TFT(cs, dc, rst);
YunServer server;

DHT dht(DHTPIN, DHTTYPE);

// char array to print to the screen
char sensorPrintout[6];

void setup() {

  TFTscreen.begin();
  dht.begin();
  Bridge.begin();
  server.listenOnLocalhost();
  server.begin();
  analogReference(EXTERNAL);
  
  // clear the screen with a black background
  TFTscreen.background(0, 0, 0);

  // write the static text to the screen
  // set the font color to white
  TFTscreen.stroke(0, 255, 0);
  // set the font size
  TFTscreen.setTextSize(2);
  // write the text to the top left corner of the screen
  TFTscreen.text("Teplota\n ", 0, 0);
  
  TFTscreen.setTextSize(4);
  TFTscreen.stroke(255,255,0);
  TFTscreen.text("C",130,20);
}

//processing of simple rest call 
void process(YunClient client, float temp, float hum)
{
   String command = client.readStringUntil('/');
   command.trim();
   
   if(command == "getTemp"){
  	client.print(temp);
	return;
   }
   
   if(command == "getHum"){
	client.print(hum);
	return;
   }
}

void loop() {
  
  //get next client
  YunClient client = server.accept();
 
  //temperature calculation
  //3.3 voltage reference is used 
  int reading = analogRead(A0);
  float voltage = reading * 3.3;
  voltage /= 1024.0;
  float tempTMP36 = (voltage - 0.5) * 100;
  float tempDHT11 = dht.readTemperature();
  float hum = dht.readHumidity();
  String stringTMP36 = String(tempTMP36);
  String stringHum = String(hum);
  String stringDHT11 = String(tempDHT11);
  
  String answer = stringTMP36 + ' ' + stringDHT11 + ' ' + stringHum;
  
  if (client) {
    process(client, tempTMP36, hum);
    client.stop();
  }

  // convert the reading to a char array
  stringTMP36.toCharArray(sensorPrintout, 6);
  Bridge.put("temp", answer);  
  
  // set the font color
  TFTscreen.stroke(255, 255, 255);
  // print the sensor value
  TFTscreen.text(sensorPrintout, 0, 20);
  // wait for a moment
  delay(LOOP_DELAY);
  // erase the text you just wrote
  TFTscreen.stroke(0, 0, 0);
  TFTscreen.text(sensorPrintout, 0, 20);
}

