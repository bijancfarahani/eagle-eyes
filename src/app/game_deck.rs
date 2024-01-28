

pub mod game_deck {
    use rand::seq::SliceRandom;
use rand::thread_rng;
    #[derive(Copy, Clone)]
    pub struct Card {
        letter: char,
        is_visible: bool,
    }
    pub type Deck = [Card; 9];
    pub fn initial_deck() -> Deck
    {
        return [
            Card {
                letter: 'E',
                is_visible: false,
            },
            Card {
                letter: 'A',
                is_visible: false,
            },
            Card {
                letter: 'G',
                is_visible: false,
            },
            Card {
                letter: 'L',
                is_visible: false,
            },
            Card {
                letter: 'E',
                is_visible: false,
            },
            Card {
                letter: 'E',
                is_visible: false,
            },
            Card {
                letter: 'Y',
                is_visible: false,
            },
            Card {
                letter: 'E',
                is_visible: false,
            },
            Card {
                letter: 'S',
                is_visible: false,
            }
        ];
    }
    pub fn hide_letters(deck: &mut Deck) -> () {
        for card in deck.iter_mut() {
            card.is_visible = false;
        }
    }
    pub fn scramble_deck(deck: &mut Deck) -> () {
        deck.shuffle(&mut thread_rng());
    }

}