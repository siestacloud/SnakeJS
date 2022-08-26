
class Cell {
    PublicSetPosition() { throw new Error("setPosition method shoud be implemented") }

    PublicGetRandom(min, max) {
        let x = Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min))) + Math.ceil(min);
        let y = Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min))) + Math.ceil(min);
        return { x: x, y: y }
    }
}

class Snake extends Cell {
    #privateBody
    #privateDirection
    constructor() {
        super()
        this.#privateBody
        this.#privateDirection
    }

    getBody() { return this.#privateBody }
    getDirection() { return this.#privateDirection }

    setBody(body) { this.#privateBody = body }
    setDirection(direction) { this.#privateDirection = direction }

    // логика первичного позиционирования змейки  
    PublicSetPosition() {
        // генерация 2х координат в диапазоне от 0 до 9
        let position = this.PublicGetRandom(0, 9)

        // определение координат тела змейки относительно головы
        this.#privateBody.push(position)
        for (let index = 1; index <= 1; index++) {
            if (position.x === 0) {
                this.#privateBody.push({ x: position.x + 10 - index, y: position.y })
                continue
            }
            if (position.x === 1) {
                if (index === 1) {
                    this.#privateBody.push({ x: position.x - index, y: position.y })
                    continue
                }
                this.#privateBody.push({ x: position.x + 10 - index, y: position.y })
                continue
            }
            this.#privateBody.push({ x: position.x - index, y: position.y })
        }
    }

    // логика перемещения змейки (изменения координат головы змейки относительно заданного направления)    
    PublicMoving() {
        var arrCheck = JSON.parse(JSON.stringify(this.#privateBody));
        for (const key in this.#privateBody) {
            if (key == 0) {
                switch (this.#privateDirection) {
                    case 'ArrowUp': this.#privateBody[key].y == 9 ? this.#privateBody[key].y = 0 : this.#privateBody[key].y++; break;
                    case 'ArrowDown': this.#privateBody[key].y == 0 ? this.#privateBody[key].y = 9 : this.#privateBody[key].y--; break;
                    case 'ArrowLeft': this.#privateBody[key].x == 0 ? this.#privateBody[key].x = 9 : this.#privateBody[key].x--; break;
                    case 'ArrowRight': this.#privateBody[key].x == 9 ? this.#privateBody[key].x = 0 : this.#privateBody[key].x++; break;
                }
                continue
            }
            let v = this.#privateBody[key]
            this.#privateBody[key] = arrCheck[0]
            arrCheck[0] = v
        }
    }

    //локика увеличения длины змейки
    PublicIncrease() {
        this.#privateBody.push(this.#privateBody[this.#privateBody.length - 1])
    }
}

class Apple extends Cell {
    #privateBody
    constructor() {
        super()
        this.#privateBody
    }

    getBody() { return this.#privateBody }
    setBody(body) { this.#privateBody = body }

    // логика позиционирования яблока  
    PublicSetPosition() { this.#privateBody = [this.PublicGetRandom(0, 10)] }
}

// класс для работы с DOM
// экземпляр класса используется в GameControl
class DOMControl {
    #privateCurrentResultField
    #privateTopResultField
    #privateGameField
    #privateStartBtn
    #privateMenu
    constructor() {
        //Поиск элементов в DOM
        this.#privateCurrentResultField // блок c текущим результатом
        this.#privateTopResultField // блок с лучшим результатом
        this.#privateGameField
        this.#privateStartBtn // блок с кнопкой
        this.#privateMenu
    }

    setCurrentResultField() { this.#privateCurrentResultField = document.querySelector(".j-result-current") }
    setTopResultField() { this.#privateTopResultField = document.querySelector(".j-result-top") }
    setGameField() { this.#privateGameField = document.querySelector(".j-game-field") }
    setStartBtn() { this.#privateStartBtn = document.querySelectorAll(".j-click-start") }
    setMenu() { this.#privateMenu = document.querySelector(".menu") }

    // Вешаю обработчик на кнопку старт
    InitStartBtn(callback) { this.#privateStartBtn.forEach(btn => btn.addEventListener('click', callback)) }

    // Удаляю обработчик на кнопку старт после начала игры
    RemoveStartBtn(callback) { this.#privateStartBtn.forEach(btn => btn.removeEventListener('click', callback)) }

    // Вешаю обработчик на клавиши (up down left right)
    InitKey(ev, callback) { this.#privateStartBtn.forEach(btn => { btn.addEventListener(ev, callback) }) }

    // Метод для отображения переданного игрового элемента
    Display(elements, className) {
        this.#privateGameField.querySelectorAll(".item").forEach(item => { item.classList.remove(className); })
        this.#privateGameField.querySelectorAll(".item").forEach(item => {
            for (const key in elements) {
                if (item.dataset.x == elements[key].x && item.dataset.y == elements[key].y) {
                    item.classList.add(className);
                }
            }
        })
    }
    ControlMenu(color, newColor, val) {
        this.#privateStartBtn[0].innerHTML = val
        this.#privateStartBtn[0].classList.replace(color, newColor)
    }
    // отображение результата
    DisplayCurrentResult(v) { this.#privateCurrentResultField.innerHTML = `now: ${v}` }
    DisplayTopResult(v) { this.#privateTopResultField.innerHTML = `top: ${v}` }
}


// управляет высокоуровневой логикой
// управляет классами змейка и яблоко
// передает данные для отображения классу DOMControl
class GameControl {
    #privateDOM
    #privateApple
    #privateSnake
    #privateTopPoint
    #privateCurrentPoint

    constructor() {
        this.#privateDOM
        this.#privateApple
        this.#privateSnake
        this.#privateTopPoint
        this.#privateCurrentPoint
    }

    setPrivateDOM(dom) { this.#privateDOM = dom; }
    setPrivateSnake(snake) { this.#privateSnake = snake; }
    setPrivateApple(apple) { this.#privateApple = apple; }

    // запуск игры
    PublicStart() {
        this.#privateSnake.setDirection('ArrowRight')
        // загрузить из localstorage topPoints
        this.#privateLoadPoints()
        this.#privateDOM.DisplayTopResult(this.#privateTopPoint)

        let callback = () => {
            // меняю стиль первой кнопки в меню
            this.#privateDOM.ControlMenu("m-color-green", "m-color-yellow", "stop game")

            this.#privateCurrentPoint = 0
            this.#privateLoadPoints()

            this.#privateDOM.DisplayCurrentResult(this.#privateCurrentPoint)
            this.#privateDOM.DisplayTopResult(this.#privateTopPoint)

            this.#privateSnake.setBody([])
            this.#privateApple.setBody([])

            this.#privateSnake.PublicSetPosition() // позиционирую змейку  
            this.#privateApple.PublicSetPosition() // позиционирую яблоко 

            // определяю координаты (коорд яблока не должны совпасть с коорд змейки)
            for (; ;) { if (this.#privateCheckPosition()) { break } }
            // отображаю змейку и яблоко в DOM
            this.#privateDOM.Display(this.#privateSnake.getBody(), "j-snake-active")
            this.#privateDOM.Display(this.#privateApple.getBody(), "j-apple-active")
            // запускаю змейку
            this.#privateInitSnakeAutoMoving(500, callback)
            // удаляю обработчик с кнопки запуска и игрового поля (в процессе игры повторный запуск не допускается)
            this.#privateDOM.RemoveStartBtn(callback)
            // !!!!!!!!! повесить обработчик остановки змейки !!!!!!!!!
        }

        // передаю логику обработчика на событие click кнопки
        this.#privateDOM.InitStartBtn(callback)
        // передаю логику обработчика на событие нажатия клавиши
        this.#privateDOM.InitKey('keydown', (event) => {
            console.log(event.key, "1111111111111", this.#privateSnake.getDirection());

            switch (event.key) {
                case 'ArrowUp': this.#privateSnake.getDirection() != `ArrowDown` ? this.#privateSnake.setDirection(event.key) : console.log("not allow"); break;
                case 'ArrowDown': this.#privateSnake.getDirection() != `ArrowUp` ? this.#privateSnake.setDirection(event.key) : console.log("not allow"); break;
                case 'ArrowLeft': this.#privateSnake.getDirection() != `ArrowRight` ? this.#privateSnake.setDirection(event.key) : console.log("not allow"); break;
                case 'ArrowRight': this.#privateSnake.getDirection() != `ArrowLeft` ? this.#privateSnake.setDirection(event.key) : console.log("not allow"); break;
            }
        })
    }
    // Проверяю координаты яблока
    #privateCheckPosition() {
        for (const key in this.#privateSnake.getBody()) {
            if (JSON.stringify(this.#privateSnake.getBody()[key]) === JSON.stringify(this.#privateApple.getBody()[0])) {
                this.#privateApple.PublicSetPosition() // повторно позиционирую яблоко если совпали координаты со змейкой
                return false
            }
        }
        return true
    }

    // определяю основную логику игры и движения змейки
    #privateInitSnakeAutoMoving(interval, callback) {
        let stop = setInterval(() => {
            this.#privateSnake.PublicMoving();
            // координаты змейки и яблока совпали - у яблока новая позиция - счетчик очков увеличиавется
            if (this.#privateSnake.getBody()[0].x == this.#privateApple.getBody()[0].x && this.#privateSnake.getBody()[0].y == this.#privateApple.getBody()[0].y) {
                this.#privateApple.PublicSetPosition() // позиционирую яблоко 
                for (; ;) { if (this.#privateCheckPosition()) { break } }
                this.#privateCurrentPoint++
                this.#privateDOM.DisplayCurrentResult(this.#privateCurrentPoint)
                this.#privateDOM.Display(this.#privateApple.getBody(), "j-apple-active")
                this.#privateSnake.PublicIncrease()
            }
            // если змейка зашла на себя - конец игры
            for (const key in this.#privateSnake.getBody()) {
                if (JSON.stringify(this.#privateSnake.getBody()[0]) === JSON.stringify(this.#privateSnake.getBody()[+key + 1])) {
                    clearInterval(stop)
                    // передаю логику обработчика на событие click кнопки
                    this.#privateDOM.InitStartBtn(callback)
                    this.#privateDOM.ControlMenu("m-color-yellow", "m-color-green", "new game")
                    this.#privateCurrentPoint > this.#privateTopPoint ? this.#privateSavePoints(this.#privateCurrentPoint) : console.log();
                }
                console.log("game continue")
            }
            // отображаю змейку по новым координатам
            this.#privateDOM.Display(this.#privateSnake.getBody(), "j-snake-active")
        }, interval);
    }

    #privateSavePoints(v) {
        localStorage.setItem('topPoints', v);
    }
    #privateLoadPoints() {
        let storagePoints = localStorage.getItem('topPoints')
        console.log("asdsad  ", storagePoints);
        storagePoints ? this.#privateTopPoint = storagePoints : this.#privateTopPoint = 0;
    }
}


// InitGame реализует функционал игры
function InitGame() {

    
    const domControl = new DOMControl()
    domControl.setCurrentResultField()
    domControl.setTopResultField()
    domControl.setGameField()
    domControl.setStartBtn()
    domControl.setMenu()

    const apple = new Apple()
    const snake = new Snake()

    // Инициализация управляющего обьекта
    const game = new GameControl()

    // передаю основные обьекты игры
    game.setPrivateDOM(domControl)
    game.setPrivateApple(apple)
    game.setPrivateSnake(snake)

    game.PublicStart()
}
// запуск
document.addEventListener("DOMContentLoaded", InitGame);