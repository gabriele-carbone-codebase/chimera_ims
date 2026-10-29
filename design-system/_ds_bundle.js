/* @ds-bundle: {"format":4,"namespace":"IMISDesignSystem_ab406a","components":[{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"AvatarGroup","sourcePath":"components/core/Avatar.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"StatCard","sourcePath":"components/data/StatCard.jsx"},{"name":"Progress","sourcePath":"components/feedback/Progress.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Card","sourcePath":"components/layout/Card.jsx"},{"name":"Dialog","sourcePath":"components/layout/Dialog.jsx"},{"name":"Tabs","sourcePath":"components/layout/Tabs.jsx"}],"sourceHashes":{"components/core/Avatar.jsx":"0fc4a551b664","components/core/Badge.jsx":"21a4048bc454","components/core/Button.jsx":"2d612c13224a","components/core/Icon.jsx":"b35cf0466dd7","components/core/IconButton.jsx":"2298dbd77f41","components/core/Tag.jsx":"92ae43c6dea9","components/data/StatCard.jsx":"ed8fe8dba466","components/feedback/Progress.jsx":"d4fdd1c2bc32","components/feedback/Toast.jsx":"6b9c9d49efea","components/feedback/Tooltip.jsx":"62a5ed20e85b","components/forms/Checkbox.jsx":"82ae34dfe5a3","components/forms/Input.jsx":"96cef4d39f46","components/forms/Radio.jsx":"514a73fcd814","components/forms/Select.jsx":"ed42ce84561b","components/forms/Switch.jsx":"ee723167d897","components/layout/Card.jsx":"a830b457d504","components/layout/Dialog.jsx":"cc3eb240f0bb","components/layout/Tabs.jsx":"ed19977b015d","ui_kits/mobile-app/Screens.jsx":"d96f6f79445f","ui_kits/web-app/AIPanel.jsx":"5974ce677661","ui_kits/web-app/Funding.jsx":"2b6b79b4b43d","ui_kits/web-app/Pipeline.jsx":"b8c0bddce914","ui_kits/web-app/Portfolio.jsx":"12549f574f86","ui_kits/web-app/ProjectDetail.jsx":"0f898a858e02","ui_kits/web-app/Reports.jsx":"e8e4d86865fa","ui_kits/web-app/Scouting.jsx":"111bf59dac9c","ui_kits/web-app/Shell.jsx":"ccb425a66f69","ui_kits/web-app/data.js":"38efba4251fe"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.IMISDesignSystem_ab406a = window.IMISDesignSystem_ab406a || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Avatar.jsx
try { (() => {
const P = ['#C9A86A', '#6E8470', '#4F6E80', '#9C8B6E', '#A0705A'];
function Avatar({
  name = '',
  src,
  size = 28,
  style
}) {
  const ini = name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  const c = P[[...name].reduce((a, ch) => a + ch.charCodeAt(0), 0) % P.length];
  return /*#__PURE__*/React.createElement("span", {
    title: name,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: size,
      height: size,
      borderRadius: '50%',
      background: src ? 'var(--surface-sunken)' : c,
      color: '#FFFDF9',
      fontSize: Math.round(size * .38),
      fontWeight: 600,
      fontFamily: 'var(--font-ui)',
      overflow: 'hidden',
      flex: 'none',
      boxShadow: '0 0 0 2px var(--surface-card)',
      ...style
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : ini);
}
function AvatarGroup({
  names = [],
  max = 3,
  size = 24
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex'
    }
  }, names.slice(0, max).map((n, i) => /*#__PURE__*/React.createElement(Avatar, {
    key: n,
    name: n,
    size: size,
    style: {
      marginLeft: i ? -6 : 0
    }
  })), names.length > max && /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: -6,
      width: size,
      height: size,
      borderRadius: '50%',
      background: 'var(--surface-sunken)',
      color: 'var(--text-secondary)',
      fontSize: 11,
      fontWeight: 600,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 0 0 2px var(--surface-card)'
    }
  }, "+", names.length - max));
}
Object.assign(__ds_scope, { Avatar, AvatarGroup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
const T = {
  neutral: ['var(--surface-sunken)', 'var(--text-secondary)'],
  accent: ['var(--accent-soft)', 'var(--text-accent)'],
  success: ['var(--success-soft)', 'var(--success)'],
  warning: ['var(--warning-soft)', 'var(--warning)'],
  danger: ['var(--danger-soft)', 'var(--danger)'],
  info: ['var(--info-soft)', 'var(--info)']
};
function Badge({
  tone = 'neutral',
  dot,
  children,
  style
}) {
  const [bg, fg] = T[tone];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      height: 20,
      padding: '0 7px',
      borderRadius: 'var(--radius-sm)',
      background: bg,
      color: fg,
      fontFamily: 'var(--font-ui)',
      fontSize: 'var(--fs-xs)',
      fontWeight: 'var(--fw-medium)',
      lineHeight: 1,
      whiteSpace: 'nowrap',
      ...style
    }
  }, dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: 3,
      background: fg
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CDN = 'https://unpkg.com/lucide-static@0.454.0/icons/';
const cache = {};
function load(name) {
  if (!cache[name]) cache[name] = fetch(CDN + name + '.svg').then(r => r.ok ? r.text() : '').then(t => t.replace(/<!--[\s\S]*?-->/g, '').replace(/width="24"/, 'width="100%"').replace(/height="24"/, 'height="100%"')).catch(() => '');
  return cache[name];
}
function Icon({
  name = 'circle',
  size = 16,
  color = 'currentColor',
  style,
  ...rest
}) {
  const [svg, setSvg] = React.useState('');
  React.useEffect(() => {
    let on = true;
    load(name).then(s => {
      if (on) setSvg(s);
    });
    return () => {
      on = false;
    };
  }, [name]);
  return /*#__PURE__*/React.createElement("span", _extends({
    "aria-hidden": "true"
  }, rest, {
    style: {
      display: 'inline-flex',
      flex: 'none',
      width: size,
      height: size,
      color,
      lineHeight: 0,
      ...style
    },
    dangerouslySetInnerHTML: {
      __html: svg
    }
  }));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const H = {
  sm: 'var(--control-h-sm)',
  md: 'var(--control-h-md)',
  lg: 'var(--control-h-lg)'
};
const PX = {
  sm: '10px',
  md: '14px',
  lg: '18px'
};
const V = {
  primary: {
    background: 'var(--accent)',
    color: 'var(--on-accent)',
    border: '1px solid var(--accent)'
  },
  secondary: {
    background: 'var(--surface-card)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-default)',
    boxShadow: 'var(--shadow-1)'
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-secondary)',
    border: '1px solid transparent'
  },
  danger: {
    background: 'var(--surface-card)',
    color: 'var(--danger)',
    border: '1px solid var(--border-default)'
  }
};
const HOV = {
  primary: {
    background: 'var(--accent-hover)',
    borderColor: 'var(--accent-hover)'
  },
  secondary: {
    background: 'var(--surface-hover)'
  },
  ghost: {
    background: 'var(--surface-hover)',
    color: 'var(--text-primary)'
  },
  danger: {
    background: 'var(--danger-soft)'
  }
};
function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  disabled,
  fullWidth,
  children,
  style,
  onClick,
  type = 'button',
  ...rest
}) {
  const [h, setH] = React.useState(false);
  const [p, setP] = React.useState(false);
  const s = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: H[size],
    padding: '0 ' + PX[size],
    borderRadius: 'var(--radius-md)',
    fontFamily: 'var(--font-ui)',
    fontSize: size === 'sm' ? 'var(--fs-sm)' : 'var(--fs-body)',
    fontWeight: 'var(--fw-medium)',
    whiteSpace: 'nowrap',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? .45 : 1,
    transition: 'background var(--dur-fast) var(--ease-standard),transform var(--dur-fast)',
    transform: p && !disabled ? 'translateY(1px)' : 'none',
    width: fullWidth ? '100%' : undefined,
    ...V[variant],
    ...(h && !disabled ? HOV[variant] : {}),
    ...style
  };
  const is = size === 'lg' ? 18 : size === 'sm' ? 14 : 16;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => {
      setH(false);
      setP(false);
    },
    onMouseDown: () => setP(true),
    onMouseUp: () => setP(false),
    style: s
  }, rest), icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: is
  }), children, iconRight && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconRight,
    size: is
  }));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function IconButton({
  icon,
  label,
  size = 'md',
  variant = 'ghost',
  active,
  onClick,
  style,
  ...rest
}) {
  const [h, setH] = React.useState(false);
  const d = size === 'sm' ? 28 : size === 'lg' ? 40 : 34;
  const base = variant === 'secondary' ? {
    background: 'var(--surface-card)',
    border: '1px solid var(--border-default)'
  } : {
    background: 'transparent',
    border: '1px solid transparent'
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    title: label,
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: d,
      height: d,
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      color: active ? 'var(--text-accent)' : h ? 'var(--text-primary)' : 'var(--text-secondary)',
      transition: 'background var(--dur-fast)',
      ...base,
      ...(active ? {
        background: 'var(--accent-soft)'
      } : h ? {
        background: 'var(--surface-hover)'
      } : {}),
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: size === 'lg' ? 20 : 16
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function Tag({
  children,
  color,
  selected,
  onRemove,
  onClick,
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    onClick: onClick,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      height: 24,
      padding: onRemove ? '0 4px 0 9px' : '0 9px',
      borderRadius: 'var(--radius-pill)',
      border: '1px solid ' + (selected ? 'var(--accent-soft-border)' : 'var(--border-default)'),
      background: selected ? 'var(--accent-soft)' : 'var(--surface-card)',
      color: selected ? 'var(--text-accent)' : 'var(--text-secondary)',
      fontSize: 'var(--fs-xs)',
      fontWeight: 'var(--fw-medium)',
      cursor: onClick ? 'pointer' : 'default',
      whiteSpace: 'nowrap',
      ...style
    }
  }, color && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: 2,
      background: color
    }
  }), children, onRemove && /*#__PURE__*/React.createElement("span", {
    role: "button",
    "aria-label": "Rimuovi",
    onClick: e => {
      e.stopPropagation();
      onRemove();
    },
    style: {
      display: 'inline-flex',
      padding: 2,
      borderRadius: 99,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 12
  })));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/data/StatCard.jsx
