import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { compare } from 'semver';

import { useModulesStore } from '@/stores';
import TableRow from './TableRow';

const COL_CONFIGS: Array<TableColumn> = [
  { header: 'Package Name', key: 'package' },
  { header: 'Current', key: 'current' },
  { header: 'Wanted', key: 'wanted' },
  { header: 'Latest', key: 'latest' },
  { header: 'Package Type', key: 'type' },
];

type SortMethod = 'desc' | 'asc' | null;

const Table = () => {
  const [sortKey, setSortKey] = useState<ModuleField>('package');
  const [sortOrder, setSortOrder] = useState<SortMethod>(null);
  const [checked, setChecked] = useState<boolean>(false);
  const loading = useModulesStore((s) => s.loading);
  const modules = useModulesStore((s) => s.modules);
  const modulesSelections = useModulesStore((s) => s.moduleSelections);
  const checkAll = useModulesStore((s) => s.checkAll);
  const checkboxRef = useRef<HTMLInputElement>();

  useEffect(() => {
    let checkCount = 0;
    // count checks
    for (const packageName in modulesSelections) {
      if (modulesSelections[packageName].checked) {
        checkCount++;
      }
    }
    // set indeterminate
    if (checkboxRef?.current) {
      checkboxRef.current.indeterminate = checkCount !== modules.length && checkCount !== 0;
    }
    // set check
    if (checkCount === 0) {
      setChecked(false);
    } else if (checkCount === modules.length) {
      setChecked(true);
    }
  }, [modules.length, modulesSelections]);

  const checkAllHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    checkAll(e.target.checked);
  };

  const modulesSortCb = (a: ModuleInfo, b: ModuleInfo) => {
    if (!sortOrder) return 0;
    const reverse = sortOrder === 'asc' ? 1 : -1;
    switch (sortKey) {
      case 'package':
      case 'type':
        return a[sortKey].localeCompare(b[sortKey], 'en', { sensitivity: 'base' }) * reverse;
      case 'current':
      case 'wanted':
      case 'latest':
        return compare(a[sortKey], b[sortKey]) * reverse;
      default:
        return 0;
    }
  };

  const thClickHandler = (key: ModuleField) => {
    setSortKey(key);
    setSortOrder((prev) => {
      switch (prev) {
        case 'asc':
          return 'desc';
        case 'desc':
          return null;
        default:
          return 'asc';
      }
    });
  };

  return (
    <div className="absolute inset-0 overflow-hidden rounded" id="nm-table">
      <div className="h-full overflow-auto">
        <table className="relative w-full text-sm">
          <thead className="sticky top-0 z-20">
            <tr className="select-none">
              <th className="w-8 bg-tk-text px-2 text-left text-tk-storm">
                <input
                  type="checkbox"
                  ref={checkboxRef}
                  id="check-all"
                  checked={checked}
                  onChange={checkAllHandler}
                  className="mb-0.5 h-4 w-4 cursor-pointer rounded border-gray-300 text-tk-storm focus:ring-0 focus:ring-offset-0"
                />
              </th>
              {COL_CONFIGS.map(({ header, key }) => (
                <th
                  key={`th-${key}`}
                  onClick={() => thClickHandler(key)}
                  className="cursor-pointer bg-tk-text px-2 text-left text-tk-storm hover:brightness-90"
                >
                  <div className="flex items-center gap-x-1">
                    <span>{header}</span>
                    {key === sortKey && sortOrder && (
                      <span className={sortOrder === 'desc' ? 'rotate-90' : '-rotate-90'}>{'>'}</span>
                    )}
                  </div>
                </th>
              ))}
              <th className="bg-tk-text px-2 text-left text-tk-storm">Actions</th>
            </tr>
          </thead>
          <tbody className="h-full max-h-48 divide-y divide-tk-night overflow-auto rounded-b">
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  className="select-none overflow-hidden rounded-b bg-tk-blue text-center font-semibold text-tk-storm"
                >
                  <span className="animate-ping">Loading...</span>
                </td>
              </tr>
            ) : modules.length ? (
              [...modules]
                .sort(modulesSortCb)
                .map((module) => <TableRow key={`tr-${module.package}`} module={module} />)
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="select-none overflow-hidden rounded-b bg-tk-red text-center font-semibold text-tk-storm"
                >
                  {'<No Module Loaded>'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
