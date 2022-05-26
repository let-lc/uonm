import React from 'react';
import { open, message } from '@tauri-apps/api/dialog';

import { useCwdStore } from '@/stores';

const CwdSelect = () => {
  const cwd = useCwdStore((state) => state.cwd);
  const setCwd = useCwdStore((state) => state.setCwd);

  const selectCWD = () => {
    open({ directory: true, multiple: false })
      .then((value) => {
        // ignore null value if cancelled
        if (value) {
          setCwd(value as string);
        }
      })
      .catch(message);
  };

  return (
    <div className="flex w-full flex-shrink-0 overflow-hidden rounded">
      <input
        type="text"
        readOnly
        spellCheck={false}
        defaultValue={cwd}
        className="flex-grow border-0 border-r border-tk-night bg-tk-storm px-2 py-0 outline-none"
      />
      <button
        onClick={selectCWD}
        className="select-none bg-tk-blue/90 px-2 text-tk-storm transition-colors duration-300 hover:bg-tk-blue"
      >
        Open
      </button>
    </div>
  );
};

export default CwdSelect;
