const readline = require("node:readline/promises");
const { stdin: input, stdout: output } = require("node:process");

const player1 = {
  NOME: "Mario",
  VELOCIDADE: 4,
  MANOBRABILIDADE: 3,
  PODER: 3,
  Pontos: 0,
};

const player2 = {
  NOME: "Luigi",
  VELOCIDADE: 3,
  MANOBRABILIDADE: 4,
  PODER: 4,
  Pontos: 0,
};

const player3 = {
  NOME: "Peach",
  VELOCIDADE: 3,
  MANOBRABILIDADE: 4,
  PODER: 2,
  Pontos: 0,
};

const player4 = {
  NOME: "Yoshi",
  VELOCIDADE: 2,
  MANOBRABILIDADE: 4,
  PODER: 3,
  Pontos: 0,
};

const player5 = {
  NOME: "Bowser",
  VELOCIDADE: 5,
  MANOBRABILIDADE: 2,
  PODER: 5,
  Pontos: 0,
};

const player6 = {
  NOME: "Donkey Kong",
  VELOCIDADE: 2,
  MANOBRABILIDADE: 2,
  PODER: 5,
  Pontos: 0,
};

const personagens = [player1, player2, player3, player4, player5, player6];

async function selecionarPersonagem() {
  const rl = readline.createInterface({ input, output });

  console.log("\nQual personagem você quer?");
  personagens.forEach((personagem, indice) => {
    console.log(`${indice + 1} - ${personagem.NOME}`);
  });

  let escolha;

  do {
    escolha = Number(await rl.question("Digite o número do personagem: "));

    if (!Number.isInteger(escolha) || escolha < 1 || escolha > personagens.length) {
      console.log("Escolha inválida. Digite um número da lista.");
    }
  } while (!Number.isInteger(escolha) || escolha < 1 || escolha > personagens.length);

  rl.close();
  return personagens[escolha - 1];
}

function sortearAdversario(personagemEscolhido) {
  const adversarios = personagens.filter(
    (personagem) => personagem !== personagemEscolhido,
  );
  const indiceSorteado = Math.floor(Math.random() * adversarios.length);

  return adversarios[indiceSorteado];
}

async function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

function aguardar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getRandomBlock() {
  let random = Math.random();
  let result;

  switch (true) {
    case random < 0.33:
      result = "RETA";
      break;
    case random < 0.66:
      result = "CURVA";
      break;
    default:
      result = "CONFRONTO";
      break;
  }
  return result;
}

async function logRollResult(characterName, block, diceResult, attribute) {
  console.log(
    `${characterName} 🎲 rolou o dado de ${block} ${diceResult} + ${attribute} = ${diceResult + attribute}`,
  );
}

async function playRaceEngine(character1, character2) {
  for (let round = 1; round <= 5; round++) {
    console.log(`\n🏁 Rodada ${round} 🏁`);

    // sortear bloco aleatório
    let block = await getRandomBlock();
    console.log(`Bloco sorteado: ${block}`);

    //rolar dados para cada jogador
    let diceResult1 = await rollDice();
    let diceResult2 = await rollDice();

    //teste de habilidade
    let totalTestSkill1 = 0;
    let totalTestSkill2 = 0;

    if (block === "RETA") {
      totalTestSkill1 = diceResult1 + character1.VELOCIDADE;
      totalTestSkill2 = diceResult2 + character2.VELOCIDADE;

      await logRollResult(
        character1.NOME,
        "velocidade",
        diceResult1,
        character1.VELOCIDADE,
      );
      await logRollResult(
        character2.NOME,
        "velocidade",
        diceResult2,
        character2.VELOCIDADE,
      );
    }

    if (block === "CURVA") {
      totalTestSkill1 = diceResult1 + character1.MANOBRABILIDADE;
      totalTestSkill2 = diceResult2 + character2.MANOBRABILIDADE;

      await logRollResult(
        character1.NOME,
        "MANOBRABILIDADE",
        diceResult1,
        character1.MANOBRABILIDADE,
      );
      await logRollResult(
        character2.NOME,
        "MANOBRABILIDADE",
        diceResult2,
        character2.MANOBRABILIDADE,
      );
    }

    if (block === "CONFRONTO") {
      let powerResult1 = diceResult1 + character1.PODER;
      let powerResult2 = diceResult2 + character2.PODER;

      console.log(`${character1.NOME} enfrentou ${character2.NOME}🥊🥊`);

      await logRollResult(
        character1.NOME,
        "PODER",
        diceResult1,
        character1.PODER,
      );
      await logRollResult(
        character2.NOME,
        "PODER",
        diceResult2,
        character2.PODER,
      );

      if (powerResult1 > powerResult2 && character2.Pontos > 0) {
        console.log(
          `${character1.NOME} venceu o confronto! ${character2.NOME} perdeu um ponto!`,
        );
        character2.Pontos--;
      }
      if (powerResult2 > powerResult1 && character1.Pontos > 0) {
        console.log(
          `${character2.NOME} venceu o confronto! ${character1.NOME} perdeu um ponto!`,
        );
        character1.Pontos--;
      }

      if (powerResult1 === powerResult2) {
        console.log("Este confronto empatou!");
      }
    }

    // verifica o vencedor da rodada em blocos de reta ou curva
    if (block !== "CONFRONTO") {
      if (totalTestSkill1 > totalTestSkill2) {
        console.log(`${character1.NOME} marcou 1 ponto`);
        character1.Pontos++;
      } else if (totalTestSkill2 > totalTestSkill1) {
        console.log(`${character2.NOME} marcou 1 ponto`);
        character2.Pontos++;
      }
    }

    console.log("---------------------------------------------------------");

    if (round < 5) {
      console.log("Próxima rodada em 5 segundos...");
      await aguardar(5000);
    }
  }
}

async function declareWiner(character1, character2) {
  console.log("Resultado final");
  console.log(`${character1.NOME}: ${character1.Pontos} ponto(s)`);
  console.log(`${character2.NOME}: ${character2.Pontos} ponto(s)`);

  if (character1.Pontos > character2.Pontos) {
    console.log(`\n 🏆🏆 Parabens ${character1.NOME} venceu o jogo🏆🏆`);
  } else if (character2.Pontos > character1.Pontos) {
    console.log(`\n 🏆🏆 Parabens ${character2.NOME} venceu o jogo🏆🏆`);
  } else {
    console.log("🏁A partida empatou!🏁");
  }
}

(async function main() {
  const personagemJogador1 = await selecionarPersonagem();
  const personagemJogador2 = sortearAdversario(personagemJogador1);

  console.log(`\nOponente sorteado: ${personagemJogador2.NOME}`);
  console.log(
    `🚨🏁 Corrida Iniciada entre ${personagemJogador1.NOME} e ${personagemJogador2.NOME}!`,
  );

  await playRaceEngine(personagemJogador1, personagemJogador2);
  await declareWiner(personagemJogador1, personagemJogador2);
})();
