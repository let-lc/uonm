import { Fragment, useState } from 'react';
import { message } from '@tauri-apps/api/dialog';
import { writeText } from '@tauri-apps/api/clipboard';
import { Dialog, Transition } from '@headlessui/react';

import { getUpdateCommand, convertPrefix } from '@/helpers';
import { useModulesStore, usePmStore } from '@/stores';

const UpdateButton = () => {
  const [open, setOpen] = useState(false);
  const [copyBtnText, setCopyBtnText] = useState('Copy');
  const moduleSelections = useModulesStore((s) => s.moduleSelections);
  const packageManager = usePmStore((s) => s.packageManager);

  const openModal = () => {
    let hasSelected = false;
    // check any package selected
    for (const packageName in moduleSelections) {
      if (moduleSelections[packageName].checked) {
        hasSelected = true;
        break;
      }
    }

    if (hasSelected) {
      setOpen(true);
    } else {
      message('No package selected.');
    }
  };

  const updateModules = () => {
    getUpdateCommand().execute().catch(message);
    setOpen(false);
  };

  const copyUpdateCommand = () => {
    let command = `${packageManager} ${packageManager === 'npm' ? 'install' : 'add'}`;
    for (const packageName in moduleSelections) {
      const { checked, prefix, version } = moduleSelections[packageName];
      if (checked) {
        command += ` ${packageName}@${convertPrefix(packageManager, prefix)}${version}`;
      }
    }
    writeText(command)
      .then(() => {
        setCopyBtnText('Copied');
      })
      .catch(message)
      .finally(() => {
        setTimeout(() => {
          setOpen(false);
          setCopyBtnText('Copy');
        }, 500);
      });
  };

  return (
    <>
      <button
        onClick={openModal}
        className="select-none rounded bg-tk-grass px-2 text-tk-night transition-colors duration-300 hover:brightness-110"
      >
        Update
      </button>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-tk-night bg-opacity-75 transition-opacity" />
          </Transition.Child>
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform select-none overflow-hidden rounded-lg bg-tk-night px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                  <div className="text-center">
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-tk-pale">
                      Run Update Command
                    </Dialog.Title>
                    <Dialog.Description className="pt-2 text-sm text-tk-text">
                      Please choose where you wanted run the update command. You can run it in{' '}
                      <span className="font-mono">`uonm`</span>, or you can copy it to the clipboard and run it from
                      your terminal.
                    </Dialog.Description>
                  </div>
                  <div className="mt-5 flex justify-center gap-x-16">
                    <button
                      onClick={updateModules}
                      className="rounded bg-tk-grass px-4 font-medium text-tk-night transition-all duration-300 hover:shadow hover:shadow-tk-grass/50 hover:brightness-110"
                    >
                      Run
                    </button>
                    <button
                      onClick={copyUpdateCommand}
                      disabled={copyBtnText === 'Copied'}
                      className="rounded border border-tk-grass px-4 font-medium text-tk-grass transition-colors duration-150 hover:bg-tk-grass hover:text-tk-night disabled:cursor-not-allowed"
                    >
                      {copyBtnText}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default UpdateButton;
