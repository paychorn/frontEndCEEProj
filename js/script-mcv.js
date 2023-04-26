const useSecure = false;
const backendAddress = `http${useSecure ? "s" : ""}://mcv.vt.in.th:3000`;

const makeUserData =
  function (student_id = undefined,
            firstname_en = undefined,
            lastname_en = undefined,
            courses = []) {
    return {
      "student_id": student_id,
      "firstname_en": firstname_en,
      "lastname_en": lastname_en,
      "courses": courses
    };
  };

const makeCourseData =
  function (course_no = undefined,
            title = undefined) {
    return {
      "course_no": course_no,
      "title": title,
      "assignments": []
    };
  };

const makeAssignmentData =
  function (title = undefined,
            duetime = undefined) {
    return {
      "title": title,
      "duetime": duetime
    };
  };

const authApp = function () {
  window.location.href = `${backendAddress}/api/auth`
};

const getUserTodo = async function () {
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

const main = function () {

};
