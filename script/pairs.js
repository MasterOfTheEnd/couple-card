let timer;
let recent;

function pairsStart(startBtn, inputValue) {
  startBtn.addEventListener("click", function () {
    try {
      resetTimer(timer);
    } finally {
      createPairs(inputValue.value);
      step('deck');
      timer = startTimer();
      return timer;
    }
  });
}

function createPairsList() {
  let list = document.createElement("ul");
  list.classList.add('pairs-list');
  list.id = "deck";
  return list;
}

function createPairsElement() {
  let item = document.createElement("li")
  item.classList.add('pairs-item');

  return item;
}

function createPairsItem(item, color) {
  item.style.backgroundColor = color;
  item.style.transition = "transform 0.3s"
  item.style.backgroundImage = "url(./image/card.jpg)"
  return item;
}

function generateColor() {
  let color =
    "rgb(" +
    Math.floor(Math.random() * 255) +
    "," +
    Math.floor(Math.random() * 255) +
    "," +
    Math.floor(Math.random() * 255) +
    ")";

  return color;
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function createPairs(count) {
  let pairsPlace = document.getElementById("pairs-placeholder");
  let pairsList = createPairsList();
  let pairsArr = [];

  for (let i = 0; i != count; i++) {
    let color = generateColor();

    let card1 = createPairsItem(createPairsElement(), color);
    card1.addEventListener("click", function() {
        this.style.transform = 'rotateY(180deg)';
        this.style.backgroundImage = '';
        this.classList.add('upend');
        recent = this;
    })
    pairsArr.push(card1);

    let card2 = createPairsItem(createPairsElement(), color);
    card2.addEventListener("click", function() {
        this.style.transform = 'rotateY(180deg)';
        this.style.backgroundImage = '';
        this.classList.add('upend');
        recent = this;
    })
    pairsArr.push(card2);
  }

  pairsArr = shuffle(pairsArr);

  pairsArr.forEach((item) => {
    pairsList.append(item);
  });

  if (document.getElementById('deck')) {
    document.getElementById('deck').remove();
  }

  pairsPlace.append(pairsList);
}

function step(id = 'deck', className = 'upend', doneIndicate = 'done') {
  let deck = document.getElementById(id);
  let child = Array.from(deck.children);
  let counter = 0;

  deck.addEventListener('click', function() {
    child.forEach(item => {
      if (item.style.transform === 'rotateY(180deg)' && Array.from(item.classList).includes(className) && !Array.from(item.classList).includes(doneIndicate)) {
        ++counter;
      }
    });

    if (counter === 2) {
      match();
    }  else if (counter > 2) {
      gameReset();
    }
    counter = 0;
  })
}

function gameReset(id = 'deck', className = 'done') {
  let deck = document.getElementById(id);
  let child = Array.from(deck.children);
  child.forEach(item => {
    if (recent !== item) {
      if (!Array.from(item.classList).includes(className)) {
        item.style.transform = '';
        item.style.backgroundImage = 'url(./image/card.jpg)';
      }
  
      item.classList.remove('upend')
    }
  });
}

function match(className = 'upend') {
  let card = Array.from(document.querySelectorAll(('.' + className)));

  if (card.length != 1 && card[0].style.backgroundColor === card[1].style.backgroundColor) {
    card.forEach(item => {
      item.classList.remove(className)
    });

    card[0].classList.add('done');
    card[1].classList.add('done');

    gameWin('win-text', timer);
  }
}

function textClear(loseId = 'timeout', winId = 'win-text' ) {
  document.getElementById(loseId) ? document.getElementById(loseId).remove() : null;
  document.getElementById(winId) ? document.getElementById(winId).remove() : null;
}

function gameWin(id = 'win-text', timer) {
  let parent = document.getElementById("pairs-placeholder").parentElement;
  textClear();

  if (Array.from(document.querySelectorAll('.pairs-item')).length === Array.from(document.querySelectorAll('.done')).length) {
    let text =  document.createElement("p");
    text.id = id;
    text.style.fontSize = '2.75rem';
    text.style.fontWeight = 'bold';
    text.style.color = 'green'
    text.innerHTML = 'Вы победили!';

    clearTimeout(timer)
    gameClear('deck');

    parent.append(text);  
  }
}

function timeOut(id = 'timeout') {
  let parent = document.getElementById("pairs-placeholder").parentElement;
  textClear();
  let text =  document.createElement("p");
  text.id = id
  text.style.fontSize = '2.75rem';
  text.style.fontWeight = 'bold';
  text.style.color = '#bf0d2e'
  text.innerHTML = 'Время закончилось!';

  parent.append(text);  
}

function gameClear(id = 'deck') {
  let deck = document.getElementById(id)
  deck.remove()
}

function startTimer() {
  const timer = setTimeout(() => {
    gameClear('deck');
    timeOut('timeout');
  }, 60000);
  
  return timer;
}

function resetTimer(timer) {
  textClear('timeout');
  clearTimeout(timer);
}


window.pairsStart = pairsStart;
