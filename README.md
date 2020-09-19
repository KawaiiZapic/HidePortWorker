# HidePortWorker
A worker script for Cloudflare to hide your source server port,support cache and more.  
# What?
这个脚本可以帮助你在Cloudflare使用非443/80端口时隐藏你的端口,基于Cloudflare Worker.  
此脚本有`SingleServer`与`MultiServer`版本,其中`MultiServer`版本允许添加多个服务器进行负载均衡.
# How?
由于Worker无法自定义Header内的`Host`,只能添加新的Header来传递`Host`.  
所以需要使用一些手段将新的Header转换成`Host`传递给原服务器.  
为了防止`Host`被重写为源服务器的地址后,导致不同`Host`网站下的相同路径的文件被Cloudflare缓存机制当作同一文件,需要为每个网站指定统一格式的不同源站地址,以防止缓存互相干扰(或者禁用Cloudflare的缓存).  
此脚本使用的方案是做一个泛解析,为了更好的说明,在这里举一个例子:  
1. 将`*.proxy.example.com`解析到源服务器.  
2. 访问`www.proxy.example.com`时,实际上访问的是`www-example-com.proxy.example.com`.  

这些都由脚本来处理,你只需要做一个`*.proxy.example.com`的泛解析.  
如果你需要HTTPS加密Worker到源服务器的连接,请注意,`*.example.com`的证书对于`*.proxy.example.com`来说,是无效的,你需要特别申请一个包含`*.proxy.example.com`的证书.  
做完泛解析,就可以开始配置后端了.  
一种比较简单的方案是使用Nginx等软件进行反代,代替源服务器暴露到外网,并设置头部.  
例如:  
源服务器: `Apache`,监听`0.0.0.0:443`  
反代服务器: `Nginx`,监听`0.0.0.0:4443`  
由于特殊原因,`443`端口无法直接被外部访问,所以使用`Nginx`反代,配置如下:  
```
server {
        listen 4443 ssl default_server;
        listen [::]:4443 ssl default_server ipv6only=on;
        ssl_certificate /etc/nginx/key/example.crt;
        ssl_certificate_key /etc/nginx/key/example.key;

        server_name *.proxy.example.com;
        underscores_in_headers on;
        location / {
                proxy_set_header Host $http_x_real_host;
                proxy_set_header X-Real-Host "";
                proxy_pass https://127.0.0.1:443;
        }

}
```
在脚本头部添加如下设置
```
let Svr = {
        "Host": "proxy.example.com",
        "Port": 4443,
        "Protocol": "https"
};
```
把脚本添加到Worker并部署,设置代理将全部流量\(\*.example.com/*)代理到新的Worker,访问服务器.  
Done.
