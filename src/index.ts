import JishoApi from 'unofficial-jisho-api';
import { kanjiList, samples } from './joyo';
import * as fs from 'fs';

const jisho = new JishoApi();

// datos que nos interesa almacenar en cada uno de los nodos de nuestra red.
interface KanajiNodeData {
  taughtIn: string; // cuándo se enseña el kanji en japón
  jlptLevel: string; // en qué nivel del JLPT está considerado (para extranjeros)
  newspaperFrequencyRank: number; // cómo de frecuente es su uso en periódicos
  strokeCount: number; // cuántos trazos tiene
  meaning: string; // significado principal en inglés
};

// Creamos el diccionario que almacenará los pares <kanji, datos de la api relevantes>
let kanjiData = new Map<string, KanajiNodeData>();

// al mismo tiempo creamos un diccionario inverso de partes / radicales a 
// kanjis, de manera que podamos obtener para cada radical la lista de 
// kanjis que lo contienen
let partsToKanjis = new Map<string, string[]>();

// una arista se define por las partes comunes de los kanjis correspondientes
let edges: Map<string, string[]> = new Map();

// para evitar colapsar el servidor
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// datos a usar
const data: string[] = kanjiList;

// para cada uno de los kanjis disponibles realizamos una petición a la api
// para obtener sus datos, y
const main = async () => {
  let usedTime = 0;
  let refTime = new Date();

  for (let i = 0; i < data.length; i++) {
    const kanji = data[i];
    try {
      console.log(`Obteniendo kanji ${i + 1}/${data.length}`);
      const res = await jisho.searchForKanji(kanji);
      // extraemos la información relevante para los nodos
      const nodeData: KanajiNodeData = {
        taughtIn: res.taughtIn,
        newspaperFrequencyRank: parseInt(res.newspaperFrequencyRank, 10),
        meaning: res.meaning,
        strokeCount: parseInt(res.strokeCount, 10),
        jlptLevel: res.jlptLevel
      };
      // insertamos los datos del nodo en nuestro diccionario
      kanjiData.set(kanji, nodeData);
      // y ahora para cada parte que tuviera el kanji, 
      // añadimos la entrada correspondiente en el segundo diccionario
      res.parts.forEach(part => {
        let prevSet = partsToKanjis.get(part);
        if (prevSet) {
          // ya estaba el radical registrado
          // añadimos el kanji a la lista
          prevSet.push(kanji);
        }
        else {
          // no estaba aún el radical registrado
          // creamos una nueva entrada con un único elemento
          partsToKanjis.set(part, [kanji]);
        }
      });
    } catch (error) {
      console.log(`Error al acceder al kanji ${kanji}`);
      console.warn(error);
    }
    usedTime += (new Date()).getMilliseconds() - refTime.getMilliseconds();
    if (usedTime > 7000) {
      console.log(`Empleados ${usedTime}ms. Esperando 10 segundos`);
      await delay(10000);
      usedTime = 0;
    }
    refTime = new Date();
  }

  const computeEdgesFromPart = (part: string, kanjis: string[]): void => {
    for (let i = 0; i < kanjis.length - 1; i++) {
      // This is where you'll capture that last value
      for (let j = i + 1; j < kanjis.length; j++) {
        // obtenemos la arista deseada
        const newEdge = kanjis[i] < kanjis[j] ?
          `source ${kanjis[i]}, target ${kanjis[j]}` :
          `source ${kanjis[j]}, target ${kanjis[i]}`;

        let edgeParts = edges.get(newEdge);
        if (edgeParts) {
          // ya estaba la arista registrada
          // añadimos la parte a la lista
          edgeParts.push(part);
        }
        else {
          // no estaba aún la arista registrada
          // creamos una nueva entrada con un único elemento
          edges.set(newEdge, [part]);
        }
      }
    }
  };

  const dumpToFile = (fileName: string) => {
    let writer = fs.createWriteStream(fileName);
    let tabs = 0;
    const t = '\t';
    const writeLine = (line: string) => {
      writer.write(`${t.repeat(tabs)}${line}\n`);
    };

    writeLine('graph [')
    tabs += 1;
    // información general del grafo
    writeLine(`directed 0`);
    // formato de los nodos
    kanjiData.forEach((node, key) => {
      writeLine('node [');
      tabs += 1;
      writeLine(`id ${key}`);
      writeLine(`label "${key}"`);
      writeLine(`taughtIn "${node.taughtIn}"`);
      writeLine(`newspaperFrequencyRank ${node.newspaperFrequencyRank}`);
      writeLine(`meaning "${node.meaning}"`);
      writeLine(`strokeCount ${node.strokeCount}`);
      writeLine(`jlptLevel "${node.jlptLevel}"`);
      tabs -= 1;
      writeLine(']');
    });

    // formato de las aristas
    edges.forEach((edge, key) => {
      writeLine('edge [');
      tabs += 1;
      const edgeNodes = key.split(', ');
      writeLine(edgeNodes[0]);
      writeLine(edgeNodes[1]);
      writeLine(`value ${edge.length}`);
      writeLine(`sharedParts "${edge}"`);
      tabs -= 1;
      writeLine(']');
    });
    tabs -= 1;
    writeLine(']');
  };

  partsToKanjis.forEach((partData, key) => {
    computeEdgesFromPart(key, partData);
  });
  dumpToFile(`kanji-list-${data.length}.gml`);
};


main()
  .then(() => console.log('¡Grafo generado con éxito!'))
  .catch(_ => console.log('Hubo un error al generar el grafo'));