CALCULATOR = require("./calculator.js");

var roll = (msg, pretags) => {
  function eval_die(str){
    var dmaxd = ["drop_max", "drop_max_die", "dropmax", "dropmaxdie", "drop_max;", "drop_max_die;", "dropmax;", "dropmaxdie;"];
    var dmind = ["drop_min", "drop_min_die", "dropmin", "dropmindie", "drop_min;", "drop_min_die;", "dropmin;", "dropmindie;"];
    if(dmaxd.indexOf(str) >= 0) return [ "DropMaxDie; " ];
    if(dmind.indexOf(str) >= 0) return [ "DropMinDie; " ];

    var temp = str.split("d");
    if(temp.length == 2 && (!isNaN(parseInt(temp[0])) || temp[0] == "") && !isNaN(parseInt(temp[1]))){
      return [ temp[0]==""?1:(parseInt(temp[0]) > 20000?20000:parseInt(temp[0])), parseInt(temp[1])>9999?9999:parseInt(temp[1])<-9999?-9999:parseInt(temp[1]) ];
    } 
    return [ str ];
  }
  function eval_dice(str){
    try {
      //PASO 1: De string a array
      var valarr0 = CALCULATOR.arrayfy(str);
      
      //PASO 2: Procesar por el eval_die
      var valarr1 = new Array;
      for(var i of valarr0)
        valarr1.push(eval_die(i));
      
      //PASO 3: De eval die a valores reales
      var valarr2 = new Array;
      var dropmax = false,     dropmin = false;
      var maxdice = -Infinity, mindice = Infinity;
      for(var i of valarr1){
        if(i.length == 1){
          if(i[0] == "DropMaxDie; ") dropmax = true;
          else if(i[0] == "DropMinDie; ") dropmin = true;
          else valarr2.push(i[0]);
        } else {
          valarr2.push("(");
          var first = true;
          for(var x = 0; x < parseInt(i[0]); ++x){
            var value = parseInt(Math.random() * i[1])+1;
              if(maxdice < value) maxdice = value;
              if(mindice > value) mindice = value;
              if(!first) valarr2.push("+");
              valarr2.push(""+value);
              first = false;
          }
          valarr2.push(")");
        }
      }

      //PASO 4: Procesado
      var valarr3 = CALCULATOR.stack_computation(valarr2);

      //PASO 5: String de interptretación
      var interpretado = "he interpretado eso como:\n```\n";
      for(var i of valarr1){
        if(i.length == 1) interpretado += i[0] + " ";
        else interpretado += i[0] + "d" + i[1] + " ";
      }
      interpretado += "\n```\n";    
      //PASO 6: String de resultados
      var resultados = "Resultados: \n```\n";
      for(var i of valarr2)
        resultados += i + " ";
      resultados += "\n```\n";

      //PASO 7: String de resultado
      var RES = "Resultado: \n```\n" + valarr3 + "\n```";

      if( (interpretado+resultados+RES).length > 2000 ) return interpretado+RES;
      else return interpretado+resultados+RES;
    } catch(e) {
      return "No he entendido eso.\n" + e.toString();
    }
  }
  
  var CO = msg.content;
  for(var pretag of pretags) {
    if(CO.toLowerCase().indexOf(pretag.toLowerCase()) == 0){
      var out = eval_dice( CO.toLowerCase().replace(pretag.toLowerCase(), "") );
      msg.reply( out );
      return { executed: true, result: out };
    }
  }
  return { executed: false };
}
  
module.exports = roll;
