
document.addEventListener('mousemove', e => {
    cursorX_move = e.x
    cursorY_move = e.y
}, { passive: true });

document.addEventListener('click', printMousePos, true);
function printMousePos(e) {
    cursorX_click = e.pageX;
    cursorY_click = e.pageY;
}

document.addEventListener("DOMContentLoaded", () => {
    let console_debug = document.getElementById("debug")
    let html = document.querySelector("html")
    let body = document.querySelector("body")
    let menu = document.getElementById("menu")
    let screen_width = screen.availWidth
    let screen_height = screen.availHeight
    document.documentElement.style.setProperty('--posX', screen_width / 2)
    document.documentElement.style.setProperty('--posY', screen_height / 2)

    let console_width = 0
    let console_height = 0

    setInterval(set_orientation, 200)
    function set_orientation() {
        screen_width = screen.availWidth
        screen_height = screen.availHeight
        if (screen_width > screen_height) {
            body.classList.remove("high")
            body.classList.add("wide")
            console_width = screen_width * 0.15
            document.documentElement.style.setProperty('--console_size', console_width + "px")
        }
        else {
            body.classList.remove("wide")
            body.classList.add("high")
            console_height = screen_height * 0.15
            document.documentElement.style.setProperty('--console_size', console_height + "px")
        }
    }


    let play_field = document.getElementById("play_field")

    let start_moving = ''

    play_field.onclick = () => {
        if (cursorX_click && cursorY_click) {
            if (cursorX_click > 25 + console_width && cursorY_click > 25 &&
                cursorX_click < screen_width - 25 && cursorY_click < screen_height - 70 - console_height) {
                cursorX_click_static = cursorX_click
                cursorY_click_static = cursorY_click
                clearInterval(start_moving)
                start_moving = setInterval(move_cursor, 10)
            }
        }
    }

    function move_cursor() {
        posX = +getComputedStyle(document.documentElement).getPropertyValue("--posX")
        posY = +getComputedStyle(document.documentElement).getPropertyValue("--posY")
        dif_posX = +(cursorX_click_static - posX)
        dif_posY = +(cursorY_click_static - posY)
        speed = 0.01
        console_debug.innerHTML = "Screen " + screen_width + "x" + screen_height +
            "<br>Cursor X: " + cursorX_click_static + ", Y: " + cursorY_click_static +
            "<br>Character X: " + Math.round(posX) + ", Y: " + Math.round(posY)
        if (dif_posX > 3 || dif_posX < -3) {
            ratio_x = get_sin(dif_posX, dif_posY)
            ratio_y = get_sin(dif_posY, dif_posX)
            new_posX = posX + ratio_x * speed
            new_posY = posY + ratio_y * speed
            if (new_posX != Infinity && new_posX != NaN && new_posX != -Infinity) {
                document.documentElement.style.setProperty('--posX', new_posX)
            } else {
                console_debug.innerHTML += "<br>New X: " + new_posX + ", Y: " + new_posY
            }
        }
        if (dif_posY > 3 || dif_posY < -3) {
            ratio_y = get_sin(dif_posY, dif_posX)
            new_posY = posY + ratio_y * speed
            if (new_posY != Infinity && new_posY != NaN && new_posY != -Infinity) {
                document.documentElement.style.setProperty('--posY', new_posY)
            }
        }
        // else {
        //     clearInterval(start_moving)
        // }
    }
    function get_sin(catet1, catet2) {
        catet1_squared = Math.abs(catet1) ^ 2
        catet2_squared = Math.abs(catet2) ^ 2
        hepotinuse = Math.sqrt(catet1_squared + catet2_squared)
        sin = catet1 / hepotinuse
        return sin
    }

    let show_debug = document.getElementById('show_debug')
    show_debug.onclick = () => {
        console_debug.classList.toggle('invisible')
    }

    let menu_btn = document.getElementById("menu_btn")
    menu_btn.onclick = () => {
        menu.classList.toggle('show')
    }


    let fullscreen_on_btn = document.querySelector(".fullscreen_on")
    let fullscreen_off_btn = document.querySelector(".fullscreen_off")
    fullscreen_on_btn.onclick = () => {
        fullscreen_on_btn.classList.toggle('invisible')
        fullscreen_off_btn.classList.toggle('invisible')
        openFullscreen()
    }
    fullscreen_off_btn.onclick = () => {
        fullscreen_on_btn.classList.toggle('invisible')
        fullscreen_off_btn.classList.toggle('invisible')
        closeFullscreen()
    }

    /* Get the documentElement (<html>) to display the page in fullscreen */
    var elem = document.documentElement;

    /* View in fullscreen */
    function openFullscreen() {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
            elem.msRequestFullscreen();
        }
    }

    /* Close fullscreen */
    function closeFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
            document.msExitFullscreen();
        }
    }
})
