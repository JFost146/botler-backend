#include <Adafruit_TinyUSB.h>
#include <FastLED.h>

// Configuration
#define LED_PIN     5
#define NUM_LEDS    60
#define LED_TYPE    WS2812B
#define COLOR_ORDER GRB

// LED array
CRGB leds[NUM_LEDS];

void setup() {
  Serial.begin(115200);
  while (!Serial) delay(10);
  // Initialize FastLED
  FastLED.addLeds<LED_TYPE, LED_PIN, COLOR_ORDER>(leds, NUM_LEDS);
  FastLED.setBrightness(20);  // Start with low brightness
}



void loop() {

    leds[0] = CRGB::Red;
    FastLED.show();
    delay(2000);
    
    leds[0] = CRGB::Blue;

    FastLED.show();
    delay(2000);

}
