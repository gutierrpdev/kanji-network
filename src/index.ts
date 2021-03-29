import JishoApi, { KanjiParseResult } from 'unofficial-jisho-api';
const jisho = new JishoApi();

const searchForKanji = (kanji: string, onKanjiFound: (res: KanjiParseResult) => void) => {
  const result = jisho.searchForKanji(kanji)
  .then(res => {
    onKanjiFound(res);
  })
  .catch(error => {
    console.log(`There was a problem while searching for kanji ${kanji}`);
  });
};

searchForKanji('語', (res) => {
  console.log(res);
});


/*
  console.log('Found: ' + result.found);
  console.log('Taught in: ' + result.taughtIn);
  console.log('JLPT level: ' + result.jlptLevel);
  console.log('Newspaper frequency rank: ' + result.newspaperFrequencyRank);
  console.log('Stroke count: ' + result.strokeCount);
  console.log('Meaning: ' + result.meaning);
  console.log('Kunyomi: ' + JSON.stringify(result.kunyomi));
  console.log('Kunyomi example: ' + JSON.stringify(result.kunyomiExamples[0]));
  console.log('Onyomi: ' + JSON.stringify(result.onyomi));
  console.log('Onyomi example: ' + JSON.stringify(result.onyomiExamples[0]));
  console.log('Radical: ' + JSON.stringify(result.radical));
  console.log('Parts: ' + JSON.stringify(result.parts));
  console.log('Stroke order diagram: ' + result.strokeOrderDiagramUri);
  console.log('Stroke order SVG: ' + result.strokeOrderSvgUri);
  console.log('Stroke order GIF: ' + result.strokeOrderGifUri);
  console.log('Jisho Uri: ' + result.uri);
*/