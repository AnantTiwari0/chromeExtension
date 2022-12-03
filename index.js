console.log("should see only this form extension");
let mainBtn = document.getElementById("autoEngage");
mainBtn.addEventListener("click", function () {
  if (!mainBtn.disabled) {
    main();
  }
});
let parameters = "";

let inputGrp = document.querySelectorAll("input");
inputGrp.forEach((item) =>
  item.addEventListener("input", () => checkValid(inputGrp[0], inputGrp[1]))
);

function checkValid(input1, input2) {
  if (parseInt(input1.value) && parseInt(input2.value)) {
    mainBtn.removeAttribute("disabled");
  }
  parameters = [input1.value, input2.value];
}

async function main() {
  // here the main engagement action begins
  // Opening the LinkedIn feed
  let tab = await chrome.tabs.create({ url: "https://www.linkedin.com/feed/" });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: engage,
    args: [parameters],
  });
}

async function engage(inputsArray) {
  const delay = ms => new Promise(res => setTimeout(res, ms));

  let likeBtns = document.getElementsByClassName(
    "artdeco-button artdeco-button--muted artdeco-button--4 artdeco-button--tertiary ember-view social-actions-button react-button__trigger"
  );

  let commentBtns = document.getElementsByClassName(
    "artdeco-button artdeco-button--muted artdeco-button--4 artdeco-button--tertiary ember-view social-actions-button comment-button flex-wrap "
  );

  // to scroll to bottom to load more like btns to meet input number
  let interval = setInterval(() => {
    if (
      likeBtns.length < parseInt(inputsArray[0]) ||
      commentBtns.length < parseInt(inputsArray[1])
    ) {
      window.scrollTo(0, document.body.scrollHeight);
    } else {
      clearInterval(interval);
      // Scroll completed
      like();
      comment();
    }
  }, 500);

  function like() {
    for (let i = 0; i < parseInt(inputsArray[0]); i++) {
      likeBtns = Object.values(likeBtns);
      let randomNum = Math.floor(Math.random() * likeBtns.length);
      let likeBtn = likeBtns.splice(randomNum, 1);
      likeBtn[0].click();
    }
  }
  async function comment() {
    let commentText = "CFBR";
    for (let i = 0; i < parseInt(inputsArray[1]); i++) {
      commentBtns = Object.values(commentBtns);
      let randomNum = Math.floor(Math.random() * commentBtns.length);
      let commentBtn = commentBtns.splice(randomNum, 1);
      commentBtn[0].click();
    }
    
    await delay(5000);// waiting for comment box to load
    let inputBox= document.getElementsByClassName('ql-editor ql-blank')
    for (let i = 0; i < inputBox.length; i++) {
      document.getElementsByClassName("ql-editor ql-blank")[i].children[0].innerText = commentText;
      await delay(2000);//waiting for post button to load 
      let postbtns=document.getElementsByClassName('comments-comment-box__submit-button mt3 artdeco-button artdeco-button--1 artdeco-button--primary ember-view')
      postbtns[0].click()
    }
  }
}

