
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


// управляет высокоуровневой логикой
// управляет классами змейка и яблоко
// передает данные для отображения классу DOMControl
class GameControl {
    constructor(dom, apple, snake) {
        this.DOM = new DOMControl()
        this.Apple = new Apple()
        this.Snake = new Snake()
        this.currentPoints
        this.topPoints
    }
    // запуск игры
    StartGame() {
        // загрузить из localstorage topPoints
        this.loadPoints()
        this.DOM.DisplayTopResult(this.topPoints)

        console.log("===============   ", this.topPoints)

        let set = () => {
            this.DOM.controlMenu("m-color-green", "m-color-yellow", "stop game")

            this.currentPoints = 0
            this.loadPoints()

            console.log("===============   ", this.topPoints)

            this.DOM.DisplayCurrentResult(this.currentPoints)
            this.DOM.DisplayTopResult(this.topPoints)


            this.Snake.body = []
            this.Apple.body = []

            this.Snake.SetPosition() // позиционирую змейку  
            this.Apple.SetPosition() // позиционирую яблоко 

            // определяю координаты (коорд яблока не должны совпасть с коорд змейки)
            for (; ;) { if (this.checkPosition()) { break } }
            // отображаю змейку и яблоко в DOM
            this.DOM.Display(this.Apple.body, "j-apple-active")
            this.DOM.Display(this.Snake.body, "j-snake-active")
            // запускаю змейку
            this.initSnakeAutoMoving(500, set)
            // удаляю обработчик с кнопки запуска и игрового поля (в процессе игры повторный запуск не допускается)
            this.DOM.RemoveStartBtn(set)
        }

        // передаю логику обработчика на событие click кнопки
        this.DOM.InitStartBtn(set)
        // передаю логику обработчика на событие нажатия клавиши
        this.DOM.InitKey('keydown', (event) => {
            console.log('Нажата клавиша ' + event.key + typeof event.key)
            switch (event.key) {
                case 'ArrowUp': this.Snake.direction != `ArrowDown` ? this.Snake.direction = event.key : console.log("ok"); break;
                case 'ArrowDown': this.Snake.direction != `ArrowUp` ? this.Snake.direction = event.key : console.log(); break;
                case 'ArrowLeft': this.Snake.direction != `ArrowRight` ? this.Snake.direction = event.key : console.log(); break;
                case 'ArrowRight': this.Snake.direction != `ArrowLeft` ? this.Snake.direction = event.key : console.log(); break;
            }
        })
    }

    checkPosition() {
        for (const key in this.Snake.body) {
            if (JSON.stringify(this.Snake.body[key]) === JSON.stringify(this.Apple.body[0])) {
                this.Apple.SetPosition() // повторно позиционирую яблоко если совпали координаты со змейкой
                return false
            }
        }
        return true
    }

    // определяю основную логику игры и движения змейки
    initSnakeAutoMoving(interval, callback) {
        let stop = setInterval(() => {
            this.Snake.Moving();
            // координаты змейки и яблока совпали - у яблока новая позиция - счетчик очков увеличиавется
            if (this.Snake.body[0].x == this.Apple.body[0].x && this.Snake.body[0].y == this.Apple.body[0].y) {
                this.Apple.SetPosition() // позиционирую яблоко 
                for (; ;) { if (this.checkPosition()) { break } }

                this.currentPoints++
                this.DOM.DisplayCurrentResult(this.currentPoints)


                this.DOM.Display(this.Apple.body, "j-apple-active")
                this.Snake.increase()
            }
            // если змейка зашла на себя - конец игры
            for (const key in this.Snake.body) {
                if (JSON.stringify(this.Snake.body[0]) === JSON.stringify(this.Snake.body[+key + 1])) {
                    clearInterval(stop)

                    // передаю логику обработчика на событие click кнопки
                    this.DOM.InitStartBtn(callback)
                    this.DOM.controlMenu("m-color-yellow", "m-color-green", "new game")

                    this.currentPoints > this.topPoints ? this.savePoints(this.currentPoints) : console.log();


                }
                console.log("game continue")
            }

            // отображаю змейку по новым координатам
            this.DOM.Display(this.Snake.body, "j-snake-active")
        }, interval);
    }

    savePoints(v) {
        localStorage.setItem('topPoints', v);
    }
    loadPoints() {
        let storagePoints = localStorage.getItem('topPoints')
        console.log("storagePoints   ", storagePoints);
        storagePoints ? this.topPoints = storagePoints : this.topPoints = 0;
    }
}


// InitGame реализует фенкционал игры
function InitGame() {
    snake =
        apple =
        // console.log(apple.SetPosition());
        // Инициализация управляющего обьекта
        DOMManager =
        // Инициализация управляющего обьекта
        GameManager = new GameControl(DOMManager, apple, snake)
    GameManager.StartGame()
}
// запуск
document.addEventListener("DOMContentLoaded", InitGame);