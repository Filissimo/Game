document.addEventListener("DOMContentLoaded", () => {
    let console = document.getElementById("console")
    let html = document.querySelector("html")
    setInterval(move_cursor, 1)
    function move_cursor() {
        posX = +getComputedStyle(document.documentElement).getPropertyValue("--posX")
        posY = +getComputedStyle(document.documentElement).getPropertyValue("--posY")
        console_break = console.innerHTML.indexOf("-")
        cursorX = console.innerHTML.slice(0, console_break);
        cursorY = console.innerHTML.slice(console_break + 1, console.innerHTML.length);
        dif_posX = +((cursorX_move - posX) / 300)
        new_posX = posX + dif_posX
        dif_posY = +((cursorY_move - posY) / 300)
        new_posY = posY + dif_posY
        document.documentElement.style.setProperty('--posX', new_posX);
        document.documentElement.style.setProperty('--posY', new_posY);
    }
})

document.addEventListener('click', printMousePos, true);
function printMousePos(e) {
    cursorX = e.pageX;
    cursorY = e.pageY;
    let console = document.getElementById("console")
}

document.addEventListener('mousemove', e => {
    cursorX_move = e.x
    cursorY_move = e.y
  }, {passive: true});
