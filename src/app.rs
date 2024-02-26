mod game_deck;
use crate::app::game_deck::game_deck::Deck;
use egui::Vec2;
use instant::{Duration, Instant};

#[derive(PartialEq)]
pub enum GameState {
    NotStarted,
    Memorizing,
    Spelling,
    Finished,
}

/// We derive Deserialize/Serialize so we can persist app state on shutdown.
#[derive(serde::Deserialize, serde::Serialize)]
#[serde(default)] // if we add new fields, give them default values when deserializing old state
pub struct TemplateApp {
    #[serde(skip)] // This how you opt-out of serialization of a field
    deck: Deck,
    #[serde(skip)]
    memorize_duration: Duration,
    #[serde(skip)]
    game_start_time: Instant,
    #[serde(skip)]
    game_state: GameState,
}
//ui.add(egui::Button::image(egui::Image::new(egui::include_image!("../assets/letters/e.png"))));

impl Default for TemplateApp {
    fn default() -> Self {
        Self {
            deck: game_deck::game_deck::get_scrambled_deck(),
            memorize_duration: Duration::new(5, 0),
            game_start_time: Instant::now(),
            game_state: GameState::NotStarted,
        }
    }
}

impl TemplateApp {
    /// Called once before the first frame.
    pub fn new(cc: &eframe::CreationContext<'_>) -> Self {
        // This is also where you can customize the look and feel of egui using
        // `cc.egui_ctx.set_visuals` and `cc.egui_ctx.set_fonts`.
        // This is used to support images.
        egui_extras::install_image_loaders(&cc.egui_ctx);

        // Load previous app state (if any).
        // Note that you must enable the `persistence` feature for this to work.
        if let Some(storage) = cc.storage {
            return eframe::get_value(storage, eframe::APP_KEY).unwrap_or_default();
        }

        Default::default()
    }

    fn starting_panel(&mut self, ctx: &egui::Context) {
        egui::CentralPanel::default().show(ctx, |ui| {
            ui.heading("Welcome to EAGLE EYES!");
            ui.add(egui::github_link_file!(
                "https://github.com/bijancfarahani/eagle_eyes/master/",
                "Source code."
            ));

            if ui.add(egui::Button::new("Start Game!")).clicked() {
                self.game_start_time = Instant::now();
                self.game_state = GameState::Memorizing;
            }
        });
    }

    fn central_panel(&mut self, ctx: &egui::Context) {
        egui::CentralPanel::default().show(ctx, |ui| {
            // Spell out EAGLE EYES.
            ui.horizontal_centered(|ui| {
                let pic_size = Vec2 { x: 250.0, y: 250.0 };
                let e_letter = egui::include_image!("../assets/letters/e.png");
                let a_letter = egui::include_image!("../assets/letters/a.png");
                let g_letter = egui::include_image!("../assets/letters/g.png");
                let l_letter = egui::include_image!("../assets/letters/l.png");
                let y_letter = egui::include_image!("../assets/letters/y.png");
                let s_letter = egui::include_image!("../assets/letters/s.png");
                let blank_image = egui::include_image!("../assets/letters/blank.png");

                for mut card in self.deck.as_mut() {
                    if card.is_visible == false {
                        if ui
                            .add(egui::Button::image(
                                egui::Image::new(blank_image.clone()).max_size(pic_size),
                            ))
                            .clicked()
                        {
                            card.is_visible = !card.is_visible;
                        }
                    } else {
                        match card.letter.to_ascii_lowercase() {
                            'e' => {
                                if ui
                                    .add(egui::Button::image(
                                        egui::Image::new(e_letter.clone()).max_size(pic_size),
                                    ))
                                    .clicked()
                                {
                                    card.is_visible = !card.is_visible;
                                }
                            }
                            'a' => {
                                if ui
                                    .add(egui::Button::image(
                                        egui::Image::new(a_letter.clone()).max_size(pic_size),
                                    ))
                                    .clicked()
                                {
                                    card.is_visible = !card.is_visible;
                                }
                            }
                            'g' => {
                                if ui
                                    .add(egui::Button::image(
                                        egui::Image::new(g_letter.clone()).max_size(pic_size),
                                    ))
                                    .clicked()
                                {
                                    card.is_visible = !card.is_visible;
                                }
                            }
                            'l' => {
                                if ui
                                    .add(egui::Button::image(
                                        egui::Image::new(l_letter.clone()).max_size(pic_size),
                                    ))
                                    .clicked()
                                {
                                    card.is_visible = !card.is_visible;
                                }
                            }
                            'y' => {
                                if ui
                                    .add(egui::Button::image(
                                        egui::Image::new(y_letter.clone()).max_size(pic_size),
                                    ))
                                    .clicked()
                                {
                                    card.is_visible = !card.is_visible;
                                }
                            }
                            's' => {
                                if ui
                                    .add(egui::Button::image(
                                        egui::Image::new(s_letter.clone()).max_size(pic_size),
                                    ))
                                    .clicked()
                                {
                                    card.is_visible = !card.is_visible;
                                }
                            }
                            _ => {
                                if ui
                                    .add(egui::Button::image(
                                        egui::Image::new(blank_image.clone()).max_size(pic_size),
                                    ))
                                    .clicked()
                                {
                                    card.is_visible = !card.is_visible;
                                }
                            }
                        };
                    }
                }
                ui.with_layout(egui::Layout::top_down_justified(egui::Align::LEFT), |ui| {
                    powered_by_egui_and_eframe(ui);
                    egui::warn_if_debug_build(ui);
                });
            });
        });
    }

