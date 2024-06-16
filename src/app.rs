mod eagle_eyes;
use crate::app::eagle_eyes::GameScene;
use crate::app::eagle_eyes::GameState;
use egui::Vec2;

pub struct EagleEyesApp {
    game_state: GameState,
}

impl Default for EagleEyesApp {
    fn default() -> Self {
        Self {
            game_state: GameState::default(),
        }
    }
}

impl EagleEyesApp {
    /// Called once before the first frame.
    pub fn new(cc: &eframe::CreationContext<'_>) -> Self {
        // This is also where you can customize the look and feel of egui using
        // `cc.egui_ctx.set_visuals` and `cc.egui_ctx.set_fonts`.

        // This is used to support images.
        egui_extras::install_image_loaders(&cc.egui_ctx);

        Default::default()
    }

    fn starting_panel(&mut self, ctx: &egui::Context) {
        egui::CentralPanel::default().show(ctx, |ui| {
            ui.heading("Welcome to EAGLE EYES!");

            if ui.add(egui::Button::new("Start Game!")).clicked() {
                self.game_state.start_game();
            }
        });
    }

    fn spelling_panel(&mut self, ctx: &egui::Context) {
        egui::CentralPanel::default().show(ctx, |ui| {
            ui.add(egui::Label::new(
                self.game_state.elapsed_spelling_time().to_string(),
            ));

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

                for card in self.game_state.deck {
                    // Draw hidden cards which the play may choose to flip over.
                    if !card.is_visible {
                        if ui
                            .add(egui::Button::image(
                                egui::Image::new(blank_image.clone()).max_size(pic_size),
                            ))
                            .clicked()
                        {
                            self.game_state.flip_card(card.index);
                        }
                    }
                    // Draw out the cards which the player already flipped over.
                    else {
                        match card.letter.to_ascii_lowercase() {
                            'e' => {
                                ui.add(egui::Button::image(
                                    egui::Image::new(e_letter.clone()).max_size(pic_size),
                                ));
                            }
                            'a' => {
                                ui.add(egui::Button::image(
                                    egui::Image::new(a_letter.clone()).max_size(pic_size),
                                ));
                            }
                            'g' => {
                                ui.add(egui::Button::image(
                                    egui::Image::new(g_letter.clone()).max_size(pic_size),
                                ));
                            }
                            'l' => {
                                ui.add(egui::Button::image(
                                    egui::Image::new(l_letter.clone()).max_size(pic_size),
                                ));
                            }
                            'y' => {
                                ui.add(egui::Button::image(
                                    egui::Image::new(y_letter.clone()).max_size(pic_size),
                                ));
                            }
                            's' => {
                                ui.add(egui::Button::image(
                                    egui::Image::new(s_letter.clone()).max_size(pic_size),
                                ));
                            }
                            _ => {
                                ui.add(egui::Button::image(
                                    egui::Image::new(blank_image.clone()).max_size(pic_size),
                                ));
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
                // Display the remaining time the player has to memorize the sequence.
                ui.add((egui::Label::new(self.game_state.memorize_time_remaining().to_string())));

                let pic_size = Vec2 { x: 250.0, y: 250.0 };
                let e_letter = egui::include_image!("../assets/letters/e.png");
                let a_letter = egui::include_image!("../assets/letters/a.png");
                let g_letter = egui::include_image!("../assets/letters/g.png");
                let l_letter = egui::include_image!("../assets/letters/l.png");
                let y_letter = egui::include_image!("../assets/letters/y.png");
                let s_letter = egui::include_image!("../assets/letters/s.png");
                let blank_image = egui::include_image!("../assets/letters/blank.png");

                for card in self.game_state.deck {
                    match card.letter.to_ascii_uppercase() {
                        'E' => {
                            ui.add(egui::Button::image(
                                egui::Image::new(e_letter.clone()).max_size(pic_size),
                            ));
                        }
                        'A' => {
                            ui.add(egui::Button::image(
                                egui::Image::new(a_letter.clone()).max_size(pic_size),
                            ));
                        }
                        'G' => {
                            ui.add(egui::Button::image(
                                egui::Image::new(g_letter.clone()).max_size(pic_size),
                            ));
                        }
                        'L' => {
                            ui.add(egui::Button::image(
                                egui::Image::new(l_letter.clone()).max_size(pic_size),
                            ));
                        }
                        'Y' => {
                            ui.add(egui::Button::image(
                                egui::Image::new(y_letter.clone()).max_size(pic_size),
                            ));
                        }
                        'S' => {
                            ui.add(egui::Button::image(
                                egui::Image::new(s_letter.clone()).max_size(pic_size),
                            ));
                        }
                        _ => {
                            ui.add(egui::Button::image(
                                egui::Image::new(blank_image.clone()).max_size(pic_size),
                            ));
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

    fn lose_panel(&mut self, ctx: &egui::Context) {
        egui::CentralPanel::default().show(ctx, |ui| {
            ui.heading("You LOSE!");

            if ui.add(egui::Button::new("Start Game!")).clicked() {
                self.game_state.reset_game();
            }
        });
    }
    fn win_panel(&mut self, ctx: &egui::Context) {
        egui::CentralPanel::default().show(ctx, |ui| {
            ui.heading("You WIN!");

            if ui.add(egui::Button::new("Start Game!")).clicked() {
                self.game_state.reset_game();
            }
        });
    }
}

impl eframe::App for EagleEyesApp {
    /// Called each time the UI needs repainting, which may be many times per second.
    fn update(&mut self, ctx: &egui::Context, _frame: &mut eframe::Frame) {
        // Put your widgets into a `SidePanel`, `TopBottomPanel`, `CentralPanel`, `Window` or `Area`.

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
                ui.add(egui::github_link_file!(
                    "https://github.com/bijancfarahani/eagle-eyes/tree/master/",
                    "Source code"
                ));
            });
        });

        match self.game_state.get_current_scene() {
            GameScene::NotStarted => self.starting_panel(ctx),
            GameScene::Memorizing => self.memorize_panel(ctx),
            GameScene::Spelling => self.spelling_panel(ctx),
            GameScene::Lose => self.lose_panel(ctx),
            GameScene::Win => self.win_panel(ctx),
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
