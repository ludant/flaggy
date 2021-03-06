import * as flaggy from "./flaggy.mjs";

const socialPosts = [];
const postOrder = [];

function $(id) {
  return document.getElementById(id);
}

function stringHash(str) {
  // if you think this is a hash you are mistaken
  let num = 0;
  for (let i = 0; i < 6; i += 1) {
    num += str.charCodeAt(i) * 256 ** i;
  }
  return num;
}

function clearPosts() {
  $("postDisplay").remove();
  const postDisplayDiv = document.createElement("div");
  postDisplayDiv.id = "postDisplay";
  postDisplayDiv.classList.add("post-display");
  $("socialDiv").appendChild(postDisplayDiv);
}

function shufflePosts() {
  const integers = [];
  for (let i = 0; i < socialPosts.length; i += 1) {
    integers.push(i);
  }
  while (integers.length > 0) {
    const position = Math.floor(Math.random() * integers.length);
    postOrder.push(integers.splice(position, 1));
  }
}

function generatePost() {
  if (postOrder.length <= 0) {
    shufflePosts();
  }
  const postData = socialPosts[postOrder.pop()];
  const salt = Math.floor(Math.random() * 9999989);
  const containerDiv = $("postDisplay");
  for (let i = 0; i < postData.length; i += 1) {
    const postContainer = document.createElement("div");
    const textContainer = document.createElement("div");
    const avatarContainer = document.createElement("div");
    const postHead = document.createElement("div");
    const postText = document.createElement("p");
    const username = document.createElement("span");
    const time = document.createElement("time");
    const spacer = document.createElement("span");
    postContainer.classList.add("post");
    username.classList.add("username");
    textContainer.classList.add("post-text");
    const flag = flaggy.createAvatar(stringHash(postData[i].user) + salt);
    avatarContainer.classList.add("avatar");
    const timeObj = new Date(postData[i].timestamp);
    const timeString = timeObj.toLocaleString();
    spacer.textContent = "   ";
    postText.textContent = postData[i].content;
    username.textContent = postData[i].user;
    time.textContent = timeString;
    avatarContainer.appendChild(flag);
    postContainer.appendChild(avatarContainer);
    postHead.appendChild(username);
    postHead.appendChild(spacer);
    postHead.appendChild(time);
    textContainer.appendChild(postHead);
    if ("imageSrc" in postData[i]) {
      const image = document.createElement("img");
      image.src = postData[i].imageSrc;
      image.classList.add("image-post");
      postText.appendChild(image);
    }
    textContainer.appendChild(postText);
    postContainer.appendChild(textContainer);
    containerDiv.appendChild(postContainer);
  }
}

function clearFlags() {
  $("flagGrid").remove();
  const flagGrid = document.createElement("div");
  flagGrid.id = "flagGrid";
  flagGrid.classList.add("flag-grid");
  $("justFlagsDiv").appendChild(flagGrid);
}

function generateFlagGrid() {
  const seed = Math.floor(Math.random() * 9999989);
  const flagGrid = $("flagGrid");
  for (let i = 0; i < 36; i += 1) {
    const container = document.createElement("div");
    container.classList.add("flag");
    const flag = flaggy.createAvatar(seed + i);
    flag.setAttribute("transform", "scale(1.12)");
    container.append(flag);
    flagGrid.append(container);
  }
}

function addListeners() {
  $("selectDisplayFlags").addEventListener("click", () => {
    $("justFlagsDiv").classList.remove("hidden");
    $("socialDiv").classList.add("hidden");
  });
  $("selectDisplaySocial").addEventListener("click", () => {
    $("justFlagsDiv").classList.add("hidden");
    $("socialDiv").classList.remove("hidden");
  });
  $("generateNewPost").addEventListener("click", () => {
    clearPosts();
    generatePost();
  });
  $("generateFlagGrid").addEventListener("click", () => {
    clearFlags();
    generateFlagGrid();
  });
}

//function testy() {
//  const seed = bigChungus(169);
//  const cols = selectColors(seed);
//  const test = setBg(seed, cols[0]);
//  const width = test.width.baseVal.value;
//  const height = test.height.baseVal.value;
//  const group = document.createElementNS(svgNameSpace, "g");
//  const rhom = drawRect(width * 0.4, 0.943 * width * 0.4, cols[1]);
//  rhom.setAttribute(
//    "transform",
//    `
//      skewX(19.5)`
//  );
//  group.setAttribute(
//    "transform",
//    `
//    translate(${width / 2}, ${height / 2})
//    rotate(-35.25)`
//  );
//  group.appendChild(rhom);
//  test.appendChild(group);
//  $("test").appendChild(test);
//}
//
function loadPosts() {
  fetch("assets/posts.json")
    .then((response) => response.json())
    .then((json) => {
      json.forEach((post) => socialPosts.push(post));
      generatePost();
    });
}

function main() {
  addListeners();
  loadPosts();
  generateFlagGrid();
}

main();
