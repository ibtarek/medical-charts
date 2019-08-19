/**
 * utility function to group a list of items by the dateTime field
 *
 * @param  {String} dataType the name of the grouping data type
 * @param  {Array} list     description
 * @return {Array}          an array of groups, each item in the array has an
 *                          elements list containing the grouped items
 */
function groupByDate(dataType, list){
  return list.reduce((acc,t)=>{
    const ts = new Date(t.dateTime);
    const key = [ts.getFullYear(),ts.getMonth(),ts.getDay()].join("-");
    let peer = acc.find(l=>l.key===key);
    if (!peer) {
      peer = {
        key ,
        dataType,
        elements : [],
        dateTime : ts,
        organization : t.organization // uses the same organization
      };
      acc.push(peer);
    }
    peer.elements.push(t);
    return acc;
  },[]);
}

/**
 * Transforms the API raw data feed to a rendering-friendly format.
 *
 * @param  {Object} client      Human API client
 * @param  {String} accessToken   Human API access token
 * @param  {Object} feed        raw data returned by the `load` function
 * @return {Object}             description
 */
async function transform(client, accessToken, feed){

  let medicalProfile = {} ;

  try {
    medicalProfile = await client.medicalProfile(accessToken);
  } catch (err){

  }

  const vitals = feed.filter(obj=>obj.dataType==="vitalSigns")
  .map(v=>{
    v.dateTime = new Date(v.dateTime);
    return v;
  });

  const testResults = feed.filter(obj=>obj.dataType==="testResults")
  .map(t=>{
    t.dateTime = new Date(t.resultDateTime);
    t.components = t.components.map(c=>{
      if (c.value && c.value.length>16){
        //c.value = c.value.split(".").map(s=>s+".").join("\n");
        c.componentComments=c.value;
        c.value="";
      }
      return c
    })
    return t;
  });

  const medications = feed.filter(obj=>obj.dataType==="medications")
  .map(m=>{
    m.dateTime = new Date(m.startDate);
    return m;
  });

  const encounters = await Promise.all(feed.filter(obj=>obj.dataType==="encounters")
  .map( async (encounter)=>{
    encounter.dateTime = new Date(encounter.dateTime);
    return encounter;
  }));

  const procedures = feed.filter(obj=>obj.dataType==="procedures")
  .map(p=>{
    p.dateTime = new Date(p.dateTime);
    return p;
  });


  const rx = groupByDate("rx",medications);
  const labs = groupByDate("labs",testResults);


  console.log(rx);

  const objects = encounters
    // .concat(testResults)
    .concat(procedures)
    .concat(vitals)
    .concat(labs)
    .concat(rx)
    .sort((o1,o2)=>o2.dateTime-o1.dateTime);

  return {objects , medicalProfile};

}

module.exports = transform;