try { (() => {
function StatCard({
  label,
  value,
  unit,
  delta,
  trend,
  caption,
  icon,
  style
}) {
  const up = trend === 'up',
    down = trend === 'down';
  const dc = up ? 'var(--success)' : down ? 'var(--danger)' : 'var(--text-tertiary)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-1)',
      padding: '16px 18px',
      minWidth: 0,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
      color: 'var(--text-tertiary)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--fs-overline)',
      letterSpacing: 'var(--tracking-overline)',
      textTransform: 'uppercase'
    }
  }, label), icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 16
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 4,
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--fs-kpi)',
      lineHeight: 'var(--lh-kpi)',
      fontWeight: 500,
      letterSpacing: '-0.02em',
      color: 'var(--text-primary)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, value), unit && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-body)',
      color: 'var(--text-secondary)'
    }
  }, unit)), (delta || caption) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      marginTop: 6,
      fontSize: 'var(--fs-xs)'
    }
  }, delta && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 2,
      color: dc,
      fontWeight: 600
    }
  }, (up || down) && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: up ? 'arrow-up-right' : 'arrow-down-right',
    size: 12
  }), delta), caption && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-tertiary)'
    }
  }, caption)));
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/StatCard.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Progress.jsx
try { (() => {
function Progress({
  value = 0,
  max = 100,
  tone = 'accent',
  label,
  showValue,
  size = 'md',
  style
}) {
  const pct = Math.max(0, Math.min(100, value / max * 100));
  const c = {
    accent: 'var(--accent)',
    success: 'var(--success)',
    warning: 'var(--warning)',
    danger: 'var(--danger)'
  }[tone];
  return /*#__PURE__*/React.createElement("div", {
    style: style
  }, (label || showValue) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 'var(--fs-xs)',
      color: 'var(--text-secondary)',
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", null, label), showValue && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      color: 'var(--text-primary)'
    }
  }, Math.round(pct), "%")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: size === 'sm' ? 4 : 6,
      background: 'var(--surface-sunken)',
      borderRadius: 99,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: pct + '%',
      height: '100%',
      background: c,
      borderRadius: 99,
      transition: 'width var(--dur-slow) var(--ease-standard)'
    }
  })));
}
Object.assign(__ds_scope, { Progress });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Progress.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
const I = {
  neutral: ['info', 'var(--text-secondary)'],
  success: ['check-circle-2', 'var(--success)'],
  warning: ['alert-triangle', 'var(--warning)'],
  danger: ['alert-octagon', 'var(--danger)'],
  ai: ['sparkles', 'var(--text-accent)']
};
function Toast({
  tone = 'neutral',
  title,
  message,
  action,
  onClose,
  style
}) {
  const [ic, c] = I[tone];
  return /*#__PURE__*/React.createElement("div", {
    role: "status",
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'flex-start',
      width: 360,
      maxWidth: '100%',
      padding: '12px 12px 12px 14px',
      background: 'var(--surface-raised)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-3)',
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: ic,
    size: 16,
    color: c,
    style: {
      marginTop: 2
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--fs-body)',
      fontWeight: 600,
      color: 'var(--text-primary)'
    }
  }, title), message && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--fs-sm)',
      color: 'var(--text-secondary)',
      marginTop: 2
    }
  }, message), action && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8
    }
  }, action)), onClose && /*#__PURE__*/React.createElement("button", {
    "aria-label": "Chiudi",
    onClick: onClose,
    style: {
      border: 0,
      background: 'transparent',
      color: 'var(--text-tertiary)',
      cursor: 'pointer',
      padding: 2
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 14
  })));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
function Tooltip({
  content,
  children,
  placement = 'top'
}) {
  const [o, setO] = React.useState(false);
  const pos = placement === 'bottom' ? {
    top: 'calc(100% + 6px)'
  } : {
    bottom: 'calc(100% + 6px)'
  };
  return /*#__PURE__*/React.createElement("span", {
    onMouseEnter: () => setO(true),
    onMouseLeave: () => setO(false),
    onFocus: () => setO(true),
    onBlur: () => setO(false),
    style: {
      position: 'relative',
      display: 'inline-flex'
    }
  }, children, o && /*#__PURE__*/React.createElement("span", {
    role: "tooltip",
    style: {
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
      ...pos,
      background: 'var(--surface-inverse)',
      color: 'var(--text-inverse)',
      fontSize: 'var(--fs-xs)',
      lineHeight: 'var(--lh-xs)',
      padding: '5px 8px',
      borderRadius: 'var(--radius-sm)',
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
      zIndex: 50,
      boxShadow: 'var(--shadow-2)'
    }
  }, content));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function Checkbox({
  label,
  checked,
  defaultChecked,
  onChange,
  disabled,
  style
}) {
  const [c, setC] = React.useState(!!defaultChecked);
  const on = checked ?? c;
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? .45 : 1,
      fontSize: 'var(--fs-body)',
      color: 'var(--text-primary)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: on,
    disabled: disabled,
    onChange: e => {
      setC(e.target.checked);
      onChange && onChange(e.target.checked);
    },
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 16,
      height: 16,
      borderRadius: 'var(--radius-sm)',
      border: '1px solid ' + (on ? 'var(--accent)' : 'var(--border-strong)'),
      background: on ? 'var(--accent)' : 'var(--surface-card)',
      color: 'var(--on-accent)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background var(--dur-fast)'
    }
  }, on && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 12
  })), label);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const lbl = {
  display: 'block',
  fontSize: 'var(--fs-sm)',
  fontWeight: 'var(--fw-medium)',
  color: 'var(--text-primary)',
  marginBottom: 6
};
const hintS = e => ({
  fontSize: 'var(--fs-xs)',
  color: e ? 'var(--danger)' : 'var(--text-tertiary)',
  marginTop: 5
});
const box = (f, e, d) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  height: 'var(--control-h-md)',
  padding: '0 10px',
  background: d ? 'var(--surface-sunken)' : 'var(--surface-card)',
  border: '1px solid ' + (e ? 'var(--danger)' : f ? 'var(--border-focus)' : 'var(--border-default)'),
  borderRadius: 'var(--radius-md)',
  boxShadow: f ? 'var(--ring-focus)' : 'none',
  color: 'var(--text-tertiary)',
  transition: 'border-color var(--dur-fast),box-shadow var(--dur-fast)'
});
const inp = {
  flex: 1,
  minWidth: 0,
  border: 0,
  outline: 0,
  background: 'transparent',
  font: 'inherit',
  fontSize: 'var(--fs-body)',
  color: 'var(--text-primary)',
  height: '100%'
};
function Input({
  label,
  hint,
  error,
  icon,
  disabled,
  multiline,
  rows = 3,
  style,
  ...rest
}) {
  const [f, setF] = React.useState(false);
  const b = box(f, error, disabled);
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: lbl
  }, label), /*#__PURE__*/React.createElement("span", {
    style: multiline ? {
      ...b,
      height: 'auto',
      alignItems: 'flex-start',
      padding: '8px 10px'
    } : b
  }, icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 16
  }), multiline ? /*#__PURE__*/React.createElement("textarea", _extends({
    rows: rows,
    disabled: disabled,
    onFocus: () => setF(true),
    onBlur: () => setF(false),
    style: {
      ...inp,
      resize: 'vertical',
      lineHeight: 'var(--lh-body)'
    }
  }, rest)) : /*#__PURE__*/React.createElement("input", _extends({
    disabled: disabled,
    onFocus: () => setF(true),
    onBlur: () => setF(false),
    style: inp
  }, rest))), (error || hint) && /*#__PURE__*/React.createElement("span", {
    style: hintS(error)
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function Radio({
  options = [],
  value,
  defaultValue,
  onChange,
  name,
  direction = 'column',
  style
}) {
  const [v, setV] = React.useState(defaultValue);
  const cur = value ?? v;
  return /*#__PURE__*/React.createElement("div", {
    role: "radiogroup",
    style: {
      display: 'flex',
      flexDirection: direction,
      gap: direction === 'row' ? 16 : 8,
      ...style
    }
  }, options.map(o => {
    const val = typeof o === 'string' ? o : o.value,
      lab = typeof o === 'string' ? o : o.label,
      on = cur === val;
    return /*#__PURE__*/React.createElement("label", {
      key: val,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        cursor: 'pointer',
        fontSize: 'var(--fs-body)',
        color: 'var(--text-primary)'
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "radio",
      name: name,
      checked: on,
      onChange: () => {
        setV(val);
        onChange && onChange(val);
      },
      style: {
        position: 'absolute',
        opacity: 0,
        width: 0,
        height: 0
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        width: 16,
        height: 16,
        borderRadius: '50%',
        border: '1px solid ' + (on ? 'var(--accent)' : 'var(--border-strong)'),
        background: 'var(--surface-card)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, on && /*#__PURE__*/React.createElement("span", {
      style: {
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: 'var(--accent)'
      }
    })), lab);
  }));
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
const lbl = {
  display: 'block',
  fontSize: 'var(--fs-sm)',
  fontWeight: 'var(--fw-medium)',
  color: 'var(--text-primary)',
  marginBottom: 6
};
const hintS = e => ({
  fontSize: 'var(--fs-xs)',
  color: e ? 'var(--danger)' : 'var(--text-tertiary)',
  marginTop: 5
});
const box = (f, e, d) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  height: 'var(--control-h-md)',
  padding: '0 10px',
  background: d ? 'var(--surface-sunken)' : 'var(--surface-card)',
  border: '1px solid ' + (e ? 'var(--danger)' : f ? 'var(--border-focus)' : 'var(--border-default)'),
  borderRadius: 'var(--radius-md)',
  boxShadow: f ? 'var(--ring-focus)' : 'none',
  color: 'var(--text-tertiary)',
  transition: 'border-color var(--dur-fast),box-shadow var(--dur-fast)'
});
const inp = {
  flex: 1,
  minWidth: 0,
  border: 0,
  outline: 0,
  background: 'transparent',
  font: 'inherit',
  fontSize: 'var(--fs-body)',
  color: 'var(--text-primary)',
  height: '100%'
};
function Select({
  label,
  hint,
  error,
  options = [],
  value,
  defaultValue,
  onChange,
  disabled,
  style
}) {
  const [f, setF] = React.useState(false);
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: lbl
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      ...box(f, error, disabled),
      position: 'relative',
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("select", {
    value: value,
    defaultValue: defaultValue,
    onChange: onChange,
    disabled: disabled,
    onFocus: () => setF(true),
    onBlur: () => setF(false),
    style: {
      ...inp,
      appearance: 'none',
      WebkitAppearance: 'none',
      padding: '0 30px 0 10px',
      cursor: 'pointer'
    }
  }, options.map(o => typeof o === 'string' ? /*#__PURE__*/React.createElement("option", {
    key: o
  }, o) : /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value
  }, o.label))), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 14,
    style: {
      position: 'absolute',
      right: 10,
      pointerEvents: 'none'
    }
  })), (error || hint) && /*#__PURE__*/React.createElement("span", {
    style: hintS(error)
  }, error || hint));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function Switch({
  label,
  checked,
  defaultChecked,
  onChange,
  disabled,
  style
}) {
  const [c, setC] = React.useState(!!defaultChecked);
  const on = checked ?? c;
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? .45 : 1,
      fontSize: 'var(--fs-body)',
      color: 'var(--text-primary)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    role: "switch",
    "aria-checked": on,
    disabled: disabled,
    onClick: () => {
      setC(!on);
      onChange && onChange(!on);
    },
    style: {
      position: 'relative',
      width: 30,
      height: 18,
      borderRadius: 9,
      border: 0,
      padding: 0,
      background: on ? 'var(--accent)' : 'var(--border-strong)',
      cursor: 'inherit',
      transition: 'background var(--dur-base) var(--ease-standard)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 2,
      left: on ? 14 : 2,
      width: 14,
      height: 14,
      borderRadius: 7,
      background: '#FFFDF9',
      boxShadow: 'var(--shadow-1)',
      transition: 'left var(--dur-base) var(--ease-standard)'
    }
  })), label);
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/layout/Card.jsx
try { (() => {
function Card({
  title,
  eyebrow,
  actions,
  children,
  padding = 20,
  interactive,
  selected,
  footer,
  style,
  onClick
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("section", {
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      background: 'var(--surface-card)',
      border: '1px solid ' + (selected ? 'var(--accent-soft-border)' : 'var(--border-subtle)'),
      borderRadius: 'var(--radius-md)',
      boxShadow: interactive && h ? 'var(--shadow-2)' : 'var(--shadow-1)',
      cursor: interactive ? 'pointer' : 'default',
      transition: 'box-shadow var(--dur-base) var(--ease-standard),border-color var(--dur-base)',
      outline: selected ? '1px solid var(--accent-soft-border)' : 'none',
      ...style
    }
  }, (title || actions || eyebrow) && /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 12,
      padding: padding + 'px ' + padding + 'px 0'
    }
  }, /*#__PURE__*/React.createElement("div", null, eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--fs-overline)',
      letterSpacing: 'var(--tracking-overline)',
      textTransform: 'uppercase',
      color: 'var(--text-tertiary)',
      marginBottom: 4
    }
  }, eyebrow), title && /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-heading)',
      fontSize: 'var(--fs-h3)',
      lineHeight: 'var(--lh-h3)',
      fontWeight: 500,
      margin: 0,
      color: 'var(--text-primary)'
    }
  }, title)), actions && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      flex: 'none'
    }
  }, actions)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding
    }
  }, children), footer && /*#__PURE__*/React.createElement("footer", {
    style: {
      borderTop: '1px solid var(--border-subtle)',
      padding: '12px ' + padding + 'px',
      background: 'var(--surface-sunken)',
      borderRadius: '0 0 var(--radius-md) var(--radius-md)'
    }
  }, footer));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/Card.jsx", error: String((e && e.message) || e) }); }

