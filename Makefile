install:
	ln maintenance.service /etc/systemd/system/maintenance.service
	systemctl daemon-reload
	systemctl enable maintenance
	systemctl start maintenance

uninstall:
	systemctl stop maintenance
	rm /etc/systemd/system/maintenance.service
	systemctl daemon-reload

purge:
	rm -f /etc/maintenance.json
	userdel -r maintenance-node

setup:
	npm i
	adduser --disabled-login --gecos '' --shell /usr/sbin/nologin maintenance-node
	cp config.json /etc/maintenance.json
	cp -R ./ /home/maintenance-node/
	chown maintenance-node:maintenance-node /etc/maintenance.json
	chmod 400 /etc/maintenance.json
