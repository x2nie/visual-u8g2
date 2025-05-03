
void drawLabelTop(U8G2 u8g2, uint8_t day)
{
    u8g2.setFont(u8g2_font_5x8);
    switch (day)
    {
    case 0:
        u8g2.drawStr(46, 8, "Monday");
        break;
    case 1:
        u8g2.drawStr(44, 8, "Tuesday");
        break;
    case 2:
        u8g2.drawStr(39, 8, "Wednesday");
        break;
    case 3:
        u8g2.drawStr(41, 8, "Thursday");
        break;
    case 4:
        u8g2.drawStr(46, 8, "Friday");
        break;
    case 5:
        u8g2.drawStr(42, 8, "Saturday");
        break;
    case 6:
        u8g2.drawStr(46, 8, "Sunday");
        break;
    }

    u8g2.drawRFrame(u8g2.getDisplayWidth() / 4, -20, u8g2.getDisplayWidth() / 2, 32, 4);
}

void drawSignal(U8G2 u8g2, uint8_t strength)
{
    for (uint8_t i = 0; i < strength; i++)
    {
        u8g2.drawVLine(u8g2.getDisplayWidth() - 10 + i * 2, 6 - i, i);
    }
}

void drawMiniBattery(U8G2 u8g2, uint8_t level)
{
    u8g2.drawHLine(u8g2.getDisplayWidth() - 20, 2, 8);
    u8g2.drawPixel(u8g2.getDisplayWidth() - 20 + 8, 3);
    u8g2.drawPixel(u8g2.getDisplayWidth() - 20 + 8, 4);
    u8g2.drawPixel(u8g2.getDisplayWidth() - 20, 3);
    u8g2.drawPixel(u8g2.getDisplayWidth() - 20, 4);
    u8g2.drawHLine(u8g2.getDisplayWidth() - 20, 5, 8);

    u8g2.drawHLine(u8g2.getDisplayWidth() - 19, 3, level % 8);
    u8g2.drawHLine(u8g2.getDisplayWidth() - 19, 4, level % 8);
}

void drawTime(U8G2 u8g2)
{
    u8g2.setFont(u8g2_font_courB24);

    u8g2.drawStr(15, 41, "08:" + (counter % 60 < 10 ? "0" : "") + counter % 60);
}

void drawTemp(U8G2 u8g2, float value)
{
    u8g2.setFont(u8g2_font_5x8);
    u8g2.drawStr(1, u8g2.getDisplayHeight() - 1, "" + value + "C");

    u8g2.drawRFrame(-4, u8g2.getDisplayHeight() - 11, 64, 24, 4);
}

void drawPres(U8G2 u8g2, float value)
{
    u8g2.setFont(u8g2_font_5x8);
    u8g2.drawStr(u8g2.getDisplayWidth() - ("" + value + "mb").length * 5, u8g2.getDisplayHeight() - 1, "" + value + "mb");

    u8g2.drawRFrame(u8g2.getDisplayWidth() / 2 + 4, u8g2.getDisplayHeight() - 11, 64, 24, 4);
}

void draw(U8G2 u8g2)
{
    u8g2.setDrawColor(1);
    drawLabelTop(u8g2, counter % 7);
    drawSignal(u8g2, counter % 7);
    drawMiniBattery(u8g2, counter);
    drawTime(u8g2);
    drawTemp(u8g2, 23.4);
    drawPres(u8g2, 1024.3);
}