    fn memorize_panel(&mut self, ctx: &egui::Context) {
        egui::CentralPanel::default().show(ctx, |ui| {
            // Spell out EAGLE EYES.
            ui.horizontal_centered(|ui| {
                let pic_size = Vec2 { x: 250.0, y: 250.0 };
                let e_letter = egui::include_image!("../assets/letters/e.png");
                let a_letter = egui::include_image!("../assets/letters/a.png");
                let g_letter = egui::include_image!("../assets/letters/g.png");
                let l_letter = egui::include_image!("../assets/letters/l.png");
                let y_letter = egui::include_image!("../assets/letters/y.png");
                let s_letter = egui::include_image!("../assets/letters/s.png");
                let blank_image = egui::include_image!("../assets/letters/blank.png");

                for mut card in self.deck.as_mut() {
                    match card.letter.to_ascii_lowercase() {
                        'e' => {
                            if ui
                                .add(egui::Button::image(
                                    egui::Image::new(e_letter.clone()).max_size(pic_size),
                                ))
                                .clicked()
                            {
                                //   card.is_visible = !card.is_visible;
                            }
                        }
                        'a' => {
                            if ui
                                .add(egui::Button::image(
                                    egui::Image::new(a_letter.clone()).max_size(pic_size),
                                ))
                                .clicked()
                            {
                                //   card.is_visible = !card.is_visible;
                            }
                        }
                        'g' => {
                            if ui
                                .add(egui::Button::image(
                                    egui::Image::new(g_letter.clone()).max_size(pic_size),
                                ))
                                .clicked()
                            {
                                //   card.is_visible = !card.is_visible;
                            }
                        }
                        'l' => {
                            if ui
                                .add(egui::Button::image(
                                    egui::Image::new(l_letter.clone()).max_size(pic_size),
                                ))
                                .clicked()
                            {
                                //   card.is_visible = !card.is_visible;
                            }
                        }
                        'y' => {
                            if ui
                                .add(egui::Button::image(
                                    egui::Image::new(y_letter.clone()).max_size(pic_size),
                                ))
                                .clicked()
                            {
                                //   card.is_visible = !card.is_visible;
                            }
                        }
                        's' => {
                            if ui
                                .add(egui::Button::image(
                                    egui::Image::new(s_letter.clone()).max_size(pic_size),
                                ))
                                .clicked()
                            {
                                //   card.is_visible = !card.is_visible;
                            }
                        }
                        _ => {
                            if ui
                                .add(egui::Button::image(
                                    egui::Image::new(blank_image.clone()).max_size(pic_size),
                                ))
                                .clicked()
                            {
                                //  card.is_visible = !card.is_visible;
                            }
                        }
                    };
                }
                ui.with_layout(egui::Layout::top_down_justified(egui::Align::LEFT), |ui| {
                    powered_by_egui_and_eframe(ui);
                    egui::warn_if_debug_build(ui);
                });
            });
        });
    }
}

impl eframe::App for TemplateApp {
    /// Called by the frame work to save state before shutdown.
    fn save(&mut self, storage: &mut dyn eframe::Storage) {
        eframe::set_value(storage, eframe::APP_KEY, self);
    }

    /// Called each time the UI needs repainting, which may be many times per second.
    fn update(&mut self, ctx: &egui::Context, _frame: &mut eframe::Frame) {
        // Put your widgets into a `SidePanel`, `TopBottomPanel`, `CentralPanel`, `Window` or `Area`.
        // For inspiration and more examples, go to https://emilk.github.io/egui

        egui::TopBottomPanel::top("top_panel").show(ctx, |ui| {
            // The top panel is often a good place for a menu bar:

            egui::menu::bar(ui, |ui| {
                // NOTE: no File->Quit on web pages!
                let is_web = cfg!(target_arch = "wasm32");
                if !is_web {
                    ui.menu_button("File", |ui| {
                        if ui.button("Quit").clicked() {
                            ctx.send_viewport_cmd(egui::ViewportCommand::Close);
                        }
                    });
                    ui.add_space(106.0);
                }

                egui::widgets::global_dark_light_mode_buttons(ui);
            });
        });

        match self.game_state {
            GameState::NotStarted => self.starting_panel(ctx),
            GameState::Memorizing => {
                if self.game_start_time.elapsed() < self.memorize_duration {
                    self.memorize_panel(ctx)
                } else {
                    self.game_state = GameState::Spelling;
                    game_deck::game_deck::hide_letters(&mut self.deck);
                }
            }
            GameState::Spelling => self.central_panel(ctx),
            GameState::Finished => {}
        }
    }
}

fn powered_by_egui_and_eframe(ui: &mut egui::Ui) {
    ui.horizontal(|ui| {
        ui.spacing_mut().item_spacing.x = 0.0;
        ui.label("Powered by ");
        ui.hyperlink_to("egui", "https://github.com/emilk/egui");
        ui.label(" and ");
        ui.hyperlink_to(
            "eframe",
            "https://github.com/emilk/egui/tree/master/crates/eframe",
        );
        ui.label(".");
    });
}
