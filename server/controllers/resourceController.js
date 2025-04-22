import Resource from "../models/Resource.js";

// Lấy tất cả resources
export const getAllResources = async (req, res) => {
    try {
        const resources = await Resource.find().select('type title description');

        return res.status(200).json({
            success: true,
            resources
        });
    } catch (error) {
        console.error("Error getting resources:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi lấy thông tin tài nguyên",
            error: error.message
        });
    }
};

// Lấy chi tiết của một resource theo type
export const getResourceByType = async (req, res) => {
    try {
        const { resourceType } = req.params;

        const resource = await Resource.findOne({ type: resourceType });

        if (!resource) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy tài nguyên yêu cầu"
            });
        }

        return res.status(200).json({
            success: true,
            resource
        });
    } catch (error) {
        console.error("Error getting resource details:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi lấy chi tiết tài nguyên",
            error: error.message
        });
    }
};

// Thêm resource mới (dành cho admin)
export const addResource = async (req, res) => {
    try {
        const { type, title, description, items, relatedResources } = req.body;

        // Kiểm tra xem resource đã tồn tại chưa
        const existingResource = await Resource.findOne({ type });

        if (existingResource) {
            return res.status(400).json({
                success: false,
                message: "Tài nguyên này đã tồn tại"
            });
        }

        // Tạo resource mới
        const newResource = new Resource({
            type,
            title,
            description,
            items,
            relatedResources
        });

        await newResource.save();

        return res.status(201).json({
            success: true,
            message: "Tạo tài nguyên mới thành công",
            resource: newResource
        });
    } catch (error) {
        console.error("Error creating resource:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi tạo tài nguyên",
            error: error.message
        });
    }
};

// Cập nhật resource (dành cho admin)
export const updateResource = async (req, res) => {
    try {
        const { resourceType } = req.params;
        const updateData = req.body;

        const updatedResource = await Resource.findOneAndUpdate(
            { type: resourceType },
            updateData,
            { new: true }
        );

        if (!updatedResource) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy tài nguyên để cập nhật"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Cập nhật tài nguyên thành công",
            resource: updatedResource
        });
    } catch (error) {
        console.error("Error updating resource:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi cập nhật tài nguyên",
            error: error.message
        });
    }
};

// Xóa resource (dành cho admin)
export const deleteResource = async (req, res) => {
    try {
        const { resourceType } = req.params;

        const deletedResource = await Resource.findOneAndDelete({ type: resourceType });

        if (!deletedResource) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy tài nguyên để xóa"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Xóa tài nguyên thành công"
        });
    } catch (error) {
        console.error("Error deleting resource:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi xóa tài nguyên",
            error: error.message
        });
    }
};

// Lấy tất cả danh mục hiện có
export const getResourceCategories = async (req, res) => {
    try {
        const categories = await Resource.distinct('category').where({
            status: 'published'
        });

        return res.status(200).json({
            success: true,
            categories
        });
    } catch (error) {
        console.error("Error getting resource categories:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi lấy danh sách danh mục",
            error: error.message
        });
    }
};

// Lấy tất cả tag hiện có
export const getResourceTags = async (req, res) => {
    try {
        const tags = await Resource.distinct('tags').where({
            status: 'published'
        });

        return res.status(200).json({
            success: true,
            tags
        });
    } catch (error) {
        console.error("Error getting resource tags:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi lấy danh sách tag",
            error: error.message
        });
    }
};

// Tìm kiếm nâng cao
export const searchResources = async (req, res) => {
    try {
        const { query, type, category, tags, status, sortBy, page = 1, limit = 10 } = req.query;

        // Xây dựng query object
        const queryObj = {};

        // Chỉ lấy resource đã publish cho user thường
        if (!req.admin) {
            queryObj.status = 'published';
        } else if (status) {
            queryObj.status = status;
        }

        // Tìm kiếm theo type
        if (type) {
            queryObj.type = type;
        }

        // Tìm kiếm theo category
        if (category) {
            queryObj.category = category;
        }

        // Tìm kiếm theo tags
        if (tags) {
            const tagArray = tags.split(',');
            queryObj.tags = { $in: tagArray };
        }

        // Tìm kiếm full-text
        if (query) {
            queryObj.$or = [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { content: { $regex: query, $options: 'i' } }
            ];
        }

        // Thực hiện tìm kiếm với phân trang
        const skip = (page - 1) * limit;

        // Xác định cách sắp xếp
        let sortOption = { createdAt: -1 }; // Mặc định theo thời gian tạo, mới nhất lên đầu

        if (sortBy === 'views') {
            sortOption = { viewCount: -1, createdAt: -1 };
        } else if (sortBy === 'title') {
            sortOption = { title: 1 };
        }

        const resources = await Resource.find(queryObj)
            .sort(sortOption)
            .skip(skip)
            .limit(parseInt(limit))
            .select('title slug type description featuredImage category tags createdAt viewCount');

        const total = await Resource.countDocuments(queryObj);

        return res.status(200).json({
            success: true,
            count: resources.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            resources
        });
    } catch (error) {
        console.error("Error searching resources:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi tìm kiếm tài nguyên",
            error: error.message
        });
    }
};


// Thêm vào file resourceController.js, sau các controller hiện có

// Lấy chi tiết của một item trong resource
export const getResourceItemDetail = async (req, res) => {
    try {
        const { resourceType, itemSlug } = req.params;

        const resource = await Resource.findOne({ type: resourceType });

        if (!resource) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy loại tài nguyên yêu cầu"
            });
        }

        // Tìm item theo slug
        const item = resource.items.find(item => item.slug === itemSlug);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy tài nguyên chi tiết"
            });
        }

        // Lấy danh sách các item khác của cùng resource để hiển thị các bài liên quan
        const otherItems = resource.items
            .filter(i => i.slug !== itemSlug)
            .map(i => ({
                title: i.title,
                description: i.description,
                image: i.image,
                slug: i.slug
            }));

        return res.status(200).json({
            success: true,
            item,
            resourceInfo: {
                type: resource.type,
                title: resource.title,
                description: resource.description
            },
            relatedItems: otherItems.slice(0, 3) // Chỉ lấy tối đa 3 item liên quan
        });
    } catch (error) {
        console.error("Error getting resource item detail:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server khi lấy chi tiết tài nguyên",
            error: error.message
        });
    }
};