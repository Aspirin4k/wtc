export type ClassNameDeclaration = {[className: string]: boolean}

export const getClassName = (classNames: ClassNameDeclaration): string => {
  return Object
    .keys(classNames)
    .reduce(
      (acc, key) => {
        if (classNames[key]) {
          acc.push(key);
        }
        return acc;
      },
      []
    )
    .join(' ');
}