// components/layout/Dialog.jsx
try { (() => {
function Dialog({
  open,
  title,
  description,
  children,
  footer,
  onClose,
  width = 480
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      background: 'var(--overlay-scrim)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    onClick: e => e.stopPropagation(),
    style: {
      width: '100%',
      maxWidth: width,
      background: 'var(--surface-raised)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-3)',
      border: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 12,
      padding: '20px 20px 0'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-heading)',
      fontSize: 'var(--fs-h2)',
      lineHeight: 'var(--lh-h2)',
      fontWeight: 500,
      margin: 0,
      color: 'var(--text-primary)'
    }
  }, title), description && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '6px 0 0',
      color: 'var(--text-secondary)',
      fontSize: 'var(--fs-body)'
    }
  }, description)), onClose && /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "x",
    label: "Chiudi",
    onClick: onClose
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20
    }
  }, children), footer && /*#__PURE__*/React.createElement("footer", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 8,
      padding: '12px 20px',
      borderTop: '1px solid var(--border-subtle)'
    }
  }, footer)));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/layout/Tabs.jsx
try { (() => {
function Tabs({
  tabs = [],
  value,
  defaultValue,
  onChange,
  variant = 'underline',
  style
}) {
  const [v, setV] = React.useState(defaultValue ?? (tabs[0] && (tabs[0].value ?? tabs[0])));
  const cur = value ?? v;
  const seg = variant === 'segmented';
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: 'flex',
      gap: seg ? 2 : 20,
      ...(seg ? {
        padding: 2,
        background: 'var(--surface-sunken)',
        borderRadius: 'var(--radius-md)',
        width: 'fit-content'
      } : {
        borderBottom: '1px solid var(--border-subtle)'
      }),
      ...style
    }
  }, tabs.map(t => {
    const val = t.value ?? t,
      lab = t.label ?? t,
      on = val === cur;
    return /*#__PURE__*/React.createElement("button", {
      key: val,
      role: "tab",
      "aria-selected": on,
      onClick: () => {
        setV(val);
        onChange && onChange(val);
      },
      style: seg ? {
        height: 28,
        padding: '0 12px',
        border: 0,
        borderRadius: 4,
        background: on ? 'var(--surface-card)' : 'transparent',
        boxShadow: on ? 'var(--shadow-1)' : 'none',
        color: on ? 'var(--text-primary)' : 'var(--text-tertiary)',
        font: 'inherit',
        fontSize: 'var(--fs-sm)',
        fontWeight: 500,
        cursor: 'pointer'
      } : {
        height: 36,
        padding: 0,
        border: 0,
        borderBottom: '2px solid ' + (on ? 'var(--accent)' : 'transparent'),
        marginBottom: -1,
        background: 'transparent',
        color: on ? 'var(--text-primary)' : 'var(--text-tertiary)',
        font: 'inherit',
        fontSize: 'var(--fs-body)',
        fontWeight: 500,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6
      }
    }, lab, t.count != null && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: 'var(--text-tertiary)',
        fontFamily: 'var(--font-mono)'
      }
    }, t.count));
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mobile-app/Screens.jsx
try { (() => {
(() => {
  const {
    Icon,
    IconButton,
    Button,
    Input,
    Badge,
    Progress,
    Tag,
    Avatar,
    StatCard,
    Radio,
    Select
  } = window.DS;
  function Phone({
    children,
    tab,
    setTab,
    title,
    action
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: 390,
        height: 800,
        borderRadius: 44,
        background: 'var(--surface-page)',
        border: '10px solid #1F1B16',
        boxShadow: 'var(--shadow-3)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        flex: 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: 44,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        fontSize: 14,
        fontWeight: 600
      }
    }, /*#__PURE__*/React.createElement("span", null, "9:41"), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "signal",
      size: 14
    }), /*#__PURE__*/React.createElement(Icon, {
      name: "wifi",
      size: 14
    }), /*#__PURE__*/React.createElement(Icon, {
      name: "battery-full",
      size: 16
    }))), /*#__PURE__*/React.createElement("header", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 20px 12px'
      }
    }, /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: 28,
        lineHeight: '34px'
      }
    }, title), action), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        overflow: 'auto',
        padding: '0 20px 20px'
      }
    }, children), /*#__PURE__*/React.createElement("nav", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4,1fr)',
        borderTop: '1px solid var(--border-subtle)',
        background: 'var(--surface-card)',
        paddingBottom: 18
      }
    }, [['home', 'house', 'Home'], ['ideas', 'lightbulb', 'Idee'], ['funding', 'landmark', 'Bandi'], ['ai', 'sparkles', 'Assistente']].map(([id, ic, l]) => /*#__PURE__*/React.createElement("button", {
      key: id,
      onClick: () => setTab(id),
      style: {
        minHeight: 'var(--tap-min)',
        padding: '8px 0 0',
        border: 0,
        background: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        color: tab === id ? 'var(--accent)' : 'var(--text-tertiary)',
        font: 'inherit',
        fontSize: 11,
        fontWeight: 500,
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: ic,
      size: 24
    }), l))));
  }
  function Home() {
    const D = window.IMIS_DATA;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(StatCard, {
      label: "Idee attive",
      value: "59",
      delta: "+14",
      trend: "up"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Progetti",
      value: "5",
      delta: "1 a rischio",
      trend: "down"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        letterSpacing: '.08em',
        textTransform: 'uppercase',
        color: 'var(--text-tertiary)',
        marginTop: 8
      }
    }, "I miei progetti"), D.projects.slice(0, 3).map(p => {
      const [tone, lab] = window.MHEALTH[p.health];
      return /*#__PURE__*/React.createElement("div", {
        key: p.id,
        style: {
          background: 'var(--surface-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 10,
          padding: 16,
          boxShadow: 'var(--shadow-1)'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          gap: 8
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: 600,
          fontSize: 15
        }
      }, p.title), /*#__PURE__*/React.createElement(Icon, {
        name: "chevron-right",
        size: 18,
        color: "var(--text-tertiary)"
      })), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          margin: '10px 0'
        }
      }, /*#__PURE__*/React.createElement(Badge, {
        tone: tone,
        dot: true
      }, lab), /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--text-tertiary)'
        }
      }, p.id)), /*#__PURE__*/React.createElement(Progress, {
        value: p.progress,
        size: "sm"
      }));
    }));
  }
  function Capture({
    done
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        color: 'var(--text-secondary)',
        fontSize: 15,
        lineHeight: '22px'
      }
    }, "Annota l\u2019idea adesso, la completi dopo dal desktop."), /*#__PURE__*/React.createElement(Input, {
      label: "Titolo",
      placeholder: "Es. App per officine"
    }), /*#__PURE__*/React.createElement(Input, {
      label: "Problema / opportunit\xE0",
      multiline: true,
      rows: 4
    }), /*#__PURE__*/React.createElement(Select, {
      label: "Area",
      options: ['Industria 4.0', 'Sostenibilità', 'IA generativa']
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 500,
        marginBottom: 10
      }
    }, "Impatto atteso"), /*#__PURE__*/React.createElement(Radio, {
      name: "m-imp",
      direction: "row",
      options: ['Basso', 'Medio', 'Alto'],
      defaultValue: "Medio"
    })), /*#__PURE__*/React.createElement(Button, {
      size: "lg",
      fullWidth: true,
      icon: "mic",
      variant: "secondary"
    }, "Detta con la voce"), /*#__PURE__*/React.createElement(Button, {
      size: "lg",
      fullWidth: true,
      onClick: done
    }, "Salva idea"));
  }
  function Funding() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        overflow: 'auto'
      }
    }, /*#__PURE__*/React.createElement(Tag, {
      selected: true
    }, "Compatibili"), /*#__PURE__*/React.createElement(Tag, null, "In scadenza"), /*#__PURE__*/React.createElement(Tag, null, "Liguria")), window.IMIS_DATA.calls.map(c => /*#__PURE__*/React.createElement("div", {
      key: c.t,
      style: {
        background: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 10,
        padding: 16,
        minHeight: 'var(--tap-min)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 600,
        fontSize: 15,
        lineHeight: '20px'
      }
    }, c.t), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 18,
        fontWeight: 500,
        color: c.m >= 80 ? 'var(--success)' : 'var(--text-primary)'
      }
    }, c.m, "%")), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: 'var(--text-tertiary)',
        margin: '4px 0 10px'
      }
    }, c.e), /*#__PURE__*/React.createElement(Badge, {
      tone: c.days <= 14 ? 'warning' : 'neutral'
    }, c.st === 'rolling' ? 'A sportello' : 'Scade in ' + c.days + ' gg'))));
  }
  function Assistant() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        height: '100%'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 15,
        lineHeight: '22px'
      }
    }, "Ciao Giulia. Questa settimana: revisione di fase P-041 (12 nov) e Voucher Transizione Digitale in scadenza l\u20198 novembre."), /*#__PURE__*/React.createElement("div", {
      style: {
        alignSelf: 'flex-end',
        background: 'var(--surface-sunken)',
        padding: '10px 14px',
        borderRadius: '14px 14px 4px 14px',
        fontSize: 15
      }
    }, "Prepara la candidatura al voucher"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 15,
        lineHeight: '22px'
      }
    }, "Ho compilato 6 sezioni su 9 usando i dati di P-024. Mancano: preventivi fornitori, DURC, firma digitale."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement(Tag, null, "Apri bozza"), /*#__PURE__*/React.createElement(Tag, null, "Invia al consulente")), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        border: '1px solid var(--border-default)',
        borderRadius: 99,
        padding: '4px 4px 4px 16px',
        background: 'var(--surface-card)',
        minHeight: 'var(--tap-min)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        color: 'var(--text-tertiary)',
        fontSize: 15
      }
    }, "Chiedi all\u2019assistente\u2026"), /*#__PURE__*/React.createElement(IconButton, {
      icon: "mic",
      label: "Voce",
      size: "lg"
    })));
  }
  window.MHEALTH = {
    ok: ['success', 'In linea'],
    risk: ['warning', 'A rischio'],
    late: ['danger', 'In ritardo']
  };
  Object.assign(window, {
    Phone,
    Home,
    Capture,
    Funding,
    Assistant
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile-app/Screens.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/AIPanel.jsx
try { (() => {
(() => {
  const {
    Icon,
    IconButton,
    Button,
    Tag
  } = window.DS;
  function AIPanel({
    onClose,
    context
  }) {
    const [msgs, setMsgs] = React.useState([{
      r: 'ai',
      x: 'Buongiorno Giulia. Ho trovato 2 bandi compatibili con il portfolio e un progetto in ritardo (P-041). Da dove vuoi iniziare?'
    }]);
    const [v, setV] = React.useState('');
    const send = q => {
      const x = (q || v).trim();
      if (!x) return;
      setV('');
      setMsgs(m => [...m, {
        r: 'me',
        x
      }]);
      setTimeout(() => setMsgs(m => [...m, {
        r: 'ai',
        x: 'Ecco una sintesi: il progetto P-041 ha consumato il 52% del budget con il 47% di avanzamento. Suggerisco di anticipare la revisione di fase al 12 novembre e verificare l’ammissibilità al Voucher Transizione Digitale (scade tra 10 giorni).',
        src: ['P-041', 'Voucher CCIAA']
      }]), 700);
    };
    return /*#__PURE__*/React.createElement("aside", {
      style: {
        width: 'var(--ai-panel-w)',
        flex: 'none',
        borderLeft: '1px solid var(--border-subtle)',
        background: 'var(--surface-card)',
        display: 'flex',
        flexDirection: 'column'
      }
    }, /*#__PURE__*/React.createElement("header", {
      style: {
        height: 'var(--topbar-h)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '0 12px 0 16px',
        borderBottom: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "sparkles",
      size: 16,
      color: "var(--accent)"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-serif)',
        fontSize: 18
      }
    }, "Assistente"), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1
      }
    }), /*#__PURE__*/React.createElement(IconButton, {
      icon: "history",
      label: "Cronologia",
      size: "sm"
    }), /*#__PURE__*/React.createElement(IconButton, {
      icon: "x",
      label: "Chiudi",
      size: "sm",
      onClick: onClose
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '10px 16px',
        borderBottom: '1px solid var(--border-subtle)',
        fontSize: 12,
        color: 'var(--text-tertiary)',
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "at-sign",
      size: 12
    }), "Contesto: ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-secondary)',
        fontWeight: 500
      }
    }, context)), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        overflow: 'auto',
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, msgs.map((m, i) => m.r === 'me' ? /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        alignSelf: 'flex-end',
        maxWidth: '85%',
        background: 'var(--surface-sunken)',
        padding: '8px 12px',
        borderRadius: '10px 10px 2px 10px',
        fontSize: 14
      }
    }, m.x) : /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        fontSize: 14,
        lineHeight: '21px',
        color: 'var(--text-primary)'
      }
    }, m.x, m.src && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6,
        marginTop: 8
      }
    }, m.src.map(s => /*#__PURE__*/React.createElement(Tag, {
      key: s
    }, s)))))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 12,
        borderTop: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6,
        flexWrap: 'wrap',
        marginBottom: 10
      }
    }, ['Riassumi il portfolio', 'Bandi in scadenza', 'Rischi della settimana'].map(s => /*#__PURE__*/React.createElement(Tag, {
      key: s,
      onClick: () => send(s)
    }, s))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        gap: 6,
        border: '1px solid var(--border-default)',
        borderRadius: 6,
        padding: 6,
        background: 'var(--surface-page)'
      }
    }, /*#__PURE__*/React.createElement("textarea", {
      value: v,
      onChange: e => setV(e.target.value),
      onKeyDown: e => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          send();
        }
      },
      rows: 2,
      placeholder: "Chiedi all\u2019assistente\u2026",
      style: {
        flex: 1,
        border: 0,
        outline: 0,
        resize: 'none',
        background: 'transparent',
        font: 'inherit',
        fontSize: 14,
        color: 'var(--text-primary)',
        padding: 4
      }
    }), /*#__PURE__*/React.createElement(IconButton, {
      icon: "arrow-up",
      label: "Invia",
      variant: "secondary",
      onClick: () => send()
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: 'var(--text-tertiary)',
        marginTop: 8
      }
    }, "Le risposte dell\u2019IA possono contenere errori. Verifica sempre le fonti.")));
  }
  window.AIPanel = AIPanel;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/AIPanel.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/Funding.jsx
