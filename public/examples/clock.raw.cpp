uint8_t rpx(uint8_t cx, uint8_t x, uint16_t angle) {
    return cx + (x) * cos(2 * PI * angle / 360);
}

uint8_t rpy(uint8_t cy, uint8_t y, uint16_t angle) {
    return cy + (y) * sin(2 * PI * angle / 360);
}

void gauge(U8G2 u8g2, uint8_t x, uint8_t y, uint8_t r, uint16_t angle) {

    uint8_t rx = x + r;
    uint8_t ry = y;

    uint8_t px = rx + (r - 2) * cos(2 * PI * angle / 360);
    uint8_t py = ry + (r - 2) * sin(2 * PI * angle / 360);

    u8g2.drawLine(rx, ry, px, py);

    u8g2.drawCircle(rx, y, r);
}

void drawTick(U8G2 u8g2, uint8_t cx, uint8_t cy, uint8_t r1, uint8_t r2, uint8_t angle) {
    u8g2.drawLine(rpx(cx, r1, angle),rpy(cy, r1, angle),
                  rpx(cx, r2, angle),rpy(cy, r2, angle));
}

void drawFace(U8G2 u8g2, uint8_t cx, uint8_t cy, uint8_t r) {
    for (uint16_t h = 0; h < 12; h++) {
        drawTick(u8g2, cx, cy, r*.8, r*.99, h*30 -.5);
        drawTick(u8g2, cx, cy, r*.8, r*.99, h*30);
        drawTick(u8g2, cx, cy, r*.8, r*.99, h*30 +.5);
    }
    for (uint16_t m = 0; m < 60; m++) {
        drawTick(u8g2, cx, cy, r*.94, r*.98, m*6);
    }
}

void draw(U8G2 u8g2) {

    u8g2.setDrawColor(1);
    u8g2.setFont(u8g2_font_4x6_tf);

    u8g2.drawLine(10,10,rpx(10,100, 180),rpy(10,100, 180));
    
    drawFace(u8g2, 100,100,100);
    
    gauge(u8g2, 1, 100, 99, counter % 360);

}