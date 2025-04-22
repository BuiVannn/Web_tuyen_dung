import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { ArrowRight, Newspaper } from 'lucide-react';
import BlogCard from './BlogCard';

const FeaturedBlogPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { backendUrl } = useContext(AppContext);

    useEffect(() => {
        const fetchFeaturedPosts = async () => {
            if (!backendUrl) return;

            try {
                const response = await axios.get(`${backendUrl}/api/blogs`, {
                    params: {
                        page: 1,
                        limit: 3
                    }
                });

                if (response.data.success) {
                    setPosts(response.data.posts || []);
                }
            } catch (error) {
                console.error("Error fetching featured blog posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedPosts();
    }, [backendUrl]);

    if (loading) {
        return (
            <div className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Latest Career Insights</h2>
                        <p className="text-gray-600 mt-2">Loading latest articles...</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="animate-pulse bg-white rounded-xl shadow p-4">
                                <div className="h-40 bg-gray-200 rounded mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded mb-3"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (posts.length === 0) {
        return null;
    }

    return (
        <div className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Latest Career Insights</h2>
                    <p className="text-gray-600 mt-2">Stay updated with the latest trends and advice</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {posts.map(post => (
                        <BlogCard key={post._id} post={post} />
                    ))}
                </div>

                <div className="text-center">
                    <Link
                        to="/blog"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                    >
                        <Newspaper size={18} className="mr-2" />
                        Explore all articles
                        <ArrowRight size={18} className="ml-2" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default FeaturedBlogPosts;