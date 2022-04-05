const { types } = require("hardhat/config")
require("@nomiclabs/hardhat-web3");
require("hardhat/config")


// добавление нового голосования
task("addVote", "Create new Vote")
  .addParam("vName", "Vote name")
  .setAction(async (taskArgs) => {
    // подключаемся к контракту
    const Voting = await ethers.getContractFactory("Voting");
    const voting = await Voting.attach("0x44bA6F954746399c74968d7ce49befdEb6aa9EdE");
    // вызываем функцию на контракте
    const tx = await voting.addVote(_vName = taskArgs.vName);
    await tx.wait();

    // получаем информацию о всех голосования
    const response  = await voting.getallVotes();
    // достаём информацию о последнем голосовании
    const vote = getVote(response[response.length - 1]);
    // выводим информацию о голосовании
    console.log("Voting has been successfully established")
    console.log(vote);
});


// добавление кандидата в голосование
task("addCandidateToVote", "Add candidate to vote")
  .addParam("vId", "Vote Id")
  .addParam("cName", "Candidate name")
  .addParam("cAddress", "Candidate address")
  .setAction(async (taskArgs) => {
    // подключаемся к контракту
    const Voting = await ethers.getContractFactory("Voting");
    const voting = await Voting.attach("0x44bA6F954746399c74968d7ce49befdEb6aa9EdE");

    // вызываем функцию на контракте
    const tx = await voting.addCandidateToVote(
      _vId = taskArgs.vId, _cName = taskArgs.cName, _cAddress = taskArgs.cAddress);
    await tx.wait();

    // получаем информацию о голосовании
    const response  = await voting.getVoteByID(_vId = taskArgs.vId);
    // достаём информацию о голосовании
    const vote = getVote(response);
    // выводим информацию о голосовании
    console.log("Candidate successfully added to the vote")
    console.log(vote);
});

// добавление кандидатов в голосование списком
task("addListCandidatesToVote", "Add candidates to vote")
  .addParam("vId", "Vote Id")
  .addParam("cNames", "Candidate names", [], type = types.json)
  .addParam("cAddresses", "Candidate addresses", [], type = types.json)
  .setAction(async (taskArgs) => {
    // подключаемся к контракту
    const Voting = await ethers.getContractFactory("Voting");
    const voting = await Voting.attach("0x44bA6F954746399c74968d7ce49befdEb6aa9EdE");
    
    // вызываем функцию на контракте
    const tx = await voting.addListCandidatesToVote(
      _vId = taskArgs.vId, _cNames = taskArgs.cNames, _cAddresses = taskArgs.cAddresses);
    await tx.wait();
  
    // получаем информацию о голосовании
    const response  = await voting.getVoteByID(_vId = taskArgs.vId);
    // достаём информацию о голосовании
    const vote = getVote(response);
    // выводим информацию о голосовании
    console.log("Candidates successfully added to the vote")
    console.log(vote);
});


// добавление голосования со списком кандидатов
task("addVoteAndListCandidates", "Create new vote and add candidates to vote")
  .addParam("vName", "Vote name")
  .addParam("cNames", "Candidate names", [], type = types.json)
  .addParam("cAddresses", "Candidate addressts", [], type = types.json)
  .setAction(async (taskArgs) => {
    // подключаемся к контракту
    const Voting = await ethers.getContractFactory("Voting");
    const voting = await Voting.attach("0x44bA6F954746399c74968d7ce49befdEb6aa9EdE");

    // вызываем функцию на контракте
    const tx = await voting.addVoteAndListCandidates(
      _vName = taskArgs.vName, _cNames = taskArgs.cNames, _cAddresses = taskArgs.cAddresses);
    await tx.wait();

    // получаем информацию о всех голосования
    const response  = await voting.getallVotes();
    // достаём информацию о последнем голосовании
    const vote = getVote(response[response.length - 1]);
    // выводим информацию о голосовании
    console.log("Voting has been successfully established")
    console.log(vote);
});


