import type { Country } from '../../types';
import { CountryCard } from '../country-card/country-card';
import { getPopulationForYear, createYearDataMap } from '../../utils/data-transformers';
import { useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';

import styles from './country-list.module.css';

type CountryListProps = {
  countries: Country[];
  searchQuery: string;
  selectedColumns: string[];
  selectedRegion: string;
  selectedYear: number;
  sortField: 'name' | 'population';
  sortOrder: 'asc' | 'desc';
  onYearChange: (year: number) => void;
};

export const CountryList = ({
  countries,
  searchQuery,
  selectedColumns,
  selectedRegion,
  selectedYear,
  sortField,
  sortOrder,
}: CountryListProps) => {
  const filteredCountries = useMemo(() => {
    return countries
      .filter((c) => {
        const matchesSearch = c.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRegion = !selectedRegion || c.data.some((d) => d.region === selectedRegion);
        return matchesSearch && matchesRegion;
      })
      .sort((a, b) => {
        if (sortField === 'name') {
          return sortOrder === 'asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
        } else {
          const popA = getPopulationForYear(createYearDataMap(a.data), selectedYear) || 0;
          const popB = getPopulationForYear(createYearDataMap(b.data), selectedYear) || 0;
          return sortOrder === 'asc' ? popA - popB : popB - popA;
        }
      });
  }, [countries, searchQuery, selectedRegion, selectedYear, sortField, sortOrder]);

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const country = filteredCountries[index];

    return (
      <div style={style}>
        <CountryCard
          country={country}
          selectedYear={selectedYear}
          selectedColumns={selectedColumns}
        />
      </div>
    );
  };

  const itemData = {
    countries: filteredCountries,
    selectedYear,
    selectedColumns,
  };

  return (
    <div className={styles.countryList}>
      <List
        height={window.innerHeight - 250}
        itemCount={filteredCountries.length}
        itemSize={350}
        width="100%"
        itemData={itemData}
      >
        {Row}
      </List>
    </div>
  );
};
