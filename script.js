
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
                'size': 70,
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
                'size': 40,
                'limit': 10,
                'angle': 180,
                'angleUpgr': 15,
                'speed': 0.3,
                'speedUpgr': 0.01,
                'spawn_interval': 500,
                'spawn_interval_upgr': 50,
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
            popravkaNaVeter = 0
            body.classList.remove("portrait")
            document.documentElement.style.setProperty('--screen-width', screen_width)
            document.documentElement.style.setProperty('--screen-height', screen_height)
            screenWidth = screen_width
            screenHeight = screen_height
            defineMarginsAndMoveStep()
        } else {
            popravkaNaVeter = 20
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
    setInterval(set_orientation, 1000)
    function defineMarginsAndMoveStep() {
        marginLeft = screenWidth * 0.15 + 30 - popravkaNaVeter / 2
        marginRight = screenWidth * 0.85 - 10 - popravkaNaVeter / 2
        marginTop = 10
        marginBottom = screenHeight * 0.75 - 10
        moveStep = (screenHeight + screenWidth / 500)
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

    let spawning_enemies

    function pause_game() {
        clearInterval(spawning_enemies)
    }
    function resume_game() {
        spawning_enemies = setInterval(spawn_enemy, thisGame.enemySpawnStats.spawn_interval)
    }
    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function spawn_enemy() {
        enemyAmount = thisGame.enemySpawnStats.amount
        enemyId = thisGame.enemySpawnStats.id
        if (thisGame.enemySpawnStats.limit > enemyAmount) {
            console.log(`Spawning e${enemyId} enemy`)
            fieldSide = Math.round(Math.random() * 4)
            size = thisGame.enemySpawnStats.size
            // let spawnX
            // let spawnY
            switch (fieldSide) {
                case 0:
                    spawnY = marginTop
                    spawnX = getRndInteger(marginLeft, marginRight - size)
                    break
                case 1:
                    spawnY = getRndInteger(marginTop, marginBottom - size)
                    spawnX = marginRight - size / 2
                    break
                case 2:
                    spawnY = marginBottom - size
                    spawnX = getRndInteger(marginLeft, marginRight - size)
                    break
                case 3:
                    spawnY = getRndInteger(marginTop, marginBottom - size)
                    spawnX = marginLeft - size
                    break
            }
            thisGame.enemies[enemyId] = {
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
                    <div class="angle invisible">${thisGame.enemySpawnStats.angle}</div>
                    <div class="speed invisible"">${thisGame.enemySpawnStats.speed}</div>
                    <div class="healthMax" invisible"></div>
                    <div class="health"></div>
                    <div class="damage" invisible"></div>
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
            console.log(`EnemyId ${enemy.id}`)
            div_enemies.innerHTML += `
            <div id="e${enemy.id}">
                <div class="angle invisible">${enemy.angle}</div>
                <div class="speed invisible"">${enemy.speed}</div>
                <div class="healthMax" invisible"></div>
                <div class="health"></div>
                <div class="damage" invisible"></div>
            </div>
            `
            document.getElementById(`e${enemy.id}`).style.left = enemy.spawnX + 'px'
            document.getElementById(`e${enemy.id}`).style.top = enemy.spawnY + 'px'
        }
    }
})
