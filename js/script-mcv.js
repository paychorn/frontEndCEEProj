let userData = makeUserData();
let courseList = [];
let assignmentList = [];
let isLogin = true;
const useTest = true;
const useSecure = false;
const backendAddress = `http${useSecure ? "s" : ""}://mcv.vt.in.th:3000`;

const samplePayload = {
  "student_id": "6532155821",
  "firstname_en": "Name",
  "lastname_en": "Surname",
  "courses": [
    {
      "course_no": "2110356",
      "title": "Embbeded System [Section 1-2 and 33]",
      "assignments": [
        {
          "title": "Future Assignment",
          "duetime": 9690195540,
          "state": 0 // haven't done
        },
        {
          "title": "Pitchaya: Assignment 1 - Opamp - For Section 2  (Room 4-418)",
          "duetime": 1680195540,
          "state": 0 // haven't done
        },
        {
          "title": "Pitchaya: Assignment 1 - Opamp - For Section 2  (Room 4-418)",
          "duetime": 1680195540,
          "state": 1 // have done
        },
        {
          "title": "scala homework (sec1))))))",
          "duetime": 1682614740,
          "state": 0
        }
      ]
    },
    {
      "course_no": "2110356",
      "title": "Embbeded Systemmmm [Section 1-2 and 33]",
      "assignments": [
        {
          "title": "Pitchaya: Assignment 1 - Opamp - For Section 2  (Room 4-418)",
          "duetime": 1680195540,
          "state": 0
        },
        {
          "title": "Pitchaya: Assignment 1 - Opamp - For Section 2  (Room 4-418)",
          "duetime": 1680195540,
          "state": 1
        },
        {
          "title": "scala homework (sec1)",
          "duetime": 1682726360,
          "state": 1
        },
        {
          "title": "scala homework (sec1)",
          "duetime": 1682726360,
          "state": 1
        }
      ]
    },
    {
      "course_no": "2110356",
      "title": "Programming Language [Section 1-2 and 33]",
      "assignments": [
        {
          "title": "Pitchaya: Assignment 1 - Opamp - For Section 2  (Room 4-418)",
          "duetime": 1680195540,
          "state": 0
        },
        {
          "title": "Pitchaya: Assignment 1 - Opamp - For Section 2  (Room 4-418)",
          "duetime": 1682684453,
          "state": 1
        },
        {
          "title": "scala homework (sec1)",
          "duetime": 1682726360,
          "state": 1
        },
        {
          "title": "scala homework",
          "duetime": 1682812780,
          "state": 1
        }
      ]
    }
  ]
}


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
      for (const course of userData.courses) {
        courseList.push({
          course_no: course.course_no,
          course_title: course.title
        });
        for (const assignment of course.assignments) {
          assignmentList.push({
            course_no: course.course_no,
            course_title: course.title,
            assignment: assignment
          });
          
        }
      }
    })
    .then(renderUserInfo)
    .then(renderTodayAssignments);
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

    infoElement.append(nameElement, idElement);
    userContainer.append(infoElement, btnLogout);
  } else {
    const btnLogin = document.createElement("button");
    btnLogin.classList.add("button");
    btnLogin.id = "btn-login";
    btnLogin.innerText = "Log in"
    btnLogin.addEventListener("click", authApp);

    userContainer.appendChild(btnLogin);
  }
}

function renderCourse() {
  const courseElement = document.getElementById("courseList");
  courseElement.innerHTML = "";
  const courseTitle = document.createElement("div");
  for (const course of courseList) {
    courseTitle.append(makeSpanElement(course.title));
  }
  courseElement.append(courseTitle);
}

function renderTodayAssignments() {
  const contentElement = document.getElementById("main-content");
  contentElement.innerHTML = "";
  const t_now = Date.now() / 1000;
  const sectionCourse = document.createElement("div");
  assignmentforToday = false;

  for (const course of userData.courses) {
    const courseElement = makeCollapsibleElement(course.title, "h2");
    for (const assignment of course.assignments) {
      const t_due = assignment.duetime;
      const dt = t_due - t_now;
      const a_title = `${assignment.title}`
      const checked = assignment.state;
      
      if (dt > 0 && dt < 86400) {
        assignmentforToday = true;
        courseElement[1].append(makeAssignmentElement(a_title, dt));
        sectionCourse.append(courseElement[0], courseElement[1]);
      }
    }
  }
  if (assignmentforToday) { contentElement.append(sectionCourse); }
  else {
    contentElement.append(
      makeDivElement("There's no more assignment for today."), 
      makeDivElement("Great Job!")
    );
    contentElement.setAttribute("class", "margin-space secondary-text");
  }
}

function renderUpcomingAssignments() {
  const contentElement = document.getElementById("main-content");
  contentElement.innerHTML = "";
  const t_now = Date.now() / 1000;
  const sectionCourse = document.createElement("div");

  for (const course of userData.courses) {
    const courseElement = makeCollapsibleElement(course.title, "h2");
    for (const assignment of course.assignments) {
      const t_due = assignment.duetime;
      const dt = t_due - t_now;
      const a_title = `${assignment.title}`
      const checked = assignment.state;
      
      if (dt > 0 && dt < 604800) {
        courseElement[1].append(makeAssignmentElement(a_title, dt));
        sectionCourse.append(courseElement[0]);
      }
    }
    sectionCourse.append(courseElement[1]);
  }
  contentElement.append(sectionCourse);
}

function renderAssignments() {
  const contentElement = document.getElementById("main-content");
  contentElement.innerHTML = "";
  const sectionAssigned = makeCollapsibleElement("Assigned", "h2");
  const sectionMissing = makeCollapsibleElement("Missing", "h2");
  const sectionDone = makeCollapsibleElement("Done", "h2");

  const t_now = Date.now() / 1000;
  for (const {assignment} of assignmentList) {
    const t_due = assignment.duetime;
    const dt = t_due - t_now;
    const a_title = `${assignment.title}`
    const checked = assignment.state;

    if (dt > 0) {
      sectionAssigned[1].append(makeAssignmentElement(a_title, dt));
    } else if (checked === 1) {
      sectionDone[1].append(makeAssignmentElement(a_title, dt));
    } else {
      sectionMissing[1].append(makeAssignmentElement(a_title, dt));
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

function makeAssignmentElement(assignName, deltaT, checked) {
  const assignmentElement = document.createElement("div");
  assignmentElement.setAttribute("class", "assignment");

  const imgElement = document.createElement("img");
  imgElement.setAttribute("src", "/assets/icon-uncheck.svg");
  imgElement.setAttribute("alt", "unchecked");

  const btnElement = document.createElement("button");
  btnElement.setAttribute("class", "assignment-state");
  btnElement.append(imgElement);

  assignmentElement.append(btnElement);
  assignmentElement.append(
    makeSpanElement(assignName),
    makeSpanElement("•"),
    makeSpanElement(makeDueText(deltaT))
  );

  return assignmentElement;
}

function makeSpanElement(text) {
  const element = document.createElement("span");
  element.setAttribute("class", "body");
  element.textContent = text;
  return element;
}

function makeDivElement(text) {
  const element = document.createElement("div");
  element.setAttribute("class", "body center");
  element.textContent = text;
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

function checkboxListener() {
//   todo: Add checkbox listener to send back
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
