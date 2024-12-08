const joinClasses = (
  ...args: Array<string | boolean | null | undefined>
): string => {
  return args.filter(Boolean).join(' ');
};

export default joinClasses;
