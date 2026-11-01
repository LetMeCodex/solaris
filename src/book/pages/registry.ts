import type React from 'react';

export interface PageDef {
  id: string;
  node: React.ReactNode;
  /** The catalogue's corner tab. */
  tab?: string;
  /** Marks this page as a stop on the rail under the book. */
  stop?: string;
  ground?: 'paper' | 'ink' | 'orange' | 'green';
  folio?: boolean;
  n?: number;
}

/** Page numbers by id, so the contents never go out of date. */
export const NUMBERS = new Map<string, number>();
