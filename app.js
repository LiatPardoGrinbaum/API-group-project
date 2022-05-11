const page = document.querySelector(".page");
const search = document.querySelector(".search-wrap");
const table = document.querySelector(".table");

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
  buttonEvents()
  searchFilter()
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
      const td = document.createElement("td")
      const input = document.createElement("input")
      input.placeholder = student[key];
      // input.setAttribute("size", `${student[key].toString().length}`);
      input.disabled = "disabled"
      input.classList.add("input-student")
      td.appendChild(input)
      tr.appendChild(td)
    })
    const editBtn = document.createElement("button")
    const deleteBtn = document.createElement("button")
    const cancelBtn = document.createElement("button")
    const confirmBtn = document.createElement("button")
    editBtn.innerText = "Edit";
    editBtn.classList.add("btn", "editBtn");
    deleteBtn.innerText = "Delete";
    deleteBtn.classList.add("btn", "deleteBtn");
    cancelBtn.innerText = "Cancel";
    cancelBtn.classList.add("btn", "cancelBtn", "hiddenBtn")
    confirmBtn.innerText = "Confirm";
    confirmBtn.classList.add("btn", "confirmBtn", "hiddenBtn")
    tr.append(editBtn, cancelBtn, deleteBtn, confirmBtn)
  })
}

function addDeleteEvent(deleteBtns) {
  deleteBtns.forEach(choosenDelete => {
    choosenDelete.addEventListener("click", function () {
      choosenDelete.parentElement.remove()
    })
  })
}

function addEditEvent(editBtns, cancelBtns, deleteBtns, confirmBtns) {
  editBtns.forEach(clickedBtn => {
    clickedBtn.addEventListener("click", function (e) {
      const row = clickedBtn.parentElement
      const rowChildren = [...row.children].slice(0, -4)
      clickedButtons = document.querySelectorAll("[data-clicked]");
      if(clickedButtons.length > 0) {
        clickedButtons.forEach(btn => {
          btn.removeAttribute("data-clicked");
          let index = +(btn.parentElement.getAttribute("data-row")) - 1;
          [...btn.parentElement.children].forEach(tdChild => {
            if(tdChild.tagName === "BUTTON") {
              deleteBtns[index].classList.remove("hiddenBtn");
              editBtns[index].classList.remove("hiddenBtn");
              cancelBtns[index].classList.add("hiddenBtn");
              confirmBtns[index].classList.add("hiddenBtn");
            } else {
              tdChild.firstElementChild.disabled = true;
              tdChild.firstElementChild.value = "";
            }
          })
        })
      }
      clickedBtn.setAttribute("data-clicked", "true");
      rowChildren.forEach((tdChild) => {
        const inputChild = tdChild.firstElementChild;
        inputChild.value = "";
        inputChild.disabled = false;
      })
      e.target.classList.add("hiddenBtn");
      let index = +(e.target.parentElement.getAttribute("data-row")) - 1;
      deleteBtns[index].classList.add("hiddenBtn");
      cancelBtns[index].classList.remove("hiddenBtn");
      confirmBtns[index].classList.remove("hiddenBtn");
    })
  })
}
function addCancelEvent(editBtns, cancelBtns, deleteBtns, confirmBtns) {
  cancelBtns.forEach(clickedBtn => {
    clickedBtn.addEventListener("click", function (e) {
      const row = clickedBtn.parentElement
      const rowChildren = [...row.children].slice(0, -4)
      rowChildren.forEach((tdChild) => {
        const inputChild = tdChild.firstElementChild;
        inputChild.value = "";
        inputChild.disabled = true;
      })
      e.target.classList.add("hiddenBtn");
      let index = +(e.target.parentElement.getAttribute("data-row")) - 1;
      editBtns[index].classList.remove("hiddenBtn");
      deleteBtns[index].classList.remove("hiddenBtn");
      confirmBtns[index].classList.add("hiddenBtn");
    })
  })
}

function addConfirmEvent(editBtns, cancelBtns, deleteBtns, confirmBtns) {
  confirmBtns.forEach(clickedBtn => {
    clickedBtn.addEventListener("click", (e) => {
      const row = clickedBtn.parentElement
      const rowChildren = [...row.children].slice(0, -4)
      rowChildren.forEach((tdChild) => {
        const inputChild = tdChild.firstElementChild;
        if(inputChild.value !== "") {
          inputChild.placeholder = inputChild.value;
          // inputChild.setAttribute("size", `${inputChild.value.length}`);
          inputChild.value = "";
        }
        inputChild.disabled = true;
      })
      e.target.classList.add("hiddenBtn");
      let index = +(e.target.parentElement.getAttribute("data-row")) - 1;
      editBtns[index].classList.remove("hiddenBtn");
      deleteBtns[index].classList.remove("hiddenBtn");
      cancelBtns[index].classList.add("hiddenBtn");
    })
  })
}
function buttonEvents() {
  const editBtns = [...document.querySelectorAll(".editBtn")]
  const cancelBtns = [...document.querySelectorAll(".cancelBtn")]
  const deleteBtns = [...document.querySelectorAll(".deleteBtn")]
  const confirmBtns = [...document.querySelectorAll(".confirmBtn")]
  addDeleteEvent(deleteBtns);
  addEditEvent(editBtns, cancelBtns, deleteBtns, confirmBtns);
  addCancelEvent(editBtns, cancelBtns, deleteBtns, confirmBtns);
  addConfirmEvent(editBtns, cancelBtns, deleteBtns, confirmBtns);
}

function searchFilter() {
  const searchInput = document.querySelector("#searchInput");
  searchInput.addEventListener("keyup", function(event){ 
    const rows = [...table.children].slice(1)
    rows.forEach(row =>{
      const tdInclude=[...row.children].slice(0,-4).every((td)=>{
        return !td.firstElementChild.placeholder.includes(event.target.value)})

      if (tdInclude) {
        row.style.display="none";
      } else {
        row.style.display = "";
      }
  })
    })
  }

window.onload = () => getStudentInfo(createTableOfStudentsInfo)
