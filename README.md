# Campfire Songbook


### Deployment

Caddyfile:

```
example.com {
        templates
        encode gzip zstd
        reverse_proxy /api/* localhost:8090
        reverse_proxy /ws/* localhost:8090
        root * /var/www/html
        @notAPI {
                not {
                        path /api/*
                }
                file {
                        try_files {path} {path}/ /index.html
                }
        }
        rewrite @notAPI {http.matchers.file.relative}
        file_server
}
```
