use instant::{Duration, Instant};

mod game_deck {
    use rand::seq::SliceRandom;
    use rand::thread_rng;
    #[derive(Copy, Clone)]
    pub struct Card {
        pub letter: char,
        pub is_visible: bool,
        pub index: usize,
    }
    pub type Deck = [Card; 9];

    pub fn get_scrambled_deck() -> Deck {
        let mut deck = solved_deck();
        deck.shuffle(&mut thread_rng());
        deck
    }

    pub fn solved_deck() -> Deck {
        [
            Card {
                letter: 'E',
                is_visible: true,
                index: 0,
            },
            Card {
                letter: 'A',
                is_visible: true,
                index: 1,
            },
            Card {
                letter: 'G',
                is_visible: true,
                index: 2,
            },
            Card {
                letter: 'L',
                is_visible: true,
                index: 3,
            },
            Card {
                letter: 'E',
                is_visible: true,
                index: 4,
            },
            Card {
                letter: 'E',
                is_visible: true,
                index: 5,
            },
            Card {
                letter: 'Y',
                is_visible: true,
                index: 6,
            },
            Card {
                letter: 'E',
                is_visible: true,
                index: 7,
            },
            Card {
                letter: 'S',
                is_visible: true,
                index: 8,
            },
        ]
    }
    pub fn hide_letters(deck: &mut Deck) {
        for card in deck.iter_mut() {
            card.is_visible = false;
        }
    }
}

#[derive(PartialEq, Clone, Copy)]
pub enum GameScene {
    NotStarted,
    Memorizing,
    Spelling,
    Win,
    Lose,
}

pub struct GameState {
    pub deck: game_deck::Deck,
    win_phrase: String,
    memorize_duration: Duration,
    game_start_time: Instant,
    game_scene: GameScene,
    target_index: usize,
}

impl Default for GameState {
    fn default() -> Self {
        Self {
            deck: game_deck::solved_deck(),
            win_phrase: String::new(),
            memorize_duration: Duration::new(5, 0),
            game_start_time: Instant::now(),
            game_scene: GameScene::NotStarted,
            target_index: 0,
        }
    }
}

impl GameState {
    pub fn reset_game(&mut self) {
        *self = GameState::default();
    }

    pub fn start_game(&mut self) {
        // Reset to a clean state.
        // Note down the string that the player needs to spell,
        // ("EAGLEEYES by default")
        *self = GameState::default();
        for card in self.deck.iter() {
            self.win_phrase.push(card.letter);
        }

        // Scramble the deck and start the clock.
        self.deck = game_deck::get_scrambled_deck();
        self.game_start_time = Instant::now();
        self.game_scene = GameScene::Memorizing;
    }

    pub fn get_current_scene(&mut self) -> GameScene {
        if self.game_scene != GameScene::Memorizing
            || self.game_start_time.elapsed() < self.memorize_duration
        {
            return self.game_scene;
        }
        // The memorizing time has expired.  This function
        // needs to called by some driver code (the simplist way
        // is through the GUI thread which can call this on a
        // loop.  Otherwise, this module needs to add some timer
        // callback function to check the elapsed time and update the state.)
        game_deck::hide_letters(&mut self.deck);
        self.game_scene = GameScene::Spelling;

        self.game_scene
    }

    pub fn flip_card(&mut self, card_index: usize) {
        // TODO: This should be a find() by searching with card_index.
        for card in self.deck.iter_mut() {
            if card.index != card_index {
                continue;
            }
            // Flip the card over.
            card.is_visible = true;
            // Check if the flipped card has the next letter to spell out the
            // winning phrase.
            // The game ends when the player picks an incorrect letter.
            if card.letter != self.win_phrase.chars().nth(self.target_index).unwrap() {
                self.game_scene = GameScene::Lose;
            } else {
                // The player selected the correct letter.
                self.target_index += 1;
                // The game is won when the count of selected letters is as much
                // as the win phrase itself.
                if self.target_index == self.win_phrase.chars().count() {
                    self.game_scene = GameScene::Win;
                }
            }
        }
    }
}
