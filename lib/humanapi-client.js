const primitives = {
  "medications" : "/medical/medications",
  "testResults" : "/medical/test_results",
  "vitalSigns" : "/medical/vitals",
  "encounters" : "/medical/encounters",
  "instructions" : "/medical/instructions",
  "procedures" : "/medical/procedures",
}

class ApiDataObject{
  constructor(client, accessToken, data){
    Object.assign(this,data);
    // Object.entries(data).forEach(([k,v])=>{
    //   // all links are replaced by a getter
    //   if (v && v.href){
    //     delete this[k];
    //     Object.defineProperty(this,k,{
    //       enumerable : true,
    //       get : ()=>client.getObject(v.href,accessToken)
    //     })
    //     // this["get_"+k] = client.getObject.bind(client,v.href);
    //   } else {
    //     this[k] = v;
    //   }
    // });
  }
}


class HumanApiClient {
  constructor(options) {
    const {
      httpRequest,
      log,
      baseUrl = "https://api.humanapi.co/v1"
     } = options;
    this.httpRequest = httpRequest;
    this.baseUrl = baseUrl;
    this.log = log;

    Object.entries(primitives).forEach(([name,uri])=>{
      this[name] = this.getObjects.bind(this,uri);
    })
    this.medicalProfile = this.getObject.bind(this,"/medical/profile");

    // this.medications = this.getObjects.bind(this,"/medical/medications")
  }


  /**
   * issues a request to the API
   *
   * This is a low level function
   *
   * @param  {String} uri         description
   * @param  {String} accessToken description
   * @param  {Boolean} json = true description
   * @return {Object}             description
   */
  async _apiRequest(uri, accessToken , json = true){
    const { httpRequest , baseUrl, log } = this;
    const opts = {
      method : "GET",
      baseUrl,
      uri,
      json,
      headers : {
        'Authorization': 'Bearer ' + accessToken
      },
      // resolveWithFullResponse : true
    }
    log.debug(opts,"request");
    var body = await this.httpRequest(opts);
    return {
      body
    };
  }

  async getObject(uri, accessToken, json = true){
    let { body } = await this._apiRequest(uri,accessToken,json);
    return new ApiDataObject(this, accessToken, body);
  }

  async *getObjects(uri, accessToken , json = true){
    let done = false;
    let offset = 0;
    while (!done){
      let { body } = await this._apiRequest(uri+'?offset='+offset,accessToken,json);
      for (var i = 0 ; i < body.length ; i++){
        yield new ApiDataObject(this, accessToken, body[i]);
      }
      done=body.length<50;
      offset+=50;
    }

  }
}

module.exports = HumanApiClient;
