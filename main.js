// Наш объект
var my = {
    field: 0,
    ships: [],
    shipsAmount: 10
// Объект соперника
}
var opp = {
    field: 0,
    ships: [],
    shipsAmount: 10
}

// Создаем игровые поля
createField(my);
createScoreboard();
createField(opp);

// Технические исходные данные
let body = document.querySelector('body');
let numberOfShip = 0;
let startShipCoordinates = [];
let shipCoordinates = [];
let flag = true;
let turn = true;
let newTry = true;
let possibleShip = [];
var scoreBoard;
var scoreTable;
let win = 'win';
let lose = 'lose';

// Добавляем переключатель положения корабля
let direction = 'horizontal';
window.addEventListener('keyup', function (e) {
    if (e.keyCode === 32 && direction === 'horizontal') {
        direction = 'vertical';
    }
    else if (e.keyCode === 32 && direction === 'vertical') {
        direction = 'horizontal'
    }
});

// Добавляем главный обработчик событий, с помощью которого расставляем корабли на поле
let excel = my.field.querySelectorAll('.excel');
for (let i=0; i<excel.length; i++) {
    hoverHandler(excel[i])
}
scoreTable.innerHTML = 'Расставьте свои корабли';
scoreSub.innerHTML = 'Пробел - повернуть корабль';

// ---------------- ОБЪЯВЛЕНИЯ ФУНКЦИЙ -------------------

// Функция создания игрового поля и разбития его на ячейки
function createField (obj) {
    // Создание игрового поля
    let field = document.createElement('div');
    field.classList.add('field');
    obj.field = field;
    // Присвоение ячейкам класса excel
    for(let i=1; i<=100; i++) {
        obj.excel = document.createElement('div');
        obj.excel.classList.add('excel');
        obj.excel.classList.add('sea');
        obj.field.appendChild(obj.excel)
    }

    setCoordinates(obj);

    // Добавление полей в DOM
    document.body.appendChild(obj.field);
}

function createScoreboard () {
    scoreBoard = document.createElement('div');
    scoreBoard.classList.add('score-board');

    scoreTable = document.createElement('p');
    scoreTable.classList.add('score');
    scoreSub = document.createElement('p');
    scoreSub.classList.add('sub-score');

    scoreBoard.appendChild(scoreTable);
    scoreBoard.appendChild(scoreSub);
    document.body.appendChild(scoreBoard);
}

// Функция присвоения координат ячейкам
function setCoordinates (obj) {
    let x=1;
    let y=10;
    let excel = obj.field.querySelectorAll('.excel')

    for(let i=0; i<excel.length; i++) {
        excel[i].setAttribute('data-posX', x);
        excel[i].setAttribute('data-posY', y);
        x++
        if (x === 11) {
            x=1
            y--
        }
    }
}

// Обработчик движения мыши и кликов по ячейкам
function hoverHandler (excel) {
    excel.addEventListener('mouseover', addHighlight);
    excel.addEventListener('mouseleave', removeHighlight);
    excel.addEventListener('click', addShip);
}

// Удаление обработчиков 
function delHoverHandler () {
    for (let i=0; i<excel.length; i++) {
        excel[i].removeEventListener('mouseover', addHighlight);
        excel[i].removeEventListener('mouseleave', removeHighlight);
        excel[i].removeEventListener('click', addShip);
    }
}

// Функция, определяющая координаты корабля и рассчитывающая возможность его размещения в указанном месте
function addHighlight() { 
    // Получение координат ячейки, над которой находится курсор 
    startShipCoordinates = [this.getAttribute('data-posX'), this.getAttribute('data-posY')]
    // Массив с координатами корабля
    shipCoordinates = [];
    // Создание тела корабля в зависимости от его положения в пространстве
    createShip(my);  
    
    // Назначение цвета корабля в зависимости от возможности его размещения в указанном месте
    for (let i = 0; i < shipCoordinates.length; i++) {
        if (flag) {
            shipCoordinates[i].classList.add('highlight');
        }
        else {
            if (shipCoordinates[i] != null) {
                shipCoordinates[i].classList.add('highlight-red');
            }
        }
    }
}

