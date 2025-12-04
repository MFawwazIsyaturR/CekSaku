import { apiClient } from "@/app/api-client";
import { Asset, CreateAssetRequest, GetAllAssetsResponse } from "./assetType";

export const assetApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    // Mengambil semua aset
    getAllAssets: builder.query<GetAllAssetsResponse, void>({
      query: () => ({
        url: "/asset",
        method: "GET",
      }),
      providesTags: ["assets"], // Tag untuk cache invalidation
    }),

    // Menambah aset baru
    createAsset: builder.mutation<void, CreateAssetRequest>({
      query: (body) => ({
        url: "/asset",
        method: "POST",
        body,
      }),
      invalidatesTags: ["assets"], // Refresh data otomatis setelah tambah
    }),

    // Menghapus aset (opsional, untuk kelengkapan)
    deleteAsset: builder.mutation<void, string>({
      query: (id) => ({
        url: `/asset/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["assets"],
    }),
  }),
});

export const {
  useGetAllAssetsQuery,
  useCreateAssetMutation,
  useDeleteAssetMutation,
} = assetApi;