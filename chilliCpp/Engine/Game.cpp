/******************************************************************************************
 *	Chili DirectX Framework Version 16.07.20											  *
 *	Game.cpp																			  *
 *	Copyright 2016 PlanetChili.net <http://www.planetchili.net>							  *
 *																						  *
 *	This file is part of The Chili DirectX Framework.									  *
 *																						  *
 *	The Chili DirectX Framework is free software: you can redistribute it and/or modify	  *
 *	it under the terms of the GNU General Public License as published by				  *
 *	the Free Software Foundation, either version 3 of the License, or					  *
 *	(at your option) any later version.													  *
 *																						  *
 *	The Chili DirectX Framework is distributed in the hope that it will be useful,		  *
 *	but WITHOUT ANY WARRANTY; without even the implied warranty of						  *
 *	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the						  *
 *	GNU General Public License for more details.										  *
 *																						  *
 *	You should have received a copy of the GNU General Public License					  *
 *	along with The Chili DirectX Framework.  If not, see <http://www.gnu.org/licenses/>.  *
 ******************************************************************************************/
#include "MainWindow.h"
#include "Game.h"
#include <iostream>

Game::Game(MainWindow &wnd)
		: wnd(wnd),
			gfx(wnd)
{
	for (int i = 0; i < 100; i++) {
		balls.push_back(new Ball());
	}
	consecutiveLowerFPSFrames = 0;
	showedMaxBalls = false;
}

void Game::Go()
{
	frameStart = clock();

	gfx.BeginFrame();
	UpdateModel();
	ComposeFrame();
	gfx.EndFrame();

	frameEnd = clock();
	lastFrameTime = float(frameEnd - frameStart) / float(CLOCKS_PER_SEC);
}

void Game::UpdateModel()
{
	for (Ball* ball : balls) {
		ball->update();
	}
	if (lastFrameTime < 1.0/59.0) {
		consecutiveLowerFPSFrames = 0;
		for (int i = 0; i < 1000; i++) {
			balls.push_back(new Ball());
		}
	}
	else {
		consecutiveLowerFPSFrames++;
	}

	if (consecutiveLowerFPSFrames > 300 && !showedMaxBalls) {
		wnd.ShowMessageBox(L"Max amount of balls reached.", L"Amount of balls:" + std::to_wstring(balls.size()));
		showedMaxBalls = true;
	}
}

void Game::ComposeFrame()
{
	for (Ball* ball : balls) {
		ball->draw(gfx);
	}
}