function createShip(obj) {
    let a;
    let j = 0;
    let i = 0;
    for (let k = -1; k <= 2; k++) {
        if (direction == 'horizontal') {
            i = k;
        }
        else {
            j = k;
        }
        a = obj.field.querySelector('[data-posX="' + (+startShipCoordinates[0] + i) + '"][data-posY="' + (+startShipCoordinates[1] + j) + '"]');
        shipCoordinates.push(a);
    }

    // Уменьшение размеров следующего корабля в зависимости от их количества на поле
    if (numberOfShip >= 1) {
        shipCoordinates.pop();
    }
    if (numberOfShip >= 3) {
        shipCoordinates.pop();
    }
    if (numberOfShip >= 6) {
        shipCoordinates.shift();
    }

    // Флаг, разрешающий или запрещающий постановку корабля
    flag = true;

    // Цикл, определяющий положение flag'a
    for (let i = 0; i < shipCoordinates.length; i++) {
        // Массив с координатами соседних с элементом корабля ячеек
        if (shipCoordinates[i] != null) {
            // Получение координат текущего элемента корабля
            let a = [shipCoordinates[i].getAttribute('data-posX'), shipCoordinates[i].getAttribute('data-posY')];
            let x = -1;
            let y = -1;
            // Проверка всех соседних ячеек на наличие других кораблей и промахов
            for (let i = 1; i <= 9; i++) {
                let b = obj.field.querySelector('[data-posX="' + (+a[0] + x) + '"][data-posY="' + (+a[1] + y) + '"]')
                if (b != null && b.classList.contains('ship')) {
                    flag = false;
                    break;
                };
                x++;
                if (x == 2) {
                    x = -1;
                    y++
                }
            }
        }
        // Проверка не выходит ли часть корабля за игровое поле
        if (shipCoordinates[i] == null) {
            flag = false;
            break;
        }
    }
    
    
}

// Функция удаления подсветки ячейки если мышь покинула ее
function removeHighlight() {
    for (let i=0; i<shipCoordinates.length; i++) {
        if (shipCoordinates[i] != null) {
            shipCoordinates[i].classList.remove('highlight');
            shipCoordinates[i].classList.remove('highlight-red');
        }
    }
}

// Функция добавления корабля на поле по клику
function addShip () {
    if (flag) {
        for (let i=0; i<shipCoordinates.length; i++) {
            shipCoordinates[i].classList.add('ship');
            shipCoordinates[i].setAttribute('data-ship', numberOfShip)
            shipCoordinates[i].classList.remove('sea');
            removeHighlight();
        }
        my.ships.push(shipCoordinates.length);
        console.log(my);
        numberOfShip++;
    }
    // Удаление всех обработчиков если все корабли расставлены
    if (numberOfShip >= 10) {
        delHoverHandler();
        setOppShips();
    }
}

// Функция автоматического расположения кораблей соперника
function setOppShips () {
    numberOfShip = 0;
        while(numberOfShip < 10) {
            startShipCoordinates = getRandomCoordinates();
            shipCoordinates = [];
            
            if (getRandomNumber(2) == 1) {
                direction = 'horizontal';
            }
            else {
                direction = 'vertical';
            }
            console.log('Ставлю корабль соперника в положение ' + direction)
            createShip(opp);

            if (flag) {
                for (let i=0; i<shipCoordinates.length; i++) {
                    shipCoordinates[i].classList.add('ship');
                    shipCoordinates[i].setAttribute('data-ship', numberOfShip);
                    shipCoordinates[i].classList.add('hide');
                    shipCoordinates[i].classList.remove('sea');
                }
                opp.ships.push(shipCoordinates.length);
                console.log(opp);
                numberOfShip++;
            }
        }
        scoreTable.textContent = 'Противник расставляет корабли'
        scoreSub.innerHTML = '';
        setTimeout(function () {
            round();
        }, 3000); 
    
}

// Определение случайных координат
function getRandomCoordinates () {
    return [getRandomNumber(10), getRandomNumber(10)]
}

// Определение случайного числа
function getRandomNumber (length) {
    return Math.ceil(Math.random()*length);
}

// Основной раунд игры
function round () {
    scoreTable.textContent = 'Ваш ход';
    turn = true;
    let oppExcels = opp.field.querySelectorAll('.excel');
    for (let i=0; i<oppExcels.length; i++) {
        clickHandler(oppExcels[i]);
    }
}

