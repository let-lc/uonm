import { message } from '@tauri-apps/api/dialog';

import { useCwdStore, usePmStore, useModulesStore } from '@/stores';
import { getOutdatedCommand, parseOutdatedModules } from '@/helpers';

const OutdatedButton = () => {
  const packageManager = usePmStore((s) => s.packageManager);
  const initModules = useModulesStore((s) => s.initModules);
  const setLoading = useModulesStore((s) => s.setLoading);
  const cwd = useCwdStore((s) => s.cwd);

  const outdatedCheck = () => {
    if (cwd) {
      setLoading(true);
      initModules([], {}); // reset
      getOutdatedCommand()
        .execute()
        .then(async (value) => {
          const modules = await parseOutdatedModules(packageManager, value.stdout);
          const modulesSelections: ModuleSelections = modules.reduce<ModuleSelections>(
            (a, c) => ({ ...a, [c.package]: { checked: true, prefix: '^', version: c.wanted } }),
            {}
          );
          initModules(modules, modulesSelections);
        })
        .catch(message)
        .finally(() => {
          setLoading(false);
        });
    } else {
      message('Please select a valid project directory!');
    }
  };

  return (
    <button
      onClick={outdatedCheck}
      className="select-none rounded bg-tk-sand px-2 text-tk-night transition-all duration-150 hover:brightness-110"
    >
      Outdated Check
    </button>
  );
};

export default OutdatedButton;
