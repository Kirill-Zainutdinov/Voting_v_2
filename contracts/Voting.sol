// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.7.0;
pragma experimental ABIEncoderV2;

contract Voting{

    // Адрес хозяина контракта
    address owner;
    // Комиссия, доступная для вывода
    // комиссия с каждого голосования становится доступна для вывода
    // только после окончания голосования
    uint public fee;

    // Структура кандидата
    struct Candidate {
        // id кандидата
        uint cId;
        // количество голосов за кандидата
        uint cVotes;
        // имя кандидата
        string cName;
        // адрес кандидата
        address cAddress;
    } 

    // Структура голосования
    struct Vote{
        // id голосования
        uint vId;
        // время начала голосования
        uint vStartTime;
        // название голосования
        string vName;
        // статус голосования - закончилось/не закончилось
        bool vStatusEnd;
        // кандидаты
        Candidate[] vCandidates;
    }

    // Массив структур Vote - каждый элемент этого массива - отдельное голосование
    Vote[] allVotes;

    // Словарь с избирателями
    // (id голосования => (адрес избирателя => проголосовал или нет))
    mapping(uint => mapping(address => bool)) voters;

    modifier onlyOwner(){
        require(msg.sender == owner,
        "You are not the owner of the contract");
        _;
    }

    constructor(){
        owner = msg.sender;
        fee = 0;
    }

    // Функция добавления нового голосования со списком кандидатов
    function addVote(
        string calldata _vName, 
        string[] calldata _cNames,
        address [] calldata _cAddresses
    )
        external
        onlyOwner
    {
        // добавляем голосование
        allVotes.push();
        // сохраняем индекс для удобства
        uint vIndex = allVotes.length - 1;
        // сохраняем в голосовании его название
        allVotes[vIndex].vName = _vName;
        // сохраняем id голосования
        allVotes[vIndex].vId = vIndex + 1;
        // id кандидата
        uint cId = 1;
        // добавляем кандидатов
        for(uint i = 0; i < _cNames.length; i++){
            // добавляем нового кандидата в список
            allVotes[vIndex].vCandidates.push(Candidate(cId++, 0, _cNames[i], _cAddresses[i]));
        }
        // устанавливаем время старта голосования
        allVotes[vIndex].vStartTime = block.timestamp;
    }

    // Функция голосования
    function vote(
        uint _vId,
        uint _cId
    )
        external
        payable
    {
        // проверяем
        // что голосование ещё не закончилось - не прошло 3 дня с его старта
        require(block.timestamp < allVotes[--_vId].vStartTime + 3 days,
        "Voting time is over");
        // что с этого адреса ещё не голосовали
        require(voters[_vId][msg.sender] == false,
        "You already voted");
        // что голосующий внёс достаточно средства
        require(msg.value == 10000000000000000,
        "Send 0.01 ETH to vote");
        // увеличиваем количество голосов за кандидата
        allVotes[_vId].vCandidates[--_cId].cVotes++;
        // отмечаем адрес как проголосовавший
        voters[_vId][msg.sender] = true;
    }

    // Функция окончания голосования
    function endVote(
        uint _vId
    )
        external
    {
        // проверяем
        // что голосование закончилось - прошло 3 дня с его старта
        require(block.timestamp > allVotes[--_vId].vStartTime + 3 days,
        "You can't finish voting - it hasn't been three days yet");
        // что голосование не было завершено ранее
        require(allVotes[_vId].vStatusEnd == false,
        "Voting is now over");

        // выставляем статус, что голосование завершено
        allVotes[_vId].vStatusEnd = true;
        // копируем голосование в локальную структуру
        Vote memory mVote = allVotes[_vId];

        // находим:
        // Общее количество голосов
        uint totalVote = 0;
        // максимальное количество голосов за кандидата
        uint maxVote = 0;
        // количество победителей
        uint winnersCount = 0;
        for(uint i = 0; i < mVote.vCandidates.length; i++){
            totalVote += mVote.vCandidates[i].cVotes;
            if(mVote.vCandidates[i].cVotes > maxVote){
                maxVote = mVote.vCandidates[i].cVotes;
                winnersCount = 1;
            }
            else if(mVote.vCandidates[i].cVotes == maxVote){
                winnersCount++;
            }
        }

        // находим какую сумму выиграл каждый победитель
        uint winningAmount = 9000000000000000 * totalVote / winnersCount;
        // отправляем деньги на счёт каждому победившего кандидату
        for(uint i = 0; i < mVote.vCandidates.length; i++){
            if(mVote.vCandidates[i].cVotes == maxVote){
                payable(mVote.vCandidates[i].cAddress).transfer(winningAmount);
            }
        }
        // добавляем к комиссии, доступной к выводу, комиссию за это голосование
        fee += 1000000000000000 * totalVote;
    }

    // Функция для получения списка всех голосований
    function getallVotes()
        external
        view
        returns(Vote[] memory)
    {
        return allVotes;
    }

    // Функция для получения информации об одном голосовании по его id
    function getVoteByID(
        uint _vId
    )
        external
        view
        returns(Vote memory)
    {
        // проверяем, что такой id существует
        require(allVotes.length > --_vId, "There is no vote with this id");
        return allVotes[_vId];
    }

    // функция вывода средств на адрес владельцем контракта
    function withDraw()
        external
        onlyOwner
    {
        payable(owner).transfer(fee);
        fee = 0;
    }
}
// Voting deployed to: 0xfb5d91b71e2D279824B645f5D6586E82dd1608a1