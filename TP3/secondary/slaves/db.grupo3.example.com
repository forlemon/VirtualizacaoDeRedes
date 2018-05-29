;
; BIND data file for local loopback interface
;
$TTL	604800
@	IN	SOA	d1.grupo3.example.com. admin.grupo3.example.com. (
			      3		; Serial
			 604800		; Refresh
			  86400		; Retry
			2419200		; Expire
			 604800 )	; Negative Cache TTL
;
; name servers - D records
     IN      NS     d1.grupo3.example.com.
     IN      NS	    d2.grupo3.example.com.

; name servers - A records
d1.grupo3.example.com.          IN      A       10.0.0.3
d2.grupo3.example.com.          IN      A       10.0.0.4

; 10.0.0.0/16 - A records
h1.grupo3.example.com.        IN      A      10.0.0.1
h2.grupo3.example.com.        IN      A      10.0.0.2
