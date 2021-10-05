install:
	ln maintenance.service /etc/systemd/system/maintenance.service
	systemctl daemon-reload
	systemctl enable maintenance
	systemctl start maintenance

uninstall:
	systemctl stop maintenance
	rm /etc/systemd/system/maintenance.service
	systemctl daemon-reload
