
const axios = require('axios');
const cheerio = require('cheerio');
const fsPromises = require('fs/promises');


const BASE_URL = "https://linkez.in/mosaicoigreja";

async function scraping() {
  try {
    const last_file = JSON.stringify(require(__dirname+'/links.json'));
    const json_read = JSON.parse(last_file);
    const last_call = json_read['lastcall'];
    const now = Date.now();
    const timelapse = ( now - (1*last_call));
    console.log('diff:'+timelapse);
    console.log(parseInt(timelapse/1000)+ ' segundos');
    console.log(parseInt(timelapse/60000)+ ' minutos e ' +  parseInt((timelapse % 60000)/1000)+ ' segundos');

    if (timelapse > 60){ //1 minutes
      try {
        const response = await axios.get(`${BASE_URL}`);
        const $ = cheerio.load(response.data);
        const html_src = $('#__NEXT_DATA__').text();
        const json = JSON.parse(html_src);
        const obj = json['props']['pageProps']['data']['links'];
        const links = obj.map(function(item){
          const nlink = '{"title": "' + item['title'] + '", "subtitle": "' + item['subtitle'] + '", "url": "' + item['url'] + '", "icon": "' + item['icon']+'"}'; //retorna o item original elevado ao quadrado
          return nlink;
       });
       const data = '{"lastcall": '+ Date.now() + ', "links": [' +  links.toString() +']}';
       console.log(data);
        await fsPromises.writeFile(__dirname+'/links.json', data);
        console.log("JSON data is saved.");
      } catch (err) {
        console.log(err);
      }
    }
  } catch (err) {
    console.log(err);
  }
    
}



scraping();