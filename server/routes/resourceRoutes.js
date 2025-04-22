import express from "express";
import {
    getAllResources,
    getResourceByType,
    addResource,
    updateResource,
    deleteResource,
    getResourceItemDetail,
    getResourceCategories,
    getResourceTags,
    searchResources
} from "../controllers/resourceController.js";
import { protectAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllResources);
router.get("/search", searchResources);
router.get("/categories", getResourceCategories);
router.get("/tags", getResourceTags);
router.get("/:resourceType", getResourceByType);
// Thêm route mới cho chi tiết item
router.get("/:resourceType/:itemSlug", getResourceItemDetail);

// Admin only routes
router.post("/", protectAdmin, addResource);
router.put("/:resourceType", protectAdmin, updateResource);
router.delete("/:resourceType", protectAdmin, deleteResource);

export default router;
// import express from "express";
// import { getAllResources, getResourceByType, addResource, updateResource, deleteResource } from "../controllers/resourceController.js";
// import { protectAdmin } from "../middlewares/authMiddleware.js";

// const router = express.Router();

// // Public routes
// router.get("/", getAllResources);
// router.get("/:resourceType", getResourceByType);

// // Admin only routes
// router.post("/", protectAdmin, addResource);
// router.put("/:resourceType", protectAdmin, updateResource);
// router.delete("/:resourceType", protectAdmin, deleteResource);

// export default router;