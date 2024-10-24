'use client'

import { useState, useEffect } from "react"
import axios from "axios"

type Blog = {
  id: number;
  TripId: number;
  UserId: number;
  title: string;
  description: string;
  notableEvents: string;
  createdAt: string;
  updatedAt: string;
}

const PlanPage = () => {
  const tripId = "6";
  const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTcyOTc4MTY3OCwiZXhwIjoxNzI5Nzg1Mjc4fQ.ox9JV399aBO86zZX7Ry9tkQgnO3jmJI0Aq_VvA98OhU";

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    notableEvents: ""
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/blogs/all-blogs/${tripId}`, {
        headers: {
          "Authorization": token
        }
      });
      setBlogs(response.data.blogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generateBlog = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:3000/api/blogs/generate-blog`,
        {
          tripId: tripId,
          title: formData.title,
          notableEvents: formData.notableEvents
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": token
          }
        }
      );
      setBlogs([...blogs, response.data]);
      setSelectedBlog(response.data);
      setShowModal(false);
      setFormData({ title: "", notableEvents: "" });
    } catch (error) {
      console.error("Error generating blog:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateBlog = async () => {
    if (!selectedBlog) return;
    try {
      const response = await axios.put(
        `http://localhost:3000/api/blogs/${selectedBlog.id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": token
          }
        }
      );
      const updatedBlogs = blogs.map(blog => 
        blog.id === selectedBlog.id ? response.data : blog
      );
      setBlogs(updatedBlogs);
      setSelectedBlog(response.data);
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating blog:", error);
    }
  };

  const deleteBlog = async (blogId: number) => {
    try {
      await axios.delete(`http://localhost:3000/api/blogs/${blogId}`, {
        headers: {
          "Authorization": token
        }
      });
      const filteredBlogs = blogs.filter(blog => blog.id !== blogId);
      setBlogs(filteredBlogs);
      if (selectedBlog?.id === blogId) {
        setSelectedBlog(null);
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  // Modal Component
  const Modal = ({ show, onClose, title, children }: { 
    show: boolean; 
    onClose: () => void; 
    title: string; 
    children: React.ReactNode 
  }) => {
    if (!show) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-md mx-4">
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-orange-600">Travel Blogs</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center gap-2 transition-colors"
        >
          <span className="text-lg">+</span> Create New Blog
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left side: Blog list */}
        <div className="space-y-4">
          <div className="grid gap-4">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className={`p-6 rounded-lg border transition-all duration-200 cursor-pointer
                  ${selectedBlog?.id === blog.id 
                    ? 'border-orange-400 bg-orange-50' 
                    : 'border-orange-200 hover:border-orange-300 hover:bg-orange-50'
                  }`}
                onClick={() => setSelectedBlog(blog)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-orange-600 mb-2">{blog.title}</h3>
                    <div className="flex items-center gap-2 text-orange-500 text-sm">
                      <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData({
                          title: blog.title,
                          notableEvents: blog.notableEvents
                        });
                        setSelectedBlog(blog);
                        setShowEditModal(true);
                      }}
                      className="p-2 text-orange-600 hover:bg-orange-100 rounded-full"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Are you sure you want to delete this blog?')) {
                          deleteBlog(blog.id);
                        }
                      }}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side: Blog details */}
        <div className="rounded-lg border border-orange-200 bg-gradient-to-br from-orange-50 to-white">
          {selectedBlog ? (
            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-orange-600">
                  {selectedBlog.title}
                </h2>
                <div className="flex items-center gap-2 text-orange-500">
                  <span className="text-sm">Created by User {selectedBlog.UserId}</span>
                  <span className="text-sm">•</span>
                  <span className="text-sm">
                    {new Date(selectedBlog.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="prose prose-orange">
                <h3 className="text-xl font-semibold text-orange-600">Description</h3>
                <p className="text-orange-700 whitespace-pre-wrap">
                  {selectedBlog.description}
                </p>
              </div>

              <div className="prose prose-orange">
                <h3 className="text-xl font-semibold text-orange-600">Notable Events</h3>
                <p className="text-orange-700 whitespace-pre-wrap">
                  {selectedBlog.notableEvents}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <h3 className="text-xl font-medium text-orange-600 mb-2">
                Select a blog to view details
              </h3>
              <p className="text-orange-600">
                Click on a blog from the list to view its full details.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Creating a New Blog */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        title="Generate New Blog"
      >
        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block font-medium text-orange-600 mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="notableEvents" className="block font-medium text-orange-600 mb-2">
              Notable Events
            </label>
            <textarea
              name="notableEvents"
              id="notableEvents"
              value={formData.notableEvents}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            ></textarea>
          </div>
          <button
            onClick={generateBlog}
            disabled={isLoading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-lg px-4 py-2"
          >
            {isLoading ? 'Generating Blog...' : 'Generate Blog'}
          </button>
        </div>
      </Modal>

      {/* Modal for Editing Blog */}
      <Modal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Blog"
      >
        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block font-medium text-orange-600 mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="notableEvents" className="block font-medium text-orange-600 mb-2">
              Notable Events
            </label>
            <textarea
              name="notableEvents"
              id="notableEvents"
              value={formData.notableEvents}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            ></textarea>
          </div>
          <button
            onClick={updateBlog}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-lg px-4 py-2"
          >
            Update Blog
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default PlanPage;