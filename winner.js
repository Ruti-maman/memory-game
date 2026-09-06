const winnersList = document.querySelector('#five_winners');
const winners = JSON.parse(localStorage.getItem('winners')) || [];

winners.forEach(winner => {
    const item = document.createElement('li');
    item.innerText = `${winner.date}: ${winner.name}      ${winner.score}`;
    winnersList.append(item);
});

const userName = new URLSearchParams(location.search).get('name') || 'שחקן';

const changePlayerButton = document.querySelector('#cange_playing');
if (changePlayerButton) {
    changePlayerButton.onclick = () => {
        window.location.href = 'home.html';
    };
}

const replayButton = document.querySelector('#link');
if (replayButton) {
    replayButton.onclick = () => {
        window.location.href = `game.html?name=${encodeURIComponent(userName)}`;
    };
}
