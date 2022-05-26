import create from 'zustand';
import { CwdState, PmState, ModuleStates, TerminalOutputsState } from './stores.d';

export const usePmStore = create<PmState>((set) => ({
  packageManager: 'npm',
  setPackageManager: (packageManager) => set(() => ({ packageManager })),
}));

export const useCwdStore = create<CwdState>((set) => ({
  cwd: '',
  setCwd: (cwd) => set(() => ({ cwd })),
}));

export const useModulesStore = create<ModuleStates>((set) => ({
  loading: false,
  setLoading: (loading) => set(() => ({ loading })),
  modules: [],
  setModules: (modules) => set(() => ({ modules })),
  moduleSelections: {},
  setModuleSelections: (packageName, key, value) =>
    set((state) => ({
      moduleSelections: {
        ...state.moduleSelections,
        [packageName]: {
          ...state.moduleSelections[packageName],
          [key]: value,
        },
      },
    })),
  initModules: (modules, moduleSelections) => set(() => ({ modules, moduleSelections })),
  checkAll: (checked) =>
    set((state) => {
      const moduleSelections = { ...state.moduleSelections };
      for (const packageName in moduleSelections) {
        moduleSelections[packageName].checked = checked;
      }
      return { moduleSelections };
    }),
}));

export const useTerminalOutputs = create<TerminalOutputsState>((set) => ({
  terminalOutputs: [],
  addOutput: (line, isError) =>
    set((state) => ({
      terminalOutputs: [...state.terminalOutputs, { line, isError }],
    })),
  clearOutput: () => set(() => ({ terminalOutputs: [] })),
}));
