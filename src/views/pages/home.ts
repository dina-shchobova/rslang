export const Home = async (): Promise<{ html:string, unmount: () => void }> => {
  const view = '<div id="">RsLang</div>';
  return { html: view, unmount: () => {} };
};
