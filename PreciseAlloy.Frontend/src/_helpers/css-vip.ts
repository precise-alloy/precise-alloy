import css from 'css';

const addImportantToCssRule = (rule: css.Rule) => {
  if (rule.declarations) {
    rule.declarations.forEach((declaration) => {
      if (declaration.type !== 'declaration') {
        return;
      }

      if (!declaration.value || declaration.value.indexOf('!important') >= 0) {
        return;
      }

      if (declaration.property && declaration.property.startsWith('--')) {
        return;
      }

      declaration.value += '!important';
    });
  }

  return;
};

const processRules = (rules: Array<css.Rule | css.Comment | css.AtRule>) => {
  rules.forEach((rule) => {
    if (rule.type === 'media' || rule.type === 'supports') {
      if (rule.rules) {
        processRules(rule.rules);
      }
    } else if (rule.type === 'rule') {
      addImportantToCssRule(rule);
    } else {
      console.log(`Unknown rule type: ${rule.type}`);
    }
  });
};

const cssVip = (code: string): string => {
  const obj = css.parse(code);
  const rules = obj.stylesheet?.rules;
  if (!rules) {
    return code;
  }

  processRules(rules);

  return css.stringify(obj, {
    compress: true,
  });
};

export default cssVip;
