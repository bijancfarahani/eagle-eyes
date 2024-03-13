use instant::{Duration, Instant};

#[derive(PartialEq, Default)]
pub enum GameState {
    #[default]
    NotStarted,
    Memorizing,
    Spelling,
    Win,
    Lose,
}

#[derive(Copy, Clone, Default, PartialEq)]
pub struct Card {
    pub letter: char,
    pub is_visible: bool,
    id: u8,
}

pub struct GameContext {
    deck: Deck,
    winning_string: String,
    memorize_duration: Duration,
    game_start_time: Instant,
    game_state: GameState,
    target_letter_index: usize,
}

impl GameContext {
    pub fn deck(&self) -> &Deck {
        &self.deck
    }

    pub fn deck_(&self) -> Deck {
        self.deck
    }

    pub fn winning_string(&self) -> &String {
        &self.winning_string
    }

    pub fn process_card_selection(&mut self, selected_card: &Card) {
        match self.deck.iter().find(|&card| card == selected_card) {
            None => {
                panic!("Could not find card");
            }
            Some(card) => {
                let target_letter = self
                    .winning_string()
                    .chars()
                    .nth(self.target_letter_index)
                    .unwrap();
                if card.letter != target_letter {
                    self.game_state = GameState::Lose;
                    return;
                } else {
                    self.target_letter_index += 1;
                    if self.target_letter_index == self.winning_string.chars().count() {
                        self.game_state = GameState::Win;
                    }
                }
            }
        }
    }

    pub fn game_state(&self) -> &GameState {
        &self.game_state
    }

    pub fn remaining_memorization_time(&self) -> u64 {
        (self.memorize_duration - self.game_start_time.elapsed()).as_secs()
    }

    pub fn start_game(&mut self) {
        // Create the game "phrase" to be constructed by the player.
        self.deck = get_initial_deck();
        self.winning_string.clear();
        for card in self.deck {
            self.winning_string.push(card.letter);
        }
        scramble_deck(&mut self.deck);
        self.target_letter_index = 0;
        self.game_start_time = Instant::now();
        self.game_state = GameState::Memorizing;
    }

    pub fn hide_letters(&mut self) {
        _hide_letters(&mut self.deck);
        self.game_state = GameState::Spelling;
    }
}

impl Default for GameContext {
    fn default() -> Self {
        GameContext {
            game_state: GameState::default(),
            deck: Deck::default(),
            winning_string: String::default(),
            target_letter_index: 0,
            memorize_duration: Duration::new(5, 0),
            game_start_time: Instant::now(),
        }
    }
}

// PUBLIC //

// PRIVATE //

pub type Deck = [Card; 9];

fn scramble_deck(deck: &mut Deck) {
    use rand::seq::SliceRandom;
    use rand::thread_rng;
    deck.shuffle(&mut thread_rng());
}

fn get_initial_deck() -> Deck {
    [
        Card {
            letter: 'E',
            is_visible: true,
            id: 0,
        },
        Card {
            letter: 'A',
            is_visible: true,
            id: 1,
        },
        Card {
            letter: 'G',
            is_visible: true,
            id: 2,
        },
        Card {
            letter: 'L',
            is_visible: true,
            id: 3,
        },
        Card {
            letter: 'E',
            is_visible: true,
            id: 4,
        },
        Card {
            letter: 'E',
            is_visible: true,
            id: 5,
        },
        Card {
            letter: 'Y',
            is_visible: true,
            id: 6,
        },
        Card {
            letter: 'E',
            is_visible: true,
            id: 7,
        },
        Card {
            letter: 'S',
            is_visible: true,
            id: 8,
        },
    ]
}

fn _hide_letters(deck: &mut Deck) {
    for card in deck.iter_mut() {
        card.is_visible = false;
    }
}
