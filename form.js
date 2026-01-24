

const regex = (name_) => {
    console.log("gf")
    return /^[א-תa-zA-Z\d\s]+$/.test(name_)
}

const func = () => {
    document.querySelector("#send_form").onsubmit = (e) => {
        e.preventDefault();
        console.log("start")
        const val=document.querySelector('#fname_input').value
        if (!regex(val)) {
            console.log("drfdf")
            document.querySelector("#name_not_valid").classList.add("open")
            document.querySelector("#fname_input").value = ""
        }
        else {
            console.log("else")
            let user = {
                name: document.querySelector('#fname_input').value,
                pass: document.querySelector('#password_input').value
            }
            let userObj = JSON.parse(localStorage.getItem('users')) || [];
            userObj.push(user)
            localStorage.setItem("users", JSON.stringify(userObj));
            document.querySelector("#send_form").reset();
            console.log(user);
            window.location.href = `game.html?name=${user.name}`;
            my_points = 0;
        }
    }
}
func()









