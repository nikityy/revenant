[![Build Status](https://travis-ci.org/nikityy/revenant.svg?branch=master)](https://travis-ci.org/nikityy/revenant)

# Revenant
Позволяет следить за новыми раздачами на Рутрекере.

## Использование
Сделай `git clone` этого репозитория. Создай файл `config.json` в директории, куда ты склонировал `revenant`, c примерно таким содержанием:
```js
{
    "username": [логин на Рутрекере],
    "password": [пароль на Рутрекере],
    "data_file": "./count",
    "watch_list": [
        "фильм А",
        "альбом Б",
        "книга В"
    ]
}
```

Запусти `npm run start`.

