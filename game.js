/*---------משתנים גלובאליים ------------*/

let count_found = 0
let my_points = 0;
let timerInterval;
let secondsPassed = 0;
let new_arr = [];
let arr_length;


/*---------------פונקציות------------------*/



// מעדכן תצוגת זמן על המסך
function updateTimerDisplay() {
    const minutes = String(Math.floor(secondsPassed / 60)).padStart(2, '0');
    const seconds = String(secondsPassed % 60).padStart(2, '0');
    document.querySelector("#game_timer").innerText = `${minutes}:${seconds}`;
}

// מעדכן נקודות
function updatePoints() {
    document.querySelector("#points").innerText = ` ⭐:${my_points}`;
}

// מפעיל את הטיימר
function startGameTimer() {
    secondsPassed = 0;
    updateTimerDisplay();
    stopGameTimer();
    timerInterval = setInterval(() => {
        secondsPassed++;
        updateTimerDisplay();
    }, 1000);
}

// עוצר את הטיימר
function stopGameTimer() {
    clearInterval(timerInterval);
}

// מאפס את הטיימר
function resetGameTimer() {
    stopGameTimer();
    secondsPassed = 0;
    updateTimerDisplay();
}

//  קטגוריה
const print_cat = (links_cat) => {

    const container_cat = document.querySelector("#container_cat")

    links_cat.forEach(btn => {
        // יצירה button
        const btn_cat = document.createElement("button")
        btn_cat.classList.add("cat_cards")
        btn_cat.classList.add("col-4")

        // יצירה img
        const img_cat = document.createElement("img")
        img_cat.classList.add('img_cat')
        img_cat.src = btn.link
        img_cat.alt = btn.cat

        btn_cat.append(img_cat)
        if (container_cat)
            container_cat.append(btn_cat)

        btn_cat.onclick = () => {
            cards_arr.forEach(card => card.cnt = 0);
            arr = cards_arr.filter(obj => obj.cat === btn.cat);
            arr_length = arr.length;
            document.querySelector("#cat_main").classList.add("not_show");
            console.log(arr);
            print_cards(arr);
        }
    })

}

const create_winner = () => {
    let Uname = new URLSearchParams(location.search).get("name");
    let win = JSON.parse(localStorage.getItem("winners"))||[];
    win.push({ "name": Uname, "score": secondsPassed/my_points, "date": new Date().toLocaleDateString()});
    win.sort((a, b) => a.score - b.score);
    localStorage.setItem("winners", JSON.stringify(win.slice(0, 5)));
    location.href = `private.html?name=${Uname} `;
}

//  ...בסיום משחק
const stop = () => {
    stopGameTimer();
    alert(`המשחק הסתיים! הזמן שעבר: ${document.querySelector("#game_timer").innerText}`);
    document.querySelector("#all_cards").innerHTML = "";
    document.querySelector("#all_cards").classList.add("not_show");
    document.querySelector("#cat_main").classList.remove("not_show");
    create_winner();
    my_points = 0;
    updatePoints();
    resetGameTimer();

}


//בדיקת התאמה
const check_same = (first_card, second_card, btn_first_card, btn_second_card) => {
    const giff_stars = document.querySelector("#wow");
    let flag = false
    let cnt_same = 0
    if (first_card.link == second_card.link) {
        btn_first_card.classList.add("found")
        btn_second_card.classList.add("found")
        flag = true
        btn_first_card.disabled = true
        btn_second_card.disabled = true
        my_points += 5;
        count_found++;
        updatePoints();
        if (count_found == arr_length) {
            alert("wowwwwwwwwwwwwwwwwwwwwwww ");
            stop();
            document.querySelector("#cat_main").classList.remove("not_show");
            document.querySelector("#all_cards").classList.add("not_show");
        }
    }
    else {
        const img1 = btn_first_card.querySelector("img")
        const img2 = btn_second_card.querySelector("img")
        img1.src = first_card.cover
        img2.src = second_card.cover
    }
    document.querySelectorAll(".btn_cards").forEach(x => {
        if (flag == false) {
            x.disabled = false
        }
        else {
            if (x != btn_first_card && x != btn_second_card) {
                x.disabled = false
            }
        }
    }
    )
}

//כרטיסים
const print_cards = (new_arr) => {
    const container_cards = document.querySelector("#all_cards");
    container_cards.innerHTML = "";

    startGameTimer();

    let count = 0;

    let cnt_cards = 0
    let first_card
    let second_card
    let btn_first_card
    let btn_second_card
    while (count < new_arr.length * 2) {
        const index = getRandomNumber(0, new_arr.length - 1);
        const obj = new_arr[index];

        if (obj.cnt < 2) {
            obj.cnt++;

            // יצירה button
            const btn_card = document.createElement("button");
            btn_card.classList.add("btn_cards");
            btn_card.classList.add("cover");

            // יצירה img
            const img_card = document.createElement("img");
            img_card.classList.add("card");
            img_card.src = obj.cover
            img_card.alt = obj.cat;

            btn_card.appendChild(img_card);
            all_cards.appendChild(btn_card);

            count++; // רק אם באמת הוספנו כרטיס

            btn_card.onclick = () => {

                img_card.src = obj.link;
                cnt_cards++;

                if (cnt_cards == 2) {

                    second_card = obj;
                    btn_second_card = btn_card;
                    cnt_cards = 0;
                    document.querySelectorAll(".btn_cards").forEach(x => {
                        x.disabled = true
                    })
                    //טיימר להשאיר כמה שניות
                    setTimeout(() => { check_same(first_card, second_card, btn_first_card, btn_second_card) }, 2000)
                }
                else {
                    first_card = obj;
                    btn_first_card = btn_card;
                    btn_first_card.disabled = true;
                }
            }
        }
    }
};


//כפתור סיום משחק
document.querySelector("#stop_game").onclick = () => {
    stop();
}

// כפתור יציאה
document.querySelector("#exit").onclick = () => {
    window.location.href = "form.html";
}
print_cat(links_cat)

//פונקציה רנדומלית
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


