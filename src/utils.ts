import * as Docker from 'dockerode';
import { ContainerCreateOptions } from 'dockerode';
import * as fs from 'fs-extra';
import * as request from 'request-promise-native';
import * as Stream from 'stream';

const isUrl = require('is-url');

const docker = new Docker();

interface DockerRunError extends Error {
  exitCode?: number;
  stdout?: string;
  stderr?: string;
}
async function dockerRunWithStdIn(
  docker: Docker,
  options: ContainerCreateOptions,
  stdin: Buffer | string
): Promise<{ exitCode: number; stdout: string; stderr: string }> {
  const container = await docker.createContainer({
    OpenStdin: true,
    StdinOnce: true,
    ...options,
  });

  const stream = await container.attach({
    stream: true,
    stdin: true,
    hijack: true,
    stdout: true,
    stderr: true,
  });

  stream.end(stdin instanceof Buffer ? stdin : Buffer.from(stdin));

  var stdoutStream = new Stream.PassThrough();
  var stderrStream = new Stream.PassThrough();

  container.modem.demuxStream(stream, stdoutStream, stderrStream);

  let stdout = '';
  let stderr = '';

  stdoutStream.on('data', function(chunk) {
    stdout += chunk;
  });

  stderrStream.on('data', function(chunk) {
    stderr += chunk;
  });

  await container.start();

  const { StatusCode } = await container.wait();

  if (StatusCode !== 0) {
    const error: DockerRunError = new Error(stderr);
    error.exitCode = StatusCode;
    error.stderr = stderr;
    error.stdout = stdout;

    throw error;
  }

  return { exitCode: StatusCode, stdout, stderr };
}

export interface YamlAndManager {
  yaml: string;
  fam: string;
  cache: boolean;
  projectRoot?: string;
}

async function runDockerCommand(
  command: 'add' | 'remove' | 'check',
  ctx: YamlAndManager
) {
  const { fam, yaml, projectRoot, cache } = ctx;

  if (!cache) {
    await docker.pull(fam, {});
  }

  return dockerRunWithStdIn(
    docker,
    {
      Image: fam,
      HostConfig: {
        AutoRemove: true,
        Binds: [`${projectRoot}:/app`],
      },
      Cmd: [command],
    },
    yaml
  );
}

export function addRequirement(ctx: YamlAndManager) {
  return runDockerCommand('add', ctx);
}

export function removeRequirement(ctx: YamlAndManager) {
  return runDockerCommand('remove', ctx);
}

export function checkRequirement(ctx: YamlAndManager) {
  return runDockerCommand('check', ctx);
}

export async function getManagerInfo(addon: string, registry: string) {
  // {"query":"divio/django","result":{"id":"1cb5b9e0-b57a-4951-b8da-51dfa94d42be","identifier":"divio/django:1.11.20.4"}}
  try {
    const { result } = await request({
      url: `${registry}/addonversions/resolve/`,
      form: {
        query: addon,
      },
      method: 'POST',
      json: true,
    });

    const gr = await request({
      url: `${registry}/addonversions/${result.id}/`,
      json: true,
    });

    const platform = await request({
      url: gr.platforms[0],
      json: true,
    });

    return {
      fam: `flavour/fam-${platform.identifier}`,
      yaml: gr.yaml,
    };
  } catch (e) {
    throw new Error(e.error.non_field_errors);
  }
}

export async function getYaml(pathOrUrl: string): Promise<string> {
  if (isUrl(pathOrUrl)) {
    const response = await request({
      url: pathOrUrl,
      json: true,
    });

    return response.data;
  }

  const data = await fs.readFile(pathOrUrl);

  return data.toString();
}
