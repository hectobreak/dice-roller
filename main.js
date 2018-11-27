var client = require("./dicer_credentials.js");
var roll   = require("./roll_command.js");

client.on('ready', () => {
  console.log("I'm ready!");
});

var roll_prefixes = ["roll:", "roll", "calc:", "calc"];

function clean_output(outstr){
  return outstr.replace(/```\n|```/, "  ").replace(/```\n|```/, "").replace(/```\n|```/, "  ").replace(/```\n|```/, "").replace(/```\n|```/, "  ").replace(/```\n|```/, "");
}

client.on('message', async msg => {
  /* msg.author.id       => Identificador de usuario.
   * msg.author.username => Nombre de usuario.
   * msg.content         => Contenido del mensaje.
   * msg.channel         => Canal por el que se ha enviado el mensaje.
   * Para más cosas, mirar la documentación de Discord.js.
   */
  if(msg.author.id == client.user.id) return; // Para que no se lea a él mismo.
  
  var userRoll = roll(msg, roll_prefixes);
  if( userRoll.executed ) {
	console.log(msg.author.username + ", " + clean_output( userRoll.result ));
  }
  
});
