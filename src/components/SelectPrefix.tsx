import { Listbox, Transition } from '@headlessui/react';
import clsx from 'clsx';
import React, { Fragment, useEffect, useRef, useState } from 'react';

const VERSION_PREFIXES: Readonly<Array<Prefix>> = ['^', '~', '='];

type SelectPrefixProps = {
  prefix: Prefix;
  setPrefix: (prefix: Prefix) => void;
};

const SelectPrefix = ({ prefix, setPrefix }: SelectPrefixProps) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [hovering, setHovering] = useState(false);
  const [showUnder, setShowUnder] = useState(true);

  useEffect(() => {
    if (btnRef && btnRef.current && typeof document !== 'undefined') {
      const table = document.getElementById('nm-table');
      if (table) {
        // calcualte pixel between button bottom and table bottom, show the ul div under the button there's enough space
        // ul div height (68px) + gap (4px) + scrollbar height (6px) => 78px
        setShowUnder(table.getBoundingClientRect().bottom - btnRef.current.getBoundingClientRect().bottom > 78);
      }
    }
  }, [hovering]);

  return (
    <Listbox value={prefix} onChange={setPrefix}>
      <div className="relative select-none">
        <Listbox.Button
          ref={btnRef}
          onMouseEnter={() => setHovering((p) => !p)}
          className={({ open }) =>
            clsx(
              'rounded px-1.5 ring-1 ring-tk-orange focus:outline-none',
              open
                ? 'bg-tk-orange text-tk-night hover:bg-tk-orange/80'
                : 'text-tk-orange hover:bg-tk-orange/20 hover:text-tk-orange'
            )
          }
        >
          {prefix}
        </Listbox.Button>
        <Listbox.Options
          className={clsx(
            'absolute z-10 max-h-60 w-full overflow-auto rounded bg-tk-night py-1 text-center shadow-lg ring-1 ring-tk-orange focus:outline-none',
            showUnder ? 'top-6' : '-top-1 -translate-y-full'
          )}
        >
          {VERSION_PREFIXES.map((versionPrefix) => (
            <Listbox.Option
              key={versionPrefix}
              value={versionPrefix}
              className={({ selected, active }) =>
                clsx(
                  'cursor-pointer',
                  selected && 'bg-tk-orange text-tk-night',
                  active && 'bg-tk-orange text-tk-night brightness-[0.8]'
                )
              }
            >
              {versionPrefix}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
};

export default SelectPrefix;
