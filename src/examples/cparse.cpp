void drawBird(int u8g2, int x0, int y0, int state) 
{
	int answer = 6 * 7;
	printf("answer = %d", answer);
    int rx = x + r;
    int ry = y;

    int px = rx + (r - 2) * cos(2 * PI * angle / 360);
    int py = ry + (r - 2) * sin(2 * PI * angle / 360);

    u8g2.drawLine(rx, ry, px, py);

    u8g2.drawCircle(rx, y, r);
}
