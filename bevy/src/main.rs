use std::sync::atomic::{self, AtomicU16};

use bevy::{
    dev_tools::fps_overlay::{FpsOverlayConfig, FpsOverlayPlugin},
    diagnostic::{DiagnosticsStore, FrameTimeDiagnosticsPlugin},
    prelude::*,
    sprite::{MaterialMesh2dBundle, Mesh2dHandle},
};
use rand::Rng;


static atomic_counter: AtomicU16 = AtomicU16::new(0);

#[derive(Component)]
struct Ball;

#[derive(Component, Deref, DerefMut)]
struct Velocity(Vec2);


fn setup(
    mut commands: Commands,
) {
    commands.spawn(Camera2dBundle::default());
}

fn check_for_collisions(
    mut ball_query: Query<(&mut Velocity, &Transform), With<Ball>>,
    window: Query<&Window>,
) {
    for (mut velocity, transform) in ball_query.iter_mut() {
        if transform.translation.x > 500.0 || transform.translation.x < -500.0 {
            velocity.x = -velocity.x;
        }
        if transform.translation.y > 400.0 || transform.translation.y < -400.0 {
            velocity.y = -velocity.y;
        }
    }
}

fn apply_velocity(mut query: Query<(&mut Transform, &Velocity)>, time: Res<Time>) {
    for (mut transform, velocity) in &mut query {
        transform.translation.x += velocity.x * time.delta_seconds();
        transform.translation.y += velocity.y * time.delta_seconds();
    }
}

fn check_fps_and_control_quantity(
    mut commands: Commands,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<ColorMaterial>>,
    diagnostics: Res<DiagnosticsStore>,
) {
    if let Some(value) = diagnostics
        .get(&FrameTimeDiagnosticsPlugin::FPS)
        .and_then(|fps| fps.smoothed())
    {
        if value > 60.0 {
            for _ in 1..100 {
              atomic_counter.fetch_add(1, atomic::Ordering::Relaxed);
              let mut rng = rand::thread_rng();
              let ball_mesh = Mesh2dHandle(meshes.add(Circle { radius: 4.0 }));
              commands.spawn((
                  MaterialMesh2dBundle {
                      mesh: ball_mesh,
                      material: materials.add(Color::hsl(1.0, 0.0, 1.0)),
                      ..Default::default()
                  },
                  Ball,
                  Velocity(Vec2::new(
                      rng.gen_range(-40.0..40.0),
                      rng.gen_range(-40.0..40.0),
                  )),
              ));
            }
            println!("Ball count: {}", atomic_counter.load(atomic::Ordering::Relaxed));
        }
    }
}

fn main() {
    App::new()
        .add_plugins(DefaultPlugins)
        .add_systems(Startup, setup)
        .add_systems(
            FixedUpdate,
            (
                apply_velocity,
                check_for_collisions,
                check_fps_and_control_quantity,
            )
                .chain(),
        )
        .add_plugins(FpsOverlayPlugin {
            config: FpsOverlayConfig {
                ..Default::default()
            },
        })
        .run();
}
