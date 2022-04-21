type Features = "PWA";

export const featured = (featureFlag: Features): boolean => {
  return process.env[`REACT_APP_FEATURE_${featureFlag}`] === "true";
};
