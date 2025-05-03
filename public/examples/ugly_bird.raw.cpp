
void drawBird(U8G2 u8g2, uint8_t x0, uint8_t y0, uint8_t state) {
    // the eye
    u8g2.drawEllipse(x0,y0,5,2);
    u8g2.drawPixel(x0+1, y0-1);
    u8g2.drawPixel(x0+2, y0-1);
    u8g2.drawPixel(x0+2, y0);

    // the body
    u8g2.drawEllipse(x0-3, y0+1, 8,5)

    // the mouth
    u8g2.drawEllipse(x0+2, y0+4,3,1);

    // the wings
    u8g2.drawEllipse(x0-9, y0+1 + counter % 3, 6, counter % 3 + 1);
}

void draw(U8G2 u8g2) {
    u8g2.setDrawColor(1);

    drawBird(u8g2, 30, sin(counter/4)*8+20);
}