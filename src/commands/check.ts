import Command from '../base-command';
import { checkRequirement } from '../utils';

export default class Check extends Command {
  static description = 'Check addon';
  static examples = ['$ flavour check addon1 addon2'];

  command = checkRequirement;
  title = 'Checking requirement';
  rootTitle = (addon: string) => `Checking ${addon}`;
  successTitle = (addon: string) => `Checked ${addon}`;
}
