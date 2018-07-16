# e

Всем привет. Недавно мне попалась (ну как "попалась" - вымучил) задача настроить оборот приватных npm пакетов. Все звучало очень интересно и многообещающе пока не оказалось что делать там нам самом деле почти нечего. Мы используем VSTS, который из-коробки умеет раздавать приватный реестр для NPM (и не только для него, но мы тут не за рекламой). Тут бы все и закончилось, но возникла вторая задача написать демо репозиторий для npm пакета, который можно было бы взять, клонировать и на его базе быстро создать что-то полезное и в едином стиле. Если вам интересно, что в итоге получилось - прошу под кат.

</cut>

## Анализ требований

Cначала я прикинул что у нас уже есть:

* Новые проекты пишутся на TypeScript
* Кроме новых проектов, есть еще куча всего на чистом JavaScript
* Есть требования писать тесты и результаты нужно отправлять на анализ

Потом прикинул свои хотелки - раз уж есть время и желание, почему бы не разгуляться. Да и как раз недавно слушал замечательный доклад [Алексея Волкова](https://github.com/rosko) на ту же тему.

* Хочу единый стиль форматирования
* Хочу единый стиль TypeScript
* Хочу документацию, но не хочу ее писать
* Вообще хочу все автоматизировать по максимуму. Что бы фыр-фыр-фыр и в продакшн.

В итоге требования оформились в следующее:

* Модуль должен быть на TypeScript и проверен с помощью TsLint
* Модуль должен быть используемым из-под TypeScript и из-под JavaScript
* Тесты должны быть настроены на git hook, минимальное покрытие кода должно быть тоже настроено, статистика должна быть.
* Форматирование должно быть настроено
* Документация должна создаваться из кода
* Публикация должна быть удобной и единообразной
* Все что можно должно быть автоматизировано

Вроде бы немало нужно пробовать.

## Предварительные телодвижения

Создаем (клонируем) репозиторий, инициализируем package.json, ставим локально TypeScript. Вообще все зависимости ставим локально, и не забываем фиксировать их версии.

```cmd
git init
npm init
npm i -D typescript
./node_modules/.bin/tsc --init
```

Тут же на месте нужно подправить tsconfig.json под себя - выставить target, libs, include/exclude, outDir и остальные опции.

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
npm i -D prettier
```

package.json

```json
"prettier": "./node_modules/.bin/prettier --config .prettierrc.json --write src/**/*.ts"
```

У prettier нет команды init, так что [конфигурировать](https://prettier.io/docs/en/configuration.html) его нужно вручную. Создайте .prettierrc.json в корне проекта вот примерно с таким спорным содрежанием (если что - пост совсем не о том, какие кавычки лучше, но вы можете попробовать)

.prettierrc.json

```json
{
    "tabWidth": 4,
    "useTabs": false,
    "semi": true,
    "singleQuote": true,
    "trailingComma": "es5",
    "arrowParens": "always"
}
```

Теперь создайте папку src, в ней создайте index.ts с каким-то условным содержанием и попробуйте запустить prettier. Если ему не понравится ваше форматирование - он его исправит автоматически. Очень удобно. Если вы не хотите вспоминать об этом только во время коммита/пуша можно [настроить его на автозапуск](https://prettier.io/docs/en/watching-files.html) или поставить расширение для студии.

## Стиль кода

Со стилем кода все тоже не сложно. Для JavaScript есть [eslint](https://eslint.org/), для TypeScript есть [tslint](https://palantir.github.io/tslint/). Ставим tslint и создаем tsconfig.js для хранения настроек

```cmd
npm i -D tslint
./node_modules/.bin/tslint --init
```

package.json

```json
"lint": "./node_modules/.bin/tslint -c tslint.json 'src/**/*.ts' 'tests/**/*.spec.ts'"
```

Вы можете написать собственные правила, а можете использовать уже существующие правила с помощью параметра extend. [Вот](https://www.npmjs.com/package/tslint-config-airbnb), например, конфиг от airbnb.

Кстати, советую оценить юмор разработчиков, которые в линтере для статического языка (ну ладно, надмножества) позволяют сделать такое супер статическое правило:

```js
module.exports = {
    extends: "./tslint-base.json",
    rules: {
        "no-excessive-commenting": [true, {maxComments: Math.random() * 10}]
    }
};
```

Ну разве это не красиво?

Есть важный момент - tslint и prettier пересекаются по функционалу (например в длинне строки или "висящих" запятых). Так что если вы будете использовать оба - нужно будет следить за соответствием или отказаться от чего-то.

И еще, для тех кто хочет проверять не все файлы, а только staged - есть пакет [lint-staged](https://github.com/okonet/lint-staged)

## Тесты

Что нам нужно от тестов прежде всего? Во-первых, чтобы они запускались автоматически, во-вторых контроль покрытия, в-третьих какой-то отчет, желательно в lcov формате (если что - lcov отлично понимается разными анализаторам - от SonarQube до CodeCov). Автоматизацией мы займемся чуток позже, пока настроим сами тесты.

Ставим [karma](http://karma-runner.github.io/2.0/index.html), [jasmine](https://jasmine.github.io/) и весь соответствующий ей обвес

```cmd
npm i -D karma karma-jasmine jasmine karma-typescript karma-chrome-launcher @types/jasmine
./node_modules/.bin/karma init
```

Немного модифицируем karma.conf.js и сразу настроим работу с покрытием

karma.conf.js

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

package.json

```json
"test": "./node_modules/.bin/karma start"
```

Если вы используете или планируете использовать CI то лучше поставить [HeadlessChrome](https://github.com/GoogleChrome/puppeteer):

```cmd
npm i -D puppeteer
```

И доконфигурировать Karma (Chrome исправить на ChromeHeadless) плюс еще кое-что. Правки можно посмотреть можно в [демо репозитории](https://github.com/Drag13/IsNumberStrict)

Запустите тесты, проверьте что все работет. Заодно проверьте отчет о покрытии (он находится в папке coverage) и уберите его из под контроля версий, в репозитории он не нужен.

## Стиль коммитов

Коммиты тоже можно унифицировать (и заодно довести кого-то до белого каления, если переборщить, так что лучше без фанатизма). Я попробовал [commitizen](https://github.com/commitizen/cz-cli), вроде бы ничего. Из важного он поддерживает conventional-changelog форматирование, что позволит нам использовать коммиты как источник changelog. Кроме того он не очень навязчив так что меня не будут искать злые коллеги.

```cmd
npm i -D commitizen
npm i -D cz-conventional-changelog
```

cz-conventional-changelog это адаптер, который отвечает за вопросы, и как следствие за формат ваших коммитов

Добавьте новую команду в scripts секцию

```json
"commit":"./node_modules/.bin/git-cz"
```

И новую секцию package.json - config для commitizen

```json
"config": {
        "commitizen": {
            "path": "./node_modules/cz-conventional-changelog"
        }
    }
```

Диалог с commitizen выглядит так:

Для VSCode есть [плагин](https://github.com/KnisterPeter/vscode-commitizen)

## Документация

Тепер к документации. Документации у нас будет две. Первая это документация из-кода, вторая - документация из коммитов. Для документации из кода я взял [typedoc](https://www.npmjs.com/package/typedoc) (аналог [esdoc](https://esdoc.org/) но для TypeScript). Он очень просто ставится и работает. Главное не забудьте убрать результаты его трудов из-под контроля версий.

```cmd
npm i typedoc -D
```

и обновляем package.json

package.json

```json
"doc": "./node_modules/.bin/typedoc --out docs/src/ --readme ./README.md"
```

Флаг --readme заставит включить readme в главную страницу документации, что как по мне достаточно удобно.

Второй тип документации это changelog, и с ним нам поможет [conventional-changelog-cli](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-cli) пакет.

```cmd
npm i -D conventional-changelog-cli
```

package.json

```json
"changelog": "./node_modules/.bin/conventional-changelog -p angular -i CHANGELOG.md -s"
```

От angular здесь только форматирования и ничего больше. Все, changelog файл будет обновляться самостоятельно. Главное внимательно пистаь коммиты. Ну мы же всегда пишем идеальные коммиты, так что это проблемой быть не должно.

## Билд

Поскольку наш пакет должен работать и для JavaScript, нам нужно превратить TypeScript в JavaScript. Кроме того, неплохо было бы сделать еще и минифицированный бандл, просто на всякий случай. Для этого нам понадобится [uglifyjs](https://www.npmjs.com/package/uglify-js) и немного подправить package.json

```cmd
npm i -D uglifyjs
```

package.json

```json
"clean":"rmdir dist /S /Q",
"build": "./node_modules/.bin/tsc --p ./ --sourceMap false",
"bundle": "./node_modules/.bin/uglifyjs ./dist/*.js --compress --mangle --output ./dist/index.min.js"
```

Кстати, если вы хотите контролировать размер вашего проекта, есть еще два интересных пакета

* [bundlesize](https://www.npmjs.com/package/bundlesize)
* [sizelimit](https://www.npmjs.com/package/size-limit) - тоже самое но на вебпаке

## Автоматизация

Ну вот, основные шаги мы уже сделали, теперь все нужно автоматизировать иначе работать будет не слишком удобно. Для этого нам понадобится еще один пакет - [husky](https://www.npmjs.com/package/husky) (кстати это где-то 13ый пакет если вам интересно). Он перехватывает git hooks и вызывает сопоставленные команды из package.json. Например, когда вы делаете коммит, сработает precommit команда - например test и если она вернет ошибку, коммит не осуществиться. Это может уберечь вас от коммитов и пушей не валидного кода избавив от необходимости запускать все самому. Выглядит это примерно так:

```cmd
npm i -D husky
```

```json
"precommit":"npm run prettier" ,
"prepush": "call npm run lint && call npm run test"
```

Вот тут есть важный нюанс, использование call синтаксиса не кроссплатформенно и на unix системах не взлетит. Так что если хотите все сделать по-честному придется поставить еще и [npm-run-all](https://www.npmjs.com/package/npm-run-all) пакет.

## Публикация

Ну вот мы и дошли до публикации нашего (пусть и пустого) пакета. Давайте подумаем что мы хотим от публикации?

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

package.json

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

В качестве бонуса есть демо репозиторий, который все это поддерживает + CI с помощью travis-ci. Напомню, там настроен HeadlessChrome так что если вам это важно советую туда заглянуть.

## Благодарности

Большая благодарность [Алексею Волкову](https://github.com/rosko) за его доклад на JsFest, который и стал основой этой статьи

## Полезные ссылки

* .editorconfig
* [prettier](https://github.com/prettier/prettier)
* [tslint](https://palantir.github.io/tslint/)
* [eslint](https://eslint.org/)
* [typedoc](https://www.npmjs.com/package/typedoc)
* [esdoc](https://esdoc.org/)
* [commitizen](https://github.com/commitizen/cz-cli)
* [commitizen-плагин для vscode](https://github.com/KnisterPeter/vscode-commitizen)
* [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog)
* [uglifyjs](https://www.npmjs.com/package/uglify-js)
* [husky](https://www.npmjs.com/package/husky)
* [npm-run-all](https://www.npmjs.com/package/npm-run-all)
* [unleash](https://www.npmjs.com/package/unleash)
* [демо репозиторий](https://github.com/Drag13/IsNumberStrict)