// изменение названия голосования
task("changeVote", "Сhange name vote")
  .addParam("vId", "Vote id")
  .addParam("vName", "Vote name")
  .setAction(async (taskArgs) => {
    // подключаемся к контракту
    const Voting = await ethers.getContractFactory("Voting");
    const voting = await Voting.attach("0x44bA6F954746399c74968d7ce49befdEb6aa9EdE");
  
    // вызываем функцию на контракте
    const tx = await voting.changeVote(
      _vId = taskArgs.vId, _vName = taskArgs.vName);
    await tx.wait();

    // получаем информацию о голосовании
    const response  = await voting.getVoteByID(_vId = taskArgs.vId);
    // достаём информацию о голосовании
    const vote = getVote(response);
    // выводим информацию о голосовании
    console.log("Voting name successfully changed")
    console.log(vote);
});


// изменение имени и/или адреса кандидата
task("changeCandidate", "Сhange name candidate")
  .addParam("vId", "Vote id")
  .addParam("cId", "Candidate id")
  .addParam("cName", "Candidate name")
  .addParam("cAddress", "Candidate address")
  .setAction(async (taskArgs) => {
    // подключаемся к контракту
    const Voting = await ethers.getContractFactory("Voting");
    const voting = await Voting.attach("0x44bA6F954746399c74968d7ce49befdEb6aa9EdE");
  
    // вызываем функцию на контракте
    const tx = await voting.changeCandidate(
      _vId = taskArgs.vId, _cId = taskArgs.cId, _cName = taskArgs.cName, _cAddress = taskArgs.cAddress);
    await tx.wait();

    // получаем информацию о голосовании
    const response  = await voting.getVoteByID(_vId = taskArgs.vId);
    // достаём информацию о голосовании
    const vote = getVote(response);
    // выводим информацию о голосовании
    console.log("Candidate successfully changed")
    console.log(vote);
});


// удаление голосования по его id
task("delVote", "Delete Vote")
  .addParam("vId", "Vote id")
  .setAction(async (taskArgs) => {
    // подключаемся к контракту
    const Voting = await ethers.getContractFactory("Voting");
    const voting = await Voting.attach("0x44bA6F954746399c74968d7ce49befdEb6aa9EdE");
  
    // смотрим сколько голосований было
    let response  = await voting.getallVotes();
    console.log(`There are ${response.length} votes now`)

    // вызываем функцию на контракте
    const tx = await voting.delVote(_vId = taskArgs.vId);
    await tx.wait();

    // смотрим сколько голосований стало
    response  = await voting.getallVotes();
    console.log(`There are ${response.length} votes now`)
    console.log("Vote successfully deleted")
});


// удаление кандидата из голосования по его id
task("delCandidateFromVote", "Delete candidate drom votes")
  .addParam("vId", "Vote id")
  .addParam("cId", "Candidate id")
  .setAction(async (taskArgs) => {
    // подключаемся к контракту
    const Voting = await ethers.getContractFactory("Voting");
    const voting = await Voting.attach("0x44bA6F954746399c74968d7ce49befdEb6aa9EdE");
  
    // вызываем функцию на контракте
    const tx = await voting.delCandidateFromVote(
      _vId = taskArgs.vId, _cId = taskArgs.cId);
    await tx.wait();

    // получаем информацию о первом голосовании
    const response  = await voting.getVoteByID(_vId = taskArgs.vId);
    // достаём информацию о последнем голосовании
    const vote = getVote(response);
    // выводим информацию о кандидатах
    console.log("The candidate has been successfully removed. New candidate list:")
    console.log(vote.vCandidates);
});


// старт голосования по его id
task("startVote", "Start vote")
  .addParam("vId", "Vote id")
  .setAction(async (taskArgs) => {
    // подключаемся к контракту
    const Voting = await ethers.getContractFactory("Voting");
    const voting = await Voting.attach("0x44bA6F954746399c74968d7ce49befdEb6aa9EdE");

    // вызываем функцию на контракте
    const tx = await voting.startVote(
      _vId = taskArgs.vId);
    await tx.wait();

    // получаем информацию о первом голосовании
    const response  = await voting.getVoteByID(_vId = taskArgs.vId);
    // достаём информацию о последнем голосовании
    const vote = getVote(response);
    // выводим информацию о голосовании
    console.log("Voting has started successfully")
    console.log(vote);
});


