const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Voting", function () {

    let Voting;
    let voting;
    // действующие лица
    let owner;
    let voter1, voter2, voter3, voter4, voter5;
    let candidate1, candidate2, candidate3, candidate4;
    // для удобства сразу создадим несколько эталонных голосований
    let eVote, eVote2

    // создаём массивы
    // с именами и адресами
    // голосований, избирателей и кандидатов
    const vNames = [ "Vote_1", "Vote_2"];
    let cNames;
    let cAddresses;
    // id голосования и кандидата
    let vId, cId;

    // деплоим контракт
    before(async function(){
      vId = 1;
      // собрали контракт
      Voting = await ethers.getContractFactory("Voting");
      // отправили контракт в деплой
      voting = await Voting.deploy();
      // подождали, пока контракт задеплоился
      await voting.deployed();
      // сохраняем адреса хозяина контракта, пяти избирателей и четырёх кандидатов
      [owner, voter1, voter2, voter3, voter4, voter5, candidate1, candidate2, candidate3, candidate4] = await ethers.getSigners();
      // массивы с именами и адресами  кандидатов
      cNames = [ "Candidate_1", "Candidate_2", "Candidate_3", "Candidate_4" ]
      cAddresses = [ candidate1.address, candidate2.address, candidate3.address, candidate4.address ]
      // инициализируем эталонные голосования дефолтными значениями
      eVote = getVote();
      eVote2 = getVote();
    })


    // проверка функции добавления голосования addVote()
    it("Check addVote()", async function(){

      // добавляем новое голосование сразу со списоком кандидатов
      const tx = await voting.addVote(
        _vName = vNames[0], _cNames = cNames, _cAddresses = cAddresses);
      await tx.wait();

      // получаем информацию о голосовании
      const response  = await voting.getVoteByID(vId);
      // преобразуем в удобный вид
      const vote = getVote(response);

      // изменяем значения эталонного голосования
      const blockNumBefore = await ethers.provider.getBlockNumber();
      const blockBefore = await ethers.provider.getBlock(blockNumBefore);
      const timestampBefore = blockBefore.timestamp;
      eVote.vStartTime = BigInt(timestampBefore);
      eVote.vName = vNames[0];
      eVote.vId = BigInt(vId);
      addCandidates(eVote, cNames, cAddresses);

      //console.log(vote);
      //console.log(eVote);      
      // сравниваем результаты
      expect(vote).deep.to.equal(eVote);
    })


    // проверка функции голосования vote()
    it("Check vote()", async function(){

      // Теперь пришло время голосовать!
      cId = 1;
      // проверим, что нельзя проголосовать не отправив 0.01 ETH
      await expect(
        voting.connect(voter1).vote(_vId = vId, _cId = cId, {value: 1000n})
      ).to.be.revertedWith("Send 0.01 ETH to vote");

      // Голосуем за 1 кандидата и изменяем значения эталонного голосования
      let tx = await voting.connect(voter1).vote(_vId = vId, _cId = cId, {value: 10000000000000000n})
      await tx.wait();
      eVote.vCandidates[cId - 1].cVotes++;

      // и проверим, что нельзя проголосовать дважды с одного адреса
      await expect(
        voting.connect(voter1).vote(_vId = vId, _cId = cId, {value: 10000000000000000n})
      ).to.be.revertedWith("You already voted");

      // Дальше голосуем от имени других кандидатов
      // Голосуем за 1 кандидата и изменяем значения эталонного голосования
      tx = await voting.connect(voter2).vote(_vId = vId, _cId = cId, {value: 10000000000000000n})
      await tx.wait();
      eVote.vCandidates[cId - 1].cVotes++;

      // Голосуем за 2 кандидата и изменяем значения эталонного голосования
      cId = 2;
      tx = await voting.connect(voter3).vote(_vId = vId, _cId = cId, {value: 10000000000000000n})
      await tx.wait();
      eVote.vCandidates[cId - 1].cVotes++;
      tx = await voting.connect(voter4).vote(_vId = vId, _cId = cId, {value: 10000000000000000n})
      await tx.wait();
      eVote.vCandidates[cId - 1].cVotes++;

      // Голосуем за 3 кандидата и изменяем значения эталонного голосования
      cId = 3;
      tx = await voting.connect(voter5).vote(_vId = vId, _cId = cId, {value: 10000000000000000n})
      await tx.wait();
      eVote.vCandidates[cId - 1].cVotes++;

      // получаем обновлённую информацию о голосовании,
      const response  = await voting.getVoteByID(vId);
      // генерируем удобный для проверки вид
      const vote = getVote(response);

      //console.log(vote);
      //console.log(eVote);      
      // сравниваем результаты
      expect(vote).deep.to.equal(eVote);
    })


    // проверка функции окончания голосования endVote()
    it("Check endVote()", async function(){

      // Пришло время завершать голосование
      vId = 1;

      // рассчитаем кто должен победить и сколько выиграть
      let addressWinners = getWinningAmount(eVote);
      // сохраним текущее состояние балансов этих адресов
      const balanceWinnersBefore = await getBalanceWinners(addressWinners);

      // теперь проверим, что нельзя завершить голосование,
      // если не прошло 3 дня
      await expect(
        voting.connect(voter1).endVote(_vId = vId)
      ).to.be.revertedWith("You can't finish voting - it hasn't been three days yet");

      // переводим время на 3 дня вперёд
      await ethers.provider.send('evm_increaseTime', [259200]);

      // проверяем, что теперь нельзя голосовать
      await expect(
        voting.connect(voter1).vote(_vId = vId, _cId = cId)
      ).to.be.revertedWith("Voting time is over");

      // теперь завершаем голосование
      const tx = await voting.connect(voter1).endVote(_vId = vId)
      await tx.wait();

      // проверим, что нельзя закончить голосование,
      // которое уже закончилось
      await expect(
        voting.connect(voter1).endVote(_vId = vId)
      ).to.be.revertedWith("Voting is now over");

      // получаем обновлённую информацию о завершённом голосовании
      const response  = await voting.getVoteByID(vId);
      // генерируем удобный для проверки вид
      const vote = getVote(response);

      // изменяем значения эталонного голосования
      eVote.vStatusEnd = true;

      //console.log(vote);
      //console.log(eVote);      
      // сравниваем результаты
      expect(vote).deep.to.equal(eVote);

      // получаем новые значения балансов победителей
      const balanceWinnersAfter = await getBalanceWinners(addressWinners);
      //console.log(balanceWinnersBefore);
      //console.log(balanceWinnersAfter);     
      // проверяем, что балансы победитлей изменились на необходимую сумму
      for(let i = 0; i < balanceWinnersBefore.length; i++){
        expect(balanceWinnersBefore[i] + winningAmount)
        .to.equal(balanceWinnersAfter[i]);
      }
    })

    
    // Проверка функций  getVoteByID() и getallVotes(), возвращающих информацию о голосованиях
    it("Check getallVotes()", async function(){

      // попробуем получить информацию о голосовании
      // по не существующему id
      await expect(
        voting.connect(voter1).getVoteByID(_vId = 2)
      ).to.be.revertedWith("There is no vote with this id");

      // добавляем ещё одно голосование сразу со списоком кандидатов
      const tx = await voting.addVote(
        _vName = vNames[1], _cNames = cNames, _cAddresses = cAddresses);
      await tx.wait();

      // создаём ещё одно эталонное голосование
      const blockNumBefore = await ethers.provider.getBlockNumber();
      const blockBefore = await ethers.provider.getBlock(blockNumBefore);
      const timestampBefore = blockBefore.timestamp;
      eVote2.vStartTime = BigInt(timestampBefore);
      eVote2.vName = vNames[1];
      eVote2.vId = BigInt(2);
      addCandidates(eVote2, cNames, cAddresses);

      // получаем информацию о всех голосованиях
      // это должен быть массив из двух голосований
      response  = await voting.getallVotes();
      // генерируем удобный для проверки вид
      vote = getVote(response[0]);
      vote2 = getVote(response[1]);

      //console.log(vote);
      //console.log(eVote);
      //console.log(vote2);
      //console.log(eVote2); 
      // сравниваем результаты
      expect(vote).deep.to.equal(eVote);
      expect(vote2).deep.to.equal(eVote2);
    })


    // Проверка функций withDraw(), выводящей комиссию на адрес owner
    it("Check withDraw()", async function(){

      // узнаём баланс owner и контракта до вывода средств
      const ownerBalanceBefore = BigInt(await ethers.provider.getBalance(owner.address));
      const votingBalanceBefore = BigInt(await ethers.provider.getBalance(voting.address));

      // узнаём размер комиссии, которую можно вывести
      const amount  = BigInt(await voting.fee());
      
      // выводим баланс 
      let tx  = await voting.withDraw();
      await ethers.provider.send("hardhat_mine", ["0x1"]);
      const txResult = await tx.wait();

      // рассчитываем комиссию за выполнение транзакции
      const fee = BigInt(txResult.cumulativeGasUsed * txResult.effectiveGasPrice);
      // рассчитываем ожидаемый баланс owner после вывода выигрыша
      // баланс до - комиссия за транзакцию + сумма выведенных средств
      const ownerBalanceAfter = ownerBalanceBefore - fee + amount;

      // рассчитываем новый баланс контракта
      const votingBalanceAfter = votingBalanceBefore - amount;

      //console.log(amount);
      //console.log(ownerBalanceBefore);
      //console.log(votingBalanceBefore);
      //console.log(ownerBalanceAfter);
      //console.log(votingBalanceAfter);
      // сравниваем результаты
      // проверяем изменение баланса контракта
      expect(await ethers.provider.getBalance(voting.address)).to.equal(votingBalanceAfter);
      // проверяем изменение баланса owner
      expect(await ethers.provider.getBalance(owner.address)).to.equal(ownerBalanceAfter);
  })


    // проверка функций на предмет правильной работы onlyOwner()
    it("Check onlyOwner()", async function(){

      // попытаемся вызвать функции
      // не от имени owner

      // функция создания голосования
      await expect(
        voting.connect(voter1).addVote(_vName = vNames[0], _cNames = cNames, _cAddresses = cAddresses)
      ).to.be.revertedWith("You are not the owner of the contract");

      // функция вывода средств
      await expect(
        voting.connect(voter2).withDraw()
      ).to.be.revertedWith("You are not the owner of the contract");
    });
});


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
  // кандидаты
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


