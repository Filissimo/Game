
document.addEventListener("DOMContentLoaded", () => {

    window.oncontextmenu = function (event) {
        event.preventDefault()
    }

    let defaultStats
    function setdefaultStats() {
        defaultStats = {
            'game': {
                'speed': 30,
                'last_score': 0,
                'present_score': 0,
                'best_score': 0
            },
            'player': {
                'size': 0,
                'angle': 0,
                'turnSpeed': 3,
                'speed': 4,
                'healthMax': 10,
                'healthMaxUpgr': 0.1,
                'regen': 1,
                'regen_upgr': 0.001,
                'regen_speed': 10,
                'melee_dmg': 3,
                'melee_dmg_upgr': 0.01
            },
            'bullet': {
                'size': 8,
                'limit': 30,
                'speed': 0.1,
                'speedUpgr': 0.001,
                'damage': 1,
                'damageUpgr': 1.005,
                'count': 1,
                'count_upgr': 0.01,
                'shooting_speed': 250,
                'shooting_speedUpgr': 0.01,
            },
            'enemy': {
                'id': 1,
                'amount': 0,
                'size': 0,
                'limit': 20,
                'angle': 180,
                'angleUpgr': 15,
                'speed': 0.3,
                'speedUpgr': 0.01,
                'spawn_interval': 1,
                'spawn_interval_upgr': 0.3,
                'healthMax': 1,
                'healthMaxUpgr': 1.04,
                'damage': 1,
                'damageUpgr': 1.04
            }
        }
    }
    let thisGame = {}
    let div_enemies = document.getElementById('enemies')
    let div_bullets = document.getElementById('bullets')
    function newGame() {
        setdefaultStats()
        thisGame = {
            'saveGame': 1,
            'game': defaultStats.game,
            'player': defaultStats.player,
            'bulletShootStats': defaultStats.bullet,
            'enemySpawnStats': defaultStats.enemy,
            'bullets': {},
            'enemies': {}
        }
        div_enemies.innerHTML = ''
        div_bullets.innerHTML = ''
        localStorage.setItem('filissimoThisGame', JSON.stringify(thisGame))
    }
    if (!localStorage.getItem('filissimoThisGame')) {
        newGame()
    } else {
        thisGame = JSON.parse(localStorage.getItem('filissimoThisGame'))
    }

    let body = document.querySelector('body')
    let player = document.getElementById('cursor_chaser')

    function set_orientation() {
        screen_width = screen.availWidth
        screen_height = screen.availHeight
        if (screen_width > screen_height) {
            popravkaNaVeter = 10
            screenWidth = screen_width
            screenHeight = screen_height + popravkaNaVeter
            body.classList.remove("portrait")
            document.documentElement.style.setProperty('--screen-width', screenWidth)
            document.documentElement.style.setProperty('--screen-height', screenHeight)
            screenWidth = screen_width
            screenHeight = screen_height
        } else {
            popravkaNaVeter = 10
            screenWidth = screen_height + popravkaNaVeter
            screenHeight = screen_width
            body.classList.add("portrait")
            document.documentElement.style.setProperty('--screen-width', screenWidth)
            document.documentElement.style.setProperty('--screen-height', screenHeight)
        }
        defineMarginsAndMoveStep()
    }
    let marginLeft
    let marginRight
    let marginTop
    let marginBottom
    let popravkaNaVeter = 0
    let moveStep
    setInterval(set_orientation, 1000)
    function defineMarginsAndMoveStep() {
        marginLeft = screenWidth * 0.15 - 15
        marginRight = screenWidth * 0.864
        marginTop = 10
        marginBottom = screenHeight * 0.745
        moveStep = (screenHeight + screenWidth) / 500
        enemySize = moveStep * 10
        thisGame.enemySpawnStats.size = enemySize
        document.documentElement.style.setProperty('--enemy-size', enemySize)
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

    let menu_btn = document.getElementById('menu_btn')
    menu_btn.onclick = () => {
        document.getElementById('menu').classList.toggle('show')
        pause_game()
    }
    let play_btn = document.getElementById('play')
    play_btn.onclick = () => {
        document.getElementById('menu').classList.remove('show')
        resume_game()
    }
    let newGameBtn = document.getElementById('newGame')
    newGameBtn.onclick = () => {
        document.getElementById('menu').classList.remove('show')
        newGame()
        resume_game()
    }

    let gameGoes

    function pause_game() {
        clearInterval(gameGoes)
    }
    function resume_game() {
        gameGoes = setInterval(gameTick, thisGame.game.speed)
    }
    let spawnInterval = thisGame.enemySpawnStats.spawn_interval
    let spawCountdown = spawnInterval
    function gameTick() {
        spawCountdown--
        if (spawCountdown <= 0) {
            spawn_enemy()
            thisGame.enemySpawnStats.spawn_interval += thisGame.enemySpawnStats.spawn_interval_upgr
            spawCountdown = thisGame.enemySpawnStats.spawn_interval
        }
        divsToMove = document.querySelectorAll('#cursor_chaser, #enemies>div, #bullets>div')
        movementAtGameDisplay(divsToMove)
    }
    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function spawn_enemy() {
        enemyAmount = thisGame.enemySpawnStats.amount
        enemyId = thisGame.enemySpawnStats.id
        if (thisGame.enemySpawnStats.limit > enemyAmount) {
            fieldSide = getRndInteger(0, 3)
            size = thisGame.enemySpawnStats.size
            let spawnY
            let spawnX
            switch (fieldSide) {
                case 0: // top
                    spawnY = marginTop
                    spawnX = getRndInteger(marginLeft, marginRight - size)
                    break
                case 1: // right
                    spawnY = getRndInteger(marginTop, marginBottom - size)
                    spawnX = marginRight - size
                    break
                case 2: // bottom
                    spawnY = marginBottom - size
                    spawnX = getRndInteger(marginLeft, marginRight - size)
                    break
                case 3: // left
                    spawnY = getRndInteger(marginTop, marginBottom - size)
                    spawnX = marginLeft
                    break
            }
            thisGame.enemies[`e${enemyId}`] = {
                'id': enemyId,
                'angle': thisGame.enemySpawnStats.angle,
                'spawnY': spawnY,
                'spawnX': spawnX,
                'speed': thisGame.enemySpawnStats.speed,
                'healthMax': thisGame.enemySpawnStats.healthMax,
                'health': thisGame.enemySpawnStats.healthMax,
                'damage': thisGame.enemySpawnStats.damage
            }
            div_enemies.innerHTML += `
                <div id="e${enemyId}">
                    <div class="health"></div>
                </div>
            `
            document.getElementById(`e${enemyId}`).style.left = spawnX + 'px'
            document.getElementById(`e${enemyId}`).style.top = spawnY + 'px'
            thisGame.enemySpawnStats.angle += thisGame.enemySpawnStats.angleUpgr
            thisGame.enemySpawnStats.speed += thisGame.enemySpawnStats.speedUpgr
            thisGame.enemySpawnStats.healthMax *= thisGame.enemySpawnStats.healthMaxUpgr
            thisGame.enemySpawnStats.damage *= thisGame.enemySpawnStats.damageUpgr
            thisGame.enemySpawnStats.spawn_interval += thisGame.enemySpawnStats.spawn_interval_upgr
            enemyAmount++
            enemyId++
            thisGame.enemySpawnStats.amount = enemyAmount
            thisGame.enemySpawnStats.id = enemyId
        }
        localStorage.setItem('filissimoThisGame', JSON.stringify(thisGame))
    }
    if (thisGame.enemySpawnStats.amount > 0 && div_enemies.innerHTML == '') {
        renderEnemies()
    }
    function renderEnemies() {
        for (enemyId in thisGame.enemies) {
            enemy = thisGame.enemies[enemyId]
            div_enemies.innerHTML += `
            <div id="e${enemy.id}">
                <div class="health"></div>
            </div>
            `
            document.getElementById(`e${enemy.id}`).style.left = enemy.spawnX + 'px'
            document.getElementById(`e${enemy.id}`).style.top = enemy.spawnY + 'px'
        }
    }
    function movementAtGameDisplay(divsToMove) {
        for (div of divsToMove) {
            if (div.id.slice(0, 1) == 'e') {
                divData = thisGame.enemies[div.id]
            } else if (div.id.slice(0, 1) == 'b') {
                divData = thisGame.bullets[div.id]
            } else if (div.id == 'cursor_chaser') {
                divData = thisGame.player
            }
        }
        moveThisDiv(div, divData)
    }
    function moveThisDiv(div, divData) {
        
    }
})
