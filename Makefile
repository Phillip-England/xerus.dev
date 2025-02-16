
css:
	bun build ./css/index.css --outdir ./static/css --minify --watch

js:
	bun build ./client/index.ts --outdir ./static/js --minify --watch