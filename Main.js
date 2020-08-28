let Svr = {
        "Host": "example.com",
        "Port": 4443,
        "Protocol": "https"
};
addEventListener(
  "fetch",
  (e) => {
    let Url=new URL(e.request.url);
    Url.host= Svr.Host;
    Url.port = Svr.Port;
    Url.protocol = Svr.Protocol + ":";
    let Req=new Request(Url,e.request);
    Req.headers.set('X-Real-Host',e.request.headers.get('Host'));
    e.respondWith(fetch(Req));
  }
)
