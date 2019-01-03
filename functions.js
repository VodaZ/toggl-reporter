function authenticateUser(user, password) {
  let token = user + ":" + password;
  let hash = btoa(token);

  return "Basic " + hash;
}

function getUrl(endpoint, useParams) {
  let url = config.url.base + config.url[endpoint];

  let params = Object.keys(config.urlData)
    .filter(key => config.urlData[key])
    .map(key => key + '=' + config.urlData[key])
    .join('&');

  return url + '?' + params;
}

function httpGetAsync(user, password, endpoint, callback) {
  let request = new XMLHttpRequest();

  let url = getUrl(endpoint, false);

  request.onreadystatechange = function () {
    if (request.readyState == 4 && request.status == 200)
      callback(request.status, request.responseText);
  };

  request.open("GET", url, true);
  request.setRequestHeader("Authorization", authenticateUser(user, password));
  request.send();
}

function updateSelectList() {
  let projectForm = document.getElementsByClassName('projects')[0];

  let rows = Array.prototype.slice.call(projectForm.getElementsByTagName('input'));
  let selected = rows
    .filter(row => row.checked)
    .map(row => row.id);

  config.urlData.project_ids = selected.join(',');

  httpGetAsync(config.apiToken, 'api_token', 'detail', detailCallback);
}

function createProjectTableElement(projects) {
  let table = document.createElement('table');

  let thead = document.createElement('thead');
  thead.innerHTML = '<tr><td>Select</td><td>Project</td><td>Client</td></tr>';
  table.appendChild(thead);

  projects.forEach(project => {
    let row = document.createElement('tr');

    let chb = document.createElement('input');
    chb.type = 'checkbox';
    chb.name = 'project';
    chb.value = project.id;
    chb.id = project.id;
    chb.onchange = updateSelectList;
    let chbTd = document.createElement('td');

    chbTd.appendChild(chb);
    let li = document.createElement('li');

    let projectTd = document.createElement('td');
    projectTd.innerHTML = project.project;

    let clientTd = document.createElement('td');
    clientTd.innerHTML = project.client;

    row.appendChild(chbTd);
    row.appendChild(projectTd);
    row.appendChild(clientTd);

    table.appendChild(row);
  });

  return table;
}

function createTasksTable(tasks){
  let table = document.createElement('table');

  let thead = document.createElement('thead');
  thead.innerHTML = '<tr><td>Task</td><td>Project</td><td>Duration (hh:mm)</td></tr>';
  table.appendChild(thead);

  tasks.forEach(task => {
    let tr = document.createElement('tr');

    let taskTd = document.createElement('td');
    taskTd.innerHTML = task.description;

    let projectTd = document.createElement('td');
    projectTd.innerHTML = task.project;

    let durTd = document.createElement('td');
    durTd.innerHTML = task.seconds;

    tr.appendChild(taskTd);
    tr.appendChild(projectTd);
    tr.appendChild(durTd);

    table.appendChild(tr);
  });

  return table;
}

function formatTime(time){
  let hours = Math.floor(time / 60);
  let minutes = time % 60;

  let h = hours < 10 ? '0' + hours.toFixed(0) : hours.toFixed(0);
  let m = minutes < 10 ? '0' + minutes.toFixed(0) : minutes.toFixed(0);

  return h + ':' + m;
}

function projectsCallback(code, data) {
  console.log('Response code ' + code);
  let received = JSON.parse(data);

  if (code !== 200) {
    console.warn('Something went wrong');
  }

  let projects = received.data.map(project => {
    return {
      id: project.id,
      project: project.title.project,
      client: project.title.client || 'none',
      col: project.title.hex_color
    }
  });

  let projectsTableElement = createProjectTableElement(projects);

  let projectForm = document.getElementsByClassName('projects')[0];

  projectForm.appendChild(projectsTableElement);
}

function detailCallback(code, data) {
  console.log('Response code ' + code);
  let received = JSON.parse(data);

  if (code !== 200) {
    console.warn('Something went wrong');
  }

  let info = JSON.parse(data);

  console.log(info);

  let tasks = info.data.map(task => {
    return {
      seconds: formatTime(Math.ceil((new Date(task.end) - new Date(task.start)) / 60000)),
      description: task.description,
      project: task.project
    };
  });

  let tasksTable = createTasksTable(tasks);
  console.log(tasksTable);

  let tasksElement = document.getElementsByClassName('tasks')[0];

  while (tasksElement.hasChildNodes()) {
    tasksElement.removeChild(tasksElement.lastChild);
  }

  tasksElement.appendChild(tasksTable);
}
