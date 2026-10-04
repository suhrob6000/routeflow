import { describe, expect, it } from 'vitest';
import { filterNodes } from '../enhance';

describe('node search', () => {
  function fixture() {
    const nodes = ['Германия · Frankfurt · VLESS', 'Финляндия · Helsinki · Trojan', 'Россия · Direct'].map((textContent) => ({
      textContent, hidden: false,
      classList: { toggle(_className: string, hidden: boolean) { nodes.find((node) => node.textContent === textContent)!.hidden = hidden; } },
    }));
    const root = { querySelectorAll: () => nodes } as unknown as ParentNode;
    return { root, nodes };
  }
  it('matches Unicode labels and ignores casing and whitespace', () => {
    const { root, nodes } = fixture();
    expect(filterNodes(root, '  ГЕРМАНИЯ  ')).toBe(1);
    expect(nodes.map((node) => node.hidden)).toEqual([false, true, true]);
  });
  it('searches protocols and restores nodes when cleared', () => {
    const { root, nodes } = fixture();
    expect(filterNodes(root, 'trojan')).toBe(1);
    expect(filterNodes(root, '')).toBe(3);
    expect(nodes.every((node) => !node.hidden)).toBe(true);
  });
  it('returns zero for an unmatched query', () => {
    const { root } = fixture();
    expect(filterNodes(root, 'unavailable')).toBe(0);
  });
});
