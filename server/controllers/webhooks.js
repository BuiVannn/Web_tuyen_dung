import { Webhook } from "svix";
import User from "../models/User.js";
// 
// API Controller Function to Manage clerk user with database
// 
export const clerkWebhooks = async (req, res) => {
    try {
        // 
        // creat a svix instance with clerk webhook secret.
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        // Verifying Headers
        await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        })


        // getting data from request body
        const { data, type } = req.body
        // 
        // Switch Cases for diffirent Events
        switch (type) {
            case 'user.created': {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    image: data.image_url,
                    resume: ''
                    // 
                }
                await User.create(userData)
                res.json({})
                break;
            }
            //                                     
            case 'user.updated': {
                const userData = {
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    image: data.image_url,
                }
                await User.findByIdAndUpdate(data.id, userData)
                res.json({})
                break;
            }
            case 'user.deleted': {
                await User.findByIdAndDelete(data.id)
                res.json({})
                break;
            }
            default:
                break;
        }
        // 
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: 'Webhooks Error' })
        // 
    }
}


// import { Webhook } from "svix";
// import User from "../models/User.js";

// // API Controller Function to Manage Clerk user with database
// export const clerkWebhooks = async (req, res) => {
//     try {
//         console.log(" Webhook Received:", req.body);
//         console.log(" Event Type:", req.body.type);

//         //  Trả về phản hồi ngay lập tức để tránh timeout
//         res.status(200).json({ success: true });

//         // Getting data from request body
//         const { data, type } = req.body;

//         // Switch Cases for different Events
//         if (type === 'user.created') {
//             const userData = {
//                 _id: data.id,
//                 email: data.email_addresses?.[0]?.email_address || '',
//                 name: `${data.first_name} ${data.last_name}`.trim(),
//                 image: data.image_url,
//                 resume: ''
//             };
//             console.log(" Creating user:", userData);
//             await User.create(userData);
//             console.log(" User created successfully!");
//         }
//         else if (type === 'user.updated') {
//             const userData = {
//                 email: data.email_addresses?.[0]?.email_address || '',
//                 name: `${data.first_name} ${data.last_name}`.trim(),
//                 image: data.image_url
//             };
//             console.log(" Updating user:", userData);
//             await User.findByIdAndUpdate(data.id, userData);
//             console.log(" User updated successfully!");
//         }
//         else if (type === 'user.deleted') {
//             console.log(" Deleting user:", data.id);
//             await User.findByIdAndDelete(data.id);
//             console.log(" User deleted successfully!");
//         }
//         else {
//             console.log("ℹ Unknown event type:", type);
//         }

//     } catch (error) {
//         console.error(" Webhook Error:", error.message);
//     }
// };
