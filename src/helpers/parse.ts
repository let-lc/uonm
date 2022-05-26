import { getVersionsCommand } from './command';
import { maxSatisfying } from 'semver';

/**
 * Get all the versions of a package.
 *
 * @param packageName Node package name.
 * @returns String array contains all the version of the package.
 */
const getVersions = async (packageName: string): Promise<Array<string>> => {
  let versions: Array<string>;
  await getVersionsCommand(packageName)
    .execute()
    .then(({ stderr, stdout }) => {
      if (!stderr && stdout) versions = JSON.parse(stdout) as Array<string>;
    })
    .catch(() => {
      versions = [];
    });
  return versions;
};

/**
 * Get the outdated packages from `npm outdated` output.
 *
 * @param output Outout of `npm outdated`.
 * @returns Outdated packages.
 */
const parseNpmOutdated = async (output: string): Promise<Array<ModuleInfo>> => {
  const json = JSON.parse(output) as Array<any>;
  try {
    return Promise.all(
      Object.keys(json).map(async (key) => {
        const moduleInfo: ModuleInfo = {
          package: key,
          current: json[key]?.current || '',
          wanted: json[key]?.wanted || '',
          latest: json[key]?.latest || '',
          type: json[key]?.type || '',
        };
        moduleInfo.versions = moduleInfo.package ? await getVersions(moduleInfo.package) : [];
        return moduleInfo;
      })
    );
  } catch (err) {
    return [];
  }
};

const getFullDepsTypeStr = (depsType: string): string => {
  switch (depsType) {
    case 'dev':
      return 'devDependencies';
    case 'optional':
      return 'optionalDependencies';
    default:
      return 'dependencies';
  }
};

/**
 * Get the outdated packages from `pnpm outdated` output.
 *
 * @param output Output of `pnpm outdated`.
 * @returns Outdated packages.
 */
const parsePnpmOutdated = async (output: string): Promise<Array<ModuleInfo>> => {
  return Promise.all<ModuleInfo>(
    // Outdated package are separated by an empty line.
    output.split('\n\n').map(async (moduleStr) => {
      const moduleInfo: ModuleInfo = {};
      const m = moduleStr.split('\n');
      // package name & type
      // Get the index of `(`, package type specified in side the parentheses.
      const parenthesesIdx = m[0].indexOf('(');
      // Package type is not specified, normal dependency.
      if (parenthesesIdx === -1) {
        moduleInfo.package = m[0];
        moduleInfo.type = 'dependencies';
      } else {
        // Parse the package name.
        moduleInfo.package = m[0].substring(0, parenthesesIdx - 1);
        // Parse the package type to the full package type string.
        moduleInfo.type = getFullDepsTypeStr(m[0].substring(parenthesesIdx + 1, m[0].length - 1));
      }
      moduleInfo.versions = moduleInfo.package ? await getVersions(moduleInfo.package) : [];
      // Split by ` => ` to get the current version and the lastest version
      const ver = m[1].split(' => ');
      // Check if the current version is missing.
      if (ver[0].substring(0, 7) === 'missing') {
        moduleInfo.current = '';
        const wantedIdx = ver[0].indexOf('(wanted');
        // Get the wanted version from pnpm outdated, not calcualtion needed.
        moduleInfo.wanted = wantedIdx === -1 ? '' : ver[0].substring(wantedIdx + 8, ver[0].length - 1);
      } else {
        moduleInfo.current = ver[0];
        // Calculate the max satisfying/wanted version.
        moduleInfo.wanted = maxSatisfying(moduleInfo.versions, '^' + ver[0]);
      }
      moduleInfo.latest = ver[1] !== 'Deprecated' ? ver[1] : moduleInfo.versions[moduleInfo.versions.length - 1] || '';
      return moduleInfo;
    })
  );
};

/**
 * Get the outdated packages from `yarn outdated` output.
 *
 * @param output Output of `yarn outdated`.
 * @returns Outdated packages.
 */
const parseYarnOutdated = async (output: string): Promise<Array<ModuleInfo>> => {
  // Start index of the outdated packages json from the output.
  const startIdx = output.indexOf(`{"type":"table"`);
  try {
    if (startIdx !== -1) {
      // Parse the table data of the oudated packages.
      const json = JSON.parse(output.substring(startIdx));
      // Table headers.
      const head = json.data.head as Array<string>;
      // Get the index of each table header type.
      const indexes: Partial<Record<ModuleField, number>> = {
        package: head.findIndex((h) => h === 'Package'),
        current: head.findIndex((h) => h === 'Current'),
        wanted: head.findIndex((h) => h === 'Wanted'),
        latest: head.findIndex((h) => h === 'Latest'),
        type: head.findIndex((h) => h === 'Package Type'),
      };

      return Promise.all<ModuleInfo>(
        // Parse the outdated packages from `data.body`.
        (json.data.body as Array<any>).map(async (value: Array<string>) => {
          const moduleInfo: ModuleInfo = {
            package: value[indexes.package] || '',
            current: value[indexes.current] || '',
            wanted: value[indexes.wanted] || '',
            latest: value[indexes.latest] || '',
            type: value[indexes.type] || '',
          };
          moduleInfo.versions = moduleInfo.package ? await getVersions(moduleInfo.package) : [];
          return moduleInfo;
        })
      );
    }
  } catch (err) {
    return [];
  }
};

/**
 * Parse the outdated check command output to a list of outdated packages.
 *
 * @param pm Current selected package manager.
 * @param output Outputs of the outdated check command.
 * @returns List of outdated packages.
 */
export const parseOutdatedModules = async (pm: PackageManager, output: string): Promise<Array<ModuleInfo>> => {
  switch (pm) {
    case 'npm':
      return parseNpmOutdated(output);
    case 'pnpm':
      return parsePnpmOutdated(output);
    case 'yarn':
      return parseYarnOutdated(output);
    default:
      return [];
  }
};
