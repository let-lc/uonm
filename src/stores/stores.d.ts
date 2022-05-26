export interface PmState {
  /**
   * Node package manager.
   */
  packageManager: PackageManager;
  /**
   * Set package manager.
   */
  setPackageManager: (
    /**
     * New selected package manager.
     */
    packageManager: PackageManager
  ) => void;
}

export interface CwdState {
  /**
   * Current working directory.
   */
  cwd: string;
  /**
   * Set current working directory.
   */
  setCwd: (
    /**
     * New current working directory.
     */
    cwd: string
  ) => void;
}

export interface ModuleStates {
  /**
   * Loading outdated packages.
   */
  loading: boolean;
  /**
   * Loading state setter.
   */
  setLoading: (
    /**
     * New loading state.
     */
    loading: boolean
  ) => void;
  /**
   * Outdated modules.
   */
  modules: Array<ModuleInfo>;
  /**
   * Outdated moduels state setter.
   */
  setModules: (modules: Array<ModuleInfo>) => void;
  /**
   * Selected outdated modules, included selected prefix and version.
   */
  moduleSelections: ModuleSelections;
  /**
   * Update selection states(checked, prefix, version) of a module.
   */
  setModuleSelections: (
    /**
     * Package name.
     */
    packageName: string,
    /**
     * Selection state key.
     */
    key: keyof ModuleSelection,
    /**
     * New selection state value.
     */
    value: ModuleSelection[keyof ModuleSelection]
  ) => void;
  /**
   * Initial the module selections state, all checked.
   */
  initModules: (
    /**
     * All outdated modules.
     */
    modules: Array<ModuleInfo>,
    /**
     * Default selection states for all modules, checke(`true`), prefix(`^`), version(`wanted`).
     */
    moduleSelections: ModuleSelections
  ) => void;

  /**
   * Check/uncheck all outdated packages.
   */
  checkAll: (
    /**
     * New checked state for all modules.
     */
    checked: boolean
  ) => void;
}

export interface TerminalOutputsState {
  /**
   * Terminal outputs.
   */
  terminalOutputs: Array<Output>;
  /**
   * Add a new output.
   */
  addOutput: (
    /**
     * Output text.
     */
    line: string,
    /**
     * Is error output.
     */
    isError: boolean
  ) => void;
  /**
   * Clear all command outputs.
   */
  clearOutput: () => void;
}
