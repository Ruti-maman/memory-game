/*--------- משתנים גלובאליים ------------*/

let count_found = 0;
let my_points = 0;
let timerInterval;
let secondsPassed = 0;
let arr_length = 0;
let gameStarted = false;

/*--------------- פונקציות ------------------*/

function updateTimerDisplay() {
    const minutes = String(Math.floor(secondsPassed / 60)).padStart(2, '0');
    const seconds = String(secondsPassed % 60).padStart(2, '0');
    document.querySelector('#game_timer').innerText = `${minutes}:${seconds}`;
}

function updatePoints() {
    document.querySelector('#points').innerText = `⭐:${my_points}`;
}

function startGameTimer() {
    secondsPassed = 0;
    updateTimerDisplay();
    stopGameTimer();
    timerInterval = setInterval(() => {
        secondsPassed++;
        updateTimerDisplay();
    }, 1000);
}

function stopGameTimer() {
    clearInterval(timerInterval);
}

function resetGameTimer() {
    stopGameTimer();
    secondsPassed = 0;
    updateTimerDisplay();
}

const print_cat = (links) => {
    const container = document.querySelector('#container_cat');

    links.forEach(category => {
        const button = document.createElement('button');
        button.type = 'button';
        button.classList.add('cat_cards', 'col-4');
        button.setAttribute('aria-label', `התחלת משחק בקטגוריית ${category.cat}`);

        const image = document.createElement('img');
        image.classList.add('img_cat');
        image.src = category.link;
        image.alt = category.cat;

        button.append(image);
        container.append(button);

        button.onclick = () => {
            cards_arr.forEach(card => card.cnt = 0);
            const selectedCards = cards_arr.filter(card => card.cat === category.cat);
            // Warm the browser cache so the first flips don't wait on a network fetch.
            selectedCards.forEach(card => {
                new Image().src = card.link;
                new Image().src = card.cover;
            });
            arr_length = selectedCards.length;
            count_found = 0;
            my_points = 0;
            gameStarted = true;
            updatePoints();
            document.querySelector('#cat_main').classList.add('not_show');
            document.querySelector('#all_cards').classList.remove('not_show');
            print_cards(selectedCards);
        };
    });
};

const create_winner = () => {
    const userName = new URLSearchParams(location.search).get('name') || 'שחקן';
    const winners = JSON.parse(localStorage.getItem('winners')) || [];
    const score = my_points > 0 ? secondsPassed / my_points : secondsPassed;
    winners.push({ name: userName, score, date: new Date().toLocaleDateString() });
    winners.sort((a, b) => a.score - b.score);
    localStorage.setItem('winners', JSON.stringify(winners.slice(0, 5)));
    location.href = `private.html?name=${encodeURIComponent(userName)}`;
};

const stop = () => {
    if (!gameStarted) {
        document.querySelector('#cat_main').classList.remove('not_show');
        return;
    }

    stopGameTimer();
    alert(`המשחק הסתיים! הזמן שעבר: ${document.querySelector('#game_timer').innerText}`);
    document.querySelector('#all_cards').innerHTML = '';
    document.querySelector('#all_cards').classList.add('not_show');
    document.querySelector('#cat_main').classList.remove('not_show');
    gameStarted = false;
    create_winner();
    my_points = 0;
    count_found = 0;
    updatePoints();
    resetGameTimer();
};

const check_same = (firstCard, secondCard, firstButton, secondButton) => {
    const isMatch = firstCard.link === secondCard.link;

    const enableRemaining = () => {
        document.querySelectorAll('.btn_cards').forEach(button => {
            if (!button.classList.contains('found')) button.disabled = false;
        });
    };

    if (isMatch) {
        firstButton.classList.add('found');
        secondButton.classList.add('found');
        firstButton.disabled = true;
        secondButton.disabled = true;
        my_points += 5;
        count_found++;
        updatePoints();
        enableRemaining();
    } else {
        const firstImg = firstButton.querySelector('img');
        const secondImg = secondButton.querySelector('img');
        revealCard(firstImg, firstCard.cover, 'קלף סגור');
        // Only re-enable the rest of the board once both cards finish flipping back down.
        revealCard(secondImg, secondCard.cover, 'קלף סגור', enableRemaining);
    }

    if (isMatch && count_found === arr_length) {
        setTimeout(() => {
            alert('כל הכבוד! מצאת את כל הזוגות');
            stop();
        }, 250);
    }
};

const print_cards = (cards) => {
    const container = document.querySelector('#all_cards');
    container.innerHTML = '';
    container.classList.remove('not_show');
    startGameTimer();

    let count = 0;
    let selectedCount = 0;
    let firstCard;
    let firstButton;

    while (count < cards.length * 2) {
        const index = getRandomNumber(0, cards.length - 1);
        const card = cards[index];

        if (card.cnt >= 2) continue;
        card.cnt++;

        const button = document.createElement('button');
        button.type = 'button';
        button.classList.add('btn_cards', 'cover');
        button.setAttribute('aria-label', `קלף זיכרון ${count + 1}`);

        const image = document.createElement('img');
        image.classList.add('card');
        image.src = card.cover;
        image.alt = 'קלף סגור';

        button.appendChild(image);
        container.appendChild(button);
        count++;

        button.onclick = () => {
            if (button.disabled) return;

            selectedCount++;
            button.disabled = true;
            revealCard(image, card.link, card.cat);

            if (selectedCount === 1) {
                firstCard = card;
                firstButton = button;
                return;
            }

            const secondCard = card;
            const secondButton = button;
            selectedCount = 0;

            document.querySelectorAll('.btn_cards').forEach(item => item.disabled = true);

            // Short pause so both cards stay clearly visible, then check the match.
            setTimeout(() => {
                check_same(firstCard, secondCard, firstButton, secondButton);
            }, 220);
        };
    }
};

document.querySelector('#stop_game').onclick = stop;

document.querySelector('#exit').onclick = () => {
    stopGameTimer();
    window.location.href = 'home.html';
};

print_cat(links_cat);
updateTimerDisplay();

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function revealCard(image, src, alt, onDone) {
    image.classList.add('card-fade');
    setTimeout(() => {
        image.src = src;
        image.alt = alt;
        requestAnimationFrame(() => image.classList.remove('card-fade'));
        if (onDone) setTimeout(onDone, 130);
    }, 90);
}
