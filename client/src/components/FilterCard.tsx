import { Range } from 'react-range';
import { useContext, useState } from 'react';
import { Filter } from '../../../shared/types';
import { FiltersContext } from '../context/FiltersContext';

export default function FilterCard({ filterInfo }: { filterInfo: Filter }) {
  const { filters, setFilters } = useContext(FiltersContext);
  console.log('filters:', filters);

  function handleChangeRange(values: number[]) {
    const filtersWithCurrentFilter: Filter[] = filters.map((filter) => {
      if (filter.name === filterInfo.name)
        return {
          name: filter.name,
          range: filterInfo.range,
          min: values[0],
          max: values[1],
        };
      return filter;
    });
    setFilters(filtersWithCurrentFilter);
  }

  return (
    <div>
      <div className="pb-1 text-center text-sm">{filterInfo.name}</div>
      <Range
        step={1}
        min={filterInfo.range[0]}
        max={filterInfo.range[1]}
        values={[filterInfo.min, filterInfo.max]}
        onChange={handleChangeRange}
        renderTrack={({ props, children }) => (
          <div className="flex items-center">
            <div className="border-grayDark-100 w-12 shrink-0 rounded-md border p-1 text-center">
              {filterInfo.min}
            </div>
            <div
              {...props}
              className="relative mx-5 h-2 w-full rounded bg-gray-300"
            >
              <div
                className="bg-primary absolute h-2 rounded"
                style={{
                  left: `${((filterInfo.min - filterInfo.range[0]) / (filterInfo.range[1] - filterInfo.range[0])) * 100}%`,
                  width: `${((filterInfo.max - filterInfo.min) / (filterInfo.range[1] - filterInfo.range[0])) * 100}%`,
                }}
              ></div>
              {children}
            </div>
            <div className="border-grayDark-100 w-12 shrink-0 rounded-md border p-1 text-center">
              {filterInfo.max}
            </div>
          </div>
        )}
        renderThumb={({ props, index }) => (
          <div
            {...props}
            key={index}
            className="flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-md outline-none"
          />
        )}
      />
    </div>
  );
}
