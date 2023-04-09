document.addEventListener("DOMContentLoaded", () => {

    let grid = document.querySelector("#grid")
    let grid_template_columns = ""
    let cells_data = []
    for (let i = 0; i < 30; i++) {
        grid_template_columns += "auto "
        for (let a = 0; a < 30; a++) {
            cell_id = `y${i}x${a}`
            cell_data = { "y": i, "x": a }
            cells_data.push(cell_data)
            grid.innerHTML += `
                <div id="${cell_id}" class="cell"></div>
            `
        }
    }
    if (screen.width > screen.height) {
        grid.classList.add("wide")
    } else {
        grid.classList.add("high")
    }
    grid.setAttribute("style", `grid-template-columns: ${grid_template_columns}`)

    let cells_rendered = document.querySelectorAll(".cell")

    for (cell of cells_data) {
        let cell_rendered = document.getElementById(`y${cell.y}x${cell.x}`)
        cell_rendered.onclick = () => {
            let start = document.getElementById("start")
            if (start.classList.contains("cursor")) {
                start.classList.remove("cursor")
                cell_rendered.classList.add("cursor")
            } else {
                let cursor = document.querySelector(".cursor")
                cursor_id = cursor.getAttribute("id")
                cursor_x_pos = cursor_id.indexOf("x")
                cursor_y = +cursor_id.slice(1, cursor_x_pos)
                cursor_x = +cursor_id.slice(cursor_x_pos + 1, cursor_id.length)

                cell_id = cell_rendered.getAttribute("id")
                x_pos = cell_id.indexOf("x")
                cell_y = +cell_id.slice(1, x_pos)
                cell_x = +cell_id.slice(x_pos + 1, cell_id.length)
                x_difference = cursor_x - cell_x

                if (x_difference < 0) {
                    x_difference = cell_x - cursor_x
                }
                y_difference = cursor_y - cell_y
                if (y_difference < 0) {
                    y_difference = cell_y - cursor_y
                }
                if (x_difference > y_difference) {
                    if (cursor_x < cell_x && cursor_x < 30) {
                        cursor.classList.remove("cursor")
                        let new_cursor = document.getElementById(`y${cursor_y}x${cursor_x + 1}`)
                        new_cursor.classList.add("cursor")
                    }
                    if (cursor_x > cell_x && cursor_x > 0) {
                        cursor.classList.remove("cursor")
                        let new_cursor = document.getElementById(`y${cursor_y}x${cursor_x - 1}`)
                        new_cursor.classList.add("cursor")
                    }
                }
                if (x_difference < y_difference) {
                    if (cursor_y < cell_y && cursor_y < 30) {
                        cursor.classList.remove("cursor")
                        let new_cursor = document.getElementById(`y${cursor_y + 1}x${cursor_x}`)
                        new_cursor.classList.add("cursor")
                    }
                    if (cursor_y > cell_y && cursor_y > 0) {
                        cursor.classList.remove("cursor")
                        let new_cursor = document.getElementById(`y${cursor_y - 1}x${cursor_x}`)
                        new_cursor.classList.add("cursor")
                    }
                }
            }
            document.getElementById("console").innerHTML = `X:${cursorX}, Y:${cursorY}`
        }
    }
})

document.addEventListener('keydown', function (event) {
    let cursor = document.querySelector(".cursor")
    cursor_id = cursor.getAttribute("id")
    cursor_x_pos = cursor_id.indexOf("x")
    cursor_y = +cursor_id.slice(1, cursor_x_pos)
    cursor_x = +cursor_id.slice(cursor_x_pos + 1, cursor_id.length)
    if (event.keyCode == 37 && cursor_x > 0) {
        let new_cursor = document.getElementById(`y${cursor_y}x${cursor_x - 1}`)
        cursor.classList.remove("cursor")
        new_cursor.classList.add("cursor")
        // alert('Left was pressed');
    }
    else if (event.keyCode == 39  && cursor_x < 29) {
        let new_cursor = document.getElementById(`y${cursor_y}x${cursor_x + 1}`)
        cursor.classList.remove("cursor")
        new_cursor.classList.add("cursor")
        // alert('Right was pressed');
    }
    else if (event.keyCode == 38  && cursor_y > 0) {
        let new_cursor = document.getElementById(`y${cursor_y - 1}x${cursor_x}`)
        cursor.classList.remove("cursor")
        new_cursor.classList.add("cursor")
        // alert('Up was pressed');
    }
    else if (event.keyCode == 40 && cursor_y < 29) {
        let new_cursor = document.getElementById(`y${cursor_y + 1}x${cursor_x}`)
        cursor.classList.remove("cursor")
        new_cursor.classList.add("cursor")
        // alert('Down was pressed');
    }
})

document.addEventListener('click', printMousePos, true);
function printMousePos(e) {
    cursorX = e.pageX;
    cursorY = e.pageY;
}