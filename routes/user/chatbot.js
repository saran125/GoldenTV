import http from 'http';
import { io } from "socket.io-client";
import nlp from 'node-nlp';
import { Router } from 'express';
const router = Router();
export default router;

var v = (http).createServer(router);
var i = (io)(v);      //chat application

async function botstr(findStr){
      var { NlpManager } = (nlp);       //natural language processing for chatbot
      const manager = new NlpManager({ languages: ['en'], nlu: { useNoneFeature: false }});
      //train the chatbot
      manager.addDocument('en', 'goodbye for now', 'greetings.bye');
      manager.addDocument('en', 'bye bye take care', 'greetings.bye');
      manager.addDocument('en', 'okay see you later', 'greetings.bye');
      manager.addDocument('en', 'bye for now', 'greetings.bye');
      manager.addDocument('en', 'i must go', 'greetings.bye');

      manager.addDocument('en', 'hello', 'greetings.hello');
      manager.addDocument('en', 'hi there', 'greetings.hello');
      manager.addDocument('en', 'hello', 'greetings.hello');
      manager.addDocument('en', 'howdy', 'greetings.hello');
      manager.addDocument('en', 'hiya', 'greetings.hello');
      manager.addDocument('en', 'hi-ya', 'greetings.hello');
      manager.addDocument('en', 'howdy-do', 'greetings.hello');
      manager.addDocument('en', 'aloha', 'greetings.hello');
      manager.addDocument('en', 'hey', 'greetings.hello');

      manager.addDocument('en', 'good day', 'greetings.goodDay');
      manager.addDocument('en', 'good night', 'greetings.goodNight');
      manager.addDocument('en', 'good morning', 'greetings.goodMorning');
      manager.addDocument('en', 'good evening', 'greetings.goodevening');
      manager.addDocument('en', 'good afternoon', 'greetings.goodafternoon');

      manager.addDocument('en', "my name is ", 'user.details');

      manager.addDocument('en', "What is your you name details ?", 'my.name');
      manager.addDocument('en', "How shall I call you ?", 'my.name');
      manager.addDocument('en', "Where do you live ?", 'my.address');
      manager.addDocument('en', "Who are you", 'my.me');

      manager.addDocument('en', "Play music songs", 'songs.list');

      manager.addDocument('en', "Read books", 'books.list');
      manager.addDocument('en', "Read novels", 'books.list');

      manager.addDocument('en', "TED talks", 'ted.list');
      manager.addDocument('en', "ted talks", 'ted.list');
      manager.addDocument('en', "ted shows", 'ted.list');
      manager.addDocument('en', "ted seminars", 'ted.list');

      manager.addDocument('en', "boredom", 'bored');
      manager.addDocument('en', "I am getting bored", 'bored');
      manager.addDocument('en', "I am feeling bored", 'bored');
      manager.addDocument('en', "I am not feeling to do anything", 'bored');
      manager.addDocument('en', "I am feeling low", 'bored');
      manager.addDocument('en', "I am not feeling high", 'bored');

      manager.addDocument('en', "Movies watch cinema", 'movies');

      manager.addDocument('en', "What's the weather today", 'weather');
      manager.addDocument('en', "Climate", 'weather');
      manager.addDocument('en', "will it rain today", 'weather');
      manager.addDocument('en', "is it shiny today", 'weather');
      manager.addDocument('en', "sunny day", 'weather');

      manager.addDocument('en', "latest tech news", 'TechNews');
      manager.addDocument('en', "technical news", 'TechNews');
      manager.addDocument('en', "technological news", 'TechNews');

      manager.addDocument('en', "latest Startup news", 'Startupnews');
      manager.addDocument('en', "Startups", 'Startupnews');

      manager.addDocument('en', "latest corporate news", 'corporatenews');
      manager.addDocument('en', "business news", 'corporatenews');
      manager.addDocument('en', "companies news", 'corporatenews');
      manager.addDocument('en', "economy news", 'corporatenews');

      manager.addDocument('en', "latest Internet news", 'Internet');
      manager.addDocument('en', "Social media scams", 'Internet');
      manager.addDocument('en', "marketing today", 'Internet');
      manager.addDocument('en', "photos, videos", 'Internet');

      manager.addDocument('en', "Mobiles news", 'Mobiles');
      manager.addDocument('en', "iphone", 'Mobiles');
      manager.addDocument('en', "apple samsung nokia oneplus lenovo news", 'Mobiles');

      manager.addDocument('en', "weekly news newsletter", 'WeeklyNews');
      manager.addDocument('en', "News today", 'WeeklyNews');

      manager.addDocument('en', "People in the news", 'peopleNews');
      manager.addDocument('en', "celebrities celebs celebrity in the news", 'peopleNews');
      manager.addDocument('en', "public death murder in the news", 'peopleNews');
      manager.addDocument('en', "forbes under 30 in the news", 'peopleNews');

      manager.addDocument('en', "Cricket live score", 'CricketLiveScore');
      manager.addDocument('en', "football live score", 'footballLiveScore');

      manager.addDocument('en', "facts new fact interesting", 'fact');
      manager.addDocument('en', "share markets stocks prices", 'moneycontrol');
      manager.addDocument('en', "market info money control moneycontrol", 'moneycontrol');
      manager.addDocument('en', "convert INR Rupees to dollars", 'currencyConvert');
      manager.addDocument('en', "convert euros yen currency conversion", 'currencyConvert');
      manager.addDocument('en', "franc pound krona sterling peso rand krone baht ruble cent dong", 'currencyConvert');


      manager.addDocument('en', "Search restaurants nearby places", 'gSearch');
      manager.addDocument('en', "history historical monuments", 'gSearch');
      manager.addDocument('en', "google search", 'gSearch');


      //***********************************************************************************//
      //************************************************************************************//
      //************************************************************************************//
      //************************************************************************************//
      //************************************************************************************//
      //************************************************************************************//
      //************************************************************************************//
      // Train also the NLG..........Train it to answer
      manager.addAnswer('en', 'gSearch', '<div><form action="https://www.google.com/search" method="GET" target="_blanck"><input type="text" name="q" placeholder="Google Search" autocomplete="off"><input type="submit" value="Google Search"></form></div>');

      manager.addAnswer('en', 'currencyConvert', '<!--Begin Currency Converter Code--><div id="FEXRdivResp" data-pym-src="//www.foreignexchangeresource.com/currency-converter.php?c=EUR&a=USD&amt=1&panel=1&button=2&headertxtcolor=3E3E3E&resulttxtcolor=990000&bgcolor=FFFFFF&bordercolor=DDDDDD&titleboxtop=F5F5F5&titleboxbottom=E8E8E8&corners=&fontstyle=Arial%2C+Helvetica%2C+sans-serif"></div><script type="text/javascript" src="//www.foreignexchangeresource.com/js/pym.min.js"></script><!--End Currency Converter Code-->');
      manager.addAnswer('en', 'fact', '<script type="text/javascript" id="WolframAlphaScript1c37dd24e1b07a3ed23c6c4ba01540ad" src="//www.wolframalpha.com/widget/widget.jsp?id=1c37dd24e1b07a3ed23c6c4ba01540ad"></script>');
      manager.addAnswer('en', 'moneycontrol', '<a class="fx-widget" data-widget="crypto-market-movers" data-lang="en" data-crypto-type="coins" data-primary-text-color="#333333" data-secondary-text-color="#999999" data-border-color="#d8d8d8" data-background-color="#ffffff" data-header-background-color="#eeeeee" data-header-text-color="#333333" data-drop-down-title-color="#333333" data-drop-down-text-color="#a3a3a3" data-drop-down-border-color="#d8d8d8" data-width="775" data-height="560" data-chart data-full-view data-url="//www.fxempire.com" href="https://www.fxempire.com" rel="nofollow" style="font-family:Helvetica;font-size:16px;line-height:1.5;text-decoration:none;"> <span style="color:#999999;display:inline-block;margin-top:10px;font-size:12px;">Powered By </span> <img style="width:87px; height:14px;" src="https://www.fxempire.com/logo-full.svg" alt="FX Empire logo" /> </a> <script async charset="utf-8" src="https://widgets.fxempire.com/widget.js" ></script>');

      manager.addAnswer('en', 'CricketLiveScore', 'Here is what I found:<br><iframe width="70%" height="auto" src="https://www.crictimes.org/widget/live" frameborder="0"></iframe>');
      manager.addAnswer('en', 'footballLiveScore', 'Here is what I found:<br><iframe width="70%" height="auto" src="https://footystats.org/api/club?id=5" frameborder="0"></iframe>');

      manager.addAnswer('en', 'TechNews', 'Here is what I found:<br><iframe width="70%" height="auto" src="https://tech.economictimes.indiatimes.com/widget/technology" frameborder="0"></iframe>');
      manager.addAnswer('en', 'Startupnews', 'Startups News:<br><iframe width="70%" height="auto" src="https://tech.economictimes.indiatimes.com/widget/startups" frameborder="0"></iframe>');
      manager.addAnswer('en', 'corporatenews', 'Corporate news is addicting:<br><iframe width="70%" height="auto" src="https://tech.economictimes.indiatimes.com/widget/corporate" frameborder="0"></iframe>');
      manager.addAnswer('en', 'Internet', 'Quite a lot of internet News:<br><iframe width="70%" height="auto" src="https://tech.economictimes.indiatimes.com/widget/internet" frameborder="0"></iframe>');
      manager.addAnswer('en', 'Mobiles', 'Mobile news:<br><iframe width="70%" height="auto" src="https://tech.economictimes.indiatimes.com/widget/mobile" frameborder="0"></iframe>');
      manager.addAnswer('en', 'WeeklyNews', 'Weekly newsletter:<br><iframe width="70%" height="auto" src="https://tech.economictimes.indiatimes.com/widget/" frameborder="0"></iframe>');
      manager.addAnswer('en', 'peopleNews', 'People:<br><iframe width="70%" height="auto" src="https://tech.economictimes.indiatimes.com/widget/people" frameborder="0"></iframe>');


  manager.addAnswer('en', 'weather', '<!-- weather widget start --><a target="_blank" href="https://www.nea.gov.sg/weather"><img src="https://www.nea.gov.sg/images/default-source/default-album/new-nea-corpwebsite-infographics-weather-worldforecast.jpg"  alt="booked.net"/></a><!-- weather widget end -->');

      manager.addAnswer('en', 'movies', '<a href="https://www.youtube.com/watch?v=9Wsvr6dSK4g" target="_blanck">PK</a> is a nice movie.');
      manager.addAnswer('en', 'movies', 'No matter what. <a href="https://www.youtube.com/watch?v=1FT6VOrFMLo" target="_blanck">Phir Hera Pheri</a> will always make you laugh.');
      manager.addAnswer('en', 'movies', 'You can consider a subscription to <a href="https://www.primevideo.com/" target="_blanck">Prime Video</a>. Many people in your country have it');
      manager.addAnswer('en', 'movies', 'You can subscribe to <a href="https://www.netflix.com/in/" target="_blanck">Netflix</a>. It is quite popular in your city');

      manager.addAnswer('en', 'greetings.bye', 'Till next time :)');
      manager.addAnswer('en', 'greetings.bye', 'see you soon!');
      manager.addAnswer('en', 'greetings.bye', 'ok fk off');
      manager.addAnswer('en', 'greetings.hello', 'Hey there!');
      manager.addAnswer('en', 'greetings.hello', 'Greetings!');
      manager.addAnswer('en', 'greetings.hello', 'Hey buddy!');

      manager.addAnswer('en', 'greetings.goodNight', 'Good Night.');
      manager.addAnswer('en', 'greetings.goodDay', 'Good Day!');
      manager.addAnswer('en', 'greetings.goodMorning', 'Have a very happy Morning!');
      manager.addAnswer('en', 'greetings.goodevening', 'Good evening.');
      manager.addAnswer('en', 'greetings.goodafternoon', 'Good afternoon.');

      manager.addAnswer('en', 'user.details', 'Nice to know that!');

      manager.addAnswer('en', 'my.name', 'I prefer to be called saran :)');
      manager.addAnswer('en', 'my.address', 'I live in this beautiful world created by nature');
      manager.addAnswer('en', 'my.me', 'I am a friend of yours.');

      manager.addAnswer('en', 'songs.list', '<a href="https://www.insider.com/best-life-changing-songs-2017-4" target="_blanck">Here</a> is a list.<br>These can be easily found on <a href="https://www.youtube.com/" target="_blanck">youtube</a>.');
      manager.addAnswer('en', 'songs.list', '<a href="https://www.youtube.com/watch?v=mWRsgZuwf_8" target="_blanck">This</a> song will make you a fan of Imagine Dragons.<br>I personally like it :)');
      manager.addAnswer('en', 'songs.list', 'Although, <a href="https://www.youtube.com/watch?v=JGwWNGJdvx8" target="_blanck">this</a> song is old, but old is Gold! This song is a beauty :)');
      manager.addAnswer('en', 'songs.list', 'I donno, why do I keep listening to <a href="https://www.youtube.com/watch?v=4fndeDfaWCg" target="_blanck">this</a> song.');
      manager.addAnswer('en', 'songs.list', 'Did you listen <a href="https://www.youtube.com/watch?v=sx5PJyzGEpc" target="_blanck">On my way</a> by Alan Walker?');
      manager.addAnswer('en', 'books.list', '<a href="https://sak1sham.github.io/Books.html" target="_blanck">Check this out</a>.<br>This page provides a nice list of books.');
      manager.addAnswer('en', 'ted.list', '<a href="https://sak1sham.github.io/ExternalLinks.html" target="_blanck">Here</a>is a list of my favourite TED talks.<br>This page has a list of TED shows.<br> You may also consider to follow TED <a href = "https://www.youtube.com/channel/UCsT0YIqwnpJCM-mx7-gSA4Q" target="_blanck">Youtube channel</a>');

      manager.addAnswer('en', 'bored', 'Boredom fears knowledge. Check <a href = "https://sak1sham.github.io/" target="_blanck">this</a> out.');
      manager.addAnswer('en', 'bored', 'Some riddles will keep you high. Check <a href = "https://www.riddles.com/good-riddles" target="_blanck">this</a> out.');

      await manager.train();
      manager.save();
      var response = await manager.process('en', findStr);
      console.log(response);
      //console.log(typeof(response.answer));
      return response.answer;
}

//serve the static html files

//events emitters
i.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
      console.log('user disconnected');
  });
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    i.emit('chat message', msg);
    botstr(msg)
        .then(result => {
            if(result == null){
              i.emit('chat message', "Sorry :( Donno.<br>1. Search Songs<br>2. Try searching facts<br>3.TED talks will grow you");
            }
            else{
              i.emit('chat message', result);
            }
        });

  });
});