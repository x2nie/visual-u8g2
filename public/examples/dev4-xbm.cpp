
void setup(void) {
    //u8g2.begin(/* menu_select_pin= */ 5, /* menu_next_pin= */ 4, /* menu_prev_pin= */ 2, /* menu_home_pin= */ 3);
    //u8g2.setFont(u8g2_font_helvB12_tr);
}

static const unsigned char img_0075[] = {0,0,0,51,51,51,51,51,51,51,62,0,0};
static const unsigned char img_0070[] = {0,0,0,31,51,51,51,51,51,51,31,3,3};
static const unsigned char img_0065[] = {0,0,0,30,51,51,63,3,3,35,30,0,0};
static const unsigned char img_0069[] = {3,3,0,3,3,3,3,3,3,3,3,0,0};
static const unsigned char img_0054[] = {63,12,12,12,12,12,12,12,12,12,12,0,0};
static const unsigned char img_0061[] = {0,0,0,30,48,48,62,51,51,51,62,0,0};

static const unsigned char img_0079[] = {0,0,27,27,27,30,24,14};
static const unsigned char img_00f2[] = {2,4,14,27,27,27,14,0};
static const unsigned char img_0042[] = {15,27,15,27,27,27,15,0};
static const unsigned char img_006d[] = {0,0,0,0,127,0,219,0,219,0,219,0,219,0,0,0};
static const unsigned char img_0073[] = {0,0,14,3,15,12,7,0};


// static const unsigned char number_e[] U8X8_PROGMEM = {0, 0, 60, 0, 102, 0, 126, 0, 6, 0, 60, 0, 0, 0};
// static const unsigned char number_5[] U8X8_PROGMEM = {0x0f,0x01,0x07,0x08,0x09,0x06};
// static const unsigned char number_123[] U8X8_PROGMEM = {118, 8, 199, 28, 102, 62, 246, 8, 0, 8, 255, 7};
// static const unsigned char sewing_machine_shoe[] U8X8_PROGMEM = {0xfe,0xff,0xff,0x0f,0x01,0x00,0x00,0x10,0xc1,0x1f,0x03,0x0c,0xc1,0x9f,0x04,0x03,0x01,0x84,0xc4,0x00,0x01,0x84,0x3c,0x00,0x01,0x84,0x00,0x00,0x01,0x84,0x3c,0x00,0x01,0x84,0xc4,0x00,0xc1,0x9f,0x04,0x03,0xc1,0x1f,0x03,0x0c,0x01,0x00,0x00,0x10,0xfe,0xff,0xff,0x0f};
static const unsigned char phonebook_1[] = {0,224,3,0,0,192,1,0,0,32,28,254,0,48,7,0,0,60,224,1,7,200,15,0,0,34,64,0,8,244,27,0,0,66,64,254,9,234,29,0,0,66,64,0,8,197,62,0,0,66,64,254,136,130,47,0,0,66,64,0,76,1,47,0,0,66,64,254,108,1,22,0,0,66,64,0,172,3,20,0,0,194,67,0,180,7,10,0,0,2,92,0,180,13,5,0,0,254,255,255,187,155,2,0,0,252,255,255,121,127,1,0};

void draw(const char *s) {
    int b = 20;
    u8g2.setDrawColor(1);
    // u8g2.drawXBM(0, 0, 4, 6, number_5);
    // u8g2.drawXBM(0, 10, 29, 13, sewing_machine_shoe);
    u8g2.drawLine(80, 1, 80, 37);
    // u8g2.drawXBM(20, 0, 10, 7, number_e);
    // u8g2.drawXBM(30, 0, 16, 6, number_123);
    u8g2.drawXBM(8, 23, 64, 14, phonebook_1);
    u8g2.drawXBM(21, 6, 7, 13, img_0054);
	u8g2.drawXBM(55, 5, 3, 13, img_0069);
	u8g2.drawXBM(41, 5, 7, 13, img_0065);
	u8g2.drawXBM(34, 5, 7, 13, img_0070);
	u8g2.drawXBM(48, 5, 7, 13, img_0075);
	u8g2.drawXBM(21, 40, 9, 8, img_006d);
	u8g2.drawXBM(30, 40, 6, 8, img_0042);
	u8g2.drawXBM(36, 40, 6, 8, img_00f2);
	u8g2.drawXBM(42, 40, 6, 8, img_0079);
	u8g2.drawXBM(49, 40, 5, 8, img_0073);
	u8g2.drawXBM(27, 5, 7, 13, img_0061);
}


void loop(void) {
    // u8g2.setDisplayRotation(U8G2_R0);
    // u8g2.setFlipMode(0);
    draw("R0, F0");
}