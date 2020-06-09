deploy:
	aws s3 sync . s3://code.matthewphillips.info/fly-out --delete
.PHONY: deploy