try { (() => {
(() => {
  const {
    Card,
    Badge,
    Button,
    Select,
    Input,
    Progress,
    Icon,
    Checkbox
  } = window.DS;
  function Funding({
    lang,
    toast
  }) {
    const D = window.IMIS_DATA;
    const [sel, setSel] = React.useState(0);
    const c = D.calls[sel];
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PageHead, {
      eyebrow: "Opportunit\xE0",
      title: lang === 'en' ? 'Funding & grants' : 'Bandi e finanziamenti',
      sub: "Bandi aperti filtrati per regione, dimensione d\u2019impresa e affinit\xE0 con i progetti in corso."
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1.3fr) minmax(0,1fr)',
        gap: 16,
        alignItems: 'start'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 10,
        marginBottom: 6
      }
    }, /*#__PURE__*/React.createElement(Select, {
      options: ['Tutte le regioni', 'Liguria', 'Nazionale', 'UE']
    }), /*#__PURE__*/React.createElement(Select, {
      options: ['PMI', 'Grande impresa']
    }), /*#__PURE__*/React.createElement(Select, {
      options: ['Ordina per affinità', 'Ordina per scadenza']
    })), D.calls.map((x, i) => /*#__PURE__*/React.createElement(Card, {
      key: x.t,
      interactive: true,
      selected: i === sel,
      padding: 16,
      onClick: () => setSel(i)
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 14,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 600,
        fontSize: 14
      }
    }, x.t), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: 'var(--text-tertiary)',
        marginTop: 2
      }
    }, x.e, " \xB7 ", x.amt)), /*#__PURE__*/React.createElement(Badge, {
      tone: x.days <= 14 ? 'warning' : 'neutral'
    }, x.st === 'rolling' ? 'A sportello' : x.days + ' gg'), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'right',
        width: 52
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 20,
        fontWeight: 500,
        fontVariantNumeric: 'tabular-nums',
        color: x.m >= 80 ? 'var(--success)' : 'var(--text-primary)'
      }
    }, x.m, "%"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        fontFamily: 'var(--font-mono)',
        color: 'var(--text-tertiary)',
        textTransform: 'uppercase'
      }
    }, "affinit\xE0")))))), /*#__PURE__*/React.createElement(Card, {
      eyebrow: c.e,
      title: c.t,
      footer: /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          gap: 8,
          justifyContent: 'flex-end'
        }
      }, /*#__PURE__*/React.createElement(Button, {
        variant: "secondary",
        icon: "file-text"
      }, "Testo del bando"), /*#__PURE__*/React.createElement(Button, {
        icon: "sparkles",
        onClick: () => toast('Bozza di candidatura generata', 'L’assistente ha compilato 6 sezioni su 9.')
      }, "Prepara candidatura"))
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 12,
        marginBottom: 18
      }
    }, [['Contributo', c.amt], ['Intensità', c.pct], ['Scadenza', c.dl]].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
      key: k
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        letterSpacing: '.08em',
        textTransform: 'uppercase',
        color: 'var(--text-tertiary)'
      }
    }, k), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 500,
        marginTop: 4
      }
    }, v)))), /*#__PURE__*/React.createElement(Progress, {
      label: "Affinit\xE0 con il portfolio",
      value: c.m,
      showValue: true,
      tone: c.m >= 80 ? 'success' : 'accent'
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 600,
        fontSize: 13,
        margin: '18px 0 10px'
      }
    }, "Requisiti di ammissibilit\xE0"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, [['Sede operativa in Liguria', true], ['PMI secondo definizione UE', true], ['Progetto con TRL ≥ 5', true], ['Cofinanziamento del 50% disponibile', false]].map(([t, k]) => /*#__PURE__*/React.createElement(Checkbox, {
      key: t,
      label: t,
      defaultChecked: k
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        marginTop: 16,
        fontSize: 12,
        color: 'var(--text-tertiary)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "link",
      size: 13
    }), "Progetti collegati: ", /*#__PURE__*/React.createElement("b", {
      style: {
        color: 'var(--text-secondary)',
        fontWeight: 500
      }
    }, "P-024, P-041")))));
  }
  window.Funding = Funding;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/Funding.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/Pipeline.jsx
