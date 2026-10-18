import { useQueryClient, useQuery, useMutation, type QueryFunction } from "@/lib/query";
import {
  getGetDashboardConfigDashboardConfigGetQueryKey,
  getGetDashboardConfigDashboardConfigGetQueryOptions,
  putDashboardConfigDashboardConfigPut,
  type getDashboardConfigDashboardConfigGetResponse,
  type WidgetConfigItem,
} from "@/api";
import type { ColSpan } from "@/types/dashboard";

export interface DashboardWidgetConfig {
  id: string;
  colSpan: ColSpan;
  visible: boolean;
}

function toWidgetConfigs(items: WidgetConfigItem[]): DashboardWidgetConfig[] {
  return items.map((item) => ({
    id: item.id,
    colSpan: item.col_span,
    visible: item.visible,
  }));
}

function toApiPayload(configs: DashboardWidgetConfig[]): WidgetConfigItem[] {
  return configs.map((c) => ({
    id: c.id,
    col_span: c.colSpan,
    visible: c.visible,
  }));
}

export function useDashboardConfig() {
  const queryOptions = getGetDashboardConfigDashboardConfigGetQueryOptions();

  return useQuery({
    ...queryOptions,
    queryFn: queryOptions.queryFn as QueryFunction<getDashboardConfigDashboardConfigGetResponse>,
    select: (res) => toWidgetConfigs(res.data.widgets),
  });
}

export function useSaveDashboardConfig() {
  const queryClient = useQueryClient();

  const queryKey = getGetDashboardConfigDashboardConfigGetQueryKey();

  return useMutation({
    mutationFn: async (configs: DashboardWidgetConfig[]) => {
      await putDashboardConfigDashboardConfigPut({
        widgets: toApiPayload(configs),
      });
    },
    onMutate: async (configs) => {
      await queryClient.cancelQueries({ queryKey });

      const previous =
        queryClient.getQueryData<getDashboardConfigDashboardConfigGetResponse>(
          queryKey,
        );

      if (previous) {
        queryClient.setQueryData<getDashboardConfigDashboardConfigGetResponse>(
          queryKey,
          {
            ...previous,
            data: { widgets: toApiPayload(configs) },
          },
        );
      }

      return { previous };
    },
    onError: (_err, _configs, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
