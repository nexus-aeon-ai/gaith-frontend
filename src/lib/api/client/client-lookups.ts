import { useQueries } from "@tanstack/react-query";

import {
  getClientLanguages,
  getClientBusinessMaturity,
  getClientIndustries,
  getClientMartketRegions,
  getClientServiceOffers,
  getClientTargetAudiences,
  getClientTeamRoles,
} from "./client";


export const useClientLookups = () => {
  const results = useQueries({
    queries: [
      {
        queryKey: ["clientLanguages"],
        queryFn: getClientLanguages,
        initialData: [],
      },
      {
        queryKey: ["clientBusinessMaturity"],
        queryFn: getClientBusinessMaturity,
        initialData: [],
      },
      {
        queryKey: ["clientIndustries"],
        queryFn: getClientIndustries,
        initialData: [],
      },
      {
        queryKey: ["clientMarketRegions"],
        queryFn: getClientMartketRegions,
        initialData: [],
      },
      {
        queryKey: ["clientServiceOffers"],
        queryFn: getClientServiceOffers,
        initialData: [],
      },
      {
        queryKey: ["clientTargetAudiences"],
        queryFn: getClientTargetAudiences,
        initialData: [],
      },
      {
        queryKey: ["clientTeamRoles"],
        queryFn: getClientTeamRoles,
        initialData: [],
      },
    ],
  });

  return {
    clientLanguages: results[0].data,
    clientBusinessMaturity: results[1].data,
    clientIndustries: results[2].data,
    clientMarketRegions: results[3].data,
    clientServiceOffers: results[4].data,
    clientTargetAudiences: results[5].data,
    clientTeamRoles: results[6].data,
    isLoading: results.some(r => r.isLoading),
    isError: results.some(r => r.isError),
  };
};