try { (() => {
(() => {
  const {
    Card,
    Button,
    Tabs,
    Avatar,
    IconButton,
    Icon,
    Badge
  } = window.DS;
  function IdeaCard({
    i,
    stage,
    onMove
  }) {
    const [h, setH] = React.useState(false);
    return /*#__PURE__*/React.createElement("div", {
      onMouseEnter: () => setH(true),
      onMouseLeave: () => setH(false),
      style: {
        background: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 6,
        padding: 12,
        boxShadow: h ? 'var(--shadow-2)' : 'var(--shadow-1)',
        transition: 'box-shadow var(--dur-base)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 500,
        fontSize: 14,
        lineHeight: '19px'
      }
    }, i.t), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginTop: 12
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: i.a,
      size: 20
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: 'var(--text-tertiary)',
        flex: 1
      }
    }, i.a.split(' ')[0]), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 3,
        fontSize: 12,
        color: 'var(--text-secondary)',
        fontFamily: 'var(--font-mono)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "thumbs-up",
      size: 12
    }), i.v), stage !== 'scale' && h && /*#__PURE__*/React.createElement(IconButton, {
      icon: "arrow-right",
      label: "Avanza fase",
      size: "sm",
      onClick: onMove
    })));
  }
  function Pipeline({
    lang
  }) {
    const D = window.IMIS_DATA;
    const [ideas, setIdeas] = React.useState(D.ideas);
    const move = (sid, idx) => {
      const order = D.stages.map(s => s.id);
      const nx = order[order.indexOf(sid) + 1];
      setIdeas(o => {
        const n = {
          ...o
        };
        const it = n[sid][idx];
        n[sid] = n[sid].filter((_, k) => k !== idx);
        n[nx] = [it, ...n[nx]];
        return n;
      });
    };
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PageHead, {
      eyebrow: "Funnel di innovazione",
      title: lang === 'en' ? 'Idea pipeline' : 'Pipeline delle idee',
      sub: "Ogni idea passa da cinque fasi con criteri di uscita espliciti. Passa il cursore su una scheda per farla avanzare.",
      right: /*#__PURE__*/React.createElement(Tabs, {
        variant: "segmented",
        tabs: ['Kanban', 'Tabella']
      })
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(5,minmax(200px,1fr))',
        gap: 12,
        alignItems: 'start'
      }
    }, D.stages.map(s => /*#__PURE__*/React.createElement("section", {
      key: s.id,
      style: {
        background: 'var(--surface-sunken)',
        borderRadius: 6,
        padding: 10,
        minHeight: 420
      }
    }, /*#__PURE__*/React.createElement("header", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '2px 4px 10px'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 8,
        height: 8,
        borderRadius: 2,
        background: s.c
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 600,
        fontSize: 13
      }
    }, s[lang]), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--text-tertiary)'
      }
    }, ideas[s.id].length), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1
      }
    }), /*#__PURE__*/React.createElement(IconButton, {
      icon: "plus",
      label: "Aggiungi",
      size: "sm"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, ideas[s.id].map((i, k) => /*#__PURE__*/React.createElement(IdeaCard, {
      key: i.t,
      i: i,
      stage: s.id,
      onMove: () => move(s.id, k)
    })))))));
  }
  window.Pipeline = Pipeline;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/Pipeline.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/Portfolio.jsx
