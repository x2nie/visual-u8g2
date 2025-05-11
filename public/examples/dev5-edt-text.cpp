
void setup(void) {
    //u8g2.begin(/* menu_select_pin= */ 5, /* menu_next_pin= */ 4, /* menu_prev_pin= */ 2, /* menu_home_pin= */ 3);
    //u8g2.setFont(u8g2_font_helvB12_tr);
}

static const unsigned char img_notebook[] = {3,4,4,4,4,4,3};
static const unsigned char phonebook_1[] = {0,224,3,0,0,192,1,0,0,32,28,254,0,48,7,0,0,60,224,1,7,200,15,0,0,34,64,0,8,244,27,0,0,66,64,254,9,234,29,0,0,66,64,0,8,197,62,0,0,66,64,254,136,130,47,0,0,66,64,0,76,1,47,0,0,66,64,254,108,1,22,0,0,66,64,0,172,3,20,0,0,194,67,0,180,7,10,0,0,2,92,0,180,13,5,0,0,254,255,255,187,155,2,0,0,252,255,255,121,127,1,0};

void draw(const char *s) {
    int b = 20;
    u8g2.setDrawColor(1);

    u8g2.setFont(nokia_3310_big);
    // u8g2.drawStr(8, 16, "2xClick Me");
    u8g2.drawStr(6, 18, "Tel. seznam");

    u8g2.drawXBM(8, 23, 64, 14, phonebook_1);

    u8g2.setFont(nokia_3310_small_bold);
    u8g2.drawStr(26, 47, "Zvolit");

    // u8g2.drawXBM(0, 0, 4, 6, number_5);
    u8g2.setFont(nokia_3310_menu);
    u8g2.drawStr(78, 6, "1");
    
    // u8g2.drawLine(81, 8, 82, 8);
    
    // u8g2.drawLine(83, 9, 83, 14);
    
    // u8g2.drawLine(81, 14, 82, 14);

    u8g2.drawXBM(81, 7, 3, 7, img_notebook);

    u8g2.drawLine(81, 14, 81, 38);

    // u8g2.drawLine(81, 17, 81, 41);
    // u8g2.drawXBM(20, 0, 10, 7, number_e);
    // u8g2.drawXBM(30, 0, 16, 6, number_123);
   
}


void loop(void) {
    // u8g2.setDisplayRotation(U8G2_R0);
    // u8g2.setFlipMode(0);
    draw("R0, F0");
}