// Мой ход
function myTurn () {
    if (turn && this.classList.contains('ship')) {
        let shipCode = this.getAttribute('data-ship');
        opp.ships[shipCode]--;
        if (opp.ships[shipCode] == 0) {
            let ship = opp.field.querySelectorAll('[data-ship="' + shipCode + '"]');
            for (let i = 0; i < ship.length; i++) {
                // Получение координат текущего элемента корабля
                let a = [ship[i].getAttribute('data-posX'), ship[i].getAttribute('data-posY')];
                let x = -1;
                let y = -1;
                // Проверка всех соседних ячеек на наличие других кораблей и промахов
                for (let j = 1; j <= 9; j++) {
                    let b = opp.field.querySelector('[data-posX="' + (+a[0] + x) + '"][data-posY="' + (+a[1] + y) + '"]')
                    if (b != null && b.classList.contains('sea')) {
                        b.classList.add('miss');
                        b.classList.remove('sea');
                    };
                    x++;
                    if (x == 2) {
                        x = -1;
                        y++
                    }
                }            
            }
            opp.shipsAmount--;
            if (opp.shipsAmount == 0) {
                this.classList.remove('hide');
                this.classList.add('hit');
                setTimeout(function () {
                    finishGame(win);
                }, 1000); 
                return;
            }
        }
        this.classList.remove('hide');
        this.classList.add('hit');
        round();
    }
    else if (turn && this.classList.contains('sea')) {
        this.classList.add('miss');
        this.classList.remove('sea');
        turn = false;
        scoreTable.textContent = 'Ход соперника';
        if (newTry) {
            setTimeout(function () {
                oppTurn(my.field);
            }, 1000); 
        }
        else {
            setTimeout(function () {
                oppTurn(possibleShip);
            }, 1000); 
        }
        
    }
}

// Обработчик кликов по полю соперника
function clickHandler (excel) {
    excel.addEventListener('click', myTurn)
    excel.addEventListener('mouseover', makeDark)
    excel.addEventListener('mouseleave', delDark)
}

function makeDark () {
    if (!this.classList.contains('miss') && !this.classList.contains('hit')) {
    this.classList.add('dark');
    }
}

function delDark () {
    this.classList.remove('dark')
}

