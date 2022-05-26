import { Listbox } from '@headlessui/react';
import clsx from 'clsx';
import React, { CSSProperties, useEffect, useRef, useState } from 'react';

type SelectVersionProps = {
  versions: Array<string>;
  version: string;
  setVersion: (version: string) => void;
};

const SelectVersion = ({ versions, version, setVersion }: SelectVersionProps) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [hovering, setHovering] = useState(false);
  const [showUnder, setShowUnder] = useState(true);
  const [minWidth, setMinWidth] = useState(0);

  useEffect(() => {
    if (btnRef && btnRef.current && typeof document !== 'undefined') {
      const table = document.getElementById('nm-table');
      if (table) {
        // calcualte pixel between button bottom and table bottom, show the ul div under the button there's enough space
        // ul div height (144px) + gap (4px) + scrollbar height (6px) => 154px
        setShowUnder(table.getBoundingClientRect().bottom - btnRef.current.getBoundingClientRect().bottom > 154);
      }
    }
  }, [hovering]);

  useEffect(() => {
    // calculate min width so it doesn't affect the hidden options whene it pop up
    // 8px per character + some extra fault tolerance pixels (24)
    setMinWidth(versions.reduce((a, b) => (a.length > b.length ? a : b), '').length * 8 + 24);
  }, [versions]);

  return (
    <Listbox value={version} onChange={setVersion}>
      <div className="relative flex-grow select-none">
        <Listbox.Button
          ref={btnRef}
          onMouseEnter={() => setHovering((p) => !p)}
          className={({ open }) =>
            clsx(
              'w-full min-w-[var(--min-width)] rounded px-1.5 ring-1 ring-tk-purple focus:outline-none',
              open
                ? 'bg-tk-purple text-tk-night hover:bg-tk-purple/80'
                : 'text-tk-purple hover:bg-tk-purple/20 hover:text-tk-purple'
            )
          }
          style={{ '--min-width': `${minWidth}px` } as CSSProperties}
        >
          {version}
        </Listbox.Button>
        <Listbox.Options
          className={clsx(
            'absolute z-10 max-h-36 w-full overflow-y-auto overflow-x-hidden rounded bg-tk-night py-1 text-center shadow-lg ring-1 ring-tk-purple focus:outline-none',
            showUnder ? 'top-6' : '-top-1 -translate-y-full'
          )}
        >
          {versions.map((ver) => (
            <Listbox.Option
              key={ver}
              value={ver}
              className={({ selected, active }) =>
                clsx(
                  'cursor-pointer whitespace-nowrap',
                  selected && 'bg-tk-purple text-tk-night',
                  active && 'bg-tk-purple text-tk-night brightness-[0.8]'
                )
              }
            >
              {ver}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
};

export default SelectVersion;
