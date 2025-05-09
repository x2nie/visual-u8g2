void setup(void) {
    //u8g2.begin(/* menu_select_pin= */ 5, /* menu_next_pin= */ 4, /* menu_prev_pin= */ 2, /* menu_home_pin= */ 3);
    //u8g2.setFont(u8g2_font_helvB12_tr);
}

int counter = 0;

uint8_t rpx(uint8_t cx, uint8_t x, uint16_t angle) {
    return cx + (x) * cos(2 * PI * angle / 360);
}

uint8_t rpy(uint8_t cy, uint8_t y, uint16_t angle) {
    return cy + (y) * sin(2 * PI * angle / 360);
}

void gauge(uint8_t x, uint8_t y, uint8_t r, uint16_t angle) {

    uint8_t rx = x + r;
    uint8_t ry = y;

    uint8_t px = rx + (r - 2) * cos(2 * PI * angle / 360);
    uint8_t py = ry + (r - 2) * sin(2 * PI * angle / 360);

    u8g2.drawLine(rx, ry, px, py);

    u8g2.drawCircle(rx, y, r);
}

void drawTick(uint8_t cx, uint8_t cy, uint8_t r1, uint8_t r2, uint8_t angle) {
    u8g2.drawLine(rpx(cx, r1, angle),rpy(cy, r1, angle),
                  rpx(cx, r2, angle),rpy(cy, r2, angle));
}

void drawFace(uint8_t cx, uint8_t cy, uint8_t r) {
    for (uint16_t h = 0; h < 12; h++) {
        drawTick(cx, cy, r*.8, r*.99, h*30 -.5);
        drawTick(cx, cy, r*.8, r*.99, h*30);
        drawTick(cx, cy, r*.8, r*.99, h*30 +.5);
    }
    for (uint16_t m = 0; m < 60; m++) {
        drawTick(cx, cy, r*.94, r*.98, m*6);
    }
}

void draw() {

    u8g2.setDrawColor(1);
    u8g2.setFont(u8g2_font_4x6_tf);

    u8g2.drawLine(10,10,rpx(10,100, 180),rpy(10,100, 180));
    
    drawFace(100,100,100);
    
    gauge(1, 100, 99, counter % 360);

}

void loop() {
    // u8g2.setDisplayRotation(U8G2_R0);
    // u8g2.setFlipMode(0);
    draw();
}