// функция голосования
task("vote", "Vote")
  .addParam("vId", "Vote id")
  .addParam("cId", "Candidate id")
  .setAction(async (taskArgs) => {
    // подключаемся к контракту
    const Voting = await ethers.getContractFactory("Voting");
    const voting = await Voting.attach("0x44bA6F954746399c74968d7ce49befdEb6aa9EdE");
  
    // вызываем функцию на контракте
    const tx = await voting.vote(
      _vId = taskArgs.vId, _cId = taskArgs.cId, {value: 10000000000000000n});
    await tx.wait();

    // получаем информацию о голосовании
    const response  = await voting.getVoteByID(_vId = taskArgs.vId);
    // достаём информацию о последнем голосовании
    const vote = getVote(response);
    // выводим информацию о голосовании
    console.log("Your vote is accepted, thank you")
    console.log(vote);
});


// завершаение голосования
task("endVote", "End vote")
  .addParam("vId", "Vote id")
  .setAction(async (taskArgs) => {
    // подключаемся к контракту
    const Voting = await ethers.getContractFactory("Voting");
    const voting = await Voting.attach("0x44bA6F954746399c74968d7ce49befdEb6aa9EdE");
  
    // вызываем функцию на контракте
    const tx = await voting.endVote(_vId = taskArgs.vId);
    await tx.wait();

    // получаем информацию о голосовании
    const response  = await voting.getVoteByID(_vId = taskArgs.vId);
    // достаём информацию о голосовании
    const vote = getVote(response);
    // выводим информацию о голосовании
    console.log("Voting successfully completed")
    console.log(vote);
});


// получение голосования по его id
task("getVoteByID", "Return info about vote")
  .addParam("vId", "Vote id")
  .setAction(async (taskArgs) => {
    // подключаемся к контракту
    const Voting = await ethers.getContractFactory("Voting");
    const voting = await Voting.attach("0x44bA6F954746399c74968d7ce49befdEb6aa9EdE");

    // получаем информацию о голосовании
    const response  = await voting.getVoteByID(_vId = taskArgs.vId);
    // генерируем удобный для проверки вид
    const vote = getVote(response);
    // выводим информацию о голосовании
    console.log(vote);
});


// получение списка всех голосований
task("getallVotes", "Return info about vote")
  .setAction(async () => {
    // подключаемся к контракту
    const Voting = await ethers.getContractFactory("Voting");
    const voting = await Voting.attach("0x44bA6F954746399c74968d7ce49befdEb6aa9EdE");

    // получаем информацию о всех голосованиях
    const responses  = await voting.getallVotes();
    // выводим информацию о голосованиях
    for(let response of responses){
      let vote = getVote(response);
      console.log(vote);
    }
});


// получение списка идущих голосований
task("getCurrentVotes", "Return info about vote")
  .setAction(async () => {
    // подключаемся к контракту
    const Voting = await ethers.getContractFactory("Voting");
    const voting = await Voting.attach("0x44bA6F954746399c74968d7ce49befdEb6aa9EdE");

    // получаем информацию о всех идущих голосованиях
    const responses  = await voting.getCurrentVoites();
    // выводим информацию о голосованиях
    for(let response of responses){
      let vote = getVote(response);
      console.log(vote);
    }
});


// получение списка завершённых голосований
task("getEndVotes", "Return info about vote")
  .setAction(async () => {
    // подключаемся к контракту
    const Voting = await ethers.getContractFactory("Voting");
    const voting = await Voting.attach("0x44bA6F954746399c74968d7ce49befdEb6aa9EdE");

    // получаем информацию о всех завершённых голосованиях
    const responses  = await voting.getEndVoites();
    // выводим информацию о голосованиях
    for(let response of responses){
      let vote = getVote(response);
      console.log(vote);
    }
});


// получение списка кандидатов из голосования по его id
task("getCandidateByVote", "Return candidate from vote")
  .addParam("vId", "Vote id")
  .setAction(async (taskArgs) => {
    // подключаемся к контракту
    const Voting = await ethers.getContractFactory("Voting");
    const voting = await Voting.attach("0x44bA6F954746399c74968d7ce49befdEb6aa9EdE");

    // получаем информацию о кандидатах из голосования
    const response  = await voting.getCandidateByVote(_vId = taskArgs.vId);
    const candidates = getCandidates(response);
    // выводим информацию о кандидатах
    console.log(candidates);
});

