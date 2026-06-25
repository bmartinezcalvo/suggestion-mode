import { execSync } from 'child_process';
import { cpSync, rmSync, mkdirSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

const REPO = 'git@github.com:bmartinezcalvo/suggestion-mode.git';

// Get current branch name, normalize slashes to dashes for use as directory name
const branch = execSync('git branch --show-current').toString().trim();
const subdir = branch.replace(/\//g, '-');

const basePath = `/suggestion-mode/${subdir}/`;
console.log(`Deploying branch "${branch}" to gh-pages/${subdir}/ (base: ${basePath})`);

// Build with correct base path
execSync(`BASE_PATH=${basePath} npm run build`, { stdio: 'inherit' });

const tmp = join(tmpdir(), `gh-pages-deploy-${Date.now()}`);

// Clone only gh-pages branch (shallow)
try {
  execSync(`git clone --branch gh-pages --single-branch --depth 1 ${REPO} ${tmp}`, { stdio: 'inherit' });
} catch {
  // gh-pages branch doesn't exist yet — init empty repo
  mkdirSync(tmp, { recursive: true });
  execSync(`git init ${tmp}`);
  execSync(`git -C ${tmp} checkout --orphan gh-pages`);
}

// Ensure .nojekyll exists
writeFileSync(join(tmp, '.nojekyll'), '');

// Remove old submodule entry if it exists (leftover from previous deploy method)
try {
  execSync(`git -C ${tmp} rm -rf --cached ${subdir}`, { stdio: 'pipe' });
} catch { /* not a submodule, ignore */ }

// Replace only this branch's subdirectory
const destDir = join(tmp, subdir);
if (existsSync(destDir)) rmSync(destDir, { recursive: true, force: true });
mkdirSync(destDir, { recursive: true });
cpSync('dist', destDir, { recursive: true });

// Remove any nested .git dirs that would cause submodule issues
try { rmSync(join(destDir, '.git'), { recursive: true, force: true }); } catch { /* ok */ }

// Commit and push
execSync(`git -C ${tmp} add -A`, { stdio: 'inherit' });
execSync(`git -C ${tmp} commit -m "deploy ${branch}"`, { stdio: 'inherit' });
execSync(`git -C ${tmp} push ${REPO} gh-pages:gh-pages`, { stdio: 'inherit' });

// Cleanup
rmSync(tmp, { recursive: true, force: true });

console.log(`Done! https://bmartinezcalvo.github.io/suggestion-mode/${subdir}/`);
