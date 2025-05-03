
void draw(U8G2 u8g2) {
    // WARNING: ⚠️ DO NOT PASTE CODE FROM OTHERS INTO THIS WINDOW ⚠️

    u8g2.setDrawColor(1);
    u8g2.drawPixel(1, 0);
    u8g2.drawPixel(3, 0);
    u8g2.setFont(u8g2_font_5x8);
    u8g2.drawStr(1,16,"Hi, this editor supports");
    u8g2.drawStr(1,32,"a tiny bit of C++ transp.");
    u8g2.drawStr(1,48,"but it is infact javascript");
    // this should help you copy and paste the "c++" code to the Arduino IDE
    // Datatypes get translated to "var": (u)int(8,16,32)(_t), float, double

    // this code gets eval(..)'ed in the background with an fake u8g2 instance mapped to the HTML5 Canvas above
}