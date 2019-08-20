
// predefined constants
const TEMPLATE_PATH = "./templates";

const httpRequest = require("request-promise-native");
const bunyan = require("bunyan");
const fs = require("fs");
const HumanApiClient = require("./lib/humanapi-client");
const transform = require("./lib/transform");
const render = require("./lib/render-handlebars")(TEMPLATE_PATH);
const load = require("./lib/load");
const program = require('commander');
const pkg = require("./package.json");



const log = bunyan.createLogger({
  name : "hapi-client",
  level : "info"
})

const client = new HumanApiClient({
  httpRequest,
  log : log.child({ client : "1"}),
  baseUrl : "https://api.humanapi.co/v1/human"
})



program
  .version(pkg.version)
  .option('-t, --token <token>', 'Human API access token')
  .option('-o, --out <filename>', 'Path to the output HTML file. Will use stdout if not provided');

program.parse(process.argv);

load(client,program.token)
.then(feed=>transform(client,program.token,feed))
.then(render)
.then(html=>(program.out?fs.writeFileSync(program.out,html):console.log(html)));
