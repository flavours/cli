import { Command as BaseCommand, flags } from '@oclif/command';
import * as indentString from 'indent-string';
import { load } from 'js-yaml';
import * as Listr from 'listr';
import { compact, trimEnd } from 'lodash';

import {
  checkRequirement,
  getManagerInfo,
  getYaml,
  YamlAndManager,
} from './utils';

interface Flags {
  registry: string;
  verbose: boolean;
  cache: boolean;
  help: void;
  check: boolean | void;
  addonmanager: string | void;
  package: string | void;
}

const LISTR_ERROR_MESSAGE = '\nError running command';

export default abstract class Command extends BaseCommand {
  static strict = false;
  static args = [
    {
      name: 'addons',
      description: 'The flavour identifier(s) of the addon, e.g.: divio/django',
    },
  ];
  static flags = {
    help: flags.help({ char: 'h' }),
    cache: flags.boolean({
      description:
        'Should use flavour addon managers that is available locally or check for latest',
      allowNo: true,
      default: true,
    }),
    verbose: flags.boolean({ description: 'Verbose output' }),
    registry: flags.string({
      default: 'https://hub.eu.aldryn.io',
    }),
    addonmanager: flags.string({
      description: 'Optionally specify addon manager, bypassing the registry',
    }),
    package: flags.string({
      description: 'File path or the url to package yaml',
    }),
  };

  self = Command;
  abstract title: string;
  abstract command(ctx: YamlAndManager & { projectRoot: string }): Promise<any>;
  abstract successTitle(addon: string): string;

  rootTitle = (addon: string) => `Installing ${addon}`;

  async run() {
    const { raw, flags } = this.parse(this.self);

    const addons = compact(raw.map(r => (r.type === 'arg' ? r.input : null)));
    const renderer = flags.verbose ? 'verbose' : 'default';

    if (!addons.length && (!flags.addonmanager || !flags.package)) {
      this.log(
        'Please provide either addon identifier or both package yaml and addon manager'
      );
      this.exit(1);
    }

    let yaml = '';
    if (flags.package) {
      yaml = await getYaml(flags.package);
    }
    if (!addons.length && flags.package) {
      try {
        const addon = load(yaml).meta.name;

        addons.push(addon);
      } catch {
        this.log('Invalid yaml');
        this.exit(1);
      }
    }

    const tasks = new Listr(
      addons.map((addon: string) => ({
        title: this.rootTitle(addon),
        task: (_, installTask) =>
          new Listr(
            [
              {
                title: 'Getting metadata',
                task: async (ctx: any) => {
                  let response = { fam: '', yaml: '' };
                  if (flags.addonmanager && flags.package) {
                    response.fam = flags.addonmanager;
                    response.yaml = yaml;
                  } else {
                    response = await getManagerInfo(
                      addon,
                      flags.registry as string
                    );
                    if (flags.package) {
                      response.yaml = yaml;
                    }
                  }
                  ctx.fam = response.fam;
                  ctx.yaml = response.yaml;
                  ctx.cache = flags.cache;
                },
              },
              {
                title: 'Checking validity',
                task: (ctx: any) => {
                  return checkRequirement({
                    ...ctx,
                    projectRoot: process.cwd(),
                  });
                },
                enabled: () => !!(flags as Flags).check,
              },
              {
                title: this.title,
                task: async (ctx: any) => {
                  try {
                    await this.command({
                      ...ctx,
                      projectRoot: process.cwd(),
                    });
                  } catch (e) {
                    throw new Error(e.message + LISTR_ERROR_MESSAGE);
                  }
                  installTask.title = this.successTitle(addon);
                },
              },
            ],
            { renderer, exitOnError: true }
          ),
      })),
      { renderer, concurrent: true, exitOnError: false }
    );

    try {
      await tasks.run();
    } catch (e) {
      if (e.errors && e.errors.length) {
        console.error('');
        e.errors.forEach((error: Error) =>
          console.error(
            indentString(trimEnd(error.message, LISTR_ERROR_MESSAGE), 2)
          )
        );
      } else {
        console.error(e.message);
      }
      this.exit(1);
    }
  }
}
