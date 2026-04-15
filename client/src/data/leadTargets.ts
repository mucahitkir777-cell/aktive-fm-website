import { companyConfig, type CompanyRegion, type CompanyService } from "@/config/company";

export type LeadRegion = CompanyRegion;
export type LeadService = CompanyService;

export const leadRegions: LeadRegion[] = [...companyConfig.regions];
export const leadServices: LeadService[] = [...companyConfig.services];

export function getLeadRegionBySlug(slug: string) {
  return leadRegions.find((region) => region.slug === slug);
}

export function getLeadServiceById(id: string) {
  return leadServices.find((service) => service.id === id);
}
