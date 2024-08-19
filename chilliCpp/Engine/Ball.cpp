#pragma once

#include "Ball.h"

Ball::Ball() {
	x = Graphics::ScreenWidth / 2;
	y = Graphics::ScreenHeight / 2;
	vx = (rand() % 200 - 100) / 100.0f;
	vy = (rand() % 200 - 100) / 100.0f;
};

void Ball::draw(Graphics& gfx) {
		gfx.PutPixel(x, y, Colors::Red);
}

void Ball::update() {
	x += vx;
	y += vy;

	if (y <= 0) {
		vy = -vy;
		y = 0;
	}
	if (y > Graphics::ScreenHeight - 1) {
		vy = -vy;
		y = Graphics::ScreenHeight - 1;
	}

	if (x <= 0) {
		vx = -vx;
		x = 0;
	}
	if (x > Graphics::ScreenWidth - 1) {
		vx = -vx;
		x = Graphics::ScreenWidth - 1;
	}
}
