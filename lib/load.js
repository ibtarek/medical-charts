async function load(client, accessToken) {
  const proms = [
    // "medications",
    "testResults",
    "vitalSigns",
    "encounters",
    "procedures",
    "medications"]
  .map((k)=>[k,client[k](accessToken)])
  .map(async ([k,iterator])=>{
    const objects=[];
    for await (const obj of iterator) {
      objects.push(Object.assign(obj,{ dataType : k }));
    }
    return objects;
  });

  return Promise.all(proms)
  .then(arrays=>arrays.reduce((a1,a2)=>a1.concat(a2)))
}

module.exports = load;
