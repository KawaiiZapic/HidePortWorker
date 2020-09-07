let Svr = {
        "Host": "example.com",
        "Port": 4443,
        "Protocol": "https"
};
addEventListener(
  "fetch",
  (e) => {
    let Url = new URL(e.request.url);
    Url.host = Svr.Host;
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
    e.respondWith(R);
  }
)
