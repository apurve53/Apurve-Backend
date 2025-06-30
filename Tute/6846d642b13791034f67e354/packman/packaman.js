let upper = document.getElementById("pos");
let lower = document.getElementById("neg");
let container = document.getElementById("container");
let left = 0;
setInterval(() => {
    container.style.left = `${left++}px`
    if (upper.style.transform == "rotate(-10deg)") {
        upper.style.transform = "rotate(10deg)";
        lower.style.transform = "rotate(-10deg)";
    } else {
        upper.style.transform = "rotate(-10deg)";
        lower.style.transform = "rotate(10deg)";
    }
    if (left == 100) {
        left = 0;
    }
}, 100)