/* Start defining DOM variables */
let categorie = document.querySelector(`.container .header span:first-of-type`);
let questionsNumber = document.querySelector(
  `.container .header span:last-of-type`
);
let form = document.forms[0];
let question = document.querySelector(`.container .quiz-body h3`);
let ul = document.querySelector(`.container .quiz-body form .choices`);
let bullets = document.querySelector(`.container .footer ul`);
let counter = document.getElementsByClassName(`count`)[0];
let nodes = [];
/* End defining DOM variables */

let trueCounter = 0;
let cnt = 1; // question counter

/* fetching data from data.json */
async function getData() {
  return await (await fetch(`./data.json`)).json();
}

getData().then((data) => {
  // Inserting categorie and questions number
  categorie.textContent = `Categorie: ${data[0].categorie}`;
  questionsNumber.textContent = `Question count: ${data.length - 1}`;

  // Inserting bullets
  for (let i = 0; i < data.length - 1; i++) {
    bullets.appendChild(document.createElement(`li`));
  }

  // Inserting question and answers
  function insertion(quest, answers) {
    question.textContent = quest;
    answers.forEach((element) => {
      let li = document.createElement(`li`);
      let input = document.createElement(`input`);
      input.type = `radio`;
      input.name = `answer`;
      input.value = element;
      input.id = element;
      let label = document.createElement(`label`);
      label.setAttribute(`for`, element);
      label.textContent = element;
      li.appendChild(input);
      li.appendChild(label);
      ul.appendChild(li);
    });
  }
  insertion(data[1].question, data[1].answer.choices);

  // Deleting elements from ul
  function deleteElements() {
    [...ul.children].forEach((element) => {
      element.remove();
    });
  }

  /* Start replacing the question by another one */
  function changeContent() {
    deleteElements();
    insertion(data[cnt + 1].question, data[cnt + 1].answer.choices);
    let submit = document.createElement(`input`);
    submit.type = `submit`;
    ul.parentElement.appendChild(submit);
    bullets.children[cnt].classList.add(`answered`);
  }
  /* End replacing the question by another one */

  /* Start checking answer */
  function editCurrentLi() {
    let list = [...ul.children];
    list[0].parentElement.nextElementSibling.remove();
    for (let i = 0; i < list.length; i++) {
      list[i].firstElementChild.setAttribute(`disabled`, true);
      list[i].firstElementChild.removeAttribute(`name`);
      if (list[i].firstElementChild.checked) {
        list[i].classList.add(`result`);
        list[i].firstElementChild.setAttribute(`checked`, true);
        if (list[i].firstElementChild.value === data[cnt].answer.rightAnswer) {
          trueCounter++;
          list[i].style.backgroundColor = `#64d264`;
        } else {
          list[i].style.backgroundColor = `#f04e4e`;
        }
      }
      if (list[i].firstElementChild.value === data[cnt].answer.rightAnswer) {
        list[i].style.backgroundColor = `#64d264`;
      }
    }
  }
  /* End checking answer */

  /* Start cloning elements */
  function cloneUl() {
    let div = document.querySelector(`.quiz-body`).cloneNode(true);
    nodes.push(div);
  }
  /* End cloning elements */

  /* Show result */
  function showResult() {
    bullets.parentElement.remove();
    document.getElementsByClassName(`quiz-body`)[0].remove();
    let myDiv = document.createElement(`div`);
    myDiv.classList.add(`trueCount`);
    myDiv.innerHTML = `<span></span>, ${trueCounter}/${data.length - 1} !`;
    if (trueCounter <= (data.length - 1) / 2) {
      myDiv.firstElementChild.classList.add(`bad`);
      myDiv.firstElementChild.textContent = `bad`;
    } else {
      myDiv.firstElementChild.classList.add(`perfect`);
      myDiv.firstElementChild.textContent = `Perfect`;
    }
    document.querySelector(`.container`).appendChild(myDiv);
    nodes.forEach((element) => {
      document.querySelector(`.container`).appendChild(element);
    });
  }

  /* Start counter work */
  bullets.children[0].classList.add(`answered`);
  let time;
  // chosing the time format
  if (data[0].time >= 10) time = `00:${data[0].time}`;
  else time = `00:0${data[0].time}`;
  counter.textContent = time;
  let count = setInterval(() => {
    // decrementing the counter every 1s
    let number = counter.textContent.split(`:`)[1] - 1;
    // checking if the time counter is equal to 0
    if (number < 0) {
      // checking if the current question isn't the last one
      if (cnt !== data.length - 1) {
        counter.textContent = time;
        editCurrentLi();
        cloneUl();
        changeContent();
        cnt++;
      } else {
        clearInterval(count);
        editCurrentLi();
        cloneUl();
        showResult();
      }
    } else {
      if (number >= 10) counter.textContent = `00:${number}`;
      else counter.textContent = `00:0${number}`;
    }
  }, 1000);
  /* End counter work */

  /* Start onclick event */
  form.onsubmit = (e) => {
    e.preventDefault();
    //  checking if the current question isn't the last one
    if (cnt !== data.length - 1) {
      editCurrentLi();
      cloneUl();
      changeContent();
      counter.textContent = time;
      cnt++;
    } else {
      clearInterval(count);
      editCurrentLi();
      cloneUl();
      showResult();
    }
  };
});

/* End onclick event */
