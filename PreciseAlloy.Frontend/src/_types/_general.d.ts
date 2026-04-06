type BasedAtomicModel = {
  globalModifier?: string[];
  styleModifier?: string[];
  theme?: string;
};

type RequestParams = {
  [name: string]: string | boolean | undefined;
};