// Функция добавления кандидатов в эталонные голосования
function addCandidates(eVote, cNames, cAddresses) {
  let cId = 1;
  for(let i = 0; i < cNames.length; i++){
    eVote.vCandidates.push({
      cId: BigInt(cId++),
      cVotes: BigInt(0),
      cName: cNames[i],
      cAddress: cAddresses[i]
    })
  }
}


// функция находит победителей и возвращает массив их адресов
// а также рассчитывает их выигрыш
function getWinningAmount(eVote){
  // находим:
  // Общее количество голосов
  let totalVote = 0n;
  // максимальное количество голосов за кандидата
  let maxVote = 0n;
  // количество победителей
  let winnersCount;
  for(let i = 0; i < eVote.vCandidates.length; i++){
    totalVote += eVote.vCandidates[i].cVotes;
    if(eVote.vCandidates[i].cVotes > maxVote){
      maxVote = eVote.vCandidates[i].cVotes;
      winnersCount = 1n;
    } else if(eVote.vCandidates[i].cVotes == maxVote){
      winnersCount++;
    }
  }
  // ещё раз проходим по списку кандидатов, находим победителей
  // и сохраняем их адреса
  let addressWinners = [];
  for(let i = 0; i < eVote.vCandidates.length; i++){
    if(eVote.vCandidates[i].cVotes == maxVote){
      addressWinners.push(eVote.vCandidates[i].cAddress);
    }
  }
  // рассчитываем какую сумму выиграет каждый победивший кандидат
  winningAmount = 9000000000000000n * totalVote / winnersCount;
  // возвращаем список победителей
  return addressWinners;
}


// функция получает список адресов победителей и возвращает список их балансов
async function getBalanceWinners(addressWinners) {
  let balanceWinners = [];
  for(let i = 0; i < addressWinners.length; i++){
    balanceWinners.push(BigInt(await ethers.provider.getBalance(addressWinners[i])));
  }
  return balanceWinners;
}
