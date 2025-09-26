const pad = (value: number) => value.toString().padStart(2, '0');

export const generateRequestNumber = (): string => {
  const now = new Date();
  const datePart = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
  const randomPart = Math.floor(Math.random() * 9000 + 1000);
  return `TR-${datePart}-${randomPart}`;
};