// Ход соперника
function oppTurn (array) {
    
    let shot;
    let coordinates;
    console.log(possibleShip)
    // Если новая попытка - стреляем по всему полю
    if (newTry) {
        coordinates = getRandomCoordinates();
        shot = array.querySelector('[data-posX="' + coordinates[0] + '"][data-posY="' + coordinates[1] + '"]');
        while (shot.classList.contains('miss') || shot.classList.contains('hit')) {
            coordinates = getRandomCoordinates();
            shot = array.querySelector('[data-posX="' + coordinates[0] + '"][data-posY="' + coordinates[1] + '"]');
        }
        console.log('стреляю по ' + coordinates)
    }
    // Если добиваем предыдущий корабль - стреляем по заданному массиву ячеек
    else {
        let tempArray = [];
        for (let i=0; i<array.length; i++) {
            if (array[i] != null && (array[i].classList.contains('sea') || array[i].classList.contains('ship'))) {
                tempArray.push(array[i]);
                console.log('Временный массив: ' + tempArray);
            }
        }
        array = tempArray;
        shot = array[getRandomNumber(array.length) - 1];
        coordinates = [shot.getAttribute('data-posX'), shot.getAttribute('data-posY')];
        console.log('стреляю по ' + coordinates);
    };
    
    // Проверка попали ли в корабль
    if (shot.classList.contains('ship')) {
        shot.classList.add('hit');
        shot.classList.remove('ship');
        let shipCode = shot.getAttribute('data-ship');
        my.ships[shipCode]--;

        // Окружаем корабль точками если он убит полностью
        if (my.ships[shipCode] == 0) {
            newTry = true;
            let ship = my.field.querySelectorAll('[data-ship="' + shipCode + '"]');
            for (let i = 0; i < ship.length; i++) {
                // Получение координат текущего элемента корабля
                let a = [ship[i].getAttribute('data-posX'), ship[i].getAttribute('data-posY')];
                let x = -1;
                let y = -1;
                // Проверка всех соседних ячеек на наличие других кораблей и промахов
                for (let j = 1; j <= 9; j++) {
                    let b = my.field.querySelector('[data-posX="' + (+a[0] + x) + '"][data-posY="' + (+a[1] + y) + '"]')
                    if (b != null && b.classList.contains('sea')) {
                        b.classList.add('miss');
                        b.classList.remove('sea');
                    };
                    x++;
                    if (x == 2) {
                        x = -1;
                        y++
                    }
                }
            }
            my.shipsAmount--;
            if (my.shipsAmount == 0) {
                setTimeout(function () {
                    finishGame(lose);
                }, 1000); 
                return;
            }
            setTimeout(function () {
                oppTurn(my.field);
            }, 1000);
        }
        // Если корабль убит не полностью определяем ячейки где он может находиться
        else {
            newTry = false;
            possibleShip = [
                my.field.querySelector('[data-posX="' + (+coordinates[0] + 1) + '"][data-posY="' + (+coordinates[1] + 0) + '"]'),
                my.field.querySelector('[data-posX="' + (+coordinates[0] - 1) + '"][data-posY="' + (+coordinates[1] + 0) + '"]'),
                my.field.querySelector('[data-posX="' + (+coordinates[0] + 0) + '"][data-posY="' + (+coordinates[1] + 1) + '"]'),
                my.field.querySelector('[data-posX="' + (+coordinates[0] + 0) + '"][data-posY="' + (+coordinates[1] - 1) + '"]'),
            ];

            let orientation;
            for (let i = 0; i < possibleShip.length; i++) {
                //Проверка был ли этот корабль ранен ранее
                if (possibleShip[i] != null && possibleShip[i].classList.contains('hit')) {
                    if (i < 2) {
                        orientation = 'horizontal';
                    }
                    else if (i >= 2) {
                        orientation = 'vertical';
                    }
                } 
            }
            let arrayToCheck = [];
            console.log(orientation)

            if (orientation == 'horizontal') {
                for (let i = -2; i <= 2; i++) {
                    let x = my.field.querySelector('[data-posX="' + (+coordinates[0] + i) + '"][data-posY="' + coordinates[1] + '"]')
                    let beforeX = my.field.querySelector('[data-posX="' + (+coordinates[0] + i - 1) + '"][data-posY="' + coordinates[1] + '"]')
                    let afterX = my.field.querySelector('[data-posX="' + (+coordinates[0] + i + 1) + '"][data-posY="' + coordinates[1] + '"]')
                    if (x != null && x.classList.contains('hit')) {
                        if (beforeX != null && !beforeX.classList.contains('hit') && !beforeX.classList.contains('miss')) {
                            arrayToCheck.push(beforeX);
                        }
                        if (afterX != null && !afterX.classList.contains('hit') && !afterX.classList.contains('miss')) {
                            arrayToCheck.push(afterX);
                        }
                    }
                }
                console.log('Сейчас будем заряжать по ' + arrayToCheck)
                possibleShip = arrayToCheck;
            }
            else if (orientation == 'vertical') {
                for (let i = -2; i <= 2; i++) {
                    let x = my.field.querySelector('[data-posX="' + coordinates[0] + '"][data-posY="' + (+coordinates[1] + i) + '"]')
                    let beforeX = my.field.querySelector('[data-posX="' + coordinates[0] + '"][data-posY="' + (+coordinates[1] + i - 1) + '"]')
                    let afterX = my.field.querySelector('[data-posX="' + coordinates[0] + '"][data-posY="' + (+coordinates[1] + i + 1) + '"]')
                    if (x != null && x.classList.contains('hit')) {
                        if (beforeX != null && !beforeX.classList.contains('hit') && !beforeX.classList.contains('miss')) {
                            arrayToCheck.push(beforeX);
                        }
                        if (afterX != null && !afterX.classList.contains('hit') && !afterX.classList.contains('miss')) {
                            arrayToCheck.push(afterX);
                        }
                    }
                }
                possibleShip = arrayToCheck;  
            }

            if (my.ships[shipCode] == 0) {
                setTimeout(function () {
                    oppTurn(my.field);
                }, 1000);
            }
            else {
                setTimeout(function () {
                    oppTurn(possibleShip);
                }, 1000);  
            }
        }
    }
    else if (shot.classList.contains('sea')) {
        shot.classList.add('miss');
        shot.classList.remove('sea');
        round();
    }
}

function finishGame (result) {
    if(result == 'win') {
        body.classList.add('win');
        scoreTable.textContent = 'Победа!'
    }
    else {
        body.classList.add('lose');
        scoreTable.textContent = 'Поражение!'
        let unhideShips = opp.field.querySelectorAll('.hide');
        for (let i=0; i<unhideShips.length; i++) {
            unhideShips[i].classList.remove('hide');
        }
    }
    let restart = document.createElement('button');
    restart.innerHTML = 'Сыграть еще'
    scoreBoard.appendChild(restart);
    restart.addEventListener('click', function () {
        location.reload();
    })
    

}