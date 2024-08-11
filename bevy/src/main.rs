use bevy::{
    dev_tools::fps_overlay::{FpsOverlayConfig, FpsOverlayPlugin},
    diagnostic::{DiagnosticsStore, FrameTimeDiagnosticsPlugin},
    prelude::*,
    sprite::{MaterialMesh2dBundle, Mesh2dHandle},
    window::{PresentMode, WindowResolution},
};
use rand::{Rng, SeedableRng};
use rand_chacha::ChaCha8Rng;

#[derive(Resource)]
struct Counter {
    pub count: u32,
}

#[derive(Component)]
struct CounterStats;

#[derive(Resource)]
struct BallResource {
    mesh_handle: Mesh2dHandle,
    material_handle: Handle<ColorMaterial>,
    rng: ChaCha8Rng,
}

#[derive(Component)]
struct Ball;

#[derive(Component, Deref, DerefMut)]
struct Velocity(Vec2);

fn setup(
    mut commands: Commands,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<ColorMaterial>>,
) {
    let ball_mesh = Mesh2dHandle(meshes.add(Circle { radius: 4.0 }));
    let material = materials.add(Color::hsl(1.0, 0.0, 1.0));
    let ball_resource = BallResource {
        mesh_handle: ball_mesh,
        material_handle: material,
        rng: ChaCha8Rng::seed_from_u64(15),
    };
    let text_section = move |color: Color, value: &str| {
        TextSection::new(
            value,
            TextStyle {
                font_size: 40.0,
                color: color.into(),
                ..default()
            },
        )
    };

    commands.spawn(Camera2dBundle::default());
    commands.insert_resource(ball_resource);
    commands
        .spawn(NodeBundle {
            style: Style {
                position_type: PositionType::Absolute,
                padding: UiRect::all(Val::Px(5.0)),
                right: Val::Px(5.0),
                ..default()
            },
            z_index: ZIndex::Global(i32::MAX),
            background_color: Color::BLACK.with_alpha(0.75).into(),
            ..default()
        })
        .with_children(|c| {
            c.spawn((
                TextBundle::from_sections([
                    text_section(Color::hsl(0.5, 1.0, 1.0), "Balls count: "),
                    text_section(Color::hsl(0.5, 1.0, 1.0), "0"),
                ]),
                CounterStats,
            ));
        });
}

fn check_for_collisions(
    mut ball_query: Query<(&mut Velocity, &Transform), With<Ball>>,
    windows: Query<&Window>,
) {
    let window = windows.single();
    let half_window = 0.5 * window.size();

    for (mut velocity, transform) in ball_query.iter_mut() {
        if transform.translation.x > half_window.x || transform.translation.x < -half_window.x {
            velocity.x = -velocity.x;
        }
        if transform.translation.y > half_window.y || transform.translation.y < -half_window.y {
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
    mut ball_resource: ResMut<BallResource>,
    mut counter: ResMut<Counter>,
    diagnostics: Res<DiagnosticsStore>,
) {
    if let Some(value) = diagnostics
        .get(&FrameTimeDiagnosticsPlugin::FPS)
        .and_then(|fps| fps.smoothed())
    {
        if value > 60.0 {
            let balls_batch = (0..100)
                .map(|_| {
                    commands.spawn((
                        SpriteBundle {
                            ..Default::default()
                        },
                        // MaterialMesh2dBundle {
                        //     mesh: ball_resource.mesh_handle.clone(),
                        //     material: ball_resource.material_handle.clone(),
                        //     ..Default::default()
                        // },
                        Ball,
                        Velocity(Vec2::new(
                            ball_resource.rng.gen_range(-60.0..60.0),
                            ball_resource.rng.gen_range(-60.0..60.0),
                        )),
                    ));
                })
                .collect::<Vec<_>>();
            commands.spawn_batch(balls_batch);
            counter.count += 100;
        }
    }
}

fn counter_system(mut query: Query<&mut Text, With<CounterStats>>, counter: Res<Counter>) {
    let mut text = query.single_mut();
    text.sections[1].value = counter.count.to_string();
}

fn main() {
    App::new()
        .add_plugins(DefaultPlugins.set(WindowPlugin {
            primary_window: Some(Window {
                resolution: WindowResolution::new(1920.0, 1080.0),
                present_mode: PresentMode::AutoNoVsync,
                ..Default::default()
            }),
            ..Default::default()
        }))
        .insert_resource(Counter { count: 0 })
        .add_systems(Startup, setup)
        .add_systems(
            FixedUpdate,
            (
                apply_velocity,
                check_for_collisions,
                check_fps_and_control_quantity,
                counter_system,
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
