pub mod game_deck {
    use rand::seq::SliceRandom;
    use rand::thread_rng;
    #[derive(Copy, Clone)]
    pub struct Card {
        pub letter: char,
        pub is_visible: bool,
    }
    pub type Deck = [Card; 9];

    pub fn get_scrambled_deck() -> Deck {
        let mut deck = initial_deck();
        deck.shuffle(&mut thread_rng());
        deck
    }

    pub fn initial_deck() -> Deck {
        [
            Card {
                letter: 'E',
                is_visible: true,
            },
            Card {
                letter: 'A',
                is_visible: true,
            },
            Card {
                letter: 'G',
                is_visible: true,
            },
            Card {
                letter: 'L',
                is_visible: true,
            },
            Card {
                letter: 'E',
                is_visible: true,
            },
            Card {
                letter: 'E',
                is_visible: true,
            },
            Card {
                letter: 'Y',
                is_visible: true,
            },
            Card {
                letter: 'E',
                is_visible: true,
            },
            Card {
                letter: 'S',
                is_visible: true,
            },
        ]
    }
    pub fn hide_letters(deck: &mut Deck) {
        for card in deck.iter_mut() {
            card.is_visible = false;
        }
    }
}
