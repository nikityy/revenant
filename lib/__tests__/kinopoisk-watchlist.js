const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);

const { parseWatchlistFromHtml } = require('../kinopoisk-watchlist');

describe('parseWatchlistFromHtml', () => {
  test('should correctly parse watchlist', async () => {
    const htmlPath = path.join(__dirname, 'kinopoisk-movies-list.html');
    const html = await readFile(htmlPath, { encoding: 'utf8' });
    const watchlist = await parseWatchlistFromHtml(html);

    expect(watchlist).toMatchSnapshot();
  });
});
