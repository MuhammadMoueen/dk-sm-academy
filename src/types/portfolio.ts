import type { ContentStatus } from "@/types/common";

export interface PortfolioItem {
  id: string;
  clientName: string;
  clientImage: string;
  transactionImage: string;
  review: string;
  rating: number;
  isVerified: boolean;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
}
