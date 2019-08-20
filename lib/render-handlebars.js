const {readFileSync} = require("fs");
const Handlebars = require("handlebars");
require('handlebars-helpers')({
  handlebars: Handlebars
})


/**
 * rendering - description
 *
 * @param  {String} templatePath path to the template directory
 * @return {Function}              a rendering function
 */
function rendering(templatePath){

  const rootTemplate = Handlebars.compile(readFileSync(templatePath+"/chart.html").toString());

  const partialConfig = {
    "encounter" : "/encounter.html",
    "testResult" : "/testResult.html",
    "procedure" : "/procedure.html",
    "vitalSigns" : "/vitalSigns.html",
    "labs" : "/labs.html",
    "rx" : "/rx.html",
    "medicalProfile" : "/medicalProfile.html"
  }

  Object.entries(partialConfig)
  .forEach(([name,path])=>{
    const source = readFileSync(templatePath+path).toString();
    Handlebars.registerPartial(name,source);
  });

  /**
   * Renders a data feed into a HTML page
   *
   * @param  {Array} objects         description
   * @param  {Object} medicalProfile  the patient's medical profile
   * @return {String}                 a string containing HTML output
   */
  function render({objects , medicalProfile }){
    return rootTemplate({ objects , medicalProfile })
  }

  return render;

}

module.exports = rendering;
