import { Webhook } from "svix";
import User from "../models/User.js";
// 
// API Controller Function to Manage clerk user with database
// 
export const clerkWebhooks = async (req, res) => {
    try {
        // 
        // creat a svix instance with clerk webhook secret.
        // const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        //Verifying Headers
        // await whook.verify(JSON.stringify(req.body), {
        // "svix-id": req.headers["svix-id"],
        // "svix-timestamp": req.headers["svix-timestamp"],
        // "svix-signature": req.headers["svix-signature"]
        // })

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

// export const clerkWebhooks = async (req, res) => {
//     try {
//         // console.log("Received Headers:", req.headers);
//         // console.log("Received Body:", req.body);

//         const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

//         // Tăng thời gian chấp nhận chênh lệch timestamp lên 5 phút (300 giây)
//         await whook.verify(JSON.stringify(req.body), {
//         "svix-id": req.headers["svix-id"],
//         "svix-timestamp": req.headers["svix-timestamp"],
//         "svix-signature": req.headers["svix-signature"]
//         }, { tolerance: 300 });  // 300 giây = 5 phút

//         const { data, type } = req.body;
//         // console.log("Event Type:", type);
//         // console.log("Event Data:", data);

//         switch (type) {
//             case 'user.created': {
//                 const userData = {
//                     _id: data.id,
//                     email: data.email_addresses[0].email_address,
//                     name: data.first_name + " " + data.last_name,
//                     image: data.image_url,
//                     resume: ''
//                 };
//                 await User.create(userData);
//                 return res.status(200).json({ success: true });
//             }

//             case 'user.updated': {
//                 const userData = {
//                     email: data.email_addresses[0].email_address,
//                     name: data.first_name + " " + data.last_name,
//                     image: data.image_url
//                 };
//                 await User.findByIdAndUpdate(data.id, userData);
//                 return res.status(200).json({ success: true });
//             }

//             case 'user.deleted': {
//                 await User.findByIdAndDelete(data.id);
//                 return res.status(200).json({ success: true });
//             }

//             default:
//                 return res.status(200).json({ success: true });
//         }

//     } catch (error) {
//         console.error("Webhook Error:", error.message);
//         return res.status(400).json({ success: false, message: 'Webhooks Error', error: error.message });
//     }
// };


// import { Webhook } from "svix";
// import User from "../models/User.js";

// // API Controller Function to Manage Clerk user with database
// export const clerkWebhooks = async (req, res) => {
//     try {
//         // Create a Svix instance with Clerk webhook secret
//         // const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

//         //Verifying Headers
//         // await whook.verify(JSON.stringify(req.body), {
//         // "svix-id": req.headers["svix-id"],
//         // "svix-timestamp": req.headers["svix-timestamp"],
//         // "svix-signature": req.headers["svix-signature"]
//         // }, { tolerance: 300 });


//         //fix
//         console.log("🔹 Webhook Received:", req.body);
//         console.log("🔹 Event Type:", req.body.type);

//         // Trả về phản hồi ngay lập tức để tránh timeout
//         res.status(200).json({ success: true });

//         // Getting data from request body
//         const { data, type } = req.body;

//         // Switch Cases for different Events
//         switch (type) {
//             case 'user.created': {
//                 const userData = {
//                     _id: data.id,
//                     email: data.email_addresses?.[0]?.email_address || '',
//                     name: `${data.first_name} ${data.last_name}`.trim(),
//                     image: data.image_url,
//                     resume: ''
//                 };
//                 console.log("🔹 Creating user:", data);
//                 await User.create(userData);
//                 console.log("✅ User created successfully!");
//                 return res.status(200).json({});
//             }

//             case 'user.updated': {
//                 const userData = {
//                     email: data.email_addresses?.[0]?.email_address || '',
//                     name: `${data.first_name} ${data.last_name}`.trim(),
//                     image: data.image_url
//                 };
//                 console.log("🔹 Updating user:", data);
//                 await User.findByIdAndUpdate(data.id, userData);
//                 console.log("✅ User updated successfully!");
//                 return res.status(200).json({});
//             }

//             case 'user.deleted': {
//                 console.log("🔹 Deleting user:", data.id);
//                 await User.findByIdAndDelete(data.id);
//                 console.log("✅ User deleted successfully!");
//                 return res.status(200).json({});
//             }

//             default:
//                 return res.status(200).json({});
//         }

//     } catch (error) {
//         console.error("Webhook Error:", error.message);
//         return res.status(400).json({ success: false, message: 'Webhooks Error' });
//     }
// };


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
