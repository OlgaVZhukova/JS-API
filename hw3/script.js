// Элементы DOM
const randomImageElement = document.getElementById("randomImage");
const photographerInfoElement = document.getElementById("photographerInfo");
const likeButton = document.getElementById("likeButton");
const likeCountElement = document.getElementById("likeCount");
const previousImageButton = document.getElementById("previousImageButton");

// Переменные состояния
let likeCount = 0;
let imageHistory = [];

// Функция для получения случайного изображения
async function getRandomImage() {
    try {
        const response = await fetch(`${randomImageUrl}?client_id=${accessKey}`);
        const data = await response.json();
        const { urls, user } = data;

        randomImageElement.src = urls.regular;
        photographerInfoElement.textContent = `Photographer: ${user.name}`;
        saveImageToHistory(data);
    } catch (error) {
        console.error("Error fetching random image:", error);
    }
}

// Функция для обновления счетчика лайков
function updateLikeCount(count) {
    likeCountElement.textContent = count;
    localStorage.setItem("likeCount", count);
}

// Обработчик нажатия на кнопку "лайк"
function handleLike() {
    const previousImageId = imageHistory[imageHistory.length - 1].id;
    let likedImageIds = JSON.parse(localStorage.getItem("likedImageIds")) || [];

    if (!likeButton.classList.contains("liked")) {
        likeButton.textContent = "Liked";
        likeButton.classList.add("liked");
        likedImageIds.push(previousImageId);
        likeCount++;
    } else {
        likeButton.textContent = "Like";
        likeButton.classList.remove("liked");
        likedImageIds = likedImageIds.filter((id) => id !== previousImageId);
        likeCount--;
    }

    updateLikeCount(likeCount); // Обновляем счетчик лайков на странице
    localStorage.setItem("likedImageIds", JSON.stringify(likedImageIds));
}

likeButton.addEventListener("click", handleLike);

// Функция для отображения предыдущего изображения
function showPreviousImage() {
    if (imageHistory.length > 1) {
        imageHistory.pop(); // Удаление текущего изображения из истории
        const previousImage = imageHistory[imageHistory.length - 1]; // Получение предыдущего изображения из истории
        randomImageElement.src = previousImage.urls.regular;
        photographerInfoElement.textContent = `Photographer: ${previousImage.user.name}`;

        const previousImageId = previousImage.id;
        const likedImageIds =
            JSON.parse(localStorage.getItem("likedImageIds")) || [];

        likeCount = likedImageIds.length; // Обновление счетчика лайков на основе количества сохраненных лайков
        updateLikeCount(likeCount); // Обновление счетчика на странице
        if (likedImageIds.includes(previousImageId)) {
            likeButton.textContent = "Liked";
            likeButton.classList.add("liked");
        } else {
            likeButton.textContent = "Like";
            likeButton.classList.remove("liked");
        }
    }
}

previousImageButton.addEventListener("click", showPreviousImage);

// Функция для сохранения изображения в истории просмотров
function saveImageToHistory(image) {
    imageHistory.push(image);
    localStorage.setItem("imageHistory", JSON.stringify(imageHistory));
}

// Функция для загрузки истории просмотров из Local Storage
async function loadImageHistory() {
    const savedImageHistory = localStorage.getItem("imageHistory");
    if (savedImageHistory) {
        imageHistory = JSON.parse(savedImageHistory);
        displayCurrentImage();
    }
}

// Функция для отображения текущего изображения
function displayCurrentImage() {
    const currentImage = imageHistory[imageHistory.length - 1];
    randomImageElement.src = currentImage.urls.regular;
    photographerInfoElement.textContent = `Photographer: ${currentImage.user.name}`;
}

// Загрузка истории просмотров при загрузке страницы
window.addEventListener("DOMContentLoaded", async() => {
    await loadImageHistory();
    let likedImageIds = JSON.parse(localStorage.getItem("likedImageIds")) || [];
    likeCount = likedImageIds.length; // Установка начального значения счетчика лайков на основе количества сохраненных лайков
    updateLikeCount(likeCount); // Обновление счетчика на странице
    await getRandomImage();
});