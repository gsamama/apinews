const PORT = 80;

const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

const newspapers = [
  {
    name: 'Times',
    address: 'https://www.thetimes.co.uk/environment',
    base: ''
  },
  {
    name: 'Guardian',
    address: 'https://www.theguardian.com/environment/climate-crisis',
    base: ''
  },
  {
    name: 'Telegraph',
    address: 'https://www.telegraph.co.uk/climate-change/',
    base: 'https://www.telegraph.co.uk'
  },
  {
    name: 'CNN', 
    address:'https://edition.cnn.com/specials/world/cnn-climate',
    base: 'https://www.cnn.com'
  }
  
];




newspapers.map(newspaper=>{
  
  axios.get(newspaper.address)
    .then((axiosResponse)=>{
      const html = axiosResponse.data;
      const $ = cheerio.load(html);
      if(newspaper.name==='Guardian') {
        $('h3.fc-item__title', html).each(function(){
          const title = $(this).text().trim();
          const url = ($(this).find('a').attr('href').indexOf('http')!==-1)? $(this).find('a').attr('href') :  newspaper.base + $(this).find('a').attr('href');
          const source = newspaper.name;
          articles.push({title, url, source});
        });
      }
      if(newspaper.name==='Times') {
        $('a > h3', html).each(function(){
          const title = $(this).text().trim();
          const url = newspaper.base + $(this).parent().attr('href');
          const source = newspaper.name;
          articles.push({title, url, source});
        })
      }
      if(newspaper.name==='Telegraph') {
        $('a.list-headline__link', html).each(function(){
          const title = $(this).text().trim();
          const url = ($(this).attr('href').indexOf('http')!==-1)? $(this).attr('href') : newspaper.base+$(this).attr('href');
          const source = newspaper.name;
          articles.push({title, url, source});
        })
      }
      if(newspaper.name==='CNN') {
        $('h3 > a', html).each(function(){
          const title = $(this).text().trim();
          const url = ($(this).attr('href').indexOf('http')!==-1)? $(this).attr('href') : newspaper.base + $(this).attr('href');
          const source = newspaper.name;
          if(title.indexOf('Instagram')===-1) articles.push({title, url, source});
        })
      }
    })
    .catch(e=>console.log(e));
})

const articles = [];

app.get('/', (req, res, next)=>{
  res.json('Welcome to News API for Climate news');
})

app.get('/news', (req, res, next)=>{
  res.json(articles);
})
app.get('/news/:newspaperId', async (req, res, next)=>{
  const filtered = articles.filter(item=> item.source.toLowerCase() === req.params.newspaperId.toLowerCase());
  res.json(filtered);
})
app.listen();
//app.listen(PORT, ()=>console.log(`running at port ${PORT}`))