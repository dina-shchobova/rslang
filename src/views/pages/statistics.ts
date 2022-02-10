export const Statistics = async (): Promise<{ html:string, unmount: () => void }> => {
  const view = '<div id="garage-view">Стата</div>';
  return { html: view, unmount: () => {} };
};
