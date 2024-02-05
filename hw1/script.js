"use strict";

document.addEventListener("DOMContentLoaded", function() {
    let scheduleData = [{
            id: 1,
            name: "Йога",
            time: "10:00 - 11:00",
            maxParticipants: 15,
            currentParticipants: 8,
        },
        {
            id: 2,
            name: "Пилатес",
            time: "11:30 - 12:30",
            maxParticipants: 10,
            currentParticipants: 5,
        },
        {
            id: 3,
            name: "Кроссфит",
            time: "13:00 - 14:00",
            maxParticipants: 20,
            currentParticipants: 15,
        },
        {
            id: 4,
            name: "Танцы",
            time: "14:30 - 15:30",
            maxParticipants: 12,
            currentParticipants: 10,
        },
        {
            id: 5,
            name: "Бокс",
            time: "16:00 - 17:00",
            maxParticipants: 8,
            currentParticipants: 6,
        },
    ];

    const scheduleTable = document.getElementById("scheduleTable");

    // Очищаем таблицу перед отрисовкой
    function renderSchedule() {
        scheduleTable.innerHTML = "";

        // Добавляем заголовки столбцов
        const headerRow = document.createElement("tr");
        headerRow.innerHTML = `
            <th>Название занятия</th>
            <th>Время проведения</th>
            <th>Макс. кол-во участников</th>
            <th>Текущее кол-во участников</th>
        `;
        scheduleTable.appendChild(headerRow);

        scheduleData.forEach((course) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${course.name}</td>
                <td>${course.time}</td>
                <td>${course.maxParticipants}</td>
                <td>${course.currentParticipants}</td>
                <td class="actions">
                    <button data-id="${course.id}" class="register-btn">Записаться</button>
                    <button data-id="${course.id}" class="cancel-btn">Отменить запись</button>
                </td>
            `;
            scheduleTable.appendChild(row);
        });

        updateButtons(); // Обновляем состояние кнопок после отрисовки
    }

    function updateButtons() {
        const registerButtons = document.querySelectorAll(".register-btn");
        const cancelButtons = document.querySelectorAll(".cancel-btn");

        registerButtons.forEach((button) => {
            const courseId = parseInt(button.getAttribute("data-id"));
            const course = scheduleData.find((course) => course.id === courseId);
            const userIsRegistered = isUserRegistered(courseId);
            button.disabled =
                userIsRegistered ||
                course.currentParticipants >= course.maxParticipants;
        });

        cancelButtons.forEach((button) => {
            const courseId = parseInt(button.getAttribute("data-id"));
            button.disabled = !isUserRegistered(courseId);
        });
    }

    function isUserRegistered(courseId) {
        // Проверяем, записан ли пользователь на курс
        const userRegistrations =
            JSON.parse(localStorage.getItem("userRegistrations")) || [];
        return userRegistrations.includes(courseId);
    }

    function registerUser(courseId) {
        // Записываем пользователя на курс
        const userRegistrations =
            JSON.parse(localStorage.getItem("userRegistrations")) || [];
        userRegistrations.push(courseId);
        localStorage.setItem(
            "userRegistrations",
            JSON.stringify(userRegistrations)
        );
        updateParticipants(courseId, true);
    }

    function unregisterUser(courseId) {
        // Удаляем пользователя с курса
        const userRegistrations =
            JSON.parse(localStorage.getItem("userRegistrations")) || [];
        const index = userRegistrations.indexOf(courseId);
        if (index !== -1) {
            userRegistrations.splice(index, 1);
            localStorage.setItem(
                "userRegistrations",
                JSON.stringify(userRegistrations)
            );
            updateParticipants(courseId, false);
        }
    }

    function updateParticipants(courseId, increment) {
        // Обновляем количество участников
        const course = scheduleData.find((course) => course.id === courseId);
        if (increment && course.currentParticipants < course.maxParticipants) {
            course.currentParticipants++;
        } else if (!increment && course.currentParticipants > 0) {
            course.currentParticipants--;
        }
        localStorage.setItem("scheduleData", JSON.stringify(scheduleData));
        renderSchedule();
    }

    scheduleTable.addEventListener("click", function(event) {
        const target = event.target;
        if (target.classList.contains("register-btn")) {
            const courseId = parseInt(target.getAttribute("data-id"));
            registerUser(courseId);
        } else if (target.classList.contains("cancel-btn")) {
            const courseId = parseInt(target.getAttribute("data-id"));
            unregisterUser(courseId);
        }
    });

    // Проверяем наличие данных в LocalStorage
    const storedScheduleData = localStorage.getItem("scheduleData");
    if (storedScheduleData) {
        // Если данные есть, загружаем их
        scheduleData = JSON.parse(storedScheduleData);
    } else {
        // Если данных нет, сохраняем начальные данные в LocalStorage
        localStorage.setItem("scheduleData", JSON.stringify(scheduleData));
    }

    renderSchedule(); // Начальная отрисовка расписания
});