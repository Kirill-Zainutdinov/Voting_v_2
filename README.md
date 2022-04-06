Здесь представлен проект для проведения голосований

Суть контракта Voiting.sol заключается в следующем:

1. Создаётся голосование cо списком кандидатов
4. Чтобы проголосовать, избиратель должен вызвать функцию Vote(), отправив на контракт 0.01 ETH
5. По прошествии трёх дней с начала голосования любой пользователь может завершить его. При этом, определяется победитель/победители и на его счёт/счета отправляется 90% средств собранных в ходе этого голосования. Если есть несколько победителей - то есть кандидатов, набравших наибольшее и вместе с тем равное количество голосов, выигрыш делиться между ними поровну
6. Оставшуюся часть средств владелец контракта может вывести на свой счёт

Контракт содержит следующие функции:

addVote() - создаёт новое голосование. В качестве аргументов принимает название голосования, список имён кандидатов и список адресов кандидатов. Только владелец контракта может создавать новое голосование.

vote() - функция для голосования. В качестве аргументов принимает id голосования и id кандидата в этом голосовании. Чтобы проголосовать, необходимо с вызвовм этой функции отправить 0.01 Eth. Нельзя голосовать, если с начала голосования прошло больше 3 дней. Нельзя голосовать дважды с одного адреса.

endVote() - функция завершения голосования. В качестве аргумента принимает id голосования. Фунцию может вызывать любой, но не раньше, чем через три дня после начала голосования. В этой функции определяется победитель/победители голосования и каждому победителю отправляется на счёт 90% эфира, собранного в ходе данного голосования в равных долях. Оставшиемя 10% добавляются к сумме, доступной для вывода хозяином контракта.

getallVotes() - функция возвращает список всех голосований

getVoteByID() - функция возвращает информацию только по одному голосованию. В качестве аргумента принимает его id

withDraw() - функция отправляет собранную с голосований и доступную для вывода комиссию на адрес владельца контракта

Также проект содержит тесты в файле ./test/test.js, которые обеспечивают полное покрытие тестами по всем параметрам

В файле ./task/Voiting.js содержатся таски для hardhat, обеспечивающие взаимодействие со всем функциями контракта

Конфиг hardhat настроен на деплой в тестовую сеть rinkeby. Вам понадобиться создать и настроить файл .env

Скрипт deploy-script.js деплоит контракт в сеть
