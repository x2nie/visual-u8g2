
void draw(U8G2 u8g2) {
    u8g2.setDrawColor(1);
    // reference: https://github.com/olikraus/u8g2/wiki/fntgrpsiji
    u8g2.setFont(u8g2_font_siji_with_6x10);
    u8g2.drawGlyph(10, 24 , 0xe242 + counter%10);

    u8g2.setFont(u8g2_font_open_iconic_weather_4x);
    u8g2.drawGlyph(40, 40 , 0x0040 + (counter)%4);
}