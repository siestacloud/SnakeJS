
class Cell {
    SetPosition() {
        throw new Error("setPosition method shoud be implemented")
    }

    getRandom(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        let x = Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
        let y = Math.floor(Math.random() * (max - min)) + min;
        return { x: x, y: y }
    }
}

class Snake extends Cell {
    constructor() {
        super()
        this.body = []
        this.direction = 'ArrowRight'
    }

    // логика первичного позиционирования змейки  
    SetPosition() {
        // генерация 2х координат в диапазоне от 0 до 9
        let position = this.getRandom(0, 9)

        // определение координат тела змейки относительно головы
        this.body.push(position)
        for (let index = 1; index <= 1; index++) {
            if (position.x === 0) {
                this.body.push({ x: position.x + 10 - index, y: position.y })
                continue
            }
            if (position.x === 1) {
                if (index === 1) {
                    this.body.push({ x: position.x - index, y: position.y })
                    continue
                }
                this.body.push({ x: position.x + 10 - index, y: position.y })
                continue
            }
            this.body.push({ x: position.x - index, y: position.y })
        }
    }

    // логика перемещения змейки (изменения координат головы змейки относительно заданного направления)    
    Moving() {
        var arrCheck = JSON.parse(JSON.stringify(this.body));
        for (const key in this.body) {
            if (key == 0) {
                switch (this.direction) {
                    case 'ArrowUp': this.body[key].y == 9 ? this.body[key].y = 0 : this.body[key].y++; break;
                    case 'ArrowDown': this.body[key].y == 0 ? this.body[key].y = 9 : this.body[key].y--; break;
                    case 'ArrowLeft': this.body[key].x == 0 ? this.body[key].x = 9 : this.body[key].x--; break;
                    case 'ArrowRight': this.body[key].x == 9 ? this.body[key].x = 0 : this.body[key].x++; break;
                }
                continue
            }
            let v = this.body[key]
            this.body[key] = arrCheck[0]
            arrCheck[0] = v
        }
    }

    //локика увеличения длины змейки
    increase() {
        this.body.push(this.body[this.body.length - 1])
    }
}

class Apple extends Cell {
    constructor() {
        super()
        this.body
    }

    // логика позиционирования яблока  
    SetPosition() {
        this.body = [this.getRandom(0, 10)]
    }
}

// класс для работы с DOM
class DOMControl {
    constructor() {
        //Поиск элементов в DOM
        this.currentResultField = document.querySelector(".j-result-current"); // блок c текущим результатом
        this.topResultField = document.querySelector(".j-result-top"); // блок с лучшим результатом
        this.gameField = document.querySelector(".j-game-field");
        this.startBtn = document.querySelectorAll(".j-click-start"); // блок с кнопкой
        this.menu = document.querySelector(".menu")
    }

    // Вешаю обработчик на кнопку старт
    InitStartBtn(callback) {
        this.startBtn.forEach(btn => btn.addEventListener('click', callback))

        // this.startBtn.addEventListener('click', callback)
    }

    // Удаляю обработчик на кнопку старт после начала игры
    RemoveStartBtn(callback) {
        this.startBtn.forEach(btn => btn.removeEventListener('click', callback))
        // this.startBtn.addEventListener('click', callback)
    }

    // Вешаю обработчик на клавиши (up down left right)
    InitKey(ev, callback) {
        this.startBtn.forEach(btn => {
            btn.addEventListener(ev, callback)
            console.log(btn)
        })
    }

    // Метод для отображения переданного игрового элемента
    Display(elements, className) {
        this.gameField.querySelectorAll(".item").forEach(item => {
            item.classList.remove(className);
        })
        this.gameField.querySelectorAll(".item").forEach(item => {
            for (const key in elements) {
                if (item.dataset.x == elements[key].x && item.dataset.y == elements[key].y) {
                    item.classList.add(className);
                }
            }
        })
    }

    controlMenu(color, newColor, val) {
        this.startBtn[0].innerHTML = val
        this.startBtn[0].classList.replace(color, newColor)
    }
    DisplayCurrentResult(v) {
        this.currentResultField.innerHTML = `now: ${v}`
    }
    DisplayTopResult(v) {
        this.topResultField.innerHTML = `top: ${v}`
    }
}


class ClassWithPrivateField {
    #privateField

