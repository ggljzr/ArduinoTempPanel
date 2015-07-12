#include <TFT.h>  // Arduino LCD library
#include <SPI.h>

#include <Bridge.h>
#include <YunServer.h>
#include <YunClient.h>

// pin definition for the Leonardo
//changed cs and dc pins because of
//Yuns serial interface
#define cs   7
#define dc   9
#define rst  10

// create an instance of the library
TFT TFTscreen = TFT(cs, dc, rst);
YunServer server;

// char array to print to the screen
char sensorPrintout[6];

void setup() {

  TFTscreen.begin();
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
void process(YunClient client, float temp)
{
   String command = client.readStringUntil('/');
   command.trim();
   
   if(command == "getTemp")  
     client.print(temp);
}

void loop() {
  
  //get next client
  YunClient client = server.accept();
 
  //temperature calculation
  //3.3 voltage reference is used 
  int reading = analogRead(A0);
  float voltage = reading * 3.3;
  voltage /= 1024.0;
  float temperatureC = (voltage - 0.5) * 100;
  String tempString = String(temperatureC);
  
  if (client) {
    process(client, temperatureC);
    client.stop();
  }

  // convert the reading to a char array
  tempString.toCharArray(sensorPrintout, 6);

  // set the font color
  TFTscreen.stroke(255, 255, 255);
  // print the sensor value
  TFTscreen.text(sensorPrintout, 0, 20);
  // wait for a moment
  delay(1000);
  // erase the text you just wrote
  TFTscreen.stroke(0, 0, 0);
  TFTscreen.text(sensorPrintout, 0, 20);
}

