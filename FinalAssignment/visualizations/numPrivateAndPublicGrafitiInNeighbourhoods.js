var w = 600;
 var h = 400;
 var padding = 80;
 var dataset = [];

 d3.csv("totalPublicAndPrivateGrafitis.csv", function(error, data) {
     if (error) {
         console.log(error);
     } else {
         dataset = data.map(function(d) {
             return d;
         });
         //since csv files set everything to str, we convert the a proprate to num
         for (i = 0; i < dataset.length; i++) {
             //dataset[i]["VEHICLE THEFT"] = Number(dataset[i]["VEHICLE THEFT"]);
             //dataset[i]["PROSTITUTION"] = Number(dataset[i]["PROSTITUTION"]);
         }
         console.log(dataset);

     }

 });
