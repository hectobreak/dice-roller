var CALCULATOR = new Object;

var OP = new Object;
OP["_"]   = { prec: 6, ass: "L", op: function(a, b){ if(!a)return b; if(!b)return a; return Math.min(a, b);    } };
OP["·"]   = { prec: 6, ass: "L", op: function(a, b){ if(!a)return b; if(!b)return a; return Math.max(a, b);    } };
OP["l"]   = { prec: 5, ass: "L", op: function(a, b){ if(!a)a = 1; if(!b)b = 1; return Math.log(a)/Math.log(b); } };
OP["^"]   = { prec: 4, ass: "R", op: function(a, b){ if(!a)a = 1; if(!b)b = 1; return Math.pow(a, b);          } };
OP["*"]   = { prec: 3, ass: "L", op: function(a, b){ if(!a)a = 1; if(!b)b = 1; return a*b;                     } };
OP["/"]   = { prec: 3, ass: "L", op: function(a, b){ if(!a)a = 1; if(!b)b = 1; return a/b;                     } };
OP["+"]   = { prec: 2, ass: "L", op: function(a, b){ if(!a)a = 0; if(!b)b = 0; return a+b;                     } };
OP["-"]   = { prec: 2, ass: "L", op: function(a, b){ if(!a)a = 0; if(!b)b = 0; return a-b;                     } };
OP["("]   = { prec: 1, ass: "L" };
OP[")"]   = { prec: 1, ass: "L" };
OP["×"]   = OP["*"];
OP["÷"]   = OP["/"];
OP["−"]   = OP["-"];

function compare_symbols(s_new, s_old){
  return OP[s_new].prec < OP[s_old].prec || (OP[s_new].prec == OP[s_old].prec && OP[s_old].ass == "L");
}
function translate(arr){
  var OUTPUT = new Array;
  var OP_STK = new Array;
  for(var x of arr){
    if(x == "("){
      OP_STK.push("(");
    } else if(x == ")"){
      while(OP_STK.length > 0 && OP_STK[OP_STK.length-1] != "("){
        var k = OP_STK.pop();
        OUTPUT.push(k);
      }
      if(OP_STK.length == 0) throw new Error("¡Paréntesis desequilibrados!");
      else OP_STK.pop();
    } else if(OP[x] != undefined) {
      if(OP_STK.length > 0){
        while(OP_STK.length > 0 && compare_symbols(x, OP_STK[OP_STK.length-1])){
          var k = OP_STK.pop();
          OUTPUT.push(k);
          if(OP_STK.length > 0){
          }
        }
      }
      OP_STK.push(x);
    } else {
      OUTPUT.push(x);
    }
  }
  while(OP_STK.length > 0) OUTPUT.push(OP_STK.pop());
  return OUTPUT;
}

function eval_stack(stk){
  var stack = new Array;
  for(var i of stk){
    if(OP[i] != undefined){
      var b = stack.pop();
      var a = stack.pop();
      stack.push(""+OP[i].op(parseFloat(a), parseFloat(b)));
    } else stack.push(i);
  }
  return stack.pop();
}

CALCULATOR.stack_computation = function(arr){
  return eval_stack(translate(arr));
}

CALCULATOR.arrayfy = function(str){
  var ret = new Array;
  var temp = "";
  for(var i of str){
    if(OP[i] != undefined){
	  if(temp == "e") temp = "2.71828182845904";
	  if(temp == "pi" || temp == "π") temp = "3.14159265358979323";
      if(temp.length != 0) ret.push(temp);
      ret.push(i);
      temp = "";
    } else if(i != " ")temp += i;
  }
  if(temp == "e") temp = "2.71828182845904";
  if(temp == "pi" || temp == "π") temp = "3.14159265358979323";
  if(temp.length != 0) ret.push(temp);
  return ret;
}

module.exports = CALCULATOR;
