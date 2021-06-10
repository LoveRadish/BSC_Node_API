'use strict';
const WebSocket = require('ws')
const https = require('https');
const { response } = require('express');
var request = require('request');

// var mongoose = require('mongoose'),
//   Task = mongoose.model('Tasks');

// exports.list_all_tasks = function(req, res) {
//   Task.find({}, function(err, task) {
//     if (err)
//       res.send(err);
//     res.json(task);
//   });
// };
// exports.list_all_tasks = function(req, res) {
//   var returndata = null;
//   var options = {
//     'method': 'GET',
//     'url': 'https://dex.binance.org/api/v1/klines?symbol=NNB-338_BNB&interval=5m',
//     'headers': {
//     }
//   };
//   request(options, function (error, response) {
//     if (error) throw new Error(error);
//     console.log(response.body);
//     returndata = response.body
//   });
//   res.json(returndata)
// }

exports.list_all_transfers = function(req, res) {
      const conn = new WebSocket("wss://dex.binance.org/api/ws");
      conn.onopen = function(evt) {
          conn.send(JSON.stringify({ method: "subscribe", topic: "kline_15m", symbols: ["BNB_BTCB-1DE"] }));
          var address = req.params[0];

          https.get('https://api.bscscan.com/api?module=account&action=txlist&address='+ address +'&startblock=1&endblock=99999999&sort=desc&apikey=J21VFNWHAS2GZERFXAT4BHJPV5RADG5VTQ', (resp) => {
            let data = '';
          
            resp.on('data', (chunk) => {
              data += chunk;
              res.write(data);
            });
          
            resp.on('end', () => {
              var data_object = JSON.parse(data);
              console.log(data_object.result.length);
              res.end();
            });
          
          }).on("error", (err) => {
            console.log("Error: " + err.message);
          });
      }
      conn.onmessage = function (event) {
        //console.log('=========',event.data)
        //res.json(event.data)
      }
      conn.onclose = function(e) {
        console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
        // setTimeout(function() {
        //   list_all_transfers();
        // }, 5000);
      };
      conn.onerror = function(err) {
        console.error('Socket encountered error: ', err.message, 'Closing socket');
        conn.close();
      };
};

