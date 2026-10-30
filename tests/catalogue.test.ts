import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { hasReference, linkedData, linkedPolicies, vttKeys, maturityCounts } from '../src/data/catalogueRelations.ts';
const data = JSON.parse(readFileSync(new URL('../src/data/catalogue.generated.json', import.meta.url), 'utf8'));
const all = [...data.indicateurs, ...data.indicateursComplementaires];

test('identifier boundaries do not create false relationships', () => {
  assert.equal(hasReference('ENV-10, MOB-04', 'ENV-1'), false);
  assert.equal(hasReference('ENV-10, MOB-04', 'MOB-04'), true);
  assert.equal(hasReference('X-MOB-04-1', 'MOB-04'), false);
  assert.equal(hasReference('OB-PACTE-1.1.1', 'OB-PACTE-1.1'), false);
  assert.equal(hasReference('OB-PACTE-1.1.1', 'OB-PACTE-1.1.1'), true);
});
test('explicit references link the three catalogues and retain distinct ids', () => {
  const example = all.find((i) => i.id === 'ENV-10');
  assert.ok(linkedData(example, data.donneesCatalogue).some((d) => d.id === 'D-03'));
  assert.ok(linkedPolicies(example, data.politiquesPubliques).length > 0);
  for (const ind of all) {
    for (const id of ind.donneeIds) assert.ok(data.donneesCatalogue.some((d) => d.id === id), `${ind.id} -> ${id}`);
    for (const id of ind.politiqueIds) assert.ok(data.politiquesPubliques.some((p) => p.id === id), `${ind.id} -> ${id}`);
  }
});
test('all VTT links survive without duplication and unknown labels are retained', () => {
  assert.deepEqual(vttKeys({lienVTT:'A', liensVTT:['A','B','C','B','À qualifier']}), ['A','B','C','À qualifier']);
  for (const ind of all) assert.equal(new Set(ind.liensVTT).size, ind.liensVTT.length);
});
test('maturity distribution counts only rated indicators, without averaging', () => {
  assert.deepEqual(maturityCounts([{maturite:1},{maturite:4},{maturite:null}]).map((r) => r.count), [1,0,0,1]);
  assert.equal(maturityCounts(data.indicateurs).reduce((sum, r) => sum+r.count,0), 30);
});
