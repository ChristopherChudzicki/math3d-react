# Legacy-scene migration audit

This is temporary tooling for verifying math3d-next's translation of legacy scenes before the math3d.org frontend cutover. The method, data formats and reports live in math3d-next under `docs/legacy-audit/`. Delete this folder once that audit is done.

`rehydrate.audit.js` runs each saved scene through this app's own `rehydrate`, so the result is exactly what users see today. It also records load-time failures this app hits, such as a folder referencing a missing item, or a slider with neither a manual value nor a saved slider value.

The `.audit.js` suffix keeps these files out of `npm test`. Run it from `client/` with absolute paths:

```bash
CI=true \
LEGACY_AUDIT_DEFAULTS_OUT=/abs/path/defaults.json \
LEGACY_AUDIT_IN=/abs/path/legacy.jsonl \
LEGACY_AUDIT_OUT=/abs/path/rehydrated.jsonl \
npm test -- --watchAll=false --testMatch '<rootDir>/src/legacyAudit/rehydrate.audit.js'
```

Each variable is optional: set only `LEGACY_AUDIT_DEFAULTS_OUT` to export the defaults. The input and output are scene data from production. Keep them out of git.

## Pass 2: evaluation

`evaluate.audit.js` evaluates each rehydrated scene as a page load does: symbols through `getParseableSymbols` and `evalScope`, graphics' math props and slider `min`/`max` through `evalData`. It writes each field's status and a fingerprint of its value. `fingerprint.js` is a port of math3d-next's `packages/legacy-audit/src/fingerprint.ts`, and `fingerprint.audit.js` checks that the two agree. Here `N` is math3d-next's `packages/legacy-audit`:

```bash
CI=true \
LEGACY_EVAL_IN=/abs/path/rehydrated.jsonl \
LEGACY_EVAL_OUT=/abs/path/eval_react.jsonl \
LEGACY_SAMPLE_POINTS=$N/sample_points.json \
npm test -- --watchAll=false --testMatch '<rootDir>/src/legacyAudit/evaluate.audit.js'

CI=true \
LEGACY_SAMPLE_POINTS=$N/sample_points.json \
LEGACY_FINGERPRINT_CASES=$N/fingerprint_cases.json \
npm test -- --watchAll=false --testMatch '<rootDir>/src/legacyAudit/fingerprint.audit.js'
```

`LEGACY_EVAL_LIMIT` stops after that many scenes.
