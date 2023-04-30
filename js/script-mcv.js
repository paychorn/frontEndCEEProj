const appName = "MCV Companion";
const useTest = true;
const useSecure = false;
const backendAddress = `http${useSecure ? "s" : ""}://mcv.vt.in.th:3000`;
const Page = {
  LOGIN: 0,
  MAIN: 1
};

let pageState = Page.LOGIN;
let userData = makeUserData();
let courseList = [];
let assignmentList = [];
let isLogin = true;

const samplePayload = {
  "student_id": "6430000021",
  "firstname_en": "Sudyod",
  "lastname_en": "Khengmak",
  "courses": [
    {
      "cv_cid": 23442,
      "course_no": "2110356",
      "title": "Embbeded System [Section 1-2 and 33]",
      "assignments": [
        {
          "item_id": 34245,
          "title": "Pitchaya: Assignment 1 - Opamp - For Section 2  (Room 4-418)",
          "duetime": 1680195540,
          "state": 0 // haven't checked
        },
        {
          "item_id": 34246,
          "title": "Pitchaya: Assignment 1 - Opamp - For Section 2  (Room 4-418)",
          "duetime": 1680195540,
          "state": 1 // have checked
        }
      ]
    },
    {
      "cv_cid": 23443,
      "course_no": "2110357",
      "title": "Embbeded System La [Section 1-2 and 33]",
      "assignments": [
        {
          "item_id": 34247,
          "title": "Pitchaya: Assignment 1 - Opamp - For Section 2  (Room 4-418)",
          "duetime": 1680195540,
          "state": 0
        },
        {
          "item_id": 34248,
          "title": "Pitchaya: Assignment 1 - Opamp - For Section 2  (Room 4-418)",
          "duetime": 1690195540,
          "state": 1
        }
      ]
    }
  ]
};


const authApp = function () {
  console.log(window.location.hostname);
  window.location.href = `${window.location.protocol}//${window.location.hostname}:3000/api/auth`
};

const getUserTodo = async function () {
  if (useTest) return samplePayload;

  const requestInit = {
    credentials: "include",
    method: "GET"
  };

  await fetch(`${backendAddress}/api/get/todo`, requestInit)
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => console.error(error));
};

const postUserTodo = async function () {

};

async function main() {
  await getUserTodo()
    .then((newInfo) => {
      userData = newInfo
      courseList = userData.courses
      for (const course of courseList) {
        for (const assignment of course.assignments) {
          assignmentList.push({
            course_no: course.course_no,
            course_title: course.title,
            assignment: assignment
          });

        }
      }
    })
    .then(() => {
      document.title = `${appName} App`
    })
    .then(renderMainPage);
  // .then(renderTodayAssignments);
}

function renderMainPage() {
  document.body.innerHTML = "";
  const allLinks = document.head.getElementsByTagName("link");
  for (const link of allLinks)
    if (link.rel === "stylesheet")
      document.head.removeChild(link);

  switch (pageState) {
    case Page.LOGIN: {
      const stylesheet = document.createElement("link");
      stylesheet.rel = "stylesheet";
      stylesheet.type = "text/css";
      stylesheet.href = "/css/style-landing.css";
      document.head.append(stylesheet);

      document.body.innerHTML = `
      <div id="content">
        <h1>Mee Duay Ror ?</h1>
        <p>Organize your chula life and become more focused with Mee Duay Ror, <br/>
        The Comp Eng Ess project group #12 task manager and to-do list app. </p>
        <button id="btn-start">Get Started</button>
      </div>
      <img src="/assets/landing.png" alt="background">
      `

      document.getElementById("btn-start").addEventListener("click", loginBtnListener);
      break;
    }
    case Page.MAIN:
    default: {
      let stylesheet = document.createElement("link");
      stylesheet.rel = "stylesheet";
      stylesheet.type = "text/css";
      stylesheet.href = "/css/style.css";
      document.head.append(stylesheet);

      stylesheet = document.createElement("link");
      stylesheet.rel = "stylesheet";
      stylesheet.type = "text/css";
      stylesheet.href = "/css/style-main.css";
      document.head.append(stylesheet);

      stylesheet = document.createElement("link");
      stylesheet.rel = "stylesheet";
      stylesheet.type = "text/css";
      stylesheet.href = "/css/style-nav.css";
      document.head.append(stylesheet);

      const navBar = document.createElement("div");
      navBar.id = "nav-bar";

      const navContainer = document.createElement("div");
      navContainer.id = "nav-container";

      const userContainer = document.createElement("div");
      userContainer.id = "user-container";

      navContainer.innerHTML = `
      <div class="nav-content fill-container" id="btn-nav-all">
        <div class="icon-container">
          <img src="/assets/icon-today.svg" alt="Today Icon">
          <span class="body" style="padding-top: 4px;">All</span>
        </div>
        <span id="count-all" class="body" style="padding-top: 4px;">4</span>
      </div>
      
      <div class="nav-content fill-container" id="btn-nav-today">
        <div class="icon-container">
          <img src="/assets/icon-today.svg" alt="Today Icon">
          <span class="body" style="padding-top: 4px;">Today</span>
        </div>
        <span id="count-today" class="body" style="padding-top: 4px;">4</span>
      </div>
      
      <div class="nav-content fill-container" id="btn-nav-upcoming">
        <div class="icon-container">
          <img src="/assets/icon-upcoming.svg" alt="Upcoming Icon">
          <span class="body" style="padding-top: 4px;">Upcoming</span>
        </div>
        <div id="count-upcoming" class="body secondary-text" style="padding-top: 4px;">4</div>
      </div>
      
      <br/>
      
      <div class="nav-content" id="course-list"></div>
      `

      navBar.append(navContainer, userContainer);

      const mainContainer = document.createElement("div");
      mainContainer.id = "main";
      mainContainer.innerHTML = `
      <h1 id="header">${appName} - All</h1>
      <div class="content" id="main-content"></div>
      `

      document.body.append(navBar, mainContainer);
      document.getElementById("btn-nav-all").addEventListener("click", navNavListener);
      document.getElementById("btn-nav-today").addEventListener("click", navNavListener);
      document.getElementById("btn-nav-upcoming").addEventListener("click", navNavListener);

      document.getElementById("count-all").innerText = `${assignmentList.length}`;
      // todo: Count today and upcoming

      renderUserInfo();
      renderCourses();
      renderAssignments();
      break;
    }
  }
}

