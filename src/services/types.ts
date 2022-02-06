export type PageContentThunk = () => Promise<string>;
export type PageContentRoutes = { [Key in string]: PageContentThunk };
