import type { SectionItem } from "../types";
import { formatCurrency } from "../utils";

export function buildPropertyItems(property: any): SectionItem[] {
    const zillow = property?.zillow ?? {
        area: 0,
        address: "",
        hdpData: { homeInfo: { bathrooms: 0, bedrooms: 0, price: 0 } },
        estimated_value: 0,
        status: "Unknown",
    };

    const rentCast = property?.rentCast ?? {
        price: 0,
        bedrooms: 0,
        bathrooms: 0,
        squareFootage: "?",
        owner: { names: ["Unknown owner"] },
        formattedAddress: "",
        status: "Unknown",
    };

    // 🔹 Provided (Black Knight)
    const providedItem: SectionItem = {
        icon: null, // icon injected in UI (Building2)
        title: "Black Knight",
        description: "Received",
        price: formatCurrency(property?.address.value) ?? "-",
        chips: [
            {
                icon: null,
                label: `${rentCast.formattedAddress ?? ""}`,
                sx: { backgroundColor: "#E0F2FE", color: "#0369A1" },
            }
        ],
    };

    // 🔹 Zillow
    const zillowItem: SectionItem = {
        icon: null,
        title: "Zillow",
        description: zillow.status ?? "Unknown",
        price: formatCurrency(zillow.hdpData.homeInfo.price),
        chips: [
            {
                icon: null,
                label: `${zillow.address ?? ""}, ${property.address?.city ?? ""}`,
                sx: { backgroundColor: "#E0F2FE", color: "#0369A1" },
            },
            {
                icon: null,
                label: `${zillow.hdpData.homeInfo.bathrooms ?? "?"} bathrooms`,
                sx: { backgroundColor: "#F3E8FF", color: "#6B21A8" },
            },
            {
                icon: null,
                label: `${zillow.hdpData.homeInfo.bedrooms ?? "?"} bedrooms`,
                sx: { backgroundColor: "#F3E8FF", color: "#6B21A8" },
            },
            {
                icon: null,
                label: `${zillow.area ?? "?"} sqft`,
                sx: { backgroundColor: "#FCE7F3", color: "#9D174D" },
            }
        ],
    };

    // 🔹 RentCast
    const rentCastItem: SectionItem = {
        icon: null,
        title: "RentCast",
        description: rentCast?.status,
        price: formatCurrency(rentCast.price),
        chips: [
            {
                icon: null,
                label: `${rentCast.formattedAddress ?? ""}, ${property.address?.city ?? ""}`,
                sx: { backgroundColor: "#E0F2FE", color: "#0369A1" },
            },
            {
                icon: null,
                label: rentCast.owner.names[0] ?? "Unknown owner",
                sx: { backgroundColor: "#F1F5F9", color: "#475569" },
            },
            {
                icon: null,
                label: `${rentCast.bathrooms ?? "?"} bathrooms`,
                sx: { backgroundColor: "#F3E8FF", color: "#6B21A8" },
            },
            {
                icon: null,
                label: `${rentCast.bedrooms ?? "?"} bedrooms`,
                sx: { backgroundColor: "#F3E8FF", color: "#6B21A8" },
            },
            {
                icon: null,
                label: `${rentCast.squareFootage ?? "?"} sqft`,
                sx: { backgroundColor: "#FCE7F3", color: "#9D174D" },
            }
        ],
    };

    return [providedItem, zillowItem, rentCastItem];
}