function renderUserInfo() {
  const userContainer = document.getElementById("user-container");

  userContainer.innerHTML = "";

  if (isLogin) {
    const infoElement = document.createElement("div");
    infoElement.classList.add("column");
    infoElement.classList.add("margin-y");

    const nameElement = document.createElement("div");
    nameElement.classList.add("body");
    nameElement.textContent = `${userData.firstname_en} ${userData.lastname_en}`;

    const idElement = document.createElement("div");
    idElement.classList.add("body");
    idElement.textContent = `${userData.student_id}`;

    const btnLogout = document.createElement("button");
    btnLogout.classList.add("button");
    btnLogout.id = "btn-logout";
    btnLogout.innerText = "Log out"
    btnLogout.addEventListener("click", logoutBtnListener);

    infoElement.append(nameElement, idElement);
    userContainer.append(infoElement, btnLogout);
  } else {
    const btnLogin = document.createElement("button");
    btnLogin.classList.add("button");
    btnLogin.id = "btn-login";
    btnLogin.innerText = "Log in"
    btnLogin.addEventListener("click", loginBtnListener);

    userContainer.appendChild(btnLogin);
  }
}

function renderCourses() {
  const courseElement = document.getElementById("course-list");
  courseElement.innerHTML = "";
  const courseTitle = document.createElement("div");
  for (const course of courseList) {
    const newDiv = document.createElement("div");
    newDiv.setAttribute("class", "nav-content");
    newDiv.setAttribute("cv_cid", course.cv_cid.toString());
    newDiv.append(makeSpanElement(course.title))
    newDiv.addEventListener("click", navSubjectListener);
    courseTitle.append(newDiv);
  }
  courseElement.append(courseTitle);
}

function renderAssignmentsBySubject(cv_cid) {
  let curr_course = undefined;
  for (const course of userData.courses) {
    if (cv_cid === course.cv_cid.toString()) {
      curr_course = course;
      break;
    }
  }

  if (curr_course === undefined) return;

  document.getElementById("header").textContent = `${appName} - ${curr_course.title}`;

  const contentElement = document.getElementById("main-content");
  contentElement.innerHTML = "";
  contentElement.className = "";

  const sectionAssigned = makeCollapsibleElement("Assigned", "h2");
  const sectionMissing = makeCollapsibleElement("Missing", "h2");
  const sectionDone = makeCollapsibleElement("Done", "h2");

  const t_now = Date.now() / 1000;
  for (const assignment of curr_course.assignments) {
    const t_due = assignment.duetime;
    const dt = t_due - t_now;
    const checked = assignment.state;

    if (dt > 0) {
      sectionAssigned[1].append(makeAssignmentElement(assignment, dt));
    } else if (checked === 1) {
      sectionDone[1].append(makeAssignmentElement(assignment, dt));
    } else {
      sectionMissing[1].append(makeAssignmentElement(assignment, dt));
    }
  }

  contentElement.append(sectionAssigned[0], sectionAssigned[1]);
  contentElement.append(sectionMissing[0], sectionMissing[1]);
  contentElement.append(sectionDone[0], sectionDone[1]);
}