    constructor() {
        this.#privateField = 42
        //   this.#randomField = 666 // Syntax error
    }
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
        // загрузить из localstorage topPoints
        this.#privateLoadPoints()
        this.#privateDOM.DisplayTopResult(this.#privateTopPoint)

        let callback = () => {
            // меняю стиль первой кнопки в меню
            this.#privateDOM.controlMenu("m-color-green", "m-color-yellow", "stop game")

            this.#privateCurrentPoint = 0
            this.#privateLoadPoints()

            this.#privateDOM.DisplayCurrentResult(this.#privateCurrentPoint)
            this.#privateDOM.DisplayTopResult(this.#privateTopPoint)

            this.#privateSnake.body = []
            this.#privateApple.body = []

            this.#privateSnake.SetPosition() // позиционирую змейку  
            this.#privateApple.SetPosition() // позиционирую яблоко 

            // определяю координаты (коорд яблока не должны совпасть с коорд змейки)
            for (; ;) { if (this.#privateCheckPosition()) { break } }
            // отображаю змейку и яблоко в DOM
            this.#privateDOM.Display(this.#privateSnake.body, "j-snake-active")
            this.#privateDOM.Display(this.#privateApple.body, "j-apple-active")
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
            switch (event.key) {
                case 'ArrowUp': this.#privateSnake.direction != `ArrowDown` ? this.#privateSnake.direction = event.key : console.log("not allow"); break;
                case 'ArrowDown': this.#privateSnake.direction != `ArrowUp` ? this.#privateSnake.direction = event.key : console.log("not allow"); break;
                case 'ArrowLeft': this.#privateSnake.direction != `ArrowRight` ? this.#privateSnake.direction = event.key : console.log("not allow"); break;
                case 'ArrowRight': this.#privateSnake.direction != `ArrowLeft` ? this.#privateSnake.direction = event.key : console.log("not allow"); break;
            }
        })
    }
    // Проверяю координаты яблока
    #privateCheckPosition() {
        for (const key in this.#privateSnake.body) {
            if (JSON.stringify(this.#privateSnake.body[key]) === JSON.stringify(this.#privateApple.body[0])) {
                this.#privateApple.SetPosition() // повторно позиционирую яблоко если совпали координаты со змейкой
                return false
            }
        }
        return true
    }

    // определяю основную логику игры и движения змейки
    #privateInitSnakeAutoMoving(interval, callback) {
        let stop = setInterval(() => {
            this.#privateSnake.Moving();
            // координаты змейки и яблока совпали - у яблока новая позиция - счетчик очков увеличиавется
            if (this.#privateSnake.body[0].x == this.#privateApple.body[0].x && this.#privateSnake.body[0].y == this.#privateApple.body[0].y) {
                this.#privateApple.SetPosition() // позиционирую яблоко 
                for (; ;) { if (this.#privateCheckPosition()) { break } }
                this.#privateCurrentPoint++
                this.#privateDOM.DisplayCurrentResult(this.#privateCurrentPoint)
                this.#privateDOM.Display(this.#privateApple.body, "j-apple-active")
                this.#privateSnake.increase()
            }
            // если змейка зашла на себя - конец игры
            for (const key in this.#privateSnake.body) {
                if (JSON.stringify(this.#privateSnake.body[0]) === JSON.stringify(this.#privateSnake.body[+key + 1])) {
                    clearInterval(stop)
                    // передаю логику обработчика на событие click кнопки
                    this.#privateDOM.InitStartBtn(callback)
                    this.#privateDOM.controlMenu("m-color-yellow", "m-color-green", "new game")
                    this.#privateCurrentPoint > this.#privateTopPoint ? this.#privateSavePoints(this.#privateCurrentPoint) : console.log();
                }
                console.log("game continue")
            }
            // отображаю змейку по новым координатам
            this.#privateDOM.Display(this.#privateSnake.body, "j-snake-active")
        }, interval);
    }

    #privateSavePoints(v) {
        localStorage.setItem('topPoints', v);
    }
    #privateLoadPoints() {
        let storagePoints = localStorage.getItem('topPoints')
        storagePoints ? this.#privateTopPoint = storagePoints : this.#privateTopPoint = 0;
    }
}


// InitGame реализует функционал игры
function InitGame() {

    // Инициализация основных обьектов игры
    const domControl = new DOMControl()
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