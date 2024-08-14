import pygame
import random

pygame.init()
width = 1920
height = 1080
screen = pygame.display.set_mode((width, height))
clock = pygame.time.Clock()
running = True

class Ball():
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.radius = 2
        self.velocity = pygame.math.Vector2(random.uniform(-1, 1), random.uniform(-1, 1)).normalize()
        

    def draw(self):
        pygame.draw.circle(screen, "white", (self.x, self.y), self.radius)

    def update(self):
        self.x += self.velocity.x
        self.y += self.velocity.y

        if self.x < 0 or self.x > width:
            self.velocity.x *= -1
        if self.y < 0 or self.y > height:
            self.velocity.y *= -1

balls = []
for i in range(1000):
    balls.append(Ball(random.randint(0, width), random.randint(0, height)))

while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    fps = clock.get_fps()
    if fps > 60:
        for i in range(100):
          balls.append(Ball(random.randint(0, width), random.randint(0, height)))
    print(int(fps), len(balls))

    screen.fill("black")
    for ball in balls:
        ball.update()
        ball.draw()
    pygame.display.flip()
    clock.tick(120)

pygame.quit()