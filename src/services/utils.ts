export interface IResource {
  resource: string;
}

const Utils = {
  parseRequestURL: (): IResource => {
    const url = window.location.hash.slice(1).toLowerCase() || '/';
    const resource = url.split('/')[1];
    return {
      resource,
    };
  },
};

export default Utils;
