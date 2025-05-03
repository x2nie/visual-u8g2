
void setup(void) {
    u8g2.begin(/* menu_select_pin= */ 5, /* menu_next_pin= */ 4, /* menu_prev_pin= */ 2, /* menu_home_pin= */ 3);
    u8g2.setFont(u8g2_font_helvB12_tr);
}
void draw(const char *s) {
    int b = 100;
    // u8g2.setDrawColor(1);
    u8g2.drawLine(1, 0, 10, 10);
    u8g2.drawLine(b, b*2, b+3, b-5);
    // u8g2.drawPixel(3, 0);
    // u8g2.setFont(u8g2_font_5x8);
    u8g2.drawStr(1,16,"Hi, this editor supports");
    u8g2.drawStr(1,32,"a tiny bit of C++ transp.");
    // u8g2.drawStr(1,48,"but it is infact javascript");
    // this should help you copy and paste the "c++" code to the Arduino IDE
    // Datatypes get translated to "var": (u)int(8,16,32)(_t), float, double
    // for loop to print "Hi" 5 times
    for (int i = 0; i < 5; i++) {
        u8g2.drawStr(1, 48+i*16,"Hi, this editor supports");
    }

    // this code gets eval(..)'ed in the background with an fake u8g2 instance mapped to the HTML5 Canvas above
}

void loop(void) {


    // u8g2.setDisplayRotation(U8G2_R0);
    // u8g2.setFlipMode(0);
    draw("R0, F0");
}