var router = require('express').Router();
var request = require('request');
const spotify = {
  client_id: "a9fce766bc2b4d86af725fad719c8fe6",
  client_secret: "bb6d24a85a384173959534c464a944c5"
}

'use strict'


// module.exports = function(topten, tags, callback){
//     var increment = 0;
//     for (var i = 0; i < topten.length; i++) {
//       request({
//               headers: {'ocp-apim-subscription-key': 'a4c7815f3c0f408b86991eb9c4e92fdb'},
//               method: "POST",
//               json: true,
//               url: "https://westus.api.cognitive.microsoft.com/vision/v1.0/analyze?visualFeatures=Tags",
//               body: {"url": topten[i].url}
//           }, response.bind(topten[i]));
//     }

//     function response(e, r, body){
//       //console.log(r);
//         this.tags = body.tags;
//         if(body.tags){
//             body.tags.forEach(function(tag){
//                 if (!tags.has(tag)){
//                     tags.add(tag.name);
//                 }
//             })
//         }
//         increment++;
//         if (increment === topten.length) {
//           callback();
//         }
//     }
// };

router.use('/auth', function(req,res){
  request({
    method: "POST",
    url: "https://accounts.spotify.com/api/token?grant_type=client_credentials",
    headers: {
      'Authorization': "Basic YTlmY2U3NjZiYzJiNGQ4NmFmNzI1ZmFkNzE5YzhmZTY6YmI2ZDI0YTg1YTM4NDE3Mzk1OTUzNGM0NjRhOTQ0YzU="
    }
  }, function(error, response) {
    if (!error && response.statusCode == 200) {
    //if no error

    console.log(response);
    res.send(response);
    }else{
      console.log("error", response.statusCode);
    }
  });
})

module.exports = router;