const page = document.querySelector(".page");
const search = document.querySelector(".search-wrap");
const table = document.querySelector(".table");

//getting data from api: save it into an array with student object
// getStudents:
// get the array of students (object)
// loop over the array and push data to new array

//function drawTable:
//https://capsules-asb6.herokuapp.com/api/user/$%7Bstudent.id
async function getStudents() {
  const response = await fetch("https://capsules-asb6.herokuapp.com/api/teacher/mordi");
  const students = await response.json();
  return students;
}

async function getStudentUrl() {
  const students = await getStudents();
  return students.map((student) => `https://capsules-asb6.herokuapp.com/api/user/${student.id}`);
}

async function getStudentInfo(callback) {
  const studentUrl = await getStudentUrl();
  const requests = studentUrl.map((url) => fetch(url));
  const studentsInfo = await Promise.all(requests).then((responses) => Promise.all(responses.map((r) => r.json())));
  callback(studentsInfo);
  editAndDelet();
  searchFilter();
}

const arr = ["id", "gender", "firstName", "lastName", "hobby", "age", "city", "capsule"];
const titlesArr = ["ID", "Gender", "First Name", "Last Name", "Hobby", "Age", "City", "Capsule"];
function createTableOfStudentsInfo(studentInfo) {
  //create first row
  const trFirst = document.createElement("tr");
  titlesArr.forEach((title) => {
    const th = document.createElement("th");
    th.textContent = title;
    trFirst.appendChild(th);
  });
  table.appendChild(trFirst);
  //create main table
  studentInfo.forEach((student, i) => {
    const tr = document.createElement("tr");
    tr.setAttribute("data-row", `${i + 1}`);
    table.appendChild(tr);
    arr.forEach((key) => {
      const td = document.createElement("td");
      const input = document.createElement("input");
      input.placeholder = student[key];
      input.disabled = "disabled";
      input.classList.add("input-student");
      // td.textContent=student[key];
      td.appendChild(input);
      tr.appendChild(td);
    });
    const editBtn = document.createElement("button");
    const deleteBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    deleteBtn.innerText = "Delete";
    editBtn.classList.add("editBtn");
    editBtn.classList.add("btn");
    deleteBtn.classList.add("deleteBtn");
    deleteBtn.classList.add("btn");
    tr.append(editBtn, deleteBtn);
  });
}
function editAndDelet() {
  const editBtn = [...document.querySelectorAll(".editBtn")];
  const deleteBtn = document.querySelectorAll(".deleteBtn");
  deleteBtn.forEach((choosenDelete) => {
    choosenDelete.addEventListener("click", function () {
      choosenDelete.parentElement.remove();
    });
  });
  editBtn.forEach((clickedBtn) => {
    clickedBtn.addEventListener("click", function () {
      // console.log(clickedBtn.parentElement);
      // const rowNumber = clickedBtn.parentElement.getAttribute("data-row");
      const row = clickedBtn.parentElement;
      const rowChildren = [...row.children].slice(0, -2);
      rowChildren.forEach((tdChild) => {
        const inputChild = tdChild.firstElementChild;
        inputChild.disabled = false;
      });
      return rowChildren;
      // inputChild.value = inputChild.placeholder\
    });
  });
}

function searchFilter() {
  const searchInput = document.querySelector("#searchInput");
  searchInput.addEventListener("keyup", function (event) {
    let e = event.target.value.toLowerCase();
    const rows = [...table.children].slice(1);
    rows.forEach((row) => {
      const tdInclude = [...row.children].slice(0, -2).every((td) => {
        let inputPlaceHolder = td.firstElementChild.placeholder.toLowerCase();
        return !inputPlaceHolder.includes(e);
      });

      if (tdInclude) {
        row.style.display = "none";
      } else {
        row.style.display = "";
      }
    });

    //  console.log(td.firstElementChild);
  });
}

// searchInput.addEventListener("keyup", function (event) {
//   //fillter to the letters or numbers that typed
//   if (!row.innerText.includes(event.target.value)) {
//     row.style.display = "none";
//   }

// })

// const searchInput = document.querySelector("#searchInput");
// const selectSearch = document.querySelector("#select");
window.onload = () => getStudentInfo(createTableOfStudentsInfo);
// searchInput.addEventListener("keyup", function (event) {
//   //fillter to the letters or numbers that typed
//   // if(!tr.innerText.includes(event.target.value)){
//   //   display:none
//   // }

// })

// table = {[{}]}.delete
//students = []
//student = {}.edit  place holders
