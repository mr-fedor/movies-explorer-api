# Дипломный проект

API для дипломного проекта 26 потока в рамках обучения в Яндекс.Практикуме на курсе "Веб-разработчик".
Основные возможности и роуты:
- POST /signin - авторизация пользователя
- POST /signup - регистрация пользователя
- GET /users/me - возвращает информацию о пользователе (email и имя)
- PATCH /users/me - обновляет информацию о пользователе (email и имя)
- GET /movies - возвращает все сохранённые пользователем фильмы
- POST /movies - создаёт фильм с переданными в теле country, director, duration, year, description, image, trailer, nameRU, nameEN и thumbnail, movieId
- DELETE /movies/movieId - удаляет сохранённый фильм по id

URL API - [https://blinov-api.nomoredomains.work](htpps://blinov-api.nomoredomains.work)
