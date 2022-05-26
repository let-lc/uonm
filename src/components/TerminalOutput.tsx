import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { debounce } from 'lodash';
import { Transition } from '@headlessui/react';

import { useTerminalOutputs } from '@/stores';

const TerminalOutput = () => {
  const [show, setShow] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const terminalOutputs = useTerminalOutputs((state) => state.terminalOutputs);

  /**
   * Scroll to the bottom of the div when new output pushed.
   */
  const scrollToBottom = debounce(() => {
    if (show && ref && ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, 100);

  useEffect(() => {
    // watch terminal output and scroll to bottom.
    scrollToBottom();
  }, [scrollToBottom, terminalOutputs.length]);

  return (
    <div className="flex flex-col overflow-hidden rounded">
      {/* Console Output Show/Hide button */}
      <button
        onClick={() => setShow((prev) => !prev)}
        className="select-none bg-tk-greenish px-2 text-left text-sm font-medium text-tk-night hover:bg-tk-greenish/90"
      >
        <span>Console Output</span>
        <span>{show ? '+' : '-'} </span>
      </button>
      {/* Console Outputs */}
      <Transition
        show={show && terminalOutputs.length > 0}
        ref={ref}
        enter="transition-all duration-200"
        enterFrom="max-h-0"
        enterTo=" max-h-24"
        leave="transition-all duration-300"
        leaveFrom="max-h-24"
        leaveTo="max-h-0"
        className="h-24 flex-grow divide-y divide-tk-night overflow-y-auto overflow-x-hidden rounded bg-tk-storm"
      >
        {/* Console Output Items */}
        {terminalOutputs.map(({ line, isError }, outputIdx) => (
          <p
            key={`output-${outputIdx}`}
            className={clsx(
              'whitespace-pre-wrap bg-tk-storm px-2 text-xs hover:brightness-125',
              isError ? 'text-tk-red' : 'text-tk-grass'
            )}
          >
            {line}
          </p>
        ))}
      </Transition>
    </div>
  );
};

export default TerminalOutput;
