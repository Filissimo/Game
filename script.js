
document.addEventListener("DOMContentLoaded", () => {

    window.oncontextmenu = function (event) {
        event.preventDefault()
    }

    let defaultStats = {
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
            'health_max': 10,
            'health_max_upgr': 0.1,
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
            'speed_upgr': 0.001,
            'damage': 1,
            'damage_upgr': 0.005,
            'count': 1,
            'count_upgr': 0.01,
            'shooting_speed': 250,
            'shooting_speed_upgr': 0.01,
        },
        'enemy': {
            'size': 40,
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
    function newGame() {
        thisGame = {
            'game': defaultStats.game,
            'player': defaultStats.player,
            'bulletShootStats': defaultStats.bullet,
            'enemySpawnStats': defaultStats.enemy,
            'bullets': {},
            'enemies': {}
        }
        localStorage.setItem('filissimoThisGame', JSON.stringify(thisGame))
    }
    newGame()

    let body = document.querySelector('body')
    let player = document.getElementById('cursor_chaser')

    function set_orientation() {
        screen_width = screen.availWidth
        screen_height = screen.availHeight
        if (screen_width > screen_height) {
            document.documentElement.style.setProperty('--screen-width', screen_width)
            document.documentElement.style.setProperty('--screen-height', screen_height)
            body.classList.remove("portrait")
        } else {
            body.classList.add("portrait")
            document.documentElement.style.setProperty('--screen-width', screen_height)
            document.documentElement.style.setProperty('--screen-height', screen_width)
        }
        // defineMarginsAndMoveStep()

    }
    setInterval(set_orientation, 1000)
})
