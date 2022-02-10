export const Games = async (): Promise<{ html:string, unmount: () => void }> => {
  const view = '<div id="text-book">Play</div>';
  return { html: view, unmount: () => {} };
};
