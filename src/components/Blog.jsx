import React from 'react';
import { blogPosts } from '../data/mockData';
import { ArrowRight, Clock } from 'lucide-react';
import { Button } from './ui/button';

const Blog = () => {
  return (
    <section className="py-24 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <span className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-4" style={{ backgroundColor: '#A8D5E2', color: '#1a1a1a' }}>
              Blog
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-black">
              Explore our latest blogs for<br />real estate insights
            </h2>
          </div>
          <Button className="bg-black text-white hover:bg-black/90 rounded-full px-6 py-3 hidden md:flex items-center">
            View all
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-1 group cursor-pointer">
            <div className="relative overflow-hidden rounded-3xl mb-4 aspect-[3/2]">
              <img 
                src={blogPosts[0].image}
                alt={blogPosts[0].title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="px-2">
              <div className="flex items-center gap-3 mb-3 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{blogPosts[0].readTime}</span>
              </div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-3" style={{ backgroundColor: '#A8D5E2', color: '#1a1a1a' }}>
                {blogPosts[0].category}
              </span>
              <h3 className="text-2xl font-bold text-black mb-4 group-hover:text-gray-700 transition-colors">
                {blogPosts[0].title}
              </h3>
              <div className="flex items-center gap-3">
                <img 
                  src={blogPosts[0].authorImage}
                  alt={blogPosts[0].author}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-black text-sm">{blogPosts[0].author}</p>
                  <p className="text-xs text-gray-600">{blogPosts[0].authorRole}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {blogPosts.slice(1).map((post) => (
              <div key={post.id} className="group cursor-pointer flex gap-4">
                <div className="relative overflow-hidden rounded-2xl w-32 h-32 flex-shrink-0">
                  <img 
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="flex-1">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-2" style={{ backgroundColor: '#A8D5E2', color: '#1a1a1a' }}>
                    {post.category}
                  </span>
                  <p className="text-sm text-gray-600">{post.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blog;