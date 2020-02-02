[![Build Status](https://travis-ci.org/nikityy/revenant.svg?branch=master)](https://travis-ci.org/nikityy/revenant)

# Revenant
Позволяет следить за раздачами на RuTracker для фильмов из списка на КиноПоиске.

## Установка
* Запусти `git clone https://github.com/nikityy/revenant.git`
* Перейди в директорию, куда Гит склонировал репозиторий
* Запусти `npm install -g .`
После этого команда `revenant` будет доступна глобально.

## Использование
```sh
# Авторизуемся в RuTracker со своим логином и паролем
revenant login -u <USERNAME> -p <PASSWORD>

# Устанавливаем ссылку на КиноПоиске, за которой нужно сделить (например, «Буду смотреть»)
revenant watch "https://www.kinopoisk.ru/user/789114/movies/list/type/3575/#list"

# Выводим новые торренты на экран
revenant check

# Выводим список всех фильмов, за которыми мы сейчас следим
revenant list

# Скачиваем новые торрент-файлы в папку
revenant download -d ~/Downloads/
```