function renderTodayAssignments() {
  document.getElementById("header").textContent = `${appName} - Today`;

  const contentElement = document.getElementById("main-content");
  contentElement.innerHTML = "";
  contentElement.className = "";

  const t_now = Date.now() / 1000;
  const sectionCourse = document.createElement("div");
  let assignmentForToday = false;

  for (const course of userData.courses) {
    const courseElement = makeCollapsibleElement(course.title, "h2");
    for (const assignment of course.assignments) {
      const t_due = assignment.duetime;
      const dt = t_due - t_now;
      const checked = assignment.state;

      if (0 < dt && dt < 24 * 60 * 60) {
        assignmentForToday = true;
        courseElement[1].append(makeAssignmentElement(assignment, dt));
        sectionCourse.append(courseElement[0]);
      }
    }
    sectionCourse.append(courseElement[1]);
  }
  if (assignmentForToday) {
    contentElement.append(sectionCourse);
  } else {
    contentElement.append(
      makeCenterDivElement("There's no more assignment for today."),
      makeCenterDivElement("Great Job!")
    );
    contentElement.setAttribute("class", "margin-space secondary-text");
  }
}

function renderUpcomingAssignments() {
  document.getElementById("header").textContent = `${appName} - Upcoming`;

  const contentElement = document.getElementById("main-content");
  contentElement.innerHTML = "";
  contentElement.className = "";

  const t_now = Date.now() / 1000;
  const sectionCourse = document.createElement("div");

  for (const course of userData.courses) {
    const courseElement = makeCollapsibleElement(course.title, "h2");
    for (const assignment of course.assignments) {
      const t_due = assignment.duetime;
      const dt = t_due - t_now;
      const checked = assignment.state;

      if (0 < dt) {
        courseElement[1].append(makeAssignmentElement(assignment, dt));
        sectionCourse.append(courseElement[0]);
      }
    }
    sectionCourse.append(courseElement[1]);
  }
  contentElement.append(sectionCourse);
}

function renderAssignments() {
  document.getElementById("header").textContent = `${appName} - All`;

  const contentElement = document.getElementById("main-content");
  contentElement.innerHTML = "";
  contentElement.className = "";

  const sectionAssigned = makeCollapsibleElement("Assigned", "h2");
  const sectionMissing = makeCollapsibleElement("Missing", "h2");
  const sectionDone = makeCollapsibleElement("Done", "h2");

  const t_now = Date.now() / 1000;
  for (const {assignment: assignment} of assignmentList) {
    const t_due = assignment.duetime;
    const dt = t_due - t_now;
    const checked = assignment.state;

    if (dt > 0) {
      sectionAssigned[1].append(makeAssignmentElement(assignment, dt));
    } else if (checked === 1) {
      sectionDone[1].append(makeAssignmentElement(assignment, dt));
    } else {
      sectionMissing[1].append(makeAssignmentElement(assignment, dt));
    }
  }

  contentElement.append(sectionAssigned[0], sectionAssigned[1]);
  contentElement.append(sectionMissing[0], sectionMissing[1]);
  contentElement.append(sectionDone[0], sectionDone[1]);
}

function makeCollapsibleElement(name, font) {
  const btnElement = document.createElement("button");
  btnElement.setAttribute("class", "collapsible center active icon-container");

  const imgArrow = document.createElement("img");
  imgArrow.setAttribute("src", "/assets/icon-arrow.svg");
  imgArrow.setAttribute("alt", "Expand/Collapse");
  imgArrow.setAttribute("class", "cheveron");

  const content = document.createElement("span");
  content.textContent = name
  content.setAttribute("class", font)
  btnElement.append(imgArrow, content);
  btnElement.addEventListener("click", collapsibleListener);

  const assignmentsElement = document.createElement("div");
  assignmentsElement.setAttribute("class", "assignments");

  return [btnElement, assignmentsElement];
}

