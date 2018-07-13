# e

Всем привет. Недавно мне попалась задача настроить приватный npm реестр и интегрировать его в билд процессы одного клиента. Все звучало очень пафосно и интересно, пока не оказалось, что делать там нам самом деле почти нечего. Клиент сидит под VSTS, а VSTS из-коробки умеет раздавать приватный реестр для NPM (и не только для него, но мы тут не за рекламой). И статья бы не появилось, если бы потом не возникла вторая задача - написать модельный npm пакет который можно было бы взять, клонировать и на его базе быстро создать что-то полезное. Если вам интересно, что в итоге получилось - прошу под кат.

</cut>

## Анализ требований

Что нам известно?

* Новые проекты пишутся на TypeScript
* Кроме новых проектов, есть еще куча всего на чистом JavaScript
* Тесты быть должны

Вроде бы все. Какие можно сделать выводы?

* Модуль должен быть на TypeScript
* Модуль должен быть используемым из-под TypeScript из-под JavaScript
* Модуль должен быть используемым как с помощью import так и с помощью require
* Документация должна быть
* Тесты должны быть

Это будут наши минимальные требования. Но мы же умные, раз это модельный пакет, значит мы можем сделать немножечко больше. После некоторых раздумий требования превратились в такие:

* Модуль должен быть на TypeScript и проверен с помощью TsLint
* Модуль должен быть используемым из-под TypeScript и из-под JavaScript
* Тесты должны быть настроены на git hook, минимальное покрытие кода должно быть тоже настроено
* Форматирование должно быть настроено
* Документация должна создаваться из кода
* Публикация должна быть удобной и единообразной
* Все что можно должно быть автоматизировано

Вот теперь все, можно делать.

## Предварительные телодвижения

Создаем (клонируем) репозиторий, инициализируем npm пакет, ставим локально TypeScript. Вообще все зависимости ставим локально, и не забываем фиксировать их версии.

```cmd
git init
npm init
npm i typescript -D
./node_modules/.bin/tsc --init
```

Тут же на месте исправляем tsconfig.json под себя - выставляем target, libs, include/exclude, outDir опции.

## Стиль форматирования

Для сохранения единообразия форматирования я выбрал два инструмента. Первый это файл .editorconfig. Он понимается всеми основными IDE (webstorm, vscode), не требует установки ничего лишнего и работает с большим количеством типов файлов - js, ts, md, и так далее. Очень удобно.

```yml
#root = true

[*]
indent_style = space
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
max_line_length = 100
indent_size = 4

[*.md]
trim_trailing_whitespace = false
```

Теперь автоформатирование будет вести себя более-менее одинаково у меня и у коллег.

