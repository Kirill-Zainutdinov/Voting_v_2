const { types } = require("hardhat/config")
require("@nomiclabs/hardhat-web3");
require("hardhat/config")


// добавление голосования со списком кандидатов
task("addVote", "Create new vote and add candidates to vote")
  .addParam("vName", "Vote name")
  .addParam("cNames", "Candidate names", [], type = types.json)
  .addParam("cAddresses", "Candidate addressts", [], type = types.json)
  .setAction(async (taskArgs) => {
    // подключаемся к контракту
    const Voting = await ethers.getContractFactory("Voting");
    const voting = await Voting.attach("0xfb5d91b71e2D279824B645f5D6586E82dd1608a1");

    // вызываем функцию на контракте
    const tx = await voting.addVote(
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


// функция голосования
task("vote", "Vote")
  .addParam("vId", "Vote id")
  .addParam("cId", "Candidate id")
  .setAction(async (taskArgs) => {
    // подключаемся к контракту
    const Voting = await ethers.getContractFactory("Voting");
    const voting = await Voting.attach("0xfb5d91b71e2D279824B645f5D6586E82dd1608a1");
  
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
    const voting = await Voting.attach("0xfb5d91b71e2D279824B645f5D6586E82dd1608a1");
  
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
    const voting = await Voting.attach("0xfb5d91b71e2D279824B645f5D6586E82dd1608a1");

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
    const voting = await Voting.attach("0xfb5d91b71e2D279824B645f5D6586E82dd1608a1");

    // получаем информацию о всех голосованиях
    const responses  = await voting.getallVotes();
    // выводим информацию о голосованиях
    for(let response of responses){
      let vote = getVote(response);
      console.log(vote);
    }
});


// вывод информации о комиссии доступной к выводу
task("getFee", "Return fee")
  .setAction(async () => {
    // подключаемся к контракту
    const Voting = await ethers.getContractFactory("Voting");
    const voting = await Voting.attach("0xfb5d91b71e2D279824B645f5D6586E82dd1608a1");

    // вызываем фукнцию на контракте
    const fee = await voting.fee();

    // выводим информацию о комиссии доступной к выводу
    console.log(`you can withdraw ${fee} wei`)
});


// вывод средств с контракте
task("withDraw", "WithDraw fee")
  .setAction(async () => {
    // подключаемся к контракту
    const Voting = await ethers.getContractFactory("Voting");
    const voting = await Voting.attach("0xfb5d91b71e2D279824B645f5D6586E82dd1608a1");

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
  // название голосования
  vName: "",
  // статус голосования - закончилось/не закончилось
  vStatusEnd: false,
  // список кандидатов
  vCandidates: [],
}

// функция для преобразования возвращаемой из контракта
// информации о голосованиях в удобную форму
function getVote(vote = VoteInfo){
  var newVote = new Object();
  newVote.vId = BigInt(vote.vId);
  newVote.vStartTime = BigInt(vote.vStartTime);
  newVote.vName = vote.vName;
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

  return newVote;
}

