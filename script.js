
document.addEventListener('mousemove', e => {
    cursorX_move = e.x
    cursorY_move = e.y
}, { passive: true });

document.addEventListener('touchmove', e => {
    var touch = e.touches[0];
    // get the DOM element
    var checkbox = document.elementFromPoint(touch.clientX, touch.clientY);
    // make sure an element was found - some areas on the page may have no elements
    if (checkbox) {
        // interact with the DOM element
        checkbox.checked = !checkbox.checked;
    }
    cursorX_move_touch = touch.clientX
    cursorY_move_touch = touch.clientY
})

document.addEventListener('click', printMousePos, true);
function printMousePos(e) {
    cursorX_click = e.pageX;
    cursorY_click = e.pageY;
}

document.addEventListener("DOMContentLoaded", () => {

    let enemy_limit = 20
    let bullet_limit = 20
    let player_speed = 2
    let game_speed = 20
    let bullet_speed = 3
    let spawn_interval = 1000

    let console_debug = document.getElementById("debug")
    let html = document.querySelector("html")
    let body = document.querySelector("body")
    let menu = document.getElementById("menu")
    let screen_width = screen.availWidth
    let screen_height = screen.availHeight
    let console_width = 0
    let console_height = 0
    let orientation = NaN
    let new_orientation = NaN
    let joystick = document.getElementById("joystick")
    let shoot_btn = document.getElementById("shoot")
    let melee_btn = document.getElementById("melee")
    let joystick_centerX = 0
    let joystick_centerY = 0
    let play_field = document.getElementById("play_field")
    for (i = 0; i < enemy_limit; i++) {
        play_field.innerHTML += `
            <div class="enemy invisible">
                <div class="id">${i}</div>
                <div class="direction invisible"></div>
            </div>
        `
    }
    for (i = 0; i < bullet_limit; i++) {
        play_field.innerHTML += `
            <div class="bullet invisible">
                <div class="id">${i}</div>
                <div class="dirX"></div>
                <div class="dirY"></div>
            </div>
        `
    }
    let margin_left = 0
    let margin_right = 0
    let margin_top = 0
    let margin_bottom = 0
    let joystick_radius = 0
    let all_enemies = play_field.querySelectorAll('.enemy')

    setInterval(set_orientation, 200)
    function set_orientation() {
        screen_width = screen.availWidth
        screen_height = screen.availHeight
        if (screen_width > screen_height) {
            body.classList.remove("high")
            body.classList.add("wide")
            console_width = screen_width * 0.15
            document.documentElement.style.setProperty('--console_size', console_width + "px")
            joystick_centerX = console_width / 2 + 7
            joystick_centerY = screen_height - console_width / 2 - 8
            document.documentElement.style.setProperty('--screen_width', screen_width)
            document.documentElement.style.setProperty('--screen_height', screen_height)
            new_orientation = "landscape"
            if (orientation != new_orientation) {
                document.documentElement.style.setProperty('--posX', screen_width / 2 + console_width / 2 + 7)
                document.documentElement.style.setProperty('--posY', screen_height / 2)
                reset_enemies()
            }
            console_height = 0
            orientation = new_orientation
        }
        else {
            body.classList.remove("wide")
            body.classList.add("high")
            console_height = screen_height * 0.15
            document.documentElement.style.setProperty('--console_size', console_height + "px")
            joystick_centerX = screen_width - console_height / 2 - 22
            joystick_centerY = screen_height - console_height / 2 - 22
            document.documentElement.style.setProperty('--screen_width', screen_width)
            document.documentElement.style.setProperty('--screen_height', screen_height)
            new_orientation = "portrait"
            if (orientation != new_orientation) {
                document.documentElement.style.setProperty('--posX', screen_width / 2)
                document.documentElement.style.setProperty('--posY', screen_height / 2 - console_height / 2 - 22)
                reset_enemies()
            }
            console_width = 0
            orientation = new_orientation
        }
        define_joystick_radius_and_margins()
    }
    function reset_enemies() {
        for (enemy of all_enemies) {
            if (enemy.classList.contains("visible")) {
                enemy.classList.remove("visible")
                enemy.classList.add("invisible")
            }
        }
    }

    let start_moving = ''


    joystick.onmouseover = () => {
        clearInterval(start_moving)
        start_moving = setInterval(move_cursor_mouse, 15)
    }

    joystick.onmouseleave = () => {
        clearInterval(start_moving)
    }
    joystick.ontouchmove = () => {
        clearInterval(start_moving)
        start_moving = setInterval(move_cursor_touch, 10)
    }
    joystick.ontouchend = () => {
        clearInterval(start_moving)
    }

    function define_joystick_radius_and_margins() {
        let additional_margin_X = 0
        let additional_margin_Y = 0
        if (console_width > 0) {
            additional_margin_X = 15
            joystick_radius = console_width / 2 - 3
        }
        if (console_height > 0) {
            additional_margin_Y = 45
            joystick_radius = console_height / 2 + 14
        }
        margin_left = 25 + console_width + additional_margin_X
        margin_right = screen_width - 25
        margin_top = 25
        margin_bottom = screen_height - 25 - console_height - additional_margin_Y
    }

    shoot_x = 0
    shoot_y = - bullet_speed * player_speed
    dif_posX = 0
    dif_posY = player_speed

    function move_cursor_touch() {
        posX = +getComputedStyle(document.documentElement).getPropertyValue("--posX")
        posY = +getComputedStyle(document.documentElement).getPropertyValue("--posY")
        dif_posX_raw = +(cursorX_move_touch - joystick_centerX)
        dif_posY_raw = +(cursorY_move_touch - joystick_centerY)
        hepotinuse = Math.abs(get_hepotinuse(dif_posX_raw, dif_posY_raw))
        dif_posX = dif_posX_raw / hepotinuse * player_speed
        dif_posY = dif_posY_raw / hepotinuse * player_speed
        shoot_x = dif_posX * bullet_speed
        shoot_y = dif_posY * bullet_speed
        dif_posX_abs = Math.abs(dif_posX)
        dif_posY_abs = Math.abs(dif_posY)
        if ((dif_posX_abs ^ 2) + (dif_posY_abs ^ 2) < joystick_radius * 1.4) {
            new_posX = posX + dif_posX
            new_posY = posY + dif_posY
            if (new_posX != Infinity && new_posX != NaN && new_posX != -Infinity) {
                if (new_posX > margin_right) {
                    new_posX = margin_right
                } else if (new_posX < margin_left) {
                    new_posX = margin_left
                }

                document.documentElement.style.setProperty('--posX', new_posX)
            }
            if (new_posY != Infinity && new_posY != NaN && new_posY != -Infinity) {
                if (new_posY < margin_top) {
                    new_posY = margin_top
                } else if (new_posY > margin_bottom) {
                    new_posY = margin_bottom
                }
                document.documentElement.style.setProperty('--posY', new_posY)
            }
            // console_debug.innerHTML += "<br>New X: " + new_posX.toFixed(2) + ", Y: " + new_posY.toFixed(2) +
            //     "<br>Moved X: " + (posX - new_posX).toFixed(2) + ", Y: " + (posY - new_posY).toFixed(2) +
            //     "<br>Sin Y: " + ratio_x + ", Sin Y: " + ratio_y
        }
    }
    function move_cursor_mouse() {
        posX = +getComputedStyle(document.documentElement).getPropertyValue("--posX")
        posY = +getComputedStyle(document.documentElement).getPropertyValue("--posY")
        dif_posX = +(cursorX_move - joystick_centerX)
        dif_posY = +(cursorY_move - joystick_centerY)
        dif_posX_abs = Math.abs(dif_posX)
        dif_posY_abs = Math.abs(dif_posY)
        // corner = 0
        // hipotenuse = Math.sqrt((dif_posX_abs ^ 2) + (dif_posY_abs ^ 2))
        // if (dif_posX > 0 && dif_posY > 0) {
        //     basic_corner = 9 * dif_posY_abs / hipotenuse
        //     if (basic_corner > 90) {
        //         basic_corner = 90
        //     }
        //     corner = basic_corner + 90
        // }
        // if (dif_posX < 0 && dif_posY > 0) {
        //     basic_corner = 9 * dif_posX_abs / hipotenuse
        //     if (basic_corner > 90) {
        //         basic_corner = 90
        //     }
        //     corner = basic_corner + 180
        // }
        // if (dif_posX < 0 && dif_posY < 0) {
        //     basic_corner = 9 * dif_posY_abs / hipotenuse
        //     if (basic_corner > 90) {
        //         basic_corner = 90
        //     }
        //     corner = basic_corner + 270
        // }
        // if (dif_posX > 0 && dif_posY < 0) {
        //     basic_corner = 9 * dif_posX_abs / hipotenuse
        //     if (basic_corner > 90) {
        //         basic_corner = 90
        //     }
        //     corner = basic_corner
        // }
        // console_debug.innerHTML += "Screen " + screen_width + "x" + screen_height +
        //     "<br>Cursor X: " + cursorX_move + ", Y: " + cursorY_move +
        //     "<br>Character X: " + Math.round(posX) + ", Y: " + Math.round(posY)
        ratio_x = get_sin(dif_posX, dif_posY)
        ratio_y = get_sin(dif_posY, dif_posX)
        new_posX = posX + ratio_x * player_speed
        new_posY = posY + ratio_y * player_speed
        additional_margin_X = 0
        if (console_width > 0) {
            additional_margin_X = 15
        }
        additional_margin_Y = 0
        if (console_height > 0) {
            additional_margin_Y = 45
        }
        if (new_posX != Infinity && new_posX != NaN && new_posX != -Infinity) {
            if (new_posX > margin_right) {
                new_posX = margin_right
            } else if (new_posX < margin_left) {
                new_posX = margin_left
            }

            document.documentElement.style.setProperty('--posX', new_posX)
        }
        if (new_posY != Infinity && new_posY != NaN && new_posY != -Infinity) {
            if (new_posY < margin_top) {
                new_posY = margin_top
            } else if (new_posY > margin_bottom) {
                new_posY = margin_bottom
            }
            document.documentElement.style.setProperty('--posY', new_posY)
        }
        // console_debug.innerHTML += "<br>New X: " + new_posX.toFixed(2) + ", Y: " + new_posY.toFixed(2) +
        //     "<br>Moved X: " + (posX - new_posX).toFixed(2) + ", Y: " + (posY - new_posY).toFixed(2) +
        //     "<br>Sin Y: " + ratio_x + ", Sin Y: " + ratio_y
    }
    function get_sin(catet1, catet2) {
        catet1_squared = Math.abs(catet1) ^ 2
        catet2_squared = Math.abs(catet2) ^ 2
        hepotinuse = Math.sqrt(catet1_squared + catet2_squared)
        sin = catet1 / hepotinuse
        return sin
    }
    function get_hepotinuse(catet1, catet2) {
        catet1_squared = catet1 * catet1
        catet2_squared = catet2 * catet2
        hepotinuse = Math.sqrt(catet1_squared + catet2_squared)
        return hepotinuse
    }

    let all_bullets = document.querySelectorAll('.bullet')
    shoot_btn.onclick = () => {
        let invisible_bullet = ''
        for (bullet of all_bullets) {
            if (bullet.classList.contains("invisible")) {
                invisible_bullet = bullet
                break
            }
        }
        if (invisible_bullet) {
            player_posX = +getComputedStyle(document.documentElement).getPropertyValue("--posX")
            player_posY = +getComputedStyle(document.documentElement).getPropertyValue("--posY")
            invisible_bullet.classList.remove('invisible')
            invisible_bullet.classList.add('visible')
            invisible_bullet.setAttribute('style', `top: ${Math.round(player_posY - 5)}px; left: ${Math.round(player_posX - 5)}px`)
            invisible_bullet.querySelector('.dirX').innerHTML = shoot_x
            invisible_bullet.querySelector('.dirY').innerHTML = shoot_y
        }
    }

    let show_debug = document.getElementById('show_debug')
    show_debug.onclick = () => {
        console_debug.classList.toggle("invisible")
    }

    let menu_btn = document.getElementById("menu_btn")
    let play_btn = document.getElementById("play")
    let play_game = ''
    let spawning_enemies = ''
    menu_btn.onclick = () => {
        menu.classList.toggle('show')
        clearInterval(play_game)
        clearInterval(spawning_enemies)
    }
    play_btn.onclick = () => {
        menu.classList.toggle('show')
        play_game = setInterval(game_tick, game_speed)
        spawning_enemies = setInterval(spawn_enemy, spawn_interval)
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

    var elem = document.documentElement;
    function openFullscreen() {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
            elem.msRequestFullscreen();
        }
    }
    function closeFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
            document.msExitFullscreen();
        }
    }
    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    let spawnX = 0
    let spawnY = 0
    // console_debug.innerHTML += "<br>Margins: top: " + margin_top + ", bottom: " + margin_bottom +
    //     ", left: " + margin_left + ", right: " + margin_right
    function spawn_enemy() {
        let invisible_enemy = ''
        for (enemy of all_enemies) {
            if (enemy.classList.contains('invisible')) {
                invisible_enemy = enemy
                break
            }
        }
        if (invisible_enemy) {
            invisible_enemy.classList.remove('invisible')
            invisible_enemy.classList.add('visible')
            let play_field_side = Math.floor(Math.random() * 4)
            let direction = getRndInteger(0, 1)
            switch (play_field_side) {
                case 0:
                    spawnY = margin_top - 15
                    spawnX = getRndInteger(margin_left, margin_right) - 15
                    direction = direction + 1
                    break
                case 1:
                    spawnY = getRndInteger(margin_top, margin_bottom) - 15
                    spawnX = margin_right - 25
                    direction = direction + 2
                    break
                case 2:
                    spawnY = margin_bottom - 25
                    spawnX = getRndInteger(margin_left, margin_right) - 15
                    direction = direction + 3
                    break
                case 3:
                    spawnY = getRndInteger(margin_top, margin_bottom) - 15
                    spawnX = margin_left - 15
                    break
            }
            if (direction == 4) {
                direction = 0
            }
            invisible_enemy.setAttribute('style', `top: ${Math.round(spawnY)}px; left: ${Math.round(spawnX)}px`)
            invisible_enemy.querySelector('.direction').innerHTML = direction
        }
    }
    
    function game_tick() {
        let console_debug_HTML = console_debug.innerHTML
        let console_debug_length = console_debug_HTML.length
        if (console_debug_length > 1000) {
            console_debug_HTML = console_debug_HTML.slice(1, console_debug_length)
        }
        console_debug.innerHTML = console_debug_HTML
        enemy_moves()
        enemies_collide()
        collide_with_me()
        bullet_flies()
        bullet_collides()
    }
    function bullet_flies() {
        for (bullet of all_bullets) {
            if (bullet.classList.contains('visible')) {
                dirX = +bullet.querySelector('.dirX').innerHTML
                dirY = +bullet.querySelector('.dirY').innerHTML
                posX_px = bullet.style.left
                posY_px = bullet.style.top
                posX = +posX_px.slice(0, posX_px.length - 2)
                posY = +posY_px.slice(0, posY_px.length - 2)
                if (posX < margin_left - 15) {
                    dirX = - dirX
                }
                if (posX > margin_right + 5) {
                    dirX = - dirX
                }
                if (posY < margin_top - 15) {
                    dirY = - dirY
                }
                if (posY > margin_bottom + 5) {
                    dirY = - dirY
                }
                bullet.querySelector('.dirX').innerHTML = dirX
                bullet.querySelector('.dirY').innerHTML = dirY
                new_posX = posX + (dirX)
                new_posY = posY + (dirY)
                bullet.setAttribute('style', `top: ${new_posY}px; left: ${new_posX}px`)
            }
        }
    }
    function bullet_collides() {
        for (bullet of all_bullets) {
            if (bullet.classList.contains('visible')) {
                for (enemy of all_enemies) {
                    if (enemy.classList.contains('visible')) {
                        bullet_X_px = bullet.style.left
                        bullet_Y_px = bullet.style.top
                        bullet_X = +bullet_X_px.slice(0, bullet_X_px.length - 2)
                        bullet_Y = +bullet_Y_px.slice(0, bullet_Y_px.length - 2)
                        enemy_X_px = enemy.style.left
                        enemy_Y_px = enemy.style.top
                        enemy_X = +enemy_X_px.slice(0, enemy_X_px.length - 2)
                        enemy_Y = +enemy_Y_px.slice(0, enemy_Y_px.length - 2)
                        real_dif_X = bullet_X - enemy_X
                        real_dif_Y = bullet_Y - enemy_Y
                        dif_X = Math.abs(real_dif_X)
                        dif_Y = Math.abs(real_dif_Y)
                        if (real_dif_X < 35 && real_dif_Y < 35 &&
                            real_dif_X > - 5 && real_dif_Y > - 5) {
                            console_debug.innerHTML += '<br>Collision detected. Dif_X: ' +
                            real_dif_X.toFixed(2) + ", dif_Y: " + real_dif_Y.toFixed(2)
                            bullet.classList.add("invisible")
                            bullet.classList.remove("visible")
                            enemy.classList.add("invisible")
                            enemy.classList.remove("visible")
                        }
                    }
                }
            }
        }
    }
    function enemy_moves() {
        for (enemy of all_enemies) {
            if (enemy.classList.contains('visible')) {
                direction = enemy.querySelector('.direction').innerHTML
                e_posX_px = enemy.style.left
                e_posY_px = enemy.style.top
                e_posX = +e_posX_px.slice(0, e_posX_px.length - 2)
                e_posY = +e_posY_px.slice(0, e_posY_px.length - 2)
                // console_debug.innerHTML += "<br>Enemy X: " + e_posX + " Y: " + e_posY + ", direction: " + direction
                switch (direction) {
                    case "0":
                        if (e_posX > margin_right - 25) {
                            direction = 3
                        } else if (e_posY < margin_top - 15) {
                            direction = 1
                        }
                        e_posX = e_posX + 1
                        e_posY = e_posY - 1
                        enemy.setAttribute('style', `top: ${Math.round(e_posY)}px; left: ${Math.round(e_posX)}px`)
                        enemy.querySelector('.direction').innerHTML = direction
                        break
                    case "1":
                        if (e_posX > margin_right - 25) {
                            direction = 2
                        } else if (e_posY > margin_bottom - 25) {
                            direction = 0
                        }
                        e_posX = e_posX + 1
                        e_posY = e_posY + 1
                        enemy.setAttribute('style', `top: ${Math.round(e_posY)}px; left: ${Math.round(e_posX)}px`)
                        enemy.querySelector('.direction').innerHTML = direction
                        break
                    case "2":
                        if (e_posX < margin_left - 15) {
                            direction = 1
                        } else if (e_posY > margin_bottom - 25) {
                            direction = 3
                        }
                        e_posX = e_posX - 1
                        e_posY = e_posY + 1
                        enemy.setAttribute('style', `top: ${Math.round(e_posY)}px; left: ${Math.round(e_posX)}px`)
                        enemy.querySelector('.direction').innerHTML = direction
                        break
                    case "3":
                        if (e_posX < margin_left - 15) {
                            direction = 0
                        } else if (e_posY < margin_top - 15) {
                            direction = 2
                        }
                        e_posX = e_posX - 1
                        e_posY = e_posY - 1
                        enemy.setAttribute('style', `top: ${Math.round(e_posY)}px; left: ${Math.round(e_posX)}px`)
                        enemy.querySelector('.direction').innerHTML = direction
                        break
                }
            }
        }
    }
    function enemies_collide() {
        for (this_enemy of all_enemies) {
            if (this_enemy.classList.contains('visible')) {
                this_e_direction = this_enemy.querySelector('.direction').innerHTML
                this_e_posX_px = this_enemy.style.left
                this_e_posY_px = this_enemy.style.top
                this_e_posX = +this_e_posX_px.slice(0, this_e_posX_px.length - 2)
                this_e_posY = +this_e_posY_px.slice(0, this_e_posY_px.length - 2)
                for (other_enemy of all_enemies) {
                    if (other_enemy.classList.contains('visible')) {
                        other_enemy_id = other_enemy.querySelector('.id').innerHTML
                        this_enemy_id = this_enemy.querySelector('.id').innerHTML
                        if (this_enemy_id != other_enemy_id) {
                            other_e_direction = other_enemy.querySelector('.direction').innerHTML
                            other_e_X_px = other_enemy.style.left
                            other_e_Y_px = other_enemy.style.top
                            other_e_X = +other_e_X_px.slice(0, other_e_X_px.length - 2)
                            other_e_Y = +other_e_Y_px.slice(0, other_e_Y_px.length - 2)
                            real_dif_X = this_e_posX - other_e_X
                            real_dif_Y = this_e_posY - other_e_Y
                            dif_X = Math.abs(real_dif_X)
                            dif_Y = Math.abs(real_dif_Y)
                            // console_debug.innerHTML += "<br>Enemy Id: " + this_enemy_id + " X: " + this_e_posX + " Y: " + this_e_posY +
                            //     ", direction: " + this_e_direction +
                            //     "<br>Other enemy Id: " + other_enemy_id + " X: " + other_e_X + " Y: " + other_e_Y
                            if (dif_X < 40 && dif_Y < 40) {
                                // console_debug.innerHTML += '<br>Collision detected with: ' + other_enemy_id +
                                //     ". Dif_X: " + dif_X + ", dif_Y: " + dif_Y
                                // let bounce = 1
                                switch (this_e_direction) {
                                    case "0":
                                        if (dif_X > dif_Y) {
                                            if (real_dif_X < 0) {
                                                this_e_direction = 3
                                                if (other_e_direction == 2) {
                                                    other_e_direction = 1
                                                }
                                                if (other_e_direction == 3) {
                                                    other_e_direction = 0
                                                }
                                                // this_enemy.setAttribute('style', `top: ${Math.round(this_e_posY - bounce)}px; left: ${Math.round(this_e_posX - bounce)}px`)
                                            }
                                        } else {
                                            if (real_dif_Y > 0) {
                                                this_e_direction = 1
                                                if (other_e_direction == 2) {
                                                    other_e_direction = 3
                                                }
                                                if (other_e_direction == 1) {
                                                    other_e_direction = 0
                                                }
                                                // this_enemy.setAttribute('style', `top: ${Math.round(this_e_posY + bounce)}px; left: ${Math.round(this_e_posX + bounce)}px`)
                                            }
                                        }
                                        break
                                    case "1":
                                        if (dif_X > dif_Y) {
                                            if (real_dif_X < 0) {
                                                this_e_direction = 2
                                                if (other_e_direction == 2) {
                                                    other_e_direction = 1
                                                }
                                                if (other_e_direction == 1) {
                                                    other_e_direction = 0
                                                }
                                                // this_enemy.setAttribute('style', `top: ${Math.round(this_e_posY + bounce)}px; left: ${Math.round(this_e_posX - bounce)}px`)
                                            }
                                        } else {
                                            if (real_dif_Y < 0) {
                                                this_e_direction = 0
                                                if (other_e_direction == 0) {
                                                    other_e_direction = 1
                                                }
                                                if (other_e_direction == 3) {
                                                    other_e_direction = 2
                                                }
                                                // this_enemy.setAttribute('style', `top: ${Math.round(this_e_posY - bounce)}px; left: ${Math.round(this_e_posX + bounce)}px`)
                                            }
                                        }
                                        break
                                    case "2":
                                        if (dif_X > dif_Y) {
                                            if (real_dif_X > 0) {
                                                this_e_direction = 1
                                                if (other_e_direction == 1) {
                                                    other_e_direction = 2
                                                }
                                                if (other_e_direction == 0) {
                                                    other_e_direction = 3
                                                }
                                                // this_enemy.setAttribute('style', `top: ${Math.round(this_e_posY + bounce)}px; left: ${Math.round(this_e_posX + bounce)}px`)
                                            }
                                        } else {
                                            if (real_dif_Y < 0) {
                                                this_e_direction = 3
                                                if (other_e_direction == 0) {
                                                    other_e_direction = 1
                                                }
                                                if (other_e_direction == 3) {
                                                    other_e_direction = 2
                                                }
                                                // this_enemy.setAttribute('style', `top: ${Math.round(this_e_posY - bounce)}px; left: ${Math.round(this_e_posX - bounce)}px`)
                                            }
                                        }
                                        break
                                    case "3":
                                        if (dif_X > dif_Y) {
                                            if (real_dif_X > 0) {
                                                this_e_direction = 0
                                                if (other_e_direction == 0) {
                                                    other_e_direction = 3
                                                }
                                                if (other_e_direction == 1) {
                                                    other_e_direction = 2
                                                }
                                                // this_enemy.setAttribute('style', `top: ${Math.round(this_e_posY - bounce)}px; left: ${Math.round(this_e_posX + bounce)}px`)
                                            }
                                        } else {
                                            if (real_dif_Y > 0) {
                                                this_e_direction = 2
                                                if (other_e_direction == 1) {
                                                    other_e_direction = 0
                                                }
                                                if (other_e_direction == 2) {
                                                    other_e_direction = 3
                                                }
                                                // this_enemy.setAttribute('style', `top: ${Math.round(this_e_posY + bounce)}px; left: ${Math.round(this_e_posX - bounce)}px`)
                                            }
                                        }
                                        break
                                }
                                if (other_e_direction == -1) {
                                    other_e_direction = 3
                                }
                                if (other_e_direction == 4) {
                                    other_e_direction = 0
                                }
                                this_enemy.querySelector('.direction').innerHTML = this_e_direction
                                other_enemy.querySelector('.direction').innerHTML = other_e_direction
                            }
                        }
                    }
                }
            }
        }
    }

    function collide_with_me() {
        this_e_posX = +getComputedStyle(document.documentElement).getPropertyValue("--posX") - 20
        this_e_posY = +getComputedStyle(document.documentElement).getPropertyValue("--posY") - 20
        for (other_enemy of all_enemies) {
            if (other_enemy.classList.contains('visible')) {
                other_e_direction = other_enemy.querySelector('.direction').innerHTML
                other_e_X_px = other_enemy.style.left
                other_e_Y_px = other_enemy.style.top
                other_e_X = +other_e_X_px.slice(0, other_e_X_px.length - 2)
                other_e_Y = +other_e_Y_px.slice(0, other_e_Y_px.length - 2)
                real_dif_X = this_e_posX - other_e_X
                real_dif_Y = this_e_posY - other_e_Y
                dif_X = Math.abs(real_dif_X)
                dif_Y = Math.abs(real_dif_Y)
                if (dif_X < 35 && dif_Y < 35) {
                    // console_debug.innerHTML += '<br>Collision detected with: ' + other_enemy_id +
                    //     ". Dif_X: " + dif_X + ", dif_Y: " + dif_Y
                    switch (other_e_direction) {
                        case "0":
                            if (dif_X > dif_Y) {
                                if (real_dif_X > 0) {
                                    other_e_direction = 3
                                }
                            } else {
                                if (real_dif_Y < 0) {
                                    other_e_direction = 1
                                }
                            }
                            break
                        case "1":
                            if (dif_X > dif_Y) {
                                if (real_dif_X > 0) {
                                    other_e_direction = 2
                                }
                            } else {
                                if (real_dif_Y > 0) {
                                    other_e_direction = 0
                                }
                            }
                            break
                        case "2":
                            if (dif_X > dif_Y) {
                                if (real_dif_X < 0) {
                                    other_e_direction = 1
                                }
                            } else {
                                if (real_dif_Y > 0) {
                                    other_e_direction = 3
                                }
                            }
                            break
                        case "3":
                            if (dif_X > dif_Y) {
                                if (real_dif_X < 0) {
                                    other_e_direction = 0
                                }
                            } else {
                                if (real_dif_Y < 0) {
                                    other_e_direction = 2
                                }
                            }
                            break
                    }
                    other_enemy.querySelector('.direction').innerHTML = other_e_direction
                }
            }
        }
    }
})
