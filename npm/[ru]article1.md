# F

Всем, привет! Давайте поговорим о том, как настроить npm проект для работы в команде. Когда ты работаешь один, ничего сложного в этом нет - npm init, пишим код в любимом стиле, потом npm publish и 1 миллон загрузок в кармане. Но представьте себе что вы работаете не один, а вас таких человек 15. Или вообще непойми сколько так как это open-source и все дела. И у каждого свой стиль форматирования, свой стиль кода,да еще и тесты никто кроме вас не пишет. Что делать? Проверять и автоматизировать, и автоматизировать по максимуму. Кому интересно - давайте смотреть.

Для начала давайте определимся чего мы хотим:

* Единый стиль форматирования
* Единый стиль кода
* Тесты перед каждым пушем
* Автоматическая генерация документации
* Удобный паблиш без криков вида "я забыл тег поставить!!!"

Для примера возьмем typescript, но если вы на нем не пишите, все равно читайте дальше. Во-первых автору приятно, а во-вторых все кроме репозитория будет продублировано и для чистого JS.

Начнем с форматирования

Для сохранения единообразия форматирования мы воспользуемся двумя инструментами. Первый это файл .editorconfig. Он понимается всеми основными IDE (webstorm, vscode), не требует установки ничего лишнего и работает с большим количеством типов файлов - js, ts, md, и так далее. Очень удобно.

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

Второй инструмент это prettier. Это npm пакет, который проверяет, и по-возможности, автоматически корректирует ваше форматирование текста. Установите его локально и добавьте первую комманду в package.json

```cmd
npm i prettier -D
```

```json
"prettier": "./node_modules/.bin/prettier"
```

Создайте папку src и добавьте туда index.ts файл. Попробуйте поменять настройки .editorconfig файла и посмотрите как меняется автоформатирование.

Теперь займеся стилем кода.

Для этого нам понадобится [tslint](https://palantir.github.io/tslint/) (или [eslint](https://eslint.org/) если [js](https://ru.wikipedia.org/wiki/Java) вам милее)

Поставьте tslint локально (важно все ставить локально. Во-первых автор недолюбливает глобальные модуля хотя и знает об npx, во-вторых нам все это еще и на CI сервер запихивать, так что только локально)

```cmd
npm i tslint -D
./node_modules/.bin/tslint --init
```

И добавьте еще одну строку в package.json

```json
"lint": "./node_modules/.bin/tslint -c tslint.json 'src/**/*.ts' 'tests/**/*.spec.ts'",
```

Теперь мы можем вручную запустить линтер и проверить, соответствует ли наш код высоким стандартам. И вот тут вы можете попасть в первую ловушку. Tslint и Prettier могут конфликтовать

Линтер есть, теперь дело за тестами.
Ставим [karma](http://karma-runner.github.io/2.0/index.html), [jasmine](https://jasmine.github.io/) и весь соответствующий ей обвес

```cmd
npm i -D karma jasmine
./node_modules/.bin/karma init
```

```json
"karma":"./node_modules/.bin/karma"
"test": "npm run karma start"
"start" : "npm run karma --watch true --single-run false"
```

Окей, тесты есть, неплохо было бы еще настроить минимальный порог покрытия и генерацию отчета о покрытии, благо это делается не сильно сложно.

Тесты мы настроили, теперь давайте займемся документацией и коммитами. Для JavaScipt есть [esdoc](https://esdoc.org/), для typescript есть [typedoc](http://typedoc.org/). Я их попробовал, не скажу что прямо огонь, но пойдет. Во всяком случае можно сказать что у нас ест документация.

Ставим пакет и обновляем package.json

```cmd
npm i -D typedoc
```

```json
"doc": "./node_modules/.bin/typedoc"
```

Флаг readme заставит typedoc включить в документацию ваш readme файл, что довольно удобно.

Теперь пришла пора заняться автоматизацией. Для начала давайте настроим билд. Немного иронично, что этап билда появился только сейчас, спустя столько зависимостей и инфраструктурной работы. Но ничего не попишешь,современный фронтед он такой, без пончиков не разобраться.

Лирику в сторону, ставим новый пакет - husky. Этот пакет нужен для того что бы выполнять наши скрипты (например билд или линтеры или тестирование) до коммита или пуша. Husky использует git hooks, но в отличии от оригинальных хуков, их можно шарить между командой, что удобно.

```cmd
npm i -D husky
```

и добавим сразу много новых команду:

```json
"build":"./node_modules/.bin/tsc"
"precommit":""
"prepush:""
```

Вообще использовать синтаксис вида call npm run XXX && ... не самая лучшая идея так как у вас будут проблемы с кроссплатформенностью. Так что если вы работаете на unix машинах советую поставить [npm-run-all](https://www.npmjs.com/package/npm-run-all) и использовать его вместо вот этих моих костылей с call &&. И раз уж мы заговорили об улучшениях, советую попробовать [lint-staged](https://www.npmjs.com/package/lint-staged) модуль, которы позволит вам проверять только staged файлы, вместо всех подряд.

Теперь, когда кто-то попытается сделать коммит, его код будет проверен линтером и протестирован. И только если все проверки будут успешны, код будет закомичен.

И последнее, автоматизация паблиша.

Здесь мы воспользуемся хуками самого npm, так что о чудо, ничего нового ставить не нужно. Добавьте в package.json еще три комманды:

```json
```

На этом основная часть закончена. Теперь о том, что осталось за кадром:

* Во-первых - унификация коммитов. Посмотрите в сторону commitizen или [commitlint](https://github.com/marionebl/commitlint).
* Во-вторых - генерация change-log из-этих саммых комитов. Посмотрите в сторону ххх
* В-третьих - минификация. Негоже отдавать чистый js, чужой траффик надо экономить. Посмотрите в сторону uglify

Благодарности:

Вот теперь вроде бы действительно все. Всем удачи!

Полезные ссылки:

* полезная ссылка №1