function makeAssignmentElement(assignment, dt, checked) {
  const assignmentElement = document.createElement("div");
  assignmentElement.setAttribute("class", "assignment");

  const imgElement = document.createElement("img");
  if (checked > 0) {
    // todo: Add checked icon
    imgElement.setAttribute("src", "/assets/icon-arrow.svg");
    imgElement.setAttribute("alt", "checked");
    imgElement.setAttribute("status", "true");
  } else {
    imgElement.setAttribute("src", "/assets/icon-uncheck.svg");
    imgElement.setAttribute("alt", "unchecked");
    imgElement.setAttribute("status", "false");
  }

  const btnElement = document.createElement("button");
  btnElement.setAttribute("class", "assignment-state");
  btnElement.id = `btn-cb-${assignment.item_id}`;
  btnElement.append(imgElement);
  btnElement.addEventListener("click", checkboxListener);

  assignmentElement.append(btnElement);

  const coloredDueText = makeSpanElement(makeDueText(dt));
  let dueColor = "due-upcoming";

  if (dt < 24 * 60 * 60) dueColor = "due-near";
  if (dt < 0) dueColor = "due-late"
  coloredDueText.setAttribute("class", dueColor)

  assignmentElement.append(
    makeSpanElement(assignment.title),
    makeSpanElement("•"),
    coloredDueText
  );

  return assignmentElement;
}

function collapsibleListener() {
  this.classList.toggle("active");
  const content = this.nextElementSibling;

  if (content === null) return;

  if (content.style.display === "none") {
    content.style.display = "block";
  } else {
    content.style.display = "none";
  }
}

function navSubjectListener() {
  const cv_cid = this.getAttribute("cv_cid");
  renderAssignmentsBySubject(cv_cid);
}

function navNavListener() {
  switch (this.getAttribute("id")) {
    case "btn-nav-today":
      renderTodayAssignments();
      break;
    case "btn-nav-upcoming":
      renderUpcomingAssignments();
      break;
    case "btn-nav-all":
    default:
      renderAssignments();
      break;
  }
}

function checkboxListener() {
  const item_id = this.id.slice(7);
  // todo use item id

  const imgElement = this.getElementsByTagName("img")[0];

  if (imgElement.getAttribute("status") === "false") {
    // todo: Add checked icon
    imgElement.setAttribute("src", "/assets/icon-arrow.svg");
    imgElement.setAttribute("alt", "checked");
    imgElement.setAttribute("status", "true");
  } else {
    imgElement.setAttribute("src", "/assets/icon-uncheck.svg");
    imgElement.setAttribute("alt", "unchecked");
    imgElement.setAttribute("status", "false");
  }
}

function loginBtnListener() {
  // todo: Login Authentication
  // For now: just go to the main page.
  pageState = Page.MAIN;
  renderMainPage();
}

function logoutBtnListener() {
  // todo: Logout Authentication
  // For now: just go to the login page.
  pageState = Page.LOGIN;
  renderMainPage();
}

function makeSpanElement(text) {
  const element = document.createElement("span");
  element.setAttribute("class", "body");
  element.textContent = text;
  return element;
}

function makeDivElement(text) {
  const element = document.createElement("div");
  element.setAttribute("class", "body");
  element.textContent = text;
  return element;
}

function makeCenterDivElement(text) {
  const element = makeDivElement(text);
  element.classList.add("center");
  return element;
}

function makeDueText(dt) {
  if (dt > 0) {
    return `Due in ${secondsToHoursMinutes(dt)}`
  } else {
    return `Past due for ${secondsToHoursMinutes(-dt)}`
  }
}

function makeUserData(student_id = undefined,
                      firstname_en = undefined,
                      lastname_en = undefined,
                      courses = []) {
  return {
    "student_id": student_id,
    "firstname_en": firstname_en,
    "lastname_en": lastname_en,
    "courses": courses
  };
}

function makeCourseData(course_no = undefined,
                        title = undefined) {
  return {
    "course_no": course_no,
    "title": title,
    "assignments": []
  };
}

function makeAssignmentData(title = undefined,
                            duetime = undefined,
                            state = 0) {
  return {
    "title": title,
    "duetime": duetime,
    "state": state
  };
}

function secondsToHoursMinutes(seconds) {
  const years = Math.floor(seconds / (365 * 24 * 60 * 60));
  const months = Math.floor(seconds / (30 * 24 * 60 * 60));
  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);

  let result = "";
  if (years > 0) {
    result += `${years} year${years > 1 ? "s" : ""} `;
  }
  if (months > 0) {
    result += `${months} month${months > 1 ? "s" : ""} `;
  }
  if (days > 0) {
    result += `${days} day${days > 1 ? "s" : ""} `;
  }
  if (hours > 0) {
    result += `${hours} hour${hours > 1 ? "s" : ""} `;
  }
  if (minutes > 0) {
    result += `${minutes} minute${minutes > 1 ? "s" : ""} `;
  }

  return result.trim();
}
