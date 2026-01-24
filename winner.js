let winners = document.querySelector("#five_winners");
let win = JSON.parse(localStorage.getItem("winners")) || [];
win.forEach(element => {
    let li = document.createElement("li");
    li.innerText =  `${element.date}: ${element.name}      ${element.score}`;
    winners.append(li);
});

let Uname = new URLSearchParams(location.search).get("name");

// כפתור יציאה
let ex=document.querySelector("#cange_playing")
if(ex)
ex.onclick = () => {
    window.location.href = "form.html";
}


document.querySelector("#link").onclick = () => {
    window.location.href = `game.html?name=${Uname}`;
}