try { (() => {
(() => {
  const {
    Card,
    StatCard,
    Badge,
    Progress,
    AvatarGroup,
    IconButton,
    Button,
    Tabs
  } = window.DS;
  const HEALTH = {
    ok: ['success', 'In linea'],
    risk: ['warning', 'A rischio'],
    late: ['danger', 'In ritardo']
  };
  const fmtE = n => '€ ' + n.toLocaleString('it-IT');
  function StageBar() {
    const D = window.IMIS_DATA;
    const counts = D.stages.map(s => D.ideas[s.id].length + (s.id === 'idea' ? 36 : s.id === 'screening' ? 14 : s.id === 'validation' ? 6 : s.id === 'pilot' ? 2 : 1));
    const tot = counts.reduce((a, b) => a + b, 0);
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        height: 10,
        borderRadius: 99,
        overflow: 'hidden',
        gap: 2
      }
    }, D.stages.map((s, i) => /*#__PURE__*/React.createElement("div", {
      key: s.id,
      style: {
        flex: counts[i],
        background: s.c
      }
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(5,1fr)',
        marginTop: 14
      }
    }, D.stages.map((s, i) => /*#__PURE__*/React.createElement("div", {
      key: s.id
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 12,
        color: 'var(--text-tertiary)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 8,
        height: 8,
        borderRadius: 2,
        background: s.c
      }
    }), s.it), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 22,
        fontWeight: 500,
        marginTop: 4,
        fontVariantNumeric: 'tabular-nums'
      }
    }, counts[i])))));
  }
  function ProjectRow({
    p,
    open
  }) {
    const [h, setH] = React.useState(false);
    const st = window.IMIS_DATA.stages.find(s => s.id === p.stage);
    const [tone, lab] = HEALTH[p.health];
    return /*#__PURE__*/React.createElement("tr", {
      onClick: () => open(p),
      onMouseEnter: () => setH(true),
      onMouseLeave: () => setH(false),
      style: {
        cursor: 'pointer',
        background: h ? 'var(--surface-hover)' : 'transparent'
      }
    }, /*#__PURE__*/React.createElement("td", {
      style: td
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 500
      }
    }, p.title), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--text-tertiary)',
        marginTop: 2
      }
    }, p.id, " \xB7 ", p.area)), /*#__PURE__*/React.createElement("td", {
      style: td
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 13
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 8,
        height: 8,
        borderRadius: 2,
        background: st.c
      }
    }), st.it)), /*#__PURE__*/React.createElement("td", {
      style: {
        ...td,
        width: 160
      }
    }, /*#__PURE__*/React.createElement(Progress, {
      value: p.progress,
      size: "sm"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: 'var(--text-tertiary)',
        marginTop: 4,
        fontFamily: 'var(--font-mono)'
      }
    }, p.progress, "%")), /*#__PURE__*/React.createElement("td", {
      style: {
        ...td,
        fontVariantNumeric: 'tabular-nums',
        fontSize: 13
      }
    }, fmtE(p.budget)), /*#__PURE__*/React.createElement("td", {
      style: td
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: tone,
      dot: true
    }, lab)), /*#__PURE__*/React.createElement("td", {
      style: td
    }, /*#__PURE__*/React.createElement(AvatarGroup, {
      names: p.team,
      size: 22
    })));
  }
  const td = {
    padding: '12px 16px',
    borderTop: '1px solid var(--border-subtle)',
    verticalAlign: 'middle'
  };
  const th = {
    padding: '10px 16px',
    textAlign: 'left',
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    fontWeight: 400,
    letterSpacing: '.08em',
    textTransform: 'uppercase',
    color: 'var(--text-tertiary)'
  };
  function Portfolio({
    open,
    go
  }) {
    const D = window.IMIS_DATA;
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PageHead, {
      eyebrow: "Ottobre 2026 \xB7 T4",
      title: "Buongiorno, Giulia",
      sub: "5 progetti attivi, 2 bandi compatibili in scadenza e una revisione di fase questa settimana.",
      right: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
        variant: "secondary",
        icon: "download"
      }, "Esporta"))
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4,minmax(0,1fr))',
        gap: 16,
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement(StatCard, {
      label: "Idee attive",
      value: "59",
      delta: "+14",
      trend: "up",
      caption: "vs T3",
      icon: "lightbulb"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Progetti in corso",
      value: "5",
      delta: "+1",
      trend: "up",
      caption: "vs T3",
      icon: "folder-kanban"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Budget allocato",
      value: "\u20AC 330",
      unit: "k",
      delta: "59% speso",
      caption: "",
      icon: "wallet"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Time-to-pilot",
      value: "74",
      unit: "gg",
      delta: "\u22129 gg",
      trend: "up",
      caption: "mediana",
      icon: "timer"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr)',
        gap: 16,
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement(Card, {
      eyebrow: "Funnel",
      title: "Distribuzione per fase",
      actions: /*#__PURE__*/React.createElement(Button, {
        variant: "ghost",
        size: "sm",
        iconRight: "arrow-right",
        onClick: () => go('pipeline')
      }, "Pipeline")
    }, /*#__PURE__*/React.createElement(StageBar, null)), /*#__PURE__*/React.createElement(Card, {
      eyebrow: "Prossime scadenze",
      title: "Questa settimana",
      padding: 20
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }
    }, [['flag', 'Revisione di fase P-041', '12 nov', 'danger'], ['landmark', 'Voucher Transizione Digitale', '8 nov', 'warning'], ['users', 'Comitato innovazione', '14 nov', 'neutral']].map(([ic, t, d, tone]) => /*#__PURE__*/React.createElement("div", {
      key: t,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        fontSize: 13
      }
    }, /*#__PURE__*/React.createElement(window.DS.Icon, {
      name: ic,
      size: 16,
      color: "var(--text-tertiary)"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1
      }
    }, t), /*#__PURE__*/React.createElement(Badge, {
      tone: tone
    }, d)))))), /*#__PURE__*/React.createElement(Card, {
      title: "Progetti attivi",
      eyebrow: "Portfolio",
      padding: 0,
      actions: /*#__PURE__*/React.createElement("div", {
        style: {
          padding: '0 0 0 0'
        }
      }, /*#__PURE__*/React.createElement(Tabs, {
        variant: "segmented",
        tabs: ['Tutti', 'A rischio', 'Miei']
      })),
      style: {
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: 16
      }
    }), /*#__PURE__*/React.createElement("table", {
      style: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: 14
      }
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
      style: th
    }, "Progetto"), /*#__PURE__*/React.createElement("th", {
      style: th
    }, "Fase"), /*#__PURE__*/React.createElement("th", {
      style: th
    }, "Avanzamento"), /*#__PURE__*/React.createElement("th", {
      style: th
    }, "Budget"), /*#__PURE__*/React.createElement("th", {
      style: th
    }, "Stato"), /*#__PURE__*/React.createElement("th", {
      style: th
    }, "Team"))), /*#__PURE__*/React.createElement("tbody", null, D.projects.map(p => /*#__PURE__*/React.createElement(ProjectRow, {
      key: p.id,
      p: p,
      open: open
    }))))));
  }
  Object.assign(window, {
    Portfolio,
    HEALTH,
    fmtE
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/Portfolio.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/ProjectDetail.jsx
try { (() => {
(() => {
  const {
    Card,
    Button,
    Tabs,
    Badge,
    Progress,
    AvatarGroup,
    Avatar,
    Checkbox,
    Icon,
    Tag,
    Tooltip
  } = window.DS;
  function ProjectDetail({
    p
  }) {
    const D = window.IMIS_DATA;
    const [tab, setTab] = React.useState('ov');
    const [tone, lab] = HEALTH[p.health];
    const order = D.stages.map(s => s.id);
    const cur = order.indexOf(p.stage);
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PageHead, {
      eyebrow: p.id + ' · ' + p.area,
      title: p.title,
      sub: p.desc,
      right: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
        variant: "secondary",
        icon: "share-2"
      }, "Condividi"), /*#__PURE__*/React.createElement(Button, {
        icon: "flag"
      }, "Richiedi revisione"))
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 0,
        marginBottom: 20
      }
    }, D.stages.map((s, i) => /*#__PURE__*/React.createElement("div", {
      key: s.id,
      style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: 4,
        background: i <= cur ? s.c : 'var(--border-subtle)',
        marginRight: 2,
        borderRadius: 2
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: i === cur ? 'var(--text-primary)' : 'var(--text-tertiary)',
        fontWeight: i === cur ? 600 : 400
      }
    }, s.it)))), /*#__PURE__*/React.createElement(Tabs, {
      value: tab,
      onChange: setTab,
      tabs: [{
        value: 'ov',
        label: 'Panoramica'
      }, {
        value: 'tk',
        label: 'Attività',
        count: 8
      }, {
        value: 'dc',
        label: 'Documenti',
        count: 4
      }, {
        value: 'fn',
        label: 'Finanziamenti'
      }],
      style: {
        marginBottom: 20
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr)',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(Card, {
      title: "Criteri di uscita \u2014 Pilota",
      eyebrow: "Gate review"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, [['KPI tecnico validato su 3 mesi di dati', true], ['Business case approvato dal CFO', true], ['Piano di scala con fornitore selezionato', false], ['Valutazione rischi GDPR', false]].map(([t, c]) => /*#__PURE__*/React.createElement(Checkbox, {
      key: t,
      label: t,
      defaultChecked: c
    })))), /*#__PURE__*/React.createElement(Card, {
      title: "Attivit\xE0 recenti",
      padding: 20
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, [['Marco Rossi', 'ha caricato', 'Report test sensori — settembre.pdf', '2 gg fa'], ['Assistente IA', 'ha suggerito', 'bando PR FESR Liguria (82%)', '3 gg fa'], ['Ada Bianchi', 'ha completato', 'Business case v2', '1 sett fa']].map(([a, v, o, d]) => /*#__PURE__*/React.createElement("div", {
      key: o,
      style: {
        display: 'flex',
        gap: 10,
        alignItems: 'flex-start',
        fontSize: 13
      }
    }, a === 'Assistente IA' ? /*#__PURE__*/React.createElement("span", {
      style: {
        width: 24,
        height: 24,
        borderRadius: 12,
        background: 'var(--accent-soft)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "sparkles",
      size: 13,
      color: "var(--accent)"
    })) : /*#__PURE__*/React.createElement(Avatar, {
      name: a,
      size: 24
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("b", {
      style: {
        fontWeight: 600
      }
    }, a), " ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-secondary)'
      }
    }, v), " ", o), /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-tertiary)',
        fontSize: 12
      }
    }, d)))))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(Card, {
      padding: 20
    }, /*#__PURE__*/React.createElement("dl", {
      style: {
        margin: 0,
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        rowGap: 12,
        columnGap: 16,
        fontSize: 13
      }
    }, /*#__PURE__*/React.createElement("dt", {
      style: dt
    }, "Stato"), /*#__PURE__*/React.createElement("dd", {
      style: dd
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: tone,
      dot: true
    }, lab)), /*#__PURE__*/React.createElement("dt", {
      style: dt
    }, "Owner"), /*#__PURE__*/React.createElement("dd", {
      style: dd
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        gap: 6,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: p.owner,
      size: 20
    }), p.owner)), /*#__PURE__*/React.createElement("dt", {
      style: dt
    }, "Team"), /*#__PURE__*/React.createElement("dd", {
      style: dd
    }, /*#__PURE__*/React.createElement(AvatarGroup, {
      names: p.team,
      size: 22
    })), /*#__PURE__*/React.createElement("dt", {
      style: dt
    }, "Maturit\xE0"), /*#__PURE__*/React.createElement("dd", {
      style: dd
    }, /*#__PURE__*/React.createElement(Tooltip, {
      content: "Technology Readiness Level"
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: "info"
    }, "TRL ", p.trl))), /*#__PURE__*/React.createElement("dt", {
      style: dt
    }, "Area"), /*#__PURE__*/React.createElement("dd", {
      style: dd
    }, /*#__PURE__*/React.createElement(Tag, null, p.area)))), /*#__PURE__*/React.createElement(Card, {
      eyebrow: "Budget",
      title: fmtE(p.spent) + ' / ' + fmtE(p.budget)
    }, /*#__PURE__*/React.createElement(Progress, {
      value: p.spent,
      max: p.budget,
      showValue: true,
      label: "Speso"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 14
      }
    }), /*#__PURE__*/React.createElement(Progress, {
      value: p.progress,
      showValue: true,
      label: "Avanzamento",
      tone: "success"
    })))));
  }
  const dt = {
      color: 'var(--text-tertiary)'
    },
    dd = {
      margin: 0
    };
  window.ProjectDetail = ProjectDetail;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/ProjectDetail.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/Reports.jsx
