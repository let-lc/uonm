export {};

declare global {
  /**
   *  Node package managers.
   */
  type PackageManager = 'npm' | 'pnpm' | 'yarn';
  /**
   * Package version prefix.
   */
  type Prefix = '^' | '~' | '=';
  /**
   * Field key for module infomation.
   */
  type ModuleField = 'package' | 'current' | 'wanted' | 'latest' | 'type' | 'versions';
  /**
   * Module selection states.
   */
  type ModuleSelection = { checked: boolean; prefix: Prefix; version: string };
  /**
   * Module selection staets of outdated modules.
   */
  type ModuleSelections = Record<string, ModuleSelection>;

  /**
   * Terminal output.
   */
  type Output = {
    /**
     * Output text.
     */
    line: string;
    /**
     * Is error output.
     */
    isError: boolean;
  };

  /**
   * Module information.
   */
  interface ModuleInfo extends Partial<Record<ModuleField, string>> {
    /**
     * Module versions.
     */
    versions?: Array<string>;
  }

  /**
   * Table coclumn configuration.
   */
  type TableColumn = {
    /**
     * Header text.
     */
    header: string;
    /**
     * Module field key.
     */
    key: ModuleField;
  };
}
