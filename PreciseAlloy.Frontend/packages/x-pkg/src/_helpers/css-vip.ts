import css, { Declaration, Rule, Media, Supports } from 'css';

const updateCssRule = (rule: Rule) => {
  if (!rule.type) {
    return;
  }

  if (rule.type === 'font-face') {
    // TODO: add logics
  }

  if (rule.type === 'media') {
    (rule as Media).rules?.forEach((mediaRule: Rule) => updateCssRule(mediaRule));
    return;
  }

  if (rule.type === 'supports') {
    (rule as Supports).rules?.forEach((mediaRule: Rule) => updateCssRule(mediaRule));
    return;
  }

  if (rule.declarations) {
    [].forEach.call(rule.declarations, (declaration: Declaration) => {
      if (!declaration.value) {
        return;
      }

      // Convert pixel to rem
      declaration.value = declaration.value.replaceAll(/([0-9]+|[0-9]*(?:\.[0-9]+))px\b/gi, (_, p1) => {
        const px = parseFloat(p1);
        const rem = px / 16;
        return rem + 'rem';
      });

      // Add domain to absolute url
      declaration.value = declaration.value.replaceAll(/\burl\((['"])?(\/[^('")]+)\1\)/gi, (p0, p1, p2) => {
        if (process.env.VITE_DOMAIN) {
          return `url(${p1}${process.env.VITE_DOMAIN}${p2}${p1})`;
        }

        return p0;
      });
    });
  }
};

const cssVip = (code: string): string => {
  const obj = css.parse(code);
  const rules = obj.stylesheet?.rules;
  if (!rules) {
    return code;
  }

  if (!obj.stylesheet) {
    return code;
  }

  obj.stylesheet.rules = obj.stylesheet.rules.filter((r: Rule) => {
    if (r.type === 'font-face' || r.type === 'media' || r.type === 'supports') {
      return true;
    }

    if (!r.selectors) {
      return false;
    }

    r.selectors = r.selectors.filter((s) => !s.includes('data-styled.'));
    return !!r.selectors.length;
  });

  [].forEach.call(rules, (rule) => updateCssRule(rule));

  return css.stringify(obj, { compress: true });
};

export default cssVip;