try { (() => {
(() => {
  const {
    Card,
    StatCard,
    Tabs,
    Button
  } = window.DS;
  function Bars({
    a,
    b,
    labels
  }) {
    const max = Math.max(...a);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        gap: 28,
        height: 180,
        padding: '0 8px'
      }
    }, a.map((v, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        height: '100%',
        justifyContent: 'flex-end'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 4,
        alignItems: 'flex-end',
        height: '100%',
        width: '100%',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      title: 'Idee: ' + v,
      style: {
        width: 28,
        height: v / max * 100 + '%',
        background: 'var(--bronze-200)',
        borderRadius: '3px 3px 0 0'
      }
    }), /*#__PURE__*/React.createElement("div", {
      title: 'Convertite: ' + b[i],
      style: {
        width: 28,
        height: b[i] / max * 100 + '%',
        background: 'var(--accent)',
        borderRadius: '3px 3px 0 0'
      }
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--text-tertiary)'
      }
    }, labels[i]))));
  }
  function Reports({
    lang
  }) {
    const K = window.IMIS_DATA.kpis;
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PageHead, {
      eyebrow: "Anno 2026",
      title: lang === 'en' ? 'Reports & KPIs' : 'Report e KPI',
      sub: "Indicatori di processo e di risultato del sistema di gestione dell\u2019innovazione (UNI/PdR ISO 56002).",
      right: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Tabs, {
        variant: "segmented",
        tabs: ['Trimestre', 'Anno'],
        defaultValue: "Anno"
      }), /*#__PURE__*/React.createElement(Button, {
        variant: "secondary",
        icon: "file-down"
      }, "PDF"))
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4,minmax(0,1fr))',
        gap: 16,
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement(StatCard, {
      label: "Idee raccolte",
      value: "258",
      delta: "+38%",
      trend: "up",
      caption: "vs 2025"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Tasso di conversione",
      value: "15,9",
      unit: "%",
      delta: "+2,1 pt",
      trend: "up"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "ROI innovazione",
      value: "2,4",
      unit: "\xD7",
      delta: "stabile"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Contributi ottenuti",
      value: "\u20AC 186",
      unit: "k",
      delta: "3 bandi",
      caption: "vinti"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr)',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(Card, {
      eyebrow: "Funnel",
      title: "Idee raccolte e convertite in progetti",
      actions: /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          gap: 14,
          fontSize: 12,
          color: 'var(--text-secondary)'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6
        }
      }, /*#__PURE__*/React.createElement("i", {
        style: {
          width: 10,
          height: 10,
          background: 'var(--bronze-200)',
          borderRadius: 2
        }
      }), "Raccolte"), /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6
        }
      }, /*#__PURE__*/React.createElement("i", {
        style: {
          width: 10,
          height: 10,
          background: 'var(--accent)',
          borderRadius: 2
        }
      }), "Convertite"))
    }, /*#__PURE__*/React.createElement(Bars, {
      a: K.ideas,
      b: K.converted,
      labels: K.quarters
    })), /*#__PURE__*/React.createElement(Card, {
      eyebrow: "Ripartizione",
      title: "Budget per area"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }
    }, [['Industria 4.0', 41, 'var(--stage-pilot)'], ['IA generativa', 28, 'var(--stage-scale)'], ['Sostenibilità', 17, 'var(--stage-validation)'], ['Energia', 14, 'var(--stage-idea)']].map(([n, v, c]) => /*#__PURE__*/React.createElement("div", {
      key: n
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 13,
        marginBottom: 5
      }
    }, /*#__PURE__*/React.createElement("span", null, n), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 12
      }
    }, v, "%")), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 6,
        background: 'var(--surface-sunken)',
        borderRadius: 99
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: v + '%',
        height: '100%',
        background: c,
        borderRadius: 99
      }
    }))))))));
  }
  window.Reports = Reports;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/Reports.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/Scouting.jsx
try { (() => {
(() => {
  const {
    Card,
    Tag,
    Badge,
    Button,
    IconButton,
    Progress
  } = window.DS;
  function Scouting({
    lang
  }) {
    const D = window.IMIS_DATA;
    const cats = ['Tutti', ...new Set(D.trends.map(t => t.cat))];
    const [c, setC] = React.useState('Tutti');
    const [saved, setSaved] = React.useState({});
    const list = D.trends.filter(t => c === 'Tutti' || t.cat === c);
    const mt = {
      Emergente: 'accent',
      'In crescita': 'info',
      Maturo: 'neutral'
    };
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PageHead, {
      eyebrow: "Radar tecnologico",
      title: lang === 'en' ? 'Trend scouting' : 'Scouting trend',
      sub: "Segnali raccolti da brevetti, pubblicazioni e notizie, ordinati per rilevanza rispetto al tuo portfolio.",
      right: /*#__PURE__*/React.createElement(Button, {
        variant: "secondary",
        icon: "sliders-horizontal"
      }, "Fonti")
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap',
        marginBottom: 20
      }
    }, cats.map(x => /*#__PURE__*/React.createElement(Tag, {
      key: x,
      selected: x === c,
      onClick: () => setC(x)
    }, x))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))',
        gap: 16
      }
    }, list.map(t => /*#__PURE__*/React.createElement(Card, {
      key: t.t,
      interactive: true,
      padding: 18
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        letterSpacing: '.08em',
        textTransform: 'uppercase',
        color: 'var(--text-tertiary)'
      }
    }, t.cat), /*#__PURE__*/React.createElement(Badge, {
      tone: mt[t.m]
    }, t.m)), /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 19,
        lineHeight: '26px'
      }
    }, t.t), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '6px 0 16px',
        color: 'var(--text-secondary)',
        fontSize: 13,
        lineHeight: '19px'
      }
    }, t.d), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(Progress, {
      value: t.s,
      size: "sm",
      style: {
        flex: 1
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 12
      }
    }, t.s), /*#__PURE__*/React.createElement(IconButton, {
      icon: saved[t.t] ? 'bookmark-check' : 'bookmark',
      label: "Salva",
      active: saved[t.t],
      size: "sm",
      onClick: () => setSaved(s => ({
        ...s,
        [t.t]: !s[t.t]
      }))
    }))))));
  }
  window.Scouting = Scouting;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/Scouting.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/Shell.jsx
