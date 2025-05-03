
void progressBar(U8G2 u8g2, uint8_t x, uint8_t y, uint8_t width, uint8_t height, uint8_t percent)
{
    // can't draw it smaller than 10x8
    height = height < 8 ? 8 : height;
    width = width < 10 ? 10 : width;

    // draw percentage
    u8g2.setFont(u8g2_font_5x8_tf);
    u8g2.drawStr(x + width + 2, y + height / 2 + 2, (String(percent) + String("%")).c_str());

    // draw it
    u8g2.drawRFrame(x, y, width, height, 4);
    u8g2.drawBox(x + 2, y + 2, (width - 4) * (percent / 100.0), height - 4);
}

void gauge(U8G2 u8g2, uint8_t x, uint8_t y, uint8_t r, uint8_t percent)
{
    uint8_t rx = x + r;
    uint8_t ry = y;

    uint8_t px = rx + (r - 2) * cos(2 * PI * (percent / 2.0 + 50) / 100);
    uint8_t py = ry + (r - 2) * sin(2 * PI * (percent / 2.0 + 50) / 100);

    u8g2.drawLine(rx, ry, px, py);

    u8g2.drawCircle(rx, y, r, U8G2_DRAW_UPPER_LEFT);
    u8g2.drawCircle(rx, y, r, U8G2_DRAW_UPPER_RIGHT);
}

void dialog(U8G2 u8g2, uint8_t x, uint8_t y, uint8_t width, uint8_t height, String title)
{
    u8g2.drawRFrame(x, y, width, height, 2);

    u8g2.setFont(u8g2_font_5x8_tf);
    u8g2.drawStr(x + (width / 2) - ((String(title).length() * (u8g2.getMaxCharWidth())) / 2), y + u8g2.getMaxCharHeight(), title.c_str());
    u8g2.drawHLine(x, y + u8g2.getMaxCharHeight() + 1, width);
}

void draw(U8G2 u8g2)
{
    u8g2.setDrawColor(1);
    u8g2.setFont(u8g2_font_5x8_tf);
    u8g2.drawStr(3, 18, "Uptime: 12d10h08m");

    u8g2.setFont(u8g2_font_4x6_tf);
    int x = 0;
    int y = 27;
    u8g2.drawStr(6 + x, y, "1");
    gauge(u8g2, 8 + x, y + 10, 16, counter % 100);
    u8g2.drawStr(44 + x, y, "5");
    gauge(u8g2, 48 + x, y + 10, 16, counter % 100);
    u8g2.drawStr(83 + x, y, "15");
    gauge(u8g2, 88 + x, y + 10, 16, counter % 100);

    u8g2.setFont(u8g2_font_5x8_tf);

    u8g2.drawStr(3, 60, "HDD:");
    progressBar(u8g2, 30, 52, 76, 10, counter % 101);

    u8g2.drawStr(3, 48, "RAM:");
    progressBar(u8g2, 30, 40, 76, 10, counter % 101);

    dialog(u8g2, 0, 0, 128, 64, String("192.168.1.33"));
}