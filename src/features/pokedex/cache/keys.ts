export const cacheKeys = {
  list: (offset: number, limit: number) => `pdx:list:${offset}:${limit}`,
  detail: (nameOrId: string | number) => `pdx:detail:${nameOrId}`,
  types: () => `pdx:types`,
  species: (nameOrId: string | number) => `pdx:species:${nameOrId}`,
  evoChain: (url: string) => `pdx:evo:${url}`,
};
