import fs from 'fs';

const isWriteable = async (directory: string): Promise<boolean> => {
  try {
    await fs.promises.access(directory, fs.constants.W_OK);

    return true;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return false;
  }
};

export { isWriteable };
