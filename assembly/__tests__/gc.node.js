import * as script from '../../build/gc.node.js';
import assert from 'assert';
import { describe, it } from 'node:test';

describe('Replicate memory issue', () => {
	it('does not crash', () => {
		assert.doesNotThrow(() => script.parseEvent());
		assert.doesNotThrow(() => script.__collect());
	});
});
