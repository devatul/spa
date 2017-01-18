**IMPORTANT**:
These sample configurations MUST be used just as an example. Please note that file
paths, domain names, port numbers, environment names, etc. SHOULD be updated under
your own implementation needs.

---

Sample configuration for [Apache 2.4][1]
========================================

```apacheconf
<VirtualHost *:80>
    DocumentRoot "/var/www/html/my-nubity/web"
    DirectoryIndex index.html

    ServerName my.nubity.local

    <Directory /var/www/html/my-nubity/>
        Require all granted
        AllowOverride all
        Options -Indexes
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/my_nubity_error.log
    CustomLog ${APACHE_LOG_DIR}/my_nubity_access.log combined
</VirtualHost>
```

Sample configuration for [Nginx ~1.9][2]
========================================

```nginx
server {
    listen 80;

    root /var/www/html/my-nubity/web;
    index index.html;
    # Avoid exposing Nginx version at response headers.
    server_tokens off;
    server_name my.nubity.local;

    location / {
        # Try to serve file directly, fallback to app.php
        try_files $uri /index.html$is_args$args;
    }

    # Deny access to all files staring with ".".
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }

    error_log /var/log/nginx/my_nubity_error.log;
    access_log /var/log/nginx/my_nubity_access.log;
}

```

[1]: http://httpd.apache.org/docs/2.4/en/
[2]: http://nginx.org/en/docs/
