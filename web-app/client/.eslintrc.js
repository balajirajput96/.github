module.exports = {
  extends: [
    "react-app",
    "plugin:jsx-a11y/recommended"
  ],
  plugins: ["jsx-a11y"],
  rules: {
    "jsx-a11y/alt-text": "error",
    "jsx-a11y/aria-props": "error",
    "jsx-a11y/aria-proptypes": "error",
    "jsx-a11y/aria-unsupported-elements": "error",
    "jsx-a11y/role-has-required-aria-props": "error",
    "jsx-a11y/role-supports-aria-props": "error"
  }
};
