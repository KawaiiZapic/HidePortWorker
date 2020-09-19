let SvrGrp = [{
        "Host": "example.com",
        "Port": 4443,
        "Protocol": "https",
        "Weight": 10
}, {
        "Host": "example2.com",
        "Port": 4444,
        "Protocol": "https",
        "Weight": 10
}];

let getSrv = () => {
    let SrvMap = [];
    for(let Srv in SrvGrp) {
      let w = typeof SrvGrp[Srv].Weight != "undefined" ? SrvGrp[Srv].Weight : 0;
      while (w >= 0){
        SrvMap.push(Srv);
        --w;
      }
    }
    return SrvGrp[SrvMap[Math.floor(SrvMap.length * Math.random())]];
};

addEventListener(
  "fetch",
  (e) => {
    let Url = new URL(e.request.url);
    let Srv = getSrv();
    Url.host = Url.hostname.replaceAll(".","-") + "." + Svr.Host;
    Url.port = Svr.Port;
    Url.protocol = Svr.Protocol + ":";
    let Req = new Request(Url,e.request);
    Req.headers.set('X-Real-Host', e.request.headers.get('Host'));
    let Res = fetch(Req).then((d)=>{
      if(d.status < 500){
        return d;
      } else {
        return new Response(d.status + " " + d.statusText, {
          headers: {
             "content-type": "text/html;charset=UTF-8",
          },
          status: d.status,
          statusText: d.statusText
        });
      }
    });
    e.respondWith(Res);
  }
)