try { (() => {
(() => {
  const {
    Icon,
    IconButton,
    Button,
    Input,
    Avatar,
    Switch
  } = window.DS;
  function Sidebar({
    route,
    go,
    t,
    lang,
    setLang
  }) {
    const items = [['portfolio', 'layout-dashboard'], ['pipeline', 'kanban'], ['projects', 'folder-kanban'], ['scouting', 'radar'], ['funding', 'landmark'], ['reports', 'chart-line']];
    const Item = ({
      id,
      ic
    }) => {
      const on = route === id || id === 'projects' && route === 'project';
      const [h, setH] = React.useState(false);
      return /*#__PURE__*/React.createElement("button", {
        onClick: () => go(id),
        onMouseEnter: () => setH(true),
        onMouseLeave: () => setH(false),
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          width: '100%',
          height: 34,
          padding: '0 10px',
          border: 0,
          borderRadius: 6,
          background: on ? 'var(--surface-card)' : h ? 'var(--surface-hover)' : 'transparent',
          boxShadow: on ? 'var(--shadow-1)' : 'none',
          color: on ? 'var(--text-primary)' : 'var(--text-secondary)',
          font: 'inherit',
          fontSize: 14,
          fontWeight: on ? 600 : 500,
          cursor: 'pointer',
          textAlign: 'left'
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: ic,
        size: 18,
        color: on ? 'var(--accent)' : 'currentColor'
      }), t[id]);
    };
    return /*#__PURE__*/React.createElement("aside", {
      style: {
        width: 'var(--sidebar-w)',
        flex: 'none',
        background: 'var(--surface-sunken)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 12px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 8,
        padding: '4px 10px 20px'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-serif)',
        fontSize: 24,
        fontWeight: 500,
        letterSpacing: '-.02em',
        color: 'var(--accent)'
      }
    }, "IMIS"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        letterSpacing: '.08em',
        textTransform: 'uppercase',
        color: 'var(--text-tertiary)'
      }
    }, t.workspace)), /*#__PURE__*/React.createElement("nav", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }
    }, items.map(([id, ic]) => /*#__PURE__*/React.createElement(Item, {
      key: id,
      id: id,
      ic: ic
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 2,
        padding: 2,
        background: 'var(--surface-page)',
        borderRadius: 6,
        border: '1px solid var(--border-subtle)'
      }
    }, ['it', 'en'].map(l => /*#__PURE__*/React.createElement("button", {
      key: l,
      onClick: () => setLang(l),
      style: {
        flex: 1,
        height: 24,
        border: 0,
        borderRadius: 4,
        background: lang === l ? 'var(--surface-card)' : 'transparent',
        boxShadow: lang === l ? 'var(--shadow-1)' : 'none',
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        textTransform: 'uppercase',
        color: lang === l ? 'var(--text-primary)' : 'var(--text-tertiary)',
        cursor: 'pointer'
      }
    }, l))), /*#__PURE__*/React.createElement(Item, {
      id: "settings",
      ic: "settings"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 10px',
        borderTop: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: "Giulia Ferri",
      size: 28
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        lineHeight: 1.2
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 600
      }
    }, "Giulia Ferri"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: 'var(--text-tertiary)'
      }
    }, "Innovation manager")))));
  }
  function TopBar({
    title,
    crumb,
    t,
    ai,
    setAi,
    dark,
    setDark,
    onNew
  }) {
    return /*#__PURE__*/React.createElement("header", {
      style: {
        height: 'var(--topbar-h)',
        flex: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '0 24px',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--surface-page)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: 'var(--text-tertiary)',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        minWidth: 0
      }
    }, crumb && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", null, crumb), /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-right",
      size: 14
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-primary)',
        fontWeight: 500,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, title)), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }), /*#__PURE__*/React.createElement(Input, {
      icon: "search",
      placeholder: t.search,
      style: {
        width: 280
      }
    }), /*#__PURE__*/React.createElement(IconButton, {
      icon: dark ? 'sun' : 'moon',
      label: "Tema",
      onClick: () => setDark(!dark)
    }), /*#__PURE__*/React.createElement(IconButton, {
      icon: "bell",
      label: "Notifiche"
    }), /*#__PURE__*/React.createElement(IconButton, {
      icon: "sparkles",
      label: t.assistant,
      active: ai,
      onClick: () => setAi(!ai)
    }), /*#__PURE__*/React.createElement(Button, {
      icon: "plus",
      onClick: onNew
    }, t.newIdea));
  }
  function PageHead({
    eyebrow,
    title,
    sub,
    right
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 24,
        marginBottom: 24
      }
    }, /*#__PURE__*/React.createElement("div", null, eyebrow && /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        letterSpacing: '.08em',
        textTransform: 'uppercase',
        color: 'var(--text-tertiary)',
        marginBottom: 6
      }
    }, eyebrow), /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: 'var(--fs-h1)',
        lineHeight: 'var(--lh-h1)'
      }
    }, title), sub && /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '6px 0 0',
        color: 'var(--text-secondary)',
        maxWidth: 620
      }
    }, sub)), right && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        flex: 'none'
      }
    }, right));
  }
  Object.assign(window, {
    Sidebar,
    TopBar,
    PageHead
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/Shell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/data.js
try { (() => {
window.IMIS_DATA = {
  stages: [{
    id: 'idea',
    it: 'Idea',
    en: 'Idea',
    c: 'var(--stage-idea)'
  }, {
    id: 'screening',
    it: 'Screening',
    en: 'Screening',
    c: 'var(--stage-screening)'
  }, {
    id: 'validation',
    it: 'Validazione',
    en: 'Validation',
    c: 'var(--stage-validation)'
  }, {
    id: 'pilot',
    it: 'Pilota',
    en: 'Pilot',
    c: 'var(--stage-pilot)'
  }, {
    id: 'scale',
    it: 'Scala',
    en: 'Scale',
    c: 'var(--stage-scale)'
  }],
  projects: [{
    id: 'P-024',
    title: 'Manutenzione predittiva linea 3',
    stage: 'pilot',
    owner: 'Giulia Ferri',
    team: ['Giulia Ferri', 'Marco Rossi', 'Ada Bianchi'],
    budget: 85000,
    spent: 52000,
    progress: 64,
    health: 'ok',
    trl: 6,
    area: 'Industria 4.0',
    desc: 'Sensori IoT e modello di machine learning per anticipare i fermi macchina sulla linea di stampaggio.'
  }, {
    id: 'P-031',
    title: 'Imballaggi compostabili per e-commerce',
    stage: 'validation',
    owner: 'Marco Rossi',
    team: ['Marco Rossi', 'Sara Conti'],
    budget: 40000,
    spent: 12500,
    progress: 38,
    health: 'risk',
    trl: 4,
    area: 'Sostenibilità',
    desc: 'Sostituzione del polistirolo con materiali a base di micelio.'
  }, {
    id: 'P-017',
    title: 'Assistente IA per preventivi',
    stage: 'scale',
    owner: 'Ada Bianchi',
    team: ['Ada Bianchi', 'Luca Neri', 'Giulia Ferri', 'Sara Conti'],
    budget: 120000,
    spent: 98000,
    progress: 86,
    health: 'ok',
    trl: 8,
    area: 'IA generativa',
    desc: 'Generazione automatica di preventivi da richieste email dei clienti.'
  }, {
    id: 'P-038',
    title: 'Gemello digitale del magazzino',
    stage: 'screening',
    owner: 'Luca Neri',
    team: ['Luca Neri'],
    budget: 25000,
    spent: 0,
    progress: 12,
    health: 'ok',
    trl: 3,
    area: 'Logistica',
    desc: 'Simulazione dei flussi per ottimizzare lo stoccaggio.'
  }, {
    id: 'P-041',
    title: 'Recupero calore dai forni',
    stage: 'validation',
    owner: 'Sara Conti',
    team: ['Sara Conti', 'Marco Rossi'],
    budget: 60000,
    spent: 31000,
    progress: 47,
    health: 'late',
    trl: 5,
    area: 'Energia',
    desc: 'Scambiatori per riutilizzare il calore di scarto nel riscaldamento.'
  }],
  ideas: {
    idea: [{
      t: 'App di prenotazione per officine',
      a: 'Sara Conti',
      v: 12
    }, {
      t: 'Etichette NFC anti-contraffazione',
      a: 'Luca Neri',
      v: 8
    }, {
      t: 'Formazione in realtà aumentata',
      a: 'Ada Bianchi',
      v: 5
    }],
    screening: [{
      t: 'Gemello digitale del magazzino',
      a: 'Luca Neri',
      v: 17
    }, {
      t: 'Marketplace sottoprodotti',
      a: 'Marco Rossi',
      v: 9
    }],
    validation: [{
      t: 'Imballaggi compostabili',
      a: 'Marco Rossi',
      v: 21
    }, {
      t: 'Recupero calore dai forni',
      a: 'Sara Conti',
      v: 14
    }],
    pilot: [{
      t: 'Manutenzione predittiva linea 3',
      a: 'Giulia Ferri',
      v: 26
    }],
    scale: [{
      t: 'Assistente IA per preventivi',
      a: 'Ada Bianchi',
      v: 31
    }]
  },
  trends: [{
    t: 'Agenti IA per back-office PMI',
    cat: 'IA generativa',
    m: 'Emergente',
    s: 87,
    d: 'Agenti che automatizzano fatturazione, preventivi e ordini su gestionali esistenti.'
  }, {
    t: 'Materiali a base di micelio',
    cat: 'Sostenibilità',
    m: 'In crescita',
    s: 74,
    d: 'Alternative biodegradabili a plastiche e schiume per imballaggio.'
  }, {
    t: 'Edge AI per controllo qualità',
    cat: 'Industria 4.0',
    m: 'Maturo',
    s: 69,
    d: 'Visione artificiale su dispositivi a bordo linea, senza cloud.'
  }, {
    t: 'Passaporto digitale di prodotto',
    cat: 'Normativa UE',
    m: 'Emergente',
    s: 81,
    d: 'Obbligo ESPR: tracciabilità di materiali e riciclabilità.'
  }, {
    t: 'Pompe di calore industriali',
    cat: 'Energia',
    m: 'In crescita',
    s: 62,
    d: 'Recupero di calore a media temperatura per processi produttivi.'
  }, {
    t: 'Robot collaborativi as-a-service',
    cat: 'Industria 4.0',
    m: 'In crescita',
    s: 58,
    d: 'Cobot a noleggio con canone mensile per piccoli lotti.'
  }],
  calls: [{
    t: 'PR FESR Liguria — Azione 1.1.2',
    e: 'Regione Liguria',
    amt: 'fino a € 200.000',
    pct: '50%',
    dl: '2026-12-15',
    days: 47,
    m: 82,
    st: 'open'
  }, {
    t: 'Voucher Transizione Digitale',
    e: 'Camera di Commercio Genova',
    amt: 'fino a € 10.000',
    pct: '70%',
    dl: '2026-11-08',
    days: 10,
    m: 91,
    st: 'open'
  }, {
    t: 'Horizon Europe — EIC Accelerator',
    e: 'Commissione Europea',
    amt: 'fino a € 2,5 mln',
    pct: '70%',
    dl: '2027-01-21',
    days: 84,
    m: 54,
    st: 'open'
  }, {
    t: 'Credito d’imposta R&S 2026',
    e: 'MIMIT',
    amt: '20% della spesa',
    pct: '—',
    dl: '2027-06-30',
    days: 244,
    m: 76,
    st: 'rolling'
  }],
  kpis: {
    quarters: ['T1', 'T2', 'T3', 'T4'],
    ideas: [42, 57, 71, 88],
    converted: [6, 9, 11, 15]
  }
};
window.IMIS_T = {
  it: {
    portfolio: 'Portfolio',
    pipeline: 'Pipeline idee',
    projects: 'Progetti',
    scouting: 'Scouting trend',
    funding: 'Bandi e finanziamenti',
    reports: 'Report e KPI',
    settings: 'Impostazioni',
    search: 'Cerca progetti, trend, bandi…',
    newIdea: 'Nuova idea',
    assistant: 'Assistente IA',
    workspace: 'Spazio di lavoro'
  },
  en: {
    portfolio: 'Portfolio',
    pipeline: 'Idea pipeline',
    projects: 'Projects',
    scouting: 'Trend scouting',
    funding: 'Funding & grants',
    reports: 'Reports & KPIs',
    settings: 'Settings',
    search: 'Search projects, trends, calls…',
    newIdea: 'New idea',
    assistant: 'AI assistant',
    workspace: 'Workspace'
  }
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/data.js", error: String((e && e.message) || e) }); }

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.AvatarGroup = __ds_scope.AvatarGroup;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.StatCard = __ds_scope.StatCard;

__ds_ns.Progress = __ds_scope.Progress;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
