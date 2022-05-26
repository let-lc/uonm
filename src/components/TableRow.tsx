import clsx from 'clsx';
import React, { useState } from 'react';
import { open } from '@tauri-apps/api/shell';
import { message } from '@tauri-apps/api/dialog';

import SelectPrefix from './SelectPrefix';
import SelectVersion from './SelectVersion';
import { useModulesStore } from '@/stores';

type TableRowProps = {
  module: ModuleInfo;
};

const TableRow = ({ module }: TableRowProps) => {
  const moduleSelections = useModulesStore((s) => s.moduleSelections);
  const setModuleSelections = useModulesStore((s) => s.setModuleSelections);
  const { checked, prefix, version } = moduleSelections[module.package];

  const toggleCheck = () => {
    setModuleSelections(module.package, 'checked', !moduleSelections[module.package].checked);
  };

  const setPrefix = (prefix: Prefix) => {
    setModuleSelections(module.package, 'prefix', prefix);
  };

  const setVersion = (version: string) => {
    setModuleSelections(module.package, 'version', version);
  };

  return (
    <tr className="bg-tk-storm hover:bg-tk-storm/50">
      <td className="px-2">
        <input
          type="checkbox"
          id="check-module"
          checked={checked}
          onChange={toggleCheck}
          className="mb-px h-4 w-4 rounded border-gray-300 text-tk-text bg-blend-exclusion hover:cursor-pointer focus:ring-0 focus:ring-offset-0"
        />
      </td>
      <td className="flex items-center gap-x-1 px-2">
        <pre
          onClick={() => open(`https://www.npmjs.com/package/${module.package}`).catch(message)}
          className="cursor-pointer whitespace-nowrap hover:text-tk-red hover:underline"
        >
          {module.package}
        </pre>
      </td>
      <td className="px-2 text-tk-blue">
        <pre>{module.current || 'N/A'}</pre>
      </td>
      <td className="px-2">
        <pre className="cursor-pointer text-tk-grass hover:underline" onClick={() => setVersion(module.wanted)}>
          {module.wanted || 'N/A'}
        </pre>
      </td>
      <td className="px-2">
        <pre className="cursor-pointer text-tk-sky hover:underline" onClick={() => setVersion(module.latest)}>
          {module.latest || 'N/A'}
        </pre>
      </td>
      <td className="px-2 text-tk-pale">{module.type}</td>
      <td className="flex gap-x-1 px-2">
        <SelectPrefix prefix={prefix} setPrefix={setPrefix} />
        <SelectVersion version={version} setVersion={setVersion} versions={module.versions} />
      </td>
    </tr>
  );
};

export default TableRow;
