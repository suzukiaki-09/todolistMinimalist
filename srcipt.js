document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('taskInput');
    const taskTime = document.getElementById('taskTime');
    const addTaskBtn = document.getElementById('addTask');
    const taskList = document.getElementById('taskList');
    const gifPopup = document.getElementById('gifPopup');
    const gifImage = document.getElementById('gifImage');
    const gifText = document.getElementById('gifText');
    const warningAudio = document.getElementById('warningAudio');
    const pagination = document.getElementById('pagination');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let taskStates = {};
    let currentPage = 1;
    const TASKS_PER_PAGE = 5;

    const gifs = {
        timeExpired: [{
            url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOGp0cnI3c3Z3aTZsbGt2cTN2ZjcxYTBmN2tkZXI0ZXh2dDV4NHZnaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/x0AEJ0XkvS6Fy/giphy.gif",
            text: "Oh no! Time's up!"
        }, {
            url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzE2cTZmYWRiOGoyZDhidWdkOWRqdXAzZWxxaW5ydDA1emZjdngwNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Jt4SSaz1oa0JG/giphy.gif",
            text: "Time expired! Hurry!"
        }],
        taskAdded: [{
            url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbjY1MXJibGhvOXh3bWpkazJlanhoZWY4ejA0MzY0NjZoNHlkbWFvYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/BzyTuYCmvSORqs1ABM/giphy.gif",
            text: "Task added successfully!"
        }, {
            url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHEwcHJ5bzMwbXZiaDh2dmJ0NXQ1Y3ZwZ2QxaDhvMjRsdHVkc3B6byZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ICOgUNjpvO0PC/giphy.gif",
            text: "Task added successfully!"
        }],
        tenMinutesLeft: [{
            url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExam5rbm84cWQxbDBmbDNwOXk1ZG10dXBiOG1kNGN0ZWl2aXN5bGJwciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LmBsnpDCuturMhtLfw/giphy.gif",
            text: "Only 10 minutes left!"
        }, {
            url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOXIzNjYwMnhpN3VtZjF1MWE1cXYxano0MnQ2Z3djbmgzYXR6d3V6cyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/KDRv3QggAjyo/giphy.gif",
            text: "Hurry up! 10 minutes remaining!"
        }],
        oneMinuteLeft: [{
            url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDUzN3F1ZXN4cm1tZXljdXUxaDY4M3E2NGRiMDk4dnY0M3lwY3RueSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/HUkOv6BNWc1HO/giphy.gif",
            text: "Just 1 minute left!"
        }, {
            url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZzZjY2NxNXF3dG1sMHZmNmJnb2ozNjRscGF0MXlhdTg5bDA4dmRsMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/9xrgpaFNXzqCyZ7AYP/giphy.gif",
            text: "Last minute warning!"
        }],
        twentySecondsLeft: [{
            url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDUzN3F1ZXN4cm1tZXljdXUxaDY4M3E2NGRiMDk4dnY0M3lwY3RueSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/HUkOv6BNWc1HO/giphy.gif",
            text: "Hurry! Only 20 seconds left!"
        }, {
            url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZzZjY2NxNXF3dG1sMHZmNmJnb2ozNjRscGF0MXlhdTg5bDA4dmRsMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/9xrgpaFNXzqCyZ7AYP/giphy.gif",
            text: "Quick! 20 seconds remaining!"
        }]
    };

    function playWarningSound() {
        warningAudio.currentTime = 0;
        warningAudio.play().catch(error => {});
    }

    function showGif(type, taskId = null) {
        if (taskId !== null) {
            if (!taskStates[taskId]) {
                taskStates[taskId] = {};
            }
            if (taskStates[taskId][type]) {
                return;
            }
            taskStates[taskId][type] = true;
        }
        const gifArray = gifs[type];
        const randomGif = gifArray[Math.floor(Math.random() * gifArray.length)];
        gifImage.src = randomGif.url;
        gifText.textContent = randomGif.text;
        gifPopup.style.display = 'block';
        if (type === 'twentySecondsLeft') {
            playWarningSound();
        }
        setTimeout(() => {
            gifPopup.style.display = 'none';
        }, 4000);
    }

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addTask();
    });

    function parseTimeInput(input) {
        if (typeof input !== 'string') input = String(input);
        input = input.trim();
        if (input.includes(':')) {
            const [h, m] = input.split(':').map(Number);
            if (!isNaN(h) && !isNaN(m)) {
                return h * 60 + m;
            }
        }
        const n = Number(input);
        if (!isNaN(n)) return n;
        return 0;
    }

    function addTask() {
        const title = taskInput.value.trim();
        const duration = parseTimeInput(taskTime.value);
        if (title && !isNaN(duration) && duration > 0) {
            const now = new Date();
            const dueDate = new Date(now.getTime() + duration * 60000);
            const task = {
                id: Date.now(),
                title,
                dueDate: dueDate.getTime(),
                completed: false
            };
            tasks.push(task);
            saveTasks();
            currentPage = Math.ceil(tasks.length / TASKS_PER_PAGE);
            renderTasks();
            showGif('taskAdded');
            taskInput.value = '';
            taskInput.focus();
            taskTime.value = 30;
        }
    }

    function renderTasks() {
        if (tasks.length === 0) {
            taskList.innerHTML = '<div class="empty-state">No tasks yet. Add one to get started! 🚀</div>';
            pagination.innerHTML = '';
            return;
        }
        tasks.sort((a, b) => a.dueDate - b.dueDate);
        const totalPages = Math.ceil(tasks.length / TASKS_PER_PAGE);
        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;
        const startIdx = (currentPage - 1) * TASKS_PER_PAGE;
        const endIdx = startIdx + TASKS_PER_PAGE;
        const pageTasks = tasks.slice(startIdx, endIdx);
        taskList.innerHTML = '';
        pageTasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = task.completed ? 'task completed' : 'task';
            taskElement.dataset.id = task.id;
            const now = new Date();
            const dueDate = new Date(task.dueDate);
            const timeLeft = dueDate - now;
            let timeLeftText = '';
            let isCritical = false;
            if (timeLeft <= 0) {
                timeLeftText = '⚠️ Time expired!';
                isCritical = true;
                if (!task.completed && !task.expiredGifShown) {
                    task.expiredGifShown = true;
                    showGif('timeExpired', task.id);
                    saveTasks();
                }
            } else {
                const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
                const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                const secondsLeft = Math.floor((timeLeft % (1000 * 60)) / 1000);
                const totalSecondsLeft = minutesLeft * 60 + secondsLeft;
                if (hoursLeft > 0) {
                    timeLeftText = `${hoursLeft}h ${minutesLeft}m ${secondsLeft}s left`;
                } else {
                    timeLeftText = `${minutesLeft}m ${secondsLeft}s left`;
                    if (minutesLeft === 10 && secondsLeft === 0 && !task.completed && !task.tenMinGifShown) {
                        task.tenMinGifShown = true;
                        showGif('tenMinutesLeft', task.id);
                        saveTasks();
                    }
                    if (minutesLeft === 1 && secondsLeft === 0 && !task.completed && !task.oneMinGifShown) {
                        task.oneMinGifShown = true;
                        showGif('oneMinuteLeft', task.id);
                        saveTasks();
                    }
                    if (totalSecondsLeft === 20 && !task.completed && !task.twentySecondsGifShown) {
                        task.twentySecondsGifShown = true;
                        showGif('twentySecondsLeft', task.id);
                        saveTasks();
                    }
                    if (minutesLeft < 30) {
                        isCritical = true;
                    }
                }
            }
            taskElement.innerHTML = `
                <div class="task-header">
                    <div class="task-title">${task.completed ? '✅ ' : ''}${task.title}</div>
                    <div class="task-time ${isCritical ? 'time-critical' : ''}">
                        <span>⏱ ${timeLeftText}</span>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="task-btn complete">${task.completed ? 'Undo' : 'Complete'}</button>
                    <button class="task-btn delete">Delete</button>
                </div>
            `;
            taskList.appendChild(taskElement);
            taskElement.querySelector('.complete').addEventListener('click', () => toggleComplete(task.id));
            taskElement.querySelector('.delete').addEventListener('click', () => deleteTask(task.id));
        });
        renderPagination(totalPages);
    }

    function renderPagination(totalPages) {
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }
        let html = '';
        html += `<button class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}">&lt;</button>`;
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
                html += `<button class="pagination-btn${i === currentPage ? ' active' : ''}" data-page="${i}">${i}</button>`;
            } else if (i === 2 && currentPage > 3) {
                html += `<span style="color:#d1d5db;">...</span>`;
            } else if (i === totalPages - 1 && currentPage < totalPages - 2) {
                html += `<span style="color:#d1d5db;">...</span>`;
            }
        }
        html += `<button class="pagination-btn" ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}">&gt;</button>`;
        pagination.innerHTML = html;
        Array.from(pagination.querySelectorAll('.pagination-btn')).forEach(btn => {
            btn.addEventListener('click', function() {
                const page = parseInt(this.getAttribute('data-page'));
                if (!isNaN(page) && page >= 1 && page <= totalPages) {
                    currentPage = page;
                    renderTasks();
                }
            });
        });
    }

    function toggleComplete(id) {
        const taskIndex = tasks.findIndex(task => task.id === id);
        if (taskIndex !== -1) {
            tasks[taskIndex].completed = !tasks[taskIndex].completed;
            saveTasks();
            renderTasks();
        }
    }

    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        if ((currentPage - 1) * TASKS_PER_PAGE >= tasks.length && currentPage > 1) {
            currentPage--;
        }
        renderTasks();
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    renderTasks();
    setInterval(renderTasks, 1000);
});