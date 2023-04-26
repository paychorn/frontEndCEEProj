let userData = makeUserData();
let assignmentList = [];
let isLogin = true;
const useTest = true;
const useSecure = false;
const backendAddress = `http${useSecure ? "s" : ""}://mcv.vt.in.th:3000`;

const samplePayload = {
  "student_id": "6532155521",
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
          "state": 0 // haven't checked
        },
        {
          "title": "Pitchaya: Assignment 1 - Opamp - For Section 2  (Room 4-418)",
          "duetime": 1680195540,
          "state": 0 // haven't checked
        },
        {
          "title": "Pitchaya: Assignment 1 - Opamp - For Section 2  (Room 4-418)",
          "duetime": 1680195540,
          "state": 1 // have checked
        }
      ]
    },
    {
      "course_no": "2110356",
      "title": "Embbeded System [Section 1-2 and 33]",
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
        for (const assignment of course.assignments) {
          assignmentList.push({
            course_no: course.course_no,
            assignment: assignment
          });
        }
      }
    })
    .then(renderUserInfo)
    .then(renderAssignments);
}

function renderUserInfo() {
  const userContainer = document.getElementById("user-container");

  userContainer.innerHTML = "";

  if (isLogin) {
    const infoElement = document.createElement("div");
    infoElement.classList.add("user-info");

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

function renderAssignments() {
  const contentElement = document.getElementById("main-content");
  contentElement.innerHTML = "";
  const sectionAssigned = makeCollapsibleElement("Assigned");
  const sectionMissing = makeCollapsibleElement("Missing");
  const sectionDone = makeCollapsibleElement("Done");

  const t_now = Date.now() / 1000;
  for (const {course_no, assignment} of assignmentList) {
    const t_due = assignment.duetime;
    const dt = t_due - t_now;
    const a_title = `[${course_no}] ${assignment.title}`
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

function makeCollapsibleElement(name) {
  const btnElement = document.createElement("button");
  btnElement.setAttribute("class", "collapsible center active icon-container");

  const imgArrow = document.createElement("img");
  imgArrow.setAttribute("src", "/assets/icon-arrow.svg");
  imgArrow.setAttribute("alt", "Expand/Collapse");
  imgArrow.setAttribute("class", "tri");

  btnElement.append(imgArrow, document.createTextNode(name));
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

function makeDueText(dt) {
  if (dt > 0) {
    return `Due in ${secondsToHoursMinutes(dt)}`
  } else {
    return `Past due (for ${secondsToHoursMinutes(-dt)})`
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
