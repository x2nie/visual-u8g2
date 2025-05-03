
void drawBattery(U8G2 u8g2, int x, int y, int w, int h, int segments, int lvl) {
    u8g2.drawFrame(x,y,w,h);
    u8g2.drawFrame(x + w / 3, y - 2, w / 3, 2);
    
    for(int i = 0; i < segments; i++) {
        if ((segments -i) > lvl) {
            u8g2.drawFrame(x+2, y + i*h/segments + 2, w-4, h/(segments+1) - 1);
        } else {
            u8g2.drawBox(x+2, y + i*h/segments +2, w-3, h/(segments+1) - 1);
        }
    }

}
void drawSignal(U8G2 u8g2, uint8_t x, uint8_t y, uint8_t strength) {
    for (uint8_t i = 0; i < strength; i++) {
        u8g2.drawCircle(x,y,i*3, U8G2_DRAW_UPPER_RIGHT);
    }
}


void draw(U8G2 u8g2) {
    u8g2.setDrawColor(1);
    u8g2.setFont(u8g2_font_5x8);
    u8g2.drawStr(2,12,"Battery: ");
    u8g2.drawStr(2,44,"Signal: ");
    drawBattery(u8g2, 70,4,12,20,5,counter%6);
    drawSignal(u8g2, 70,46,counter%6);
}