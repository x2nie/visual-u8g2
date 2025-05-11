void setup(void) {
    //u8g2.begin(/* menu_select_pin= */ 5, /* menu_next_pin= */ 4, /* menu_prev_pin= */ 2, /* menu_home_pin= */ 3);
    //u8g2.setFont(u8g2_font_helvB12_tr);
}

void draw(void) {
    // WARNING: ⚠️ DO NOT PASTE CODE FROM OTHERS INTO THIS WINDOW ⚠️

    u8g2.setDrawColor(1);
    u8g2.drawLine(0,0,5,0);
    

    //* this text position must be exactly the same
    //* compared visually to https://wokwi.com/projects/387831447146245121
    u8g2.setFont(u8g2_font_6x10);
    u8g2.drawStr(2, 9, "Dust Collector");


    // u8g2.drawPixel(1, 0);
    // u8g2.drawPixel(3, 0);
    u8g2.setFont(nokia_3310_small_bold);
    u8g2.drawStr(1, 18, "Hi, this editor supports");
    u8g2.drawStr(1, 32, "a tiny bit of C++ transp.");
    u8g2.drawStr(1,48,"but it is infact javascript");
    // this should help you copy and paste the "c++" code to the Arduino IDE
    // Datatypes get translated to "var": (u)int(8,16,32)(_t), float, double

    // this code gets eval(..)'ed in the background with an fake u8g2 instance mapped to the HTML5 Canvas above
}

void loop(void) {
    // u8g2.setDisplayRotation(U8G2_R0);
    // u8g2.setFlipMode(0);
    draw();
}