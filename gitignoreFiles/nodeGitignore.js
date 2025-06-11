const nodeGitIgnore = [
    // Logs
    'logs',
    '*.log',
    'npm-debug.log*',
    'yarn-debug.log*',
    'yarn-error.log*',
    'lerna-debug.log*',
    '.pnpm-debug.log*',

    // Diagnostic reports
    'report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json',

    // Runtime data
    'pids',
    '*.pid',
    '*.seed',
    '*.pid.lock',

    // jscoverage/JSCover
    'lib-cov',

    // Coverage
    'coverage',
    '*.lcov',
    '.nyc_output',

    // Grunt
    '.grunt',

    // Bower
    'bower_components',

    // node-waf
    '.lock-wscript',

    // Binary addons
    'build/Release',

    // Dependency directories
    'node_modules/',
    'jspm_packages/',
    'web_modules/',

    // TypeScript
    '*.tsbuildinfo',

    // Caches
    '.npm',
    '.eslintcache',
    '.stylelintcache',
    '.rpt2_cache/',
    '.rts2_cache_cjs/',
    '.rts2_cache_es/',
    '.rts2_cache_umd/',

    // REPL
    '.node_repl_history',

    // npm pack output
    '*.tgz',

    // Yarn
    '.yarn-integrity',

    // dotenv
    '.env',
    '.env.development.local',
    '.env.test.local',
    '.env.production.local',
    '.env.local',

    // Parcel
    '.cache',
    '.parcel-cache',

    // Next.js
    '.next',
    'out',

    // Nuxt.js
    '.nuxt',
    'dist',

    // Gatsby
    '.cache/',

    // VuePress
    '.vuepress/dist',
    '.temp',
    '.cache',

    // VitePress
    '**/.vitepress/dist',
    '**/.vitepress/cache',

    // Docusaurus
    '.docusaurus',

    // Serverless
    '.serverless/',

    // FuseBox
    '.fusebox/',

    // DynamoDB
    '.dynamodb/',

    // TernJS
    '.tern-port',

    // VSCode Extension Testing
    '.vscode-test',

    // Yarn v2
    '.yarn/cache',
    '.yarn/unplugged',
    '.yarn/build-state.yml',
    '.yarn/install-state.gz',
    '.pnp.*'
];

module.exports = nodeGitIgnore;
