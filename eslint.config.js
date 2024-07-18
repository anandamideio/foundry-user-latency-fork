import tseslint from 'typescript-eslint';
import { LintGolem } from '@magik_io/lint_golem';

export default tseslint.config(
  ...new LintGolem({
    rootDir: import.meta.dirname,
    tsconfigPaths: ['tsconfig.json'],
    disabledRules: ['n/no-unsupported-features/node-builtins', 'n/no-missing-import', 'n/no-unpublished-import'],
  }).config
);
