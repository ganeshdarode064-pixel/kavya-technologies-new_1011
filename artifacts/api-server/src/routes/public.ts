import { Router, type IRouter } from "express";
import {
  ListReviewsResponse,
  ListServicesResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const services = [
  {
    id: 1,
    title: "Laptop Chip-Level Repair",
    description:
      "Detailed motherboard-level diagnosis and repair for complex laptop hardware problems.",
    icon: "microchip",
    active: true,
  },
  {
    id: 2,
    title: "Laptop Hardware Repair",
    description:
      "Troubleshooting and repair of laptop hardware-related problems.",
    icon: "laptop",
    active: true,
  },
  {
    id: 3,
    title: "Computer Repair",
    description: "Diagnosis and servicing of computer hardware issues.",
    icon: "monitor",
    active: true,
  },
  {
    id: 4,
    title: "Laptop Diagnostics",
    description:
      "Identify hardware problems and determine the appropriate repair solution.",
    icon: "scan",
    active: true,
  },
  {
    id: 5,
    title: "Motherboard Repair",
    description: "Diagnosis and repair of motherboard-related faults.",
    icon: "circuit",
    active: true,
  },
  {
    id: 6,
    title: "Laptop Maintenance",
    description:
      "General hardware inspection and maintenance to help keep devices working properly.",
    icon: "wrench",
    active: true,
  },
];

const reviews = [
  {
    id: 1,
    customerName: "Google customer",
    rating: 5,
    review: "Best laptop Repair shop good Service",
    date: "Published on Google",
    approved: true,
  },
  {
    id: 2,
    customerName: "Google customer",
    rating: 5,
    review:
      "I highly recommend Kavya Technology for laptop repair and maintenance services.",
    date: "Published on Google",
    approved: true,
  },
  {
    id: 3,
    customerName: "Google customer",
    rating: 5,
    review: "I had an excellent experience with this laptop repair service.",
    date: "Published on Google",
    approved: true,
  },
];

router.get("/services", (_req, res) => {
  res.json(ListServicesResponse.parse(services));
});

router.get("/reviews", (_req, res) => {
  res.json(ListReviewsResponse.parse(reviews));
});

export default router;