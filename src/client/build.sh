rm -rf node_modules
rm -rf build
bun install
bun run build
cd build/compute/default/
bun install --omit=dev
cd ../../..
du -sh build