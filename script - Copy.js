
document.addEventListener("DOMContentLoaded", () => {

    window.oncontextmenu = function(event) {
        event.preventDefault()
    }

    let game_speed = 40
    let last_game_score = 0
    let present_game_score = 0
    let best_game_score = 0
    let player = document.getElementById("cursor_chaser")
    let corner
    let turnSpeed
    let player_speed
    let player_health
    let player_health_max
    let player_health_max_upgr
    let player_regen
    let player_regen_upgr
    let player_regen_speed
    let player_melee_dmg
    let player_melee_dmg_upgr
    function reset_player_stats() {
        corner = 0 // It's angle, but I was dumb, and now I'm too lazy to change the name of the variable
        turnSpeed = 3
        player_speed = 0.04
        player_size = 25
        player.querySelector('.speed').innerHTML = player_speed
        player_health = 10
        player_health_max = 10
        player_health_max_upgr = 0.1
        player_regen = 1
        player_regen_upgr = 0.00003
        player_regen_speed = 3
        player_melee_dmg = 3
        player_melee_dmg_upgr = 0.01
    }
    reset_player_stats()
    let bullet_limit
    let bullet_speed
    let bullet_speed_upgr
    let bullet_damage
    let bullet_damage_upgr
    let bullet_count
    let bullet_count_upgr
    let shooting_speed
    let shooting_speed_upgr
    function reset_bullet_stats() {
        bullet_limit = 30
        bullet_speed = 0.1
        bullet_speed_upgr = 0.0001
        bullet_damage = 1
        bullet_damage_upgr = 0.01
        bullet_count = 1
        bullet_count_upgr = 0.02
        shooting_speed = 250
        shooting_speed_upgr = 0.05
    }
    let enemy_limit
    let enemy_speed
    let enemy_speed_upgr
    let spawn_interval
    let spawn_interval_upgr
    let enemy_health_max
    let enemy_health_max_upgr
    let enemy_damage
    let enemy_damage_upgr
    function reset_enemy_stats() {
        enemy_limit = 20
        enemy_speed = 2
        enemy_speed_upgr = 0.02
        spawn_interval = 50
        spawn_interval_upgr = 50
        enemy_health_max = 1
        enemy_health_max_upgr = 0.1
        enemy_damage = 1
        enemy_damage_upgr = 0.1
    }
    reset_enemy_stats()
    reset_bullet_stats()
    reset_player_visuals()

    let defaultStats
    function setDefaultStats() {
        defaultStats = {
            'game': {
                'speed': 30,
                'last_score': 0,
                'present_score': 0,
                'best_score': 0
            },
            'player': {
                'angle': 0,
                'turnSpeed': 3,
                'speed': 4,
                'health_max': 10,
                'health_max_upgr': 0.1,
                'regen': 1,
                'regen_upgr': 0.001,
                'regen_speed': 10,
                'melee_dmg': 3,
                'melee_dmg_upgr': 0.01
            },
            'bullet': {
                'limit': 30,
                'speed': 0.1,
                'speed_upgr': 0.001,
                'damage': 1,
                'damage_upgr': 0.005,
                'count': 1,
                'count_upgr': 0.01,
                'shooting_speed': 250,
                'shooting_speed_upgr': 0.01,
            },
            'enemy': {
                'limit': 10,
                'angle': 180,
                'angleUpgr': 15,
                'speed': 0.3,
                'speed_upgr': 0.01,
                'spawn_interval': 50,
                'spawn_interval_upgr': 50,
                'health_max': 1,
                'health_max_upgr': 0.04,
                'damage': 1,
                'damage_upgr': 0.04
            }
        }
    }
    setDefaultStats()

    function player_health_upgr(percentage) {
        if (percentage < 0.2) {
            percentage = 0.2
        }
        player_health_max = player_health_max + (player_health_max_upgr / (percentage))
        player.querySelector(".health_max").innerHTML = player_health_max
    }
    function player_health_bonus_upgr(damage, percentage) {
        if (percentage < 0.1) {
            percentage = 0.1
        }
        player_health_max = player_health_max + (player_health_max_upgr * damage / (percentage))
        player.querySelector(".health_max").innerHTML = player_health_max
    }
    function player_regeneration_upgr(percentage) {
        if (percentage < 0.0001) {
            percentage = 0.0001
        }
        player_regen = player_regen + (player_regen_upgr * player_regen / (percentage))
        player.querySelector(".regen").innerHTML = player_regen
        console_debug.innerHTML = "Regen upgraded: " + (player_regen_upgr * player_regen / (percentage)).toFixed(7) +
            "<br>Percentage: " + percentage.toFixed(2)
    }
    function player_melee_dmg_upgrade(percentage) {
        if (percentage < 0.2) {
            percentage = 0.2
        }
        player_melee_dmg = player_melee_dmg + (player_melee_dmg_upgr * player_melee_dmg / percentage)
    }
    function reset_player_visuals() {
        health_div = player.querySelector(".health")
        health_max_div = player.querySelector(".health_max")
        text_display = player.querySelector(".text_display")
        text_display.innerHTML = player_health_max
        health_div.innerHTML = player_health_max
        health_max_div.innerHTML = player_health_max
        health_div.style.width = 50 + "px"
        health_div.style.height = 50 + "px"
        health_div.style.left = 0
        health_div.style.top = 0
        text_display.style.width = 50 + "px"
        text_display.style.height = 50 + "px"
        text_display.style.left = 0
        text_display.style.top = 10
        text_display.style.left = 25 - (text_display.innerHTML.length * 6) + 'px'
    }
    function bullet_upgr() {
        bullet_damage = bullet_damage + (bullet_damage_upgr * bullet_damage)
        bullet_count = bullet_count + bullet_count_upgr
        if (shooting_speed > 2) {
            shooting_speed = shooting_speed - shooting_speed_upgr
        }
        bullet_speed = bullet_speed + bullet_speed_upgr
    }
    function spawn_interval_increased() {
        spawn_interval = Math.round(spawn_interval + (spawn_interval_upgr))
    }
    function enemy_upgr() {
        enemy_health_max = enemy_health_max + (enemy_health_max * enemy_health_max_upgr)
        enemy_speed = enemy_speed + enemy_speed_upgr
        enemy_damage = enemy_damage + (enemy_damage * enemy_damage_upgr)
    }
    function show_big_number(number) {
        number = number.toString()
        number_to_show = number
        if (number.length > 13) {
            number_to_show = number.slice(0, number.length - 6) + "t"
        }
        if (number.length > 10) {
            number_to_show = number.slice(0, number.length - 6) + "b"
        }
        if (number.length > 7) {
            number_to_show = number.slice(0, number.length - 6) + "m"
        }
        if (number.length > 4) {
            number_to_show = number.slice(0, number.length - 3) + "k"
        }
        return number_to_show
    }
    function show_scores(score) {
        score_to_show = show_big_number(score)
        last_game_score_to_show = show_big_number(last_game_score)
        best_game_score_to_show = show_big_number(best_game_score)
        score_bar.innerHTML = `<span>Last game score: ${last_game_score_to_show} --- </span> 
        Current score: ${score_to_show} 
        <span> --- Best score: ${best_game_score_to_show}</span>`
    }
    let score_bar = document.getElementById("score_bar")
    let console_debug = document.getElementById("debug")
    let anticlick = document.getElementById("anticlick")
    let html = document.querySelector("html")
    let body = document.querySelector("body")
    let menu = document.getElementById("menu")
    let screen_width = screen.availWidth
    let screen_height = screen.availHeight
    let console_width = 0
    let console_height = 0
    let orientation = NaN
    let new_orientation = NaN
    let shoot_btn = document.getElementById("shoot")
    let up_btn = document.getElementById("up")
    let down_btn = document.getElementById("down")
    let right_btn = document.getElementById("right")
    let left_btn = document.getElementById("left")
    let play_field = document.getElementById("play_field")
    function render_enemies_and_bullets() {
        for (i = 0; i < enemy_limit; i++) {
            play_field.innerHTML += `
            <div class="enemy invisible">
                <div class="id" invisible>${i}</div>
                <div class="dirX invisible"></div>
                <div class="dirY invisible"></div>
                <div class="speed invisible"></div>
                <div class="colided invisible">0</div>
                <div class="health invisible"></div>
                <div class="health_max invisible"></div>
                <div class="damage"></div>
                <div class="text_display"></div>
            </div>
        `
        }
        for (i = 0; i < bullet_limit; i++) {
            play_field.innerHTML += `
            <div class="bullet invisible">
                <div class="id">${i}</div>
                <div class="dirX"></div>
                <div class="dirY"></div>
                <div class="speed invisible"></div>
                <div class="damage"></div>
            </div>
        `
        }
    }
    render_enemies_and_bullets()
    let margin_left = 0
    let margin_right = 0
    let margin_top = 0
    let margin_bottom = 0
    let moveStep = 0
    let all_enemies = play_field.querySelectorAll('.enemy')
    let all_bullets = document.querySelectorAll('.bullet')

    setInterval(set_orientation, 1000)
    function set_orientation() {
        screen_width = screen.availWidth
        screen_height = screen.availHeight
        if (screen_width > screen_height) {
            body.classList.remove("high")
            body.classList.add("wide")
            console_width = screen_width * 0.15
            document.documentElement.style.setProperty('--console_size', console_width)
            document.documentElement.style.setProperty('--dir_btn-size', 2.7)
            document.documentElement.style.setProperty('--dir_btn-horizontal', -6)
            document.documentElement.style.setProperty('--dir_btn-vertical', -5.5)
            document.documentElement.style.setProperty('--dir_btn-bottom', 15)
            document.documentElement.style.setProperty('--dir_btn-right', 20)
            document.documentElement.style.setProperty('--dir_btn-additional_bottom', 2)
            document.documentElement.style.setProperty("--corner", corner)
            joystick_centerX = console_width / 2 + 7
            joystick_centerY = screen_height - console_width / 2 - 8
            document.documentElement.style.setProperty('--screen_width', screen_width)
            document.documentElement.style.setProperty('--screen_height', screen_height)
            new_orientation = "landscape"
            if (orientation != new_orientation) {
                player.style.left = (screen_width / 2 + console_width / 2 + 7) + "px"
                player.style.top = (screen_height / 2) + "px"
                total_reset()
            }
            console_height = 0
            orientation = new_orientation
        }
        else {
            body.classList.remove("wide")
            body.classList.add("high")
            console_height = screen_height * 0.15
            document.documentElement.style.setProperty('--console_size', console_height)
            document.documentElement.style.setProperty('--dir_btn-size', 2.3)
            document.documentElement.style.setProperty('--dir_btn-vertical', 5.1)
            document.documentElement.style.setProperty('--dir_btn-horizontal', 4.1)
            document.documentElement.style.setProperty('--dir_btn-bottom', 7)
            document.documentElement.style.setProperty('--dir_btn-right', 3.5)
            document.documentElement.style.setProperty('--dir_btn-additional_bottom', 1)
            document.documentElement.style.setProperty("--corner", corner)
            joystick_centerX = screen_width - console_height / 2 - 22
            joystick_centerY = screen_height - console_height / 2 - 22
            document.documentElement.style.setProperty('--screen_width', screen_width)
            document.documentElement.style.setProperty('--screen_height', screen_height)
            new_orientation = "portrait"
            if (orientation != new_orientation) {
                player.style.left = (screen_width / 2) + "px"
                player.style.top = (screen_height / 2 - console_height / 2 - 22) + "px"
                total_reset()
            }
            console_width = 0
            orientation = new_orientation
        }
        defineMarginsAndMoveStep()
    }
    function reset_bullets() {
        for (bullet of all_bullets) {
            if (bullet.classList.contains("visible")) {
                bullet.classList.remove("visible")
                bullet.classList.add("invisible")
            }
        }
    }
    function reset_enemies() {
        for (enemy of all_enemies) {
            if (enemy.classList.contains("visible")) {
                enemy.classList.remove("visible")
                enemy.classList.add("invisible")
                health_div = enemy.querySelector(".health")
                health_max_div = enemy.querySelector(".health_max")
                text_display = enemy.querySelector(".text_display")
                health_div.innerHTML = enemy_health_max
                health_max_div.innerHTML = enemy_health_max
                text_display.innerHTML = enemy_health_max
                health_div.style.width = 40 + "px"
                health_div.style.height = 40 + "px"
                health_div.style.left = 0
                health_div.style.top = 0
            }
        }
    }
    function reset_score() {
        if (best_game_score < present_game_score) {
            best_game_score = Math.round(present_game_score)
        }
        last_game_score = Math.round(present_game_score)
        present_game_score = 0
    }
    function total_reset() {
        reset_player_stats()
        reset_player_visuals()
        reset_bullet_stats()
        reset_enemy_stats()
        reset_enemies()
        reset_bullets()
        reset_score()
    }
    function defineMarginsAndMoveStep() {
        let additional_margin_X = 0
        let additional_margin_Y = 0
        if (console_width > 0) {
            additional_margin_X = 15
            moveStep = (console_width / 2 - 3 / 100)
        }
        if (console_height > 0) {
            additional_margin_Y = 45
            moveStep = (console_height / 2 + 14) / 100
        }
        margin_left = 10 + console_width + additional_margin_X
        margin_right = screen_width - 10
        margin_top = 10
        margin_bottom = screen_height - 10 - console_height - additional_margin_Y
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
    changeDirections(player)
    function get_direction_X() {
        dirX = moveStep * Math.sin(corner * Math.PI / 180)
        return dirX
    }
    function get_direction_Y() {
        dirY = -moveStep * Math.cos(corner * Math.PI / 180)
        return dirY
    }
    function changeDirections(thisObject) {
        dirX = get_direction_X()
        dirY = get_direction_Y()
        thisObject.querySelector('.dirX').innerHTML = dirX
        thisObject.querySelector('.dirY').innerHTML = dirY
    }
    let shooting_barrage
    shoot_btn.ontouchstart = () => {
        // anticlick.classList.remove("invisible")
        shooting_barrage = setInterval(shoot_bullet, Math.round(shooting_speed))
        // function end_barrage() {
        //     clearInterval(shooting_barrage)
        //     // anticlick.classList.add("invisible")
        // }
    }
    shoot_btn.ontouchend = () => {
        clearInterval(shooting_barrage)
    }
    function shoot_bullet() {
        let invisible_bullet = ''
        for (bullet of all_bullets) {
            if (bullet.classList.contains("invisible")) {
                invisible_bullet = bullet
                break
            }
        }
        if (invisible_bullet) {
            player_posX = +player.style.left.slice(0, -2) + 25
            player_posY = +player.style.top.slice(0, -2) + 25
            invisible_bullet.querySelector('.speed').innerHTML = bullet_speed
            invisible_bullet.classList.remove('invisible')
            invisible_bullet.classList.add('visible')
            invisible_bullet.setAttribute('style', `top: ${Math.round(player_posY - 5)}px; left: ${Math.round(player_posX - 5)}px`)
            invisible_bullet.querySelector('.dirX').innerHTML = get_direction_X() * bullet_speed
            invisible_bullet.querySelector('.dirY').innerHTML = get_direction_Y() * bullet_speed
            invisible_bullet.querySelector('.damage').innerHTML = Math.round(bullet_damage)
        }
    }
    function moveAnyObject(thatObject, direction) {
        posX = +(thatObject.style.left).slice(0, -2)
        posY = +(thatObject.style.top).slice(0, -2)
        dirX = +thatObject.querySelector('.dirX').innerHTML
        dirY = +thatObject.querySelector('.dirY').innerHTML
        speed = +thatObject.querySelector('.speed').innerHTML
        thatObject.style.left = (posX + (speed * dirX * direction)) + 'px'
        thatObject.style.top = (posY + (speed * dirY * direction)) + 'px'
    }
    let moveFoward
    up_btn.ontouchstart = () => {
        moveFoward = setInterval(() => {
            moveAnyObject(player, 1)
        }, game_speed)
    }
    up_btn.ontouchend = () => {
        clearInterval(moveFoward)
    }
    let moveBackward
    down_btn.ontouchstart = () => {
        moveBackward = setInterval(() => {
            moveAnyObject(player, -1)
        }, game_speed)
    }
    down_btn.ontouchend = () => {
        clearInterval(moveBackward)
    }
    let turnLeft
    left_btn.ontouchstart = () => {
        turnLeft = setInterval(() => {
            corner -= turnSpeed
            document.documentElement.style.setProperty('--corner', corner)
            changeDirections(player)
            if (corner <= -360) {
                corner = 0
            }
        }, game_speed)
    }
    left_btn.ontouchend = () => {
        clearInterval(turnLeft)
    }
    let turnRight
    right_btn.ontouchstart = () => {
        turnRight = setInterval(() => {
            corner += turnSpeed
            document.documentElement.style.setProperty('--corner', corner)
            changeDirections(player)
            if (corner >= 360) {
                corner = 0
            }
        }, game_speed)
    }
    right_btn.ontouchend = () => {
        clearInterval(turnRight)
    }

    let show_debug = document.getElementById('show_debug')
    show_debug.onclick = () => {
        console_debug.classList.toggle("invisible")
    }
    let menu_btn = document.getElementById("menu_btn")
    let play_btn = document.getElementById("play")
    let play_game_regen = ''
    let play_game_movement = ''
    let spawning_enemies = ''
    menu_btn.onclick = () => {
        menu.classList.toggle('show')
        score_bar.classList.toggle('invisible')
        clearInterval(play_game_movement)
        clearInterval(play_game_regen)
        clearInterval(spawning_enemies)
    }
    play_btn.onclick = () => {
        menu.classList.toggle('show')
        score_bar.classList.toggle('invisible')
        play_game_movement = setInterval(game_tick_movement, game_speed)
        play_game_regen = setInterval(game_tick_regen, game_speed * player_regen_speed)
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
    function spawn_enemy() {
        let invisible_enemy = ''
        for (enemy of all_enemies) {
            if (enemy.classList.contains('invisible')) {
                invisible_enemy = enemy
                break
            }
        }
        if (invisible_enemy) {
            invisible_enemy.querySelector('.speed').innerHTML = enemy_speed
            health_div = invisible_enemy.querySelector('.health')
            health_max_div = invisible_enemy.querySelector('.health_max')
            text_display = enemy.querySelector(".text_display")
            damage_div = enemy.querySelector(".damage")
            invisible_enemy.classList.remove('invisible')
            health_div.classList.remove('invisible')
            health_max_div.innerHTML = Math.round(enemy_health_max)
            health_div.innerHTML = Math.round(enemy_health_max)
            rgb1 = 255 - (Math.random() * 50)
            rgb2 = 0 + (Math.random() * 100)
            rgb3 = 25 + (Math.random() * 75)
            health_div.style.background = `rgb(${rgb1},${rgb2},${rgb3})`
            text_display.innerHTML = show_big_number(Math.round(enemy_health_max))
            damage_div.innerHTML = Math.round(enemy_damage)
            text_display.style.left = 20 - (text_display.innerHTML.length * 4) + 'px'
            enemy_upgr()
            invisible_enemy.classList.add('visible')
            let play_field_side = Math.floor(Math.random() * 4)
            let direction = getRndInteger(0, 1)
            dirX = (Math.random()) * enemy_speed
            dirY = (Math.random()) * enemy_speed
            switch (play_field_side) {
                case 0:
                    spawnY = margin_top - 15
                    spawnX = getRndInteger(margin_left, margin_right) - 15
                    dirY = - dirY
                    break
                case 1:
                    spawnY = getRndInteger(margin_top, margin_bottom) - 15
                    spawnX = margin_right - 25
                    direction = direction + 2
                    break
                case 2:
                    spawnY = margin_bottom - 25
                    spawnX = getRndInteger(margin_left, margin_right) - 15
                    dirX = - dirX
                    break
                case 3:
                    spawnY = getRndInteger(margin_top, margin_bottom) - 15
                    spawnX = margin_left - 15
                    dirX = - dirX
                    dirY = - dirY
                    break
            }
            invisible_enemy.setAttribute('style', `top: ${Math.round(spawnY)}px; left: ${Math.round(spawnX)}px`)
            invisible_enemy.querySelector('.dirX').innerHTML = dirX
            invisible_enemy.querySelector('.dirY').innerHTML = dirY
        }
    }
    function game_tick_regen() {
        player_regenerates()
    }
    function game_tick_movement() {
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
    function player_regenerates() {
        health_div = player.querySelector('.health')
        health = +health_div.innerHTML
        health_max = +player.querySelector('.health_max').innerHTML
        if (health < health_max) {
            regen = +player.querySelector('.regen').innerHTML
            percentage = health / health_max
            bonus_regen = percentage
            health_div.style.width = (50 * percentage) + "px"
            health_div.style.height = (50 * percentage) + "px"
            health_div.style.top = (25 - 25 * percentage) + "px"
            health_div.style.left = (25 - 25 * percentage) + "px"
            if (percentage < 0.3) {
                bonus_regen = 0.3
            }
            health = health + (regen / bonus_regen)
            player.querySelector('.health').innerHTML = health
            text_display = player.querySelector('.text_display')
            text_display.innerHTML = show_big_number(Math.round(health))
            text_display.style.left = 25 - (text_display.innerHTML.length * 5) + 'px'
            player_health_upgr(percentage)
            player_regeneration_upgr(percentage)
            if (health > health_max) {
                health = health_max
            }
        }
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
                            damage = +bullet.querySelector(".damage").innerHTML
                            enemy_takes_damage(enemy, damage)
                            bullet_shows_damage(bullet, damage)
                            bullet_upgr()
                        }
                    }
                }
            }
        }
    }
    function enemy_takes_damage(enemy, damage) {
        health_div = enemy.querySelector(".health")
        text_display = enemy.querySelector(".text_display")
        health = +health_div.innerHTML
        health_max = +enemy.querySelector(".health_max").innerHTML
        health = health - damage
        if (health <= 0) {
            present_game_score = present_game_score + (100 * health_max * (player_health / player_health_max))
            show_scores(Math.round(present_game_score))
            enemy.classList.add("invisible")
            enemy.classList.remove("visible")
            health_div.innerHTML = enemy_health_max
            health_div.style.width = 40 + "px"
            health_div.style.height = 40 + "px"
            health_div.style.left = 0
            health_div.style.top = 0
            spawn_interval_increased()

        } else {
            text_display.innerHTML = show_big_number(health)
            text_display.style.left = 20 - (text_display.innerHTML.length * 4) + 'px'
            health_div.innerHTML = health
            percent = health / health_max
            health_div.style.width = (40 * percent) + "px"
            health_div.style.height = (40 * percent) + "px"
            health_div.style.top = (20 - 20 * percent) + "px"
            health_div.style.left = (20 - 20 * percent) + "px"
        }
    }
    function player_takes_damage(damage) {
        health_div = player.querySelector(".health")
        text_display = player.querySelector(".text_display")
        health = +health_div.innerHTML
        health_max = +player.querySelector(".health_max").innerHTML
        health = health - damage
        if (health < 0.5 || health == Infinity || health == NaN) {
            total_reset()
        } else {
            text_display.innerHTML = show_big_number(Math.round(health))
            text_display.style.left = 25 - (text_display.innerHTML.length * 6) + 'px'
            health_div.innerHTML = health
            percentage = health / health_max
            health_div.style.width = (50 * percentage) + "px"
            health_div.style.height = (50 * percentage) + "px"
            health_div.style.top = (25 - 25 * percentage) + "px"
            health_div.style.left = (25 - 25 * percentage) + "px"
            player_health_bonus_upgr(damage, percentage)
        }
    }
    function bullet_shows_damage(bullet, damage) {
        bullet.classList.remove("visible")
        damage_div = bullet.querySelector(".damage")
        bullet.classList.add("show_damage")
        setTimeout(end_of_bullet, 2000)
        function end_of_bullet() {
            bullet.classList.remove("show_damage")
            bullet.classList.add("invisible")
        }
    }
    function enemy_moves() {
        for (enemy of all_enemies) {
            if (enemy.classList.contains('visible')) {
                dirX = +enemy.querySelector('.dirX').innerHTML
                dirY = +enemy.querySelector('.dirY').innerHTML
                e_posX_px = enemy.style.left
                e_posY_px = enemy.style.top
                posX = +e_posX_px.slice(0, e_posX_px.length - 2)
                posY = +e_posY_px.slice(0, e_posY_px.length - 2)
                if (posX < margin_left - 15) {
                    dirX = Math.abs(dirX) + enemy_speed_upgr
                }
                if (posX > margin_right - 25) {
                    dirX = - Math.abs(dirX) + enemy_speed_upgr
                }
                if (posY < margin_top - 15) {
                    dirY = Math.abs(dirY) + enemy_speed_upgr
                }
                if (posY > margin_bottom - 25) {
                    dirY = - Math.abs(dirY) + enemy_speed_upgr
                }
                enemy.querySelector('.dirX').innerHTML = dirX
                enemy.querySelector('.dirY').innerHTML = dirY
                colided = +enemy.querySelector('.colided').innerHTML
                if (colided > 0) {
                    colided--
                }
                enemy.querySelector('.colided').innerHTML = colided
                new_posX = posX + (dirX)
                new_posY = posY + (dirY)
                enemy.style.left = new_posX + 'px'
                enemy.style.top = new_posY + 'px'
            }
        }
    }
    function enemies_collide() {
        for (this_enemy of all_enemies) {
            if (this_enemy.classList.contains('visible')) {
                for (other_enemy of all_enemies) {
                    if (other_enemy.classList.contains('visible')) {
                        other_enemy_id = other_enemy.querySelector('.id').innerHTML
                        this_enemy_id = this_enemy.querySelector('.id').innerHTML
                        if (this_enemy_id != other_enemy_id) {
                            this_colided = +this_enemy.querySelector(".colided").innerHTML
                            other_colided = +other_enemy.querySelector(".colided").innerHTML
                            if (this_colided <= 0 && other_colided <= 0) {
                                this_dirX = this_enemy.querySelector('.dirX').innerHTML
                                this_dirY = this_enemy.querySelector('.dirY').innerHTML
                                this_e_posX_px = this_enemy.style.left
                                this_e_posY_px = this_enemy.style.top
                                this_e_posX = +this_e_posX_px.slice(0, this_e_posX_px.length - 2)
                                this_e_posY = +this_e_posY_px.slice(0, this_e_posY_px.length - 2)
                                other_dirX = other_enemy.querySelector('.dirX').innerHTML
                                other_dirY = other_enemy.querySelector('.dirY').innerHTML
                                other_e_X_px = other_enemy.style.left
                                other_e_Y_px = other_enemy.style.top
                                other_e_X = +other_e_X_px.slice(0, other_e_X_px.length - 2)
                                other_e_Y = +other_e_Y_px.slice(0, other_e_Y_px.length - 2)
                                dif_X = this_e_posX - other_e_X
                                dif_Y = this_e_posY - other_e_Y
                                dif_X_abs = Math.abs(dif_X)
                                dif_Y_abs = Math.abs(dif_Y)
                                if (dif_X_abs < 40 && dif_Y_abs < 40) {
                                    new_this_dirX = this_dirX
                                    new_this_dirY = this_dirY
                                    new_other_dirX = other_dirX
                                    new_other_dirY = other_dirY

                                    if (dif_X_abs > dif_Y_abs) {
                                        if (this_e_posX < other_e_X) {
                                            new_this_dirX = - Math.abs(other_dirX) + enemy_speed_upgr
                                            new_other_dirX = Math.abs(this_dirX) + enemy_speed_upgr
                                        }
                                        if (this_e_posX > other_e_X) {
                                            new_this_dirX = Math.abs(other_dirX) + enemy_speed_upgr
                                            new_other_dirX = - Math.abs(this_dirX) + enemy_speed_upgr
                                        }
                                    } else if (dif_Y_abs > dif_X_abs) {
                                        if (this_e_posY < other_e_Y) {
                                            new_this_dirY = - Math.abs(other_dirY) + enemy_speed_upgr
                                            new_other_dirY = Math.abs(this_dirY) + enemy_speed_upgr
                                        }
                                        if (this_e_posY > other_e_Y) {
                                            new_this_dirY = Math.abs(other_dirY) + enemy_speed_upgr
                                            new_other_dirY = - Math.abs(this_dirY) + enemy_speed_upgr
                                        }
                                    }

                                    this_enemy.querySelector('.dirX').innerHTML = new_this_dirX
                                    this_enemy.querySelector('.dirY').innerHTML = new_this_dirY
                                    this_enemy.querySelector('.colided').innerHTML = 2
                                    this_enemy.querySelector('.colided').innerHTML = 2
                                    other_enemy.querySelector('.dirX').innerHTML = new_other_dirX
                                    other_enemy.querySelector('.dirY').innerHTML = new_other_dirY
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    function collide_with_me() {
        for (this_enemy of all_enemies) {
            if (this_enemy.classList.contains('visible')) {
                other_e_X = +player.style.left.slice(0, -2) + 5
                other_e_Y = +player.style.top.slice(0, -2) + 5
                this_dirX = this_enemy.querySelector('.dirX').innerHTML
                this_dirY = this_enemy.querySelector('.dirY').innerHTML
                this_e_posX_px = this_enemy.style.left
                this_e_posY_px = this_enemy.style.top
                this_e_posX = +this_e_posX_px.slice(0, this_e_posX_px.length - 2)
                this_e_posY = +this_e_posY_px.slice(0, this_e_posY_px.length - 2)
                dif_X = this_e_posX - other_e_X
                dif_Y = this_e_posY - other_e_Y
                dif_X_abs = Math.abs(dif_X)
                dif_Y_abs = Math.abs(dif_Y)
                if (dif_X_abs < 40 && dif_Y_abs < 40) {
                    new_this_dirX = this_dirX
                    new_this_dirY = this_dirY

                    if (dif_X_abs > dif_Y_abs) {
                        if (this_e_posX < other_e_X) {
                            new_this_dirX = - Math.abs(this_dirX)
                        }
                        if (this_e_posX > other_e_X) {
                            new_this_dirX = Math.abs(this_dirX)
                        }
                    } else if (dif_Y_abs > dif_X_abs) {
                        if (this_e_posY < other_e_Y) {
                            new_this_dirY = - Math.abs(this_dirY)
                        }
                        if (this_e_posY > other_e_Y) {
                            new_this_dirY = Math.abs(this_dirY)
                        }
                    }

                    this_enemy.querySelector('.dirX').innerHTML = new_this_dirX
                    this_enemy.querySelector('.dirY').innerHTML = new_this_dirY
                    damage_to_player = Math.round(+this_enemy.querySelector('.damage').innerHTML)
                    player_melee_dmg_upgrade(1)
                    player_takes_damage(damage_to_player)
                    damage_to_enemy = Math.round(Math.round(player_melee_dmg / 3))
                    enemy_takes_damage(this_enemy, damage_to_enemy)
                }
            }
        }
    }
})
