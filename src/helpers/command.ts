import { Command } from '@tauri-apps/api/shell';

import { IS_WIN, useCwdStore, useModulesStore, usePmStore, useTerminalOutputs } from '@/stores';

const { addOutput } = useTerminalOutputs.getState();

/**
 * Convert the semver prefix.
 *
 * @param pm Package Manager
 * @param prefix Version prefix
 * @returns Prefix
 */
export const convertPrefix = (pm: PackageManager, prefix: Prefix): string => {
  switch (prefix) {
    case '^':
      // windows `^` caret issue: https://github.com/yarnpkg/yarn/issues/3270#issuecomment-384020717
      return pm === 'yarn' && IS_WIN ? '^^^^' : '^';
    case '~':
      return '~';
    case '=':
    default:
      return '';
  }
};
/**
 * Allowed terminal output configuration for command execution.
 */
type AllowedOutput = {
  /**
   * Standard outputs.
   */
  stdout?: boolean;
  /**
   * Standard errors.
   */
  stderr?: boolean;
  /**
   * Output on command errors.
   */
  error?: boolean;
  /**
   * Output on command close.
   */
  close?: boolean;
};
/**
 * Default allowed outputs configurations.
 */
const DEFAFULT_ALLOWED_OUTPUT: AllowedOutput = { stdout: true, stderr: true, error: true, close: true };

/**
 * Create a command.
 *
 * @param program Package manager program.
 * @param args Command arguments
 * @param cwd Current working directory.
 * @param allowedOutput Allowed command output configurations.
 * @returns Tauri command object.
 */
export const createCommand = (
  program: string,
  args?: string | string[],
  cwd?: string,
  allowedOutput: AllowedOutput = {}
): Command => {
  // Print the current executing cwd and command.
  addOutput(`${cwd}> ${program} ${typeof args === 'string' ? args : args.join(' ')}`, false);
  // Override default allowed ouput configurations.
  const allow = { ...DEFAFULT_ALLOWED_OUTPUT, ...allowedOutput };
  // Create command.
  const command = new Command(program, args, { cwd });
  // Outputs
  if (allow.stdout) {
    command.stdout.on('data', (line) => {
      addOutput(line, false);
    });
  }
  if (allow.stdout) {
    command.stderr.on('data', (line) => {
      addOutput(line, true);
    });
  }
  if (allow.error) {
    command.on('error', (line) => {
      addOutput(line, true);
    });
  }
  if (allow.close) {
    command.on('close', (data) => {
      addOutput(`Command finished with code ${data.code} and signal ${data.signal}.`, false);
    });
  }
  return command;
};

/**
 * Create a command object to check outdated package.
 *
 * @returns Tauri command object.
 */
export const getOutdatedCommand = (): Command => {
  const { packageManager } = usePmStore.getState();
  return createCommand(
    packageManager + (IS_WIN ? '.cmd' : ''),
    packageManager === 'pnpm' ? ['outdated', '--long', '--no-table'] : ['outdated', '--json', '--long'],
    useCwdStore.getState().cwd,
    { stdout: false }
  );
};

/**
 * Create a command object to get all the versions of a package.
 *
 * @param packageName Node package name.
 * @returns Tauri command object.
 */
export const getVersionsCommand = (packageName: string): Command => {
  return createCommand(
    'npm' + (IS_WIN ? '.cmd' : ''),
    ['view', packageName, 'versions', '--json'],
    useCwdStore.getState().cwd,
    { stdout: false, close: false }
  );
};

/**
 * Create a command object to update all the selected package.
 *
 * @returns Tauri command object.
 */
export const getUpdateCommand = () => {
  const { packageManager } = usePmStore.getState();
  const { moduleSelections } = useModulesStore.getState();
  let newPackages: Array<string> = [];
  for (const packageName in moduleSelections) {
    const { checked, prefix, version } = moduleSelections[packageName];
    // Only add the selected package.
    if (checked) {
      newPackages.push(`${packageName}@${convertPrefix(packageManager, prefix)}${version}`);
    }
  }
  return createCommand(
    packageManager + (IS_WIN ? '.cmd' : ''),
    [packageManager === 'npm' ? 'install' : 'add', ...newPackages],
    useCwdStore.getState().cwd
  );
};