// получение списка победителей из голосования по его id
task("getWinnersByVote", "Return winner from vot")
  .addParam("vId", "Vote id")
  .setAction(async (taskArgs) => {
    // подключаемся к контракту
    const Voting = await ethers.getContractFactory("Voting");
    const voting = await Voting.attach("0x44bA6F954746399c74968d7ce49befdEb6aa9EdE");

    // получаем информацию о победителях из голосования
    const response  = await voting.getWinnersByVote(_vId = taskArgs.vId);
    const winners = getCandidates(response);
    // выводим информацию о победителях
    console.log(winners);
});


// вывод информации о комиссии доступной к выводу
task("getFee", "Return fee")
  .setAction(async () => {
    // подключаемся к контракту
    const Voting = await ethers.getContractFactory("Voting");
    const voting = await Voting.attach("0x44bA6F954746399c74968d7ce49befdEb6aa9EdE");

    // вызываем фукнцию на контракте
    const fee = await voting.getFee();

    // выводим информацию о комиссии доступной к выводу
    console.log(`you can withdraw ${fee} wei`)
});


// вывод средств с контракте
task("withDraw", "WithDraw fee")
  .setAction(async () => {
    // подключаемся к контракту
    const Voting = await ethers.getContractFactory("Voting");
    const voting = await Voting.attach("0x44bA6F954746399c74968d7ce49befdEb6aa9EdE");

    // вызываем фукнцию на контракте
    await voting.withDraw();

    // выводим информацию об успешном выводе средств
    console.log("Funds successfully withdrawn")
});

  module.exports = {};



  // дефолтная структура для хранения информации о голосовании
VoteInfo = {
  // id голосования
  vId : 0,
  // время начала голосования
  vStartTime: 0,
  // общее количество проголосовавших
  vTotal: 0,
  // количество кандидатов
  vCandidateCount: 0,
  // количество выигрывших кандидатов
  vWinnersCount: 0,
  // выигрыш победившего кандидата/кандидатов
  vWinningAmount: 0,
  // название голосования
  vName: "",
  // статус голосования - началось/не началось
  vStatusStart: false,
  // статус голосования - закончилось/не закончилось
  vStatusEnd: false,
  // список кандидатов
  vCandidates: [],
  // список id победивших кондидатов 
  vIdWinners: []
}

// функция для преобразования возвращаемой из контракта
// информации о голосованиях в удобную форму
function getVote(vote = VoteInfo){
  var newVote = new Object();
  newVote.vId = BigInt(vote.vId);
  newVote.vStartTime = BigInt(vote.vStartTime);
  newVote.vTotal = BigInt(vote.vTotal);
  newVote.vCandidateCount = BigInt(vote.vCandidateCount);
  newVote.vWinnersCount = BigInt(vote.vWinnersCount);
  newVote.vWinningAmount = BigInt(vote.vWinningAmount);
  newVote.vName = vote.vName;
  newVote.vStatusStart = vote.vStatusStart;
  newVote.vStatusEnd = vote.vStatusEnd;
  newVote.vCandidates = [];
  for( let candidate of vote.vCandidates){
    newVote.vCandidates.push({
      cId: BigInt(candidate.cId),
      cVotes: BigInt(candidate.cVotes),
      cName: candidate.cName,
      cAddress: candidate.cAddress
    })
  }
  newVote.vIdWinners =[];
  for(let idWinners of vote.vIdWinners){
    newVote.vIdWinners.push(BigInt(idWinners));
  }

  return newVote;
}

// функция для получения списка кандидатов
function getCandidates(vCandidates){
  candidates = [];
  for(let candidate of vCandidates){
    candidates.push({
      cId: BigInt(candidate.cId),
      cVotes: BigInt(candidate.cVotes),
      cName: candidate.cName,
      cAddress: candidate.cAddress
    })
  }
  return candidates;
}