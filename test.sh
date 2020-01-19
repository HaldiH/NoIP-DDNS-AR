curl -sSL -D - -o /dev/null 'https://www.noip.com/login'  \
	-H 'Cookie: NOIP_BID='${NOIP_BID}'; XSRF-TOKEN='${XSRF_TOKEN}'; shortstar_session='${SHORTSTAR_SESSION} \
	-H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8' \
	-H 'Accept-Language: en-US,en;q=0.5' \
	-H 'Content-Type: application/x-www-form-urlencoded' \
	-H 'Origin: https://www.noip.com' \
	-H 'DNT: 1' \
	-H 'Connection: keep-alive' \
	-H 'Referer: https://www.noip.com/' \
	-H 'Upgrade-Insecure-Requests: 1' \
	--data 'username='${USERNAME}'&password='${PASSWORD}'&submit_login_page=1&Login=1&intended_hash=&_token='${CSRF_TOKEN}
	# -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:72.0) Gecko/20100101 Firefox/72.0' \
	# --compressed \
	