#pragma once

#include "Graphics.h"

class Ball {
public:
	float x;
	float y;
	float vx;
	float vy;

	Ball();

	void draw(Graphics& gfx);
	void update();
};
