import { writeFileSync, mkdirSync, existsSync, cpSync, readFileSync } from 'fs';
import { join } from 'path';
import { nodeFileTrace } from '@vercel/nft';

const amplifyDirectories = [
  join(process.cwd(), '.amplify-hosting'),
  join(process.cwd(), '.amplify-hosting', 'static'),
  join(process.cwd(), '.amplify-hosting', 'compute'),
  join(process.cwd(), '.amplify-hosting', 'compute', 'default'),
  join(process.cwd(), '.amplify-hosting', 'compute', 'default', 'node_modules'),
];

const deployManifestConfig = {
  entrypoint: 'build/index.js',
  framework: {
    name: 'sveltekit',
    version: '1.20.4',
  },
};

// Ensure .amplify-hosting directory exists
const amplifyHostingDir = join(process.cwd(), '.amplify-hosting');
if (!existsSync(amplifyHostingDir)) {
  mkdirSync(amplifyHostingDir, { recursive: true });
}

// Write the config to .amplify-hosting/deploy-manifest.json
writeFileSync(join(amplifyHostingDir, 'deploy-manifest.json'), JSON.stringify(deployManifestConfig));

// Move the build/client to the static directory for Amplify
cpSync(join(process.cwd(), 'build', 'client'), amplifyDirectories[1], { recursive: true });

// Custom function to prepend content to a file
function prependToFile(filePath, content) {
  const originalContent = readFileSync(filePath, 'utf8');
  const newContent = content + originalContent;
  writeFileSync(filePath, newContent, 'utf8');
}

// Prepend dotenv import into the entrypoint
prependToFile(join('build', 'index.js'), `import 'dotenv/config'\n`);

// Ref: https://rishi.app/blog/using-vercel-nft-to-compute-runtime-dependencies-for-your-remix-express-app/
async function computeDependencies(paths = []) {
  const files = paths;
  const { fileList } = await nodeFileTrace(files);
  let packages = {};
  fileList.forEach((i) => {
    if (i.includes('node_modules/')) {
      let temp = i.replace('node_modules/', '');
      temp = temp.substring(0, temp.indexOf('/'));
      packages[`node_modules/${temp}`] = true;
    } else packages[i] = true;
  });
  Object.keys(packages)
    .sort()
    .forEach((i) => {
      cpSync(i, join(amplifyDirectories[3], i), { recursive: true });
    });
}

// Compute all the dependents on build/index.js and load them into the compute
computeDependencies(['./build/index.js']);