import { type FilterFn } from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils'; // Import rankItem here

// Define a custom fuzzy filter function that will apply ranking info to rows (using match-sorter utils)
export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

// You can add other reusable filter functions here if needed, e.g., for number ranges
export const inNumberRange: FilterFn<any> = (row, columnId, filterValue: [number | null, number | null]) => {
  const value = row.getValue(columnId) as number;
  const [min, max] = filterValue;

  if (min !== null && value < min) {
    return false;
  }
  if (max !== null && value > max) {
    return false;
  }
  return true;
};