import React from 'react';
import { usePmStore } from '@/stores';
import { Listbox } from '@headlessui/react';
import clsx from 'clsx';

const PM_LIST: Array<PackageManager> = ['npm', 'pnpm', 'yarn'];

const PM_COLORS: Record<PackageManager, string> = {
  npm: 'bg-tk-red',
  pnpm: 'bg-tk-sand',
  yarn: 'bg-tk-cyan',
};

const PmSelect = () => {
  const packageManager = usePmStore((state) => state.packageManager);
  const setPackageManager = usePmStore((state) => state.setPackageManager);

  return (
    <Listbox value={packageManager} onChange={setPackageManager}>
      <div className="relative select-none">
        <Listbox.Button
          className={clsx(
            'select-none rounded border-0 py-0 w-20 text-center uppercase text-tk-night outline-none [background-size:1em_1em] [background-position:right_0.25rem_center] focus:ring-0',
            PM_COLORS[packageManager]
          )}
        >
          {packageManager}
        </Listbox.Button>
        <Listbox.Options className="absolute top-6 z-50 max-h-60 w-full overflow-hidden rounded bg-tk-night py-1 text-center shadow-lg ring-1 ring-tk-storm focus:outline-none">
          {PM_LIST.map((pm) => (
            <Listbox.Option
              key={pm}
              value={pm}
              className={({ selected, active }) =>
                clsx(
                  'cursor-pointer uppercase',
                  selected && 'text-tk-night',
                  active && 'text-tk-night brightness-110',
                  (selected || active) && PM_COLORS[pm]
                )
              }
            >
              {pm}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
};

export default PmSelect;
