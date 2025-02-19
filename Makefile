
run:
	bun --hot run index.ts

bundle-js:
	bun build ./client/index.ts --outdir ./static/js --minify --watch