Второй инструмент - [prettier](https://github.com/prettier/prettier). Это npm пакет, который проверяет, и по возможности, автоматически корректирует ваше форматирование текста. Установите его локально и добавьте первую команду в package.json

```cmd
npm i prettier -D
```

```json
"prettier": "./node_modules/.bin/prettier"
```

## Стиль кода

Со стилем кода все тоже не сложно. Для JavaScript есть [eslint](https://eslint.org/), для TypeScript есть [tslint](https://palantir.github.io/tslint/). Ставим tslint и создаем tsconfig.js для хранения настроек

```cmd
npm i tslint -D
./node_modules/.bin/tslint --init
```

```json
"lint": "./node_modules/.bin/tslint -c tslint.json 'src/**/*.ts' 'tests/**/*.spec.ts'",
```

Вы можете написать собственные правила, а можете использовать уже существующие правила с помощью параметра extend. [Вот](https://www.npmjs.com/package/tslint-config-airbnb), например, конфиг от airbnb. Кстати, советую оценить юмор разработчиков, которые позволяют сделать такое:

```js
module.exports = {
    extends: "./tslint-base.json",
    rules: {
        "no-excessive-commenting": [true, {maxComments: Math.random() * 10}]
    }
};
```

Ну разве это не красиво?

## Тесты

Что нам нужно от тестов прежде всего? Во-первых, чтобы они запускались автоматически, во-вторых контроль покрытия, в-третьих какой-то отчет, желательно в lcov формате. Автоматизацией мы займемся чуток позже, пока настроим сами тесты.

Ставим [karma](http://karma-runner.github.io/2.0/index.html), [jasmine](https://jasmine.github.io/) и весь соответствующий ей обвес

```cmd
npm i -D karma karma-jasmine jasmine karma-typescript karma-chrome-launcher @types/jasmine
./node_modules/.bin/karma init
```

Немного модифицируем karma.conf.js добавив новое свойство в объект конфигурации

```js
karmaTypescriptConfig : {
    include: ["./src/**/*.ts", "./tests/**/*.spec.ts"],
    tsconfig: "./tsconfig.json",

    reports: {
        "html": "coverage",
        "lcovonly": {
            directory: './coverage',
            filename: '../lcov.dat'
        }
    },
    coverageOptions: {
        threshold: {
            global: {
                statements: 60,
                branches: 60,
                functions: 60,
                lines: 60,
                excludes: []
            },
            file: {
                statements: 60,
                branches: 60,
                functions: 60,
                lines: 60,
                excludes: [],
                overrides: {}
            }
        }
    },
}
```

И, конечно, не забываем дописать новую команду в package.json

```json
"test": "./node_modules/.bin/karma start"
```

Кстати, если вы используете или планируете использовать CI то лучше поставить HeadlessChrome:

```cmd
    npm i puppeteer -D
```

И в karma.conf.js исправить Chrome на ChromeHeadless в browsers. Для travis-ci, придется еще поправить .travis.yml файл (как именно посмотреть можно в демо репозитории)

## Стиль коммитов

Коммиты тоже можно унифицировать (и заодно довести кого-то до белого каления, если переборщить). Я попробовал [commitizen](https://github.com/commitizen/cz-cli), вроде бы ничего. Из важного он поддерживает conventional-changelog форматирование, что позволит нам использовать коммиты как источник changelog. Кроме того он не очень навязчив так что меня не будут искать злые коллеги.

```cmd
npm i -D commitizen
```

```json
"commit":"./node_modules/.bin/git-cz"
```

Диалог с commitizen выглядит так:

А еще для vscode есть [плагин](https://github.com/KnisterPeter/vscode-commitizen)

## Документация

Тепер к документации. Документации у нас будет две. Первая это документация из-кода, вторая - документация из коммитов. Для документации из кода я взял [typedoc](https://www.npmjs.com/package/typedoc) (аналог [esdoc](https://esdoc.org/) но для TypeScript). Он очень просто ставится и работает. Главное не забудьте убрать результаты его трудов из-под контроля версий.

```cmd
npm i typedoc -D
```

и обновляем package.json

```json
"doc": "./node_modules/.bin/typedoc --out docs/ src/ --readme ./README.md"
```

Флаг --readme заставит включить readme в главную страницу документации, что как по мне достаточно удобно.
Запускаем, проверяем:

Второй тип документации это changelog, и с ним нам поможет [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog) пакет.

```cmd
npm i -D conventional-changelog
```

```json
"changelog": "./node_modules/.bin/conventional-changelog -p angular -i CHANGELOG.md -s",
```

Все, теперь о changelog файле будет заботится кто-то другой.

## Билд

Поскольку наш пакет должен работать и для JavaScript, нам нужно превратить Ts в Js. Кроме того, неплохо было бы сделать еще и минифицированный бандл, просто на всякий случай. Для этого нам понадобится [uglifyjs](https://www.npmjs.com/package/uglify-js) и немного подправить package.json

```cmd
npm i -D uglifyjs
```

```json
"clean":"rmdir dist /S /Q",
"build": "./node_modules/.bin/tsc --p ./ --sourceMap false",
"bundle": "./node_modules/.bin/uglifyjs ./dist/*.js --compress --mangle --output ./dist/index.min.js"
```

## Автоматизация

Понятно, что никакой пользы с того что мы настроили не будет, если это все не автоматизировать. Да и вообще гораздо приятнее пойти пить кофе, пока все само проверяется. Для этого нам понадобится еще один пакет - [husky](https://www.npmjs.com/package/husky) (кстати это где-то 13ый пакет если вам интересно). Он перехватывает git hooks и вызывает сопоставленные команды из package.json. Например, когда вы делаете коммит, сработает precommit команда - например test и если она вернет ошибку, коммит не осуществиться. Это может уберечь вас от коммитов и пушей не валидного кода избавив от необходимости запускать все самому. Выглядит это примерно так:

```cmd
npm i -D husky
```

```json
"precommit":"npm run prettier" ,
"prepush": "call npm run lint && call npm run test"
```

Вот тут есть важный нюанс, использование call && синтаксиса не кроссплатформенно и на unix системах не взлетит. Так что если хотите все сделать по-честному придется поставить еще и [npm-run-all](https://www.npmjs.com/package/npm-run-all) пакет, ну а я буду говорить всем что только масдай и поддерживается - шутка конечно.

## Публикация

Ну вот мы и дошли до публикации нашего (пусть и пустого) пакета. Как обычно давайте обдумаем что мы хотим от публикации?

* Еще раз протестировать
* Собрать билд артефакты
* Собрать документацию
* Поднять версию
* Запушить теги
* Отправить в npm

Руками это все делать - грустно. Или забудешь что-то, или чеклист писать нужно. Лучше тоже автоматизировать. Для этого даже ничего ставить не нужно (хотя и можно, например [unleash](https://www.npmjs.com/package/unleash)) - воспользуемся нативными хуками самого npm - preversion, version, postversion.

```json
"preversion": "npm run test",
"version": "call npm run clean && call npm run build && npm run bundle && call npm run doc && call npm run changelog && git add . && git commit -m 'changelogupdate' --no-verify",
"postversion": "git add . && git push && git push --tags",
```

Осталось указать для package.json что включать в пакет, точку входа и путь к нашим типам (не забудьте указать --declaration флаг что бы получить файлы с типами)

```json
"main": "./dist/index.min.js",
"types": "./dist/index.d.ts",
"files": [
        "dist/",
        "src/",
        "tests/"
    ]
```

Ну вот вроде бы и все. Теперь достаточно выполнить

```cmd
npm version ...
npm publish
```

И все остальное будет сделано в автоматическом режиме.

## Бонус

В качестве бонуса есть демо репозиторий, который все это поддерживает + CI с помощью travis-ci.

## Благодарности

Большая благодарность [Алексею Волкову](https://github.com/rosko) за его доклад на JsFest, который и стал основой этой статьи