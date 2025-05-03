
// the line below is plain javascript, I'll need to fix the c++ transpilation for this in the future
var menu = ["General", "Wifi", "Time", "Sensors", "Logging"];

void drawMenu(U8G2 u8g2, uint8_t selected) {
    u8g2.setFont(u8g2_font_5x8);

    u8g2.drawStr(1,8, "Config:");
    u8g2.drawHLine(0,11,100);
    for (uint8_t i = 0; i < 5; i++) {
        if (selected == i) {
            u8g2.setFont(u8g2_font_5x8);
            u8g2.drawStr(1,10*(i+2)+1, "> ");
        } else {
            u8g2.setFont(u8g2_font_5x8);
        }
        u8g2.drawStr(10,10*(i+2)+1, menu[i]);
    }
}

void drawButtons(U8G2 u8g2) {
    u8g2.setFont(u8g2_font_5x8);
    u8g2.drawRFrame(96+4, 54, 32, 16, 4);
    u8g2.drawRFrame(96+4, -4, 32, 16, 4);
    u8g2.drawStr(103,8, "Exit");
    u8g2.drawStr(109,63, "OK");

    uint8_t x = 115;
    u8g2.drawTriangle(x + 0, 28 + 0, x + 10, 28 + 0, x + 5, 28 - 5);
    u8g2.drawTriangle(x + 0, 36 + 0, x + 10, 36 + 0, x + 5, 36 + 5);

}

void draw(U8G2 u8g2) {
    u8g2.setDrawColor(1);
    
    drawMenu(u8g2, counter%5);
    drawButtons(u8g2);
 }